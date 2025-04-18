import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import '../styles/globals.css';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  // Expõe os dados do carrinho globalmente para detecção automática
  useEffect(() => {
    window.__cartData = {
      items: cart,
      total: total
    };
  }, [cart, total]);

  const addToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
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
      />
    </>
  );
}

export default MyApp;
