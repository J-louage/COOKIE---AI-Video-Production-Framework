export interface SceneSpec {
  // Actual data wraps these in "metadata"
  metadata?: SSDMetadata;
  global_config?: GlobalConfig;
  scenes: Scene[];
  cost_summary?: CostSummary;
  dependency_graph?: Record<string, string[]>;
  execution_order?: string[];

  // Template-style top-level fields (fallback)
  episode_id?: string;
  episode_title?: string;
  total_duration_seconds?: number;
  scene_count?: number;
  resolution_profile?: string;
  primary_format?: string;
  primary_aspect_ratio?: string;
  global_style?: GlobalStyle;
}

export interface SSDMetadata {
  episode_id?: string;
  title?: string;
  format?: string;
  aspect_ratio?: string;
  total_duration?: number;
  total_scenes?: number;
  total_clips?: number;
  total_cost_estimate?: number;
  created_at?: string;
  version?: string;
  script_ref?: string;
  [key: string]: unknown;
}

export interface GlobalConfig {
  default_veo_model?: string;
  default_veo_speed?: string;
  default_resolution?: string;
  default_aspect_ratio?: string;
  default_fps?: number;
  person_generation?: string;
  nano_banana_model?: string;
  brand?: Record<string, unknown>;
  [key: string]: unknown;
}

// Template-style global style
export interface GlobalStyle {
  style_guide?: string;
  color_palette?: string;
  veo_model?: string;
  veo_speed?: string;
  nano_banana_model?: string;
  negative_prompt_global?: string;
}

export interface Scene {
  scene_id: string;
  scene_type?: string;
  title: string;
  description?: string;
  duration?: number;
  // Template field
  duration_seconds?: number;
  priority?: string;
  short_form_hook?: boolean;

  // Actual data: characters at scene level
  characters?: { character_id: string; outfit?: string }[];
  character_refs?: string[];

  // Actual data: clips array with embedded VEO config
  clips?: Clip[];

  // Template-style scene-level VEO config
  veo?: VeoConfig;

  merge_strategy?: string;
  playwright?: PlaywrightConfig;

  // Actual data uses "audio_config", template uses "audio"
  audio_config?: AudioConfigActual;
  audio?: AudioConfig;

  // Actual data uses "remotion_config", template uses "remotion"
  remotion_config?: RemotionConfigActual;
  remotion?: RemotionConfig;

  composition_note?: string;
  post_processing?: PostProcessing[];

  // Template-style cost at scene level
  estimated_cost?: SceneCost;
}

export interface Clip {
  clip_id: string;
  clip_type?: string;
  description?: string;
  input_mode?: string;
  veo_config?: ClipVeoConfig;
  output_path?: string;
  cost_estimate?: ClipCostEstimate;
  first_frame?: FrameConfig;
  last_frame?: FrameConfig;
  // Template-style
  veo?: VeoConfig;
}

export interface ClipVeoConfig {
  model?: string;
  duration_seconds?: number;
  aspect_ratio?: string;
  resolution?: string;
  speed?: string;
  person_generation?: string;
  camera_movement?: string;
  prompt?: string;
  negative_prompt?: string;
  reference_images?: ReferenceImage[];
  [key: string]: unknown;
}

export interface ClipCostEstimate {
  veo_generation?: number;
  retake_buffer?: number;
  first_frame_generation?: number;
  total?: number;
  [key: string]: unknown;
}

export interface VeoConfig {
  input_mode?: string;
  prompt?: string;
  negative_prompt?: string;
  duration?: number;
  aspect_ratio?: string;
  resolution?: string;
  speed?: string;
  person_generation?: string;
  reference_images?: ReferenceImage[];
  character_refs?: string[];
}

export interface ReferenceImage {
  image?: string;
  reference_type?: string;
}

export interface FrameConfig {
  source?: string;
  prompt?: string;
  resolution?: string;
  extract_from?: string;
}

export interface PlaywrightConfig {
  url: string;
  viewport: { width: number; height: number };
  actions: PlaywrightAction[];
  record_duration: number;
  annotations: PlaywrightAnnotation[];
}

export interface PlaywrightAction {
  type: string;
  [key: string]: unknown;
}

export interface PlaywrightAnnotation {
  type: string;
  [key: string]: unknown;
}

// Actual audio config from SSD
export interface AudioConfigActual {
  music?: {
    mood?: string;
    volume?: number;
    fade_in?: number;
    fade_out?: number;
  };
  sfx?: SoundEffectActual[];
  [key: string]: unknown;
}

export interface SoundEffectActual {
  effect?: string;
  start?: number;
  duration?: number;
  volume?: number;
}

// Template-style audio config
export interface AudioConfig {
  veo_native_audio?: boolean;
  narration?: {
    text: string;
    character_ref: string;
    timing: { start_seconds: number };
  };
  music?: {
    track?: string;
    mood?: string;
    volume?: number;
    fade_in?: number;
    fade_out?: number;
  };
  sfx?: SoundEffect[];
}

export interface SoundEffect {
  sound?: string;
  effect?: string;
  timing?: { at_seconds: number };
  start?: number;
  duration?: number;
  volume?: number;
}

// Actual remotion config from SSD
export interface RemotionConfigActual {
  composition_id?: string;
  duration_in_frames?: number;
  fps?: number;
  width?: number;
  height?: number;
  layers?: unknown[];
  text_overlays?: TextOverlayActual[];
  transition_out?: string;
}

export interface TextOverlayActual {
  content?: string;
  start_seconds?: number;
  duration_seconds?: number;
  position?: string;
  font?: string;
  font_size?: number;
  color?: string;
  background?: string;
  animation?: string;
}

// Template-style remotion config
export interface RemotionConfig {
  text_overlays?: TextOverlay[];
  transitions?: {
    in?: string;
    out?: string;
  };
  subtitles?: {
    enabled?: boolean;
    style?: string;
  };
}

export interface TextOverlay {
  text?: string;
  content?: string;
  font?: string;
  weight?: number;
  size?: number;
  font_size?: number;
  color?: string;
  position?: { x: string; y: string } | string;
  animation?: string;
  timing?: { in_seconds: number; out_seconds: number };
  start_seconds?: number;
  duration_seconds?: number;
}

export interface PostProcessing {
  filter: string;
  params: Record<string, unknown>;
}

export interface SceneCost {
  veo?: number;
  nano_banana?: number;
  elevenlabs?: number;
  scene_total?: number;
}

// Cost summary embedded in SSD
export interface CostSummary {
  scenes?: Record<string, SceneCostSummary>;
  character_references?: {
    nano_banana_4_angles?: number;
    retake_buffer?: number;
    subtotal?: number;
    [key: string]: unknown;
  };
  total_generation_cost?: number;
  budget_remaining?: number;
  budget_utilization?: string;
  [key: string]: unknown;
}

export interface SceneCostSummary {
  veo?: number;
  retake_buffer?: number;
  subtotal?: number;
  [key: string]: unknown;
}
