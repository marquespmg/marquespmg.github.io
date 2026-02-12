import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
// ==============================================
// ✅ IMPORTA SOMENTE O ARRAY DE PRODUTOS
// ==============================================
import { produtosArray } from './produtos'; // ← Nome corrigido!

const CART_STORAGE_KEY = 'cart_data';

const Cart = ({ cart, setCart, removeFromCart }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // ==============================================
  // ✅ FUNÇÃO CORRIGIDA - USA produtosArray
  // ==============================================
  const updateCartPrices = (currentCart) => {
    if (!currentCart || currentCart.length === 0) return currentCart;

    try {
      // Verifica se produtosArray existe e é um array
      if (!produtosArray || !Array.isArray(produtosArray)) {
        console.error('❌ produtosArray não está disponível ou não é um array');
        return currentCart;
      }

      console.log(`📦 Atualizando preços com ${produtosArray.length} produtos`);

      const priceMap = {};
      produtosArray.forEach(product => {
        priceMap[product.id] = {
          price: product.price,
          name: product.name,
          image: product.image
        };
      });

      let mudou = false;
      const updatedCart = currentCart.map(item => {
        const updatedProduct = priceMap[item.id];
        if (updatedProduct) {
          if (updatedProduct.price !== item.price) {
            mudou = true;
            console.log(`🔄 Produto ${item.id}: R$ ${item.price} → R$ ${updatedProduct.price}`);
            return {
              ...item,
              price: updatedProduct.price,
              name: updatedProduct.name,
              image: updatedProduct.image
            };
          }
        }
        return item;
      });

      if (mudou) {
        console.log('✅ Preços atualizados com sucesso!');
        return updatedCart;
      }

      console.log('⏺️ Nenhuma atualização necessária');
      return currentCart;
    } catch (error) {
      console.error('❌ Erro ao atualizar preços:', error);
      return currentCart;
    }
  };

  // ==============================================
  // ✅ LOAD INICIAL - Carrega e atualiza preços
  // ==============================================
  useEffect(() => {
    const initializeCart = () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          const updatedCart = updateCartPrices(parsedCart);
          setCart(updatedCart);
        } catch (error) {
          console.error('Erro ao carregar carrinho:', error);
        }
      }
    };
    
    initializeCart();
  }, []);

  // ✅ 1. Verificação de mobile (SEU CÓDIGO ORIGINAL)
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

  // ✅ 2. Verifica usuário logado + ATUALIZA PREÇOS AO LOGAR
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
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
          }
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [cart]);

// ✅ 2.1 ATUALIZA PREÇOS QUANDO ABRE O CARRINHO - NOVO!
useEffect(() => {
  const isCartOpen = isMobile ? isOpen : !isCollapsed;
  
  if (isCartOpen && cart.length > 0) {
    console.log('🛒 Carrinho aberto, verificando preços...');
    const updatedCart = updateCartPrices(cart);
    
    if (updatedCart !== cart) {
      console.log('💰 Preços atualizados ao abrir o carrinho!');
      setCart(updatedCart);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      
      if (user) {
        setTimeout(() => {
          supabase
            .from('user_carts')
            .upsert({
              user_id: user.id,
              cart_items: updatedCart,
              updated_at: new Date().toISOString()
            })
            .then(() => console.log('✅ Carrinho sincronizado com Supabase'))
            .catch(err => console.error('❌ Erro ao sincronizar:', err));
        }, 500);
      }
    }
  }
}, [isOpen, isCollapsed, isMobile, cart, user]); // Dependências completas

  // ✅ 3. Sincroniza com Supabase (SEU CÓDIGO ORIGINAL)
  useEffect(() => {
    const syncWithSupabase = async () => {
      if (!user || cart.length === 0 || isSyncing) return;
      setIsSyncing(true);
      try {
        await supabase
          .from('user_carts')
          .upsert({ 
            user_id: user.id, 
            cart_items: cart,
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Erro ao sincronizar carrinho:', error);
      } finally {
        setIsSyncing(false);
      }
    };

    const timeoutId = setTimeout(syncWithSupabase, 1000);
    return () => clearTimeout(timeoutId);
  }, [cart, user]);

  // ✅ 4. Feedback visual (SEU CÓDIGO ORIGINAL)
  useEffect(() => {
    if (cart.length > 0) {
      setShowAddedFeedback(true);
      const timer = setTimeout(() => setShowAddedFeedback(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

  // ✅ 5. Função para alternar carrinho (SEU CÓDIGO ORIGINAL)
  const toggleCart = () => {
    if (isMobile) setIsOpen(!isOpen);
    else setIsCollapsed(!isCollapsed);
  };

  // ✅ 6. Funções de cálculo (SEU CÓDIGO ORIGINAL)
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

  // ✅ 7. Agrupa itens do carrinho (SEU CÓDIGO ORIGINAL)
  const groupedCart = cart.reduce((acc, product) => {
    const existing = acc.find(p => p.id === product.id);
    const calculated = calculateProductPrice(product);
    const quantity = product.quantity || 1;
    
    if (existing) {
      existing.quantity += quantity;
      existing.totalPrice += calculated.totalPrice * quantity;
    } else {
      acc.push({
        ...product,
        quantity: quantity,
        unitPrice: calculated.unitPrice,
        totalPrice: calculated.totalPrice * quantity,
        weight: calculated.weight,
        isBox: calculated.isBox,
        boxWeight: calculated.isBox ? extractBoxWeight(product.name) : null
      });
    }
    return acc;
  }, []);

  const total = groupedCart.reduce((sum, product) => sum + product.totalPrice, 0);
  const isTotalValid = total >= 900;

  // ✅ 8. Função para ajustar quantidade (SEU CÓDIGO ORIGINAL)
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
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  };

  // ✅ 9. Gerar mensagem do WhatsApp (SEU CÓDIGO ORIGINAL)
  const generateWhatsAppMessage = () => {
    const itemsText = groupedCart.map(product => {
      const baseText = `▪ ${product.name}`;
      if (product.isBox && product.boxWeight) {
        return `${baseText} (${product.quantity}x CX ${product.boxWeight}KG) - R$ ${product.totalPrice.toFixed(2)}`;
      } else if (product.weight) {
        return `${baseText} (${product.quantity}x ${product.weight}KG) - R$ ${product.unitPrice.toFixed(2)}/KG = R$ ${product.totalPrice.toFixed(2)}`;
      }
      return `${baseText} (${product.quantity}x) - R$ ${product.totalPrice.toFixed(2)}`;
    }).join('\n');

    return `https://wa.me/5511913572902?text=${encodeURIComponent(
      `🛒 *PEDIDO* 🛒\n\n${itemsText}\n\n` +
      `💰 *TOTAL: R$ ${total.toFixed(2)}*\n` +
      `💳 *Pagamento:* ${paymentMethod}\n` +
      `📦 *Entrega:* Frete grátis\n\n` +
      `Por favor, confirme meu pedido!`
    )}`;
  };

  // ✅ 10. JSX (SEU CÓDIGO ORIGINAL 100% - NÃO MEXI NADA)
  return (
    <>
      {/* Botão flutuante do carrinho - SEMPRE VISÍVEL */}
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
            backgroundColor: '#095400',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: isMobile ? '65px' : '60px',
            height: isMobile ? '65px' : '60px',
            fontSize: isMobile ? '26px' : '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.2s ease',
            zIndex: 1002
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
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
        WebkitOverflowScrolling: 'touch',
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
            🛒 Seu Carrinho ({cart.length})
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

        {/* Banner de frete grátis */}
        <div style={{
          backgroundColor: '#E8F5E8',
          color: '#27AE60',
          padding: isMobile ? '12px' : '10px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '15px',
          fontSize: isMobile ? '13px' : '12px',
          fontWeight: 700,
          border: '1px solid #C8E6C9',
          lineHeight: '1.3'
        }}>
          🚚 FRETE GRÁTIS • PEDIDO MÍNIMO R$ 900
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
            {/* Lista de produtos */}
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
                    {/* Layout do produto */}
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

                    {/* Controles de quantidade e preço */}
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
                          onClick={() => adjustQuantity(product.id, -1)}
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
                        <span style={{ 
                          fontSize: isMobile ? '14px' : '12px', 
                          fontWeight: '600',
                          minWidth: '18px',
                          textAlign: 'center'
                        }}>
                          {product.quantity}
                        </span>
                        <button
                          onClick={() => adjustQuantity(product.id, 1)}
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
                        <p style={{ 
                          fontWeight: 700, 
                          margin: 0, 
                          color: '#E74C3C', 
                          fontSize: isMobile ? '15px' : '14px',
                          textAlign: 'right'
                        }}>
                          R$ {product.totalPrice.toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(product.id)}
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

            {/* Aviso de pagamento */}
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
              ⚠️ Não aceitamos pagamento antecipado, pague no ato da entrega
            </div>

            {/* Resumo do pedido */}
            <div style={{ 
              backgroundColor: '#F8F9FA', 
              padding: isMobile ? '15px' : '12px', 
              borderRadius: '10px', 
              marginBottom: '15px', 
              border: '2px solid #E9ECEF' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#495057', fontSize: isMobile ? '14px' : '13px' }}>Subtotal:</span>
                <span style={{ fontWeight: 600, fontSize: isMobile ? '14px' : '13px' }}>R$ {total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#495057', fontSize: isMobile ? '14px' : '13px' }}>Frete:</span>
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
                  color: '#E74C3C', 
                  fontSize: isMobile ? '16px' : '15px' 
                }}>
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Seleção de pagamento */}
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
                {['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito'].map(method => (
                  <label 
                    key={method} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: isMobile ? '12px 10px' : '10px 12px', 
                      borderRadius: '8px', 
                      background: paymentMethod === method ? '#E8F5E9' : '#FAFAFA', 
                      border: `2px solid ${paymentMethod === method ? '#2ECC71' : '#EEE'}`, 
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
                        accentColor: '#2ECC71',
                        width: isMobile ? '16px' : '14px',
                        height: isMobile ? '16px' : '14px'
                      }} 
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            {/* Botão finalizar */}
            <button
              onClick={() => window.open(generateWhatsAppMessage(), '_blank')}
              disabled={!isTotalValid || !paymentMethod}
              style={{ 
                width: '100%', 
                padding: isMobile ? '16px' : '14px', 
                background: isTotalValid && paymentMethod ? '#2ECC71' : '#BDC3C7', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                fontWeight: 700, 
                fontSize: isMobile ? '15px' : '14px', 
                cursor: isTotalValid && paymentMethod ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                boxShadow: isTotalValid && paymentMethod ? '0 4px 15px rgba(46, 204, 113, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (isTotalValid && paymentMethod) {
                  e.target.style.background = '#27AE60';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (isTotalValid && paymentMethod) {
                  e.target.style.background = '#2ECC71';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            > 
              📲 {isMobile ? 'FINALIZAR PEDIDO' : 'Finalizar Pedido'} 
            </button>

            {!isTotalValid && (
              <p style={{ 
                color: '#E74C3C', 
                textAlign: 'center', 
                marginTop: '12px', 
                fontSize: isMobile ? '12px' : '11px',
                fontWeight: 500
              }}>
                ❌ O pedido mínimo é R$ 900.00
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

export default Cart;
