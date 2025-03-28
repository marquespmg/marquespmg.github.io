import { useState } from 'react';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Adiciona produto ao carrinho
  const addToCart = (product) => {
    setCart([...cart, product]);
    setTotal(total + product.price);
  };

  // Remove TODAS as unidades de um produto pelo NOME
  const removeFromCart = (productName) => {
    const updatedCart = cart.filter(item => item.name !== productName);
    setCart(updatedCart);
    
    // Recalcula o total
    const newTotal = updatedCart.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  };

  return (
    <>
      <Head>
        <title>Marques Vendaspmg</title>
        <meta name="description" content="Carrinho de compras profissional" />
      </Head>
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