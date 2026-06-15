// pages/api/gerar-texto-ia.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { produtos, temaPromocao } = req.body;

  console.log('📝 Gerando texto com IA para', produtos.length, 'produtos');

  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return res.status(200).json({ 
      success: true, 
      texto: gerarTextoFallback(produtos, temaPromocao)
    });
  }

  try {
    // Prepara a lista de produtos com cálculo correto
    let listaProdutos = '';
    produtos.forEach((p, idx) => {
      const unidade = p.unit.toLowerCase();
      let unidadeTexto = '';
      let valorUnitario = null;
      let tipoUnitario = '';
      
      // Extrai quantidade
      let quantidadePCT = null;
      
      // PRIORIDADE: Procura por PCT
      const pctMatch = p.name.match(/\([A-Z]+\s+(\d+)\s*PCT/i);
      if (pctMatch) {
        quantidadePCT = parseInt(pctMatch[1]);
      }
      
      if (unidade === 'cx') {
        unidadeTexto = 'caixa';
        if (quantidadePCT) {
          valorUnitario = p.price / quantidadePCT;
          tipoUnitario = 'pacote';
        }
      } 
      else if (unidade === 'fd') {
        unidadeTexto = 'fardo';
        if (quantidadePCT) {
          valorUnitario = p.price / quantidadePCT;
          tipoUnitario = 'pacote';
        }
      }
      else if (unidade === 'kg') unidadeTexto = 'kg';
      else if (unidade === 'un') unidadeTexto = 'unidade';
      else unidadeTexto = unidade;
      
      let linhaProduto = `${idx + 1}. ${p.name} - ${p.formattedPrice} / ${unidadeTexto}`;
      if (valorUnitario && tipoUnitario) {
        linhaProduto += ` (≈ ${formatarPrecoTexto(valorUnitario)} / ${tipoUnitario})`;
      }
      listaProdutos += linhaProduto + '\n';
    });

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    const prompt = `Crie um texto promocional curto para WhatsApp.

TEMA: "${temaPromocao}"
DATA: ${dataAtual}

PRODUTOS:
${listaProdutos}

REGRAS:
- Para produtos em CAIXA ou FARDO, mostre o valor por PACOTE (não por KG)
- Ex: "R$ 226,29 / caixa (≈ R$ 22,63 / pacote)"
- NÃO use valor por KG a menos que o produto seja por KG
- A oferta é válida APENAS HOJE (${dataAtual})
- Use *negrito* para o tema
- Máximo 400 caracteres
- Inclua telefone (31) 99999-9999 no final`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.5-flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 600
      })
    });

    const data = await response.json();
    
    let textoGerado = '';
    
    if (data.choices?.[0]?.message?.content) {
      textoGerado = data.choices[0].message.content;
      if (textoGerado.length < 80) {
        textoGerado = gerarTextoFallback(produtos, temaPromocao);
      }
    } else {
      textoGerado = gerarTextoFallback(produtos, temaPromocao);
    }
    
    res.status(200).json({ success: true, texto: textoGerado });
    
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(200).json({ 
      success: true, 
      texto: gerarTextoFallback(produtos, temaPromocao)
    });
  }
}

function formatarPrecoTexto(preco) {
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}

function gerarTextoFallback(produtos, temaPromocao) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  
  let texto = `🏷️ *${temaPromocao.toUpperCase()}* 🏷️\n`;
  texto += `📅 ${dataAtual}\n\n`;
  
  produtos.forEach((produto, index) => {
    const unidade = produto.unit.toLowerCase();
    let unidadeTexto = '';
    let valorUnitario = null;
    let unidadeUnitario = '';
    
    // Extrai quantidade de PACOTES (PCT)
    let quantidadePCT = null;
    const pctMatch = produto.name.match(/\([A-Z]+\s+(\d+)\s*PCT/i);
    if (pctMatch) {
      quantidadePCT = parseInt(pctMatch[1]);
    }
    
    if (unidade === 'cx') {
      unidadeTexto = 'caixa';
      if (quantidadePCT) {
        valorUnitario = produto.price / quantidadePCT;
        unidadeUnitario = 'pacote';
      }
    } 
    else if (unidade === 'fd') {
      unidadeTexto = 'fardo';
      if (quantidadePCT) {
        valorUnitario = produto.price / quantidadePCT;
        unidadeUnitario = 'pacote';
      }
    }
    else if (unidade === 'kg') unidadeTexto = 'kg';
    else if (unidade === 'un') unidadeTexto = 'unidade';
    else unidadeTexto = unidade;
    
    texto += `${index + 1}️⃣ *${produto.name}*\n`;
    
    if (valorUnitario && unidadeUnitario) {
      texto += `   💰 ${produto.formattedPrice} / ${unidadeTexto} (≈ ${formatarPrecoTexto(valorUnitario)} / ${unidadeUnitario})\n\n`;
    } else {
      texto += `   💰 ${produto.formattedPrice} / ${unidadeTexto}\n\n`;
    }
  });
  
  texto += `⏰ *OFERTA VÁLIDA APENAS HOJE (${dataAtual})*\n`;
  texto += `📞 *FAÇA SEU PEDIDO:* (31) 99999-9999\n`;
  texto += `🚚 Entregamos em toda região!`;
  
  return texto;
}