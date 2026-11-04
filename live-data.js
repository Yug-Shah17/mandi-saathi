// live-data.js: Connects Mandi Saathi UI to the local server's official mandi-price endpoint

(function () {
  const fetchBtn = document.getElementById("fetch-live-btn");
  const liveStatus = document.getElementById("live-data-status");
  const liveMarketsSelectA = document.getElementById("live-market-select-a");
  const liveMarketsSelectB = document.getElementById("live-market-select-b");
  const applyLiveBtn = document.getElementById("apply-live-btn");
  const livePanel = document.getElementById("live-market-picker");

  if (!fetchBtn) return;

  let currentRecords = [];

  fetchBtn.addEventListener("click", async () => {
    fetchBtn.disabled = true;
    liveStatus.textContent = "Connecting to official mandi feed...";
    liveStatus.hidden = false;

    try {
      const res = await fetch("/api/mandi-prices?state=Maharashtra&district=Nashik&commodity=Onion");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      currentRecords = data.records || [];

      if (!currentRecords.length) {
        liveStatus.textContent = "No market records found for the selected area.";
        fetchBtn.disabled = false;
        return;
      }

      // Update badge / status
      const badgeText = data.is_live
        ? "🟢 Live Agmarknet Data (data.gov.in)"
        : "🟡 Verified Offline Snapshot";
      liveStatus.textContent = `${badgeText} · Loaded ${currentRecords.length} markets for Nashik Onion.`;

      // Populate dropdowns
      populateDropdown(liveMarketsSelectA, currentRecords, 0);
      populateDropdown(liveMarketsSelectB, currentRecords, Math.min(1, currentRecords.length - 1));

      if (livePanel) livePanel.hidden = false;
    } catch (err) {
      liveStatus.textContent = "Could not connect to local server: " + err.message;
    } finally {
      fetchBtn.disabled = false;
    }
  });

  function populateDropdown(selectEl, records, defaultIndex) {
    if (!selectEl) return;
    selectEl.innerHTML = "";
    records.forEach((r, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = `${r.market} (₹${r.modal_price}/Q · ${r.variety || "General"} · ${r.arrival_date || "Today"})`;
      if (idx === defaultIndex) opt.selected = true;
      selectEl.appendChild(opt);
    });
  }

  if (applyLiveBtn) {
    applyLiveBtn.addEventListener("click", () => {
      const idxA = parseInt(liveMarketsSelectA.value, 10);
      const idxB = parseInt(liveMarketsSelectB.value, 10);

      const rA = currentRecords[idxA];
      const rB = currentRecords[idxB];

      if (rA) {
        const nameA = document.getElementById("nameA");
        const priceA = document.getElementById("priceA");
        if (nameA) nameA.value = rA.market;
        if (priceA) priceA.value = rA.modal_price;
      }

      if (rB) {
        const nameB = document.getElementById("nameB");
        const priceB = document.getElementById("priceB");
        if (nameB) nameB.value = rB.market;
        if (priceB) priceB.value = rB.modal_price;
      }

      const form = document.getElementById("comparison");
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    });
  }
})();

// ============================================================
// Mandi Taluka Selector & Distance Sorter
// ============================================================

// Taluka data: name -> approximate road distance to each mandi (km)
const TALUKA_MANDI_DISTANCES = {
  // Niphad area mandis
  "Niphad": {
    "APMC Pimpalgaon Baswant": 15,
    "APMC Lasalgaon": 45,
    "Lasalgaon(Niphad)": 20,
    "Lasalgaon(Vinchur)": 60,
    "APMC Yeola": 55,
    "APMC Manmad": 75,
    "APMC Chandwad": 45,
    "APMC Umrane": 55,
    "APMC Devala": 60,
    "APMC Kalwan": 50,
    "APMC Dindori": 80,
    "APMC Sinner": 30
  },
  // Yeola area mandis
  "Yeola": {
    "APMC Pimpalgaon Baswant": 55,
    "APMC Lasalgaon": 15,
    "Lasalgaon(Niphad)": 25,
    "Lasalgaon(Vinchur)": 50,
    "APMC Yeola": 10,
    "APMC Manmad": 35,
    "APMC Chandwad": 25,
    "APMC Umrane": 45,
    "APMC Devala": 40,
    "APMC Kalwan": 35,
    "APMC Dindori": 65,
    "APMC Sinner": 40
  },
  // Dindori area mandis
  "Dindori": {
    "APMC Pimpalgaon Baswant": 80,
    "APMC Lasalgaon": 70,
    "Lasalgaon(Niphad)": 55,
    "Lasalgaon(Vinchur)": 80,
    "APMC Yeola": 65,
    "APMC Manmad": 85,
    "APMC Chandwad": 55,
    "APMC Umrane": 60,
    "APMC Devala": 65,
    "APMC Kalwan": 60,
    "APMC Dindori": 5,
    "APMC Sinner": 35
  },
  // Chandwad area mandis
  "Chandwad": {
    "APMC Pimpalgaon Baswant": 45,
    "APMC Lasalgaon": 25,
    "Lasalgaon(Niphad)": 30,
    "Lasalgaon(Vinchur)": 55,
    "APMC Yeola": 25,
    "APMC Manmad": 45,
    "APMC Chandwad": 8,
    "APMC Umrane": 35,
    "APMC Devala": 40,
    "APMC Kalwan": 30,
    "APMC Dindori": 55,
    "APMC Sinner": 30
  },
  // Kalwan area mandis
  "Kalwan": {
    "APMC Pimpalgaon Baswant": 50,
    "APMC Lasalgaon": 35,
    "Lasalgaon(Niphad)": 40,
    "Lasalgaon(Vinchur)": 65,
    "APMC Yeola": 35,
    "APMC Manmad": 55,
    "APMC Chandwad": 30,
    "APMC Umrane": 40,
    "APMC Devala": 45,
    "APMC Kalwan": 8,
    "APMC Dindori": 65,
    "APMC Sinner": 35
  },
  // Sinnar area mandis
  "Sinnar": {
    "APMC Pimpalgaon Baswant": 30,
    "APMC Lasalgaon": 35,
    "Lasalgaon(Niphad)": 20,
    "Lasalgaon(Vinchur)": 55,
    "APMC Yeola": 40,
    "APMC Manmad": 60,
    "APMC Chandwad": 30,
    "APMC Umrane": 30,
    "APMC Devala": 35,
    "APMC Kalwan": 35,
    "APMC Dindori": 60,
    "APMC Sinner": 15
  },
  // Malegaon area mandis
  "Malegaon": {
    "APMC Pimpalgaon Baswant": 65,
    "APMC Lasalgaon": 55,
    "Lasalgaon(Niphad)": 45,
    "Lasalgaon(Vinchur)": 80,
    "APMC Yeola": 50,
    "APMC Manmad": 65,
    "APMC Chandwad": 45,
    "APMC Umrane": 55,
    "APMC Devala": 60,
    "APMC Kalwan": 50,
    "APMC Dindori": 80,
    "APMC Sinner": 45
  }
};

// Initialize taluka selector and distance sorting when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    initTalukaSelector();
    initDistanceSorter();
  }, 1200);
});

function initTalukaSelector() {
  // Insert taluka dropdown above the live market selection
  const liveMarketPicker = document.getElementById("live-market-picker");
  if (!liveMarketPicker) return;

  // Find the best place to insert - after the header div, before the selects
  const headerDiv = liveMarketPicker.querySelector("div[style*='margin-bottom: 10px']");
  if (!headerDiv) return;

  // Create taluka dropdown
  const talukaSelect = document.createElement("select");
  talukaSelect.id = "taluka-select";
  talukaSelect.style.cssText = "margin-bottom: 8px; padding: 8px; border-radius: 4px; min-width: 200px;";
  talukaSelect.innerHTML = [
    '<option value="">Select Taluka / Village</option>',
    '<option value="Niphad">Niphad</option>',
    '<option value="Yeola">Yeola</option>',
    '<option value="Dindori">Dindori</option>',
    '<option value="Chandwad">Chandwad</option>',
    '<option value="Kalwan">Kalwan</option>',
    '<option value="Sinnar">Sinnar</option>',
    '<option value="Malegaon">Malegaon</option>'
  ].join('');

  // Insert above the market selects
  const labelLabels = liveMarketPicker.querySelectorAll('label');
  if (labelLabels.length >= 2) {
    // Insert after first label group (before the two market selection labels)
    headerDiv.parentNode.insertBefore(talukaSelect, labelLabels[1]);
  } else {
    headerDiv.parentNode.insertBefore(talukaSelect, headerDiv);
  }

  // When taluka changes, sort mandis by distance
  talukaSelect.addEventListener("change", function() {
    const selectedTaluka = this.value;
    if (!selectedTaluka) return;

    sortMandisByDistance(selectedTaluka);
  });
}

function sortMandisByDistance(taluka) {
  const distanceData = TALUKA_MANDI_DISTANCES[taluka];
  if (!distanceData) return;

  // Sort live-market-select-a
  const selectA = document.getElementById("live-market-select-a");
  if (selectA) {
    sortSelectOptions(selectA, distanceData);
  
