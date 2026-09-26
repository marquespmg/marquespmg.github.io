// pages/api/enviar-arquivo.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  console.log('═══════════════════════════════════════');
  console.log(`📎 ENVIAR-ARQUIVO [${req.method}] em ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { telefone, arquivoBase64, nomeArquivo, tipoArquivo, legenda } = req.body;

  console.log('📦 Body recebido:');
  console.log('   - telefone:', telefone);
  console.log('   - nomeArquivo:', nomeArquivo);
  console.log('   - tipoArquivo:', tipoArquivo);
  console.log('   - legenda:', legenda);
  console.log('   - tamanho base64:', arquivoBase64?.length || 0);

  if (!telefone || !arquivoBase64 || !nomeArquivo) {
    return res.status(400).json({ erro: 'Telefone, arquivo e nome são obrigatórios' });
  }

  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  if (!TOKEN || !PHONE_ID) {
    return res.status(500).json({ erro: 'Variáveis de ambiente não configuradas' });
  }

  try {
    // 1. Upload do arquivo para o Supabase Storage
    console.log('📤 Fazendo upload para o Supabase Storage...');

    // Converte base64 em buffer
    const base64Data = arquivoBase64.replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Gera um nome único para evitar conflitos
    const timestamp = Date.now();
    const nomeSeguro = nomeArquivo.replace(/[^a-zA-Z0-9._-]/g, '_');
    const caminho = `${timestamp}_${nomeSeguro}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('anexos')
      .upload(caminho, buffer, {
        contentType: tipoArquivo || 'application/octet-stream',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      return res.status(500).json({ erro: 'Erro ao fazer upload: ' + uploadError.message });
    }

    console.log('✅ Upload concluído:', uploadData.path);

    // 2. Pega a URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('anexos')
      .getPublicUrl(caminho);

    const urlPublica = urlData.publicUrl;
    console.log('🔗 URL pública:', urlPublica);

    // 3. Envia para a Meta
    const payload = {
      messaging_product: 'whatsapp',
      to: telefone,
      type: 'document',
      document: {
        link: urlPublica,
        filename: nomeArquivo,
        caption: legenda || ''
      }
    };

    console.log('📤 Payload enviado para a Meta:');
    console.log(JSON.stringify(payload, null, 2));

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

    console.log('📥 Resposta da Meta:');
    console.log('   - status HTTP:', resp.status);
    console.log('   - data:', JSON.stringify(data, null, 2));

    // 4. Salva no Supabase (tabela mensagens)
    let { data: contato } = await supabase
      .from('contatos')
      .select('id')
      .eq('telefone', telefone)
      .single();

    await supabase.from('mensagens').insert({
      contato_id: contato?.id || null,
      telefone,
      direcao: 'enviada',
      tipo: 'documento',
      conteudo: legenda || `[Arquivo: ${nomeArquivo}]`,
      message_id: data.messages?.[0]?.id || null,
      status: resp.ok ? 'sent' : 'failed',
      erro: resp.ok ? null : (data.error?.message || 'erro desconhecido')
    });

    // 5. Atualiza a conversa
    await supabase.from('conversas').upsert({
      contato_id: contato?.id || null,
      telefone,
      ultima_mensagem: `📎 ${nomeArquivo}`,
      ultima_mensagem_em: new Date().toISOString(),
      ultima_mensagem_direcao: 'enviada'
    }, { onConflict: 'telefone' });

    console.log('💾 Mensagem salva no Supabase');
    console.log('═══════════════════════════════════════');

    if (!resp.ok) {
      console.error('❌ Erro Meta API');
      return res.status(resp.status).json({ erro: data });
    }

    console.log(`✅ Arquivo enviado para ${telefone}`);
    return res.status(200).json({
      ok: true,
      messageId: data.messages?.[0]?.id,
      urlArquivo: urlPublica
    });
  } catch (err) {
    console.error('❌ Erro interno:', err);
    console.error('❌ Stack:', err.stack);
    console.log('═══════════════════════════════════════');
    return res.status(500).json({ erro: err.message });
  }
}