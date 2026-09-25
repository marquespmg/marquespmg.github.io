// pages/api/enviar-whatsapp.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { telefone, template, parametros, campanha_id } = req.body;

  if (!telefone || !template) {
    return res.status(400).json({ erro: 'Telefone e template são obrigatórios' });
  }

  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  if (!TOKEN || !PHONE_ID) {
    return res.status(500).json({ erro: 'Variáveis de ambiente não configuradas' });
  }

  try {
    // 1. Garante que o contato existe
    let { data: contato } = await supabase
      .from('contatos')
      .select('id')
      .eq('telefone', telefone)
      .single();

    if (!contato) {
      const { data: novoContato } = await supabase
        .from('contatos')
        .insert({
          telefone,
          nome: parametros.nome || null,
          empresa: parametros.empresa || null,
          cidade: parametros.cidade || null
        })
        .select('id')
        .single();
      contato = novoContato;
    }

    // 2. Envia para a Meta
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

    // 3. Salva a mensagem no Supabase (mesmo se falhar)
    const mensagemBase = {
      contato_id: contato?.id || null,
      campanha_id: campanha_id || null,
      telefone,
      direcao: 'enviada',
      tipo: 'template',
      conteudo: `[Template: ${template}]`,
      template_nome: template,
      message_id: data.messages?.[0]?.id || null,
      status: resp.ok ? 'sent' : 'failed',
      erro: resp.ok ? null : (data.error?.message || 'erro desconhecido')
    };

    await supabase.from('mensagens').insert(mensagemBase);

    // 4. Atualiza a conversa (resumo)
    await supabase.from('conversas').upsert({
      contato_id: contato?.id || null,
      telefone,
      nome_contato: parametros.nome || null,
      ultima_mensagem: `[Template: ${template}]`,
      ultima_mensagem_em: new Date().toISOString(),
      ultima_mensagem_direcao: 'enviada'
    }, { onConflict: 'telefone' });

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
