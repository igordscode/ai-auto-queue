# Adaptive Workspace v4 | Proposed technical baseline
2026-11-25. Historical v2/v3 docs retained. Product direction: independent venture, own desktop-first workspace, retain browser extension as adapter. No implementation or release implied.

## Evidence
main a15d699, manifest 2.2, Flask health 3.0.0-alpha. See PRD-v3-Agent.md, ROADMAP.md, BACKLOG.md, server/llm_service.py. Existing evaluator truncates output to 1000 characters and fails open. README version mismatch. Branch chrome-lite and local changes not reconciled; tests not run.

## First vertical slice
Create objective, attach three user-authorized sessions, observe completed responses, suggest next action, approve and resume, journal events. Manual mode default; auto-send opt-in only after validation. Do not circumvent provider restrictions. Official API/CLI adapters preferred where available. Validate browser compatibility and applicable terms first.

## Proposed architecture
Local web workspace + authenticated local runtime + MV3 browser bridge. Keep provider adapters separate. Persist workspaces, objectives, sessions, runs, events, approvals and artifact pointers. SQLite candidate; confirm at baseline. Event IDs, idempotency, bounded retries, pause/resume, restart recovery, timeout, budget, kill switch. Supervisor structured result: continue/correct/complete/escalate/pause + reason and evidence. Fail closed, treat model output as untrusted data. Approval for sensitive side effects. No secrets in logs. Bind service to loopback and restrict origins; validate filenames and inputs.

## Design direction
Industrial precision, dark-first desktop, no decorative gradients. Graphite #111318, surface #191D24, text #E7EAF0, muted #A1A9B8, accent #8295FF. Semantic statuses with text/icons, WCAG AA. Geist/Inter, mono event metadata. Left navigation and workstreams, central focus/grid and timeline/composer, right inspector for evidence, files, preview, approvals. Keyboard command palette. Loading/error/empty/offline states. Name temporary; no final brand approved.

## Work packets
- WP-01: reconcile branches/ZIP/local changes, inspect actual code and security, run tests, establish baseline. No destructive edits.
- WP-02: interaction flows and high-fidelity clickable prototype with clearly simulated data. Review before production.
- WP-03: event contract, persisted state, structured supervisor and tests for failures/duplicates/injection.
- WP-04: one authorized provider adapter, three sessions, observation and suggestions; optional bounded sends after verification.
- WP-05: real pilot. Compare manual baseline to assisted work, interventions, time, costs, verified completion, failures. Candidate target 50% fewer interventions without quality regression; zero unauthorized/duplicate sends. Scale to 16 only after evidence.

Do not expand to all providers or add complex frameworks before baseline. Runtime integration with other systems via neutral contracts; not a mandatory dependency. Commercial validation, branding and distribution are separate gates.
