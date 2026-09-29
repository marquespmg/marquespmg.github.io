// pages/api/webhook.js
import { supabase } from '../../lib/supabaseClient';

// ============ CONFIGURAÇÕES ============
const LINK_SITE = 'https://www.marquesvendaspmg.shop';
const LINK_WHATSAPP = 'https://wa.me/5511913572902';

// ============ RESPOSTAS AUTOMÁTICAS (QUEBRA-GELOS) ============
const RESPOSTAS_AUTOMATICAS = {
  'Falar com vendedor': 'menu',
  'Quero tabela de preço': 'menu',
  'Já sou cliente': 'menu'
};

// ============ MENSAGEM DE BOAS-VINDAS ============
const MENSAGEM_BOAS_VINDAS = `Bem-vindo à Marques Vendas PMG! 👋

Como podemos te ajudar hoje?`;

// ============ FUNÇÃO PARA ENVIAR MENSAGEM DE TEXTO ============
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

// ============ FUNÇÃO PARA ENVIAR MENU INTERATIVO (LISTA) ============
async function enviarMenu(telefone) {
  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  const payload = {
    messaging_product: 'whatsapp',
    to: telefone,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: 'Marques Vendas PMG'
      },
      body: {
        text: 'Como podemos te ajudar hoje? 👇'
      },
      footer: {
        text: 'Toque em "Ver Opções" para escolher'
      },
      action: {
        button: 'Ver Opções',
        sections: [
          {
            title: 'Menu Principal',
            rows: [
              {
                id: 'menu_site',
                title: '🛒 Ver Catálogo no Site',
                description: 'Acesse nosso catálogo completo'
              },
              {
                id: 'menu_vendedor',
                title: '💬 Falar com Vendedor',
                description: 'Atendimento direto pelo WhatsApp'
              },
              {
                id: 'menu_tabela',
                title: '📄 Receber Tabela de Preços',
                description: 'Tabela atualizada com o vendedor'
              },
              {
                id: 'menu_horario',
                title: '🕐 Horário de Funcionamento',
                description: 'Seg a Sáb, 08h-13h / 15h-20h'
              },
              {
                id: 'menu_endereco',
                title: '📍 Ver Endereço',
                description: 'Estrada Ferreira Guedes, 784'
              },
              {
                id: 'menu_finalizar',
                title: '🚪 Finalizar Atendimento',
                description: 'Encerrar a conversa'
              }
            ]
          }
        ]
      }
    }
  };

  try {
    const resp = await fetch(
      `https://graph.facebook.com/v21.0/${PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await resp.json();
    if (!resp.ok) {
      console.error('❌ Erro ao enviar menu:', JSON.stringify(data, null, 2));
      return null;
    }
    return data.messages?.[0]?.id;
  } catch (err) {
    console.error('❌ Erro ao enviar menu:', err);
    return null;
  }
}

// ============ FUNÇÃO PARA PROCESSAR A OPÇÃO ESCOLHIDA ============
async function processarOpcao(telefone, opcaoId) {
  let resposta = '';

  switch (opcaoId) {
    case 'menu_site':
      resposta = `Aqui está nosso catálogo completo! 🛒

${LINK_SITE}

Qualquer dúvida, é só chamar!`;
      break;

    case 'menu_vendedor':
      resposta = `Para falar com nosso vendedor, chame direto no WhatsApp: 💬

${LINK_WHATSAPP}

Será um prazer te atender!`;
      break;

    case 'menu_tabela':
      resposta = `Já vamos te enviar a tabela! 📄

Aguarde alguns minutinhos que já estamos enviando. 🙏`;
      break;

    case 'menu_horario':
      resposta = `🕐 Nosso horário de funcionamento:

📅 Segunda a Sábado
🌅 Manhã: 08h às 13h
🌇 Tarde: 15h às 20h

Estamos à disposição!`;
      break;

    case 'menu_endereco':
      resposta = `📍 Nosso endereço:

Estrada Ferreira Guedes, 784 - Potuverá
Itapecerica da Serra - SP

⚠️ Informações importantes:
• Pedido mínimo: R$ 900,00
• Não realizamos retirada no local

Para mais informações, fale com nosso vendedor:
${LINK_WHATSAPP}`;
      break;

    case 'menu_finalizar':
      resposta = `✅ Atendimento finalizado!

Se precisar de algo, é só chamar de novo. 👋

🛒 Catálogo: ${LINK_SITE}
💬 WhatsApp: ${LINK_WHATSAPP}`;
      break;

    default:
      resposta = `Desculpe, não entendi a opção. Tente novamente.`;
  }

  return resposta;
}

// ============ FUNÇÃO PARA EXTRAIR O TEXTO DA MENSAGEM ============
function extrairTextoMensagem(msg) {
  if (msg.text?.body) return msg.text.body;
  if (msg.button?.text) return `🔘 ${msg.button.text}`;
  if (msg.interactive?.button_reply?.title) return `🔘 ${msg.interactive.button_reply.title}`;
  if (msg.interactive?.list_reply?.title) return `📋 ${msg.interactive.list_reply.title}`;

  if (msg.type === 'contacts' && msg.contacts?.length > 0) {
    const contatos = msg.contacts.map(c => {
      const nome = c.name?.formatted_name || 'Sem nome';
      const telefone = c.phones?.[0]?.phone || 'sem telefone';
      return `${nome} (${telefone})`;
    });
    return `📇 Contato enviado: ${contatos.join(', ')}`;
  }

  if (msg.type === 'image') {
    const legenda = msg.image?.caption ? ` — "${msg.image.caption}"` : '';
    return `🖼️ Imagem${legenda}`;
  }

  if (msg.type === 'audio') return '🎤 Áudio';
  if (msg.type === 'video') {
    const legenda = msg.video?.caption ? ` — "${msg.video.caption}"` : '';
    return `🎥 Vídeo${legenda}`;
  }
  if (msg.type === 'document') {
    const nome = msg.document?.filename || 'sem nome';
    return `📄 Documento: ${nome}`;
  }
  if (msg.type === 'location') {
    const lat = msg.location?.latitude;
    const lon = msg.location?.longitude;
    return `📍 Localização (${lat}, ${lon})`;
  }
  if (msg.type === 'sticker') return '🎨 Sticker';
  if (msg.type === 'reaction') return `💚 Reação: ${msg.reaction?.emoji || ''}`;

  return `[${msg.type}]`;
}

export default async function handler(req, res) {
  // ============ VERIFICAÇÃO ============
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

  // ============ RECEBIMENTO DE EVENTOS ============
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

      if (value?.messages) {
        for (const msg of value.messages) {
          const telefone = msg.from;
          const nome = value.contacts?.[0]?.profile?.name || 'Desconhecido';
          const tipo = msg.type;
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

            if (erroContato) console.error('❌ Erro ao criar contato:', erroContato);
            contato = novo;
          }

          // 2. Verifica se precisa enviar saudação
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
            if (diferencaHoras >= 12) deveEnviarSaudacao = true;
          }

          // 3. Salva a mensagem recebida
          const { error: erroMsg } = await supabase.from('mensagens').insert({
            contato_id: contato?.id || null,
            telefone,
            direcao: 'recebida',
            tipo,
            conteudo: texto,
            message_id: msg.id,
            status: 'received'
          });

          if (erroMsg) console.error('❌ Erro ao salvar mensagem:', erroMsg);

          // 4. Atualiza a conversa
          const janelaAberta = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          await supabase.from('conversas').upsert({
            contato_id: contato?.id || null,
            telefone,
            nome_contato: nome,
            ultima_mensagem: texto,
            ultima_mensagem_em: new Date().toISOString(),
            ultima_mensagem_direcao: 'recebida',
            janela_aberta_ate: janelaAberta,
            nao_lidas: 1
          }, { onConflict: 'telefone' });

          // 5. VERIFICA SE É CLIQUE NO MENU
          const opcaoMenu = msg.interactive?.list_reply?.id || msg.interactive?.button_reply?.id;

          if (opcaoMenu) {
            const respostaOpcao = await processarOpcao(telefone, opcaoMenu);

            if (respostaOpcao) {
              const messageId = await enviarMensagem(telefone, respostaOpcao);

              if (messageId) {
                await supabase.from('mensagens').insert({
                  contato_id: contato?.id || null,
                  telefone,
                  direcao: 'enviada',
                  tipo: 'texto',
                  conteudo: respostaOpcao,
                  message_id: messageId,
                  status: 'sent'
                });

                await supabase.from('conversas').upsert({
                  contato_id: contato?.id || null,
                  telefone,
                  nome_contato: nome,
                  ultima_mensagem: respostaOpcao,
                  ultima_mensagem_em: new Date().toISOString(),
                  ultima_mensagem_direcao: 'enviada',
                  janela_aberta_ate: janelaAberta,
                  nao_lidas: 0
                }, { onConflict: 'telefone' });

                // Se não for "Finalizar", reenvia o menu depois de 2 segundos
                if (opcaoMenu !== 'menu_finalizar') {
                  setTimeout(async () => {
                    const menuId = await enviarMenu(telefone);
                    if (menuId) {
                      await supabase.from('mensagens').insert({
                        contato_id: contato?.id || null,
                        telefone,
                        direcao: 'enviada',
                        tipo: 'interactive',
                        conteudo: '📋 Menu de opções enviado',
                        message_id: menuId,
                        status: 'sent'
                      });
                    }
                  }, 2000);
                }
              }
            }
          }
          // 6. RESPOSTA AUTOMÁTICA (QUEBRA-GELOS)
          else if (RESPOSTAS_AUTOMATICAS[texto] === 'menu') {
            const menuId = await enviarMenu(telefone);

            if (menuId) {
              await supabase.from('mensagens').insert({
                contato_id: contato?.id || null,
                telefone,
                direcao: 'enviada',
                tipo: 'interactive',
                conteudo: '📋 Menu de opções enviado',
                message_id: menuId,
                status: 'sent'
              });

              await supabase.from('conversas').upsert({
                contato_id: contato?.id || null,
                telefone,
                nome_contato: nome,
                ultima_mensagem: '📋 Menu de opções enviado',
                ultima_mensagem_em: new Date().toISOString(),
                ultima_mensagem_direcao: 'enviada',
                janela_aberta_ate: janelaAberta,
                nao_lidas: 0
              }, { onConflict: 'telefone' });
            }
          }
          // 7. SAUDAÇÃO AUTOMÁTICA (cliente novo ou sem interação 12h)
          else if (deveEnviarSaudacao) {
            const msgId = await enviarMensagem(telefone, MENSAGEM_BOAS_VINDAS);

            if (msgId) {
              await supabase.from('mensagens').insert({
                contato_id: contato?.id || null,
                telefone,
                direcao: 'enviada',
                tipo: 'texto',
                conteudo: MENSAGEM_BOAS_VINDAS,
                message_id: msgId,
                status: 'sent'
              });

              // Envia o menu logo depois
              setTimeout(async () => {
                const menuId = await enviarMenu(telefone);
                if (menuId) {
                  await supabase.from('mensagens').insert({
                    contato_id: contato?.id || null,
                    telefone,
                    direcao: 'enviada',
                    tipo: 'interactive',
                    conteudo: '📋 Menu de opções enviado',
                    message_id: menuId,
                    status: 'sent'
                  });

                  await supabase.from('conversas').upsert({
                    contato_id: contato?.id || null,
                    telefone,
                    nome_contato: nome,
                    ultima_mensagem: '📋 Menu de opções enviado',
                    ultima_mensagem_em: new Date().toISOString(),
                    ultima_mensagem_direcao: 'enviada',
                    janela_aberta_ate: janelaAberta,
                    nao_lidas: 0
                  }, { onConflict: 'telefone' });
                }
              }, 1000);
            }
          }
        }
      }

      // ---------- Status de entrega/leitura ----------
      if (value?.statuses) {
        for (const st of value.statuses) {
          await supabase
            .from('mensagens')
            .update({ status: st.status })
            .eq('message_id', st.id);
        }
      }
    } catch (e) {
      console.error('❌ Erro geral no webhook:', e);
    }

    return res.status(200).end();
  }

  return res.status(405).end();
}
