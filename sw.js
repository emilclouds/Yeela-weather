const CACHE = "yeela-weather-v1";
const ASSETS = ["./","./index.html","./manifest.json","./sw.js","./icon-192.png","./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache)=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null))))
    .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.hostname.includes("open-meteo.com")) {
    event.respondWith(fetch(req).catch(()=>caches.match(req)));
    return;
  }
  event.respondWith(caches.match(req).then((c)=>c || fetch(req)));
});
