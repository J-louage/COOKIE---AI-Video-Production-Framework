/**
 * social-short/config.ts
 *
 * Default configuration for the Social Short template.
 * Vertical social media clips — 15-60 s, 9:16 (TikTok, Reels, Shorts).
 */

export interface SocialShortConfig {
  /** Frames per second */
  fps: number;
  /** Composition width in pixels (vertical) */
  width: number;
  /** Composition height in pixels (vertical) */
  height: number;
  /** Default transition between scenes */
  defaultTransition: "cross-dissolve" | "fade-in" | "fade-out" | "wipe";
  /** Default transition duration in frames */
  defaultTransitionDurationFrames: number;
  /** Minimum video duration in seconds */
  minDurationSeconds: number;
  /** Maximum video duration in seconds */
  maxDurationSeconds: number;
  /** Whether a hook is required at the start */
  hookRequired: boolean;
  /** Default hook duration in seconds */
  hookDurationSeconds: number;
  /** Whether captions are always rendered */
  captionsAlwaysOn: boolean;
  /** Whether a CTA is shown at the end */
  ctaAtEnd: boolean;
  /** Whether to show a progress bar (optional per video) */
  progressBarOptional: boolean;
}

const config: SocialShortConfig = {
  fps: 30,
  width: 1080,
  height: 1920,
  defaultTransition: "fade-in",
  defaultTransitionDurationFrames: 8,
  minDurationSeconds: 15,
  maxDurationSeconds: 60,
  hookRequired: true,
  hookDurationSeconds: 1.5,
  captionsAlwaysOn: true,
  ctaAtEnd: true,
  progressBarOptional: true,
};

export default config;
