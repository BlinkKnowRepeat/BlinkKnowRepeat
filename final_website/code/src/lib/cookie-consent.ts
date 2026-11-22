export const consentCookie = 'bkr_consent';
export const consentMaxAge = 180 * 24 * 60 * 60;
export const consentChanged = 'bkr:consent-changed';

export type CookieChoice = {
  preferences: boolean;
  externalMedia: boolean;
};

export function parseConsent(value?: string): CookieChoice | null {
  if (!value || !/^v1\.[01][01]$/.test(value)) return null;
  return { preferences: value[3] === '1', externalMedia: value[4] === '1' };
}

export function serializeConsent(choice: CookieChoice) {
  return `v1.${Number(choice.preferences)}${Number(choice.externalMedia)}`;
}
