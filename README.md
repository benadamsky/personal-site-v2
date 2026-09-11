## personal-site-v2

Live at [benadamsky.com](https://benadamsky.com/).

A painted room you can look around in. The bookshelf, the monitor, the sheet
on the pinboard, and the cat each do something. `/plain` is the same
information as a document: no scripts, no fonts, one small stylesheet. The
name in the corner of the room links to it.

- `src/components/room/` is the room. `scene.ts` holds every hotspot in
  percent of the image.
- `src/data/` is the content: `me.ts`, `work.ts`, `setup.ts`, and
  `books.ts`, which reads `audible.json`.
- `scripts/` regenerate assets. `audible-sync.mjs` refreshes the shelf (CI
  runs it daily from `main`), `resume-pdf.sh` prints `public/resume.pdf` from
  `/plain`, the rest make clips and sounds through fal.ai.

```
yarn dev
yarn build && yarn start
yarn lint && yarn typecheck
```
