import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Markito from '../pages/Markito';
import SeasonalOverlay from '@/components/SeasonalOverlay/SeasonalOverlay';
import '../styles/globals.css';

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
      // Verifica se o produto já está no carrinho
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      
      let newCart;
      
      if (existingProductIndex !== -1) {
        // Incrementa a quantidade se já existir
        newCart = [...prevCart];
        newCart[existingProductIndex] = {
          ...newCart[existingProductIndex],
          quantity: (newCart[existingProductIndex].quantity || 1) + 1
        };
      } else {
        // Adiciona novo produto com quantidade 1
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      
      // Atualiza o total
      setTotal(newCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
      
      return newCart;
    });
  };

  // ✅ FUNÇÃO removeFromCart ATUALIZADA
  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      
      // Atualiza o total
      setTotal(newCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
      
      return newCart;
    });
  };

  // ✅ NOVA FUNÇÃO: adjustQuantity
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
        // Atualiza o total
        setTotal(newCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
        return newCart;
      }
      
      return prevCart;
    });
  };

  // ✅ NOVA FUNÇÃO: clearCart
  const clearCart = () => {
    setCart([]);
    setTotal(0);
    localStorage.removeItem('cart_data');
  };

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

      {/* Meta Pixel do Facebook */}
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

      {/* PELÍCULA DECORATIVA NATALINA */}
      <SeasonalOverlay />

      {/* Componente principal - PASSANDO TODAS AS FUNÇÕES */}
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
      
      <Markito /> {/* Chat fixo */}
    </>
  );
}

export default MyApp;
