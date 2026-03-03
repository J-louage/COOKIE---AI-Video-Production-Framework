# Prompt Engineering — Cross-Tool Principles

## Purpose

This document defines the universal prompt engineering principles used across all visual generation tools in the Cookie pipeline (VEO, Nano Banana, and any future models). Consistent prompt construction is the foundation of visual coherence across scenes, episodes, and character appearances.

---

## Token Ordering

Prompt tokens should follow a consistent priority order. Models weight earlier tokens more heavily, so place the most critical elements first.

### Standard Order

```
1. Character identity  → Who is in the frame
2. Outfit/appearance   → What they are wearing/look like
3. Action/pose         → What they are doing
4. Camera angle/shot   → How we see it
5. Environment/setting → Where it is happening
6. Style/aesthetic     → The visual treatment
7. Lighting           → Light quality and direction
8. Negative prompt    → What to exclude
```

### Example — Full Prompt

```
[character:Marcus] [outfit:casual-blue-jacket]
walking confidently through a crowded city street, hands in pockets
medium shot, eye level, slight dolly forward
bustling downtown district, modern glass buildings, autumn trees, golden hour
cinematic, shallow depth of field, film grain, warm color palette
soft golden backlight, ambient city glow, gentle rim lighting
--neg blurry, low quality, distorted face, extra limbs, watermark, text
```

### Why This Order Matters

| Position | Token Type | Rationale |
|----------|-----------|-----------|
| First | Character | Identity consistency is the highest priority. The model must establish who is in the frame before anything else. |
| Second | Outfit | Appearance is tightly coupled with identity. Together they define the "look" that must be consistent. |
| Third | Action | What the character does determines body position, which affects everything downstream. |
| Fourth | Camera | Shot framing determines what is visible, which influences how much detail the model gives to environment and lighting. |
| Fifth | Environment | Setting establishes spatial context. Less critical than character/action for consistency. |
| Sixth | Style | Aesthetic treatment can be more flexible per-shot without breaking continuity. |
| Seventh | Lighting | Lighting is the most variable element — it naturally shifts within a scene. |
| Last | Negative | Exclusions are processed separately by most models. Always include them, always at the end. |

---

## Character Consistency

Maintaining character identity across generations is the most important challenge in AI video production. Follow these rules without exception.

### Rule 1: Identical Core Identity Tokens

Every prompt featuring a given character must include the exact same identity tokens. Never paraphrase, shorten, or rephrase them.

**Correct:**
```
Prompt A: "[character:Marcus] tall man, short dark brown hair, green eyes, angular jaw, light stubble"
Prompt B: "[character:Marcus] tall man, short dark brown hair, green eyes, angular jaw, light stubble"
```

**Incorrect:**
```
Prompt A: "[character:Marcus] tall man, short dark brown hair, green eyes, angular jaw, light stubble"
Prompt B: "[character:Marcus] dark-haired man with green eyes"  ← WRONG: paraphrased, lost details
```

### Rule 2: Same Negative Prompts

Character-specific negative prompts must also be consistent:

```
Every Marcus prompt must include:
--neg blonde hair, blue eyes, round face, beard, female
```

These negatives prevent the model from drifting away from the character's established look.

### Rule 3: Outfit Tokens Are Separate from Identity

The character's clothing changes between scenes, but their physical identity does not. Keep them in separate token blocks:

```
# Scene 1 — office
[character:Marcus] [outfit:navy-suit-white-shirt]

# Scene 2 — casual
[character:Marcus] [outfit:casual-blue-jacket]

# Same identity tokens, different outfit tokens
```

### Rule 4: Reference Images When Available

When a reference image is available (from previous generation or character sheet), always provide it alongside the text prompt. Reference images anchor the model's interpretation more strongly than text alone.

---

## Style Consistency

### Project-Wide Style Tokens

Every project defines a `style-guide.yaml` that contains global style tokens. These tokens are injected into every generation prompt to ensure visual coherence across the entire project.

```yaml
# style-guide.yaml
style_tokens:
  base: "cinematic, 35mm film, shallow depth of field"
  color: "warm color palette, teal shadows, amber highlights"
  texture: "subtle film grain, organic texture"
  mood: "contemplative, atmospheric"
```

**Injection pattern:**
```
{character tokens} {action tokens} {camera tokens} {environment tokens}
{style_guide.base}, {style_guide.color}, {style_guide.texture}
{scene-specific lighting}
--neg {standard negatives}
```

### When to Override Style Tokens

Style tokens can be overridden at the scene level for intentional artistic shifts (flashbacks, dream sequences, mood changes), but this should be:
1. Explicitly documented in the scene YAML.
2. Approved by the Director role.
3. Applied consistently within the scene (not per-clip).

---

## Negative Prompt Best Practices

### Always Include Quality Negatives

Every prompt must include baseline quality exclusions:

```
--neg blurry, low quality, low resolution, pixelated, jpeg artifacts,
     distorted, deformed, disfigured, malformed, mutated,
     watermark, text, logo, signature, banner,
     oversaturated, underexposed, overexposed
```

### Be Specific About What to Exclude

Generic negatives are less effective than specific ones. Tailor negatives to the content:

```
# For character shots — prevent body distortion
--neg extra fingers, extra limbs, missing fingers, fused fingers,
     extra arms, extra legs, missing limbs, floating limbs,
     disconnected body parts, anatomically incorrect

# For face close-ups — prevent facial distortion
--neg cross-eyed, asymmetrical eyes, distorted features,
     uncanny valley, plastic skin, wax figure

# For environments — prevent visual noise
--neg cluttered, messy, chaotic composition, distracting background elements,
     random objects, floating objects, impossible architecture

# For text/UI scenes — prevent text generation
--neg misspelled text, garbled text, random letters, illegible text
```

### Negative Prompt Anti-Patterns

| Anti-Pattern | Why It Fails | Better Alternative |
|-------------|-------------|-------------------|
| `--neg bad` | Too vague, model cannot interpret | `--neg low quality, blurry, distorted` |
| `--neg ugly` | Subjective, inconsistent results | `--neg disfigured, malformed, disproportionate` |
| Very long negative lists (50+ items) | Diminishing returns, can conflict | Keep to 15–25 targeted negatives |
| Negating what you want | "no blue sky" may still produce blue | Use positive framing: "overcast gray sky" in prompt instead |

---

## Prompt Length Optimization

### Model-Specific Limits

| Model | Token Limit | Sweet Spot | Notes |
|-------|------------|-----------|-------|
| VEO | 1024 tokens | 80–150 tokens | Motion-focused. Shorter prompts give clearer motion direction. |
| Nano Banana | ~1024 tokens | 80–150 tokens | Detail-focused. Can handle more descriptive prompts. |

### Length Guidelines

1. **Under 50 tokens:** Too sparse. Model may hallucinate missing details. Add more context.
2. **50–80 tokens:** Minimal but functional. Good for simple compositions.
3. **80–150 tokens:** Optimal range. Enough detail for consistency without overwhelming the model.
4. **150–250 tokens:** Acceptable for complex scenes. May start losing focus on later tokens.
5. **Over 250 tokens:** Diminishing returns. The model may ignore or misinterpret later tokens. Split into multiple generations or simplify.

### Token Counting

Approximate token count: ~1 token per word for English, ~1.5 tokens per word for technical terms or compound descriptions. When in doubt, count words and multiply by 1.2.

---

## Multi-Model Adaptation

The same creative concept must be expressed differently depending on which model is generating the output.

### VEO — Motion-Focused Prompts

VEO generates video, so prompts should emphasize movement, transitions, and temporal progression:

```
Marcus walks confidently toward the camera, coat billowing slightly in the breeze,
passing pedestrians in soft focus, camera tracks backward maintaining framing,
city street, golden hour, cinematic motion blur
```

**VEO prompt priorities:**
1. Motion verbs (walks, turns, reaches, lifts)
2. Camera movement (tracks, pans, dollies, zooms)
3. Temporal cues (slowly, suddenly, gradually)
4. Spatial transitions (toward camera, away from, left to right)

### Nano Banana — Detail-Focused Prompts

Nano Banana generates still images, so prompts should emphasize composition, detail, and visual fidelity:

```
Marcus standing in a city street, hands in coat pockets, slight confident smile,
short dark brown hair catching golden light, green eyes reflecting city glow,
medium shot, sharp focus on face, bokeh background with blurred pedestrians,
warm amber tones, cinematic lighting, 35mm film aesthetic
```

**Nano Banana prompt priorities:**
1. Physical detail (facial features, clothing texture, material quality)
2. Composition (framing, focal point, depth of field)
3. Lighting detail (direction, quality, color temperature)
4. Texture and material description (fabric, skin, surfaces)

---

## Token Expansion

The Cookie pipeline uses bracket notation to reference reusable token sets that are expanded before being sent to the model.

### Character Token Expansion

```
# Input
[character:Marcus]

# Expands to (from characters/marcus/identity.json)
tall man, short dark brown hair, green eyes, angular jaw, light stubble,
medium build, 30s, Caucasian
```

### Outfit Token Expansion

```
# Input
[outfit:casual-blue-jacket]

# Expands to (from characters/marcus/outfits.yaml)
wearing a fitted navy blue denim jacket over a white crew-neck t-shirt,
dark gray slim jeans, white leather sneakers
```

### Environment Token Expansion

```
# Input
[environment:city-park-afternoon]

# Expands to (from environments/city-park.yaml)
urban city park with mature oak trees, paved walking paths,
wooden benches, manicured grass, distant city skyline,
afternoon sunlight filtering through leaves
```

### Style Token Expansion

```
# Input
[style:cinematic-warm]

# Expands to (from style-guide.yaml)
cinematic, 35mm film, shallow depth of field,
warm color palette, teal shadows, amber highlights,
subtle film grain, organic texture
```

### Expansion Rules

1. Tokens are expanded in-place, preserving their position in the prompt.
2. Expanded text inherits the weight of its position (earlier = higher priority).
3. Never nest bracket tokens: `[character:[alias:Marcus]]` is not valid.
4. Unknown token references produce an error — fail loudly, do not silently skip.
5. Token definitions are project-scoped. Each project has its own character, outfit, and environment definitions.

---

## Prompt Templates

### Standard Scene Prompt Template

```
[character:{character_name}] [outfit:{outfit_id}]
{action_description}
{camera_angle}, {camera_movement}
{environment_description}
[style:{style_id}]
{lighting_description}
--neg {character_negatives}, {quality_negatives}
```

### VEO Motion Clip Template

```
[character:{character_name}] [outfit:{outfit_id}]
{motion_verb} {motion_direction} {motion_quality}
{camera_movement_verb} {camera_movement_description}
{environment_brief}
[style:{style_id}], smooth motion, natural movement
--neg jerky motion, frozen, static, {character_negatives}, {quality_negatives}
```

### Nano Banana Reference Image Template

```
[character:{character_name}] [outfit:{outfit_id}]
{pose_description}, {angle} view
white background, studio lighting, character reference sheet style
full body visible, sharp focus, high detail, clean edges
--neg complex background, multiple characters, {character_negatives}, {quality_negatives}
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Changing character description wording between clips | Character appearance shifts | Copy-paste exact identity tokens every time |
| Putting style tokens before character tokens | Model prioritizes style over identity | Follow the standard token order |
| Omitting negative prompts | Artifacts, watermarks, distortions appear | Always include quality and character-specific negatives |
| Using contradictory terms | Model produces confused output | Review for conflicts (e.g., "bright dark moody" is contradictory) |
| Over-describing motion in Nano Banana | Blurry or motion-smeared static image | Remove motion verbs for still image prompts |
| Under-describing motion in VEO | Static, lifeless video output | Add explicit motion verbs and camera movements |
| Not expanding tokens before review | Cannot verify what the model actually receives | Always review the fully expanded prompt before generation |
