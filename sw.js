const CACHE_NAME = "tabula-v3"; // Incremented version to push the update to clients
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://googleapis.com"
];

// 1. Installs worker and caches all layout assets for local offline usage
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) // Forces activation immediately
  );
});

// 2. Cleans up any older version caches during activation phase resets
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Forces active tabs to use this service worker immediately
  );
});

// 3. Intercepts traffic calls to serve cache items instantly without cell data
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// ==========================================
// 📡 NEW: BACKGROUND SYNC FLAG ENGINE
// ==========================================

// 4. Listens for the browser sync flag trigger to fire when network is stable
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-tabula-data") {
    event.waitUntil(
      processPendingSyncData()
    );
  }
});

// Mock function representing your cloud database pipeline
async function processPendingSyncData() {
  console.log("🔄 Tabula Background Sync flag fired: Device is online! Syncing data securely...");
  
  // In a full cloud setup, you would fetch data stored temporarily in IndexedDB
  // and send it via an API fetch request:
  //   const localData = await getPendingDataFromIndexedDB();
  //   await fetch('https://logicmindstech.com', { method: 'POST', body: JSON.stringify(localData) });
  
  return Promise.resolve();
}
