import React, { useState, useEffect } from 'react';

const Cart = ({ cart, removeFromCart }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const extractWeight = (name) => {
    const boxMatch = name.match(/\(?\s*CX\s*(\d+\.?\d*)\s*KG\s*\)?/i);
    if (boxMatch) return { isBox: true, weight: parseFloat(boxMatch[1]) };
    const kgMatch = name.match(/(\d+\.?\d*)\s*KG/i);
    if (kgMatch) return { isBox: false, weight: parseFloat(kgMatch[1]) };
    return { isBox: false, weight: null };
  };

  const groupedCart = cart.reduce((acc, product) => {
    const existing = acc.find(p => p.id === product.id);
    const { isBox, weight } = extractWeight(product.name);
    const unitPrice = product.price;
    const totalPrice = weight ? product.price * weight : product.price;

    if (existing) {
      existing.quantity++;
      existing.totalPrice += totalPrice;
    } else {
      acc.push({
        ...product,
        quantity: 1,
        unitPrice,
        totalPrice,
        isBox,
        weight
      });
    }
    return acc;
  }, []);

  const total = groupedCart.reduce((sum, product) => sum + product.totalPrice, 0);
  const isTotalValid = total >= 750;

  const generateWhatsAppMessage = () => {
    const itemsText = groupedCart.map(product => {
      if (product.isBox && product.weight) {
        return `▪ ${product.name} (${product.quantity}x CX ${product.weight}KG) - R$ ${product.totalPrice.toFixed(2)}`;
      } else if (product.weight) {
        return `▪ ${product.name} (${product.quantity}x ${product.weight}KG) - R$ ${product.unitPrice.toFixed(2)}/KG = R$ ${product.totalPrice.toFixed(2)}`;
      }
      return `▪ ${product.name} (${product.quantity}x) - R$ ${product.totalPrice.toFixed(2)}`;
    }).join('\n');

    return `https://wa.me/5511913572902?text=${encodeURIComponent(
      `🛒 *PEDIDO* 🛒\n\n${itemsText}\n\n` +
      `💰 *TOTAL: R$ ${total.toFixed(2)}*\n` +
      `💳 *Pagamento:* ${paymentMethod}\n` +
      `📦 *Entrega:* Frete grátis\n\n` +
      `Por favor, confirme meu pedido!`
    )}`;
  };

  return (
    <>
      {/* Botão Flutuante Mobile */}
      {isMobile && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'fixed', right: '15px', top: '15px', zIndex: 1001,
            backgroundColor: '#2ECC71', color: 'white', border: 'none',
            borderRadius: '50%', width: '60px', height: '60px', fontSize: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'pointer'
          }}
        >
          🛒 {cart.length > 0 && <span style={{
            position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#E74C3C',
            color: 'white', borderRadius: '50%', width: '24px', height: '24px',
            fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>{cart.length}</span>}
        </button>
      )}

      {/* Carrinho Principal */}
      <div style={{
        position: 'fixed', right: isMobile ? (isOpen ? '0' : '-100%') : '25px', top: isMobile ? '0' : '25px',
        width: isMobile ? '100%' : '380px', height: isMobile ? '100vh' : 'auto',
        backgroundColor: '#fff', borderRadius: isMobile ? '0' : '12px', boxShadow: '0 6px 30px rgba(0, 0, 0, 0.12)',
        padding: '20px', zIndex: 1000, maxHeight: isMobile ? '100vh' : '85vh', overflowY: 'auto',
        transition: 'right 0.3s ease'
      }}>
        {isMobile && <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>×</button>}

        <div style={{ backgroundColor: '#FFF9E6', color: '#E67E22', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>
          🚚 FRETE GRÁTIS • PEDIDO MÍNIMO R$750
        </div>

        {groupedCart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            <p style={{ fontSize: '16px' }}>Seu carrinho está vazio</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Adicione produtos para continuar</p>
          </div>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px', maxHeight: isMobile ? '40vh' : 'none', overflowY: 'auto' }}>
              {groupedCart.map(product => (
                <li key={product.id} style={{ display: 'flex', flexDirection: 'column', padding: '14px 0', borderBottom: '1px solid #f0f0f0', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #eee' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, margin: 0, color: '#333' }}>{product.name}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
                        {product.quantity}x {product.isBox ? `Caixa • ${product.weight}KG` : (product.weight ? `${product.weight} KG × R$ ${product.unitPrice.toFixed(2)}/KG` : `R$ ${product.unitPrice.toFixed(2)}`)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: '62px' }}>
                    <p style={{ fontWeight: 600, margin: 0, color: '#E74C3C' }}>R$ {product.totalPrice.toFixed(2)}</p>
                    <button onClick={() => removeFromCart(product.id)} style={{ background: 'none', border: 'none', color: '#E74C3C', cursor: 'pointer', fontSize: '13px', padding: '4px 8px', borderRadius: '4px' }}>
                      × Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={() => window.open(generateWhatsAppMessage())} disabled={!isTotalValid} style={{ backgroundColor: isTotalValid ? '#2ECC71' : '#AAA', color: 'white', width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '16px', cursor: isTotalValid ? 'pointer' : 'not-allowed' }}>
              Enviar Pedido via WhatsApp
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
