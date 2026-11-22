import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const origin = process.env.BKR_TEST_ORIGIN ?? 'http://127.0.0.1:4391';
const browser = await chromium.launch({ executablePath: process.env.BKR_BROWSER ?? '/usr/bin/google-chrome', headless: true });
let visited = 0;
try {
  const menuLinks = ['News', 'Research & Reports', 'Events'];
  const pages = ['/en/', '/en/news/', '/en/news/?topic=india', '/en/news/?topic=world', '/en/research/', '/en/events/', '/en/approach/', '/en/about/', '/en/contact/', '/en/latest/', '/en/learn/', '/en/watch/', '/en/privacy/', '/en/refunds/', '/en/article/wifi-packet/'];
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 320, height: 800 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /content security policy/i.test(message.text())) errors.push(message.text());
    });
    for (const route of pages) {
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200, route);
      await page.locator('main h1').waitFor();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${viewport.width}px on ${route}`);
      assert.equal(await page.locator('body').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(255, 255, 255)');
      assert.equal(await page.locator('iframe').count(), 0);
      if (route === '/en/') {
        assert.equal(await page.locator('.site-header .ticker, main .browse-strip').count(), 0);
        assert.deepEqual(await page.locator('.utility-links a').allTextContents(), ['Our approach', 'About', 'Contact']);
        assert.equal(await page.locator('.editorial-hero + #latest-headlines').count(), 1);
        assert.equal(await page.locator('#latest-headlines [data-slide]:visible').count(), 1);
        assert.equal(await page.locator('#latest-headlines [data-play]').isVisible(), true);
        assert.equal(await page.locator('.language-menu summary').innerText(), 'EN');
        assert.equal(await page.locator('.header-identity .language-menu').count(), 1);
        assert.equal(await page.locator('.youtube-section a').getAttribute('href'), 'https://www.youtube.com/@BlinkKnowRepeat');
        if (viewport.width <= 820) await page.locator('.mobile-menu summary').click();
        const nav = page.locator(viewport.width > 820 ? '.top-nav' : '.mobile-menu nav');
        assert(await nav.isVisible());
        assert.deepEqual(await nav.locator('a:not(.slideshow-shortcut)').allTextContents(), menuLinks);
        assert.equal(await nav.getByRole('link', { name: 'Slideshow' }).getAttribute('href'), '/en/slideshow/');
        if (viewport.width <= 820) await page.keyboard.press('Escape');
        await page.locator('.editorial-hero-photo img').evaluate(image => image.decode());
        assert.equal(await page.locator('#explainers .post-card-photo').count(), 3);
      }
      if (route.includes('?topic=')) {
        const edition = route.endsWith('india') ? 'India' : 'World';
        assert.equal(await page.locator('main h1').innerText(), edition);
        assert.deepEqual([...new Set(await page.locator('.catalog-cards .card-topic').allTextContents())], [edition]);
      }
      visited++;
      if (process.env.BKR_SCREENSHOT && route === '/en/') await page.screenshot({ path: `/tmp/blink-home-${viewport.width}.png` });
    }
    await page.getByRole('button', { name: 'Next step' }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.getByRole('button', { name: 'Wi-Fi router' }).getAttribute('aria-pressed'), 'true');
    const menu = page.locator('.language-menu summary');
    await menu.focus();
    await page.keyboard.press('Enter');
    await page.locator('.language-menu [data-locale="hi"]').click();
    assert.equal(new URL(page.url()).pathname, '/hi/article/wifi-packet/');
    assert.match(await page.locator('h1').innerText(), /भेजें/);
    assert.equal(await page.locator('html').getAttribute('lang'), 'hi');
    await page.goto(`${origin}/hi/search/?q=${encodeURIComponent('पैकेट')}`);
    await page.locator('main').getByRole('link', { name: /भेजें दबाते/ }).first().waitFor();
    for (const [locale, heading] of [['gu', /મોકલો/], ['mr', /पाठवा/], ['ur', /[\u0600-\u06ff]/u]]) {
      await page.goto(`${origin}/${locale}/article/wifi-packet/`);
      assert.match(await page.locator('h1').innerText(), heading);
    }
    assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
    assert.equal(await page.locator('main article h1').count(), 1);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
    await menu.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    assert.equal(await menu.evaluate(node => node === document.activeElement), true);
    assert.equal(await page.locator('.language-menu[open]').count(), 0);
    assert.deepEqual(errors, []);
    await page.close();
  }

  const base = await browser.newPage({ viewport: { width: 320, height: 800 }, reducedMotion: 'reduce' });
  await base.goto(origin + '/en/');
  const locales = await base.locator('[data-locale]').evaluateAll(links => links.map(link => link.dataset.locale));
  assert.equal(locales.length, 23);
  for (const locale of locales) {
    const response = await base.goto(`${origin}/${locale}/`);
    assert.equal(response.status(), 200, `Locale failed ${locale}`);
    await base.locator('.language-menu summary').click();
    const menu = await base.locator('.languages').boundingBox();
    assert(menu && menu.x >= 0 && menu.x + menu.width <= 321, `Language picker overflow for ${locale}`);
    assert(await base.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Homepage overflow for ${locale}`);
    if (locale === 'en') continue;
    assert.notEqual(await base.locator('.top-nav a:not(.slideshow-shortcut)').first().textContent(), 'News', `Untranslated navigation for ${locale}`);
    assert.notEqual(await base.locator('#latest-title').textContent(), 'Latest news', `Untranslated headlines for ${locale}`);
    assert.notEqual(await base.locator('.footer-brand p').textContent(), 'Understand the world. One blink at a time.', `Untranslated footer for ${locale}`);
    assert.notEqual(await base.locator('.youtube-section p').textContent(), 'Short videos on technology, business, and world affairs.', `Untranslated YouTube section for ${locale}`);
  }
  await base.setViewportSize({ width: 1280, height: 900 });
  for (const [locale, script] of [['hi', /[\u0900-\u097f]/u], ['gu', /[\u0a80-\u0aff]/u], ['mr', /[\u0900-\u097f]/u], ['ur', /[\u0600-\u06ff]/u]]) {
    for (const path of ['post/gaganyaan-g1-launch-timing/', 'privacy/', 'events/', 'contact/', 'research/']) {
      await base.goto(`${origin}/${locale}/${path}`);
      assert.match(await base.locator('main h1').innerText(), script, `${locale}/${path}`);
      for (const paragraph of await base.locator('main p:not(.sr-only)').allTextContents()) {
        if (paragraph.trim().length > 45) assert.match(paragraph, script, `Untranslated copy on ${locale}/${path}: ${paragraph}`);
      }
    }
  }
  const slider = await browser.newPage({ reducedMotion: 'no-preference' });
  await slider.goto(origin + '/en/');
  const first = await slider.locator('[data-slide]:visible').getAttribute('data-slide');
  await slider.waitForFunction(original => document.querySelector('[data-slide]:not([hidden])')?.getAttribute('data-slide') !== original, first);
  const feed = await slider.request.get(origin + '/api/headlines?locale=en').then(response => response.json());
  const breaking = { ...feed[0], title: 'New headline from this edition', href: '/en/article/live-test/' };
  await slider.route('**/api/headlines?locale=en', route => route.fulfill({ json: [breaking, ...feed], headers: { ETag: '"test-edition"' } }));
  await slider.locator('[data-slide]:visible').getByRole('link', { name: breaking.title }).waitFor();
  await slider.locator('#latest-headlines [data-toggle]').click();
  assert.equal(await slider.locator('#latest-headlines [data-play]').isVisible(), true);
  const edition = await slider.request.get(origin + '/api/headlines?locale=hi');
  assert.match((await edition.json())[0].title, /[\u0900-\u097f]/u);
  const unchanged = await slider.request.get(origin + '/api/headlines?locale=hi', { headers: { 'If-None-Match': edition.headers().etag } });
  assert.equal(unchanged.status(), 304);
  const day = await slider.request.get(origin + '/api/headlines?locale=en&window=day').then(response => response.json());
  assert(Array.isArray(day.items));
  if (day.last24Hours) assert(day.items.every(story => Date.parse(story.date) >= Date.now() - 86_405_000 && Date.parse(story.date) <= Date.now()));
  await slider.locator('.top-nav .slideshow-shortcut').click();
  const presentation = slider.locator('.presentation-dialog[open]');
  await presentation.waitFor();
  assert((await presentation.boundingBox()).height >= slider.viewportSize().height);
  assert.equal(await presentation.locator('.presentation-home img').getAttribute('src'), '/logo.webp');
  const clock = await presentation.locator('[data-site-clock]').getAttribute('datetime');
  await slider.waitForFunction(previous => document.querySelector('.presentation-dialog [data-site-clock]').dateTime !== previous, clock);
  await slider.close();

  const latest = await base.request.get(origin + '/api/latest/?locale=en');
  assert.equal(latest.status(), 200);
  const cached = await base.request.get(origin + '/api/latest/?locale=en', { headers: { 'If-None-Match': latest.headers().etag } });
  assert.equal(cached.status(), 304);
  const admin = await base.request.get(origin + '/admin/');
  assert.equal(admin.status(), 403);
  assert.match(admin.headers()['cache-control'], /no-store/);
  const auth = await base.request.get(origin + '/api/auth/get-session');
  assert.equal(auth.status(), 503);
  const denied = await base.request.post(origin + '/admin/', { form: { action: 'fixture' } });
  assert.equal(denied.status(), 403);
  for (const path of ['/sitemap.xml', '/en/rss.xml']) {
    const response = await base.request.get(origin + path);
    assert.equal(response.status(), 200);
    assert.match(response.headers()['content-type'], /xml/);
    assert(!String(await response.text()).includes('wifi-packet'), 'Demo leaked into indexing feed');
  }
  const storyboard = await base.request.get(origin + '/api/storyboard/gu/wifi-packet');
  assert.equal(storyboard.status(), 200);
  assert.match(storyboard.headers()['content-disposition'], /storyboard.json/);
  assert.equal((await storyboard.json()).language, 'gu');
  const unavailableStoryboard = await base.request.get(origin + '/api/storyboard/ur/wifi-packet');
  assert.equal(unavailableStoryboard.status(), 404);
  const noScript = await browser.newPage({ javaScriptEnabled: false });
  await noScript.goto(origin + '/en/article/wifi-packet/');
  await noScript.getByRole('heading', { name: 'Wi-Fi is the first hop' }).waitFor();
  await noScript.goto(origin + '/en/news/?topic=india');
  await noScript.getByRole('searchbox', { name: 'Keyword' }).fill('Gaganyaan');
  await noScript.getByRole('button', { name: 'Search', exact: true }).click();
  assert.equal(await noScript.locator('main h1').innerText(), 'India');
  assert.equal(await noScript.locator('.catalog-cards .post-card').count(), 1);
  assert.match(await noScript.locator('.catalog-cards h2').innerText(), /Gaganyaan/);
  const visit = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await visit.goto(origin + '/en/');
  const notice = visit.locator('#cookie-notice');
  await notice.waitFor();
  assert.deepEqual(await visit.context().cookies(), []);
  await visit.locator('.language-menu summary').click();
  await visit.locator('.language-menu [data-locale="hi"]').click();
  await visit.waitForURL('**/hi/');
  assert.deepEqual(await visit.context().cookies(), [], 'A language choice before consent must stay unsaved.');
  assert.notEqual(await notice.locator('[data-cookie-reject]').textContent(), 'Reject Non-Essential Cookies');
  await notice.locator('[data-cookie-reject]').click();
  assert.deepEqual((await visit.context().cookies()).map(cookie => [cookie.name, cookie.value]), [['bkr_consent', 'v1.00']]);
  await visit.goto(origin + '/');
  await visit.waitForURL('**/en/');
  assert.equal(await notice.isVisible(), false);
  await visit.locator('#explainers [data-bookmark-card]').first().click();
  const preferences = visit.locator('#cookie-preferences');
  await preferences.waitFor();
  assert.equal(await visit.evaluate(() => localStorage.getItem('bkr_saved')), null);
  assert.equal(await preferences.getByRole('checkbox', { name: /Preferences/ }).isChecked(), false);
  await preferences.getByRole('checkbox', { name: /Preferences/ }).check();
  await preferences.getByRole('button', { name: 'Save My Choices' }).click();
  await visit.locator('#explainers [data-bookmark-card]').first().click();
  assert.match(await visit.evaluate(() => localStorage.getItem('bkr_saved')), /what-happens-when-you-tap-send/);
  await visit.getByRole('button', { name: 'Switch theme' }).click();
  assert(await visit.evaluate(() => localStorage.getItem('bkr_theme')));
  await visit.locator('.language-menu summary').click();
  await visit.locator('.language-menu [data-locale="hi"]').click();
  await visit.waitForURL('**/hi/');
  await visit.goto(origin + '/');
  await visit.waitForURL('**/hi/');
  await visit.locator('footer [data-cookie-settings]').click();
  assert.equal(await preferences.locator('input[name="external-media"]').isChecked(), false);
  await preferences.locator('[data-cookie-reject]').click();
  assert.equal(await visit.evaluate(() => localStorage.getItem('bkr_saved')), null);
  assert.equal(await visit.evaluate(() => localStorage.getItem('bkr_theme')), null);
  assert.deepEqual((await visit.context().cookies()).map(cookie => [cookie.name, cookie.value]), [['bkr_consent', 'v1.00']]);
  await visit.close();

  const accepted = await browser.newPage();
  await accepted.goto(origin + '/en/');
  await accepted.getByRole('button', { name: 'Accept All Cookies' }).click();
  assert.deepEqual((await accepted.context().cookies()).map(cookie => [cookie.name, cookie.value]), [['bkr_consent', 'v1.11']]);
  await accepted.locator('footer [data-cookie-settings]').click();
  assert.equal(await accepted.getByRole('checkbox', { name: /External media/ }).isChecked(), true);
  await accepted.keyboard.press('Escape');
  assert.equal(await accepted.getByRole('dialog').isVisible(), false);
  await accepted.close();

  await base.goto(origin + '/en/news/');
  const covers = new Set(await base.locator('.post-card-link').evaluateAll(links => links.map(link => link.getAttribute('href'))));
  await base.goto(origin + '/en/');
  for (const link of await base.locator('#explainers .post-card-link').evaluateAll(links => links.map(link => link.getAttribute('href')))) covers.add(link);
  assert.equal(covers.size, 8);
  for (const link of covers) {
    const response = await base.goto(origin + link);
    assert.equal(response.status(), 200);
    const cover = base.locator('.post-hero .story-cover-image');
    const image = cover.locator('.story-cover-photo');
    const logo = cover.locator('.story-cover-logo');
    await image.evaluate(element => element.decode());
    await logo.evaluate(element => element.decode());
    const frame = await cover.boundingBox();
    const mark = await logo.boundingBox();
    assert(mark.y - frame.y < 16 && frame.x + frame.width - mark.x - mark.width < 16, `Logo must be top-right at ${link}`);
    assert(await base.locator('.post-hero figcaption a').first().isVisible());
  }
  await base.goto(origin + '/en/contact/');
  assert.equal(await base.getByRole('link', { name: 'blinkknowrepeat@gmail.com' }).getAttribute('href'), 'mailto:blinkknowrepeat@gmail.com');
  console.log(`PASS · ${visited} responsive page visits, 23 locales, four article editions, RTL, keyboard, five-second headline rotation, translated article bodies and policies, cookie consent and withdrawal, eight credited branded covers, public email, Unicode search, simple navigation, editorial assets, no-JS edition filtering and reading, admin denial, auth fallback, ETag, demo indexing`);
} finally {
  await browser.close();
}
