import type { Metadata, Viewport } from 'next';
import Shell, { Ext, Row, rich } from '@/components/plain/Shell';
import { me } from '@/data/me';
import { now, history, education, projects } from '@/data/work';
import { setup } from '@/data/setup';

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

export const viewport: Viewport = {
  themeColor: '#ffffff'
};

// "2022 to 2024" and "Dec 2022 - Apr 2024" both print with an en dash.
const span = (s: string) => s.replace(/ (?:to|-) /, '–');

const Home = () => (
  <Shell current="/" home>

    <div className="noprint">
      {me.intro.map((p) => (
        <p key={p}>{rich(p)}</p>
      ))}
      <p>
        You can reach me at <a href={`mailto:${me.email}`}>{me.email}</a>, or find me on{' '}
        {me.links.map((l, i) => (
          <span key={l.url}>
            {i > 0 && (i === me.links.length - 1 ? ', and ' : ', ')}
            <Ext href={l.url}>{l.name}</Ext>
          </span>
        ))}
        .
      </p>
    </div>

    <p className="print-only">
      {me.title}. {me.email}
    </p>

    <h2>Work</h2>
    <Row years={span(now.dates)} name={now.company} role={now.role} what={`${now.blurb}.`} url={now.url} blurb={now.blurb} />
    {history.map((j) => (
      <Row key={j.company} years={span(j.years)} dates={span(j.dates)} name={j.company} role={j.role} what={j.line} url={j.url} blurb={j.blurb} bullets={j.bullets} />
    ))}

    <h2>Projects</h2>
    {projects.map((p) => (
      <Row key={p.name} name={p.name} what={`${p.line}.`} url={p.url} />
    ))}

    <h2>Education</h2>
    <p>
      {education.line}
      <br />
      <span className="muted">
        {education.school}, {span(education.dates)}
      </span>
    </p>

    <div className="noprint">
      <h2>On my desk</h2>
      <ul>
        {setup.map((g) => (
          <li key={g.id}>
            <Ext href={g.url}>{g.name}</Ext> <span className="muted">{g.label}</span>
          </li>
        ))}
      </ul>
    </div>
  </Shell>
);

export default Home;
