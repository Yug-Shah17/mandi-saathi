// sw.js: Service Worker for 100% Offline Resilience & Immediate Updates
const CACHE_NAME = 'mandi-saathi-v5.4';

const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/style.css?v=2.0',
  '/impeccable.css',
  '/app.js',
  '/hold.js',
  '/import.js',
  '/live-data.js',
  '/voice-verdict.js',
  '/transport-helper.js',
  '/pool-calculator.js',
  '/ticker-pwa.js',
  '/share-whatsapp.js',
  '/manifest.json',
  '/icon.svg'
];

// Install: Cache essential assets and immediately take over
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
});

// Activate: Purge all old caches and claim existing clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('Purging legacy cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Allow live API calls to pass through, fallback to cache or JSON if offline
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Static Assets: Cache-First with background update
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to keep cache fresh
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
