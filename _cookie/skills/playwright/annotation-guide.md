# Playwright Annotation Guide

How to add visual annotations to screen recordings to guide viewer attention and emphasize key UI elements.

---

## Annotation Types

### Highlight Click
A colored circle or pulse effect at the click location to draw attention to the action.

```javascript
// CSS injection approach — add before the click action
await page.evaluate((selector) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const highlight = document.createElement('div');
  highlight.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width / 2 - 20}px;
    top: ${rect.top + rect.height / 2 - 20}px;
    width: 40px; height: 40px;
    border-radius: 50%;
    border: 3px solid #FF4444;
    background: rgba(255, 68, 68, 0.15);
    pointer-events: none;
    z-index: 99999;
    animation: pulse 0.6s ease-out;
  `;
  highlight.id = '__cookie_highlight';
  document.body.appendChild(highlight);
}, '.target-element');
```

**Best for:** Drawing attention to buttons, links, and interactive elements before clicking.

### Bounding Box
A rectangle outline around a UI element to highlight a region of the screen.

```javascript
await page.evaluate((selector, color) => {
  const el = document.querySelector(selector);
  if (el) {
    el.style.outline = `3px solid ${color}`;
    el.style.outlineOffset = '4px';
  }
}, '.feature-panel', '#FF4444');

// Hold for desired duration
await page.waitForTimeout(3000);

// Remove
await page.evaluate((selector) => {
  const el = document.querySelector(selector);
  if (el) {
    el.style.outline = '';
    el.style.outlineOffset = '';
  }
}, '.feature-panel');
```

**Best for:** Highlighting sections, panels, or groups of related UI elements.

### Spotlight
Dim everything except the target area to create a focused spotlight effect.

```javascript
await page.evaluate((selector) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const rect = el.getBoundingClientRect();

  const overlay = document.createElement('div');
  overlay.id = '__cookie_spotlight';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99998; pointer-events: none;
    clip-path: polygon(
      0% 0%, 0% 100%, ${rect.left}px 100%, ${rect.left}px ${rect.top}px,
      ${rect.right}px ${rect.top}px, ${rect.right}px ${rect.bottom}px,
      ${rect.left}px ${rect.bottom}px, ${rect.left}px 100%, 100% 100%, 100% 0%
    );
  `;
  document.body.appendChild(overlay);
}, '.target-element');
```

**Best for:** Isolating a specific feature in a complex UI, tutorials.

### Text Callout
A label or tooltip pointing to a UI feature with explanatory text.

```javascript
await page.evaluate((selector, text, position) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const rect = el.getBoundingClientRect();

  const callout = document.createElement('div');
  callout.id = '__cookie_callout';
  callout.innerHTML = text;
  callout.style.cssText = `
    position: fixed;
    ${position === 'right' ? `left: ${rect.right + 16}px` : `left: ${rect.left}px`};
    top: ${rect.top - 8}px;
    background: #1a1a1a; color: #ffffff;
    padding: 8px 16px; border-radius: 6px;
    font-family: Inter, sans-serif; font-size: 14px;
    z-index: 99999; pointer-events: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(callout);
}, '.feature-element', 'Real-time analytics dashboard', 'right');
```

**Best for:** Explaining features, labeling sections, adding context.

### Zoom
Magnify a specific region of the screen for detail visibility.

```javascript
await page.evaluate((selector, scale) => {
  const el = document.querySelector(selector);
  if (!el) return;
  el.style.transform = `scale(${scale})`;
  el.style.transformOrigin = 'center center';
  el.style.transition = 'transform 0.5s ease';
  el.style.zIndex = '99999';
  el.style.position = 'relative';
}, '.small-detail', 2.0);
```

**Best for:** Small text, icons, or data that viewers need to read.

### Blur
Blur sensitive areas of the screen to hide personal data or credentials.

```javascript
await page.evaluate((selector) => {
  const el = document.querySelector(selector);
  if (el) {
    el.style.filter = 'blur(8px)';
  }
}, '.personal-info');
```

**Best for:** Hiding email addresses, names, financial data in demos.

### Step Number Badge
Sequential number badges at each action point to show progression.

```javascript
await page.evaluate((selector, stepNum) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const rect = el.getBoundingClientRect();

  const badge = document.createElement('div');
  badge.innerHTML = stepNum.toString();
  badge.style.cssText = `
    position: fixed;
    left: ${rect.left - 16}px; top: ${rect.top - 16}px;
    width: 32px; height: 32px;
    background: #FF4444; color: white;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: bold; font-size: 16px;
    z-index: 99999; pointer-events: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;
  badge.className = '__cookie_badge';
  document.body.appendChild(badge);
}, '.step-target', 1);
```

**Best for:** Multi-step tutorials, guided walkthroughs, numbered processes.

---

## Implementation Approaches

### 1. In-Recording (CSS Injection)
Add annotations directly during the Playwright recording by injecting CSS and DOM elements. The annotation appears in the captured video.

**Pros:** Simple, no post-processing needed
**Cons:** Annotations are "baked in" — cannot adjust timing after recording

### 2. Post-Processing (Remotion Overlay)
Record a clean video, then add annotation components in the Remotion composition phase.

**Pros:** Full control over timing and animation, can be adjusted without re-recording
**Cons:** Requires composition step, more complex pipeline

### 3. Hybrid
Record with minimal annotations (bounding boxes, spotlights), add text callouts and step numbers in Remotion.

**Pros:** Best of both — important visual cues in the recording, detailed text in composition
**Cons:** Most complex setup

**Recommendation:** Use the hybrid approach for production demos. For quick previews and drafts, in-recording CSS injection is sufficient.

---

## Annotation Cleanup

Always remove annotations after their display duration:

```javascript
// Remove all COOKIE annotations
await page.evaluate(() => {
  document.querySelectorAll('[id^="__cookie_"], .__cookie_badge').forEach(el => el.remove());
  document.querySelectorAll('[style*="outline"]').forEach(el => {
    el.style.outline = '';
    el.style.outlineOffset = '';
  });
});
```

---

## SSD Annotation Configuration

Annotations are specified in the SSD under `playwright_config.annotations`:

```yaml
annotations:
  - type: "bounding-box"
    selector: ".feature-panel"
    color: "#FF4444"
    start_time: 3.0
    duration: 4.0

  - type: "spotlight"
    selector: ".cta-button"
    start_time: 8.0
    duration: 3.0

  - type: "text-callout"
    selector: ".metric-card"
    text: "Real-time performance data"
    position: "right"
    start_time: 5.0
    duration: 3.0

  - type: "zoom"
    selector: ".small-chart"
    scale: 2.0
    start_time: 10.0
    duration: 2.0

  - type: "step-number"
    selector: ".nav-item"
    step: 1
    start_time: 2.0
    duration: 0
```
