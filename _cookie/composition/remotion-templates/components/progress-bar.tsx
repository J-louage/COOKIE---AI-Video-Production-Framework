import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
} from "remotion";

export type ProgressBarPosition = "top" | "bottom";

export interface ProgressBarProps {
  /** Bar colour */
  color?: string;
  /** Bar height in pixels */
  height?: number;
  /** Whether the bar renders at the top or bottom of the frame */
  position?: ProgressBarPosition;
  /** Show a percentage label alongside the bar */
  showPercentage?: boolean;
  /** Background colour of the unfilled portion of the track */
  trackColor?: string;
  /** Percentage label font size */
  percentageFontSize?: number;
  /** Percentage label colour */
  percentageColor?: string;
  /** Font family for the percentage label */
  fontFamily?: string;
  /** Border radius of the bar (set to 0 for a flat edge) */
  borderRadius?: number;
  /** Horizontal padding from the frame edges (0 = full-bleed) */
  horizontalPadding?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  color = "#E63946",
  height = 6,
  position = "bottom",
  showPercentage = false,
  trackColor = "rgba(255, 255, 255, 0.15)",
  percentageFontSize = 14,
  percentageColor = "#FFFFFF",
  fontFamily = "Inter, Helvetica, Arial, sans-serif",
  borderRadius = 0,
  horizontalPadding = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // ── Current progress 0 → 1 ────────────────────────────────────────────
  const progress = interpolate(
    frame,
    [0, durationInFrames - 1],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const percentage = Math.round(progress * 100);

  const isTop = position === "top";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: horizontalPadding,
          right: horizontalPadding,
          [isTop ? "top" : "bottom"]: 0,
          display: "flex",
          flexDirection: isTop ? "column" : "column-reverse",
          alignItems: "stretch",
          gap: showPercentage ? 4 : 0,
        }}
      >
        {/* Track */}
        <div
          style={{
            width: "100%",
            height,
            backgroundColor: trackColor,
            borderRadius,
            overflow: "hidden",
          }}
        >
          {/* Filled bar */}
          <div
            style={{
              height: "100%",
              width: `${progress * 100}%`,
              backgroundColor: color,
              borderRadius,
              willChange: "width",
            }}
          />
        </div>

        {/* Percentage label */}
        {showPercentage && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: 8,
              paddingBottom: isTop ? 0 : 4,
              paddingTop: isTop ? 4 : 0,
            }}
          >
            <span
              style={{
                fontFamily,
                fontSize: percentageFontSize,
                fontWeight: 600,
                color: percentageColor,
                textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                lineHeight: 1,
              }}
            >
              {percentage}%
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export default ProgressBar;
