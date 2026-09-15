#!/usr/bin/env python3
"""Relight the sharp stills to the clips' rest frame.

The clips come out of Seedance with their own lighting (brighter window and
candle than the master), and every clip starts and ends on public/room-poster.jpg.
The stills that sit over the video (room-4k.jpg while pushed in, room.jpg as the
no-video fallback) have to carry the same lighting, or the room dims every time
something comes into focus. This multiplies the master by a smoothed, low
frequency ratio map of poster / master, per channel, so the detail stays and
only the light changes.

Run after regenerating clips or the poster:
  python3 scripts/room-relight.py <master-4k.png>
Needs numpy and pillow.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

PUBLIC = Path(__file__).resolve().parent.parent / 'public'
GRID = (48, 27)  # lighting grid; coarse enough that no structure comes through
CLAMP = (0.6, 1.7)  # highlights that moved (the candle) are not chased fully


def main(master: str) -> None:
    src = Image.open(master).convert('RGB')
    poster = Image.open(PUBLIC / 'room-poster.jpg').convert('RGB')
    low = lambda im: np.asarray(im.resize(GRID, Image.BOX)).astype(float)
    ratio = np.clip((low(poster) + 2) / (low(src) + 2), *CLAMP)
    w, h = src.size
    field = np.stack(
        [np.asarray(Image.fromarray(ratio[..., c].astype('float32'), mode='F').resize((w, h), Image.BICUBIC)) for c in range(3)],
        axis=2
    )
    out = Image.fromarray(np.clip(np.asarray(src).astype(float) * field, 0, 255).astype('uint8'))
    out.save(PUBLIC / 'room-4k.jpg', quality=84, optimize=True, progressive=True)
    out.resize((2560, 1440), Image.LANCZOS).save(PUBLIC / 'room.jpg', quality=85, optimize=True, progressive=True)
    check = lambda im: np.asarray(im.resize((64, 36), Image.BOX)).astype(float)
    before = np.abs(check(src) - check(poster)).mean()
    after = np.abs(check(out) - check(poster)).mean()
    print(f'tone gap to the poster: {before:.2f} -> {after:.2f} (mean abs, 0-255)')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
