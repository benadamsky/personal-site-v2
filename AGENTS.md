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
- Hotspot geometry is in `src/components/room/scene.ts`, in percent of the image.
