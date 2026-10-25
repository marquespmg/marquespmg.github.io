// constants/ofertas.js
export const featuredProducts = [
  { id: 160, name: 'ESPUMANTE BRANCO MOSCATEL SALTON 750 ML (CX 6 UN)', category: 'Ofertas', price: 158.15, image: 'https://www.marquesvendaspmg.shop/images/espumante-branco-moscatel-salton-750-ml-pmg-atacadista.jpg', gtin: '7896023082634' },
  { id: 161, name: 'ESPUMANTE BRANCO NATURAL BRUT SALTON 750 ML (CX 6 UN)', category: 'Ofertas', price: 158.15, image: 'https://www.marquesvendaspmg.shop/images/espumante-branco-natural-brut-salton-750-ml-pmg-atacadista.jpg', gtin: '7896023082993' },
  { id: 165, name: 'ESPUMANTE CHANDON RÉSERVE BRUT 750 ML (CX 6 UN)', category: 'Ofertas', price: 490.88, image: 'https://www.marquesvendaspmg.shop/images/espumante-chandon-reserve-brut-750-ml-pmg-atacadista.jpg', gtin: '7891083611138' },
  { id: 346, name: 'WHISKY CHIVAS REGAL 12 ANOS 1 L', category: 'Ofertas', price: 110.20, image: 'https://www.marquesvendaspmg.shop/images/whisky-chivas-regal-12-anos-1-l-pmg-atacadista.jpg', gtin: '0080432400432' },
  { id: 347, name: 'WHISKY JACK DANIEL´S TENNESSEE FIRE 1 L', category: 'Ofertas', price: 131.07, image: 'https://www.marquesvendaspmg.shop/images/whisky-jack-daniels-tennessee-fire-1-l-pmg-atacadista.jpg', gtin: '5099873006368' },
  { id: 348, name: 'WHISKY JACK DANIEL´S TENNESSEE HONEY 1 L', category: 'Ofertas', price: 134.55, image: 'https://www.marquesvendaspmg.shop/images/whisky-jack-daniels-tennessee-honey-1-l-pmg-atacadista.jpg', gtin: '0082184000328' },
  { id: 349, name: 'WHISKY JACK DANIEL´S TENNESSEE OLD No.7 1 L', category: 'Ofertas', price: 134.55, image: 'https://www.marquesvendaspmg.shop/images/whisky-jack-daniels-tennessee-old-no7-1-l-pmg-atacadista.jpg', gtin: '0082184090442' },
  { id: 350, name: 'WHISKY JAMESON 750 ML', category: 'Ofertas', price: 93.96, image: 'https://www.marquesvendaspmg.shop/images/whisky-jameson-750-ml-pmg-atacadista.jpg', gtin: '5011007003029' },
  { id: 351, name: 'WHISKY JIM BEAM 1 L', category: 'Ofertas', price: 80.04, image: 'https://www.marquesvendaspmg.shop/images/whisky-jim-beam-1-l-pmg-atacadista.jpg', gtin: '0080686027638' },
  { id: 352, name: 'WHISKY JOHNNIE WALKER BLACK LABEL 12 ANOS 1 L', category: 'Ofertas', price: 165.86, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-black-label-12-anos-1-l-pmg-atacadista.jpg', gtin: '5000267023601' },
  { id: 353, name: 'WHISKY JOHNNIE WALKER BLUE LABEL 750 ML', category: 'Ofertas', price: 966.60, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-blue-label-750-ml-pmg-atacadista.jpg', gtin: '5000267114279' },
  { id: 354, name: 'WHISKY JOHNNIE WALKER DOUBLE BLACK 1 L', category: 'Ofertas', price: 191.39, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-double-black-1-l-pmg-atacadista.jpg', gtin: '5000267112077' },
  { id: 355, name: 'WHISKY JOHNNIE WALKER GOLD LABEL RESERVE 750 ML', category: 'Ofertas', price: 220.39, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-gold-label-reserve-750-ml-pmg-atacadista.jpg', gtin: '5000267197630' },
  { id: 356, name: 'WHISKY JOHNNIE WALKER RED LABEL 1 L', category: 'Ofertas', price: 81.78, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-red-label-1-l-pmg-atacadista.jpg', gtin: '5000267013602' },
];

// Array com os IDs em oferta (fácil de verificar)
export const IDs_EM_OFERTA = featuredProducts.map(p => p.id);

// Objeto para buscar preço de oferta por ID rapidamente
export const PRECO_OFERTA_POR_ID = Object.fromEntries(
  featuredProducts.map(p => [p.id, p.price])
);
