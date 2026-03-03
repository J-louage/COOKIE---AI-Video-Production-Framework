# Audio Sync Checklist

## Prerequisites
- [ ] SSD audio configuration loaded (narration, music, SFX entries)
- [ ] All referenced audio files verified on disk
- [ ] Project FPS confirmed for timestamp-to-frame conversion

## Narration Mapping
- [ ] Narration timestamps converted to frame numbers
- [ ] Audio components created for each narration segment
- [ ] startFrom and endAt frame values set accurately
- [ ] Narration segments do not overlap with each other
- [ ] Narration aligns with corresponding scene boundaries

## Music Volume Curves
- [ ] Baseline music volume set from SSD config
- [ ] Ducking applied during all narration segments
- [ ] Ramp down over 0.3s before narration starts
- [ ] Ramp up over 0.5s after narration ends
- [ ] Duck level reduces music by 12-18dB below narration
- [ ] Remotion interpolate() used for smooth transitions

## SFX Placement
- [ ] Each SFX clip placed at its designated timestamp
- [ ] Timestamps converted to correct frame positions
- [ ] Individual SFX volume levels set as specified
- [ ] SFX clips do not mask narration
- [ ] Overlapping SFX combined levels stay within headroom

## Audio Mix
- [ ] All layers combined: narration (top), SFX (middle), music (base)
- [ ] Combined audio does not clip above 0dBFS
- [ ] Limiter applied if peaks exceed -1dBFS

## Level Validation
- [ ] Integrated loudness measures -14 LUFS (within 1 LU tolerance)
- [ ] True peak does not exceed -1dBTP
- [ ] Loudness range (LRA) within 7-15 LU
- [ ] Loudness report generated with all measurements
