# Character Token Expansion

> Reusable pattern for expanding `[character:X]`, `[outfit:Y]`, and `[environment:Z]` placeholders into full prompt tokens before sending to VEO or Nano Banana.

## Overview

The SSD (Scene Specification Document) uses placeholder syntax for character references. Before any prompt is sent to a generation API, these placeholders must be fully expanded into concrete prompt tokens.

This expansion is owned by the **Prompt Engineer (Zara)** and executed in the `generate-prompt-library` workflow.

## Placeholder Syntax

| Placeholder | Source | Tokens Injected |
|-------------|--------|-----------------|
| `[character:X]` | `characters/X/identity.json` | `prompt_tokens.core_identity` + model-specific tokens |
| `[outfit:Y]` | `characters/X/styles/{active_style}/outfits/Y/outfit-config.json` | Outfit description tokens |
| `[environment:Z]` | `characters/environments/Z/environment-config.json` | Environment description tokens |

## Expansion Logic

### Step 1: Resolve `[character:X]`

```
Input:  [character:marcus]

1. Load: characters/marcus/identity.json
2. Extract: prompt_tokens.core_identity
3. Extract: prompt_tokens.veo_specific (for VEO) or prompt_tokens.nano_banana_specific (for Nano Banana)
4. Extract: prompt_tokens.negative (for negative prompt section)

Output: "tall distinguished man in his early 50s, short silver-gray hair neatly
        side-parted, dark brown warm eyes, silver-rimmed rectangular glasses,
        medium olive skin, confident warm smile, athletic build"
```

### Step 2: Resolve `[outfit:Y]`

```
Input:  [outfit:business-suit]

1. Get active_style from character identity.json (e.g., "realistic")
2. Load: characters/marcus/styles/realistic/outfits/business-suit/outfit-config.json
3. Extract: outfit prompt tokens

Output: "wearing a tailored navy blue suit, crisp white shirt, burgundy silk tie,
        polished black oxford shoes"
```

### Step 3: Resolve `[environment:Z]`

```
Input:  [environment:hotel-lobby]

1. Load: characters/environments/hotel-lobby/environment-config.json
2. Extract: environment description tokens

Output: "modern luxury hotel lobby, floor-to-ceiling windows, warm ambient lighting,
        marble floors, contemporary furniture"
```

## Full Expansion Example

### Input (from SSD)
```
[character:marcus] [outfit:business-suit] enters through a revolving door,
medium shot, slow tracking, warm morning light
```

### Expanded Output (for VEO)
```
tall distinguished man in his early 50s, short silver-gray hair neatly
side-parted, dark brown warm eyes, silver-rimmed rectangular glasses, medium
olive skin, confident warm smile, athletic build, wearing a tailored navy blue
suit, crisp white shirt, burgundy silk tie, polished black oxford shoes, the
man moves with measured confidence, enters through a revolving door, medium
shot, slow tracking, warm morning light
```

### Token Ordering

The expanded prompt follows this strict order:

1. **Character identity tokens** (from `core_identity`)
2. **Outfit tokens** (from outfit-config.json)
3. **Model-specific behavior** (from `veo_specific` or `nano_banana_specific`)
4. **Environment tokens** (setting, location, lighting from `[environment:Z]`)
5. **Scene direction** (from SSD — the original prompt text minus placeholders)
6. **Audio cues** (ambient sound descriptions, if applicable)
7. **Style tokens** (from project style-guide.yaml)
8. **Negative prompt** (separate field — from character + project negatives)

This ordering ensures the most important visual identity information is processed first by the model.

## Model-Specific Adaptation

### For VEO Prompts
- Include `prompt_tokens.veo_specific` (motion/behavior tokens)
- Include `prompt_tokens.core_identity`
- Combine with scene direction (camera, action, lighting)
- Total must be under 1024 tokens

### For Nano Banana Prompts
- Include `prompt_tokens.nano_banana_specific` (image quality tokens)
- Include `prompt_tokens.core_identity`
- Combine with composition direction (angle, framing, background)
- Use preset-appropriate suffix from config-presets.yaml

## Validation Rules

1. **All placeholders must resolve** — if `[character:X]` references a non-existent character, halt with error
2. **Prompt length check** — expanded prompt must be ≤ 1024 tokens for VEO
3. **Character tokens first** — identity tokens must appear before scene direction
4. **Consistent tokens** — same character must use identical core_identity tokens across all scenes
5. **One camera movement** — validate no conflicting camera movements after expansion
6. **Negative prompt present** — every expanded prompt must have a corresponding negative prompt

## Reference Image Selection (VEO 3.1)

When using VEO 3.1's reference image feature, select up to 3 images in this priority order:

1. **Character front view**: `characters/{char-id}/styles/{style}/reference-front.png`
2. **Outfit full body**: `characters/{char-id}/styles/{style}/outfits/{outfit}/full-body.png`
3. **Environment wide shot**: `characters/environments/{env}/reference-wide.png`

Reference images configuration:
```yaml
reference_images:
  - image: "characters/marcus/styles/realistic/reference-front.png"
    reference_type: "asset"
  - image: "characters/marcus/styles/realistic/outfits/business-suit/full-body.png"
    reference_type: "asset"
  - image: "characters/environments/hotel-lobby/reference-wide.png"
    reference_type: "asset"
```

Requirements:
- Maximum 3 images per VEO call
- Only supported by VEO 3.1 models (`reference_images: true` in model-constraints.yaml)
- `reference_type` must always be `"asset"`
- VEO 2.0 does NOT support reference images

## Implementation Checklist

- [ ] All `[character:X]` placeholders resolve to valid identity.json files
- [ ] All `[outfit:Y]` placeholders resolve to valid outfit-config.json files
- [ ] All `[environment:Z]` placeholders resolve to valid environment-config.json files
- [ ] Expanded prompts maintain correct token ordering
- [ ] No expanded prompt exceeds 1024 tokens
- [ ] Negative prompts assembled from character + project sources
- [ ] Reference images selected in priority order (max 3)
- [ ] Same character uses identical tokens across all scenes
