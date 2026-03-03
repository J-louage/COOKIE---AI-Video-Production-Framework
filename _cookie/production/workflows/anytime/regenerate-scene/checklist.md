# Regenerate Scene Checklist

## Scene Identification
- [ ] Scene ID(s) received from user
- [ ] All scene IDs validated against SSD
- [ ] For multi-clip scenes: user specified all clips or specific clip_id

## Prompt Review
- [ ] Current prompt loaded and displayed to user
- [ ] User chose: same prompt or revised prompt
- [ ] If revised: SSD updated with new prompt
- [ ] If revised: prompt library updated

## Cost Gate
- [ ] Regeneration cost calculated from pricing.yaml
- [ ] Cost breakdown shown (VEO, Nano Banana, total)
- [ ] Current episode spend and remaining budget displayed
- [ ] User approved cost (or auto-approved in YOLO mode)

## Asset Regeneration
- [ ] VEO generation submitted with correct prompt and settings
- [ ] For multi-clip: first/last frames regenerated as needed
- [ ] For multi-clip: clips re-merged via FFmpeg concat
- [ ] New asset saved as video-v{n+1}.mp4
- [ ] Previous version(s) preserved

## Retake Tracking
- [ ] Retake logged in _cost/actuals/{episode_id}-actuals.yaml
- [ ] is_retake set to true
- [ ] retake_reason recorded (user-provided standard code)
- [ ] Cost, timestamp, scene_id, and tool logged

## Retake Limits
- [ ] Total retakes counted for each scene
- [ ] Warning issued if max_retakes_per_scene reached
- [ ] User presented options if limit reached: continue, skip, or adjust prompt

## Quality Assurance
- [ ] Duration matches SSD specification (within 0.5s)
- [ ] Resolution and aspect ratio match SSD
- [ ] Video file is playable and not corrupted
- [ ] Visual consistency checked with adjacent scenes
- [ ] QA results reported to user
