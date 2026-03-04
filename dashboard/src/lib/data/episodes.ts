import path from "path";
import {
  EPISODES_DIR,
  EPISODE_CONFIG_FILE,
  EPISODE_SCRIPT_FILE,
  EPISODE_SSD_FILE,
  EPISODE_STYLE_GUIDE_FILE,
  EPISODE_COST_ESTIMATE_FILE,
  EPISODE_ASSETS_DIR,
} from "../constants";
import { listDirectories, readFileIfExists, scanAssetTree } from "../file-reader";
import { parseYaml } from "../parsers/yaml";
import { parseMarkdown, ParsedMarkdown } from "../parsers/markdown";
import { EpisodeConfig } from "../types/episode";
import { SceneSpec } from "../types/ssd";
import { CostEstimate } from "../types/cost";
import { AssetNode } from "../file-reader";

export function listEpisodeIds(): string[] {
  return listDirectories(EPISODES_DIR).sort();
}

export function loadEpisodeConfig(episodeId: string): EpisodeConfig | null {
  const raw = readFileIfExists(
    path.join(EPISODES_DIR, episodeId, EPISODE_CONFIG_FILE)
  );
  return parseYaml<EpisodeConfig>(raw);
}

export function loadEpisodeScript(episodeId: string): ParsedMarkdown | null {
  const raw = readFileIfExists(
    path.join(EPISODES_DIR, episodeId, EPISODE_SCRIPT_FILE)
  );
  return parseMarkdown(raw);
}

export function loadEpisodeSSD(episodeId: string): SceneSpec | null {
  const raw = readFileIfExists(
    path.join(EPISODES_DIR, episodeId, EPISODE_SSD_FILE)
  );
  return parseYaml<SceneSpec>(raw);
}

export interface StyleGuide {
  style_name: string;
  description: string;
  color_palette: Record<string, string>;
  typography: Record<string, unknown>;
  cinematic_style: string;
  lighting_preference: string;
  camera_style: string;
  style_tokens: string;
  negative_prompts: string[];
  brand_logo_usage: string;
  brand_colors_enforcement: string;
}

export function loadEpisodeStyleGuide(episodeId: string): StyleGuide | null {
  const raw = readFileIfExists(
    path.join(EPISODES_DIR, episodeId, EPISODE_STYLE_GUIDE_FILE)
  );
  return parseYaml<StyleGuide>(raw);
}

export function loadEpisodeCostEstimate(episodeId: string): CostEstimate | null {
  const raw = readFileIfExists(
    path.join(EPISODES_DIR, episodeId, EPISODE_COST_ESTIMATE_FILE)
  );
  return parseYaml<CostEstimate>(raw);
}

export function loadEpisodeAssets(episodeId: string): AssetNode[] {
  return scanAssetTree(
    path.join(EPISODES_DIR, episodeId, EPISODE_ASSETS_DIR)
  );
}

export interface EpisodeSummary {
  id: string;
  config: EpisodeConfig | null;
}

export function listEpisodesWithConfig(): EpisodeSummary[] {
  return listEpisodeIds().map((id) => ({
    id,
    config: loadEpisodeConfig(id),
  }));
}
