# LazyQoder v1.3.1 release candidate

**Status:** Unpublished. v1.3.0 remains the latest stable release. Local repository checks passed; see [PR #8](https://github.com/elvinzhao10/LazyQoder/pull/8) for current CI status. Qoder activation in a fresh host session still needs live testing.

## Eval-driven fixes

- **Safer execution:** Workflow intent ignores quoted or historical command mentions while retaining explicit requests to start work. Isolation reports namespace allocation accurately; it does not claim to have created a Git worktree. Cleanup preserves populated allocations, linked files, and caller-owned changes.
- **Better evidence:** Outcome comparisons hash the supplied task, budget, and permission snapshots and reject mismatched cohorts. Reports distinguish absent, partial, and validated evidence, count explicit host-billed costs from failed runs, and reject fixture telemetry as execution data. Hashes verify supplied bytes, not the truth of their contents.
- **Predictable delegation:** Subagents keep the current session model by default. A plan may propose `efficient` or `performance` for named tasks, but switching requires an explicit plan decision and `--allow-switch`. The selector is advisory and does not change host settings or imply that a model is available on the account.
- **Package and tooling fixes:** Installed-package and release-root validation now distinguish their routes, check pinned inventory integrity, and reject an invalid explicit release root. Agent metadata accepts optional model aliases and memory scopes; CLI discovery includes `qodercli`. Dependency search handles extension-bearing imports with fewer search processes, and verification avoids repeating the full suite for Python preflight. No end-to-end speed or cost gain has been measured.
- **Current guidance:** README, contributor, lifecycle, and verification documentation reflect the candidate. Obsolete attribution and initial-port files were removed; credits and licenses remain in NOTICE and LICENSE.

## Measured efficiency

No measured productivity or native-cost improvement is claimed. Local repository, installed-package, release-root, machine-status, and verifier-policy checks passed; [PR #8](https://github.com/elvinzhao10/LazyQoder/pull/8) records the current CI results.

## Host capability matrix

| Host | Candidate route | Live status |
| --- | --- | --- |
| Qoder CLI | Release-root marketplace | Pending fresh-session test |
| Qoder IDE | CLI-backed marketplace when available | Pending fresh-session test |
| Qoder app | Full-plugin marketplace | Pending fresh-session test |

## Migration and upgrade

Keep v1.3.0 as the stable version until the exact v1.3.1 archive and host routes are verified. Before upgrading, record the installed version and lifecycle ownership, then validate the exact candidate archive.

## Known risks

Repository and CI checks do not establish that a release archive loads in a host. Installation, activation, MCP, specialist, cancellation, and completed-task behavior remain unobserved in fresh Qoder sessions. Evidence hashes bind supplied bytes but do not establish their independent truth.

## Rollback

Stop the host session and use the lifecycle offboard/rollback route for the previous release. Remove only unmodified receipt-owned assets; preserve modified, unknown, linked, caller-owned, and host-managed files. Start a fresh session to verify the restored installation.
