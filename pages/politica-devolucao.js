import React from 'react';
import { useState } from 'react';

// Hook para detectar tamanho da tela
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const PoliticaDevolucao = () => {
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth <= 768;

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '15px' : '25px',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      lineHeight: '1.6'
    },
    header: {
      textAlign: 'center',
      marginBottom: isMobile ? '25px' : '40px',
      padding: isMobile ? '20px 15px' : '30px 20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0'
    },
    title: {
      color: '#095400',
      fontSize: isMobile ? '26px' : '36px',
      fontWeight: '700',
      marginBottom: '10px',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    subtitle: {
      color: '#666',
      fontSize: isMobile ? '16px' : '18px',
      marginBottom: '15px'
    },
    content: {
      backgroundColor: '#fff',
      padding: isMobile ? '20px' : '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0',
      marginBottom: '30px'
    },
    section: {
      marginBottom: isMobile ? '25px' : '35px'
    },
    sectionTitle: {
      color: '#095400',
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '600',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '2px solid #f0f0f0'
    },
    warningBox: {
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: isMobile ? '15px' : '20px',
      margin: '20px 0',
      borderLeft: '4px solid #f39c12'
    },
    alertBox: {
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '8px',
      padding: isMobile ? '15px' : '20px',
      margin: '20px 0',
      borderLeft: '4px solid #e74c3c'
    },
    successBox: {
      backgroundColor: '#d1ecf1',
      border: '1px solid #bee5eb',
      borderRadius: '8px',
      padding: isMobile ? '15px' : '20px',
      margin: '20px 0',
      borderLeft: '4px solid #17a2b8'
    },
    paragraph: {
      marginBottom: '15px',
      fontSize: isMobile ? '15px' : '16px',
      color: '#333',
      lineHeight: '1.7'
    },
    list: {
      margin: '15px 0',
      paddingLeft: '20px'
    },
    listItem: {
      marginBottom: '10px',
      fontSize: isMobile ? '15px' : '16px',
      color: '#333'
    },
    highlight: {
      backgroundColor: '#095400',
      color: 'white',
      padding: '2px 6px',
      borderRadius: '4px',
      fontWeight: '600'
    },
    contactInfo: {
      backgroundColor: '#095400',
      color: 'white',
      padding: isMobile ? '20px' : '30px',
      borderRadius: '12px',
      textAlign: 'center',
      margin: '30px 0'
    },
    whatsappButton: {
      display: 'inline-block',
      backgroundColor: '#25D366',
      color: 'white',
      padding: isMobile ? '12px 20px' : '15px 30px',
      borderRadius: '25px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: isMobile ? '16px' : '18px',
      marginTop: '15px',
      transition: 'all 0.3s ease'
    },
    homeButton: {
      display: 'inline-block',
      backgroundColor: '#095400',
      color: 'white',
      padding: isMobile ? '12px 20px' : '15px 30px',
      borderRadius: '25px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: isMobile ? '16px' : '18px',
      marginTop: '20px',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer'
    },
    footer: {
      marginTop: isMobile ? '40px' : '60px',
      padding: isMobile ? '25px 15px' : '40px 20px',
      textAlign: 'center',
      color: '#666',
      fontSize: isMobile ? '0.8rem' : '0.85rem',
      borderTop: '2px solid #f0f0f0',
      backgroundColor: '#f9f9f9'
    }
  };

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <div style={styles.header}>
        <img 
          src="https://i.imgur.com/pBH5WpZ.png" 
          alt="Marques Vendas PMG"
          style={{ 
            height: isMobile ? '50px' : '70px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        />
        <h1 style={styles.title}>📋 Política de Devolução</h1>
        <p style={styles.subtitle}>
          Entenda nossos procedimentos para trocas e devoluções
        </p>
      </div>

      {/* Conteúdo Principal */}
      <div style={styles.content}>
        {/* Seção de Aviso Importante */}
        <div style={styles.alertBox}>
          <h3 style={{color: '#721c24', margin: '0 0 10px 0', fontSize: isMobile ? '18px' : '20px'}}>
            ⚠️ ATENÇÃO IMPORTANTE
          </h3>
          <p style={{margin: 0, color: '#721c24', fontWeight: '600'}}>
            A PMG <span style={styles.highlight}>NÃO FAZ TROCA</span> do produto depois da nota fiscal assinada.
          </p>
        </div>

        {/* Política de Devolução */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🔄 Nossa Política</h2>
          <p style={styles.paragraph}>
            Na <strong>PMG Atacadista</strong>, priorizamos a satisfação total de nossos clientes. 
            Nossa política de devolução foi elaborada para garantir transparência e segurança 
            em todas as transações.
          </p>

          <div style={styles.warningBox}>
            <h4 style={{color: '#856404', margin: '0 0 10px 0'}}>✅ DEVOLUÇÃO ACEITA</h4>
            <p style={{margin: 0, color: '#856404'}}>
              A PMG aceita devolução <strong>APENAS NO ATO DA ENTREGA</strong>, antes da assinatura da nota fiscal, 
              se o cliente notar algo que não está conforme seu pedido.
            </p>
          </div>

          <div style={styles.alertBox}>
            <h4 style={{color: '#721c24', margin: '0 0 10px 0'}}>❌ DEVOLUÇÃO NÃO ACEITA</h4>
            <p style={{margin: 0, color: '#721c24'}}>
              <strong>Não aceitamos devoluções</strong> após a assinatura da nota fiscal e conferência do pedido.
            </p>
          </div>
        </div>

        {/* Procedimentos no Ato da Entrega */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📦 Procedimentos no Ato da Entrega</h2>
          
          <div style={styles.successBox}>
            <h4 style={{color: '#0c5460', margin: '0 0 10px 0'}}>🎯 O QUE FAZER DURANTE A ENTREGA</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Conferir o pedido</strong> antes de assinar qualquer documento
              </li>
              <li style={styles.listItem}>
                <strong>Verificar</strong> se todos os produtos correspondem ao pedido
              </li>
              <li style={styles.listItem}>
                <strong>Checar</strong> a integridade das embalagens
              </li>
              <li style={styles.listItem}>
                <strong>Confirmar</strong> quantidades e especificações
              </li>
            </ul>
          </div>

          <p style={styles.paragraph}>
            Se houver <span style={styles.highlight}>QUALQUER DIVERGÊNCIA</span> entre o pedido e o que foi entregue, 
            ou se encontrar produtos em condições inadequadas:
          </p>

          <div style={styles.alertBox}>
            <h4 style={{color: '#721c24', margin: '0 0 10px 0'}}>🚨 PROCEDIMENTO URGENTE</h4>
            <p style={{margin: 0, color: '#721c24', fontWeight: '600'}}>
              <strong>NÃO ASSINE A NOTA FISCAL</strong> e entre em contato imediatamente:
            </p>
          </div>
        </div>

        {/* Contato de Emergência */}
        <div style={styles.contactInfo}>
          <h3 style={{margin: '0 0 15px 0', fontSize: isMobile ? '20px' : '24px'}}>
            📞 Contato Imediato
          </h3>
          <p style={{margin: '0 0 10px 0', fontSize: isMobile ? '16px' : '18px'}}>
            Se tiver algo fora do especificado na Nota Fiscal:
          </p>
          <p style={{margin: '0 0 20px 0', fontSize: isMobile ? '18px' : '20px', fontWeight: '700'}}>
            📱 (11) 91357-2902
          </p>
          <p style={{margin: '0 0 15px 0', fontSize: isMobile ? '14px' : '16px'}}>
            Entre em contato <strong>ANTES</strong> de assinar a nota fiscal para tomarmos todas as ações necessárias.
          </p>
          <a 
            href="https://wa.me/5511913572902" 
            style={styles.whatsappButton}
            target="_blank" 
            rel="noopener noreferrer"
          >
            💬 Chamar no WhatsApp
          </a>
        </div>

        {/* Situações Pós-entrega */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>⏰ Situações Pós-entrega</h2>
          
          <div style={styles.alertBox}>
            <h4 style={{color: '#721c24', margin: '0 0 10px 0'}}>🚫 IMPORTANTE: PÓS-ASSINATURA</h4>
            <p style={{margin: 0, color: '#721c24'}}>
              Caso ocorra <strong>qualquer reclamação posterior</strong> depois de ter sido assinado a nota fiscal 
              e conferido o pedido, <strong>infelizmente não há o que fazer</strong>.
            </p>
          </div>

          <p style={styles.paragraph}>
            <strong>Por que essa política é necessária?</strong>
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Garantir a qualidade do produto no momento exato da entrega
            </li>
            <li style={styles.listItem}>
              Evitar fraudes e más utilizações
            </li>
            <li style={styles.listItem}>
              Manter preços competitivos para todos os clientes
            </li>
            <li style={styles.listItem}>
              Assegurar procedimentos claros e transparentes
            </li>
          </ul>
        </div>

        {/* Resumo Final */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📝 Resumo da Política</h2>
          
          <div style={styles.successBox}>
            <h4 style={{color: '#0c5460', margin: '0 0 10px 0'}}>✅ FAZER</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>Conferir pedido na hora da entrega</li>
              <li style={styles.listItem}>Recusar assinatura se houver problema</li>
              <li style={styles.listItem}>Ligar (11) 91357-2902 se necessário</li>
              <li style={styles.listItem}>Resolver tudo no ato da entrega</li>
            </ul>
          </div>

          <div style={styles.alertBox}>
            <h4 style={{color: '#721c24', margin: '0 0 10px 0'}}>❌ NÃO FAZER</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>Assinar nota sem conferir</li>
              <li style={styles.listItem}>Aceitar produtos com divergências</li>
              <li style={styles.listItem}>Tentar resolver depois da assinatura</li>
              <li style={styles.listItem}>Deixar para reclamar posteriormente</li>
            </ul>
          </div>
        </div>

        {/* Conclusão */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🎯 Conclusão</h2>
          <p style={styles.paragraph}>
            Na <strong>PMG Atacadista</strong>, acreditamos na transparência e na qualidade de nossos produtos. 
            Nossa política clara e objetiva visa proteger tanto o cliente quanto nossa empresa, 
            garantindo que todas as transações sejam justas e bem documentadas.
          </p>
          <p style={styles.paragraph}>
            <strong>Lembre-se:</strong> Qualquer problema com o pedido deve ser resolvido 
            <span style={styles.highlight}> NO ATO DA ENTREGA</span>. 
            Esta é a única forma de garantirmos uma solução rápida e eficaz.
          </p>
        </div>

        {/* Botão Voltar */}
        <div style={{textAlign: 'center', marginTop: '30px'}}>
          <button 
            onClick={() => window.history.back()}
            style={styles.homeButton}
          >
            ← Voltar para Página Anterior
          </button>
        </div>
      </div>

      {/* SEO Content - Visível apenas para Google */}
      <div style={{
        opacity: '0', 
        height: '0', 
        overflow: 'hidden', 
        position: 'absolute', 
        pointerEvents: 'none'
      }}>
        <h1>Política de Devolução PMG Atacadista - Trocas e Devoluções</h1>
        <p>PMG Atacadista política de devolução clara e transparente. PMG aceita devolução apenas no ato da entrega antes da assinatura da nota fiscal. PMG não faz troca após assinatura da nota. Contato emergencial (11) 91357-2902.</p>
        
        <h2>PMG Devolução Procedimentos</h2>
        <p>PMG Atacadista devolução no momento da entrega. PMG conferência do pedido antes da assinatura. PMG problemas com pedido resolver na hora.</p>
        
        <h3>PMG Atacadista Garantia</h3>
        <p>PMG Atacadista qualidade dos produtos. PMG procedimentos transparentes. PMG atendimento emergencial WhatsApp.</p>
      </div>

      {/* Rodapé */}
      <footer style={styles.footer}>
        <p style={{margin: '5px 0', fontSize: isMobile ? '0.8rem' : '0.85rem'}}>
          © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
        </p>
        <p style={{margin: '5px 0', fontSize: isMobile ? '0.7rem' : '0.75rem', color: '#999'}}>
          Estrada Ferreira Guedes, 784 - Potuverá - CEP: 06885-150 - Itapecerica da Serra - SP
        </p>
      </footer>
    </div>
  );
};

export default PoliticaDevolucao;