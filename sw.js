// Service worker: keeps the whole pothi available offline.
// Bump VERSION when you add or rename files in SHELL; edits to existing files reach readers on their own.
const VERSION = 'nbs-v6';
const FONTS = 'nbs-fonts';
const BHARAT = 'nbs-bharat';   // the 3D world (bharat/): saved when a reader first opens it, not with the pothi
// Everything the 3D world needs to open offline (its title music is left out: audio is never saved).
// Keep this list in step with the bharat/ folder when that is updated.
const BHARAT_FILES = [
  'bharat/index.html', 'bharat/navnath.css', 'bharat/navnath.js', 'bharat/three.module.min.js',
  ...['khajuraho', 'kashi', 'dwarka', 'ujjain', 'badri', 'trimbak'].flatMap((p) => [`bharat/models/${p}-far.bin`, `bharat/models/${p}-mid.bin`]),
];

const CHAPTERS = Array.from({ length: 40 }, (_, k) => `data/adhyay/${String(k + 1).padStart(2, '0')}.json`);
const FONT_FILES = [
  'tiro-devanagari-marathi-devanagari-400-normal', 'tiro-devanagari-marathi-latin-400-normal',
  ...['400', '500', '600', '700'].flatMap((w) => [`mukta-devanagari-${w}-normal`, `mukta-latin-${w}-normal`]),
].map((f) => `fonts/${f}.woff2`);
const SHELL = [
  './',
  'index.html',
  'fonts/fonts.css',
  ...FONT_FILES,
  'css/app.css',
  'js/app.js',
  'js/i18n.js',
  'js/store.js',
  'js/data.js',
  'js/parayan.js',
  'js/native.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/favicon-48.png',
  'icons/apple-touch-icon.png',
  'icons/logo.webp',
  'data/index.json',
  'data/media.json',
  'data/mantras.json',
  ...CHAPTERS,
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('nbs-') && k !== VERSION && k !== FONTS && k !== BHARAT).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: keep a copy so the pothi looks right offline
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(staleWhileRevalidate(req, FONTS));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // audio streams straight from the network (range requests, large files)
  if (req.headers.has('range') || /\.(mp3|m4a|aac|ogg|opus|wav)$/i.test(url.pathname)) return;

  // The 3D world is a page of its own with large files. They are not fetched until a reader opens
  // it; after that the saved copy is shown at once and refreshed in the background, so it also
  // opens offline. (Its page must not be mistaken for the app's own index.html below.)
  if (url.pathname.includes('/bharat/')) {
    e.respondWith(staleWhileRevalidate(req, BHARAT));
    if (req.mode === 'navigate') e.waitUntil(saveBharat());   // opened once, it is all kept
    return;
  }

  if (req.mode === 'navigate') {
    // only the app page itself falls back to the saved index.html (not embed.html etc.)
    const isShell = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
    e.respondWith(networkFirst(req, isShell ? 'index.html' : undefined));
    return;
  }
  // the pothi text and icons rarely change: serve the saved copy instantly, refresh it in the background
  if (url.pathname.includes('/data/adhyay/') || url.pathname.includes('/icons/') || url.pathname.includes('/fonts/')) {
    e.respondWith(staleWhileRevalidate(req, VERSION));
    return;
  }
  // app code, styles, the adhyay list and media links: newest when online, saved copy when offline
  e.respondWith(networkFirst(req));
});

// fetches whatever of the 3D world is not saved yet; a file that cannot be had is tried again next time
async function saveBharat() {
  const cache = await caches.open(BHARAT);
  await Promise.all(BHARAT_FILES.map(async (file) => {
    if (await cache.match(file, { ignoreSearch: true })) return;
    try { await cache.add(file); } catch { /* offline or missing */ }
  }));
}

// network first, but don't keep a reader waiting on a bad connection
async function networkFirst(req, key) {
  const cache = await caches.open(VERSION);
  const saved = () => cache.match(key || req, { ignoreSearch: true });
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error('slow')), 3500)),
    ]);
    if (res.ok) cache.put(key || req, res.clone());
    return res;
  } catch {
    return (await saved()) || fetch(req).catch(() => Response.error());
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req, { ignoreSearch: cacheName === VERSION || cacheName === BHARAT });
  const network = fetch(req)
    .then((res) => {
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached || Response.error());
  return cached || network;
}
