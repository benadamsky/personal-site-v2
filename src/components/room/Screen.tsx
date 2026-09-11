'use client';
import { useState } from 'react';
import { projects } from '@/data/work';

export default function Screen() {
  const [selected, setSelected] = useState(0);
  const project = projects[selected];
  return (
    <div className="screen">
      <div className="screen__bar" role="group" aria-label="Projects">
        {projects.map((p, i) => (
          <button
            key={p.id}
            className={`screen__tab${selected === i ? ' is-on' : ''}`}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="screen__body">
        <h2 id="room-panel-title" className="screen__title">
          {project.name}
        </h2>
        <p className="screen__meta">
          {project.role} · {project.phase}
        </p>
        {project.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p>
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            visit {project.name}
          </a>
        </p>
        {project.links.map((l) => (
          <p key={l.url}>
            <a href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          </p>
        ))}
      </div>
    </div>
  );
}
