import { WORKFLOW_MANIFEST } from "../constants";
import { readFileIfExists } from "../file-reader";
import { parseCsv } from "../parsers/csv";
import { Workflow } from "../types/agent";

export function loadWorkflows(): Workflow[] {
  const raw = readFileIfExists(WORKFLOW_MANIFEST);
  return parseCsv<Workflow>(raw);
}

export function groupWorkflowsByPhase(
  workflows: Workflow[]
): Record<string, Workflow[]> {
  const groups: Record<string, Workflow[]> = {};
  for (const w of workflows) {
    const phase = w.phase || "other";
    if (!groups[phase]) groups[phase] = [];
    groups[phase].push(w);
  }
  return groups;
}

export const PHASE_LABELS: Record<string, string> = {
  "1-ideation": "Phase 1: Ideation",
  "2-pre-production": "Phase 2: Pre-Production",
  "3-asset-generation": "Phase 3: Asset Generation",
  "4-composition": "Phase 4: Composition",
  "5-post-production": "Phase 5: Post-Production",
  "quick-flow": "Quick Flows",
  anytime: "Anytime",
  composition: "Composition",
  creative: "Creative",
  any: "Core",
};
