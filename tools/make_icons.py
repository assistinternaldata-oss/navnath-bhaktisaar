"""Draw the app icon and export the PNG sizes the PWA needs (uses Inkscape).

    python tools/make_icons.py
"""
import math
import shutil
import subprocess
from pathlib import Path

APP = Path(__file__).resolve().parent.parent
OUT = APP / "icons"
SRC = APP / "tools" / "icon-src"


def svg(maskable: bool) -> str:
    size, c = 512, 256
    rays = []
    for k in range(36):
        a = math.radians(k * 10)
        w = math.radians(2.2)
        r = 420
        x1, y1 = c + r * math.cos(a - w), c + r * math.sin(a - w)
        x2, y2 = c + r * math.cos(a + w), c + r * math.sin(a + w)
        rays.append(f'<path d="M{c},{c} L{x1:.1f},{y1:.1f} L{x2:.1f},{y2:.1f} Z"/>')
    clip = '' if maskable else '<clipPath id="r"><rect width="512" height="512" rx="112"/></clipPath>'
    group_attr = '' if maskable else ' clip-path="url(#r)"'
    disc = 150 if maskable else 166
    font = 132 if maskable else 146
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="#f6a640"/>
      <stop offset="0.55" stop-color="#b4400f"/>
      <stop offset="1" stop-color="#6e1a12"/>
    </radialGradient>
    <radialGradient id="disc" cx="50%" cy="40%" r="65%">
      <stop offset="0" stop-color="#fffaf0"/>
      <stop offset="1" stop-color="#f7e3c4"/>
    </radialGradient>
    {clip}
  </defs>
  <g{group_attr}>
    <rect width="512" height="512" fill="url(#bg)"/>
    <g fill="#ffe2b0" opacity="0.16">{''.join(rays)}</g>
    <circle cx="256" cy="256" r="{disc + 16}" fill="none" stroke="#f3c77a" stroke-width="4" opacity="0.7"/>
    <circle cx="256" cy="256" r="{disc}" fill="url(#disc)" stroke="#e7b864" stroke-width="7"/>
    <text x="256" y="{256 + font * 0.30:.0f}" text-anchor="middle" font-family="Nirmala UI" font-weight="700"
          font-size="{font}" fill="#7a1c12">नाथ</text>
  </g>
</svg>
'''


def main():
    inkscape = shutil.which("inkscape") or r"C:\Program Files\Inkscape\bin\inkscape.exe"
    SRC.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(exist_ok=True)
    (SRC / "icon.svg").write_text(svg(False), encoding="utf8")
    (SRC / "icon-maskable.svg").write_text(svg(True), encoding="utf8")
    jobs = [
        ("icon.svg", "icon-512.png", 512),
        ("icon.svg", "icon-192.png", 192),
        ("icon.svg", "favicon-48.png", 48),
        ("icon-maskable.svg", "icon-maskable-512.png", 512),
        ("icon-maskable.svg", "apple-touch-icon.png", 180),
    ]
    for src, dst, px in jobs:
        subprocess.run([inkscape, str(SRC / src), "--export-type=png",
                        f"--export-filename={OUT / dst}", f"--export-width={px}",
                        f"--export-height={px}"], check=True, capture_output=True)
        print("wrote", dst)


if __name__ == "__main__":
    main()
