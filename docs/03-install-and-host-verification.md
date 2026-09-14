# Package delivery

This page explains the deployment boundary in code terms. A plugin package contains files a host may load; it does not contain the host's marketplace database, session state, or connector process table.

## Copyable versus observed state

`lazyqoder-plugin/` can be copied and checked in isolation. `scripts/lazyqoder-load-check.sh` inspects the selected package root, manifests, inventories, declarations, executable scripts, and tooling contract. `lazyqoder-plugin-doctor.sh` adds health diagnostics. Neither script asks a host to install a plugin or open an MCP connection.

The host is a second runtime. Qoder IDE chooses how plugins are discovered, when hooks receive events, and when MCP launchers are spawned through Agent-mode MCP. The package models that with declarations and tests; it deliberately does not scan or mutate host-owned paths to infer success.

## Two evidence channels

```mermaid
flowchart LR
    Copy["copied package"] --> Check["load-check / doctor"] --> Ready["package readiness"]
    Host["selected host"] --> Session["new/reloaded session"] --> Live["observed integration"]
    Ready -. does not imply .-> Live
```

The first channel supports claims about package contents. The second supports claims about host loading. Keeping the channels separate is what lets uninstall be safe: package removal cannot guess where a host stored marketplace or connector data.

## Delivery surfaces

Qoder IDE IDE and JetBrains/VS Code extensions use host plugin discovery. The Qoder IDE CLI validates and installs through the host's current plugin flow. Both load the package via the documented plugin/extension surface; on the local fallback, imported skills and manually configured Agent-mode MCP connectors are confirmed by hand. The latter imports skills only; it is intentionally not represented as automatic agent, hook, command, or MCP loading. The detailed host adapters are in [Host capability matrix](10-host-capability-matrix.md) and [Host routes](reference/host-routes.md).
