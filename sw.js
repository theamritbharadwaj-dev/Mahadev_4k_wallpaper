const CACHE_NAME = 'mahadev-v2';
const assetsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/images/logo.jpg'
];

// Install Service Worker & Cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// Activate & Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Cache first, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Internet na ho toh bhi cache se turant khol dega
      }
      return fetch(event.request).catch(() => {
        // Agar internet bhi nahi hai aur cache me bhi nahi hai, toh index.html dikha dega taki error na aaye
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
