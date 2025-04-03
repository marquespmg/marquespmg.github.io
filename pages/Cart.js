import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Cart = ({ cart, removeFromCart, updateCart, userId }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        boxWeight: calculated.isBox ? extractBoxWeight(product.name) : null
      });
    }
    return acc;
  }, []);

  const total = groupedCart.reduce((sum, product) => sum + product.totalPrice, 0);
  const isTotalValid = total >= 750;

  const clearCart = async () => {
    if (!userId) return;
    
    try {
      await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', userId);
      
      localStorage.removeItem(`cart_${userId}`);
      updateCart([]);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  };

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
      `📦 *Entrega:* Frete gratis\n\n` +
      `Por favor, confirme meu pedido!`
    )}`;
  };

  return (
    <>
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
          aria-label="Abrir carrinho"
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
            aria-label="Fechar carrinho"
          >
            ×
          </button>
        )}

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

        {groupedCart.length === 0 ? (
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
                          whiteSpace: 'normal'
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
                      marginLeft: '62px'
                    }}>
                      <p style={{ 
                        fontWeight: 600,
                        margin: 0,
                        color: '#E74C3C'
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
                        aria-label={`Remover ${product.name} do carrinho`}
                      >
                        <span>×</span> Remover
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

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
                      style={{ 
                        marginRight: '10px',
                        accentColor: '#2ECC71'
                      }}
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                window.open(generateWhatsAppMessage(), '_blank');
                clearCart();
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
              aria-disabled={!isTotalValid || !paymentMethod}
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
