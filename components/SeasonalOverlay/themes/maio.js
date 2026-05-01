const maioTheme = {
  id: 'maio',
  nome: 'Mês das Mães PMG 2026',
  ativo: true, // DEIXE false ATÉ 01/05/2026
  
  // Cores temáticas do Mês das Mães
  cores: {
    rosa: '#ff69b4',        // Rosachoque
    rosaClaro: '#ffb6c1',   // Rosa claro
    vermelho: '#e74c3c',    // Vermelho do amor
    dourado: '#ffd700',     // Dourado especial
    lilas: '#c39bd3',       // Lilás
    branco: '#ffffff',
    roxo: '#9b59b6'         // Roxo suave
  },
  
// Modal de boas-vindas para Mês das Mães (SÓ CELEBRAÇÃO)
modal: {
  titulo: '💝 Feliz Mês das Mães!',
  mensagem: 'Celebramos o amor, dedicação e carinho de todas as mães. A PMG homenageia quem nos dá a vida e o amor!',
  subtitulo: 'Um mês especial para celebrar quem sempre cuidou de você com tanto carinho.',
  botao: 'Continuar para o site',
  mostrar: true
},
  
  // Emojis temáticos do Mês das Mães (Food Service)
  emojis: [
    { emoji: '💐', nome: 'Buquê de Flores' },
    { emoji: '🌹', nome: 'Rosa' },
    { emoji: '🌸', nome: 'Flor Cerejeira' },
    { emoji: '🌻', nome: 'Girassol' },
    { emoji: '🌷', nome: 'Tulipa' },
    { emoji: '💖', nome: 'Coração Brilhante' },
    { emoji: '💝', nome: 'Presente com Coração' },
    { emoji: '👩‍🍳', nome: 'Mãe Cozinheira' },
    { emoji: '🍽️', nome: 'Prato e Talher' },
    { emoji: '🥘', nome: 'Panela' },
    { emoji: '🍰', nome: 'Bolo' },
    { emoji: '☕', nome: 'Café' },
    { emoji: '🎁', nome: 'Presente' },
    { emoji: '💗', nome: 'Coração Rosado' },
    { emoji: '🌟', nome: 'Estrela' },
    { emoji: '✨', nome: 'Brilho' }
  ],
  
  // Mensagens temáticas para Mês das Mães (curtas para caber no balão)
  mensagens: [
    '💐 Feliz Dia das Mães!',
    '🌹 Te amo, mãe!',
    '💖 Mãe é amor!',
    '👩‍🍳 Almoço especial!',
    '💝 Combo família!',
    '🌻 Celebre com sabor!',
    '🍽️ Reserve já!',
    '🌟 Sabor de mãe!',
    '💗 Almoço inesquecível!',
    '🥘 Prato com carinho!',
    '🍰 Sobremesa especial!',
    '☕ Café com a melhor!'
  ],

  // Configurações
  config: {
    intervalo: 15000, // Aparece a cada 15 segundos
    duracao: 5000,    // Fica 5 segundos visível
    tamanho: '38px'   // Tamanho do emoji
  },
  
  // Destaque especial para o Dia das Mães (2º domingo de maio - 10/05/2026)
  diaMaes: {
    data: '2026-05-10', // Dia das Mães 2026
    mensagemEspecial: 'Mãe, amor que não cabe no peito! Feliz Dia das Mães!',
    corDestaque: '#ff69b4',
    ofertaEspecial: 'Um dia especial para celebrar quem te ama incondicionalmente!'
  }
};

export default maioTheme;