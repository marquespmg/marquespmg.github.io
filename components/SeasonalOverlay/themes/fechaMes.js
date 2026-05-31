const fechaMesTheme = {
  id: 'fechaMes',
  nome: 'Fecha Mês PMG - 2% OFF',
  ativo: false,
  
  // Cores temáticas da PMG
  cores: {
    verdeEscuro: '#1e5c3b',   // Verde PMG
    vermelho: '#c62828',       // Vermelho PMG
    dourado: '#ffd700',        // Dourado do desconto
    branco: '#ffffff',
    cinza: '#f5f5f5',
    preto: '#1a1a1a'
  },
  
  // Modal de boas-vindas FECHA MÊS
  modal: {
    titulo: '🔥 FECHA MÊS PMG!',
    mensagem: 'Últimos dias do mês! Aproveite 2% OFF em todos os produtos do nosso catálogo!',
    subtitulo: 'Oferta válida apenas nos últimos 3 dias do mês. Corre que acaba!',
    botao: 'Continuar para o site',
    mostrar: true
  },
  
  // Emojis temáticos do FECHA MÊS
  emojis: [
    { emoji: '🤑', nome: 'Fogo' },
    { emoji: '💰', nome: 'Dinheiro' },
    { emoji: '💸', nome: 'Dinheiro voando' },
    { emoji: '🎯', nome: 'Alvo' },
    { emoji: '⚡', nome: 'Relâmpago' },
    { emoji: '🏷️', nome: 'Etiqueta de preço' },
    { emoji: '💎', nome: 'Diamante' },
    { emoji: '✨', nome: 'Brilho' },
    { emoji: '📅', nome: 'Calendário' },
    { emoji: '⏰', nome: 'Relógio' },
    { emoji: '🎉', nome: 'Festa' },
    { emoji: '💪', nome: 'Força' }
  ],
  
  // Mensagens temáticas para FECHA MÊS (curtas para caber no balão)
  mensagens: [
    '🔥 2% OFF em tudo!',
    '💰 Últimos dias!',
    '⚡ Corre que acaba!',
    '🏷️ Desconto especial!',
    '💸 Economize agora!',
    '🎯 Fecha mês com força!',
    '✨ Oferta imperdível!',
    '📅 Só até o fim do mês!',
    '⏰ Última chance!',
    '💎 Aproveite 2% OFF!',
    '🔥 Não perca!',
    '🎉 Fecha com chave de ouro!'
  ],

  // Configurações
  config: {
    intervalo: 15000, // Aparece a cada 15 segundos
    duracao: 5000,    // Fica 5 segundos visível
    tamanho: '38px'   // Tamanho do emoji
  }
};

export default fechaMesTheme;