# Hackathon pitch: 3 minutes

Structure is fixed: hook 20s, evidence 30s, differentiator 40s, demo 45s, limits 25s, ask 20s. Times are cues, not a script to recite. The visual deck is `PITCH.html`.

## 0:00 Hook (20s)

"₹4,400 a quintal for onion in Pimpalgaon Baswant. ₹3,600 in Yeola. Same day, same crop, same district — and both numbers are real, pulled from Agmarknet on 4 November. Neither one tells a farmer what he takes home."

Do not open with the product name or the tech stack. Open with the two prices.

## 0:20 Evidence we verified (30s)

- 04/11/2026, Agmarknet portal: **Pimpalgaon Baswant ₹4,400/qtl, Yeola ₹3,600/qtl** (modal price, onion).
- On five quintals that is a **₹4,000 gross gap** — the fare headroom. Pimpalgaon can cost up to ₹4,000 more to reach than Yeola and the farmer is still ahead.
- Say the limit in the same breath: modal price, not a bid, and it ages within days.

Source: https://agmarknet.gov.in/ (checked 04/11/2026). Record it in `RESEARCH.md` if you cite it again.

## 0:50 Differentiator (40s)

Say this plainly, once: **most price tools stop at the number; we compute what is left after the farmer's own costs.**

1. **Net take-home** — quantity × entered price, minus transport and other costs. Two markets, side by side, with the difference stated in rupees for the whole lot.
2. **Read aloud** — one tap speaks the result in Marathi or English using the phone's built-in voice. This is the accessibility argument: a farmer who reads a price table slowly, or not at all, still gets the answer. Nothing is uploaded and there is no account.
3. **Fare break-even** — when the fare is unknown, we state the maximum the trip can cost before the other mandi wins, instead of inventing a fare.

Do not claim this is unique. e-NAM and the mandi apps already do prices, Marathi and nearby markets well. The claim is narrower: the last step, spoken.

## 1:30 Live demo (45s)

1. Open the app, press **Use verified snapshot**; it loads Pimpalgaon Baswant ₹4,400 and Yeola ₹3,600 with other costs at zero.
2. Enter illustrative transport: **₹900 for Pimpalgaon, ₹300 for Yeola**. Say that these are illustrative and labelled as such.
3. Calculate: **₹21,100 vs ₹17,700 — ₹3,400 apart** on five quintals. The ₹4,000 headline gap shrinks once ₹600 of extra fare is subtracted.
4. Point at the fare note: with these numbers, even a free trip to Yeola does not beat Pimpalgaon.
5. Press **Read the result aloud**, then switch to Marathi and press it again. This is the moment to stop talking and let the phone speak.
6. Optional if time remains: the sell-later tool uses the farmer's own assumed future price — it is arithmetic, not a forecast.

## 2:15 Honest limits (25s)

- The app does not fetch Agmarknet automatically. The 4 November figures were verified by hand and are dated in the interface.
- A modal price is not a buyer's offer; grade, quality and fees can change the outcome.
- No farmer testing, no FPO interviews, no income-gain claim. Marathi needs a native speaker's review.

## 2:40 Ask (20s)

Ten farmer usability tests and one FPO or cooperative in Nashik; a native Marathi review; a decision on whether a live Agmarknet pull is worth building.

Business shape: the FPO or cooperative pays for a tool its staff use across many farmers, the farmer uses the core comparison free. Hypothesis, not revenue.

Close on: "A price is information. What a farmer takes home is a decision."

## Likely questions

- **Why not e-NAM?** It already gives prices, nearby markets and routes, and it is free. We are testing whether one extra step — net proceeds, spoken aloud — changes a selling decision. Unproven until farmers use it.
- **Is this live?** No. The 04/11/2026 figures were checked manually; the app does not poll Agmarknet. Every number shows its date and source.
- **Is it AI?** No. Deterministic arithmetic plus the browser's speech synthesis. No forecast, no model.
- **How do you make money?** An FPO or cooperative subscription is a hypothesis. No willingness-to-pay evidence yet; say so.
- **What if the farmer doesn't know the fare?** The app states the break-even fare instead of guessing, and asks the farmer to confirm a real quote from a transport operator.
- **Why will a low-literacy farmer trust a phone?** Voice output is a hypothesis about access, not a validated result. That is exactly what the ten tests are for.
