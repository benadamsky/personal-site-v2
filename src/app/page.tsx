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
.plain{max-width:40rem;margin:auto;padding:2rem;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;font-size:1em;line-height:1.5em;color:#222;background:#fff}
.plain h1{font-size:1.6em;color:#111}
.plain h2{font-size:1.3em;margin:1.3em 0 .2em;color:#111}
.plain h3{font-size:1.1em;margin:1.1em 0 0;color:#111}
.plain p{margin:.5em 0 1em}
.plain ul{padding-left:20px}
.plain li{margin:.5em 0 .66em}
.plain a{color:#0074D9}
.plain .muted{color:#777}
.plain hr{border:0;border-top:1px solid #eee;width:75%;margin:2em auto}
.plain .print-only{display:none}
@media print{
  .plain .print-only{display:block}
  @page{margin:.6in}
  .plain{max-width:none;padding:0;font-size:10.5pt;line-height:1.4}
  .plain a{color:#222;text-decoration:none}
  .plain h2{margin:1em 0 .2em;font-size:12pt}
  .plain h3{margin:.8em 0 0;font-size:10.5pt;break-after:avoid}
  .plain p{margin:.2em 0 .5em}
  .plain li{margin:.15em 0;break-inside:avoid}
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

const Plain = () => (
  <main className="plain">
    <style>{css}</style>
    <h1>{me.name}</h1>

    <div className="noprint">
      <p>
        <Link href="/room">My room</Link>
      </p>
      <p>{rich(me.line)}</p>
      <p>
        Email <a href={`mailto:${me.email}`}>{me.email}</a>
        {me.links.map((l) => (
          <Fragment key={l.url}>
            {' · '}
            <a href={l.url}>{l.name}</a>
          </Fragment>
        ))}
        {' · '}
        <a href="/resume.pdf">Resume (PDF)</a>
      </p>
    </div>

    <p className="print-only">
      {me.title}. {me.email}
    </p>

    <h2>Work</h2>

    <h3>
      <a href={now.url}>{now.company}</a>
    </h3>
    <p className="muted">
      {now.role}, {now.dates}. {now.blurb}.
    </p>

    {history.map((j) => (
      <Fragment key={j.company}>
        <h3>{j.url ? <a href={j.url}>{j.company}</a> : j.company}</h3>
        <p className="muted">
          {j.role}, {j.dates}.{j.blurb ? ` ${j.blurb}.` : ''}
        </p>
        <ul>
          {j.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </Fragment>
    ))}

    <h2>Projects</h2>
    <ul>
      {projects.map((p) => (
        <li key={p.name}>
          <a href={p.url}>{p.name}</a>. {p.line}.
        </li>
      ))}
    </ul>

    <h2>Skills</h2>
    <p>{skills.join(', ')}.</p>

    <h2>Education</h2>
    <p>
      {education.line}, {education.school}, {education.dates}.
    </p>

    <hr className="noprint" />

    <div className="noprint">
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
                  {b.title}, {b.author}
                  {status === 'listening' && b.percent ? <span className="muted"> ({b.percent}%)</span> : null}
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
            <a href={g.url}>{g.name}</a> ({g.label})
          </li>
        ))}
      </ul>
    </div>
  </main>
);

export default Plain;
