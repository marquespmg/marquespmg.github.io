import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';

const Markito = () => {
  // Estados combinados
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Olá! Eu sou o Markito, seu assistente da Marques Vendas PMG. Me pergunte sobre frete, pagamento ou produtos!' }
  ]);
  const [input, setInput] = useState('');
  const [produtosEncontrados, setProdutosEncontrados] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Função sanitizadora de mensagens
  const sanitizeMessage = (text) => {
    return DOMPurify.sanitize(text.replace(/\n/g, '<br/>'));
  };

  // Busca de produtos (com cache)
  const fetchProdutos = useCallback(async () => {
    try {
      const res = await fetch('/api/produtos');
      
      if (!res.ok) {
        const errorText = await res.text();
        if (errorText.startsWith('<!DOCTYPE')) {
          throw new Error('Servidor retornou página HTML inesperada');
        }
        throw new Error(errorText || 'Erro ao carregar produtos');
      }

      return await res.json();
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      return [];
    }
  }, []);

  // Processamento da mensagem integrado
  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      // Busca produtos e verifica correspondência
      const produtos = await fetchProdutos();
      const matchedProdutos = produtos.filter(produto =>
        userMessage.toLowerCase().includes(produto.name.toLowerCase())
      );

      let produtosResposta = '';
      if (matchedProdutos.length > 0) {
        produtosResposta = '🔍 Produtos encontrados:\n\n';
        matchedProdutos.forEach(prod => {
          produtosResposta += `
🛒 *${prod.name}*
📦 Categoria: ${prod.category}
💰 Preço disponível após login
🖼️ <img src="${prod.image}" alt="${prod.name}" class="product-image"/>
🔗 <a href="https://www.marquesvendaspmg.shop/produtos" target="_blank">Ver detalhes</a>
`;
        });
        setProdutosEncontrados(produtosResposta);
      }

      // Envia para a API de chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          produtos: produtosResposta
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao processar sua mensagem');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply || '❌ Não entendi sua pergunta.' }]);
      
    } catch (error) {
      console.error('Erro:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: `⚠️ Erro: ${error.message || 'Tente novamente mais tarde.'}`
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, fetchProdutos]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Renderização segura das mensagens
  const renderMessage = (text) => {
    return <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(text) }} />;
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9999
      }}>
        {isOpen ? (
          <div style={{
            width: '320px',
            height: '450px',
            backgroundColor: '#fff',
            border: '2px solid #058789',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            {/* Cabeçalho */}
            <div style={{
              backgroundColor: '#058789',
              color: '#fff',
              padding: '10px',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}>
              <img 
                src="https://i.imgur.com/WJkLMg6.png" 
                alt="Markito" 
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  marginRight: '10px'
                }} 
              />
              Markito - Chat de Vendas
              <button onClick={toggleChat} style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>X</button>
            </div>

            {/* Área de mensagens */}
            <div style={{
              flex: 1,
              padding: '10px',
              overflowY: 'auto',
              background: '#f9f9f9'
            }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  margin: '8px 0'
                }}>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: msg.sender === 'user' ? '#e03f3e' : '#e0e0e0',
                    color: msg.sender === 'user' ? '#fff' : '#000',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    maxWidth: '80%'
                  }}>
                    {renderMessage(msg.text)}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{
                  textAlign: 'left',
                  margin: '8px 0'
                }}>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#e0e0e0',
                    color: '#000',
                    padding: '8px 12px',
                    borderRadius: '20px'
                  }}>
                    <span className="typing-indicator">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Entrada de mensagem */}
            <div style={{ display: 'flex', padding: '8px', flexDirection: 'column' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem..."
                rows={2}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '10px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  marginBottom: '8px',
                  resize: 'none'
                }}
              />
              <button 
                onClick={handleSend} 
                disabled={isTyping}
                style={{
                  backgroundColor: '#058789',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  opacity: isTyping ? 0.7 : 1
                }}
              >
                {isTyping ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={toggleChat} style={{
            backgroundColor: '#058789',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="https://i.imgur.com/WJkLMg6.png" 
              alt="Markito" 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%'
              }} 
            />
          </button>
        )}
      </div>

      {/* Estilos */}
      <style jsx>{`
        .typing-indicator span {
          animation: typing 1s infinite;
          opacity: 0;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        .product-image {
          max-width: 200px;
          border-radius: 8px;
          margin-top: 8px;
          display: block;
        }

        a {
          color: #058789;
          text-decoration: none;
          font-weight: bold;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
};

export default Markito;
