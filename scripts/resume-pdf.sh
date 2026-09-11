#!/usr/bin/env bash
# Print the résumé PDF from the plain page. The print rules in
# src/app/plain/page.tsx decide what is on it (the shelf and desk are not).
#   yarn build && yarn start &   # or `yarn dev`
#   scripts/resume-pdf.sh http://localhost:3000
set -euo pipefail
base="${1:-http://localhost:3000}"
out="$(dirname "$0")/../public/resume.pdf"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$chrome" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$out" "$base/plain" 2>/dev/null
ls -la "$out"
