# COOKIE — AI Video Production Framework

## What This Is
COOKIE is an AI agent framework for Claude Code that orchestrates end-to-end video production. It uses 13 specialized agents, 38 workflows, 10 tasks, 8 tool skills, and ~55 slash commands organized across 4 modules.

## Framework Location
All framework files live in `_cookie/`. Never modify framework files during normal production — they are the operating system.

## How It Works
When a user runs any `/cookie-*` slash command, Claude Code must:
1. Load `_cookie/core/engine/workflow.xml` — the core execution engine
2. Load the target `workflow.yaml` — the specific workflow configuration
3. Follow the workflow.xml instructions exactly, using protocols for input discovery, preflight checks, dependency resolution, cost gates, and handoffs

## Modules
- **core/** — Director (Christy) + Producer (Max) agents, workflow engine, protocols, 10 tasks
- **production/** — 8 agents handling ideation through post-production, 38 workflows across 5 phases
- **composition/** — Motion Designer + Editor agents, Remotion templates, FFmpeg presets
- **creative/** — Creative Director agent, brainstorming, moodboards, brand alignment

## Agent Directory
| Agent | Name | Module | Role |
|-------|------|--------|------|
| director | Christy | core | Routes commands, coordinates agents, manages project flow |
| producer | Max | core | Tracks costs, budgets, generates financial reports |
| screenwriter | Nora | production | Writes and refines video scripts |
| storyboard-artist | Luca | production | Creates Scene Specification Documents (SSDs) |
| character-designer | Iris | production | Builds character identity sheets and references |
| prompt-engineer | Zara | production | Generates and optimizes image/video prompts |
| cinematographer | Orion | production | Manages VEO video generation |
| voice-director | Celeste | production | Manages ElevenLabs voice synthesis |
| demo-producer | Kai | production | Records screen captures with Playwright |
| sound-designer | Reed | production | Manages music, SFX, and audio mixing |
| motion-designer | Felix | composition | Creates Remotion compositions and animations |
| editor | Ava | composition | Assembles final video, renders, exports |
| creative-director | Nova | creative | Brainstorms concepts, ensures brand alignment |

## Memory Sidecar System
Seven agents have persistent memory sidecars stored in `_cookie/_memory/`. These sidecars retain context, preferences, and learned patterns across sessions.

| Agent | Name | Sidecar Path |
|-------|------|-------------|
| director | Christy | `_cookie/_memory/director-sidecar/` |
| screenwriter | Nora | `_cookie/_memory/screenwriter-sidecar/` |
| character-designer | Iris | `_cookie/_memory/character-designer-sidecar/` |
| prompt-engineer | Zara | `_cookie/_memory/prompt-engineer-sidecar/` |
| cinematographer | Orion | `_cookie/_memory/cinematographer-sidecar/` |
| editor | Ava | `_cookie/_memory/editor-sidecar/` |
| creative-director | Nova | `_cookie/_memory/creative-director-sidecar/` |

## Configuration Hierarchy
`_config/global.yaml` → module `config.yaml` → `project-config.yaml` → episode `episode-config.yaml`

Lower files override higher ones. Always check the full chain before using a config value.

## Cost Tracking Rules
- Every API call (VEO, Nano Banana, ElevenLabs) MUST be logged to `_cost/actuals/`
- Check cost gates before expensive operations
- Warn at 80% of budget, halt at 120%
- In YOLO mode: skip confirmations but still log costs
- In YOLO-UNCAPPED mode: skip cost gates entirely but still log

## Execution Modes
- **Normal:** Confirm before costly actions, respect all gates
- **YOLO:** Skip user confirmations, still respect cost gates
- **YOLO-UNCAPPED:** Skip everything, just log

## Key File Types
- `workflow.yaml` — Workflow configuration (loaded by workflow.xml engine)
- `identity.json` — Character identity files (in `characters/`)
- `scene-spec.yaml` — Scene Specification Document (central production contract)
- `canonical-script.md` — Finalized video script
- `style-guide.yaml` — Visual style reference

## Project Structure
```
project-root/
├── _cookie/              # Framework (don't modify)
├── characters/           # Character definitions and references
├── shared-assets/        # Cross-episode assets
├── episodes/             # Per-episode production files
├── project-config.yaml   # Project-level settings
└── CLAUDE.md            # This file
```

## Available Slash Commands

### Agent Activation
/cookie-director, /cookie-producer, /cookie-screenwriter, /cookie-storyboard, /cookie-character, /cookie-prompt-engineer, /cookie-cinematographer, /cookie-voice, /cookie-demo, /cookie-sound, /cookie-motion, /cookie-editor, /cookie-creative

### Phase 1 — Ideation
/cookie-idea, /cookie-validate-script, /cookie-audio-to-script, /cookie-extend-plan, /cookie-script-review

### Phase 2 — Pre-Production
/cookie-create-character, /cookie-create-style, /cookie-create-ssd, /cookie-dependency-graph, /cookie-prompt-library, /cookie-pre-prod-review

### Phase 3 — Asset Generation
/cookie-gen-char-refs, /cookie-gen-frames, /cookie-gen-video, /cookie-gen-narration, /cookie-record-screen, /cookie-gen-audio, /cookie-asset-qa

### Phase 4 — Composition
/cookie-remotion-assembly, /cookie-audio-sync, /cookie-text-animation, /cookie-preview

### Phase 5 — Post-Production
/cookie-final-render, /cookie-multi-export, /cookie-subtitles, /cookie-thumbnails, /cookie-final-qa

### Quick Flows
/cookie-quick-video, /cookie-quick-social

### Anytime
/cookie-regen-scene, /cookie-cost-status, /cookie-episode-status, /cookie-elicit

### Creative
/cookie-brainstorm, /cookie-moodboard, /cookie-brand-review

### Tasks
/cookie-help, /cookie-cost-estimate, /cookie-cost-report, /cookie-assets, /cookie-format-adapt, /cookie-validate-ssd, /cookie-validate-char, /cookie-merge-scenes, /cookie-continuity, /cookie-validate-framework

## Quick Start
1. Run `/cookie-director` to activate Christy and get guidance
2. Or run `/cookie-quick-video` for an end-to-end quick flow
3. Run `/cookie-help` to see all available commands with descriptions

## Troubleshooting

### VEO generation fails
- Check the model ID in your config matches a valid VEO model
- Aspect ratio must be `16:9` or `9:16` — other ratios are not supported
- Duration constraints: VEO 3.1 max clip duration is 8 seconds
- Verify your API key is valid and has sufficient quota

### Cost gate halts production
- Check the budget defined in `project-config.yaml`
- Run `/cookie-cost-status` to see current spend vs. budget
- Increase budget in config or switch to YOLO-UNCAPPED mode if intentional

### Character inconsistency
- Regenerate character reference images with updated prompts via `/cookie-gen-char-refs`
- Check the character `identity.json` for correct trait descriptions
- Ensure all scenes reference the same character ID in the SSD

### Remotion render fails
- Check Node.js version (requires Node.js 18+ for Remotion)
- Run `npm install` in the Remotion project directory
- Verify the composition ID matches what is defined in `src/Root.tsx`
- Check that all asset file paths in the composition are valid

### Slash command not found
- Run `/cookie-validate-framework` to scan for broken file references
- Verify the command exists in `_cookie/_config/cookie-help.csv`
- Check that the corresponding `.md` command file exists in `.claude/commands/`

## Known Limitations
- **VEO aspect ratios:** Only 16:9 and 9:16 are natively supported. Other ratios require post-crop via FFmpeg.
- **VEO clip duration:** VEO 3.1 maximum duration per clip is 8 seconds. Longer scenes must be split and merged.
- **Character consistency:** Nano Banana character consistency requires careful prompt engineering. Use multi-angle reference images and detailed identity descriptions for best results.
- **No real-time preview:** All rendering is offline via Remotion. There is no live preview during composition.
- **Memory sidecar cleanup:** Memory sidecars require manual cleanup for stale entries. Old session data is not automatically pruned.
