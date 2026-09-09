// ==============================================
// 📄 CARRINHO DE RETIRADA
// 📁 components/CartRetirada.js
// ==============================================

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

// ==============================================
// ⚡ CONFIGURAÇÃO DA OFERTA RELÂMPAGO (MANTIDA)
// ==============================================
const OFERTA_RELAMPAGO_CART_RETIRADA = {
  ativa: false,
  ids: [746, 765, 752, 877]
};

// IDs dos produtos em oferta (MANTIDO)
const PRODUTOS_EM_OFERTA_RETIRADA = [1098, 1170, 1171, 1174, 1176, 1177, 1178, 1195, 1198, 1203, 1204, 1208, 1213, 1215, 1895, 2162, 2164, 2426, 1222, 1229, 1224, 1230, 1121, 1446, 1450, 2234, 1439, 1444, 1448, 1468, 2587, 2591, 2853, 2882];

// IDs da Oferta Relâmpago
const PRODUTOS_OFERTA_RELAMPAGO_RETIRADA = OFERTA_RELAMPAGO_CART_RETIRADA.ids;

// Função para verificar se é oferta relâmpago
const isOfertaRelampagoRetirada = (productId) => {
  if (!OFERTA_RELAMPAGO_CART_RETIRADA.ativa) return false;
  return PRODUTOS_OFERTA_RELAMPAGO_RETIRADA.includes(productId);
};

// ==============================================
// ⭐ CONFIGURAÇÃO DA RETIRADA
// ==============================================
const PEDIDO_MINIMO_RETIRADA = 200; // R$ 200,00
const CART_STORAGE_KEY_RETIRADA = 'cart_retirada_data';

// ==============================================
// ✅ FUNÇÃO PARA FILTRAR PRODUTOS COM PREÇO ZERADO
// ==============================================
const filtrarProdutosZeradosRetirada = (cartItems) => {
  if (!cartItems || cartItems.length === 0) return cartItems;
  
  const itensFiltrados = cartItems.filter(item => {
    const temPrecoValido = item.price > 0;
    if (!temPrecoValido) {
      console.log(`🗑️ Removendo produto ID ${item.id} - ${item.name} (preço zerado)`);
      return false;
    }
    return true;
  });
  
  const removidos = cartItems.length - itensFiltrados.length;
  if (removidos > 0) {
    console.log(`🗑️ ${removidos} produto(s) com preço zerado removido(s) do carrinho de retirada`);
  }
  
  return itensFiltrados;
};

// ==============================================
// ⭐ COMPONENTE PRINCIPAL - RECEBE TUDO POR PROPS
// ==============================================
const CartRetirada = ({ 
  cart,           // ← Recebe do pai (retirada.js)
  setCart,        // ← Recebe do pai (retirada.js)
  removeFromCart, // ← Recebe do pai (retirada.js)
  pedidoMinimo = PEDIDO_MINIMO_RETIRADA 
}) => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [inputQuantities, setInputQuantities] = useState({});
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  // ==============================================
  // ✅ FUNÇÃO PARA REMOVER DO CARRINHO
  // ==============================================
  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  // ==============================================
  // ✅ FUNÇÃO PARA ALTERAR QUANTIDADE DIGITADA
  // ==============================================
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      setInputQuantities(prev => ({
        ...prev,
        [productId]: undefined
      }));
      return;
    }

    if (newQuantity > 999) {
      newQuantity = 999;
    }

    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex === -1) return;

    const newCart = [...cart];
    newCart[productIndex] = {
      ...newCart[productIndex],
      quantity: newQuantity
    };

    setCart(newCart);
    localStorage.setItem(CART_STORAGE_KEY_RETIRADA, JSON.stringify(newCart));
  };

  // ==============================================
  // ✅ FUNÇÃO - ATUALIZA PREÇOS DOS PRODUTOS
  // ==============================================
  const updateCartPrices = (currentCart) => {
    if (!currentCart || currentCart.length === 0) return currentCart;

    try {
      // ⭐ USA O products QUE VEIO DO PAI (retirada.js)
      // Mas como não temos acesso direto, vamos verificar se os produtos têm preço válido
      // O pai (retirada.js) já filtrou produtos com price > 0
      
      // Verifica se algum produto ficou com preço inválido
      const cartFiltrado = currentCart.filter(item => {
        if (item.price <= 0) {
          console.log(`🗑️ Produto ID ${item.id} - ${item.name} está com preço zerado, removendo...`);
          return false;
        }
        return true;
      });

      if (cartFiltrado.length !== currentCart.length) {
        console.log('🔄 Carrinho atualizado: produtos zerados removidos');
        return cartFiltrado;
      }

      console.log('⏺️ Nenhuma atualização necessária');
      return currentCart;
    } catch (error) {
      console.error('❌ Erro ao atualizar produtos:', error);
      return currentCart;
    }
  };

  // ==============================================
  // ✅ LOAD INICIAL - Carrega e atualiza preços
  // ==============================================
  useEffect(() => {
    const initializeCart = () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY_RETIRADA);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          const cartSemZerados = filtrarProdutosZeradosRetirada(parsedCart);
          const updatedCart = updateCartPrices(cartSemZerados);
          
          if (updatedCart.length !== parsedCart.length) {
            console.log('🔄 Carrinho atualizado: produtos zerados removidos');
            localStorage.setItem(CART_STORAGE_KEY_RETIRADA, JSON.stringify(updatedCart));
          }
          
          // ⭐ ATUALIZA O CARRINHO NO PAI (retirada.js)
          setCart(updatedCart);
        } catch (error) {
          console.error('Erro ao carregar carrinho de retirada:', error);
        }
      }
    };
    
    initializeCart();
  }, []);

  // Verificação de mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Verifica usuário logado
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user || null;
        setUser(newUser);
        
        if (newUser && cart.length > 0) {
          console.log('👤 Usuário logou, atualizando preços...');
          const updatedCart = updateCartPrices(cart);
          if (updatedCart !== cart) {
            setCart(updatedCart);
            localStorage.setItem(CART_STORAGE_KEY_RETIRADA, JSON.stringify(updatedCart));
          }
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [cart]);

  // Atualiza preços quando abre o carrinho
  useEffect(() => {
    const isCartOpen = isMobile ? isOpen : !isCollapsed;
    
    if (isCartOpen && cart.length > 0) {
      console.log('🛒 Carrinho aberto, verificando preços...');
      
      const cartSemZerados = filtrarProdutosZeradosRetirada(cart);
      const updatedCart = updateCartPrices(cartSemZerados);
      
      const mudou = updatedCart.length !== cart.length || 
                    JSON.stringify(updatedCart) !== JSON.stringify(cart);
      
      if (mudou) {
        console.log('💰 Preços atualizados ao abrir o carrinho!');
        setCart(updatedCart);
        localStorage.setItem(CART_STORAGE_KEY_RETIRADA, JSON.stringify(updatedCart));
        
        if (user) {
          setTimeout(() => {
            supabase
              .from('user_carts')
              .upsert({
                user_id: user.id,
                cart_items: updatedCart,
                tipo: 'retirada', // ⭐ MARCA COMO RETIRADA
                updated_at: new Date().toISOString()
              })
              .then(() => console.log('✅ Carrinho de retirada sincronizado com Supabase'))
              .catch(err => console.error('❌ Erro ao sincronizar:', err));
          }, 500);
        }
      }
    }
  }, [isOpen, isCollapsed, isMobile, cart, user]);

  // Sincroniza com Supabase
  useEffect(() => {
    const syncWithSupabase = async () => {
      if (!user || cart.length === 0 || isSyncing) return;
      
      const cartFiltrado = filtrarProdutosZeradosRetirada(cart);
      
      if (cartFiltrado.length !== cart.length) {
        console.log('🔄 Removendo produtos zerados durante sincronização');
        setCart(cartFiltrado);
        localStorage.setItem(CART_STORAGE_KEY_RETIRADA, JSON.stringify(cartFiltrado));
        return;
      }
      
      setIsSyncing(true);
      try {
        await supabase
          .from('user_carts')
          .upsert({ 
            user_id: user.id, 
            cart_items: cartFiltrado,
            tipo: 'retirada', // ⭐ MARCA COMO RETIRADA
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Erro ao sincronizar carrinho de retirada:', error);
      } finally {
        setIsSyncing(false);
      }
    };

    const timeoutId = setTimeout(syncWithSupabase, 1000);
    return () => clearTimeout(timeoutId);
  }, [cart, user]);

  // Feedback visual
  useEffect(() => {
    if (cart.length > 0) {
      setShowAddedFeedback(true);
      const timer = setTimeout(() => setShowAddedFeedback(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

  // Função para alternar carrinho
  const toggleCart = () => {
    if (isMobile) setIsOpen(!isOpen);
    else setIsCollapsed(!isCollapsed);
  };

  // ==============================================
  // ✅ VERIFICA LOGIN E REDIRECIONA
  // ==============================================
  const verificarLoginERedirecionar = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      const currentPath = window.location.pathname;
      sessionStorage.setItem('redirectAfterLogin', currentPath);
      
      setShowLoginMessage(true);
      
      setTimeout(() => {
        router.push(`/retirada?login=required&redirect=${encodeURIComponent(currentPath)}`);
      }, 1500);
      
      return false;
    }
    
    return true;
  };

  // ==============================================
  // ✅ FINALIZAR PEDIDO
  // ==============================================
  const finalizarPedido = async () => {
    if (!isTotalValid || !paymentMethod) {
      alert(`⚠️ Verifique o valor mínimo (R$ ${pedidoMinimo}) e selecione a forma de pagamento`);
      return;
    }

    const isLoggedIn = await verificarLoginERedirecionar();
    if (!isLoggedIn) {
      return;
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser();

    setFinalizando(true);

    try {
      const orderItems = groupedCart.map(product => ({
        id: product.id,
        name: product.name,
        price: product.unitPrice || product.price,
        quantity: product.quantity,
        image: product.image,
        totalPrice: product.totalPrice
      }));

      const orderData = {
        user_id: currentUser.id,
        order_items: orderItems,
        total_amount: totalComDesconto,
        payment_method: paymentMethod,
        status: 'completed',
        tipo_pedido: 'retirada' // ⭐ MARCA COMO RETIRADA
      };
      
      const whatsappUrl = generateWhatsAppMessage();
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      if (isIOS) {
        window.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, '_blank');
      }

      fetch('/api/finalizar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      }).catch(error => {
        console.error('❌ Erro ao salvar pedido:', error);
      });

      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY_RETIRADA);
      
      await supabase
        .from('user_carts')
        .upsert({
          user_id: currentUser.id,
          cart_items: [],
          tipo: 'retirada',
          updated_at: new Date().toISOString()
        });

      setPaymentMethod('');
      toggleCart();

    } catch (error) {
      console.error('❌ Erro ao finalizar pedido:', error);
      alert('❌ Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setFinalizando(false);
    }
  };

  // ==============================================
  // ✅ FUNÇÃO PARA FECHAR A MENSAGEM DE LOGIN
  // ==============================================
  const dismissLoginMessage = () => {
    setShowLoginMessage(false);
  };

  // Funções de cálculo
  const isBoxProduct = (productName) => {
    return /\(?\s*CX\s*\d+\.?\d*\s*KG\s*\)?/i.test(productName);
  };

  const calculateProductPrice = (product) => {
    if (isBoxProduct(product.name)) {
      return {
        unitPrice: product.price,
        totalPrice: product.price,
        weight: null,
        isBox: true
      };
    }

    const weightMatch = product.name.match(/(\d+\.?\d*)\s*KG/i);
    if (weightMatch) {
      const weight = parseFloat(weightMatch[1]);
      return {
        unitPrice: product.price,
        totalPrice: product.price * weight,
        weight: weight,
        isBox: false
      };
    }

    return {
      unitPrice: product.price,
      totalPrice: product.price,
      weight: null,
      isBox: false
    };
  };

  const extractBoxWeight = (productName) => {
    const weightMatch = productName.match(/\(?\s*CX\s*(\d+\.?\d*)\s*KG\s*\)?/i);
    return weightMatch ? parseFloat(weightMatch[1]) : null;
  };

  // Agrupa itens do carrinho
  const groupedCart = cart.reduce((acc, product) => {
    const existing = acc.find(p => p.id === product.id);
    const calculated = calculateProductPrice(product);
    const quantity = product.quantity || 1;
    const totalPrice = calculated.totalPrice * quantity;
    
    if (existing) {
      existing.quantity += quantity;
      existing.totalPrice += totalPrice;
    } else {
      acc.push({
        ...product,
        quantity: quantity,
        unitPrice: calculated.unitPrice,
        totalPrice: totalPrice,
        weight: calculated.weight,
        isBox: calculated.isBox,
        boxWeight: calculated.isBox ? extractBoxWeight(product.name) : null
      });
    }
    return acc;
  }, []);

  // ==============================================
  // ✅ CÁLCULO DE TOTAIS (SEM CUPONS E SEM CAMPANHAS)
  // ==============================================
  const totalComDesconto = groupedCart.reduce((sum, product) => sum + product.totalPrice, 0);
  const isTotalValid = totalComDesconto >= pedidoMinimo;

  // Função para ajustar quantidade
  const adjustQuantity = (productId, adjustment) => {
    const newCart = [...cart];
    let productFound = false;

    for (let i = 0; i < newCart.length; i++) {
      if (newCart[i].id === productId) {
        const newQuantity = (newCart[i].quantity || 1) + adjustment;
        if (newQuantity <= 0) newCart.splice(i, 1);
        else newCart[i] = { ...newCart[i], quantity: newQuantity };
        productFound = true;
        break;
      }
    }

    if (!productFound && adjustment > 0) {
      const productToAdd = groupedCart.find(p => p.id === productId);
      if (productToAdd) newCart.push({ ...productToAdd, quantity: 1 });
    }

    setCart(newCart);
    localStorage.setItem(CART_STORAGE_KEY_RETIRADA, JSON.stringify(newCart));
  };

  // Gerar mensagem do WhatsApp
  const generateWhatsAppMessage = () => {
    const itemsText = groupedCart.map(product => {
      const baseText = `- ${product.name}`;
      
      let linhaProduto;
      if (product.isBox && product.boxWeight) {
        linhaProduto = `${baseText} (${product.quantity}x CX ${product.boxWeight}KG) - R$ ${product.totalPrice.toFixed(2)}`;
      } else if (product.weight) {
        linhaProduto = `${baseText} (${product.quantity}x ${product.weight}KG) - R$ ${product.unitPrice.toFixed(2)}/KG = R$ ${product.totalPrice.toFixed(2)}`;
      } else {
        linhaProduto = `${baseText} (${product.quantity}x) - R$ ${product.totalPrice.toFixed(2)}`;
      }
      
      return linhaProduto;
    }).join('\n\n');

    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    let mensagemTexto;
    
    if (isMobileDevice) {
      mensagemTexto = 
        `🛒 *PEDIDO - RETIRADA* 🛒\n\n${itemsText}\n\n` +
        `💰 *TOTAL: R$ ${totalComDesconto.toFixed(2)}*\n` +
        `💳 *Pagamento:* ${paymentMethod}\n` +
        `📍 *Retirada:* Loja não tem atendimento ao público. Retirada apenas mediante pedido.\n\n` +
        `Por favor, confirme meu pedido!`;
    } else {
      mensagemTexto = 
        `*PEDIDO - RETIRADA*\n\n${itemsText}\n\n` +
        `*TOTAL: R$ ${totalComDesconto.toFixed(2)}*\n` +
        `*Pagamento:* ${paymentMethod}\n` +
        `*Retirada:* Loja não tem atendimento ao público. Retirada apenas mediante pedido.\n\n` +
        `Por favor, confirme meu pedido!`;
    }

    return `https://wa.me/5511913572902?text=${encodeURIComponent(mensagemTexto)}`;
  };

  // ==============================================
  // ⭐ JSX (MANTIDO IGUAL AO ORIGINAL, APENAS CORES ALTERADAS)
  // ==============================================
  return (
    <>
      {/* MENSAGEM DE LOGIN */}
      {showLoginMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '15px 25px',
          borderRadius: '8px',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          border: '2px solid #ffeeba',
          maxWidth: '90%',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          animation: 'slideDown 0.5s ease-out'
        }}>
          <span style={{ fontSize: '24px' }}>🔑</span>
          <div>
            <strong style={{ fontSize: '16px', display: 'block' }}>
              Você está sendo redirecionado para a página de login
            </strong>
            <span style={{ fontSize: '14px' }}>
              📦 Após o login, você voltará para a página de retirada
            </span>
          </div>
          <button
            onClick={dismissLoginMessage}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#856404',
              padding: '0 5px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Botão flutuante do carrinho - VERMELHO */}
      <div style={{
        position: 'fixed',
        right: isMobile ? '20px' : '15px',
        bottom: isMobile ? '20px' : '15px',
        zIndex: 1001,
        display: 'block'
      }}>
        <button 
          onClick={toggleCart}
          style={{
            backgroundColor: '#e53935',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: isMobile ? '65px' : '60px',
            height: isMobile ? '65px' : '60px',
            fontSize: isMobile ? '26px' : '24px',
            boxShadow: '0 4px 15px rgba(229, 57, 53, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.2s ease',
            zIndex: 1002
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(229, 57, 53, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(229, 57, 53, 0.4)';
          }}
        >
          🛒 
          {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#E74C3C',
              color: 'white',
              borderRadius: '50%',
              width: isMobile ? '26px' : '24px',
              height: isMobile ? '26px' : '24px',
              fontSize: isMobile ? '13px' : '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: '2px solid white'
            }}>
              {cart.length}
            </span>
          )}
        </button>

        {showAddedFeedback && (
          <div style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            backgroundColor: '#27AE60',
            color: 'white',
            borderRadius: '15px',
            padding: isMobile ? '6px 12px' : '4px 8px',
            fontSize: isMobile ? '13px' : '12px',
            fontWeight: 'bold',
            animation: 'fadeInOut 2s ease-in-out',
            zIndex: 1002,
            whiteSpace: 'nowrap'
          }}>
            ✅ Item adicionado!
          </div>
        )}
      </div>

      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 999,
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Container principal do carrinho */}
      <div style={{
        position: 'fixed',
        right: isMobile ? (isOpen ? '0' : '-100%') : (isCollapsed ? '-380px' : '15px'),
        bottom: isMobile ? '0' : 'auto',
        top: isMobile ? 'auto' : '15px',
        width: isMobile ? '100%' : '380px',
        height: isMobile ? '85vh' : 'auto',
        backgroundColor: '#fff',
        borderRadius: isMobile ? '20px 20px 0 0' : '12px',
        boxShadow: '0 -5px 25px rgba(0, 0, 0, 0.15)',
        padding: isMobile ? '20px 15px' : '15px',
        zIndex: 1000,
        maxHeight: isMobile ? '85vh' : '85vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        transition: isMobile ? 'transform 0.3s ease-out' : 'right 0.3s ease-in-out',
        boxSizing: 'border-box',
        transform: isMobile ? (isOpen ? 'translateY(0)' : 'translateY(100%)') : 'none',
        opacity: isMobile ? (isOpen ? 1 : 0) : (isCollapsed ? 0 : 1),
        pointerEvents: isMobile ? (isOpen ? 'auto' : 'none') : (isCollapsed ? 'none' : 'auto')
      }}>
        
        {/* Header do carrinho */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          paddingBottom: '12px',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #f0f0f0',
          marginBottom: '15px'
        }}>
          <h2 style={{ 
            fontSize: isMobile ? '18px' : '16px', 
            fontWeight: 700, 
            margin: 0, 
            color: '#2C3E50',
            paddingLeft: '5px'
          }}>
            🛒 Retirada ({cart.length})
          </h2>
          <button 
            onClick={toggleCart}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: isMobile ? '24px' : '20px', 
              cursor: 'pointer', 
              color: '#7F8C8D', 
              padding: '6px',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#f8f9fa'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            ×
          </button>
        </div>

        {/* Banner de pedido mínimo - VERMELHO */}
        <div style={{
          backgroundColor: '#FFF3E0',
          color: '#E65100',
          padding: isMobile ? '12px' : '10px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '15px',
          fontSize: isMobile ? '13px' : '12px',
          fontWeight: 700,
          border: '1px solid #FFE0B2',
          lineHeight: '1.3'
        }}>
          📦 RETIRADA • PEDIDO MÍNIMO R$ {pedidoMinimo.toFixed(2).replace('.', ',')}
        </div>

        {groupedCart.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '30px 15px', 
            color: '#7F8C8D' 
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛒</div>
            <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '5px' }}>Seu carrinho está vazio</p>
            <p style={{ fontSize: '14px' }}>Adicione produtos para continuar</p>
          </div>
        ) : (
          <>
            {/* Lista de produtos - IGUAL AO ORIGINAL */}
            <div style={{ 
              marginBottom: '15px', 
              maxHeight: isMobile ? 'calc(85vh - 350px)' : 'calc(85vh - 400px)', 
              overflowY: 'auto',
              paddingRight: '5px'
            }}>
              {groupedCart.map((product) => {
                const calculated = calculateProductPrice(product);
                
                return (
                  <div 
                    key={`${product.id}-${product.quantity}`} 
                    style={{ 
                      padding: isMobile ? '15px 0' : '12px 0', 
                      borderBottom: '2px solid #f8f9fa',
                      backgroundColor: '#fff',
                      borderRadius: '6px',
                      marginBottom: '6px'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: isMobile ? '12px' : '10px',
                      marginBottom: '10px'
                    }}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        style={{ 
                          width: isMobile ? '60px' : '50px', 
                          height: isMobile ? '60px' : '50px', 
                          borderRadius: '6px', 
                          objectFit: 'cover', 
                          border: '1px solid #eee',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ 
                        flex: 1, 
                        minWidth: 0,
                        paddingRight: '5px'
                      }}>
                        <p style={{ 
                          fontWeight: 600, 
                          margin: '0 0 5px 0', 
                          color: '#2C3E50', 
                          fontSize: isMobile ? '14px' : '13px',
                          lineHeight: '1.3',
                          wordWrap: 'break-word'
                        }}>
                          {product.name}
                          
                          {/* ⭐ BADGE OFERTA RELÂMPAGO */}
                          {isOfertaRelampagoRetirada(product.id) && (
                            <span style={{
                              display: 'inline-block',
                              marginLeft: '6px',
                              padding: '2px 8px',
                              backgroundColor: '#FF1744',
                              color: 'white',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}>
                              ⚡ RELÂMPAGO
                            </span>
                          )}
                          
                          {/* ⭐ BADGE OFERTA NORMAL */}
                          {!isOfertaRelampagoRetirada(product.id) && PRODUTOS_EM_OFERTA_RETIRADA.includes(product.id) && (
                            <span style={{
                              display: 'inline-block',
                              marginLeft: '6px',
                              padding: '2px 6px',
                              backgroundColor: '#FF6B6B',
                              color: 'white',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: 700
                            }}>
                              OFERTA
                            </span>
                          )}
                        </p>
                        {product.isBox && product.boxWeight ? (
                          <p style={{ 
                            margin: '2px 0 0', 
                            fontSize: isMobile ? '12px' : '11px', 
                            color: '#666',
                            lineHeight: '1.2'
                          }}>
                            📦 {product.quantity}x Caixa • {product.boxWeight}KG
                          </p>
                        ) : calculated.weight ? (
                          <p style={{ 
                            margin: '2px 0 0', 
                            fontSize: isMobile ? '12px' : '11px', 
                            color: '#666',
                            lineHeight: '1.2'
                          }}>
                            ⚖️ {product.quantity}x • {calculated.weight} KG × R$ {calculated.unitPrice.toFixed(2)}/KG
                          </p>
                        ) : (
                          <p style={{ 
                            margin: '2px 0 0', 
                            fontSize: isMobile ? '12px' : '11px', 
                            color: '#666',
                            lineHeight: '1.2'
                          }}>
                            📋 {product.quantity}x • R$ {calculated.unitPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Controles de quantidade e preço - IGUAL AO ORIGINAL */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginTop: '10px',
                      paddingLeft: isMobile ? '0' : '60px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: isMobile ? '10px' : '6px',
                        background: '#f8f9fa',
                        borderRadius: '20px',
                        padding: isMobile ? '6px 10px' : '4px 8px'
                      }}>
                        <button
                          onClick={() => {
                            adjustQuantity(product.id, -1);
                            setInputQuantities(prev => ({
                              ...prev,
                              [product.id]: undefined
                            }));
                          }}
                          style={{ 
                            background: '#E74C3C', 
                            color: 'white',
                            border: 'none', 
                            borderRadius: '50%', 
                            width: isMobile ? '28px' : '24px', 
                            height: isMobile ? '28px' : '24px', 
                            cursor: 'pointer',
                            fontSize: isMobile ? '16px' : '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#C0392B'}
                          onMouseOut={(e) => e.target.style.background = '#E74C3C'}
                        > - </button>
                        
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={inputQuantities[product.id] !== undefined ? inputQuantities[product.id] : product.quantity}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setInputQuantities(prev => ({
                              ...prev,
                              [product.id]: value
                            }));
                            if (value !== '') {
                              const newQuantity = Number(value);
                              if (newQuantity >= 1) {
                                handleQuantityChange(product.id, newQuantity);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value === '' || parseInt(value) <= 0) {
                              handleQuantityChange(product.id, 1);
                              setInputQuantities(prev => ({
                                ...prev,
                                [product.id]: undefined
                              }));
                            } else {
                              const newQuantity = parseInt(value);
                              if (newQuantity > 999) {
                                handleQuantityChange(product.id, 999);
                                setInputQuantities(prev => ({
                                  ...prev,
                                  [product.id]: '999'
                                }));
                              } else {
                                handleQuantityChange(product.id, newQuantity);
                                setInputQuantities(prev => ({
                                  ...prev,
                                  [product.id]: undefined
                                }));
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur();
                            }
                          }}
                          style={{
                            width: isMobile ? '40px' : '35px',
                            padding: isMobile ? '6px 2px' : '4px 2px',
                            textAlign: 'center',
                            fontSize: isMobile ? '14px' : '12px',
                            fontWeight: '600',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            background: 'white',
                            outline: 'none',
                            transition: 'border 0.2s'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#e53935';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#ddd';
                          }}
                        />
                        
                        <button
                          onClick={() => {
                            adjustQuantity(product.id, 1);
                            setInputQuantities(prev => ({
                              ...prev,
                              [product.id]: undefined
                            }));
                          }}
                          style={{ 
                            background: '#2ECC71', 
                            color: 'white',
                            border: 'none', 
                            borderRadius: '50%', 
                            width: isMobile ? '28px' : '24px', 
                            height: isMobile ? '28px' : '24px', 
                            cursor: 'pointer',
                            fontSize: isMobile ? '16px' : '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#27AE60'}
                          onMouseOut={(e) => e.target.style.background = '#2ECC71'}
                        > + </button>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: isMobile ? '12px' : '8px' 
                      }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ 
                            fontWeight: 700, 
                            margin: 0, 
                            color: '#E74C3C', 
                            fontSize: isMobile ? '15px' : '14px'
                          }}>
                            R$ {product.totalPrice.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            handleRemoveFromCart(product.id);
                            setInputQuantities(prev => ({
                              ...prev,
                              [product.id]: undefined
                            }));
                          }}
                          style={{ 
                            background: '#FF6B6B', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '50%',
                            width: isMobile ? '32px' : '28px',
                            height: isMobile ? '32px' : '28px',
                            cursor: 'pointer', 
                            fontSize: isMobile ? '16px' : '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#EE5A52'}
                          onMouseOut={(e) => e.target.style.background = '#FF6B6B'}
                        > × </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aviso de pagamento - IGUAL AO ORIGINAL */}
            <div style={{ 
              backgroundColor: '#FFF3E0', 
              color: '#E65100', 
              padding: isMobile ? '12px' : '10px', 
              borderRadius: '8px', 
              marginBottom: '15px', 
              textAlign: 'center',
              border: '1px solid #FFE0B2',
              fontSize: isMobile ? '12px' : '11px',
              fontWeight: 500
            }}>
              ⚠️ Não aceitamos pagamento antecipado, pague no ato da retirada
            </div>

            {/* Resumo do pedido - IGUAL AO ORIGINAL */}
            <div style={{ 
              backgroundColor: '#F8F9FA', 
              padding: isMobile ? '15px' : '12px', 
              borderRadius: '10px', 
              marginBottom: '15px', 
              border: '2px solid #E9ECEF' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#495057', fontSize: isMobile ? '14px' : '13px' }}>Subtotal:</span>
                <span style={{ fontWeight: 600, fontSize: isMobile ? '14px' : '13px' }}>R$ {totalComDesconto.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#495057', fontSize: isMobile ? '14px' : '13px' }}>Taxa de retirada:</span>
                <span style={{ color: '#27AE60', fontWeight: 600, fontSize: isMobile ? '14px' : '13px' }}>Grátis</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                paddingTop: '12px', 
                borderTop: '2px solid #DEE2E6' 
              }}>
                <span style={{ fontWeight: 700, fontSize: isMobile ? '15px' : '14px' }}>Total:</span>
                <span style={{ 
                  fontWeight: 700, 
                  color: isTotalValid ? '#e53935' : '#999',
                  fontSize: isMobile ? '16px' : '15px' 
                }}>
                  R$ {totalComDesconto.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Aviso de pagamento - IGUAL AO ORIGINAL */}
            <div style={{ 
              backgroundColor: '#FFF3E0', 
              color: '#E65100', 
              padding: isMobile ? '12px' : '10px', 
              borderRadius: '8px', 
              marginBottom: '15px', 
              textAlign: 'center',
              border: '1px solid #FFE0B2',
              fontSize: isMobile ? '12px' : '11px',
              fontWeight: 500
            }}>
              ⚠️ Não aceitamos pagamento antecipado, pague no ato da retirada
            </div>

            {/* Seleção de pagamento - IGUAL AO ORIGINAL (com PIX adicionado) */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: isMobile ? '15px' : '14px', 
                fontWeight: 700, 
                marginBottom: '12px', 
                color: '#2C3E50' 
              }}>
                💳 Forma de Pagamento
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'PIX'].map(method => (
                  <label 
                    key={method} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: isMobile ? '12px 10px' : '10px 12px', 
                      borderRadius: '8px', 
                      background: paymentMethod === method ? '#FFF3E0' : '#FAFAFA', 
                      border: `2px solid ${paymentMethod === method ? '#e53935' : '#EEE'}`, 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: isMobile ? '14px' : '13px'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value={method} 
                      checked={paymentMethod === method} 
                      onChange={() => setPaymentMethod(method)} 
                      style={{ 
                        marginRight: '12px', 
                        accentColor: '#e53935',
                        width: isMobile ? '16px' : '14px',
                        height: isMobile ? '16px' : '14px'
                      }} 
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            {/* Botão finalizar - VERMELHO */}
            <button
              onClick={finalizarPedido}
              disabled={!isTotalValid || !paymentMethod || finalizando}
              style={{ 
                width: '100%', 
                padding: isMobile ? '16px' : '14px', 
                background: isTotalValid && paymentMethod && !finalizando ? '#e53935' : '#BDC3C7', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                fontWeight: 700, 
                fontSize: isMobile ? '15px' : '14px', 
                cursor: isTotalValid && paymentMethod && !finalizando ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                boxShadow: isTotalValid && paymentMethod && !finalizando ? '0 4px 15px rgba(229, 57, 53, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (isTotalValid && paymentMethod && !finalizando) {
                  e.target.style.background = '#c62828';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (isTotalValid && paymentMethod && !finalizando) {
                  e.target.style.background = '#e53935';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            > 
              {finalizando ? (
                '🔄 Finalizando...'
              ) : (
                user ? '📲 FINALIZAR RETIRADA' : '🔑 FAZER LOGIN PARA FINALIZAR'
              )}
            </button>

            {!isTotalValid && (
              <p style={{ 
                color: '#E74C3C', 
                textAlign: 'center', 
                marginTop: '12px', 
                fontSize: isMobile ? '12px' : '11px',
                fontWeight: 500
              }}>
                ❌ O pedido mínimo é R$ {pedidoMinimo.toFixed(2).replace('.', ',')}
              </p>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default CartRetirada;