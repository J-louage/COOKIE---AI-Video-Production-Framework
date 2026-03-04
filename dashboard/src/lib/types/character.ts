export interface CharacterIdentity {
  // Actual data uses "id", template may use "character_id"
  id?: string;
  character_id?: string;
  name: string;
  role: string;
  description: string;

  // Actual data uses "personality" array
  personality?: string[];

  // Actual data uses "physical_description" with nested objects
  physical_description?: PhysicalDescription;
  // Template fallback
  physical?: PhysicalTraits;

  prompt_tokens?: PromptTokens;

  // Actual data uses "voice_config", template uses "voice"
  voice_config?: VoiceConfigSimple;
  voice?: VoiceConfigElevenLabs;

  // Actual data uses "styles" array with nested outfits
  styles?: CharacterStyle[];
  // Template fallback
  available_styles?: string[];
  available_outfits?: Record<string, string[]>;

  active_style?: string;
  active_outfit?: string;

  // Template field — not present in actual data
  type?: "visual-voice" | "visual-only" | "voice-only";

  reference_images?: {
    character_sheet?: string;
    [key: string]: string | undefined;
  };

  metadata?: {
    created_at?: string;
    version?: string;
    status?: string;
    project?: string;
    episode?: string;
    notes?: string;
    [key: string]: unknown;
  };
}

// Actual data structure from identity.json
export interface PhysicalDescription {
  species?: string;
  breed?: string;
  age_range?: string;
  build?: string;
  coat?: {
    color?: string;
    hex_primary?: string;
    hex_secondary?: string;
    hex_highlights?: string;
    texture?: string;
    length?: string;
  };
  eyes?: string | {
    color?: string;
    hex?: string;
    expression?: string;
  };
  nose?: {
    color?: string;
    hex?: string;
  };
  // Human characters
  height?: string;
  hair?: string;
  skin_tone?: string;
  distinguishing_features?: string[];
  size?: string;
  [key: string]: unknown;
}

// Template-style flat physical traits
export interface PhysicalTraits {
  height?: string;
  build?: string;
  hair?: string;
  eyes?: string;
  skin_tone?: string;
  age_range?: string;
  distinguishing_features?: string[];
  [key: string]: unknown;
}

export interface PromptTokens {
  core_identity?: string;
  style_modifiers?: string[];
  negative_tokens?: string[];
  consistency_anchors?: string[];
  // Template fields
  negative?: string;
  veo_specific?: string;
  nano_banana_specific?: string;
  [key: string]: unknown;
}

// Simple voice config (actual data)
export interface VoiceConfigSimple {
  voice_type?: string;
  notes?: string;
  [key: string]: unknown;
}

// ElevenLabs voice config (template)
export interface VoiceConfigElevenLabs {
  elevenlabs_voice_id?: string;
  stability?: number;
  clarity?: number;
  style?: number;
  speaking_style?: string;
  language?: string;
}

export interface CharacterStyle {
  style_id: string;
  style_name: string;
  description?: string;
  outfits?: CharacterOutfit[];
}

export interface CharacterOutfit {
  outfit_id: string;
  outfit_name: string;
  description?: string;
  prompt_tokens?: string;
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
