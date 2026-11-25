const CACHE_NAME = "vault-v5";

// Основные файлы приложения
const APP_FILES = [
 "./",
  "./index.html",
  "./manifest.json",
  "./data/users.json",
  "./icons/icon-32.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",

"./icons/IMG_E1029.JPG",
"./icons/andrew-qr.jpg",
"./icons/andrew-qr.png",  
"./icons/natasha-qr.png"

];

// =====================================
// УСТАНОВКА
// =====================================

self.addEventListener("install", event => {

event.waitUntil((async () => {

const cache = await caches.open(CACHE_NAME);

for (const file of APP_FILES) {

  try {
    await cache.add(file);
  } catch (error) {
    console.warn("Не удалось сохранить файл:", file, error);
  }

}

await self.skipWaiting();
})());

});

// =====================================
// АКТИВАЦИЯ
// =====================================

self.addEventListener("activate", event => {

event.waitUntil((async () => {

const names = await caches.keys();

await Promise.all(
  names
    .filter(name =>
      name.startsWith("bar-pwa-") &&
      name !== CACHE_NAME
    )
    .map(name => caches.delete(name))
);

await self.clients.claim();
})());

});

// =====================================
// ЗАПРОСЫ
// =====================================

self.addEventListener("fetch", event => {

const request = event.request;

if (request.method !== "GET") return;

event.respondWith((async () => {

const cache = await caches.open(CACHE_NAME);

// Для навигации игнорируем ?user=...
const saved = await cache.match(
  request,
  { ignoreSearch: request.mode === "navigate" }
);

if (saved) return saved;

try {
  const response = await fetch(request);

  if (response.ok || response.type === "opaque") {
    await cache.put(request, response.clone());
  }

  return response;

} catch (error) {

  if (request.mode === "navigate") {

    const index = await cache.match(
      new URL("./index.html", self.registration.scope).href
    );

    if (index) return index;
  }

  return new Response("", {
    status: 503
  });

}
})());

});













