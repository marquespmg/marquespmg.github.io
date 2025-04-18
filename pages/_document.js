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

        {/* Meta Pixel Code - Detecção Automática */}
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
            
            // Sistema de detecção automática
            window.autoTrackEvents = {
              lastProductViewed: null,
              
              init: function() {
                this.detectViewContent();
                this.detectAddToCart();
                this.detectInitiateCheckout();
                this.detectLead();
              },
              
              detectViewContent: function() {
                // Detecta páginas de produto
                if(window.location.pathname.includes('/produtos/')) {
                  const product = this.extractProductData();
                  if(product) {
                    fbq('track', 'ViewContent', {
                      content_name: product.name,
                      content_ids: [product.id],
                      content_type: 'product',
                      value: product.price,
                      currency: 'BRL'
                    });
                    this.lastProductViewed = product;
                  }
                }
              },
              
              extractProductData: function() {
                // Tenta extrair dados do produto da página
                try {
                  const productName = document.querySelector('h1.product-title')?.innerText;
                  const productId = window.location.pathname.split('/').pop();
                  const productPrice = parseFloat(
                    document.querySelector('.product-price')?.innerText
                      .replace('R$', '')
                      .replace(',', '.')
                      .trim()
                  );
                  
                  if(productName && productId && productPrice) {
                    return {
                      id: productId,
                      name: productName,
                      price: productPrice
                    };
                  }
                } catch(e) {
                  console.log('Erro ao extrair dados do produto:', e);
                }
                return null;
              },
              
              detectAddToCart: function() {
                // Monitora cliques em botões de adicionar ao carrinho
                document.addEventListener('click', (e) => {
                  const btn = e.target.closest('button');
                  if(btn && (
                    btn.innerText.includes('Adicionar ao Carrinho') || 
                    btn.innerText.includes('Comprar') ||
                    btn.id.includes('add-to-cart')
                  )) {
                    if(this.lastProductViewed) {
                      fbq('track', 'AddToCart', {
                        content_name: this.lastProductViewed.name,
                        content_ids: [this.lastProductViewed.id],
                        content_type: 'product',
                        value: this.lastProductViewed.price,
                        currency: 'BRL'
                      });
                    }
                  }
                });
              },
              
              detectInitiateCheckout: function() {
                // Detecta acesso à página de checkout
                if(window.location.pathname.includes('/checkout')) {
                  // Você precisaria ter acesso ao carrinho global
                  if(window.__cartData) {
                    fbq('track', 'InitiateCheckout', {
                      content_ids: window.__cartData.items.map(i => i.id),
                      num_items: window.__cartData.items.length,
                      value: window.__cartData.total,
                      currency: 'BRL'
                    });
                  }
                }
              },
              
              detectLead: function() {
                // Detecta mensagens de sucesso de cadastro
                const observer = new MutationObserver(() => {
                  if(document.body.innerText.includes('Cadastro realizado com sucesso!')) {
                    fbq('track', 'Lead', {
                      content_name: 'Cadastro realizado',
                      currency: 'BRL',
                      value: 0.00
                    });
                  }
                });
                
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
              }
            };
            
            // Inicia a detecção quando o DOM estiver pronto
            if(document.readyState === 'complete') {
              window.autoTrackEvents.init();
            } else {
              document.addEventListener('DOMContentLoaded', function() {
                window.autoTrackEvents.init();
              });
            }
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
