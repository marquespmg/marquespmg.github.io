// pages/api/webhook.js
import { supabase } from '../../lib/supabaseClient';

// ============ RESPOSTAS AUTOMÁTICAS (QUEBRA-GELOS) ============
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

// ============ MENSAGEM DE BOAS-VINDAS ============
const MENSAGEM_BOAS_VINDAS = `Olá! 👋 Que bom ter você por aqui!

Para atendimento direto, me chama no WhatsApp:
👉 https://wa.me/5511913572902

Se preferir, dá uma olhada no nosso catálogo:
🛒 https://www.marquesvendaspmg.shop

Fico à disposição!`;

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
      console.error('❌ Erro ao enviar mensagem:', data);
      return null;
    }
    return data.messages?.[0]?.id;
  } catch (err) {
    console.error('❌ Erro ao enviar mensagem:', err);
    return null;
  }
}

// ============ FUNÇÃO PARA EXTRAIR O TEXTO DA MENSAGEM ============
function extrairTextoMensagem(msg) {
  // Texto normal
  if (msg.text?.body) return msg.text.body;

  // Botão (resposta rápida)
  if (msg.button?.text) return `🔘 ${msg.button.text}`;

  // Interativo (botão ou lista)
  if (msg.interactive?.button_reply?.title) {
    return `🔘 ${msg.interactive.button_reply.title}`;
  }
  if (msg.interactive?.list_reply?.title) {
    return `📋 ${msg.interactive.list_reply.title}`;
  }

  // Contato enviado
  if (msg.type === 'contacts' && msg.contacts?.length > 0) {
    const contatos = msg.contacts.map(c => {
      const nome = c.name?.formatted_name || 'Sem nome';
      const telefone = c.phones?.[0]?.phone || 'sem telefone';
      return `${nome} (${telefone})`;
    });
    return `📇 Contato enviado: ${contatos.join(', ')}`;
  }

  // Imagem
  if (msg.type === 'image') {
    const legenda = msg.image?.caption ? ` — "${msg.image.caption}"` : '';
    return `🖼️ Imagem${legenda}`;
  }

  // Áudio
  if (msg.type === 'audio') return '🎤 Áudio';

  // Vídeo
  if (msg.type === 'video') {
    const legenda = msg.video?.caption ? ` — "${msg.video.caption}"` : '';
    return `🎥 Vídeo${legenda}`;
  }

  // Documento
  if (msg.type === 'document') {
    const nome = msg.document?.filename || 'sem nome';
    const legenda = msg.document?.caption ? ` — "${msg.document.caption}"` : '';
    return `📄 Documento: ${nome}${legenda}`;
  }

  // Localização
  if (msg.type === 'location') {
    const lat = msg.location?.latitude;
    const lon = msg.location?.longitude;
    const nome = msg.location?.name || '';
    const endereco = msg.location?.address || '';
    return `📍 Localização${nome ? `: ${nome}` : ''}${endereco ? ` — ${endereco}` : ''} (${lat}, ${lon})`;
  }

  // Sticker
  if (msg.type === 'sticker') return '🎨 Sticker';

  // Reação
  if (msg.type === 'reaction') {
    return `💚 Reação: ${msg.reaction?.emoji || ''}`;
  }

  // Fallback
  return `[${msg.type}]`;
}

export default async function handler(req, res) {
  // ============ VERIFICAÇÃO (Meta chama com GET) ============
  if (req.method === 'GET') {
    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'pmg_webhook_2026';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
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

          // Extrai o texto da mensagem (com suporte a todos os tipos)
          const texto = extrairTextoMensagem(msg);

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

          // 2. Antes de salvar, verifica se precisa enviar saudação
          let deveEnviarSaudacao = false;

          const { data: conversaExistente } = await supabase
            .from('conversas')
            .select('ultima_mensagem_em')
            .eq('telefone', telefone)
            .single();

          if (!conversaExistente) {
            deveEnviarSaudacao = true;
          } else {
            const ultimaInteracao = new Date(conversaExistente.ultima_mensagem_em);
            const agora = new Date();
            const diferencaHoras = (agora - ultimaInteracao) / (1000 * 60 * 60);

            if (diferencaHoras >= 12) {
              deveEnviarSaudacao = true;
            }
          }

          // 3. Salva a mensagem recebida no Supabase
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
          }

          // 4. Atualiza a conversa (resumo)
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
          }

          // 5. RESPOSTA AUTOMÁTICA (quebra-gelos)
          const respostaAutomatica = RESPOSTAS_AUTOMATICAS[texto];

          if (respostaAutomatica) {
            const messageId = await enviarMensagem(telefone, respostaAutomatica);

            if (messageId) {
              await supabase.from('mensagens').insert({
                contato_id: contato?.id || null,
                telefone,
                direcao: 'enviada',
                tipo: 'texto',
                conteudo: respostaAutomatica,
                message_id: messageId,
                status: 'sent'
              });

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
            }
          }

          // 6. SAUDAÇÃO AUTOMÁTICA (cliente novo ou sem interação 12h)
          if (deveEnviarSaudacao && !respostaAutomatica) {
            const messageId = await enviarMensagem(telefone, MENSAGEM_BOAS_VINDAS);

            if (messageId) {
              await supabase.from('mensagens').insert({
                contato_id: contato?.id || null,
                telefone,
                direcao: 'enviada',
                tipo: 'texto',
                conteudo: MENSAGEM_BOAS_VINDAS,
                message_id: messageId,
                status: 'sent'
              });

              await supabase.from('conversas').upsert({
                contato_id: contato?.id || null,
                telefone,
                nome_contato: nome,
                ultima_mensagem: MENSAGEM_BOAS_VINDAS,
                ultima_mensagem_em: new Date().toISOString(),
                ultima_mensagem_direcao: 'enviada',
                janela_aberta_ate: janelaAberta,
                nao_lidas: 0
              }, { onConflict: 'telefone' });
            }
          }
        }
      }

      // ---------- Status de entrega/leitura ----------
      if (value?.statuses) {
        for (const st of value.statuses) {
          const status = st.status;
          const messageId = st.id;

          await supabase
            .from('mensagens')
            .update({ status })
            .eq('message_id', messageId);
        }
      }
    } catch (e) {
      console.error('❌ Erro geral no webhook:', e);
    }

    return res.status(200).end();
  }

  return res.status(405).end();
}
