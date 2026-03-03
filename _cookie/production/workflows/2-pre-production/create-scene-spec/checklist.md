# Create Scene Spec (SSD) Checklist

## Required Checks
- [ ] Canonical script loaded with all scenes
- [ ] Format preset loaded with duration and platform constraints
- [ ] Character identities loaded for all referenced characters
- [ ] Style guide loaded with style tokens and negative prompts
- [ ] VEO constraints loaded with model limits and supported modes
- [ ] Every scene classified by type (veo-generated, nano-banana-still, screen-recording, etc.)
- [ ] Every scene assigned a priority level (P0, P1, P2)
- [ ] Short-form hook scenes identified (first 3 seconds)

## Duration and Multi-Clip
- [ ] All scene durations calculated in seconds
- [ ] Scenes exceeding 8 seconds flagged for multi-clip splitting
- [ ] Multi-clip first clip: text-to-video or image-to-video input mode
- [ ] Multi-clip middle clips: interpolation mode with extracted first/last frames
- [ ] Multi-clip last clip: image-to-video input mode
- [ ] All multi-clip scenes have merge_strategy: ffmpeg-concat
- [ ] Individual clip durations sum to total scene duration
- [ ] Frame extraction points specified for visual continuity

## VEO Configuration
- [ ] Every clip has complete VEO config (model, input_mode, duration, resolution, aspect_ratio)
- [ ] Speed setting specified (normal, slow-mo, timelapse)
- [ ] Person generation flag set appropriately
- [ ] Reference images paths specified with [character:X] placeholders
- [ ] Prompts use [character:X] and [outfit:Y] placeholder syntax
- [ ] Negative prompts included in every VEO config
- [ ] All configs validated against VEO model constraints

## Audio Configuration
- [ ] Every scene has audio config (narration, music, SFX, silence)
- [ ] Narration text and character voice specified
- [ ] Music references or mood descriptions included
- [ ] SFX list with timestamps and durations
- [ ] Audio timing mapped to video clip boundaries

## Remotion Configuration
- [ ] Every scene has Remotion composition config
- [ ] Duration in frames calculated at target FPS
- [ ] Layer order specified (video, narration, music, SFX, overlays)
- [ ] Text overlay specifications complete (content, position, font, timing)
- [ ] Transition effects to adjacent scenes defined

## Cost and Validation
- [ ] Per-scene cost estimates calculated
- [ ] Total episode cost estimate calculated
- [ ] Re-generation buffer included in cost estimates (1.5x)
- [ ] T6 SSD validation passes without errors
- [ ] SSD saved to episodes/{episode_id}/ssd/scene-spec.yaml
- [ ] Backup copy saved with timestamp
