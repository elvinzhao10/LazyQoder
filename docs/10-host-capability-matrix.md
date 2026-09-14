# Host capability matrix

LazyQoder retargets the LazySeries harness to a single host, Qoder IDE (Alibaba's
successor to Tongyi Lingma). The safety model is unchanged, but each LazySeries
workflow is carried by a native Qoder IDE feature rather than by a separate host
adapter. The same package may be present on two surfaces without both hosts
exposing the same loading or registration behavior.

## What each workflow maps to

| LazySeries workflow | Qoder IDE native feature | How the workflow is carried |
| --- | --- | --- |
| `init-deep` (hierarchical memory) | **RepoWiki** | Auto, Git-synced code wiki; `qoder-init-deep` adds the curated memory layer on top. |
| `ulw-plan` (decision-complete plan) | **Quest 2.0** | Independent-window spec; auto-decomposes complex tasks before any edit. |
| `ulw-loop` (durable execution + checkpoints) | **Agent mode + Subagents** | Long-running, usage unlimited; the loop checkpoint file is the durable state the Agent session resumes from. |
| `start-work` (subagent orchestration) | **Agent mode + Subagents** | Subagent fan-out under Agent mode; orchestrator never implements directly. |
| `ultrawork` (high-precision binding loop) | **Agent mode + Subagents** + **Expert teams** | Durable execution with a binding Expert-team review gate. |
| `review-work` (parallel review) | **Expert teams** | Composed of domain experts (planning / research / coding / review / testing); custom experts supported. |
| `reviewer` (independent review) | **Expert teams** | Owned by the matching domain expert role. |
| `verifier` (independent verification) | **Expert teams** | Owned by the matching domain expert role. |
| `librarian` (project memory upkeep) | **RepoWiki** | Curated memory upkeep layered on the auto-synced wiki. |
| `migration-planner` (host-adapter port plan) | **Quest 2.0** | Generates the plan for porting prior host semantics to Qoder IDE. |
| Model routing (omO quota discipline) | **Model selector** | GLM-5.1 / DeepSeek / Kimi-K2.6 / MiniMax per task; package recommends, does not reconfigure. |
| MCP servers (run-ledger, verification, …) | **Agent-mode MCP** | Eight local servers bridged over stdio under Agent mode. |

## Structural differences

The Qoder IDE surface differs, but the safety model does not:

- **Host integration:** Qoder IDE decides plugin discovery, connector registration, session lifetime, and event delivery.
- **State/path:** package run state and receipt-owned tooling roots are local; marketplace directories, `.qoder` data, credentials, and connector state remain host/user-owned.
- **Inventory:** eight local MCP servers are packaged. Optional remote exports and browser work remain separate explicit decisions.

## Package-built versus host-native behavior

| Behavior | LazyQoder contribution | Raw host (Qoder IDE) contribution | Learner takeaway |
| --- | --- | --- | --- |
| Workflow guidance | Ships skills, commands, and agent role text. | Decides whether/how those assets are discovered and exposed. | A Markdown command definition is not a running command. |
| Hook policy | Ships event mapping and scripts that validate supported input. | Delivers an event and decides the host lifecycle semantics. | A passing hook test does not prove a host delivered the event. |
| Local MCP | Ships eight launchers and server programs. | Starts the process (Agent-mode MCP), negotiates connection, and shows tool availability. | A declaration is not a connection. |
| Run/evidence state | Implements package-local scripts and boundaries. | Supplies session context and user-visible integration. | Local records describe package work, not host state. |
| Optional providers | Implements policy, receipts, and export fragments. | Stores credentials and applies connector/network policy. | Selection/receipt status is not provider authorization or connection. |

The complete dependency classification is in [Dependency and host boundary reference](reference/dependency-and-host-boundaries.md).

## macOS-only scope

The package evidence is verified on macOS only. It does not claim equivalent host loading, marketplace behavior, hook execution, or MCP connection on other operating systems. Those are observed per Qoder IDE session.
