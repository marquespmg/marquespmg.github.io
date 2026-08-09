// constants/ofertas.js
export const featuredProducts = [
  { id: 46, name: 'ÁGUA DE COCO GRANDE COCO QUADRADO 1 L (CX 12 UN)', category: 'Ofertas', price: 94.99, image: 'https://www.marquesvendaspmg.shop/images/agua-de-coco-grande-coco-quadrado-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 50, name: 'ÁGUA DE COCO PEQUENA COCO QUADRADO 200 ML (CX 27 UN)', category: 'Ofertas', price: 53.50, image: 'https://www.marquesvendaspmg.shop/images/agua-de-coco-pequena-coco-quadrado-200-ml-cx-27-un-pmg-atacadista.jpg' },
  { id: 1905, name: 'ÁGUA MINERAL LINDOYA VERÃO COM GÁS 300 ML (PCT 12 UN)', category: 'Ofertas', price: 19.99, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-lindoya-verao-com-gas-300-ml.png' },
  { id: 1906, name: 'ÁGUA MINERAL LINDOYA VERÃO SEM GÁS 300 ML (PCT 12 UN)', category: 'Ofertas', price: 19.99, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-lindoya-verao-sem-gas-300-ml.png' },
  { id: 191, name: 'ISOTÔNICO GATORADE LARANJA 500 ML (PCT 6 UN)', category: 'Ofertas', price: 39.50, image: 'https://www.marquesvendaspmg.shop/images/isotonico-gatorade-laranja-500-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 192, name: 'ISOTÔNICO GATORADE LIMÃO 500 ML (PCT 6 UN)', category: 'Ofertas', price: 39.50, image: 'https://www.marquesvendaspmg.shop/images/isotonico-gatorade-limao-500-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 193, name: 'ISOTÔNICO GATORADE MORANGO COM MARACUJÁ 500 ML (PCT 6 UN)', category: 'Ofertas', price: 39.50, image: 'https://www.marquesvendaspmg.shop/images/isotonico-gatorade-morango-com-maracuja-500-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 1254, name: 'CEBOLA GRAÚDA NACIONAL (SC 20 KILO)', category: 'Ofertas', price: 103.99, image: 'https://www.marquesvendaspmg.shop/images/cebola-grauda-nacional-sc-18-kilo-pmg-atacadista.jpg' },
  { id: 261, name: 'SUCO GUARAVITON AÇAÍ 500 ML (PCT 12 UN)', category: 'Ofertas', price: 33.50, image: 'https://www.marquesvendaspmg.shop/images/suco-guaraviton-acai-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 923, name: 'REQUEIJÃO TRÊS MARIAS SEM AMIDO 1,5 KILO', category: 'Ofertas', price: 38.99, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tres-marias-sem-amido-18-kilo-pmg-atacadista.jpg' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
