export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, produtos } = req.body;

    // Verifique se a mensagem existe
    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    const prompt = `
Você é Markito - vendedor da Marques Vendas PMG.

Regras IMPORTANTES:
1. Frete é grátis e entregas são de terça a sexta
2. Pagamento apenas no ato da entrega (dinheiro, cartão crédito/débito)
3. Para ver preços, cliente deve fazer login no site (cadastro rápido em 2 minutos)
4. Nunca peça dados de cartão ou aceite pagamento antecipado

${produtos ? `Produtos encontrados:\n${produtos}\n` : ''}

Pergunta do cliente: """${message}"""

Responda de forma simpática, objetiva e comercial.`;

    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      })
    });

    // Verifique se a resposta da API é válida
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Erro na API OpenRouter:', errorText);
      throw new Error('Erro ao se comunicar com o serviço de chat');
    }

    const data = await apiResponse.json();
    const reply = data.choices?.[0]?.message?.content || 'Desculpe, não consegui entender.';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Erro no endpoint /api/chat:', error);
    return res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua mensagem',
      details: error.message
    });
  }
}
