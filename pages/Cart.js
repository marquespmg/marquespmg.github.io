import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Cart = ({ cart, setCart, removeFromCart }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  // Função para carregar o carrinho do Supabase
  const loadCartFromSupabase = async () => {
    setIsLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error('Erro ao pegar usuário ou usuário não logado:', userError);
        setIsLoading(false);
        return;
      }

      const userId = userData.user.id;
      const { data, error } = await supabase
        .from('user_carts')
        .select('cart_items')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Se não existe carrinho para o usuário, cria um vazio
          const { error: insertError } = await supabase
            .from('user_carts')
            .insert({ user_id: userId, cart_items: [] });
          
          if (insertError) {
            console.error('Erro ao criar carrinho:', insertError);
          } else {
            setCart([]);
          }
        } else {
          console.error('Erro ao carregar carrinho:', error);
        }
      } else {
        setCart(data.cart_items || []);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar o carrinho no Supabase
  const updateCartInSupabase = async (updatedCart) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error('Erro ao pegar usuário:', userError);
        return;
      }

      const userId = userData.user.id;
      const { error } = await supabase
        .from('user_carts')
        .upsert({ 
          user_id: userId, 
          cart_items: updatedCart, 
          updated_at: new Date().toISOString() 
        });

      if (error) {
        console.error('Erro ao atualizar carrinho:', error);
      }
    } catch (error) {
      console.error('Erro inesperado ao atualizar carrinho:', error);
    }
  };

  // Carrega o carrinho ao montar o componente
  useEffect(() => {
    loadCartFromSupabase();
  }, []);

  // Sincroniza o carrinho no Supabase sempre que mudar
  useEffect(() => {
    if (cart.length > 0 || cart.length === 0) {
      updateCartInSupabase(cart);
    }
  }, [cart]);

  // Feedback visual quando um item é adicionado
  useEffect(() => {
    if (cart.length > 0) {
      setShowAddedFeedback(true);
      const timer = setTimeout(() => {
        setShowAddedFeedback(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

  // Função para verificar se o produto é vendido por caixa
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

  // Verifica se é mobile e monitora redimensionamento
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Verificação inicial
    handleResize();
    
    // Adiciona listener para redimensionamento
    window.addEventListener('resize', handleResize);
    
    // Limpeza do listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

// Agrupa itens do carrinho e calcula totais
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
      `🛒 *PEDIDO* 🛒\n\n${itemsText}\n\n` +
      `💰 *TOTAL: R$ ${total.toFixed(2)}*\n` +
      `💳 *Pagamento:* ${paymentMethod}\n` +
      `📦 *Entrega:* Frete grátis\n\n` +
      `Por favor, confirme meu pedido!`
    )}`;
  };

// Função para ajustar quantidade
const adjustQuantity = (productId, adjustment) => {
  const newCart = [...cart];
  let productFound = false;

  // Primeiro, tenta encontrar o produto existente
  for (let i = 0; i < newCart.length; i++) {
    if (newCart[i].id === productId) {
      const newQuantity = (newCart[i].quantity || 1) + adjustment;
      
      if (newQuantity <= 0) {
        // Remove o produto se a quantidade for 0 ou negativa
        newCart.splice(i, 1);
      } else {
        // Atualiza a quantidade do produto
        newCart[i] = {
          ...newCart[i],
          quantity: newQuantity
        };
      }
      productFound = true;
      break;
    }
  }

  // Se não encontrou o produto e o ajuste é positivo, adiciona novo item
  if (!productFound && adjustment > 0) {
    const productToAdd = groupedCart.find(p => p.id === productId);
    if (productToAdd) {
      newCart.push({
        ...productToAdd,
        quantity: 1
      });
    }
  }

  setCart(newCart);
};

  return (
    <>
      {/* Botão flutuante do carrinho */}
      <div style={{
        position: 'fixed',
        right: '15px',
        bottom: '15px',
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
            justifyContent: 'center',
            position: 'relative'
          }}
          aria-label="Abrir carrinho"
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

        {/* Feedback visual quando item é adicionado */}
        {showAddedFeedback && (
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            backgroundColor: '#27AE60',
            color: 'white',
            borderRadius: '12px',
            padding: '4px 8px',
            fontSize: '12px',
            fontWeight: 'bold',
            animation: 'fadeInOut 2s ease-in-out',
            zIndex: 1002
          }}>
            Item adicionado!
          </div>
        )}
      </div>

      {/* Overlay quando carrinho está aberto em mobile */}
      {isMobile && isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            backdropFilter: 'blur(2px)'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Container principal do carrinho */}
      <div style={{
        position: 'fixed',
        right: isMobile ? (isOpen ? '0' : '-100%') : '25px',
        bottom: isMobile ? '0' : 'auto',
        top: isMobile ? 'auto' : '25px',
        width: isMobile ? '100%' : '380px',
        height: isMobile ? '70vh' : 'auto',
        backgroundColor: '#fff',
        borderRadius: isMobile ? '12px 12px 0 0' : '12px',
        boxShadow: '0 6px 30px rgba(0, 0, 0, 0.12)',
        padding: '20px',
        zIndex: 1000,
        maxHeight: isMobile ? '70vh' : '85vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        transition: isMobile ? 'transform 0.3s ease' : 'right 0.3s ease',
        boxSizing: 'border-box',
        transform: isMobile ? (isOpen ? 'translateY(0)' : 'translateY(100%)') : 'none'
      }}>
        {isMobile && (
          <div style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#fff',
            paddingBottom: '10px',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            marginBottom: '10px'
          }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: 600,
              margin: 0,
              color: '#333'
            }}>
              Seu Carrinho
            </h2>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '5px'
              }}
              aria-label="Fechar carrinho"
            >
              ×
            </button>
          </div>
        )}

        {/* Banner de frete grátis */}
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
          marginTop: isMobile ? '0' : '0'
        }}>
          🚚 FRETE GRÁTIS • PEDIDO MÍNIMO R$750
        </div>

        {isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px'
          }}>
            <div style={{
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #2ECC71',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              animation: 'spin 1s linear infinite'
            }}></div>
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
              maxHeight: isMobile ? 'calc(70vh - 400px)' : 'none',
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
                          width: '60px',
                          height: '60px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          border: '1px solid #eee',
                          flexShrink: 0
                        }} 
                        loading="lazy"
                      />
                      <div style={{
                        flex: 1,
                        minWidth: 0
                      }}>
                        <p style={{ 
                          fontWeight: 600, 
                          margin: 0,
                          color: '#333',
                          wordBreak: 'break-word',
                          whiteSpace: 'normal',
                          fontSize: '15px'
                        }}>
                          {product.name}
                        </p>
                        {product.isBox && product.boxWeight ? (
                          <p style={{ 
                            margin: '4px 0 0',
                            fontSize: '14px',
                            color: '#666'
                          }}>
                            {product.quantity}x Caixa • {product.boxWeight}KG
                          </p>
                        ) : calculated.weight ? (
                          <p style={{ 
                            margin: '4px 0 0',
                            fontSize: '14px',
                            color: '#666'
                          }}>
                            {product.quantity}x • {calculated.weight} KG × R$ {calculated.unitPrice.toFixed(2)}/KG
                          </p>
                        ) : (
                          <p style={{ 
                            margin: '4px 0 0',
                            fontSize: '14px',
                            color: '#666'
                          }}>
                            {product.quantity}x • R$ {calculated.unitPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginLeft: '72px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => adjustQuantity(product.id, -1)}
                          style={{
                            background: '#f0f0f0',
                            border: 'none',
                            borderRadius: '4px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                          aria-label="Reduzir quantidade"
                        >
                          -
                        </button>
                        <span style={{ fontSize: '14px' }}>{product.quantity}</span>
                        <button
                          onClick={() => adjustQuantity(product.id, 1)}
                          style={{
                            background: '#f0f0f0',
                            border: 'none',
                            borderRadius: '4px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <p style={{ 
                          fontWeight: 600,
                          margin: 0,
                          color: '#E74C3C',
                          fontSize: '15px'
                        }}>
                          R$ {product.totalPrice.toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#E74C3C',
                            cursor: 'pointer',
                            fontSize: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'all 0.2s'
                          }}
                          aria-label="Remover item"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Aviso sobre pagamento */}
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
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ color: '#666' }}>Subtotal:</span>
                <span style={{ fontWeight: 500 }}>R$ {total.toFixed(2)}</span>
              </div>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
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
                <span style={{ 
                  fontWeight: 600,
                  color: '#E74C3C',
                  fontSize: '17px'
                }}>
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Seção de pagamento */}
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
                  <label 
                    key={method} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: paymentMethod === method ? '#E8F5E9' : '#FAFAFA',
                      border: `1px solid ${paymentMethod === method ? '#A5D6A7' : '#EEE'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '15px'
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
                        width: '18px',
                        height: '18px',
                        accentColor: '#2ECC71'
                      }}
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            {/* Botão de finalizar pedido */}
            <button
              onClick={() => window.open(generateWhatsAppMessage(), '_blank')}
              disabled={!isTotalValid || !paymentMethod}
              style={{
                width: '100%',
                padding: '16px',
                background: isTotalValid && paymentMethod ? '#2ECC71' : '#95A5A6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '16px',
                cursor: isTotalValid && paymentMethod ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '15px',
                boxShadow: isTotalValid && paymentMethod ? '0 2px 8px rgba(46, 204, 113, 0.3)' : 'none'
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
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(46, 204, 113, 0.3)';
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

      {/* Estilos CSS para animações */}
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
      `}</style>
    </>
  );
};

export default Cart;
