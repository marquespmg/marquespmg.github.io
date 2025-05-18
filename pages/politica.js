import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function PoliticaPrivacidade() {
  const [isMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  return (
    <>
      <Head>
        <title>Política de Privacidade - Marques Vendas PMG</title>
        <meta name="description" content="Política de privacidade do site Marques Vendas PMG" />
      </Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '15px' : '30px',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
      }}>
        {/* Cabeçalho */}
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <Link href="/">
            <img 
              src="https://i.imgur.com/8EagMV6.png" 
              alt="Marques Vendas PMG" 
              style={{ 
                width: isMobile ? '180px' : '220px',
                marginBottom: '20px',
                cursor: 'pointer'
              }} 
            />
          </Link>
          <h1 style={{ 
            color: '#095400', 
            fontSize: isMobile ? '1.8rem' : '2.2rem',
            marginBottom: '15px'
          }}>
            Política de Privacidade
          </h1>
          <p style={{ color: '#666', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </header>

        {/* Conteúdo */}
        <div style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          padding: isMobile ? '20px' : '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              1. Informações Coletadas
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Coletamos informações pessoais como nome, e-mail, telefone e endereço quando você se cadastra ou faz uma compra. Também coletamos dados de navegação através de cookies.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              2. Uso das Informações
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Utilizamos seus dados para: processar pedidos, melhorar nossos serviços, enviar comunicações importantes e oferecer conteúdo personalizado. Nunca vendemos seus dados a terceiros.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              3. Compartilhamento de Dados
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Seus dados podem ser compartilhados apenas com: empresas de entrega para envio de produtos, parceiros de pagamento para processamento financeiro, e quando exigido por lei.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              4. Segurança
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Implementamos medidas de segurança físicas, eletrônicas e administrativas para proteger suas informações contra acesso não autorizado ou uso indevido.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              5. Seus Direitos
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Você tem direito a: acessar seus dados, corrigir informações incorretas, solicitar a exclusão de seus dados e revogar consentimentos. Para exercer esses direitos, entre em contato conosco.
            </p>
          </section>

          <section>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              6. Contato
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Dúvidas sobre esta política? Entre em contato pelo WhatsApp: <strong>(11) 91357-2902</strong> ou email: <strong>marquesvendaspmg@gmail.com</strong>
            </p>
          </section>
        </div>

        {/* Rodapé Atualizado */}
        <footer style={{
          marginTop: '40px',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.85rem',
          padding: '20px 0',
          borderTop: '1px solid #eee'
        }}>
          <Link 
            href="/termos" 
            style={{ 
              color: '#095400', 
              textDecoration: 'none',
              margin: '0 10px'
            }}>
            Termos de Uso
          </Link>
          <span>|</span>
          <Link 
            href="/politica"
            style={{ 
              color: '#095400', 
              textDecoration: 'none',
              margin: '0 10px'
            }}>
            Política de Privacidade
          </Link>
          <span>|</span>
          <Link 
            href="/"
            style={{ 
              color: '#095400', 
              textDecoration: 'none',
              margin: '0 10px'
            }}>
            Voltar ao Início
          </Link>
          <p style={{ marginTop: '15px' }}>
            © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </>
  );
}
