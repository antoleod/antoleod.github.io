# Reading RustChain safely: a zero-secret, read-only node observability probe

RustChain is unusual in a useful way: the network exposes enough public state to inspect node health, the current epoch, and the enrolled-miner set without creating a wallet, submitting an attestation, or touching a write endpoint. That makes it possible to build a small operational probe with the Python standard library only.

This note shows exactly that. The goal is not to mine, transfer RTC, or benchmark hardware. It is to answer a narrower engineering question: **can I observe the public RustChain node safely and turn its JSON into a stable summary that monitoring or an agent can consume?**

Upstream project: <https://github.com/Scottcjn/Rustchain>  
Current API reference: <https://github.com/Scottcjn/Rustchain/blob/main/docs/API.md>

The runnable companion script for this article is here:

- [`rustchain_readonly_probe.py`](./rustchain_readonly_probe.py)
- [validation evidence](./rustchain_readonly_probe_evidence.txt)

## The three endpoints

The public API reference documents `https://rustchain.org` as the base URL and explicitly says the public domain uses HTTPS with a browser-trusted certificate. For a read-only health snapshot, three GETs are enough:

```text
GET https://rustchain.org/health
GET https://rustchain.org/epoch
GET https://rustchain.org/api/miners
```

`/health` gives the node's health/version information. `/epoch` reports the active epoch, slot, reward pot and enrolled-miner count. `/api/miners` exposes the enrolled/active miner records, including device family and antiquity multiplier.

The important security property is what is *not* required: no private key, no API key, no seed phrase and no wallet balance are needed for this probe. The script also never disables TLS certificate checking. That last detail matters because old examples around self-signed node IPs can tempt developers to reach for `verify=False`; the canonical `rustchain.org` API does not require that compromise.

## A small schema wrinkle worth handling

While preparing the probe, I found a compatibility detail that a robust client should account for. The current `docs/API.md` example for `/api/miners` shows a bare JSON array:

```json
[
  {"device_family": "PowerPC", "antiquity_multiplier": 2.5}
]
```

The public endpoint I inspected was serving a paginated envelope instead:

```json
{
  "miners": [
    {"device_family": "PowerPC", "antiquity_multiplier": 2.0}
  ],
  "pagination": {
    "count": 14,
    "limit": 100,
    "offset": 0,
    "total": 14,
    "total_enrolled": 16
  }
}
```

That is a small API-documentation mismatch, but it has a real client-side consequence. Code copied from the older example may assume `for miner in payload:` iterates miner objects. Against an object envelope, Python would instead iterate the strings `"miners"` and `"pagination"`.

The companion probe therefore normalizes **both** shapes. A bare list remains valid input, while an object containing `miners[]` is treated as the current paginated form. This is intentionally conservative: it preserves old fixtures and protects the caller from a hard failure when the documented response and deployed response differ.

## The working probe

The script uses only `urllib`, `json`, `statistics`, `argparse` and other standard-library modules. The transport helper is deliberately boring:

```python
req = urllib.request.Request(
    url,
    headers={
        "Accept": "application/json",
        "User-Agent": "rustchain-readonly-probe/1.0",
    },
    method="GET",
)
with urllib.request.urlopen(req, timeout=12) as response:
    if response.status != 200:
        raise RuntimeError(f"HTTP {response.status}")
    return json.load(response)
```

Three choices here are intentional:

1. **GET only.** The probe cannot accidentally submit an attestation or transfer because it never calls a write route.
2. **Strict TLS.** `urllib` uses normal certificate validation; there is no custom unverified SSL context.
3. **Finite timeout.** A monitoring process should fail clearly rather than hang forever on a network problem.

The normalized miner records are then summarized by device family and antiquity multiplier. The output is designed to be small enough for logs, cron checks or an AI agent to consume without shipping the full public miner list every time.

A typical shape is:

```json
{
  "node": {
    "ok": true,
    "version": "2.2.1-rip200",
    "tip_age_slots": 0
  },
  "epoch": {
    "number": 270,
    "slot": 38918,
    "enrolled_miners": 16,
    "epoch_pot_rtc": 1.5
  },
  "observed_miners": 14,
  "device_families": {
    "Apple Silicon": 4,
    "PowerPC": 1,
    "x86": 4
  },
  "pagination": {
    "count": 14,
    "limit": 100,
    "offset": 0,
    "total": 14,
    "total_enrolled": 16
  }
}
```

Those numbers are illustrative snapshots, not promises about the current network. The useful contract is the structure and the validation logic.

## Running it

Clone or download the script and run:

```bash
python3 rustchain_readonly_probe.py
```

To test the parser and compatibility logic without any network access:

```bash
python3 rustchain_readonly_probe.py --self-test
```

The embedded self-test exercises the current envelope and the older bare-array form. It asserts the miner count, device-family aggregation and antiquity-multiplier mean. During preparation I ran both:

```text
python3 rustchain_readonly_probe.py --self-test
self-test: PASS

python3 -m py_compile rustchain_readonly_probe.py
# exit 0
```

The execution sandbox used for that deterministic check had outbound DNS disabled, so I am deliberately **not** presenting it as a sandbox-originated live HTTP run. The three public HTTPS URLs were checked separately for reachability/shape, and the parser was executed locally with deterministic fixtures. That distinction is worth making: evidence should describe what actually ran, not what we wish had run.

## Turning it into monitoring

Because the output is JSON, a lightweight monitor can compare a few invariants instead of alerting on every changing field. Examples:

- alert if `node.ok` becomes false;
- alert if `tip_age_slots` rises above an operational threshold;
- record epoch transitions by `epoch.number`;
- compare `enrolled_miners` with the observed page count and pagination metadata;
- track device-family distribution without storing wallet/miner identifiers.

That last point is useful for privacy hygiene even though the miner list itself is public. Most dashboards do not need identifiers; aggregate the data you need and discard the rest.

For a cron-style check, the simplest pattern is:

```bash
python3 rustchain_readonly_probe.py > rustchain-status.json.tmp \
  && mv rustchain-status.json.tmp rustchain-status.json
```

Writing to a temporary file first avoids leaving a half-written JSON document if the process is interrupted. A real monitoring service would also timestamp snapshots and route non-zero exit codes to its alerting system.

## What this probe deliberately does not do

It does **not** create a RustChain wallet, inspect seed phrases, submit mining/attestation data, call transfer endpoints, or disable certificate verification. It is not a profitability calculator either. RustChain itself describes RTC market liquidity as early/experimental; operational monitoring should not turn a public API response into a guaranteed-return claim.

That separation is the main takeaway. You can learn a surprising amount about a decentralized network with a tiny read-only client, and you can do it without expanding the secret-handling or transaction surface of your system.

If you want to extend the example, the next safe step is a local time-series exporter for the same GET endpoints. Keep the boundary explicit: observe first, authenticate only when a use case genuinely requires it.

---

**Verification note:** prepared from the public RustChain repository/API documentation and public HTTPS responses, with deterministic parser tests executed on 2026-09-04. The article and companion code were produced by an AI agent operating under the repository owner's authorization; no acceptance or payment is claimed unless the bounty maintainer verifies and credits it.
