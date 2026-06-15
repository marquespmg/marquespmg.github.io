export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { tema, largura, altura, aspectRatio } = req.body;

  console.log('🎨 Gerando fundo com Nano Banana 2');
  console.log('📝 Tema:', tema);
  console.log('📐 Formato:', aspectRatio || `${largura}x${altura}`);

  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key não configurada' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.1-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: `Crie um fundo para encarte de supermercado.

TEMA: "${tema}"

REGRAS IMPORTANTES:
- APENAS fundo decorativo, SEM NENHUM TEXTO, SEM LETRAS, SEM NÚMEROS
- NÃO coloque nenhum texto na imagem
- Fundo bonito, profissional, com texturas ou gradientes relacionados ao tema
- Cores vibrantes mas que não atrapalhem a leitura de textos
- Apenas o fundo, sem produtos, sem pessoas, sem palavras`
          }
        ],
        modalities: ['image', 'text'],
        image_config: {
          aspect_ratio: aspectRatio || '16:9',
          image_size: '1K'
        }
      })
    });

    const data = await response.json();
    
    let imageUrl = null;
    
    if (data.choices?.[0]?.message?.images?.[0]?.image_url?.url) {
      imageUrl = data.choices[0].message.images[0].image_url.url;
    } else if (data.choices?.[0]?.message?.images?.[0]?.url) {
      imageUrl = data.choices[0].message.images[0].url;
    }
    
    if (imageUrl) {
      if (imageUrl.startsWith('data:image')) {
        return res.status(200).json({ success: true, imageUrl: imageUrl });
      }
      
      try {
        const imgResponse = await fetch(imageUrl);
        const buffer = await imgResponse.arrayBuffer();
        const base64 = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
        return res.status(200).json({ success: true, imageUrl: base64 });
      } catch {
        return res.status(200).json({ success: true, imageUrl: imageUrl });
      }
    } else {
      const svg = `<svg width="${largura}" height="${altura}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#095400"/>
        <circle cx="20%" cy="30%" r="200" fill="rgba(255,255,255,0.05)"/>
        <circle cx="80%" cy="70%" r="250" fill="rgba(255,255,255,0.03)"/>
      </svg>`;
      const base64 = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
      return res.status(200).json({ success: true, imageUrl: base64 });
    }
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao gerar fundo' });
  }
}