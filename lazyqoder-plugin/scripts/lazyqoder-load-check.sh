#!/usr/bin/env bash
set -euo pipefail

reject_symlinked_path_components() {
    local remaining="${1#/}"
    local prefix=/
    local component
    local candidate

    while [ -n "$remaining" ]; do
        component="${remaining%%/*}"
        if [ "$component" = "$remaining" ]; then
            remaining=
        else
            remaining="${remaining#*/}"
        fi
        case "$component" in
            ''|.) continue ;;
            ..) prefix="$prefix/.."; continue ;;
        esac
        candidate="$prefix$component"
        if [ -L "$candidate" ] && ! is_macos_var_alias "$candidate"; then
            echo "QODER_PLUGIN_ROOT path must not be symlinked" >&2
            exit 1
        fi
        prefix="$candidate/"
    done
}

is_macos_var_alias() {
    [ "$1" = /var ] && [ "$(CDPATH= cd -P -- /var && pwd)" = /private/var ]
}

if [ -n "${QODER_PLUGIN_ROOT:-}" ]; then
    case "$QODER_PLUGIN_ROOT" in
        /*)
            PLUGIN_ROOT="$QODER_PLUGIN_ROOT"
            reject_symlinked_path_components "$PLUGIN_ROOT"
            ;;
        *)
            echo "QODER_PLUGIN_ROOT must be an absolute path" >&2
            exit 1
            ;;
    esac
else
    PLUGIN_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fi

python3 - "$PLUGIN_ROOT" <<'PY'
import json
import os
import subprocess
import sys

root = os.path.realpath(sys.argv[1])
failed = False

def result(state, label, detail):
    global failed
    print(f"{state} {label}: {detail}")
    if state == "FAIL":
        failed = True

def load_json(path, label):
    try:
        with open(path, encoding="utf-8") as handle:
            value = json.load(handle)
    except FileNotFoundError:
        result("FAIL", label, "missing")
        return None
    except (OSError, json.JSONDecodeError) as exc:
        result("FAIL", label, f"invalid JSON ({exc})")
        return None
    if not isinstance(value, dict):
        result("FAIL", label, "must be a JSON object")
        return None
    result("PASS", label, "valid JSON")
    return value

def count_dir_md(label, directory):
    if not os.path.isdir(directory):
        result("FAIL", label, "directory missing")
        return
    actual = sum(
        1 for name in os.listdir(directory)
        if name.endswith(".md") and os.path.isfile(os.path.join(directory, name))
    )
    result("PASS", label, f"{actual}")

def count_skills(label, directory):
    if not os.path.isdir(directory):
        result("FAIL", label, "directory missing")
        return
    actual = sum(
        1 for base, _, names in os.walk(directory)
        if "SKILL.md" in names and os.path.basename(base).startswith("lazy-")
    )
    result("PASS", label, f"{actual}")

print("=== LazyQoder Package Readiness Check ===")
print(f"Plugin root: {root}")

if not os.path.isdir(root):
    result("FAIL", "plugin root", "directory missing")
    print("PACKAGE_READINESS=failed")
    sys.exit(1)

manifest_path = os.path.join(root, ".qoder-plugin", "plugin.json")

for legal_name in ("LICENSE", "NOTICE"):
    legal_path = os.path.join(root, legal_name)
    if os.path.isfile(legal_path):
        result("PASS", f"package {legal_name}", "present")
    else:
        result("FAIL", f"package {legal_name}", "missing from plugin root")

expected_components = {
    "skills": ["./skills/"],
    "commands": ["./commands/"],
    "agents": ["./agents/"],
    "hooks": ["./hooks/hooks.json"],
    "mcpServers": ["./.mcp.json"],
}
manifest = load_json(manifest_path, "Qoder manifest (.qoder-plugin/plugin.json)")
if manifest is None:
    pass
elif manifest.get("name") != "lazyqoder":
    result("FAIL", "Qoder manifest name", "expected 'lazyqoder'")
elif manifest.get("version") != "1.2.2":
    result("FAIL", "Qoder manifest version", f"expected '1.2.2', got {manifest.get('version')!r}")
else:
    result("PASS", "Qoder manifest name", "lazyqoder")
    result("PASS", "Qoder manifest version", "1.2.2")
    for key, expected in expected_components.items():
        actual = manifest.get(key)
        if actual == expected:
            result("PASS", f"Qoder manifest {key}", "declared")
        else:
            result("FAIL", f"Qoder manifest {key}", f"expected {expected!r}, got {actual!r}")

count_skills("skills", os.path.join(root, "skills"))
count_dir_md("commands", os.path.join(root, "commands"))
count_dir_md("agents", os.path.join(root, "agents"))

hooks = load_json(os.path.join(root, "hooks", "hooks.json"), "hooks configuration")
if hooks is not None:
    actual = hooks.get("hooks")
    count = len(actual) if isinstance(actual, dict) else -1
    result("PASS", "hooks", f"{count}")

mcp = load_json(os.path.join(root, ".mcp.json"), "MCP configuration")
if mcp is not None:
    actual = mcp.get("mcpServers")
    count = len(actual) if isinstance(actual, dict) else -1
    result("PASS", "MCP servers", f"{count}")

contract_path = os.path.join(root, "contracts", "automatic-tooling-contract.v1.json")
contract_digest_path = contract_path + ".sha256"
policy_adapter_path = os.path.join(root, "tooling", "lazyqoder_policy.py")
readiness_adapter_path = os.path.join(root, "tooling", "lazyqoder_capability_readiness.py")
try:
    import hashlib
    with open(contract_path, "rb") as handle:
        contract_bytes = handle.read()
    with open(contract_digest_path, encoding="utf-8") as handle:
        expected_digest = handle.read().split()[0]
    contract = json.loads(contract_bytes)
    if (
        hashlib.sha256(contract_bytes).hexdigest() != expected_digest
        or contract.get("schema") != "lazy-series.automatic-tooling.contract"
        or contract.get("schema_version") != 1
    ):
        raise ValueError("invalid contract digest or schema")
except (FileNotFoundError, IndexError, OSError, ValueError, json.JSONDecodeError) as exc:
    result("FAIL", "automatic tooling contract", str(exc))
else:
    result("PASS", "automatic tooling contract", "verified")

if os.path.isfile(policy_adapter_path):
    result("PASS", "provider policy adapter", "present")
else:
    result("FAIL", "provider policy adapter", "missing")

try:
    report = subprocess.run(
        [sys.executable, "-B", readiness_adapter_path, "readiness-report", "--json"],
        check=True,
        capture_output=True,
        text=True,
    )
    records = json.loads(report.stdout).get("records")
    if not isinstance(records, list) or len(records) != 9 or any(record.get("reason_code") == "CONTRACT_INTEGRITY_INVALID" for record in records):
        raise ValueError("canonical report did not return nine integrity-valid records")
except (FileNotFoundError, OSError, ValueError, json.JSONDecodeError, subprocess.CalledProcessError) as exc:
    result("FAIL", "canonical capability readiness", str(exc))
else:
    result("PASS", "canonical capability readiness", "read-only report available; host and MCP connection remain unchecked")

machine_status = subprocess.run(
    ["node", os.path.join(root, "scripts", "lazyqoder-machine-status.js"), "--json"],
    check=False,
    capture_output=True,
    text=True,
)
try:
    status = json.loads(machine_status.stdout)
    host_rows = status.get("hosts")
    if (
        machine_status.returncode != 0
        or status.get("schema_version") != 2
        or status.get("version") != "1.2.2"
        or status.get("package_readiness") != {"status": "ready", "scope": "package"}
        or status.get("host_readiness") != {"status": "pending"}
        or not isinstance(host_rows, list)
        or [row.get("host") for row in host_rows] != ["qodercli-cli", "qodercli-ide", "qoder"]
        or any(row.get("host_readiness") != "pending" for row in host_rows)
    ):
        raise ValueError("status fields do not match the v2 package boundary")
except (AttributeError, TypeError, ValueError, json.JSONDecodeError) as exc:
    result("FAIL", "machine status v2", str(exc))
else:
    result("PASS", "machine status v2", "three package-scoped hosts; host readiness pending")

if failed:
    print("PACKAGE_READINESS=failed")
    print("Package readiness failed. Reinstall the full plugin or correct the named package file.")
    sys.exit(1)

print("PACKAGE_READINESS=full")
print("READINESS_SCOPE=package-ready")
print("Package files are ready. Host activation, runtime loading, and MCP status remain unchecked.")
PY
