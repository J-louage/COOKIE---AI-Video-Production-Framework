# Typography Standards for Video Overlays

## Purpose

This document defines typography rules for all text that appears in video output — titles, subtitles, captions, lower thirds, end screens, and any other text overlays. These standards ensure readability, brand consistency, and platform compliance across all delivery formats.

---

## Readable Font Sizes

Font sizes must be proportional to the output resolution. Text that is readable at 1080p may be too small at 720p or too large at 4K.

### Size Reference Table

| Element | 1080p (1920x1080) | 720p (1280x720) | 4K (3840x2160) | 9:16 Vertical (1080x1920) |
|---------|-------------------|-----------------|-----------------|--------------------------|
| Main title | 64–96px | 42–64px | 128–192px | 56–80px |
| Subtitle / heading | 48–64px | 32–42px | 96–128px | 40–56px |
| Body text / captions | 32–40px | 22–28px | 64–80px | 28–36px |
| Fine print / labels | 24–28px | 16–20px | 48–56px | 20–24px |
| Lower third name | 36–48px | 24–32px | 72–96px | 32–42px |
| Lower third title | 24–32px | 16–22px | 48–64px | 22–28px |

### Scaling Formula

For resolutions not listed above:

```
target_size = base_size_1080p × (target_height / 1080)
```

Example: For a 40px caption at 1080p, the equivalent at 1440p is:
```
40 × (1440 / 1080) = 53px
```

### Minimum Readable Sizes

Absolute minimums below which text becomes illegible:

| Element | Minimum at 1080p | Minimum at 720p |
|---------|------------------|-----------------|
| Any text | 20px | 14px |
| Subtitle/caption | 28px | 20px |
| Title | 40px | 28px |

---

## Font Pairing Guidelines

### Primary Pairing Pattern: Sans-Serif Header + Serif Body

The most reliable and versatile pairing for video content:

- **Header:** Bold sans-serif for titles and key text (high impact, modern feel)
- **Body:** Regular serif for longer text, subtitles, captions (classic readability)

**Recommended pairings:**

| Header (Sans-Serif) | Body (Serif) | Aesthetic |
|---------------------|-------------|-----------|
| Montserrat Bold | Lora Regular | Modern, elegant |
| Inter Bold | Source Serif Pro | Clean, professional |
| Poppins SemiBold | Playfair Display | Stylish, contemporary |
| Roboto Bold | Merriweather | Reliable, universal |
| Oswald Bold | Noto Serif | Dramatic header, balanced body |

### Alternative Pattern: Weight Contrast within One Family

Use a single font family with weight contrast for simplicity:

| Family | Header Weight | Body Weight | Aesthetic |
|--------|-------------|-------------|-----------|
| Inter | 700 (Bold) | 400 (Regular) | Professional, tech |
| Montserrat | 800 (ExtraBold) | 400 (Regular) | Modern, impactful |
| Open Sans | 700 (Bold) | 300 (Light) | Clean, approachable |
| Roboto | 900 (Black) | 300 (Light) | High contrast, modern |

### Fonts to Avoid in Video

| Font | Problem |
|------|---------|
| Comic Sans | Unprofessional appearance |
| Papyrus | Dated, overused |
| Impact | Overassociated with memes; limited weight options |
| Very thin/hairline fonts | Disappear at small sizes or low bitrate |
| Highly decorative scripts | Poor readability in motion |
| Fonts without Unicode support | Fail on international characters |

---

## Text Positioning

### Rule of Thirds

Place text at intersections of the rule-of-thirds grid or along the thirds lines:

```
┌───────────┬───────────┬───────────┐
│           │           │           │
│     ●─────────●       │           │  ← Top third: titles, headers
│           │           │           │
├───────────┼───────────┼───────────┤
│           │           │           │
│           │     ●     │           │  ← Center: impact text, quotes
│           │           │           │
├───────────┼───────────┼───────────┤
│           │           │           │
│     ●─────────●       │           │  ← Bottom third: captions, lower thirds
│           │           │           │
└───────────┴───────────┴───────────┘
```

### Safe Zones by Aspect Ratio

Text must stay within safe zones to avoid being cut off by player UI elements, device bezels, or platform overlays.

**16:9 (1920x1080) — Landscape:**
```
Title safe:  10% inset from all edges
             Left: 192px, Right: 1728px, Top: 108px, Bottom: 972px
Action safe: 5% inset from all edges
             Left: 96px, Right: 1824px, Top: 54px, Bottom: 1026px
```

**9:16 (1080x1920) — Vertical (TikTok/Reels/Shorts):**
```
Top safe:    Top 15% reserved for platform status bar and username
             Keep text below y=288
Bottom safe: Bottom 20% reserved for platform UI (comments, buttons)
             Keep text above y=1536
Side safe:   5% from each edge
             Left: 54px, Right: 1026px
```

**1:1 (1080x1080) — Square:**
```
All edges:   8% inset
             Left: 86px, Right: 994px, Top: 86px, Bottom: 994px
```

### Platform-Specific Overlay Zones (Avoid These)

| Platform | Zone to Avoid | Reason |
|----------|--------------|--------|
| YouTube | Bottom 15% during playback | Progress bar, controls |
| TikTok | Right edge 10%, bottom 25% | Like/comment/share buttons, description |
| Instagram Reels | Bottom 30% | Caption area, profile info |
| YouTube Shorts | Bottom 15%, top 10% | Navigation UI |

---

## Caption and Subtitle Standards

### YouTube Captions

```
Font: Sans-serif (platform default or custom)
Color: White (#FFFFFF)
Outline: Black, 2px (or black background box with 60-80% opacity)
Size: 32–40px at 1080p
Position: Bottom center, above progress bar
Max characters per line: 42
Max lines: 2
Duration: Minimum 1 second, maximum 7 seconds per caption
```

### TikTok Captions

```
Font: Bold sans-serif
Color: White (#FFFFFF) or brand color
Background: High-contrast box or heavy text shadow
Size: 36–44px at 1080x1920
Position: Center-screen or upper-center
Max characters per line: 30 (shorter for mobile)
Max lines: 2–3
Style: Often animated (word-by-word or pop-in)
```

### Broadcast Lower Third

```
Font: Network-specified (typically clean sans-serif)
Name: 36–48px, bold
Title: 24–32px, regular
Position: Lower-left, above bottom 10%
Background: Semi-transparent box (60-80% opacity)
Colors: Brand-specific, high contrast
Duration: 4–6 seconds
Animation: Slide in from left, hold, slide out left
```

### SRT Subtitle Format

```srt
1
00:00:01,000 --> 00:00:04,500
This is the first subtitle line.

2
00:00:05,000 --> 00:00:08,200
This is the second subtitle line
with a line break.

3
00:00:09,000 --> 00:00:12,000
And a third line with <i>italics</i>.
```

---

## Minimum Contrast Ratios

Text over images and video must be readable. Follow WCAG contrast guidelines:

### Required Ratios

| Text Type | Minimum Contrast Ratio | Explanation |
|-----------|----------------------|-------------|
| Normal text (< 24px) | 4.5:1 | Standard WCAG AA |
| Large text (>= 24px or >= 18.66px bold) | 3:1 | WCAG AA for large text |
| Critical/essential text | 7:1 | WCAG AAA (highest standard) |

### Ensuring Contrast on Video

Video backgrounds constantly change, making consistent contrast challenging. Use these techniques:

1. **Text shadow:** Add a dark shadow behind light text:
   ```css
   text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
   ```

2. **Background box:** Place a semi-transparent dark box behind the text:
   ```
   Background: rgba(0, 0, 0, 0.6) to rgba(0, 0, 0, 0.8)
   Padding: 8–16px
   Border-radius: 4–8px (optional)
   ```

3. **Text stroke/outline:** Add a contrasting outline around text:
   ```
   Stroke: 2–3px black for white text, 2–3px white for dark text
   ```

4. **Darkened region:** Darken the area of the video where text appears using a gradient overlay:
   ```
   Bottom gradient: transparent → rgba(0, 0, 0, 0.7) over bottom 30%
   ```

### Contrast Checking

To verify contrast between text color and background:

```
Contrast ratio = (L1 + 0.05) / (L2 + 0.05)
Where L1 = lighter color luminance, L2 = darker color luminance
```

Common pairings and their approximate ratios:

| Text | Background | Ratio | Passes? |
|------|-----------|-------|---------|
| White (#FFF) | Black (#000) | 21:1 | Yes (AAA) |
| White (#FFF) | Dark gray (#333) | 12.6:1 | Yes (AAA) |
| White (#FFF) | Medium gray (#767676) | 4.5:1 | Yes (AA) |
| White (#FFF) | Light gray (#AAA) | 2.3:1 | No |
| Yellow (#FF0) | White (#FFF) | 1.07:1 | No |
| Black (#000) | Yellow (#FF0) | 19.6:1 | Yes (AAA) |

---

## Animation Considerations

### Entry and Exit Timing

| Animation Type | Entry Duration | Hold Duration | Exit Duration |
|---------------|---------------|--------------|--------------|
| Fade in/out | 0.3–0.5s | Content-dependent | 0.3–0.5s |
| Slide in/out | 0.3–0.4s | Content-dependent | 0.3–0.4s |
| Scale up/down | 0.2–0.3s | Content-dependent | 0.2–0.3s |
| Word-by-word pop | 0.05–0.1s per word | 0.5–1.0s after last word | 0.3s all at once |
| Typewriter | 0.03–0.05s per character | 1.0–2.0s | 0.3s fade |

### Animation Guidelines

1. **Entry should be faster than exit.** Quick appearance captures attention; gradual disappearance feels natural.
2. **Use easing.** Never use linear motion for text. `ease-out` for entries, `ease-in` for exits.
3. **Do not animate essential text too fast.** Viewers need at least 250ms to register text appearance.
4. **Avoid bouncing or overshoot** on subtitle text. It is distracting and reduces readability.
5. **Coordinate with audio.** Text entry should coincide with the spoken word or beat for maximum impact.
6. **Less is more.** Subtle animations are almost always better than dramatic ones for production content.

### Text Animation Types by Content

| Content Type | Recommended Animation | Notes |
|-------------|----------------------|-------|
| Subtitles/captions | Fade or cut (no animation) | Must not distract from content |
| Lower thirds | Slide from left + fade | Professional broadcast standard |
| Title cards | Fade in + slight scale | Elegant, cinematic |
| Social media captions | Word-by-word pop or highlight | Engaging, TikTok-native |
| Call-to-action | Scale up + slight bounce | Attention-grabbing |
| Data/statistics | Counter animation + fade | Adds dynamism to numbers |
