import { Fragment } from 'react';
import Link from 'next/link';
import { me } from '@/data/me';

// The document pages: a short nav down the left, content on the right.
// Browser defaults with a few lines on top: system font, blue links. This is
// also what the resume PDF is printed from (scripts/resume-pdf.sh), so the
// print rules matter.
const css = `
.plain{max-width:42rem;margin:auto;padding:2.5rem 2rem 4rem;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;font-size:1em;line-height:1.5;color:#222;background:#fff}
.plain header{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.4rem 1.5rem;margin:0 0 2rem}
.plain header .site{font-size:1.6em;font-weight:700;color:#111;text-decoration:none;margin:0;line-height:1.2}
.plain nav{display:flex;gap:1.2rem}
.plain nav a{color:#777;text-decoration:none}
.plain nav a:hover{color:#111}
.plain nav a.is-on{color:#111}
.plain h1{font-size:1.6em;margin:0 0 .6em;color:#111}
.plain h2{font-size:1.15em;margin:2em 0 .7em;color:#111}
.plain h3{font-size:1em;margin:1.4em 0 .3em;color:#111}
.plain p{margin:0 0 .8em}
.plain a{color:#0074D9}
.plain .muted{color:#777}
.plain .row{display:grid;grid-template-columns:6.5rem 1fr auto;column-gap:1rem;margin:0 0 1.1em}
.plain .row .yrs{color:#777;font-variant-numeric:tabular-nums}
.plain .row .co{font-weight:600;color:#111}
.plain .row .role{color:#777}
.plain .row .what{margin:.1em 0 0}
.plain .row .visit{font-size:.9em;align-self:start}
.plain .row .visit::after{content:" \\2197"}
.plain ul{margin:0;padding-left:1.2em}
.plain li{margin:0}
.plain .print-only{display:none}
@media (max-width:520px){
  .plain{padding:1.5rem 1.25rem 3rem}
  .plain .row{grid-template-columns:1fr auto}
  .plain .row .yrs{grid-column:1/-1;font-size:.9em}
}
@media print{
  @page{margin:.6in}
  .plain{max-width:none;padding:0;font-size:10.5pt;line-height:1.4}
  .plain nav{display:none}
  .plain header{margin:0 0 .6em}
  .plain a{color:#222;text-decoration:none}
  .plain h2{margin:1.2em 0 .4em;font-size:12pt}
  .plain .row{margin:0 0 .8em;break-inside:avoid}
  .plain .print-only{display:block}
  .plain .noprint{display:none!important}
}
`;

export const pages = [
  { href: '/', label: 'About' },
  { href: '/bookshelf', label: 'Bookshelf' },
  { href: '/resume.pdf', label: 'Resume', external: true },
  { href: '/room', label: 'My room' }
];

// Anything that leaves the site opens in a new tab.
export const Ext = ({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) => (
  <a href={href} className={className} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

// Paragraph text with [label](url) links, nothing else.
export const rich = (text: string) =>
  text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    return m ? (
      <Ext key={i} href={m[2]}>
        {m[1]}
      </Ext>
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
export const Row = ({ years, name, role, what, url, bullets }: RowProps) => (
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
      <Ext className="visit noprint" href={url}>
        Visit
      </Ext>
    ) : (
      <span />
    )}
  </div>
);

// `home` makes the name in the header the page's h1; other pages set their own.
const Shell = ({ current, home, children }: { current: string; home?: boolean; children: React.ReactNode }) => (
  <div className="plain">
    <style>{css}</style>
    <header>
      {home ? (
        <h1 className="site">{me.name}</h1>
      ) : (
        <Link href="/" className="site">
          {me.name}
        </Link>
      )}
      <nav className="noprint">
        {pages.map((p) =>
          p.external ? (
            <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer">
              {p.label}
            </a>
          ) : (
            <Link key={p.href} href={p.href} className={p.href === current ? 'is-on' : undefined}>
              {p.label}
            </Link>
          )
        )}
      </nav>
    </header>
    <main>{children}</main>
  </div>
);

export default Shell;
