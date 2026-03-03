# Lottie

`@remotion/lottie` renders Lottie animations (exported from After Effects as JSON) within Remotion compositions, synchronized to the video timeline.

---

## Setup

```bash
npm install @remotion/lottie lottie-web
```

---

## Basic Usage

```tsx
import { Lottie } from "@remotion/lottie";
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender } from "remotion";
import { useState, useEffect } from "react";
import type { LottieAnimationData } from "@remotion/lottie";

const MyLottie: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading Lottie animation"));
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(staticFile("animations/loading.json"))
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data as LottieAnimationData);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Failed to load Lottie:", err);
        continueRender(handle);
      });
  }, [handle]);

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      style={{ width: 400, height: 400 }}
    />
  );
};
```

---

## Lottie Component Props

```tsx
<Lottie
  animationData={data}               // LottieAnimationData (required)
  style={{ width: 400, height: 400 }} // CSS styles
  playbackRate={1}                    // Speed multiplier
  direction="forward"                // "forward" | "backward"
  loop={true}                        // Loop the animation
  className="my-lottie"              // CSS class name
/>
```

| Prop             | Type                    | Default     | Description                          |
|------------------|-------------------------|-------------|--------------------------------------|
| `animationData`  | `LottieAnimationData`   | Required    | Parsed Lottie JSON data              |
| `style`          | `CSSProperties`         | `{}`        | Container styles                     |
| `playbackRate`   | `number`                | `1`         | Speed multiplier (2 = double speed)  |
| `direction`      | `"forward" \| "backward"` | `"forward"` | Playback direction                |
| `loop`           | `boolean`               | `true`      | Whether animation loops              |
| `className`      | `string`                | `undefined` | CSS class                            |

---

## Controlling Playback with Frame

The Lottie animation is automatically synchronized to Remotion's timeline. At frame 0, the Lottie animation is at its start. It plays at its native speed unless modified by `playbackRate`.

### Speed Control

```tsx
// Play at half speed (animation takes 2x longer)
<Lottie animationData={data} playbackRate={0.5} />

// Play at double speed
<Lottie animationData={data} playbackRate={2} />
```

### Reverse Playback

```tsx
<Lottie animationData={data} direction="backward" />
```

---

## Loading Lottie Data

### From staticFile (Local JSON)

```tsx
import { staticFile, delayRender, continueRender } from "remotion";
import { useState, useEffect } from "react";
import type { LottieAnimationData } from "@remotion/lottie";

function useLottieData(path: string): LottieAnimationData | null {
  const [handle] = useState(() => delayRender(`Loading Lottie: ${path}`));
  const [data, setData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(staticFile(path))
      .then((res) => res.json())
      .then((json) => {
        setData(json as LottieAnimationData);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [path, handle]);

  return data;
}

// Usage
const MyComponent: React.FC = () => {
  const data = useLottieData("animations/confetti.json");
  if (!data) return null;
  return <Lottie animationData={data} style={{ width: 600, height: 600 }} />;
};
```

### From Remote URL

```tsx
function useRemoteLottie(url: string): LottieAnimationData | null {
  const [handle] = useState(() => delayRender("Loading remote Lottie"));
  const [data, setData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setData(json as LottieAnimationData);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [url, handle]);

  return data;
}
```

### Inline Import

For smaller animations, import directly.

```tsx
import animationData from "./animations/check.json";
import { Lottie } from "@remotion/lottie";
import type { LottieAnimationData } from "@remotion/lottie";

const CheckMark: React.FC = () => {
  return (
    <Lottie
      animationData={animationData as unknown as LottieAnimationData}
      loop={false}
      style={{ width: 200, height: 200 }}
    />
  );
};
```

---

## Lottie in Sequences

Place Lottie animations within sequences for timed playback.

```tsx
import { Sequence } from "remotion";
import { Lottie } from "@remotion/lottie";

const MyVideo: React.FC = () => {
  const confettiData = useLottieData("animations/confetti.json");

  return (
    <>
      <Sequence from={60} durationInFrames={90} name="Celebration">
        {confettiData && (
          <Lottie
            animationData={confettiData}
            loop={false}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </Sequence>
    </>
  );
};
```

---

## Common Lottie Animation Sources

- **LottieFiles** (lottiefiles.com) — free and premium animations
- **After Effects** — export via Bodymovin plugin
- **Figma plugins** — export Figma animations as Lottie JSON

### File Structure

```
public/
  animations/
    confetti.json
    loading-spinner.json
    checkmark.json
    transition-wipe.json
    logo-reveal.json
```

---

## Combining with Other Elements

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import { Lottie } from "@remotion/lottie";

const SuccessScreen: React.FC = () => {
  const checkData = useLottieData("animations/checkmark.json");
  const confettiData = useLottieData("animations/confetti.json");

  return (
    <AbsoluteFill style={{ backgroundColor: "#111", justifyContent: "center", alignItems: "center" }}>
      {/* Checkmark animation */}
      {checkData && (
        <Lottie
          animationData={checkData}
          loop={false}
          style={{ width: 300, height: 300 }}
        />
      )}

      {/* Confetti overlay - delayed start */}
      <Sequence from={20}>
        <AbsoluteFill>
          {confettiData && (
            <Lottie
              animationData={confettiData}
              loop={false}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* Text below */}
      <div style={{ position: "absolute", bottom: 200, color: "white", fontSize: 48 }}>
        Success!
      </div>
    </AbsoluteFill>
  );
};
```

---

## COOKIE SSD Integration

```yaml
scenes:
  - id: scene-celebration
    lottie_overlays:
      - src: "animations/confetti.json"
        start_time: 0.5
        duration: 3.0
        playback_rate: 1.0
        loop: false
        position: "fullscreen"
```

```tsx
function renderLottieOverlays(overlays: any[], fps: number) {
  return overlays.map((overlay, i) => (
    <Sequence
      key={i}
      from={Math.round(overlay.start_time * fps)}
      durationInFrames={Math.round(overlay.duration * fps)}
    >
      <LottieFromFile
        src={overlay.src}
        playbackRate={overlay.playback_rate}
        loop={overlay.loop}
      />
    </Sequence>
  ));
}
```

---

## Pitfalls

1. **Large JSON files.** Complex After Effects animations can produce multi-MB JSON files. This slows loading and increases bundle size. Simplify animations before export.

2. **Missing assets in Lottie.** If the Lottie animation references external images or fonts, they must be embedded in the JSON or available at the correct paths.

3. **Loop behavior.** With `loop: true`, the animation restarts seamlessly. With `loop: false`, it stops at the last frame. Ensure the sequence duration matches the animation duration for non-looping animations.

4. **Frame rate mismatch.** Lottie animations have their own internal frame rate. Remotion handles the mapping, but animations designed at 24fps may look slightly different at 30fps.

5. **delayRender is mandatory for fetch.** Loading JSON via `fetch()` is async. Without `delayRender()`, the component renders before data is available, showing nothing.
