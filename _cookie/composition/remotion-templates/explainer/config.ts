/**
 * explainer/config.ts
 *
 * Default configuration for the Explainer template.
 * Educational / explainer videos — 60-180 s, 16:9.
 */

export interface ExplainerConfig {
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
  /** Whether subtitles are always rendered */
  subtitlesAlwaysOn: boolean;
  /** Pacing preset */
  pacing: "slow" | "moderate" | "fast";
}

const config: ExplainerConfig = {
  fps: 30,
  width: 1920,
  height: 1080,
  defaultTransition: "cross-dissolve",
  defaultTransitionDurationFrames: 12,
  minDurationSeconds: 60,
  maxDurationSeconds: 180,
  subtitlesAlwaysOn: true,
  pacing: "fast",
};

export default config;
