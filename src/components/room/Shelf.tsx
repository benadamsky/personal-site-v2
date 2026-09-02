'use client';
import { useState } from 'react';
import { books, Book } from '@/data/books';
import { media, spines, regions, Rect } from './scene';

interface ShelfProps {
  sw: number;
  sh: number;
  active: boolean;
}

const pct = (r: Rect): React.CSSProperties => ({
  left: `${r.x}%`,
  top: `${r.y}%`,
  width: `${r.w}%`,
  height: `${r.h}%`
});

const status = (b: Book) => {
  if (b.status === 'listening') return b.percent ? `listening now, ${b.percent}%` : 'listening now';
  if (b.status === 'finished') return b.finished ? `finished ${b.finished}` : 'finished';
  return null;
};

// When the shelf is in focus, the reading list is written on the wall beside
// it. Hovering a line pulls that book's spine out an inch; choosing one shows
// the note. Spines are copies of the still, so they scale with the camera.
const Shelf = ({ sw, sh, active }: ShelfProps) => {
  const [hot, setHot] = useState<number | null>(null);
  const [chosen, setChosen] = useState<number | null>(null);
  const shown = books.filter((b) => spines[b.spine]);

  return (
    <>
      {shown.map((b) => {
        const r = spines[b.spine];
        const out = hot === b.spine || chosen === b.spine;
        return (
          <button
            key={b.spine}
            className={`spine${out ? ' is-out' : ''}${active ? ' is-live' : ''}`}
            style={{
              ...pct(r),
              backgroundImage: `url(${media.detail})`,
              backgroundSize: `${sw}px ${sh}px`,
              backgroundPosition: `${-(r.x / 100) * sw}px ${-(r.y / 100) * sh}px`
            }}
            aria-label={b.title}
            tabIndex={active ? 0 : -1}
            onPointerEnter={() => setHot(b.spine)}
            onPointerLeave={() => setHot(null)}
            onClick={(e) => {
              e.stopPropagation();
              setChosen(chosen === b.spine ? null : b.spine);
            }}
          />
        );
      })}
      <div className={`wallnote${active ? ' is-on' : ''}`} style={{ ...pct(regions.wall), fontSize: sw * 0.0115 }}>
        <p className="wallnote__head">On the shelf</p>
        <ul className="wallnote__list" onClick={(e) => e.stopPropagation()}>
          {shown.map((b) => (
            <li
              key={b.spine}
              className={`wallnote__item${hot === b.spine ? ' is-hot' : ''}${chosen === b.spine ? ' is-chosen' : ''}`}
              onPointerEnter={() => setHot(b.spine)}
              onPointerLeave={() => setHot(null)}
              onClick={() => setChosen(chosen === b.spine ? null : b.spine)}
            >
              <span className="wallnote__title">{b.title}</span>
              <span className="wallnote__author">{b.author}</span>
              {status(b) && <span className="wallnote__status">{status(b)}</span>}
              {chosen === b.spine && b.note && <span className="wallnote__note">{b.note}</span>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Shelf;
