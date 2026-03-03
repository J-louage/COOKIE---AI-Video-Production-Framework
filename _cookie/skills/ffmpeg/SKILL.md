# FFmpeg Skill — Merge Focus

## Purpose

Provides video processing capabilities for the Cookie pipeline, with a Phase 1 focus on scene merging via the concat demuxer and frame extraction. FFmpeg is the backbone of all video assembly, inspection, and audio extraction operations in the pipeline.

---

## Core Capability: Scene Merging (Phase 1)

The primary Phase 1 use of FFmpeg is merging individually generated video clips (from VEO) into continuous scenes and episodes. This uses the **concat demuxer**, which is the fastest and most reliable method for joining clips that share the same codec, resolution, and frame rate.

For the complete merge workflow including the first/last frame continuity approach, see `merge-scenes.md`.

### Quick Reference — Concat Merge

```bash
# 1. Create the clip list file
cat > clips.txt << EOF
file 'clip-01.mp4'
file 'clip-02.mp4'
file 'clip-03.mp4'
EOF

# 2. Merge without re-encoding (fast, lossless)
ffmpeg -f concat -safe 0 -i clips.txt -c copy scene-merged.mp4

# 3. Verify the output duration
ffprobe -v error -show_entries format=duration -of csv=p=0 scene-merged.mp4
```

---

## Frame Extraction

Frame extraction is used for the VEO continuity chain workflow (extracting the last frame of one clip to use as the first frame reference for the next clip).

### Extract First Frame

```bash
ffmpeg -ss 0 -i {input} -vframes 1 -q:v 2 first-frame.png
```

### Extract Last Frame

```bash
ffmpeg -sseof -0.04 -i {input} -vframes 1 -q:v 2 last-frame.png
```

**Note:** The `-sseof -0.04` value seeks to approximately 1 frame before the end at 25fps. Adjust based on the video's actual frame rate:
- 24fps: `-sseof -0.042`
- 25fps: `-sseof -0.04`
- 30fps: `-sseof -0.033`
- 60fps: `-sseof -0.017`

### Extract Frame at Specific Timestamp

```bash
ffmpeg -ss 00:00:05.000 -i {input} -vframes 1 -q:v 2 frame-at-5s.png
```

For more frame extraction patterns, see the Image Editing skill's `operations-catalog.md`.

---

## Audio Extraction

Extract the audio track from a VEO-generated video clip. Useful for the Sound Designer role to inspect, replace, or overlay audio.

### Extract Audio (Copy Codec)

```bash
ffmpeg -i {input.mp4} -vn -acodec copy {output.aac}
```

- `-vn` — Discard video stream.
- `-acodec copy` — Copy the audio codec without re-encoding (fastest, preserves quality).

### Extract Audio (Convert to WAV)

```bash
ffmpeg -i {input.mp4} -vn -acodec pcm_s16le -ar 44100 -ac 2 {output.wav}
```

Use WAV when the audio will be further processed (mixing, effects). WAV is lossless and widely compatible with audio tools.

### Extract Audio (Convert to MP3)

```bash
ffmpeg -i {input.mp4} -vn -acodec libmp3lame -ab 192k {output.mp3}
```

---

## Basic Operations

### Duration Check

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 {input}
# Output: 8.040000 (seconds, as a decimal)
```

**Formatted output:**
```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 {input}
```

### Resolution Check

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 {input}
# Output: 1920,1080
```

### Frame Rate Check

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 {input}
# Output: 25/1 (means 25fps)
```

### Codec Information

```bash
# Video codec
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 {input}
# Output: h264

# Audio codec
ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 {input}
# Output: aac
```

### Full Stream Information

```bash
ffprobe -v error -show_streams -of json {input}
```

### Check If Video Has Audio

```bash
audio_streams=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 {input} | wc -l)
if [ "$audio_streams" -gt 0 ]; then
  echo "Video has audio"
else
  echo "Video has no audio stream"
fi
```

---

## Error Handling

### Codec Mismatch in Concat

**Symptom:** `ffmpeg -c copy` fails or produces garbled output when concatenating clips with different codecs.

**Detection:**
```bash
# Check codecs of all clips
for clip in clip-*.mp4; do
  codec=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$clip")
  echo "$clip: $codec"
done
```

**Resolution:** If codecs differ, you must re-encode during concatenation:
```bash
ffmpeg -f concat -safe 0 -i clips.txt -c:v libx264 -crf 23 -c:a aac -b:a 192k merged.mp4
```

### Resolution Mismatch

**Symptom:** Concat fails or produces videos with visual artifacts (letterboxing, stretching) when clips have different resolutions.

**Detection:**
```bash
for clip in clip-*.mp4; do
  res=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$clip")
  echo "$clip: $res"
done
```

**Resolution:** Normalize all clips to the same resolution before concatenating:
```bash
# Resize all clips to 1920x1080 (re-encoding required)
for clip in clip-*.mp4; do
  ffmpeg -i "$clip" -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 23 -c:a aac "normalized-${clip}"
done
```

### Missing Audio Stream

**Symptom:** One or more clips have no audio track, causing concat to fail or produce silent segments.

**Detection:**
```bash
for clip in clip-*.mp4; do
  audio=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$clip" | wc -l)
  echo "$clip: audio_streams=$audio"
done
```

**Resolution:** Add a silent audio track to clips that lack one:
```bash
# Add silent audio track matching the clip's duration
duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 clip-no-audio.mp4)
ffmpeg -i clip-no-audio.mp4 -f lavfi -t "$duration" -i anullsrc=channel_layout=stereo:sample_rate=44100 -c:v copy -c:a aac -shortest clip-with-silent-audio.mp4
```

### Frame Rate Mismatch

**Symptom:** Concat produces jerky playback when clips have different frame rates.

**Detection:**
```bash
for clip in clip-*.mp4; do
  fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$clip")
  echo "$clip: $fps"
done
```

**Resolution:** Normalize frame rate (requires re-encoding):
```bash
ffmpeg -i {input} -r 25 -c:v libx264 -crf 23 -c:a aac {output}
```

### General FFmpeg Error Recovery

| Error Message | Cause | Fix |
|--------------|-------|-----|
| `No such file or directory` | Input file path is wrong | Verify path. Check working directory. Use absolute paths. |
| `Invalid data found when processing input` | Corrupt or incomplete video file | Re-download or re-generate the clip. Try `ffmpeg -err_detect ignore_err`. |
| `Output file is empty` | FFmpeg encountered an error but produced a 0-byte file | Check stderr output. Re-run with `-v verbose` for details. |
| `Avi timescale discrepancy` | Container format issue | Re-encode to MP4 first, then process. |
| `Too many packets buffered` | Memory issue with large files | Add `-max_muxing_queue_size 1024` or higher. |

---

## Phase 1 Scope

Phase 1 of the Cookie pipeline uses FFmpeg for the following operations only:

| Operation | Status | Notes |
|-----------|--------|-------|
| Clip concatenation (concat demuxer) | In scope | Primary use case |
| Frame extraction (first/last/at timestamp) | In scope | For VEO continuity chain |
| Audio extraction | In scope | For Sound Designer inspection |
| Duration/resolution/codec inspection | In scope | For validation |
| Basic audio ducking | In scope | Simple volume adjustment |

The following are **Phase 2** operations (not yet in scope):

| Operation | Phase | Notes |
|-----------|-------|-------|
| Complex video encoding/export | Phase 2 | Full export pipeline with quality presets |
| Video filters (color grading, transitions) | Phase 2 | Post-production effects |
| Subtitle burning | Phase 2 | Hardcoded subtitles |
| Multi-track audio mixing | Phase 2 | Complex audio layering |
| Adaptive bitrate packaging (HLS/DASH) | Phase 2 | Streaming delivery |
| Hardware-accelerated encoding | Phase 2 | GPU encoding for speed |

---

## Integration Points

| Role | How FFmpeg is Used |
|------|-------------------|
| **Cinematographer** | Merges VEO clips into continuous scenes. Extracts last frames for continuity chain. Validates merged output duration. |
| **Sound Designer** | Extracts audio from VEO output. Performs basic audio ducking. Inspects audio stream properties. |
| **Editor** | Assembles scenes into episodes (Phase 1: simple concat). Generates preview exports. Duration validation for pacing. |
| **Image Editing Skill** | Frame extraction feeds into image processing workflows. First-frame extraction for thumbnails. |

---

## Related Files

- `merge-scenes.md` — Detailed guide for the first/last frame continuity merge workflow
- `filter-patterns.md` — Basic FFmpeg filter patterns and inspection commands
- `_cookie/skills/image-editing/operations-catalog.md` — Frame extraction used in image workflows
- `_cookie/skills/shared/audio-mixing.md` — Audio level targets and mixing guidelines
- `_cookie/skills/shared/aspect-ratio-guide.md` — Supported video dimensions
- `encoding-presets.yaml` — Pre-configured encoding settings for YouTube, TikTok, Instagram, and Twitter
- `multi-format-export.md` — Multi-format export pipeline: crop, scale, and encode for every platform
- `_cookie/composition/ffmpeg-presets/` — Individual platform preset YAML files with full FFmpeg commands

---

## Encoding Presets

Pre-configured encoding settings for major platforms are defined in `encoding-presets.yaml`. Each preset specifies the video codec, pixel format, CRF value, encoding speed preset, audio codec/bitrate, and any platform-specific constraints (max bitrate, buffer size, file size limits).

Supported platforms:

| Preset | Codec | Resolution | CRF | Audio | Key Constraint |
|--------|-------|------------|-----|-------|----------------|
| `youtube-1080p` | libx264 | 1920x1080 | 23 | AAC 192k | max_bitrate 8M |
| `youtube-4k` | libx265 | 3840x2160 | 20 | AAC 256k | — |
| `tiktok-720p` | libx264 | 720x1280 | 23 | AAC 128k | max_bitrate 4M |
| `instagram-reels` | libx264 | 1080x1920 | 23 | AAC 128k | max_file_size 100MB |
| `instagram-square` | libx264 | 1080x1080 | 23 | AAC 128k | — |
| `twitter-video` | libx264 | 1920x1080 | 25 | AAC 128k | max_file_size 512MB |

Individual preset files with full FFmpeg command templates live in `_cookie/composition/ffmpeg-presets/`.

### Quick Usage

```bash
# Encode for YouTube 1080p
ffmpeg -i {input} \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset slow \
  -profile:v high -level:v 4.1 \
  -maxrate 8M -bufsize 16M \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart \
  {output}.mp4
```

See `encoding-presets.yaml` for all presets and their complete FFmpeg commands.

---

## Multi-Format Export

The multi-format export pipeline takes a single primary render (typically 16:9) and produces platform-specific variants through crop, scale, and encode operations. The full pipeline is documented in `multi-format-export.md`.

### Pipeline Overview

```
Primary 16:9 Render
  ├── 9:16 Vertical  (TikTok, Instagram Reels)
  ├── 1:1  Square    (Instagram Feed)
  ├── 4:5  Portrait  (Instagram Feed, Facebook)
  └── 21:9 Ultrawide (Cinematic, YouTube banner)
```

Each format conversion involves three stages:

1. **Crop/Scale** — Adjust aspect ratio using center-crop, letterbox, or pan-scan strategies.
2. **Caption Burn-in** — Optionally overlay subtitles during the conversion pass.
3. **Platform Encode** — Apply the target platform's encoding preset.

See `multi-format-export.md` for complete FFmpeg commands, crop strategies, two-pass encoding for file size limits, and output path conventions.

---

## Audio Mixing

Complex audio filter chains for multi-track mixing, ducking, and loudness normalization.

### Sidechain Compress (Music Ducking Under Narration)

The `sidechaincompress` filter automatically reduces music volume when narration is detected:

```bash
ffmpeg \
  -i narration.wav \
  -i music.wav \
  -filter_complex "[1:a]sidechaincompress=threshold=0.02:ratio=10:attack=200:release=1000:level_in=1:level_sc=1[ducked];[0:a][ducked]amix=inputs=2:duration=longest:weights=1 0.3[out]" \
  -map "[out]" -c:a aac -b:a 192k mixed.mp4
```

### Multi-Track Mixing with amix/amerge

```bash
# Mix narration + music + sfx (amix — downmix to single stereo output)
ffmpeg \
  -i narration.wav -i music.wav -i sfx.wav \
  -filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest:weights=1 0.3 0.5[out]" \
  -map "[out]" -c:a aac -b:a 192k mixed.aac

# Merge stereo channels (amerge — combine into multi-channel)
ffmpeg \
  -i left.wav -i right.wav \
  -filter_complex "[0:a][1:a]amerge=inputs=2[out]" \
  -map "[out]" -ac 2 merged-stereo.wav
```

### Loudness Normalization (Two-Pass)

```bash
# Pass 1: Analyze
ffmpeg -i {input} -af loudnorm=I=-14:TP=-2:LRA=11:print_format=json -f null - 2>&1 | tail -12

# Pass 2: Apply (use measured values from pass 1)
ffmpeg -i {input} -af "loudnorm=I=-14:TP=-2:LRA=11:measured_I={measured_I}:measured_TP={measured_TP}:measured_LRA={measured_LRA}:measured_thresh={measured_thresh}:offset={offset}:linear=true" {output}
```

See `filter-patterns.md` for additional audio filter patterns.

---

## Color Grading

### LUT Application with lut3d Filter

Apply a 3D LUT file (.cube format) for cinematic color grading:

```bash
# Apply a .cube LUT
ffmpeg -i {input} -vf "lut3d=cinematic.cube" -c:v libx264 -crf 18 -c:a copy {output}

# Apply LUT with interpolation method
ffmpeg -i {input} -vf "lut3d=cinematic.cube:interp=trilinear" -c:v libx264 -crf 18 -c:a copy {output}

# Chain LUT with other color adjustments
ffmpeg -i {input} -vf "lut3d=cinematic.cube,eq=brightness=0.04:contrast=1.1:saturation=1.2" -c:v libx264 -crf 18 -c:a copy {output}
```

### Brightness, Contrast, and Saturation with eq Filter

```bash
# Adjust brightness (+0.06), contrast (1.1x), saturation (1.3x)
ffmpeg -i {input} -vf "eq=brightness=0.06:contrast=1.1:saturation=1.3" -c:v libx264 -crf 18 -c:a copy {output}

# Desaturate (black & white)
ffmpeg -i {input} -vf "eq=saturation=0" -c:v libx264 -crf 18 -c:a copy {output}

# Warm tone (increase saturation, slight brightness boost)
ffmpeg -i {input} -vf "eq=brightness=0.03:saturation=1.4:gamma_r=1.1:gamma_b=0.9" -c:v libx264 -crf 18 -c:a copy {output}
```

See `filter-patterns.md` for additional color grading filter patterns.

---

## Subtitle Burn-in

### ASS/SRT Subtitle Overlay

Burn subtitles directly into the video (hardcoded — cannot be turned off by the viewer):

```bash
# Burn SRT subtitles
ffmpeg -i {input} -vf "subtitles={subtitle.srt}" -c:v libx264 -crf 23 -c:a copy {output}

# Burn ASS subtitles (preserves styling)
ffmpeg -i {input} -vf "ass={subtitle.ass}" -c:v libx264 -crf 23 -c:a copy {output}

# Burn subtitles with custom font and size
ffmpeg -i {input} -vf "subtitles={subtitle.srt}:force_style='FontName=Arial,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2'" -c:v libx264 -crf 23 -c:a copy {output}

# Burn subtitles during format conversion (combined with crop/scale)
ffmpeg -i {input} -vf "crop=ih*9/16:ih,scale=1080:1920,subtitles={subtitle.srt}:force_style='FontSize=18'" -c:v libx264 -crf 23 -c:a aac -b:a 128k {output}
```

### Softcoded Subtitles (Embedded, Toggleable)

```bash
# Embed SRT as a subtitle stream
ffmpeg -i {input} -i {subtitle.srt} -c:v copy -c:a copy -c:s mov_text {output.mp4}

# Embed ASS as a subtitle stream
ffmpeg -i {input} -i {subtitle.ass} -c:v copy -c:a copy -c:s ass {output.mkv}
```

See `filter-patterns.md` for combined subtitle + crop filter chains.

---

## Thumbnail Extraction

### Extract Specific Frames for Thumbnails

```bash
# Extract frame at specific timestamp
ffmpeg -ss 00:00:15.000 -i {input} -vframes 1 -q:v 2 thumbnail.png

# Extract and scale to thumbnail size
ffmpeg -ss 00:00:15.000 -i {input} -vframes 1 -vf "scale=1280:720" -q:v 2 thumbnail.jpg

# Extract and apply overlay (logo watermark)
ffmpeg -ss 00:00:15.000 -i {input} -i logo.png \
  -filter_complex "[0:v]scale=1280:720[bg];[bg][1:v]overlay=W-w-20:H-h-20" \
  -vframes 1 -q:v 2 thumbnail-watermarked.jpg
```

### Generate Thumbnail Grid (Contact Sheet)

```bash
# 4x4 grid of frames at regular intervals
ffmpeg -i {input} -vf "select='not(mod(n\,100))',scale=320:180,tile=4x4" -vframes 1 contact-sheet.png

# Custom interval: one frame every 10 seconds, arranged in a 5x3 grid
ffmpeg -i {input} -vf "fps=1/10,scale=320:180,tile=5x3" -vframes 1 contact-sheet.png
```

See `filter-patterns.md` for additional frame processing patterns.
