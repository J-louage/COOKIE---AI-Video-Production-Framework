# Playwright Recording Patterns

Common recording patterns for screen capture scenes. Each pattern includes an action sequence template, timing recommendations, and annotation placement guidance.

---

## Product Walkthrough

**Purpose:** Demonstrate key features of a web application in a guided tour.

**Action Sequence:**
1. Navigate to the application landing page (wait 2s for load)
2. Click on the primary navigation to reach the feature area (wait 1.5s)
3. Interact with the main feature — fill inputs, click buttons, observe results (wait 2s between actions)
4. Scroll to additional features or results (smooth scroll at 200px/s)
5. Hover over key metrics or data points to trigger tooltips (hold 1.5s)
6. End on a CTA or success state (hold 3s)

**Timing:** 12-20 seconds total. Each action gets 1.5-2s of visibility.

**Annotations:**
- Bounding box on the feature being demonstrated
- Text callout explaining what the feature does
- Cursor highlight on clickable elements

**SSD Template:**
```yaml
playwright_config:
  url: "https://app.example.com"
  viewport: { width: 2560, height: 1440 }
  actions:
    - { type: "navigate", url: "https://app.example.com/dashboard", wait_after: 2000 }
    - { type: "click", selector: ".nav-features", wait_after: 1500 }
    - { type: "click", selector: ".feature-demo-btn", wait_after: 2000 }
    - { type: "scroll", target: ".results-section", speed: 200, wait_after: 2000 }
    - { type: "hover", selector: ".metric-card:first-child", wait_after: 1500 }
    - { type: "wait", duration: 3000 }
  annotations:
    - { type: "bounding-box", selector: ".feature-panel", start_time: 3.5, duration: 4.0 }
    - { type: "text-callout", text: "Real-time analytics", selector: ".metric-card", start_time: 8.0, duration: 3.0 }
```

---

## Sign-Up Flow

**Purpose:** Show how easy it is to create an account and get started.

**Action Sequence:**
1. Navigate to the sign-up page (wait 2s)
2. Click on the email input field (wait 0.5s)
3. Type email address with character delay (80ms per character)
4. Tab to password field and type password (100ms per character, masked)
5. Click the sign-up button (wait 2s for response)
6. Show the success/welcome screen (hold 3s)

**Timing:** 10-15 seconds total. Typing should feel natural, not rushed.

**Annotations:**
- Spotlight on the sign-up form
- Arrow pointing to the CTA button before clicking
- Success checkmark overlay on completion

**Tips:**
- Use a realistic but fictional email address
- Type at a human-readable speed (not too fast)
- Add a brief pause before clicking submit for anticipation

---

## Dashboard Tour

**Purpose:** Overview of a complex dashboard with multiple sections.

**Action Sequence:**
1. Navigate and login (if needed, pre-authenticate via cookies)
2. Show the overview/summary dashboard (wait 3s for full comprehension)
3. Click into the first major section (wait 2s)
4. Interact with data — hover charts, expand details (wait 1.5s each)
5. Navigate to second section via sidebar (wait 1.5s)
6. Demonstrate a key action (e.g., create report, export data)
7. Return to overview (wait 2s)

**Timing:** 15-25 seconds total. Complex dashboards need more dwell time.

**Annotations:**
- Bounding box on each section as it's explored
- Text labels identifying key metrics
- Zoom on small but important data points

---

## Mobile Demo

**Purpose:** Show a mobile app or responsive website on a phone-sized viewport.

**Action Sequence:**
1. Configure mobile viewport (390x844 for iPhone, 412x915 for Android)
2. Navigate to the mobile-optimized page (wait 2s)
3. Scroll through the mobile experience (touch-style smooth scroll, 150px/s)
4. Tap on mobile navigation elements (wait 1s)
5. Interact with mobile-specific features (swipe, pull-to-refresh)
6. Show a key mobile interaction (wait 2s)

**Timing:** 10-15 seconds. Mobile demos should be snappy.

**Annotations:**
- Finger tap indicator instead of cursor highlight
- Swipe direction arrows for gesture-based interactions

**Tips:**
- Enable `isMobile: true` and `hasTouch: true` in viewport config
- Use device-specific viewport sizes from viewport-presets.yaml
- Consider recording at 2x the mobile resolution and scaling down

---

## Before/After Comparison

**Purpose:** Show improvement or change between two states.

**Action Sequence:**
1. Navigate to the "before" state (wait 3s for viewer to register)
2. Add a visual divider or transition annotation
3. Perform the action that creates the change (wait 1s)
4. Show the "after" state (wait 3s for comparison)
5. Optionally: side-by-side comparison via split screen

**Timing:** 8-12 seconds. Let both states breathe.

**Annotations:**
- "Before" and "After" text labels
- Bounding boxes highlighting the changed areas
- Arrow or animation showing the transformation

---

## General Timing Guidelines

| Action Type | Recommended Wait After |
|------------|----------------------|
| Page navigation | 2000-3000ms |
| Button click | 1500-2000ms |
| Text input (per field) | 500ms + typing time |
| Scroll to section | 1000-2000ms after scroll completes |
| Hover for tooltip | 1500ms |
| Final state hold | 2000-3000ms |
| Between major sections | 1000ms pause |

## Recording Quality Rules

1. **Always record at 2x viewport** — Downscale to target resolution for crisp text
2. **Add 1s buffer** at start and end for clean cuts
3. **Avoid mouse jitter** — Playwright's programmatic control eliminates this naturally
4. **Pre-load the page** — Navigate to the URL before starting the recording timer to avoid loading spinners
5. **Clean state** — Clear cookies/cache if needed for a fresh experience, or pre-seed auth tokens for authenticated demos
