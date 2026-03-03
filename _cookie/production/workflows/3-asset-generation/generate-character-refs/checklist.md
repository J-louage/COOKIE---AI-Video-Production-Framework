# Generate Character Refs Checklist

## Required Checks
- [ ] SSD loaded and all referenced characters identified
- [ ] Character identity files loaded with prompt tokens
- [ ] Style guide loaded for color palette and style consistency
- [ ] Front view reference generated for every character
- [ ] Side view reference generated for every character
- [ ] Back view reference generated for every character
- [ ] Three-quarter view reference generated for every character
- [ ] Outfit variant images generated for characters with multiple outfits
- [ ] Composite reference sheet created for every character per style

## Quality Standards
- [ ] Facial features consistent across all angles for each character
- [ ] Clothing consistent across all angles
- [ ] Color palette matches style guide
- [ ] Proportions correct and consistent
- [ ] No AI artifacts (extra limbs, distorted features, inconsistencies)
- [ ] Resolution matches project reference image standard
- [ ] Images that failed consistency check flagged for regeneration
- [ ] Regenerated images pass consistency check

## Output Verification
- [ ] Reference images saved to characters/{char-id}/styles/{style}/reference-{angle}.png
- [ ] Outfit images saved to characters/{char-id}/styles/{style}/outfits/{outfit-id}/
- [ ] Composite sheets saved to characters/{char-id}/styles/{style}/composite-sheet.png
- [ ] Character status updated to "references-complete"
- [ ] Dependency graph updated to mark character-refs complete
- [ ] Total generation cost logged
- [ ] Cost within budget allocation for character references
