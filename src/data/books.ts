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

// Paper books on the shelf at home, in shelf order. Flip `status` to
// 'finished' as they get read. Audible titles live in audible.json, not here.
const manual: Omit<Book, 'spine'>[] = [
  { title: 'The Five Dysfunctions of a Team', author: 'Patrick Lencioni', status: 'finished' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', status: 'shelf' },
  { title: 'The Tipping Point', author: 'Malcolm Gladwell', status: 'shelf' },
  { title: 'Outliers', author: 'Malcolm Gladwell', status: 'finished' },
  { title: 'Blink', author: 'Malcolm Gladwell', status: 'shelf' },
  { title: 'The Psychology of Money', author: 'Morgan Housel', status: 'finished' },
  { title: 'The Lean Startup', author: 'Eric Ries', status: 'finished' },
  { title: 'The 10X Rule', author: 'Grant Cardone', status: 'shelf' },
  { title: 'The Bitcoin Standard', author: 'Saifedean Ammous', status: 'finished' },
  { title: 'The Challenger Sale', author: 'Matthew Dixon and Brent Adamson', status: 'finished' },
  { title: 'The World After Capital', author: 'Albert Wenger', status: 'finished' },
  { title: 'The Richest Man in Babylon', author: 'George S. Clason', status: 'finished' },
  { title: 'The Ride of a Lifetime', author: 'Robert Iger', status: 'finished' },
  { title: 'Good to Great', author: 'Jim Collins', status: 'finished' },
  { title: 'Tools of Titans', author: 'Tim Ferriss', status: 'finished' },
  { title: 'The Art of Community', author: 'Charles H. Vogl', status: 'finished' },
  { title: 'Masters of Scale', author: 'Reid Hoffman', status: 'finished' },
  { title: 'How to Become CEO', author: 'Jeffrey J. Fox', status: 'finished' },
  { title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', status: 'finished' },
  { title: 'Dune', author: 'Frank Herbert', status: 'finished' },
  { title: 'Financial Intelligence for Entrepreneurs', author: 'Karen Berman and Joe Knight', status: 'finished' },
  { title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey', status: 'finished' },
  { title: '12 Rules for Life', author: 'Jordan B. Peterson', status: 'finished' },
  { title: 'Breaking Into Venture', author: 'Allison Baum Gates', status: 'shelf' },
  { title: 'Why We Sleep', author: 'Matthew Walker', status: 'shelf' },
  { title: 'The 48 Laws of Power', author: 'Robert Greene', status: 'finished' },
  { title: 'Crushing It!', author: 'Gary Vaynerchuk', status: 'finished' },
  { title: 'Think and Grow Rich', author: 'Napoleon Hill', status: 'finished' },
  { title: 'Hooked', author: 'Nir Eyal', status: 'finished' },
  { title: 'The Prince', author: 'Niccolo Machiavelli', status: 'finished' },
  { title: 'The Cold Start Problem', author: 'Andrew Chen', status: 'finished' },
  { title: 'Atomic Habits', author: 'James Clear', status: 'finished' },
  { title: 'Meditations', author: 'Marcus Aurelius', status: 'finished' },
  { title: 'Mastery', author: 'Robert Greene', status: 'finished' },
  { title: 'Zero to One', author: 'Peter Thiel', status: 'finished' },
  { title: 'Blitzscaling', author: 'Reid Hoffman and Chris Yeh', status: 'finished' },
  { title: 'The Hard Thing About Hard Things', author: 'Ben Horowitz', status: 'finished' },
  { title: 'The Art of War', author: 'Sun Tzu', status: 'finished' },
  { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', status: 'finished' },
  { title: 'The Compound Effect', author: 'Darren Hardy', status: 'finished' },
  { title: 'Only the Paranoid Survive', author: 'Andrew S. Grove', status: 'finished' },
  { title: 'Predictably Irrational', author: 'Dan Ariely', status: 'shelf' },
  { title: 'Positioning', author: 'Al Ries and Jack Trout', status: 'finished' },
  { title: 'Mindset', author: 'Carol S. Dweck', status: 'finished' },
  { title: 'Joint Force Leadership', author: 'Mark McGinnis', status: 'shelf' },
  { title: 'The 4-Hour Workweek', author: 'Timothy Ferriss', status: 'finished' },
  { title: 'Ender\'s Game', author: 'Orson Scott Card', status: 'shelf' },
  { title: 'Influence', author: 'Robert B. Cialdini', status: 'finished' },
  { title: 'What You Do Is Who You Are', author: 'Ben Horowitz', status: 'shelf' }
];

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

/** Title without the subtitle or edition, for the wall in the room. */
export const short = (title: string) => title.replace(/:.*$/, '').replace(/\s*\(.*\)\s*$/, '').trim();

/** The ones that get a spine in the room. */
export const books: Book[] = library.slice(0, slots.length).map((b, i) => ({ ...b, spine: slots[i] }));
