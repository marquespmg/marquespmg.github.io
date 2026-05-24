import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import useTrackUser from '../hook/useTrackUser';

export default function Home() {
  useTrackUser(); // ← ADICIONE ESTA LINHA
  
  const banners = [
    { 
      id: 1,
      desktop: 'https://i.imgur.com/MiXi0pu.png',
      mobile: 'https://i.imgur.com/MiXi0pu.png'
    },
    { 
      id: 2,
      desktop: 'https://i.imgur.com/ivorfK2.png',
      mobile: 'https://i.imgur.com/ivorfK2.png'
    },
    { 
      id: 3,
      desktop: 'https://i.imgur.com/ennvys5.png',
      mobile: 'https://i.imgur.com/ennvys5.png'
    },
    { 
      id: 4,
      desktop: 'https://i.imgur.com/8toaBek.png',
      mobile: 'https://i.imgur.com/8toaBek.png'
    },
    { 
      id: 5,
      desktop: 'https://i.imgur.com/fRuEjY3.png',
      mobile: 'https://i.imgur.com/fRuEjY3.png'
    },
    { 
      id: 6,
      desktop: 'https://i.imgur.com/JD4UqWo.png',
      mobile: 'https://i.imgur.com/JD4UqWo.png'
    }
  ];

  // Dados das avaliações
  const avaliacoes = [
    // Femininas (8 avaliações)
    { 
      foto: "https://i.imgur.com/R4MCf34.png", 
      nome: "Ana", 
      texto: "Apesar de um pequeno atraso, o produto chegou perfeito e o preço compensou!", 
      estrelas: 4 
    },
    { 
      foto: "https://i.imgur.com/R4MCf34.png", 
      nome: "Claudia", 
      texto: "Site super fácil de usar e o atendimento foi super atencioso. Recomendo!", 
      estrelas: 5 
    },
    { 
      foto: "https://i.imgur.com/R4MCf34.png", 
      nome: "Fernanda", 
      texto: "Produto com qualidade acima do esperado pelo preço que paguei. Adorei!", 
      estrelas: 5 
    },
    { 
      foto: "https://i.imgur.com/R4MCf34.png", 
      nome: "Juliana", 
      texto: "Tive um problema com o pedido mas resolveram rapidinho. Ótimo serviço!", 
      estrelas: 4 
    },
    { 
      foto: "https://i.imgur.com/R4MCf34.png", 
      nome: "Patrícia", 
      texto: "Já é minha terceira compra e nunca me decepcionou. Entrega rápida!", 
      estrelas: 5 
    },
    { 
      foto: "https://i.imgur.com/R4MCf34.png", 
      nome: "Camila", 
      texto: "Produto exatamente como na descrição. Veio bem embalado e sem amassados.", 
      estrelas: 5 
    },
    { 
      foto: "https://i.imgur.com/R4MCf34.png", 
      nome: "Luana", 
      texto: "Adorei a variedade! Encontrar tudo num só lugar facilitou muito.", 
      estrelas: 5 
    },
    { 
      foto: "https://i.imgur.com/R4MCf34.png", 
      nome: "Mariana", 
      texto: "Preço justo e produto de qualidade. Virei cliente fiel!", 
      estrelas: 5 
    },
    // Masculinas (7 avaliações)
    { 
      foto: "https://i.imgur.com/CL3oucA.png", 
      nome: "Carlos", 
      texto: "Atendimento foi excelente! Tirou todas minhas dúvidas antes de eu comprar.", 
      estrelas: 5 
    },
    { 
      foto: "https://i.imgur.com/CL3oucA.png", 
      nome: "Ricardo", 
      texto: "Demorou um pouco mais que o previsto, mas o produto é top. Valeu a pena!", 
      estrelas: 4 
    },
    { 
      foto: "https://i.imgur.com/CL3oucA.png", 
      nome: "Bruno", 
      texto: "Produto chegou antes do prazo! Muito bem embalado e sem defeitos.", 
      estrelas: 5 
    },
    { 
      foto: "https://i.imgur.com/CL3oucA.png", 
      nome: "Lucas", 
      texto: "Não conhecia mas arrisquei e gostei bastante. Site organizado e fácil.", 
      estrelas: 4 
    },
    { 
      foto: "https://i.imgur.com/CL3oucA.png", 
      nome: "Marcos", 
      texto: "Preço imbatível! Consegui um ótimo negócio para meu comércio.", 
      estrelas: 5 
    },
    { 
      foto: "https://i.imgur.com/CL3oucA.png", 
      nome: "Gustavo", 
      texto: "Ótimo custo-benefício. Já indiquei para vários amigos!", 
      estrelas: 5 
    },
    { 
      foto: "https://i.imgur.com/CL3oucA.png", 
      nome: "Rodrigo", 
      texto: "Comprei com receio mas fui surpreendido pela qualidade. Recomendo!", 
      estrelas: 5 
    }
  ];

  // Estado do carrossel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 400 });
  const slideInterval = useRef(null);
  const carouselRef = useRef(null);
  const avaliacoesRef = useRef(null);

  // Estados para as notificações
  const [showFreteToast, setShowFreteToast] = useState(false);
  const [showWhatsappToast, setShowWhatsappToast] = useState(false);
  const toastTimers = useRef([]);

  // Verifica o tamanho da tela e calcula proporções
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (carouselRef.current) {
        const width = carouselRef.current.offsetWidth;
        // CORREÇÃO 1: Altura mínima para evitar espaço branco no app
        const height = mobile ? Math.min(width / 2, 250) : Math.min(width / 3, 400);
        setDimensions({ width, height });
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Navegação do carrossel
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    resetInterval();
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    resetInterval();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetInterval();
  };

  // Controle do intervalo automático
  const resetInterval = () => {
    clearInterval(slideInterval.current);
    startInterval();
  };

  const startInterval = () => {
    slideInterval.current = setInterval(() => {
      goToNextSlide();
    }, 5000);
  };

  // Configuração das notificações
  const showToast = (toastType) => {
    if (toastType === 'frete') {
      setShowFreteToast(true);
      const timer = setTimeout(() => {
        setShowFreteToast(false);
      }, 10000);
      toastTimers.current.push(timer);
    } else if (toastType === 'whatsapp') {
      setShowWhatsappToast(true);
      const timer = setTimeout(() => {
        setShowWhatsappToast(false);
      }, 10000);
      toastTimers.current.push(timer);
    }
  };

  const hideToast = (toastType) => {
    if (toastType === 'frete') {
      setShowFreteToast(false);
    } else if (toastType === 'whatsapp') {
      setShowWhatsappToast(false);
    }
  };

  // Iniciar temporizadores das notificações
  useEffect(() => {
    const freteTimer = setTimeout(() => {
      showToast('frete');
    }, 15000);

    const whatsappTimer = setTimeout(() => {
      showToast('whatsapp');
    }, 24000);

    toastTimers.current.push(freteTimer, whatsappTimer);

    return () => {
      clearInterval(slideInterval.current);
      toastTimers.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <>
      <Head>
        {/* Título Otimizado */}
        <title>Marques Vendas PMG - Distribuidora Food Service | Atacadista em Itapecerica da Serra</title>
        
        {/* Meta Description Otimizada */}
        <meta name="description" content="Distribuidora autorizada Marques Vendas PMG - Atacadista food service com produtos de qualidade para restaurantes, bares e mercados. Entrega rápida na região. Atendimento especializado." />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Charset */}
        <meta charSet="utf-8" />
        
        {/* Google Verification */}
        <meta name="google-site-verification" content="OM6ZA5lhy6ZCDjG8LU-PTFcF4QORtpkNh7f_JHt5Ctc" />
        
        {/* ========== OPEN GRAPH (Facebook/WhatsApp) ========== */}
        <meta property="og:title" content="Marques Vendas PMG - Distribuidora Food Service | Atacadista Autorizado" />
        <meta property="og:description" content="Distribuidora autorizada com produtos de qualidade para seu negócio. Entrega rápida e atendimento especializado." />
        <meta property="og:image" content="https://i.imgur.com/pBH5WpZ.png" />
        <meta property="og:url" content="https://www.marquesvendaspmg.shop" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Marques Vendas PMG" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Open Graph para o Vídeo */}
        <meta property="og:video" content="https://www.youtube.com/embed/xOPT4YXLV2E" />
        <meta property="og:video:type" content="text/html" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
        <meta property="og:video:secure_url" content="https://www.youtube.com/embed/xOPT4YXLV2E" />
        
        {/* ========== TWITTER CARD ========== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Marques Vendas PMG - Distribuidora Food Service" />
        <meta name="twitter:description" content="Distribuidora autorizada com produtos de qualidade para restaurantes, bares e mercados." />
        <meta name="twitter:image" content="https://i.imgur.com/pBH5WpZ.png" />
        <meta name="twitter:site" content="@marquesvendaspmg" />
        
        {/* ========== SCHEMA.ORG (Google Rich Results) ========== */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Marques Vendas PMG",
            "image": "https://i.imgur.com/jrERRsC.png",
            "description": "Distribuidora autorizada food service com produtos de qualidade para restaurantes, bares e mercados",
            "url": "https://www.marquesvendaspmg.shop",
            "telephone": "+55-11-91357-2902",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Estrada Ferreira Guedes, 784 - Potuverá",
              "addressLocality": "Itapecerica da Serra",
              "addressRegion": "SP",
              "postalCode": "06885-150",
              "addressCountry": "BR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "-23.7167",
              "longitude": "-46.8492"
            },
            "openingHours": "Mo-Fr 08:00-18:00, Sa 08:00-12:00",
            "priceRange": "$$",
            "areaServed": "Grande São Paulo",
            "sameAs": [
              "https://www.facebook.com/MarquesVendaspmg",
              "https://www.instagram.com/marquesvendaspmg",
              "https://www.youtube.com/@MarquesVendasPMG"
            ]
          })}
        </script>
        
        {/* Schema para Vídeo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "PMG Atacadista 2025 | 30 Anos Conectando Negócios, Confiança e Resultados",
            "description": "Há 30 anos a PMG Atacadista conecta negócios com confiança e resultados sólidos. Distribuidora food service em Itapecerica da Serra.",
            "thumbnailUrl": "https://img.youtube.com/vi/xOPT4YXLV2E/maxresdefault.jpg",
            "uploadDate": "2025-10-08T19:10:00-03:00",
            "duration": "PT3M20S",
            "contentUrl": "https://www.youtube.com/watch?v=xOPT4YXLV2E",
            "embedUrl": "https://www.youtube.com/embed/xOPT4YXLV2E",
            "publisher": {
              "@type": "Organization",
              "name": "Marques Vendas PMG",
              "logo": {
                "@type": "ImageObject",
                "url": "https://i.imgur.com/pBH5WpZ.png"
              }
            }
          })}
        </script>

        {/* Schema - Products */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Product",
                "name": "MUÇARELA BARI 4 KG",
                "description": "Queijo Muçarela Bari 4kg - Produto de alta qualidade para restaurantes, bares e mercados.",
                "category": "Derivados de Leite",
                "image": "https://i.imgur.com/J3OqbkZ.png",
                "brand": {
                  "@type": "Brand",
                  "name": "Bari"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "37"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "27.63",
                  "priceCurrency": "BRL",
                  "availability": "https://schema.org/InStock",
                  "priceValidUntil": "2026-01-25"
                }
              },
              {
                "@type": "Product",
                "name": "MUÇARELA TRÊS MARIAS RONDÔNIA OURO PRETO 4 KG",
                "description": "Queijo Muçarela Três Marias Rondônia Ouro Preto 4kg - Qualidade premium para food service.",
                "category": "Derivados de Leite",
                "image": "https://i.imgur.com/6I3X8vV.png",
                "brand": {
                  "@type": "Brand",
                  "name": "Três Marias"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "reviewCount": "25"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "35.28",
                  "priceCurrency": "BRL",
                  "availability": "https://schema.org/InStock",
                  "priceValidUntil": "2026-01-25"
                }
              }
            ]
          })}
        </script>
        
        {/* ========== KEYWORDS E OTIMIZAÇÕES EXTRAS ========== */}
        <meta name="keywords" content="distribuidora food service, atacadista itapecerica, produtos para restaurante, atacado bebidas, alimentos atacado, marques vendas pmg, distribuidora autorizada, atacadista grande sp" />
        <meta name="author" content="Marques Vendas PMG" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.marquesvendaspmg.shop" />
        
        {/* Sitemap */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        {/* Favicon */}
        <link rel="icon" href="https://i.imgur.com/pBH5WpZ.png" />
        
        {/* Theme Color para Mobile */}
        <meta name="theme-color" content="#095400" />
        <meta name="msapplication-TileColor" content="#095400" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="https://i.imgur.com/pBH5WpZ.png" />
      </Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '10px' : '20px',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        position: 'relative'
      }}>
        {/* Cabeçalho Premium - Adaptado para mobile */}
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '15px 0' : '30px 0',
          marginBottom: isMobile ? '5px' : '10px'
        }}>
          <div style={{
            backgroundColor: '#095400',
            padding: isMobile ? '8px 15px' : '10px 25px',
            borderRadius: '30px',
            marginBottom: isMobile ? '10px' : '15px',
            color: 'white',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: '600',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            Marques Vendas PMG
          </div>
          
          <img 
            src="https://i.imgur.com/pBH5WpZ.png" 
            alt="Marques Vendas PMG" 
            style={{ 
              width: isMobile ? '180px' : '220px',
              margin: isMobile ? '10px 0' : '15px 0',
              filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.1))'
            }} 
          />
          
          <h1 style={{ 
            color: '#095400', 
            fontSize: isMobile ? '1.5rem' : '2rem',
            margin: isMobile ? '5px 0 10px' : '10px 0 15px',
            textAlign: 'center',
            fontWeight: '700',
            lineHeight: '1.3',
            padding: isMobile ? '0 10px' : '0'
          }}>
            Marques Vendas PMG Distribuidora <span style={{whiteSpace: 'nowrap'}}>Food Service</span>
          </h1>
          
          <p style={{ 
            color: '#555', 
            fontSize: isMobile ? '0.9rem' : '1rem',
            maxWidth: '600px',
            textAlign: 'center',
            lineHeight: '1.6',
            marginBottom: isMobile ? '15px' : '20px',
            padding: isMobile ? '0 15px' : '0'
          }}>
            Produtos de qualidade com garantia e procedência. Atendimento personalizado para revendedores e estabelecimentos comerciais.
          </p>

          {/* BOTÃO DE OFERTAS */}
          <Link href="/ofertas" passHref legacyBehavior>
            <a style={{
              display: 'inline-block',
              padding: isMobile ? '12px 24px' : '12px 25px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '30px',
              fontSize: isMobile ? '0.95rem' : '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 3px 10px rgba(231, 76, 60, 0.3)',
              margin: isMobile ? '0 auto 10px' : '0 auto 10px',
              width: isMobile ? '90%' : 'auto',
              maxWidth: '400px',
              textAlign: 'center',
            }}>
              🔥 {isMobile ? 'OFERTAS DA SEMANA' : 'CONFIRA NOSSAS OFERTAS DA SEMANA!'}
            </a>
          </Link>

          {/* BOTÃO FOOD NEWS */}
          <Link href="/food-news" passHref legacyBehavior>
            <a style={{
              display: 'inline-block',
              padding: isMobile ? '12px 24px' : '12px 25px',
              backgroundColor: '#095400',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '30px',
              fontSize: isMobile ? '0.95rem' : '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 3px 10px rgba(9, 84, 0, 0.3)',
              margin: isMobile ? '0 auto 20px' : '0 auto 15px',
              width: isMobile ? '90%' : 'auto',
              maxWidth: '400px',
              textAlign: 'center',
            }}>
              📰 {isMobile ? 'FOOD NEWS' : 'ACESSE O FOOD NEWS - BLOG'}
            </a>
          </Link>
        </header>

        {/* CORREÇÃO 2: Destaques de Credibilidade - SEM QUEBRA DE LINHA */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '8px' : '15px',
          margin: isMobile ? '15px 0' : '30px 0',
          padding: isMobile ? '0 8px' : '0'
        }}>
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '8px 12px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            flex: isMobile ? '1 1 auto' : '0 0 auto',
            minWidth: isMobile ? 'auto' : '200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1rem' : '1.5rem', marginRight: isMobile ? '6px' : '10px'}}>🚚</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.75rem' : '0.9rem'}}>Entrega Rápida</div>
              <div style={{fontSize: isMobile ? '0.65rem' : '0.8rem', color: '#666'}}>Para toda região</div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '8px 12px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            flex: isMobile ? '1 1 auto' : '0 0 auto',
            minWidth: isMobile ? 'auto' : '200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1rem' : '1.5rem', marginRight: isMobile ? '6px' : '10px'}}>🏷️</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.75rem' : '0.9rem'}}>Preço Competitivo</div>
              <div style={{fontSize: isMobile ? '0.65rem' : '0.8rem', color: '#666'}}>Melhores condições</div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '8px 12px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            flex: isMobile ? '1 1 auto' : '0 0 auto',
            minWidth: isMobile ? 'auto' : '200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1rem' : '1.5rem', marginRight: isMobile ? '6px' : '10px'}}>🛡️</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.75rem' : '0.9rem'}}>Garantia</div>
              <div style={{fontSize: isMobile ? '0.65rem' : '0.8rem', color: '#666'}}>Produtos certificados</div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '8px 12px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            flex: isMobile ? '1 1 auto' : '0 0 auto',
            minWidth: isMobile ? 'auto' : '200px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1rem' : '1.5rem', marginRight: isMobile ? '6px' : '10px'}}>👨‍💼</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.75rem' : '0.9rem'}}>Atendimento</div>
              <div style={{fontSize: isMobile ? '0.65rem' : '0.8rem', color: '#666'}}>Personalizado</div>
            </div>
          </div>
        </div>

        {/* CORREÇÃO 3: Carrossel - ESPAÇO BRANCO CORRIGIDO */}
        <div 
          ref={carouselRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: isMobile ? '15px auto' : '40px auto',
            overflow: 'hidden',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            height: `${dimensions.height}px`,
            backgroundColor: '#f8f8f8'
          }}
        >
          <div style={{
            display: 'flex',
            transition: 'transform 0.5s ease',
            transform: `translateX(-${currentSlide * 100}%)`,
            height: '100%'
          }}>
            {banners.map((banner) => (
              <div 
                key={banner.id} 
                style={{
                  width: '100%',
                  flexShrink: 0,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img 
                  src={isMobile ? banner.mobile : banner.desktop}
                  alt={`Banner ${banner.id}`}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          
          {/* Botões de navegação */}
          <button 
            onClick={goToPrevSlide}
            style={{
              position: 'absolute',
              top: '50%',
              left: isMobile ? '5px' : '15px',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: isMobile ? '35px' : '40px',
              height: isMobile ? '35px' : '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            aria-label="Slide anterior"
          >
            <span style={{ fontSize: isMobile ? '16px' : '20px', color: '#095400' }}>❮</span>
          </button>
          
          <button 
            onClick={goToNextSlide}
            style={{
              position: 'absolute',
              top: '50%',
              right: isMobile ? '5px' : '15px',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: isMobile ? '35px' : '40px',
              height: isMobile ? '35px' : '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            aria-label="Próximo slide"
          >
            <span style={{ fontSize: isMobile ? '16px' : '20px', color: '#095400' }}>❯</span>
          </button>
          
          {/* Indicadores de slide */}
          <div style={{
            position: 'absolute',
            bottom: isMobile ? '10px' : '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: isMobile ? '6px' : '8px',
            zIndex: 10
          }}>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: isMobile ? '8px' : '10px',
                  height: isMobile ? '8px' : '10px',
                  borderRadius: '50%',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  backgroundColor: currentSlide === index ? '#095400' : 'rgba(255,255,255,0.5)',
                  transition: 'background-color 0.3s'
                }}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Seção "Conheça Nossa Operação" */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: isMobile ? '30px 0' : '60px 0',
          padding: isMobile ? '0 10px' : '0 20px'
        }}>
          <h2 style={{
            color: '#333',
            fontSize: isMobile ? '1.2rem' : '1.8rem',
            fontWeight: '600',
            marginBottom: isMobile ? '15px' : '30px',
            textAlign: 'center',
            padding: isMobile ? '0 10px' : '0'
          }}>
            Conheça Nossa Operação
          </h2>
          
          {/* Vídeo do YouTube */}
          <div style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '900px',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            marginBottom: isMobile ? '15px' : '30px',
            aspectRatio: '16/9'
          }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/xOPT4YXLV2E?autoplay=0&mute=0&rel=0&modestbranding=1&playsinline=1"
              title="PMG Atacadista 2025 | 30 Anos Conectando Negócios, Confiança e Resultados"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                display: 'block',
                border: 'none'
              }}
            />
          </div>

          {/* Texto descritivo para SEO - ESCONDIDO */}
          <div style={{ 
            maxWidth: '800px',
            marginTop: '20px',
            opacity: '0',
            height: '0',
            overflow: 'hidden',
            position: 'absolute'
          }}>
            <h3>PMG Atacadista 2025 | 30 Anos Conectando Negócios, Confiança e Resultados</h3>
            <p>Há 30 anos a PMG Atacadista conecta negócios com confiança e resultados sólidos. Distribuidora food service especializada em atacado para restaurantes, bares, mercados e estabelecimentos comerciais. Localizada em Itapecerica da Serra, atendemos toda a Grande São Paulo com entrega rápida e condições especiais para compras em atacado.</p>
          </div>
          
          <p style={{
            color: '#666',
            fontSize: isMobile ? '0.85rem' : '1rem',
            maxWidth: '600px',
            textAlign: 'center',
            lineHeight: '1.6',
            padding: isMobile ? '0 15px' : '0'
          }}>
            Nossa estrutura preparada para atender sua demanda com agilidade e qualidade.
          </p>
        </section>

        {/* Conteúdo SEO - ESCONDIDO */}
        <div style={{
          opacity: '0',
          height: '0',
          overflow: 'hidden',
          position: 'absolute',
          pointerEvents: 'none'
        }}>
          <h1>PMG Atacadista - Distribuidora e Atacadista em Itapecerica da Serra</h1>
          <h2>PMG Atacadista - 30 Anos no Mercado</h2>
          <p>A PMG Atacadista é uma distribuidora e atacadista localizada em Itapecerica da Serra, atendendo toda a Grande São Paulo.</p>
          <h3>PMG Atacadista Telefone e Contato</h3>
          <p>Telefone da PMG Atacadista: (11) 91357-2902. Endereço: Estrada Ferreira Guedes, 784 - Potuverá, Itapecerica da Serra - SP, CEP 06885-150.</p>
        </div>

        {/* Seção CTA */}
        <section style={{
          textAlign: 'center',
          margin: isMobile ? '30px 0' : '50px 0',
          padding: isMobile ? '25px 15px' : '35px 20px',
          backgroundColor: '#f0f8f0',
          borderRadius: '12px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
          width: '100%',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          border: '1px solid #e0f0e0',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{
              color: '#095400',
              fontSize: isMobile ? '1.4rem' : '1.8rem',
              fontWeight: '700',
              marginBottom: isMobile ? '15px' : '20px',
              lineHeight: '1.3'
            }}>
              Cadastre-se gratuitamente
            </h2>
            
            <p style={{
              color: '#444',
              fontSize: isMobile ? '1rem' : '1.1rem',
              margin: isMobile ? '0 auto 20px' : '0 auto 30px',
              lineHeight: '1.6',
              maxWidth: '95%'
            }}>
              Ganhe acesso completo ao nosso catálogo com condições especiais para seu negócio!
            </p>
            
            <Link href="/produtos" passHref legacyBehavior>
              <a 
                style={{
                  display: 'inline-block',
                  padding: isMobile ? '14px 30px' : '16px 40px',
                  backgroundColor: '#095400',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  fontWeight: '700',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(9, 84, 0, 0.3)',
                  marginBottom: '15px'
                }}
              >
                COMPRE AGORA →
              </a>
            </Link>

            <p style={{
              color: '#666',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              fontStyle: 'italic',
              margin: '10px 0 0 0'
            }}>
              Cadastro rápido e sem complicação. Leva menos de 2 minutos!
            </p>
          </div>
        </section>

        {/* CORREÇÃO 4: Seção de Avaliações - QUEBRA DE LINHA CORRIGIDA */}
        <section style={{
          margin: isMobile ? '20px 0' : '40px 0',
          padding: isMobile ? '0 8px' : '0 20px',
          width: '100%',
          overflow: 'hidden'
        }}>
          <h2 style={{
            color: '#095400',
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: isMobile ? '15px' : '25px'
          }}>
            O que nossos clientes dizem
          </h2>

          <div style={{
            position: 'relative',
            maxWidth: '100%',
            margin: '0 auto'
          }}>
            <div 
              ref={avaliacoesRef}
              style={{
                display: 'flex',
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                gap: '12px',
                padding: '10px 5px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {avaliacoes.map((avaliacao, index) => (
                <div key={index} style={{
                  minWidth: isMobile ? '280px' : '320px',
                  maxWidth: isMobile ? '280px' : '320px',
                  padding: '15px',
                  background: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  flexShrink: 0,
                  boxSizing: 'border-box'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '10px'
                  }}>
                    <img 
                      src={avaliacao.foto} 
                      alt={avaliacao.nome} 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        marginRight: '10px'
                      }} 
                    />
                    <div>
                      <h3 style={{ 
                        color: '#095400', 
                        fontSize: '0.9rem',
                        margin: '0 0 3px 0',
                        fontWeight: '600'
                      }}>
                        {avaliacao.nome}
                      </h3>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            style={{ 
                              color: i < avaliacao.estrelas ? '#FFD700' : '#e0e0e0',
                              fontSize: '14px'
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p style={{ 
                    color: '#555', 
                    fontSize: '0.85rem',
                    lineHeight: '1.4',
                    margin: 0,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}>
                    "{avaliacao.texto}"
                  </p>
                </div>
              ))}
            </div>

            {/* Botões de navegação */}
            <button 
              onClick={() => {
                const scrollAmount = isMobile ? 292 : 332;
                if (avaliacoesRef.current) {
                  avaliacoesRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '5px',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid #e0e0e0',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                zIndex: 2,
                color: '#095400',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
              aria-label="Avaliação anterior"
            >
              ❮
            </button>
            <button 
              onClick={() => {
                const scrollAmount = isMobile ? 292 : 332;
                if (avaliacoesRef.current) {
                  avaliacoesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
              }}
              style={{
                position: 'absolute',
                top: '50%',
                right: '5px',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid #e0e0e0',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                zIndex: 2,
                color: '#095400',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
              aria-label="Próxima avaliação"
            >
              ❯
            </button>
          </div>
        </section>

        {/* Rodapé */}
        <footer style={{
          marginTop: isMobile ? '40px' : '60px',
          padding: isMobile ? '25px 15px' : '40px 20px',
          textAlign: 'center',
          color: '#666',
          fontSize: isMobile ? '0.8rem' : '0.85rem',
          borderTop: '2px solid #095400',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 -2px 10px rgba(9, 84, 0, 0.1)'
        }}>
          <h3 style={{
            color: '#095400',
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
            <a href="/politica-de-privacidade" style={{ 
              color: '#095400', 
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: isMobile ? '0.8rem' : '0.85rem',
              padding: '12px 8px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span>🔒</span>
              {isMobile ? 'Privacidade' : 'Política de Privacidade'}
            </a>

            <Link href="/politica-devolucao-e-reembolso" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: isMobile ? '0.8rem' : '0.85rem',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <span>🔄</span>
                {isMobile ? 'Devolução' : 'Política de Devolução'}
              </a>
            </Link>

            <Link href="/termos" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: isMobile ? '0.8rem' : '0.85rem',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <span>📄</span>
                {isMobile ? 'Termos' : 'Termos de Uso'}
              </a>
            </Link>

            <Link href="/quem-somos" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: isMobile ? '0.8rem' : '0.85rem',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <span>👥</span>
                {isMobile ? 'Sobre' : 'Quem Somos'}
              </a>
            </Link>
          </div>

          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #095400, transparent)',
            margin: '20px auto',
            maxWidth: '300px'
          }}></div>

          <div style={{ 
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: isMobile ? '20px' : '25px',
              alignItems: 'center'
            }}>
              <a href="https://www.facebook.com/MarquesVendaspmg" target="_blank" rel="noopener noreferrer" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                padding: '6px'
              }}>
                <img src="https://i.imgur.com/prULUUA.png" alt="Facebook" style={{ width: '20px', height: '20px' }} />
              </a>
              <a href="https://www.instagram.com/marquesvendaspmg" target="_blank" rel="noopener noreferrer" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                padding: '6px'
              }}>
                <img src="https://i.imgur.com/I0ZZLjG.png" alt="Instagram" style={{ width: '20px', height: '20px' }} />
              </a>
              <a href="https://www.youtube.com/@MarquesVendasPMG" target="_blank" rel="noopener noreferrer" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                padding: '6px'
              }}>
                <img src="https://i.imgur.com/WfpZ8Gg.png" alt="YouTube" style={{ width: '20px', height: '20px' }} />
              </a>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                maxWidth: '800px',
                margin: '15px auto 20px auto',
                padding: '0 15px'
              }}>
                <p style={{
                  color: '#666',
                  fontSize: isMobile ? '0.75rem' : '0.85rem',
                  lineHeight: '1.5',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  margin: '0 0 15px 0'
                }}>
                  <strong>PMG Atacadista</strong> - Seu fornecedor de confiança em <strong>São Paulo</strong>. 
                  Especializados em <strong>atacado food service</strong> para restaurantes, bares e mercados. 
                  Atendemos <strong>Itapecerica da Serra, Grande SP, Sul de Minas Gerais e Sul do Rio de Janeiro</strong>.
                </p>
              </div>

              <p style={{ margin: '5px 0', fontSize: isMobile ? '0.8rem' : '0.85rem', color: '#666' }}>
                © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
              </p>
              
              <p style={{ margin: '5px 0', fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#999', lineHeight: '1.4' }}>
                • Endereço: Estrada Ferreira Guedes, 784 - Potuverá CEP: 06885-150 - Itapecerica da Serra - SP
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
