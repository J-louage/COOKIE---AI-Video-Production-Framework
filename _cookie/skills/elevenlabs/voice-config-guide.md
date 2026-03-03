# Voice Configuration Guide

## Purpose

This guide provides detailed parameter tuning instructions for ElevenLabs text-to-speech generation. Understanding these parameters is essential for producing narration and dialogue that matches the emotional tone, pacing, and character requirements of each scene.

---

## Parameter Deep Dive

### Stability (0.0–1.0)

**What it controls:** The variability of the voice output between generations. This is the most impactful parameter for emotional tone.

**How it works:**
- **Low stability (0.0–0.3):** The voice becomes highly expressive and variable. Each generation may sound slightly different. Pitch, pacing, and inflection fluctuate more. Best for emotional or dramatic content where you want the voice to "act."
- **Medium stability (0.4–0.6):** Balanced expressiveness. The voice has natural variation without being unpredictable. This is the sweet spot for most narration.
- **High stability (0.7–1.0):** The voice becomes very consistent and steady. Less emotional range, more monotone. Ideal for formal content, data readouts, or when you need absolute consistency across multiple clips that will be concatenated.

**Recommended ranges by use case:**

| Use Case | Stability Range | Rationale |
|----------|----------------|-----------|
| Narration (general) | 0.50–0.70 | Natural variation without unpredictability |
| Emotional dialogue | 0.30–0.50 | Allows expressive range for acting |
| Whispering / intimate | 0.70–0.85 | Keeps whisper consistent, prevents breaking into normal voice |
| Excited / high-energy | 0.25–0.40 | Lets energy come through naturally |
| Corporate / formal | 0.70–0.90 | Professional, steady delivery |
| Meditation / calm | 0.75–0.90 | Soothing consistency |
| Documentary | 0.55–0.70 | Authoritative but engaging |

**Warning:** Stability below 0.2 can produce unpredictable results including sudden pitch changes, unnatural pauses, or garbled segments. Always preview at very low stability values.

---

### Clarity / Similarity Boost (0.0–1.0)

**What it controls:** How closely the generated speech matches the original voice sample. This parameter is labeled "Similarity Boost" in the API but often referred to as "Clarity" in documentation.

**How it works:**
- **Low clarity (0.0–0.4):** The output diverges more from the reference voice. Can sound more generic. May reduce artifacts if the source voice has quality issues.
- **Medium clarity (0.5–0.7):** Good voice resemblance with some flexibility. Useful when the voice needs to adapt to content that the original speaker might not have recorded (e.g., shouting, singing).
- **High clarity (0.7–0.9):** Strong fidelity to the reference voice. The output clearly sounds like the target speaker. Recommended default.
- **Very high clarity (0.9–1.0):** Maximum resemblance. Can sometimes introduce artifacts or a "processed" quality. Use with caution.

**Recommended ranges by use case:**

| Use Case | Clarity Range | Rationale |
|----------|--------------|-----------|
| Most use cases | 0.70–0.85 | Strong voice match without artifacts |
| Custom/cloned voices | 0.80–0.90 | Maximize resemblance to the original |
| Stock voices | 0.65–0.80 | Stock voices are already well-optimized |
| Experimental / creative | 0.40–0.60 | Allow voice to adapt freely |

**Interaction with stability:** High clarity + low stability can sometimes produce artifacts. If you hear buzzing or metallic tones, try reducing clarity by 0.05–0.10.

---

### Style (0.0–1.0)

**What it controls:** The degree of style exaggeration applied to the output. This parameter amplifies the speaking style characteristics of the voice.

**Availability:** Style is only available on v2 models (`eleven_multilingual_v2`, `eleven_turbo_v2`). It is ignored on v1 models.

**How it works:**
- **Style 0.0:** Completely neutral delivery. The voice speaks without any stylistic emphasis. Flat but clear.
- **Style 0.1–0.3:** Subtle style. Slight natural inflections. Good for content that should feel human but restrained.
- **Style 0.4–0.6:** Moderate style. The voice's natural characteristics come through clearly. Engaging without being dramatic.
- **Style 0.7–0.9:** Strong style. Pronounced inflections, dramatic pacing, and expressive delivery. Great for storytelling but can feel over-the-top for factual content.
- **Style 1.0:** Maximum exaggeration. The voice's style traits are pushed to their extreme. Use only for very specific creative effects.

**Recommended ranges by use case:**

| Use Case | Style Range | Rationale |
|----------|------------|-----------|
| Natural narration | 0.30–0.50 | Engaging without distraction |
| Dramatic storytelling | 0.60–0.80 | Full emotional range |
| Corporate / formal | 0.20–0.35 | Professional restraint |
| Children's content | 0.60–0.75 | Animated, engaging delivery |
| News / informational | 0.25–0.40 | Credible, measured tone |
| Whisper / ASMR | 0.15–0.30 | Subtle, intimate |
| Comedy / playful | 0.65–0.85 | Exaggerated for comedic timing |

**Performance note:** Style values above 0.5 increase generation latency slightly (approximately 10–15% longer). Factor this into batch processing time estimates.

---

### use_speaker_boost (boolean)

**What it controls:** An enhancement layer that makes the speaker's voice more prominent, clear, and dynamic in the output.

**When to enable (true):**
- Narration that needs to cut through background music
- Dialogue that will be mixed with SFX
- Content intended for mobile playback (small speakers need more presence)
- Energetic, punchy delivery styles
- Most production scenarios (this is the recommended default)

**When to disable (false):**
- Ambient or background speech (overheard conversations, radio chatter)
- Whisper or intimate narration where subtlety is key
- Content that will receive significant post-processing
- When the voice sounds too "processed" or "radio-announcer"
- Meditation or ASMR content

---

## Pre-Built Settings by Use Case

These are tested, production-ready parameter combinations for common scenarios. Use them as starting points and adjust as needed.

### Narration (Standard)
```json
{
  "stability": 0.65,
  "clarity": 0.78,
  "style": 0.45,
  "use_speaker_boost": true
}
```
Natural, engaging narration suitable for explainers, documentaries, and general video content. Balanced between expressiveness and consistency.

### Dialogue (Conversational)
```json
{
  "stability": 0.40,
  "clarity": 0.75,
  "style": 0.60,
  "use_speaker_boost": true
}
```
Expressive delivery for character dialogue. Allows natural variation in pitch and pacing. The lower stability permits emotional range while style amplifies character traits.

### Whisper / Intimate
```json
{
  "stability": 0.80,
  "clarity": 0.80,
  "style": 0.20,
  "use_speaker_boost": false
}
```
Soft, consistent delivery. High stability prevents the voice from breaking out of the whisper register. Speaker boost is disabled to maintain the subtle quality.

### Excited / High-Energy
```json
{
  "stability": 0.30,
  "clarity": 0.70,
  "style": 0.80,
  "use_speaker_boost": true
}
```
Dynamic, enthusiastic delivery. Low stability allows dramatic pitch variation. High style exaggerates the energy. Best for hype content, sports narration, or celebration moments.

### Corporate / Professional
```json
{
  "stability": 0.75,
  "clarity": 0.80,
  "style": 0.30,
  "use_speaker_boost": true
}
```
Steady, authoritative delivery. Suitable for brand videos, investor presentations, and training materials. Minimal style exaggeration keeps the tone professional.

### Meditation / Calm
```json
{
  "stability": 0.80,
  "clarity": 0.82,
  "style": 0.20,
  "use_speaker_boost": false
}
```
Soothing, even-paced delivery. Very high stability ensures no sudden tonal shifts. Low style and no speaker boost create a gentle, ambient quality.

### Storytelling / Dramatic
```json
{
  "stability": 0.45,
  "clarity": 0.75,
  "style": 0.65,
  "use_speaker_boost": true
}
```
Rich, engaging delivery with room for dramatic pauses and emphasis. Balances expressiveness with coherence.

### Tutorial / Friendly Explainer
```json
{
  "stability": 0.55,
  "clarity": 0.72,
  "style": 0.50,
  "use_speaker_boost": true
}
```
Approachable, clear delivery. Moderate settings across the board create a friendly but informative tone. Good for how-to content and educational material.

---

## Testing Strategy

Never commit to a full narration without testing first. Follow this validation workflow:

### Quick Preview Test (Recommended)

1. **Extract the first sentence** of the narration text.
2. **Generate a 3-second sample** using the target voice and settings.
3. **Listen critically** for:
   - Does the voice match the character/brand?
   - Is the pacing appropriate?
   - Are there any artifacts (clicks, buzzing, metallic tones)?
   - Does the emotional tone match the content?
4. **Adjust parameters** if needed and re-test.
5. **Generate the full narration** only after the preview passes.

### A/B Comparison Test (For New Voices)

When selecting a voice for a new character or project:

1. Pick 2–3 candidate voices from `voice-catalog.yaml`.
2. Write a representative sample text (2–3 sentences covering the typical content).
3. Generate samples with each voice using the same settings.
4. Compare side-by-side for fit, clarity, and emotional range.
5. Test the winning voice at different stability/style settings to find the sweet spot.
6. Document the final settings in the character's `identity.json`.

### Concatenation Test (For Multi-Clip Narration)

When narration will be split across multiple clips and merged:

1. Generate two adjacent clips with the chosen settings.
2. Concatenate them and listen for tonal discontinuity at the join point.
3. If there is a noticeable shift, increase stability by 0.05–0.10.
4. Re-test until joins sound seamless.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Voice sounds robotic or flat | Stability too high, style too low | Reduce stability by 0.10, increase style by 0.10 |
| Voice is inconsistent between clips | Stability too low | Increase stability by 0.10–0.15 |
| Metallic or buzzing artifacts | Clarity too high combined with low stability | Reduce clarity by 0.05–0.10 |
| Voice sounds nothing like the reference | Clarity too low | Increase clarity to 0.75+ |
| Output sounds over-processed | Speaker boost on content that does not need it | Disable use_speaker_boost |
| Unnatural emphasis on words | Style too high | Reduce style by 0.10–0.15 |
| Whisper breaks into normal speech | Stability too low for whisper content | Increase stability to 0.75+ |
| Pacing is too fast/slow | Not a parameter issue | Adjust the input text: add commas for pauses, use shorter/longer sentences |
