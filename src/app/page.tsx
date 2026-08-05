import Image from 'next/image';
import RouteField from '@/components/RouteField';
import WordReveal from '@/components/WordReveal';

const Home = () => {
  return (
    <main id="main-content" className="atlas">
      <RouteField />

      <section className="atlas-hero" aria-labelledby="hero-title">
        <div className="atlas-hero-image" aria-hidden="true" />
        <div className="atlas-grain" aria-hidden="true" />

        <div className="atlas-copy">
          <p className="atlas-coordinate">New York · Building Dreamwork</p>
          <h1 id="hero-title">
            Most paths are invisible
            <span>until somebody builds them.</span>
          </h1>
          <p className="atlas-intro">
            I&apos;m Ben Adamsky. I build software for the moments when people,
            products, and work need a way forward.
          </p>
          <a className="signal-link" href="#signal">
            Follow the signal
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <aside className="identity-orbit" aria-label="About Ben Adamsky">
          <span className="orbit orbit-one" aria-hidden="true" />
          <span className="orbit orbit-two" aria-hidden="true" />
          <div className="identity-photo">
            <Image
              src="/ben-adamsky-pfp.jpg"
              alt="Ben Adamsky"
              fill
              priority
              sizes="(max-width: 640px) 128px, 176px"
            />
          </div>
          <span className="identity-tag tag-founder">Founder</span>
          <span className="identity-tag tag-engineer">Engineer</span>
          <span className="identity-tag tag-operator">Operator</span>
        </aside>

        <p className="interaction-note">Move to reroute · Scroll to travel</p>
      </section>

      <section
        id="signal"
        className="manifesto"
        aria-label="Working philosophy"
      >
        <p className="section-index">Field note 01</p>
        <WordReveal>
          The hard part is not writing the code. It is finding the path through
          uncertainty and making it obvious to everyone else.
        </WordReveal>
      </section>

      <section id="now" className="now-section" aria-labelledby="now-title">
        <div className="now-copy">
          <p className="section-index">Current signal</p>
          <h2 id="now-title">
            Right now,
            <span>the signal is work.</span>
          </h2>
          <p>
            I&apos;m co-founder and CTO of Dreamwork. We&apos;re building a
            faster path to tech jobs by turning a noisy search into clear,
            useful next moves.
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

        <div
          className="path-machine"
          aria-label="A path from noise to opportunity"
        >
          <div className="machine-label machine-label-noise">
            <span>Input</span>
            Too many possibilities
          </div>
          <svg viewBox="0 0 720 500" role="img" aria-label="Routes converging">
            <path
              className="machine-path path-one"
              d="M20 64 C240 64 180 250 378 250 S530 214 700 214"
            />
            <path
              className="machine-path path-two"
              d="M20 170 C190 170 224 250 378 250 S540 250 700 250"
            />
            <path
              className="machine-path path-three"
              d="M20 285 C210 285 242 250 378 250 S550 286 700 286"
            />
            <path
              className="machine-path path-four"
              d="M20 416 C230 416 190 250 378 250 S560 322 700 322"
            />
            <circle className="machine-node" cx="378" cy="250" r="8" />
            <circle className="machine-pulse" cx="378" cy="250" r="24" />
          </svg>
          <div className="machine-core">
            <span>Dreamwork</span>
            Finds the route worth taking
          </div>
          <div className="machine-label machine-label-path">
            <span>Output</span>A next move you can act on
          </div>
        </div>
      </section>

      <section className="practice" aria-labelledby="practice-title">
        <div className="practice-heading">
          <p className="section-index">How I build</p>
          <h2 id="practice-title">
            The interesting problems never stay in one layer.
          </h2>
        </div>
        <div className="practice-map">
          <svg
            viewBox="0 0 1240 560"
            role="img"
            aria-label="A continuous build loop connecting shape, ship, and learn"
          >
            <path
              className="practice-path"
              d="M60 390 C250 390 238 120 470 120 S665 430 835 430 S960 185 1170 185"
            />
            <circle className="practice-waypoint" cx="60" cy="390" r="7" />
            <circle className="practice-waypoint" cx="470" cy="120" r="7" />
            <circle className="practice-waypoint" cx="835" cy="430" r="7" />
            <circle className="practice-waypoint" cx="1170" cy="185" r="7" />
          </svg>
          <article className="practice-step step-shape">
            <span>Shape</span>
            <h3>Find the real problem.</h3>
            <p>
              Turn an ambiguous need into a product direction people can see.
            </p>
          </article>
          <article className="practice-step step-ship">
            <span>Ship</span>
            <h3>Build the whole path.</h3>
            <p>
              Move across interface, infrastructure, and operations without
              losing the thread.
            </p>
          </article>
          <article className="practice-step step-learn">
            <span>Learn</span>
            <h3>Let reality answer.</h3>
            <p>
              Put the system in front of people, observe what happens, and
              reroute quickly.
            </p>
          </article>
          <p className="practice-loop-label">Then back to the problem ↗</p>
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
