import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function PoliticaDevolucao() {
  const [isMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  return (
    <>
      <Head>
        <title>Política de Devolução - Marques Vendas PMG</title>
        <meta name="description" content="Conheça nossa política de trocas e devoluções da Marques Vendas PMG" />
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
            Política de Devolução
          </h1>
          <p style={{ color: '#666', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            Conheça nossos procedimentos para trocas e devoluções
          </p>
        </header>

        {/* Conteúdo */}
        <div style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
          padding: isMobile ? '20px' : '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          {/* Aviso Importante */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              ⚠️ Atenção Importante
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
              Nossa Política
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Na <strong>PMG Atacadista</strong>, priorizamos a satisfação total de nossos clientes. 
              Nossa política de devolução foi elaborada para garantir transparência e segurança 
              em todas as transações.
            </p>

            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <strong>Devolução Aceita:</strong> A PMG aceita devolução <strong>apenas no ato da entrega</strong>, 
              antes da assinatura da nota fiscal, se o cliente notar algo que não está conforme seu pedido.
            </p>

            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <strong>Devolução Não Aceita:</strong> Não aceitamos devoluções após a assinatura da nota fiscal 
              e conferência do pedido.
            </p>
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
              <strong>O que fazer durante a entrega:</strong>
            </p>
            <ul style={{ 
              color: '#555',
              paddingLeft: '20px',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <li style={{ marginBottom: '8px' }}>
                Conferir o pedido antes de assinar qualquer documento
              </li>
              <li style={{ marginBottom: '8px' }}>
                Verificar se todos os produtos correspondem ao pedido
              </li>
              <li style={{ marginBottom: '8px' }}>
                Checar a integridade das embalagens
              </li>
              <li style={{ marginBottom: '8px' }}>
                Confirmar quantidades e especificações
              </li>
            </ul>

            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Se houver <strong>qualquer divergência</strong> entre o pedido e o que foi entregue, 
              ou se encontrar produtos em condições inadequadas:
            </p>

            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem',
              fontWeight: '600'
            }}>
              <strong>NÃO ASSINE A NOTA FISCAL</strong> e entre em contato imediatamente.
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
              Se tiver algo fora do especificado na Nota Fiscal, entre em contato <strong>antes</strong> 
              de assinar a nota fiscal para tomarmos todas as ações necessárias:
            </p>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '1rem' : '1.1rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              📱 (11) 91357-2902
            </p>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
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
                💬 Chamar no WhatsApp
              </a>
            </div>
          </section>

          {/* Situações Pós-entrega */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              Situações Pós-entrega
            </h2>
            
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Caso ocorra <strong>qualquer reclamação posterior</strong> depois de ter sido assinado a nota fiscal 
              e conferido o pedido, <strong>infelizmente não há o que fazer</strong>.
            </p>

            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <strong>Por que essa política é necessária?</strong>
            </p>
            <ul style={{ 
              color: '#555',
              paddingLeft: '20px',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <li style={{ marginBottom: '8px' }}>
                Garantir a qualidade do produto no momento exato da entrega
              </li>
              <li style={{ marginBottom: '8px' }}>
                Evitar fraudes e más utilizações
              </li>
              <li style={{ marginBottom: '8px' }}>
                Manter preços competitivos para todos os clientes
              </li>
              <li style={{ marginBottom: '8px' }}>
                Assegurar procedimentos claros e transparentes
              </li>
            </ul>
          </section>

          {/* Resumo Final */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              Resumo da Política
            </h2>
            
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <strong>Fazer:</strong>
            </p>
            <ul style={{ 
              color: '#555',
              paddingLeft: '20px',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <li style={{ marginBottom: '8px' }}>Conferir pedido na hora da entrega</li>
              <li style={{ marginBottom: '8px' }}>Recusar assinatura se houver problema</li>
              <li style={{ marginBottom: '8px' }}>Ligar (11) 91357-2902 se necessário</li>
              <li style={{ marginBottom: '8px' }}>Resolver tudo no ato da entrega</li>
            </ul>

            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <strong>Não Fazer:</strong>
            </p>
            <ul style={{ 
              color: '#555',
              paddingLeft: '20px',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <li style={{ marginBottom: '8px' }}>Assinar nota sem conferir</li>
              <li style={{ marginBottom: '8px' }}>Aceitar produtos com divergências</li>
              <li style={{ marginBottom: '8px' }}>Tentar resolver depois da assinatura</li>
              <li style={{ marginBottom: '8px' }}>Deixar para reclamar posteriormente</li>
            </ul>
          </section>

          {/* Conclusão */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              color: '#095400', 
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>
              Conclusão
            </h2>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              Na <strong>PMG Atacadista</strong>, acreditamos na transparência e na qualidade de nossos produtos. 
              Nossa política clara e objetiva visa proteger tanto o cliente quanto nossa empresa, 
              garantindo que todas as transações sejam justas e bem documentadas.
            </p>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              fontSize: isMobile ? '0.95rem' : '1rem'
            }}>
              <strong>Lembre-se:</strong> Qualquer problema com o pedido deve ser resolvido 
              <strong> no ato da entrega</strong>. Esta é a única forma de garantirmos uma solução rápida e eficaz.
            </p>
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
