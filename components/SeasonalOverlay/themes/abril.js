const abrilTheme = {
  id: 'abril',
  nome: 'Mês da Páscoa PMG 2026',
  ativo: true, // DEIXE false ATÉ 01/04/2026
  
  // Cores temáticas da Páscoa
  cores: {
    amarelo: '#ffd700',      // Amarelo do sol e dos ovos de Páscoa
    rosa: '#f8a5c2',         // Rosa das flores da primavera
    lilas: '#c39bd3',        // Lilás da Páscoa
    verde: '#7dcea0',        // Verde da esperança e primavera
    laranja: '#f39c12',      // Laranja vibrante
    branco: '#ffffff',
    azul: '#85c1e9',          // Azul do céu de primavera
	roxo: '#8A00C4'
  },
  
  // Modal de boas-vindas para Páscoa
  modal: {
    titulo: '🕊️ Feliz Páscoa! ✨',
    mensagem: 'Celebramos renovação, esperança e prosperidade. A PMG deseja uma Páscoa doce e abençoada!',
    subtitulo: 'Ofertas especiais de Páscoa para você aproveitar com quem ama.',
    botao: 'Continuar para o site',
    mostrar: true
  },
  
  // Emojis temáticos da Páscoa
  emojis: [
    { emoji: '🐰', nome: 'Coelho' },
    { emoji: '🥚', nome: 'Ovo de Páscoa' },
    { emoji: '🐣', nome: 'Pintinho' },
    { emoji: '🐥', nome: 'Pintinho saindo do ovo' },
    { emoji: '🌸', nome: 'Flor Cerejeira' },
    { emoji: '🌼', nome: 'Flor Amarela' },
    { emoji: '💐', nome: 'Buquê' },
    { emoji: '🍫', nome: 'Chocolate' },
    { emoji: '✨', nome: 'Brilho' },
    { emoji: '🌟', nome: 'Estrela' },
    { emoji: '💝', nome: 'Presente com coração' },
    { emoji: '🕊️', nome: 'Pomba da Paz' },
    { emoji: '🌷', nome: 'Tulipa' },
    { emoji: '🐇', nome: 'Coelhinho' },
    { emoji: '🍬', nome: 'Doce' },
    { emoji: '🎀', nome: 'Laço' }
  ],
  
  // Mensagens temáticas para Páscoa
  mensagens: [
    '🐰 Feliz Páscoa!',
    '🥚 Ovos de Páscoa!',
    '🐣 Renovação!',
    '🌸 Primavera chegou!',
    '🍫 Chocolate para todos!',
    '💝 Páscoa abençoada!',
    '🌼 Renascer!',
    '🐇 Coelhinho da Páscoa!',
    '✨ Esperança e paz!',
    '🕊️ Páscoa de luz!',
    '🌷 Floresça nesta Páscoa!',
    '🍬 Doce Páscoa!'
  ],

  // Configurações
  config: {
    intervalo: 15000, // Aparece a cada 15 segundos
    duracao: 5000,    // Fica 5 segundos visível
    tamanho: '38px'   // Tamanho do emoji
  },
  
  // Destaque especial para o domingo de Páscoa (ajuste o dia conforme o calendário de 2026)
  diaPascoa: {
    data: '2026-04-05', // Domingo de Páscoa em 2026
    mensagemEspecial: 'Hoje celebramos renovação e esperança! Aproveite nossa oferta especial de Páscoa!',
    corDestaque: '#8A00C4',
    ofertaEspecial: 'Oferta de Páscoa - Desconto especial para celebrar com quem você ama'
  }
};

export default abrilTheme;