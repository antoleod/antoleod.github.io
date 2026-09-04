# Storyboard — Package B

**Working title:** A PowerPC G4 gets a 2.5× base multiplier. A VM gets almost zero. Here is why.  
**Format:** 16:9, 1080p recommended  
**Narration target:** 4–5 minutes  
**Rule:** Every terminal/code shot must be captured from the public RustChain repository at commit `7c5cb6f5a228c70b82742d86d5f5e304473ee0b9`. Do not stage a “live miner” result that was not actually run.

| Time | Narration beat | Shot / capture instruction | On-screen text |
|---|---|---|---|
| 0:00–0:08 | Two machines, two claims | Split screen: photo/illustration of a PowerPC G4-era tower on left; generic VM window icon on right. Use licensed or generated imagery only. | `REAL G4` vs `VM CLAIMING "G4"` |
| 0:08–0:25 | 2.5× vs effectively zero | Animate large `2.5× BASE` on left and `0.000000001× VM` on right. Add small footnote: “base/reward weight; final reward depends on protocol state.” | `The bonus is not just a label.` |
| 0:25–0:45 | Block rotation vs reward weighting | Screen-capture the header/docstring of `node/rip_200_round_robin_1cpu1vote.py`. Highlight “Deterministic rotation” and “Rewards: Weighted by … antiquity multiplier.” | `Block turns ≠ reward weight` |
| 0:45–1:10 | Antiquity table and time-aging caveat | Scroll to `ANTIQUITY_MULTIPLIERS`; then show the module’s time-aging description. Avoid implying every G4 earns an identical final amount. | `2.5× = base multiplier` |
| 1:10–1:30 | Claimed model alone is weak | Minimal diagram: `device_arch = "powerpc_g4"` → red X → “not enough by itself”. | `A string is easy to fake.` |
| 1:30–1:55 | Six fingerprint checks | Code capture of `ROTATING_FINGERPRINT_CHECKS`. Reveal checks one by one. | `clock_drift • cache_timing • simd_bias • thermal_drift • instruction_jitter • anti_emulation` |
| 1:55–2:05 | Fail-closed selector | Highlight code branch that returns all checks when the previous hash is missing/all-zero. Diagram: “missing seed → ALL checks”. | `Fail closed` |
| 2:05–2:30 | VM indicators | Capture `specs/RIP_POA_SPEC_v1.0.md`, row that says `vm_indicators` must be empty and any single indicator flags virtualization. | `vm_indicators must be []` |
| 2:30–3:05 | Concrete VM example | Capture the documentation example containing `sys_vendor:qemu`, `cpuinfo:hypervisor`, and `weight = 0.000000001x`. Keep exact text on screen long enough to read. | `Known VM → effectively zero weight` |
| 3:05–3:35 | G4 bucket test | Capture `tests/test_rip201_bucket_fix.py` around the assertion that G4 maps to `vintage_powerpc_g4`, multiplier `2.5`. | `Expected bucket: vintage_powerpc_g4` |
| 3:35–3:55 | Spoof downgrade test | In same test file, highlight the test name `test_x86_spoofing_g5_downgraded`. Do not claim more than the visible test establishes. | `Spoof mismatch → downgrade path` |
| 3:55–4:20 | Four-stage boundary | Clean diagram: `claim → fingerprint → bucket → reward weight`. Green arrows for consistent evidence; red downgrade arrow for mismatch. | `Claim → Evidence → Bucket → Weight` |
| 4:20–4:35 | Closing | Return to G4/VM split screen. End on source URL and repo name. | `Audit the code: github.com/Scottcjn/Rustchain` |

## Capture notes

- Pin all GitHub source captures to commit `7c5cb6f5a228c70b82742d86d5f5e304473ee0b9` so the cited lines cannot drift during editing.
- For accessibility, keep code text at a readable size; zoom browser/code view rather than relying on tiny full-screen files.
- The `0.000000001×` figure is a documented known-VM policy/example, not a general empirical benchmark.
- The `2.5×` figure is a base antiquity multiplier / bucket multiplier; do not advertise it as a guaranteed 2.5× final payout.
- Do not use screenshots from another claimant’s bounty submission as visual evidence.
