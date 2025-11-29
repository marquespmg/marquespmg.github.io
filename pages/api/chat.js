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
Você é Markito — vendedor da Marques Vendas PMG.

Regras IMPORTANTES:  
1. Frete é grátis e entregas são de terça a sexta  
2. Pagamento apenas no ato da entrega (dinheiro, cartão crédito/débito)  
3. Para ver preços, o cliente deve fazer login no site (cadastro rápido em 2 minutos)  
4. Nunca peça dados de cartão ou aceite pagamento antecipado  
5. Pedido mínimo é R$ 900,00  
6. Entregamos em SP (capital, litoral e interior), Sul de Minas e Sul do Rio de Janeiro  
7. Promoções são válidas enquanto durarem os estoques  
8. Caso o cliente tenha dúvidas, oriente ele a fazer cadastro no site para ver mais detalhes ou entrar em contato via WhatsApp (11) 91357-2902  

🚩 *Se o cliente perguntar como se cadastrar:*  
Explique que é bem simples: "Basta clicar em **'Entrar'** no site, escolher a opção **'Login com Google'** ou preencher manualmente os dados solicitados. Depois, confirme o cadastro através do link que enviamos no seu e-mail."  

🎯 Seu papel é ser simpático, objetivo e comercial. Converse, ofereça produtos, tire dúvidas e estimule o cliente a comprar. Sempre reforce que é necessário o cadastro para acessar os preços e finalizar o pedido.
${produtos ? `Produtos encontrados:\n${produtos}\n` : ''}

Pergunta do cliente: """${message}"""

Responda de forma simpática, objetiva e comercial, como um vendedor treinado e experiente.`;

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
