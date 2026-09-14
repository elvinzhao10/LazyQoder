![LazyQoder](lazyqoder-banner.svg)

# LazyQoder

LazyQoder is a self-contained workflow harness for **Qoder IDE** (Alibaba's
successor to Tongyi Lingma), available across the **Qoder IDE IDE**, **JetBrains**
and **VS Code** extensions, and the **Qoder IDE CLI**. It provides structured
workflows for planning, implementation, verification, review, and bounded
long-running work, mapped onto native Qoder IDE features.

**Current release: v1.2.2** — full feature parity with LazyBuddy/LazyTrae v1.2.2
(2026-09-05): 19 skills, 17 commands, 13 agents, 25 hooks, 6 MCP servers,
44 contracts with sha256 sidecars, and the compact TASK/DELTA/REFS/VERIFY
dispatch semantics. Manifest at `.qoder-plugin/plugin.json` per the official
Qoder plugin reference.

It is verified on macOS only. Package checks prove the copied package and its
local contracts; a Qoder IDE session remains the authority for plugin loading,
hooks, and MCP connection.

## Start with the outcome

State the result you need, the acceptance criteria, and the surface that must
prove it. Use the smallest workflow that fits the uncertainty and risk:

| Situation | Ask for | Why |
| --- | --- | --- |
| Small, well-understood change | A normal request | Avoid process for process's sake. |
| Unfamiliar repository | `qoder-init-deep` | Establish project-local instructions and context. Maps to **Qoder IDE RepoWiki** (auto, always-synced code wiki). |
| Broad or ambiguous change | `qoder-ulw-plan` | Make decisions reviewable before editing. Maps to **Qoder IDE Quest mode** (auto tech-design/spec). |
| Approved plan | `qoder-start-work` | Execute against explicit acceptance criteria. Maps to **Qoder IDE Agent mode + Subagents**. |
| Failure | "Debug why … fails" | Reproduce, compare hypotheses, and verify the fix. |
| Material-risk completion | `qoder-review-work` | Add independent quality, QA, security, and scope checks. Maps to **Qoder IDE Expert teams** (领域专家智能体). |
| Long-running goal | `qoder-ulw-loop` | Keep durable state and checkpoints. Maps to **Qoder IDE Agent mode + Subagents** (long-running Agent mode + Subagents (Qoder IDE cites end-to-end delivery on multi-hour, whole-repo tasks such as a 26-hour refactor; Repowiki/Quest/Subagent usage is unlimited)). |

In a Qoder IDE plugin session, commands are namespaced as
`/lazyqoder:qoder-<command>`. If the host does not expose slash commands, make
the same request in plain language. Model selection for any of these workflows
uses the **Qoder IDE Model selector** (GLM / DeepSeek / Kimi / MiniMax per task),
and any MCP-backed step runs through **Qoder IDE Agent-mode MCP** tool
connections.

## Design mindset

LazyQoder treats a task as an evidence problem: define the observable outcome,
keep authority with the host and user, choose local tools before heavier
providers, and finish by exercising the surface the user actually cares about.
A passing unit test is useful evidence, not automatically proof of a CLI, API,
page, or host integration.

The package never turns its own readiness check into a claim about a running
host. It keeps package-owned state separate from marketplace state, host MCP
registrations, credentials, and live sessions.

## Install and onboard

Start from the immutable v1.0.1 release, open the cloned folder in the host you
want to use, and type `onboard` in the agent chat:

```bash
git clone --branch v1.0.1 --depth 1 https://github.com/elvinzhao10/LazyQoder.git
cd LazyQoder
```

The repository link is [github.com/elvinzhao10/LazyQoder](https://github.com/elvinzhao10/LazyQoder),
and downloadable release assets and notes are on the
[v1.0.1 release page](https://github.com/elvinzhao10/LazyQoder/releases/tag/v1.0.1).

`onboard` asks whether you use the Qoder IDE IDE, the JetBrains or VS Code
extension, or the Qoder IDE CLI. It then follows only that route from
[AGENTS.md](AGENTS.md), stops before changing host-managed settings, and tells
you the exact command, skill, and MCP status to confirm in a new session.

For the Qoder IDE capability mapping that underlies every workflow, see
[qoder-ide-integration.md](qoder-ide-integration.md).

## Verify and remove

`bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh` reports **package
readiness** only. Type `offboard` for the matching safe-removal protocol; it
never guesses or removes host-managed paths.

For package command details and the optional tooling lifecycle, see
[lazyqoder-plugin/README.md](lazyqoder-plugin/README.md).

## Package inventory

| Surface | Count | Role |
| --- | ---: | --- |
| Skills | 14 | Host-facing workflow policies for planning, execution, review, and verification (`qoder-*` prefix). |
| Commands | 14 | Named host entry points for those workflow policies (`/lazyqoder:qoder-<command>`). |
| Agents | 13 | Specialist role definitions for planning, implementation, QA, security, and context (`lazyqoder-*` prefix). |
| Hooks | 12 | Host hook-event declarations wired through `hooks/hooks.json`. |
| MCP declarations | 8 | Local services for ledger, verification, status, context, code intelligence, docs, CodeGraph, and LSP. |

## Technical reference and evaluation

The source-level explanation lives in [docs/README.md](docs/README.md). It
maps the package structure, request flow, state model, security boundaries,
MCP lifecycle, and release checks with diagrams tied to the implementation.

For a capability-by-capability comparison with the original LazyCodex design
and the sibling ports ([LazyBuddy](https://github.com/elvinzhao10/LazyBuddy)
and [LazyTrae](https://github.com/elvinzhao10/LazyTrae)), including what
LazyQoder implements and where it intentionally differs, see
[lazyqoder-evaluation.md](lazyqoder-evaluation.md).

LazyQoder is primarily inspired by LazyCodex
([upstream project](https://github.com/code-yeongyu/lazycodex)). Its
relationship to OmO and upstream sources is recorded in [NOTICE](NOTICE). It
is an independent implementation and does not require LazyCodex or OmO at
runtime.

## License

[MIT](LICENSE). See [NOTICE](NOTICE) for attribution and provenance.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md)
for the development checks, release expectations, and guidance for reporting
sanitized reproduction details. Report vulnerabilities privately according to
[SECURITY.md](SECURITY.md).
