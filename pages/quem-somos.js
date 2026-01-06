import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useTrackUser from '../hook/useTrackUser';

export default function QuemSomos() {
  const [isMobile, setIsMobile] = useState(false);
  
  // Hook para rastrear visitantes
  useTrackUser();

  // Detectar tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // URLs das fotos
  const foto1 = "https://www.marquesvendaspmg.shop/images/marques-quem-somos-1.jpeg";
  const foto2 = "https://www.marquesvendaspmg.shop/images/marques-quem-somos-2.jpeg";

  return (
    <>
      <Head>
        <title>Quem Somos - Marques Vendas PMG | Atacado Food Service SP</title>
        <meta 
          name="description" 
          content="Conheça Marques Antonio, fundador da Marques Vendas PMG. Mais de 5 anos de experiência em atacado food service. Entrega em SP, Sul Minas e Sul RJ." 
        />
        <meta 
          name="keywords" 
          content="Marques Vendas PMG, quem somos, atacado food service, distribuidora SP, Marques Antonio, história PMG, fornecedor atacado" 
        />
        <meta property="og:title" content="Quem Somos - Marques Vendas PMG | Atacado Food Service" />
        <meta 
          property="og:description" 
          content="Conheça a história da Marques Vendas PMG. Mais de 5 anos entregando qualidade em atacado para SP, Sul Minas e Sul RJ." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.marquesvendaspmg.shop/quem-somos" />
        <meta property="og:image" content={foto1} />
        <meta property="og:site_name" content="Marques Vendas PMG" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.marquesvendaspmg.shop/quem-somos" />
        
        {/* Schema.org para LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Marques Vendas PMG",
              "image": ["https://i.imgur.com/jrERRsC.png", foto1, foto2],
              "description": "Marques Vendas PMG - Atacado Food Service com mais de 5 anos de experiência. Entregamos em SP, Sul Minas e Sul RJ.",
              "founder": {
                "@type": "Person",
                "name": "Marques Antonio",
                "jobTitle": "Fundador e CEO"
              },
              "foundingDate": "2020",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Estrada Ferreira Guedes, 784 - Potuverá",
                "postalCode": "06885-150",
                "addressLocality": "Itapecerica da Serra",
                "addressRegion": "SP",
                "addressCountry": "BR"
              },
              "telephone": "+55-11-91357-2902",
              "email": "marquesvendaspmg@gmail.com",
              "priceRange": "$$",
              "openingHours": "Mo-Su 08:00-18:00",
              "paymentAccepted": ["Cartão de Crédito", "Cartão de Débito", "Dinheiro", "PIX"],
              "areaServed": [
                {"@type": "State", "name": "São Paulo"},
                {"@type": "State", "name": "Minas Gerais", "description": "Sul de Minas"},
                {"@type": "State", "name": "Rio de Janeiro", "description": "Sul do Rio de Janeiro"}
              ],
              "sameAs": [
                "https://www.facebook.com/MarquesVendaspmg",
                "https://www.instagram.com/marquesvendaspmg",
                "https://www.youtube.com/@MarquesVendasPMG"
              ]
            })
          }}
        />
        
        {/* Schema.org para Person (Marques Antonio) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Marques Antonio",
              "jobTitle": "Fundador e Especialista em Atacado Food Service",
              "worksFor": {
                "@type": "Organization",
                "name": "Marques Vendas PMG"
              },
              "description": "Mais de 5 anos de experiência no mercado de atacado food service. Especialista em distribuição para restaurantes, bares e mercados.",
              "knowsAbout": ["Atacado Food Service", "Distribuição", "Gestão de Fornecedores", "Logística SP"],
              "image": foto1,
              "sameAs": "https://www.marquesvendaspmg.shop/quem-somos"
            })
          }}
        />
      </Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '15px' : '30px',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        position: 'relative'
      }}>
        {/* Cabeçalho com SEO melhorado */}
        <header style={{ 
          marginBottom: isMobile ? '30px' : '40px', 
          textAlign: 'center',
          position: 'relative'
        }}>
          <Link href="/" style={{ display: 'inline-block' }}>
            <img 
              src="https://i.imgur.com/pBH5WpZ.png" 
              alt="Logo Marques Vendas PMG - Atacado Food Service SP" 
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
            Conheça a Marques Vendas PMG
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: isMobile ? '1rem' : '1.1rem',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Mais de 5 anos entregando qualidade e confiança no atacado food service para São Paulo, Sul de Minas e Sul do Rio de Janeiro
          </p>
        </header>

        {/* Container Principal com Layout Responsivo */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '30px' : '40px',
          marginBottom: '50px'
        }}>
          
          {/* Coluna Esquerda: Conteúdo Principal */}
          <div style={{
            flex: isMobile ? 'none' : 2,
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: isMobile ? '20px' : '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            width: '100%'
          }}>
            {/* Container para Foto 1 e Texto lado a lado em desktop */}
            <div style={{
              display: isMobile ? 'block' : 'flex',
              gap: '25px',
              marginBottom: '30px',
              alignItems: 'flex-start'
            }}>
              {/* Foto 1 - Lado direito em desktop, acima em mobile */}
              <div style={{
                order: isMobile ? 1 : 2,
                width: isMobile ? '100%' : '200px',
                flexShrink: 0,
                marginBottom: isMobile ? '20px' : '0'
              }}>
                <img 
                  src={foto1} 
                  alt="Marques Antonio - Fundador da Marques Vendas PMG" 
                  style={{
                    width: '100%',
                    height: isMobile ? 'auto' : '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />
              </div>

              {/* Texto "Quem Sou Eu" */}
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
                  Quem Sou Eu
                </h2>
                <p style={{ 
                  color: '#555', 
                  lineHeight: '1.6',
                  marginBottom: '15px',
                  fontSize: isMobile ? '0.95rem' : '1rem'
                }}>
                  Me chamo <strong>Marques Antonio</strong> e trabalho na <strong>PMG há mais de 5 anos</strong>. 
                </p>
                <p style={{ 
                  color: '#555', 
                  lineHeight: '1.6',
                  marginBottom: '15px',
                  fontSize: isMobile ? '0.95rem' : '1rem'
                }}>
                  Sempre buscando melhorar cada dia mais nossas formas de atender você, nosso cliente, criamos este site <strong>Marques Vendas PMG - Distribuidora Food Service</strong> para oferecer um serviço de excelência.
                </p>
              </div>
            </div>

            {/* Container para Foto 2 e Texto em layout alternado */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '25px',
              marginBottom: '30px',
              alignItems: isMobile ? 'flex-start' : 'center'
            }}>
              {/* Foto 2 - Lado esquerdo em desktop, acima em mobile */}
              <div style={{
                width: isMobile ? '100%' : '180px',
                flexShrink: 0,
                marginBottom: isMobile ? '20px' : '0'
              }}>
                <img 
                  src={foto2} 
                  alt="Marques Antonio trabalhando no computador - Marques Vendas PMG" 
                  style={{
                    width: '100%',
                    height: isMobile ? 'auto' : '180px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />
              </div>

              {/* Seção "Nossa Missão" */}
              <div style={{ flex: 1 }}>
                <h2 style={{ 
                  color: '#095400', 
                  fontSize: isMobile ? '1.3rem' : '1.5rem',
                  marginBottom: '15px',
                  fontWeight: '600'
                }}>
                  Nossa Missão
                </h2>
                <p style={{ 
                  color: '#555', 
                  lineHeight: '1.6',
                  marginBottom: '15px',
                  fontSize: isMobile ? '0.95rem' : '1rem'
                }}>
                  Na <strong>Marques Vendas PMG</strong>, acreditamos que o sucesso do seu negócio é o nosso sucesso. Por isso, nos dedicamos a fornecer produtos de qualidade com atendimento personalizado, buscando sempre superar suas expectativas.
                </p>
              </div>
            </div>

            {/* Seção "Compromisso com Você" */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                color: '#095400', 
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                marginBottom: '15px',
                fontWeight: '600'
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

            {/* Seção "Fale Conosco" */}
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
                lineHeight: '1.6',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}>
                Estamos aqui para servir você melhor. Entre em contato pelo WhatsApp: <strong>(11) 91357-2902</strong> ou email: <strong>marquesvendaspmg@gmail.com</strong> - Será um prazer atendê-lo!
              </p>
            </section>
          </div>

          {/* Coluna Direita: Informações Adicionais */}
          <div style={{
            flex: isMobile ? 'none' : 1,
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            padding: isMobile ? '20px' : '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            width: '100%'
          }}>
            {/* Área de Experiência */}
            <div style={{
              backgroundColor: '#095400',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '25px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: isMobile ? '2rem' : '2.5rem',
                marginBottom: '10px'
              }}>
                ⭐
              </div>
              <h3 style={{
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                marginBottom: '10px',
                fontWeight: '600'
              }}>
                5+ Anos de Experiência
              </h3>
              <p style={{
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                opacity: '0.9'
              }}>
                No mercado de atacado food service
              </p>
            </div>

            {/* Área de Atendimento */}
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
                <p style={{ 
                  color: '#333', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}>
                  <strong>🏢 São Paulo:</strong>
                </p>
                <p style={{ 
                  color: '#555', 
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  marginBottom: '12px'
                }}>
                  Capital, Interior e Litoral
                </p>
                
                <p style={{ 
                  color: '#333', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}>
                  <strong>⛰️ Sul de Minas:</strong>
                </p>
                <p style={{ 
                  color: '#555', 
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  marginBottom: '12px'
                }}>
                  +50 cidades atendidas
                </p>
                
                <p style={{ 
                  color: '#333', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}>
                  <strong>🏖️ Sul do RJ:</strong>
                </p>
                <p style={{ 
                  color: '#555', 
                  fontSize: isMobile ? '0.85rem' : '0.9rem'
                }}>
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
                <span>💬</span> Fale Direto Conosco
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                <p style={{ 
                  color: '#333', 
                  marginBottom: '5px',
                  fontWeight: '500',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}>
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
                <p style={{ 
                  color: '#333', 
                  marginBottom: '5px',
                  fontWeight: '500',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}>
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

        {/* Conteúdo SEO Oculto (apenas para Google) */}
        <div style={{
          opacity: '0',
          height: '0',
          overflow: 'hidden',
          position: 'absolute'
        }}>
          <h1>Marques Vendas PMG - Quem Somos</h1>
          <h2>História da Marques Vendas PMG Atacado Food Service</h2>
          <p>
            Marques Vendas PMG é uma distribuidora especializada em atacado food service fundada por Marques Antonio. 
            Com mais de 5 anos de experiência no mercado, atendemos restaurantes, bares, mercados e estabelecimentos 
            comerciais em São Paulo, Sul de Minas Gerais e Sul do Rio de Janeiro.
          </p>
          <p>
            Nossa empresa nasceu da necessidade de oferecer um serviço diferenciado no atacado food service. 
            Marques Antonio, com sua vasta experiência na PMG, identificou a oportunidade de criar uma distribuidora 
            que realmente entendesse as necessidades dos clientes do setor alimentício.
          </p>
          <h3>Marques Antonio - Fundador</h3>
          <p>
            Marques Antonio é o fundador e responsável pela Marques Vendas PMG. Com mais de 5 anos atuando na área 
            de distribuição food service, ele traz conhecimento prático e entendimento profundo do mercado.
          </p>
          <h3>Área de Atuação PMG Atacadista</h3>
          <p>
            Atendemos todo o estado de São Paulo (capital, interior e litoral), Sul de Minas Gerais (mais de 50 cidades) 
            e Sul do Rio de Janeiro. Nossa frota própria garante entregas rápidas e seguras.
          </p>
          <h3>Produtos PMG Atacado</h3>
          <p>
            Trabalhamos com linha completa de produtos para food service: bebidas, laticínios, frios, carnes, 
            mercearia, higiene e limpeza. Todas as marcas premium do mercado.
          </p>
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
              style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '500',
                padding: '5px 10px',
                borderRadius: '5px',
                transition: 'all 0.3s',
                fontSize: isMobile ? '0.85rem' : '0.9rem'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#095400';
              }}
            >
              Termos de Uso
            </Link>
            
            <Link 
              href="/politica-de-privacidade"
              style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '500',
                padding: '5px 10px',
                borderRadius: '5px',
                transition: 'all 0.3s',
                fontSize: isMobile ? '0.85rem' : '0.9rem'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#095400';
              }}
            >
              Política de Privacidade
            </Link>
            
            <Link 
              href="/quem-somos"
              style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '600',
                padding: '5px 10px',
                borderRadius: '5px',
                transition: 'all 0.3s',
                fontSize: isMobile ? '0.85rem' : '0.9rem'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#095400';
              }}
            >
              Quem Somos
            </Link>
            
            <Link 
              href="/"
              style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '500',
                padding: '5px 10px',
                borderRadius: '5px',
                transition: 'all 0.3s',
                fontSize: isMobile ? '0.85rem' : '0.9rem'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#095400';
              }}
            >
              Voltar ao Início
            </Link>
          </div>
          
          <p style={{ 
            marginTop: '15px', 
            color: '#888',
            fontSize: isMobile ? '0.75rem' : '0.8rem'
          }}>
            © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.<br />
            Estrada Ferreira Guedes, 784 - Potuverá • Itapecerica da Serra • SP • CEP: 06885-150
          </p>
        </footer>
      </div>
    </>
  );
}
