import React, { useState, useEffect } from 'react';

const Markito = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Olá! Eu sou o Markito, seu assistente da Marques Vendas PMG. Me pergunte sobre frete, pagamento ou produtos!' }
  ]);
  const [input, setInput] = useState('');
  const [queue, setQueue] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Configuração da API - substitua pela sua URL do Vercel
  const API_BASE_URL = ''; // Remove a URL base para rotas relativas

  const toggleChat = () => setIsOpen(!isOpen);

  const fetchProdutos = async () => {
    try {
      const res = await fetch('/api/produtos'); // Chama a rota relativa {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
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
  };

  const processQueue = async () => {
    if (queue.length === 0) return;

    const combinedMessage = queue.join('. ');
    setQueue([]);
    setIsTyping(true);

    try {
      const produtos = await fetchProdutos();
      const matchedProdutos = produtos.filter(produto =>
        combinedMessage.toLowerCase().includes(produto.name.toLowerCase())
      );

      let produtosResposta = '';
      if (matchedProdutos.length > 0) {
        produtosResposta = '🔍 Produtos encontrados:\n\n';
        matchedProdutos.forEach(prod => {
          produtosResposta += `
🛒 *${prod.name}*
📦 Categoria: ${prod.category}
💰 Preço disponível após login rápido no site
🖼️ <img src="${prod.image}" alt="${prod.name}" class="product-image"/>
🔗 <a href="https://www.marquesvendaspmg.shop/produtos" target="_blank">Ver mais detalhes no site</a>

👉 Faça seu cadastro em menos de 2 minutos: https://www.marquesvendaspmg.shop/produtos
`;
        });
      }

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: combinedMessage,
          produtos: produtosResposta
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao processar sua mensagem');
      }

      const data = await response.json();
      const botReply = data.reply || '❌ Desculpe, não consegui entender.';

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Erro no processamento:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: `⚠️ Ocorreu um erro: ${error.message || 'Por favor, tente novamente mais tarde.'}`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (queue.length === 0) return;

    const timer = setTimeout(() => {
      processQueue();
    }, 15000);

    return () => clearTimeout(timer);
  }, [queue]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = input.trim();

    setMessages(prev => [...prev, { sender: 'user', text: newMessage }]);
    setQueue(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const renderMessage = (text) => {
    return <div dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />;
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
            border: '2px solid #095400',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              backgroundColor: '#095400',
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
                src="https://i.imgur.com/J0BfsSj.gif" 
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

            <div style={{ display: 'flex', padding: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem..."
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                  outline: 'none'
                }}
              />
              <button onClick={handleSend} style={{
                marginLeft: '8px',
                backgroundColor: '#095400',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer'
              }}>
                Enviar
              </button>
            </div>
          </div>
        ) : (
          <button onClick={toggleChat} style={{
            backgroundColor: '#095400',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="https://i.imgur.com/J0BfsSj.gif" 
              alt="Markito" 
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%'
              }} 
            />
          </button>
        )}
      </div>

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
          color: #095400;
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
