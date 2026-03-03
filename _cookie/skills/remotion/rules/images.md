# Images

The `<Img>` component renders images with built-in `delayRender` support. For video thumbnails and background videos, use `<OffthreadVideo>`.

---

## Img Component

```tsx
import { Img, staticFile } from "remotion";

const MyComponent: React.FC = () => {
  return (
    <Img
      src={staticFile("images/hero.jpg")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};
```

### Img Props

The `<Img>` component accepts all standard HTML `<img>` attributes plus Remotion-specific behavior.

| Prop           | Type       | Description                                      |
|----------------|------------|--------------------------------------------------|
| `src`          | `string`   | Image URL or staticFile path                     |
| `style`        | `CSSProperties` | CSS styles                                  |
| `onError`      | `function` | Error handler                                    |
| `placeholder`  | `string`   | Data URL for placeholder while loading           |

### Key Behavior

- `<Img>` automatically calls `delayRender()` when mounted and `continueRender()` when the image loads.
- No need for manual `delayRender()` unless using a raw `<img>` element.
- If the image fails to load, the render will time out unless an `onError` handler calls `continueRender()`.

---

## delayRender for Custom Image Elements

When using raw `<img>` instead of `<Img>`, handle loading manually.

```tsx
import { delayRender, continueRender, staticFile } from "remotion";
import { useState, useCallback } from "react";

const CustomImage: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const [handle] = useState(() => delayRender(`Loading image: ${src}`));

  const handleLoad = useCallback(() => {
    continueRender(handle);
  }, [handle]);

  const handleError = useCallback(() => {
    console.error(`Failed to load image: ${src}`);
    continueRender(handle);
  }, [handle, src]);

  return (
    <img
      src={staticFile(src)}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};
```

---

## Responsive Sizing

### Cover (fill container, crop overflow)

```tsx
<Img
  src={staticFile("images/bg.jpg")}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  }}
/>
```

### Contain (fit within container, may letterbox)

```tsx
<Img
  src={staticFile("images/product.png")}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }}
/>
```

### Fixed Size with Centering

```tsx
import { AbsoluteFill } from "remotion";

<AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
  <Img
    src={staticFile("images/icon.png")}
    style={{ width: 200, height: 200 }}
  />
</AbsoluteFill>
```

### Percentage-Based Sizing

```tsx
import { useVideoConfig } from "remotion";

const ResponsiveImage: React.FC<{ src: string; widthPercent: number }> = ({
  src,
  widthPercent,
}) => {
  const { width, height } = useVideoConfig();
  const imgWidth = width * (widthPercent / 100);

  return (
    <Img
      src={staticFile(src)}
      style={{ width: imgWidth, objectFit: "contain" }}
    />
  );
};
```

---

## Image as Background

```tsx
import { AbsoluteFill, Img, staticFile } from "remotion";

const BackgroundImage: React.FC<{
  src: string;
  children: React.ReactNode;
  overlay?: string;
}> = ({ src, children, overlay = "rgba(0,0,0,0.4)" }) => {
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {/* Dark overlay for text readability */}
      <AbsoluteFill style={{ backgroundColor: overlay }} />
      {/* Content on top */}
      <AbsoluteFill>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
```

---

## Animated Images

### Fade In

```tsx
import { useCurrentFrame, interpolate, Img, staticFile, AbsoluteFill } from "remotion";

const FadeInImage: React.FC<{ src: string; delay?: number }> = ({
  src,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};
```

### Ken Burns Effect (Slow Zoom + Pan)

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile, AbsoluteFill } from "remotion";

const KenBurns: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.2], {
    extrapolateRight: "clamp",
  });

  const translateX = interpolate(frame, [0, durationInFrames], [0, -3], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${translateX}%)`,
        }}
      />
    </AbsoluteFill>
  );
};
```

---

## OffthreadVideo for Video Thumbnails

Extract a single frame from a video to use as a thumbnail.

```tsx
import { OffthreadVideo, staticFile } from "remotion";

const VideoThumbnail: React.FC<{ src: string; thumbnailFrame?: number }> = ({
  src,
  thumbnailFrame = 0,
}) => {
  return (
    <OffthreadVideo
      src={staticFile(src)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      startFrom={thumbnailFrame}
      endAt={thumbnailFrame + 1}
      muted
    />
  );
};
```

---

## Multiple Images in Grid

```tsx
import { Img, staticFile, AbsoluteFill } from "remotion";

const ImageGrid: React.FC<{ images: string[]; columns?: number }> = ({
  images,
  columns = 3,
}) => {
  const gap = 8;

  return (
    <AbsoluteFill
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        padding: 24,
      }}
    >
      {images.map((src, i) => (
        <Img
          key={i}
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
```

---

## COOKIE SSD Image Usage

```yaml
scenes:
  - id: scene-1
    background:
      type: "image"
      src: "images/backgrounds/gradient-blue.png"
      animation: "ken-burns"  # optional zoom effect
    text_overlays:
      - text: "Company Name"
        logo: "images/logos/company-logo.svg"
```

---

## Pitfalls

1. **Using `<img>` instead of `<Img>`.** Raw `<img>` elements do not call `delayRender()`. The render may capture a frame before the image loads, resulting in a blank or broken image.

2. **objectFit without explicit width/height.** `objectFit` only works when both width and height are set. Without them, the image renders at its natural size.

3. **SVG rendering inconsistencies.** Complex SVGs may render differently in the Chromium instance Remotion uses. Test SVGs in the preview first.

4. **Large images.** A 4000x3000 PNG is unnecessarily large for a 1920x1080 video. Resize images to match or slightly exceed the video dimensions before importing.

5. **Transparent PNGs and blend modes.** Transparent PNGs composited over video or gradients need `mix-blend-mode` or careful layering with `AbsoluteFill`.
