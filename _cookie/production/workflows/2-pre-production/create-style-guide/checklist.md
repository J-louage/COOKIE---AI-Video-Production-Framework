# Create Style Guide Checklist

## Required Checks
- [ ] Canonical script loaded and analyzed for mood and visual requirements
- [ ] Brand guidelines loaded and constraints extracted
- [ ] Color palette defined with hex values (primary, secondary, accent)
- [ ] Color usage mapping specified (backgrounds, characters, UI, highlights)
- [ ] Typography rules defined for all on-screen text types
- [ ] Cinematic style defined (aesthetic, camera language, compositions)
- [ ] Lighting preferences defined (style, temperature, shadow intensity)
- [ ] VEO style tokens created (master prefix, per-scene-type tokens)
- [ ] Nano Banana style tokens created
- [ ] Negative prompts defined (global, character, style, quality categories)

## Quality Standards
- [ ] Style tokens are specific and actionable for AI generation
- [ ] All token combinations stay within 1024 token prompt limit
- [ ] Master style prefix is under 200 characters
- [ ] Negative prompts cover common AI artifacts (extra limbs, watermarks, blur)
- [ ] Color palette aligns with brand guidelines
- [ ] Cinematic style is consistent across all scene types
- [ ] Lighting keywords are AI-generation compatible
- [ ] Typography rules include minimum sizes per resolution

## Output Verification
- [ ] style-guide.yaml saved to episodes/{episode_id}/style/
- [ ] All sections present: color_palette, typography, cinematic_style, lighting, style_tokens, negative_prompts
- [ ] Reference link created from SSD to style guide
- [ ] Version and creation timestamp recorded in metadata
- [ ] No empty or placeholder fields remain
