'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Rain from './Rain';
import Screen from './Screen';
import Paper from './Paper';
import { Spines, BookList } from './Shelf';
import ClipPlayer, { ClipPlayerHandle } from './ClipPlayer';
import {
  SCENE_ASPECT,
  OVERSCAN,
  media,
  hasVideo,
  cat as cleo,
  sounds,
  regions,
  focusRect,
  focusMaxScale,
  Focus,
  Rect
} from './scene';
import { setup } from '@/data/setup';
import { ambient, play } from './audio';

// Media queries as external stores: false on the server, live on the client.
const useMedia = (query: string) =>
  useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );

const pct = (r: Rect): React.CSSProperties => ({
  left: `${r.x}%`,
  top: `${r.y}%`,
  width: `${r.w}%`,
  height: `${r.h}%`
});

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

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
  const [touched, setTouched] = useState(false); // a non-mouse pointer has been used
  const [pulse, setPulse] = useState(false); // one-time hotspot glow on load
  const [saveData, setSaveData] = useState(false);
  const [hinted, setHinted] = useState(false); // phone: "drag to look around" dismissed
  const [sound, setSound] = useState(false);
  const [hot, setHot] = useState<number | null>(null); // book spine under the pointer
  const [chosen, setChosen] = useState<number | null>(null); // book spine picked
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  // Touch devices show the labels all the time; there is no hover.
  const touch = useMedia('(pointer: coarse)') || touched;

  // camera, driven outside React for smoothness
  const target = useRef<Cam>({ x: 0, y: 0, s: 1 });
  const current = useRef<Cam>({ x: 0, y: 0, s: 1 });
  const pointer = useRef({ nx: 0, ny: 0 });
  const drag = useRef<{ on: boolean; x: number; y: number; moved: boolean }>({ on: false, x: 0, y: 0, moved: false });
  const [dragging, setDragging] = useState(false);
  const player = useRef<ClipPlayerHandle>(null);
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
      const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
      setSaveData(Boolean(nav.connection?.saveData));
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(() => setPulse(true), 1600);
    const h = setTimeout(() => setHinted(true), 7000);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
      clearTimeout(h);
    };
  }, []);

  const { vw, vh, sw, sh } = size;
  const ready = sw > 0;
  // Phones and portrait tablets: content comes up in a sheet instead of
  // sitting on the object, and the camera frames the object above it.
  const small = ready && (vw < 720 || (vh > vw && vw < 1024));
  // Nothing mounts video until we have measured, so the reduced-motion and
  // data-saver checks are real before the first byte of a clip is requested.
  const video = hasVideo && ready && !reduced && !saveData;

  const restCam = useCallback(
    (nx: number, ny: number): Cam => {
      const x0 = (vw - sw) / 2;
      const y0 = (vh - sh) / 2;
      return {
        x: clamp(x0 - nx * (sw - vw), vw - sw, 0),
        y: clamp(y0 - ny * (sh - vh), vh - sh, 0),
        s: 1
      };
    },
    [vw, vh, sw, sh]
  );

  // Camera that frames `r` inside a target area of the viewport: most of it
  // on desktop, the band above the sheet on a phone. Scale is raised as far
  // as needed so the object can actually be centred there, and the scene
  // never shows its edges.
  const focusCam = useCallback(
    (r: Rect, maxScale = 3.6): Cam => {
      const rw = (r.w / 100) * sw;
      const rh = (r.h / 100) * sh;
      const cx = ((r.x + r.w / 2) / 100) * sw;
      const cy = ((r.y + r.h / 2) / 100) * sh;
      const fw = small ? vw * 0.92 : vw * 0.86;
      const fh = small ? vh * 0.38 : vh * 0.86;
      const fcx = vw / 2;
      const fcy = small ? vh * 0.21 : vh / 2;
      let s = Math.min(fw / rw, fh / rh, maxScale);
      // Never show the scene's edges. On a phone, also push in far enough
      // that the object can sit in the band above the sheet; on desktop an
      // off-centre object is fine, the clamp below just slides it over.
      const floor = small
        ? Math.max(vw / sw, vh / sh, fcx / cx, (vw - fcx) / (sw - cx), fcy / cy, (vh - fcy) / (sh - cy))
        : Math.max(vw / sw, vh / sh);
      s = Math.max(s, Math.min(floor, maxScale));
      return {
        x: clamp(fcx - cx * s, vw - sw * s, 0),
        y: clamp(fcy - cy * s, vh - sh * s, 0),
        s
      };
    },
    [vw, vh, sw, sh, small]
  );

  // where a scene rect lands on screen once the camera settles on `cam`
  const onScreen = (r: Rect, cam: Cam): React.CSSProperties => ({
    left: cam.x + (r.x / 100) * sw * cam.s,
    top: cam.y + (r.y / 100) * sh * cam.s,
    width: (r.w / 100) * sw * cam.s,
    height: (r.h / 100) * sh * cam.s
  });

  useEffect(() => {
    if (!ready) return;
    if (focus) {
      target.current = focusCam(focusRect[focus], focusMaxScale[focus]);
      const t = setTimeout(() => setSettled(true), 700);
      return () => clearTimeout(t);
    }
    target.current = restCam(pointer.current.nx, pointer.current.ny);
  }, [focus, focusCam, restCam, ready]);

  const go = useCallback((id: Focus | null) => {
    setSettled(false);
    setFocus(id);
    if (id !== 'shelf') {
      setHot(null);
      setChosen(null);
    }
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
      drag.current = { on: true, x: e.clientX, y: e.clientY, moved: true };
      const g = target.current;
      target.current = {
        x: clamp(g.x + dx, vw - sw, 0),
        y: clamp(g.y + dy, vh - sh, 0),
        s: 1
      };
      if (!hinted) setHinted(true);
      return;
    }
    if (e.pointerType !== 'mouse') return;
    pointer.current = { nx: e.clientX / vw - 0.5, ny: e.clientY / vh - 0.5 };
    target.current = restCam(pointer.current.nx, pointer.current.ny);
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') {
      setTouched(true);
      if (!focus) {
        drag.current = { on: true, x: e.clientX, y: e.clientY, moved: false };
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
    play(cleo.purr, { level: 0.5, duration: 6500 }, () => setPetting(false));
  };

  const toggleSound = () => {
    const on = !sound;
    setSound(on);
    if (on) ambient.start(sounds.rain);
    else ambient.stop(sounds.rain);
  };

  const spot = (id: Focus) => (e: React.MouseEvent) => {
    e.stopPropagation();
    go(focus === id ? null : id);
  };
  const choose = (spine: number) => setChosen(chosen === spine ? null : spine);

  const win = regions.window;
  const cat = regions.cat;
  const cam = focus ? focusCam(focusRect[focus], focusMaxScale[focus]) : null;
  const cls = [
    'room',
    dragging && 'is-dragging',
    focus && 'is-focused',
    touch && 'is-touch',
    pulse && 'is-pulse',
    small && 'is-small'
  ]
    .filter(Boolean)
    .join(' ');
  const onObject = (r: Rect) => ({ className: `onobject${settled ? ' is-on' : ''}`, style: onScreen(r, cam!) });

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
        {video ? (
          <ClipPlayer ref={player} clips={media.clips} poster={media.poster} className="room__media" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="room__media" src={media.still} alt="" draggable={false} />
        )}
        {/* sharp still, shown while pushed in */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="room__media room__detail" src={media.detail} alt="" draggable={false} />

        {ready && !video && (
          <Rain
            className="room__layer"
            width={(win.w / 100) * sw}
            height={(win.h / 100) * sh}
            style={{ left: `${win.x}%`, top: `${win.y}%`, opacity: 0.9 }}
            paused={reduced}
          />
        )}
        {ready && !video && (
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

        {ready && (
          <Spines
            sw={sw}
            sh={sh}
            live={focus === 'shelf' && settled && !small}
            hot={hot}
            chosen={chosen}
            onHot={setHot}
            onChoose={choose}
          />
        )}
        {ready && !small && (
          <div
            className={`wallnote${focus === 'shelf' && settled ? ' is-on' : ''}`}
            style={{ ...pct(regions.wall), fontSize: sw * 0.0115 }}
          >
            <p className="wallnote__head">On the shelf</p>
            <BookList hot={hot} chosen={chosen} onHot={setHot} onChoose={choose} />
          </div>
        )}

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
        {/* Gear labels only make sense on hover: shown all at once they pile
            up on each other. Touch visitors get the desk on the plain page. */}
        {!touch && setup.map((g, i) => (
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

      {/* desktop: content sits on the object, in screen space, once the camera settles */}
      {cam && !small && focus === 'monitor' && (
        <div {...onObject(regions.screen)} onClick={(e) => e.stopPropagation()}>
          <Screen />
        </div>
      )}
      {cam && !small && focus === 'paper' && (
        <div
          className={`onobject${settled ? ' is-on' : ''}`}
          style={{ ...onScreen(regions.paperFace, cam), '--h': `${(regions.paperFace.h / 100) * sh * cam.s}px` } as React.CSSProperties}
          onClick={(e) => e.stopPropagation()}
        >
          <Paper />
        </div>
      )}

      {/* phone: the same content, in a sheet under the object */}
      {small && (
        <div className={`sheet${focus && settled ? ' is-on' : ''}`} onClick={(e) => e.stopPropagation()} aria-hidden={!focus}>
          <button className="sheet__close" onClick={() => go(null)}>
            back to the room
          </button>
          {focus === 'monitor' && <Screen />}
          {focus === 'paper' && <Paper />}
          {focus === 'shelf' && (
            <div className="sheet__books">
              <p className="wallnote__head">On the shelf</p>
              <BookList hot={hot} chosen={chosen} onHot={setHot} onChoose={choose} />
            </div>
          )}
        </div>
      )}

      {small && !focus && !hinted && <p className="room__hint">drag to look around, tap things</p>}
      <a className="room__name" href="/plain" title="The plain version of this site">
        Ben Adamsky
      </a>
      <button className="room__sound" onClick={(e) => { e.stopPropagation(); toggleSound(); }} aria-pressed={sound}>
        {sound ? 'sound on' : 'sound off'}
      </button>
    </main>
  );
};

export default Room;
