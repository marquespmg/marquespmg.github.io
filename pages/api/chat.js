export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Mensagem é obrigatória' });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Você é Markito, assistente da Marques Vendas PMG. Regras: Frete grátis, pagamento na entrega. Pergunta: """${message}""" Responda como vendedor profissional.`
        }]
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro no servidor',
      details: error.message 
    });
  }
}
