# Generate Frames Checklist

## Required Checks
- [ ] SSD loaded with all scene and clip configurations
- [ ] Dependency graph loaded to identify frame requirements
- [ ] Prompt library loaded for frame prompt context
- [ ] All nano-banana sourced first frames identified
- [ ] All nano-banana sourced last frames identified
- [ ] Extract-source frames identified and logged as pending extraction
- [ ] Frame generation queue built with correct prioritization

## Quality Standards
- [ ] Every generated frame matches the target VEO clip resolution
- [ ] Every generated frame matches the target VEO clip aspect ratio
- [ ] Frame content accurately depicts the scene context
- [ ] Character appearances in frames match reference images
- [ ] No AI artifacts in generated frames
- [ ] Frame composition supports the intended camera movement of the clip
- [ ] Color palette and lighting match the style guide

## Output Verification
- [ ] All nano-banana frames generated and saved
- [ ] Files saved to episodes/{episode_id}/assets/frames/{scene_id}/
- [ ] File naming convention followed: {clip_id}-{first|last}-frame.png
- [ ] Dependency graph updated to mark frames as complete
- [ ] Downstream video clip dependencies unblocked where applicable
- [ ] Total frame generation cost logged
- [ ] Cost within budget allocation for frame generation
