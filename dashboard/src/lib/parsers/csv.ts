import { parse } from "csv-parse/sync";

export function parseCsv<T = Record<string, string>>(
  content: string | null
): T[] {
  if (!content) return [];
  try {
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as T[];
  } catch {
    return [];
  }
}
