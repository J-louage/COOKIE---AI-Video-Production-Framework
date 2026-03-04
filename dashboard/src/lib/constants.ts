import path from "path";

export const PROJECT_ROOT = path.resolve(
  process.cwd(),
  process.env.COOKIE_PROJECT_ROOT || ".."
);

export const COOKIE_DIR = path.join(PROJECT_ROOT, "_cookie");
export const CONFIG_DIR = path.join(COOKIE_DIR, "_config");
export const MEMORY_DIR = path.join(COOKIE_DIR, "_memory");
export const COST_DIR = path.join(PROJECT_ROOT, "_cost");
export const EPISODES_DIR = path.join(PROJECT_ROOT, "episodes");
export const CHARACTERS_DIR = path.join(PROJECT_ROOT, "characters");
export const SHARED_ASSETS_DIR = path.join(PROJECT_ROOT, "shared-assets");

// Config files
export const GLOBAL_CONFIG = path.join(CONFIG_DIR, "global.yaml");
export const PROJECT_CONFIG = path.join(PROJECT_ROOT, "project-config.yaml");
export const PRICING_CONFIG = path.join(CONFIG_DIR, "pricing.yaml");
export const FORMAT_PRESETS = path.join(CONFIG_DIR, "format-presets.yaml");
export const RESOLUTION_PROFILES = path.join(CONFIG_DIR, "resolution-profiles.yaml");

// Manifests
export const AGENT_MANIFEST = path.join(CONFIG_DIR, "agent-manifest.csv");
export const WORKFLOW_MANIFEST = path.join(CONFIG_DIR, "workflow-manifest.csv");
export const TASK_MANIFEST = path.join(CONFIG_DIR, "task-manifest.csv");
export const SKILL_MANIFEST = path.join(CONFIG_DIR, "skill-manifest.csv");
export const MEMORY_CONFIG = path.join(MEMORY_DIR, "config.yaml");

// Brand
export const BRAND_DIR = path.join(CHARACTERS_DIR, "brand");
export const BRAND_CONFIG = path.join(BRAND_DIR, "brand-config.json");
export const BRAND_COLORS = path.join(BRAND_DIR, "colors.json");
export const BRAND_FONTS = path.join(BRAND_DIR, "fonts.json");

// Episode sub-paths (relative to episode dir)
export const EPISODE_CONFIG_FILE = "episode-config.yaml";
export const EPISODE_SCRIPT_FILE = "script/canonical-script.md";
export const EPISODE_SSD_FILE = "ssd/scene-spec.yaml";
export const EPISODE_STYLE_GUIDE_FILE = "style/style-guide.yaml";
export const EPISODE_COST_ESTIMATE_FILE = "costs/cost-estimate.yaml";
export const EPISODE_ASSETS_DIR = "assets";

// Allowed media extensions
export const ALLOWED_MEDIA_EXTENSIONS = new Set([
  ".mp4", ".webm", ".mov", ".avi",
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg",
  ".mp3", ".wav", ".ogg", ".m4a", ".aac",
]);

// MIME types
export const MIME_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
};
