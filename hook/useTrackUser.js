// hook/useTrackUser.js
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// 🔍 FUNÇÃO PARA DETECTAR SE ESTÁ NO APP (WEBVIEW)
function detectarWebView() {
  // 1. Verifica pelo User Agent
  const ua = navigator.userAgent.toLowerCase();
  const isWebView = (
    // Android WebView
    (ua.includes('wv') || ua.includes('android') && !ua.includes('chrome')) ||
    // iOS WebView (UIWebView ou WKWebView)
    (/(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(ua)) ||
    // Pelo window.navigator.standalone (iOS)
    window.navigator.standalone === true ||
    // Pela presença de objetos específicos do React Native
    (window.ReactNativeWebView && window.ReactNativeWebView.postMessage)
  );
  
  console.log('📱 Detectado WebView:', isWebView);
  return isWebView;
}

export default function useTrackUser() {
  useEffect(() => {
    console.log('🔍 HOOK useTrackUser INICIADO');
    
    // 🔥 DETECTA SE É APP OU NAVEGADOR
    const isApp = detectarWebView();
    console.log('📲 Tipo de acesso:', isApp ? 'APP (WebView)' : 'Navegador');
    
    const trackActivity = async () => {
      try {
        console.log('🔄 Executando trackActivity...');
        
        // ... (seu código existente para visitorId) ...
        
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('visitor_id', visitorId);
          console.log('🆔 Novo visitor ID criado:', visitorId);
        } else {
          console.log('🆔 Visitor ID recuperado:', visitorId);
        }
        
        // ... (seu código existente para usuário) ...
        
        const { data: { user } } = await supabase.auth.getUser();
        console.log('👤 Estado do usuário:', user ? 'Logado - ' + user.email : 'Não logado');
        
        // ... (seu código existente para visitorNumber) ...
        
        let visitorNumber = 1;
        
        if (!user) {
          try {
            const { data: lastVisitor, error } = await supabase
              .from('contador_visitantes')
              .select('ultimo_numero')
              .single();
            
            if (error && error.code === 'PGRST116') {
              console.log('📊 Criando contador de visitantes...');
              const { error: createError } = await supabase
                .from('contador_visitantes')
                .insert([{ ultimo_numero: 1 }]);
              
              if (createError) {
                console.log('⚠️ Erro ao criar contador:', createError.message);
                visitorNumber = 1;
              } else {
                visitorNumber = 1;
              }
            } else if (error) {
              console.log('⚠️ Erro ao buscar contador:', error.message);
              visitorNumber = 1;
            } else {
              visitorNumber = lastVisitor.ultimo_numero + 1;
              
              await supabase
                .from('contador_visitantes')
                .update({ ultimo_numero: visitorNumber })
                .eq('id', 1);
              
              console.log('🔢 Novo número sequencial:', visitorNumber);
            }
          } catch (counterError) {
            console.log('⚠️ Erro no contador:', counterError.message);
            visitorNumber = 1;
          }
        }
        
        // 4. Coleta dados básicos - 🔥 ADICIONEI O CAMPO tipo_acesso
        const dadosAtividade = {
          pagina_atual: window.location.pathname,
          url_completa: window.location.href,
          titulo_pagina: document.title,
          ultima_atividade: new Date().toISOString(),
          sessao_id: visitorId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'direto',
          tipo_visita: user ? 'logado' : 'anonimo',
          // 🔥 NOVO CAMPO: Identifica se veio do APP
          tipo_acesso: isApp ? 'app' : 'navegador',
          nome_usuario: user ? (user.email?.split('@')[0] || 'Usuário') : `Visitante ${visitorNumber}`,
          email_usuario: user ? user.email : `visitante${visitorNumber}@anonimo.com`,
          visitor_number: visitorNumber
        };
        
        // Se tiver usuário logado, busca mais dados
        if (user) {
          console.log('🔍 Buscando dados do usuário na tabela...');
          const { data: usuarioData, error: userError } = await supabase
            .from('usuarios')
            .select('nome, email')
            .eq('id', user.id)
            .single();
          
          if (userError) {
            console.log('⚠️ Erro ao buscar usuário:', userError.message);
          } else if (usuarioData) {
            dadosAtividade.usuario_id = user.id;
            dadosAtividade.nome_usuario = usuarioData.nome || user.email;
            dadosAtividade.email_usuario = usuarioData.email || user.email;
            console.log('✅ Dados do usuário encontrados:', usuarioData);
          }
        }
        
        console.log('📊 Dados coletados:', dadosAtividade);
        console.log('📱 Origem:', dadosAtividade.tipo_acesso.toUpperCase()); // 🔥 LOG DA ORIGEM
        
        // ... (restante do seu código existente) ...
        
        // 5. VERIFICA SE JÁ EXISTE REGISTRO PARA ESTA SESSÃO NESTA PÁGINA
        console.log('🔎 Verificando registro para sessão:', visitorId, 'na página:', window.location.pathname);
        
        const { data: registroExistente, error: checkError } = await supabase
          .from('clientes_online')
          .select('id, created_at, pagina_atual')
          .eq('sessao_id', visitorId)
          .eq('pagina_atual', window.location.pathname)
          .single();
        
        if (checkError && checkError.code === 'PGRST116') {
          console.log('📝 Nenhum registro encontrado para esta página - Inserindo novo...');
          
          const { error: insertError } = await supabase
            .from('clientes_online')
            .insert([dadosAtividade]);
          
          if (insertError) {
            console.log('❌ ERRO ao inserir:', insertError.message);
          } else {
            console.log('✅ NOVO registro para esta página - Visitante:', visitorNumber);
            console.log('📱 Origem:', isApp ? 'APP' : 'NAVEGADOR');
          }
          
        } else if (checkError) {
          console.log('⚠️ Erro ao verificar registro:', checkError.message);
          
        } else {
          console.log('✏️ Registro encontrado para esta página (ID:', registroExistente.id, ') - Atualizando...');
          
          const tempoConectado = new Date() - new Date(registroExistente.created_at);
          const segundos = Math.floor(tempoConectado / 1000);
          const minutos = Math.floor(segundos / 60);
          const horas = Math.floor(minutos / 60);
          
          let tempoFormatado = `${segundos} segundos`;
          if (horas > 0) {
            tempoFormatado = `${horas}h ${minutos % 60}m`;
          } else if (minutos > 0) {
            tempoFormatado = `${minutos}m ${segundos % 60}s`;
          }
          
          const { error: updateError } = await supabase
            .from('clientes_online')
            .update({
              ...dadosAtividade,
              tempo_conexao: tempoFormatado
            })
            .eq('id', registroExistente.id);
          
          if (updateError) {
            console.log('❌ ERRO ao atualizar:', updateError.message);
          } else {
            console.log('✅ Registro ATUALIZADO - Tempo nesta página:', tempoFormatado);
            console.log('📱 Origem:', isApp ? 'APP' : 'NAVEGADOR');
          }
        }
        
      } catch (error) {
        console.log('💥 ERRO FATAL no tracking:', error.message);
      }
    };
    
    // Executa imediatamente quando a página carrega
    trackActivity();
    
    // Atualiza a cada 30 segundos
    const intervalId = setInterval(trackActivity, 30000);
    console.log('⏰ Intervalo configurado: 30 segundos');
    
    // Limpeza
    return () => {
      console.log('🧹 Limpando hook useTrackUser');
      clearInterval(intervalId);
    };
  }, []);
}
