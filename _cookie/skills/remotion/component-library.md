# Component Library

COOKIE provides 7 custom Remotion components for common video production patterns. Each component maps to SSD configuration and renders synchronized to the video timeline.

---

## lower-third.tsx

Displays a name/title bar at the bottom of the screen, commonly used for speaker identification.

### Props Interface

```tsx
interface LowerThirdTiming {
  /** Frame at which the lower-third begins animating in */
  inFrame: number;
  /** Number of frames the lower-third stays fully visible */
  holdFrames: number;
  /** Frame at which the lower-third begins animating out */
  outFrame: number;
}

type LowerThirdAnimationType = "slide-in-left" | "fade-in" | "slide-up";

interface LowerThirdProps {
  name: string;
  title: string;
  position?: number;                        // pixels from bottom (default 80)
  animationType?: LowerThirdAnimationType;  // default "slide-in-left"
  timing: LowerThirdTiming;                 // required
  backgroundColor?: string;                 // default "rgba(0, 0, 0, 0.72)"
  nameColor?: string;                       // default "#FFFFFF"
  titleColor?: string;                      // default "rgba(255, 255, 255, 0.85)"
  animInDuration?: number;                  // frames, default 15
  animOutDuration?: number;                 // frames, default 12
}
```

### Usage

```tsx
import { Sequence } from "remotion";
import { LowerThird } from "./components/lower-third";

<Sequence from={0} durationInFrames={200}>
  <LowerThird
    name="Jane Smith"
    title="CEO, Acme Corp"
    animationType="slide-in-left"
    timing={{ inFrame: 30, holdFrames: 120, outFrame: 165 }}
    backgroundColor="rgba(0, 0, 0, 0.72)"
    nameColor="#FFFFFF"
    titleColor="rgba(255, 255, 255, 0.85)"
    animInDuration={15}
    animOutDuration={12}
    position={80}
  />
</Sequence>
```

### SSD Config Mapping

```yaml
text_overlays:
  - type: "lower-third"
    name: "Jane Smith"
    title: "CEO, Acme Corp"
    animation_type: "slide-in-left"
    timing:
      in_frame: 30
      hold_frames: 120
      out_frame: 165
    style:
      background_color: "rgba(0, 0, 0, 0.72)"
      name_color: "#FFFFFF"
      title_color: "rgba(255, 255, 255, 0.85)"
      position: 80
      anim_in_duration: 15
      anim_out_duration: 12
```

### Rendering Behavior

1. **slide-in-left**: The bar slides in from the left edge with a horizontal translate, the accent bar width animates from 0 to 4px.
2. **fade-in**: All elements fade in simultaneously via opacity.
3. **slide-up**: The entire lower third slides up from 120px below its resting position.
4. **Exit**: The component automatically animates out starting at `timing.outFrame` over `animOutDuration` frames, using the same animation in reverse.
5. The component returns `null` outside of its visible frame range (before `timing.inFrame` and after `timing.outFrame + animOutDuration`).

```tsx
// Internal rendering logic
const LowerThird: React.FC<LowerThirdProps> = ({
  name,
  title,
  position = 80,
  animationType = "slide-in-left",
  timing,
  backgroundColor = "rgba(0, 0, 0, 0.72)",
  nameColor = "#FFFFFF",
  titleColor = "rgba(255, 255, 255, 0.85)",
  animInDuration = 15,
  animOutDuration = 12,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const { inFrame, holdFrames, outFrame } = timing;

  const enterProgress = interpolate(
    frame, [inFrame, inFrame + animInDuration], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const exitProgress = interpolate(
    frame, [outFrame, outFrame + animOutDuration], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const visibility = Math.min(enterProgress, exitProgress);

  if (frame < inFrame || frame > outFrame + animOutDuration) return null;

  let transform = "";
  let opacity = visibility;

  switch (animationType) {
    case "slide-in-left":
      transform = `translateX(${interpolate(visibility, [0, 1], [-width * 0.5, 0])}px)`;
      break;
    case "slide-up":
      transform = `translateY(${interpolate(visibility, [0, 1], [120, 0])}px)`;
      break;
    case "fade-in":
    default:
      opacity = visibility;
      break;
  }

  // ...renders accent bar + text container at bottom: position
};
```

---

## title-card.tsx

Full-screen centered text for scene introductions, chapter titles, or ending screens.

### Props Interface

```tsx
type TitleCardAnimation = "fade-in" | "scale-up" | "typewriter";

interface TitleCardProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;          // default "#000000"
  textColor?: string;                // default "#FFFFFF"
  subtitleColor?: string;            // defaults to textColor at ~70% opacity
  animation?: TitleCardAnimation;    // default "fade-in"
  titleFontSize?: number;            // default 72
  subtitleFontSize?: number;         // default 32
  fontFamily?: string;               // default "Inter, Helvetica, Arial, sans-serif"
  startFrame?: number;               // default 0
  animationDuration?: number;        // frames, default 30
}
```

### Usage

```tsx
<Sequence from={0} durationInFrames={90}>
  <TitleCard
    title="Chapter One"
    subtitle="The Beginning"
    animation="scale-up"
    backgroundColor="#0F172A"
    textColor="#F8FAFC"
    subtitleColor="#CBD5E1"
    titleFontSize={96}
    subtitleFontSize={36}
    fontFamily="Inter"
    startFrame={0}
    animationDuration={30}
  />
</Sequence>
```

### SSD Config Mapping

```yaml
scenes:
  - id: title-scene
    type: "title-card"
    duration: 3.0
    title: "Chapter One"
    subtitle: "The Beginning"
    animation: "scale-up"
    start_frame: 0
    animation_duration: 30
    style:
      background_color: "#0F172A"
      text_color: "#F8FAFC"
      subtitle_color: "#CBD5E1"
      title_font_size: 96
      subtitle_font_size: 36
      font_family: "Inter"
```

### Rendering Behavior

1. **fade-in**: Title fades from opacity 0 to 1 over 60% of `animationDuration`. Subtitle fades in starting at 35% of `animationDuration`.
2. **scale-up**: Title scales from 0.6 to 1.0 using `spring()` with damping 12, stiffness 80, mass 0.6. Subtitle slides up from 20px below with its own spring, delayed by 8 frames.
3. **typewriter**: Characters appear one by one over `animationDuration` frames with a blinking cursor. Subtitle fades in over the 15 frames after the typewriter completes.
4. The component returns `null` if `frame < startFrame`.

```tsx
const TitleCard: React.FC<TitleCardProps> = ({
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

  const resolvedSubtitleColor = subtitleColor ?? `${textColor}B3`;

  const progress = interpolate(
    localFrame, [0, animationDuration], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Animation switch: fade-in, scale-up, typewriter
  // ...renders centered title + optional subtitle with fontWeight 700 (title) / 400 (subtitle)
};
```

---

## text-overlay.tsx

Positioned text with configurable animation, used for callouts, annotations, and on-screen labels.

### Props Interface

```tsx
type TextOverlayAnimation =
  | "fade-in"
  | "fade-in-up"
  | "slide-in-left"
  | "typewriter"
  | "bounce";

interface TextOverlayPosition {
  x: number;  // pixels from the left edge
  y: number;  // pixels from the top edge
}

interface TextOverlayTiming {
  inSeconds: number;   // time in seconds when the overlay appears
  outSeconds: number;  // time in seconds when the overlay disappears
}

interface TextOverlayProps {
  text: string;
  font?: string;                          // CSS font-family, default "Inter, Helvetica, Arial, sans-serif"
  size?: number;                          // font size in pixels, default 48
  color?: string;                         // default "#FFFFFF"
  position: TextOverlayPosition;          // required
  animation?: TextOverlayAnimation;       // default "fade-in"
  timing: TextOverlayTiming;              // required
  fontWeight?: number | string;           // default 600
  textShadow?: string;                    // default "0 2px 12px rgba(0,0,0,0.55)"
  animInFrames?: number;                  // frames, default 15
  animOutFrames?: number;                 // frames, default 10
}
```

### Usage

```tsx
<Sequence from={0} durationInFrames={300}>
  <TextOverlay
    text="Key Takeaway: Always validate your inputs"
    position={{ x: 100, y: 150 }}
    timing={{ inSeconds: 2.0, outSeconds: 6.0 }}
    animation="fade-in-up"
    size={42}
    font="Inter"
    color="#FFFFFF"
    fontWeight={600}
    textShadow="0 2px 12px rgba(0,0,0,0.55)"
    animInFrames={15}
    animOutFrames={10}
  />
</Sequence>
```

### SSD Config Mapping

```yaml
text_overlays:
  - type: "text-overlay"
    text: "Key Takeaway"
    position:
      x: 100
      y: 150
    timing:
      in_seconds: 2.0
      out_seconds: 6.0
    animation: "fade-in-up"
    style:
      font: "Inter"
      size: 42
      color: "#FFFFFF"
      font_weight: 600
      text_shadow: "0 2px 12px rgba(0,0,0,0.55)"
      anim_in_frames: 15
      anim_out_frames: 10
```

### Rendering Behavior

The component converts `timing.inSeconds` and `timing.outSeconds` to frame numbers using `fps`. It applies the selected entrance animation over `animInFrames` and the exit animation over `animOutFrames`. Position is set as absolute `left`/`top` pixel values. The component returns `null` outside its visible frame range.

Supported animations:
1. **fade-in**: Pure opacity fade.
2. **fade-in-up**: Fades in while translating from 40px below; exits by sliding 20px upward.
3. **slide-in-left**: Slides in from -300px left; exits by sliding 300px right.
4. **typewriter**: Characters appear one by one; exits via opacity fade.
5. **bounce**: Uses `spring()` (damping 8, stiffness 120, mass 0.5) for a bouncing scale entrance.

---

## caption-tiktok.tsx

Word-by-word highlighted captions in the TikTok/Reels style. The current word is enlarged and highlighted while surrounding words remain visible but subdued.

### Props Interface

```tsx
interface CaptionTikTokProps {
  /** Array of individual words to display */
  words: string[];
  /** Frame number at which each word becomes active (same length as words) */
  timing: number[];
  activeWordColor?: string;              // default "#FFDD00"
  inactiveWordColor?: string;            // default "#FFFFFF"
  fontSize?: number;                     // default 64
  fontFamily?: string;                   // default "Inter, Helvetica, Arial, sans-serif"
  activeWordWeight?: number | string;    // default 800
  inactiveWordWeight?: number | string;  // default 600
  maxWidthPercent?: number;              // default 85 (percentage of frame width)
  verticalPosition?: number;             // default 50 (percentage from top, 50 = centred)
  popEffect?: boolean;                   // default true — scale pop on active word
  showBackground?: boolean;              // default true — background pill behind text
  backgroundColor?: string;              // default "rgba(0, 0, 0, 0.50)"
}
```

### Usage

```tsx
<CaptionTikTok
  words={["This", "is", "amazing", "content"]}
  timing={[0, 9, 15, 30]}
  activeWordColor="#FFDD00"
  inactiveWordColor="#FFFFFF"
  fontSize={64}
  activeWordWeight={800}
  inactiveWordWeight={600}
  verticalPosition={50}
  popEffect={true}
  showBackground={true}
  backgroundColor="rgba(0, 0, 0, 0.50)"
/>
```

### SSD Config Mapping

```yaml
subtitles:
  enabled: true
  mode: "word-highlight"
  words: ["This", "is", "amazing", "content"]
  timing: [0, 9, 15, 30]
  style:
    active_word_color: "#FFDD00"
    inactive_word_color: "#FFFFFF"
    font_size: 64
    active_word_weight: 800
    inactive_word_weight: 600
    max_width_percent: 85
    vertical_position: 50
    pop_effect: true
    show_background: true
    background_color: "rgba(0, 0, 0, 0.50)"
```

### Rendering Behavior

1. Determines the active word index by comparing `useCurrentFrame()` against the `timing` array (frame numbers, not seconds).
2. All words are displayed simultaneously (no chunking) within a flex-wrap container constrained to `maxWidthPercent` of the frame width.
3. The active word is rendered with `activeWordColor` and `activeWordWeight`. If `popEffect` is true, a `spring()` animation (damping 10, stiffness 200, mass 0.4) scales the active word from 1.15x down to 1.0x.
4. Inactive words use `inactiveWordColor` and `inactiveWordWeight` at scale 1.
5. All words have a hardcoded text shadow (`0 2px 8px rgba(0,0,0,0.45)`) for readability.
6. If `showBackground` is true, a pill-shaped background with `backgroundColor` is rendered behind the text.
7. The component returns `null` if `timing` is empty or the current frame is before `timing[0]`.

---

## transition-fade.tsx

Fade transitions between scenes — fade-in, fade-out, cross-dissolve, fade-from-black, and fade-to-black.

### Props Interface

```tsx
type FadeTransitionType =
  | "fade-in"
  | "fade-out"
  | "cross-dissolve"
  | "fade-from-black"
  | "fade-to-black";

interface TransitionFadeProps {
  type?: FadeTransitionType;     // default "fade-in"
  durationFrames?: number;       // default 15
  startFrame?: number;           // default 0
  overlayColor?: string;         // default "#000000" — used for black/colour fades
}
```

### Usage

```tsx
// Fade from black at scene start
<Sequence from={0} durationInFrames={60}>
  <TransitionFade type="fade-from-black" durationFrames={15} startFrame={0} />
</Sequence>

// Fade to black at scene end
<Sequence from={270} durationInFrames={30}>
  <TransitionFade type="fade-to-black" durationFrames={15} startFrame={0} />
</Sequence>

// Cross-dissolve between scenes (overlap two sequences)
<Sequence from={85} durationInFrames={30}>
  <TransitionFade type="cross-dissolve" durationFrames={15} />
</Sequence>
```

### SSD Config Mapping

```yaml
scenes:
  - id: scene-1
    duration: 5.0
    transition:
      type: "fade"
      variant: "fade-to-black"
      duration_frames: 15
      start_frame: 0
      overlay_color: "#000000"
```

### Rendering Behavior

The transition uses a `localFrame = frame - startFrame` offset and only renders while the transition is active (`0 <= localFrame <= durationFrames`).

```tsx
const TransitionFade: React.FC<TransitionFadeProps> = ({
  type = "fade-in",
  durationFrames = 15,
  startFrame = 0,
  overlayColor = "#000000",
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > durationFrames) {
    // For fade-to-black / fade-out, the overlay persists after completion
    if ((type === "fade-to-black" || type === "fade-out") && localFrame > durationFrames) {
      return <AbsoluteFill style={{ backgroundColor: type === "fade-to-black" ? overlayColor : undefined, opacity: type === "fade-out" ? 0 : 1, pointerEvents: "none" }} />;
    }
    return null;
  }

  const progress = interpolate(localFrame, [0, durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // fade-in / fade-from-black: overlay opacity goes 1 → 0
  // fade-out / fade-to-black: overlay opacity goes 0 → 1
  // cross-dissolve: bell curve peaking at ~0.3 mid-way via Math.sin(progress * Math.PI) * 0.3
  return <AbsoluteFill style={{ backgroundColor: overlayColor, opacity, pointerEvents: "none" }} />;
};
```

---

## transition-wipe.tsx

Directional wipe transitions using CSS `clip-path` to reveal the next scene.

### Props Interface

```tsx
type WipeDirection = "left" | "right" | "up" | "down";

interface TransitionWipeProps {
  direction?: WipeDirection;   // default "left"
  durationFrames?: number;     // default 15
  startFrame?: number;         // default 0
  color?: string;              // overlay colour, default "#000000"
  feather?: number;            // soft edge width in percentage points (0 = hard edge), default 0
}
```

### Usage

```tsx
<Sequence from={85} durationInFrames={30}>
  <TransitionWipe direction="left" durationFrames={15} startFrame={0} feather={5} />
</Sequence>
```

### SSD Config Mapping

```yaml
scenes:
  - id: scene-1
    transition:
      type: "wipe"
      direction: "left"
      duration_frames: 15
      start_frame: 0
      color: "#000000"
      feather: 5
```

### Rendering Behavior

The wipe uses `clip-path: inset()` animated with `interpolate()` over `durationFrames`. A `localFrame = frame - startFrame` offset is used.

- Before the transition starts (`localFrame < 0`): the overlay is fully visible (covering content).
- After the transition completes (`localFrame > durationFrames`): the overlay is removed (`null`).
- When `feather > 0`, a `linear-gradient` mask is layered on top of the clip-path for a softer visual boundary.

```tsx
const TransitionWipe: React.FC<TransitionWipeProps> = ({
  direction = "left",
  durationFrames = 15,
  startFrame = 0,
  color = "#000000",
  feather = 0,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return <AbsoluteFill style={{ backgroundColor: color, pointerEvents: "none" }} />;
  if (localFrame > durationFrames) return null;

  const progress = interpolate(localFrame, [0, durationFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clipPath = buildClipPath(direction, progress);
  // Optional feather via linear-gradient maskImage

  return <AbsoluteFill style={{ backgroundColor: color, clipPath, WebkitClipPath: clipPath, pointerEvents: "none" }} />;
};
```

**Direction behaviors:**
- **left**: Overlay's left edge shrinks — wipe travels left, revealing content from the left.
- **right**: Overlay's right edge shrinks — wipe travels right, revealing content from the right.
- **up**: Overlay's top edge shrinks — wipe travels up, revealing content from the top.
- **down**: Overlay's bottom edge shrinks — wipe travels down, revealing content from the bottom.

---

## progress-bar.tsx

A horizontal progress bar showing the current position within the video. Commonly used for social media videos and tutorials.

### Props Interface

```tsx
type ProgressBarPosition = "top" | "bottom";

interface ProgressBarProps {
  color?: string;                 // bar colour, default "#E63946"
  height?: number;                // bar height in pixels, default 6
  position?: ProgressBarPosition; // default "bottom"
  showPercentage?: boolean;       // default false
  trackColor?: string;            // background of unfilled track, default "rgba(255, 255, 255, 0.15)"
  percentageFontSize?: number;    // default 14
  percentageColor?: string;       // default "#FFFFFF"
  fontFamily?: string;            // default "Inter, Helvetica, Arial, sans-serif"
  borderRadius?: number;          // default 0
  horizontalPadding?: number;     // pixels from frame edges (0 = full-bleed), default 0
}
```

### Usage

```tsx
// Overlay on entire composition — no Sequence needed
<ProgressBar
  color="#E63946"
  trackColor="rgba(255, 255, 255, 0.15)"
  height={6}
  position="bottom"
  borderRadius={0}
  horizontalPadding={0}
  showPercentage={false}
  fontFamily="Inter"
/>
```

### SSD Config Mapping

```yaml
progress_bar:
  enabled: true
  color: "#E63946"
  track_color: "rgba(255, 255, 255, 0.15)"
  height: 6
  position: "bottom"
  horizontal_padding: 0
  border_radius: 0
  show_percentage: false
  font_family: "Inter"
```

### Rendering Behavior

```tsx
const ProgressBar: React.FC<ProgressBarProps> = ({
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

  const progress = interpolate(
    frame, [0, durationInFrames - 1], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Renders a track bar (trackColor) with a filled bar (color) inside.
  // horizontalPadding sets left/right offset from frame edges.
  // If showPercentage, a label is displayed using fontFamily/percentageColor/percentageFontSize.
  // The percentage label has fontWeight 600 and textShadow "0 1px 4px rgba(0,0,0,0.6)".
};
```

The progress bar linearly fills from 0% to 100% across the entire composition duration using `interpolate()`. It renders as a thin bar at the top or bottom of the frame, suitable as a persistent overlay element that does not interfere with scene content.

---

## Component Summary

| Component            | File                   | Primary Use                      | SSD Type           |
|----------------------|------------------------|----------------------------------|--------------------|
| `LowerThird`         | `lower-third.tsx`      | Speaker identification           | `lower-third`      |
| `TitleCard`          | `title-card.tsx`       | Scene/chapter titles             | `title-card`       |
| `TextOverlay`        | `text-overlay.tsx`     | Callouts and annotations         | `text-overlay`     |
| `CaptionTikTok`      | `caption-tiktok.tsx`   | Word-highlighted captions        | `word-highlight`   |
| `TransitionFade`     | `transition-fade.tsx`  | Fade transitions                 | `fade`             |
| `TransitionWipe`     | `transition-wipe.tsx`  | Directional wipe transitions     | `wipe`             |
| `ProgressBar`        | `progress-bar.tsx`     | Video position indicator         | `progress_bar`     |

All components import from `remotion` core (not all components use every import):

```tsx
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";
```

---

## countdown.tsx

Countdown timer overlay that counts down from a starting number to an ending number, used for intros, event timers, or dramatic countdowns.

### Props Interface

```tsx
type CountdownPosition = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface CountdownTiming {
  /** Frame at which the countdown begins */
  startFrame: number;
  /** Number of frames each number stays visible */
  framesPerCount: number;
}

interface CountdownProps {
  startNumber: number;                    // required, e.g. 5
  endNumber?: number;                     // default 1
  fontSize?: number;                      // default 120
  color?: string;                         // default "#FFFFFF"
  position?: CountdownPosition;           // default "center"
  timing: CountdownTiming;                // required
  fontFamily?: string;                    // default "Inter, Helvetica, Arial, sans-serif"
  backgroundColor?: string;              // default "transparent"
  showCircle?: boolean;                   // default false — circular background behind number
  circleColor?: string;                   // default "rgba(0, 0, 0, 0.6)"
  animateEachNumber?: boolean;            // default true — scale-pop on each number change
}
```

### Usage

```tsx
<Sequence from={0} durationInFrames={150}>
  <Countdown
    startNumber={5}
    endNumber={1}
    fontSize={120}
    color="#FFFFFF"
    position="center"
    timing={{ startFrame: 0, framesPerCount: 30 }}
    showCircle={true}
    circleColor="rgba(0, 0, 0, 0.6)"
    animateEachNumber={true}
  />
</Sequence>
```

### SSD Config Mapping

```yaml
text_overlays:
  - type: "countdown"
    start_number: 5
    end_number: 1
    timing:
      start_frame: 0
      frames_per_count: 30
    style:
      font_size: 120
      color: "#FFFFFF"
      position: "center"
      font_family: "Inter"
      show_circle: true
      circle_color: "rgba(0, 0, 0, 0.6)"
      animate_each_number: true
```

### Rendering Behavior

1. The component calculates the current number: `currentNumber = startNumber - Math.floor((frame - startFrame) / framesPerCount)`.
2. When `animateEachNumber` is true, each number change triggers a `spring()` scale animation (damping 10, stiffness 150, mass 0.5) from 1.3x to 1.0x.
3. The component returns `null` before `timing.startFrame` and after all counts have elapsed.
4. Position mapping: `"center"` uses centered flex layout; corner positions use absolute positioning with 40px margins.
5. If `showCircle` is true, a circular div with `circleColor` background and diameter of `fontSize * 2` is rendered behind the number.

---

## logo-reveal.tsx

Animated brand logo reveal, used for intro/outro branding sequences.

### Props Interface

```tsx
type LogoRevealAnimation = "fade" | "scale" | "slide";

interface LogoRevealProps {
  logoSrc: string;                         // required — path or URL to logo image
  animationType?: LogoRevealAnimation;     // default "fade"
  duration?: number;                       // frames for the reveal animation, default 30
  position?: { x: number; y: number };     // default centered
  logoWidth?: number;                      // pixels, default 200
  logoHeight?: number;                     // pixels, default auto (maintain aspect ratio)
  startFrame?: number;                     // default 0
  holdFrames?: number;                     // frames to hold after reveal, default 60
  backgroundColor?: string;               // default "transparent"
}
```

### Usage

```tsx
<Sequence from={0} durationInFrames={120}>
  <LogoReveal
    logoSrc="/assets/brand-logo.png"
    animationType="scale"
    duration={30}
    logoWidth={250}
    startFrame={0}
    holdFrames={60}
    backgroundColor="#000000"
  />
</Sequence>
```

### SSD Config Mapping

```yaml
scenes:
  - id: logo-intro
    type: "logo-reveal"
    logo_src: "/assets/brand-logo.png"
    animation_type: "scale"
    duration: 30
    start_frame: 0
    hold_frames: 60
    style:
      logo_width: 250
      background_color: "#000000"
```

### Rendering Behavior

1. **fade**: Logo fades from opacity 0 to 1 over `duration` frames using `interpolate()`.
2. **scale**: Logo scales from 0.0 to 1.0 using `spring()` (damping 12, stiffness 80, mass 0.8) for a natural bounce-settle effect.
3. **slide**: Logo slides in from 100% below the viewport using `interpolate()` with easing, settling at its final position.
4. The logo holds fully visible for `holdFrames` after the animation completes.
5. The component renders the logo as an `<Img>` element (from `remotion`) centered in an `<AbsoluteFill>` unless a custom `position` is provided.
6. Returns `null` before `startFrame`.

---

## split-screen.tsx

Side-by-side video or image comparison layout, used for before/after reveals, A/B comparisons, or dual-perspective scenes.

### Props Interface

```tsx
interface SplitScreenProps {
  leftSrc: string;                         // required — video or image source for left panel
  rightSrc: string;                        // required — video or image source for right panel
  dividerColor?: string;                   // default "#FFFFFF"
  dividerWidth?: number;                   // pixels, default 4
  labelLeft?: string;                      // optional label for left panel
  labelRight?: string;                     // optional label for right panel
  labelFontSize?: number;                  // default 24
  labelColor?: string;                     // default "#FFFFFF"
  labelBackgroundColor?: string;           // default "rgba(0, 0, 0, 0.6)"
  labelPosition?: "top" | "bottom";        // default "bottom"
  animateDivider?: boolean;                // default false — animate divider sliding in from center
  animationDuration?: number;              // frames, default 20
  startFrame?: number;                     // default 0
}
```

### Usage

```tsx
<Sequence from={0} durationInFrames={150}>
  <SplitScreen
    leftSrc="/media/before.mp4"
    rightSrc="/media/after.mp4"
    dividerColor="#FFFFFF"
    dividerWidth={4}
    labelLeft="Before"
    labelRight="After"
    labelPosition="bottom"
    animateDivider={true}
    animationDuration={20}
  />
</Sequence>
```

### SSD Config Mapping

```yaml
scenes:
  - id: comparison
    type: "split-screen"
    left_src: "/media/before.mp4"
    right_src: "/media/after.mp4"
    start_frame: 0
    style:
      divider_color: "#FFFFFF"
      divider_width: 4
      label_left: "Before"
      label_right: "After"
      label_font_size: 24
      label_color: "#FFFFFF"
      label_background_color: "rgba(0, 0, 0, 0.6)"
      label_position: "bottom"
      animate_divider: true
      animation_duration: 20
```

### Rendering Behavior

1. The component renders two `<AbsoluteFill>` containers, each clipped to 50% width via `clip-path: inset()`.
2. Video sources are rendered using `<OffthreadVideo>` from remotion; image sources use `<Img>`.
3. A vertical divider bar is rendered between the panels at the exact midpoint.
4. When `animateDivider` is true, the divider and clip boundaries animate from 50%/50% (both panels hidden) to the final split position using `interpolate()` over `animationDuration` frames.
5. Labels are positioned within each panel at the `labelPosition` edge with padding, rendered with `labelBackgroundColor` as a pill-shaped background.
6. Returns `null` before `startFrame`.

---

## callout-box.tsx

Highlighted callout overlay with icon and text, used for tips, warnings, key facts, or emphasis boxes.

### Props Interface

```tsx
type CalloutPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
type CalloutIcon = "info" | "warning" | "tip" | "star" | "check" | "none";

interface CalloutBoxTiming {
  inFrame: number;
  holdFrames: number;
  outFrame: number;
}

interface CalloutBoxProps {
  text: string;                              // required
  icon?: CalloutIcon;                        // default "info"
  backgroundColor?: string;                  // default "rgba(0, 0, 0, 0.85)"
  borderColor?: string;                      // default "#3B82F6"
  textColor?: string;                        // default "#FFFFFF"
  position?: CalloutPosition;                // default "bottom-right"
  timing: CalloutBoxTiming;                  // required
  fontSize?: number;                         // default 28
  maxWidth?: number;                         // pixels, default 500
  borderRadius?: number;                     // default 12
  fontFamily?: string;                       // default "Inter, Helvetica, Arial, sans-serif"
  animInDuration?: number;                   // frames, default 12
  animOutDuration?: number;                  // frames, default 10
}
```

### Usage

```tsx
<Sequence from={0} durationInFrames={200}>
  <CalloutBox
    text="Pro tip: Always render a test frame before full export"
    icon="tip"
    backgroundColor="rgba(0, 0, 0, 0.85)"
    borderColor="#10B981"
    textColor="#FFFFFF"
    position="bottom-right"
    timing={{ inFrame: 30, holdFrames: 90, outFrame: 130 }}
    fontSize={28}
    maxWidth={500}
    borderRadius={12}
  />
</Sequence>
```

### SSD Config Mapping

```yaml
text_overlays:
  - type: "callout-box"
    text: "Pro tip: Always render a test frame before full export"
    icon: "tip"
    timing:
      in_frame: 30
      hold_frames: 90
      out_frame: 130
    style:
      background_color: "rgba(0, 0, 0, 0.85)"
      border_color: "#10B981"
      text_color: "#FFFFFF"
      position: "bottom-right"
      font_size: 28
      max_width: 500
      border_radius: 12
      anim_in_duration: 12
      anim_out_duration: 10
```

### Rendering Behavior

1. The callout box slides in from the nearest edge based on `position` using `interpolate()` over `animInDuration` frames.
2. Icons are rendered as inline SVGs (built-in icon set: info circle, warning triangle, lightbulb tip, star, checkmark). When `icon` is `"none"`, no icon is rendered.
3. The box has a left border accent using `borderColor` at 4px width, with `backgroundColor` fill and `borderRadius` corners.
4. Text is rendered with `fontFamily`, `fontSize`, and `textColor`, constrained to `maxWidth`.
5. Exit animation reverses the entrance slide over `animOutDuration` frames starting at `timing.outFrame`.
6. Returns `null` before `timing.inFrame` and after `timing.outFrame + animOutDuration`.

---

## scene-number.tsx

Scene or chapter number indicator overlay, used to mark sections of a video with a number and optional label.

### Props Interface

```tsx
type SceneNumberStyle = "minimal" | "badge" | "cinematic";
type SceneNumberPosition = "top-left" | "top-right" | "top-center";

interface SceneNumberTiming {
  inFrame: number;
  holdFrames: number;
  outFrame: number;
}

interface SceneNumberProps {
  number: number;                            // required, e.g. 1, 2, 3
  label?: string;                            // optional, e.g. "Introduction", "The Reveal"
  position?: SceneNumberPosition;            // default "top-left"
  style?: SceneNumberStyle;                  // default "minimal"
  timing: SceneNumberTiming;                 // required
  fontSize?: number;                         // default 36 (for the number)
  labelFontSize?: number;                    // default 20
  color?: string;                            // default "#FFFFFF"
  backgroundColor?: string;                  // default "transparent" for minimal, "rgba(0,0,0,0.7)" for badge
  fontFamily?: string;                       // default "Inter, Helvetica, Arial, sans-serif"
  animInDuration?: number;                   // frames, default 12
  animOutDuration?: number;                  // frames, default 10
}
```

### Usage

```tsx
<Sequence from={0} durationInFrames={200}>
  <SceneNumber
    number={3}
    label="The Reveal"
    position="top-left"
    style="cinematic"
    timing={{ inFrame: 0, holdFrames: 60, outFrame: 70 }}
    fontSize={36}
    labelFontSize={20}
    color="#FFFFFF"
  />
</Sequence>
```

### SSD Config Mapping

```yaml
text_overlays:
  - type: "scene-number"
    number: 3
    label: "The Reveal"
    timing:
      in_frame: 0
      hold_frames: 60
      out_frame: 70
    style:
      position: "top-left"
      variant: "cinematic"
      font_size: 36
      label_font_size: 20
      color: "#FFFFFF"
      anim_in_duration: 12
      anim_out_duration: 10
```

### Rendering Behavior

1. **minimal**: Renders the number and label as plain text with a subtle text shadow. Number uses `fontSize` at weight 700; label uses `labelFontSize` at weight 400.
2. **badge**: Renders the number inside a rounded rectangle with `backgroundColor`. Label appears to the right of the badge.
3. **cinematic**: Renders "SCENE" in small caps above the number, with a horizontal rule between. Uses letter-spacing 4px on "SCENE" and the label. Number is rendered at 1.5x `fontSize`.
4. Entrance animation: fade-in with a slight downward slide (10px) using `interpolate()` over `animInDuration` frames.
5. Exit animation: fade-out with a slight upward slide over `animOutDuration` frames starting at `timing.outFrame`.
6. Returns `null` before `timing.inFrame` and after `timing.outFrame + animOutDuration`.

---

## Updated Component Summary

| Component            | File                   | Primary Use                      | SSD Type           |
|----------------------|------------------------|----------------------------------|--------------------|
| `LowerThird`         | `lower-third.tsx`      | Speaker identification           | `lower-third`      |
| `TitleCard`          | `title-card.tsx`       | Scene/chapter titles             | `title-card`       |
| `TextOverlay`        | `text-overlay.tsx`     | Callouts and annotations         | `text-overlay`     |
| `CaptionTikTok`      | `caption-tiktok.tsx`   | Word-highlighted captions        | `word-highlight`   |
| `TransitionFade`     | `transition-fade.tsx`  | Fade transitions                 | `fade`             |
| `TransitionWipe`     | `transition-wipe.tsx`  | Directional wipe transitions     | `wipe`             |
| `ProgressBar`        | `progress-bar.tsx`     | Video position indicator         | `progress_bar`     |
| `Countdown`          | `countdown.tsx`        | Countdown timer overlay          | `countdown`        |
| `LogoReveal`         | `logo-reveal.tsx`      | Animated brand logo reveal       | `logo-reveal`      |
| `SplitScreen`        | `split-screen.tsx`     | Side-by-side comparison          | `split-screen`     |
| `CalloutBox`         | `callout-box.tsx`      | Highlighted callout with icon    | `callout-box`      |
| `SceneNumber`        | `scene-number.tsx`     | Scene/chapter number indicator   | `scene-number`     |

---

## Testing Documentation

### Props Table Verification

Every component must have its props table verified against the actual TypeScript interface before use in production:

- Confirm all required props are listed and marked as required.
- Confirm all optional props have documented default values.
- Confirm type unions (e.g., animation types, position types) list every valid option.
- Confirm numeric props specify their unit (pixels, frames, percentage, seconds).
- Verify that SSD config keys map 1:1 to component props (snake_case in YAML to camelCase in TSX).

### Resolution Testing Checklist

Test every component at each target resolution to verify layout and readability:

| Resolution | Width | Height | Aspect Ratio | Check |
|------------|-------|--------|--------------|-------|
| 720p       | 1280  | 720    | 16:9         | Text legible, no clipping, positions proportional |
| 1080p      | 1920  | 1080   | 16:9         | Primary target — all elements pixel-accurate |
| 4K         | 3840  | 2160   | 16:9         | Font sizes scale correctly, no sub-pixel artifacts |

### Aspect Ratio Testing

Test components across all supported aspect ratios:

| Aspect Ratio | Use Case | Key Checks |
|--------------|----------|------------|
| 16:9         | YouTube, standard video | Default layout — baseline for all testing |
| 9:16         | TikTok, Reels, Shorts | Verify text does not overflow narrow width; positions adapt; lower-thirds remain visible |
| 1:1          | Instagram feed, social posts | Centered elements remain centered; corner-positioned elements have adequate margin |

For each component, verify:
- Text overlays do not extend beyond frame boundaries.
- Position props (pixel values) remain valid or adapt to frame dimensions.
- `maxWidthPercent`-style props produce appropriate results in narrow formats.

### Animation Smoothness at 30fps

All animations must appear smooth at 30fps (the standard Cookie pipeline frame rate):

- `spring()` animations: Verify damping/stiffness/mass values produce settlement within the expected frame count. Overdamped springs may appear sluggish at 30fps.
- `interpolate()` animations: Ensure the frame range is at least 8-10 frames for perceptible motion. Animations under 5 frames may appear as a jump rather than a transition.
- Typewriter effects: At 30fps with short text, each character may appear every 1-2 frames. Verify this reads as intentional typing, not flickering.
- Pop/scale effects: The `spring()` overshoot should resolve within 10-15 frames at 30fps. Test that the settled scale is exactly 1.0 (no residual micro-oscillation).

### Text Readability Testing

- Minimum font size for narration-supporting text: 24px at 1080p (scales proportionally at other resolutions).
- Minimum font size for decorative/secondary text: 16px at 1080p.
- Text over video must use `textShadow` or a background pill for contrast.
- Test with both light and dark video backgrounds — white text on bright backgrounds is unreadable without shadow.
- Verify font loading: if a custom `fontFamily` is specified, confirm it is bundled with the Remotion project. Missing fonts fall back to system sans-serif, which may break design intent.

### Edge Case Testing

| Edge Case | What to Test | Expected Behavior |
|-----------|-------------|-------------------|
| Very long text | 200+ character string in `TextOverlay`, `CalloutBox` | Text wraps within `maxWidth`; no overflow beyond frame |
| Very short duration | `durationInFrames` < animation in + out frames | Animation truncates gracefully; no visual glitch |
| Extreme positions | `position.x` or `position.y` near frame edges | Component clips to frame boundary; no scrollbar artifacts |
| Zero-length arrays | Empty `words` array in `CaptionTikTok` | Component returns `null`; no runtime error |
| Missing optional props | All optional props omitted | Defaults produce a reasonable, visible result |
| Overlapping overlays | Multiple text overlays visible simultaneously | Z-index ordering is deterministic; no flickering |
| Single frame duration | `holdFrames: 1` or `durationFrames: 1` | Component renders for exactly one frame; no off-by-one |

---

## Performance Considerations

### Avoid Expensive Per-Frame Operations

Remotion re-renders every component on every frame. Operations that are acceptable in interactive React apps become bottlenecks when executed 30 times per second across thousands of frames:

- **Do not** create new objects, arrays, or functions inside the render body. Allocate them outside the component or use `useMemo()`.
- **Do not** perform string manipulation (regex, split/join, template literals) on every frame if the input has not changed.
- **Do not** read from `useVideoConfig()` and immediately derive complex values without memoization.

### Memoize Calculations

```tsx
// BAD: recalculates on every frame
const TransitionFade: React.FC<Props> = ({ words, timing }) => {
  const activeIndex = timing.findIndex((t, i) =>
    frame >= t && (i === timing.length - 1 || frame < timing[i + 1])
  );
  // ...
};

// GOOD: memoize when inputs are stable
const TransitionFade: React.FC<Props> = ({ words, timing }) => {
  const timingMap = useMemo(() => {
    return timing.map((t, i) => ({
      start: t,
      end: i < timing.length - 1 ? timing[i + 1] : Infinity,
    }));
  }, [timing]);
  // ...
};
```

### Use interpolate() for Smooth Values

Always use Remotion's `interpolate()` for frame-based value transitions instead of manual math:

```tsx
// BAD: manual division, no clamping
const opacity = (frame - startFrame) / durationFrames;

// GOOD: clamped interpolation
const opacity = interpolate(
  frame,
  [startFrame, startFrame + durationFrames],
  [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
```

### Additional Performance Rules

- Use `spring()` for organic motion but cache the config object — do not create `{ damping, stiffness, mass }` inline on every frame.
- Prefer CSS transforms (`transform: scale/translate`) over layout properties (`width`, `height`, `top`, `left`) for animations. Transforms are GPU-accelerated and do not trigger layout recalculation.
- For components with complex children (e.g., `SplitScreen` with two video sources), use `React.memo()` on child sub-components to prevent unnecessary re-renders.
- When using `<OffthreadVideo>`, do not wrap it in additional animated containers that change `transform` every frame — this forces video frame re-compositing.
