# Host routes

## Published v1.3.2 route and host readiness

This guide is the published v1.3.2 documentation boundary for `qodercli-cli`,
`qodercli-ide`, and `qoder`; native-host readiness remains pending.
Marketplace is the default full-plugin route for Qoder CLI and the Qoder app.
The manual Skills/MCP route is recovery-only and mutually exclusive with a
full-plugin route for one project.

v2 reports native mode as `invoke-documented`, `observe-only`,
`descriptor-only`, or `unavailable`; public label as `documented-tested`,
`documented-untested`, `observed-build-specific`, or `unavailable`; and
evidence scope as `package`, `probe`, or `current-session`. A `package` result
does not prove a live host, and a `probe` never substitutes for a
current-session receipt.

Automatic workflow selection chooses the smallest sufficient existing workflow
from task risk and complexity. Before a current host observation it is
selection-only, not evidence that a host loaded or dispatched that workflow.

Use **Node.js LTS 24 (recommended) or 22 (supported alternative)** and **Git**. The lifecycle also accepts Node.js LTS 20 for compatibility. Bootstrap `onboard` only from
`https://github.com/elvinzhao10/LazyQoder.git`; then run `update`, `status`,
and plan-first `offboard` through
`node "<install-root>/LazyQoder/launcher.js"`. The exact durable tree is
`LazyQoder/{active.json,launcher.js,releases/,receipts/,rollback/,staging/,locks/}`.
The source checkout may be deleted. A moved same-version ref needs
`--confirm-revision <full-sha>`; stale runtime recovery is scoped
offboard/re-onboard, never a receipt edit. None of these package facts changes
**HOST READINESS: PENDING** without observation.

Open or link the durable release selected by `status` in the selected host, give the agent
`https://github.com/elvinzhao10/LazyQoder`, and type `onboard`. The agent
detects or asks for the host, runs package checks and safe local setup, then
reports **package readiness** separately from **host readiness**.

Before a marketplace, plugin, Skills, connector, account, or credential change,
the agent asks for explicit approval. It then gives exactly one GUI/host action
and waits. After the response it inspects the app with Computer Use. A reload
or new session is a later one-action handoff. Verify one real Skill/command and
every expected MCP connection; without that observation, host readiness is
**pending**. If Computer Use is unavailable, a user-pasted verbatim status or
screenshot is observed evidence; otherwise **HOST READINESS: PENDING**.

Route status is explicit: the local marketplace is the **documented Qoder CLI
CLI route and the preferred Qoder CLI route whenever the Qoder CLI is
available**. The Qoder app uses `.qoder-plugin/plugin.json` as its default
marketplace full-plugin route. The `manual-skills-mcp-fallback` is recovery
only. These labels never prove the current build.
The supplied historical reports do not establish an exact Qoder app or IDE
build, or any current-session activation. The Qoder CLI exact version/build is
also unrecorded. Qoder host routes and GUI flows remain **HOST READINESS:
PENDING** until observed in a fresh current build.

Public contract references: Qoder CLI documents [local plugin
marketplaces](https://www.qodercli.ai/docs/cli/plugin-marketplaces),
[project settings scopes](https://www.qodercli.ai/docs/cli/qodercli-dir),
[IDE Skills](https://www.qodercli.ai/docs/ide/Features/Skills), and [IDE MCP
JSON](https://www.qodercli.ai/docs/ide/User-guide/MCP). Qoder IDE publicly
documents its [MCP settings UI](https://www.qoder.ai/docs/qoder/From-Beginner-to-Expert-Guide/Function-Description/MCP-Guide), not universal
directory-marketplace compatibility.

| Host route | Safe package artifact | Required host observation |
| --- | --- | --- |
| **Qoder IDE** | When the CLI is available (`qodercli`), use the same user-scope release-root marketplace route as Qoder CLI. The desktop GUI route is only an observed-build alternative; the supplied GUI Add local-directory flow failed. | Use the CLI marketplace route below and inspect the IDE's fresh session. If the CLI is unavailable, record that limitation and choose the Skills/manual-MCP fallback explicitly. |
| **Qoder CLI** | Absolute release-root marketplace metadata and package validation. The nested `lazyqoder-plugin/` path is not the marketplace root. | Use the three separate actions below. After installation and a fresh session observe one real Skill/command plus all six MCP connections. |
| **Qoder app full plugin** | The active release's `lazyqoder-plugin/.qoder-plugin/plugin.json`, declaring Skills, commands, agents, hooks, and `.mcp.json`. | Use the marketplace/plugin surface exposed by the current build. A current receipt must bind the active source/version and same build/session, and observe one loaded Skill, command, agent, hook, and all six MCP servers. |
| **Qoder app recovery fallback** | Import/copy `lazyqoder-plugin/skills/` only, then configure each of six local MCP connectors manually. | Use only after receipt-scoped removal of the full-plugin route. Observe one imported Skill and each connector; commands, agents, and hooks remain excluded. |

## Qoder IDE GUI alternative (observed-build only)

This route is conditional for Qoder IDE only, when the Qoder CLI route
is unavailable and the current app visibly offers a local-directory
marketplace. It is not the documented CLI route and must not be inferred from
the presence of a manifest. The supplied build's GUI Add local directory flow
failed, so do not send users here by default. Perform one action, wait, and
inspect before the next:

1. After approval, open the host's **Plugins / Marketplace → Add local
   directory** GUI, choose the absolute release root containing
   `.qodercli-plugin/marketplace.json`, and wait.
2. Inspect the version the marketplace actually displays. v1.3.2 is the
   published stable release; do not infer host activation from this
   documentation or install in the discovery action. If the control or marketplace is absent, record the
   current host version/build and exact error as `UNAVAILABLE`, leave **HOST
   READINESS: PENDING**, and select the fallback only as a later action.
3. After separate approval, click **Install** for `lazyqoder@lazyqoder`, then
   wait and inspect the installation result.
4. Fully quit the host, then wait.
5. Reopen the host, then wait.
6. Start a fresh session for `<project-root>`, then wait for inspection.
7. Verify one real loaded Skill or command and make a live call through each of
   `run-ledger`, `verification`, `status-dashboard`, `context-graph`,
   `code-intel`, and `docs`. A marketplace row, cache, or connector-panel count
   is not live proof.

## Qoder app marketplace full-plugin boundary

The nested `.qoder-plugin/plugin.json` remains the default installation
source even without a public manifest schema. Never inspect or mutate private
Qoder app registries. Use only a marketplace/plugin action exposed by the
current build, one approved host action at a time.

This package preflight remains read-only:

```bash
bash lazyqoder-plugin/scripts/lazyqoder-qoder-preparation-check.sh \
  --project-dir "<absolute-project-root>"
```

It prints `HOST_PREPARATION=not-applied`, `HOST_MUTATION=none`, and
`HOST_READINESS=pending`; `--apply` refuses. It is not an installer or host
proof. Durable `status --host qoder` emits observation, removal, and
recovery receipt templates. Package-only checks remain pending. A receipt is
ready only when its active source/version, current build/session, loaded Skill,
command, agent, hook, and all six MCP statuses validate together.

## Qoder CLI local marketplace

Pass the absolute **release root** containing `.qodercli-plugin/marketplace.json`
printed by durable `status --route qodercli-marketplace` to the local
marketplace:

```text
qodercli plugin marketplace add "<active-durable-release-root>"
qodercli plugin install lazyqoder@lazyqoder
```

Inside a Qoder CLI session, the interactive `/plugin` menu is equivalent; do
not use the slash forms as terminal commands. `--plugin-dir
<absolute-release-root>` is for development/testing only, never
persistent, and is not a marketplace install. Do not automate trust or
installation.

The Qoder CLI handoff has three separate future user actions:

1. **Discover:** after approval, add the absolute release root and wait while
   the agent uses Computer Use to observe discovery of `lazyqoder@lazyqoder`.
   Do not install yet.
2. **Install:** after a separate approval, install `lazyqoder@lazyqoder`, wait,
   and inspect the install result. Do not restart in the same action.
3. **Restart and observe:** as a later action, start a fresh Qoder CLI session,
   then inspect one real Skill/command plus all six MCP connections.

Do not combine these actions or claim host readiness from marketplace JSON.

### Qoder CLI native plan and task observations

The CLI-backed user-scope marketplace remains the default Qoder CLI
installation route. After installation, the package can generate a pending
native-surface template without reading private IDE state:

```bash
node lazyqoder-plugin/scripts/lazyqoder-qodercli-ide-surfaces.js template \
  --project-root "<workspace-root>" \
  --primary-root "<workspace-root>" \
  --branch "<branch>" \
  --marketplace "<release-root>/.qodercli-plugin/marketplace.json" \
  --output "<pending-receipt.json>" \
  --json
```

Use `observe --template <pending-receipt.json> --observation
<sanitized-host-observation.json> --output <observed-receipt.json> --json` to
ingest a current observation. The record covers `.qodercli/plans`, Plan
Design/Todo, workspace-grouped tasks, queue/parallel status, Skill management,
automation status, primary root/branch, and task continuation. It remains
non-promoting: host readiness stays pending until the normal fresh-session
host verification completes. Multiple workspace roots require an explicit
primary root, and marketplace version, root, and fingerprint are part of the
freshness boundary.

Generate the companion MCP, preview, artifact, and checkpoint descriptor from
that pending native template without contacting the host:

```bash
node lazyqoder-plugin/scripts/lazyqoder-qodercli-ide-surfaces.js evidence-template \
  --template "<pending-receipt.json>" \
  --output "<evidence-template.json>" \
  --json
```

`evidence-observe --template <evidence-template.json> --observation
<sanitized-evidence-observation.json> --output <evidence-receipt.json> --json`
accepts only current, marketplace/workspace-bound evidence. The descriptor
lists `openFile`, `openDiff`, and `close_tab` as documented invocation surfaces
and keeps the package invocation status `not-performed`; diagnostics and all
other surfaces are observation-only. Diagnostics must be current and
read-only, preview errors require verification-evidence digests, and every
artifact/file/change entry requires a content digest. Unsupported MCP OAuth,
Sampling, Prompts, or Resources capability remains explicitly `unavailable`.
Secret material is rejected. Native checkpoints cannot cover external files
or advance the run ledger, and every receipt remains non-promoting.

`.qodercli/settings.json` is the shareable non-secret project scope;
`.qodercli/settings.local.json` is local/machine scope and must remain ignored
and unstaged; secrets must never be committed. Repeating safe package checks
preserves both files and does not write host configuration.

## Manual connector specification

This is the non-mutating, paste-ready source for the Qoder CLI and
Qoder IDE Skills/manual-MCP fallback. Replace both placeholders with permanent
absolute paths before asking to change host settings. Do not edit the shipped
`lazyqoder-plugin/.mcp.json`.

```json
{
  "mcpServers": {
    "run-ledger": {
      "command": "bash",
      "args": ["<release-root>/lazyqoder-plugin/mcp/run-ledger/server.sh"],
      "cwd": "<project-root>",
      "env": {"CWD": "<project-root>", "QODER_PROJECT_DIR": "<project-root>"}
    },
    "verification": {
      "command": "bash",
      "args": ["<release-root>/lazyqoder-plugin/mcp/verification/server.sh"],
      "cwd": "<project-root>",
      "env": {"CWD": "<project-root>", "QODER_PROJECT_DIR": "<project-root>"}
    },
    "status-dashboard": {
      "command": "bash",
      "args": ["<release-root>/lazyqoder-plugin/mcp/status-dashboard/server.sh"],
      "cwd": "<project-root>",
      "env": {"CWD": "<project-root>", "QODER_PROJECT_DIR": "<project-root>"}
    },
    "context-graph": {
      "command": "bash",
      "args": ["<release-root>/lazyqoder-plugin/mcp/context-graph/server.sh"],
      "cwd": "<project-root>",
      "env": {"CWD": "<project-root>", "QODER_PROJECT_DIR": "<project-root>"}
    },
    "code-intel": {
      "command": "bash",
      "args": ["<release-root>/lazyqoder-plugin/mcp/code-intel/server.sh"],
      "cwd": "<project-root>",
      "env": {"CWD": "<project-root>", "QODER_PROJECT_DIR": "<project-root>"}
    },
    "docs": {
      "command": "bash",
      "args": ["<release-root>/lazyqoder-plugin/mcp/docs/server.sh"],
      "cwd": "<project-root>",
      "env": {"CWD": "<project-root>", "QODER_PROJECT_DIR": "<project-root>"}
    }
  }
}
```

Every entry uses `bash`, its absolute release-local `server.sh`, and explicit
consumer-project context in both `cwd` and the `CWD` /
`QODER_PROJECT_DIR` environment. Never fall back to the package directory
or caller shell directory. After approval, add exactly one named connector,
wait; handle a trust prompt as a separate action, wait; then inspect that
connector before proceeding to the next one.

## Qoder IDE / Qoder app Skills/manual-MCP boundary

The supported copied-repository route is Skills-only import/copy from
`lazyqoder-plugin/skills/` plus six individual manual local MCP connectors in
Settings. A package file, manifest, or `lazyqoder-load-check.sh` result must
never be described as loading commands, Agents, hooks, or MCP. The fallback
explicitly excludes commands, Agents, and hooks. Use the full-plugin route only
when the current loaded host proves it; otherwise retain **HOST READINESS:
PENDING** for unsupported capabilities.

### Route coexistence and migration

The full plugin route and the Skills/manual-MCP fallback are mutually exclusive
and unsupported together for a project. Do not import the fallback Skills or add its six manual MCP
connectors while a full LazyQoder plugin session is active; the routes can
double-load Skills or MCP processes, and package checks cannot declare that
both routes are live.

To switch routes safely:

1. Stop the current host session.
2. Remove only LazyQoder's old plugin/Skills entry and its six connectors using
   the host's own UI. Do not scan or edit host-private files.
3. Choose exactly one route: full plugin installation, or Skills import plus
   manual MCP connectors.
4. Start a fresh session and verify the selected route's required Skill or
   command and all six expected MCP connections.

The package result remains `readiness_scope=package-ready`; the fallback is the
`manual-skills-mcp-fallback` scope, while an observed build route or live host
proof must be recorded separately.

## Troubleshooting the handoff

- **Marketplace entry missing:** confirm the absolute path is the release root
  containing `.qodercli-plugin/marketplace.json`, wait after the add action,
  and start a new session only as a later action. Do not substitute persistent
  `--plugin-dir`; it remains development/testing only, never persistent.
- **IDE plugin route unavailable:** use the documented Skills import and manual
  MCP JSON fallback. Do not claim commands, agents, or hooks on that route.
- **Qoder IDE shows duplicate Skills or MCP processes:** stop the session and
  follow the migration checklist above. Never keep plugin and manual routes
  active together.
- **Connector panel and live calls disagree:** record both as build-specific
  observations. Package checks and a panel count alone do not prove a live
  connection; verify each expected MCP through the current host surface.
- **MCP starts in the wrong project:** each manual connector must use the
  absolute release-owned launcher and explicit consumer project context. Stop
  rather than falling back to the package directory or caller shell directory.

## Minimal live-test prompt

After the approved setup and required fresh session, send:

> Use one loaded LazyQoder Skill or command appropriate to this route for a
> harmless read-only project check. Then test `run-ledger`, `verification`,
> `status-dashboard`, `context-graph`, `code-intel`, and `docs`. Report the
> host/build and each capability as observed or unavailable with the exact
> error; keep package readiness separate from host readiness. Do not infer from
> files or connector counts.

## Package boundary and removal

`lazyqoder-load-check.sh`, `lazyqoder-plugin-doctor.sh`, and local metadata
validation establish package readiness only. They do not prove plugin
discovery, marketplace activation, SessionStart, hook execution, a running
session, or MCP connection. Use the host's own plugin/Skills removal flow and
remove only connectors the user added. Never scan or guess host paths; report
package removal separately from the user-observed host result.
