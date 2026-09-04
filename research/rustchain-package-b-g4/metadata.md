# Publication Metadata

## Recommended title

**Why RustChain Gives a PowerPC G4 a 2.5× Base Multiplier — and Crushes VM Spoofing**

## Alternate titles

1. **Can a VM Fake Vintage Hardware? Inside RustChain’s Proof-of-Antiquity Checks**
2. **PowerPC G4 vs Virtual Machine: How RustChain Tries to Price Real Hardware**

## Description

Why would a real PowerPC G4 receive a 2.5× antiquity base multiplier while a known virtual machine can be reduced to an effectively negligible weight?

This source-backed explainer walks through RustChain’s public Proof-of-Antiquity implementation: deterministic round-robin block turns, reward weighting, rotating hardware fingerprint checks, fail-closed behavior when the rotation seed is unavailable, `vm_indicators`, and bucket-assignment tests.

Every technical claim is mapped to a pinned public source in the accompanying `SOURCES.md`.

RustChain source:
https://github.com/Scottcjn/Rustchain

Proof-of-Antiquity specification:
https://github.com/Scottcjn/Rustchain/blob/7c5cb6f5a228c70b82742d86d5f5e304473ee0b9/specs/RIP_POA_SPEC_v1.0.md

Important: 2.5× is discussed as a base antiquity/bucket multiplier, not a guaranteed final payout. The VM weight is a documented policy/example for known virtualization, not a claim that every possible hypervisor is always detected.

Author: @antoleod

## Tags

RustChain, Proof of Antiquity, PowerPC, PowerPC G4, vintage computing, hardware attestation, anti-emulation, blockchain, DePIN, virtual machines, hardware fingerprinting

## Chapters

00:00 Real G4 vs fake claim  
00:25 Block turns vs reward weight  
01:10 Six hardware fingerprint checks  
02:05 How virtualization is flagged  
03:05 G4 bucket and spoofing tests  
03:55 Claim → evidence → bucket → weight  
04:20 What Proof of Antiquity is trying to prove
