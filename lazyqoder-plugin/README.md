# LazyQoder Plugin

> Self-contained workflow harness for Qoder IDE (Alibaba's successor to Tongyi Lingma).

This package belongs to the LazyQoder learning project. It is
primarily inspired by LazyCodex, while the repo-root NOTICE records LazyCodex and
OmO upstream attribution. It is an independent implementation and does not
require LazyCodex or OmO at runtime.

## Quick Start

`.qoder-plugin/plugin.json` is the documented Qoder IDE host entry point (name
`lazyqoder`, version `1.2.2`). This is the verified installable package for the
Qoder IDE IDE, JetBrains and VS Code extensions, and CLI. Onboarding, host
loading, and MCP connection remain user-observed in a live Qoder IDE session.

1. **Onboard** — copy or clone [LazyQoder](https://github.com/elvinzhao10/LazyQoder), open it in the selected Qoder IDE host, and type `onboard`.
2. **Verify the package** — from this `lazyqoder-plugin/` directory, run `bash scripts/lazyqoder-load-check.sh`, then `bash scripts/lazyqoder-plugin-doctor.sh`. These checks report package readiness, not host loading or MCP connection.
3. **Verify the host** — in Qoder IDE, confirm one `/lazyqoder:qoder-<command>` or skill and the eight required MCP connections under Agent-mode MCP.
4. **Use the workflow** — in Qoder IDE, `/lazyqoder:qoder-<command>` commands; where the host does not expose slash commands, make the equivalent natural-language request.

**Verification scope:** macOS only. Repository-level public guides cover the
workflow and host-specific onboarding/offboarding; package readiness remains
package evidence, not proof of live host loading or MCP connection.

## What this plugin provides

LazyQoder provides a workflow harness for Qoder IDE, with every primitive mapped
to a native Qoder IDE feature (see the repo-root qoder-ide-integration.md):

- **Hierarchical project memory** (`/lazyqoder:qoder-init-deep`) — generates `qoder.md` with directory scoring; maps to **Qoder IDE RepoWiki**
- **Prometheus planning** (`/lazyqoder:qoder-ulw-plan`) — decision-complete work plans; never writes product code; maps to **Qoder IDE Quest mode**
- **Orchestrated execution** (`/lazyqoder:qoder-start-work`) — delegates to subagents; never implements directly; maps to **Qoder IDE Agent mode + Subagents**
- **Verified completion loop** (`/lazyqoder:qoder-ulw-loop`) — evidence-backed done claims with adversarial verification; maps to **Qoder IDE Agent mode + Subagents**
- **5-agent parallel review** (`/lazyqoder:qoder-review-work`) — goal/QA/code/security/context; all 5 must pass; maps to **Qoder IDE Expert teams**
- **Ultrawork mode** (`/lazyqoder:qoder-ultrawork`) — binding directive with tier triage and Manual-QA discipline

## Component Map

| Directory | Purpose | Status |
|-----------|---------|--------|
| `skills/` | 14 portable workflow skills (`qoder-*`) | Qoder IDE plugin content |
| `commands/` | 14 current slash-command workflows (`qoder-*`) | Qoder IDE; available after plugin load |
| `agents/` | 13 agent role definitions (`lazyqoder-*`) | Qoder IDE; mirrored to `.qoder/agents/` |
| `hooks/hooks.json` | 12 host hook-event declarations | Qoder IDE; active after plugin load |
| `mcp/` and `.mcp.json` / `.qoder/mcp.json` | 8 local MCP server declarations | Qoder IDE Agent-mode MCP connections |
| `.qoder-plugin/plugin.json` | **Host entry point** | name `lazyqoder`, version `1.2.2` |
| `scripts/` | state, loop, hooks, and validation utilities | Used by package readiness and workflow checks |
| `contracts/` | two verbatim contract JSON files + `.sha256` sidecars | Load-check verified; contents unchanged |
| `templates/AGENTS.md` | reusable onboarding guide | A template; no installer claims it was generated |

## Install

For **Qoder IDE CLI**, discover the current LazyQoder plugin entry through the
host's plugin documentation or UI. Confirm the publisher and review the exact
immutable revision or release reference supplied there before installing; this
repository does not endorse a mutable marketplace URL. For the **Qoder IDE
IDE / JetBrains / VS Code** extensions, install the copied package through the
host plugin flow, then verify a real command/skill and MCP status in a new
session.

### Development validation

```bash
# From lazyqoder-plugin/: validate the package and readiness.
cd lazyqoder-plugin
qoder plugin validate .
bash scripts/lazyqoder-load-check.sh
bash scripts/lazyqoder-plugin-doctor.sh
```

### Marketplace install

For Qoder IDE CLI, use the host's current plugin discovery flow to locate
LazyQoder. Inspect the publisher and the exact immutable revision or release
reference before running the host-generated install command. No reviewed
immutable marketplace reference is bundled here, so this guide intentionally
does not provide a marketplace-add URL or an executable install command.

For the Qoder IDE IDE / JetBrains / VS Code extensions, use the current host
plugin UI to install the copied package, run the host's reload action when
exposed, then inspect a new session for a loaded `/lazyqoder:qoder-<command>`
entry and MCP status. Use the host's own uninstall/remove flow; installation
locations are host-managed.

## Uninstall

Use the Qoder IDE host's plugin removal flow for an IDE / JetBrains / VS Code /
CLI installation, then remove or disable only the LazyQoder MCP servers that
were manually registered. Never guess, scan for, or delete host-managed
installation paths, `.qoder` state, or MCP configuration belonging to another
host. The copied repository is independent of host removal and may be deleted
only after the host confirms the plugin/skills and connectors are gone. The root
`offboard` protocol (see the repo-root AGENTS.md) records this package result
separately from the user-observed host result.

## Verify

```bash
# Run from lazyqoder-plugin/.
bash scripts/lazyqoder-plugin-doctor.sh

# Smoke test: checks SKILL.md frontmatter and command stubs.
bash scripts/lazyqoder-smoke-test.sh

# Docs check: verifies no broken internal links, including templates/AGENTS.md.
bash scripts/lazyqoder-docs-check.sh

# Aggregate verification: doctor, smoke, docs, security, MCP, and hooks.
bash scripts/lazyqoder-verify.sh
```

Package readiness, doctor, and capability-status output are read-only package
evidence. They do not activate optional providers, install a global host
integration, or prove that a live host session connected an MCP server.

Verification timeouts are best-effort cleanup for trusted package-owned
commands. Each command receives its own process group; a deadline terminates
that group and reports any still-detectable descendants in JSON/stderr. This is
not a security sandbox or a guarantee that every descendant stopped. Use a VM or
container-backed runner for genuinely untrusted commands; no no-fork sandbox is
enabled by default.

## Optional local tooling

LazyQoder can use a local, package-owned fallback for `rg` (ripgrep) and `sg`
(ast-grep). It first detects compatible host tools without changing them. When
one is missing, installation is allowed only into an empty, absolute tooling
root chosen by the caller; it never installs into a target project, global
location, or host-managed path.

```bash
# Inspect host/owned providers without changing anything.
bash scripts/lazyqoder-tooling.sh detect --tooling-root /absolute/path/to/lazyqoder-tools

# Install locked fallback tools only when host providers are missing.
bash scripts/lazyqoder-tooling.sh install --tooling-root /absolute/empty/lazyqoder-tools

# Inspect repository-native checks without running them.
bash scripts/lazyqoder-tooling.sh verify --target /absolute/project --dry-run

# Run only explicitly selected, declared checks with a 60-second default limit.
bash scripts/lazyqoder-tooling.sh verify --target /absolute/project --run lint test

# Remove only an unmodified LazyQoder receipt-owned tooling root.
bash scripts/lazyqoder-tooling.sh uninstall --tooling-root /absolute/path/to/lazyqoder-tools
```

Repository verification recognizes package-manager lockfiles plus declared
`lint`, `typecheck`, `test`, and `build` scripts, explicit
`[tool.lazyseries.verification]` commands in `pyproject.toml`, and declared
Make targets. Dry runs do not change the target. Runs do not install target
dependencies or guess commands; a timed-out selected check exits `124`.

### Automatic capability selection and approvals

The installed package carries the versioned automatic-tooling contract and its
provider-policy adapter. Start with an offline status check or create the
reference-only user configuration:

```bash
bash scripts/lazyqoder-tooling.sh setup --non-interactive --json
bash scripts/lazyqoder-tooling.sh providers --policy ask-once --json
```

Automatic work is task-scoped: the broker selects the lightest eligible
provider for that task and does not write host MCP configuration or export a
registration. Local providers are free/read-only where available. Remote,
metered, browser, and architecture capabilities remain approval-aware; use
`approval grant|deny|revoke` with an explicit workspace, capability, provider,
and scope before persistent consent is recorded. Provider output identifies
cost, reachability, credential-reference state, and the current decision. Model
routing mirrors the OmO quota discipline through the **Qoder IDE Model selector**.

`remote-enable` is a separate persistent compatibility command. It records an
explicit optional Context7 or `grep_app` selection only in the verified
tooling root; `remote-export-mcp` prints a namespaced merge fragment for the
host UI. Neither command edits host configuration, replaces host entries, or
writes raw credentials. Treat every remote call as potential data egress and
cost even when its provider is marked read-only.

Playwright is also disabled until an approval decision permits browser
automation. CodeGraph remains a separate explicit install/init/enable flow;
the automatic broker does not create an index, launch a process, or enable
telemetry. The local `context-graph` MCP remains only a grep-based fallback.

### Optional language-aware navigation

LazyQoder can bridge a real language server over stdio for JavaScript/
TypeScript and Python only. It first detects source/configuration, then uses a
compatible project-local or host provider without changing it. If neither is
available, provision exactly one selected language into a separate empty,
absolute LSP tooling root. The bridge exposes only read-only operations the
provider advertises: definition, references, symbols, hover/type information,
and diagnostics. Rename is intentionally unavailable.

```bash
# Inspect without changing the project or tooling root.
bash scripts/lazyqoder-tooling.sh lsp-status \
  --target /absolute/project --tooling-root /absolute/lazyqoder-lsp-tools

# Provision the detected TS/JS or Python provider only in the empty root.
bash scripts/lazyqoder-tooling.sh lsp-install \
  --target /absolute/project --tooling-root /absolute/empty/lazyqoder-lsp-tools

# A host MCP configuration can launch this package-owned stdio bridge.
CWD=/absolute/project LAZYQODER_TOOLING_ROOT=/absolute/lazyqoder-lsp-tools \
  bash mcp/lsp/server.sh

# Remove only an unmodified LSP receipt-owned root.
bash scripts/lazyqoder-tooling.sh lsp-uninstall \
  --target /absolute/project --tooling-root /absolute/lazyqoder-lsp-tools
```

The locked TS/JS provider is `typescript-language-server@5.3.0` with
`typescript@5.9.3`; it requires Node.js 20 or newer. The locked Python
provider is `basedpyright@1.39.9`. Missing, unsupported, and incompatible
providers are non-blocking readiness states. No target manifest, lockfile,
source file, global path, or host-managed configuration is modified.

### Conditional CodeGraph architecture exploration

CodeGraph is an optional, real local MCP capability for larger architecture and
cross-file relationship questions. It is disabled by default. LazyQoder keeps
`context-graph` available as a clearly labeled grep-based heuristic fallback;
it is not represented as semantic CodeGraph analysis.

CodeGraph is pinned to `@colbymchenry/codegraph@1.4.1` and can only be
provisioned in an explicit empty caller-owned tooling root. The lifecycle does
not invoke upstream `codegraph install` or `codegraph uninstall`, download a
fallback platform binary, enable CodeGraph telemetry, or change host MCP
configuration. Its npm cache, npm configuration, Python cache, and CodeGraph
runtime are confined to the receipt-owned tooling root. Start only after you
deliberately choose a project root:

```bash
# Inspect only. This never starts CodeGraph or creates .codegraph/.
bash scripts/lazyqoder-tooling.sh codegraph-doctor \
  --target /absolute/project --tooling-root /absolute/lazyqoder-codegraph-tools

# Provision the pinned package, build the project-local index, then enable it.
bash scripts/lazyqoder-tooling.sh codegraph-install \
  --target /absolute/project --tooling-root /absolute/absent/lazyqoder-codegraph-tools
bash scripts/lazyqoder-tooling.sh codegraph-init \
  --target /absolute/project --tooling-root /absolute/lazyqoder-codegraph-tools
bash scripts/lazyqoder-tooling.sh codegraph-enable \
  --target /absolute/project --tooling-root /absolute/lazyqoder-codegraph-tools

# Print an explicit MCP registration fragment; merge it through the host UI.
bash scripts/lazyqoder-tooling.sh codegraph-export-mcp \
  --target /absolute/project --tooling-root /absolute/lazyqoder-codegraph-tools

# Remove only an index proven by LazyQoder's receipt, then remove the tooling root.
bash scripts/lazyqoder-tooling.sh codegraph-uninstall \
  --target /absolute/project --tooling-root /absolute/lazyqoder-codegraph-tools
bash scripts/lazyqoder-tooling.sh uninstall \
  --tooling-root /absolute/lazyqoder-codegraph-tools
```

`codegraph-doctor` recommends the capability only at 500 supported source files
or 100,000 supported source lines. It makes no network, process, or index call.
The MCP launcher invokes only `codegraph serve --mcp` with fallback download
disabled. A pre-existing `.codegraph/` directory is preserved by uninstall.

### Optional remote documentation and example search

Context7 and `grep_app` are optional remote MCP registration fragments, not
bundled MCP servers and not part of the eight-server package declaration. They
are disabled by default: install, status, and doctor never contact either
endpoint. Select one only when it materially helps: Context7 for current,
version-specific library documentation; experimental, unpinned `grep_app` for
public GitHub examples when local evidence is insufficient.

Use a verified receipt-owned tooling root, then export the fragment and merge
it through the host UI without replacing existing MCP entries. The fragment
uses namespaced keys, contains endpoints only, and deliberately contains no
credentials; any credential remains in the user's host environment.

```bash
# Inspect optional state without making a remote request.
bash scripts/lazyqoder-tooling.sh remote-status \
  --tooling-root /absolute/lazyqoder-tools

# Enable only the desired registration fragments.
bash scripts/lazyqoder-tooling.sh remote-enable \
  --tooling-root /absolute/lazyqoder-tools context7
bash scripts/lazyqoder-tooling.sh remote-enable \
  --tooling-root /absolute/lazyqoder-tools grep_app

# Print a merge-only MCP fragment; it does not edit host configuration.
bash scripts/lazyqoder-tooling.sh remote-export-mcp \
  --tooling-root /absolute/lazyqoder-tools

# Disable an optional registration without touching any host entry.
bash scripts/lazyqoder-tooling.sh remote-disable \
  --tooling-root /absolute/lazyqoder-tools context7
```

## License

MIT — see the package the repo-root LICENSE and NOTICE.

---

_This is the installable Qoder IDE package for LazyQoder. The host entry point is `.qoder-plugin/plugin.json`; the bundled package never writes host configuration, credentials, or marketplace state._
