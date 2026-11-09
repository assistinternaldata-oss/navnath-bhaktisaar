# Play Console — what to fill in

Suggested answers for the forms Play Console asks for before a release, based on what the app actually does. You submit them; review each against your own knowledge, especially the content rating, which depends on what your videos show.

## 1. Create the app

Play Console → **Create app**
- App name: **श्री नवनाथ भक्तिसार पोथी**
- Default language: **Marathi – mr-IN**
- App or game: **App** · Free or paid: **Free**
- Accept the declarations.

## 2. First release (internal testing)

Test and release → **Testing → Internal testing** → Create new release
1. When offered **Play App Signing**, accept it (Google keeps the app-signing key; you sign uploads with your upload key).
2. Upload `dist/navnath-bhaktisaar-play.aab` (or the newest `navnath-android-play-bundle` from the GitHub Actions run).
3. Release name: `1.0.0`. Release notes: from `play-listing.md`.
4. Testers tab: create an email list (your own Gmail and family), save, and open the opt-in link on your phone to install from Play.

**Going public (Production).** Personal developer accounts created after 13 November 2023 must first run a **closed test with at least 12 testers opted in for 14 days in a row**, then apply for production access. Organization accounts skip this. Closed testing works like internal testing but on the "Closed testing" track.

## 3. App content (Policy → App content)

| Form | Answer |
| --- | --- |
| **Privacy policy** | `https://assistinternaldata-oss.github.io/navnath-bhaktisaar/privacy.html` |
| **App access** | All functionality is available without any access restrictions (no login) |
| **Ads** | No, my app does not contain ads |
| **Content rating** | See below |
| **Target audience** | Ages **13–15, 16–17, 18 and over**. Leaving out under-13s keeps the app out of Google's Families programme, which has extra rules for children's apps. |
| **News app** | No |
| **Data safety** | See below |
| **Government app** | No |
| **Financial features** | My app doesn't provide any financial features |
| **Health** | My app does not have any health features |

### Content rating questionnaire
- Email: assistinternaldata@gmail.com · Category: **Reference, News, or Educational**
- **User interaction:** users can't talk to each other or share content inside the app. The share button only hands an ovi's text to the phone's normal share menu.
- **Violence:** the text and the linked episodes retell mythological battles. Answer **yes to fantasy / non-realistic violence** if your animated episodes show fights, and describe any death or injury scenes truthfully (for example, a scene in adhyay 18 of a death followed by revival).
- **Sexual content, profanity, drugs, gambling:** none in the app itself.
- **Unrestricted internet access:** no. The app only opens your own videos and links to YouTube.

### Data safety
- Does your app collect or share any of the required user data types? **No.** Everything the reader does (progress, bookmarks, parayan, jap counts, settings) stays on the phone, and the app has no analytics, crash reporting, ads or accounts.
- Because nothing is collected, Play skips the remaining questions. The privacy policy explains that videos play through YouTube's own player, which is covered by Google's policy.

## 4. Store listing

Grow users → Store presence → **Main store listing**: paste the text from `play-listing.md` and upload:
- App icon: `play-icon-512.png`
- Feature graphic: `play-feature-graphic.png`
- Phone screenshots: everything in `screenshots/`, in order (1080×2160)
- Category: **Books & Reference** (Store settings), contact email: assistinternaldata@gmail.com, website: `https://assistinternaldata-oss.github.io/navnath-bhaktisaar/`

Add Hindi and English via **Manage translations → Add your own translations**.
