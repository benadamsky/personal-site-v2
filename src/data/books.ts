// TODO(ben): replace with your real shelf. Spine order matches the bookshelf
// in the hero image, left to right, top shelf first.
export interface Book {
  title: string;
  author: string;
  note?: string;
}

export const books: Book[] = [
  { title: 'Placeholder One', author: 'Author' },
  { title: 'Placeholder Two', author: 'Author' },
  { title: 'Placeholder Three', author: 'Author' },
  { title: 'Placeholder Four', author: 'Author' },
  { title: 'Placeholder Five', author: 'Author' },
  { title: 'Placeholder Six', author: 'Author' }
];
