// constants/ofertas.js
export const featuredProducts = [
  { id: 653, name: 'GORGONZOLA FRACIONADO QUATÁ 180 G', category: 'Ofertas', price: 14.96, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-fracionado-quata-180-g-pmg-atacadista.jpg' },
  { id: 658, name: 'GORGONZOLA QUATÁ 3 KG', category: 'Ofertas', price: 66.50, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-quata-3-kg-pmg-atacadista.jpg' },
  { id: 825, name: 'QUEIJO COALHO BARRA QUATÁ 7 KG', category: 'Ofertas', price: 65.00, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-barra-quata-7-kg-pmg-atacadista.jpg' },
  { id: 829, name: 'QUEIJO COALHO ESPETO QUATÁ PCT 7 UN', category: 'Ofertas', price: 21.38, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-espeto-quata-pct-7-un-pmg-atacadista.jpg' },
  { id: 842, name: 'QUEIJO GOUDA QUATÁ 3 KG', category: 'Ofertas', price: 81.00, image: 'https://www.marquesvendaspmg.shop/images/queijo-gouda-quata-3-kg-pmg-atacadista.jpg' },
  { id: 902, name: 'REQUEIJÃO QUATÁ SEM AMIDO 1,5 KILO', category: 'Ofertas', price: 42.30, image: 'https://www.marquesvendaspmg.shop/images/requeijao-quata-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 2065, name: 'PARMESÃO 6 MESES QUATÁ 5.5 KG', category: 'Ofertas', price: 83.55, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-quata.png' },
  { id: 383, name: 'EXTRATO DE TOMATE ELEFANTE 1,7 KILO', category: 'Ofertas', price: 28.00, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-elefante-17-kilo-pmg-atacadista.jpg' },
  { id: 1928, name: 'EXTRATO DE TOMATE GRANDE ELEFANTE 4,08 KILO', category: 'Ofertas', price: 70.50, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-grande-elefante-408-kilo.png' },
  { id: 1290, name: 'MAIONESE GRANDE MARIANA 3 KILO', category: 'Ofertas', price: 24.50, image: 'https://www.marquesvendaspmg.shop/images/maionese-grande-mariana-3-kilo-pmg-atacadista.jpg' },
  { id: 1356, name: 'ÓLEO DE ALGODÃO LIZA (BD 15,8 L)', category: 'Ofertas', price: 205.00, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-algodao-liza-bd-158-l-pmg-atacadista.jpg' },
  { id: 1364, name: 'ÓLEO DE SOJA LIZA 900 ML (PCT 6 FR)', category: 'Ofertas', price: 47.80, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-liza-900-ml-pmg-atacadista.jpg' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
