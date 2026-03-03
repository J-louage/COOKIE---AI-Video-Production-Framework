# Record Screen Capture Checklist

## Required Checks
- [ ] SSD loaded and all screen-recording scenes extracted
- [ ] Target URLs identified for each recording
- [ ] Viewport dimensions configured per SSD specification
- [ ] Device emulation configured if needed (mobile, tablet)
- [ ] Action sequences identified with timing offsets
- [ ] Annotation specifications extracted (highlights, arrows, callouts)

## Quality Standards
- [ ] Playwright browser configured with correct viewport and settings
- [ ] Page fully loaded before recording starts (network idle)
- [ ] Login or setup steps completed if required
- [ ] All actions executed correctly and visibly in the recording
- [ ] Action timing matches SSD specifications
- [ ] Click targets hit correctly (no misclicks)
- [ ] Scroll actions smooth and at correct speed
- [ ] Keyboard input typed with realistic delays
- [ ] Annotations positioned correctly on target elements
- [ ] Annotations appear and disappear at correct timing
- [ ] Sensitive information blurred or redacted where specified
- [ ] Recording resolution matches SSD specification

## Output Verification
- [ ] Recording saved to episodes/{episode_id}/assets/video/{scene_id}/recording.mp4
- [ ] Recording duration matches expected timing
- [ ] Metadata file created with scene_id, url, viewport, duration
- [ ] Zero API cost confirmed (screen recordings are free)
- [ ] Recording can run parallel to AI generation workflows
