# Shared Asset Management

> Rules for sharing characters, brand assets, and environments across episodes while keeping episode-specific assets isolated.

## Asset Boundaries

### Project-Level (Shared Across All Episodes)

| Asset Type | Location | Sharing Rule |
|-----------|----------|-------------|
| Characters | `characters/{character_id}/` | Created once, reused by all episodes |
| Brand config | `characters/brand/` | Logo, colors, fonts — loaded by all episodes |
| Environments | `environments/{environment_id}/` | Created once, reused by all episodes |
| Shared assets | `shared-assets/` | Music library, intro/outro templates |

### Episode-Level (Never Shared)

| Asset Type | Location | Isolation Rule |
|-----------|----------|---------------|
| Scripts | `episodes/{id}/script/` | Each episode has its own script |
| Scene specs (SSD) | `episodes/{id}/ssd/` | Each episode has its own SSD |
| Video clips | `episodes/{id}/assets/` | Generated clips are episode-specific |
| Compositions | `episodes/{id}/composition/` | Remotion projects are episode-specific |
| Final exports | `episodes/{id}/exports/` | Rendered outputs are episode-specific |
| Audio assets | `episodes/{id}/assets/audio/` | Narration is episode-specific |

## Character Sharing

### How It Works

1. **First use:** Episode 1 creates character "marcus"
   - `characters/marcus/identity.json` — character definition
   - `characters/marcus/styles/realistic/reference-*.png` — reference images
   - Cost logged to EP-001 actuals

2. **Subsequent use:** Episode 2 references "marcus"
   - Reads existing `characters/marcus/identity.json`
   - Reads existing reference images
   - **No regeneration needed — $0 character cost for EP-002**

3. **New outfit:** Episode 2 adds a new outfit for "marcus"
   - Creates `characters/marcus/styles/realistic/outfits/new-outfit/`
   - Cost logged to EP-002 actuals (only the new outfit generation)

4. **Later use:** Episode 3 uses "marcus" with the new outfit
   - Both identity and outfit already exist
   - **$0 cost for EP-003**

### Character Registry

Characters available to all episodes are listed in `project-config.yaml`:

```yaml
shared_characters:
  - character_id: "marcus"
    path: "ref:characters/marcus/"
  - character_id: "narrator"
    path: "ref:characters/narrator/"
```

Episode-specific characters are listed in `episode-config.yaml`:

```yaml
episode_characters:
  - character_id: "guest-ep3"
    path: "ref:characters/guest-ep3/"
```

### Cost Tracking for Shared Assets

The cost system separates shared costs from episode costs:

- **Shared cost:** First generation of a shared character → logged under "shared" in project cost report
- **Episode cost:** New outfit, voice generation, scene-specific assets → logged under the episode
- **Amortization:** Project cost report divides shared costs equally across all episodes for per-episode cost analysis

## Brand Asset Sharing

Brand assets in `characters/brand/` are always project-level:

```
characters/brand/
├── brand-config.json          # Colors, fonts, tone
├── logo/                      # Logo variants
│   ├── primary.svg
│   ├── white.svg
│   └── icon.svg
└── guidelines/                # Brand guidelines reference
```

All episodes load brand config automatically. Brand assets are never regenerated — they are provided by the user or created once during project setup.

## Environment Sharing

Environments follow the same pattern as characters:

```
environments/
├── hotel-lobby/
│   ├── environment.json       # Environment definition
│   └── reference-images/      # Reference images for VEO prompts
├── conference-room/
│   └── ...
└── rooftop-bar/
    └── ...
```

- First episode to use an environment generates it
- Subsequent episodes reuse existing references
- Cost tracked under "shared" in the project cost report

## Safety Rules

1. **No cross-episode asset writes.** An episode workflow must never write to another episode's directory.
2. **Read-only shared access.** Episodes read from `characters/`, `environments/`, and `shared-assets/` but never modify existing shared assets without explicit user approval.
3. **New shared assets require registration.** If an episode creates a new character intended for sharing, it must be added to `project-config.yaml` → `shared_characters[]`.
4. **Version isolation.** If an episode needs a modified version of a shared character (e.g., aged version), create a new character entry rather than modifying the shared one.
