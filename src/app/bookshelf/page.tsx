import type { Metadata, Viewport } from 'next';
import { Fragment } from 'react';
import Shell from '@/components/plain/Shell';
import { library } from '@/data/books';

export const metadata: Metadata = {
  title: 'Bookshelf',
  alternates: { canonical: '/bookshelf' }
};

export const viewport: Viewport = {
  themeColor: '#ffffff'
};

const heads = { listening: 'Listening now', finished: 'Finished', shelf: 'Not started' } as const;

const Bookshelf = () => (
  <Shell current="/bookshelf">
    <h1>Bookshelf</h1>
    {(['listening', 'finished', 'shelf'] as const).map((status) => {
      const list = library.filter((b) => b.status === status);
      if (list.length === 0) return null;
      return (
        <Fragment key={status}>
          <h3>{heads[status]}</h3>
          <ul>
            {list.map((b) => (
              <li key={b.title}>
                {b.title} <span className="muted">{b.author}</span>
                {status === 'listening' && b.percent ? <span className="muted">, {b.percent}%</span> : null}
              </li>
            ))}
          </ul>
        </Fragment>
      );
    })}
  </Shell>
);

export default Bookshelf;
