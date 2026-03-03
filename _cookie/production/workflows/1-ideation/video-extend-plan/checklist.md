# Video Extend Plan Checklist

## Required Checks (All Modification Types)
- [ ] Existing video loaded and metadata extracted (duration, resolution, aspect ratio, codec, FPS)
- [ ] Existing SSD loaded if available
- [ ] Content analysis completed (style, pacing, characters, narrative)
- [ ] Keyframes extracted for visual reference
- [ ] Modification type correctly classified (extend_duration | replace_section | add_overlay | change_format | add_narration)
- [ ] Secondary modification types identified if applicable
- [ ] Modification plan is complete and type-specific

## Extend Duration Checks
- [ ] Extension scenes planned with sequential scene IDs
- [ ] Insertion point specified (before, after, or between existing scenes)
- [ ] Every new scene has complete SSD entry
- [ ] First extension scene flows naturally from preceding scene
- [ ] Last frame of preceding scene planned for extraction (image-to-video input)
- [ ] Visual style continuity maintained (color grading, lighting, camera patterns)
- [ ] Character appearances consistent with existing content
- [ ] Pacing and rhythm match existing content
- [ ] Audio/music style continuation planned
- [ ] Merge strategy defined (ffmpeg concat or similar)

## Replace Section Checks
- [ ] Target scenes identified by timestamp range or scene ID
- [ ] Reason for replacement documented
- [ ] Boundary frames extracted (last frame before, first frame after replacement section)
- [ ] Replacement scenes match duration of originals (or deviation is intentional)
- [ ] Replacement SSD entries generated with boundary frame references
- [ ] Original scene entries marked as replaced with reference to new scene IDs
- [ ] Visual style continuity preserved with surrounding scenes
- [ ] Narrative coherence maintained across replacement boundary
- [ ] Splice strategy defined (ffmpeg segment replacement)

## Add Overlay Checks
- [ ] All overlays cataloged with precise timing (start, duration)
- [ ] Overlay types specified (text, caption, lower-third, watermark, title-card)
- [ ] Position, font, style, and animation defined for each overlay
- [ ] Layer order defined for overlapping overlays
- [ ] Overlays do not obscure critical visual content (faces, important objects)
- [ ] Text is readable at the video's target resolution
- [ ] Safe-area compliance verified for target platform
- [ ] Overlay timing does not conflict with scene transitions
- [ ] ffmpeg filter chain specified (drawtext/overlay filters)

## Change Format Checks
- [ ] Source and target formats documented (aspect ratio, resolution)
- [ ] Reframing strategy selected (crop-and-scale, pillarbox/letterbox, smart reframe)
- [ ] Per-scene crop regions or reframe parameters defined
- [ ] No critical visual content lost in reframe/crop
- [ ] Text elements remain readable in new format
- [ ] Character faces remain visible in all reformatted scenes
- [ ] Camera movement scenes handled correctly (pan, zoom)
- [ ] Output encoding parameters defined for target format
- [ ] Re-encoding cost estimate included

## Add Narration Checks
- [ ] Existing audio tracks analyzed (music, SFX, silence, dialogue)
- [ ] Narration timeline planned with per-segment text and timing
- [ ] Voice parameters specified (voice ID, tone, speed)
- [ ] Narration pacing matches visual content
- [ ] Audio mixing levels defined (narration level, background ducking)
- [ ] Ducking points aligned with narration start/end times
- [ ] No overlap between narration and existing dialogue or critical SFX
- [ ] Total narration fits within video duration
- [ ] Output audio mix strategy defined (stereo, separate tracks)
- [ ] TTS generation specifications included in SSD

## Output Verification (All Modification Types)
- [ ] Complete modification plan document produced
- [ ] SSD entries generated or updated for all modifications
- [ ] Continuity verification report included with flagged issues
- [ ] Cost estimate included for all modification work
- [ ] Execution strategy defined with specific ffmpeg commands or pipeline steps
- [ ] Modification plan saved alongside existing episode data
