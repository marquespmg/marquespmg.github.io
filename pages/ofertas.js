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
id: 692,
name: 'MANTEIGA PEQUENA COM SAL CRIOULO 200 G (CX 20 UN)',
category: 'Ofertas',
price: 93.59,
image: 'https://i.imgur.com/vDL10ZL.png',
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
  id: 1744,
  name: 'FARINHA DE TRIGO PEQUENA TIPO 1 SOL 1 KILO (FDO 10 KILO)',
  category: 'Ofertas',
  price: 43.50,
  image: 'https://i.imgur.com/VbqZDY7.png',
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
  id: 1730,
  name: 'FARINHA DE TRIGO PASTEL SUPREMA BUNGE 5 KILO (FDO 25 KILO)',
  category: 'Ofertas',
  price: 103.99,
  image: 'https://i.imgur.com/gXxWyjC.png',
},
{
  id: 1723,
  name: 'FARINHA DE TRIGO PASTEL BUQUÊ 5 KILO (FDO 25 KILO)',
  category: 'Ofertas',
  price: 101.19,
  image: 'https://i.imgur.com/UAKK7p8.png',
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
  'https://i.imgur.com/CGzJp6I.mp4',
  'https://i.imgur.com/2IforDT.mp4',
  'https://i.imgur.com/t9P4mJE.mp4',
  'https://i.imgur.com/LUMAOr7.mp4',
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
  
  // Estados
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showFreteToast, setShowFreteToast] = useState(false);
  const [showWhatsappToast, setShowWhatsappToast] = useState(false);
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
    // Carrossel automático
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 10000);

    // Notificações
    toastTimeoutRef.current = setTimeout(() => {
      setShowFreteToast(true);
      setTimeout(() => setShowFreteToast(false), 10000);
      
      setTimeout(() => {
        setShowWhatsappToast(true);
        setTimeout(() => setShowWhatsappToast(false), 10000);
      }, 5000);
    }, 15000);

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

  // ========== ESTILOS ========== //
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '10px' : '20px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      position: 'relative'
    },
    userWelcomeBar: {
      backgroundColor: '#095400',
      color: 'white',
      padding: windowWidth > 768 ? '12px 20px' : '10px 15px',
      borderRadius: '8px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '6px'
    },
    welcomeMessage: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      margin: 0
    },
    homeButton: {
      backgroundColor: 'white',
      color: '#095400',
      border: '1px solid #095400',
      padding: windowWidth > 768 ? '8px 12px' : '6px 10px',
      borderRadius: '20px',
      fontSize: windowWidth > 768 ? '14px' : '12px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      whiteSpace: 'nowrap'
    },
    header: {
      textAlign: 'center',
      marginBottom: isMobile ? '15px' : '20px',
      padding: isMobile ? '15px' : '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    title: {
      color: '#095400',
      fontSize: isMobile ? '22px' : '28px',
      fontWeight: '700',
      marginBottom: '10px'
    },
    subtitle: {
      color: '#666',
      fontSize: isMobile ? '14px' : '16px'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: isMobile ? '10px' : '20px',
      margin: '20px 0'
    },
    productCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      transition: 'transform 0.3s'
    },
    productImage: {
      width: '100%',
      height: isMobile ? '120px' : '180px',
      objectFit: 'cover',
      borderBottom: '1px solid #eee'
    },
    productInfo: {
      padding: isMobile ? '10px' : '15px'
    },
    productNameContainer: {
      minHeight: isMobile ? '60px' : 'auto',
      marginBottom: '10px'
    },
    productName: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '5px',
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
      fontWeight: '600'
    },
    productPrice: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: '700',
      color: '#e53935',
      margin: '10px 0'
    },
    addButton: {
      width: '100%',
      padding: isMobile ? '8px' : '10px',
      backgroundColor: '#095400',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: isMobile ? '13px' : '15px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    disabledButton: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px 0',
      gap: '10px',
      flexWrap: 'wrap'
    },
    pageButton: {
      padding: isMobile ? '6px 12px' : '8px 16px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px'
    },
    activePage: {
      backgroundColor: '#095400',
      color: '#fff',
      borderColor: '#095400'
    },
    resultsInfo: {
      textAlign: 'center',
      color: '#666',
      margin: '10px 0',
      fontSize: isMobile ? '14px' : '16px'
    },
    bannerContainer: {
      margin: '40px 0 20px',
      position: 'relative',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    bannerImage: {
      width: '100%',
      display: 'block'
    },
    bannerNavButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: isMobile ? '30px' : '40px',
      height: isMobile ? '30px' : '40px',
      fontSize: isMobile ? '16px' : '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    prevButton: {
      left: '10px'
    },
    nextButton: {
      right: '10px'
    },
    bannerDots: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '10px'
    },
    dot: {
      width: isMobile ? '8px' : '12px',
      height: isMobile ? '8px' : '12px',
      borderRadius: '50%',
      backgroundColor: '#ccc',
      margin: '0 5px',
      cursor: 'pointer'
    },
    activeDot: {
      backgroundColor: '#095400'
    },
    toastContainer: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    },
    toast: {
      backgroundColor: '#fff',
      borderLeft: '4px solid #2ecc71',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      padding: '16px',
      maxWidth: '320px',
      marginBottom: '10px',
      display: 'flex',
      gap: '12px'
    },
    toastContent: {
      flex: 1
    },
    toastTitle: {
      margin: '0 0 8px 0',
      color: '#2c3e50',
      fontSize: '16px',
      fontWeight: '700'
    },
    toastMessage: {
      margin: 0,
      color: '#7f8c8d',
      fontSize: '14px'
    },
    toastHighlight: {
      color: '#e74c3c',
      fontWeight: 'bold'
    },
    toastWhatsappBtn: {
      display: 'inline-block',
      marginTop: '12px',
      background: '#25D366',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '13px'
    },
    footer: {
      marginTop: isMobile ? '30px' : '50px',
      padding: isMobile ? '20px 15px' : '30px 20px',
      textAlign: 'center',
      color: '#666',
      fontSize: isMobile ? '0.8rem' : '0.85rem',
      borderTop: '1px solid #eee',
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

  // ========== RENDERIZAÇÃO ========== //
  return (
    <div style={styles.container}>
      {/* Barra de boas-vindas */}
      <div style={styles.userWelcomeBar}>
        <p style={styles.welcomeMessage}>Ofertas Especiais | Marques Vendas PMG</p>
        <a href="/" style={styles.homeButton}>Página Inicial</a>
      </div>

      {/* Cabeçalho */}
      <div style={styles.header}>
        <img 
          src="https://i.imgur.com/pBH5WpZ.png" 
          alt="Logo" 
          style={{ height: isMobile ? '50px' : '60px', marginBottom: '15px' }} 
        />
        <h1 style={styles.title}>OFERTAS ESPECIAIS</h1>
        <p style={styles.subtitle}>Compre em 1 clique e receba em até 48h! ⚡</p>
      </div>

      {/* Grade de produtos */}
      <div style={styles.productsGrid}>
        {currentProducts.map(product => (
          <div key={product.id} style={styles.productCard}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={styles.productImage}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/250x180?text=Produto+Sem+Imagem';
              }}
            />
            <div style={styles.productInfo}>
              <div style={styles.productNameContainer}>
                <h3 style={{
                  ...styles.productName,
                  WebkitLineClamp: expandedDescriptions[product.id] ? 'unset' : (isMobile ? 2 : 3)
                }}>
                  {product.name}
                </h3>
                {product.name.length > (isMobile ? 30 : 50) && (
                  <button 
                    onClick={() => toggleDescription(product.id)}
                    style={styles.showMoreButton}
                  >
                    {expandedDescriptions[product.id] ? 'Mostrar menos' : 'Mostrar mais'}
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
                {product.price > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
              </button>
            </div>
          </div>
        ))}
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
          Anterior
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
          Próxima
        </button>
      </div>

      {/* Carrinho */}
      <Cart cart={cart} setCart={setCart} removeFromCart={removeFromCart} total={total} />

      {/* CTA para página de produtos completa */}
      <div style={{ 
        textAlign: 'center', 
        margin: '40px 0',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#095400', marginBottom: '15px' }}>Quer ver todos os nossos produtos?</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Acesse nosso catálogo completo com centenas de itens para seu negócio.
          Cadastro rápido e fácil!
        </p>
        <a 
          href="/produtos" 
          style={{
            ...styles.addButton,
            display: 'inline-block',
            textDecoration: 'none',
            padding: '12px 30px'
          }}
        >
          Ver Catálogo Completo
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
          &lt;
        </button>
        <button
          onClick={goToNextBanner}
          style={{ ...styles.bannerNavButton, ...styles.nextButton }}
          aria-label="Próximo banner"
        >
          &gt;
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

      {/* Notificações Toast */}
      <div style={styles.toastContainer}>
        {showFreteToast && (
          <div style={styles.toast}>
            <div style={{ fontSize: '24px' }}>🔔</div>
            <div style={styles.toastContent}>
              <h4 style={styles.toastTitle}>Frete GRÁTIS + Pague só na entrega!</h4>
              <p style={styles.toastMessage}>
                Sem risco, sem enrolação. Receba seus produtos e <span style={styles.toastHighlight}>pague só quando chegar</span>. Aproveite agora!
              </p>
            </div>
          </div>
        )}

        {showWhatsappToast && (
          <div style={styles.toast}>
            <div style={{ fontSize: '24px' }}>📦</div>
            <div style={styles.toastContent}>
              <h4 style={styles.toastTitle}>Entregamos em até 48h!</h4>
              <p style={styles.toastMessage}>
                Tá com dúvida? Fala direto com a gente no WhatsApp 👉 <span style={styles.toastHighlight}>(11) 91357-2902</span>
              </p>
              <a 
                href="https://wa.me/5511913572902" 
                style={styles.toastWhatsappBtn} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                CHAMAR NO WHATSAPP
              </a>
            </div>
          </div>
        )}
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
        href="https://wa.me/5511913572902"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.fifoPopupButton}
      >
        ENTRE EM CONTATO
      </a>
    </div>
  </div>
)}

        {/* Rodapé - Adaptado para mobile */}
<footer style={{
  marginTop: isMobile ? '30px' : '50px',
  padding: isMobile ? '20px 15px' : '30px 20px',
  textAlign: 'center',
  color: '#666',
  fontSize: isMobile ? '0.8rem' : '0.85rem',
  borderTop: '1px solid #eee',
  backgroundColor: '#f9f9f9' // Adicionado para melhor contraste
}}>
  {/* Container principal dos links legais */}
  <div id="legal-links-container" style={{
    display: 'flex',
    justifyContent: 'center',
    gap: isMobile ? '10px' : '20px',
    marginBottom: '15px',
    flexWrap: 'wrap',
    alignItems: 'center'
  }}>
    {/* Link de Política de Privacidade (versão Google-friendly) */}
    <a 
      href="/politica-de-privacidade" 
      style={{ 
        color: '#095400', 
        textDecoration: 'underline', // Sublinhado para melhor visibilidade
        fontWeight: '600', // Negrito
        fontSize: isMobile ? '0.85rem' : '0.9rem',
        padding: '8px 12px',
        borderRadius: '4px',
        transition: 'all 0.3s ease',
        ':hover': {
          backgroundColor: '#f0f0f0'
        }
      }}
      title="Política de Privacidade"
      aria-label="Leia nossa Política de Privacidade Completa"
    >
      Política de Privacidade
    </a>

    <span style={{ color: '#095400' }}>|</span>

    {/* Link para Termos */}
    <Link href="/termos" passHref legacyBehavior>
      <a style={{ 
        color: '#095400', 
        textDecoration: 'underline', // Sublinhado para melhor visibilidade
        fontWeight: '600', // Negrito
        fontSize: isMobile ? '0.85rem' : '0.9rem',
        padding: '8px 12px',
        borderRadius: '4px',
        transition: 'all 0.3s ease',
        ':hover': {
          backgroundColor: '#f0f0f0'
        }
      }}
      title="Termos de Uso"
      aria-label="Leia nossos Termos de Uso Completo"
    >
      Termos de Uso
    </a>
    </Link>

    <span style={{ color: '#095400' }}>|</span>

{/* Link para Quem Somos - VERSÃO BLINDADA */}
<div style={{
  position: 'relative',
  zIndex: 9999,
  isolation: 'isolate'
}}>
  <Link href="/quem-somos" passHref legacyBehavior>
    <a 
      onClick={(e) => {
        // Fallback para garantir funcionamento em mobile
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
          e.preventDefault();
          window.location.href = '/quem-somos';
        }
      }}
      style={{ 
        color: '#095400', 
        textDecoration: 'underline',
        fontWeight: '600',
        fontSize: isMobile ? '0.85rem' : '0.9rem',
        padding: '8px 12px',
        borderRadius: '4px',
        transition: 'all 0.3s ease',
        display: 'inline-block',
        position: 'relative',
        backgroundColor: 'transparent',
        ':hover': {
          backgroundColor: '#f0f0f0'
        },
        // Proteções extras para mobile
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      title="Quem Somos"
      aria-label="Leia nossos Quem Somos Completo"
    >
      Quem Somos
    </a>
  </Link>
  </div>
  </div>

  {/* Informações de copyright */}
  <div style={{ marginTop: '10px' }}>
    <p style={{ margin: '5px 0', fontSize: isMobile ? '0.8rem' : '0.85rem' }}>
      © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
    </p>
    <p style={{ 
      margin: '5px 0', 
      fontSize: isMobile ? '0.7rem' : '0.8rem', 
      color: '#999',
      lineHeight: '1.4'
    }}>
      • Endereço: Estrada Ferreira Guedes, 784 - Potuverá CEP: 06885-150 - Itapecerica da Serra - SP
    </p>
  </div>
</footer>
    </div>
  );
};

export default OfertasPage;
