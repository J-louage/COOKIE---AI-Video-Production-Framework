# Audio Mixing Guidelines

## Purpose

This document defines the audio mixing standards for the Cookie pipeline, covering loudness targets, music ducking, sound effect placement, silence usage, platform-specific delivery specs, fade rules, frequency separation, and the FFmpeg commands to implement them. These guidelines ensure professional-quality audio across all output formats.

---

## Target Loudness Levels

### Primary Standard: LUFS (Loudness Units Full Scale)

LUFS is the industry standard for measuring perceived loudness. All Cookie pipeline audio is measured and delivered in LUFS.

| Element | Target Level | Tolerance |
|---------|-------------|-----------|
| Narration (integrated) | -14 LUFS | +/- 1 LUFS |
| Dialogue | -14 LUFS | +/- 1 LUFS |
| Music (standalone) | -14 LUFS | +/- 1 LUFS |
| Music (under narration) | -20 to -26 LUFS | Depends on ducking depth |
| Sound effects (peak) | -10 to -6 dBTP | Context-dependent |
| Final mix (integrated) | -14 LUFS | +/- 0.5 LUFS |

### Platform-Specific Loudness Targets

| Platform | Integrated Loudness | True Peak Max | Loudness Range | Notes |
|----------|-------------------|--------------|----------------|-------|
| **YouTube** | -14 LUFS | -1 dBTP | 7–15 LRA | YouTube normalizes loud content down but does NOT normalize quiet content up. Target -14 precisely. |
| **TikTok** | -14 LUFS | -1 dBTP | 7–12 LRA | Mobile playback. Ensure clarity at low volumes. |
| **Instagram** | -14 LUFS | -1 dBTP | 7–12 LRA | Same as TikTok. Mobile-first. |
| **Spotify (podcasts)** | -14 LUFS | -1 dBTP | 5–10 LRA | Tight loudness range for consistent listening. |
| **Broadcast TV** | -24 LUFS | -2 dBTP | 5–20 LRA | EBU R128 standard. Significantly quieter than web. |
| **Cinema** | -24 LUFS | -2 dBTP | Up to 20 LRA | Wide dynamic range. Professional monitoring required. |
| **Podcast (general)** | -16 LUFS | -1 dBTP | 5–10 LRA | Slightly quieter than YouTube for comfortable listening. |

### Measuring Loudness

**FFmpeg loudnorm filter (measurement pass):**
```bash
ffmpeg -i input.mp3 -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | tail -12
```

This outputs measured values:
```json
{
  "input_i": "-18.52",
  "input_tp": "-3.21",
  "input_lra": "8.70",
  "input_thresh": "-29.12",
  "output_i": "-14.00",
  "output_tp": "-1.00",
  "output_lra": "7.80",
  "output_thresh": "-24.60",
  "normalization_type": "dynamic",
  "target_offset": "0.00"
}
```

**Two-pass normalization (recommended for quality):**
```bash
# Pass 1: Measure
measured=$(ffmpeg -i input.mp3 -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | tail -12)

# Extract values (example using jq)
input_i=$(echo "$measured" | jq -r '.input_i')
input_tp=$(echo "$measured" | jq -r '.input_tp')
input_lra=$(echo "$measured" | jq -r '.input_lra')
input_thresh=$(echo "$measured" | jq -r '.input_thresh')
offset=$(echo "$measured" | jq -r '.target_offset')

# Pass 2: Apply
ffmpeg -i input.mp3 -af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=${input_i}:measured_TP=${input_tp}:measured_LRA=${input_lra}:measured_thresh=${input_thresh}:offset=${offset}:linear=true" output.mp3
```

---

## Music Ducking

Music ducking reduces the background music volume when narration or dialogue is present, then raises it back when speech stops.

### Ducking Depth

| Context | Reduction | Resulting Music Level | Description |
|---------|-----------|----------------------|-------------|
| Light ducking | -6 dB | Clearly audible music bed | Music is present, narration slightly favored |
| Standard ducking | -9 dB | Subtle music presence | Standard for most narration over music |
| Heavy ducking | -12 dB | Barely perceptible music | Narration fully dominant, music is a whisper |
| Full ducking | -18 dB+ | Music essentially gone | Only use for very speech-heavy or quiet narration |

### Ducking Timing

| Phase | Duration | Description |
|-------|----------|-------------|
| Pre-duck ramp | 0.3–0.5s | Music begins fading before narration starts. Gives the ear time to adjust. |
| Full duck hold | Duration of narration | Music stays at reduced level throughout speech. |
| Post-duck recovery | 0.5–1.0s | Music gradually returns to full level after narration ends. |
| Minimum gap | 1.0s | If the gap between narration segments is shorter than this, keep the duck held. Constant pumping sounds unprofessional. |

### FFmpeg Duck Implementation

**Simple volume reduction (static duck):**
```bash
# Reduce music to 30% volume (approximately -10dB)
ffmpeg -i music.mp3 -filter:a "volume=0.3" music-ducked.mp3
```

**Sidechain-style ducking (automated, based on narration presence):**
```bash
# Mix narration over ducked music using sidechaincompress
ffmpeg -i narration.mp3 -i music.mp3 \
  -filter_complex "[1:a]sidechaincompress=threshold=0.015:ratio=6:attack=200:release=1000:level_in=1:level_sc=1[ducked];[0:a][ducked]amix=inputs=2:duration=longest:weights=1 0.3" \
  -c:a libmp3lame -b:a 192k mixed.mp3
```

**Manual duck with volume automation (precise control):**
```bash
# Duck music between timestamps (e.g., narration at 5-15s and 20-30s)
ffmpeg -i music.mp3 -filter:a "volume='if(between(t,4.5,15.5),0.2,if(between(t,19.5,30.5),0.2,1))':eval=frame" music-ducked.mp3
```

---

## Sound Effect Placement

### Timing Principles

| Principle | Timing | Rationale |
|-----------|--------|-----------|
| **Pre-hit for impact** | SFX starts 0.05s (50ms) before the visual event | Creates a perception of perfect sync. The brain processes audio faster than video, so a slight audio lead feels simultaneous. |
| **Exact sync for subtle effects** | SFX at frame-exact position | Footsteps, clicks, taps — these should be frame-accurate. |
| **Post-hit for weight** | SFX peaks 0.05–0.1s after visual | Creates a sense of heaviness and follow-through. Good for explosions, heavy objects landing. |
| **Sustained for ambience** | Continuous loop | Environmental sounds (wind, rain, crowd) run continuously under the scene. |

### SFX Volume Guidelines

| SFX Type | Level Relative to Narration | Notes |
|----------|---------------------------|-------|
| Ambient/environmental | -12 to -18 dB below narration | Subtle presence, should not compete |
| Transition whooshes | -6 to -9 dB below narration | Noticeable but brief |
| Impact effects | -3 to 0 dB relative to narration | Punchy, attention-grabbing (brief peaks OK) |
| UI sounds (clicks, pops) | -9 to -12 dB below narration | Subtle, functional |
| Musical stingers | -6 dB below narration | Noticeable but does not overpower |

### SFX Layering

For rich, professional sound design, layer multiple SFX for a single event:

```
Impact event (e.g., door slam):
  Layer 1: Low thud (body/weight) — 80–200Hz
  Layer 2: Mid crack (surface material) — 500Hz–2kHz
  Layer 3: High rattle (reverb/decay) — 2kHz–8kHz
  Combined: Full-spectrum, realistic impact
```

---

## Silence as a Tool

Silence is as important as sound in professional audio. Strategic pauses create emphasis, pacing, and breathing room.

### Pause Durations

| Pause Type | Duration | Use Case |
|-----------|----------|----------|
| **Breath pause** | 0.2–0.4s | Natural gap between sentences. Already present in quality TTS. |
| **Emphasis pause** | 0.5–1.0s | Before or after a key statement. "And the result was... [pause] ...extraordinary." |
| **Section break** | 1.0–2.0s | Between major topic changes or scene transitions. |
| **Dramatic pause** | 1.5–3.0s | Before a reveal, plot twist, or emotional beat. Music may continue. |
| **Cold open silence** | 0.5–1.0s | Start of video. Brief silence before narration begins. Sets the stage. |

### Silence Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| No pauses at all | Feels rushed, fatiguing for the listener | Add 0.3s between sentences minimum |
| Pauses too uniform | Feels robotic, monotonous | Vary pause length by 0.1–0.3s |
| Dead silence (absolute zero) | Feels unnatural, broken | Use room tone or very subtle ambience instead of pure digital silence |
| Pause too long without music | Feels like an error, viewer checks their device | Keep music/ambience running during long pauses |

---

## Fade Rules

### Standard Fade Durations

| Element | Fade In | Fade Out | Notes |
|---------|---------|----------|-------|
| Background music | 1.0–2.0s | 2.0–3.0s | Fade out should be longer than fade in for a natural ending feel |
| Sound effects | 0.1–0.3s | 0.3–0.5s | Quick and clean. Should not call attention to themselves. |
| Ambience/room tone | 1.5–3.0s | 2.0–4.0s | Slow, gradual transitions feel natural |
| Narration | 0.05–0.1s (micro-fade) | 0.05–0.1s | Prevents pops/clicks at edit points. Should be imperceptible. |
| Transition stinger | 0.0s (hard start) | 0.5–1.0s (natural decay) | Musical accents often start hard and ring out |

### FFmpeg Fade Commands

```bash
# Fade in over 2 seconds
ffmpeg -i input.mp3 -af "afade=t=in:st=0:d=2" output.mp3

# Fade out over 3 seconds (need to know total duration)
duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 input.mp3)
fade_start=$(echo "$duration - 3" | bc)
ffmpeg -i input.mp3 -af "afade=t=out:st=${fade_start}:d=3" output.mp3

# Both fade in and fade out
ffmpeg -i input.mp3 -af "afade=t=in:st=0:d=2,afade=t=out:st=${fade_start}:d=3" output.mp3

# Crossfade between two audio files (2-second overlap)
ffmpeg -i track1.mp3 -i track2.mp3 -filter_complex "acrossfade=d=2:c1=tri:c2=tri" output.mp3
```

### Fade Curves

| Curve | Shape | When to Use |
|-------|-------|-------------|
| **Linear** | Straight line | Rarely. Sounds unnatural for most content. |
| **Logarithmic** | Fast initial change, slow tail | Music fade-outs. Mimics natural sound decay. |
| **Exponential** | Slow initial change, fast end | Fade-ins. Builds gradually. |
| **S-curve** | Slow start, fast middle, slow end | Crossfades. Smoothest transitions. |
| **Triangular** | Linear in, linear out | Quick crossfades. Simple and effective. |

FFmpeg fade curve options: `tri` (triangular), `qsin` (quarter sine), `hsin` (half sine), `esin` (exponential sine), `log` (logarithmic), `ipar` (inverted parabola), `qua` (quadratic), `cub` (cubic), `squ` (square root), `cbr` (cubic root), `par` (parabola), `exp` (exponential), `iqsin`, `ihsin`, `dese`, `desi`, `losi`, `sinc`, `isinc`, `nofade`.

---

## Frequency Separation

When multiple audio elements play simultaneously, separate them by frequency to prevent masking (one element hiding another).

### Frequency Allocation

| Element | Primary Frequency Range | EQ Treatment |
|---------|------------------------|-------------|
| **Narration/dialogue** | 100Hz–8kHz (presence: 2–4kHz) | Boost at 2–4kHz for clarity. High-pass at 80Hz to remove rumble. |
| **Background music** | Full range, but reduced in narration frequencies | Cut at 2–4kHz by 3–6dB to make room for narration. Low-cut at 100Hz under narration. |
| **Sound effects** | Varies by effect type | Should occupy frequency ranges not used by narration at that moment. |
| **Ambience** | Typically 200Hz–6kHz | Low level. Fills gaps without competing. |

### EQ for Voice Clarity Under Music

```bash
# Low-cut music at 100Hz when under narration
ffmpeg -i music.mp3 -af "highpass=f=100" music-lowcut.mp3

# Presence boost for narration at 3kHz
ffmpeg -i narration.mp3 -af "equalizer=f=3000:t=q:w=1:g=3" narration-boosted.mp3

# Cut music at 2-4kHz to make room for narration
ffmpeg -i music.mp3 -af "equalizer=f=3000:t=q:w=2:g=-4" music-scooped.mp3
```

### De-essing

Sibilance (harsh "s" and "sh" sounds) can be fatiguing, especially in TTS output:

```bash
# Simple de-essing (reduce 5-8kHz harshness)
ffmpeg -i narration.mp3 -af "equalizer=f=6500:t=q:w=2:g=-3" narration-deessed.mp3
```

---

## FFmpeg Commands for Basic Mixing

### Mix Two Audio Tracks

```bash
# Simple mix: narration + music (equal levels)
ffmpeg -i narration.mp3 -i music.mp3 \
  -filter_complex "amix=inputs=2:duration=longest" \
  -c:a libmp3lame -b:a 192k mixed.mp3

# Weighted mix: narration at full volume, music at 30%
ffmpeg -i narration.mp3 -i music.mp3 \
  -filter_complex "amix=inputs=2:duration=longest:weights=1 0.3" \
  -c:a libmp3lame -b:a 192k mixed.mp3
```

### Mix Three Audio Tracks

```bash
# Narration + music + ambience
ffmpeg -i narration.mp3 -i music.mp3 -i ambience.mp3 \
  -filter_complex "amix=inputs=3:duration=longest:weights=1 0.25 0.1" \
  -c:a libmp3lame -b:a 192k mixed.mp3
```

### Delay an Audio Track

```bash
# Delay music start by 3 seconds
ffmpeg -i narration.mp3 -i music.mp3 \
  -filter_complex "[1:a]adelay=3000|3000[delayed];[0:a][delayed]amix=inputs=2:duration=longest:weights=1 0.3" \
  -c:a libmp3lame -b:a 192k mixed.mp3
```

### Combine Audio with Video

```bash
# Replace video audio with new mix
ffmpeg -i video.mp4 -i mixed-audio.mp3 \
  -c:v copy -c:a aac -b:a 192k \
  -map 0:v:0 -map 1:a:0 \
  -shortest \
  final-output.mp4
```

### Add Audio to Silent Video

```bash
ffmpeg -i silent-video.mp4 -i narration.mp3 \
  -c:v copy -c:a aac -b:a 192k \
  -shortest \
  video-with-audio.mp4
```

---

## Quality Checklist

Before delivering any audio mix, verify:

- [ ] Integrated loudness is within 0.5 LUFS of target (e.g., -14 LUFS for YouTube).
- [ ] True peak does not exceed -1 dBTP.
- [ ] Narration is clearly intelligible over music at all points.
- [ ] Music ducking transitions are smooth (no pumping or abrupt volume changes).
- [ ] No clipping or distortion at any point in the mix.
- [ ] Fade in/out durations are appropriate and smooth.
- [ ] Silence gaps feel intentional, not accidental.
- [ ] Sound effects are synced to visual events (within 50ms).
- [ ] No unwanted noise, hum, or artifacts.
- [ ] Audio format matches delivery specification (sample rate, bit depth, codec).

---

## Advanced Mixing Patterns

These patterns combine multiple techniques for complex, production-quality audio workflows.

### Multi-Layer Mix with Per-Track Processing

When combining narration, ducked music, and timed sound effects in a single command, apply volume and delay adjustments per track before mixing:

```bash
# Multi-layer mix: narration at full volume, music ducked to 30%, SFX delayed by 3s at 50%
ffmpeg -i narration.mp3 -i music.mp3 -i sfx.mp3 \
  -filter_complex \
    "[1:a]volume=0.3[music];
     [2:a]adelay=3000|3000,volume=0.5[sfx];
     [0:a][music][sfx]amix=inputs=3:duration=longest:dropout_transition=2[out]" \
  -map "[out]" mixed.mp3
```

**Parameter breakdown:**

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `volume=0.3` on music | -10.5 dB reduction | Keeps music as a subtle bed under narration |
| `adelay=3000\|3000` on SFX | 3-second delay (both channels) | Times the SFX to hit at the right moment in the timeline |
| `volume=0.5` on SFX | -6 dB reduction | Prevents SFX from overpowering narration |
| `dropout_transition=2` | 2-second fade on dropout | If any input ends early, its channel fades out over 2 seconds instead of causing an abrupt volume jump |

**When to use:** Any scene that layers narration over background music with punctual sound effects (whooshes, impacts, stingers). This is the standard pattern for most Cookie pipeline scenes.

### Extended Multi-Layer with EQ Separation

For maximum clarity, combine per-track volume control with frequency separation before mixing:

```bash
# Full production mix: EQ-separated narration + music + SFX + ambience
ffmpeg -i narration.mp3 -i music.mp3 -i sfx.mp3 -i ambience.mp3 \
  -filter_complex \
    "[0:a]highpass=f=80,equalizer=f=3000:t=q:w=1:g=3[voice];
     [1:a]equalizer=f=3000:t=q:w=2:g=-4,volume=0.3[music];
     [2:a]adelay=2500|2500,volume=0.5[sfx];
     [3:a]volume=0.1[amb];
     [voice][music][sfx][amb]amix=inputs=4:duration=longest:dropout_transition=2[out]" \
  -map "[out]" -c:a libmp3lame -b:a 192k mixed.mp3
```

This applies a high-pass filter and presence boost to narration, scoops the 2-4kHz range from music, delays and attenuates SFX, and keeps ambience at a barely perceptible level.

### Multi-Layer with Sidechain Ducking

Combine sidechaincompress with additional SFX layers for fully automated ducking with sound effects:

```bash
# Sidechain-ducked music + narration + timed SFX
ffmpeg -i narration.mp3 -i music.mp3 -i sfx.mp3 \
  -filter_complex \
    "[1:a][0:a]sidechaincompress=threshold=0.02:ratio=6:attack=200:release=1000[ducked];
     [2:a]adelay=3000|3000,volume=0.5[sfx];
     [0:a][ducked][sfx]amix=inputs=3:duration=longest:dropout_transition=2[out]" \
  -map "[out]" -c:a libmp3lame -b:a 192k mixed.mp3
```

This lets the narration automatically duck the music via sidechain compression while separately mixing in a delayed sound effect. The music volume responds dynamically to narration presence rather than using a static volume reduction.
