from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, TypeAlias

if TYPE_CHECKING:
    from lazyqoder_process_lifecycle import ProcessRecord


JSONValue: TypeAlias = str | int | float | bool | None | list["JSONValue"] | dict[str, "JSONValue"]


@dataclass(frozen=True, slots=True)
class CleanupObservation:
    root: ProcessRecord
    tracked: tuple[ProcessRecord, ...]
    current: tuple[ProcessRecord, ...]
    tracked_count: int
    current_count: int
    inspection_available: bool

    def as_json(self) -> JSONValue:
        def identity(record: ProcessRecord) -> JSONValue:
            return {
                "pid": record.pid,
                "parent_pid": record.parent_pid,
                "group_id": record.group_id,
                "state": record.state[:16],
                "started": record.started[:64],
            }

        return {
            "root": identity(self.root),
            "tracked": [identity(item) for item in self.tracked],
            "current": [identity(item) for item in self.current],
            "tracked_count": self.tracked_count,
            "current_count": self.current_count,
            "inspection_available": self.inspection_available,
        }
