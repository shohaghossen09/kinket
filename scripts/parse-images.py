#!/usr/bin/env python3
"""Parse image-search JSON files (strip CLI preamble), pick best image per category by resolution."""
import json, glob, os

def load(path):
    raw = open(path, encoding="utf-8").read()
    # JSON starts at first '{' line
    idx = raw.find("{")
    if idx == -1:
        return None
    try:
        return json.loads(raw[idx:])
    except Exception as e:
        print(f"  parse error in {path}: {e}")
        return None

def px(v):
    try:
        return int(str(v).replace("px", ""))
    except Exception:
        return 0

picks = {}
for f in sorted(glob.glob("/home/z/my-project/scripts/img/*.json")):
    cat = os.path.basename(f).replace(".json", "")
    d = load(f)
    if not d or not d.get("success") or not d.get("results"):
        print(f"{cat}: NO RESULTS")
        continue
    print(f"{cat}:")
    for i, r in enumerate(d["results"]):
        w, h = px(r.get("original_width")), px(r.get("original_height"))
        print(f"  [{i}] {w}x{h}  {r['original_url']}")
    # pick largest area landscape-ish (prefer width >= 1000)
    best = max(d["results"], key=lambda r: px(r.get("original_width", 0)) * px(r.get("original_height", 0)))
    picks[cat] = best["original_url"]

print("\n=== PICKS ===")
for k, v in picks.items():
    print(k, v)
json.dump(picks, open("/home/z/my-project/scripts/img/picks.json", "w"), indent=2)
