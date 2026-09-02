#!/bin/sh
# Normalize a raw fal clip into a room event clip.
#
# Seedance renders frame 0 at the input still's tone, then brightens ~7% over
# the first 0.75s and stays there. So the rest frame every clip dissolves
# from/to is NOT the master still: it is a frame from a clip body (see
# scripts/room-clips.mjs, REST). We trim the ramp off the head, then dissolve
# rest -> body at the start and body -> rest at the end, and interpolate to
# 48fps. Any two clips then meet on identical pixels at the same tone.
#
# Usage: scripts/clip-normalize.sh <rest.png> <raw.mp4> <out.mp4>
set -e
rest="$1"; raw="$2"; out="$3"
TRIM=0.75   # head ramp to drop
HOLD=0.3    # rest-frame hold at each end
FADE=0.25   # dissolve length
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$raw")
body=$(printf "%.3f" "$(echo "$dur - $TRIM" | bc -l)")
off1=$(printf "%.3f" "$(echo "$HOLD - $FADE" | bc -l)")
off2=$(printf "%.3f" "$(echo "$HOLD + $body - 2 * $FADE" | bc -l)")
ffmpeg -y -loglevel error \
  -loop 1 -framerate 48 -t "$HOLD" -i "$rest" \
  -ss "$TRIM" -i "$raw" \
  -loop 1 -framerate 48 -t "$HOLD" -i "$rest" \
  -filter_complex "\
[0:v]scale=1920:1080:flags=lanczos,format=yuv420p,setsar=1[p0];\
[2:v]scale=1920:1080:flags=lanczos,format=yuv420p,setsar=1[p1];\
[1:v]scale=1920:1080:flags=lanczos,minterpolate=fps=48:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,format=yuv420p,setsar=1[c];\
[p0][c]xfade=transition=fade:duration=${FADE}:offset=${off1}[a];\
[a][p1]xfade=transition=fade:duration=${FADE}:offset=${off2}[v]" \
  -map "[v]" -an -r 48 -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -movflags +faststart "$out"
