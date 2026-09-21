'use client';

import React, { useState, useEffect } from 'react';

// ========== CONFIGURAÇÕES ========== //
const APP_PACKAGE = 'com.marquesantonio.marquesvendaspmg';
const APP_LINK = `https://play.google.com/store/apps/details?id=${APP_PACKAGE}&showAllReviews=true`;

// Frequência: 7 dias (em milissegundos)
const DIAS_ENTRE_EXIBICOES = 7;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

// Chaves do localStorage
const STORAGE_KEY_ULTIMA_EXIBICAO = 'avaliacaoAppUltimaExibicao';
const STORAGE_KEY_JA_AVALIOU = 'avaliacaoAppJaAvaliou';

// ========== DETECTAR SE ESTÁ RODANDO NO APP ========== //
const isRunningInApp = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  const isWebView = ua.includes('wv') || ua.includes('androidwebview');
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true;
  return isWebView || isPWA;
};

const AvaliacaoAppOverlay = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // ✅ Só mostra no app
    if (!isRunningInApp()) return;

    // ✅ Se já avaliou, nunca mais mostra
    const jaAvaliou = localStorage.getItem(STORAGE_KEY_JA_AVALIOU);
    if (jaAvaliou === 'true') return;

    // ✅ Verifica se já passou o tempo desde a última exibição
    const ultimaExibicao = localStorage.getItem(STORAGE_KEY_ULTIMA_EXIBICAO);

    if (ultimaExibicao) {
      const tempoDecorrido = Date.now() - parseInt(ultimaExibicao, 10);
      if (tempoDecorrido < DIAS_ENTRE_EXIBICOES * MS_POR_DIA) {
        return;
      }
    }

    // ✅ Mostra após 5 segundos (dá tempo do cliente começar a usar)
    const timer = setTimeout(() => {
      setShowBanner(true);
      // Salva o momento da exibição
      localStorage.setItem(STORAGE_KEY_ULTIMA_EXIBICAO, Date.now().toString());
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // ========== AÇÕES ========== //
  const handleAvaliar = () => {
    // Abre a Play Store na tela de avaliação
    window.open(APP_LINK, '_blank');
    // Marca como "já avaliou" (não mostra mais)
    localStorage.setItem(STORAGE_KEY_JA_AVALIOU, 'true');
    setShowBanner(false);
  };

  const handleAgoraNao = () => {
    // Só fecha o banner. Vai aparecer de novo em 7 dias.
    setShowBanner(false);
  };

  // Se não deve mostrar, retorna null
  if (!showBanner) return null;

  return (
    <>
      <div style={styles.overlay}>
        <div style={styles.banner}>
          {/* ESTRELAS */}
          <div style={styles.stars}>⭐⭐⭐⭐⭐</div>

          {/* TÍTULO */}
          <h2 style={styles.title}>
            Oi! Está gostando do nosso app?
          </h2>

          {/* MENSAGEM */}
          <p style={styles.message}>
            Leva menos de 10 segundos pra avaliar e isso nos ajuda muito! 💚
          </p>

          {/* BOTÃO AVALIAR */}
          <button
            onClick={handleAvaliar}
            style={styles.botaoAvaliar}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(229, 57, 53, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(229, 57, 53, 0.3)';
            }}
          >
            ⭐ Avaliar agora
          </button>

          {/* BOTÃO AGORA NÃO */}
          <button
            onClick={handleAgoraNao}
            style={styles.botaoAgoraNao}
            onMouseOver={(e) => {
              e.target.style.color = '#333';
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#999';
            }}
          >
            Agora não
          </button>
        </div>
      </div>

      {/* ESTILOS DE ANIMAÇÃO */}
      <style jsx global>{`
        @keyframes fadeInAvaliacao {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUpAvaliacao {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

// ========== ESTILOS ========== //
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10001,
    padding: '20px',
    animation: 'fadeInAvaliacao 0.4s ease'
  },
  banner: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '30px 25px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
    animation: 'slideUpAvaliacao 0.5s ease',
    position: 'relative'
  },
  stars: {
    fontSize: '32px',
    color: '#095400',           // ✅ Verde escuro
    marginBottom: '15px',
    letterSpacing: '4px',
    lineHeight: '1'
  },
  title: {
    color: '#333',
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '12px',
    lineHeight: '1.3'
  },
  message: {
    color: '#666',
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '25px'
  },
  botaoAvaliar: {
    backgroundColor: '#e53935',     // ✅ Vermelho
    color: 'white',
    border: 'none',
    padding: '14px 30px',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '12px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(229, 57, 53, 0.3)'
  },
  botaoAgoraNao: {
    backgroundColor: 'transparent',
    color: '#999',
    border: 'none',
    padding: '10px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s ease'
  }
};

export default AvaliacaoAppOverlay;