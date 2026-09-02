import { jobs } from '@/data/work';

const WorkPanel = () => (
  <>
    <h1>What I&apos;ve been working on</h1>
    {jobs.map((job) => (
      <section className="job" key={job.company + job.role}>
        <h2>{job.company}</h2>
        <p className="dim">
          {job.role} · {job.start} to {job.end}
        </p>
        {job.tagline && <p>{job.tagline}</p>}
        {job.notes.length > 0 && (
          <ul>
            {job.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </section>
    ))}
    <p className="dim" style={{ marginTop: 40 }}>
      <a href="/resume.pdf" style={{ color: 'inherit' }}>
        Resume as a PDF
      </a>
    </p>
  </>
);

export default WorkPanel;
