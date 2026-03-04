import path from "path";
import { MEMORY_DIR } from "../constants";
import { readFileIfExists } from "../file-reader";

export function loadMemoryFile(
  sidecarPath: string,
  fileName: string
): string | null {
  return readFileIfExists(
    path.join(MEMORY_DIR, sidecarPath, fileName)
  );
}
