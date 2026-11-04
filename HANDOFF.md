# Antigravity handoff: Mandi Saathi

## Goal and constraints

Solo hackathon workshop, present a working farmer market decision product on Sunday 1 November 2026. User prioritizes core MVP and research over visual polish and asked to work until 5:40 am or usage limit. User explicitly requests local-only work (localhost is acceptable); do not deploy to OpenAI Sites or push to GitHub without a later reason/authorization. No new external dependencies without explicit instruction. User will be asleep.

## Current status

Local prototype in `dist/`: two-market after-cost comparison, explanation and break-even quantity, sell-later what-if and break-even price, dated fixed Nashik onion examples, compatible local CSV import (Nashik onion), English/Marathi text. CSV remains client-side. Prices initially shown are fictional. Historical examples cite secondary sources and are not live; verify source, date, grade and unit. A compatible official CSV has not been tested. No automatic price feed, recommendation model, real-time offers, routes or buyer integration exists. Do not claim impact, uniqueness, forecast accuracy or business profitability without evidence.

`start-local.cmd` runs an existing Python runtime on loopback port 8765. `PITCH.html` is a visual presentation; `PRESENTATION.md` and `LEARN-AND-PRESENT.md` explain the demo and limitations. `COMPETITORS.md`, `RESEARCH.md` and `BUSINESS-AND-VALIDATION.md` contain source-linked desk research and validation plan.

## Verified

`node test-calculations.cjs` checks default calculations, quantity change, negative proceeds, sell-later break-even and market threshold. `node test-import.cjs` checks CSV parsing, dates, mismatched records, valid selection and missing headers. Browser interaction checked calculation, change in winner, historical record load requiring transport, Marathi switch, sell-later calculation, CSV synthetic fixture, and mismatched variety. Earlier mobile-size screenshot was inspected for an earlier version; latest mobile layout and keyboard accessibility have not been fully checked. No farmer/FPO usability test or native-speaker language check.

## Important unresolved actions

1. User requested removal of the earlier OpenAI Site. It still exists privately, owner-only, project ID recorded in `.openai/hosting.json`. Sites connector has no delete/unpublish tool; desktop UI access timed out. Do not claim deletion. Resolve through an authorized management interface, preserving local source.
2. Official data.gov.in says registered users can generate API keys. No authorized key is available, and CEDA access/schema retrieval failed in this environment; current data feed and suitable usage rights remain unverified. Do not embed credentials in browser code or represent old data as live. Verify an official CSV export against importer including units, date format, and real schema.
3. Farmer research, FPO willingness to pay, benefits, accessibility and Marathi text need real validation. Existing competitors already offer prices, Marathi, transport information and trends; the USP remains an unvalidated hypothesis.
4. Check latest mobile layout and keyboard behavior, ideally with a current real device or supported browser viewport; an attempted viewport override showed desktop dimensions, so do not claim this check passed.

## Next actions

Inspect current files and run tests before changing anything. Prioritize trustworthy accessible data, farmer workflow and meaningful validation, then presentation polish. Respect local-only hosting. If no authenticated site-management interface is accessible, report the deletion blocker rather than bypassing access controls. The local source includes a nested Git checkout originally created by Sites; do not push its configured remote.

## Update: 30 October 2026
User is preparing to log into data.gov.in personally and requests low-cost or free coding agents; they want Codex to act as orchestrator rather than builder. Codex weekly window was 92% used and five-hour window 0% used at the latest check; stop task work under the user's 90% handoff rule. Do not reset limits or spend credits. Project remains local-only and the owner-private OpenAI Site deletion remains unresolved. GitHub Copilot Free is a candidate, while Google ended individual free Gemini CLI/Code Assist requests in June 2026; verify current plans and account eligibility. No coding agent CLI was found on PATH in the checked shell. Next: evaluate a suitable free agent and provide it the project handoff, then use Codex sparingly for design decisions and review when the user explicitly authorizes continuation.

User explicitly authorized continuing past 90% to research and help with this handoff. `AGENT-BRIEF.md` now contains a concrete builder prompt and current priorities. GitHub currently documents free Copilot Student for verified students, with an AI-credit allowance and automatic model selection; verify activation in the user's own account. Freebuff advertises free ad-supported hosted coding agents but its own pages differ on usage mechanics; verify current terms. Groq has a free tier and per-account limits; Cline supports provider keys and free models, but actual Groq/Cline availability and Antigravity compatibility need verification. Do not use credits or enable paid billing without user instruction.
