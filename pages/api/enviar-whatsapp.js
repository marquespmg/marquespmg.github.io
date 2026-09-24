// pages/api/enviar-whatsapp.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { telefone, template, parametros } = req.body;

  if (!telefone || !template) {
    return res.status(400).json({ erro: 'Telefone e template são obrigatórios' });
  }

  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  if (!TOKEN || !PHONE_ID) {
    return res.status(500).json({ erro: 'Variáveis de ambiente não configuradas' });
  }

  try {
    const resp = await fetch(
      `https://graph.facebook.com/v21.0/${PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: telefone,
          type: 'template',
          template: {
            name: template,
            language: { code: 'pt_BR' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', parameter_name: 'nome', text: parametros.nome || 'Cliente' },
                  { type: 'text', parameter_name: 'empresa', text: parametros.empresa || '' },
                  { type: 'text', parameter_name: 'cidade', text: parametros.cidade || '' }
                ]
              }
            ]
          }
        })
      }
    );

    const data = await resp.json();

    if (!resp.ok) {
      console.error('Erro Meta API:', JSON.stringify(data, null, 2));
      return res.status(resp.status).json({ erro: data });
    }

    return res.status(200).json({
      messageId: data.messages?.[0]?.id,
      status: 'enviado'
    });
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ erro: err.message });
  }
}