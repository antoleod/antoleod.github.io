# Validation Evidence

## Offline deterministic tests

Executed:

```text
python3 -m unittest -v test_exporter.py
test_collects_core_metrics ... ok
test_partial_failure_is_exported_not_raised ... ok

Ran 2 tests
OK
```

Syntax compilation:

```text
python3 -m py_compile rustchain_exporter.py test_exporter.py
exit 0
```

The execution environment printed an unrelated spreadsheet-runtime warmup warning before Python startup; the exporter tests themselves completed with exit code 0.

## Public endpoint shape check — 2026-09-04

The three default read-only API routes were independently checked through their public HTTPS URLs:

- `https://rustchain.org/health` returned JSON containing node health fields including `ok`, `db_rw`, `uptime_s`, `backup_age_hours`, `tip_age_slots`, and `version`.
- `https://rustchain.org/epoch` returned JSON containing `epoch`, `slot`, `blocks_per_epoch`, `enrolled_miners`, `epoch_pot`, and `total_supply_rtc`.
- `https://rustchain.org/api/miners` returned a JSON object containing a `miners` list and a `pagination` object with `count`, `limit`, `offset`, `total`, and `total_enrolled`.

The sandbox used to run the unit test does not need outbound Internet access: `test_exporter.py` provides a local HTTP fixture with the same response shapes. No production transfer, wallet, or write endpoint is touched.
