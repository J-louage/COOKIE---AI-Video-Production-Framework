# Text Animation Checklist

## Prerequisites
- [ ] SSD remotion config loaded with text overlay definitions
- [ ] Typography settings and brand style guide available
- [ ] Remotion project loaded and ready for component creation

## Component Creation
- [ ] Text component instance created for every overlay in the SSD
- [ ] Correct template used per overlay type (title card, lower third, callout, caption, full-screen)
- [ ] Font family, size, weight, and color set per brand style guide
- [ ] Text shadow or outline properties applied where specified

## Animation Configuration
- [ ] Animation type applied per SSD specification (fade, slide, typewriter, scale, bounce)
- [ ] Animation duration and easing curves set correctly
- [ ] SSD timestamps converted to frame numbers accurately
- [ ] Enter and exit animations timed to correct moments
- [ ] Remotion Easing functions used for smooth curves

## Positioning
- [ ] Text overlays positioned per SSD specification
- [ ] Safe-zone margins applied (10% from edges)
- [ ] Lower thirds positioned consistently at bottom third
- [ ] Titles centered vertically and horizontally
- [ ] No text overlays collide at any point in the timeline

## Subtitles (if enabled)
- [ ] Subtitle components generated from narration text and timing
- [ ] Subtitle mode applied (word-level or sentence-level)
- [ ] Subtitles styled according to brand guide
- [ ] Subtitles positioned at bottom center within safe zones
- [ ] Subtitles do not overlap with other text overlays

## Readability Validation
- [ ] Minimum font size of 24px at 1080p maintained
- [ ] Contrast ratio meets WCAG AA standard (4.5:1 minimum)
- [ ] Display duration allows sufficient reading time (min 3s short text, 1s per 3 words)
- [ ] No text clipped by frame edges
- [ ] Readability report generated
