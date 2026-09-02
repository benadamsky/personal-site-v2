'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Rain from './Rain';
import Panel from './Panel';
import WorkPanel from './WorkPanel';
import BooksPanel from './BooksPanel';
import { SCENE_ASPECT, OVERSCAN, media, regions, Rect } from './scene';

type Open = 'work' | 'books' | null;

const RM = '(prefers-reduced-motion: reduce)';
const getReducedMotion = () => window.matchMedia(RM).matches;
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(RM);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

const pct = (r: Rect): React.CSSProperties => ({
  left: `${r.x}%`,
  top: `${r.y}%`,
  width: `${r.w}%`,
  height: `${r.h}%`
});

const Room = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const warmRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ vw: 0, vh: 0, sw: 0, sh: 0 });
  const [open, setOpen] = useState<Open>(null);
  const [moved, setMoved] = useState(false);
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  // target/current pan in px, driven outside React for smoothness
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const drag = useRef<{ on: boolean; x: number; y: number }>({ on: false, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Enough headroom to look around, but the rest framing still shows
      // most of the room. Wide viewports pan sideways; tall ones pan up/down.
      const sw = Math.max(vw * OVERSCAN, vh * SCENE_ASPECT * 1.04);
      const sh = sw / SCENE_ASPECT;
      setSize({ vw, vh, sw, sh });
      target.current = { x: (vw - sw) / 2, y: (vh - sh) / 2 };
      current.current = { ...target.current };
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // pan + flicker loop
  useEffect(() => {
    let raf = 0;
    let t = 0;
    const loop = () => {
      const c = current.current;
      const g = target.current;
      c.x += (g.x - c.x) * 0.06;
      c.y += (g.y - c.y) * 0.06;
      if (sceneRef.current) {
        sceneRef.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      }
      if (!reduced) {
        t += 0.016;
        const f =
          0.72 +
          0.16 * Math.sin(t * 7.3) +
          0.08 * Math.sin(t * 13.1 + 1.7) +
          0.04 * (Math.random() - 0.5);
        if (glowRef.current) {
          glowRef.current.style.opacity = String(f);
          glowRef.current.style.transform = `scale(${0.96 + f * 0.08})`;
        }
        if (warmRef.current) warmRef.current.style.opacity = String(0.02 + f * 0.05);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const clamp = useCallback(
    (x: number, y: number) => ({
      x: Math.min(0, Math.max(size.vw - size.sw, x)),
      y: Math.min(0, Math.max(size.vh - size.sh, y))
    }),
    [size]
  );

  const onPointerMove = (e: React.PointerEvent) => {
    if (open) return;
    if (drag.current.on) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current = { on: true, x: e.clientX, y: e.clientY };
      target.current = clamp(target.current.x + dx, target.current.y + dy);
      setMoved(true);
      return;
    }
    if (e.pointerType !== 'mouse') return;
    const nx = e.clientX / size.vw - 0.5;
    const ny = e.clientY / size.vh - 0.5;
    const x = (size.vw - size.sw) / 2 - nx * (size.sw - size.vw);
    const y = (size.vh - size.sh) / 2 - ny * (size.sh - size.vh);
    target.current = clamp(x, y);
    if (Math.abs(nx) > 0.2) setMoved(true);
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    drag.current = { on: true, x: e.clientX, y: e.clientY };
    setDragging(true);
  };
  const endDrag = () => {
    drag.current.on = false;
    setDragging(false);
  };

  const close = useCallback(() => setOpen(null), []);
  const { sw, sh } = size;
  const win = regions.window;
  const cat = regions.cat;

  return (
    <main
      className={`room${dragging ? ' is-dragging' : ''}`}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <div ref={sceneRef} className="room__scene" style={{ width: sw, height: sh }}>
        {media.video ? (
          <video
            className="room__media"
            src={media.video}
            poster={media.poster}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="room__media" src={media.poster} alt="" draggable={false} />
        )}

        {sw > 0 && (
          <Rain
            className="room__layer"
            width={(win.w / 100) * sw}
            height={(win.h / 100) * sh}
            style={{ left: `${win.x}%`, top: `${win.y}%`, opacity: 0.9 }}
            paused={reduced}
          />
        )}

        {sw > 0 && !media.video && (
          <div
            className="breath room__layer"
            style={{
              ...pct(cat),
              backgroundImage: `url(${media.poster})`,
              backgroundSize: `${sw}px ${sh}px`,
              backgroundPosition: `${-(cat.x / 100) * sw}px ${-(cat.y / 100) * sh}px`
            }}
          />
        )}

        <div
          ref={glowRef}
          className="glow room__layer"
          style={{
            left: `${regions.candle.x + regions.candle.w / 2 - 9}%`,
            top: `${regions.candle.y + regions.candle.h / 2 - 16}%`,
            width: '18%',
            height: '32%'
          }}
        />
        <div
          ref={warmRef}
          className="room__layer"
          style={{
            inset: 0,
            background:
              'radial-gradient(ellipse at 30% 75%, rgba(255,150,60,1), transparent 55%)',
            mixBlendMode: 'soft-light'
          }}
        />

        <button className="hotspot" style={pct(regions.shelf)} onClick={() => setOpen('books')}>
          <span className="hotspot__label">the shelf</span>
        </button>
        <button className="hotspot" style={pct(regions.monitor)} onClick={() => setOpen('work')}>
          <span className="hotspot__label">what I&apos;m working on</span>
        </button>
      </div>

      <span className="room__name">Ben Adamsky</span>
      <p className={`room__hint${moved ? ' is-gone' : ''}`}>look around</p>

      {open && (
        <Panel onClose={close}>{open === 'work' ? <WorkPanel /> : <BooksPanel />}</Panel>
      )}
    </main>
  );
};

export default Room;
