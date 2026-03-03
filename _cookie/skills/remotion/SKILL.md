# Remotion Skill

Remotion is a framework for creating videos programmatically using React. This skill covers project setup, composition structure, animation, rendering, and integration with COOKIE's Scene Structure Document (SSD) format.

---

## Project Setup

### Create a New Project

```bash
npx create-video@latest my-video
cd my-video
npm install
```

### Project Structure

```
my-video/
  src/
    Root.tsx              # Root component registering all compositions
    MyComposition.tsx     # Individual composition components
  public/
    fonts/                # Local font files
    audio/                # Music, SFX, narration files
    images/               # Static images
    video/                # Video clips
  remotion.config.ts      # Remotion configuration
  package.json
```

### Configuration — remotion.config.ts

```ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
```

Common settings:

| Method                        | Description                    | Default   |
|-------------------------------|--------------------------------|-----------|
| `setVideoImageFormat()`       | `"jpeg"` or `"png"`           | `"jpeg"`  |
| `setOverwriteOutput()`        | Overwrite existing output      | `false`   |
| `setConcurrency()`            | Parallel render threads        | `null`    |
| `setCodec()`                  | `"h264"`, `"h265"`, `"vp8"`   | `"h264"`  |
| `setPixelFormat()`            | Pixel format                   | `"yuv420p"`|

---

## Composition Structure

### Root Component

The Root component registers all compositions. It is the entry point for Remotion.

```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={30 * 60} // 60 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Hello World",
        }}
      />
    </>
  );
};
```

### Composition Component

Each `<Composition>` defines a renderable video with fixed dimensions, fps, and duration.

```tsx
import { Composition } from "remotion";
```

Key props:

| Prop               | Type       | Description                          |
|--------------------|------------|--------------------------------------|
| `id`               | `string`   | Unique identifier for rendering      |
| `component`        | `React.FC` | The React component to render        |
| `durationInFrames` | `number`   | Total frames (seconds x fps)         |
| `fps`              | `number`   | Frames per second (24, 25, 30, 60)   |
| `width`            | `number`   | Video width in pixels                |
| `height`           | `number`   | Video height in pixels               |
| `defaultProps`     | `object`   | Default props passed to component    |

### Sequence

`<Sequence>` places content at a specific time within a composition.

```tsx
import { Sequence } from "remotion";

const MyVideo: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={90}>
        <TitleCard text="Introduction" />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <MainContent />
      </Sequence>
      <Sequence from={240} durationInFrames={60}>
        <Outro />
      </Sequence>
    </>
  );
};
```

### Series

`<Series>` places items sequentially without manual `from` calculation.

```tsx
import { Series } from "remotion";

const MyVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={90}>
        <TitleCard text="Introduction" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <MainContent />
      </Series.Sequence>
      <Series.Sequence durationInFrames={60}>
        <Outro />
      </Series.Sequence>
    </Series>
  );
};
```

---

## Asset Import

Use `staticFile()` to reference files in the `public/` directory.

```tsx
import { staticFile, Audio, Img, OffthreadVideo } from "remotion";

// Images
<Img src={staticFile("images/logo.png")} />

// Audio
<Audio src={staticFile("audio/background-music.mp3")} />

// Video
<OffthreadVideo src={staticFile("video/clip.mp4")} />
```

See [assets rule](rules/assets.md) for loading patterns and delayRender usage.

---

## Audio Synchronization

```tsx
import { useCurrentFrame, useVideoConfig, Audio, interpolate } from "remotion";

const NarrationSync: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps; // time in seconds

  // Sync visual elements to narration timestamps
  const showSubtitle = currentTime >= 2.5 && currentTime < 5.0;

  return (
    <>
      <Audio src={staticFile("audio/narration.mp3")} />
      {showSubtitle && <div className="subtitle">Welcome to our video</div>}
    </>
  );
};
```

### audioBufferToDataUrl

`audioBufferToDataUrl` from `@remotion/media-utils` converts an `AudioBuffer` to a data URL. This is useful for passing decoded audio data to components that expect a URL, such as visualization or processing pipelines.

```tsx
import { audioBufferToDataUrl } from "@remotion/media-utils";

// Convert an AudioBuffer to a data URL for visualization or playback
const dataUrl = audioBufferToDataUrl(audioBuffer);
```

See [audio rule](rules/audio.md) and [subtitles rule](rules/subtitles.md).

---

## Text Rendering

Load fonts before rendering text to avoid layout shifts.

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const TitleCard: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div style={{ fontFamily, fontSize: 72, color: "white" }}>
      {text}
    </div>
  );
};
```

See [fonts rule](rules/fonts.md) and [measuring-text rule](rules/measuring-text.md).

---

## Animation API

### interpolate()

Maps a frame number to an output value range.

```tsx
import { useCurrentFrame, interpolate, Easing } from "remotion";

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, 30], [50, 0], {
    easing: Easing.out(Easing.ease),
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      Hello
    </div>
  );
};
```

### spring()

Physics-based animation with overshoot.

```tsx
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

const Bounce: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });

  return (
    <div style={{ transform: `scale(${scale})` }}>Bounce!</div>
  );
};
```

See [animations rule](rules/animations.md) for full details.

---

## Rendering

### Preview Server

```bash
npx remotion preview src/index.ts
```

### CLI Render

```bash
# Render a specific composition
npx remotion render src/index.ts MyVideo out/video.mp4

# With options
npx remotion render src/index.ts MyVideo out/video.mp4 \
  --codec=h264 \
  --crf=18 \
  --fps=30
```

### Programmatic Render

```ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const bundled = await bundle({ entryPoint: "./src/index.ts" });

const composition = await selectComposition({
  serveUrl: bundled,
  id: "MyVideo",
});

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "out/video.mp4",
});
```

### Lambda Rendering

```ts
import { renderMediaOnLambda } from "@remotion/lambda/client";

const result = await renderMediaOnLambda({
  region: "us-east-1",
  functionName: "remotion-render",
  composition: "MyVideo",
  serveUrl: "https://my-site.com/bundle",
  codec: "h264",
});
```

---

## COOKIE SSD Integration

The Scene Structure Document (SSD) defines a video as a series of scenes. Each SSD scene maps directly to a Remotion `<Sequence>`.

### SSD-to-Remotion Mapping

| SSD Concept          | Remotion Equivalent                        |
|----------------------|--------------------------------------------|
| `total_duration`     | `durationInFrames = total_duration * fps`  |
| `scene`              | `<Sequence from={startFrame} durationInFrames={sceneFrames}>` |
| `scene.duration`     | `durationInFrames = scene.duration * fps`  |
| `scene.background`   | Background `<AbsoluteFill>` with color/video/image |
| `scene.narration`    | `<Audio>` component with narration file    |
| `scene.text_overlays`| Text components with animation             |
| `scene.animation`    | `interpolate()` / `spring()` calls         |
| `scene.transition`   | Transition component at sequence boundaries|
| `subtitles.enabled`  | Caption component overlay                  |
| `music.src`          | `<Audio>` with volume ducking              |

### Converting SSD to Composition

```tsx
import { Composition, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { staticFile, Audio } from "remotion";

interface SSDScene {
  id: string;
  duration: number;
  background: { type: string; src?: string; color?: string };
  narration?: { src: string };
  text_overlays?: Array<{
    text: string;
    position: string;
    animation: string;
  }>;
  transition?: { type: string; duration: number };
}

interface SSDConfig {
  fps: number;
  width: number;
  height: number;
  total_duration: number;
  scenes: SSDScene[];
}

// Register in Root.tsx
export const RemotionRoot: React.FC<{ ssd: SSDConfig }> = ({ ssd }) => {
  return (
    <Composition
      id="SSDVideo"
      component={SSDVideoComposition}
      durationInFrames={Math.ceil(ssd.total_duration * ssd.fps)}
      fps={ssd.fps}
      width={ssd.width}
      height={ssd.height}
      defaultProps={{ scenes: ssd.scenes }}
    />
  );
};

// Render scenes as sequences
const SSDVideoComposition: React.FC<{ scenes: SSDScene[] }> = ({ scenes }) => {
  const { fps } = useVideoConfig();
  let currentFrame = 0;

  return (
    <>
      {scenes.map((scene) => {
        const startFrame = currentFrame;
        const durationInFrames = Math.ceil(scene.duration * fps);
        currentFrame += durationInFrames;

        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <SceneRenderer scene={scene} />
          </Sequence>
        );
      })}
    </>
  );
};
```

### SSD Animation Mapping

Animations defined in SSD map to `interpolate()` calls:

```tsx
function getAnimationStyle(animation: string, frame: number, fps: number) {
  switch (animation) {
    case "fade-in":
      return { opacity: interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" }) };
    case "fade-in-up":
      return {
        opacity: interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [0, fps * 0.5], [30, 0], { extrapolateRight: "clamp" })}px)`,
      };
    case "slide-in-left":
      return {
        transform: `translateX(${interpolate(frame, [0, fps * 0.5], [-100, 0], { extrapolateRight: "clamp" })}%)`,
      };
    case "typewriter":
      // Handled by text component — see component-library.md
      return {};
    case "bounce":
      return {
        transform: `scale(${spring({ frame, fps, config: { damping: 8, stiffness: 150 } })})`,
      };
    default:
      return {};
  }
}
```

---

## Import Reference

```tsx
// Core
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { Composition, Sequence, Series, AbsoluteFill } from "remotion";
import { Audio, Img, OffthreadVideo, staticFile } from "remotion";
import { delayRender, continueRender } from "remotion";

// Google Fonts
import { loadFont } from "@remotion/google-fonts/Inter";

// Media Utils
import { getAudioData, useAudioData, visualizeAudio } from "@remotion/media-utils";

// Layout Utils
import { measureText, fillTextBox } from "@remotion/layout-utils";

// Renderer (Node.js only)
import { renderMedia, selectComposition } from "@remotion/renderer";
import { bundle } from "@remotion/bundler";

// Lambda
import { renderMediaOnLambda } from "@remotion/lambda/client";

// Three.js
import { ThreeCanvas } from "@remotion/three";

// Lottie
import { Lottie } from "@remotion/lottie";
```

---

## Rule Files Reference

| Rule File | Topic |
|-----------|-------|
| [animations.md](rules/animations.md) | interpolate, spring, easing, keyframes |
| [subtitles.md](rules/subtitles.md) | SRT/VTT generation, burn-in, caption components |
| [audio.md](rules/audio.md) | Audio component, volume, ducking |
| [audio-visualization.md](rules/audio-visualization.md) | Spectrum bars, waveform rendering |
| [assets.md](rules/assets.md) | staticFile, delayRender, asset loading |
| [compositions.md](rules/compositions.md) | Composition setup, props, registration |
| [fonts.md](rules/fonts.md) | Google Fonts, local fonts, font loading |
| [images.md](rules/images.md) | Img component, responsive sizing |
| [sequencing.md](rules/sequencing.md) | Sequence, Series, scene timing |
| [3d.md](rules/3d.md) | Three.js integration |
| [charts.md](rules/charts.md) | Animated data visualization |
| [ffmpeg.md](rules/ffmpeg.md) | FFmpeg integration, codecs |
| [light-leaks.md](rules/light-leaks.md) | Light leak overlays, blend modes |
| [lottie.md](rules/lottie.md) | Lottie animation import |
| [measuring-text.md](rules/measuring-text.md) | Text measurement and layout |
| [sound-effects.md](rules/sound-effects.md) | SFX timing, audio sprites |
| [component-library.md](../component-library.md) | COOKIE custom Remotion components |
