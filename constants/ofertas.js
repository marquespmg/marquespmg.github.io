// constants/ofertas.js
export const featuredProducts = [
  { id: 2766, name: 'PIMENTA BIQUINHO PORTO BELLO 2 KILO', category: 'Ofertas', price: 53.00, image: 'https://www.marquesvendaspmg.shop/images/pimenta-biquinho-porto-bello-2-kg-cx-6-bd.webp' },
  { id: 2769, name: 'TOMATE SECO PORTO BELLO 1,4 KILO', category: 'Ofertas', price: 27.30, image: 'https://www.marquesvendaspmg.shop/images/tomate-seco-porto-bello-14-kg-cx-6-bd.webp' },
  { id: 2132, name: 'PRESUNTO FATIADO SEARA 180 G', category: 'Ofertas', price: 8.15, image: 'https://www.marquesvendaspmg.shop/images/presunto-fatiado-seara.png' },
  { id: 2382, name: 'APRESUNTADO FATIADO PAMPLONA 500 G', category: 'Ofertas', price: 12.99, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-fatiado-pamplona-500-g-cx-24-pct.webp' },
  { id: 750, name: 'MUÇARELA LA PAULINA 3.5 KG', category: 'Ofertas', price: 35.99, image: 'https://www.marquesvendaspmg.shop/images/mucarela-la-paulina-35-kg-pmg-atacadista.jpg' },
  { id: 1202, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL MAIS BATATA BEM BRASIL 2 KILO (CX 7 PCT)', category: 'Ofertas', price: 138.99, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-mais-batata-bem-brasil-2-kilo-cx-7-pct-pmg-atacadista.jpg' },
  { id: 1209, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL UAI BEM BRASIL 2 KILO (CX 7 PCT)', category: 'Ofertas', price: 129.99, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-uai-bem-brasil-2-kilo-cx-7-pct-pmg-atacadista.jpg' },
  { id: 52, name: 'ÁGUA MINERAL BUONAVITA COM GÁS 510 ML (PCT 12 UN)', category: 'Ofertas', price: 21.10, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-buonavita-com-gas-510-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 53, name: 'ÁGUA MINERAL BUONAVITA SEM GÁS 510 ML (PCT 12 UN)', category: 'Ofertas', price: 16.30, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-buonavita-sem-gas-510-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 999, name: 'CALABRESA RETA SEARA 2.5 KILO', category: 'Ofertas', price: 51.50, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-seara-25-kilo-pmg-atacadista.jpg' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
