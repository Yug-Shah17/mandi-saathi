# Mandi Saathi (मंडी साथी)

> **"The highest price isn't always the best deal."**  
> A lightweight, offline-ready Agri-Fintech Progressive Web App (PWA) designed for Maharashtra farmers to compare wholesale APMC prices, calculate true take-home realization after transport and mandi fees, and make informed market decisions.

🌐 **Live Web Application:** [https://yug-shah17.github.io/mandi-saathi/](https://yug-shah17.github.io/mandi-saathi/)  
🏆 **Hackathon Submission:** Problem Statement 3 (Market Decision Intelligence for Farmers)

---

## 🌾 The Problem

In Maharashtra wholesale trade, headline prices fluctuate dramatically between neighboring APMCs on the same day:
- **Pimpalgaon Baswant APMC:** ₹4,400 / quintal
- **Yeola APMC:** ₹3,600 / quintal

Farmers often travel further chasing the higher headline quote, only to discover that long-distance tempo freight, statutory APMC cess (₹16/q), unloading charges, and spoilage completely erase the margin. Existing agricultural apps show static price tables, but **none tell the farmer what actually stays in their pocket.**

---

## ⚡ Key Innovations & Features

### 1. Dynamic In-Card APMC Selectors & Live Rate Feed
- Integrated directly within the **Market A** and **Market B** comparison cards.
- Selecting a crop pill (**🧅 Onion, 🍅 Tomato, 🥔 Potato, 🧄 Garlic, 🫘 Soybean**) automatically populates nearby Maharashtra wholesale markets and current modal prices.
- Changing either market dropdown instantly updates the freight calculation and price inputs.

### 2. Multi-Crop Live Ticker Carousel
- Horizontal infinite-scroll ticker displaying live benchmark modal prices across Nashik and regional APMCs.
- Context-aware: dynamically updates symbols, mandi names, and price deltas based on the selected crop.
- Tap-to-inject: tapping any mandi card in the ticker loads it directly into the comparison form.

### 3. Financial Waterfall Ledger
- Clear, visual breakdown of the financial flow:
  $$\text{Gross Realization} - \text{Freight \& Transit} - \text{Statutory APMC Levy} = \textbf{Net Realized Settlement}$$
- Identifies **Arbitrage Opportunities** and flags **Negative Arbitrage Traps** (when higher prices are wiped out by transport).

### 4. Plain-Language Trilingual Voice Readout (TTS)
- 1-tap natural audio synthesis delivering spoken verdicts in **Marathi (मराठी)**, **Hindi (हिंदी)**, or **English**.
- Engineered with Devanagari phonetic fallbacks ensuring smooth, accurate pronunciation on mobile devices without external cloud dependencies.

### 5. Instant WhatsApp Sharing & Clipboard Export
- Generates a structured WhatsApp summary card ready to send to family members or local transport drivers.
- Includes crop, quantity, rates, deductions, net in-hand proceeds, and verdict link.

### 6. 100% Offline Progressive Web App (PWA)
- Installable directly to the home screen on Android, iOS, or Desktop as a native standalone app.
- Service Worker caching (`v5.4`) ensures zero-network availability in remote farm locations with spotty 2G/3G connectivity.
- **Zero build tools, zero heavy frameworks:** Built purely with vanilla semantic HTML, modern CSS, and vanilla JS for instantaneous sub-100ms load times on low-end budget smartphones.

---

## 🚀 Live Demo Flow for Judges (2-Minute Walkthrough)

1. **Select a Crop:** Tap the **🍅 Tomato** or **🥔 Potato** pill at the top. Notice the live ticker carousel updates and both Market A and B dropdowns automatically populate with relevant APMC rates.
2. **Review the Comparison:** See **Market A (Lasalgaon APMC @ ₹3,900)** vs **Market B (Pimpalgaon Baswant @ ₹4,400)**.
3. **Calculate:** Tap **"Calculate my comparison →"**.
4. **Inspect the Waterfall:** View the financial ledger breaking down Gross Realization, Freight deduction, APMC Cess, and the highlighted **Winner Card** with the Net Realized Settlement.
5. **Listen Aloud:** Tap **"🔊 ऐका (Listen)"** or switch language to **मराठी / हिंदी** to hear the spoken verdict.
6. **Share Decision:** Tap **"💬 WhatsApp Share"** at the bottom to export the formatted decision to WhatsApp.

---

## 🛠️ Local Development & Server

To run the local development server with the live Agmarknet proxy endpoint:

```powershell
cd mandi-saathi
python server.py
```
Visit `http://127.0.0.1:8765/` in your browser.

---

## 🧪 Test Suite

All core calculations, fare break-even formulas, CSV parsing, and multilingual formatting are verified with automated unit tests:

```powershell
cd mandi-saathi
node test-calculations.cjs
node test-fare.cjs
node test-import.cjs
```

All 3 test suites pass with 100% consistency.

---

## 📄 License & Credits
- Built for the Hackathon 2026.
- Data sourced from Agmarknet / data.gov.in public wholesale market records.
