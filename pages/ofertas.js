import React, { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

// ========== PRODUTOS EM OFERTA ========== //
const featuredProducts = [
  { id: 1246, name: 'CATCHUP SACHÊ HEINZ 7 G (CX 144 UN)', category: 'Ofertas', price: 18.99, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-heinz-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1302, name: 'MAIONESE SACHÊ HEINZ 7 G (CX 144 UN)', category: 'Ofertas', price: 18.99, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-heinz-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1352, name: 'MOSTARDA SACHÊ HEINZ 5 G (CX 144 UN)', category: 'Ofertas', price: 18.99, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-heinz-5-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1765, name: 'FARINHA DE TRIGO TIPO 1 NITA 5 KILO (FDO 25 KILO)', category: 'Ofertas', price: 92.99, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-nita-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1751, name: 'FARINHA DE TRIGO PIZZA NITA 5 KILO (FDO 25 KILO)', category: 'Ofertas', price: 73.99, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-nita-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1533, name: 'CHOCOLATE FORNEÁVEL AO LEITE CONFEITEIRO HARALD 1,010 KILO', category: 'Ofertas', price: 38.88, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-ao-leite-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1543, name: 'CHOCOLATE FORNEÁVEL GRANDE AO LEITE CONFEITEIRO HARALD 2,010 KILO', category: 'Ofertas', price: 65.15, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-grande-ao-leite-confeiteiro-harald-2010-kilo-pmg-atacadista.jpg' },
  { id: 1540, name: 'CHOCOLATE FORNEÁVEL BRANCO CONFEITEIRO HARALD 1,010 KILO', category: 'Ofertas', price: 27.25, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-branco-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1538, name: 'CHOCOLATE FORNEÁVEL AVELÃ CONFEITEIRO HARALD 1,010 KILO', category: 'Ofertas', price: 32.55, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-avela-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 381, name: 'EXTRATO DE TOMATE EKMA 1,7 KILO', category: 'Ofertas', price: 12.30, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-ekma-17-kilo-pmg-atacadista.jpg' },
  { id: 395, name: 'MOLHO BARBECUE EKMA 3,5 KILO', category: 'Ofertas', price: 28.80, image: 'https://www.marquesvendaspmg.shop/images/molho-barbecue-ekma-35-kilo-pmg-atacadista.jpg' },
  { id: 416, name: 'MOLHO DE TOMATE REFOGADO TRADICIONAL EKMA 1,7 KILO (CX 6 BAG)', category: 'Ofertas', price: 61.15, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-refogado-tradicional-ekma-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 1232, name: 'CATCHUP EKMA 3,3 KILO', category: 'Ofertas', price: 21.01, image: 'https://www.marquesvendaspmg.shop/images/catchup-ekma-33-kilo-pmg-atacadista.jpg' },
  { id: 1945, name: 'APRESUNTADO FRIMESA 3,7 KG (CX 4 PÇ)', category: 'Ofertas', price: 60.00, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-frimesa-37-kg-cx-4-pc-pmg-atacadista.jpg' },
  { id: 1947, name: 'BACON EM CUBOS BARRIGA FRIMESA 1 KG (CX 10 PCT)', category: 'Ofertas', price: 37.80, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-barriga-frimesa-1-kg-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1949, name: 'BANHA FRIMESA 1 KG (CX 18 PCT)', category: 'Ofertas', price: 12.88, image: 'https://www.marquesvendaspmg.shop/images/banha-frimesa-1-kg-cx-18-pct-pmg-atacadista.jpg' },
  { id: 981, name: 'CALABRESA FATIADA CONGELADA FRIMESA 1 KILO', category: 'Ofertas', price: 25.50, image: 'https://www.marquesvendaspmg.shop/images/calabresa-fatiada-congelada-frimesa-1-kilo-pmg-atacadista.jpg' },
  { id: 646, name: 'DOCE DE LEITE FRIMESA 4,8 KILO', category: 'Ofertas', price: 98.25, image: 'https://www.marquesvendaspmg.shop/images/doce-de-leite-frimesa-48-kilo-pmg-atacadista.jpg' },
  { id: 1235, name: 'CATCHUP GRANDE HEMMER 3,8 KILO', category: 'Ofertas', price: 34.70, image: 'https://www.marquesvendaspmg.shop/images/catchup-grande-hemmer-38-kilo-pmg-atacadista.jpg' },
  { id: 1248, name: 'CATCHUP SACHÊ HEMMER 7 G (CX 190 UN)', category: 'Ofertas', price: 21.50, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-hemmer-7-g-cx-190-un-pmg-atacadista.jpg' },
  { id: 1304, name: 'MAIONESE SACHÊ HEMMER 7 G (CX 190 UN)', category: 'Ofertas', price: 21.50, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-hemmer-7-g-cx-190-un-pmg-atacadista.jpg' },
  { id: 1353, name: 'MOSTARDA SACHÊ HEMMER 7 G (CX 190 UN)', category: 'Ofertas', price: 22.50, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-hemmer-7-g-cx-190-un-pmg-atacadista.jpg' },
  { id: 1392, name: 'PEPINOS RODELAS AGRIDOCE HEMMER 440 G', category: 'Ofertas', price: 19.99, image: 'https://www.marquesvendaspmg.shop/images/pepinos-rodelas-agridoce-hemmer-440-g-pmg-atacadista.jpg' },
  { id: 1291, name: 'MAIONESE GRANDE QUERO 3 KILO', category: 'Ofertas', price: 24.88, image: 'https://www.marquesvendaspmg.shop/images/maionese-grande-quero-3-kilo-pmg-atacadista.jpg' },
  { id: 1790, name: 'MACARRÃO ESPAGUETE Nº 8 COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Ofertas', price: 75.00, image: 'https://www.marquesvendaspmg.shop/images/macarrao-espaguete-n-8-com-ovos-dona-benta-500-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 1795, name: 'MACARRÃO PARAFUSO COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Ofertas', price: 73.00, image: 'https://www.marquesvendaspmg.shop/images/macarrao-parafuso-com-ovos-dona-benta-500-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 1786, name: 'MACARRÃO AVE MARIA COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Ofertas', price: 70.00, image: 'https://www.marquesvendaspmg.shop/images/macarrao-ave-maria-com-ovos-dona-benta-500-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 784, name: 'PARMESÃO 6 MESES TIROLEZ 7 KG', category: 'Ofertas', price: 67.82, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-tirolez-7-kg-pmg-atacadista.jpg' },
  { id: 661, name: 'GORGONZOLA QUEIJO AZUL TIROLEZ 3 KG', category: 'Ofertas', price: 64.00, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-queijo-azul-tirolez-3-kg-pmg-atacadista.jpg' },
  { id: 821, name: 'QUEIJO BRIE FORMA TIROLEZ 1 KG', category: 'Ofertas', price: 75.00, image: 'https://www.marquesvendaspmg.shop/images/queijo-brie-forma-tirolez-1-kg-pmg-atacadista.jpg' },
  { id: 836, name: 'QUEIJO ESTEPE TIROLEZ 7 KG', category: 'Ofertas', price: 81.00, image: 'https://www.marquesvendaspmg.shop/images/queijo-estepe-tirolez-7-kg-pmg-atacadista.jpg' },
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
  
// Contador regressivo Black Friday 2025 - VERSÃO DEFINITIVA
const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});

  // Configuração de paginação
  const productsPerPage = 10;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = featuredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(featuredProducts.length / productsPerPage);

  // Refs para intervalos
  const bannerIntervalRef = useRef(null);
  const toastTimeoutRef = useRef(null);

// Configurar contador regressivo para BLACK FRIDAY 2025
useEffect(() => {
  // Data da Black Friday 2025: 28 de Novembro de 2025
  const blackFridayDate = new Date('November 28, 2025 23:59:59');
  
  const updateCountdown = () => {
    const now = new Date().getTime();
    const difference = blackFridayDate - now;
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      });
      
      // DEBUG
      console.log('🎯 CONTADOR 2025:', { 
        dias: days,
        dataAlvo: blackFridayDate.toLocaleDateString('pt-BR')
      });
      
    } else {
      setTimeLeft({
        days: 0,
        hours: 0, 
        minutes: 0,
        seconds: 0
      });
    }
  };
  
  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
  
  return () => clearInterval(interval);
}, []);

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

  // ========== ESTILOS ATUALIZADOS - TEMA BLACK FRIDAY ========== //
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '10px' : '20px',
      backgroundColor: '#1a1a1a', // Fundo escuro Black Friday
      minHeight: '100vh',
      position: 'relative',
      fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
    },
    userWelcomeBar: {
      background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
      color: 'white',
      padding: isMobile ? '12px 15px' : '15px 20px',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(231, 76, 60, 0.4)',
      border: '2px solid #ffd700'
    },
    welcomeMessage: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      margin: 0,
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    },
    homeButton: {
      background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
      color: '#c0392b',
      border: 'none',
      padding: isMobile ? '8px 16px' : '10px 20px',
      borderRadius: '25px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
      border: '1px solid #fff'
    },
    header: {
      textAlign: 'center',
      marginBottom: isMobile ? '20px' : '30px',
      padding: isMobile ? '20px 15px' : '30px 20px',
      background: 'linear-gradient(135deg, #2c3e50, #34495e)',
      borderRadius: '15px',
      boxShadow: '0 8px 25px rgba(231, 76, 60, 0.3)',
      border: '2px solid #e74c3c'
    },
    title: {
      color: '#ffd700',
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '700',
      marginBottom: '10px',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
    },
    subtitle: {
      color: '#ecf0f1',
      fontSize: isMobile ? '14px' : '16px',
      marginBottom: '15px',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: isMobile ? '15px' : '25px',
      margin: '30px 0'
    },
    productCard: {
      background: 'linear-gradient(135deg, #2c3e50, #34495e)',
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: '2px solid #e74c3c',
      position: 'relative',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(231, 76, 60, 0.4)'
      }
    },
    productImage: {
      width: '100%',
      height: isMobile ? '140px' : '200px',
      objectFit: 'cover',
      borderBottom: '2px solid #e74c3c'
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
      color: '#ecf0f1',
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
      color: '#ffd700',
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
      color: '#ffd700',
      margin: '15px 0',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    },
    addButton: {
      width: '100%',
      padding: isMobile ? '12px' : '14px',
      background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(231, 76, 60, 0.4)',
      border: '1px solid #ffd700',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      ':hover': {
        background: 'linear-gradient(45deg, #c0392b, #a93226)',
        transform: 'translateY(-2px)'
      }
    },
    disabledButton: {
      background: 'linear-gradient(45deg, #7f8c8d, #95a5a6)',
      cursor: 'not-allowed',
      ':hover': {
        background: 'linear-gradient(45deg, #7f8c8d, #95a5a6)',
        transform: 'none'
      }
    },
    productDetailsButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: isMobile ? '28px' : '32px',
      height: isMobile ? '28px' : '32px',
      backgroundColor: '#e74c3c',
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      border: '1px solid #ffd700'
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
      background: 'linear-gradient(135deg, #2c3e50, #34495e)',
      border: '2px solid #e74c3c',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      color: '#ffd700',
      transition: 'all 0.3s ease',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      ':hover': {
        background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
        color: '#fff'
      }
    },
    activePage: {
      background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
      color: '#fff',
      borderColor: '#ffd700'
    },
    resultsInfo: {
      textAlign: 'center',
      color: '#ffd700',
      margin: '15px 0',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    },
    bannerContainer: {
      margin: '40px 0 30px',
      position: 'relative',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(231, 76, 60, 0.4)',
      border: '2px solid #e74c3c'
    },
    bannerImage: {
      width: '100%',
      display: 'block'
    },
    bannerNavButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(231, 76, 60, 0.9)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: isMobile ? '40px' : '50px',
      height: isMobile ? '40px' : '50px',
      fontSize: isMobile ? '18px' : '22px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
      fontWeight: 'bold',
      border: '1px solid #ffd700',
      ':hover': {
        backgroundColor: '#ffd700',
        color: '#e74c3c'
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
      backgroundColor: '#7f8c8d',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    activeDot: {
      backgroundColor: '#e74c3c',
      transform: 'scale(1.2)'
    },
    ctaSection: {
      textAlign: 'center', 
      margin: '50px 0',
      padding: isMobile ? '25px 15px' : '40px 20px',
      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      borderRadius: '15px',
      boxShadow: '0 8px 25px rgba(231, 76, 60, 0.4)',
      border: '3px solid #ffd700',
      position: 'relative',
      overflow: 'hidden'
    },
    footer: {
      marginTop: isMobile ? '40px' : '60px',
      padding: isMobile ? '25px 15px' : '40px 20px',
      textAlign: 'center',
      color: '#bdc3c7',
      fontSize: isMobile ? '0.8rem' : '0.85rem',
      borderTop: '3px solid #e74c3c',
      backgroundColor: '#2c3e50',
      borderRadius: '12px 12px 0 0',
      boxShadow: '0 -4px 15px rgba(231, 76, 60, 0.2)'
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
      backgroundColor: '#2c3e50',
      border: '2px solid #e74c3c'
    },
    fifoPopupClose: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      zIndex: 10,
      border: '1px solid #ffd700'
    },
    fifoPopupImageContainer: {
      width: '100%',
      height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#2c3e50',
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
      background: 'linear-gradient(45deg, #25D366, #128C7E)',
      color: 'white',
      border: 'none',
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: 'bold',
      textAlign: 'center',
      cursor: 'pointer',
      textDecoration: 'none',
      borderTop: '2px solid #ffd700'
    },
  };

  // ========== RENDERIZAÇÃO ATUALIZADA - TEMA BLACK FRIDAY ========== //
  return (
    <div style={styles.container}>
      {/* BANNER SUPERIOR BLACK FRIDAY */}
      <div style={{
        background: 'linear-gradient(45deg, #000000, #e74c3c, #000000)',
        color: 'white',
        textAlign: 'center',
        padding: isMobile ? '12px 10px' : '15px 20px',
        marginBottom: isMobile ? '15px' : '20px',
        borderRadius: '10px',
        border: '2px solid #e74c3c',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: isMobile ? '1.1rem' : '1.3rem',
            fontWeight: '800',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            background: 'linear-gradient(45deg, #ffd700, #ffffff, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shine 2s infinite'
          }}>
            🚀 BLACK FRIDAY 2025 🚀
          </span>
          <span style={{
            fontSize: isMobile ? '0.9rem' : '1rem',
            fontWeight: '600'
          }}>
            Ofertas Exclusivas | Até 70% OFF
          </span>
        </div>
      </div>

      {/* CONTADOR REGRESSIVO - 30 DIAS */}
      <div style={{
        background: 'linear-gradient(135deg, #2c3e50, #34495e)',
        color: 'white',
        padding: isMobile ? '15px 10px' : '20px 15px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: isMobile ? '20px' : '30px',
        border: '2px solid #e74c3c',
        boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          fontSize: isMobile ? '1rem' : '1.2rem',
          fontWeight: '600',
          color: '#ffd700'
        }}>
          ⏰ BLACK FRIDAY 2025 - OFERTAS TERMINAM EM:
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '8px' : '15px',
          flexWrap: 'wrap'
        }}>
          {['Dias', 'Horas', 'Minutos', 'Segundos'].map((label, index) => (
            <div key={label} style={{
              textAlign: 'center',
              minWidth: isMobile ? '70px' : '80px'
            }}>
              <div style={{
                background: '#e74c3c',
                color: 'white',
                padding: '8px',
                borderRadius: '8px',
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                fontWeight: '800',
                marginBottom: '5px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                border: '1px solid #ffd700'
              }}>
                {Object.values(timeLeft)[index]}
              </div>
              <div style={{
                fontSize: isMobile ? '0.7rem' : '0.8rem',
                color: '#bdc3c7',
                fontWeight: '600'
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <p style={{
          margin: '15px 0 0 0',
          fontSize: isMobile ? '0.7rem' : '0.8rem',
          color: '#ffd700',
          fontStyle: 'italic'
        }}>
          🚀 Prepare-se! As melhores ofertas do ano começam em breve
        </p>
      </div>

      {/* Barra de boas-vindas Black Friday */}
      <div
        style={{
          ...styles.userWelcomeBar,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p style={styles.welcomeMessage}>
          🎯 BLACK FRIDAY EXCLUSIVE - Marques Vendas PMG
        </p>
        <a
          href="/"
          style={{ ...styles.homeButton, marginTop: '8px' }}
        >
          🏠 Página Inicial
        </a>
      </div>

      {/* Cabeçalho premium Black Friday */}
      <div style={styles.header}>
        <img 
          src="https://i.imgur.com/pBH5WpZ.png" 
          alt="Marques Vendas PMG Black Friday"
          style={{ 
            height: isMobile ? '60px' : '80px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />
        <h1 style={styles.title}>🔥 BLACK FRIDAY - OFERTAS ESPECIAIS</h1>
        <p style={styles.subtitle}>🎁 Produtos selecionados com condições EXCLUSIVAS de Black Friday! ⚡ Entrega rápida</p>
        
        {/* Destaques de credibilidade Black Friday */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '10px' : '15px',
          marginTop: '20px'
        }}>
          {[
            { icon: '🚚', title: 'Entrega Express', desc: 'Black Friday' },
            { icon: '🏷️', title: 'Até 70% OFF', desc: 'Melhores Preços' },
            { icon: '🛡️', title: 'Garantia', desc: 'Produtos Premium' },
            { icon: '👨‍💼', title: 'Atendimento', desc: 'Especial BF' }
          ].map((item, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #34495e, #2c3e50)',
              padding: isMobile ? '8px 12px' : '10px 15px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #e74c3c'
            }}>
              <span style={{
                fontSize: isMobile ? '1rem' : '1.2rem',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
              }}>{item.icon}</span>
              <div>
                <div style={{
                  fontWeight: '600', 
                  fontSize: isMobile ? '0.7rem' : '0.8rem',
                  color: '#ffd700'
                }}>{item.title}</div>
                <div style={{
                  fontSize: isMobile ? '0.6rem' : '0.7rem', 
                  color: '#bdc3c7'
                }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informação de resultados */}
      <div style={styles.resultsInfo}>
        🎁 Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, featuredProducts.length)} de {featuredProducts.length} produtos em OFERTA BLACK FRIDAY
      </div>

      {/* Grade de produtos premium COM LUPA - Tema Black Friday */}
      <div style={styles.productsGrid}>
        {currentProducts.map(product => (
          <div key={product.id} style={styles.productCard}>
            {/* BOTÃO LUPA */}
            <button
              onClick={() => redirectToProductDetails(product.id)}
              style={styles.productDetailsButton}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#ffd700';
                e.target.style.color = '#e74c3c';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#e74c3c';
                e.target.style.color = 'white';
                e.target.style.transform = 'scale(1)';
              }}
              title="Ver detalhes do produto"
            >
              🔍
            </button>
            
            <img 
              src={product.image} 
              alt={product.name} 
              style={styles.productImage}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Produto+Black+Friday';
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
              
              <p style={product.price > 0 ? styles.productPrice : { ...styles.productPrice, color: '#7f8c8d', textDecoration: 'line-through' }}>
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

      {/* Paginação melhorada - Tema Black Friday */}
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

      {/* CTA premium para produtos completos - Black Friday */}
      <div style={styles.ctaSection}>
        <h2 style={{ 
          color: '#ffd700', 
          marginBottom: '15px', 
          fontSize: isMobile ? '20px' : '24px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          🎁 CATÁLOGO COMPLETO BLACK FRIDAY!
        </h2>
        <p style={{ 
          marginBottom: '25px', 
          color: 'white', 
          fontSize: isMobile ? '14px' : '16px',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          Acesse nosso catálogo completo com CENTENAS de produtos em OFERTA BLACK FRIDAY.<br />
          Cadastro rápido, condições ESPECIAIS e atendimento personalizado.
        </p>
        <a 
          href="/produtos" 
          style={{
            ...styles.addButton,
            display: 'inline-block',
            textDecoration: 'none',
            padding: '15px 35px',
            fontSize: isMobile ? '15px' : '17px',
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            color: '#c0392b'
          }}
        >
          📋 VER CATÁLOGO BLACK FRIDAY
        </a>
      </div>

      {/* Carrossel de banners - Tema Black Friday */}
      <div style={styles.bannerContainer}>
        <img
          src={isMobile ? banners[currentBannerIndex].mobile : banners[currentBannerIndex].desktop}
          alt={`Banner Black Friday ${currentBannerIndex + 1}`}
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
	  
      {/* Popup FIFO - Tema Black Friday */}
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
              🎁 PARTICIPE
            </a>
          </div>
        </div>
      )}

      {/* Conteúdo SEO Black Friday - VISÍVEL APENAS PARA O GOOGLE */}
      <div style={{
        opacity: '0', height: '0', overflow: 'hidden', position: 'absolute', pointerEvents: 'none'
      }}>
        <h1>Black Friday PMG Atacadista 2025 - Ofertas Imperdíveis em Food Service</h1>
        <p>Black Friday PMG Atacadista 2025 com as melhores ofertas para food service. PMG Atacadista Black Friday descontos de até 70% em laticínios, queijos, embutidos, bebidas e produtos alimentícios. Ofertas Black Friday PMG com condições especiais para restaurantes, bares e mercados.</p>
        
        <h2>Black Friday Food Service 2025 - PMG Atacadista</h2>
        <p>PMG Atacadista Black Friday ofertas exclusivas. Black Friday food service 2025 com preços imbatíveis. PMG Atacadista promoções Black Friday em produtos para restaurantes e estabelecimentos comerciais.</p>
        
        <h3>Black Friday PMG Atacadista App</h3>
        <p>PMG Atacadista app Black Friday para acompanhar ofertas exclusivas. PMG Atacadista telefone Black Friday: (11) 91357-2902. PMG Atacadista entrega rápida Black Friday na Grande São Paulo.</p>
      </div>

{/* Rodapé Corrigido - Totalmente Responsivo */}
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

    {/* Linha Divisa Estilizada */}
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

      {/* CSS Animations para Black Friday */}
      <style jsx global>{`
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        
        .cta-button:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 8px 25px rgba(231, 76, 60, 0.6) !important;
        }
      `}</style>
    </div>
  );
};

export default OfertasPage;
