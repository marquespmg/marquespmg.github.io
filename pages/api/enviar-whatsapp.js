// pages/api/enviar-whatsapp.js
import { supabase } from '../../lib/supabaseClient';

// ============ CONFIGURAÇÃO DE TEMPLATES ============
const TEMPLATES = {
  // Templates com 3 variáveis (nome, empresa, cidade)
  'prospeccao_pmg_atacado3': {
    temVariaveis: true,
    variaveis: ['nome', 'empresa', 'cidade']
  },
  'prospeccao_pmg_atacado4': {
    temVariaveis: true,
    variaveis: ['nome', 'empresa', 'cidade']
  },
  'prospeccao_pmg_atacado5': {
    temVariaveis: true,
    variaveis: ['nome', 'empresa', 'cidade']
  },

  // Template com imagem no cabeçalho (sem variáveis no corpo)
  'teste': {
    temVariaveis: false,
    temImagem: true,
    imagemUrl: 'https://www.marquesvendaspmg.shop/testetempla.png'
  },

  // Template de teste em inglês
  'hello_world': {
    temVariaveis: false,
    language: 'en_US'
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { telefone, template, parametros = {}, campanha_id } = req.body;

  if (!telefone || !template) {
    return res.status(400).json({ erro: 'Telefone e template são obrigatórios' });
  }

  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

  if (!TOKEN || !PHONE_ID) {
    return res.status(500).json({ erro: 'Variáveis de ambiente não configuradas' });
  }

  const configTemplate = TEMPLATES[template];

  if (!configTemplate) {
    console.warn(`⚠️ Template "${template}" não está na lista conhecida, assumindo que tem variáveis`);
  }

  const temVariaveis = configTemplate?.temVariaveis !== false;
  const idioma = configTemplate?.language || 'pt_BR';

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

    // 2. Monta os componentes conforme o template
    const components = [];

    // 2.1 Se o template tem imagem no cabeçalho, adiciona
    if (configTemplate?.temImagem && configTemplate?.imagemUrl) {
      components.push({
        type: 'header',
        parameters: [{
          type: 'image',
          image: { link: configTemplate.imagemUrl }
        }]
      });
      console.log(`🖼️ Enviando imagem do cabeçalho: ${configTemplate.imagemUrl}`);
    }

    // 2.2 Se o template tem variáveis no corpo, adiciona
    if (temVariaveis) {
      const parametrosBody = [];

      if (configTemplate?.variaveis?.includes('nome') || !configTemplate) {
        parametrosBody.push({
          type: 'text',
          parameter_name: 'nome',
          text: parametros.nome || 'Cliente'
        });
      }

      if (configTemplate?.variaveis?.includes('empresa') || !configTemplate) {
        parametrosBody.push({
          type: 'text',
          parameter_name: 'empresa',
          text: parametros.empresa || ''
        });
      }

      if (configTemplate?.variaveis?.includes('cidade') || !configTemplate) {
        parametrosBody.push({
          type: 'text',
          parameter_name: 'cidade',
          text: parametros.cidade || ''
        });
      }

      components.push({
        type: 'body',
        parameters: parametrosBody
      });

      console.log(`📤 Enviando template "${template}" com ${parametrosBody.length} parâmetros`);
    } else {
      console.log(`📤 Enviando template "${template}" sem parâmetros no corpo`);
    }

    // 3. Envia para a Meta
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
            language: { code: idioma },
            ...(components.length > 0 && { components })
          }
        })
      }
    );

    const data = await resp.json();

    // 4. Salva a mensagem no Supabase (mesmo se falhar)
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

    // 5. Atualiza a conversa (resumo)
    await supabase.from('conversas').upsert({
      contato_id: contato?.id || null,
      telefone,
      nome_contato: parametros.nome || null,
      ultima_mensagem: `[Template: ${template}]`,
      ultima_mensagem_em: new Date().toISOString(),
      ultima_mensagem_direcao: 'enviada'
    }, { onConflict: 'telefone' });

    if (!resp.ok) {
      console.error('❌ Erro Meta API:', JSON.stringify(data, null, 2));
      return res.status(resp.status).json({ erro: data });
    }

    console.log(`✅ Mensagem enviada para ${telefone} usando template "${template}"`);

    return res.status(200).json({
      messageId: data.messages?.[0]?.id,
      status: 'enviado'
    });
  } catch (err) {
    console.error('❌ Erro interno:', err);
    return res.status(500).json({ erro: err.message });
  }
}
