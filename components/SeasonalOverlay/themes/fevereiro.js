const fevereiroTheme = {
  id: 'fevereiro',
  nome: 'Carnaval PMG 2026',
  ativo: true, // DEIXE false ATÉ 01/02/2026
  
  // Cores vibrantes do Carnaval
  cores: {
    amarelo: '#ffeb3b',      // Amarelo ouro
    roxo: '#9c27b0',         // Roxo da folia
    verde: '#4caf50',        // Verde das serpentinas
    rosa: '#e91e63',         // Rosa do confete
    azul: '#2196f3',         // Azul céu
    laranja: '#ff9800',      // Laranja do entusiasmo
    branco: '#ffffff'
  },
  
  // Modal de boas-vindas para Carnaval
  modal: {
    titulo: '🎭 É Carnaval na PMG! 🎉',
    mensagem: 'A festa chegou e as ofertas também! Aproveite o Carnaval com nossos produtos.',
    subtitulo: 'Frete acelerado para você curtir a folia sem preocupações!',
    botao: 'Continuar para o site',
    mostrar: true
  },
  
  // Emojis do Carnaval que aparecem aleatoriamente
  emojis: [
    { emoji: '🎭', nome: 'Máscara de Carnaval' },
    { emoji: '🎉', nome: 'Confete' },
    { emoji: '🪅', nome: 'Pinhata' },
    { emoji: '🥁', nome: 'Tambor' },
    { emoji: '🎊', nome: 'Serpentina' },
    { emoji: '👑', nome: 'Coro' },
    { emoji: '💃', nome: 'Dançarina' },
    { emoji: '🕺', nome: 'Dançarino' },
    { emoji: '🎶', nome: 'Notas Musicais' },
    { emoji: '🥳', nome: 'Rosto Festivo' },
    { emoji: '✨', nome: 'Brilho' },
    { emoji: '🟡', nome: 'Amarelo' },
    { emoji: '🟣', nome: 'Roxo' },
    { emoji: '🟢', nome: 'Verde' },
    { emoji: '🔴', nome: 'Vermelho' }
  ],
  
  // Mensagens aleatórias carnavalescas
  mensagens: [
    '🎭 É Carnaval!',
    '💃 Ofertas na folia!',
    '🎉 Confete de descontos!',
    '🥁 Batucando preços baixos!',
    '👑 Rei das ofertas!',
    '🪅 Pinhata de promoções!',
    '✨ Brilhe no Carnaval!',
    '🎶 Samba no precinho!',
    '🥳 Festa de descontos!',
    '🟣 Roxo de economia!',
    '🟡 Amarelo ouro!',
    '🔴 Vermelho paixão!'
  ],

  // Configurações (mesmo padrão)
  config: {
    intervalo: 12000, // Aparece a cada 12 segundos (mais rápido, ritmo de carnaval)
    duracao: 4000,    // Fica 4 segundos visível
    tamanho: '40px'   // Tamanho um pouco maior para carnaval
  }
};

export default fevereiroTheme;