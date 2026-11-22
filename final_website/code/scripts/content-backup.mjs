import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const [mode, file, state] = process.argv.slice(2);
if (!['export', 'restore'].includes(mode) || !file) {
  console.error('Usage: node scripts/content-backup.mjs export|restore <file.json> [local-state-dir]');
  process.exit(1);
}

const tables = {
  content: 'id original_locale revision type topic demo event_at scheduled_at',
  versions: 'content_id locale revision slug title summary significance body minutes state method sources media search_text published_at updated_at',
  evidence: 'id url publisher retrieved_at source_date event_date rights provenance excerpt dedupe_key',
  glossary: 'locale term translation',
  corrections: 'id content_id revision note actor at',
};
const local = state ? ['--persist-to', resolve(state)] : [];
const options = ['d1', 'execute', 'DB', '--local', '--json', ...local];
function execute(args) {
  const result = spawnSync('node_modules/.bin/wrangler', [...options, ...args], { encoding: 'utf8', maxBuffer: 24 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || 'Local D1 execution failed.');
  return JSON.parse(result.stdout);
}
const sqlValue = value => {
  if (value === null) return 'NULL';
  if (typeof value === 'number' && Number.isSafeInteger(value)) return String(value);
  if (typeof value === 'string' && !value.includes('\0')) return "'" + value.replaceAll("'", "''") + "'";
  throw new Error('Invalid value in backup.');
};

if (mode === 'export') {
  const queries = Object.entries(tables).map(([name, columns]) => `SELECT ${columns.split(' ').join(',')} FROM ${name} ORDER BY 1,2;`);
  const results = execute(['--command', queries.join(' ')]);
  const snapshot = Object.fromEntries(Object.keys(tables).map((name, index) => [name, results[index].results]));
  mkdirSync(dirname(resolve(file)), { recursive: true });
  writeFileSync(file, JSON.stringify({ format: 1, ...snapshot }, null, 2) + '\n', { mode: 0o600 });
  console.log(`Exported ${snapshot.content.length} content records and ${snapshot.versions.length} versions.`);
} else {
  const snapshot = JSON.parse(readFileSync(file, 'utf8'));
  if (snapshot.format !== 1) throw new Error('Unsupported backup version.');
  const count = execute(['--command', Object.keys(tables).map(name => `SELECT count(*) AS count FROM ${name};`).join(' ')]);
  if (count.some(item => item.results[0].count)) throw new Error('Restore requires a fresh, migrated local database.');
  const statements = Object.entries(tables).flatMap(([name, keys]) => {
    const columns = keys.split(' ');
    if (!Array.isArray(snapshot[name])) throw new Error(`Missing table ${name}.`);
    return snapshot[name].map(row => {
      if (Object.keys(row).length !== columns.length || columns.some(column => !Object.hasOwn(row, column))) throw new Error(`Invalid columns in ${name}.`);
      return `INSERT INTO ${name}(${columns.join(',')}) VALUES(${columns.map(column => sqlValue(row[column])).join(',')});`;
    });
  });
  if (statements.length) {
    const directory = mkdtempSync(resolve(tmpdir(), 'blink-restore-'));
    try {
      const sql = resolve(directory, 'restore.sql');
      writeFileSync(sql, statements.join('\n'), { mode: 0o600 });
      execute(['--file', sql]);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }
  console.log(`Restored ${snapshot.content.length} content records and ${snapshot.versions.length} versions.`);
}
