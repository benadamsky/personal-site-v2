#!/bin/sh
# Extract review frames from a clip: first, quarter, half, three-quarter, last,
# plus a contact sheet across the loop seam. Usage: scripts/video-frames.sh <clip.mp4> <out-dir>
set -e
in="$1"; out="$2"; mkdir -p "$out"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
for f in 0 0.25 0.5 0.75 0.98; do
  t=$(echo "$dur * $f" | bc -l)
  ffmpeg -y -loglevel error -ss "$t" -i "$in" -frames:v 1 "$out/frame_$f.png"
done
# seam: last 0.6s + first 0.6s, 4 frames each
ffmpeg -y -loglevel error -ss "$(echo "$dur - 0.6" | bc -l)" -i "$in" -t 0.6 -vf "fps=6,scale=480:-1,tile=4x1" "$out/seam_tail.png"
ffmpeg -y -loglevel error -i "$in" -t 0.6 -vf "fps=6,scale=480:-1,tile=4x1" "$out/seam_head.png"
echo "duration $dur"; ls "$out"
