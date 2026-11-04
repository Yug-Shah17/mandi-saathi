// ticker-pwa.js: 100x Real-Time Mandi Ticker & Progressive Web App (PWA) Offline Engine

(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // ---------------------------------------------------------------------------
  // 1. REGISTER SERVICE WORKER FOR OFFLINE PWA CAPABILITY
  // ---------------------------------------------------------------------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('Mandi Saathi PWA Service Worker Registered Successfully:', reg.scope);
      }).catch(err => {
        console.warn('Service Worker registration skipped:', err);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 2. NATIVE PWA INSTALL BUTTON IN HEADER
  // ---------------------------------------------------------------------------
  let deferredInstallPrompt = null;
  const headRight = document.querySelector('.headright');

  const installBtn = document.createElement('button');
  installBtn.id = 'pwa-install-btn';
  installBtn.type = 'button';
  installBtn.className = 'pwa-btn';
  // Always visible by default
  installBtn.style.display = 'inline-flex';
  installBtn.innerHTML = `
    <span class="pwa-icon">📲</span>
    <span id="pwa-btn-label" data-en="Install App" data-mr="ॲप इन्स्टॉल करा" data-hi="ऐप इंस्टॉल करें">Install App</span>
  `;

  if (headRight) {
    headRight.insertBefore(installBtn, headRight.firstChild);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    // Keep button visible
    installBtn.style.display = 'inline-flex';
  });

  installBtn.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        // Keep button visible even after acceptance
        installBtn.style.display = 'inline-flex';
      }
      deferredInstallPrompt = null;
      return;
    }

    // Fallback for desktop browsers that don't fire beforeinstallprompt
    alert(
      "To install Mandi Saathi on your computer:\n" +
      "1. Look at your browser address bar (top right) and click the 'Install App' icon (monitor with down arrow).\n" +
      "2. Or click the 3 dots  -> 'Save and share' -> 'Install Mandi Saathi'.\n" +
      "It will install as a standalone desktop application!"
    );
  });

  window.addEventListener('appinstalled', () => {
    // Keep button visible after installation
    installBtn.style.display = 'inline-flex';
  });

  // Offline / Online Status Indicator
  const updateOnlineStatus = () => {
    let offlineBadge = document.getElementById('offline-badge');
    if (!navigator.onLine) {
      if (!offlineBadge) {
        offlineBadge = document.createElement('div');
        offlineBadge.id = 'offline-badge';
        offlineBadge.className = 'offline-indicator';
        offlineBadge.innerHTML = '⚡ <b>Offline Ready:</b> Working from local device memory';
        document.body.prepend(offlineBadge);
      }
    } else if (offlineBadge) {
      offlineBadge.remove();
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // ---------------------------------------------------------------------------
  // 3. 100x REAL-TIME MANDI MARQUEE TICKER (WITH 1-TAP INJECTION)
  // ---------------------------------------------------------------------------
  const MANDI_TICKER_DATA = [
    { name: 'Pimpalgaon Baswant', price: 4400, delta: '+₹150', up: true, dist: '28 km' },
    { name: 'Lasalgaon APMC', price: 3900, delta: '+₹80', up: true, dist: '42 km' },
    { name: 'Kalwan APMC', price: 4100, delta: '+₹110', up: true, dist: '35 km' },
    { name: 'Dindori APMC', price: 4050, delta: '+₹60', up: true, dist: '22 km' },
    { name: 'Manmad APMC', price: 3800, delta: '+₹40', up: true, dist: '55 km' },
    { name: 'Yeola APMC', price: 3600, delta: '-₹50', up: false, dist: '65 km' },
    { name: 'Chandwad APMC', price: 3850, delta: '+₹30', up: true, dist: '38 km' }
  ];

  function buildTicker() {
    const existing = document.getElementById('mandi-ticker-bar');
    if (existing) return;

    const tickerBar = document.createElement('div');
    tickerBar.id = 'mandi-ticker-bar';
    tickerBar.className = 'ticker-wrapper';

    // Left Live Badge
    const badge = document.createElement('div');
    badge.className = 'ticker-badge';
    badge.innerHTML = `
      <span class="live-dot"></span>
      <span data-en="LIVE RATES" data-mr="थेट बाजारभाव" data-hi="ताज़ा मंडी भाव">LIVE RATES</span>
    `;

    // Scrolling Track
    const track = document.createElement('div');
    track.className = 'ticker-track';

    // Duplicate list twice for seamless infinite marquee loop
    const fullList = [...MANDI_TICKER_DATA, ...MANDI_TICKER_DATA];

    fullList.forEach((m) => {
      const item = document.createElement('div');
      item.className = 'ticker-item';
      item.title = `Click to load ${m.name} into comparison!`;
      item.innerHTML = `
        <span class="ticker-mandi">🧅 ${m.name}</span>
        <strong class="ticker-price">₹${m.price.toLocaleString('en-IN')}/q</strong>
        <span class="ticker-delta ${m.up ? 'delta-up' : 'delta-down'}">${m.delta}</span>
        <span class="ticker-cta" data-en="Compare ↗" data-mr="तुलना करा ↗" data-hi="तुलना ↗">Compare ↗</span>
      `;

      // 1-Click Injection Magic: Clicking loads this mandi into comparison
      item.addEventListener('click', () => {
        const nameA = document.getElementById('nameA');
        const priceA = document.getElementById('priceA');
        const nameB = document.getElementById('nameB');
        const priceB = document.getElementById('priceB');

        if (!nameA || !priceA) return;

        // If Market A is empty or default, fill A; otherwise fill B
        if (nameA.value === 'Market A' || !nameA.value) {
          nameA.value = `${m.name}`;
          priceA.value = m.price;
          nameA.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          nameB.value = `${m.name}`;
          priceB.value = m.price;
          nameB.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Scroll smoothly to comparison
        const comp = document.getElementById('compare');
        if (comp) comp.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      track.appendChild(item);
    });

    tickerBar.appendChild(badge);
    tickerBar.appendChild(track);

    // Insert right after sticky header
    const header = document.querySelector('header');
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(tickerBar, header.nextSibling);
    } else {
      document.body.prepend(tickerBar);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTicker);
  } else {
    buildTicker();
  }
})();
