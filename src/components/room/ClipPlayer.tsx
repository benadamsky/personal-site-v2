'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface Clip {
  src: string;
  weight: number;
}
export interface ClipPlayerHandle {
  playNow: (src: string) => void;
}
interface Props {
  clips: Clip[];
  poster: string;
  className?: string;
  paused?: boolean;
}

function pick(clips: Clip[], failed: Set<string>) {
  const choices = clips.filter((c) => c.weight > 0 && !failed.has(c.src));
  let n = Math.random() * choices.reduce((sum, c) => sum + c.weight, 0);
  return choices.find((c) => (n -= c.weight) <= 0)?.src ?? choices.at(-1)?.src;
}

function ready(video: HTMLVideoElement, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const done = (error?: Error) => {
      clearTimeout(timer);
      video.removeEventListener('canplay', loaded);
      video.removeEventListener('error', failed);
      signal.removeEventListener('abort', aborted);
      if (error) reject(error);
      else resolve();
    };
    const loaded = () => done();
    const failed = () => done(new Error('Media could not be decoded'));
    const aborted = () => done(new Error('Media wait cancelled'));
    const timer = setTimeout(
      () => done(new Error('Media load timed out')),
      12000
    );
    video.addEventListener('canplay', loaded);
    video.addEventListener('error', failed);
    signal.addEventListener('abort', aborted, { once: true });
    if (signal.aborted) aborted();
    else if (video.error) failed();
    else if (video.readyState >= 3) loaded();
  });
}

// A decoded frame must exist before the incoming video is exposed. Waiting for
// play() alone is insufficient on a slow decoder.
function firstFrame(video: HTMLVideoElement, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    let frame = 0;
    const finish = (error?: Error) => {
      clearTimeout(timer);
      if (frame && video.cancelVideoFrameCallback)
        video.cancelVideoFrameCallback(frame);
      signal.removeEventListener('abort', abort);
      if (error) reject(error);
      else resolve();
    };
    const abort = () => finish(new Error('Frame wait cancelled'));
    const timer = setTimeout(
      () => (video.readyState >= 2 ? finish() : finish(new Error('No frame'))),
      1500
    );
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
    else if (video.requestVideoFrameCallback)
      frame = video.requestVideoFrameCallback(() => finish());
    else requestAnimationFrame(() => requestAnimationFrame(() => finish()));
  });
}

const ClipPlayer = forwardRef<ClipPlayerHandle, Props>(function ClipPlayer(
  { clips, poster, className, paused = false },
  ref
) {
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const pausedRef = useRef(paused);
  const api = useRef({ playNow: (_src: string) => {}, syncPause: () => {} });
  useImperativeHandle(
    ref,
    () => ({ playNow: (src) => api.current.playNow(src) }),
    []
  );

  useEffect(() => {
    pausedRef.current = paused;
    api.current.syncPause();
  }, [paused]);

  useEffect(() => {
    if (!a.current || !b.current || !clips.length) return;
    const videos = [a.current, b.current];
    const controller = new AbortController();
    const { signal } = controller;
    const failed = new Set<string>();
    const sources = ['', ''];
    let active = 0;
    let shown = false;
    let busy = false;
    let incomingIndex = 0;
    let pending: string | undefined;
    let timer: ReturnType<typeof setTimeout>;
    let generation = 0;
    const isPaused = () => pausedRef.current || document.hidden;
    const load = (i: number, src: string) => {
      sources[i] = src;
      videos[i].src = src;
      videos[i].load();
    };
    const prepare = () => {
      const src = pick(clips, failed);
      if (src) load(1 - active, src);
    };

    const advance = async (requested?: string) => {
      if (signal.aborted) return;
      if (busy || isPaused()) {
        if (requested) pending = requested;
        return;
      }
      busy = true;
      const token = ++generation;
      const from = active;
      const to = shown ? 1 - from : from;
      incomingIndex = to;
      const incoming = videos[to];
      const outgoing = videos[from];
      let src: string | undefined =
        requested ?? sources[to] ?? pick(clips, failed);
      if (!src || failed.has(src)) src = pick(clips, failed);
      if (!src) {
        busy = false;
        return;
      }
      if (requested && shown) outgoing.pause();
      if (sources[to] !== src) load(to, src);
      const valid = () => !signal.aborted && token === generation;
      try {
        await ready(incoming, signal);
        if (!valid()) return;
        if (isPaused()) {
          if (requested) pending = requested;
          busy = false;
          return;
        }
        incoming.currentTime = 0;
        await incoming.play();
        await firstFrame(incoming, signal);
        if (!valid()) return;
        if (isPaused()) {
          incoming.pause();
          if (requested) pending = requested;
          busy = false;
          return;
        }
        const duration = !shown ? 500 : requested ? 450 : 160;
        // Only incoming opacity changes. The outgoing frame is an opaque floor.
        incoming.style.transition = `opacity ${duration}ms ease`;
        incoming.style.zIndex = '2';
        incoming.style.opacity = '1';
        active = to;
        shown = true;
        timer = setTimeout(() => {
          if (!valid()) return;
          if (from !== to) {
            outgoing.pause();
            outgoing.style.transition = 'none';
            outgoing.style.opacity = '0';
            outgoing.style.zIndex = '0';
          }
          incoming.style.zIndex = '1';
          busy = false;
          prepare();
          if (pending) {
            const next = pending;
            pending = undefined;
            void advance(next);
          }
          syncPause();
        }, duration + 40);
      } catch (error) {
        if (!valid()) return;
        incoming.pause();
        busy = false;
        // pause() may abort a pending play(). It does not make the file bad.
        if (
          isPaused() ||
          (error instanceof DOMException && error.name === 'AbortError')
        ) {
          if (requested) pending = requested;
          if (!isPaused()) syncPause();
          return;
        }
        // Autoplay restrictions are a stable poster fallback, not a retry loop.
        if (error instanceof DOMException && error.name === 'NotAllowedError')
          return;
        failed.add(src);
        const replacement = pick(clips, failed);
        if (replacement) {
          load(to, replacement);
          void advance();
        }
        // Once every clip fails, leave the last good frame/poster visible.
      }
    };

    const syncPause = () => {
      if (isPaused()) videos.forEach((v) => v.pause());
      else if (busy) {
        videos[incomingIndex].play().catch(() => {});
      } else {
        if (pending) {
          const next = pending;
          pending = undefined;
          void advance(next);
        } else if (!shown || videos[active].ended) void advance();
        else videos[active].play().catch(() => {});
      }
    };
    const onEnded = (event: Event) => {
      if (event.currentTarget === videos[active] && !busy) void advance();
    };
    const onError = (event: Event) => {
      const i = videos.indexOf(event.currentTarget as HTMLVideoElement);
      failed.add(sources[i]);
      if (i === active && !busy) void advance();
    };
    videos.forEach((v) => {
      v.addEventListener('ended', onEnded);
      v.addEventListener('error', onError);
    });
    document.addEventListener('visibilitychange', syncPause);
    api.current = { playNow: (src) => void advance(src), syncPause };
    load(0, clips[0].src);
    void advance();
    return () => {
      generation++;
      controller.abort();
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', syncPause);
      videos.forEach((v) => {
        v.pause();
        v.removeEventListener('ended', onEnded);
        v.removeEventListener('error', onError);
        v.removeAttribute('src');
        v.load();
      });
      api.current = { playNow: () => {}, syncPause: () => {} };
    };
  }, [clips]);

  return (
    <div className={className} aria-hidden="true">
      {/* The poster remains beneath both decoders, including autoplay failures. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" draggable={false} className="room__media" />
      <video
        ref={a}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="room__media"
        style={{ opacity: 0 }}
      />
      <video
        ref={b}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="room__media"
        style={{ opacity: 0 }}
      />
    </div>
  );
});
export default ClipPlayer;
