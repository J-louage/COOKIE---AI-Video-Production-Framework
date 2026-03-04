import {
  GLOBAL_CONFIG,
  FORMAT_PRESETS,
  RESOLUTION_PROFILES,
} from "../constants";
import { readFileIfExists } from "../file-reader";
import { parseYaml } from "../parsers/yaml";

export interface GlobalConfig {
  framework_name: string;
  framework_version: string;
  user_name: string;
  communication_language: string;
  document_output_language: string;
  user_skill_level: string;
  project_root: string;
  default_veo_model: string;
  default_veo_speed: string;
  default_nano_banana_model: string;
  default_resolution_profile: string;
  cost_gate_behavior: string;
  retake_budget_percent: number;
  max_retakes_per_scene: number;
}

export interface FormatPresetsConfig {
  formats: Record<string, FormatPreset>;
}

export interface FormatPreset {
  aspect_ratio: string;
  max_duration: number;
  min_duration: number;
  target_duration_range: number[];
  resolution: string;
  crop_strategy: string;
  pacing: string;
  pacing_multiplier: number;
  text_density: string;
  subtitles_default?: boolean;
  requires_hook: boolean;
  requires_cta: boolean;
  [key: string]: unknown;
}

export interface ResolutionProfilesConfig {
  profiles: Record<string, ResolutionProfile>;
}

export interface ResolutionProfile {
  description: string;
  veo_resolution: string;
  nano_banana_resolution: string;
  remotion_width: number;
  remotion_height: number;
  ffmpeg_crf: number;
}

export function loadGlobalConfig(): GlobalConfig | null {
  const raw = readFileIfExists(GLOBAL_CONFIG);
  return parseYaml<GlobalConfig>(raw);
}

export function loadFormatPresets(): FormatPresetsConfig | null {
  const raw = readFileIfExists(FORMAT_PRESETS);
  return parseYaml<FormatPresetsConfig>(raw);
}

export function loadResolutionProfiles(): ResolutionProfilesConfig | null {
  const raw = readFileIfExists(RESOLUTION_PROFILES);
  return parseYaml<ResolutionProfilesConfig>(raw);
}
