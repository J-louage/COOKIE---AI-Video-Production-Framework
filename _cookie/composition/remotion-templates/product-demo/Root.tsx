import React from "react";
import { Audio, Composition, Sequence } from "remotion";
import { Scene, SceneProps } from "./Scene";
import { ProgressBar } from "../components/progress-bar";
import config from "./config";

// ─── SSD (Scene Sequence Descriptor) ────────────────────────────────────────

export interface SSDSceneEntry extends SceneProps {
  /** Unique identifier for this scene */
  id: string;
}

export interface ProductDemoSSDConfig {
  /** Ordered list of scenes */
  scenes: SSDSceneEntry[];
  /** Optional voice-over audio track URL */
  voiceOverSrc?: string;
  /** Voice-over volume (0-1) */
  voiceOverVolume?: number;
  /** Show a global progress bar across the entire video */
  showProgressBar?: boolean;
  /** Progress bar colour */
  progressBarColor?: string;
  /** Override template-level FPS */
  fps?: number;
  /** Override template-level width */
  width?: number;
  /** Override template-level height */
  height?: number;
}

// ─── Main Composition Root ──────────────────────────────────────────────────

export const ProductDemoComposition: React.FC<ProductDemoSSDConfig> = ({
  scenes,
  voiceOverSrc,
  voiceOverVolume = 1.0,
  showProgressBar = true,
  progressBarColor = "#4361EE",
}) => {
  let cumulativeFrame = 0;

  return (
    <>
      {scenes.map((scene) => {
        const startFrame = cumulativeFrame;
        cumulativeFrame += scene.durationInFrames;

        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={scene.durationInFrames}
            name={scene.id}
          >
            <Scene {...scene} />
          </Sequence>
        );
      })}

      {/* Global progress bar (spans entire video duration) */}
      {showProgressBar && (
        <ProgressBar
          color={progressBarColor}
          height={4}
          position="bottom"
          showPercentage={false}
        />
      )}

      {voiceOverSrc && <Audio src={voiceOverSrc} volume={voiceOverVolume} />}
    </>
  );
};

// ─── Remotion <Composition> registration ────────────────────────────────────

export const RemotionRoot: React.FC = () => {
  const defaultProps: ProductDemoSSDConfig = {
    scenes: [
      {
        id: "intro",
        durationInFrames: 120,
        backgroundColor: "#0F0F0F",
        overlays: [
          {
            kind: "title-card",
            props: {
              title: "Product Demo",
              subtitle: "See what's new",
              animation: "scale-up",
            },
          },
        ],
        transitionIn: { type: "fade", fadeType: "fade-from-black" },
      },
      {
        id: "feature-1",
        durationInFrames: 180,
        backgroundColor: "#111827",
        deviceFrame: true,
        overlays: [
          {
            kind: "text-overlay",
            props: {
              text: "Dashboard Overview",
              position: { x: 100, y: 60 },
              timing: { inSeconds: 0.5, outSeconds: 5 },
              animation: "fade-in-up",
              size: 36,
            },
          },
        ],
        annotations: [
          {
            type: "box-highlight",
            position: { x: 400, y: 300 },
            size: { width: 300, height: 200 },
            fromFrame: 30,
            toFrame: 120,
            color: "#4361EE",
          },
        ],
        transitionIn: { type: "fade", fadeType: "cross-dissolve" },
        transitionOut: { type: "fade", fadeType: "fade-to-black" },
      },
    ],
    showProgressBar: true,
  };

  const totalDuration = defaultProps.scenes.reduce(
    (sum, s) => sum + s.durationInFrames,
    0,
  );

  return (
    <Composition
      id="ProductDemo"
      component={ProductDemoComposition as React.FC<Record<string, unknown>>}
      durationInFrames={totalDuration}
      fps={config.fps}
      width={config.width}
      height={config.height}
      defaultProps={defaultProps as unknown as Record<string, unknown>}
    />
  );
};

export default RemotionRoot;
