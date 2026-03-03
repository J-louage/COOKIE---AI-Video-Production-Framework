# COOKIE — AI Video Production Framework

COOKIE is an AI agent framework for Claude Code that orchestrates end-to-end video production using VEO, Nano Banana (Gemini), ElevenLabs, Remotion, and FFmpeg. It coordinates 13 specialized agents through a structured workflow engine, handling everything from initial concept to final rendered video.

## Quick Start

Get your first video in 5 minutes:

```
1. Open your project in Claude Code
2. Run /cookie-director to activate the framework
3. Run /cookie-quick-video to start rapid production
4. Or run /cookie-idea to begin from a concept
```

## Architecture Overview

COOKIE is organized into 4 modules with 13 specialized agents:

### Modules

| Module | Agents | Purpose |
|--------|--------|---------|
| **core** | Director (Christy), Producer (Max) | Command routing, project coordination, cost tracking |
| **production** | Screenwriter (Nora), Storyboard Artist (Luca), Character Designer (Iris), Prompt Engineer (Zara), Cinematographer (Orion), Voice Director (Celeste), Demo Producer (Kai), Sound Designer (Reed) | Ideation through asset generation |
| **composition** | Motion Designer (Felix), Editor (Ava) | Remotion assembly, rendering, exports |
| **creative** | Creative Director (Nova) | Brainstorming, moodboards, brand alignment |

### By the Numbers

- **13** specialized agents with distinct personas
- **38** workflows across 5 production phases
- **10** utility tasks
- **8** tool skills: VEO, Nano Banana, ElevenLabs, Remotion, FFmpeg, Playwright, Image Editing, Shared

## Configuration

### Configuration Hierarchy

Settings cascade from global defaults down to episode-specific overrides:

```
_cookie/_config/global.yaml        # Framework-wide defaults
  -> _cookie/<module>/config.yaml  # Module-level settings
    -> project-config.yaml         # Project-level overrides
      -> episodes/<ep>/episode-config.yaml  # Episode-specific overrides
```

Lower files override higher ones. The engine checks the full chain before using any config value.

### Key Configuration Files

| File | Controls |
|------|----------|
| `global.yaml` | Default models, cost rates, quality presets, execution mode |
| Module `config.yaml` | Module-specific tool settings, agent defaults |
| `project-config.yaml` | Project name, budget, target formats, character roster |
| `episode-config.yaml` | Episode title, duration, scene count, per-episode budget |

### Overriding Settings Per Episode

Create or edit `episodes/<episode-name>/episode-config.yaml`. Any key defined here overrides the same key from project and global configs. Common overrides include budget, target duration, aspect ratio, and voice settings.

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

## Production Workflow

COOKIE follows a 5-phase production pipeline:

```
Ideation -> Pre-Production -> Asset Generation -> Composition -> Post-Production
```

### Phase 1 — Ideation
Start with a concept, audio recording, or raw script. The Screenwriter (Nora) transforms it into a canonical script. The Creative Director (Nova) reviews it for creative quality.

### Phase 2 — Pre-Production
The Storyboard Artist (Luca) creates a Scene Specification Document (SSD) — the central production contract. The Character Designer (Iris) builds character identity sheets. The Prompt Engineer (Zara) generates all VEO and Nano Banana prompts. The Producer (Max) estimates costs and the Director (Christy) reviews everything before proceeding.

### Phase 3 — Asset Generation
Agents generate all production assets in parallel where possible: character reference images, scene frames, video clips (via VEO), narration (via ElevenLabs), screen captures (via Playwright), and music/SFX. Assets are validated against the SSD.

### Phase 4 — Composition
The Motion Designer (Felix) assembles all assets into a Remotion composition with animations, text overlays, and transitions. Audio is synchronized with the video timeline. A low-res preview is rendered for review before committing to final render.

### Phase 5 — Post-Production
The Editor (Ava) renders the final video at full resolution, generates derived formats for different platforms (YouTube, Instagram, TikTok, etc.), adds subtitles, and creates thumbnails. A final QA checklist is completed before delivery.

## FAQ

### How do I start a new project?
Run `/cookie-director` to activate Christy, then describe your project. She will guide you through creating a `project-config.yaml` and setting up the project structure. Alternatively, run `/cookie-idea` with your concept to jump straight into scriptwriting.

### How do I add characters?
Run `/cookie-create-character` to create a new character identity sheet. This generates an `identity.json` with appearance traits, personality, and voice settings. Then run `/cookie-gen-char-refs` to generate multi-angle reference images for visual consistency.

### How do I create social media versions?
Run `/cookie-quick-social` for rapid social clip generation from an existing video. Or run `/cookie-multi-export` after a final render to generate platform-specific formats (vertical 9:16 for Reels/TikTok, square 1:1 for feed posts, etc.).

### How do I track costs?
Run `/cookie-cost-status` at any time to see current spend vs. your budget. For a detailed breakdown, run `/cookie-cost-report`. Costs are automatically logged for every VEO, Nano Banana, and ElevenLabs API call. Set your budget in `project-config.yaml`.

### How do I extend an existing video?
Run `/cookie-extend-plan` to analyze your existing video and plan new scenes. The Screenwriter will create extension scenes that maintain continuity with the original content, preserving character consistency and visual style.
