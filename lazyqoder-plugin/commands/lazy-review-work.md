---
description: "5-agent parallel review gate. Spawns five independent reviewers (Goal Verifier, QA Executor, Code Reviewer, Security Auditor, Context Miner) that must ALL pass before work is considered done. Use after every significant implementation."
---

# /lazyqoder:lazy-review-work

Runs the 5-agent parallel review gate: five independent subagents review the work from different angles (goal compliance, QA execution, code quality, security, context mining). All five must return PASS for the work to be considered complete. Any FAIL blocks completion; any INCONCLUSIVE triggers a retry.

## Qoder IDE mapping

LazyQoder's multi-agent review primitive maps to **Qoder IDE Expert teams** (领域专家智能体: frontend/backend/db/ops/test). The `lazy-review-work` gate realizes the same ALL-MUST-PASS discipline using Qoder IDE domain-expert agents.

## Usage

```
/lazyqoder:lazy-review-work [plan-name]
```

## Inputs

- Plan name or run ID (optional; defaults to active run)
- Changed files (diff against baseline)
- User goal and constraints (from `qoder.md` or plan)
- Verification evidence from `/lazyqoder:lazy-start-work` or `/lazyqoder:lazy-ulw-loop`

## Outputs

- Per-agent verdict (PASS / FAIL / INCONCLUSIVE) with findings
- Aggregate verdict (PASSED only if all 5 PASS)
- Blocking issues list (if any FAIL)
- Review report written to `.lazyqoder/runs/<run_id>/evidence/review-report.md`

## Success Criteria

1. All 5 review lanes spawned with `isolation: true` (independent contexts)
2. Each lane produced a verdict with specific findings (not generic)
3. Aggregate verdict is PASSED (all 5 PASS) — or blocking issues are documented
4. No INCONCLUSIVE left unresolved (retry budget exhausted or resolved)
5. Review report artifact exists and is non-empty

## Constitution

This command is governed by its package-local skill contract below.

Do not claim completion without verification.

## Skill

See `../skills/lazy-review-work/SKILL.md` for the full workflow logic, 5-agent taxonomy, per-agent review checklists, ALL-MUST-PASS verdict logic, and INCONCLUSIVE retry protocol.
