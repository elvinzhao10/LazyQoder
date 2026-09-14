# Workflow playbooks

LazyQoder is a workflow harness, not a promise that every host surface has
loaded it. Start with the smallest workflow that fits the request, and keep
host observations separate from package evidence. See [host routes](reference/host-routes.md)
before assuming a command is available.

## Choose a workflow

| Situation | Start with | Outcome |
| --- | --- | --- |
| Need a map of an unfamiliar repository | `qoder-init-deep` | Hierarchical project memory and a `.lazyqoder/context/` knowledge base. Maps to Qoder IDE **RepoWiki** (auto, always-synced code wiki). |
| Request is vague, large, or has design choices | `qoder-ulw-plan` | One decision-complete plan; it does not implement product code. Maps to Qoder IDE **Quest mode** (auto tech-design/spec). |
| An approved plan is ready to execute | `qoder-start-work` | Orchestrated delegation, evidence, and review gates. Runs in Qoder IDE **Agent mode + Subagents**. |
| Completion must stay open until criteria have proof | `qoder-ulw-loop` | Goals with binding success criteria and recorded evidence. Runs in Qoder IDE **Agent mode + Subagents**. |
| A completed change needs independent review | `qoder-review-work` | Five review lanes: goal, QA, code, security, and context. Maps to Qoder IDE **Expert teams**. |
| A bug has uncertain runtime cause | `qoder-debugging` | Hypotheses tested against observed runtime state. |
| A bounded cleanup follows green regression tests | `qoder-remove-ai-slops` | Behavior-preserving cleanup. |
| You need a high-precision, evidence-led pass | `qoder-ultrawork` | Tiered work with manual-QA discipline. |

Qoder IDE exposes the command workflows as `/lazyqoder:qoder-<command>` after
the host has loaded the plugin. Use a verified Qoder IDE plugin/extension session
or the equivalent natural-language/imported-skill workflow; a copied
repository plugin installation is not verified. The [installation and host verification guide](03-install-and-host-verification.md)
explains the initial route.

## The normal path

1. Establish the package and host boundary with [verification](05-evidence-and-completion.md).
2. For work with unclear decisions, plan first with `qoder-ulw-plan`.
3. Start an approved plan with `qoder-start-work`; that role delegates rather
   than directly implementing product code, fanning out to Agent-mode subagents.
4. Gather the checks and real-surface evidence appropriate to the change.
5. Use `qoder-review-work` when the work merits the five-lane gate, then record
   the result in durable project memory with `qoder-librarian` when applicable.

`qoder-ulw-plan` is deliberately sticky: a request to build something becomes
planning until the user explicitly starts the plan. This prevents a plan from
quietly becoming unreviewed implementation.

## Command and skill inventory

The package contains 14 portable `qoder-` skills and 14 current command
workflows. The commands are: `qoder-init-deep`, `qoder-librarian`,
`qoder-migration-planner`, `qoder-new-run`, `qoder-resume`, `qoder-review-work`,
`qoder-reviewer`, `qoder-start-work`, `qoder-status`, `qoder-ultrawork`,
`qoder-ulw-loop`, `qoder-ulw-plan`, `qoder-verifier`, and `qoder-verify`.

The skill inventory is: `qoder-debugging`, `qoder-git-master`,
`qoder-init-deep`, `qoder-librarian`, `qoder-migration-planner`,
`qoder-programming`, `qoder-remove-ai-slops`, `qoder-review-work`,
`qoder-reviewer`, `qoder-start-work`, `qoder-ultrawork`, `qoder-ulw-loop`,
`qoder-ulw-plan`, and `qoder-verifier`. Commands are host invocation surfaces;
skills describe the workflow. They are not proof of live host loading.

## Useful variations

- Use `qoder-migration-planner` for a semantic host-adapter plan. It writes
  adapter documentation, not product code.
- Use `qoder-verifier` or `qoder-verify` to reproduce claimed checks and issue an
  evidence-based verdict.
- Use `qoder-reviewer` for a focused review; use `qoder-review-work` for the
  full five-agent review gate.
- Use `qoder-new-run`, `qoder-resume`, and `qoder-status` to manage workflow run
  state rather than reconstructing it from memory.
- Use `qoder-git-master` only for an explicitly requested Git operation or
  history question.

Next: learn what counts as completion in [evidence and completion](05-evidence-and-completion.md),
or see the complete [package map](07-package-map.md).

## How policy becomes behavior

The playbooks are deliberately declarative. `skills/qoder-*/SKILL.md` tells an agent which evidence and constraints matter; `commands/qoder-*.md` gives a host named entry point; `agents/*.md` narrows the prompt to a specialist role. The operational side effects live elsewhere, in scripts, hooks, MCP endpoints, and the project being changed.

```mermaid
flowchart LR
    Skill["skill policy"] --> Command["optional command wrapper"]
    Command --> Agent["specialist role"]
    Agent --> Tools["host tool calls"]
    Tools --> Scripts["state / verifier scripts"]
    Scripts --> Evidence["durable evidence"]
```

This split is intentional. A host can expose a skill without exposing a slash command, and a declared agent can exist without being selected for a task. The package tests the files and local scripts; actual selection and execution are host/session observations.
