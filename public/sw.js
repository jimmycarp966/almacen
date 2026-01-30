// Service Worker para Super Aguilares
// Maneja notificaciones push y caching offline básico

const CACHE_NAME = 'super-aguilares-v2';
const urlsToCache = [
  '/',
  '/catalogo',
  '/carrito',
];

// Evento de instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // Ignorar errores de cache en desarrollo
        console.log('Cache addAll falló, continuando...');
      });
    })
  );
  self.skipWaiting();
});

// Evento de activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Evento de fetch para caching
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignorar requests que no podemos cachear
  if (
    request.method !== 'GET' ||
    request.url.startsWith('chrome-extension://') ||
    request.url.includes('_next/') ||
    request.url.includes('supabase')
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((fetchResponse) => {
        // Solo cachear respuestas válidas
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }
        return fetchResponse;
      }).catch(() => {
        // Retornar respuesta offline si falla
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// Evento de notificación push
self.addEventListener('push', (event) => {
  const options = event.data ? event.data.json() : {};

  const notificationOptions = {
    body: options.body || 'Tienes una nueva notificación de Super Aguilares',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: options.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(options.title || 'Super Aguilares', notificationOptions)
  );
});

// Evento de clic en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Evento de mensaje
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
