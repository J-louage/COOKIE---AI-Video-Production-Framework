import React from "react";
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
  Video,
  Audio,
  Img,
} from "remotion";
import { TransitionFade, FadeTransitionType } from "../components/transition-fade";
import { TransitionWipe, WipeDirection } from "../components/transition-wipe";
import { LowerThird, LowerThirdProps } from "../components/lower-third";
import { TitleCard, TitleCardProps } from "../components/title-card";
import { TextOverlay, TextOverlayProps } from "../components/text-overlay";
import { CaptionTikTok, CaptionTikTokProps } from "../components/caption-tiktok";
import { ProgressBar, ProgressBarProps } from "../components/progress-bar";
import config from "./config";

// ─── Overlay union ──────────────────────────────────────────────────────────
export type SceneOverlay =
  | { kind: "lower-third"; props: LowerThirdProps }
  | { kind: "title-card"; props: TitleCardProps }
  | { kind: "text-overlay"; props: TextOverlayProps }
  | { kind: "caption"; props: CaptionTikTokProps }
  | { kind: "progress-bar"; props: ProgressBarProps };

// ─── Annotation descriptor ─────────────────────────────────────────────────
export interface Annotation {
  /** Type of annotation graphic */
  type: "cursor-highlight" | "box-highlight" | "arrow" | "callout";
  /** Position on the frame */
  position: { x: number; y: number };
  /** Dimensions for box-highlight */
  size?: { width: number; height: number };
  /** Frame range the annotation is visible */
  fromFrame: number;
  toFrame: number;
  /** Accent colour */
  color?: string;
  /** Optional label text */
  label?: string;
}

// ─── Transition descriptor ─────────────────────────────────────────────────
export interface SceneTransition {
  type: "fade" | "wipe";
  fadeType?: FadeTransitionType;
  wipeDirection?: WipeDirection;
  durationFrames?: number;
}

// ─── Scene props ────────────────────────────────────────────────────────────
export interface SceneProps {
  /** Background video source (screen recording or filmed footage) */
  videoSrc?: string;
  /** Fallback static image */
  imageSrc?: string;
  /** Scene-level audio source */
  audioSrc?: string;
  audioVolume?: number;
  /** Duration of this scene in frames */
  durationInFrames: number;
  /** Overlays rendered on top of the video */
  overlays?: SceneOverlay[];
  /** Annotation graphics for screen recordings */
  annotations?: Annotation[];
  transitionIn?: SceneTransition;
  transitionOut?: SceneTransition;
  playbackRate?: number;
  startFrom?: number;
  backgroundColor?: string;
  /**
   * If true the video is rendered inside a device frame
   * (browser mockup / laptop bezel). Useful for screen recordings.
   */
  deviceFrame?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function renderOverlay(overlay: SceneOverlay, index: number): React.ReactNode {
  switch (overlay.kind) {
    case "lower-third":
      return <LowerThird key={`ov-${index}`} {...overlay.props} />;
    case "title-card":
      return <TitleCard key={`ov-${index}`} {...overlay.props} />;
    case "text-overlay":
      return <TextOverlay key={`ov-${index}`} {...overlay.props} />;
    case "caption":
      return <CaptionTikTok key={`ov-${index}`} {...overlay.props} />;
    case "progress-bar":
      return <ProgressBar key={`ov-${index}`} {...overlay.props} />;
    default:
      return null;
  }
}

function renderAnnotation(ann: Annotation, index: number, frame: number): React.ReactNode {
  if (frame < ann.fromFrame || frame > ann.toFrame) return null;
  const opacity = interpolate(
    frame,
    [ann.fromFrame, ann.fromFrame + 6, ann.toFrame - 6, ann.toFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const baseColor = ann.color ?? "#4361EE";

  switch (ann.type) {
    case "box-highlight":
      return (
        <div
          key={`ann-${index}`}
          style={{
            position: "absolute",
            left: ann.position.x,
            top: ann.position.y,
            width: ann.size?.width ?? 200,
            height: ann.size?.height ?? 100,
            border: `3px solid ${baseColor}`,
            borderRadius: 8,
            opacity,
            boxShadow: `0 0 20px ${baseColor}55`,
            pointerEvents: "none",
          }}
        />
      );
    case "cursor-highlight":
      return (
        <div
          key={`ann-${index}`}
          style={{
            position: "absolute",
            left: ann.position.x - 24,
            top: ann.position.y - 24,
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: `${baseColor}33`,
            border: `2px solid ${baseColor}`,
            opacity,
            pointerEvents: "none",
          }}
        />
      );
    case "callout":
      return (
        <div
          key={`ann-${index}`}
          style={{
            position: "absolute",
            left: ann.position.x,
            top: ann.position.y,
            backgroundColor: baseColor,
            color: "#FFFFFF",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 16,
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
            fontWeight: 600,
            opacity,
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
        >
          {ann.label ?? ""}
        </div>
      );
    case "arrow": {
      const arrowLength = 60;
      const headSize = 12;
      return (
        <svg
          key={`ann-${index}`}
          style={{
            position: "absolute",
            left: ann.position.x - arrowLength,
            top: ann.position.y - arrowLength,
            width: arrowLength + headSize,
            height: arrowLength + headSize,
            opacity,
            pointerEvents: "none",
            overflow: "visible",
          }}
        >
          <line
            x1={0}
            y1={0}
            x2={arrowLength}
            y2={arrowLength}
            stroke={baseColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <polygon
            points={`${arrowLength},${arrowLength} ${arrowLength - headSize},${arrowLength - headSize / 2} ${arrowLength - headSize / 2},${arrowLength - headSize}`}
            fill={baseColor}
          />
        </svg>
      );
    }
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
        direction={transition.wipeDirection ?? "left"}
        durationFrames={dur}
        startFrame={startFrame}
      />
    );
  }
  return (
    <TransitionFade
      type={transition.fadeType ?? "cross-dissolve"}
      durationFrames={dur}
      startFrame={startFrame}
    />
  );
}

// ─── Component ──────────────────────────────────────────────────────────────
export const Scene: React.FC<SceneProps> = ({
  videoSrc,
  imageSrc,
  audioSrc,
  audioVolume = 1,
  durationInFrames,
  overlays = [],
  annotations = [],
  transitionIn,
  transitionOut,
  playbackRate = 1,
  startFrom = 0,
  backgroundColor = "#0F0F0F",
  deviceFrame = false,
}) => {
  const frame = useCurrentFrame();

  // Device-frame inset for screen recordings
  const mediaStyle: React.CSSProperties = deviceFrame
    ? {
        width: "88%",
        height: "88%",
        objectFit: "contain",
        borderRadius: 12,
        boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
        margin: "auto",
      }
    : { width: "100%", height: "100%", objectFit: "cover" };

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* ── Background media ─────────────────────────────────────────── */}
      {videoSrc && (
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Video
            src={videoSrc}
            playbackRate={playbackRate}
            startFrom={Math.round(startFrom * config.fps)}
            style={mediaStyle}
          />
        </AbsoluteFill>
      )}

      {!videoSrc && imageSrc && (
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Img src={imageSrc} style={mediaStyle} />
        </AbsoluteFill>
      )}

      {audioSrc && <Audio src={audioSrc} volume={audioVolume} />}

      {/* ── Annotations ──────────────────────────────────────────────── */}
      <AbsoluteFill>
        {annotations.map((ann, idx) => renderAnnotation(ann, idx, frame))}
      </AbsoluteFill>

      {/* ── Overlays ─────────────────────────────────────────────────── */}
      {overlays.map((overlay, idx) => renderOverlay(overlay, idx))}

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
