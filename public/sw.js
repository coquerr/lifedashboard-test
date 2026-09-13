// Версия кеша — меняйте это число при каждом релизе, где меняется
// содержимое кешируемых ассетов (HTML/CSS/JS). Изменение этой строки
// заставляет браузер увидеть sw.js как "новый файл" и запустить
// install → activate, что чистит старый кеш через CACHE_NAME.
const CACHE_VERSION = "1";
const CACHE_NAME = `vanta-cache-v${CACHE_VERSION}`;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.mode === "navigate") {
            return caches.match("/");
          }
          return Response.error();
        }),
      ),
  );
});