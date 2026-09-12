import { history } from '@/data/work';

// The sheet pinned to the board: what came before, one line each. Six fit;
// the plain page and the PDF have the whole list.
// Later sheets on the same board can be writing.
const Paper = () => (
  <div className="paper">
    <p className="paper__head">Before Dreamwork</p>
    {history.slice(0, 6).map((j) => (
      <p className="paper__row" key={j.company}>
        <span className="paper__co">
          {j.company} <span className="paper__yrs">{j.years}</span>
        </span>
        <span className="paper__line">{j.line}</span>
      </p>
    ))}
    <a className="paper__pdf" href="/resume.pdf">
      the formal version, as a PDF
    </a>
  </div>
);

export default Paper;
