import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import useTrackUser from '../../hook/useTrackUser';
import { ebooks } from '../../data/ebooks';

const SITE_URL = 'https://www.marquesvendaspmg.shop';

// Ícones SVG inline (sem emoji!)
const IconCheck = ({ color = '#095400', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconDownload = ({ size = 18, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconBook = ({ size = 20, color = '#095400' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3V4zM4 4v13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function EbookDetalhe({ ebook, outrosEbooks }) {
  useTrackUser();
  const [isMobile, setIsMobile] = useState(false);
  const [baixando, setBaixando] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!ebook) return null;

  const handleDownload = () => {
    setBaixando(true);
    window.location.href = `/api/ebook/download?slug=${encodeURIComponent(
      ebook.slug
    )}`;
    setTimeout(() => setBaixando(false), 2500);
  };

  const dataFormatada = new Date(ebook.dataPublicacao).toLocaleDateString(
    'pt-BR',
    { day: '2-digit', month: 'long', year: 'numeric' }
  );

  return (
    <>
      <Head>
        <title>{`${ebook.titulo} | Marques Vendas PMG`}</title>
        <meta name="description" content={ebook.resumo} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`${SITE_URL}/ebook/${ebook.slug}`} />
        <meta name="theme-color" content="#095400" />

        <meta property="og:title" content={ebook.titulo} />
        <meta property="og:description" content={ebook.resumo} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/ebook/${ebook.slug}`} />
        {ebook.capa && (
          <meta property="og:image" content={`${SITE_URL}${ebook.capa}`} />
        )}

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: ebook.titulo,
            description: ebook.resumo,
            bookFormat: 'https://schema.org/EBook',
            numberOfPages: ebook.paginas,
            inLanguage: 'pt-BR',
            datePublished: ebook.dataPublicacao,
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
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-up {
          animation: fadeUp 0.6s ease both;
        }
        .download-btn:hover {
          transform: translateY(-2px);
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(9, 84, 0, 0.12);
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#ffffff',
          fontFamily:
            "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        }}
      >
        {/* ============ HERO ============ */}
        <header
          style={{
            position: 'relative',
            background:
              'radial-gradient(circle at 15% 15%, #0c6e00 0%, #095400 50%, #063a00 100%)',
            padding: isMobile ? '30px 20px 90px' : '50px 40px 140px',
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          {/* Orbs */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '1180px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Breadcrumb */}
            <nav
              style={{
                fontSize: '0.8rem',
                marginBottom: isMobile ? '24px' : '40px',
                opacity: 0.8,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <Link href="/" legacyBehavior>
                <a
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Início
                </a>
              </Link>
              <span>/</span>
              <Link href="/ebook" legacyBehavior>
                <a
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Biblioteca
                </a>
              </Link>
              <span>/</span>
              <span style={{ opacity: 0.6 }}>{ebook.categoria}</span>
            </nav>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : 'minmax(280px, 360px) 1fr',
                gap: isMobile ? '36px' : '60px',
                alignItems: 'center',
              }}
            >
              {/* ========= CAPA 3D =========
                  Proporção exata 828/1170 → não corta a imagem.
                  Lombada + tilt 3D para efeito de livro físico. */}
              <div
                style={{
                  perspective: '1200px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: isMobile ? '260px' : '320px',
                    aspectRatio: '828 / 1170',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow:
                      '0 40px 70px rgba(0,0,0,0.55), 0 15px 30px rgba(0,0,0,0.35), -8px 8px 0 rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backgroundColor: '#f8f9fa',
                    transform: isMobile
                      ? 'none'
                      : 'rotateY(-10deg) rotateX(4deg)',
                    transition: 'transform 0.5s cubic-bezier(.2,.8,.2,1)',
                    position: 'relative',
                  }}
                  onMouseOver={(e) => {
                    if (!isMobile)
                      e.currentTarget.style.transform =
                        'rotateY(0deg) rotateX(0deg) scale(1.04)';
                  }}
                  onMouseOut={(e) => {
                    if (!isMobile)
                      e.currentTarget.style.transform =
                        'rotateY(-10deg) rotateX(4deg) scale(1)';
                  }}
                >
                  {/* Lombada */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '12px',
                      background:
                        'linear-gradient(to right, rgba(0,0,0,0.35), transparent)',
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}
                  />
                  {ebook.capa ? (
                    <img
                      src={ebook.capa}
                      alt={ebook.titulo}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                      }}
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
                        padding: '26px',
                        textAlign: 'center',
                        color: '#095400',
                        backgroundColor: '#fff',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '2px',
                          opacity: 0.6,
                          marginBottom: '14px',
                        }}
                      >
                        MARQUES VENDAS · EBOOK
                      </span>
                      <strong
                        style={{
                          fontSize: '1rem',
                          lineHeight: 1.35,
                          fontWeight: 700,
                        }}
                      >
                        {ebook.titulo}
                      </strong>
                      <div
                        style={{
                          marginTop: '20px',
                          width: '40px',
                          height: '3px',
                          backgroundColor: '#095400',
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* CONTEÚDO HERO */}
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '30px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    marginBottom: '20px',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  {ebook.categoria.toUpperCase()}
                </div>

                <h1
                  style={{
                    fontSize: isMobile ? '1.75rem' : '2.6rem',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    margin: '0 0 18px',
                    letterSpacing: '-1px',
                  }}
                >
                  {ebook.titulo}
                </h1>

                <p
                  style={{
                    fontSize: isMobile ? '0.98rem' : '1.1rem',
                    lineHeight: 1.6,
                    opacity: 0.9,
                    margin: '0 0 26px',
                    maxWidth: '600px',
                  }}
                >
                  {ebook.subtitulo}
                </p>

                {/* Meta pills */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '32px',
                  }}
                >
                  {[
                    { label: `${ebook.paginas} páginas` },
                    { label: `${ebook.tempoLeitura} de leitura` },
                    { label: dataFormatada },
                    { label: 'PDF gratuito' },
                  ].map((m, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '30px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                      }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>

                {/* BOTÕES — download + link produto (com produtoUrl correto) */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: '12px',
                    alignItems: isMobile ? 'stretch' : 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={handleDownload}
                    disabled={baixando}
                    className="download-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: isMobile ? '15px 30px' : '17px 40px',
                      backgroundColor: '#e74c3c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: isMobile ? '1rem' : '1.06rem',
                      fontWeight: 700,
                      cursor: baixando ? 'wait' : 'pointer',
                      boxShadow: '0 10px 24px rgba(231,76,60,0.45)',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.2px',
                    }}
                  >
                    <IconDownload size={18} color="#fff" />
                    {baixando ? 'Iniciando download...' : 'Baixar PDF gratuito'}
                  </button>

                  <a
                    href={ebook.produtoUrl || SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: isMobile ? '13px 26px' : '15px 30px',
                      backgroundColor: 'transparent',
                      color: '#fff',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontSize: isMobile ? '0.9rem' : '0.95rem',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255,255,255,0.1)';
                      e.currentTarget.style.borderColor = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.4)';
                    }}
                  >
                    Ver produto na loja
                    <span>→</span>
                  </a>
                </div>

                <p
                  style={{
                    marginTop: '14px',
                    fontSize: '0.78rem',
                    opacity: 0.7,
                  }}
                >
                  Download imediato · Sem cadastro · 100% gratuito
                </p>
              </div>
            </div>
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
              height: isMobile ? '35px' : '65px',
            }}
          >
            <path
              d="M0,50 C360,120 720,0 1080,50 C1260,75 1380,60 1440,50 L1440,100 L0,100 Z"
              fill="#ffffff"
            />
          </svg>
        </header>

        {/* ============ LAYOUT PRINCIPAL ============ */}
        <section
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            padding: isMobile ? '30px 16px 60px' : '60px 30px 100px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : 'minmax(0, 1fr) 340px',
              gap: isMobile ? '32px' : '60px',
              alignItems: 'start',
            }}
          >
            {/* ============ CONTEÚDO PRINCIPAL ============ */}
            <article className="fade-up">
              {/* SOBRE */}
              <section style={{ marginBottom: isMobile ? '38px' : '52px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '18px',
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      height: '24px',
                      backgroundColor: '#095400',
                      borderRadius: '2px',
                    }}
                  />
                  <h2
                    style={{
                      color: '#1a1a1a',
                      fontSize: isMobile ? '1.25rem' : '1.6rem',
                      fontWeight: 800,
                      margin: 0,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Sobre este material
                  </h2>
                </div>
                <p
                  style={{
                    fontSize: isMobile ? '0.95rem' : '1.02rem',
                    color: '#444',
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {ebook.descricao}
                </p>
              </section>

              {/* STATS GRID */}
              <section
                style={{
                  marginBottom: isMobile ? '38px' : '52px',
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? 'repeat(2, 1fr)'
                    : 'repeat(4, 1fr)',
                  gap: '14px',
                }}
              >
                {[
                  { valor: `${ebook.paginas}`, label: 'páginas' },
                  {
                    valor: ebook.tempoLeitura.split(' ')[0],
                    label: 'min leitura',
                  },
                  { valor: '100%', label: 'gratuito' },
                  { valor: 'PDF', label: 'formato' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="stat-card"
                    style={{
                      padding: isMobile ? '18px 12px' : '22px 18px',
                      backgroundColor: '#f8faf8',
                      borderRadius: '14px',
                      textAlign: 'center',
                      border: '1px solid #eef0ee',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: isMobile ? '1.5rem' : '1.8rem',
                        fontWeight: 800,
                        color: '#095400',
                        lineHeight: 1,
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {s.valor}
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#888',
                        marginTop: '6px',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </section>

              {/* O QUE VOCÊ VAI ENCONTRAR */}
              <section style={{ marginBottom: isMobile ? '38px' : '52px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      height: '24px',
                      backgroundColor: '#095400',
                      borderRadius: '2px',
                    }}
                  />
                  <h2
                    style={{
                      color: '#1a1a1a',
                      fontSize: isMobile ? '1.25rem' : '1.6rem',
                      fontWeight: 800,
                      margin: 0,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    O que você vai encontrar
                  </h2>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '12px',
                  }}
                >
                  {ebook.destaques.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: isMobile ? '14px 16px' : '16px 18px',
                        backgroundColor: '#fff',
                        border: '1px solid #eef0ee',
                        borderRadius: '12px',
                        transition: 'all 0.25s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div
                        style={{
                          flexShrink: 0,
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: '#e8f5e8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconCheck size={14} />
                      </div>
                      <span
                        style={{
                          fontSize: isMobile ? '0.88rem' : '0.92rem',
                          color: '#333',
                          lineHeight: 1.55,
                          fontWeight: 500,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* PARA QUEM É */}
              <section style={{ marginBottom: isMobile ? '38px' : '52px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      height: '24px',
                      backgroundColor: '#095400',
                      borderRadius: '2px',
                    }}
                  />
                  <h2
                    style={{
                      color: '#1a1a1a',
                      fontSize: isMobile ? '1.25rem' : '1.6rem',
                      fontWeight: 800,
                      margin: 0,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    Para quem é este material
                  </h2>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: '16px',
                  }}
                >
                  {[
                    {
                      titulo: 'Restaurantes',
                      desc: 'Padronize o preparo e ofereça pratos com consistência todos os dias.',
                    },
                    {
                      titulo: 'Revendedores',
                      desc: 'Conheça cada detalhe do produto para vender com confiança e argumento.',
                    },
                    {
                      titulo: 'Mercados',
                      desc: 'Estoque com segurança e saiba exatamente como conservar o produto.',
                    },
                  ].map((p, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '22px 20px',
                        backgroundColor: '#fff',
                        borderRadius: '14px',
                        border: '1px solid #eef0ee',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#095400',
                          margin: '0 0 8px',
                        }}
                      >
                        {p.titulo}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.88rem',
                          color: '#666',
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA MEIO */}
              <section
                style={{
                  padding: isMobile ? '24px 20px' : '32px 36px',
                  background:
                    'linear-gradient(135deg, #095400 0%, #0c6e00 100%)',
                  borderRadius: '18px',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'stretch' : 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  boxShadow: '0 10px 30px rgba(9,84,0,0.25)',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: isMobile ? '1.1rem' : '1.3rem',
                      fontWeight: 800,
                      margin: '0 0 6px',
                      letterSpacing: '-0.4px',
                    }}
                  >
                    Pronto para baixar?
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      opacity: 0.85,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Sem cadastro, sem espera. Clique e receba o PDF na hora.
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    backgroundColor: '#fff',
                    color: '#095400',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                  }}
                  onMouseOver={(e) =>
                    !isMobile &&
                    (e.currentTarget.style.transform = 'scale(1.05)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  <IconDownload size={16} color="#095400" />
                  Baixar PDF
                </button>
              </section>

              {/* TAGS */}
              {ebook.tags && ebook.tags.length > 0 && (
                <section style={{ marginTop: '32px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    {ebook.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '5px 14px',
                          backgroundColor: '#f5f7f5',
                          color: '#666',
                          borderRadius: '20px',
                          fontSize: '0.76rem',
                          fontWeight: 500,
                          border: '1px solid #eef0ee',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* ============ SIDEBAR ============ */}
            <aside
              className="fade-up"
              style={{
                position: isMobile ? 'static' : 'sticky',
                top: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* Card de download */}
              <div
                style={{
                  padding: '26px 24px',
                  background:
                    'linear-gradient(160deg, #ffffff 0%, #f8faf8 100%)',
                  border: '1px solid #eef0ee',
                  borderRadius: '18px',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.07)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px',
                  }}
                >
                  <IconBook size={20} color="#095400" />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#095400',
                      letterSpacing: '1.5px',
                    }}
                  >
                    EBOOK GRATUITO
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    color: '#1a1a1a',
                    margin: '0 0 12px',
                    fontWeight: 700,
                    lineHeight: 1.35,
                  }}
                >
                  {ebook.titulo}
                </h3>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: '#666',
                    lineHeight: 1.6,
                    margin: '0 0 20px',
                  }}
                >
                  PDF · {ebook.paginas} páginas · {ebook.tempoLeitura} de
                  leitura
                </div>
                <button
                  onClick={handleDownload}
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px',
                    backgroundColor: '#095400',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(9,84,0,0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) =>
                    !isMobile &&
                    (e.currentTarget.style.transform = 'translateY(-2px)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = 'translateY(0)')
                  }
                >
                  <IconDownload size={16} color="#fff" />
                  Baixar agora
                </button>
                <p
                  style={{
                    marginTop: '12px',
                    fontSize: '0.72rem',
                    color: '#999',
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  100% gratuito · Sem cadastro
                </p>
              </div>

              {/* Card CTA para o produto na loja oficial */}
              <div
                style={{
                  padding: '26px 24px',
                  background:
                    'linear-gradient(160deg, #095400 0%, #063a00 100%)',
                  borderRadius: '18px',
                  color: '#fff',
                  boxShadow: '0 10px 30px rgba(9,84,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  }}
                />
                <h3
                  style={{
                    fontSize: '1.05rem',
                    margin: '0 0 10px',
                    fontWeight: 800,
                    lineHeight: 1.3,
                    position: 'relative',
                  }}
                >
                  Conheça a loja Marques Vendas
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    opacity: 0.88,
                    margin: '0 0 18px',
                    position: 'relative',
                  }}
                >
                  Todos os produtos que você viu aqui estão disponíveis com
                  condições especiais para o seu negócio.
                </p>
                <a
                  href={ebook.produtoUrl || SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: '#fff',
                    color: '#095400',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Acessar loja
                  <span>→</span>
                </a>
              </div>
            </aside>
          </div>

          {/* ============ OUTROS EBOOKS ============ */}
          {outrosEbooks.length > 0 && (
            <section
              style={{
                marginTop: isMobile ? '60px' : '90px',
                paddingTop: isMobile ? '40px' : '60px',
                borderTop: '1px solid #eef0ee',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    width: '4px',
                    height: '24px',
                    backgroundColor: '#095400',
                    borderRadius: '2px',
                  }}
                />
                <h2
                  style={{
                    color: '#1a1a1a',
                    fontSize: isMobile ? '1.3rem' : '1.7rem',
                    fontWeight: 800,
                    margin: 0,
                    letterSpacing: '-0.5px',
                  }}
                >
                  Continue explorando
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? '1fr'
                    : 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                }}
              >
                {outrosEbooks.map((outro) => (
                  <Link
                    key={outro.slug}
                    href={`/ebook/${outro.slug}`}
                    passHref
                    legacyBehavior
                  >
                    <a
                      style={{
                        padding: '24px 22px',
                        backgroundColor: '#fff',
                        border: '1px solid #eef0ee',
                        borderRadius: '14px',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      }}
                      onMouseOver={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.transform =
                            'translateY(-4px)';
                          e.currentTarget.style.boxShadow =
                            '0 12px 28px rgba(9,84,0,0.1)';
                          e.currentTarget.style.borderColor = '#095400';
                        }
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0 2px 10px rgba(0,0,0,0.03)';
                        e.currentTarget.style.borderColor = '#eef0ee';
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: '#095400',
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {outro.categoria}
                      </span>
                      <h3
                        style={{
                          fontSize: '1rem',
                          color: '#1a1a1a',
                          margin: '8px 0 10px',
                          lineHeight: 1.35,
                          fontWeight: 700,
                        }}
                      >
                        {outro.titulo}
                      </h3>
                      <span
                        style={{
                          color: '#095400',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        Ver material <span>→</span>
                      </span>
                    </a>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </section>
      </div>
    </>
  );
}

// ====== SSG ======
export async function getStaticPaths() {
  return {
    paths: ebooks.map((e) => ({ params: { slug: e.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const ebook = ebooks.find((e) => e.slug === params.slug);
  if (!ebook) return { notFound: true };

  const outrosEbooks = ebooks.filter((e) => e.slug !== ebook.slug).slice(0, 3);

  return {
    props: {
      ebook: JSON.parse(JSON.stringify(ebook)),
      outrosEbooks: JSON.parse(JSON.stringify(outrosEbooks)),
    },
  };
}