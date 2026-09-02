// Everything here is in percent of the scene image (0..100), so it survives
// any viewport size. Measured against public/room.jpg (1672x941).
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SCENE_ASPECT = 1672 / 941;
export const OVERSCAN = 1.18;

export const media = {
  poster: '/room.jpg',
  video: undefined as string | undefined
};

export const regions: Record<
  'window' | 'cat' | 'candle' | 'lamp' | 'shelf' | 'monitor' | 'photo',
  Rect
> = {
  window: { x: 72.8, y: 0, w: 22.8, h: 69 },
  cat: { x: 76.5, y: 62.5, w: 17.5, h: 15 },
  candle: { x: 4.5, y: 74, w: 5, h: 11 },
  lamp: { x: 62, y: 46, w: 6.5, h: 10 },
  shelf: { x: 0.5, y: 1, w: 24.5, h: 70 },
  monitor: { x: 28, y: 40, w: 31, h: 31 },
  photo: { x: 60, y: 69, w: 7.5, h: 10 }
};
