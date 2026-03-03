import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Video,
  Audio,
  Img,
} from "remotion";
import { TransitionFade, FadeTransitionType } from "../components/transition-fade";
import { TransitionWipe, WipeDirection } from "../components/transition-wipe";
import { TitleCard, TitleCardProps } from "../components/title-card";
import { TextOverlay, TextOverlayProps } from "../components/text-overlay";
import { CaptionTikTok, CaptionTikTokProps } from "../components/caption-tiktok";
import { LowerThird, LowerThirdProps } from "../components/lower-third";
import config from "./config";

// ─── Overlay union ──────────────────────────────────────────────────────────
export type SceneOverlay =
  | { kind: "title-card"; props: TitleCardProps }
  | { kind: "text-overlay"; props: TextOverlayProps }
  | { kind: "caption"; props: CaptionTikTokProps }
  | { kind: "lower-third"; props: LowerThirdProps };

// ─── Transition descriptor ─────────────────────────────────────────────────
export interface SceneTransition {
  type: "fade" | "wipe";
  fadeType?: FadeTransitionType;
  wipeDirection?: WipeDirection;
  durationFrames?: number;
}

// ─── CTA descriptor ────────────────────────────────────────────────────────
export interface CTAConfig {
  /** CTA label text */
  text: string;
  /** Background colour of the CTA pill */
  backgroundColor?: string;
  /** Text colour */
  textColor?: string;
  /** Frame at which the CTA appears */
  fromFrame: number;
}

// ─── Scene props ────────────────────────────────────────────────────────────
export interface SceneProps {
  /** Background video source */
  videoSrc?: string;
  /** Fallback static image */
  imageSrc?: string;
  /** Scene audio source */
  audioSrc?: string;
  audioVolume?: number;
  /** Duration of this scene in frames */
  durationInFrames: number;
  overlays?: SceneOverlay[];
  /** Always-on caption track */
  captions?: CaptionTikTokProps;
  /** CTA configuration (typically on the last scene) */
  cta?: CTAConfig;
  transitionIn?: SceneTransition;
  transitionOut?: SceneTransition;
  playbackRate?: number;
  startFrom?: number;
  backgroundColor?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function renderOverlay(overlay: SceneOverlay, index: number): React.ReactNode {
  switch (overlay.kind) {
    case "title-card":
      return <TitleCard key={`ov-${index}`} {...overlay.props} />;
    case "text-overlay":
      return <TextOverlay key={`ov-${index}`} {...overlay.props} />;
    case "caption":
      return <CaptionTikTok key={`ov-${index}`} {...overlay.props} />;
    case "lower-third":
      return <LowerThird key={`ov-${index}`} {...overlay.props} />;
    default:
      return null;
  }
}

function renderTransition(
  transition: SceneTransition,
  startFrame: number,
): React.ReactNode {
  const dur = transition.durationFrames ?? config.defaultTransitionDurationFrames;
  if (transition.type === "wipe") {
    return (
      <TransitionWipe
        direction={transition.wipeDirection ?? "up"}
        durationFrames={dur}
        startFrame={startFrame}
      />
    );
  }
  return (
    <TransitionFade
      type={transition.fadeType ?? "fade-in"}
      durationFrames={dur}
      startFrame={startFrame}
    />
  );
}

// ─── CTA Button component ──────────────────────────────────────────────────
const CTAButton: React.FC<CTAConfig & { durationInFrames: number }> = ({
  text,
  backgroundColor = "#E63946",
  textColor = "#FFFFFF",
  fromFrame,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < fromFrame) return null;

  const localFrame = frame - fromFrame;

  const scaleSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.5 },
  });

  const scale = interpolate(scaleSpring, [0, 1], [0.5, 1]);
  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle pulse after the spring settles
  const pulse =
    localFrame > 20
      ? 1 + Math.sin((localFrame - 20) * 0.15) * 0.03
      : 1;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingBottom: 180,
      }}
    >
      <div
        style={{
          transform: `scale(${scale * pulse})`,
          opacity,
          backgroundColor,
          padding: "20px 48px",
          borderRadius: 50,
          boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
          willChange: "transform, opacity",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: textColor,
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Component ──────────────────────────────────────────────────────────────
export const Scene: React.FC<SceneProps> = ({
  videoSrc,
  imageSrc,
  audioSrc,
  audioVolume = 1,
  durationInFrames,
  overlays = [],
  captions,
  cta,
  transitionIn,
  transitionOut,
  playbackRate = 1,
  startFrom = 0,
  backgroundColor = "#000000",
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* ── Background media ─────────────────────────────────────────── */}
      {videoSrc && (
        <AbsoluteFill>
          <Video
            src={videoSrc}
            playbackRate={playbackRate}
            startFrom={Math.round(startFrom * config.fps)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {!videoSrc && imageSrc && (
        <AbsoluteFill>
          <Img
            src={imageSrc}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {audioSrc && <Audio src={audioSrc} volume={audioVolume} />}

      {/* ── Overlays ─────────────────────────────────────────────────── */}
      {overlays.map((overlay, idx) => renderOverlay(overlay, idx))}

      {/* ── Always-on captions ───────────────────────────────────────── */}
      {captions && <CaptionTikTok {...captions} />}

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      {cta && <CTAButton {...cta} durationInFrames={durationInFrames} />}

      {/* ── Transitions ──────────────────────────────────────────────── */}
      {transitionIn && renderTransition(transitionIn, 0)}
      {transitionOut &&
        renderTransition(
          transitionOut,
          durationInFrames -
            (transitionOut.durationFrames ?? config.defaultTransitionDurationFrames),
        )}
    </AbsoluteFill>
  );
};

export default Scene;
