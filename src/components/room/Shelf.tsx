'use client';
import Link from 'next/link';
import { books, library, short, Book } from '@/data/books';
import { media, spines, Rect } from './scene';

const pct = (r: Rect): React.CSSProperties => ({
  left: `${r.x}%`,
  top: `${r.y}%`,
  width: `${r.w}%`,
  height: `${r.h}%`
});

const status = (b: Book) => {
  if (b.status === 'listening') return b.percent ? `${b.percent}% in` : 'listening';
  if (b.status === 'finished') return b.finished ? `finished ${b.finished}` : 'finished';
  return null;
};

export const shown = books.filter((b) => spines[b.spine]);

interface Picked {
  hot: number | null;
  chosen: number | null;
  onHot: (spine: number | null) => void;
  onChoose: (spine: number) => void;
}

interface SpinesProps extends Picked {
  sw: number;
  sh: number;
  /** Spines only respond once the camera has settled on the shelf. */
  live: boolean;
}

// Book spines are copies of the sharp still, so they scale with the camera.
// Hovering a line of the list pulls that spine out an inch.
export const Spines = ({ sw, sh, live, hot, chosen, onHot, onChoose }: SpinesProps) => (
  <>
    {shown.map((b) => {
      const r = spines[b.spine];
      const out = hot === b.spine || chosen === b.spine;
      return (
        <button
          key={b.spine}
          className={`spine${out ? ' is-out' : ''}${live ? ' is-live' : ''}`}
          style={{
            ...pct(r),
            backgroundImage: `url(${media.detail})`,
            backgroundSize: `${sw}px ${sh}px`,
            backgroundPosition: `${-(r.x / 100) * sw}px ${-(r.y / 100) * sh}px`
          }}
          aria-label={b.title}
          tabIndex={live ? 0 : -1}
          onPointerEnter={() => onHot(b.spine)}
          onPointerLeave={() => onHot(null)}
          onClick={(e) => {
            e.stopPropagation();
            onChoose(b.spine);
          }}
        />
      );
    })}
  </>
);

// The reading list. On desktop it is written on the wall beside the shelf;
// on a phone it sits in the sheet.
export const BookList = ({ hot, chosen, onHot, onChoose }: Picked) => (
  <>
    <p className="wallnote__all">
      <Link href="/bookshelf">all {library.length}, on the bookshelf page</Link>
    </p>
    <ul className="wallnote__list" onClick={(e) => e.stopPropagation()}>
      {shown.map((b) => (
      <li
        key={b.spine}
        className={`wallnote__item${hot === b.spine ? ' is-hot' : ''}${chosen === b.spine ? ' is-chosen' : ''}`}
        onPointerEnter={() => onHot(b.spine)}
        onPointerLeave={() => onHot(null)}
        onClick={() => onChoose(b.spine)}
      >
        <span>
          <span className="wallnote__title">{short(b.title)}</span>
          <span className="wallnote__author">{b.author}</span>
        </span>
        {status(b) && <span className="wallnote__status">{status(b)}</span>}
        {chosen === b.spine && b.note && <span className="wallnote__note">{b.note}</span>}
      </li>
    ))}
    </ul>
  </>
);
