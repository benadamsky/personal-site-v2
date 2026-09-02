'use client';
import { useEffect, useRef } from 'react';

export interface Clip {
  src: string;
  /** Relative odds of being picked next. Big events should be rare. */
  weight: number;
}

interface ClipPlayerProps {
  clips: Clip[];
  poster: string;
  className?: string;
}

// Clips share identical head/tail frames (see scripts/clip-normalize.sh), so
// this only papers over decode timing; it is not a visual crossfade.
const FADE_MS = 80;

const pick = (clips: Clip[], avoid: string[]) => {
  const pool = clips.filter((c) => !avoid.includes(c.src));
  const list = pool.length ? pool : clips;
  const total = list.reduce((n, c) => n + c.weight, 0);
  let r = Math.random() * total;
  for (const c of list) {
    r -= c.weight;
    if (r <= 0) return c.src;
  }
  return list[list.length - 1].src;
};

const ready = (v: HTMLVideoElement) =>
  v.readyState >= 3
    ? Promise.resolve()
    : new Promise<void>((res) => {
        const done = () => {
          v.removeEventListener('canplay', done);
          v.removeEventListener('error', done);
          res();
        };
        v.addEventListener('canplay', done);
        v.addEventListener('error', done);
      });

// Two stacked <video>s. Every clip starts and ends on the same rest frame, so
// when one ends we start the other and fade it over in a few frames. Adding an
// event to the room is just adding a clip to the list.
const ClipPlayer = ({ clips, poster, className }: ClipPlayerProps) => {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vids = [a.current, b.current];
    if (!vids[0] || !vids[1] || clips.length === 0) return;
    let active = 0;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const name = (v: HTMLVideoElement) => v.src.split('/').pop() ?? '';
    const load = (v: HTMLVideoElement, src: string) => {
      v.src = src;
      v.load();
    };
    const show = (i: number) => {
      vids[i]!.style.opacity = '1';
      vids[1 - i]!.style.opacity = '0';
    };

    const first = pick(clips, []);
    load(vids[0], first);
    load(vids[1], pick(clips, [first]));
    show(0);
    vids[0].play().catch(() => {
      /* autoplay blocked: poster stays */
    });

    const onEnded = async () => {
      if (!alive) return;
      const cur = vids[active]!;
      const nxt = vids[1 - active]!;
      await ready(nxt);
      if (!alive) return;
      try {
        await nxt.play();
      } catch {
        cur.currentTime = 0;
        cur.play().catch(() => {});
        return;
      }
      active = 1 - active;
      show(active);
      // Only touch the finished video once it is fully faded out, otherwise
      // resetting its src blanks it mid-fade and the room flashes.
      timer = setTimeout(() => {
        if (alive) load(cur, pick(clips, [name(cur), name(nxt)]));
      }, FADE_MS + 60);
    };

    // A clip that fails to load (404, decode error) is swapped for another so
    // the room never freezes on a broken file.
    const onError = (e: Event) => {
      if (!alive) return;
      const v = e.currentTarget as HTMLVideoElement;
      const other = vids[1 - vids.indexOf(v)]!;
      const pool = clips.filter((c) => !c.src.endsWith(name(v)) && !c.src.endsWith(name(other)));
      if (pool.length === 0) return;
      load(v, pick(pool, []));
      if (vids.indexOf(v) === active) v.play().catch(() => {});
    };

    vids.forEach((v) => {
      v!.addEventListener('ended', onEnded);
      v!.addEventListener('error', onError);
    });
    return () => {
      alive = false;
      clearTimeout(timer);
      vids.forEach((v) => {
        v!.removeEventListener('ended', onEnded);
        v!.removeEventListener('error', onError);
      });
    };
  }, [clips]);

  const common = {
    className,
    muted: true,
    playsInline: true,
    preload: 'auto' as const,
    disablePictureInPicture: true,
    style: { transition: `opacity ${FADE_MS}ms linear` }
  };
  return (
    <>
      <video ref={a} {...common} poster={poster} style={{ ...common.style, opacity: 1 }} />
      <video ref={b} {...common} style={{ ...common.style, opacity: 0 }} />
    </>
  );
};

export default ClipPlayer;
