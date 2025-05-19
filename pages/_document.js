import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Meta Tags Essenciais */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Distribuidora autorizada com os melhores produtos para seu negócio. Qualidade garantida e atendimento especializado." />
        
        {/* Links de Política e Termos para SEO */}
        <link rel="privacy-policy" href="/politica-de-privacidade" />
        <link rel="terms-of-service" href="/termos" />
        
        {/* Verificação do Google */}
        <meta name="google-site-verification" content="OM6ZA5lhy6ZCDjG8LU-PTFcF4QORtpkNh7f_JHt5Ctc" />

        {/* Ícone */}
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-89LSRYEHF1"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-89LSRYEHF1', {
              page_path: window.location.pathname,
            });
          `,
        }} />

        {/* Meta Pixel */}
        <script dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '9491377657643670');
            fbq('track', 'PageView');
          `,
        }} />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=9491377657643670&ev=PageView&noscript=1" />
        </noscript>
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
