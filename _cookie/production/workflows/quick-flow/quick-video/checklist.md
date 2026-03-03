# Quick Video Checklist

## Concept Input (Interaction Point 1)
- [ ] Video concept received from user
- [ ] Target duration set (default: 60s)
- [ ] Format determined (default: brand-film)
- [ ] Aspect ratio set (default: 16:9)
- [ ] Existing shared characters auto-detected

## Script Generation (Automated)
- [ ] Abbreviated script generated from concept
- [ ] Scene list created with durations totaling target duration
- [ ] Each scene has description and camera/action notes
- [ ] No multi-draft review process (skipped for speed)

## SSD Generation (Automated)
- [ ] Simplified SSD created from abbreviated script
- [ ] Project defaults applied (VEO model, resolution, speed)
- [ ] VEO prompts generated inline per scene
- [ ] Global negative prompt applied
- [ ] Simple cut transitions set (no complex animations)

## Cost Approval (Interaction Point 2)
- [ ] Cost estimate calculated from pricing.yaml
- [ ] VEO call count and per-call cost shown
- [ ] 10% buffer added to estimate
- [ ] User approved cost (or auto-approved in YOLO mode)

## Asset Generation (Automated)
- [ ] All scenes submitted to VEO (text-to-video mode)
- [ ] Existing character references used where available
- [ ] Parallel generation used where possible
- [ ] Each generation cost logged to actuals
- [ ] No first/last frame generation (skipped for speed)

## Composition (Automated)
- [ ] Remotion composition assembled with simple cuts
- [ ] Title card added (if specified)
- [ ] CTA added at end (if specified)
- [ ] VEO native audio used (no separate audio sync)
- [ ] No subtitle generation (skipped for speed)

## Render and Delivery (Interaction Point 3)
- [ ] Video rendered at standard resolution
- [ ] h264 codec with resolution profile CRF
- [ ] Single output format (no multi-format export)
- [ ] Duration matches target (within 2s tolerance)
- [ ] Resolution correct
- [ ] File is playable
- [ ] Total cost logged and displayed
- [ ] Final video presented to user for review
