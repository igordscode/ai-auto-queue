# Local-first implementation | 2026-11-25

Decision: initial workspace runs locally on Windows, without Vercel or external deployment. Preserve browser extension and existing Python runtime where viable. Desktop packaging is a future option, not a commitment.

## First milestone
Recover existing runtime, establish a local startup command, connect one authorized browser session in observation mode, then scale to three sessions. Manual approval before sending; bounded automation only after tests. Use local persistence and loopback-only authenticated service. Never circumvent provider restrictions.

## Work order
1. Reconcile main, chrome-lite and local checkout; preserve uncommitted work.
2. Verify existing tests and provider compatibility; fix fail-open evaluator and unsafe local server configuration.
3. Establish Windows startup and shutdown instructions, health checks and local state storage.
4. Build workspace shell following WORKSPACE-V4-BASELINE.md after visual direction review. Clearly distinguish simulated data from live connections.
5. Connect runtime events and session observer; test disconnect/restart, duplicate events, pause and approval.
6. Pilot three sessions and measure manual interventions, quality and cost before scaling.

No external deployment, paid infrastructure, automatic merges or new provider commitments. API usage may incur costs; do not enable paid calls without explicit configuration. Prefer official supported integrations. No secrets in repository or logs.

Acceptance: reproducible local startup, verified health, documented setup, one real authorized session observed end-to-end, safe failure behavior, and clear remaining gaps. Three-session pilot is the subsequent gate.
