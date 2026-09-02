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
  poster: '/room.jpg',
  video: '/room.mp4' as string | undefined
};

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
  window: { x: 72.8, y: 0, w: 22.8, h: 69 },
  cat: { x: 76.5, y: 62.5, w: 17.5, h: 15 },
  candle: { x: 4.5, y: 74, w: 5, h: 11 },
  lamp: { x: 62, y: 46, w: 6.5, h: 10 },
  shelf: { x: 0.5, y: 1, w: 24.5, h: 70 },
  monitor: { x: 27.5, y: 39.5, w: 29, h: 31 },
  photo: { x: 64.3, y: 70.5, w: 6.6, h: 9.5 },
  headphones: { x: 56.5, y: 58, w: 7.5, h: 21 },
  mouse: { x: 62.3, y: 81, w: 4.8, h: 7 },
  keyboard: { x: 57.5, y: 80, w: 4.8, h: 7 }
};
