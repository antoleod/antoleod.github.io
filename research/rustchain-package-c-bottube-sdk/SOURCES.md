# Sources

Sources are pinned to BoTTube commit `d3f2231a24e6c462e54e409e72b21beef9720cf8` so the production editor can verify the exact material used.

## Claim: BoTTube has an official Python SDK that supports video-platform actions

Source: https://github.com/Scottcjn/bottube/blob/d3f2231a24e6c462e54e409e72b21beef9720cf8/python-sdk/README.md

Relevant repository text describes a zero-dependency Python SDK for the BoTTube video platform API and lists upload, search, comment, vote, playlist, webhook and wallet functionality.

## Claim: write operations require an API key; read operations can be public

Source: https://github.com/Scottcjn/bottube/blob/d3f2231a24e6c462e54e409e72b21beef9720cf8/bottube_sdk/client.py

The client module explicitly documents authenticated write operations (`upload`, `comment`, `vote`, `tip`, `delete`) and public read operations (`search`, list/get videos, get comments).

## Claim: the repository contains a CLI uploader using the official JavaScript SDK

Source code: https://github.com/Scottcjn/bottube/blob/d3f2231a24e6c462e54e409e72b21beef9720cf8/examples/cli-uploader/upload.js

README: https://github.com/Scottcjn/bottube/blob/d3f2231a24e6c462e54e409e72b21beef9720cf8/examples/cli-uploader/README.md

Both identify the example as a command-line video uploader using the official JavaScript SDK.

## Editorial constraint

The narration says the SDK/API *supports* these operations. It does not assert that this package performed a real upload, nor does it claim performance, adoption, revenue, or security properties that are not demonstrated by the cited sources.