// Service Worker para Super Aguilares
// Maneja notificaciones push y caching offline básico

const CACHE_NAME = 'super-aguilares-v1';
const urlsToCache = [
  '/',
  '/catalogo',
  '/carrito',
  '/historial',
  '/icon-192.png',
  '/icon-512.png',
];

// Evento de instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
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
});

// Evento de fetch para caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
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
    actions: [
      {
        action: 'view',
        title: 'Ver Pedido',
        icon: '/icon-192.png',
      },
      {
        action: 'dismiss',
        title: 'Cerrar',
        icon: '/icon-192.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(options.title || 'Super Aguilares', notificationOptions)
  );
});

// Evento de clic en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    const orderId = event.notification.data ? event.notification.data.orderId : null;
    if (orderId) {
      event.waitUntil(
        clients.openWindow(`/seguimiento/${orderId}`)
      );
    } else {
      event.waitUntil(
        clients.openWindow('/')
      );
    }
  } else if (event.action === 'dismiss') {
    // Cerrar notificación sin acción
  } else {
    // Clic en la notificación (sin acción específica)
    const orderId = event.notification.data ? event.notification.data.orderId : null;
    if (orderId) {
      event.waitUntil(
        clients.openWindow(`/seguimiento/${orderId}`)
      );
    } else {
      event.waitUntil(
        clients.openWindow('/')
      );
    }
  }
});

// Evento de sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

// Función para sincronizar pedidos
async function syncOrders() {
  try {
    // Aquí puedes implementar la lógica de sincronización
    console.log('Sincronizando pedidos...');
  } catch (error) {
    console.error('Error sincronizando pedidos:', error);
  }
}

// Evento de mensaje
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
