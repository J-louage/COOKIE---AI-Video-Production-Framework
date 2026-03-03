# Sequencing

`<Sequence>` and `<Series>` control when content appears in the timeline. Each SSD scene maps to a `<Sequence>` with calculated frame positions.

---

## Sequence

Places content at a specific time position within a composition.

```tsx
import { Sequence } from "remotion";

const MyVideo: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <MainScene />
      </Sequence>
      <Sequence from={240} durationInFrames={60}>
        <OutroScene />
      </Sequence>
    </>
  );
};
```

### Sequence Props

| Prop               | Type       | Required | Description                                 |
|--------------------|------------|----------|---------------------------------------------|
| `from`             | `number`   | No       | Start frame (default: 0)                    |
| `durationInFrames` | `number`   | No       | Duration in frames (default: Infinity)      |
| `name`             | `string`   | No       | Label shown in Remotion Studio timeline     |
| `layout`           | `string`   | No       | `"absolute-fill"` (default) or `"none"`     |

### Frame Reset Inside Sequence

Inside a `<Sequence>`, `useCurrentFrame()` returns frames relative to the sequence start, not the composition start.

```tsx
import { Sequence, useCurrentFrame } from "remotion";

const ChildComponent: React.FC = () => {
  const frame = useCurrentFrame();
  // frame is 0 when the sequence starts, regardless of `from`
  return <div>Frame within sequence: {frame}</div>;
};

// If placed in <Sequence from={90}>, the child sees frame=0 at composition frame 90
```

### layout="none"

By default, Sequence wraps children in an `AbsoluteFill`. Use `layout="none"` to prevent this.

```tsx
<Sequence from={30} layout="none">
  {/* Children are not wrapped in AbsoluteFill */}
  <span>Inline content</span>
</Sequence>
```

---

## Series

Automatically places items sequentially without manually calculating `from` values.

```tsx
import { Series } from "remotion";

const MyVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={90}>
        <IntroScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <MainScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={60}>
        <OutroScene />
      </Series.Sequence>
    </Series>
  );
};
```

### Series.Sequence Props

| Prop               | Type       | Description                            |
|--------------------|------------|----------------------------------------|
| `durationInFrames` | `number`   | Duration of this segment               |
| `offset`           | `number`   | Shift start time (positive = delay, negative = overlap) |
| `layout`           | `string`   | `"absolute-fill"` or `"none"`          |

### Overlapping with offset

Use negative `offset` to overlap sequences for transitions.

```tsx
<Series>
  <Series.Sequence durationInFrames={120}>
    <SceneA />
  </Series.Sequence>
  <Series.Sequence durationInFrames={120} offset={-15}>
    {/* Starts 15 frames before SceneA ends — overlap for crossfade */}
    <SceneB />
  </Series.Sequence>
</Series>
```

---

## Nested Sequences

Sequences can be nested. Frame counting resets at each level.

```tsx
import { Sequence, useCurrentFrame } from "remotion";

const MyVideo: React.FC = () => {
  return (
    <Sequence from={0} durationInFrames={300} name="Scene 1">
      {/* Inner sequences are relative to the outer sequence */}
      <Sequence from={0} durationInFrames={60} name="Title">
        <TitleCard />
      </Sequence>
      <Sequence from={60} durationInFrames={180} name="Content">
        <ContentSection />
      </Sequence>
      <Sequence from={240} durationInFrames={60} name="Transition Out">
        <FadeOut />
      </Sequence>
    </Sequence>
  );
};
```

---

## SSD Scenes to Sequences

Each SSD scene becomes a `<Sequence>`. The `from` value is the cumulative frame count of all preceding scenes.

```tsx
import { Sequence, useVideoConfig } from "remotion";

interface SSDScene {
  id: string;
  duration: number; // seconds
}

const SSDComposition: React.FC<{ scenes: SSDScene[] }> = ({ scenes }) => {
  const { fps } = useVideoConfig();

  let cumulativeFrame = 0;

  return (
    <>
      {scenes.map((scene) => {
        const from = cumulativeFrame;
        const durationInFrames = Math.ceil(scene.duration * fps);
        cumulativeFrame += durationInFrames;

        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={durationInFrames}
            name={scene.id}
          >
            <SceneRenderer scene={scene} />
          </Sequence>
        );
      })}
    </>
  );
};
```

### With Transition Overlap

When SSD specifies transitions between scenes, subtract the transition duration from the gap between sequences.

```tsx
interface SSDScene {
  id: string;
  duration: number;
  transition?: { type: string; duration: number };
}

function buildSequences(scenes: SSDScene[], fps: number) {
  const sequences: Array<{
    id: string;
    from: number;
    durationInFrames: number;
  }> = [];

  let currentFrame = 0;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const durationInFrames = Math.ceil(scene.duration * fps);

    // Overlap with previous scene for transition
    const prevTransition = i > 0 ? scenes[i - 1].transition : undefined;
    const overlapFrames = prevTransition
      ? Math.ceil(prevTransition.duration * fps)
      : 0;

    const from = Math.max(0, currentFrame - overlapFrames);

    sequences.push({ id: scene.id, from, durationInFrames });
    currentFrame = from + durationInFrames;
  }

  return sequences;
}
```

---

## Background Layers with Sequences

Use overlapping sequences for persistent layers (music, watermark) and timed content.

```tsx
import { Sequence, Audio, AbsoluteFill, staticFile } from "remotion";

const MyVideo: React.FC = () => {
  return (
    <>
      {/* Persistent background music — no from/duration = entire composition */}
      <Audio src={staticFile("audio/music.mp3")} volume={0.2} />

      {/* Persistent watermark */}
      <Sequence name="Watermark">
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: 20 }}>
          <img src={staticFile("images/watermark.png")} style={{ width: 100, opacity: 0.5 }} />
        </AbsoluteFill>
      </Sequence>

      {/* Timed content */}
      <Sequence from={0} durationInFrames={90} name="Intro">
        <IntroScene />
      </Sequence>
      <Sequence from={90} durationInFrames={150} name="Main">
        <MainScene />
      </Sequence>
    </>
  );
};
```

---

## Sequence Visibility Helper

Check whether a sequence is currently visible.

```tsx
function isSequenceVisible(
  compositionFrame: number,
  sequenceFrom: number,
  sequenceDuration: number
): boolean {
  return (
    compositionFrame >= sequenceFrom &&
    compositionFrame < sequenceFrom + sequenceDuration
  );
}
```

---

## Staggered Elements Within a Sequence

Animate multiple elements with staggered timing inside a single sequence.

```tsx
import { Sequence, useCurrentFrame, interpolate, Easing } from "remotion";

const StaggeredList: React.FC<{ items: string[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const staggerDelay = 5; // 5 frames between each item

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((item, index) => {
        const delay = index * staggerDelay;
        const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const translateX = interpolate(frame - delay, [0, 15], [-40, 0], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={index}
            style={{
              opacity,
              transform: `translateX(${translateX}px)`,
              fontSize: 36,
              color: "white",
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
```

---

## Pitfalls

1. **useCurrentFrame() returns sequence-relative frames.** Inside `<Sequence from={90}>`, `useCurrentFrame()` returns 0 at composition frame 90. This is intentional and useful, but can confuse you if you expect composition-level frames.

2. **Missing durationInFrames.** Without `durationInFrames`, a Sequence renders for the remaining composition duration. This is fine for background elements but causes overlap issues for timed content.

3. **Series.Sequence requires durationInFrames.** Unlike `<Sequence>`, `<Series.Sequence>` requires an explicit `durationInFrames`.

4. **Overlapping sequences render simultaneously.** Two sequences active at the same frame both render. The one appearing later in JSX renders on top. Use this for transitions and layered effects.

5. **Negative from values.** `<Sequence from={-10}>` starts the content 10 frames before the composition. The first 10 frames of content are skipped.
