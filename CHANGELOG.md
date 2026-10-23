# Changelog

## [1.4.0] - 2026-10-19 — completion pass (isolation, rescan, repin)

Complete the 1.4.0 surfaces on the Qoder side: the family-wide per-repo store isolation and foreign-runtime refusal matrix (2992f03); the reconciled served-project truth stating the live git view explicitly (`/api/project/git`, 200 behind the session, vendored local collector; run-side links stay `repo_head`/`content_revision`) (6fbaa7f); the conservative Qoder rescan outcome — capability observations refreshed, no unobserved capability claimed (e6de762); and the family repin at source revision `bb696092` — dashboard tree `e55a9c00…`, project tree `16561f3…` — carrying the family's completed project-dashboard UI (dark-first tokens v2, de-tabbed sidebar shell with in-place navigation, six redesigned views, navigation guards, held performance budgets) into this package byte-identically (b03e345). Host embedding, chat handoff, and wake stay unobserved; host readiness stays pending; the known wall-clock telemetry flake is pre-existing. See RELEASE_NOTES.md "Completion pass (2026-10-19)".

## [1.4.0] - 2026-10-07 — project platform

Adopt the family's persistent project platform through the Qoder-native adapter: the vendored `lazyqoder-plugin/shared/project/` family re-pins to tree `1feb5646…` (source revision `537f393`; its README no longer links files the family selection excludes and its CLI entry guard resolves symlinked invocation paths instead of silently no-oping), while Qoder's journal/CAS authority, bridges, and native identity remain the owning surfaces. Harden honesty assertions in the project-adapter suite: journal-derived observation payloads assert `role` stays `unreported` at both sites, and the capability record asserts no key ever claims observed host adoption (both mutation-proven). The project context summary gains the explicit git-observation boundary: the vendored collectors are byte-pinned but wired to no Qoder-exposed route, and commit links stay run-side (`repo_head`/`content_revision`). Host embedding, chat handoff, and wake remain unobserved; host readiness stays pending. See RELEASE_NOTES.md.

## [1.4.0] - 2026-10-05

Vendor the family's shared dashboard core and document the Qoder-native adapter: an authenticated loopback service behind `cli.mjs start|status|open|stop`, a browser UI with Work/Verification/Plan-edit views, task inspector, evidence preview and queue planning (queue edits never start work), six status-dashboard MCP tools (`dashboard_service`, `copy_task_context`), a bash-3.2-safe optional port validated 1–65535, and honest capability labels (embedding/chat handoff/wake unobserved; host readiness pending). See RELEASE_NOTES.md.

## [1.3.5] - 2026-10-02

Execute real runtime-floor and provider checks, bound hook input while preserving host refusal contracts, and update current platform guidance. Optional TypeScript LSP requires Node 22.22.2; the core lifecycle retains its separate Node 20 floor. See RELEASE_NOTES.md for patch details and pending native host acceptance.

## [1.3.4] - 2026-09-30

Transactional run and hook updates preserve concurrent changes. MCP tools use native content envelopes and isolate malformed requests. Lifecycle and native-host support boundaries are documented in RELEASE_NOTES.md; current-session host acceptance remains pending.

## [1.3.3] - 2026-09-28

Local candidate: restricted-role hook hardening, deferred MCP protocol endpoint, and agent mirror synchronization. See RELEASE_NOTES.md for verification limits.

## [1.3.2] - 2026-09-27

- Verifier reports are written incrementally to run-scoped evidence and tied to current task identity before completion.
- Stage checks use focused scopes and a compact digest; completion events replace active polling and guessed worker death.
- Role-aware hooks deny orchestrator product writes and verifier writes outside the report path when agent identity is present.
- Package version, runtime identity, and marketplace inventories are aligned; live host readiness remains pending.

- Includes the CI Python selection and documentation correction first published under the mistaken v1.3.2 tag at `3035cc7`. The corrected v1.3.2 tag and archive supersede those bytes.

## [1.3.1] - 2026-09-23

- Corrected CI release-verification reliability: the MCP grep-fallback regression harness retains the Python interpreter selected by setup-python, with its existing 1.5-second response bound and grep fallback. Runtime behavior is unchanged.
- Follow-up fixes bind evaluation snapshots to bytes, report honest integrity and measurement scope, and close confirmed routing/isolation/context-tool gaps; see RELEASE_NOTES.md for product-specific scope.
- Removed obsolete agent-session attribution and port setup notes; NOTICE and LICENSE retain project credits.
- Current release changes and verification limits are documented in RELEASE_NOTES.md.

## [1.3.0] - 2026-09-16

- Published stable release.

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
[Semantic Versioning](https://semver.org/). This changelog describes package version v1.3.1.

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
