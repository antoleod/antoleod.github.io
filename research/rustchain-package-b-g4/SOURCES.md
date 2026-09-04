# SOURCES — Claim-to-source map

All RustChain links below are pinned to public repository commit `7c5cb6f5a228c70b82742d86d5f5e304473ee0b9` to prevent source drift.

## 1. Round-robin block production is separate from antiquity-weighted rewards

**Claim in script:** the module describes deterministic rotation for block production and antiquity-weighted rewards; the vintage advantage is time-aging.

Source:  
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/node/rip_200_round_robin_1cpu1vote.py

Relevant public code: module docstring at the top of the file.

## 2. The module names six fingerprint checks

**Claim in script:** the current module names `clock_drift`, `cache_timing`, `simd_bias`, `thermal_drift`, `instruction_jitter`, and `anti_emulation`.

Source:  
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/node/rip_200_round_robin_1cpu1vote.py

Relevant symbol: `ROTATING_FINGERPRINT_CHECKS`.

## 3. Missing/all-zero previous block hash fails closed to all checks

**Claim in script:** if the previous hash is unavailable or the all-zero fallback, the selector activates all fingerprint checks rather than a predictable subset.

Source:  
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/node/rip_200_round_robin_1cpu1vote.py

Relevant function: `select_active_fingerprint_checks`.

## 4. PowerPC G4 maps to a 2.5 base/bucket multiplier

**Claim in script:** a G4 hardware bucket has a 2.5 multiplier.

Primary source:  
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/rip201_bucket_fix.py

Relevant mapping: `_BUCKET_MULTIPLIERS["vintage_powerpc_g4"] = 2.5`.

Corroborating API documentation:  
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/docs/API_WALKTHROUGH.md

The example miner record shows `hardware_type: "PowerPC G4"`, `antiquity_multiplier: 2.5`, and `device_arch: "powerpc_g4"`.

## 5. `vm_indicators` must be empty under the Proof-of-Antiquity spec

**Claim in script:** the spec says `vm_indicators` must be empty and any single indicator is enough to flag virtualization.

Source:  
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/specs/RIP_POA_SPEC_v1.0.md

Relevant section: fingerprint/verification criteria table.

## 6. Documentation example: QEMU/hypervisor indicators → 0.000000001× weight

**Claim in script:** the project documentation shows an anti-emulation failure with `sys_vendor:qemu` and `cpuinfo:hypervisor`, followed by VM detection and `weight = 0.000000001x`.

Source:  
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/docs/index.html

Mirrored source:  
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/website/static/classic.html

## 7. Proof-of-Physical-AI policy distinguishes real hardware and known VM weight

**Claim in script:** the Proof-of-Physical-AI document describes all required channels passing on real hardware as retaining full antiquity treatment, while a known VM is assigned `0.000000001`.

Source:  
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/rips/docs/RIP-0308-proof-of-physical-ai.md

## 8. Tests assert a valid G4 bucket and include a spoof-downgrade case

**Claim in script:** a test expects a G4 fingerprint to resolve to `vintage_powerpc_g4` with multiplier `2.5`; the same test file includes `test_x86_spoofing_g5_downgraded`.

Source:  
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/tests/test_rip201_bucket_fix.py

## Editorial guardrails

- Do **not** call `2.5×` a guaranteed final earnings rate. It is presented here as a base antiquity / bucket multiplier.
- Do **not** claim the VM checks are impossible to bypass. The video explains the repository’s intended defense model and documented tests/policy.
- Do **not** present documentation examples as newly executed runtime evidence.
- Do **not** substitute current unpinned `main` links for technical screenshots in the final edit; use the commit-pinned links above.
