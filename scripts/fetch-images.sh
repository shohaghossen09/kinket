#!/bin/bash
# Fetch premium imagery for the creative studio site via z-ai image-search.
# Runs queries in parallel, saves raw JSON stdout to /home/z/my-project/scripts/img/.

set -u
OUT=/home/z/my-project/scripts/img
mkdir -p "$OUT"

q() { z-ai image-search -q "$1" --count 4 --gl us --no-rank > "$OUT/$2.json" 2>"$OUT/$2.err"; }

q "abstract 3D render flowing chrome liquid metal sculpture on dark background" chrome &
q "modern dark analytics dashboard user interface on computer screen" dashboard &
q "premium fashion e-commerce mobile app on smartphone dark elegant" ecommerce &
q "artificial intelligence neural network abstract glowing visualization dark background" ai &
wait
q "creative digital design studio team working modern office moody" studio &
q "abstract holographic iridescent gradient 3D shapes art" holo &
wait
echo "done"
