import fs from "fs";
import path from "path";

export function readFileIfExists(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

export function listDirectories(dirPath: string): string[] {
  try {
    return fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
      .map((d) => d.name);
  } catch {
    return [];
  }
}

export function listFiles(dirPath: string): string[] {
  try {
    return fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((d) => d.isFile() && !d.name.startsWith("."))
      .map((d) => d.name);
  } catch {
    return [];
  }
}

export interface AssetNode {
  name: string;
  path: string;
  relativePath: string;
  type: "file" | "directory";
  extension?: string;
  size?: number;
  children?: AssetNode[];
}

export function scanAssetTree(
  dirPath: string,
  basePath: string = dirPath
): AssetNode[] {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    return entries
      .filter((e) => !e.name.startsWith("."))
      .map((entry) => {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(basePath, fullPath);
        if (entry.isDirectory()) {
          return {
            name: entry.name,
            path: fullPath,
            relativePath,
            type: "directory" as const,
            children: scanAssetTree(fullPath, basePath),
          };
        }
        const stat = fs.statSync(fullPath);
        return {
          name: entry.name,
          path: fullPath,
          relativePath,
          type: "file" as const,
          extension: path.extname(entry.name).toLowerCase(),
          size: stat.size,
        };
      })
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  } catch {
    return [];
  }
}
