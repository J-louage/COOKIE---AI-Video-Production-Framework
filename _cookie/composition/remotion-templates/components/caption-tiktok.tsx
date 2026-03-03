import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";

export interface CaptionTikTokProps {
  /** Array of individual words to display */
  words: string[];
  /**
   * Frame number at which each word becomes "active".
   * Must be the same length as `words`.
   */
  timing: number[];
  /** Colour for the currently spoken / active word */
  activeWordColor?: string;
  /** Colour for all other words */
  inactiveWordColor?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Font weight for active word */
  activeWordWeight?: number | string;
  /** Font weight for inactive words */
  inactiveWordWeight?: number | string;
  /** Maximum width of the caption container (percentage of frame width) */
  maxWidthPercent?: number;
  /** Vertical position — percentage from top (50 = centred) */
  verticalPosition?: number;
  /** Whether to add a subtle scale pop to the active word */
  popEffect?: boolean;
  /** Background pill behind the text for legibility */
  showBackground?: boolean;
  /** Background colour when showBackground is true */
  backgroundColor?: string;
}

/**
 * Determines which word is currently active based on frame position.
 * Returns -1 if before the first word.
 */
function getActiveIndex(frame: number, timing: number[]): number {
  let active = -1;
  for (let i = 0; i < timing.length; i++) {
    if (frame >= timing[i]) {
      active = i;
    } else {
      break;
    }
  }
  return active;
}

export const CaptionTikTok: React.FC<CaptionTikTokProps> = ({
  words,
  timing,
  activeWordColor = "#FFDD00",
  inactiveWordColor = "#FFFFFF",
  fontSize = 64,
  fontFamily = "Inter, Helvetica, Arial, sans-serif",
  activeWordWeight = 800,
  inactiveWordWeight = 600,
  maxWidthPercent = 85,
  verticalPosition = 50,
  popEffect = true,
  showBackground = true,
  backgroundColor = "rgba(0, 0, 0, 0.50)",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Don't render before the first word is due
  if (timing.length === 0 || frame < timing[0]) {
    return null;
  }

  const activeIndex = getActiveIndex(frame, timing);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: `center`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${verticalPosition}%`,
          transform: "translateY(-50%)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: `${fontSize * 0.3}px`,
          maxWidth: `${maxWidthPercent}%`,
          padding: showBackground
            ? `${fontSize * 0.35}px ${fontSize * 0.55}px`
            : undefined,
          borderRadius: showBackground ? fontSize * 0.35 : undefined,
          backgroundColor: showBackground ? backgroundColor : undefined,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        {words.map((word, idx) => {
          const isActive = idx === activeIndex;

          // Frame-local offset for the pop spring
          const wordLocalFrame = Math.max(0, frame - (timing[idx] ?? 0));

          const popSpring =
            isActive && popEffect
              ? spring({
                  frame: wordLocalFrame,
                  fps,
                  config: { damping: 10, stiffness: 200, mass: 0.4 },
                })
              : 1;

          const scale =
            isActive && popEffect
              ? interpolate(popSpring, [0, 1], [1.15, 1])
              : 1;

          return (
            <span
              key={`${idx}-${word}`}
              style={{
                fontFamily,
                fontSize,
                fontWeight: isActive ? activeWordWeight : inactiveWordWeight,
                color: isActive ? activeWordColor : inactiveWordColor,
                transform: `scale(${scale})`,
                display: "inline-block",
                textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                willChange: "transform, color",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default CaptionTikTok;
