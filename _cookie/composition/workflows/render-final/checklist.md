# Render Final Checklist

## Resolution Profile
- [ ] Resolution profile loaded from SSD or project config
- [ ] Target resolution confirmed (e.g., 1920x1080, 2560x1440, 3840x2160)
- [ ] Frame rate confirmed (24, 30, or 60 FPS)
- [ ] Pixel format and color space specified
- [ ] Remotion composition dimensions match target resolution

## Render Configuration
- [ ] Codec set correctly (h264 or h265 per project config)
- [ ] CRF set to 18 or as specified for high quality
- [ ] Pixel format set to yuv420p for compatibility
- [ ] All effects and transitions enabled at full quality
- [ ] Concurrency optimized for render speed and stability

## Render Execution
- [ ] Full-resolution render executed via Remotion CLI
- [ ] Render progress monitored with periodic updates
- [ ] Memory usage tracked during render
- [ ] No errors or failures during render
- [ ] Output saved to temporary location for verification

## Output Verification
- [ ] Duration matches composition within 0.5s tolerance (via ffprobe)
- [ ] Resolution matches target exactly
- [ ] Codec and pixel format match specifications
- [ ] Frame rate matches specification
- [ ] File size within expected range (not corrupt or bloated)
- [ ] Audio streams present with correct channel configuration

## Export
- [ ] Final file saved to episodes/{episode_id}/exports/final/
- [ ] Filename follows convention: {episode_id}-final-{resolution}-{timestamp}.mp4
- [ ] Render manifest created with: date, duration, resolution, codec, file size, CRF, render time
- [ ] Episode status updated to indicate final render complete
