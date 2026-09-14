#!/usr/bin/env bash
# session-start.sh — SessionStart hook: detect active run, load summary, warn if memory missing.
set -euo pipefail

INPUT=$(cat 2>/dev/null || echo "{}")
CWD=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('cwd','.'))" 2>/dev/null || echo ".")
PLUGIN_ROOT="${QODER_PLUGIN_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

echo "(LazyQoder v1.2.2): Session starting — checking project state..."

if [ ! -d "$PLUGIN_ROOT" ] || [ ! -f "$PLUGIN_ROOT/scripts/lazyqoder-load-check.sh" ]; then
    echo "SESSIONSTART_READINESS=failed reason=plugin-root-unavailable" >&2
    exit 1
fi

# Bootstrap the .lazyqoder/ directory tree so skills/agents that read
# plans/, context/, drafts/, or runs/ don't crash on a fresh workspace.
# create-run.sh creates runs/<run_id>/ on demand; this ensures the parents exist.
mkdir -p "$CWD/.lazyqoder"/{plans,context,drafts,runs}

if load_check=$(bash "$PLUGIN_ROOT/scripts/lazyqoder-load-check.sh" 2>&1); then
    echo "$load_check"
    if grep -q '^PACKAGE_READINESS=full$' <<<"$load_check"; then
        echo "SESSIONSTART_READINESS=full"
    elif grep -q '^PACKAGE_READINESS=degraded$' <<<"$load_check"; then
        echo "SESSIONSTART_READINESS=degraded"
    else
        echo "SESSIONSTART_READINESS=failed reason=missing-package-readiness-result" >&2
        exit 1
    fi
else
    echo "(LazyQoder): $load_check" >&2
    echo "SESSIONSTART_READINESS=failed reason=package-readiness-failed" >&2
    exit 1
fi

# Check for project memory
if [ -f "$CWD/qoder.md" ]; then
    echo "(LazyQoder): Project memory found (qoder.md)."
else
    echo "(LazyQoder): ⚠ Project memory (qoder.md) missing. Run /lazyqoder:qoder-init-deep or ask to initialize project memory."
fi

# Check for project rules
if [ -d "$CWD/.qoder/rules" ] && [ "$(ls -A "$CWD/.qoder/rules"/*.md 2>/dev/null)" ]; then
    echo "(LazyQoder): Project rules loaded."
fi

# Check for active run
RUNS_DIR="$CWD/.lazyqoder/runs"
if [ -d "$RUNS_DIR" ]; then
    for run_dir in "$RUNS_DIR"/*/; do
        state_file="${run_dir}state.json"
        if [ -f "$state_file" ]; then
            STATUS=$(python3 -c "import json; d=json.load(open('$state_file')); print(d.get('status',''))" 2>/dev/null || echo "")
            if [ "$STATUS" = "active" ] || [ "$STATUS" = "paused" ]; then
                PLAN=$(python3 -c "import json; d=json.load(open('$state_file')); print(d.get('plan_name',''))" 2>/dev/null || echo "unknown")
                PROGRESS=$(python3 -c "import json; d=json.load(open('$state_file')); p=d.get('progress',{}); print(f\"{p.get('completed_checkboxes',p.get('completed',0))}/{p.get('total_checkboxes',p.get('total',0))}\")" 2>/dev/null || echo "?/?")
                echo "(LazyQoder): Active run found: $PLAN (status: $STATUS, progress: $PROGRESS)"
                echo "(LazyQoder): Run /lazyqoder:qoder-start-work or ask to continue the planned work."
            fi
            break
        fi
    done
fi

exit 0
