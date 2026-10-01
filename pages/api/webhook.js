// pages/api/webhook.js
import { supabase } from '../../lib/supabaseClient';

// ⏱️ Timeout aumentado (Vercel Pro permite 60s)
export const config = {
  maxDuration: 60,
};

// ============ CONFIGURAÇÕES ============
const LINK_SITE = 'https://www.marquesvendaspmg.shop';
const LINK_WHATSAPP = 'https://wa.me/5511913572902';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

// ============ RESPOSTAS AUTOMÁTICAS (QUEBRA-GELOS) ============
const RESPOSTAS_AUTOMATICAS = {
  'Falar com vendedor': 'menu',
  'Quero tabela de preço': 'menu',
  'Já sou cliente': 'menu'
};

// ============ MENSAGEM DE BOAS-VINDAS ============
const MENSAGEM_BOAS_VINDAS = `Bem-vindo à Marques Vendas PMG! 👋

Como podemos te ajudar hoje?`;

// ============ NORMALIZAR TEXTO ============
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ============ CHAMAR A IA (OPEN ROUTER) ============
async function gerarRespostaIA(mensagemCliente, historico = []) {
  if (!OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API_KEY não configurada');
    return null;
  }

  const promptSistema = `Você é o vendedor virtual da Marques Vendas PMG, uma distribuidora food service que atende bares, restaurantes, pizzarias, lanchonetes e comerciantes.

🎯 SEU OBJETIVO PRINCIPAL: CONVENCER O CLIENTE A COMPRAR E LEVAR ELE PARA O SITE.
Você é um vendedor 24h por dia. Seu trabalho é vender, não só responder.

═══════════════════════════════════════
INFORMAÇÕES DA EMPRESA (use quando fizer sentido)
═══════════════════════════════════════
- Site (catálogo COMPLETO com preços atualizados): ${LINK_SITE}
- WhatsApp do vendedor humano: ${LINK_WHATSAPP}
- Horário: Segunda a Sábado, 08h às 13h e 15h às 20h
- Endereço: Estrada Ferreira Guedes, 784 - Potuverá, Itapecerica da Serra - SP
- Pedido mínimo: R$ 900,00
- 🚚 FRETE GRÁTIS (destaque isso!)
- 💰 PAGUE SÓ NA ENTREGA (destaque isso! é um grande diferencial)
- ❌ NÃO fazemos retirada no local (entregamos)
- Atendemos toda a região, incluindo cidades próximas

═══════════════════════════════════════
🏆 BENEFÍCIOS QUE VOCÊ DEVE DESTACAR (sempre que possível)
═══════════════════════════════════════
1. 🚚 FRETE GRÁTIS para pedidos acima do mínimo
2. 💰 PAGUE SÓ NA ENTREGA — segurança total pro cliente
3. 📦 Produtos de qualidade food service
4. 🛒 Catálogo completo no site com preços atualizados
5. 💬 Atendimento humano pelo WhatsApp quando quiser
6. 🏢 Empresa séria com endereço fixo

═══════════════════════════════════════
⚠️ REGRAS CRÍTICAS — LEIA COM ATENÇÃO
═══════════════════════════════════════
1. ❌ NUNCA invente preços. Se perguntarem preço, diga que o catálogo completo com preços atualizados está no site e mande o link: ${LINK_SITE}
2. ❌ NUNCA invente se tem ou não um produto específico. Diga que no site tem o catálogo completo e mande o link.
3. ❌ NUNCA invente embalagem, marca, sabor, peso, validade ou qualquer detalhe de produto.
4. ✅ SEMPRE que o cliente perguntar sobre produto/preço/estoque, mande o link do site: ${LINK_SITE}
5. ✅ SEMPRE que possível, destaque: FRETE GRÁTIS e PAGUE NA ENTREGA
6. ✅ Se o cliente demonstrar interesse, incentive o cadastro no site pra ver os preços e fazer o pedido
7. ✅ Se o cliente quiser falar com humano, mande: ${LINK_WHATSAPP}
8. ✅ Seja convincente, simpático e direto. Fale como vendedor de verdade.
9. ✅ Use emojis com moderação (1 a 2 por mensagem)
10. ✅ Use quebras de linha pra deixar legível
11. ❌ NUNCA diga que é "a empresa oficial" — você é o vendedor/assistente
12. ❌ NUNCA fale de produtos que você não tem certeza. Redirecione pro site.

═══════════════════════════════════════
💡 EXEMPLOS DE COMO RESPONDER
═══════════════════════════════════════

Cliente: "Vocês tem muçarela?"
Você: "Temos sim! 🧀 Nosso catálogo completo com todos os produtos e preços atualizados está no site:

${LINK_SITE}

Lá você encontra muçarela e muito mais, com frete grátis e pagamento só na entrega! 💰🚚

Qualquer dúvida, é só chamar!"

Cliente: "Quanto custa o queijo?"
Você: "Os preços atualizados você confere direto no nosso site: 🛒

${LINK_SITE}

É rapidinho, só se cadastrar e você já vê tudo com preço. E o melhor: frete grátis e você paga só na entrega! 💰🚚

Precisa de ajuda com algo específico?"

Cliente: "Vocês entregam em [cidade]?"
Você: "Entregamos sim! 🚚 Atendemos toda a região.

Nosso catálogo completo está em:
${LINK_SITE}

Pedido mínimo de R$ 900,00, frete GRÁTIS e você paga só na entrega! 💰

Ficou com alguma dúvida?"

Cliente: "Quero fazer um pedido"
Você: "Perfeito! 🎉 Pra fazer seu pedido é bem simples:

1️⃣ Acesse: ${LINK_SITE}
2️⃣ Se cadastre rapidinho
3️⃣ Escolha seus produtos
4️⃣ Finalize o pedido

Pedido mínimo: R$ 900,00
🚚 Frete GRÁTIS
💰 Pagamento só na entrega

Qualquer dúvida no cadastro, me chama aqui! 😊"

═══════════════════════════════════════

Agora responda a mensagem do cliente sendo um VENDEDOR CONVINCENTE, sempre levando ele pro site ${LINK_SITE} e destacando frete grátis + pague na entrega.`;

  // Monta o histórico (últimas 10 mensagens)
  const mensagens = [
    { role: 'system', content: promptSistema },
    ...historico.slice(-10),
    { role: 'user', content: mensagemCliente }
  ];

  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': LINK_SITE,
        'X-Title': 'Marques Vendas PMG'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: mensagens,
        temperature: 0.8,
        max_tokens: 500
      })
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error('❌ Erro Open Router:', JSON.stringify(data, null, 2));
      return null;
    }

    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('❌ Erro ao chamar IA:', err.message);
    return null;
  }
}

// ============ BUSCAR HISTÓRICO DO CLIENTE ============
async function buscarHistorico(telefone) {
  try {
    const { data } = await supabase
      .from('mensagens')
      .select('direcao, conteudo, created_at')
      .eq('telefone', telefone)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!data) return [];

    return data.reverse().map(m => ({
      role: m.direcao === 'enviada' ? 'assistant' : 'user',
      content: m.conteudo
    }));
  } catch (err) {
    console.error('❌ Erro ao buscar histórico:', err);
    return [];
  }
}

// ============ ENVIAR MENSAGEM DE TEXTO ============
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

// ============ ENVIAR MENU INTERATIVO ============
async function enviarMenu(telefone) {
  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  const payload = {
    messaging_product: 'whatsapp',
    to: telefone,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: { type: 'text', text: 'Marques Vendas PMG' },
      body: { text: 'Como podemos te ajudar hoje? 👇' },
      footer: { text: 'Toque em "Ver Opções" para escolher' },
      action: {
        button: 'Ver Opções',
        sections: [
          {
            title: 'Menu Principal',
            rows: [
              { id: 'menu_site', title: '🛒 Ver Catálogo', description: 'Acesse nosso catálogo completo' },
              { id: 'menu_vendedor', title: '💬 Falar Vendedor', description: 'Atendimento direto pelo WhatsApp' },
              { id: 'menu_tabela', title: '📄 Receber Tabela', description: 'Tabela de preços atualizada' },
              { id: 'menu_horario', title: '🕐 Horário', description: 'Seg a Sáb, 08h-13h / 15h-20h' },
              { id: 'menu_endereco', title: '📍 Endereço', description: 'Estrada Ferreira Guedes, 784' },
              { id: 'menu_finalizar', title: '🚪 Finalizar', description: 'Encerrar a conversa' }
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

// ============ PROCESSAR OPÇÃO DO MENU ============
async function processarOpcao(telefone, opcaoId) {
  let resposta = '';

  switch (opcaoId) {
    case 'menu_site':
      resposta = `Aqui está nosso catálogo completo! 🛒\n\n${LINK_SITE}\n\n✅ Frete GRÁTIS\n💰 Pague só na entrega\n📦 Pedido mínimo: R$ 900,00\n\nQualquer dúvida, é só chamar!`;
      break;
    case 'menu_vendedor':
      resposta = `Para falar com nosso vendedor, chame direto no WhatsApp: 💬\n\n${LINK_WHATSAPP}\n\nSerá um prazer te atender!`;
      break;
    case 'menu_tabela':
      resposta = `Já vamos te enviar a tabela! 📄\n\nMas você também pode conferir todos os preços atualizados direto no site:\n${LINK_SITE}\n\nAguarde alguns minutinhos que já estamos enviando. 🙏`;
      break;
    case 'menu_horario':
      resposta = `🕐 Nosso horário de funcionamento:\n\n📅 Segunda a Sábado\n🌅 Manhã: 08h às 13h\n🌇 Tarde: 15h às 20h\n\nEstamos à disposição!`;
      break;
    case 'menu_endereco':
      resposta = `📍 Nosso endereço:\n\nEstrada Ferreira Guedes, 784 - Potuverá\nItapecerica da Serra - SP\n\n⚠️ Informações importantes:\n• Pedido mínimo: R$ 900,00\n• 🚚 Frete GRÁTIS\n• 💰 Pague só na entrega\n• ❌ Não realizamos retirada no local\n\nPara mais informações, fale com nosso vendedor:\n${LINK_WHATSAPP}`;
      break;
    case 'menu_finalizar':
      resposta = `✅ Atendimento finalizado!\n\nSe precisar de algo, é só chamar de novo. 👋\n\n🛒 Catálogo: ${LINK_SITE}\n💬 WhatsApp: ${LINK_WHATSAPP}`;
      break;
    default:
      resposta = `Desculpe, não entendi a opção. Tente novamente.`;
  }

  return resposta;
}

// ============ EXTRAIR TEXTO DA MENSAGEM ============
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

// ============ HANDLER PRINCIPAL ============
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
          await supabase.from('mensagens').insert({
            contato_id: contato?.id || null,
            telefone,
            direcao: 'recebida',
            tipo,
            conteudo: texto,
            message_id: msg.id,
            status: 'received'
          });

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
          // 8. MENSAGEM NORMAL → CHAMA A IA
          else {
            // Busca histórico para contexto
            const historico = await buscarHistorico(telefone);

            // Chama a IA (sem contexto de produtos - ela leva pro site)
            const respostaIA = await gerarRespostaIA(texto, historico);

            if (respostaIA) {
              const messageId = await enviarMensagem(telefone, respostaIA);
              if (messageId) {
                await supabase.from('mensagens').insert({
                  contato_id: contato?.id || null,
                  telefone,
                  direcao: 'enviada',
                  tipo: 'texto',
                  conteudo: respostaIA,
                  message_id: messageId,
                  status: 'sent'
                });

                await supabase.from('conversas').upsert({
                  contato_id: contato?.id || null,
                  telefone,
                  nome_contato: nome,
                  ultima_mensagem: respostaIA,
                  ultima_mensagem_em: new Date().toISOString(),
                  ultima_mensagem_direcao: 'enviada',
                  janela_aberta_ate: janelaAberta,
                  nao_lidas: 0
                }, { onConflict: 'telefone' });
              }
            } else {
              console.error('❌ IA não retornou resposta');
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
