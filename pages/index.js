import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  // Dados do carrossel com versões otimizadas para desktop e mobile
  const banners = [
    { 
      id: 1,
      desktop: 'https://i.imgur.com/MiXi0pu.png',
      mobile: 'https://i.imgur.com/E4Lsuky.png'
    },
    { 
      id: 2,
      desktop: 'https://i.imgur.com/0MUR4Yf.png',
      mobile: 'https://i.imgur.com/0MUR4Yf.png'
    },
    { 
      id: 3,
      desktop: 'https://i.imgur.com/ennvys5.png',
      mobile: 'https://i.imgur.com/J6hMBld.png'
    },
    { 
      id: 4,
      desktop: 'https://i.imgur.com/8toaBek.png',
      mobile: 'https://i.imgur.com/CAbEHOP.png'
    },
    { 
      id: 5,
      desktop: 'https://i.imgur.com/fRuEjY3.png',
      mobile: 'https://i.imgur.com/fRuEjY3.png'
    }
  ];

  // Estado do carrossel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 400 });
  const slideInterval = useRef(null);
  const carouselRef = useRef(null);

  // Verifica o tamanho da tela e calcula proporções
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (carouselRef.current) {
        const width = carouselRef.current.offsetWidth;
        const height = mobile ? width / 3 : Math.min(width / 3, 400);
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
    }, 5000); // Muda a cada 5 segundos
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(slideInterval.current);
  }, []);

  return (
    <>
      <Head>
        <title>Marques Vendas PMG - Distribuidora de Produtos de Qualidade</title>
        <meta name="description" content="Distribuidora autorizada com os melhores produtos para seu negócio. Qualidade garantida e atendimento especializado." />
      </Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
      }}>
        {/* Cabeçalho Premium (mantido igual) */}
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '30px 0',
          marginBottom: '10px'
        }}>
          <div style={{
            backgroundColor: '#095400',
            padding: '10px 25px',
            borderRadius: '30px',
            marginBottom: '15px',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            DISTRIBUIDOR AUTORIZADO
          </div>
          
          <img 
            src="https://i.imgur.com/8EagMV6.png" 
            alt="Marques Vendas PMG" 
            style={{ 
              width: '220px', 
              margin: '15px 0',
              filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.1))'
            }} 
          />
          
          <h1 style={{ 
            color: '#095400', 
            fontSize: '2rem',
            margin: '10px 0 15px',
            textAlign: 'center',
            fontWeight: '700',
            lineHeight: '1.3'
          }}>
            Soluções Comerciais <span style={{whiteSpace: 'nowrap'}}>para Seu Negócio</span>
          </h1>
          
          <p style={{ 
            color: '#555', 
            fontSize: '1rem',
            maxWidth: '600px',
            textAlign: 'center',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            Produtos de qualidade com garantia e procedência. Atendimento personalizado para revendedores e estabelecimentos comerciais.
          </p>
        </header>

        {/* Destaques de Credibilidade (mantido igual) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          margin: '30px 0'
        }}>
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            minWidth: '200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: '1.5rem', marginRight: '10px'}}>🚚</span>
            <div>
              <div style={{fontWeight: '600', fontSize: '0.9rem'}}>Entrega Rápida</div>
              <div style={{fontSize: '0.8rem', color: '#666'}}>Para toda região</div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            minWidth: '200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: '1.5rem', marginRight: '10px'}}>🏷️</span>
            <div>
              <div style={{fontWeight: '600', fontSize: '0.9rem'}}>Preço Competitivo</div>
              <div style={{fontSize: '0.8rem', color: '#666'}}>Melhores condições</div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            minWidth: '200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: '1.5rem', marginRight: '10px'}}>🛡️</span>
            <div>
              <div style={{fontWeight: '600', fontSize: '0.9rem'}}>Garantia</div>
              <div style={{fontSize: '0.8rem', color: '#666'}}>Produtos certificados</div>
            </div>
          </div>
        </div>

        {/* Carrossel Otimizado */}
        <div 
          ref={carouselRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: '40px auto',
            overflow: 'hidden',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            height: `${dimensions.height}px`,
            backgroundColor: '#f8f8f8' // Fundo para áreas não cobertas pela imagem
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
                    objectFit: 'contain', // Mantém a proporção sem cortar
                    display: 'block'
                  }}
                  loading="lazy" // Otimização de carregamento
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
              left: '15px',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            aria-label="Slide anterior"
          >
            <span style={{ fontSize: '20px', color: '#095400' }}>❮</span>
          </button>
          
          <button 
            onClick={goToNextSlide}
            style={{
              position: 'absolute',
              top: '50%',
              right: '15px',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            aria-label="Próximo slide"
          >
            <span style={{ fontSize: '20px', color: '#095400' }}>❯</span>
          </button>
          
          {/* Indicadores de slide */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 10
          }}>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: '10px',
                  height: '10px',
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

        {/* Restante do seu site (mantido igual) */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '40px 0'
        }}>
          <h2 style={{
            color: '#333',
            fontSize: '1.4rem',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Conheça Nossa Operação
          </h2>
          
          <div style={{
            width: '100%',
            maxWidth: '600px',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            <video 
              width="100%" 
              controls 
              autoPlay 
              muted 
              loop
              style={{
                display: 'block'
              }}
            >
              <source src="https://i.imgur.com/o4AZ76q.mp4" type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
          
          <p style={{
            color: '#666',
            fontSize: '0.9rem',
            maxWidth: '500px',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            Nossa estrutura preparada para atender sua demanda com agilidade e qualidade.
          </p>
        </section>

        <section style={{
          textAlign: 'center',
          margin: '50px 0',
          padding: '30px 20px',
          backgroundColor: '#f8faf8',
          borderRadius: '12px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            color: '#095400',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '15px'
          }}>
            Pronto para Melhorar Seu Estoque?
          </h2>
          
          <p style={{
            color: '#555',
            fontSize: '1rem',
            maxWidth: '600px',
            margin: '0 auto 25px',
            lineHeight: '1.6'
          }}>
            Acesse nosso catálogo completo de produtos selecionados para atender seu negócio.
          </p>
          
          <Link
            href="/produtos"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: '#095400',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 10px rgba(9, 84, 0, 0.3)',
              ':hover': {
                backgroundColor: '#0a6b00',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 15px rgba(9, 84, 0, 0.4)'
              }
            }}
          >
            FAÇA SEU PEDIDO →
          </Link>
        </section>

        <footer style={{
          marginTop: '50px',
          padding: '30px 20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.85rem',
          borderTop: '1px solid #eee'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <a href="#" style={{color: '#095400', textDecoration: 'none'}}>Termos de Uso</a>
            <a href="#" style={{color: '#095400', textDecoration: 'none'}}>Política de Privacidade</a>
            <a href="#" style={{color: '#095400', textDecoration: 'none'}}>Contato</a>
          </div>
          
          <p style={{margin: '5px 0'}}>
            © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
          </p>
          <p style={{margin: '5px 0', fontSize: '0.8rem', color: '#999'}}>
            • Endereço: Estrada Ferreira Guedes, 784 - Potuverá CEP: 06885-150 - Itapecerica da Serra - SP
          </p>
        </footer>
      </div>
    </>
  );
}
