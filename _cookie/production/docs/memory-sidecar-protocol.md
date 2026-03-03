# Memory Sidecar Protocol

## Overview

The memory sidecar system gives each agent persistent memory across workflow runs. Agents record decisions, observations, quirks, and patterns in YAML files stored in `_memory/<agent-name>-sidecar/`. This protocol defines when to write, what to write, how to read, and how to apply remembered information.

---

## When to Write

Agents must write to their sidecar files at these trigger points:

| Trigger | What to Record | Example |
|---------|---------------|---------|
| **After a successful workflow** | The decision that led to success, with context | "Used 3-second pre-roll silence for YouTube Shorts — engagement was higher" |
| **After a failure** | What went wrong, what was tried, what to avoid | "Veo rejected prompt with more than 3 camera movements — reduce to 2 max" |
| **After user feedback** | The user's correction or preference, verbatim if possible | "User prefers warm color grading over neutral for this brand" |
| **After model quirk discovery** | Unexpected model behavior worth remembering | "Flux produces better hands when 'detailed fingers' is in the negative prompt" |
| **After a creative decision** | Style, tone, or structural choices that define the series | "Episode 3 established a cold open pattern — maintain for continuity" |

**Do NOT write:**
- Routine operations that followed standard procedure with no deviation.
- Temporary debugging notes (use comments in the workflow instead).
- Duplicate entries — check if a substantially similar entry already exists before writing.

---

## What to Write

All sidecar entries follow a consistent YAML log format:

```yaml
entries:
  - date: "2026-03-03"
    episode: "ep-007"
    context: "Mixing narration over orchestral music bed"
    decision: "Used sidechaincompress with ratio=6 instead of static volume duck — orchestral dynamics were preserved while narration remained clear"
    outcome: "success"
    confidence: "medium"
    tags:
      - audio-mixing
      - sidechain
      - orchestral
```

### Field Definitions

| Field | Required | Description |
|-------|----------|-------------|
| `date` | Yes | ISO 8601 date (YYYY-MM-DD) when the entry was recorded |
| `episode` | No | Episode or project identifier for context. Omit for general observations. |
| `context` | Yes | Brief description of the situation. What were you doing? What were the inputs? |
| `decision` | Yes | The specific choice, observation, or learning. Be precise and actionable. |
| `outcome` | No | `"success"`, `"failure"`, `"mixed"`, or `"pending"`. Omit if not yet evaluated. |
| `confidence` | Yes | `"high"`, `"medium"`, or `"low"` (see Confidence Levels below) |
| `tags` | Yes | Array of lowercase kebab-case tags for filtering. Minimum 1, recommend 2-4. |

### File-Specific Formats

Not all sidecar files use the generic `entries` format. Some files have domain-specific structures:

**episode-history.yaml** (Director):
```yaml
episodes:
  - id: "ep-007"
    date: "2026-03-03"
    title: "The Algorithm"
    scenes: 5
    duration_seconds: 182
    issues: []
    notes: "First episode using the new cold open pattern"
```

**model-quirks.yaml** (Prompt Engineer):
```yaml
quirks:
  - date: "2026-03-03"
    model: "flux-1.1-pro"
    quirk: "Generates extra fingers when hands are near face — mitigate with 'anatomically correct hands' in prompt"
    confidence: "high"
    tags:
      - flux
      - hands
      - anatomy
```

**character-evolution.yaml** (Character Designer):
```yaml
characters:
  - name: "Alex"
    entries:
      - date: "2026-03-03"
        change: "Shifted hair color from brown to dark auburn for better contrast against blue backgrounds"
        episode: "ep-005"
        reference_image: "alex-v3-auburn.png"
        confidence: "high"
```

Use the format that matches the file's top-level key. When in doubt, use the generic `entries` format.

---

## How to Read

### At Workflow Start

Every agent must read its sidecar files at the beginning of each workflow run. The read process:

1. **Load all sidecar files** for the current agent from `_memory/<agent-name>-sidecar/`.
2. **Filter by relevance** using tags that match the current task. For example, if the current task involves audio mixing, filter `decisions.yaml` entries by tags containing `audio-mixing`, `loudness`, `ducking`, etc.
3. **Sort by confidence** — high-confidence entries first.
4. **Apply rules** based on confidence level (see below).

### Confidence-Based Application

| Confidence | Meaning | How to Apply |
|------------|---------|--------------|
| **high** | Verified 3+ times across different episodes or explicitly confirmed by user | Treat as a **rule**. Follow this unless the user explicitly overrides it. |
| **medium** | Observed once clearly, or confirmed by user once | Treat as a **suggestion**. Apply by default but adjust if context differs. |
| **low** | Hypothesis based on a single ambiguous observation | **Ignore in automated workflows**. Only surface to the user if directly relevant and no higher-confidence alternative exists. |

### Tag-Based Filtering

Tags enable efficient retrieval. When an agent starts a task, it should construct a tag query:

```
Current task: "Mix audio for YouTube Short with narration and music"
Relevant tags: audio-mixing, youtube, shorts, narration, music, ducking, loudness
```

The agent filters all sidecar entries to those matching at least one relevant tag, then sorts by confidence descending, then by date descending (most recent first).

---

## Confidence Levels

### High Confidence

A decision reaches high confidence when:
- It has been verified in 3 or more separate episodes/projects with consistent positive outcomes.
- The user has explicitly stated it as a preference or rule (e.g., "Always use -14 LUFS for YouTube").
- It reflects a documented platform requirement (e.g., "YouTube normalizes to -14 LUFS").

High-confidence entries should rarely change. When they do, record the change as a new entry and note why the previous rule was superseded.

### Medium Confidence

A decision is medium confidence when:
- It was observed once clearly with a definitive positive or negative outcome.
- The user confirmed it once but has not repeated the preference.
- It was effective in one context but has not been tested in others.

Medium-confidence entries are candidates for promotion to high after further verification.

### Low Confidence

A decision is low confidence when:
- It is a hypothesis based on a single ambiguous result.
- The outcome was mixed or unclear.
- It contradicts another entry (indicating uncertainty).

Low-confidence entries should be reviewed periodically. If they remain unverified after 5 episodes, consider deleting them.

---

## Example: Full Decision Lifecycle

**1. Discovery (Episode 5):**
```yaml
entries:
  - date: "2026-02-15"
    episode: "ep-005"
    context: "Veo generated a 5-second clip with prompt containing 4 camera movements"
    decision: "Veo seems to ignore camera movements beyond the 3rd one in a single prompt — limit to 2-3 movements per clip"
    outcome: "failure"
    confidence: "low"
    tags:
      - veo
      - camera-movement
      - prompt-length
```

**2. Confirmation (Episode 7):**
```yaml
  - date: "2026-02-22"
    episode: "ep-007"
    context: "Tested Veo with exactly 3 camera movements — all three were executed"
    decision: "Veo reliably executes up to 3 camera movements per prompt. 4+ causes the last movements to be dropped."
    outcome: "success"
    confidence: "medium"
    tags:
      - veo
      - camera-movement
      - prompt-length
```

**3. Promotion to Rule (Episode 12):**
```yaml
  - date: "2026-03-03"
    episode: "ep-012"
    context: "Verified across 5 episodes: Veo handles 1-3 camera movements reliably, 4+ always drops the last"
    decision: "RULE: Limit Veo prompts to a maximum of 3 camera movements per clip. Split longer sequences into multiple clips."
    outcome: "success"
    confidence: "high"
    tags:
      - veo
      - camera-movement
      - prompt-length
      - rule
```

---

## Sidecar File Inventory

| Agent | Directory | Files |
|-------|-----------|-------|
| Director (Christy) | `_memory/director-sidecar/` | `decisions.yaml`, `episode-history.yaml`, `agent-notes.yaml` |
| Screenwriter (Nora) | `_memory/screenwriter-sidecar/` | `decisions.yaml`, `themes.yaml`, `brand-tone.yaml` |
| Character Designer (Iris) | `_memory/character-designer-sidecar/` | `decisions.yaml`, `character-evolution.yaml`, `style-notes.yaml` |
| Prompt Engineer (Zara) | `_memory/prompt-engineer-sidecar/` | `decisions.yaml`, `model-quirks.yaml`, `style-token-library.yaml` |
| Cinematographer (Orion) | `_memory/cinematographer-sidecar/` | `decisions.yaml`, `veo-behavior.yaml`, `camera-patterns.yaml` |
| Editor (Ava) | `_memory/editor-sidecar/` | `decisions.yaml`, `platform-tips.yaml`, `export-notes.yaml` |
| Creative Director (Nova) | `_memory/creative-director-sidecar/` | `decisions.yaml`, `brand-evolution.yaml`, `style-history.yaml` |
