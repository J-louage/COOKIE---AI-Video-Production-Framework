# Audio Visualization

Remotion provides utilities in `@remotion/media-utils` to extract audio frequency data and render spectrum bars, waveforms, and other audio-reactive visuals.

---

## Setup

```bash
npm install @remotion/media-utils
```

```tsx
import {
  getAudioData,
  useAudioData,
  visualizeAudio,
} from "@remotion/media-utils";
```

---

## getAudioData()

Fetches and decodes audio data from a URL. Returns an `AudioData` object containing sample data, channel count, duration, and more.

```tsx
import { getAudioData } from "@remotion/media-utils";
import { staticFile, delayRender, continueRender } from "remotion";
import { useState, useEffect } from "react";

const AudioViz: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading audio data"));
  const [audioData, setAudioData] = useState<Awaited<ReturnType<typeof getAudioData>> | null>(null);

  useEffect(() => {
    getAudioData(staticFile("audio/music.mp3"))
      .then((data) => {
        setAudioData(data);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(err);
        continueRender(handle);
      });
  }, [handle]);

  if (!audioData) return null;

  return <SpectrumBars audioData={audioData} />;
};
```

---

## useAudioData()

A hook wrapper around `getAudioData()` that handles `delayRender` internally.

```tsx
import { useAudioData } from "@remotion/media-utils";
import { staticFile } from "remotion";

const AudioViz: React.FC = () => {
  const audioData = useAudioData(staticFile("audio/music.mp3"));

  if (!audioData) return null;

  return <SpectrumBars audioData={audioData} />;
};
```

---

## visualizeAudio()

Extracts frequency data for the current frame. Returns an array of amplitude values (0 to 1) for each frequency bin.

```tsx
import { visualizeAudio } from "@remotion/media-utils";
import { useCurrentFrame, useVideoConfig } from "remotion";

const useVisualization = (audioData: any, numberOfSamples = 64) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples,         // frequency bins (power of 2)
    smoothing: true,         // apply temporal smoothing
  });

  return visualization; // number[] of length numberOfSamples
};
```

### Parameters

| Parameter          | Type       | Description                                  |
|--------------------|------------|----------------------------------------------|
| `fps`              | `number`   | Frames per second from `useVideoConfig()`    |
| `frame`            | `number`   | Current frame from `useCurrentFrame()`       |
| `audioData`        | `AudioData`| Data from `getAudioData()` or `useAudioData()` |
| `numberOfSamples`  | `number`   | Number of frequency bins (power of 2)        |
| `smoothing`        | `boolean`  | Apply temporal smoothing between frames      |
| `optimizeFor`      | `string`   | `"speed"` or `"accuracy"` (default: `"accuracy"`) |

---

## Spectrum Bar Visualizer

```tsx
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { staticFile } from "remotion";

export const SpectrumBars: React.FC<{
  src: string;
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  maxHeight?: number;
  color?: string;
  position?: "bottom" | "center";
}> = ({
  src,
  barCount = 32,
  barWidth = 12,
  barGap = 4,
  maxHeight = 200,
  color = "#4F46E5",
  position = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(staticFile(src));

  if (!audioData) return null;

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: barCount,
    smoothing: true,
  });

  const totalWidth = barCount * (barWidth + barGap) - barGap;

  return (
    <AbsoluteFill
      style={{
        justifyContent: position === "center" ? "center" : "flex-end",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: barGap,
          height: maxHeight,
        }}
      >
        {visualization.map((amplitude, i) => (
          <div
            key={i}
            style={{
              width: barWidth,
              height: `${amplitude * 100}%`,
              backgroundColor: color,
              borderRadius: barWidth / 2,
              minHeight: 4,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

---

## Waveform Visualizer

Renders a continuous waveform using SVG.

```tsx
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { staticFile } from "remotion";

export const Waveform: React.FC<{
  src: string;
  samples?: number;
  height?: number;
  color?: string;
  lineWidth?: number;
}> = ({
  src,
  samples = 128,
  height = 200,
  color = "#10B981",
  lineWidth = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const audioData = useAudioData(staticFile(src));

  if (!audioData) return null;

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: samples,
    smoothing: true,
  });

  const segmentWidth = width / (samples - 1);
  const midY = height / 2;

  const pathData = visualization
    .map((amp, i) => {
      const x = i * segmentWidth;
      const y = midY - amp * midY * 0.9;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // Mirror path for bottom half
  const mirrorData = [...visualization]
    .reverse()
    .map((amp, i) => {
      const x = (samples - 1 - i) * segmentWidth;
      const y = midY + amp * midY * 0.9;
      return `L ${x} ${y}`;
    })
    .join(" ");

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <svg width={width} height={height}>
        <path
          d={`${pathData} ${mirrorData} Z`}
          fill={color}
          fillOpacity={0.3}
          stroke={color}
          strokeWidth={lineWidth}
        />
      </svg>
    </AbsoluteFill>
  );
};
```

---

## Circular Visualizer

```tsx
export const CircularVisualizer: React.FC<{
  src: string;
  radius?: number;
  barCount?: number;
  color?: string;
}> = ({ src, radius = 150, barCount = 64, color = "#8B5CF6" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const audioData = useAudioData(staticFile(src));

  if (!audioData) return null;

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: barCount,
    smoothing: true,
  });

  const cx = width / 2;
  const cy = height / 2;

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        {visualization.map((amp, i) => {
          const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
          const barLength = amp * 100 + 5;
          const x1 = cx + Math.cos(angle) * radius;
          const y1 = cy + Math.sin(angle) * radius;
          const x2 = cx + Math.cos(angle) * (radius + barLength);
          const y2 = cy + Math.sin(angle) * (radius + barLength);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
```

---

## Usage in Composition

```tsx
import { Composition, Audio, staticFile } from "remotion";

const MusicVideo: React.FC = () => {
  return (
    <>
      <Audio src={staticFile("audio/track.mp3")} />
      <SpectrumBars src="audio/track.mp3" barCount={48} color="#FF6B6B" />
    </>
  );
};
```

---

## COOKIE SSD Integration

SSD scenes with music or audio can configure spectrum bars, waveforms, or circular visualizers via the `audio.visualization` block.

```yaml
scenes:
  - id: scene-music
    audio:
      src: "audio/track.mp3"
      visualization:
        enabled: true
        type: "spectrum"           # "spectrum" | "waveform" | "circular"
        bar_count: 48
        color: "#FF6B6B"
        position: "bottom"         # "bottom" | "center"
        max_height: 200
        bar_width: 12
        bar_gap: 4
        smoothing: true
```

### Mapping SSD to Visualization Components

```tsx
import { SpectrumBars } from "./SpectrumBars";
import { Waveform } from "./Waveform";
import { CircularVisualizer } from "./CircularVisualizer";

function renderAudioVisualization(ssdConfig: any) {
  const viz = ssdConfig.audio?.visualization;
  if (!viz?.enabled) return null;

  switch (viz.type) {
    case "spectrum":
      return (
        <SpectrumBars
          src={ssdConfig.audio.src}
          barCount={viz.bar_count}
          barWidth={viz.bar_width}
          barGap={viz.bar_gap}
          maxHeight={viz.max_height}
          color={viz.color}
          position={viz.position}
        />
      );
    case "waveform":
      return (
        <Waveform
          src={ssdConfig.audio.src}
          samples={viz.bar_count}
          height={viz.max_height}
          color={viz.color}
        />
      );
    case "circular":
      return (
        <CircularVisualizer
          src={ssdConfig.audio.src}
          barCount={viz.bar_count}
          color={viz.color}
        />
      );
    default:
      return null;
  }
}
```

---

## Pitfalls

1. **Missing delayRender.** `getAudioData()` is async. Without `delayRender()`, the frame renders before audio data is available. `useAudioData()` handles this automatically.

2. **numberOfSamples must be power of 2.** Use 16, 32, 64, 128, 256. Non-power-of-2 values throw an error.

3. **Performance with high sample counts.** 256+ samples per frame is expensive. Use 32-64 for most visualizations.

4. **Audio data is per-file, not per-channel.** `visualizeAudio()` returns mono data. Stereo files are mixed to mono internally.

5. **smoothing flicker.** If `smoothing: false`, bars jump between frames. Always use `smoothing: true` for visual output.
