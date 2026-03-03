# Asset QA Checklist

## Required Checks
- [ ] T4 asset inventory run and complete
- [ ] All assets from SSD accounted for (present, missing, or extra)
- [ ] Asset status matrix built with per-asset status

## Video Clip Validation
- [ ] Every video clip file exists and is not corrupted
- [ ] Clip durations match SSD specifications (within 0.5s tolerance)
- [ ] Clip resolutions match SSD specifications
- [ ] Codec is correct (H.264 or H.265)
- [ ] Frame rate matches target FPS
- [ ] File sizes are reasonable (not too small or too large)
- [ ] No extreme visual artifacts, color banding, or frozen frames
- [ ] Multi-clip merged scenes have smooth continuity at boundaries
- [ ] Merged scene durations match SSD total scene duration

## Audio Validation
- [ ] All narration files exist and play correctly
- [ ] Audio is clean (no clipping, distortion, or background noise)
- [ ] Speaking pace appropriate for scene context
- [ ] Narration duration aligns with scene timing
- [ ] Voice matches expected character configuration
- [ ] Narration text matches the script
- [ ] Music and SFX files present and mapped to scenes

## Character Reference Validation
- [ ] All four angle references exist per character (front, side, back, three-quarter)
- [ ] Composite reference sheet exists per character
- [ ] Visual consistency across angles (face, clothing, proportions)
- [ ] Resolution meets reference image standard
- [ ] No AI artifacts (extra limbs, distorted features)

## Frame Validation
- [ ] All first/last frames exist at expected paths
- [ ] Frame resolution matches target clip resolution
- [ ] Frame aspect ratio matches target clip
- [ ] Frame content matches scene context
- [ ] Extracted frames are clean (no encoding artifacts)

## Cross-Check and Reporting
- [ ] Every SSD scene has all required assets
- [ ] Scene-to-asset mappings are correct
- [ ] Comprehensive QA report generated
- [ ] Issues categorized (critical, warning, info)
- [ ] Regeneration recommendations provided for failed assets
- [ ] Cost estimate for regeneration included if applicable
- [ ] Gate decision recorded: proceed to assembly or regenerate flagged assets
