// pages/_document.js
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
        
        {/* ========== CONFIGURAÇÕES PWA ========== */}
        {/* Manifest PWA */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color - usado no PWA e navegador */}
        <meta name="theme-color" content="#095400" />
        <meta name="msapplication-TileColor" content="#095400" />
        <meta name="msapplication-TileImage" content="/logo.png" />
        
        {/* iOS specific - para PWA no iPhone */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PMG Atacadista" />
        
        {/* Android specific */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="PMG Atacadista" />
		<link rel="icon" type="image/png" sizes="32x32" href="/logo-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo-180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/logo-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/logo-144x144.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/logo-120x120.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/logo-114x114.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/logo-76x76.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/logo-72x72.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileImage" content="/logo-144x144.png" />
        
        {/* Ícones para PWA */}
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="apple-touch-icon-precomposed" href="/logo.png" />
        
        {/* ========== FIM CONFIGURAÇÕES PWA ========== */}
        
        {/* Links de Política e Termos para SEO */}
        <link rel="privacy-policy" href="/politica-de-privacidade" />
        <link rel="terms-of-service" href="/termos" />
        
        {/* Verificação do Google */}
        <meta name="google-site-verification" content="OM6ZA5lhy6ZCDjG8LU-PTFcF4QORtpkNh7f_JHt5Ctc" />

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

        {/* ========== REGISTRO DO SERVICE WORKER ========== */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js')
                    .then(function(registration) {
                      console.log('✅ Service Worker registrado com sucesso:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('❌ Falha ao registrar Service Worker:', error);
                    });
                });
              }
              
              // Evento para quando o PWA for instalado
              window.addEventListener('beforeinstallprompt', function(e) {
                console.log('📱 PWA pode ser instalado');
                // Você pode guardar o evento para mostrar um botão de instalação depois
                window.deferredPrompt = e;
              });
            `,
          }}
        />
        {/* ========== FIM SERVICE WORKER ========== */}

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
