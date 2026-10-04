// constants/ofertas.js
export const featuredProducts = [
  { id: 3004, name: 'ATUM RALADO EM ÓLEO FALANI 400 G', category: 'Ofertas', price: 17.99, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-falani-400-g-cx-24-lt.png', gtin: '7898111555181' },
  { id: 3005, name: 'CALABRESA FATIADA RESFRIADA AURORA 1 KILO', category: 'Ofertas', price: 33.80, image: 'https://www.marquesvendaspmg.shop/images/calabresa-fatiada-resfriada-aurora-1-kg-cx-10-pct.png', gtin: '7891164005931' },
  { id: 3006, name: 'CARNE BOVINA CONGELADA EM ISCAS SLICE ALFAMA 2 KILO', category: 'Ofertas', price: 97.05, image: 'https://www.marquesvendaspmg.shop/images/carne-bovina-congelada-em-iscas-slice-alfama-2-kg-cx-3-pct.webp', gtin: '7898978666082' },
  { id: 3014, name: 'HAMBÚRGUER DE CARNE SUÍNA SABOR DEFUMADO FRIMESA 120 G (CX 40 UN)', category: 'Ofertas', price: 119.99, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-de-carne-suina-sabor-defumado-frimesa-120-g-cx-40-un.png', gtin: '7896275987084' },
  { id: 160, name: 'ESPUMANTE BRANCO MOSCATEL SALTON 750 ML (CX 6 UN)', category: 'Ofertas', price: 158.15, image: 'https://www.marquesvendaspmg.shop/images/espumante-branco-moscatel-salton-750-ml-pmg-atacadista.jpg', gtin: '7896023082634' },
  { id: 161, name: 'ESPUMANTE BRANCO NATURAL BRUT SALTON 750 ML (CX 6 UN)', category: 'Ofertas', price: 158.15, image: 'https://www.marquesvendaspmg.shop/images/espumante-branco-natural-brut-salton-750-ml-pmg-atacadista.jpg', gtin: '7896023082993' },
  { id: 162, name: 'ESPUMANTE CHANDON BABY BRUT ROSÉ 187 ML', category: 'Ofertas', price: 32.30, image: 'https://www.marquesvendaspmg.shop/images/espumante-chandon-baby-brut-rose-187-ml-pmg-atacadista.jpg', gtin: '7891083611442' },
  { id: 165, name: 'ESPUMANTE CHANDON RÉSERVE BRUT 750 ML (CX 6 UN)', category: 'Ofertas', price: 490.88, image: 'https://www.marquesvendaspmg.shop/images/espumante-chandon-reserve-brut-750-ml-pmg-atacadista.jpg', gtin: '7891083611138' },
  { id: 52, name: 'ÁGUA MINERAL BUONAVITA COM GÁS 510 ML (PCT 12 UN)', category: 'Ofertas', price: 20.55, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-buonavita-com-gas-510-ml-pct-12-un-pmg-atacadista.jpg', gtin: '7898641870648' },
  { id: 53, name: 'ÁGUA MINERAL BUONAVITA SEM GÁS 510 ML (PCT 12 UN)', category: '⏳ Ofertas da Semana 🚨', price: 15.35, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-buonavita-sem-gas-510-ml-pct-12-un-pmg-atacadista.jpg', gtin: '7898641870228' },
  { id: 1905, name: 'ÁGUA MINERAL LINDOYA VERÃO COM GÁS 300 ML (PCT 12 UN)', category: 'Ofertas', price: 19.99, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-lindoya-verao-com-gas-300-ml.png', gtin: '7896089500134' },
  { id: 1906, name: 'ÁGUA MINERAL LINDOYA VERÃO SEM GÁS 300 ML (PCT 12 UN)', category: 'Ofertas', price: 19.99, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-lindoya-verao-sem-gas-300-ml.png' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
