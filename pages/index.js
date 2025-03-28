import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
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
        {/* Cabeçalho Premium */}
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

        {/* Destaques de Credibilidade */}
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

        {/* Seção do Vídeo (Reduzido) */}
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

        {/* Chamada para Ação Premium */}
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
            ACESSAR CATÁLOGO COMPLETO →
          </Link>
        </section>

        {/* Rodapé Profissional */}
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