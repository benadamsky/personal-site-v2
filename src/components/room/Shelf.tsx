'use client';
import { books, bookStatus, bookUrl, reading } from '@/data/books';
import { spines } from './scene';

export function ShelfSpines({ highlighted }: { highlighted: number | null }) {
  const r = highlighted === null ? undefined : spines[highlighted];
  if (!r) return null;
  return (
    <div
      className="spine-highlight"
      aria-hidden="true"
      style={{
        left: `${r.x}%`,
        top: `${r.y}%`,
        width: `${r.w}%`,
        height: `${r.h}%`
      }}
    />
  );
}

export default function Shelf({
  onHighlight
}: {
  onHighlight: (spine: number | null) => void;
}) {
  return (
    <div className="wallnote">
      <h2 id="room-panel-title" className="wallnote__head">
        on the shelf
      </h2>
      <ul className="wallnote__list">
        {books.map((b) => (
          <li key={b.spine} className="wallnote__item">
            <a
              href={bookUrl(b) ?? '/text#reading'}
              target={b.asin ? '_blank' : undefined}
              rel={b.asin ? 'noopener noreferrer' : undefined}
              onPointerEnter={() => onHighlight(b.spine)}
              onPointerLeave={() => onHighlight(null)}
              onFocus={() => onHighlight(b.spine)}
              onBlur={() => onHighlight(null)}
            >
              <span className="wallnote__title">{b.title}</span>
              <span className="wallnote__author">{b.author}</span>
              <span className="wallnote__status">{bookStatus(b)}</span>
            </a>
            {b.note && <p className="wallnote__note">{b.note}</p>}
          </li>
        ))}
      </ul>
      <p className="wallnote__all">
        <a href="/text#reading">all {reading.length} books</a>
      </p>
    </div>
  );
}
