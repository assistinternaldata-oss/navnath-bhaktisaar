"""Draw the source images for the Android/iOS app icons and splash screens (uses Inkscape),
then run `npm run assets` to turn them into every size both stores need.

    python tools/make_app_assets.py && npm run assets
"""
import math
import shutil
import subprocess
from pathlib import Path

APP = Path(__file__).resolve().parent.parent
OUT = APP / "assets"
SRC = APP / "tools" / "icon-src"

GRADIENT = '''<radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="#f6a640"/><stop offset="0.55" stop-color="#b4400f"/><stop offset="1" stop-color="#6e1a12"/>
    </radialGradient>
    <radialGradient id="disc" cx="50%" cy="40%" r="65%">
      <stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#f7e3c4"/>
    </radialGradient>'''


def rays(c, r, n=36, half_deg=2.2):
    out = []
    for k in range(n):
        a, w = math.radians(k * 360 / n), math.radians(half_deg)
        x1, y1 = c + r * math.cos(a - w), c + r * math.sin(a - w)
        x2, y2 = c + r * math.cos(a + w), c + r * math.sin(a + w)
        out.append(f'<path d="M{c},{c} L{x1:.1f},{y1:.1f} L{x2:.1f},{y2:.1f} Z"/>')
    return "".join(out)


def emblem(c, disc):
    """Cream disc with नाथ, centred at (c, c)."""
    font = disc * 0.88
    return f'''<circle cx="{c}" cy="{c}" r="{disc * 1.1:.0f}" fill="none" stroke="#f3c77a" stroke-width="{disc * 0.026:.1f}" opacity="0.7"/>
    <circle cx="{c}" cy="{c}" r="{disc}" fill="url(#disc)" stroke="#e7b864" stroke-width="{disc * 0.045:.1f}"/>
    <text x="{c}" y="{c + font * 0.30:.0f}" text-anchor="middle" font-family="Nirmala UI" font-weight="700"
          font-size="{font:.0f}" fill="#7a1c12">नाथ</text>'''


def svg(size, body, defs=GRADIENT):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">
  <defs>{defs}</defs>{body}</svg>'''


def background(size):
    c = size / 2
    return f'<rect width="{size}" height="{size}" fill="url(#bg)"/><g fill="#ffe2b0" opacity="0.16">{rays(c, size * 0.82)}</g>'


def main():
    inkscape = shutil.which("inkscape") or r"C:\Program Files\Inkscape\bin\inkscape.exe"
    SRC.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(exist_ok=True)
    files = {
        # iOS + legacy Android: full-bleed square (the systems round the corners)
        "icon-only": svg(1024, background(1024) + emblem(512, 300)),
        # Android adaptive icon: the launcher crops to a circle/squircle, keep the emblem in the middle 2/3
        "icon-foreground": svg(1024, emblem(512, 250)),
        "icon-background": svg(1024, background(1024)),
        # splash screens (square, the systems crop to the screen)
        "splash": svg(2732, background(2732) + emblem(1366, 330)),
        "splash-dark": svg(2732, f'<rect width="2732" height="2732" fill="#14100d"/>' + emblem(1366, 330)),
    }
    for name, content in files.items():
        src = SRC / f"{name}.svg"
        src.write_text(content, encoding="utf8")
        subprocess.run([inkscape, str(src), "--export-type=png", f"--export-filename={OUT / (name + '.png')}"],
                       check=True, capture_output=True)
        print("wrote assets/" + name + ".png")


if __name__ == "__main__":
    main()
