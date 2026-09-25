// pages/api/mensagens.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { telefone } = req.query;
  if (!telefone) return res.status(400).json({ erro: 'Telefone obrigatório' });

  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .eq('telefone', telefone)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ erro: error.message });

  // Marca como lidas
  await supabase
    .from('conversas')
    .update({ nao_lidas: 0 })
    .eq('telefone', telefone);

  return res.status(200).json({ mensagens: data });
}