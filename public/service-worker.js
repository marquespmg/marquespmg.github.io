// service-worker.js
const CACHE_NAME = 'pmg-cache-v2';
const urlsToCache = [
  '/',
  '/produtos',
  '/quem-somos',
  '/politica-de-privacidade',
  '/termos',
  '/faq',
  '/logo.png',
  '/logo-72x72.png',
  '/logo-96x96.png',
  '/logo-128x128.png',
  '/logo-144x144.png',
  '/logo-152x152.png',
  '/logo-192x192.png',
  '/logo-384x384.png',
  '/logo-512x512.png',
  '/food-news',
  '/offline.html',
  'https://i.imgur.com/pBH5WpZ.png',
  'https://i.imgur.com/jrERRsC.png'
];

// Instala o Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache aberto - PMG Atacadista');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Intercepta as requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna do cache
        if (response) {
          return response;
        }
        
        // Clone da requisição para fazer fetch
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone da resposta para cache
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Se falhar (offline), tenta mostrar página offline
            return caches.match('/offline.html');
          });
      })
  );
});

// Ativa e limpa cache antigo
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(clients.claim());
});

// Background Sync (para tentar sincronizar quando voltar online)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

function syncCart() {
  // Aqui você pode implementar sincronização do carrinho
  console.log('🔄 Sincronizando carrinho...');
  return Promise.resolve();
}
