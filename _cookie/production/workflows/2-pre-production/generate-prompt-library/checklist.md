# Generate Prompt Library Checklist

## Required Checks
- [ ] SSD loaded with all scene and clip prompts
- [ ] All character identity files loaded with prompt tokens
- [ ] Style guide loaded with style tokens and negative prompts
- [ ] All [character:X] placeholders expanded to full core_identity tokens
- [ ] All [outfit:Y] placeholders expanded to outfit-specific tokens
- [ ] Character tokens front-loaded in every prompt
- [ ] Style tokens prepended (master prefix + scene-type tokens)
- [ ] Negative prompts appended (global + character + style + quality)
- [ ] Negative tokens deduplicated and ordered by importance

## Quality Standards
- [ ] Every prompt is under 1024 tokens (positive + negative combined)
- [ ] Token ordering follows: character identity > scene description > style modifiers
- [ ] Only one camera movement per clip prompt
- [ ] No contradictory directions within a single prompt
- [ ] Same character has consistent token patterns across all scenes
- [ ] Style tokens are consistent across all scenes
- [ ] No contradictory directions between adjacent scenes
- [ ] Prompts that exceeded limits were resolved (condensed or flagged)

## Output Verification
- [ ] Prompt library saved to episodes/{episode_id}/prompts/prompt-library.yaml
- [ ] Each entry includes: scene_id, clip_id, positive prompt, negative prompt, token count
- [ ] Prompt hashes generated for cache/dedup purposes
- [ ] SSD updated with prompt library references
- [ ] Cross-reference consistency report generated
- [ ] All flagged inconsistencies documented
