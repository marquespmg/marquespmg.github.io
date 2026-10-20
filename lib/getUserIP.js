// lib/getUserIP.js

import { supabase } from './supabaseClient';

/**
 * Pega o IP público do usuário de forma segura.
 * Usa 3 camadas de fallback para nunca quebrar o site.
 * Não lança erro: retorna null se não conseguir.
 */
export async function getUserIP() {
  const tentarFetch = async (url, timeoutMs = 3000) => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) return null;
      const data = await res.json();
      return data?.ip || null;
    } catch {
      return null;
    }
  };

  // 1. Cloudflare trace (mais rápido se você usa CF)
  try {
    const cf = await fetch('/cdn-cgi/trace', { cache: 'no-store' })
      .then(r => r.ok ? r.text() : null)
      .catch(() => null);
    if (cf) {
      const match = cf.match(/^ip=(.+)$/m);
      if (match && match[1] && match[1] !== '') return match[1].trim();
    }
  } catch {}

  // 2. ipify
  const ip1 = await tentarFetch('https://api.ipify.org?format=json');
  if (ip1) return ip1;

  // 3. ipapi (backup)
  const ip2 = await tentarFetch('https://api.ipify.org?format=json');
  if (ip2) return ip2;

  return null;
}

/**
 * Versão com cache em sessionStorage — evita chamar a API
 * toda vez que o usuário navega. Dura 1 sessão.
 */
export async function getUserIPCached() {
  if (typeof window === 'undefined') return null;

  try {
    const cached = sessionStorage.getItem('user_ip');
    if (cached) return cached;

    const ip = await getUserIP();
    if (ip) {
      sessionStorage.setItem('user_ip', ip);
    }
    return ip;
  } catch {
    return null;
  }
}

/**
 * Registra um acesso (IP + email + tentativa) na tabela access_logs.
 *
 * @param {Object} params
 * @param {string|null} params.ip         - IP do usuário (pegue com getUserIPCached)
 * @param {string|null} params.email      - Email informado / do usuário logado
 * @param {string}      params.tentativa  - 'login' | 'cadastro' | 'acesso' | 'bloqueado'
 *
 * Nunca lança erro — falhas são apenas logadas no console.
 */
export async function registrarAcesso({ ip, email, tentativa }) {
  try {
    if (!ip) return; // sem IP não registra (evita lixo no banco)

    // Tenta pegar o usuário logado (pode ser null)
    let userId = null;
    let userEmail = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
      userEmail = user?.email || null;
    } catch {
      // ignora — segue sem user_id
    }

    // Normaliza email
    const emailNorm = (email || userEmail || '').trim().toLowerCase() || null;

    const { error } = await supabase.from('access_logs').insert([{
      user_id: userId,
      email: emailNorm,
      ip: ip,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      page: typeof window !== 'undefined' ? window.location.pathname : null,
      tentativa: tentativa,
    }]);

    if (error) {
      console.warn('⚠️ [ACCESS_LOG] Erro ao registrar:', error);
      return;
    }

    console.log(`📝 [ACCESS_LOG] ${tentativa} registrado:`, {
      ip,
      email: emailNorm,
    });
  } catch (err) {
    // silencioso — nunca quebra o fluxo principal
    console.warn('⚠️ [ACCESS_LOG] Falha inesperada:', err);
  }
}