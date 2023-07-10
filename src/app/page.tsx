'use client';
import { useState, useEffect } from 'react';

const ESTIMATED_SPOTLIGHT_SIZE = 2000;

const Home = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [spotlightSize, setSpotlightSize] = useState(ESTIMATED_SPOTLIGHT_SIZE);
  const [viewportHeight, setViewportHeight] = useState('100vh');

  useEffect(() => {
    const resizeListener = () => {
      setSpotlightSize(
        Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
      );

      setViewportHeight(`${window.innerHeight}px`);
    };

    resizeListener();

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
      className="relative"
      onMouseMove={handleMouseMove}
      style={{
        height: viewportHeight,
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
    </main>
  );
};

export default Home;
