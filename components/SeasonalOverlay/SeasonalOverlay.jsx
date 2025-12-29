'use client';

import React, { useState, useEffect } from 'react';
import dezembroTheme from './themes/janeiro';

const SeasonalOverlay = () => {
  const theme = dezembroTheme;
  const [showModal, setShowModal] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiPosition, setEmojiPosition] = useState({});
  const [currentEmoji, setCurrentEmoji] = useState({});
  const [currentMessage, setCurrentMessage] = useState('');
  
  if (!theme.ativo) return null;

  // Controla modal
  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('natalModalLastShown');
    
    if (lastShown !== today) {
      setShowModal(true);
      localStorage.setItem('natalModalLastShown', today);
    }
  }, []);

  // Controla emoji aleatório
  useEffect(() => {
    const showRandomEmoji = () => {
      // Escolhe um emoji aleatório
      const randomEmoji = theme.emojis[
        Math.floor(Math.random() * theme.emojis.length)
      ];
      setCurrentEmoji(randomEmoji);
      
      // Escolhe uma mensagem aleatória
      const randomMessage = theme.mensagens[
        Math.floor(Math.random() * theme.mensagens.length)
      ];
      setCurrentMessage(randomMessage);
      
      // Posições possíveis (sempre nos cantos/bordas)
      const positions = [
        // Cantos superiores
        { top: '30px', left: '30px' },
        { top: '30px', right: '30px' },
        
        // Cantos inferiores (acima do chat e outros elementos)
        { bottom: '80px', left: '30px' },
        { bottom: '130px', right: '30px' },
        
        // Laterais (meio da tela)
        { top: '40%', left: '25px' },
        { top: '40%', right: '25px' },
        
        // Topo (próximo ao centro mas não no meio exato)
        { top: '30px', left: '45%' },
        { top: '30px', right: '45%' }
      ];
      
      // Escolhe posição aleatória
      const randomPosition = positions[
        Math.floor(Math.random() * positions.length)
      ];
      setEmojiPosition(randomPosition);
      
      // Mostra o emoji
      setShowEmoji(true);
      
      // Esconde após 5 segundos
      setTimeout(() => {
        setShowEmoji(false);
      }, theme.config.duracao);
    };
    
    // Mostra primeiro emoji após 2 segundos
    const initialTimer = setTimeout(() => {
      showRandomEmoji();
    }, 2000);
    
    // Configura intervalo (a cada 15 segundos)
    const interval = setInterval(() => {
      showRandomEmoji();
    }, theme.config.intervalo);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [theme]);

  return (
    <>
      {/* MODAL DE BOAS-VINDAS */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.5s ease'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            animation: 'slideUp 0.6s ease'
          }}>
            <h2 style={{
              color: theme.cores.dourado,
              fontSize: '28px',
              marginBottom: '10px',
              fontWeight: '600'
            }}>
              {theme.modal.titulo}
            </h2>
            
            <p style={{
              fontSize: '18px',
              color: '#333',
              marginBottom: '15px',
              lineHeight: '1.4'
            }}>
              {theme.modal.mensagem}
            </p>
            
            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '25px',
              fontStyle: 'italic'
            }}>
              {theme.modal.subtitulo}
            </p>
            
            <button
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: theme.cores.dourado,
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(198, 40, 40, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {theme.modal.botao}
            </button>
            
            {/* Emoji decorativo no modal */}
            <div style={{
              position: 'absolute',
              top: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '50px',
              animation: 'bounce 3s infinite'
            }}>
              {theme.emojis[0].emoji}
            </div>
          </div>
        </div>
      )}
      
      {/* EMOJI FLUTUANTE ALEATÓRIO */}
      {showEmoji && currentEmoji.emoji && (
        <div
          style={{
            position: 'fixed',
            ...emojiPosition,
            zIndex: 9998,
            pointerEvents: 'none',
            animation: 'emojiFloat 5s ease-out'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* Emoji natalino */}
            <div style={{
              fontSize: theme.config.tamanho,
              animation: 'emojiBounce 2s ease-in-out infinite',
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))',
              cursor: 'default'
            }}>
              {currentEmoji.emoji}
            </div>
            
            {/* Balão de mensagem (só se tiver mensagem) */}
            {currentMessage && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: theme.cores.dourado,
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                animation: 'messageFloat 5s ease-out',
                maxWidth: '160px',
                textAlign: 'center',
                border: `1px solid ${theme.cores.dourado}20`
              }}>
                {currentMessage}
                
                {/* Ponta do balão */}
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `6px solid rgba(255, 255, 255, 0.95)`
                }} />
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Estilos de animação */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes emojiFloat {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
          }
        }
        
        @keyframes emojiBounce {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-5px) rotate(-5deg);
          }
          50% {
            transform: translateY(-10px);
          }
          75% {
            transform: translateY(-5px) rotate(5deg);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-10px);
          }
        }
        
        @keyframes messageFloat {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
          }
          20% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px) scale(0.9);
          }
        }
        
        /* Responsividade */
        @media (max-width: 768px) {
          .emoji-floating {
            font-size: 28px !important;
          }
          
          .emoji-message {
            font-size: 11px !important;
            max-width: 130px !important;
            padding: 6px 10px !important;
          }
          
          .modal-content {
            padding: 20px !important;
          }
          
          .modal-title {
            font-size: 24px !important;
          }
        }
        
        @media (max-width: 480px) {
          .emoji-container {
            /* Ajusta posições para mobile */
          }
          
          .emoji-floating {
            font-size: 24px !important;
          }
          
          .emoji-message {
            font-size: 10px !important;
            max-width: 110px !important;
            white-space: normal !important;
          }
          
          /* Em telas muito pequenas, reduz frequência */
          .emoji-timer {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default SeasonalOverlay;
