import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link rel="icon" href="/logo.png" />
        <meta name="description" content="Sua loja de produtos especiais" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-89LSRYEHF1"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-89LSRYEHF1');
          `,
        }} />

        {/* Meta Pixel Code - Versão Simplificada e Corrigida */}
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
            
            // Função auxiliar para verificar se o pixel está carregado
            function waitForFbq(callback) {
              if(typeof fbq === 'function') {
                callback();
              } else {
                setTimeout(function() { waitForFbq(callback); }, 100);
              }
            }
            
            // Detecção automática de ViewContent em páginas de produto
            if(window.location.pathname.includes('/produtos')) {
              waitForFbq(function() {
                fbq('track', 'ViewContent', {
                  content_name: document.title,
                  content_ids: [window.location.pathname.split('/').pop()],
                  content_type: 'product',
                  currency: 'BRL'
                });
              });
            }
            
            // Detecção de AddToCart via mutation observer
            new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                  Array.from(mutation.addedNodes).forEach(function(node) {
                    if (node.nodeType === 1 && node.innerText && 
                        (node.innerText.includes('Item adicionado!') || 
                         node.innerText.includes('Adicionado ao carrinho'))) {
                      waitForFbq(function() {
                        fbq('track', 'AddToCart', {
                          content_type: 'product',
                          currency: 'BRL'
                        });
                      });
                    }
                  });
                }
              });
            }).observe(document.body, {
              childList: true,
              subtree: true
            });
            
            // Detecção de InitiateCheckout
            if(window.location.pathname.includes('/checkout') {
              waitForFbq(function() {
                fbq('track', 'InitiateCheckout', {
                  content_type: 'product',
                  currency: 'BRL'
                });
              });
            }
            
            // Detecção de Lead
            if(document.body.innerText.includes('Cadastro realizado com sucesso!')) {
              waitForFbq(function() {
                fbq('track', 'Lead', {
                  content_name: 'Cadastro realizado',
                  currency: 'BRL'
                });
              });
            }
          `
        }} />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=9491377657643670&ev=PageView&noscript=1" />
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
