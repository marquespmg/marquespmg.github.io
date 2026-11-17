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

  // ============ EBOOK 2 — MANTEIGA TRÊS MARIAS ============
  {
    slug: 'guia-premium-manteiga-sem-sal-tres-marias',
    titulo: 'Guia Premium — Manteiga Comum Sem Sal Três Marias',
    subtitulo:
      'O sabor puro do leite com inspeção federal SIF/DIPOA, na caixa de 5 kg que abastece padarias, confeitarias e restaurantes.',
    categoria: 'Guia Premium',
    destaque: true,
    dataPublicacao: '2026-11-17',
    paginas: 8,
    tempoLeitura: '8 min',
    resumo:
      'Um único ingrediente — creme de soro de leite — batido até virar uma massa compacta e de sabor suave. Ficha técnica completa, inspeção SIF/DIPOA, conservação e rendimento da caixa de 5 kg para o food service.',
    descricao:
      'A Manteiga Comum Sem Sal Três Marias é uma manteiga de verdade: um único ingrediente — creme de soro de leite — batido até virar uma massa compacta, firme e de sabor suave. Sem sal adicionado, ela entrega a gordura e o corpo que a cozinha em volume precisa, e deixa o tempero nas suas mãos. Este guia reúne a ficha técnica oficial, o registro SIF/DIPOA nº 0002/1555, o padrão sensorial definido pelo fabricante, as regras de conservação (até 5 °C fechada, 10 dias após aberta), o rendimento da caixa de 5 kg e as aplicações para padarias, confeitarias, restaurantes, lanchonetes, hotéis e revendas.',
    destaques: [
      'Um único ingrediente: creme de soro de leite',
      'Sem sal adicionado — controle total do tempero',
      'Caixa fechada de 5 kg — formato atacadista',
      'Registro SIF/DIPOA nº 0002/1555 — venda em todo o Brasil',
      'Conservação: até 5 °C fechada, 10 dias após aberta',
      'Rendimento: cerca de 333 porções de 15 g por caixa',
    ],
    arquivo: 'Guia-Premium-Manteiga-Sem-Sal-Tres-Marias-MarquesVendas.pdf',
    capa: '/ebook/capas/guia-manteiga-tres-marias.jpg',
    produtoUrl: 'https://www.marquesvendaspmg.shop/produto/706',
    cor: '#095400',
    tags: ['manteiga', 'sem sal', 'três marias', 'food service', 'SIF', 'atacado'],
  },
];
