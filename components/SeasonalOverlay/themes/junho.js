const junhoTheme = {
  id: 'junho',
  nome: 'Festa Junina PMG 2026',
  ativo: false, // DEIXE false ATÉ 01/06/2026
  
  // Cores temáticas da Festa Junina
  cores: {
    vermelho: '#e74c3c',     // Vermelho bandeirinha
    amarelo: '#f1c40f',      // Amarelo bandeirinha
    azul: '#3498db',         // Azul bandeirinha
    verde: '#2ecc71',        // Verde bandeirinha
    laranja: '#e67e22',      // Laranja da fogueira
    marrom: '#8B4513',       // Marrom da madeira
    branco: '#ffffff',
    roxo: '#9b59b6'          // Roxo da bandeirinha
  },
  
  // Modal de boas-vindas para Festa Junina
  modal: {
    titulo: '🔥 Arraiá da PMG!',
    mensagem: 'Celebramos a tradição, a alegria e o sabor da Festa Junina! A PMG preparou um arrairá especial para você!',
    subtitulo: 'Um mês para celebrar com muita música, comidas típicas e alegria!',
    botao: 'Continuar para o site',
    mostrar: true
  },
  
  // Emojis temáticos da Festa Junina
  emojis: [
    { emoji: '🎏', nome: 'Bandeirinha' },
    { emoji: '🔥', nome: 'Fogueira' },
    { emoji: '🌽', nome: 'Milho' },
    { emoji: '🥔', nome: 'Batata Doce' },
    { emoji: '🍢', nome: 'Espetinho' },
    { emoji: '🥜', nome: 'Amendoim' },
    { emoji: '🍿', nome: 'Pipoca' },
    { emoji: '🍎', nome: 'Maçã do Amor' },
    { emoji: '🥧', nome: 'Pamonha' },
    { emoji: '🌭', nome: 'Cachorro-Quente' },
    { emoji: '☕', nome: 'Quentão' },
    { emoji: '🪅', nome: 'Festa Junina' },
    { emoji: '🎶', nome: 'Música' },
    { emoji: '🪘', nome: 'Tambor' },
    { emoji: '⭐', nome: 'Estrela' },
    { emoji: '✨', nome: 'Brilho' }
  ],
  
  // Mensagens temáticas para Festa Junina (curtas para caber no balão)
  mensagens: [
    '🎏 Festa Junina!',
    '🔥 Arraiá bom demais!',
    '🌽 Milho quentinho!',
    '🍢 Espetinho saboroso!',
    '🥜 Amendoim torrado!',
    '🍿 Pipoca estourou!',
    '🍎 Maçã do amor!',
    '🥧 Pamonha caseira!',
    '🌭 Cachorro-quente!',
    '☕ Quentão esquentou!',
    '🪅 Bora pro arrairá!',
    '🎶 São João é aqui!'
  ],

  // Configurações
  config: {
    intervalo: 15000, // Aparece a cada 15 segundos
    duracao: 5000,    // Fica 5 segundos visível
    tamanho: '38px'   // Tamanho do emoji
  },
  
  // Destaque especial para São João (24/06)
  diaSaoJoao: {
    data: '2026-06-24', // Dia de São João
    mensagemEspecial: 'Hoje é dia de fogueira, bandeirinha e muita alegria!',
    corDestaque: '#e74c3c',
    ofertaEspecial: 'Viva São João com muita tradição e sabor!'
  }
};

export default junhoTheme;
