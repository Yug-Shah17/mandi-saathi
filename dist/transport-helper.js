// transport-helper.js: Preset vehicles & distance fare estimator for Nashik farmers

(function () {
  const container = document.querySelector(".market-grid");
  if (!container) return;

  const VEHICLES = [
    { id: "custom", nameEn: "Custom Amount", nameMr: "स्वतः भरा", rate: 0, capacity: 0 },
    { id: "pickup", nameEn: "Pickup / Bolero (10-25 Q · ~₹22/km)", nameMr: "पिकअप / बोलेरो (~₹२२/किमी)", rate: 22, capacity: 20 },
    { id: "tractor", nameEn: "Tractor Trolley (40-60 Q · ~₹35/km)", nameMr: "ट्रॅक्टर ट्रॉली (~₹३५/किमी)", rate: 35, capacity: 50 },
    { id: "tempo", nameEn: "Mini Tempo (5-10 Q · ~₹15/km)", nameMr: "छोटा टेम्पो (~₹१५/किमी)", rate: 15, capacity: 8 }
  ];

  function injectHelper(marketKey) {
    const transportInput = document.getElementById("transport" + marketKey);
    if (!transportInput || document.getElementById("helper-" + marketKey)) return;

    const parent = transportInput.closest("div");
    if (!parent) return;

    const wrapper = document.createElement("div");
    wrapper.id = "helper-" + marketKey;
    wrapper.style.cssText = "grid-column: 1 / -1; margin-top: 4px; margin-bottom: 12px; padding: 10px; background: #f3f7ef; border-radius: 6px; border: 1px dashed #cad8c4;";
    
    wrapper.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:11px; font-weight:700; color:#5a7065;" data-en="OPTIONAL: FARE ESTIMATOR" data-mr="पर्यायी: भाडे अंदाज">OPTIONAL: FARE ESTIMATOR</span>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <select id="vehicle-${marketKey}" style="flex:1.2; min-width:140px; padding:6px 8px; font-size:12px;">
          ${VEHICLES.map(v => `<option value="${v.id}">${v.nameEn}</option>`).join('')}
        </select>
        <input id="dist-${marketKey}" type="number" min="0" max="500" placeholder="Distance (km)" style="flex:0.8; min-width:90px; padding:6px 8px; font-size:12px;">
        <button id="apply-dist-${marketKey}" type="button" class="quiet" style="padding:4px 10px; font-size:12px;" data-en="Calculate Fare" data-mr="भाडे काढा">Calc</button>
      </div>
    `;

    parent.appendChild(wrapper);

    const vehicleSel = wrapper.querySelector(`#vehicle-${marketKey}`);
    const distInput = wrapper.querySelector(`#dist-${marketKey}`);
    const applyBtn = wrapper.querySelector(`#apply-dist-${marketKey}`);

    applyBtn.addEventListener("click", () => {
      const vId = vehicleSel.value;
      const dist = parseFloat(distInput.value);
      const vehicle = VEHICLES.find(v => v.id === vId);

      if (vehicle && vehicle.rate > 0 && !isNaN(dist) && dist > 0) {
        const estimatedFare = Math.round(vehicle.rate * dist);
        transportInput.value = estimatedFare;
        // Trigger comparison update
        const form = document.getElementById("comparison");
        if (form) form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    });
  }

  injectHelper("A");
  injectHelper("B");
})();

