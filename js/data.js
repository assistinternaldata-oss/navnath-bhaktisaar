// Loads the pothi text and media links (all cached offline by the service worker).
let indexP = null;
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

/** Load every adhyay (for search); reports progress as each one arrives. */
export async function loadAll(onProgress = () => {}) {
  let done = 0;
  return Promise.all(
    Array.from({ length: 40 }, (_, k) => loadChapter(k + 1).then((c) => (onProgress(++done), c))),
  );
}

/** YouTube + audio links per adhyay, from data/media.json. Missing file = no media. */
export function loadMedia() {
  mediaP ??= fetch('data/media.json', { cache: 'no-cache' })
    .then(ok).then((r) => r.json())
    .catch(() => ({ adhyay: {} }));
  return mediaP;
}

export async function mediaFor(n) {
  const m = await loadMedia();
  const entry = m.adhyay?.[String(n)] ?? {};
  return {
    youtube: (entry.youtube || '').trim(),
    audio: (entry.audio || '').trim(),
  };
}

function ok(r) {
  if (!r.ok) throw new Error(`${r.status} ${r.url}`);
  return r;
}
