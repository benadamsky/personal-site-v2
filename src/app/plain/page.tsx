import type { Metadata, Viewport } from 'next';
import { me } from '@/data/me';
import { now, history, skills, education, projects } from '@/data/work';
import { library } from '@/data/books';
import { setup } from '@/data/setup';

export const metadata: Metadata = {
  title: 'Plain',
  description: me.description,
  alternates: { canonical: '/plain' }
};

export const viewport: Viewport = {
  themeColor: '#ffffff'
};

// Everything on the site, as a document. No fonts, no scripts, one small
// stylesheet inline. Also what the résumé PDF is printed from
// (scripts/resume-pdf.sh), so the print rules below matter.
const css = `
.plain{max-width:44rem;margin:0 auto;padding:2.5rem 1.25rem 4rem;font:16px/1.55 system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;color:#000;background:#fff}
.plain h1{font-size:1.75rem;margin:0}
.plain h2{font-size:1.15rem;margin:2.2rem 0 .6rem}
.plain h3{font-size:1rem;margin:1.2rem 0 .1rem}
.plain p,.plain ul{margin:.3rem 0}
.plain ul{padding-left:1.2rem}
.plain a{color:#000}
.plain .meta{color:#555;font-size:.92rem}
.plain .lead{margin-top:.25rem;color:#333}
.plain .links a{display:inline-block;margin-right:1rem}
.plain .books li{margin:.15rem 0}
.plain .back{margin-top:3rem;padding-top:1rem;border-top:1px solid #ddd;color:#555;font-size:.92rem}
@media print{
  @page{margin:.6in}
  .plain{max-width:none;padding:0;font-size:10.5pt;line-height:1.4}
  .plain a{text-decoration:none}
  .plain h2{margin:1.1rem 0 .3rem;font-size:12pt}
  .plain h3{margin:.7rem 0 0;font-size:10.5pt;break-after:avoid}
  .plain ul{margin:.15rem 0}
  .plain li{break-inside:avoid}
  .plain .noprint{display:none!important}
}
`;

const Plain = () => (
  <main className="plain">
    <style>{css}</style>
    <header>
      <h1>{me.name}</h1>
      <p className="lead">{me.title}</p>
      <p className="links">
        <a href={`mailto:${me.email}`}>{me.email}</a>
        {me.links.map((l) => (
          <a key={l.url} href={l.url}>
            {l.name}
          </a>
        ))}
        <a className="noprint" href="/resume.pdf">
          Résumé (PDF)
        </a>
      </p>
    </header>

    <section>
      <h2>Now</h2>
      <h3>
        {now.role}, {now.project} <span className="meta">({now.company})</span>
      </h3>
      <p className="meta">{now.dates}</p>
      {now.lines.map((l) => (
        <p key={l}>{l}</p>
      ))}
      <p>
        <a href={now.url}>{now.url.replace('https://', '')}</a>
      </p>
    </section>

    <section>
      <h2>Before that</h2>
      {history.map((j) => (
        <article key={j.company}>
          <h3>
            {j.role}, {j.company}
          </h3>
          <p className="meta">
            {j.dates}
            {j.blurb ? ` · ${j.blurb}` : ''}
          </p>
          <ul>
            {j.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>

    <section>
      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.name}>
            <a href={p.url}>{p.name}</a>: {p.line}
          </li>
        ))}
      </ul>
    </section>

    <section>
      <h2>Skills</h2>
      <p>{skills.join(' · ')}</p>
    </section>

    <section>
      <h2>Education</h2>
      <p>{education.line}</p>
      <p className="meta">
        {education.school}, {education.dates}
      </p>
    </section>

    <section className="noprint books">
      <h2>On the shelf</h2>
      <p className="meta">Synced from Audible.</p>
      {(['listening', 'finished', 'shelf'] as const).map((status) => {
        const list = library.filter((b) => b.status === status);
        if (list.length === 0) return null;
        const head = status === 'listening' ? 'Listening now' : status === 'finished' ? 'Finished' : 'Not started yet';
        return (
          <div key={status}>
            <h3>{head}</h3>
            <ul>
              {list.map((b) => (
                <li key={b.title}>
                  {b.title} <span className="meta">{b.author}</span>
                  {status === 'listening' && b.percent ? <span className="meta">, {b.percent}%</span> : null}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>

    <section className="noprint">
      <h2>On the desk</h2>
      <ul>
        {setup.map((g) => (
          <li key={g.id}>
            {g.label}: <a href={g.url}>{g.name}</a>
          </li>
        ))}
      </ul>
    </section>

    <p className="back noprint">
      {/* a plain anchor on purpose: <Link> would pull the router onto a page that has no scripts */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      There is also <a href="/">the room</a>, which is the same information with a cat in it.
    </p>
  </main>
);

export default Plain;
