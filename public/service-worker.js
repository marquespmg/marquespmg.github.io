// service-worker.js - VERSÃO CORRIGIDA + ARQUIVOS ADICIONAIS
const CACHE_NAME = 'pmg-cache-v7';
const urlsToCache = [
  '/',
  '/quem-somos',
  '/politica-de-privacidade',
  '/termos',
  '/faq',
  '/food-news',
  '/offline.html',
  '/logo.png',
  '/logo-72x72.png',
  '/logo-96x96.png',
  '/logo-128x128.png',
  '/logo-144x144.png',
  '/logo-152x152.png',
  '/logo-192x192.png',
  '/logo-384x384.png',
  '/logo-512x512.png',
  'https://i.imgur.com/pBH5WpZ.png',
  'https://i.imgur.com/jrERRsC.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache aberto - PMG Atacadista v7');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// ========== INTERCEPTA REQUISIÇÕES ==========
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
// === NUNCA CACHEAR PÁGINAS QUE PRECISAM DE DADOS ATUALIZADOS ===
if (
  url.includes('/produtos') ||           // Lista de produtos
  url.includes('/produto/') ||           // Produto individual
  url.includes('/ofertas') ||           
  url.includes('/meus-pedidos') ||       // ✅ Meus Pedidos
  url.includes('/api/') ||               // APIs
  url.includes('/mapa.json') ||          // ✅ Mapa (cachear? depende)
  url.includes('/validade.json') ||      // ✅ VALIDADE - NÃO CACHEAR!
  url.includes('/feed.xml') ||           // Feed de produtos
  url.includes('/sitemap-imagens.xml') || // Sitemap de imagens
  url.includes('/sitemap-produtos.xml.js') || // Sitemap de produtos
  url.includes('/product-utils') ||      // Utilitário de produtos
  url.includes('/checkout-facebook.html') || // Checkout Facebook
  (url.includes('.js') && !url.includes('/logo')) || // JS (exceto logo)
  url.includes('google-analytics') ||
  url.includes('facebook.net') ||
  url.includes('gtag')
) {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Retorna do servidor, SEM CACHE
        return response;
      })
      .catch(() => {
        if (url.includes('/api/')) {
          return new Response(JSON.stringify({ error: 'Você está offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return caches.match('/offline.html');
      })
  );
  return;
}

// ===== ARQUIVOS ESTÁTICOS QUE PODEM SER CACHEADOS =====
// Só cachear imagens, fontes e CSS
if (
  url.includes('.png') ||
  url.includes('.jpg') ||
  url.includes('.jpeg') ||
  url.includes('.gif') ||
  url.includes('.webp') ||
  url.includes('.svg') ||
  url.includes('.woff') ||
  url.includes('.woff2') ||
  url.includes('.css')
) {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
  return;
}
  
  // === PARA ARQUIVOS ESTÁTICOS (usa cache primeiro) ===
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        return caches.match('/offline.html');
      })
  );
});

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
