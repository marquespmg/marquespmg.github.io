import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Markito from '../pages/Markito';
import SeasonalOverlay from '@/components/SeasonalOverlay/SeasonalOverlay';
import '../styles/globals.css';

// ========== FORÇAR RECARGA PARA TEMA ESCURO (PRIMEIRO) ==========
// Isso precisa ser a PRIMEIRA coisa que executa
if (typeof window !== 'undefined') {
  // Detecta tema escuro
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone === true;
  
  // Se for PWA com tema escuro, força reload
  if (isPWA && isDarkMode) {
    const hasReloadedForDark = sessionStorage.getItem('dark_mode_reloaded');
    if (!hasReloadedForDark) {
      sessionStorage.setItem('dark_mode_reloaded', 'true');
      // Força reload imediato
      window.location.reload(true);
    }
  }
}
// ========== FIM ==========

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // ✅ CARREGAR DO LOCALSTORAGE QUANDO O APP INICIA
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem('cart_data');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
          setTotal(parsedCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    };

    loadCartFromStorage();
  }, []);

  // ✅ SALVAR NO LOCALSTORAGE SEMPRE QUE O CARRINHO MUDAR
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart_data', JSON.stringify(cart));
      setTotal(cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
    } else {
      localStorage.removeItem('cart_data');
      setTotal(0);
    }
  }, [cart]);

  // ✅ FUNÇÃO addToCart ATUALIZADA
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      
      let newCart;
      
      if (existingProductIndex !== -1) {
        newCart = [...prevCart];
        newCart[existingProductIndex] = {
          ...newCart[existingProductIndex],
          quantity: (newCart[existingProductIndex].quantity || 1) + 1
        };
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      
      setTotal(newCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
      
      return newCart;
    });
  };

  // ✅ FUNÇÃO removeFromCart ATUALIZADA
  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      setTotal(newCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
      return newCart;
    });
  };

  // ✅ FUNÇÃO adjustQuantity
  const adjustQuantity = (productId, adjustment) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      let productFound = false;

      for (let i = 0; i < newCart.length; i++) {
        if (newCart[i].id === productId) {
          const newQuantity = (newCart[i].quantity || 1) + adjustment;
          
          if (newQuantity <= 0) {
            newCart.splice(i, 1);
          } else {
            newCart[i] = {
              ...newCart[i],
              quantity: newQuantity
            };
          }
          productFound = true;
          break;
        }
      }

      if (productFound) {
        setTotal(newCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
        return newCart;
      }
      
      return prevCart;
    });
  };

  // ✅ FUNÇÃO clearCart
  const clearCart = () => {
    setCart([]);
    setTotal(0);
    localStorage.removeItem('cart_data');
  };

  // ========== FORÇAR TEMA CLARO (GLOBAL) ==========
  useEffect(() => {
    // Remove qualquer classe de tema escuro
    document.documentElement.classList.remove('dark', 'dark-mode', 'dark-theme');
    
    // Força o estilo inline
    document.documentElement.style.colorScheme = 'light';
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#333333';
    
    // Força a meta tag theme-color
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = '#095400';
    
    // Força CSS global para garantir que tudo fique claro
    const style = document.createElement('style');
    style.id = 'force-light-theme';
    style.textContent = `
      * {
        color-scheme: light !important;
      }
      body, html {
        background-color: #ffffff !important;
        color: #333333 !important;
      }
      .dark, .dark-mode, .dark-theme {
        background-color: #ffffff !important;
        color: #333333 !important;
      }
    `;
    
    // Remove se já existir para não duplicar
    const existingStyle = document.getElementById('force-light-theme');
    if (existingStyle) existingStyle.remove();
    document.head.appendChild(style);
    
    // Observa mudanças no tema do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.remove('dark', 'dark-mode', 'dark-theme');
        document.documentElement.style.colorScheme = 'light';
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#333333';
      }
    };
    
    mediaQuery.addEventListener('change', handleThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
      const styleToRemove = document.getElementById('force-light-theme');
      if (styleToRemove) styleToRemove.remove();
    };
  }, []);
  // ========== FIM FORÇAR TEMA CLARO ==========

  // ========== REFRESH AUTOMÁTICO PARA PWA (APP) ==========
  useEffect(() => {
    // Detecta se está rodando como PWA (app instalado)
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone === true;
    
    console.log('🔍===== DEBUG REFRESH =====');
    console.log('display-mode:', window.matchMedia('(display-mode: standalone)').matches);
    console.log('navigator.standalone:', window.navigator.standalone);
    console.log('isPWA detectado:', isPWA);
    console.log('🔍========================');
    
    if (isPWA) {
      console.log('📱 App PWA detectado - Refresh automático ativado');
      
      // 1. Refresh quando o app for aberto
      window.addEventListener('pageshow', (event) => {
        console.log('📄 Evento pageshow disparado, persisted:', event.persisted);
        if (event.persisted) {
          console.log('🔄 App aberto do cache - Recarregando para pegar preços novos');
          window.location.reload();
        }
      });
      
      // 2. Refresh quando o app voltar do segundo plano
      const handleVisibilityChange = () => {
        console.log('👁️ visibilitychange disparado, hidden:', document.hidden);
        if (!document.hidden) {
          console.log('🔄 App voltou do segundo plano - Verificando preços');
          setTimeout(() => {
            console.log('🔄 Executando reload...');
            window.location.reload();
          }, 100);
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
      
    } else {
      console.log('❌ Não detectado como PWA - Refresh NÃO ativado');
    }
  }, []);
  // ========== FIM DO REFRESH AUTOMÁTICO ==========

  // Google Analytics
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-89LSRYEHF1');
  }, []);

  return (
    <>
      <Head>
        <title>Marques Vendas PMG</title>
        <meta name="description" content="Carrinho de compras profissional" />
      </Head>

      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-89LSRYEHF1"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-89LSRYEHF1');
          `,
        }}
      />

      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '9491377657643670');
            fbq('track', 'PageView');
          `
        }}
      />

      <SeasonalOverlay />

      <Component 
        {...pageProps} 
        cart={cart}
        setCart={setCart}
        total={total}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        adjustQuantity={adjustQuantity}
        clearCart={clearCart}
      />
      
      <Markito />
    </>
  );
}

export default MyApp;
