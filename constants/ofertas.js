// constants/ofertas.js
export const featuredProducts = [
  { id: 2898, name: 'CALABRESA RETA CHULETÃO 3 KILO', category: 'Ofertas', price: 50.99, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-chuletao-3-kg-cx-6-pct.png' },
  { id: 2899, name: 'CARNE MOÍDA BOVINA CONGELADA CHULETÃO 500 G', category: 'Ofertas', price: 8.30, image: 'https://www.marquesvendaspmg.shop/images/carne-moida-bovina-congelada-chuletao-500-g-cx-20-pct.png' },
  { id: 2911, name: 'HAMBÚRGUER MÉDIO DE CARNE DE FRANGO E CARNE BOVINA CHULETÃO 90 G (CX 36 UN)', category: 'Ofertas', price: 44.30, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-medio-de-carne-de-frango-e-carne-bovina-chuletao-90-g-cx-36-un.png' },
  { id: 2914, name: 'HAMBÚRGUER PEQUENO DE CARNE DE FRANGO E CARNE BOVINA CHULETÃO 56 G (CX 36 UN)', category: 'Ofertas', price: 27.50, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-pequeno-de-carne-de-frango-e-carne-bovina-chuletao-56-g-cx-36-un.png' },
  { id: 2922, name: 'PEITO DE FRANGO CONGELADO EM BIFES ALFAMA 2 KILO (CX 3 PCT)', category: 'Ofertas', price: 109.00, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-congelado-em-bifes-alfama-2-kg-cx-3-pct.webp' },
  { id: 2919, name: 'MOLHO DE PIMENTA SWEET CHILLI JUNIOR 1,1 KILO', category: 'Ofertas', price: 21.10, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-sweet-chilli-junior-11-kg-cx-5-bag.webp' },
  { id: 2916, name: 'KIBE DE CARNE BOVINA CONGELADO CONDESSA 1 KILO', category: 'Ofertas', price: 18.99, image: 'https://www.marquesvendaspmg.shop/images/kibe-de-carne-bovina-congelado-condessa-1-kg-cx-10-pct.png' },
  { id: 2907, name: 'FILÉ DE POLACA EMPANADO CONGELADO SEARA 1,2 KILO (CX 3 PCT)', category: 'Ofertas', price: 217.89, image: 'https://www.marquesvendaspmg.shop/images/file-de-polaca-empanado-congelado-seara-12-kg-cx-3-pct.png' },
  { id: 2897, name: 'ALMÔNDEGA BOVINA CONGELADA CONDESSA 1 KILO', category: 'Ofertas', price: 18.30, image: 'https://www.marquesvendaspmg.shop/images/almondega-bovina-congelada-condessa-1-kg-cx-10-pct.png' },
  { id: 2908, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO TEMPERADO E EMPANADO SEARA 2 KILO (CX 4 PCT)', category: 'Ofertas', price: 207.55, image: 'https://www.marquesvendaspmg.shop/images/filezinho-sassami-de-frango-congelado-temperado-e-empanado-seara-2-kg-cx-4-pct.png' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
