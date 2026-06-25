const appQrCodeTheme = {
  id: 'appQrCode',
  nome: 'App PMG - QR Code',
  ativo: true, // DEIXE false, ative quando quiser mostrar
  
  // Cores temáticas da PMG
  cores: {
    verdeEscuro: '#1e5c3b',   // Verde PMG
    vermelho: '#ff0000',       // Vermelho PMG
    dourado: '#ffd700',        // Dourado
    branco: '#ffffff',
    cinza: '#f5f5f5',
    preto: '#1a1a1a'
  },
  
  // Modal com QR Code para o App
  modal: {
    titulo: ' Baixe nosso app!',
    mensagem: '📱 Faça seu pedido em 1 minuto! Com o App PMG, você faz seu pedido rápido, sem filas e sem espera.',
    subtitulo: 'Marques Vendas PMG - Trazendo facilidade pra você\nDisponível para Android (em breve iOS)',
    botao: 'Continuar para o site',
    mostrar: true,
    qrCodeImage: '/qrcodeapp.png',
    // NOVAS IMAGENS DOS SELOS
    googlePlayImage: '/google-play-badge.png',
    appStoreImage: '/app-store-badge.png',
    // Emoji decorativo do modal
    emojiDecorativo: '✨',
    // LINK DO APP NA GOOGLE PLAY
    appLink: 'https://play.google.com/store/apps/details?id=com.marquesantonio.marquesvendaspmg'
  },
  
  // Emojis temáticos do App
  emojis: [
    { emoji: '📱', nome: 'Smartphone' },
    { emoji: '📲', nome: 'Baixar App' },
    { emoji: '⭐', nome: 'Estrela' },
    { emoji: '✨', nome: 'Brilho' },
    { emoji: '🚀', nome: 'Foguete' },
    { emoji: '💪', nome: 'Força' },
    { emoji: '🎯', nome: 'Alvo' },
    { emoji: '🔗', nome: 'Link' },
    { emoji: '📥', nome: 'Download' },
    { emoji: '✅', nome: 'Check' }
  ],
  
  // Mensagens curtas para o balão
  mensagens: [
    '📱 Baixe o App!',
    '📲 Peça em 1 minuto!',
    '⭐ Sem filas!',
    '🚀 PMG no seu bolso!',
    '💪 Marques Vendas!',
    '🎯 Escaneie e baixe!',
    '📥 Rápido e fácil!',
    '✅ Android já!',
    '🔗 QR Code abaixo!',
    '📱 Facilidade pra você!'
  ],

  // Configurações
  config: {
    intervalo: 15000,
    duracao: 5000,
    tamanho: '38px'
  }
};

export default appQrCodeTheme;
