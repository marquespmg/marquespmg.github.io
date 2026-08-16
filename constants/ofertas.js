// constants/ofertas.js
export const featuredProducts = [
  { id: 2851, name: 'CARNE SECA BOVINA CONGELADA DESFIADA QUALI 1 KILO', category: 'Ofertas', price: 62.99, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-congelada-desfiada-quali-1-kg-cx-6-pct.webp' },
  { id: 2856, name: 'COSTELA BOVINA CONGELADA DESFIADA QUALI 1 KILO', category: 'Ofertas', price: 60.89, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-congelada-desfiada-quali-1-kg-cx-6-pct.webp' },
  { id: 2861, name: 'CUPIM BOVINO CONGELADO DESFIADO QUALI 1 KILO', category: 'Ofertas', price: 65.99, image: 'https://www.marquesvendaspmg.shop/images/cupim-bovino-congelado-desfiado-quali-1-kg-cx-6-pct.webp' },
  { id: 2878, name: 'PEITO DE FRANGO CONGELADO COZIDO DESFIADO QUALI 1 KILO (CX 15 PCT)', category: 'Ofertas', price: 434.89, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-congelado-cozido-desfiado-quali-1-kg-cx-15-pct.webp' },
  { id: 2879, name: 'PERNIL SUÍNO CONGELADO DESFIADO QUALI 1 KILO', category: 'Ofertas', price: 35.20, image: 'https://www.marquesvendaspmg.shop/images/pernil-suino-congelado-desfiado-quali-1-kg-cx-6-pct.webp' },
  { id: 2875, name: 'PASTA DE ALHO SANTA MASSA 1,010 KILO', category: 'Ofertas', price: 24.80, image: 'https://www.marquesvendaspmg.shop/images/pasta-de-alho-santa-massa-1010-kg-cx-5-bis.png' },
  { id: 2876, name: 'PATINHO BOVINO CONGELADO EM BIFE ALFAMA 2 KILO', category: 'Ofertas', price: 105.00, image: 'https://www.marquesvendaspmg.shop/images/patinho-bovino-congelado-em-bife-alfama-2-kg-cx-3-pct.webp' },
  { id: 2877, name: 'PATINHO BOVINO CONGELADO EM TIRAS ALFAMA 2 KILO', category: 'Ofertas', price: 99.99, image: 'https://www.marquesvendaspmg.shop/images/patinho-bovino-congelado-em-tiras-alfama-2-kg-cx-3-pct.webp' },
  { id: 2850, name: 'BISTECA DO CONTRA FILÉ BOVINO COM OSSO CONGELADA EM BIFE ALFAMA 2 KILO', category: 'Ofertas', price: 84.80, image: 'https://www.marquesvendaspmg.shop/images/bisteca-do-contra-file-bovino-com-osso-congelada-em-bife-alfama-2-kg-cx-3-pct.webp' },
  { id: 2873, name: 'MORTADELA DEFUMADA SADIA 4 KG', category: 'Ofertas', price: 18.25, image: 'https://www.marquesvendaspmg.shop/images/mortadela-defumada-sadia-4-kg-cx-2-pc.webp' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
