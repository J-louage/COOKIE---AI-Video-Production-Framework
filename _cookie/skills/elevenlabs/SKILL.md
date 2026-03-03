# ElevenLabs Skill

## Purpose

Provides text-to-speech generation using the ElevenLabs API with customizable voice parameters. This skill handles voice selection, parameter tuning, API interaction, cost tracking, and output validation for all narration and dialogue audio in the Cookie pipeline.

---

## API Capabilities

ElevenLabs offers high-fidelity text-to-speech synthesis with fine-grained control over voice characteristics. The primary endpoint used is:

```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
```

For streaming (useful for long narrations):

```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream
```

---

## Voice Parameters

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `voice_id` | string | — | Unique identifier for the target voice. See `voice-catalog.yaml` or character `identity.json`. |
| `stability` | float | 0.0–1.0 | Controls vocal consistency. Lower values produce more expressive, variable output. Higher values produce steadier, more monotone delivery. |
| `clarity` / `similarity_boost` | float | 0.0–1.0 | Controls fidelity to the original voice sample. Higher values stay closer to the reference voice. |
| `style` | float | 0.0–1.0 | Controls style exaggeration. 0 = neutral delivery, 1 = maximum stylistic expression. Only available on v2 models. |
| `use_speaker_boost` | boolean | true/false | Enhances speaker characteristics for more dynamic, present output. Enable for punchy narration, disable for subtle or ambient speech. |

For detailed parameter tuning guidance, see `voice-config-guide.md`.

---

## Supported Output Formats

| Format | MIME Type | Use Case | Quality |
|--------|-----------|----------|---------|
| `mp3_44100_128` | audio/mpeg | Default. Good balance of quality and file size. Standard for web delivery. | High |
| `mp3_44100_192` | audio/mpeg | Higher bitrate MP3 for premium output. | Very High |
| `pcm_16000` | audio/wav | Raw PCM at 16kHz. Useful for further processing pipelines. | Lossless |
| `pcm_22050` | audio/wav | Raw PCM at 22.05kHz. Better frequency response than 16kHz. | Lossless |
| `pcm_24000` | audio/wav | Raw PCM at 24kHz. Recommended for post-processing workflows. | Lossless |
| `pcm_44100` | audio/wav | Raw PCM at 44.1kHz. CD quality. Large files. | Lossless |
| `ulaw_8000` | audio/basic | Telephony format. Rarely used in production. | Low |
| `mp3_22050_32` | audio/mpeg | Low-quality preview. Use only for draft validation. | Low |

**Default for Cookie pipeline:** `mp3_44100_128` for final output, `mp3_22050_32` for draft previews.

---

## Language Support

ElevenLabs supports 29+ languages with varying quality levels. English produces the highest fidelity output. See `language-support.md` for the full list with quality ratings, accent handling notes, and multilingual voice compatibility.

When generating non-English content:
1. Verify the selected voice supports the target language.
2. Consider using a multilingual model (`eleven_multilingual_v2`) rather than an English-only model.
3. Test with a short sample before committing to full narration.

---

## Character Voice Integration

Each character in the Cookie pipeline can have a dedicated ElevenLabs voice configuration stored in their `identity.json` file. The skill reads these settings to ensure consistent character voices across all scenes.

### Reading Voice Config from Character identity.json

The character's `identity.json` contains an `elevenlabs` block:

```json
{
  "name": "Marcus",
  "elevenlabs": {
    "voice_id": "pNInz6obpgDQGcFmaJgB",
    "model_id": "eleven_multilingual_v2",
    "stability": 0.65,
    "clarity": 0.78,
    "style": 0.45,
    "use_speaker_boost": true
  }
}
```

### Resolution Order

1. **Character identity.json** — If the character has ElevenLabs settings, use them.
2. **Scene override** — If the scene YAML specifies voice parameters (e.g., whispering), override stability/style.
3. **Voice catalog defaults** — Fall back to `voice-catalog.yaml` recommended settings for the voice_id.
4. **Global defaults** — stability: 0.5, clarity: 0.75, style: 0.0, use_speaker_boost: true.

---

## API Call Pattern

### Standard Request Construction

```python
import requests

def generate_speech(text, voice_config, output_path, output_format="mp3_44100_128"):
    """
    Generate speech audio from text using ElevenLabs API.

    Args:
        text: The text to synthesize.
        voice_config: Dict with voice_id, stability, clarity, style, use_speaker_boost.
        output_path: File path for the output audio.
        output_format: ElevenLabs output format string.

    Returns:
        Dict with output_path, duration_seconds, character_count, cost_usd.
    """
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_config['voice_id']}"

    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": os.environ["ELEVENLABS_API_KEY"]
    }

    body = {
        "text": text,
        "model_id": voice_config.get("model_id", "eleven_multilingual_v2"),
        "voice_settings": {
            "stability": voice_config.get("stability", 0.5),
            "similarity_boost": voice_config.get("clarity", 0.75),
            "style": voice_config.get("style", 0.0),
            "use_speaker_boost": voice_config.get("use_speaker_boost", True)
        },
        "output_format": output_format
    }

    response = requests.post(url, json=body, headers=headers)

    if response.status_code == 200:
        with open(output_path, "wb") as f:
            f.write(response.content)

        character_count = len(text)
        # Calculate cost and log it
        cost = calculate_cost(character_count)
        log_cost("elevenlabs", "text-to-speech", character_count, cost)

        return {
            "output_path": output_path,
            "character_count": character_count,
            "cost_usd": cost
        }
    else:
        handle_api_error(response)
```

### Streaming Request (for long narrations > 2500 characters)

```python
def generate_speech_streaming(text, voice_config, output_path):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_config['voice_id']}/stream"

    headers = {
        "Content-Type": "application/json",
        "xi-api-key": os.environ["ELEVENLABS_API_KEY"]
    }

    body = {
        "text": text,
        "model_id": voice_config.get("model_id", "eleven_multilingual_v2"),
        "voice_settings": {
            "stability": voice_config.get("stability", 0.5),
            "similarity_boost": voice_config.get("clarity", 0.75),
            "style": voice_config.get("style", 0.0),
            "use_speaker_boost": voice_config.get("use_speaker_boost", True)
        }
    }

    response = requests.post(url, json=body, headers=headers, stream=True)

    if response.status_code == 200:
        with open(output_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
```

---

## Cost Tracking

### Cost Calculation

ElevenLabs charges per character. The rate depends on the subscription tier and is stored in `_cost/pricing.yaml`:

```yaml
elevenlabs:
  unit: "character"
  tiers:
    starter: 0.00030      # $0.30 per 1,000 characters
    creator: 0.00024       # $0.24 per 1,000 characters
    pro: 0.00018           # $0.18 per 1,000 characters
    scale: 0.00013         # $0.13 per 1,000 characters
    business: 0.00011      # $0.11 per 1,000 characters
```

### Cost Logging

After every successful API call, log the cost to `_cost/actuals/`:

```python
def calculate_cost(character_count):
    """Calculate cost based on character count and pricing tier."""
    pricing = load_yaml("_cost/pricing.yaml")
    tier = pricing["elevenlabs"]["current_tier"]
    rate = pricing["elevenlabs"]["tiers"][tier]
    return character_count * rate

def log_cost(service, operation, units, cost_usd):
    """Append cost entry to the actuals log."""
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "service": service,
        "operation": operation,
        "units": units,
        "unit_type": "characters",
        "cost_usd": round(cost_usd, 6),
        "project": current_project_id(),
        "scene": current_scene_id()
    }
    append_to_log("_cost/actuals/elevenlabs.jsonl", entry)
```

---

## Error Handling

| HTTP Status | Cause | Recovery Strategy |
|-------------|-------|-------------------|
| **400** | Malformed request, invalid parameters | Validate voice_settings ranges before sending. Check text is non-empty and under 5000 characters. |
| **401** | Invalid or missing API key | Verify `ELEVENLABS_API_KEY` environment variable. Check key has not expired. |
| **404** | Invalid `voice_id` | Validate voice_id against `voice-catalog.yaml` or the user's custom voices. Run `GET /v1/voices` to list available voices. |
| **422** | Unprocessable entity (e.g., unsupported language for voice) | Check voice-language compatibility. Switch to multilingual model if needed. |
| **429** | Rate limit exceeded | Implement exponential backoff: wait 1s, 2s, 4s, 8s, max 60s. Log the retry. Check concurrent request count. |
| **500** | ElevenLabs server error | Retry up to 3 times with 5s delay. If persistent, log error and skip scene narration for manual retry. |
| **503** | Service temporarily unavailable | Wait 30s and retry. If the service is down for extended periods, queue the request for later. |

### Quota Exhaustion

When the monthly character quota is exhausted (indicated by 429 with a specific error message about quota), the skill must:

1. Log the remaining text that needs synthesis.
2. Alert the user with the character count remaining and estimated cost to upgrade.
3. Queue the remaining work for when the quota resets or is upgraded.
4. Never silently fail — always surface quota issues.

---

## File Naming Convention

All generated audio files follow this naming pattern:

```
{project_root}/_output/{episode_id}/{scene_id}/narration.mp3
{project_root}/_output/{episode_id}/{scene_id}/dialogue-{character_name}.mp3
{project_root}/_output/{episode_id}/{scene_id}/narration-draft.mp3    # Preview quality
```

Examples:
- `_output/ep01/scene-03/narration.mp3`
- `_output/ep01/scene-03/dialogue-marcus.mp3`
- `_output/ep01/scene-03/narration-draft.mp3`

---

## Quality Checks

After generating audio, validate the output:

1. **File existence and size** — Output file must exist and be > 1KB (silence/errors produce tiny files).
2. **Duration validation** — Estimate expected duration from character count (roughly 150 words/min for narration, 180 words/min for dialogue). Flag if actual duration deviates by more than 30%.
3. **Audio artifact detection** — Check for:
   - Leading/trailing silence > 0.5s (trim if found).
   - Clipping (samples hitting max amplitude).
   - Unusual silence gaps mid-narration (may indicate API truncation).
4. **Format verification** — Confirm output matches requested format (sample rate, codec).
5. **Playback test** — For critical narration, generate a 3-second preview first using the first sentence.

```bash
# Duration check with ffprobe
ffprobe -v error -show_entries format=duration -of csv=p=0 narration.mp3

# Sample rate check
ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of csv=p=0 narration.mp3
```

---

## Related Files

- `voice-config-guide.md` — Detailed parameter tuning guidance
- `voice-catalog.yaml` — Pre-cataloged voices with recommended settings
- `language-support.md` — Supported languages and quality notes
- `_cost/pricing.yaml` — Per-character pricing by tier
- Character `identity.json` — Per-character voice configuration
