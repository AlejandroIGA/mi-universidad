const CACHE_NAME = 'mi-app-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Abriendo caché y guardando archivos');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Archivos del App Shell cacheados correctamente.');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('Service Worker: Falló el cacheo de archivos', err);
      })
  );
});

self.addEventListener('fetch', event => {
  console.log('Service Worker: Petición fetch para ->', event.request.url);

  event.respondWith(
    caches.match(event.request)
      .then(response => {
       if (response) {
          console.log('Service Worker: Sirviendo desde el caché ->', event.request.url);
          return response;
        }

        console.log('Service Worker: Sirviendo desde la red ->', event.request.url);
        return fetch(event.request);
      })
  );
});