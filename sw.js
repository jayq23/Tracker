// sw.js

const CACHE_NAME = "expense-tracker-v2";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/script.js",
  "/style.css",
  "/manifest.json",
  "/logoooooo.jpg",
  "/ohh anooo.jpg",
  "/favicon.png"
];

// Install event - cache files
self.addEventListener("install", (event) => {
  console.log("✅ Service Worker installed, caching files...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  console.log("⚡ Service Worker activated");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("🗑️ Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch event - serve from cache if available
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );

});


