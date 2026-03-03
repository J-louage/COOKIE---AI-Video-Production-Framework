# Generate Video Clips Checklist

## Required Checks
- [ ] SSD loaded with all scene and clip configurations
- [ ] Dependency graph loaded and prerequisites verified
- [ ] Prompt library loaded for all clips
- [ ] Character reference images verified for all referenced characters
- [ ] First frames verified for all image-to-video clips
- [ ] Initial cost gate passed (estimated cost within budget)
- [ ] Clips processed in correct dependency order

## Generation Quality
- [ ] Every clip generated via VEO API successfully
- [ ] Clip durations match SSD specifications (within 0.5s tolerance)
- [ ] Clip resolutions match SSD specifications exactly
- [ ] Correct VEO model used per clip (veo-2 or veo-3)
- [ ] Correct input mode used per clip (text-to-video, image-to-video, interpolation)
- [ ] Speed settings applied correctly (normal, slow-mo, timelapse)
- [ ] Person generation flag set correctly per clip
- [ ] API failures handled with retries (max 2 retries per clip)

## Multi-Clip Scenes
- [ ] Last frames extracted from previous clips using ffmpeg -sseof
- [ ] Extracted frames verified for quality and resolution
- [ ] Multi-clip scenes merged using ffmpeg concat demuxer
- [ ] Merged scene durations match total SSD scene duration
- [ ] Visual continuity maintained across clips in merged scenes

## Cost Tracking
- [ ] Per-scene cost logged for every clip
- [ ] Warning issued if any single scene exceeds $5
- [ ] Generation halted if any single scene exceeds $10 (requires approval)
- [ ] Cumulative cost tracked against budget
- [ ] Warning issued at 80% of budget
- [ ] Generation halted at 120% of budget (requires approval)

## Output Verification
- [ ] Video files saved to episodes/{episode_id}/assets/video/{scene_id}/
- [ ] meta.json created for every clip with: scene_id, clip_id, veo_model, input_mode, duration, resolution, speed, cost, generated_at, prompt_hash, version
- [ ] Merged files saved alongside individual clips
- [ ] Dependency graph updated with completion status
- [ ] Total generation cost, clip count, and success rate logged
