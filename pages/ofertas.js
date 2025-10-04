import React, { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

// ========== PRODUTOS EM OFERTA ========== //
const featuredProducts = [
{
id: 428,
name: 'MOLHO PARA PIZZA EKMA 1,7 KILO (CX 6 BAG)',
category: 'Ofertas',
price: 54.29,
image: 'https://i.imgur.com/S6pbDfO.png',
},
{
id: 383,
name: 'EXTRATO DE TOMATE ELEFANTE 1,7 KILO',
category: 'Ofertas',
price: 26.59,
image: 'https://i.imgur.com/Ne5Mb0J.png',
},
{
id: 632,
name: 'CREAM CHEESE SCALA 1,2 KILO',
category: 'Ofertas',
price: 35.19,
image: 'https://i.imgur.com/1zmzpu6.png',
},
{
id: 774,
name: 'MUÇARELA ZERO LACTOSE TRÊS MARIAS 4 KG',
category: 'Ofertas',
price: 37.99,
image: 'https://i.imgur.com/4XGmPqP.png',
},
{
id: 902,
name: 'REQUEIJÃO QUATÁ SEM AMIDO 1,5 KILO',
category: 'Ofertas',
price: 40.79,
image: 'https://i.imgur.com/m60k9Vd.png',
},
{
id: 615,
name: 'CHEDDAR FATIADO PROCESSADO 160 FATIAS VIGOR 2,24 KILO',
category: 'Ofertas',
price: 84.19,
image: 'https://i.imgur.com/ecEaHyX.png',
},
{
id: 1209,
name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL UAI BEM BRASIL 2 KILO (CX 7 PCT)',
category: 'Ofertas',
price: 138.49,
image: 'https://i.imgur.com/TddVhrS.png',
},
{
id: 1186,
name: 'BATATA PALITO CONGELADA PRÉ FRITA 10 MM CORTE TRADICIONAL RAPIPAP 2,5 KILO (CX 6 PCT)',
category: 'Ofertas',
price: 140.79,
image: 'https://i.imgur.com/NjniGM9.png',
},
{
id: 1895,
name: 'CHEESE PILLOWS CONGELADO EMPANADO MCCAIN 1 KILO (CX 6 PCT)',
category: 'Ofertas',
price: 388.89,
image: 'https://i.imgur.com/pTKbV5x.png',
},
{
  id: 1790,
  name: 'MACARRÃO ESPAGUETE Nº 8 COM OVOS DONA BENTA 500 G (FDO 24 PCT)',
  category: 'Ofertas',
  price: 75.99,
  image: 'https://i.imgur.com/NslZsoB.png',
},
{
  id: 1401,
  name: 'PROTEÍNA TEXTURIZADA DE SOJA CLARA FRANGO CAMIL 400 G (FDO 20 PCT)',
  category: 'Ofertas',
  price: 5.45,
  image: 'https://i.imgur.com/DnQ5tlw.png',
},
{
  id: 1402,
  name: 'PROTEÍNA TEXTURIZADA DE SOJA ESCURA CARNE CAMIL 400 G (FDO 20 PCT)',
  category: 'Ofertas',
  price: 5.45,
  image: 'https://i.imgur.com/hOnaDLg.png',
},
{
  id: 1392,
  name: 'PEPINOS RODELAS AGRIDOCE HEMMER 440 G',
  category: 'Ofertas',
  price: 19.99,
  image: 'https://i.imgur.com/5j4OWq7.png',
},
{
  id: 1223,
  name: 'CAFÉ EXTRA FORTE ALMOFADA SOLLUS 500 G (FDO 10 PCT)',
  category: 'Ofertas',
  price: 229.99,
  image: 'https://i.imgur.com/TtlTuwJ.png',
},
{
  id: 1440,
  name: 'ATUM PEDAÇOS EM ÓLEO POUCH GOMES DA COSTA 500 G',
  category: 'Ofertas',
  price: 29.79,
  image: 'https://i.imgur.com/QBjRtM2.png',
},
{
  id: 779,
  name: 'PARMESÃO 6 MESES LA SERENISSIMA 8 KG',
  category: 'Ofertas',
  price: 69.89,
  image: 'https://i.imgur.com/Z2XbUVH.png',
},
{
  id: 1763,
  name: 'FARINHA DE TRIGO TIPO 1 FARINA 5 KILO (FDO 25 KILO)',
  category: 'Ofertas',
  price: 76.79,
  image: 'https://i.imgur.com/cp3JWHX.png',
},
{
  id: 1202,
  name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL MAIS BATATA BEM BRASIL 2 KILO (CX 7 PCT)',
  category: 'Ofertas',
  price: 146.89,
  image: 'https://i.imgur.com/H6CVzIj.png',
},
{
  id: 1105,
  name: 'ARROZ BRANCO TIPO 1 FOOD SERVICE CAMIL 5 KILO (FDO 6 PCT)',
  category: 'Ofertas',
  price: 133.99,
  image: 'https://i.imgur.com/4Mg7giP.png',
},
{
  id: 1107,
  name: 'ARROZ BRANCO TIPO 1 SOLITO 5 KILO (FDO 6 PCT)',
  category: 'Ofertas',
  price: 124.39,
  image: 'https://i.imgur.com/ZxyHXzW.png',
},
{
  id: 1268,
  name: 'FEIJÃO CARIOCA TIPO 1 SOLITO 1 KILO (FDO 10 PCT)',
  category: 'Ofertas',
  price: 70.55,
  image: 'https://i.imgur.com/zAH59YU.png',
},
{
  id: 1484,
  name: 'AÇÚCAR REFINADO ALTO ALEGRE 1 KILO (FDO 10 PCT)',
  category: 'Ofertas',
  price: 45.00,
  image: 'https://i.imgur.com/OAA8hCL.png',
},
].filter(product => product.category === 'Ofertas');

// ========== BANNERS ========== //
const banners = [
  { 
    id: 1,
    desktop: 'https://i.imgur.com/lzxANGT.gif',
    mobile: 'https://i.imgur.com/sS31EnX.gif'
  },
  { 
    id: 2,
    desktop: 'https://i.imgur.com/Yy7RIna.png',
    mobile: 'https://i.imgur.com/WiB6fYX.png'
  },
  { 
    id: 3,
    desktop: 'https://i.imgur.com/vVskyqX.png',
    mobile: 'https://i.imgur.com/kLDkiAy.png'
  },
  { 
    id: 4,
    desktop: 'https://i.imgur.com/LmzBiOq.png',
    mobile: 'https://i.imgur.com/vYBBAd6.png'
  }
];

// ========== IMAGENS FIFO (1080x1080) ========== //
const fifoImages = [
  'https://i.imgur.com/brRMBWP.mp4',
  'https://i.imgur.com/8mbLAdB.mp4',
  'https://i.imgur.com/C2Ltbdt.mp4',
  'https://i.imgur.com/OTzM2vT.mp4',
];

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
  
  // Estados (removidos os de notificação)
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

  // Efeitos (removidos os de notificação)
  useEffect(() => {
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
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }
    },
    productImage: {
      width: '100%',
      height: isMobile ? '140px' : '200px',
      objectFit: 'cover',
      borderBottom: '2px solid #f8f8f8'
    },
    productInfo: {
      padding: isMobile ? '15px' : '20px'
    },
    productNameContainer: {
      minHeight: isMobile ? '70px' : 'auto',
      marginBottom: '12px'
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
    footer: {
      marginTop: isMobile ? '40px' : '60px',
      padding: isMobile ? '25px 15px' : '40px 20px',
      textAlign: 'center',
      color: '#666',
      fontSize: isMobile ? '0.8rem' : '0.85rem',
      borderTop: '2px solid #f0f0f0',
      backgroundColor: '#f9f9f9'
    },
    // ========== ESTILOS DO POPUP FIFO (AJUSTADOS PARA 1080x1080) ========== //
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
      width: isMobile ? '90%' : 'auto', // Ajuste para desktop
      maxWidth: '1080px', // Largura máxima igual à da imagem
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
      backgroundColor: '#fff', // Fundo branco para imagens transparentes
    },
    fifoPopupImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '70vh',
      objectFit: 'contain', // Garante que a imagem não seja cortada
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

  // ========== RENDERIZAÇÃO ATUALIZADA ========== //
  return (
    <div style={styles.container}>
      {/* Barra de boas-vindas melhorada */}
      <div style={styles.userWelcomeBar}>
        <p style={styles.welcomeMessage}>🎯 OFERTAS ESPECIAIS - Marques Vendas PMG</p>
        <a href="/" style={styles.homeButton}>🏠 Página Inicial</a>
      </div>

      {/* Cabeçalho premium */}
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
        <h1 style={styles.title}>🔥 OFERTAS ESPECIAIS</h1>
        <p style={styles.subtitle}>Produtos selecionados com condições exclusivas! ⚡ Entrega rápida</p>
        
        {/* Destaques de credibilidade */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '10px' : '15px',
          marginTop: '20px'
        }}>
          {[
            { icon: '🚚', title: 'Entrega Rápida', desc: 'Para toda região' },
            { icon: '🏷️', title: 'Preço Competitivo', desc: 'Melhores condições' },
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

      {/* Grade de produtos premium */}
      <div style={styles.productsGrid}>
        {currentProducts.map(product => (
          <div key={product.id} style={styles.productCard}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={styles.productImage}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200/f8f8f8/666?text=Produto+Sem+Imagem';
              }}
            />
            <div style={styles.productInfo}>
              <div style={styles.productNameContainer}>
                <h3 style={{
                  ...styles.productName,
                  WebkitLineClamp: expandedDescriptions[product.id] ? 'unset' : (isMobile ? 3 : 3)
                }}>
                  {product.name}
                </h3>
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
        ))}
      </div>

      {/* Paginação melhorada */}
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

      {/* CTA premium para produtos completos */}
      <div style={styles.ctaSection}>
        <h2 style={{ color: '#095400', marginBottom: '15px', fontSize: isMobile ? '20px' : '24px' }}>
          📦 Catálogo Completo Disponível!
        </h2>
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
        {/* Substitua esta parte ↓ */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={styles.fifoPopupImage} // Mantém os mesmos estilos
        >
          <source src={selectedFifoImage} type="video/mp4" />
          Seu navegador não suporta vídeo HTML5
        </video>
      </div>
      <a
        href="marquesvendaspmg.shop/indicacoes"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.fifoPopupButton}
      >
        PARTICIPE
      </a>
    </div>
  </div>
)}

      {/* Rodapé Premium com Redes Sociais */}
      <footer style={styles.footer}>
        {/* Redes Sociais */}
        <div style={{ 
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <h3 style={{ 
            color: '#095400', 
            fontSize: isMobile ? '1rem' : '1.1rem',
            marginBottom: '10px'
          }}>
            Siga-nos nas Redes Sociais
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '20px' : '25px',
            alignItems: 'center'
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
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <img 
                src="https://i.imgur.com/prULUUA.png" 
                alt="Facebook" 
                style={{
                  width: '24px',
                  height: '24px',
                  transition: 'all 0.3s ease'
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
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <img 
                src="https://i.imgur.com/I0ZZLjG.png" 
                alt="Instagram" 
                style={{
                  width: '24px',
                  height: '24px',
                  transition: 'all 0.3s ease'
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
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <img 
                src="https://i.imgur.com/WfpZ8Gg.png" 
                alt="YouTube" 
                style={{
                  width: '24px',
                  height: '24px',
                  transition: 'all 0.3s ease'
                }}
              />
            </a>
          </div>
        </div>

        {/* Links Legais */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '15px' : '20px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <a 
            href="/politica-de-privacidade" 
            style={{ 
              color: '#095400', 
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: isMobile ? '0.8rem' : '0.85rem',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: '#f0f0f0'
              }
            }}
          >
            Política de Privacidade
          </a>

          <span style={{ color: '#095400' }}>•</span>

          <Link href="/termos" passHref legacyBehavior>
            <a style={{ 
              color: '#095400', 
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: isMobile ? '0.8rem' : '0.85rem',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: '#f0f0f0'
              }
            }}>
              Termos de Uso
            </a>
          </Link>

          <span style={{ color: '#095400' }}>•</span>

          <Link href="/quem-somos" passHref legacyBehavior>
            <a style={{ 
              color: '#095400', 
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: isMobile ? '0.8rem' : '0.85rem',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: '#f0f0f0'
              }
            }}>
              Quem Somos
            </a>
          </Link>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            margin: '5px 0', 
            fontSize: isMobile ? '0.8rem' : '0.85rem',
            color: '#666'
          }}>
            © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
          </p>
          <p style={{ 
            margin: '5px 0', 
            fontSize: isMobile ? '0.7rem' : '0.75rem', 
            color: '#999',
            lineHeight: '1.4'
          }}>
            Estrada Ferreira Guedes, 784 - Potuverá - CEP: 06885-150 - Itapecerica da Serra - SP
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OfertasPage;
