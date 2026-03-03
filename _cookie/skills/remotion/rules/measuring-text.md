# Measuring Text

`@remotion/layout-utils` provides `measureText()` and `fillTextBox()` for computing text dimensions before rendering, enabling dynamic layouts that respond to text content.

---

## Setup

```bash
npm install @remotion/layout-utils
```

```tsx
import { measureText, fillTextBox } from "@remotion/layout-utils";
```

---

## measureText()

Measures the width and height of a text string given a font configuration.

```tsx
import { measureText } from "@remotion/layout-utils";

const measurement = measureText({
  text: "Hello World",
  fontFamily: "Inter",
  fontSize: 48,
  fontWeight: "700",
});

console.log(measurement.width);  // e.g., 312
console.log(measurement.height); // e.g., 58
```

### Parameters

```ts
measureText({
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight?: string;         // "400", "700", "bold", etc.
  fontStyle?: string;          // "normal", "italic"
  letterSpacing?: string;      // e.g., "0.05em"
  additionalStyles?: Record<string, string>; // extra CSS properties
}): { width: number; height: number };
```

---

## fillTextBox()

Determines how many words fit within a given width, wrapping text into multiple lines.

```tsx
import { fillTextBox } from "@remotion/layout-utils";

const result = fillTextBox({
  maxWidth: 600,
  maxLines: 3,
  fontFamily: "Inter",
  fontSize: 36,
  fontWeight: "400",
  text: "This is a long sentence that needs to be wrapped across multiple lines within a text box.",
});

console.log(result.lines);      // Array of line strings
console.log(result.exceeds);    // boolean - whether text exceeds maxLines
```

### Parameters

```ts
fillTextBox({
  maxWidth: number;
  maxLines: number;
  fontFamily: string;
  fontSize: number;
  fontWeight?: string;
  fontStyle?: string;
  letterSpacing?: string;
  text: string;
}): {
  lines: string[];
  exceeds: boolean;
};
```

---

## Dynamic Font Size Fitting

Find the largest font size that fits text within given bounds.

```tsx
import { measureText } from "@remotion/layout-utils";

function fitFontSize(
  text: string,
  maxWidth: number,
  maxHeight: number,
  fontFamily: string,
  fontWeight: string = "400",
  minSize: number = 12,
  maxSize: number = 200
): number {
  let low = minSize;
  let high = maxSize;
  let bestSize = minSize;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const { width, height } = measureText({
      text,
      fontFamily,
      fontSize: mid,
      fontWeight,
    });

    if (width <= maxWidth && height <= maxHeight) {
      bestSize = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return bestSize;
}

// Usage
const AutoSizeTitle: React.FC<{ text: string }> = ({ text }) => {
  const { width } = useVideoConfig();
  const maxWidth = width - 200; // 100px padding each side
  const fontSize = fitFontSize(text, maxWidth, 200, "Inter", "700");

  return (
    <div style={{ fontFamily: "Inter", fontSize, fontWeight: 700, color: "white" }}>
      {text}
    </div>
  );
};
```

---

## Multi-Line Text Layout

Wrap text into lines that fit a container, then render each line.

```tsx
import { fillTextBox } from "@remotion/layout-utils";
import { AbsoluteFill, useVideoConfig } from "remotion";

const WrappedText: React.FC<{
  text: string;
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  color?: string;
  maxLines?: number;
}> = ({
  text,
  fontSize = 48,
  fontFamily = "Inter",
  lineHeight = 1.3,
  color = "#FFFFFF",
  maxLines = 5,
}) => {
  const { width } = useVideoConfig();
  const maxWidth = width - 160; // 80px padding each side

  const { lines, exceeds } = fillTextBox({
    maxWidth,
    maxLines,
    fontFamily,
    fontSize,
    text,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div style={{ textAlign: "center" }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily,
              fontSize,
              lineHeight,
              color,
            }}
          >
            {line}
            {exceeds && i === lines.length - 1 ? "..." : ""}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

---

## Centered Text with Background

Measure text to create a precisely-sized background box.

```tsx
import { measureText } from "@remotion/layout-utils";

const TextWithBackground: React.FC<{
  text: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  bgColor?: string;
  paddingH?: number;
  paddingV?: number;
}> = ({
  text,
  fontSize = 36,
  fontFamily = "Inter",
  textColor = "#FFFFFF",
  bgColor = "rgba(0, 0, 0, 0.7)",
  paddingH = 24,
  paddingV = 12,
}) => {
  const { width, height } = measureText({
    text,
    fontFamily,
    fontSize,
    fontWeight: "600",
  });

  return (
    <div
      style={{
        display: "inline-flex",
        backgroundColor: bgColor,
        borderRadius: 8,
        paddingLeft: paddingH,
        paddingRight: paddingH,
        paddingTop: paddingV,
        paddingBottom: paddingV,
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize,
          fontWeight: 600,
          color: textColor,
          lineHeight: 1,
        }}
      >
        {text}
      </span>
    </div>
  );
};
```

---

## Dynamic Subtitle Sizing

Automatically size subtitles to fit within the safe area.

```tsx
import { measureText } from "@remotion/layout-utils";
import { useVideoConfig } from "remotion";

function getSubtitleFontSize(
  text: string,
  fontFamily: string,
  videoWidth: number,
  maxWidthPercent: number = 0.8,
  preferredSize: number = 48,
  minSize: number = 24
): number {
  const maxWidth = videoWidth * maxWidthPercent;

  let fontSize = preferredSize;
  while (fontSize > minSize) {
    const { width } = measureText({ text, fontFamily, fontSize, fontWeight: "600" });
    if (width <= maxWidth) return fontSize;
    fontSize -= 2;
  }

  return minSize;
}

const DynamicSubtitle: React.FC<{ text: string }> = ({ text }) => {
  const { width } = useVideoConfig();
  const fontSize = getSubtitleFontSize(text, "Inter", width);

  return (
    <div
      style={{
        fontFamily: "Inter",
        fontSize,
        fontWeight: 600,
        color: "white",
        textAlign: "center",
        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
      }}
    >
      {text}
    </div>
  );
};
```

---

## Truncation with Ellipsis

Truncate text that exceeds available width.

```tsx
import { measureText } from "@remotion/layout-utils";

function truncateText(
  text: string,
  maxWidth: number,
  fontFamily: string,
  fontSize: number,
  fontWeight: string = "400"
): string {
  const full = measureText({ text, fontFamily, fontSize, fontWeight });
  if (full.width <= maxWidth) return text;

  let truncated = text;
  while (truncated.length > 0) {
    truncated = truncated.slice(0, -1);
    const measured = measureText({
      text: truncated + "...",
      fontFamily,
      fontSize,
      fontWeight,
    });
    if (measured.width <= maxWidth) {
      return truncated.trimEnd() + "...";
    }
  }

  return "...";
}
```

---

## COOKIE SSD Integration

SSD text overlays may specify `max_width` or `auto_size`. Use `measureText()` to compute layout.

```yaml
text_overlays:
  - text: "This is a dynamically sized title"
    font: "Inter"
    font_weight: "700"
    max_width: 800
    auto_size: true
    min_font_size: 24
    max_font_size: 96
```

```tsx
function resolveTextOverlay(overlay: any, videoWidth: number) {
  const maxWidth = overlay.max_width || videoWidth * 0.8;

  if (overlay.auto_size) {
    const fontSize = fitFontSize(
      overlay.text,
      maxWidth,
      200,
      overlay.font || "Inter",
      overlay.font_weight || "400",
      overlay.min_font_size || 24,
      overlay.max_font_size || 96
    );
    return { ...overlay, resolved_font_size: fontSize };
  }

  return overlay;
}
```

---

## Pitfalls

1. **Font must be loaded first.** `measureText()` uses the browser's canvas API. If the font is not loaded, it falls back to a system font, producing incorrect measurements. Always call `loadFont()` or ensure the font is loaded via `delayRender` before measuring.

2. **measureText does not handle line breaks.** It measures a single line. For multi-line text, use `fillTextBox()` or split text manually.

3. **Letter spacing affects width.** If your text uses `letterSpacing`, pass it to `measureText()` via the `letterSpacing` parameter. Otherwise the measurement will be too narrow.

4. **Binary search precision.** The `fitFontSize` function above steps by 1px. For very large ranges, this is fast enough, but you could increase the step size if performance is a concern.

5. **Performance in render.** `measureText()` is synchronous and fast, but calling it hundreds of times per frame (e.g., for word-level measurements in a paragraph) can slow the preview. Cache results when possible.
