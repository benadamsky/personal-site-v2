#!/bin/sh
# Normalize a raw fal clip into a room event clip.
#
# Seedance renders frame 0 at the input still's tone, then brightens ~7% over
# the first 0.75s and holds; the last frames drift toward the end image. So
# the rest frame every clip dissolves from/to is NOT the master still: it is
# a frame from a clip body, gain-matched to the body mean (hero/rest.png).
#
# Pass 1 (cached as <raw>.body.mp4): trim ramp and drift, interpolate 24 -> 48.
# Pass 2: composite the body over the looping rest frame with its alpha faded
#         in at the head and out at the tail. Every clip therefore opens and
#         closes on identical rest pixels, and the player can hard-cut.
#
# Usage: scripts/clip-normalize.sh <rest.png> <raw.mp4> <out.mp4>
set -e
rest="$1"; raw="$2"; out="$3"
TRIM=0.75   # head ramp to drop
TAIL=0.25   # tail drift to drop
LEAD=0.05   # pure rest before the dissolve begins / after it ends
FADE=0.25   # dissolve length
body="${raw%.mp4}.body.mp4"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$raw")
cut=$(printf "%.3f" "$(echo "$dur - $TRIM - $TAIL" | bc -l)")
[ -f "$body" ] || ffmpeg -y -loglevel error -ss "$TRIM" -t "$cut" -i "$raw" \
  -vf "scale=1920:1080:flags=lanczos,minterpolate=fps=48:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,format=yuv420p,setsar=1" \
  -an -r 48 -c:v libx264 -preset fast -crf 16 "$body"
blen=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$body")
total=$(printf "%.3f" "$(echo "$blen + 2 * $LEAD" | bc -l)")
# end the fade slightly before the container duration so the last body frame is fully transparent
fout=$(printf "%.3f" "$(echo "$blen - $FADE - 0.05" | bc -l)")
ffmpeg -y -loglevel error \
  -loop 1 -framerate 48 -t "$total" -i "$rest" \
  -i "$body" \
  -filter_complex "\
[0:v]scale=1920:1080:flags=lanczos,format=yuv420p,setsar=1,fps=48[bg];\
[1:v]format=yuva420p,setsar=1,fps=48,fade=t=in:st=0:d=${FADE}:alpha=1,fade=t=out:st=${fout}:d=${FADE}:alpha=1,setpts=PTS+${LEAD}/TB[fg];\
[bg][fg]overlay=eof_action=pass:repeatlast=0:format=yuv420[v]" \
  -map "[v]" -an -r 48 -t "$total" -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -movflags +faststart "$out"
