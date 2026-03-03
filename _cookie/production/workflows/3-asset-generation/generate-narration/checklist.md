# Generate Narration Checklist

## Required Checks
- [ ] SSD loaded and all narration scenes extracted
- [ ] Narration text collected for every scene with audio narration
- [ ] Character voice configs loaded (voice_id, settings, speaking style)
- [ ] ElevenLabs API requests built for all narration segments
- [ ] Correct voice model selected (multilingual or monolingual)
- [ ] All narration segments generated via ElevenLabs API

## Quality Standards
- [ ] Voice matches character's voice configuration
- [ ] Audio is clean (no artifacts, clipping, or background noise)
- [ ] Speaking pace matches character's speaking style preference
- [ ] Tone and emphasis appropriate for scene context
- [ ] Narration duration reasonable for text length
- [ ] Duration fits within scene's allocated time
- [ ] SSML markup applied correctly for emphasis and pauses
- [ ] Output format is mp3_44100_128 or higher

## Output Verification
- [ ] Narration files saved to episodes/{episode_id}/assets/audio/{scene_id}/narration.mp3
- [ ] Metadata files created with scene_id, character_id, voice_id, duration, cost
- [ ] Generation cost logged per segment
- [ ] Total narration generation cost within budget
- [ ] Quality and duration verification report generated
- [ ] Flagged any narration exceeding scene timing allocation
- [ ] Confirmed narration can run parallel to video generation
