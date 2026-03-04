export interface SceneSpec {
  episode_id: string;
  episode_title: string;
  total_duration_seconds: number;
  scene_count: number;
  resolution_profile: string;
  primary_format: string;
  primary_aspect_ratio: string;
  global_style: GlobalStyle;
  scenes: Scene[];
}

export interface GlobalStyle {
  style_guide: string;
  color_palette: string;
  veo_model: string;
  veo_speed: string;
  nano_banana_model: string;
  negative_prompt_global: string;
}

export interface Scene {
  scene_id: string;
  scene_type: "veo-generated" | "screen-recording" | "static-image" | "text-overlay" | "remotion-only";
  title: string;
  description: string;
  duration_seconds: number;
  priority: "essential" | "important" | "supplementary";
  short_form_hook: boolean;
  veo?: VeoConfig;
  clips?: Clip[];
  merge_strategy?: string;
  playwright?: PlaywrightConfig;
  audio: AudioConfig;
  remotion?: RemotionConfig;
  post_processing?: PostProcessing[];
  estimated_cost: SceneCost;
  character_refs?: string[];
}

export interface VeoConfig {
  input_mode: string;
  prompt: string;
  negative_prompt: string;
  duration: number;
  aspect_ratio: string;
  resolution: string;
  speed: string;
  person_generation: string;
  reference_images: ReferenceImage[];
  character_refs: string[];
}

export interface ReferenceImage {
  image: string;
  reference_type: string;
}

export interface Clip {
  clip_id: string;
  veo: VeoConfig;
  first_frame?: FrameConfig;
  last_frame?: FrameConfig;
}

export interface FrameConfig {
  source: string;
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

export interface AudioConfig {
  veo_native_audio: boolean;
  narration?: {
    text: string;
    character_ref: string;
    timing: { start_seconds: number };
  };
  music: {
    track: string;
    volume: number;
    fade_in: number;
    fade_out: number;
  };
  sfx: SoundEffect[];
}

export interface SoundEffect {
  sound: string;
  timing: { at_seconds: number };
  volume: number;
}

export interface RemotionConfig {
  text_overlays: TextOverlay[];
  transitions: {
    in: string;
    out: string;
  };
  subtitles: {
    enabled: boolean;
    style: string;
  };
}

export interface TextOverlay {
  text: string;
  font: string;
  weight: number;
  size: number;
  color: string;
  position: { x: string; y: string };
  animation: string;
  timing: { in_seconds: number; out_seconds: number };
}

export interface PostProcessing {
  filter: string;
  params: Record<string, unknown>;
}

export interface SceneCost {
  veo: number;
  nano_banana: number;
  elevenlabs: number;
  scene_total: number;
}
