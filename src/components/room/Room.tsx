'use client';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore
} from 'react';
import Screen from './Screen';
import Paper from './Paper';
import Shelf, { ShelfSpines } from './Shelf';
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
import { profile } from '@/data/profile';

const RM = '(prefers-reduced-motion: reduce)';
const getReducedMotion = () => window.matchMedia(RM).matches;
const subscribeReducedMotion = (cb: () => void) => {
  const query = window.matchMedia(RM);
  query.addEventListener('change', cb);
  return () => query.removeEventListener('change', cb);
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
const views: { id: Focus; label: string }[] = [
  { id: 'monitor', label: 'work' },
  { id: 'shelf', label: 'books' },
  { id: 'paper', label: 'before that' }
];

export default function Room() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLElement>(null);
  const [chromeHeight, setChromeHeight] = useState(112);
  const panelRef = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const needsFocus = useRef(false);
  const [size, setSize] = useState({ vw: 0, vh: 0, sw: 0, sh: 0 });
  const [focus, setFocus] = useState<Focus | null>(null);
  const [settled, setSettled] = useState(false);
  const focused = useRef<Focus | null>(null);
  const isSettled = useRef(false);
  const [motionPaused, setMotionPaused] = useState(false);
  // Start conservatively on the server: reduced-motion visitors never get an
  // initial burst of video/parallax while the preference hydrates.
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => true
  );
  const still = reduced || motionPaused;
  const target = useRef<Cam>({ x: 0, y: 0, s: 1 });
  const current = useRef<Cam>({ x: 0, y: 0, s: 1 });
  const initialized = useRef(false);
  const wake = useRef(() => {});
  const pointer = useRef({ nx: 0, ny: 0 });
  const drag = useRef({
    on: false,
    moved: false,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  });
  const [dragging, setDragging] = useState(false);
  const [hotBook, setHotBook] = useState<number | null>(null);
  const player = useRef<ClipPlayerHandle>(null);
  const purr = useRef<HTMLAudioElement | null>(null);
  const purrFrame = useRef(0);
  const purrTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const pettingRef = useRef(false);
  const [petting, setPetting] = useState(false);

  useLayoutEffect(() => {
    if (!chromeRef.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setChromeHeight(Math.ceil(entry.target.getBoundingClientRect().height))
    );
    observer.observe(chromeRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const sw = Math.max(vw * OVERSCAN, vh * SCENE_ASPECT * 1.04);
      isSettled.current = false;
      setSettled(false);
      setSize({ vw, vh, sw, sh: sw / SCENE_ASPECT });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const { vw, vh, sw, sh } = size;
  const compact = vw <= 900 || vh <= 600;
  const restCam = useCallback(
    (nx: number, ny: number): Cam => ({
      x: Math.min(0, Math.max(vw - sw, (vw - sw) / 2 - nx * (sw - vw) * 0.4)),
      y: Math.min(0, Math.max(vh - sh, (vh - sh) / 2 - ny * (sh - vh) * 0.4)),
      s: 1
    }),
    [vw, vh, sw, sh]
  );
  const focusCam = useCallback(
    (id: Focus): Cam => {
      const r = focusRect[id];
      const s = compact
        ? 1
        : Math.max(
            1,
            Math.min(
              (vw * 0.86) / ((r.w / 100) * sw),
              (vh * 0.78) / ((r.h / 100) * sh),
              focusMaxScale[id]
            )
          );
      return {
        x: Math.min(
          0,
          Math.max(vw - sw * s, vw / 2 - ((r.x + r.w / 2) / 100) * sw * s)
        ),
        y: Math.min(
          0,
          Math.max(
            vh - sh * s,
            (compact ? vh * 0.22 : vh / 2) - ((r.y + r.h / 2) / 100) * sh * s
          )
        ),
        s
      };
    },
    [compact, vw, vh, sw, sh]
  );

  useLayoutEffect(() => {
    if (!sw) return;
    focused.current = focus;
    isSettled.current = false;
    target.current = focus
      ? focusCam(focus)
      : restCam(still ? 0 : pointer.current.nx, still ? 0 : pointer.current.ny);
    if (!initialized.current || still) {
      initialized.current = true;
      current.current = { ...target.current };
    }
    wake.current();
  }, [focus, focusCam, restCam, sw, still]);

  useEffect(() => {
    let frame = 0;
    let last = 0;
    const paint = (time: number) => {
      frame = 0;
      const dt = Math.min(64, last ? time - last : 16.67);
      last = time;
      const c = current.current;
      const g = target.current;
      const k = still ? 1 : 1 - Math.exp(-dt / (focused.current ? 100 : 160));
      c.x += (g.x - c.x) * k;
      c.y += (g.y - c.y) * k;
      c.s += (g.s - c.s) * k;
      const done =
        Math.max(
          Math.abs(c.x - g.x),
          Math.abs(c.y - g.y),
          Math.abs(c.s - g.s) * sw
        ) < 0.35;
      if (done) Object.assign(c, g);
      if (sceneRef.current)
        sceneRef.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) scale(${c.s})`;
      if (done) {
        if (focused.current && !isSettled.current) {
          isSettled.current = true;
          setSettled(true);
        }
        last = 0;
      } else frame = requestAnimationFrame(paint);
    };
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
    };
    wake.current = schedule;
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      } else schedule();
    };
    document.addEventListener('visibilitychange', visibility);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      wake.current = () => {};
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [still, sw]);

  const go = useCallback((id: Focus | null, source?: HTMLElement) => {
    needsFocus.current = !!id;
    if (id && source) trigger.current = source;
    isSettled.current = false;
    setSettled(false);
    setHotBook(null);
    setFocus(id);
    if (!id)
      requestAnimationFrame(() =>
        trigger.current?.focus({ preventScroll: true })
      );
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') go(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);
  useEffect(() => {
    if (focus && settled && needsFocus.current) {
      panelRef.current?.focus({ preventScroll: true });
      needsFocus.current = false;
    }
  }, [focus, settled]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (focus || !e.isPrimary) return;
    const d = drag.current;
    if (d.on) {
      if (
        !d.moved &&
        Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 8
      ) {
        d.moved = true;
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      if (d.moved) {
        target.current = {
          x: Math.min(0, Math.max(vw - sw, target.current.x + e.clientX - d.x)),
          y: Math.min(0, Math.max(vh - sh, target.current.y + e.clientY - d.y)),
          s: 1
        };
        wake.current();
      }
      d.x = e.clientX;
      d.y = e.clientY;
    } else if (e.pointerType === 'mouse' && !still) {
      pointer.current = { nx: e.clientX / vw - 0.5, ny: e.clientY / vh - 0.5 };
      target.current = restCam(pointer.current.nx, pointer.current.ny);
      wake.current();
    }
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary) return;
    drag.current.on = false;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const stopPurr = useCallback(() => {
    cancelAnimationFrame(purrFrame.current);
    clearTimeout(purrTimer.current);
    purr.current?.pause();
    pettingRef.current = false;
    setPetting(false);
  }, []);
  useEffect(() => {
    const hidden = () => {
      if (document.hidden) stopPurr();
    };
    document.addEventListener('visibilitychange', hidden);
    return () => {
      document.removeEventListener('visibilitychange', hidden);
      cancelAnimationFrame(purrFrame.current);
      clearTimeout(purrTimer.current);
      purr.current?.pause();
    };
  }, [stopPurr]);
  const pet = () => {
    if (pettingRef.current) return;
    pettingRef.current = true;
    setPetting(true);
    if (!still) player.current?.playNow(cleo.reaction);
    const audio = new Audio(cleo.purr);
    audio.loop = false;
    audio.currentTime = 0;
    audio.volume = 0;
    purr.current = audio;
    audio.play().catch(stopPurr);
    const start = performance.now();
    const tick = () => {
      const t = performance.now() - start;
      audio.volume =
        0.45 * Math.max(0, Math.min(1, t / 900, (6500 - t) / 1500));
      if (t < 6500) purrFrame.current = requestAnimationFrame(tick);
      else stopPurr();
    };
    purrTimer.current = setTimeout(stopPurr, 6600);
    purrFrame.current = requestAnimationFrame(tick);
  };
  const cam = focus ? focusCam(focus) : null;
  const panelRect =
    focus === 'monitor'
      ? regions.screen
      : focus === 'paper'
        ? regions.paperFace
        : regions.wall;
  const panelStyle = cam
    ? {
        left: cam.x + (panelRect.x / 100) * sw * cam.s,
        top: cam.y + (panelRect.y / 100) * sh * cam.s,
        width: (panelRect.w / 100) * sw * cam.s,
        height: (panelRect.h / 100) * sh * cam.s
      }
    : undefined;

  return (
    <main
      style={{ '--chrome-height': `${chromeHeight}px` } as React.CSSProperties}
      className={`room${focus ? ' is-focused' : ''}${dragging ? ' is-dragging' : ''}${still ? ' is-still' : ''}`}
    >
      <h1 className="sr-only">{profile.name}</h1>
      <p className="sr-only">
        {profile.intro} Explore my work and books, or open the plain version.
      </p>
      <div
        className="room__stage"
        onPointerMove={onPointerMove}
        onPointerDown={(e) => {
          if (focus || e.button !== 0 || !e.isPrimary) return;
          drag.current = {
            on: true,
            moved: false,
            x: e.clientX,
            y: e.clientY,
            startX: e.clientX,
            startY: e.clientY
          };
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) endDrag(e);
        }}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        onClick={() => {
          if (focus) go(null);
        }}
      >
        <div
          ref={sceneRef}
          className="room__scene"
          style={{ width: sw || '100%', height: sh || '100%' }}
        >
          {hasVideo && !reduced ? (
            <ClipPlayer
              ref={player}
              clips={media.clips}
              poster={media.poster}
              className="room__media"
              paused={!!focus || motionPaused}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="room__media"
              src={media.poster}
              alt=""
              draggable={false}
            />
          )}
          {focus === 'shelf' && settled && (
            <ShelfSpines highlighted={hotBook} />
          )}
          <div inert={!!focus} aria-hidden={!!focus}>
            {views.map(({ id, label }) => (
              <button
                key={id}
                className="hotspot"
                style={pct(regions[id])}
                aria-label={label}
                tabIndex={compact ? -1 : 0}
                onClick={(e) => {
                  e.stopPropagation();
                  go(id, e.currentTarget);
                }}
              >
                <span className="hotspot__label">{label}</span>
              </button>
            ))}
            <button
              className="hotspot hotspot--cat"
              style={pct(regions.cat)}
              aria-label={petting ? 'Cleo is purring' : 'pet Cleo'}
              tabIndex={compact ? -1 : 0}
              onClick={(e) => {
                e.stopPropagation();
                pet();
              }}
            >
              <span className="hotspot__label">
                {petting ? 'Cleo is purring' : 'Cleo'}
              </span>
            </button>
            {setup.map((g) => (
              <a
                key={g.id}
                className="hotspot hotspot--gear"
                style={pct(regions[g.id])}
                href={g.url}
                tabIndex={compact ? -1 : 0}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="hotspot__label">{g.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      {focus && (
        <button className="room__back" onClick={() => go(null)}>
          back to the room <span aria-hidden="true">esc</span>
        </button>
      )}
      {focus && (
        <section
          key={focus}
          ref={panelRef}
          tabIndex={-1}
          role="region"
          aria-labelledby="room-panel-title"
          inert={!settled}
          aria-hidden={!settled}
          className={`onobject onobject--${focus}${settled ? ' is-on' : ''}`}
          style={panelStyle}
        >
          {focus === 'monitor' ? (
            <Screen />
          ) : focus === 'paper' ? (
            <Paper />
          ) : (
            <Shelf onHighlight={setHotBook} />
          )}
        </section>
      )}
      <footer ref={chromeRef} className="room__chrome">
        <a className="room__name" href="/text">
          ben adamsky <span>plain version</span>
        </a>
        <nav aria-label="Explore the room">
          {views.map(({ id, label }) => (
            <button
              key={id}
              aria-pressed={focus === id}
              onClick={(e) => go(focus === id ? null : id, e.currentTarget)}
            >
              {label}
            </button>
          ))}
          {compact && !focus && (
            <button
              onClick={pet}
              aria-label={petting ? 'Cleo is purring' : 'pet Cleo'}
            >
              cleo
            </button>
          )}
          {!reduced && (
            <button
              aria-pressed={motionPaused}
              onClick={() => {
                setMotionPaused(!motionPaused);
                stopPurr();
              }}
            >
              {motionPaused ? 'resume motion' : 'pause motion'}
            </button>
          )}
        </nav>
      </footer>
      <span className="sr-only" role="status">
        {petting ? 'Cleo is purring' : ''}
      </span>
    </main>
  );
}
