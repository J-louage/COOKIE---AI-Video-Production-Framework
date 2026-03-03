# Agent Customization Guide

## Overview
You can customize any COOKIE agent's behavior by creating a `{agent_id}.customize.yaml` file in this directory.

## How It Works
When an agent is activated, the framework checks for a matching customization file:
1. Load the agent's base persona from its `.md` file
2. Check for `_cookie/_config/agents/{agent_id}.customize.yaml`
3. Apply any overrides from the customization file

## Customizable Properties

| Property | Description | Example |
|----------|-------------|---------|
| `communication_style` | How the agent communicates | "casual", "formal", "terse" |
| `preferred_format` | Default video format preference | "brand-film", "social-short" |
| `auto_approve_cost_under` | Skip cost confirmation below this amount | 5.00 |
| `default_resolution` | Agent's default resolution profile | "hd" |
| `verbose` | Show detailed output | true/false |
| `language` | Primary language for responses | "en", "nl", "fr" |

## Example Customization

```yaml
# _cookie/_config/agents/director.customize.yaml
agent_id: "director"
overrides:
  communication_style: "casual"
  preferred_format: "social-short"
  auto_approve_cost_under: 5.00
  verbose: false
  language: "en"
```

## Creating a Customization File
1. Copy the example above
2. Change `agent_id` to match the target agent
3. Add only the properties you want to override
4. Save as `{agent_id}.customize.yaml` in this directory

## Available Agent IDs
- `director`, `producer`
- `screenwriter`, `storyboard-artist`, `character-designer`
- `prompt-engineer`, `cinematographer`, `voice-director`
- `demo-producer`, `sound-designer`
- `motion-designer`, `editor`
- `creative-director`

## Notes
- Customizations are optional — agents work with defaults if no file exists
- You can delete a customization file to revert to defaults
- Customizations only affect behavior, not core capabilities
