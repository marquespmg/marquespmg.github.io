// constants/ofertas.js
export const featuredProducts = [
  { id: 3071, name: 'CHESTER INTEIRO CONGELADO TEMPERADO PERDIGÃO 4 KG', category: 'Ofertas', price: 36.85, image: 'https://www.marquesvendaspmg.shop/images/chester-inteiro-congelado-temperado-perdigao-4-kg-cx-6-pc.jpg', gtin: '7891515195274' },
  { id: 3088, name: 'PERU CONGELADO TEMPERADO SADIA 5 KG', category: 'Ofertas', price: 37.35, image: 'https://www.marquesvendaspmg.shop/images/peru-congelado-temperado-sadia-5-kg-cx-4-pc.webp', gtin: '7893000029927' },
  { id: 3089, name: 'TENDER SEM OSSO DEFUMADO SADIA 1 KG', category: 'Ofertas', price: 78.80, image: 'https://www.marquesvendaspmg.shop/images/tender-sem-osso-defumado-sadia-1-kg-cx-7-pct.webp', gtin: '7893000001121' },
  { id: 3072, name: 'COSTELINHA SUÍNA COZIDA TEMPERADA SEM OSSO COM MOLHO BBQ ZIPPY FOODS 1,01 KILO', category: 'Ofertas', price: 72.99, image: 'https://www.marquesvendaspmg.shop/images/costelinha-suina-cozida-temperada-sem-osso-com-molho-bbq-zippy-foods-101-kg-cx-10-pct.webp', gtin: '0070341229088' },
  { id: 1584, name: 'FRUTAS CRISTALIZADAS BRASILSECO 1 KILO', category: 'Ofertas', price: 21.55, image: 'https://www.marquesvendaspmg.shop/images/frutas-cristalizadas-brasilseco-1-kilo-pmg-atacadista.jpg', gtin: '7898632341317' },
  { id: 1624, name: 'NOZES MARIPOSA LERYC 1 KILO', category: 'Ofertas', price: 73.50, image: 'https://www.marquesvendaspmg.shop/images/nozes-mariposa-leryc-1-kilo-pmg-atacadista.jpg', gtin: '7898960431162' },
  { id: 1580, name: 'DAMASCO TURCO BRASILSECO 1 KILO', category: 'Ofertas', price: 111.66, image: 'https://www.marquesvendaspmg.shop/images/damasco-turco-brasilseco-1-kilo-pmg-atacadista.jpg', gtin: '7898960431056' },
  { id: 1470, name: 'ABACAXI EM CALDA RODELAS TOZZI 400 G', category: 'Ofertas', price: 15.55, image: 'https://www.marquesvendaspmg.shop/images/abacaxi-em-calda-rodelas-tozzi-400-g-pmg-atacadista.jpg', gtin: '7898909755380' },
  { id: 1495, name: 'AMEIXA EM CALDA TOZZI 400 G', category: 'Ofertas', price: 12.25, image: 'https://www.marquesvendaspmg.shop/images/ameixa-em-calda-tozzi-400-g-pmg-atacadista.jpg', gtin: '7898909755533' },
  { id: 1583, name: 'FIGO EM CALDA TOZZI 400 G', category: 'Ofertas', price: 12.99, image: 'https://www.marquesvendaspmg.shop/images/figo-em-calda-tozzi-400-g-pmg-atacadista.jpg', gtin: '7898909755014' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
