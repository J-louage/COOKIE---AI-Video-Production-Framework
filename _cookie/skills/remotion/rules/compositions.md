# Compositions

A `<Composition>` defines a renderable video with fixed dimensions, frame rate, and duration. The `<Composition>` component is registered in the Root component and ties a React component to its rendering configuration.

---

## Basic Composition

```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={900}   // 30 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

---

## Composition Props

| Prop               | Type                    | Required | Description                            |
|--------------------|-------------------------|----------|----------------------------------------|
| `id`               | `string`                | Yes      | Unique ID used for rendering           |
| `component`        | `React.FC<P>`           | Yes      | React component to render              |
| `durationInFrames` | `number`                | Yes      | Total frames in the video              |
| `fps`              | `number`                | Yes      | Frames per second                      |
| `width`            | `number`                | Yes      | Video width in pixels                  |
| `height`           | `number`                | Yes      | Video height in pixels                 |
| `defaultProps`     | `P`                     | No       | Default props passed to component      |
| `schema`           | `z.ZodType<P>`          | No       | Zod schema for prop validation         |
| `calculateMetadata`| `function`              | No       | Dynamic metadata calculation           |

---

## Duration Calculation

Convert seconds to frames: `durationInFrames = seconds * fps`.

```tsx
const fps = 30;
const durationSeconds = 45;
const durationInFrames = Math.ceil(durationSeconds * fps); // 1350

<Composition
  id="Video"
  component={MyVideo}
  durationInFrames={durationInFrames}
  fps={fps}
  width={1920}
  height={1080}
/>
```

### Common Durations at 30fps

| Duration  | Frames  |
|-----------|---------|
| 1 second  | 30      |
| 5 seconds | 150     |
| 10 seconds| 300     |
| 30 seconds| 900     |
| 1 minute  | 1800    |
| 5 minutes | 9000    |

---

## Props Schema with Zod

Type-safe props with runtime validation. Props appear in the Remotion Studio UI for editing.

```tsx
import { Composition } from "remotion";
import { z } from "zod";
import { MyVideo } from "./MyVideo";

const videoSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  backgroundColor: z.string().default("#000000"),
  showLogo: z.boolean().default(true),
});

type VideoProps = z.infer<typeof videoSchema>;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      schema={videoSchema}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "My Video",
        subtitle: "A subtitle",
        backgroundColor: "#1a1a2e",
        showLogo: true,
      }}
    />
  );
};
```

---

## registerRoot()

The Root component is registered in the entry file (typically `src/index.ts`).

```tsx
// src/index.ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
```

---

## Multiple Compositions

Register multiple compositions in the same Root for different video variants.

```tsx
import { Composition } from "remotion";
import { IntroVideo } from "./IntroVideo";
import { MainVideo } from "./MainVideo";
import { ShortClip } from "./ShortClip";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={IntroVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Main"
        component={MainVideo}
        durationInFrames={2700}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ShortClip"
        component={ShortClip}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
```

Render a specific composition by ID:

```bash
npx remotion render src/index.ts Main out/main.mp4
npx remotion render src/index.ts ShortClip out/short.mp4
```

---

## calculateMetadata

Dynamically compute duration, dimensions, or fps based on props.

```tsx
import { Composition, CalculateMetadataFunction } from "remotion";

interface VideoProps {
  scenes: Array<{ duration: number }>;
}

const calculateMetadata: CalculateMetadataFunction<VideoProps> = async ({
  props,
}) => {
  const totalDuration = props.scenes.reduce((sum, s) => sum + s.duration, 0);
  return {
    durationInFrames: Math.ceil(totalDuration * 30),
    fps: 30,
    width: 1920,
    height: 1080,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DynamicVideo"
      component={DynamicVideo}
      calculateMetadata={calculateMetadata}
      durationInFrames={300} // fallback, overridden by calculateMetadata
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        scenes: [
          { duration: 3 },
          { duration: 5 },
          { duration: 2 },
        ],
      }}
    />
  );
};
```

---

## useVideoConfig()

Access the composition's configuration from within any component.

```tsx
import { useVideoConfig } from "remotion";

const MyComponent: React.FC = () => {
  const { fps, width, height, durationInFrames } = useVideoConfig();

  return (
    <div>
      {width}x{height} @ {fps}fps — {durationInFrames} frames
    </div>
  );
};
```

---

## Standard Dimensions

| Format       | Width  | Height | Aspect Ratio |
|--------------|--------|--------|--------------|
| 1080p        | 1920   | 1080   | 16:9         |
| 4K           | 3840   | 2160   | 16:9         |
| 720p         | 1280   | 720    | 16:9         |
| Square       | 1080   | 1080   | 1:1          |
| Portrait 9:16| 1080   | 1920   | 9:16         |
| TikTok/Reels | 1080   | 1920   | 9:16         |

---

## COOKIE SSD to Composition

```tsx
function ssdToComposition(ssd: any) {
  const fps = ssd.fps || 30;
  const width = ssd.width || 1920;
  const height = ssd.height || 1080;
  const totalDuration = ssd.total_duration; // seconds
  const durationInFrames = Math.ceil(totalDuration * fps);

  return {
    id: ssd.id || "SSDVideo",
    fps,
    width,
    height,
    durationInFrames,
  };
}
```

---

## Folder Compositions

Group compositions into folders for organization in Remotion Studio.

```tsx
import { Composition, Folder } from "remotion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Marketing">
        <Composition id="Ad30s" component={Ad30s} {...config30s} />
        <Composition id="Ad15s" component={Ad15s} {...config15s} />
      </Folder>
      <Folder name="Social">
        <Composition id="TikTok" component={TikTok} {...configTikTok} />
        <Composition id="Reel" component={Reel} {...configReel} />
      </Folder>
    </>
  );
};
```

---

## Pitfalls

1. **durationInFrames must be a positive integer.** Use `Math.ceil()` when converting from seconds to avoid fractional frames.

2. **Duplicate composition IDs.** Each `id` must be unique across all compositions. Duplicates cause a runtime error.

3. **Missing registerRoot.** The entry file must call `registerRoot()` with the Root component. Without it, Remotion cannot find compositions.

4. **Props type mismatch.** When using `schema`, the `defaultProps` must satisfy the schema. Mismatches cause validation errors in Studio.

5. **calculateMetadata is async.** It can fetch data, but it runs once before rendering starts, not per frame.
