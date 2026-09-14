# LazyQoder verification evidence

This document records public, present-tense evidence for the LazyQoder package.
It is not evidence that a specific Qoder IDE session has loaded a plugin.
Verification is on macOS only.

## Project purpose and attribution

LazyQoder is a learning project for evidence-led agent workflows, retargeted to
**Qoder IDE** (Alibaba's successor to Tongyi Lingma). It is primarily inspired by
LazyCodex ([upstream project](https://github.com/code-yeongyu/lazycodex)).
OmO upstream attribution is recorded in [NOTICE](NOTICE). The package is an
independent implementation and does not require LazyCodex or OmO at runtime.

LazyQoder is the 4th port of the LazyCodex host-port family. Sibling ports:
- **LazyBuddy** ([github.com/elvinzhao10/LazyBuddy](https://github.com/elvinzhao10/LazyBuddy)) — CodeBuddy IDE/CLI and WorkBuddy (MIT).
- **LazyTrae** ([github.com/elvinzhao10/LazyTrae](https://github.com/elvinzhao10/LazyTrae)) — Trae IDE/Work/CLI (MIT).

## Implemented package behavior

LazyQoder packages 19 `lazy-` skills, 14 command workflows, 13 `lazyqoder-`
agents, 12 hook-event declarations, and eight local MCP declarations:
`run-ledger`, `verification`, `status-dashboard`, `context-graph`, `code-intel`,
`docs`, `codegraph`, and `lsp`. The package checks validate manifests, component
inventory, JSON, executable MCP scripts, internal Markdown links, hook/security
behavior, MCP protocol regressions, and the automatic-tooling contract.

`bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh` reports
`PACKAGE_READINESS=full` when the copied package assets and local contracts are
complete. `lazyqoder-plugin-doctor.sh` and
`lazyqoder-plugin/scripts/lazyqoder-verify.sh` provide package health and an
aggregate verification gate. These commands are evidence about the package,
not a host session.

Each workflow primitive maps to a native Qoder IDE feature, documented in full in
[qoder-ide-integration.md](qoder-ide-integration.md):

- `lazy-init-deep` (hierarchical memory) → **Qoder IDE RepoWiki** (auto, always-synced code wiki).
- `lazy-ulw-plan` (decision-complete plan) → **Qoder IDE Quest mode** (auto tech-design/spec).
- `lazy-start-work` / `lazy-ulw-loop` (durable execution) → **Qoder IDE Agent mode + Subagents** (long-running Agent mode + Subagents (Qoder IDE cites end-to-end delivery on multi-hour, whole-repo tasks such as a 26-hour refactor; Repowiki/Quest/Subagent usage is unlimited)).
- `lazy-review-work` / `lazy-reviewer` / `lazy-verifier` → **Qoder IDE Expert teams** (领域专家智能体: frontend/backend/db/ops/test).
- Model routing (OmO quota discipline) → **Qoder IDE Model selector** (GLM / DeepSeek / Kimi / MiniMax per task).
- MCP servers (code-intel, lsp, …) → **Qoder IDE Agent-mode MCP** tool connections.

The `docs` MCP boundary accepts validated npm or PyPI package names and
requests only the fixed HTTPS npm or PyPI registry endpoint. Redirects and
metadata URLs such as a package homepage, repository, or documentation link are
not followed. Structured `Write` and `Edit` secret protection examines only the
supported target-path fields; text that merely mentions a secret-like filename
is not a target. `Bash` retains its conservative literal scan, so a command that
merely contains such a path can still be denied.

InitDeep can use an explicitly supplied absolute `QODER_PLUGIN_ROOT` from an
unrelated workspace. It does not search parents, siblings, marketplaces, or the
filesystem for another plugin. A parent marketplace file may be read only to
compare its entry version with the already selected root; this is metadata
validation, not root discovery or host proof.

Aggregate verification emits bounded per-check status and reason. A deadline is
a failure, an absent Qoder IDE validator is **UNCHECKED**, and a validator
timeout, launch failure, nonzero result, or semantic failure never becomes a
host-success claim.

For trusted package-owned verification commands, each bounded check starts in
its own process group. A deadline triggers best-effort termination of that owned
group, and the JSON/stderr result reports whether descendants were still
detectable at cleanup time. This is not a security sandbox and does not guarantee
all descendants are gone; genuinely untrusted commands require a VM or
container-backed runner. A no-fork sandbox is not enabled by default.

The package's local-first tooling policy detects compatible `rg` and `sg`,
supports JavaScript/TypeScript and Python LSP navigation, and recognizes declared
repository-native verification. A missing provider can be installed only in a
caller-selected empty receipt-owned root; verification never mutates a target
manifest, lockfile, global tool, or host configuration.

## Host support and required observation

| Surface | Package evidence | Required user observation |
|---|---|---|
| Qoder IDE IDE | Copyable package, manifest (`.qoder/plugin.json`), local checks, and eight MCP declarations. | Install with the host plugin flow, reload if offered, then confirm a LazyQoder skill/command and MCP status in a new session. |
| Qoder IDE JetBrains extension | Package assets and compatibility metadata are present. | Install through the extension flow, start a new session, and inspect plugin/MCP activation. |
| Qoder IDE VS Code extension | Package assets and compatibility metadata are present. | Install through the extension flow, reload the window, and inspect plugin/MCP activation. |
| Qoder IDE CLI | Plugin validate and package validation are documented. | Install through the host, start a new session, and inspect plugin/MCP activation. |

The copied repository is not a verified Qoder IDE installer. Package readiness
cannot prove SessionStart, hook execution, marketplace activation, a live
session, or MCP connection.

## Public capability status contract

`lazyqoder-tooling.sh` status, load-check, doctor, and provider reports are
read-only canonical package evidence. They report assets, capability eligibility,
policy, and receipt state without provider execution, optional activation, host
registration, or a claim that a live host loaded the package.

## Optional capability policy

Automatic task routing is temporary and nonpersistent. It selects the lightest
eligible local capability for the task without writing host/project configuration
or lockfiles. Context7 and experimental, unpinned `grep_app` are remote exports
that require explicit selection; any export is namespaced, manual to merge, and
contains no credential. Remote calls can egress data or incur cost.

CodeGraph is optional architecture exploration with its own explicit
install/init/enable lifecycle. It is not automatically indexed, launched,
registered, or telemetered. Playwright requires explicit browser approval and is
outside the bundled local MCP inventory. `context-graph` is a heuristic grep
fallback, not CodeGraph.

## Receipt and safe removal

Receipt ownership is enforced for package tooling. Only an exact, unmodified
receipt-owned root can be removed. Modified, foreign, linked, caller-owned,
project, and host-managed paths are preserved. This boundary protects local
tooling and does not authorize removal of host plugin, marketplace, MCP, or
credential state.

## Package readiness versus host verification

Package readiness validates copied contents, declarations, inventories, and
local contracts. It does not prove host discovery, SessionStart, hooks,
marketplace installation, a running session, or MCP connection. The host
observation in the support table is required before making an integration claim.

## JSON-RPC resilience

The eight packaged local MCP endpoints have JSON-RPC stream regression coverage,
including malformed input and subsequent-request behavior. This is protocol
evidence for the package, not proof that a host process launched or connected an
endpoint.

## Learner references

The complete 21-page learner tree starts at [docs/README.md](docs/README.md).
Use [security and authority](docs/06a-security-and-authority.md) for the
registry, secret-path, and explicit-root boundaries, then [state and
validation](docs/07a-state-and-validation.md) and [test and release
verification](docs/09-test-and-release-verification.md) for bounded-status and
release-evidence vocabulary.

## Host-specific exclusions

- **Host integration:** Qoder IDE IDE, JetBrains extension, VS Code extension, and CLI use their respective plugin flows.
- **State/path:** tooling roots are package receipt-owned; `.qoder`, host plugin
  locations, host MCP entries, and credentials remain host/user state and are
  never guessed or deleted.
- **Inventory:** eight local MCP servers are bundled (`run-ledger`,
  `verification`, `status-dashboard`, `context-graph`, `code-intel`, `docs`,
  `codegraph`, `lsp`). Context7 and `grep_app` are optional export fragments;
  filesystem and Playwright are not bundled local MCP servers.

## Known unverified host behavior

Live plugin discovery, marketplace behavior, hook execution, SessionStart, and
MCP connection remain user-observed host behavior.

## macOS verification scope

LazyQoder is verified on macOS only. Normal CI does not require a sibling
repository. Release-only paired parity receives explicitly supplied sibling
roots as release evidence and never creates a runtime or installation
dependency.

## Attribution and limits

[NOTICE](NOTICE) and [LICENSE](LICENSE) are the attribution and license
records. This evidence describes the package's tested boundaries and does not
claim host behavior beyond the required manual observations.

## Comparison with the upstream reference harness

The reference named in the attribution above publicly describes project memory,
planning, execution, verified completion, specialized skills, hooks,
diagnostics, and multi-agent roles. The comparison below is a capability
comparison, not a compatibility or drop-in replacement claim. The sibling
[LazyBuddy](https://github.com/elvinzhao10/LazyBuddy) (CodeBuddy/WorkBuddy, 14
skills / 14 commands / 13 agents / 6 MCP / 12 hooks) and
[LazyTrae](https://github.com/elvinzhao10/LazyTrae) (Trae IDE/Work/CLI, 17 skills
/ 9 commands / 11 agents / 8 MCP) are cited for port parity; LazyQoder carries
19 skills / 14 commands / 13 agents / 8 MCP / 12 hooks, adding `codegraph` and
`lsp` to the MCP set and retargeting every primitive to Qoder IDE native features.

| Reference capability family | LazyQoder realization | Deliberate difference or limitation |
| --- | --- | --- |
| Project memory | `lazy-init-deep`, managed agent instructions, explicit plugin-root selection; maps to **Qoder IDE RepoWiki**. | No automatic parent/sibling or marketplace discovery; Qoder IDE loading remains unverified until observed. |
| Planning and durable execution | `lazy-ulw-plan`, `lazy-start-work`, `lazy-ulw-loop`; maps to **Qoder IDE Quest** and **Agent mode + Subagents**. | The host decides whether commands, hooks, and agents are actually available in a session. |
| Specialized roles and review | 13 packaged `lazyqoder-*` roles for planning, implementation, QA, security, context, reviewer, verifier; maps to **Qoder IDE Expert teams**. | Role definitions are package assets; they are not evidence that a host spawned a role. |
| Hooks and lifecycle | 12 declared hook events plus structured pre/post-tool policy scripts. | Hooks are host-governed and are not an enforcement boundary until the host reports them loaded. |
| Local development tooling | Local-first ripgrep, ast-grep, LSP, repository-native verification, and optional CodeGraph lifecycle; maps to **Qoder IDE Model selector** for routing and **Agent-mode MCP** for servers. | Remote Context7 and grep_app remain explicit opt-in exports; filesystem and Playwright are not bundled local MCP servers. |
| Diagnostics and removal | Load-check, doctor, aggregate verifier, receipts, and conservative removal. | Results establish package readiness, not marketplace activation, live session behavior, or MCP connection. |
| Installation model | A self-contained Qoder IDE package with manual host steps (`.qoder/plugin.json`). | It intentionally does not reproduce the reference harness's installer, managed global configuration, provisioning, model routing, or automatic host mutation. |

The upstream project is a useful architectural reference, but LazyQoder keeps a
smaller ownership model: package-owned assets are verifiable and removable;
host-owned settings and live integrations require an explicit user observation.


## v1.2.2 parity port (2026-09-14)

Ported the full v1.2.2 sibling feature set: 42 contracts (20 byte-identical
lazyseries shared schemas), 64 fixtures, 13 lifecycle hook entries, 6-server
MCP manifest with defer_loading, the 28-file lifecycle/ scripts subsystem,
adaptive tooling family, v1.2.x docs wave, and TASK/DELTA/REFS/VERIFY dispatch
semantics. Verified: load-check PACKAGE_READINESS=full (19/17/13/25/6),
lifecycle self-test passed v1.2.2, sha256 sidecars verified, series-cleanliness
greps clean. Package readiness only; host readiness unobserved.
