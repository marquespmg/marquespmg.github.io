import React, { useEffect, useState } from 'react';

export default function ShareButtons(props) {
  // Debug para ver TODOS os props que estão chegando
  console.log('📦 Todos os props:', props);
  console.log('🎯 articleId:', props.articleId);
  console.log('🎯 articleTitle:', props.articleTitle);
  
  const { articleTitle, articleId } = props;
  const [shareUrl, setShareUrl] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('🔧 useEffect - articleId:', articleId);
    
    if (typeof window !== 'undefined' && articleId) {
      const currentUrl = `${window.location.origin}${window.location.pathname}#artigo-${articleId}`;
      console.log('🔧 URL gerada:', currentUrl);
      setShareUrl(currentUrl);
      setIsReady(true);
    }
  }, [articleId]);

  const message = `📖 "${articleTitle}" - Marques Vendas PMG! 👇\n${shareUrl}`;

  const copyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      alert('🔗 Copiado!');
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
    textAlign: 'center'
  };

  if (!isReady) {
    console.log('⏳ ShareButtons - Não está pronto, articleId:', articleId);
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

  console.log('✅ ShareButtons - PRONTO! URL:', shareUrl);
  return (
    <div style={{marginTop: '8px', padding: '6px 0', borderTop: '1px solid #f0f0f0'}}>
      <p style={{fontSize: '11px', color: '#666', marginBottom: '4px'}}>Compartilhe:</p>
      
      <div style={{display: 'flex', gap: '4px'}}>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{...btnStyle, backgroundColor: '#25D366'}}
        >
          WhatsApp
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(articleTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{...btnStyle, backgroundColor: '#1877F2'}}
        >
          Facebook
        </a>

        <button
          onClick={copyLink}
          style={{...btnStyle, backgroundColor: '#333'}}
        >
          Copiar
        </button>
      </div>
    </div>
  );
}
