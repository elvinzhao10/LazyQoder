#!/usr/bin/env bash
set -euo pipefail

fail() {
    echo "FAIL: $1" >&2
    exit 1
}

LAZYTRAE_ROOT=""
LAZYQODER_ROOT=""
while [ "$#" -gt 0 ]; do
    case "$1" in
        --lazytrae-root)
            [ "$#" -ge 2 ] || fail "--lazytrae-root requires a value"
            LAZYTRAE_ROOT="$2"
            shift 2
            ;;
        --lazyqoder-root)
            [ "$#" -ge 2 ] || fail "--lazyqoder-root requires a value"
            LAZYQODER_ROOT="$2"
            shift 2
            ;;
        *)
            fail "unknown argument: $1"
            ;;
    esac
done

case "$LAZYTRAE_ROOT" in /*) ;; *) fail "--lazytrae-root must be absolute" ;; esac
case "$LAZYQODER_ROOT" in /*) ;; *) fail "--lazyqoder-root must be absolute" ;; esac
LAZYTRAE_ROOT="$(cd "$LAZYTRAE_ROOT" && pwd -P)"
LAZYQODER_ROOT="$(cd "$LAZYQODER_ROOT" && pwd -P)"
TRAE_CLI="$LAZYTRAE_ROOT/lazytrae-plugin/packages/cli"
BUDDY_PLUGIN="$LAZYQODER_ROOT/lazyqoder-plugin"
TRAE_CONTRACTS="$TRAE_CLI/contracts"
BUDDY_CONTRACTS="$BUDDY_PLUGIN/contracts"

[ -d "$TRAE_CLI/node_modules/ajv" ] || fail "LazyTrae contract dependencies are not installed"
[ -d "$BUDDY_PLUGIN/tooling/node_modules/ajv" ] || fail "LazyQoder contract dependencies are not installed"

(cd "$TRAE_CLI" && node --test test/lifecycle-v2-contract.test.js test/lifecycle-v2.test.js)
NODE_PATH="$BUDDY_PLUGIN/tooling/node_modules" node --test \
    "$BUDDY_PLUGIN/tests/lifecycle-v2-contract.test.js" \
    "$BUDDY_PLUGIN/tests/lifecycle-v2.test.js"

for artifact in \
    lazy-harness-active.v2.schema.json \
    lazy-harness-active.v2.schema.json.sha256 \
    lazy-harness-lifecycle.v2.schema.json \
    lazy-harness-lifecycle.v2.schema.json.sha256
do
    cmp -s "$TRAE_CONTRACTS/$artifact" "$BUDDY_CONTRACTS/$artifact" ||
        fail "mirrored lifecycle v2 artifact differs: $artifact"
done

diff -ru "$TRAE_CONTRACTS/fixtures/lifecycle-v2" \
    "$BUDDY_CONTRACTS/fixtures/lifecycle-v2" >/dev/null ||
    fail "mirrored lifecycle v2 fixtures differ"

for artifact in state.js launcher.js core.js ownership.js
do
    cmp -s "$TRAE_CLI/src/lib/lifecycle/$artifact" "$BUDDY_PLUGIN/scripts/lifecycle/$artifact" ||
        fail "mirrored lifecycle v2 domain code differs: $artifact"
done

echo "PASS: lifecycle v2 writers, readers, fixtures, schemas, checksums, and shared domain bytes"
