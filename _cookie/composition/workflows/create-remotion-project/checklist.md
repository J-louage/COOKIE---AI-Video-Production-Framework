# Create Remotion Project Checklist

## Template Selection
- [ ] Episode format read from SSD or episode configuration
- [ ] Format mapped to correct template (standard, short-form, square, custom)
- [ ] Fallback to standard template if no exact match
- [ ] Template selection logged with reasoning

## Project Scaffolding
- [ ] Project scaffolded into episodes/{episode_id}/remotion/
- [ ] Template structure copied: src/, package.json, tsconfig.json
- [ ] Root component and template-specific components included
- [ ] Remotion conventions followed in directory structure
- [ ] No existing files overwritten

## Configuration
- [ ] remotion.config.ts created and configured
- [ ] Composition width and height set from SSD target resolution
- [ ] FPS set to match project specification (typically 30)
- [ ] Default codec and encoding settings configured
- [ ] Webpack override set up if needed for custom asset loading
- [ ] Output location configured for renders

## Asset References
- [ ] public/ directory or staticFile paths configured
- [ ] Paths point to episode asset directories (video, audio, images)
- [ ] Type-safe asset path helpers created (TypeScript)
- [ ] Asset paths resolve correctly from within the project
- [ ] Asset directory mapping documented

## Dependencies
- [ ] npm install completed successfully
- [ ] Remotion core packages installed (@remotion/cli, @remotion/player, remotion)
- [ ] Additional template packages installed (e.g., @remotion/media-utils)
- [ ] No dependency conflicts
- [ ] package-lock.json generated

## Preview Verification
- [ ] Remotion preview server starts without errors
- [ ] Composition listed and selectable in Remotion Studio
- [ ] Video and audio assets load correctly in preview
- [ ] Timeline displays correct duration
- [ ] Preview server stopped after verification
- [ ] Warnings logged (if any)
