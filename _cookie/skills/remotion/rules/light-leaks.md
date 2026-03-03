# Light Leaks

Light leak overlays add cinematic warmth and film grain effects to videos. They are composited using CSS blend modes and opacity animation.

---

## What Are Light Leaks

Light leaks are accidental or intentional overexposure effects that create warm, organic color bleeds — commonly seen in analog film. In digital video, they are applied as overlay layers with blend modes.

---

## Basic Light Leak Overlay

Use a light leak video or image as an overlay with `mix-blend-mode`.

```tsx
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate } from "remotion";

export const LightLeakOverlay: React.FC<{
  src: string;
  blendMode?: string;
  opacity?: number;
}> = ({
  src,
  blendMode = "screen",
  opacity = 0.5,
}) => {
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: blendMode as any,
        opacity,
      }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        muted
      />
    </AbsoluteFill>
  );
};
```

### Usage

```tsx
import { AbsoluteFill } from "remotion";

const MyScene: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Main video content */}
      <MainContent />

      {/* Light leak on top */}
      <LightLeakOverlay
        src="images/overlays/light-leak-01.mp4"
        blendMode="screen"
        opacity={0.4}
      />
    </AbsoluteFill>
  );
};
```

---

## Blend Modes

CSS `mix-blend-mode` determines how the overlay composites with the content below.

| Blend Mode   | Effect                                    | Best For             |
|--------------|-------------------------------------------|----------------------|
| `screen`     | Lightens, ignores dark areas              | Light leaks          |
| `overlay`    | Contrast boost, preserves midtones        | Color grading        |
| `soft-light` | Subtle contrast, gentle color shift       | Film grain           |
| `multiply`   | Darkens, ignores light areas              | Shadows, vignettes   |
| `color-dodge`| Intense highlights, blown-out look        | Strong light effects |
| `lighten`    | Keeps brighter pixel from each layer      | Subtle highlights    |
| `hard-light` | Intense contrast                          | Dramatic effects     |
| `add`        | Additive blend (via SVG filter)           | Glows, flares        |

### Screen (Most Common for Light Leaks)

```tsx
<AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.5 }}>
  <OffthreadVideo src={staticFile("overlays/warm-leak.mp4")} muted style={coverStyle} />
</AbsoluteFill>
```

---

## Animated Light Leak

Fade the light leak in and out for a natural appearance.

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

export const AnimatedLightLeak: React.FC<{
  src: string;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  holdOpacity?: number;
  blendMode?: string;
}> = ({
  src,
  fadeInFrames = 20,
  fadeOutFrames = 20,
  holdOpacity = 0.5,
  blendMode = "screen",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, fadeInFrames, durationInFrames - fadeOutFrames, durationInFrames],
    [0, holdOpacity, holdOpacity, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ mixBlendMode: blendMode as any, opacity }}>
      <OffthreadVideo src={staticFile(src)} muted style={coverStyle} />
    </AbsoluteFill>
  );
};

const coverStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
```

---

## Film Grain Effect

Apply a subtle noise texture for analog film feel.

```tsx
import { useCurrentFrame, AbsoluteFill } from "remotion";

export const FilmGrain: React.FC<{
  opacity?: number;
  intensity?: number;
}> = ({ opacity = 0.08, intensity = 50 }) => {
  const frame = useCurrentFrame();

  // Pseudo-random seed per frame for varying grain
  const seed = frame * 12345;

  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "overlay",
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${intensity / 100}'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
      }}
    />
  );
};
```

### CSS Filter-Based Grain Alternative

```tsx
export const CSSFilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.1 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "soft-light",
        opacity,
        background: `repeating-conic-gradient(
          rgba(255,255,255,0.1) 0%,
          transparent 0.5%,
          transparent 1%
        )`,
        backgroundSize: "4px 4px",
        backgroundPosition: `${frame % 4}px ${(frame * 3) % 4}px`,
      }}
    />
  );
};
```

---

## Vignette Effect

Darkened corners for a cinematic look.

```tsx
import { AbsoluteFill } from "remotion";

export const Vignette: React.FC<{
  intensity?: number;
  radius?: number;
}> = ({ intensity = 0.6, radius = 70 }) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(
          ellipse at center,
          transparent ${radius}%,
          rgba(0, 0, 0, ${intensity}) 100%
        )`,
        pointerEvents: "none",
      }}
    />
  );
};
```

---

## Color Grading Overlay

Apply a color wash to shift the mood.

```tsx
import { AbsoluteFill } from "remotion";

export const ColorGrade: React.FC<{
  color: string;
  opacity?: number;
  blendMode?: string;
}> = ({ color, opacity = 0.15, blendMode = "overlay" }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        mixBlendMode: blendMode as any,
        opacity,
      }}
    />
  );
};

// Warm look
<ColorGrade color="#FF8C00" opacity={0.1} blendMode="soft-light" />

// Cool / teal look
<ColorGrade color="#008B8B" opacity={0.12} blendMode="overlay" />

// Cinematic orange-teal
<>
  <ColorGrade color="#FF6B35" opacity={0.08} blendMode="soft-light" />
  <ColorGrade color="#004E64" opacity={0.06} blendMode="multiply" />
</>
```

---

## Compositing Stack

Layer multiple effects for a rich cinematic look.

```tsx
const CinematicScene: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 1. Main content */}
      <MainContent />

      {/* 2. Color grade */}
      <ColorGrade color="#FF8C00" opacity={0.08} blendMode="soft-light" />

      {/* 3. Light leak */}
      <AnimatedLightLeak src="overlays/warm-leak.mp4" holdOpacity={0.35} />

      {/* 4. Film grain */}
      <FilmGrain opacity={0.06} />

      {/* 5. Vignette */}
      <Vignette intensity={0.5} radius={65} />
    </AbsoluteFill>
  );
};
```

---

## COOKIE SSD Integration

```yaml
post_effects:
  light_leak:
    src: "images/overlays/light-leak-warm.mp4"
    blend_mode: "screen"
    opacity: 0.4
  film_grain:
    enabled: true
    opacity: 0.06
  vignette:
    enabled: true
    intensity: 0.5
  color_grade:
    color: "#FF8C00"
    blend_mode: "soft-light"
    opacity: 0.08
```

---

## Pitfalls

1. **Layer order matters.** Blend modes composite with everything below. Place overlays after the main content in JSX order.

2. **mix-blend-mode on transparent backgrounds.** Blend modes need non-transparent content below to produce visible effects. A `screen` blend over transparent produces nothing.

3. **Performance with video overlays.** Light leak videos add decoding overhead. Use short, looping clips (5-10 seconds). Set `loop` if available or use a Sequence that repeats.

4. **Film grain flicker.** If the grain pattern changes too rapidly, it appears as distracting noise. Use subtle opacity (0.04-0.10) and soft-light blend mode.

5. **Over-processing.** Stacking too many effects (grain + leak + vignette + color grade) at high opacity makes the video look muddy. Keep individual effect opacities low and review the composite result.
