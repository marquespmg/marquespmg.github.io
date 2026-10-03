// constants/ofertas.js
export const featuredProducts = [
  { id: 2987, name: 'CARNE MOÍDA BOVINA CONGELADA PATINHO PUMBA 1 KILO', category: 'Ofertas', price: 23.50, image: 'https://www.marquesvendaspmg.shop/images/carne-moida-bovina-congelada-patinho-pumba-1-kg-cx-12-pct.png', gtin: '0637850035113' },
  { id: 2995, name: 'MAIONESE EKMA 2,5 KILO', category: 'Ofertas', price: 18.60, image: 'https://www.marquesvendaspmg.shop/images/maionese-ekma-25-kg-cx-6-bag.png', gtin: '7896455003320' },
  { id: 2998, name: 'MOLHO AMERICANO EKMA 1,1 KILO', category: 'Ofertas', price: 18.60, image: 'https://www.marquesvendaspmg.shop/images/molho-americano-ekma-11-kg-cx-6-bag.png', gtin: '7896455003924' },
  { id: 2999, name: 'MOLHO CHEDDAR EKMA 1,1 KILO', category: 'Ofertas', price: 18.60, image: 'https://www.marquesvendaspmg.shop/images/molho-cheddar-ekma-11-kg-cx-6-bag.png', gtin: '7896455003948' },
  { id: 2320, name: 'MACARRÃO ESPAGUETE Nº 8 COM OVOS CAMIL 500 G (FDO 30 PCT)', category: 'Ofertas', price: 79, image: 'https://www.marquesvendaspmg.shop/images/macarrao-espaguete-8-com-ovos-camil.png', gtin: '7896024210098' },
  { id: 1177, name: 'BATATA CONGELADA PRÉ FRITA NOISETTES MCCAIN 2,5 KILO (CX 4 PCT)', category: 'Ofertas', price: 222.00, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-noisettes-mccain-25-kilo-cx-4-pct-pmg-atacadista.jpg', gtin: '7797906000984' },
  { id: 353, name: 'WHISKY JOHNNIE WALKER BLUE LABEL 750 ML', category: 'Ofertas', price: 998.00, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-blue-label-750-ml-pmg-atacadista.jpg', gtin: '5000267114279' },
  { id: 352, name: 'WHISKY JOHNNIE WALKER BLACK LABEL 12 ANOS 1 L', category: 'Ofertas', price: 172.99, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-black-label-12-anos-1-l-pmg-atacadista.jpg', gtin: '5000267023601' },
  { id: 171, name: 'GIN BEEFEATER 750 ML', category: 'Ofertas', price: 88.00, image: 'https://www.marquesvendaspmg.shop/images/gin-beefeater-750-ml-pmg-atacadista.jpg', gtin: '5000329002537' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
