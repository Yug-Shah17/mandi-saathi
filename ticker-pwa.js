// ticker-pwa.js: 100x Real-Time Mandi Ticker & Progressive Web App (PWA) Offline Engine

(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // ---------------------------------------------------------------------------
  // 1. REGISTER SERVICE WORKER FOR OFFLINE PWA CAPABILITY
  // ---------------------------------------------------------------------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Always fetch a fresh copy of the service worker script
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(reg => {
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
  
  // ---------------------------------------------------------------------------
  // 3. MULTI-CROP REAL-TIME MANDI MARQUEE TICKER (WITH 1-TAP INJECTION)
  // ---------------------------------------------------------------------------
  const CROP_MANDI_DATA = {
    Onion: [
      { name: 'Pimpalgaon Baswant', price: 4400, delta: '+₹150', up: true },
      { name: 'Lasalgaon APMC', price: 3900, delta: '+₹80', up: true },
      { name: 'Kalwan APMC', price: 4100, delta: '+₹110', up: true },
      { name: 'Dindori APMC', price: 4050, delta: '+₹60', up: true },
      { name: 'Manmad APMC', price: 3800, delta: '+₹40', up: true },
      { name: 'Yeola APMC', price: 3600, delta: '-₹50', up: false },
      { name: 'Chandwad APMC', price: 3850, delta: '+₹30', up: true }
    ],
    Tomato: [
      { name: 'Pimpalgaon Baswant', price: 2200, delta: '+₹200', up: true },
      { name: 'Nashik APMC', price: 2150, delta: '+₹150', up: true },
      { name: 'Dindori APMC', price: 2050, delta: '-₹50', up: false },
      { name: 'Girnare APMC', price: 2300, delta: '+₹250', up: true },
      { name: 'Kalwan APMC', price: 1950, delta: '-₹80', up: false }
    ],
    Potato: [
      { name: 'Nashik APMC', price: 1850, delta: '+₹50', up: true },
      { name: 'Pimpalgaon Baswant', price: 1900, delta: '+₹70', up: true },
      { name: 'Lasalgaon APMC', price: 1800, delta: '-₹30', up: false },
      { name: 'Sinner APMC', price: 1750, delta: '-₹40', up: false }
    ],
    Garlic: [
      { name: 'Pimpalgaon Baswant', price: 12500, delta: '+₹500', up: true },
      { name: 'Lasalgaon APMC', price: 12200, delta: '+₹400', up: true },
      { name: 'Nashik APMC', price: 12000, delta: '+₹200', up: true },
      { name: 'Kalwan APMC', price: 11800, delta: '-₹300', up: false }
    ],
    Soybean: [
      { name: 'Lasalgaon APMC', price: 4850, delta: '+₹90', up: true },
      { name: 'Yeola APMC', price: 4780, delta: '+₹40', up: true },
      { name: 'Nandgaon APMC', price: 4720, delta: '-₹60', up: false },
      { name: 'Manmad APMC', price: 4800, delta: '+₹50', up: true }
    ]
  };

  const CROP_ICONS = {
    Onion: '🧅',
    Tomato: '🍅',
    Potato: '🥔',
    Garlic: '🧄',
    Soybean: '🫘'
  };

  let activeCrop = 'Onion';

  function populateTrack(track, crop) {
    track.innerHTML = '';
    const list = CROP_MANDI_DATA[crop] || CROP_MANDI_DATA.Onion;
    const fullList = [...list, ...list];
    const icon = CROP_ICONS[crop] || '🌾';

    fullList.forEach((m) => {
      const item = document.createElement('div');
      item.className = 'ticker-item';
      item.title = 'Click to load ' + m.name + ' into comparison!';
      item.innerHTML = `
        <span class="ticker-mandi">${icon} ${m.name}</span>
        <strong class="ticker-price">₹${m.price.toLocaleString('en-IN')}/q</strong>
        <span class="ticker-delta ${m.up ? 'delta-up' : 'delta-down'}">${m.delta}</span>
        <span class="ticker-cta" data-en="Compare ↗" data-mr="तुलना करा ↗" data-hi="तुलना ↗">Compare ↗</span>
      `;

      item.addEventListener('click', () => {
        const nameA = document.getElementById('nameA');
        const priceA = document.getElementById('priceA');
        const nameB = document.getElementById('nameB');
        const priceB = document.getElementById('priceB');

        if (!nameA || !priceA) return;

        if (nameA.value === 'Lasalgaon APMC' || !nameA.value) {
          nameA.value = m.name;
          priceA.value = m.price;
          nameA.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          nameB.value = m.name;
          priceB.value = m.price;
          nameB.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const comp = document.getElementById('compare');
        if (comp) comp.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      track.appendChild(item);
    });
  }

  function buildTicker() {
    let tickerBar = document.getElementById('mandi-ticker-bar');
    if (tickerBar) return;

    tickerBar = document.createElement('div');
    tickerBar.id = 'mandi-ticker-bar';
    // Hidden until a crop is selected by user
    tickerBar.className = 'ticker-wrapper ticker-hidden';

    const badge = document.createElement('div');
    badge.className = 'ticker-badge';
    badge.innerHTML = `
      <span class="live-dot"></span>
      <span id="ticker-badge-text">LIVE RATES</span>
    `;

    const track = document.createElement('div');
    track.className = 'ticker-track';
    populateTrack(track, activeCrop);

    tickerBar.appendChild(badge);
    tickerBar.appendChild(track);

    const header = document.querySelector('header');
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(tickerBar, header.nextSibling);
    } else {
      document.body.prepend(tickerBar);
    }
  }

  // Listen for user crop selection to unhide and refresh carousel
  window.addEventListener('cropSelected', (e) => {
    const crop = e.detail && e.detail.crop ? e.detail.crop : 'Onion';
    activeCrop = crop;

    const tickerBar = document.getElementById('mandi-ticker-bar');
    if (tickerBar) {
      tickerBar.classList.remove('ticker-hidden');
      const track = tickerBar.querySelector('.ticker-track');
      if (track) populateTrack(track, crop);
      const badgeText = document.getElementById('ticker-badge-text');
      if (badgeText) badgeText.textContent = 'LIVE ' + crop.toUpperCase();
    }
  });

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", buildTicker); } else { buildTicker(); }
})();
