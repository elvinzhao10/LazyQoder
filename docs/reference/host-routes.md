# Host routes

LazyQoder targets Qoder IDE (Alibaba's successor to Tongyi Lingma), but package
readiness does not prove any host route is live. Verification is macOS-only.

| Host route | Package role | Required user observation |
| --- | --- | --- |
| Qoder IDE IDE / extension | Copied package, manifest, local checks, and eight local MCP declarations. | Install with the host plugin/extension flow, reload if offered, then in a new session confirm a LazyQoder command/skill and MCP status. |
| Qoder IDE CLI | Marketplace discovery and package validation are documented. | Use the host's current plugin discovery flow, verify publisher and immutable revision, start a new session, and inspect plugin/MCP activation. |
| Qoder IDE local fallback | `lazyqoder-plugin/skills/` is the verified no-package-manager import source. | Import through the Skills UI and manually add each compatible MCP connector in Agent-mode MCP settings. |

## Qoder IDE IDE / extension

For IDE/extension installation, use the current plugin/extension UI, reload if
the host offers it, then inspect a new session for `/lazyqoder:qoder-<command>`
and MCP status. For CLI installation, discover the current plugin entry via
host documentation or UI; confirm the publisher and exact immutable
revision/release reference before executing the host-generated install command.
This repository does not endorse a mutable marketplace URL.

## Qoder IDE local fallback

`.qoder/plugin.json` is internal, unverified compatibility metadata; it is not
an executable copied-repository Qoder IDE installer. A plugin or marketplace
installation must be verified in a live session. The verified fallback imports
local skills and configures connectors manually. Qoder IDE does not gain a
LazyQoder command behavior merely because the copied package contains command
files.

## Shared boundary

Local checks establish package evidence only. They do not prove plugin
discovery, marketplace activation, SessionStart, hook execution, a running
session, or MCP connection. See [verification contract](verification-contract.md)
and [safe removal](../08-safe-removal.md). The declaration-to-connection
boundary is explained in [MCP lifecycle](../07b-mcp-lifecycle.md).

## What the route actually changes

Each route gives the host a package artifact or a manual connector recipe; it
does not make the package an owner of host state. Qoder IDE discovery and
marketplace loading remain host-native operations. That is why the package
validates its own manifests and launchers but does not scan a marketplace
database, rewrite a settings directory, or infer that an MCP entry belongs to
LazyQoder. Treat a host UI observation as the final boundary between a valid
package and an active integration.

## Qoder IDE feature mapping

Each LazyQoder harness primitive maps to a native Qoder IDE feature (verified
against official Qoder IDE docs): `qoder-init-deep` → RepoWiki; `qoder-ulw-plan`
→ Quest mode; `qoder-start-work` / `qoder-ulw-loop` → Agent mode + Subagents;
`qoder-review-work` / `qoder-reviewer` / `qoder-verifier` → Expert teams;
model routing → Model selector; MCP servers → Agent-mode MCP. The package
recommends these mappings; it never reconfigures the host.
