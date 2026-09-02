import { books } from '@/data/books';

const BooksPanel = () => (
  <>
    <h1>On the shelf</h1>
    <div className="shelf">
      {books.map((b) => (
        <div key={b.title}>
          <h2>{b.title}</h2>
          <p className="dim">{b.author}</p>
          {b.note && <p>{b.note}</p>}
        </div>
      ))}
    </div>
  </>
);

export default BooksPanel;
