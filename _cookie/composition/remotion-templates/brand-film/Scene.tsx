import React from "react";
import {
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
import config from "./config";

// ─── Overlay union ──────────────────────────────────────────────────────────
export type SceneOverlay =
  | { kind: "lower-third"; props: LowerThirdProps }
  | { kind: "title-card"; props: TitleCardProps }
  | { kind: "text-overlay"; props: TextOverlayProps };

// ─── Transition descriptor ─────────────────────────────────────────────────
export interface SceneTransition {
  type: "fade" | "wipe";
  /** Fade sub-type (only when type = "fade") */
  fadeType?: FadeTransitionType;
  /** Wipe direction (only when type = "wipe") */
  wipeDirection?: WipeDirection;
  /** Duration in frames */
  durationFrames?: number;
}

// ─── Scene props ────────────────────────────────────────────────────────────
export interface SceneProps {
  /** URL or local path of the background video clip */
  videoSrc?: string;
  /** Fallback: static image source if no video is provided */
  imageSrc?: string;
  /** Optional background audio source (layered on top of the global music track) */
  audioSrc?: string;
  /** Volume of the scene-specific audio (0-1) */
  audioVolume?: number;
  /** Duration of this scene in frames */
  durationInFrames: number;
  /** Overlays rendered on top of the video */
  overlays?: SceneOverlay[];
  /** Entrance transition applied at the beginning of the scene */
  transitionIn?: SceneTransition;
  /** Exit transition applied at the end of the scene */
  transitionOut?: SceneTransition;
  /** Playback rate of the background video (1 = normal, <1 = slow-motion) */
  playbackRate?: number;
  /** Start time offset within the source video in seconds */
  startFrom?: number;
  /** Background colour shown when neither video nor image is provided */
  backgroundColor?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function renderOverlay(overlay: SceneOverlay, index: number): React.ReactNode {
  switch (overlay.kind) {
    case "lower-third":
      return <LowerThird key={`overlay-lt-${index}`} {...overlay.props} />;
    case "title-card":
      return <TitleCard key={`overlay-tc-${index}`} {...overlay.props} />;
    case "text-overlay":
      return <TextOverlay key={`overlay-to-${index}`} {...overlay.props} />;
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
  transitionIn,
  transitionOut,
  playbackRate = 1,
  startFrom = 0,
  backgroundColor = "#000000",
}) => {
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

      {/* ── Scene-level audio ────────────────────────────────────────── */}
      {audioSrc && <Audio src={audioSrc} volume={audioVolume} />}

      {/* ── Overlays ─────────────────────────────────────────────────── */}
      {overlays.map((overlay, idx) => renderOverlay(overlay, idx))}

      {/* ── Entrance transition ──────────────────────────────────────── */}
      {transitionIn && renderTransition(transitionIn, 0)}

      {/* ── Exit transition ──────────────────────────────────────────── */}
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
