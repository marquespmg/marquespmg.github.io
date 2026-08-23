// constants/ofertas.js
export const featuredProducts = [
  { id: 2895, name: 'VINHO ITALIANO BRANCO SUAVE FRISANTE LAMBRUSCO SOGNO ITALIANO 750 ML', category: 'Ofertas', price: 24.30, image: 'https://www.marquesvendaspmg.shop/images/vinho-italiano-branco-suave-frisante-lambrusco-sogno-italiano-750-ml-cx-6-un.png' },
  { id: 2896, name: 'VINHO ITALIANO TINTO SUAVE FRISANTE LAMBRUSCO SOGNO ITALIANO 750 ML', category: 'Ofertas', price: 24.30, image: 'https://www.marquesvendaspmg.shop/images/vinho-italiano-tinto-suave-frisante-lambrusco-sogno-italiano-750-ml-cx-6-un.png' },
  { id: 2883, name: 'AZEITONA PRETA GRAÚDA 11 X 13 AZAPA ARCOBELLO (BD 2 KILO)', category: 'Ofertas', price: 114.80, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-grauda-11-x-13-azapa-arcobello-bd-2-kg.webp' },
  { id: 2884, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO FAST FOOD BEM BRASIL 2 KILO (CX 6 PCT)', category: 'Ofertas', price: 175.99, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-fast-food-bem-brasil-2-kg-cx-6-pct.jpg' },
  { id: 2853, name: 'CHEDDAR FORTUNATA CREMOSO RECHEIO 1,010 KILO', category: 'Ofertas', price: 17.99, image: 'https://www.marquesvendaspmg.shop/images/cheddar-fortunata-cremoso-recheio-1010-kg-cx-8-bis.png' },
  { id: 2882, name: 'REQUEIJÃO FORTUNATA CREMOSO RECHEIO 1,010 KILO', category: 'Ofertas', price: 17.99, image: 'https://www.marquesvendaspmg.shop/images/requeijao-fortunata-cremoso-recheio-1010-kg-cx-8-bis.webp' },
  { id: 1908, name: 'CHÁ MATTE LEÃO NATURAL TOSTADO A GRANEL 250 G (CX 10 UN)', category: 'Ofertas', price: 74.30, image: 'https://www.marquesvendaspmg.shop/images/cha-matte-leao-natural-tostado-a-granel-250-g.png' },
  { id: 1909, name: 'CHÁ MATTE LEÃO SOLÚVEL NATURAL 1 KILO', category: 'Ofertas', price: 33.60, image: 'https://www.marquesvendaspmg.shop/images/cha-matte-leao-soluvel-natural-1-kilo.png' },
  { id: 2849, name: 'BATATA PALITO DOCE CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL FARM FRITES 2 KILO (CX 5 PCT)', category: 'Ofertas', price: 378.00, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-doce-congelada-pre-frita-9-mm-corte-tradicional-farm-frites-2-kg-cx-5-pct.png' },
  { id: 319, name: 'VINHO NACIONAL TINTO SUAVE COUNTRY WINE 750 ML (CX 6 UN)', category: 'Ofertas', price: 85.00, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-suave-country-wine-750-ml-pmg-atacadista.jpg' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
