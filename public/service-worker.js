// service-worker.js
const CACHE_NAME = 'pmg-cache-v3';
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

// ========== INSTALAÇÃO ==========
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

// ========== INTERCEPTA REQUISIÇÕES COM SUPORTE OFFLINE ==========
self.addEventListener('fetch', event => {
  // Ignora requisições de analytics e tracking
  if (event.request.url.includes('google-analytics') || 
      event.request.url.includes('facebook.net') ||
      event.request.url.includes('gtag')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Para requisições de API, retorna erro controlado
            if (event.request.url.includes('/api/')) {
              return new Response(JSON.stringify({ error: 'Você está offline' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            // Para páginas, mostra página offline
            return caches.match('/offline.html');
          });
      })
  );
});

// ========== ATIVAÇÃO E LIMPEZA DE CACHE ==========
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

// ========== PERIODIC SYNC (opcional, mas recomendado) ==========
// Se o navegador suportar, faz sync periódico
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'sync-products') {
      event.waitUntil(syncProducts());
    }
  });
}

async function syncProducts() {
  try {
    console.log('🔄 Sincronizando produtos em background...');
    
    // Tenta sincronizar produtos (se tiver API)
    const response = await fetch('/api/produtos');
    if (response.ok) {
      const produtos = await response.json();
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/api/produtos', new Response(JSON.stringify(produtos), {
        headers: { 'Content-Type': 'application/json' }
      }));
      console.log('✅ Produtos sincronizados');
    }
  } catch (error) {
    console.log('⚠️ Periodic sync não disponível ou erro:', error);
  }
}

// ========== BACKGROUND SYNC (CARRINHO) ==========
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

async function syncCart() {
  try {
    console.log('🛒 Sincronizando carrinho pendente...');
    
    // Recupera carrinho pendente do localStorage
    const pendingCart = localStorage.getItem('pending_cart');
    
    if (pendingCart && pendingCart !== '[]') {
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pendingCart
      });
      
      if (response.ok) {
        console.log('✅ Carrinho sincronizado com sucesso');
        localStorage.removeItem('pending_cart');
      }
    }
  } catch (error) {
    console.error('❌ Erro na sincronização do carrinho:', error);
  }
}

// ========== MENSAGENS DO CLIENTE ==========
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'PENDING_CART') {
    // Salva carrinho pendente para sincronizar depois
    localStorage.setItem('pending_cart', JSON.stringify(event.data.cart));
    
    // Registra sync em background
    event.waitUntil(
      self.registration.sync.register('sync-cart')
    );
  }
});

// ========== CHECK DE ATUALIZAÇÕES ==========
self.addEventListener('controllerchange', () => {
  console.log('🔄 Service Worker atualizado');
});
