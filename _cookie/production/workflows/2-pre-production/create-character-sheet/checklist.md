# Create Character Sheet Checklist

## Required Checks
- [ ] Character description received with name, role, and appearance details
- [ ] Character identity schema loaded
- [ ] Default values loaded from character-defaults.yaml
- [ ] identity.json created with all required fields
- [ ] Character ID follows kebab-case convention
- [ ] prompt_tokens.core_identity defined (max 50 tokens, descriptive)
- [ ] prompt_tokens.negative_tokens defined
- [ ] prompt_tokens.consistency_anchors defined
- [ ] Voice config complete (if character has speaking role)
- [ ] At least one style with at least one outfit defined
- [ ] Active style and outfit set

## Quality Standards
- [ ] identity.json validates against character identity schema
- [ ] Core identity tokens are specific enough for consistent AI generation
- [ ] Negative tokens are comprehensive (prevent common misrenderings)
- [ ] Style modifiers are compatible with VEO and Nano Banana prompt formats
- [ ] Voice settings appropriate for character personality
- [ ] Physical description includes all distinguishing features
- [ ] Personality traits are specific and actionable

## Output Verification
- [ ] identity.json saved to characters/{char-id}/identity.json
- [ ] voice-config.json saved to characters/{char-id}/voice-config.json
- [ ] Style directories created at characters/{char-id}/styles/{style-id}/
- [ ] T7 validation passes without errors
- [ ] Character status set to "pending-references"
- [ ] No conflicts with existing character IDs
