export interface ProjectConfig {
  project_name: string;
  project_id: string;
  defaults: {
    resolution_profile: string;
    veo_model: string;
    veo_speed: string;
    nano_banana_model: string;
    aspect_ratio: string;
    person_generation: string;
    brand: string;
  };
  episodes: ProjectEpisodeRef[];
  shared_characters: SharedCharacterRef[];
  budget: {
    total_project_budget: number;
    per_episode_budget: number;
    alert_at_percent: number;
    halt_at_percent: number;
    currency: string;
  };
  export_formats: string[];
  metadata: {
    created: string;
    last_modified: string;
    cookie_version: string;
  };
}

export interface ProjectEpisodeRef {
  episode_id: string;
  title: string;
  status: string;
  script: string;
  format: string;
  target_duration: number;
  characters: string[];
  overrides?: Record<string, unknown>;
}

export interface SharedCharacterRef {
  character_id: string;
  path: string;
}
