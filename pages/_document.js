// pages/_document.js - VERSÃO LIMPA (SEM SCRIPTS DE TERCEIROS)
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Meta Tags Essenciais */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="description" content="Distribuidora autorizada com os melhores produtos para seu negócio. Qualidade garantida e atendimento especializado." />
        
        {/* Forçar tema claro no Android */}
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="darkreader-lock" content="yes" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#095400" />
        
        {/* Ícones */}
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        
        {/* Links de Política e Termos para SEO */}
        <link rel="privacy-policy" href="/politica-de-privacidade" />
        <link rel="terms-of-service" href="/termos" />
        
        {/* Verificação do Google */}
        <meta name="google-site-verification" content="OM6ZA5lhy6ZCDjG8LU-PTFcF4QORtpkNh7f_JHt5Ctc" />
      </Head>
      <body>
        <Main />
        <NextScript />

        {/* Fallback para JavaScript desabilitado */}
        <noscript>
          <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            background: '#f8f8f8',
            padding: '10px',
            textAlign: 'center',
            borderTop: '1px solid #ddd',
            zIndex: 9999
          }}>
            <a 
              href="/politica-de-privacidade" 
              style={{
                color: '#095400',
                textDecoration: 'underline',
                fontWeight: 'bold',
                margin: '0 15px'
              }}
            >
              Política de Privacidade
            </a>
            <a 
              href="/termos" 
              style={{
                color: '#095400',
                margin: '0 15px'
              }}
            >
              Termos de Uso
            </a>
          </div>
        </noscript>
      </body>
    </Html>
  );
}
