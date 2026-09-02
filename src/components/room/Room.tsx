'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Rain from './Rain';
import Screen from './Screen';
import Paper from './Paper';
import Shelf from './Shelf';
import ClipPlayer, { ClipPlayerHandle } from './ClipPlayer';
import {
  SCENE_ASPECT,
  OVERSCAN,
  media,
  hasVideo,
  cat as cleo,
  regions,
  focusRect,
  focusMaxScale,
  Focus,
  Rect
} from './scene';
import { setup } from '@/data/setup';

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

interface Cam {
  x: number;
  y: number;
  s: number;
}

const Room = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const warmRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ vw: 0, vh: 0, sw: 0, sh: 0 });
  const [focus, setFocus] = useState<Focus | null>(null);
  const [settled, setSettled] = useState(false); // camera finished pushing in
  const [touch, setTouch] = useState(false);
  const [pulse, setPulse] = useState(false); // one-time hotspot glow on load
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  // camera, driven outside React for smoothness
  const target = useRef<Cam>({ x: 0, y: 0, s: 1 });
  const current = useRef<Cam>({ x: 0, y: 0, s: 1 });
  const pointer = useRef({ nx: 0, ny: 0 });
  const drag = useRef<{ on: boolean; x: number; y: number }>({ on: false, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const player = useRef<ClipPlayerHandle>(null);
  const purr = useRef<HTMLAudioElement | null>(null);
  const [petting, setPetting] = useState(false);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Enough headroom to look around, but the rest framing still shows
      // most of the room. Wide viewports pan sideways; tall ones pan up/down.
      const sw = Math.max(vw * OVERSCAN, vh * SCENE_ASPECT * 1.04);
      const sh = sw / SCENE_ASPECT;
      setSize({ vw, vh, sw, sh });
      target.current = { x: (vw - sw) / 2, y: (vh - sh) / 2, s: 1 };
      current.current = { ...target.current };
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(() => setPulse(true), 1600);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);

  const { vw, vh, sw, sh } = size;

  const restCam = useCallback(
    (nx: number, ny: number): Cam => {
      const x0 = (vw - sw) / 2;
      const y0 = (vh - sh) / 2;
      return {
        x: Math.min(0, Math.max(vw - sw, x0 - nx * (sw - vw))),
        y: Math.min(0, Math.max(vh - sh, y0 - ny * (sh - vh))),
        s: 1
      };
    },
    [vw, vh, sw, sh]
  );

  // Camera that frames `r` at ~86% of the viewport, clamped so the scene
  // still covers the screen.
  const focusCam = useCallback(
    (r: Rect, maxScale = 3.6): Cam => {
      const rw = (r.w / 100) * sw;
      const rh = (r.h / 100) * sh;
      const s = Math.min((vw * 0.86) / rw, (vh * 0.86) / rh, maxScale);
      const cx = ((r.x + r.w / 2) / 100) * sw;
      const cy = ((r.y + r.h / 2) / 100) * sh;
      return {
        x: Math.min(0, Math.max(vw - sw * s, vw / 2 - cx * s)),
        y: Math.min(0, Math.max(vh - sh * s, vh / 2 - cy * s)),
        s
      };
    },
    [vw, vh, sw, sh]
  );

  // where a scene rect lands on screen once the camera settles on `cam`
  const onScreen = (r: Rect, cam: Cam): React.CSSProperties => ({
    left: cam.x + (r.x / 100) * sw * cam.s,
    top: cam.y + (r.y / 100) * sh * cam.s,
    width: (r.w / 100) * sw * cam.s,
    height: (r.h / 100) * sh * cam.s
  });

  useEffect(() => {
    if (sw === 0) return;
    if (focus) {
      target.current = focusCam(focusRect[focus], focusMaxScale[focus]);
      const t = setTimeout(() => setSettled(true), 700);
      return () => clearTimeout(t);
    }
    target.current = restCam(pointer.current.nx, pointer.current.ny);
  }, [focus, focusCam, restCam, sw]);

  const go = useCallback((id: Focus | null) => {
    setSettled(false);
    setFocus(id);
  }, []);

  // camera + flicker loop
  useEffect(() => {
    let raf = 0;
    let t = 0;
    const loop = () => {
      const c = current.current;
      const g = target.current;
      const k = g.s !== 1 || c.s > 1.001 ? 0.085 : 0.06;
      c.x += (g.x - c.x) * k;
      c.y += (g.y - c.y) * k;
      c.s += (g.s - c.s) * k;
      if (sceneRef.current) {
        sceneRef.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) scale(${c.s})`;
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && go(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (focus) return;
    if (drag.current.on) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current = { on: true, x: e.clientX, y: e.clientY };
      const g = target.current;
      target.current = {
        x: Math.min(0, Math.max(vw - sw, g.x + dx)),
        y: Math.min(0, Math.max(vh - sh, g.y + dy)),
        s: 1
      };
      return;
    }
    if (e.pointerType !== 'mouse') return;
    pointer.current = { nx: e.clientX / vw - 0.5, ny: e.clientY / vh - 0.5 };
    target.current = restCam(pointer.current.nx, pointer.current.ny);
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') {
      setTouch(true);
      if (!focus) {
        drag.current = { on: true, x: e.clientX, y: e.clientY };
        setDragging(true);
      }
    }
  };
  const endDrag = () => {
    drag.current.on = false;
    setDragging(false);
  };

  const pet = () => {
    if (petting) return;
    setPetting(true);
    player.current?.playNow(cleo.reaction);
    if (!purr.current) {
      purr.current = new Audio(cleo.purr);
      purr.current.loop = true;
    }
    const a = purr.current;
    a.volume = 0;
    a.currentTime = 0;
    a.play().catch(() => {});
    const t0 = performance.now();
    const dur = 6500;
    const tick = () => {
      const t = performance.now() - t0;
      const env = t < 900 ? t / 900 : t > dur - 1500 ? Math.max(0, (dur - t) / 1500) : 1;
      a.volume = 0.5 * env;
      if (t < dur) requestAnimationFrame(tick);
      else {
        a.pause();
        setPetting(false);
      }
    };
    requestAnimationFrame(tick);
  };

  const spot = (id: Focus) => (e: React.MouseEvent) => {
    e.stopPropagation();
    go(focus === id ? null : id);
  };

  const win = regions.window;
  const cat = regions.cat;
  const cam = focus ? focusCam(focusRect[focus], focusMaxScale[focus]) : null;
  const cls = ['room', dragging && 'is-dragging', focus && 'is-focused', touch && 'is-touch', pulse && 'is-pulse']
    .filter(Boolean)
    .join(' ');

  return (
    <main
      className={cls}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onClick={() => focus && go(null)}
    >
      <div ref={sceneRef} className="room__scene" style={{ width: sw, height: sh }}>
        {hasVideo && !reduced ? (
          <ClipPlayer ref={player} clips={media.clips} poster={media.poster} className="room__media" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="room__media" src={media.still} alt="" draggable={false} />
        )}
        {/* sharp still, shown while pushed in */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="room__media room__detail" src={media.detail} alt="" draggable={false} />

        {sw > 0 && !hasVideo && (
          <Rain
            className="room__layer"
            width={(win.w / 100) * sw}
            height={(win.h / 100) * sh}
            style={{ left: `${win.x}%`, top: `${win.y}%`, opacity: 0.9 }}
            paused={reduced}
          />
        )}
        {sw > 0 && (!hasVideo || reduced) && (
          <div
            className="breath room__layer"
            style={{
              ...pct(cat),
              backgroundImage: `url(${media.still})`,
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
            background: 'radial-gradient(ellipse at 30% 75%, rgba(255,150,60,1), transparent 55%)',
            mixBlendMode: 'soft-light'
          }}
        />

        {sw > 0 && <Shelf sw={sw} sh={sh} active={focus === 'shelf' && settled} />}

        <button className="hotspot" style={{ ...pct(regions.shelf), '--i': 0 } as React.CSSProperties} onClick={spot('shelf')}>
          <span className="hotspot__label">the shelf</span>
        </button>
        <button className="hotspot" style={{ ...pct(regions.monitor), '--i': 1 } as React.CSSProperties} onClick={spot('monitor')}>
          <span className="hotspot__label">what I&apos;m working on</span>
        </button>
        <button className="hotspot" style={{ ...pct(regions.paper), '--i': 2 } as React.CSSProperties} onClick={spot('paper')}>
          <span className="hotspot__label">before that</span>
        </button>
        <button
          className="hotspot hotspot--cat"
          style={{ ...pct(regions.cat), '--i': 3 } as React.CSSProperties}
          onClick={(e) => {
            e.stopPropagation();
            pet();
          }}
        >
          <span className="hotspot__label">{petting ? `${cleo.name} is purring` : cleo.name}</span>
        </button>
        {setup.map((g, i) => (
          <a
            key={g.id}
            className="hotspot hotspot--gear"
            style={{ ...pct(regions[g.id]), '--i': 4 + i } as React.CSSProperties}
            href={g.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="hotspot__label">{g.name}</span>
          </a>
        ))}
      </div>

      {/* content sits on the object, in screen space, once the camera settles */}
      {cam && focus === 'monitor' && (
        <div className={`onobject${settled ? ' is-on' : ''}`} style={onScreen(regions.screen, cam)} onClick={(e) => e.stopPropagation()}>
          <Screen />
        </div>
      )}
      {cam && focus === 'paper' && (
        <div
          className={`onobject${settled ? ' is-on' : ''}`}
          style={{ ...onScreen(regions.paperFace, cam), '--h': `${(regions.paperFace.h / 100) * sh * cam.s}px` } as React.CSSProperties}
          onClick={(e) => e.stopPropagation()}
        >
          <Paper />
        </div>
      )}

      <span className="room__name">Ben Adamsky</span>
    </main>
  );
};

export default Room;
