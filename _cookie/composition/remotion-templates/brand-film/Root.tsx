import React from "react";
import { Audio, Composition, Sequence } from "remotion";
import { Scene, SceneProps } from "./Scene";
import config from "./config";

// ─── SSD (Scene Sequence Descriptor) ────────────────────────────────────────
// This is the shape the Cookie pipeline provides at render-time.
// Each entry describes one scene in the brand film.

export interface SSDSceneEntry extends SceneProps {
  /** Unique identifier for this scene (used as Sequence key) */
  id: string;
}

export interface BrandFilmSSDConfig {
  /** Ordered list of scenes */
  scenes: SSDSceneEntry[];
  /** Optional global music track URL */
  musicSrc?: string;
  /** Global music volume (0-1) */
  musicVolume?: number;
  /** Override template-level FPS */
  fps?: number;
  /** Override template-level width */
  width?: number;
  /** Override template-level height */
  height?: number;
}

// ─── Main Composition Root ──────────────────────────────────────────────────
export const BrandFilmComposition: React.FC<BrandFilmSSDConfig> = ({
  scenes,
  musicSrc,
  musicVolume = 0.7,
}) => {
  // Calculate the cumulative start frame for each scene
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

      {musicSrc && <Audio src={musicSrc} volume={musicVolume} />}
    </>
  );
};

// ─── Remotion <Composition> registration ────────────────────────────────────
// This is the entry-point Remotion looks for when rendering.

export const RemotionRoot: React.FC = () => {
  // Default / preview props — in production the Cookie pipeline injects the
  // real SSD config via `inputProps`.
  const defaultProps: BrandFilmSSDConfig = {
    scenes: [
      {
        id: "scene-1",
        durationInFrames: 150,
        backgroundColor: "#1a1a2e",
        overlays: [
          {
            kind: "title-card",
            props: {
              title: "Brand Film",
              subtitle: "Template Preview",
              animation: "fade-in",
            },
          },
        ],
        transitionIn: { type: "fade", fadeType: "fade-from-black" },
        transitionOut: { type: "fade", fadeType: "cross-dissolve" },
      },
      {
        id: "scene-2",
        durationInFrames: 120,
        backgroundColor: "#16213e",
        overlays: [
          {
            kind: "lower-third",
            props: {
              name: "Jane Doe",
              title: "Chief Creative Officer",
              timing: { inFrame: 15, holdFrames: 60, outFrame: 90 },
            },
          },
        ],
        transitionOut: { type: "fade", fadeType: "fade-to-black" },
      },
    ],
  };

  const totalDuration = defaultProps.scenes.reduce(
    (sum, s) => sum + s.durationInFrames,
    0,
  );

  return (
    <Composition
      id="BrandFilm"
      component={BrandFilmComposition as React.FC<Record<string, unknown>>}
      durationInFrames={totalDuration}
      fps={config.fps}
      width={config.width}
      height={config.height}
      defaultProps={defaultProps as unknown as Record<string, unknown>}
    />
  );
};

export default RemotionRoot;
