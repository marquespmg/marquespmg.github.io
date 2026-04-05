import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* ===== META TAGS ESSENCIAIS ===== */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="description" content="MP na Brasa - Kits de churrasco gourmet em Joanópolis. Carnes premium, acompanhamentos selecionados e entrega rápida. Peça já seu churrasco!" />
        <meta name="keywords" content="churrasco joanópolis, kit churrasco, churrasco gourmet, carnes premium, picanha, entrega de churrasco, MP na Brasa" />
        <meta name="author" content="MP na Brasa" />
        <meta name="robots" content="index, follow" />
        
        {/* ===== COR DO TEMA ===== */}
        <meta name="theme-color" content="#8B0000" />
        <meta name="msapplication-TileColor" content="#8B0000" />
        
        {/* ===== LINKS DE POLÍTICA E TERMOS PARA SEO ===== */}
        <link rel="privacy-policy" href="/politica-de-privacidade" />
        <link rel="terms-of-service" href="/termos" />
        
        {/* ===== VERIFICAÇÃO DO GOOGLE ===== */}
        <meta name="google-site-verification" content="OM6ZA5lhy6ZCDjG8LU-PTFcF4QORtpkNh7f_JHt5Ctc" />

        {/* ===== FAVICON MP NA BRASA ===== */}
        <link rel="icon" href="/Logo MP cafe.png" />
        <link rel="shortcut icon" href="/Logo MP cafe.png" />
        <link rel="apple-touch-icon" href="/Logo MP cafe.png" />
        <link rel="apple-touch-icon-precomposed" href="/Logo MP cafe.png" />
        
        {/* ===== PRÉ-CONEXÕES PARA MELHOR PERFORMANCE ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />

        {/* ===== GOOGLE ANALYTICS ===== */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-L9QFXDT8PL"></script>
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

        {/* ===== META PIXEL ===== */}
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

        {/* ===== FALLBACK PARA JAVASCRIPT DESABILITADO ===== */}
        <noscript>
          <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            background: '#f8f8f8',
            padding: '12px',
            textAlign: 'center',
            borderTop: '2px solid #8B0000',
            zIndex: 9999,
            fontFamily: 'Arial, sans-serif'
          }}>
            <p style={{ margin: '0 0 8px 0', color: '#333', fontSize: '14px' }}>
              🔥 MP na Brasa - Churrasco Gourmet em Joanópolis
            </p>
            <div>
              <a 
                href="/politica-de-privacidade" 
                style={{
                  color: '#8B0000',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                  margin: '0 15px',
                  fontSize: '13px'
                }}
              >
                Política de Privacidade
              </a>
              <a 
                href="/termos" 
                style={{
                  color: '#8B0000',
                  textDecoration: 'underline',
                  margin: '0 15px',
                  fontSize: '13px'
                }}
              >
                Termos de Uso
              </a>
              <a 
                href="/mp" 
                style={{
                  color: '#8B0000',
                  textDecoration: 'underline',
                  margin: '0 15px',
                  fontSize: '13px'
                }}
              >
                Kits de Churrasco
              </a>
            </div>
          </div>
        </noscript>
      </body>
    </Html>
  );
}
