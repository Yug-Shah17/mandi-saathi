# Mandi Saathi: builder handoff

Read `HANDOFF.md`, `README.md`, `RESEARCH.md` and the existing app before changing anything. The user is a student and solo hackathon workshop participant, with limited time and no prior mobile-app experience. Explain changes and testing in simple language.

## Goal

A mobile-friendly web application for Maharashtra farmers, starting with Nashik onions. Help a farmer discover reported prices for nearby mandis, compare likely take-home proceeds after selling and transport costs, and explore the cost and risks of waiting. It must be honest about dates, data limitations, estimates and uncertainty.

## What exists

`dist/index.html`, `style.css`, `app.js`, `hold.js`, `snapshot.js` and `import.js` are a static, local prototype. It compares manually entered prices and costs; explains a quantity break-even; has an illustrative sell-later calculator; includes clearly labelled secondary-source historical data; and can import a compatible CSV locally. Data is not live. A current authenticated data source, coordinates, route distances and transport-rate sources are not implemented. Do not claim forecasts, live offers, validated impact, unique features or profitability.

## Priority work

1. Verify the genuine data.gov.in registration/API process and actual Nashik onion API schema. User is personally handling sign-in. Do not ask them to paste credentials or OTPs into chat. A test/sandbox notice has appeared on some portal responses; do not assume the page or API is production-ready. Use official documentation and check the data license and attribution.
2. Design a lightweight local backend to hold a government key in an environment variable and fetch prices; never place secrets in frontend code, source control, logs or screenshots. No new external libraries without the user's explicit instruction. Make changes only if API access and requirements are verified. Show data source, report date, variety, units and graceful errors; never substitute fabricated live prices.
3. Investigate verified market coordinates and matching; straight-line distance is not road distance. If coordinates cannot be verified, use an explicitly selected district or market rather than claim proximity. Ask permission before requesting location; allow manual choice.
4. Improve transport decision support when a fare is unknown. A clear break-even extra-fare calculation is feasible from user-entered numbers; any transport estimate or range requires credible local rate assumptions and must be labelled. Do not fabricate fares.
5. Keep the storage scenario prominent. It should show break-even based on the user's assumptions and make clear that no future price is predicted. Historical trends need verified dated records and are not a forecast.
6. Run `node test-calculations.cjs` and `node test-import.cjs` plus tests for new meaningful behavior. Verify the affected app flow and mobile accessibility as feasible, and report actual outcomes.

## Boundaries

- Work locally. Do not deploy to OpenAI Sites. Do not push this checkout's configured remote or publish code without user approval.
- A previously created private OpenAI Site still exists; deletion was requested but the connector exposed no delete/unpublish tool. Do not claim it was removed. The user has been given official deletion steps.
- The current Git checkout was created during the old Sites workflow. Preserve the existing files and any user edits; inspect `git status` before changes.
- User wants Codex as an orchestrator/reviewer and another agent as builder. Report changes, commands/checks, blockers and precise next steps. Do not message third parties, purchase services or change account settings without the user's explicit instruction.

## First task to give a builder

Inspect the prototype and write a brief plan for the first incremental improvement: a transparent break-even transport-cost aid for cases where the farmer does not know the fare. Implement only once the plan reflects the existing code; keep all current flows intact. Validate arithmetic with representative cases including equal prices, negative or zero advantage, and both market directions. Then explain how the current app differs from the intended nearby-price flow, and list the verified government data access requirements. Do not assume API access or invent prices.
