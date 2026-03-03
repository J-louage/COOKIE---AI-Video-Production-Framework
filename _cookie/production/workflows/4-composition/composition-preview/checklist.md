# Composition Preview Checklist

## Render Configuration
- [ ] Resolution set to 720p (1280x720)
- [ ] CRF set to 28 for smaller file size
- [ ] Codec set to h264 with fast encoding preset
- [ ] Expensive non-critical effects disabled for preview
- [ ] Concurrency set to 50% of available CPU cores

## Render Execution
- [ ] Remotion render command executed successfully
- [ ] Render progress monitored and logged
- [ ] No errors or warnings during render (or resolved and retried)
- [ ] Preview saved to episodes/{episode_id}/exports/preview/preview-{timestamp}.mp4

## Preview Presentation
- [ ] Preview file path displayed to reviewer
- [ ] Duration, resolution, and file size reported
- [ ] Composition summary provided (scenes, transitions, audio, text overlays)
- [ ] Known issues or placeholders noted

## Approval Gate
- [ ] Explicit approval or rejection obtained
- [ ] If approved: composition marked ready for final render
- [ ] If rejected: specific feedback collected
- [ ] Feedback documented as actionable revision tasks
- [ ] Post-production blocked until approval obtained
