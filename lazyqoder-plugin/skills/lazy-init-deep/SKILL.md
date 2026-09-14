---
name: lazy-init-deep
version: 1.0.0
description: "Generate hierarchical project memory for the Qoder IDE workspace. Inspects repo structure, identifies language/runtime/test/build commands, generates .lazyqoder/context/ knowledge base. Maps to Qoder IDE RepoWiki (auto, always-synced code wiki)."
user-invocable: true
---

# init-deep

> **Maps to Qoder IDE:** RepoWiki (auto, always-synced code wiki) + a `qoder-init-deep` skill/rule.

> **earlier host implementation source:** `local project documentation`

## Purpose

Generate hierarchical project memory for the current Qoder IDE workspace. Scores directories by complexity (file count, subdir count, code ratio, symbol density, reference centrality), generates `qoder.md` at root and subdirectory variants where warranted, and produces a `.lazyqoder/context/` knowledge base for future agents.

## Trigger Conditions

- User types `/lazyqoder:qoder-init-deep` in a Qoder IDE-installed plugin, or requests project initialization in natural language
- New workspace where no `qoder.md` exists
- Workspace structure has changed significantly
- User says "understand this codebase", "map this project", "create project memory"

## Required Context

Before generating, inspect:
- `qoder.md` if it already exists (update mode)
- Root directory structure (`ls -la`, `find` for file counts)
- `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, or equivalent project manifest
- Existing docs, README files, CONTRIBUTING files
- Test directories and test runner configuration
- CI/CD configuration (`.github/workflows/`, `Makefile`, etc.)

## Mandatory plugin load check

Before any repository discovery, resolve the plugin root and run:

```bash
PLUGIN_ROOT="${QODER_PLUGIN_ROOT:-}"
if [ -z "$PLUGIN_ROOT" ] && [ -f "$PWD/lazyqoder-plugin/scripts/lazyqoder-load-check.sh" ]; then
  PLUGIN_ROOT="$PWD/lazyqoder-plugin"       # copied repository root
elif [ -z "$PLUGIN_ROOT" ] && [ -f "$PWD/scripts/lazyqoder-load-check.sh" ]; then
  PLUGIN_ROOT="$PWD"                        # plugin root itself
fi
if [ -z "$PLUGIN_ROOT" ]; then
  echo "LazyQoder plugin root is unavailable; reopen the copied repository or install the plugin." >&2
  exit 1
fi
bash "$PLUGIN_ROOT/scripts/lazyqoder-load-check.sh"
```

This is required every time `qoder-init-deep` is invoked, including an existing workspace. It works without `QODER_PLUGIN_ROOT` when invoked from the copied repository root or plugin root; elsewhere it fails clearly instead of expanding to `/scripts/...`. With no override, it tries only those two documented copied-repository/plugin-root layouts: it does not search parents, siblings, marketplaces, or the filesystem.

### Sibling-plugin checkout from an unrelated workspace

If this workspace is unrelated to a separately checked-out sibling plugin, use the plugin's **absolute** path explicitly. For example:

```bash
QODER_PLUGIN_ROOT="/absolute/path/to/lazyqoder-plugin" \
  bash "/absolute/path/to/lazyqoder-plugin/scripts/lazyqoder-load-check.sh"
```

Expected successful output includes `PACKAGE_READINESS=full`. Do not replace the absolute path with a parent or sibling search; without the override, only the two local layouts above are tried and the unavailable-root diagnostic is the expected result from an unrelated workspace.

Run the load check first, then verify its reported skills, commands, agents, hooks, and MCP declarations before repository discovery. Record the observed package inventory in the final report. If it fails, reload or reinstall the plugin and re-run the check before continuing. Do not claim project memory initialization is complete while the plugin load check fails.

### InitDeep readiness evidence

The load check is package readiness only: it does not prove a live host session or MCP connection. Do not enable optional capabilities, select a provider, initialize optional architecture tooling, export MCP configuration, or change optional capability state as part of InitDeep. Those actions require a separate explicit user request.

Record observed, not inferred, readiness evidence in the completion report with these exact fields:

```text
readiness_result: {load-check result}
readiness_host: {host/package readiness boundary}
capability_statuses: {observed read-only status summary}
optional_policy: {unchanged unless separately explicitly requested}
receipt_state: {observed receipt/ownership state or not inspected}
evidence_paths: {load-check output and inspected package paths}
```

## Tool Access

This skill is **read-only** — it never modifies product code.
- Allowed: Read, Glob, Grep, Bash (read-only analysis commands), WebSearch
- Disallowed: Write, Edit (on product paths)

## Step-by-Step Procedure

### Phase 1: Discovery + Analysis (concurrent)

1. **Confirm plugin readiness.** Run the mandatory plugin load check above and report its observed counts before mapping the workspace.

2. **Fire exploration in parallel.** Spawn subagents (Qoder IDE Agent tool) to map structure, entry points, conventions, anti-patterns, build/CI, and test patterns. Use `isolation: true` (no parent history) for each.

3. **While subagents run**, in the main session:
   - Run structural analysis: `find . -type d` for directory depth, `find . -type f` for file counts, code concentration by extension
   - Read existing `qoder.md` if present
   - Check for LSP diagnostics on key files

4. **Collect subagent results.** Merge bash analysis + subagent findings.

### Phase 2: Scoring & Location Decision

Score each significant directory using this matrix:

| Factor | Weight | High Threshold |
|--------|--------|----------------|
| File count | 3x | >20 |
| Subdir count | 2x | >5 |
| Code ratio | 2x | >70% |
| Unique patterns | 1x | Own config |
| Module boundary | 2x | Has index file |
| Symbol density | 2x | >30 symbols |

- Score >15: create `qoder.md` variant in that directory
- Score 8-15: create if distinct domain
- Score <8: skip (parent covers)
- Root: ALWAYS create

### Phase 3: Generate qoder.md

Write root `qoder.md` with:
- **OVERVIEW:** 1-2 sentence project summary + core stack
- **STRUCTURE:** Directory tree with non-obvious purposes
- **WHERE TO LOOK:** Task → location → notes mapping
- **CONVENTIONS:** Only deviations from standard
- **ANTI-PATTERNS:** Explicitly forbidden in this project
- **COMMANDS:** dev/test/build commands

Quality gates: 50-150 lines, no generic advice, no obvious info.

### Phase 4: Generate context knowledge base

Write to `.lazyqoder/context/`:
- `index.md` — structured project overview
- `commands.json` — discovered dev/test/build/lint commands
- `project-map.json` — directory → purpose, language, complexity score mapping

### Phase 5: Review & Deduplicate

- Remove generic advice from all generated files
- Remove parent duplicates from subdirectory variants
- Trim to size limits
- Verify telegraphic style

### Phase 6: Create the consumer compatibility pointer

After generating or updating `qoder.md`, explicitly invoke the consumer helper once:

```bash
CWD="$PWD" QODER_PLUGIN_ROOT="$PLUGIN_ROOT" \
  bash "$PLUGIN_ROOT/scripts/ensure-consumer-agents.sh"
```

The helper creates `AGENTS.md` only when it is absent and reports `AGENTS_STATUS=created`; it preserves an existing regular `AGENTS.md` byte-for-byte and reports `AGENTS_STATUS=preserved`. Do not merge, overwrite, or manually edit an existing `AGENTS.md`. Include the observed created/preserved status in the completion report.

## Expected Output Artifacts

- `qoder.md` at root (50-150 lines, quality-gate passing)
- Subdirectory `qoder.md` variants where score warrants
- `.lazyqoder/context/index.md`
- `.lazyqoder/context/commands.json`
- `.lazyqoder/context/project-map.json`

## Verification Gates

1. `qoder.md` exists and is 50-150 lines
2. No generic filler content (tested by checking for common phrases)
3. Hierarchy is correct (child does not repeat parent)
4. `.lazyqoder/context/` files exist and are parseable
5. Consumer helper completed after `qoder.md` generation, with its created/preserved result recorded

## Failure Behavior

- If repo is too large for single-pass: document the gap and recommend `--max-depth=N`
- If no project manifest found: note in generated files that stack was inferred
- If scoring produces no subdirectory variants: that is valid — only root is mandatory

## Handoff Format

After completion, report:
```
=== init-deep Complete ===
Mode: {update | create-new}
Plugin load check: {PASS | repaired then PASS}
Files:
  [OK] ./qoder.md (root, {N} lines)
Dirs Analyzed: {N}
qoder.md Created: {N}
qoder.md Updated: {N}
Consumer AGENTS.md: {created | preserved}
readiness_result: {load-check result}
readiness_host: {package readiness only; live host/MCP connection not proven}
capability_statuses: {observed read-only status summary}
optional_policy: {unchanged unless separately explicitly requested}
receipt_state: {observed receipt/ownership state or not inspected}
evidence_paths: {load-check output and inspected package paths}
Hierarchy:
  ./qoder.md
  └── src/.../qoder.md
```

## Qoder IDE-Native Features

- **Subagent spawning:** Use Qoder IDE Agent tool for parallel exploration with `isolation: true` (matching earlier host implementation `fork_context: false`)
- **Skills:** Self-referencing — this is itself a Qoder IDE Skill
- **Project memory:** Writes to `qoder.md` (Qoder IDE-native project memory format)
- **`.lazyqoder/`:** Context knowledge base goes in the run state directory
- **Load status:** `lazyqoder-load-check.sh` must pass before repository discovery

---

_Adapted from earlier host implementation init-deep. All semantics preserved; paths adapted to Qoder IDE conventions. `multi_agent_v1.spawn_agent` → Qoder IDE Agent tool; `AGENTS.md` → `qoder.md`; `.lazyqoder/` → `.lazyqoder/`._
