import React, { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import useTrackUser from '../hook/useTrackUser';
import { useRouter } from 'next/router';

// ========== DETECTAR SE ESTÁ RODANDO DENTRO DO APP ========== //
const isRunningInApp = () => {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  
  // Detecta WebView do Android
  const isWebView = ua.includes('wv') || 
                    ua.includes('androidwebview') ||
                    (ua.includes('android') && !ua.includes('chrome'));
  
  // Detecta PWA (app instalado)
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone === true;
  
  return isWebView || isPWA;
};

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
    'PORTO FERREIRA', 'POTIM', 'POTIRENDABA', 'PRADÓPOLIS', 'PRAIA GRANDE', 'PRESIDENTE PRUDENTE',	
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
      'CAMANDUCAIA', 'CONCEIÇÃO DOS OUROS', 'CONGONHAL',
      'DELFIM MOREIRA', 'EXTREMA', 'ITAJUBÁ', 'ITAMONTE',
      'ITANHANDU', 'ITAPEVA', 'MARIA DA FÉ', 'MONTE VERDE', 'OURO FINO',
      'PARAISÓPOLIS', 'PASSA QUATRO', 'PIRANGUINHO', 'POÇOS DE CALDAS', 'POUSO ALEGRE', 'SANTA RITA DO SAPUCAÍ',
      'SÃO LOURENÇO', 'TRÊS PONTAS', 'VARGINHA', 'VIRGÍNIA'
    ]
  }
};

// ========== PRODUTOS EM OFERTA ========== //
const featuredProducts = [
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
  { id: 359, name: 'WHISKY OLD PARR 12 ANOS 1 L', category: 'Ofertas', price: 136.87, image: 'https://www.marquesvendaspmg.shop/images/whisky-old-parr-12-anos-1-l-pmg-atacadista.jpg', gtin: '5000281004020' },
  { id: 360, name: 'WHISKY PASSPORT 1 L', category: 'Ofertas', price: 46.40, image: 'https://www.marquesvendaspmg.shop/images/whisky-passport-1-l-pmg-atacadista.jpg', gtin: '7891050000101' },
  { id: 361, name: 'WHISKY WHITE HORSE 1 L', category: 'Ofertas', price: 63.80, image: 'https://www.marquesvendaspmg.shop/images/whisky-white-horse-1-l-pmg-atacadista.jpg', gtin: '5000265001335' },
  { id: 327, name: 'VODKA ABSOLUT 1 L', category: 'Ofertas', price: 71.92, image: 'https://www.marquesvendaspmg.shop/images/vodka-absolut-1-l-pmg-atacadista.jpg', gtin: '7312040017034' },
  { id: 339, name: 'VODKA SMIRNOFF 998 ML', category: 'Ofertas', price: 31.32, image: 'https://www.marquesvendaspmg.shop/images/vodka-smirnoff-998-ml-pmg-atacadista.jpg', gtin: '7893218000473' },
  { id: 171, name: 'GIN BEEFEATER 750 ML', category: 'Ofertas', price: 84.56, image: 'https://www.marquesvendaspmg.shop/images/gin-beefeater-750-ml-pmg-atacadista.jpg', gtin: '5000329002537' },
  { id: 172, name: 'GIN BOMBAY SAPPHIRE 750 ML', category: 'Ofertas', price: 86.94, image: 'https://www.marquesvendaspmg.shop/images/gin-bombay-sapphire-750-ml-pmg-atacadista.jpg', gtin: '5010677715003' },
  { id: 173, name: 'GIN GORDON´S 750 ML', category: 'Ofertas', price: 59.74, image: 'https://www.marquesvendaspmg.shop/images/gin-gordons-750-ml-pmg-atacadista.jpg', gtin: '5000289020701' },
  { id: 175, name: 'GIN ROCK´S 1 L (CX 6 UN)', category: 'Ofertas', price: 168.43, image: 'https://www.marquesvendaspmg.shop/images/gin-rocks-1-l-pmg-atacadista.jpg', gtin: '7896037916123' },
  { id: 176, name: 'GIN ROCK´S STRAWBERRY 1 L (CX 6 UN)', category: 'Ofertas', price: 167.03, image: 'https://www.marquesvendaspmg.shop/images/gin-rocks-strawberry-1-l-pmg-atacadista.jpg', gtin: '7896037918646' },
  { id: 177, name: 'GIN SEAGERS 1 L', category: 'Ofertas', price: 34.80, image: 'https://www.marquesvendaspmg.shop/images/gin-seagers-1-l-pmg-atacadista.jpg', gtin: '7891121154009' },
  { id: 178, name: 'GIN TANQUERAY 750 ML', category: 'Ofertas', price: 97.44, image: 'https://www.marquesvendaspmg.shop/images/gin-tanqueray-750-ml-pmg-atacadista.jpg', gtin: '5000291020706' },
  { id: 156, name: 'ENERGÉTICO RED BULL 250 ML (CX 24 LT)', category: 'Ofertas', price: 199.51, image: 'https://www.marquesvendaspmg.shop/images/energetico-red-bull-250-ml-cx-24-lt-pmg-atacadista.jpg', gtin: '9002490100445' },
  { id: 61, name: 'ÁGUA TÔNICA ANTARCTICA LATA 350 ML (PCT 12 LT)', category: 'Ofertas', price: 42.80, image: 'https://www.marquesvendaspmg.shop/images/agua-tonica-antarctica-lata-350-ml-pct-12-lt-pmg-atacadista.jpg', gtin: '7891991002240' },
  { id: 62, name: 'ÁGUA TÔNICA ANTARCTICA ZERO AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Ofertas', price: 43.22, image: 'https://www.marquesvendaspmg.shop/images/agua-tonica-antarctica-zero-acucares-lata-350-ml-pct-12-lt-pmg-atacadista.jpg', gtin: '7891991000888' },
  { id: 198, name: 'LICOR 43 700 ML (CX 6 UN)', category: 'Ofertas', price: 805.93, image: 'https://www.marquesvendaspmg.shop/images/licor-43-700-ml-pmg-atacadista.jpg', gtin: '8410221110150' },
  { id: 199, name: 'LICOR 43 CHOCOLATE 700 ML', category: 'Ofertas', price: 168.19, image: 'https://www.marquesvendaspmg.shop/images/licor-43-chocolate-700-ml-pmg-atacadista.jpg', gtin: '8410221902915' },
  { id: 201, name: 'LICOR AMARULA CREAM 750 ML', category: 'Ofertas', price: 106.72, image: 'https://www.marquesvendaspmg.shop/images/licor-amarula-cream-750-ml-pmg-atacadista.jpg', gtin: '6001495062508' },
  { id: 203, name: 'LICOR COINTREAU 700 ML', category: 'Ofertas', price: 114.26, image: 'https://www.marquesvendaspmg.shop/images/licor-cointreau-700-ml-pmg-atacadista.jpg', gtin: '3035542004206' },
  { id: 157, name: 'ENERGÉTICO RED BULL MELANCIA 250 ML (CX 24 LT)', category: 'Ofertas', price: 199.51, image: 'https://www.marquesvendaspmg.shop/images/energetico-red-bull-melancia-250-ml-cx-24-lt-pmg-atacadista.jpg', gtin: '9002490248376' },
  { id: 158, name: 'ENERGÉTICO RED BULL SUGAR FREE 250 ML (CX 24 LT)', category: 'Ofertas', price: 199.51, image: 'https://www.marquesvendaspmg.shop/images/energetico-red-bull-sugar-free-250-ml-cx-24-lt-pmg-atacadista.jpg', gtin: '9002490250454' },
  { id: 202, name: 'LICOR BAILEYS 750 ML', category: 'Ofertas', price: 103.24, image: 'https://www.marquesvendaspmg.shop/images/licor-baileys-750-ml-pmg-atacadista.jpg', gtin: '5011013100132' },
  { id: 207, name: 'LICOR STOCK CREME DE CASSIS 720 ML (CX 6 UN)', category: 'Ofertas', price: 208.79, image: 'https://www.marquesvendaspmg.shop/images/licor-stock-creme-de-cassis-720-ml-pmg-atacadista.jpg', gtin: '7891121219005' },
  { id: 209, name: 'LICOR STOCK CURAÇAU BLUE 720 ML (CX 6 UN)', category: 'Ofertas', price: 208.79, image: 'https://www.marquesvendaspmg.shop/images/licor-stock-curacau-blue-720-ml-pmg-atacadista.jpg', gtin: '7891121213003' },
  { id: 330, name: 'VODKA ASKOV TRADICIONAL 900 ML (CX 12 UN)', category: 'Ofertas', price: 175.15, image: 'https://www.marquesvendaspmg.shop/images/vodka-askov-tradicional-900-ml-pmg-atacadista.jpg', gtin: '7896092502453' },
  { id: 333, name: 'VODKA CIROC 750 ML', category: 'Ofertas', price: 131.07, image: 'https://www.marquesvendaspmg.shop/images/vodka-ciroc-750-ml-pmg-atacadista.jpg', gtin: '5010103937009' },
  { id: 338, name: 'VODKA SKYY 980 ML', category: 'Ofertas', price: 34.80, image: 'https://www.marquesvendaspmg.shop/images/vodka-skyy-980-ml-pmg-atacadista.jpg', gtin: '7896010004007' },
  { id: 345, name: 'WHISKY BUCHANAN´S 12 ANOS 1 L', category: 'Ofertas', price: 167.28, image: 'https://www.marquesvendaspmg.shop/images/whisky-buchanans-12-anos-1-l-pmg-atacadista.jpg', gtin: '0000050196364' },
  { id: 68, name: 'APERITIVO APEROL 750 ML (CX 6 UN)', category: 'Ofertas', price: 250.55, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-aperol-750-ml-pmg-atacadista.jpg', gtin: '7891136057012' },
  { id: 70, name: 'APERITIVO CAMPARI 998 ML', category: 'Ofertas', price: 48.03, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-campari-998-ml-pmg-atacadista.jpg', gtin: '7896010006315' },
  { id: 362, name: 'XAROPE MONIN AMORA 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-amora-700-ml-pmg-atacadista.jpg', gtin: '7900314000228' },
  { id: 363, name: 'XAROPE MONIN CURAÇAU BLUE 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-curacau-blue-700-ml-pmg-atacadista.jpg', gtin: '7900314000082' },
  { id: 364, name: 'XAROPE MONIN FRAMBOESA 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-framboesa-700-ml-pmg-atacadista.jpg', gtin: '7900314000136' },
  { id: 365, name: 'XAROPE MONIN GENGIBRE 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-gengibre-700-ml-pmg-atacadista.jpg', gtin: '7900314000174' },
  { id: 366, name: 'XAROPE MONIN GRENADINE 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-grenadine-700-ml-pmg-atacadista.jpg', gtin: '7900314000068' },
  { id: 367, name: 'XAROPE MONIN LIMÃO SICILIANO 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-limao-siciliano-700-ml-pmg-atacadista.jpg', gtin: '7900314000013' },
  { id: 368, name: 'XAROPE MONIN MAÇÃ VERDE 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-maca-verde-700-ml-pmg-atacadista.jpg', gtin: '7900314000051' },
  { id: 369, name: 'XAROPE MONIN MARACUJÁ 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-maracuja-700-ml-pmg-atacadista.jpg', gtin: '7900314000129' },
  { id: 370, name: 'XAROPE MONIN MORANGO 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-morango-700-ml-pmg-atacadista.jpg', gtin: '7900314000075' },
  { id: 371, name: 'XAROPE MONIN TANGERINA 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-tangerina-700-ml-pmg-atacadista.jpg', gtin: '7900314000143' },
  { id: 1924, name: 'XAROPE MONIN CRANBERRY 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-cranberry-700-ml.png', gtin: '7900314000044' },
  { id: 1925, name: 'XAROPE MONIN KIWI 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-kiwi-700-ml.png', gtin: '7900314000112' },
  { id: 1926, name: 'XAROPE MONIN MELANCIA 700 ML', category: 'Ofertas', price: 62.04, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-melancia-700-ml.png', gtin: '7900314000167' },
  { id: 280, name: 'TEQUILA JOSE CUERVO ESPECIAL PRATA 750 ML', category: 'Ofertas', price: 97.44, image: 'https://www.marquesvendaspmg.shop/images/tequila-jose-cuervo-especial-prata-750-ml-cx-12-un-pmg-atacadista.jpg', gtin: '7501035011335' },
  { id: 281, name: 'TEQUILA JOSE CUERVO ESPECIAL REPOSADO OURO 750 ML', category: 'Ofertas', price: 111.36, image: 'https://www.marquesvendaspmg.shop/images/tequila-jose-cuervo-especial-reposado-ouro-750-ml-cx-12-un-pmg-atacadista.jpg', gtin: '7501035011328' },
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
  
// ========== ESTADOS PARA NOME DO USUÁRIO ========== //
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);
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
  
  // ========== ESTADO PARA DETECTAR APP ========== //
  const [isApp, setIsApp] = useState(false);
  
  // ========== ESTADO PARA DETECTAR SE O TEXTO ULTRAPASSOU 2 LINHAS ========== //
  const [needsExpand, setNeedsExpand] = useState({});
  
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

// ========== FUNÇÃO PARA VERIFICAR SE O TEXTO ULTRAPASSOU 2 LINHAS ========== //
const checkIfNeedsExpand = (productId, element) => {
  if (!element || !isMobile) return;
  
  // Pega a altura de uma linha
  const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20;
  
  // Altura máxima para 2 linhas (2 * lineHeight + um pequeno buffer)
  const maxHeight = lineHeight * 2.2;
  
  // Verifica se o texto ultrapassou 2 linhas
  const needs = element.scrollHeight > maxHeight;
  
  // Só atualiza se mudou
  setNeedsExpand(prev => {
    if (prev[productId] !== needs) {
      return { ...prev, [productId]: needs };
    }
    return prev;
  });
};
  
  const dynamicSEO = generateDynamicSEO(featuredProducts);
  
  // Estados LOCAIS apenas para controle da página (não do carrinho)
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showFifoPopup, setShowFifoPopup] = useState(false);
  const [selectedFifoItem, setSelectedFifoItem] = useState(null);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  // ✅ Efeito para verificar se o usuário voltou do login
  useEffect(() => {
    // Verifica se há uma mensagem de "login realizado com sucesso"
    const params = new URLSearchParams(window.location.search);
    const loginSuccess = params.get('login_success');
    
    if (loginSuccess === 'true') {
      // Remove o parâmetro da URL
      router.replace('/ofertas', undefined, { shallow: true });
      
      // Mostra mensagem de boas-vindas/bem-vindo de volta
      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #d4edda;
        color: #155724;
        padding: 15px 30px;
        border-radius: 8px;
        z-index: 9999;
        border: 2px solid #c3e6cb;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        font-weight: 600;
        font-size: 16px;
        max-width: 90%;
        text-align: center;
        animation: slideDown 0.5s ease-out;
      `;
      messageDiv.innerHTML = `
        ✅ Login realizado com sucesso! 
        <br />
        <span style="font-weight: normal; font-size: 14px;">
          Bem-vindo de volta à página de ofertas
        </span>
      `;
      document.body.appendChild(messageDiv);
      
      // Remove a mensagem após 4 segundos
      setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
          }
        }, 500);
      }, 4000);
    }
  }, [router]);

  // ✅ Feedback visual ao adicionar produto
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

// ========== CARREGAR DADOS DO USUÁRIO DA TABELA ========== //
useEffect(() => {
  const carregarDadosUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      
      // Busca os dados na tabela usuarios
      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('nome, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (usuarioData?.nome) {
        setUserName(usuarioData.nome);
      } else {
        // Fallback para o nome do Google
        setUserName(user.user_metadata?.full_name || user.email);
      }
      
      // Atualiza o avatar
      if (usuarioData?.avatar_url) {
        setUserAvatar(usuarioData.avatar_url);
      } else {
        setUserAvatar(user.user_metadata?.avatar_url || '');
      }
    }
  };
  
  // Executa ao carregar
  carregarDadosUsuario();
  
  // Listener para mudanças de autenticação (login/logout)
  const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
    carregarDadosUsuario();
  });
  
  return () => subscription?.unsubscribe();
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
    // Detecta se está no app
    const inApp = isRunningInApp();
    setIsApp(inApp);

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

    // ⭐ POPUP FIFO - SÓ MOSTRA SE NÃO FOR APP
    if (!inApp) {
      const fifoTimer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * fifoImages.length);
        setSelectedFifoItem(fifoImages[randomIndex]);
        setShowFifoPopup(true);
      }, 27000);
      
      return () => {
        clearInterval(bannerIntervalRef.current);
        clearTimeout(fifoTimer);
      };
    }

    return () => {
      clearInterval(bannerIntervalRef.current);
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
      position: 'relative'
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
      flexDirection: 'column'
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
      transition: 'transform 0.3s ease'
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
      backgroundColor: 'transparent',
      border: 'none',
      color: '#095400',
      fontSize: '12px',
      cursor: 'pointer',
      padding: '0',
      marginTop: '5px',
      fontWeight: '600',
      textDecoration: 'underline',
      outline: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      boxShadow: 'none'
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
      marginTop: 'auto'
    },
    addedButton: {
      backgroundColor: '#27AE60',
      cursor: 'default'
    },
    disabledButton: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
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
      transition: 'all 0.3s ease'
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
      fontWeight: 'bold'
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
          <a href="/" className="btn-top btn-top-primary">
            Página Inicial
          </a>
          
          {/* BOTÃO ONDE ENTREGAMOS */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => setShowCitiesMenu(!showCitiesMenu)}
              className="btn-top btn-top-danger"
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
                        borderRadius: '50%'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Conteúdo do Menu */}
                  <div style={{ padding: '15px' }}>
                    {/* SÃO PAULO */}
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
                          borderRadius: '4px'
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
                                        borderRadius: '4px'
                                      }}
                                    >
                                      ▼
                                    </button>
                                  )}
                                </div>
                                
                                {expandedCity === cityKey && hasDeliveryData && (
                                  <DeliveryDaysDisplay days={deliveryDaysData[cityKey]} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* RIO DE JANEIRO */}
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
                          borderRadius: '4px'
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
                                        borderRadius: '4px'
                                      }}
                                    >
                                      ▼
                                    </button>
                                  )}
                                </div>
                                
                                {expandedCity === cityKey && hasDeliveryData && (
                                  <DeliveryDaysDisplay days={deliveryDaysData[cityKey]} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* MINAS GERAIS */}
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
                          borderRadius: '4px'
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
                                        borderRadius: '4px'
                                      }}
                                    >
                                      ▼
                                    </button>
                                  )}
                                </div>
                                
                                {expandedCity === cityKey && hasDeliveryData && (
                                  <DeliveryDaysDisplay days={deliveryDaysData[cityKey]} />
                                )}
                              </div>
                            );
                          })}
                          
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
            <a className="btn-top btn-top-primary">
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
            <div key={product.id} className="product-card-hover" style={styles.productCard}>
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
                  <h4 
                    ref={(el) => {
                      if (el && isMobile) {
                        checkIfNeedsExpand(product.id, el);
                      }
                    }}
                    style={{
                      ...styles.productName,
                      WebkitLineClamp: expandedDescriptions[product.id] ? 'unset' : (isMobile ? 2 : 5)
                    }}
                  >
                    {product.name}
                  </h4>
                  
                  {isMobile && needsExpand[product.id] && (
                    <button 
                      onClick={() => toggleDescription(product.id)}
                      style={styles.showMoreButton}
                    >
                      {expandedDescriptions[product.id] ? '[Mostrar menos]' : '[Mostrar mais]'}
                    </button>
                  )}
                </div>
                
                <p style={product.price > 0 ? styles.productPrice : { ...styles.productPrice, color: '#999', textDecoration: 'line-through' }}>
                  {product.price > 0 ? `R$ ${product.price.toFixed(2)}` : 'Indisponível'}
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.price === 0}
                  className={!inCart && product.price > 0 ? 'add-to-cart-btn' : ''}
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
                ...(index === currentBannerIndex && styles.activeDot)
              }}
            />
          ))}
        </div>
      </div>
      
      {/* ⭐ Popup FIFO - SÓ MOSTRA SE NÃO FOR APP */}
      {!isApp && showFifoPopup && selectedFifoItem && (
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
              <a className="btn-top btn-top-primary" style={{
                minHeight: '50px',
                justifyContent: 'center',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <span>🔒</span>
                Privacidade
              </a>
            </Link>

            {/* Política de Devolução e Reembolso */}
            <Link href="/politica-devolucao-e-reembolso" passHref legacyBehavior>
              <a className="btn-top btn-top-primary" style={{
                minHeight: '50px',
                justifyContent: 'center',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <span>🔄</span>
                Política de Devolução e Reembolso
              </a>
            </Link>

            {/* Termos de Uso */}
            <Link href="/termos" passHref legacyBehavior>
              <a className="btn-top btn-top-primary" style={{
                minHeight: '50px',
                justifyContent: 'center',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <span>📄</span>
                Termos
              </a>
            </Link>

            {/* Quem Somos */}
            <Link href="/quem-somos" passHref legacyBehavior>
              <a className="btn-top btn-top-primary" style={{
                minHeight: '50px',
                justifyContent: 'center',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
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
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OfertasPage;
