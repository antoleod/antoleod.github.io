# Replaying RustChain's Agent Job Lifecycle Locally: Escrow, Delivery, and Refunds Without a Wallet

RustChain's RIP-302 agent economy is interesting for a reason that has little to do with token speculation: it turns an agent job into a small, explicit state machine. A poster creates work, value is reserved, a worker claims the job, a deliverable is submitted, and acceptance settles the balances. If the work never gets that far, the expiry path is supposed to return reserved value instead of leaving it stuck.

This tutorial builds a **local teaching model** of that lifecycle. It does not connect to a RustChain node, does not create a wallet, and does not submit a real job. The point is narrower and easier to verify: reproduce the accounting and state transitions described by the public RIP-302 implementation, then test the happy path, the expiry path, and an invalid transition.

The upstream source used for the comparison is RustChain's public [`rip302_agent_economy.py`](https://github.com/Scottcjn/Rustchain/blob/main/rip302_agent_economy.py). The public bounty/feature overview is also available in [`rustchain-bounties#683`](https://github.com/Scottcjn/rustchain-bounties/issues/683).

## What the upstream implementation establishes

The public source defines a five-percent platform fee, an internal escrow wallet, and named job states including `open`, `claimed`, `delivered`, `completed`, `expired`, and `cancelled`. When a job is posted, the implementation computes the reward in micro-units, computes the platform fee, checks that the poster can cover the combined amount, and moves that total into escrow before creating the job record.

That ordering matters. The job is not just a promise that somebody will pay later; the implementation reserves the amount before the job enters the marketplace. The public code also distinguishes the reward from the fee. On successful settlement, those two pieces have different destinations: the worker receives the reward and the platform fee is associated with the community wallet.

The expiry behavior is equally important. The source contains an expiry helper for jobs that are still `open` or `claimed` after their time limit. It changes the job to `expired`, invokes the escrow-refund path, updates reputation bookkeeping, and records the event. That means expiry is not merely a cosmetic status change: it has accounting consequences.

## Why use a local model instead of hitting the live API?

For documentation work, a small local model gives us three useful properties.

First, it is deterministic. A test does not depend on whether a public node is reachable or whether there are currently open jobs. Second, it is safe: there is no wallet secret, no funded account, no mutation of a public service, and no risk of accidentally creating a real obligation. Third, it lets us isolate invariants that are easy to miss in a large Flask module.

The companion script, [`rip302_state_machine_lab.py`](./rip302_state_machine_lab.py), intentionally models only the pieces needed for these checks. It is **not a consensus client, SDK, or drop-in replacement** for the upstream implementation.

## The accounting model

The script represents RTC amounts in integer micro-units, matching the general pattern used by the upstream code. For a 10 RTC job, the local model calculates:

- reward: 10.000000 RTC;
- five-percent fee: 0.500000 RTC;
- total escrow: 10.500000 RTC.

If the poster begins with 25 RTC, posting that job leaves 14.5 RTC in the poster balance and 10.5 RTC in escrow. Nothing has been paid to the worker yet.

The happy-path transition sequence is:

`open -> claimed -> delivered -> completed`

The `claim()` function only accepts an open job. `deliver()` only accepts a claimed job. `accept()` only accepts a delivered job. This is intentionally strict because a useful state machine should make impossible transitions noisy instead of quietly accepting them.

When `accept()` runs, the model removes the entire 10.5 RTC from escrow, credits 10 RTC to the worker, and credits 0.5 RTC to the community balance. The total remains conserved inside the model.

## Test 1: successful delivery and settlement

The first scenario starts a poster at 25 RTC and posts a 10 RTC job. It asserts that the poster balance falls to 14.5 and escrow rises to 10.5. The script then claims, delivers, and accepts the job.

The final assertions require all of the following to be true:

- job state is `completed`;
- worker balance is exactly 10 RTC;
- community balance is exactly 0.5 RTC;
- escrow is exactly zero;
- the poster's reduction equals the original escrowed amount.

The captured run prints:

```text
happy_path: PASS
  status=completed poster=14.500000 worker=10.000000 community=0.500000 escrow=0.000000
```

That output is stored in [`rip302_state_machine_evidence.txt`](./rip302_state_machine_evidence.txt), so the result is inspectable without trusting this article's prose.

## Test 2: expiry refunds the reserved amount

The second scenario exercises the failure-to-complete branch. The poster again starts with 25 RTC, this time creating a 4 RTC job. The model claims it and then expires it before delivery.

The important invariant is not simply that the status becomes `expired`. The poster must recover the full reserved amount and escrow must return to zero. The run produced:

```text
expiry_refund: PASS
  status=expired poster=25.000000 escrow=0.000000
```

This mirrors the upstream design intent: an open or claimed job that ages out can move through a refund path rather than leaving its escrow stranded.

## Test 3: reject an impossible transition

A common mistake in workflow code is to model the good path but forget to make bad paths explicit. The third scenario posts a 2 RTC job and immediately attempts delivery without a claim.

The local model rejects that with:

```text
invalid_transition: PASS
  rejected=only claimed jobs can be delivered
```

This test is small, but it is useful. If a future tutorial or client library ever collapses state checks into "status is not completed", it can accidentally permit transitions the upstream workflow does not intend.

## Run it yourself

The script uses only the Python standard library. From the directory containing the files:

```bash
python rip302_state_machine_lab.py
python -m py_compile rip302_state_machine_lab.py
```

The first command executes all three scenarios and their assertions. The second verifies that the script compiles cleanly.

## What this model does not prove

A local replay cannot prove that a deployed node currently contains the same revision, that a particular real job was paid, or that every operational failure mode is handled. It also does not model authentication, database concurrency, ratings, dispute resolution, network transport, or the full route validation surface.

Those boundaries are deliberate. The useful lesson here is not "a simulator proves the production system is correct." It is that a public implementation can be turned into a compact set of testable invariants: reserve reward plus fee before work begins, allow only meaningful state transitions, split reward and fee correctly on acceptance, and restore escrow on the documented expiry branch.

For agents or developers building on RIP-302, those invariants are a good starting point for client tests. Before adding automation that claims or delivers real jobs, make the local state machine boringly predictable first.
