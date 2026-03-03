import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";

export type TextOverlayAnimation =
  | "fade-in"
  | "fade-in-up"
  | "slide-in-left"
  | "typewriter"
  | "bounce";

export interface TextOverlayPosition {
  /** Horizontal position in pixels from the left edge */
  x: number;
  /** Vertical position in pixels from the top edge */
  y: number;
}

export interface TextOverlayTiming {
  /** Time in seconds when the overlay appears */
  inSeconds: number;
  /** Time in seconds when the overlay disappears */
  outSeconds: number;
}

export interface TextOverlayProps {
  /** The text content to display */
  text: string;
  /** CSS font-family value */
  font?: string;
  /** Font size in pixels */
  size?: number;
  /** Text colour (any CSS colour value) */
  color?: string;
  /** Absolute position of the text on the canvas */
  position: TextOverlayPosition;
  /** Entrance / exit animation style */
  animation?: TextOverlayAnimation;
  /** When to show and hide the overlay */
  timing: TextOverlayTiming;
  /** Font weight (CSS value) */
  fontWeight?: number | string;
  /** Optional text shadow for legibility on video */
  textShadow?: string;
  /** Duration of the entrance animation in frames */
  animInFrames?: number;
  /** Duration of the exit animation in frames */
  animOutFrames?: number;
}

const DEFAULT_ANIM_IN = 15;
const DEFAULT_ANIM_OUT = 10;

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  font = "Inter, Helvetica, Arial, sans-serif",
  size = 48,
  color = "#FFFFFF",
  position,
  animation = "fade-in",
  timing,
  fontWeight = 600,
  textShadow = "0 2px 12px rgba(0,0,0,0.55)",
  animInFrames = DEFAULT_ANIM_IN,
  animOutFrames = DEFAULT_ANIM_OUT,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inFrame = Math.round(timing.inSeconds * fps);
  const outFrame = Math.round(timing.outSeconds * fps);
  const localFrame = frame - inFrame;

  // Not yet visible or already gone
  if (frame < inFrame || frame > outFrame + animOutFrames) {
    return null;
  }

  // ── Enter / exit interpolations ───────────────────────────────────────
  const enterProgress = interpolate(
    localFrame,
    [0, animInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const exitProgress = interpolate(
    frame,
    [outFrame, outFrame + animOutFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const visibility = Math.min(enterProgress, exitProgress);

  // ── Per-animation transform & opacity ─────────────────────────────────
  let transform = "";
  let opacity = visibility;
  let renderedText: React.ReactNode = text;

  switch (animation) {
    case "fade-in": {
      opacity = visibility;
      break;
    }

    case "fade-in-up": {
      const translateY = interpolate(enterProgress, [0, 1], [40, 0]);
      const exitY = interpolate(exitProgress, [1, 0], [0, -20]);
      transform = `translateY(${frame >= outFrame ? exitY : translateY}px)`;
      opacity = visibility;
      break;
    }

    case "slide-in-left": {
      const slideIn = interpolate(enterProgress, [0, 1], [-300, 0]);
      const slideOut = interpolate(exitProgress, [1, 0], [0, 300]);
      transform = `translateX(${frame >= outFrame ? slideOut : slideIn}px)`;
      opacity = visibility;
      break;
    }

    case "typewriter": {
      const chars = Math.floor(
        interpolate(localFrame, [0, animInFrames], [0, text.length], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      );
      renderedText = (
        <>
          <span>{text.slice(0, chars)}</span>
          <span style={{ opacity: 0 }}>{text.slice(chars)}</span>
        </>
      );
      opacity = exitProgress;
      break;
    }

    case "bounce": {
      const bounceSpring = spring({
        frame: localFrame,
        fps,
        config: { damping: 8, stiffness: 120, mass: 0.5 },
      });
      const scale = interpolate(bounceSpring, [0, 1], [0, 1]);
      transform = `scale(${scale * exitProgress})`;
      opacity = visibility;
      break;
    }
  }

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          fontFamily: font,
          fontSize: size,
          fontWeight,
          color,
          textShadow,
          opacity,
          transform,
          willChange: "transform, opacity",
          whiteSpace: "pre-wrap",
          lineHeight: 1.25,
        }}
      >
        {renderedText}
      </div>
    </AbsoluteFill>
  );
};

export default TextOverlay;
