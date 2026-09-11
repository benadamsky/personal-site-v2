import { profile, otherProjects } from '@/data/profile';
import { projects, history } from '@/data/work';
import { reading, bookStatus, bookUrl } from '@/data/books';
import { setup } from '@/data/setup';

export const dynamic = 'force-static';

// A standalone HTML document: no room layout, author CSS, fonts, or hydration.
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[char]!
  );
const link = (label: string, url: string) =>
  `<a href="${escape(url)}">${escape(label)}</a>`;

export function GET() {
  const document = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>ben adamsky — plain version</title>
<meta name="description" content="${escape(profile.intro)}">
</head>
<body>
<header><h1>${escape(profile.name)}</h1><p>${escape(profile.intro)}</p>
<p>${link('back to the room', '/')}</p></header>
<main>
<h2>work</h2>
${projects
  .map(
    (p) => `<section id="${p.id}"><h3>${link(p.name, p.url)}</h3>
<p>${escape(p.role)} · ${escape(p.phase)}</p>
${p.lines.map((l) => `<p>${escape(l)}</p>`).join('\n')}
<p>${p.links.map((l) => link(l.label, l.url)).join(' · ')}</p></section>`
  )
  .join('\n')}
<h2>before that</h2>
${history.map((j) => `<section><h3>${escape(j.company)}</h3><p>${escape(j.role)} · ${escape(j.years)}</p><p>${escape(j.line)}</p></section>`).join('\n')}
<p>${link('résumé', '/resume')} · ${link('résumé pdf', '/resume.pdf')}</p>
<h2>other things i’ve made</h2>
<ul>${otherProjects.map((p) => `<li>${link(p.name, p.url)} — ${escape(p.line)}</li>`).join('\n')}</ul>
<h2 id="reading">on my bookshelf</h2>
<p>from my audible library. what i’m listening to, and what’s next.</p>
${(['listening', 'finished', 'shelf'] as const)
  .map((status) => {
    const titles = reading.filter((b) => (b.status ?? 'shelf') === status);
    if (!titles.length) return '';
    return `<h3>${status === 'listening' ? 'in progress' : status === 'finished' ? 'finished' : 'on the shelf'}</h3><ul>${titles
      .map((b) => {
        const url = bookUrl(b);
        return `<li>${url ? link(b.title, url) : escape(b.title)} — ${escape(b.author)}${status === 'listening' ? ` (${escape(bookStatus(b))})` : ''}${b.note ? `<p>${escape(b.note)}</p>` : ''}</li>`;
      })
      .join('\n')}</ul>`;
  })
  .join('\n')}
<h2>on my desk</h2><ul>${setup.map((g) => `<li>${link(g.name, g.url)}</li>`).join('\n')}</ul>
</main>
<footer><h2>elsewhere</h2><p>${profile.links.map((l) => link(l.label, l.url)).join(' · ')}</p>
<p>${link('back to the room', '/')}</p></footer>
</body></html>`;
  return new Response(document, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
