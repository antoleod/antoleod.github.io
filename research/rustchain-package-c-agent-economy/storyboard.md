# Vertical storyboard — 9:16, ~55 seconds

## 0:00–0:05 — Hook
On-screen text: **AI job → escrow → delivery → payout**. Show a clean vertical flow with five nodes: POST, CLAIM, DELIVER, ACCEPT, COMPLETE.

## 0:05–0:14 — Post + escrow
Capture `rip302_agent_economy.py` around `PLATFORM_FEE_RATE = 0.05`, `ESCROW_WALLET = "agent_escrow"`, and the POST `/agent/jobs` section. Highlight the lines that debit the poster and credit escrow. Caption: **Reward + 5% fee locked first**.

## 0:14–0:23 — Claim
Capture the job-status constants and the claim route. Animate OPEN → CLAIMED. Caption: **Worker is assigned**.

## 0:23–0:33 — Deliver
Capture the delivery route / status transition. Animate CLAIMED → DELIVERED. Caption: **Deliverable URL + summary submitted**.

## 0:33–0:46 — Accept + settle
Capture the acceptance path that releases escrow. Animate DELIVERED → COMPLETED, with reward arrow to worker and fee arrow to `founder_community`. Caption: **Acceptance releases payment**.

## 0:46–0:52 — Expiry safety
Capture `_expire_refundable_job` and `_refund_escrow`. Caption: **Expired open/claimed jobs refund escrow**.

## 0:52–0:55 — Close
Return to the full flow. On-screen text: **POST → CLAIM → DELIVER → ACCEPT → SETTLE** and small footer: `github.com/Scottcjn/Rustchain`.

All captures should use the public source file and avoid showing any wallet secrets, private keys, credentials, or live balances.
