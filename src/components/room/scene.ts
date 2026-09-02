import type { Clip } from './ClipPlayer';

// Everything here is in percent of the scene image (0..100), so it survives
// any viewport size. Measured against the master still; the video was
// generated from that frame so the geometry carries over (1920x1080).
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SCENE_ASPECT = 16 / 9;
export const OVERSCAN = 1.18;

export const media = {
  still: '/room.jpg',
  // Same frame every clip opens and closes on, so poster -> video is a no-op.
  poster: '/room-poster.jpg',
  // Event clips. Each begins and ends on the poster frame; the player chains
  // them at random. Drop a new clip in public/clips and list it here.
  clips: [
    { src: '/clips/idle.mp4', weight: 5 },
    { src: '/clips/work.mp4', weight: 4 },
    { src: '/clips/cat-twitch.mp4', weight: 1 },
    { src: '/clips/lean.mp4', weight: 1 }
  ] as Clip[]
};
export const hasVideo = media.clips.length > 0;

export const regions: Record<
  | 'window'
  | 'cat'
  | 'candle'
  | 'lamp'
  | 'shelf'
  | 'monitor'
  | 'photo'
  | 'headphones'
  | 'mouse'
  | 'keyboard',
  Rect
> = {
  window: { x: 72.5, y: 0, w: 23.5, h: 70 },
  cat: { x: 77, y: 62, w: 17.5, h: 15.5 },
  candle: { x: 4.5, y: 74.5, w: 5, h: 11 },
  lamp: { x: 62, y: 46, w: 6.5, h: 10 },
  shelf: { x: 0.5, y: 1, w: 24.5, h: 70 },
  monitor: { x: 27.5, y: 39.5, w: 29, h: 31 },
  photo: { x: 64.5, y: 72.5, w: 6.5, h: 9 },
  headphones: { x: 56.8, y: 58, w: 7.7, h: 22 },
  mouse: { x: 62, y: 81.5, w: 5.5, h: 7.5 },
  keyboard: { x: 55, y: 80.5, w: 3, h: 5.5 }
};
