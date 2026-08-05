import NeuralField from '@/components/NeuralField';
import ProjectNodes from '@/components/ProjectNodes';

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
          <ProjectNodes />
          <div className="hero-actions">
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
