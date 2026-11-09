// Everything the reader does is kept on this device, in localStorage.
const KEY = 'navnath-bhaktisaar:v1';

const DEFAULTS = {
  lang: null,            // null until the reader picks one on first launch
  theme: 'auto',         // auto | light | sepia | dark
  fontSize: 21,          // px, pothi text
  font: 'pothi',         // pothi | modern
  keepAwake: true,
  lastRead: null,        // { c: adhyay, i: ovi index, at }
  read: {},              // { [adhyay]: timestamp }
  bookmarks: [],         // [{ c, i, at }]
  parayan: null,         // { days, start: 'YYYY-MM-DD', done: { [adhyay]: ts }, startedAt }
  history: [],           // [{ days, start, end }]
  japa: {},              // { [mantraId]: { count, rounds, total, target } }
};

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode or storage full: keep working in memory */
  }
}

export const get = () => state;

export function set(patch) {
  state = { ...state, ...patch };
  save();
  listeners.forEach((fn) => fn(state));
}

export const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));

export function reset() {
  const { lang, theme, fontSize, font, keepAwake } = state;
  state = { ...DEFAULTS, lang, theme, fontSize, font, keepAwake };
  save();
  listeners.forEach((fn) => fn(state));
}

// ---- reading ----
export function setLastRead(c, i, n) {
  const lr = state.lastRead;
  if (lr && lr.c === c && lr.i === i) return;
  state = { ...state, lastRead: { c, i, n, at: Date.now() } };
  save(); // no listeners: this fires while scrolling
}

export function markRead(c, isRead = true) {
  const read = { ...state.read };
  let parayan = state.parayan;
  if (isRead) read[c] = Date.now();
  else delete read[c];
  if (parayan) {
    const done = { ...parayan.done };
    if (isRead) done[c] = Date.now();
    else delete done[c];
    parayan = { ...parayan, done };
  }
  set({ read, parayan });
}

export function toggleParayanDone(c) {
  if (!state.parayan) return;
  const done = { ...state.parayan.done };
  if (done[c]) delete done[c];
  else done[c] = Date.now();
  const read = { ...state.read };
  if (done[c]) read[c] = done[c];
  set({ parayan: { ...state.parayan, done }, read });
}

// ---- bookmarks ----
export const isBookmarked = (c, i) => state.bookmarks.some((b) => b.c === c && b.i === i);

export function toggleBookmark(c, i, n) {
  const has = isBookmarked(c, i);
  const bookmarks = has
    ? state.bookmarks.filter((b) => !(b.c === c && b.i === i))
    : [{ c, i, n, at: Date.now() }, ...state.bookmarks];
  set({ bookmarks });
  return !has;
}

// ---- japa (mantra counter) ----
export const japaFor = (id, target) => ({ count: 0, rounds: 0, total: 0, target, ...(state.japa?.[id] || {}) });

export function setJapa(id, value) {
  state = { ...state, japa: { ...state.japa, [id]: value } };
  save(); // no listeners: called on every tap
}

// ---- parayan ----
export function startParayan(days, start) {
  set({ parayan: { days, start, done: {}, startedAt: Date.now() } });
}

export function stopParayan() {
  set({ parayan: null });
}

export function finishParayan(end) {
  const p = state.parayan;
  if (!p) return;
  set({ parayan: null, history: [{ days: p.days, start: p.start, end }, ...state.history] });
}
