# Shared Skills

Cross-cutting knowledge resources used by multiple agents. These are not tool-specific skills but domain knowledge guides.

## Available Resources

| Resource | File | Used By |
|---|---|---|
| Prompt Engineering | `prompt-engineering.md` | screenwriter, prompt-engineer |
| Color Theory | `color-theory.md` | character-designer, creative-director |
| Typography Standards | `typography-standards.md` | motion-designer |
| Aspect Ratio Guide | `aspect-ratio-guide.md` | storyboard-artist, editor |
| Audio Mixing | `audio-mixing.md` | sound-designer |

## Usage

These resources are loaded as supplementary context when an agent's workflow requires domain knowledge beyond their primary tool skills. Reference them via the `required_skills` field in workflow.yaml.
