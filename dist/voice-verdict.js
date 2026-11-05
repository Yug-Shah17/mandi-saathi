// voice-verdict.js: Plain-language verdict banner & High-Quality Multilingual Text-to-Speech (Marathi, Hindi, English)

(function () {
  // Guard for non-browser / Node.js test environments
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = { speakVerdict: () => Promise.resolve() };
    }
    return;
  }

  // ---------------------------------------------------------------------------
  // 1. DOM Setup: Create verdict box if not already present
  // ---------------------------------------------------------------------------
  const resultContainer = document.getElementById("result");
  if (!resultContainer) return;

  let verdictCard = document.getElementById("verdict-card");
  if (!verdictCard) {
    verdictCard = document.createElement("div");
    verdictCard.id = "verdict-card";
    verdictCard.className = "verdict-banner";
    verdictCard.innerHTML = `
      <div class="verdict-header">
        <span class="verdict-icon">📢</span>
        <div>
          <h3 id="verdict-headline" style="margin:0; font-size: 1.15rem; font-weight:700;"></h3>
          <p id="verdict-subtext" style="margin:4px 0 0; font-size: 0.95rem; color: var(--muted);"></p>
        </div>
      </div>
      <div style="margin-top: 14px; display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <button id="voice-readout-btn" class="voice-btn" type="button">
          <span class="voice-icon">🔊</span> <span id="voice-btn-text">ऐका (Listen)</span>
        </button>
        <span id="voice-status" style="font-size: 12px; color: var(--muted);"></span>
      </div>
    `;
    resultContainer.insertBefore(verdictCard, resultContainer.firstChild);
  }

  const voiceBtn = document.getElementById("voice-readout-btn");
  const voiceBtnText = document.getElementById("voice-btn-text");
  const voiceStatus = document.getElementById("voice-status");
  const headlineEl = document.getElementById("verdict-headline");
  const subtextEl = document.getElementById("verdict-subtext");

  let latestSpeechText = "";
  let currentActiveLang = "en";

  // Helper to detect current UI language
  function getActiveLang() {
    const docLang = document.documentElement.lang || "en";
    if (docLang === "hi" || docLang === "mr") return docLang;
    const langBtn = document.getElementById("language");
    if (langBtn && langBtn.textContent.includes("मराठी")) return "en";
    if (langBtn && langBtn.textContent.includes("English")) return "mr";
    return "en";
  }

  // ---------------------------------------------------------------------------
  // 2. Multilingual Number → Words Converter (0 - 99,999)
  // ---------------------------------------------------------------------------
  const NUM_WORDS = {
    en: {
      units: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
      tens: ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
      hundred: 'hundred',
      thousand: 'thousand',
      and: 'and'
    },
    hi: {
      units: ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'],
      tens: ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'],
      hundred: 'सौ',
      thousand: 'हज़ार',
      and: ''
    },
    mr: {
      units: ['शून्य', 'एक', 'दोन', 'तीन', 'चार', 'पाच', 'सहा', 'सात', 'आठ', 'नऊ', 'दहा', 'अकरा', 'बारा', 'तेरा', 'चौदा', 'पंधरा', 'सोळा', 'सतरा', 'अठरा', 'एकोणीस'],
      tens: ['', '', 'वीस', 'तीस', 'चाळीस', 'पन्नास', 'साठ', 'सत्तर', 'ऐंशी', 'नव्वद'],
      hundred: 'शे',
      thousand: 'हजार',
      and: ''
    }
  };

  function numberToWords(num, lang) {
    const cfg = NUM_WORDS[lang] || NUM_WORDS.en;
    if (num < 0 || num > 99999) return String(num);

    if (num < 20) return cfg.units[num];

    if (num < 100) {
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      return unit ? `${cfg.tens[ten]} ${cfg.units[unit]}` : cfg.tens[ten];
    }

    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const rest = num % 100;
      const hundredPart = `${cfg.units[hundred]} ${cfg.hundred}`;
      return rest ? `${hundredPart} ${cfg.and ? cfg.and + ' ' : ''}${numberToWords(rest, lang)}` : hundredPart;
    }

    const thousand = Math.floor(num / 1000);
    const rest = num % 1000;
    const thousandPart = `${numberToWords(thousand, lang)} ${cfg.thousand}`;
    return rest ? `${thousandPart} ${cfg.and ? cfg.and + ' ' : ''}${numberToWords(rest, lang)}` : thousandPart;
  }

  // ---------------------------------------------------------------------------
  // 3. Async Voice Selection
  // ---------------------------------------------------------------------------
  function getVoices() {
    return new Promise(resolve => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) {
        resolve(voices);
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', () => resolve(window.speechSynthesis.getVoices()), { once: true });
        setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 500);
      }
    });
  }

  function selectVoice(voices, lang) {
    const baseLang = (lang || 'en').split('-')[0].toLowerCase();
    const match = (voice, test) => test(voice.lang.toLowerCase(), voice.name.toLowerCase());

    const preferences = {
      mr: [
        v => match(v, (l, n) => l.startsWith('mr') || n.includes('marathi')),
        v => match(v, (l, n) => l.startsWith('hi') || n.includes('hindi') || n.includes('india')),
        () => true
      ],
      hi: [
        v => match(v, (l, n) => l.startsWith('hi') || n.includes('hindi')),
        v => match(v, (l, n) => l.includes('india')),
        () => true
      ],
      en: [
        v => match(v, (l, n) => l.startsWith('en-in') || n.includes('india')),
        v => match(v, (l, n) => l.startsWith('en-gb') || n.includes('uk')),
        v => match(v, (l, n) => l.startsWith('en-us') || n.includes('us')),
        () => true
      ]
    };

    const prefList = preferences[baseLang] || preferences.en;
    for (const test of prefList) {
      const voice = voices.find(v => (typeof test === 'function' ? test(v) : true));
      if (voice) return voice;
    }
    return voices[0] || null;
  }

  // ---------------------------------------------------------------------------
  // 3. Audio Player: High-Fidelity Server TTS with Browser Fallback
  // ---------------------------------------------------------------------------
  let currentAudio = null;
  let currentObjectUrl = null;

  function stopCurrentAudio() {
    if (currentAudio) {
      try { currentAudio.pause(); } catch (e) { /* ignore */ }
      currentAudio = null;
    }
    if (currentObjectUrl) {
      try { URL.revokeObjectURL(currentObjectUrl); } catch (e) { /* ignore */ }
      currentObjectUrl = null;
    }
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    }
  }

  async function speakVerdict(rawText, lang = 'en') {
    if (typeof window === 'undefined') return;

    stopCurrentAudio();

    // Guard so the fallback path runs exactly once (no double playback / errors).
    let settled = false;

    const cleanup = () => {
      if (voiceBtn) voiceBtn.classList.remove("playing");
      if (voiceStatus) voiceStatus.textContent = "";
      currentAudio = null;
      if (currentObjectUrl) {
        try { URL.revokeObjectURL(currentObjectUrl); } catch (e) { /* ignore */ }
        currentObjectUrl = null;
      }
    };

    const fallbackOnce = () => {
      if (settled) return;
      settled = true;
      cleanup();
      fallbackSpeechSynthesis(rawText, lang);
    };

    if (voiceBtn) voiceBtn.classList.add("playing");
    if (voiceStatus) {
      voiceStatus.textContent = lang === 'mr' ? "🔊 वाचन सुरू आहे..." : lang === 'hi' ? "🔊 बोल रहा है..." : "🔊 Speaking...";
    }

    // Attempt 1: High-fidelity natural Marathi / Hindi audio stream from /api/tts.
    // On serverless hosts (GitHub Pages) this endpoint does not exist, so a 404 /
    // network failure / empty body is detected and we silently fall back to the
    // browser's built-in speech synthesis — with no uncaught console errors.
    try {
      const audioUrl = `/api/tts?lang=${encodeURIComponent(lang)}&text=${encodeURIComponent(rawText)}`;
      const res = await fetch(audioUrl, { method: 'GET' });
      if (!res.ok) throw new Error("TTS endpoint unavailable (HTTP " + res.status + ")");

      const blob = await res.blob();
      if (!blob || blob.size === 0) throw new Error("Empty TTS audio response");

      const objectUrl = URL.createObjectURL(blob);
      currentObjectUrl = objectUrl;

      const audio = new Audio(objectUrl);
      currentAudio = audio;

      audio.onended = () => {
        settled = true;
        cleanup();
      };
      audio.onerror = fallbackOnce;

      await audio.play();
      return;
    } catch (err) {
      // Seamless fallback to browser speech synthesis.
      fallbackOnce();
    }
  }

  function fallbackSpeechSynthesis(rawText, lang) {
    if (!('speechSynthesis' in window)) return;
    const processedText = rawText.replace(/\b\d+\b/g, match => {
      const n = parseInt(match, 10);
      return numberToWords(n, lang);
    });

    const utterance = new SpeechSynthesisUtterance(processedText);
    utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.92;

    if (voiceBtn) voiceBtn.classList.add("playing");
    utterance.onend = () => { if (voiceBtn) voiceBtn.classList.remove("playing"); };
    utterance.onerror = () => { if (voiceBtn) voiceBtn.classList.remove("playing"); };

    window.speechSynthesis.speak(utterance);
  }

  // ---------------------------------------------------------------------------
  // 4. Hook into calculation results: Generate Plain-Language Verdict
  // ---------------------------------------------------------------------------
  window.updateVerdict = function (calcData) {
    if (!calcData) return;
    const { nameA, netA, nameB, netB, diff, preferred } = calcData;

    currentActiveLang = getActiveLang();
    const lang = currentActiveLang;

    // Update listen button text depending on language
    if (voiceBtnText) {
      voiceBtnText.textContent = lang === 'mr' ? "ऐका (Listen)" : lang === 'hi' ? "सुनिए (Listen)" : "Listen 🔊";
    }

    let headline = "";
    let subtext = "";
    let speech = "";

    if (Math.abs(diff) < 5) {
      if (lang === "mr") {
        headline = "दोन्ही बाजारांतून हातात मिळणारी रक्कम जवळजवळ सारखीच आहे.";
        subtext = `वाहतूक खर्च वजा केल्यानंतर ${nameA} आणि ${nameB} मध्ये मोठा फरक नाही. जवळचा सोयीचा बाजार निवडा.`;
        speech = `दोन्ही बाजारात मिळणारी रक्कम जवळजवळ सारखीच आहे. वाहतूक खर्च वजा जाता मोठा फरक नाही. जवळचा बाजार निवडा.`;
      } else if (lang === "hi") {
        headline = "दोनों मंडियों से हाथ में आने वाली रकम लगभग बराबर है।";
        subtext = `ढुलाई खर्च निकालने के बाद ${nameA} और ${nameB} में कोई खास अंतर नहीं है। पास की मंडी चुनें।`;
        speech = `दोनों मंडियों से मिलने वाली रकम लगभग बराबर है। ढुलाई खर्च निकालने के बाद कोई बड़ा अंतर नहीं है।`;
      } else {
        headline = "Both markets yield nearly the exact same net proceeds.";
        subtext = `After factoring in transport costs, ${nameA} and ${nameB} offer virtually identical take-home earnings. Consider the closer market.`;
        speech = `Both markets yield nearly the exact same take-home earnings. Choose the closer or more reliable market.`;
      }
    } else if (preferred === "A") {
      const more = Math.round(diff);
      if (lang === "mr") {
        headline = `${nameA} मध्ये विक्री केल्यास ₹${more.toLocaleString('en-IN')} जास्त हातात राहतील!`;
        subtext = `${nameB} च्या तुलनेत वाहतूक व सर्व खर्च वजा करूनही ${nameA} मधून तुम्हाला जास्त नफा मिळतो.`;
        speech = `${nameA} मध्ये माल विकल्यास वाहतूक खर्च वजा जाता तुमच्या हातात ${more} रुपये जास्त राहतील.`;
      } else if (lang === "hi") {
        headline = `${nameA} में बेचने पर ₹${more.toLocaleString('en-IN')} ज़्यादा हाथ में बचेंगे!`;
        subtext = `${nameB} की तुलना में ढुलाई व अन्य खर्च घटाने के बाद भी ${nameA} से आपको ज़्यादा बचत होती है।`;
        speech = `${nameA} में बेचने पर ढुलाई खर्च निकालने के बाद आपके हाथ में ${more} रुपये ज़्यादा बचेंगे।`;
      } else {
        headline = `Sell at ${nameA} to take home ₹${more.toLocaleString('en-IN')} more!`;
        subtext = `Even after transport costs, ${nameA} leaves more money in your pocket than ${nameB}.`;
        speech = `Selling at ${nameA} leaves ${more} rupees more in your pocket after transport than ${nameB}.`;
      }
    } else {
      const more = Math.round(-diff);
      if (lang === "mr") {
        headline = `${nameB} मध्ये विक्री केल्यास ₹${more.toLocaleString('en-IN')} जास्त हातात राहतील!`;
        subtext = `${nameA} च्या तुलनेत वाहतूक व सर्व खर्च वजा करूनही ${nameB} मधून तुम्हाला जास्त नफा मिळतो.`;
        speech = `${nameB} मध्ये माल विकल्यास वाहतूक खर्च वजा जाता तुमच्या हातात ${more} रुपये जास्त राहतील.`;
      } else if (lang === "hi") {
        headline = `${nameB} में बेचने पर ₹${more.toLocaleString('en-IN')} ज़्यादा हाथ में बचेंगे!`;
        subtext = `${nameA} की तुलना में ढुलाई व अन्य खर्च घटाने के बाद भी ${nameB} से आपको ज़्यादा बचत होती है।`;
        speech = `${nameB} में बेचने पर ढुलाई खर्च निकालने के बाद आपके हाथ में ${more} रुपये ज़्यादा बचेंगे।`;
      } else {
        headline = `Sell at ${nameB} to take home ₹${more.toLocaleString('en-IN')} more!`;
        subtext = `Even after transport costs, ${nameB} leaves more money in your pocket than ${nameA}.`;
        speech = `Selling at ${nameB} leaves ${more} rupees more in your pocket after transport than ${nameA}.`;
      }
    }

    if (headlineEl) headlineEl.textContent = headline;
    if (subtextEl) subtextEl.textContent = subtext;
    latestSpeechText = speech;
    verdictCard.hidden = false;
  };

  // ---------------------------------------------------------------------------
  // 5. Button Click Event Listener
  // ---------------------------------------------------------------------------
  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      const textToSpeak = latestSpeechText || (headlineEl ? headlineEl.textContent : "");
      if (!textToSpeak) return;
      speakVerdict(textToSpeak, currentActiveLang || getActiveLang());
    });
  }

  // Expose to window for external callers
  window.speakVerdict = speakVerdict;
})();
