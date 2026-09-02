#!/bin/sh
# Normalize a raw fal clip into a room event clip:
#   - scale to 1920x1080, motion-interpolate 24 -> 48 fps
#   - dissolve from the shared poster frame at the head and back into it at
#     the tail, so every clip starts and ends on identical pixels and the
#     player can cut between clips with no visible seam
# Usage: scripts/clip-normalize.sh <poster.png> <raw.mp4> <out.mp4>
set -e
poster="$1"; raw="$2"; out="$3"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$raw")
# poster hold 0.3s, dissolve 0.25s each end
off2=$(echo "$dur + 0.3 - 0.25 - 0.25" | bc -l)
ffmpeg -y -loglevel error \
  -loop 1 -framerate 48 -t 0.3 -i "$poster" \
  -i "$raw" \
  -loop 1 -framerate 48 -t 0.3 -i "$poster" \
  -filter_complex "\
[0:v]scale=1920:1080:flags=lanczos,format=yuv420p,setsar=1[p0];\
[2:v]scale=1920:1080:flags=lanczos,format=yuv420p,setsar=1[p1];\
[1:v]scale=1920:1080:flags=lanczos,minterpolate=fps=48:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,format=yuv420p,setsar=1[c];\
[p0][c]xfade=transition=fade:duration=0.25:offset=0.05[a];\
[a][p1]xfade=transition=fade:duration=0.25:offset=${off2}[v]" \
  -map "[v]" -an -r 48 -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -movflags +faststart "$out"
