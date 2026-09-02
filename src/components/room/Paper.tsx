import { history } from '@/data/work';

// A sheet pulled from the desk drawer: everything before now, one line each.
const Paper = () => (
  <div className="paper">
    <p className="paper__head">
      Before Dreamwork
      <a className="paper__pdf" href="/resume.pdf">
        the formal version, as a PDF
      </a>
    </p>
    {history.map((j) => (
      <p className="paper__row" key={j.company}>
        <span className="paper__co">{j.company}</span>
        <span className="paper__yrs">{j.years}</span>
        <span className="paper__line">{j.line}</span>
      </p>
    ))}
  </div>
);

export default Paper;
