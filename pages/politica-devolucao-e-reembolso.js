import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function PoliticaDevolucao() {
  const [isMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  return (
    <>
      <Head>
        <title>Política de Devolução e Reembolso - Marques Vendas PMG</title>
        <meta name="description" content="Política de devolução PMG: produtos novos, prazo de 7 dias para devolução. Condições claras e transparentes." />
      </Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '15px' : '30px',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        lineHeight: '1.6'
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
        </header>

        {/* Conteúdo Principal */}
        <div style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          padding: isMobile ? '20px' : '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '30px'
        }}>

          {/* Resumo da Política */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.4rem' : '1.6rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Nossa Política
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
              gap: '20px',
              marginBottom: '25px'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '20px'
              }}>
                <div style={{
                  fontSize: '2rem',
                  color: '#095400',
                  marginBottom: '10px'
                }}>7</div>
                <h3 style={{ 
                  color: '#095400', 
                  fontSize: '1.1rem',
                  marginBottom: '8px'
                }}>
                  Dias Corridos
                </h3>
                <p style={{ 
                  color: '#666', 
                  margin: 0,
                  fontSize: '0.9rem'
                }}>
                  Para solicitar devolução após o recebimento
                </p>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '20px'
              }}>
                <div style={{
                  fontSize: '2rem',
                  color: '#095400',
                  marginBottom: '10px'
                }}>✓</div>
                <h3 style={{ 
                  color: '#095400', 
                  fontSize: '1.1rem',
                  marginBottom: '8px'
                }}>
                  Produto Original
                </h3>
                <p style={{ 
                  color: '#666', 
                  margin: 0,
                  fontSize: '0.9rem'
                }}>
                  Sem uso, na embalagem original com acessórios
                </p>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '20px'
              }}>
                <div style={{
                  fontSize: '2rem',
                  color: '#095400',
                  marginBottom: '10px'
                }}>7</div>
                <h3 style={{ 
                  color: '#095400', 
                  fontSize: '1.1rem',
                  marginBottom: '8px'
                }}>
                  Dias Úteis
                </h3>
                <p style={{ 
                  color: '#666', 
                  margin: 0,
                  fontSize: '0.9rem'
                }}>
                  Para processar o reembolso
                </p>
              </div>
            </div>
          </section>

          {/* Política Detalhada */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.4rem' : '1.6rem',
              marginBottom: '20px'
            }}>
              Condições para Devolução
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '25px'
            }}>
              <div>
                <h3 style={{ 
                  color: '#095400', 
                  fontSize: '1.2rem',
                  marginBottom: '15px'
                }}>
                  ✅ Requisitos para Aceitação
                </h3>
                <ul style={{ 
                  color: '#555',
                  paddingLeft: '20px',
                  margin: 0
                }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Prazo de 7 dias corridos</strong> após o recebimento
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Produto sem uso</strong> e em perfeito estado
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Embalagem original</strong> intacta e sem avarias
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Todos os acessórios</strong> incluídos
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Nota fiscal</strong> do pedido
                  </li>
                </ul>
              </div>

              <div>
                <h3 style={{ 
                  color: '#e53935', 
                  fontSize: '1.2rem',
                  marginBottom: '15px'
                }}>
                  ❌ Situações Não Aceitas
                </h3>
                <ul style={{ 
                  color: '#555',
                  paddingLeft: '20px',
                  margin: 0
                }}>
                  <li style={{ marginBottom: '10px' }}>
                    Produtos fora do prazo de 7 dias
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Itens usados ou com sinais de uso
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Embalagem original violada ou danificada
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Acessórios ou manuais faltando
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Produtos sem nota fiscal
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Processo de Reembolso */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.4rem' : '1.6rem',
              marginBottom: '20px'
            }}>
              Processo de Reembolso
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: '15px',
              textAlign: 'center'
            }}>
              <div style={{ padding: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#095400',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  fontWeight: 'bold'
                }}>1</div>
                <p style={{ 
                  color: '#555', 
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Solicitação
                </p>
                <p style={{ 
                  color: '#666', 
                  margin: '5px 0 0 0',
                  fontSize: '0.8rem'
                }}>
                  Em até 7 dias corridos
                </p>
              </div>

              <div style={{ padding: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#095400',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  fontWeight: 'bold'
                }}>2</div>
                <p style={{ 
                  color: '#555', 
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Análise
                </p>
                <p style={{ 
                  color: '#666', 
                  margin: '5px 0 0 0',
                  fontSize: '0.8rem'
                }}>
                  Verificação do produto
                </p>
              </div>

              <div style={{ padding: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#095400',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  fontWeight: 'bold'
                }}>3</div>
                <p style={{ 
                  color: '#555', 
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Aprovação
                </p>
                <p style={{ 
                  color: '#666', 
                  margin: '5px 0 0 0',
                  fontSize: '0.8rem'
                }}>
                  Confirmação da devolução
                </p>
              </div>

              <div style={{ padding: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#095400',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  fontWeight: 'bold'
                }}>4</div>
                <p style={{ 
                  color: '#555', 
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Reembolso
                </p>
                <p style={{ 
                  color: '#666', 
                  margin: '5px 0 0 0',
                  fontSize: '0.8rem'
                }}>
                  Em até 7 dias úteis
                </p>
              </div>
            </div>
          </section>

          {/* Informações Importantes */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.4rem' : '1.6rem',
              marginBottom: '15px'
            }}>
              Informações Importantes
            </h2>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              borderLeft: '4px solid #095400'
            }}>
              <p style={{ 
                color: '#555', 
                margin: '0 0 15px 0',
                fontSize: '1rem'
              }}>
                <strong>Método de Reembolso:</strong> O valor será reembolsado pelo mesmo método de pagamento utilizado na compra original.
              </p>
              <p style={{ 
                color: '#555', 
                margin: '0 0 15px 0',
                fontSize: '1rem'
              }}>
                <strong>Prazo de Crédito:</strong> O reembolso será processado em até 7 dias úteis após a análise e aprovação da devolução.
              </p>
              <p style={{ 
                color: '#555', 
                margin: 0,
                fontSize: '1rem'
              }}>
                <strong>Conforme CDC:</strong> Nossa política está em conformidade com o Código de Defesa do Consumidor.
              </p>
            </div>
          </section>

          {/* Contato */}
          <section style={{ textAlign: 'center' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.4rem' : '1.6rem',
              marginBottom: '15px'
            }}>
              Dúvidas?
            </h2>
            <p style={{ 
              color: '#555', 
              marginBottom: '20px',
              fontSize: '1rem'
            }}>
              Entre em contato conosco para esclarecer qualquer dúvida sobre nossa política de devolução.
            </p>
            <a 
              href="https://wa.me/5511913572902" 
              style={{
                display: 'inline-block',
                backgroundColor: '#095400',
                color: 'white',
                padding: isMobile ? '12px 25px' : '15px 35px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: isMobile ? '1rem' : '1.1rem',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#074000'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#095400'}
              target="_blank" 
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </section>

        </div>

        {/* Rodapé */}
        <footer style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '0.85rem',
          padding: '20px 0',
          borderTop: '1px solid #eee'
        }}>
          <div style={{ marginBottom: '15px' }}>
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
          </div>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </>
  );
}
