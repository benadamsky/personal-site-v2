'use client';
import { useEffect, useRef } from 'react';

interface ClipPlayerProps {
  clips: string[];
  poster: string;
  className?: string;
}

const pick = (clips: string[], avoid?: string) => {
  const pool = clips.length > 1 ? clips.filter((c) => c !== avoid) : clips;
  return pool[Math.floor(Math.random() * pool.length)];
};

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

    const show = (i: number) => {
      vids[i]!.style.opacity = '1';
      vids[1 - i]!.style.opacity = '0';
    };
    const load = (v: HTMLVideoElement, src: string) => {
      if (v.src.endsWith(src)) return;
      v.src = src;
      v.load();
    };

    const first = pick(clips);
    load(vids[0], first);
    load(vids[1], pick(clips, first));
    show(0);
    vids[0].play().catch(() => {
      /* autoplay blocked: poster stays */
    });

    const onEnded = () => {
      if (!alive) return;
      const next = 1 - active;
      const cur = vids[active]!;
      const nxt = vids[next]!;
      nxt
        .play()
        .then(() => {
          show(next);
          active = next;
          // preload a fresh clip into the one that just finished
          load(cur, pick(clips, nxt.src.split('/').pop()));
        })
        .catch(() => cur.play());
    };
    // a missing or broken clip should not freeze the room: move on
    const onError = (e: Event) => {
      if (!alive) return;
      const v = e.currentTarget as HTMLVideoElement;
      const bad = v.src.split('/').pop();
      const rest = clips.filter((c) => !c.endsWith(bad ?? ''));
      if (rest.length === 0) return;
      load(v, rest[Math.floor(Math.random() * rest.length)]);
      if (v === vids[active]) v.play().catch(() => {});
    };
    vids.forEach((v) => {
      v!.addEventListener('ended', onEnded);
      v!.addEventListener('error', onError);
    });
    return () => {
      alive = false;
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
    disablePictureInPicture: true
  };
  return (
    <>
      <video ref={a} {...common} poster={poster} style={{ opacity: 1 }} />
      <video ref={b} {...common} style={{ opacity: 0 }} />
    </>
  );
};

export default ClipPlayer;
