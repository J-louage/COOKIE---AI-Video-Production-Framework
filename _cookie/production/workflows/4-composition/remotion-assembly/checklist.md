# Remotion Assembly Checklist

## Prerequisites
- [ ] SSD loaded with all scene definitions, transitions, and audio config
- [ ] All video assets verified on disk under episodes/{episode_id}/assets/video/
- [ ] Audio assets (narration, music, SFX) available and verified

## Remotion Project
- [ ] Remotion project exists or scaffolded from correct template
- [ ] Dependencies installed (npm install completes without errors)
- [ ] Project compiles without TypeScript or build errors
- [ ] remotion.config.ts configured correctly for episode

## Asset Import
- [ ] All video clips imported as staticFile references
- [ ] Assets organized by scene ID
- [ ] All staticFile() paths resolve correctly
- [ ] No missing or corrupted files

## Sequence Creation
- [ ] Sequence component created for every scene in the SSD
- [ ] durationInFrames set correctly based on scene duration and FPS
- [ ] Sequences ordered according to SSD scene order
- [ ] OffthreadVideo components render clips within each Sequence

## Transitions
- [ ] Transition type applied per SSD specification (cut, crossfade, fade-to-black, wipe)
- [ ] Overlap durations accounted for in sequence timing
- [ ] Transitions render correctly in preview

## Audio Sync
- [ ] Narration audio synced to scene boundaries
- [ ] Music layered as continuous background track
- [ ] SFX placed at designated timestamps
- [ ] No audio clipping or incorrect overlaps

## Timeline Validation
- [ ] Composition component assembles all Sequences, transitions, and Audio
- [ ] Overall durationInFrames, FPS, width, and height set correctly
- [ ] Total duration matches SSD target within 1s tolerance
- [ ] No gaps or unintended overlaps between scenes
- [ ] Full preview render plays correctly end to end
