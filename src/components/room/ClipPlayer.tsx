'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

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

export interface ClipPlayerHandle {
  /** Interrupt the current clip and dissolve into this one (user-triggered). */
  playNow: (src: string) => void;
  /** Hold the current frame; resume picks up where it left off. */
  pause: () => void;
  resume: () => void;
}

// Clips share identical head/tail frames (see scripts/clip-normalize.sh), so
// this only papers over decode timing; it is not a visual crossfade.
const FADE_MS = 80;

// Resolves once the video has actually put a frame on screen. play() resolving
// is earlier than that, and switching on it leaves a dark frame at the seam.
const presented = (v: HTMLVideoElement) =>
  new Promise<void>((res) => {
    const withFrames = v as HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
    };
    if (withFrames.requestVideoFrameCallback) withFrames.requestVideoFrameCallback(() => res());
    else requestAnimationFrame(() => requestAnimationFrame(() => res()));
  });

const pick = (clips: Clip[], avoid: string[]) => {
  // avoid entries may be full URLs or bare filenames
  const pool = clips.filter((c) => !avoid.some((a) => a && c.src.endsWith(a.split('/').pop() ?? a)));
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
const ClipPlayer = forwardRef<ClipPlayerHandle, ClipPlayerProps>(function ClipPlayer(
  { clips, poster, className },
  ref
) {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const api = useRef<ClipPlayerHandle>({ playNow: () => {}, pause: () => {}, resume: () => {} });
  useImperativeHandle(
    ref,
    () => ({
      playNow: (src) => api.current.playNow(src),
      pause: () => api.current.pause(),
      resume: () => api.current.resume()
    }),
    []
  );

  useEffect(() => {
    const vids = [a.current, b.current];
    if (!vids[0] || !vids[1] || clips.length === 0) return;
    let active = 0;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handle = api.current;

    const name = (v: HTMLVideoElement) => v.src.split('/').pop() ?? '';
    const load = (v: HTMLVideoElement, src: string) => {
      v.src = src;
      v.load();
    };
    // The incoming video always goes on top of the other one and fades in;
    // the outgoing one stays opaque underneath, so there is never a hole
    // between them. Both stay below everything else in the scene (which is
    // a stacking context, so -1 is still inside it).
    const show = (i: number) => {
      vids[i]!.style.zIndex = '0';
      vids[1 - i]!.style.zIndex = '-1';
      vids[i]!.style.opacity = '1';
    };
    const hide = (i: number) => {
      vids[i]!.style.opacity = '0';
    };

    // Only the first clip loads up front. The second waits until the first is
    // actually playing, so a blocked autoplay (or a slow connection) costs one
    // clip, not two.
    const first = pick(clips, []);
    load(vids[0], first);
    show(0);
    const onFirstPlaying = () => {
      vids[0]!.removeEventListener('playing', onFirstPlaying);
      if (alive && !vids[1]!.src) load(vids[1]!, pick(clips, [first]));
    };
    vids[0].addEventListener('playing', onFirstPlaying);
    vids[0].play().catch(() => {
      /* autoplay blocked: poster stays */
    });

    const onEnded = async () => {
      if (!alive) return;
      const cur = vids[active]!;
      const nxt = vids[1 - active]!;
      if (!nxt.src) load(nxt, pick(clips, [name(cur)]));
      await ready(nxt);
      if (!alive) return;
      try {
        await nxt.play();
      } catch {
        cur.currentTime = 0;
        cur.play().catch(() => {});
        return;
      }
      await presented(nxt);
      if (!alive) return;
      active = 1 - active;
      show(active);
      // Only touch the finished video once it is fully covered, otherwise
      // resetting its src blanks it mid-fade and the room flashes.
      timer = setTimeout(() => {
        if (!alive) return;
        hide(1 - active);
        load(cur, pick(clips, [name(cur), name(nxt)]));
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

    // User-triggered event: dissolve from wherever we are into the requested
    // clip. Longer fade than a seam because the frames differ.
    handle.playNow = (src) => {
      if (!alive) return;
      const cur = vids[active]!;
      const nxt = vids[1 - active]!;
      clearTimeout(timer);
      load(nxt, src);
      ready(nxt).then(() => {
        if (!alive) return;
        nxt
          .play()
          .then(() => presented(nxt))
          .then(() => {
            if (!alive) return;
            nxt.style.transition = 'opacity 450ms ease';
            active = 1 - active;
            show(active);
            timer = setTimeout(() => {
              if (!alive) return;
              cur.pause();
              hide(1 - active);
              nxt.style.transition = `opacity ${FADE_MS}ms linear`;
              load(cur, pick(clips, [name(cur), name(nxt)]));
            }, 500);
          })
          .catch(() => {});
      });
    };

    handle.pause = () => vids[active]!.pause();
    handle.resume = () => {
      if (alive) vids[active]!.play().catch(() => {});
    };

    vids.forEach((v) => {
      v!.addEventListener('ended', onEnded);
      v!.addEventListener('error', onError);
    });
    return () => {
      alive = false;
      handle.playNow = () => {};
      handle.pause = () => {};
      handle.resume = () => {};
      clearTimeout(timer);
      vids[0]!.removeEventListener('playing', onFirstPlaying);
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
      <video ref={a} {...common} poster={poster} style={{ ...common.style, opacity: 1, zIndex: 0 }} />
      <video ref={b} {...common} style={{ ...common.style, opacity: 0, zIndex: -1 }} />
    </>
  );
});

export default ClipPlayer;
