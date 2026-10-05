#!/usr/bin/env bash
# Exercises initialize + tools/list on every server, plus one safe representative
# tool call per server. Reports pass/fail per server + tool. Exit 0 = all pass.
#
# Usage: bash lazyqoder-mcp-test.sh [plugin-root-or-repo-root]
set -euo pipefail

if [ -n "${QODER_PLUGIN_ROOT:-}" ]; then
    PLUGIN="$QODER_PLUGIN_ROOT"
elif [ "$#" -gt 0 ] && [ -d "$1/.mcp.json" ]; then
    PLUGIN="$1"
elif [ "$#" -gt 0 ] && [ -d "$1/lazyqoder-plugin" ]; then
    PLUGIN="$1/lazyqoder-plugin"
else
    PLUGIN="$(cd "$(dirname "$0")/.." && pwd)"
fi
PLUGIN="$(cd "$PLUGIN" 2>/dev/null && pwd)" || {
    echo "MCP test: FAIL (plugin root is missing: ${QODER_PLUGIN_ROOT:-$PLUGIN})" >&2
    exit 1
}
[ -f "$PLUGIN/.mcp.json" ] || {
    echo "MCP test: FAIL (missing ${PLUGIN}/.mcp.json)" >&2
    exit 1
}
export QODER_PLUGIN_ROOT="$PLUGIN"
export CWD="${CWD:-$(pwd -P)}"

PASS=0
FAIL=0
PASS_LIST=()
FAIL_LIST=()

check() {
    # check <label> <expected_substring> <actual_json>
    local label="$1" needle="$2" hay="$3"
    # Semantic checks run on decoded tools/call data, after validating its MCP envelope.
    if [[ "$label" != */initialize && "$label" != */tools-list ]]; then
        if ! hay="$(python3 - "$hay" "$label" <<'PYMCP'
import json
import sys
reply = json.loads(sys.argv[1])
assert reply["jsonrpc"] == "2.0", reply
if sys.argv[2].endswith('/no-project-file'):
    assert "result" not in reply and isinstance(reply.get("error"), dict), reply
    assert reply["error"]["code"] == -32603, reply
    print(json.dumps(reply["error"]))
    raise SystemExit(0)
assert "result" in reply and "error" not in reply, reply
result = reply["result"]
assert isinstance(result, dict) and isinstance(result.get("content"), list), reply
assert len(result["content"]) == 1, reply
block = result["content"][0]
assert block.get("type") == "text" and isinstance(block.get("text"), str), reply
assert result.get("isError", False) is False, reply
if sys.argv[2].endswith('-content-blocks'):
    print(json.dumps(reply))
else:
    try:
        print(json.dumps(json.loads(block["text"])))
    except json.JSONDecodeError:
        print(block["text"])
PYMCP
)"; then
            FAIL=$((FAIL+1)); FAIL_LIST+=("$label/envelope")
            echo "  FAIL: $label (invalid MCP tool result envelope)" >&2
            return
        fi
    fi
    if echo "$hay" | grep -Eqi "$needle"; then
        PASS=$((PASS+1)); PASS_LIST+=("$label")
    else
        FAIL=$((FAIL+1)); FAIL_LIST+=("$label")
        echo "  FAIL: $label (expected '$needle')" >&2
    fi
}

rpc() {
    # rpc <server> <json> -> stdout
    local server="$1" json="$2"
    printf '%s' "$json" | bash "$PLUGIN/mcp/$server/server.sh" 2>/dev/null || echo '{}'
}

check_stream_protocol() {
    local server="$1"
    if python3 - "$PLUGIN" "$server" "$CWD" <<'PYEOF'
import json
import os
import subprocess
import sys

plugin, server, cwd = sys.argv[1:]
requests = "\n".join((
    "{bad json",
    "null",
    json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}}),
    json.dumps({"jsonrpc": "2.0", "id": 41, "method": "initialize"}),
    json.dumps({"jsonrpc": "2.0", "id": 42, "method": "tools/list"}),
)) + "\n"
environment = os.environ.copy()
environment["CWD"] = cwd
environment["QODER_PLUGIN_ROOT"] = plugin
try:
    completed = subprocess.run(
        ["bash", os.path.join(plugin, "mcp", server, "server.sh")],
        input=requests,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=cwd,
        env=environment,
        timeout=10,
        check=False,
    )
except subprocess.TimeoutExpired as error:
    raise SystemExit(f"{server}: stream process timed out and was cleaned up") from error
if completed.returncode != 0:
    raise SystemExit(f"{server}: stream process exited {completed.returncode}; stderr={completed.stderr}")
try:
    responses = [json.loads(line) for line in completed.stdout.splitlines() if line]
except json.JSONDecodeError as error:
    raise SystemExit(f"{server}: stdout was not newline-delimited JSON: {error}") from error
if len(responses) != 4:
    raise SystemExit(f"{server}: expected four responses (notification is silent), got {len(responses)}: {responses}")
assert responses[0]["jsonrpc"] == "2.0"
assert responses[0]["id"] is None
assert responses[0]["error"]["code"] == -32700
assert responses[1]["jsonrpc"] == "2.0"
assert responses[1]["id"] is None
assert responses[1]["error"]["code"] == -32600
assert responses[2]["id"] == 41 and isinstance(responses[2]["result"]["serverInfo"]["name"], str)
assert responses[3]["id"] == 42 and isinstance(responses[3]["result"]["tools"], list)
PYEOF
    then
        PASS=$((PASS+1)); PASS_LIST+=("$server/stream-protocol")
    else
        FAIL=$((FAIL+1)); FAIL_LIST+=("$server/stream-protocol")
        echo "  FAIL: $server/stream-protocol" >&2
    fi
}

check_invalid_tool_params() {
    if CWD="$CWD" QODER_PLUGIN_ROOT="$PLUGIN" bash "$PLUGIN/tests/v017-mcp-params-regression.sh"; then
        PASS=$((PASS+1)); PASS_LIST+=("tools/call-invalid-params")
    else
        FAIL=$((FAIL+1)); FAIL_LIST+=("tools/call-invalid-params")
        echo "  FAIL: tools/call-invalid-params" >&2
    fi
}

check_dashboard_service_optional_port() {
    # dashboard_service must answer on the default no-port path; the launcher
    # runs under `set -u`, so the optional port expansion has to stay safe on
    # bash 3.2 hosts. Drives start/status/stop with and without the port from
    # a temp fixture project over the real stdio protocol.
    local tmp project head fixed_port server physical_plugin
    tmp="$(mktemp -d "${TMPDIR:-/tmp}/lazyqoder-mcp-dashboard.XXXXXX")"
    project="$tmp/project"
    # The dashboard host only self-executes when its argv path matches the
    # resolved module URL, so drive the launcher through the physical plugin
    # root; copied-plugin gates run under TMPDIR symlink components.
    physical_plugin="$(cd -P "$PLUGIN" && pwd -P)"
    server="$physical_plugin/mcp/status-dashboard/server.sh"
    mkdir -p "$project"
    local git_env=(GIT_CONFIG_NOSYSTEM=1 "HOME=$tmp")
    env "${git_env[@]}" git -C "$project" init -q
    env "${git_env[@]}" git -C "$project" config user.name "Qoder Dashboard MCP QA"
    env "${git_env[@]}" git -C "$project" config user.email "qoder@example.invalid"
    printf '.lazyqoder/\n' > "$project/.gitignore"
    env "${git_env[@]}" git -C "$project" add .gitignore >/dev/null
    env "${git_env[@]}" git -C "$project" commit -qm fixture >/dev/null
    if ! CWD="$project" bash "$PLUGIN/scripts/state/create-run.sh" probe "Qoder dashboard MCP probe" >/dev/null 2>&1; then
        FAIL=$((FAIL+1)); FAIL_LIST+=("status-dashboard/dashboard_service-optional-port")
        echo "  FAIL: status-dashboard/dashboard_service-optional-port (fixture run creation failed)" >&2
        rm -rf "$tmp"
        return
    fi
    head="$(env "${git_env[@]}" git -C "$project" rev-parse HEAD)"
    fixed_port="$(python3 -c 'import socket; stream = socket.socket(); stream.bind(("127.0.0.1", 0)); print(stream.getsockname()[1]); stream.close()')"
    if python3 - "$project" "$head" "$(command -v node)" "$PLUGIN/shared/dashboard-host/test/workload.mjs" <<'PYFIX' \
        && python3 - "$tmp/session.in" "$fixed_port" <<'PYREQ'
import hashlib, json, sys
from pathlib import Path

root, head, node, workload = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
run = Path(root) / ".lazyqoder/runs/probe"
digest = lambda text: hashlib.sha256(text.encode()).hexdigest()
plan = "# Qoder plan\n- [x] [C1] Original Qoder criterion\n"
artifact = str(run / "actual.txt")
commands = [[node, workload, "write", artifact, "Qoder adopted edit"], [node, workload, "verify", artifact, "Qoder adopted edit"]]
commands_bytes = f"{json.dumps(commands)}\n"
state_path = run / "state.json"
state = json.loads(state_path.read_text())
state["status"] = "active"
state["plan_reference"] = ".lazyqoder/runs/probe/plan.md"
state["plan_revision"] = 1
state["_approved_plan_sha256"] = digest(plan)
state["dashboard_project_id"] = "project:qoder"
state["tasks"] = [
    {"id": "P", "title": "Qoder dashboard parent", "status": "running", "depends_on": [], "execution_authority": {
        "repo_head": head, "criterion_ids": ["C1"], "plan_reference": state["plan_reference"], "plan_sha256": digest(plan),
        "plan_commands_path": ".lazyqoder/runs/probe/commands.json", "plan_commands_sha256": digest(commands_bytes)}},
    {"id": "A", "title": "Qoder dashboard child", "status": "queued", "depends_on": [], "criteria": [{"id": "C1", "task_id": "A",
        "version": 1, "requirement": "Original Qoder criterion", "applicability": "required", "verification": "unverified",
        "scenarios": [], "result_ids": [], "history": []}]},
]
(run / "checkpoints").mkdir(parents=True, exist_ok=True)
(run / "plan.md").write_text(plan)
(run / "checkpoints/plan-revision.md").write_text(plan)
(run / "commands.json").write_text(commands_bytes)
state_path.write_text(json.dumps(state))
PYFIX
import json, sys
from pathlib import Path

out, port = Path(sys.argv[1]), int(sys.argv[2])
def call(identifier, arguments):
    return json.dumps({"jsonrpc": "2.0", "id": identifier, "method": "tools/call",
                       "params": {"name": "dashboard_service", "arguments": arguments}})
binding = {"project_id": "project:qoder", "run_id": "probe"}
out.write_text("\n".join((
    call(3, {**binding, "action": "start"}),
    call(4, {**binding, "action": "status"}),
    call(5, {**binding, "action": "stop"}),
    call(6, {**binding, "action": "start", "port": port}),
    call(7, {**binding, "action": "status", "port": port}),
    call(8, {**binding, "action": "stop", "port": port}),
)) + "\n")
PYREQ
    then
        if CWD="$project" QODER_PLUGIN_ROOT="$physical_plugin" bash "$server" < "$tmp/session.in" > "$tmp/session.out" 2> "$tmp/session.err" \
            && python3 - "$tmp/session.out" "$project" "$fixed_port" <<'PYJUDGE'
import json, sys
from pathlib import Path

replies = [json.loads(line) for line in Path(sys.argv[1]).read_text().splitlines() if line]
project, fixed_port = Path(sys.argv[2]), int(sys.argv[3])
assert len(replies) == 6, f"expected 6 replies, got {len(replies)}"
by_id = {reply["id"]: reply for reply in replies}

def payload(identifier):
    reply = by_id[identifier]
    assert "error" not in reply and "result" in reply, reply
    result = reply["result"]
    assert result.get("isError", False) is False, reply
    block = result["content"][0]
    assert block["type"] == "text", reply
    return json.loads(block["text"])

started = payload(3)
assert started["status"] == "running" and started["entry"] == "browser", started
ephemeral = started["identity"]["port"]
assert isinstance(ephemeral, int) and 1 <= ephemeral <= 65535, started
assert started["identity"]["projectId"] == "project:qoder" and started["identity"]["runId"] == "probe", started
assert started["url"] == f"http://127.0.0.1:{ephemeral}", started
assert Path(started["credential_file"]).is_file(), started
print(f"PASS: dashboard_service start without port returns the service identity on port {ephemeral}")
status = payload(4)
assert status["status"] == "running" and status["identity"]["port"] == ephemeral, status
assert status["identity"]["pid"] == started["identity"]["pid"], status
stopped = payload(5)
assert stopped["status"] == "stopped" and stopped["cleanup"] == "verified-absent", stopped
assert stopped["port"] == ephemeral and stopped["pid"] == started["identity"]["pid"], stopped
print("PASS: dashboard_service status/stop without port share the identity and verify the cleanup")
pinned = payload(6)
assert pinned["status"] == "running" and pinned["identity"]["port"] == fixed_port, pinned
assert payload(7)["identity"]["port"] == fixed_port, by_id[7]
assert payload(8)["status"] == "stopped" and payload(8)["cleanup"] == "verified-absent", by_id[8]
print(f"PASS: dashboard_service with explicit port {fixed_port} binds, reports and stops the same identity")
PYJUDGE
        then
            PASS=$((PASS+1)); PASS_LIST+=("status-dashboard/dashboard_service-optional-port")
        else
            FAIL=$((FAIL+1)); FAIL_LIST+=("status-dashboard/dashboard_service-optional-port")
            echo "  FAIL: status-dashboard/dashboard_service-optional-port" >&2
            cat "$tmp/session.err" >&2 || true
        fi
    else
        FAIL=$((FAIL+1)); FAIL_LIST+=("status-dashboard/dashboard_service-optional-port")
        echo "  FAIL: status-dashboard/dashboard_service-optional-port (fixture or session preparation failed)" >&2
    fi
    rm -rf "$tmp"
}

tools_call() {
    python3 - "$1" <<'PYEOF'
import json
import sys

print(json.dumps({
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {"name": "symbols", "arguments": {"path": sys.argv[1]}},
}))
PYEOF
}

echo "=== LazyQoder MCP integration test (6 declared servers + optional LSP endpoint) ==="
echo "Plugin root: $PLUGIN"
echo ""

OUT=$(rpc run-ledger '{"jsonrpc":"2.0","id":1,"method":"initialize"}')
check "run-ledger/initialize" "run-ledger" "$OUT"
OUT=$(rpc run-ledger '{"jsonrpc":"2.0","id":2,"method":"tools/list"}')
check "run-ledger/tools-list" "create_run" "$OUT"
OUT=$(rpc run-ledger '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_runs","arguments":{}}}')
check "run-ledger/list_runs" "runs" "$OUT"

OUT=$(rpc verification '{"jsonrpc":"2.0","id":1,"method":"initialize"}')
check "verification/initialize" "verification" "$OUT"
OUT=$(rpc verification '{"jsonrpc":"2.0","id":2,"method":"tools/list"}')
check "verification/tools-list" "discover_checks|summarize" "$OUT"

OUT=$(rpc status-dashboard '{"jsonrpc":"2.0","id":1,"method":"initialize"}')
check "status-dashboard/initialize" "status-dashboard" "$OUT"
OUT=$(rpc status-dashboard '{"jsonrpc":"2.0","id":2,"method":"tools/list"}')
check "status-dashboard/tools-list" "show_run_status" "$OUT"

OUT=$(rpc context-graph '{"jsonrpc":"2.0","id":1,"method":"initialize"}')
check "context-graph/initialize" "context-graph" "$OUT"
OUT=$(rpc context-graph '{"jsonrpc":"2.0","id":2,"method":"tools/list"}')
check "context-graph/tools-list" "blast_radius|symbol_search" "$OUT"
OUT=$(rpc context-graph '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"symbol_refs","arguments":{"symbol":"lazyqoder","limit":3}}}')
check "context-graph/symbol_refs" "symbol_refs|hits" "$OUT"

OUT=$(rpc code-intel '{"jsonrpc":"2.0","id":1,"method":"initialize"}')
check "code-intel/initialize" "code-intel" "$OUT"
OUT=$(rpc code-intel '{"jsonrpc":"2.0","id":2,"method":"tools/list"}')
check "code-intel/tools-list" "diagnostics|goto_definition" "$OUT"
CODE_INTEL_PATH="${LAZYQODER_MCP_TEST_CODE_PATH:-README.md}"
OUT=$(rpc code-intel "$(tools_call "$CODE_INTEL_PATH")")
if [ -f "$CWD/$CODE_INTEL_PATH" ]; then
    check "code-intel/symbols" "symbols|def " "$OUT"
else
    check "code-intel/no-project-file" "file not found" "$OUT"
fi

OUT=$(rpc docs '{"jsonrpc":"2.0","id":1,"method":"initialize"}')
check "docs/initialize" "docs" "$OUT"
OUT=$(rpc docs '{"jsonrpc":"2.0","id":2,"method":"tools/list"}')
check "docs/tools-list" "get_library_docs" "$OUT"
OUT=$(rpc docs '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_supported_registries","arguments":{}}}')
check "docs/list_registries" "npm|pypi" "$OUT"

for server in run-ledger verification status-dashboard context-graph code-intel docs lsp; do
    check_stream_protocol "$server"
done
check_invalid_tool_params
check_dashboard_service_optional_port

echo ""
echo "=== Results ==="
echo "Passed: $PASS"
echo "Failed: $FAIL"
if [ "$FAIL" -gt 0 ]; then
    echo "Failed items: ${FAIL_LIST[*]}"
    echo "MCP test: FAIL"
    exit 1
fi
echo "MCP test: ALL PASS"
