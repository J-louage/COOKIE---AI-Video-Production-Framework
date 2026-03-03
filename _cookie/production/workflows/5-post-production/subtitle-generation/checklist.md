# Subtitle Generation Checklist

## Narration Extraction
- [ ] Narration text and timing extracted from SSD
- [ ] All segments have valid text and timestamps
- [ ] Segments sorted chronologically
- [ ] Total narration coverage calculated

## SRT Generation
- [ ] SRT file generated with correct SubRip format
- [ ] Sequential index numbers assigned
- [ ] Timestamps in HH:MM:SS,mmm format
- [ ] Long segments split (max 2 lines, max 42 chars per line)
- [ ] No subtitle displays longer than 7 seconds
- [ ] File saved to episodes/{episode_id}/exports/subtitles/{episode_id}.srt

## VTT Generation
- [ ] VTT file generated with WEBVTT header
- [ ] Timestamps in HH:MM:SS.mmm format
- [ ] Same line-splitting rules applied as SRT
- [ ] Position and alignment cues included (if applicable)
- [ ] File saved to episodes/{episode_id}/exports/subtitles/{episode_id}.vtt

## Word-Level Timing (if enabled)
- [ ] Word-level timing enabled in SSD configuration
- [ ] Individual words split with interpolated timing
- [ ] Word-level SRT generated ({episode_id}-words.srt)
- [ ] Word-level VTT generated ({episode_id}-words.vtt)

## Burn-In (if requested)
- [ ] FFmpeg subtitles filter applied with SRT source
- [ ] Font, size, color, outline configured per brand style guide
- [ ] Subtitle position set correctly (MarginV=40)
- [ ] Burned-in version saved alongside clean version
- [ ] Burned-in subtitles readable and properly timed
