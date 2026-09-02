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

// Books that are not on Audible (paper, Kindle, whatever). TODO(ben): fill in.
const manual: Omit<Book, 'spine'>[] = [];

// Spines that read well as "real" books, in the order we fill them.
const slots = [2, 11, 4, 14, 20, 6, 23, 9, 17, 0, 13, 22, 7, 18, 3, 12, 21, 1, 15, 19];

// Audible first (most recently active first, listening-now on top), then the
// manual list. Notes from `notes` are matched by title.
const notes: Record<string, string> = {
  // 'Exact Title': 'One sentence on why it mattered.'
};

const fromAudible: Omit<Book, 'spine'>[] = (audible as AudibleBook[]).map((a) => ({
  title: a.title,
  author: a.author,
  status: a.status,
  percent: a.percent,
  finished: a.finished
}));

export interface AudibleBook {
  asin: string;
  title: string;
  author: string;
  status: 'listening' | 'finished' | 'shelf';
  percent?: number;
  finished?: string;
  added: string;
}

export const books: Book[] = [...fromAudible, ...manual].slice(0, slots.length).map((b, i) => ({
  ...b,
  spine: slots[i],
  note: b.note ?? notes[b.title]
}));
