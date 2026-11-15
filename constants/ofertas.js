// constants/ofertas.js
export const featuredProducts = [
  { id: 3071, name: 'CHESTER INTEIRO CONGELADO TEMPERADO PERDIGÃO 4 KG', category: 'Ofertas', price: 36.85, image: 'https://www.marquesvendaspmg.shop/images/chester-inteiro-congelado-temperado-perdigao-4-kg-cx-6-pc.jpg', gtin: '7891515195274' },
  { id: 3088, name: 'PERU CONGELADO TEMPERADO SADIA 5 KG', category: 'Ofertas', price: 37.35, image: 'https://www.marquesvendaspmg.shop/images/peru-congelado-temperado-sadia-5-kg-cx-4-pc.webp', gtin: '7893000029927' },
  { id: 3089, name: 'TENDER SEM OSSO DEFUMADO SADIA 1 KG', category: 'Ofertas', price: 78.80, image: 'https://www.marquesvendaspmg.shop/images/tender-sem-osso-defumado-sadia-1-kg-cx-7-pct.webp', gtin: '7893000001121' },
  { id: 3096, name: 'KIT FRANGO INTEIRO CONGELADO TEMPERADO SEARA FIESTA COM BOLSA 3,2 KILO', category: 'Ofertas', price: 102.50, image: 'https://www.marquesvendaspmg.shop/images/kit-frango-inteiro-congelado-temperado-seara-fiesta-com-bolsa-32-kg-cx-2-un.jpg', gtin: '7894904609512' },
  { id: 3061, name: 'PÊSSEGO EM CALDA NOBLE NATURE 485 G', category: 'Ofertas', price: 11.99, image: 'https://www.marquesvendaspmg.shop/images/pessego-em-calda-noble-nature-485-g-cx-12-lt.webp', gtin: '7908249331165' },
  { id: 1643, name: 'UVA PASSA PRETA LERYC 1 KILO', category: 'Ofertas', price: 25.30, image: 'https://www.marquesvendaspmg.shop/images/uva-passa-preta-leryc-1-kilo-pmg-atacadista.jpg', gtin: '7898960431087' },
  { id: 818, name: 'PROVOLONETE SCALA 300 G', category: 'Ofertas', price: 29.99, image: 'https://www.marquesvendaspmg.shop/images/provolonete-scala-300-g-pmg-atacadista.jpg', gtin: '7898039680842' },
  { id: 2071, name: 'QUEIJO FRACIONADO BRIE YEMA 125 G', category: 'Ofertas', price: 10.70, image: 'https://www.marquesvendaspmg.shop/images/queijo-brie-yema.png', gtin: '7896425000724' },
  { id: 2679, name: 'QUEIJO BRIE FORMA SÃO VICENTE 1 KILO', category: 'Ofertas', price: 67.30, image: 'https://www.marquesvendaspmg.shop/images/queijo-brie-forma-sao-vicente-1-kg-cx-3-pc.webp', gtin: '7896926700031' },
  { id: 841, name: 'QUEIJO GOUDA BELLA ITÁLIA 3 KG', category: 'Ofertas', price: 59.55, image: 'https://www.marquesvendaspmg.shop/images/queijo-gouda-bella-italia-3-kg-pmg-atacadista.jpg', gtin: '7898264360045' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
