import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import useTrackUser from '../../hook/useTrackUser';
import { ebooks } from '../../data/ebooks';

const SITE_URL = 'https://www.marquesvendaspmg.shop';

export default function EbookIndex() {
  useTrackUser();
  const [isMobile, setIsMobile] = useState(false);
  const [hoverCard, setHoverCard] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Parallax sutil no hero (só desktop)
  useEffect(() => {
    if (isMobile) return;
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 400) {
        el.style.transform = `translateY(${y * 0.15}px)`;
        el.style.opacity = String(Math.max(0, 1 - y / 500));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  const totalEbooks = ebooks.length;

  return (
    <>
      <Head>
        <title>Biblioteca de Ebooks | Marques Vendas PMG</title>
        <meta
          name="description"
          content="Biblioteca de ebooks e guias técnicos gratuitos da Marques Vendas PMG. Materiais exclusivos sobre produtos food service, fichas técnicas e aplicações para o seu negócio."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`${SITE_URL}/ebook`} />
        <meta name="theme-color" content="#095400" />

        <meta property="og:title" content="Biblioteca de Ebooks | Marques Vendas PMG" />
        <meta
          property="og:description"
          content="Materiais gratuitos para comprar com confiança, revender com margem e servir com qualidade."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/ebook`} />
        <meta property="og:site_name" content="Marques Vendas PMG" />
        <meta property="og:image" content="https://i.imgur.com/pBH5WpZ.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Biblioteca de Ebooks Marques Vendas PMG',
            description:
              'Materiais técnicos gratuitos sobre produtos food service.',
            url: `${SITE_URL}/ebook`,
            publisher: {
              '@type': 'Organization',
              name: 'Marques Vendas PMG',
              logo: {
                '@type': 'ImageObject',
                url: 'https://i.imgur.com/pBH5WpZ.png',
              },
            },
          })}
        </script>
      </Head>

      <style jsx global>{`
        @keyframes floatY {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseRing {
          0% {
            box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.5);
          }
          70% {
            box-shadow: 0 0 0 18px rgba(231, 76, 60, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
          }
        }
        .ebook-card:hover .card-arrow {
          transform: translateX(6px);
        }
        .ebook-card:hover .card-cover-img {
          transform: scale(1.05) rotate(-0.5deg);
        }
        .ebook-card {
          animation: fadeUp 0.6s ease both;
        }
        .hero-orb {
          animation: floatY 7s ease-in-out infinite;
        }
        .cta-shimmer {
          background: linear-gradient(
            90deg,
            #e74c3c 0%,
            #ff6b5b 50%,
            #e74c3c 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        .pulse-dot {
          animation: pulseRing 2s infinite;
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#ffffff',
          fontFamily:
            "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
          overflow: 'hidden',
        }}
      >
        {/* ================= HERO CINEMATOGRÁFICO ================= */}
        <header
          ref={heroRef}
          style={{
            position: 'relative',
            background:
              'radial-gradient(circle at 20% 20%, #0c6e00 0%, #095400 45%, #063a00 100%)',
            padding: isMobile ? '60px 20px 70px' : '110px 40px 130px',
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          {/* Orbs decorativas */}
          <div
            className="hero-orb"
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            className="hero-orb"
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(231,76,60,0.18) 0%, transparent 70%)',
              animationDelay: '2s',
              pointerEvents: 'none',
            }}
          />
          {/* Grid sutil */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              maskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 75%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
            }}
          >
            {/* Badge topo */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: isMobile ? '7px 16px' : '9px 22px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '30px',
                fontSize: isMobile ? '0.72rem' : '0.8rem',
                fontWeight: 600,
                letterSpacing: '1.5px',
                marginBottom: '24px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="pulse-dot"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#4ade80',
                  display: 'inline-block',
                }}
              />
              {totalEbooks}{' '}
              {totalEbooks === 1
                ? 'MATERIAL DISPONÍVEL'
                : 'MATERIAIS DISPONÍVEIS'}{' '}
              · GRATUITOS
            </div>

            <h1
              style={{
                fontSize: isMobile ? '2.1rem' : '3.8rem',
                fontWeight: 800,
                lineHeight: 1.05,
                margin: '0 0 20px',
                letterSpacing: '-1.5px',
              }}
            >
              Conhecimento que{' '}
              <span
                style={{
                  background:
                    'linear-gradient(120deg, #4ade80 0%, #86efac 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                vende
              </span>
              .
              <br />
              Bibliotecas que{' '}
              <span
                style={{
                  background:
                    'linear-gradient(120deg, #ff8a7a 0%, #e74c3c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                encantam
              </span>
              .
            </h1>

            <p
              style={{
                fontSize: isMobile ? '1rem' : '1.2rem',
                maxWidth: '640px',
                margin: '0 auto 40px',
                lineHeight: 1.65,
                opacity: 0.9,
                fontWeight: 400,
              }}
            >
              Baixe guias técnicos completos, conheça cada detalhe dos nossos
              produtos e compre com a confiança de quem entende o mercado food
              service há 30 anos.
            </p>

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: isMobile ? '24px' : '56px',
                flexWrap: 'wrap',
                marginBottom: '40px',
              }}
            >
              {[
                { valor: '30', sufixo: ' anos', label: 'de mercado' },
                { valor: `${totalEbooks}`, sufixo: '', label: 'ebook gratuito' },
                { valor: '100', sufixo: '%', label: 'sem cadastro' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: isMobile ? '1.8rem' : '2.4rem',
                      fontWeight: 800,
                      color: '#4ade80',
                      lineHeight: 1,
                      letterSpacing: '-1px',
                    }}
                  >
                    {s.valor}
                    <span style={{ fontSize: '0.6em', opacity: 0.8 }}>
                      {s.sufixo}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? '0.72rem' : '0.82rem',
                      opacity: 0.75,
                      marginTop: '6px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA site oficial */}
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: isMobile ? '14px 28px' : '16px 36px',
                backgroundColor: '#e74c3c',
                color: '#fff',
                borderRadius: '50px',
                textDecoration: 'none',
                fontSize: isMobile ? '0.95rem' : '1.05rem',
                fontWeight: 700,
                boxShadow: '0 12px 30px rgba(231,76,60,0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform =
                    'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow =
                    '0 18px 40px rgba(231,76,60,0.55)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(231,76,60,0.4)';
              }}
            >
              Visitar loja oficial
              <span style={{ fontSize: '1.1rem' }}>→</span>
            </a>
          </div>

          {/* Wave inferior */}
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: isMobile ? '40px' : '70px',
              display: 'block',
            }}
          >
            <path
              d="M0,50 C360,120 720,0 1080,50 C1260,75 1380,60 1440,50 L1440,100 L0,100 Z"
              fill="#ffffff"
            />
          </svg>
        </header>

        {/* ================= GRID DE EBOOKS ================= */}
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: isMobile ? '40px 16px 60px' : '60px 30px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: isMobile ? '24px' : '40px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#095400',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Catálogo
              </span>
              <h2
                style={{
                  fontSize: isMobile ? '1.5rem' : '2.1rem',
                  fontWeight: 800,
                  color: '#1a1a1a',
                  margin: '8px 0 0',
                  letterSpacing: '-0.8px',
                }}
              >
                Todos os materiais
              </h2>
            </div>
            <span
              style={{
                fontSize: '0.85rem',
                color: '#888',
                fontWeight: 500,
              }}
            >
              {totalEbooks} {totalEbooks === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: isMobile ? '22px' : '30px',
            }}
          >
            {ebooks.map((ebook, index) => (
              <Link
                key={ebook.slug}
                href={`/ebook/${ebook.slug}`}
                passHref
                legacyBehavior
              >
                <a
                  className="ebook-card"
                  onMouseEnter={() => !isMobile && setHoverCard(ebook.slug)}
                  onMouseLeave={() => setHoverCard(null)}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border:
                      hoverCard === ebook.slug
                        ? '1px solid #095400'
                        : '1px solid #eef0ee',
                    boxShadow:
                      hoverCard === ebook.slug
                        ? '0 24px 50px rgba(9,84,0,0.18)'
                        : '0 4px 20px rgba(0,0,0,0.05)',
                    transition:
                      'transform 0.35s cubic-bezier(.2,.8,.2,1), box-shadow 0.35s, border-color 0.35s',
                    transform:
                      hoverCard === ebook.slug && !isMobile
                        ? 'translateY(-8px)'
                        : 'translateY(0)',
                    animationDelay: `${index * 0.08}s`,
                    position: 'relative',
                  }}
                >
                  {/* ========= CAPA =========
                      Opção A: card com proporção 16/10 (uniforme no grid),
                      capa flutua centralizada, sem cortar (objectFit: contain).
                      Se a imagem for 828x1170, aparece inteira sobre fundo verde. */}
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '16 / 10',
                      overflow: 'hidden',
                      background:
                        'linear-gradient(135deg, #095400 0%, #0c6e00 55%, #063a00 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '18px',
                    }}
                  >
                    {/* Brilho radial de fundo */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.16) 0%, transparent 60%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {ebook.capa ? (
                      <img
                        className="card-cover-img"
                        src={ebook.capa}
                        alt={ebook.titulo}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          display: 'block',
                          borderRadius: '6px',
                          boxShadow:
                            '0 16px 34px rgba(0,0,0,0.45), 0 6px 12px rgba(0,0,0,0.25)',
                          transition: 'transform 0.6s ease',
                          position: 'relative',
                          zIndex: 1,
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '24px',
                          color: '#fff',
                          textAlign: 'center',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: '2px',
                            opacity: 0.8,
                            marginBottom: '10px',
                          }}
                        >
                          MARQUES VENDAS · EBOOK
                        </span>
                        <strong
                          style={{
                            fontSize: isMobile ? '1.05rem' : '1.15rem',
                            lineHeight: 1.3,
                            fontWeight: 700,
                            maxWidth: '90%',
                          }}
                        >
                          {ebook.titulo}
                        </strong>
                      </div>
                    )}

                    {/* Badge categoria */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '5px 12px',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        color: '#095400',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        borderRadius: '20px',
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        zIndex: 2,
                      }}
                    >
                      {ebook.categoria}
                    </span>

                    {/* Badge PDF */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        padding: '5px 12px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        borderRadius: '20px',
                        backdropFilter: 'blur(6px)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        zIndex: 2,
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#4ade80',
                          display: 'inline-block',
                        }}
                      />
                      PDF · {ebook.paginas} páginas
                    </span>
                  </div>

                  {/* CONTEÚDO */}
                  <div
                    style={{
                      padding: '22px 22px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: isMobile ? '1.08rem' : '1.18rem',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        margin: '0 0 10px',
                        lineHeight: 1.35,
                        letterSpacing: '-0.3px',
                      }}
                    >
                      {ebook.titulo}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        lineHeight: 1.6,
                        margin: '0 0 20px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {ebook.resumo}
                    </p>
                    <div
                      style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '14px',
                        borderTop: '1px solid #f0f0f0',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#095400',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                        }}
                      >
                        Acessar material
                        <span
                          className="card-arrow"
                          style={{
                            display: 'inline-block',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          →
                        </span>
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#999',
                          fontWeight: 500,
                        }}
                      >
                        Gratuito
                      </span>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= CTA FINAL — LOJA OFICIAL ================= */}
        <section
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #095400 0%, #0c6e00 100%)',
            padding: isMobile ? '55px 20px' : '90px 40px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            }}
          />
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              textAlign: 'center',
              position: 'relative',
              zIndex: 2,
              color: '#fff',
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? '1.6rem' : '2.4rem',
                fontWeight: 800,
                margin: '0 0 16px',
                letterSpacing: '-0.8px',
                lineHeight: 1.2,
              }}
            >
              Mais que um material. Uma experiência.
            </h2>
            <p
              style={{
                fontSize: isMobile ? '0.95rem' : '1.1rem',
                lineHeight: 1.65,
                opacity: 0.9,
                maxWidth: '600px',
                margin: '0 auto 34px',
              }}
            >
              Todos os produtos que você viu aqui estão disponíveis na loja
              oficial com condições especiais para o seu negócio.
            </p>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-shimmer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: isMobile ? '15px 32px' : '18px 44px',
                color: '#fff',
                borderRadius: '50px',
                textDecoration: 'none',
                fontSize: isMobile ? '1rem' : '1.12rem',
                fontWeight: 800,
                boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) =>
                !isMobile && (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Acessar loja Marques Vendas
              <span style={{ fontSize: '1.2rem' }}>→</span>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}