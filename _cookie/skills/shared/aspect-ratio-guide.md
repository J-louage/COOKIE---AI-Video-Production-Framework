# Aspect Ratio Guide for Video Production

## Purpose

This document is the definitive reference for aspect ratios used throughout the Cookie pipeline. It covers standard ratios, platform requirements, safe zones for text and subjects, crop strategies, and the specific ratio support of each generation tool (VEO, Nano Banana).

---

## Standard Aspect Ratios

### 16:9 — Standard Widescreen (1920x1080)

The dominant format for professional video content.

| Property | Value |
|----------|-------|
| Resolution (HD) | 1920 x 1080 |
| Resolution (4K) | 3840 x 2160 |
| Resolution (720p) | 1280 x 720 |
| Pixel ratio | 1.778:1 |
| Use cases | YouTube, TV, presentations, desktop web, corporate video |
| Orientation | Landscape |

**Notes:**
- Default for almost all professional video production.
- YouTube's native display format. Content in other ratios will be letterboxed or pillarboxed.
- Optimal for scenes with wide establishing shots, multiple characters, or environments where horizontal space matters.

### 9:16 — Vertical (1080x1920)

The dominant format for mobile-first content.

| Property | Value |
|----------|-------|
| Resolution (standard) | 1080 x 1920 |
| Resolution (lower) | 720 x 1280 |
| Pixel ratio | 0.5625:1 |
| Use cases | TikTok, Instagram Reels, YouTube Shorts, Snapchat |
| Orientation | Portrait |

**Notes:**
- Mobile-native. Fills the entire phone screen without black bars.
- Vertical composition requires different framing than landscape: subjects centered, less horizontal context.
- Platform UI overlays consume significant screen space (see safe zones below).
- Often requires completely different shot planning, not just a crop of 16:9 content.

### 1:1 — Square (1080x1080)

The balanced format for feed-based platforms.

| Property | Value |
|----------|-------|
| Resolution (standard) | 1080 x 1080 |
| Resolution (large) | 2048 x 2048 |
| Pixel ratio | 1:1 |
| Use cases | Instagram feed, Twitter/X posts, product showcases, thumbnails |
| Orientation | Neutral |

**Notes:**
- Works well for centered compositions with a single subject.
- Takes up more vertical feed space than 16:9 on mobile (better for engagement).
- Limited horizontal space — avoid wide establishing shots or multi-subject compositions.
- Good for talking-head content, product close-ups, and graphical content.

### 4:5 — Portrait (1080x1350)

The maximum vertical format for Instagram feed.

| Property | Value |
|----------|-------|
| Resolution (standard) | 1080 x 1350 |
| Pixel ratio | 0.8:1 |
| Use cases | Instagram feed (maximum vertical), Pinterest pins |
| Orientation | Portrait (moderate) |

**Notes:**
- Takes up the most vertical space possible in the Instagram feed grid, maximizing visibility.
- A good compromise between square and full vertical for Instagram content.
- Provides more room for text overlays below the subject compared to 1:1.

### 21:9 — Ultrawide / Cinematic (2560x1080)

The cinematic format for premium content.

| Property | Value |
|----------|-------|
| Resolution (standard) | 2560 x 1080 |
| Resolution (4K) | 3440 x 1440 |
| Pixel ratio | 2.370:1 |
| Use cases | Cinematic trailers, letterboxed YouTube, film-style content |
| Orientation | Ultra-landscape |

**Notes:**
- Creates a dramatic, cinematic feel. Often associated with premium, theatrical content.
- When displayed on standard 16:9 screens, horizontal black bars (letterboxing) appear at top and bottom.
- Reduces usable vertical space — not ideal for text-heavy content.
- Excellent for panoramic environments, dramatic reveals, and high-production value content.

### 4:3 — Classic (1440x1080)

The legacy standard, still used in specific contexts.

| Property | Value |
|----------|-------|
| Resolution (standard) | 1440 x 1080 |
| Resolution (SD) | 640 x 480 |
| Pixel ratio | 1.333:1 |
| Use cases | Retro/vintage aesthetic, some security camera feeds, older presentations |
| Orientation | Landscape (moderate) |

**Notes:**
- The original TV standard. Rarely used for new content except as a stylistic choice.
- Triggers nostalgia — can be effective for flashback sequences or retro-themed content.
- Will be pillarboxed (vertical black bars on sides) when displayed on 16:9 screens.

### 3:2 — Photo Standard (1620x1080)

Common in photography, less common in video.

| Property | Value |
|----------|-------|
| Resolution (standard) | 1620 x 1080 |
| Pixel ratio | 1.5:1 |
| Use cases | Photo slideshows, DSLR-style content, print-to-screen |
| Orientation | Landscape (moderate) |

---

## Safe Zones

Safe zones define the area of the frame where text and important subjects should be placed to avoid being obscured by platform UI, player controls, device bezels, or broadcast over-scan.

### 16:9 Safe Zones (1920x1080)

```
┌─────────────────────────────────────────────────┐
│  Action Safe (5% inset)                         │
│  ┌───────────────────────────────────────────┐   │
│  │  Title Safe (10% inset)                   │   │
│  │  ┌───────────────────────────────────┐     │   │
│  │  │                                   │     │   │
│  │  │     Place text and critical       │     │   │
│  │  │     subjects within this zone     │     │   │
│  │  │                                   │     │   │
│  │  └───────────────────────────────────┘     │   │
│  │                                           │   │
│  └───────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘

Action Safe:  x: 96–1824,  y: 54–1026   (subjects can extend here)
Title Safe:   x: 192–1728, y: 108–972   (all text must be within this)
```

### 9:16 Safe Zones (1080x1920)

Vertical content has unique constraints due to platform UI overlays:

```
┌─────────────────────────┐
│  ░░░ Status bar ░░░░░░  │  Top 5%: System status bar
│  ░░░ Username ░░░░░░░░  │  Top 10-15%: Platform username/follow button
│  ┌───────────────────┐  │
│  │                   │  │
│  │   PRIMARY SAFE    │  │  Central 55%: Safe for all content
│  │   ZONE            │  │
│  │                   │  │
│  │                   │  │
│  └───────────────────┘  │
│  ░░░ Caption area ░░░░  │  Bottom 20-25%: Platform captions/description
│  ░░ Like/Comment ░░░░░  │  Right edge 10%: Interaction buttons
│  ░░░░░░░░░░░░░░░░░░░░░  │  Bottom 10%: Navigation/home indicator
└─────────────────────────┘

TikTok/Reels safe zone:
  Text:     x: 54–940,   y: 288–1440
  Subject:  x: 54–1026,  y: 192–1536
```

### 1:1 Safe Zones (1080x1080)

```
All edges: 8% inset (86px)
Text safe:    x: 86–994,  y: 86–994
Subject safe: x: 54–1026, y: 54–1026
```

---

## Crop Strategy Decision Tree

When source content needs to be adapted to a different aspect ratio, use this decision tree:

```
Source → Target ratio change needed?
│
├─ No change needed → Use as-is
│
├─ Minor change (e.g., 16:9 → 1.85:1) → CROP
│   Minimal content loss. Center crop is usually fine.
│
├─ Major change, subject-centered (e.g., 16:9 → 9:16) → REFRAME
│   Use subject-aware cropping. Track the main subject.
│   May need to re-generate with different composition.
│
├─ Major change, full scene needed (e.g., 16:9 → 1:1) → LETTERBOX
│   Add bars to preserve entire frame.
│   Background color: black, or blurred version of the image.
│
└─ Multiple ratios needed simultaneously → GENERATE SEPARATELY
    For best results, generate each ratio as a separate VEO/Nano Banana call
    with composition optimized for that format.
```

### Crop Methods

**Center crop (simple):**
```bash
# Crop 16:9 to 1:1 (center)
ffmpeg -i input-16x9.mp4 -vf "crop=ih:ih:(iw-ih)/2:0" output-1x1.mp4

# Crop 16:9 to 9:16 (center)
ffmpeg -i input-16x9.mp4 -vf "crop=ih*9/16:ih:(iw-ih*9/16)/2:0" output-9x16.mp4
```

**Letterbox (add bars):**
```bash
# Letterbox 16:9 into 1:1 (black bars top and bottom)
ffmpeg -i input-16x9.mp4 -vf "pad=iw:iw:(ow-iw)/2:(oh-ih)/2:black" output-1x1.mp4

# Pillarbox 9:16 into 16:9 (black bars on sides)
ffmpeg -i input-9x16.mp4 -vf "pad=ih*16/9:ih:(ow-iw)/2:0:black" output-16x9.mp4
```

**Blurred background letterbox:**
```bash
# 9:16 content with blurred pillarbox for 16:9 display
ffmpeg -i input-9x16.mp4 \
  -filter_complex "[0:v]scale=1920:1080,boxblur=20:20[bg];[0:v]scale=-1:1080[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" \
  output-16x9-blurred.mp4
```

---

## VEO Supported Ratios

VEO supports a limited set of aspect ratios for video generation:

| Ratio | Resolution | Status | Notes |
|-------|-----------|--------|-------|
| **16:9** | 1920 x 1080 | Supported | Default and recommended for most content |
| **9:16** | 1080 x 1920 | Supported | For vertical/mobile content |

**VEO limitations:**
- Only 16:9 and 9:16 are natively supported.
- For other ratios (1:1, 4:5, 21:9), generate at 16:9 and crop in post-production.
- VEO output resolution is fixed. Cannot request arbitrary resolutions.
- Always specify the intended ratio in the VEO generation request to ensure proper composition.

---

## Nano Banana Supported Ratios

Nano Banana supports a wider range of aspect ratios for image generation:

| Ratio | Typical Resolution | Status | Best Used For |
|-------|-------------------|--------|--------------|
| **1:1** | 1024 x 1024 | Supported | Character references, social media stills, thumbnails |
| **16:9** | 1344 x 768 | Supported | Widescreen stills, keyframes, storyboards |
| **9:16** | 768 x 1344 | Supported | Vertical content frames, mobile-first stills |
| **3:2** | 1182 x 768 | Supported | Photo-style compositions |
| **4:3** | 1024 x 768 | Supported | Classic composition, presentations |
| **21:9** | 1536 x 640 | Supported | Cinematic/ultrawide compositions |

**Nano Banana notes:**
- All ratios produce high-quality output.
- 1:1 is the traditional default for image generation models. Often produces the most consistent results.
- For character reference sheets, use 1:1 for individual views and composite them into a grid.
- When generating frames that will be used as VEO first/last frame references, match the VEO output ratio (16:9 or 9:16).

---

## Platform Requirements Table

Comprehensive reference for video dimensions by platform:

| Platform | Format | Dimensions | Ratio | Max Duration | Max File Size | Codec |
|----------|--------|-----------|-------|-------------|--------------|-------|
| **YouTube** | Standard | 1920x1080 | 16:9 | 12 hours | 256 GB | H.264, VP9 |
| **YouTube** | 4K | 3840x2160 | 16:9 | 12 hours | 256 GB | H.264, VP9, AV1 |
| **YouTube Shorts** | Vertical | 1080x1920 | 9:16 | 60 seconds | 256 GB | H.264 |
| **TikTok** | Standard | 1080x1920 | 9:16 | 10 minutes | 287 MB (mobile) | H.264 |
| **TikTok** | Desktop upload | 1080x1920 | 9:16 | 10 minutes | 10 GB | H.264 |
| **Instagram Reels** | Vertical | 1080x1920 | 9:16 | 90 seconds | 4 GB | H.264 |
| **Instagram Feed** | Square | 1080x1080 | 1:1 | 60 seconds | 4 GB | H.264 |
| **Instagram Feed** | Portrait | 1080x1350 | 4:5 | 60 seconds | 4 GB | H.264 |
| **Instagram Feed** | Landscape | 1080x608 | 16:9 | 60 seconds | 4 GB | H.264 |
| **Instagram Stories** | Vertical | 1080x1920 | 9:16 | 60 seconds | 4 GB | H.264 |
| **Twitter/X** | Landscape | 1280x720 | 16:9 | 2:20 min | 512 MB | H.264 |
| **Twitter/X** | Square | 720x720 | 1:1 | 2:20 min | 512 MB | H.264 |
| **LinkedIn** | Landscape | 1920x1080 | 16:9 | 10 minutes | 5 GB | H.264 |
| **LinkedIn** | Square | 1080x1080 | 1:1 | 10 minutes | 5 GB | H.264 |
| **Facebook** | Landscape | 1920x1080 | 16:9 | 240 minutes | 10 GB | H.264 |
| **Facebook** | Square | 1080x1080 | 1:1 | 240 minutes | 10 GB | H.264 |
| **Facebook Reels** | Vertical | 1080x1920 | 9:16 | 90 seconds | 4 GB | H.264 |
| **Snapchat** | Vertical | 1080x1920 | 9:16 | 60 seconds | 1 GB | H.264 |

---

## Multi-Format Production Strategy

When a project needs to deliver in multiple aspect ratios:

### Option 1: Generate Once, Crop for Others (Fast, Lower Quality)

1. Generate all content in 16:9 (the widest standard ratio).
2. Crop to other ratios in post-production.
3. **Pros:** Fast. One generation per scene.
4. **Cons:** Composition is not optimized for non-16:9 formats. Important elements may be cropped out.

### Option 2: Generate Separately for Each Ratio (Slow, Highest Quality)

1. Generate content separately at each required ratio.
2. Tailor composition prompts for each format.
3. **Pros:** Optimal composition for every format.
4. **Cons:** Multiplies generation cost and time.

### Option 3: Hybrid (Recommended)

1. Generate hero content in the primary ratio (usually 16:9 for YouTube or 9:16 for social).
2. Generate key moments (thumbnails, hero shots) separately in secondary ratios.
3. Crop the rest of the content from the primary ratio.
4. **Pros:** Balance of quality and efficiency.
5. **Cons:** Requires planning to identify which moments need dedicated generation.

### Composition Adaptation Notes

When the same scene is needed in both 16:9 and 9:16:

| Element | 16:9 Approach | 9:16 Approach |
|---------|-------------|---------------|
| Subject placement | Rule of thirds, can be off-center | Center-dominant, tighter framing |
| Background | Wide establishing context | Minimal, vertical depth instead |
| Text overlays | Lower third, wide | Center-screen, stacked vertically |
| Multiple characters | Side by side | Stacked or tighter grouping |
| Camera movement | Pans work well | Tilts work better than pans |
| Environment detail | Wide environmental storytelling | Focus on foreground, reduce background |
