// sw.js — Century Ops service worker (network-first)
const CACHE_VERSION = 'century-ops-v9';   // ← bump this number on each deploy
const CACHE_NAME = CACHE_VERSION;

// Install: activate immediately, don't wait for old SW to release
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate: delete any old caches, take control of open pages right away
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML/JS so newest version always wins.
// Cache is only a fallback when offline.
self.addEventListener('fetch', e => {
  const req = e.request;
  // Only handle GET; let Airtable API & others pass straight through
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Never cache API calls
  if (url.hostname.includes('airtable.com') ||
      url.hostname.includes('open-meteo.com') ||
      url.hostname.includes('mymemory.translated.net')) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        // Save a fresh copy for offline use
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req))   // offline → serve last good copy
  );
});
