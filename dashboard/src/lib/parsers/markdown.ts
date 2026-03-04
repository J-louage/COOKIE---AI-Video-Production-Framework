import matter from "gray-matter";

export interface ParsedMarkdown {
  content: string;
  frontmatter: Record<string, unknown>;
}

export function parseMarkdown(raw: string | null): ParsedMarkdown | null {
  if (!raw) return null;
  try {
    const { content, data } = matter(raw);
    return { content, frontmatter: data };
  } catch {
    return null;
  }
}
