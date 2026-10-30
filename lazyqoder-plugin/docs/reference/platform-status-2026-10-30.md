# LazyQoder platform audit — 2026-10-30

Current published documentation baseline remains v1.4.0; local 1.4.1 changes are unreleased.

## Official documentation checked

The official [CLI changelog](https://docs.qoder.com/release-notes/qoder-cli) lists **1.1.81 on October 29**, including CodeMode and session continuity. The current [plugin guide](https://docs.qoder.com/cli/plugins) documents `qoder plugins install`, `.qoder-plugin/plugin.json`, and `/plugins reload`.

The shipped `qodercli` and `.qodercli-plugin` route is a legacy build-specific adapter. Do not copy those names into current `qoder` commands or assume the schemas are interchangeable. Use the current guide for a selected current build and keep host readiness pending until actual discovery/connection. The [hooks reference](https://docs.qoder.com/cli/hooks-reference) includes TaskCreated and TaskCompleted while the [hooks guide](https://docs.qoder.com/cli/hooks) omits them. This is conflicting first-party coverage, not a blanket claim that these events are undocumented. Actual delivery, payload and blocking behavior remain per-build observations.

Verification requires **Python 3.11 or newer**: the bounded runner uses standard-library StrEnum and assert_never. The previous 3.10 admission check was incorrect; preflight now rejects it before attempting runner imports.

## Package capability and proof boundary

This audit covers lifecycle/onboarding/update/offboard/recovery; project init/sync/ownership; Skills, commands, agents and hooks; MCP and optional tooling; adaptive workflow/model selection; plans, loops and delegation; evidence, completion and security gates; dashboard/project records and editing; versioned verification, regression provenance, review admission, checkpoint history and compaction. Package checks and isolated native fixtures are distinct from current-session host acceptance.

The local development changes retain direct handling for simple tasks. Existing named workflows and approval/verification requirements remain authoritative. No blanket speed, token or cost saving is claimed from workflow selection. The five Python-backed adapters omit review-content scanning only on internal producer paths with no existing review; public reads and all reviewed subjects retain fresh capture. No HEAD-only cache is introduced.

**HOST READINESS: PENDING** wherever no fresh host/build/session receipt is observed. No host installation, trust/account change, provider call, credential change or publication was performed by this audit. The coordination report records exact test outcomes and unresolved contradictions. The previous dated audit remains historical context.
