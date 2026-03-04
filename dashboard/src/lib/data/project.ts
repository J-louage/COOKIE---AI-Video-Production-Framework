import { PROJECT_CONFIG } from "../constants";
import { readFileIfExists } from "../file-reader";
import { parseYaml } from "../parsers/yaml";
import { ProjectConfig } from "../types/project";

export function loadProjectConfig(): ProjectConfig | null {
  const raw = readFileIfExists(PROJECT_CONFIG);
  return parseYaml<ProjectConfig>(raw);
}
