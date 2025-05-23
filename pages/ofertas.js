import React, { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';

// Produtos em oferta (adicione a categoria "Ofertas" aos produtos que devem aparecer aqui)
const featuredProducts = [
  {
  id: 1,
  name: 'REQUEIJÃO TOP MILK COM AMIDO 1,8 KILO',
  category: 'Ofertas',
  price: 12.99,
  image: 'https://i.imgur.com/OiC5Kae.png',
},
{
  id: 2,
  name: 'QUEIJO COALHO ESPETO CORONATA PCT 6 UN',
  category: 'Ofertas',
  price: 12.99,
  image: 'https://i.imgur.com/yyqOAIs.png',
},
{
  id: 3,
  name: 'AÇÚCAR SACHÊ PREMIUM UNIÃO 5 G (CX 400 UN)',
  category: 'Ofertas',
  price: 18.69,
  image: 'https://i.imgur.com/Pqt6Nef.png',
},
{
  id: 4,
  name: 'CATCHUP EKMA 3,3 KILO',
  category: 'Ofertas',
  price: 19.89,
  image: 'https://i.imgur.com/fWmgf0d.png',
},
{
  id: 5,
  name: 'ORÉGANO PERUANO ARCO BELLO 1,01 KILO (FDO 10 PCT)',
  category: 'Ofertas',
  price: 19.99,
  image: 'https://i.imgur.com/WEvE9Ev.png',
},
{
  id: 6,
  name: 'ATUM RALADO EM ÓLEO POUCH 88 500 G',
  category: 'Ofertas',
  price: 22.39,
  image: 'https://i.imgur.com/Pya1HhO.png',
},
{
  id: 7,
  name: 'TEMPERO SAZÓN CARNES VERMELHO AJINOMOTO 900 G',
  category: 'Ofertas',
  price: 32.59,
  image: 'https://i.imgur.com/i17pJGu.png',
},
{
  id: 8,
  name: 'REQUEIJÃO QUATÁ SEM AMIDO 1,5 KILO',
  category: 'Ofertas',
  price: 41.89,
  image: 'https://i.imgur.com/m60k9Vd.png',
},
{
  id: 9,
  name: 'REQUEIJÃO SABOR CHEDDAR SCALA 1,5 KILO',
  category: 'Ofertas',
  price: 50.79,
  image: 'https://i.imgur.com/22lCytC.png',
},
{
  id: 10,
  name: 'GORGONZOLA QUEIJO AZUL TIROLEZ 3 KG',
  category: 'Ofertas',
  price: 53.89,
  image: 'https://i.imgur.com/JsUp04G.png',
},
{
  id: 11,
  name: 'QUEIJO BRIE FORMA YEMA 1 KG',
  category: 'Ofertas',
  price: 65.59,
  image: 'https://i.imgur.com/WIkEWe8.png',
},
{
  id: 12,
  name: 'MOLHO DE TOMATE TRADICIONAL HEINZ 1,02 KILO (CX 12 BAG)',
  category: 'Ofertas',
  price: 81.89,
  image: 'https://i.imgur.com/7VWOo7u.png',
},
{
  id: 13,
  name: 'CALABRESA PRIETO 5 KILO',
  category: 'Ofertas',
  price: 85.99,
  image: 'https://i.imgur.com/JbEkOwJ.png',
},
{
  id: 14,
  name: 'FARINHA DE TRIGO TIPO 1 FARINA 5 KILO (FDO 25 KILO)',
  category: 'Ofertas',
  price: 79.39,
  image: 'https://i.imgur.com/cp3JWHX.png',
},
{
  id: 15,
  name: 'PEITO DE FRANGO CONGELADO COZIDO DESFIADO ALFAMA 1 KILO (CX 6 PCT)',
  category: 'Ofertas',
  price: 193.29,
  image: 'https://i.imgur.com/mASBprm.png',
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

// HOOK PARA DETECTAR TAMANHO DA TELA
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
  const isMobile = windowWidth <= 768;
  
  // ESTADOS PRINCIPAIS
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showFreteToast, setShowFreteToast] = useState(false);
  const [showWhatsappToast, setShowWhatsappToast] = useState(false);

  // CONFIGURAÇÃO DE PAGINAÇÃO
  const productsPerPage = 10;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = featuredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(featuredProducts.length / productsPerPage);

  // REFS PARA INTERVALOS
  const bannerIntervalRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // FUNÇÕES DE PAGINAÇÃO
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // FUNÇÃO PARA MOSTRAR MAIS/MENOS
  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // EFEITOS
  useEffect(() => {
    // Configura carrossel automático
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 10000);

    // Configura notificações
    toastTimeoutRef.current = setTimeout(() => {
      setShowFreteToast(true);
      setTimeout(() => setShowFreteToast(false), 10000);
      
      setTimeout(() => {
        setShowWhatsappToast(true);
        setTimeout(() => setShowWhatsappToast(false), 10000);
      }, 5000);
    }, 15000);

    return () => {
      clearInterval(bannerIntervalRef.current);
      clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // FUNÇÕES DO CARRINHO
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

  // FUNÇÕES DO BANNER
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

  // ESTILOS COMPLETOS
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
      flexDirection: 'column',      // muda de linha
      alignItems: 'flex-start',     // alinha à esquerda
      gap: '6px'                    // espaço entre mensagem e botão
    },
    welcomeMessage: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      margin: 0
    },
    homeButton: {
      backgroundColor: 'white',
      color: '#095400',
      border: '1px solid #095400', // opcional pra destacar
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
      marginTop: '30px',
      padding: isMobile ? '20px 15px' : '30px 20px',
      textAlign: 'center',
      color: '#666',
      fontSize: isMobile ? '14px' : '16px',
      borderTop: '1px solid #eee'
    }
  };

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

      {/* Contador de resultados */}
      <p style={styles.resultsInfo}>
        Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, featuredProducts.length)} de {featuredProducts.length} produtos
      </p>

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

      {/* Carrossel de banners (NA PARTE INFERIOR COMO SOLICITADO) */}
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

      {/* Rodapé */}
      <footer style={styles.footer}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <a href="#" style={{ color: '#095400', textDecoration: 'none' }}>Termos de Uso</a>
          <a href="#" style={{ color: '#095400', textDecoration: 'none' }}>Política de Privacidade</a>
          <a href="#" style={{ color: '#095400', textDecoration: 'none' }}>Contato</a>
        </div>
        <p>© {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.</p>
        <p style={{ fontSize: isMobile ? '12px' : '14px', color: '#999', marginTop: '5px' }}>
          Endereço: Estrada Ferreira Guedes, 784 - Potuverá CEP: 06885-150 - Itapecerica da Serra - SP
        </p>
      </footer>
    </div>
  );
};

export default OfertasPage;
