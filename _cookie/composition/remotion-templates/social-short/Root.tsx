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

export interface SocialShortSSDConfig {
  /** Ordered list of scenes */
  scenes: SSDSceneEntry[];
  /** Background music track URL */
  musicSrc?: string;
  musicVolume?: number;
  /** Whether to display the progress bar */
  showProgressBar?: boolean;
  progressBarColor?: string;
  /** Override template defaults */
  fps?: number;
  width?: number;
  height?: number;
}

// ─── Main Composition Root ──────────────────────────────────────────────────

export const SocialShortComposition: React.FC<SocialShortSSDConfig> = ({
  scenes,
  musicSrc,
  musicVolume = 0.7,
  showProgressBar = false,
  progressBarColor = "#E63946",
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
          position="top"
          showPercentage={false}
        />
      )}

      {musicSrc && <Audio src={musicSrc} volume={musicVolume} />}
    </>
  );
};

// ─── Remotion <Composition> registration ────────────────────────────────────

export const RemotionRoot: React.FC = () => {
  const hookDurationFrames = Math.round(config.hookDurationSeconds * config.fps); // 45

  const defaultProps: SocialShortSSDConfig = {
    scenes: [
      // ── Hook (first 1.5 s) ──────────────────────────────────────────
      {
        id: "hook",
        durationInFrames: hookDurationFrames,
        backgroundColor: "#000000",
        overlays: [
          {
            kind: "text-overlay",
            props: {
              text: "Wait for it...",
              position: { x: 540, y: 900 },
              timing: { inSeconds: 0, outSeconds: 1.4 },
              animation: "bounce",
              size: 56,
              fontWeight: 800,
              color: "#FFFFFF",
            },
          },
        ],
        transitionIn: { type: "fade", fadeType: "fade-from-black", durationFrames: 4 },
      },

      // ── Body ────────────────────────────────────────────────────────
      {
        id: "body",
        durationInFrames: 450, // 15 s
        backgroundColor: "#0F0F0F",
        captions: {
          words: ["This", "is", "how", "you", "do", "it"],
          timing: [0, 12, 24, 36, 48, 60],
          activeWordColor: "#FFDD00",
          inactiveWordColor: "#FFFFFF",
          fontSize: 52,
          verticalPosition: 65,
        },
        transitionIn: { type: "wipe", wipeDirection: "up", durationFrames: 6 },
      },

      // ── CTA ─────────────────────────────────────────────────────────
      {
        id: "cta",
        durationInFrames: 150, // 5 s
        backgroundColor: "#111111",
        cta: {
          text: "Follow for more",
          fromFrame: 15,
        },
        overlays: [
          {
            kind: "text-overlay",
            props: {
              text: "Link in bio",
              position: { x: 540, y: 600 },
              timing: { inSeconds: 0.3, outSeconds: 4.5 },
              animation: "fade-in-up",
              size: 36,
              color: "rgba(255,255,255,0.8)",
            },
          },
        ],
        transitionIn: { type: "fade", fadeType: "cross-dissolve" },
        transitionOut: { type: "fade", fadeType: "fade-to-black", durationFrames: 10 },
      },
    ],
    showProgressBar: true,
    progressBarColor: "#E63946",
  };

  const totalDuration = defaultProps.scenes.reduce(
    (sum, s) => sum + s.durationInFrames,
    0,
  );

  return (
    <Composition
      id="SocialShort"
      component={SocialShortComposition as React.FC<Record<string, unknown>>}
      durationInFrames={totalDuration}
      fps={config.fps}
      width={config.width}
      height={config.height}
      defaultProps={defaultProps as unknown as Record<string, unknown>}
    />
  );
};

export default RemotionRoot;
