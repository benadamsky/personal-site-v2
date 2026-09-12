import audible from './audible.json';

// Index into `spines` in scene.ts (left to right, top shelf first). Spines
// without a book are just books.
export interface Book {
  spine: number;
  title: string;
  author: string;
  status?: 'listening' | 'finished' | 'shelf';
  percent?: number;
  finished?: string; // e.g. "Mar 2026"
  note?: string;
}

export interface AudibleBook {
  asin: string;
  title: string;
  author: string;
  status: 'listening' | 'finished' | 'shelf';
  percent?: number;
  finished?: string;
  added: string;
}

// Books that are not on Audible (paper, Kindle, whatever). TODO(ben): fill in.
const manual: Omit<Book, 'spine'>[] = [];

// Spines that read well as "real" books, in the order we fill them. Ten is
// about what the wall beside the shelf can hold legibly.
const slots = [2, 11, 4, 14, 20, 6, 23, 9, 17, 0];

// Audible first (most recently active first, listening-now on top), then the
// manual list. Notes from `notes` are matched by title.
const notes: Record<string, string> = {
  // 'Exact Title': 'One sentence on why it mattered.'
};

// Audible titles Ben finished off Audible (paper, Kindle), so the sync sees
// them as unstarted. Exact titles as they appear in audible.json.
const readElsewhere = new Set([
  'Read Write Own',
  'The Everything Token',
  'Thinking in Systems',
  'Traction',
  'Good Strategy/Bad Strategy',
  'The Sovereign Individual',
  'Running Lean (3rd Edition)',
  'High Growth Handbook',
  'High Output Management',
  'Never Split the Difference'
]);

const fromAudible: Omit<Book, 'spine'>[] = (audible as AudibleBook[]).map((a) =>
  readElsewhere.has(a.title)
    ? { title: a.title, author: a.author, status: 'finished' }
    : { title: a.title, author: a.author, status: a.status, percent: a.percent, finished: a.finished }
);

const rank: Record<NonNullable<Book['status']>, number> = { listening: 0, finished: 1, shelf: 2 };

/** Everything: listening now, then finished, then not started. The plain page lists all of it. */
export const library: Omit<Book, 'spine'>[] = [...fromAudible, ...manual]
  .map((b) => ({ ...b, note: b.note ?? notes[b.title] }))
  .sort((a, b) => rank[a.status ?? 'shelf'] - rank[b.status ?? 'shelf']);

/** The ones that get a spine in the room. */
export const books: Book[] = library.slice(0, slots.length).map((b, i) => ({ ...b, spine: slots[i] }));
