// pages/api/webhook.js
import { supabase } from '../../lib/supabaseClient';

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

    // Se o body veio como string (ex: teste manual), faz o parse
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error('❌ Erro ao fazer parse do body:', e);
        return res.status(400).end();
      }
    }

    // Log do body recebido (truncado para não poluir)
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

          // 3. Atualiza a conversa (resumo para caixa de entrada)
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

    // A Meta exige 200 rápido, senão reenvia o evento
    return res.status(200).end();
  }

  return res.status(405).end();
}
