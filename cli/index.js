#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// ──────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────
const REPO_URL =
  "https://github.com/J-louage/COOKIE---AI-Video-Production-Framework.git";
const DEFAULT_NAME = "cookie-project";

// ──────────────────────────────────────────────
// Colors (basic ANSI)
// ──────────────────────────────────────────────
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;

// ──────────────────────────────────────────────
// Parse args
// ──────────────────────────────────────────────
const projectName = process.argv[2] || DEFAULT_NAME;
const targetDir = path.resolve(process.cwd(), projectName);

console.log("");
console.log(bold(cyan("  COOKIE — AI Video Production Framework")));
console.log("");

// ──────────────────────────────────────────────
// Pre-checks
// ──────────────────────────────────────────────

// Check git is available
try {
  execSync("git --version", { stdio: "ignore" });
} catch {
  console.error(red("Error: git is not installed."));
  console.error("Install git: https://git-scm.com/downloads");
  process.exit(1);
}

// Check target directory doesn't exist
if (fs.existsSync(targetDir)) {
  console.error(red(`Error: Directory "${projectName}" already exists.`));
  console.error("Choose a different name or remove the existing directory.");
  process.exit(1);
}

// ──────────────────────────────────────────────
// Clone
// ──────────────────────────────────────────────
console.log(`  Cloning into ${bold(projectName)}...`);
console.log("");

try {
  execSync(`git clone "${REPO_URL}" "${targetDir}"`, {
    stdio: "inherit",
  });
} catch {
  console.error("");
  console.error(red("Error: Failed to clone the repository."));
  console.error("Check your internet connection and try again.");
  process.exit(1);
}

// ──────────────────────────────────────────────
// Remove .git (fresh start, not a fork)
// ──────────────────────────────────────────────
const gitDir = path.join(targetDir, ".git");
if (fs.existsSync(gitDir)) {
  fs.rmSync(gitDir, { recursive: true, force: true });
}

// Initialize a fresh git repo based on upstream history
// This ensures cookie-setup.sh can fast-forward future updates
try {
  execSync("git init", { cwd: targetDir, stdio: "ignore" });
  execSync(`git remote add cookie-upstream "${REPO_URL}"`, {
    cwd: targetDir,
    stdio: "ignore",
  });
  // Fetch upstream history and reset to it so we share a common ancestor
  execSync("git fetch cookie-upstream main", {
    cwd: targetDir,
    stdio: "ignore",
  });
  execSync("git reset cookie-upstream/main", {
    cwd: targetDir,
    stdio: "ignore",
  });
  execSync("git add -A", { cwd: targetDir, stdio: "ignore" });
  execSync('git commit -m "Initial project from COOKIE framework"', {
    cwd: targetDir,
    stdio: "ignore",
  });
} catch {
  // Non-fatal — user can init later
}

console.log("");
console.log(green("  Project scaffolded successfully!"));
console.log("");

// ──────────────────────────────────────────────
// Run setup script
// ──────────────────────────────────────────────
const setupScript = path.join(targetDir, "cookie-setup.sh");

if (fs.existsSync(setupScript)) {
  console.log("  Running interactive setup...");
  console.log("");

  try {
    execSync(`bash "${setupScript}"`, {
      cwd: targetDir,
      stdio: "inherit",
    });
  } catch {
    console.error("");
    console.error(
      red("  Setup script encountered an error. You can re-run it manually:")
    );
    console.error(`  cd ${projectName} && bash cookie-setup.sh`);
    console.error("");
  }
} else {
  console.log("  Setup script not found — skipping interactive setup.");
  console.log(`  You can configure manually in ${projectName}/`);
}

// ──────────────────────────────────────────────
// Done
// ──────────────────────────────────────────────
console.log("");
console.log(bold(green("  Your COOKIE project is ready!")));
console.log("");
console.log(`  ${bold("cd")} ${projectName}`);
console.log(`  ${bold("claude")}`);
console.log("");
console.log(`  Then run ${cyan("/cookie-director")} to get started.`);
console.log("");
