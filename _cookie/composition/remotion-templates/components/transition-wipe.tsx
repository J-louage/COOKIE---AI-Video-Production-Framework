import React from "react";
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from "remotion";

export type WipeDirection = "left" | "right" | "up" | "down";

export interface TransitionWipeProps {
  /** Direction the wipe travels toward */
  direction?: WipeDirection;
  /** Duration of the wipe transition in frames */
  durationFrames?: number;
  /** Frame at which the wipe begins (default 0 = start of Sequence) */
  startFrame?: number;
  /** Colour of the wipe overlay panel */
  color?: string;
  /**
   * Width of the soft / feathered edge in percentage points (0 = hard edge).
   * Adds a gradient fringe to the clip boundary for a softer look.
   */
  feather?: number;
}

/**
 * Builds an `inset()` CSS clip-path string that progressively reveals
 * or covers the frame from the given direction.
 *
 * `progress` goes from 0 (fully covered / overlay visible) to 1 (fully revealed / overlay gone).
 */
function buildClipPath(direction: WipeDirection, progress: number): string {
  // inset(top right bottom left)
  // We animate one edge from 0 % → 100 % to slide the overlay off-screen.
  const p = `${progress * 100}%`;
  switch (direction) {
    // Wipe traveling to the LEFT means the overlay's left edge shrinks
    case "left":
      return `inset(0 0 0 ${p})`;
    // Wipe traveling to the RIGHT means the overlay's right edge shrinks
    case "right":
      return `inset(0 ${p} 0 0)`;
    // Wipe traveling UP
    case "up":
      return `inset(${p} 0 0 0)`;
    // Wipe traveling DOWN
    case "down":
      return `inset(0 0 ${p} 0)`;
    default:
      return `inset(0 0 0 0)`;
  }
}

export const TransitionWipe: React.FC<TransitionWipeProps> = ({
  direction = "left",
  durationFrames = 15,
  startFrame = 0,
  color = "#000000",
  feather = 0,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  // Before the transition starts — overlay is fully visible (covering content)
  if (localFrame < 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: color,
          pointerEvents: "none",
        }}
      />
    );
  }

  // After the transition completes — overlay is fully gone
  if (localFrame > durationFrames) {
    return null;
  }

  // ── Wipe progress 0 → 1 ───────────────────────────────────────────────
  const progress = interpolate(
    localFrame,
    [0, durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const clipPath = buildClipPath(direction, progress);

  // ── Optional feathered (gradient) edge ────────────────────────────────
  // When feather > 0 we layer a gradient mask on top of the clip-path
  // for a softer visual boundary.
  let maskImage: string | undefined;
  if (feather > 0) {
    const gradientDirection =
      direction === "left"
        ? "to left"
        : direction === "right"
          ? "to right"
          : direction === "up"
            ? "to top"
            : "to bottom";

    const edgePos = progress * 100;
    const featherStart = Math.max(0, edgePos - feather);
    const featherEnd = Math.min(100, edgePos + feather);

    maskImage = `linear-gradient(${gradientDirection}, black ${featherStart}%, transparent ${featherEnd}%)`;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        clipPath,
        WebkitClipPath: clipPath,
        maskImage,
        WebkitMaskImage: maskImage,
        pointerEvents: "none",
        willChange: "clip-path",
      }}
    />
  );
};

export default TransitionWipe;
