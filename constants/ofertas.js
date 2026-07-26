// constants/ofertas.js
export const featuredProducts = [
  { id: 978, name: 'CALABRESA AURORA 5 KILO', category: 'Ofertas', price: 106.99, image: 'https://www.marquesvendaspmg.shop/images/calabresa-aurora-5-kilo-pmg-atacadista.jpg' },
  { id: 1065, name: 'PRESUNTO SEARA 3.5 KILO PÇ', category: 'Ofertas', price: 86.00, image: 'https://www.marquesvendaspmg.shop/images/presunto-seara-35-kilo-pc-pmg-atacadista.jpg' },
  { id: 2793, name: 'TEMPERO ALHO E SAL FOOD SERVICE QUERO 1,01 KILO', category: 'Ofertas', price: 14.90, image: 'https://www.marquesvendaspmg.shop/images/tempero-alho-e-sal-food-service-quero-101-kg-cx-6-pt.webp' },
  { id: 2794, name: 'TEMPERO COMPLETO COM PIMENTA FOOD SERVICE QUERO 1,01 KILO', category: 'Ofertas', price: 14.90, image: 'https://www.marquesvendaspmg.shop/images/tempero-completo-com-pimenta-food-service-quero-101-kg-cx-6-pt.webp' },
  { id: 2795, name: 'TEMPERO COMPLETO SEM PIMENTA FOOD SERVICE QUERO 1,01 KILO', category: 'Ofertas', price: 14.90, image: 'https://www.marquesvendaspmg.shop/images/tempero-completo-sem-pimenta-food-service-quero-101-kg-cx-6-pt.webp' },
  { id: 2790, name: 'PARMESÃO 9 MESES EL MAESTRO 7 KG', category: 'Ofertas', price: 69.60, image: 'https://www.marquesvendaspmg.shop/images/parmesao-9-meses-el-maestro-7-kg-cx-2-pc.webp' },
  { id: 2780, name: 'CREME DE LEITE LEVE 15% DE GORDURA LIDER 200 G (CX 27 UN)', category: 'Ofertas', price: 73.00, image: 'https://www.marquesvendaspmg.shop/images/creme-de-leite-leve-15-de-gordura-lider-200-g-cx-27-un.webp' },
  { id: 2038, name: 'LEITE INTEGRAL LIDER 1 L (CX 12 UN)', category: 'Ofertas', price: 73.99, image: 'https://www.marquesvendaspmg.shop/images/leite-integral-lider.png' },
  { id: 2765, name: 'ITUBAÍNA TUTTI FRUTTI RETRÔ ZERO LATA 350 ML (PCT 12 LT)', category: 'Ofertas', price: 42.50, image: 'https://www.marquesvendaspmg.shop/images/itubaina-tutti-frutti-retro-zero-lata-350-ml-pct-12-lt.webp' },
  { id: 2754, name: 'ALCATRA BOVINA CONGELADA EM BIFE ALFAMA 2 KILO', category: 'Ofertas', price: 103.00, image: 'https://www.marquesvendaspmg.shop/images/alcatra-bovina-congelada-em-bife-alfama-2-kg-cx-3-pct.webp' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
