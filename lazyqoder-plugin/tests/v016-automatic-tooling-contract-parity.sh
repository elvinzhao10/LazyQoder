#!/usr/bin/env bash
set -euo pipefail

usage() {
    cat <<'USAGE'
Usage: v016-automatic-tooling-contract-parity.sh --lazytrae-root ABSOLUTE_ROOT --lazyqoder-root ABSOLUTE_ROOT

Compare the two independently validated vendored automatic-tooling contracts.
Both roots are required; this integration check never infers a sibling checkout.
USAGE
}

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
        --help|-h)
            usage
            exit 0
            ;;
        *)
            usage >&2
            fail "unknown argument: $1"
            ;;
    esac
done

[ -n "$LAZYTRAE_ROOT" ] || { usage >&2; fail "--lazytrae-root is required"; }
[ -n "$LAZYQODER_ROOT" ] || { usage >&2; fail "--lazyqoder-root is required"; }
[ -d "$LAZYTRAE_ROOT" ] || fail "missing LazyTrae root: $LAZYTRAE_ROOT"
[ -d "$LAZYQODER_ROOT" ] || fail "missing LazyQoder root: $LAZYQODER_ROOT"

LAZYTRAE_ROOT="$(cd "$LAZYTRAE_ROOT" && pwd -P)"
LAZYQODER_ROOT="$(cd "$LAZYQODER_ROOT" && pwd -P)"
TRAE_CLI="$LAZYTRAE_ROOT/lazytrae-plugin/packages/cli"
BUDDY_PLUGIN="$LAZYQODER_ROOT/lazyqoder-plugin"
TRAE_CONTRACT="$TRAE_CLI/contracts/automatic-tooling-contract.v1.json"
BUDDY_CONTRACT="$BUDDY_PLUGIN/contracts/automatic-tooling-contract.v1.json"

[ -f "$TRAE_CLI/package.json" ] || fail "misconfigured LazyTrae root: missing lazytrae-plugin/packages/cli/package.json"
[ -f "$BUDDY_PLUGIN/scripts/lazyqoder-contract-check.sh" ] || fail "misconfigured LazyQoder root: missing lazyqoder-plugin/scripts/lazyqoder-contract-check.sh"
[ -f "$TRAE_CONTRACT" ] || fail "missing LazyTrae contract"
[ -f "$TRAE_CONTRACT.sha256" ] || fail "missing LazyTrae contract digest"
[ -f "$BUDDY_CONTRACT" ] || fail "missing LazyQoder contract"
[ -f "$BUDDY_CONTRACT.sha256" ] || fail "missing LazyQoder contract digest"

(cd "$TRAE_CLI" && node --test test/automatic-tooling-contract.test.js)
QODER_PLUGIN_ROOT="$BUDDY_PLUGIN" bash "$BUDDY_PLUGIN/scripts/lazyqoder-contract-check.sh"
cmp -s "$TRAE_CONTRACT" "$BUDDY_CONTRACT" || fail "vendored contract bytes differ"
cmp -s "$TRAE_CONTRACT.sha256" "$BUDDY_CONTRACT.sha256" || fail "vendored contract digest sidecars differ"

echo "PASS: explicit-root automatic-tooling contract parity"
