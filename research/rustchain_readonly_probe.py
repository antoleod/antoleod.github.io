#!/usr/bin/env python3
"""Read-only RustChain node probe with strict TLS and schema normalization."""

from __future__ import annotations

import argparse
import json
import statistics
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from typing import Any

DEFAULT_BASE_URL = "https://rustchain.org"
TIMEOUT_SECONDS = 12


def fetch_json(base_url: str, path: str) -> Any:
    """GET a public JSON endpoint using normal certificate verification."""
    url = urllib.parse.urljoin(base_url.rstrip("/") + "/", path.lstrip("/"))
    req = urllib.request.Request(
        url,
        headers={"Accept": "application/json", "User-Agent": "rustchain-readonly-probe/1.0"},
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as response:
        if response.status != 200:
            raise RuntimeError(f"GET {url} returned HTTP {response.status}")
        content_type = response.headers.get_content_type()
        if content_type != "application/json":
            raise RuntimeError(f"GET {url} returned unexpected content type {content_type!r}")
        return json.load(response)


def normalize_miners(payload: Any) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Accept both the documented legacy list and the current paginated envelope."""
    pagination = None
    if isinstance(payload, list):
        miners = payload
    elif isinstance(payload, dict) and isinstance(payload.get("miners"), list):
        miners = payload["miners"]
        if isinstance(payload.get("pagination"), dict):
            pagination = payload["pagination"]
    else:
        raise ValueError("/api/miners must be a JSON list or an object with a miners[] array")

    if not all(isinstance(item, dict) for item in miners):
        raise ValueError("every miner entry must be a JSON object")
    return miners, pagination


def build_summary(health: Any, epoch: Any, miners_payload: Any) -> dict[str, Any]:
    if not isinstance(health, dict) or not isinstance(epoch, dict):
        raise ValueError("/health and /epoch must return JSON objects")

    miners, pagination = normalize_miners(miners_payload)
    families = Counter(str(m.get("device_family", "unknown")) for m in miners)
    multipliers = [
        float(m["antiquity_multiplier"])
        for m in miners
        if isinstance(m.get("antiquity_multiplier"), (int, float))
    ]

    result: dict[str, Any] = {
        "node": {
            "ok": health.get("ok"),
            "version": health.get("version"),
            "tip_age_slots": health.get("tip_age_slots"),
        },
        "epoch": {
            "number": epoch.get("epoch"),
            "slot": epoch.get("slot"),
            "enrolled_miners": epoch.get("enrolled_miners"),
            "epoch_pot_rtc": epoch.get("epoch_pot"),
        },
        "observed_miners": len(miners),
        "device_families": dict(sorted(families.items())),
    }

    if multipliers:
        result["antiquity_multiplier"] = {
            "min": min(multipliers),
            "max": max(multipliers),
            "mean": round(statistics.fmean(multipliers), 4),
        }
    if pagination is not None:
        result["pagination"] = pagination
    return result


def self_test() -> None:
    health = {"ok": True, "version": "test", "tip_age_slots": 0}
    epoch = {"epoch": 7, "slot": 1001, "enrolled_miners": 2, "epoch_pot": 1.5}
    miners_envelope = {
        "miners": [
            {"device_family": "PowerPC", "antiquity_multiplier": 2.0},
            {"device_family": "x86", "antiquity_multiplier": 0.8},
        ],
        "pagination": {"count": 2, "limit": 100, "offset": 0, "total": 2},
    }
    summary = build_summary(health, epoch, miners_envelope)
    assert summary["observed_miners"] == 2
    assert summary["device_families"] == {"PowerPC": 1, "x86": 1}
    assert summary["antiquity_multiplier"]["mean"] == 1.4

    # Preserve compatibility with the older bare-array shape shown in API.md.
    miners_legacy = [{"device_family": "ARM", "antiquity_multiplier": 1.0}]
    legacy = build_summary(health, epoch, miners_legacy)
    assert legacy["observed_miners"] == 1
    assert "pagination" not in legacy
    print("self-test: PASS")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        self_test()
        return 0

    try:
        health = fetch_json(args.base_url, "/health")
        epoch = fetch_json(args.base_url, "/epoch")
        miners = fetch_json(args.base_url, "/api/miners")
        print(json.dumps(build_summary(health, epoch, miners), indent=2, sort_keys=True))
        return 0
    except (urllib.error.URLError, TimeoutError, RuntimeError, ValueError, json.JSONDecodeError) as exc:
        print(f"probe failed: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
