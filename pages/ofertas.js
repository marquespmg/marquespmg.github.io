import React, { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import useTrackUser from '../hook/useTrackUser';
import { useRouter } from 'next/router';

// ========== DADOS DAS CIDADES ========== //
const citiesData = {
sp: {
  title: "🏢 Estado de São Paulo",
  regions: [
    'AGUAÍ - SP', 'ÁGUAS DA PRATA', 'ÁGUAS DE LINDÓIA', 'ÁGUAS DE SANTA BARBARA', 
    'ÁGUAS DE SÃO PEDRO', 'AGUDOS', 'ALAMBARI', 'ALTAIR', 'ALTINÓPOLIS', 
    'ALUMINIO', 'ALVARES FLORENCE', 'AMERICANA', 'AMÉRICO BRASILIENSE', 
    'AMERICO CAMPOS', 'AMPARO', 'ANALÂNDIA', 'ANGATUBA', 'APARECIDA', 'APIAÍ', 
    'ARAÇARIGUAMA', 'ARAÇATUBA', 'ARAÇOIABA DA SERRA', 'ARANDU', 'ARAPEI', 
    'ARARAQUARA', 'ARARAS', 'AREALVA', 'AREIOPOLIS', 'ARTHUR NOGUEIRA', 'ARUJA', 
    'ASSIS', 'ATIBAIA', 'AURIFLAMA', 'AVARÉ', 'BADY BASSITT', 'BANANAL', 
    'BARÃO DE ANTONINA', 'BARIRI', 'BARRA BONITA', 'BARRETOS', 'BARRINHA', 
    'BARUERI', 'BATATAIS', 'BAURU', 'BEBEDOURO', 'BERNARDINO DE CAMPOS', 
    'BERTIOGA', 'BILAC', 'BIRIGUI', 'BIRITIBA-MIRIM', 'BOA ESPERANÇA DO SUL', 
    'BOFETE', 'BOITUVA', 'BOM JESUS DOS PERDOES', 'BOM SUCESSO DE ITARARÉ', 
    'BORBOREMA', 'BOTUCATU', 'BRAGANÇA PAULISTA', 'BRODOWSKI', 'BROTAS', 'BURI', 
    'CABREUVA', 'CAÇAPAVA', 'CACHOEIRA PAULISTA', 'CACONDE', 'CAIEIRAS', 
    'CAJAMAR', 'CAJATI', 'CAJOBI', 'CAJURU', 'CAMPANHA', 'CAMPINAS', 
    'CAMPO LIMPO PAULISTA', 'CAMPOS DO JORDÃO', 'CANANEIA', 'CANAS', 'CANITAR', 
    'CAPAO BONITO', 'CAPELA DO ALTO', 'CAPIVARI', 'CARAGUATATUBA', 'CARAPICUIBA', 
    'CASA BRANCA', 'CASSIA DOS COQUEIROS', 'CATANDUVA', 'CAUCAIA DO ALTO', 
    'CEDRAL', 'CERQUEIRA CESAR', 'CERQUILHO', 'CESARIO LANGE', 'CHARQUEADA', 
    'CHAVANTES', 'COLINA', 'COLOMBIA', 'CONCHAL', 'CONCHAS', 'CORDEIRÓPOLIS', 
    'CORONEL MACEDO', 'CORUMBATAÍ', 'COSMÓPOLIS', 'COSMORAMA', 'COTIA', 
    'CRAVINHOS', 'CRUZEIRO', 'CUBATÃO', 'CUNHA', 'DESCALVADO', 'DIADEMA', 
    'DIVINOLÂNDIA', 'DOBRADA', 'DOIS CORREGOS', 'DOURADO SP', 'DUARTINA', 
    'ELDORADO', 'ELIAS FAUSTO', 'ELISIARIO', 'EMBAUBA', 'EMBU GUAÇU', 
    'ENGENHEIRO COELHO', 'ESPÍRITO SANTO DO PINHAL', 'ESPÍRITO SANTO DO TURVO', 
    'ESTIVA GERBI', 'ESTRELA D OESTE', 'FARTURA', 'FERNANDO PRESTES', 
    'FERNANDÓPOLIS', 'FERRAZ DE VASCONCELOS', 'FRANCA', 'FRANCISCO MORATO', 
    'FRANCO DA ROCHA', 'GARÇA', 'GAVIÃO PEIXOTO', 'GUAÍRA', 'GUAPIAÇU', 
    'GUAPIARA', 'GUARÁ', 'GUARACI', 'GUARAREMA', 'GUARATINGUETÁ', 'GUAREÍ', 
    'GUARIBA', 'GUARUJÁ', 'GUARULHOS1', 'GUARULHOS2', 'GUATAPARA', 'GUATAPARÁ', 
    'HOLAMBRA', 'HORTOLANDIA', 'IBATE', 'IBIRÁ', 'IBITINGA', 'IBIUNA', 
    'IGARAÇÚ DO TIETÊ', 'IGARATÁ', 'IGUAPE', 'ILHA BELA NORTE / CENTRO', 
    'ILHA BELA SUL', 'ILHA COMPRIDA', 'INDAIATUBA', 'IPAUSSU', 'IPERÓ', 'IPEUNA', 
    'IPORANGA', 'IPUÃ', 'IRACEMAPOLIS', 'ITABERA', 'ITAI', 'ITAJOBI', 
    'ITANHAÉM', 'ITAPETININGA', 'ITAPEVA', 'ITAPEVI', 'ITAPIRA', 'ITÁPOLIS', 
    'ITAPORANGA', 'ITAQUAQUECETUBA', 'ITARARÉ', 'ITARIRI', 'ITATIBA', 
    'ITATINGA', 'ITIRAPINA', 'ITOBI', 'ITU', 'ITUPEVA', 'ITUVERAVA', 'JABORANDI', 
    'JABOTICABAL', 'JACAREI', 'JACI', 'JACUPIRANGA', 'JAGUARIUNA', 'JALES', 
    'JAMBEIRO', 'JANDIRA', 'JARDINÓPOLIS', 'JARINU', 'JAÚ', 'JOANOPOLIS', 
    'JOÃO RAMALHO', 'JOSÉ BONIFÁCIO', 'JUMIRIM', 'JUNDIAI', 'JUQUIA', 
    'JUQUITIBA', 'LAGOINHA', 'LARANJAL PAULISTA', 'LEME', 'LENÇOIS PAULISTA', 
    'LIMEIRA', 'LINS', 'LORENA', 'LOUVEIRA', 'LUIS ANTONIO', 'LUTÉCIA', 
    'MAIRINQUE', 'MAIRIPORÃ', 'MANDURI', 'MARAPOAMA', 'MARÍLIA', 'MATÃO', 
    'MAUA', 'MENDONÇA', 'MERIDIANO', 'METRÔ 1', 'METRÔ 2', 'MIGUELÓPOLIS', 
    'MINEIROS DO TIETE', 'MIRACATU', 'MIRANDOPOLIS', 'MIRASSOL', 'MOCOCA', 
    'MOGI DAS CRUZES', 'MOGI GUAÇU', 'MOGI MIRIM', 'MONGAGUÁ', 
    'MONTE ALEGRE DO SUL', 'MONTE ALTO', 'MONTE APRAZÍVEL', 'MONTE AZUL PAULISTA', 
    'MONTE MOR', 'MONTEIRO LOBATO', 'MORRO AGUDO', 'MORUNGABA', 'MOTUCA', 
    'NATIVIDADE DA SERRA', 'NAZARÉ PAULISTA', 'NHANDEARA', 'NOVA ALIANÇA', 
    'NOVA CAMPINA', 'NOVA EUROPA', 'NOVA ODESSA', 'NOVA ZONA', 'NOVAIS', 
    'NOVO HORIZONTE', 'NUPORANGA', 'OLÍMPIA', 'ORLÂNDIA', 'OSASCO', 
    'OSCAR BRESSANE', 'OURINHOS', 'PALMITAL', 'PARAGUAÇU PAULISTA', 'PARAIBÚNA', 
    'PARAISO', 'PARDINHO', 'PARIQUERA-ACU', 'PARISI', 'PAULÍNIA', 'PAULISTANIA', 
    'PEDERNEIRAS', 'PEDRA BELA', 'PEDRANOPOLIS', 'PEDREGULHO', 'PEDREIRA', 
    'PEDRO DE TOLEDO', 'PENAPOLIS', 'PEREIRAS', 'PERUÍBE', 'PIEDADE', 
    'PILAR DO SUL', 'PINDAMONHANGABA', 'PINHALZINHO', 'PIQUETE', 'PIRACAIA', 
    'PIRACICABA', 'PIRAJU', 'PIRAJUÍ', 'PIRAPORA DO BOM JESUS', 'PIRASSUNUNGA', 
    'PITANGUEIRAS', 'POÁ', 'POMPÉIA', 'PONTAL', 'PORANGABA', 'PORTO FELIZ', 
    'PORTO FERREIRA', 'POTIM', 'POTIRENDABA', 'PRADÓPOLIS', 'PRAIA GRANDE', 
    'PROMISSÃO', 'QUADRA', 'QUATÁ', 'RAFARD', 'REDENÇÃO DA SERRA', 'REGISTRO', 
    'RIBEIRA', 'RIBEIRÃO BRANCO', 'RIBEIRÃO GRANDE', 'RIBEIRÃO PIRES', 
    'RIBEIRÃO PRETO', 'RINCAO', 'RIO CLARO', 'RIO DAS PEDRAS', 
    'RIO GRANDE DA SERRA', 'ROSEIRA', 'SALES OLIVEIRA', 'SALESÓPOLIS', 
    'SALTINHO', 'SALTO', 'SALTO DE PIRAPORA', 'SALTO GRANDE', 'SANTA ADÉLIA', 
    'SANTA BARBARA D OESTE', 'SANTA BRANCA', 'SANTA CRUZ DA CONCEIÇÃO', 
    'SANTA CRUZ DA ESPERANÇA', 'SANTA CRUZ DAS PALMEIRAS', 
    'SANTA CRUZ DO RIO PARDO', 'SANTA ERNESTINA', 'SANTA FÉ DO SUL', 
    'SANTA GERTRUDES', 'SANTA ISABEL', 'SANTA LUCIA', 
    'SANTA RITA DO PASSA QUATRO', 'SANTA ROSA DE VITERBO', 'SANTANA DE PARNAIBA', 
    'SANTO ANDRE', 'SANTO ANTONIO DA ALEGRIA', 'SANTO ANTÔNIO DE POSSE', 
    'SANTO ANTONIO DO PINHAL', 'SANTOS', 'SÃO BENTO DO SAPUCAI', 
    'SÃO BERNARDO DO CAMPO', 'SÃO CAETANO DO SUL', 'SÃO CARLOS', 
    'SÃO JOÃO DA BOA VISTA', 'SÃO JOAQUIM DA BARRA', 'SÃO JOSÉ DO RIO PARDO', 
    'SÃO JOSÉ DO RIO PRETO', 'SÃO JOSÉ DOS CAMPOS', 'SÃO LOURENÇO DA SERRA', 
    'SÃO LUIS DO PARAITINGA', 'SÃO MANUEL', 'SÃO MIGUEL ARCANJO', 'SÃO PEDRO', 
    'SÃO PEDRO DO TURVO', 'SÃO ROQUE', 'SÃO SEBASTIÃO', 'SÃO SIMÃO', 
    'SÃO VICENTE', 'SARAPUI', 'SARUTAIA', 'SERRA NEGRA', 'SERRANA', 
    'SERTÃOZINHO', 'SETE BARRAS', 'SEVERINIA', 'SILVEIRAS', 'SOCORRO', 
    'SOROCABA', 'SUMARÉ', 'SUZANO', 'TABAPUÃ', 'TABATINGA', 'TAGUAÍ', 'TAIAÇU', 
    'TAMBAU', 'TANABI', 'TAPIRAÍ', 'TAPIRATIBA', 'TAQUARITINGA', 'TAQUARITUBA', 
    'TAQUARIVAÍ', 'TATUÍ', 'TAUBATÉ', 'TERRA ROXA', 'TIETÊ', 'TIMBURI', 
    'TORRE DE PEDRA', 'TORRINHA', 'TREMEMBÉ', 'TRÊS FRONTEIRAS', 'TUIUTI', 
    'TUPÃ', 'UBATUBA', 'UCHOA', 'URUPÊS', 'VALENTIM GENTIL', 'VALINHOS', 
    'VARGEM', 'VARGEM GRANDE DO SUL', 'VARGEM GRANDE PAULISTA', 
    'VARZEA PAULISTA', 'VINHEDO', 'VIRADOURO', 'VISTA ALEGRE DO ALTO', 
    'VOTORANTIM', 'VOTUPORANGA', 'ZONA CENTRAL 1', 'ZONA CENTRAL 2', 
    'ZONA CENTRAL 3', 'ZONA LESTE 1', 'ZONA LESTE 2', 'ZONA LESTE 3', 
    'ZONA NORTE 1', 'ZONA NORTE 2', 'ZONA NORTE 3', 'ZONA OESTE 1', 
    'ZONA SUL 1', 'ZONA SUL 2', 'ZONA SUL 3 - AR 1', 'ZONA SUL 3 - AR 2', 
    'ZONA SUL 3 - AR 3', 'ZONA SUL 3A', 'ZONA SUL 3B', 'ZONA SUL 4'
  ]
},
  rj: {
    title: "🏖️ Sul do Rio de Janeiro",
    cities: [
      'BARRA DO PIRAÍ', 'BARRA MANSA', 'ITATIAIA', 'PARATY', 'PIRAÍ', 
	  'PORTO REAL', 'RESENDE','VALENÇA', 'VASSOURAS', 'VOLTA REDONDA'
    ]
  },
  mg: {
    title: "⛰️ Sul de Minas Gerais", 
    cities: [
      'CAMANDUCAIA', 'CAMBUÍ', 'CONCEIÇÃO DOS OUROS', 'CONGONHAL',
      'DELFIM MOREIRA','ESTIVA', 'EXTREMA', 'ITAJUBÁ', 'ITAMONTE',
      'ITANHANDU', 'ITAPEVA', 'MARIA DA FÉ', 'MONTE VERDE', 'OURO FINO',
      'PARAISÓPOLIS', 'PASSA QUATRO', 'PIRANGUINHO', 'POÇOS DE CALDAS', 'POUSO ALEGRE', 'SANTA RITA DO SAPUCAÍ',
      'SÃO LOURENÇO', 'SÃO SEBASTIÃO DO PARAÍSO', 'TRÊS PONTAS', 'VARGINHA', 'VIRGÍNIA'
    ]
  }
};

// ========== PRODUTOS EM OFERTA ========== //
const featuredProducts = [
  { id: 922, name: "REQUEIJÃO TRADICIONAL SOFFICE SEM AMIDO 1,5 KILO", category: "Ofertas", price: 42.83, image: "https://www.marquesvendaspmg.shop/images/requeijao-tradicional-soffice-sem-amido-15-kilo-pmg-atacadista.jpg" },
  { id: 879, name: "REQUEIJÃO CLARA MILK COM AMIDO 1,8 KILO", category: "Ofertas", price: 15.93, image: "https://www.marquesvendaspmg.shop/images/requeijao-clara-milk-com-amido-18-kilo-pmg-atacadista.jpg" },
  { id: 391, name: "MOLHO ALHO CEPÊRA 1,01 L", category: "Ofertas", price: 12.64, image: "https://www.marquesvendaspmg.shop/images/molho-alho-cepera-101-l-pmg-atacadista.jpg" },
  { id: 393, name: "MOLHO BARBECUE CEPÊRA 1,01 KILO", category: "Ofertas", price: 14.89, image: "https://www.marquesvendaspmg.shop/images/molho-barbecue-cepera-101-kilo-pmg-atacadista.jpg" },
  { id: 394, name: "MOLHO BARBECUE CEPÊRA 3,5 KILO", category: "Ofertas", price: 38.89, image: "https://www.marquesvendaspmg.shop/images/molho-barbecue-cepera-35-kilo-pmg-atacadista.jpg" },
  { id: 397, name: "MOLHO BARBECUE SACHÊ CEPÊRA 7 G (CX 175 UN)", category: "Ofertas", price: 28.68, image: "https://www.marquesvendaspmg.shop/images/molho-barbecue-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg" },
  { id: 407, name: "MOLHO DE PIMENTA VERMELHA CEPÊRA 1,01 L", category: "Ofertas", price: 10.13, image: "https://www.marquesvendaspmg.shop/images/molho-de-pimenta-vermelha-cepera-101-l-pmg-atacadista.jpg" },
  { id: 411, name: "MOLHO DE PIMENTA VERMELHA SACHÊ CEPÊRA 5 G (CX 175 UN)", category: "Ofertas", price: 24.10, image: "https://www.marquesvendaspmg.shop/images/molho-de-pimenta-vermelha-sache-cepera-5-g-cx-175-un-pmg-atacadista.jpg" },
  { id: 414, name: "MOLHO DE TOMATE PIZZA CEPÊRA MAMMA D ORO 1,7 KILO (CX 6 BAG)", category: "Ofertas", price: 105.57, image: "https://www.marquesvendaspmg.shop/images/molho-de-tomate-pizza-cepera-mamma-d-oro-17-kilo-cx-6-bag-pmg-atacadista.jpg" },
  { id: 420, name: "MOLHO DE TOMATE TRADICIONAL MAMMA D ORO CEPÊRA 1,7 KILO (CX 6 BAG)", category: "Ofertas", price: 95.71, image: "https://www.marquesvendaspmg.shop/images/molho-de-tomate-tradicional-mamma-d-oro-cepera-17-kilo-cx-6-bag-pmg-atacadista.jpg" },
  { id: 425, name: "MOLHO INGLÊS CEPÊRA 1,01 L", category: "Ofertas", price: 7.27, image: "https://www.marquesvendaspmg.shop/images/molho-ingles-cepera-101-l-pmg-atacadista.jpg" },
  { id: 441, name: "MOLHO SHOYU CEPÊRA 1,01 L", category: "Ofertas", price: 11.84, image: "https://www.marquesvendaspmg.shop/images/molho-shoyu-cepera-101-l-pmg-atacadista.jpg" },
  { id: 446, name: "MOLHO SHOYU PREMIUM CEPÊRA 5 L", category: "Ofertas", price: 60.18, image: "https://www.marquesvendaspmg.shop/images/molho-shoyu-premium-cepera-5-l-pmg-atacadista.jpg" },
  { id: 1132, name: "AZEITE DENDÊ CEPÊRA 900 ML", category: "Ofertas", price: 28.16, image: "https://www.marquesvendaspmg.shop/images/azeite-dende-cepera-900-ml-pmg-atacadista.jpg" },
  { id: 1231, name: "CATCHUP CEPÊRA 3,5 KILO", category: "Ofertas", price: 29.48, image: "https://www.marquesvendaspmg.shop/images/catchup-cepera-35-kilo-pmg-atacadista.jpg" },
  { id: 1240, name: "CATCHUP PEQUENO CEPÊRA 1,01 KILO", category: "Ofertas", price: 9.76, image: "https://www.marquesvendaspmg.shop/images/catchup-pequeno-cepera-101-kilo-pmg-atacadista.jpg" },
  { id: 1243, name: "CATCHUP SACHÊ CEPÊRA 7 G (CX 175 UN)", category: "Ofertas", price: 18.59, image: "https://www.marquesvendaspmg.shop/images/catchup-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg" },
  { id: 1299, name: "MAIONESE SACHÊ CEPÊRA 7 G (CX 175 UN)", category: "Ofertas", price: 20.34, image: "https://www.marquesvendaspmg.shop/images/maionese-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg" },
  { id: 1340, name: "MOSTARDA COM MEL CEPÊRA 400 G", category: "Ofertas", price: 12.45, image: "https://www.marquesvendaspmg.shop/images/mostarda-com-mel-cepera-400-g-pmg-atacadista.jpg" },
  { id: 1341, name: "MOSTARDA DIJON CEPÊRA 190 G", category: "Ofertas", price: 9.85, image: "https://www.marquesvendaspmg.shop/images/mostarda-dijon-cepera-190-g-pmg-atacadista.jpg" },
  { id: 1344, name: "MOSTARDA GRANDE AMARELA CEPÊRA 3,3 KILO", category: "Ofertas", price: 27.06, image: "https://www.marquesvendaspmg.shop/images/mostarda-grande-amarela-cepera-33-kilo-pmg-atacadista.jpg" },
  { id: 1349, name: "MOSTARDA SACHÊ CEPÊRA 7 G (CX 175 UN)", category: "Ofertas", price: 15.98, image: "https://www.marquesvendaspmg.shop/images/mostarda-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg" },
  { id: 1503, name: "AROMA ARTIFICIAL DE BAUNILHA CEPÊRA 480 ML", category: "Ofertas", price: 16.14, image: "https://www.marquesvendaspmg.shop/images/aroma-artificial-de-baunilha-cepera-480-ml-pmg-atacadista.jpg" },
  { id: 1515, name: "CEREJA MARRASQUINO SEM TALO CEPÊRA 125 G", category: "Ofertas", price: 15.38, image: "https://www.marquesvendaspmg.shop/images/cereja-marrasquino-sem-talo-cepera-125-g-pmg-atacadista.jpg" },
];

// ========== BANNERS ========== //
const banners = [
  { 
    id: 1,
    desktop: 'https://i.imgur.com/33QMJL2.png',
    mobile: 'https://i.imgur.com/33QMJL2.png'
  },
  { 
    id: 2,
    desktop: 'https://i.imgur.com/GmAXGiB.png',
    mobile: 'https://i.imgur.com/GmAXGiB.png'
  },
  { 
    id: 3,
    desktop: 'https://i.imgur.com/t5yuOrl.png',
    mobile: 'https://i.imgur.com/t5yuOrl.png'
  },
  { 
    id: 4,
    desktop: 'https://i.imgur.com/AWqaPY4.png',
    mobile: 'https://i.imgur.com/AWqaPY4.png'
  }
];

// ========== IMAGENS FIFO (1080x1080) COM LINKS DE PRODUTO ========== //
const fifoImages = [
  { 
    video: 'https://i.imgur.com/wkqk63h.mp4',
    productId: 1746,
    url: 'https://www.marquesvendaspmg.shop/produto/1746'
  },
  { 
    video: 'https://i.imgur.com/kmRpbcB.mp4',
    productId: 702,
    url: 'https://www.marquesvendaspmg.shop/produto/702'
  },
  { 
    video: 'https://i.imgur.com/7HNF3cf.mp4',
    productId: 533,
    url: 'https://www.marquesvendaspmg.shop/produto/533'
  },
  { 
    video: 'https://i.imgur.com/3OTFiIM.mp4',
    productId: 615,
    url: 'https://www.marquesvendaspmg.shop/produto/615'
  },
];

// ========== FUNÇÕES DE SEO DINÂMICAS ========== //
const generateDynamicSEO = (products) => {
  const categories = [...new Set(products.map(p => {
    if (p.name.includes('WHISKY')) return 'whisky';
    if (p.name.includes('GIN')) return 'gin';
    if (p.name.includes('ESPUMANTE')) return 'espumante';
    if (p.name.includes('BAÚ') || p.name.includes('MOCHILA')) return 'equipamentos';
    return 'produtos';
  }))];

  const brands = products.map(p => {
    if (p.name.includes('JOHNNIE WALKER')) return 'Johnnie Walker';
    if (p.name.includes('SALTON')) return 'Salton';
    if (p.name.includes('ROCK´S')) return 'Rock´s';
    if (p.name.includes('WHITE HORSE')) return 'White Horse';
    if (p.name.includes('MIL ROTAS')) return 'Mil Rotas';
    return null;
  }).filter(Boolean);

  return {
    title: `Ofertas PMG Atacadista - ${categories.join(', ').toUpperCase()} em Promoção`,
    description: `Ofertas especiais PMG Atacadista: ${products.slice(0, 3).map(p => p.name).join(', ')}. Confira todas as ofertas da semana com os melhores preços em atacado. Entrega rápida para São Paulo e região.`,
    keywords: `ofertas pmg atacadista, ${categories.join(', ')}, ${brands.join(', ')}, atacado food service, preço baixo atacado`
  };
};

const generateImageSEO = (product) => {
  return {
    alt: `${product.name} - Oferta PMG Atacadista - Atacado Food Service`,
    title: `${product.name} - Oferta Especial da Semana - PMG Atacadista`,
  };
};

const generateBrand = (productName) => {
  const brandMap = {
    'JOHNNIE WALKER': 'Johnnie Walker',
    'SALTON': 'Salton',
    'ROCK´S': 'Rock´s',
    'WHITE HORSE': 'White Horse',
    'MIL ROTAS': 'Mil Rotas',
    'default': 'Marcas Premium'
  };
  
  const foundBrand = Object.keys(brandMap).find(brand => 
    productName.toUpperCase().includes(brand)
  );
  return brandMap[foundBrand] || brandMap.default;
};

const generateProductDescription = (product) => {
  if (product.name.includes('WHISKY')) {
    return `${product.name} em oferta especial! Whisky premium importado para seu bar ou restaurante. Melhor preço atacado com entrega garantida.`;
  }
  if (product.name.includes('GIN')) {
    return `${product.name} em promoção! Gin premium nacional. Perfeito para drinks especiais em seu estabelecimento.`;
  }
  if (product.name.includes('ESPUMANTE')) {
    return `${product.name} em oferta! Espumante nacional de qualidade para celebrações e eventos.`;
  }
  if (product.name.includes('BAÚ') || product.name.includes('MOCHILA')) {
    return `${product.name} em promoção! Equipamento profissional para transporte de alimentos. Qualidade garantida.`;
  }
  return `${product.name} em oferta especial PMG Atacadista! Produto selecionado com o melhor preço atacado.`;
};

// ========== HOOK PARA DETECTAR TAMANHO DA TELA ========== //
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

// ========== COMPONENTE PRINCIPAL ========== //
const OfertasPage = ({
  // ✅ RECEBE AS PROPS DO _app.js - MESMO CARRINHO GLOBAL
  cart = [],
  total = 0,
  addToCart = () => {},
  removeFromCart = () => {},
  setCart = () => {},
  adjustQuantity = () => {},
  clearCart = () => {}
}) => {
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth <= 768;
  const router = useRouter();
  
  useTrackUser();
  
  // ✅ ESTADOS DO USUÁRIO - APENAS PARA MENSAGEM DE BOAS-VINDAS
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  
  // NOVOS ESTADOS PARA O MENU DE CIDADES
  const [showCitiesMenu, setShowCitiesMenu] = useState(false);
  const [openRegions, setOpenRegions] = useState({
    sp: false,
    rj: false,
    mg: false
  });

  // ========== NOVO: DADOS DE DIAS DE ENTREGA ========== //
  const [deliveryDaysData, setDeliveryDaysData] = useState({});
  const [loadingDeliveryData, setLoadingDeliveryData] = useState(true);
  const [expandedCity, setExpandedCity] = useState(null); // Qual cidade está expandida
  
  // ========== NOVO: ALTERNAR EXPANSÃO DA CIDADE ========== //
const toggleCityExpand = (cityName) => {
  setExpandedCity(expandedCity === cityName ? null : cityName);
};

// ========== NOVO: COMPONENTE DE DIAS DE ENTREGA ========== //
const DeliveryDaysDisplay = ({ days }) => {
  // Converte os true/false em nomes dos dias
  const activeDays = [];
  if (days.terca) activeDays.push('Terça');
  if (days.quarta) activeDays.push('Quarta');
  if (days.quinta) activeDays.push('Quinta');
  if (days.sexta) activeDays.push('Sexta');
  
  if (activeDays.length === 0) return null;
  
  return (
    <div style={{
      marginTop: '8px',
      padding: '10px 12px',
      backgroundColor: '#f0f8f0',
      borderLeft: '3px solid #095400',
      borderRadius: '0 6px 6px 0',
      fontSize: '13px',
      color: '#333',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span style={{ fontWeight: 'bold', color: '#095400' }}>📅 Entrega:</span>
      {activeDays.map((day, index) => (
        <span key={day} style={{
          backgroundColor: '#095400',
          color: 'white',
          padding: '3px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {day} manhã
        </span>
      ))}
    </div>
  );
};  

  const dynamicSEO = generateDynamicSEO(featuredProducts);
  
  // Estados LOCAIS apenas para controle da página (não do carrinho)
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showFifoPopup, setShowFifoPopup] = useState(false);
  const [selectedFifoItem, setSelectedFifoItem] = useState(null);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  // ✅ Estado para feedback visual ao adicionar produto
  useEffect(() => {
    if (showAddedFeedback) {
      const timer = setTimeout(() => {
        setShowAddedFeedback(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAddedFeedback]);

// ========== NOVO: CARREGAR DIAS DE ENTREGA ========== //
useEffect(() => {
  const loadDeliveryData = async () => {
    try {
      // Carrega os 3 arquivos em paralelo (mais rápido!)
      const [spData, mgData, rjData] = await Promise.all([
        fetch('/rotas/sp.json').then(res => res.ok ? res.json() : {}),
        fetch('/rotas/mg.json').then(res => res.ok ? res.json() : {}),
        fetch('/rotas/rj.json').then(res => res.ok ? res.json() : {})
      ]);
      
      // Junta tudo em um único objeto
      const allData = { ...spData, ...mgData, ...rjData };
      setDeliveryDaysData(allData);
    } catch (error) {
      console.error('Erro ao carregar dias de entrega:', error);
    } finally {
      setLoadingDeliveryData(false);
    }
  };
  
  loadDeliveryData();
}, []);

  // ✅ EFETO PARA VERIFICAR USUÁRIO LOGADO - APENAS PARA MENSAGEM DE BOAS-VINDAS
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Pegar os dados do usuário
        const fullName = user.user_metadata?.full_name || '';
        const avatarUrl = user.user_metadata?.avatar_url || '';
        
        setUserName(fullName);
        setUserAvatar(avatarUrl);
      }
    };
    
    // Adicionar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        if (session?.user) {
          setUser(session.user);
          const fullName = session.user.user_metadata?.full_name || '';
          const avatarUrl = session.user.user_metadata?.avatar_url || '';
          setUserName(fullName);
          setUserAvatar(avatarUrl);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserName('');
        setUserAvatar('');
      }
    });
    
    checkUser();
    
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Configuração de paginação
  const productsPerPage = 10;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = featuredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(featuredProducts.length / productsPerPage);

  // Refs para intervalos
  const bannerIntervalRef = useRef(null);

  // FUNÇÃO PARA ALTERNAR AS REGIÕES
  const toggleRegion = (regionKey) => {
    setOpenRegions(prev => ({
      ...prev,
      [regionKey]: !prev[regionKey]
    }));
  };

  // Função para redirecionar para detalhes do produto
  const redirectToProductDetails = (productId) => {
    window.location.href = `/produto/${productId}`;
  };

  // Funções de paginação
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Função para mostrar mais/menos
  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // ✅ Função handleAddToCart com feedback visual
  const handleAddToCart = (product) => {
    addToCart(product);
    setShowAddedFeedback(true);
  };

  // ✅ Verifica se produto já está no carrinho
  const isProductInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  // Efeitos
  useEffect(() => {
    // Atualiza título da página dinamicamente
    document.title = dynamicSEO.title;
    
    // Atualiza meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = dynamicSEO.description;

    // Carrossel automático
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 10000);

    // Popup FIFO após 27 segundos
    const fifoTimer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * fifoImages.length);
      setSelectedFifoItem(fifoImages[randomIndex]);
      setShowFifoPopup(true);
    }, 27000);

    return () => {
      clearInterval(bannerIntervalRef.current);
      clearTimeout(fifoTimer);
    };
  }, []);

  // Funções do banner
  const goToNextBanner = () => {
    setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    resetBannerInterval();
  };

  const goToPrevBanner = () => {
    setCurrentBannerIndex(prev => (prev - 1 + banners.length) % banners.length);
    resetBannerInterval();
  };

  const resetBannerInterval = () => {
    clearInterval(bannerIntervalRef.current);
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 10000);
  };

  // Gera Schema.org dinâmico baseado nos produtos
  const generateSchemaOrg = () => {
    const productSchemas = currentProducts.map(product => ({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": generateProductDescription(product),
      "category": product.category,
      "image": product.image,
      "brand": {
        "@type": "Brand",
        "name": generateBrand(product.name)
      },
      "offers": {
        "@type": "Offer",
        "price": product.price.toString(),
        "priceCurrency": "BRL",
        "priceValidUntil": "2024-12-31",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "PMG Atacadista",
          "url": "https://www.marquesvendaspmg.shop",
          "telephone": "+5511913572902"
        }
      }
    }));

    const pageSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Ofertas PMG Atacadista",
      "description": dynamicSEO.description,
      "url": "https://www.marquesvendaspmg.shop/ofertas",
      "numberOfItems": featuredProducts.length,
      "mainEntity": productSchemas
    };

    return [pageSchema, ...productSchemas];
  };

  // ========== ESTILOS ATUALIZADOS ========== //
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '10px' : '20px',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      position: 'relative',
      fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
    },
    header: {
      textAlign: 'center',
      marginBottom: isMobile ? '20px' : '30px',
      padding: isMobile ? '20px 15px' : '30px 20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0'
    },
    title: {
      color: '#095400',
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '700',
      marginBottom: '10px',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    subtitle: {
      color: '#666',
      fontSize: isMobile ? '14px' : '16px',
      marginBottom: '15px'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: isMobile ? '15px' : '25px',
      margin: '30px 0'
    },
    productCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: '1px solid #f0f0f0',
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }
    },
    productImageContainer: {
      width: '100%',
      height: isMobile ? '160px' : '220px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      borderBottom: '2px solid #f0f0f0'
    },
    productImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      padding: '10px',
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'scale(1.05)'
      }
    },
    productInfo: {
      padding: isMobile ? '15px' : '20px',
      flex: '1',
      display: 'flex',
      flexDirection: 'column'
    },
    productNameContainer: {
      minHeight: isMobile ? '60px' : '70px',
      marginBottom: '12px',
      flex: '1'
    },
    productName: {
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '8px',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    showMoreButton: {
      background: 'none',
      border: 'none',
      color: '#095400',
      fontSize: '12px',
      cursor: 'pointer',
      padding: '0',
      marginTop: '5px',
      fontWeight: '600',
      textDecoration: 'underline'
    },
    productPrice: {
      fontSize: isMobile ? '18px' : '20px',
      fontWeight: '700',
      color: '#e53935',
      margin: '15px 0',
      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    addButton: {
      width: '100%',
      padding: isMobile ? '12px' : '14px',
      backgroundColor: '#095400',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(9, 84, 0, 0.3)',
      marginTop: 'auto',
      ':hover': {
        backgroundColor: '#0a6b00',
        transform: 'translateY(-2px)'
      }
    },
    addedButton: {
      backgroundColor: '#27AE60',
      cursor: 'default',
      ':hover': {
        backgroundColor: '#27AE60',
        transform: 'none'
      }
    },
    disabledButton: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
      ':hover': {
        backgroundColor: '#ccc',
        transform: 'none'
      }
    },
    productDetailsButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: isMobile ? '28px' : '32px',
      height: isMobile ? '28px' : '32px',
      backgroundColor: '#e03f3e',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      zIndex: 5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      ':hover': {
        backgroundColor: '#b92c2b',
        transform: 'scale(1.1)'
      }
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '30px 0',
      gap: '8px',
      flexWrap: 'wrap'
    },
    pageButton: {
      padding: isMobile ? '10px 15px' : '12px 18px',
      backgroundColor: '#fff',
      border: '2px solid #095400',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      color: '#095400',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: '#095400',
        color: '#fff'
      }
    },
    activePage: {
      backgroundColor: '#095400',
      color: '#fff',
      borderColor: '#095400'
    },
    resultsInfo: {
      textAlign: 'center',
      color: '#666',
      margin: '15px 0',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500'
    },
    bannerContainer: {
      margin: '40px 0 30px',
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    },
    bannerImage: {
      width: '100%',
      display: 'block'
    },
    bannerNavButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(255,255,255,0.9)',
      color: '#095400',
      border: 'none',
      borderRadius: '50%',
      width: isMobile ? '40px' : '50px',
      height: isMobile ? '40px' : '50px',
      fontSize: isMobile ? '18px' : '22px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      fontWeight: 'bold',
      ':hover': {
        backgroundColor: '#095400',
        color: 'white'
      }
    },
    prevButton: {
      left: '15px'
    },
    nextButton: {
      right: '15px'
    },
    bannerDots: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '15px',
      gap: '8px'
    },
    dot: {
      width: isMobile ? '10px' : '12px',
      height: isMobile ? '10px' : '12px',
      borderRadius: '50%',
      backgroundColor: '#ddd',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    activeDot: {
      backgroundColor: '#095400',
      transform: 'scale(1.2)'
    },
    ctaSection: {
      textAlign: 'center', 
      margin: '50px 0',
      padding: isMobile ? '25px 15px' : '40px 20px',
      backgroundColor: '#f0f8f0',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e0f0e0'
    },
    fifoPopupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
    },
    fifoPopupContent: {
      position: 'relative',
      width: isMobile ? '90%' : 'auto',
      maxWidth: '1080px',
      maxHeight: isMobile ? '80vh' : '90vh',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 5px 25px rgba(0,0,0,0.5)',
      backgroundColor: '#fff',
    },
    fifoPopupClose: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: '#ff0000',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      zIndex: 10,
    },
    fifoPopupImageContainer: {
      width: '100%',
      height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    fifoPopupImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '70vh',
      objectFit: 'contain',
    },
    fifoPopupButton: {
      display: 'block',
      width: '100%',
      padding: '15px',
      backgroundColor: '#25D366',
      color: 'white',
      border: 'none',
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: 'bold',
      textAlign: 'center',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    feedbackToast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#27AE60',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      zIndex: 9999,
      animation: 'fadeInOut 2s ease-in-out',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    // ✅ ESTILO PARA MENSAGEM DE BOAS-VINDAS (igual ao [id].js)
    welcomeMessage: {
      backgroundColor: '#f8f9fa',
      padding: '10px 15px',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#333',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '15px',
      border: '1px solid #e0e0e0'
    }
  };

  // ========== RENDERIZAÇÃO ========== //
  return (
    <div style={styles.container}>
      {/* ✅ FEEDBACK VISUAL AO ADICIONAR PRODUTO */}
      {showAddedFeedback && (
        <div style={styles.feedbackToast}>
          ✅ Produto adicionado ao carrinho!
        </div>
      )}

      {/* ✅ SCHEMA.ORG DINÂMICO */}
      {generateSchemaOrg().map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ✅ MENSAGEM DE BOAS-VINDAS SE USUÁRIO ESTIVER LOGADO (IGUAL AO [id].js) */}
      {user && (
        <div style={styles.welcomeMessage}>
          Olá {userName || 'Cliente'}, seja bem-vindo(a)!
        </div>
      )}

      {/* ========== BARRA COM OS 3 BOTÕES - SEMPRE VISÍVEL ========== */}
      <div style={{
        backgroundColor: '#095400',
        color: 'white',
        padding: isMobile ? '12px 15px' : '15px 20px',
        borderRadius: '8px',
        marginBottom: isMobile ? '15px' : '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxShadow: '0 2px 10px rgba(9, 84, 0, 0.2)'
      }}>
        {/* Linha 1: Mensagem */}
        <p style={{
          fontSize: isMobile ? '16px' : '18px',
          fontWeight: '600',
          margin: 0,
          marginBottom: '10px',
          textAlign: 'left',
          width: '100%'
        }}>
          🎯 OFERTAS DA SEMANA - Marques Vendas PMG
        </p>
        
        {/* Linha 2: Botões */}
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* BOTÃO PÁGINA INICIAL */}
          <a href="/" style={{
            backgroundColor: 'white',
            color: '#095400',
            border: '1px solid #095400',
            padding: windowWidth > 768 ? '8px 12px' : '6px 10px',
            borderRadius: '20px',
            fontSize: windowWidth > 768 ? '14px' : '12px',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s',
            ':hover': {
              backgroundColor: '#095400',
              color: 'white'
            }
          }}>
            Página Inicial
          </a>
          
          {/* BOTÃO ONDE ENTREGAMOS */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => setShowCitiesMenu(!showCitiesMenu)}
              style={{
                backgroundColor: '#e53935',
                color: 'white',
                border: 'none',
                padding: windowWidth > 768 ? '8px 12px' : '6px 10px',
                borderRadius: '20px',
                fontSize: windowWidth > 768 ? '14px' : '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 5px rgba(229, 57, 53, 0.3)',
                ':hover': {
                  backgroundColor: '#c62828',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 10px rgba(229, 57, 53, 0.4)'
                }
              }}
            >
              Onde Entregamos
              <span style={{
                transition: 'transform 0.3s',
                fontSize: '12px',
                transform: showCitiesMenu ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                ▼
              </span>
            </button>
            
            {/* MENU DROPDOWN */}
            {showCitiesMenu && (
              <>
                {/* Overlay para fechar ao clicar fora */}
                <div 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 998,
                    backgroundColor: 'transparent'
                  }}
                  onClick={() => setShowCitiesMenu(false)}
                />
                
                {/* Container do Menu */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 999,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    border: '2px solid #e53935',
                    width: windowWidth > 768 ? '350px' : '280px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    marginTop: '8px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Cabeçalho do Menu */}
                  <div style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff5f5'
                  }}>
                    <strong style={{ 
                      color: '#095400', 
                      fontSize: windowWidth > 768 ? '16px' : '14px',
                      fontWeight: '600'
                    }}>
                      📍 Onde Entregamos
                    </strong>
                    <button
                      onClick={() => setShowCitiesMenu(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#e53935',
                        cursor: 'pointer',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        padding: '0',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        ':hover': {
                          backgroundColor: '#f0f0f0'
                        }
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Conteúdo do Menu */}
                  <div style={{ padding: '15px' }}>
{/* ========== SÃO PAULO ========== */}
<div style={{ marginBottom: '15px' }}>
  <div 
    onClick={() => toggleRegion('sp')}
    style={{
      color: '#095400',
      fontWeight: '600',
      fontSize: windowWidth > 768 ? '15px' : '13px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '4px',
      ':hover': {
        backgroundColor: '#f9f9f9'
      }
    }}
  >
    <span>🏢</span>
    <span>Estado de São Paulo</span>
    <span style={{
      marginLeft: 'auto',
      fontSize: '12px',
      transform: openRegions.sp ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s'
    }}>
      ▼
    </span>
  </div>
  
  {openRegions.sp && (
    <div style={{
      marginLeft: '10px',
      paddingLeft: '10px',
      borderLeft: '2px solid #095400',
      maxHeight: '120px',
      overflowY: 'auto'
    }}>
      {citiesData.sp.regions.map((city, index) => {
        // Nome da cidade exatamente como está no JSON (adiciona -SP)
        const cityKey = city;
        const hasDeliveryData = deliveryDaysData[cityKey];
        
        return (
          <div key={index}>
            <div style={{ 
              padding: '5px 0', 
              color: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: hasDeliveryData ? 'pointer' : 'default'
            }}>
              <span>• {city}</span>
              {hasDeliveryData && (
                <button
                  onClick={() => toggleCityExpand(cityKey)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e53935',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    ':hover': {
                      backgroundColor: '#f0f0f0'
                    }
                  }}
                >
                  ▼
                </button>
              )}
            </div>
            
            {/* Mostra os dias se estiver expandido */}
            {expandedCity === cityKey && hasDeliveryData && (
              <DeliveryDaysDisplay days={deliveryDaysData[cityKey]} />
            )}
          </div>
        );
      })}
    </div>
  )}
</div>

{/* ========== RIO DE JANEIRO ========== */}
<div style={{ marginBottom: '15px' }}>
  <div 
    onClick={() => toggleRegion('rj')}
    style={{
      color: '#095400',
      fontWeight: '600',
      fontSize: windowWidth > 768 ? '15px' : '13px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '4px',
      ':hover': {
        backgroundColor: '#f9f9f9'
      }
    }}
  >
    <span>🏖️</span>
    <span>Sul do Rio de Janeiro</span>
    <span style={{
      marginLeft: 'auto',
      fontSize: '12px',
      transform: openRegions.rj ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s'
    }}>
      ▼
    </span>
  </div>
  
  {openRegions.rj && (
    <div style={{
      marginLeft: '10px',
      paddingLeft: '10px',
      borderLeft: '2px solid #e53935',
      maxHeight: '120px',
      overflowY: 'auto'
    }}>
      {citiesData.rj.cities.map((city, index) => {
        // Nome da cidade exatamente como está no JSON (adiciona -RJ)
        const cityKey = `${city}-RJ`;
        const hasDeliveryData = deliveryDaysData[cityKey];
        
        return (
          <div key={index}>
            <div style={{ 
              padding: '5px 0', 
              color: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: hasDeliveryData ? 'pointer' : 'default'
            }}>
              <span>• {city}</span>
              {hasDeliveryData && (
                <button
                  onClick={() => toggleCityExpand(cityKey)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e53935',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    ':hover': {
                      backgroundColor: '#f0f0f0'
                    }
                  }}
                >
                  ▼
                </button>
              )}
            </div>
            
            {/* Mostra os dias se estiver expandido */}
            {expandedCity === cityKey && hasDeliveryData && (
              <DeliveryDaysDisplay days={deliveryDaysData[cityKey]} />
            )}
          </div>
        );
      })}
    </div>
  )}
</div>

{/* ========== MINAS GERAIS ========== */}
<div>
  <div 
    onClick={() => toggleRegion('mg')}
    style={{
      color: '#095400',
      fontWeight: '600',
      fontSize: windowWidth > 768 ? '15px' : '13px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '4px',
      ':hover': {
        backgroundColor: '#f9f9f9'
      }
    }}
  >
    <span>⛰️</span>
    <span>Sul de Minas Gerais</span>
    <span style={{
      marginLeft: 'auto',
      fontSize: '12px',
      transform: openRegions.mg ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s'
    }}>
      ▼
    </span>
  </div>
  
  {openRegions.mg && (
    <div style={{
      marginLeft: '10px',
      paddingLeft: '10px',
      borderLeft: '2px solid #e53935',
      maxHeight: '120px',
      overflowY: 'auto'
    }}>
      {citiesData.mg.cities.map((city, index) => {
        // Nome da cidade exatamente como está no JSON (adiciona -MG)
        const cityKey = `${city}-MG`;
        const hasDeliveryData = deliveryDaysData[cityKey];
        
        return (
          <div key={index}>
            <div style={{ 
              padding: '5px 0', 
              color: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: hasDeliveryData ? 'pointer' : 'default'
            }}>
              <span>• {city}</span>
              {hasDeliveryData && (
                <button
                  onClick={() => toggleCityExpand(cityKey)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e53935',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    ':hover': {
                      backgroundColor: '#f0f0f0'
                    }
                  }}
                >
                  ▼
                </button>
              )}
            </div>
            
            {/* Mostra os dias se estiver expandido */}
            {expandedCity === cityKey && hasDeliveryData && (
              <DeliveryDaysDisplay days={deliveryDaysData[cityKey]} />
            )}
          </div>
        );
      })}
      
      {/* Mensagem de "mais cidades" apenas para MG (se necessário) */}
      {citiesData.mg.cities.length > 59 && (
        <div style={{
          color: '#888',
          fontSize: '12px',
          fontStyle: 'italic',
          padding: '5px 0'
        }}>
          + {citiesData.mg.cities.length - 59} cidades...
        </div>
      )}
    </div>
  )}
</div>
</div>
                  
                  {/* Rodapé do Menu */}
                  <div style={{
                    padding: '10px 15px',
                    borderTop: '1px solid #eee',
                    fontSize: '12px',
                    color: '#888',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9'
                  }}>
                    Clique nas regiões para expandir
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* BOTÃO PERGUNTAS FREQUENTES */}
          <Link href="/faq" legacyBehavior>
            <a style={{
              backgroundColor: 'white',
              color: '#095400',
              border: '1px solid #095400',
              padding: windowWidth > 768 ? '8px 12px' : '6px 10px',
              borderRadius: '20px',
              fontSize: windowWidth > 768 ? '14px' : '12px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              ':hover': {
                backgroundColor: '#095400',
                color: 'white'
              }
            }}>
              ❓ Perguntas
            </a>
          </Link>
        </div>
      </div>

      {/* Cabeçalho */}
      <div style={styles.header}>
        <img 
          src="https://i.imgur.com/pBH5WpZ.png" 
          alt="Marques Vendas PMG"
          style={{ 
            height: isMobile ? '60px' : '80px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        />
        
        <h1 style={styles.title}>🔥 Ofertas PMG Atacadista</h1>
        
        <h2 style={{ 
          color: '#e53935', 
          fontSize: isMobile ? '18px' : '24px',
          marginBottom: '15px',
          fontWeight: '600'
        }}>
          Produtos Selecionados com Condições Especiais
        </h2>
        
        <p style={styles.subtitle}>
          ⚡ Ofertas válidas por tempo limitado! Aproveite os melhores preços em atacado
        </p>
        
        {/* Destaques */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '10px' : '15px',
          marginTop: '20px'
        }}>
          {[
            { icon: '🚚', title: 'Entrega Rápida', desc: 'Para toda região' },
            { icon: '🏷️', title: 'Preço Baixo', desc: 'Melhores condições' },
            { icon: '🛡️', title: 'Garantia', desc: 'Produtos certificados' },
            { icon: '👨‍💼', title: 'Atendimento', desc: 'Especializado' }
          ].map((item, index) => (
            <div key={index} style={{
              backgroundColor: '#f8f8f8',
              padding: isMobile ? '8px 12px' : '10px 15px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{fontSize: isMobile ? '1rem' : '1.2rem'}}>{item.icon}</span>
              <div>
                <div style={{fontWeight: '600', fontSize: isMobile ? '0.7rem' : '0.8rem'}}>{item.title}</div>
                <div style={{fontSize: isMobile ? '0.6rem' : '0.7rem', color: '#666'}}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informação de resultados */}
      <div style={styles.resultsInfo}>
        Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, featuredProducts.length)} de {featuredProducts.length} produtos em oferta
      </div>

      <h3 style={{ 
        color: '#333', 
        fontSize: isMobile ? '18px' : '22px',
        fontWeight: '700',
        margin: '30px 0 15px',
        textAlign: 'center'
      }}>
        🛒 Produtos em Destaque - Clique na Lupa para Detalhes
      </h3>

      {/* Grade de produtos */}
      <div style={styles.productsGrid}>
        {currentProducts.map(product => {
          const seo = generateImageSEO(product);
          const inCart = isProductInCart(product.id);
          
          return (
            <div key={product.id} style={styles.productCard}>
              {/* BOTÃO LUPA */}
              <button
                onClick={() => redirectToProductDetails(product.id)}
                style={styles.productDetailsButton}
                title="Ver detalhes do produto"
              >
                🔍
              </button>
              
              {/* CONTAINER DA IMAGEM */}
              <div style={styles.productImageContainer}>
                <img 
                  src={product.image} 
                  alt={seo.alt}
                  title={seo.title}
                  style={styles.productImage}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300/f8f8f8/666?text=Produto+Sem+Imagem';
                  }}
                />
              </div>
              
              <div style={styles.productInfo}>
                <div style={styles.productNameContainer}>
                  <h4 style={{
                    ...styles.productName,
                    WebkitLineClamp: expandedDescriptions[product.id] ? 'unset' : (isMobile ? 3 : 3)
                  }}>
                    {product.name}
                  </h4>
                  {product.name.length > (isMobile ? 40 : 60) && (
                    <button 
                      onClick={() => toggleDescription(product.id)}
                      style={styles.showMoreButton}
                    >
                      {expandedDescriptions[product.id] ? '[Mostrar menos]' : '[Mostrar mais]'}
                    </button>
                  )}
                </div>
                
                {/* ✅ TODOS PODEM VER PREÇOS (sem bloqueio) */}
                <p style={product.price > 0 ? styles.productPrice : { ...styles.productPrice, color: '#999', textDecoration: 'line-through' }}>
                  {product.price > 0 ? `R$ ${product.price.toFixed(2)}` : 'Indisponível'}
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.price === 0}
                  style={{
                    ...styles.addButton,
                    ...(inCart && styles.addedButton),
                    ...(product.price === 0 && styles.disabledButton)
                  }}
                >
                  {product.price > 0 ? 
                    (inCart ? '✓ Adicionado' : '🛒 Adicionar ao Carrinho') : 
                    '❌ Indisponível'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginação */}
      <div style={styles.pagination}>
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1}
          style={{ 
            ...styles.pageButton, 
            ...(currentPage === 1 && styles.disabledButton) 
          }}
        >
          ⬅️ Anterior
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            style={{ 
              ...styles.pageButton, 
              ...(number === currentPage && styles.activePage) 
            }}
          >
            {number}
          </button>
        ))}
        
        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages}
          style={{ 
            ...styles.pageButton, 
            ...(currentPage === totalPages && styles.disabledButton) 
          }}
        >
          Próxima ➡️
        </button>
      </div>

      {/* ✅ CARRINHO GLOBAL - usa as mesmas props */}
      <Cart 
        cart={cart} 
        setCart={setCart} 
        removeFromCart={removeFromCart} 
        adjustQuantity={adjustQuantity}
        total={total} 
      />

      {/* CTA */}
      <div style={styles.ctaSection}>
        <h2 style={{ 
          color: '#095400', 
          marginBottom: '15px', 
          fontSize: isMobile ? '20px' : '24px',
          fontWeight: '700'
        }}>
          📦 Catálogo Completo de Produtos
        </h2>
        
        <h3 style={{ 
          color: '#e53935', 
          marginBottom: '15px', 
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: '600'
        }}>
          🎁 Mais Produtos em Oferta no Catálogo Completo!
        </h3>
        
        <p style={{ marginBottom: '25px', color: '#666', fontSize: isMobile ? '14px' : '16px' }}>
          Acesse nosso catálogo completo com centenas de produtos para seu negócio.<br />
          Cadastro rápido, condições especiais e atendimento personalizado.
        </p>
        
        <a 
          href="/produtos" 
          style={{
            ...styles.addButton,
            display: 'inline-block',
            textDecoration: 'none',
            padding: '15px 35px',
            fontSize: isMobile ? '15px' : '17px'
          }}
        >
          📋 Ver Catálogo Completo
        </a>
      </div>

      {/* Carrossel de banners */}
      <div style={styles.bannerContainer}>
        <img
          src={isMobile ? banners[currentBannerIndex].mobile : banners[currentBannerIndex].desktop}
          alt={`Banner ${currentBannerIndex + 1}`}
          style={styles.bannerImage}
        />
        <button
          onClick={goToPrevBanner}
          style={{ ...styles.bannerNavButton, ...styles.prevButton }}
          aria-label="Banner anterior"
        >
          ‹
        </button>
        <button
          onClick={goToNextBanner}
          style={{ ...styles.bannerNavButton, ...styles.nextButton }}
          aria-label="Próximo banner"
        >
          ›
        </button>
        <div style={styles.bannerDots}>
          {banners.map((_, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentBannerIndex(index);
                resetBannerInterval();
              }}
              style={{
                ...styles.dot,
                ...(index === currentPage && styles.activeDot)
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Popup FIFO */}
      {showFifoPopup && selectedFifoItem && (
        <div style={styles.fifoPopupOverlay}>
          <div style={styles.fifoPopupContent}>
            <button 
              style={styles.fifoPopupClose}
              onClick={() => setShowFifoPopup(false)}
            >
              X
            </button>
            <div style={styles.fifoPopupImageContainer}>
              <video
                autoPlay
                loop
                muted
                playsInline
                style={styles.fifoPopupImage}
              >
                <source src={selectedFifoItem.video} type="video/mp4" />
                Seu navegador não suporta vídeo HTML5
              </video>
            </div>
            <a
              href={selectedFifoItem.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.fifoPopupButton}
            >
              COMPRAR AGORA
            </a>
          </div>
        </div>
      )}

      {/* ✅ CONTEÚDO SEO DINÂMICO E INVISÍVEL */}
      <div style={{
        opacity: '0', 
        height: '0', 
        overflow: 'hidden', 
        position: 'absolute', 
        pointerEvents: 'none',
        zIndex: -1
      }}>
        <h1>Ofertas PMG Atacadista - {featuredProducts.length} Produtos em Promoção</h1>
        
        <h2>Ofertas da Semana PMG Atacadista</h2>
        <p>
          Confira as ofertas especiais da PMG Atacadista desta semana. 
          {featuredProducts.map((product, index) => 
            ` ${product.name}${index < featuredProducts.length - 1 ? ',' : '.'}`
          ).join('')}
          Todas as ofertas PMG Atacadista são válidas por tempo limitado e possuem estoque garantido.
        </p>
        
        <h3>PMG Atacadista Ofertas por Categoria</h3>
        <p>
          PMG Atacadista ofertas em bebidas alcoólicas: whisky, gin, espumante. 
          PMG Atacadista ofertas em equipamentos para food service. 
          PMG Atacadista preços especiais para atacado com entrega rápida.
        </p>
        
        <h4>Como Comprar nas Ofertas PMG Atacadista</h4>
        <p>
          Para adquirir os produtos em oferta da PMG Atacadista, basta adicionar ao carrinho e finalizar o pedido. 
          PMG Atacadista aceita pagamento na entrega, cartão, PIX. 
          Entrega para São Paulo capital, interior SP, Sul de Minas e Sul do Rio de Janeiro.
        </p>
        
        <h5>PMG Atacadista Contato Ofertas</h5>
        <p>
          Telefone PMG Atacadista ofertas: (11) 91357-2902. 
          WhatsApp PMG Atacadista: (11) 91357-2902. 
          Endereço PMG Atacadista: Estrada Ferreira Guedes, 784 - Potuverá, Itapecerica da Serra - SP.
        </p>
      </div>

      {/* Rodapé */}
      <footer style={{
        marginTop: '60px',
        padding: '30px 15px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        borderTop: '2px solid #095400',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px 12px 0 0',
        boxShadow: '0 -2px 10px rgba(9, 84, 0, 0.1)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Container Principal do Rodapé */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          
          {/* Título do Rodapé */}
          <h3 style={{
            color: '#095400',
            fontSize: '18px',
            marginBottom: '25px',
            fontWeight: '600'
          }}>
            📋 Informações Legais
          </h3>

          {/* Links Principais em Grid Responsivo */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginBottom: '30px',
            width: '100%'
          }}>
            
            {/* Política de Privacidade */}
            <Link href="/politica-de-privacidade" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                minHeight: '50px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(9, 84, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#095400';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
              title="Política de Privacidade"
              aria-label="Leia nossa Política de Privacidade"
            >
              <span>🔒</span>
              Privacidade
            </a>
            </Link>

            {/* Política de Devolução e Reembolso */}
            <Link href="/politica-devolucao-e-reembolso" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                minHeight: '50px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(9, 84, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#095400';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
              title="Política de Devolução e Reembolso"
              aria-label="Leia nossa Política de Devolução e Reembolso"
            >
              <span>🔄</span>
              Política de Devolução e Reembolso
            </a>
            </Link>

            {/* Termos de Uso */}
            <Link href="/termos" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                minHeight: '50px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(9, 84, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#095400';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
              title="Termos de Uso"
              aria-label="Leia nossos Termos de Uso"
            >
              <span>📄</span>
              Termos
            </a>
            </Link>

            {/* Quem Somos */}
            <Link href="/quem-somos" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                minHeight: '50px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(9, 84, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#095400';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
              title="Quem Somos"
              aria-label="Conheça mais sobre nós"
            >
              <span>👥</span>
              Sobre
            </a>
            </Link>
          </div>

          {/* Linha Divisa */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #095400, transparent)',
            margin: '25px auto',
            maxWidth: '300px',
            width: '100%'
          }}></div>

          {/* Redes Sociais */}
          <div style={{
            marginBottom: '20px'
          }}>
            <h4 style={{
              color: '#095400',
              fontSize: '16px',
              marginBottom: '15px',
              fontWeight: '600'
            }}>
              Siga-nos nas Redes Sociais
            </h4>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/MarquesVendaspmg" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <img 
                  src="https://i.imgur.com/prULUUA.png" 
                  alt="Facebook" 
                  style={{
                    width: '20px',
                    height: '20px'
                  }}
                />
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/marquesvendaspmg" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <img 
                  src="https://i.imgur.com/I0ZZLjG.png" 
                  alt="Instagram" 
                  style={{
                    width: '20px',
                    height: '20px'
                  }}
                />
              </a>

              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@MarquesVendasPMG" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <img 
                  src="https://i.imgur.com/WfpZ8Gg.png" 
                  alt="YouTube" 
                  style={{
                    width: '20px',
                    height: '20px'
                  }}
                />
              </a>
            </div>
          </div>

          {/* Informações de Contato e Copyright */}
          <div style={{ 
            textAlign: 'center',
            paddingTop: '15px',
            borderTop: '1px solid #e0e0e0'
          }}>
            {/* TEXTO SEO - AGORA EM CIMA (Google lê primeiro) */}
            <p style={{ 
              margin: '0 0 15px 0', 
              fontSize: '11px', 
              color: '#999',
              lineHeight: '1.4',
              fontStyle: 'italic',
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: '0 10px'
            }}>
              <strong>PMG Atacadista</strong> - Seu fornecedor de confiança em <strong>São Paulo</strong>. 
              Especializados em <strong>atacado food service</strong> para restaurantes, bares e mercados. 
              Atendemos <strong>Itapecerica da Serra, Grande SP, Sul de Minas Gerais e Sul do Rio de Janeiro</strong>. 
              Trabalhamos com as melhores marcas do mercado para garantir qualidade e satisfação aos nossos clientes.
            </p>
            
            {/* INFORMAÇÕES DE CONTATO - AGORA EMBAIXO */}
            <p style={{ 
              margin: '8px 0', 
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.5'
            }}>
              © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
            </p>
            <p style={{ 
              margin: '8px 0', 
              fontSize: '12px', 
              color: '#888',
              lineHeight: '1.4'
            }}>
              Endereço: Estrada Ferreira Guedes, 784 - Potuverá 
              <br />
              CEP: 06885-150 - Itapecerica da Serra - SP
            </p>
            <p style={{ 
              margin: '8px 0', 
              fontSize: '12px', 
              color: '#888'
            }}>
              📞 Telefone: (11) 91357-2902
            </p>
          </div>
        </div>
      </footer>

      {/* ✅ ESTILOS CSS ADICIONAIS */}
      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(-10px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default OfertasPage;
