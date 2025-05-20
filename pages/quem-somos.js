import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function QuemSomos() {
  const [isMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  return (
    <>
      <Head>
        <title>Sobre Nós - Marques Vendas PMG</title>
        <meta name="description" content="Conheça a história e a missão da Marques Vendas PMG" />
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
            Nossa História
          </h1>
          <p style={{ color: '#666', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            Conheça quem está por trás da Marques Vendas PMG
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
              Quem Sou Eu
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Me chamo <strong>Marques Antonio</strong> e trabalho na <strong>PMG há mais de 4 anos</strong>. Sempre buscando melhorar cada dia mais nossas formas de atender você, nosso cliente, criamos este site <strong>Marques Vendas PMG - Distribuidora Food Service</strong> para oferecer um serviço de excelência.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              Nossa Missão
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Na Marques Vendas PMG, acreditamos que o sucesso do seu negócio é o nosso sucesso. Por isso, nos dedicamos a fornecer produtos de qualidade com atendimento personalizado, buscando sempre superar suas expectativas.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              Compromisso com Você
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Trabalhamos com transparência e ética, garantindo:
            </p>
            <ul style={{ 
              color: '#555',
              paddingLeft: '20px',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <li style={{ marginBottom: '8px' }}>Produtos de qualidade comprovada</li>
              <li style={{ marginBottom: '8px' }}>Preços competitivos no mercado</li>
              <li style={{ marginBottom: '8px' }}>Atendimento rápido e eficiente</li>
              <li style={{ marginBottom: '8px' }}>Soluções personalizadas para seu negócio</li>
            </ul>
          </section>

          <section>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              Fale Conosco
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Estamos aqui para servir você melhor. Entre em contato pelo WhatsApp: <strong>(11) 91357-2902</strong> ou email: <strong>marquesvendaspmg@gmail.com</strong> - Será um prazer atendê-lo!
            </p>
          </section>
        </div>

        {/* Rodapé */}
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
            href="/quem-somos"
            style={{ 
              color: '#095400', 
              textDecoration: 'none',
              margin: '0 10px'
            }}>
            Quem Somos
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
