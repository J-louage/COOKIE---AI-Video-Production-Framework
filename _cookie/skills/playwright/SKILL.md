# Playwright Skill — Screen Recording

## Purpose

Playwright provides programmatic browser automation for capturing screen recordings of web applications. Used by the Demo Producer (Kai) to create precisely choreographed product demos, software walkthroughs, and UI interaction recordings.

**Priority:** P1 — Full implementation in Phase 2. This document covers core capabilities needed for Phase 1 screen recording workflows.

---

## Core Capabilities

### Screen Recording

Playwright can record browser sessions as video files, capturing exactly what appears in the viewport.

```javascript
const { chromium } = require('playwright');

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 2560, height: 1440 },  // 2x for crisp output
  recordVideo: {
    dir: './recordings/',
    size: { width: 2560, height: 1440 }
  }
});

const page = await context.newPage();
await page.goto('https://example.com');

// ... execute action sequence ...

await context.close();  // Video saved on context close
await browser.close();
```

### Viewport Configuration

| Parameter | Description | Example |
|-----------|-------------|---------|
| `width` | Viewport width in pixels | 2560 (2x for 1280 output) |
| `height` | Viewport height in pixels | 1440 (2x for 720 output) |
| `deviceScaleFactor` | Pixel density | 2 |
| `isMobile` | Mobile device emulation | false |
| `hasTouch` | Touch support | false |
| `colorScheme` | Light/dark mode | "light" |

### Common Viewport Presets

```yaml
viewports:
  desktop-2x:
    width: 2560
    height: 1440
    deviceScaleFactor: 1
    notes: "Record at 2x, render at 1280x720 for crispness"
  desktop-1080p-2x:
    width: 3840
    height: 2160
    deviceScaleFactor: 1
    notes: "Record at 2x, render at 1920x1080"
  mobile-iphone:
    width: 750
    height: 1334
    deviceScaleFactor: 2
    isMobile: true
    hasTouch: true
  mobile-android:
    width: 720
    height: 1280
    deviceScaleFactor: 2
    isMobile: true
    hasTouch: true
  tablet-ipad:
    width: 1536
    height: 2048
    deviceScaleFactor: 2
    isMobile: true
    hasTouch: true
```

---

## Action Sequence

The SSD specifies an ordered list of actions for each screen recording scene. Playwright executes them sequentially with precise timing.

### Supported Actions

| Action | Syntax | Description |
|--------|--------|-------------|
| `navigate` | `await page.goto(url)` | Navigate to URL |
| `click` | `await page.click(selector)` | Click an element |
| `type` | `await page.type(selector, text)` | Type text into an input |
| `scroll` | `await page.evaluate(...)` | Scroll to position or element |
| `hover` | `await page.hover(selector)` | Hover over an element |
| `wait` | `await page.waitForTimeout(ms)` | Pause for specified duration |
| `screenshot` | `await page.screenshot(...)` | Capture a still frame |
| `select` | `await page.selectOption(selector, value)` | Select dropdown option |
| `press` | `await page.press(selector, key)` | Press a keyboard key |

### Timing Control

```javascript
// Wait between actions for natural pacing
await page.waitForTimeout(2000);  // 2-second pause

// Wait for element to appear
await page.waitForSelector('.pricing-section', { state: 'visible' });

// Smooth scroll at controlled speed
await page.evaluate(async () => {
  const target = document.querySelector('.pricing-section');
  const targetY = target.getBoundingClientRect().top + window.scrollY;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = Math.abs(distance) / 200;  // 200px per second
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const eased = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;
    window.scrollTo(0, startY + distance * eased);
    await new Promise(r => setTimeout(r, (duration * 1000) / steps));
  }
});
```

---

## Annotations

Annotations are visual overlays added to recordings to guide viewer attention.

### Types

| Annotation | Description | Implementation |
|------------|-------------|----------------|
| **Cursor highlight** | Colored circle around cursor position | CSS injection |
| **Bounding box** | Rectangle around a UI element | CSS outline injection |
| **Spotlight** | Dim everything except target area | CSS overlay with cutout |
| **Text callout** | Label pointing to a feature | DOM injection |
| **Arrow** | Arrow pointing to an element | SVG overlay |
| **Zoom** | Magnify a region of the screen | CSS transform on target |

### Example: Add Bounding Box

```javascript
await page.evaluate((selector) => {
  const el = document.querySelector(selector);
  if (el) {
    el.style.outline = '3px solid #FF4444';
    el.style.outlineOffset = '4px';
    el.style.borderRadius = '4px';
  }
}, '.cta-button');

await page.waitForTimeout(3000);  // Show for 3 seconds

// Remove annotation
await page.evaluate((selector) => {
  const el = document.querySelector(selector);
  if (el) {
    el.style.outline = '';
    el.style.outlineOffset = '';
  }
}, '.cta-button');
```

---

## SSD Integration

Screen recording scenes are specified in the SSD with scene_type: `screen-recording`:

```yaml
scenes:
  - scene_id: "SC-005"
    scene_type: "screen-recording"
    duration_seconds: 15
    playwright_config:
      url: "https://app.example.com/dashboard"
      viewport:
        width: 2560
        height: 1440
      actions:
        - type: "navigate"
          url: "https://app.example.com/dashboard"
          wait_after: 2000
        - type: "click"
          selector: ".sidebar-menu .analytics"
          wait_after: 1500
        - type: "scroll"
          target: ".chart-section"
          speed: 200
          wait_after: 2000
        - type: "hover"
          selector: ".chart-bar:nth-child(3)"
          wait_after: 1000
      annotations:
        - type: "bounding-box"
          selector: ".chart-section"
          color: "#FF4444"
          start_time: 5.0
          duration: 3.0
```

---

## Output

- Recordings saved to: `episodes/{episode_id}/assets/{scene_id}/recording.mp4`
- No API cost (local compute only)
- Output codec: VP8 in WebM container (Playwright default), convert to H.264 MP4 with FFmpeg if needed:

```bash
ffmpeg -i recording.webm -c:v libx264 -crf 23 -c:a aac recording.mp4
```

---

## Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| Element not found | Selector doesn't match any DOM element | Wait for element, retry with broader selector |
| Navigation timeout | Page takes too long to load | Increase timeout, check URL validity |
| Recording too short | Actions completed faster than expected | Add appropriate wait times between actions |
| Recording too long | Actions took longer than expected | Reduce wait times, optimize selectors |
| Viewport mismatch | Browser window size doesn't match config | Verify launch configuration, check headless mode |

---

## Related Files

- `_cookie/skills/image-editing/SKILL.md` — For annotation overlays and frame extraction from recordings
- `_cookie/skills/ffmpeg/SKILL.md` — For format conversion and duration validation of recordings
