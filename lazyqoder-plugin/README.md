# LazyQoder Plugin

The package source in this worktree is the published stable v1.3.1 release. Package readiness does not prove native-host activation.

## Published stable v1.3.1 installation

**Node.js LTS 24 (recommended) or 22 (supported alternative)** and **Git** are recommended. The lifecycle also accepts Node.js LTS 20 for compatibility. Bootstrap `onboard` only
from `https://github.com/elvinzhao10/LazyQoder.git`, then use
`node "<install-root>/LazyQoder/launcher.js"` for `update`, `status`,
`recover-bootstrap-lock`, and plan-first `offboard`. The exact tree is
`LazyQoder/{active.json,launcher.js,releases/,receipts/,rollback/,staging/,locks/}`;
the source checkout may be deleted. Same-version ref movement requires
`--confirm-revision <full-sha>`, and a stale runtime requires scoped
offboard/re-onboard rather than receipt edits. Package success leaves **HOST
READINESS: PENDING** without current observation. Historical Qoder IDE feedback
about undocumented host state is not an installation route.

> Self-contained workflow harness for Qoder CLI, Qoder IDE, and the Qoder app's Skills/manual-MCP fallback.

This package belongs to the LazyQoder learning project. It is
primarily inspired by LazyCodex, while [NOTICE](NOTICE) records LazyCodex and
OmO upstream attribution. It is an independent implementation and does not
require LazyCodex or OmO at runtime.

## Durable onboarding

Bootstrap the published stable v1.3.1 route from a verified official source checkout, then use the
durable launcher rather than treating that checkout as the installed runtime:

```bash
node "<verified-source-root>/lazyqoder-plugin/scripts/lazyqoder-lifecycle.js" \
  onboard --source https://github.com/elvinzhao10/LazyQoder \
  --install-root "<absolute-install-root>" --project "<absolute-project-root>" --json
node "<install-root>/LazyQoder/launcher.js" status \
  --install-root "<install-root>" --project "<project-root>" --json
```

The source checkout is transport only and may be removed after promotion. The
durable install root must be absolute, non-root, and outside disposable
downloads or caches. Open or link the active durable release in the selected
Qoder CLI, Qoder IDE, or Qoder app host, give the agent `https://github.com/elvinzhao10/LazyQoder`,
and type `onboard`. The agent asks which host is in use, runs safe package
checks, and reports **package readiness** separately from **host readiness**.
Before any host-managed marketplace, plugin, Skills, connector, account, or
credential action it asks for approval, then gives one exact action and waits.
After the response it inspects the app with Computer Use; reload/new session is
a separate action. If Computer Use is unavailable, a user-pasted verbatim
status or screenshot is observed evidence. Without either, **HOST READINESS:
PENDING**.

If lifecycle state collides with an existing path, preserve the caller
workspace. Only an explicitly verified lifecycle-owned sibling bootstrap lock
or product `staging/`/`locks/` artifact is recoverable; never remove or replace
caller workspace files.

Route status is explicit: the local marketplace is the **documented Qoder CLI
CLI route and the preferred Qoder CLI route whenever the CLI is
available**. The Qoder app uses `.qoder-plugin/plugin.json` as its default
marketplace full-plugin route. `manual-skills-mcp-fallback` is recovery-only.
None is current host proof until observed.

## Quick Start

`.qodercli-plugin/plugin.json` is the documented Qoder CLI host entry point.
`.qoder-plugin/plugin.json` is the Qoder app marketplace source for Skills,
commands, agents, hooks, and all six MCP servers. Package metadata remains
pending until current build/session evidence is observed. Skills import/copy
plus six individual manual local MCP connectors is recovery-only.

1. **Onboard** — bootstrap the durable release, open or link that active
   release in the selected host, and type `onboard` after providing the GitHub
   repository link.
2. **Verify the package** — from this `lazyqoder-plugin/` directory, run `bash scripts/lazyqoder-load-check.sh`, then `bash scripts/lazyqoder-plugin-doctor.sh`. These checks report package readiness, not host loading or MCP connection.
3. **Verify the host** — in Qoder CLI, confirm one `/lazyqoder:lazy-<command>` or Skill and all six MCP connections in a new session. In Qoder IDE, confirm an imported Skill and each manually configured local connector; do not infer commands, agents, hooks, or MCP loading from files or load-check output without full-plugin proof.
4. **Use the workflow** — in Qoder CLI, `/lazyqoder:lazy-<command>` commands; in Qoder IDE, use the equivalent natural-language workflow or imported skill unless a verified plugin session exposes a command.

**Verification scope:** CI package checks run on Ubuntu and macOS per the workflow; supplied live-host observations are historical macOS reports. Repository-level public guides cover the
workflow and host-specific onboarding/offboarding; package readiness remains
package evidence, not proof of live host loading or MCP connection.

## What this plugin provides

LazyQoder provides a workflow harness for Qoder CLI, Qoder IDE, and the Qoder app. Qoder app plugin/marketplace behavior must be verified in a live session; its local fallback uses imported skills:

- **Hierarchical project memory** (`/lazyqoder:lazy-init-deep`) — generates `qoder.md` with directory scoring
- **Prometheus planning** (`/lazyqoder:lazy-ulw-plan`) — decision-complete work plans; never writes product code
- **Orchestrated execution** (`/lazyqoder:lazy-start-work`) — delegates to subagents; never implements directly
- **Verified completion loop** (`/lazyqoder:lazy-ulw-loop`) — evidence-backed done claims with adversarial verification
- **5-agent parallel review** (`/lazyqoder:lazy-review-work`) — goal/QA/code/security/context; all 5 must pass
- **Ultrawork mode** (`/lazyqoder:lazy-ultrawork`) — binding directive with tier triage and Manual-QA discipline

### Model routing

LazyQoder maps task classes to host-native routing recommendations. Subagents
inherit the current model unless a plan explicitly enables switching. The package
does not choose a concrete backing model, configure a provider, or overwrite a
user-selected session model. See [Model routing](docs/model-routing.md) for the
read-only helper, Qoder CLI per-agent override preview, custom-model boundary,
and current-host verification steps.

### Execution evidence and recovery

`lazy-start-work` dispatches a compact `TASK/DELTA/REFS/VERIFY` record rather
than copying the whole plan into each worker prompt. The record binds the
current run/task/revision and criteria to an owned-path delta, read-only
pre-task provenance, artifact references, and once-validated plan argv. The
validator rejects shell composition plus destructive, remote, host-mutating,
or approval-requiring argv before dispatch; it does not execute those commands.

Runtime criteria need a real package/public entry artifact, and stateful
criteria also need a before/after transition artifact. A lost worker result can
update memory only through a complete, current identity-bound terminal report
whose artifact references are readable. Five-lane review retains unaffected
current PASS lanes and reruns only failed, missing, stale, or input-affected
lanes. If `create-run` is interrupted before `state.json` exists,
`recover-run.sh` rolls back only its transaction material, preserves caller
files, and leaves the run eligible for retry.

## Component Map

| Directory | Purpose | Status |
|-----------|---------|--------|
| `skills/` | 14 portable workflow skills | Qoder CLI plugin content; verified Qoder app local import source |
| `commands/` | 14 current slash-command workflows | Qoder CLI; Qoder app only after a verified plugin/marketplace session |
| `agents/` | 13 agent role definitions | Qoder CLI; Qoder app only after a verified plugin/marketplace session |
| `hooks/hooks.json` | 12 host hook-event declarations | Qoder CLI; Qoder app only after a verified plugin/marketplace session |
| `mcp/` and `.mcp.json` | 6 local MCP server declarations | Qoder CLI declarations; manual connector configuration is the verified Qoder app fallback |
| `scripts/` | state, loop, hooks, and validation utilities | Used by package readiness and workflow checks |
| `templates/AGENTS.md` | reusable onboarding guide | A template; no installer claims it was generated |

## Install

For **Qoder CLI**, use the local release-root marketplace route below. For
**Qoder IDE**, use that same CLI marketplace route whenever the `qodercli`
CLI is available; the supplied GUI Add local directory flow failed. If the CLI
is unavailable, use the public Skills/manual-MCP fallback or an observed-build
GUI route only after current discovery. For the **Qoder app**, use the supported
Skills/manual-MCP fallback. Historical full-plugin feedback did not establish a
public installation contract. If a required control is unavailable, record
the build/error with **HOST READINESS: PENDING**.

### Development validation

```bash
# From lazyqoder-plugin/: validate the package and readiness.
cd lazyqoder-plugin
qodercli plugin validate .
bash scripts/lazyqoder-load-check.sh
bash scripts/lazyqoder-plugin-doctor.sh

# Optional and explicit; the default never executes PATH qodercli.
bash scripts/lazyqoder-plugin-doctor.sh \
  --host-validator "/absolute/path/to/qodercli"
```

### Marketplace install

For Qoder CLI, run durable `status --route qodercli-marketplace` and pass
the printed active durable **release root** containing
`.qodercli-plugin/marketplace.json` (not the nested `lazyqoder-plugin/`
directory) to the local marketplace, then install the named entry:

```text
qodercli plugin marketplace add "<active-durable-release-root>"
qodercli plugin install lazyqoder@lazyqoder
```

Inside a Qoder CLI session, the interactive `/plugin` menu is equivalent:
choose Marketplace → Add with the same release-root path, then install
`lazyqoder@lazyqoder`. Do not use the slash forms as terminal commands.
`--plugin-dir <absolute-release-root>` is for development/testing only,
never persistent, and does not replace this route. Do not automate Qoder CLI
marketplace trust or host installation.

Treat the route as three separate future user actions. First, add the absolute
release root and wait for the agent to observe marketplace discovery; do not
install yet. Second, after a separate approval, install
`lazyqoder@lazyqoder` and wait for the install result. Third, start a fresh
session and observe one real Skill/command plus all six MCP connections.
Package metadata alone is not host readiness.

### Qoder IDE route

When the CLI is available (`qodercli`), add the absolute release root using the
same two commands above, then restart the IDE and inspect a fresh session. The
GUI Add local directory flow is only an observed-build alternative and failed
in the supplied build. If the CLI is unavailable, import `skills/` and add the
six compatible local MCP connectors manually. For the observed GUI alternative,
add the release root, wait for discovery, install separately, fully restart,
and verify a fresh session.

### Qoder app marketplace full-plugin boundary

The nested `.qoder-plugin/plugin.json` remains the default marketplace
source even without a public manifest schema. Never inspect or mutate private
Qoder app registries. This package preflight remains read-only:

```bash
bash lazyqoder-plugin/scripts/lazyqoder-qoder-preparation-check.sh \
  --project-dir "<absolute-project-root>"
```

It prints `HOST_PREPARATION=not-applied`, `HOST_MUTATION=none`, and
`HOST_READINESS=pending`; `--apply` refuses. Durable `status --host qoder`
emits exact current-session, removal, and recovery receipt templates. The
Skills/manual-MCP fallback is recovery-only and excludes commands, agents, and
hooks.

For the fallback, derive a non-mutating host-settings copy from `.mcp.json`: replace
`${QODER_PLUGIN_ROOT}` with the absolute plugin root and
`${QODER_PROJECT_DIR}` with the absolute consumer project, and set both
`cwd` and environment `CWD` / `QODER_PROJECT_DIR` to that project. The exact
six server names are `run-ledger`, `verification`, `status-dashboard`,
`context-graph`, `code-intel`, and `docs`; each uses its matching absolute
`mcp/<server>/server.sh` path. Agents, commands, and hooks are excluded from
this fallback. Use the host's own uninstall/remove flow; installation locations
are host-managed.

## Qoder CLI project-local configuration

`.qodercli/settings.json` may be shared for non-secret project defaults.
`.qodercli/settings.local.json` is local/machine scope and must remain ignored
and unstaged; secrets must never be committed. Repeating the local marketplace
route or package readiness checks preserves both files and does not write host
configuration.

Marketplace metadata and local file validation establish **package readiness**;
they are not evidence that commands, agents, hooks, or MCP loaded in a host.

The package readiness contract labels these reports `readiness_scope=package-ready`.
`observed-build-route`, `manual-skills-mcp-fallback`, and `live-host-proof` are
separate host-observation scopes. The fallback is Skills-only plus six manual
MCP connectors; agents, commands, and hooks are excluded. Do not combine the
fallback with a full plugin route for the same project. Stop the session,
remove the old LazyQoder route through the host UI, select one route, restart,
and verify it in a fresh session.

## Uninstall

Use Qoder CLI's plugin removal flow for a Qoder CLI or CLI installation,
then remove or disable only the LazyQoder MCP servers that were manually
registered. Use Qoder IDE's documented plugin/marketplace removal flow for a
verified Qoder IDE plugin installation. For the local-import fallback, remove
the imported `skills/` entries through Qoder IDE's Skills UI and remove the
manually configured connectors through Settings. Never guess, scan for, or
delete host-managed installation paths, `.qoder-plugin` compatibility
metadata, `.qoder` state, or MCP configuration belonging to another host.
The copied repository is independent of host removal and may be deleted only
after the host confirms the plugin/skills and connectors are gone. The root
`offboard` protocol records this package result separately from the
user-observed host result.

## Verify

`scripts/lazyqoder-verify.sh` requires Python 3.10 or newer before it starts
any Python helper. The canonical `all` suite also requires pytest. When
`python3` resolves to an older interpreter, it exits
with `ERROR: LazyQoder requires Python 3.10 or newer. Install Python 3.10+ and make it available as python3.`
Set `LAZYQODER_PYTHON` to an explicit supported interpreter when `python3`
cannot be updated system-wide.

```bash
# Run from lazyqoder-plugin/.
bash scripts/lazyqoder-plugin-doctor.sh

# Smoke test: checks SKILL.md frontmatter and command stubs.
bash scripts/lazyqoder-smoke-test.sh

# Docs check: verifies no broken internal links, including templates/AGENTS.md.
bash scripts/lazyqoder-docs-check.sh

# From the release root, install locked verification dependencies in an isolated
# temporary root, then run the aggregate checks without modifying the package.
bash lazyqoder-plugin/scripts/lazyqoder-package-verify.sh
```

The wrapper requires npm registry access. It reads the shipped lockfile,
installs with `npm ci --ignore-scripts` from inside a temporary root, cleans
that root on exit or interruption, and keeps
the extracted release unchanged. The verifier itself is local-only and bounded.
Missing registry access must fail instead of reporting package verification
success. Its canonical Python suite also fails closed when the selected
supported interpreter does not provide pytest.

The canonical `all` aggregate preserves explicit shell-regression
classifications and runs those shell checks serially. It also discovers every
`tests/*.test.js` file and
runs Node tests with concurrency 2 by default (configurable from 1 through 4
with `LAZYQODER_NODE_TEST_CONCURRENCY`), then runs
`python -m pytest tests tooling`. Its final JSON reports `shell_regressions`,
`node_tests`, and `python_tests`; nested verifier calls mark each as
`skipped-nested` instead of recursively scheduling them. The `core` and
`lifecycle` shell partitions report language suites as `skipped-suite` so
partitioned CI does not duplicate the canonical language run.

Verification-risk reports keep timing in memory and expose monotonic
`elapsed_ms` values for the full run and each gate. The checked-in efficiency
fixtures use `validation_elapsed_ms` so their historical validation duration
cannot be confused with a newly measured report-run duration.

The aggregate command is installed package health and does not read repository-
root learner pages. In a repository checkout, publication validation is a
separate release check: `bash lazyqoder-plugin/tests/publication-regression.sh`.

Package readiness, doctor, and capability-status output are read-only package
evidence. They do not activate optional providers, install a global host
integration, or prove that a live host session connected an MCP server. See the
package-owned [verification matrix](docs/verification-matrix.md) for the local
checks and manual host observations.

Verification timeouts are best-effort cleanup for trusted package-owned
commands. Each command receives its own process group; a deadline terminates
that group and reports any still-detectable descendants in JSON/stderr. This is
not a security sandbox or a guarantee that every descendant stopped. Use a VM or container-backed runner for genuinely untrusted commands; no no-fork sandbox is enabled by default.

## Optional local tooling

LazyQoder can use a local, package-owned fallback for `rg` (ripgrep) and `sg`
(ast-grep). It first detects compatible host tools without changing them. When
one is missing, installation is allowed only into an empty, absolute tooling
root chosen by the caller; it never installs into a target project, global
location, or host-managed path.

```bash
# Inspect host/owned providers without changing anything.
bash scripts/lazyqoder-tooling.sh detect --tooling-root "/absolute/path/to/lazyqoder-tools"

# Install locked fallback tools only when host providers are missing.
bash scripts/lazyqoder-tooling.sh install --tooling-root "/absolute/empty/lazyqoder-tools"

# Inspect repository-native checks without running them.
bash scripts/lazyqoder-tooling.sh verify --target "/absolute/project" --dry-run

# Run only explicitly selected, declared checks with a 60-second default limit.
bash scripts/lazyqoder-tooling.sh verify --target "/absolute/project" --run lint test

# Remove only an unmodified LazyQoder receipt-owned tooling root.
bash scripts/lazyqoder-tooling.sh uninstall --tooling-root "/absolute/path/to/lazyqoder-tools"
```

Repository verification recognizes package-manager lockfiles plus declared
`lint`, `typecheck`, `test`, and `build` scripts, explicit
`[tool.lazyseries.verification]` commands in `pyproject.toml`, and declared
Make targets. Dry runs do not change the target. Runs do not install target
dependencies or guess commands; a timed-out selected check exits `124`.

### Automatic capability selection and approvals

Automatic workflow selection chooses the smallest sufficient existing workflow
from task risk and complexity. It is selection-only until host readiness is
observed: package output must not claim native workflow loading or host
dispatch. The compact task packet is 1,637 bytes rather than 2,285 bytes
(648 bytes / 28.36% smaller); required safety, approval, evidence, review, and
completion gates are unchanged.

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
cost, reachability, credential-reference state, and the current decision.

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
  --target "/absolute/project" --tooling-root "/absolute/lazyqoder-lsp-tools"

# Provision the detected TS/JS or Python provider only in the empty root.
bash scripts/lazyqoder-tooling.sh lsp-install \
  --target "/absolute/project" --tooling-root "/absolute/empty/lazyqoder-lsp-tools"

# A host MCP configuration can launch this package-owned stdio bridge.
CWD="/absolute/project" LAZYQODER_TOOLING_ROOT="/absolute/lazyqoder-lsp-tools" \
  bash mcp/lsp/server.sh

# Remove only an unmodified LSP receipt-owned root.
bash scripts/lazyqoder-tooling.sh lsp-uninstall \
  --target "/absolute/project" --tooling-root "/absolute/lazyqoder-lsp-tools"
```

The locked TS/JS provider is `typescript-language-server@5.3.0` with
`typescript@6.0.3`; it requires Node.js 20 or newer. The locked Python
provider is `basedpyright@1.39.10`. Missing, unsupported, and incompatible
providers are non-blocking readiness states. No target manifest, lockfile,
source file, global path, or host-managed configuration is modified.

### Conditional CodeGraph architecture exploration

CodeGraph is an optional, real local MCP capability for larger architecture and
cross-file relationship questions. It is disabled by default. LazyQoder keeps
`context-graph` available as a clearly labeled grep-based heuristic fallback;
it is not represented as semantic CodeGraph analysis.

CodeGraph is pinned to `@colbymchenry/codegraph@1.6.0` and can only be
provisioned in an explicit empty caller-owned tooling root. The lifecycle does
not invoke upstream `codegraph install` or `codegraph uninstall`, download a
fallback platform binary, enable CodeGraph telemetry, or change host MCP
configuration. Its npm cache, npm configuration, Python cache, and CodeGraph
runtime are confined to the receipt-owned tooling root. Start only after you
deliberately choose a project root:

```bash
# Inspect only. This never starts CodeGraph or creates .codegraph/.
bash scripts/lazyqoder-tooling.sh codegraph-doctor \
  --target "/absolute/project" --tooling-root "/absolute/lazyqoder-codegraph-tools"

# Provision the pinned package, build the project-local index, then enable it.
bash scripts/lazyqoder-tooling.sh codegraph-install \
  --target "/absolute/project" --tooling-root "/absolute/absent/lazyqoder-codegraph-tools"
bash scripts/lazyqoder-tooling.sh codegraph-init \
  --target "/absolute/project" --tooling-root "/absolute/lazyqoder-codegraph-tools"
bash scripts/lazyqoder-tooling.sh codegraph-enable \
  --target "/absolute/project" --tooling-root "/absolute/lazyqoder-codegraph-tools"

# Print an explicit MCP registration fragment; merge it through the host UI.
bash scripts/lazyqoder-tooling.sh codegraph-export-mcp \
  --target "/absolute/project" --tooling-root "/absolute/lazyqoder-codegraph-tools"

# Remove only an index proven by LazyQoder's receipt, then remove the tooling root.
bash scripts/lazyqoder-tooling.sh codegraph-uninstall \
  --target "/absolute/project" --tooling-root "/absolute/lazyqoder-codegraph-tools"
bash scripts/lazyqoder-tooling.sh uninstall \
  --tooling-root "/absolute/lazyqoder-codegraph-tools"
```

`codegraph-doctor` recommends the capability only at 500 supported source files
or 100,000 supported source lines. It makes no network, process, or index call.
The MCP launcher invokes only `codegraph serve --mcp` with fallback download
disabled. A pre-existing `.codegraph/` directory is preserved by uninstall.

### Optional remote documentation and example search

Context7 and `grep_app` are optional remote MCP registration fragments, not
bundled MCP servers and not part of the six-server package declaration. They
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
  --tooling-root "/absolute/lazyqoder-tools"

# Enable only the desired registration fragments.
bash scripts/lazyqoder-tooling.sh remote-enable \
  --tooling-root "/absolute/lazyqoder-tools" context7
bash scripts/lazyqoder-tooling.sh remote-enable \
  --tooling-root "/absolute/lazyqoder-tools" grep_app

# Print a merge-only MCP fragment; it does not edit host configuration.
bash scripts/lazyqoder-tooling.sh remote-export-mcp \
  --tooling-root "/absolute/lazyqoder-tools"

# Disable an optional registration without touching any host entry.
bash scripts/lazyqoder-tooling.sh remote-disable \
  --tooling-root "/absolute/lazyqoder-tools" context7
```

## License

MIT — see the package [LICENSE](LICENSE) and [NOTICE](NOTICE).

---

_This is the installable Qoder CLI, Qoder IDE, and Qoder app package for LazyQoder.
`.qoder-plugin/plugin.json` is the Qoder app marketplace source, not proof
that a host loaded it. Use the local `skills/` import plus manual MCP only as a
receipt-scoped recovery route. The repository-local `.qoder/` directory is
host-managed development state and is intentionally not part of the release
package._
