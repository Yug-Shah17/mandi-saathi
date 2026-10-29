# Mandi Saathi: workshop research and evidence

Working brief: a solo workshop product for Maharashtra, focused on comparing potential proceeds from a crop sale. The user wants a lightweight mobile-friendly web app and a demonstrable deployment. The core decision is where to sell; deciding when to sell is not yet implemented. No farmer interviews or field validation have been conducted.

## Competitor evidence (30 October 2026)

| Product | Channel and relevant features | Data, revenue and reach evidence | What remains unknown |
|---|---|---|---|
| [Agmarknet / e-NAM](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2204750&lang=2&reg=48) | Government portal and apps; prices, arrivals, nearby markets and routes. | Government says 4,367 mandis linked to Agmarknet and 1,522 to e-NAM as of 16 Dec 2025. The government service is not evidence of a private revenue model. | Current active users, field accuracy and app usability require further checks. |
| [Agrowave](https://niti.gov.in/sites/default/files/2023-03/Compendium-of-75-Agri-Entrepreneur-and-Innovators.pdf) | NITI's 2023 description covers farmer, trader and transport apps; price and transport information and farm-gate transactions. | Uses an integrated supply-chain model; historical source does not establish current fees, operations, users or profitability. | Current product availability and prices. Important: transport comparison is not automatically novel. |
| [DeHaat](https://agrevolution.in/business-model) | App plus physical centres; farm inputs, advisory and market access. [Play listing](https://play.google.com/store/apps/details?id=app.intspvt.com.farmer) includes mandi prices, weather and crop guidance. | Play listing displayed 1 lakh+ downloads when inspected, not monthly users. [Reporting](https://inc42.com/features/inside-dehaats-inr-3000-cr-scale-and-its-long-road-to-profitability/) describes produce linkages, inputs and paid services, and reports FY25 revenue; not proof of profitability. | Mandi price sourcing and exact user-data use were not established. |
| [Kisan Network](https://kisannetwork.com/) | Website describes sourcing, grading, logistics and direct supply to businesses. | Company reports 80,000+ farmers, undated on the page; not an active-app-user count. It describes commercial supply-chain services but exact margins are undisclosed. | Current app availability, revenue and independent reach verification. |
| [ACROP](https://acrop.app/) | Website offers market reports and WhatsApp alerts. | Advertises ₹150 for one month of alerts; a price is not evidence of sales or profit. Describes Agmarknet reports as not guaranteed bids. | Number of users, adoption and costs. |

## User feedback limits

The [DeHaat Play listing](https://play.google.com/store/apps/details?id=app.intspvt.com.farmer) includes a 2020 review praising advisory and doorstep services and another asking for usability improvements. A [third-party review aggregator](https://chrome-stats.com/d/app.intspvt.com.farmer/reviews) summarizes login, task completion, support and fulfilment complaints. These are individual or aggregated reports, not representative farmer research; we have not independently audited a full review sample. Do not say these are the most common complaints across all users.

## Additional Maharashtra-specific competitors

- [Mai Kisaan](https://www.maikisaan.com/) describes a website and mobile apps in English, Hindi and Marathi, a produce marketplace and district-level AGMARKNET prices. Its site says basic browsing and enquiries are free, while a subscription unlocks contact details, full prices and a business directory. Its [Maharashtra onion page](https://www.maikisaan.com/mandi-bhav/onion/maharashtra/) displays dated market-level prices and a seven-day comparison. Pricing, customer numbers, data processing and profitability need separate verification.
- [Rozbhav](https://rozbhav.in/mandi/maharashtra/commodity/onion/) displays Maharashtra onion prices by district, dates, units and a prior-day comparison and attributes its information to Agmarknet through data.gov.in. It illustrates that dated, regional market comparisons and trends already exist. Its revenue and audience are unknown.
- [Agri.in](https://agri.in/) displays reported mandi prices, nearby market distance and a 30-day range. Its current commercial model and user count have not been established.
- [KisanDeals](https://play.google.com/store/apps/details?id=com.app.kisandeals.user) advertises a mobile mandi-price and marketplace app with district-wise pricing; its listing attributes information to official platforms and advises checking them. Do not infer active users or revenue from a download figure.

These strengthen the conclusion that language, no-download websites, prices, trends and nearby market discovery are not by themselves unique. The unvalidated possibility is to combine transparent after-cost calculations, freshness and a simple explanation for a particular farmer's decision. No competitive claim of uniqueness is established.

## Data access investigation

The [official OGD variety-wise dataset](https://data.gov.in/resource/variety-wise-daily-market-prices-data-commodity) lists state, district, market, commodity and variety and says daily granularity. The [CEDA API documentation](https://api.ceda.ashoka.edu.in/documentation/) lists Agmarknet price endpoints; the endpoint details, current coverage, permission to use it and browser accessibility were not verified. Context7 returned no relevant CEDA match and a direct attempt to retrieve its schema failed at the SSL connection in this environment. Do not claim the application has a working live feed.

## Data and product choices

[Government's daily price dataset](https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi) describes minimum, maximum and modal wholesale prices sourced from Agmarknet. A recorded modal price is not an individual offer. Data freshness, crop variety and units matter. The prototype uses editable **fictional** examples and does not access the feed; the user may enter verified prices manually. A sell-later scenario calculator uses user assumptions, not a forecast. No automatic forecasts, routes, market distances, buyer guarantees or official integrations are claimed. The [OGD help page](https://www.data.gov.in/help) says registered users can generate API keys.

Hypothesis: an easy-to-understand comparison of gross proceeds minus user-entered transport and other costs may help someone reason about where to sell. This is not established as unique: comparable apps already offer prices and transport information. Test with farmers before claiming improved earnings or adoption. Crop and market names in the demo are placeholders; no district was selected without reliable data.

## Business hypothesis

An FPO or cooperative might pay for member support and a shared decision tool if it measurably saves time or improves decisions. Possible costs include maintained data, support, hosting, distribution and training. No price, demand, willingness to pay, margin or profit has been validated. Interview organisations and compare actual costs with the value delivered before presenting a financial forecast.

## Next research

Select one district and crop with verified available records. Test data access and usage terms, freshness, and actual market price units. Conduct interviews with farmers or intermediaries without collecting personal data unnecessarily. Observe whether farmers understand the comparison, costs omitted and freshness warnings. Audit recent competitor reviews systematically with dates and sample sizes. Evaluate the decision to sell later only with trustworthy data and tested methodology.
