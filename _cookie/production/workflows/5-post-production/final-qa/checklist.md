# Final QA Checklist

## Export Probing
- [ ] ffprobe run on every export file (final render + all format variants)
- [ ] Duration, resolution, codec, frame rate, bitrate collected per export
- [ ] Audio codec, sample rate, and channels verified per export
- [ ] All values compared against SSD and format export specifications
- [ ] Mismatches flagged for review

## Audio Level Verification
- [ ] Integrated loudness within 1 LU of -14 LUFS target
- [ ] True peak does not exceed -1dBTP
- [ ] No audio silence gaps longer than 2 seconds (unless intentional)
- [ ] No audio clipping events detected
- [ ] Failed exports flagged

## Black Frame Detection
- [ ] FFmpeg blackdetect filter run on each export
- [ ] Acceptable black frames at start (up to 0.5s) and end (up to 1s)
- [ ] No unexpected black frame sequences in the middle of video
- [ ] Intentional fade-to-black transitions cross-referenced with SSD

## Resolution and Aspect Ratio
- [ ] Each export matches exact target resolution for its platform
- [ ] No unintended letterboxing or pillarboxing
- [ ] Pixel aspect ratio is 1:1 (square pixels)
- [ ] Display aspect ratio matches target for cropped formats

## File Size
- [ ] YouTube exports under 2GB
- [ ] Instagram exports under 650MB
- [ ] TikTok exports under 287MB
- [ ] File sizes proportional to duration and resolution
- [ ] No suspiciously small files (possible corruption)

## Subtitle Verification
- [ ] SRT and VTT files exist and parse without errors
- [ ] Sequential numbering correct (SRT)
- [ ] Timestamps valid and non-overlapping
- [ ] Text content matches narration from SSD
- [ ] No empty subtitle entries
- [ ] Character count per line does not exceed 42
- [ ] Burned-in subtitles spot-checked for visibility and timing

## QA Report
- [ ] Comprehensive QA report compiled with pass/fail per export
- [ ] Summary table with: name, resolution, duration, file size, audio levels, status
- [ ] Report saved to episodes/{episode_id}/exports/qa-report-{timestamp}.yaml
- [ ] Critical failures flagged for attention before distribution

## Cost Report
- [ ] Cost report task T3 invoked with episode ID
- [ ] Total API costs included (VEO, audio, image generation)
- [ ] Compute costs included (render time)
- [ ] Breakdown by production phase provided
