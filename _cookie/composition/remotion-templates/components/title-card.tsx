import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";

export type TitleCardAnimation = "fade-in" | "scale-up" | "typewriter";

export interface TitleCardProps {
  /** Main headline */
  title: string;
  /** Optional secondary line beneath the title */
  subtitle?: string;
  /** Card background colour */
  backgroundColor?: string;
  /** Title text colour */
  textColor?: string;
  /** Subtitle text colour (defaults to textColor at 70 % opacity) */
  subtitleColor?: string;
  /** Entrance animation style */
  animation?: TitleCardAnimation;
  /** Title font size in pixels */
  titleFontSize?: number;
  /** Subtitle font size in pixels */
  subtitleFontSize?: number;
  /** Font family for all text */
  fontFamily?: string;
  /** Frame at which the card begins appearing (default 0) */
  startFrame?: number;
  /** Duration of the entrance animation in frames */
  animationDuration?: number;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  backgroundColor = "#000000",
  textColor = "#FFFFFF",
  subtitleColor,
  animation = "fade-in",
  titleFontSize = 72,
  subtitleFontSize = 32,
  fontFamily = "Inter, Helvetica, Arial, sans-serif",
  startFrame = 0,
  animationDuration = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;
  if (localFrame < 0) return null;

  const resolvedSubtitleColor =
    subtitleColor ?? `${textColor}B3`; // ~70 % opacity hex suffix

  // ── Animation values ──────────────────────────────────────────────────
  const progress = interpolate(
    localFrame,
    [0, animationDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  let titleStyle: React.CSSProperties = {};
  let subtitleStyle: React.CSSProperties = {};

  switch (animation) {
    // ── Fade-in ──────────────────────────────────────────────────────────
    case "fade-in": {
      const titleOpacity = interpolate(
        localFrame,
        [0, animationDuration * 0.6],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      const subtitleOpacity = interpolate(
        localFrame,
        [animationDuration * 0.35, animationDuration],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      titleStyle = { opacity: titleOpacity };
      subtitleStyle = { opacity: subtitleOpacity };
      break;
    }

    // ── Scale-up ─────────────────────────────────────────────────────────
    case "scale-up": {
      const scaleSpring = spring({
        frame: localFrame,
        fps,
        config: { damping: 12, stiffness: 80, mass: 0.6 },
      });
      const scale = interpolate(scaleSpring, [0, 1], [0.6, 1]);
      const opacity = interpolate(
        localFrame,
        [0, animationDuration * 0.4],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      titleStyle = {
        transform: `scale(${scale})`,
        opacity,
      };
      const subtitleDelay = Math.max(0, localFrame - 8);
      const subSpring = spring({
        frame: subtitleDelay,
        fps,
        config: { damping: 14, stiffness: 100, mass: 0.5 },
      });
      subtitleStyle = {
        opacity: interpolate(subSpring, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(subSpring, [0, 1], [20, 0])}px)`,
      };
      break;
    }

    // ── Typewriter ───────────────────────────────────────────────────────
    case "typewriter": {
      const charsToShow = Math.floor(
        interpolate(
          localFrame,
          [0, animationDuration],
          [0, title.length],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      );
      // We render two spans: visible + invisible for layout stability
      titleStyle = {};
      subtitleStyle = {
        opacity: interpolate(
          localFrame,
          [animationDuration, animationDuration + 15],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      };

      return (
        <AbsoluteFill
          style={{
            backgroundColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: titleFontSize,
              color: textColor,
              lineHeight: 1.15,
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            <span>{title.slice(0, charsToShow)}</span>
            <span style={{ opacity: 0 }}>{title.slice(charsToShow)}</span>
            {/* Blinking cursor */}
            <span
              style={{
                opacity: Math.sin(localFrame * 0.5) > 0 ? 1 : 0,
                color: textColor,
                fontWeight: 300,
              }}
            >
              |
            </span>
          </span>

          {subtitle && (
            <span
              style={{
                fontFamily,
                fontWeight: 400,
                fontSize: subtitleFontSize,
                color: resolvedSubtitleColor,
                lineHeight: 1.4,
                textAlign: "center",
                maxWidth: "70%",
                ...subtitleStyle,
              }}
            >
              {subtitle}
            </span>
          )}
        </AbsoluteFill>
      );
    }
  }

  // ── Default render (fade-in / scale-up) ────────────────────────────────
  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <span
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: titleFontSize,
          color: textColor,
          lineHeight: 1.15,
          textAlign: "center",
          maxWidth: "80%",
          ...titleStyle,
        }}
      >
        {title}
      </span>

      {subtitle && (
        <span
          style={{
            fontFamily,
            fontWeight: 400,
            fontSize: subtitleFontSize,
            color: resolvedSubtitleColor,
            lineHeight: 1.4,
            textAlign: "center",
            maxWidth: "70%",
            ...subtitleStyle,
          }}
        >
          {subtitle}
        </span>
      )}
    </AbsoluteFill>
  );
};

export default TitleCard;
