# Mandi Saathi: local preview

Open `dist/index.html` in a browser, double-click `start-local.cmd`, or run a local server from this folder:

```powershell
python -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Then visit http://127.0.0.1:8765/ on this computer. Closing the server stops the preview. Default form numbers are fictional. A separately labelled historical Nashik example is attributed to a secondary source, and users can import a compatible local CSV. The prototype does not automatically retrieve current market data or predict prices.

CSV import supports files up to 5 MB with headers `State,District,Market,Commodity,Variety,Grade,Arrival_Date,Modal_Price`, dates `DD/MM/YYYY`, and filters for Maharashtra/Nashik/onion. The file is processed in the browser and not uploaded by the app. Imported price units are not independently verified; check they are rupees per quintal. Comparison requires matching known variety and grade and leaves transport blank. The supplied `test-fixture.csv` is synthetic test data, not a market dataset. An official export has not yet been tested end-to-end.

The user has requested removal of the previously created private OpenAI Site. The connected Sites tools did not expose a delete or unpublish operation, and the available browser was not signed in. The remote Site must still be removed through an authorized management interface; its project ID is retained in `.openai/hosting.json` to identify it. Do not publish further versions.

Research and presentation notes are in `RESEARCH.md` and `PRESENTATION.md`. The Marathi interface needs native-speaker review and the product has not been tested with farmers.

For a guided explanation and demo, open `LEARN-AND-PRESENT.md`; the visual pitch is `PITCH.html`. `COMPETITORS.md` contains source-linked profiles, and `BUSINESS-AND-VALIDATION.md` separates business hypotheses from evidence. Run `node test-calculations.cjs` and `node test-import.cjs` from this folder for repeatable checks. Those tests do not establish that live data works or that farmers benefit.
