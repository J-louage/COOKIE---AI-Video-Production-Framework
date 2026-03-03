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
import { CaptionTikTok, CaptionTikTokProps } from "../components/caption-tiktok";
import config from "./config";

// ─── Overlay union ──────────────────────────────────────────────────────────
export type SceneOverlay =
  | { kind: "lower-third"; props: LowerThirdProps }
  | { kind: "title-card"; props: TitleCardProps }
  | { kind: "text-overlay"; props: TextOverlayProps }
  | { kind: "caption"; props: CaptionTikTokProps };

// ─── Transition descriptor ─────────────────────────────────────────────────
export interface SceneTransition {
  type: "fade" | "wipe";
  fadeType?: FadeTransitionType;
  wipeDirection?: WipeDirection;
  durationFrames?: number;
}

// ─── Scene props ────────────────────────────────────────────────────────────
export interface SceneProps {
  /** Background video source */
  videoSrc?: string;
  /** Fallback static image */
  imageSrc?: string;
  /** Scene-level audio source (e.g. voice-over segment) */
  audioSrc?: string;
  audioVolume?: number;
  /** Duration of this scene in frames */
  durationInFrames: number;
  /** Overlays rendered on top of the video */
  overlays?: SceneOverlay[];
  /** Always-on subtitle track (word-by-word TikTok-style captions) */
  subtitles?: CaptionTikTokProps;
  transitionIn?: SceneTransition;
  transitionOut?: SceneTransition;
  playbackRate?: number;
  startFrom?: number;
  backgroundColor?: string;
  /**
   * Optional split layout: shows a graphic/image on one side and text on
   * the other. Common in explainer videos.
   */
  splitLayout?: "left-graphic" | "right-graphic" | "none";
  /** Source for the split-panel graphic/image */
  splitGraphicSrc?: string;
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
  subtitles,
  transitionIn,
  transitionOut,
  playbackRate = 1,
  startFrom = 0,
  backgroundColor = "#111827",
  splitLayout = "none",
  splitGraphicSrc,
}) => {
  const isSplit = splitLayout !== "none" && splitGraphicSrc;

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* ── Full-frame media (non-split) ─────────────────────────────── */}
      {!isSplit && videoSrc && (
        <AbsoluteFill>
          <Video
            src={videoSrc}
            playbackRate={playbackRate}
            startFrom={Math.round(startFrom * config.fps)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {!isSplit && !videoSrc && imageSrc && (
        <AbsoluteFill>
          <Img
            src={imageSrc}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {/* ── Split layout ─────────────────────────────────────────────── */}
      {isSplit && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection:
              splitLayout === "left-graphic" ? "row" : "row-reverse",
          }}
        >
          {/* Graphic panel */}
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Img
              src={splitGraphicSrc!}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Content panel (overlays render here via AbsoluteFill) */}
          <div
            style={{
              width: "50%",
              height: "100%",
              position: "relative",
            }}
          />
        </AbsoluteFill>
      )}

      {audioSrc && <Audio src={audioSrc} volume={audioVolume} />}

      {/* ── Overlays ─────────────────────────────────────────────────── */}
      {overlays.map((overlay, idx) => renderOverlay(overlay, idx))}

      {/* ── Always-on subtitles ──────────────────────────────────────── */}
      {subtitles && <CaptionTikTok {...subtitles} />}

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
