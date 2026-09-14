# Verification contract

This reference distinguishes local package evidence from host evidence. Run
the package commands from `lazyqoder-plugin/`.

| Step | Command | Expected package evidence |
| --- | --- | --- |
| Package readiness | `bash scripts/lazyqoder-load-check.sh` | `PACKAGE_READINESS=full`, or a specific degraded explanation. |
| Package health | `bash scripts/lazyqoder-plugin-doctor.sh` | `Doctor check: ALL PASS`. |
| MCP integration | `bash scripts/lazyqoder-mcp-test.sh` | `MCP test: ALL PASS`. |
| Aggregate verification | `bash scripts/lazyqoder-verify.sh` | JSON containing `"all_pass":true`. |
| Publication contract | `bash tests/publication-regression.sh` | Root publications, the learner-path manifest, and contained local links pass. |
| Canonical capability readiness | `python lazyqoder_capability_readiness.py readiness-report --json` | Nine capability-readiness records, each with a clear readiness state. |
| Cross-repository learner manifest | `bash tests/vXXX-docs-manifest-parity.sh --lazyqoder-root /absolute/lazyqoder --sibling-root /absolute/sibling` | Explicit roots have the same learner paths and page titles; host-specific prose may differ. |

Package readiness and doctor cover copied assets, eight local MCP declarations,
the optional-capability policy, and receipt-safe removal rules. They do not
prove that Qoder IDE loaded the package, executed a hook, or connected MCP. A
new-session or host-UI observation remains required; see
[host routes](host-routes.md).

Timeouts cover trusted package-owned checks only. The runner starts each check
in its own process group, terminates that group on deadline, and reports any
still-detectable descendants. This is best-effort cleanup, not a security sandbox or a guarantee of descendant cleanup. Use a VM or container-backed runner for genuinely untrusted commands; no no-fork sandbox is enabled by default.

## Intentional exclusions

- Qoder IDE uses its plugin/extension or CLI flow. The local fallback imports
  `skills/` and manually configures compatible connectors in Agent-mode MCP.
- Tooling roots are receipt-owned. Host-managed paths, `.qoder` state,
  host MCP entries, and credentials are neither scanned nor removed.
- The package declares eight local MCP servers. Context7 and `grep_app` are
  optional export fragments; filesystem and Playwright are not bundled local
  MCP servers.

The package has macOS-only verification. Normal CI has no sibling-repository
dependency. Release-only paired parity may compare explicitly supplied sibling
roots as release evidence; it is not runtime, installation, or normal-CI
dependency.

## Regression test names

Test filenames beginning with `v015`, `v016`, `v017`, or `v018` identify the
release in which that regression boundary was introduced. They are active
compatibility and security checks, not deprecated runtime versions or shipped
legacy implementations. CI prints these stable filenames so a failure points
to the exact regression contract. New tests should use a descriptive,
unversioned filename unless preserving release provenance is necessary.

## Claim matrix

| Evidence type | Establishes | Does not establish |
| --- | --- | --- |
| Manifest and readiness checks | The shipped package inventory and declarations are internally consistent. | Host discovery or a connected MCP server. |
| State and schema checks | Recorded local workflow data has the expected shape. | That the recorded task outcome is correct. |
| MCP protocol tests | A local server handles supported JSON-RPC requests and errors. | That a host has launched or authorized that server. |
| Focused tests and manual QA | The requested behavior was checked on its stated surface. | Behavior outside the tested scope. |
| Host-session observation | The selected host exposed the observed integration in that session. | A guarantee about another host, version, or operating system. |

Use the narrowest matching sentence in a release note or DoneClaim. Combining
different evidence types is useful, but it never upgrades one kind of proof
into another.

## Canonical capability readiness and automatic-tooling contract

LazyQoder ships two contracts that bound every claim above:

- `contracts/lazyseries-capability-readiness.v1.json` — the canonical
  capability-readiness record set. `python lazyqoder_capability_readiness.py
  readiness-report --json` emits **nine** records, one per harness primitive
  (`qoder-init-deep`→RepoWiki, `qoder-ulw-plan`→Quest, `qoder-start-work` /
  `qoder-ulw-loop`→Agent mode + Subagents, `qoder-review-work` /
  `qoder-reviewer` / `qoder-verifier`→Expert teams, model routing→Model
  selector, MCP→Agent-mode MCP, plus foundation, tooling, and receipt records).
  A readiness record states only that the package declares and self-checks a
  primitive; it never asserts a live Qoder IDE connection.
- `contracts/automatic-tooling-contract.v1.json` — the automatic-tooling
  contract. It defines providers, fallbacks, permissions, timeouts, and error
  identifiers for any capability the package may auto-select. Automatic tooling
  is confined to local/read-only providers and never performs remote egress,
  browser automation, or credential use without explicit selection.

These contracts are load-check-verified by sha256; their contents are copied
verbatim and must not be edited by the port.

Read [test and release verification](../09-test-and-release-verification.md)
for the five evidence layers and [evidence and completion](../05-evidence-and-completion.md)
for how to use these results in a done claim.
