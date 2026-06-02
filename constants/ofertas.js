// constants/ofertas.js
export const featuredProducts = [
  { id: 507, name: 'PEITO DE FRANGO CONGELADO COZIDO DESFIADO ALFAMA 1 KILO (CX 6 PCT)', category: 'Ofertas', price: 189.00, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-congelado-cozido-desfiado-alfama-1-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 527, name: 'CARNE DE SOL BOVINA CONGELADA DESFIADA ALFAMA 1 KG', category: 'Ofertas', price: 58.69, image: 'https://www.marquesvendaspmg.shop/images/carne-de-sol-bovina-congelada-desfiada-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 529, name: 'CARNE MOÍDA BOVINA CONGELADA ALFAMA 1 KILO', category: 'Ofertas', price: 28.14, image: 'https://www.marquesvendaspmg.shop/images/carne-moida-bovina-congelada-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 533, name: 'CARNE SECA BOVINA CONGELADA DESFIADA ALFAMA 1 KILO', category: 'Ofertas', price: 63.90, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-congelada-desfiada-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 546, name: 'COSTELA BOVINA CONGELADA DESFIADA ALFAMA 1 KILO', category: 'Ofertas', price: 63.90, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-congelada-desfiada-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 556, name: 'CUPIM BOVINO CONGELADO DESFIADO ALFAMA 1 KILO', category: 'Ofertas', price: 63.90, image: 'https://www.marquesvendaspmg.shop/images/cupim-bovino-congelado-desfiado-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 1052, name: 'PERNIL SUÍNO CONGELADO DESFIADO ALFAMA 1 KILO PCT', category: 'Ofertas', price: 35.70, image: 'https://www.marquesvendaspmg.shop/images/pernil-suino-congelado-desfiado-alfama-1-kilo-pct-pmg-atacadista.jpg' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
