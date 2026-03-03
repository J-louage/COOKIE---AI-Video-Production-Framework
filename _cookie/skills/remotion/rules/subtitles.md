# Subtitles

Subtitles in Remotion can be rendered as burn-in captions directly in the video or generated as SRT/VTT sidecar files. COOKIE's SSD controls subtitle appearance through the `subtitles` configuration block.

---

## SRT/VTT Generation from Narration Timing

### SRT Format

```
1
00:00:00,000 --> 00:00:02,500
Welcome to our presentation.

2
00:00:02,500 --> 00:00:05,000
Today we'll cover the key points.
```

### VTT Format

```
WEBVTT

00:00:00.000 --> 00:00:02.500
Welcome to our presentation.

00:00:02.500 --> 00:00:05.000
Today we'll cover the key points.
```

### Generating SRT from Word-Level Timing

```ts
interface WordTiming {
  word: string;
  start: number;  // seconds
  end: number;    // seconds
}

function generateSRT(words: WordTiming[], maxCharsPerLine: number = 42): string {
  const lines: Array<{ start: number; end: number; text: string }> = [];
  let currentLine = "";
  let lineStart = words[0]?.start ?? 0;
  let lineEnd = 0;

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word.word}` : word.word;

    if (candidate.length > maxCharsPerLine && currentLine) {
      lines.push({ start: lineStart, end: lineEnd, text: currentLine });
      currentLine = word.word;
      lineStart = word.start;
    } else {
      currentLine = candidate;
    }
    lineEnd = word.end;
  }

  if (currentLine) {
    lines.push({ start: lineStart, end: lineEnd, text: currentLine });
  }

  return lines
    .map((line, i) => {
      const startTC = formatTimecode(line.start);
      const endTC = formatTimecode(line.end);
      return `${i + 1}\n${startTC} --> ${endTC}\n${line.text}\n`;
    })
    .join("\n");
}

function formatTimecode(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

function pad(n: number, len: number = 2): string {
  return String(n).padStart(len, "0");
}
```

---

## Burn-In Captions with Remotion

### Simple Subtitle Component

```tsx
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";

interface SubtitleEntry {
  text: string;
  startTime: number;  // seconds
  endTime: number;    // seconds
}

interface SubtitleProps {
  subtitles: SubtitleEntry[];
  style?: "default" | "outline" | "background";
  fontSize?: number;
  color?: string;
  position?: "bottom" | "center" | "top";
}

export const Subtitles: React.FC<SubtitleProps> = ({
  subtitles,
  style = "default",
  fontSize = 48,
  color = "#FFFFFF",
  position = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const activeSub = subtitles.find(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  );

  if (!activeSub) return null;

  const positionStyle = {
    bottom: { bottom: 80, top: "auto" as const },
    center: { top: "50%", transform: "translateY(-50%)" },
    top: { top: 80, bottom: "auto" as const },
  }[position];

  const textStyle: React.CSSProperties = {
    fontSize,
    color,
    textAlign: "center",
    padding: "8px 24px",
    ...(style === "outline" && {
      textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
    }),
    ...(style === "background" && {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderRadius: 8,
    }),
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: position === "center" ? "center" : "flex-end",
        alignItems: "center",
        ...positionStyle,
      }}
    >
      <div style={textStyle}>{activeSub.text}</div>
    </AbsoluteFill>
  );
};
```

### Word-by-Word Highlighted Captions (TikTok Style)

```tsx
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from "remotion";

interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export const WordHighlightCaption: React.FC<{
  words: WordTiming[];
  activeColor?: string;
  inactiveColor?: string;
  fontSize?: number;
}> = ({
  words,
  activeColor = "#FFD700",
  inactiveColor = "#FFFFFF",
  fontSize = 56,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Show a window of words around the current word
  const activeIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime < w.end
  );

  if (activeIndex === -1) return null;

  // Display a chunk of words around the active one
  const chunkSize = 6;
  const chunkStart = Math.max(0, activeIndex - Math.floor(chunkSize / 2));
  const chunkEnd = Math.min(words.length, chunkStart + chunkSize);
  const visibleWords = words.slice(chunkStart, chunkEnd);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
          padding: "0 120px",
        }}
      >
        {visibleWords.map((w, i) => {
          const globalIndex = chunkStart + i;
          const isActive = globalIndex === activeIndex;
          return (
            <span
              key={`${w.word}-${globalIndex}`}
              style={{
                fontSize,
                fontWeight: 800,
                color: isActive ? activeColor : inactiveColor,
                textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                transform: isActive ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.1s",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

---

## FFmpeg Subtitle Burn-In (Post-Render)

For burning SRT subtitles into an already-rendered video:

```bash
ffmpeg -i video.mp4 -vf "subtitles=subtitles.srt:force_style='FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Shadow=1'" -codec:a copy output.mp4
```

---

## COOKIE SSD Subtitles Config

```yaml
subtitles:
  enabled: true
  style: "background"        # "default" | "outline" | "background"
  position: "bottom"         # "bottom" | "center" | "top"
  fontSize: 48
  color: "#FFFFFF"
  backgroundColor: "rgba(0,0,0,0.7)"
  highlightColor: "#FFD700"  # for word-level highlight
  mode: "line"               # "line" | "word-highlight"
```

### Mapping SSD to Subtitle Component

```tsx
import { Subtitles } from "./Subtitles";
import { WordHighlightCaption } from "./WordHighlightCaption";

function renderSubtitles(ssdConfig: any, subtitleData: any) {
  if (!ssdConfig.subtitles?.enabled) return null;

  if (ssdConfig.subtitles.mode === "word-highlight") {
    return (
      <WordHighlightCaption
        words={subtitleData.words}
        activeColor={ssdConfig.subtitles.highlightColor}
        inactiveColor={ssdConfig.subtitles.color}
        fontSize={ssdConfig.subtitles.fontSize}
      />
    );
  }

  return (
    <Subtitles
      subtitles={subtitleData.lines}
      style={ssdConfig.subtitles.style}
      fontSize={ssdConfig.subtitles.fontSize}
      color={ssdConfig.subtitles.color}
      position={ssdConfig.subtitles.position}
    />
  );
}
```

---

## Parsing SRT Files

```ts
function parseSRT(srtContent: string): SubtitleEntry[] {
  const blocks = srtContent.trim().split(/\n\n+/);
  return blocks.map((block) => {
    const lines = block.split("\n");
    const [startTC, endTC] = lines[1].split(" --> ");
    const text = lines.slice(2).join(" ");
    return {
      text,
      startTime: parseTimecode(startTC),
      endTime: parseTimecode(endTC),
    };
  });
}

function parseTimecode(tc: string): number {
  const [time, ms] = tc.split(",");
  const [h, m, s] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s + parseInt(ms, 10) / 1000;
}
```

---

## Pitfalls

1. **Font loading for subtitles.** Always load subtitle fonts with `loadFont()` before rendering. Missing fonts cause layout shifts and incorrect text measurement.

2. **Timecode precision.** SRT uses comma for milliseconds (`00:00:01,500`), VTT uses dot (`00:00:01.500`). Do not mix formats.

3. **Long subtitle lines.** Break lines at 42 characters max for readability. Two-line subtitles are acceptable; three lines are not.

4. **Word-level timing drift.** Whisper and similar ASR tools can have timing drift. Validate word timings against the audio waveform before rendering.

5. **Subtitle z-index.** Always render subtitles in the topmost layer using `AbsoluteFill` so they are not occluded by other elements.
