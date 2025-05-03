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
        const height = mobile ? width / 2 : Math.min(width / 3, 400);
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
        <title>Marques Vendas PMG - Distribuidora de Produtos de Qualidade</title>
        <meta name="description" content="Distribuidora autorizada com os melhores produtos para seu negócio. Qualidade garantida e atendimento especializado." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
            DISTRIBUIDOR AUTORIZADO
          </div>
          
          <img 
            src="https://i.imgur.com/8EagMV6.png" 
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
            Soluções Comerciais <span style={{whiteSpace: 'nowrap'}}>para Seu Negócio</span>
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
        </header>

        {/* Destaques de Credibilidade - Adaptado para mobile */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: isMobile ? '10px' : '15px',
          margin: isMobile ? '20px 0' : '30px 0',
          padding: isMobile ? '0 10px' : '0'
        }}>
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '10px 15px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            minWidth: isMobile ? 'unset' : '200px',
            flex: isMobile ? '1 1 120px' : '0 0 auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1.2rem' : '1.5rem', marginRight: isMobile ? '8px' : '10px'}}>🚚</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.8rem' : '0.9rem'}}>Entrega Rápida</div>
              <div style={{fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#666'}}>Para toda região</div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '10px 15px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            minWidth: isMobile ? 'unset' : '200px',
            flex: isMobile ? '1 1 120px' : '0 0 auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1.2rem' : '1.5rem', marginRight: isMobile ? '8px' : '10px'}}>🏷️</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.8rem' : '0.9rem'}}>Preço Competitivo</div>
              <div style={{fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#666'}}>Melhores condições</div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '10px 15px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            minWidth: isMobile ? 'unset' : '200px',
            flex: isMobile ? '1 1 120px' : '0 0 auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1.2rem' : '1.5rem', marginRight: isMobile ? '8px' : '10px'}}>🛡️</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.8rem' : '0.9rem'}}>Garantia</div>
              <div style={{fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#666'}}>Produtos certificados</div>
            </div>
          </div>
        </div>

        {/* Carrossel Otimizado - Melhorias para mobile */}
        <div 
          ref={carouselRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: isMobile ? '20px auto' : '40px auto',
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
          
          {/* Botões de navegação - Melhorados para mobile */}
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
          
          {/* Indicadores de slide - Melhorados para mobile */}
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

{/* Seção "Conheça Nossa Operação" - Adaptada para mobile */}
<section style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: isMobile ? '30px 0' : '40px 0',
  padding: isMobile ? '0 10px' : '0'
}}>
  <h2 style={{
    color: '#333',
    fontSize: isMobile ? '1.2rem' : '1.4rem',
    fontWeight: '600',
    marginBottom: isMobile ? '15px' : '20px',
    textAlign: 'center',
    padding: isMobile ? '0 10px' : '0'
  }}>
    Conheça Nossa Operação
  </h2>
  
  <div style={{
    width: '100%',
    maxWidth: '900px', // Tamanho maior para a tela do PC
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    marginBottom: isMobile ? '15px' : '20px',
    position: 'relative',
    height: 'auto', // Ajuste a altura para manter a proporção 16:9
  }}>
    <video 
      width="100%" 
      controls 
      autoPlay 
      muted 
      loop
      style={{
        display: 'block',
        width: '100%', // Largura ocupa toda a tela
        height: 'auto', // A altura se ajusta automaticamente para manter a proporção
        objectFit: 'contain', // Garante que o vídeo seja exibido inteiro, sem cortar
        borderRadius: '10px', // Mantém a borda arredondada
      }}
    >
      <source src="https://i.imgur.com/7Xk0OYG.mp4" type="video/mp4" />
      Seu navegador não suporta a tag de vídeo.
    </video>
  </div>
  
  <p style={{
    color: '#666',
    fontSize: isMobile ? '0.85rem' : '0.9rem',
    maxWidth: '500px',
    textAlign: 'center',
    lineHeight: '1.6',
    padding: isMobile ? '0 15px' : '0'
  }}>
    Nossa estrutura preparada para atender sua demanda com agilidade e qualidade.
  </p>
</section>

        {/* Seção CTA - Adaptada para mobile */}
        <section style={{
          textAlign: 'center',
          margin: isMobile ? '30px 0' : '50px 0',
          padding: isMobile ? '20px 15px' : '30px 20px',
          backgroundColor: '#f8faf8',
          borderRadius: '12px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
          width: isMobile ? 'calc(100% - 20px)' : 'auto',
          marginLeft: isMobile ? '10px' : 'auto',
          marginRight: isMobile ? '10px' : 'auto'
        }}>
          <h2 style={{
            color: '#095400',
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            fontWeight: '600',
            marginBottom: isMobile ? '10px' : '15px'
          }}>
            Pronto para Melhorar Seu Estoque?
          </h2>
          
          <p style={{
            color: '#555',
            fontSize: isMobile ? '0.9rem' : '1rem',
            maxWidth: '600px',
            margin: isMobile ? '0 auto 15px' : '0 auto 25px',
            lineHeight: '1.6',
            padding: isMobile ? '0 10px' : '0'
          }}>
            Acesse nosso catálogo completo de produtos selecionados para atender seu negócio.
          </p>
          
          <Link
            href="/produtos"
            style={{
              display: 'inline-block',
              padding: isMobile ? '12px 24px' : '14px 32px',
              backgroundColor: '#095400',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: isMobile ? '0.9rem' : '1rem',
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

        {/* Seção de Avaliações */}
{/* Seção de Avaliações - Versão Otimizada */}
<section style={{
  margin: isMobile ? '20px 0' : '40px 0',
  padding: isMobile ? '0 10px' : '0 20px',
  width: '100%',
  overflow: 'hidden'
}}>
  <h2 style={{
    color: '#095400',
    fontSize: isMobile ? '1.3rem' : '1.5rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: isMobile ? '15px' : '25px',
    padding: '0 15px'
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
        gap: '15px',
        padding: '10px',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE/Edge */
        '&::-webkit-scrollbar': {
          display: 'none' /* Chrome/Safari */
        }
      }}
    >
      {avaliacoes.map((avaliacao, index) => (
        <div key={index} style={{
          minWidth: isMobile ? '85vw' : '28vw',
          maxWidth: isMobile ? '85vw' : '28vw',
          padding: '20px',
          background: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          flexShrink: 0,
          boxSizing: 'border-box'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}>
            <img 
              src={avaliacao.foto} 
              alt={avaliacao.nome} 
              style={{ 
                width: '45px', 
                height: '45px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                marginRight: '10px'
              }} 
            />
            <div>
              <h3 style={{ 
                color: '#095400', 
                fontSize: isMobile ? '0.95rem' : '1rem',
                margin: '0 0 3px 0',
                fontWeight: '600'
              }}>
                {avaliacao.nome}
              </h3>
              <div style={{ 
                display: 'flex',
                gap: '2px'
              }}>
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    style={{ 
                      color: i < avaliacao.estrelas ? '#FFD700' : '#e0e0e0',
                      fontSize: isMobile ? '16px' : '18px',
                      lineHeight: '1'
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
            fontSize: isMobile ? '0.88rem' : '0.92rem',
            lineHeight: '1.5',
            margin: 0,
            wordBreak: 'break-word',
            hyphens: 'auto'
          }}>
            "{avaliacao.texto}"
          </p>
        </div>
      ))}
    </div>

    {/* Botões de Navegação - Estilo Melhorado */}
    <button 
      onClick={() => {
        const scrollAmount = isMobile ? window.innerWidth * 0.85 : window.innerWidth * 0.28;
        avaliacoesRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }}
      style={{
        position: 'absolute',
        top: '50%',
        left: isMobile ? '5px' : '10px',
        transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid #e0e0e0',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        zIndex: 2,
        color: '#095400',
        fontSize: '18px',
        fontWeight: 'bold'
      }}
      aria-label="Avaliação anterior"
    >
      ❮
    </button>
    <button 
      onClick={() => {
        const scrollAmount = isMobile ? window.innerWidth * 0.85 : window.innerWidth * 0.28;
        avaliacoesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }}
      style={{
        position: 'absolute',
        top: '50%',
        right: isMobile ? '5px' : '10px',
        transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid #e0e0e0',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        zIndex: 2,
        color: '#095400',
        fontSize: '18px',
        fontWeight: 'bold'
      }}
      aria-label="Próxima avaliação"
    >
      ❯
    </button>
  </div>
</section>

        {/* Rodapé - Adaptado para mobile */}
        <footer style={{
          marginTop: isMobile ? '30px' : '50px',
          padding: isMobile ? '20px 15px' : '30px 20px',
          textAlign: 'center',
          color: '#666',
          fontSize: isMobile ? '0.8rem' : '0.85rem',
          borderTop: '1px solid #eee'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '15px' : '20px',
            marginBottom: isMobile ? '15px' : '20px',
            flexWrap: 'wrap'
          }}>
            <a href="#" style={{color: '#095400', textDecoration: 'none', fontSize: isMobile ? '0.8rem' : '0.85rem'}}>Termos de Uso</a>
            <a href="#" style={{color: '#095400', textDecoration: 'none', fontSize: isMobile ? '0.8rem' : '0.85rem'}}>Política de Privacidade</a>
            <a href="#" style={{color: '#095400', textDecoration: 'none', fontSize: isMobile ? '0.8rem' : '0.85rem'}}>Contato</a>
          </div>
          
          <p style={{margin: '5px 0', fontSize: isMobile ? '0.8rem' : '0.85rem'}}>
            © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
          </p>
          <p style={{margin: '5px 0', fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#999'}}>
            • Endereço: Estrada Ferreira Guedes, 784 - Potuverá CEP: 06885-150 - Itapecerica da Serra - SP
          </p>
        </footer>

        {/* Notificações - Estilo e Componentes */}
        <style jsx>{`
          /* Estilo das Notificações */
          .promo-toast {
            position: fixed;
            bottom: ${isMobile ? '10px' : '20px'};
            right: ${isMobile ? '10px' : '20px'};
            background: #fff;
            border-left: 4px solid #2ecc71;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            padding: ${isMobile ? '12px' : '16px'};
            max-width: ${isMobile ? '280px' : '320px'};
            opacity: 0;
            transform: translateX(20px);
            transition: opacity 0.4s, transform 0.4s;
            z-index: 1000;
            font-family: 'Arial', sans-serif;
            display: flex;
            gap: ${isMobile ? '8px' : '12px'};
          }
          .promo-toast.show {
            opacity: 1;
            transform: translateX(0);
          }
          .promo-toast .icon {
            font-size: ${isMobile ? '20px' : '24px'};
            margin-top: 2px;
          }
          .promo-toast .content {
            flex: 1;
          }
          .promo-toast .close-btn {
            background: none;
            border: none;
            font-size: ${isMobile ? '16px' : '18px'};
            cursor: pointer;
            color: #95a5a6;
            align-self: flex-start;
          }
          .promo-toast h4 {
            margin: 0 0 ${isMobile ? '6px' : '8px'} 0;
            color: #2c3e50;
            font-size: ${isMobile ? '14px' : '16px'};
            font-weight: 700;
          }
          .promo-toast p {
            margin: 0;
            color: #7f8c8d;
            font-size: ${isMobile ? '12px' : '14px'};
            line-height: 1.4;
          }
          .promo-toast .highlight {
            color: #e74c3c;
            font-weight: bold;
          }
          .promo-toast .whatsapp-btn {
            display: inline-block;
            margin-top: ${isMobile ? '8px' : '12px'};
            background: #25D366;
            color: white;
            padding: ${isMobile ? '6px 10px' : '8px 12px'};
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            font-size: ${isMobile ? '12px' : '13px'};
          }
          .promo-toast .whatsapp-btn:hover {
            background: #128C7E;
          }
        `}</style>

        {/* Notificação 1: Frete Grátis */}
        <div className={`promo-toast ${showFreteToast ? 'show' : ''}`}>
          <div className="icon">🔔</div>
          <div className="content">
            <button className="close-btn" onClick={() => hideToast('frete')}>×</button>
            <h4>Frete GRÁTIS e Pague só na entrega!</h4>
            <p>Sem risco, sem enrolação. Receba seus produtos e <span className="highlight">pague só quando chegar</span>. Aproveite agora!</p>
          </div>
        </div>

        {/* Notificação 2: WhatsApp */}
        <div className={`promo-toast ${showWhatsappToast ? 'show' : ''}`}>
          <div className="icon">📦</div>
          <div className="content">
            <button className="close-btn" onClick={() => hideToast('whatsapp')}>×</button>
            <h4>Entregamos em até 48h!</h4>
            <p>Tá com dúvida? Fala direto com a gente no WhatsApp 👉 <span className="highlight">(11) 91357-2902</span></p>
            <a href="https://wa.me/5511913572902" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">CHAMAR NO WHATSAPP</a>
          </div>
        </div>
      </div>
    </>
  );
}
