import { history } from '@/data/work';

// The sheet pinned to the board: everything before now, one line each.
// Later sheets on the same board can be writing.
const Paper = () => (
  <div className="paper">
    <p className="paper__head">Before Dreamwork</p>
    {history.map((j) => (
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
