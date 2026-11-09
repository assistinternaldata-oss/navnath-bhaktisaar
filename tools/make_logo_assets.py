"""Build every icon, splash screen and store graphic from the Navnath Bhaktisaar logo.

    python tools/make_logo_assets.py      (then: npm run assets  — native icon/splash sizes)

Source: assets/logo-source.webp (transparent background). Small icons use only the emblem
(circle, trishul and book), since the title text is unreadable at icon sizes; the splash
screens, home-screen banner and Play feature graphic use the full logo.
Needs Pillow; the feature graphic also needs Inkscape (for Devanagari text).
"""
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

APP = Path(__file__).resolve().parent.parent
ASSETS, ICONS, STORE = APP / "assets", APP / "icons", APP / "store"
CREAM_IN, CREAM_OUT = (255, 251, 243), (246, 226, 192)


def load_logo():
    logo = Image.open(ASSETS / "logo-source.webp").convert("RGBA")
    full = logo.crop(logo.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox())
    # emblem = everything above the title; the top stroke of "श्री" rises beside the book's
    # ornament (x 330-450, y 630+ in the source), so blank that patch before cropping
    emblem = logo.copy()
    ImageDraw.Draw(emblem).rectangle((330, 630, 450, 700), fill=(0, 0, 0, 0))
    emblem = emblem.crop((0, 0, logo.width, 662))
    emblem = emblem.crop(emblem.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox())
    return full, emblem


def radial(size, inner=CREAM_IN, outer=CREAM_OUT):
    """Warm cream background, lighter in the middle."""
    small = Image.new("RGB", (256, 256))
    px = small.load()
    for y in range(256):
        for x in range(256):
            d = min(1.0, (((x - 128) ** 2 + (y - 118) ** 2) ** 0.5) / 181)
            px[x, y] = tuple(round(inner[i] + (outer[i] - inner[i]) * d * d) for i in range(3))
    return small.resize((size, size), Image.BICUBIC).convert("RGBA")


def place(canvas, art, width, cy=0.5):
    art = art.resize((width, round(art.height * width / art.width)), Image.LANCZOS)
    x = (canvas.width - art.width) // 2
    y = round(canvas.height * cy - art.height / 2)
    canvas.alpha_composite(art, (x, y))
    return canvas


def rounded(img, radius_frac=0.22):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, img.width - 1, img.height - 1),
                                           radius=round(img.width * radius_frac), fill=255)
    out = img.copy()
    out.putalpha(ImageChops.multiply(out.getchannel("A"), mask))
    return out


def icon(size, emblem, emblem_frac=0.80):
    return place(radial(size), emblem, round(size * emblem_frac), cy=0.52)


def main():
    full, emblem = load_logo()
    full.save(ASSETS / "logo-full.png")
    emblem.save(ASSETS / "logo-emblem.png")

    # ---- native app sources (npm run assets turns these into every Android/iOS size) ----
    icon(1024, emblem).convert("RGB").save(ASSETS / "icon-only.png")
    # adaptive icon: launchers crop to a circle/squircle, so keep the emblem small and central
    place(Image.new("RGBA", (1024, 1024), (0, 0, 0, 0)), emblem, 560, cy=0.52).save(ASSETS / "icon-foreground.png")
    radial(1024).convert("RGB").save(ASSETS / "icon-background.png")
    splash = place(radial(2732), full, 1000, cy=0.48).convert("RGB")
    splash.save(ASSETS / "splash.png")
    splash.save(ASSETS / "splash-dark.png")  # the logo's maroon text needs a light background

    # ---- website / installable web app ----
    rounded(icon(512, emblem)).save(ICONS / "icon-512.png")
    rounded(icon(512, emblem)).resize((192, 192), Image.LANCZOS).save(ICONS / "icon-192.png")
    rounded(icon(512, emblem, 0.86)).resize((48, 48), Image.LANCZOS).save(ICONS / "favicon-48.png")
    icon(512, emblem, 0.66).save(ICONS / "icon-maskable-512.png")  # safe zone = middle 80%
    icon(512, emblem, 0.80).convert("RGB").resize((180, 180), Image.LANCZOS).save(ICONS / "apple-touch-icon.png")
    banner = full.copy()
    banner.thumbnail((720, 720), Image.LANCZOS)
    banner.save(ICONS / "logo.webp", "WEBP", quality=90, method=6)

    # ---- Google Play ----
    icon(512, emblem).convert("RGB").save(STORE / "play-icon-512.png")
    feature_graphic()
    for f in ["icon-only", "icon-foreground", "icon-background", "splash"]:
        print("assets/" + f + ".png")
    print("icons/: icon-192, icon-512, icon-maskable-512, apple-touch-icon, favicon-48, logo.webp")
    print("store/: play-icon-512.png, play-feature-graphic.png")


def feature_graphic():
    """1024x500: full logo on the left, the app's four parts on the right (Inkscape for Devanagari)."""
    inkscape = shutil.which("inkscape") or r"C:\Program Files\Inkscape\bin\inkscape.exe"
    logo = (ASSETS / "logo-full.png").as_uri()
    lines = ["संपूर्ण ४० अध्यायांची पोथी", "पारायण · रोजची आठवण", "मंत्र आणि जप-गणक", "हिंदी कथा मालिका"]
    text = "".join(
        f'<circle cx="572" cy="{140 + k * 74}" r="9" fill="#e8892b"/>'
        f'<text x="596" y="{152 + k * 74}" font-family="Nirmala UI" font-weight="700" font-size="38" fill="#7a1c12">{s}</text>'
        for k, s in enumerate(lines))
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1024" height="500" viewBox="0 0 1024 500">
  <defs><radialGradient id="bg" cx="25%" cy="45%" r="90%">
    <stop offset="0" stop-color="#fffbf3"/><stop offset="0.6" stop-color="#fbeedb"/><stop offset="1" stop-color="#f3d6a8"/>
  </radialGradient></defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <rect x="520" y="90" width="4" height="320" rx="2" fill="#e8892b" opacity="0.35"/>
  <image xlink:href="{logo}" x="40" y="22" height="456" width="456" preserveAspectRatio="xMidYMid meet"/>
  {text}
</svg>'''
    src = APP / "tools" / "icon-src" / "play-feature-graphic.svg"
    src.write_text(svg, encoding="utf8")
    subprocess.run([inkscape, str(src), "--export-type=png", f"--export-filename={STORE / 'play-feature-graphic.png'}",
                    "--export-width=1024", "--export-height=500", "--export-background-opacity=1"],
                   check=True, capture_output=True)


if __name__ == "__main__":
    main()
