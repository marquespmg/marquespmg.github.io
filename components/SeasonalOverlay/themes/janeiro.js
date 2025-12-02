// TEMA ANO NOVO ELEGANTE - JANEIRO 2026
const janeiroTheme = {
  id: 'janeiro',
  nome: 'Ano Novo 2026',
  ativo: false, // Deixe false por enquanto
  
  cores: {
    primaria: '#0d47a1',     // Azul royal
    secundaria: '#ffab00',   // Amarelo dourado
    realce: '#00695c',       // Verde petróleo
    fundo: 'rgba(13, 71, 161, 0.02)',
    texto: '#263238'
  },
  
  mensagem: {
    titulo: 'Feliz Ano Novo! ✨',
    subtitulo: 'Novas conquistas começam aqui',
    acao: 'Explore nossas novidades para 2026',
    botao: 'Ver Novidades'
  },
  
  link: '/novidades',
  
  elementos: {
    confetti: { ativo: true, quantidade: 20, opacidade: 0.5 },
    estrelas: { ativo: true, quantidade: 6, cor: '#ffab00' }
  },
  
  efeitos: {
    brilho: true,
    sombra: true,
    animacao: 'suave'
  }
};

export default janeiroTheme;