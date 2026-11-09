import * as store from './store.js';
import { t, num, setLang, getLang, LANGS, fmtDate } from './i18n.js';
import { loadIndex, loadChapter, loadAll, loadMedia, mediaFor, allVideos, findVideo, loadMantras } from './data.js';
import { PLAN_DAYS, perDayRange, status as parayanStatus, todayISO, addDays } from './parayan.js';
import * as native from './native.js';

const APP_VERSION = '1.0.0';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const view = $('#view');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pad2 = (n) => String(n).padStart(2, '0');

// ---------- icons ----------
const ICONS = {
  book: '<path d="M2 4.5h6a4 4 0 0 1 4 4V20a3 3 0 0 0-3-3H2z"/><path d="M22 4.5h-6a4 4 0 0 0-4 4V20a3 3 0 0 1 3-3h7z"/>',
  diya: '<path d="M12 2.5c1.9 2.6 2.9 4.1 2.9 5.8a2.9 2.9 0 0 1-5.8 0c0-1.7 1-3.2 2.9-5.8z"/><path d="M3 13h18c-.6 3.9-4.4 6.5-9 6.5S3.6 16.9 3 13z"/><path d="M9 21.5h6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.2-4.2"/>',
  bookmark: '<path d="M6 3.5h12v17l-6-4.2-6 4.2z"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  chev: '<path d="m9 18 6-6-6-6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  pause: '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" stroke="none"/>',
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none"/>',
  headphones: '<path d="M3.5 18v-5.5a8.5 8.5 0 0 1 17 0V18"/><path d="M20.5 19a2 2 0 0 1-2 2h-1.5v-6.5h3.5zM3.5 19a2 2 0 0 0 2 2H7v-6.5H3.5z"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5"/>',
  share: '<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.4 13.4 7.2 4.2M15.6 6.4 8.4 10.6"/>',
  check: '<path d="M20 6.5 9.5 17 4 11.5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  download: '<path d="M12 3.5v11m0 0-4.2-4.2m4.2 4.2 4.2-4.2M5 20.5h14"/>',
  mala: '<circle cx="12" cy="3.8" r="1.5"/><circle cx="17.2" cy="5.6" r="1.5"/><circle cx="19.6" cy="10.4" r="1.5"/><circle cx="4.4" cy="10.4" r="1.5"/><circle cx="6.8" cy="5.6" r="1.5"/><circle cx="17.6" cy="15.4" r="1.5"/><circle cx="6.4" cy="15.4" r="1.5"/><path d="M12 15.5v6m-2.2 0h4.4"/><circle cx="12" cy="15.5" r="1.8"/>',
};
const ic = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

// ---------- preferences ----------
function applyPrefs() {
  const s = store.get();
  setLang(s.lang || 'mr');
  const root = document.documentElement;
  root.lang = getLang();
  if (s.theme === 'auto') delete root.dataset.theme;
  else root.dataset.theme = s.theme;
  root.dataset.font = s.font;
  root.style.setProperty('--pothi-size', `${s.fontSize}px`);
  document.title = t('appName');
  requestAnimationFrame(() => {
    const c = getComputedStyle(root).getPropertyValue('--chrome').trim();
    if (c) $('meta[name="theme-color"]').content = c;
  });
  renderNav();
  updateBars();
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyPrefs);

// ---------- toasts ----------
function toast(msg, action) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ''}`;
  if (action) el.querySelector('button').onclick = () => { el.remove(); action.run(); };
  $('#toasts').append(el);
  if (!action?.sticky) {
    setTimeout(() => el.classList.add('out'), action ? 5000 : 2400);
    setTimeout(() => el.remove(), action ? 5400 : 2800);
  }
}

// ---------- navigation ----------
const TABS = [
  ['home', '#/', 'navPothi', 'book'],
  ['parayan', '#/parayan', 'navParayan', 'diya'],
  ['mantra', '#/mantra', 'navMantra', 'mala'],
  ['videos', '#/videos', 'navVideos', 'youtube'],
  ['search', '#/search', 'navSearch', 'search'],
];
let currentView = 'home';

function renderNav() {
  $('#nav').innerHTML = TABS.map(([k, href, label, icon]) =>
    `<a href="${href}" data-tab="${k}"${k === currentView ? ' aria-current="page"' : ''}>${ic(icon)}<span>${t(label)}</span></a>`,
  ).join('');
}

function parseHash() {
  const h = location.hash.slice(1) || '/';
  const [path, qs] = h.split('?');
  return { parts: path.split('/').filter(Boolean), query: new URLSearchParams(qs || '') };
}

let token = 0;
let cleanups = [];
const onCleanup = (fn) => cleanups.push(fn);
const scrollMemo = {};
let visitedNonReader = false;
let routeCount = 0;

let currentKey = 'home'; // view + sub-page, for remembering scroll positions

async function route() {
  if (currentView !== 'a') scrollMemo[currentKey] = scrollY;
  cleanups.forEach((fn) => { try { fn(); } catch { /* ignore */ } });
  cleanups = [];
  closeVideo();
  view.onclick = view.oninput = view.onsubmit = view.onchange = null;
  const my = ++token;
  routeCount++;

  const { parts, query } = parseHash();
  const name = ['a', 'parayan', 'mantra', 'videos', 'search', 'marks', 'settings'].includes(parts[0]) ? parts[0] : 'home';
  currentView = name;
  currentKey = parts[1] && name === 'mantra' ? `mantra/${parts[1]}` : name;
  if (name !== 'a') visitedNonReader = true;
  document.body.dataset.view = name;
  updateBars();
  document.body.classList.remove('has-audio');
  $$('#nav a').forEach((a) => {
    if (a.dataset.tab === name) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  switch (name) {
    case 'a': return renderReader(my, Number(parts[1]), parts[2] ? Number(parts[2]) : null);
    case 'parayan': await renderParayan(my); break;
    case 'mantra': await (parts[1] ? renderMantra(my, decodeURIComponent(parts[1])) : renderMantras(my)); break;
    case 'videos': await renderVideos(my); break;
    case 'search': renderSearch(my, query.get('q') || ''); break;
    case 'marks': await renderMarks(my); break;
    case 'settings': renderSettings(); break;
    default: await renderHome(my);
  }
  if (my === token) scrollTo(0, name === 'search' ? 0 : scrollMemo[currentKey] || 0);
}

// tab pages get a settings gear on the right; settings itself gets a back arrow
const pageHead = (title, { back = false } = {}) => `<header class="page-head"><div class="ph-in">
  ${back ? `<button class="ib" type="button" data-act="back-page" aria-label="${t('back')}">${ic('back')}</button>` : ''}
  <h1>${esc(title)}</h1>
  ${back ? '' : `<a class="ib" href="#/settings" aria-label="${t('settings')}">${ic('sliders')}</a>`}
</div></header>`;

const errorBox = () => `<div class="card error-box"><p>${t('loadError')}</p>
  <button class="btn" type="button" data-act="retry">${t('retry')}</button></div>`;

const titleOf = (a) => a.title[getLang()] || a.title.mr;

// =====================================================================
// Home
// =====================================================================
async function renderHome(my) {
  let index, media, vids;
  try {
    [index, media, vids] = await Promise.all([loadIndex(), loadMedia(), allVideos()]);
  } catch {
    if (my === token) { view.innerHTML = `<div class="wrap">${errorBox()}</div>`; view.onclick = retryHandler; }
    return;
  }
  if (my !== token) return;
  const s = store.get();
  const readN = Object.keys(s.read).length;

  view.innerHTML = `
    <header class="hero">
      <a class="ib hero-gear" href="#/settings" aria-label="${t('settings')}">${ic('sliders')}</a>
      <div class="hero-in">
        <div class="orn">॥ अलख निरंजन ॥</div>
        <h1 lang="mr">श्री नवनाथ भक्तिसार</h1>
        ${getLang() === 'en' ? '<p class="hero-en">Shri Navnath Bhaktisaar</p>' : ''}
        <p class="by">${t('author')}</p>
      </div>
    </header>
    <div class="wrap home">
      ${continueCard(s, index)}
      <a class="card quick" href="#/marks">${ic('bookmark', 'gold')}<span>${t('navMarks')}</span>
        ${s.bookmarks.length ? `<span class="muted">${num(s.bookmarks.length)}</span>` : ''}${ic('chev', 'end muted')}</a>
      ${homeParayanCard(s)}
      <div id="install-banner-slot">${installBanner()}</div>
      ${homeSeries(vids)}
      <section class="list-sec" aria-labelledby="all-h">
        <div class="sec-head"><h2 id="all-h">${t('allAdhyays')}</h2><span class="muted">${t('readCount', { n: readN })}</span></div>
        <ol class="alist">${index.map((a) => adhyayRow(a, s, media)).join('')}</ol>
      </section>
      <footer class="shloka" lang="sa">
        <p>गोरक्षजालंदरचर्पटाश्च अडबंगकानीफमछिंदराद्याः ।<br>चौरंगिरेवाणकभर्तिसंज्ञा भूम्यां बभूवुर्नवनाथसिद्धाः ॥</p>
        <p class="jai">${t('jai')}</p>
      </footer>
    </div>`;
  view.onclick = commonClicks;
}

function continueCard(s, index) {
  const lr = s.lastRead;
  if (!lr) {
    return `<a class="card cont" href="#/a/1">
      <div><div class="kicker">${t('startReading')}</div>
      <div class="cont-t">${t('adhyayN', { n: 1 })}</div>
      <div class="cont-s">${esc(titleOf(index[0]))}</div></div>
      <span class="go">${ic('chev')}</span></a>`;
  }
  return `<a class="card cont" href="#/a/${lr.c}/${lr.i}">
    <div><div class="kicker">${t('continue')}</div>
    <div class="cont-t">${t('adhyayN', { n: lr.c })} <span class="muted">· ${t('fromOvi', { n: lr.n ?? lr.i })}</span></div>
    <div class="cont-s">${esc(titleOf(index[lr.c - 1]))}</div></div>
    <span class="go">${ic('chev')}</span></a>`;
}

function homeParayanCard(s) {
  const p = s.parayan;
  if (!p) {
    return `<a class="card pcard idle" href="#/parayan">
      <div class="pc-row">${ic('diya')}<b>${t('begin')}</b>${ic('chev', 'end')}</div>
      <p class="muted small clamp2">${t('parayanIntro')}</p></a>`;
  }
  const st = parayanStatus(p);
  const list = [...st.overdue, ...st.todays];
  const label = st.notStarted ? t('startsOn', { date: fmtDate(p.start) }) : t('dayOf', { d: st.day, n: p.days });
  return `<a class="card pcard" href="#/parayan">
    <div class="pc-row">${ic('diya')}<b>${t('navParayan')} · ${label}</b>${ic('chev', 'end')}</div>
    <div class="meter thin"><span style="width:${(st.doneCount / 40) * 100}%"></span></div>
    <div class="pc-today"><span class="muted small">${st.todayDone ? t('todayDone') : t('today')}</span>
      <span class="chips">${list.map((c) => `<span class="chip-c sm${p.done[c] ? ' done' : ''}">${num(c)}</span>`).join('')}</span>
    </div></a>`;
}

function homeSeries(vids) {
  const flat = vids.byAdhyay.flatMap(([c, vs]) => vs.filter((v) => !v.song && v.lang !== 'en').map((v) => ({ v, c })));
  if (!flat.length) return '';
  const latest = flat.slice(-8).reverse();
  return `<section class="vsec" aria-labelledby="series-h">
    <div class="sec-head"><h2 id="series-h">${t('series')}</h2><a href="#/videos">${t('seeAll')} ›</a></div>
    ${videoRow(latest.map(({ v, c }) => videoCard(v, c)))}</section>`;
}

function adhyayRow(a, s, media) {
  const m = media.adhyay?.[String(a.n)] || {};
  const read = !!s.read[a.n];
  const extras = [
    m.videos?.length || m.youtube ? ic('youtube', 'sm yt') : '',
    m.audio ? ic('headphones', 'sm') : '',
  ].join('');
  return `<li><a class="arow${read ? ' read' : ''}" href="#/a/${a.n}">
    <span class="anum" lang="mr">${num(a.n)}</span>
    <span class="abody"><span class="atitle">${esc(titleOf(a))}</span>
      <span class="ameta">${t('ovis', { n: a.ovis })}${extras ? ` <span class="aicons">${extras}</span>` : ''}</span></span>
    <span class="astate">${read ? ic('check', 'okc') : ic('chev', 'muted')}</span></a></li>`;
}

// =====================================================================
// Reader
// =====================================================================
function readerTop(c) {
  return `<header class="topbar">
    <button class="ib" type="button" data-act="back" aria-label="${t('back')}">${ic('back')}</button>
    <div class="tb-title">${t('adhyayN', { n: c })}</div>
    <button class="ib txt" type="button" data-act="font-" aria-label="${t('textSmaller')}" lang="mr">अ<small>−</small></button>
    <button class="ib txt" type="button" data-act="font+" aria-label="${t('textBigger')}" lang="mr">अ<small>+</small></button>
    <div class="tb-progress"><span></span></div>
  </header>`;
}

// one charan per line on phones (alternate lines indented), two per line on wider screens
function oviHTML(b, marked) {
  const parts = b.x.split(/\s*॥\s*/).filter(Boolean);
  const body = parts.map((p, k) => {
    const end = k === parts.length - 1 ? `<span class="on">॥${esc(b.n)}॥</span>` : '॥';
    return `<span class="c">${esc(p)}&nbsp;${end}</span>`;
  }).join(' ');
  return `<div class="ovi${marked ? ' marked' : ''}" id="o${b.i}" data-i="${b.i}" tabindex="0">${body}</div>`;
}

function blockHTML(b, c) {
  if (b.t === 'ovi') return oviHTML(b, store.isBookmarked(c, b.i));
  return `<p class="${b.t}">${esc(b.x)}</p>`;
}

function chapterEnd(c, isRead) {
  return `<footer class="ch-end">
    <div class="end-orn" aria-hidden="true">❁</div>
    <button class="btn big ${isRead ? 'done' : 'primary'}" type="button" data-act="mark-read" aria-pressed="${isRead}">
      ${isRead ? t('isRead') : t('markRead')}</button>
    <nav class="ch-nav">
      ${c > 1 ? `<a class="btn ghost" href="#/a/${c - 1}" data-act="goto">${ic('back')} ${t('prev')}</a>` : '<span></span>'}
      ${c < 40 ? `<a class="btn ghost" href="#/a/${c + 1}" data-act="goto">${t('next')} ${ic('chev')}</a>` : ''}
    </nav></footer>`;
}

async function renderReader(my, c, target) {
  if (!(c >= 1 && c <= 40)) { location.replace('#/'); return; }
  view.innerHTML = `<div class="reader">${readerTop(c)}<p class="loading">${t('loading')}</p></div>`;
  view.onclick = readerChrome;
  scrollTo(0, 0);

  let ch, index, media, mantras;
  try {
    [ch, index, media, mantras] = await Promise.all([loadChapter(c), loadIndex(), mediaFor(c), loadMantras().catch(() => [])]);
  } catch {
    if (my === token) $('.loading').outerHTML = errorBox();
    return;
  }
  if (my !== token) return;

  const s = store.get();
  const meta = index[c - 1];
  const lr = s.lastRead;
  const resume = !target && lr && lr.c === c && lr.i > 2 ? lr : null;
  const byI = new Map(ch.blocks.filter((b) => b.t === 'ovi').map((b) => [b.i, b]));

  view.innerHTML = `<div class="reader">${readerTop(c)}
    <article class="pothi" lang="mr">
      <header class="ch-head">
        <div class="ch-kicker">${t('adhyayN', { n: c })}</div>
        <h1 class="ch-title" lang="${getLang()}">${esc(titleOf(meta))}</h1>
        <div class="ch-meta">${t('ovis', { n: meta.ovis })}</div>
        ${media.audio ? `<div class="ch-media">
          <button class="btn" type="button" data-act="listen">${ic('headphones')} ${t('listen')}</button></div>` : ''}
        ${media.videos.length ? `<div class="ch-videos">
          <div class="chv-h">${ic('youtube', 'yt')} ${t('watchHere')}</div>
          ${videoRow(media.videos.map((v) => videoCard(v, c, false)), media.videos.length === 1)}</div>`
        : media.channel ? `<p class="soon small muted">${t('comingSoon')}
          <a href="${esc(media.channel.subscribe || media.channel.url)}" target="_blank" rel="noopener">${t('subscribe')}</a></p>` : ''}
        ${mantras.filter((m) => m.adhyay === c).map((m) =>
          `<a class="chip mchip" href="#/mantra/${encodeURIComponent(m.id)}">${ic('mala', 'sm')} ${esc(L(m.title))}</a>`).join('')}
        ${resume ? `<button class="chip resume" type="button" data-act="resume">${t('resumeHere', { n: resume.n ?? resume.i })} ${ic('down', 'sm')}</button>` : ''}
      </header>
      ${ch.blocks.map((b) => blockHTML(b, c)).join('')}
      ${chapterEnd(c, !!s.read[c])}
    </article>
    ${media.audio ? `<div class="audio-bar" role="group" aria-label="${t('listen')}">
      <button class="play" type="button" data-act="play" aria-label="${t('play')}">${ic('play')}</button>
      <span class="time cur">${num('0:00')}</span>
      <input type="range" min="0" max="0" step="1" value="0" aria-label="${t('listen')}">
      <span class="time dur">--:--</span></div>` : ''}
  </div>`;

  const article = $('.pothi');
  let bar = null;

  const closeBar = () => {
    $('.ovi.sel')?.classList.remove('sel');
    bar?.remove();
    bar = null;
  };

  const openBar = (el) => {
    const i = Number(el.dataset.i);
    const marked = store.isBookmarked(c, i);
    el.classList.add('sel');
    bar = document.createElement('div');
    bar.className = 'ovi-bar';
    bar.setAttribute('role', 'toolbar');
    bar.innerHTML = `
      <button class="btn sm" type="button" data-act="bm" data-i="${i}">${ic('bookmark', marked ? 'filled' : '')} ${marked ? t('unbookmark') : t('bookmark')}</button>
      <button class="btn sm" type="button" data-act="copy" data-i="${i}">${ic('copy')} ${t('copy')}</button>
      ${native.canShare() ? `<button class="btn sm" type="button" data-act="share" data-i="${i}">${ic('share')} ${t('share')}</button>` : ''}`;
    el.after(bar);
  };

  const oviText = (i) => {
    const b = byI.get(i);
    return `${b.x} ॥${b.n}॥\n— ${t('appName')}, ${t('adhyayN', { n: c })}, ${t('oviN', { n: b.n })}`;
  };

  view.onclick = async (e) => {
    if (readerChrome(e)) return;
    const act = e.target.closest('[data-act]');
    if (act) {
      const i = Number(act.dataset.i);
      switch (act.dataset.act) {
        case 'bm': {
          const b = byI.get(i);
          const now = store.toggleBookmark(c, i, b.n);
          $(`#o${i}`).classList.toggle('marked', now);
          toast(now ? t('bookmarked') : t('unbookmarked'));
          closeBar();
          return;
        }
        case 'copy':
          try { await navigator.clipboard.writeText(oviText(i)); toast(t('copied')); } catch { /* denied */ }
          closeBar();
          return;
        case 'share':
          native.share(t('appName'), oviText(i));
          closeBar();
          return;
        case 'resume': {
          act.remove();
          jumpTo(resume.i);
          return;
        }
        case 'mark-read': {
          const nowRead = !store.get().read[c];
          store.markRead(c, nowRead);
          act.outerHTML = chapterEnd(c, nowRead).match(/<button[\s\S]*?<\/button>/)[0];
          const p = store.get().parayan;
          if (nowRead && p && Object.keys(p.done).length >= 40) { location.hash = '#/parayan'; return; }
          if (nowRead) toast(t('isRead'), c < 40 ? { label: t('next'), run: () => location.replace(`#/a/${c + 1}`) } : null);
          return;
        }
        default:
          return;
      }
    }
    const ovi = e.target.closest('.ovi');
    if (ovi && !getSelection().toString()) {
      const wasSel = ovi.classList.contains('sel');
      closeBar();
      if (!wasSel) openBar(ovi);
    }
  };
  view.onkeydown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('ovi')) {
      e.preventDefault();
      e.target.click();
    }
  };
  onCleanup(() => { view.onkeydown = null; });

  // where we open
  const jumpTo = (i) => {
    const el = $(`#o${i}`);
    if (!el) return;
    el.scrollIntoView({ block: 'center' });
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  };
  if (target) jumpTo(target);

  // only remember the position once the reader actually scrolls (or jumped here on purpose),
  // so peeking at an adhyay doesn't overwrite where they left off
  trackPosition(c, byI, !!target);
  trackProgress(article);
  keepScreenOn();
  if (media.audio) setupAudio(media.audio, c, titleOf(meta));
}

/** Top-bar buttons and reader links. Returns true when it handled the click. */
function readerChrome(e) {
  const el = e.target.closest('[data-act]');
  if (!el) return false;
  switch (el.dataset.act) {
    case 'back':
      if (visitedNonReader) history.back();
      else location.replace('#/');
      return true;
    case 'goto':
      e.preventDefault();
      location.replace(el.getAttribute('href'));
      return true;
    case 'font-':
    case 'font+': {
      const anchor = $$('.ovi').find((o) => o.getBoundingClientRect().bottom > 80);
      const before = anchor?.getBoundingClientRect().top;
      const size = Math.min(36, Math.max(15, store.get().fontSize + (el.dataset.act === 'font+' ? 1 : -1)));
      store.set({ fontSize: size });
      document.documentElement.style.setProperty('--pothi-size', `${size}px`);
      if (anchor) scrollBy(0, anchor.getBoundingClientRect().top - before);
      return true;
    }
    case 'retry':
      route();
      return true;
    default:
      return false;
  }
}

function trackPosition(c, byI, armed) {
  const visible = new Set();
  let timer = null;
  const save = () => {
    if (!armed || !visible.size) return;
    const i = Math.min(...visible);
    clearTimeout(timer);
    timer = setTimeout(() => store.setLastRead(c, i, byI.get(i)?.n), 400);
  };
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      const i = Number(en.target.dataset.i);
      if (en.isIntersecting) visible.add(i);
      else visible.delete(i);
    }
    save();
  }, { rootMargin: '-72px 0px -55% 0px' });
  $$('.ovi').forEach((el) => io.observe(el));
  const armAfter = performance.now() + 700; // ignore our own initial scroll
  const onScroll = () => {
    if (!armed && performance.now() > armAfter) { armed = true; save(); }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onCleanup(() => { io.disconnect(); clearTimeout(timer); removeEventListener('scroll', onScroll); });
}

function trackProgress(article) {
  const fill = $('.tb-progress span');
  let raf = 0;
  const update = () => {
    raf = 0;
    const r = article.getBoundingClientRect();
    const total = r.height - innerHeight;
    const pct = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    fill.style.width = `${pct * 100}%`;
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', onScroll, { passive: true });
  update();
  onCleanup(() => removeEventListener('scroll', onScroll));
}

function keepScreenOn() {
  if (!store.get().keepAwake) return;
  if (native.keepAwake(true)) {
    onCleanup(() => native.keepAwake(false));
    return;
  }
  if (!('wakeLock' in navigator)) return;
  let lock = null;
  let alive = true;
  const request = async () => {
    try {
      const l = await navigator.wakeLock.request('screen');
      if (alive) lock = l;
      else l.release();
    } catch { /* not allowed right now */ }
  };
  const onVis = () => { if (document.visibilityState === 'visible') request(); };
  document.addEventListener('visibilitychange', onVis);
  onCleanup(() => {
    alive = false;
    document.removeEventListener('visibilitychange', onVis);
    lock?.release().catch(() => {});
  });
  request();
}

function setupAudio(src, c, title) {
  document.body.classList.add('has-audio');
  const audio = new Audio();
  audio.preload = 'none';
  audio.src = src;
  const barEl = $('.audio-bar');
  const btn = $('.play', barEl);
  const seek = $('input', barEl);
  const cur = $('.cur', barEl);
  const dur = $('.dur', barEl);
  let dragging = false;
  const fmt = (sec) => (Number.isFinite(sec) ? num(`${Math.floor(sec / 60)}:${pad2(Math.floor(sec % 60))}`) : '--:--');
  const sync = () => {
    btn.innerHTML = ic(audio.paused ? 'play' : 'pause');
    btn.setAttribute('aria-label', audio.paused ? t('play') : t('pause'));
  };
  const toggle = () => (audio.paused ? audio.play().catch(() => toast(t('loadError'))) : audio.pause());

  btn.onclick = (e) => { e.stopPropagation(); toggle(); };
  const listen = $('[data-act="listen"]');
  if (listen) listen.onclick = (e) => { e.stopPropagation(); toggle(); };
  audio.onplay = audio.onpause = sync;
  audio.ondurationchange = () => { seek.max = Math.floor(audio.duration) || 0; dur.textContent = fmt(audio.duration); };
  audio.ontimeupdate = () => { if (!dragging) seek.value = Math.floor(audio.currentTime); cur.textContent = fmt(audio.currentTime); };
  seek.oninput = () => { dragging = true; cur.textContent = fmt(Number(seek.value)); };
  seek.onchange = () => { audio.currentTime = Number(seek.value); dragging = false; };

  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${t('adhyayN', { n: c })} — ${title}`,
      artist: t('appName'),
      artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
    });
  }
  onCleanup(() => {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    document.body.classList.remove('has-audio');
  });
}

// =====================================================================
// Videos (the Shri Darshan series on YouTube)
// =====================================================================
const thumb = (id) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

function videoLabel(v, c) {
  const bits = [];
  if (c) bits.push(t('adhyayN', { n: c }));
  if (v.song) bits.push(t('song'));
  else if (v.full) bits.push(t('fullAdhyay'));
  else if (v.part) bits.push(t('partN', { n: v.part }));
  if (v.lang === 'en') bits.push('English');
  return bits.join(' · ');
}

// videos with embedding switched off on YouTube ("embed": false) open on YouTube instead
function videoCard(v, c, showAdhyay = true) {
  const label = videoLabel(v, showAdhyay ? c : null);
  const inner = `<span class="vthumb"><img src="${thumb(v.id)}" alt="" loading="lazy" decoding="async">
      <span class="vplay">${ic('play')}</span>
      ${v.min ? `<span class="vdur">${t('minutes', { n: v.min })}</span>` : ''}</span>
    ${label ? `<span class="vlabel">${esc(label)}</span>` : ''}
    ${v.title ? `<span class="vtitle" lang="${v.lang || 'hi'}">${esc(v.title)}</span>` : ''}`;
  return v.embed === false
    ? `<a class="vcard" href="https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}" target="_blank" rel="noopener">${inner}</a>`
    : `<button class="vcard" type="button" data-act="video" data-id="${esc(v.id)}">${inner}</button>`;
}

const videoRow = (cards, single = false) => `<div class="vrow${single ? ' one' : ''}">${cards.join('')}</div>`;

function channelCard(ch, vids) {
  const count = vids.byAdhyay.reduce((sum, [, vs]) => sum + vs.filter((v) => !v.song && v.lang !== 'en').length, 0);
  return `<section class="card channel">
    <div class="chan-row"><span class="chan-logo">${ic('youtube')}</span>
      <div><b>${esc(ch.name || 'YouTube')}</b><div class="muted small">YouTube · ${t('episodes', { n: count })}</div></div></div>
    <p>${t('channelBlurb')}</p>
    <div class="chan-btns">
      <a class="btn sub-btn" href="${esc(ch.subscribe || ch.url)}" target="_blank" rel="noopener">${t('subscribe')}</a>
      ${ch.playlist ? `<a class="btn" href="${esc(ch.playlist)}" target="_blank" rel="noopener">${ic('youtube', 'yt')} ${t('playlist')}</a>` : ''}
    </div></section>`;
}

async function renderVideos(my) {
  let vids, index;
  try {
    [vids, index] = await Promise.all([allVideos(), loadIndex()]);
  } catch {
    if (my === token) { view.innerHTML = `${pageHead(t('navVideos'))}<div class="wrap">${errorBox()}</div>`; view.onclick = retryHandler; }
    return;
  }
  if (my !== token) return;
  const ch = vids.channel;
  const lastWithVideo = vids.byAdhyay.at(-1)?.[0] ?? 0;
  view.innerHTML = `${pageHead(t('navVideos'))}<div class="wrap">
    ${ch ? channelCard(ch, vids) : ''}
    ${vids.songs.length ? `<section class="vsec"><div class="sec-head"><h2>${t('songs')}</h2></div>
      ${videoRow(vids.songs.map((v) => videoCard(v, null)))}</section>` : ''}
    <div class="sec-head"><h2>${t('byAdhyay')}</h2></div>
    ${vids.byAdhyay.map(([c, vs]) => `<section class="vgroup">
      <a class="vg-h" href="#/a/${c}"><span class="anum sm" lang="mr">${num(c)}</span>
        <span class="vg-t"><b>${t('adhyayN', { n: c })}</b><span class="muted small clamp1">${esc(titleOf(index[c - 1]))}</span></span>
        ${ic('chev', 'muted')}</a>
      ${videoRow(vs.map((v) => videoCard(v, c, false)))}</section>`).join('')}
    ${ch && lastWithVideo < 40 ? `<p class="soon muted">${t('moreSoon')}
      <a href="${esc(ch.subscribe || ch.url)}" target="_blank" rel="noopener">${t('subscribe')}</a></p>` : ''}
  </div>`;
  view.onclick = commonClicks;
}

// The apps can't embed YouTube directly (YouTube needs a website as the source), so they
// load the published embed.html page, which embeds the player.
const embedURL = (id) => (native.isNative
  ? `${native.LIVE_SITE}embed.html?v=${encodeURIComponent(id)}`
  : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`);

// the in-app player: tap any video card
async function openVideo(id) {
  const found = await findVideo(id).catch(() => null);
  const v = found?.v || { id, title: '' };
  const c = found?.c || null;
  const { parts } = parseHash();
  const readingThis = parts[0] === 'a' && Number(parts[1]) === c;
  closeVideo();
  const el = document.createElement('div');
  el.className = 'player';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', v.title || t('navVideos'));
  el.innerHTML = `<div class="pl-backdrop" data-act="close-video"></div>
    <div class="pl-sheet">
      <div class="pl-frame">${navigator.onLine === false
        ? `<p class="pl-off">${t('needsNet')}</p>`
        : `<iframe src="${embedURL(id)}"
            title="${esc(v.title || 'YouTube')}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`}</div>
      <div class="pl-info">
        ${videoLabel(v, c) ? `<div class="vlabel">${esc(videoLabel(v, c))}</div>` : ''}
        ${v.title ? `<h2 lang="${v.lang || 'hi'}">${esc(v.title)}</h2>` : ''}
        <div class="pl-actions">
          ${c && !readingThis ? `<a class="btn primary sm" href="#/a/${c}" data-act="close-video">${ic('book')} ${t('readAdhyay')}</a>` : ''}
          <a class="btn sm" href="https://www.youtube.com/watch?v=${encodeURIComponent(id)}" target="_blank" rel="noopener">${ic('youtube', 'yt')} ${t('openYoutube')}</a>
          <button class="btn sm ghost pl-close" type="button" data-act="close-video">${ic('x')} ${t('close')}</button>
        </div>
      </div>
    </div>`;
  document.body.append(el);
  document.body.classList.add('modal-open');
  el.querySelector('.pl-close').focus({ preventScroll: true });
}

function closeVideo() {
  const p = $('.player');
  if (!p) return;
  p.remove();
  document.body.classList.remove('modal-open');
}

document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-act="video"]');
  if (card) { e.preventDefault(); openVideo(card.dataset.id); return; }
  if (e.target.closest('[data-act="close-video"]')) closeVideo(); // "Read the adhyay" link then navigates
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeVideo(); });

// =====================================================================
// Mantras + japa counter
// =====================================================================
/** Pick the current UI language from a {mr, hi, en} object (or pass a plain string through). */
const L = (o) => (o && typeof o === 'object' ? o[getLang()] || o.mr || o.en || '' : o || '');

function mantraItem(m, s) {
  const total = s.japa?.[m.id]?.total || 0;
  return `<li><a class="card mitem${m.featured ? ' featured' : ''}" href="#/mantra/${encodeURIComponent(m.id)}">
    <span class="mi-icon">${ic('mala')}</span>
    <span class="mi-body">
      <span class="mi-deity">${esc(L(m.deity))}</span>
      <span class="mi-title">${esc(L(m.title))}</span>
      <span class="mi-line" lang="${m.lang || 'sa'}">${esc(m.lines[0])}</span>
      ${m.video || total ? `<span class="mi-meta">${m.video ? `${ic('youtube', 'sm yt')} ${t('navVideos')}` : ''}${total ? `<span>${t('chantedN', { n: total })}</span>` : ''}</span>` : ''}
    </span>${ic('chev', 'muted')}</a></li>`;
}

async function renderMantras(my) {
  let list;
  try {
    list = await loadMantras();
  } catch {
    if (my === token) { view.innerHTML = `${pageHead(t('navMantra'))}<div class="wrap">${errorBox()}</div>`; view.onclick = retryHandler; }
    return;
  }
  if (my !== token) return;
  const s = store.get();
  view.innerHTML = `${pageHead(t('navMantra'))}<div class="wrap">
    <p class="intro muted">${t('mantrasIntro')}</p>
    <ul class="mlist">${list.map((m) => mantraItem(m, s)).join('')}</ul></div>`;
  view.onclick = commonClicks;
}

const RING = 2 * Math.PI * 88;

async function renderMantra(my, id) {
  let list, vid = null;
  try {
    list = await loadMantras();
    const m0 = list.find((x) => x.id === id);
    if (m0?.video) vid = (await findVideo(m0.video).catch(() => null))?.v || { id: m0.video, title: '' };
  } catch {
    if (my === token) { view.innerHTML = `${pageHead(t('navMantra'), { back: true })}<div class="wrap">${errorBox()}</div>`; view.onclick = retryHandler; }
    return;
  }
  if (my !== token) return;
  const m = list.find((x) => x.id === id);
  if (!m) { location.replace('#/mantra'); return; }
  let j = store.japaFor(m.id, m.japa || 108);

  view.innerHTML = `${pageHead(L(m.title), { back: true })}<div class="wrap mantra-page">
    <div class="kicker m-deity">${esc(L(m.deity))}</div>
    <section class="card m-text" lang="${m.lang || 'sa'}">${m.lines.map((l) => `<p>${esc(l)}</p>`).join('')}</section>
    <section class="card japa" aria-label="${t('japa')}">
      <button class="japa-btn" type="button" data-act="japa" aria-label="${t('countBtn')}">
        <svg viewBox="0 0 200 200" aria-hidden="true"><circle class="jr-bg" cx="100" cy="100" r="88"/>
          <circle class="jr-fg" cx="100" cy="100" r="88" stroke-dasharray="${RING}" stroke-dashoffset="${RING}"/></svg>
        <span class="jb-in"><span class="jb-num" aria-live="polite"></span><span class="jb-of"></span></span>
      </button>
      <p class="muted small center">${t('tapToCount')}</p>
      <div class="jstats"><span id="j-rounds"></span><span id="j-total"></span></div>
      <div class="jrow"><span class="small muted">${t('target')}</span>
        <div class="seg jseg" role="radiogroup">${[11, 21, 108].map((n) =>
          `<button type="button" role="radio" data-act="japa-target" data-v="${n}">${num(n)}</button>`).join('')}</div></div>
      <div class="jrow"><button class="btn sm" type="button" data-act="japa-minus">${t('minusOne')}</button>
        <button class="btn sm ghost" type="button" data-act="japa-reset">${t('resetCount')}</button></div>
    </section>
    ${vid ? `<div class="m-video"><div class="chv-h">${ic('youtube', 'yt')} ${t('watchMantra')}</div>${videoRow([videoCard(vid, null, false)], true)}</div>` : ''}
    ${L(m.note) ? `<p class="m-note muted">${esc(L(m.note))}</p>` : ''}
    ${m.adhyay ? `<a class="card quick" href="#/a/${m.adhyay}">${ic('book')}<span>${t('relatedAdhyay', { n: m.adhyay })}</span>${ic('chev', 'end muted')}</a>` : ''}
  </div>`;

  const btn = $('.japa-btn');
  const paint = () => {
    $('.jr-fg').style.strokeDashoffset = RING * (1 - j.count / j.target);
    $('.jb-num').textContent = num(j.count);
    $('.jb-of').textContent = `/ ${num(j.target)}`;
    $('#j-rounds').textContent = t('malaN', { n: j.rounds });
    $('#j-total').textContent = t('totalN', { n: j.total });
    $$('.jseg button').forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.v) === j.target)));
  };
  paint();

  view.onclick = (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    switch (el.dataset.act) {
      case 'japa':
        j = { ...j, count: j.count + 1, total: j.total + 1 };
        if (j.count >= j.target) {
          j.count = 0;
          j.rounds += 1;
          native.haptic(true);
          toast(t('malaDone'));
        } else {
          native.haptic();
        }
        store.setJapa(m.id, j);
        paint();
        btn.classList.remove('pulse');
        void btn.offsetWidth;
        btn.classList.add('pulse');
        break;
      case 'japa-minus':
        if (j.count > 0) { j = { ...j, count: j.count - 1, total: Math.max(0, j.total - 1) }; store.setJapa(m.id, j); paint(); }
        break;
      case 'japa-reset':
        if (confirm(t('resetJapaQ'))) { j = { count: 0, rounds: 0, total: 0, target: j.target }; store.setJapa(m.id, j); paint(); }
        break;
      case 'japa-target':
        j = { ...j, target: Number(el.dataset.v), count: Math.min(j.count, Number(el.dataset.v) - 1) };
        store.setJapa(m.id, j);
        paint();
        break;
      case 'back-page':
        if (routeCount > 1) history.back();
        else location.replace('#/mantra');
        break;
      default:
        commonClicks(e);
    }
  };
  keepScreenOn();
}

// =====================================================================
// Parayan
// =====================================================================
let justCompleted = null;

async function renderParayan(my) {
  const index = await loadIndex().catch(() => null);
  if (my !== token) return;
  if (!index) { view.innerHTML = `${pageHead(t('parayanTitle'))}<div class="wrap">${errorBox()}</div>`; view.onclick = retryHandler; return; }

  const s = store.get();
  const today = todayISO();
  let body = '';
  if (s.parayan) {
    const st = parayanStatus(s.parayan, today);
    if (st.complete) {
      justCompleted = { days: s.parayan.days, start: s.parayan.start, end: today };
      store.finishParayan(today);
      return renderParayan(my);
    }
    body = activeParayan(s.parayan, st, index);
  } else {
    if (justCompleted) {
      body = `<section class="card complete">
        <div class="big-diya">${ic('diya')}</div>
        <h2>${t('complete')}</h2><p>${t('completeMsg')}</p>
        <p class="jai">${t('jai')}</p></section>
        <h2 class="sub-h">${t('newParayan')}</h2>`;
      justCompleted = null;
    }
    body += planForm();
  }
  if (s.history.length) {
    body += `<section class="card"><h2>${t('history')}</h2><ul class="hist">${s.history.map((h) =>
      `<li>${ic('check', 'okc sm')} ${t('historyRow', { days: h.days, from: fmtDate(h.start, { day: 'numeric', month: 'short', year: 'numeric' }), to: fmtDate(h.end, { day: 'numeric', month: 'short', year: 'numeric' }) })}</li>`).join('')}</ul></section>`;
  }
  view.innerHTML = `${pageHead(t('parayanTitle'))}<div class="wrap">${body}</div>`;

  view.onsubmit = (e) => {
    const f = e.target;
    if (f.dataset.form !== 'plan') return;
    e.preventDefault();
    const data = new FormData(f);
    store.startParayan(Number(data.get('days')), data.get('start') || todayISO());
    renderParayan(token);
    scrollTo(0, 0);
  };
  view.onclick = (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    if (el.dataset.act === 'ptoggle') {
      e.preventDefault();
      store.toggleParayanDone(Number(el.dataset.c));
      const y = scrollY;
      const open = $('details.sched')?.open;
      renderParayan(token).then(() => {
        if (open) $('details.sched').open = true;
        scrollTo(0, y);
      });
    } else if (el.dataset.act === 'pstop') {
      if (confirm(t('stopConfirm'))) { store.stopParayan(); renderParayan(token); }
    }
  };
}

function planForm() {
  return `<section class="card">
    <p class="lead">${t('parayanIntro')}</p>
    <form class="plan-form" data-form="plan">
      <fieldset><legend>${t('howManyDays')}</legend>
        <div class="days-grid">${PLAN_DAYS.map((d) => {
          const [a, b] = perDayRange(d);
          return `<label class="day-opt"><input type="radio" name="days" value="${d}"${d === 7 ? ' checked' : ''}>
            <span class="d">${d === 1 ? t('oneDay') : t('daysN', { n: d })}</span>
            <span class="per">${a === b ? t('perDay', { n: a }) : t('perDayRange', { a, b })}</span></label>`;
        }).join('')}</div>
      </fieldset>
      <label class="field"><span>${t('startDate')}</span><input type="date" name="start" value="${todayISO()}" required></label>
      <button class="btn primary big" type="submit">${ic('diya')} ${t('begin')}</button>
    </form></section>`;
}

function activeParayan(p, st, index) {
  const end = addDays(p.start, p.days - 1);
  const row = (c, late) => `<li class="p-row${p.done[c] ? ' done' : ''}${late ? ' late' : ''}">
    <button class="tick" type="button" data-act="ptoggle" data-c="${c}" aria-pressed="${!!p.done[c]}" aria-label="${t('adhyayN', { n: c })}: ${t('markRead')}">${ic('check')}</button>
    <a class="p-link" href="#/a/${c}"><span class="p-n">${t('adhyayN', { n: c })}</span><span class="p-t">${esc(titleOf(index[c - 1]))}</span></a>
    ${ic('chev', 'muted')}</li>`;

  return `<section class="card p-status">
      <div class="p-day">${st.notStarted ? t('startsOn', { date: fmtDate(p.start) }) : t('dayOf', { d: st.day, n: p.days })}</div>
      <div class="muted">${fmtDate(p.start)} – ${fmtDate(end)}</div>
      <div class="meter"><span style="width:${(st.doneCount / 40) * 100}%"></span></div>
      <div class="p-sub"><span>${t('doneOf', { n: st.doneCount })}</span>
        <span class="${st.behind ? 'warn' : 'ok'}">${st.behind ? t('behind', { n: st.behind }) : t('onTrack')}</span></div>
    </section>
    <section class="card">
      <h2>${st.notStarted ? t('dayN', { n: 1 }) : t('today')}</h2>
      ${st.todayDone && !st.notStarted ? `<p class="ok-msg">${t('todayDone')}</p>` : ''}
      <ul class="p-list">${st.overdue.map((c) => row(c, true)).join('')}${st.todays.map((c) => row(c, false)).join('')}</ul>
    </section>
    <details class="card sched"><summary>${t('schedule')}</summary>
      ${st.plan.map((cs, d) => `<div class="sched-day${d + 1 === st.day && !st.notStarted ? ' cur' : ''}">
        <div class="sd-h">${t('dayN', { n: d + 1 })} · ${fmtDate(addDays(p.start, d))}</div>
        <div class="chips">${cs.map((c) => `<button class="chip-c${p.done[c] ? ' done' : ''}" type="button" data-act="ptoggle" data-c="${c}" aria-pressed="${!!p.done[c]}" aria-label="${t('adhyayN', { n: c })}">${num(c)}</button>`).join('')}</div>
      </div>`).join('')}
      <p class="muted small">${t('tapToMark')}</p>
    </details>
    <button class="btn danger-ghost" type="button" data-act="pstop">${t('stopParayan')}</button>`;
}

// =====================================================================
// Search
// =====================================================================
let searchSeq = 0;

function renderSearch(my, q) {
  view.innerHTML = `${pageHead(t('navSearch'))}<div class="wrap">
    <form class="search-box" role="search" data-form="search">
      <span class="sb-ic">${ic('search')}</span>
      <input type="search" name="q" lang="mr" value="${esc(q)}" placeholder="${t('searchPh')}" aria-label="${t('navSearch')}" autocomplete="off" enterkeyhint="search">
    </form>
    <div id="results" aria-live="polite"></div></div>`;
  const input = $('input[name="q"]');
  let timer = null;
  view.onsubmit = (e) => { e.preventDefault(); input.blur(); };
  view.oninput = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const v = input.value.trim();
      history.replaceState(null, '', `#/search${v ? `?q=${encodeURIComponent(v)}` : ''}`);
      runSearch(my, v);
    }, 250);
  };
  onCleanup(() => clearTimeout(timer));
  runSearch(my, q);
  if (!q) input.focus({ preventScroll: true });
}

function searchRegex(q) {
  const chars = [...q.replace(/[‌‍]/g, '').replace(/\s+/g, ' ')]
    .map((ch) => (ch === ' ' ? '\\s+' : ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  return new RegExp(chars.join('[\\u200c\\u200d]*'), 'gi');
}

function highlight(text, re) {
  let out = '';
  let last = 0;
  re.lastIndex = 0;
  for (const m of text.matchAll(re)) {
    out += esc(text.slice(last, m.index)) + `<mark>${esc(m[0])}</mark>`;
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}

async function runSearch(my, raw) {
  const out = $('#results');
  const q = raw.normalize('NFC').trim();
  const seq = ++searchSeq;
  if ([...q].length < 2) { out.innerHTML = `<p class="hint muted">${t('searchHint')}</p>`; return; }
  out.innerHTML = `<p class="muted">${t('indexing', { n: 0 })}</p>`;
  let chapters, index;
  try {
    [chapters, index] = await Promise.all([
      loadAll((n) => { if (seq === searchSeq && out.firstElementChild) out.firstElementChild.textContent = t('indexing', { n }); }),
      loadIndex(),
    ]);
  } catch {
    if (seq === searchSeq && my === token) out.innerHTML = errorBox();
    view.onclick = retryHandler;
    return;
  }
  if (seq !== searchSeq || my !== token) return;

  const re = searchRegex(q);
  const CAP = 200;
  let total = 0;
  const groups = new Map();
  for (const ch of chapters) {
    for (const b of ch.blocks) {
      if (b.t !== 'ovi') continue;
      re.lastIndex = 0;
      if (!re.test(b.x)) continue;
      total++;
      if (total > CAP) continue;
      if (!groups.has(ch.n)) groups.set(ch.n, []);
      groups.get(ch.n).push(b);
    }
  }
  if (!total) { out.innerHTML = `<p class="hint muted">${t('noResults')}</p>`; return; }
  out.innerHTML = `<p class="res-count">${t('results', { n: total })}${total > CAP ? ` · ${t('resultsCap', { n: CAP })}` : ''}</p>
    ${[...groups].map(([c, bs]) => `<h2 class="res-h">${t('adhyayN', { n: c })} <span class="muted">· ${esc(titleOf(index[c - 1]))}</span></h2>
      <ul class="res-list">${bs.map((b) => `<li><a href="#/a/${c}/${b.i}" lang="mr">${highlight(b.x, re)} <span class="on">॥${esc(b.n)}॥</span></a></li>`).join('')}</ul>`).join('')}`;
}

// =====================================================================
// Bookmarks
// =====================================================================
async function renderMarks(my) {
  const s = store.get();
  view.innerHTML = `${pageHead(t('navMarks'), { back: true })}<div class="wrap" id="marks"><p class="muted">${t('loading')}</p></div>`;
  view.onclick = marksClicks;
  let index, chapters;
  try {
    index = await loadIndex();
    const needed = [...new Set(s.bookmarks.map((b) => b.c))];
    chapters = new Map((await Promise.all(needed.map(loadChapter))).map((ch) => [ch.n, ch]));
  } catch {
    if (my === token) { $('#marks').innerHTML = errorBox(); view.onclick = retryHandler; }
    return;
  }
  if (my !== token) return;

  const lr = s.lastRead;
  const last = lr ? `<a class="card cont" href="#/a/${lr.c}/${lr.i}">
      <div><div class="kicker">${t('lastRead')}</div>
      <div class="cont-t">${t('adhyayN', { n: lr.c })} <span class="muted">· ${t('oviN', { n: lr.n ?? lr.i })}</span></div>
      <div class="cont-s">${esc(titleOf(index[lr.c - 1]))}</div></div><span class="go">${ic('chev')}</span></a>` : '';

  const items = s.bookmarks.map((bm) => {
    const b = chapters.get(bm.c)?.blocks.find((x) => x.t === 'ovi' && x.i === bm.i);
    if (!b) return '';
    return `<li class="mark"><a href="#/a/${bm.c}/${bm.i}">
        <span class="mk-h">${ic('bookmark', 'filled sm')} ${t('adhyayN', { n: bm.c })} · ${t('oviN', { n: b.n })}</span>
        <span class="mk-x" lang="mr">${esc(b.x)} <span class="on">॥${esc(b.n)}॥</span></span></a>
      <button class="ib" type="button" data-act="unmark" data-c="${bm.c}" data-i="${bm.i}" aria-label="${t('unbookmark')}">${ic('x')}</button></li>`;
  }).join('');

  $('#marks').innerHTML = `${last}${items ? `<ul class="marks">${items}</ul>` : `<div class="empty">${ic('bookmark')}<p>${t('marksEmpty')}</p></div>`}`;
  view.onclick = marksClicks;
}

function marksClicks(e) {
  if (e.target.closest('[data-act="back-page"]')) {
    if (routeCount > 1) history.back();
    else location.replace('#/');
    return;
  }
  const el = e.target.closest('[data-act="unmark"]');
  if (!el) return;
  store.toggleBookmark(Number(el.dataset.c), Number(el.dataset.i));
  toast(t('unbookmarked'));
  renderMarks(token);
}

// =====================================================================
// Settings
// =====================================================================
let deferredPrompt = null;
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function installUI() {
  if (isStandalone()) return `<p class="ok-msg">${t('installed')}</p>`;
  if (deferredPrompt) return `<button class="btn primary" type="button" data-act="install">${ic('download')} ${t('installBtn')}</button>`;
  if (isIOS()) return `<p>${t('installIos')}</p>`;
  return `<p class="muted">${t('installOther')}</p>`;
}

function installBanner() {
  if (native.isNative) return '';
  if (!deferredPrompt || isStandalone() || store.get().installDismissed) return '';
  return `<div class="card install-card">${ic('download')}<span>${t('install')}</span>
    <button class="btn primary sm" type="button" data-act="install">${t('installBtn')}</button>
    <button class="ib" type="button" data-act="install-dismiss" aria-label="${t('undo')}">${ic('x')}</button></div>`;
}

function refreshInstall() {
  const a = $('#install-slot');
  if (a) a.innerHTML = installUI();
  const b = $('#install-banner-slot');
  if (b) b.innerHTML = installBanner();
}

addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; refreshInstall(); });
addEventListener('appinstalled', () => { deferredPrompt = null; refreshInstall(); });

async function offlineStatus() {
  if (!('serviceWorker' in navigator) || !('caches' in window)) return t('offlineNo');
  try {
    const urls = ['data/index.json', ...Array.from({ length: 40 }, (_, k) => `data/adhyay/${pad2(k + 1)}.json`)];
    const hits = await Promise.all(urls.map((u) => caches.match(new URL(u, location.href).href)));
    return hits.every(Boolean) ? t('offlineReady') : t('offlineWait');
  } catch {
    return t('offlineNo');
  }
}

function seg(key, options, current) {
  return `<div class="seg" role="radiogroup">${options.map(([v, label]) =>
    `<button type="button" role="radio" aria-checked="${v === current}" data-act="set" data-k="${key}" data-v="${v}">${label}</button>`).join('')}</div>`;
}

function renderSettings() {
  const s = store.get();
  view.innerHTML = `${pageHead(t('settings'), { back: true })}<div class="wrap settings">
    <section class="card"><h2>${t('language')}</h2>${seg('lang', Object.entries(LANGS).map(([k, v]) => [k, v.name]), getLang())}</section>
    <section class="card"><h2>${t('theme')}</h2>${seg('theme', [['auto', t('themeAuto')], ['light', t('themeLight')], ['sepia', t('themeSepia')], ['dark', t('themeDark')]], s.theme)}</section>
    <section class="card">
      <h2>${t('textSize')}</h2>
      <div class="size-row"><span class="a-s" lang="mr">अ</span>
        <input type="range" min="15" max="36" step="1" value="${s.fontSize}" data-k="fontSize" aria-label="${t('textSize')}">
        <span class="a-l" lang="mr">अ</span></div>
      <h2 class="mt">${t('font')}</h2>${seg('font', [['pothi', t('fontPothi')], ['modern', t('fontModern')]], s.font)}
      <p class="preview" lang="mr">${t('preview')} <span class="on">॥१॥</span></p>
    </section>
    ${native.canRemind() ? `<section class="card">
      <label class="switch"><span>${t('reminder')}</span>
        <input type="checkbox" data-k="reminderOn"${s.reminder?.on ? ' checked' : ''}><span class="sw" aria-hidden="true"></span></label>
      <label class="rem-time"><span>${t('reminderTime')}</span>
        <input type="time" data-k="reminderTime" value="${esc(s.reminder?.time || '06:00')}"></label>
      <p class="muted small">${t('reminderHint')}${s.parayan ? '' : ` ${t('remindNone')}`}</p></section>` : ''}
    ${native.isNative || 'wakeLock' in navigator ? `<section class="card"><label class="switch"><span>${t('keepAwake')}</span>
      <input type="checkbox" data-k="keepAwake"${s.keepAwake ? ' checked' : ''}><span class="sw" aria-hidden="true"></span></label></section>` : ''}
    ${native.isNative ? '' : `<section class="card"><h2>${t('install')}</h2><div id="install-slot">${installUI()}</div></section>
    <section class="card"><h2>${t('offline')}</h2><p id="offline-slot" class="muted">…</p></section>`}
    <section class="card"><h2>${t('about')}</h2><p>${t('aboutText')}</p></section>
    <section class="card"><h2>${t('data')}</h2><p class="muted">${t('dataHint')}</p>
      <button class="btn danger-ghost" type="button" data-act="reset">${t('resetAll')}</button></section>
    <p class="ver muted small">v${APP_VERSION}</p>
  </div>`;

  offlineStatus().then((msg) => { const el = $('#offline-slot'); if (el) el.textContent = msg; });

  view.onclick = async (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    if (act === 'set') {
      store.set({ [el.dataset.k]: el.dataset.v });
      applyPrefs();
      const y = scrollY;
      renderSettings();
      scrollTo(0, y);
    } else if (act === 'reset') {
      if (confirm(t('resetConfirm'))) { store.reset(); toast('✓'); }
    } else if (act === 'back-page') {
      if (routeCount > 1) history.back();
      else location.replace('#/');
    } else {
      commonClicks(e);
    }
  };
  view.oninput = (e) => {
    if (e.target.dataset.k === 'fontSize') {
      store.set({ fontSize: Number(e.target.value) });
      document.documentElement.style.setProperty('--pothi-size', `${e.target.value}px`);
    }
  };
  view.onchange = async (e) => {
    const k = e.target.dataset.k;
    const rem = store.get().reminder || { on: false, time: '06:00' };
    if (k === 'keepAwake') store.set({ keepAwake: e.target.checked });
    else if (k === 'reminderTime' && e.target.value) store.set({ reminder: { ...rem, time: e.target.value } });
    else if (k === 'reminderOn') {
      if (e.target.checked && !(await native.askNotifyPermission())) {
        e.target.checked = false;
        toast(t('reminderOff'));
        return;
      }
      store.set({ reminder: { ...rem, on: e.target.checked } });
    }
  };
}

// ---- daily parayan reminders (apps only) ----
// One notification per remaining day of the current parayan, at the chosen time.
async function syncReminders() {
  if (!native.canRemind()) return;
  const s = store.get();
  const items = [];
  if (s.reminder?.on && s.parayan) {
    const p = s.parayan;
    const plan = parayanStatus(p).plan;
    const [hh, mm] = (s.reminder.time || '06:00').split(':').map(Number);
    const now = Date.now();
    plan.forEach((list, d) => {
      const [y, m, day] = addDays(p.start, d).split('-').map(Number);
      const at = new Date(y, m - 1, day, hh, mm);
      if (at.getTime() <= now) return;
      const range = list.length > 1 ? `${num(list[0])}–${num(list.at(-1))}` : num(list[0]);
      items.push({ id: 100 + d, title: t('appName'), body: t('remindBody', { d: d + 1, n: p.days, list: range }), at });
    });
  }
  await native.setReminders(items);
}

let reminderTimer = null;
const scheduleReminderSync = () => { clearTimeout(reminderTimer); reminderTimer = setTimeout(syncReminders, 600); };

// status-bar icons: light over the dark home banner and dark themes, dark over light pages
function updateBars() {
  if (!native.isNative) return;
  const s = store.get();
  const darkTheme = s.theme === 'dark' || (s.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  native.setBarIcons(darkTheme || currentView === 'home' || !!$('.lang-pick'));
}

function setupNative() {
  if (!native.isNative) return;
  document.documentElement.classList.add('native', `native-${native.platform}`);
  native.onBackButton(() => {
    if ($('.player')) { closeVideo(); return; }
    if ($('.lang-pick')) return;
    if (currentView === 'home') { native.exitApp(); return; }
    if (routeCount > 1) history.back();
    else location.replace('#/');
  });
  native.onReminderTap((r) => { location.hash = r || '#/parayan'; });
  store.subscribe(scheduleReminderSync);
  scheduleReminderSync();
}

// clicks shared by several views (install banner, retry)
async function commonClicks(e) {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  if (el.dataset.act === 'install' && deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice.catch(() => null);
    deferredPrompt = null;
    refreshInstall();
  } else if (el.dataset.act === 'install-dismiss') {
    store.set({ installDismissed: true });
    refreshInstall();
  } else if (el.dataset.act === 'retry') {
    route();
  }
}
const retryHandler = commonClicks;

// =====================================================================
// First launch: pick a language
// =====================================================================
function langPicker() {
  const el = document.createElement('div');
  el.className = 'lang-pick';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'lp-h');
  el.innerHTML = `<div class="lp-card">
    <div class="orn">॥ अलख निरंजन ॥</div>
    <h1 id="lp-h" lang="mr">श्री नवनाथ भक्तिसार</h1>
    <p class="lp-q">भाषा निवडा · भाषा चुनें · Choose language</p>
    ${Object.entries(LANGS).map(([k, v]) => `<button class="btn big lp-btn" type="button" data-lang="${k}" lang="${k}">${v.name}</button>`).join('')}
    <p class="lp-hint">पोथी मराठीतच राहील · The pothi text stays in Marathi</p>
  </div>`;
  document.body.append(el);
  el.querySelector('.lp-btn').focus();
  updateBars();
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    store.set({ lang: b.dataset.lang });
    applyPrefs();
    el.remove();
    route();
  });
}

// =====================================================================
// Service worker (offline + updates)
// =====================================================================
function registerSW() {
  // the apps carry every file inside them, so they don't need the offline service worker
  if (native.isNative || !('serviceWorker' in navigator)) return;
  const hadController = !!navigator.serviceWorker.controller;
  addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('sw.js');
      const offer = (worker) => toast(t('update'), { label: t('reload'), sticky: true, run: () => worker.postMessage('SKIP_WAITING') });
      if (reg.waiting && hadController) offer(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w?.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w);
        });
      });
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController || reloading) return;
        reloading = true;
        location.reload();
      });
    } catch { /* offline support unavailable */ }
  });
}

// ---------- boot ----------
applyPrefs();
setupNative();
addEventListener('hashchange', route);
if (!store.get().lang) langPicker();
route();
registerSW();
