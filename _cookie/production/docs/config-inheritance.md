# Configuration Inheritance Chain

> How COOKIE resolves configuration values: global defaults → project overrides → episode overrides.

## Three-Level Hierarchy

```
_cookie/_config/global.yaml          ← Framework-wide defaults (never edited per project)
    ↓ overridden by
project-config.yaml                  ← Project-level defaults (set once per series)
    ↓ overridden by
episodes/{id}/episode-config.yaml    ← Episode-specific overrides (set per episode)
```

## Resolution Rules

1. **Read global.yaml** — provides base defaults for all settings
2. **Merge project-config.yaml `defaults` block** — any non-null value overrides the global
3. **Merge episode-config.yaml `overrides` block** — any non-null value overrides the project default

A `null` value in an override block means "inherit from the level above."

### Example

```yaml
# global.yaml
default_resolution_profile: "standard"
default_veo_model: "veo-3.0-generate-001"

# project-config.yaml
defaults:
  resolution_profile: "hd"            # overrides global "standard"
  veo_model: null                     # inherits global "veo-3.0-generate-001"

# episodes/EP-001/episode-config.yaml
overrides:
  resolution_profile: null            # inherits project "hd"
  veo_model: "veo-2.0-generate-001"   # overrides to VEO 2.0 for this episode
```

**Resolved config for EP-001:**
- `resolution_profile` = `"hd"` (from project)
- `veo_model` = `"veo-2.0-generate-001"` (from episode override)

**Resolved config for EP-002 (no overrides):**
- `resolution_profile` = `"hd"` (from project)
- `veo_model` = `"veo-3.0-generate-001"` (from global)

## Configurable Fields

| Field | global.yaml Key | project-config.yaml Key | episode-config.yaml Key |
|-------|----------------|------------------------|------------------------|
| Resolution profile | `default_resolution_profile` | `defaults.resolution_profile` | `overrides.resolution_profile` |
| VEO model | `default_veo_model` | `defaults.veo_model` | `overrides.veo_model` |
| VEO speed | `default_veo_speed` | `defaults.veo_speed` | `overrides.veo_speed` |
| Nano Banana model | `default_nano_banana_model` | `defaults.nano_banana_model` | `overrides.nano_banana_model` |
| Aspect ratio | `default_aspect_ratio` | `defaults.aspect_ratio` | `overrides.aspect_ratio` |
| Person generation | `default_person_generation` | `defaults.person_generation` | `overrides.person_generation` |

## Budget Inheritance

Budget does NOT use the three-level override system. Instead:
- **Project budget** is set in `project-config.yaml` under `budget.total_project_budget`
- **Per-episode budget** is set in `project-config.yaml` under `budget.per_episode_budget`
- Episodes cannot override the budget — only the project owner can adjust budget limits
- Budget alerts (`alert_at_percent`, `halt_at_percent`) are project-level only

## When Config Is Resolved

Configuration is resolved at the start of every workflow execution:
1. The workflow engine reads all three config levels
2. Merges them in order (global → project → episode)
3. The resolved config is available to the agent executing the workflow
4. Agents never read config files directly — they receive the resolved values

## Shared vs Episode-Specific Settings

| Setting Type | Scope | Where Configured |
|-------------|-------|-----------------|
| Characters (shared) | Project | `project-config.yaml` → `shared_characters[]` |
| Characters (episode-only) | Episode | `episode-config.yaml` → `episode_characters[]` |
| Brand assets | Project | `project-config.yaml` → `defaults.brand` |
| Music (default) | Episode | `episode-config.yaml` → `episode_music` |
| Format adaptations | Episode | `episode-config.yaml` → `format_adaptations` |
| Production state | Episode | `episode-config.yaml` → `production_state` |
