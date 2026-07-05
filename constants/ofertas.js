// constants/ofertas.js
export const featuredProducts = [
  { id: 1487, name: 'AÇÚCAR REFINADO UNIÃO 1 KILO (FDO 10 PCT)', category: 'Ofertas', price: 39.00, image: 'https://www.marquesvendaspmg.shop/images/acucar-refinado-uniao-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 615, name: 'CHEDDAR FATIADO PROCESSADO 160 FATIAS VIGOR 2,24 KILO', category: 'Ofertas', price: 88.13, image: 'https://www.marquesvendaspmg.shop/images/cheddar-fatiado-processado-160-fatias-vigor-224-kilo-pmg-atacadista.jpg' },
  { id: 1753, name: 'FARINHA DE TRIGO PIZZA SUPREMA BUNGE 5 KILO (FDO 25 KILO)', category: 'Ofertas', price: 75.20, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-suprema-bunge-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 2368, name: 'ACÉM BOVINO CONGELADO EM CUBOS ALFAMA 2 KILO', category: 'Ofertas', price: 80.40, image: 'https://www.marquesvendaspmg.shop/images/acem-bovino-congelado-em-cubos-alfama-2-kg-cx-3-pct.webp' },
  { id: 2485, name: 'COSTELA BOVINA COM OSSO CONGELADA EM CUBOS ALFAMA 2 KILO', category: 'Ofertas', price: 72.37, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-com-osso-congelada-em-cubos-alfama-2-kg-cx-3-pct.webp' },
  { id: 2549, name: 'FILÉ MIGNON BOVINO CONGELADO EM CUBOS ALFAMA 2 KILO', category: 'Ofertas', price: 195.98, image: 'https://www.marquesvendaspmg.shop/images/file-mignon-bovino-congelado-em-cubos-alfama-2-kg-cx-3-pct.webp' },
  { id: 2649, name: 'PALETA BOVINA CONGELADA EM BIFE ALFAMA 2 KILO', category: 'Ofertas', price: 90.46, image: 'https://www.marquesvendaspmg.shop/images/paleta-bovina-congelada-em-bife-alfama-2-kg-cx-3-pct.webp' },
  { id: 2662, name: 'PATINHO BOVINO CONGELADO EM CUBOS ALFAMA 2 KILO', category: 'Ofertas', price: 94.47, image: 'https://www.marquesvendaspmg.shop/images/patinho-bovino-congelado-em-cubos-alfama-2-kg-cx-3-pct.webp' },
  { id: 2666, name: 'PEITO DE FRANGO CONGELADO EM CUBOS ALFAMA 2 KILO (CX 3 PCT)', category: 'Ofertas', price: 100.49, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-congelado-em-cubos-alfama-2-kg-cx-3-pct.webp' },
  { id: 2667, name: 'PEITO DE FRANGO CONGELADO EM TIRAS ALFAMA 2 KILO (CX 3 PCT)', category: 'Ofertas', price: 100.49, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-congelado-em-tiras-alfama-2-kg-cx-3-pct.webp' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
