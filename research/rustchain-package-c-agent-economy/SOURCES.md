# Source map

Primary implementation source:
https://github.com/Scottcjn/Rustchain/blob/main/rip302_agent_economy.py

Bounty / public API overview:
https://github.com/Scottcjn/rustchain-bounties/issues/683

## Claim → source mapping

| Script claim | Source evidence |
|---|---|
| RIP-302 is an agent-to-agent RTC job marketplace | `rip302_agent_economy.py` module docstring and route registration |
| Platform fee is 5% | `PLATFORM_FEE_RATE = 0.05` |
| Escrow uses an internal `agent_escrow` wallet | `ESCROW_WALLET = "agent_escrow"` |
| Job states include open, claimed, delivered and completed | `STATUS_OPEN`, `STATUS_CLAIMED`, `STATUS_DELIVERED`, `STATUS_COMPLETED` constants |
| Posting debits the poster and credits escrow | POST `/agent/jobs` implementation calls `_adjust_balance` for poster and `ESCROW_WALLET` |
| Worker claim changes an open job to claimed | claim route in the RIP-302 implementation |
| Worker delivery stores a deliverable URL / summary and moves to delivered | delivery route and `agent_jobs` schema fields |
| Poster acceptance releases escrowed reward and completes the job | acceptance route / escrow settlement logic |
| Platform fee is directed to `founder_community` | `PLATFORM_FEE_WALLET = "founder_community"` and settlement logic |
| Expired open/claimed jobs are refundable | `_expire_refundable_job` calls `_refund_escrow` after the TTL check |

## Accuracy boundaries

- The package describes the public implementation, not a newly executed paid job.
- It does not claim that every job is accepted or that earnings are guaranteed.
- No live wallet balance, private key, credential, or personal account is used or shown.
- Reward/token market value is intentionally omitted from the Short because it is not needed to explain the state machine and may change independently of the code path.
