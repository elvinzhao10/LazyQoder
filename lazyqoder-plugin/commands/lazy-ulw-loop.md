---
description: "Verified completion loop for open-ended tasks. Creates goals with binding success criteria, decomposes into evidence-bound steps, runs until all criteria have real-surface proof. Manages goal state in .lazyqoder/ulw-loop/."
---

# /lazyqoder:lazy-ulw-loop

Verified completion loop for open-ended tasks. Creates binding goals with success criteria, decomposes into evidence-bound steps, and iterates until every criterion has verified proof. Delegates implementation waves to `/lazyqoder:lazy-start-work` when needed.

## Qoder IDE mapping

LazyQoder's verified-completion loop maps to **Qoder IDE Agent mode + Subagents** (long-running Agent mode + Subagents (Qoder IDE cites end-to-end delivery on multi-hour, whole-repo tasks such as a 26-hour refactor; Repowiki/Quest/Subagent usage is unlimited)). The `lazy-ulw-loop` goal/evidence bookkeeping layers binding verification on top of Qoder IDE's long-running subagent execution.

## Usage

```
/lazyqoder:lazy-ulw-loop "task" [--completion-promise=TEXT] [--strategy=reset|continue]
```

## Inputs

- Task description (natural language)
- Completion promise (binding success criteria, optional)
- Strategy: `reset` (fresh start) or `continue` (resume from `.lazyqoder/ulw-loop/` state)
- Workspace context via `qoder.md`

## Outputs

- `.lazyqoder/ulw-loop/goals.json` — binding success criteria
- `.lazyqoder/ulw-loop/evidence.jsonl` — per-goal evidence log
- Completed work artifacts (via delegated `/lazyqoder:lazy-start-work` waves)
- Final evidence report showing every criterion met

## Success Criteria

1. All success criteria have verified evidence
2. Evidence is self-contained (another agent can re-verify from the evidence alone)
3. No evidence claim without an observed value
4. Iteration cap respected (100 normal, 500 ultrawork)

## Constitution

This command is governed by its package-local skill contract below.

Do not claim completion without verification.

## Skill

See `../skills/lazy-ulw-loop/SKILL.md` for the full workflow logic, goal creation protocol, evidence binding rules, and iteration management.
