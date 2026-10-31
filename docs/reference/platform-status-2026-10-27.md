# Qoder platform status — 2026-10-27

Historical snapshot: see [the 2026-10-30 audit](platform-status-2026-10-30.md) for current documentation and compatibility changes.

Package: **1.4.0**. This is a public-documentation and package review, not a
host acceptance report. **HOST READINESS: PENDING.** The previous
[2026-10-02 audit](platform-status-2026-10-02.md) remains historical.

## Releases and observed installation

The newest entries in Qoder's official release histories on this date are
[CLI 1.1.79, 2026-10-26](https://docs.qoder.com/release-notes/qoder-cli)
and [IDE 1.36.0, 2026-10-23](https://docs.qoder.com/release-notes/desktop).
CLI 1.1.78 fixes SessionStart context after compaction; 1.1.77 fixes an MCP
resource/prompt failure dropping tools. IDE 1.34.0 retired the Quest window
on 2026-10-16 and moved the Plugin Marketplace to the Editor window. The
release histories describe vendor changes, not LazyQoder performance.

A read-only local inspection found `/Applications/Qoder CN.app` reports
`CFBundleShortVersionString=1.10.0` and identifier `com.aliyun.lingma.ide`.
Neither `qoder` nor `qodercli` was on this shell's PATH. This is a regional
installed-app observation, not proof of its current execution, plugin support,
or identity with the global IDE release. No host was installed, upgraded,
configured, trusted, or activated during this review.

## Feature and authority audit

| Family | Public contract and package boundary | Remaining evidence |
| --- | --- | --- |
| Plugins and Skills | [CLI plugins](https://docs.qoder.com/cli/plugins) documents `.qoder-plugin/plugin.json`, convention directories, `qoder plugins install <directory>`, scopes and `/plugins reload`; [Skills](https://docs.qoder.com/cli/Skills) documents discovery and reload. The nested package contains a manifest and Skills. The old `qodercli` marketplace route is build-specific; do not substitute executables. | Current CLI acceptance, discovery and invocation of a real Skill. Local manifest checks are not installation. |
| Hooks | [CLI hooks](https://docs.qoder.com/cli/hooks) specifies wrapped plugin hooks, JSON events and exit handling; `hookSpecificOutput` requires `hookEventName`. Package hook and test fixtures are separate from live execution. The current event table omits `TaskCreated` and `TaskCompleted` although the package declares them: they are undocumented for this contract, not guaranteed native events. | Observe allowed and blocked cases in the exact build; do not make completion depend solely on omitted events. |
| MCP | [CLI MCP](https://docs.qoder.com/cli/mcp-servers) and [plugin layout](https://docs.qoder.com/cli/plugins) document bundled `.mcp.json`. Six local servers are shipped. The public pages reviewed do not establish `${user_config.mcp_mode}` or `defer_loading` behavior for this manifest; plugin-data and project placeholder expansion also needs exact-host observation. Manual fallback uses explicit absolute paths and excludes hooks, agents and commands. | Six actual project-bound connections and calls, expansion and deferred loading; no package file proves them. |
| Subagents and commands | [Subagent reference](https://docs.qoder.com/cli/subagent) documents worktree isolation and strips plugin-provided `hooks`, `mcpServers`, and `permissionMode`. Package roles and tool restrictions are declarations, with independent verification maintained. Commands are packaged under the plugin convention. | Observe selected agent, permissions, worktree and one command in a fresh session. |
| Settings and lifecycle | [Settings](https://docs.qoder.com/cli/settings) specifies user `~/.qoder/settings.json`, project `.qoder/settings.json`, local `.qoder/settings.local.json`, and trusted-folder gating. Legacy `.qodercli` paths are not established by these current docs. Lifecycle uses product-owned receipts and scoped recovery; host settings and credentials remain host-owned. | Record exact route and before/after ownership for onboarding, update, removal and recovery; no host mutation was made here. |
| Adaptive selection, plans, execution, evidence | Package selection is based on risk and complexity, and plans and completion use independent evidence and revision bindings. Native model selection or subagent dispatch is not demonstrated by selection alone. Current IDE retains Agent and Experts, but retired Quest is not a dependency. | Real host execution and independent verification in the current project/session. |
| Dashboard, sync, editing and usage | The packaged authenticated loopback dashboard, project adapter and queue are package surfaces; edits remain subject to revision and verification gates. Host embedding, chat handoff and wake remain unobserved. The vendor's CLI and IDE release notes describe vendor performance improvements only. | Host adoption, edit/sync transitions and comparative task-level measurements. No speed, token or spend improvement is claimed. |
| Security and packaging | Local package checks validate declarations and boundaries; credentials, trust and remote execution are separate authorities. The [plugin documentation](https://docs.qoder.com/cli/plugins) warns marketplace removal uninstalls its plugins. | Validate installed route and receipt-scoped removal without touching unrelated user assets. |

Current documentation uses the `qoder` spelling; older `qodercli` workflows
remain legacy and require an identified matching build. A public documented
feature, an installed executable, and a loaded feature in a real session are
three distinct observations. Do not promote one to another.
