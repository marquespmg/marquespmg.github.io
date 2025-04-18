import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Ícone e metadados */}
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

        {/* Meta Pixel Code - Versão Corrigida para Todos os Eventos */}
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
            
            // Inicialização do Pixel
            fbq('init', '9491377657643670');
            fbq('track', 'PageView');
            
            // Função para garantir que o pixel está carregado
            function waitForFbq(callback) {
              if(typeof fbq === 'function') {
                callback();
              } else {
                setTimeout(function() { waitForFbq(callback); }, 200);
              }
            }
            
            // Funções globais para todos os eventos
            window.trackViewContent = function(product) {
              waitForFbq(function() {
                fbq('track', 'ViewContent', {
                  content_name: product.name,
                  content_ids: [product.id],
                  content_type: 'product',
                  value: product.price,
                  currency: 'BRL'
                });
              });
            };
            
            window.trackAddToCart = function(product) {
              waitForFbq(function() {
                fbq('track', 'AddToCart', {
                  content_name: product.name,
                  content_ids: [product.id],
                  content_type: 'product',
                  value: product.price,
                  currency: 'BRL'
                });
              });
            };
            
            window.trackInitiateCheckout = function(products, totalValue) {
              waitForFbq(function() {
                fbq('track', 'InitiateCheckout', {
                  content_ids: products.map(item => item.id),
                  content_type: 'product',
                  num_items: products.length,
                  value: totalValue,
                  currency: 'BRL'
                });
              });
            };
            
            window.trackLead = function() {
              waitForFbq(function() {
                fbq('track', 'Lead', {
                  content_category: 'sign_up',
                  content_name: 'Cadastro realizado com sucesso',
                  currency: 'BRL',
                  value: 0.00
                });
              });
            };
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
      </body>
    </Html>
  );
}
