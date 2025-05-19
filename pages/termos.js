import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function TermosUso() {
  const [isMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  return (
    <>
      <Head>
        <title>Termos de Uso - Marques Vendas PMG</title>
        <meta name="description" content="Termos e condições de uso do site Marques Vendas PMG" />
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
              src="https://i.imgur.com/pBH5WpZ.png" 
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
            Termos de Uso
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
              1. Aceitação dos Termos
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Ao acessar e utilizar o site <strong>Marques Vendas PMG</strong>, você concorda com estes Termos de Uso e com nossa Política de Privacidade. Caso não concorde, por favor, não utilize nossos serviços.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              2. Serviços Oferecidos
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Nosso site atua como distribuidor autorizado de produtos comerciais. Todas as informações sobre produtos, preços e promoções estão sujeitas a alteração sem aviso prévio.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              3. Responsabilidades
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              O usuário é responsável por fornecer informações corretas durante o cadastro e compra. Não nos responsabilizamos por erros decorrentes de informações incorretas fornecidas pelo cliente.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              4. Alterações nos Termos
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Reservamos o direito de modificar estes Termos a qualquer momento. Alterações entrarão em vigor imediatamente após sua publicação no site.
            </p>
          </section>

           <section>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              5. Contato
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Para dúvidas sobre estes Termos, entre em contato pelo WhatsApp: <strong>(11) 91357-2902</strong> ou email: <strong>marquesvendaspmg@gmail.com</strong>
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
            href="/politica-de-privacidade"
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
