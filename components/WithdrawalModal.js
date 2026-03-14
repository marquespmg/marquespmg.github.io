// components/WithdrawalModal.js
import React, { useState, useEffect } from 'react';

const WithdrawalModal = ({ isOpen, onClose, cart, total, user }) => {
  const [loading, setLoading] = useState(false);
  const [localCart, setLocalCart] = useState(cart);
  const [localTotal, setLocalTotal] = useState(total);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Detecta tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sincroniza com o carrinho em tempo real
  useEffect(() => {
    if (isOpen) {
      const savedCart = localStorage.getItem('cart_data');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setLocalCart(parsedCart);
        const newTotal = parsedCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        setLocalTotal(newTotal);
      }
    }
  }, [isOpen, cart]);

  // Envia para o WhatsApp
  const sendToWhatsApp = () => {
    setLoading(true);

    // Monta mensagem do carrinho
    const itemsText = localCart.map(product => {
      const quantity = product.quantity || 1;
      const totalItem = product.price * quantity;
      return `▪ ${product.name} (${quantity}x) - R$ ${totalItem.toFixed(2)}`;
    }).join(' ▪ ');

    const mensagem = `🛍️ *PEDIDO PARA RETIRADA* 🛍️

${itemsText}

💰 *TOTAL: R$ ${localTotal.toFixed(2)}*
📍 *Retirada no Local: R. Ada Negri, 96 - Santo Amaro*
🕒 *Horário: Seg-Sex 08-16h | Sáb 09-12h*

📋 *Documentos necessários para retirada ( Para Motoristas de App segue o mesmo procedimento):*
• 🆔 CPF
• 👤 Nome completo
• 🚗 Placa do veículo

⚠️ Por favor, confirme se os itens acima estão disponíveis para retirada e retorne com a confirmação.

Obrigado!`;

    const whatsappUrl = `https://wa.me/5511913572902?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
    
    setLoading(false);
    onClose();
  };

  // Verifica se atingiu o pedido mínimo
  const atingiuMinimo = localTotal >= 300;

  if (!isOpen) return null;

  const isMobile = windowWidth <= 768;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center', // No celular, modal sobe de baixo
      justifyContent: 'center',
      zIndex: 9999,
      padding: isMobile ? '0' : '20px'
    },
    modal: {
      backgroundColor: '#fff',
      borderRadius: isMobile ? '20px 20px 0 0' : '15px', // Cantos arredondados só em cima no celular
      maxWidth: '500px',
      width: '100%',
      maxHeight: isMobile ? '85vh' : '90vh', // Altura um pouco menor no celular
      overflowY: 'auto',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      animation: isMobile ? 'slideUp 0.3s ease-out' : 'none'
    },
    header: {
      backgroundColor: '#095400',
      color: 'white',
      padding: isMobile ? '15px' : '20px',
      borderRadius: isMobile ? '20px 20px 0 0' : '15px 15px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    headerTitle: {
      margin: 0,
      fontSize: isMobile ? '18px' : '20px'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: isMobile ? '28px' : '24px',
      cursor: 'pointer',
      padding: '0 10px',
      lineHeight: 1
    },
    content: {
      padding: isMobile ? '15px' : '25px'
    },
    hoursBox: {
      backgroundColor: '#095400',
      color: 'white',
      padding: isMobile ? '12px' : '15px',
      borderRadius: '8px',
      marginBottom: isMobile ? '15px' : '20px',
      textAlign: 'center'
    },
    hoursTitle: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: 'bold'
    },
    hoursText: {
      margin: '10px 0 0 0',
      fontSize: isMobile ? '14px' : '16px'
    },
    warningBox: {
      backgroundColor: '#fff3cd',
      border: '1px solid #ffc107',
      padding: isMobile ? '12px' : '15px',
      marginBottom: isMobile ? '15px' : '20px',
      borderRadius: '8px',
      color: '#856404'
    },
    warningText: {
      fontSize: isMobile ? '13px' : '14px',
      margin: '0 0 5px 0',
      fontWeight: 'bold'
    },
    warningList: {
      margin: '10px 0 0 0',
      paddingLeft: isMobile ? '15px' : '20px',
      fontSize: isMobile ? '12px' : '14px'
    },
    warningListItem: {
      marginBottom: '8px'
    },
    dangerBox: {
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      padding: isMobile ? '12px' : '15px',
      marginBottom: isMobile ? '15px' : '20px',
      borderRadius: '8px',
      color: '#721c24'
    },
    addressBox: {
      backgroundColor: '#f8f9fa',
      padding: isMobile ? '12px' : '15px',
      marginBottom: isMobile ? '15px' : '20px',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    },
    addressTitle: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: 'bold'
    },
    addressText: {
      margin: '5px 0 0 0',
      fontSize: isMobile ? '13px' : '14px',
      lineHeight: 1.5
    },
    requiredBox: {
      backgroundColor: '#e7f3ff',
      border: '1px solid #095400',
      padding: isMobile ? '12px' : '15px',
      marginBottom: isMobile ? '15px' : '20px',
      borderRadius: '8px',
      color: '#095400'
    },
    requiredTitle: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: 'bold',
      lineHeight: 1.4
    },
    requiredList: {
      margin: '10px 0 0 0',
      paddingLeft: isMobile ? '15px' : '20px',
      fontSize: isMobile ? '13px' : '14px'
    },
    requiredListItem: {
      marginBottom: '5px'
    },
    requiredNote: {
      margin: '10px 0 0 0',
      fontSize: isMobile ? '12px' : '13px',
      fontStyle: 'italic'
    },
    summary: {
      backgroundColor: '#f8f9fa',
      padding: isMobile ? '12px' : '15px',
      marginBottom: isMobile ? '15px' : '20px',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    },
    summaryTitle: {
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: 'bold'
    },
    summaryText: {
      margin: '5px 0 0 0',
      fontSize: isMobile ? '14px' : '15px'
    },
    highlight: {
      fontWeight: 'bold',
      color: '#095400'
    },
    details: {
      marginTop: '10px'
    },
    detailsSummary: {
      cursor: 'pointer',
      color: '#095400',
      fontSize: isMobile ? '13px' : '14px'
    },
    itemsList: {
      marginTop: '10px',
      maxHeight: '150px',
      overflowY: 'auto'
    },
    itemRow: {
      fontSize: isMobile ? '11px' : '12px',
      marginBottom: '5px',
      borderBottom: '1px solid #eee',
      paddingBottom: '5px'
    },
    button: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: isMobile ? '14px 20px' : '15px 20px',
      borderRadius: '8px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginTop: '10px',
      transition: 'all 0.3s'
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    buttonSecondary: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      padding: isMobile ? '12px 20px' : '12px 20px',
      borderRadius: '8px',
      fontSize: isMobile ? '14px' : '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginTop: '10px'
    }
  };

  // Animação para celular
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(styleTag);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>🚚 Retirada no Local</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div style={styles.content}>
          
          {/* HORÁRIO DE RETIRADA */}
          <div style={styles.hoursBox}>
            <strong style={styles.hoursTitle}>🕒 Horário de Retirada</strong>
            <p style={styles.hoursText}>
              Segunda a Sexta: 08h às 16h<br />
              Sábados: 09h às 12h
            </p>
          </div>

          {/* INFORMAÇÕES IMPORTANTES */}
          <div style={styles.warningBox}>
            <strong style={styles.warningText}>⚠️ ATENÇÃO - LEIA COM ATENÇÃO:</strong>
            <ul style={styles.warningList}>
              <li style={styles.warningListItem}><strong>📌 Não somos uma loja aberta ao público</strong> - retirada apenas mediante este pedido</li>
              <li style={styles.warningListItem}><strong>💰 Pedido mínimo para retirada: R$ 300,00</strong></li>
              <li style={styles.warningListItem}><strong>💳 Pagamento:</strong> Pix ou Dinheiro (no momento da retirada)</li>
              <li style={styles.warningListItem}><strong>📦 Nosso estoque é pequeno no retira:</strong> Após enviar sua solicitação, vamos verificar se todos os itens estão disponíveis para retirada e retornaremos com a confirmação o mais breve possível.</li>
            </ul>
          </div>

          {/* ENDEREÇO */}
          <div style={styles.addressBox}>
            <strong style={styles.addressTitle}>📍 Endereço para Retirada:</strong>
            <p style={styles.addressText}>
              R. Ada Negri, 96 - Santo Amaro<br />
              São Paulo - SP, 04755-000
            </p>
          </div>

          {/* DOCUMENTOS NECESSÁRIOS */}
          <div style={styles.requiredBox}>
            <strong style={styles.requiredTitle}>📋 Documentos necessários que deverão ser informados antes para retirada ( Para Motoristas de App segue o mesmo procedimento):</strong>
            <ul style={styles.requiredList}>
              <li style={styles.requiredListItem}>🆔 CPF</li>
              <li style={styles.requiredListItem}>👤 Nome completo (para conferência)</li>
              <li style={styles.requiredListItem}>🚗 Placa do veículo (para acesso ao local)</li>
            </ul>
            <p style={styles.requiredNote}>
              * Estes dados serão solicitados na hora da retirada para segurança
            </p>
          </div>

          {/* VERIFICAÇÃO DE PEDIDO MÍNIMO */}
          {!atingiuMinimo && (
            <div style={styles.dangerBox}>
              <strong>❌ Pedido mínimo não atingido!</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: isMobile ? '13px' : '14px' }}>
                Seu pedido atual: <strong>R$ {localTotal.toFixed(2)}</strong><br />
                Faltam <strong style={{ color: '#dc3545' }}>R$ {(300 - localTotal).toFixed(2)}</strong> para o pedido mínimo de R$ 300,00.
              </p>
            </div>
          )}

          {/* RESUMO DO PEDIDO EM TEMPO REAL */}
          <div style={styles.summary}>
            <strong style={styles.summaryTitle}>🛒 Seu Pedido:</strong>
            <p style={styles.summaryText}>
              <span style={styles.highlight}>Total:</span> R$ {localTotal.toFixed(2)}<br />
              <span style={styles.highlight}>Itens:</span> {localCart.length} {localCart.length === 1 ? 'item' : 'itens'}
            </p>
            {localCart.length > 0 && (
              <details style={styles.details}>
                <summary style={styles.detailsSummary}>Ver itens</summary>
                <div style={styles.itemsList}>
                  {localCart.map(item => (
                    <div key={item.id} style={styles.itemRow}>
                      {item.name} - {item.quantity || 1}x (R$ {(item.price * (item.quantity || 1)).toFixed(2)})
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>

          {/* BOTÕES DE AÇÃO */}
          {atingiuMinimo ? (
            <button
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
              onClick={sendToWhatsApp}
              disabled={loading}
            >
              {loading ? '📤 Enviando...' : '✅ Solicitar Retirada'}
            </button>
          ) : (
            <button
              style={{...styles.button, ...styles.buttonDisabled}}
              disabled={true}
            >
              ❌ Pedido mínimo não atingido
            </button>
          )}

          <button
            style={styles.buttonSecondary}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;