# Audio

The `<Audio>` component plays audio files synchronized to the video timeline. Audio is rendered into the final video during the render process.

---

## Basic Usage

```tsx
import { Audio, staticFile } from "remotion";

const MyComp: React.FC = () => {
  return <Audio src={staticFile("audio/music.mp3")} />;
};
```

The audio starts at frame 0 and plays for the entire composition unless constrained.

---

## Audio Component Props

```tsx
import { Audio, staticFile } from "remotion";

<Audio
  src={staticFile("audio/narration.mp3")}
  volume={0.8}                // 0 to 1, or a volume callback
  startFrom={30}              // skip first 30 frames of the audio file
  endAt={300}                 // stop audio at frame 300 of the audio file
  playbackRate={1.0}          // speed multiplier
  muted={false}               // mute the audio
  loop={false}                // loop the audio
/>
```

| Prop           | Type                        | Description                                    |
|----------------|-----------------------------|------------------------------------------------|
| `src`          | `string`                    | URL or staticFile path to audio                |
| `volume`       | `number \| ((f: number) => number)` | Volume (0-1) or frame-based callback  |
| `startFrom`    | `number`                    | Frame offset in the audio file to start from   |
| `endAt`        | `number`                    | Frame in the audio file to stop at             |
| `playbackRate` | `number`                    | Playback speed (0.5 = half, 2 = double)        |
| `muted`        | `boolean`                   | Whether audio is muted                         |
| `loop`         | `boolean`                   | Whether audio loops                            |

---

## Volume Control

### Static Volume

```tsx
<Audio src={staticFile("audio/bg-music.mp3")} volume={0.3} />
```

### Dynamic Volume (Callback)

The volume callback receives the current frame relative to the Sequence the Audio is in.

```tsx
import { interpolate } from "remotion";

<Audio
  src={staticFile("audio/bg-music.mp3")}
  volume={(frame) =>
    interpolate(frame, [0, 30, 270, 300], [0, 0.3, 0.3, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  }
/>
```

This fades in over 1 second (30 frames at 30fps), holds at 0.3, then fades out.

---

## Audio Ducking Under Narration

When background music should lower its volume while narration plays:

```tsx
import { useCurrentFrame, useVideoConfig, Audio, Sequence, interpolate, staticFile } from "remotion";

interface NarrationSegment {
  startTime: number;
  endTime: number;
  src: string;
}

const DuckedAudio: React.FC<{
  musicSrc: string;
  narrations: NarrationSegment[];
  musicVolume?: number;
  duckedVolume?: number;
  duckRampFrames?: number;
}> = ({
  musicSrc,
  narrations,
  musicVolume = 0.4,
  duckedVolume = 0.08,
  duckRampFrames = 10,
}) => {
  const { fps } = useVideoConfig();

  const volumeCallback = (frame: number) => {
    let vol = musicVolume;

    for (const seg of narrations) {
      const segStart = Math.round(seg.startTime * fps);
      const segEnd = Math.round(seg.endTime * fps);

      if (frame >= segStart - duckRampFrames && frame <= segEnd + duckRampFrames) {
        const duckFactor = interpolate(
          frame,
          [
            segStart - duckRampFrames,
            segStart,
            segEnd,
            segEnd + duckRampFrames,
          ],
          [musicVolume, duckedVolume, duckedVolume, musicVolume],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        vol = Math.min(vol, duckFactor);
      }
    }

    return vol;
  };

  return <Audio src={staticFile(musicSrc)} volume={volumeCallback} />;
};
```

---

## Placing Audio in Sequences

Audio inside a `<Sequence>` only plays during that sequence's time range.

```tsx
import { Sequence, Audio, staticFile } from "remotion";

const MyVideo: React.FC = () => {
  return (
    <>
      {/* Background music for entire video */}
      <Audio src={staticFile("audio/music.mp3")} volume={0.2} />

      {/* Narration only in scene 1 */}
      <Sequence from={0} durationInFrames={150}>
        <Audio src={staticFile("audio/narration-1.mp3")} />
      </Sequence>

      {/* Narration only in scene 2 */}
      <Sequence from={150} durationInFrames={120}>
        <Audio src={staticFile("audio/narration-2.mp3")} />
      </Sequence>
    </>
  );
};
```

---

## Trimming Audio

`startFrom` and `endAt` refer to frame positions within the audio file, not the composition.

```tsx
// Play audio from 2 seconds in, stop at 10 seconds
// At 30fps: startFrom=60, endAt=300
<Audio
  src={staticFile("audio/long-track.mp3")}
  startFrom={60}
  endAt={300}
/>
```

---

## Remote Audio Sources

```tsx
<Audio src="https://example.com/audio/track.mp3" />
```

Remote sources work but may introduce loading delays. Use `delayRender()` if you need to ensure the audio is loaded.

```tsx
import { Audio, delayRender, continueRender } from "remotion";
import { useCallback, useState } from "react";

const RemoteAudio: React.FC<{ url: string }> = ({ url }) => {
  const [handle] = useState(() => delayRender("Loading remote audio"));

  const onLoad = useCallback(() => {
    continueRender(handle);
  }, [handle]);

  return <audio src={url} onCanPlayThrough={onLoad} style={{ display: "none" }} />;
};
```

---

## Multiple Audio Tracks

Multiple `<Audio>` components mix together automatically.

```tsx
<>
  <Audio src={staticFile("audio/music.mp3")} volume={0.2} />
  <Audio src={staticFile("audio/narration.mp3")} volume={1.0} />
  <Audio src={staticFile("audio/sfx-whoosh.mp3")} volume={0.5} />
</>
```

---

## COOKIE SSD Audio Mapping

```yaml
music:
  src: "audio/background.mp3"
  volume: 0.3
  duck_under_narration: true
  ducked_volume: 0.08
  fade_in: 1.0   # seconds
  fade_out: 1.5  # seconds

scenes:
  - id: scene-1
    narration:
      src: "audio/narration-scene1.mp3"
      volume: 1.0
```

```tsx
const SSDaudio: React.FC<{ ssd: any }> = ({ ssd }) => {
  const { fps } = useVideoConfig();
  const narrations = ssd.scenes
    .filter((s: any) => s.narration)
    .map((s: any) => ({
      startTime: s.startTime,
      endTime: s.startTime + s.duration,
      src: s.narration.src,
    }));

  return (
    <>
      {ssd.music?.duck_under_narration ? (
        <DuckedAudio
          musicSrc={ssd.music.src}
          narrations={narrations}
          musicVolume={ssd.music.volume}
          duckedVolume={ssd.music.ducked_volume}
        />
      ) : (
        <Audio src={staticFile(ssd.music.src)} volume={ssd.music.volume} />
      )}
    </>
  );
};
```

---

## Pitfalls

1. **Audio not rendering.** Audio only renders during `npx remotion render` or lambda render. In the browser preview, audio plays via the browser's audio API.

2. **Volume callback receives relative frame.** Inside a `<Sequence from={90}>`, the volume callback receives frames starting from 0, not 90.

3. **startFrom/endAt are audio-file frames, not composition frames.** `startFrom={30}` skips 30 frames of the audio file, not 30 frames of the composition.

4. **Large audio files.** Loading large audio files can slow down rendering. Consider splitting long audio files into per-scene segments.

5. **No audio codec control.** Remotion handles audio encoding automatically based on the selected video codec. AAC is used with h264, Opus with VP9/WebM.
