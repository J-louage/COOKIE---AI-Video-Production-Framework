# Thumbnail Generation Checklist

## Hook Scene Identification
- [ ] SSD analyzed for hook, intro, or high-impact scenes
- [ ] 2 to 3 candidate scenes identified for thumbnail extraction
- [ ] Fallback to first scene and high visual_impact scenes if no tags

## Frame Extraction
- [ ] Representative frame extracted from each candidate scene
- [ ] Frame selected at visual peak (30-50% through scene duration)
- [ ] FFmpeg used for high-quality PNG extraction (-q:v 2)
- [ ] Extracted frames evaluated for clarity, composition, no motion blur
- [ ] Best frame selected as primary thumbnail base

## Brand Overlay
- [ ] Episode title text added with brand font, size, and color
- [ ] Gradient or darkened region applied behind title for readability
- [ ] Channel logo or watermark placed in consistent position (if applicable)
- [ ] Brand visual treatment applied (color grading, vignette, border)
- [ ] Overlay enhances appeal without obscuring key visual content

## Platform Sizing
- [ ] YouTube: 1280x720 pixels (16:9)
- [ ] Instagram Post: 1080x1080 pixels (1:1)
- [ ] TikTok: 1080x1920 pixels (9:16)
- [ ] High-quality lanczos resampling used
- [ ] Smart cropping preserves key visual area and title text
- [ ] Title text position adjusted for non-native aspect ratios

## Output
- [ ] Thumbnails saved to episodes/{episode_id}/exports/thumbnails/
- [ ] Naming convention: {episode_id}-thumb-{platform}-{timestamp}.png
- [ ] PNG format for maximum quality
- [ ] JPEG versions at 85% quality for size-limited platforms
- [ ] Thumbnail manifest created with dimensions, file sizes, platforms
