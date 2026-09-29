# LazyQoder v1.3.3 — reliability and release consistency

**Status:** v1.3.3 release. Package, lifecycle, and publication checks passed locally and in PR CI. Fresh Qoder activation remains pending.

## Eval-driven fixes

- Restricted-role hooks reject conflicting identities, malformed or oversized mutating input, and unrestricted shell dispatch.
- Deferred optional MCP servers retain a valid protocol endpoint. Canonical agent definitions now synchronize to required mirrors, with count and drift checks.

## Measured efficiency

No token, latency, or cost improvement has been measured for this patch.

## Host capability matrix

Package checks exercise Qoder IDE and CLI routes. Fresh host activation and MCP behavior still require observation on a recorded build and session.

## Migration and upgrade

Update from v1.3.2 through the normal host route. Preserve caller state and verify installed package identity.

## Known risks

Role enforcement depends on trusted host identity and an explicitly restricted run. Package checks do not establish host sandboxing or live connection health.

## Rollback

Use lifecycle rollback to the prior verified v1.3.2 release while preserving run evidence and caller state.

## Prior release notes

# LazyQoder v1.3.2 — durable verification handoff

**Status:** v1.3.2 release. Source, publication, and main-branch CI checks passed. Fresh Qoder activation remains pending; package verification alone does not establish host readiness.

## Eval-driven fixes

- The verifier contract writes a run-scoped, revision-bound report as checks finish; the orchestrator contract blocks a verdict when that report is missing, incomplete, or stale. Generic completion APIs do not yet enforce this report format.
- The orchestrator contract requires focused checks between stages, one full matrix at closure, a compact run digest, and completion events instead of active polling. It forbids duplicate dispatch while owned paths or evidence are changing.
- Where the host supplies agent identity, the PreToolUse hook denies an orchestrator Write/Edit outside its own state directory. Host payloads without identity still require the agent contract to enforce this boundary.

## Measured efficiency

The B3 postmortem identifies repeated whole-suite verification and polling as major token sinks. v1.3.2 has no measured token, latency, or cost reduction yet.

## Release verification and version history

PR #13 introduced the B3 runtime changes. The then-current publication workflow verified core behavior, lifecycle behavior, and the release archive before attaching the asset. An earlier v1.3.2 publication at `3035cc7` contained only the CI and documentation correction; its archive SHA-256 was `8e15c0e09b6fbccfc3db6ce4ee52ee50ab098e279ae9f924678c3c19103062eb`. This corrected v1.3.2 supersedes that mistaken package and includes the B3 runtime changes. Existing v1.3.2 installations may not see a version-based update: reinstall the corrected release and confirm Qoder Skills, commands, agents, hooks, and MCP connections in a fresh session before claiming live readiness.

The short-lived v1.3.3 publication pointed to `d6e6a49`; its archive SHA-256 was `e4cceab598b50a8f88d30e79db03e7dc9308d153e1249683e6570a96c7de12d3`. It is being withdrawn as part of this version correction. These commit and digest records preserve the provenance of both superseded artifacts.

## Host capability matrix

| Host | Package route | Current session |
| --- | --- | --- |
| Qoder CLI, Qoder IDE, Qoder app | Existing documented routes | Pending live observation |

## Migration and upgrade

Upgrade from the last independently verified installed package using the documented lifecycle after inventorying managed and modified assets. Preserve caller files and existing run evidence. The report contract applies to new verification attempts; old conversational verdicts do not become durable evidence.

## Known risks

The role-aware hook depends on host-provided agent identity and does not classify arbitrary Bash writes. Quota termination can still leave an in-progress report; it must remain blocked until independently resumed or rerun.

## Rollback

Use the lifecycle rollback to the prior verified release. Keep v1.3.2 run evidence for diagnosis and do not mark in-progress reports complete.

## Prior release notes (v1.3.1)

The mistaken first v1.3.2 publication is recorded above for provenance. Its tag and release were replaced at the user's request; the corrected archive has different bytes.

# LazyQoder v1.3.1

**Scope:** v1.3.1 package release notes. The corrected package requires repository and release-package verification; Qoder activation in a fresh host session still needs live testing.

## Eval-driven fixes

- **Safer execution:** Workflow intent ignores quoted or historical command mentions while retaining explicit requests to start work. Isolation reports namespace allocation accurately; it does not claim to have created a Git worktree. Cleanup preserves populated allocations, linked files, and caller-owned changes.
- **Better evidence:** Outcome comparisons hash the supplied task, budget, and permission snapshots and reject mismatched cohorts. Reports distinguish absent, partial, and validated evidence, count explicit host-billed costs from failed runs, and reject fixture telemetry as execution data. Hashes verify supplied bytes, not the truth of their contents.
- **Predictable delegation:** Subagents keep the current session model by default. A plan may propose `efficient` or `performance` for named tasks, but switching requires an explicit plan decision and `--allow-switch`. The selector is advisory and does not change host settings or imply that a model is available on the account.
- **Package and tooling fixes:** Installed-package and release-root validation now distinguish their routes, check pinned inventory integrity, and reject an invalid explicit release root. Agent metadata accepts optional model aliases and memory scopes; CLI discovery includes `qodercli`. Dependency search handles extension-bearing imports with fewer search processes, and verification avoids repeating the full suite for Python preflight. No end-to-end speed or cost gain has been measured.
- **Current guidance:** README, contributor, lifecycle, and verification documentation reflect v1.3.1. Obsolete attribution and initial-port files were removed; credits and licenses remain in NOTICE and LICENSE.
- **CI harness correction:** The MCP grep-fallback regression harness retains the Python interpreter selected by CI `setup-python`, with its existing 1.5-second response bound and grep fallback. This fixes interpreter selection only; runtime MCP behavior is unchanged.

## Measured efficiency

No measured productivity, latency, or native-cost improvement is claimed. The CI correction makes the regression check use the configured Python interpreter; it does not claim a product efficiency gain. The corrected source must pass its own repository and release-package verification before publication.

## Host capability matrix

| Host | Release route | Live status |
| --- | --- | --- |
| Qoder CLI | Release-root marketplace | Pending fresh-session test |
| Qoder IDE | CLI-backed marketplace when available | Pending fresh-session test |
| Qoder app | Full-plugin marketplace | Pending fresh-session test |

## Migration and upgrade

Before upgrading, record the installed version and lifecycle ownership, then validate the exact v1.3.1 archive. Keep host readiness pending until the selected route is observed in a fresh Qoder session.

## Known risks

Repository and CI checks do not establish that a release archive loads in a host. Installation, activation, MCP, specialist, cancellation, and completed-task behavior remain unobserved in fresh Qoder sessions. Evidence hashes bind supplied bytes but do not establish their independent truth.

## Rollback

Stop the host session and use the lifecycle offboard/rollback route for the previous release. Remove only unmodified receipt-owned assets; preserve modified, unknown, linked, caller-owned, and host-managed files. Start a fresh session to verify the restored installation.
