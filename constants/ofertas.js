// constants/ofertas.js
export const featuredProducts = [
  { id: 3131, name: 'COPA ITALIANA FATIADA PRIETO 70 G', category: 'Ofertas', price: 30.34, image: 'https://www.marquesvendaspmg.shop/images/copa-italiana-fatiada-prieto-70-g-cx-12-pct.webp', gtin: '7898700741261' },
  { id: 3143, name: 'LOMBO APIMENTADO DEFUMADO FATIADO PRIETO 80 G', category: 'Ofertas', price: 11.33, image: 'https://www.marquesvendaspmg.shop/images/lombo-apimentado-defumado-fatiado-prieto-80-g-cx-14-pct.webp', gtin: '7897053006232' },
  { id: 3148, name: 'PANCETA SUÍNA DEFUMADA FATIADA PRIETO 80 G', category: 'Ofertas', price: 12.54, image: 'https://www.marquesvendaspmg.shop/images/panceta-suina-defumada-fatiada-prieto-80-g-cx-14-pct.webp', gtin: '7897053009929' },
  { id: 3149, name: 'PARMA PRESUNTO CRU FATIADO ITALIANO PRIETO 70 G', category: 'Ofertas', price: 23.01, image: 'https://www.marquesvendaspmg.shop/images/parma-presunto-cru-fatiado-italiano-prieto-70-g-cx-12-pct.webp', gtin: '7898700741247' },
  { id: 3150, name: 'PARMA PRESUNTO CRU FATIADO SERRANO ESPANHOL PRIETO 70 G', category: 'Ofertas', price: 24.11, image: 'https://www.marquesvendaspmg.shop/images/parma-presunto-cru-fatiado-serrano-espanhol-prieto-70-g-cx-12-pct.webp', gtin: '7898700741308' },
  { id: 3157, name: 'PEPPERONI FATIADO PRIETO 500 G', category: 'Ofertas', price: 30.26, image: 'https://www.marquesvendaspmg.shop/images/pepperoni-fatiado-prieto-500-g-cx-12-pct.webp', gtin: '7897053013759' },
  { id: 3159, name: 'PRESUNTO DEFUMADO FATIADO PRIETO 80 G', category: 'Ofertas', price: 8.05, image: 'https://www.marquesvendaspmg.shop/images/presunto-defumado-fatiado-prieto-80-g-cx-14-pct.webp', gtin: '7897053005716' },
  { id: 3160, name: 'PRESUNTO REAL FATIADO PRIETO 80 G', category: 'Ofertas', price: 10.41, image: 'https://www.marquesvendaspmg.shop/images/presunto-real-fatiado-prieto-80-g-cx-14-pct.webp', gtin: '7897053006577' },
  { id: 3163, name: 'SALAME MILANO FATIADO PRIETO 70 G', category: 'Ofertas', price: 22.82, image: 'https://www.marquesvendaspmg.shop/images/salame-milano-fatiado-prieto-70-g-cx-12-pct.webp', gtin: '7898700741254' },
  { id: 3164, name: 'SUCO DE LARANJA INTEGRAL TUTTY 3 L', category: 'Ofertas', price: 27.98, image: 'https://www.marquesvendaspmg.shop/images/suco-de-laranja-integral-tutty-3-l-pct-4-un.webp', gtin: '7898945930512' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
