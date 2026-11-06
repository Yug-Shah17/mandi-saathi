// pool-calculator.js: Truck Pooling / गाडी वाटणी (Share Vehicle & Save 60%)

(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const i18n = {
    en: {
      toggle: "🚜 Pool a Vehicle (Save up to 60%)",
      apply: "Apply My Share to Transport",
      vehicleLabel: "Vehicle type",
      farmersLabel: "Number of farmers pooling",
      fareLabel: "Total round-trip fare (₹)",
      badge: "Saved by pooling",
      pickup: "Pickup (15 quintals max)",
      tractor: "Tractor Trolley (40 quintals max)",
      truck: "Mini-Truck (80 quintals max)"
    },
    mr: {
      toggle: "🚜 गाडी वाटणी करा (६०% वाहतूक खर्च वाचवा)",
      apply: "माझा वाटा वाहतूक खर्चात जोडा",
      vehicleLabel: "वाहनाचा प्रकार",
      farmersLabel: "एकत्र येणारे शेतकरी",
      fareLabel: "गाडीचे एकूण भाडे (₹)",
      badge: "वाटणीतून वाचलेले पैसे",
      pickup: "पिकअप (१५ क्विंटल क्षमता)",
      tractor: "ट्रॅक्टर ट्रॉली (४० क्विंटल क्षमता)",
      truck: "छोटा हत्ती / मिनी ट्रक (८० क्विंटल)"
    },
    hi: {
      toggle: "🚜 गाड़ी साझा करें (६०% ढुलाई खर्च बचाएँ)",
      apply: "मेरा हिस्सा ढुलाई में जोड़ें",
      vehicleLabel: "वाहन का प्रकार",
      farmersLabel: "साझा करने वाले किसान",
      fareLabel: "गाड़ी का कुल किराया (₹)",
      badge: "साझा करने से बचत",
      pickup: "पिकअप (१५ क्विंटल क्षमता)",
      tractor: "ट्रैक्टर ट्रॉली (४० क्विंटल क्षमता)",
      truck: "छोटा हाथी / मिनी ट्रक (८० क्विंटल)"
    }
  };

  function getLang() {
    const lang = document.documentElement.lang || 'en';
    if (lang === 'hi' || lang === 'mr') return lang;
    return 'en';
  }

  function createPoolCard(transportInput) {
    const parent = transportInput.parentNode;
    if (!parent) return;

    // Toggle trigger
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'quiet';
    toggleBtn.style = 'margin-top: 6px; margin-bottom: 8px; font-size: 12.5px; padding: 6px 14px; border-radius: 99px; display: inline-flex; align-items: center; gap: 6px;';
    
    const updateToggleText = () => {
      const txt = i18n[getLang()] || i18n.en;
      toggleBtn.textContent = txt.toggle;
    };
    updateToggleText();
    document.addEventListener('languagechange', updateToggleText);

    // Collapsible card container
    const card = document.createElement('div');
    card.className = 'pool-card';
    card.hidden = true;
    card.style = 'margin-top: 8px; margin-bottom: 14px; padding: 14px 16px; border: 1.5px solid #a7d3b8; border-radius: 10px; background: #f0f8f3; box-shadow: 0 2px 8px rgba(10,54,34,0.06); font-size: 13.5px;';

    const renderCardContent = () => {
      const txt = i18n[getLang()] || i18n.en;
      card.innerHTML = `
        <div style="font-weight: 700; color: #0a3622; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center;">
          <span>🚜 ${txt.toggle}</span>
          <span style="font-size:11px; background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:99px;">Shared Logistics</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div>
            <label style="font-size:12px; margin-bottom:4px; display:block; font-weight:600;">${txt.vehicleLabel}</label>
            <select class="pool-vehicle" style="padding: 8px; font-size:13px; border-radius:6px;">
              <option value="1500">${txt.pickup}</option>
              <option value="2500" selected>${txt.tractor}</option>
              <option value="4500">${txt.truck}</option>
            </select>
          </div>
          <div>
            <label style="font-size:12px; margin-bottom:4px; display:block; font-weight:600;">${txt.farmersLabel}</label>
            <select class="pool-farmers" style="padding: 8px; font-size:13px; border-radius:6px;">
              <option value="2">2 Farmers (शेतकरी / किसान)</option>
              <option value="3" selected>3 Farmers (शेतकरी / किसान)</option>
              <option value="4">4 Farmers (शेतकरी / किसान)</option>
            </select>
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <label style="font-size:12px; margin-bottom:4px; display:block; font-weight:600;">${txt.fareLabel}</label>
          <input type="number" class="pool-fare" value="2400" min="0" step="50" style="padding: 8px 12px; font-size:14px; width:100%; border-radius:6px;">
        </div>
        <button type="button" class="pool-apply-btn submit" style="width: 100%; padding: 10px 14px; font-size: 13.5px; border-radius: 6px; margin: 0;">
          ${txt.apply}
        </button>
      `;

      const vehicleSelect = card.querySelector('.pool-vehicle');
      const fareInput = card.querySelector('.pool-fare');
      const farmersSelect = card.querySelector('.pool-farmers');
      const applyBtn = card.querySelector('.pool-apply-btn');

      vehicleSelect.addEventListener('change', () => {
        fareInput.value = vehicleSelect.value;
      });

      applyBtn.addEventListener('click', () => {
        const fare = parseFloat(fareInput.value);
        const farmers = parseInt(farmersSelect.value, 10);
        if (isNaN(fare) || fare <= 0) return;

        const myShare = Math.round(fare / farmers);
        transportInput.value = myShare;
        transportInput.dispatchEvent(new Event('input', { bubbles: true }));

        // Show green savings feedback badge
        let badge = card.querySelector('.pool-savings-badge');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'pool-savings-badge';
          badge.style = 'margin-top: 10px; padding: 8px 12px; background: #ecfdf5; border: 1px solid #10b981; border-radius: 6px; color: #047857; font-size: 13px; font-weight: 700; text-align: center;';
          card.appendChild(badge);
        }
        const saved = Math.round(fare - myShare);
        badge.textContent = `✅ ${txt.badge}: ₹${saved.toLocaleString('en-IN')}!`;
      });
    };

    renderCardContent();
    document.addEventListener('languagechange', renderCardContent);

    toggleBtn.addEventListener('click', () => {
      card.hidden = !card.hidden;
      toggleBtn.style.background = card.hidden ? 'transparent' : 'var(--primary)';
      toggleBtn.style.color = card.hidden ? 'var(--primary)' : '#ffffff';
    });

    transportInput.parentNode.insertBefore(toggleBtn, transportInput.nextSibling);
    transportInput.parentNode.insertBefore(card, toggleBtn.nextSibling);
  }

  function init() {
    ['transportA', 'transportB'].forEach(id => {
      const input = document.getElementById(id);
      if (input) createPoolCard(input);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

