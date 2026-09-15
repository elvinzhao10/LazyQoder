# Changelog

## v1.2.3 — Platform compatibility patch port (2026-09-15)

- Ported the LazyBuddy/LazyTrae v1.2.3 platform compatibility wave:
  MCP declaration validation (typed errors, spaces supported), actionable
  setup/load-check output, plan-format compatibility (`## TODOs` and legacy
  `## Todos`), zero-task plan failure with actionable errors, and the
  v1.2.3 supported-route documentation boundary.
- All package versions, contracts, and schemas bumped to 1.2.3.

## v1.2.2 — Full family parity port (2026-09-14, historical)

- Historical: brought LazyQoder to feature parity with LazyBuddy/LazyTrae v1.2.2
  (both released 2026-09-05): 44 contracts + 64 fixtures, 25-hook surface
  with lifecycle-event.js, 6-server MCP manifest with profile gating,
  113-script lifecycle/ subsystem, adaptive tooling family, v1.2.x docs
  (migration guides, supported routes, release notes), and the compact
  TASK/DELTA/REFS/VERIFY dispatch semantics in start-work/review-work.
- Manifest migrated to the officially documented `.qoder-plugin/plugin.json`
  location; previous version 1.2.2.
- Commands 14 → 17 (ported Trae's handoff, ralph-loop, stop-continuation).
- 3 agents gained the previous v1.2.2 fields (model/effort/maxTurns/memory/isolation).
- qoder-ide-surface adapters renamed for the documented Qoder CLI
  (`qodercli`); host-gated and not executed at package-check time.
- Package readiness only: host registration, runtime loading, and MCP
  connection remain host-owned and unobserved.

All notable changes to LazyQoder are documented here. Versions follow
[Semantic Versioning](https://semver.org/). The project is currently
unpublished (0.0.x line).

## [0.0.1] - 2026-07-19

Initial development build of the LazySeries workflow harness for Qoder IDE.
Not yet published to any marketplace.

### Added

- 19 `lazy-` skills, 14 `lazy-` commands, 13 `lazyqoder-` agents, 12 hook
  events, and 8 local MCP server declarations (`run-ledger`, `verification`,
  `status-dashboard`, `context-graph`, `code-intel`, `docs`, `codegraph`,
  `lsp`).
- Qoder IDE host entry point at `lazyqoder-plugin/.qoder/plugin.json`.
- Qoder IDE capability mapping (RepoWiki, Quest, Agent mode + Subagents, Expert
  teams, Model selector, Agent-mode MCP) in `qoder-ide-integration.md`.
- Onboard/offboard guidance in `AGENTS.md`.
- 5 skills ported from LazyTrae: `lazy-ast-grep`, `lazy-coding-agent-sessions`,
  `lazy-frontend`, `lazy-report-bug`, `lazy-refactor`.

### Changed

- Renamed all references from "Qoder CN" to "Qoder IDE" (product rename).
- Repo root cleaned: all source consolidated into `lazyqoder-plugin/` (aligned
  with sibling ports LazyBuddy/LazyTrae).
- Read-only agents (explorer, reviewer, security-auditor, gate-reviewer,
  verifier) have `Bash` removed for native tool-boundary enforcement.

### Fixed

- MCP `CWD` env var missing in `.mcp.json`.
- Verification `discover_checks` returned raw array → wrapped in `{"checks": [...]}`.
- Scripts missing execute permissions.
- Subagent `model:` fields used invalid identifiers → removed (inherit session model).

### Verification

- `bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh` → `PACKAGE_READINESS=full`
- `bash lazyqoder-plugin/scripts/lazyqoder-plugin-doctor.sh` → 64/64 pass
