# Color Theory for Video Production

## Purpose

This document provides color theory fundamentals for the Cookie pipeline, covering palette selection, emotional associations, color grading approaches, brand integration, scene-to-scene continuity, and platform-specific considerations. These principles apply to all visual generation prompts, post-production grading, and design decisions.

---

## Warm vs Cool Palettes

### Warm Palettes

Warm colors (reds, oranges, yellows, warm browns) evoke closeness, energy, comfort, and emotion.

| Color | Hex Range | Emotional Association | Best Used For |
|-------|-----------|----------------------|--------------|
| Red | #C0392B – #E74C3C | Passion, urgency, danger, love, power | Call-to-action moments, romantic scenes, conflict |
| Orange | #E67E22 – #F39C12 | Energy, enthusiasm, warmth, creativity | Product reveals, friendly/approachable scenes |
| Yellow | #F1C40F – #F7DC6F | Optimism, happiness, warmth, caution | Joyful moments, success, summer scenes |
| Amber | #D4A017 – #E8A317 | Nostalgia, golden hour, luxury, heritage | Flashbacks, premium content, sunset scenes |
| Warm Brown | #795548 – #A1887F | Earthy, grounded, authentic, organic | Nature content, craft/artisan, heritage brands |

**Warm palette applications:**
- Golden hour scenes (amber + soft yellow)
- Indoor intimate moments (warm orange + soft brown)
- Celebration/success sequences (bright yellow + orange)
- Romantic/emotional scenes (deep red + amber)

### Cool Palettes

Cool colors (blues, greens, purples, cool grays) create distance, calm, professionalism, and mystery.

| Color | Hex Range | Emotional Association | Best Used For |
|-------|-----------|----------------------|--------------|
| Blue | #2980B9 – #3498DB | Trust, calm, professionalism, technology | Corporate content, tech brands, calm narration |
| Teal | #008080 – #1ABC9C | Modern, fresh, sophisticated, clean | SaaS products, health/wellness, design brands |
| Green | #27AE60 – #2ECC71 | Growth, nature, health, prosperity | Eco brands, finance (growth), nature content |
| Purple | #8E44AD – #9B59B6 | Luxury, creativity, mystery, wisdom | Premium brands, creative content, fantasy |
| Cool Gray | #7F8C8D – #95A5A6 | Neutral, industrial, minimalist, tech | UI content, minimalist brands, tech products |

**Cool palette applications:**
- Corporate/professional scenes (navy blue + cool gray)
- Technology showcases (teal + electric blue)
- Mystery/suspense sequences (deep blue + purple)
- Nature/environmental content (green + teal)

### Warm-Cool Contrast

The most visually dynamic scenes use both warm and cool tones in complementary positions:

- **Subject warm, background cool:** Character feels present and approachable against a receding background.
- **Subject cool, background warm:** Character feels mysterious or detached; background feels alive.
- **Split lighting:** Warm key light + cool fill light creates dramatic dimension.

---

## Color Grading Fundamentals

### Teal and Orange

The most popular color grading style in cinema. Skin tones push toward orange; shadows and backgrounds push toward teal/cyan.

**When to use:** Modern cinematic look. Works for most content types. Particularly effective for scenes with people (skin tones pop naturally).

**Prompt tokens:** `teal and orange color grading, cinematic color palette, warm skin tones, cool shadows`

**FFmpeg approximation:**
```bash
ffmpeg -i input.mp4 -vf "curves=b='0/0 0.25/0.15 0.5/0.45 0.75/0.7 1/0.9':g='0/0 0.25/0.22 0.5/0.5 0.75/0.75 1/1':r='0/0 0.25/0.3 0.5/0.55 0.75/0.8 1/1'" output.mp4
```

### High Contrast

Deep blacks, bright highlights, minimal midtones. Creates drama and visual impact.

**When to use:** Action sequences, dramatic reveals, fashion content, noir aesthetics.

**Prompt tokens:** `high contrast, deep blacks, bright highlights, dramatic lighting, strong shadows`

### Desaturated / Muted

Reduced color saturation. Colors are present but subdued. Creates a sober, documentary, or vintage feel.

**When to use:** Serious/documentary content, war/historical scenes, indie film aesthetic, somber moments.

**Prompt tokens:** `desaturated, muted colors, subdued palette, understated color grading`

### Monochromatic

Single color family used throughout the scene, with variations in brightness and saturation.

**When to use:** Stylistic choice for specific scenes, brand-color emphasis, artistic sequences.

**Prompt tokens:** `monochromatic blue palette, single color family, tonal variation`

### Pastel / Soft

Light, low-saturation colors with high brightness. Gentle, approachable, modern.

**When to use:** Lifestyle brands, wellness content, children's content, spring/summer aesthetics.

**Prompt tokens:** `pastel color palette, soft colors, light and airy, gentle tones`

### Bleach Bypass

Desaturated with increased contrast. Mimics a film processing technique. Creates a gritty, intense look.

**When to use:** Thriller/suspense, war content, gritty urban scenes.

**Prompt tokens:** `bleach bypass look, desaturated high contrast, gritty film processing`

### Cross-Processing

Unusual color shifts created by processing film in the wrong chemicals. Creates unexpected, surreal color casts.

**When to use:** Music videos, dream sequences, artistic content, retro aesthetics.

**Prompt tokens:** `cross-processed colors, surreal color cast, experimental color grading`

---

## Brand Color Integration

When a project has brand colors (client work, branded content), those colors must be woven into the visual palette naturally.

### Integration Strategies

1. **Accent approach:** Brand color appears in small, intentional touches — a character's accessory, a prop, background signage, lighting accent. The overall palette remains natural.

2. **Environment approach:** The setting naturally incorporates the brand color — a blue-toned office for a blue brand, warm wooden interiors for a brown/earth brand.

3. **Lighting approach:** Color the lighting to lean toward the brand palette. A warm brand gets warm key lighting; a cool brand gets cooler ambient tones.

4. **Post-production approach:** Color grade the final output to shift the overall palette toward the brand colors without making it look artificial.

### Brand Color Don'ts

- Do not make the entire scene the brand color. It looks unnatural and cheap.
- Do not use brand colors at full saturation in natural environments. Real-world objects are rarely fully saturated.
- Do not force brand colors where they would be physically impossible (e.g., bright purple sunlight).
- Do not sacrifice character skin tone accuracy for brand color consistency. Skin tones should always look natural.

---

## Mood-Color Mapping

Quick reference for aligning color choices with emotional objectives:

| Mood | Primary Colors | Secondary Colors | Saturation | Contrast |
|------|---------------|-----------------|-----------|---------|
| **Joy / Celebration** | Warm yellow, bright orange | Soft pink, sky blue | High | Medium |
| **Calm / Serenity** | Soft blue, pale green | Lavender, cream | Low-medium | Low |
| **Tension / Anxiety** | Desaturated teal, sickly green | Harsh white, deep shadow | Low | High |
| **Romance / Intimacy** | Deep red, warm amber | Soft pink, candlelight gold | Medium | Low-medium |
| **Power / Authority** | Deep navy, black | Silver, dark red | Low-medium | High |
| **Luxury / Premium** | Deep purple, gold | Black, ivory | Medium-high | Medium |
| **Mystery / Suspense** | Deep blue, dark teal | Cool violet, muted green | Low | High |
| **Energy / Excitement** | Bright red, electric blue | Neon green, hot pink | Very high | High |
| **Sadness / Melancholy** | Muted blue, gray | Desaturated purple, cool brown | Very low | Low |
| **Nature / Growth** | Forest green, earth brown | Sky blue, sunlight gold | Medium | Medium |
| **Technology / Innovation** | Electric blue, teal | White, dark gray | Medium-high | Medium-high |
| **Nostalgia / Memory** | Sepia, warm amber | Faded orange, soft brown | Low (faded) | Low |

---

## Scene-to-Scene Color Continuity

### The Continuity Principle

Within a single scene, colors should remain consistent. Between scenes, color shifts should be intentional and motivated by the narrative.

### Within a Scene

- All clips in a scene use the same color grading.
- White balance does not shift between cuts.
- If the scene has a color identity (warm interior, cool exterior), maintain it throughout.
- Character skin tones remain consistent from clip to clip.

### Between Scenes

- **Same location, same time:** Colors should be nearly identical.
- **Same location, different time:** Gradual shift is natural (morning cool → afternoon warm → evening blue).
- **Different location:** Color shift is expected and helps the viewer understand the change.
- **Flashback/dream:** Intentional color shift signals the temporal/psychological change. Common: desaturated, color tinted, or high contrast.

### Continuity in Prompt Engineering

Maintain color continuity by including the same color/lighting tokens in all prompts within a scene:

```
# Scene 3, Clip A
... warm afternoon light, golden hour, amber tones, soft shadows ...

# Scene 3, Clip B — same color tokens
... warm afternoon light, golden hour, amber tones, soft shadows ...

# Scene 3, Clip C — same color tokens
... warm afternoon light, golden hour, amber tones, soft shadows ...

# Scene 4 (new location, different color) — intentional shift
... cool fluorescent office light, blue-gray tones, flat lighting ...
```

---

## Platform Considerations

### Mobile vs Desktop

- **Mobile screens** tend to have higher contrast and saturation than desktop monitors. Colors that look perfect on a calibrated desktop monitor may appear oversaturated on a phone.
- **Recommendation:** Grade for mobile first (slightly reduce saturation by 5–10%) since most social content is consumed on phones.
- **Dark mode consideration:** Content with very dark backgrounds may disappear on phones in bright environments. Ensure minimum brightness in shadow areas.

### Platform-Specific Color Notes

| Platform | Display Characteristics | Recommendation |
|----------|----------------------|----------------|
| **YouTube** | Wide range of devices. Desktop, TV, mobile. | Grade for middle ground. Avoid extreme darks. Test on multiple devices. |
| **TikTok** | Primarily mobile. OLED screens common. High saturation displays. | Reduce saturation slightly. Ensure text contrast. Avoid pure blacks (OLED smearing). |
| **Instagram** | Mobile-first. Feed images are small. Reels full-screen. | Boost contrast slightly for feed thumbnails. Colors need to pop at small sizes. |
| **LinkedIn** | Desktop-heavy. Professional context. | Keep colors conservative. Avoid oversaturation. Clean, professional palettes. |
| **Twitter/X** | Mixed devices. Dark mode popular. | Test in both light and dark mode. Ensure sufficient contrast. |
| **Broadcast TV** | Calibrated monitors. Strict broadcast standards. | Use broadcast-safe colors. No super-whites or super-blacks. Rec. 709 color space. |

### Color Gamut Awareness

- **sRGB:** Standard for web. All web-delivered content should be in sRGB.
- **Rec. 709:** Standard for HD broadcast. Very similar to sRGB but with different gamma.
- **DCI-P3:** Wider gamut used by modern phones and Apple displays. Content may look different on P3 vs sRGB screens.
- **Rec. 2020:** Ultra-wide gamut for 4K HDR. Phase 2 consideration.

**For Cookie Phase 1:** Work in sRGB. It is the safest common denominator across all platforms.

---

## Color Accessibility

- **Color blindness affects ~8% of males and ~0.5% of females.** Never rely on color alone to convey critical information.
- **Red-green color blindness (most common):** Avoid red/green distinctions for important elements. Use shape, text, or pattern in addition to color.
- **Minimum contrast ratios:** Text over images/video must meet WCAG standards. See `typography-standards.md` for specific ratios.
- **When in doubt:** Convert the image to grayscale. If the important elements are still distinguishable, the color design is accessible.
