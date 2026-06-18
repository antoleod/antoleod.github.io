/* ============================================================
   ORYXEN LABS — Service Worker v1.0
   Strategy: Cache-first for static assets, network-first for HTML
   ============================================================ */

const CACHE_NAME = 'oryxen-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/404.html',
  '/pitch.html',
  '/privacy.html',
  '/css/styles.css',
  '/js/render.js',
  '/js/script.js',
  '/manifest.json',
  '/icon.svg',
  '/assets/logo.png',
  '/data/projects.json',
  '/data/stack.json',
  '/data/config.json',
];

/* ── Install: precache static shell ── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

/* ── Activate: purge old caches ── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── Fetch: stale-while-revalidate for assets, network-first for HTML ── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Network-first for HTML navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return res;
      });
      return cached || networkFetch;
    })
  );
});
