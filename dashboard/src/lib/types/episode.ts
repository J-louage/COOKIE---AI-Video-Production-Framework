export interface EpisodeConfig {
  episode_id: string;
  title: string;
  slug?: string;
  format?: string;
  target_duration?: number;
  status: EpisodeStatus;

  // Actual data uses "characters", template uses "episode_characters"
  characters?: EpisodeCharacterRef[];
  episode_characters?: EpisodeCharacterRef[];

  // Actual data uses "concept", template uses "script"
  concept?: {
    premise?: string;
    tone?: string;
    scenes?: string[];
    text_overlays?: boolean;
    narration?: boolean;
    music?: string;
  };
  script?: {
    source?: string;
    input?: string;
  };

  // Brand info (episode-level)
  brand?: {
    name?: string;
    website?: string;
    logo?: string;
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
    tagline?: string;
    style?: string;
  };

  overrides?: Record<string, unknown>;

  episode_music?: string | null;
  format_adaptations?: Record<string, FormatAdaptation>;
  production_state?: ProductionState;

  metadata?: {
    created?: string;
    last_modified?: string;
    phase?: string;
    [key: string]: unknown;
  };

  // Compat: template uses created_at at top level
  created_at?: string;
}

export type EpisodeStatus =
  | "not-started"
  | "planning"
  | "pre-production"
  | "in-production"
  | "post-production"
  | "complete";

export interface EpisodeCharacterRef {
  character_id: string;
  role?: string;
  path?: string;
}

export interface FormatAdaptation {
  max_duration: number | null;
  essential_scenes_only?: boolean;
  add_captions?: boolean;
  add_hook?: boolean;
  crop_strategy?: string;
}

export interface ProductionState {
  script_finalized?: boolean;
  characters_created?: boolean;
  style_guide_created?: boolean;
  ssd_created?: boolean;
  ssd_validated?: boolean;
  cost_approved?: boolean;
  assets_generated?: boolean;
  asset_qa_passed?: boolean;
  composition_assembled?: boolean;
  preview_approved?: boolean;
  final_rendered?: boolean;
  exports_complete?: boolean;
  final_qa_passed?: boolean;
  [key: string]: boolean | undefined;
}

export const PRODUCTION_STATE_LABELS: Record<string, string> = {
  script_finalized: "Script Finalized",
  characters_created: "Characters Created",
  style_guide_created: "Style Guide Created",
  ssd_created: "SSD Created",
  ssd_validated: "SSD Validated",
  cost_approved: "Cost Approved",
  assets_generated: "Assets Generated",
  asset_qa_passed: "Asset QA Passed",
  composition_assembled: "Composition Assembled",
  preview_approved: "Preview Approved",
  final_rendered: "Final Rendered",
  exports_complete: "Exports Complete",
  final_qa_passed: "Final QA Passed",
};
