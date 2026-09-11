import audible from './audible.json';

// Index into `spines` in scene.ts (left to right, top shelf first). Spines
// without a book are just books.
export interface Book {
  spine: number;
  asin?: string;
  title: string;
  author: string;
  status?: 'listening' | 'finished' | 'shelf';
  percent?: number;
  note?: string;
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

const fromAudible: Omit<Book, 'spine'>[] = (audible as AudibleBook[]).map(
  (a) => ({
    asin: a.asin,
    title: a.title,
    author: a.author,
    status: a.status,
    percent: a.percent
  })
);

export interface AudibleBook {
  asin: string;
  title: string;
  author: string;
  status: 'listening' | 'finished' | 'shelf';
  percent?: number;
  added: string;
}

export const reading: Omit<Book, 'spine'>[] = [...fromAudible, ...manual].map(
  (b) => ({
    ...b,
    note: b.note ?? notes[b.title]
  })
);

export const books: Book[] = reading
  .slice(0, slots.length)
  .map((b, i) => ({ ...b, spine: slots[i] }));

export const bookStatus = (b: Pick<Book, 'status' | 'percent'>) =>
  b.status === 'listening'
    ? `in progress${b.percent ? ` · ${b.percent}%` : ''}`
    : b.status === 'finished'
      ? 'finished'
      : 'on the shelf';

export const bookUrl = (b: Pick<Book, 'asin'>) =>
  b.asin
    ? `https://www.audible.com/pd/${encodeURIComponent(b.asin)}`
    : undefined;
