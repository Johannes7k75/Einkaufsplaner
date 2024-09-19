

const cacheName = "Einkaufsplaner-v1"
const appFiles = [
    "/",
    "/main.js",
    "/index.html",
    "/list.html",
    "/lists.html",
    "/editList.html",
    "/css/style.css",
]
async function addAllFilesToCache(files) {
    const cache = await caches.open(cacheName);
    console.log("[Service Worker] Caching all: app files");
      await cache.addAll(appFiles);
}

self.addEventListener("install", (e) => {
    console.log("[Service Worker] Install");
	e.waitUntil(addAllFilesToCache(appFiles))
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
      (async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) {
          return r;
        }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
      })(),
    );
  });
  

self.addEventListener("activate", (e) => {
    e.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key === cacheName) {
              return;
            }
            return caches.delete(key);
          }),
        );
      }),
    );
  });
  