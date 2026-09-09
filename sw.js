const CACHE_NAME = 'mahadev-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/logo.jpg'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch & Serve from Cache for Super Speed
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache se turant khol dega bina error ke
        }
        return fetch(event.request);
      })
  );
});
