// Room sound. Everything runs through Web Audio gain nodes because iOS
// ignores HTMLMediaElement.volume, so fades done that way play at full
// volume on phones. All entry points must be called from a user gesture the
// first time (autoplay policy); the room only calls them from clicks.

interface Track {
  el: HTMLAudioElement;
  gain: GainNode;
}

let ctx: AudioContext | null = null;
const tracks = new Map<string, Track>();

const context = () => {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
};

const track = (src: string, loop: boolean): Track => {
  const had = tracks.get(src);
  if (had) return had;
  const c = context();
  const el = new Audio(src);
  el.loop = loop;
  el.preload = 'auto';
  const gain = c.createGain();
  gain.gain.value = 0;
  c.createMediaElementSource(el).connect(gain).connect(c.destination);
  const t = { el, gain };
  tracks.set(src, t);
  return t;
};

const ramp = (g: GainNode, to: number, secs: number) => {
  const now = context().currentTime;
  g.gain.cancelScheduledValues(now);
  g.gain.setValueAtTime(g.gain.value, now);
  g.gain.linearRampToValueAtTime(to, now + secs);
};

/** A looping bed (rain on the window). Fades in and out. */
export const ambient = {
  start(src: string, level = 0.35) {
    const t = track(src, true);
    t.el.play().catch(() => {});
    ramp(t.gain, level, 1.5);
  },
  stop(src: string) {
    const t = tracks.get(src);
    if (!t) return;
    ramp(t.gain, 0, 0.8);
    setTimeout(() => {
      if (t.gain.gain.value < 0.01) t.el.pause();
    }, 900);
  }
};

interface OneShot {
  level?: number;
  duration?: number;
  fadeIn?: number;
  fadeOut?: number;
}

/** A one-shot with an envelope (the purr). Calls `onEnd` when it is over. */
export const play = (src: string, { level = 0.5, duration = 6500, fadeIn = 900, fadeOut = 1500 }: OneShot, onEnd?: () => void) => {
  const t = track(src, true);
  const c = context();
  t.el.currentTime = 0;
  t.el.play().catch(() => {});
  ramp(t.gain, level, fadeIn / 1000);
  const off = c.currentTime + (duration - fadeOut) / 1000;
  t.gain.gain.setValueAtTime(level, off);
  t.gain.gain.linearRampToValueAtTime(0, off + fadeOut / 1000);
  setTimeout(() => {
    t.el.pause();
    onEnd?.();
  }, duration);
};
