# T1 — Context-Sensitive Help Router

> **Task ID:** T1
> **File:** `_cookie/core/tasks/help.md`
> **Invocation:** `<invoke-task>help</invoke-task>` or `/cookie-help`
> **Priority:** P2
> **Phase:** Any

---

## Purpose

Provides context-sensitive help routing for the COOKIE framework. Reads help databases, resolves commands, agents, workflows, skills, and tasks, then presents grouped and filtered results to the user.

---

## Data Sources

| Source | Path | Description |
|--------|------|-------------|
| Global help DB | `_config/cookie-help.csv` | Master command/topic lookup table |
| Module help DBs | `{module}/module-help.csv` | Per-module help entries (core, production, composition, creative) |
| Agent manifest | `_cookie/manifests/agent-manifest.csv` | All 13 registered agents |
| Task manifest | `_cookie/manifests/task-manifest.csv` | All 10 registered tasks |
| Skill manifest | `_cookie/manifests/skill-manifest.csv` | All 8 registered skills |
| Slash commands | `.claude/commands/*.md` | All registered slash commands |
| Workflows | `_cookie/**/workflow.yaml` | All workflow definitions |

---

## Help Modes

### Mode 1: General Help

**Trigger:** `/cookie-help` with no arguments, or queries like "help", "overview", "commands"

**Display:**

```
COOKIE -- Cinematic Output Orchestration with Kinetic Intelligence Engine
Version: {from global.yaml: framework_version}

PRODUCTION PHASES
-----------------
Phase 1 -- Ideation           Scripts, concepts, story structure
Phase 2 -- Pre-Production     Characters, style guides, scene specs, prompts
Phase 3 -- Asset Generation   Video clips, images, narration, music, SFX
Phase 4 -- Composition        Remotion assembly, audio sync, text overlays
Phase 5 -- Post-Production    Final render, multi-format export, QA

AGENTS ({count from agent-manifest.csv} total)
----------------------------------------------
{For each agent, grouped by module:}
  [{module}] {persona_name} ({agent_id}) -- {role}

AVAILABLE WORKFLOWS
-------------------
{For each workflow, grouped by phase:}
  Phase {N}: {workflow_name} -- {description}

SLASH COMMANDS
--------------
{For each command from cookie-help.csv:}
  /{command}  {description}

TASKS
-----
{For each task from task-manifest.csv:}
  T{N} {task_name} -- {description}

Type "/cookie-help <topic>" for detailed help.
Valid topics: phase:<name>, command:<name>, agent:<name>, skill:<name>, task:<name>
```

### Mode 2: Phase-Specific Help

**Trigger:** `/cookie-help phase:<phase_name>`

**Phase name mapping:**
- "1", "ideation" -> Phase 1 -- Ideation
- "2", "pre-production", "pre-prod" -> Phase 2 -- Pre-Production
- "3", "asset-generation", "assets", "generation", "production" -> Phase 3 -- Asset Generation
- "4", "composition", "assembly" -> Phase 4 -- Composition
- "5", "post-production", "post-prod", "delivery", "export" -> Phase 5 -- Post-Production

**Process:**
1. Filter workflows from workflow manifests where phase matches the query
2. Filter agents that operate in this phase
3. Filter tasks commonly invoked during this phase
4. Present all grouped together

**Display:**

```
Phase {N} -- {Phase Name}
=========================

WORKFLOWS IN THIS PHASE
------------------------
{For each workflow in this phase:}
  {workflow_name}
    Agent: {agent}
    Command: /cookie-{command}
    Description: {description}

AGENTS ACTIVE IN THIS PHASE
----------------------------
{For each agent that operates in this phase:}
  {persona_name} ({agent_id}) -- {role}

TASKS FOR THIS PHASE
---------------------
{For each task relevant to this phase:}
  T{N} {task_name} -- {description}
```

### Mode 3: Command-Specific Help

**Trigger:** `/cookie-help command:<command_name>`

**Process:**
1. Strip `/cookie-` prefix and `/` if present from the query
2. Search `_config/cookie-help.csv` for exact match on command column
3. If not found, search all `module-help.csv` files
4. If still not found, try fuzzy match (starts-with)
5. If no match at all, show suggestions

**Display:**

```
/cookie-{command}
=================
Description: {description}
Module:      {module}
Phase:       {phase}
Target:      {target_file}

USAGE
-----
  /cookie-{command}

WHAT IT DOES
------------
{Read the target_file description/frontmatter and summarize}

PREREQUISITES
-------------
{List any quality gates or required prior workflows}

RELATED COMMANDS
----------------
{List other commands in the same phase or module}
```

### Mode 4: Agent-Specific Help

**Trigger:** `/cookie-help agent:<agent_name>`

**Process:**
1. Read `_cookie/manifests/agent-manifest.csv`
2. Match by agent_id or persona_name (case-insensitive)
3. Read the agent's system prompt file for detailed capabilities

**Display:**

```
{persona_name} -- {role}
========================
Module:    {module}
Agent ID:  {agent_id}
Phase:     {phase}
Priority:  {priority}

PRIMARY TOOLS / SKILLS
----------------------
{primary_tools from manifest, listed with descriptions}

WORKFLOWS
---------
{All workflows where this agent is listed}

SLASH COMMANDS
--------------
{Commands that invoke this agent}

MEMORY
------
{If agent has a sidecar: "_memory/{agent}-sidecar/"}
{If no sidecar: "Stateless -- no persistent memory"}

COMMUNICATION STYLE
--------------------
{Brief summary from agent persona description}
```

### Mode 5: Skill-Specific Help

**Trigger:** `/cookie-help skill:<skill_name>`

**Process:**
1. Read `_cookie/manifests/skill-manifest.csv`
2. Match by skill_id or name (case-insensitive)
3. Read SKILL.md from the skill directory if it exists

**Display:**

```
{skill_name} Skill
===================
Skill ID:   {skill_id}
Directory:  _cookie/skills/{skill_id}/
SKILL.md:   _cookie/skills/{skill_id}/SKILL.md

USED BY AGENTS
--------------
{used_by list from skill-manifest.csv}

CAPABILITIES
------------
{Summarize from SKILL.md if it exists}

PRICING
-------
{Look up this tool in _config/pricing.yaml and show current rates}

KEY FILES
---------
{List all files in the skill directory}
```

### Mode 6: Task-Specific Help

**Trigger:** `/cookie-help task:<task_name>`

**Process:**
1. Read `_cookie/manifests/task-manifest.csv`
2. Match by task_id (T1-T10) or task name

**Display:**

```
Task: {task_name} (T{N})
========================
File:       _cookie/core/tasks/{filename}
Invocation: <invoke-task>{task_name}</invoke-task>
Priority:   {priority}

DESCRIPTION
-----------
{description from manifest}

INPUTS
------
{Summarize expected inputs from the task file}

OUTPUTS
-------
{Summarize expected outputs from the task file}

INVOKED BY
----------
{Which workflows/agents call this task}
```

---

## Lookup Algorithm

```
1. Parse the help query to determine mode and target
2. Detect mode from prefix pattern:
   - "phase:" -> Mode 2
   - "command:" -> Mode 3
   - "agent:" -> Mode 4
   - "skill:" -> Mode 5
   - "task:" -> Mode 6
   - No prefix or empty -> Mode 1 (general)
3. Load the appropriate data source(s)
4. If target lookup:
   a. Exact match first
   b. Fuzzy match (starts-with) if no exact match
   c. Search descriptions if still no match
   d. Return "not found" with suggestions if nothing matches
5. Group output by module and phase where applicable
6. Format output in structured markdown
7. Always include a "Related" section with contextual links
```

---

## CSV Format Reference

### cookie-help.csv columns
```
command,description,module,phase,target_file
```

### module-help.csv columns
```
command,description,parameters,examples,related
```

### agent-manifest.csv columns
```
agent_id,persona_name,module,role,primary_tools,priority
```

### task-manifest.csv columns
```
task_id,name,file,description,priority
```

### skill-manifest.csv columns
```
skill_id,name,directory,description,used_by
```

---

## Output Format

All help output is rendered as structured plain text with:
- Header lines using `=` and `-` underlines for sections
- Aligned columns for tabular data
- Indented sub-items for hierarchical information
- Blank lines between major sections

---

## Error Handling

| Condition | Response |
|-----------|----------|
| No query provided | Show general help (Mode 1) |
| Unknown mode prefix | Show general help with note about valid modes |
| Target not found (exact) | Try fuzzy match, show up to 5 closest suggestions |
| Target not found (fuzzy) | Show "not found" with list of all available targets in that category |
| Missing `cookie-help.csv` | Show minimal built-in help with module structure; suggest `/cookie-validate-framework` |
| Missing `module-help.csv` | Skip that module in output, note it as missing |
| Missing manifest CSV | Note it as missing; suggest running framework setup |
| Referenced `target_file` does not exist | Mark command as `[NOT IMPLEMENTED]` in output |
| Malformed CSV | Warn user, skip malformed entries, continue with valid ones |
