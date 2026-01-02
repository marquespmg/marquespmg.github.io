import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import useTrackUser from '../hook/useTrackUser'; // ← ADICIONADO


const FAQPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

      // HOOK PARA RASTREAR VISITANTES - ADICIONADO AQUI
  useTrackUser(); // ← ESTA LINHA É NOVA
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      pergunta: "Quais regiões a PMG Atacadista atende?",
      resposta: "Atendemos todo o estado de São Paulo, Sul de Minas Gerais e Sul do Rio de Janeiro, incluindo Itapecerica da Serra, Grande São Paulo e região metropolitana."
    },
    {
      pergunta: "Qual o prazo de entrega dos produtos?",
      resposta: "Entregamos em até 48 horas para a Grande São Paulo e regiões próximas. Para Sul de Minas e Sul do RJ, o prazo é de 1 a 2 dias úteis."
    },
    {
      pergunta: "A PMG trabalha com quais tipos de produtos?",
      resposta: "Somos especializados em atacado food service: bebidas (cervejas, refrigerantes, sucos), laticínios (queijos, manteiga), carnes bovinas e de frango, mercearia, produtos de limpeza e descartáveis."
    },
    {
      pergunta: "Qual o valor mínimo para pedido?",
      resposta: "Trabalhamos com pedidos a partir de R$ 900,00 para entrega gratuita em São Paulo, Sul de MG e Sul do RJ."
    },
    {
      pergunta: "Como faço para me cadastrar e ver os preços?",
      resposta: " Acessando nosso site e fazendo um cadastro rápido (menos de 2 minutos), fazer login com Google ou criar uma conta. Após aprovação, você terá acesso a todos os preços de atacado."
    },
    {
      pergunta: "Aceitam quais formas de pagamento?",
      resposta: "Trabalhamos com pagamento ávista cartão de crédito/débito ou dinehiro. Pague no ato da entega, não aceitamos pagamento antecipado."
    },
    {
      pergunta: "Os produtos têm garantia?",
      resposta: "Sim, todos os produtos têm garantia de qualidade e procedência. Trabalhamos apenas com marcas reconhecidas no mercado."
    },
    {
      pergunta: "Fazem entregas para restaurantes e bares?",
      resposta: "Sim! Somos especializados em atacado food service para restaurantes, bares, lanchonetes, padarias, mercados e estabelecimentos comerciais."
    },
    {
      pergunta: "Quem é o responsável pela Marques Vendas PMG?",
      resposta: "A Marques Vendas PMG é gerida por Marques Antonio, vendedor autorizado da PMG Atacadista. Trabalhamos com atendimento personalizado e entrega rápida para toda a região de São Paulo."
    },
    {
      pergunta: "Como posso entrar em contato?",
      resposta: "Você pode entrar em contato pelo WhatsApp (11) 91357-2902 ou acessar nosso catálogo online para fazer pedidos diretamente."
    }
  ];

  return (
    <>
      <Head>
        <title>Perguntas Frequentes - PMG Atacadista | Atacado Food Service São Paulo</title>
        <meta name="description" content="Tire suas dúvidas sobre a PMG Atacadista. Entregas SP, prazos, produtos, formas de pagamento e mais. Atacado food service para São Paulo, Sul Minas e Sul RJ." />
        <meta name="keywords" content="PMG Atacadista dúvidas, perguntas frequentes atacado SP, food service São Paulo, entrega atacado capital, atacadista Itapecerica" />
        <meta property="og:title" content="Perguntas Frequentes - PMG Atacadista | Atacado Food Service SP" />
        <meta property="og:description" content="Tire suas dúvidas sobre a PMG Atacadista. Atacado food service para São Paulo desde 1995." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.marquesvendaspmg.shop/faq" />
        <meta property="og:image" content="https://i.imgur.com/jrERRsC.png" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://www.marquesvendaspmg.shop/faq" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.pergunta,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.resposta
                }
              }))
            })
          }}
        />
      </Head>

      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: isMobile ? '20px' : '40px',
        backgroundColor: '#fff'
      }}>
        {/* Cabeçalho com Logo */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          {/* LOGO PMG */}
          <img 
            src="https://i.imgur.com/pBH5WpZ.png" 
            alt="Logo PMG Atacadista - Atacado Food Service São Paulo" 
            style={{ 
              height: isMobile ? '50px' : '60px', 
              marginBottom: '15px' 
            }} 
          />
          
          <h1 style={{ 
            color: '#095400', 
            fontSize: isMobile ? '28px' : '36px',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            Perguntas Frequentes
          </h1>
          <p style={{ 
            fontSize: isMobile ? '16px' : '18px',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Tire suas dúvidas sobre a PMG Atacadista
          </p>
        </div>

        {/* Lista de FAQs com Accordion */}
        <div style={{ marginBottom: '50px' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%',
                  padding: '20px',
                  backgroundColor: openIndex === index ? '#f0f9f0' : '#fff',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = openIndex === index ? '#f0f9f0' : '#f9f9f9';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = openIndex === index ? '#f0f9f0' : '#fff';
                }}
              >
                <span style={{ 
                  color: '#095400',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '600',
                  flex: 1,
                  textAlign: 'left'
                }}>
                  {faq.pergunta}
                </span>
                <span style={{
                  color: '#095400',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginLeft: '15px',
                  transition: 'transform 0.3s ease',
                  transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▼
                </span>
              </button>
              
              {openIndex === index && (
                <div style={{ 
                  padding: '20px',
                  backgroundColor: '#f9f9f9',
                  borderTop: '1px solid #e0e0e0',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <p style={{ 
                    color: '#555',
                    lineHeight: '1.6',
                    fontSize: isMobile ? '15px' : '16px',
                    margin: '0'
                  }}>
                    {faq.resposta}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Backlinks Discretos */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '40px'
        }}>
          <Link href="/produtos" legacyBehavior>
            <a style={{
              display: 'block',
              padding: '15px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#095400',
              border: '1px solid #095400',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#095400';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#095400';
            }}>
              📦 Acessar Catálogo
            </a>
          </Link>

          <a 
            href="https://wa.me/5511913572902" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '15px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#25D366',
              border: '1px solid #25D366',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#25D366';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#25D366';
            }}>
            💬 Falar no WhatsApp
          </a>
        </div>

        {/* Rodapé Igual ao do Site Principal */}
        <footer style={{
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '2px solid #095400',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}>
            
            <Link href="/politica-de-privacidade" passHref legacyBehavior>
              <a style={{ 
                color: '#095400', 
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: '#f9f9f9',
                border: '1px solid #e0e0e0'
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
                fontWeight: '600',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: '#f9f9f9',
                border: '1px solid #e0e0e0'
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
                fontWeight: '600',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: '#f9f9f9',
                border: '1px solid #e0e0e0'
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
                fontWeight: '600',
                fontSize: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                backgroundColor: '#f9f9f9',
                border: '1px solid #e0e0e0'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#095400';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f9f9f9';
                e.target.style.color = '#095400';
              }}>
                👥 Quem Somos
              </a>
            </Link>
          </div>

          <div style={{ 
            textAlign: 'center',
            paddingTop: '15px',
            borderTop: '1px solid #e0e0e0'
          }}>
            <p style={{ 
              margin: '8px 0', 
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.5'
            }}>
              © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
            </p>
            <p style={{ 
              margin: '8px 0', 
              fontSize: '12px', 
              color: '#888',
              lineHeight: '1.4'
            }}>
              Endereço: Estrada Ferreira Guedes, 784 - Potuverá 
              <br />
              CEP: 06885-150 - Itapecerica da Serra - SP
            </p>
            <p style={{ 
              margin: '8px 0', 
              fontSize: '12px', 
              color: '#888'
            }}>
              📞 Telefone: (11) 91357-2902
            </p>
            
            {/* TEXTO SEO - EM CIMA (Google prioriza) */}
            <p style={{ 
              margin: '15px 0 0 0', 
              fontSize: '11px', 
              color: '#999',
              lineHeight: '1.4',
              fontStyle: 'italic',
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
          </div>
        </footer>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @media (max-width: 768px) {
            button:hover {
              background-color: inherit !important;
            }
            a:hover {
              background-color: inherit !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};


export default FAQPage;
