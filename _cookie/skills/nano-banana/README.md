# Nano Banana Pro - Image Generation Skill for Claude Code

Generate and edit high-quality AI images directly from Claude Code using Google's Gemini Image API. Supports text-to-image, image editing, multi-image composition, and built-in presets.

## Supported Models

- **Gemini 3.1 Flash Image** — Fast, efficient, up to 4K (recommended)
- **Gemini 3 Pro Image** — Pro quality, best text rendering
- **Gemini 2.5 Flash Image** — Budget option, 1K only

## Installation

### 1. Copy the skill into your project

Copy the `nano-banana-pro` folder into your project's `.claude/skills/` directory:

```
your-project/
└── .claude/
    └── skills/
        └── nano-banana-pro/
            ├── SKILL.md
            ├── README.md
            └── scripts/
                ├── generate_image.py
                └── Presets.json
```

If you don't have a `.claude/skills/` directory yet, create it:

```bash
mkdir -p .claude/skills
```

Then copy the skill:

```bash
cp -r /path/to/nano-banana-pro .claude/skills/nano-banana-pro
```

### 2. Install uv (if not already installed)

```bash
brew install uv
```

Dependencies (`google-genai`, `pillow`) are managed automatically by `uv` via inline script metadata — no manual install needed.

### 3. Set up your Google API key

Get an API key from [Google AI Studio](https://aistudio.google.com/apikey), then add it to `~/.claude/.env`:

```bash
echo "GOOGLE_API_KEY=your-api-key-here" >> ~/.claude/.env
```

> **Important:** The value must be the API key string itself (starts with `AIza...`), not a path to a JSON file.

### 4. Verify

Open Claude Code in your project and type:

```
/nano-banana-pro a sunset over mountains
```

Claude will generate the image and report the saved file path.

## Usage

### Basic text-to-image

```
/nano-banana-pro A golden retriever playing in autumn leaves, photorealistic
```

### With options

```
/nano-banana-pro A coffee cup on marble --resolution 4K --aspect-ratio 16:9 --preset product
```

### Image editing

```
/nano-banana-pro Make the sky purple and add northern lights -i /path/to/photo.png
```

### Multi-image composition

```
/nano-banana-pro Combine these into a collage -i a.png -i b.png -i c.png
```

### Natural language (no slash command)

You can also just describe what you want:

```
Generate an image of ocean waves crashing on rocks at sunset
```

Claude will recognize the intent and use the skill automatically.

## Options Reference

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--prompt` | Text | Required | Image description |
| `--output` | File path | Auto-generated | Output file (.png) |
| `--model` | See models below | `gemini-3.1-flash-image-preview` | Model to use |
| `--resolution` | `512px`, `1K`, `2K`, `4K` | `1K` | Output resolution |
| `--aspect-ratio` | `1:1`, `16:9`, `9:16`, etc. | `1:1` | Output aspect ratio |
| `--preset` | See presets below | None | Prompt style preset |
| `-i` | File path(s) | None | Input image(s) for editing (up to 14) |
| `--api-key` | Key string | From env | API key override |
| `--dry-run` | — | — | Show cost estimate only |
| `--list-presets` | — | — | List available presets |
| `--show-preset` | Name | — | Show preset details |

## Cost Reference

| Model | 512px | 1K | 2K | 4K |
|-------|-------|-----|-----|-----|
| Gemini 3.1 Flash Image | $0.045 | $0.067 | $0.101 | $0.151 |
| Gemini 3 Pro Image | — | $0.134 | $0.134 | $0.240 |
| Gemini 2.5 Flash Image | — | $0.039 | — | — |

Claude shows a cost estimate before generating when costs exceed $0.10.

## Presets

| Preset | Resolution | Aspect | Style |
|--------|-----------|--------|-------|
| `photorealistic` | 2K | 3:2 | DSLR photo quality |
| `social-media` | 1K | 1:1 | Instagram/Facebook posts |
| `social-story` | 1K | 9:16 | Stories/Reels/TikTok |
| `product` | 2K | 1:1 | Studio product shots |
| `banner` | 2K | 21:9 | Website hero/banner |
| `thumbnail` | 1K | 16:9 | YouTube thumbnails |
| `illustration` | 2K | 1:1 | Digital art/illustration |
| `cinematic` | 4K | 21:9 | Film stills |

## Prompting Tips

- **Be specific:** Subject + style + lighting + composition
- **Front-load** the most important details
- **Camera/lens references** for photorealism: "shot on Canon EOS R5, 85mm f/1.4"
- **Art style keywords** for illustrations: "watercolor", "vector", "oil painting"
- **Use presets** to auto-enhance prompts with style cues
- **2K or 4K** for legible text in images

## Troubleshooting

### "API key not valid"
Make sure `~/.claude/.env` contains your actual API key string (starts with `AIza...`):
```
# Correct
GOOGLE_API_KEY=AIzaSyB...

# Wrong — this is a file path, not a key
GOOGLE_API_KEY=my-service-account.json
```
Get your key from [Google AI Studio](https://aistudio.google.com/apikey).

### "uv: command not found"
Install uv: `brew install uv`

### Dependencies fail to install
The script uses uv's inline dependency metadata. Make sure you're running with `uv run`, not `python` directly.

## File Structure

```
nano-banana-pro/
├── SKILL.md              # Skill definition (triggers, description, instructions)
├── README.md             # This file
└── scripts/
    ├── generate_image.py # Main generation CLI
    └── Presets.json      # Preset configurations
```

## License

MIT
