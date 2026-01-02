// hook/useTrackUser.js - VERSÃO CORRIGIDA
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useTrackUser() {
  useEffect(() => {
    console.log('🔍 HOOK useTrackUser INICIADO');
    
    const trackActivity = async () => {
      try {
        console.log('🔄 Executando trackActivity...');
        
        // 1. Gera ou recupera visitor_id
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('visitor_id', visitorId);
          console.log('🆔 Novo visitor ID criado:', visitorId);
        } else {
          console.log('🆔 Visitor ID recuperado:', visitorId);
        }
        
        // 2. Verifica se tem usuário logado
        const { data: { user } } = await supabase.auth.getUser();
        console.log('👤 Estado do usuário:', user ? 'Logado - ' + user.email : 'Não logado');
        
        // 3. Coleta dados básicos
        const dadosAtividade = {
          pagina_atual: window.location.pathname,
          url_completa: window.location.href,
          titulo_pagina: document.title,
          ultima_atividade: new Date().toISOString(),
          sessao_id: visitorId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'direto',
          tipo_visita: user ? 'logado' : 'anonimo',
          nome_usuario: user ? (user.email?.split('@')[0] || 'Usuário') : 'Visitante',
          email_usuario: user ? user.email : 'anonimo@visitante.com'
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
        
        // 4. VERIFICA SE JÁ EXISTE REGISTRO PARA ESTA SESSÃO
        console.log('🔎 Verificando registro existente para sessão:', visitorId);
        
        const { data: registroExistente, error: checkError } = await supabase
          .from('clientes_online')
          .select('id, created_at, pagina_atual')
          .eq('sessao_id', visitorId)
          .single();
        
        if (checkError && checkError.code === 'PGRST116') {
          // Nenhum registro encontrado - INSERE NOVO
          console.log('📝 Nenhum registro encontrado - Inserindo novo...');
          
          const { error: insertError } = await supabase
            .from('clientes_online')
            .insert([dadosAtividade]);
          
          if (insertError) {
            console.log('❌ ERRO ao inserir:', insertError.message);
          } else {
            console.log('✅ NOVO registro inserido');
          }
          
        } else if (checkError) {
          console.log('⚠️ Erro ao verificar registro:', checkError.message);
          
        } else {
          // Registro encontrado - ATUALIZA EXISTENTE
          console.log('✏️ Registro encontrado (ID:', registroExistente.id, ') - Atualizando...');
          
          // Calcula tempo de conexão
          const tempoConectado = new Date() - new Date(registroExistente.created_at);
          const segundos = Math.floor(tempoConectado / 1000);
          const minutos = Math.floor(segundos / 60);
          const horas = Math.floor(minutos / 60);
          
          // Formata o tempo
          let tempoFormatado = `${segundos} segundos`;
          if (horas > 0) {
            tempoFormatado = `${horas}h ${minutos % 60}m`;
          } else if (minutos > 0) {
            tempoFormatado = `${minutos}m ${segundos % 60}s`;
          }
          
          // Atualiza o registro existente
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
            console.log('✅ Registro ATUALIZADO - Tempo:', tempoFormatado);
            
            // Se mudou de página, mostra no log
            if (registroExistente.pagina_atual !== dadosAtividade.pagina_atual) {
              console.log('📍 Usuário mudou de página:', registroExistente.pagina_atual, '→', dadosAtividade.pagina_atual);
            }
          }
        }
        
      } catch (error) {
        console.log('💥 ERRO FATAL no tracking:', error.message);
      }
    };
    
    // Executa imediatamente
    trackActivity();
    
    // Atualiza a cada 30 segundos (agora atualiza, não insere)
    const intervalId = setInterval(trackActivity, 30000);
    console.log('⏰ Intervalo configurado: 30 segundos (atualizações)');
    
    // Limpeza
    return () => {
      console.log('🧹 Limpando hook useTrackUser');
      clearInterval(intervalId);
    };
  }, []);
}