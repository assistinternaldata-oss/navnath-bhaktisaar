"""Draw the Google Play feature graphic (1024x500) and store icon (512x512) into store/.
Uses Inkscape and the same emblem as the app icon.

    python tools/make_store_graphics.py
"""
import shutil
import subprocess
from pathlib import Path

from make_app_assets import GRADIENT, emblem, rays, background, svg

APP = Path(__file__).resolve().parent.parent
OUT = APP / "store"
SRC = APP / "tools" / "icon-src"


def feature_graphic():
    w, h, cx, cy = 1024, 500, 250, 250
    defs = GRADIENT.replace('cx="50%" cy="38%" r="75%"', 'cx="24%" cy="45%" r="95%"')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <defs>{defs}</defs>
  <rect width="{w}" height="{h}" fill="url(#bg)"/>
  <g fill="#ffe2b0" opacity="0.14" transform="translate({cx - 512},{cy - 512})">{rays(512, 1100, n=40, half_deg=1.8)}</g>
  {emblem_at(cx, cy, 148)}
  <g font-family="Nirmala UI" fill="#fff4e6" text-anchor="start">
    <text x="455" y="150" font-size="26" opacity="0.88">॥ अलख निरंजन ॥</text>
    <text x="452" y="245" font-size="70" font-weight="700">श्री नवनाथ</text>
    <text x="452" y="325" font-size="70" font-weight="700">भक्तिसार</text>
    <text x="455" y="392" font-size="27" opacity="0.92">संपूर्ण पोथी · पारायण · मंत्र-जप · हिंदी कथा</text>
  </g>
</svg>
'''


def emblem_at(cx, cy, disc):
    # emblem() centres on (c, c); shift it to (cx, cy)
    return f'<g transform="translate({cx - 500},{cy - 500})">{emblem(500, disc)}</g>'


def main():
    inkscape = shutil.which("inkscape") or r"C:\Program Files\Inkscape\bin\inkscape.exe"
    SRC.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(exist_ok=True)
    jobs = {
        "play-feature-graphic": (feature_graphic(), 1024, 500),
        # Play applies its own rounding, so the store icon is a full square like the iOS icon
        "play-icon-512": (svg(1024, background(1024) + emblem(512, 300)), 512, 512),
    }
    for name, (content, w, h) in jobs.items():
        src = SRC / f"{name}.svg"
        src.write_text(content, encoding="utf8")
        subprocess.run([inkscape, str(src), "--export-type=png", f"--export-filename={OUT / (name + '.png')}",
                        f"--export-width={w}", f"--export-height={h}", "--export-background-opacity=1"],
                       check=True, capture_output=True)
        print("wrote store/" + name + ".png")


if __name__ == "__main__":
    main()
