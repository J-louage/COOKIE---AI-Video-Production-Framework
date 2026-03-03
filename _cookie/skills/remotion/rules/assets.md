# Assets

Assets (images, video, audio, fonts) are stored in the `public/` directory and referenced using `staticFile()`. Proper asset loading with `delayRender()` prevents rendering before assets are ready.

---

## staticFile()

Returns a URL to a file in the `public/` directory.

```tsx
import { staticFile } from "remotion";

const videoUrl = staticFile("video/intro.mp4");
const imageUrl = staticFile("images/logo.png");
const audioUrl = staticFile("audio/music.mp3");
const fontUrl = staticFile("fonts/Inter-Bold.woff2");
```

### Path Resolution

- `staticFile("image.png")` resolves to `public/image.png`
- `staticFile("images/hero.jpg")` resolves to `public/images/hero.jpg`
- Do not include `public/` in the path
- Do not use absolute filesystem paths

---

## Asset Directory Structure in COOKIE

```
public/
  audio/
    narration/
      scene-1.mp3
      scene-2.mp3
    music/
      background.mp3
    sfx/
      whoosh.mp3
      click.mp3
  images/
    backgrounds/
      gradient-blue.png
    logos/
      company-logo.svg
    overlays/
      light-leak-01.mp4
  video/
    clips/
      b-roll-01.mp4
    backgrounds/
      particles.mp4
  fonts/
    Inter-Regular.woff2
    Inter-Bold.woff2
    Montserrat-Black.woff2
```

---

## delayRender / continueRender

Use `delayRender()` to pause frame rendering until an async resource is loaded. Call `continueRender()` when the resource is ready.

```tsx
import { delayRender, continueRender } from "remotion";
import { useState, useEffect } from "react";

const AsyncComponent: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading data"));
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("https://api.example.com/data")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        continueRender(handle); // always call to prevent hanging
      });
  }, [handle]);

  if (!data) return null;

  return <div>{data.title}</div>;
};
```

### delayRender Parameters

```tsx
const handle = delayRender(
  "Description of what is loading",  // label for debugging
  { timeoutInMilliseconds: 30000 }   // timeout (default: 30000)
);
```

---

## Image Loading

```tsx
import { Img, staticFile, delayRender, continueRender } from "remotion";
import { useState, useCallback } from "react";

// Simple - Img component handles loading
const SimpleImage: React.FC = () => {
  return <Img src={staticFile("images/hero.jpg")} style={{ width: "100%" }} />;
};

// With explicit delay for custom img elements
const CustomImage: React.FC<{ src: string }> = ({ src }) => {
  const [handle] = useState(() => delayRender("Loading image"));

  const onLoad = useCallback(() => {
    continueRender(handle);
  }, [handle]);

  const onError = useCallback(() => {
    continueRender(handle);
  }, [handle]);

  return (
    <img
      src={staticFile(src)}
      onLoad={onLoad}
      onError={onError}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};
```

---

## Video Asset Loading

```tsx
import { OffthreadVideo, staticFile } from "remotion";

// OffthreadVideo is preferred over <Video> for rendering performance
const BackgroundVideo: React.FC = () => {
  return (
    <OffthreadVideo
      src={staticFile("video/background.mp4")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};
```

### OffthreadVideo vs Video

| Feature          | `<Video>`              | `<OffthreadVideo>`        |
|------------------|------------------------|---------------------------|
| Rendering        | Main thread            | Separate thread           |
| Performance      | Can block              | Non-blocking              |
| Seeking          | Standard               | Frame-accurate            |
| Use case         | Preview                | Final render              |

---

## Audio Asset Loading

```tsx
import { Audio, staticFile } from "remotion";

const BackgroundMusic: React.FC = () => {
  return <Audio src={staticFile("audio/music/background.mp3")} volume={0.3} />;
};
```

---

## Font Asset Loading

### Local Fonts

```tsx
import { staticFile } from "remotion";

const fontFace = new FontFace("CustomFont", `url(${staticFile("fonts/CustomFont.woff2")})`);

// Load font with delayRender
import { delayRender, continueRender } from "remotion";
import { useState, useEffect } from "react";

const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender("Loading font"));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const font = new FontFace(
      "CustomFont",
      `url(${staticFile("fonts/CustomFont.woff2")})`
    );
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setLoaded(true);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  if (!loaded) return null;

  return <>{children}</>;
};
```

---

## Preloading Assets

For assets needed across multiple sequences, preload them once in the top-level component.

```tsx
import { prefetch } from "remotion";
import { useEffect } from "react";

const Preloader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Prefetch returns { free, waitUntilDone }
    const music = prefetch(staticFile("audio/music.mp3"));
    const logo = prefetch(staticFile("images/logo.png"));

    return () => {
      music.free();
      logo.free();
    };
  }, []);

  return <>{children}</>;
};
```

---

## Remote Assets

Remote URLs work but add network latency during render.

```tsx
<Img src="https://example.com/images/photo.jpg" />
<Audio src="https://cdn.example.com/audio/track.mp3" />
<OffthreadVideo src="https://cdn.example.com/video/clip.mp4" />
```

For reliability, download remote assets to `public/` before rendering.

---

## COOKIE SSD Asset Mapping

SSD references assets by relative path. The COOKIE pipeline places assets in the `public/` directory before Remotion renders.

```yaml
scenes:
  - id: scene-1
    background:
      type: "video"
      src: "video/clips/b-roll-01.mp4"
    narration:
      src: "audio/narration/scene-1.mp3"
    text_overlays:
      - text: "Welcome"
        font: "fonts/Montserrat-Black.woff2"
```

```tsx
function renderBackground(bg: { type: string; src?: string; color?: string }) {
  switch (bg.type) {
    case "video":
      return <OffthreadVideo src={staticFile(bg.src!)} style={coverStyle} />;
    case "image":
      return <Img src={staticFile(bg.src!)} style={coverStyle} />;
    case "color":
      return <AbsoluteFill style={{ backgroundColor: bg.color }} />;
    default:
      return <AbsoluteFill style={{ backgroundColor: "#000" }} />;
  }
}

const coverStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
```

---

## Pitfalls

1. **Forgetting continueRender.** Every `delayRender()` must have a matching `continueRender()`, including in error paths. A missing `continueRender()` causes the render to hang and eventually time out.

2. **Using public/ in the path.** `staticFile("public/image.png")` is wrong. Use `staticFile("image.png")`.

3. **Large video files.** Videos over 100MB slow rendering significantly. Consider transcoding large files to lower bitrates before importing.

4. **CORS with remote assets.** Remote assets must have CORS headers allowing access from localhost during preview and from the render server during rendering.

5. **Case-sensitive paths.** File paths are case-sensitive on Linux (including Lambda/Docker). `staticFile("Images/Logo.PNG")` fails if the file is `images/logo.png`.
