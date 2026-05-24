import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Markito from '../pages/Markito';
import SeasonalOverlay from '@/components/SeasonalOverlay/SeasonalOverlay';
import '../styles/globals.css';

// ========== DETECTAR SE ESTÁ RODANDO NO APP ==========
const isRunningInApp = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  const isWebView = ua.includes('wv') || ua.includes('androidwebview');
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone === true;
  return isWebView || isPWA;
};
// ========== FIM ==========

// ========== LIMPEZA TOTAL DE CACHE (RADICAL) ==========
if (typeof window !== 'undefined') {
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone === true;
  
  if (isPWA) {
    const cacheCleaned = sessionStorage.getItem('cache_cleaned');
    if (!cacheCleaned) {
      sessionStorage.setItem('cache_cleaned', 'true');
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            console.log('🗑️ Apagando cache:', cacheName);
            caches.delete(cacheName);
          });
        });
      }
      window.location.reload(true);
    }
  }
}
// ========== FIM ==========

// ========== FORÇAR TEMA ESCURO ==========
if (typeof window !== 'undefined') {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone === true;
  
  if (isPWA && isDarkMode) {
    const hasReloadedForDark = sessionStorage.getItem('dark_mode_reloaded');
    if (!hasReloadedForDark) {
      sessionStorage.setItem('dark_mode_reloaded', 'true');
      window.location.reload(true);
    }
  }
}
// ========== FIM ==========

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  
  // Detecta se está no app (para esconder elementos)
  const isApp = isRunningInApp();

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

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart_data', JSON.stringify(cart));
      setTotal(cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
    } else {
      localStorage.removeItem('cart_data');
      setTotal(0);
    }
  }, [cart]);

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

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      setTotal(newCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
      return newCart;
    });
  };

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
            newCart[i] = { ...newCart[i], quantity: newQuantity };
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

  const clearCart = () => {
    setCart([]);
    setTotal(0);
    localStorage.removeItem('cart_data');
  };

  // ========== FORÇAR TEMA CLARO ==========
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'dark-mode', 'dark-theme');
    document.documentElement.style.colorScheme = 'light';
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#333333';
    
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = '#095400';
    
    const style = document.createElement('style');
    style.id = 'force-light-theme';
    style.textContent = `
      * { color-scheme: light !important; }
      body, html { background-color: #ffffff !important; color: #333333 !important; }
      .dark, .dark-mode, .dark-theme { background-color: #ffffff !important; color: #333333 !important; }
    `;
    const existingStyle = document.getElementById('force-light-theme');
    if (existingStyle) existingStyle.remove();
    document.head.appendChild(style);
    
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
  // ========== FIM ==========

  // ========== REFRESH PWA ==========
  useEffect(() => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone === true;
    
    if (isPWA) {
      console.log('📱 App PWA detectado');
      
      window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
          window.location.reload();
        }
      });
      
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          setTimeout(() => window.location.reload(), 100);
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);
  // ========== FIM ==========

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

      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-89LSRYEHF1" />
      <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-89LSRYEHF1');
        `,
      }} />

      <Script id="facebook-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{
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
      }} />

      {/* Só mostra SeasonalOverlay se NÃO for app */}
      {!isApp && <SeasonalOverlay />}

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
      
      {/* Só mostra Markito se NÃO for app */}
      {!isApp && <Markito />}
    </>
  );
}

export default MyApp;
