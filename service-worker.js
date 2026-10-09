const CACHE_NAME = "vault-v2";
const FILES_TO_CACHE = [ 
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
"./icons/natasha-qr.png"
];
// Установка 
self.addEventListener("install", event => {
    event.waitUntil(
    caches.open(CACHE_NAME) 
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting()) 
    );
});
// Активация 
self.addEventListener("activate", event => {
    event.waitUntil(
      caches.keys()
      .then(keys => Promise.all( 
        keys 
          .filter(key =>
            key === "cards-v1" ||
            (key.startsWith("vault-") && 
             key !== CACHE_NAME)
            ) 
            .map(key => caches.delete(key)) 
      )) 
      .then(() => self.clients.claim())
    ); 
});
// Работа с запросами 
self.addEventListener("fetch", event => { 
  if (event.request.method !== "GET") { 
    return;
  }
event.respondWith(
    caches.open(CACHE_NAME)
        .then(cache => cache.match(event.request))
        .then(response => response || fetch(event.request))
  );
});







