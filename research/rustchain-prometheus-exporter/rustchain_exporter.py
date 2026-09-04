#!/usr/bin/env python3
"""Small dependency-free Prometheus exporter for the RustChain public node API."""

from __future__ import annotations

import argparse
import json
import math
import sys
import threading
import time
import urllib.parse
import urllib.request
from collections import Counter
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict

VERSION = "0.1.0"
DEFAULT_NODE_URL = "https://rustchain.org"
ENDPOINTS = {"health": "/health", "epoch": "/epoch", "miners": "/api/miners"}


def _finite_number(value: Any) -> float | None:
    if isinstance(value, bool):
        return 1.0 if value else 0.0
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def _metric(name: str, value: Any, help_text: str, metric_type: str = "gauge", labels: Dict[str, str] | None = None) -> list[str]:
    number = _finite_number(value)
    if number is None:
        return []
    label_text = ""
    if labels:
        pairs = []
        for key, raw_value in sorted(labels.items()):
            escaped = str(raw_value).replace("\\", "\\\\").replace("\n", "\\n").replace('"', '\\"')
            pairs.append(f'{key}="{escaped}"')
        label_text = "{" + ",".join(pairs) + "}"
    return [f"# HELP {name} {help_text}", f"# TYPE {name} {metric_type}", f"{name}{label_text} {number:g}"]


def _sample(name: str, value: Any, labels: Dict[str, str] | None = None) -> str | None:
    number = _finite_number(value)
    if number is None:
        return None
    label_text = ""
    if labels:
        pairs = []
        for key, raw_value in sorted(labels.items()):
            escaped = str(raw_value).replace("\\", "\\\\").replace("\n", "\\n").replace('"', '\\"')
            pairs.append(f'{key}="{escaped}"')
        label_text = "{" + ",".join(pairs) + "}"
    return f"{name}{label_text} {number:g}"


class RustChainCollector:
    def __init__(self, node_url: str, timeout: float = 5.0, cache_ttl: float = 15.0):
        parsed = urllib.parse.urlparse(node_url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("node_url must be an absolute http(s) URL")
        self.node_url = node_url.rstrip("/")
        self.timeout = max(0.1, float(timeout))
        self.cache_ttl = max(0.0, float(cache_ttl))
        self._lock = threading.Lock()
        self._cache_at = 0.0
        self._cache_text = ""

    def _fetch_json(self, endpoint: str) -> Any:
        url = self.node_url + endpoint
        request = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": f"rustchain-prometheus-exporter/{VERSION}"}, method="GET")
        with urllib.request.urlopen(request, timeout=self.timeout) as response:
            if response.status != 200:
                raise RuntimeError(f"HTTP {response.status} from {endpoint}")
            content_type = response.headers.get_content_type()
            if content_type not in {"application/json", "text/json", "text/plain"}:
                raise RuntimeError(f"unexpected content type {content_type!r} from {endpoint}")
            raw = response.read(2_000_000)
        return json.loads(raw.decode("utf-8"))

    def collect(self, force: bool = False) -> str:
        now = time.monotonic()
        with self._lock:
            if not force and self._cache_text and now - self._cache_at < self.cache_ttl:
                return self._cache_text

            started = time.monotonic()
            documents: Dict[str, Any] = {}
            endpoint_ok: Dict[str, int] = {}
            errors: Dict[str, str] = {}
            for name, path in ENDPOINTS.items():
                try:
                    documents[name] = self._fetch_json(path)
                    endpoint_ok[name] = 1
                except Exception as exc:
                    endpoint_ok[name] = 0
                    errors[name] = f"{type(exc).__name__}: {exc}"
                    print(f"upstream scrape failed endpoint={name}: {errors[name]}", file=sys.stderr)

            lines: list[str] = []
            lines.extend(_metric("rustchain_exporter_info", 1, "Static exporter build information.", labels={"version": VERSION}))
            lines.extend(["# HELP rustchain_exporter_endpoint_up Whether the upstream endpoint returned valid JSON.", "# TYPE rustchain_exporter_endpoint_up gauge"])
            for name in sorted(ENDPOINTS):
                lines.append(_sample("rustchain_exporter_endpoint_up", endpoint_ok[name], {"endpoint": name}) or "")

            health = documents.get("health")
            if isinstance(health, dict):
                lines.extend(_metric("rustchain_node_up", health.get("ok", False), "Whether the RustChain node reports ok=true."))
                lines.extend(_metric("rustchain_node_uptime_seconds", health.get("uptime_s"), "RustChain node uptime in seconds."))
                lines.extend(_metric("rustchain_node_backup_age_hours", health.get("backup_age_hours"), "Age of the latest node backup in hours."))
                lines.extend(_metric("rustchain_node_db_readwrite", health.get("db_rw"), "Whether the node reports its database as read/write."))
                lines.extend(_metric("rustchain_node_tip_age_slots", health.get("tip_age_slots"), "Age of the chain tip measured in slots."))
                version = str(health.get("version", "")).strip()
                if version:
                    lines.extend(_metric("rustchain_node_version_info", 1, "Static node version label.", labels={"version": version}))

            epoch = documents.get("epoch")
            if isinstance(epoch, dict):
                fields = [
                    ("rustchain_epoch_number", "epoch", "Current RustChain epoch number."),
                    ("rustchain_epoch_slot", "slot", "Current RustChain slot number."),
                    ("rustchain_epoch_blocks_per_epoch", "blocks_per_epoch", "Configured blocks per epoch."),
                    ("rustchain_epoch_enrolled_miners", "enrolled_miners", "Enrolled miners reported by /epoch."),
                    ("rustchain_epoch_pot_rtc", "epoch_pot", "RTC reward pot reported for the current epoch."),
                    ("rustchain_total_supply_rtc", "total_supply_rtc", "Total RTC supply reported by /epoch."),
                ]
                for metric_name, key, help_text in fields:
                    lines.extend(_metric(metric_name, epoch.get(key), help_text))

            miners_doc = documents.get("miners")
            if isinstance(miners_doc, dict):
                miners = miners_doc.get("miners")
                if not isinstance(miners, list):
                    miners = []
                lines.extend(_metric("rustchain_miners_reported", len(miners), "Number of miner records returned by /api/miners."))
                pagination = miners_doc.get("pagination")
                if isinstance(pagination, dict):
                    lines.extend(_metric("rustchain_miners_total", pagination.get("total"), "Total miner records reported by miners pagination."))
                    lines.extend(_metric("rustchain_miners_total_enrolled", pagination.get("total_enrolled"), "Total enrolled miners reported by miners pagination."))

                family_counts = Counter()
                multiplier_counts = Counter()
                for miner in miners:
                    if not isinstance(miner, dict):
                        continue
                    family = str(miner.get("device_family") or "unknown").strip() or "unknown"
                    family_counts[family] += 1
                    multiplier = _finite_number(miner.get("antiquity_multiplier"))
                    if multiplier is not None:
                        multiplier_counts[f"{multiplier:g}"] += 1

                lines.extend(["# HELP rustchain_miners_by_device_family Miner records grouped by device_family.", "# TYPE rustchain_miners_by_device_family gauge"])
                for family, count in sorted(family_counts.items()):
                    lines.append(_sample("rustchain_miners_by_device_family", count, {"device_family": family}) or "")
                lines.extend(["# HELP rustchain_miners_by_antiquity_multiplier Miner records grouped by reported antiquity multiplier.", "# TYPE rustchain_miners_by_antiquity_multiplier gauge"])
                for multiplier, count in sorted(multiplier_counts.items()):
                    lines.append(_sample("rustchain_miners_by_antiquity_multiplier", count, {"multiplier": multiplier}) or "")

            duration = time.monotonic() - started
            all_ok = int(all(endpoint_ok.values()))
            lines.extend(_metric("rustchain_scrape_success", all_ok, "Whether all configured RustChain upstream endpoints succeeded."))
            lines.extend(_metric("rustchain_scrape_duration_seconds", duration, "Time spent collecting the current upstream scrape."))
            if errors:
                lines.extend(["# HELP rustchain_exporter_scrape_error Static marker for an endpoint scrape error.", "# TYPE rustchain_exporter_scrape_error gauge"])
                for name in sorted(errors):
                    lines.append(_sample("rustchain_exporter_scrape_error", 1, {"endpoint": name}) or "")

            text = "\n".join(line for line in lines if line) + "\n"
            self._cache_text = text
            self._cache_at = time.monotonic()
            return text


def make_handler(collector: RustChainCollector):
    class Handler(BaseHTTPRequestHandler):
        server_version = f"RustChainExporter/{VERSION}"

        def do_GET(self):
            path = urllib.parse.urlparse(self.path).path
            if path == "/metrics":
                body = collector.collect().encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "text/plain; version=0.0.4; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            if path == "/healthz":
                body = b"ok\n"
                self.send_response(200)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            self.send_error(404, "Use /metrics or /healthz")

        def log_message(self, fmt: str, *args):
            print(f"{self.address_string()} - {fmt % args}")

    return Handler


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--node-url", default=DEFAULT_NODE_URL)
    parser.add_argument("--listen-address", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=9109)
    parser.add_argument("--timeout", type=float, default=5.0)
    parser.add_argument("--cache-ttl", type=float, default=15.0)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    collector = RustChainCollector(args.node_url, timeout=args.timeout, cache_ttl=args.cache_ttl)
    server = ThreadingHTTPServer((args.listen_address, args.port), make_handler(collector))
    print(f"rustchain-prometheus-exporter {VERSION} listening on http://{args.listen_address}:{args.port}/metrics; upstream={collector.node_url}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
