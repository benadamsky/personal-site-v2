import type { Metadata, Viewport } from 'next';
import { Fragment } from 'react';
import Link from 'next/link';
import { me } from '@/data/me';
import { now, history, skills, education, projects } from '@/data/work';
import { library } from '@/data/books';
import { setup } from '@/data/setup';

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

export const viewport: Viewport = {
  themeColor: '#ffffff'
};

// The site, as a document. Browser defaults with a few lines on top: system
// font, one column, blue links. /room is the same information as a room you
// can look around in. Also what the resume PDF is printed from
// (scripts/resume-pdf.sh), so the print rules below matter.
const css = `
.plain{max-width:40rem;margin:auto;padding:2rem;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;font-size:1em;line-height:1.5;color:#222;background:#fff}
.plain h1{font-size:1.6em;margin:0 0 .6em;color:#111}
.plain h2{font-size:1.15em;margin:2em 0 .7em;color:#111}
.plain p{margin:0 0 .6em}
.plain a{color:#0074D9}
.plain .muted{color:#777}
.plain .links a{margin-right:.9em}
.plain .row{display:grid;grid-template-columns:6.5rem 1fr auto;column-gap:1rem;margin:0 0 1.1em}
.plain .row .yrs{color:#777;font-variant-numeric:tabular-nums}
.plain .row .co{font-weight:600;color:#111}
.plain .row .role{color:#777}
.plain .row .what{margin:.1em 0 0}
.plain .row .visit{font-size:.9em;align-self:start}
.plain .row .visit::after{content:" \\2197"}
.plain ul{margin:0;padding-left:1.2em}
.plain li{margin:0}
.plain .books h3{font-size:1em;margin:1em 0 .2em;color:#111}
.plain .print-only{display:none}
@media (max-width:520px){
  .plain{padding:1.5rem 1.25rem}
  .plain .row{grid-template-columns:1fr auto}
  .plain .row .yrs{grid-column:1/-1;font-size:.9em}
}
@media print{
  @page{margin:.6in}
  .plain{max-width:none;padding:0;font-size:10.5pt;line-height:1.4}
  .plain a{color:#222;text-decoration:none}
  .plain h2{margin:1.2em 0 .4em;font-size:12pt}
  .plain .row{margin:0 0 .8em;break-inside:avoid}
  .plain .print-only{display:block}
  .plain .noprint{display:none!important}
}
`;

// Paragraph text with [label](url) links, nothing else.
const rich = (text: string) =>
  text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    return m ? (
      <a key={i} href={m[2]}>
        {m[1]}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    );
  });

interface RowProps {
  years?: string;
  name: string;
  role?: string;
  what: string;
  url?: string;
  bullets?: string[];
}

// One role or project: years on the left, the rest on the right, a small
// "Visit" at the edge when there is somewhere to go.
const Row = ({ years, name, role, what, url, bullets }: RowProps) => (
  <div className="row">
    {years && <span className="yrs">{years}</span>}
    <div style={years ? undefined : { gridColumn: '1 / 3' }}>
      <span className="co">{name}</span>
      {role && <span className="role">, {role}</span>}
      <p className="what">{what}</p>
      {bullets && bullets.length > 0 && (
        <ul className="print-only">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </div>
    {url ? (
      <a className="visit noprint" href={url}>
        Visit
      </a>
    ) : (
      <span />
    )}
  </div>
);

const span = (years: string) => years.replace(' to ', '–');

const Plain = () => (
  <main className="plain">
    <style>{css}</style>
    <h1>{me.name}</h1>

    <div className="noprint">
      <p>
        <Link href="/room">My room</Link>
      </p>
      <p>{rich(me.line)}</p>
      <p className="links">
        <a href={`mailto:${me.email}`}>{me.email}</a>
        {me.links.map((l) => (
          <a key={l.url} href={l.url}>
            {l.name}
          </a>
        ))}
        <a href="/resume.pdf">Resume</a>
      </p>
    </div>

    <p className="print-only">
      {me.title}. {me.email}
    </p>

    <h2>Work</h2>
    <Row years={`${now.dates.split(' - ')[0]}–now`} name={now.company} role={now.role} what={`${now.blurb}.`} url={now.url} />
    {history.map((j) => (
      <Row key={j.company} years={span(j.years)} name={j.company} role={j.role} what={j.line} url={j.url} bullets={j.bullets} />
    ))}

    <h2>Projects</h2>
    {projects.map((p) => (
      <Row key={p.name} name={p.name} what={`${p.line}.`} url={p.url} />
    ))}

    <h2>Skills</h2>
    <p>{skills.join(', ')}.</p>

    <h2>Education</h2>
    <p>
      {education.line}. <span className="muted">{education.school}, {education.dates}.</span>
    </p>

    <div className="noprint books">
      <h2>Reading</h2>
      {(['listening', 'finished', 'shelf'] as const).map((status) => {
        const list = library.filter((b) => b.status === status);
        if (list.length === 0) return null;
        const head = status === 'listening' ? 'Listening now' : status === 'finished' ? 'Finished' : 'Not started';
        return (
          <Fragment key={status}>
            <h3>{head}</h3>
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

      <h2>Desk</h2>
      <ul>
        {setup.map((g) => (
          <li key={g.id}>
            <a href={g.url}>{g.name}</a> <span className="muted">{g.label}</span>
          </li>
        ))}
      </ul>
    </div>
  </main>
);

export default Plain;
