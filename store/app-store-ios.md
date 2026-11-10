# Shri Navnath Bhaktisaar Pothi — iOS App Store submission details

> **How to use this:** paste the whole file into your assistant along with what you need, for example:
> "I'm publishing this iOS app on the Apple App Store. Using the details below, walk me through building it, uploading it and filling in App Store Connect."
> Nothing secret is in this file. Keep it that way: never paste passwords, the `.p8` API key or the Android keystore into any website.

Prepared 10 November 2026 from the project at `E:\Navnath\bhaktisaar-app`.

---

## 1. Where things stand

| Item | Status |
| --- | --- |
| Android app | On Google Play. Internal testing build 1.0.0 (6) is live, and the closed test plus store listing were sent for Google review on 9 Nov 2026. |
| Bundle ID `shop.shridarshan.navnath` | Registered 10 Nov 2026 under team 2M8GC94R7G. |
| App Store Connect app | Created 10 Nov 2026 (Apple ID 6833033336, SKU `navnath-bhaktisaar-ios`). Version 1.0.0 is in "Prepare for Submission". |
| Builds | Every push to `main` signs the app and uploads it to TestFlight (GitHub Actions). **Build 10** is processed and attached to version 1.0.0. |
| Signing | API key "Navnath Bhaktisaar CI" (App Manager, used only to upload) plus our own Apple Distribution certificate and App Store profile, which expire 10 Nov 2027. Copies are kept in `E:\Navnath\AppleSigning`, outside the repo. |
| Listing | Marathi, Hindi and English (U.S.) texts are all filled in (section 7). The 7 iPhone screenshots in `store/ios-screenshots/` (1320 × 2868) are uploaded. |
| App information | Categories Books / Reference. Content rights: yes, with rights. Age rating 13+ (Apple's calculation). App Privacy "Data Not Collected" is published. Price is free in all 175 countries. Manual release after approval. |
| **Still open** | App Review contact **phone number** (Apple requires it in +91 format), which also lets the contact name, email and reviewer notes save. Then **Add for Review → Submit**. |

---

## 2. App identity

| Field | Value |
| --- | --- |
| App Store name (Marathi) | श्री नवनाथ भक्तिसार पोथी (24 of 30 characters) |
| App Store name (English localization) | Navnath Bhaktisaar Pothi |
| Name under the icon on the home screen | नवनाथ भक्तिसार (`CFBundleDisplayName`) |
| Bundle ID | `shop.shridarshan.navnath`, the same ID as the Android app |
| SKU (suggested; any unique text) | `navnath-bhaktisaar-ios` |
| Version | 1.0.0 |
| Build number | Any whole number, higher on every upload. GitHub Actions uses its run number. |
| Primary language | Marathi. If App Store Connect doesn't offer Marathi, use Hindi as the primary language and English (U.S.) as the second. |
| More localizations | Hindi, English (U.S.) |
| Category | Primary **Books**, secondary **Reference** (Google Play uses Books & Reference) |
| Price | Free. No in-app purchases, no subscriptions, no ads. |
| Availability | All countries and regions |
| Apple developer account | Individual account, Sandip Darveshi. You can see the Team ID under developer.apple.com → Account → Membership details. |
| Copyright | 2026 Sandip Darveshi |
| Publisher / YouTube channel | Shri Darshan, https://www.youtube.com/channel/UCIHxqtVp_xXPwVemV4yaOCA |
| Website / Support URL / Marketing URL | https://assistinternaldata-oss.github.io/navnath-bhaktisaar/ |
| Privacy policy URL | https://assistinternaldata-oss.github.io/navnath-bhaktisaar/privacy.html |
| Support email | assistinternaldata@gmail.com (already public in the privacy policy and the Play listing) |
| Older apps in the same Apple account | JanSetu24, SchoolSetu24 (`shop.shridarshan.schoolsetu`), WallPanelSystems, Ganapati Sthapana, GanapatiSthapanaLite |

---

## 3. What the app is

**Shri Navnath Bhaktisaar** is a 40-adhyay Marathi ovi scripture about the nine Naths, written in the 19th century by Dhundisut Malu Narhari. The text is in the public domain. The app is a devotional reader and practice companion:

- **Complete pothi, offline:** all 40 adhyays and 7,635 ovis in the original Marathi, bundled inside the app. Adjustable text size, light, sepia and dark themes, resume where you stopped, bookmarks, copy and share for any ovi, and full-text search.
- **Parayan tracker:** 1, 3, 7, 11, 21 or 40-day plans. The app shows each day's adhyays, carries missed ones forward, sends a **daily reminder through a local notification** at the time the user picks, and keeps a record of finished parayans.
- **Mantras and japa counter:** 7 mantras, including the Goraksh Gayatri Shabar mantra, Navnath namjap, Navnath shloka, Mrit-Sanjivani mantra and Datta mantras. Malas of 11, 21 or 108 beads, with **haptic feedback** on each count.
- **Hindi story series:** the animated Hindi episodes from the developer's own YouTube channel, **Shri Darshan**, linked to each adhyay (1–15 so far), plus Navnath songs. They play inside the app in YouTube's embedded player. The video and mantra lists load from the website, so new episodes appear without an app update, and the app keeps the last copy for offline use.
- **Interface language:** Marathi, Hindi or English, chosen on first launch. The pothi text itself is always Marathi.
- **Native features used:** local notifications for reminders, haptics, keep-screen-awake while reading, the iOS share sheet, a splash screen, and system bar styling.
- **No** accounts, sign-in, ads, analytics, crash reporting, tracking or in-app purchases. Reading progress, bookmarks, parayan, japa counts and settings are stored only on the device.

---

## 4. Project and build details

| Item | Value |
| --- | --- |
| Source code | https://github.com/assistinternaldata-oss/navnath-bhaktisaar (public), branch `main` |
| Framework | Capacitor 8.6. A plain-JavaScript web app (no bundler) is wrapped in a native iOS shell. |
| Xcode project | `ios/App/App.xcodeproj`, scheme **App**, Swift Package Manager (no CocoaPods) |
| Minimum iOS | 15.0 |
| Devices | iPhone only (`TARGETED_DEVICE_FAMILY = 1`, see section 1) |
| Orientations | Portrait, plus landscape left and right |
| Capacitor plugins | @capacitor/app 8.1, @capacitor/haptics 8.0, @capacitor/local-notifications 8.3, @capacitor/share 8.0, @capacitor/splash-screen 8.0, @capacitor-community/keep-awake 8.0 |
| Capabilities / entitlements | None. Local notifications need no Push capability. |
| Permission prompts | Only the system "allow notifications" prompt, which appears when the user turns on the parayan reminder. No camera, photos, location, microphone or contacts. |
| Encryption | `ITSAppUsesNonExemptEncryption = false` in Info.plist (the app only uses standard HTTPS), so App Store Connect won't ask for export compliance documents. |
| Privacy manifest | Capacitor's own `PrivacyInfo.xcprivacy` is included. If Apple emails an ITMS-91053 "missing API declaration" warning after upload, add an app-level `PrivacyInfo.xcprivacy` declaring the reasons it lists. |
| App icon | 1024×1024 PNG without transparency in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`. The source is `assets/icon-only.png`, the emblem of the Navnath Bhaktisaar logo on a cream background. |
| Splash screen | The full logo on cream (`#fbefdc`), from `assets/splash.png` |

**Building on a Mac with Xcode:**

```
git clone https://github.com/assistinternaldata-oss/navnath-bhaktisaar.git
cd navnath-bhaktisaar
npm ci
npm run sync -- ios          # copies the web app into www/ and runs "cap sync ios"
open ios/App/App.xcodeproj   # Signing & Capabilities → choose your team, automatic signing
# Product → Archive → Distribute App → App Store Connect → Upload
```

**Building without a Mac (already set up in the repo):** `.github/workflows/apps.yml` builds, signs and uploads to TestFlight automatically on every push to `main` once these four GitHub repository secrets exist:

| Secret | What goes in it |
| --- | --- |
| `APPLE_API_KEY_ID` | Key ID of an App Store Connect API key (Users and Access → Integrations → App Store Connect API, role **App Manager**) |
| `APPLE_API_ISSUER_ID` | The Issuer ID shown on that same page |
| `APPLE_API_KEY_P8` | The full text of the downloaded `AuthKey_XXXX.p8` file. It can be downloaded only once. |
| `APPLE_TEAM_ID` | The 10-character Team ID from Membership details |

The bundle ID must be registered and the App Store Connect app record must exist before the first upload can succeed.

---

## 5. App Store Connect — one-time setup

1. **Register the bundle ID:** developer.apple.com → Certificates, Identifiers & Profiles → Identifiers → + → App IDs → App. Description "Navnath Bhaktisaar", Explicit bundle ID `shop.shridarshan.navnath`, no extra capabilities.
2. **Create the app:** App Store Connect → Apps → + → New App. Platform iOS, the name from section 2, primary language Marathi, bundle ID `shop.shridarshan.navnath`, SKU `navnath-bhaktisaar-ios`, Full Access.
3. **App Information:** name and subtitle for each localization (section 7), categories Books / Reference, content rights (below), age rating (below).
4. **Pricing and Availability:** Free, all countries and regions.
5. **App Privacy:** the privacy policy URL and the answers in section 6.

**Content rights:** "Does your app contain, show, or access third-party content?" Answer **Yes, and I have the rights.** The pothi text is a 19th-century public-domain work, and the videos come from the developer's own YouTube channel, Shri Darshan, streamed through YouTube's player.

**Age rating questionnaire.** These answers match what Google Play was told, which gave the app a 12+ rating. The animated episodes retell mythological battles in a realistic style without gore.

| Question | Answer |
| --- | --- |
| Parental controls / age assurance | No |
| Unrestricted web access | No. The app opens only its own videos and links to YouTube. |
| User-generated content / messaging or chat | No. Sharing only hands an ovi's text to the iOS share sheet. |
| Advertising | No |
| Cartoon or fantasy violence | Infrequent / mild |
| Realistic violence | Infrequent / mild |
| Prolonged graphic or sadistic violence | None |
| Guns or other weapons | Infrequent / mild if the episodes show mythological weapons, otherwise None |
| Horror / fear themes | None (change it if any episode is frightening) |
| Profanity, sexual content, nudity, alcohol / tobacco / drugs | None |
| Medical or treatment information, health or wellness topics | None |
| Gambling, simulated gambling, contests, loot boxes | None |
| Made for Kids | No |

---

## 6. App Privacy ("nutrition label")

- **Data collection: "No, we do not collect data from this app."** The result is **Data Not Collected**.
- Tracking: **No.** The app has no IDFA, no analytics SDK, no ads SDK and no crash reporter.
- Why this is accurate: all user data (progress, bookmarks, parayan, japa counts, settings) stays in on-device storage and is never sent to the developer. The app downloads only the public video and mantra lists from the website. The privacy policy notes that videos play in YouTube's embedded player (`youtube-nocookie.com`), which falls under Google's own privacy policy.
- Google Play's Data safety form was answered the same way ("no data collected or shared").

---

## 7. Version 1.0.0 page — text for each language

The limits are App Store limits, and every text below fits within them. Don't mention Android or Google Play anywhere in the iOS listing. **App Store Connect rejects emoji in descriptions** ("invalid characters"), so the live descriptions are these texts without the 📖 🪔 📿 🎬 🌐 🔒 emoji.

### Marathi (primary)

**Name:** श्री नवनाथ भक्तिसार पोथी

**Subtitle (30):** ४० अध्याय, पारायण व मंत्र-जप

**Promotional text (170):** संपूर्ण ४० अध्यायांची पोथी इंटरनेटशिवाय वाचा, पारायणाची रोजची आठवण ठेवा, मंत्र-जप मोजा आणि Shri Darshan ची हिंदी कथा मालिका पाहा.

**Keywords (100, comma-separated, no spaces):** मच्छिंद्रनाथ,गोरक्षनाथ,नाथ,शाबरी,मंत्र,जप,ओवी,ग्रंथ,अध्याय,मराठी
*If App Store Connect says it's too long (Devanagari takes more bytes), use:* मच्छिंद्रनाथ,गोरक्षनाथ,शाबरी,मंत्र

**Description (4000):**

श्री नवनाथ भक्तिसार — धुंडीसुत मालू नरहरी विरचित नवनाथांच्या कथांचा ४० अध्यायांचा ओवीबद्ध ग्रंथ — आता तुमच्या फोनवर, संपूर्ण आणि इंटरनेटशिवाय.

📖 संपूर्ण पोथी
• सर्व ४० अध्याय, ७,६०० हून अधिक ओव्या, मूळ मराठीत
• सुवाच्य पारंपरिक अक्षरशैली; अक्षरांचा आकार कमी-जास्त करा
• उजळ, पोथी (सेपिया) आणि गडद रंगसंगती
• वाचन जिथे थांबले तिथूनच पुढे सुरू
• कोणत्याही ओवीवर खूण ठेवा, कॉपी किंवा शेअर करा
• संपूर्ण पोथीत शब्द शोधा

🪔 पारायण
• १, ३, ७, ११, २१ किंवा ४० दिवसांचे पारायण निवडा
• रोज कोणते अध्याय वाचायचे ते ॲप सांगते; राहिलेले अध्याय पुढे आणते
• रोज ठरलेल्या वेळी पारायणाची आठवण
• पूर्ण झालेल्या पारायणांची नोंद

📿 मंत्र आणि जप
• गोरक्ष गायत्री शाबरी मंत्र, नवनाथ नामजप, नवनाथ श्लोक, मृतसंजीवनी मंत्र, दत्त मंत्र
• ११ / २१ / १०८ माळेसह जप-गणक — प्रत्येक जपाला हलके कंपन, माळ पूर्ण झाल्यावर सूचना

🎬 हिंदी कथा मालिका
• Shri Darshan ची ॲनिमेटेड हिंदी कथा मालिका — प्रत्येक अध्यायासोबत
• नवनाथ गीते आणि नवीन भाग ॲप अपडेट न करता दिसतात

🌐 मराठी, हिंदी किंवा English मेनू (पोथी मराठीतच).
🔒 जाहिराती नाहीत, खाते नाही, कोणतीही माहिती गोळा केली जात नाही — तुमची प्रगती फक्त तुमच्या फोनवर.

॥ अलख निरंजन ॥ ॥ श्री नवनाथ महाराज की जय ॥

### Hindi

**Name:** श्री नवनाथ भक्तिसार पोथी

**Subtitle (30):** ४० अध्याय, पारायण और मंत्र-जप

**Promotional text (170):** पूरी ४० अध्याय की मराठी पोथी बिना इंटरनेट पढ़ें, पारायण की रोज़ याद पाएँ, मंत्र-जप गिनें और Shri Darshan की हिंदी कथा श्रृंखला देखें।

**Keywords (100):** मच्छिंद्रनाथ,गोरखनाथ,नाथ पंथ,शाबर,मंत्र,जाप,ओवी,ग्रंथ,अध्याय,मराठी
*Shorter version if needed:* मच्छिंद्रनाथ,गोरखनाथ,शाबर,मंत्र,जाप

**Description (4000):**

श्री नवनाथ भक्तिसार — धुंडीसुत मालू नरहरि रचित नवनाथों की कथाओं का ४० अध्यायों का ओवीबद्ध ग्रंथ — अब आपके फ़ोन पर, संपूर्ण और बिना इंटरनेट।

📖 संपूर्ण पोथी
• सभी ४० अध्याय, ७,६०० से अधिक ओवियाँ, मूल मराठी में
• पढ़ने में आसान पारंपरिक अक्षर; अक्षरों का आकार बदलें
• हल्की, पोथी (सेपिया) और गहरी थीम
• जहाँ पढ़ना छोड़ा था, वहीं से आगे
• किसी भी ओवी को बुकमार्क, कॉपी या शेयर करें
• पूरी पोथी में शब्द खोजें

🪔 पारायण
• १, ३, ७, ११, २१ या ४० दिनों का पारायण चुनें
• रोज़ कौन-से अध्याय पढ़ने हैं, ऐप बताता है; छूटे हुए अध्याय आगे लाता है
• रोज़ तय समय पर पारायण की याद
• पूर्ण हुए पारायणों का रिकॉर्ड

📿 मंत्र और जप
• गोरक्ष गायत्री शाबर मंत्र, नवनाथ नामजप, नवनाथ श्लोक, मृतसंजीवनी मंत्र, दत्त मंत्र
• ११ / २१ / १०८ की माला के साथ जप-गणक — हर जप पर हल्का कंपन, माला पूर्ण होने पर सूचना

🎬 हिंदी कथा श्रृंखला
• Shri Darshan की एनिमेटेड हिंदी कथा श्रृंखला — हर अध्याय के साथ
• नवनाथ गीत और नए एपिसोड ऐप अपडेट किए बिना दिखते हैं

🌐 मराठी, हिंदी या English मेनू (पोथी मराठी में ही)।
🔒 कोई विज्ञापन नहीं, कोई खाता नहीं, कोई जानकारी इकट्ठा नहीं — आपकी प्रगति सिर्फ़ आपके फ़ोन में।

॥ अलख निरंजन ॥ ॥ श्री नवनाथ महाराज की जय ॥

### English (U.S.)

**Name:** Navnath Bhaktisaar Pothi

**Subtitle (30):** Complete pothi, parayan, japa

**Promotional text (170):** Read all 40 adhyays offline, get a daily parayan reminder, count your japa and watch Shri Darshan's Hindi story series. No ads, no account.

**Keywords (100):** navnath,bhaktisar,pothi,parayan,gorakhnath,machindranath,shabar,mantra,japa,nath,marathi,granth

**Description (4000):**

Shri Navnath Bhaktisaar — the 40-adhyay Marathi ovi scripture of the nine Naths by Dhundisut Malu Narhari — complete on your phone, and fully readable offline.

📖 The complete pothi
• All 40 adhyays, more than 7,600 ovis, in the original Marathi
• Clear traditional Devanagari type; adjustable text size
• Light, sepia (pothi) and dark themes
• Picks up exactly where you stopped reading
• Bookmark, copy or share any ovi
• Search the whole pothi

🪔 Parayan
• Choose a 1, 3, 7, 11, 21 or 40-day parayan
• The app shows each day's adhyays and carries missed ones forward
• Daily parayan reminder at the time you choose
• A record of completed parayans

📿 Mantras and japa
• Goraksh Gayatri Shabar mantra, Navnath name chant, Navnath shloka, Mrit-Sanjivani mantra, Datta mantras
• Japa counter with 11 / 21 / 108-bead malas, a gentle vibration on each count and a signal when a mala completes

🎬 Hindi story series
• Shri Darshan's animated Hindi retelling, linked to every adhyay
• Navnath songs; new episodes appear without an app update

🌐 Menus in Marathi, Hindi or English (the pothi stays in Marathi).
🔒 No ads, no account, no data collected — your progress stays on your phone.

॥ Alakh Niranjan ॥ Shri Navnath Maharaj ki Jai ॥

### Same for every language

- Support URL: https://assistinternaldata-oss.github.io/navnath-bhaktisaar/
- Marketing URL: https://assistinternaldata-oss.github.io/navnath-bhaktisaar/
- Copyright: 2026 Sandip Darveshi
- Version release: manually release this version (recommended for a first release)
- "What's New": not needed for the first version. For later versions, adapt the release notes in `store/play-listing.md`.

---

## 8. Screenshots

- **Required:** iPhone 6.9" display, **1320 × 2868 px** portrait (1290 × 2796 also accepted), PNG or JPEG, no transparency, 3–10 images. Apple scales them down for smaller iPhones. No iPad screenshots are needed once the project is iPhone-only.
- Optional: an app preview video (15–30 s) recorded on an iPhone.
- **Suggested set** (the same screens as the Play listing, in this order). Each shows the app with the Marathi interface:

| # | Screen | Caption idea (English / Marathi) |
| --- | --- | --- |
| 1 | Home: logo banner, "continue reading", today's parayan | The complete Navnath Bhaktisaar / संपूर्ण नवनाथ भक्तिसार |
| 2 | Reader: an adhyay with ovis | All 40 adhyays, offline / ४० अध्याय, इंटरनेटशिवाय |
| 3 | Parayan plan with today's adhyays | Parayan in 1 to 40 days / १ ते ४० दिवसांचे पारायण |
| 4 | Mantra list | Shabar mantra and Navnath mantras / शाबरी मंत्र आणि नवनाथ मंत्र |
| 5 | Japa counter ring | Japa counter with mala / जप-गणक |
| 6 | Videos: Hindi episodes | Hindi story series / हिंदी कथा मालिका |
| 7 | Search results | Search the whole pothi / संपूर्ण पोथीत शोध |

- Easiest way to capture them: run the app in the **iPhone 16 Pro Max / 17 Pro Max simulator** in Xcode and press ⌘S, which saves at the correct size. They can also be rendered from the website (same screens) in a 440 × 956 viewport at 3× scale.

---

## 9. App Review information

- **Sign-in required:** No (no accounts exist). No demo account is needed.
- **Contact:** Sandip Darveshi · assistinternaldata@gmail.com · phone: *(add your number)*
- **Notes for the reviewer** (paste as is):

> Shri Navnath Bhaktisaar is a devotional reader for a 19th-century Marathi scripture (public domain) of 40 chapters ("adhyays"). The whole text is bundled in the app and works offline. No login is needed.
> How to try it: on first launch pick a language (Marathi, Hindi or English). Home → open any adhyay to read. Parayan tab → choose a reading plan; Settings → turn on the daily parayan reminder (a local notification at the chosen time). Mantra tab → open a mantra and tap the counter (haptic feedback on each count). Videos tab → episodes from our own YouTube channel "Shri Darshan" (https://www.youtube.com/channel/UCIHxqtVp_xXPwVemV4yaOCA), played in YouTube's embedded player.
> Other native features: bookmarks, full-text search, share any verse through the iOS share sheet, and keeping the screen awake while reading. There are no ads, accounts, analytics or in-app purchases, and no user data leaves the device.

---

## 10. Review risks to be ready for

- **Guideline 4.2 (minimum functionality / "just a website"):** the app is a Capacitor web view. The reviewer notes above list the offline content and native features (local-notification reminders, haptics, share sheet, keep-awake). If Apple still objects, reply with those details. Adding a home-screen widget or Siri shortcut would strengthen a resubmission.
- **Guideline 5.2 (intellectual property):** be ready to confirm that the Shri Darshan channel and its videos belong to you, and that the pothi text is public domain.
- **Metadata:** no Android or Google Play wording, and no prices or "free" claims in the screenshots.
- **Privacy manifest email (ITMS-91053):** see section 4.

---

## 11. Files in the repo that may help

| File | Contents |
| --- | --- |
| `store/play-listing.md` | Google Play text in Marathi, Hindi and English (the source of the descriptions above) |
| `store/play-console-answers.md` | Content rating and data-safety reasoning |
| `store/screenshots/01-home.png` … `07-search.png` | Android screenshots (1080 × 2160): the layout reference for the iPhone set |
| `assets/logo-full.png`, `assets/logo-emblem.png`, `assets/icon-only.png` | Logo and 1024 px icon |
| `privacy.html` | Privacy policy (Marathi, Hindi, English) |
| `README.md` | How the app, the data files and the builds work |
