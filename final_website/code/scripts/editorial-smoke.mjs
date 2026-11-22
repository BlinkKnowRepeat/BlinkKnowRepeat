import assert from 'node:assert/strict';

const site = process.env.BKR_TEST_ORIGIN ?? 'http://127.0.0.1:4392';

async function action(fields, origin = site) {
  const response = await fetch(site + '/admin/', {
    method: 'POST', headers: { Origin: origin }, body: new URLSearchParams(fields),
  });
  const text = await response.text();
  return { status: response.status, text };
}

async function article(locale = 'en', id = 'fixture-network-trip') {
  return fetch(`${site}/${locale}/article/${id}/`);
}

const admin = await fetch(site + '/admin/');
assert.equal(admin.status, 200, 'Run this against Astro development on loopback with FIXTURE_EDITOR enabled.');
assert.match(await admin.text(), /Local fixture editor/);
assert.equal((await action({ action: 'fixture' }, 'http://127.0.0.1:8000')).status, 403);
assert.equal((await article()).status, 404, 'Start with a fresh local fixture database or use an isolated checkout.');

const queued = await Promise.all([action({ action: 'fixture' }), action({ action: 'fixture' })]);
for (const result of queued) assert.match(result.text, /Fixture queued/);
for (let step = 0; step < 5; step++) {
  const result = await action({ action: 'advance' });
  assert.equal(result.status, 200);
  assert.match(result.text, /Advanced one pipeline step/);
}
const review = await fetch(site + '/admin/').then(response => response.text());
assert.match(review, /review · review/);
assert.equal((await article()).status, 404, 'A review draft must be private.');
const before = await fetch(site + '/api/latest/?locale=en').then(response => response.json());
const approvals = await Promise.all([action({ action: 'publish', id: 'fixture-network-trip' }), action({ action: 'publish', id: 'fixture-network-trip' })]);
assert.equal(approvals.filter(result => result.text.includes('Published reviewed editions.')).length, 1);
const english = await article();
assert.equal(english.status, 200);
assert.match(await english.text(), /A packet’s trip beyond the router/);
assert.match(await (await article('hi')).text(), /राउटर के आगे एक पैकेट का सफ़र/);
const published = await fetch(site + '/api/latest/?locale=en').then(response => response.json());
assert(published.version > before.version);

const corrected = await action({ action: 'correct', id: 'fixture-network-trip', summary: 'This corrected demo follows a packet from a phone through a router.', note: 'Clarified the scope of the packet journey.' });
assert.match(corrected.text, /Correction published/);
assert.match(await (await article()).text(), /Clarified the scope of the packet journey/);
assert.match(await (await article('hi')).text(), /अभी इस भाषा में उपलब्ध नहीं/);
const afterCorrection = await fetch(site + '/api/latest/?locale=en').then(response => response.json());
assert(afterCorrection.version > published.version);

assert.match((await action({ action: 'invalid-fixture' })).text, /Fixture queued/);
for (let step = 0; step < 4; step++) {
  const result = await action({ action: 'advance' });
  assert.match(result.text, /Advanced one pipeline step/);
}
const invalid = await fetch(site + '/admin/').then(response => response.text());
assert.match(invalid, /unsupported figures/);
assert.equal((await article('en', 'fixture-invalid')).status, 404);
console.log('PASS · CSRF rejection, duplicate enqueue, persistent staged review, concurrent approval, publication, correction, staleness, update cursor and invalid-claim rejection');
