# Fonts

Fonts must be loaded before rendering to ensure correct text layout. Remotion supports Google Fonts via `@remotion/google-fonts` and local fonts via `staticFile()`.

---

## @remotion/google-fonts

### Installation

```bash
npm install @remotion/google-fonts
```

### Loading a Google Font

Each font has its own import path. The font name is PascalCase.

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();
// fontFamily = "Inter"

const Title: React.FC = () => {
  return (
    <div style={{ fontFamily, fontSize: 72, fontWeight: 700 }}>
      Hello World
    </div>
  );
};
```

### Loading Specific Weights and Styles

```tsx
import { loadFont } from "@remotion/google-fonts/Roboto";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});
```

### Common Font Imports

```tsx
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadOpenSans } from "@remotion/google-fonts/OpenSans";
import { loadFont as loadLato } from "@remotion/google-fonts/Lato";
import { loadFont as loadPlusJakartaSans } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadRaleway } from "@remotion/google-fonts/Raleway";
```

### getAvailableFonts()

List all available Google Fonts.

```tsx
import { getAvailableFonts } from "@remotion/google-fonts";

const fonts = getAvailableFonts();
// Returns an array of { fontFamily, importName, load }
```

---

## Local Font Loading

### Using staticFile and FontFace API

```tsx
import { staticFile, delayRender, continueRender } from "remotion";
import { useState, useEffect } from "react";

export const useLocalFont = (fontName: string, fontFile: string) => {
  const [handle] = useState(() => delayRender(`Loading font: ${fontName}`));

  useEffect(() => {
    const font = new FontFace(fontName, `url(${staticFile(fontFile)})`);

    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(`Failed to load font ${fontName}:`, err);
        continueRender(handle);
      });
  }, [fontName, fontFile, handle]);

  return fontName;
};

// Usage
const MyComponent: React.FC = () => {
  const fontFamily = useLocalFont("CustomFont", "fonts/CustomFont-Bold.woff2");

  return (
    <div style={{ fontFamily, fontSize: 64 }}>
      Custom Font Text
    </div>
  );
};
```

### Loading Multiple Local Fonts

```tsx
export const useFontPack = () => {
  const [handle] = useState(() => delayRender("Loading font pack"));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fonts = [
      new FontFace("BrandFont", `url(${staticFile("fonts/Brand-Regular.woff2")})`, {
        weight: "400",
        style: "normal",
      }),
      new FontFace("BrandFont", `url(${staticFile("fonts/Brand-Bold.woff2")})`, {
        weight: "700",
        style: "normal",
      }),
      new FontFace("BrandFont", `url(${staticFile("fonts/Brand-Italic.woff2")})`, {
        weight: "400",
        style: "italic",
      }),
    ];

    Promise.all(fonts.map((f) => f.load()))
      .then((loadedFonts) => {
        loadedFonts.forEach((f) => document.fonts.add(f));
        setLoaded(true);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Font pack load error:", err);
        continueRender(handle);
      });
  }, [handle]);

  return { fontFamily: "BrandFont", loaded };
};
```

---

## CSS @font-face

Alternative approach using a CSS file.

```css
/* src/fonts.css */
@font-face {
  font-family: "CustomFont";
  src: url("/fonts/CustomFont-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "CustomFont";
  src: url("/fonts/CustomFont-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: block;
}
```

```tsx
// Import in component
import "./fonts.css";

const Title: React.FC = () => {
  return (
    <div style={{ fontFamily: "CustomFont", fontWeight: 700, fontSize: 72 }}>
      Title
    </div>
  );
};
```

---

## ensureFont() Utility

A helper that ensures a font is loaded before rendering continues.

```tsx
import { delayRender, continueRender, staticFile } from "remotion";

export async function ensureFont(
  name: string,
  url: string,
  options?: FontFaceDescriptors
): Promise<string> {
  // Check if font is already loaded
  const existing = Array.from(document.fonts).find(
    (f) => f.family === name
  );
  if (existing && existing.status === "loaded") {
    return name;
  }

  const font = new FontFace(name, `url(${url})`, options);
  const loaded = await font.load();
  document.fonts.add(loaded);
  return name;
}

// Usage with delayRender
const FontAwareComponent: React.FC = () => {
  const [handle] = useState(() => delayRender("Font loading"));

  useEffect(() => {
    ensureFont("Heading", staticFile("fonts/Heading.woff2"), { weight: "900" })
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  return <div style={{ fontFamily: "Heading" }}>Title</div>;
};
```

---

## COOKIE SSD Font Mapping

```yaml
fonts:
  heading: "Montserrat"
  body: "Inter"
  caption: "fonts/CustomCaption.woff2"  # local font
```

```tsx
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

function loadSSDFonts(ssdFonts: Record<string, string>) {
  const fontMap: Record<string, string> = {};

  for (const [role, font] of Object.entries(ssdFonts)) {
    if (font.includes("/")) {
      // Local font file
      fontMap[role] = font; // handle with useLocalFont
    } else {
      // Google Font name — load via @remotion/google-fonts
      // Map is resolved at build time via specific imports
    }
  }

  return fontMap;
}

// Pre-configured font loading
const { fontFamily: headingFont } = loadMontserrat("normal", {
  weights: ["700", "900"],
});
const { fontFamily: bodyFont } = loadInter("normal", {
  weights: ["400", "500", "600"],
});
```

---

## Pitfalls

1. **Font not loaded during render.** Without `delayRender()`, the font may not be available when the frame renders, causing fallback font flashes or incorrect text measurement.

2. **font-display: swap causes flickering.** Use `font-display: block` for video rendering. Swap causes a visible flash as fonts load.

3. **Google Fonts import path is PascalCase.** `@remotion/google-fonts/OpenSans` not `@remotion/google-fonts/open-sans`.

4. **Missing font weights.** If you use `fontWeight: 700` but only loaded weight `400`, the browser synthesizes bold, which looks different.

5. **WOFF2 format preferred.** Use WOFF2 for smallest file size and fastest loading. TTF and OTF work but are larger.
