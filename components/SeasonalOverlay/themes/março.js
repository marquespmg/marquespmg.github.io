const marcoTheme = {
  id: 'março',
  nome: 'Mês da Mulher PMG 2026',
  ativo: false, // DEIXE false ATÉ 01/03/2026
  
  // Cores temáticas do Mês da Mulher
  cores: {
    roxo: '#8e24aa',         // Roxo do feminismo
    rosa: '#e91e63',         // Rosa tradicional
    lilas: '#ba68c8',        // Lilás da igualdade
    dourado: '#ffd700',      // Dourado do empoderamento
    branco: '#ffffff',
    preto: '#000000'
  },
  
  // Modal de boas-vindas para Mês da Mulher
  modal: {
    titulo: '💖 Feliz Mês da Mulher! 👩‍💼',
    mensagem: 'Celebramos a força, coragem e conquistas das mulheres. A PMG apoia o empreendedorismo feminino!',
    subtitulo: 'Ofertas especiais para mulheres empreendedoras e todas as que fazem a diferença.',
    botao: 'Continuar para o site',
    mostrar: true
  },
  
  // Emojis temáticos do Mês da Mulher
  emojis: [
    { emoji: '💖', nome: 'Coração Vermelho' },
    { emoji: '👩‍💼', nome: 'Mulher de Negócios' },
    { emoji: '👩‍🔬', nome: 'Mulher Cientista' },
    { emoji: '👩‍🚀', nome: 'Mulher Astronauta' },
    { emoji: '👩‍🏫', nome: 'Mulher Professora' },
    { emoji: '👩‍⚕️', nome: 'Mulher Médica' },
    { emoji: '👩‍🌾', nome: 'Mulher Agricultora' },
    { emoji: '👩‍🍳', nome: 'Mulher Chef' },
    { emoji: '💪', nome: 'Braço Forte' },
    { emoji: '🌟', nome: 'Estrela' },
    { emoji: '✨', nome: 'Brilho' },
    { emoji: '🦋', nome: 'Borboleta' },
    { emoji: '🌺', nome: 'Flor' },
    { emoji: '👑', nome: 'Coro' },
    { emoji: '⚖️', nome: 'Balança' }
  ],
  
  // Mensagens inspiradoras para o Mês da Mulher
  mensagens: [
    '💖 Mês da Mulher!',
    '👩‍💼 Empoderamento!',
    '🌟 Mulheres brilhantes!',
    '💪 Força feminina!',
    '✨ Conquistas das mulheres!',
    '👑 Rainha do seu negócio!',
    '🌺 Floresça em 2026!',
    '🦋 Transformação!',
    '⚖️ Igualdade sempre!',
    '👩‍🔬 Mulheres na ciência!',
    '👩‍🚀 Alcançando as estrelas!',
    '👩‍🏫 Educando o futuro!'
  ],

  // Configurações
  config: {
    intervalo: 15000, // Aparece a cada 15 segundos
    duracao: 5000,    // Fica 5 segundos visível
    tamanho: '38px'   // Tamanho do emoji
  },
  
  // Destaque especial para o dia 8 de março
  dia8marco: {
    mensagemEspecial: '🏆 Feliz Dia Internacional da Mulher! 8 de Março - Celebrando conquistas e inspirações!',
    corDestaque: '#ff4081',
    ofertaEspecial: 'Oferta especial apenas para mulheres empreendedoras'
  }
};

export default marcoTheme;
