import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function PoliticaDevolucao() {
  const [isMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  return (
    <>
      <Head>
        <title>Política de Devolução e Reembolso - Marques Vendas PMG</title>
        <meta name="description" content="Política de devolução PMG: produtos novos, prazo de 1 dia para devolução no ato da entrega. Condições claras e transparentes." />
      </Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '15px' : '30px',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
      }}>
        {/* Cabeçalho */}
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <Link href="/">
            <img 
              src="https://i.imgur.com/pBH5WpZ.png" 
              alt="Marques Vendas PMG" 
              style={{ 
                width: isMobile ? '180px' : '220px',
                marginBottom: '20px',
                cursor: 'pointer'
              }} 
            />
          </Link>
          <h1 style={{ 
            color: '#095400', 
            fontSize: isMobile ? '1.8rem' : '2.2rem',
            marginBottom: '15px'
          }}>
            Política de Devolução e Reembolso
          </h1>
          <p style={{ color: '#666', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            Condições claras para trocas e devoluções - Produtos Novos | Prazo: 1 Dia
          </p>
        </header>

        {/* Conteúdo */}
        <div style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          padding: isMobile ? '20px' : '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>

          {/* Informações Principais para Google */}
          <section style={{ marginBottom: '30px', textAlign: 'center' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '20px'
            }}>
              Informações da Política
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '20px',
              marginBottom: '15px'
            }}>
              <div style={{
                padding: '15px'
              }}>
                <h3 style={{ 
                  color: '#095400', 
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  marginBottom: '10px'
                }}>
                  Condição do Produto
                </h3>
                <p style={{ 
                  color: '#555', 
                  margin: 0,
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '600'
                }}>
                  Apenas Produtos Novos
                </p>
                <p style={{ 
                  color: '#666', 
                  margin: '5px 0 0 0',
                  fontSize: isMobile ? '0.85rem' : '0.9rem'
                }}>
                  Trabalhamos exclusivamente com produtos novos e lacrados
                </p>
              </div>

              <div style={{
                padding: '15px'
              }}>
                <h3 style={{ 
                  color: '#095400', 
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  marginBottom: '10px'
                }}>
                  Prazo de Devolução
                </h3>
                <p style={{ 
                  color: '#555', 
                  margin: 0,
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  fontWeight: '600'
                }}>
                  1 Dia Útil
                </p>
                <p style={{ 
                  color: '#666', 
                  margin: '5px 0 0 0',
                  fontSize: isMobile ? '0.85rem' : '0.9rem'
                }}>
                  Prazo para solicitação de devolução no ato da entrega
                </p>
              </div>
            </div>
          </section>

          {/* Aviso Importante */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              Atenção Importante
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              A PMG <strong>NÃO FAZ TROCA</strong> do produto depois da nota fiscal assinada.
            </p>
          </section>

          {/* Política de Devolução */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              Nossa Política Completa
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Na <strong>PMG Atacadista</strong>, trabalhamos com <strong>produtos 100% novos</strong> e oferecemos 
              <strong> prazo de 1 dia útil</strong> para devolução no ato da entrega.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                color: '#095400', 
                fontSize: isMobile ? '1.1rem' : '1.2rem',
                marginBottom: '10px'
              }}>
                Devolução Aceita
              </h3>
              <ul style={{ 
                color: '#555',
                paddingLeft: '20px',
                marginBottom: '15px',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Produtos novos</strong> com divergência no pedido
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Prazo de 1 dia</strong> no ato da entrega
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Antes</strong> da assinatura da nota fiscal
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Produtos devem estar lacrados e intactos
                </li>
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                color: '#e53935', 
                fontSize: isMobile ? '1.1rem' : '1.2rem',
                marginBottom: '10px'
              }}>
                Devolução Não Aceita
              </h3>
              <ul style={{ 
                color: '#555',
                paddingLeft: '20px',
                marginBottom: '15px',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}>
                <li style={{ marginBottom: '8px' }}>
                  Após assinatura da nota fiscal
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Fora do prazo de 1 dia útil
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Produtos abertos ou utilizados
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Embalagens violadas ou danificadas
                </li>
              </ul>
            </div>
          </section>

          {/* Procedimentos no Ato da Entrega */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              Procedimentos no Ato da Entrega
            </h2>
            
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Você tem <strong>1 dia útil</strong> para verificar seu pedido durante a entrega:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <h4 style={{ 
                  color: '#095400', 
                  marginBottom: '10px',
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }}>
                  Conferência Obrigatória
                </h4>
                <ul style={{ 
                  color: '#555',
                  paddingLeft: '15px',
                  margin: 0,
                  fontSize: isMobile ? '0.9rem' : '0.95rem'
                }}>
                  <li style={{ marginBottom: '8px' }}>Verificar produtos correspondem ao pedido</li>
                  <li style={{ marginBottom: '8px' }}>Conferir integridade das embalagens</li>
                  <li style={{ marginBottom: '8px' }}>Confirmar quantidades exatas</li>
                  <li style={{ marginBottom: '8px' }}>Checar especificações técnicas</li>
                </ul>
              </div>

              <div>
                <h4 style={{ 
                  color: '#095400', 
                  marginBottom: '10px',
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }}>
                  Prazo de 1 Dia
                </h4>
                <ul style={{ 
                  color: '#555',
                  paddingLeft: '15px',
                  margin: 0,
                  fontSize: isMobile ? '0.9rem' : '0.95rem'
                }}>
                  <li style={{ marginBottom: '8px' }}>Devolução apenas no ato da entrega</li>
                  <li style={{ marginBottom: '8px' }}>Prazo máximo: 1 dia útil</li>
                  <li style={{ marginBottom: '8px' }}>Antes da assinatura da NF</li>
                  <li style={{ marginBottom: '8px' }}>Produtos devem estar lacrados</li>
                </ul>
              </div>
            </div>

            <p style={{ 
              color: '#e53935', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              NÃO ASSINE A NOTA FISCAL se encontrar qualquer problema!
            </p>
          </section>

          {/* Contato de Emergência */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              Contato Imediato
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Problema no pedido? Você tem <strong>1 dia útil</strong> para resolver. Entre em contato antes de assinar a nota fiscal:
            </p>
            
            <div style={{
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              <p style={{ 
                color: '#555', 
                margin: '0 0 10px 0',
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                fontWeight: '700'
              }}>
                (11) 91357-2902
              </p>
              <p style={{ 
                color: '#666', 
                margin: '0 0 15px 0',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}>
                Contate-nos dentro do prazo de 1 dia
              </p>
              <a 
                href="https://wa.me/5511913572902" 
                style={{
                  display: 'inline-block',
                  backgroundColor: '#095400',
                  color: 'white',
                  padding: isMobile ? '12px 20px' : '15px 30px',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: isMobile ? '1rem' : '1.1rem'
                }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                Chamar no WhatsApp
              </a>
            </div>
          </section>

          {/* Resumo para Google */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              Resumo da Política
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '20px'
            }}>
              <div>
                <h3 style={{ 
                  color: '#095400', 
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  marginBottom: '10px'
                }}>
                  Condições do Produto
                </h3>
                <ul style={{ 
                  color: '#555',
                  paddingLeft: '15px',
                  margin: 0,
                  fontSize: isMobile ? '0.9rem' : '0.95rem'
                }}>
                  <li style={{ marginBottom: '8px' }}><strong>Produtos Novos</strong> apenas</li>
                  <li style={{ marginBottom: '8px' }}>Embalagens originais</li>
                  <li style={{ marginBottom: '8px' }}>Lacrados e intactos</li>
                  <li style={{ marginBottom: '8px' }}>Qualidade garantida</li>
                </ul>
              </div>

              <div>
                <h3 style={{ 
                  color: '#095400', 
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  marginBottom: '10px'
                }}>
                  Prazo de Devolução
                </h3>
                <ul style={{ 
                  color: '#555',
                  paddingLeft: '15px',
                  margin: 0,
                  fontSize: isMobile ? '0.9rem' : '0.95rem'
                }}>
                  <li style={{ marginBottom: '8px' }}><strong>1 dia útil</strong> para devolução</li>
                  <li style={{ marginBottom: '8px' }}>No ato da entrega</li>
                  <li style={{ marginBottom: '8px' }}>Antes da assinatura</li>
                  <li style={{ marginBottom: '8px' }}>Prazo limitado</li>
                </ul>
              </div>
            </div>
          </section>

        </div>

        {/* Rodapé */}
        <footer style={{
          marginTop: '40px',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.85rem',
          padding: '20px 0',
          borderTop: '1px solid #eee'
        }}>
          <Link 
            href="/termos" 
            style={{ 
              color: '#095400', 
              textDecoration: 'none',
              margin: '0 10px'
            }}>
            Termos de Uso
          </Link>
          <span>|</span>
          <Link 
            href="/politica-de-privacidade"
            style={{ 
              color: '#095400', 
              textDecoration: 'none',
              margin: '0 10px'
            }}>
            Política de Privacidade
          </Link>
          <span>|</span>
          <Link 
            href="/quem-somos"
            style={{ 
              color: '#095400', 
              textDecoration: 'none',
              margin: '0 10px'
            }}>
            Quem Somos
          </Link>
          <span>|</span>
          <Link 
            href="/"
            style={{ 
              color: '#095400', 
              textDecoration: 'none',
              margin: '0 10px'
            }}>
            Voltar ao Início
          </Link>
          <p style={{ marginTop: '15px' }}>
            © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </>
  );
}
