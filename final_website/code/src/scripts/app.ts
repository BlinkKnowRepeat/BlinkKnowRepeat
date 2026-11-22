import { clientText } from './client-copy';
import { consentChanged } from '../lib/cookie-consent';
import { clearLanguage, currentConsent, openCookieSettings, rememberLanguage } from './consent';
import { mountSlideshow } from './slideshow';

// Client behaviour for Blink, Know, Repeat. Everything degrades to plain HTML if this fails to run.
const $ = <T extends Element = HTMLElement>(s: string, r: Document | Element = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: Document | Element = document) => [...r.querySelectorAll<T>(s)];

/* ---------- theme ---------- */
const root = document.documentElement;
const header = $('.site-header');
if (header) {
  const keepHeaderHeight = () => root.style.setProperty('--header-height', `${header.offsetHeight}px`);
  keepHeaderHeight();
  new ResizeObserver(keepHeaderHeight).observe(header);
}
function mountClock(clock: HTMLTimeElement, signal?: AbortSignal) {
  const format = new Intl.DateTimeFormat(root.lang, {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short',
  });
  const tick = () => {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = format.format(now);
  };
  tick();
  const timer = window.setInterval(tick, 1_000);
  document.addEventListener('visibilitychange', tick, { signal });
  signal?.addEventListener('abort', () => clearInterval(timer), { once: true });
}
for (const clock of $$<HTMLTimeElement>('[data-site-clock]')) mountClock(clock);
for (const carousel of $$('[data-headlines]')) mountSlideshow(carousel);
function applySavedTheme() {
  if (!currentConsent()?.preferences) {
    delete root.dataset.theme;
    return;
  }
  try {
    const theme = localStorage.getItem('bkr_theme');
    if (theme === 'dark' || theme === 'light') root.dataset.theme = theme;
  } catch { /* Browsers can block storage entirely. */ }
}
applySavedTheme();
document.addEventListener(consentChanged, applySavedTheme);
const currentTheme = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
for (const btn of $$('[data-theme-toggle]')) {
  const paint = () => { btn.setAttribute('aria-pressed', String(currentTheme() === 'dark')); };
  paint();
  document.addEventListener(consentChanged, paint);
  btn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    if (currentConsent()?.preferences) {
      try { localStorage.setItem('bkr_theme', next); } catch { /* Browsers can block storage entirely. */ }
    }
    paint();
  });
}

/* ---------- header menus & language cookie ---------- */
for (const link of $$<HTMLAnchorElement>('[data-locale]')) link.addEventListener('click', () => {
  if (link.dataset.locale) rememberLanguage(link.dataset.locale);
});
const menus = $$<HTMLDetailsElement>('.site-header details, .share-options');
for (const menu of menus) {
  menu.addEventListener('toggle', () => { if (menu.open) for (const o of menus) if (o !== menu) o.open = false; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.open) { menu.open = false; $('summary', menu)?.focus(); } });
  document.addEventListener('click', e => { if (menu.open && e.target instanceof Node && !menu.contains(e.target)) menu.open = false; });
}
for (const shortcut of $$<HTMLAnchorElement>('.site-header .slideshow-shortcut')) {
  shortcut.addEventListener('click', async event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if ($('.presentation-overlay')) return;
    const menu = shortcut.closest('details');
    if (menu) menu.open = false;

    const overlay = document.createElement('div');
    overlay.className = 'presentation-overlay';
    const dialog = document.createElement('dialog');
    dialog.className = 'presentation-dialog';
    dialog.setAttribute('aria-labelledby', 'fullscreen-slideshow-title');
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    const controller = new AbortController();
    const { signal } = controller;
    const close = () => {
      if (signal.aborted) return;
      controller.abort();
      if (document.fullscreenElement === overlay) void document.exitFullscreen().catch(() => {});
      overlay.remove();
      (menu?.querySelector('summary') ?? shortcut).focus();
    };
    const native = document.fullscreenEnabled && overlay.requestFullscreen
      ? overlay.requestFullscreen().then(() => true, () => false) : Promise.resolve(false);
    try {
      const response = await fetch(shortcut.href, { signal });
      if (!response.ok) throw new Error('Slideshow unavailable');
      const markup = new DOMParser().parseFromString(await response.text(), 'text/html');
      const carousel = markup.querySelector<HTMLElement>('[data-presentation]');
      const title = carousel?.querySelector('h1');
      if (!carousel || !title) throw new Error('Slideshow unavailable');
      carousel.id = 'fullscreen-slideshow';
      title.id = 'fullscreen-slideshow-title';
      carousel.setAttribute('aria-labelledby', title.id);
      dialog.appendChild(carousel);
      if (await native && document.fullscreenElement === overlay) {
        document.addEventListener('fullscreenchange', () => { if (document.fullscreenElement !== overlay) close(); }, { signal });
      }
      dialog.addEventListener('close', close, { signal });
      dialog.showModal();
      mountSlideshow(carousel, signal);
      const clock = $<HTMLTimeElement>('[data-site-clock]', carousel);
      if (clock) mountClock(clock, signal);
    } catch {
      await native;
      close();
      location.assign(shortcut.href);
    }
  });
}

/* ---------- bookmarks (this browser only) ---------- */
const KEY = 'bkr_saved';
type SavedArticle = { id: string; title: string; lang: string };
type SavedItem = string | SavedArticle;
const savedId = (item: SavedItem) => typeof item === 'string' ? item : item.id;
const isSavedArticle = (value: unknown): value is SavedArticle => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SavedArticle>;
  return typeof item.id === 'string' && /^article:[a-z0-9-]{1,80}$/.test(item.id) && typeof item.title === 'string' && typeof item.lang === 'string';
};
const readSaved = (): SavedItem[] => {
  if (!currentConsent()?.preferences) return [];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(value) ? value.filter(item => typeof item === 'string' || isSavedArticle(item)) : [];
  } catch { return []; }
};
const writeSaved = (list: SavedItem[]) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ } };
const paintSaved = () => {
  const items = readSaved();
  const saved = items.map(savedId);
  for (const c of $$('[data-count]')) { c.textContent = String(saved.length); c.hidden = saved.length === 0; }
  for (const card of $$('[data-post]')) {
    const on = saved.includes(card.dataset.slug || '');
    const button = $<HTMLButtonElement>('[data-bookmark-card]', card);
    if (button) {
      button.setAttribute('aria-pressed', String(on));
      const label = on ? button.dataset.removeLabel : button.dataset.saveLabel;
      if (label) button.setAttribute('aria-label', label);
    }
  }
  const bar = $('[data-sharebar]');
  if (bar) {
    const on = saved.includes(bar.dataset.slug || '');
    const b = $('[data-bookmark]', bar); b?.setAttribute('aria-pressed', String(on));
    const label = $('[data-bookmark-label]', bar);
    if (label && b) label.textContent = (on ? b.dataset.unsaveText : b.dataset.saveText) || label.textContent;
  }
  const list = $('[data-saved-list]');
  if (list) {
    list.hidden = false;
    let n = 0;
    for (const card of $$('[data-post]', list)) { const show = saved.includes(card.dataset.slug || ''); card.hidden = !show; if (show) n++; }
    const articles = $('[data-saved-articles]', list);
    if (articles) {
      const links = items.filter(isSavedArticle).map(item => {
        const link = document.createElement('a');
        link.className = 'card';
        link.href = `/${articles.dataset.savedArticles}/article/${item.id.slice('article:'.length)}/`;
        link.textContent = item.title;
        link.lang = item.lang;
        return link;
      });
      articles.replaceChildren(...links);
      articles.hidden = links.length === 0;
      n += links.length;
    }
    const empty = $('[data-saved-empty]'); if (empty) empty.hidden = n > 0;
  }
};
const toggleSaved = (item: SavedItem) => {
  const id = savedId(item);
  if (!id) return;
  if (!currentConsent()?.preferences) {
    openCookieSettings('bookmarks');
    return;
  }
  const saved = readSaved();
  writeSaved(saved.some(item => savedId(item) === id) ? saved.filter(item => savedId(item) !== id) : [...saved, item]);
  paintSaved();
};
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  const card = t?.closest('[data-bookmark-card]');
  if (card) { toggleSaved(card.closest<HTMLElement>('[data-post]')?.dataset.slug || ''); return; }
  const bar = t?.closest('[data-bookmark]')?.closest<HTMLElement>('[data-sharebar]');
  if (bar?.dataset.slug) {
    const item = { id: bar.dataset.slug, title: bar.dataset.title, lang: root.lang };
    toggleSaved(isSavedArticle(item) ? item : bar.dataset.slug);
  }
});
paintSaved();
addEventListener('storage', paintSaved);
document.addEventListener(consentChanged, paintSaved);

/* ---------- share / copy / print / listen ---------- */
for (const b of $$('[data-print]')) b.addEventListener('click', () => print());
const bar = $('[data-sharebar]');
if (bar) {
  const status = $('[data-share-status]', bar);
  const say = (m: string) => { if (status) { status.textContent = m; setTimeout(() => { if (status.textContent === m) status.textContent = ''; }, 3500); } };
  const url = bar.dataset.url || location.href;
  const copy = async () => { try { await navigator.clipboard.writeText(url); say(status?.dataset.copied || 'Copied'); return true; } catch { say(url); return false; } };
  $('[data-share="copy"]', bar)?.addEventListener('click', copy);
  $('[data-share="instagram"]', bar)?.addEventListener('click', async () => { await copy(); window.open('https://www.instagram.com/', '_blank', 'noopener'); });
  const listen = $<HTMLButtonElement>('[data-listen]', bar);
  if (listen && 'speechSynthesis' in window) {
    listen.hidden = false;
    let playing = false;
    const lang = document.documentElement.lang || 'en';
    const stop = () => { speechSynthesis.cancel(); playing = false; listen.querySelector('span')!.textContent = listen.dataset.listenLabel || 'Listen'; };
    listen.addEventListener('click', () => {
      if (playing) { stop(); return; }
      const article = $('[data-readable]');
      if (!article) return;
      const voices = speechSynthesis.getVoices().filter(voice => voice.localService);
      const want = lang.split('-')[0];
      const voice = voices.find(v => v.lang.toLowerCase().startsWith(want));
      if (!voice) { say(clientText('No voice for this language is installed on your device. Try English or install a voice.')); return; }
      const parts = $$('h1, .lede, h2, p, li', article).filter(el => !el.closest('[hidden], .no-print, svg, nav')).map(el => el.textContent?.trim() || '').filter(Boolean);
      playing = true; listen.querySelector('span')!.textContent = listen.dataset.stop || 'Stop';
      parts.forEach((text, i) => {
        const u = new SpeechSynthesisUtterance(text); u.lang = voice.lang; u.voice = voice;
        if (i === parts.length - 1) u.onend = stop;
        speechSynthesis.speak(u);
      });
    });
    addEventListener('pagehide', () => speechSynthesis.cancel());
  }
}

/* ---------- mind map & interactive explainers ---------- */
for (const map of $$('[data-mindmap]')) {
  const nodes = $$('[data-i]', map), panels = $$('[data-panel]', map);
  const pick = (i: number) => { nodes.forEach(n => n.setAttribute('aria-pressed', String(Number(n.dataset.i) === i))); panels.forEach(p => { p.hidden = Number(p.dataset.panel) !== i; }); };
  for (const n of nodes) {
    n.addEventListener('click', () => pick(Number(n.dataset.i)));
    n.addEventListener('keydown', e => { const ev = e as KeyboardEvent; if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(Number(n.dataset.i)); } });
  }
}
for (const it of $$('[data-interactive]')) {
  const items = $$('[data-i]', it), texts = $$('[data-text]', it);
  items.forEach(b => b.addEventListener('click', () => { const i = Number(b.dataset.i); items.forEach(x => x.setAttribute('aria-pressed', String(x === b))); texts.forEach(t => { t.hidden = Number(t.dataset.text) !== i; }); }));
}

/* ---------- newsletter ---------- */
for (const form of $$<HTMLFormElement>('[data-newsletter]')) {
  const status = $('[data-nl-status]', form)!;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    status.className = 'nl-status';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { status.textContent = clientText('Please enter a valid email address.'); status.classList.add('err'); return; }
    form.classList.add('sending');
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: document.documentElement.lang.split('-')[0], email, website: (form.elements.namedItem('website') as HTMLInputElement).value }) });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      status.textContent = clientText(data.message || (res.ok ? 'Saved.' : 'Something went wrong. Please try again.'));
      status.classList.add(res.ok ? 'ok' : 'err');
      if (res.ok) { form.classList.add('done'); }
    } catch { status.textContent = clientText('Network error. Please try again.'); status.classList.add('err'); }
    form.classList.remove('sending');
  });
}

/* ---------- misc ---------- */
$('[data-clear-language]')?.addEventListener('click', e => { clearLanguage(); (e.target as HTMLElement).textContent = clientText('Saved language cleared'); });
const auth = $<HTMLButtonElement>('[data-auth]');
auth?.addEventListener('click', async () => {
  auth.disabled = true;
  const op = auth.dataset.auth;
  const st = $('[data-auth-status]');
  try {
    const res = await fetch(`/api/auth/${op}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(op === 'sign-out' ? {} : { provider: 'google', callbackURL: auth.dataset.callback }) });
    if (!res.ok) throw new Error();
    if (op === 'sign-out') location.reload();
    else { const r = await res.json() as { url: string }; const d = new URL(r.url); if (d.origin !== 'https://accounts.google.com') throw new Error(); location.assign(d); }
  } catch { if (st) st.textContent = clientText('Google sign-in is temporarily unavailable.'); auth.disabled = false; }
});

// Show or hide the left sections menu (wide screens); the choice is remembered.
for (const toggle of $$<HTMLButtonElement>('[data-side-toggle]')) {
  const root = document.documentElement;
  const sync = () => {
    const closed = root.dataset.side === 'closed';
    toggle.setAttribute('aria-expanded', String(!closed));
    toggle.setAttribute('aria-label', closed ? 'Show sections menu' : 'Hide sections menu');
  };
  sync();
  toggle.addEventListener('click', () => {
    if (root.dataset.side === 'closed') delete root.dataset.side; else root.dataset.side = 'closed';
    try { localStorage.setItem('side-menu', root.dataset.side === 'closed' ? 'closed' : 'open'); } catch {}
    sync();
  });
}
