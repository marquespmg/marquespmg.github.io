import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';

const Markito = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Olá! Eu sou o Markito, seu assistente da Marques Vendas PMG. Como posso ajudar?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // URL da sua API no Vercel (substitua pela sua URL real)
  const API_URL = 'https://marques-chat-api.vercel.app/api/chat';

  const sanitizeMessage = (text) => {
    return DOMPurify.sanitize(text.replace(/\n/g, '<br/>'));
  };

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      
    } catch (error) {
      console.error('Erro:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: '⚠️ Desculpe, estou com problemas técnicos. Por favor, tente novamente mais tarde.'
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (text) => {
    return <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(text) }} />;
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px', // Mudei para right para não conflitar com outros elementos
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
                backgroundColor: '#058789',
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
            backgroundColor: '#058789',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="https://i.imgur.com/WJkLMg6.png" 
              alt="Markito" 
              style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
            />
          </button>
        )}
      </div>

      <style jsx>{`
        .typing-indicator span {
          animation: typing 1s infinite;
          opacity: 0;
        }
        
        @keyframes typing {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default Markito;
