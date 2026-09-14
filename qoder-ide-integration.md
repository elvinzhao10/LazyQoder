# Qoder IDE Integration Guide — LazyQoder

This guide explains how to load **LazyQoder** into **Qoder IDE** (Alibaba's
successor to Tongyi Lingma) and how each native Qoder IDE feature replaces or
augments the corresponding LazySeries harness primitive. It is the canonical
mapping reference cited by [README.md](README.md),
[AGENTS.md](AGENTS.md), and [lazyqoder-evaluation.md](lazyqoder-evaluation.md).

LazyQoder bundles 14 `qoder-` skills, 14 commands, 13 `lazyqoder-` agents, 12
hook events, and 8 local MCP servers (`run-ledger`, `verification`,
`status-dashboard`, `context-graph`, `code-intel`, `docs`, `codegraph`, `lsp`).
The package entry point is `lazyqoder-plugin/.qoder/plugin.json`
(name `lazyqoder`, version `1.0.1`).

## Capability mapping (harness primitive → Qoder IDE feature)

| Harness primitive | Qoder IDE native feature |
| --- | --- |
| `init-deep` (hierarchical memory) | **RepoWiki** (auto, always-synced code wiki) + a `qoder-init-deep` skill/rule |
| `ulw-plan` (decision-complete plan) | **Quest mode** (auto tech-design/spec) |
| `start-work` / `ulw-loop` (durable execution) | **Agent mode + Subagents** (long-running Agent mode + Subagents (Qoder IDE cites end-to-end delivery on multi-hour, whole-repo tasks such as a 26-hour refactor; Repowiki/Quest/Subagent usage is unlimited)) |
| `review-work` / `reviewer` / `verifier` | **Expert teams** (领域专家智能体: frontend/backend/db/ops/test) |
| Model routing (OmO quota discipline) | **Model selector** (GLM / DeepSeek / Kimi / MiniMax per task) |
| MCP servers (code-intel, lsp, …) | **Agent mode MCP** tool connections |

Every primitive below keeps its original LazySeries semantics; the Qoder IDE
feature is an augmentation surface, not a replacement of the workflow logic.

## How each primitive maps

### 1. `qoder-init-deep` → Qoder IDE RepoWiki

`qoder-init-deep` generates hierarchical project memory (directory scoring,
`qoder.md`). On Qoder IDE this augments **RepoWiki**, which auto-builds and
keeps an always-synced code wiki for the open repository. Use `qoder-init-deep`
to add repo-local instructions and a structured memory file on top of the
RepoWiki baseline; RepoWiki supplies the auto-discovered structure, the skill
supplies the curated, decision-ready layer.

### 2. `qoder-ulw-plan` → Qoder IDE Quest mode

`qoder-ulw-plan` produces a decision-complete work plan and never writes
product code. On Qoder IDE this pairs with **Quest mode**, which auto-generates
a technical design/spec for the stated goal. Drive Quest with the plan produced
by `qoder-ulw-plan` so the host-generated spec and the harness plan stay in
lockstep before any edit is made.

### 3. `qoder-start-work` / `qoder-ulw-loop` → Qoder IDE Agent mode + Subagents

`qoder-start-work` orchestrates subagents and never implements directly;
`qoder-ulw-loop` keeps durable state and checkpoints for long-running goals.
On Qoder IDE run these inside **Agent mode**, which supports **Subagents** (long-running Agent mode + Subagents (Qoder IDE cites end-to-end delivery on multi-hour, whole-repo tasks such as a 26-hour refactor; Repowiki/Quest/Subagent usage is unlimited)). The harness delegation
graph maps to Agent-mode subagent fan-out; the loop's checkpoint file is the
durable state the Agent mode session resumes from.

### 4. `qoder-review-work` / `qoder-reviewer` / `qoder-verifier` → Qoder IDE Expert teams

`qoder-review-work` runs a parallel review (goal/QA/code/security/context);
`qoder-reviewer` and `qoder-verifier` provide independent quality and
verification roles. On Qoder IDE this is augmented by **Expert teams**
(领域专家智能体) — domain expert agents for frontend, backend, database, ops, and
test. Dispatch the harness review roles as an Expert-team composition so each
review dimension is owned by the matching domain expert.

### 5. Model routing → Qoder IDE Model selector

The OmO quota discipline (route the lightest eligible model per task) maps to
the **Qoder IDE Model selector** (GLM / DeepSeek / Kimi / MiniMax per task). The
harness broker selects the lightest eligible local capability; the Model
selector picks the matching model. Use cheap models for quick edits and strong
models for hard logic, exactly as OmO prescribes — the package does not
reconfigure the selector, it only recommends the routing.

### 6. MCP servers → Qoder IDE Agent-mode MCP

The 8 local MCP servers (`run-ledger`, `verification`, `status-dashboard`,
`context-graph`, `code-intel`, `docs`, `codegraph`, `lsp`) connect through
**Qoder IDE Agent-mode MCP** tool connections. Declare them in `.mcp.json` /
`.qoder/mcp.json`; the Agent-mode MCP surface is where Qoder IDE launches and
bridges each server over stdio.

## Loading LazyQoder into Qoder IDE

### Option A — Qoder IDE IDE / JetBrains / VS Code extension

1. Clone the immutable release and open the folder in the host:

   ```bash
   git clone --branch v1.0.1 --depth 1 https://github.com/elvinzhao10/LazyQoder.git
   cd LazyQoder
   ```

2. Install the copied package through the host plugin/extension UI. Reload the
   window or restart the IDE if the host offers it.

3. Verify package readiness (copied assets + local contracts):

   ```bash
   bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh
   bash lazyqoder-plugin/scripts/lazyqoder-plugin-doctor.sh
   ```

4. Confirm in a **new** session: a `/lazyqoder:qoder-<command>` entry and the
   eight MCP servers shown as connected under Agent-mode MCP settings.

### Option B — Qoder IDE CLI

1. Validate and install the package through the host:

   ```bash
   git clone --branch v1.0.1 --depth 1 https://github.com/elvinzhao10/LazyQoder.git
   cd LazyQoder
   qoder plugin validate lazyqoder-plugin
   bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh
   ```

2. Use Qoder IDE's current plugin discovery flow to locate LazyQoder. Confirm the
   publisher and review the exact immutable revision or release reference before
   running the host-generated install command. No reviewed immutable marketplace
   reference is bundled here, so this guide intentionally provides no
   marketplace-add URL or executable install command.

3. Start a Qoder IDE session and inspect plugin/MCP activation.

Package readiness is not a host-readiness claim. Perform the host observation
above before relying on integration behavior.

## Qoder plugin / manifest scaffold (`.qoder/plugin.json`)

This is the documented Qoder IDE host entry point shipped at
`lazyqoder-plugin/.qoder/plugin.json`. It mirrors the structure expected by the
Qoder IDE plugin loader; the actual file in the package is the authority.

```json
{
  "name": "lazyqoder",
  "version": "1.0.1",
  "displayName": "LazyQoder",
  "description": "LazySeries workflow harness retargeted to Qoder IDE (RepoWiki, Quest, Agent mode + Subagents, Expert teams, Model selector, Agent-mode MCP).",
  "author": "LazySeries ports (MIT, adapted from LazyCodex by Yeongyu Kim)",
  "license": "MIT",
  "host": "qoder-cn",
  "entry": {
    "skills": "skills",
    "commands": "commands",
    "agents": "agents",
    "hooks": "hooks/hooks.json",
    "mcp": ".mcp.json"
  },
  "capabilities": {
    "repoWiki": "qoder-init-deep",
    "quest": "qoder-ulw-plan",
    "agentMode": ["qoder-start-work", "qoder-ulw-loop"],
    "expertTeams": ["qoder-review-work", "qoder-reviewer", "qoder-verifier"],
    "modelSelector": "omO-quota-routing",
    "agentModeMcp": ["run-ledger", "verification", "status-dashboard", "context-graph", "code-intel", "docs", "codegraph", "lsp"]
  },
  "mcpConfig": [".mcp.json", ".qoder/mcp.json"]
}
```

## MCP wiring checklist

- `run-ledger` — execution ledger (package-owned state), Agent-mode MCP.
- `verification` — aggregate verification gate, Agent-mode MCP.
- `status-dashboard` — run/status visibility, Agent-mode MCP.
- `context-graph` — heuristic grep fallback (not CodeGraph), Agent-mode MCP.
- `code-intel` — code intelligence over stdio, Agent-mode MCP.
- `docs` — npm/PyPI registry docs only, Agent-mode MCP.
- `codegraph` — optional architecture exploration; explicit install/init/enable, Agent-mode MCP.
- `lsp` — read-only JS/TS + Python LSP bridge, Agent-mode MCP.

## Keep package and host state separate

LazyQoder never writes host configuration, credentials, or marketplace state.
Tooling fallbacks install only into an explicit receipt-owned root; CodeGraph
and Playwright (optional) require explicit approval. Offboarding uses the host's
own removal flow plus the `offboard` protocol in [AGENTS.md](AGENTS.md).
