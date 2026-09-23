# LazyQoder workspace

LazyQoder is a standalone Qoder CLI, IDE, and app workflow package. The
current worktree is a v1.3.1 candidate; v1.3.0 remains the published stable
release. A local package check does not prove that a Qoder host loaded it.

## Current package

- `lazyqoder-plugin/.qodercli-plugin/plugin.json` and
  `lazyqoder-plugin/.qoder-plugin/plugin.json` declare the CLI and IDE routes.
- `lazyqoder-plugin/skills/`, `commands/`, `agents/`, `hooks/`, and `mcp/`
  contain the installable workflows and local tools.
- `lazyqoder-plugin/contracts/`, `scripts/`, `tests/`, and `tooling/` contain
  the validators, lifecycle commands, and package checks.
- `AGENTS.md` is the onboarding and host-authority guide;
  `docs/reference/host-routes.md` identifies supported routes and fallbacks.
- `lazyqoder-plugin/docs/model-routing.md` explains model selection. Subagents
  inherit the current model unless a plan explicitly enables a switch.

## Working rules

Keep Qoder CLI, IDE, and app capabilities separate. Use only a route observed in
the current host. Preserve user-owned configuration and credentials. Treat
fixture results, package readiness, and native host behavior as distinct
kinds of evidence. A task is complete only after its stated acceptance checks
and artifact review pass.

For package checks, run `bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh`
and the relevant focused tests. Current release changes and limitations are in
`RELEASE_NOTES.md`; the published v1.3.0 guide remains at
the historical `docs/v1.3.0-supported-route.md`.
