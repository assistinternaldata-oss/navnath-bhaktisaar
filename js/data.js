// Loads the pothi text and media links (all cached offline by the service worker).
import { isNative, LIVE_SITE } from './native.js';

let indexP = null;

/**
 * Lists that change over time (videos, mantras). Inside the Android/iOS app, read the
 * website's copy first so new episodes appear without an app update; keep the last good
 * copy for offline, and fall back to the copy bundled in the app.
 */
async function liveJSON(path) {
  if (isNative) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const r = await fetch(`${LIVE_SITE}${path}?t=${Date.now()}`, { signal: ctrl.signal, cache: 'no-store' });
      clearTimeout(timer);
      if (r.ok) {
        const data = await r.json();
        try { localStorage.setItem(`live:${path}`, JSON.stringify(data)); } catch { /* storage full */ }
        return data;
      }
    } catch { /* offline: use the saved copy */ }
    try {
      const saved = localStorage.getItem(`live:${path}`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
  }
  const r = ok(await fetch(path, { cache: 'no-cache' }));
  return r.json();
}
let mediaP = null;
const chapters = new Map();

export function loadIndex() {
  indexP ??= fetch('data/index.json').then(ok).then((r) => r.json()).then((d) => d.adhyays)
    .catch((e) => { indexP = null; throw e; });
  return indexP;
}

export function loadChapter(n) {
  if (!chapters.has(n)) {
    const p = fetch(`data/adhyay/${String(n).padStart(2, '0')}.json`).then(ok).then((r) => r.json());
    chapters.set(n, p);
    p.catch(() => chapters.delete(n));
  }
  return chapters.get(n);
}

let mantrasP = null;
/** The mantra list from data/mantras.json. */
export function loadMantras() {
  mantrasP ??= liveJSON('data/mantras.json')
    .then((d) => (d.mantras || []).filter((m) => m && m.id && Array.isArray(m.lines)))
    .catch((e) => { mantrasP = null; throw e; });
  return mantrasP;
}

/** Load every adhyay (for search); reports progress as each one arrives. */
export async function loadAll(onProgress = () => {}) {
  let done = 0;
  return Promise.all(
    Array.from({ length: 40 }, (_, k) => loadChapter(k + 1).then((c) => (onProgress(++done), c))),
  );
}

/** YouTube + audio links per adhyay, from data/media.json. Missing file = no media. */
export function loadMedia() {
  mediaP ??= liveJSON('data/media.json').catch(() => ({ adhyay: {} }));
  return mediaP;
}

/** The 11-character video id from a YouTube link (or an id on its own). */
export function videoId(url) {
  const s = String(url || '').trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/|live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// accepts {videos:[{id,…}]} and the older {youtube:"link"} form
function videosOf(entry = {}) {
  const list = Array.isArray(entry.videos)
    ? entry.videos.map((v) => ({ ...v, id: videoId(v.id || v.url) })).filter((v) => v.id)
    : [];
  const legacy = videoId(entry.youtube);
  if (legacy && !list.some((v) => v.id === legacy)) list.push({ id: legacy, title: '' });
  return list;
}

export async function mediaFor(n) {
  const m = await loadMedia();
  const entry = m.adhyay?.[String(n)] ?? {};
  return {
    videos: videosOf(entry),
    audio: (entry.audio || '').trim(),
    channel: m.channel?.url ? m.channel : null,
  };
}

/** Everything for the Videos tab. */
export async function allVideos() {
  const m = await loadMedia();
  const byAdhyay = [];
  for (let n = 1; n <= 40; n++) {
    const v = videosOf(m.adhyay?.[String(n)]);
    if (v.length) byAdhyay.push([n, v]);
  }
  const songs = (m.songs || []).map((v) => ({ ...v, id: videoId(v.id || v.url) })).filter((v) => v.id);
  return { channel: m.channel?.url ? m.channel : null, byAdhyay, songs };
}

/** A video and the adhyay it belongs to (if any). */
export async function findVideo(id) {
  const { byAdhyay, songs } = await allVideos();
  for (const [c, vs] of byAdhyay) {
    const v = vs.find((x) => x.id === id);
    if (v) return { v, c };
  }
  const s = songs.find((x) => x.id === id);
  return s ? { v: s, c: s.adhyay || null } : null;
}

function ok(r) {
  if (!r.ok) throw new Error(`${r.status} ${r.url}`);
  return r;
}
