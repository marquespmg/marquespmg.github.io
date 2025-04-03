import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Cart = ({ cart, removeFromCart, updateCart }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userChecked, setUserChecked] = useState(false);

  // Funções originais de cálculo
  const isBoxProduct = (productName) => /\(?\s*CX\s*\d+\.?\d*\s*KG\s*\)?/i.test(productName);

  const calculateProductPrice = (product) => {
    if (isBoxProduct(product.name)) {
      return { unitPrice: product.price, totalPrice: product.price, weight: null, isBox: true };
    }
    const weightMatch = product.name.match(/(\d+\.?\d*)\s*KG/i);
    if (weightMatch) {
      const weight = parseFloat(weightMatch[1]);
      return { unitPrice: product.price, totalPrice: product.price * weight, weight, isBox: false };
    }
    return { unitPrice: product.price, totalPrice: product.price, weight: null, isBox: false };
  };

  const extractBoxWeight = (productName) => {
    const weightMatch = productName.match(/\(?\s*CX\s*(\d+\.?\d*)\s*KG\s*\)?/i);
    return weightMatch ? parseFloat(weightMatch[1]) : null;
  };

  // Funções de persistência corrigidas
  const loadSavedCart = async (userId) => {
    try {
      // 1. Tenta carregar do Supabase
      const { data, error } = await supabase
        .from('user_carts')
        .select('cart_items')
        .eq('user_id', userId)
        .single();

      // 2. Se não existir, cria registro vazio
      if (error?.code === 'PGRST116') {
        await supabase
          .from('user_carts')
          .insert([{ user_id: userId, cart_items: [] }]);
        updateCart([]);
        return;
      }

      // 3. Se encontrar dados, atualiza o estado
      if (data?.cart_items) {
        updateCart(data.cart_items);
      } else {
        updateCart([]);
      }

    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      // Fallback com localStorage
      const localCart = localStorage.getItem(`cart_${userId}`);
      if (localCart) {
        updateCart(JSON.parse(localCart));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveCartToSupabase = async () => {
    if (!userId || isLoading) return;
    
    try {
      await supabase
        .from('user_carts')
        .upsert({
          user_id: userId,
          cart_items: cart,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }
  };

  const clearCartInSupabase = async () => {
    if (!userId) return;
    
    try {
      await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', userId);
      localStorage.removeItem(`cart_${userId}`);
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    }
  };

  // Verificação de autenticação persistente
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          await loadSavedCart(user.id);
        } else if (error) {
          console.error("Erro ao verificar usuário:", error);
        }
      } catch (error) {
        console.error("Erro geral na verificação:", error);
      } finally {
        setUserChecked(true);
        setIsLoading(false);
      }
    };

    checkUser();

    // Ouvinte para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        await loadSavedCart(session.user.id);
      } else {
        setUserId(null);
        updateCart([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Salva automaticamente quando o carrinho muda
  useEffect(() => {
    if (userChecked && userId) {
      saveCartToSupabase();
    }
  }, [cart, userId, userChecked]);

  // Detecta tamanho da tela
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lógica de agrupamento e cálculo
  const groupedCart = cart.reduce((acc, product) => {
    const existing = acc.find(p => p.id === product.id);
    const calculated = calculateProductPrice(product);
    if (existing) {
      existing.quantity++;
      existing.totalPrice += calculated.totalPrice;
    } else {
      acc.push({
        ...product,
        quantity: 1,
        unitPrice: calculated.unitPrice,
        totalPrice: calculated.totalPrice,
        weight: calculated.weight,
        isBox: calculated.isBox,
        boxWeight: calculated.isBox ? extractBoxWeight(product.name) : null,
      });
    }
    return acc;
  }, []);

  const total = groupedCart.reduce((sum, product) => sum + product.totalPrice, 0);
  const isTotalValid = total >= 750;

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
      `🛒 *PEDIDO* 🛒\n\n${itemsText}\n\n💰 *TOTAL: R$ ${total.toFixed(2)}*\n💳 *Pagamento:* ${paymentMethod}\n📦 *Entrega:* Frete gratis\n\nPor favor, confirme meu pedido!`
    )}`;
  };

  // Renderização completa
  return (
    <>
      {/* Botão do carrinho para mobile */}
      <div style={{
        position: 'fixed',
        right: '15px',
        top: '15px',
        zIndex: 1001,
        display: isMobile ? 'block' : 'none'
      }}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: '#2ECC71',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🛒 {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#E74C3C',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Container principal do carrinho */}
      <div style={{
        position: 'fixed',
        right: isMobile ? (isOpen ? '0' : '-100%') : '25px',
        top: isMobile ? '0' : '25px',
        width: isMobile ? '100%' : '380px',
        height: isMobile ? '100vh' : 'auto',
        backgroundColor: '#fff',
        borderRadius: isMobile ? '0' : '12px',
        boxShadow: '0 6px 30px rgba(0, 0, 0, 0.12)',
        padding: '20px',
        zIndex: 1000,
        maxHeight: isMobile ? '100vh' : '85vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        transition: 'right 0.3s ease',
        boxSizing: 'border-box'
      }}>
        {isMobile && (
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        )}

        {/* Header do carrinho */}
        <div style={{
          backgroundColor: '#FFF9E6',
          color: '#E67E22',
          padding: '12px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: isMobile ? '13px' : '14px',
          fontWeight: 600,
          border: '1px solid #FFEECC',
          marginTop: isMobile ? '30px' : '0'
        }}>
          🚚 FRETE GRÁTIS • PEDIDO MÍNIMO R$750
        </div>

        {/* Lista de produtos */}
        {!userChecked ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Verificando usuário...</p>
          </div>
        ) : groupedCart.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#666'
          }}>
            <p style={{ fontSize: '16px' }}>Seu carrinho está vazio</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Adicione produtos para continuar</p>
          </div>
        ) : (
          <>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              marginBottom: '20px',
              maxHeight: isMobile ? '40vh' : 'none',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              {groupedCart.map((product) => {
                const calculated = calculateProductPrice(product);
                return (
                  <li key={`${product.id}-${product.quantity}`} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '14px 0',
                    borderBottom: '1px solid #f0f0f0',
                    gap: '10px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          border: '1px solid #eee',
                          flexShrink: 0
                        }} 
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ 
                          fontWeight: 600, 
                          margin: 0,
                          color: '#333',
                          wordBreak: 'break-word',
                          whiteSpace: 'normal'
                        }}>
                          {product.name}
                        </p>
                        {product.isBox && product.boxWeight ? (
                          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                            {product.quantity}x Caixa • {product.boxWeight}KG
                          </p>
                        ) : calculated.weight ? (
                          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                            {product.quantity}x • {calculated.weight} KG × R$ {calculated.unitPrice.toFixed(2)}/KG
                          </p>
                        ) : (
                          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                            {product.quantity}x • R$ {calculated.unitPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginLeft: '62px'
                    }}>
                      <p style={{ fontWeight: 600, margin: 0, color: '#E74C3C' }}>
                        R$ {product.totalPrice.toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#E74C3C',
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = '#FFEEEE';
                          e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'none';
                          e.currentTarget.style.textDecoration = 'none';
                        }}
                      >
                        <span>×</span> Remover
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Mensagem de aviso */}
            <div style={{
              backgroundColor: '#FFF3E0',
              color: '#E65100',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #FFCC80',
              textAlign: 'center',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              ⚠️ Não aceitamos pagamento antecipado, pague no ato da entrega
            </div>

            {/* Resumo do pedido */}
            <div style={{ 
              backgroundColor: '#FAFAFA',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #EEE'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666' }}>Subtotal:</span>
                <span style={{ fontWeight: 500 }}>R$ {total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#666' }}>Frete:</span>
                <span style={{ color: '#27AE60', fontWeight: 500 }}>Grátis</span>
              </div>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px dashed #DDD'
              }}>
                <span style={{ fontWeight: 600 }}>Total:</span>
                <span style={{ fontWeight: 600, color: '#E74C3C', fontSize: '17px' }}>
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Método de pagamento */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>💳</span> Forma de Pagamento
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito'].map(method => (
                  <label key={method} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    background: paymentMethod === method ? '#E8F5E9' : '#FAFAFA',
                    border: `1px solid ${paymentMethod === method ? '#A5D6A7' : '#EEE'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      style={{ marginRight: '10px', accentColor: '#2ECC71' }}
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            {/* Botão de finalizar pedido */}
            <button
              onClick={() => {
                window.open(generateWhatsAppMessage(), '_blank');
                clearCartInSupabase();
              }}
              disabled={!isTotalValid || !paymentMethod}
              style={{
                width: '100%',
                padding: '14px',
                background: isTotalValid && paymentMethod ? '#2ECC71' : '#95A5A6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: isTotalValid && paymentMethod ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '15px'
              }}
              onMouseOver={e => {
                if (isTotalValid && paymentMethod) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 204, 113, 0.3)';
                }
              }}
              onMouseOut={e => {
                if (isTotalValid && paymentMethod) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              📲 Finalizar Pedido
            </button>

            {!isTotalValid && (
              <p style={{
                color: '#E74C3C',
                textAlign: 'center',
                marginTop: '12px',
                fontSize: '14px'
              }}>
                O pedido mínimo é R$ 750.00
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
