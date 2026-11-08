// constants/ofertas.js
export const featuredProducts = [
  { id: 3071, name: 'CHESTER INTEIRO CONGELADO TEMPERADO PERDIGÃO 4 KG', category: 'Ofertas', price: 36.85, image: 'https://www.marquesvendaspmg.shop/images/chester-inteiro-congelado-temperado-perdigao-4-kg-cx-6-pc.jpg', gtin: '7891515195274' },
  { id: 3088, name: 'PERU CONGELADO TEMPERADO SADIA 5 KG', category: 'Ofertas', price: 37.35, image: 'https://www.marquesvendaspmg.shop/images/peru-congelado-temperado-sadia-5-kg-cx-4-pc.webp', gtin: '7893000029927' },
  { id: 3089, name: 'TENDER SEM OSSO DEFUMADO SADIA 1 KG', category: 'Ofertas', price: 78.80, image: 'https://www.marquesvendaspmg.shop/images/tender-sem-osso-defumado-sadia-1-kg-cx-7-pct.webp', gtin: '7893000001121' },
  { id: 3096, name: 'KIT FRANGO INTEIRO CONGELADO TEMPERADO SEARA FIESTA COM BOLSA 3,2 KILO', category: 'Ofertas', price: 102.50, image: 'https://www.marquesvendaspmg.shop/images/kit-frango-inteiro-congelado-temperado-seara-fiesta-com-bolsa-32-kg-cx-2-un.jpg', gtin: '7894904609512' },
  { id: 2668, name: 'PERNIL SUÍNO CONGELADO SEM OSSO E SEM COURO TCHÊ 12 KG', category: 'Ofertas', price: 14.88, image: 'https://www.marquesvendaspmg.shop/images/pernil-suino-congelado-sem-osso-e-sem-couro-tche-12-kg-cx-23-kg.webp', gtin: '7898665250945' },
  { id: 1026, name: 'LOMBO SUÍNO CONGELADO TEMPERADO PAMPLONA  1 KG', category: 'Ofertas', price: 31.50, image: 'https://www.marquesvendaspmg.shop/images/lombo-suino-congelado-temperado-pamplona-1-kg-pmg-atacadista.jpg', gtin: '7896716301257' },
  { id: 1004, name: 'COSTELA SUÍNA CONGELADA COM OSSO AURORA 1.5 KG', category: 'Ofertas', price: 33.50, image: 'https://www.marquesvendaspmg.shop/images/costela-suina-congelada-com-osso-aurora-15-kg-pmg-atacadista.jpg', gtin: '7891164001087' },
  { id: 1516, name: 'CEREJA MARRASQUINO SEM TALO CURICO 1,8 KILO', category: 'Ofertas', price: 113.99, image: 'https://www.marquesvendaspmg.shop/images/cereja-marrasquino-sem-talo-curico-18-kilo-pmg-atacadista.jpg', gtin: '7803911110010' },
  { id: 638, name: 'CREME DE LEITE GRANDE LEVE FOOD SERVICE 17% DE GORDURA ITALAC 1,030 KILO (CX 12 UN)', category: 'Ofertas', price: 165.99, image: 'https://www.marquesvendaspmg.shop/images/creme-de-leite-grande-food-service-italac-1030-kilo-cx-12-un-pmg-atacadista.jpg', gtin: '7898080642363' },
  { id: 2772, name: 'BACALHAU POLACA DO ALASCA SALGADO SECO FILÉ EM PEDAÇOS BRASMAR 5 KILO', category: 'Ofertas', price: 227.00, image: 'https://www.marquesvendaspmg.shop/images/bacalhau-polaca-do-alasca-salgado-seco-file-em-pedacos-brasmar-5-kg-cx-2-pct.webp', gtin: '5606669334859' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
