'use client';
import { useState } from 'react';
import { books } from '@/data/books';
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

// Spines that are real books slide out an inch on hover and, when chosen,
// write a note on the wall beside the shelf. Lives inside the scene so it
// scales with the camera.
const Shelf = ({ sw, sh, active }: ShelfProps) => {
  const [chosen, setChosen] = useState<number | null>(null);
  const book = books.find((b) => b.spine === chosen);

  return (
    <>
      {books.map((b) => {
        const r = spines[b.spine];
        if (!r) return null;
        return (
          <button
            key={b.spine}
            className={`spine${chosen === b.spine ? ' is-chosen' : ''}${active ? ' is-live' : ''}`}
            style={{
              ...pct(r),
              backgroundImage: `url(${media.detail})`,
              backgroundSize: `${sw}px ${sh}px`,
              backgroundPosition: `${-(r.x / 100) * sw}px ${-(r.y / 100) * sh}px`
            }}
            aria-label={b.title}
            tabIndex={active ? 0 : -1}
            onClick={(e) => {
              e.stopPropagation();
              setChosen(chosen === b.spine ? null : b.spine);
            }}
          >
            {/* printed on the spine, reads bottom to top like a real book */}
            <span className="spine__title" style={{ fontSize: sw * 0.0105 }}>
              {b.title}
            </span>
          </button>
        );
      })}
      <div className={`wallnote${book && active ? ' is-on' : ''}`} style={pct(regions.wall)}>
        {book && (
          <>
            <p className="wallnote__title">{book.title}</p>
            <p className="wallnote__author">{book.author}</p>
            {book.note && <p className="wallnote__note">{book.note}</p>}
          </>
        )}
      </div>
    </>
  );
};

export default Shelf;
