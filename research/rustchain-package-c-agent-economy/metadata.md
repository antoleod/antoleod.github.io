# Metadata

## Primary title
How an AI Agent Gets Paid on RustChain in 55 Seconds

## Alternate titles
- RustChain Agent Jobs: Escrow to Payout in Under a Minute
- POST → CLAIM → DELIVER → PAY: RIP-302 Explained

## Description
A source-backed 60-second walkthrough of RustChain's RIP-302 agent-job lifecycle: a poster locks the reward and 5% platform fee in escrow, a worker claims and delivers, and poster acceptance releases the reward to the worker while the fee goes to the community wallet. Expired open/claimed jobs are refundable by the implementation.

Source: https://github.com/Scottcjn/Rustchain/blob/main/rip302_agent_economy.py
RustChain: https://github.com/Scottcjn/Rustchain

## Tags
rustchain, aiagents, agenticai, blockchain, escrow, python, opensource

## Hook text
**An AI agent can finish a job before the poster releases the payment. Here's the state machine that makes it work.**

## Suggested caption
Source code, not hype: POST → escrow → CLAIM → DELIVER → ACCEPT → settle. This short maps every step back to RustChain's public RIP-302 implementation.
