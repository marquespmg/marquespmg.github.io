import React, { useEffect, useState } from 'react';

// Função para gerar slug (MESMA do seu arquivo principal)
function gerarSlug(texto) {
  if (!texto) return '';
  
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .substring(0, 80);
}

export default function ShareButtons(props) {
  const { articleTitle, articleId, articlesPerPage = 1 } = props;
  const [shareUrl, setShareUrl] = useState('');
  const [isReady, setIsReady] = useState(false);

  // Geração da URL CORRIGIDA com slug amigável
  useEffect(() => {
    if (typeof window !== 'undefined' && articleId && articleTitle) {
      // Gera o slug do título do artigo atual
      const slug = gerarSlug(articleTitle);
      
      // URL com slug amigável
      const shareUrl = `${window.location.origin}/food-news/${slug}`;
      
      console.log('🔗 URL gerada com slug:', shareUrl);
      console.log('📝 Título do artigo:', articleTitle);
      console.log('🆔 ID do artigo:', articleId);
      
      setShareUrl(shareUrl);
      setIsReady(true);
    }
  }, [articleId, articleTitle]); // Adiciona articleTitle nas dependências

  const message = `📖 "${articleTitle}" - Marques Vendas PMG! 👇\n${shareUrl}`;

  const copyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          // Melhor que alert: mostra mensagem temporária
          const btn = document.getElementById(`copy-btn-${articleId}`);
          if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✓ Copiado!';
            btn.style.backgroundColor = '#095400';
            
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.backgroundColor = '#333';
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Erro ao copiar:', err);
        });
    }
  };

  const btnStyle = {
    color: '#fff', 
    padding: '4px 8px', 
    borderRadius: '4px',
    textDecoration: 'none', 
    border: 'none',
    cursor: 'pointer', 
    fontSize: '11px',
    flex: 1,
    textAlign: 'center',
    transition: 'all 0.2s ease'
  };

  if (!isReady) {
    return (
      <div style={{marginTop: '8px', padding: '6px 0', borderTop: '1px solid #f0f0f0'}}>
        <p style={{fontSize: '11px', color: '#666', marginBottom: '4px'}}>Compartilhe:</p>
        <div style={{display: 'flex', gap: '4px'}}>
          <div style={{...btnStyle, backgroundColor: '#ccc', opacity: 0.5}}>WhatsApp</div>
          <div style={{...btnStyle, backgroundColor: '#ccc', opacity: 0.5}}>Facebook</div>
          <div style={{...btnStyle, backgroundColor: '#ccc', opacity: 0.5}}>Copiar</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{marginTop: '8px', padding: '6px 0', borderTop: '1px solid #f0f0f0'}}>
      <p style={{fontSize: '11px', color: '#666', marginBottom: '4px'}}>Compartilhe:</p>
      
      <div style={{display: 'flex', gap: '4px'}}>
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{...btnStyle, backgroundColor: '#25D366'}}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          WhatsApp
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(articleTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{...btnStyle, backgroundColor: '#1877F2'}}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          Facebook
        </a>

        {/* Copiar Link */}
        <button
          id={`copy-btn-${articleId}`}
          onClick={copyLink}
          style={{...btnStyle, backgroundColor: '#333'}}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          Copiar Link
        </button>
      </div>
      
      {/* URL que será compartilhada (para debug) */}
      <div style={{
        marginTop: '4px',
        fontSize: '9px',
        color: '#888',
        wordBreak: 'break-all',
        display: 'none' // Remove para ver a URL
      }}>
        URL: {shareUrl}
      </div>
    </div>
  );
}
