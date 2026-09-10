#!/usr/bin/env python3
"""Download picked images into public/images/ with clean names, verify integrity."""
import json, os, urllib.request

picks = json.load(open("/home/z/my-project/scripts/img/picks.json"))
out = "/home/z/my-project/public/images"
os.makedirs(out, exist_ok=True)

name_map = {
    "chrome": "work-aether.jpg",
    "dashboard": "work-pulse.jpg",
    "ecommerce": "work-velour.jpg",
    "ai": "work-cortex.jpg",
    "holo": "showcase-holo.jpg",
    "studio": "about-studio.jpg",
}

for cat, url in picks.items():
    fname = name_map.get(cat, f"{cat}.jpg")
    dest = os.path.join(out, fname)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
            f.write(r.read())
        size = os.path.getsize(dest)
        # verify it's a real image via header sniff
        with open(dest, "rb") as f:
            head = f.read(12)
        kind = "unknown"
        if head.startswith(b"\xff\xd8\xff"):
            kind = "jpeg"
        elif head[:8] == b"\x89PNG\r\n\x1a\n":
            kind = "png"
        elif head[:6] in (b"GIF87a", b"GIF89a"):
            kind = "gif"
        print(f"{fname}: {size/1024:.0f}KB {kind}")
    except Exception as e:
        print(f"{fname}: FAILED {e}")
