# RustChain Prometheus Exporter

A small dependency-free Prometheus exporter for RustChain node health, epoch state, miner activity, and chain statistics.

Bounty target: `Scottcjn/rustchain-bounties#504`.

## What it scrapes

Default upstream: `https://rustchain.org`

| Endpoint | Metrics |
|---|---|
| `/health` | node up/ok, uptime, DB read/write state, backup age, tip age, node version |
| `/epoch` | epoch number, slot, blocks per epoch, enrolled miners, epoch pot, total supply |
| `/api/miners` | returned/total/enrolled miner counts, counts by device family, counts by reported antiquity multiplier |

The exporter intentionally aggregates miner activity instead of putting wallet/miner IDs into Prometheus labels. That keeps label cardinality bounded and avoids turning a monitoring database into a wallet-identity index.

## Run

Requires Python 3.10+ and no third-party packages.

```bash
python3 rustchain_exporter.py \
  --node-url https://rustchain.org \
  --listen-address 127.0.0.1 \
  --port 9109
```

Then:

```bash
curl http://127.0.0.1:9109/healthz
curl http://127.0.0.1:9109/metrics
```

Options:

```text
--node-url       RustChain node base URL
--listen-address exporter bind address (default 127.0.0.1)
--port           exporter port (default 9109)
--timeout        upstream HTTP timeout in seconds (default 5)
--cache-ttl      minimum seconds between upstream fetches (default 15)
```

TLS verification uses Python's default verified HTTPS context. The exporter does not disable certificate verification and performs only read-only `GET` requests.

## Prometheus

Copy `prometheus.yml.example` or add:

```yaml
scrape_configs:
  - job_name: rustchain
    scrape_interval: 30s
    static_configs:
      - targets: ["127.0.0.1:9109"]
```

## systemd

1. Create a service account and install the files:

```bash
sudo useradd --system --home /opt/rustchain-exporter --shell /usr/sbin/nologin rustchain-exporter
sudo mkdir -p /opt/rustchain-exporter
sudo cp rustchain_exporter.py /opt/rustchain-exporter/
sudo chmod 755 /opt/rustchain-exporter/rustchain_exporter.py
sudo chown -R rustchain-exporter:rustchain-exporter /opt/rustchain-exporter
sudo cp rustchain-exporter.service /etc/systemd/system/
```

2. Optionally override the node URL:

```bash
sudo systemctl edit rustchain-exporter
```

```ini
[Service]
Environment=RUSTCHAIN_NODE_URL=https://your-node.example
```

3. Start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now rustchain-exporter
sudo systemctl status rustchain-exporter
```

The unit binds to localhost by default. Put Prometheus on the same host, or change the listen address deliberately if remote scraping is required.

## Validation

Run deterministic offline tests:

```bash
python3 -m unittest -v test_exporter.py
python3 -m py_compile rustchain_exporter.py test_exporter.py
```

The tests launch a local mock RustChain API, verify successful metric extraction, and verify that a missing upstream endpoint is represented as `endpoint_up=0` / `scrape_success=0` instead of crashing `/metrics`.

`example.metrics` is generated from the test fixture, not represented as a live production scrape. Current endpoint shapes were cross-checked against the public RustChain `/health`, `/epoch`, and `/api/miners` responses before submission.

## Metric design

- `rustchain_exporter_endpoint_up{endpoint=...}` tells you exactly which upstream surface failed.
- `rustchain_scrape_success` is `1` only when all three upstream requests succeeded.
- Metrics from endpoints that did succeed are still exported during a partial failure.
- A 15-second cache by default prevents Prometheus refreshes from hammering the upstream node.
- Individual miner IDs are not exported as labels, avoiding unbounded/high-cardinality series.

## Example alerts

```yaml
groups:
  - name: rustchain
    rules:
      - alert: RustChainNodeUnhealthy
        expr: rustchain_node_up == 0 or rustchain_exporter_endpoint_up{endpoint="health"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: RustChain node health endpoint is failing

      - alert: RustChainTipAging
        expr: rustchain_node_tip_age_slots > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: RustChain tip is older than two slots
```

## Security / operational notes

- The exporter is read-only.
- No wallet keys, API secrets, transfer endpoints, or private RPC surfaces are used.
- Do not expose the exporter publicly unless you intend its metrics to be public.
- Upstream error details are logged to stderr; the Prometheus error series uses only a bounded endpoint label.
