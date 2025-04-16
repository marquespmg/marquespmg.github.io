import React, { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';

const categories = [
  'Acessórios', 'Bebidas', 'Conservas/Enlatados', 'Derivados de Ave', 
  'Derivados de Bovino', 'Derivados de Leite', 'Derivados de Suíno', 
  'Derivados de Vegetal', 'Derivados do Mar', 'Doces/Frutas', 
  'Farináceos', 'Higiene', 'Orientais', 'Panificação', 'Salgados'
];

const products = [
  { id: 1, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/8Zlhcs4.png' },
  { id: 2, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://i.imgur.com/8Zlhcs4.png' },
  // Continue a adicionar seus produtos
];

const banners = [
  { 
    id: 1,
    desktop: 'https://i.imgur.com/NBAGNov.png',
    mobile: 'https://i.imgur.com/NyBHpWi.png'
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
    desktop: 'https://i.imgur.com/V3FS11U.png',
    mobile: 'https://i.imgur.com/vYBBAd6.png'
  }
];

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [authError, setAuthError] = useState('');
  const [pageBlocked, setPageBlocked] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const productsPerPage = 20;
  const bannerIntervalRef = useRef(null);

  // Efeito para o carrossel automático
  useEffect(() => {
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 5000); // Muda a cada 5 segundos

    return () => {
      if (bannerIntervalRef.current) {
        clearInterval(bannerIntervalRef.current);
      }
    };
  }, []);

  const goToNextBanner = () => {
    setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    resetBannerInterval();
  };

  const goToPrevBanner = () => {
    setCurrentBannerIndex(prev => (prev - 1 + banners.length) % banners.length);
    resetBannerInterval();
  };

  const resetBannerInterval = () => {
    if (bannerIntervalRef.current) {
      clearInterval(bannerIntervalRef.current);
    }
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 5000);
  };

  // Carrega o usuário e o carrinho ao iniciar
  useEffect(() => {
    const checkUserAndCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setPageBlocked(false);
        await loadCartFromSupabase(user.id);
      }
    };
    checkUserAndCart();
  }, []);

  // Função para carregar o carrinho do Supabase
  const loadCartFromSupabase = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_carts')
      .select('cart_items')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Se não existe carrinho, cria um vazio
        await supabase
          .from('user_carts')
          .insert({ user_id: userId, cart_items: [] });
        setCart([]);
        setTotal(0);
      } else {
        console.error('Erro ao carregar carrinho:', error);
      }
    } else {
      const cartItems = data.cart_items || [];
      setCart(cartItems);
      setTotal(cartItems.reduce((sum, item) => sum + item.price, 0));
    }
    setLoading(false);
  };

  // Função para atualizar o carrinho no Supabase
  const updateCartInSupabase = async (updatedCart) => {
    if (!user) return;
    const { error } = await supabase
      .from('user_carts')
      .upsert({ user_id: user.id, cart_items: updatedCart, updated_at: new Date().toISOString() });

    if (error) {
      console.error('Erro ao atualizar carrinho:', error);
    }
  };

  // Sincroniza o carrinho no Supabase quando ele muda
  useEffect(() => {
    if (user && cart.length >= 0) { // Evita chamada inicial desnecessária
      updateCartInSupabase(cart);
    }
  }, [cart, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      setUser(data.user);
      setShowAuthModal(false);
      setPageBlocked(false);
      await loadCartFromSupabase(data.user.id);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone,
            cpf_cnpj: cpfCnpj
          }
        }
      });
      if (error) throw error;
      const user = data?.user;
      if (!user || !user.id) throw new Error("Erro ao obter o ID do usuário.");

      await supabase
        .from('usuarios')
        .insert([
          {
            id: user.id,
            nome: name,
            email: email,
            telefone: phone,
            cpf_cnpj: cpfCnpj,
            senha: password
          }
        ]);

      alert('Cadastro realizado com sucesso! Verifique seu e-mail para confirmação.');
      setAuthType('login');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPageBlocked(true);
    setCart([]);
    setTotal(0);
  };

  const addToCart = (product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (product.price > 0) {
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      setTotal(total + product.price);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    const removedItem = cart.find(item => item.id === productId);
    setCart(updatedCart);
    setTotal(total - (removedItem ? removedItem.price : 0));
  };

  const filteredProducts = products
    .filter(product => product.category === selectedCategory)
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      position: 'relative'
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    logoutButton: {
      display: 'block',
      margin: '0 auto 20px',
      padding: '10px 20px',
      backgroundColor: '#f0f0f0',
      border: 'none',
      borderRadius: '30px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    searchBar: {
      display: 'flex',
      justifyContent: 'center',
      margin: '25px 0',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      maxWidth: '500px',
      padding: '12px 20px',
      borderRadius: '30px',
      border: '1px solid #ddd',
      fontSize: '16px',
      outline: 'none',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      transition: 'all 0.3s'
    },
    categoryMenu: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
      margin: '30px 0',
      padding: '15px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    categoryButton: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '30px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      whiteSpace: 'nowrap'
    },
    activeCategory: {
      backgroundColor: '#095400',
      color: '#fff'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '25px',
      margin: '30px 0'
    },
    productCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s'
    },
    productImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      borderBottom: '1px solid #eee'
    },
    productInfo: {
      padding: '20px'
    },
    productName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px',
      height: '40px',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    productPrice: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#e53935',
      margin: '15px 0'
    },
    unavailablePrice: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#999',
      margin: '15px 0',
      textDecoration: 'line-through'
    },
    addButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#095400',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    disabledButton: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '40px 0',
      gap: '10px'
    },
    pageButton: {
      padding: '8px 15px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    activePage: {
      backgroundColor: '#095400',
      color: '#fff',
      borderColor: '#095400'
    },
    resultsInfo: {
      textAlign: 'center',
      color: '#666',
      margin: '20px 0',
      fontSize: '14px'
    },
    authModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    authBox: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: '30px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
    },
    authToggle: {
      background: 'none',
      border: 'none',
      color: '#095400',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'underline',
      marginLeft: '5px'
    },
    pageBlocker: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.9)',
      zIndex: 999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    blockerMessage: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#095400',
      textAlign: 'center'
    },
    bannerContainer: {
      margin: '40px 0',
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    bannerImage: {
      width: '100%',
      display: 'block',
      transition: 'transform 0.5s ease',
      borderRadius: '10px'
    },
    bannerNavButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      fontSize: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
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
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#ccc',
      margin: '0 5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    activeDot: {
      backgroundColor: '#095400'
    }
  };

  return (
    <>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '20px',
          fontWeight: 'bold',
          zIndex: 9999
        }}>
          Aguarde...
        </div>
      )}

      <div style={styles.container}>
        {pageBlocked && (
          <div style={styles.pageBlocker}>
            <p style={styles.blockerMessage}>Faça login para acessar os preços e comprar</p>
            <button
              onClick={() => setShowAuthModal(true)}
              style={styles.addButton}
            >
              Acessar minha conta
            </button>
          </div>
        )}

        <div style={styles.header}>
          <img 
            src="https://i.imgur.com/8EagMV6.png" 
            alt="Logo" 
            style={{ height: '60px', marginBottom: '15px' }} 
          />
          <h1 style={{ 
            color: '#095400', 
            fontSize: '28px', 
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            PMG ATACADISTA
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Encontre os melhores produtos para seu negócio
          </p>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Sair da Conta
          </button>
        )}

        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="🔍 Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.categoryMenu}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category && styles.activeCategory)
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div style={styles.productsGrid}>
          {currentProducts.map(product => (
            <div 
              key={product.id} 
              style={{
                ...styles.productCard,
                ...(product.price === 0 && { opacity: 0.7 })
              }}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                style={styles.productImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/250x180?text=Imagem+Não+Disponível';
                }}
              />
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name}</h3>
                
                {user ? (
                  <p style={product.price > 0 ? styles.productPrice : styles.unavailablePrice}>
                    {product.price > 0 ? `R$ ${product.price.toFixed(2)}` : 'Indisponível'}
                  </p>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Faça login para ver o preço
                  </p>
                )}

                {user && (
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
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length > productsPerPage && (
          <div style={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 && { cursor: 'not-allowed', opacity: 0.5 })
              }}
            >
              Anterior
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  ...styles.pageButton,
                  ...(page === currentPage && styles.activePage)
                }}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                ...styles.pageButton,
                ...(currentPage === totalPages && { cursor: 'not-allowed', opacity: 0.5 })
              }}
            >
              Próxima
            </button>
          </div>
        )}

        {/* Área dos Banners Adicionada */}
        <div style={styles.bannerContainer}>
          <img
            src={window.innerWidth > 768 ? banners[currentBannerIndex].desktop : banners[currentBannerIndex].mobile}
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

        {showAuthModal && (
          <div style={styles.authModal}>
            <div style={styles.authBox}>
              <h2 style={{ 
                color: '#095400', 
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                {authType === 'login' ? 'Acesse Sua Conta' : 'Crie Sua Conta'}
              </h2>

              {authError && (
                <p style={{ 
                  color: '#e53935', 
                  textAlign: 'center',
                  marginBottom: '15px'
                }}>
                  {authError}
                </p>
              )}

              <form onSubmit={authType === 'login' ? handleLogin : handleRegister}>
                {authType === 'register' && (
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ ...styles.searchInput, marginBottom: '15px' }}
                    required
                  />
                )}

                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ ...styles.searchInput, marginBottom: '15px' }}
                  required
                />

                {authType === 'register' && (
                  <>
                    <input
                      type="tel"
                      placeholder="Telefone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ ...styles.searchInput, marginBottom: '15px' }}
                      required
                    />
                    <input
                      type="text"
                      placeholder="CPF/CNPJ"
                      value={cpfCnpj}
                      onChange={(e) => setCpfCnpj(e.target.value)}
                      style={{ ...styles.searchInput, marginBottom: '15px' }}
                      required
                    />
                  </>
                )}

                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...styles.searchInput, marginBottom: '20px' }}
                  required
                />

                <button
                  type="submit"
                  style={styles.addButton}
                >
                  {authType === 'login' ? 'Entrar' : 'Cadastrar'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                  {authType === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthType(authType === 'login' ? 'register' : 'login');
                      setAuthError('');
                    }}
                    style={styles.authToggle}
                  >
                    {authType === 'login' ? 'Cadastre-se' : 'Faça login'}
                  </button>
                </p>
              </form>
            </div>
          </div>
        )}

        <Cart cart={cart} setCart={setCart} removeFromCart={removeFromCart} />
      </div>
    </>
  );
};

export default ProductsPage;
