// constants/ofertas.js
export const featuredProducts = [
  { id: 2853, name: 'CHEDDAR FORTUNATA CREMOSO RECHEIO 1,010 KILO', category: 'Ofertas', price: 13.93, image: 'https://www.marquesvendaspmg.shop/images/cheddar-fortunata-cremoso-recheio-1010-kg-cx-8-bis.png' },
  { id: 2882, name: 'REQUEIJÃO FORTUNATA CREMOSO RECHEIO 1,010 KILO', category: 'Ofertas', price: 13.62, image: 'https://www.marquesvendaspmg.shop/images/requeijao-fortunata-cremoso-recheio-1010-kg-cx-8-bis.webp' },
  { id: 1222, name: 'CAFÉ EXTRA FORTE ALMOFADA SELETO 500 G (FDO 10 PCT)', category: 'Ofertas', price: 197.44, image: 'https://www.marquesvendaspmg.shop/images/cafe-extra-forte-almofada-seleto-500-g-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1229, name: 'CAFÉ TRADICIONAL ALMOFADA SELETO 500 G (FDO 10 PCT)', category: 'Ofertas', price: 197.44, image: 'https://www.marquesvendaspmg.shop/images/cafe-tradicional-almofada-seleto-500-g-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1224, name: 'CAFÉ EXTRA FORTE ALMOFADA UNIÃO 500 G (CX 10 PCT)', category: 'Ofertas', price: 233.03, image: 'https://www.marquesvendaspmg.shop/images/cafe-extra-forte-almofada-uniao-500-g-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1230, name: 'CAFÉ TRADICIONAL ALMOFADA UNIÃO 500 G (CX 10 PCT)', category: 'Ofertas', price: 233.03, image: 'https://www.marquesvendaspmg.shop/images/cafe-tradicional-almofada-uniao-500-g-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1121, name: 'AZEITE DE OLIVA EXTRA VIRGEM COCINERO 500 ML', category: 'Ofertas', price: 23.15, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-extra-virgem-cocinero-500-ml-pmg-atacadista.jpg' },
  { id: 1446, name: 'ATUM PEQUENO RALADO EM ÓLEO PESCADOR 140 G (CX 24 LT)', category: 'Ofertas', price: 170.53, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-ralado-em-oleo-pescador-140-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1450, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO PESCADOR 140 G (CX 24 LT)', category: 'Ofertas', price: 221.47, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-solido-em-oleo-pescador-140-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 2234, name: 'SARDINHAS EM ÓLEO PESCADOR 125 G (CX 54 LT)', category: 'Ofertas', price: 289.95, image: 'https://www.marquesvendaspmg.shop/images/sardinhas-em-oleo-pescador.png' },
  { id: 1439, name: 'ATUM PEDAÇOS EM ÓLEO POUCH COQUEIRO 480 G', category: 'Ofertas', price: 29.31, image: 'https://www.marquesvendaspmg.shop/images/atum-pedacos-em-oleo-pouch-coqueiro-480-g-pmg-atacadista.jpg' },
  { id: 1444, name: 'ATUM PEQUENO RALADO EM ÓLEO COQUEIRO 170 G (CX 24 LT)', category: 'Ofertas', price: 200.32, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-ralado-em-oleo-coqueiro-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1448, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO COQUEIRO 170 G (CX 24 LT)', category: 'Ofertas', price: 265.03, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-solido-em-oleo-coqueiro-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1468, name: 'SARDINHAS EM ÓLEO COQUEIRO 125 G (CX 54 LT)', category: 'Ofertas', price: 321.84, image: 'https://www.marquesvendaspmg.shop/images/sardinhas-em-oleo-coqueiro-125-g-cx-54-lt-pmg-atacadista.jpg' },
  { id: 2587, name: 'MACARRÃO CARACOLINO COM OVOS SANTA AMÁLIA 500 G (FDO 20 PCT)', category: 'Ofertas', price: 72.04, image: 'https://www.marquesvendaspmg.shop/images/macarrao-caracolino-com-ovos-santa-amalia-500-g-fdo-20-pct.webp' },
  { id: 2591, name: 'MACARRÃO NINHO TALHARINE COM OVOS SANTA AMÁLIA 500 G (FDO 20 PCT)', category: 'Ofertas', price: 97.81, image: 'https://www.marquesvendaspmg.shop/images/macarrao-ninho-talharine-com-ovos-santa-amalia-500-g-fdo-20-pct.webp' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
