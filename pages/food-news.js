import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { getRelatedProducts, getFeaturedProducts } from '../utils/product-utils';
import ShareButtons from "../components/ShareButtons";
import useTrackUser from '../hook/useTrackUser';
import { getAllArticles, getArticleBySlug } from '../lib/articles';

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
      'CAMANDUCAIA', 'CONCEIÇÃO DOS OUROS', 'CONGONHAL',
      'DELFIM MOREIRA', 'EXTREMA', 'ITAJUBÁ', 'ITAMONTE',
      'ITANHANDU', 'ITAPEVA', 'MARIA DA FÉ', 'MONTE VERDE', 'OURO FINO',
      'PARAISÓPOLIS', 'PASSA QUATRO', 'PIRANGUINHO', 'POÇOS DE CALDAS', 'POUSO ALEGRE', 'SANTA RITA DO SAPUCAÍ',
      'SÃO LOURENÇO', 'TRÊS PONTAS', 'VARGINHA', 'VIRGÍNIA'
    ]
  }
};

// ========== SCHEMA MARKUP LOCALBUSINESS ========== //
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "priceRange": "$$",
  "name": "Marques Vendas PMG",
  "image": "https://i.imgur.com/jrERRsC.png",
  "telephone": "+55-11-91357-2902",
  "areaServed": [
    {
      "@type": "AdministrativeArea",
      "name": "Grande São Paulo",
      "description": "Atacado Grande São Paulo, Distribuidora Grande SP, Fornecedor alimentos Grande São Paulo, Atacadista food service Grande SP"
    },
    {
      "@type": "AdministrativeArea", 
      "name": "Interior de São Paulo",
      "description": "Atacado interior São Paulo, Distribuidora interior SP, Fornecedor interior São Paulo, Atacadista food service interior SP"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Capital de São Paulo",
      "description": "Atacado São Paulo capital, Distribuidora São Paulo, Fornecedor alimentos São Paulo, Atacadista bebidas São Paulo, Food service São Paulo"
    },
    {
      "@type": "City",
      "name": "Santo Amaro - SP",
      "description": "Atacado Santo Amaro, Distribuidora Santo Amaro, Fornecedor alimentos Santo Amaro, Atacadista bebidas Santo Amaro, Food service Santo Amaro SP"
    },
    {
      "@type": "City",
      "name": "Santo André - SP",
      "description": "Atacado Santo André, Distribuidora Santo André, Fornecedor Santo André, Atacadista alimentos Santo André, Food service Santo André SP"
    },
    {
      "@type": "City",
      "name": "Barueri - SP", 
      "description": "Atacado Barueri, Distribuidora Barueri, Fornecedor alimentos Barueri, Atacadista bebidas Barueri, Food service Barueri SP"
    },
    {
      "@type": "City",
      "name": "São Bernardo do Campo - SP",
      "description": "Atacado São Bernardo do Campo, Distribuidora São Bernardo, Fornecedor São Bernardo, Atacadista alimentos São Bernardo, Food service São Bernardo SP"
    },
    {
      "@type": "City",
      "name": "Mauá - SP",
      "description": "Atacado Mauá, Distribuidora Mauá, Fornecedor alimentos Mauá, Atacadista bebidas Mauá, Food service Mauá SP"
    },
    {
      "@type": "City",
      "name": "Guarulhos - SP",
      "description": "Atacado Guarulhos, Distribuidora Guarulhos, Fornecedor alimentos Guarulhos, Atacadista bebidas Guarulhos, Food service Guarulhos SP"
    },
    {
      "@type": "City",
      "name": "Arujá - SP",
      "description": "Atacado Arujá, Distribuidora Arujá, Fornecedor alimentos Arujá, Atacadista bebidas Arujá, Food service Arujá SP"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Sul de Minas Gerais",
      "description": "Atacado Sul de Minas, Distribuidora Sul de Minas, Fornecedor alimentos Sul de Minas, Atacadista bebidas Sul de Minas, Food service Sul de Minas"
    },
    {
      "@type": "City",
      "name": "Extrema - MG",
      "description": "Atacado Extrema MG, Distribuidora Extrema, Fornecedor alimentos Extrema, Atacadista bebidas Extrema, Food service Extrema, Atacado para restaurantes Extrema"
    },
    {
      "@type": "City",
      "name": "Poços de Caldas - MG",
      "description": "Atacado Poços de Caldas, Distribuidora Poços de Caldas, Fornecedor alimentos Poços de Caldas, Atacadista bebidas Poços de Caldas, Food service Poços de Caldas MG"
    },
    {
      "@type": "City",
      "name": "São Lourenço - MG",
      "description": "Atacado São Lourenço, Distribuidora São Lourenço, Fornecedor alimentos São Lourenço, Atacadista bebidas São Lourenço, Food service São Lourenço MG"
    },
    {
      "@type": "City",
      "name": "Itajubá - MG",
      "description": "Atacado Itajubá, Distribuidora Itajubá, Fornecedor alimentos Itajubá, Atacadista bebidas Itajubá, Food service Itajubá, Atacado para mercados Itajubá"
    },
    {
      "@type": "City",
      "name": "Pouso Alegre - MG",
      "description": "Atacado Pouso Alegre, Distribuidora Pouso Alegre, Fornecedor alimentos Pouso Alegre, Atacadista bebidas Pouso Alegre, Food service Pouso Alegre MG"
    },
    {
      "@type": "City",
      "name": "Camanducaia - MG",
      "description": "Atacado Camanducaia, Distribuidora Camanducaia, Fornecedor alimentos Camanducaia, Atacadista bebidas Camanducaia, Food service Camanducaia MG"
    },
    {
      "@type": "City",
      "name": "Varginha - MG",
      "description": "Atacado Varginha, Distribuidora Varginha, Fornecedor alimentos Varginha, Atacadista bebidas Varginha, Food service Varginha, Atacado para restaurantes Varginha"
    },
    {
      "@type": "City",
      "name": "Três Pontas - MG",
      "description": "Atacado Três Pontas, Distribuidora Três Pontas, Fornecedor alimentos Três Pontas, Atacadista bebidas Três Pontas, Food service Três Pontas MG"
    },
    {
      "@type": "City",
      "name": "Virgínia - MG",
      "description": "Atacado Virgínia MG, Distribuidora Virgínia, Fornecedor alimentos Virgínia, Atacadista bebidas Virgínia, Food service Virgínia MG"
    },
    {
      "@type": "City",
      "name": "Santa Rita do Sapucaí - MG",
      "description": "Atacado Santa Rita do Sapucaí, Distribuidora Santa Rita do Sapucaí, Fornecedor alimentos Santa Rita, Atacadista bebidas Santa Rita, Food service Santa Rita do Sapucaí"
    },
    {
      "@type": "AdministrativeArea", 
      "name": "Sul do Rio de Janeiro",
      "description": "Atacado Sul do Rio de Janeiro, Distribuidora Sul do RJ, Fornecedor alimentos Sul do Rio, Atacadista bebidas Sul do RJ, Food service Sul do Rio"
    },
    {
      "@type": "City",
      "name": "Paraty - RJ",
      "description": "Atacado Paraty, Distribuidora Paraty, Fornecedor alimentos Paraty, Atacadista bebidas Paraty, Food service Paraty RJ"
    },
    {
      "@type": "City",
      "name": "Volta Redonda - RJ",
      "description": "Atacado Volta Redonda, Distribuidora Volta Redonda, Fornecedor alimentos Volta Redonda, Atacadista bebidas Volta Redonda, Food service Volta Redonda RJ"
    },
    {
      "@type": "City", 
      "name": "Resende - RJ",
      "description": "Atacado Resende, Distribuidora Resende, Fornecedor alimentos Resende, Atacadista bebidas Resende, Food service Resende RJ"
    },
    {
      "@type": "City",
      "name": "Barra Mansa - RJ",
      "description": "Atacado Barra Mansa, Distribuidora Barra Mansa, Fornecedor alimentos Barra Mansa, Atacadista bebidas Barra Mansa, Food service Barra Mansa RJ"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Estrada Ferreira Guedes, 784 - Potuverá",
    "postalCode": "06885-150",
    "addressLocality": "Itapecerica da Serra",
    "addressRegion": "SP",
    "addressCountry": "BR"
  }
};

// ========== FUNÇÃO PARA CRIAR SLUGS (URLS AMIGÁVEIS) ========== //
function gerarSlug(texto) {
  if (!texto) return '';
  
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .substring(0, 80);
}

// ========== FUNÇÃO PARA GERAR URL AMIGÁVEL ========== //
function getArticleUrl(article) {
  if (!article || !article.title) return '/food-news';
  const slug = gerarSlug(article.title);
  return `/food-news/${slug}`;
}

// ========== FUNÇÃO PARA PROCESSAR LINKS NO CONTEÚDO ========== //
function processarLinksConteudo(conteudoHTML, articlesArray) {
  if (!conteudoHTML || !articlesArray || !Array.isArray(articlesArray)) {
    return conteudoHTML;
  }
  
  let conteudoProcessado = conteudoHTML;
  
  // Primeiro, cria um mapa de IDs para artigos para busca rápida
  const artigoPorId = {};
  articlesArray.forEach(artigo => {
    artigoPorId[artigo.id] = artigo;
  });
  
  // Encontra TODOS os links no conteúdo
  const regexLinks = /href="\/food-news\?page=(\d+)(?:#artigo-\d+)?"/gi;
  const matches = [...conteudoHTML.matchAll(regexLinks)];
  
  // Para cada link encontrado, substitui
  matches.forEach(match => {
    const idArtigo = parseInt(match[1]);
    const linkCompleto = match[0];
    
    if (artigoPorId[idArtigo]) {
      const urlAmigavel = getArticleUrl(artigoPorId[idArtigo]);
      const novoLink = `href="${urlAmigavel}"`;
      conteudoProcessado = conteudoProcessado.replace(linkCompleto, novoLink);
    }
  });
  
  return conteudoProcessado;
}

// ⬇️⬇️⬇️ getServerSideProps ATUALIZADO ⬇️⬇️⬇️ //
export async function getServerSideProps(context) {
  const { query } = context;
  const slug = query.slug;

  let allArticles = [];

  try {
    // 🔥 AGORA USA fetch PARA CARREGAR O index.json
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://marquespmg.github.io'  // ← SUBSTITUA PELA URL DO SEU SITE
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/index.json`);
    if (response.ok) {
      allArticles = await response.json();
    } else {
      console.error('❌ Erro ao carregar index.json:', response.status);
    }
  } catch (error) {
    console.error('❌ Erro ao carregar artigos:', error);
  }

  // Se tiver slug, busca o artigo específico
  if (slug && allArticles.length > 0) {
    const article = allArticles.find(a => {
      const articleSlug = gerarSlug(a.title);
      return articleSlug === slug;
    });
    if (article) {
      return {
        props: {
          initialPage: article.id,
          allArticles: allArticles,
          currentSlug: slug
        }
      };
    }
  }

  // Se não tiver slug, carrega o primeiro artigo
  return {
    props: {
      initialPage: allArticles[0]?.id || 1,
      allArticles: allArticles,
      currentSlug: null
    }
  };
}

// ⬇️⬇️⬇️ COMPONENTE PRINCIPAL ⬇️⬇️⬇️ //
export default function FoodNews({ initialPage, allArticles: initialArticles, currentSlug }) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const articlesPerPage = 1;
  const [isClient, setIsClient] = useState(false);
  const [showIndex, setShowIndex] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  
  // Use initialArticles como a lista de artigos
  const [articles, setArticles] = useState(initialArticles || []);
  
  // Estados para o cabeçalho
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

  const [windowWidth, setWindowWidth] = useState(0);
  
  // Estados do usuário
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  
  const articleRefs = useRef([]);
  useTrackUser();

// ========== CARREGAR DIAS DE ENTREGA ========== //
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

  useEffect(() => {
    setIsClient(true);
    // Simulação de usuário logado
    setUser({ email: "cliente@exemplo.com" });
    setUserName("Cliente");
    setUserAvatar("");
    
    // Inicializa largura da janela
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      
      // Atualiza URL se for uma URL antiga
      const atualizarUrlAmigavel = () => {
        const artigoAtual = articles.find(a => a.id === currentPage);
        if (artigoAtual) {
          const urlAtual = window.location.pathname + window.location.search;
          const urlNova = getArticleUrl(artigoAtual);
          
          // Se a URL atual não for amigável, atualiza
          if (!urlAtual.includes(urlNova) && !urlAtual.includes('slug=')) {
            window.history.replaceState({}, '', urlNova);
          }
        }
      };
      
      const checkScreenSize = () => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        setShowIndex(!mobile);
        setWindowWidth(window.innerWidth);
      };
      
      checkScreenSize();
      atualizarUrlAmigavel();
      window.addEventListener('resize', checkScreenSize);
      
      return () => {
        window.removeEventListener('resize', checkScreenSize);
      };
    }
  }, [currentPage, articles]);

  const toggleRegion = (region) => {
    setOpenRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

  const totalPages = articles.length;
  const currentArticle = articles.find(article => article.id === currentPage) || articles[0];

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Atualiza URL no navegador
    const artigoAtual = articles.find(a => a.id === pageNumber);
    if (artigoAtual && typeof window !== 'undefined') {
      const novaURL = getArticleUrl(artigoAtual);
      window.history.pushState({}, '', novaURL);
    }
  };

  const goToArticle = (articleId) => {
    handlePageChange(articleId);
    if (isMobile) {
      setShowIndex(false);
    }
  };

// ========== COMPONENTE DE ÍNDICE COM BUSCA E FILTROS ========== //
const ArticleIndex = () => {
  // Estados para busca e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(null); // Começa como null (nenhum selecionado)
  const [filteredArticles, setFilteredArticles] = useState([]); // Começa vazio
  const [showResults, setShowResults] = useState(false); // Controla se mostra resultados
  
  // Categorias disponíveis
  const categories = [
    { id: 'todos', label: '📰 Todos', icon: '📰' },
    { id: 'receitas', label: '🍳 Receitas', icon: '🍳' },
    { id: 'dicas', label: '💡 Dicas', icon: '💡' },
    { id: 'produtos', label: '🏷️ Produtos', icon: '🏷️' }
  ];
  
  // Função para mapear categoria do artigo para o filtro
  const getArticleFilterCategory = (articleCategory) => {
    const categoryLower = articleCategory?.toLowerCase() || '';
    
    if (categoryLower.includes('receita') || categoryLower.includes('pizza') || categoryLower.includes('farinha')) {
      return 'receitas';
    }
    if (categoryLower.includes('dica') || categoryLower.includes('guia') || categoryLower.includes('como')) {
      return 'dicas';
    }
    if (categoryLower.includes('produto') || categoryLower.includes('óleo') || categoryLower.includes('farináceos')) {
      return 'produtos';
    }
    return 'produtos';
  };
  
  // Efeito para filtrar artigos quando busca ou filtro mudar
  useEffect(() => {
    let result = articles;
    
    // Se tem termo de busca, mostra resultados independente do filtro
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.description.toLowerCase().includes(term)
      );
      setShowResults(true);
    } 
    // Se não tem busca, mas tem filtro ativo
    else if (activeFilter !== null) {
      if (activeFilter !== 'todos') {
        result = result.filter(article => 
          getArticleFilterCategory(article.category) === activeFilter
        );
      }
      setShowResults(true);
    }
    // Não tem busca e não tem filtro
    else {
      setShowResults(false);
      setFilteredArticles([]);
      return;
    }
    
    setFilteredArticles(result);
  }, [searchTerm, activeFilter, articles]);
  
  // Função para selecionar um filtro
  const selectFilter = (filterId) => {
    // Se clicar no mesmo filtro que já está ativo, desativa
    if (activeFilter === filterId) {
      setActiveFilter(null);
      // Se não tem busca, esconde os resultados
      if (searchTerm.trim() === '') {
        setShowResults(false);
        setFilteredArticles([]);
      }
    } else {
      setActiveFilter(filterId);
    }
  };
  
  // Função para limpar busca
  const clearSearch = () => {
    setSearchTerm('');
    // Se não tem filtro ativo, esconde os resultados
    if (activeFilter === null) {
      setShowResults(false);
      setFilteredArticles([]);
    }
  };
  
  // Função para fechar/limpar tudo
  const clearAll = () => {
    setSearchTerm('');
    setActiveFilter(null);
    setShowResults(false);
    setFilteredArticles([]);
  };
  
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: isMobile ? '15px' : '20px',
      margin: isMobile ? '0 8px 15px 8px' : '0 0 25px 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      border: '1px solid #e8e8e8',
    }}>
      
      {/* CABEÇALHO COM TÍTULO */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{
          color: '#095400',
          fontSize: isMobile ? '1.1rem' : '1.3rem',
          margin: 0,
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📚</span>
          Food News
          <span style={{
            fontSize: '0.75rem',
            backgroundColor: '#e8f5e8',
            padding: '2px 8px',
            borderRadius: '20px',
            color: '#095400'
          }}>
            {articles.length} artigos
          </span>
        </h2>
        
        {/* Botão de limpar quando tiver resultados */}
        {(searchTerm || activeFilter) && (
          <button
            onClick={clearAll}
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            ✕ Limpar
          </button>
        )}
      </div>
      
      {/* CAMPO DE BUSCA - SEMPRE VISÍVEL E FUNCIONAL */}
      <div style={{
        marginBottom: '15px',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8f8f8',
          border: searchTerm ? '2px solid #095400' : '1px solid #e0e0e0',
          borderRadius: '25px',
          padding: '0 15px',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ fontSize: '18px', color: '#999' }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar artigos por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: isMobile ? '12px 10px' : '12px 15px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: isMobile ? '14px' : '15px',
              outline: 'none',
              color: '#333'
            }}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#999',
                padding: '5px',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* BOTÕES DE FILTRO */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: showResults ? '20px' : '0',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {categories.map(cat => {
          const isActive = activeFilter === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => selectFilter(cat.id)}
              style={{
                backgroundColor: isActive ? '#095400' : '#f8f8f8',
                color: isActive ? 'white' : '#555',
                border: isActive ? '2px solid #095400' : '1px solid #ddd',
                padding: isMobile ? '8px 16px' : '10px 20px',
                borderRadius: '30px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 2px 8px rgba(9, 84, 0, 0.3)' : 'none',
                opacity: searchTerm ? 0.6 : 1
              }}
              disabled={!!searchTerm}
              title={searchTerm ? "Limpe a busca para usar os filtros" : ""}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
      
      {/* AVISO QUANDO BUSCA ESTÁ ATIVA */}
      {searchTerm && (
        <div style={{
          marginBottom: '15px',
          padding: '6px 12px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#e67e22',
          textAlign: 'center'
        }}>
          🔍 Resultados da busca por: <strong>"{searchTerm}"</strong>
          {activeFilter && ` (filtro ignorado)`}
        </div>
      )}
      
      {/* MOSTRA OS RESULTADOS QUANDO TIVER */}
      {showResults && (
        <>
          {/* CONTADOR DE RESULTADOS */}
          <div style={{
            marginBottom: '15px',
            padding: '8px 12px',
            backgroundColor: '#f0f8f0',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '13px',
              color: '#095400',
              fontWeight: '600'
            }}>
              📄 {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
            </span>
            
            {filteredArticles.length > 0 && (
              <span style={{
                fontSize: '11px',
                color: '#666'
              }}>
                Clique no artigo para ler
              </span>
            )}
          </div>
          
          {/* MENSAGEM QUANDO NÃO ENCONTRA ARTIGOS */}
          {filteredArticles.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: '#f8f8f8',
              borderRadius: '8px',
              color: '#666'
            }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>🔍</span>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                Nenhum artigo encontrado
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
                {searchTerm 
                  ? `Nenhum artigo com "${searchTerm}" foi encontrado` 
                  : 'Nenhum artigo nesta categoria'}
              </p>
              <button
                onClick={clearAll}
                style={{
                  marginTop: '15px',
                  backgroundColor: '#095400',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Limpar busca
              </button>
            </div>
          )}
          
          {/* LISTA DE ARTIGOS FILTRADOS - COM IMAGEM CORRIGIDA */}
          {filteredArticles.length > 0 && (
            <div style={{
              maxHeight: isMobile ? '400px' : '500px',
              overflowY: 'auto',
              paddingRight: '5px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '10px' : '12px'
              }}>
                {filteredArticles.map(article => (
                  <a
                    key={article.id}
                    href={getArticleUrl(article)}
                    onClick={(e) => {
                      e.preventDefault();
                      goToArticle(article.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? '12px' : '15px',
                      padding: isMobile ? '10px' : '12px',
                      backgroundColor: currentPage === article.id ? '#f0f8f0' : '#f8f8f8',
                      border: currentPage === article.id ? '2px solid #095400' : '1px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                      width: '100%',
                      boxSizing: 'border-box',
                      position: 'relative',
                      minHeight: isMobile ? '80px' : '90px',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    {/* Badge do ID */}
                    <div style={{
                      position: 'absolute',
                      top: isMobile ? '-5px' : '-7px',
                      left: isMobile ? '-5px' : '-7px',
                      backgroundColor: '#095400',
                      color: 'white',
                      width: isMobile ? '24px' : '28px',
                      height: isMobile ? '24px' : '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '0.75rem' : '0.85rem',
                      fontWeight: 'bold',
                      zIndex: 5,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      border: '2px solid white'
                    }}>
                      {article.id}
                    </div>
                    
                    {/* IMAGEM DO ARTIGO - PROPORÇÃO 16:9 */}
                    <div style={{
                      width: isMobile ? '80px' : '100px',
                      height: isMobile ? '45px' : '56px',
                      flexShrink: 0,
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid #ddd',
                      backgroundColor: '#f0f0f0',
                      marginLeft: '5px'
                    }}>
                      <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    </div>
                    
                    {/* Informações do artigo */}
                    <div style={{ 
                      flex: 1, 
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '4px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '2px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          backgroundColor: '#e8f5e8',
                          color: '#095400',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: isMobile ? '0.7rem' : '0.75rem',
                          fontWeight: '600',
                          whiteSpace: 'nowrap'
                        }}>
                          {article.category}
                        </span>
                        <span style={{ 
                          color: '#666',
                          fontSize: isMobile ? '0.65rem' : '0.7rem',
                          whiteSpace: 'nowrap'
                        }}>
                          {article.readTime}
                        </span>
                      </div>
                      
                      <h4 style={{
                        fontSize: isMobile ? '0.85rem' : '0.95rem',
                        margin: 0,
                        color: '#333',
                        fontWeight: '600',
                        lineHeight: '1.3',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {article.title}
                      </h4>
                    </div>
                    
                    {/* Seta indicadora */}
                    <div style={{
                      color: '#095400',
                      fontSize: '16px',
                      opacity: 0.5,
                      marginRight: '5px'
                    }}>
                      →
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* MENSAGEM INICIAL (sem busca e sem filtro) */}
      {!showResults && !searchTerm && activeFilter === null && (
        <div style={{
          textAlign: 'center',
          padding: '30px 20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '8px',
          color: '#666',
          marginTop: '10px'
        }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>🔍</span>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
            Digite algo no campo de busca ou clique em uma categoria
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>
            Temos {articles.length} artigos no total
          </p>
        </div>
      )}
    </div>
  );
};

  // COMPONENTE DE NAVEGAÇÃO RÁPIDA
  const QuickNavigation = () => {
    const currentIndex = articles.findIndex(a => a.id === currentPage);
    const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
    const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

    return (
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        margin: isMobile ? '20px 8px 0 8px' : '30px 0 0 0',
        padding: isMobile ? '12px' : '18px',
        backgroundColor: '#f8f8f8',
        borderRadius: '10px',
        border: '1px solid #e0e0e0',
        gap: isMobile ? '12px' : '15px'
      }}>
        {prevArticle && (
          <a
            href={getArticleUrl(prevArticle)}
            onClick={(e) => {
              e.preventDefault();
              goToArticle(prevArticle.id);
            }}
            style={{
              flex: isMobile ? '0 0 auto' : 1,
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '8px' : '12px',
              padding: isMobile ? '10px' : '12px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              boxSizing: 'border-box',
              minHeight: '70px',
              width: '100%',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.1rem' : '1.3rem',
              flexShrink: 0 
            }}>
              ←
            </div>
            <div style={{ 
              flex: 1,
              minWidth: 0
            }}>
              <div style={{
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                color: '#666',
                marginBottom: '3px',
                fontWeight: '600'
              }}>
                Artigo anterior
              </div>
              <div style={{
                fontSize: isMobile ? '0.8rem' : '0.85rem',
                fontWeight: '600',
                color: '#333',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {prevArticle.title}
              </div>
            </div>
          </a>
        )}

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '10px' : '12px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd',
          minWidth: isMobile ? '100%' : 'auto',
          order: isMobile ? -1 : 0,
          textAlign: 'center',
          gap: '3px'
        }}>
          <div style={{
            fontSize: isMobile ? '0.75rem' : '0.8rem',
            color: '#666',
            fontWeight: '600'
          }}>
            Posição
          </div>
          <div style={{
            fontSize: isMobile ? '1.2rem' : '1.3rem',
            fontWeight: '700',
            color: '#095400',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ fontSize: '1em' }}>📄</span>
            {currentPage} <span style={{ color: '#999', fontWeight: '400' }}>/</span> {totalPages}
          </div>
          <div style={{
            fontSize: isMobile ? '0.65rem' : '0.7rem',
            color: '#888',
            marginTop: '1px'
          }}>
            Total: {totalPages}
          </div>
        </div>

        {nextArticle && (
          <a
            href={getArticleUrl(nextArticle)}
            onClick={(e) => {
              e.preventDefault();
              goToArticle(nextArticle.id);
            }}
            style={{
              flex: isMobile ? '0 0 auto' : 1,
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '8px' : '12px',
              padding: isMobile ? '10px' : '12px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              boxSizing: 'border-box',
              minHeight: '70px',
              width: '100%',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{ 
              flex: 1,
              minWidth: 0,
              textAlign: 'right'
            }}>
              <div style={{
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                color: '#666',
                marginBottom: '3px',
                fontWeight: '600'
              }}>
                Próximo artigo
              </div>
              <div style={{
                fontSize: isMobile ? '0.8rem' : '0.85rem',
                fontWeight: '600',
                color: '#333',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'right'
              }}>
                {nextArticle.title}
              </div>
            </div>
            <div style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.1rem' : '1.3rem',
              flexShrink: 0 
            }}>
              →
            </div>
          </a>
        )}
      </div>
    );
  };

  return (
    <>
      <Head key={`page-${currentPage}`}>
        <title>{currentArticle ? `${currentArticle.title} | PMG Atacadista` : 'Blog PMG Atacadista'}</title>
        <meta name="description" content={currentArticle ? currentArticle.description : "Blog PMG Atacadista"} />
        
        <meta property="og:title" content={currentArticle ? currentArticle.title : "Blog PMG Atacadista"} />
        <meta property="og:description" content={currentArticle ? currentArticle.description : "Blog PMG Atacadista"} />
        <meta property="og:image" content={currentArticle?.image ? `https://www.marquesvendaspmg.shop${currentArticle.image}` : "https://i.imgur.com/OnyaPpF.png"} />
        <meta property="og:url" content={`https://www.marquesvendaspmg.shop${getArticleUrl(currentArticle)}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Marques Vendas PMG" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentArticle ? currentArticle.title : "Blog PMG Atacadista"} />
        <meta name="twitter:description" content={currentArticle ? currentArticle.description : "Blog PMG Atacadista"} />
        <meta  name="twitter:image"  content={currentArticle?.image ? `https://www.marquesvendaspmg.shop${currentArticle.image}` : "https://i.imgur.com/OnyaPpF.png"} />        
        
        {/* URL CANÔNICA COM SLUG AMIGÁVEL */}
        <link 
          rel="canonical" 
          href={`https://www.marquesvendaspmg.shop${getArticleUrl(currentArticle)}`} 
        />
        
        {/* SCHEMA MARKUP LOCALBUSINESS */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </Head>

      {/* ESTILOS GLOBAIS LIMPOS */}
      <style jsx global>{`
        * {
          box-sizing: border-box !important;
        }
        
        body {
          overflow-x: hidden !important;
          -webkit-text-size-adjust: 100%;
          margin: 0;
          padding: 0;
          background-color: #ffffff;
        }

        /* CORREÇÃO DO BADGE */
        .index-article-item {
          position: relative !important;
        }

        /* IMAGENS RESPONSIVAS */
        img {
          max-width: 100% !important;
          height: auto !important;
        }

        /* CONTAINERS RESPONSIVOS */
        .article-content {
          max-width: 100% !important;
          overflow-x: hidden !important;
        }

        /* TABELAS RESPONSIVAS */
        .table-container {
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }

        /* AJUSTES PARA MOBILE */
        @media (max-width: 768px) {
          [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          
          .article-table th,
          .article-table td {
            padding: 6px 4px !important;
            font-size: 12px !important;
          }
        }

        /* SCROLLBAR SUAVE */
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #095400;
          border-radius: 2px;
        }
      `}</style>

      {/* CONTAINER PRINCIPAL */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '0 8px' : '0 15px',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif"
      }}>
        
        {/* HEADER COM CABEÇALHO PERSONALIZADO */}
        <header style={{
          textAlign: 'center',
          padding: isMobile ? '15px 0' : '25px 0',
          marginBottom: isMobile ? '10px' : '15px'
        }}>
          
          <Link href="/">
            <img 
              src="https://i.imgur.com/pBH5WpZ.png" 
              alt="PMG Atacadista - Distribuidora Food Service" 
              style={{ 
                width: isMobile ? '140px' : '200px',
                margin: isMobile ? '0 0 10px 0' : '0 0 15px 0',
                cursor: 'pointer'
              }} 
            />
          </Link>
          
          {/* CABEÇALHO PERSONALIZADO - BOTÃO DE CIDADES */}
          {user && (
            <div style={{
              backgroundColor: '#095400',
              color: 'white',
              padding: windowWidth > 768 ? '10px 15px' : '8px 10px',
              borderRadius: '8px',
              marginBottom: windowWidth > 768 ? '15px' : '10px',
              width: '100%'
            }}>
              {/* Linha 1: Mensagem de boas-vindas COMPACTA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {userAvatar && (
                  <img 
                    src={userAvatar} 
                    alt="Foto do usuário"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                )}
                <p style={{
                  fontSize: windowWidth > 768 ? '14px' : '12px',
                  fontWeight: '600',
                  margin: 0,
                  textAlign: 'center'
                }}>
                  {userName ? `Olá ${userName}, seja bem-vindo(a)!` : `Olá ${user.email}, seja bem-vindo(a)!`}
                </p>
              </div>
              
              {/* Linha 2: Botões COMPACTOS */}
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {/* BOTÃO PÁGINA INICIAL */}
                <a href="/" style={{
                  backgroundColor: 'white',
                  color: '#095400',
                  border: '1px solid #095400',
                  padding: windowWidth > 768 ? '6px 10px' : '5px 8px',
                  borderRadius: '16px',
                  fontSize: windowWidth > 768 ? '13px' : '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  ':hover': {
                    backgroundColor: '#095400',
                    color: 'white'
                  }
                }}>
                  Página Inicial
                </a>
                
                {/* BOTÃO ONDE ENTREGAMOS - CENTRALIZADO */}
                <div style={{ 
                  position: 'relative', 
                  display: 'inline-block'
                }}>
                  <button
                    onClick={() => setShowCitiesMenu(!showCitiesMenu)}
                    style={{
                      backgroundColor: '#e53935',
                      color: 'white',
                      border: 'none',
                      padding: windowWidth > 768 ? '6px 10px' : '5px 8px',
                      borderRadius: '16px',
                      fontSize: windowWidth > 768 ? '13px' : '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 4px rgba(229, 57, 53, 0.3)',
                      ':hover': {
                        backgroundColor: '#c62828',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 3px 6px rgba(229, 57, 53, 0.4)'
                      }
                    }}
                  >
                    Onde Entregamos
                    <span style={{
                      transition: 'transform 0.3s',
                      fontSize: '10px',
                      transform: showCitiesMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ▼
                    </span>
                  </button>
                  
                  {/* MENU DROPDOWN - DO JEITO ORIGINAL QUE VOCÊ MANDOU */}
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
                      
                      {/* Container do Menu - Centralizado abaixo do botão */}
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
                          marginTop: '5px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Cabeçalho do Menu */}
                        <div style={{
                          padding: '10px 12px',
                          borderBottom: '1px solid #eee',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#fff5f5'
                        }}>
                          <strong style={{ 
                            color: '#095400', 
                            fontSize: windowWidth > 768 ? '15px' : '13px',
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
                              fontSize: '18px',
                              fontWeight: 'bold',
                              padding: '0',
                              width: '22px',
                              height: '22px',
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
                        <div style={{ padding: '12px' }}>
                          
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
                          padding: '8px 12px',
                          borderTop: '1px solid #eee',
                          fontSize: '11px',
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
                
                {/* BOTÃO OFERTAS (SUBSTITUI PERGUNTAS) */}
                <Link href="/ofertas" legacyBehavior>
                  <a style={{
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    border: '1px solid #ff6b35',
                    padding: windowWidth > 768 ? '6px 10px' : '5px 8px',
                    borderRadius: '16px',
                    fontSize: windowWidth > 768 ? '13px' : '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    ':hover': {
                      backgroundColor: '#e55a2b',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 3px 6px rgba(255, 107, 53, 0.3)'
                    }
                  }}>
                    🔥 Ofertas
                  </a>
                </Link>
              </div>
            </div>
          )}

          <h1 style={{ 
            color: '#095400', 
            fontSize: isMobile ? '1.2rem' : '1.6rem',
            margin: '0 0 8px 0',
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            Blog PMG Atacadista
          </h1>
          
          <p style={{ 
            color: '#555', 
            fontSize: isMobile ? '0.85rem' : '1rem',
            margin: '0 0 15px 0',
            lineHeight: '1.4'
          }}>
            Conhecimento especializado em food service para alavancar seu negócio
          </p>

          <nav style={{
            fontSize: isMobile ? '0.75rem' : '0.85rem',
            color: '#666'
          }}>
            <Link href="/" style={{ 
              color: '#095400', 
              textDecoration: 'none', 
              fontWeight: '600'
            }}>
              Home
            </Link>
            <span style={{ margin: '0 8px', color: '#999' }}>›</span>
            <span>Food News</span>
          </nav>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main>
          <ArticleIndex />
          
          {isClient ? (
            articles.map((article, index) => (
              <div 
                key={article.id}
                ref={el => articleRefs.current[index] = el}
              >
                <section 
                  id={`artigo-${article.id}`}
                  style={{
                    display: currentPage === article.id ? 'block' : 'none',
                    margin: isMobile ? '20px 0' : '30px 0'
                  }}
                >
                  <article style={{
                    background: '#fff',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0'
                  }}>
                    
                    <div style={{
                      padding: isMobile ? '20px 15px' : '25px 20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                        fontSize: isMobile ? '0.75rem' : '0.85rem',
                        color: '#666',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
                          <span style={{ display: isMobile ? 'none' : 'inline' }}>•</span>
                          <span>{article.readTime}</span>
                        </div>
                        <span style={{
                          backgroundColor: '#e8f5e8',
                          color: '#095400',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontWeight: '600',
                          fontSize: isMobile ? '0.7rem' : '0.8rem'
                        }}>
                          {article.category}
                        </span>
                      </div>

                      <h2 style={{
                        color: '#095400',
                        fontSize: isMobile ? '1.3rem' : '1.6rem',
                        fontWeight: '700',
                        margin: '0 0 12px 0',
                        lineHeight: '1.3'
                      }}>
                        {article.title}
                      </h2>
                      
                      <p style={{
                        color: '#555',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        lineHeight: '1.5',
                        margin: '0 0 20px 0'
                      }}>
                        {article.description}
                      </p>

                      <ShareButtons 
                        articleTitle={article.title}
                        articleId={article.id}
                        articlesPerPage={1}
                      />
                    </div>

                    <div style={{
                      width: '100%',
                      height: isMobile ? '220px' : '400px',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={article.image} 
                        alt={article.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    <div style={{
                      padding: isMobile ? '20px 15px' : '25px 20px'
                    }}>
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: processarLinksConteudo(article.content, articles) 
                        }}
                        style={{
                          fontSize: isMobile ? '0.9rem' : '1rem',
                          lineHeight: '1.6',
                          color: '#333'
                        }}
                      />
                    </div>
                  </article>
                </section>
              </div>
            ))
          ) : (
            <div style={{padding: '30px', textAlign: 'center'}}>
              ⏳ Carregando...
            </div>
          )}

          <QuickNavigation />
        </main>

        {/* RODAPÉ */}
        <footer style={{
          marginTop: '60px',
          padding: isMobile ? '20px 10px' : '30px 15px',
          textAlign: 'center',
          color: '#666',
          fontSize: isMobile ? '12px' : '14px',
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
              fontSize: isMobile ? '16px' : '18px',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              📋 Informações Legais
            </h3>

            {/* Links Principais em Grid Responsivo */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
              marginBottom: '25px',
              width: '100%'
            }}>
              
              {/* Política de Privacidade */}
              <Link href="/politica-de-privacidade" passHref legacyBehavior>
                <a style={{ 
                  color: '#095400', 
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: isMobile ? '12px' : '14px',
                  padding: isMobile ? '10px 6px' : '12px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  minHeight: '45px'
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
                  fontSize: isMobile ? '12px' : '14px',
                  padding: isMobile ? '10px 6px' : '12px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  minHeight: '45px'
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
                Devolução
              </a>
              </Link>

              {/* Termos de Uso */}
              <Link href="/termos" passHref legacyBehavior>
                <a style={{ 
                  color: '#095400', 
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: isMobile ? '12px' : '14px',
                  padding: isMobile ? '10px 6px' : '12px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  minHeight: '45px'
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
                  fontSize: isMobile ? '12px' : '14px',
                  padding: isMobile ? '10px 6px' : '12px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  minHeight: '45px'
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

            {/* Linha Divisa Estilizada */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #095400, transparent)',
              margin: '20px auto',
              maxWidth: '300px',
              width: '100%'
            }}></div>

            {/* Redes Sociais */}
            <div style={{
              marginBottom: '20px'
            }}>
              <h4 style={{
                color: '#095400',
                fontSize: isMobile ? '14px' : '16px',
                marginBottom: '12px',
                fontWeight: '600'
              }}>
                Siga-nos nas Redes Sociais
              </h4>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: isMobile ? '15px' : '20px',
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
              {/* TEXTO SEO */}
              <p style={{ 
                margin: '0 0 15px 0', 
                fontSize: isMobile ? '10px' : '11px', 
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
              
              {/* INFORMAÇÕES DE CONTATO */}
              <p style={{ 
                margin: '8px 0', 
                fontSize: isMobile ? '13px' : '14px',
                color: '#666',
                lineHeight: '1.5'
              }}>
                © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
              </p>
              <p style={{ 
                margin: '8px 0', 
                fontSize: isMobile ? '11px' : '12px', 
                color: '#888',
                lineHeight: '1.4'
              }}>
                Endereço: Estrada Ferreira Guedes, 784 - Potuverá 
                <br />
                CEP: 06885-150 - Itapecerica da Serra - SP
              </p>
              <p style={{ 
                margin: '8px 0', 
                fontSize: isMobile ? '11px' : '12px', 
                color: '#888'
              }}>
                📞 Telefone: (11) 91357-2902
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
