export async function generateUniqueCode(): Promise<string> {
  const { v4: uuidV4 } = await import('uuid');
  return uuidV4().replace(/-/g, '').substring(0, 24);
}
