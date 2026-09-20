// constants/ofertas.js
export const featuredProducts = [
  { id: 1222, name: 'CAFÉ EXTRA FORTE ALMOFADA SELETO 500 G (FDO 10 PCT)', category: 'Ofertas', price: 196.00, image: 'https://www.marquesvendaspmg.shop/images/cafe-extra-forte-almofada-seleto-500-g-fdo-10-pct-pmg-atacadista.jpg', gtin: '7896053600013' },
  { id: 1229, name: 'CAFÉ TRADICIONAL ALMOFADA SELETO 500 G (FDO 10 PCT)', category: 'Ofertas', price: 196.00, image: 'https://www.marquesvendaspmg.shop/images/cafe-tradicional-almofada-seleto-500-g-fdo-10-pct-pmg-atacadista.jpg', gtin: '7896053600044' },
  { id: 1121, name: 'AZEITE DE OLIVA EXTRA VIRGEM COCINERO 500 ML', category: 'Ofertas', price: 23.15, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-extra-virgem-cocinero-500-ml-pmg-atacadista.jpg', gtin: '7790070218216' },
  { id: 1439, name: 'ATUM PEDAÇOS EM ÓLEO POUCH COQUEIRO 480 G', category: 'Ofertas', price: 29.31, image: 'https://www.marquesvendaspmg.shop/images/atum-pedacos-em-oleo-pouch-coqueiro-480-g-pmg-atacadista.jpg', gtin: '7896009301209' },
  { id: 1454, name: 'ATUM RALADO EM ÓLEO POUCH COQUEIRO 480 G', category: 'Ofertas', price: 22.90, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-pouch-coqueiro-480-g-pmg-atacadista.jpg', gtin: '7896009301216' },
  { id: 2970, name: 'BATATA PALITO CONGELADA PRÉ FRITA 10 MM CORTE TRADICIONAL SIMPLOT 2,5 KILO (CX 6 PCT)', category: 'Ofertas', price: 176.05, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-10-mm-corte-tradicional-simplot-25-kg-cx-6-pct.webp', gtin: '5412588061079' },
  { id: 2971, name: 'CARNE MOÍDA BOVINA E VEGETAL CONGELADA SEARA 1 KILO', category: 'Ofertas', price: 24.91, image: 'https://www.marquesvendaspmg.shop/images/carne-moida-bovina-e-vegetal-congelada-seara-1-kg-cx-5-pct.png', gtin: '7894904608225' },
  { id: 2975, name: 'FARINHA DE TRIGO PIZZERIA TIPO 1 ANACONDA 5 KILO (FDO 25 KILO)', category: 'Ofertas', price: 312.65, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizzeria-tipo-1-anaconda-5-kg-fdo-25-kg.png', gtin: '7896419471196' },
  { id: 2980, name: 'MOLHO AMERICANO CHICKEN ZAFRÁN 1,1 KILO', category: 'Ofertas', price: 37.64, image: 'https://www.marquesvendaspmg.shop/images/molho-americano-chicken-zafran-11-kg-cx-05-bag.png', gtin: '7898615177087' },
  { id: 2979, name: 'FRANGO A PASSARINHO CONGELADO TEMPERADO ADORO 1 KILO (CX 20 PCT)', category: 'Ofertas', price: 183.15, image: 'https://www.marquesvendaspmg.shop/images/frango-a-passarinho-congelado-temperado-adoro-1-kg-cx-20-pct.webp', gtin: '7897560912491' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
