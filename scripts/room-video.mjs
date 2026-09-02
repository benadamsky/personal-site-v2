// Generate the looping splash video from the master still via fal.ai.
// Usage: node scripts/room-video.mjs <still.png> <out-dir> [model]
// Reads FAL_KEY from .env.agents (gitignored). Never log the key.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const [still, outDir, modelArg] = process.argv.slice(2);
if (!still || !outDir) {
  console.error('usage: node scripts/room-video.mjs <still.png> <out-dir> [model]');
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(new URL('../.env.agents', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => l.split('=').map((s) => s.trim()))
);
const KEY = env.FAL_KEY;
if (!KEY) throw new Error('FAL_KEY missing from .env.agents');

const model = modelArg ?? 'fal-ai/bytedance/seedance/v1.5/pro/image-to-video';
mkdirSync(outDir, { recursive: true });

const prompt = [
  'Static camera, locked off, no camera movement at all.',
  'A man seen from behind types slowly on a compact keyboard; only his hands, forearms and shoulders move, small natural motions.',
  'A tuxedo cat sleeps on the windowsill, its side rising and falling with slow breaths.',
  'Gentle rain falls outside the window; a candle flame flickers softly; the lamp is steady.',
  'Everything else in the room is perfectly still. Calm, cozy, painterly, seamless ambient loop.'
].join(' ');

const b64 = readFileSync(still).toString('base64');
const ext = path.extname(still).slice(1) || 'png';
const body = {
  prompt,
  image_url: `data:image/${ext};base64,${b64}`,
  // return to the first frame so the clip loops without a visible cut
  end_image_url: `data:image/${ext};base64,${b64}`,
  duration: '10',
  resolution: '1080p',
  aspect_ratio: '16:9',
  camera_fixed: true
};

const headers = { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' };
const submit = await fetch(`https://queue.fal.run/${model}`, {
  method: 'POST',
  headers,
  body: JSON.stringify(body)
});
if (!submit.ok) throw new Error(`submit ${submit.status}: ${await submit.text()}`);
const { request_id, status_url, response_url } = await submit.json();
console.log('queued', request_id);

for (;;) {
  await new Promise((r) => setTimeout(r, 5000));
  const s = await (await fetch(status_url, { headers })).json();
  process.stdout.write(`\r${s.status} ${s.queue_position ?? ''}   `);
  if (s.status === 'COMPLETED') break;
  if (s.status === 'FAILED') throw new Error(JSON.stringify(s));
}
const result = await (await fetch(response_url, { headers })).json();
const url = result.video?.url ?? result.video_url ?? result.output?.url;
if (!url) throw new Error(`no video url in ${JSON.stringify(result).slice(0, 500)}`);
const raw = path.join(outDir, 'raw.mp4');
writeFileSync(raw, Buffer.from(await (await fetch(url)).arrayBuffer()));
console.log('\nsaved', raw);

// Seamless loop: crossfade the last second into the first second.
const dur = parseFloat(
  execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${raw}"`).toString()
);
const x = 1.0;
const loop = path.join(outDir, 'room-loop.mp4');
execSync(
  `ffmpeg -y -loglevel error -i "${raw}" -filter_complex ` +
    `"[0:v]trim=0:${dur - x},setpts=PTS-STARTPTS[a];` +
    `[0:v]trim=${dur - x}:${dur},setpts=PTS-STARTPTS[b];` +
    `[0:v]trim=0:${x},setpts=PTS-STARTPTS[c];` +
    `[b][c]xfade=transition=fade:duration=${x}:offset=0[bc];` +
    `[a]trim=${x},setpts=PTS-STARTPTS[a2];[bc][a2]concat=n=2:v=1:a=0[v]" ` +
    `-map "[v]" -an -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart "${loop}"`
);
console.log('loop', loop);
