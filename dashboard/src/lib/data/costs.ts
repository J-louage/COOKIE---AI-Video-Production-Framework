import path from "path";
import { PRICING_CONFIG, COST_DIR, EPISODES_DIR, EPISODE_COST_ESTIMATE_FILE } from "../constants";
import { readFileIfExists, listDirectories, listFiles } from "../file-reader";
import { parseYaml } from "../parsers/yaml";
import { Pricing, CostEstimate } from "../types/cost";
import { loadEpisodeCostEstimate, listEpisodeIds } from "./episodes";

export function loadPricing(): Pricing | null {
  const raw = readFileIfExists(PRICING_CONFIG);
  return parseYaml<Pricing>(raw);
}

export function loadAllCostEstimates(): { episodeId: string; estimate: CostEstimate }[] {
  return listEpisodeIds()
    .map((id) => ({
      episodeId: id,
      estimate: loadEpisodeCostEstimate(id),
    }))
    .filter(
      (e): e is { episodeId: string; estimate: CostEstimate } =>
        e.estimate !== null
    );
}

export function loadCostActuals(
  episodeId: string
): Record<string, unknown>[] {
  const actualsDir = path.join(COST_DIR, "actuals", episodeId);
  const files = listFiles(actualsDir);
  return files
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => {
      const raw = readFileIfExists(path.join(actualsDir, f));
      return parseYaml<Record<string, unknown>>(raw);
    })
    .filter((d): d is Record<string, unknown> => d !== null);
}
