const CACHE_NAME = "cards-v1";
const FILES_TO_CACHE = [
                                // index
  "/vault/app.js",               // скрипт
  "/vault/data/users.json",      // данные пользователей
  // PWA иконки
  "/vault/icons/icon-32.png",
  "/vault/icons/icon-180.png",
  "/vault/icons/icon-192.png",
  "/vault/icons/icon-512.png",
  // QR-коды пользователей
  "/vault/icons/andrew-qr.png",
  "/vault/icons/ivanov-qr.png",
  "/vault/icons/petrov-qr.png"
];

// Установка Service Worker и кэширование
self.addEventListener("install", event => {
  console.log("[SW] Install event");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Активация Service Worker и удаление старых кешей
self.addEventListener("activate", event => {
  console.log("[SW] Activate event");
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов и отдача из кеша, если есть
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});







