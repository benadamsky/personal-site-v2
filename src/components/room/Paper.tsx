import { history } from '@/data/work';
export default function Paper() {
  return (
    <div className="paper">
      <h2 id="room-panel-title" className="paper__head">
        before that
      </h2>
      {history.map((j) => (
        <section className="paper__row" key={j.company}>
          <h3 className="paper__co">{j.company}</h3>
          <p className="paper__yrs">
            {j.role} · {j.years}
          </p>
          <p className="paper__line">{j.line}</p>
        </section>
      ))}
      <p>
        <a className="paper__pdf" href="/text">
          the full story, in plain text
        </a>
      </p>
      <p>
        <a className="paper__pdf" href="/resume.pdf">
          résumé pdf
        </a>
      </p>
    </div>
  );
}
