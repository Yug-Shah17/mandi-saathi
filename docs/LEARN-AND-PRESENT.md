# Your guide to Mandi Saathi

## What the product does

Imagine you have five quintals of onions and two markets quote different prices. To compare them, you need to know how much a trip to each market might cost. Mandi Saathi multiplies your quantity by each entered price and subtracts entered transport and other costs. It shows both estimates and explains the difference.

The result is **not profit**: it doesn't subtract cultivation costs unless you include them yourself, and it doesn't promise a buyer will pay the quoted price. Other practical factors, including quality, timing, market access and an actual buyer's bid, matter too.

The waiting tool asks you to enter a possible future price, costs of waiting, and an expected percentage of produce lost. It calculates how that scenario compares with selling now and finds the break-even future price. **It does not predict future prices.**

## How it works, in plain English

The app consists of a web page (`dist/index.html`), its styling (`dist/style.css`), and small JavaScript files that perform calculations and handle the interface. JavaScript runs in your browser. There is no database, account, AI model or backend in this prototype. A CSV you select is read by the browser; the app does not upload it.

`localhost` means the site is served only on your computer. It is useful for your own demo but won't give your mentor a remotely accessible link. To show it in person or on a screen-share, open the local page. If you later need a remote audience to open it themselves, choose a hosting service with the desired access settings.

## The data problem

Government and commercial platforms publish historical market reports, which are not a promise that your particular onions will sell for that amount. Dates, variety, grade and rupees per quintal must be checked. The prototype opens with invented demonstration numbers and also has a separately labelled fixed historical example from a secondary source. The app cannot automatically fetch current prices.

An **API** is a way for one program to request data from another. The government data portal says registered users can generate API keys. A key, permissions, reliable access, source terms and testing are necessary before the app can depend on such a feed. A key should not be embedded openly in browser code. This is unfinished work, not a hidden feature.

## How to demonstrate it

1. Open `dist/index.html` directly or run `start-local.cmd` and visit the displayed address.
2. Show the fictional-price notice. The default inputs use five quintals.
3. Click Calculate. Market A shows ₹9,600 and B ₹9,550. B's price is higher, but its entered transport cost is also higher.
4. The explanation shows a break-even quantity of approximately 5.33 quintals if the entered costs stay fixed. Change quantity to 10 and calculate again; the ranking reverses.
5. Show the dated historical example and enter actual or illustrative transport costs, explaining which are which.
6. Show the waiting scenario. State that its later price is an assumption entered by the user.
7. Explain that CSV import accepts compatible data locally, but an official export and live data are not yet validated.

For a visual pitch, open `PITCH.html`. For a detailed script and questions, open `PRESENTATION.md`. The local page can be printed from the browser if needed; PDF layout has not been verified.

## Questions your mentor may ask

**Why is this better than e-NAM?** We have not proved it is better. e-NAM already provides price and market information. The product hypothesis is that an easy cost comparison and sell-later scenario help a specific decision. This needs a direct workflow comparison with real farmers.

**How does it make money?** An FPO subscription is one hypothesis. We don't yet know whether an FPO would pay or whether revenue could exceed the costs of maintaining data, distributing the service and supporting users.

**Where is AI?** There is no AI in the current calculator. AI is not needed for arithmetic; a future feature should be added only if it solves a demonstrated problem and can be checked.

**How do you know farmers need this?** We do not yet know. Desk research and a historical study provide context. Interviews and usability tests are needed to establish the actual need and whether this product addresses it.
