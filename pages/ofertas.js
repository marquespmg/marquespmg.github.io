import React, { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';

// Produtos em oferta (adicione a categoria "Ofertas" aos produtos que devem aparecer aqui)
const featuredProducts = [
  {
  id: 1,
  name: 'WHISKY JOHNNIE WALKER BLUE LABEL 750 ML',
  category: 'Ofertas',
  price: 998.00,
  image: 'https://i.imgur.com/INPxSsa.png',
},
{
  id: 2,
  name: 'WHISKY JOHNNIE WALKER RED LABEL 1 L',
  category: 'Ofertas',
  price: 81.99,
  image: 'https://i.imgur.com/ewkP00y.png',
},
{
  id: 3,
  name: 'WHISKY PASSPORT 1 L',
  category: 'Ofertas',
  price: 47.20,
  image: 'https://i.imgur.com/s5btt6Y.png',
},
{
  id: 4,
  name: 'GIN BEEFEATER 750 ML',
  category: 'Ofertas',
  price: 81.99,
  image: 'https://i.imgur.com/6df0UMK.png',
},
{
  id: 5,
  name: 'WHISKY JACK DANIEL´S TENNESSEE OLD No.7 1 L',
  category: 'Ofertas',
  price: 150.00,
  image: 'https://i.imgur.com/6bNFOJD.png',
},
{
  id: 6,
  name: 'VINHO ARGENTINO TINTO MEIO SECO MALBEC RESERVADO CONCHA Y TORO 750 ML',
  category: 'Ofertas',
  price: 23.30,
  image: 'https://i.imgur.com/F9GqjDF.png',
},
{
  id: 7,
  name: 'VINHO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON RESERVADO CONCHA Y TORO 750 ML',
  category: 'Ofertas',
  price: 23.30,
  image: 'https://i.imgur.com/I2KzRC5.png',
},
{
  id: 8,
  name: 'VINHO CHILENO TINTO MEIO SECO CARMENÉRE RESERVADO CONCHA Y TORO 750 ML',
  category: 'Ofertas',
  price: 23.30,
  image: 'https://i.imgur.com/8rZ7chL.png',
},
{
  id: 9,
  name: 'VINHO CHILENO TINTO MEIO SECO MERLOT RESERVADO CONCHA Y TORO 750 ML',
  category: 'Ofertas',
  price: 23.30,
  image: 'https://i.imgur.com/z154E3m.png',
},
{
  id: 10,
  name: 'VINHO CHILENO TINTO SECO CABERNET SAUVIGNON CASILLERO DEL DIABLO 750 ML',
  category: 'Ofertas',
  price: 41.30,
  image: 'https://i.imgur.com/muoEyM2.png',
},
{
  id: 11,
  name: 'VINHO CHILENO TINTO SECO MALBEC CASILLERO DEL DIABLO 750 ML',
  category: 'Ofertas',
  price: 41.30,
  image: 'https://i.imgur.com/dVFLBxV.png',
},
{
  id: 12,
  name: 'VINHO ESPANHOL TINTO SECO FINO ORO TEMPRANILLO PATA NEGRA 750 ML',
  category: 'Ofertas',
  price: 43.50,
  image: 'https://i.imgur.com/i5dk82Y.png',
},
{
  id: 13,
  name: 'VINHO PORTUGUÊS TINTO SECO CASAL GARCIA 750 ML',
  category: 'Ofertas',
  price: 47.20,
  image: 'https://i.imgur.com/I0iF5Yz.png',
},
{
  id: 14,
  name: 'VINHO PORTUGUÊS VERDE MEIO SECO CASAL GARCIA 750 ML',
  category: 'Ofertas',
  price: 47.20,
  image: 'https://i.imgur.com/Avj6Hsn.png',
},
{
  id: 15,
  name: 'VINHO PORTUGUÊS TINTO SECO PERIQUITA 750 ML',
  category: 'Ofertas',
  price: 50.69,
  image: 'https://i.imgur.com/XIdUoxF.png',
},
  // Adicione outros produtos em oferta aqui...
].filter(product => product.category === 'Ofertas'); // Filtra apenas os produtos da categoria Ofertas

// Banners (pode ser o mesmo da página de produtos)
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

// Hook personalizado para detectar tamanho da tela (mesmo da página de produtos)
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

const OfertasPage = () => {
  const { width: windowWidth } = useWindowSize();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showFreteToast, setShowFreteToast] = useState(false);
  const [showWhatsappToast, setShowWhatsappToast] = useState(false);
  const bannerIntervalRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Efeito para o carrossel automático (mesmo da página de produtos)
  useEffect(() => {
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 10000);

    return () => {
      if (bannerIntervalRef.current) {
        clearInterval(bannerIntervalRef.current);
      }
    };
  }, []);

  // Efeito para as notificações toast (mesmo da página de produtos)
  useEffect(() => {
    const TEMPO_INICIAL = 15000;
    const INTERVALO = 9000;
    const DURACAO = 10000;

    const firstTimeout = setTimeout(() => {
      setShowFreteToast(true);
      setTimeout(() => setShowFreteToast(false), DURACAO);
    }, TEMPO_INICIAL);
    
    const secondTimeout = setTimeout(() => {
      setShowWhatsappToast(true);
      setTimeout(() => setShowWhatsappToast(false), DURACAO);
    }, TEMPO_INICIAL + INTERVALO);

    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(secondTimeout);
    };
  }, []);

  const goToNextBanner = () => {
    setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    resetBannerInterval();
  };

  const goToPrevBanner = () => {
    setCurrentBannerIndex(prev => (prev - 1 + banners.length) % banners.length);
    resetBannerInterval();
  };

  const resetBannerInterval = () => {
    if (bannerIntervalRef.current) {
      clearInterval(bannerIntervalRef.current);
    }
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 10000);
  };

  const addToCart = (product) => {
    if (product.price > 0) {
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      setTotal(total + product.price);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    const removedItem = cart.find(item => item.id === productId);
    setCart(updatedCart);
    setTotal(total - (removedItem ? removedItem.price : 0));
  };

  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Estilos (copiados da página de produtos para manter o mesmo visual)
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: windowWidth > 768 ? '20px' : '10px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      position: 'relative'
    },
    header: {
      textAlign: 'center',
      marginBottom: windowWidth > 768 ? '20px' : '10px',
      padding: windowWidth > 768 ? '20px' : '15px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    userWelcomeBar: {
      backgroundColor: '#095400',
      color: 'white',
      padding: windowWidth > 768 ? '12px 20px' : '10px 15px',
      borderRadius: '8px',
      flex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    welcomeMessage: {
      fontSize: windowWidth > 768 ? '16px' : '14px',
      fontWeight: '600',
      margin: 0
    },
    homeButton: {
      backgroundColor: 'white',
      color: '#095400',
      border: 'none',
      padding: windowWidth > 768 ? '8px 12px' : '6px 10px',
      borderRadius: '20px',
      fontSize: windowWidth > 768 ? '14px' : '12px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      whiteSpace: 'nowrap'
    },
    topHeaderContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: windowWidth > 768 ? '20px' : '15px',
      gap: '15px'
    },
    logoutButton: {
      display: 'block',
      margin: '0 auto 20px',
      padding: '10px 20px',
      backgroundColor: '#f0f0f0',
      border: 'none',
      borderRadius: '30px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    searchBar: {
      display: 'flex',
      justifyContent: 'center',
      margin: windowWidth > 768 ? '25px 0' : '15px 0',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      maxWidth: '500px',
      padding: windowWidth > 768 ? '12px 20px' : '10px 15px',
      borderRadius: '30px',
      border: '1px solid #ddd',
      fontSize: windowWidth > 768 ? '16px' : '14px',
      outline: 'none',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      transition: 'all 0.3s'
    },
    categoryMenu: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: windowWidth > 768 ? '10px' : '5px',
      margin: windowWidth > 768 ? '30px 0' : '15px 0',
      padding: windowWidth > 768 ? '15px' : '10px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      overflowX: windowWidth <= 768 ? 'auto' : 'visible',
      whiteSpace: 'nowrap',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    },
    categoryButton: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      border: 'none',
      padding: windowWidth > 768 ? '10px 20px' : '8px 12px',
      borderRadius: '30px',
      fontSize: windowWidth > 768 ? '14px' : '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      whiteSpace: 'nowrap'
    },
    activeCategory: {
      backgroundColor: '#095400',
      color: '#fff'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: windowWidth > 768 ? 'repeat(auto-fill, minmax(250px, 1fr))' : 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: windowWidth > 768 ? '25px' : '15px',
      margin: windowWidth > 768 ? '30px 0' : '15px 0'
    },
    productCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s'
    },
    productImage: {
      width: '100%',
      height: windowWidth > 768 ? '180px' : '120px',
      objectFit: 'cover',
      borderBottom: '1px solid #eee'
    },
    productInfo: {
      padding: windowWidth > 768 ? '20px' : '10px',
      display: 'flex',
      flexDirection: 'column',
      height: windowWidth > 768 ? 'auto' : 'calc(100% - 120px)'
    },
    productNameContainer: {
      flex: '1',
      marginBottom: '10px'
    },
    productName: {
      fontSize: windowWidth > 768 ? '16px' : '14px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '5px',
      display: '-webkit-box',
      WebkitLineClamp: expandedDescriptions ? 'unset' : (windowWidth > 768 ? 2 : 3),
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
      textAlign: 'left',
      fontWeight: '600'
    },
    productPrice: {
      fontSize: windowWidth > 768 ? '18px' : '16px',
      fontWeight: '700',
      color: '#e53935',
      margin: windowWidth > 768 ? '15px 0' : '10px 0'
    },
    unavailablePrice: {
      fontSize: windowWidth > 768 ? '18px' : '16px',
      fontWeight: '700',
      color: '#999',
      margin: windowWidth > 768 ? '15px 0' : '10px 0',
      textDecoration: 'line-through'
    },
    addButton: {
      width: '100%',
      padding: windowWidth > 768 ? '12px' : '10px',
      backgroundColor: '#095400',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: windowWidth > 768 ? '15px' : '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    disabledButton: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: windowWidth > 768 ? '40px 0' : '20px 0',
      gap: windowWidth > 768 ? '10px' : '5px',
      flexWrap: 'wrap'
    },
    pageButton: {
      padding: windowWidth > 768 ? '8px 15px' : '6px 10px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: windowWidth > 768 ? '14px' : '12px'
    },
    activePage: {
      backgroundColor: '#095400',
      color: '#fff',
      borderColor: '#095400'
    },
    resultsInfo: {
      textAlign: 'center',
      color: '#666',
      margin: windowWidth > 768 ? '20px 0' : '10px 0',
      fontSize: windowWidth > 768 ? '14px' : '12px'
    },
    authModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: windowWidth > 768 ? '0' : '10px'
    },
    authBox: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: windowWidth > 768 ? '30px' : '20px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
    },
    authToggle: {
      background: 'none',
      border: 'none',
      color: '#095400',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'underline',
      marginLeft: '5px',
      fontSize: windowWidth > 768 ? 'inherit' : '14px'
    },
    pageBlocker: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.9)',
      zIndex: 999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '20px'
    },
    blockerMessage: {
      fontSize: windowWidth > 768 ? '24px' : '18px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#095400',
      textAlign: 'center'
    },
    bannerContainer: {
      margin: windowWidth > 768 ? '40px 0' : '20px 0',
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    bannerImage: {
      width: '100%',
      display: 'block',
      transition: 'transform 0.5s ease',
      borderRadius: '10px'
    },
    bannerNavButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: windowWidth > 768 ? '40px' : '30px',
      height: windowWidth > 768 ? '40px' : '30px',
      fontSize: windowWidth > 768 ? '20px' : '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
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
      width: windowWidth > 768 ? '12px' : '8px',
      height: windowWidth > 768 ? '12px' : '8px',
      borderRadius: '50%',
      backgroundColor: '#ccc',
      margin: '0 5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
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
    promoToast: {
      background: '#fff',
      borderLeft: '4px solid #2ecc71',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      padding: '16px',
      maxWidth: '320px',
      opacity: 0,
      transform: 'translateX(20px)',
      transition: 'opacity 0.4s, transform 0.4s',
      display: 'flex',
      gap: '12px',
      marginBottom: '10px'
    },
    promoToastShow: {
      opacity: 1,
      transform: 'translateX(0)'
    },
    toastIcon: {
      fontSize: '24px',
      marginTop: '2px'
    },
    toastContent: {
      flex: 1
    },
    toastCloseBtn: {
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      color: '#95a5a6',
      alignSelf: 'flex-start'
    },
    toastTitle: {
      margin: '0 0 8px 0',
      color: '#2c3e50',
      fontSize: '16px',
      fontWeight: 700
    },
    toastMessage: {
      margin: 0,
      color: '#7f8c8d',
      fontSize: '14px',
      lineHeight: 1.4
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
    }
  };

  return (
    <>
      {/* Notificações Toast (mesmo da página de produtos) */}
      <div style={styles.toastContainer}>
        {showFreteToast && (
          <div style={{ ...styles.promoToast, ...styles.promoToastShow }}>
            <div style={styles.toastIcon}>🔔</div>
            <div style={styles.toastContent}>
              <button 
                style={styles.toastCloseBtn} 
                onClick={() => setShowFreteToast(false)}
              >
                ×
              </button>
              <h4 style={styles.toastTitle}>Frete GRÁTIS + Pague só na entrega!</h4>
              <p style={styles.toastMessage}>
                Sem risco, sem enrolação. Receba seus produtos e <span style={styles.toastHighlight}>pague só quando chegar</span>. Aproveite agora!
              </p>
            </div>
          </div>
        )}

        {showWhatsappToast && (
          <div style={{ ...styles.promoToast, ...styles.promoToastShow }}>
            <div style={styles.toastIcon}>📦</div>
            <div style={styles.toastContent}>
              <button 
                style={styles.toastCloseBtn} 
                onClick={() => setShowWhatsappToast(false)}
              >
                ×
              </button>
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

      <div style={styles.container}>
        {/* Barra de boas-vindas simplificada */}
        <div style={styles.userWelcomeBar}>
          <p style={styles.welcomeMessage}>Ofertas Da Semana | Marques Vendas PMG | Pague No Ato Da Entrega!</p>
          <a href="/" style={styles.homeButton}>
            Página Inicial
          </a>
        </div>

        <div style={styles.header}>
          <img 
            src="https://i.imgur.com/8EagMV6.png" 
            alt="Logo" 
            style={{ 
              height: windowWidth > 768 ? '60px' : '50px', 
              marginBottom: windowWidth > 768 ? '15px' : '10px' 
            }} 
          />
          <h1 style={{ 
            color: '#095400', 
            fontSize: windowWidth > 768 ? '28px' : '22px', 
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            OFERTAS ESPECIAIS
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: windowWidth > 768 ? '16px' : '14px' 
          }}>
            Confira nossas promoções sem necessidade de cadastro!
          </p>
        </div>

        <div style={styles.productsGrid}>
          {featuredProducts.map(product => (
            <div 
              key={product.id} 
              style={{
                ...styles.productCard,
                ...(product.price === 0 && { opacity: 0.7 })
              }}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                style={styles.productImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/250x180?text=Imagem+Não+Disponível';
                }}
              />
              <div style={styles.productInfo}>
                <div style={styles.productNameContainer}>
                  <h3 style={styles.productName}>
                    {product.name}
                  </h3>
                  {product.description && product.description.length > (windowWidth > 768 ? 40 : 30) && (
                    <button 
                      onClick={() => toggleDescription(product.id)}
                      style={styles.showMoreButton}
                    >
                      {expandedDescriptions[product.id] ? 'Mostrar menos' : 'Mostrar mais'}
                    </button>
                  )}
                </div>
                
                <p style={product.price > 0 ? styles.productPrice : styles.unavailablePrice}>
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

        {/* Área dos Banners (mesmo da página de produtos) */}
        <div style={styles.bannerContainer}>
          <img
            src={windowWidth > 768 ? banners[currentBannerIndex].desktop : banners[currentBannerIndex].mobile}
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

        <Cart cart={cart} setCart={setCart} removeFromCart={removeFromCart} />
      </div>
    </>
  );
};

export default OfertasPage;
