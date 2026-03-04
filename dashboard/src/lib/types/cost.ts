export interface CostEstimate {
  episode_id: string;
  episode_title: string;
  estimated_at: string;
  resolution_profile: string;
  pricing_version: string;
  scenes: CostScene[];
  summary: CostSummary;
}

export interface CostScene {
  scene_id: string;
  veo_calls: number;
  veo_cost: number;
  nano_banana_calls: number;
  nano_banana_cost: number;
  elevenlabs_calls: number;
  elevenlabs_cost: number;
  scene_total: number;
}

export interface CostSummary {
  total_scenes: number;
  total_veo_calls: number;
  total_nano_banana_calls: number;
  total_elevenlabs_calls: number;
  veo_total: number;
  nano_banana_total: number;
  elevenlabs_total: number;
  subtotal: number;
  retake_buffer_percent: number;
  retake_buffer: number;
  estimated_total: number;
  resolution_alternatives: Record<string, number>;
}

export interface Pricing {
  veo: Record<string, Record<string, Record<string, { per_second: number }>>>;
  nano_banana: Record<string, Record<string, number>>;
  elevenlabs: { per_1000_characters: number };
  remotion: number;
  ffmpeg: number;
  playwright: number;
  image_editing: number;
}
