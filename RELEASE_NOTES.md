# LazyQoder v1.3.2

**Scope:** This package corrects CI release verification reliability. It does not change product behavior or model selection. Qoder activation in a fresh host session still needs live testing.

## Eval-driven fixes

These fixes were included in the prior tagged build, whose GitHub Release was not published.

- **Safer execution:** Workflow intent ignores quoted or historical command mentions while retaining explicit requests to start work. Isolation reports namespace allocation accurately; it does not claim to have created a Git worktree. Cleanup preserves populated allocations, linked files, and caller-owned changes.
- **Better evidence:** Outcome comparisons hash the supplied task, budget, and permission snapshots and reject mismatched cohorts. Reports distinguish absent, partial, and validated evidence, count explicit host-billed costs from failed runs, and reject fixture telemetry as execution data. Hashes verify supplied bytes, not the truth of their contents.
- **Predictable delegation:** Subagents keep the current session model by default. A plan may propose `efficient` or `performance` for named tasks, but switching requires an explicit plan decision and `--allow-switch`. The selector is advisory and does not change host settings or imply that a model is available on the account.
- **Package and tooling fixes:** Installed-package and release-root validation now distinguish their routes, check pinned inventory integrity, and reject an invalid explicit release root. Agent metadata accepts optional model aliases and memory scopes; CLI discovery includes `qodercli`. Dependency search handles extension-bearing imports with fewer search processes, and verification avoids repeating the full suite for Python preflight. No end-to-end speed or cost gain has been measured.

## v1.3.2 release-verification fix

- The MCP grep-fallback regression harness now retains the Python interpreter selected by CI's `setup-python` instead of selecting macOS system Python from `PATH`.
- The harness keeps its existing 1.5-second response bound and grep fallback. This changes test interpreter selection only; it does not alter runtime MCP behavior.

## Measured efficiency

No product productivity, latency, or native-cost improvement is claimed. The change makes the regression check use the intended CI Python interpreter.

## Host capability matrix

| Host | Release route | Live status |
| --- | --- | --- |
| Qoder CLI | Release-root marketplace | Pending fresh-session test |
| Qoder IDE | CLI-backed marketplace when available | Pending fresh-session test |
| Qoder app | Full-plugin marketplace | Pending fresh-session test |

## Migration and upgrade

Before upgrading, record the installed version and lifecycle ownership, then validate the exact v1.3.2 package. Keep host readiness pending until the selected route is observed in a fresh Qoder session.

## Known risks

Repository and CI checks do not establish that a release archive loads in a host. Installation, activation, MCP, specialist, cancellation, and completed-task behavior remain unobserved in fresh Qoder sessions.

## Rollback

Stop the host session and use the lifecycle offboard/rollback route for the previous release. Remove only unmodified receipt-owned assets; preserve modified, unknown, linked, caller-owned, and host-managed files. Start a fresh session to verify the restored installation.
