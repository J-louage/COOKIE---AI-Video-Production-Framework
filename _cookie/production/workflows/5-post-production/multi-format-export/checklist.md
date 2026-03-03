# Multi-Format Export Checklist

## Prerequisites
- [ ] format_exports list loaded from SSD or project config
- [ ] Final render source file exists and verified
- [ ] All platform specifications confirmed (resolution, aspect ratio, codec)

## Crop Strategy
- [ ] Crop strategy applied per format (center-crop, smart-crop, letterbox, pillarbox)
- [ ] Source aspect ratio converted correctly to each target aspect ratio
- [ ] No critical visual content lost in cropped versions
- [ ] Smart-crop preserves key visual areas per scene

## Scaling
- [ ] Each format scaled to exact target resolution
- [ ] Lanczos algorithm used for high-quality downscaling
- [ ] No sub-pixel rounding errors in scaled output
- [ ] Common resolutions verified: 1920x1080, 1080x1920, 1080x1080

## Captions
- [ ] Burned-in captions applied for short-form vertical formats (TikTok, Reels)
- [ ] Caption source from SRT or VTT file
- [ ] Captions styled per platform best practices (large font, high contrast)
- [ ] Captions readable and properly timed

## Encoding
- [ ] Platform-specific encoding presets applied per format
- [ ] Correct codec profile, level, and bitrate configured
- [ ] Audio codec (AAC) and bitrate set correctly
- [ ] File sizes within platform limits
- [ ] Two-pass encoding used for strict size constraints

## Export
- [ ] All format exports rendered successfully
- [ ] Files saved to episodes/{episode_id}/exports/formats/{platform-name}/
- [ ] Filename convention: {episode_id}-{platform}-{timestamp}.mp4
- [ ] Format manifest created per export (platform, resolution, codec, bitrate, file size)
- [ ] No formats skipped from the exports list
