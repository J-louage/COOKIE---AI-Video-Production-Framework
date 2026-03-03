# Sound Effects

Sound effects (SFX) are short audio clips triggered at specific frames. They use the `<Audio>` component placed within `<Sequence>` to control timing precisely.

---

## Basic SFX Timing

Place an `<Audio>` inside a `<Sequence>` to trigger it at a specific frame.

```tsx
import { Audio, Sequence, staticFile } from "remotion";

const MyVideo: React.FC = () => {
  return (
    <>
      {/* Whoosh at frame 30 */}
      <Sequence from={30} durationInFrames={30}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.6} />
      </Sequence>

      {/* Click at frame 60 */}
      <Sequence from={60} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/click.mp3")} volume={0.5} />
      </Sequence>

      {/* Ding at frame 120 */}
      <Sequence from={120} durationInFrames={45}>
        <Audio src={staticFile("audio/sfx/ding.mp3")} volume={0.7} />
      </Sequence>
    </>
  );
};
```

---

## SFX from Time in Seconds

Convert seconds to frames for intuitive timing.

```tsx
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";

interface SFXCue {
  src: string;
  time: number;       // seconds
  volume?: number;
  duration?: number;   // seconds, how long to keep the Audio mounted
}

const SFXLayer: React.FC<{ cues: SFXCue[] }> = ({ cues }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      {cues.map((cue, i) => {
        const from = Math.round(cue.time * fps);
        const durationInFrames = Math.round((cue.duration ?? 2) * fps);

        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <Audio src={staticFile(cue.src)} volume={cue.volume ?? 0.5} />
          </Sequence>
        );
      })}
    </>
  );
};

// Usage
<SFXLayer
  cues={[
    { src: "audio/sfx/whoosh.mp3", time: 1.0, volume: 0.6 },
    { src: "audio/sfx/click.mp3", time: 2.5, volume: 0.5 },
    { src: "audio/sfx/success.mp3", time: 5.0, volume: 0.7, duration: 3 },
  ]}
/>
```

---

## Audio Sprites

An audio sprite is a single file containing multiple SFX concatenated. Use `startFrom` and `endAt` to extract individual sounds.

```tsx
import { Audio, Sequence, staticFile } from "remotion";

// Audio sprite layout (in frames at 30fps):
// 0-30: whoosh
// 30-60: click
// 60-120: ding
// 120-180: success

interface SpriteEntry {
  name: string;
  startFrame: number;
  endFrame: number;
}

const spriteMap: SpriteEntry[] = [
  { name: "whoosh", startFrame: 0, endFrame: 30 },
  { name: "click", startFrame: 30, endFrame: 60 },
  { name: "ding", startFrame: 60, endFrame: 120 },
  { name: "success", startFrame: 120, endFrame: 180 },
];

const SpriteAudio: React.FC<{
  spriteSrc: string;
  soundName: string;
  triggerFrame: number;
  volume?: number;
}> = ({ spriteSrc, soundName, triggerFrame, volume = 0.5 }) => {
  const entry = spriteMap.find((s) => s.name === soundName);
  if (!entry) return null;

  const durationInFrames = entry.endFrame - entry.startFrame;

  return (
    <Sequence from={triggerFrame} durationInFrames={durationInFrames}>
      <Audio
        src={staticFile(spriteSrc)}
        startFrom={entry.startFrame}
        endAt={entry.endFrame}
        volume={volume}
      />
    </Sequence>
  );
};

// Usage
<SpriteAudio
  spriteSrc="audio/sfx/sprite.mp3"
  soundName="whoosh"
  triggerFrame={45}
  volume={0.6}
/>
```

---

## Multiple Simultaneous Sounds

Multiple `<Audio>` components play simultaneously. Remotion mixes them together during render.

```tsx
const ExplosionScene: React.FC = () => {
  return (
    <>
      {/* Boom */}
      <Sequence from={0} durationInFrames={90}>
        <Audio src={staticFile("audio/sfx/boom.mp3")} volume={0.8} />
      </Sequence>

      {/* Debris rattle - slightly delayed */}
      <Sequence from={5} durationInFrames={60}>
        <Audio src={staticFile("audio/sfx/debris.mp3")} volume={0.4} />
      </Sequence>

      {/* Echo tail */}
      <Sequence from={15} durationInFrames={120}>
        <Audio src={staticFile("audio/sfx/echo.mp3")} volume={0.3} />
      </Sequence>
    </>
  );
};
```

---

## SFX with Volume Envelope

Apply fade-in and fade-out to sound effects for smoother transitions.

```tsx
import { Audio, Sequence, staticFile, interpolate } from "remotion";

const FadedSFX: React.FC<{
  src: string;
  triggerFrame: number;
  durationFrames: number;
  maxVolume?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}> = ({
  src,
  triggerFrame,
  durationFrames,
  maxVolume = 0.5,
  fadeInFrames = 5,
  fadeOutFrames = 10,
}) => {
  return (
    <Sequence from={triggerFrame} durationInFrames={durationFrames}>
      <Audio
        src={staticFile(src)}
        volume={(frame) =>
          interpolate(
            frame,
            [0, fadeInFrames, durationFrames - fadeOutFrames, durationFrames],
            [0, maxVolume, maxVolume, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />
    </Sequence>
  );
};
```

---

## SFX Synchronized to Animation Events

Trigger SFX when specific visual events occur.

```tsx
import { Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

const BouncingLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo bounces in at frame 0
  const scale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  // Estimate the first "landing" frame (when spring first reaches ~1.0)
  const landingFrame = 12; // approximately, depends on spring config

  return (
    <>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `scale(${scale})` }}>
          <img src={staticFile("images/logo.png")} style={{ width: 300 }} />
        </div>
      </AbsoluteFill>

      {/* Thud when logo "lands" */}
      <Sequence from={landingFrame} durationInFrames={30}>
        <Audio src={staticFile("audio/sfx/thud.mp3")} volume={0.5} />
      </Sequence>
    </>
  );
};
```

---

## SSD SFX Timing Mapping

COOKIE SSD defines sound effects with timing relative to scenes.

```yaml
scenes:
  - id: scene-1
    duration: 5.0
    sfx:
      - src: "audio/sfx/whoosh.mp3"
        time: 0.0          # relative to scene start
        volume: 0.6
      - src: "audio/sfx/click.mp3"
        time: 1.5
        volume: 0.5
      - src: "audio/sfx/ding.mp3"
        time: 3.0
        volume: 0.7
        fade_out: 0.5      # fade out duration in seconds
```

### Mapping SSD SFX to Remotion

```tsx
import { Audio, Sequence, staticFile, interpolate } from "remotion";

interface SSDSFX {
  src: string;
  time: number;       // seconds relative to scene start
  volume?: number;
  duration?: number;   // seconds
  fade_in?: number;    // seconds
  fade_out?: number;   // seconds
}

const SceneSFX: React.FC<{ sfxList: SSDSFX[]; fps: number }> = ({ sfxList, fps }) => {
  return (
    <>
      {sfxList.map((sfx, i) => {
        const from = Math.round(sfx.time * fps);
        const durationInFrames = Math.round((sfx.duration ?? 2) * fps);
        const fadeInFrames = Math.round((sfx.fade_in ?? 0) * fps);
        const fadeOutFrames = Math.round((sfx.fade_out ?? 0) * fps);
        const vol = sfx.volume ?? 0.5;

        const hasEnvelope = fadeInFrames > 0 || fadeOutFrames > 0;

        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <Audio
              src={staticFile(sfx.src)}
              volume={
                hasEnvelope
                  ? (frame: number) =>
                      interpolate(
                        frame,
                        [
                          0,
                          fadeInFrames || 1,
                          durationInFrames - (fadeOutFrames || 1),
                          durationInFrames,
                        ],
                        [fadeInFrames > 0 ? 0 : vol, vol, vol, fadeOutFrames > 0 ? 0 : vol],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                      )
                  : vol
              }
            />
          </Sequence>
        );
      })}
    </>
  );
};
```

---

## Common SFX Categories

| Category     | Examples                                    | Typical Volume |
|--------------|---------------------------------------------|----------------|
| Transitions  | Whoosh, swoosh, swipe                       | 0.3 - 0.6      |
| UI           | Click, pop, tap, toggle                     | 0.2 - 0.5      |
| Notifications| Ding, chime, bell, success                  | 0.4 - 0.7      |
| Impacts      | Thud, boom, slam                            | 0.5 - 0.8      |
| Ambient      | Room tone, wind, rain                       | 0.1 - 0.3      |
| Musical      | Rise, stinger, hit                          | 0.3 - 0.6      |

---

## SFX File Organization

```
public/
  audio/
    sfx/
      transitions/
        whoosh-01.mp3
        whoosh-02.mp3
        swoosh.mp3
      ui/
        click.mp3
        pop.mp3
        toggle.mp3
      notifications/
        ding.mp3
        success.mp3
        error.mp3
      impacts/
        thud.mp3
        boom.mp3
```

---

## Pitfalls

1. **Sequence durationInFrames too short.** If the sequence ends before the audio finishes, the audio is cut off abruptly. Set `durationInFrames` to at least the length of the audio clip.

2. **SFX volume too high.** Sound effects over 0.7 volume often overpower narration and music. Mix at 0.3-0.5 relative to narration at 1.0.

3. **Timing precision.** At 30fps, each frame is 33ms. Sound effects cannot be placed with sub-frame precision. For tight sync, use 60fps.

4. **Too many simultaneous Audio components.** While Remotion handles mixing, rendering performance degrades with 10+ simultaneous Audio elements. Combine multiple SFX into pre-mixed clips when possible.

5. **Missing audio files.** Unlike images, missing audio files do not always produce visible errors. The render succeeds silently with no sound. Validate all SFX paths before rendering.
