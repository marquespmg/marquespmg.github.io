// constants/ofertas.js
export const featuredProducts = [
  { id: 2801, name: 'APRESUNTADO PIF PAF 3,8 KILO', category: 'Ofertas', price: 48.10, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-pif-paf-38-kg-cx-2-pc.webp' },
  { id: 2827, name: 'GOIABADA CREMOSA FORNEÁVEL PREDILECTA 1 KILO', category: 'Ofertas', price: 16.50, image: 'https://www.marquesvendaspmg.shop/images/goiabada-cremosa-forneavel-predilecta-1-kg-cx-12-bis.webp' },
  { id: 2830, name: 'LOMBO CANADENSE PRIETO 1 KILO', category: 'Ofertas', price: 33.80, image: 'https://www.marquesvendaspmg.shop/images/lombo-canadense-prieto-1-kg-cx-5-kg.webp' },
  { id: 2831, name: 'MILHO CONGELADO ARRICO 2,5 KILO', category: 'Ofertas', price: 33.10, image: 'https://www.marquesvendaspmg.shop/images/milho-congelado-arrico-25-kg-cx-4-pct.webp' },
  { id: 2835, name: 'RECHEIO E COBERTURA SABOR LEITINHO BOM PRINCÍPIO 1,01 KILO', category: 'Ofertas', price: 36.00, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-sabor-leitinho-bom-principio-101-kg-cx-6-bis.webp' },
  { id: 2809, name: 'CHOCOLATE FORNEÁVEL BRANCO BOM PRINCÍPIO 1,01 KILO', category: 'Ofertas', price: 24.99, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-branco-bom-principio-101-kg-cx-6-bis.webp' },
  { id: 2808, name: 'CHOCOLATE FORNEÁVEL AVELÃ BOM PRINCÍPIO 1,01 KILO', category: 'Ofertas', price: 28.50, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-avela-bom-principio-101-kg-cx-6-bis.webp' },
  { id: 2807, name: 'CHOCOLATE FORNEÁVEL AO LEITE BOM PRINCÍPIO 1,01 KILO', category: 'Ofertas', price: 27.50, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-ao-leite-bom-principio-101-kg-cx-6-bis.webp' },
  { id: 1273, name: 'FEIJÃO PRETO TIPO 1 SOLITO 1 KILO (FDO 10 PCT)', category: 'Ofertas', price: 68.00, image: 'https://www.marquesvendaspmg.shop/images/feijao-preto-tipo-1-solito-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1038, name: 'PAIO SUÍNO SEARA 2.5 KILO PCT', category: 'Ofertas', price: 60.50, image: 'https://www.marquesvendaspmg.shop/images/paio-suino-seara-25-kilo-pct-pmg-atacadista.jpg' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
