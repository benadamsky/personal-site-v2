'use client';

import { MouseEvent, FocusEvent, useState } from 'react';

type Project = {
  name: string;
  detail: string;
  href?: string;
  machine?: boolean;
};

const projects: Project[] = [
  {
    name: 'Dreamwork',
    detail: 'Co-founder & CTO · Now',
    href: 'https://www.dreamworkhq.com',
    machine: true
  },
  { name: 'Branch', detail: 'Founding engineer · $15.5M raised' },
  { name: 'Freeport', detail: 'Core engineer · Warhol drop' },
  { name: 'Upwork', detail: 'Top 1% · Expert-Vetted' },
  { name: 'Kettle', detail: 'Co-founder · Online events' }
];

const signal = (element: HTMLElement, mode: 'pulse' | 'cascade') => {
  const rect = element.getBoundingClientRect();
  window.dispatchEvent(
    new CustomEvent('neural-signal', {
      detail: {
        x: rect.right,
        y: rect.top + rect.height / 2,
        mode
      }
    })
  );
};

const ProjectNodes = () => {
  const [openNode, setOpenNode] = useState<string | null>(null);

  return (
    <div className="project-nodes" aria-label="Selected work">
      {projects.map((project) => {
        const isOpen = openNode === project.name;
        const className = [
          'project-node',
          project.machine ? 'node-machine' : '',
          isOpen ? 'is-open' : ''
        ]
          .filter(Boolean)
          .join(' ');

        const handleEnter = (event: MouseEvent<HTMLElement>) =>
          signal(event.currentTarget, 'pulse');
        const handleFocus = (event: FocusEvent<HTMLElement>) =>
          signal(event.currentTarget, 'pulse');
        const handleClick = (event: MouseEvent<HTMLElement>) => {
          setOpenNode(isOpen ? null : project.name);
          signal(event.currentTarget, 'cascade');
        };

        const content = (
          <>
            <span className="node-dot" aria-hidden="true" />
            <span className="node-name">{project.name}</span>
            <span className="node-detail">{project.detail}</span>
            {project.href && <span aria-hidden="true">↗</span>}
          </>
        );

        return project.href ? (
          <a
            key={project.name}
            className={className}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleEnter}
            onFocus={handleFocus}
            onClick={handleClick}
          >
            {content}
          </a>
        ) : (
          <button
            key={project.name}
            type="button"
            className={className}
            aria-expanded={isOpen}
            onMouseEnter={handleEnter}
            onFocus={handleFocus}
            onClick={handleClick}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
};

export default ProjectNodes;
