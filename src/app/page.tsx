'use client';
import { Nav, NavItem, Link } from '@/components/Nav';
import { useState, useEffect } from 'react';

const HEADER = [
  {
    label: 'Connect',
    link: 'mailto:hi@benadamsky.com'
  },
  {
    label: 'Resume',
    link: '#resume-coming-soon'
  }
];

const FOOTER = [
  {
    label: 'GitHub',
    link: 'https://github.com/benadamsky'
  },
  {
    label: 'LinkedIn',
    link: 'https://linkedin.com/in/benadamsky'
  },
  {
    label: 'Farcaster',
    link: 'https://warpcast.com/ba'
  }
];

export default function Home() {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [spotlightSize, setSpotlightSize] = useState(2000);

  useEffect(() => {
    setSpotlightSize(
      Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
    );
    const resizeListener = () => {
      setSpotlightSize(
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
      );
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  const handleMouseMove = (event: { clientX: number; clientY: number }) => {
    setCoordinates({ x: event.clientX, y: event.clientY });
  };

  return (
    <main
      className="relative h-full cursor-cell"
      onMouseMove={handleMouseMove}
      style={{
        backgroundImage: `url('/ba.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}
    >
      <div
        className="absolute inset-0 animate-fadeIn"
        style={{
          backgroundImage: `radial-gradient(circle ${spotlightSize}px at ${coordinates.x}px ${coordinates.y}px, transparent, rgba(0, 0, 0, .5)), url('/ba.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      />
      <header className="absolute top-0 w-full flex flex-col sm:flex-row space-y-2 items-center justify-between pt-6 px-0 sm:px-12 xl:px-48">
        <h1 className="text-slate-200 text-4xl sm:text-xl font-semibold">
          Ben Adamsky
        </h1>
        <Nav>
          {HEADER.map((item) => (
            <NavItem href={item.link} linkClassName="text-xl sm:text-lg" key={item.label}>
              {item.label}
            </NavItem>
          ))}
        </Nav>
      </header>
      <footer className="absolute bottom-0 w-full flex flex-col-reverse sm:flex-row justify-between items-center pb-6 px-12 xl:px-48">
        <Link
          href="https://github.com/benadamsky/personal-site-v2"
          rel="noopener noreferrer"
          target="_blank"
          linkClassName="text-gray-400 text-sm hover:text-gray-300 underline underline-offset-4 mt-3 sm:mt-0"
        >
          View Source Code
        </Link>
        <Nav navClassName="space-x-6 sm:space-x-4">
          {FOOTER.map((item) => (
            <NavItem
              href={item.link}
              rel="noopener noreferrer"
              target="_blank"
              linkClassName="text-lg sm:text-base"
              key={item.label}
            >
              {item.label}
            </NavItem>
          ))}
        </Nav>
      </footer>
    </main>
  );
}
