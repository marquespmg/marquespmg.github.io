import React, { useState, useEffect } from 'react';

const EmailConfirmado = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animação de entrada suave
    setIsVisible(true);
  }, []);

  return (
    <div style={styles.container}>
      <div style={{...styles.contentBox, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)'}}>
        <div style={styles.successIcon}>
          <svg viewBox="0 0 100 100" style={styles.checkmark}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#28a745" strokeWidth="5"/>
            <path fill="none" stroke="#28a745" strokeWidth="8" d="M30,50 45,65 70,35"/>
          </svg>
        </div>
        
        <h2 style={styles.title}>E-mail Confirmado com Sucesso!</h2>
        
        <p style={styles.text}>
          Parabéns! Seu e-mail foi confirmado e sua conta está ativada.
        </p>
        
        <p style={styles.text}>
          Agora você tem acesso completo ao <span style={styles.highlight}>programa de indicações</span> da{' '}
          <span style={styles.highlight}>Marques Vendas PMG</span>.
        </p>

        <div style={styles.stepsContainer}>
          <h3 style={styles.stepsTitle}>Próximos Passos:</h3>
          <ol style={styles.stepsList}>
            <li style={styles.stepsItem}>Volte para o site de indicações</li>
            <li style={styles.stepsItem}>Faça login com seu e-mail e senha</li>
            <li style={styles.stepsItem}>Quanto mais indicar, mais você ganha</li>
          </ol>
        </div>

        <p style={styles.warning}>
          <span>⚠</span> Dica: Use a mesma senha que você cadastrou.
        </p>

        <p style={styles.footer}>
          © 2025 Marques Vendas PMG - Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.3s ease'
  },
  contentBox: {
    background: '#fff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    transition: 'all 0.5s ease'
  },
  successIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '25px'
  },
  checkmark: {
    width: '80px',
    height: '80px',
    animation: 'scaleIn 0.5s ease forwards'
  },
  title: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: '700'
  },
  text: {
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.6',
    fontSize: '16px'
  },
  stepsContainer: {
    textAlign: 'left',
    margin: '25px 0',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e9ecef'
  },
  stepsTitle: {
    color: '#333',
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: '600'
  },
  stepsList: {
    paddingLeft: '20px',
    color: '#666'
  },
  stepsItem: {
    marginBottom: '10px',
    lineHeight: '1.5'
  },
  warning: {
    color: '#dc3545',
    fontWeight: '500',
    marginTop: '15px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  footer: {
    marginTop: '30px',
    color: '#999',
    fontSize: '14px'
  },
  highlight: {
    color: '#095400',
    fontWeight: '600'
  }
};

// Adicionando keyframes para a animação
const styleSheet = document.styleSheet;
const css = `
  @keyframes scaleIn {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);

export default EmailConfirmado;