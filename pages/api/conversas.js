// pages/api/conversas.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { data, error } = await supabase
    .from('conversas')
    .select('*')
    .order('ultima_mensagem_em', { ascending: false });

  if (error) return res.status(500).json({ erro: error.message });
  return res.status(200).json({ conversas: data });
}