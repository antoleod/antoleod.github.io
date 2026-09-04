# Assembly / Edit Map

## Master format

- 1920×1080, 16:9, 30 fps.
- Target runtime: 4:20–4:40.
- Narration follows `script.md`.
- Source/code captures follow `storyboard.md`.
- Keep source citations as a small lower-third whenever a technical claim is introduced.

## Timeline

**00:00–00:25 — Cold open**  
Use the G4-vs-VM split visual. Hard cut from `2.5× BASE` to `0.000000001× VM`. Add the caveat “reward/base weight, not guaranteed final earnings” in small text.

**00:25–01:10 — Consensus vs rewards**  
Transition to the round-robin module header. Highlight deterministic block rotation separately from reward weighting. Then move to the antiquity table/time-aging wording. Avoid flashy motion while code is on screen.

**01:10–02:05 — Fingerprinting**  
Start with the “a string is easy to fake” diagram, then reveal the six fingerprint channels. End with the fail-closed branch: missing/all-zero previous hash → all checks active.

**02:05–03:05 — Virtualization defense**  
Show the specification row for `vm_indicators`, then the documentation’s QEMU/hypervisor example. Hold the exact `0.000000001x` result for at least three seconds.

**03:05–03:55 — Tests**  
Show the G4 bucket assertion and then the spoof-downgrade test name. Use callout boxes, not edited code text. Nothing in the edit should make the source look like runtime output.

**03:55–04:35 — Model + closing**  
Build the four-step diagram: Claim → Fingerprint → Bucket → Reward Weight. Close with the repository link and “Sources pinned in SOURCES.md”.

## Audio

- Neutral technical narration, ~145–155 words/minute.
- No music is required. If music is added, use a track licensed for redistribution and keep it at least 18 dB below narration.
- Do not synthesize computer beeps that could be mistaken for actual miner output.

## Attribution / rights

All source-code visuals must be captured from the public RustChain repository. Any additional photos, illustrations, icons, or audio must be original, generated with appropriate rights, or licensed for Elyan Labs publication. The package author licenses Elyan Labs to publish this package with attribution to `@antoleod`, consistent with bounty #16601.
