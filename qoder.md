# qoder.md — LazyQoder workspace (Qoder IDE port)

## OVERVIEW
This repository (`/Users/Admin/Desktop/lazyqoder/LazyQoder`) is **LazyQoder**, the
4th port of the LazyCodex host-port family, retargeted to **Qoder IDE** (Alibaba's
successor to Tongyi Lingma). It reuses the MIT-licensed LazyBuddy workflow
harness content and remaps every primitive to a native Qoder IDE feature. The
active goal is a self-contained Qoder IDE plugin package with no runtime
dependency on LazyCodex or OmO.

Core stack: a TypeScript/Node-style harness expressed as a Qoder IDE plugin
package (markdown `lazy-` skills / `lazy-` commands / `lazyqoder-` agents +
MCP server declarations + hook scripts), driven through `.qoder/plugin.json`.

## STRUCTURE
- `lazyqoder-plugin/` — the installable Qoder IDE package.
  - `skills/` — 19 portable workflow skills (`lazy-*/SKILL.md`).
  - `commands/` — 14 current slash-command workflows (`lazy-*.md`).
  - `agents/` — 13 agent role definitions (`lazyqoder-*.md`; mirrored to `.qoder/agents/`).
  - `hooks/hooks.json` — 12 host hook-event declarations.
  - `mcp/` + `.mcp.json` + `.qoder/mcp.json` — 8 local MCP server declarations
    (`run-ledger`, `verification`, `status-dashboard`, `context-graph`,
    `code-intel`, `docs`, `codegraph`, `lsp`).
  - `.qoder/plugin.json` — **host entry point** (name `lazyqoder`, version `1.0.1`).
  - `contracts/` — two verbatim contract JSON files + `.sha256` sidecars (load-check verified).
  - `schemas/`, `scripts/`, `templates/`, `tests/`, `tooling/` — validation, lifecycle, and tests.
- Root meta: `README.md`, `NOTICE`, `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, `AGENTS.md`, `CHANGELOG.md`.
- Docs: `lazyqoder-evaluation.md` (capability evidence), `qoder-ide-integration.md`
  (6-row capability mapping), `docs/` (learner tree).

## WHERE TO LOOK
| Task | Location |
| --- | --- |
| Canonical harness mechanics | `../lazycodex/plugins/omo/**`, `../lazycodex/README.md` |
| Mirror CodeBuddy plugin format | `../LazyBuddy/lazybuddy-plugin/**` |
| Mirror Trae CLI + `.trae/` format | `../LazyTrae/lazytrae-plugin/**` |
| Reuse skill/command/agent content (MIT) | `../LazyBuddy/lazybuddy-plugin/{skills,commands,agents}` |
| Qoder IDE capability mapping | `qoder-ide-integration.md` |
| Host onboard/offboard steps | `AGENTS.md` |
| Package readiness evidence | `lazyqoder-evaluation.md` |

## CONVENTIONS
- **Evidence-based discipline**: define the observable outcome, keep authority
  with the host + user, choose local tools before heavier providers, finish by
  exercising the surface the user cares about. A passing unit test is evidence,
  not proof of a host integration.
- **Plan-then-execute**: `lazy-init-deep` → `lazy-ulw-plan` →
  `lazy-start-work` → `lazy-review-work` / `lazy-verifier`.
- **Qoder IDE mapping** (see `qoder-ide-integration.md`): init-deep→RepoWiki,
  ulw-plan→Quest, start-work/ulw-loop→Agent mode + Subagents, review/reviewer/
  verifier→Expert teams, model routing→Model selector, MCP→Agent-mode MCP.
- Package readiness ≠ live host readiness. Load checks prove the copied package
  and its local contracts only; never claim a running Qoder IDE host from a load check.
- MIT licensed; attribution/provenance in `NOTICE`.
- Rename map: `lazybuddy`→`lazyqoder`, `lazy-`→`lazy-`, `lazybuddy-*`→`lazyqoder-*`,
  `CODEBUDDY_PLUGIN_ROOT`→`QODER_PLUGIN_ROOT`, `.codebuddy-plugin`/`.workbuddy-plugin`→`.qoder`.

## ANTI-PATTERNS
- Do NOT modify the cloned source repos (`../LazyBuddy`, `../LazyTrae`,
  `../lazycodex`) for the Qoder port — the new port lives only under `LazyQoder/`.
- Do NOT turn a package readiness check into a claim about a running Qoder IDE host.
- Do NOT burn premium models on routine subtasks; mirror OmO's quota discipline
  via the Qoder IDE Model selector (cheap for quick edits, strong for hard logic).
- Do NOT write literal `process.env` / `import.meta.env` (pre-write safety hook blocks them);
  use bracket notation or a constant if an env accessor is needed.
- Do NOT keep two contracts' CONTENTS (they are copied verbatim + sha256-verified).

## COMMANDS
- LazyQoder package readiness:
  `bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh`
- Plugin validation (Qoder IDE CLI): `qoder plugin validate lazyqoder-plugin`
- Host workflows: `/lazyqoder:lazy-init-deep`, `/lazyqoder:lazy-ulw-plan`,
  `/lazyqoder:lazy-start-work`, `/lazyqoder:lazy-review-work`
- Reference only (other hosts): `../LazyBuddy` (CodeBuddy/WorkBuddy),
  `../LazyTrae` (Trae CLI).
