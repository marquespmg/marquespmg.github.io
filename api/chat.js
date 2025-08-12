export default async function handler(req, res) {
  // Configuração de CORS mais segura
  const allowedOrigins = [
    'https://marquespmg.github.io',
    'http://localhost:3000' // Para desenvolvimento
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed_methods: ['POST']
    });
  }

  try {
    // Verificação profunda do corpo da requisição
    if (!req.body || typeof req.body !== 'object') {
      console.error('Corpo da requisição inválido:', req.body);
      return res.status(400).json({
        error: 'Formato inválido',
        message: 'O corpo da requisição deve ser um objeto JSON'
      });
    }

    const { message, produtos } = req.body;

    // Validação mais rigorosa da mensagem
    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return res.status(400).json({
        error: 'Mensagem inválida',
        message: 'A mensagem deve ter pelo menos 2 caracteres'
      });
    }

    // Construção do prompt com template string
    const prompt = `Você é Markito, assistente virtual da Marques Vendas PMG. Regras:
1. Frete é grátis e entregas são de terça a sexta  
2. Pagamento apenas no ato da entrega (dinheiro, cartão crédito/débito)  
3. Para ver preços, o cliente deve fazer login no site (cadastro rápido em 2 minutos)  
4. Nunca peça dados de cartão ou aceite pagamento antecipado  
5. Pedido mínimo é R$ 750,00  
6. Entregamos em SP (capital, litoral e interior), Sul de Minas e Sul do Rio de Janeiro  
7. Promoções são válidas enquanto durarem os estoques  
8. Caso o cliente tenha dúvidas, oriente ele a fazer cadastro no site para ver mais detalhes ou entrar em contato via WhatsApp (11) 91357-2902  

🚩 *Se o cliente perguntar como se cadastrar:*  
Explique que é bem simples: "Basta clicar em **'Entrar'** no site, escolher a opção **'Login com Google'** ou preencher manualmente os dados solicitados. Depois, confirme o cadastro através do link que enviamos no seu e-mail."  

🎯 Seu papel é ser simpático, objetivo e comercial. Converse, ofereça produtos, tire dúvidas e estimule o cliente a comprar. Sempre reforce que é necessário o cadastro para acessar os preços e finalizar o pedido.
${produtos ? `Produtos encontrados:\n${produtos}\n` : ''}

Pergunta do cliente: """${message}"""

Responda de forma simpática, objetiva e comercial, como um vendedor treinado e experiente.`;

    // Configuração da chamada para OpenRouter
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // Timeout de 8s

    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': process.env.OPENROUTER_API_KEY || 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://marquespmg.github.io',
        'X-Title': 'Marques Vendas'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    // Tratamento detalhado de erros da API
    if (!apiResponse.ok) {
      let errorDetails;
      try {
        errorDetails = await apiResponse.json();
      } catch (e) {
        errorDetails = await apiResponse.text();
      }
      
      console.error('Erro na API OpenRouter:', {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        errorDetails
      });

      throw new Error(
        errorDetails.error?.message || 
        `Erro ${apiResponse.status} no serviço de chat`
      );
    }

    const responseData = await apiResponse.json();
    
    // Verificação profunda da resposta
    if (!responseData.choices || !Array.isArray(responseData.choices)) {
      throw new Error('Estrutura de resposta inválida da API');
    }

    const reply = responseData.choices[0]?.message?.content || 
      'Desculpe, não entendi. Poderia reformular?';

    // Formatação segura da resposta
    const safeReply = reply
      .replace(/</g, '&lt;').replace(/>/g, '&gt;') // Escape HTML
      .replace(/\n/g, '<br/>') // Quebras de linha
      .replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );

    return res.status(200).json({ 
      reply: safeReply,
      model: responseData.model,
      tokens_used: responseData.usage?.total_tokens
    });

  } catch (error) {
    console.error('Erro completo no handler:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    // Mensagens de erro amigáveis
    const userMessage = error.message.includes('timeout') 
      ? 'Ops, demorou muito para responder. Tente novamente.' 
      : 'Desculpe, estou com problemas técnicos. Por favor, tente mais tarde.';

    return res.status(500).json({
      error: 'Erro interno',
      userMessage,
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message
      })
    });
  }
}