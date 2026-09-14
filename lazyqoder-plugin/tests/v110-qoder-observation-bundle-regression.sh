#!/usr/bin/env bash
set -euo pipefail

PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

node --check "$PLUGIN_ROOT/scripts/lazyqoder-qoder-observation.js"
node --check "$PLUGIN_ROOT/scripts/lifecycle/qoder-observation.js"
node --check "$PLUGIN_ROOT/scripts/lifecycle/qoder-observation-contract.js"
node --test \
  "$PLUGIN_ROOT/tests/qoder-observation-bundle.test.js" \
  "$PLUGIN_ROOT/tests/qoder-connector-reference.test.js"
