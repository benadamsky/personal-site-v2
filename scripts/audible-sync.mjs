// Pull the Audible library through the unofficial audible-cli and cache the
// parts the shelf needs in src/data/audible.json. One-time setup (Ben does
// this himself, it asks for the Amazon login):
//   uv tool install audible-cli
//   audible quickstart
// Then, whenever the shelf should refresh (CI does this daily, see
// .github/workflows/audible-sync.yml):
//   node scripts/audible-sync.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';

const bin = process.env.AUDIBLE_BIN || path.join(homedir(), '.local/bin/audible');
// Password for an encrypted auth file (CI); omit locally if the file is plain.
const pw = process.env.AUDIBLE_AUTH_PASSWORD ? ['-p', process.env.AUDIBLE_AUTH_PASSWORD] : [];
const dir = mkdtempSync(path.join(tmpdir(), 'audible-'));
const raw = path.join(dir, 'library.json');
execFileSync(bin, [...pw, 'library', 'export', '-f', 'json', '-o', raw], { stdio: 'inherit' });

const month = (iso) =>
  iso && iso !== '-'
    ? new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : undefined;

const items = JSON.parse(readFileSync(raw, 'utf8'))
  .filter((i) => !(i.genres || '').includes('Podcast') && Number(i.runtime_length_min) > 0)
  .map((i) => {
    const pct = Math.round(Number(i.percent_complete) || 0);
    const status = i.is_finished ? 'finished' : pct > 0 ? 'listening' : 'shelf';
    return {
      asin: i.asin,
      title: i.title,
      author: (i.authors || '').split(',')[0].trim(),
      status,
      percent: status === 'listening' ? pct : undefined,
      // Audible does not expose a completion date; the month it was added is
      // the closest honest stand-in.
      finished: status === 'finished' ? month(i.date_added) : undefined,
      added: i.date_added
    };
  });

const rank = { listening: 0, finished: 1, shelf: 2 };
items.sort((a, b) => rank[a.status] - rank[b.status] || (b.added > a.added ? 1 : -1));

const out = path.resolve('src/data/audible.json');
writeFileSync(out, JSON.stringify(items, null, 2) + '\n');
console.log(`${items.length} titles -> ${path.relative(process.cwd(), out)}`);
console.log(
  `listening ${items.filter((i) => i.status === 'listening').length}, finished ${items.filter((i) => i.status === 'finished').length}, unstarted ${items.filter((i) => i.status === 'shelf').length}`
);
