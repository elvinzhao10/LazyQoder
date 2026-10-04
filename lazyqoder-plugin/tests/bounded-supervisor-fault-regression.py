#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
# ─── How to run ───
# python3 bounded-supervisor-fault-regression.py <bounded-runner>
from __future__ import annotations

import importlib
import importlib.util
import io
import json
import os
import sys
import tempfile
from collections.abc import Callable
from contextlib import ExitStack, redirect_stderr
from pathlib import Path
from unittest import mock


def load_runner(path: Path):
    sys.path.insert(0, str(path.parent))
    spec = importlib.util.spec_from_file_location("bounded_supervisor_fault_regression", path)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


runner_path = Path(sys.argv[1]).resolve(strict=True)
runner = load_runner(runner_path)
process_module = importlib.import_module("lazyqoder_bounded_process")
lifecycle_module = importlib.import_module("lazyqoder_process_lifecycle")
supervisor_contract = importlib.import_module("lazyqoder_supervisor_contract")
supervisor_runner = importlib.import_module("lazyqoder_supervisor_runner")


def run_fault_case(
    name: str,
    target_code: str,
    configure: Callable[[ExitStack], None],
    target_must_start: bool,
    cleanup_status: str = "inspection-unavailable",
) -> None:
    with tempfile.TemporaryDirectory(prefix=f"todo13-{name}-") as temporary:
        root = Path(temporary)
        result_path = root / "result.json"
        target_started = root / "target-started"
        prior_argv = sys.argv
        runner.cancel_signal_received = False
        sys.argv = [
            str(runner_path),
            "--label",
            name,
            "--timeout",
            "1",
            "--result-file",
            str(result_path),
            "--",
            sys.executable,
            "-c",
            target_code.format(target_started=str(target_started)),
        ]
        diagnostic_log = io.StringIO()
        try:
            with ExitStack() as patches, redirect_stderr(diagnostic_log):
                configure(patches)
                returncode = runner.main()
        finally:
            sys.argv = prior_argv
            sys.stderr.write(diagnostic_log.getvalue())
        result = json.loads(result_path.read_text(encoding="utf-8"))
        assert returncode == 125, (name, returncode, result)
        assert result["status"] == "unavailable" and result["reason"] == "process_cleanup_failed", result
        assert result["cleanup"]["status"] == cleanup_status, result
        assert result["cleanup"]["supervisor_teardown"] == "verified-absent", result
        assert target_started.exists() is target_must_start, (name, target_started.exists())
        observation = result["cleanup"]["observation"]
        diagnostics = [json.loads(line.removeprefix("CLEANUP_DIAGNOSTIC: "))
                       for line in diagnostic_log.getvalue().splitlines() if line.startswith("CLEANUP_DIAGNOSTIC: ")]
        assert len(diagnostics) == 1 and diagnostics[0]["observation"] == observation, diagnostics
        assert diagnostics[0]["status"] == cleanup_status, diagnostics
        assert diagnostics[0]["supervisor_teardown"] == "verified-absent", diagnostics
        assert observation["root"]["pid"] in result["cleanup"]["tracked_pids"], result
        if cleanup_status == "inspection-unavailable":
            assert observation["inspection_available"] is False, result
            assert observation["current"] == [], result
        else:
            assert observation["inspection_available"] is True and observation["current"], result
            assert result["cleanup"]["supervisor_status"] == "exited", result
        if name in ("teardown-eperm", "signal-eperm"):
            assert "PASS: misleading target success" in result["tail"], result
        print("RECEIPT:", json.dumps(result))


def prelaunch_fault(patches: ExitStack) -> None:
    unavailable = lifecycle_module.InspectionUnavailable("EPERM prelaunch inspection")
    patches.enter_context(mock.patch.object(runner, "inspect_processes", return_value=unavailable))


def signal_fault(patches: ExitStack) -> None:
    refused = lifecycle_module.SignalResult.refused("injected EPERM")
    patches.enter_context(mock.patch.object(runner, "signal_owned_group", return_value=refused))


def synthetic_handshake(process, _status_file, _inspector, _deadline):
    root = lifecycle_module.ProcessRecord(
        process.pid,
        os.getpid(),
        process.pid,
        "S",
        f"synthetic-start-{process.pid}",
    )
    tracker = lifecycle_module.OwnershipTracker(root, (root,))
    ready = supervisor_contract.SupervisorStatus(
        supervisor_contract.SupervisorState.READY,
        process.pid,
        process.pid,
    )
    return process_module.HandshakeOutcome(tracker, ready)


def runtime_fault(patches: ExitStack) -> None:
    unavailable = lifecycle_module.InspectionUnavailable("EPERM runtime inspection")
    patches.enter_context(mock.patch.object(supervisor_runner, "await_supervisor_ready", side_effect=synthetic_handshake))
    patches.enter_context(mock.patch.object(runner, "inspect_processes", return_value=unavailable))


def teardown_fault(patches: ExitStack) -> None:
    phase = {"teardown": False}
    tracked: dict[str, lifecycle_module.ProcessRecord] = {}

    def handshake(process, status_file, inspector, deadline):
        outcome = synthetic_handshake(process, status_file, inspector, deadline)
        tracked["root"] = outcome.tracker.root
        return outcome

    def inspector():
        if phase["teardown"]:
            return lifecycle_module.InspectionUnavailable("EPERM teardown inspection")
        return lifecycle_module.InspectionAvailable((tracked["root"],))

    real_wait = supervisor_runner.wait_for_child

    def wait_then_teardown(*args, **kwargs):
        outcome = real_wait(*args, **kwargs)
        phase["teardown"] = True
        return outcome

    patches.enter_context(mock.patch.object(supervisor_runner, "await_supervisor_ready", side_effect=handshake))
    patches.enter_context(mock.patch.object(runner, "inspect_processes", side_effect=inspector))
    patches.enter_context(mock.patch.object(supervisor_runner, "wait_for_child", side_effect=wait_then_teardown))


run_fault_case(
    "prelaunch-eperm",
    "import pathlib,time; pathlib.Path({target_started!r}).write_text('started'); time.sleep(30)",
    prelaunch_fault,
    False,
)
run_fault_case(
    "runtime-eperm",
    "import pathlib,time; pathlib.Path({target_started!r}).write_text('started'); time.sleep(30)",
    runtime_fault,
    True,
)
run_fault_case(
    "teardown-eperm",
    "import pathlib; pathlib.Path({target_started!r}).write_text('started'); print('PASS: misleading target success')",
    teardown_fault,
    True,
)
run_fault_case(
    "signal-eperm",
    "import pathlib; pathlib.Path({target_started!r}).write_text('started'); print('PASS: misleading target success')",
    signal_fault,
    True,
    "signal-refused",
)

print("PASS: prelaunch EPERM produces typed failure without starting target or leaking supervisor")
print("PASS: runtime EPERM produces typed failure and mandatory supervisor teardown")
print("PASS: teardown EPERM produces typed failure and mandatory supervisor teardown")
print("PASS: signal refusal preserves failure despite successful target output and captures live identity")
