# FFmpeg Integration

Remotion uses FFmpeg internally for encoding video and audio. The `@remotion/renderer` package provides programmatic control over encoding settings, and post-render FFmpeg processing can be applied for additional effects.

---

## Codec Options

### Via CLI

```bash
npx remotion render src/index.ts MyVideo out/video.mp4 \
  --codec=h264 \
  --crf=18 \
  --pixel-format=yuv420p \
  --audio-codec=aac \
  --audio-bitrate=320k
```

### Via remotion.config.ts

```ts
import { Config } from "@remotion/cli/config";

Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setVideoBitrate("8M");
```

### Supported Codecs

| Codec     | Container | Quality   | File Size | Use Case                  |
|-----------|-----------|-----------|-----------|---------------------------|
| `h264`    | MP4       | Good      | Medium    | General purpose, YouTube  |
| `h265`    | MP4       | Better    | Smaller   | Modern playback           |
| `vp8`     | WebM      | Good      | Medium    | Web compatibility         |
| `vp9`     | WebM      | Better    | Smaller   | Web, high quality         |
| `prores`  | MOV       | Excellent | Large     | Post-production editing   |
| `gif`     | GIF       | Low       | Large     | Short clips, social       |

---

## CRF (Constant Rate Factor)

Controls quality vs file size trade-off. Lower = better quality, larger file.

| CRF  | Quality         | Use Case                |
|------|-----------------|-------------------------|
| 0    | Lossless        | Archival only           |
| 15   | Near lossless   | High quality masters    |
| 18   | Very good       | Default for production  |
| 23   | Good            | Default for most codecs |
| 28   | Acceptable      | Smaller files needed    |
| 35+  | Poor            | Previews only           |

```bash
npx remotion render src/index.ts MyVideo out/hq.mp4 --crf=15
npx remotion render src/index.ts MyVideo out/preview.mp4 --crf=30
```

---

## Programmatic Rendering with @remotion/renderer

```ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

async function render() {
  const bundled = await bundle({
    entryPoint: "./src/index.ts",
    webpackOverride: (config) => config,
  });

  const composition = await selectComposition({
    serveUrl: bundled,
    id: "MyVideo",
  });

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: "out/video.mp4",
    crf: 18,
    pixelFormat: "yuv420p",
    audioBitrate: "320k",
    videoBitrate: "8M",
    concurrency: 4,
    onProgress: ({ progress }) => {
      console.log(`Rendering: ${Math.round(progress * 100)}%`);
    },
  });
}
```

### renderMedia Options

| Option            | Type       | Description                           |
|-------------------|------------|---------------------------------------|
| `composition`     | `object`   | Composition from selectComposition    |
| `serveUrl`        | `string`   | URL from bundle()                     |
| `codec`           | `string`   | Video codec                           |
| `outputLocation`  | `string`   | Output file path                      |
| `crf`             | `number`   | Quality factor                        |
| `pixelFormat`     | `string`   | Pixel format                          |
| `audioBitrate`    | `string`   | Audio bitrate (e.g., "320k")          |
| `videoBitrate`    | `string`   | Video bitrate (e.g., "8M")           |
| `concurrency`     | `number`   | Parallel render threads               |
| `imageFormat`     | `string`   | `"jpeg"` or `"png"` for frames       |
| `onProgress`      | `function` | Progress callback                     |

---

## convertMedia()

Convert between media formats programmatically.

```ts
import { convertMedia } from "@remotion/webcodecs";

await convertMedia({
  src: "input.webm",
  container: "mp4",
  videoCodec: "h264",
  audioCodec: "aac",
});
```

---

## Post-Render FFmpeg Processing

After Remotion renders the video, apply additional FFmpeg effects.

### Add Subtitles

```bash
ffmpeg -i rendered.mp4 -vf "subtitles=captions.srt" -codec:a copy output.mp4
```

### Add Watermark

```bash
ffmpeg -i rendered.mp4 -i watermark.png \
  -filter_complex "overlay=W-w-20:H-h-20" \
  -codec:a copy output.mp4
```

### Concatenate Videos

```bash
# Create concat list
echo "file 'intro.mp4'" > concat.txt
echo "file 'main.mp4'" >> concat.txt
echo "file 'outro.mp4'" >> concat.txt

ffmpeg -f concat -safe 0 -i concat.txt -codec copy output.mp4
```

### Extract Audio

```bash
ffmpeg -i rendered.mp4 -vn -acodec copy output.aac
ffmpeg -i rendered.mp4 -vn -acodec libmp3lame -q:a 2 output.mp3
```

### Create Thumbnail

```bash
ffmpeg -i rendered.mp4 -ss 00:00:05 -vframes 1 thumbnail.jpg
```

### Resize / Scale

```bash
# Scale to 720p maintaining aspect ratio
ffmpeg -i rendered.mp4 -vf "scale=1280:720" -codec:a copy output_720p.mp4

# Scale for TikTok (9:16)
ffmpeg -i rendered.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -codec:a copy tiktok.mp4
```

---

## ProRes for Editing

Render as ProRes for import into video editors (Premiere, DaVinci, Final Cut).

```bash
npx remotion render src/index.ts MyVideo out/master.mov --codec=prores --prores-profile=4444
```

### ProRes Profiles

| Profile | Quality     | Alpha | Use Case            |
|---------|-------------|-------|---------------------|
| `proxy` | Preview     | No    | Offline editing     |
| `lt`    | Light       | No    | Standard editing    |
| `standard` | Good    | No    | Broadcast           |
| `hq`    | High        | No    | Final delivery      |
| `4444`  | Excellent   | Yes   | VFX, compositing    |

---

## Rendering Still Frames

```ts
import { renderStill } from "@remotion/renderer";

await renderStill({
  composition,
  serveUrl: bundled,
  output: "thumbnail.png",
  frame: 90,           // which frame to capture
  imageFormat: "png",  // or "jpeg"
});
```

---

## COOKIE Pipeline Integration

The COOKIE pipeline renders via `@remotion/renderer` and applies post-render FFmpeg steps.

```ts
async function cookieRender(ssd: any) {
  // 1. Bundle
  const bundled = await bundle({ entryPoint: "./src/index.ts" });

  // 2. Select composition
  const comp = await selectComposition({
    serveUrl: bundled,
    id: "SSDVideo",
    inputProps: { ssd },
  });

  // 3. Render master
  await renderMedia({
    composition: comp,
    serveUrl: bundled,
    codec: "h264",
    crf: 18,
    outputLocation: "out/master.mp4",
  });

  // 4. Post-process: burn in subtitles if configured
  if (ssd.subtitles?.burn_in) {
    // ffmpeg -i out/master.mp4 -vf "subtitles=out/captions.srt" out/final.mp4
  }

  // 5. Generate variants (thumbnail, social crops)
  // ffmpeg -i out/final.mp4 -ss 5 -vframes 1 out/thumbnail.jpg
}
```

---

## Pitfalls

1. **FFmpeg not found.** Remotion requires FFmpeg. Install it via the system package manager or use the bundled FFmpeg provided by `@remotion/renderer`.

2. **h265 browser support.** H.265/HEVC is not universally supported in browsers. Use h264 for web playback.

3. **CRF 0 creates enormous files.** Lossless encoding produces files 10-100x larger than CRF 18. Only use for intermediate masters.

4. **ProRes on Linux.** ProRes encoding may have compatibility issues on some Linux distributions. Test before committing to a pipeline.

5. **Concurrency and memory.** High concurrency (`concurrency: 8+`) uses significant RAM. Each thread renders a full frame in memory. Monitor memory usage during rendering.
