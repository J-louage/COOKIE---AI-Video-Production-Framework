export interface CharacterIdentity {
  character_id: string;
  name: string;
  role: string;
  type: "visual-voice" | "visual-only" | "voice-only";
  description: string;
  physical: PhysicalTraits;
  prompt_tokens: PromptTokens;
  voice: VoiceConfig;
  active_style: string;
  active_outfit: string;
  available_styles: string[];
  available_outfits: Record<string, string[]>;
}

export interface PhysicalTraits {
  height: string;
  build: string;
  hair: string;
  eyes: string;
  skin_tone: string;
  age_range: string;
  distinguishing_features: string[];
}

export interface PromptTokens {
  core_identity: string;
  negative: string;
  veo_specific: string;
  nano_banana_specific: string;
}

export interface VoiceConfig {
  elevenlabs_voice_id: string;
  stability: number;
  clarity: number;
  style: number;
  speaking_style: string;
  language: string;
}

export interface BrandConfig {
  brand_name: string;
  brand_id: string;
  tagline: string;
  logo_path: string;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  font_heading: string;
  font_body: string;
  tone_of_voice: string;
  watermark: {
    enabled: boolean;
    position: string;
    opacity: number;
    image_path: string;
  };
  social_handles: Record<string, string>;
}

export interface BrandColors {
  palette: Record<
    string,
    { hex: string; rgb: string; usage: string }
  >;
  gradients: Record<string, unknown>;
}

export interface BrandFonts {
  [key: string]: {
    family: string;
    weight: string;
    style: string;
    fallback: string;
    usage: string;
  };
}
