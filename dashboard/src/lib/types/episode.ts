export interface EpisodeConfig {
  episode_id: string;
  title: string;
  status: EpisodeStatus;
  created_at: string;
  overrides: {
    resolution_profile: string | null;
    veo_model: string | null;
    veo_speed: string | null;
    nano_banana_model: string | null;
    aspect_ratio: string | null;
    person_generation: string | null;
  };
  episode_characters: EpisodeCharacterRef[];
  episode_music: string | null;
  script: {
    source: string;
    input: string;
  };
  format_adaptations: Record<string, FormatAdaptation>;
  production_state: ProductionState;
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
  path: string;
}

export interface FormatAdaptation {
  max_duration: number | null;
  essential_scenes_only?: boolean;
  add_captions?: boolean;
  add_hook?: boolean;
  crop_strategy?: string;
}

export interface ProductionState {
  script_finalized: boolean;
  characters_created: boolean;
  style_guide_created: boolean;
  ssd_created: boolean;
  ssd_validated: boolean;
  cost_approved: boolean;
  assets_generated: boolean;
  asset_qa_passed: boolean;
  composition_assembled: boolean;
  preview_approved: boolean;
  final_rendered: boolean;
  exports_complete: boolean;
  final_qa_passed: boolean;
}

export const PRODUCTION_STATE_LABELS: Record<keyof ProductionState, string> = {
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
