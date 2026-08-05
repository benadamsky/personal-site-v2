import NeuralField from '@/components/NeuralField';
import WordReveal from '@/components/WordReveal';

const Home = () => {
  return (
    <main id="main-content" className="atlas">
      <NeuralField />

      <section className="atlas-hero" aria-labelledby="hero-title">
        <div className="atlas-grain" aria-hidden="true" />

        <div className="atlas-copy">
          <p className="atlas-coordinate">New York · Co-founder &amp; CTO, Dreamwork</p>
          <h1 id="hero-title">
            I build systems
            <span>that think.</span>
          </h1>
          <p className="atlas-intro">
            I&apos;m Ben Adamsky — engineer, two-time founder, a decade of
            shipping products end to end. These days I work with a fleet of AI
            agents, and it&apos;s the most fun I&apos;ve ever had.
          </p>
          <a className="signal-link" href="#story">
            Follow the signal
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <p className="interaction-note">Move to excite · Click to fire</p>
      </section>

      <section id="story" className="manifesto" aria-label="The story">
        <p className="section-index">The story</p>
        <WordReveal>
          The hard part was never the code. It&apos;s knowing what to build,
          and having the range to ship all of it.
        </WordReveal>
        <p className="story-copy">
          I started shipping in high school — game servers and plugins for
          thousands of players. Since then: founding engineer at Branch through
          a $15.5M raise, top 1% of freelancers on Upwork, core engineer on
          Freeport&apos;s tokenized Warhol launch. Now I&apos;m deep in agentic
          engineering — designing the systems, then directing the agents that
          help build them.
        </p>
      </section>

      <section id="now" className="now-section" aria-labelledby="now-title">
        <div className="now-copy">
          <p className="section-index">Now</p>
          <h2 id="now-title">
            Building
            <span>Dreamwork.</span>
          </h2>
          <p>
            An agent-first job search platform: software that does the
            searching so people can do the deciding. I lead engineering —
            architecture to interface, agents to pixels.
          </p>
          <a
            className="signal-link signal-link-light"
            href="https://www.dreamworkhq.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Enter Dreamwork
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="final-signal" aria-labelledby="final-title">
        <p className="section-index">Open channel</p>
        <h2 id="final-title">
          There are easier problems. I&apos;m interested in the ones that
          matter.
        </h2>
        <a className="final-link" href="mailto:hi@benadamsky.com">
          Start a conversation <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
};

export default Home;
