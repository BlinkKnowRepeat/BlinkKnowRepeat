const element = document.getElementById('site-client-copy');
const dictionary = element?.textContent ? JSON.parse(element.textContent) as Record<string, string> : {};

export function clientText(text: string) {
  return Object.hasOwn(dictionary, text) ? dictionary[text] : text;
}
