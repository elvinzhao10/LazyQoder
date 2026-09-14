---
description: "Generate hierarchical project memory for the current Qoder IDE workspace. Inspects repo structure, identifies language/runtime/test/build commands, scores directories by complexity, generates qoder.md at root and subdirectory variants, and produces a .lazyqoder/context/ knowledge base."
---

# /lazyqoder:lazy-init-deep

Generate hierarchical project memory. Scores directories by complexity, produces `qoder.md` at root and subdirectory variants, and writes a `.lazyqoder/context/` knowledge base for future agents.

## Qoder IDE mapping

LazyQoder's hierarchical memory primitive maps to **Qoder IDE RepoWiki** (auto, always-synced code wiki). The `lazy-init-deep` skill/rule layers a writable `qoder.md` project-memory tree on top of the read-only RepoWiki, so agents get both auto-synced structural context and curated intent/decision context.

## Usage

```
/lazyqoder:lazy-init-deep [--create-new] [--max-depth=N]
```

## Inputs

- Current workspace directory tree
- Project manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.)
- Existing `qoder.md` if present (update mode)
- CI/CD configuration, test directories, existing docs

## Outputs

- `qoder.md` at root (50-150 lines, quality-gate passing)
- Subdirectory `qoder.md` variants where complexity score warrants
- `.lazyqoder/context/index.md` — structured project overview
- `.lazyqoder/context/commands.json` — discovered dev/test/build/lint commands
- `.lazyqoder/context/project-map.json` — directory-to-purpose mapping
- Plugin load-check result. Resolve it safely before discovery:
  ```bash
  PLUGIN_ROOT="${QODER_PLUGIN_ROOT:-}"
  if [ -z "$PLUGIN_ROOT" ] && [ -f "$PWD/lazyqoder-plugin/scripts/lazyqoder-load-check.sh" ]; then
    PLUGIN_ROOT="$PWD/lazyqoder-plugin"
  elif [ -z "$PLUGIN_ROOT" ] && [ -f "$PWD/scripts/lazyqoder-load-check.sh" ]; then
    PLUGIN_ROOT="$PWD"
  fi
  [ -n "$PLUGIN_ROOT" ] || { echo "LazyQoder plugin root is unavailable; reopen the copied repository or install the plugin." >&2; exit 1; }
  bash "$PLUGIN_ROOT/scripts/lazyqoder-load-check.sh"
  ```
- From an unrelated workspace that uses a separately checked-out sibling plugin, provide its **absolute** path explicitly:
  ```bash
  QODER_PLUGIN_ROOT="/absolute/path/to/lazyqoder-plugin" \
    bash "/absolute/path/to/lazyqoder-plugin/scripts/lazyqoder-load-check.sh"
  ```
  A successful check reports `PACKAGE_READINESS=full`. With no override, the resolver tries only the documented copied-repository and plugin-root layouts above; it does not search parents, siblings, marketplaces, or the filesystem. An unrelated workspace therefore reports that the plugin root is unavailable.
- InitDeep readiness evidence. Run the load check first, then verify its reported skills, commands, agents, hooks, and MCP declarations. This is package readiness only and does not prove a live host session or MCP connection. Do not enable optional capabilities, select providers, initialize optional architecture tooling, or export MCP configuration without a separate explicit user request. Record these exact fields in the completion report:
  ```text
  readiness_result: {load-check result}
  readiness_host: {package readiness boundary}
  capability_statuses: {observed read-only status summary}
  optional_policy: {unchanged unless separately explicitly requested}
  receipt_state: {observed receipt/ownership state or not inspected}
  evidence_paths: {load-check output and inspected package paths}
  ```
- Consumer compatibility pointer. After generating or updating `qoder.md`, explicitly run:
  ```bash
  CWD="$PWD" QODER_PLUGIN_ROOT="$PLUGIN_ROOT" \
    bash "$PLUGIN_ROOT/scripts/ensure-consumer-agents.sh"
  ```
  Record whether the helper reports `AGENTS_STATUS=created` or `AGENTS_STATUS=preserved`. It never merges or overwrites an existing `AGENTS.md`.

## Success Criteria

1. Root `qoder.md` exists and is 50-150 lines
2. No generic filler content
3. Hierarchy is correct (child does not repeat parent)
4. `.lazyqoder/context/` files exist and are parseable
5. Plugin load check passes before discovery and is included in the completion report. With no `QODER_PLUGIN_ROOT`, only the copied repository root or plugin root layouts are tried; an unrelated workspace fails clearly.
6. The post-`qoder.md` consumer helper reports `AGENTS_STATUS=created` or `AGENTS_STATUS=preserved`.

## Constitution

This command is governed by its package-local skill contract below.

Do not claim completion without verification.

## Skill

See `../skills/lazy-init-deep/SKILL.md` for the full workflow logic, phase-by-phase procedure, scoring matrix, and verification gates.
