import type { Clip } from './ClipPlayer';

// Everything here is in percent of the scene image (0..100), so it survives
// any viewport size. Tune against the current master.
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SCENE_ASPECT = 16 / 9;
export const OVERSCAN = 1.18;

export const media = {
  // Reduced-motion / no-video fallback, tone-matched to the clips.
  still: '/room.jpg',
  // Sharp copy used while the camera is pushed in on an object.
  detail: '/room-4k.jpg',
  // Same frame every clip opens and closes on, so poster -> video is a no-op.
  poster: '/room-poster.jpg',
  // Event clips. Each begins and ends on the poster frame; the player chains
  // them at random. Drop a new clip in public/clips and list it here.
  clips: [
    { src: '/clips/idle.mp4', weight: 5 },
    { src: '/clips/work.mp4', weight: 4 },
    { src: '/clips/lean.mp4', weight: 1 }
  ] as Clip[]
};
export const hasVideo = media.clips.length > 0;

// Petting Cleo: dissolve into this clip and purr. It is not in the random
// rotation: she lifts her head and looks back, which reads as a response to
// being touched, not as something a sleeping cat does on her own.
export const cat = {
  name: 'Cleo',
  reaction: '/clips/cat-twitch.mp4',
  purr: '/sfx/purr.mp3'
};

export const regions = {
  window: { x: 72.5, y: 0, w: 23.5, h: 70 },
  cat: { x: 77, y: 63, w: 17.5, h: 15 },
  candle: { x: 4.5, y: 74.5, w: 5, h: 11 },
  lamp: { x: 62, y: 46, w: 6.5, h: 10 },
  shelf: { x: 0.5, y: 1, w: 24.5, h: 70 },
  monitor: { x: 27, y: 39.5, w: 32, h: 32 },
  // the part of the screen not hidden behind his head
  screen: { x: 45, y: 41.5, w: 13.2, h: 28 },
  photo: { x: 64.5, y: 72.5, w: 6.5, h: 9 },
  headphones: { x: 56.8, y: 58, w: 7.7, h: 22 },
  mouse: { x: 62, y: 81.5, w: 5.5, h: 7.5 },
  keyboard: { x: 55, y: 80.5, w: 3, h: 5.5 },
  // the sheet of paper on the desk (bounding box), and its inner face
  paper: { x: 70.6, y: 81, w: 14, h: 9 },
  paperFace: { x: 71.6, y: 82.2, w: 12, h: 7.2 },
  // wall beside the shelf, where a chosen book's note is written
  wall: { x: 30.5, y: 5, w: 24, h: 33 }
} satisfies Record<string, Rect>;

export type Focus = 'monitor' | 'shelf' | 'paper';
export const focusRect: Record<Focus, Rect> = {
  monitor: regions.monitor,
  shelf: { x: 0.5, y: 4, w: 24.5, h: 67 },
  paper: { x: 68.5, y: 78.5, w: 18.5, h: 13.5 }
};
// how far the camera may push in on each object
export const focusMaxScale: Record<Focus, number> = { monitor: 3.6, shelf: 3.6, paper: 5 };

// Book spines, left to right, top shelf first. Index = position in books.ts.
export const spines: Rect[] = [
  // top shelf
  { x: 0.9, y: 5.1, w: 2.7, h: 17.6 },
  { x: 3.6, y: 5.1, w: 2.5, h: 17.6 },
  { x: 6.1, y: 5.1, w: 3.1, h: 17.6 },
  { x: 9.2, y: 5.1, w: 2.7, h: 17.6 },
  { x: 11.9, y: 5.1, w: 2.8, h: 17.6 },
  { x: 14.7, y: 5.1, w: 2.6, h: 17.6 },
  { x: 17.3, y: 5.1, w: 2.7, h: 17.6 },
  { x: 20.0, y: 8.3, w: 2.7, h: 14.4 },
  // middle shelf
  { x: 0.9, y: 29.6, w: 2.2, h: 17.6 },
  { x: 3.1, y: 29.6, w: 2.6, h: 17.6 },
  { x: 5.7, y: 29.6, w: 2.1, h: 17.6 },
  { x: 7.8, y: 29.6, w: 3.1, h: 17.6 },
  { x: 10.9, y: 29.6, w: 2.7, h: 17.6 },
  { x: 13.6, y: 29.6, w: 3.1, h: 17.6 },
  { x: 16.7, y: 29.6, w: 2.8, h: 17.6 },
  { x: 19.5, y: 29.6, w: 2.9, h: 17.6 },
  { x: 22.4, y: 29.6, w: 2.6, h: 17.6 },
  // bottom shelf
  { x: 0.9, y: 52.8, w: 2.6, h: 17.6 },
  { x: 3.5, y: 52.8, w: 2.2, h: 17.6 },
  { x: 5.7, y: 52.8, w: 2.5, h: 17.6 },
  { x: 8.2, y: 52.8, w: 2.5, h: 17.6 },
  { x: 10.7, y: 52.8, w: 2.7, h: 17.6 },
  { x: 13.4, y: 52.8, w: 2.5, h: 17.6 },
  { x: 15.9, y: 52.8, w: 2.6, h: 17.6 },
  { x: 18.5, y: 52.8, w: 2.6, h: 17.6 }
];
