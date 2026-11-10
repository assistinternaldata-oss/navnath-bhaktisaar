# श्री नवनाथ भक्तिसार — app

An installable web app (PWA) for reading the complete Navnath Bhaktisaar pothi on a phone, tablet or computer. It works offline after the first visit.

- All 40 adhyays (7,635 ovis) in Marathi, taken from `../NavnathBhaktisaar.docx`
- Parayan tracker: 1, 3, 7, 11, 21 or 40 days, with today's adhyays, catch-up for missed days, and a history of completed parayans
- A मंत्र (Mantras) tab: the Goraksh Gayatri Shabar mantra and other Nath mantras, each with a 11/21/108 jap counter that counts malas and vibrates as each one completes
- Search across the whole pothi, bookmarks on any ovi, and "continue where you left off"
- Menus in मराठी, हिंदी or English (the pothi text stays Marathi)
- Light, pothi (sepia) and dark themes; adjustable text size; keeps the screen on while reading
- The Shri Darshan Hindi episodes play inside the app: a Videos tab (channel card with Subscribe, Navnath songs, every episode by adhyay), the latest episodes on the home screen, and each adhyay's episodes at the top of the adhyay
- An audio player for each adhyay once you add recordings

Progress, bookmarks and parayans are stored only on the reader's device; there is no server or account.

## Run it on this computer

```bash
python tools/serve.py
```

Open http://localhost:5180. Opening `index.html` directly from the folder won't work, because browsers block loading the data files that way.

## Add new episodes, songs and audio

Everything lives in `data/media.json`. When you publish a new episode, add a line to that adhyay's `videos`:

```json
"16": {
 "videos": [
  {"id": "AbCdEfGhIjK", "title": "कानिफनाथ और गोरक्षनाथ की भेंट", "min": 20, "part": 1}
 ],
 "audio": ""
}
```

- **id**: the 11 characters after `watch?v=` in the video's link (a full YouTube link also works).
- **title**: the text shown under the thumbnail. **min**: the length in minutes.
- Optional: `"part": 2` for multi-part adhyays, `"full": true` for a complete-adhyay video, `"lang": "en"` for an English version, `"song": true` for a song.
- `"embed": false` makes the card open on YouTube instead of the in-app player. Use it for videos with **Allow embedding** switched off in YouTube Studio; right now that's only the "आदेश" theme song. If you switch embedding on for it, remove that flag.
- **songs** at the bottom of the file is the "Navnath songs" row in the Videos tab. **channel** holds the Subscribe and playlist links.
- **audio**: put an MP3 in an `audio/` folder next to `index.html` and write its path (`audio/adhyay-16.mp3`), or paste a full https link. A player bar appears at the bottom of that adhyay. Audio isn't stored offline, because the files are large.

Adhyays with no videos show "Hindi episode coming soon — Subscribe". The app re-reads this file every time it opens.

## Add or edit mantras

The मंत्र tab reads `data/mantras.json`, showing mantras in the order listed. Each one looks like this:

```json
{
 "id": "gorakh-gayatri",
 "title": { "mr": "गोरक्ष गायत्री — शाबरी मंत्र", "hi": "…", "en": "…" },
 "deity": { "mr": "गुरु गोरक्षनाथ", "hi": "…", "en": "…" },
 "lang": "hi",
 "lines": ["ॐ गुरुजी, सत नमो आदेश। गुरुजी को आदेश।", "…"],
 "video": "YoW_d1W-KKM",
 "adhyay": 9,
 "japa": 11,
 "note": { "mr": "…", "hi": "…", "en": "…" }
}
```

- **id**: a short name with no spaces; it becomes the page address (`#/mantra/gorakh-gayatri`).
- **lines**: the mantra exactly as it should be chanted, one line per entry.
- Optional: `video` (YouTube id, shown on the page), `adhyay` (adds a link both ways between the mantra and that adhyay), `japa` (starting mala size: 11, 21 or 108), `note` (a line of background), `"featured": true` (highlights it at the top).
- `check` marks wording Claude drafted that you haven't confirmed. Delete it once you have.

Each reader's jap counts are saved on their own phone.

## The 3D world (नवनाथ भारतवर्ष)

The home screen has a card, **Bharatvarsh of the Navnaths · 3D**, which opens `bharat/index.html`: an explorable 3D land of the nine Naths, with their places, the great temples, and a title film in which every place rises from the ground. It opens in the reader's language (Marathi readers get the Hindi text; the 3D world has Hindi and English) and has a link back to the pothi.

- `bharat/` is **built in another project** (`apps/navnath-bharat` in the Jansetu repository) and copied here. Don't edit it by hand. To update it, in that project run `node build.mjs` and then `node tools/export-bhaktisaar.mjs <path to this folder>`.
- It is about 9 MB (the page, three.js, the temple models and the title music). The website does not fetch it until a reader opens the card; after that it is kept for offline use. The Android and iOS apps carry it inside.
- It needs WebGL 2 (any phone or computer from the last several years). Where that is missing, the 3D page says so; the pothi is unaffected.

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

**After an update**: edits to existing files reach readers on their next launch. If you add or rename files, also bump `VERSION` in `sw.js`.

## Android and iOS apps

The same code is packaged as native apps with [Capacitor](https://capacitorjs.com) (app ID `shop.shridarshan.navnath`). The pothi text, fonts and icons ship inside the apps. The **video and mantra lists are read from the website**, so new episodes and mantras appear in the apps without a store update. The apps add phone vibration for the jap counter, keep the screen on, native sharing, the Android back button, and a daily parayan reminder (Settings).

**Builds run on GitHub** (`.github/workflows/apps.yml`), so nothing needs installing here and no Mac is needed. On every push:
- **Android**: an installable test APK, under the repository's Actions tab → latest "Build apps" run → Artifacts → `navnath-android-test-apk`.
- **iOS**: a check that the app compiles.

To produce store builds, add these repository secrets (Settings → Secrets and variables → Actions):

| Secret | What it is |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` | the Play upload key; with these the build also produces `navnath-android-play-bundle` (an `.aab` for Play Console) |
| `APPLE_API_KEY_ID`, `APPLE_API_ISSUER_ID`, `APPLE_API_KEY_P8`, `APPLE_TEAM_ID` | an App Store Connect API key (Users and Access → Integrations, role App Manager) and your Team ID; with these the build signs the iOS app and uploads it to TestFlight |

**Working on the native projects locally** (needs Node; Android Studio for Android, a Mac with Xcode for iOS):

```bash
npm install
```

```bash
npm run sync
```

`npm run sync` copies the web app into `www/` and from there into `android/` and `ios/`. Run it after any web change. `npm run assets` regenerates the app icons and splash screens from `assets/`, which `python tools/make_logo_assets.py` draws from the logo (`assets/logo-source.webp`).

## Files

| Path | What it is |
| --- | --- |
| `index.html`, `css/app.css`, `js/*.js` | the app (no framework, no build step) |
| `data/index.json`, `data/adhyay/NN.json` | generated pothi text; don't edit by hand, rebuild instead |
| `data/media.json` | your YouTube and audio links |
| `sw.js`, `manifest.webmanifest`, `icons/` | offline support and install |
| `tools/build_data.py` | .docx → JSON converter |
| `tools/serve.py` | local server |
| `fonts/` | the two typefaces, bundled so nothing loads from Google (`scripts/copy-fonts.mjs`) |
| `bharat/` | the 3D world, copied in from the Jansetu repository (`apps/navnath-bharat`) |
| `embed.html` | lets the apps play YouTube videos (YouTube only plays embeds hosted on a website) |
| `android/`, `ios/`, `capacitor.config.json`, `package.json` | the native app projects |
| `js/native.js` | phone features (vibration, reminders, sharing) inside the apps; no effect on the website |
| `assets/logo-source.webp`, `tools/make_logo_assets.py` | the logo, and the script that makes every icon, splash screen, the home-screen banner (`icons/logo.webp`) and the Play graphics from it (needs Pillow and Inkscape) |
| `.github/workflows/apps.yml` | cloud builds for Android and iOS |
