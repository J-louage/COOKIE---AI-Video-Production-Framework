import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
} from "remotion";

export interface LowerThirdTiming {
  /** Frame at which the lower-third begins animating in */
  inFrame: number;
  /** Number of frames the lower-third stays fully visible */
  holdFrames: number;
  /** Frame at which the lower-third begins animating out (calculated as inFrame + animInDuration + holdFrames if omitted) */
  outFrame: number;
}

export type LowerThirdAnimationType = "slide-in-left" | "fade-in" | "slide-up";

export interface LowerThirdProps {
  /** Primary name / headline displayed on the lower-third */
  name: string;
  /** Secondary title / role displayed beneath the name */
  title: string;
  /** Vertical position of the bar — distance from the bottom of the frame in pixels */
  position?: number;
  /** How the lower-third enters and exits the frame */
  animationType?: LowerThirdAnimationType;
  /** Frame-level timing controls */
  timing: LowerThirdTiming;
  /** Background colour of the bar (supports any CSS colour value) */
  backgroundColor?: string;
  /** Text colour for the name */
  nameColor?: string;
  /** Text colour for the title */
  titleColor?: string;
  /** Duration in frames for the enter animation */
  animInDuration?: number;
  /** Duration in frames for the exit animation */
  animOutDuration?: number;
}

const ANIM_IN_FRAMES = 15;
const ANIM_OUT_FRAMES = 12;

export const LowerThird: React.FC<LowerThirdProps> = ({
  name,
  title,
  position = 80,
  animationType = "slide-in-left",
  timing,
  backgroundColor = "rgba(0, 0, 0, 0.72)",
  nameColor = "#FFFFFF",
  titleColor = "rgba(255, 255, 255, 0.85)",
  animInDuration = ANIM_IN_FRAMES,
  animOutDuration = ANIM_OUT_FRAMES,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const { inFrame, holdFrames, outFrame } = timing;

  // ── Enter progress (0 → 1) ────────────────────────────────────────────
  const enterProgress = interpolate(
    frame,
    [inFrame, inFrame + animInDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ── Exit progress (1 → 0) ─────────────────────────────────────────────
  const exitProgress = interpolate(
    frame,
    [outFrame, outFrame + animOutDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Combined visibility (the lower of the two keeps us hidden before in / after out)
  const visibility = Math.min(enterProgress, exitProgress);

  // If not yet visible, skip rendering entirely
  if (frame < inFrame || frame > outFrame + animOutDuration) {
    return null;
  }

  // ── Animation-specific transforms ─────────────────────────────────────
  let transform = "";
  let opacity = visibility;

  switch (animationType) {
    case "slide-in-left": {
      const translateX = interpolate(visibility, [0, 1], [-width * 0.5, 0]);
      transform = `translateX(${translateX}px)`;
      break;
    }
    case "slide-up": {
      const translateY = interpolate(visibility, [0, 1], [120, 0]);
      transform = `translateY(${translateY}px)`;
      break;
    }
    case "fade-in":
    default: {
      opacity = visibility;
      break;
    }
  }

  // ── Accent bar width animation ────────────────────────────────────────
  const accentWidth = interpolate(enterProgress, [0, 1], [0, 4]);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: position,
          left: 60,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          opacity,
          transform,
          willChange: "transform, opacity",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: accentWidth,
            backgroundColor: "#E63946",
            borderRadius: 2,
            marginRight: 16,
          }}
        />

        {/* Text container */}
        <div
          style={{
            backgroundColor,
            padding: "16px 32px",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 700,
              fontSize: 32,
              color: nameColor,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 400,
              fontSize: 20,
              color: titleColor,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default LowerThird;
