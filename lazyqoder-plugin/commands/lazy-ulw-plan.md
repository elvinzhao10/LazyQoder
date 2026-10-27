---
description: "Create a decision-complete work plan. Prometheus planner mode — explores, researches, writes a plan to .lazyqoder/plans/. Never writes product code. Produces plans consumed by /lazyqoder:lazy-start-work."
---

# /lazyqoder:lazy-ulw-plan

Create a decision-complete work plan. The planner explores the codebase, researches unknowns, evaluates alternatives, and writes a structured plan. Never writes product code — planning only.

## Qoder IDE mapping

The `lazy-ulw-plan` skill produces an explicit, human-reviewable plan. Qoder IDE retired the Quest window in 1.34.0; this package workflow does not depend on it.

## Usage

```
/lazyqoder:lazy-ulw-plan "what to build"
```

## Inputs

- User's build request (natural language description)
- Workspace context (`qoder.md`, project structure, existing plans)
- Codebase state (via explorer subagents)

## Outputs

- Plan file written to `.lazyqoder/plans/<slug>.md`
- Decision log with alternatives considered and rationale
- Task decomposition with dependency graph

## Success Criteria

1. Plan file written and self-contained
2. Every decision has a documented rationale
3. Task decomposition is granular and dependency-ordered
4. Approval gate presented (awaits user "approved" or `/lazyqoder:lazy-start-work`)

## Constitution

This command is governed by its package-local skill contract below.

Do not claim completion without verification.

## Skill

See `../skills/lazy-ulw-plan/SKILL.md` for the full workflow logic, exploration phases, decision framework, and Prometheus planner constraints.
