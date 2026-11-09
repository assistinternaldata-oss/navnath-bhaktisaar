# श्री नवनाथ भक्तिसार — app

An installable web app (PWA) for reading the complete Navnath Bhaktisaar pothi on a phone, tablet or computer. It works offline after the first visit.

- All 40 adhyays (7,635 ovis) in Marathi, taken from `../NavnathBhaktisaar.docx`
- Parayan tracker: 1, 3, 7, 11, 21 or 40 days, with today's adhyays, catch-up for missed days, and a history of completed parayans
- Search across the whole pothi, bookmarks on any ovi, and "continue where you left off"
- Menus in मराठी, हिंदी or English (the pothi text stays Marathi)
- Light, pothi (sepia) and dark themes; adjustable text size; keeps the screen on while reading
- Buttons for each adhyay's YouTube episode and audio recording, shown once you add the links

Progress, bookmarks and parayans are stored only on the reader's device; there is no server or account.

## Run it on this computer

```bash
python tools/serve.py
```

Open http://localhost:5180. Opening `index.html` directly from the folder won't work, because browsers block loading the data files that way.

## Add YouTube episodes and audio

Edit `data/media.json`. Each adhyay has two fields:

```json
"15": { "youtube": "https://youtu.be/XXXXXXXXXXX", "audio": "audio/adhyay-15.mp3" }
```

- **youtube**: any YouTube link. A "Watch Hindi episode" button appears on that adhyay.
- **audio**: put an MP3 in an `audio/` folder next to `index.html` and write its path, or paste a full https link to an MP3 hosted elsewhere. A player bar appears at the bottom of that adhyay. Audio isn't stored offline, because the files are large.

Leave a field empty (`""`) to hide its button. The app checks for new links every time it opens.

## Correct the pothi text

The text comes from `../NavnathBhaktisaar.docx` (chapter headings must stay as `श्री नवनाथ भक्तिसार पोथी – अध्याय N`). The adhyay summaries come from `../NavnathHeading.docx` and `tools/headings_hi_en.json` (Hindi and English). After editing either file, rebuild:

```bash
python tools/build_data.py
```

The source writes ovi numbers past 100 in short form (१ for 101, ११ for 111). The build restores the full numbers. It also lists 48 places where the source's numbering skips, usually a merged or missing ovi, in `tools/numbering-gaps.txt`, in case you want to correct the .docx.

## Publish it

The app is plain static files, with no build step. Upload the whole `bhaktisaar-app` folder to any static host:

- **GitHub Pages**: push the folder to a repository and turn on Pages (Settings → Pages → deploy from branch).
- **Netlify**: drag the folder onto https://app.netlify.com/drop.

It must be served over https for offline mode and "Install app" to work. Once it's live, readers install it from the browser menu (Android: "Install app"; iPhone: Share → Add to Home Screen) or from Settings in the app.

**Play Store**: once the site is live, https://www.pwabuilder.com can wrap the same URL as an Android app (a Trusted Web Activity) for the Play Store.

**After an update**: edits to existing files reach readers on their next launch. If you add or rename files, also bump `VERSION` in `sw.js`.

## Files

| Path | What it is |
| --- | --- |
| `index.html`, `css/app.css`, `js/*.js` | the app (no framework, no build step) |
| `data/index.json`, `data/adhyay/NN.json` | generated pothi text; don't edit by hand, rebuild instead |
| `data/media.json` | your YouTube and audio links |
| `sw.js`, `manifest.webmanifest`, `icons/` | offline support and install |
| `tools/build_data.py` | .docx → JSON converter |
| `tools/make_icons.py` | redraws the icon (needs Inkscape) |
| `tools/serve.py` | local server |
