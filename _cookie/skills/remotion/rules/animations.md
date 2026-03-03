# Animations

Remotion provides `interpolate()`, `spring()`, and `Easing` functions for creating animations. Every animation in Remotion is driven by the current frame number.

---

## interpolate()

Maps an input value (typically the current frame) to an output range.

```tsx
import { useCurrentFrame, interpolate } from "remotion";

const frame = useCurrentFrame();

// Fade in over 30 frames
const opacity = interpolate(frame, [0, 30], [0, 1]);

// Move from 100px to 0px
const translateY = interpolate(frame, [0, 30], [100, 0]);
```

### Signature

```ts
interpolate(
  input: number,
  inputRange: number[],
  outputRange: number[],
  options?: {
    easing?: (t: number) => number;
    extrapolateLeft?: "clamp" | "extend" | "identity";
    extrapolateRight?: "clamp" | "extend" | "identity";
  }
): number;
```

### Options

| Option             | Values                              | Default    | Description                          |
|--------------------|-------------------------------------|------------|--------------------------------------|
| `easing`           | `Easing.*` function                 | linear     | Easing curve                         |
| `extrapolateLeft`  | `"clamp"`, `"extend"`, `"identity"` | `"extend"` | Behavior before input range start    |
| `extrapolateRight` | `"clamp"`, `"extend"`, `"identity"` | `"extend"` | Behavior after input range end       |

### Always Clamp

Almost always use `extrapolateRight: "clamp"` (and often `extrapolateLeft: "clamp"`) to prevent values from exceeding the output range.

```tsx
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

### Multi-Step Interpolation

Use multiple input/output values for keyframe-style animation.

```tsx
// Fade in, hold, then fade out
const opacity = interpolate(
  frame,
  [0, 15, 45, 60],   // keyframe positions
  [0, 1, 1, 0],       // values at each keyframe
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
```

---

## Easing

Import easing functions to control animation curves.

```tsx
import { Easing } from "remotion";
```

### Common Easing Functions

```tsx
Easing.linear        // constant speed
Easing.ease          // cubic-bezier(0.25, 0.1, 0.25, 1)
Easing.in(fn)        // accelerate
Easing.out(fn)       // decelerate
Easing.inOut(fn)     // accelerate then decelerate

Easing.quad          // quadratic
Easing.cubic         // cubic
Easing.sin           // sinusoidal
Easing.exp           // exponential
Easing.circle        // circular
Easing.back(s?)      // overshoots, then returns
Easing.elastic(b?)   // spring-like elastic
Easing.bounce        // bouncing ball
Easing.bezier(x1, y1, x2, y2) // custom cubic bezier
```

### Usage with interpolate

```tsx
const translateX = interpolate(frame, [0, 30], [-200, 0], {
  easing: Easing.out(Easing.cubic),
  extrapolateRight: "clamp",
});

const scale = interpolate(frame, [0, 20], [0.5, 1], {
  easing: Easing.out(Easing.back(1.7)),
  extrapolateRight: "clamp",
});
```

---

## spring()

Physics-based animation that settles naturally. Returns a value from 0 to ~1 (may overshoot).

```tsx
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: {
    damping: 10,
    stiffness: 100,
    mass: 0.5,
  },
});
```

### Spring Config

| Property    | Default | Description                                    |
|-------------|---------|------------------------------------------------|
| `damping`   | `10`    | Friction. Higher = less bounce                 |
| `stiffness` | `100`   | Spring tension. Higher = faster                |
| `mass`      | `1`     | Weight. Higher = slower, more momentum         |
| `overshootClamping` | `false` | If true, clamp at target value       |

### Common Presets

```tsx
// Snappy, no bounce
spring({ frame, fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });

// Bouncy entrance
spring({ frame, fps, config: { damping: 8, stiffness: 150, mass: 0.8 } });

// Gentle float
spring({ frame, fps, config: { damping: 15, stiffness: 60, mass: 1 } });

// Heavy, slow settle
spring({ frame, fps, config: { damping: 12, stiffness: 80, mass: 2 } });
```

### Delayed Spring

Use the `delay` option or subtract frames.

```tsx
// Built-in delay (in frames)
const value = spring({ frame, fps, delay: 15 });

// Or manual offset
const value = spring({ frame: frame - 15, fps });
```

### spring() to Arbitrary Range

```tsx
const raw = spring({ frame, fps });
const fontSize = interpolate(raw, [0, 1], [24, 72]);
```

---

## SSD Animation Mapping

COOKIE SSD defines animation types per text overlay or scene element. Each maps to a specific `interpolate()` or `spring()` pattern.

### fade-in

```tsx
function fadeIn(frame: number, durationFrames: number = 15) {
  return {
    opacity: interpolate(frame, [0, durationFrames], [0, 1], {
      extrapolateRight: "clamp",
    }),
  };
}
```

### fade-in-up

```tsx
function fadeInUp(frame: number, fps: number, durationSec: number = 0.5) {
  const d = Math.round(durationSec * fps);
  return {
    opacity: interpolate(frame, [0, d], [0, 1], { extrapolateRight: "clamp" }),
    transform: `translateY(${interpolate(frame, [0, d], [30, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: "clamp",
    })}px)`,
  };
}
```

### slide-in-left

```tsx
function slideInLeft(frame: number, fps: number, durationSec: number = 0.5) {
  const d = Math.round(durationSec * fps);
  return {
    transform: `translateX(${interpolate(frame, [0, d], [-100, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: "clamp",
    })}%)`,
    opacity: interpolate(frame, [0, Math.min(d, 10)], [0, 1], {
      extrapolateRight: "clamp",
    }),
  };
}
```

### typewriter

```tsx
function typewriter(frame: number, fps: number, text: string) {
  const charsPerSecond = 20;
  const totalChars = text.length;
  const visibleChars = Math.floor((frame / fps) * charsPerSecond);
  return {
    text: text.slice(0, Math.min(visibleChars, totalChars)),
    showCursor: visibleChars < totalChars,
  };
}
```

### bounce

```tsx
function bounce(frame: number, fps: number) {
  const scale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 150, mass: 0.8 },
  });
  return {
    transform: `scale(${scale})`,
    opacity: interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }),
  };
}
```

### slide-in-right

```tsx
function slideInRight(frame: number, fps: number, durationSec: number = 0.5) {
  const d = Math.round(durationSec * fps);
  return {
    transform: `translateX(${interpolate(frame, [0, d], [100, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: "clamp",
    })}%)`,
  };
}
```

### Dispatcher

Use a dispatcher function to resolve SSD animation strings:

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

function applyAnimation(animationType: string, frame: number, fps: number) {
  switch (animationType) {
    case "fade-in": return fadeIn(frame);
    case "fade-in-up": return fadeInUp(frame, fps);
    case "slide-in-left": return slideInLeft(frame, fps);
    case "slide-in-right": return slideInRight(frame, fps);
    case "typewriter": return {}; // handled by component
    case "bounce": return bounce(frame, fps);
    default: return { opacity: 1 };
  }
}
```

---

## Pitfalls

1. **Forgetting to clamp.** Without `extrapolateRight: "clamp"`, values continue past the output range. Almost always clamp.

2. **Using frame 0 for spring delay.** `spring({ frame: frame - delay, fps })` passes negative frames, which spring handles, but it will not start animating until the frame reaches 0. Use the built-in `delay` option instead.

3. **Animating with seconds instead of frames.** `interpolate()` works with frames. Convert seconds to frames: `Math.round(seconds * fps)`.

4. **Too many interpolate calls.** Each call is cheap, but computing 20+ animations per frame per component can slow the preview. Consider memoizing complex calculations.

5. **spring() with fps mismatch.** Always pass `fps` from `useVideoConfig()` — never hardcode it. The spring calculation depends on the correct fps value.
