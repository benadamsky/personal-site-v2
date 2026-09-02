<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes

- `.env.agents` (gitignored) holds keys for agents to use during development,
  e.g. `FAL_KEY` for video generation. Never import it from app code or ship it.
- Scene assets are generated with the Codex CLI image tool (`~/.local/bin/codex exec`),
  masters live outside the repo; `public/room.jpg` is the shipped still.
- The shelf reads `src/data/audible.json`, written by `node scripts/audible-sync.mjs`
  (unofficial audible-cli; Ben runs `audible quickstart` once himself, never an agent).
- Hotspot geometry is in `src/components/room/scene.ts`, in percent of the image.
- Splash video is a set of event clips in `public/clips/`, each starting and ending
  on the master still, chained at random by `ClipPlayer`. Generate new ones with
  `node scripts/room-clips.mjs <master.png> <work-dir> [clipId ...]` (fal.ai, Seedance 1.5 Pro).
  Every clip dissolves from/to a shared rest frame (`hero/rest.png`, outside the repo) that
  is a frame from the idle clip body, gain-matched to the body mean. If the master changes,
  regenerate all clips, then re-derive rest.png from the new idle clip before pass 2.
  See `scripts/clip-normalize.sh` for why (Seedance tone ramp).
