// Generate a short looping sound effect via fal (ElevenLabs Sound Effects v2).
// Usage: node scripts/room-sfx.mjs "<prompt>" <seconds> <out.mp3>
// Reads FAL_KEY from .env.agents (gitignored). Never log the key.
import { readFileSync, writeFileSync } from 'node:fs';

const [text, seconds, out] = process.argv.slice(2);
if (!text || !out) {
  console.error('usage: node scripts/room-sfx.mjs "<prompt>" <seconds> <out.mp3>');
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(new URL('../.env.agents', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => l.split('=').map((s) => s.trim()))
);
if (!env.FAL_KEY) throw new Error('FAL_KEY missing from .env.agents');
const headers = { Authorization: `Key ${env.FAL_KEY}`, 'Content-Type': 'application/json' };
const MODEL = 'fal-ai/elevenlabs/sound-effects/v2';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const submit = await fetch(`https://queue.fal.run/${MODEL}`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    text,
    duration_seconds: seconds ? Number(seconds) : undefined,
    loop: true,
    prompt_influence: 0.5,
    output_format: 'mp3_44100_128'
  })
});
if (!submit.ok) throw new Error(`submit ${submit.status}: ${await submit.text()}`);
const { status_url, response_url } = await submit.json();
for (;;) {
  await sleep(3000);
  const s = await (await fetch(status_url, { headers })).json();
  if (s.status === 'COMPLETED') break;
  if (s.status === 'FAILED') throw new Error(`failed: ${JSON.stringify(s)}`);
}
const result = await (await fetch(response_url, { headers })).json();
const url = result.audio?.url;
if (!url) throw new Error(`no audio url in ${JSON.stringify(result).slice(0, 300)}`);
writeFileSync(out, Buffer.from(await (await fetch(url)).arrayBuffer()));
console.log(`saved ${out}`);
