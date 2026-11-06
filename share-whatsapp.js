// share-whatsapp.js: WhatsApp sharing & offline SMS/clipboard export for farmers

(function () {
  const resultContainer = document.getElementById("result");
  if (!resultContainer) return;

  let shareBox = document.getElementById("share-box");
  if (!shareBox) {
    shareBox = document.createElement("div");
    shareBox.id = "share-box";
    shareBox.className = "share-container";
    shareBox.style.cssText = "margin-top: 24px; padding: 18px; background: #eaf3ed; border: 1px dashed #7aa385; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;";
    
    shareBox.innerHTML = `
      <div>
        <strong style="color: #193c30; font-size: 15px; display: block;" data-en="Share this decision with family or transport driver" data-mr="हा निर्णय कुटुंबीय किंवा गाडीचालकासोबत शेअर करा">Share this decision with family or transport driver</strong>
        <span style="font-size: 13px; color: #5a7065;" data-en="Send a quick summary on WhatsApp" data-mr="व्हॉट्सॲपवर एका क्लिकमध्ये माहिती पाठवा">Send a quick summary on WhatsApp</span>
      </div>
      <div style="display: flex; gap: 10px;">
        <button id="whatsapp-share-btn" type="button" class="wa-btn" style="display: inline-flex; align-items: center; gap: 8px; background: #25d366; color: white; border: 0; padding: 10px 18px; border-radius: 99px; font-weight: 700; cursor: pointer; font-size: 14px;">
          <span>💬</span> <span data-en="WhatsApp Share" data-mr="व्हॉट्सॲपवर पाठवा">WhatsApp Share</span>
        </button>
        <button id="copy-summary-btn" type="button" class="quiet" style="font-size: 13px; padding: 8px 14px;" data-en="Copy Text" data-mr="हिशोब कॉपी करा">Copy Text</button>
      </div>
    `;

    resultContainer.appendChild(shareBox);
  }

  const waBtn = document.getElementById("whatsapp-share-btn");
  const copyBtn = document.getElementById("copy-summary-btn");

  function buildShareText() {
    const isMarathi = document.documentElement.lang === "mr" || (document.getElementById("language") && document.getElementById("language").textContent === "English");
    const headline = document.getElementById("verdict-headline") ? document.getElementById("verdict-headline").textContent : "";
    const nameA = document.getElementById("nameA").value;
    const priceA = document.getElementById("priceA").value;
    const nameB = document.getElementById("nameB").value;
    const priceB = document.getElementById("priceB").value;
    const qty = document.getElementById("quantity").value;
    const crop = document.getElementById("crop") ? document.getElementById("crop").value : "Onion";

    let netA = "", netB = "";
    const nums = document.querySelectorAll(".ledger-row.total .num");
    if (nums.length >= 2) {
      netA = nums[0].textContent;
      netB = nums[1].textContent;
    } else {
      const cards = document.querySelectorAll(".result-card");
      if (cards.length >= 2) {
        netA = cards[0].querySelector("strong") ? cards[0].querySelector("strong").textContent : "";
        netB = cards[1].querySelector("strong") ? cards[1].querySelector("strong").textContent : "";
      }
    }

    if (isMarathi) {
      return `🌾 *मंडी साथी - बाजार तुलना हिशोब*\n` +
             `📦 एकूण माल: ${qty} क्विंटल ${crop}\n\n` +
             `📍 *१. ${nameA}*\n` +
             `• भाव: ₹${priceA}/क्विंटल\n` +
             `• खर्च वजा जाता हातात: *${netA}*\n\n` +
             `📍 *२. ${nameB}*\n` +
             `• भाव: ₹${priceB}/क्विंटल\n` +
             `• खर्च वजा जाता हातात: *${netB}*\n\n` +
             `📢 *निष्कर्ष:* ${headline}\n\n` +
             `_मंडी साथी - जाण्यापूर्वी हिशोब करा!_`;
    } else {
      return `🌾 *Mandi Saathi - Market Comparison Summary*\n` +
             `📦 Lot Size: ${qty} Quintals ${crop}\n\n` +
             `📍 *1. ${nameA}*\n` +
             `• Rate: ₹${priceA}/Q\n` +
             `• Net In-Hand: *${netA}*\n\n` +
             `📍 *2. ${nameB}*\n` +
             `• Rate: ₹${priceB}/Q\n` +
             `• Net In-Hand: *${netB}*\n\n` +
             `📢 *Verdict:* ${headline}\n\n` +
             `_Mandi Saathi - Calculate Before You Travel!_`;
    }
  }

  if (waBtn) {
    waBtn.addEventListener("click", () => {
      const text = encodeURIComponent(buildShareText());
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(buildShareText());
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => copyBtn.textContent = originalText, 2500);
      } catch (e) {
        alert("Clipboard copy not supported. Please use WhatsApp share.");
      }
    });
  }
})();

