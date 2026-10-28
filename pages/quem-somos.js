import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTrackUser from '../hook/useTrackUser';

export default function QuemSomos() {
  const [isMobile, setIsMobile] = useState(false);
  
  useTrackUser();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const foto1 = "https://www.marquesvendaspmg.shop/images/marques-quem-somos-1.jpeg";
  const foto2 = "https://www.marquesvendaspmg.shop/images/marques-quem-somos-2.jpeg";

  return (
    <>
      <Head>
        <title>Quem Somos - Marques Antonio | Marques Vendas PMG</title>
        <meta 
          name="description" 
          content="Conheça Marques Antonio, vendedor da PMG Atacadista há mais de 5 anos e criador da Marques Vendas PMG. Compre no atacado food service com atendimento direto para SP, Sul de Minas e Sul do RJ." 
        />
        <meta property="og:title" content="Quem Somos - Marques Antonio | Marques Vendas PMG" />
        <meta 
          property="og:description" 
          content="Conheça Marques Antonio, vendedor da PMG Atacadista e criador da Marques Vendas PMG. Compre no atacado food service com atendimento direto." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.marquesvendaspmg.shop/quem-somos" />
        <meta property="og:image" content={foto1} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Marques Vendas PMG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Quem Somos - Marques Antonio | Marques Vendas PMG" />
        <meta name="twitter:description" content="Conheça Marques Antonio, vendedor da PMG Atacadista e criador da Marques Vendas PMG." />
        <meta name="twitter:image" content={foto1} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.marquesvendaspmg.shop/quem-somos" />
        
        {/* Schema: Person (Marques Antonio) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Marques Antonio",
              "jobTitle": "Vendedor na PMG Atacadista e Criador da Marques Vendas PMG",
              "worksFor": [
                {
                  "@type": "Organization",
                  "name": "PMG Atacadista"
                }
              ],
              "description": "Vendedor na PMG Atacadista há mais de 5 anos e criador da Marques Vendas PMG, canal de compras no atacado food service.",
              "knowsAbout": ["Atacado Food Service", "Distribuição", "Vendas", "Atendimento ao Cliente"],
              "image": foto1,
              "sameAs": "https://www.marquesvendaspmg.shop/quem-somos"
            })
          }}
        />

        {/* Schema: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Marques Vendas PMG",
              "url": "https://www.marquesvendaspmg.shop",
              "description": "Canal de compras no atacado food service criado por Marques Antonio, vendedor da PMG Atacadista.",
              "founder": {
                "@type": "Person",
                "name": "Marques Antonio"
              }
            })
          }}
        />

        {/* Schema: BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.marquesvendaspmg.shop/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Quem Somos",
                  "item": "https://www.marquesvendaspmg.shop/quem-somos"
                }
              ]
            })
          }}
        />
      </Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '15px' : '30px',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
      }}>
        {/* Cabeçalho */}
        <header style={{ 
          marginBottom: isMobile ? '30px' : '40px', 
          textAlign: 'center'
        }}>
          <Link href="/" style={{ display: 'inline-block' }}>
            <img 
              src="https://i.imgur.com/pBH5WpZ.png" 
              alt="Logo Marques Vendas PMG - Canal de compras no atacado food service" 
              style={{ 
                width: isMobile ? '180px' : '220px',
                marginBottom: '20px',
                cursor: 'pointer'
              }} 
            />
          </Link>
          <h1 style={{ 
            color: '#095400', 
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            marginBottom: '15px',
            fontWeight: '700'
          }}>
            Quem Somos — Marques Vendas PMG
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: isMobile ? '1rem' : '1.1rem',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Conheça Marques Antonio, vendedor da PMG Atacadista e criador da Marques Vendas PMG, seu canal de compras no atacado food service.
          </p>
        </header>

        {/* Container Principal */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '30px' : '40px',
          marginBottom: '50px'
        }}>
          
          {/* Coluna Esquerda */}
          <div style={{
            flex: isMobile ? 'none' : 2,
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: isMobile ? '20px' : '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            width: '100%'
          }}>
            {/* Seção: Quem é Marques Antonio */}
            <div style={{
              display: isMobile ? 'block' : 'flex',
              gap: '25px',
              marginBottom: '30px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                order: isMobile ? 1 : 2,
                width: isMobile ? '100%' : '200px',
                flexShrink: 0,
                marginBottom: isMobile ? '20px' : '0'
              }}>
                <img 
                  src={foto1} 
                  alt="Marques Antonio - Vendedor da PMG Atacadista e criador da Marques Vendas PMG" 
                  style={{
                    width: '100%',
                    height: isMobile ? 'auto' : '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />
              </div>

              <div style={{
                order: isMobile ? 2 : 1,
                flex: 1
              }}>
                <h2 style={{ 
                  color: '#095400', 
                  fontSize: isMobile ? '1.3rem' : '1.5rem',
                  marginBottom: '15px',
                  fontWeight: '600'
                }}>
                  Quem é Marques Antonio
                </h2>
                <p style={{ 
                  color: '#555', 
                  lineHeight: '1.7',
                  marginBottom: '15px',
                  fontSize: isMobile ? '0.95rem' : '1rem'
                }}>
                  Meu nome é <strong>Marques Antonio</strong>. Sou vendedor na <strong>PMG Atacadista</strong> há mais de 5 anos e foi dentro dessa empresa que aprendi, na prática, tudo o que sei sobre atacado food service, atendimento e logística para o setor alimentício.
                </p>
                <p style={{ 
                  color: '#555', 
                  lineHeight: '1.7',
                  marginBottom: '15px',
                  fontSize: isMobile ? '0.95rem' : '1rem'
                }}>
                  Foi essa experiência que me motivou a criar a <strong>Marques Vendas PMG</strong>. O objetivo é simples: te atender diretamente, com a mesma qualidade e o mesmo preço competitivo da PMG Atacadista, mas com o cuidado de quem conhece cada produto e cada cliente.
                </p>
              </div>
            </div>

            {/* Seção: O que é a Marques Vendas PMG */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '25px',
              marginBottom: '30px',
              alignItems: isMobile ? 'flex-start' : 'center'
            }}>
              <div style={{
                width: isMobile ? '100%' : '180px',
                flexShrink: 0,
                marginBottom: isMobile ? '20px' : '0'
              }}>
                <img 
                  src={foto2} 
                  alt="Marques Antonio trabalhando - Marques Vendas PMG" 
                  style={{
                    width: '100%',
                    height: isMobile ? 'auto' : '180px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ 
                  color: '#095400', 
                  fontSize: isMobile ? '1.3rem' : '1.5rem',
                  marginBottom: '15px',
                  fontWeight: '600'
                }}>
                  O que é a Marques Vendas PMG
                </h2>
                <p style={{ 
                  color: '#555', 
                  lineHeight: '1.7',
                  marginBottom: '15px',
                  fontSize: isMobile ? '0.95rem' : '1rem'
                }}>
                  A <strong>Marques Vendas PMG</strong> é o meu canal de vendas. Aqui você navega pelo site, escolhe os produtos, monta seu carrinho e finaliza o pedido pelo WhatsApp. É simples, rápido e direto comigo.
                </p>
                <p style={{ 
                  color: '#555', 
                  lineHeight: '1.7',
                  fontSize: isMobile ? '0.95rem' : '1rem'
                }}>
                  Todo o pedido é atendido com a estrutura da PMG Atacadista por trás — mais de 30 anos de tradição, 11.000 m² de planta em Itapecerica da Serra, mais de 280 veículos refrigerados e mais de 2.200 itens de produtos para food service.
                </p>
              </div>
            </div>

            {/* Seção: Como Finalizar o Pedido */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                color: '#095400', 
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                Como Finalizar o Pedido
              </h2>
              <p style={{ 
                color: '#555', 
                lineHeight: '1.7',
                marginBottom: '15px',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}>
                É só navegar pelo site, escolher os produtos e clicar em "Adicionar ao Carrinho". Quando terminar, clica em "Finalizar Pedido" — o site gera uma mensagem automática com o resumo do seu pedido e abre no WhatsApp. É só enviar que eu dou continuidade ao atendimento e combino a entrega com você. O pagamento é feito na entrega, podendo ser em crédito, débito ou dinheiro.
              </p>
            </section>

            {/* Seção: Sobre a PMG Atacadista */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                color: '#095400', 
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                Sobre a PMG Atacadista
              </h2>
              <p style={{ 
                color: '#555', 
                lineHeight: '1.7',
                marginBottom: '15px',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}>
                A PMG Atacadista é uma empresa de alimentos e bebidas que atua no mercado desde 1995. Começou em Santo Amaro, na Zona Sul de São Paulo, distribuindo produtos perecíveis para pizzarias. Cresceu, mudou de planta algumas vezes e hoje opera em Itapecerica da Serra, com 11.000 m² de estrutura, mais de 280 veículos refrigerados, 400 representantes e 350 colaboradores.
              </p>
              <p style={{ 
                color: '#555', 
                lineHeight: '1.7',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}>
                Atende mais de 22.000 estabelecimentos na Grande São Paulo, litoral, interior e Sul de Minas Gerais, oferecendo mais de 2.200 itens de produtos para food service. É essa estrutura que está por trás de cada pedido feito aqui na Marques Vendas PMG.
              </p>
            </section>

            {/* Seção: Meu Compromisso */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                color: '#095400', 
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                Meu Compromisso com Você
              </h2>
              <p style={{ 
                color: '#555', 
                lineHeight: '1.7',
                marginBottom: '15px',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}>
                Meu compromisso é te atender com transparência e agilidade, garantindo:
              </p>
              <ul style={{ 
                color: '#555',
                paddingLeft: '20px',
                marginBottom: '15px',
                fontSize: isMobile ? '0.95rem' : '1rem',
                lineHeight: '1.7'
              }}>
                <li style={{ marginBottom: '8px' }}>Produtos de qualidade comprovada</li>
                <li style={{ marginBottom: '8px' }}>Preços competitivos no mercado</li>
                <li style={{ marginBottom: '8px' }}>Atendimento direto e personalizado</li>
                <li style={{ marginBottom: '8px' }}>Soluções sob medida para o seu negócio</li>
              </ul>
            </section>

            {/* Seção: Links Internos (SEO) */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                color: '#095400', 
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                Explore o Site
              </h2>
              <p style={{ 
                color: '#555', 
                lineHeight: '1.7',
                marginBottom: '20px',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}>
                Agora que você já me conhece, explore o que a Marques Vendas PMG tem para oferecer:
              </p>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '15px',
                flexWrap: 'wrap'
              }}>
                <Link 
                  href="/produtos"
                  style={{
                    display: 'inline-block',
                    padding: '12px 20px',
                    backgroundColor: '#095400',
                    color: 'white',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    textAlign: 'center',
                    flex: isMobile ? 'none' : '1',
                    transition: 'background-color 0.3s'
                  }}
                >
                  🛒 Faça seu Pedido Aqui
                </Link>
                <Link 
                  href="/food-news"
                  style={{
                    display: 'inline-block',
                    padding: '12px 20px',
                    backgroundColor: '#095400',
                    color: 'white',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    textAlign: 'center',
                    flex: isMobile ? 'none' : '1',
                    transition: 'background-color 0.3s'
                  }}
                >
                  📰 Conheça Nosso Blog
                </Link>
                <Link 
                  href="/ofertas"
                  style={{
                    display: 'inline-block',
                    padding: '12px 20px',
                    backgroundColor: '#095400',
                    color: 'white',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    textAlign: 'center',
                    flex: isMobile ? 'none' : '1',
                    transition: 'background-color 0.3s'
                  }}
                >
                  🔥 Conheça Nossas Ofertas
                </Link>
              </div>
            </section>

            {/* Seção: Fale Conosco */}
            <section>
              <h2 style={{ 
                color: '#095400', 
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                Fale Conosco
              </h2>
              <p style={{ 
                color: '#555', 
                lineHeight: '1.7',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}>
                Estou aqui para te atender da melhor forma possível. Entre em contato pelo WhatsApp: <strong>(11) 91357-2902</strong> ou e-mail: <strong>marquesvendaspmg@gmail.com</strong>. Será um prazer atender você!
              </p>
            </section>
          </div>

          {/* Coluna Direita */}
          <div style={{
            flex: isMobile ? 'none' : 1,
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            padding: isMobile ? '20px' : '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            width: '100%'
          }}>
            {/* Atendimento */}
            <div style={{
              backgroundColor: '#095400',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '25px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', marginBottom: '10px' }}>⭐</div>
              <h3 style={{
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                marginBottom: '10px',
                fontWeight: '600'
              }}>
                Atendimento Direto
              </h3>
              <p style={{ fontSize: isMobile ? '0.85rem' : '0.9rem', opacity: '0.9' }}>
                Com vendedor da PMG Atacadista
              </p>
            </div>

            {/* Onde Atendemos */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                color: '#095400', 
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                marginBottom: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>📍</span> Onde Atendemos
              </h3>
              <div style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                borderLeft: '4px solid #095400'
              }}>
                <p style={{ color: '#333', marginBottom: '8px', fontWeight: '500', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  <strong>🏢 São Paulo:</strong>
                </p>
                <p style={{ color: '#555', fontSize: isMobile ? '0.85rem' : '0.9rem', marginBottom: '12px' }}>
                  Capital, Interior e Litoral
                </p>
                
                <p style={{ color: '#333', marginBottom: '8px', fontWeight: '500', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  <strong>⛰️ Sul de Minas:</strong>
                </p>
                <p style={{ color: '#555', fontSize: isMobile ? '0.85rem' : '0.9rem', marginBottom: '12px' }}>
                  +50 cidades atendidas
                </p>
                
                <p style={{ color: '#333', marginBottom: '8px', fontWeight: '500', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  <strong>🏖️ Sul do RJ:</strong>
                </p>
                <p style={{ color: '#555', fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                  Região Sul Fluminense
                </p>
              </div>
            </div>

            {/* Contato Rápido */}
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ 
                color: '#095400', 
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                marginBottom: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>💬</span> Fale Direto Comigo
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: '#333', marginBottom: '5px', fontWeight: '500', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  📞 WhatsApp:
                </p>
                <a 
                  href="https://wa.me/5511913572902" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#095400',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: isMobile ? '1rem' : '1.1rem'
                  }}
                >
                  (11) 91357-2902
                </a>
              </div>
              
              <div>
                <p style={{ color: '#333', marginBottom: '5px', fontWeight: '500', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  ✉️ E-mail:
                </p>
                <a 
                  href="mailto:marquesvendaspmg@gmail.com"
                  style={{
                    color: '#095400',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}
                >
                  marquesvendaspmg@gmail.com
                </a>
              </div>
              
              <button
                onClick={() => window.open('https://wa.me/5511913572902', '_blank')}
                style={{
                  width: '100%',
                  marginTop: '15px',
                  padding: isMobile ? '10px' : '12px',
                  backgroundColor: '#095400',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#074000'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#095400'}
              >
                <span>💬</span> Chamar no WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <footer style={{
          marginTop: isMobile ? '40px' : '50px',
          textAlign: 'center',
          color: '#666',
          fontSize: isMobile ? '0.8rem' : '0.85rem',
          padding: '20px 0',
          borderTop: '1px solid #eee'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: isMobile ? '10px' : '15px',
            marginBottom: '15px'
          }}>
            <Link 
              href="/termos" 
              style={{ color: '#095400', textDecoration: 'none', fontWeight: '500', padding: '5px 10px', fontSize: isMobile ? '0.85rem' : '0.9rem' }}
            >
              Termos de Uso
            </Link>
            <Link 
              href="/politica-de-privacidade"
              style={{ color: '#095400', textDecoration: 'none', fontWeight: '500', padding: '5px 10px', fontSize: isMobile ? '0.85rem' : '0.9rem' }}
            >
              Política de Privacidade
            </Link>
            <Link 
              href="/quem-somos"
              style={{ color: '#095400', textDecoration: 'none', fontWeight: '600', padding: '5px 10px', fontSize: isMobile ? '0.85rem' : '0.9rem' }}
            >
              Quem Somos
            </Link>
            <Link 
              href="/"
              style={{ color: '#095400', textDecoration: 'none', fontWeight: '500', padding: '5px 10px', fontSize: isMobile ? '0.85rem' : '0.9rem' }}
            >
              Voltar ao Início
            </Link>
          </div>
          
          <p style={{ marginTop: '15px', color: '#888', fontSize: isMobile ? '0.75rem' : '0.8rem' }}>
            © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.<br />
            Estrada Ferreira Guedes, 784 - Potuveró • Itapecerica da Serra • SP • CEP: 06885-150
          </p>
        </footer>
      </div>
    </>
  );
}
