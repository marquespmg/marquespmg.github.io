// pages/api/webhook.js
export default async function handler(req, res) {
  // ============ VERIFICAÇÃO (Meta chama com GET) ============
  if (req.method === 'GET') {
    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'pmg_webhook_2026';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado com sucesso');
      return res.status(200).send(challenge);
    }

    console.warn('❌ Falha na verificação do webhook');
    return res.status(403).end();
  }

  // ============ RECEBIMENTO DE EVENTOS (Meta chama com POST) ============
  if (req.method === 'POST') {
    const body = req.body;

    try {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      // ---------- Mensagens recebidas ----------
      if (value?.messages) {
        for (const msg of value.messages) {
          const telefone = msg.from;
          const nome = value.contacts?.[0]?.profile?.name || 'Desconhecido';
          const tipo = msg.type;
          const texto = msg.text?.body || `[${tipo}]`;

          console.log(`📥 Recebida de ${nome} (${telefone}): ${texto}`);

          // Aqui você pode salvar em banco de dados
          // Exemplo: await salvarMensagem({ telefone, nome, texto, data: new Date() });
        }
      }

      // ---------- Status de entrega/leitura ----------
      if (value?.statuses) {
        for (const st of value.statuses) {
          const status = st.status; // sent, delivered, read, failed
          const destinatario = st.recipient_id;
          const messageId = st.id;

          console.log(`📊 Status "${status}" para ${destinatario} (msg ${messageId})`);

          if (status === 'failed' && st.errors) {
            console.error('❌ Erro no envio:', JSON.stringify(st.errors, null, 2));
          }
        }
      }
    } catch (e) {
      console.error('Erro ao processar webhook:', e);
    }

    // A Meta exige resposta 200 rápida, senão reenvia o evento
    return res.status(200).end();
  }

  return res.status(405).end();
}