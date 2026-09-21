'use client';

import React, { useState, useEffect } from 'react';

// ========== CONFIGURAÇÕES ========== //
const APP_PACKAGE = 'com.marquesantonio.marquesvendaspmg';
const APP_LINK = `https://play.google.com/store/apps/details?id=${APP_PACKAGE}&showAllReviews=true`;

const DIAS_ENTRE_EXIBICOES = 7;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

const STORAGE_KEY_ULTIMA_EXIBICAO = 'avaliacaoAppUltimaExibicao';
const STORAGE_KEY_JA_AVALIOU = 'avaliacaoAppJaAvaliou';

const COR_VERDE_ESCURO = '#095400';
const COR_VERMELHO = '#e53935';
const COR_ESTRELA_VAZIA = '#d1d5db';

// ========== DETECTAR SE ESTÁ RODANDO NO APP ========== //
const isRunningInApp = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  const isWebView = ua.includes('wv') || ua.includes('androidwebview');
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true;
  return isWebView || isPWA;
};

// ========== MENSAGENS POR NOTA ========== //
const getMensagemPorNota = (nota) => {
  if (nota >= 5) return 'Uau! Que alegria! 💚 Sua avaliação nos motiva demais!';
  if (nota === 4) return 'Que bom! Ficamos felizes que está gostando! 😊';
  if (nota === 3) return 'Obrigado! Estamos sempre melhorando! 🙌';
  if (nota === 2) return 'Sentimos muito. Vamos melhorar! 💪';
  if (nota === 1) return 'Poxa, queremos melhorar. Conta pra gente o que houve!';
  return '';
};

const AvaliacaoAppOverlay = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);

  useEffect(() => {
    if (!isRunningInApp()) return;

    const jaAvaliou = localStorage.getItem(STORAGE_KEY_JA_AVALIOU);
    if (jaAvaliou === 'true') return;

    const ultimaExibicao = localStorage.getItem(STORAGE_KEY_ULTIMA_EXIBICAO);

    if (ultimaExibicao) {
      const tempoDecorrido = Date.now() - parseInt(ultimaExibicao, 10);
      if (tempoDecorrido < DIAS_ENTRE_EXIBICOES * MS_POR_DIA) {
        return;
      }
    }

    const timer = setTimeout(() => {
      setShowBanner(true);
      localStorage.setItem(STORAGE_KEY_ULTIMA_EXIBICAO, Date.now().toString());
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleAvaliar = () => {
    window.open(APP_LINK, '_blank');
    localStorage.setItem(STORAGE_KEY_JA_AVALIOU, 'true');
    setShowBanner(false);
  };

  const handleAgoraNao = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  // Define qual nota mostrar (hover > selecionada)
  const notaAtual = hoverNota || notaSelecionada;

  return (
    <>
      <div style={styles.overlay}>
        <div style={styles.banner}>
          {/* TÍTULO */}
          <h2 style={styles.title}>
            Oi! Está gostando do nosso app?
          </h2>

          {/* SUBTÍTULO */}
          <p style={styles.subtitle}>
            Toque nas estrelas para avaliar
          </p>

          {/* ESTRELAS INTERATIVAS */}
          <div style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((estrela) => {
              const ativa = estrela <= notaAtual;
              return (
                <button
                  key={estrela}
                  onClick={() => setNotaSelecionada(estrela)}
                  onMouseEnter={() => setHoverNota(estrela)}
                  onMouseLeave={() => setHoverNota(0)}
                  style={{
                    ...styles.starButton,
                    color: ativa ? COR_VERDE_ESCURO : COR_ESTRELA_VAZIA,
                    transform: ativa ? 'scale(1.1)' : 'scale(1)'
                  }}
                  aria-label={`Avaliar com ${estrela} estrela${estrela > 1 ? 's' : ''}`}
                >
                  {ativa ? '★' : '☆'}
                </button>
              );
            })}
          </div>

          {/* MENSAGEM DINÂMICA POR NOTA */}
          {notaSelecionada > 0 && (
            <p style={styles.mensagemNota}>
              {getMensagemPorNota(notaSelecionada)}
            </p>
          )}

          {/* MENSAGEM PADRÃO (antes de escolher nota) */}
          {notaSelecionada === 0 && (
            <p style={styles.message}>
              Leva menos de 10 segundos e ajuda muito! 💚
            </p>
          )}

          {/* BOTÃO AVALIAR - SÓ APARECE SE ESCOLHEU NOTA */}
          {notaSelecionada > 0 && (
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
              ⭐ Avaliar na Play Store
            </button>
          )}

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

        @keyframes pulseEstrela {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
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
  title: {
    color: '#333',
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '8px',
    lineHeight: '1.3'
  },
  subtitle: {
    color: '#999',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '18px'
  },
  starsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '18px',
    minHeight: '60px'
  },
  starButton: {
    background: 'none',
    border: 'none',
    fontSize: '42px',
    cursor: 'pointer',
    padding: '4px',
    transition: 'all 0.2s ease',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    color: '#666',
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '25px',
    minHeight: '45px'
  },
  mensagemNota: {
    color: '#333',
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '20px',
    minHeight: '45px',
    fontWeight: '500',
    animation: 'fadeInAvaliacao 0.3s ease'
  },
  botaoAvaliar: {
    backgroundColor: '#e53935',
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
