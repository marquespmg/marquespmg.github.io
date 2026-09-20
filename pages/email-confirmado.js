import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EmailConfirmado = () => {
  const router = useRouter();
  const { status } = router.query;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // ✅ Só mostra sucesso se status não for 'error'
  const isSuccess = status !== 'error';

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.contentBox,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
        }}
      >
        {/* ÍCONE */}
        <div style={styles.successIcon}>
          {isSuccess ? (
            <svg viewBox="0 0 100 100" style={styles.checkmark}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#28a745" strokeWidth="5"/>
              <path fill="none" stroke="#28a745" strokeWidth="8" d="M30,50 45,65 70,35"/>
            </svg>
          ) : (
            <svg viewBox="0 0 100 100" style={styles.checkmark}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#dc3545" strokeWidth="5"/>
              <path fill="none" stroke="#dc3545" strokeWidth="8" d="M35,35 65,65 M65,35 35,65"/>
            </svg>
          )}
        </div>

        {/* TÍTULO */}
        <h2 style={{
          ...styles.title,
          color: isSuccess ? '#28a745' : '#dc3545'
        }}>
          {isSuccess ? 'E-mail confirmado com sucesso!' : 'Erro na confirmação'}
        </h2>

        {/* MENSAGEM */}
        {isSuccess ? (
          <>
            <p style={styles.text}>
              Seu e-mail foi confirmado e sua conta está ativa.
            </p>
            <p style={styles.text}>
              Agora você já pode fazer login e acessar todos os produtos da{' '}
              <span style={styles.highlight}>Marques Vendas PMG</span>.
            </p>

            {/* BOTÃO DE SUCESSO */}
            <a href="/produtos" style={styles.button}>
              Acessar a Loja
            </a>
          </>
        ) : (
          <>
            <p style={styles.text}>
              Ocorreu um erro ao confirmar seu e-mail.
            </p>
            <p style={styles.text}>
              Verifique se o link está completo ou solicite um novo.
            </p>

            {/* BOTÃO DE ERRO */}
            <a href="/produtos" style={styles.buttonError}>
              Voltar para a Loja
            </a>
          </>
        )}

        {/* RODAPÉ */}
        <p style={styles.footer}>
          © 2026 Marques Vendas PMG - Todos os direitos reservados.
        </p>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
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
    fontFamily: "'Inter', sans-serif"
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
    marginBottom: '20px',
    fontSize: '26px',
    fontWeight: '700'
  },
  text: {
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.6',
    fontSize: '16px'
  },
  button: {
    display: 'inline-block',
    padding: '14px 32px',
    backgroundColor: '#095400',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    marginTop: '20px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(9, 84, 0, 0.2)'
  },
  buttonError: {
    display: 'inline-block',
    padding: '14px 32px',
    backgroundColor: '#dc3545',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    marginTop: '20px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.2)'
  },
  footer: {
    marginTop: '35px',
    color: '#999',
    fontSize: '13px'
  },
  highlight: {
    color: '#095400',
    fontWeight: '600'
  }
};

export default EmailConfirmado;
