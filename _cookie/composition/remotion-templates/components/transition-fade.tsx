import React from "react";
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from "remotion";

export type FadeTransitionType =
  | "fade-in"
  | "fade-out"
  | "cross-dissolve"
  | "fade-from-black"
  | "fade-to-black";

export interface TransitionFadeProps {
  /** The kind of fade transition to render */
  type?: FadeTransitionType;
  /** Length of the transition in frames */
  durationFrames?: number;
  /** Frame at which the transition begins (default 0 = start of Sequence) */
  startFrame?: number;
  /**
   * Overlay colour used for fade-from-black / fade-to-black.
   * Ignored for pure opacity fades.
   */
  overlayColor?: string;
}

export const TransitionFade: React.FC<TransitionFadeProps> = ({
  type = "fade-in",
  durationFrames = 15,
  startFrame = 0,
  overlayColor = "#000000",
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  // Only render while the transition is active
  if (localFrame < 0 || localFrame > durationFrames) {
    // For fade-to-black / fade-out we may want the overlay to persist after the transition.
    // Return full-black if past a fade-to-black so the next scene can cross-cut.
    if (
      (type === "fade-to-black" || type === "fade-out") &&
      localFrame > durationFrames
    ) {
      return (
        <AbsoluteFill
          style={{
            backgroundColor:
              type === "fade-to-black" ? overlayColor : undefined,
            opacity: type === "fade-out" ? 0 : 1,
            pointerEvents: "none",
          }}
        />
      );
    }
    return null;
  }

  const progress = interpolate(
    localFrame,
    [0, durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  let opacity: number;
  let color: string | undefined;

  switch (type) {
    // ── Fade-in: content goes from invisible → visible ───────────────────
    case "fade-in": {
      // Render a black overlay that fades *out* so content beneath fades in
      opacity = 1 - progress;
      color = overlayColor;
      break;
    }

    // ── Fade-out: content goes from visible → invisible ──────────────────
    case "fade-out": {
      opacity = progress;
      color = overlayColor;
      break;
    }

    // ── Cross-dissolve: a pair of two overlapping clips ──────────────────
    // The outgoing clip's opacity decreases while the incoming clip's increases.
    // Render a semi-transparent black overlay that peaks at 50 % mid-dissolve.
    case "cross-dissolve": {
      // Bell curve that peaks at 0.5 mid-way
      opacity = Math.sin(progress * Math.PI) * 0.3;
      color = overlayColor;
      break;
    }

    // ── Fade-from-black: black overlay fades away to reveal content ──────
    case "fade-from-black": {
      opacity = 1 - progress;
      color = overlayColor;
      break;
    }

    // ── Fade-to-black: black overlay fades in to cover content ───────────
    case "fade-to-black": {
      opacity = progress;
      color = overlayColor;
      break;
    }

    default: {
      opacity = 0;
      color = undefined;
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity,
        pointerEvents: "none",
        willChange: "opacity",
      }}
    />
  );
};

export default TransitionFade;
