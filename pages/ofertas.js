import React, { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

// ========== PRODUTOS EM OFERTA ========== //
// VOCÊ SÓ PRECISA MUDAR ESTES PRODUTOS TODO DOMINGO!
const featuredProducts = [
  { id: 1107, name: 'ARROZ BRANCO TIPO 1 SOLITO 5 KILO (FDO 6 PCT)', category: 'Ofertas', price: 108.00, image: 'https://www.marquesvendaspmg.shop/images/arroz-branco-tipo-1-solito-5-kilo-fdo-6-pct-pmg-atacadista.jpg' },
  { id: 1268, name: 'FEIJÃO CARIOCA TIPO 1 SOLITO 1 KILO (FDO 10 PCT)', category: 'Ofertas', price: 69.00, image: 'https://www.marquesvendaspmg.shop/images/feijao-carioca-tipo-1-solito-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1318, name: 'MARGARINA COM SAL 80 % AMÉLIA (BD 14 KILO)', category: 'Ofertas', price: 189.00, image: 'https://www.marquesvendaspmg.shop/images/margarina-com-sal-80-amelia-bd-14-kilo-pmg-atacadista.jpg' },
  { id: 1355, name: 'ÓLEO DE ALGODÃO ELOGIATA FLOR DE ALGODÃO (BD 15,8 L)', category: 'Ofertas', price: 176.88, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-algodao-elogiata-flor-de-algodao-bd-158-l-pmg-atacadista.jpg' },
  { id: 662, name: 'LEITE CONDENSADO "INTEGRAL" ITALAC 395 G (CX 27 UN)', category: 'Ofertas', price: 215.00, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-integral-italac-395-g-cx-27-un-pmg-atacadista.jpg' },
  { id: 1774, name: 'FERMENTO EM PÓ QUÍMICO TRADICIONAL DONA BENTA 100 G', category: 'Ofertas', price: 3.07, image: 'https://www.marquesvendaspmg.shop/images/fermento-em-po-quimico-tradicional-dona-benta-100-g-pmg-atacadista.jpg' },
  { id: 1487, name: 'AÇÚCAR REFINADO UNIÃO 1 KILO (FDO 10 PCT)', category: 'Ofertas', price: 45.20, image: 'https://www.marquesvendaspmg.shop/images/acucar-refinado-uniao-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 144, name: 'DOLLY GUARANÁ PET 2 L (PCT 6 UN)', category: 'Ofertas', price: 32.99, image: 'https://www.marquesvendaspmg.shop/images/dolly-guarana-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 145, name: 'DOLLY LARANJA PET 2 L (PCT 6 UN)', category: 'Ofertas', price: 32.99, image: 'https://www.marquesvendaspmg.shop/images/dolly-laranja-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 146, name: 'DOLLY LIMÃO PET 2 L (PCT 6 UN)', category: 'Ofertas', price: 32.99, image: 'https://www.marquesvendaspmg.shop/images/dolly-limao-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
];

// ========== BANNERS ========== //
const banners = [
  { 
    id: 1,
    desktop: 'https://i.imgur.com/m9DxquV.png',
    mobile: 'https://i.imgur.com/m9DxquV.png'
  },
  { 
    id: 2,
    desktop: 'https://i.imgur.com/g6h6z2i.png',
    mobile: 'https://i.imgur.com/g6h6z2i.png'
  },
  { 
    id: 3,
    desktop: 'https://i.imgur.com/w9JCpKX.png',
    mobile: 'https://i.imgur.com/w9JCpKX.png'
  },
  { 
    id: 4,
    desktop: 'https://i.imgur.com/gX6M2lu.png',
    mobile: 'https://i.imgur.com/gX6M2lu.png'
  }
];

// ========== IMAGENS FIFO (1080x1080) ========== //
const fifoImages = [
  'https://i.imgur.com/brRMBWP.mp4',
  'https://i.imgur.com/8mbLAdB.mp4',
  'https://i.imgur.com/C2Ltbdt.mp4',
  'https://i.imgur.com/OTzM2vT.mp4',
];

// ========== FUNÇÕES DE SEO DINÂMICAS ========== //
// FUNÇÃO 1: Gera SEO automático baseado nos produtos atuais
const generateDynamicSEO = (products) => {
  // Extrai categorias e marcas dos produtos atuais
  const categories = [...new Set(products.map(p => {
    if (p.name.includes('WHISKY')) return 'whisky';
    if (p.name.includes('GIN')) return 'gin';
    if (p.name.includes('ESPUMANTE')) return 'espumante';
    if (p.name.includes('BAÚ') || p.name.includes('MOCHILA')) return 'equipamentos';
    return 'produtos';
  }))];

  // Extrai marcas dos produtos
  const brands = products.map(p => {
    if (p.name.includes('JOHNNIE WALKER')) return 'Johnnie Walker';
    if (p.name.includes('SALTON')) return 'Salton';
    if (p.name.includes('ROCK´S')) return 'Rock´s';
    if (p.name.includes('WHITE HORSE')) return 'White Horse';
    if (p.name.includes('MIL ROTAS')) return 'Mil Rotas';
    return null;
  }).filter(Boolean);

  // Gera texto SEO dinâmico
  return {
    title: `Ofertas PMG Atacadista - ${categories.join(', ').toUpperCase()} em Promoção`,
    description: `Ofertas especiais PMG Atacadista: ${products.slice(0, 3).map(p => p.name).join(', ')}. Confira todas as ofertas da semana com os melhores preços em atacado. Entrega rápida para São Paulo e região.`,
    keywords: `ofertas pmg atacadista, ${categories.join(', ')}, ${brands.join(', ')}, atacado food service, preço baixo atacado`
  };
};

// FUNÇÃO 2: Gera alt e title das imagens
const generateImageSEO = (product) => {
  return {
    alt: `${product.name} - Oferta PMG Atacadista - Atacado Food Service`,
    title: `${product.name} - Oferta Especial da Semana - PMG Atacadista`,
  };
};

// FUNÇÃO 3: Gera brand automático
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

// FUNÇÃO 4: Gera descrição do produto
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
const OfertasPage = () => {
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth <= 768;
  
  // Gera SEO dinâmico baseado nos produtos
  const dynamicSEO = generateDynamicSEO(featuredProducts);
  
  // Estados
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showFifoPopup, setShowFifoPopup] = useState(false);
  const [selectedFifoImage, setSelectedFifoImage] = useState('');

  // Configuração de paginação
  const productsPerPage = 10;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = featuredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(featuredProducts.length / productsPerPage);

  // Refs para intervalos
  const bannerIntervalRef = useRef(null);
  const toastTimeoutRef = useRef(null);

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

    // Popup FIFO após 1 minuto
    const fifoTimer = setTimeout(() => {
      const randomImage = fifoImages[Math.floor(Math.random() * fifoImages.length)];
      setSelectedFifoImage(randomImage);
      setShowFifoPopup(true);
    }, 27000);

    return () => {
      clearInterval(bannerIntervalRef.current);
      clearTimeout(toastTimeoutRef.current);
      clearTimeout(fifoTimer);
    };
  }, []);

  // Funções do carrinho
  const addToCart = (product) => {
    if (product.price > 0) {
      setCart([...cart, product]);
      setTotal(total + product.price);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    const removedItem = cart.find(item => item.id === productId);
    setCart(updatedCart);
    setTotal(total - (removedItem?.price || 0));
  };

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
        "priceValidUntil": "2024-12-31", // Atualize esta data semanalmente
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "PMG Atacadista",
          "url": "https://www.marquesvendaspmg.shop",
          "telephone": "+5511913572902"
        }
      }
    }));

    // Schema adicional para a página de ofertas
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
    userWelcomeBar: {
      backgroundColor: '#095400',
      color: 'white',
      padding: isMobile ? '12px 15px' : '15px 20px',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(9, 84, 0, 0.2)'
    },
    welcomeMessage: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      margin: 0
    },
    homeButton: {
      backgroundColor: 'white',
      color: '#095400',
      border: 'none',
      padding: isMobile ? '8px 16px' : '10px 20px',
      borderRadius: '25px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
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
      height: '100%', // Garante que todos os cards tenham mesma altura
      display: 'flex',
      flexDirection: 'column',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }
    },
    // IMAGEM AJUSTADA PARA NÃO CORTAR
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
      objectFit: 'contain', // Mudei de 'cover' para 'contain' para não cortar
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
      marginTop: 'auto', // Empurra o botão para baixo
      ':hover': {
        backgroundColor: '#0a6b00',
        transform: 'translateY(-2px)'
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
    // LUPA DE DETALHES
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
    // ESTILOS DO POPUP FIFO
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
  };

  // ========== RENDERIZAÇÃO ========== //
  return (
    <div style={styles.container}>
      {/* ✅ SCHEMA.ORG DINÂMICO */}
      {generateSchemaOrg().map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Barra de boas-vindas */}
      <div
        style={{
          ...styles.userWelcomeBar,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p style={styles.welcomeMessage}>
          🎯 OFERTAS DA SEMANA - Marques Vendas PMG
        </p>
        <a
          href="/"
          style={{ ...styles.homeButton, marginTop: '8px' }}
        >
          🏠 Página Inicial
        </a>
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
        
        {/* ✅ H1 DINÂMICO */}
        <h1 style={styles.title}>🔥 Ofertas PMG Atacadista</h1>
        
        {/* ✅ H2 DINÂMICO */}
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

      {/* ✅ H3 DINÂMICO */}
      <h3 style={{ 
        color: '#333', 
        fontSize: isMobile ? '18px' : '22px',
        fontWeight: '700',
        margin: '30px 0 15px',
        textAlign: 'center'
      }}>
        🛒 Produtos em Destaque - Clique na Lupa para Detalhes
      </h3>

      {/* Grade de produtos COM IMAGENS AJUSTADAS */}
      <div style={styles.productsGrid}>
        {currentProducts.map(product => {
          const seo = generateImageSEO(product);
          
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
              
              {/* CONTAINER DA IMAGEM - AJUSTADO */}
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
                
                <p style={product.price > 0 ? styles.productPrice : { ...styles.productPrice, color: '#999', textDecoration: 'line-through' }}>
                  {product.price > 0 ? `R$ ${product.price.toFixed(2)}` : 'Indisponível'}
                </p>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.price === 0}
                  style={{
                    ...styles.addButton,
                    ...(product.price === 0 && styles.disabledButton)
                  }}
                >
                  {product.price > 0 ? '🛒 Adicionar ao Carrinho' : '❌ Indisponível'}
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

      {/* Carrinho */}
      <Cart cart={cart} setCart={setCart} removeFromCart={removeFromCart} total={total} />

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
      
      {/* Popup FIFO */}
      {showFifoPopup && (
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
                <source src={selectedFifoImage} type="video/mp4" />
                Seu navegador não suporta vídeo HTML5
              </video>
            </div>
            <a
              href="http://localhost:3000/indicacoes"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.fifoPopupButton}
            >
              PARTICIPE
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

      {/* Rodapé (mantido igual) */}
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
    </div>
  );
};

export default OfertasPage;
