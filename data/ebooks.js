// data/ebooks.js
// Metadados de todos os ebooks. Para adicionar um novo, basta incluir um objeto.
// O PDF correspondente deve estar em: /public/ebook/<arquivo>

export const ebooks = [
  // ============ EBOOK 1 ============
  {
    slug: 'guia-tecnico-carne-desfiada-bovina-alfama',
    titulo: 'Guia Técnico — Carne Desfiada Bovina Alfama',
    subtitulo:
      'Qualidade, segurança e o diferencial que você percebe em cada detalhe',
    categoria: 'Ficha Técnica',
    destaque: true,
    dataPublicacao: '2026-01-15',
    paginas: 8,
    tempoLeitura: '8 min',
    resumo:
      'Matéria-prima, processo, padrão de pureza, análises microbiológicas, validade e conservação — tudo o que a ficha técnica ALFAMA diz sobre o produto, reunido para você comprar com confiança.',
    descricao:
      'A Carne Desfiada Bovina Sabor Carne Seca Alfama é um produto congelado pronto para o uso: carne bovina temperada, cozida e desfiada, embalada a vácuo em pacotes de 1 quilo. Este guia reúne todos os números oficiais da ficha técnica ALFAMA — matéria-prima, processo produtivo, padrão de pureza, análises microbiológicas, ficha técnica completa, validade em cada etapa e regras de conservação — para que você compre, revenda e sirva com total segurança.',
    destaques: [
      'Pronta para o refogado (temperada, cozida, desfiada e congelada na planta)',
      'Peso conferido: 1.000 a 1.010 g por pacote',
      'Fibras uniformes, sem osso e 100% aproveitável',
      '365 dias de validade fechada a -12 °C a -18 °C',
      'Sem glúten e sem lactose',
      'Registro SISBI/POA — válido em todo o território nacional',
    ],
    arquivo: 'Guia-Tecnico-Carne-Desfiada-Bovina-Alfama-MarquesVendas.pdf',
    capa: '/ebook/capas/guia-carne-desfiada-alfama.jpg',
    produtoUrl: 'https://www.marquesvendaspmg.shop/produto/533',
    cor: '#095400',
    tags: ['carne desfiada', 'carne seca', 'ficha técnica', 'ALFAMA', 'food service'],
  },

  // ============ EBOOK 2 (exemplo comentado — apague se não for usar) ============
  // {
  //   slug: 'guia-tecnico-queijo-mucarela-bari',
  //   titulo: 'Guia Técnico — Queijo Muçarela Bari 4 kg',
  //   subtitulo: 'Qualidade premium para pizzarias, restaurantes e food service',
  //   categoria: 'Ficha Técnica',
  //   destaque: false,
  //   dataPublicacao: '2026-02-10',
  //   paginas: 6,
  //   tempoLeitura: '6 min',
  //   resumo: 'Texto curto de 2 a 3 linhas que aparece no card da home.',
  //   descricao:
  //     'Texto longo que aparece na seção "Sobre este material". Pode ter 3, 4, 5 parágrafos. Aqui você conta tudo: matéria-prima, processo, diferenciais, aplicações, conservação etc.',
  //   destaques: [
  //     'Queijo muçarela de alta qualidade',
  //     'Peso padrão de 4 kg por peça',
  //     'Ideal para pizzarias e restaurantes',
  //     'Validade e conservação controladas',
  //     'Registro SIF/inspeção oficial',
  //   ],
  //   arquivo: 'Guia-Tecnico-Queijo-Mucarela-Bari-MarquesVendas.pdf',
  //   capa: '/ebook/capas/guia-mucarela-bari.jpg',
  //   produtoUrl: 'https://www.marquesvendaspmg.shop/produto/XXXX',
  //   cor: '#095400',
  //   tags: ['muçarela', 'queijo', 'Bari', 'pizzaria', 'food service'],
  // },
];