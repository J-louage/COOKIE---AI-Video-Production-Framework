import path from "path";
import { PRICING_CONFIG, COST_DIR, EPISODES_DIR, EPISODE_COST_ESTIMATE_FILE } from "../constants";
import { readFileIfExists, listFiles } from "../file-reader";
import { parseYaml } from "../parsers/yaml";
import { Pricing, CostEstimate } from "../types/cost";
import { loadEpisodeCostEstimate, loadEpisodeSSD, listEpisodeIds } from "./episodes";
import { SceneSpec } from "../types/ssd";

export function loadPricing(): Pricing | null {
  const raw = readFileIfExists(PRICING_CONFIG);
  return parseYaml<Pricing>(raw);
}

// Build a CostEstimate from the SSD cost_summary when no standalone cost file exists
function costEstimateFromSSD(episodeId: string, ssd: SceneSpec): CostEstimate {
  const meta = ssd.metadata;
  const cs = ssd.cost_summary;

  // Build per-scene costs from cost_summary.scenes
  const scenes = cs?.scenes
    ? Object.entries(cs.scenes).map(([sceneId, data]) => ({
        scene_id: sceneId,
        veo_cost: data.veo || 0,
        retake_buffer: data.retake_buffer || 0,
        scene_total: data.subtotal || 0,
      }))
    : [];

  const totalGenCost = cs?.total_generation_cost || 0;
  const charRefCost = cs?.character_references?.subtotal || 0;

  return {
    episode_id: meta?.episode_id || episodeId,
    episode_title: meta?.title,
    summary: {
      total_scenes: scenes.length,
      veo_total: scenes.reduce((s, sc) => s + (sc.veo_cost || 0), 0),
      nano_banana_total: charRefCost,
      elevenlabs_total: 0,
      subtotal: totalGenCost,
      estimated_total: totalGenCost,
    },
    scenes,
  };
}

export function loadAllCostEstimates(): { episodeId: string; estimate: CostEstimate }[] {
  return listEpisodeIds()
    .map((id) => {
      // Try standalone cost-estimate.yaml first
      const estimate = loadEpisodeCostEstimate(id);
      if (estimate) return { episodeId: id, estimate };

      // Fall back to extracting from SSD cost_summary
      const ssd = loadEpisodeSSD(id);
      if (ssd?.cost_summary) {
        return { episodeId: id, estimate: costEstimateFromSSD(id, ssd) };
      }

      return null;
    })
    .filter(
      (e): e is { episodeId: string; estimate: CostEstimate } => e !== null
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
