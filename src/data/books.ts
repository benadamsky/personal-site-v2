// TODO(ben): replace with your real shelf. Index matches `spines` in
// scene.ts (left to right, top shelf first). Spines without an entry are
// just books.
export interface Book {
  spine: number;
  title: string;
  author: string;
  note?: string;
}

export const books: Book[] = [
  { spine: 2, title: 'Placeholder title', author: 'Author', note: 'One sentence on why it mattered.' },
  { spine: 4, title: 'Placeholder title', author: 'Author' },
  { spine: 6, title: 'Placeholder title', author: 'Author' },
  { spine: 11, title: 'Placeholder title', author: 'Author' },
  { spine: 14, title: 'Placeholder title', author: 'Author' },
  { spine: 20, title: 'Placeholder title', author: 'Author' },
  { spine: 23, title: 'Placeholder title', author: 'Author' }
];
