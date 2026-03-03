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

export interface ExplainerSSDConfig {
  /** Ordered list of scenes */
  scenes: SSDSceneEntry[];
  /** Optional global voice-over track URL */
  voiceOverSrc?: string;
  voiceOverVolume?: number;
  /** Show a progress bar across the whole video */
  showProgressBar?: boolean;
  progressBarColor?: string;
  /** Override template defaults */
  fps?: number;
  width?: number;
  height?: number;
}

// ─── Main Composition Root ──────────────────────────────────────────────────

export const ExplainerComposition: React.FC<ExplainerSSDConfig> = ({
  scenes,
  voiceOverSrc,
  voiceOverVolume = 1.0,
  showProgressBar = true,
  progressBarColor = "#10B981",
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
  const defaultProps: ExplainerSSDConfig = {
    scenes: [
      {
        id: "hook",
        durationInFrames: 90,
        backgroundColor: "#111827",
        overlays: [
          {
            kind: "title-card",
            props: {
              title: "Did You Know?",
              subtitle: "Here's how it works",
              animation: "typewriter",
              titleFontSize: 64,
            },
          },
        ],
        transitionIn: { type: "fade", fadeType: "fade-from-black" },
      },
      {
        id: "problem",
        durationInFrames: 180,
        backgroundColor: "#1E293B",
        overlays: [
          {
            kind: "text-overlay",
            props: {
              text: "The Problem",
              position: { x: 120, y: 80 },
              timing: { inSeconds: 0.3, outSeconds: 5 },
              animation: "fade-in-up",
              size: 42,
              fontWeight: 700,
            },
          },
        ],
        subtitles: {
          words: ["Most", "people", "struggle", "with", "this"],
          timing: [10, 18, 26, 36, 42],
          activeWordColor: "#FBBF24",
          inactiveWordColor: "#FFFFFF",
          fontSize: 48,
        },
        transitionIn: { type: "wipe", wipeDirection: "right" },
      },
      {
        id: "solution",
        durationInFrames: 240,
        backgroundColor: "#0F172A",
        splitLayout: "left-graphic",
        overlays: [
          {
            kind: "text-overlay",
            props: {
              text: "The Solution",
              position: { x: 1020, y: 120 },
              timing: { inSeconds: 0.3, outSeconds: 7 },
              animation: "slide-in-left",
              size: 42,
              fontWeight: 700,
            },
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
      id="Explainer"
      component={ExplainerComposition as React.FC<Record<string, unknown>>}
      durationInFrames={totalDuration}
      fps={config.fps}
      width={config.width}
      height={config.height}
      defaultProps={defaultProps as unknown as Record<string, unknown>}
    />
  );
};

export default RemotionRoot;
