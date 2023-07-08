'use client';
import { useState, useEffect } from 'react';

const Home = () => {
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
    </main>
  );
};

export default Home;
