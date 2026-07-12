// constants/ofertas.js
export const featuredProducts = [
  { id: 2749, name: 'SUCO PEQUENO SUFRESH MARACUJÁ 200 ML (CX 27 UN)', category: 'Ofertas', price: 70.99, image: 'https://www.marquesvendaspmg.shop/images/suco-pequeno-sufresh-maracuja-200-ml-cx-27-un.webp' },
  { id: 2750, name: 'SUCO PEQUENO SUFRESH UVA 200 ML (CX 27 UN)', category: 'Ofertas', price: 70.99, image: 'https://www.marquesvendaspmg.shop/images/suco-pequeno-sufresh-uva-200-ml-cx-27-un.webp' },
  { id: 2751, name: 'SUCO SUFRESH MARACUJÁ LATA 265 ML (PCT 12 LT)', category: 'Ofertas', price: 53.67, image: 'https://www.marquesvendaspmg.shop/images/suco-sufresh-maracuja-lata-265-ml-pct-12-lt.webp' },
  { id: 2752, name: 'SUCO SUFRESH UVA LATA 265 ML (PCT 12 LT)', category: 'Ofertas', price: 53.67, image: 'https://www.marquesvendaspmg.shop/images/suco-sufresh-uva-lata-265-ml-pct-12-lt.webp' },
  { id: 2745, name: 'ÓLEO DE SOJA FRY 300 COAMO (BD 15,8 L)', category: 'Ofertas', price: 147, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-fry-300-coamo-bd-158-l.webp' },
  { id: 1282, name: 'GORDURA VEGETAL FRY 400 COAMO (BD 14,5 KILO)', category: 'Ofertas', price: 159.99, image: 'https://www.marquesvendaspmg.shop/images/gordura-vegetal-fry-400-coamo-bd-145-kilo-pmg-atacadista.jpg' },
  { id: 1124, name: 'AZEITE DE OLIVA GRANDE EXTRA VIRGEM GALLO 5 L', category: 'Ofertas', price: 263.00, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-grande-extra-virgem-gallo-5-l-cx-2-gl-pmg-atacadista.jpg' },
  { id: 1571, name: 'CREME DE AVELÃ GRANDE COM CACAU FOOD SERVICE NUTELLA 3 KILO', category: 'Ofertas', price: 202.99, image: 'https://www.marquesvendaspmg.shop/images/creme-de-avela-grande-com-cacau-food-service-nutella-3-kilo-pmg-atacadista.jpg' },
  { id: 1562, name: 'COBERTURA PARA SORVETE CHOCOLATE MARVI 1,01 KILO', category: 'Ofertas', price: 26.9, image: 'https://www.marquesvendaspmg.shop/images/cobertura-para-sorvete-chocolate-marvi-101-kilo-pmg-atacadista.jpg' },
  { id: 1564, name: 'COBERTURA PARA SORVETE MORANGO MARVI 1 KILO', category: 'Ofertas', price: 19.40, image: 'https://www.marquesvendaspmg.shop/images/cobertura-para-sorvete-morango-marvi-1-kilo-pmg-atacadista.jpg' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
