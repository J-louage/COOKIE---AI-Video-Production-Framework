#!/usr/bin/env bash
# COOKIE Framework — Interactive Setup Script
# Run from the project root: bash cookie-setup.sh

set -euo pipefail

# ──────────────────────────────────────────────
# Colors
# ──────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────
info()    { printf "${BLUE}ℹ${NC}  %s\n" "$1"; }
success() { printf "${GREEN}✓${NC}  %s\n" "$1"; }
warn()    { printf "${YELLOW}⚠${NC}  %s\n" "$1"; }
fail()    { printf "${RED}✗${NC}  %s\n" "$1"; }

# ──────────────────────────────────────────────
# Welcome
# ──────────────────────────────────────────────
echo ""
printf "${BOLD}${CYAN}"
cat << 'BANNER'
   _____ ____   ____  _  _______ ______
  / ____/ __ \ / __ \| |/ /_   _|  ____|
 | |   | |  | | |  | | ' /  | | | |__
 | |   | |  | | |  | |  <   | | |  __|
 | |___| |__| | |__| | . \ _| |_| |____
  \_____\____/ \____/|_|\_\_____|______|

  AI Video Production Framework
BANNER
printf "${NC}\n"
echo "  Setup Script v1.0"
echo "  ─────────────────────────────────────────"
echo ""

# ──────────────────────────────────────────────
# Verify project root
# ──────────────────────────────────────────────
if [[ ! -f "CLAUDE.md" ]] || [[ ! -d "_cookie" ]]; then
    fail "This script must be run from the COOKIE project root."
    echo "  Expected to find CLAUDE.md and _cookie/ in the current directory."
    echo "  Current directory: $(pwd)"
    exit 1
fi
success "Running from project root: $(pwd)"
echo ""

# ──────────────────────────────────────────────
# Check for updates
# ──────────────────────────────────────────────
if git rev-parse --is-inside-work-tree &>/dev/null; then
    printf "${BOLD}Check for updates${NC}\n\n"
    printf "  Would you like to pull the latest framework updates from the repository? (y/N): "
    read -r PULL_UPDATES </dev/tty
    echo ""
    if [[ "$PULL_UPDATES" =~ ^[Yy]$ ]]; then
        info "Fetching latest changes..."
        if git fetch origin 2>/dev/null; then
            LOCAL=$(git rev-parse HEAD 2>/dev/null)
            REMOTE=$(git rev-parse "@{u}" 2>/dev/null || echo "")
            if [[ -z "$REMOTE" ]]; then
                warn "No upstream branch configured — skipping update"
            elif [[ "$LOCAL" == "$REMOTE" ]]; then
                success "Already up to date!"
            else
                BEHIND=$(git rev-list --count HEAD.."@{u}" 2>/dev/null || echo "0")
                info "$BEHIND new commit(s) available — pulling..."
                # Stash any local changes (e.g. global.yaml edited by previous setup)
                STASHED=false
                if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
                    info "Stashing local changes before update..."
                    git stash push -m "cookie-setup: auto-stash before update" --quiet 2>/dev/null && STASHED=true
                fi
                if git pull --ff-only 2>/dev/null; then
                    success "Updated to latest version"
                else
                    warn "Could not fast-forward — you may have diverged from the remote"
                    info "Run 'git pull' manually to resolve"
                fi
                # Restore stashed changes
                if [[ "$STASHED" == true ]]; then
                    info "Restoring your local changes..."
                    if git stash pop --quiet 2>/dev/null; then
                        success "Local changes restored"
                    else
                        warn "Could not auto-restore — your changes are saved in 'git stash'"
                        info "Run 'git stash pop' after resolving any conflicts"
                    fi
                fi
            fi
        else
            warn "Could not reach remote — continuing with current version"
        fi
    else
        info "Skipping update check"
    fi
    echo ""
else
    info "Not a git repository — skipping update check"
    echo ""
fi

# ──────────────────────────────────────────────
# Dependency checks
# ──────────────────────────────────────────────
printf "${BOLD}Checking dependencies...${NC}\n\n"

MISSING=()

# Node.js >= 18
if command -v node &>/dev/null; then
    NODE_VERSION=$(node -v | sed 's/v//')
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
    if [[ "$NODE_MAJOR" -ge 18 ]]; then
        success "Node.js $NODE_VERSION"
    else
        fail "Node.js $NODE_VERSION (need >= 18)"
        MISSING+=("Node.js >= 18  →  https://nodejs.org/en/download")
    fi
else
    fail "Node.js not found"
    MISSING+=("Node.js >= 18  →  https://nodejs.org/en/download")
fi

# Python >= 3.10
if command -v python3 &>/dev/null; then
    PY_VERSION=$(python3 --version | awk '{print $2}')
    PY_MAJOR=$(echo "$PY_VERSION" | cut -d. -f1)
    PY_MINOR=$(echo "$PY_VERSION" | cut -d. -f2)
    if [[ "$PY_MAJOR" -ge 3 ]] && [[ "$PY_MINOR" -ge 10 ]]; then
        success "Python $PY_VERSION"
    else
        fail "Python $PY_VERSION (need >= 3.10)"
        MISSING+=("Python >= 3.10  →  https://www.python.org/downloads/")
    fi
else
    fail "Python 3 not found"
    MISSING+=("Python >= 3.10  →  https://www.python.org/downloads/")
fi

# uv
if command -v uv &>/dev/null; then
    UV_VERSION=$(uv --version 2>/dev/null | awk '{print $2}')
    success "uv $UV_VERSION"
else
    fail "uv not found"
    MISSING+=("uv  →  brew install uv  OR  curl -LsSf https://astral.sh/uv/install.sh | sh")
fi

# FFmpeg
if command -v ffmpeg &>/dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version 2>/dev/null | head -1 | awk '{print $3}')
    success "FFmpeg $FFMPEG_VERSION"
else
    fail "FFmpeg not found"
    MISSING+=("FFmpeg  →  brew install ffmpeg")
fi

# Claude Code CLI
if command -v claude &>/dev/null; then
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "installed")
    success "Claude Code CLI ($CLAUDE_VERSION)"
else
    fail "Claude Code CLI not found"
    MISSING+=("Claude Code  →  npm install -g @anthropic-ai/claude-code")
fi

echo ""

# Exit if missing dependencies
if [[ ${#MISSING[@]} -gt 0 ]]; then
    fail "Missing ${#MISSING[@]} dependency/dependencies. Please install:"
    echo ""
    for dep in "${MISSING[@]}"; do
        echo "  • $dep"
    done
    echo ""
    echo "After installing, re-run: bash cookie-setup.sh"
    exit 1
fi

success "All dependencies satisfied!"
echo ""

# ──────────────────────────────────────────────
# User name
# ──────────────────────────────────────────────
printf "${BOLD}Configuration${NC}\n\n"

GLOBAL_YAML="_cookie/_config/global.yaml"
CURRENT_NAME=$(grep 'user_name:' "$GLOBAL_YAML" | sed 's/.*user_name: *"//' | sed 's/".*//')

if [[ -n "$CURRENT_NAME" ]]; then
    info "Current user name: $CURRENT_NAME"
    printf "  Enter your name (press Enter to keep \"$CURRENT_NAME\"): "
    read -r USER_NAME </dev/tty
    if [[ -z "$USER_NAME" ]]; then
        USER_NAME="$CURRENT_NAME"
    fi
else
    printf "  Enter your name: "
    read -r USER_NAME </dev/tty
fi

if [[ -n "$USER_NAME" ]]; then
    sed -i.bak "s/user_name: \".*\"/user_name: \"$USER_NAME\"/" "$GLOBAL_YAML"
    rm -f "${GLOBAL_YAML}.bak"
    success "User name set to \"$USER_NAME\""
else
    warn "No user name set — you can set it later in $GLOBAL_YAML"
fi
echo ""

# ──────────────────────────────────────────────
# API Keys
# ──────────────────────────────────────────────
printf "${BOLD}API Keys${NC}\n\n"
info "Keys will be saved to ~/.claude/.env (Claude Code's environment file)"
echo ""

CLAUDE_ENV_DIR="$HOME/.claude"
CLAUDE_ENV_FILE="$CLAUDE_ENV_DIR/.env"

# Create dir if needed
mkdir -p "$CLAUDE_ENV_DIR"

# Load existing values if present
EXISTING_GOOGLE=""
EXISTING_ELEVEN=""
if [[ -f "$CLAUDE_ENV_FILE" ]]; then
    EXISTING_GOOGLE=$(grep '^GOOGLE_API_KEY=' "$CLAUDE_ENV_FILE" 2>/dev/null | cut -d= -f2- || true)
    EXISTING_ELEVEN=$(grep '^ELEVENLABS_API_KEY=' "$CLAUDE_ENV_FILE" 2>/dev/null | cut -d= -f2- || true)
fi

# Google API Key
if [[ -n "$EXISTING_GOOGLE" ]]; then
    info "Google API Key already configured"
    printf "  Replace existing key? (y/N): "
    read -r REPLACE_GOOGLE </dev/tty
    if [[ "$REPLACE_GOOGLE" =~ ^[Yy]$ ]]; then
        printf "  Google API Key (https://aistudio.google.com/apikey): "
        read -r GOOGLE_KEY </dev/tty
    else
        GOOGLE_KEY="$EXISTING_GOOGLE"
    fi
else
    printf "  Google API Key (https://aistudio.google.com/apikey): "
    read -r GOOGLE_KEY </dev/tty
fi

# ElevenLabs API Key
if [[ -n "$EXISTING_ELEVEN" ]]; then
    info "ElevenLabs API Key already configured"
    printf "  Replace existing key? (y/N): "
    read -r REPLACE_ELEVEN </dev/tty
    if [[ "$REPLACE_ELEVEN" =~ ^[Yy]$ ]]; then
        printf "  ElevenLabs API Key (https://elevenlabs.io): "
        read -r ELEVEN_KEY </dev/tty
    else
        ELEVEN_KEY="$EXISTING_ELEVEN"
    fi
else
    printf "  ElevenLabs API Key (https://elevenlabs.io): "
    read -r ELEVEN_KEY </dev/tty
fi

echo ""

# Write keys to ~/.claude/.env
# Preserve any existing lines that aren't our keys
if [[ -f "$CLAUDE_ENV_FILE" ]]; then
    # Remove old key lines, keep everything else
    grep -v '^GOOGLE_API_KEY=' "$CLAUDE_ENV_FILE" | grep -v '^ELEVENLABS_API_KEY=' > "${CLAUDE_ENV_FILE}.tmp" || true
    mv "${CLAUDE_ENV_FILE}.tmp" "$CLAUDE_ENV_FILE"
fi

# Append keys (only if non-empty)
if [[ -n "$GOOGLE_KEY" ]]; then
    echo "GOOGLE_API_KEY=$GOOGLE_KEY" >> "$CLAUDE_ENV_FILE"
    success "Google API Key saved"
else
    warn "Google API Key skipped — VEO/Gemini won't work without it"
fi

if [[ -n "$ELEVEN_KEY" ]]; then
    echo "ELEVENLABS_API_KEY=$ELEVEN_KEY" >> "$CLAUDE_ENV_FILE"
    success "ElevenLabs API Key saved"
else
    warn "ElevenLabs API Key skipped — narration won't work without it"
fi

echo ""

# ──────────────────────────────────────────────
# npm install for VEO skill
# ──────────────────────────────────────────────
printf "${BOLD}Installing VEO skill dependencies...${NC}\n\n"

VEO_DIR="_cookie/skills/veo"
if [[ -f "$VEO_DIR/package.json" ]]; then
    (cd "$VEO_DIR" && npm install --silent 2>/dev/null) && success "VEO skill dependencies installed" || warn "npm install failed in $VEO_DIR — you can run it manually later"
else
    warn "VEO skill package.json not found at $VEO_DIR — skipping"
fi

echo ""

# ──────────────────────────────────────────────
# Production Dashboard
# ──────────────────────────────────────────────
DASHBOARD_DIR="dashboard"
if [[ -f "$DASHBOARD_DIR/package.json" ]]; then
    printf "${BOLD}Production Dashboard${NC}\n\n"
    info "The COOKIE Dashboard is a web app for browsing your production data."
    echo ""
    printf "  Would you like to install and start the dashboard? (Y/n): "
    read -r INSTALL_DASHBOARD </dev/tty
    echo ""
    if [[ ! "$INSTALL_DASHBOARD" =~ ^[Nn]$ ]]; then
        # Install dependencies
        info "Installing dashboard dependencies..."
        if (cd "$DASHBOARD_DIR" && npm install --silent 2>/dev/null); then
            success "Dashboard dependencies installed"
        else
            warn "npm install failed in $DASHBOARD_DIR — you can run it manually later"
        fi

        # Create .env.local if missing
        if [[ ! -f "$DASHBOARD_DIR/.env.local" ]]; then
            echo "COOKIE_PROJECT_ROOT=.." > "$DASHBOARD_DIR/.env.local"
            success "Dashboard .env.local created"
        fi

        # Find an available port (default 3000, then try 3001-3009)
        DASHBOARD_PORT=3000
        for PORT_CANDIDATE in 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009; do
            if ! lsof -i ":$PORT_CANDIDATE" &>/dev/null; then
                DASHBOARD_PORT=$PORT_CANDIDATE
                break
            fi
        done

        # Start the dashboard in the background
        printf "  Would you like to start the dashboard now on port $DASHBOARD_PORT? (Y/n): "
        read -r START_DASHBOARD </dev/tty
        echo ""
        if [[ ! "$START_DASHBOARD" =~ ^[Nn]$ ]]; then
            info "Starting dashboard on port $DASHBOARD_PORT..."
            (cd "$DASHBOARD_DIR" && PORT=$DASHBOARD_PORT npm run dev &>/dev/null &)
            DASHBOARD_PID=$!
            sleep 3
            if kill -0 $DASHBOARD_PID 2>/dev/null; then
                success "Dashboard running at http://localhost:$DASHBOARD_PORT"
                info "The dashboard runs in the background. To stop it: kill $DASHBOARD_PID"
                # Save PID for reference
                echo "$DASHBOARD_PID" > "$DASHBOARD_DIR/.dashboard.pid"
            else
                warn "Dashboard failed to start — run it manually: cd dashboard && npm run dev"
            fi
        else
            info "Skipping dashboard start"
            echo ""
            info "To start it later:"
            printf "       ${CYAN}cd dashboard && npm run dev${NC}\n"
        fi
    else
        info "Skipping dashboard installation"
    fi
    echo ""
else
    info "Dashboard not found — skipping"
    echo ""
fi

# ──────────────────────────────────────────────
# Success
# ──────────────────────────────────────────────
printf "${BOLD}${GREEN}"
cat << 'DONE'
  ╔══════════════════════════════════════╗
  ║     Setup complete!                  ║
  ╚══════════════════════════════════════╝
DONE
printf "${NC}\n"

echo "  Next steps:"
echo ""
echo "    1. Open this project in Claude Code:"
printf "       ${CYAN}claude${NC}\n"
echo ""
echo "    2. Start the framework:"
printf "       ${CYAN}/cookie-director${NC}\n"
echo ""
echo "    3. Or jump straight to making a video:"
printf "       ${CYAN}/cookie-quick-video${NC}\n"
echo ""
if [[ -f "$DASHBOARD_DIR/package.json" ]]; then
echo "    4. View your production dashboard:"
printf "       ${CYAN}cd dashboard && npm run dev${NC}\n"
echo ""
fi
echo "  Run /cookie-help inside Claude Code for all available commands."
echo ""
