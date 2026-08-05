import NeuralField from '@/components/NeuralField';

const NotFound = () => {
  return (
    <main id="main-content" className="not-found">
      <NeuralField />
      <p className="section-index">Signal lost · 404</p>
      <h1>This synapse never fired.</h1>
      <p>The page moved, disappeared, or never existed.</p>
      <a className="signal-link" href="/">
        Back to the network <span aria-hidden="true">↗</span>
      </a>
    </main>
  );
};

export default NotFound;
