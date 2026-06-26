// pages/app.js
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import useTrackUser from '../hook/useTrackUser';

export default function AppPage() {
  useTrackUser();
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // INFORMAÇÕES DO APP (peguei do seu tema)
  const appInfo = {
    nome: 'App Marques Vendas PMG',
    link: 'https://play.google.com/store/apps/details?id=com.marquesantonio.marquesvendaspmg',
    qrCode: '/qrcodeapp.png',
    googlePlayBadge: '/google-play-badge.png',
    appStoreBadge: '/app-store-badge.png',
    cores: {
      verde: '#1e5c3b',
      vermelho: '#ff0000',
      dourado: '#ffd700',
      cinza: '#f5f5f5'
    }
  };

  return (
    <>
      <Head>
        <title>App Marques Vendas PMG - Baixar Aplicativo para Food Service | Atacadista</title>
        <meta name="description" content="Baixe o App Marques Vendas PMG para restaurantes, pizzarias e lanchonetes. Peça alimentos do PMG Atacadista com entrega rápida. Baixe agora!" />
        <meta name="keywords" content="app marques vendas pmg, aplicativo pmg atacadista, baixar app pmg atacadista, app para restaurantes, aplicativo para food service, app para pizzarias, app para lanchonetes, pmg atacadista app, baixar aplicativo pmg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.marquesvendaspmg.shop/app" />
        
        <meta property="og:title" content="App Marques Vendas PMG - Baixe o Aplicativo para Food Service" />
        <meta property="og:description" content="Aplicativo para restaurantes, pizzarias e lanchonetes. Peça alimentos do PMG Atacadista direto do seu celular." />
        <meta property="og:image" content="https://i.imgur.com/pBH5WpZ.png" />
        <meta property="og:url" content="https://www.marquesvendaspmg.shop/app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Marques Vendas PMG" />
        <meta property="og:locale" content="pt_BR" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="App Marques Vendas PMG - Baixar Aplicativo" />
        <meta name="twitter:description" content="Aplicativo para food service. Peça alimentos do PMG Atacadista direto do celular." />
        <meta name="twitter:image" content="https://i.imgur.com/pBH5WpZ.png" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "App Marques Vendas PMG",
            "operatingSystem": "Android",
            "applicationCategory": "BusinessApplication",
            "description": "Aplicativo para restaurantes, pizzarias e lanchonetes comprarem alimentos do PMG Atacadista.",
            "url": appInfo.link,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "BRL"
            },
            "author": {
              "@type": "Organization",
              "name": "Marques Vendas PMG"
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Como baixar o App Marques Vendas PMG?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Baixe o App Marques Vendas PMG gratuitamente na Play Store ou escaneie o QR Code."
                }
              },
              {
                "@type": "Question",
                "name": "Para quem é o App Marques Vendas PMG?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Para restaurantes, pizzarias, lanchonetes e food service em geral."
                }
              },
              {
                "@type": "Question",
                "name": "Quais produtos estão disponíveis no App PMG Atacadista?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Laticínios, queijos, embutidos, massas, bebidas, congelados e diversos alimentos."
                }
              },
              {
                "@type": "Question",
                "name": "O App PMG Atacadista tem entrega?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim! Entregamos na Grande São Paulo, Sul de Minas Gerais e Sul do Rio de Janeiro."
                }
              }
            ]
          })}
        </script>
      </Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '15px' : '30px',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}>
        
        {/* ========== TOPO ========== */}
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '20px 0' : '40px 0',
          marginBottom: isMobile ? '10px' : '20px'
        }}>
          <div style={{
            backgroundColor: appInfo.cores.verde,
            padding: isMobile ? '8px 20px' : '12px 30px',
            borderRadius: '30px',
            marginBottom: isMobile ? '15px' : '20px',
            color: 'white',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: '600'
          }}>
            📱 App Oficial - PMG Atacadista
          </div>
          
          <img 
            src="https://i.imgur.com/pBH5WpZ.png" 
            alt="Marques Vendas PMG App" 
            style={{ 
              width: isMobile ? '180px' : '250px',
              marginBottom: isMobile ? '15px' : '20px'
            }} 
          />
          
          <h1 style={{ 
            color: appInfo.cores.verde, 
            fontSize: isMobile ? '1.8rem' : '2.8rem',
            textAlign: 'center',
            fontWeight: '700',
            lineHeight: '1.2',
            margin: '0 0 10px 0'
          }}>
            App Marques Vendas PMG
          </h1>
          
          <p style={{
            color: '#555',
            fontSize: isMobile ? '1.1rem' : '1.3rem',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: '1.6'
          }}>
            Seu atacadista food service na palma da mão. 
            <br />
            <strong>Peça para seu restaurante, pizzaria ou lanchonete!</strong>
          </p>
        </header>

        {/* ========== QR CODE + BOTÕES ========== */}
        <section style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '30px' : '50px',
          backgroundColor: appInfo.cores.cinza,
          padding: isMobile ? '30px 20px' : '40px',
          borderRadius: '16px',
          margin: isMobile ? '20px 0' : '40px 0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          {/* QR Code */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={appInfo.qrCode}
                alt="QR Code para baixar o App Marques Vendas PMG" 
                style={{
                  width: isMobile ? '200px' : '250px',
                  height: isMobile ? '200px' : '250px',
                  display: 'block'
                }}
              />
            </div>
            <p style={{
              color: '#666',
              fontSize: isMobile ? '0.85rem' : '0.95rem',
              marginTop: '15px',
              fontWeight: '500'
            }}>
              📸 Escaneie o QR Code com seu celular
            </p>
          </div>

          {!isMobile && (
            <div style={{
              width: '2px',
              height: '250px',
              backgroundColor: '#e0e0e0'
            }} />
          )}

          {/* Botões de Download */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <h3 style={{
              color: appInfo.cores.verde,
              fontSize: isMobile ? '1.2rem' : '1.4rem',
              margin: 0,
              textAlign: 'center'
            }}>
              📱 Baixe nosso app!
            </h3>
            
            <p style={{
              color: '#555',
              fontSize: isMobile ? '0.95rem' : '1.05rem',
              textAlign: 'center',
              maxWidth: '350px',
              lineHeight: '1.5',
              margin: 0
            }}>
              Faça seu pedido em 1 minuto! Com o App PMG, você faz seu pedido rápido, sem filas e sem espera.
            </p>

            {/* Google Play */}
            <a 
              href={appInfo.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                width: isMobile ? '200px' : '220px',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <img 
                src={appInfo.googlePlayBadge}
                alt="Baixar na Google Play" 
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
            </a>

            {/* App Store (em breve) */}
            <div style={{
              opacity: 0.5,
              cursor: 'not-allowed',
              width: isMobile ? '200px' : '220px'
            }}>
              <img 
                src={appInfo.appStoreBadge}
                alt="Em breve na App Store" 
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
              <p style={{
                fontSize: '0.7rem',
                color: '#999',
                marginTop: '5px',
                textAlign: 'center'
              }}>
                🚀 Em breve para iOS
              </p>
            </div>
          </div>
        </section>

        {/* ========== BENEFÍCIOS ========== */}
        <section style={{
          margin: isMobile ? '30px 0' : '50px 0'
        }}>
          <h2 style={{
            color: appInfo.cores.verde,
            fontSize: isMobile ? '1.5rem' : '2rem',
            textAlign: 'center',
            marginBottom: isMobile ? '20px' : '30px'
          }}>
            Por que baixar o App Marques Vendas PMG?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '15px' : '25px',
            padding: isMobile ? '0 10px' : '0'
          }}>
            <div style={{
              backgroundColor: appInfo.cores.cinza,
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🍕</div>
              <h3 style={{ color: appInfo.cores.verde, fontSize: '1.2rem', marginBottom: '10px' }}>
                Para Restaurantes
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Faça pedidos de alimentos para seu restaurante com poucos cliques.
              </p>
            </div>

            <div style={{
              backgroundColor: appInfo.cores.cinza,
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🍕</div>
              <h3 style={{ color: appInfo.cores.verde, fontSize: '1.2rem', marginBottom: '10px' }}>
                Para Pizzarias
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Muçarela, ingredientes e insumos com preços de atacado.
              </p>
            </div>

            <div style={{
              backgroundColor: appInfo.cores.cinza,
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🥪</div>
              <h3 style={{ color: appInfo.cores.verde, fontSize: '1.2rem', marginBottom: '10px' }}>
                Para Lanchonetes
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Compre insumos, bebidas e congelados com preço competitivo.
              </p>
            </div>
          </div>
        </section>

        {/* ========== DIFERENCIAIS ========== */}
        <section style={{
          backgroundColor: appInfo.cores.cinza,
          padding: isMobile ? '25px 20px' : '40px 30px',
          borderRadius: '12px',
          margin: isMobile ? '20px 0' : '40px 0'
        }}>
          <h2 style={{
            color: appInfo.cores.verde,
            fontSize: isMobile ? '1.3rem' : '1.8rem',
            textAlign: 'center',
            marginBottom: isMobile ? '20px' : '30px'
          }}>
            Vantagens do App PMG Atacadista
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '15px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {[
              '📦 Catálogo completo de produtos',
              '🚚 Entrega rápida na sua região',
              '💰 Preços competitivos de atacado',
              '📱 Pedidos direto do celular',
              '🛡️ Produtos com garantia de qualidade',
              '👨‍💼 Atendimento personalizado'
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{item.split(' ')[0]}</span>
                <span style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: '#333' }}>
                  {item.split(' ').slice(1).join(' ')}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========== DEPOIMENTOS ========== */}
        <section style={{
          margin: isMobile ? '30px 0' : '50px 0'
        }}>
          <h2 style={{
            color: appInfo.cores.verde,
            fontSize: isMobile ? '1.3rem' : '1.8rem',
            textAlign: 'center',
            marginBottom: isMobile ? '20px' : '30px'
          }}>
            O que dizem nossos clientes
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '20px',
            padding: isMobile ? '0 10px' : '0'
          }}>
            <div style={{
              backgroundColor: appInfo.cores.cinza,
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>⭐</p>
              <p style={{ color: '#333', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.5' }}>
                "O app facilitou muito meus pedidos. Agora compro direto do celular."
              </p>
              <p style={{ color: appInfo.cores.verde, fontWeight: '600', marginTop: '10px' }}>
                - Carlos, pizzaria
              </p>
            </div>

            <div style={{
              backgroundColor: appInfo.cores.cinza,
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>⭐</p>
              <p style={{ color: '#333', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.5' }}>
                "Entrega rápida e preço bom. O app é simples de usar."
              </p>
              <p style={{ color: appInfo.cores.verde, fontWeight: '600', marginTop: '10px' }}>
                - Fernanda, lanchonete
              </p>
            </div>

            <div style={{
              backgroundColor: appInfo.cores.cinza,
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>⭐</p>
              <p style={{ color: '#333', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.5' }}>
                "Produtos de qualidade e atendimento personalizado. Recomendo!"
              </p>
              <p style={{ color: appInfo.cores.verde, fontWeight: '600', marginTop: '10px' }}>
                - Ricardo, restaurante
              </p>
            </div>
          </div>
        </section>

        {/* ========== FAQ ========== */}
        <section style={{
          backgroundColor: appInfo.cores.cinza,
          padding: isMobile ? '25px 20px' : '40px 30px',
          borderRadius: '12px',
          margin: isMobile ? '20px 0' : '40px 0'
        }}>
          <h2 style={{
            color: appInfo.cores.verde,
            fontSize: isMobile ? '1.3rem' : '1.8rem',
            textAlign: 'center',
            marginBottom: isMobile ? '20px' : '30px'
          }}>
            Perguntas Frequentes
          </h2>

          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {[
              {
                q: "Como baixar o App Marques Vendas PMG?",
                a: "Baixe gratuitamente na Play Store ou escaneie o QR Code acima."
              },
              {
                q: "O app é gratuito?",
                a: "Sim! O download e uso são totalmente gratuitos."
              },
              {
                q: "Quem pode usar o app?",
                a: "Restaurantes, pizzarias, lanchonetes e food service."
              },
              {
                q: "Quais produtos estão disponíveis?",
                a: "Laticínios, queijos, embutidos, massas, bebidas e congelados."
              },
              {
                q: "O app entrega em toda a região?",
                a: "Sim! Atendemos Grande SP, Sul de MG e Sul do RJ."
              }
            ].map((faq, index) => (
              <div key={index} style={{
                borderBottom: index < 4 ? '1px solid #e0e0e0' : 'none',
                padding: '20px 0'
              }}>
                <h3 style={{
                  color: appInfo.cores.verde,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  margin: '0 0 10px 0'
                }}>
                  {faq.q}
                </h3>
                <p style={{
                  color: '#555',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========== CTA FINAL ========== */}
        <div style={{
          textAlign: 'center',
          margin: isMobile ? '30px 0' : '50px 0',
          padding: isMobile ? '25px 15px' : '40px 20px',
          backgroundColor: appInfo.cores.verde,
          borderRadius: '12px',
          color: 'white'
        }}>
          <h2 style={{
            fontSize: isMobile ? '1.4rem' : '2rem',
            marginBottom: '15px'
          }}>
            📲 Baixe agora e simplifique seus pedidos!
          </h2>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.2rem',
            opacity: 0.9,
            marginBottom: '25px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Seu negócio merece agilidade e qualidade. Comece hoje mesmo!
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '20px' : '30px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              <img 
                src={appInfo.qrCode}
                alt="QR Code App PMG" 
                style={{
                  width: isMobile ? '100px' : '120px',
                  height: isMobile ? '100px' : '120px'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px'
            }}>
              <a 
                href={appInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: isMobile ? '16px 35px' : '18px 45px',
                  backgroundColor: '#fff',
                  color: appInfo.cores.verde,
                  borderRadius: '50px',
                  fontSize: isMobile ? '1.1rem' : '1.3rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                📲 Baixar na Play Store
              </a>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.8rem',
                margin: 0
              }}>
                Ou escaneie o QR Code ao lado
              </p>
            </div>
          </div>
        </div>

        {/* ========== RODAPÉ ========== */}
        <footer style={{
          marginTop: isMobile ? '40px' : '60px',
          padding: isMobile ? '25px 15px' : '40px 20px',
          textAlign: 'center',
          color: '#666',
          fontSize: isMobile ? '0.8rem' : '0.85rem',
          borderTop: `2px solid ${appInfo.cores.verde}`,
          backgroundColor: '#f8f9fa',
          borderRadius: '12px 12px 0 0'
        }}>
          <h3 style={{
            color: appInfo.cores.verde,
            fontSize: isMobile ? '1rem' : '1.1rem',
            marginBottom: '20px',
            fontWeight: '600'
          }}>
            📋 Informações Legais
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '15px' : '20px',
            marginBottom: '25px',
            maxWidth: '600px',
            margin: '0 auto 25px auto'
          }}>
            <Link href="/politica-de-privacidade" passHref legacyBehavior>
              <a style={{ color: appInfo.cores.verde, textDecoration: 'none', fontWeight: '600', fontSize: isMobile ? '0.8rem' : '0.85rem', padding: '12px 8px', borderRadius: '8px', transition: 'all 0.3s ease', backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
                🔒 {isMobile ? 'Privacidade' : 'Política de Privacidade'}
              </a>
            </Link>
            <Link href="/politica-devolucao-e-reembolso" passHref legacyBehavior>
              <a style={{ color: appInfo.cores.verde, textDecoration: 'none', fontWeight: '600', fontSize: isMobile ? '0.8rem' : '0.85rem', padding: '12px 8px', borderRadius: '8px', transition: 'all 0.3s ease', backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
                🔄 {isMobile ? 'Devolução' : 'Política de Devolução'}
              </a>
            </Link>
            <Link href="/termos" passHref legacyBehavior>
              <a style={{ color: appInfo.cores.verde, textDecoration: 'none', fontWeight: '600', fontSize: isMobile ? '0.8rem' : '0.85rem', padding: '12px 8px', borderRadius: '8px', transition: 'all 0.3s ease', backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
                📄 {isMobile ? 'Termos' : 'Termos de Uso'}
              </a>
            </Link>
            <Link href="/quem-somos" passHref legacyBehavior>
              <a style={{ color: appInfo.cores.verde, textDecoration: 'none', fontWeight: '600', fontSize: isMobile ? '0.8rem' : '0.85rem', padding: '12px 8px', borderRadius: '8px', transition: 'all 0.3s ease', backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
                👥 {isMobile ? 'Sobre' : 'Quem Somos'}
              </a>
            </Link>
          </div>

          <div style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${appInfo.cores.verde}, transparent)`,
            margin: '20px auto',
            maxWidth: '300px'
          }}></div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '20px' : '25px',
            marginBottom: '15px',
            alignItems: 'center'
          }}>
            <a href="https://www.facebook.com/MarquesVendaspmg" target="_blank" rel="noopener noreferrer">
              <img src="https://i.imgur.com/prULUUA.png" alt="Facebook" style={{ width: '24px', height: '24px' }} />
            </a>
            <a href="https://www.instagram.com/marquesvendaspmg" target="_blank" rel="noopener noreferrer">
              <img src="https://i.imgur.com/I0ZZLjG.png" alt="Instagram" style={{ width: '24px', height: '24px' }} />
            </a>
            <a href="https://www.youtube.com/@MarquesVendasPMG" target="_blank" rel="noopener noreferrer">
              <img src="https://i.imgur.com/WfpZ8Gg.png" alt="YouTube" style={{ width: '24px', height: '24px' }} />
            </a>
          </div>

          <div style={{ maxWidth: '800px', margin: '15px auto 20px auto', padding: '0 15px' }}>
            <p style={{ color: '#666', fontSize: isMobile ? '0.75rem' : '0.85rem', lineHeight: '1.5', textAlign: 'center', fontStyle: 'italic', margin: '0 0 15px 0' }}>
              <strong>PMG Atacadista</strong> - Seu fornecedor de confiança em <strong>São Paulo</strong>. 
              Especializados em <strong>atacado food service</strong> para restaurantes, bares e mercados.
            </p>
          </div>

          <p style={{ margin: '5px 0', fontSize: isMobile ? '0.8rem' : '0.85rem', color: '#666' }}>
            © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
          </p>
          <p style={{ margin: '5px 0', fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#999', lineHeight: '1.4' }}>
            • Endereço: Estrada Ferreira Guedes, 784 - Potuverá CEP: 06885-150 - Itapecerica da Serra - SP
          </p>
        </footer>
      </div>
    </>
  );
}