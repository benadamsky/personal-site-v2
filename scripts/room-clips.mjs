// Generate the room's event clips via fal.ai. Every clip starts AND ends on the
// master still, so the player can chain them in any order with no visible cut.
// Usage: node scripts/room-clips.mjs <still.png> <work-dir> [clipId ...]
// Reads FAL_KEY from .env.agents (gitignored). Never log the key.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const STILL_RULES = [
  'Static camera, locked off, no camera movement, no zoom, no parallax.',
  'Painterly realism, keep every object exactly where it is.',
  'The man is seen only from behind; his face is never visible.',
  'His right hand stays resting on the mouse with five correct fingers and barely moves; his left hand stays hidden behind his body. No hands ever appear on the keyboard.',
  'The clip must end in exactly the same pose and state as it began.'
].join(' ');

export const CLIPS = {
  idle: {
    duration: '8',
    prompt:
      'Everything is nearly still. The candle flame flickers gently, the lamp glows steadily, soft rain falls outside the window, the cat sleeps with its side rising and falling slowly. The man sits calmly reading the screen, shoulders relaxed, breathing slowly, right hand resting on the mouse.'
  },
  work: {
    duration: '8',
    prompt:
      'The man works at the screen: his right hand nudges the mouse slightly and clicks once, his head tilts a little as he reads, shoulders relaxed. The cat sleeps, its side rising and falling. Rain falls softly outside, the candle flame flickers.'
  },
  'cat-twitch': {
    duration: '8',
    prompt:
      'The tuxedo cat stays curled up asleep on the windowsill the whole time. Its side rises and falls slowly and one ear flicks twice. Its tail stays tucked and completely still. It never lifts its head, never moves its tail, never changes position. The man stays still, right hand resting on the mouse, breathing slowly. Rain falls softly outside, the candle flame flickers.'
  },
  lean: {
    duration: '8',
    prompt:
      'The man leans back in his chair, rolls his shoulders and tilts his head side to side to stretch his neck, then leans forward again and returns to exactly his original posture with his right hand resting on the mouse. The cat sleeps, its side rising and falling. Rain falls softly outside, the candle flame flickers.'
  }
};

const [still, workDir, ...ids] = process.argv.slice(2);
if (!still || !workDir) {
  console.error('usage: node scripts/room-clips.mjs <still.png> <work-dir> [clipId ...]');
  process.exit(1);
}
const wanted = ids.length ? ids : Object.keys(CLIPS);
for (const id of wanted) if (!CLIPS[id]) throw new Error(`unknown clip ${id}`);

const env = Object.fromEntries(
  readFileSync(new URL('../.env.agents', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => l.split('=').map((s) => s.trim()))
);
const KEY = env.FAL_KEY;
if (!KEY) throw new Error('FAL_KEY missing from .env.agents');
const headers = { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' };
const MODEL = 'fal-ai/bytedance/seedance/v1.5/pro/image-to-video';

mkdirSync(workDir, { recursive: true });
const publicDir = path.resolve('public/clips');
mkdirSync(publicDir, { recursive: true });

const ext = path.extname(still).slice(1) || 'png';
const dataUrl = `data:image/${ext};base64,${readFileSync(still).toString('base64')}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const generate = async (id) => {
  const { prompt, duration } = CLIPS[id];
  const body = {
    prompt: `${prompt} ${STILL_RULES}`,
    image_url: dataUrl,
    end_image_url: dataUrl,
    duration,
    resolution: '1080p',
    aspect_ratio: '16:9',
    camera_fixed: true,
    generate_audio: false
  };
  let submit;
  for (let attempt = 1; ; attempt++) {
    submit = await fetch(`https://queue.fal.run/${MODEL}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    if (submit.ok) break;
    const text = await submit.text();
    if (submit.status === 403 && text.includes('balance') && attempt < 12) {
      console.log(`${id}: locked, retrying in 20s`);
      await sleep(20000);
      continue;
    }
    throw new Error(`${id} submit ${submit.status}: ${text}`);
  }
  const { status_url, response_url } = await submit.json();
  console.log(`${id}: queued`);
  for (;;) {
    await sleep(5000);
    const s = await (await fetch(status_url, { headers })).json();
    if (s.status === 'COMPLETED') break;
    if (s.status === 'FAILED') throw new Error(`${id} failed: ${JSON.stringify(s)}`);
  }
  const result = await (await fetch(response_url, { headers })).json();
  const url = result.video?.url;
  if (!url) throw new Error(`${id}: no video url in ${JSON.stringify(result).slice(0, 300)}`);
  const raw = path.join(workDir, `${id}.raw.mp4`);
  writeFileSync(raw, Buffer.from(await (await fetch(url)).arrayBuffer()));
  // Normalize every clip to identical encode settings so chaining is seamless.
  const out = path.join(publicDir, `${id}.mp4`);
  execSync(
    `ffmpeg -y -loglevel error -i "${raw}" -an -vf "scale=1920:1080:flags=lanczos,minterpolate=fps=48:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,format=yuv420p" ` +
      `-c:v libx264 -preset slow -crf 21 -movflags +faststart "${out}"`
  );
  console.log(`${id}: saved ${out}`);
};

const results = await Promise.allSettled(wanted.map(generate));
let failed = false;
for (const [i, r] of results.entries()) {
  if (r.status === 'rejected') {
    failed = true;
    console.error(`${wanted[i]}: ${r.reason.message}`);
  }
}
process.exit(failed ? 1 : 0);
