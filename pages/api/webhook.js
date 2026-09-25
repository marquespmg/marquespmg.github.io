// pages/api/webhook.js
import { supabase } from '../../lib/supabaseClient';

// ============ RESPOSTAS AUTOMÁTICAS ============
const RESPOSTAS_AUTOMATICAS = {
  'Falar com vendedor': `Olá! 👋 Para falar com um vendedor da PMG Atacadista, chame diretamente no WhatsApp:

👉 https://wa.me/5511913572902

Será um prazer te atender!`,
  
  'Quero tabela de preço': `Olá! 👋 Acesse nossa tabela de preços e catálogo completo pelo link:

👉 https://www.marquesvendaspmg.shop/produtos

Qualquer dúvida, é só chamar!`,
  
  'Já sou cliente': `Olá! 🎉

Obrigado por escolher a PMG Atacadista! Desejamos muito sucesso nos seus negócios.

Se precisar de algo, é só chamar! 🚀`
};

// Função para enviar mensagem via API da Meta
async function enviarMensagem(telefone, texto) {
  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

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
          type: 'text',
          text: { body: texto }
        })
      }
    );

    const data = await resp.json();
    if (!resp.ok) {
      console.error('❌ Erro ao enviar resposta automática:', data);
      return null;
    }
    return data.messages?.[0]?.id;
  } catch (err) {
    console.error('❌ Erro ao enviar resposta automática:', err);
    return null;
  }
}

export default async function handler(req, res) {
  // ============ VERIFICAÇÃO (Meta chama com GET) ============
  if (req.method === 'GET') {
    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'pmg_webhook_2026';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado');
      return res.status(200).send(challenge);
    }
    console.warn('❌ Falha na verificação do webhook');
    return res.status(403).end();
  }

  // ============ RECEBIMENTO DE EVENTOS (Meta chama com POST) ============
  if (req.method === 'POST') {
    let body = req.body;

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('❌ Erro ao fazer parse do body:', e);
        return res.status(400).end();
      }
    }

    console.log('📦 Webhook recebido:', JSON.stringify(body).substring(0, 800));

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

          console.log(`📥 Processando mensagem de ${nome} (${telefone}): ${texto}`);

          // 1. Garante que o contato existe
          let { data: contato, error: erroBusca } = await supabase
            .from('contatos')
            .select('id')
            .eq('telefone', telefone)
            .single();

          if (erroBusca && erroBusca.code !== 'PGRST116') {
            console.error('❌ Erro ao buscar contato:', erroBusca);
          }

          if (!contato) {
            const { data: novo, error: erroContato } = await supabase
              .from('contatos')
              .insert({ telefone, nome })
              .select('id')
              .single();

            if (erroContato) {
              console.error('❌ Erro ao criar contato:', erroContato);
            }
            contato = novo;
          }

          // 2. Salva a mensagem recebida
          const { error: erroMsg } = await supabase.from('mensagens').insert({
            contato_id: contato?.id || null,
            telefone,
            direcao: 'recebida',
            tipo,
            conteudo: texto,
            message_id: msg.id,
            status: 'received'
          });

          if (erroMsg) {
            console.error('❌ Erro ao salvar mensagem:', erroMsg);
          } else {
            console.log('✅ Mensagem salva no Supabase');
          }

          // 3. Atualiza a conversa
          const janelaAberta = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          const { error: erroConversa } = await supabase.from('conversas').upsert({
            contato_id: contato?.id || null,
            telefone,
            nome_contato: nome,
            ultima_mensagem: texto,
            ultima_mensagem_em: new Date().toISOString(),
            ultima_mensagem_direcao: 'recebida',
            janela_aberta_ate: janelaAberta,
            nao_lidas: 1
          }, { onConflict: 'telefone' });

          if (erroConversa) {
            console.error('❌ Erro ao atualizar conversa:', erroConversa);
          } else {
            console.log('✅ Conversa atualizada');
          }

          // 4. RESPOSTA AUTOMÁTICA (quebra-gelos)
          const respostaAutomatica = RESPOSTAS_AUTOMATICAS[texto];

          if (respostaAutomatica) {
            console.log(`🤖 Detectado quebra-gelo: "${texto}" — enviando resposta automática`);

            const messageId = await enviarMensagem(telefone, respostaAutomatica);

            if (messageId) {
              // Salva a resposta automática no Supabase
              await supabase.from('mensagens').insert({
                contato_id: contato?.id || null,
                telefone,
                direcao: 'enviada',
                tipo: 'texto',
                conteudo: respostaAutomatica,
                message_id: messageId,
                status: 'sent'
              });

              // Atualiza a conversa com a última mensagem enviada
              await supabase.from('conversas').upsert({
                contato_id: contato?.id || null,
                telefone,
                nome_contato: nome,
                ultima_mensagem: respostaAutomatica,
                ultima_mensagem_em: new Date().toISOString(),
                ultima_mensagem_direcao: 'enviada',
                janela_aberta_ate: janelaAberta,
                nao_lidas: 0
              }, { onConflict: 'telefone' });

              console.log(`✅ Resposta automática enviada para ${telefone}`);
            }
          } else {
            console.log(`ℹ️ Mensagem não é quebra-gelo, nenhuma resposta automática`);
          }

          console.log(`✅ Processado: ${nome} (${telefone}): ${texto}`);
        }
      }

      // ---------- Status de entrega/leitura ----------
      if (value?.statuses) {
        for (const st of value.statuses) {
          const status = st.status;
          const messageId = st.id;

          const { error: erroStatus } = await supabase
            .from('mensagens')
            .update({ status })
            .eq('message_id', messageId);

          if (erroStatus) {
            console.error('❌ Erro ao atualizar status:', erroStatus);
          }

          console.log(`📊 Status "${status}" para msg ${messageId}`);
        }
      }
    } catch (e) {
      console.error('❌ Erro geral no webhook:', e);
    }

    return res.status(200).end();
  }

  return res.status(405).end();
}
