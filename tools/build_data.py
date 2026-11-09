"""Convert the Navnath Bhaktisaar Word files into the app's JSON data.

Usage (from the bhaktisaar-app folder):
    python tools/build_data.py
    python tools/build_data.py --pothi ../NavnathBhaktisaar.docx --headings ../NavnathHeading.docx

Reads:
    NavnathBhaktisaar.docx   full 40-adhyay Marathi text
    NavnathHeading.docx      one-line Marathi summary per adhyay (40 lines)
    tools/headings_hi_en.json Hindi + English summaries
Writes:
    data/index.json          adhyay list (titles in mr/hi/en, ovi counts)
    data/adhyay/01.json ... 40.json

data/media.json (YouTube + audio links) is created once if missing and never
overwritten, so your links are safe when you rebuild the text.
"""
import argparse
import html
import json
import re
import sys
import unicodedata
import zipfile
from pathlib import Path

APP = Path(__file__).resolve().parent.parent
DATA = APP / "data"

HEADING = re.compile(r"^श्री\s*नवनाथ\s*भक्तिसार\s*पोथी\s*[–—-]\s*अध्याय\s*([०-९0-9]+)\s*$")
# an ovi ends in its number between dandas: ॥१२॥  (tolerates ।१२॥ / ॥१२। / trailing \)
OVI_NUM = re.compile(r"[॥।]\s*([०-९0-9]+)\s*[॥।]")
COLOPHON_WORDS = ("र्पणमस्तु", "र्पमस्तु", "र्पंमस्तु", "समाप्त", "शुभं भवतु")
NOT_OVI_BEFORE = ("अध्याय", "ओंव्या", "ओव्या")

DEV = "०१२३४५६७८९"


def paragraphs(docx: Path):
    with zipfile.ZipFile(docx) as z:
        xml = z.read("word/document.xml").decode("utf8")
    out = []
    for p in re.findall(r"<w:p[ >].*?</w:p>", xml, re.S):
        text = "".join(re.findall(r"<w:t(?:\s[^>]*)?>([^<]*)</w:t>", p))
        text = unicodedata.normalize("NFC", html.unescape(text)).strip()
        if text:
            out.append(text)
    return out


def find_ovi_number(line: str):
    """Return the match for this line's ovi number, or None."""
    for m in OVI_NUM.finditer(line):
        before = line[: m.start()].rstrip(" ॥।")
        if before.endswith(NOT_OVI_BEFORE):
            continue  # "अध्याय ॥२॥" / "ओंव्या ॥१७७॥" in a colophon
        return m
    return None


def is_colophon(line: str) -> bool:
    return any(w in line for w in COLOPHON_WORDS)


def clean_ovi_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip(" \\")
    return text.rstrip(" ॥।").strip()


def parse_chapters(lines):
    """Split the pothi into adhyays of typed blocks.

    inv  invocation lines before the first ovi (श्रीगणेशाय नमः …)
    ovi  a numbered ovi; numberless lines just before it are joined into it
    col  closing colophon (श्रीकृष्णार्पणमस्तु … समाप्त)
    shl  verse after the colophon (the Navnath shloka at the end of adhyay 40)
    """
    chapters = {}
    current = None
    pending = []  # numberless lines inside the body, waiting for their ovi number

    def flush():
        ended = any(b["t"] == "col" for b in current)
        current.extend({"t": "shl" if ended else "col", "x": p} for p in pending)
        pending.clear()

    for line in lines:
        h = HEADING.match(line)
        if h:
            if current is not None:
                flush()
            n = int(h.group(1).translate(str.maketrans(DEV, "0123456789")))
            current = chapters.setdefault(n, [])
            continue
        if current is None:
            continue
        m = find_ovi_number(line)
        if m:
            body = line[: m.start()]
            rest = line[m.end():].strip(" \\")
            text = clean_ovi_text(" ॥ ".join(pending + [body]))
            pending.clear()
            current.append({"t": "ovi", "i": sum(b["t"] == "ovi" for b in current) + 1,
                            "n": m.group(1), "x": text})
            if rest:
                current.append({"t": "col", "x": rest})
        elif is_colophon(line):
            flush()
            current.append({"t": "col", "x": line})
        elif not any(b["t"] == "ovi" for b in current):
            current.append({"t": "inv", "x": line})
        else:
            pending.append(line.rstrip(" \\॥।"))
    if current is not None:
        flush()
    return chapters


def restore_hundreds(blocks):
    """The source abbreviates ovi numbers past 100 (१ for 101, ११ for 111, ९५ for 195).
    Rebuild the full number from the previous one; real gaps in the source stay as they are."""
    to_int = str.maketrans(DEV, "0123456789")
    to_dev = str.maketrans("0123456789", DEV)
    prev = 0
    for b in blocks:
        if b["t"] != "ovi":
            continue
        k = int(b["n"].translate(to_int))
        if k < 100 and prev >= 90:
            k = (prev // 100) * 100 + k
            if k <= prev - 50:
                k += 100
        b["n"] = str(k).translate(to_dev)
        prev = k


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pothi", default=str(APP.parent / "NavnathBhaktisaar.docx"))
    ap.add_argument("--headings", default=str(APP.parent / "NavnathHeading.docx"))
    args = ap.parse_args()

    lines = paragraphs(Path(args.pothi))
    chapters = parse_chapters(lines)
    if sorted(chapters) != list(range(1, 41)):
        sys.exit(f"Expected adhyays 1-40, found {sorted(chapters)}")

    mr_titles = [re.sub(r"[A-Za-z]+$", "", t).strip().rstrip(".").strip()
                 for t in paragraphs(Path(args.headings))]
    if len(mr_titles) != 40:
        sys.exit(f"Expected 40 headings, found {len(mr_titles)}")
    tr = json.loads((APP / "tools" / "headings_hi_en.json").read_text(encoding="utf8"))

    (DATA / "adhyay").mkdir(parents=True, exist_ok=True)
    index = []
    for n in range(1, 41):
        blocks = chapters[n]
        restore_hundreds(blocks)
        ovis = sum(b["t"] == "ovi" for b in blocks)
        (DATA / "adhyay" / f"{n:02d}.json").write_text(
            json.dumps({"n": n, "blocks": blocks}, ensure_ascii=False, separators=(",", ":")),
            encoding="utf8")
        index.append({"n": n, "ovis": ovis,
                      "title": {"mr": mr_titles[n - 1], "hi": tr[str(n)]["hi"], "en": tr[str(n)]["en"]}})

    (DATA / "index.json").write_text(
        json.dumps({"adhyays": index}, ensure_ascii=False, indent=1), encoding="utf8")

    media = DATA / "media.json"
    if not media.exists():
        media.write_text(json.dumps({
            "_help": "Paste a YouTube link and/or an audio file path for any adhyay. Leave blank to hide the button.",
            "channel": "",
            "adhyay": {str(n): {"youtube": "", "audio": ""} for n in range(1, 41)},
        }, ensure_ascii=False, indent=1), encoding="utf8")

    # places where the source's own numbering skips (merged/missing ovis, typos)
    to_int = str.maketrans(DEV, "0123456789")
    gaps = []
    for n in range(1, 41):
        prev = 0
        for b in chapters[n]:
            if b["t"] == "ovi":
                k = int(b["n"].translate(to_int))
                if k != prev + 1:
                    gaps.append(f"अध्याय {n}: ओवी {prev} नंतर {k}  —  {b['x'][:60]}")
                prev = k
    (APP / "tools" / "numbering-gaps.txt").write_text(
        "Ovi numbers in NavnathBhaktisaar.docx that don't follow on from the previous ovi.\n"
        "The app shows them exactly as written. Fix the .docx and rebuild if you want them changed.\n\n"
        + "\n".join(gaps) + "\n", encoding="utf8")

    total = sum(a["ovis"] for a in index)
    print(f"Wrote 40 adhyays, {total} ovis -> {DATA}")
    for a in index:
        print(f"  {a['n']:>2}: {a['ovis']:>3} ovis  {a['title']['mr'][:50]}")


if __name__ == "__main__":
    main()
