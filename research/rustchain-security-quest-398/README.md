# RustChain Security Quest #398 — Steps 1 + 2

Claimant: **@antoleod**  
Quest: `Scottcjn/rustchain-bounties#398`  
Target: **Step 1 (10 RTC) + Step 2 (15 RTC) = 25 RTC**  
Source snapshot: RustChain commit `7c5cb6f5a228c70b82742d86d5f5e304473ee0b9`

This package contains an independent, code-referenced security assessment of the current RustChain attestation / hardware-binding / reward path and a safe reproduction of the already-fixed **Inline PubKey Hijack / enrollment ownership-proof** issue.

## Deliverables

- [`assessment.md`](assessment.md) — 500+ word Step 1 assessment covering `/attest/submit`, anti-VM / hardware fingerprinting, epoch reward settlement, and a residual attack surface.
- [`inline-pubkey-hijack.md`](inline-pubkey-hijack.md) — Step 2 reproduction and explanation of the fixed enrollment identity-binding bug.
- [`regression_model.py`](regression_model.py) — dependency-free local invariant model demonstrating the pre-fix failure and fixed behavior without attacking a live service.
- [`VALIDATION.md`](VALIDATION.md) — local test result and what it proves / does not prove.
- [`SOURCES.md`](SOURCES.md) — commit-pinned source map.

## Result summary

The current production flow has three important ownership boundaries:

1. `/attest/submit` verifies freshness (single-use challenge), signature state, hardware binding, and fingerprint evidence before recording an attestation.
2. `/epoch/enroll` binds the enrollment signature to the **same Ed25519 public key stored by the latest attestation**, rejecting a different inline key with `PUBKEY_MISMATCH`; unsigned enrollment is rejected unless the explicitly configured legacy escape hatch is enabled.
3. Reward weight is derived from the **stored verified attestation device**, not directly from the unsigned `device` object in the enrollment request, and epoch settlement serializes writers with `BEGIN IMMEDIATE`.

For Step 2 I chose the Inline PubKey Hijack because the repository includes both the security rationale and regression tests. The old class of failure was an ownership-confusion bug: if an enrollment endpoint accepts an attacker-controlled inline key as authority for a victim identity, a valid signature only proves possession of the attacker key — not authorization for the victim identity. The fix changes the trust anchor: the enrollment key must match the key established during attestation, then the signature over `miner_pubkey|miner_id|epoch` must verify.

No live exploit was attempted. The reproduction is a local deterministic model plus review of the upstream regression tests and production code.
