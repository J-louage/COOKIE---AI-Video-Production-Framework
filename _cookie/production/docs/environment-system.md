# Environment Preset System

The environment preset system provides reusable, consistent location settings for video production. Environments are shared assets available across all episodes, ensuring visual continuity when the same location appears in different videos.

## Directory Structure

```
characters/environments/{environment-name}/
  environment-config.json    # Environment definition and prompt tokens
  reference-wide.png         # Wide reference image (16:9, 2K resolution)
  reference-detail.png       # Detail reference image (1:1, 2K resolution)
```

Each environment lives in its own directory under `characters/environments/`. The directory name serves as the environment identifier and must use lowercase kebab-case (e.g., `hotel-lobby`, `rooftop-terrace`, `server-room`).

## Environment Config Schema

The `environment-config.json` file defines all properties of an environment:

```json
{
  "environment_id": "hotel-lobby",
  "name": "Modern Luxury Hotel Lobby",
  "description": "A spacious hotel lobby with marble floors, ambient lighting, modern furniture, and floor-to-ceiling windows overlooking a city skyline. Designed for upscale hospitality brand content.",
  "prompt_tokens": {
    "core": "modern luxury hotel lobby, marble floors, ambient recessed lighting, contemporary designer furniture, floor-to-ceiling glass windows, city skyline visible through windows, high ceilings with architectural details, warm neutral color palette, polished surfaces",
    "time_of_day": {
      "morning": "soft morning light streaming through windows, golden hour glow on marble floors, fresh and quiet atmosphere",
      "afternoon": "bright natural daylight flooding the space, sharp shadows from window frames, bustling midday energy",
      "evening": "warm amber interior lighting, city lights beginning to glow outside windows, sophisticated twilight atmosphere",
      "night": "dramatic interior lighting, city skyline illuminated outside, intimate and luxurious nighttime mood, reflections on polished floors"
    },
    "weather": {
      "clear": "clear sky visible through windows, crisp natural light, sharp shadows",
      "overcast": "diffused soft light through windows, muted shadows, even illumination throughout lobby",
      "rain": "rain droplets on window glass, diffused grey light, reflections of interior lights on wet surfaces outside"
    },
    "negative": "cheap furniture, fluorescent lighting, cluttered space, dated decor, low ceilings, small windows, dirty floors, poor maintenance"
  },
  "reference_images": {
    "wide": "characters/environments/hotel-lobby/reference-wide.png",
    "detail": "characters/environments/hotel-lobby/reference-detail.png"
  },
  "compatible_styles": ["cinematic-warm", "tech-clean"]
}
```

### Schema Field Reference

| Field | Type | Description |
|---|---|---|
| `environment_id` | string | Unique identifier matching the directory name (kebab-case) |
| `name` | string | Human-readable display name |
| `description` | string | Detailed description of the environment for context |
| `prompt_tokens.core` | string | Base visual description always included in prompts |
| `prompt_tokens.time_of_day` | object | Time-specific lighting and atmosphere tokens |
| `prompt_tokens.weather` | object | Weather-specific lighting and atmosphere tokens |
| `prompt_tokens.negative` | string | Negative prompt tokens to avoid unwanted elements |
| `reference_images.wide` | string | Path to wide reference image (relative to project root) |
| `reference_images.detail` | string | Path to detail reference image (relative to project root) |
| `compatible_styles` | array | List of cinematic style identifiers this environment works well with |

## Environment Generation Workflow

When a new environment is needed for a production:

### 1. Identify Need from Script

During script analysis or SSD generation, identify locations that do not yet have an environment preset. Flag any scene that references a new location.

### 2. Generate environment-config.json

Based on the script's location description, create the environment configuration:
- Write a detailed `description` capturing the intended look and feel
- Craft `core` prompt tokens that describe the environment's essential visual elements
- Define `time_of_day` variants for morning, afternoon, evening, and night
- Define `weather` variants for clear, overcast, and rain conditions
- Write `negative` tokens to prevent unwanted visual elements
- Identify `compatible_styles` from the cinematic-styles.csv reference

### 3. Generate Reference Images via Nano Banana

Generate two reference images using the Nano Banana image generation service:

**Wide reference** (`reference-wide.png`):
- Aspect ratio: 16:9
- Resolution: 2K (2560x1440 or equivalent)
- Prompt: Use the `core` tokens combined with a default `time_of_day` (afternoon) and `weather` (clear)
- Purpose: Establishes the overall spatial layout and atmosphere

**Detail reference** (`reference-detail.png`):
- Aspect ratio: 1:1
- Resolution: 2K (2048x2048)
- Prompt: Use the `core` tokens with emphasis on textures, materials, and close-up details
- Purpose: Captures surface quality, material textures, and fine visual details for consistency

### 4. Save to characters/environments/{name}/

Create the environment directory and save all three files:
```
characters/environments/{environment-id}/
  environment-config.json
  reference-wide.png
  reference-detail.png
```

### 5. Environment Becomes a Shared Asset

Once saved, the environment is available for all episodes. Any scene in any episode can reference this environment by its `environment_id`. The environment persists across the entire project and should be reused whenever the same location appears.

## Token Injection

Environments are referenced in scene specifications using the `[environment:X]` token syntax. When a scene spec contains an environment reference, the system loads the config and injects the appropriate tokens.

### Resolution Process

```
[environment:hotel-lobby] → Load characters/environments/hotel-lobby/environment-config.json
                          → Read scene's time_of_day setting (e.g., "evening")
                          → Read scene's weather setting (e.g., "clear")
                          → Inject: core + time_of_day.evening + weather.clear
                          → Append negative tokens to negative prompt
```

### Example Token Expansion

Scene spec contains:
```
environment: [environment:hotel-lobby]
time_of_day: evening
weather: rain
```

Expands to:
```
modern luxury hotel lobby, marble floors, ambient recessed lighting, contemporary
designer furniture, floor-to-ceiling glass windows, city skyline visible through
windows, high ceilings with architectural details, warm neutral color palette,
polished surfaces, warm amber interior lighting, city lights beginning to glow
outside windows, sophisticated twilight atmosphere, rain droplets on window glass,
diffused grey light, reflections of interior lights on wet surfaces outside
```

Negative prompt receives:
```
cheap furniture, fluorescent lighting, cluttered space, dated decor, low ceilings,
small windows, dirty floors, poor maintenance
```

## SSD Integration

Environments integrate into the Scene Specification Document (SSD) through the environment block within each scene entry:

```yaml
scenes:
  - scene_id: "s04"
    scene_type: "dialogue"
    duration: 6
    environment:
      preset: "hotel-lobby"
      time_of_day: "evening"
      weather: "rain"
      overrides:
        additional_tokens: "crowded with guests, luggage visible near entrance"
        exclude_tokens: "quiet atmosphere"
    visual_direction:
      camera: "medium shot, slight dolly forward"
      framing: "two characters at reception desk, lobby visible behind"
      style: "[style:cinematic-warm]"
    characters:
      - character_id: "alex"
        action: "speaking to receptionist"
        expression: "concerned"
    audio:
      music: "ambient hotel jazz, soft"
      sfx: "rain on windows, distant thunder, luggage wheels"
```

### Environment Block Fields

| Field | Required | Description |
|---|---|---|
| `preset` | yes | The `environment_id` to load |
| `time_of_day` | yes | One of: morning, afternoon, evening, night |
| `weather` | no | One of: clear, overcast, rain. Defaults to clear |
| `overrides.additional_tokens` | no | Extra tokens appended to the environment prompt |
| `overrides.exclude_tokens` | no | Tokens to remove from the environment prompt for this scene |

### Reference Image Usage

When generating video clips for a scene with an environment preset, the reference images can be used as visual guidance:

- **Wide reference**: Use as image-to-video input when establishing a new scene in this environment, or as a style reference for VEO generation
- **Detail reference**: Use for consistency checking of textures and materials in generated output

## Compatible Styles Reference

The `compatible_styles` array in the environment config references entries from the project's cinematic styles catalog. See `_cookie/production/config/cinematic-styles.csv` for the full list of available style identifiers.

When generating video for a scene, combine the environment tokens with the style tokens for the most consistent output. Only use styles listed in `compatible_styles` to avoid visual conflicts (e.g., a "neon-cyberpunk" style would conflict with a "rustic-farmhouse" environment).

## Best Practices

1. **Reuse over recreation**: Always check existing environments before creating a new one. Reusing environments ensures visual consistency across episodes.
2. **Descriptive core tokens**: The `core` prompt tokens should be detailed enough to reproduce the environment consistently without the reference images.
3. **Time and weather coverage**: Always define all four time_of_day variants and all three weather variants, even if some are unlikely to be used. This enables flexibility in future episodes.
4. **Reference image quality**: Generate reference images at 2K resolution minimum. These serve as the ground truth for the environment's visual identity.
5. **Style compatibility**: Test environment tokens with each listed compatible style before finalizing to ensure they produce coherent results.
6. **Negative tokens matter**: Well-crafted negative tokens are as important as positive tokens for preventing drift from the intended look.
