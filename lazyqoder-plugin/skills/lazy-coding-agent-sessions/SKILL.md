---
name: lazy-coding-agent-sessions
version: 1.0.0
description: "Find, read, list, search, inspect, or reconstruct coding-agent sessions across Qoder IDE and other platforms. Covers session tracking, transcript search, session history, token usage, and subagent sessions. Use when asked about past sessions, session IDs, or reconstructing prior work. Triggers: coding agent sessions, session history, session ID, read session, find session, transcript search, what did I work on, did we already do this, reconstruct past work."
user-invocable: true
---

# coding-agent-sessions

Find and inspect coding-agent sessions across Qoder IDE and other platforms before answering from memory. Use LazyQoder's session tracking state as the primary store; fall back to platform-native transcript files when available.

## Global Qoder IDE Work fallback

This installed skill is self-contained. It does not require a helper script or reference bundle. Use the local paths listed below when they are available; for an unlisted platform, ask the user for its documented transcript location before searching.

## Purpose

Reconstruct past sessions so agents can answer "what did we already do" questions without relying on memory. The LazyQoder sessions store (`.lazyqoder/state/sessions.json`) is the primary source; platform transcript files supplement when the user asks about non-Qoder IDE sessions.

## Required Context to Inspect

- `.lazyqoder/state/sessions.json` — LazyQoder session tracking (primary store).
- `.lazyqoder/state/boulder.json` — active work-in-progress state.
- `.lazyqoder/state/active-loop.json` — active ulw-loop plan with goal statuses.
- `.lazyqoder/evidence/` — recorded evidence from past verification runs.

## Step-by-Step Procedure

### 1. List Recent Sessions (Qoder IDE)

Read `.lazyqoder/state/sessions.json` to inspect tracked Qoder IDE sessions:

```
Read .lazyqoder/state/sessions.json
```

The `sessions` object contains session IDs mapped to metadata: `session_id`, `started_at`, `last_active_at`, `status`, `active_plan`, `work_id`, `agent`, `mode`. The `compaction_state` field tracks compaction history.

### 2. Search by Keyword or Date

Use Grep to search session metadata and evidence files for keywords:

```
Grep "keyword" .lazyqoder/state/sessions.json
Grep "keyword" .lazyqoder/evidence/
```

For date-based search, inspect the `started_at` and `last_active_at` ISO timestamps in sessions.json entries.

### 3. Read Session Details

To reconstruct what happened in a session:
- Read the session's `active_plan` (e.g., `.lazyqoder/plans/<plan-name>.md`) for the plan that was being executed.
- Read `.lazyqoder/state/boulder.json` for task-by-task progress.
- Read `.lazyqoder/state/active-loop.json` for goal and criterion statuses.
- Read `.lazyqoder/evidence/` files named after the work for verification results.

### 4. Cross-Platform Search (Non-Qoder IDE Sessions)

When the user asks about sessions from other coding agents:
- Use Grep/Glob only in the user's approved local path.
- For Qoder IDE native transcripts: `~/.qoder-cn/cache/projects/`.
- For Codex: `.codex/state_*.sqlite`, rollout JSONL files.
- For Claude: `~/.claude/projects/`, `~/.claude/transcripts/`.
- For OpenCode: `~/.opencode/`, `~/.local/share/opencode/`.
- For another platform: ask the user for the official local storage path, or consult that platform's official documentation before searching.

### 5. Reconstruct Past Work

Combine session metadata with evidence to reconstruct what was done:
1. Find the session by keyword or date.
2. Read the session's active plan to understand the objective.
3. Read boulder state for per-task completion status.
4. Read evidence files for verification results (test runs, Manual-QA, reviewer findings).
5. Summarize: what was accomplished, what was blocked, what remains.

## Allowed Edits

- Read `.lazyqoder/state/sessions.json`, `.lazyqoder/state/boulder.json`, `.lazyqoder/state/active-loop.json`.
- Search `.lazyqoder/evidence/` for past verification artifacts.
- Read platform transcript files at documented paths (read-only).

## Forbidden Behavior

- Do NOT answer from memory. Always check the session store first.
- Do NOT modify session state files during read operations.
- Do NOT fabricate session details when the store is empty — report the gap.
- Do NOT read or expose secrets, tokens, or API keys from session files.
- Do NOT search outside documented paths without user consent.

## Verification Gates

1. **Plan reread**: All requested session queries have been addressed.
2. **Automated verification**: Session store files are valid JSON and parse correctly.
3. **Manual-QA**: Reconstructed timeline matches user's recollection.
4. **Adversarial QA**: Empty session store handled gracefully. Missing platform transcripts reported clearly.
5. **Cleanup**: No temporary files left from cross-platform transcript reads.

## Failure Handling

- If `.lazyqoder/state/sessions.json` is empty or absent: report that no Qoder IDE sessions have been tracked yet.
- If a platform transcript path is not found: report the missing path and suggest manual location.
- If session metadata is incomplete: report what is available and note what is missing.
- If the user asks about an unlisted platform: report the unknown storage path and ask for the platform's documented location.

## Output Format

```
=== Session Search Results ===

Platform: Qoder IDE
Store: .lazyqoder/state/sessions.json
Sessions Found: {N}

Session: {session_id}
  Started: {started_at}
  Last Active: {last_active_at}
  Status: {status}
  Active Plan: {active_plan}
  Work ID: {work_id}
  Agent: {agent}
  Mode: {mode}

=== Reconstructed Work ===

Plan: {plan summary}
Tasks Completed: {N}/{total}
Evidence: {references to evidence files}
```

## Handoff Target

After session reconstruction, hand findings to the requesting agent. If the user wants to continue prior work, hand off to `ulw-plan` for a new plan or `start-work` to resume execution.
