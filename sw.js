const CACHE_NAME = "barrage-81bad22eea91";
const ASSETS = [
  "./",
  "audio/README.md",
  "icon-192.png",
  "icon-512.png",
  "index.html",
  "manifest.webmanifest",
  "src/features/ranking.js",
  "src/game.js",
  "src/vendor/three.core.js",
  "src/vendor/three.module.js"
];
const INDEX_URL = "index.html";

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS.map(url => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(event.request).catch(() => new Response("", { status: 504, statusText: "Offline" })));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(INDEX_URL, copy));
          return response;
        })
        .catch(() => caches.match(INDEX_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(INDEX_URL).then(index => index || new Response("", { status: 504, statusText: "Offline" })));
      })
  );
});
