// TEMA NATALINO COM EMOJIS VARIADOS - DEZEMBRO 2025
const dezembroTheme = {
  id: 'dezembro',
  nome: 'Natal PMG 2025',
  ativo: true,
  
  // Cores natalinas
  cores: {
    vermelho: '#c62828',
    dourado: '#ffd700',
    verde: '#2e7d32',
    branco: '#ffffff'
  },
  
  // Modal de boas-vindas (aparece uma vez)
  modal: {
  titulo: '🎄 Feliz Natal!',
  mensagem: 'A PMG deseja ótimas vendas pra você e sua equipe.',
  subtitulo: 'Estamos aqui pra facilitar seu abastecimento de fim de ano.',
  botao: 'Continuar para o site',
  mostrar: true
},
  
  // Emojis natalinos que aparecem aleatoriamente
  emojis: [
    { emoji: '🎅', nome: 'Papai Noel' },
    { emoji: '🤶', nome: 'Mamãe Noel' },
    { emoji: '🎄', nome: 'Árvore de Natal' },
    { emoji: '⭐', nome: 'Estrela' },
    { emoji: '🎁', nome: 'Presente' },
    { emoji: '🦌', nome: 'Rena' },
    { emoji: '❄️', nome: 'Floco de Neve' },
    { emoji: '✨', nome: 'Brilho' },
    { emoji: '🔔', nome: 'Sino' },
    { emoji: '🕯️', nome: 'Vela' }
  ],
  
  // Mensagens aleatórias
  mensagens: [
  'Feliz Natal! 🎄',
  'Boas Festas! 🎁',
  'Natal iluminado!',
  'Prosperidade 2026!',
  'Magia do Natal!',
  'Celebre e venda!',
  'Natal abençoado!',
  'Paz do Natal!'
],

  // Configurações
  config: {
    intervalo: 15000, // Aparece a cada 15 segundos
    duracao: 5000,    // Fica 5 segundos visível
    tamanho: '36px'   // Tamanho do emoji
  }
};

export default dezembroTheme;