## personal-site-v2

Live at [benadamsky.com](https://benadamsky.com/).

The root is a plain document: no fonts, one small stylesheet, blue links,
a short nav down the left (About, Bookshelf, My room). `/bookshelf` is the
reading list. `/room` is the same information as a painted room you can look around in;
the bookshelf, the monitor, the sheet on the pinboard, and the cat each do
something. "My room" in the nav opens it, and the name in the corner of the room comes back.

- `src/components/room/` is the room. `scene.ts` holds every hotspot in
  percent of the image.
- `src/data/` is the content: `me.ts`, `work.ts`, `setup.ts`, and
  `books.ts`, which reads `audible.json`.
- `scripts/` regenerate assets. `audible-sync.mjs` refreshes the shelf (CI
  runs it daily from `main`), `resume-pdf.sh` prints `public/resume.pdf` from
  the root page, the rest make clips and sounds through fal.ai.

```
yarn dev
yarn build && yarn start
yarn lint && yarn typecheck
```
