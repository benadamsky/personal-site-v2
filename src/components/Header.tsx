import Image from 'next/image';

const Header = () => {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <a href="/" className="brand" aria-label="Ben Adamsky, home">
          <span className="brand-mark">
            <Image
              src="/ben-adamsky-pfp.jpg"
              alt=""
              fill
              priority
              sizes="40px"
            />
          </span>
          <span className="brand-copy">
            <strong>Ben Adamsky</strong>
            <small>Building Dreamwork</small>
          </span>
        </a>

        <nav aria-label="Primary navigation">
          <a href="/#signal">Philosophy</a>
          <a href="/#now">Now</a>
          <a href="/resume">Resume</a>
          <a className="header-connect" href="mailto:hi@benadamsky.com">
            Connect <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
    </>
  );
};

export default Header;
