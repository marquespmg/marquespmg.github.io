// pages/api/responder.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { telefone, texto } = req.body;
  if (!telefone || !texto) {
    return res.status(400).json({ erro: 'Telefone e texto obrigatórios' });
  }

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

    // Salva a mensagem enviada
    let { data: contato } = await supabase
      .from('contatos')
      .select('id')
      .eq('telefone', telefone)
      .single();

    await supabase.from('mensagens').insert({
      contato_id: contato?.id || null,
      telefone,
      direcao: 'enviada',
      tipo: 'texto',
      conteudo: texto,
      message_id: data.messages?.[0]?.id || null,
      status: resp.ok ? 'sent' : 'failed',
      erro: resp.ok ? null : (data.error?.message || null)
    });

    await supabase.from('conversas').upsert({
      contato_id: contato?.id || null,
      telefone,
      ultima_mensagem: texto,
      ultima_mensagem_em: new Date().toISOString(),
      ultima_mensagem_direcao: 'enviada'
    }, { onConflict: 'telefone' });

    if (!resp.ok) {
      return res.status(resp.status).json({ erro: data });
    }

    return res.status(200).json({ ok: true, messageId: data.messages?.[0]?.id });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}