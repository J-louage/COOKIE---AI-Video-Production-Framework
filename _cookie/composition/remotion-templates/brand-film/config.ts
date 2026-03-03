/**
 * brand-film/config.ts
 *
 * Default configuration for the Brand Film template.
 * Cinematic brand videos — 60-300 s, 16:9.
 */

export interface BrandFilmConfig {
  /** Frames per second */
  fps: number;
  /** Composition width in pixels */
  width: number;
  /** Composition height in pixels */
  height: number;
  /** Default transition between scenes */
  defaultTransition: "cross-dissolve" | "fade-in" | "fade-out" | "wipe";
  /** Default transition duration in frames */
  defaultTransitionDurationFrames: number;
  /** Minimum video duration in seconds */
  minDurationSeconds: number;
  /** Maximum video duration in seconds */
  maxDurationSeconds: number;
}

const config: BrandFilmConfig = {
  fps: 30,
  width: 1920,
  height: 1080,
  defaultTransition: "cross-dissolve",
  defaultTransitionDurationFrames: 20,
  minDurationSeconds: 60,
  maxDurationSeconds: 300,
};

export default config;
