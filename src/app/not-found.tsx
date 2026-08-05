import RouteField from '@/components/RouteField';

const NotFound = () => {
  return (
    <main id="main-content" className="not-found">
      <RouteField />
      <p className="section-index">Route unavailable · 404</p>
      <h1>This path ends here.</h1>
      <p>The page moved, disappeared, or never existed.</p>
      <a className="signal-link" href="/">
        Return to the map <span aria-hidden="true">↗</span>
      </a>
    </main>
  );
};

export default NotFound;
