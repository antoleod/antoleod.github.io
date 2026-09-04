# Video Script — A PowerPC G4 gets a 2.5× base multiplier. A VM gets almost zero. Here is why.

**Target length:** 4–5 minutes  
**Package:** RustChain / Proof of Antiquity explainer  
**Author credit:** @antoleod  
**Factual baseline:** RustChain public repository snapshot `7c5cb6f5a228c70b82742d86d5f5e304473ee0b9`

## 0:00–0:25 — Hook

Imagine two machines trying to participate in the same network.

One is a real PowerPC G4 — hardware from an era when a gigahertz still sounded exotic. The other is a modern machine running a virtual machine that simply *claims* to be old hardware.

RustChain does not treat those claims the same way.

In the current public code, a genuine PowerPC G4 maps to a **2.5× antiquity base multiplier**. But RustChain also has an anti-emulation path where a known VM can be reduced to an effectively negligible weight, documented as **0.000000001×** in the project’s Proof-of-Physical-AI material.

So the interesting question is not “why does old hardware get a bonus?” It is: **how does the system try to make that bonus expensive to fake?**

## 0:25–1:10 — Separate block turns from reward weight

The first thing to understand is that RustChain’s current round-robin module separates two ideas.

Its own module description says block production is based on deterministic rotation — “1 CPU = 1 Vote” — while rewards can be weighted by an antiquity multiplier. That means the vintage multiplier is not a promise that an old machine automatically produces 2.5 times as many blocks. It is a **reward-weight input**.

The same module defines a large `ANTIQUITY_MULTIPLIERS` table for hardware categories, and related code maps the PowerPC G4 family to 2.5.

There is another nuance: the module also describes the vintage advantage as **time-aging**. So 2.5 is best read as a base multiplier in the reward logic, not a guaranteed final payout for every epoch.

## 1:10–2:05 — Why a claimed model name is not enough

If the network only trusted a string like `device_arch = powerpc_g4`, the system would be trivial to game.

RustChain’s public code therefore tracks multiple fingerprint checks. The current round-robin module names six rotating checks:

- clock drift,
- cache timing,
- SIMD bias,
- thermal drift,
- instruction jitter,
- and anti-emulation.

Normally a subset is selected using state derived from the previous epoch block hash. But the code contains an important fail-closed rule: if that previous hash is unavailable or collapses to the all-zero fallback, the selector activates **all** fingerprint checks instead of using a predictable partial subset.

That matters because a predictable challenge set would make spoofing easier. A claimant could prepare only for the checks it knew were coming.

## 2:05–3:05 — The anti-emulation gate

The published Proof-of-Antiquity specification is even more explicit about virtualization.

It says `vm_indicators` must be empty, and that a single indicator is enough to flag virtualization.

The project documentation shows a concrete example of an anti-emulation failure with indicators such as `sys_vendor:qemu` and `cpuinfo:hypervisor`. The documented result is a VM-detected path with weight reduced to `0.000000001x`.

The newer Proof-of-Physical-AI document uses the same policy idea: real hardware with the required channels passing can retain its full antiquity treatment, while a known VM is assigned the effectively-zero weight.

This is not proof that virtualization can never evade detection. Security claims should never be stronger than the code and tests justify. What the repository demonstrates is the **intended defense model**: the reward premium is coupled to measured hardware evidence, not merely to a self-reported CPU label.

## 3:05–3:55 — There are tests for spoofing and bucket assignment

The repository also contains tests around the hardware bucket logic.

One test asserts that a valid PowerPC G4 fingerprint lands in the `vintage_powerpc_g4` bucket with a `2.5` multiplier. The same test file includes a case explicitly named for an x86 machine spoofing a G5 and being downgraded.

That is a useful design signal. The multiplier table by itself is not the security feature. The important part is the boundary between:

1. what hardware you claim,
2. what the fingerprint evidence says,
3. which bucket you are actually assigned,
4. and what reward weight that bucket receives.

If those boundaries disagree, the system is supposed to downgrade rather than reward the attractive label.

## 3:55–4:35 — The bigger idea

RustChain’s design is unusual because it tries to make hardware age economically meaningful without letting “old” become a free text field.

A PowerPC G4 can start from a 2.5× antiquity base multiplier because the network wants rare, physically distinct hardware to matter. But the same design includes fingerprint rotation, fail-closed behavior, VM indicators, and downgrade tests because the bonus would be meaningless if a modern host could impersonate vintage silicon with one configuration string.

That is the core Proof-of-Antiquity idea in one sentence:

**Reward the physical history of a machine only when the evidence for that machine survives adversarial checks.**

If you want to audit the exact implementation rather than trust this summary, the source links for every technical claim are included in the description and the accompanying `SOURCES.md`.
