const CACHE_NAME = "cards-v1";
const urlsToCache = [
  "/vault/",               // главный файл
  "/vault/index.html",     // HTML
  "/vault/app.js",         // скрипт для визиток
  "/vault/data/users.json" // данные визиток
  "/vault/icons/icon-192.png",
  "/vault/icons/icon-512.png"
  // сюда можно добавить другие CSS, иконки и изображения
];

// Установка Service Worker и кэширование
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // сразу активируем SW
  );
});

// Активация Service Worker и очистка старых кэшей
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Перехват запросов и отдача из кэша, если есть
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});



