import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import '../styles/globals.css';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  // Rastreia ViewContent quando a página de produto é acessada
  useEffect(() => {
    if (router.pathname.includes('/produtos') {
      // Supondo que você tenha os dados do produto disponíveis
      const productData = getProductData(); // Você precisa implementar esta função
      if (productData && typeof window.trackViewContent === 'function') {
        window.trackViewContent(productData);
      }
    }
  }, [router.pathname]);

  const addToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    setTotal(total + product.price);
    
    // Dispara AddToCart
    if (typeof window.trackAddToCart === 'function') {
      window.trackAddToCart(product);
      
      // Mostra mensagem "Item adicionado!" (para compatibilidade com suas regras atuais)
      alert('Item adicionado!');
    }
  };

  const removeFromCart = (productName) => {
    const updatedCart = cart.filter(item => item.name !== productName);
    setCart(updatedCart);
    const newTotal = updatedCart.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  };

  const initiateCheckout = () => {
    // Dispara InitiateCheckout quando o usuário clica em "Finalizar Pedido"
    if (typeof window.trackInitiateCheckout === 'function') {
      window.trackInitiateCheckout(cart, total);
    }
    // Sua lógica de checkout aqui
    router.push('/checkout?method=dinheiro'); // Exemplo para compatibilidade com suas regras
  };

  const handleLead = () => {
    // Dispara Lead quando um cadastro é concluído com sucesso
    if (typeof window.trackLead === 'function') {
      window.trackLead();
    }
    // Mostra mensagem de sucesso (para compatibilidade com suas regras)
    alert('Cadastro realizado com sucesso!');
    router.push('/produtos');
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
        initiateCheckout={initiateCheckout}
        handleLead={handleLead}
      />
    </>
  );
}

export default MyApp;
