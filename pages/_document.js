import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Ícone da aba do navegador */}
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

        {/* Meta Pixel Code - Completo com todos os eventos padrão */}
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
            
            // Funções globais para eventos customizados
            window.trackFacebookEvent = function(eventName, parameters) {
              if(typeof fbq !== 'undefined') {
                fbq('track', eventName, parameters);
              }
            };
            
            window.trackViewContent = function(product) {
              if(typeof fbq !== 'undefined') {
                fbq('track', 'ViewContent', {
                  content_name: product.name,
                  content_ids: [product.id],
                  content_type: 'product',
                  value: product.price,
                  currency: 'BRL'
                });
              }
            };
            
            window.trackAddToCart = function(product) {
              if(typeof fbq !== 'undefined') {
                fbq('track', 'AddToCart', {
                  content_name: product.name,
                  content_ids: [product.id],
                  content_type: 'product',
                  value: product.price,
                  currency: 'BRL'
                });
              }
            };
            
            window.trackInitiateCheckout = function(products, total) {
              if(typeof fbq !== 'undefined') {
                fbq('track', 'InitiateCheckout', {
                  content_ids: products.map(item => item.id),
                  content_type: 'product',
                  num_items: products.length,
                  value: total,
                  currency: 'BRL'
                });
              }
            };
            
            window.trackLead = function() {
              if(typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                  content_name: 'Lead Form Submission',
                  currency: 'BRL',
                  value: 0.00
                });
              }
            };
          `,
        }} />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=9491377657643670&ev=PageView&noscript=1" />
        </noscript>
        {/* End Meta Pixel Code */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
