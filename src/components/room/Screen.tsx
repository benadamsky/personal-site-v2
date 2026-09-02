import { now } from '@/data/work';

// What is on the monitor right now. Rendered over the visible part of the
// screen (to the right of his head) once the camera has pushed in.
const Screen = () => (
  <div className="screen">
    <div className="screen__bar">
      <span className="screen__tab is-on">{now.project.toLowerCase()}</span>
      <span className="screen__tab">{now.company.toLowerCase()}</span>
    </div>
    <div className="screen__body">
      <p className="screen__title">{now.project}</p>
      {now.lines.map((l) => (
        <p key={l}>{l}</p>
      ))}
      <a href={now.url} target="_blank" rel="noopener noreferrer">
        {now.url.replace('https://', '')}
      </a>
    </div>
  </div>
);

export default Screen;
