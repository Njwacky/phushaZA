/* ================================================================
   Pusha — sw.js   (service worker: keeps the app itself on the phone)
   Only the app's own files are cached. Nothing else is ever touched:
   a link to a learning site still goes to the phone's network, and no
   request is made unless the person taps that link.
   ================================================================ */
const CACHE = "pusha-2.9.0";     // bump when you ship a new version
const SHELL = [
  "./", "index.html", "styles.css", "theme.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon.svg",
  "js/pdf-lib.min.js", "js/html2canvas.min.js", "js/pdf-pack.js",
  "js/data-ideas.js", "js/data-learn.js", "js/core.js", "js/i18n.js", "js/pack.js",
  "js/cv-checks.js", "js/misc.js", "js/ideas.js", "js/money.js", "js/path.js",
  "js/data-diy.js", "js/diy-art.js", "js/documents.js", "js/diy.js", "js/hint-resize.js", "js/hint-ios.js",
  /* the ten finished-project photos, cached once and then offline like everything else */
  "img/diy-paperbeads.jpg", "img/diy-wirename.jpg", "img/diy-beadcharms.jpg",
  "img/diy-tasselhanging.jpg", "img/diy-stringart.jpg", "img/diy-candles.jpg",
  "img/diy-soap.jpg", "img/diy-planters.jpg", "img/diy-saltdough.jpg",
  "img/diy-wordart.jpg"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // addAll fails the whole install if one file 404s — add them one by one
    await Promise.all(SHELL.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // learning links: straight to the network

  // the page itself: try the phone's network first so an update is picked up,
  // fall back to the copy on the phone so it still opens with no data
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const c = await caches.open(CACHE);
        c.put("index.html", fresh.clone());
        return fresh;
      } catch (err) {
        return (await caches.match("index.html")) || (await caches.match("./")) || Response.error();
      }
    })());
    return;
  }

  // everything else is a file of the app: serve it from the phone, quietly
  // refresh it when there is a connection
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) {
        const c = await caches.open(CACHE);
        c.put(req, fresh.clone());
      }
      return fresh;
    } catch (err) {
      return Response.error();
    }
  })());
});
