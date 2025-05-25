import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Markito from './pages/Markito'; // Importe o componente do chat
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Google Analytics (mantido igual)
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-89LSRYEHF1');
  }, []);

  // Funções do carrinho (mantidas)
  const addToCart = (product) => {
    setCart([...cart, product]);
    setTotal(total + product.price);
  };

  const removeFromCart = (productName) => {
    const updatedCart = cart.filter(item => item.name !== productName);
    setCart(updatedCart);
    const newTotal = updatedCart.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  };

  return (
    <>
      <Head>
        <title>Marques Vendas PMG</title>
        <meta name="description" content="Carrinho de compras profissional" />
      </Head>

      {/* Scripts de Analytics (mantidos) */}
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-89LSRYEHF1" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ /* ... */ }}
      />

      {/* Meta Pixel (mantido) */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ /* ... */ }}
      />

      {/* Componente principal + Chat Widget */}
      <Component 
        {...pageProps} 
        cart={cart}
        total={total}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
      
      <Markito /> {/* Chat fixo em todas as páginas */}
    </>
  );
}

export default MyApp;
