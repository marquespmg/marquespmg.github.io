import React, { useEffect, useState } from 'react';

export default function ShareButtons({ articleTitle }) {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') setShareUrl(window.location.href);
  }, []);

  const message = `📖 "${articleTitle}" - Marques Vendas PMG! 👇\n${shareUrl}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('🔗 Copiado!');
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
          Copiar Link
        </button>
      </div>
    </div>
  );
}
