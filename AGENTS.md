# AGENTS.md — LazyQoder setup and removal guide

> **Agent:** use this guide to install, verify, and remove LazyQoder safely.
> For workflow use after installation, read [README.md](README.md). For the
> package's exact tooling commands, read [lazyqoder-plugin/README.md](lazyqoder-plugin/README.md).

LazyQoder supports Qoder IDE through its IDE, the JetBrains and VS Code
extensions, and the Qoder IDE CLI via their plugin flows. The Qoder IDE
plugin entry point is `lazyqoder-plugin/.qoder/plugin.json`. LazyQoder is a
learning project primarily inspired by LazyCodex. It is an independent
implementation for Qoder IDE and does not require LazyCodex or OmO at runtime;
[NOTICE](NOTICE) records the upstream attribution. Verification is on macOS
only.

## `onboard` protocol

When the user types `onboard`:

1. **Ask which product** they want to set up:
   - **Qoder IDE IDE** (standalone desktop IDE, formerly Tongyi Lingma)
   - **QoderWork** (task-execution desktop app, qoderwork.com)
   - **Qoder IDE CLI** (terminal, `qodercli`)
   - **Qoder IDE JetBrains extension** (IntelliJ, PyCharm, etc.)
   - **Qoder IDE VS Code extension**
2. Follow only that product's setup path below. Run `bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh`; after package readiness is full, invoke `lazy-init-deep` or accept the equivalent natural-language request.
3. Report every completed safe repository/package action and its observed result. Call load-check **package readiness**: it proves copied files and declarations, not plugin loading, SessionStart, hooks, or an MCP connection.
4. Stop before account, marketplace, host-settings, credential, remote-provider, browser, or architecture-tool actions. Give exact manual host directions and name the live host observation the user must make.
5. Explain that optional tooling is unchanged: onboarding, doctor, and load-check do not enable providers, register MCP servers, install global tools, or write host configuration.

### Qoder IDE IDE — full installation (verified 2026-07-19, macOS)

The Qoder IDE IDE is the standalone AI-native coding environment. Plugin
discovery uses `~/.qoder-cn/plugins/` (cache + registry) and
`~/.qoder-cn/skills/` (global skill symlinks). MCP is configured per-workspace
via `.mcp.json` at the workspace root.

**1. Clone and verify package:**

```bash
git clone https://github.com/elvinzhao10/LazyQoder.git
cd LazyQoder
bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh
# Expected: PACKAGE_READINESS=full
```

**2. Make scripts executable** (repo may ship without execute bits):

```bash
chmod +x lazyqoder-plugin/scripts/*.sh
chmod +x lazyqoder-plugin/scripts/state/*.sh
chmod +x lazyqoder-plugin/scripts/hooks/*.sh
chmod +x lazyqoder-plugin/scripts/loop/*.sh
chmod +x lazyqoder-plugin/mcp/*/server.sh
```

**3. Configure MCP servers** — create `.mcp.json` at workspace root:

```json
{
  "mcpServers": {
    "lazyqoder-run-ledger": {
      "command": "bash",
      "args": ["/abs/path/to/lazyqoder-plugin/mcp/run-ledger/server.sh"],
      "env": {
        "QODER_PLUGIN_ROOT": "/abs/path/to/lazyqoder-plugin",
        "CWD": "/abs/path/to/workspace"
      }
    }
  }
}
```

Repeat for all 8 servers: `run-ledger`, `verification`, `status-dashboard`,
`context-graph`, `code-intel`, `docs`, `codegraph`, `lsp`. Each follows the
same pattern with its own `mcp/<name>/server.sh` path. `CWD` must point to the
writable workspace root (where `.lazyqoder/runs/` is created).

**4. Install plugin (skills, agents, commands, hooks):**

The plugin is the single source of truth for all components. No separate
global skill installation is needed.

```bash
# Option A: CLI (recommended)
qoderclicn plugins install /abs/path/to/lazyqoder-plugin

# Option B: Manual cache registration
PLUGIN_CACHE="$HOME/.qoder-cn/plugins/cache/local/lazyqoder"
mkdir -p "$PLUGIN_CACHE"
cp -R lazyqoder-plugin/* "$PLUGIN_CACHE/"
cp -R lazyqoder-plugin/.qoder "$PLUGIN_CACHE/"
chmod +x "$PLUGIN_CACHE"/scripts/hooks/*.sh
chmod +x "$PLUGIN_CACHE"/scripts/state/*.sh
chmod +x "$PLUGIN_CACHE"/scripts/loop/*.sh
```

Then register in `~/.qoder-cn/plugins/installed_plugins_v2.json`:

```json
"lazyqoder@local": [{
  "scope": "user",
  "installPath": "~/.qoder-cn/plugins/cache/local/lazyqoder",
  "version": "0.0.1",
  "source": "local",
  "enabled": true
}]
```

**5. Reload** — `Cmd+Shift+P` → "Reload Window".

**6. Verify in session:**

| Component | Count | How to confirm |
|-----------|------:|----------------|
| Skills (`lazy-*`) | 19 | Type `/` in chat → see `lazy-init-deep`, `lazy-start-work`, etc. |
| Agents (`lazyqoder-*`) | 13 | Available as subagent types (orchestrator, implementer, explorer, etc.) |
| MCP servers | 8 | Visible in MCP status panel |
| Hooks | 12 | Registered lifecycle events (SessionStart, PreToolUse, etc.) |
| Commands | 14 | `/lazyqoder:lazy-<command>` namespace |

### QoderWork — skill-based installation (verified 2026-07-20, macOS)

QoderWork is a task-execution desktop app (qoderwork.com), not an IDE. It
discovers skills by scanning `~/.qoderworkcn/skills/` — any directory containing
a valid `SKILL.md` is immediately available (no restart, no registry file).
LazyQoder integrates as a single unified skill that provides all five core
workflows (init-deep, ulw-plan, start-work, review-work, ulw-loop) via natural
language triggers.

**1. Clone and verify package:**

```bash
git clone --branch v1.0.1 --depth 1 https://github.com/elvinzhao10/LazyQoder.git
cd LazyQoder
bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh
# Expected: PACKAGE_READINESS=full
```

**2. Make scripts executable** (repo may ship without execute bits):

```bash
chmod +x lazyqoder-plugin/scripts/*.sh
chmod +x lazyqoder-plugin/scripts/state/*.sh
chmod +x lazyqoder-plugin/scripts/hooks/*.sh
chmod +x lazyqoder-plugin/scripts/loop/*.sh
chmod +x lazyqoder-plugin/mcp/*/server.sh
```

**3. Install the QoderWork skill:**

```bash
# Option A: Symlink (recommended — stays in sync with the repo)
ln -sfn "$(pwd)/lazyqoder-plugin/qoderwork" "$HOME/.qoderworkcn/skills/lazyqoder"

# Option B: Copy (standalone, does not track repo updates)
mkdir -p "$HOME/.qoderworkcn/skills/lazyqoder"
cp lazyqoder-plugin/qoderwork/SKILL.md "$HOME/.qoderworkcn/skills/lazyqoder/SKILL.md"
```

No registry file, plugin manifest, or restart is required. QoderWork performs a
real-time disk scan on every skill invocation.

**4. (Optional) Register MCP servers for enhanced state management:**

All workflows function with file-based state (`.lazyqoder/`) alone. To use the
bundled MCP servers (run-ledger, verification, status-dashboard, context-graph,
code-intel, docs, codegraph, lsp), add them in QoderWork's MCP settings:

- Open QoderWork → Settings → MCP Servers
- Add each server with command `bash`, args pointing to the absolute path of
  `lazyqoder-plugin/mcp/<name>/server.sh`
- Set env vars: `QODER_PLUGIN_ROOT` = absolute path to `lazyqoder-plugin/`,
  `CWD` = writable workspace root (where `.lazyqoder/runs/` is created)

This step is entirely optional and does not affect core workflow operation.

**5. Verify in a new QoderWork session:**

| Component | How to confirm |
|-----------|----------------|
| Skill discovered | Ask QoderWork "what skills do you have?" — `lazyqoder` appears in the list |
| init-deep | Say "understand this codebase" or "init-deep" with a folder selected |
| ulw-plan | Say "plan how to build X" — produces `.lazyqoder/plans/<slug>.md` |
| start-work | Say "execute the plan" — orchestrates subagents |
| review-work | Say "review my work" — launches 5 parallel review agents |
| ulw-loop | Say "keep working until verified" — goal-driven completion loop |

**QoderWork adaptation notes:**

| Qoder IDE concept | QoderWork equivalent |
|---|---|
| Plugin manifest + `installed_plugins_v2.json` | Disk scan of `~/.qoderworkcn/skills/lazyqoder/` |
| Slash commands (`/lazyqoder:lazy-*`) | Natural language triggers |
| Agent subagents with `isolation: true` | Agent tool with `subagent_type` parameter |
| Hooks (12 lifecycle events) | Encoded in skill procedure steps |
| MCP run-ledger / verification | File-based state in `.lazyqoder/` (MCP optional) |
| Model selector (GLM/DeepSeek/Kimi/MiniMax) | QoderWork automatic model routing |
| 19 separate skills + 14 commands + 13 agents | Single unified `lazyqoder` skill |

The skill source lives at `lazyqoder-plugin/qoderwork/SKILL.md` in the
repository. The full plugin (skills, agents, hooks, MCP, scripts) remains the
canonical reference for workflow logic; the QoderWork skill is the host adapter.

### Qoder IDE CLI

```bash
git clone https://github.com/elvinzhao10/LazyQoder.git
cd LazyQoder
qoder plugin validate lazyqoder-plugin
bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh
bash lazyqoder-plugin/scripts/lazyqoder-plugin-doctor.sh
```

Use Qoder IDE's current plugin discovery flow to locate LazyQoder. Confirm the
publisher and review the exact immutable revision or release reference before
running the host-generated install command.

### Qoder IDE JetBrains / VS Code extension

Use the host plugin/marketplace flow to install the copied package. Restart
the IDE or reload the window if prompted. Confirm a `/lazyqoder:lazy-<command>`
entry and MCP status in a new session.

### Troubleshooting

| Symptom | Fix |
|---------|-----|
| Skills not appearing (Qoder IDE) | Plugin must be registered; check `installed_plugins_v2.json` and reload |
| Skill not appearing (QoderWork) | Check symlink: `ls -la ~/.qoderworkcn/skills/lazyqoder`; ensure `SKILL.md` exists inside; start a new chat session |
| MCP "Read-only file system" | Set `CWD` env var to writable workspace root in `.mcp.json` |
| MCP "script not found" | Run `chmod +x` on all scripts (step 2) |
| Verification "cannot unmarshal array" | Update to latest (`discover_checks` returns `{"checks": [...]}`) |
| Agents/hooks not loading (Qoder IDE) | Plugin must be in `installed_plugins_v2.json`; try full app restart |
| QoderWork skill symlink broken | Re-run `ln -sfn` from the cloned repo directory; verify with `readlink` |

## `offboard` protocol

When the user types `offboard`:

1. Ask which host was used (Qoder IDE IDE, QoderWork, JetBrains extension, VS Code extension, or CLI) and whether the installation was a host plugin/marketplace install.
2. Inspect and report the selected package-owned removal path before changing anything. Remove only an exact, unmodified receipt-owned tooling root through its documented package command; preserve unknown, modified, linked, caller-owned, project, and host-managed assets.
3. Use the selected host's own removal flow. For the Qoder IDE IDE/JetBrains/VS Code extension, remove LazyQoder through the host plugin UI/extension manager and then remove or disable only LazyQoder MCP registrations the user personally added. For QoderWork, remove the symlink or copied directory at `~/.qoderworkcn/skills/lazyqoder/` (verify with `readlink` or `ls` before removing; do not remove other skills). For the Qoder IDE CLI, use the host's plugin removal command and then disable manually registered MCP servers.
4. Never guess paths, scan host directories, delete `.qoder`, `.qoder-plugin`, shared MCP metadata, or remove another host's configuration. Never enable optional tooling while removing it.
5. Report **package result** separately from the **user-observed host result**. The package can prove receipt-safe local removal; only the user can confirm plugin and MCP removal in a new host session. Keep or delete the copied repository only after that observation.

## Host paths

| Host | Safe setup path | Required host proof |
|---|---|---|
| **Qoder IDE IDE** | Install the copied package with the plugin UI; reload if offered. | A `lazy-*` skill and MCP status in a new session. |
| **QoderWork** | Symlink or copy `lazyqoder-plugin/qoderwork/` to `~/.qoderworkcn/skills/lazyqoder/`. | `lazyqoder` skill appears in a new QoderWork session; natural-language workflow triggers respond. |
| **Qoder IDE JetBrains extension** | Use the host plugin/marketplace flow to install the copied package; restart the IDE if prompted. | A `/lazyqoder:lazy-<command>` entry and MCP status in a new session. |
| **Qoder IDE VS Code extension** | Use the host plugin/marketplace flow to install the copied package; reload the window if prompted. | A `/lazyqoder:lazy-<command>` entry and MCP status in a new session. |
| **Qoder IDE CLI** | Use the host plugin validate + install flow, confirm the publisher and an immutable revision or release reference, then begin a new session. | Plugin/MCP activation in that session. |

## MCP and capability boundaries

The package declares eight local MCP servers: `run-ledger`, `verification`,
`status-dashboard`, `context-graph`, `code-intel`, `docs`, `codegraph`, and
`lsp`. A Qoder IDE session or settings page (Agent-mode MCP) must confirm
connection. `context-graph` is heuristic search, not CodeGraph; filesystem and
Playwright are outside this bundled inventory. These map to the **Qoder IDE
Agent-mode MCP** feature.

LazyQoder can select local `rg`, `sg`, supported JS/TS or Python LSP, and
repository-native checks for a task without persisting a host change. Any
fallback is installed only in an explicit receipt-owned tooling root. CodeGraph
is an explicit `install`/`init`/`enable` lifecycle. Context7 and experimental
`grep_app` need explicit selection and manual export/merge; remote requests can
egress data or cost money. Playwright needs explicit browser approval. Normal
onboarding, doctor, and status never activate, start, index, register, or
contact optional providers.

Model routing for any workflow uses the **Qoder IDE Model selector** (GLM /
DeepSeek / Kimi / MiniMax per task), mirroring the OmO quota discipline; the
package does not itself reconfigure the selector.

## Verify

```bash
bash lazyqoder-plugin/scripts/lazyqoder-load-check.sh
bash lazyqoder-plugin/scripts/lazyqoder-plugin-doctor.sh
bash lazyqoder-plugin/scripts/lazyqoder-verify.sh
```

Package readiness is not a host-readiness claim. Perform the applicable host
proof from the table before relying on integration behavior.

## References

- [Public usage guide](README.md)
- [Package commands and safe tooling lifecycle](lazyqoder-plugin/README.md)
- [Public verification evidence](lazyqoder-evaluation.md)
- [Qoder IDE capability mapping](qoder-ide-integration.md)
