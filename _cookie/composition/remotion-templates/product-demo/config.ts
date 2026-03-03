/**
 * product-demo/config.ts
 *
 * Default configuration for the Product Demo template.
 * Product demonstration videos — 60-180 s, 16:9.
 */

export interface ProductDemoConfig {
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
  /** Whether screen recording integration is enabled by default */
  screenRecordingIntegration: boolean;
  /** Whether annotation overlays are enabled by default */
  annotationOverlays: boolean;
  /** Whether subtitles are shown by default */
  subtitlesDefault: boolean;
}

const config: ProductDemoConfig = {
  fps: 30,
  width: 1920,
  height: 1080,
  defaultTransition: "cross-dissolve",
  defaultTransitionDurationFrames: 15,
  minDurationSeconds: 60,
  maxDurationSeconds: 180,
  screenRecordingIntegration: true,
  annotationOverlays: true,
  subtitlesDefault: true,
};

export default config;
