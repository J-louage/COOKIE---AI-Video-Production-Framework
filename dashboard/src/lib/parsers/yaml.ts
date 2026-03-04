import yaml from "js-yaml";

export function parseYaml<T = Record<string, unknown>>(
  content: string | null
): T | null {
  if (!content) return null;
  try {
    return yaml.load(content) as T;
  } catch {
    return null;
  }
}
