// Service Worker DESACTIVADO para evitar errores de hidratación
// El SW causaba el error React #310 por conflictos con MessagePort

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// No hacer nada en fetch - pasar todo directo
self.addEventListener('fetch', (event) => {
  // No cachear nada, dejar pasar directo
  return;
});
