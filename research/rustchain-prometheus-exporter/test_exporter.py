#!/usr/bin/env python3
import json
import threading
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from rustchain_exporter import RustChainCollector

FIXTURES = {
    "/health": {"backup_age_hours": 7.0, "db_rw": True, "ok": True, "tip_age_slots": 0, "uptime_s": 399149, "version": "2.2.1-rip200"},
    "/epoch": {"blocks_per_epoch": 144, "enrolled_miners": 3, "epoch": 189, "epoch_pot": 1.5, "slot": 27299, "total_supply_rtc": 8388608},
    "/api/miners": {
        "miners": [
            {"antiquity_multiplier": 0.8, "device_family": "x86"},
            {"antiquity_multiplier": 0.8, "device_family": "x86"},
            {"antiquity_multiplier": 1.2, "device_family": "Apple Silicon"},
        ],
        "pagination": {"count": 3, "limit": 100, "offset": 0, "total": 3, "total_enrolled": 3},
    },
}


class FixtureHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path not in FIXTURES:
            self.send_error(404)
            return
        body = json.dumps(FIXTURES[self.path]).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_):
        pass


class ExporterTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), FixtureHandler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def test_collects_core_metrics(self):
        collector = RustChainCollector(self.base_url, timeout=1, cache_ttl=0)
        text = collector.collect(force=True)
        self.assertIn("rustchain_node_up 1", text)
        self.assertIn("rustchain_node_uptime_seconds 399149", text)
        self.assertIn("rustchain_epoch_number 189", text)
        self.assertIn("rustchain_total_supply_rtc 8.38861e+06", text)
        self.assertIn('rustchain_miners_by_device_family{device_family="x86"} 2', text)
        self.assertIn('rustchain_miners_by_antiquity_multiplier{multiplier="0.8"} 2', text)
        self.assertIn("rustchain_scrape_success 1", text)

    def test_partial_failure_is_exported_not_raised(self):
        del FIXTURES["/epoch"]
        try:
            collector = RustChainCollector(self.base_url, timeout=1, cache_ttl=0)
            text = collector.collect(force=True)
            self.assertIn('rustchain_exporter_endpoint_up{endpoint="epoch"} 0', text)
            self.assertIn("rustchain_scrape_success 0", text)
            self.assertIn('rustchain_exporter_scrape_error{endpoint="epoch"} 1', text)
        finally:
            FIXTURES["/epoch"] = {"blocks_per_epoch": 144, "enrolled_miners": 3, "epoch": 189, "epoch_pot": 1.5, "slot": 27299, "total_supply_rtc": 8388608}


if __name__ == "__main__":
    unittest.main(verbosity=2)
