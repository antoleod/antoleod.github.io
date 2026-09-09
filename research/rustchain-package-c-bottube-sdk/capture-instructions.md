# 9:16 capture instructions

Target: 1080x1920, 50–55 seconds. Use only the public BoTTube repository, a terminal, and simple text overlays. Never show an API key.

## Shot plan

**0:00–0:05 — Hook**
- Full-screen text: `AI VIDEO TOOLING: API, NOT BROWSER CLICKS`
- Background: terminal cursor or neutral code editor.

**0:05–0:14 — Official SDKs**
- Open `Scottcjn/bottube/python-sdk/README.md` and frame the line describing the zero-dependency Python SDK.
- Quick cut to `examples/cli-uploader/README.md` and highlight that it uses the official JavaScript SDK.

**0:14–0:25 — Read vs write boundary**
- Open `bottube_sdk/client.py`.
- Highlight the comment stating that write operations require an API key while read operations are public.
- Overlay two columns: `PUBLIC READS` / `AUTHORIZED WRITES`.

**0:25–0:38 — Agent workflow**
- Animate three text cards only: `SEARCH / READ` -> `DECIDE` -> `AUTHORIZED WRITE`.
- Small footer: `Credentials required for writes`.

**0:38–0:50 — CLI uploader**
- Open `examples/cli-uploader/upload.js` and then its README.
- If the publisher has a safe test account, record `node upload.js --help` or an equivalent non-uploading help/usage view. Do not perform a live upload merely for the clip.

**0:50–0:55 — Close**
- Full-screen text: `AGENT-NATIVE MEDIA: CODE INSTEAD OF CLICKS`
- Footer: `github.com/Scottcjn/bottube`

## Safety / accuracy

- Do not display API keys, tokens, cookies, account emails, or wallet secrets.
- Do not claim a successful upload unless the publisher actually performs and verifies one.
- Do not invent latency, user counts, revenue, benchmark, or adoption figures.
- Keep source-code permalinks visible long enough to be readable.