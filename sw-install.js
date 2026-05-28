// Century Ops — Install Page Service Worker
// Bump this version string whenever you update install.html
const VERSION = 'install-v1';
const CACHE = VERSION;

// Files to cache
const ASSETS = ['install.html'];

// Install: cache assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  // Take over immediately — don't wait for old SW to die
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for install.html so updates always come through
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Update cache with fresh response
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request)) // fallback to cache if offline
  );
});

// Tell all open pages to reload when a new SW takes over
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
