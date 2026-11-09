// Service worker: keeps the whole pothi available offline.
// Bump VERSION when you add or rename files in SHELL; edits to existing files reach readers on their own.
const VERSION = 'nbs-v3';
const FONTS = 'nbs-fonts';

const CHAPTERS = Array.from({ length: 40 }, (_, k) => `data/adhyay/${String(k + 1).padStart(2, '0')}.json`);
const SHELL = [
  './',
  'index.html',
  'css/app.css',
  'js/app.js',
  'js/i18n.js',
  'js/store.js',
  'js/data.js',
  'js/parayan.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/favicon-48.png',
  'icons/apple-touch-icon.png',
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
    await Promise.all(keys.filter((k) => k.startsWith('nbs-') && k !== VERSION && k !== FONTS).map((k) => caches.delete(k)));
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

  if (req.mode === 'navigate') {
    e.respondWith(networkFirst(req, 'index.html'));
    return;
  }
  // the pothi text and icons rarely change: serve the saved copy instantly, refresh it in the background
  if (url.pathname.includes('/data/adhyay/') || url.pathname.includes('/icons/')) {
    e.respondWith(staleWhileRevalidate(req, VERSION));
    return;
  }
  // app code, styles, the adhyay list and media links: newest when online, saved copy when offline
  e.respondWith(networkFirst(req));
});

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
  const cached = await cache.match(req, { ignoreSearch: cacheName === VERSION });
  const network = fetch(req)
    .then((res) => {
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached || Response.error());
  return cached || network;
}
