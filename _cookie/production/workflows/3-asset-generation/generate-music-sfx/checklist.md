# Generate Music and SFX Checklist

## Required Checks
- [ ] SSD loaded and all music/SFX references extracted
- [ ] Each reference classified as direct file path or mood/description
- [ ] Shared music library (shared-assets/music/) searched for all music refs
- [ ] Shared SFX library (shared-assets/sfx/) searched for all SFX refs
- [ ] File format compatibility verified (mp3, wav, aac)
- [ ] Duration and quality checked for all found assets

## Quality Standards
- [ ] Music tracks match the mood, tempo, and genre specified in the SSD
- [ ] SFX match the described effect type and timing
- [ ] Audio quality is sufficient for production use
- [ ] Music duration covers the scene timing requirements
- [ ] Volume levels appropriate for mixing with narration
- [ ] Fade in/out requirements noted per scene

## Output Verification
- [ ] Found assets copied to episodes/{episode_id}/assets/audio/music/
- [ ] Found SFX copied to episodes/{episode_id}/assets/audio/sfx/
- [ ] Mapping file created linking SSD references to asset file paths
- [ ] Missing music items flagged with mood, duration, and style description
- [ ] Missing SFX items flagged with effect type and timing
- [ ] Sourcing suggestions provided for all missing items
- [ ] Priority levels assigned to missing items (P0 essential, P1 substitutable)
- [ ] Audio formats compatible with Remotion pipeline
