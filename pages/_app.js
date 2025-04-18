import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isPixelLoaded, setIsPixelLoaded] = useState(false);

  useEffect(() => {
    // Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-89LSRYEHF1');

    // Verifica se o pixel está carregado
    const checkPixelLoaded = () => {
      if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
        setIsPixelLoaded(true);
      } else {
        setTimeout(checkPixelLoaded, 100);
      }
    };
    checkPixelLoaded();
  }, []);

  const addToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    setTotal(total + product.price);
    
    if (typeof window !== 'undefined' && typeof window.trackAddToCart === 'function') {
      window.trackAddToCart(product);
    }
  };

  const removeFromCart = (productName) => {
    const updatedCart = cart.filter(item => item.name !== productName);
    setCart(updatedCart);
    const newTotal = updatedCart.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  };

  const trackViewContent = (product) => {
    if (typeof window !== 'undefined' && typeof window.trackViewContent === 'function') {
      window.trackViewContent(product);
    }
  };

  const trackInitiateCheckout = () => {
    if (typeof window !== 'undefined' && typeof window.trackInitiateCheckout === 'function') {
      window.trackInitiateCheckout(cart, total);
    }
  };

  const trackLead = () => {
    if (typeof window !== 'undefined' && typeof window.trackLead === 'function') {
      window.trackLead();
    }
  };

  return (
    <>
      <Head>
        <title>Marques Vendas PMG</title>
        <meta name="description" content="Carrinho de compras profissional" />
      </Head>

      {/* Google Analytics */}
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

      <Component 
        {...pageProps} 
        cart={cart}
        total={total}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        trackViewContent={trackViewContent}
        trackInitiateCheckout={trackInitiateCheckout}
        trackLead={trackLead}
        isPixelLoaded={isPixelLoaded}
      />
    </>
  );
}

export default MyApp;
