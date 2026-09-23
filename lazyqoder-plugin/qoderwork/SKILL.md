---
name: lazyqoder
version: 1.3.1
description: "LazyQoder workflow harness for QoderWork. Provides structured workflows for project analysis (init-deep), strategic planning (ulw-plan), orchestrated execution (start-work), multi-agent review (review-work), and verified completion loops (ulw-loop). Use when the user says init-deep, plan, start-work, review, ulw-loop, or asks for structured multi-step implementation with verification."
---

# LazyQoder for QoderWork

Structured workflow harness adapted from the LazyQoder v1.3.1 package; native-host readiness remains pending.
Provides five core workflows that enforce evidence-based discipline: define the
observable outcome, keep authority with the user, choose local tools first, and
finish by exercising the surface the user cares about.

Source: `lazyqoder-plugin/` in the cloned repository. Full skill definitions
live in `lazyqoder-plugin/skills/lazy-*/SKILL.md`.

## Workflow Selection

| Situation | Workflow | Say |
|---|---|---|
| Unfamiliar repository | init-deep | "understand this codebase", "init-deep" |
| Broad or ambiguous change | ulw-plan | "plan", "design", "figure out how to build" |
| Approved plan ready | start-work | "execute plan", "start work" |
| Material-risk completion | review-work | "review work", "QA this", "verify implementation" |
| Open-ended goal needing proof | ulw-loop | "keep working until verified", "ulw-loop" |

## Shared Principles

1. **Evidence over claims.** A passing test is evidence, not proof of integration. Real-surface proof (HTTP response, CLI output, screenshot) is required for completion.
2. **Orchestrator never implements.** The root agent delegates ALL code edits, tests, and QA to subagents via the Agent tool.
3. **Plan-then-execute.** ulw-plan produces a decision-complete plan; start-work executes it. Execution begins only with explicit user approval.
4. **Adversarial verification.** Every DoneClaim is independently verified. The verifier MUST be a separate subagent from the implementer.
5. **State in `.lazyqoder/`.** Plans go to `.lazyqoder/plans/`, runs to `.lazyqoder/runs/`, loop state to `.lazyqoder/ulw-loop/`.

## Workflow 1: init-deep

Generate hierarchical project memory. Read-only — never modifies product code.

### Procedure

1. **Discover.** Spawn parallel Agent subagents to map: directory structure, entry points, conventions, build/CI, test patterns. In the main session, run structural analysis (`find`, file counts, code concentration).
2. **Score directories.** Weight: file count (3x, >20), subdir count (2x, >5), code ratio (2x, >70%), module boundary (2x, has index), symbol density (2x, >30). Score >15 gets its own `qoder.md`; root always gets one.
3. **Generate `qoder.md`.** Sections: OVERVIEW (1-2 sentences + stack), STRUCTURE (tree with purposes), WHERE TO LOOK (task-to-location table), CONVENTIONS (deviations only), ANTI-PATTERNS (forbidden patterns), COMMANDS (dev/test/build). Target 50-150 lines, no generic advice.
4. **Generate context.** Write `.lazyqoder/context/index.md`, `commands.json`, `project-map.json`.
5. **Deduplicate.** Remove parent content from child variants. Trim to size limits.

### Output

- `qoder.md` at root (and subdirectory variants where scored)
- `.lazyqoder/context/{index.md, commands.json, project-map.json}`

### Verification

- `qoder.md` exists, 50-150 lines, no generic filler
- Child files do not repeat parent content
- Context files are parseable JSON/markdown

## Workflow 2: ulw-plan

Turn a vague or large request into ONE decision-complete work plan. Read-only — never edits product code. Writes ONLY to `.lazyqoder/plans/`.

### Procedure

1. **Ground in codebase.** Explore relevant files with Read/Grep/Glob/Bash (read-only). Discoverable facts get researched, not asked.
2. **Classify intent.** CLEAR (outcome known, only tradeoffs open) vs UNCLEAR (outcome fuzzy — adopt defaults, announce them, do NOT ask extra questions).
3. **Ask only blocking questions.** Filter: could evidence answer it? Could a defensible default? Only ask genuine owner-decisions (irreversible, destructive, safety-critical, cross-cutting).
4. **Write the plan** to `.lazyqoder/plans/<slug>.md`:

```markdown
## TL;DR
Brief summary.

## Todos
- [ ] Task 1
  - Acceptance: ...
  - QA: exact command + expected output
  - Commit: message guidance

## Final Verification Wave
- [ ] End-to-end scenario
- [ ] All tests pass
- [ ] Type check / lint clean
```

5. **Approval gate.** Present summary, wait for explicit user approval. Do not proceed to execution without it.

### Output

- `.lazyqoder/plans/<slug>.md` — decision-complete, zero ambiguity for executor

### Verification

- Every todo has acceptance criteria + QA command + commit guidance
- No ambiguous instructions remain
- Approval gate presented and recorded

## Workflow 3: start-work

Execute an approved plan via orchestrated subagent delegation. The root agent NEVER writes product code.

### Procedure

1. **Select plan.** Read `.lazyqoder/plans/`. If one plan exists, select it. If none, invoke ulw-plan first.
2. **Create run state.** Write `.lazyqoder/runs/<run_id>/state.json` with run_id, plan reference, status "active", checkboxes array.
3. **Execute checkboxes.** For each unchecked item:
   - Decompose into atomic sub-tasks
   - Spawn worker subagents via Agent tool (parallel for independent tasks)
   - Each subagent message includes: TASK, DELIVERABLE, SCOPE (exact files), VERIFY (commands)
   - Collect DoneClaim from each worker
4. **Verify (5 gates per checkbox):**
   - Plan reread: confirm acceptance criteria
   - Automated: run tests, typecheck, lint, build
   - Manual-QA: capture real artifact (curl output, screenshot, CLI stdout)
   - Adversarial: probe applicable classes (stale_state, dirty_worktree, misleading_success_output at minimum)
   - Independent verifier: spawn separate Agent subagent to confirm DoneClaim
5. **Mark progress.** Only after all 5 gates pass: edit plan checkbox `[ ]` to `[x]`, append event to `.lazyqoder/runs/<run_id>/events.jsonl`. Continue without asking.
6. **Complete.** When all checkboxes done: run final verification, invoke review-work, print `ORCHESTRATION COMPLETE`.

### DoneClaim Schema

```json
{
  "task": "task id",
  "changed_files": ["paths"],
  "tests": ["command + result"],
  "manual_qa": ["artifact paths"],
  "adversarial_classes": {"stale_state": "PASS|FAIL|N-A", ...},
  "risks": []
}
```

### Verification

- All checkboxes completed by subagents (not root)
- Every checkbox has DoneClaim + independent AdversarialVerify
- Manual-QA artifacts exist
- review-work passes all 5 lanes

## Workflow 4: review-work

Launch 5 parallel review subagents. ALL must pass.

### The 5 Review Lanes

| # | Agent | Focus |
|---|---|---|
| 1 | Goal Verifier | Did we build what was asked? Completeness, constraints, edge cases. |
| 2 | QA Executor | Does it work when run? 15-30 test scenarios, real execution. |
| 3 | Code Reviewer | Senior engineer review. Correctness, patterns, error handling, types. |
| 4 | Security Auditor | Input validation, auth, secrets, CVEs, path traversal, data exposure. |
| 5 | Context Miner | Missed context from git history, issues, cross-references, docs. |

### Procedure

1. **Gather context.** Collect GOAL, CONSTRAINTS, CHANGED_FILES (`git diff --name-only`), DIFF, FILE_CONTENTS, RUN_COMMAND.
2. **Launch all 5 in parallel** via Agent tool in a single turn. Oracle agents (1, 3, 4) receive full context in prompt. Autonomous agents (2, 5) get tool access.
3. **Collect verdicts.** Each lane returns PASS / FAIL / INCONCLUSIVE with confidence and findings. Retry INCONCLUSIVE lanes up to 3 times with smaller scope.
4. **Deliver verdict.** ALL PASS = REVIEW PASSED. ANY FAIL = REVIEW FAILED. ANY INCONCLUSIVE (no FAIL) = REVIEW INCONCLUSIVE.

### Output

Per-agent verdict table, aggregated blocking issues (deduplicated, prioritized), key findings, fix instructions if failed.

## Workflow 5: ulw-loop

Goal-driven verified completion loop for open-ended tasks.

### Procedure

1. **Bootstrap.** Survey context, classify tier (LIGHT: 1-2 criteria, HEAVY: 3+). Create binding success criteria — each names its exact scenario: literal command, page action, payload, and binary observable. Write to `.lazyqoder/ulw-loop/<session-id>/goals.json`.
2. **Loop:**
   - Find first unverified criterion
   - Decompose into bounded work cycles
   - Delegate to subagents (NEVER implement directly)
   - Collect DoneClaim, run AdversarialVerify (independent subagent)
   - If confirmed: record FullyDone, update criterion
   - If not: re-dispatch with feedback
   - Record real-surface evidence
3. **Caps.** Per-goal: 5 cycles max. Per-criterion failure: 3 before escalation. Overall: 100 iterations (normal) / 500 (ultrawork).
4. **Evidence channels.** HTTP: `curl -i` with status+body. CLI: stdout/stderr. Browser: screenshot + action log. `--dry-run` is NEVER evidence.
5. **Final gate.** Re-run all verification. Spawn independent gate-reviewer subagent. Evidence audit (every criterion has real-surface proof). Unconditional approval required.

### Dynamic Steering

- continue: criterion verified, move to next
- escalate: 3 same-failures or 5 goal-cycles, ask user
- pause_for_review: unexpected breakage or >3 modules touched
- split_criterion: scope grew, decompose
- revert_last_cycle: regressions detected

### Output

- `.lazyqoder/ulw-loop/<session-id>/goals.json`
- `.lazyqoder/ulw-loop/<session-id>/evidence/`
- Handoff: `ULW-LOOP: {complete|incomplete}, Criteria: N/N verified, Iterations: {count}`

## QoderWork Adaptation Notes

| Qoder IDE concept | QoderWork equivalent |
|---|---|
| Plugin manifest + registry | Disk scan of `~/.qoderworkcn/skills/lazyqoder/` |
| Slash commands (`/lazyqoder:lazy-*`) | Natural language triggers (this skill) |
| Agent subagents with `isolation: true` | Agent tool with `subagent_type` parameter |
| Hooks (SessionStart, PreToolUse, etc.) | Encoded in skill procedure steps |
| MCP run-ledger / verification servers | File-based state in `.lazyqoder/` (MCP optional) |
| Model selection | QoderWork host selection; subagents inherit unless the plan explicitly enables a switch |
| `qoder.md` project memory | `qoder.md` (same format, workspace root) |

## Optional: MCP Server Registration

The 8 bundled MCP servers (run-ledger, verification, status-dashboard, context-graph, code-intel, docs, codegraph, lsp) can be registered in QoderWork's MCP settings for enhanced state management. This is optional — all workflows function with file-based state alone.

To register, add entries to QoderWork's MCP configuration pointing to `lazyqoder-plugin/mcp/<name>/server.sh` with env vars `QODER_PLUGIN_ROOT` (absolute path to `lazyqoder-plugin/`) and `CWD` (writable workspace root).

## Package Reference

Full skill definitions, agent personas, hook scripts, MCP implementations, and verification tooling live in the cloned repository at `lazyqoder-plugin/`. This QoderWork skill is the host adapter; the plugin remains the canonical source of workflow logic.
