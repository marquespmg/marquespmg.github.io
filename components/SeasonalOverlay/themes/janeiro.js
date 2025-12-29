// TEMA ANO NOVO COM EMOJIS VARIADOS - JANEIRO 2026
const janeiroTheme = {
  id: 'janeiro',
  nome: 'Ano Novo PMG 2026',
  ativo: true, // DEIXE false ATÉ 01/01/2026
  
  // Cores do Ano Novo + Verão
  cores: {
    azul: '#0d47a1',      // Azul da meia-noite
    dourado: '#ffd700',   // Dourado da prosperidade
    laranja: '#ff6f00',   // Laranja do verão/entusiasmo
    verde: '#2e7d32',     // Verde da renovação
    branco: '#ffffff'
  },
  
  // Modal de boas-vindas (aparece uma vez)
  modal: {
    titulo: '✨ Feliz Ano Novo 2026!',
    mensagem: 'Novo ano, novas conquistas! A PMG te deseja um 2026 de muito sucesso.',
    subtitulo: 'Comece o ano com o pé direito e estoque completo.',
    botao: 'Continuar para o site',
    mostrar: true
  },
  
  // Emojis do Ano Novo/Verão que aparecem aleatoriamente
  emojis: [
    { emoji: '✨', nome: 'Estrela Brilhante' },
    { emoji: '🎆', nome: 'Fogos de Artifício' },
    { emoji: '🥂', nome: 'Champanhe' },
    { emoji: '🌅', nome: 'Nascer do Sol' },
    { emoji: '🔥', nome: 'Fogueira' },
    { emoji: '🌊', nome: 'Onda' },
    { emoji: '📅', nome: 'Calendário Novo' },
    { emoji: '🎯', nome: 'Alvo/Meta' },
    { emoji: '🚀', nome: 'Foguete' },
    { emoji: '💫', nome: 'Brilho' },
    { emoji: '☀️', nome: 'Sol' },
    { emoji: '🌴', nome: 'Palmeira' },
    { emoji: '🏖️', nome: 'Praia' },
    { emoji: '⏳', nome: 'Ampulheta' },
    { emoji: '🌟', nome: 'Estrela Cadente' }
  ],
  
  // Mensagens aleatórias motivacionais
  mensagens: [
    '✨ Feliz 2026!',
    '🎯 Novas metas!',
    '🔥 Verão com ofertas!',
    '🚀 Seu ano de crescimento!',
    '🌅 Novas oportunidades!',
    '💫 Ano brilhante!',
    '🎆 Prosperidade!',
    '🥂 Saúde e sucesso!',
    '📅 Começo renovado!',
    '🌟 Brilhe em 2026!',
    '🌊 Onda de prosperidade!',
    '☀️ Verão de vendas!'
  ],

  // Configurações (mesmo padrão do dezembro)
  config: {
    intervalo: 15000, // Aparece a cada 15 segundos
    duracao: 5000,    // Fica 5 segundos visível
    tamanho: '36px'   // Tamanho do emoji
  }
};

export default janeiroTheme;
