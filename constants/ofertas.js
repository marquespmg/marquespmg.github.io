// constants/ofertas.js
export const featuredProducts = [
  { id: 421, name: 'MOLHO DE TOMATE TRADICIONAL POMAROLA 1,7 KILO (CX 6 BAG)', category: 'Ofertas', price: 79.00, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-tradicional-pomarola-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 1416, name: 'TOMATE TRITURADO POMAROLA 1,7 KILO (CX 6 BAG)', category: 'Ofertas', price: 93.39, image: 'https://www.marquesvendaspmg.shop/images/tomate-triturado-pomarola-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 1118, name: 'AZEITE COMPOSTO 12% OLIVA E 88% SOJA MARIA 500 ML', category: 'Ofertas', price: 17.00, image: 'https://www.marquesvendaspmg.shop/images/azeite-composto-oliva-e-soja-maria-500-ml-pmg-atacadista.jpg' },
  { id: 1365, name: 'ÓLEO DE SOJA VILA VELHA (GL 18 L)', category: 'Ofertas', price: 150.50, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-vila-velha-gl-18-l-pmg-atacadista.jpg' },
  { id: 353, name: 'WHISKY JOHNNIE WALKER BLUE LABEL 750 ML', category: 'Ofertas', price: 1090.52, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-blue-label-750-ml-pmg-atacadista.jpg' },
  { id: 352, name: 'WHISKY JOHNNIE WALKER BLACK LABEL 12 ANOS 1 L', category: 'Ofertas', price: 174.00, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-black-label-12-anos-1-l-pmg-atacadista.jpg' },
  { id: 354, name: 'WHISKY JOHNNIE WALKER DOUBLE BLACK 1 L', category: 'Ofertas', price: 200.00, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-double-black-1-l-pmg-atacadista.jpg' },
  { id: 356, name: 'WHISKY JOHNNIE WALKER RED LABEL 1 L', category: 'Ofertas', price: 85.50, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-red-label-1-l-pmg-atacadista.jpg' },
  { id: 355, name: 'WHISKY JOHNNIE WALKER GOLD LABEL RESERVE 750 ML', category: 'Ofertas', price: 232.00, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-gold-label-reserve-750-ml-pmg-atacadista.jpg' },
  { id: 349, name: 'WHISKY JACK DANIEL´S TENNESSEE OLD No.7 1 L', category: 'Ofertas', price: 141.00, image: 'https://www.marquesvendaspmg.shop/images/whisky-jack-daniels-tennessee-old-no7-1-l-pmg-atacadista.jpg' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
