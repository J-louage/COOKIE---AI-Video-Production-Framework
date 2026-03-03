# FFmpeg Filter Patterns

## Purpose

Quick-reference catalog of FFmpeg filter patterns and inspection commands used in the Cookie pipeline. These patterns cover frame extraction, media inspection, audio operations, advanced filter graphs, and the concat file format specification.

---

## Frame Extraction

### Extract Frame at Specific Timestamp

```bash
ffmpeg -ss {time} -i {input} -vframes 1 -q:v 2 {output.png}
```

**Examples:**
```bash
# At 5 seconds
ffmpeg -ss 00:00:05.000 -i scene.mp4 -vframes 1 -q:v 2 frame.png

# At 1 minute 23 seconds
ffmpeg -ss 00:01:23.000 -i scene.mp4 -vframes 1 -q:v 2 frame.png

# At 0.5 seconds (sub-second precision)
ffmpeg -ss 0.5 -i scene.mp4 -vframes 1 -q:v 2 frame.png
```

**Notes:**
- `-ss` before `-i` = fast seek (input seeking). Fast but may be off by a few frames.
- `-ss` after `-i` = slow seek (output seeking). Slower but frame-accurate.
- Use `-q:v 2` for high-quality output. Range: 1 (best) to 31 (worst). Only applies to JPEG output; ignored for PNG.

### Last Frame Extraction

```bash
ffmpeg -sseof -0.04 -i {input} -vframes 1 -q:v 2 {output.png}
```

**Frame rate adjustments:**
```bash
# 24fps — seek to ~1 frame before end
ffmpeg -sseof -0.042 -i {input} -vframes 1 -q:v 2 {output.png}

# 25fps
ffmpeg -sseof -0.04 -i {input} -vframes 1 -q:v 2 {output.png}

# 30fps
ffmpeg -sseof -0.033 -i {input} -vframes 1 -q:v 2 {output.png}

# 60fps
ffmpeg -sseof -0.017 -i {input} -vframes 1 -q:v 2 {output.png}
```

### First Frame Extraction

```bash
ffmpeg -ss 0 -i {input} -vframes 1 -q:v 2 {output.png}
```

### Extract Multiple Frames at Regular Intervals

```bash
# One frame per second
ffmpeg -i {input} -vf "fps=1" frames/frame-%04d.png

# One frame every 2 seconds
ffmpeg -i {input} -vf "fps=1/2" frames/frame-%04d.png

# One frame every 5 seconds
ffmpeg -i {input} -vf "fps=1/5" frames/frame-%04d.png
```

---

## Media Inspection with ffprobe

### Duration Measurement

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 {input}
```

**Output:** `8.040000` (duration in seconds as a decimal)

**As formatted time:**
```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 -sexagesimal {input}
```
**Output:** `duration=0:00:08.040000`

### Resolution Inspection

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 {input}
```

**Output:** `1920,1080`

### Codec Inspection

**Video codec:**
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 {input}
```
**Output:** `h264`

**Audio codec:**
```bash
ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 {input}
```
**Output:** `aac`

### Frame Rate

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 {input}
```
**Output:** `25/1` (numerator/denominator, so 25/1 = 25fps)

### Pixel Format

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of csv=p=0 {input}
```
**Output:** `yuv420p`

### Bitrate

```bash
# Overall bitrate
ffprobe -v error -show_entries format=bit_rate -of csv=p=0 {input}

# Video stream bitrate
ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of csv=p=0 {input}
```

### Audio Sample Rate

```bash
ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of csv=p=0 {input}
```
**Output:** `44100`

### Audio Channel Count

```bash
ffprobe -v error -select_streams a:0 -show_entries stream=channels -of csv=p=0 {input}
```
**Output:** `2` (stereo)

### Number of Streams

```bash
ffprobe -v error -show_entries format=nb_streams -of csv=p=0 {input}
```
**Output:** `2` (typically 1 video + 1 audio)

### Full JSON Report

```bash
ffprobe -v error -show_format -show_streams -of json {input}
```

Produces a comprehensive JSON report of all streams, codecs, durations, bitrates, and metadata. Useful for debugging.

### Batch Inspection Script

Inspect all clips in a directory at once:

```bash
#!/bin/bash
echo "File | Duration | Resolution | Video Codec | Audio Codec | FPS"
echo "---- | -------- | ---------- | ----------- | ----------- | ---"

for f in "$1"/*.mp4; do
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  res=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$f")
  vcodec=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$f")
  acodec=$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "$f" 2>/dev/null || echo "none")
  fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$f")

  printf "%-30s | %8.2fs | %10s | %11s | %11s | %s\n" "$(basename $f)" "$dur" "$res" "$vcodec" "$acodec" "$fps"
done
```

---

## Audio Operations

### Simple Audio Extraction (Copy Codec)

```bash
ffmpeg -i {input} -vn -acodec copy {output.aac}
```

- `-vn` discard video.
- `-acodec copy` copies audio without re-encoding.

### Audio Extraction to WAV

```bash
ffmpeg -i {input} -vn -acodec pcm_s16le -ar 44100 -ac 2 {output.wav}
```

### Audio Extraction to MP3

```bash
ffmpeg -i {input} -vn -acodec libmp3lame -ab 192k {output.mp3}
```

### Audio Duck (Volume Reduction for Background Music)

Reduce music volume for use under narration:

```bash
# Reduce to 30% volume (approximately -10dB)
ffmpeg -i music.mp3 -filter:a "volume=0.3" music-ducked.mp3

# Reduce to 20% volume (approximately -14dB)
ffmpeg -i music.mp3 -filter:a "volume=0.2" music-ducked.mp3

# Reduce by exact dB amount
ffmpeg -i music.mp3 -filter:a "volume=-10dB" music-ducked.mp3
```

### Audio Fade In/Out

```bash
# Fade in over 2 seconds from the start
ffmpeg -i {input} -af "afade=t=in:st=0:d=2" {output}

# Fade out over 3 seconds ending at the file's end
ffmpeg -i {input} -af "afade=t=out:st={start_time}:d=3" {output}

# Both fade in (2s) and fade out (3s) — need to know duration
duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 {input})
fade_out_start=$(echo "$duration - 3" | bc)
ffmpeg -i {input} -af "afade=t=in:st=0:d=2,afade=t=out:st=${fade_out_start}:d=3" {output}
```

### Audio Normalization (Loudness)

```bash
# Two-pass loudness normalization to -14 LUFS (YouTube standard)
# Pass 1: Measure current loudness
ffmpeg -i {input} -af loudnorm=I=-14:TP=-2:LRA=11:print_format=json -f null - 2>&1 | tail -12

# Pass 2: Apply normalization using measured values
ffmpeg -i {input} -af "loudnorm=I=-14:TP=-2:LRA=11:measured_I={measured_I}:measured_TP={measured_TP}:measured_LRA={measured_LRA}:measured_thresh={measured_thresh}:offset={offset}:linear=true" {output}
```

### Silence Trimming

```bash
# Remove silence from the beginning (detect silence below -50dB for > 0.5s)
ffmpeg -i {input} -af "silenceremove=start_periods=1:start_silence=0.5:start_threshold=-50dB" {output}

# Remove silence from both beginning and end
ffmpeg -i {input} -af "silenceremove=start_periods=1:start_silence=0.5:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_silence=0.5:start_threshold=-50dB,areverse" {output}
```

---

## Concat File Format Specification

The concat demuxer reads a text file with the following format:

### Basic Format

```
file 'path/to/clip-01.mp4'
file 'path/to/clip-02.mp4'
file 'path/to/clip-03.mp4'
```

### Rules

1. Each line starts with the directive `file` followed by a space and a quoted path.
2. Paths must be enclosed in single quotes.
3. Paths can be relative (to the location of the text file) or absolute.
4. No blank lines are allowed between entries.
5. No comments are allowed in the file.
6. Lines must use LF line endings (not CRLF). On Windows, ensure the file is saved with Unix line endings.
7. Special characters in filenames must be escaped: single quote as `'\''`, backslash as `\\`.

### Advanced Directives

```
# Duration override (useful for truncating clips)
file 'clip-01.mp4'
duration 5.0

# In/out points (extract a segment of the clip)
file 'clip-02.mp4'
inpoint 2.0
outpoint 7.0

file 'clip-03.mp4'
```

### Generating the File Programmatically

```bash
# From a directory of clips (sorted by name)
for clip in $(ls -1 scene-03/clip-*.mp4 | sort -V); do
  echo "file '$(realpath "$clip")'"
done > clips.txt

# From an array of clip paths
clips=("clip-A.mp4" "clip-B.mp4" "clip-C.mp4")
for clip in "${clips[@]}"; do
  echo "file '$clip'"
done > clips.txt
```

### Merge Command

```bash
ffmpeg -f concat -safe 0 -i clips.txt -c copy output.mp4
```

- `-f concat` — Use the concat demuxer.
- `-safe 0` — Required for absolute paths or paths outside the current directory.
- `-c copy` — Stream copy (no re-encoding). Use only when all clips share the same codec/resolution/fps.

---

## Validation Commands

### Compare Two Files for Merge Compatibility

```bash
#!/bin/bash
# Check if two video files can be concatenated with -c copy
file_a="$1"
file_b="$2"

get_props() {
  local f="$1"
  echo "$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt -of csv=p=0 "$f")"
}

props_a=$(get_props "$file_a")
props_b=$(get_props "$file_b")

if [ "$props_a" = "$props_b" ]; then
  echo "COMPATIBLE: Files can be merged with -c copy"
  echo "Properties: $props_a"
else
  echo "INCOMPATIBLE: Files require re-encoding for merge"
  echo "File A: $props_a"
  echo "File B: $props_b"
fi
```

### Verify Merged Output Integrity

```bash
#!/bin/bash
# Verify a merged file against its source clips
merged="$1"
shift
clips=("$@")

# Check merged duration vs sum of inputs
merged_dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$merged")
expected_dur=0
for clip in "${clips[@]}"; do
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$clip")
  expected_dur=$(echo "$expected_dur + $dur" | bc)
done

diff=$(echo "$merged_dur - $expected_dur" | bc)
abs_diff=$(echo "$diff" | tr -d '-')

echo "Merged duration:   ${merged_dur}s"
echo "Expected duration: ${expected_dur}s"
echo "Difference:        ${diff}s"

if (( $(echo "$abs_diff < 0.1" | bc -l) )); then
  echo "STATUS: PASS (within 0.1s tolerance)"
else
  echo "STATUS: FAIL (exceeds 0.1s tolerance)"
fi
```

---

## Advanced Filter Patterns

### Audio Ducking with sidechaincompress

Automatically reduce music volume when narration/voice is detected. The `sidechaincompress` filter uses the narration track as the sidechain signal to compress (duck) the music track.

```bash
# Basic sidechain ducking: music ducks under narration
ffmpeg \
  -i narration.wav \
  -i music.wav \
  -filter_complex \
    "[1:a]sidechaincompress=threshold=0.02:ratio=10:attack=200:release=1000:level_in=1:level_sc=1[ducked]; \
     [0:a][ducked]amix=inputs=2:duration=longest:weights=1 0.3[out]" \
  -map "[out]" -c:a aac -b:a 192k \
  mixed.mp4
```

**Parameters explained:**

| Parameter | Value | Effect |
|-----------|-------|--------|
| `threshold` | `0.02` | Signal level above which compression kicks in (lower = more sensitive) |
| `ratio` | `10` | Compression ratio (10:1 = aggressive ducking) |
| `attack` | `200` | Milliseconds before compression ramps up (prevents cutting off word starts) |
| `release` | `1000` | Milliseconds for compression to release after voice stops |
| `level_in` | `1` | Input gain for the music track |
| `level_sc` | `1` | Sidechain signal gain (the narration detection sensitivity) |

**Gentle ducking (podcast style):**

```bash
ffmpeg \
  -i narration.wav \
  -i music.wav \
  -filter_complex \
    "[1:a]sidechaincompress=threshold=0.03:ratio=4:attack=500:release=2000[ducked]; \
     [0:a][ducked]amix=inputs=2:duration=longest:weights=1 0.2[out]" \
  -map "[out]" -c:a aac -b:a 192k \
  mixed-gentle.mp4
```

**Aggressive ducking (narration-first, music nearly silent during speech):**

```bash
ffmpeg \
  -i narration.wav \
  -i music.wav \
  -filter_complex \
    "[1:a]sidechaincompress=threshold=0.01:ratio=20:attack=100:release=500[ducked]; \
     [0:a][ducked]amix=inputs=2:duration=longest:weights=1 0.15[out]" \
  -map "[out]" -c:a aac -b:a 192k \
  mixed-aggressive.mp4
```

---

### Multi-Track Audio Mixing with amix/amerge

#### amix — Downmix Multiple Tracks to Stereo

Mix multiple audio sources into a single stereo output. Each input is weighted to control relative volume.

```bash
# Mix 3 tracks: narration (full volume), music (30%), SFX (50%)
ffmpeg \
  -i narration.wav \
  -i music.wav \
  -i sfx.wav \
  -filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest:weights=1 0.3 0.5[out]" \
  -map "[out]" -c:a aac -b:a 192k \
  mixed.aac
```

**Parameters:**
- `inputs=3` — Number of input audio streams.
- `duration=longest` — Output duration matches the longest input. Alternatives: `shortest`, `first`.
- `weights=1 0.3 0.5` — Relative volume of each input (space-separated).

#### amerge — Combine Mono Tracks into Multi-Channel

```bash
# Merge two mono tracks into stereo
ffmpeg \
  -i left-channel.wav \
  -i right-channel.wav \
  -filter_complex "[0:a][1:a]amerge=inputs=2[out]" \
  -map "[out]" -ac 2 \
  stereo-output.wav
```

#### Mix Audio into Video

```bash
# Replace video's audio with a mix of narration + music
ffmpeg \
  -i video.mp4 \
  -i narration.wav \
  -i music.wav \
  -filter_complex "[1:a][2:a]amix=inputs=2:duration=first:weights=1 0.3[mixed]" \
  -map 0:v -map "[mixed]" \
  -c:v copy -c:a aac -b:a 192k \
  -shortest \
  video-with-mix.mp4
```

---

### Subtitle Burn-in with ass/subtitles Filter

#### Hardcoded Subtitles (Burned into Video)

Subtitles become part of the video pixels and cannot be turned off by the viewer.

```bash
# Burn SRT subtitles with default styling
ffmpeg -i {input} \
  -vf "subtitles={subtitle.srt}" \
  -c:v libx264 -crf 23 -c:a copy \
  {output}

# Burn ASS subtitles (preserves all ASS styling: fonts, colors, positions)
ffmpeg -i {input} \
  -vf "ass={subtitle.ass}" \
  -c:v libx264 -crf 23 -c:a copy \
  {output}

# Burn SRT with custom styling overrides
ffmpeg -i {input} \
  -vf "subtitles={subtitle.srt}:force_style='FontName=Arial,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Shadow=1,MarginV=40'" \
  -c:v libx264 -crf 23 -c:a copy \
  {output}
```

**Common force_style parameters:**

| Parameter | Example | Effect |
|-----------|---------|--------|
| `FontName` | `Arial` | Font face |
| `FontSize` | `24` | Font size in pixels |
| `PrimaryColour` | `&H00FFFFFF` | Text color (ABGR hex: white) |
| `OutlineColour` | `&H00000000` | Outline color (black) |
| `BackColour` | `&H80000000` | Background/shadow color (semi-transparent black) |
| `Outline` | `2` | Outline thickness in pixels |
| `Shadow` | `1` | Shadow depth in pixels |
| `MarginV` | `40` | Vertical margin from bottom |
| `Alignment` | `2` | Position (2=bottom-center, 8=top-center, 5=center) |

#### Softcoded Subtitles (Embedded as Separate Stream)

Subtitles are embedded as a toggleable stream in the container.

```bash
# Embed SRT into MP4 (mov_text format)
ffmpeg -i {input} -i {subtitle.srt} \
  -c:v copy -c:a copy -c:s mov_text \
  {output.mp4}

# Embed ASS into MKV (keeps full ASS styling)
ffmpeg -i {input} -i {subtitle.ass} \
  -c:v copy -c:a copy -c:s ass \
  {output.mkv}

# Embed multiple subtitle tracks
ffmpeg -i {input} -i english.srt -i french.srt \
  -c:v copy -c:a copy \
  -c:s mov_text \
  -metadata:s:s:0 language=eng -metadata:s:s:0 title="English" \
  -metadata:s:s:1 language=fra -metadata:s:s:1 title="French" \
  {output.mp4}
```

---

### Crop to Aspect Ratio

#### Center Crop

Crop from center to achieve the target aspect ratio, removing equal amounts from each side.

```bash
# 16:9 → 9:16 (vertical): crop width from center
ffmpeg -i {input} -vf "crop=ih*9/16:ih" {output}

# 16:9 → 1:1 (square): crop width from center
ffmpeg -i {input} -vf "crop=ih:ih" {output}

# 16:9 → 4:5 (portrait): crop width from center
ffmpeg -i {input} -vf "crop=ih*4/5:ih" {output}

# 16:9 → 21:9 (ultrawide): crop height from center
ffmpeg -i {input} -vf "crop=iw:iw*9/21" {output}
```

#### Crop Formula Reference

```
crop=out_w:out_h:x:y

Default x = (in_w - out_w) / 2   (center horizontally)
Default y = (in_h - out_h) / 2   (center vertically)
```

#### Safe Zone Awareness

When cropping, keep critical content within the center 80% to account for platform UI overlays (captions, buttons, profile info).

```bash
# 9:16 crop with 10% safe zone inset (slightly narrower crop)
ffmpeg -i {input} \
  -vf "crop=ih*9/16*0.9:ih*0.9,scale=1080:1920" \
  {output}

# Verify safe zone: draw a rectangle showing the safe area
ffmpeg -i {input} \
  -vf "drawbox=x=iw*0.1:y=ih*0.1:w=iw*0.8:h=ih*0.8:color=red@0.5:t=2" \
  -vframes 1 safe-zone-check.png
```

---

### Scale with Padding (Letterbox)

Fit content into a target resolution without cropping by adding black bars (letterbox or pillarbox).

```bash
# Scale to fit 1080x1920 (vertical) with letterbox
ffmpeg -i {input} \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black" \
  {output}

# Scale to fit 1080x1080 (square) with pillarbox
ffmpeg -i {input} \
  -vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:black" \
  {output}

# Scale to fit with colored padding (dark gray instead of black)
ffmpeg -i {input} \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x1a1a1a" \
  {output}

# Scale to fit with blurred background (instead of black bars)
ffmpeg -i {input} \
  -filter_complex \
    "[0:v]scale=1080:1920,boxblur=20:20[bg]; \
     [0:v]scale=1080:1920:force_original_aspect_ratio=decrease[fg]; \
     [bg][fg]overlay=(W-w)/2:(H-h)/2[out]" \
  -map "[out]" \
  {output}
```

**Parameters for `scale` filter:**
- `force_original_aspect_ratio=decrease` — Scale down to fit within the target, preserving aspect ratio.
- `force_original_aspect_ratio=increase` — Scale up to fill the target (some content will be cut by the pad).

---

### Color Grading with LUT3D Filter

Apply professional color grading using 3D LUT files (`.cube` format, industry standard).

```bash
# Apply a .cube LUT file
ffmpeg -i {input} \
  -vf "lut3d=cinematic-warm.cube" \
  -c:v libx264 -crf 18 -c:a copy \
  {output}

# Apply LUT with trilinear interpolation (smoother gradients)
ffmpeg -i {input} \
  -vf "lut3d=cinematic-warm.cube:interp=trilinear" \
  -c:v libx264 -crf 18 -c:a copy \
  {output}

# Apply LUT at partial strength (blend with original)
# Use the "mix" parameter in the colorbalance filter as a workaround,
# or chain with a blend between original and graded:
ffmpeg -i {input} \
  -filter_complex \
    "[0:v]split[orig][tobe_graded]; \
     [tobe_graded]lut3d=cinematic-warm.cube[graded]; \
     [orig][graded]blend=all_mode=normal:all_opacity=0.6[out]" \
  -map "[out]" -map 0:a \
  -c:v libx264 -crf 18 -c:a copy \
  {output}
```

**Interpolation methods:**

| Method | Quality | Speed |
|--------|---------|-------|
| `nearest` | Lowest | Fastest |
| `trilinear` | Good (default) | Fast |
| `tetrahedral` | Best | Slower |

#### Combine LUT with Manual Adjustments

```bash
# LUT + brightness/contrast/saturation tweaks
ffmpeg -i {input} \
  -vf "lut3d=cinematic-warm.cube,eq=brightness=0.04:contrast=1.1:saturation=1.2" \
  -c:v libx264 -crf 18 -c:a copy \
  {output}

# LUT + vignette effect
ffmpeg -i {input} \
  -vf "lut3d=cinematic-warm.cube,vignette=PI/4" \
  -c:v libx264 -crf 18 -c:a copy \
  {output}
```

---

### Normalize Audio with loudnorm (Two-Pass)

The `loudnorm` filter normalizes audio to broadcast standards. A two-pass approach is required for accurate, linear normalization.

#### Standard Targets

| Standard | Integrated Loudness (I) | True Peak (TP) | Loudness Range (LRA) |
|----------|------------------------|-----------------|-----------------------|
| YouTube / Streaming | -14 LUFS | -2 dBTP | 11 LU |
| Broadcast (EBU R128) | -23 LUFS | -1 dBTP | 7 LU |
| Podcast | -16 LUFS | -1.5 dBTP | 8 LU |
| Cinema | -24 LUFS | -2 dBTP | 15 LU |

#### Two-Pass Normalization

```bash
# Pass 1: Measure current loudness (no output file)
ffmpeg -i {input} \
  -af "loudnorm=I=-14:TP=-2:LRA=11:print_format=json" \
  -f null - 2>&1 | tail -12

# The output JSON looks like:
# {
#   "input_i" : "-24.5",
#   "input_tp" : "-3.2",
#   "input_lra" : "8.7",
#   "input_thresh" : "-35.1",
#   "output_i" : "-14.0",
#   "output_tp" : "-2.0",
#   "output_lra" : "7.5",
#   "output_thresh" : "-24.6",
#   "normalization_type" : "dynamic",
#   "target_offset" : "0.0"
# }

# Pass 2: Apply normalization with measured values (linear mode for transparency)
ffmpeg -i {input} \
  -af "loudnorm=I=-14:TP=-2:LRA=11:measured_I=-24.5:measured_TP=-3.2:measured_LRA=8.7:measured_thresh=-35.1:offset=0.0:linear=true" \
  -c:v copy \
  {output}
```

**Important:** Always use `linear=true` in Pass 2 for transparent normalization. Without it, the filter uses dynamic processing which can introduce audible artifacts.

#### Single-Pass Normalization (Quick but Less Accurate)

```bash
# Single-pass: dynamic normalization (less precise, may compress dynamics)
ffmpeg -i {input} \
  -af "loudnorm=I=-14:TP=-2:LRA=11" \
  -c:v copy \
  {output}
```

#### Normalize Audio Within a Video (Preserve Video Stream)

```bash
# Pass 1: Measure
ffmpeg -i video.mp4 \
  -af "loudnorm=I=-14:TP=-2:LRA=11:print_format=json" \
  -f null - 2>&1 | tail -12

# Pass 2: Apply (copy video, re-encode audio only)
ffmpeg -i video.mp4 \
  -c:v copy \
  -af "loudnorm=I=-14:TP=-2:LRA=11:measured_I={measured_I}:measured_TP={measured_TP}:measured_LRA={measured_LRA}:measured_thresh={measured_thresh}:offset={offset}:linear=true" \
  -c:a aac -b:a 192k \
  video-normalized.mp4
```
