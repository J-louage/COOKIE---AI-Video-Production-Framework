# Multi-Format Export Pipeline

## Purpose

Automate the conversion of a single primary render (16:9) into platform-specific format variants. This pipeline handles aspect ratio conversion, caption burn-in, duration trimming, hook scene prepending, and platform-constrained encoding in a single workflow.

---

## Pipeline Diagram

```
                         Primary Render (16:9, 1920x1080)
                                      │
              ┌───────────┬───────────┼───────────┬──────────────┐
              ▼           ▼           ▼           ▼              ▼
          9:16         1:1         4:5         21:9          16:9
        Vertical      Square     Portrait   Ultrawide     (original)
       1080x1920    1080x1080   1080x1350  2560x1080      1920x1080
              │           │           │           │              │
              ▼           ▼           ▼           ▼              ▼
         [Crop/Scale] [Crop/Scale] [Crop/Scale] [Crop/Scale]   [Pass-through]
              │           │           │           │              │
              ▼           ▼           ▼           ▼              ▼
        [Captions?]  [Captions?]  [Captions?]  [Captions?]  [Captions?]
              │           │           │           │              │
              ▼           ▼           ▼           ▼              ▼
     [Platform Encode] [Encode]   [Encode]    [Encode]       [Encode]
              │           │           │           │              │
              ▼           ▼           ▼           ▼              ▼
         TikTok       Instagram   Instagram   YouTube       YouTube
         IG Reels      Feed       Feed/FB     Banner        Standard
```

---

## Crop Strategies

### Center Crop

Cuts equally from both sides to achieve the target aspect ratio. Best for content where the subject is centered.

```bash
# Generic center crop formula
ffmpeg -i {input} -vf "crop=ih*{target_w}/{target_h}:ih" {output}

# Example: 16:9 → 9:16 center crop
ffmpeg -i {input} -vf "crop=ih*9/16:ih" {output}
```

### Center-Subject Crop

Uses a fixed offset to keep the subject in frame. Useful when the subject is not perfectly centered.

```bash
# Crop with manual X offset (subject is 100px right of center)
ffmpeg -i {input} -vf "crop=ih*9/16:ih:iw/2-oh*9/32+100:0" {output}
```

### Letterbox (Padding)

Adds black bars to fit content into the target aspect ratio without cropping. Preserves all content but introduces dead space.

```bash
# Scale to fit, then pad to exact dimensions
ffmpeg -i {input} -vf "scale={target_w}:{target_h}:force_original_aspect_ratio=decrease,pad={target_w}:{target_h}:(ow-iw)/2:(oh-ih)/2:black" {output}
```

### Pan-Scan

Simulates a slow horizontal or vertical pan across the source to keep interest in a cropped format. Best for wide shots converted to vertical.

```bash
# Horizontal pan from left to right over the video duration
# Uses the overlay filter with a moving crop window
ffmpeg -i {input} -vf "crop=ih*9/16:ih:(iw-ih*9/16)*t/duration:0,scale=1080:1920" {output}
```

---

## Format Conversion Commands

### 16:9 to 9:16 (Vertical)

For TikTok, Instagram Reels. Center-crops the horizontal source into a vertical frame.

```bash
ffmpeg -i {input} \
  -vf "crop=ih*9/16:ih,scale=1080:1920" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  {output}-vertical.mp4
```

**With letterbox (no content loss):**

```bash
ffmpeg -i {input} \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  {output}-vertical-letterbox.mp4
```

### 16:9 to 1:1 (Square)

For Instagram feed. Center-crops to a square.

```bash
ffmpeg -i {input} \
  -vf "crop=ih:ih,scale=1080:1080" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  {output}-square.mp4
```

**With letterbox:**

```bash
ffmpeg -i {input} \
  -vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  {output}-square-letterbox.mp4
```

### 16:9 to 4:5 (Portrait)

For Instagram and Facebook feed. Slight vertical crop from a horizontal source.

```bash
ffmpeg -i {input} \
  -vf "crop=ih*4/5:ih,scale=1080:1350" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  {output}-portrait.mp4
```

**With letterbox:**

```bash
ffmpeg -i {input} \
  -vf "scale=1080:1350:force_original_aspect_ratio=decrease,pad=1080:1350:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  {output}-portrait-letterbox.mp4
```

### 16:9 to 21:9 (Ultrawide / Cinematic)

For cinematic letterbox effect. Crops top and bottom from the source.

```bash
ffmpeg -i {input} \
  -vf "crop=iw:iw*9/21,scale=2560:1080" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset slow \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart \
  {output}-ultrawide.mp4
```

**With letterbox:**

```bash
ffmpeg -i {input} \
  -vf "scale=2560:1080:force_original_aspect_ratio=decrease,pad=2560:1080:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset slow \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart \
  {output}-ultrawide-letterbox.mp4
```

---

## Caption Burn-in During Format Conversion

Combine subtitle overlay with aspect ratio conversion in a single filter chain:

```bash
# 16:9 → 9:16 with burned-in captions
ffmpeg -i {input} \
  -vf "crop=ih*9/16:ih,scale=1080:1920,subtitles={subtitle.srt}:force_style='FontSize=18,MarginV=120'" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  {output}-vertical-captioned.mp4

# 16:9 → 1:1 with burned-in captions
ffmpeg -i {input} \
  -vf "crop=ih:ih,scale=1080:1080,subtitles={subtitle.srt}:force_style='FontSize=16,MarginV=80'" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  {output}-square-captioned.mp4

# 16:9 → 4:5 with burned-in captions
ffmpeg -i {input} \
  -vf "crop=ih*4/5:ih,scale=1080:1350,subtitles={subtitle.srt}:force_style='FontSize=17,MarginV=100'" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  {output}-portrait-captioned.mp4
```

**Note:** The `subtitles` filter must be applied **after** crop/scale so that font sizes and margins are relative to the final output resolution.

---

## Duration Trimming

Trim the output to a platform's maximum allowed duration:

```bash
# Trim to 60 seconds (Instagram feed)
ffmpeg -i {input} -t 60 -c:v libx264 -crf 23 -c:a aac -b:a 128k {output}.mp4

# Trim to 90 seconds (Instagram Reels)
ffmpeg -i {input} -t 90 -c:v libx264 -crf 23 -c:a aac -b:a 128k {output}.mp4

# Trim to 140 seconds (Twitter)
ffmpeg -i {input} -t 140 -c:v libx264 -crf 25 -c:a aac -b:a 128k {output}.mp4

# Combined: crop + trim + encode
ffmpeg -i {input} \
  -t 90 \
  -vf "crop=ih*9/16:ih,scale=1080:1920" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  {output}-reels.mp4
```

---

## Hook Scene Prepending

Prepend a short "hook" clip (e.g., 3-5 second teaser) before the main content for social platforms:

```bash
# Step 1: Ensure hook clip matches target format
ffmpeg -i hook.mp4 \
  -vf "crop=ih*9/16:ih,scale=1080:1920" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  hook-vertical.mp4

# Step 2: Ensure main content matches target format
ffmpeg -i main.mp4 \
  -vf "crop=ih*9/16:ih,scale=1080:1920" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  main-vertical.mp4

# Step 3: Concatenate hook + main
cat > concat-list.txt << EOF
file 'hook-vertical.mp4'
file 'main-vertical.mp4'
EOF

ffmpeg -f concat -safe 0 -i concat-list.txt -c copy {output}-with-hook.mp4
```

**Single-command alternative using the concat filter (re-encodes):**

```bash
ffmpeg -i hook.mp4 -i main.mp4 \
  -filter_complex "[0:v]crop=ih*9/16:ih,scale=1080:1920[v0];[0:a]aresample=44100[a0];[1:v]crop=ih*9/16:ih,scale=1080:1920[v1];[1:a]aresample=44100[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[outv][outa]" \
  -map "[outv]" -map "[outa]" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  {output}-with-hook.mp4
```

---

## Platform File Size Limits and Two-Pass Encoding

When a platform imposes a maximum file size, use two-pass encoding to hit the target precisely.

### File Size Calculation

```bash
# Calculate target video bitrate (in bits/second)
# Formula: target_bitrate = (file_size_bytes * 8 - audio_bitrate * duration) / duration

# Example: 100MB limit, 60s video, 128kbps audio
# target_bitrate = (100 * 1024 * 1024 * 8 - 128000 * 60) / 60
# target_bitrate ≈ 13,953,365 bps ≈ 13.3 Mbps
```

### Two-Pass Encoding Template

```bash
# Variables
INPUT="{input}"
OUTPUT="{output}.mp4"
TARGET_BITRATE="13M"    # Calculated from file size limit
AUDIO_BITRATE="128k"

# Pass 1: Analyze (no output file produced)
ffmpeg -y -i "$INPUT" \
  -c:v libx264 -pix_fmt yuv420p -preset medium \
  -b:v "$TARGET_BITRATE" \
  -pass 1 -an \
  -f null /dev/null

# Pass 2: Encode with target bitrate
ffmpeg -y -i "$INPUT" \
  -c:v libx264 -pix_fmt yuv420p -preset medium \
  -b:v "$TARGET_BITRATE" \
  -pass 2 \
  -c:a aac -b:a "$AUDIO_BITRATE" -ar 44100 -ac 2 \
  -movflags +faststart \
  "$OUTPUT"

# Clean up pass log files
rm -f ffmpeg2pass-0.log ffmpeg2pass-0.log.mbtree
```

### Platform Limits Reference

| Platform | Max File Size | Max Duration | Recommended Approach |
|----------|---------------|--------------|----------------------|
| YouTube | 256 GB | 12 hours | CRF (no file size concern) |
| TikTok | 287 MB (web) | 10 min | CRF with maxrate cap |
| Instagram Reels | 100 MB | 90 sec | Two-pass if CRF exceeds limit |
| Instagram Feed | 100 MB | 60 sec | Two-pass if CRF exceeds limit |
| Twitter/X | 512 MB | 2 min 20 sec | Two-pass for longer videos |
| Facebook | 10 GB | 240 min | CRF (generous limit) |

### Automated File Size Check

```bash
#!/bin/bash
# Check if output file is within platform limit
OUTPUT="$1"
MAX_MB="$2"

actual_bytes=$(stat -f%z "$OUTPUT" 2>/dev/null || stat -c%s "$OUTPUT" 2>/dev/null)
max_bytes=$((MAX_MB * 1024 * 1024))

if [ "$actual_bytes" -le "$max_bytes" ]; then
  echo "PASS: $(basename $OUTPUT) is $(echo "scale=1; $actual_bytes / 1048576" | bc)MB (limit: ${MAX_MB}MB)"
else
  echo "FAIL: $(basename $OUTPUT) is $(echo "scale=1; $actual_bytes / 1048576" | bc)MB — exceeds ${MAX_MB}MB limit"
  echo "Re-encode with two-pass at a lower target bitrate."
fi
```

---

## Output Path Convention

All exported files follow this directory structure:

```
episodes/
  {episode_id}/
    exports/
      {episode_id}-youtube-1080p.mp4
      {episode_id}-youtube-4k.mp4
      {episode_id}-tiktok-720p.mp4
      {episode_id}-instagram-reels.mp4
      {episode_id}-instagram-square.mp4
      {episode_id}-twitter-video.mp4
```

**Path template:**

```
episodes/{episode_id}/exports/{episode_id}-{format}.mp4
```

**Format slugs:**

| Format | Slug |
|--------|------|
| YouTube 1080p | `youtube-1080p` |
| YouTube 4K | `youtube-4k` |
| TikTok 720p | `tiktok-720p` |
| Instagram Reels | `instagram-reels` |
| Instagram Square | `instagram-square` |
| Twitter Video | `twitter-video` |
| Vertical (generic) | `vertical` |
| Square (generic) | `square` |
| Portrait (generic) | `portrait` |
| Ultrawide | `ultrawide` |

---

## Full Export Script Example

```bash
#!/bin/bash
# Export a primary 16:9 render to all platform formats
# Usage: ./export-all.sh <input.mp4> <episode_id> [subtitle.srt]

INPUT="$1"
EPISODE_ID="$2"
SUBTITLE="$3"
EXPORT_DIR="episodes/${EPISODE_ID}/exports"

mkdir -p "$EXPORT_DIR"

# YouTube 1080p (16:9, keep as-is)
ffmpeg -i "$INPUT" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset slow \
  -profile:v high -level:v 4.1 \
  -maxrate 8M -bufsize 16M \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart \
  "${EXPORT_DIR}/${EPISODE_ID}-youtube-1080p.mp4"

# TikTok 720p (9:16 center crop)
ffmpeg -i "$INPUT" \
  -t 600 \
  -vf "crop=ih*9/16:ih,scale=720:1280" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -maxrate 4M -bufsize 8M \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  "${EXPORT_DIR}/${EPISODE_ID}-tiktok-720p.mp4"

# Instagram Reels (9:16 center crop, 1080p)
ffmpeg -i "$INPUT" \
  -t 90 \
  -vf "crop=ih*9/16:ih,scale=1080:1920" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  "${EXPORT_DIR}/${EPISODE_ID}-instagram-reels.mp4"

# Instagram Square (1:1 center crop)
ffmpeg -i "$INPUT" \
  -t 60 \
  -vf "crop=ih:ih,scale=1080:1080" \
  -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  "${EXPORT_DIR}/${EPISODE_ID}-instagram-square.mp4"

# Twitter Video (16:9, higher CRF for smaller file)
ffmpeg -i "$INPUT" \
  -t 140 \
  -c:v libx264 -pix_fmt yuv420p -crf 25 -preset medium \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  -movflags +faststart \
  "${EXPORT_DIR}/${EPISODE_ID}-twitter-video.mp4"

echo "Export complete. Files in: ${EXPORT_DIR}/"
ls -lh "${EXPORT_DIR}/"
```

---

## Related Files

- `encoding-presets.yaml` — Individual platform encoding settings with FFmpeg command templates
- `filter-patterns.md` — Filter patterns for crop, scale, subtitle burn-in, and audio operations
- `SKILL.md` — FFmpeg skill overview and capability reference
- `_cookie/composition/ffmpeg-presets/` — Individual preset YAML files
- `_cookie/skills/shared/aspect-ratio-guide.md` — Supported video dimensions and safe zones
