export function xml(value: string): string {
  return value.replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char] ?? char);
}
export const xmlHeaders = { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-cache' };
