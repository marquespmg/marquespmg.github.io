import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import useTrackUser from '../hook/useTrackUser'; // ← ADICIONE ESTA LINHA

// Mapeamento das fotos por seção
const sections = [
  {
    id: 'entrada',
    title: 'Acesso ao Centro de Distribuição',
    subtitle: 'Localização Estratégica em Itapecerica da Serra',
    description: 'Nosso Centro de Distribuição está localizado em um condomínio empresarial estrategicamente posicionado na Estrada Ferreira Guedes. Este é o coração da nossa operação logística, onde recebemos e expedimos mercadorias com agilidade e segurança para atender toda a região metropolitana e além.',
    photos: [
      {
        src: '/FotosdaEntrada1.jpeg',
        alt: 'Entrada do condomínio empresarial onde está localizado o CD da PMG Atacadista em Itapecerica da Serra',
        text: 'Esta é a entrada do condomínio empresarial que abriga o Centro de Distribuição da PMG Atacadista. A localização estratégica na Estrada Ferreira Guedes proporciona acesso rápido às principais vias da região, facilitando o fluxo de caminhões e veículos de carga. O condomínio oferece estrutura completa com segurança 24 horas, garantindo a proteção das operações e a tranquilidade de nossos colaboradores e parceiros.'
      },
      {
        src: '/FotosdaEntrada2.jpeg',
        alt: 'Portão de acesso ao condomínio empresarial da PMG Atacadista em Itapecerica da Serra',
        text: 'O portão de acesso ao condomínio empresarial é o ponto de partida para todas as operações da PMG Atacadista. Com amplo espaço para manobra e acesso controlado, garantimos que apenas veículos autorizados entrem nas dependências do CD. É importante ressaltar que este é um Centro de Distribuição exclusivo para operações logísticas - não realizamos retirada de mercadorias no local, pois nossa estrutura foi projetada para atender com máxima eficiência o fluxo de carregamento e distribuição para toda a região.'
      }
    ]
  },
  {
    id: 'docas',
    title: 'Docas de Carregamento',
    subtitle: 'Infraestrutura Moderna para Logística de Alta Performance',
    description: 'Dentro do nosso Centro de Distribuição, as docas de carregamento representam o coração da nossa operação logística. Projetadas para atender demandas de alta rotatividade, contamos com equipamentos modernos que garantem agilidade no embarque e desembarque de mercadorias, otimizando cada etapa do processo.',
    photos: [
      {
        src: '/FotosdasDocas1.jpeg',
        alt: 'Doca de carregamento do Centro de Distribuição da PMG Atacadista em Itapecerica da Serra',
        text: 'Nossas docas são equipadas com niveladores hidráulicos de última geração, tecnologia que permite o ajuste preciso para caminhões de diferentes portes. Esta infraestrutura elimina barreiras e acelera o processo de carregamento, garantindo que sua mercadoria saia rapidamente do nosso CD. A segurança e a ergonomia foram prioridades no design desta estrutura, protegendo tanto nossa equipe quanto os produtos transportados em cada operação.'
      },
      {
        src: '/FotosdasDocas2.jpeg',
        alt: 'Área de expedição do Centro de Distribuição da PMG Atacadista',
        text: 'Nossa área de expedição é um exemplo de organização e eficiência operacional. Cada produto passa por rigoroso processo de conferência antes de seguir para o carregamento. Este controle de qualidade assegura que cada pedido chegue ao destino final em perfeitas condições, refletindo o compromisso da PMG Atacadista com a excelência no atendimento e a satisfação total dos nossos clientes em toda a região atendida.'
      },
      {
        src: '/FotosdasDocas3.jpeg',
        alt: 'Visão panorâmica das docas do Centro de Distribuição da PMG Atacadista',
        text: 'Esta visão panorâmica revela a amplitude da nossa operação logística dentro do condomínio empresarial. As docas foram estrategicamente posicionadas para permitir fluxo contínuo de veículos, evitando gargalos e otimizando o tempo de cada operação. A área de manobra é generosa, permitindo que caminhões de grande porte realizem manobras com total segurança. Tudo isso reflete nosso planejamento meticuloso para atender com excelência os mais de 30 anos de tradição da PMG Atacadista no mercado de distribuição food service.'
      }
    ]
  },
  {
    id: 'estoque',
    title: 'Estoque e Separação',
    subtitle: 'Organização, Tecnologia e Equipe Especializada',
    description: 'Nosso Centro de Distribuição é o coração da PMG Atacadista. Aqui, mais de 30 anos de experiência se traduzem em processos eficientes, estoque organizado e uma equipe altamente capacitada para separar sua mercadoria com agilidade e precisão. Cada produto é tratado com o cuidado que você espera de um parceiro de confiança.',
    photos: [
      {
        src: '/FotosdoEstoque1.jpeg',
        alt: 'Visão geral do estoque organizado do Centro de Distribuição da PMG Atacadista',
        text: 'Bem-vindo ao coração da PMG Atacadista! Esta imagem revela a magnitude e a organização do nosso Centro de Distribuição. Com corredores amplos e sinalizados, nosso estoque foi planejado para garantir máxima eficiência na localização e separação de produtos. Cada prateleira, cada corredor, foi pensado para otimizar o tempo de resposta e garantir que seu pedido seja preparado com a agilidade que seu negócio exige. Esta é a estrutura que sustenta mais de três décadas de confiança e resultados no mercado atacadista.'
      },
      {
        src: '/FotosdoEstoque2.jpeg',
        alt: 'Equipe de separação trabalhando no Centro de Distribuição da PMG Atacadista',
        text: 'Nossa equipe de separação é o verdadeiro diferencial da PMG Atacadista. Profissionais experientes e treinados, que conhecem cada produto e cada detalhe da nossa operação. Observe a atenção e o cuidado com que cada item é manuseado - este é o padrão PMG de qualidade. Nossos colaboradores são especialistas em identificar, separar e preparar sua mercadoria com precisão cirúrgica, garantindo que cada pedido saia perfeito do nosso CD. Eles são a alma da nossa operação e o motivo pelo qual somos referência em food service na região.'
      },
      {
        src: '/FotosdoEstoque3.jpeg',
        alt: 'Produtos organizados por categoria no Centro de Distribuição da PMG Atacadista',
        text: 'A organização por categorias é um dos pilares da nossa eficiência operacional. Observe como cada produto está estrategicamente posicionado, facilitando a localização rápida e a separação ágil. Este método inteligente de organização reduz significativamente o tempo de preparação dos pedidos, permitindo que sua mercadoria seja despachada com velocidade e precisão. Na PMG Atacadista, acreditamos que um estoque bem organizado é o primeiro passo para um atendimento excepcional.'
      },
      {
        src: '/FotosdoEstoque4.jpeg',
        alt: 'Sistema de prateleiras moderno do Centro de Distribuição da PMG Atacadista',
        text: 'Nosso sistema de prateleiras moderno foi projetado para maximizar o espaço e garantir fácil acesso a todos os produtos. Cada item é devidamente etiquetado e posicionado seguindo um rigoroso critério de classificação, o que permite à nossa equipe localizar qualquer produto em segundos. Esta eficiência não é por acaso - é o resultado de décadas de aprimoramento e investimento em infraestrutura, sempre pensando em oferecer o melhor atendimento para nossos clientes.'
      },
      {
        src: '/FotosdoEstoque5.jpeg',
        alt: 'Equipe preparando pedidos no Centro de Distribuição da PMG Atacadista',
        text: 'Este é o momento em que todo o planejamento se transforma em resultado! Nossa equipe trabalha com dedicação e precisão para preparar cada pedido como se fosse o mais importante - porque para nós, cada cliente é único e merece atenção especializada. Observe a agilidade e o profissionalismo com que cada mercadoria é separada, conferida e encaminhada para expedição. Este é o compromisso da PMG Atacadista: transformar sua necessidade em solução, com a qualidade que só uma empresa com mais de 30 anos de experiência pode oferecer.'
      },
      {
        src: '/FotosdoEstoque6.jpeg',
        alt: 'Controle de inventário no Centro de Distribuição da PMG Atacadista',
        text: 'O controle de inventário é uma arte que dominamos há três décadas. Nossa equipe utiliza sistemas modernos de gestão para acompanhar cada movimento do estoque, garantindo precisão absoluta nas quantidades e na localização de cada produto. Este rigoroso controle nos permite afirmar com segurança: se está no nosso sistema, está disponível no nosso estoque. Transparência, confiabilidade e eficiência - estes são os valores que guiam cada operação na PMG Atacadista.'
      },
      {
        src: '/FotosdoEstoque7.jpeg',
        alt: 'Área de conferência e embalagem do Centro de Distribuição da PMG Atacadista',
        text: 'A conferência final é o último e mais importante passo antes do seu produto seguir viagem. Nesta área dedicada, cada pedido é minuciosamente verificado, garantindo que todos os itens estejam corretos e em perfeitas condições. A embalagem é realizada com materiais de qualidade, protegendo sua mercadoria durante todo o trajeto até seu destino. Na PMG Atacadista, a satisfação do cliente é nossa maior prioridade - e isso começa com a certeza de que cada pedido sai do nosso CD com a qualidade e o cuidado que você merece.'
      }
    ]
  }
];

export default function PMGOperacao() {
  useTrackUser(); // ← ADICIONE ESTA LINHA
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState({});
  const [activeSection, setActiveSection] = useState('entrada');

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getIndex = (sectionId) => currentIndex[sectionId] || 0;
  const totalPhotos = (sectionId) => sections.find(s => s.id === sectionId).photos.length;

  const nextPhoto = (sectionId) => {
    const total = totalPhotos(sectionId);
    const current = getIndex(sectionId);
    setCurrentIndex(prev => ({
      ...prev,
      [sectionId]: (current + 1) % total
    }));
  };

  const prevPhoto = (sectionId) => {
    const total = totalPhotos(sectionId);
    const current = getIndex(sectionId);
    setCurrentIndex(prev => ({
      ...prev,
      [sectionId]: (current - 1 + total) % total
    }));
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveSection(sectionId);
    if (!currentIndex[sectionId]) {
      setCurrentIndex(prev => ({ ...prev, [sectionId]: 0 }));
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);
  const currentPhotoIndex = getIndex(activeSection);
  const currentPhoto = currentSection.photos[currentPhotoIndex];

  return (
    <>
      <Head>
        <title>Centro de Distribuição PMG Atacadista | Estrutura e Estoque em Itapecerica da Serra</title>
        <meta name="description" content="Conheça o Centro de Distribuição da PMG Atacadista em Itapecerica da Serra. Veja fotos do nosso estoque, docas e equipe de separação. Distribuidora food service com mais de 30 anos de experiência." />
        <meta name="keywords" content="PMG Atacadista, Centro de Distribuição PMG, fotos estoque PMG, estrutura PMG, docas PMG, atacadista Itapecerica da Serra, distribuidora food service" />
        <meta property="og:title" content="Centro de Distribuição PMG Atacadista - Estrutura e Estoque" />
        <meta property="og:description" content="Conheça nosso Centro de Distribuição em Itapecerica da Serra - SP. Veja fotos do estoque, docas e equipe da PMG Atacadista." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.marquesvendaspmg.shop/pmg-operacao" />
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

        {/* ===== CABEÇALHO ===== */}
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
            alt="Marques Vendas PMG - Distribuidora Food Service" 
            style={{ 
              width: isMobile ? '180px' : '220px',
              margin: isMobile ? '10px 0' : '15px 0',
              filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.1))'
            }} 
          />
          
          <h1 style={{ 
            color: '#095400', 
            fontSize: isMobile ? '1.5rem' : '2.2rem',
            margin: isMobile ? '5px 0 10px' : '10px 0 15px',
            textAlign: 'center',
            fontWeight: '700',
            lineHeight: '1.3',
            padding: isMobile ? '0 10px' : '0'
          }}>
            Conheça Nosso Centro de Distribuição
          </h1>
          
          <p style={{ 
            color: '#555', 
            fontSize: isMobile ? '0.95rem' : '1.1rem',
            maxWidth: '700px',
            textAlign: 'center',
            lineHeight: '1.7',
            marginBottom: isMobile ? '15px' : '20px',
            padding: isMobile ? '0 15px' : '0'
          }}>
            Há mais de 30 anos conectando negócios com confiança e resultados sólidos. 
            Conheça nosso Centro de Distribuição em Itapecerica da Serra - SP.
          </p>

          <Link href="/" passHref legacyBehavior>
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
              margin: isMobile ? '0 auto 10px' : '0 auto 10px',
              width: isMobile ? '90%' : 'auto',
              maxWidth: '400px',
              textAlign: 'center',
            }}>
              ← Voltar para a Home
            </a>
          </Link>
        </header>

        {/* ===== NAVEGAÇÃO ENTRE SEÇÕES (ÂNCORAS) ===== */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: isMobile ? '8px' : '12px',
          margin: isMobile ? '15px 0 25px' : '25px 0 35px',
          padding: isMobile ? '0 5px' : '0'
        }}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              style={{
                padding: isMobile ? '10px 16px' : '12px 24px',
                borderRadius: '30px',
                border: 'none',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: activeSection === section.id ? '#095400' : '#f0f0f0',
                color: activeSection === section.id ? '#fff' : '#333',
                boxShadow: activeSection === section.id ? '0 3px 10px rgba(9, 84, 0, 0.3)' : 'none',
                flex: isMobile ? '1 1 auto' : '0 1 auto'
              }}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* ===== SEÇÕES EM ROLAGEM ===== */}
        {sections.map((section) => {
          const sectionIndex = getIndex(section.id);
          const sectionPhoto = section.photos[sectionIndex];

          return (
            <div 
              key={section.id}
              id={`section-${section.id}`}
              style={{
                backgroundColor: '#f8f8f8',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                marginBottom: '40px',
                scrollMarginTop: '20px',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Cabeçalho da seção */}
              <div style={{
                background: 'linear-gradient(135deg, #095400 0%, #0a7a00 100%)',
                padding: isMobile ? '18px 20px' : '25px 30px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Elemento decorativo */}
                <div style={{
                  position: 'absolute',
                  right: '-50px',
                  top: '-50px',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  pointerEvents: 'none'
                }} />
                
                <h2 style={{
                  fontSize: isMobile ? '1.3rem' : '1.8rem',
                  fontWeight: '700',
                  margin: '0 0 5px 0',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {section.title}
                </h2>
                <h3 style={{
                  fontSize: isMobile ? '1rem' : '1.2rem',
                  fontWeight: '400',
                  color: '#c8e6c9',
                  margin: '0 0 10px 0',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {section.subtitle}
                </h3>
                <p style={{
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  color: '#e8f5e9',
                  margin: 0,
                  maxWidth: '700px',
                  lineHeight: '1.6',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {section.description}
                </p>
              </div>

              {/* Conteúdo do carrossel */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                padding: isMobile ? '10px' : '20px',
                gap: isMobile ? '15px' : '20px',
                backgroundColor: '#fafafa'
              }}>
                {/* Imagem com controles */}
                <div style={{
                  flex: isMobile ? '1' : '3',
                  position: 'relative',
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  minHeight: isMobile ? '250px' : '420px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  <img 
                    src={sectionPhoto.src}
                    alt={sectionPhoto.alt}
                    style={{
                      maxWidth: '100%',
                      maxHeight: isMobile ? '250px' : '420px',
                      objectFit: 'contain',
                      display: 'block',
                      transition: 'opacity 0.3s ease'
                    }}
                    loading="lazy"
                  />

                  {/* Controles com efeito hover */}
                  <button 
                    onClick={() => prevPhoto(section.id)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: isMobile ? '5px' : '15px',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: isMobile ? '40px' : '48px',
                      height: isMobile ? '40px' : '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      fontSize: isMobile ? '18px' : '22px',
                      color: '#095400',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(4px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#095400';
                      e.target.style.color = '#fff';
                      e.target.style.transform = 'translateY(-50%) scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.9)';
                      e.target.style.color = '#095400';
                      e.target.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    ❮
                  </button>

                  <button 
                    onClick={() => nextPhoto(section.id)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: isMobile ? '5px' : '15px',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: isMobile ? '40px' : '48px',
                      height: isMobile ? '40px' : '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      fontSize: isMobile ? '18px' : '22px',
                      color: '#095400',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(4px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#095400';
                      e.target.style.color = '#fff';
                      e.target.style.transform = 'translateY(-50%) scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.9)';
                      e.target.style.color = '#095400';
                      e.target.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    ❯
                  </button>

                  {/* Indicador com design melhorado */}
                  <div style={{
                    position: 'absolute',
                    bottom: isMobile ? '12px' : '18px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    padding: '5px 16px',
                    borderRadius: '20px',
                    fontSize: isMobile ? '0.75rem' : '0.85rem',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    {sectionIndex + 1} / {section.photos.length}
                  </div>
                </div>

                {/* Texto descritivo - MELHORADO */}
                <div style={{
                  flex: isMobile ? '1' : '2',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  padding: isMobile ? '18px 16px' : '25px 28px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  border: '1px solid #f0f0f0'
                }}>
                  {/* Ícone decorativo */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px'
                  }}>
                    <span style={{
                      backgroundColor: '#e8f5e9',
                      color: '#095400',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                      fontWeight: '600',
                      letterSpacing: '0.3px'
                    }}>
                      📸 {section.title}
                    </span>
                    <span style={{
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                      color: '#999'
                    }}>
                      {sectionIndex + 1} de {section.photos.length}
                    </span>
                  </div>

                  <p style={{
                    color: '#333',
                    fontSize: isMobile ? '0.95rem' : '1.05rem',
                    lineHeight: '1.8',
                    margin: '0 0 18px 0',
                    textAlign: 'justify'
                  }}>
                    {sectionPhoto.text}
                  </p>

                  {/* Miniaturas com scroll horizontal */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    padding: '8px 0',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#095400 #e0e0e0'
                  }}>
                    {section.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(prev => ({ ...prev, [section.id]: idx }))}
                        style={{
                          flexShrink: 0,
                          width: isMobile ? '55px' : '65px',
                          height: isMobile ? '55px' : '65px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: idx === sectionIndex ? '3px solid #095400' : '2px solid #e0e0e0',
                          cursor: 'pointer',
                          padding: 0,
                          backgroundColor: 'transparent',
                          boxShadow: idx === sectionIndex ? '0 0 0 3px rgba(9, 84, 0, 0.15)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (idx !== sectionIndex) {
                            e.target.style.borderColor = '#095400';
                            e.target.style.opacity = '0.8';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (idx !== sectionIndex) {
                            e.target.style.borderColor = '#e0e0e0';
                            e.target.style.opacity = '1';
                          }
                        }}
                      >
                        <img
                          src={photo.src}
                          alt={`Miniatura ${idx + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ===== LOCALIZAÇÃO ===== */}
        <div style={{
          backgroundColor: '#f8f8f8',
          borderRadius: '12px',
          padding: isMobile ? '20px 15px' : '30px 25px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #e8f5e9'
        }}>
          <h3 style={{
            color: '#095400',
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: '700',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>📍</span> Nossa Localização Estratégica
          </h3>
          <p style={{
            color: '#444',
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            margin: '0 0 5px 0',
            lineHeight: '1.6'
          }}>
            <strong>Endereço:</strong> Estrada Ferreira Guedes, 784 - Potuverá
          </p>
          <p style={{
            color: '#444',
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            margin: '0 0 5px 0',
            lineHeight: '1.6'
          }}>
            <strong>Cidade:</strong> Itapecerica da Serra - SP
          </p>
          <p style={{
            color: '#444',
            fontSize: isMobile ? '0.95rem' : '1.05rem',
            margin: '0 0 15px 0',
            lineHeight: '1.6'
          }}>
            <strong>CEP:</strong> 06885-150
          </p>

          {/* BADGE INFORMATIVA - CD NÃO PERMITE RETIRADA */}
          <div style={{
            backgroundColor: '#fff3e0',
            borderLeft: '4px solid #ff9800',
            borderRadius: '8px',
            padding: '14px 18px',
            margin: '15px 0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>📌</span>
            <div>
              <p style={{
                margin: 0,
                color: '#e65100',
                fontWeight: '600',
                fontSize: isMobile ? '0.85rem' : '0.95rem'
              }}>
                Centro de Distribuição - Sem Retirada no Local
              </p>
              <p style={{
                margin: '4px 0 0 0',
                color: '#555',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                lineHeight: '1.5'
              }}>
                Este é um Centro de Distribuição (CD) exclusivo para operações logísticas de carregamento e expedição. 
                Não realizamos atendimento ao público nem retirada de mercadorias no local. 
                Toda a estrutura foi projetada para garantir máxima eficiência na distribuição para toda a região.
              </p>
            </div>
          </div>

          <p style={{
            color: '#666',
            fontSize: isMobile ? '0.9rem' : '0.95rem',
            lineHeight: '1.7',
            margin: '10px 0 0 0'
          }}>
            Localizada em um ponto estratégico da região metropolitana, nosso Centro de Distribuição oferece fácil acesso 
            para caminhões e veículos de carga, garantindo agilidade no carregamento e distribuição de mercadorias para 
            toda a Grande São Paulo, Sul de Minas Gerais e Sul do Rio de Janeiro. 
            <br /><br />
            <strong>Importante:</strong> A PMG Atacadista não realiza vendas no balcão nem retirada de produtos no CD. 
            Nossa operação é 100% focada em distribuição e logística para atender com excelência nossos clientes em toda a região.
          </p>
        </div>

        {/* ===== RODAPÉ ===== */}
        <footer style={{
          marginTop: isMobile ? '30px' : '40px',
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
            <a 
              href="/politica-de-privacidade" 
              style={{ 
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
              }}
            >
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
              <a 
                href="https://www.facebook.com/MarquesVendaspmg" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  padding: '6px'
                }}
              >
                <img 
                  src="https://i.imgur.com/prULUUA.png" 
                  alt="Facebook" 
                  style={{
                    width: '20px',
                    height: '20px',
                    transition: 'all 0.3s ease'
                  }}
                />
              </a>

              <a 
                href="https://www.instagram.com/marquesvendaspmg" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  padding: '6px'
                }}
              >
                <img 
                  src="https://i.imgur.com/I0ZZLjG.png" 
                  alt="Instagram" 
                  style={{
                    width: '20px',
                    height: '20px',
                    transition: 'all 0.3s ease'
                  }}
                />
              </a>

              <a 
                href="https://www.youtube.com/@MarquesVendasPMG" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  padding: '6px'
                }}
              >
                <img 
                  src="https://i.imgur.com/WfpZ8Gg.png" 
                  alt="YouTube" 
                  style={{
                    width: '20px',
                    height: '20px',
                    transition: 'all 0.3s ease'
                  }}
                />
              </a>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                margin: '5px 0', 
                fontSize: isMobile ? '0.8rem' : '0.85rem',
                color: '#666'
              }}>
                © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
              </p>
              <p style={{ 
                margin: '5px 0', 
                fontSize: isMobile ? '0.7rem' : '0.8rem', 
                color: '#999',
                lineHeight: '1.4'
              }}>
                • Endereço: Estrada Ferreira Guedes, 784 - Potuverá - Itapecerica da Serra - SP - CEP: 06885-150
              </p>
              <p style={{ 
                margin: '5px 0', 
                fontSize: isMobile ? '0.7rem' : '0.8rem', 
                color: '#999',
                fontStyle: 'italic'
              }}>
                • Centro de Distribuição - Não realizamos retirada de mercadorias no local
              </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
