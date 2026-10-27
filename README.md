# LazyQoder

![LazyQoder](lazyqoder-banner.png)

[![Package 1.4.0](https://img.shields.io/badge/package-1.4.0-7ce8d1)](RELEASE_NOTES.md)
[![MIT License](https://img.shields.io/badge/license-MIT-silver)](LICENSE)
[![LazySeries family](https://img.shields.io/badge/LazySeries-6_siblings-7ce8d1)](#lazyseries-family)

**Describe the work. Keep the plan. Prove the result.**

LazyQoder helps you use structured, evidence-based workflows in **Qoder CLI**, **Qoder IDE**, and the **Qoder app**. It prepares local package assets
and guidance; a host is only considered ready after it is observed in a fresh
session.

[Platform status](docs/reference/platform-status-2026-10-27.md) · [Get started](#recommended-install-with-ai-help) · [Host routes](#choose-one-route) ·
[1.4.0 notes](RELEASE_NOTES.md) · [Family](#lazyseries-family) · [Docs](docs/)

> **Current package version: v1.4.0. HOST READINESS: PENDING.** Local checks and release
> archives prove package behavior; a fresh host session must prove loading,
> command/skill execution and MCP connections.

## What's in 1.4.0

- A shared dashboard core is vendored in the package, with a native Qoder
  adapter (`lazyqoder-plugin/shared/dashboard-host/`) behind an authenticated
  loopback service and a browser UI.
- The status-dashboard MCP server now exposes seven tools: the four status views
  plus `dashboard_service`, `copy_task_context`, and the typed `project` tool.
- The historical completion pass repinned both vendored families at `bb696092`
  (dashboard tree `e55a9c00…`, project tree `16561f3…`), carrying the
  family's redesigned project dashboard — dark-first family design language,
  a de-tabbed shell with a static retractable sidebar and in-place
  navigation, six redesigned views — alongside this package's per-repo store
  isolation matrix and the conservatively refreshed capability observations
  from the Qoder rescan.
- Capability labels are honest: `browser`, `transactional_edits`,
  `project_queue`, `context_copy` and `observations` are available;
  `embedding`, `chat_handoff` and `wake` are unobserved; native host readiness
  stays pending.
- The optional dashboard service port is bash-3.2-safe and validated to
  integers from 1 to 65535; omitting the port keeps the default binding.
- Runtime checks execute real package and lifecycle paths; unknown exercises and failed checks cannot report success.
- Core and optional TypeScript LSP requirements are checked separately, including unsupported runtimes.
- Hook input is bounded before parsing and stays out of process arguments.
- Platform guides distinguish current native capabilities, legacy routes and integrations awaiting live acceptance.

This is a documentation and surface release. It includes the workflow
foundation introduced in the family since v1.3.0 and subsequent reliability
work. For Kimi and DeepSeek, that describes inherited family behavior, not
prior public releases of these ports. The details below describe the cumulative
v1.4.0 experience; the [release notes](RELEASE_NOTES.md) distinguish this
release's additions from inherited features. No new speed, token-saving or cost
claim is made.

| Family milestone | What you get in the current package |
| --- | --- |
| v1.3.0 foundation | Natural-language entry, editable plans, durable decisions and verification tiers. |
| v1.3.1 reliability | Clearer execution intent, safer isolation and evidence comparisons. |
| v1.3.2 handoff | Revision-bound verification-report contracts; generic completion APIs have separate limits. |
| v1.3.3 hardening | Host-specific hook, MCP and publication repairs. |
| v1.3.4 maintenance | Transactional run integrity, safer lifecycle and native adapter repairs. |
| v1.3.5 repairs | Real runtime exercises, bounded hooks, dependency updates and current platform guidance. |
| v1.4.0 dashboard | Shared dashboard core vendored, native adapter with authenticated loopback service, seven-tool status-dashboard MCP, honest capability labels. |
| v1.4.0 completion | Repinned families at `bb696092` with the redesigned project dashboard (dark-first, sidebar shell, in-place navigation), per-repo isolation and refreshed capability observations. |

## Shared dashboard surface

The current dashboard provides a long-run monitor with separate execution and
verification progress, timestamped activity trends, and a bounded searchable
resource trace. Missing usage is shown as unreported. Health lists package
Skills, MCP servers, hooks and agent definitions separately from observed host
activity. Research supports revision-checked capture and SHA-256 evidence
references; capture does not verify a finding. These are package capabilities,
not proof of host integration or measured cost savings. The vendor manifest records dashboard source `62f3a0de` and tree SHA-256
`b525d678…` at this audit; consult the manifest for the current pin.

The package ships a portable dashboard core
(`lazyqoder-plugin/shared/dashboard/`, hash-pinned through
`dashboard.vendor.json`) and a Qoder-native adapter under
`lazyqoder-plugin/shared/dashboard-host/`. The adapter is driven by
`cli.mjs start|status|open|stop` and reports `entry: 'browser'` with the
capability labels above.

- The service listens on an authenticated loopback address only; the browser UI
  offers Work, Verification and Plan-edit views, a task inspector, an evidence
  preview dialog, and queue planning.
- Queue planning can create, amend and reorder queued plans; queue edits never
  start work. Edits stay pending until an exact revision is consumed and a
  distinct independent verifier proves them.
- After an explicit project init the served UI mounts the family's project
  dashboard — a tab-free single surface: a static retractable
  sidebar (WORKSPACE/OBSERVATION destination groups, 56px icon rail,
  Cmd/Ctrl+B; Cmd/Ctrl+1..7 jump to destinations) navigates in place over a
  capped history stack, with the dock inspector on the right. The family
  design language is dark-first (light/dark/system persists) on design
  tokens v2. Keyboard map: Tab keeps the native ring; `j`/`k` traverse list
  scopes; `/` focuses the first filter; Escape closes the topmost overlay
  and returns focus; segmented controls take Arrow/Home/End. Each
  repository's dashboard stores stay isolated to that repository, and a
  foreign runtime's writes are refused.
- The status-dashboard MCP server exposes `dashboard_service` (start, inspect,
  stop, or return the local browser dashboard entry) and `copy_task_context`
  (copy a validated native Qoder producer context without executing or
  consuming it), and `project` (typed project operations) alongside the four
  status views. The optional `port` argument
  is validated to integers from 1 to 65535 and expands safely under bash 3.2.
- These are package capabilities. They do not change host readiness: embedding,
  chat handoff and wake remain unobserved, and **HOST READINESS: PENDING**
  stays authoritative.

### Just ask, or use a command — both work

Two entry routes converge on the same execution authority and gates:

- **Natural language**: describe the work plainly — "Fix the typo in the
  welcome label" — and the smallest sufficient workflow is selected and run.
- **Explicit commands**: `/lazy-ulw-plan <idea>` builds a new plan, and
  `/lazy-start-work <plan>` executes a known plan. Same authority, same gates.

No command is required for a clear implementation request. Conversely, asking
to *explain*, quoting a command, or saying "plan only" never touches your
files: the persisted `execution_intent` stays `plan_only` until you actually
ask for execution, and a vague "ok" with several open questions never grants
execution by itself.

### Plans you can edit while work runs

Plans are Markdown you own. Edit them mid-run; the harness reconciles your
changes at execution boundaries instead of overwriting them:

- Cosmetic wording and ordering edits preserve existing evidence.
- Semantic edits (acceptance, dependencies, verification commands) invalidate
  only the affected task and its dependents — unrelated work is untouched.
- Your checkbox is an *assertion*, not a verdict: a checked box alone never
  counts as verified completion, and unchecking reopens the task.

### Decisions the harness remembers

Cross-plan decisions live in a durable ledger
(`.lazyqoder/decisions/ledger.jsonl`). When plan two hits a question plan one
already answered — with evidence — it recalls the decision instead of
re-asking you. Contradictions are surfaced as supersessions, defects become
scoped corrections that block only the affected work, and nothing in memory
can override your current instructions.

### Verification sized to the change

The workflow calls for verification sized to the change: a documentation
inspection (V0), a focused check (V1), an integration scenario (V2), or a
comprehensive security/release gate (V3, normally in CI). Valid evidence may be
reused while its inputs match; affected, missing or stale checks must rerun.
Native execution still needs acceptance in the selected host.

Milestones, decision gates, and full state/version semantics are shared
byte-identically with LazyBuddy and LazyTrae (see
`lazyqoder-plugin/contracts/lazyseries-shared-semantics.v1.json`). The Qoder
CLI, Qoder IDE, and Qoder app route boundaries are unchanged: package
selection never proves host activation.

## Recommended: install with AI help

You do not need to manually work through every setup detail. Open an AI coding
assistant in your project and paste this:

> Help me install LazyQoder from https://github.com/elvinzhao10/LazyQoder for
> this project. Use v1.4.0 and follow AGENTS.md and the current install guide. Run safe package checks first,
> explain each step plainly, and ask me before changing marketplace, plugin,
> Skills, MCP, account, credential, or trust settings.

The assistant can guide onboarding, but you approve every host-managed change.

## Manual setup

Manual setup is available when you prefer complete control. You need
**Node.js LTS 24 (recommended) or 22 (supported alternative)** and **Git**, plus **Python 3.10+** available as `python3`. The lifecycle also accepts Node.js LTS 20 for compatibility. Start from the verified origin
`https://github.com/elvinzhao10/LazyQoder` and follow the
[installation guide](docs/03-install-and-host-verification.md).

Run `onboard` once to create a durable installation. After that, use the stable
launcher for `update`, `status`, and safe `offboard`:

```text
node "<install-root>/LazyQoder/launcher.js" status
```

## What “ready” means

- **Package readiness** means the copied package and local checks are valid.
- **Host readiness** needs a fresh host session, one real Skill or command,
  and every expected MCP connection.

Until that is observed, the honest result is **HOST READINESS: PENDING**.
Local files and load checks never prove that a host loaded the plugin.

The default package doctor does not discover or execute `qodercli` from
`PATH`. Optional host-manifest validation is an explicit action using
`bash scripts/lazyqoder-plugin-doctor.sh --host-validator /absolute/path`.
The release verifier runs classified shell regressions serially, all package
`tests/*.test.js` with conservative Node concurrency, and Python tests under
`tests/` and `tooling/`; its JSON names those outcomes separately.

## Choose one route

Pick one host route during onboarding:

- **Current Qoder CLI** documents `qoder plugins install <local-directory>`.
  This is a separate native route; LazyQoder acceptance remains pending.
- **Legacy `qodercli`** uses the packaged marketplace adapter only when the
  executable and build match that route. Never translate its commands to `qoder`.
- **Qoder IDE** may use that legacy marketplace route only with a matching
  `qodercli` build and separate IDE observation.
- **Qoder app** uses its full-plugin marketplace route.

Skills plus manual MCP connectors are a recovery-only option. Do not run that
fallback beside a full-plugin route for the same project. Stop the session,
remove only LazyQoder's previous entries through the host UI, choose one route,
and start a new session to verify it.

## Design mindset

Start with the result you want and how you will know it worked. Then use the
smallest amount of structure that fits the task. You can simply describe the
work in plain language; the modes are guidance, not commands you need to
memorize. The dual-entry routing introduced in v1.3.0 picks one of these for you.

| Mode | Use it when | Example request |
| --- | --- | --- |
| Direct | The change is small and clear. | “Fix this error and run the relevant test.” |
| Assisted | You need help understanding an unfamiliar area or failure. | “Help me find why this command fails, then verify the fix.” |
| Planned | The work has several parts or important choices. | “Make a plan for this feature before changing files.” |
| Orchestrated | The work affects a release, security, or a risky change. | “Review this release and prepare it for publication.” |
| Long-horizon | The goal needs to continue across sessions. | “Keep working on this migration with checkpoints.” |

## Keep host changes deliberate

LazyQoder does not automate credentials, OAuth values, private registries, or
trust settings. It asks for approval before any host-managed action and keeps
safe package checks separate from marketplace and connector changes.

## Package inventory

| Surface | Count | Role |
| --- | ---: | --- |
| Skills | 14 | Host-facing workflow policies for planning, execution, review, and verification. |
| Commands | 14 | Named host entry points for those workflow policies. |
| Agents | 13 | Specialist role definitions for planning, implementation, QA, security, and context. |
| MCP declarations | 6 | Local services for ledger, verification, status, context, code intelligence, and docs. |

## LazySeries family

**One workflow philosophy. Six host integrations.** Choose the sibling for the
host you use; each keeps its own native adapters, installation route and
acceptance evidence. These packages run independently.

| Sibling | Target host |
| --- | --- |
| [LazyBuddy](https://github.com/elvinzhao10/LazyBuddy) | CodeBuddy CLI / IDE · WorkBuddy |
| [LazyTrae](https://github.com/elvinzhao10/LazyTrae) | TraeCode / TraeWork / TraeCode CLI |
| [LazyQoder](https://github.com/elvinzhao10/LazyQoder) **← you are here** | Qoder CLI / IDE / app |
| [LazyZCode](https://github.com/elvinzhao10/LazyZCode) | ZCode |
| [LazyKimi](https://github.com/elvinzhao10/LazyKimi) | Kimi Code CLI · Kimi Work (experimental) |
| [LazyDeepSeek](https://github.com/elvinzhao10/LazyDeepSeek) | DeepSeek Harness 0.2.0-rc.2 |

The family shares planning, evidence, decision-memory and completion contracts.
The first shared verification core and a shared dashboard core are vendored in
every package; product adapters keep host setup and permissions explicit. Matching contracts do not make host capabilities interchangeable. In particular,
Kimi Work remains experimental for LazyKimi, and DeepSeek's synthesized events
are not native hooks. Use each sibling's host guide before installation.

## Technical reference and evaluation

The source-level explanation lives in [docs/README.md](docs/README.md). It
maps the package structure, request flow, state model, security boundaries,
MCP lifecycle, and release checks with diagrams tied to the implementation.

For a capability-by-capability comparison with the original LazyCodex design,
including what LazyQoder implements and where it intentionally differs, see
[lazyqoder-evaluation.md](lazyqoder-evaluation.md).

LazyQoder is primarily inspired by LazyCodex
([upstream project](https://github.com/code-yeongyu/lazycodex)). Its
relationship to OmO and upstream sources is recorded in [NOTICE](NOTICE).
It is an independent implementation and does not require LazyCodex or OmO at
runtime.

## Learn more

- [Install and verify a host](docs/03-install-and-host-verification.md)
- [Remove receipt-owned assets safely](docs/08-safe-removal.md)
- [Workflow playbooks — how the modes pick work](docs/04-workflow-playbooks.md)
- [Evidence and completion — what "done" proves](docs/05-evidence-and-completion.md)
- [Host routes and recovery](docs/reference/host-routes.md)
- [Release notes](RELEASE_NOTES.md)
- [Documentation index](docs/README.md)

## License

[MIT](LICENSE). See [NOTICE](NOTICE) for attribution and provenance.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md)
for development checks, release expectations, and guidance for reporting
sanitized reproduction details. Report vulnerabilities privately according to
[SECURITY.md](SECURITY.md).
