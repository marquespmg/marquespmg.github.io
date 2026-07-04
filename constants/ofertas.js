// constants/ofertas.js
export const featuredProducts = [
  { id: 2180, name: 'FEIJÃO CARIOCA TIPO 1 BIG VALLEY 1 KILO (FDO 10 PCT)', category: 'Ofertas', price: 84.99, image: 'https://www.marquesvendaspmg.shop/images/feijao-carioca-tipo-1-big-valley.png' },
  { id: 1487, name: 'AÇÚCAR REFINADO UNIÃO 1 KILO (FDO 10 PCT)', category: 'Ofertas', price: 39.00, image: 'https://www.marquesvendaspmg.shop/images/acucar-refinado-uniao-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1224, name: 'CAFÉ EXTRA FORTE ALMOFADA UNIÃO 500 G (CX 10 PCT)', category: 'Ofertas', price: 242.00, image: 'https://www.marquesvendaspmg.shop/images/cafe-extra-forte-almofada-uniao-500-g-cx-10-pct-pmg-atacadista.jpg' },
  { id: 615, name: 'CHEDDAR FATIADO PROCESSADO 160 FATIAS VIGOR 2,24 KILO', category: 'Ofertas', price: 91.99, image: 'https://www.marquesvendaspmg.shop/images/cheddar-fatiado-processado-160-fatias-vigor-224-kilo-pmg-atacadista.jpg' },
  { id: 1201, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL LAMBWESTON 2,5 KILO (CX 6 PCT)', category: 'Ofertas', price: 185.99, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-lambweston-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1753, name: 'FARINHA DE TRIGO PIZZA SUPREMA BUNGE 5 KILO (FDO 25 KILO)', category: 'Ofertas', price: 75.20, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-suprema-bunge-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 922, name: 'REQUEIJÃO TRADICIONAL SOFFICE SEM AMIDO 1,5 KILO', category: 'Ofertas', price: 42.52, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tradicional-soffice-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 970, name: 'BACON PALETA DÁLIA 4.5 KG', category: 'Ofertas', price: 21.25, image: 'https://www.marquesvendaspmg.shop/images/bacon-paleta-dalia-45-kg-kg-pmg-atacadista.jpg' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
