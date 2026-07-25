import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useTrackUser from '../hook/useTrackUser';

const CidadesAtendidasPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);
  const [dadosCidades, setDadosCidades] = useState({
    sp: {},
    mg: {},
    rj: {}
  });
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const cidadesPorPagina = 10;
  
  useTrackUser();
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Carregar os 3 JSONs
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [spData, mgData, rjData] = await Promise.all([
          fetch('/rotas/sp.json').then(res => res.json()),
          fetch('/rotas/mg.json').then(res => res.json()),
          fetch('/rotas/rj.json').then(res => res.json())
        ]);
        
        setDadosCidades({
          sp: spData,
          mg: mgData,
          rj: rjData
        });
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);

  // Resetar página quando mudar de estado
  useEffect(() => {
    setPaginaAtual(1);
  }, [estadoSelecionado]);

  // Função para renderizar os dias de entrega
  const renderDiasEntrega = (cidade) => {
    const dias = cidade;
    const diasAtivos = [];
    
    if (dias.terca) diasAtivos.push('Terça');
    if (dias.quarta) diasAtivos.push('Quarta');
    if (dias.quinta) diasAtivos.push('Quinta');
    if (dias.sexta) diasAtivos.push('Sexta');
    
    if (diasAtivos.length === 0) {
      return (
        <span style={{ 
          color: '#e53935', 
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: '500'
        }}>
          ⏳ Sem previsão
        </span>
      );
    }
    
    return (
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '5px',
        marginTop: '2px'
      }}>
        {diasAtivos.map((dia, index) => (
          <span
            key={index}
            style={{
              backgroundColor: '#095400',
              color: 'white',
              padding: isMobile ? '2px 10px' : '3px 14px',
              borderRadius: '20px',
              fontSize: isMobile ? '10px' : '11px',
              fontWeight: '600',
              letterSpacing: '0.3px',
              textTransform: 'uppercase'
            }}
          >
            {dia}
          </span>
        ))}
      </div>
    );
  };

  // Função para ordenar cidades alfabeticamente
  const ordenarCidades = (cidadesObj) => {
    return Object.keys(cidadesObj).sort((a, b) => {
      const nomeA = a.replace(/-(SP|MG|RJ)$/, '').trim();
      const nomeB = b.replace(/-(SP|MG|RJ)$/, '').trim();
      return nomeA.localeCompare(nomeB, 'pt-BR');
    });
  };

  // Pegar cidades ordenadas do estado selecionado
  const getCidadesOrdenadas = () => {
    if (!estadoSelecionado) return [];
    const cidadesObj = dadosCidades[estadoSelecionado];
    if (!cidadesObj) return [];
    return ordenarCidades(cidadesObj);
  };

  // Paginação
  const cidadesOrdenadas = getCidadesOrdenadas();
  const totalCidades = cidadesOrdenadas.length;
  const totalPaginas = Math.ceil(totalCidades / cidadesPorPagina);
  
  const inicio = (paginaAtual - 1) * cidadesPorPagina;
  const fim = inicio + cidadesPorPagina;
  const cidadesPagina = cidadesOrdenadas.slice(inicio, fim);

  // Calcular total geral de cidades
  const totalGeralCidades = 
    Object.keys(dadosCidades.sp).length +
    Object.keys(dadosCidades.mg).length +
    Object.keys(dadosCidades.rj).length;

  // Dados para FAQ sobre entregas
  const faqsEntrega = [
    {
      pergunta: "Como funciona a entrega da PMG Atacadista?",
      resposta: "Nossa equipe realiza entregas programadas de acordo com a rota de cada cidade. Os dias de entrega variam conforme a região, e você pode consultar os dias específicos da sua cidade na lista acima."
    },
    {
      pergunta: "Qual o prazo de entrega?",
      resposta: "O prazo de entrega é de até 48 horas para a Grande São Paulo e regiões próximas. Para Sul de Minas Gerais e Sul do Rio de Janeiro, o prazo é de 1 a 2 dias úteis, conforme a rota estabelecida."
    },
    {
      pergunta: "A PMG entrega em minha cidade?",
      resposta: "Consulte a lista completa acima. Atendemos todo o estado de São Paulo, Sul de Minas Gerais e Sul do Rio de Janeiro. Se sua cidade não estiver na lista, entre em contato conosco para verificar a possibilidade de incluir uma nova rota."
    },
    {
      pergunta: "Precisa ter CNPJ para comprar?",
      resposta: "Não! Atendemos tanto pessoas jurídicas (CNPJ) quanto pessoas físicas (CPF). Basta fazer seu cadastro em nosso site e começar a comprar com os melhores preços de atacado."
    },
    {
      pergunta: "Qual o valor mínimo para entrega gratuita?",
      resposta: "Nosso pedido mínimo é R$ 900,00. Não cobramos frete para todas as cidades atendidas."
    }
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '40px',
        textAlign: 'center',
        color: '#095400'
      }}>
        <p>Carregando cidades atendidas...</p>
      </div>
    );
  }

  // Definir tamanhos responsivos
  const getFontSize = (desktop, tablet, mobile) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  const getPadding = (desktop, tablet, mobile) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  return (
    <>
      <Head>
        <title>🚚 Cidades Atendidas - PMG Atacadista | +{totalGeralCidades} cidades em SP, MG e RJ</title>
        <meta name="description" content={`Consulte as ${totalGeralCidades} cidades atendidas pela PMG Atacadista. Entregamos em todo São Paulo, Sul de Minas Gerais e Sul do Rio de Janeiro. Veja os dias de entrega da sua cidade.`} />
        <meta name="keywords" content={`cidades atendidas PMG, entregas atacado SP, onde entregamos, rota de entrega SP, atacadista Itapecerica, entregas MG, entregas RJ, dias de entrega, ${totalGeralCidades} cidades`} />
        <meta property="og:title" content={`Cidades Atendidas - PMG Atacadista | +${totalGeralCidades} cidades em SP, MG e RJ`} />
        <meta property="og:description" content={`Veja se entregamos na sua cidade. Atendemos ${totalGeralCidades} cidades em todo o estado de SP, Sul de MG e Sul do RJ com entregas rápidas.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.marquesvendaspmg.shop/cidades-atendidas" />
        <meta property="og:image" content="https://i.imgur.com/jrERRsC.png" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://www.marquesvendaspmg.shop/cidades-atendidas" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "PMG Atacadista",
              "description": `Atacado food service com entregas em ${totalGeralCidades} cidades em São Paulo, Sul de Minas Gerais e Sul do Rio de Janeiro`,
              "telephone": "+55-11-91357-2902",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Estrada Ferreira Guedes, 784 - Potuverá",
                "addressLocality": "Itapecerica da Serra",
                "addressRegion": "SP",
                "postalCode": "06885-150",
                "addressCountry": "BR"
              }
            })
          }}
        />
      </Head>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: getPadding('40px', '30px', '16px'),
        backgroundColor: '#fff',
        minHeight: '100vh'
      }}>
        {/* Cabeçalho */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: getPadding('40px', '30px', '25px')
        }}>
          <img 
            src="https://i.imgur.com/pBH5WpZ.png" 
            alt="Logo PMG Atacadista" 
            style={{ 
              height: getPadding('60px', '50px', '45px'), 
              marginBottom: getPadding('20px', '15px', '12px') 
            }} 
          />
          
          <h1 style={{ 
            color: '#095400', 
            fontSize: getPadding('32px', '28px', '22px'),
            marginBottom: '8px',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            🚚 Cidades Atendidas
          </h1>
          
          {/* Stats em destaque */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: getPadding('20px', '15px', '10px'),
            flexWrap: 'wrap',
            marginBottom: '12px'
          }}>
            <div style={{
              backgroundColor: '#f0f9f0',
              padding: getPadding('8px 20px', '6px 16px', '6px 14px'),
              borderRadius: '20px',
              border: '1px solid #095400'
            }}>
              <span style={{ 
                fontSize: getPadding('20px', '18px', '16px'), 
                fontWeight: '700', 
                color: '#095400' 
              }}>
                {totalGeralCidades}
              </span>
              <span style={{ 
                fontSize: getPadding('13px', '12px', '11px'), 
                color: '#095400', 
                fontWeight: '500',
                marginLeft: '4px'
              }}>
                cidades
              </span>
            </div>
            
            <div style={{
              backgroundColor: '#FFF3E0',
              padding: getPadding('8px 20px', '6px 16px', '6px 14px'),
              borderRadius: '20px',
              border: '1px solid #E65100'
            }}>
              <span style={{ 
                fontSize: getPadding('20px', '18px', '16px'), 
                fontWeight: '700', 
                color: '#E65100' 
              }}>
                2.000+
              </span>
              <span style={{ 
                fontSize: getPadding('13px', '12px', '11px'), 
                color: '#E65100', 
                fontWeight: '500',
                marginLeft: '4px'
              }}>
                produtos
              </span>
            </div>
          </div>
          
          <p style={{ 
            fontSize: getPadding('17px', '15px', '14px'),
            color: '#555',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Entregamos em <strong>todo o estado de São Paulo</strong>, <strong>Sul de Minas Gerais</strong> e <strong>Sul do Rio de Janeiro</strong>
          </p>
          <p style={{
            fontSize: getPadding('14px', '13px', '12px'),
            color: '#095400',
            marginTop: '6px',
            fontWeight: '600'
          }}>
            📅 Consulte os dias de entrega da sua região
          </p>
        </div>

{/* ========== BOTÕES DOS ESTADOS ========== */}
<div style={{
  display: 'flex',
  gap: getPadding('12px', '10px', '8px'),
  justifyContent: 'center',
  marginBottom: getPadding('30px', '25px', '20px'),
  flexWrap: 'wrap'
}}>
  {[
    { key: 'sp', label: 'São Paulo', icon: '📌', count: Object.keys(dadosCidades.sp).length },
    { key: 'mg', label: 'Minas Gerais', icon: '⛰️', count: Object.keys(dadosCidades.mg).length },
    { key: 'rj', label: 'Rio de Janeiro', icon: '🏖️', count: Object.keys(dadosCidades.rj).length }
  ].map((estado) => (
    <button
      key={estado.key}
      onClick={() => setEstadoSelecionado(
        estadoSelecionado === estado.key ? null : estado.key
      )}
      style={{
        padding: getPadding('10px 24px', '8px 18px', '8px 14px'),
        backgroundColor: '#ffffff',  // 👈 SEMPRE BRANCO
        border: estadoSelecionado === estado.key 
          ? '3px solid #095400'   // 👈 BORDA MAIS GROSSA QUANDO SELECIONADO
          : '2px solid #095400',  // 👈 BORDA NORMAL QUANDO INATIVO
        borderRadius: '8px',
        fontSize: getPadding('15px', '14px', '13px'),
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: estadoSelecionado === estado.key 
          ? '0 4px 16px rgba(9, 84, 0, 0.2)'  // 👈 SOMBRA MAIS FORTE
          : '0 1px 4px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        letterSpacing: '0.2px',
        whiteSpace: 'nowrap',
        transform: estadoSelecionado === estado.key ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <span style={{ 
        fontSize: getPadding('16px', '14px', '13px'),
        lineHeight: 1,
        color: '#095400'
      }}>
        {estado.icon}
      </span>
      <span style={{
        color: '#095400',
        fontWeight: '700'
      }}>
        {estado.label}
      </span>
      <span style={{
        backgroundColor: estadoSelecionado === estado.key ? '#095400' : '#f0f0f0',
        padding: '2px 12px',
        borderRadius: '12px',
        fontSize: getPadding('12px', '11px', '10px'),
        fontWeight: '700',
        color: estadoSelecionado === estado.key ? '#ffffff' : '#095400'
      }}>
        {estado.count}
      </span>
    </button>
  ))}
</div>

        {/* ========== LISTA DE CIDADES COM PAGINAÇÃO ========== */}
        {estadoSelecionado && (
          <div style={{
            backgroundColor: '#fafafa',
            borderRadius: '12px',
            padding: getPadding('24px', '20px', '16px'),
            border: '1px solid #e8e8e8',
            marginBottom: '30px',
            animation: 'fadeIn 0.3s ease'
          }}>
            {/* Título do Estado */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '18px',
              paddingBottom: '14px',
              borderBottom: '2px solid #e8e8e8'
            }}>
              <span style={{ fontSize: getPadding('24px', '22px', '20px') }}>
                {estadoSelecionado === 'sp' && '📌'}
                {estadoSelecionado === 'mg' && '📌️'}
                {estadoSelecionado === 'rj' && '📌'}
              </span>
              <h2 style={{
                margin: 0,
                color: '#095400',
                fontSize: getPadding('20px', '18px', '16px'),
                fontWeight: '700'
              }}>
                {estadoSelecionado === 'sp' && 'São Paulo'}
                {estadoSelecionado === 'mg' && 'Minas Gerais'}
                {estadoSelecionado === 'rj' && 'Rio de Janeiro'}
              </h2>
              <span style={{
                backgroundColor: '#095400',
                color: 'white',
                padding: '2px 12px',
                borderRadius: '12px',
                fontSize: getPadding('13px', '12px', '11px'),
                fontWeight: '600',
                marginLeft: 'auto'
              }}>
                {totalCidades}
              </span>
            </div>

            {/* Informação de paginação */}
            {totalCidades > cidadesPorPagina && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
                padding: getPadding('8px 14px', '6px 12px', '6px 10px'),
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e8e8e8',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                <span style={{
                  fontSize: getPadding('13px', '12px', '11px'),
                  color: '#666'
                }}>
                  Mostrando {inicio + 1} - {Math.min(fim, totalCidades)} de {totalCidades}
                </span>
                <span style={{
                  fontSize: getPadding('13px', '12px', '11px'),
                  color: '#666'
                }}>
                  Página {paginaAtual} de {totalPaginas}
                </span>
              </div>
            )}

            {/* Lista de Cidades */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {cidadesPagina.map((cidadeKey, index) => {
                const cidade = dadosCidades[estadoSelecionado][cidadeKey];
                const nomeCidade = cidadeKey.replace(/-(SP|MG|RJ)$/, '').trim();
                
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      padding: getPadding('12px 18px', '10px 16px', '10px 14px'),
                      borderRadius: '6px',
                      border: '1px solid #e8e8e8',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#095400';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(9,84,0,0.06)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e8e8e8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: getPadding('15px', '14px', '13px'),
                        fontWeight: '500',
                        color: '#333'
                      }}>
                        {nomeCidade}
                      </span>
                      {renderDiasEntrega(cidade)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ========== CONTROLES DE PAGINAÇÃO ========== */}
            {totalCidades > cidadesPorPagina && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: getPadding('8px', '6px', '5px'),
                marginTop: '18px',
                paddingTop: '16px',
                borderTop: '2px solid #e8e8e8',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                  disabled={paginaAtual === 1}
                  style={{
                    padding: getPadding('8px 16px', '6px 14px', '6px 12px'),
                    backgroundColor: paginaAtual === 1 ? '#f5f5f5' : '#095400',
                    color: paginaAtual === 1 ? '#999' : 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: getPadding('14px', '13px', '12px'),
                    fontWeight: '600',
                    cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.25s ease',
                    opacity: paginaAtual === 1 ? 0.6 : 1
                  }}
                >
                  ← Anterior
                </button>

                <div style={{
                  display: 'flex',
                  gap: '4px',
                  flexWrap: 'wrap'
                }}>
                  {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                    let numeroPagina;
                    if (totalPaginas <= 5) {
                      numeroPagina = i + 1;
                    } else if (paginaAtual <= 3) {
                      numeroPagina = i + 1;
                    } else if (paginaAtual >= totalPaginas - 2) {
                      numeroPagina = totalPaginas - 4 + i;
                    } else {
                      numeroPagina = paginaAtual - 2 + i;
                    }
                    
                    return (
                      <button
                        key={numeroPagina}
                        onClick={() => setPaginaAtual(numeroPagina)}
                        style={{
                          padding: getPadding('6px 14px', '5px 12px', '5px 10px'),
                          backgroundColor: paginaAtual === numeroPagina ? '#095400' : 'white',
                          color: paginaAtual === numeroPagina ? 'white' : '#095400',
                          border: '2px solid #095400',
                          borderRadius: '6px',
                          fontSize: getPadding('14px', '13px', '12px'),
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          minWidth: getPadding('36px', '32px', '28px')
                        }}
                      >
                        {numeroPagina}
                      </button>
                    );
                  })}
                  
                  {totalPaginas > 5 && paginaAtual < totalPaginas - 2 && (
                    <>
                      <span style={{
                        padding: getPadding('6px 10px', '5px 8px', '5px 6px'),
                        color: '#999'
                      }}>
                        …
                      </span>
                      <button
                        onClick={() => setPaginaAtual(totalPaginas)}
                        style={{
                          padding: getPadding('6px 14px', '5px 12px', '5px 10px'),
                          backgroundColor: 'white',
                          color: '#095400',
                          border: '2px solid #095400',
                          borderRadius: '6px',
                          fontSize: getPadding('14px', '13px', '12px'),
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          minWidth: getPadding('36px', '32px', '28px')
                        }}
                      >
                        {totalPaginas}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                  disabled={paginaAtual === totalPaginas}
                  style={{
                    padding: getPadding('8px 16px', '6px 14px', '6px 12px'),
                    backgroundColor: paginaAtual === totalPaginas ? '#f5f5f5' : '#095400',
                    color: paginaAtual === totalPaginas ? '#999' : 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: getPadding('14px', '13px', '12px'),
                    fontWeight: '600',
                    cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer',
                    transition: 'all 0.25s ease',
                    opacity: paginaAtual === totalPaginas ? 0.6 : 1
                  }}
                >
                  Próxima →
                </button>
              </div>
            )}

            {/* ========== MENSAGEM "NÃO ACHOU SUA CIDADE?" ========== */}
            <div style={{
              marginTop: '24px',
              padding: getPadding('18px 20px', '16px 18px', '14px 16px'),
              backgroundColor: '#FFF8E1',
              borderRadius: '8px',
              border: '1px solid #FFB74D',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: getPadding('32px', '28px', '24px'),
                marginBottom: '6px'
              }}>
                🔍
              </div>
              <h3 style={{
                margin: '0 0 8px 0',
                color: '#E65100',
                fontSize: getPadding('18px', '16px', '15px'),
                fontWeight: '700'
              }}>
                Não achou sua cidade?
              </h3>
              <p style={{
                margin: '0 0 12px 0',
                color: '#666',
                fontSize: getPadding('14px', '13px', '12px'),
                lineHeight: '1.5'
              }}>
                Infelizmente ainda não temos entregas nessa região. 😔
              </p>
              <p style={{
                margin: '0 0 14px 0',
                color: '#888',
                fontSize: getPadding('13px', '12px', '11px')
              }}>
                Estamos sempre expandindo nossas rotas!
              </p>
              <a
                href="https://wa.me/5511913572902?text=Olá! Gostaria de saber se vocês entregam na minha cidade."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#25D366',
                  color: 'white',
                  padding: getPadding('10px 28px', '8px 24px', '8px 20px'),
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: getPadding('14px', '13px', '12px'),
                  transition: 'all 0.25s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#1da851';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(37,211,102,0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#25D366';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                💬 Fale conosco
              </a>
            </div>
          </div>
        )}

        {/* ========== SEÇÃO DE FAQ ========== */}
        <div style={{ marginTop: '50px' }}>
          <h2 style={{
            color: '#095400',
            fontSize: getPadding('24px', '22px', '20px'),
            textAlign: 'center',
            marginBottom: '24px',
            fontWeight: '700'
          }}>
            ❓ Perguntas Frequentes
          </h2>

          {faqsEntrega.map((faq, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '8px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%',
                  padding: getPadding('16px 20px', '14px 18px', '12px 16px'),
                  backgroundColor: openFAQ === index ? '#f5faf5' : '#fff',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.25s ease'
                }}
                onMouseOver={(e) => {
                  if (openFAQ !== index) {
                    e.target.style.backgroundColor = '#f9f9f9';
                  }
                }}
                onMouseOut={(e) => {
                  if (openFAQ !== index) {
                    e.target.style.backgroundColor = '#fff';
                  }
                }}
              >
                <span style={{ 
                  color: '#095400',
                  fontSize: getPadding('15px', '14px', '13px'),
                  fontWeight: '600',
                  flex: 1,
                  textAlign: 'left',
                  paddingRight: '12px'
                }}>
                  {faq.pergunta}
                </span>
                <span style={{
                  color: '#095400',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'transform 0.3s ease',
                  transform: openFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  flexShrink: 0
                }}>
                  ▼
                </span>
              </button>
              
              {openFAQ === index && (
                <div style={{ 
                  padding: getPadding('16px 20px', '14px 18px', '12px 16px'),
                  backgroundColor: '#f9f9f9',
                  borderTop: '1px solid #e8e8e8',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <p style={{ 
                    color: '#555',
                    lineHeight: '1.6',
                    fontSize: getPadding('14px', '13px', '13px'),
                    margin: 0
                  }}>
                    {faq.resposta}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ========== BACKLINKS ========== */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '12px',
          marginTop: '40px'
        }}>
          <Link href="/produtos" legacyBehavior>
            <a style={{
              display: 'block',
              padding: getPadding('14px', '12px', '12px'),
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#095400',
              border: '2px solid #095400',
              textAlign: 'center',
              fontSize: getPadding('15px', '14px', '13px'),
              fontWeight: '600',
              transition: 'all 0.25s ease',
              backgroundColor: 'white'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#095400';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(9,84,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#095400';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              📦 Catálogo de Produtos
            </a>
          </Link>

          <Link href="/faq" legacyBehavior>
            <a style={{
              display: 'block',
              padding: getPadding('14px', '12px', '12px'),
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#095400',
              border: '2px solid #095400',
              textAlign: 'center',
              fontSize: getPadding('15px', '14px', '13px'),
              fontWeight: '600',
              transition: 'all 0.25s ease',
              backgroundColor: 'white'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#095400';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(9,84,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#095400';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              ❓ Perguntas Frequentes
            </a>
          </Link>
        </div>

        {/* ========== RODAPÉ ========== */}
        <footer style={{
          marginTop: '50px',
          paddingTop: '30px',
          borderTop: '2px solid #095400',
          textAlign: 'center',
          color: '#666',
          fontSize: getPadding('14px', '13px', '12px')
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '25px'
          }}>
            <Link href="/politica-de-privacidade" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: getPadding('13px', '12px', '11px'),
                padding: '8px',
                borderRadius: '6px',
                transition: 'all 0.25s ease',
                backgroundColor: '#f9f9f9',
                border: '1px solid #e8e8e8'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f9f9f9';
                e.target.style.color = '#095400';
              }}>
                🔒 Privacidade
              </a>
            </Link>

            <Link href="/politica-devolucao-e-reembolso" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: getPadding('13px', '12px', '11px'),
                padding: '8px',
                borderRadius: '6px',
                transition: 'all 0.25s ease',
                backgroundColor: '#f9f9f9',
                border: '1px solid #e8e8e8'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f9f9f9';
                e.target.style.color = '#095400';
              }}>
                🔄 Devolução
              </a>
            </Link>

            <Link href="/termos" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: getPadding('13px', '12px', '11px'),
                padding: '8px',
                borderRadius: '6px',
                transition: 'all 0.25s ease',
                backgroundColor: '#f9f9f9',
                border: '1px solid #e8e8e8'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f9f9f9';
                e.target.style.color = '#095400';
              }}>
                📄 Termos
              </a>
            </Link>

            <Link href="/quem-somos" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: getPadding('13px', '12px', '11px'),
                padding: '8px',
                borderRadius: '6px',
                transition: 'all 0.25s ease',
                backgroundColor: '#f9f9f9',
                border: '1px solid #e8e8e8'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f9f9f9';
                e.target.style.color = '#095400';
              }}>
                👥 Sobre
              </a>
            </Link>
          </div>

          <div style={{ 
            paddingTop: '15px',
            borderTop: '1px solid #e8e8e8'
          }}>
            <p style={{ 
              margin: '0 0 12px 0', 
              fontSize: getPadding('11px', '10px', '10px'), 
              color: '#999',
              lineHeight: '1.4',
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: '0 10px'
            }}>
        <strong>PMG Atacadista</strong> - Seu fornecedor de confiança em <strong>São Paulo</strong>. 
        Especializados em <strong>atacado food service</strong> para restaurantes, bares e mercados. 
        Atendemos <strong>Itapecerica da Serra, Grande SP, Sul de Minas Gerais e Sul do Rio de Janeiro</strong>. 
        Trabalhamos com as melhores marcas do mercado para garantir qualidade e satisfação aos nossos clientes.
            </p>
            
            <p style={{ margin: '6px 0', fontSize: getPadding('13px', '12px', '11px'), color: '#666' }}>
              © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
            </p>
            <p style={{ margin: '6px 0', fontSize: getPadding('11px', '10px', '10px'), color: '#888' }}>
              Estrada Ferreira Guedes, 784 - Potuverá - Itapecerica da Serra - SP
              <br />
              📞 (11) 91357-2902
            </p>
          </div>
        </footer>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @media (max-width: 768px) {
            button:hover {
              background-color: inherit !important;
              transform: none !important;
            }
            a:hover {
              background-color: inherit !important;
              transform: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default CidadesAtendidasPage;