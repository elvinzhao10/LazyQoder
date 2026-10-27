#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
# ─── How to run ───
# python3 bounded-lifecycle-state-machine-regression.py <bounded-runner>
from __future__ import annotations

import importlib.util
import json
import sys
from collections.abc import Callable
from pathlib import Path


def load_runner(path: Path):
    sys.path.insert(0, str(path.resolve().parent))
    spec = importlib.util.spec_from_file_location("bounded_lifecycle_red", path)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


runner = load_runner(Path(sys.argv[1]))


def record(pid: int, parent: int, group: int, started: str):
    return runner.ProcessRecord(pid, parent, group, "S", started)


root = record(4100, 1, 4100, "root-start")
child = record(4101, 4100, 4100, "child-start")
escaped = record(4101, 1, 5100, "child-start")
reused = record(4101, 1, 4100, "new-start")
foreign_group_member = record(9999, 1, 4100, "foreign-start")
orphaned_owned_member = record(4102, 1, 4100, "orphan-start")


def available(*records):
    return runner.InspectionAvailable(tuple(records))


def unavailable(reason: str):
    return runner.InspectionUnavailable(reason)


class SequenceInspector:
    def __init__(self, *results, repeat_last: bool = False) -> None:
        self._results = list(results)
        self._last = results[-1] if repeat_last else None

    def __call__(self):
        if self._results:
            return self._results.pop(0)
        assert self._last is not None, "inspection sequence exhausted"
        return self._last


class RecordingSignaler:
    def __init__(self, *results) -> None:
        self._results = list(results)
        self.groups: list[int] = []

    def __call__(self, group_id: int, _signal_number: int):
        self.groups.append(group_id)
        assert self._results, "signal sequence exhausted"
        return self._results.pop(0)


def cleanup_case(name: str, observations, signal_results, expected: str, expected_groups: list[int], repeat_last: bool = False) -> None:
    tracker = runner.OwnershipTracker.establish(root, available(root, child))
    signaler = RecordingSignaler(*signal_results)
    receipt = runner.cleanup_owned_processes(
        tracker,
        SequenceInspector(*observations, repeat_last=repeat_last),
        signaler,
    )
    assert receipt.status.value == expected, (name, receipt)
    assert signaler.groups == expected_groups, (name, signaler.groups)
    if expected != "verified-absent":
        observation = receipt.observation
        assert observation is not None, (name, "missing refusal observation")
        data = observation.as_json()
        assert data["root"]["pid"] == root.pid, (name, data)
        assert data["tracked_count"] >= 2, (name, data)
        assert len(data["tracked"]) <= 16 and len(data["current"]) <= 16, data
        if isinstance(observations[-1], runner.InspectionUnavailable):
            assert data["inspection_available"] is False, (name, data)
        else:
            assert [(item["pid"], item["started"], item["group_id"]) for item in data["current"]] == [
                (item.pid, item.started, item.group_id) for item in observations[-1].records
            ], (name, data)
        print("RECEIPT:", json.dumps({"case": name, "status": expected, "observation": data}))
    print(f"PASS: {name} -> {expected}")


cleanup_case("empty successful post-inspection", (available(),), (), "verified-absent", [])
cleanup_case(
    "ESRCH followed by unavailable inspection",
    (available(child), unavailable("ps-timeout")),
    (runner.SignalResult.not_found(),),
    "inspection-unavailable",
    [4100],
)
cleanup_case(
    "EPERM with verified survivor",
    (available(child), available(child)),
    (runner.SignalResult.refused("eperm"),),
    "signal-refused",
    [4100],
)
cleanup_case(
    "TERM and KILL leave verified survivor",
    (available(child), available(child), available(child), available(child)),
    (runner.SignalResult.sent(), runner.SignalResult.sent()),
    "verified-remaining",
    [4100, 4100],
    repeat_last=True,
)
cleanup_case(
    "process exits just after KILL inspection",
    (available(child), available(child), available(child), available(child), available()),
    (runner.SignalResult.sent(), runner.SignalResult.sent()),
    "verified-absent",
    [4100, 4100],
)
cleanup_case("PID start identity reuse", (available(reused),), (), "identity-changed", [])
cleanup_case("tracked descendant escaped PGID", (available(escaped),), (), "verified-remaining", [])
cleanup_case("missing process inspection", (unavailable("ps-missing"),), (), "inspection-unavailable", [])
cleanup_case("malformed process inspection", (unavailable("ps-malformed"),), (), "inspection-unavailable", [])
cleanup_case("timed-out process inspection", (unavailable("ps-timeout"),), (), "inspection-unavailable", [])
cleanup_case("post-signal identity reuse", (available(child), available(reused)),
             (runner.SignalResult.sent(),), "identity-changed", [4100])
cleanup_case("post-signal foreign group", (available(child), available(foreign_group_member)),
             (runner.SignalResult.sent(),), "identity-changed", [4100])
cleanup_case("post-signal escaped child", (available(child), available(escaped)),
             (runner.SignalResult.sent(),), "verified-remaining", [4100])
cleanup_case("settling identity reuse",
             (available(child), available(child), available(child), available(child), available(reused)),
             (runner.SignalResult.sent(), runner.SignalResult.sent()), "identity-changed", [4100, 4100])

# Given a large owned tree and an unrelated process, when the root PID is reused,
# then the refusal captures bounded identity-only observations without signalling.
large_tree = tuple(runner.ProcessRecord(pid, root.pid, root.pid, "S" * 100, "x" * 100)
                   for pid in range(4200, 4240))
large_tracker = runner.OwnershipTracker.establish(root, available(root, *large_tree))
large_signaler = RecordingSignaler()
changed_root = record(root.pid, 1, root.pid, "replacement-start")
unrelated = record(9998, 1, 9998, "secret-unrelated-start")
large_receipt = runner.cleanup_owned_processes(
    large_tracker, SequenceInspector(available(changed_root, *large_tree, unrelated)), large_signaler,
)
assert large_receipt.status.value == "identity-changed" and large_signaler.groups == []
large_data = large_receipt.observation.as_json()
assert large_data["tracked_count"] == 41 and large_data["current_count"] == 41, large_data
assert len(large_data["tracked"]) == 16 and len(large_data["current"]) == 16, large_data
assert large_data["root"]["started"] == "root-start", large_data
assert large_data["current"][0]["started"] == "replacement-start", large_data
assert "secret-unrelated-start" not in json.dumps(large_data), large_data
assert all(set(item) == {"pid", "parent_pid", "group_id", "state", "started"}
           for item in large_data["tracked"] + large_data["current"]), large_data
assert all(len(item["state"]) <= 16 and len(item["started"]) <= 64
           for item in large_data["tracked"] + large_data["current"]), large_data
print("PASS: bounded refusal observation excludes unrelated process data")

# Given an invalid root group, when cleanup is attempted, then no signal is sent.
invalid_root = record(4100, 1, 1, "invalid-start")
invalid_tracker = runner.OwnershipTracker.establish(invalid_root, available(invalid_root))
invalid_signaler = RecordingSignaler()
invalid_receipt = runner.cleanup_owned_processes(invalid_tracker, SequenceInspector(), invalid_signaler)
assert invalid_receipt.status.value == "inspection-unavailable" and invalid_signaler.groups == []
assert invalid_receipt.observation.as_json()["inspection_available"] is False
print("PASS: invalid root group remains refused without signalling")
invalid_receipt = runner.cleanup_owned_processes(
    runner.OwnershipTracker(invalid_root, (invalid_root,)),
    SequenceInspector(available(invalid_root)), invalid_signaler,
)
assert invalid_receipt.status.value == "identity-changed" and invalid_signaler.groups == []
print("PASS: invalid group at signal boundary remains refused without signalling")

foreign_tracker = runner.OwnershipTracker.establish(root, available(root, child))
foreign_signaler = RecordingSignaler()
foreign_receipt = runner.cleanup_owned_processes(
    foreign_tracker,
    SequenceInspector(available(foreign_group_member)),
    foreign_signaler,
)
assert foreign_receipt.status.value == "identity-changed", foreign_receipt
assert foreign_receipt.tracked_pids == (4100, 4101), foreign_receipt
assert foreign_signaler.groups == [], foreign_signaler.groups
assert foreign_receipt.observation.current == (foreign_group_member,), foreign_receipt
print("PASS: never-descended recycled PGID fails closed without signalling")

continuous_tracker = runner.OwnershipTracker.establish(root, available(root, child))
continuous_tracker = continuous_tracker.observe(available(root, orphaned_owned_member))
assert tuple(item.pid for item in continuous_tracker.tracked) == (4100, 4101, 4102), continuous_tracker
print("PASS: stable live group leader keeps orphaned invocation member observable")

assert runner.persistence_allowed(0, True, True, True, runner.CleanupStatus.VERIFIED_ABSENT)
for status in (
    runner.CleanupStatus.VERIFIED_REMAINING,
    runner.CleanupStatus.INSPECTION_UNAVAILABLE,
    runner.CleanupStatus.SIGNAL_REFUSED,
    runner.CleanupStatus.IDENTITY_CHANGED,
):
    assert not runner.persistence_allowed(0, True, True, True, status), status
assert not runner.persistence_allowed(0, False, True, True, runner.CleanupStatus.VERIFIED_ABSENT)
assert not runner.persistence_allowed(0, True, False, True, runner.CleanupStatus.VERIFIED_ABSENT)
assert not runner.persistence_allowed(0, True, True, False, runner.CleanupStatus.VERIFIED_ABSENT)
print("PASS: exhaustive persistence boundary")
