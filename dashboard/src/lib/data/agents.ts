import { AGENT_MANIFEST, TASK_MANIFEST, SKILL_MANIFEST, MEMORY_DIR, MEMORY_CONFIG } from "../constants";
import { readFileIfExists, listFiles } from "../file-reader";
import { parseCsv } from "../parsers/csv";
import { parseYaml } from "../parsers/yaml";
import { Agent, Task, Skill, MemorySidecar } from "../types/agent";
import path from "path";

export function loadAgents(): Agent[] {
  const raw = readFileIfExists(AGENT_MANIFEST);
  return parseCsv<Agent>(raw);
}

export function loadTasks(): Task[] {
  const raw = readFileIfExists(TASK_MANIFEST);
  return parseCsv<Task>(raw);
}

export function loadSkills(): Skill[] {
  const raw = readFileIfExists(SKILL_MANIFEST);
  return parseCsv<Skill>(raw);
}

export function loadMemorySidecars(): MemorySidecar[] {
  const raw = readFileIfExists(MEMORY_CONFIG);
  const config = parseYaml<{ sidecars: { agent: string; path: string }[] }>(raw);
  if (!config?.sidecars) return [];

  return config.sidecars.map((s) => {
    const sidecarDir = path.join(MEMORY_DIR, s.path);
    const files = listFiles(sidecarDir);
    return {
      agent: s.agent,
      path: s.path,
      files,
    };
  });
}
