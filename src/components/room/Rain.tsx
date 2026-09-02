'use client';
import { useEffect, useRef } from 'react';

interface RainProps {
  width: number;
  height: number;
  style?: React.CSSProperties;
  className?: string;
  paused?: boolean;
}

interface Drop {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
}

// Gentle rain: thin streaks, slow, slightly wind-blown. Meant to sit over the
// window region of the scene, not the whole screen.
const Rain = ({ width, height, style, className, paused }: RainProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || paused || width === 0 || height === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const count = Math.round((width * height) / 3200);
    const drops: Drop[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: 10 + Math.random() * 22,
      speed: 90 + Math.random() * 110,
      alpha: 0.08 + Math.random() * 0.22
    }));

    let raf = 0;
    let last = performance.now();
    const wind = 0.08;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      for (const d of drops) {
        d.y += d.speed * dt;
        d.x += d.speed * wind * dt;
        if (d.y > height + d.len) {
          d.y = -d.len;
          d.x = Math.random() * width;
        }
        ctx.strokeStyle = `rgba(210, 225, 245, ${d.alpha})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * wind, d.y - d.len);
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [width, height, paused]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ width, height, ...style }}
      aria-hidden
    />
  );
};

export default Rain;
