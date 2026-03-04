export function parseJson<T = Record<string, unknown>>(
  content: string | null
): T | null {
  if (!content) return null;
  try {
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}
