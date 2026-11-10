const CACHE = "keep-shell-v0.1.12";
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
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;
  const isScript = req.destination === "script" || path.endsWith(".js");
  const isStyle = req.destination === "style" || path.endsWith(".css");
  const isDoc = req.destination === "document" || path.endsWith("/") || path.endsWith("/index.html");
  const skipCacheWrite = path.endsWith("/sw.js");

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (!skipCacheWrite && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(async () => {
        const hit = (await caches.match(req)) || (await caches.match(path)) || (await caches.match("." + path));
        if (hit) return hit;
        if (isDoc) return caches.match("./index.html");
        if (isScript || isStyle) return new Response("", { status: 504, statusText: "offline" });
        return caches.match("./index.html");
      })
  );
});
