import { clientText } from './client-copy';
import { consentChanged, consentCookie, consentMaxAge, parseConsent, serializeConsent, type CookieChoice } from '../lib/cookie-consent';

let tabChoice: CookieChoice | null = null;
const bookmarkKey = 'bkr_saved';
const themeKey = 'bkr_theme';

function readCookie(name: string) {
  const prefix = name + '=';
  return document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(prefix))?.slice(prefix.length);
}

function writeCookie(name: string, value: string, maxAge: number) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function currentConsent(): CookieChoice | null {
  return parseConsent(readCookie(consentCookie)) ?? tabChoice;
}

export function clearLanguage() {
  writeCookie('bkr_locale', '', 0);
}

export function rememberLanguage(locale: string) {
  if (currentConsent()?.preferences && /^[a-z]{2,3}$/.test(locale)) writeCookie('bkr_locale', locale, consentMaxAge);
}

function clearOptionalPreferences() {
  if (readCookie('bkr_locale')) clearLanguage();
  try {
    localStorage.removeItem(themeKey);
    localStorage.removeItem(bookmarkKey);
  } catch { /* Browsers can block storage entirely. */ }
}

function saveChoice(choice: CookieChoice) {
  const serialized = serializeConsent(choice);
  writeCookie(consentCookie, serialized, consentMaxAge);
  // Keep the current page usable when the browser blocks all cookies.
  tabChoice = readCookie(consentCookie) === serialized ? null : choice;
  if (!choice.preferences) clearOptionalPreferences();
}

export function openCookieSettings(reason?: 'bookmarks' | 'external-media') {
  const dialog = document.querySelector<HTMLDialogElement>('#cookie-preferences');
  const form = dialog?.querySelector<HTMLFormElement>('form');
  if (!dialog || !form || dialog.open) return;

  const choice = currentConsent();
  const setChecked = (name: string, checked: boolean) => {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement) field.checked = checked;
  };
  setChecked('preferences', choice?.preferences ?? false);
  setChecked('external-media', choice?.externalMedia ?? false);

  for (const message of dialog.querySelectorAll<HTMLElement>('[data-cookie-reason]')) {
    message.hidden = message.dataset.cookieReason !== reason;
  }
  dialog.showModal();
}

export function initConsentUI() {
  const banner = document.querySelector<HTMLElement>('#cookie-notice');
  const dialog = document.querySelector<HTMLDialogElement>('#cookie-preferences');
  const form = dialog?.querySelector('form');
  const status = document.querySelector<HTMLElement>('[data-cookie-status]');
  if (!banner || !dialog || !form) return;

  let last = '';
  const sync = () => {
    const choice = currentConsent();
    const key = choice ? serializeConsent(choice) : '';
    banner.hidden = choice !== null;
    if (key !== last) {
      last = key;
      document.dispatchEvent(new Event(consentChanged));
    }
  };

  const apply = (choice: CookieChoice) => {
    const focusWasInBanner = banner.contains(document.activeElement);
    saveChoice(choice);
    dialog.close();
    sync();
    if (focusWasInBanner || banner.contains(document.activeElement)) document.getElementById('content')?.focus({ preventScroll: true });
    if (status) status.textContent = clientText('Cookie settings saved.');
  };

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('[data-cookie-settings]')) {
      event.preventDefault();
      openCookieSettings();
    } else if (event.target.closest('[data-cookie-accept]')) {
      apply({ preferences: true, externalMedia: true });
    } else if (event.target.closest('[data-cookie-reject]')) {
      apply({ preferences: false, externalMedia: false });
    } else if (event.target.closest('[data-cookie-close]')) {
      dialog.close();
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    apply({ preferences: fields.has('preferences'), externalMedia: fields.has('external-media') });
  });

  addEventListener('focus', sync);
  addEventListener('pageshow', sync);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
  if (currentConsent()?.preferences === false) clearOptionalPreferences();
  sync();
}
