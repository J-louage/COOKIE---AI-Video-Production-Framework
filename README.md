# COOKIE — AI Video Production Framework

COOKIE is an AI agent framework for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that orchestrates end-to-end video production. Tell it what you want to make, and a team of 13 specialized AI agents handles everything — scripting, storyboarding, character design, video generation, voiceover, editing, and final render. No video editing experience required.

## What You Can Make

- **YouTube videos** — explainers, tutorials, product reviews
- **Product demos** — screen recordings with narration and motion graphics
- **Social content** — short-form clips for Instagram, TikTok, YouTube Shorts
- **Brand films** — concept-driven videos with consistent characters and style
- **Educational content** — animated walkthroughs with voiceover

## Prerequisites

Install these before running setup:

| Tool | Minimum Version | Install |
|------|----------------|---------|
| Node.js | 18+ | [nodejs.org/download](https://nodejs.org/en/download) |
| Python | 3.10+ | [python.org/downloads](https://www.python.org/downloads/) |
| uv | any | `brew install uv` or [astral.sh/uv](https://astral.sh/uv) |
| FFmpeg | any | `brew install ffmpeg` |
| Claude Code | any | `npm install -g @anthropic-ai/claude-code` |

### API Keys

You'll need accounts with these services:

| Service | What It Powers | Get a Key |
|---------|---------------|-----------|
| Google AI Studio | VEO video generation + Gemini image generation | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| ElevenLabs | AI narration and voice synthesis | [elevenlabs.io](https://elevenlabs.io) (Settings > API Keys) |

## Installation

```bash
npx create-cookie-framework my-project
cd my-project
claude
```

The setup script will:
1. Check all dependencies are installed
2. Ask for your name and API keys
3. Install VEO skill dependencies
4. Configure everything automatically

Then inside Claude Code:

```
/cookie-director
```

### Manual Setup

If you prefer to clone and set up manually:

```bash
git clone https://github.com/J-louage/COOKIE---AI-Video-Production-Framework.git my-project
cd my-project
bash cookie-setup.sh
```

## Quick Start

| What you want | Command | What happens |
|---------------|---------|-------------|
| Get guidance | `/cookie-director` | Activates Christy, the Director — she'll guide you |
| Make a video fast | `/cookie-quick-video` | End-to-end production from a brief idea |
| Make a social clip | `/cookie-quick-social` | Short-form video optimized for social platforms |
| Start from a concept | `/cookie-idea` | Turns your idea into a full production script |
| See all commands | `/cookie-help` | Lists every available command with descriptions |

## How It Works

### The Agent Team

COOKIE coordinates 13 specialized agents, each with a distinct role:

| Agent | Name | Role |
|-------|------|------|
| Director | Christy | Routes commands, coordinates agents, manages project flow |
| Producer | Max | Tracks costs, budgets, generates financial reports |
| Screenwriter | Nora | Writes and refines video scripts |
| Storyboard Artist | Luca | Creates Scene Specification Documents (SSDs) |
| Character Designer | Iris | Builds character identity sheets and references |
| Prompt Engineer | Zara | Generates and optimizes image/video prompts |
| Cinematographer | Orion | Manages VEO video generation |
| Voice Director | Celeste | Manages ElevenLabs voice synthesis |
| Demo Producer | Kai | Records screen captures with Playwright |
| Sound Designer | Reed | Manages music, SFX, and audio mixing |
| Motion Designer | Felix | Creates Remotion compositions and animations |
| Editor | Ava | Assembles final video, renders, exports |
| Creative Director | Nova | Brainstorms concepts, ensures brand alignment |

### The 5-Phase Pipeline

```
Ideation → Pre-Production → Asset Generation → Composition → Post-Production
```

1. **Ideation** — Start with a concept, audio, or script. Nora (Screenwriter) transforms it into a canonical script. Nova (Creative Director) reviews for quality.

2. **Pre-Production** — Luca (Storyboard Artist) creates a Scene Specification Document. Iris (Character Designer) builds character sheets. Zara (Prompt Engineer) generates all prompts. Max (Producer) estimates costs.

3. **Asset Generation** — Agents generate all assets in parallel: character references, scene frames, video clips (VEO), narration (ElevenLabs), screen captures (Playwright), and music/SFX.

4. **Composition** — Felix (Motion Designer) assembles everything into a Remotion composition with animations, text overlays, and transitions. A preview render is created for review.

5. **Post-Production** — Ava (Editor) renders the final video, generates platform-specific formats, adds subtitles, creates thumbnails, and runs the final QA checklist.

### Configuration Hierarchy

Settings cascade from global defaults to episode-specific overrides:

```
_cookie/_config/global.yaml        → Framework-wide defaults
  └ _cookie/<module>/config.yaml   → Module-level settings
    └ project-config.yaml          → Project-level overrides
      └ episodes/<ep>/episode-config.yaml  → Episode-specific overrides
```

Lower files override higher ones.

## Command Reference

### Agent Activation
| Command | Agent | Description |
|---------|-------|-------------|
| `/cookie-director` | Christy | Activate the Director — master orchestrator |
| `/cookie-producer` | Max | Activate the Producer — cost and budget tracker |
| `/cookie-screenwriter` | Nora | Activate the Screenwriter |
| `/cookie-storyboard` | Luca | Activate the Storyboard Artist |
| `/cookie-character` | Iris | Activate the Character Designer |
| `/cookie-prompt-engineer` | Zara | Activate the Prompt Engineer |
| `/cookie-cinematographer` | Orion | Activate the Cinematographer |
| `/cookie-voice` | Celeste | Activate the Voice Director |
| `/cookie-demo` | Kai | Activate the Demo Producer |
| `/cookie-sound` | Reed | Activate the Sound Designer |
| `/cookie-motion` | Felix | Activate the Motion Designer |
| `/cookie-editor` | Ava | Activate the Editor |
| `/cookie-creative` | Nova | Activate the Creative Director |

### Phase 1 — Ideation
| Command | Description |
|---------|-------------|
| `/cookie-idea` | Transform a concept into a canonical script |
| `/cookie-validate-script` | Validate and normalize a user-provided script |
| `/cookie-audio-to-script` | Transcribe audio and build a visual script |
| `/cookie-extend-plan` | Plan video extension or modification |
| `/cookie-script-review` | Creative review of finalized script |

### Phase 2 — Pre-Production
| Command | Description |
|---------|-------------|
| `/cookie-create-character` | Create character identity and references |
| `/cookie-create-style` | Define visual style guide |
| `/cookie-create-ssd` | Generate Scene Specification Document |
| `/cookie-dependency-graph` | Build asset dependency graph |
| `/cookie-prompt-library` | Generate all prompts with consistency checks |
| `/cookie-pre-prod-review` | Review SSD and approve cost estimate |

### Phase 3 — Asset Generation
| Command | Description |
|---------|-------------|
| `/cookie-gen-char-refs` | Generate multi-angle character references |
| `/cookie-gen-frames` | Generate first/last frames for VEO continuity |
| `/cookie-gen-video` | Generate video clips via VEO |
| `/cookie-gen-narration` | Generate narration via ElevenLabs |
| `/cookie-record-screen` | Capture screen recordings via Playwright |
| `/cookie-gen-audio` | Generate music and sound effects |
| `/cookie-asset-qa` | Validate generated assets against SSD |

### Phase 4 — Composition
| Command | Description |
|---------|-------------|
| `/cookie-remotion-assembly` | Assemble assets into Remotion composition |
| `/cookie-audio-sync` | Synchronize audio with video timeline |
| `/cookie-text-animation` | Add text overlays and captions |
| `/cookie-preview` | Render low-res preview for review |

### Phase 5 — Post-Production
| Command | Description |
|---------|-------------|
| `/cookie-final-render` | Render full-resolution primary format |
| `/cookie-multi-export` | Generate all export formats |
| `/cookie-subtitles` | Generate and burn-in subtitles |
| `/cookie-thumbnails` | Generate thumbnail images per format |
| `/cookie-final-qa` | Final quality checklist before delivery |

### Quick Flows
| Command | Description |
|---------|-------------|
| `/cookie-quick-video` | Rapid single-video production |
| `/cookie-quick-social` | Rapid social media clip generation |

### Anytime Commands
| Command | Description |
|---------|-------------|
| `/cookie-regen-scene` | Regenerate specific scenes with revised prompts |
| `/cookie-cost-status` | Show current cost status vs estimate |
| `/cookie-episode-status` | Show episode production status |
| `/cookie-elicit` | Guided questioning for unclear requests |

### Creative Commands
| Command | Description |
|---------|-------------|
| `/cookie-brainstorm` | Brainstorm video concepts from a brief |
| `/cookie-moodboard` | Create visual moodboard for episode |
| `/cookie-brand-review` | Review video against brand guidelines |

### Utility Tasks
| Command | Description |
|---------|-------------|
| `/cookie-help` | Context-sensitive help |
| `/cookie-cost-estimate` | Calculate cost estimate from SSD |
| `/cookie-cost-report` | Generate final cost report |
| `/cookie-assets` | List all generated assets with status |
| `/cookie-format-adapt` | Generate derived SSD for alternate format |
| `/cookie-validate-ssd` | Validate SSD against tool constraints |
| `/cookie-validate-char` | Validate character sheet against schema |
| `/cookie-merge-scenes` | Merge VEO clips into continuous scene |
| `/cookie-continuity` | Check visual continuity across scenes |
| `/cookie-validate-framework` | Scan framework for consistency |

## FAQ

### I ran a command but nothing happened
Make sure you're running commands inside Claude Code (the CLI), not a regular terminal. Start Claude Code with `claude` from the project directory, then type the `/cookie-*` command.

### Where are my API keys stored?
The setup script saves them to `~/.claude/.env`, which is Claude Code's standard environment file. They're loaded automatically when Claude Code starts. You can edit the file directly to update keys.

### How much does it cost to make a video?
Costs depend on the number of scenes, video clips, and narration segments. Run `/cookie-cost-estimate` after creating your Scene Specification Document to get a detailed breakdown before generating any assets. Typical short videos cost $2–10 in API calls.

### Can I use COOKIE without ElevenLabs?
Yes — narration is optional. You can create videos with just visual content and music/SFX. Skip the ElevenLabs API key during setup and the framework will work without voice synthesis.

### How do I start a new project?
Run `/cookie-director` to activate Christy, then describe your project. She'll guide you through setup. Or run `/cookie-idea` with your concept to jump straight into scriptwriting.

### How do I add characters?
Run `/cookie-create-character` to create a character identity sheet (appearance, personality, voice). Then `/cookie-gen-char-refs` to generate multi-angle reference images for visual consistency.

### How do I create social media versions?
Run `/cookie-quick-social` for rapid social clips, or `/cookie-multi-export` after a final render to generate platform-specific formats (vertical 9:16 for Reels/TikTok, square 1:1 for feed posts).

### How do I track costs?
Run `/cookie-cost-status` at any time. For a detailed breakdown, `/cookie-cost-report`. Costs are logged automatically for every API call. Set your budget in `project-config.yaml`.

### How do I extend an existing video?
Run `/cookie-extend-plan` to analyze your existing video and plan new scenes with character and style continuity.

## Troubleshooting

### Setup script fails
- Make sure you're running it from the project root: `bash cookie-setup.sh`
- Check that all prerequisites are installed (the script will tell you what's missing)
- On Linux, ensure `bash` is version 4+ (`bash --version`)

### "Command not found" for /cookie-* commands
- The `.claude/commands/` directory must exist in your project. If you cloned manually, make sure the `.claude/` directory was included.
- Run `/cookie-validate-framework` to scan for broken file references.

### API keys not working
- Verify keys are in `~/.claude/.env` (not the project `.env`)
- Check the key is correct — no extra spaces or quotes
- For Google AI: ensure the key has access to Gemini and VEO APIs at [aistudio.google.com](https://aistudio.google.com)

### npm install fails in VEO skill
- Run manually: `cd _cookie/skills/veo && npm install`
- Ensure Node.js 18+ is installed: `node -v`

### VEO generation fails
- Verify model ID in config matches a valid VEO model
- Aspect ratio must be `16:9` or `9:16` — other ratios are not supported
- VEO 3.1 max clip duration is 8 seconds
- Check API key has sufficient quota

### Cost gate halts production
- Run `/cookie-cost-status` to see current spend vs. budget
- Increase budget in `project-config.yaml`
- Or switch to YOLO-UNCAPPED mode if intentional

### Character inconsistency
- Regenerate references with `/cookie-gen-char-refs`
- Check `identity.json` for correct trait descriptions
- Ensure all scenes reference the same character ID in the SSD

### Remotion render fails
- Requires Node.js 18+
- Run `npm install` in the Remotion project directory
- Verify composition ID matches `src/Root.tsx`
- Check all asset file paths are valid

## Project Structure

```
project-root/
├── _cookie/                  # Framework (don't modify)
│   ├── _config/              # Global configuration
│   ├── _cost/                # Cost tracking data
│   ├── _memory/              # Agent memory sidecars
│   ├── core/                 # Director + Producer agents, workflow engine
│   ├── production/           # 8 production agents and workflows
│   ├── composition/          # Motion Designer + Editor, Remotion templates
│   ├── creative/             # Creative Director, brainstorming
│   └── skills/               # Tool skills (VEO, ElevenLabs, etc.)
├── .claude/
│   └── commands/             # All /cookie-* slash commands
├── characters/               # Character definitions and references
├── shared-assets/            # Cross-episode assets
├── episodes/                 # Per-episode production files
├── cli/                      # npx create-cookie-framework package
├── cookie-setup.sh           # Interactive setup script
├── .env.example              # API key template
├── project-config.yaml       # Project-level settings
├── CLAUDE.md                 # Framework operating manual
└── README.md                 # This file
```

## License

MIT
