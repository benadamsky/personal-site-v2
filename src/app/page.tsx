import NeuralField from '@/components/NeuralField';

const Home = () => {
  return (
    <main id="main-content" className="atlas">
      <NeuralField />

      <section className="atlas-hero" aria-labelledby="hero-title">
        <div className="atlas-grain" aria-hidden="true" />

        <div className="atlas-copy">
          <p className="atlas-coordinate">New York · Co-founder &amp; CTO, Dreamwork</p>
          <h1 id="hero-title">
            I build companies
            <span>from the code up.</span>
          </h1>
          <p className="atlas-intro">
            I&apos;m Ben Adamsky, co-founder &amp; CTO of Dreamwork. Before
            that: founding engineer at Branch through a $15.5M raise, top 1% of
            engineers on Upwork, and core engineer on Freeport&apos;s tokenized
            Warhol launch — shipping end to end since high school.
          </p>
          <div className="hero-actions">
            <a
              className="signal-link"
              href="https://www.dreamworkhq.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Enter Dreamwork
              <span aria-hidden="true">↗</span>
            </a>
            <a className="quiet-link" href="mailto:hi@benadamsky.com">
              hi@benadamsky.com
            </a>
          </div>
        </div>

        <p className="interaction-note">Move to excite · Click to fire</p>
      </section>
    </main>
  );
};

export default Home;
