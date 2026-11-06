const CACHE = "keep-shell-v0.1.5";
const SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./books.js", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const path = new URL(req.url).pathname;
  const skipCache = path.endsWith("/sw.js") || path.endsWith("/index.html") || path.endsWith("/") || path.endsWith("/books.js");
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (!skipCache && res.ok && new URL(req.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
  );
});
