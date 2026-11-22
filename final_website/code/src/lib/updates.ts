export async function updateVersion(db: D1Database | undefined, locale: string): Promise<number> {
  if (!db) return 0;
  try {
    return await db.prepare('SELECT version FROM public_state WHERE locale=?').bind(locale).first<number>('version') ?? 0;
  } catch (error) {
    if (String(error).includes('no such table')) return 0;
    throw error;
  }
}
