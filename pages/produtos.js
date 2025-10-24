import React, { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

// CONFIGURAÇÃO DAS PALAVRAS-CHAVE POR CATEGORIA
const categoryKeywords = {
  // BEBIDAS
  'ÁGUA MINERAL': 'água mineral, água sem gás, água com gás, água potável, bebida hidratação',
  'REFRIGERANTE': 'refrigerante, coca cola, pepsi, guaraná, fanta, sprite, bebida gaseificada',
  'CERVEJA': 'cerveja, skol, brahma, antarctica, heineken, bebida alcoólica, lata cerveja',
  'SUCO': 'suco, suco natural, suco integral, suco concentrado, bebida fruta, néctar',
  'ENERGÉTICO': 'energético, red bull, monster, burn, tnt, bebida energia',
  'VINHO NACIONAL': 'vinho, vinho tinto, vinho branco, vinho seco, vinho suave, bebida uva',
  'WHISKY': 'whisky, johnnie walker, jack daniels, ballantines, bebida destilada',
  
  // CARNES
  'CARNE BOVINA': 'carne bovina, picanha, alcatra, contrafilé, maminha, carne churrasco',
  'FRANGO': 'frango, frango inteiro, frango cortado, frango congelado, carne ave',
  'LINGUIÇA': 'linguiça, linguiça toscana, linguiça calabresa, linguiça frango, embutido',
  'PRESUNTO': 'presunto, presunto cozido, presunto defumado, fiambre, frios',
  'QUEIJO': 'queijo, mussarela, prato, minas, parmesão, queijo derretido, laticínio',
  
  // MERCEARIA
  'ARROZ': 'arroz, arroz branco, arroz integral, arroz parboilizado, arroz tipo 1',
  'FEIJÃO': 'feijão, feijão carioca, feijão preto, feijão branco, leguminosa',
  'ÓLEO': 'óleo, óleo soja, óleo girassol, óleo milho, azeite, gordura vegetal',
  'AÇÚCAR': 'açúcar, açúcar refinado, açúcar cristal, açúcar mascavo, adoçante',
  'FARINHA DE TRIGO': 'farinha, farinha trigo, farinha rosca, amido, fermento',
  'MACARRÃO': 'macarrão, espaguete, parafuso, penne, lasanha, massa italiana',
  
  // LIMPEZA
  'PRODUTO DE LIMPEZA': 'detergente, sabão, álcool, desinfetante, limpeza, higiene',
  
  // DESCARTÁVEIS
  'DESCARTÁVEL': 'prato descartável, copo descartável, talher descartável, papel filme',
  
  // E MUITAS OUTRAS...
  'BATATA CONGELADA': 'batata, batata frita, batata palha, batata palito, congelado',
  'CAFÉ': 'café, café torrado, café moído, café solúvel, bebida café'
};

// FUNÇÃO AUTOMÁTICA - VOCÊ NÃO PRECISA MEXER EM NADA!
const generateImageSEO = (product) => {
  const productName = product.name.toLowerCase();
  const categoryKey = Object.keys(categoryKeywords).find(key => 
    product.category.includes(key)
  );
  
  const keywords = categoryKey ? categoryKeywords[categoryKey] : 'produto atacado, food service';
  
  return {
    alt: `${product.name} - ${keywords} - PMG Atacadista - Atacado Food Service Itapecerica`,
    title: `${product.name} - PMG Atacadista - Melhor Preço em Atacado`,
  };
};

const categories = [
  'Acessórios', 'Bebidas', 'Conservas/Enlatados', 'Derivados de Ave', 
  'Derivados de Bovino', 'Derivados de Leite', 'Derivados de Suíno', 
  'Derivados de Vegetal', 'Derivados do Mar', 'Doces/Frutas', 
  'Farináceos', 'Higiene', 'Orientais', 'Panificação', 'Salgados', '⏳ Ofertas da Semana 🚨'
];

const products = [
  { id: 1, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 2, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 3, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 4, name: 'PRODUTO EM FALTA', category: 'Salgados', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 5, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 6, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 7, name: 'APLICADOR PARA REQUEIJÃO (CX 1 UN)', category: 'Acessórios', price: 821.75, image: 'https://www.marquesvendaspmg.shop/images/aplicador-para-requeijao-cx-1-un-pmg-atacadista.jpg' },
  { id: 8, name: 'AVENTAL EMBORRACHADO BRANCO TAMANHO ÚNICO', category: 'Acessórios', price: 16.56, image: 'https://www.marquesvendaspmg.shop/images/avental-emborrachado-branco-tamanho-unico-pmg-atacadista.jpg' },
  { id: 9, name: 'AVENTAL EMBORRACHADO PRETO TAMANHO ÚNICO', category: 'Acessórios', price: 16.56, image: 'https://www.marquesvendaspmg.shop/images/avental-emborrachado-preto-tamanho-unico-pmg-atacadista.jpg' },
  { id: 10, name: 'AVENTAL TERGAL BRANCO TAMANHO ÚNICO', category: 'Acessórios', price: 19.43, image: 'https://www.marquesvendaspmg.shop/images/avental-tergal-branco-tamanho-unico-pmg-atacadista.jpg' },
  { id: 11, name: 'BANDEJA PARA ESFIHA "22" 17 X 20 CM (PCT 100 UN)', category: 'Acessórios', price: 28.99, image: 'https://www.marquesvendaspmg.shop/images/bandeja-para-esfiha-22-17-x-20-cm-pct-100-un-pmg-atacadista.jpg' },
  { id: 12, name: 'BANDEJA PARA ESFIHA "23" 20 X 24 CM (PCT 100 UN)', category: 'Acessórios', price: 40.49, image: 'https://www.marquesvendaspmg.shop/images/bandeja-para-esfiha-23-20-x-24-cm-pct-100-un-pmg-atacadista.jpg' },
  { id: 13, name: 'BANDEJA PARA ESFIHA "25" 27 X 32 CM (PCT 100 UN)', category: 'Acessórios', price: 81.14, image: 'https://www.marquesvendaspmg.shop/images/bandeja-para-esfiha-25-27-x-32-cm-pct-100-un-pmg-atacadista.jpg' },
  { id: 14, name: 'BANDEJA PARA ESFIHA "24" 21 X 27 CM (PCT 100 UN)', category: 'Acessórios', price: 54.07, image: 'https://www.marquesvendaspmg.shop/images/bandeja-para-esfiha-24-21-x-27-cm-pct-100-un-pmg-atacadista.jpg' },
  { id: 15, name: 'BAÚ MOCHILA PRATA LAMINADO PARA PIZZA MIL ROTAS (UN)', category: 'Acessórios', price: 184.05, image: 'https://www.marquesvendaspmg.shop/images/bau-mochila-prata-laminado-para-pizza-mil-rotas-un-pmg-atacadista.jpg' },
  { id: 16, name: 'BAÚ MOCHILA VERMELHO COMUM PARA PIZZA MIL ROTAS (UN)', category: 'Acessórios', price: 150.31, image: 'https://www.marquesvendaspmg.shop/images/bau-mochila-vermelho-comum-para-pizza-mil-rotas-un-pmg-atacadista.jpg' },
  { id: 17, name: 'BAÚ MOCHILA VERMELHO LAMINADO COM BOLSÃO PARA PIZZA MIL ROTAS (UN)', category: 'Acessórios', price: 184.05, image: 'https://www.marquesvendaspmg.shop/images/bau-mochila-vermelho-laminado-com-bolsao-para-pizza-mil-rotas-un-pmg-atacadista.jpg' },
  { id: 18, name: 'BONÉ BRIM BRANCO (UN)', category: 'Acessórios', price: 26.73, image: 'https://www.marquesvendaspmg.shop/images/bone-brim-branco-un-pmg-atacadista.jpg' },
  { id: 19, name: 'BRIQUETE (SC 21 KILO)', category: 'Acessórios', price: 53.68, image: 'https://www.marquesvendaspmg.shop/images/briquete-sc-21-kilo-pmg-atacadista.jpg' },
  { id: 20, name: 'CAIXA PARA PIZZA BRANCA 25 CM (PCT 25 UN)', category: 'Acessórios', price: 44.02, image: 'https://www.marquesvendaspmg.shop/images/caixa-para-pizza-branca-25-cm-pct-25-un-pmg-atacadista.jpg' },
  { id: 21, name: 'CAIXA PARA PIZZA BRANCA 35 CM (PCT 25 UN)', category: 'Acessórios', price: 51.84, image: 'https://www.marquesvendaspmg.shop/images/caixa-para-pizza-branca-35-cm-pct-25-un-pmg-atacadista.jpg' },
  { id: 22, name: 'CAIXA PARA PIZZA OITAVADA 25 CM (PCT 25 UN)', category: 'Acessórios', price: 27.97, image: 'https://www.marquesvendaspmg.shop/images/caixa-para-pizza-oitavada-25-cm-pct-25-un-pmg-atacadista.jpg' },
  { id: 23, name: 'CAIXA PARA PIZZA OITAVADA 35 CM (PCT 25 UN)', category: 'Acessórios', price: 41.41, image: 'https://www.marquesvendaspmg.shop/images/caixa-para-pizza-oitavada-35-cm-pct-25-un-pmg-atacadista.jpg' },
  { id: 24, name: 'CALÇA BRIM BRANCA (UN 44 / M)', category: 'Acessórios', price: 90.61, image: 'https://www.marquesvendaspmg.shop/images/calca-brim-branca-un-44-m-pmg-atacadista.jpg' },
  { id: 25, name: 'CALÇA BRIM BRANCA (UN 46 / G)', category: 'Acessórios', price: 90.61, image: 'https://www.marquesvendaspmg.shop/images/calca-brim-branca-un-46-g-pmg-atacadista.jpg' },
  { id: 26, name: 'CANUDO BIODEGRADÁVEL STRAWPLAST 500 UN', category: 'Acessórios', price: 28.73, image: 'https://www.marquesvendaspmg.shop/images/canudo-biodegradavel-strawplast-500-un-pmg-atacadista.jpg' },
  { id: 27, name: 'COMANDA COMUM (PCT 20 x 50)', category: 'Acessórios', price: 39.72, image: 'https://www.marquesvendaspmg.shop/images/comanda-comum-pct-20-x-50-pmg-atacadista.jpg' },
  { id: 28, name: 'COMANDA COPIATIVA (PCT 20 x 50)', category: 'Acessórios', price: 44.33, image: 'https://www.marquesvendaspmg.shop/images/comanda-copiativa-pct-20-x-50-pmg-atacadista.jpg' },
  { id: 29, name: 'COPO DESCARTÁVEL MÉDIO 180 ML PCT 100 UN', category: 'Acessórios', price: 7.64, image: 'https://www.marquesvendaspmg.shop/images/copo-descartavel-medio-180-ml-pct-100-un-pmg-atacadista.jpg' },
  { id: 30, name: 'COPO DESCARTÁVEL PEQUENO 50 ML PCT 100 UN', category: 'Acessórios', price: 4.15, image: 'https://www.marquesvendaspmg.shop/images/copo-descartavel-pequeno-50-ml-pct-100-un-pmg-atacadista.jpg' },
  { id: 31, name: 'ENVELOPE PARA PIZZA 25 CM (FDO 250 UN)', category: 'Acessórios', price: 72.31, image: 'https://www.marquesvendaspmg.shop/images/envelope-para-pizza-25-cm-fdo-250-un-pmg-atacadista.jpg' },
  { id: 32, name: 'ENVELOPE PARA PIZZA 35 CM (FDO 250 UN)', category: 'Acessórios', price: 85.67, image: 'https://www.marquesvendaspmg.shop/images/envelope-para-pizza-35-cm-fdo-250-un-pmg-atacadista.jpg' },
  { id: 33, name: 'ETIQUETA LACRE (PCT 2 x 500)', category: 'Acessórios', price: 47.77, image: 'https://www.marquesvendaspmg.shop/images/etiqueta-lacre-pct-2-x-500-pmg-atacadista.jpg' },
  { id: 34, name: 'FÓSFORO QUELUZ (PCT 10 UN)', category: 'Acessórios', price: 4.11, image: 'https://www.marquesvendaspmg.shop/images/fosforo-queluz-pct-10-un-pmg-atacadista.jpg' },
  { id: 35, name: 'GUARDANAPO DE PAPEL TV (PCT 2000 UN)', category: 'Acessórios', price: 22.64, image: 'https://www.marquesvendaspmg.shop/images/guardanapo-de-papel-tv-pct-2000-un-pmg-atacadista.jpg' },
  { id: 36, name: 'PÁ DE ESFIHA (UN 90 X 22 CM)', category: 'Acessórios', price: 172.09, image: 'https://www.marquesvendaspmg.shop/images/pa-de-esfiha-un-90-x-22-cm-pmg-atacadista.jpg' },
  { id: 37, name: 'PÁ DE FERRO (UN 35 CM)', category: 'Acessórios', price: 117.03, image: 'https://www.marquesvendaspmg.shop/images/pa-de-ferro-un-35-cm-pmg-atacadista.jpg' },
  { id: 38, name: 'PÁ DE FERRO (UN 38 CM)', category: 'Acessórios', price: 142.11, image: 'https://www.marquesvendaspmg.shop/images/pa-de-ferro-un-38-cm-pmg-atacadista.jpg' },
  { id: 39, name: 'PÁ DE MADEIRA (UN 35 CM)', category: 'Acessórios', price: 204.67, image: 'https://www.marquesvendaspmg.shop/images/pa-de-madeira-un-35-cm-pmg-atacadista.jpg' },
  { id: 40, name: 'PÁ DE MADEIRA (UN 40 CM)', category: 'Acessórios', price: 204.67, image: 'https://www.marquesvendaspmg.shop/images/pa-de-madeira-un-40-cm-pmg-atacadista.jpg' },
  { id: 41, name: 'PALITO SACHÊ BOM SABOR (CX 2000 UN)', category: 'Acessórios', price: 32.29, image: 'https://www.marquesvendaspmg.shop/images/palito-sache-bom-sabor-cx-2000-un-pmg-atacadista.jpg' },
  { id: 42, name: 'SUPORTE TRIPÉ INJEQUALY (PCT 500 UN)', category: 'Acessórios', price: 28.43, image: 'https://www.marquesvendaspmg.shop/images/suporte-tripe-injequaly-pct-500-un-pmg-atacadista.jpg' },
  { id: 43, name: 'TOUCA DE CABELO TNT (PCT 100 UN)', category: 'Acessórios', price: 19.82, image: 'https://www.marquesvendaspmg.shop/images/touca-de-cabelo-tnt-pct-100-un-pmg-atacadista.jpg' },
  { id: 44, name: 'VARREDOR PARA FORNO (UN 40 CM)', category: 'Acessórios', price: 100.39, image: 'https://www.marquesvendaspmg.shop/images/varredor-para-forno-un-40-cm-pmg-atacadista.jpg' },
  { id: 45, name: 'VASSOURINHA CABO PLÁSTICO (UN)', category: 'Acessórios', price: 12.26, image: 'https://www.marquesvendaspmg.shop/images/vassourinha-cabo-plastico-un-pmg-atacadista.jpg' },
  { id: 46, name: 'ÁGUA DE COCO GRANDE COCO QUADRADO 1 L (CX 12 UN)', category: 'Bebidas', price: 95.09, image: 'https://www.marquesvendaspmg.shop/images/agua-de-coco-grande-coco-quadrado-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 47, name: 'ÁGUA DE COCO GRANDE MAIS COCO 1 L (CX 12 UN)', category: 'Bebidas', price: 48.97, image: 'https://www.marquesvendaspmg.shop/images/agua-de-coco-grande-mais-coco-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 48, name: 'ÁGUA DE COCO GRANDE SOCOCO 1 L (CX 12 UN)', category: 'Bebidas', price: 153.25, image: 'https://www.marquesvendaspmg.shop/images/agua-de-coco-grande-sococo-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 49, name: 'ÁGUA DE COCO MÉDIA SOCOCO 330 ML (CX 12 UN)', category: 'Bebidas', price: 90.96, image: 'https://www.marquesvendaspmg.shop/images/agua-de-coco-media-sococo-330-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 50, name: 'ÁGUA DE COCO PEQUENA COCO QUADRADO 200 ML (CX 27 UN)', category: 'Bebidas', price: 53.49, image: 'https://www.marquesvendaspmg.shop/images/agua-de-coco-pequena-coco-quadrado-200-ml-cx-27-un-pmg-atacadista.jpg' },
  { id: 51, name: 'ÁGUA DE COCO PEQUENA SOCOCO 200 ML (CX 24 UN)', category: 'Bebidas', price: 121.33, image: 'https://www.marquesvendaspmg.shop/images/agua-de-coco-pequena-sococo-200-ml-cx-24-un-pmg-atacadista.jpg' },
  { id: 52, name: 'ÁGUA MINERAL BUONAVITA COM GÁS 510 ML (PCT 12 UN)', category: 'Bebidas', price: 20.12, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-buonavita-com-gas-510-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 53, name: 'ÁGUA MINERAL BUONAVITA SEM GÁS 510 ML (PCT 12 UN)', category: 'Bebidas', price: 20.12, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-buonavita-sem-gas-510-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 54, name: 'ÁGUA MINERAL CRYSTAL COM GÁS 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 21.82, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-crystal-com-gas-15-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 55, name: 'ÁGUA MINERAL CRYSTAL COM GÁS 500 ML (PCT 12 UN)', category: 'Bebidas', price: 23.78, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-crystal-com-gas-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 56, name: 'ÁGUA MINERAL CRYSTAL SEM GÁS 500 ML (PCT 12 UN)', category: 'Bebidas', price: 23.99, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-crystal-sem-gas-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 57, name: 'ÁGUA MINERAL GRANDE BUONAVITA SEM GÁS 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 13.79, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-grande-buonavita-sem-gas-15-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 58, name: 'ÁGUA MINERAL GRANDE CRYSTAL SEM GÁS 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 20.58, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-grande-crystal-sem-gas-15-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 59, name: 'ÁGUA MINERAL SÃO LOURENÇO COM GÁS 300 ML (PCT 12 UN)', category: 'Bebidas', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-sao-lourenco-com-gas-300-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 60, name: 'ÁGUA MINERAL SÃO LOURENÇO SEM GÁS 300 ML (PCT 12 UN)', category: 'Bebidas', price: 24.47, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-sao-lourenco-sem-gas-300-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 61, name: 'ÁGUA TÔNICA ANTARCTICA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 42.41, image: 'https://www.marquesvendaspmg.shop/images/agua-tonica-antarctica-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 62, name: 'ÁGUA TÔNICA ANTARCTICA ZERO AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 42.41, image: 'https://www.marquesvendaspmg.shop/images/agua-tonica-antarctica-zero-acucares-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 63, name: 'ÁGUA TÔNICA SCHWEPPES LATA 350 ML (PCT 6 LT)', category: 'Bebidas', price: 19.73, image: 'https://www.marquesvendaspmg.shop/images/agua-tonica-schweppes-lata-350-ml-pct-6-lt-pmg-atacadista.jpg' },
  { id: 64, name: 'AGUARDENTE DE CANA KARIRI 960 ML', category: 'Bebidas', price: 16.2, image: 'https://www.marquesvendaspmg.shop/images/aguardente-de-cana-kariri-960-ml-pmg-atacadista.jpg' },
  { id: 65, name: 'AGUARDENTE DE CANA PITÚ 965 ML', category: 'Bebidas', price: 11.41, image: 'https://www.marquesvendaspmg.shop/images/aguardente-de-cana-pitu-965-ml-pmg-atacadista.jpg' },
  { id: 66, name: 'AGUARDENTE DE CANA PITÚ LATA 350 ML', category: 'Bebidas', price: 57.55, image: 'https://www.marquesvendaspmg.shop/images/aguardente-de-cana-pitu-lata-350-ml-pmg-atacadista.jpg' },
  { id: 67, name: 'AGUARDENTE DE CANA YPIÓCA PRATA SEM PALHA 965 ML', category: 'Bebidas', price: 19.63, image: 'https://www.marquesvendaspmg.shop/images/aguardente-de-cana-ypioca-prata-sem-palha-965-ml-pmg-atacadista.jpg' },
  { id: 68, name: 'APERITIVO APEROL 750 ML', category: 'Bebidas', price: 44.17, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-aperol-750-ml-pmg-atacadista.jpg' },
  { id: 69, name: 'APERITIVO BRASILBERG 920 ML', category: 'Bebidas', price: 57.67, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-brasilberg-920-ml-pmg-atacadista.jpg' },
  { id: 70, name: 'APERITIVO CAMPARI 998 ML', category: 'Bebidas', price: 50.8, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-campari-998-ml-pmg-atacadista.jpg' },
  { id: 71, name: 'APERITIVO CATUABA SELVAGEM TRADICIONAL 900 ML', category: 'Bebidas', price: 15.1, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-catuaba-selvagem-tradicional-900-ml-pmg-atacadista.jpg' },
  { id: 72, name: 'APERITIVO CINZANO VERMOUTH ROSSO 1 L', category: 'Bebidas', price: 36.69, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-cinzano-vermouth-rosso-1-l-pmg-atacadista.jpg' },
  { id: 73, name: 'APERITIVO CONTINI 900 ML', category: 'Bebidas', price: 29.45, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-contini-900-ml-pmg-atacadista.jpg' },
  { id: 74, name: 'APERITIVO CYNAR 900 ML', category: 'Bebidas', price: 23.93, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-cynar-900-ml-pmg-atacadista.jpg' },
  { id: 75, name: 'APERITIVO FERNET FENETTI DUBAR 900 ML', category: 'Bebidas', price: 22.8, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-fernet-fenetti-dubar-900-ml-pmg-atacadista.jpg' },
  { id: 76, name: 'APERITIVO JURUPINGA DINALLE 975 ML', category: 'Bebidas', price: 29.45, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-jurupinga-dinalle-975-ml-pmg-atacadista.jpg' },
  { id: 77, name: 'APERITIVO MALIBU 750 ML', category: 'Bebidas', price: 49.08, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-malibu-750-ml-pmg-atacadista.jpg' },
  { id: 78, name: 'APERITIVO MARTINI BIANCO SUAVE 750 ML', category: 'Bebidas', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-martini-bianco-suave-750-ml-pmg-atacadista.jpg' },
  { id: 79, name: 'APERITIVO PARATUDO RAÍZES AMARGAS 900 ML', category: 'Bebidas', price: 13.99, image: 'https://www.marquesvendaspmg.shop/images/aperitivo-paratudo-raizes-amargas-900-ml-pmg-atacadista.jpg' },
  { id: 80, name: 'CACHAÇA 51 965 ML (CX 12 UN)', category: 'Bebidas', price: 159.51, image: 'https://www.marquesvendaspmg.shop/images/cachaca-51-965-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 81, name: 'CACHAÇA BOAZINHA 600 ML', category: 'Bebidas', price: 39.26, image: 'https://www.marquesvendaspmg.shop/images/cachaca-boazinha-600-ml-pmg-atacadista.jpg' },
  { id: 82, name: 'CACHAÇA BUSCA VIDA 670 ML', category: 'Bebidas', price: 64.05, image: 'https://www.marquesvendaspmg.shop/images/cachaca-busca-vida-670-ml-pmg-atacadista.jpg' },
  { id: 83, name: 'CACHAÇA CHICO MINEIRO OURO 600 ML', category: 'Bebidas', price: 46.14, image: 'https://www.marquesvendaspmg.shop/images/cachaca-chico-mineiro-ouro-600-ml-pmg-atacadista.jpg' },
  { id: 84, name: 'CACHAÇA COROTE TRADICIONAL 500 ML (CX 12 UN)', category: 'Bebidas', price: 53.99, image: 'https://www.marquesvendaspmg.shop/images/cachaca-corote-tradicional-500-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 85, name: 'CACHAÇA ESPÍRITO DE MINAS 700 ML', category: 'Bebidas', price: 90.8, image: 'https://www.marquesvendaspmg.shop/images/cachaca-espirito-de-minas-700-ml-pmg-atacadista.jpg' },
  { id: 86, name: 'CACHAÇA SAGATIBA PURA 700 ML', category: 'Bebidas', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/cachaca-sagatiba-pura-700-ml-pmg-atacadista.jpg' },
  { id: 87, name: 'CACHAÇA SÃO FRANCISCO 970 ML', category: 'Bebidas', price: 30.68, image: 'https://www.marquesvendaspmg.shop/images/cachaca-sao-francisco-970-ml-pmg-atacadista.jpg' },
  { id: 88, name: 'CACHAÇA SELETA OURO 1 L', category: 'Bebidas', price: 51.22, image: 'https://www.marquesvendaspmg.shop/images/cachaca-seleta-ouro-1-l-pmg-atacadista.jpg' },
  { id: 89, name: 'CACHAÇA TRADICIONAL SALINAS 600 ML', category: 'Bebidas', price: 42.09, image: 'https://www.marquesvendaspmg.shop/images/cachaca-tradicional-salinas-600-ml-pmg-atacadista.jpg' },
  { id: 90, name: 'CACHAÇA TRÊS CORONÉIS 700 ML', category: 'Bebidas', price: 36.69, image: 'https://www.marquesvendaspmg.shop/images/cachaca-tres-coroneis-700-ml-pmg-atacadista.jpg' },
  { id: 91, name: 'CACHAÇA VELHO BARREIRO 910 ML (CX 12 UN)', category: 'Bebidas', price: 177.13, image: 'https://www.marquesvendaspmg.shop/images/cachaca-velho-barreiro-910-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 92, name: 'CACHAÇA YPIÓCA OURO COM PALHA 965 ML', category: 'Bebidas', price: 45.77, image: 'https://www.marquesvendaspmg.shop/images/cachaca-ypioca-ouro-com-palha-965-ml-pmg-atacadista.jpg' },
  { id: 93, name: 'CACHAÇA YPIÓCA OURO SEM PALHA 965 ML', category: 'Bebidas', price: 19.63, image: 'https://www.marquesvendaspmg.shop/images/cachaca-ypioca-ouro-sem-palha-965-ml-pmg-atacadista.jpg' },
  { id: 94, name: 'CERVEJA AMSTEL PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 48.84, image: 'https://www.marquesvendaspmg.shop/images/cerveja-amstel-puro-malte-lata-350-ml-cx-12-lt-pmg-atacadista.jpg' },
  { id: 95, name: 'CERVEJA BADEN BADEN PILSEN CRISTAL 600 ML', category: 'Bebidas', price: 16.04, image: 'https://www.marquesvendaspmg.shop/images/cerveja-baden-baden-pilsen-cristal-600-ml-pmg-atacadista.jpg' },
  { id: 96, name: 'CERVEJA BRAHMA CHOPP PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 45.79, image: 'https://www.marquesvendaspmg.shop/images/cerveja-brahma-chopp-pilsen-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 97, name: 'CERVEJA BRAHMA DUPLO MALTE LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 49.13, image: 'https://www.marquesvendaspmg.shop/images/cerveja-brahma-duplo-malte-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 98, name: 'CERVEJA BRAHMA MALZBIER LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 61.95, image: 'https://www.marquesvendaspmg.shop/images/cerveja-brahma-malzbier-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 99, name: 'CERVEJA BUDWEISER LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 51.33, image: 'https://www.marquesvendaspmg.shop/images/cerveja-budweiser-lata-350-ml-cx-12-lt-pmg-atacadista.jpg' },
  { id: 100, name: 'CERVEJA BUDWEISER LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 145.53, image: 'https://www.marquesvendaspmg.shop/images/cerveja-budweiser-long-neck-330-ml-pct-24-un-pmg-atacadista.jpg' },
  { id: 101, name: 'CERVEJA CORONA LONG NECK 330 ML (CX 24 UN)', category: 'Bebidas', price: 182.87, image: 'https://www.marquesvendaspmg.shop/images/cerveja-corona-long-neck-330-ml-cx-24-un-pmg-atacadista.jpg' },
  { id: 102, name: 'CERVEJA EISENBAHN PILSEN PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 52.48, image: 'https://www.marquesvendaspmg.shop/images/cerveja-eisenbahn-pilsen-puro-malte-lata-350-ml-cx-12-lt-pmg-atacadista.jpg' },
  { id: 103, name: 'CERVEJA HEINEKEN PURE MALT LAGER GARRAFA 600 ML (CX 12 UN)', category: 'Bebidas', price: 155.63, image: 'https://www.marquesvendaspmg.shop/images/cerveja-heineken-pure-malt-lager-garrafa-600-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 104, name: 'CERVEJA HEINEKEN PURE MALT LAGER LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 71.6, image: 'https://www.marquesvendaspmg.shop/images/cerveja-heineken-pure-malt-lager-lata-350-ml-cx-12-lt-pmg-atacadista.jpg' },
  { id: 105, name: 'CERVEJA HEINEKEN PURE MALT LAGER LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 168.76, image: 'https://www.marquesvendaspmg.shop/images/cerveja-heineken-pure-malt-lager-long-neck-330-ml-pct-24-un-pmg-atacadista.jpg' },
  { id: 106, name: 'CERVEJA HEINEKEN ZERO ÁLCOOL 0.0 PURE MALT LAGER LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 69.24, image: 'https://www.marquesvendaspmg.shop/images/cerveja-heineken-zero-alcool-00-pure-malt-lager-lata-350-ml-cx-12-lt-pmg-atacadista.jpg' },
  { id: 107, name: 'CERVEJA HEINEKEN ZERO ÁLCOOL 0.0 PURE MALT LAGER LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 168.76, image: 'https://www.marquesvendaspmg.shop/images/cerveja-heineken-zero-alcool-00-pure-malt-lager-long-neck-330-ml-pct-24-un-pmg-atacadista.jpg' },
  { id: 108, name: 'CERVEJA IMPÉRIO PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 38.66, image: 'https://www.marquesvendaspmg.shop/images/cerveja-imperio-puro-malte-lata-350-ml-cx-12-lt-pmg-atacadista.jpg' },
  { id: 109, name: 'CERVEJA ITAIPAVA MALZBIER LONG NECK 330 ML (PCT 12 UN)', category: 'Bebidas', price: 59.25, image: 'https://www.marquesvendaspmg.shop/images/cerveja-itaipava-malzbier-long-neck-330-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 110, name: 'CERVEJA ITAIPAVA PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 36.63, image: 'https://www.marquesvendaspmg.shop/images/cerveja-itaipava-pilsen-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 111, name: 'CERVEJA MÉDIA SKOL PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 45.11, image: 'https://www.marquesvendaspmg.shop/images/cerveja-media-skol-pilsen-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 112, name: 'CERVEJA ORIGINAL PILSEN GARRAFA 600 ML (CX 12 UN)', category: 'Bebidas', price: 130.55, image: 'https://www.marquesvendaspmg.shop/images/cerveja-original-pilsen-garrafa-600-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 113, name: 'CERVEJA ORIGINAL PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 56.37, image: 'https://www.marquesvendaspmg.shop/images/cerveja-original-pilsen-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 114, name: 'CERVEJA PEQUENA BRAHMA DUPLO MALTE LATA 269 ML (CX 15 LT)', category: 'Bebidas', price: 42.77, image: 'https://www.marquesvendaspmg.shop/images/cerveja-pequena-brahma-duplo-malte-lata-269-ml-cx-15-lt-pmg-atacadista.jpg' },
  { id: 115, name: 'CERVEJA PEQUENA BUDWEISER LATA 269 ML (CX 8 LT)', category: 'Bebidas', price: 27.55, image: 'https://www.marquesvendaspmg.shop/images/cerveja-pequena-budweiser-lata-269-ml-cx-8-lt-pmg-atacadista.jpg' },
  { id: 116, name: 'CERVEJA PEQUENA HEINEKEN PURE MALT LAGER LATA 269 ML (CX 8 LT)', category: 'Bebidas', price: 38.6, image: 'https://www.marquesvendaspmg.shop/images/cerveja-pequena-heineken-pure-malt-lager-lata-269-ml-cx-8-lt-pmg-atacadista.jpg' },
  { id: 117, name: 'CERVEJA PEQUENA ITAIPAVA LATA 269 ML (CX 12 LT)', category: 'Bebidas', price: 26.39, image: 'https://www.marquesvendaspmg.shop/images/cerveja-pequena-itaipava-lata-269-ml-cx-12-lt-pmg-atacadista.jpg' },
  { id: 118, name: 'CERVEJA PEQUENA ORIGINAL LATA 269 ML (CX 8 LT)', category: 'Bebidas', price: 29.39, image: 'https://www.marquesvendaspmg.shop/images/cerveja-pequena-original-lata-269-ml-cx-8-lt-pmg-atacadista.jpg' },
  { id: 119, name: 'CERVEJA PEQUENA SKOL PILSEN LATA 269 ML (PCT 15 LT)', category: 'Bebidas', price: 43.51, image: 'https://www.marquesvendaspmg.shop/images/cerveja-pequena-skol-pilsen-lata-269-ml-pct-15-lt-pmg-atacadista.jpg' },
  { id: 120, name: 'CERVEJA PETRA PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 38.2, image: 'https://www.marquesvendaspmg.shop/images/cerveja-petra-puro-malte-lata-350-ml-cx-12-lt-pmg-atacadista.jpg' },
  { id: 121, name: 'CERVEJA SPATEN MUNICH GARRAFA 600 ML (CX 12 UN)', category: 'Bebidas', price: 99.58, image: 'https://www.marquesvendaspmg.shop/images/cerveja-spaten-munich-garrafa-600-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 122, name: 'CERVEJA SPATEN MUNICH LONG NECK 330 ML (CX 24 UN)', category: 'Bebidas', price: 148.31, image: 'https://www.marquesvendaspmg.shop/images/cerveja-spaten-munich-long-neck-330-ml-cx-24-un-pmg-atacadista.jpg' },
  { id: 123, name: 'CERVEJA STELLA ARTOIS LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 164.2, image: 'https://www.marquesvendaspmg.shop/images/cerveja-stella-artois-long-neck-330-ml-pct-24-un-pmg-atacadista.jpg' },
  { id: 124, name: 'CHÁ ICE TEA LEÃO PÊSSEGO 450 ML (PCT 6 UN)', category: 'Bebidas', price: 26.71, image: 'https://www.marquesvendaspmg.shop/images/cha-ice-tea-leao-pessego-450-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 125, name: 'CHOPP DE VINHO DRAFT 600 ML (CX 6 UN)', category: 'Bebidas', price: 59.63, image: 'https://www.marquesvendaspmg.shop/images/chopp-de-vinho-draft-600-ml-cx-6-un-pmg-atacadista.jpg' },
  { id: 126, name: 'COCA COLA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 40.27, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 127, name: 'COCA COLA MÉDIA PET 1 L (PCT 6 UN)', category: 'Bebidas', price: 44.6, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-media-pet-1-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 128, name: 'COCA COLA MIÚDA PET 200 ML (PCT 12 UN)', category: 'Bebidas', price: 27.84, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-miuda-pet-200-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 129, name: 'COCA COLA MIÚDA ZERO AÇÚCARES PET 200 ML (PCT 12 UN)', category: 'Bebidas', price: 25.96, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-miuda-zero-acucares-pet-200-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 130, name: 'COCA COLA PEQUENA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 64.48, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-pequena-pet-600-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 131, name: 'COCA COLA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 61.48, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 132, name: 'COCA COLA SEM AÇÚCAR LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 40.44, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-sem-acucar-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 133, name: 'COCA COLA SEM AÇÚCAR PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 66.59, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-sem-acucar-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 134, name: 'COCA COLA SEM AÇÚCAR PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 66.64, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-sem-acucar-pet-600-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 135, name: 'CONHAQUE DE ALCATRÃO SÃO JOÃO DA BARRA 900 ML', category: 'Bebidas', price: 20.86, image: 'https://www.marquesvendaspmg.shop/images/conhaque-de-alcatrao-sao-joao-da-barra-900-ml-pmg-atacadista.jpg' },
  { id: 136, name: 'CONHAQUE DOMECQ 1 L', category: 'Bebidas', price: 34.11, image: 'https://www.marquesvendaspmg.shop/images/conhaque-domecq-1-l-pmg-atacadista.jpg' },
  { id: 137, name: 'CONHAQUE DREHER 900 ML', category: 'Bebidas', price: 19.02, image: 'https://www.marquesvendaspmg.shop/images/conhaque-dreher-900-ml-pmg-atacadista.jpg' },
  { id: 138, name: 'CONHAQUE FUNDADOR 750 ML', category: 'Bebidas', price: 139.88, image: 'https://www.marquesvendaspmg.shop/images/conhaque-fundador-750-ml-pmg-atacadista.jpg' },
  { id: 139, name: 'CONHAQUE PRESIDENTE 900 ML', category: 'Bebidas', price: 13.74, image: 'https://www.marquesvendaspmg.shop/images/conhaque-presidente-900-ml-pmg-atacadista.jpg' },
  { id: 140, name: 'COQUETEL CANELINHA DA ROCHA 900 ML', category: 'Bebidas', price: 13.37, image: 'https://www.marquesvendaspmg.shop/images/coquetel-canelinha-da-rocha-900-ml-pmg-atacadista.jpg' },
  { id: 141, name: 'COQUETEL DE VINHO NACIONAL TINTO SUAVE CANTINHO DO VALE 880 ML (CX 12 UN)', category: 'Bebidas', price: 58.9, image: 'https://www.marquesvendaspmg.shop/images/coquetel-de-vinho-nacional-tinto-suave-cantinho-do-vale-880-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 142, name: 'COQUETEL DE VODKA LIMÃO COROTE 500 ML (CX 12 UN)', category: 'Bebidas', price: 51.53, image: 'https://www.marquesvendaspmg.shop/images/coquetel-de-vodka-limao-corote-500-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 143, name: 'COQUETEL DE VODKA MORANGO COROTE 500 ML (CX 12 UN)', category: 'Bebidas', price: 40.48, image: 'https://www.marquesvendaspmg.shop/images/coquetel-de-vodka-morango-corote-500-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 144, name: 'DOLLY GUARANÁ PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 32.77, image: 'https://www.marquesvendaspmg.shop/images/dolly-guarana-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 145, name: 'DOLLY LARANJA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 33.03, image: 'https://www.marquesvendaspmg.shop/images/dolly-laranja-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 146, name: 'DOLLY LIMÃO PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 33.03, image: 'https://www.marquesvendaspmg.shop/images/dolly-limao-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 147, name: 'DOLLY UVA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 33.03, image: 'https://www.marquesvendaspmg.shop/images/dolly-uva-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 148, name: 'ENERGÉTICO LONG ONE 2 L (PCT 6 UN)', category: 'Bebidas', price: 32.39, image: 'https://www.marquesvendaspmg.shop/images/energetico-long-one-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 149, name: 'ENERGÉTICO MONSTER ENERGY 473 ML (PCT 6 UN)', category: 'Bebidas', price: 55.35, image: 'https://www.marquesvendaspmg.shop/images/energetico-monster-energy-473-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 150, name: 'ENERGÉTICO MONSTER ENERGY ABSOLUTELY ZERO 473 ML (PCT 6 UN)', category: 'Bebidas', price: 55.35, image: 'https://www.marquesvendaspmg.shop/images/energetico-monster-energy-absolutely-zero-473-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 151, name: 'ENERGÉTICO MONSTER ENERGY MANGO LOCO 473 ML (PCT 6 UN)', category: 'Bebidas', price: 57.05, image: 'https://www.marquesvendaspmg.shop/images/energetico-monster-energy-mango-loco-473-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 152, name: 'ENERGÉTICO MONSTER ENERGY PACIFIC PUNCH 473 ML (PCT 6 UN)', category: 'Bebidas', price: 55.35, image: 'https://www.marquesvendaspmg.shop/images/energetico-monster-energy-pacific-punch-473-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 153, name: 'ENERGÉTICO MONSTER SEM AÇÚCAR ENERGY ULTRA 473 ML (PCT 6 UN)', category: 'Bebidas', price: 57.05, image: 'https://www.marquesvendaspmg.shop/images/energetico-monster-sem-acucar-energy-ultra-473-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 154, name: 'ENERGÉTICO MONSTER SEM AÇÚCAR ENERGY ULTRA PARADISE 473 ML (PCT 6 UN)', category: 'Bebidas', price: 55.35, image: 'https://www.marquesvendaspmg.shop/images/energetico-monster-sem-acucar-energy-ultra-paradise-473-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 155, name: 'ENERGÉTICO MONSTER SEM AÇÚCAR ENERGY ULTRA VIOLET 473 ML (PCT 6 UN)', category: 'Bebidas', price: 55.35, image: 'https://www.marquesvendaspmg.shop/images/energetico-monster-sem-acucar-energy-ultra-violet-473-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 156, name: 'ENERGÉTICO RED BULL 250 ML (CX 24 LT)', category: 'Bebidas', price: 197.29, image: 'https://www.marquesvendaspmg.shop/images/energetico-red-bull-250-ml-cx-24-lt-pmg-atacadista.jpg' },
  { id: 157, name: 'ENERGÉTICO RED BULL MELANCIA 250 ML (CX 24 LT)', category: 'Bebidas', price: 197.29, image: 'https://www.marquesvendaspmg.shop/images/energetico-red-bull-melancia-250-ml-cx-24-lt-pmg-atacadista.jpg' },
  { id: 158, name: 'ENERGÉTICO RED BULL SUGAR FREE 250 ML (CX 24 LT)', category: 'Bebidas', price: 197.29, image: 'https://www.marquesvendaspmg.shop/images/energetico-red-bull-sugar-free-250-ml-cx-24-lt-pmg-atacadista.jpg' },
  { id: 159, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 160, name: 'ESPUMANTE BRANCO MOSCATEL SALTON 750 ML', category: 'Bebidas', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/espumante-branco-moscatel-salton-750-ml-pmg-atacadista.jpg' },
  { id: 161, name: 'ESPUMANTE BRANCO NATURAL BRUT SALTON 750 ML', category: 'Bebidas', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/espumante-branco-natural-brut-salton-750-ml-pmg-atacadista.jpg' },
  { id: 162, name: 'ESPUMANTE CHANDON BABY BRUT ROSÉ 187 ML', category: 'Bebidas', price: 34.72, image: 'https://www.marquesvendaspmg.shop/images/espumante-chandon-baby-brut-rose-187-ml-pmg-atacadista.jpg' },
  { id: 163, name: 'ESPUMANTE CHANDON BRUT ROSÉ 750 ML', category: 'Bebidas', price: 88.22, image: 'https://www.marquesvendaspmg.shop/images/espumante-chandon-brut-rose-750-ml-pmg-atacadista.jpg' },
  { id: 164, name: 'ESPUMANTE CHANDON PASSION ON ICE ROSÉ MEIO DOCE 750 ML', category: 'Bebidas', price: 88.22, image: 'https://www.marquesvendaspmg.shop/images/espumante-chandon-passion-on-ice-rose-meio-doce-750-ml-pmg-atacadista.jpg' },
  { id: 165, name: 'ESPUMANTE CHANDON RÉSERVE BRUT 750 ML', category: 'Bebidas', price: 88.22, image: 'https://www.marquesvendaspmg.shop/images/espumante-chandon-reserve-brut-750-ml-pmg-atacadista.jpg' },
  { id: 166, name: 'FANTA LARANJA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 45.16, image: 'https://www.marquesvendaspmg.shop/images/fanta-laranja-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 167, name: 'FANTA LARANJA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 54.69, image: 'https://www.marquesvendaspmg.shop/images/fanta-laranja-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 168, name: 'FANTA LARANJA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 62.91, image: 'https://www.marquesvendaspmg.shop/images/fanta-laranja-pet-600-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 169, name: 'FANTA UVA LATA 350 ML (PCT 6 UN)', category: 'Bebidas', price: 22.31, image: 'https://www.marquesvendaspmg.shop/images/fanta-uva-lata-350-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 170, name: 'FANTA UVA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 53.35, image: 'https://www.marquesvendaspmg.shop/images/fanta-uva-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 171, name: 'GIN BEEFEATER 750 ML', category: 'Bebidas', price: 89.45, image: 'https://www.marquesvendaspmg.shop/images/gin-beefeater-750-ml-pmg-atacadista.jpg' },
  { id: 172, name: 'GIN BOMBAY SAPPHIRE 750 ML', category: 'Bebidas', price: 91.96, image: 'https://www.marquesvendaspmg.shop/images/gin-bombay-sapphire-750-ml-pmg-atacadista.jpg' },
  { id: 173, name: 'GIN GORDON´S 750 ML', category: 'Bebidas', price: 63.19, image: 'https://www.marquesvendaspmg.shop/images/gin-gordons-750-ml-pmg-atacadista.jpg' },
  { id: 174, name: 'GIN LONDON DRY DUBAR 960 ML', category: 'Bebidas', price: 20.86, image: 'https://www.marquesvendaspmg.shop/images/gin-london-dry-dubar-960-ml-pmg-atacadista.jpg' },
  { id: 175, name: 'GIN ROCK´S 1 L', category: 'Bebidas', price: 29.45, image: 'https://www.marquesvendaspmg.shop/images/gin-rocks-1-l-pmg-atacadista.jpg' },
  { id: 176, name: 'GIN ROCK´S STRAWBERRY 1 L', category: 'Bebidas', price: 29.45, image: 'https://www.marquesvendaspmg.shop/images/gin-rocks-strawberry-1-l-pmg-atacadista.jpg' },
  { id: 177, name: 'GIN SEAGERS 1 L', category: 'Bebidas', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/gin-seagers-1-l-pmg-atacadista.jpg' },
  { id: 178, name: 'GIN TANQUERAY 750 ML', category: 'Bebidas', price: 103.07, image: 'https://www.marquesvendaspmg.shop/images/gin-tanqueray-750-ml-pmg-atacadista.jpg' },
  { id: 179, name: 'GROSELHA CACHOEIRA 920 ML (CX 6 UN)', category: 'Bebidas', price: 77.91, image: 'https://www.marquesvendaspmg.shop/images/groselha-cachoeira-920-ml-cx-6-un-pmg-atacadista.jpg' },
  { id: 180, name: 'GUARANÁ ANTARCTICA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 42.77, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 181, name: 'GUARANÁ ANTARCTICA MIÚDA PET 200 ML (PCT 12 UN)', category: 'Bebidas', price: 23.27, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-miuda-pet-200-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 182, name: 'GUARANÁ ANTARCTICA PEQUENO PET 1 L (PCT 6 UN)', category: 'Bebidas', price: 22.66, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-pequeno-pet-1-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 183, name: 'GUARANÁ ANTARCTICA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 59.12, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 184, name: 'GUARANÁ ANTARCTICA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 59.16, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-pet-600-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 185, name: 'GUARANÁ ANTARCTICA SEM AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 58.43, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-sem-acucares-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 186, name: 'GUARANÁ ANTARCTICA SEM AÇÚCARES PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 59.12, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-sem-acucares-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 187, name: 'H2O LIMÃO SEM AÇÚCARES PET 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 55.77, image: 'https://www.marquesvendaspmg.shop/images/h2o-limao-sem-acucares-pet-15-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 188, name: 'H2O LIMÃO SEM AÇÚCARES PET 500 ML (PCT 12 UN)', category: 'Bebidas', price: 56.59, image: 'https://www.marquesvendaspmg.shop/images/h2o-limao-sem-acucares-pet-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 189, name: 'H2O LIMONETO SEM AÇÚCARES PET 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 56.83, image: 'https://www.marquesvendaspmg.shop/images/h2o-limoneto-sem-acucares-pet-15-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 190, name: 'H2O LIMONETO SEM AÇÚCARES PET 500 ML (PCT 12 UN)', category: 'Bebidas', price: 56.59, image: 'https://www.marquesvendaspmg.shop/images/h2o-limoneto-sem-acucares-pet-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 191, name: 'ISOTÔNICO GATORADE LARANJA 500 ML (PCT 6 UN)', category: 'Bebidas', price: 38.91, image: 'https://www.marquesvendaspmg.shop/images/isotonico-gatorade-laranja-500-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 192, name: 'ISOTÔNICO GATORADE LIMÃO 500 ML (PCT 6 UN)', category: 'Bebidas', price: 38.91, image: 'https://www.marquesvendaspmg.shop/images/isotonico-gatorade-limao-500-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 193, name: 'ISOTÔNICO GATORADE MORANGO COM MARACUJÁ 500 ML (PCT 6 UN)', category: 'Bebidas', price: 38.91, image: 'https://www.marquesvendaspmg.shop/images/isotonico-gatorade-morango-com-maracuja-500-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 194, name: 'ISOTÔNICO GATORADE TANGERINA 500 ML (PCT 6 UN)', category: 'Bebidas', price: 38.91, image: 'https://www.marquesvendaspmg.shop/images/isotonico-gatorade-tangerina-500-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 195, name: 'ISOTÔNICO GATORADE UVA 500 ML (PCT 6 UN)', category: 'Bebidas', price: 38.91, image: 'https://www.marquesvendaspmg.shop/images/isotonico-gatorade-uva-500-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 196, name: 'ITUBAÍNA TUTTI FRUTTI RETRÔ LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 40.77, image: 'https://www.marquesvendaspmg.shop/images/itubaina-tutti-frutti-retro-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 197, name: 'ITUBAÍNA TUTTI FRUTTI RETRÔ LONG NECK 355 ML (PCT 12 UN)', category: 'Bebidas', price: 41.83, image: 'https://www.marquesvendaspmg.shop/images/itubaina-tutti-frutti-retro-long-neck-355-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 198, name: 'LICOR 43 700 ML', category: 'Bebidas', price: 142.09, image: 'https://www.marquesvendaspmg.shop/images/licor-43-700-ml-pmg-atacadista.jpg' },
  { id: 199, name: 'LICOR 43 CHOCOLATE 700 ML', category: 'Bebidas', price: 177.92, image: 'https://www.marquesvendaspmg.shop/images/licor-43-chocolate-700-ml-pmg-atacadista.jpg' },
  { id: 200, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 201, name: 'LICOR AMARULA CREAM 750 ML', category: 'Bebidas', price: 107.98, image: 'https://www.marquesvendaspmg.shop/images/licor-amarula-cream-750-ml-pmg-atacadista.jpg' },
  { id: 202, name: 'LICOR BAILEYS 750 ML', category: 'Bebidas', price: 109.2, image: 'https://www.marquesvendaspmg.shop/images/licor-baileys-750-ml-pmg-atacadista.jpg' },
  { id: 203, name: 'LICOR COINTREAU 700 ML', category: 'Bebidas', price: 120.86, image: 'https://www.marquesvendaspmg.shop/images/licor-cointreau-700-ml-pmg-atacadista.jpg' },
  { id: 204, name: 'LICOR DRAMBUIE 750 ML', category: 'Bebidas', price: 112.46, image: 'https://www.marquesvendaspmg.shop/images/licor-drambuie-750-ml-pmg-atacadista.jpg' },
  { id: 205, name: 'LICOR JAGERMEISTER 700 ML', category: 'Bebidas', price: 114.11, image: 'https://www.marquesvendaspmg.shop/images/licor-jagermeister-700-ml-pmg-atacadista.jpg' },
  { id: 206, name: 'LICOR STOCK CREME DE CACAU 720 ML', category: 'Bebidas', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/licor-stock-creme-de-cacau-720-ml-pmg-atacadista.jpg' },
  { id: 207, name: 'LICOR STOCK CREME DE CASSIS 720 ML', category: 'Bebidas', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/licor-stock-creme-de-cassis-720-ml-pmg-atacadista.jpg' },
  { id: 208, name: 'LICOR STOCK CREME DE MENTA 720 ML', category: 'Bebidas', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/licor-stock-creme-de-menta-720-ml-pmg-atacadista.jpg' },
  { id: 209, name: 'LICOR STOCK CURAÇAU BLUE 720 ML', category: 'Bebidas', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/licor-stock-curacau-blue-720-ml-pmg-atacadista.jpg' },
  { id: 210, name: 'LICOR STOCK CURAÇAU FINO 720 ML', category: 'Bebidas', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/licor-stock-curacau-fino-720-ml-pmg-atacadista.jpg' },
  { id: 211, name: 'LICOR STOCK MARULA 720 ML', category: 'Bebidas', price: 55.22, image: 'https://www.marquesvendaspmg.shop/images/licor-stock-marula-720-ml-pmg-atacadista.jpg' },
  { id: 212, name: 'LICOR STOCK PÊSSEGO 720 ML', category: 'Bebidas', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/licor-stock-pessego-720-ml-pmg-atacadista.jpg' },
  { id: 213, name: 'PEPSI COLA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 39.01, image: 'https://www.marquesvendaspmg.shop/images/pepsi-cola-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 214, name: 'PEPSI COLA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 54.12, image: 'https://www.marquesvendaspmg.shop/images/pepsi-cola-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 215, name: 'REFRESCO ABACAXI CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 79.24, image: 'https://www.marquesvendaspmg.shop/images/refresco-abacaxi-camp-150-g-cx-12-pct-pmg-atacadista.jpg' },
  { id: 216, name: 'REFRESCO ABACAXI QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://www.marquesvendaspmg.shop/images/refresco-abacaxi-qualimax-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 217, name: 'REFRESCO CAJU QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://www.marquesvendaspmg.shop/images/refresco-caju-qualimax-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 218, name: 'REFRESCO LARANJA CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 79.24, image: 'https://www.marquesvendaspmg.shop/images/refresco-laranja-camp-150-g-cx-12-pct-pmg-atacadista.jpg' },
  { id: 219, name: 'REFRESCO LARANJA E ACEROLA QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.23, image: 'https://www.marquesvendaspmg.shop/images/refresco-laranja-e-acerola-qualimax-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 220, name: 'REFRESCO LARANJA QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://www.marquesvendaspmg.shop/images/refresco-laranja-qualimax-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 221, name: 'REFRESCO LIMÃO CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 79.24, image: 'https://www.marquesvendaspmg.shop/images/refresco-limao-camp-150-g-cx-12-pct-pmg-atacadista.jpg' },
  { id: 222, name: 'REFRESCO LIMÃO QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://www.marquesvendaspmg.shop/images/refresco-limao-qualimax-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 223, name: 'REFRESCO MANGA CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 79.24, image: 'https://www.marquesvendaspmg.shop/images/refresco-manga-camp-150-g-cx-12-pct-pmg-atacadista.jpg' },
  { id: 224, name: 'REFRESCO MANGA QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://www.marquesvendaspmg.shop/images/refresco-manga-qualimax-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 225, name: 'REFRESCO MARACUJA CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 79.24, image: 'https://www.marquesvendaspmg.shop/images/refresco-maracuja-camp-150-g-cx-12-pct-pmg-atacadista.jpg' },
  { id: 226, name: 'REFRESCO MARACUJÁ QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://www.marquesvendaspmg.shop/images/refresco-maracuja-qualimax-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 227, name: 'REFRESCO MORANGO QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://www.marquesvendaspmg.shop/images/refresco-morango-qualimax-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 228, name: 'REFRESCO UVA QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://www.marquesvendaspmg.shop/images/refresco-uva-qualimax-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 229, name: 'RUM BACARDÍ BIG APPLE 980 ML', category: 'Bebidas', price: 35.58, image: 'https://www.marquesvendaspmg.shop/images/rum-bacardi-big-apple-980-ml-pmg-atacadista.jpg' },
  { id: 230, name: 'RUM BACARDÍ CARTA BLANCA SUPERIOR 980 ML', category: 'Bebidas', price: 37.42, image: 'https://www.marquesvendaspmg.shop/images/rum-bacardi-carta-blanca-superior-980-ml-pmg-atacadista.jpg' },
  { id: 231, name: 'RUM BACARDÍ CARTA ORO SUPERIOR 980 ML', category: 'Bebidas', price: 35.58, image: 'https://www.marquesvendaspmg.shop/images/rum-bacardi-carta-oro-superior-980-ml-pmg-atacadista.jpg' },
  { id: 232, name: 'RUM MONTILLA CARTA BRANCA 1 L', category: 'Bebidas', price: 26.01, image: 'https://www.marquesvendaspmg.shop/images/rum-montilla-carta-branca-1-l-pmg-atacadista.jpg' },
  { id: 233, name: 'RUM MONTILLA CARTA OURO 1 L', category: 'Bebidas', price: 26.01, image: 'https://www.marquesvendaspmg.shop/images/rum-montilla-carta-ouro-1-l-pmg-atacadista.jpg' },
  { id: 234, name: 'SAQUÊ SECO AZUMA KIRIN 600 ML', category: 'Bebidas', price: 16.52, image: 'https://www.marquesvendaspmg.shop/images/saque-seco-azuma-kirin-600-ml-pmg-atacadista.jpg' },
  { id: 235, name: 'SAQUÊ SECO DOURADO AZUMA KIRIN 740 ML', category: 'Bebidas', price: 33.67, image: 'https://www.marquesvendaspmg.shop/images/saque-seco-dourado-azuma-kirin-740-ml-pmg-atacadista.jpg' },
  { id: 236, name: 'SAQUÊ SECO DOURADO SAGAE 750 ML', category: 'Bebidas', price: 14.97, image: 'https://www.marquesvendaspmg.shop/images/saque-seco-dourado-sagae-750-ml-pmg-atacadista.jpg' },
  { id: 237, name: 'SAQUÊ SECO SENSHI 720 ML', category: 'Bebidas', price: 12.64, image: 'https://www.marquesvendaspmg.shop/images/saque-seco-senshi-720-ml-pmg-atacadista.jpg' },
  { id: 238, name: 'SAQUÊ SECO SOFT AZUMA KIRIN 740 ML', category: 'Bebidas', price: 25.89, image: 'https://www.marquesvendaspmg.shop/images/saque-seco-soft-azuma-kirin-740-ml-pmg-atacadista.jpg' },
  { id: 239, name: 'SCHWEPPES CITRUS LATA 350 ML (PCT 6 LT)', category: 'Bebidas', price: 22.38, image: 'https://www.marquesvendaspmg.shop/images/schweppes-citrus-lata-350-ml-pct-6-lt-pmg-atacadista.jpg' },
  { id: 240, name: 'SCHWEPPES CITRUS LEVE EM AÇÚCARES LATA 350 ML (PCT 6 LT)', category: 'Bebidas', price: 23, image: 'https://www.marquesvendaspmg.shop/images/schweppes-citrus-leve-em-acucares-lata-350-ml-pct-6-lt-pmg-atacadista.jpg' },
  { id: 241, name: 'SODA ANTARCTICA LIMONADA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 38.93, image: 'https://www.marquesvendaspmg.shop/images/soda-antarctica-limonada-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 242, name: 'SODA ANTARCTICA LIMONADA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 53.76, image: 'https://www.marquesvendaspmg.shop/images/soda-antarctica-limonada-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 243, name: 'SODA ANTARCTICA LIMONADA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 55.63, image: 'https://www.marquesvendaspmg.shop/images/soda-antarctica-limonada-pet-600-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 244, name: 'SODA ANTARCTICA LIMONADA ZERO AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 39.15, image: 'https://www.marquesvendaspmg.shop/images/soda-antarctica-limonada-zero-acucares-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 245, name: 'SPRITE LATA 350 ML (PCT 6 UN)', category: 'Bebidas', price: 22.59, image: 'https://www.marquesvendaspmg.shop/images/sprite-lata-350-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 246, name: 'SPRITE LEMON FRESH PET 510 ML (PCT 12 UN)', category: 'Bebidas', price: 37.13, image: 'https://www.marquesvendaspmg.shop/images/sprite-lemon-fresh-pet-510-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 247, name: 'SPRITE PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 52.62, image: 'https://www.marquesvendaspmg.shop/images/sprite-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 248, name: 'STEINHAEGER BECOSA 980 ML', category: 'Bebidas', price: 32.46, image: 'https://www.marquesvendaspmg.shop/images/steinhaeger-becosa-980-ml-pmg-atacadista.jpg' },
  { id: 249, name: 'SUCO DE TOMATE RAIOLA 1 L', category: 'Bebidas', price: 28.26, image: 'https://www.marquesvendaspmg.shop/images/suco-de-tomate-raiola-1-l-pmg-atacadista.jpg' },
  { id: 250, name: 'SUCO DE TOMATE SUPERBOM 1 L', category: 'Bebidas', price: 22.54, image: 'https://www.marquesvendaspmg.shop/images/suco-de-tomate-superbom-1-l-pmg-atacadista.jpg' },
  { id: 251, name: 'SUCO DE UVA TINTO INTEGRAL TETRA PACK AURORA 1,5 L (CX 6 UN)', category: 'Bebidas', price: 122.62, image: 'https://www.marquesvendaspmg.shop/images/suco-de-uva-tinto-integral-tetra-pack-aurora-15-l-cx-6-un-pmg-atacadista.jpg' },
  { id: 252, name: 'SUCO DEL VALLE ABACAXI TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 59.31, image: 'https://www.marquesvendaspmg.shop/images/suco-del-valle-abacaxi-tetra-pack-1-l-cx-6-un-pmg-atacadista.jpg' },
  { id: 253, name: 'SUCO DEL VALLE CAJU SEM ADIÇÃO DE AÇÚCAR TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 50.61, image: 'https://www.marquesvendaspmg.shop/images/suco-del-valle-caju-sem-adicao-de-acucar-tetra-pack-1-l-cx-6-un-pmg-atacadista.jpg' },
  { id: 254, name: 'SUCO DEL VALLE GOIABA SEM ADIÇÃO DE AÇÚCAR LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23.65, image: 'https://www.marquesvendaspmg.shop/images/suco-del-valle-goiaba-sem-adicao-de-acucar-lata-290-ml-pct-6-lt-pmg-atacadista.jpg' },
  { id: 255, name: 'SUCO DEL VALLE LARANJA TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 59.31, image: 'https://www.marquesvendaspmg.shop/images/suco-del-valle-laranja-tetra-pack-1-l-cx-6-un-pmg-atacadista.jpg' },
  { id: 256, name: 'SUCO DEL VALLE MANGA LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23.65, image: 'https://www.marquesvendaspmg.shop/images/suco-del-valle-manga-lata-290-ml-pct-6-lt-pmg-atacadista.jpg' },
  { id: 257, name: 'SUCO DEL VALLE MARACUJÁ LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23.65, image: 'https://www.marquesvendaspmg.shop/images/suco-del-valle-maracuja-lata-290-ml-pct-6-lt-pmg-atacadista.jpg' },
  { id: 258, name: 'SUCO DEL VALLE PÊSSEGO LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23.65, image: 'https://www.marquesvendaspmg.shop/images/suco-del-valle-pessego-lata-290-ml-pct-6-lt-pmg-atacadista.jpg' },
  { id: 259, name: 'SUCO DEL VALLE UVA LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23.65, image: 'https://www.marquesvendaspmg.shop/images/suco-del-valle-uva-lata-290-ml-pct-6-lt-pmg-atacadista.jpg' },
  { id: 260, name: 'SUCO DEL VALLE UVA TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 59.31, image: 'https://www.marquesvendaspmg.shop/images/suco-del-valle-uva-tetra-pack-1-l-cx-6-un-pmg-atacadista.jpg' },
  { id: 261, name: 'SUCO GUARAVITON AÇAÍ 500 ML (PCT 12 UN)', category: 'Bebidas', price: 30.54, image: 'https://www.marquesvendaspmg.shop/images/suco-guaraviton-acai-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 262, name: 'SUCO MAGUARY ABACAXI 500 ML (PCT 12 UN)', category: 'Bebidas', price: 78.43, image: 'https://www.marquesvendaspmg.shop/images/suco-maguary-abacaxi-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 263, name: 'SUCO MAGUARY GOIABA 500 ML (PCT 12 UN)', category: 'Bebidas', price: 78.43, image: 'https://www.marquesvendaspmg.shop/images/suco-maguary-goiaba-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 264, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 265, name: 'SUCO MAGUARY LARANJA TETRA PACK 1 L (CX 12 UN)', category: 'Bebidas', price: 74.57, image: 'https://www.marquesvendaspmg.shop/images/suco-maguary-laranja-tetra-pack-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 266, name: 'SUCO MAGUARY MANGA 500 ML (PCT 12 UN)', category: 'Bebidas', price: 78.43, image: 'https://www.marquesvendaspmg.shop/images/suco-maguary-manga-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 267, name: 'SUCO MAGUARY MARACUJÁ 500 ML (PCT 12 UN)', category: 'Bebidas', price: 87.04, image: 'https://www.marquesvendaspmg.shop/images/suco-maguary-maracuja-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 268, name: 'SUCO MAGUARY MARACUJÁ LATA 335 ML (PCT 6 LT)', category: 'Bebidas', price: 22.59, image: 'https://www.marquesvendaspmg.shop/images/suco-maguary-maracuja-lata-335-ml-pct-6-lt-pmg-atacadista.jpg' },
  { id: 269, name: 'SUCO MAGUARY MARACUJÁ TETRA PACK 1 L (CX 12 UN)', category: 'Bebidas', price: 74.57, image: 'https://www.marquesvendaspmg.shop/images/suco-maguary-maracuja-tetra-pack-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 270, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 271, name: 'SUCO MAGUARY UVA 500 ML (PCT 12 UN)', category: 'Bebidas', price: 78.43, image: 'https://www.marquesvendaspmg.shop/images/suco-maguary-uva-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 272, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 273, name: 'SUCO MAGUARY UVA TETRA PACK 1 L (CX 12 UN)', category: 'Bebidas', price: 73.18, image: 'https://www.marquesvendaspmg.shop/images/suco-maguary-uva-tetra-pack-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 274, name: 'SUCO PEQUENO MAGUARY MAÇÃ 200 ML (CX 27 UN)', category: 'Bebidas', price: 50.5, image: 'https://www.marquesvendaspmg.shop/images/suco-pequeno-maguary-maca-200-ml-cx-27-un-pmg-atacadista.jpg' },
  { id: 275, name: 'SUCO PEQUENO MAGUARY UVA 200 ML (CX 27 UN)', category: 'Bebidas', price: 49.58, image: 'https://www.marquesvendaspmg.shop/images/suco-pequeno-maguary-uva-200-ml-cx-27-un-pmg-atacadista.jpg' },
  { id: 276, name: 'SUKITA LARANJA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 40.96, image: 'https://www.marquesvendaspmg.shop/images/sukita-laranja-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 277, name: 'SUKITA LARANJA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 42.19, image: 'https://www.marquesvendaspmg.shop/images/sukita-laranja-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 278, name: 'SUKITA LIMÃO PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 42.19, image: 'https://www.marquesvendaspmg.shop/images/sukita-limao-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 279, name: 'SUKITA TUBAÍNA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 41.95, image: 'https://www.marquesvendaspmg.shop/images/sukita-tubaina-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 280, name: 'TEQUILA JOSE CUERVO ESPECIAL PRATA 750 ML (CX 12 UN)', category: 'Bebidas', price: 103.07, image: 'https://www.marquesvendaspmg.shop/images/tequila-jose-cuervo-especial-prata-750-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 281, name: 'TEQUILA JOSE CUERVO ESPECIAL REPOSADO OURO 750 ML (CX 12 UN)', category: 'Bebidas', price: 103.07, image: 'https://www.marquesvendaspmg.shop/images/tequila-jose-cuervo-especial-reposado-ouro-750-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 282, name: 'TUBAÍNA CAMPOS TUTTI FRUTTI PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 31.29, image: 'https://www.marquesvendaspmg.shop/images/tubaina-campos-tutti-frutti-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 283, name: 'VINHO ARGENTINO TINTO MEIO SECO MALBEC RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 24.54, image: 'https://www.marquesvendaspmg.shop/images/vinho-argentino-tinto-meio-seco-malbec-reservado-concha-y-toro-750-ml-pmg-atacadista.jpg' },
  { id: 284, name: 'VINHO ARGENTINO TINTO SECO CABERNET SAUVIGNON BENJAMIN NIETO SENETINER 750 ML', category: 'Bebidas', price: 31.36, image: 'https://www.marquesvendaspmg.shop/images/vinho-argentino-tinto-seco-cabernet-sauvignon-benjamin-nieto-senetiner-750-ml-pmg-atacadista.jpg' },
  { id: 285, name: 'VINHO ARGENTINO TINTO SECO GATO NEGRO MALBEC SAN PEDRO 750 ML', category: 'Bebidas', price: 27.48, image: 'https://www.marquesvendaspmg.shop/images/vinho-argentino-tinto-seco-gato-negro-malbec-san-pedro-750-ml-pmg-atacadista.jpg' },
  { id: 286, name: 'VINHO CHILENO BRANCO SECO CHARDONNAY RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-branco-seco-chardonnay-reservado-santa-helena-750-ml-pmg-atacadista.jpg' },
  { id: 287, name: 'VINHO CHILENO BRANCO SECO FINO SAUVIGNON BLANC CHILANO 750 ML', category: 'Bebidas', price: 20.91, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-branco-seco-fino-sauvignon-blanc-chilano-750-ml-pmg-atacadista.jpg' },
  { id: 288, name: 'VINHO CHILENO BRANCO SECO SAUVIGNON BLANC RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-branco-seco-sauvignon-blanc-reservado-santa-helena-750-ml-pmg-atacadista.jpg' },
  { id: 289, name: 'VINHO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON MERLOT RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-meio-seco-cabernet-sauvignon-merlot-reservado-santa-helena-750-ml-pmg-atacadista.jpg' },
  { id: 290, name: 'VINHO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 24.54, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-meio-seco-cabernet-sauvignon-reservado-concha-y-toro-750-ml-pmg-atacadista.jpg' },
  { id: 291, name: 'VINHO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-meio-seco-cabernet-sauvignon-reservado-santa-helena-750-ml-pmg-atacadista.jpg' },
  { id: 292, name: 'VINHO CHILENO TINTO MEIO SECO CARMENÉRE RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 24.54, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-meio-seco-carmenere-reservado-concha-y-toro-750-ml-pmg-atacadista.jpg' },
  { id: 293, name: 'VINHO CHILENO TINTO MEIO SECO CARMENÉRE RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-meio-seco-carmenere-reservado-santa-helena-750-ml-pmg-atacadista.jpg' },
  { id: 294, name: 'VINHO CHILENO TINTO MEIO SECO GATO NEGRO CABERNET SAUVIGNON SAN PEDRO 750 ML', category: 'Bebidas', price: 29.45, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-meio-seco-gato-negro-cabernet-sauvignon-san-pedro-750-ml-pmg-atacadista.jpg' },
  { id: 295, name: 'VINHO CHILENO TINTO MEIO SECO GATO NEGRO MERLOT SAN PEDRO 750 ML', category: 'Bebidas', price: 29.45, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-meio-seco-gato-negro-merlot-san-pedro-750-ml-pmg-atacadista.jpg' },
  { id: 296, name: 'VINHO CHILENO TINTO MEIO SECO MERLOT RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 24.54, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-meio-seco-merlot-reservado-concha-y-toro-750-ml-pmg-atacadista.jpg' },
  { id: 297, name: 'VINHO CHILENO TINTO SECO CABERNET SAUVIGNON CASILLERO DEL DIABLO 750 ML', category: 'Bebidas', price: 42.95, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-seco-cabernet-sauvignon-casillero-del-diablo-750-ml-pmg-atacadista.jpg' },
  { id: 298, name: 'VINHO CHILENO TINTO SECO FINO CABERNET SAUVIGNON CHILANO 750 ML', category: 'Bebidas', price: 20.91, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-seco-fino-cabernet-sauvignon-chilano-750-ml-pmg-atacadista.jpg' },
  { id: 299, name: 'VINHO CHILENO TINTO SECO FINO CARMENÉRE CHILANO 750 ML', category: 'Bebidas', price: 20.91, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-seco-fino-carmenere-chilano-750-ml-pmg-atacadista.jpg' },
  { id: 300, name: 'VINHO CHILENO TINTO SECO FINO MALBEC CHILANO 750 ML', category: 'Bebidas', price: 20.91, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-seco-fino-malbec-chilano-750-ml-pmg-atacadista.jpg' },
  { id: 301, name: 'VINHO CHILENO TINTO SECO MALBEC CASILLERO DEL DIABLO 750 ML', category: 'Bebidas', price: 42.95, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-seco-malbec-casillero-del-diablo-750-ml-pmg-atacadista.jpg' },
  { id: 302, name: 'VINHO ESPANHOL TINTO SECO FINO ORO TEMPRANILLO PATA NEGRA 750 ML', category: 'Bebidas', price: 45.63, image: 'https://www.marquesvendaspmg.shop/images/vinho-espanhol-tinto-seco-fino-oro-tempranillo-pata-negra-750-ml-pmg-atacadista.jpg' },
  { id: 303, name: 'VINHO GRANDE NACIONAL TINTO SECO SANTOMÉ 1 L', category: 'Bebidas', price: 18.33, image: 'https://www.marquesvendaspmg.shop/images/vinho-grande-nacional-tinto-seco-santome-1-l-pmg-atacadista.jpg' },
  { id: 304, name: 'VINHO GRANDE NACIONAL TINTO SUAVE SANTOMÉ 1 L', category: 'Bebidas', price: 18.33, image: 'https://www.marquesvendaspmg.shop/images/vinho-grande-nacional-tinto-suave-santome-1-l-pmg-atacadista.jpg' },
  { id: 305, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 306, name: 'VINHO NACIONAL BRANCO "SECO" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 59.88, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-branco-seco-chalise-750-ml-cx-6-un-pmg-atacadista.jpg' },
  { id: 307, name: 'VINHO NACIONAL BRANCO "SUAVE" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 59.88, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-branco-suave-chalise-750-ml-cx-6-un-pmg-atacadista.jpg' },
  { id: 308, name: 'VINHO NACIONAL BRANCO SECO ALMADÉN RIESLING 750 ML', category: 'Bebidas', price: 28.69, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-branco-seco-almaden-riesling-750-ml-pmg-atacadista.jpg' },
  { id: 309, name: 'VINHO NACIONAL BRANCO SECO RANDON 4,6 L (CX 2 GL)', category: 'Bebidas', price: 100.12, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-branco-seco-randon-46-l-cx-2-gl-pmg-atacadista.jpg' },
  { id: 310, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 311, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 312, name: 'VINHO NACIONAL TINTO "SECO" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 59.88, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-seco-chalise-750-ml-cx-6-un-pmg-atacadista.jpg' },
  { id: 313, name: 'VINHO NACIONAL TINTO "SUAVE" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 59.88, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-suave-chalise-750-ml-cx-6-un-pmg-atacadista.jpg' },
  { id: 314, name: 'VINHO NACIONAL TINTO SECO CABERNET SAUVIGNON ALMADÉN 750 ML', category: 'Bebidas', price: 28.69, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-seco-cabernet-sauvignon-almaden-750-ml-pmg-atacadista.jpg' },
  { id: 315, name: 'VINHO NACIONAL TINTO SECO CABERNET SAUVIGNON MERLOT SELEÇÃO MIOLO 750 ML', category: 'Bebidas', price: 34.7, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-seco-cabernet-sauvignon-merlot-selecao-miolo-750-ml-pmg-atacadista.jpg' },
  { id: 316, name: 'VINHO NACIONAL TINTO SECO JURUBEBA LEÃO DO NORTE 600 ML', category: 'Bebidas', price: 13.74, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-seco-jurubeba-leao-do-norte-600-ml-pmg-atacadista.jpg' },
  { id: 317, name: 'VINHO NACIONAL TINTO SECO RANDON 4,6 L (CX 2 GL)', category: 'Bebidas', price: 100.12, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-seco-randon-46-l-cx-2-gl-pmg-atacadista.jpg' },
  { id: 318, name: 'VINHO NACIONAL TINTO SUAVE CABERNET ALMADÉN 750 ML', category: 'Bebidas', price: 23.24, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-suave-cabernet-almaden-750-ml-pmg-atacadista.jpg' },
  { id: 319, name: 'VINHO NACIONAL TINTO SUAVE COUNTRY WINE 750 ML', category: 'Bebidas', price: 13.87, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-suave-country-wine-750-ml-pmg-atacadista.jpg' },
  { id: 320, name: 'VINHO NACIONAL TINTO SUAVE RANDON 4,6 L (CX 2 GL)', category: 'Bebidas', price: 100.12, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-suave-randon-46-l-cx-2-gl-pmg-atacadista.jpg' },
  { id: 321, name: 'VINHO NACIONAL TINTO SUAVE SANTOMÉ 750 ML', category: 'Bebidas', price: 13.31, image: 'https://www.marquesvendaspmg.shop/images/vinho-nacional-tinto-suave-santome-750-ml-pmg-atacadista.jpg' },
  { id: 322, name: 'VINHO PEQUENO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON RESERVADO SANTA HELENA 375 ML', category: 'Bebidas', price: 18.78, image: 'https://www.marquesvendaspmg.shop/images/vinho-pequeno-chileno-tinto-meio-seco-cabernet-sauvignon-reservado-santa-helena-375-ml-pmg-atacadista.jpg' },
  { id: 323, name: 'VINHO PEQUENO PORTUGUÊS TINTO SECO PERIQUITA 375 ML', category: 'Bebidas', price: 33.74, image: 'https://www.marquesvendaspmg.shop/images/vinho-pequeno-portugues-tinto-seco-periquita-375-ml-pmg-atacadista.jpg' },
  { id: 324, name: 'VINHO PORTUGUÊS TINTO SECO CASAL GARCIA 750 ML', category: 'Bebidas', price: 41.52, image: 'https://www.marquesvendaspmg.shop/images/vinho-portugues-tinto-seco-casal-garcia-750-ml-pmg-atacadista.jpg' },
  { id: 325, name: 'VINHO PORTUGUÊS TINTO SECO PERIQUITA 750 ML', category: 'Bebidas', price: 52.76, image: 'https://www.marquesvendaspmg.shop/images/vinho-portugues-tinto-seco-periquita-750-ml-pmg-atacadista.jpg' },
  { id: 326, name: 'VINHO PORTUGUÊS VERDE MEIO SECO CASAL GARCIA 750 ML', category: 'Bebidas', price: 49.08, image: 'https://www.marquesvendaspmg.shop/images/vinho-portugues-verde-meio-seco-casal-garcia-750-ml-pmg-atacadista.jpg' },
  { id: 327, name: 'VODKA ABSOLUT 1 L', category: 'Bebidas', price: 76.07, image: 'https://www.marquesvendaspmg.shop/images/vodka-absolut-1-l-pmg-atacadista.jpg' },
  { id: 328, name: 'VODKA ASKOV FRUTAS VERMELHAS 900 ML', category: 'Bebidas', price: 14.85, image: 'https://www.marquesvendaspmg.shop/images/vodka-askov-frutas-vermelhas-900-ml-pmg-atacadista.jpg' },
  { id: 329, name: 'VODKA ASKOV MARACUJÁ 900 ML', category: 'Bebidas', price: 14.85, image: 'https://www.marquesvendaspmg.shop/images/vodka-askov-maracuja-900-ml-pmg-atacadista.jpg' },
  { id: 330, name: 'VODKA ASKOV TRADICIONAL 900 ML', category: 'Bebidas', price: 14.85, image: 'https://www.marquesvendaspmg.shop/images/vodka-askov-tradicional-900-ml-pmg-atacadista.jpg' },
  { id: 331, name: 'VODKA BALALAIKA 1 L', category: 'Bebidas', price: 14.6, image: 'https://www.marquesvendaspmg.shop/images/vodka-balalaika-1-l-pmg-atacadista.jpg' },
  { id: 332, name: 'VODKA BELVEDERE 700 ML', category: 'Bebidas', price: 116.57, image: 'https://www.marquesvendaspmg.shop/images/vodka-belvedere-700-ml-pmg-atacadista.jpg' },
  { id: 333, name: 'VODKA CIROC 750 ML', category: 'Bebidas', price: 132.52, image: 'https://www.marquesvendaspmg.shop/images/vodka-ciroc-750-ml-pmg-atacadista.jpg' },
  { id: 334, name: 'VODKA CIROC RED BERRY 750 ML', category: 'Bebidas', price: 175.46, image: 'https://www.marquesvendaspmg.shop/images/vodka-ciroc-red-berry-750-ml-pmg-atacadista.jpg' },
  { id: 335, name: 'VODKA KETEL ONE 1 L', category: 'Bebidas', price: 84.29, image: 'https://www.marquesvendaspmg.shop/images/vodka-ketel-one-1-l-pmg-atacadista.jpg' },
  { id: 336, name: 'VODKA ORLOFF 1 L', category: 'Bebidas', price: 25.77, image: 'https://www.marquesvendaspmg.shop/images/vodka-orloff-1-l-pmg-atacadista.jpg' },
  { id: 337, name: 'VODKA PEQUENA SMIRNOFF 600 ML', category: 'Bebidas', price: 24.42, image: 'https://www.marquesvendaspmg.shop/images/vodka-pequena-smirnoff-600-ml-pmg-atacadista.jpg' },
  { id: 338, name: 'VODKA SKYY 980 ML', category: 'Bebidas', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/vodka-skyy-980-ml-pmg-atacadista.jpg' },
  { id: 339, name: 'VODKA SMIRNOFF 998 ML', category: 'Bebidas', price: 33.13, image: 'https://www.marquesvendaspmg.shop/images/vodka-smirnoff-998-ml-pmg-atacadista.jpg' },
  { id: 340, name: 'VODKA SMIRNOFF ICE LIMÃO LONG NECK 275 ML (PCT 24 UN)', category: 'Bebidas', price: 159.02, image: 'https://www.marquesvendaspmg.shop/images/vodka-smirnoff-ice-limao-long-neck-275-ml-pct-24-un-pmg-atacadista.jpg' },
  { id: 341, name: 'WHISKY BALLANTINES 12 ANOS 1 L', category: 'Bebidas', price: 134.97, image: 'https://www.marquesvendaspmg.shop/images/whisky-ballantines-12-anos-1-l-pmg-atacadista.jpg' },
  { id: 342, name: 'WHISKY BALLANTINES FINEST 8 ANOS 1 L', category: 'Bebidas', price: 73.62, image: 'https://www.marquesvendaspmg.shop/images/whisky-ballantines-finest-8-anos-1-l-pmg-atacadista.jpg' },
  { id: 343, name: 'WHISKY BELL´S 700 ML', category: 'Bebidas', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/whisky-bells-700-ml-pmg-atacadista.jpg' },
  { id: 344, name: 'WHISKY BLACK WHITE 1 L', category: 'Bebidas', price: 80.98, image: 'https://www.marquesvendaspmg.shop/images/whisky-black-white-1-l-pmg-atacadista.jpg' },
  { id: 345, name: 'WHISKY BUCHANAN´S 12 ANOS 1 L', category: 'Bebidas', price: 176.94, image: 'https://www.marquesvendaspmg.shop/images/whisky-buchanans-12-anos-1-l-pmg-atacadista.jpg' },
  { id: 346, name: 'WHISKY CHIVAS REGAL 12 ANOS 1 L', category: 'Bebidas', price: 116.57, image: 'https://www.marquesvendaspmg.shop/images/whisky-chivas-regal-12-anos-1-l-pmg-atacadista.jpg' },
  { id: 347, name: 'WHISKY JACK DANIEL´S TENNESSEE FIRE 1 L', category: 'Bebidas', price: 138.65, image: 'https://www.marquesvendaspmg.shop/images/whisky-jack-daniels-tennessee-fire-1-l-pmg-atacadista.jpg' },
  { id: 348, name: 'WHISKY JACK DANIEL´S TENNESSEE HONEY 1 L', category: 'Bebidas', price: 142.33, image: 'https://www.marquesvendaspmg.shop/images/whisky-jack-daniels-tennessee-honey-1-l-pmg-atacadista.jpg' },
  { id: 349, name: 'WHISKY JACK DANIEL´S TENNESSEE OLD No.7 1 L', category: 'Bebidas', price: 142.33, image: 'https://www.marquesvendaspmg.shop/images/whisky-jack-daniels-tennessee-old-no7-1-l-pmg-atacadista.jpg' },
  { id: 350, name: 'WHISKY JAMESON 750 ML', category: 'Bebidas', price: 99.39, image: 'https://www.marquesvendaspmg.shop/images/whisky-jameson-750-ml-pmg-atacadista.jpg' },
  { id: 351, name: 'WHISKY JIM BEAM 1 L', category: 'Bebidas', price: 90.8, image: 'https://www.marquesvendaspmg.shop/images/whisky-jim-beam-1-l-pmg-atacadista.jpg' },
  { id: 352, name: 'WHISKY JOHNNIE WALKER BLACK LABEL 12 ANOS 1 L', category: 'Bebidas', price: 175.45, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-black-label-12-anos-1-l-pmg-atacadista.jpg' },
  { id: 353, name: 'WHISKY JOHNNIE WALKER BLUE LABEL 750 ML', category: 'Bebidas', price: 1022.48, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-blue-label-750-ml-pmg-atacadista.jpg' },
  { id: 354, name: 'WHISKY JOHNNIE WALKER DOUBLE BLACK 1 L', category: 'Bebidas', price: 202.46, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-double-black-1-l-pmg-atacadista.jpg' },
  { id: 355, name: 'WHISKY JOHNNIE WALKER GOLD LABEL RESERVE 750 ML', category: 'Bebidas', price: 233.13, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-gold-label-reserve-750-ml-pmg-atacadista.jpg' },
  { id: 356, name: 'WHISKY JOHNNIE WALKER RED LABEL 1 L', category: 'Bebidas', price: 86.5, image: 'https://www.marquesvendaspmg.shop/images/whisky-johnnie-walker-red-label-1-l-pmg-atacadista.jpg' },
  { id: 357, name: 'WHISKY NATU NOBILIS 1 L', category: 'Bebidas', price: 37.36, image: 'https://www.marquesvendaspmg.shop/images/whisky-natu-nobilis-1-l-pmg-atacadista.jpg' },
  { id: 358, name: 'WHISKY OLD EIGHT 900 ML', category: 'Bebidas', price: 30.43, image: 'https://www.marquesvendaspmg.shop/images/whisky-old-eight-900-ml-pmg-atacadista.jpg' },
  { id: 359, name: 'WHISKY OLD PARR 12 ANOS 1 L', category: 'Bebidas', price: 144.79, image: 'https://www.marquesvendaspmg.shop/images/whisky-old-parr-12-anos-1-l-pmg-atacadista.jpg' },
  { id: 360, name: 'WHISKY PASSPORT 1 L', category: 'Bebidas', price: 49.08, image: 'https://www.marquesvendaspmg.shop/images/whisky-passport-1-l-pmg-atacadista.jpg' },
  { id: 361, name: 'WHISKY WHITE HORSE 1 L', category: 'Bebidas', price: 67.49, image: 'https://www.marquesvendaspmg.shop/images/whisky-white-horse-1-l-pmg-atacadista.jpg' },
  { id: 362, name: 'XAROPE MONIN AMORA 700 ML', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-amora-700-ml-pmg-atacadista.jpg' },
  { id: 363, name: 'XAROPE MONIN CURAÇAU BLUE 700 ML', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-curacau-blue-700-ml-pmg-atacadista.jpg' },
  { id: 364, name: 'XAROPE MONIN FRAMBOESA 700 ML', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-framboesa-700-ml-pmg-atacadista.jpg' },
  { id: 365, name: 'XAROPE MONIN GENGIBRE 700 ML', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-gengibre-700-ml-pmg-atacadista.jpg' },
  { id: 366, name: 'XAROPE MONIN GRENADINE 700 ML', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-grenadine-700-ml-pmg-atacadista.jpg' },
  { id: 367, name: 'XAROPE MONIN LIMÃO SICILIANO 700 ML', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-limao-siciliano-700-ml-pmg-atacadista.jpg' },
  { id: 368, name: 'XAROPE MONIN MAÇÃ VERDE 700 ML', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-maca-verde-700-ml-pmg-atacadista.jpg' },
  { id: 369, name: 'XAROPE MONIN MARACUJÁ 700 ML', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-maracuja-700-ml-pmg-atacadista.jpg' },
  { id: 370, name: 'XAROPE MONIN MORANGO 700 ML', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-morango-700-ml-pmg-atacadista.jpg' },
  { id: 371, name: 'XAROPE MONIN TANGERINA 700 ML', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-tangerina-700-ml-pmg-atacadista.jpg' },
  { id: 372, name: 'ERVILHA BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 77.39, image: 'https://www.marquesvendaspmg.shop/images/ervilha-bonare-goias-verde-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 373, name: 'ERVILHA GRANDE BONARE GOIÁS VERDE 1,7 KILO', category: 'Conservas/Enlatados', price: 19.41, image: 'https://www.marquesvendaspmg.shop/images/ervilha-grande-bonare-goias-verde-17-kilo-pmg-atacadista.jpg' },
  { id: 374, name: 'ERVILHA GRANDE QUERO 1,7 KILO', category: 'Conservas/Enlatados', price: 23.1, image: 'https://www.marquesvendaspmg.shop/images/ervilha-grande-quero-17-kilo-pmg-atacadista.jpg' },
  { id: 375, name: 'ERVILHA PEQUENA DA TERRINHA 500 G', category: 'Conservas/Enlatados', price: 6.51, image: 'https://www.marquesvendaspmg.shop/images/ervilha-pequena-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 376, name: 'ERVILHA QUERO 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 100.05, image: 'https://www.marquesvendaspmg.shop/images/ervilha-quero-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 377, name: 'EXTRATO DE TOMATE AJINOMOTO 2 KILO', category: 'Conservas/Enlatados', price: 29.82, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-ajinomoto-2-kilo-pmg-atacadista.jpg' },
  { id: 378, name: 'EXTRATO DE TOMATE BONARE GOIÁS VERDE 1,7 KILO', category: 'Conservas/Enlatados', price: 33.1, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-bonare-goias-verde-17-kilo-pmg-atacadista.jpg' },
  { id: 379, name: 'EXTRATO DE TOMATE BONARE GOIÁS VERDE 4 KILO', category: 'Conservas/Enlatados', price: 31.82, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-bonare-goias-verde-4-kilo-pmg-atacadista.jpg' },
  { id: 380, name: 'EXTRATO DE TOMATE BONARE GOURMET SUPER CONCENTRADO GOIÁS VERDE 4 KILO', category: 'Conservas/Enlatados', price: 40.91, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-bonare-gourmet-super-concentrado-goias-verde-4-kilo-pmg-atacadista.jpg' },
  { id: 381, name: 'EXTRATO DE TOMATE EKMA 1,7 KILO', category: 'Conservas/Enlatados', price: 16.83, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-ekma-17-kilo-pmg-atacadista.jpg' },
  { id: 382, name: 'EXTRATO DE TOMATE ELEFANTE 1,04 KILO (CX 12 UN)', category: 'Conservas/Enlatados', price: 72.75, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-elefante-104-kilo-cx-12-un-pmg-atacadista.jpg' },
  { id: 383, name: 'EXTRATO DE TOMATE ELEFANTE 1,7 KILO', category: 'Conservas/Enlatados', price: 32.13, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-elefante-17-kilo-pmg-atacadista.jpg' },
  { id: 384, name: 'EXTRATO DE TOMATE QUERO 1,020 KILO (CX 12 BAG)', category: 'Conservas/Enlatados', price: 105.09, image: 'https://www.marquesvendaspmg.shop/images/extrato-de-tomate-quero-1020-kilo-cx-12-bag-pmg-atacadista.jpg' },
  { id: 385, name: 'MILHO BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 77, image: 'https://www.marquesvendaspmg.shop/images/milho-bonare-goias-verde-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 386, name: 'MILHO GRANDE BONARE GOIÁS VERDE 1,7 KILO', category: 'Conservas/Enlatados', price: 23.93, image: 'https://www.marquesvendaspmg.shop/images/milho-grande-bonare-goias-verde-17-kilo-pmg-atacadista.jpg' },
  { id: 387, name: 'MILHO GRANDE FUGINI 1,7 KILO', category: 'Conservas/Enlatados', price: 22.43, image: 'https://www.marquesvendaspmg.shop/images/milho-grande-fugini-17-kilo-pmg-atacadista.jpg' },
  { id: 388, name: 'MILHO GRANDE PREDILECTA 1,7 KILO', category: 'Conservas/Enlatados', price: 20.54, image: 'https://www.marquesvendaspmg.shop/images/milho-grande-predilecta-17-kilo-pmg-atacadista.jpg' },
  { id: 389, name: 'MILHO GRANDE QUERO 1,7 KILO', category: 'Conservas/Enlatados', price: 23.56, image: 'https://www.marquesvendaspmg.shop/images/milho-grande-quero-17-kilo-pmg-atacadista.jpg' },
  { id: 390, name: 'MILHO QUERO 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 104.08, image: 'https://www.marquesvendaspmg.shop/images/milho-quero-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 391, name: 'MOLHO ALHO CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 12.64, image: 'https://www.marquesvendaspmg.shop/images/molho-alho-cepera-101-l-pmg-atacadista.jpg' },
  { id: 392, name: 'MOLHO BACONNAISE JUNIOR 1,1 KILO', category: 'Conservas/Enlatados', price: 45.54, image: 'https://www.marquesvendaspmg.shop/images/molho-baconnaise-junior-11-kilo-pmg-atacadista.jpg' },
  { id: 393, name: 'MOLHO BARBECUE CEPÊRA 1,01 KILO', category: 'Conservas/Enlatados', price: 14.89, image: 'https://www.marquesvendaspmg.shop/images/molho-barbecue-cepera-101-kilo-pmg-atacadista.jpg' },
  { id: 394, name: 'MOLHO BARBECUE CEPÊRA 3,5 KILO', category: 'Conservas/Enlatados', price: 41.34, image: 'https://www.marquesvendaspmg.shop/images/molho-barbecue-cepera-35-kilo-pmg-atacadista.jpg' },
  { id: 395, name: 'MOLHO BARBECUE EKMA 3,5 KILO', category: 'Conservas/Enlatados', price: 29.57, image: 'https://www.marquesvendaspmg.shop/images/molho-barbecue-ekma-35-kilo-pmg-atacadista.jpg' },
  { id: 396, name: 'MOLHO BARBECUE HEINZ 2 KILO', category: 'Conservas/Enlatados', price: 46.74, image: 'https://www.marquesvendaspmg.shop/images/molho-barbecue-heinz-2-kilo-pmg-atacadista.jpg' },
  { id: 397, name: 'MOLHO BARBECUE SACHÊ CEPÊRA 7 G (CX 175 UN)', category: 'Conservas/Enlatados', price: 32.6, image: 'https://www.marquesvendaspmg.shop/images/molho-barbecue-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg' },
  { id: 398, name: 'MOLHO BARBECUE SACHÊ FUGINI 7 G (CX 144 UN)', category: 'Conservas/Enlatados', price: 17.4, image: 'https://www.marquesvendaspmg.shop/images/molho-barbecue-sache-fugini-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 399, name: 'MOLHO BECHAMEL AJINOMOTO 1 KILO', category: 'Conservas/Enlatados', price: 34.19, image: 'https://www.marquesvendaspmg.shop/images/molho-bechamel-ajinomoto-1-kilo-pmg-atacadista.jpg' },
  { id: 400, name: 'MOLHO BILLY & JACK ORIGINAL KISABOR 1,01 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 95.85, image: 'https://www.marquesvendaspmg.shop/images/molho-billy-jack-original-kisabor-101-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 401, name: 'MOLHO BILLY & JACK TASTY KISABOR 1,01 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 97.2, image: 'https://www.marquesvendaspmg.shop/images/molho-billy-jack-tasty-kisabor-101-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 402, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 403, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 404, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 405, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 406, name: 'MOLHO CHIPOTLE JUNIOR 1,01 KILO', category: 'Conservas/Enlatados', price: 43.32, image: 'https://www.marquesvendaspmg.shop/images/molho-chipotle-junior-101-kilo-pmg-atacadista.jpg' },
  { id: 407, name: 'MOLHO DE PIMENTA VERMELHA CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 10.13, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-vermelha-cepera-101-l-pmg-atacadista.jpg' },
  { id: 408, name: 'MOLHO DE PIMENTA VERMELHA EKMA 1,01 L', category: 'Conservas/Enlatados', price: 16.54, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-vermelha-ekma-101-l-pmg-atacadista.jpg' },
  { id: 409, name: 'MOLHO DE PIMENTA VERMELHA KISABOR 150 ML (CX 24 UN)', category: 'Conservas/Enlatados', price: 40.85, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-vermelha-kisabor-150-ml-cx-24-un-pmg-atacadista.jpg' },
  { id: 410, name: 'MOLHO DE PIMENTA VERMELHA MC ILHENNY TABASCO 60 ML (CX 12 VD)', category: 'Conservas/Enlatados', price: 261.24, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-vermelha-mc-ilhenny-tabasco-60-ml-cx-12-vd-pmg-atacadista.jpg' },
  { id: 411, name: 'MOLHO DE PIMENTA VERMELHA SACHÊ CEPÊRA 5 G (CX 175 UN)', category: 'Conservas/Enlatados', price: 27.38, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-vermelha-sache-cepera-5-g-cx-175-un-pmg-atacadista.jpg' },
  { id: 412, name: 'MOLHO DE PIMENTA VERMELHA SACHÊ PREDILECTA 3 G (CX 144 UN)', category: 'Conservas/Enlatados', price: 15.07, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-vermelha-sache-predilecta-3-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 413, name: 'MOLHO DE TOMATE PIZZA BONARE GOIÁS VERDE 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 58.62, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-pizza-bonare-goias-verde-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 414, name: 'MOLHO DE TOMATE PIZZA CEPÊRA MAMMA D ORO 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 105.57, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-pizza-cepera-mamma-d-oro-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 415, name: 'MOLHO DE TOMATE REFOGADO TRADICIONAL BONARE GOURMET GOIÁS VERDE 1,02 KILO (CX 12 BAG)', category: 'Conservas/Enlatados', price: 62.11, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-refogado-tradicional-bonare-gourmet-goias-verde-102-kilo-cx-12-bag-pmg-atacadista.jpg' },
  { id: 416, name: 'MOLHO DE TOMATE REFOGADO TRADICIONAL EKMA 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 61.15, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-refogado-tradicional-ekma-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 417, name: 'MOLHO DE TOMATE TRADICIONAL BONARE GOIÁS VERDE 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 58.62, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-tradicional-bonare-goias-verde-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 418, name: 'MOLHO DE TOMATE TRADICIONAL FUGINI 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 56.31, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-tradicional-fugini-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 419, name: 'MOLHO DE TOMATE TRADICIONAL HEINZ 1,02 KILO (CX 12 BAG)', category: 'Conservas/Enlatados', price: 83.73, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-tradicional-heinz-102-kilo-cx-12-bag-pmg-atacadista.jpg' },
  { id: 420, name: 'MOLHO DE TOMATE TRADICIONAL MAMMA D ORO CEPÊRA 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 95.97, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-tradicional-mamma-d-oro-cepera-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 421, name: 'MOLHO DE TOMATE TRADICIONAL POMAROLA 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 63.59, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-tradicional-pomarola-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 422, name: 'MOLHO DE TOMATE TRADICIONAL QUERO BAG 2 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 62.31, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-tradicional-quero-bag-2-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 423, name: 'MOLHO DEMI GLACE AJINOMOTO 1 KILO', category: 'Conservas/Enlatados', price: 58.67, image: 'https://www.marquesvendaspmg.shop/images/molho-demi-glace-ajinomoto-1-kilo-pmg-atacadista.jpg' },
  { id: 424, name: 'MOLHO DEMI GLACE JUNIOR 500 G', category: 'Conservas/Enlatados', price: 39.75, image: 'https://www.marquesvendaspmg.shop/images/molho-demi-glace-junior-500-g-pmg-atacadista.jpg' },
  { id: 425, name: 'MOLHO INGLÊS CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 7.27, image: 'https://www.marquesvendaspmg.shop/images/molho-ingles-cepera-101-l-pmg-atacadista.jpg' },
  { id: 426, name: 'MOLHO ITALIAN SACHÊ JUNIOR 18 G (CX 180 UN)', category: 'Conservas/Enlatados', price: 105.4, image: 'https://www.marquesvendaspmg.shop/images/molho-italian-sache-junior-18-g-cx-180-un-pmg-atacadista.jpg' },
  { id: 427, name: 'MOLHO ITALIANO SACHÊ LANCHERO 8 ML (CX 152 UN)', category: 'Conservas/Enlatados', price: 20.44, image: 'https://www.marquesvendaspmg.shop/images/molho-italiano-sache-lanchero-8-ml-cx-152-un-pmg-atacadista.jpg' },
  { id: 428, name: 'MOLHO PARA PIZZA EKMA 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 63.59, image: 'https://www.marquesvendaspmg.shop/images/molho-para-pizza-ekma-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 429, name: 'MOLHO PIMENTA SACHÊ EKMA 3 ML (CX 174 UN)', category: 'Conservas/Enlatados', price: 16.54, image: 'https://www.marquesvendaspmg.shop/images/molho-pimenta-sache-ekma-3-ml-cx-174-un-pmg-atacadista.jpg' },
  { id: 430, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 431, name: 'MOLHO SALADA CAESAR CASTELO 236 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 100.49, image: 'https://www.marquesvendaspmg.shop/images/molho-salada-caesar-castelo-236-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 432, name: 'MOLHO SALADA CAESAR KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 61.69, image: 'https://www.marquesvendaspmg.shop/images/molho-salada-caesar-kisabor-240-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 433, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 434, name: 'MOLHO SALADA ITALIAN SACHÊ EKMA 18 G (CX 42 UN)', category: 'Conservas/Enlatados', price: 22.76, image: 'https://www.marquesvendaspmg.shop/images/molho-salada-italian-sache-ekma-18-g-cx-42-un-pmg-atacadista.jpg' },
  { id: 435, name: 'MOLHO SALADA ITALIANO CASTELO 236 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 100.49, image: 'https://www.marquesvendaspmg.shop/images/molho-salada-italiano-castelo-236-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 436, name: 'MOLHO SALADA ITALIANO KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 61.69, image: 'https://www.marquesvendaspmg.shop/images/molho-salada-italiano-kisabor-240-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 437, name: 'MOLHO SALADA LIMÃO CASTELO 236 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 100.49, image: 'https://www.marquesvendaspmg.shop/images/molho-salada-limao-castelo-236-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 438, name: 'MOLHO SALADA LIMÃO KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 61.69, image: 'https://www.marquesvendaspmg.shop/images/molho-salada-limao-kisabor-240-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 439, name: 'MOLHO SALADA PARMESÃO KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 61.69, image: 'https://www.marquesvendaspmg.shop/images/molho-salada-parmesao-kisabor-240-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 440, name: 'MOLHO SALADA ROSE KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 61.69, image: 'https://www.marquesvendaspmg.shop/images/molho-salada-rose-kisabor-240-ml-cx-12-un-pmg-atacadista.jpg' },
  { id: 441, name: 'MOLHO SHOYU CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 11.84, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-cepera-101-l-pmg-atacadista.jpg' },
  { id: 442, name: 'MOLHO SHOYU EKMA 1,01 L', category: 'Conservas/Enlatados', price: 8.02, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-ekma-101-l-pmg-atacadista.jpg' },
  { id: 443, name: 'MOLHO SHOYU GRANDE EKMA 3,1 L', category: 'Conservas/Enlatados', price: 22.77, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-grande-ekma-31-l-pmg-atacadista.jpg' },
  { id: 444, name: 'MOLHO SHOYU MÉDIO MITSUWA 3,1 L', category: 'Conservas/Enlatados', price: 34.8, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-medio-mitsuwa-31-l-pmg-atacadista.jpg' },
  { id: 445, name: 'MOLHO SHOYU PONZAN 5 L', category: 'Conservas/Enlatados', price: 25.26, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-ponzan-5-l-pmg-atacadista.jpg' },
  { id: 446, name: 'MOLHO SHOYU PREMIUM CEPÊRA 5 L', category: 'Conservas/Enlatados', price: 60.18, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-premium-cepera-5-l-pmg-atacadista.jpg' },
  { id: 447, name: 'MOLHO SHOYU PREMIUM MITSUWA 900 ML', category: 'Conservas/Enlatados', price: 13.49, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-premium-mitsuwa-900-ml-pmg-atacadista.jpg' },
  { id: 448, name: 'MOLHO SHOYU SACHÊ EKMA 8 ML (CX 96 UN)', category: 'Conservas/Enlatados', price: 17.14, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-sache-ekma-8-ml-cx-96-un-pmg-atacadista.jpg' },
  { id: 449, name: 'MOLHO SHOYU SATIS AJINOMOTO 5 L', category: 'Conservas/Enlatados', price: 88.76, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-satis-ajinomoto-5-l-pmg-atacadista.jpg' },
  { id: 450, name: 'MOLHO SHOYU SUAVE MITSUWA 900 ML', category: 'Conservas/Enlatados', price: 13.03, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-suave-mitsuwa-900-ml-pmg-atacadista.jpg' },
  { id: 451, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 452, name: 'MOLHO TÁRTARO FOOD SERVICE KISABOR 1,01', category: 'Conservas/Enlatados', price: 16.36, image: 'https://www.marquesvendaspmg.shop/images/molho-tartaro-food-service-kisabor-101-pmg-atacadista.jpg' },
  { id: 453, name: 'POLPA DE TOMATE QUERO 1,050 KILO (CX 12 UN)', category: 'Conservas/Enlatados', price: 103.25, image: 'https://www.marquesvendaspmg.shop/images/polpa-de-tomate-quero-1050-kilo-cx-12-un-pmg-atacadista.jpg' },
  { id: 454, name: 'SELETA DE LEGUMES BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 97.39, image: 'https://www.marquesvendaspmg.shop/images/seleta-de-legumes-bonare-goias-verde-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 455, name: 'TOMATE PELADO INTEIRO ARCO BELLO 2,5 KILO', category: 'Conservas/Enlatados', price: 36.55, image: 'https://www.marquesvendaspmg.shop/images/tomate-pelado-inteiro-arco-bello-25-kilo-pmg-atacadista.jpg' },
  { id: 456, name: 'TOMATE PELADO INTEIRO OLÉ 2,5 KILO', category: 'Conservas/Enlatados', price: 26.8, image: 'https://www.marquesvendaspmg.shop/images/tomate-pelado-inteiro-ole-25-kilo-pmg-atacadista.jpg' },
  { id: 457, name: 'TOMATE PELADO INTEIRO PREDILECTA 2,5 KILO', category: 'Conservas/Enlatados', price: 24.86, image: 'https://www.marquesvendaspmg.shop/images/tomate-pelado-inteiro-predilecta-25-kilo-pmg-atacadista.jpg' },
  { id: 458, name: 'ASAS DE FRANGO CONGELADAS JUSSARA (CX 20 KILO)', category: 'Derivados de Ave', price: 200.1, image: 'https://www.marquesvendaspmg.shop/images/asas-de-frango-congeladas-jussara-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 459, name: 'BLANQUET DE PERU SADIA 1,75 KILO', category: 'Derivados de Ave', price: 83.2, image: 'https://www.marquesvendaspmg.shop/images/blanquet-de-peru-sadia-175-kilo-pmg-atacadista.jpg' },
  { id: 460, name: 'BURGER CHICKEN DE FRANGO CONGELADO EMPANADO SUPREME SEARA 2 KILO (CX 3 PCT)', category: 'Derivados de Ave', price: 171.03, image: 'https://www.marquesvendaspmg.shop/images/burger-chicken-de-frango-congelado-empanado-supreme-seara-2-kilo-cx-3-pct-pmg-atacadista.jpg' },
  { id: 461, name: 'CHICKEN DE FRANGO CONGELADO EMPANADO BAITA 1 KILO (CX 10 PCT)', category: 'Derivados de Ave', price: 177.48, image: 'https://www.marquesvendaspmg.shop/images/chicken-de-frango-congelado-empanado-baita-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 462, name: 'CHICKEN DE FRANGO CONGELADO EMPANADO SUPREME SEARA 2,5 KILO (CX 2 PCT)', category: 'Derivados de Ave', price: 119.13, image: 'https://www.marquesvendaspmg.shop/images/chicken-de-frango-congelado-empanado-supreme-seara-25-kilo-cx-2-pct-pmg-atacadista.jpg' },
  { id: 463, name: 'CLARA DE OVO PASTEURIZADA RESFRIADA ASA 1 KILO', category: 'Derivados de Ave', price: 26.39, image: 'https://www.marquesvendaspmg.shop/images/clara-de-ovo-pasteurizada-resfriada-asa-1-kilo-pmg-atacadista.jpg' },
  { id: 464, name: 'CLARA DE OVO PASTEURIZADA RESFRIADA FLEISCHEGGS 1 KILO', category: 'Derivados de Ave', price: 33.41, image: 'https://www.marquesvendaspmg.shop/images/clara-de-ovo-pasteurizada-resfriada-fleischeggs-1-kilo-pmg-atacadista.jpg' },
  { id: 465, name: 'CORAÇÃO DE FRANGO CONGELADO DIPLOMATA (CX 12 KILO)', category: 'Derivados de Ave', price: 440.77, image: 'https://www.marquesvendaspmg.shop/images/coracao-de-frango-congelado-diplomata-cx-12-kilo-pmg-atacadista.jpg' },
  { id: 466, name: 'CORAÇÃO DE FRANGO CONGELADO ITABOM 1 KILO (CX 18 KILO)', category: 'Derivados de Ave', price: 440.49, image: 'https://www.marquesvendaspmg.shop/images/coracao-de-frango-congelado-itabom-1-kilo-cx-18-kilo-pmg-atacadista.jpg' },
  { id: 467, name: 'COXAS E SOBRECOXAS DE FRANGO CONGELADAS COM OSSO A GOSTO (CX 20 KILO)', category: 'Derivados de Ave', price: 184.05, image: 'https://www.marquesvendaspmg.shop/images/coxas-e-sobrecoxas-de-frango-congeladas-com-osso-a-gosto-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 468, name: 'COXAS E SOBRECOXAS DE FRANGO CONGELADAS COM OSSO MIRA (CX 20 KILO)', category: 'Derivados de Ave', price: 188.96, image: 'https://www.marquesvendaspmg.shop/images/coxas-e-sobrecoxas-de-frango-congeladas-com-osso-mira-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 469, name: 'COXAS E SOBRECOXAS DE FRANGO CONGELADAS COM OSSO ROSAVES (CX 18 KILO)', category: 'Derivados de Ave', price: 155.14, image: 'https://www.marquesvendaspmg.shop/images/coxas-e-sobrecoxas-de-frango-congeladas-com-osso-rosaves-cx-18-kilo-pmg-atacadista.jpg' },
  { id: 470, name: 'COXAS E SOBRECOXAS DE FRANGO TEMPERADAS CONGELADAS COM OSSO FRANGÃO FOODS (CX 20 KILO)', category: 'Derivados de Ave', price: 152.88, image: 'https://www.marquesvendaspmg.shop/images/coxas-e-sobrecoxas-de-frango-temperadas-congeladas-com-osso-frangao-foods-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 471, name: 'COXINHAS DAS ASAS DE FRANGO CONGELADAS CANÇÃO (CX 20 KILO)', category: 'Derivados de Ave', price: 247.85, image: 'https://www.marquesvendaspmg.shop/images/coxinhas-das-asas-de-frango-congeladas-cancao-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 472, name: 'COXINHAS DAS ASAS DE FRANGO CONGELADAS GUIBON (CX 18 KILO)', category: 'Derivados de Ave', price: 234.64, image: 'https://www.marquesvendaspmg.shop/images/coxinhas-das-asas-de-frango-congeladas-guibon-cx-18-kilo-pmg-atacadista.jpg' },
  { id: 473, name: 'FILÉ DE COXAS E SOBRECOXAS DE FRANGO CONGELADO ABR (CX 20 KILO)', category: 'Derivados de Ave', price: 285.89, image: 'https://www.marquesvendaspmg.shop/images/file-de-coxas-e-sobrecoxas-de-frango-congelado-abr-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 474, name: 'FILÉ DE PEITO DE FRANGO CONGELADO COZIDO DESFIADO E TEMPERADO PIF PAF 4 KILO (CX 4 PCT)', category: 'Derivados de Ave', price: 442.08, image: 'https://www.marquesvendaspmg.shop/images/file-de-peito-de-frango-congelado-cozido-desfiado-e-temperado-pif-paf-4-kilo-cx-4-pct-pmg-atacadista.jpg' },
  { id: 475, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE COM SASSAMI A GOSTO (CX 20 KILO)', category: 'Derivados de Ave', price: 353.86, image: 'https://www.marquesvendaspmg.shop/images/file-de-peito-de-frango-congelado-sem-osso-sem-pele-com-sassami-a-gosto-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 476, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE COM SASSAMI ABR (CX 20 KILO)', category: 'Derivados de Ave', price: 369.68, image: 'https://www.marquesvendaspmg.shop/images/file-de-peito-de-frango-congelado-sem-osso-sem-pele-com-sassami-abr-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 477, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE COM SASSAMI JUSSARA (CX 20 KILO)', category: 'Derivados de Ave', price: 345.43, image: 'https://www.marquesvendaspmg.shop/images/file-de-peito-de-frango-congelado-sem-osso-sem-pele-com-sassami-jussara-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 478, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE SEM SASSAMI CANÇÃO (CX 20 KILO)', category: 'Derivados de Ave', price: 369.2, image: 'https://www.marquesvendaspmg.shop/images/file-de-peito-de-frango-congelado-sem-osso-sem-pele-sem-sassami-cancao-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 479, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE SEM SASSAMI PIONEIRO (CX 20 KILO)', category: 'Derivados de Ave', price: 329.14, image: 'https://www.marquesvendaspmg.shop/images/file-de-peito-de-frango-congelado-sem-osso-sem-pele-sem-sassami-pioneiro-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 480, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE SEM SASSAMI RICO (CX 20 KILO)', category: 'Derivados de Ave', price: 317.32, image: 'https://www.marquesvendaspmg.shop/images/file-de-peito-de-frango-congelado-sem-osso-sem-pele-sem-sassami-rico-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 481, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO AURORA 1 KILO (CX 16 PCT)', category: 'Derivados de Ave', price: 292.11, image: 'https://www.marquesvendaspmg.shop/images/filezinho-sassami-de-frango-congelado-aurora-1-kilo-cx-16-pct-pmg-atacadista.jpg' },
  { id: 482, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO CANÇÃO (CX 20 KILO)', category: 'Derivados de Ave', price: 369.2, image: 'https://www.marquesvendaspmg.shop/images/filezinho-sassami-de-frango-congelado-cancao-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 483, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO JAGUÁ 1 KILO (CX 20 PCT)', category: 'Derivados de Ave', price: 320.94, image: 'https://www.marquesvendaspmg.shop/images/filezinho-sassami-de-frango-congelado-jagua-1-kilo-cx-20-pct-pmg-atacadista.jpg' },
  { id: 484, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO PERDIGÃO 1 KILO (CX 16 PCT)', category: 'Derivados de Ave', price: 333.68, image: 'https://www.marquesvendaspmg.shop/images/filezinho-sassami-de-frango-congelado-perdigao-1-kilo-cx-16-pct-pmg-atacadista.jpg' },
  { id: 485, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO SOMAVE 1 KILO (CX 18 PCT)', category: 'Derivados de Ave', price: 322.81, image: 'https://www.marquesvendaspmg.shop/images/filezinho-sassami-de-frango-congelado-somave-1-kilo-cx-18-pct-pmg-atacadista.jpg' },
  { id: 486, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO TEMPERADOS E EMPANADOS BAITA 1 KILO (CX 10 PCT)', category: 'Derivados de Ave', price: 264.39, image: 'https://www.marquesvendaspmg.shop/images/filezinho-sassami-de-frango-congelado-temperados-e-empanados-baita-1-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 487, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO TEMPERADOS E EMPANADOS LAR 1,5 KILO (CX 4 PCT)', category: 'Derivados de Ave', price: 157.19, image: 'https://www.marquesvendaspmg.shop/images/filezinho-sassami-de-frango-congelado-temperados-e-empanados-lar-15-kilo-cx-4-pct-pmg-atacadista.jpg' },
  { id: 488, name: 'FRANGO A PASSARINHO CONGELADO TEMPERADO ADORO 1 KILO (CX 20 PCT)', category: 'Derivados de Ave', price: 184.05, image: 'https://www.marquesvendaspmg.shop/images/frango-a-passarinho-congelado-temperado-adoro-1-kilo-cx-20-pct-pmg-atacadista.jpg' },
  { id: 489, name: 'FRANGO A PASSARINHO CONGELADO TEMPERADO ITABOM (CX 20 KILO)', category: 'Derivados de Ave', price: 179.14, image: 'https://www.marquesvendaspmg.shop/images/frango-a-passarinho-congelado-temperado-itabom-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 490, name: 'FRANGO INTEIRO CONGELADO ALLIZ 2,5 KILO (CX 20 KILO)', category: 'Derivados de Ave', price: 126.88, image: 'https://www.marquesvendaspmg.shop/images/frango-inteiro-congelado-alliz-25-kilo-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 491, name: 'FRANGO INTEIRO CONGELADO MIRA 2,5 KILO (CX 20 KILO)', category: 'Derivados de Ave', price: 152.15, image: 'https://www.marquesvendaspmg.shop/images/frango-inteiro-congelado-mira-25-kilo-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 492, name: 'FRANGO INTEIRO CONGELADO NUTRIBEM 2,9 KILO (CX 20 KILO)', category: 'Derivados de Ave', price: 184.05, image: 'https://www.marquesvendaspmg.shop/images/frango-inteiro-congelado-nutribem-29-kilo-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 493, name: 'FRANGO SEM MIÚDOS CARCAÇA CONGELADO ALLIZ 1,7 KILO (CX 17 KILO)', category: 'Derivados de Ave', price: 240.12, image: 'https://www.marquesvendaspmg.shop/images/frango-sem-miudos-carcaca-congelado-alliz-17-kilo-cx-17-kilo-pmg-atacadista.jpg' },
  { id: 494, name: 'GEMA DE OVO PASTEURIZADA RESFRIADA ASA 1 KILO', category: 'Derivados de Ave', price: 54.42, image: 'https://www.marquesvendaspmg.shop/images/gema-de-ovo-pasteurizada-resfriada-asa-1-kilo-pmg-atacadista.jpg' },
  { id: 495, name: 'GEMA DE OVO PASTEURIZADA RESFRIADA FLEISCHEGGS 1 KILO', category: 'Derivados de Ave', price: 90.61, image: 'https://www.marquesvendaspmg.shop/images/gema-de-ovo-pasteurizada-resfriada-fleischeggs-1-kilo-pmg-atacadista.jpg' },
  { id: 496, name: 'HAMBÚRGUER DE CARNE DE FRANGO EMPANADO LAR 100 G (CX 30 KILO)', category: 'Derivados de Ave', price: 68.89, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-de-carne-de-frango-empanado-lar-100-g-cx-30-kilo-pmg-atacadista.jpg' },
  { id: 497, name: 'MEIO DAS ASAS DE FRANGO TULIPAS CONGELADAS TEMPERADAS ADORO 1 KILO (CX 20 PCT)', category: 'Derivados de Ave', price: 318.24, image: 'https://www.marquesvendaspmg.shop/images/meio-das-asas-de-frango-tulipas-congeladas-temperadas-adoro-1-kilo-cx-20-pct-pmg-atacadista.jpg' },
  { id: 498, name: 'MEIO DAS ASAS DE FRANGO TULIPAS CONGELADAS TEMPERADAS FRANGÃO FOODS (CX 20 KILO)', category: 'Derivados de Ave', price: 284.66, image: 'https://www.marquesvendaspmg.shop/images/meio-das-asas-de-frango-tulipas-congeladas-temperadas-frangao-foods-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 499, name: 'MEIO DAS ASAS DE FRANGO TULIPAS CONGELADAS TEMPERADAS ITABOM (CX 20 KILO)', category: 'Derivados de Ave', price: 386.78, image: 'https://www.marquesvendaspmg.shop/images/meio-das-asas-de-frango-tulipas-congeladas-temperadas-itabom-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 500, name: 'OVO INTEGRAL PASTEURIZADO RESFRIADO ASA 1 KILO', category: 'Derivados de Ave', price: 26.39, image: 'https://www.marquesvendaspmg.shop/images/ovo-integral-pasteurizado-resfriado-asa-1-kilo-pmg-atacadista.jpg' },
  { id: 501, name: 'OVO INTEGRAL PASTEURIZADO RESFRIADO FLEISCHEGGS 1 KILO', category: 'Derivados de Ave', price: 33.41, image: 'https://www.marquesvendaspmg.shop/images/ovo-integral-pasteurizado-resfriado-fleischeggs-1-kilo-pmg-atacadista.jpg' },
  { id: 502, name: 'OVOS BRANCOS TIPO GRANDE MODELO 60 UN (CX 2 BDJ)', category: 'Derivados de Ave', price: 51.18, image: 'https://www.marquesvendaspmg.shop/images/ovos-brancos-tipo-grande-modelo-60-un-cx-2-bdj-pmg-atacadista.jpg' },
  { id: 503, name: 'OVOS DE CODORNA GRANJA SÃO PAULO 1 KILO', category: 'Derivados de Ave', price: 27.7, image: 'https://www.marquesvendaspmg.shop/images/ovos-de-codorna-granja-sao-paulo-1-kilo-pmg-atacadista.jpg' },
  { id: 504, name: 'OVOS DE CODORNA LOUREIRO 900 G', category: 'Derivados de Ave', price: 27.84, image: 'https://www.marquesvendaspmg.shop/images/ovos-de-codorna-loureiro-900-g-pmg-atacadista.jpg' },
  { id: 505, name: 'PEITO DE FRANGO CONGELADO COM OSSO MIRA (CX 20 KILO)', category: 'Derivados de Ave', price: 225.77, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-congelado-com-osso-mira-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 506, name: 'PEITO DE FRANGO CONGELADO COM OSSO NUTRIBEM (CX 20 KILO)', category: 'Derivados de Ave', price: 247.85, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-congelado-com-osso-nutribem-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 507, name: 'PEITO DE FRANGO CONGELADO COZIDO DESFIADO ALFAMA 1 KILO (CX 6 PCT)', category: 'Derivados de Ave', price: 209.82, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-congelado-cozido-desfiado-alfama-1-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 508, name: 'PEITO DE FRANGO DEFUMADO SEM OSSO CERATTI 2,3 KILO', category: 'Derivados de Ave', price: 82.66, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-defumado-sem-osso-ceratti-23-kilo-pmg-atacadista.jpg' },
  { id: 509, name: 'PEITO DE PERU REZENDE 2,5 KILO', category: 'Derivados de Ave', price: 50.23, image: 'https://www.marquesvendaspmg.shop/images/peito-de-peru-rezende-25-kilo-pmg-atacadista.jpg' },
  { id: 510, name: 'PEITO DE PERU SADIA 2,5 KILO', category: 'Derivados de Ave', price: 61.7, image: 'https://www.marquesvendaspmg.shop/images/peito-de-peru-sadia-25-kilo-pmg-atacadista.jpg' },
  { id: 511, name: 'PEITO DE PERU SEARA 2,5 KILO', category: 'Derivados de Ave', price: 55.28, image: 'https://www.marquesvendaspmg.shop/images/peito-de-peru-seara-25-kilo-pmg-atacadista.jpg' },
  { id: 512, name: 'SOBRECOXAS DE FRANGO CONGELADAS COM OSSO ADORO (CX 20 KILO)', category: 'Derivados de Ave', price: 211.04, image: 'https://www.marquesvendaspmg.shop/images/sobrecoxas-de-frango-congeladas-com-osso-adoro-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 513, name: 'SOBRECOXAS DE FRANGO CONGELADAS COM OSSO INTERFOLHADAS ALLIZ (CX 20 KILO)', category: 'Derivados de Ave', price: 212.98, image: 'https://www.marquesvendaspmg.shop/images/sobrecoxas-de-frango-congeladas-com-osso-interfolhadas-alliz-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 514, name: 'SOBRECOXAS DE FRANGO CONGELADAS COM OSSO INTERFOLHADAS CANÇÃO (CX 18 KILO)', category: 'Derivados de Ave', price: 159.02, image: 'https://www.marquesvendaspmg.shop/images/sobrecoxas-de-frango-congeladas-com-osso-interfolhadas-cancao-cx-18-kilo-pmg-atacadista.jpg' },
  { id: 515, name: 'SOBRECOXAS DE FRANGO CONGELADAS COM OSSO RICO (CX 20 KILO)', category: 'Derivados de Ave', price: 176.69, image: 'https://www.marquesvendaspmg.shop/images/sobrecoxas-de-frango-congeladas-com-osso-rico-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 516, name: 'STEAK DE FRANGO CONGELADO REZENDE 100 G (CX 72 UN)', category: 'Derivados de Ave', price: 121.54, image: 'https://www.marquesvendaspmg.shop/images/steak-de-frango-congelado-rezende-100-g-cx-72-un-pmg-atacadista.jpg' },
  { id: 517, name: 'ACÉM BOVINO RESFRIADO BOI BRASIL 9 KG', category: 'Derivados de Bovino', price: 36.31, image: 'https://www.marquesvendaspmg.shop/images/acem-bovino-resfriado-boi-brasil-9-kg-pmg-atacadista.jpg' },
  { id: 518, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 519, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 520, name: 'ALCATRA COM MAMINHA BOVINA RESFRIADA BOI BRASIL 5 KG', category: 'Derivados de Bovino', price: 39.27, image: 'https://www.marquesvendaspmg.shop/images/alcatra-com-maminha-bovina-resfriada-boi-brasil-5-kg-pmg-atacadista.jpg' },
  { id: 521, name: 'ALCATRA COM MAMINHA BOVINA RESFRIADA NOSSO BEEF FRIGO NOSSO 6 KG', category: 'Derivados de Bovino', price: 38.89, image: 'https://www.marquesvendaspmg.shop/images/alcatra-com-maminha-bovina-resfriada-nosso-beef-frigo-nosso-6-kg-pmg-atacadista.jpg' },
  { id: 522, name: 'ALMÔNDEGA AVES E BOVINA CONGELADA BRASA 1 KG', category: 'Derivados de Bovino', price: 22.44, image: 'https://www.marquesvendaspmg.shop/images/almondega-aves-e-bovina-congelada-brasa-1-kg-pmg-atacadista.jpg' },
  { id: 523, name: 'ALMÔNDEGA BOVINA ANGUS CONGELADA BRASA 500 G', category: 'Derivados de Bovino', price: 18.7, image: 'https://www.marquesvendaspmg.shop/images/almondega-bovina-angus-congelada-brasa-500-g-pmg-atacadista.jpg' },
  { id: 524, name: 'ARANHA DA ALCATRA BOVINA CONGELADA BOI BRASIL 2 KG', category: 'Derivados de Bovino', price: 30.16, image: 'https://www.marquesvendaspmg.shop/images/aranha-da-alcatra-bovina-congelada-boi-brasil-2-kg-pmg-atacadista.jpg' },
  { id: 525, name: 'ARANHA DA ALCATRA BOVINA CONGELADA TODA HORA PLENA 1.5 KG', category: 'Derivados de Bovino', price: 33.1, image: 'https://www.marquesvendaspmg.shop/images/aranha-da-alcatra-bovina-congelada-toda-hora-plena-15-kg-pmg-atacadista.jpg' },
  { id: 526, name: 'CAPA DE FILÉ BOVINA RESFRIADA NOSSO BEEF FRIGO NOSSO 2 KG', category: 'Derivados de Bovino', price: 29.49, image: 'https://www.marquesvendaspmg.shop/images/capa-de-file-bovina-resfriada-nosso-beef-frigo-nosso-2-kg-pmg-atacadista.jpg' },
  { id: 527, name: 'CARNE DE SOL BOVINA CONGELADA DESFIADA ALFAMA 1 KG', category: 'Derivados de Bovino', price: 54.83, image: 'https://www.marquesvendaspmg.shop/images/carne-de-sol-bovina-congelada-desfiada-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 528, name: 'CARNE MOÍDA BOVINA CONGELADA ACÉM BOI FORTE 1 KG', category: 'Derivados de Bovino', price: 19, image: 'https://www.marquesvendaspmg.shop/images/carne-moida-bovina-congelada-acem-boi-forte-1-kg-pmg-atacadista.jpg' },
  { id: 529, name: 'CARNE MOÍDA BOVINA CONGELADA ALFAMA 1 KG', category: 'Derivados de Bovino', price: 28.83, image: 'https://www.marquesvendaspmg.shop/images/carne-moida-bovina-congelada-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 530, name: 'CARNE MOÍDA BOVINA CONGELADA ALFAMA 2,5 KILO', category: 'Derivados de Bovino', price: 70.88, image: 'https://www.marquesvendaspmg.shop/images/carne-moida-bovina-congelada-alfama-25-kilo-pmg-atacadista.jpg' },
  { id: 531, name: 'CARNE MOÍDA BOVINA CONGELADA PATINHO BOI FORTE 1 KG', category: 'Derivados de Bovino', price: 20.16, image: 'https://www.marquesvendaspmg.shop/images/carne-moida-bovina-congelada-patinho-boi-forte-1-kg-pmg-atacadista.jpg' },
  { id: 532, name: 'CARNE MOÍDA BOVINA CONGELADA PATINHO MESTRO 1 KG', category: 'Derivados de Bovino', price: 19.47, image: 'https://www.marquesvendaspmg.shop/images/carne-moida-bovina-congelada-patinho-mestro-1-kg-pmg-atacadista.jpg' },
  { id: 533, name: 'CARNE SECA BOVINA CONGELADA DESFIADA ALFAMA 1 KG', category: 'Derivados de Bovino', price: 61.34, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-congelada-desfiada-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 534, name: 'CARNE SECA BOVINA DESFIADA REFOGADA TEMPERADA RG 300 G', category: 'Derivados de Bovino', price: 32.4, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-desfiada-refogada-temperada-rg-300-g-pmg-atacadista.jpg' },
  { id: 535, name: 'CARNE SECA BOVINA DIANTEIRO JORDANÉSIA 1 KG', category: 'Derivados de Bovino', price: 41.02, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-dianteiro-jordanesia-1-kg-pmg-atacadista.jpg' },
  { id: 536, name: 'CARNE SECA BOVINA GRANDE DIANTEIRO JORDANÉSIA 5 KG', category: 'Derivados de Bovino', price: 199.08, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-grande-dianteiro-jordanesia-5-kg-pmg-atacadista.jpg' },
  { id: 537, name: 'CARNE SECA BOVINA GRANDE DIANTEIRO REAL SABOR 5 KG', category: 'Derivados de Bovino', price: 202.1, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-grande-dianteiro-real-sabor-5-kg-pmg-atacadista.jpg' },
  { id: 538, name: 'CARNE SECA BOVINA GRANDE TRASEIRO JORDANÉSIA 5 KG', category: 'Derivados de Bovino', price: 221.4, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-grande-traseiro-jordanesia-5-kg-pmg-atacadista.jpg' },
  { id: 539, name: 'CARNE SECA BOVINA GRANDE TRASEIRO PAULISTINHA 5 KG', category: 'Derivados de Bovino', price: 193.78, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-grande-traseiro-paulistinha-5-kg-pmg-atacadista.jpg' },
  { id: 540, name: 'CARNE SECA BOVINA GRANDE TRASEIRO REAL SABOR 5 KG', category: 'Derivados de Bovino', price: 46.45, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-grande-traseiro-real-sabor-5-kg-pmg-atacadista.jpg' },
  { id: 541, name: 'CARNE SECA BOVINA TRASEIRO REAL SABOR 1 KG', category: 'Derivados de Bovino', price: 44.41, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-traseiro-real-sabor-1-kg-pmg-atacadista.jpg' },
  { id: 542, name: 'CONTRA FILÉ BOVINO RESFRIADO COM NOIX BOI BRASIL 3 KG', category: 'Derivados de Bovino', price: 42.83, image: 'https://www.marquesvendaspmg.shop/images/contra-file-bovino-resfriado-com-noix-boi-brasil-3-kg-pmg-atacadista.jpg' },
  { id: 543, name: 'CONTRA FILÉ BOVINO RESFRIADO COM NOIX GOLD BEEF 3 KG', category: 'Derivados de Bovino', price: 43.25, image: 'https://www.marquesvendaspmg.shop/images/contra-file-bovino-resfriado-com-noix-gold-beef-3-kg-pmg-atacadista.jpg' },
  { id: 544, name: 'CONTRA FILÉ BOVINO RESFRIADO SEM NOIX BOI BRASIL 4 KG', category: 'Derivados de Bovino', price: 45.06, image: 'https://www.marquesvendaspmg.shop/images/contra-file-bovino-resfriado-sem-noix-boi-brasil-4-kg-pmg-atacadista.jpg' },
  { id: 545, name: 'CORDÃO DO FILÉ MIGNON BOVINO CONGELADO BOI BRASIL 3 KG', category: 'Derivados de Bovino', price: 29.56, image: 'https://www.marquesvendaspmg.shop/images/cordao-do-file-mignon-bovino-congelado-boi-brasil-3-kg-pmg-atacadista.jpg' },
  { id: 546, name: 'COSTELA BOVINA CONGELADA DESFIADA ALFAMA 1 KG', category: 'Derivados de Bovino', price: 61.34, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-congelada-desfiada-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 547, name: 'COSTELA BOVINA CONGELADA EM TIRAS COM OSSO FRIGO NOSSO 2 KG', category: 'Derivados de Bovino', price: 18.66, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-congelada-em-tiras-com-osso-frigo-nosso-2-kg-pmg-atacadista.jpg' },
  { id: 548, name: 'COSTELA BOVINA CONGELADA EM TIRAS SERRADA COM OSSO FRIGONOSSA 2.5 KG', category: 'Derivados de Bovino', price: 19.91, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-congelada-em-tiras-serrada-com-osso-frigonossa-25-kg-pmg-atacadista.jpg' },
  { id: 549, name: 'COSTELA BOVINA CONGELADA JANELA COM OSSO GOLD BEEF PRIME GRILL 5 KG', category: 'Derivados de Bovino', price: 23.53, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-congelada-janela-com-osso-gold-beef-prime-grill-5-kg-pmg-atacadista.jpg' },
  { id: 550, name: 'COSTELA BOVINA CONGELADA ROJÃO MINGA COM OSSO FRIGO NOSSO 9 KG', category: 'Derivados de Bovino', price: 21.6, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-congelada-rojao-minga-com-osso-frigo-nosso-9-kg-pmg-atacadista.jpg' },
  { id: 551, name: 'COSTELA BOVINA CONGELADA ROJÃO MINGA COM OSSO PLENA 7 KG', category: 'Derivados de Bovino', price: 21.6, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-congelada-rojao-minga-com-osso-plena-7-kg-pmg-atacadista.jpg' },
  { id: 552, name: 'COXÃO DURO BOVINO RESFRIADO NOSSO BEEF FRIGO NOSSO 5 KG', category: 'Derivados de Bovino', price: 34.99, image: 'https://www.marquesvendaspmg.shop/images/coxao-duro-bovino-resfriado-nosso-beef-frigo-nosso-5-kg-pmg-atacadista.jpg' },
  { id: 553, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 554, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 36.71, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 555, name: 'COXÃO MOLE BOVINO RESFRIADO NOSSO BEEF FRIGO NOSSO 9 KG', category: 'Derivados de Bovino', price: 37.28, image: 'https://www.marquesvendaspmg.shop/images/coxao-mole-bovino-resfriado-nosso-beef-frigo-nosso-9-kg-pmg-atacadista.jpg' },
  { id: 556, name: 'CUPIM BOVINO CONGELADO DESFIADO ALFAMA 1 KG', category: 'Derivados de Bovino', price: 59.71, image: 'https://www.marquesvendaspmg.shop/images/cupim-bovino-congelado-desfiado-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 557, name: 'CUPIM BOVINO CONGELADO TIPO B FRIGO NOSSO 8.5 KG', category: 'Derivados de Bovino', price: 30.16, image: 'https://www.marquesvendaspmg.shop/images/cupim-bovino-congelado-tipo-b-frigo-nosso-85-kg-pmg-atacadista.jpg' },
  { id: 558, name: 'CUPIM BOVINO CONGELADO TIPO B MONDELLI 5 KG', category: 'Derivados de Bovino', price: 39.82, image: 'https://www.marquesvendaspmg.shop/images/cupim-bovino-congelado-tipo-b-mondelli-5-kg-pmg-atacadista.jpg' },
  { id: 559, name: 'CUPIM BOVINO CONGELADO TIPO B PLENA 4 KG', category: 'Derivados de Bovino', price: 40.64, image: 'https://www.marquesvendaspmg.shop/images/cupim-bovino-congelado-tipo-b-plena-4-kg-pmg-atacadista.jpg' },
  { id: 560, name: 'FÍGADO BOVINO CONGELADO FRIGO NOSSO 4.5 KG', category: 'Derivados de Bovino', price: 9.65, image: 'https://www.marquesvendaspmg.shop/images/figado-bovino-congelado-frigo-nosso-45-kg-pmg-atacadista.jpg' },
  { id: 561, name: 'FILÉ MIGNON BOVINO RESFRIADO "3 / 4" SEM CORDÃO FRIGORAÇA 1.5 KG', category: 'Derivados de Bovino', price: 76.2, image: 'https://www.marquesvendaspmg.shop/images/file-mignon-bovino-resfriado-3-4-sem-cordao-frigoraca-15-kg-pmg-atacadista.jpg' },
  { id: 562, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 8.43, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 563, name: 'FILÉ MIGNON BOVINO RESFRIADO "4 / 5" SEM CORDÃO NOSSO GRILL FRIGO NOSSO 2 KG', category: 'Derivados de Bovino', price: 77.28, image: 'https://www.marquesvendaspmg.shop/images/file-mignon-bovino-resfriado-4-5-sem-cordao-nosso-grill-frigo-nosso-2-kg-pmg-atacadista.jpg' },
  { id: 564, name: 'FRALDINHA BOVINA RESFRIADA BOI BRASIL 1.2 KG', category: 'Derivados de Bovino', price: 35.08, image: 'https://www.marquesvendaspmg.shop/images/fraldinha-bovina-resfriada-boi-brasil-12-kg-pmg-atacadista.jpg' },
  { id: 565, name: 'HAMBÚRGUER DE CARNE BOVINA COSTELA MATURATTA FRIBOI 180 G (CX 18 UN)', category: 'Derivados de Bovino', price: 117.79, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-de-carne-bovina-costela-maturatta-friboi-180-g-cx-18-un-pmg-atacadista.jpg' },
  { id: 566, name: 'HAMBÚRGUER DE CARNE BOVINA FRALDINHA MATURATTA FRIBOI 180 G (CX 18 UN)', category: 'Derivados de Bovino', price: 117.79, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-de-carne-bovina-fraldinha-maturatta-friboi-180-g-cx-18-un-pmg-atacadista.jpg' },
  { id: 567, name: 'HAMBÚRGUER DE CARNE BOVINA MISTER BEEF 100 G (CX 32 UN)', category: 'Derivados de Bovino', price: 100.79, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-de-carne-bovina-mister-beef-100-g-cx-32-un-pmg-atacadista.jpg' },
  { id: 568, name: 'HAMBÚRGUER DE CARNE BOVINA PICANHA MATURATTA FRIBOI 180 G (CX 18 UN)', category: 'Derivados de Bovino', price: 117.79, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-de-carne-bovina-picanha-maturatta-friboi-180-g-cx-18-un-pmg-atacadista.jpg' },
  { id: 569, name: 'HAMBÚRGUER DE CARNE BOVINA SABOR PICANHA MISTER BEEF 120 G (CX 20 UN)', category: 'Derivados de Bovino', price: 78.24, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-de-carne-bovina-sabor-picanha-mister-beef-120-g-cx-20-un-pmg-atacadista.jpg' },
  { id: 570, name: 'HAMBÚRGUER DE CARNE DE FRANGO E CARNE SUÍNA REZENDE 56 G (CX 36 UN)', category: 'Derivados de Bovino', price: 37.99, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-de-carne-de-frango-e-carne-suina-rezende-56-g-cx-36-un-pmg-atacadista.jpg' },
  { id: 571, name: 'HAMBÚRGUER DE PROTEÍNA VEGETAL SABOR CARNE INCRÍVEL 113 G (CX 24 UN)', category: 'Derivados de Bovino', price: 167.36, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-de-proteina-vegetal-sabor-carne-incrivel-113-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 572, name: 'HAMBÚRGUER GRANDE DE CARNE BOVINA ANGUS BRASA BURGUERS 120 G (CX 30 UN)', category: 'Derivados de Bovino', price: 65.26, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-grande-de-carne-bovina-angus-brasa-burguers-120-g-cx-30-un-pmg-atacadista.jpg' },
  { id: 573, name: 'HAMBÚRGUER GRANDE DE CARNE BOVINA E AVES SABOR PICANHA BRASA BURGUERS 120 G (CX 30 UN)', category: 'Derivados de Bovino/Aves', price: 78.05, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-grande-de-carne-bovina-e-aves-sabor-picanha-brasa-burguers-120-g-cx-30-un-pmg-atacadista.jpg' },
  { id: 574, name: 'HAMBÚRGUER GRANDE DE CARNE BOVINA E AVES TRADICIONAL BRASA BURGUERS 120 G (CX 30 UN)', category: 'Derivados de Bovino/Aves', price: 35.26, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-grande-de-carne-bovina-e-aves-tradicional-brasa-burguers-120-g-cx-30-un-pmg-atacadista.jpg' },
  { id: 575, name: 'HAMBÚRGUER GRANDE DE CARNE BOVINA GOURMET MISTER BEEF 150 G (CX 20 UN)', category: 'Derivados de Bovino', price: 100.47, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-grande-de-carne-bovina-gourmet-mister-beef-150-g-cx-20-un-pmg-atacadista.jpg' },
  { id: 576, name: 'HAMBÚRGUER MÉDIO DE CARNE BOVINA COSTELA ALFAMA 150 G (CX 24 UN)', category: 'Derivados de Bovino', price: 137.75, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-medio-de-carne-bovina-costela-alfama-150-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 577, name: 'HAMBÚRGUER MÉDIO DE CARNE BOVINA E AVES SABOR PICANHA BRASA BURGUERS 90 G (CX 36 UN)', category: 'Derivados de Bovino/Aves', price: 71.92, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-medio-de-carne-bovina-e-aves-sabor-picanha-brasa-burguers-90-g-cx-36-un-pmg-atacadista.jpg' },
  { id: 578, name: 'HAMBÚRGUER MÉDIO DE CARNE BOVINA E AVES TRADICIONAL BRASA BURGUERS 90 G (CX 36 UN)', category: 'Derivados de Bovino/Aves', price: 68.52, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-medio-de-carne-bovina-e-aves-tradicional-brasa-burguers-90-g-cx-36-un-pmg-atacadista.jpg' },
  { id: 579, name: 'HAMBÚRGUER MÉDIO DE CARNE BOVINA SABOR CHURRASCO BRASA BURGUERS 90 G (CX 36 UN)', category: 'Derivados de Bovino', price: 36.54, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-medio-de-carne-bovina-sabor-churrasco-brasa-burguers-90-g-cx-36-un-pmg-atacadista.jpg' },
  { id: 580, name: 'HAMBÚRGUER MÉDIO DE CARNE DE AVES E BOVINA COM SOJA MISTER BEEF 90 G (CX 36 UN)', category: 'Derivados de Bovino', price: 60.07, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-medio-de-carne-de-aves-e-bovina-com-soja-mister-beef-90-g-cx-36-un-pmg-atacadista.jpg' },
  { id: 581, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 64.73, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 582, name: 'HAMBÚRGUER MÉDIO DE CARNE DE FRANGO E CARNE BOVINA TEXAS BURGUER SEARA 90 G (CX 36 UN)', category: 'Derivados de Bovino', price: 61.71, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-medio-de-carne-de-frango-e-carne-bovina-texas-burguer-seara-90-g-cx-36-un-pmg-atacadista.jpg' },
  { id: 583, name: 'HAMBÚRGUER PEQUENO DE CARNE BOVINA E AVES TRADICIONAL BRASA BURGUERS 56 G (CX 36 UN)', category: 'Derivados de Bovino/Aves', price: 89.47, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-pequeno-de-carne-bovina-e-aves-tradicional-brasa-burguers-56-g-cx-36-un-pmg-atacadista.jpg' },
  { id: 584, name: 'HAMBÚRGUER PEQUENO DE CARNE BOVINA SMASH MISTER BEEF 75 G (CX 36 UN)', category: 'Derivados de Bovino', price: 93.41, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-pequeno-de-carne-bovina-smash-mister-beef-75-g-cx-36-un-pmg-atacadista.jpg' },
  { id: 585, name: 'HAMBÚRGUER PEQUENO DE CARNE DE AVES E BOVINA COM SOJA MISTER BEEF 56 G (CX 36 UN)', category: 'Derivados de Bovino', price: 30.97, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-pequeno-de-carne-de-aves-e-bovina-com-soja-mister-beef-56-g-cx-36-un-pmg-atacadista.jpg' },
  { id: 586, name: 'HAMBÚRGUER PEQUENO DE CARNE DE FRANGO CARNE SUÍNA E CARNE BOVINA FAROESTE BURGER AURORA 56 G (CX 36 UN)', category: 'Derivados de Bovino', price: 47.3, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-pequeno-de-carne-de-frango-carne-suina-e-carne-bovina-faroeste-burger-aurora-56-g-cx-36-u-pmg-atacadista.jpg' },
  { id: 587, name: 'HAMBÚRGUER PEQUENO DE CARNE DE FRANGO E CARNE BOVINA TEXAS BURGUER SEARA 56 G (CX 36 UN)', category: 'Derivados de Bovino', price: 40.85, image: 'https://www.marquesvendaspmg.shop/images/hamburguer-pequeno-de-carne-de-frango-e-carne-bovina-texas-burguer-seara-56-g-cx-36-un-pmg-atacadista.jpg' },
  { id: 588, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 93.41, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 589, name: 'LAGARTO BOVINO RESFRIADO NOSSO BEEF FRIGO NOSSO 2 KG', category: 'Derivados de Bovino', price: 38.61, image: 'https://www.marquesvendaspmg.shop/images/lagarto-bovino-resfriado-nosso-beef-frigo-nosso-2-kg-pmg-atacadista.jpg' },
  { id: 590, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 591, name: 'MAMINHA DA ALCATRA BOVINA RESFRIADA JORDANÉSIA 1.2 KG', category: 'Derivados de Bovino', price: 38.61, image: 'https://www.marquesvendaspmg.shop/images/maminha-da-alcatra-bovina-resfriada-jordanesia-12-kg-pmg-atacadista.jpg' },
  { id: 592, name: 'MIOLO DA ALCATRA BOVINA RESFRIADO JORDANÉSIA 3,5 KG', category: 'Derivados de Bovino', price: 45.11, image: 'https://www.marquesvendaspmg.shop/images/miolo-da-alcatra-bovina-resfriado-jordanesia-35-kg-pmg-atacadista.jpg' },
  { id: 593, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 28.89, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 594, name: 'MÚSCULO DO TRASEIRO BOVINO RESFRIADO SEM OSSO BOI BRASIL 3.5 KG', category: 'Derivados de Bovino', price: 28.35, image: 'https://www.marquesvendaspmg.shop/images/musculo-do-traseiro-bovino-resfriado-sem-osso-boi-brasil-35-kg-pmg-atacadista.jpg' },
  { id: 595, name: 'MÚSCULO DO TRASEIRO BOVINO RESFRIADO SEM OSSO FRIGO NOSSO 3.5 KG', category: 'Derivados de Bovino', price: 27.15, image: 'https://www.marquesvendaspmg.shop/images/musculo-do-traseiro-bovino-resfriado-sem-osso-frigo-nosso-35-kg-pmg-atacadista.jpg' },
  { id: 596, name: 'PALETA BOVINA RESFRIADA SEM OSSO E SEM MÚSCULO BOI BRASIL 9 KG', category: 'Derivados de Bovino', price: 28.83, image: 'https://www.marquesvendaspmg.shop/images/paleta-bovina-resfriada-sem-osso-e-sem-musculo-boi-brasil-9-kg-pmg-atacadista.jpg' },
  { id: 597, name: 'PASTRAMI BOVINO COZIDO E DEFUMADO CERATTI 1,5 KG', category: 'Derivados de Bovino', price: 121.05, image: 'https://www.marquesvendaspmg.shop/images/pastrami-bovino-cozido-e-defumado-ceratti-15-kg-pmg-atacadista.jpg' },
  { id: 598, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 599, name: 'PATINHO BOVINO RESFRIADO BOI BRASIL 5 KG', category: 'Derivados de Bovino', price: 38.49, image: 'https://www.marquesvendaspmg.shop/images/patinho-bovino-resfriado-boi-brasil-5-kg-pmg-atacadista.jpg' },
  { id: 600, name: 'PATINHO BOVINO RESFRIADO JORDANÉSIA 5 KG', category: 'Derivados de Bovino', price: 35.45, image: 'https://www.marquesvendaspmg.shop/images/patinho-bovino-resfriado-jordanesia-5-kg-pmg-atacadista.jpg' },
  { id: 601, name: 'PEITO BOVINO RESFRIADO SEM OSSO FRIGO NOSSO 6,5 KG', category: 'Derivados de Bovino', price: 26.54, image: 'https://www.marquesvendaspmg.shop/images/peito-bovino-resfriado-sem-osso-frigo-nosso-65-kg-pmg-atacadista.jpg' },
  { id: 602, name: 'PICANHA BOVINA RESFRIADA DEFUMADA CERATTI 1 KG', category: 'Derivados de Bovino', price: 200.71, image: 'https://www.marquesvendaspmg.shop/images/picanha-bovina-resfriada-defumada-ceratti-1-kg-pmg-atacadista.jpg' },
  { id: 603, name: 'PICANHA BOVINA RESFRIADA TIPO A BOI BRASIL 1.3 KG', category: 'Derivados de Bovino', price: 64.49, image: 'https://www.marquesvendaspmg.shop/images/picanha-bovina-resfriada-tipo-a-boi-brasil-13-kg-pmg-atacadista.jpg' },
  { id: 604, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 605, name: 'QUEIJO CRISPY BURGER SEARA GOURMET 100 G (CX 26 UN)', category: 'Derivados de Bovino', price: 98.47, image: 'https://www.marquesvendaspmg.shop/images/queijo-crispy-burger-seara-gourmet-100-g-cx-26-un-pmg-atacadista.jpg' },
  { id: 606, name: 'RABO BOVINO CONGELADO BOI BRASIL 2 KG', category: 'Derivados de Bovino', price: 22.92, image: 'https://www.marquesvendaspmg.shop/images/rabo-bovino-congelado-boi-brasil-2-kg-pmg-atacadista.jpg' },
  { id: 607, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 608, name: 'BASE CULINÁRIA LECO 1 KILO (CX 12 UN)', category: 'Derivados de Leite', price: 163.23, image: 'https://www.marquesvendaspmg.shop/images/base-culinaria-leco-1-kilo-cx-12-un-pmg-atacadista.jpg' },
  { id: 609, name: 'CHANTILLY DECOR UP DELUXE 1 L', category: 'Derivados de Leite', price: 20.72, image: 'https://www.marquesvendaspmg.shop/images/chantilly-decor-up-deluxe-1-l-pmg-atacadista.jpg' },
  { id: 610, name: 'CHANTILLY GRAN FINALE 1 L', category: 'Derivados de Leite', price: 28.16, image: 'https://www.marquesvendaspmg.shop/images/chantilly-gran-finale-1-l-pmg-atacadista.jpg' },
  { id: 611, name: 'CHANTILLY SPRAY GRAN FINALE 250 G', category: 'Derivados de Leite', price: 24.96, image: 'https://www.marquesvendaspmg.shop/images/chantilly-spray-gran-finale-250-g-pmg-atacadista.jpg' },
  { id: 612, name: 'CHANTILLY SPRAY POLENGHI 250 G', category: 'Derivados de Leite', price: 28.41, image: 'https://www.marquesvendaspmg.shop/images/chantilly-spray-polenghi-250-g-pmg-atacadista.jpg' },
  { id: 613, name: 'CHANTY MIX AMÉLIA 1 L', category: 'Derivados de Leite', price: 21.25, image: 'https://www.marquesvendaspmg.shop/images/chanty-mix-amelia-1-l-pmg-atacadista.jpg' },
  { id: 614, name: 'CHEDDAR FATIADO PROCESSADO 160 FATIAS POLENGHI "2,27" KILO', category: 'Derivados de Leite', price: 76.68, image: 'https://www.marquesvendaspmg.shop/images/cheddar-fatiado-processado-160-fatias-polenghi-227-kilo-pmg-atacadista.jpg' },
  { id: 615, name: 'CHEDDAR FATIADO PROCESSADO 160 FATIAS VIGOR 2,24 KILO', category: 'Derivados de Leite', price: 89.89, image: 'https://www.marquesvendaspmg.shop/images/cheddar-fatiado-processado-160-fatias-vigor-224-kilo-pmg-atacadista.jpg' },
  { id: 616, name: 'CHEDDAR FATIADO PROCESSADO 184 FATIAS SCHREIBER 2,27 KILO', category: 'Derivados de Leite', price: 91.98, image: 'https://www.marquesvendaspmg.shop/images/cheddar-fatiado-processado-184-fatias-schreiber-227-kilo-pmg-atacadista.jpg' },
  { id: 617, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 618, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 619, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 620, name: 'CREAM CHEESE CATUPIRY 1,2 KILO', category: 'Derivados de Leite', price: 43.28, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-catupiry-12-kilo-pmg-atacadista.jpg' },
  { id: 621, name: 'CREAM CHEESE COROCHEESE CORONATA 1,2 KILO', category: 'Derivados de Leite', price: 31.49, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-corocheese-coronata-12-kilo-pmg-atacadista.jpg' },
  { id: 622, name: 'CREAM CHEESE DANÚBIO 1 KILO', category: 'Derivados de Leite', price: 33.74, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-danubio-1-kilo-pmg-atacadista.jpg' },
  { id: 623, name: 'CREAM CHEESE IPANEMA 1,2 KILO', category: 'Derivados de Leite', price: 35.4, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-ipanema-12-kilo-pmg-atacadista.jpg' },
  { id: 624, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 625, name: 'CREAM CHEESE PEQUENO SCALA 150 G', category: 'Derivados de Leite', price: 7.84, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-pequeno-scala-150-g-pmg-atacadista.jpg' },
  { id: 626, name: 'CREAM CHEESE PHILADELPHIA 3,6 KILO', category: 'Derivados de Leite', price: 144.1, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-philadelphia-36-kilo-pmg-atacadista.jpg' },
  { id: 627, name: 'CREAM CHEESE PHILADELPHIA 1,5 KILO', category: 'Derivados de Leite', price: 61.34, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-philadelphia-15-kilo-pmg-atacadista.jpg' },
  { id: 628, name: 'CREAM CHEESE POLENGHI 3,6 KILO', category: 'Derivados de Leite', price: 36.71, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-polenghi-36-kilo-pmg-atacadista.jpg' },
  { id: 629, name: 'CREAM CHEESE POLENGHI 1 KILO', category: 'Derivados de Leite', price: 35.92, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-polenghi-1-kilo-pmg-atacadista.jpg' },
  { id: 630, name: 'CREAM CHEESE SACHÊ DANÚBIO 18 G (CX 144 UN)', category: 'Derivados de Leite', price: 136.94, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-sache-danubio-18-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 631, name: 'CREAM CHEESE SACHÊ PRESIDENT 18 G (CX 120 UN)', category: 'Derivados de Leite', price: 117.86, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-sache-president-18-g-cx-120-un-pmg-atacadista.jpg' },
  { id: 632, name: 'CREAM CHEESE SCALA 1,2 KILO', category: 'Derivados de Leite', price: 38.52, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-scala-12-kilo-pmg-atacadista.jpg' },
  { id: 633, name: 'CREAM CHEESE SCALA 3,6 KILO', category: 'Derivados de Leite', price: 114.56, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-scala-36-kilo-pmg-atacadista.jpg' },
  { id: 634, name: 'CREAM CHEESE SCALON 1,02 KILO', category: 'Derivados de Leite', price: 28.11, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-scalon-102-kilo-pmg-atacadista.jpg' },
  { id: 635, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 636, name: 'CREAM CHEESE SULMINAS 1,2 KILO', category: 'Derivados de Leite', price: 28.82, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-sulminas-12-kilo-pmg-atacadista.jpg' },
  { id: 637, name: 'CREME CULINÁRIO DAUS 1 KILO (CX 12 UN)', category: 'Derivados de Leite', price: 124.42, image: 'https://www.marquesvendaspmg.shop/images/creme-culinario-daus-1-kilo-cx-12-un-pmg-atacadista.jpg' },
  { id: 638, name: 'CREME DE LEITE GRANDE FOOD SERVICE ITALAC 1,030 KILO (CX 12 UN)', category: 'Derivados de Leite', price: 174.43, image: 'https://www.marquesvendaspmg.shop/images/creme-de-leite-grande-food-service-italac-1030-kilo-cx-12-un-pmg-atacadista.jpg' },
  { id: 639, name: 'CREME DE LEITE GRANDE FOOD SERVICE PIRACANJUBA 1,030 KILO (CX 12 UN)', category: 'Derivados de Leite', price: 215.34, image: 'https://www.marquesvendaspmg.shop/images/creme-de-leite-grande-food-service-piracanjuba-1030-kilo-cx-12-un-pmg-atacadista.jpg' },
  { id: 640, name: 'CREME DE LEITE ITALAC 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 80.64, image: 'https://www.marquesvendaspmg.shop/images/creme-de-leite-italac-200-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 641, name: 'CREME DE LEITE JUSSARA 200 G (CX 27 UN)', category: 'Derivados de Leite', price: 74.43, image: 'https://www.marquesvendaspmg.shop/images/creme-de-leite-jussara-200-g-cx-27-un-pmg-atacadista.jpg' },
  { id: 642, name: 'CREME DE LEITE PASTEURIZADO BIOCREME 1,01 KILO', category: 'Derivados de Leite', price: 30.84, image: 'https://www.marquesvendaspmg.shop/images/creme-de-leite-pasteurizado-biocreme-101-kilo-pmg-atacadista.jpg' },
  { id: 643, name: 'CREME DE LEITE PASTEURIZADO QUATÁ 1,01 KILO', category: 'Derivados de Leite', price: 41.21, image: 'https://www.marquesvendaspmg.shop/images/creme-de-leite-pasteurizado-quata-101-kilo-pmg-atacadista.jpg' },
  { id: 644, name: 'CREME DE LEITE PIRACANJUBA 200 G (CX 27 UN)', category: 'Derivados de Leite', price: 96.73, image: 'https://www.marquesvendaspmg.shop/images/creme-de-leite-piracanjuba-200-g-cx-27-un-pmg-atacadista.jpg' },
  { id: 645, name: 'CREME DE RICOTA TIROLEZ 200 G', category: 'Derivados de Leite', price: 6.71, image: 'https://www.marquesvendaspmg.shop/images/creme-de-ricota-tirolez-200-g-pmg-atacadista.jpg' },
  { id: 646, name: 'DOCE DE LEITE FRIMESA 4,8 KILO', category: 'Derivados de Leite', price: 101.25, image: 'https://www.marquesvendaspmg.shop/images/doce-de-leite-frimesa-48-kilo-pmg-atacadista.jpg' },
  { id: 647, name: 'DOCE DE LEITE LA SERENISSIMA 1 KILO', category: 'Derivados de Leite', price: 39.98, image: 'https://www.marquesvendaspmg.shop/images/doce-de-leite-la-serenissima-1-kilo-pmg-atacadista.jpg' },
  { id: 648, name: 'DOCE DE LEITE NESTLÉ 1,01 KILO', category: 'Derivados de Leite', price: 37.41, image: 'https://www.marquesvendaspmg.shop/images/doce-de-leite-nestle-101-kilo-pmg-atacadista.jpg' },
  { id: 649, name: 'DOCE DE LEITE SABOR DE MINAS 1,5 KILO', category: 'Derivados de Leite', price: 21.32, image: 'https://www.marquesvendaspmg.shop/images/doce-de-leite-sabor-de-minas-15-kilo-pmg-atacadista.jpg' },
  { id: 650, name: 'DOCE DE LEITE TRADICIONAL FRIMESA 400 G', category: 'Derivados de Leite', price: 8.67, image: 'https://www.marquesvendaspmg.shop/images/doce-de-leite-tradicional-frimesa-400-g-pmg-atacadista.jpg' },
  { id: 651, name: 'GORGONZOLA BELLA ITÁLIA 3 KG', category: 'Derivados de Leite', price: 53.17, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-bella-italia-3-kg-pmg-atacadista.jpg' },
  { id: 652, name: 'GORGONZOLA FRACIONADO BELLA ITÁLIA 200 G', category: 'Derivados de Leite', price: 9.72, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-fracionado-bella-italia-200-g-pmg-atacadista.jpg' },
  { id: 653, name: 'GORGONZOLA FRACIONADO QUATÁ 180 G', category: 'Derivados de Leite', price: 12.64, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-fracionado-quata-180-g-pmg-atacadista.jpg' },
  { id: 654, name: 'GORGONZOLA FRACIONADO QUEIJO AZUL SÃO VICENTE 180 G', category: 'Derivados de Leite', price: 11.09, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-fracionado-queijo-azul-sao-vicente-180-g-pmg-atacadista.jpg' },
  { id: 655, name: 'GORGONZOLA FRACIONADO QUEIJO AZUL SCALA 180 G', category: 'Derivados de Leite', price: 15.26, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-fracionado-queijo-azul-scala-180-g-pmg-atacadista.jpg' },
  { id: 656, name: 'GORGONZOLA FRACIONADO QUEIJO AZUL TIROLEZ 200 G', category: 'Derivados de Leite', price: 14.15, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-fracionado-queijo-azul-tirolez-200-g-pmg-atacadista.jpg' },
  { id: 657, name: 'GORGONZOLA FRACIONADO QUEIJO AZUL YEMA 170 G', category: 'Derivados de Leite', price: 12.15, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-fracionado-queijo-azul-yema-170-g-pmg-atacadista.jpg' },
  { id: 658, name: 'GORGONZOLA QUATÁ 3 KG', category: 'Derivados de Leite', price: 52.44, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-quata-3-kg-pmg-atacadista.jpg' },
  { id: 659, name: 'GORGONZOLA QUEIJO AZUL BURITIS 3 KG', category: 'Derivados de Leite', price: 52.78, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-queijo-azul-buritis-3-kg-pmg-atacadista.jpg' },
  { id: 660, name: 'GORGONZOLA QUEIJO AZUL SÃO VICENTE 3 KG', category: 'Derivados de Leite', price: 49.85, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-queijo-azul-sao-vicente-3-kg-pmg-atacadista.jpg' },
  { id: 661, name: 'GORGONZOLA QUEIJO AZUL TIROLEZ 3 KG', category: 'Derivados de Leite', price: 65.86, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-queijo-azul-tirolez-3-kg-pmg-atacadista.jpg' },
  { id: 662, name: 'LEITE CONDENSADO "INTEGRAL" ITALAC 395 G (CX 27 UN)', category: 'Derivados de Leite', price: 220.35, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-integral-italac-395-g-cx-27-un-pmg-atacadista.jpg' },
  { id: 663, name: 'LEITE CONDENSADO GRANDE INTEGRAL MOÇA NESTLÉ 2,6 KILO', category: 'Derivados de Leite', price: 67.79, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-grande-integral-moca-nestle-26-kilo-pmg-atacadista.jpg' },
  { id: 664, name: 'LEITE CONDENSADO GRANDE INTEGRAL MOCOCA 5 KILO', category: 'Derivados de Leite', price: 86.53, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-grande-integral-mococa-5-kilo-pmg-atacadista.jpg' },
  { id: 665, name: 'LEITE CONDENSADO INTEGRAL MOCOCA 2,5 KILO', category: 'Derivados de Leite', price: 42.33, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-integral-mococa-25-kilo-pmg-atacadista.jpg' },
  { id: 666, name: 'LEITE CONDENSADO MÉDIO "SEMIDESNATADO" ITALAC 395 G (CX 27 UN)', category: 'Derivados de Leite', price: 188.19, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-medio-semidesnatado-italac-395-g-cx-27-un-pmg-atacadista.jpg' },
  { id: 667, name: 'LEITE CONDENSADO PEQUENO INTEGRAL MOÇA NESTLÉ 395 G', category: 'Derivados de Leite', price: 10.62, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-pequeno-integral-moca-nestle-395-g-pmg-atacadista.jpg' },
  { id: 668, name: 'LEITE CONDENSADO PEQUENO INTEGRAL MOCOCA 395 G (CX 27 UN)', category: 'Derivados de Leite', price: 214.5, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-pequeno-integral-mococa-395-g-cx-27-un-pmg-atacadista.jpg' },
  { id: 669, name: 'LEITE CONDENSADO PEQUENO SEMIDESNATADO ITALAC 270 G (CX 24 UN)', category: 'Derivados de Leite', price: 121.24, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-pequeno-semidesnatado-italac-270-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 670, name: 'LEITE CONDENSADO PEQUENO SEMIDESNATADO PIRACANJUBA 270 G (CX 27 UN)', category: 'Derivados de Leite', price: 141.65, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-pequeno-semidesnatado-piracanjuba-270-g-cx-27-un-pmg-atacadista.jpg' },
  { id: 671, name: 'LEITE CONDENSADO SEMIDESNATADO FOOD SERVICE ITALAC 2,5 KILO', category: 'Derivados de Leite', price: 39.95, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-semidesnatado-food-service-italac-25-kilo-pmg-atacadista.jpg' },
  { id: 672, name: 'LEITE CONDENSADO SEMIDESNATADO FOOD SERVICE PIRACANJUBA 2,5 KILO', category: 'Derivados de Leite', price: 36.02, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-semidesnatado-food-service-piracanjuba-25-kilo-pmg-atacadista.jpg' },
  { id: 673, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 674, name: 'LEITE DESNATADO JUSSARA 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 60.45, image: 'https://www.marquesvendaspmg.shop/images/leite-desnatado-jussara-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 675, name: 'LEITE EM PÓ DESNATADO INSTANTÂNEO LA SERENISSIMA 300 G', category: 'Derivados de Leite', price: 12.94, image: 'https://www.marquesvendaspmg.shop/images/leite-em-po-desnatado-instantaneo-la-serenissima-300-g-pmg-atacadista.jpg' },
  { id: 676, name: 'LEITE EM PÓ INTEGRAL ITALAC 400 G', category: 'Derivados de Leite', price: 15.76, image: 'https://www.marquesvendaspmg.shop/images/leite-em-po-integral-italac-400-g-pmg-atacadista.jpg' },
  { id: 677, name: 'LEITE EM PÓ INTEGRAL JUSSARA 400 G', category: 'Derivados de Leite', price: 15.23, image: 'https://www.marquesvendaspmg.shop/images/leite-em-po-integral-jussara-400-g-pmg-atacadista.jpg' },
  { id: 678, name: 'LEITE EM PÓ INTEGRAL LA SERENISSIMA 400 G', category: 'Derivados de Leite', price: 16.28, image: 'https://www.marquesvendaspmg.shop/images/leite-em-po-integral-la-serenissima-400-g-pmg-atacadista.jpg' },
  { id: 679, name: 'LEITE EM PÓ INTEGRAL PIRACANJUBA 400 G', category: 'Derivados de Leite', price: 15.27, image: 'https://www.marquesvendaspmg.shop/images/leite-em-po-integral-piracanjuba-400-g-pmg-atacadista.jpg' },
  { id: 680, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 681, name: 'LEITE INTEGRAL ITALAC 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 61.95, image: 'https://www.marquesvendaspmg.shop/images/leite-integral-italac-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 682, name: 'LEITE INTEGRAL JUSSARA 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 61.95, image: 'https://www.marquesvendaspmg.shop/images/leite-integral-jussara-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 683, name: 'LEITE INTEGRAL QUATÁ 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 68.6, image: 'https://www.marquesvendaspmg.shop/images/leite-integral-quata-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 684, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 685, name: 'LEITE INTEGRAL ZERO LACTOSE ITALAC 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 80.85, image: 'https://www.marquesvendaspmg.shop/images/leite-integral-zero-lactose-italac-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 686, name: 'LEITE SEMIDESNATADO ITALAC 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 70.27, image: 'https://www.marquesvendaspmg.shop/images/leite-semidesnatado-italac-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 687, name: 'LEITE SEMIDESNATADO ZERO LACTOSE JUSSARA 1 L', category: 'Derivados de Leite', price: 37.02, image: 'https://www.marquesvendaspmg.shop/images/leite-semidesnatado-zero-lactose-jussara-1-l-pmg-atacadista.jpg' },
  { id: 688, name: 'MANTEIGA COM SAL COYOTE (CX 5 KILO)', category: 'Derivados de Leite', price: 89.47, image: 'https://www.marquesvendaspmg.shop/images/manteiga-com-sal-coyote-cx-5-kilo-pmg-atacadista.jpg' },
  { id: 689, name: 'MANTEIGA COM SAL ITALAC 500 G', category: 'Derivados de Leite', price: 26.42, image: 'https://www.marquesvendaspmg.shop/images/manteiga-com-sal-italac-500-g-pmg-atacadista.jpg' },
  { id: 690, name: 'MANTEIGA COM SAL TRÊS MARIAS 10 KILO', category: 'Derivados de Leite', price: 383.44, image: 'https://www.marquesvendaspmg.shop/images/manteiga-com-sal-tres-marias-10-kilo-pmg-atacadista.jpg' },
  { id: 691, name: 'MANTEIGA PEQUENA "EXTRA" SEM SAL LA SERENISSIMA 200 G (CX 10 UN)', category: 'Derivados de Leite', price: 124.3, image: 'https://www.marquesvendaspmg.shop/images/manteiga-pequena-extra-sem-sal-la-serenissima-200-g-cx-10-un-pmg-atacadista.jpg' },
  { id: 692, name: 'MANTEIGA PEQUENA COM SAL CRIOULO 200 G (CX 20 UN)', category: 'Derivados de Leite', price: 95.7, image: 'https://www.marquesvendaspmg.shop/images/manteiga-pequena-com-sal-crioulo-200-g-cx-20-un-pmg-atacadista.jpg' },
  { id: 693, name: 'MANTEIGA PEQUENA COM SAL TIROLEZ 200 G (CX 12 UN)', category: 'Derivados de Leite', price: 158.44, image: 'https://www.marquesvendaspmg.shop/images/manteiga-pequena-com-sal-tirolez-200-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 694, name: 'MANTEIGA PEQUENA SEM SAL TIROLEZ 200 G (CX 12 UN)', category: 'Derivados de Leite', price: 158.44, image: 'https://www.marquesvendaspmg.shop/images/manteiga-pequena-sem-sal-tirolez-200-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 695, name: 'MANTEIGA SACHÊ COM SAL BOM SABOR 10 G  (CX 144 UN)', category: 'Derivados de Leite', price: 31.61, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sache-com-sal-bom-sabor-10-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 696, name: 'MANTEIGA SACHÊ COM SAL PRESIDENT 10 G (CX 192 UN)', category: 'Derivados de Leite', price: 124.86, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sache-com-sal-president-10-g-cx-192-un-pmg-atacadista.jpg' },
  { id: 697, name: 'MANTEIGA SACHÊ COM SAL VIGOR 10 G (CX 192 UN)', category: 'Derivados de Leite', price: 124.7, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sache-com-sal-vigor-10-g-cx-192-un-pmg-atacadista.jpg' },
  { id: 698, name: 'MANTEIGA SACHÊ SEM SAL PRESIDENT 10 G (CX 192 UN)', category: 'Derivados de Leite', price: 124.86, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sache-sem-sal-president-10-g-cx-192-un-pmg-atacadista.jpg' },
  { id: 699, name: 'MANTEIGA SACHÊ SEM SAL VIGOR 10 G (CX 192 UN)', category: 'Derivados de Leite', price: 124.7, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sache-sem-sal-vigor-10-g-cx-192-un-pmg-atacadista.jpg' },
  { id: 700, name: 'MANTEIGA SEM SAL BLEND PASSA QUATRO (CX 5 KILO)', category: 'Derivados de Leite', price: 105.45, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sem-sal-blend-passa-quatro-cx-5-kilo-pmg-atacadista.jpg' },
  { id: 701, name: 'MANTEIGA SEM SAL COYOTE (CX 5 KILO)', category: 'Derivados de Leite', price: 83.08, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sem-sal-coyote-cx-5-kilo-pmg-atacadista.jpg' },
  { id: 702, name: 'MANTEIGA SEM SAL DE PRIMEIRA FRIZZO (CX 5 KILO)', category: 'Derivados de Leite', price: 108.64, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sem-sal-de-primeira-frizzo-cx-5-kilo-pmg-atacadista.jpg' },
  { id: 703, name: 'MANTEIGA SEM SAL QUATRELATI (CX 5 KILO)', category: 'Derivados de Leite', price: 158.19, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sem-sal-quatrelati-cx-5-kilo-pmg-atacadista.jpg' },
  { id: 704, name: 'MANTEIGA SEM SAL SCALA (CX 5 KILO)', category: 'Derivados de Leite', price: 247.96, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sem-sal-scala-cx-5-kilo-pmg-atacadista.jpg' },
  { id: 705, name: 'MANTEIGA SEM SAL TIROLEZ (CX 5 KILO)', category: 'Derivados de Leite', price: 249.17, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sem-sal-tirolez-cx-5-kilo-pmg-atacadista.jpg' },
  { id: 706, name: 'MANTEIGA SEM SAL TRÊS MARIAS (CX 5 KILO)', category: 'Derivados de Leite', price: 153.38, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sem-sal-tres-marias-cx-5-kilo-pmg-atacadista.jpg' },
  { id: 707, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR CORONATA 1,5 KILO', category: 'Derivados de Leite', price: 31.49, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-coronata-15-kilo-pmg-atacadista.jpg' },
  { id: 708, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR DALLORA 1,8 KILO', category: 'Derivados de Leite', price: 25.34, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-dallora-18-kilo-pmg-atacadista.jpg' },
  { id: 709, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR PARMATO 1,2 KILO', category: 'Derivados de Leite', price: 22.32, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-parmato-12-kilo-pmg-atacadista.jpg' },
  { id: 710, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR PURANATA 1,2 KILO', category: 'Derivados de Leite', price: 12.42, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-puranata-12-kilo-pmg-atacadista.jpg' },
  { id: 711, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR ROSELI 1,2 KILO', category: 'Derivados de Leite', price: 13.57, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-roseli-12-kilo-pmg-atacadista.jpg' },
  { id: 712, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR TOP CHEDDAR 1,2 KILO', category: 'Derivados de Leite', price: 11.94, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-top-cheddar-12-kilo-pmg-atacadista.jpg' },
  { id: 713, name: 'MISTURA LÁCTEA CONDENSADA PEQUENA MOCOCA 395 G (CX 27 UN)', category: 'Derivados de Leite', price: 110.59, image: 'https://www.marquesvendaspmg.shop/images/mistura-lactea-condensada-pequena-mococa-395-g-cx-27-un-pmg-atacadista.jpg' },
  { id: 714, name: 'MISTURA LÁCTEA CREME DE LEITE MOCOCA 200 G  (CX 27 UN)', category: 'Derivados de Leite', price: 67.56, image: 'https://www.marquesvendaspmg.shop/images/mistura-lactea-creme-de-leite-mococa-200-g-cx-27-un-pmg-atacadista.jpg' },
  { id: 715, name: 'MUÇARELA ALTO DO VALE 4 KG', category: 'Derivados de Leite', price: 26.45, image: 'https://www.marquesvendaspmg.shop/images/mucarela-alto-do-vale-4-kg-pmg-atacadista.jpg' },
  { id: 716, name: 'MUÇARELA ANITA 4 KG', category: 'Derivados de Leite', price: 30.68, image: 'https://www.marquesvendaspmg.shop/images/mucarela-anita-4-kg-pmg-atacadista.jpg' },
  { id: 717, name: 'MUÇARELA APOLO 4 KG', category: 'Derivados de Leite', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/mucarela-apolo-4-kg-pmg-atacadista.jpg' },
  { id: 718, name: 'MUÇARELA BACIO 4 KG', category: 'Derivados de Leite', price: 37.36, image: 'https://www.marquesvendaspmg.shop/images/mucarela-bacio-4-kg-pmg-atacadista.jpg' },
  { id: 719, name: 'MUÇARELA BARI 4 KG', category: 'Derivados de Leite', price: 27.63, image: 'https://www.marquesvendaspmg.shop/images/mucarela-bari-4-kg-pmg-atacadista.jpg' },
  { id: 720, name: 'MUÇARELA BOCCATELLE CORONATA 360 G', category: 'Derivados de Leite', price: 21.6, image: 'https://www.marquesvendaspmg.shop/images/mucarela-boccatelle-coronata-360-g-pmg-atacadista.jpg' },
  { id: 721, name: 'MUÇARELA BONÍSSIMO 4 KG', category: 'Derivados de Leite', price: 27.05, image: 'https://www.marquesvendaspmg.shop/images/mucarela-bonissimo-4-kg-pmg-atacadista.jpg' },
  { id: 722, name: 'MUÇARELA CLÁSSICA 4 KG', category: 'Derivados de Leite', price: 32.64, image: 'https://www.marquesvendaspmg.shop/images/mucarela-classica-4-kg-pmg-atacadista.jpg' },
  { id: 723, name: 'MUÇARELA COBERTURA PARA PIZZA MOZZALET 2 KG', category: 'Derivados de Leite', price: 46.52, image: 'https://www.marquesvendaspmg.shop/images/mucarela-cobertura-para-pizza-mozzalet-2-kg-pmg-atacadista.jpg' },
  { id: 724, name: 'MUÇARELA COBERTURA PARA PIZZA MOZZANA 2 KG', category: 'Derivados de Leite', price: 51.56, image: 'https://www.marquesvendaspmg.shop/images/mucarela-cobertura-para-pizza-mozzana-2-kg-pmg-atacadista.jpg' },
  { id: 725, name: 'MUÇARELA COOPERNOVA 4 KG', category: 'Derivados de Leite', price: 32.33, image: 'https://www.marquesvendaspmg.shop/images/mucarela-coopernova-4-kg-pmg-atacadista.jpg' },
  { id: 726, name: 'MUÇARELA COYOTE 4 KG', category: 'Derivados de Leite', price: 30.44, image: 'https://www.marquesvendaspmg.shop/images/mucarela-coyote-4-kg-pmg-atacadista.jpg' },
  { id: 727, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 728, name: 'MUÇARELA DE BÚFALA BOCCONCINO YEMA 330 G', category: 'Derivados de Leite', price: 23.32, image: 'https://www.marquesvendaspmg.shop/images/mucarela-de-bufala-bocconcino-yema-330-g-pmg-atacadista.jpg' },
  { id: 729, name: 'MUÇARELA DE BÚFALA BOLA LEVITARE 400 G', category: 'Derivados de Leite', price: 27.91, image: 'https://www.marquesvendaspmg.shop/images/mucarela-de-bufala-bola-levitare-400-g-pmg-atacadista.jpg' },
  { id: 730, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 731, name: 'MUÇARELA DE BÚFALA CEREJINHA LEVITARE 400 G', category: 'Derivados de Leite', price: 27.91, image: 'https://www.marquesvendaspmg.shop/images/mucarela-de-bufala-cerejinha-levitare-400-g-pmg-atacadista.jpg' },
  { id: 732, name: 'MUÇARELA DE BÚFALA CEREJINHA YEMA 330 G', category: 'Derivados de Leite', price: 23.32, image: 'https://www.marquesvendaspmg.shop/images/mucarela-de-bufala-cerejinha-yema-330-g-pmg-atacadista.jpg' },
  { id: 733, name: 'MUÇARELA DE BÚFALA LEVITARE 4 KG', category: 'Derivados de Leite', price: 54.33, image: 'https://www.marquesvendaspmg.shop/images/mucarela-de-bufala-levitare-4-kg-pmg-atacadista.jpg' },
  { id: 734, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 735, name: 'MUÇARELA DE BÚFALA YEMA 3,7 KG', category: 'Derivados de Leite', price: 44.98, image: 'https://www.marquesvendaspmg.shop/images/mucarela-de-bufala-yema-37-kg-pmg-atacadista.jpg' },
  { id: 736, name: 'MUÇARELA DOMILAC 3 KG', category: 'Derivados de Leite', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/mucarela-domilac-3-kg-pmg-atacadista.jpg' },
  { id: 737, name: 'MUÇARELA FATIADA COYOTE 4 KG', category: 'Derivados de Leite', price: 144.79, image: 'https://www.marquesvendaspmg.shop/images/mucarela-fatiada-coyote-4-kg-pmg-atacadista.jpg' },
  { id: 738, name: 'MUÇARELA FATIADA FRIZZO 2 KG', category: 'Derivados de Leite', price: 62.74, image: 'https://www.marquesvendaspmg.shop/images/mucarela-fatiada-frizzo-2-kg-pmg-atacadista.jpg' },
  { id: 739, name: 'MUÇARELA FATIADA HM 4 KG', category: 'Derivados de Leite', price: 118.24, image: 'https://www.marquesvendaspmg.shop/images/mucarela-fatiada-hm-4-kg-pmg-atacadista.jpg' },
  { id: 740, name: 'MUÇARELA FATIADA PROCESSADA 16 FATIAS SCAR 400 G', category: 'Derivados de Leite', price: 21.37, image: 'https://www.marquesvendaspmg.shop/images/mucarela-fatiada-processada-16-fatias-scar-400-g-pmg-atacadista.jpg' },
  { id: 741, name: 'MUÇARELA FATIADA PROCESSADA POLENGHI 2,73 KG', category: 'Derivados de Leite', price: 104.71, image: 'https://www.marquesvendaspmg.shop/images/mucarela-fatiada-processada-polenghi-273-kg-pmg-atacadista.jpg' },
  { id: 742, name: 'MUÇARELA FATIADA PROCESSADA SCHREIBER 2,27 KG', category: 'Derivados de Leite', price: 85.98, image: 'https://www.marquesvendaspmg.shop/images/mucarela-fatiada-processada-schreiber-227-kg-pmg-atacadista.jpg' },
  { id: 743, name: 'MUÇARELA FATIADA TIROLEZ 1 KG', category: 'Derivados de Leite', price: 46.25, image: 'https://www.marquesvendaspmg.shop/images/mucarela-fatiada-tirolez-1-kg-pmg-atacadista.jpg' },
  { id: 744, name: 'MUÇARELA FLEURY 4 KG', category: 'Derivados de Leite', price: 30.57, image: 'https://www.marquesvendaspmg.shop/images/mucarela-fleury-4-kg-pmg-atacadista.jpg' },
  { id: 745, name: 'MUÇARELA FRIOLACK 4 KG', category: 'Derivados de Leite', price: 27.6, image: 'https://www.marquesvendaspmg.shop/images/mucarela-friolack-4-kg-pmg-atacadista.jpg' },
  { id: 746, name: 'MUÇARELA FRIZZO 4 KG', category: 'Derivados de Leite', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/mucarela-frizzo-4-kg-pmg-atacadista.jpg' },
  { id: 747, name: 'MUÇARELA HM 4 KG', category: 'Derivados de Leite', price: 26.45, image: 'https://www.marquesvendaspmg.shop/images/mucarela-hm-4-kg-pmg-atacadista.jpg' },
  { id: 748, name: 'MUÇARELA ITALAC 4 KG', category: 'Derivados de Leite', price: 31.16, image: 'https://www.marquesvendaspmg.shop/images/mucarela-italac-4-kg-pmg-atacadista.jpg' },
  { id: 749, name: 'MUÇARELA JÓIA 4 KG', category: 'Derivados de Leite', price: 33.51, image: 'https://www.marquesvendaspmg.shop/images/mucarela-joia-4-kg-pmg-atacadista.jpg' },
  { id: 750, name: 'MUÇARELA LA PAULINA 3,5 KG', category: 'Derivados de Leite', price: 29.98, image: 'https://www.marquesvendaspmg.shop/images/mucarela-la-paulina-35-kg-pmg-atacadista.jpg' },
  { id: 751, name: 'MUÇARELA LIRA 4 KG', category: 'Derivados de Leite', price: 31.75, image: 'https://www.marquesvendaspmg.shop/images/mucarela-lira-4-kg-pmg-atacadista.jpg' },
  { id: 752, name: 'MUÇARELA LITORAL 4 KG', category: 'Derivados de Leite', price: 27.05, image: 'https://www.marquesvendaspmg.shop/images/mucarela-litoral-4-kg-pmg-atacadista.jpg' },
  { id: 753, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 754, name: 'MUÇARELA MONTE CASTELO 4 KG', category: 'Derivados de Leite', price: 28.22, image: 'https://www.marquesvendaspmg.shop/images/mucarela-monte-castelo-4-kg-pmg-atacadista.jpg' },
  { id: 755, name: 'MUÇARELA NATVILLE 4 KG', category: 'Derivados de Leite', price: 31.08, image: 'https://www.marquesvendaspmg.shop/images/mucarela-natville-4-kg-pmg-atacadista.jpg' },
  { id: 756, name: 'MUÇARELA PARAÍSO 4 KG', category: 'Derivados de Leite', price: 32.84, image: 'https://www.marquesvendaspmg.shop/images/mucarela-paraiso-4-kg-pmg-atacadista.jpg' },
  { id: 757, name: 'MUÇARELA PILOTO 4 KG', category: 'Derivados de Leite', price: 27.05, image: 'https://www.marquesvendaspmg.shop/images/mucarela-piloto-4-kg-pmg-atacadista.jpg' },
  { id: 758, name: 'MUÇARELA POLENGHI 3,5 KG', category: 'Derivados de Leite', price: 34.1, image: 'https://www.marquesvendaspmg.shop/images/mucarela-polenghi-35-kg-pmg-atacadista.jpg' },
  { id: 759, name: 'MUÇARELA PRIMO 4 KG', category: 'Derivados de Leite', price: 28.11, image: 'https://www.marquesvendaspmg.shop/images/mucarela-primo-4-kg-pmg-atacadista.jpg' },
  { id: 760, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 761, name: 'MUÇARELA QUATIGUÁ 4 KG', category: 'Derivados de Leite', price: 29.4, image: 'https://www.marquesvendaspmg.shop/images/mucarela-quatigua-4-kg-pmg-atacadista.jpg' },
  { id: 762, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 763, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 764, name: 'MUÇARELA SCALA 4 KG', category: 'Derivados de Leite', price: 36.74, image: 'https://www.marquesvendaspmg.shop/images/mucarela-scala-4-kg-pmg-atacadista.jpg' },
  { id: 765, name: 'MUÇARELA TIROLEZ 4 KG', category: 'Derivados de Leite', price: 37.03, image: 'https://www.marquesvendaspmg.shop/images/mucarela-tirolez-4-kg-pmg-atacadista.jpg' },
  { id: 766, name: 'MUÇARELA TRADIÇÃO 4 KG', category: 'Derivados de Leite', price: 34.28, image: 'https://www.marquesvendaspmg.shop/images/mucarela-tradicao-4-kg-pmg-atacadista.jpg' },
  { id: 767, name: 'MUÇARELA TRÊS MARIAS "MATO GROSSO" 4 KG', category: 'Derivados de Leite', price: 32.33, image: 'https://www.marquesvendaspmg.shop/images/mucarela-tres-marias-mato-grosso-4-kg-pmg-atacadista.jpg' },
  { id: 768, name: 'MUÇARELA TRÊS MARIAS "MINAS GERAIS" 4 KG', category: 'Derivados de Leite', price: 31.75, image: 'https://www.marquesvendaspmg.shop/images/mucarela-tres-marias-minas-gerais-4-kg-pmg-atacadista.jpg' },
  { id: 769, name: 'MUÇARELA TRÊS MARIAS RONDÔNIA "JARU" 4 KG', category: 'Derivados de Leite', price: 33.51, image: 'https://www.marquesvendaspmg.shop/images/mucarela-tres-marias-rondonia-jaru-4-kg-pmg-atacadista.jpg' },
  { id: 770, name: 'MUÇARELA TRÊS MARIAS RONDÔNIA "OURO PRETO" 4 KG', category: 'Derivados de Leite', price: 34.1, image: 'https://www.marquesvendaspmg.shop/images/mucarela-tres-marias-rondonia-ouro-preto-4-kg-pmg-atacadista.jpg' },
  { id: 771, name: 'MUÇARELA VACA E BÚFALA BOCCONCINO YEMA 330 G', category: 'Derivados de Leite', price: 19.16, image: 'https://www.marquesvendaspmg.shop/images/mucarela-vaca-e-bufala-bocconcino-yema-330-g-pmg-atacadista.jpg' },
  { id: 772, name: 'MUÇARELA VACA E BÚFALA CEREJAS YEMA 330 G', category: 'Derivados de Leite', price: 19.16, image: 'https://www.marquesvendaspmg.shop/images/mucarela-vaca-e-bufala-cerejas-yema-330-g-pmg-atacadista.jpg' },
  { id: 773, name: 'MUÇARELA VACA E BÚFALA MARGHERITA YEMA 700 G', category: 'Derivados de Leite', price: 53.55, image: 'https://www.marquesvendaspmg.shop/images/mucarela-vaca-e-bufala-margherita-yema-700-g-pmg-atacadista.jpg' },
  { id: 774, name: 'MUÇARELA ZERO LACTOSE TRÊS MARIAS 4 KG', category: 'Derivados de Leite', price: 37.1, image: 'https://www.marquesvendaspmg.shop/images/mucarela-zero-lactose-tres-marias-4-kg-pmg-atacadista.jpg' },
  { id: 775, name: 'NATA GRANDE FRIMESA 3,5 KG', category: 'Derivados de Leite', price: 160.49, image: 'https://www.marquesvendaspmg.shop/images/nata-grande-frimesa-35-kg-pmg-atacadista.jpg' },
  { id: 776, name: 'NATA PEQUENA FRIMESA 300 G', category: 'Derivados de Leite', price: 15.28, image: 'https://www.marquesvendaspmg.shop/images/nata-pequena-frimesa-300-g-pmg-atacadista.jpg' },
  { id: 777, name: 'PARMESÃO 1 / 4 SCALA 1,35 KG', category: 'Derivados de Leite', price: 130.01, image: 'https://www.marquesvendaspmg.shop/images/parmesao-1-4-scala-135-kg-pmg-atacadista.jpg' },
  { id: 778, name: 'PARMESÃO 6 MESES IPANEMA 6 KG', category: 'Derivados de Leite', price: 75.72, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-ipanema-6-kg-pmg-atacadista.jpg' },
  { id: 779, name: 'PARMESÃO 6 MESES LA SERENISSIMA 8 KG', category: 'Derivados de Leite', price: 70.03, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-la-serenissima-8-kg-pmg-atacadista.jpg' },
  { id: 780, name: 'PARMESÃO 6 MESES PEQUENO SIBÉRIA 3 KG', category: 'Derivados de Leite', price: 71.58, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-pequeno-siberia-3-kg-pmg-atacadista.jpg' },
  { id: 781, name: 'PARMESÃO 6 MESES POLENGHI 6,5 KG', category: 'Derivados de Leite', price: 67.41, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-polenghi-65-kg-pmg-atacadista.jpg' },
  { id: 782, name: 'PARMESÃO 6 MESES SCALA 6 KG', category: 'Derivados de Leite', price: 80.52, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-scala-6-kg-pmg-atacadista.jpg' },
  { id: 783, name: 'PARMESÃO 6 MESES SIBÉRIA 6 KG', category: 'Derivados de Leite', price: 71.58, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-siberia-6-kg-pmg-atacadista.jpg' },
  { id: 784, name: 'PARMESÃO 6 MESES TIROLEZ 7 KG', category: 'Derivados de Leite', price: 69.02, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-tirolez-7-kg-pmg-atacadista.jpg' },
  { id: 785, name: 'PARMESÃO 6 MESES VIGOR 8 KG', category: 'Derivados de Leite', price: 80.33, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-vigor-8-kg-pmg-atacadista.jpg' },
  { id: 786, name: 'PARMESÃO CAPA PRETA BURITIS 5 KG', category: 'Derivados de Leite', price: 70.16, image: 'https://www.marquesvendaspmg.shop/images/parmesao-capa-preta-buritis-5-kg-pmg-atacadista.jpg' },
  { id: 787, name: 'PARMESÃO FRACIONADO CAPA PRETA DOR 200 G', category: 'Derivados de Leite', price: 21.95, image: 'https://www.marquesvendaspmg.shop/images/parmesao-fracionado-capa-preta-dor-200-g-pmg-atacadista.jpg' },
  { id: 788, name: 'PARMESÃO FRACIONADO QUATÁ 260 G', category: 'Derivados de Leite', price: 14.26, image: 'https://www.marquesvendaspmg.shop/images/parmesao-fracionado-quata-260-g-pmg-atacadista.jpg' },
  { id: 789, name: 'PARMESÃO FRACIONADO SCALA 180 G', category: 'Derivados de Leite', price: 18.66, image: 'https://www.marquesvendaspmg.shop/images/parmesao-fracionado-scala-180-g-pmg-atacadista.jpg' },
  { id: 790, name: 'PARMESÃO FRACIONADO TIROLEZ 245 G', category: 'Derivados de Leite', price: 21.63, image: 'https://www.marquesvendaspmg.shop/images/parmesao-fracionado-tirolez-245-g-pmg-atacadista.jpg' },
  { id: 791, name: 'PARMESÃO FRACIONADO VIGOR 200 G', category: 'Derivados de Leite', price: 25.67, image: 'https://www.marquesvendaspmg.shop/images/parmesao-fracionado-vigor-200-g-pmg-atacadista.jpg' },
  { id: 792, name: 'PARMESÃO MONTANHÊS CRISTAL 5 KG', category: 'Derivados de Leite', price: 38.75, image: 'https://www.marquesvendaspmg.shop/images/parmesao-montanhes-cristal-5-kg-pmg-atacadista.jpg' },
  { id: 793, name: 'PARMESÃO MONTANHÊS SCALA 6 KG', category: 'Derivados de Leite', price: 84.61, image: 'https://www.marquesvendaspmg.shop/images/parmesao-montanhes-scala-6-kg-pmg-atacadista.jpg' },
  { id: 794, name: 'PARMESÃO MONTANHÊS TRÊS MARIAS 5 KG', category: 'Derivados de Leite', price: 48.57, image: 'https://www.marquesvendaspmg.shop/images/parmesao-montanhes-tres-marias-5-kg-pmg-atacadista.jpg' },
  { id: 795, name: 'PARMESÃO PREMIUM 12 MESES SCALA 6 KG', category: 'Derivados de Leite', price: 97.14, image: 'https://www.marquesvendaspmg.shop/images/parmesao-premium-12-meses-scala-6-kg-pmg-atacadista.jpg' },
  { id: 796, name: 'PARMESÃO RALADO FINO RJR 1 KG', category: 'Derivados de Leite', price: 35.78, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-fino-rjr-1-kg-pmg-atacadista.jpg' },
  { id: 797, name: 'PARMESÃO RALADO FINO S & A 1 KG', category: 'Derivados de Leite', price: 36.68, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-fino-s-a-1-kg-pmg-atacadista.jpg' },
  { id: 798, name: 'PARMESÃO RALADO FINO VALEZA 1 KG', category: 'Derivados de Leite', price: 38.34, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-fino-valeza-1-kg-pmg-atacadista.jpg' },
  { id: 799, name: 'PARMESÃO RALADO FINO VIGOR 1 KG', category: 'Derivados de Leite', price: 88.56, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-fino-vigor-1-kg-pmg-atacadista.jpg' },
  { id: 800, name: 'PARMESÃO RALADO GROSSO RJR 1 KG', category: 'Derivados de Leite', price: 37.71, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-grosso-rjr-1-kg-pmg-atacadista.jpg' },
  { id: 801, name: 'PARMESÃO RALADO MÉDIO FILLETTINO 1 KG', category: 'Derivados de Leite', price: 42.82, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-medio-fillettino-1-kg-pmg-atacadista.jpg' },
  { id: 802, name: 'PARMESÃO RALADO MÉDIO RJR 1 KG', category: 'Derivados de Leite', price: 37.71, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-medio-rjr-1-kg-pmg-atacadista.jpg' },
  { id: 803, name: 'PARMESÃO SACHÊ RALADO FAIXA AZUL 10 G (CX 100 UN)', category: 'Derivados de Leite', price: 212.07, image: 'https://www.marquesvendaspmg.shop/images/parmesao-sache-ralado-faixa-azul-10-g-cx-100-un-pmg-atacadista.jpg' },
  { id: 804, name: 'PARMESÃO SACHÊ RALADO ITAMONTÊS 50 G (CX 20 UN)', category: 'Derivados de Leite', price: 63.91, image: 'https://www.marquesvendaspmg.shop/images/parmesao-sache-ralado-itamontes-50-g-cx-20-un-pmg-atacadista.jpg' },
  { id: 805, name: 'PARMESÃO SACHÊ RALADO LA SERENISSIMA 50 G (CX 20 UN)', category: 'Derivados de Leite', price: 111.18, image: 'https://www.marquesvendaspmg.shop/images/parmesao-sache-ralado-la-serenissima-50-g-cx-20-un-pmg-atacadista.jpg' },
  { id: 806, name: 'PARMESÃO SACHÊ RALADO SCALA 50 G (CX 20 UN)', category: 'Derivados de Leite', price: 25.5, image: 'https://www.marquesvendaspmg.shop/images/parmesao-sache-ralado-scala-50-g-cx-20-un-pmg-atacadista.jpg' },
  { id: 807, name: 'PARMESÃO SACHÊ RALADO VIGOR 50 G (CX 20 UN)', category: 'Derivados de Leite', price: 111.45, image: 'https://www.marquesvendaspmg.shop/images/parmesao-sache-ralado-vigor-50-g-cx-20-un-pmg-atacadista.jpg' },
  { id: 808, name: 'PARMESÃO TROPICAL SAFIRA 6 KG', category: 'Derivados de Leite', price: 40.9, image: 'https://www.marquesvendaspmg.shop/images/parmesao-tropical-safira-6-kg-pmg-atacadista.jpg' },
  { id: 809, name: 'PARMESÃO TROPICAL SERRA NOVA 6 KG', category: 'Derivados de Leite', price: 42.08, image: 'https://www.marquesvendaspmg.shop/images/parmesao-tropical-serra-nova-6-kg-pmg-atacadista.jpg' },
  { id: 810, name: 'PROVOLONE CRISTAL 5 KG', category: 'Derivados de Leite', price: 37.07, image: 'https://www.marquesvendaspmg.shop/images/provolone-cristal-5-kg-pmg-atacadista.jpg' },
  { id: 811, name: 'PROVOLONE GRANDE TIROLEZ 10 KG', category: 'Derivados de Leite', price: 73.62, image: 'https://www.marquesvendaspmg.shop/images/provolone-grande-tirolez-10-kg-pmg-atacadista.jpg' },
  { id: 812, name: 'PROVOLONE PEQUENO TRÊS MARIAS 2 KG', category: 'Derivados de Leite', price: 43.46, image: 'https://www.marquesvendaspmg.shop/images/provolone-pequeno-tres-marias-2-kg-pmg-atacadista.jpg' },
  { id: 813, name: 'PROVOLONE SCALA 5 KG', category: 'Derivados de Leite', price: 74.13, image: 'https://www.marquesvendaspmg.shop/images/provolone-scala-5-kg-pmg-atacadista.jpg' },
  { id: 814, name: 'PROVOLONE TÂNIA 5 KG', category: 'Derivados de Leite', price: 56.1, image: 'https://www.marquesvendaspmg.shop/images/provolone-tania-5-kg-pmg-atacadista.jpg' },
  { id: 815, name: 'PROVOLONE TIROLEZ 5 KG', category: 'Derivados de Leite', price: 73.62, image: 'https://www.marquesvendaspmg.shop/images/provolone-tirolez-5-kg-pmg-atacadista.jpg' },
  { id: 816, name: 'PROVOLONE TRÊS MARIAS 5 KG', category: 'Derivados de Leite', price: 43.46, image: 'https://www.marquesvendaspmg.shop/images/provolone-tres-marias-5-kg-pmg-atacadista.jpg' },
  { id: 817, name: 'PROVOLONE YEMA 5 KG', category: 'Derivados de Leite', price: 42.18, image: 'https://www.marquesvendaspmg.shop/images/provolone-yema-5-kg-pmg-atacadista.jpg' },
  { id: 818, name: 'PROVOLONETE SCALA 300 G', category: 'Derivados de Leite', price: 25.56, image: 'https://www.marquesvendaspmg.shop/images/provolonete-scala-300-g-pmg-atacadista.jpg' },
  { id: 819, name: 'PROVOLONETE TIROLEZ 335 G', category: 'Derivados de Leite', price: 33.66, image: 'https://www.marquesvendaspmg.shop/images/provolonete-tirolez-335-g-pmg-atacadista.jpg' },
  { id: 820, name: 'QUEIJO BRIE FORMA POLENGHI 1 KG', category: 'Derivados de Leite', price: 66.86, image: 'https://www.marquesvendaspmg.shop/images/queijo-brie-forma-polenghi-1-kg-pmg-atacadista.jpg' },
  { id: 821, name: 'QUEIJO BRIE FORMA TIROLEZ 1 KG', category: 'Derivados de Leite', price: 77.18, image: 'https://www.marquesvendaspmg.shop/images/queijo-brie-forma-tirolez-1-kg-pmg-atacadista.jpg' },
  { id: 822, name: 'QUEIJO BRIE FORMA YEMA 1 KG', category: 'Derivados de Leite', price: 56.32, image: 'https://www.marquesvendaspmg.shop/images/queijo-brie-forma-yema-1-kg-pmg-atacadista.jpg' },
  { id: 823, name: 'QUEIJO COALHO BARRA CORONATA 2 KG', category: 'Derivados de Leite', price: 43.31, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-barra-coronata-2-kg-pmg-atacadista.jpg' },
  { id: 824, name: 'QUEIJO COALHO BARRA CRISTAL 3,5 KG', category: 'Derivados de Leite', price: 40.49, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-barra-cristal-35-kg-pmg-atacadista.jpg' },
  { id: 825, name: 'QUEIJO COALHO BARRA QUATÁ 7 KG', category: 'Derivados de Leite', price: 58.9, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-barra-quata-7-kg-pmg-atacadista.jpg' },
  { id: 826, name: 'QUEIJO COALHO BARRA TRÊS MARIAS 7 KG', category: 'Derivados de Leite', price: 45.4, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-barra-tres-marias-7-kg-pmg-atacadista.jpg' },
  { id: 827, name: 'QUEIJO COALHO BARRA YEMA 3,5 KG', category: 'Derivados de Leite', price: 50.31, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-barra-yema-35-kg-pmg-atacadista.jpg' },
  { id: 828, name: 'QUEIJO COALHO ESPETO CORONATA PCT 6 UN', category: 'Derivados de Leite', price: 13.52, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-espeto-coronata-pct-6-un-pmg-atacadista.jpg' },
  { id: 829, name: 'QUEIJO COALHO ESPETO QUATÁ PCT 7 UN', category: 'Derivados de Leite', price: 18.14, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-espeto-quata-pct-7-un-pmg-atacadista.jpg' },
  { id: 830, name: 'QUEIJO COALHO ESPETO SCALA PCT 7 UN', category: 'Derivados de Leite', price: 20.25, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-espeto-scala-pct-7-un-pmg-atacadista.jpg' },
  { id: 831, name: 'QUEIJO COALHO ESPETO TIROLEZ PCT 7 UN', category: 'Derivados de Leite', price: 18.41, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-espeto-tirolez-pct-7-un-pmg-atacadista.jpg' },
  { id: 832, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 833, name: 'QUEIJO COTTAGE TIROLEZ 400 G', category: 'Derivados de Leite', price: 20.87, image: 'https://www.marquesvendaspmg.shop/images/queijo-cottage-tirolez-400-g-pmg-atacadista.jpg' },
  { id: 834, name: 'QUEIJO EMMENTAL YEMA 13 KG', category: 'Derivados de Leite', price: 72.15, image: 'https://www.marquesvendaspmg.shop/images/queijo-emmental-yema-13-kg-pmg-atacadista.jpg' },
  { id: 835, name: 'QUEIJO ESTEPE IPANEMA 6 KG', category: 'Derivados de Leite', price: 65.01, image: 'https://www.marquesvendaspmg.shop/images/queijo-estepe-ipanema-6-kg-pmg-atacadista.jpg' },
  { id: 836, name: 'QUEIJO ESTEPE TIROLEZ 7 KG', category: 'Derivados de Leite', price: 83.13, image: 'https://www.marquesvendaspmg.shop/images/queijo-estepe-tirolez-7-kg-pmg-atacadista.jpg' },
  { id: 837, name: 'QUEIJO FRACIONADO BRIE SÃO VICENTE 115 G', category: 'Derivados de Leite', price: 9.71, image: 'https://www.marquesvendaspmg.shop/images/queijo-fracionado-brie-sao-vicente-115-g-pmg-atacadista.jpg' },
  { id: 838, name: 'QUEIJO FRACIONADO CAMEMBERT SÃO VICENTE 125 G', category: 'Derivados de Leite', price: 11.66, image: 'https://www.marquesvendaspmg.shop/images/queijo-fracionado-camembert-sao-vicente-125-g-pmg-atacadista.jpg' },
  { id: 839, name: 'QUEIJO FRACIONADO CAMEMBERT YEMA 125 G', category: 'Derivados de Leite', price: 10.43, image: 'https://www.marquesvendaspmg.shop/images/queijo-fracionado-camembert-yema-125-g-pmg-atacadista.jpg' },
  { id: 840, name: 'QUEIJO FRACIONADO GRUYÉRE VIGOR 145 G', category: 'Derivados de Leite', price: 19.81, image: 'https://www.marquesvendaspmg.shop/images/queijo-fracionado-gruyere-vigor-145-g-pmg-atacadista.jpg' },
  { id: 841, name: 'QUEIJO GOUDA BELLA ITÁLIA 3 KG', category: 'Derivados de Leite', price: 55.71, image: 'https://www.marquesvendaspmg.shop/images/queijo-gouda-bella-italia-3-kg-pmg-atacadista.jpg' },
  { id: 842, name: 'QUEIJO GOUDA QUATÁ 3 KG', category: 'Derivados de Leite', price: 65.77, image: 'https://www.marquesvendaspmg.shop/images/queijo-gouda-quata-3-kg-pmg-atacadista.jpg' },
  { id: 843, name: 'QUEIJO GOUDA TIROLEZ 3 KG', category: 'Derivados de Leite', price: 79.16, image: 'https://www.marquesvendaspmg.shop/images/queijo-gouda-tirolez-3-kg-pmg-atacadista.jpg' },
  { id: 844, name: 'QUEIJO GRUYÉRE DOR 12 KG', category: 'Derivados de Leite', price: 72.15, image: 'https://www.marquesvendaspmg.shop/images/queijo-gruyere-dor-12-kg-pmg-atacadista.jpg' },
  { id: 845, name: 'QUEIJO GRUYÉRE PEQUENO YEMA 7 KG', category: 'Derivados de Leite', price: 72.15, image: 'https://www.marquesvendaspmg.shop/images/queijo-gruyere-pequeno-yema-7-kg-pmg-atacadista.jpg' },
  { id: 846, name: 'QUEIJO GRUYÉRE QUATÁ 12 KG', category: 'Derivados de Leite', price: 81.67, image: 'https://www.marquesvendaspmg.shop/images/queijo-gruyere-quata-12-kg-pmg-atacadista.jpg' },
  { id: 847, name: 'QUEIJO MAASDAM SÃO VICENTE 12 KG', category: 'Derivados de Leite', price: 85.46, image: 'https://www.marquesvendaspmg.shop/images/queijo-maasdam-sao-vicente-12-kg-pmg-atacadista.jpg' },
  { id: 848, name: 'QUEIJO MASCARPONE YEMA 350 G', category: 'Derivados de Leite', price: 20.85, image: 'https://www.marquesvendaspmg.shop/images/queijo-mascarpone-yema-350-g-pmg-atacadista.jpg' },
  { id: 849, name: 'QUEIJO MINAS FRESCAL CORONATA 500 G', category: 'Derivados de Leite', price: 36.49, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-frescal-coronata-500-g-pmg-atacadista.jpg' },
  { id: 850, name: 'QUEIJO MINAS FRESCAL ITAMONTÊS 500 G', category: 'Derivados de Leite', price: 32.46, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-frescal-itamontes-500-g-pmg-atacadista.jpg' },
  { id: 851, name: 'QUEIJO MINAS FRESCAL POLENGHI 400 G', category: 'Derivados de Leite', price: 18.82, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-frescal-polenghi-400-g-pmg-atacadista.jpg' },
  { id: 852, name: 'QUEIJO MINAS FRESCAL TIROLEZ 500 G', category: 'Derivados de Leite', price: 67.83, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-frescal-tirolez-500-g-pmg-atacadista.jpg' },
  { id: 853, name: 'QUEIJO MINAS MEIA CURA SCALA 1 KG', category: 'Derivados de Leite', price: 73.23, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-meia-cura-scala-1-kg-pmg-atacadista.jpg' },
  { id: 854, name: 'QUEIJO MINAS PADRÃO CRIOULO 500 G', category: 'Derivados de Leite', price: 66.14, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-padrao-crioulo-500-g-pmg-atacadista.jpg' },
  { id: 855, name: 'QUEIJO MINAS PADRÃO SCALA 500 G', category: 'Derivados de Leite', price: 71.95, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-padrao-scala-500-g-pmg-atacadista.jpg' },
  { id: 856, name: 'QUEIJO MINAS PADRÃO TRÊS MARIAS 500 G', category: 'Derivados de Leite', price: 48.57, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-padrao-tres-marias-500-g-pmg-atacadista.jpg' },
  { id: 857, name: 'QUEIJO POLENGUINHO POLENGHI 17 G', category: 'Derivados de Leite', price: 25.05, image: 'https://www.marquesvendaspmg.shop/images/queijo-polenguinho-polenghi-17-g-pmg-atacadista.jpg' },
  { id: 858, name: 'QUEIJO PRATO APOLO 3,5 KG', category: 'Derivados de Leite', price: 32.58, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-apolo-35-kg-pmg-atacadista.jpg' },
  { id: 859, name: 'QUEIJO PRATO CORONATA 3,5 KG', category: 'Derivados de Leite', price: 38.61, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-coronata-35-kg-pmg-atacadista.jpg' },
  { id: 860, name: 'QUEIJO PRATO CRISTAL 3,5 KG', category: 'Derivados de Leite', price: 34.39, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-cristal-35-kg-pmg-atacadista.jpg' },
  { id: 861, name: 'QUEIJO PRATO DA VACA 3,5 KG', category: 'Derivados de Leite', price: 31.97, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-da-vaca-35-kg-pmg-atacadista.jpg' },
  { id: 862, name: 'QUEIJO PRATO DEALE 2,8 KG', category: 'Derivados de Leite', price: 31.37, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-deale-28-kg-pmg-atacadista.jpg' },
  { id: 863, name: 'QUEIJO PRATO ESFÉRICO TIROLEZ 2 KG', category: 'Derivados de Leite', price: 77.84, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-esferico-tirolez-2-kg-pmg-atacadista.jpg' },
  { id: 864, name: 'QUEIJO PRATO FATIADO PROCESSADO 160 FATIAS VIGOR 2,24 KILO', category: 'Derivados de Leite', price: 89.89, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-fatiado-processado-160-fatias-vigor-224-kilo-pmg-atacadista.jpg' },
  { id: 865, name: 'QUEIJO PRATO FATIADO PROCESSADO 184 FATIAS SCHREIBER 2,27 KILO', category: 'Derivados de Leite', price: 91.98, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-fatiado-processado-184-fatias-schreiber-227-kilo-pmg-atacadista.jpg' },
  { id: 866, name: 'QUEIJO PRATO FATIADO PROCESSADO 192 FATIAS POLENGHI 2,73 KILO', category: 'Derivados de Leite', price: 100.47, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-fatiado-processado-192-fatias-polenghi-273-kilo-pmg-atacadista.jpg' },
  { id: 867, name: 'QUEIJO PRATO FATIADO PROCESSADO SABOR AMERICAN CHEESE 25 FATIAS SCAR 500 G', category: 'Derivados de Leite', price: 24.13, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-fatiado-processado-sabor-american-cheese-25-fatias-scar-500-g-pmg-atacadista.jpg' },
  { id: 868, name: 'QUEIJO PRATO FATIADO PROCESSADO SABOR CHEDDAR 25 FATIAS SCAR 500 G', category: 'Derivados de Leite', price: 24.13, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-fatiado-processado-sabor-cheddar-25-fatias-scar-500-g-pmg-atacadista.jpg' },
  { id: 869, name: 'QUEIJO PRATO MONTE CASTELO 3,5 KG', category: 'Derivados de Leite', price: 31.37, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-monte-castelo-35-kg-pmg-atacadista.jpg' },
  { id: 870, name: 'QUEIJO PRATO SCALA 3,5 KG', category: 'Derivados de Leite', price: 45.25, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-scala-35-kg-pmg-atacadista.jpg' },
  { id: 871, name: 'QUEIJO PRATO TIROLEZ 3,5 KG', category: 'Derivados de Leite', price: 38.93, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-tirolez-35-kg-pmg-atacadista.jpg' },
  { id: 872, name: 'QUEIJO PRATO TRÊS MARIAS 3,5 KG', category: 'Derivados de Leite', price: 38.61, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-tres-marias-35-kg-pmg-atacadista.jpg' },
  { id: 873, name: 'QUEIJO REINO TIROLEZ 1,6 KG', category: 'Derivados de Leite', price: 77.92, image: 'https://www.marquesvendaspmg.shop/images/queijo-reino-tirolez-16-kg-pmg-atacadista.jpg' },
  { id: 874, name: 'QUEIJO TIPO BURRATA DE BÚFALA DOR 180 G', category: 'Derivados de Leite', price: 21.09, image: 'https://www.marquesvendaspmg.shop/images/queijo-tipo-burrata-de-bufala-dor-180-g-pmg-atacadista.jpg' },
  { id: 875, name: 'QUEIJO TIPO BURRATA DE BÚFALA LEVITARE 150 G', category: 'Derivados de Leite', price: 22.39, image: 'https://www.marquesvendaspmg.shop/images/queijo-tipo-burrata-de-bufala-levitare-150-g-pmg-atacadista.jpg' },
  { id: 876, name: 'REQUEIJÃO AFFAMATO COM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 12.97, image: 'https://www.marquesvendaspmg.shop/images/requeijao-affamato-com-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 877, name: 'REQUEIJÃO CATUPIRY SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 54.28, image: 'https://www.marquesvendaspmg.shop/images/requeijao-catupiry-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 878, name: 'REQUEIJÃO CATUPIRY SEM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 153.01, image: 'https://www.marquesvendaspmg.shop/images/requeijao-catupiry-sem-amido-36-kilo-pmg-atacadista.jpg' },
  { id: 879, name: 'REQUEIJÃO CLARA MILK COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 15.93, image: 'https://www.marquesvendaspmg.shop/images/requeijao-clara-milk-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 880, name: 'REQUEIJÃO COPO CRIOULO SEM AMIDO 220 G (CX 24 UN)', category: 'Derivados de Leite', price: 290.38, image: 'https://www.marquesvendaspmg.shop/images/requeijao-copo-crioulo-sem-amido-220-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 881, name: 'REQUEIJÃO COPO GRANDE CATUPIRY SEM AMIDO 420 G (CX 15 UN)', category: 'Derivados de Leite', price: 20.04, image: 'https://www.marquesvendaspmg.shop/images/requeijao-copo-grande-catupiry-sem-amido-420-g-cx-15-un-pmg-atacadista.jpg' },
  { id: 882, name: 'REQUEIJÃO COPO GRANDE SCALA SEM AMIDO 380 G (CX 12 UN)', category: 'Derivados de Leite', price: 15.87, image: 'https://www.marquesvendaspmg.shop/images/requeijao-copo-grande-scala-sem-amido-380-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 883, name: 'REQUEIJÃO COPO GRANDE TIROLEZ SEM AMIDO 400 G (CX 12 UN)', category: 'Derivados de Leite', price: 14.52, image: 'https://www.marquesvendaspmg.shop/images/requeijao-copo-grande-tirolez-sem-amido-400-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 884, name: 'REQUEIJÃO COPO POÇOS DE CALDAS SEM AMIDO 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 233.23, image: 'https://www.marquesvendaspmg.shop/images/requeijao-copo-pocos-de-caldas-sem-amido-200-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 885, name: 'REQUEIJÃO COPO SCALA SEM AMIDO 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 100.84, image: 'https://www.marquesvendaspmg.shop/images/requeijao-copo-scala-sem-amido-200-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 886, name: 'REQUEIJÃO COPO SUPREMO SEM AMIDO 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 47.12, image: 'https://www.marquesvendaspmg.shop/images/requeijao-copo-supremo-sem-amido-200-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 887, name: 'REQUEIJÃO COPO TIROLEZ SEM AMIDO 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 183.26, image: 'https://www.marquesvendaspmg.shop/images/requeijao-copo-tirolez-sem-amido-200-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 888, name: 'REQUEIJÃO CORONATA COM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 53.21, image: 'https://www.marquesvendaspmg.shop/images/requeijao-coronata-com-amido-36-kilo-pmg-atacadista.jpg' },
  { id: 889, name: 'REQUEIJÃO CORONATA COM GORDURA VEGETAL E AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 21.66, image: 'https://www.marquesvendaspmg.shop/images/requeijao-coronata-com-gordura-vegetal-e-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 890, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 891, name: 'REQUEIJÃO CREMILLE COM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 10.13, image: 'https://www.marquesvendaspmg.shop/images/requeijao-cremille-com-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 892, name: 'REQUEIJÃO DA FAZENDA "VERDE" COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 13.15, image: 'https://www.marquesvendaspmg.shop/images/requeijao-da-fazenda-verde-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 893, name: 'REQUEIJÃO DALLORA COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 16.29, image: 'https://www.marquesvendaspmg.shop/images/requeijao-dallora-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 894, name: 'REQUEIJÃO DALLORA COM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 47.66, image: 'https://www.marquesvendaspmg.shop/images/requeijao-dallora-com-amido-36-kilo-pmg-atacadista.jpg' },
  { id: 895, name: 'REQUEIJÃO DANÚBIO SEM AMIDO 1 KILO', category: 'Derivados de Leite', price: 36.47, image: 'https://www.marquesvendaspmg.shop/images/requeijao-danubio-sem-amido-1-kilo-pmg-atacadista.jpg' },
  { id: 896, name: 'REQUEIJÃO GALILEO COM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 13.69, image: 'https://www.marquesvendaspmg.shop/images/requeijao-galileo-com-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 897, name: 'REQUEIJÃO IPANEMA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 42.53, image: 'https://www.marquesvendaspmg.shop/images/requeijao-ipanema-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 898, name: 'REQUEIJÃO MILK TOP COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 11.82, image: 'https://www.marquesvendaspmg.shop/images/requeijao-milk-top-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 899, name: 'REQUEIJÃO PARMATO COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 31.73, image: 'https://www.marquesvendaspmg.shop/images/requeijao-parmato-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 900, name: 'REQUEIJÃO PEQUENO CORONATA COM AMIDO 400 G', category: 'Derivados de Leite', price: 8.22, image: 'https://www.marquesvendaspmg.shop/images/requeijao-pequeno-coronata-com-amido-400-g-pmg-atacadista.jpg' },
  { id: 901, name: 'REQUEIJÃO PIZZALET COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 16.47, image: 'https://www.marquesvendaspmg.shop/images/requeijao-pizzalet-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 902, name: 'REQUEIJÃO QUATÁ SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 39.21, image: 'https://www.marquesvendaspmg.shop/images/requeijao-quata-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 903, name: 'REQUEIJÃO REKEMINAS COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 11.89, image: 'https://www.marquesvendaspmg.shop/images/requeijao-rekeminas-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 904, name: 'REQUEIJÃO ROSELI SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 42.23, image: 'https://www.marquesvendaspmg.shop/images/requeijao-roseli-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 905, name: 'REQUEIJÃO SABOR CHEDDAR CATUPIRY 1,010 KILO', category: 'Derivados de Leite', price: 46.97, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-catupiry-1010-kilo-pmg-atacadista.jpg' },
  { id: 906, name: 'REQUEIJÃO SABOR CHEDDAR CORONATA 1,5 KILO', category: 'Derivados de Leite', price: 38.61, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-coronata-15-kilo-pmg-atacadista.jpg' },
  { id: 907, name: 'REQUEIJÃO SABOR CHEDDAR PEQUENO CORONATA 240 G', category: 'Derivados de Leite', price: 9.84, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-pequeno-coronata-240-g-pmg-atacadista.jpg' },
  { id: 908, name: 'REQUEIJÃO SABOR CHEDDAR POLENGHI 1,5 KILO', category: 'Derivados de Leite', price: 57.07, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-polenghi-15-kilo-pmg-atacadista.jpg' },
  { id: 909, name: 'REQUEIJÃO SABOR CHEDDAR SCALA 1,5 KILO', category: 'Derivados de Leite', price: 33.54, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-scala-15-kilo-pmg-atacadista.jpg' },
  { id: 910, name: 'REQUEIJÃO SABOR CHEDDAR SCALON 1,02 KILO', category: 'Derivados de Leite', price: 32.45, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-scalon-102-kilo-pmg-atacadista.jpg' },
  { id: 911, name: 'REQUEIJÃO SABOR CHEDDAR SOFFICE 1,2 KILO', category: 'Derivados de Leite', price: 37.16, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-soffice-12-kilo-pmg-atacadista.jpg' },
  { id: 912, name: 'REQUEIJÃO SABOR CHEDDAR TIROLEZ 1,5 KILO', category: 'Derivados de Leite', price: 49.95, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-tirolez-15-kilo-pmg-atacadista.jpg' },
  { id: 913, name: 'REQUEIJÃO SABOR CHEDDAR VALEZA 1,003 KILO', category: 'Derivados de Leite', price: 28.83, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-valeza-1003-kilo-pmg-atacadista.jpg' },
  { id: 914, name: 'REQUEIJÃO SCALA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 42.24, image: 'https://www.marquesvendaspmg.shop/images/requeijao-scala-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 915, name: 'REQUEIJÃO SCALA SEM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 122.17, image: 'https://www.marquesvendaspmg.shop/images/requeijao-scala-sem-amido-36-kilo-pmg-atacadista.jpg' },
  { id: 916, name: 'REQUEIJÃO SCALON SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 42.83, image: 'https://www.marquesvendaspmg.shop/images/requeijao-scalon-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 917, name: 'REQUEIJÃO TIROLEZ SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 40.07, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tirolez-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 918, name: 'REQUEIJÃO TIROLEZ SEM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 96.07, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tirolez-sem-amido-36-kilo-pmg-atacadista.jpg' },
  { id: 919, name: 'REQUEIJÃO TOP MILK COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 13.88, image: 'https://www.marquesvendaspmg.shop/images/requeijao-top-milk-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 920, name: 'REQUEIJÃO TRADICIONAL CORONATA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 44.04, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tradicional-coronata-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 921, name: 'REQUEIJÃO TRADICIONAL DALLORA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 39.87, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tradicional-dallora-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 922, name: 'REQUEIJÃO TRADICIONAL SOFFICE SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 41.71, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tradicional-soffice-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 923, name: 'REQUEIJÃO TRÊS MARIAS SEM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 34.39, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tres-marias-sem-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 924, name: 'REQUEIJÃO VALE DO PARDO COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 11.94, image: 'https://www.marquesvendaspmg.shop/images/requeijao-vale-do-pardo-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 925, name: 'REQUEIJÃO VALEZA SEM AMIDO 1,003 KILO', category: 'Derivados de Leite', price: 27.63, image: 'https://www.marquesvendaspmg.shop/images/requeijao-valeza-sem-amido-1003-kilo-pmg-atacadista.jpg' },
  { id: 926, name: 'REQUEIJÃO VIGOR SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 42.23, image: 'https://www.marquesvendaspmg.shop/images/requeijao-vigor-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 927, name: 'REQUEIJÃO YEMA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 34.45, image: 'https://www.marquesvendaspmg.shop/images/requeijao-yema-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 928, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 929, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 930, name: 'RICOTA FRESCA CORONATA 520 G', category: 'Derivados de Leite', price: 15.49, image: 'https://www.marquesvendaspmg.shop/images/ricota-fresca-coronata-520-g-pmg-atacadista.jpg' },
  { id: 931, name: 'RICOTA FRESCA YEMA 400 G', category: 'Derivados de Leite', price: 13.16, image: 'https://www.marquesvendaspmg.shop/images/ricota-fresca-yema-400-g-pmg-atacadista.jpg' },
  { id: 932, name: 'APRESUNTADO AURORA 3,7 KILO PÇ', category: 'Derivados de Suíno', price: 72.91, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-aurora-37-kilo-pc-pmg-atacadista.jpg' },
  { id: 933, name: 'APRESUNTADO DÁLIA 3,7 KILO PÇ', category: 'Derivados de Suíno', price: 56.79, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-dalia-37-kilo-pc-pmg-atacadista.jpg' },
  { id: 934, name: 'APRESUNTADO DELI GOURMET 3,35 KILO PÇ', category: 'Derivados de Suíno', price: 61.11, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-deli-gourmet-335-kilo-pc-pmg-atacadista.jpg' },
  { id: 935, name: 'APRESUNTADO PEPERI AURORA 3,7 KILO PÇ', category: 'Derivados de Suíno', price: 63.62, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-peperi-aurora-37-kilo-pc-pmg-atacadista.jpg' },
  { id: 936, name: 'APRESUNTADO PERDIGÃO 3,5 KILO PÇ', category: 'Derivados de Suíno', price: 70.98, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-perdigao-35-kilo-pc-pmg-atacadista.jpg' },
  { id: 937, name: 'APRESUNTADO PRIETO 3,65 KILO PÇ', category: 'Derivados de Suíno', price: 76.68, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-prieto-365-kilo-pc-pmg-atacadista.jpg' },
  { id: 938, name: 'APRESUNTADO REZENDE 3,4 KILO PÇ', category: 'Derivados de Suíno', price: 61.15, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-rezende-34-kilo-pc-pmg-atacadista.jpg' },
  { id: 939, name: 'APRESUNTADO SADIA 3,5 KILO PÇ', category: 'Derivados de Suíno', price: 78.98, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-sadia-35-kilo-pc-pmg-atacadista.jpg' },
  { id: 940, name: 'APRESUNTADO SEARA 3,5 KILO PÇ', category: 'Derivados de Suíno', price: 67.34, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-seara-35-kilo-pc-pmg-atacadista.jpg' },
  { id: 941, name: 'BACON EM CUBOS "BARRIGA" LACTOFRIOS 1 KILO PCT', category: 'Derivados de Suíno', price: 38.28, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-barriga-lactofrios-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 942, name: 'BACON EM CUBOS "PERNIL" LACTOFRIOS 1 KILO PCT', category: 'Derivados de Suíno', price: 30.23, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-pernil-lactofrios-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 943, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 944, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 945, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 946, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 947, name: 'BACON EM CUBOS PALETA BESSER 1,5 KILO PCT', category: 'Derivados de Suíno', price: 31.7, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-paleta-besser-15-kilo-pct-pmg-atacadista.jpg' },
  { id: 948, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 949, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 950, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 951, name: 'BACON ESPECIAL SEARA 5 KILO KILO', category: 'Derivados de Suíno', price: 26.07, image: 'https://www.marquesvendaspmg.shop/images/bacon-especial-seara-5-kilo-kilo-pmg-atacadista.jpg' },
  { id: 952, name: 'BACON FATIADO "BARRIGA" BRASA 1 KILO PCT', category: 'Derivados de Suíno', price: 61.99, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-barriga-brasa-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 953, name: 'BACON FATIADO "PALETA" BRASA 1 KILO PCT', category: 'Derivados de Suíno', price: 33.39, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-paleta-brasa-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 954, name: 'BACON FATIADO "PALETA" MISTER BEEF 1 KILO PCT', category: 'Derivados de Suíno', price: 37.67, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-paleta-mister-beef-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 955, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 956, name: 'BACON FATIADO "PAPADA" MISTER BEEF 1 KILO PCT', category: 'Derivados de Suíno', price: 38.69, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-papada-mister-beef-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 957, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 958, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 959, name: 'BACON FATIADO LACTOFRIOS 1 KILO PCT', category: 'Derivados de Suíno', price: 35.5, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-lactofrios-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 960, name: 'BACON FATIADO PALETA BESSER 1,5 KILO PCT', category: 'Derivados de Suíno', price: 46.78, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-paleta-besser-15-kilo-pct-pmg-atacadista.jpg' },
  { id: 961, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 962, name: 'BACON FATIADO REDONDO PALETA MISTER BEEF 1 KILO PCT', category: 'Derivados de Suíno', price: 37.22, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-redondo-paleta-mister-beef-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 963, name: 'BACON FATIADO SEARA GOURMET 2,5 KILO PCT', category: 'Derivados de Suíno', price: 114.11, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-seara-gourmet-25-kilo-pct-pmg-atacadista.jpg' },
  { id: 964, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 965, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 966, name: 'BACON MANTA PERDIGÃO 4 KG KG', category: 'Derivados de Suíno', price: 30.97, image: 'https://www.marquesvendaspmg.shop/images/bacon-manta-perdigao-4-kg-kg-pmg-atacadista.jpg' },
  { id: 967, name: 'BACON MANTA REZENDE 4 KG KG', category: 'Derivados de Suíno', price: 26.07, image: 'https://www.marquesvendaspmg.shop/images/bacon-manta-rezende-4-kg-kg-pmg-atacadista.jpg' },
  { id: 968, name: 'BACON MANTA SADIA 3.4 KG KG', category: 'Derivados de Suíno', price: 30.97, image: 'https://www.marquesvendaspmg.shop/images/bacon-manta-sadia-34-kg-kg-pmg-atacadista.jpg' },
  { id: 969, name: 'BACON MÉDIO AURORA 3.7 KG KG', category: 'Derivados de Suíno', price: 40.16, image: 'https://www.marquesvendaspmg.shop/images/bacon-medio-aurora-37-kg-kg-pmg-atacadista.jpg' },
  { id: 970, name: 'BACON PALETA DÁLIA 4.5 KG KG', category: 'Derivados de Suíno', price: 25.71, image: 'https://www.marquesvendaspmg.shop/images/bacon-paleta-dalia-45-kg-kg-pmg-atacadista.jpg' },
  { id: 971, name: 'BACON PALETA FRICASA 4 KG KG', category: 'Derivados de Suíno', price: 23.06, image: 'https://www.marquesvendaspmg.shop/images/bacon-paleta-fricasa-4-kg-kg-pmg-atacadista.jpg' },
  { id: 972, name: 'BANHA AURORA 1 KG PCT', category: 'Derivados de Suíno', price: 15.15, image: 'https://www.marquesvendaspmg.shop/images/banha-aurora-1-kg-pct-pmg-atacadista.jpg' },
  { id: 973, name: 'BANHA COOPAVEL 1 KG PCT', category: 'Derivados de Suíno', price: 12.63, image: 'https://www.marquesvendaspmg.shop/images/banha-coopavel-1-kg-pct-pmg-atacadista.jpg' },
  { id: 974, name: 'BARRIGA SUÍNA CONGELADA FRIELLA 5 KG KG', category: 'Derivados de Suíno', price: 25.82, image: 'https://www.marquesvendaspmg.shop/images/barriga-suina-congelada-friella-5-kg-kg-pmg-atacadista.jpg' },
  { id: 975, name: 'BARRIGA SUÍNA CONGELADA FRIORI 8 KG KG', category: 'Derivados de Suíno', price: 23.01, image: 'https://www.marquesvendaspmg.shop/images/barriga-suina-congelada-friori-8-kg-kg-pmg-atacadista.jpg' },
  { id: 976, name: 'BISTECA SUÍNA CONGELADA FRIMESA (CX 5 KG) CX', category: 'Derivados de Suíno', price: 108.4, image: 'https://www.marquesvendaspmg.shop/images/bisteca-suina-congelada-frimesa-cx-5-kg-cx-pmg-atacadista.jpg' },
  { id: 977, name: 'BISTECA SUÍNA CONGELADA PAMPLONA (CX 10 KG)', category: 'Derivados de Suíno', price: 196.06, image: 'https://www.marquesvendaspmg.shop/images/bisteca-suina-congelada-pamplona-cx-10-kg-pmg-atacadista.jpg' },
  { id: 978, name: 'CALABRESA AURORA 5 KILO', category: 'Derivados de Suíno', price: 110.42, image: 'https://www.marquesvendaspmg.shop/images/calabresa-aurora-5-kilo-pmg-atacadista.jpg' },
  { id: 979, name: 'CALABRESA BRASA 2 KILO', category: 'Derivados de Suíno', price: 40.03, image: 'https://www.marquesvendaspmg.shop/images/calabresa-brasa-2-kilo-pmg-atacadista.jpg' },
  { id: 980, name: 'CALABRESA CERATTI 2.5 KILO', category: 'Derivados de Suíno', price: 54.16, image: 'https://www.marquesvendaspmg.shop/images/calabresa-ceratti-25-kilo-pmg-atacadista.jpg' },
  { id: 981, name: 'CALABRESA FATIADA CONGELADA FRIMESA 1 KILO', category: 'Derivados de Suíno', price: 25.98, image: 'https://www.marquesvendaspmg.shop/images/calabresa-fatiada-congelada-frimesa-1-kilo-pmg-atacadista.jpg' },
  { id: 982, name: 'CALABRESA FATIADA RESFRIADA CERATTI 1 KILO', category: 'Derivados de Suíno', price: 40.34, image: 'https://www.marquesvendaspmg.shop/images/calabresa-fatiada-resfriada-ceratti-1-kilo-pmg-atacadista.jpg' },
  { id: 983, name: 'CALABRESA FATIADA RESFRIADA LACTOFRIOS 1 KILO', category: 'Derivados de Suíno', price: 21.33, image: 'https://www.marquesvendaspmg.shop/images/calabresa-fatiada-resfriada-lactofrios-1-kilo-pmg-atacadista.jpg' },
  { id: 984, name: 'CALABRESA FATIADA RESFRIADA MISTER BEEF 1 KILO', category: 'Derivados de Suíno', price: 22.92, image: 'https://www.marquesvendaspmg.shop/images/calabresa-fatiada-resfriada-mister-beef-1-kilo-pmg-atacadista.jpg' },
  { id: 985, name: 'CALABRESA FRICASA 2.5 KILO', category: 'Derivados de Suíno', price: 43.87, image: 'https://www.marquesvendaspmg.shop/images/calabresa-fricasa-25-kilo-pmg-atacadista.jpg' },
  { id: 986, name: 'CALABRESA FRIMESA 2.5 KILO', category: 'Derivados de Suíno', price: 52.74, image: 'https://www.marquesvendaspmg.shop/images/calabresa-frimesa-25-kilo-pmg-atacadista.jpg' },
  { id: 987, name: 'CALABRESA LACTOFRIOS 2 KILO', category: 'Derivados de Suíno', price: 36.28, image: 'https://www.marquesvendaspmg.shop/images/calabresa-lactofrios-2-kilo-pmg-atacadista.jpg' },
  { id: 988, name: 'CALABRESA NOBRE 2 KILO', category: 'Derivados de Suíno', price: 44.04, image: 'https://www.marquesvendaspmg.shop/images/calabresa-nobre-2-kilo-pmg-atacadista.jpg' },
  { id: 989, name: 'CALABRESA PAMPLONA 2.5 KILO', category: 'Derivados de Suíno', price: 49.73, image: 'https://www.marquesvendaspmg.shop/images/calabresa-pamplona-25-kilo-pmg-atacadista.jpg' },
  { id: 990, name: 'CALABRESA PRIETO 5 KILO', category: 'Derivados de Suíno', price: 102.64, image: 'https://www.marquesvendaspmg.shop/images/calabresa-prieto-5-kilo-pmg-atacadista.jpg' },
  { id: 991, name: 'CALABRESA PURA PRIETO 5 KILO', category: 'Derivados de Suíno', price: 192.9, image: 'https://www.marquesvendaspmg.shop/images/calabresa-pura-prieto-5-kilo-pmg-atacadista.jpg' },
  { id: 992, name: 'CALABRESA RETA AURORA 3 KILO', category: 'Derivados de Suíno', price: 74.68, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-aurora-3-kilo-pmg-atacadista.jpg' },
  { id: 993, name: 'CALABRESA RETA BRASA 2 KILO', category: 'Derivados de Suíno', price: 40.03, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-brasa-2-kilo-pmg-atacadista.jpg' },
  { id: 994, name: 'CALABRESA RETA CERATTI 2.5 KILO', category: 'Derivados de Suíno', price: 65.47, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-ceratti-25-kilo-pmg-atacadista.jpg' },
  { id: 995, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 996, name: 'CALABRESA RETA PAMPLONA 2.5 KILO', category: 'Derivados de Suíno', price: 51.23, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-pamplona-25-kilo-pmg-atacadista.jpg' },
  { id: 997, name: 'CALABRESA RETA PRIETO 2.5 KILO', category: 'Derivados de Suíno', price: 56.32, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-prieto-25-kilo-pmg-atacadista.jpg' },
  { id: 998, name: 'CALABRESA RETA SADIA 2.5 KILO', category: 'Derivados de Suíno', price: 56.42, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-sadia-25-kilo-pmg-atacadista.jpg' },
  { id: 999, name: 'CALABRESA RETA SEARA 2.5 KILO', category: 'Derivados de Suíno', price: 48.87, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-seara-25-kilo-pmg-atacadista.jpg' },
  { id: 1000, name: 'CALABRESA SADIA 2.5 KILO', category: 'Derivados de Suíno', price: 55.84, image: 'https://www.marquesvendaspmg.shop/images/calabresa-sadia-25-kilo-pmg-atacadista.jpg' },
  { id: 1001, name: 'CALABRESA SEARA 2.5 KILO', category: 'Derivados de Suíno', price: 47.91, image: 'https://www.marquesvendaspmg.shop/images/calabresa-seara-25-kilo-pmg-atacadista.jpg' },
  { id: 1002, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1003, name: 'COPA FATIADA AURORA 100 G PCT', category: 'Derivados de Suíno', price: 5.92, image: 'https://www.marquesvendaspmg.shop/images/copa-fatiada-aurora-100-g-pct-pmg-atacadista.jpg' },
  { id: 1004, name: 'COSTELA SUÍNA CONGELADA COM OSSO AURORA 1.5 KG', category: 'Derivados de Suíno', price: 30.57, image: 'https://www.marquesvendaspmg.shop/images/costela-suina-congelada-com-osso-aurora-15-kg-pmg-atacadista.jpg' },
  { id: 1005, name: 'COSTELA SUÍNA CONGELADA COM OSSO FRIVATTI / FRIELLA 4 KG', category: 'Derivados de Suíno', price: 21.73, image: 'https://www.marquesvendaspmg.shop/images/costela-suina-congelada-com-osso-frivatti-friella-4-kg-pmg-atacadista.jpg' },
  { id: 1006, name: 'COSTELA SUÍNA CONGELADA TEMPERADA PAMPLONA 1 KG', category: 'Derivados de Suíno', price: 28.76, image: 'https://www.marquesvendaspmg.shop/images/costela-suina-congelada-temperada-pamplona-1-kg-pmg-atacadista.jpg' },
  { id: 1007, name: 'COSTELA SUÍNA SALGADA REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 127.81, image: 'https://www.marquesvendaspmg.shop/images/costela-suina-salgada-reffinato-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1008, name: 'FILÉ MIGNON SUÍNO CONGELADO TEMPERADO PAMPLONA 1.3 KG', category: 'Derivados de Suíno', price: 29.4, image: 'https://www.marquesvendaspmg.shop/images/file-mignon-suino-congelado-temperado-pamplona-13-kg-pmg-atacadista.jpg' },
  { id: 1009, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1010, name: 'LINGUIÇA SUÍNA CONGELADA COM ALHO SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 15.9, image: 'https://www.marquesvendaspmg.shop/images/linguica-suina-congelada-com-alho-sabor-de-braganca-500-g-pct-pmg-atacadista.jpg' },
  { id: 1011, name: 'LINGUIÇA SUÍNA CONGELADA COM AZEITONAS SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 15.9, image: 'https://www.marquesvendaspmg.shop/images/linguica-suina-congelada-com-azeitonas-sabor-de-braganca-500-g-pct-pmg-atacadista.jpg' },
  { id: 1012, name: 'LINGUIÇA SUÍNA CONGELADA COM BACON SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 15.86, image: 'https://www.marquesvendaspmg.shop/images/linguica-suina-congelada-com-bacon-sabor-de-braganca-500-g-pct-pmg-atacadista.jpg' },
  { id: 1013, name: 'LINGUIÇA SUÍNA CONGELADA COM PIMENTA SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 15.9, image: 'https://www.marquesvendaspmg.shop/images/linguica-suina-congelada-com-pimenta-sabor-de-braganca-500-g-pct-pmg-atacadista.jpg' },
  { id: 1014, name: 'LINGUIÇA SUÍNA CONGELADA COM PROVOLONE SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 15.9, image: 'https://www.marquesvendaspmg.shop/images/linguica-suina-congelada-com-provolone-sabor-de-braganca-500-g-pct-pmg-atacadista.jpg' },
  { id: 1015, name: 'LINGUIÇA SUÍNA CONGELADA CUIABANA COM QUEIJO SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 19.48, image: 'https://www.marquesvendaspmg.shop/images/linguica-suina-congelada-cuiabana-com-queijo-sabor-de-braganca-500-g-pct-pmg-atacadista.jpg' },
  { id: 1016, name: 'LINGUIÇA TOSCANA CONGELADA AURORA 5 KILO PCT', category: 'Derivados de Suíno', price: 123.92, image: 'https://www.marquesvendaspmg.shop/images/linguica-toscana-congelada-aurora-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1017, name: 'LINGUIÇA TOSCANA CONGELADA NA BRASA PERDIGÃO 5 KILO PCT', category: 'Derivados de Suíno', price: 122.51, image: 'https://www.marquesvendaspmg.shop/images/linguica-toscana-congelada-na-brasa-perdigao-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1018, name: 'LINGUIÇA TOSCANA CONGELADA SADIA 5 KILO PCT', category: 'Derivados de Suíno', price: 103.25, image: 'https://www.marquesvendaspmg.shop/images/linguica-toscana-congelada-sadia-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1019, name: 'LINGUIÇA TOSCANA CONGELADA SEARA 5 KILO PCT', category: 'Derivados de Suíno', price: 89.68, image: 'https://www.marquesvendaspmg.shop/images/linguica-toscana-congelada-seara-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1020, name: 'LOMBO CANADENSE AURORA 0.750G KG', category: 'Derivados de Suíno', price: 44.19, image: 'https://www.marquesvendaspmg.shop/images/lombo-canadense-aurora-0750g-kg-pmg-atacadista.jpg' },
  { id: 1021, name: 'LOMBO CANADENSE CERATTI 1 KG', category: 'Derivados de Suíno', price: 46.1, image: 'https://www.marquesvendaspmg.shop/images/lombo-canadense-ceratti-1-kg-pmg-atacadista.jpg' },
  { id: 1022, name: 'LOMBO CANADENSE DELI GOURMET 0.750G KG', category: 'Derivados de Suíno', price: 30.04, image: 'https://www.marquesvendaspmg.shop/images/lombo-canadense-deli-gourmet-0750g-kg-pmg-atacadista.jpg' },
  { id: 1023, name: 'LOMBO CANADENSE LACTOFRIOS  1 KG', category: 'Derivados de Suíno', price: 33.92, image: 'https://www.marquesvendaspmg.shop/images/lombo-canadense-lactofrios-1-kg-pmg-atacadista.jpg' },
  { id: 1024, name: 'LOMBO CANADENSE NOBRE  1 KG', category: 'Derivados de Suíno', price: 39.89, image: 'https://www.marquesvendaspmg.shop/images/lombo-canadense-nobre-1-kg-pmg-atacadista.jpg' },
  { id: 1025, name: 'LOMBO CANADENSE SEARA GOURMET  1 KG', category: 'Derivados de Suíno', price: 44.08, image: 'https://www.marquesvendaspmg.shop/images/lombo-canadense-seara-gourmet-1-kg-pmg-atacadista.jpg' },
  { id: 1026, name: 'LOMBO SUÍNO CONGELADO TEMPERADO PAMPLONA  1 KG', category: 'Derivados de Suíno', price: 29.4, image: 'https://www.marquesvendaspmg.shop/images/lombo-suino-congelado-temperado-pamplona-1-kg-pmg-atacadista.jpg' },
  { id: 1027, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1028, name: 'LOMBO SUÍNO SALGADO REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 146.35, image: 'https://www.marquesvendaspmg.shop/images/lombo-suino-salgado-reffinato-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1029, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1030, name: 'MORTADELA DEFUMADA OURO PERDIGÃO 4 KG', category: 'Derivados de Suíno', price: 23.39, image: 'https://www.marquesvendaspmg.shop/images/mortadela-defumada-ouro-perdigao-4-kg-pmg-atacadista.jpg' },
  { id: 1031, name: 'MORTADELA REZENDE 5 KG', category: 'Derivados de Suíno', price: 9.2, image: 'https://www.marquesvendaspmg.shop/images/mortadela-rezende-5-kg-pmg-atacadista.jpg' },
  { id: 1032, name: 'MORTADELA TRADICIONAL AURORA 5 KG', category: 'Derivados de Suíno', price: 11.99, image: 'https://www.marquesvendaspmg.shop/images/mortadela-tradicional-aurora-5-kg-pmg-atacadista.jpg' },
  { id: 1033, name: 'MORTADELA TRADICIONAL BOLOGNA CERATTI 6 KG', category: 'Derivados de Suíno', price: 45.26, image: 'https://www.marquesvendaspmg.shop/images/mortadela-tradicional-bologna-ceratti-6-kg-pmg-atacadista.jpg' },
  { id: 1034, name: 'MORTADELA TRADICIONAL MARBA 5 KG', category: 'Derivados de Suíno', price: 12.31, image: 'https://www.marquesvendaspmg.shop/images/mortadela-tradicional-marba-5-kg-pmg-atacadista.jpg' },
  { id: 1035, name: 'ORELHA SUÍNA SALGADA COM MÁSCARA FRIELLA 10 KILO PCT', category: 'Derivados de Suíno', price: 113.75, image: 'https://www.marquesvendaspmg.shop/images/orelha-suina-salgada-com-mascara-friella-10-kilo-pct-pmg-atacadista.jpg' },
  { id: 1036, name: 'ORELHA SUÍNA SALGADA COM MÁSCARA REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 69.66, image: 'https://www.marquesvendaspmg.shop/images/orelha-suina-salgada-com-mascara-reffinato-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1037, name: 'PAIO SUÍNO PAMPLONA 2.5 KILO PCT', category: 'Derivados de Suíno', price: 62.62, image: 'https://www.marquesvendaspmg.shop/images/paio-suino-pamplona-25-kilo-pct-pmg-atacadista.jpg' },
  { id: 1038, name: 'PAIO SUÍNO SEARA 2.5 KILO PCT', category: 'Derivados de Suíno', price: 55.8, image: 'https://www.marquesvendaspmg.shop/images/paio-suino-seara-25-kilo-pct-pmg-atacadista.jpg' },
  { id: 1039, name: 'PANCETA SUÍNA CONGELADA TEMPERADA APERITIVO FRIMESA 1 KILO PCT', category: 'Derivados de Suíno', price: 27.73, image: 'https://www.marquesvendaspmg.shop/images/panceta-suina-congelada-temperada-aperitivo-frimesa-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 1040, name: 'PANCETA SUÍNA CONGELADA TEMPERADA PAMPLONA 1 KG', category: 'Derivados de Suíno', price: 33.23, image: 'https://www.marquesvendaspmg.shop/images/panceta-suina-congelada-temperada-pamplona-1-kg-pmg-atacadista.jpg' },
  { id: 1041, name: 'PARMA PRESUNTO CRU DESOSSADO ITALIANO PANINI 1 KG', category: 'Derivados de Suíno', price: 140.59, image: 'https://www.marquesvendaspmg.shop/images/parma-presunto-cru-desossado-italiano-panini-1-kg-pmg-atacadista.jpg' },
  { id: 1042, name: 'PARMA PRESUNTO CRU FATIADO ITALIANO CERATTI 100 G PCT', category: 'Derivados de Suíno', price: 18.16, image: 'https://www.marquesvendaspmg.shop/images/parma-presunto-cru-fatiado-italiano-ceratti-100-g-pct-pmg-atacadista.jpg' },
  { id: 1043, name: 'PARMA PRESUNTO CRU FATIADO ITALIANO DOR 80 G PCT', category: 'Derivados de Suíno', price: 18.21, image: 'https://www.marquesvendaspmg.shop/images/parma-presunto-cru-fatiado-italiano-dor-80-g-pct-pmg-atacadista.jpg' },
  { id: 1044, name: 'PARMA PRESUNTO CRU FATIADO ITALIANO VITO BALDUCCI 500 G PCT', category: 'Derivados de Suíno', price: 66.84, image: 'https://www.marquesvendaspmg.shop/images/parma-presunto-cru-fatiado-italiano-vito-balducci-500-g-pct-pmg-atacadista.jpg' },
  { id: 1045, name: 'PARMA PRESUNTO CRU FATIADO NACIONAL SADIA 100 G PCT', category: 'Derivados de Suíno', price: 31.19, image: 'https://www.marquesvendaspmg.shop/images/parma-presunto-cru-fatiado-nacional-sadia-100-g-pct-pmg-atacadista.jpg' },
  { id: 1046, name: 'PÉ SUÍNO SALGADO FRIELLA 10 KILO PCT', category: 'Derivados de Suíno', price: 121.42, image: 'https://www.marquesvendaspmg.shop/images/pe-suino-salgado-friella-10-kilo-pct-pmg-atacadista.jpg' },
  { id: 1047, name: 'PÉ SUÍNO SALGADO REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 60.72, image: 'https://www.marquesvendaspmg.shop/images/pe-suino-salgado-reffinato-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1048, name: 'PEPPERONI FATIADO CERATTI 1 KILO PCT', category: 'Derivados de Suíno', price: 71.32, image: 'https://www.marquesvendaspmg.shop/images/pepperoni-fatiado-ceratti-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 1049, name: 'PEPPERONI FATIADO FRIMESA 1 KILO PCT', category: 'Derivados de Suíno', price: 31.89, image: 'https://www.marquesvendaspmg.shop/images/pepperoni-fatiado-frimesa-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 1050, name: 'PEPPERONI FATIADO SADIA 1 KILO PCT', category: 'Derivados de Suíno', price: 99.79, image: 'https://www.marquesvendaspmg.shop/images/pepperoni-fatiado-sadia-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 1051, name: 'PEPPERONI FATIADO SEARA GOURMET 100 G PCT', category: 'Derivados de Suíno', price: 10.43, image: 'https://www.marquesvendaspmg.shop/images/pepperoni-fatiado-seara-gourmet-100-g-pct-pmg-atacadista.jpg' },
  { id: 1052, name: 'PERNIL SUÍNO CONGELADO DESFIADO ALFAMA 1 KILO PCT', category: 'Derivados de Suíno', price: 38.42, image: 'https://www.marquesvendaspmg.shop/images/pernil-suino-congelado-desfiado-alfama-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 1053, name: 'PERNIL SUÍNO CONGELADO SEM OSSO E SEM COURO FRIVATTI / FRIELLA 12 KG', category: 'Derivados de Suíno', price: 19.27, image: 'https://www.marquesvendaspmg.shop/images/pernil-suino-congelado-sem-osso-e-sem-couro-frivatti-friella-12-kg-pmg-atacadista.jpg' },
  { id: 1054, name: 'PERNIL SUÍNO CONGELADO SEM OSSO TEMPERADO PAMPLONA 1 KG', category: 'Derivados de Suíno', price: 27.39, image: 'https://www.marquesvendaspmg.shop/images/pernil-suino-congelado-sem-osso-temperado-pamplona-1-kg-pmg-atacadista.jpg' },
  { id: 1055, name: 'PERNIL SUÍNO SALGADO REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 125.9, image: 'https://www.marquesvendaspmg.shop/images/pernil-suino-salgado-reffinato-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1056, name: 'PICANHA SUÍNA CONGELADA TEMPERADA PAMPLONA 1 KG', category: 'Derivados de Suíno', price: 33.23, image: 'https://www.marquesvendaspmg.shop/images/picanha-suina-congelada-temperada-pamplona-1-kg-pmg-atacadista.jpg' },
  { id: 1057, name: 'PORCO A PASSARINHO CONGELADO TEMPERADO FRIMESA 1 KILO PCT', category: 'Derivados de Suíno', price: 27.3, image: 'https://www.marquesvendaspmg.shop/images/porco-a-passarinho-congelado-temperado-frimesa-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 1058, name: 'PRESUNTO AURORA 3.5 KILO PÇ', category: 'Derivados de Suíno', price: 89.5, image: 'https://www.marquesvendaspmg.shop/images/presunto-aurora-35-kilo-pc-pmg-atacadista.jpg' },
  { id: 1059, name: 'PRESUNTO DÁLIA 3.3 KILO PÇ', category: 'Derivados de Suíno', price: 74.09, image: 'https://www.marquesvendaspmg.shop/images/presunto-dalia-33-kilo-pc-pmg-atacadista.jpg' },
  { id: 1060, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1061, name: 'PRESUNTO PERDIGÃO 3.4 KILO PÇ', category: 'Derivados de Suíno', price: 88.34, image: 'https://www.marquesvendaspmg.shop/images/presunto-perdigao-34-kilo-pc-pmg-atacadista.jpg' },
  { id: 1062, name: 'PRESUNTO PRIETO 3.35 KILO PÇ', category: 'Derivados de Suíno', price: 81.08, image: 'https://www.marquesvendaspmg.shop/images/presunto-prieto-335-kilo-pc-pmg-atacadista.jpg' },
  { id: 1063, name: 'PRESUNTO REZENDE 3.4 KILO PÇ', category: 'Derivados de Suíno', price: 76.33, image: 'https://www.marquesvendaspmg.shop/images/presunto-rezende-34-kilo-pc-pmg-atacadista.jpg' },
  { id: 1064, name: 'PRESUNTO SADIA 3.45 KILO PÇ', category: 'Derivados de Suíno', price: 102.21, image: 'https://www.marquesvendaspmg.shop/images/presunto-sadia-345-kilo-pc-pmg-atacadista.jpg' },
  { id: 1065, name: 'PRESUNTO SEARA 3.5 KILO PÇ', category: 'Derivados de Suíno', price: 83.01, image: 'https://www.marquesvendaspmg.shop/images/presunto-seara-35-kilo-pc-pmg-atacadista.jpg' },
  { id: 1066, name: 'RABO SUÍNO SALGADO COM SUAN REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 118.23, image: 'https://www.marquesvendaspmg.shop/images/rabo-suino-salgado-com-suan-reffinato-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1067, name: 'RABO SUÍNO SALGADO SEM SUAN FRIELLA 10 KILO PCT', category: 'Derivados de Suíno', price: 165.75, image: 'https://www.marquesvendaspmg.shop/images/rabo-suino-salgado-sem-suan-friella-10-kilo-pct-pmg-atacadista.jpg' },
  { id: 1068, name: 'ROSBEEF CERATTI 3 KILO PÇ', category: 'Derivados de Suíno', price: 267.88, image: 'https://www.marquesvendaspmg.shop/images/rosbeef-ceratti-3-kilo-pc-pmg-atacadista.jpg' },
  { id: 1069, name: 'SALAME HAMBURGUÊS FATIADO DEFUMADO CERATTI 100 G PCT', category: 'Derivados de Suíno', price: 12.22, image: 'https://www.marquesvendaspmg.shop/images/salame-hamburgues-fatiado-defumado-ceratti-100-g-pct-pmg-atacadista.jpg' },
  { id: 1070, name: 'SALAME ITALIANO DEFUMADO AURORA 0.600 G KG', category: 'Derivados de Suíno', price: 79.68, image: 'https://www.marquesvendaspmg.shop/images/salame-italiano-defumado-aurora-0600-g-kg-pmg-atacadista.jpg' },
  { id: 1071, name: 'SALAME ITALIANO DEFUMADO CERATTI 0.600 G KG', category: 'Derivados de Suíno', price: 88.55, image: 'https://www.marquesvendaspmg.shop/images/salame-italiano-defumado-ceratti-0600-g-kg-pmg-atacadista.jpg' },
  { id: 1072, name: 'SALAME ITALIANO FATIADO DEFUMADO CERATTI 100 G PCT', category: 'Derivados de Suíno', price: 12.22, image: 'https://www.marquesvendaspmg.shop/images/salame-italiano-fatiado-defumado-ceratti-100-g-pct-pmg-atacadista.jpg' },
  { id: 1073, name: 'SALAME ITALIANO SADIA 0.600 G KG', category: 'Derivados de Suíno', price: 85.11, image: 'https://www.marquesvendaspmg.shop/images/salame-italiano-sadia-0600-g-kg-pmg-atacadista.jpg' },
  { id: 1074, name: 'SALAME ITALIANO SEARA GOURMET 0.675 G KG', category: 'Derivados de Suíno', price: 71.99, image: 'https://www.marquesvendaspmg.shop/images/salame-italiano-seara-gourmet-0675-g-kg-pmg-atacadista.jpg' },
  { id: 1075, name: 'SALSICHA CONGELADA HOT DOG AURORA 3 KILO PCT', category: 'Derivados de Suíno', price: 36.96, image: 'https://www.marquesvendaspmg.shop/images/salsicha-congelada-hot-dog-aurora-3-kilo-pct-pmg-atacadista.jpg' },
  { id: 1076, name: 'SALSICHA CONGELADA HOT DOG ESTRELA 3 KILO PCT', category: 'Derivados de Suíno', price: 27.42, image: 'https://www.marquesvendaspmg.shop/images/salsicha-congelada-hot-dog-estrela-3-kilo-pct-pmg-atacadista.jpg' },
  { id: 1077, name: 'SALSICHA CONGELADA HOT DOG PERDIGÃO 5 KILO PCT', category: 'Derivados de Suíno', price: 70.29, image: 'https://www.marquesvendaspmg.shop/images/salsicha-congelada-hot-dog-perdigao-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1078, name: 'SALSICHA CONGELADA HOT DOG SADIA 3 KILO PCT', category: 'Derivados de Suíno', price: 38.64, image: 'https://www.marquesvendaspmg.shop/images/salsicha-congelada-hot-dog-sadia-3-kilo-pct-pmg-atacadista.jpg' },
  { id: 1079, name: 'SALSICHA CONGELADA HOT DOG SEARA 5 KILO PCT', category: 'Derivados de Suíno', price: 51.54, image: 'https://www.marquesvendaspmg.shop/images/salsicha-congelada-hot-dog-seara-5-kilo-pct-pmg-atacadista.jpg' },
  { id: 1080, name: 'TORRESMO PRÉ FRITO CHAPARRAL 500 G PCT', category: 'Derivados de Suíno', price: 17.94, image: 'https://www.marquesvendaspmg.shop/images/torresmo-pre-frito-chaparral-500-g-pct-pmg-atacadista.jpg' },
  { id: 1081, name: 'ACETO BALSÂMICO DI MODENA DI SALERNO 500 ML', category: 'Derivados de Vegetal', price: 22.47, image: 'https://www.marquesvendaspmg.shop/images/aceto-balsamico-di-modena-di-salerno-500-ml-pmg-atacadista.jpg' },
  { id: 1082, name: 'ACETO BALSÂMICO DI MODENA DON RAVELLO 500 ML', category: 'Derivados de Vegetal', price: 21.47, image: 'https://www.marquesvendaspmg.shop/images/aceto-balsamico-di-modena-don-ravello-500-ml-pmg-atacadista.jpg' },
  { id: 1083, name: 'ALCACHOFRA CORAÇÃO CORTADO DI SALERNO 2,5 KILO', category: 'Derivados de Vegetal', price: 76.96, image: 'https://www.marquesvendaspmg.shop/images/alcachofra-coracao-cortado-di-salerno-25-kilo-pmg-atacadista.jpg' },
  { id: 1084, name: 'ALCACHOFRA CORAÇÃO INTEIRO ARCO BELLO 2,5 KILO', category: 'Derivados de Vegetal', price: 91.72, image: 'https://www.marquesvendaspmg.shop/images/alcachofra-coracao-inteiro-arco-bello-25-kilo-pmg-atacadista.jpg' },
  { id: 1085, name: 'ALCACHOFRA CORAÇÃO INTEIRO DI SALERNO 2,5 KILO', category: 'Derivados de Vegetal', price: 103.08, image: 'https://www.marquesvendaspmg.shop/images/alcachofra-coracao-inteiro-di-salerno-25-kilo-pmg-atacadista.jpg' },
  { id: 1086, name: 'ALCACHOFRA FUNDO DI SALERNO 2,5 KILO', category: 'Derivados de Vegetal', price: 78.32, image: 'https://www.marquesvendaspmg.shop/images/alcachofra-fundo-di-salerno-25-kilo-pmg-atacadista.jpg' },
  { id: 1087, name: 'ALCAPARRA ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 96.37, image: 'https://www.marquesvendaspmg.shop/images/alcaparra-arco-bello-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1088, name: 'ALCAPARRA DI SALERNO 700 G', category: 'Derivados de Vegetal', price: 56.1, image: 'https://www.marquesvendaspmg.shop/images/alcaparra-di-salerno-700-g-pmg-atacadista.jpg' },
  { id: 1089, name: 'ALHO FRITO CROCANTE OISHII 500 G', category: 'Derivados de Vegetal', price: 32.92, image: 'https://www.marquesvendaspmg.shop/images/alho-frito-crocante-oishii-500-g-pmg-atacadista.jpg' },
  { id: 1090, name: 'ALHO FRITO FINO DELEON 500 G', category: 'Derivados de Vegetal', price: 27.26, image: 'https://www.marquesvendaspmg.shop/images/alho-frito-fino-deleon-500-g-pmg-atacadista.jpg' },
  { id: 1091, name: 'ALHO FRITO FINO ZAZO 500 G', category: 'Derivados de Vegetal', price: 21.16, image: 'https://www.marquesvendaspmg.shop/images/alho-frito-fino-zazo-500-g-pmg-atacadista.jpg' },
  { id: 1092, name: 'ALHO INTEIRO DESCASCADO CONGELADO EASY CHEF 1,1 KILO', category: 'Derivados de Vegetal', price: 23.41, image: 'https://www.marquesvendaspmg.shop/images/alho-inteiro-descascado-congelado-easy-chef-11-kilo-pmg-atacadista.jpg' },
  { id: 1093, name: 'ALHO INTEIRO DESCASCADO CONGELADO PRATIGEL 1,02 KILO', category: 'Derivados de Vegetal', price: 23.08, image: 'https://www.marquesvendaspmg.shop/images/alho-inteiro-descascado-congelado-pratigel-102-kilo-pmg-atacadista.jpg' },
  { id: 1094, name: 'ALHO TRITURADO DELEON 1 KILO', category: 'Derivados de Vegetal', price: 9.56, image: 'https://www.marquesvendaspmg.shop/images/alho-triturado-deleon-1-kilo-pmg-atacadista.jpg' },
  { id: 1095, name: 'ALHO TRITURADO GRANDE ARCO BELLO (BD 3 KILO)', category: 'Derivados de Vegetal', price: 25.05, image: 'https://www.marquesvendaspmg.shop/images/alho-triturado-grande-arco-bello-bd-3-kilo-pmg-atacadista.jpg' },
  { id: 1096, name: 'ALHO TRITURADO GRANDE DELEON 3 KILO', category: 'Derivados de Vegetal', price: 27.19, image: 'https://www.marquesvendaspmg.shop/images/alho-triturado-grande-deleon-3-kilo-pmg-atacadista.jpg' },
  { id: 1097, name: 'ANÉIS DE CEBOLA CONGELADOS PRÉ FRITOS EMPANADOS PRÉ FORMADOS BEM BRASIL 1,05 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 138.17, image: 'https://www.marquesvendaspmg.shop/images/aneis-de-cebola-congelados-pre-fritos-empanados-pre-formados-bem-brasil-105-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1098, name: 'ANÉIS DE CEBOLA CONGELADOS PRÉ FRITOS EMPANADOS PRÉ FORMADOS MCCAIN 1,05 KILO (CX 10 PCT)', category: 'Derivados de Vegetal', price: 226.29, image: 'https://www.marquesvendaspmg.shop/images/aneis-de-cebola-congelados-pre-fritos-empanados-pre-formados-mccain-105-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1099, name: 'ANÉIS DE CEBOLA CONGELADOS PRÉ FRITOS EMPANADOS PRÉ FORMADOS MORIXE 1,1 KILO (CX 10 PCT)', category: 'Derivados de Vegetal', price: 223.68, image: 'https://www.marquesvendaspmg.shop/images/aneis-de-cebola-congelados-pre-fritos-empanados-pre-formados-morixe-11-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1100, name: 'ARROZ 7 GRÃOS INTEGRAIS CAMIL 1 KILO', category: 'Derivados de Vegetal', price: 13.57, image: 'https://www.marquesvendaspmg.shop/images/arroz-7-graos-integrais-camil-1-kilo-pmg-atacadista.jpg' },
  { id: 1101, name: 'ARROZ ARBÓRIO DI CASTELLI 1 KILO', category: 'Derivados de Vegetal', price: 23.24, image: 'https://www.marquesvendaspmg.shop/images/arroz-arborio-di-castelli-1-kilo-pmg-atacadista.jpg' },
  { id: 1102, name: 'ARROZ ARBÓRIO DI SALERNO 1 KILO', category: 'Derivados de Vegetal', price: 24.73, image: 'https://www.marquesvendaspmg.shop/images/arroz-arborio-di-salerno-1-kilo-pmg-atacadista.jpg' },
  { id: 1103, name: 'ARROZ BASMATI CAMIL 500 G', category: 'Derivados de Vegetal', price: 15.98, image: 'https://www.marquesvendaspmg.shop/images/arroz-basmati-camil-500-g-pmg-atacadista.jpg' },
  { id: 1104, name: 'ARROZ BRANCO PEQUENO TIPO 1 CAMIL 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 74.68, image: 'https://www.marquesvendaspmg.shop/images/arroz-branco-pequeno-tipo-1-camil-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1105, name: 'ARROZ BRANCO TIPO 1 FOOD SERVICE CAMIL 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 131.43, image: 'https://www.marquesvendaspmg.shop/images/arroz-branco-tipo-1-food-service-camil-5-kilo-fdo-6-pct-pmg-atacadista.jpg' },
  { id: 1106, name: 'ARROZ BRANCO TIPO 1 NAMORADO 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 129.1, image: 'https://www.marquesvendaspmg.shop/images/arroz-branco-tipo-1-namorado-5-kilo-fdo-6-pct-pmg-atacadista.jpg' },
  { id: 1107, name: 'ARROZ BRANCO TIPO 1 SOLITO 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 127.89, image: 'https://www.marquesvendaspmg.shop/images/arroz-branco-tipo-1-solito-5-kilo-fdo-6-pct-pmg-atacadista.jpg' },
  { id: 1108, name: 'ARROZ INTEGRAL CAMIL 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 64.37, image: 'https://www.marquesvendaspmg.shop/images/arroz-integral-camil-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1109, name: 'ARROZ INTEGRAL FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 66.24, image: 'https://www.marquesvendaspmg.shop/images/arroz-integral-food-service-camil-2-kilo-fdo-5-pct-pmg-atacadista.jpg' },
  { id: 1110, name: 'ARROZ PARBOILIZADO TIPO 1 FOOD SERVICE CAMIL 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 178.57, image: 'https://www.marquesvendaspmg.shop/images/arroz-parboilizado-tipo-1-food-service-camil-5-kilo-fdo-6-pct-pmg-atacadista.jpg' },
  { id: 1111, name: 'ARROZ PARBOILIZADO TIPO 1 NAMORADO 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 122.74, image: 'https://www.marquesvendaspmg.shop/images/arroz-parboilizado-tipo-1-namorado-5-kilo-fdo-6-pct-pmg-atacadista.jpg' },
  { id: 1112, name: 'ARROZ RISOTOS CULINÁRIA ITALIANA FOOD SERVICE CAMIL 2 KILO', category: 'Derivados de Vegetal', price: 33.52, image: 'https://www.marquesvendaspmg.shop/images/arroz-risotos-culinaria-italiana-food-service-camil-2-kilo-pmg-atacadista.jpg' },
  { id: 1113, name: 'ASPARGOS BRANCO DI SALERNO 395 G', category: 'Derivados de Vegetal', price: 48.17, image: 'https://www.marquesvendaspmg.shop/images/aspargos-branco-di-salerno-395-g-pmg-atacadista.jpg' },
  { id: 1114, name: 'AZEITE COMPOSTO 30% OLIVA E SOJA LISBOA 500 ML', category: 'Derivados de Vegetal', price: 12.57, image: 'https://www.marquesvendaspmg.shop/images/azeite-composto-30-oliva-e-soja-lisboa-500-ml-pmg-atacadista.jpg' },
  { id: 1115, name: 'AZEITE COMPOSTO 50% DE OLIVA E GIRASSOL LISBOA 500 ML', category: 'Derivados de Vegetal', price: 13.44, image: 'https://www.marquesvendaspmg.shop/images/azeite-composto-50-de-oliva-e-girassol-lisboa-500-ml-pmg-atacadista.jpg' },
  { id: 1116, name: 'AZEITE COMPOSTO OLIVA E SOJA CARMELITA 500 ML', category: 'Derivados de Vegetal', price: 17.63, image: 'https://www.marquesvendaspmg.shop/images/azeite-composto-oliva-e-soja-carmelita-500-ml-pmg-atacadista.jpg' },
  { id: 1117, name: 'AZEITE COMPOSTO OLIVA E SOJA FAISÃO 500 ML', category: 'Derivados de Vegetal', price: 10.12, image: 'https://www.marquesvendaspmg.shop/images/azeite-composto-oliva-e-soja-faisao-500-ml-pmg-atacadista.jpg' },
  { id: 1118, name: 'AZEITE COMPOSTO OLIVA E SOJA MARIA 500 ML', category: 'Derivados de Vegetal', price: 17.59, image: 'https://www.marquesvendaspmg.shop/images/azeite-composto-oliva-e-soja-maria-500-ml-pmg-atacadista.jpg' },
  { id: 1119, name: 'AZEITE COMPOSTO TEMPERO CEBOLA E ALHO LISBOA BLEND 500 ML', category: 'Derivados de Vegetal', price: 15.79, image: 'https://www.marquesvendaspmg.shop/images/azeite-composto-tempero-cebola-e-alho-lisboa-blend-500-ml-pmg-atacadista.jpg' },
  { id: 1120, name: 'AZEITE DE OLIVA EXTRA VIRGEM ANDORINHA 500 ML', category: 'Derivados de Vegetal', price: 31.32, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-extra-virgem-andorinha-500-ml-pmg-atacadista.jpg' },
  { id: 1121, name: 'AZEITE DE OLIVA EXTRA VIRGEM COCINERO 500 ML', category: 'Derivados de Vegetal', price: 28.05, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-extra-virgem-cocinero-500-ml-pmg-atacadista.jpg' },
  { id: 1122, name: 'AZEITE DE OLIVA EXTRA VIRGEM GALLO 500 ML', category: 'Derivados de Vegetal', price: 36.81, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-extra-virgem-gallo-500-ml-pmg-atacadista.jpg' },
  { id: 1123, name: 'AZEITE DE OLIVA EXTRA VIRGEM MORIXE 500 ML', category: 'Derivados de Vegetal', price: 35.4, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-extra-virgem-morixe-500-ml-pmg-atacadista.jpg' },
  { id: 1124, name: 'AZEITE DE OLIVA GRANDE EXTRA VIRGEM GALLO 5 L (CX 2 GL)', category: 'Derivados de Vegetal', price: 337.45, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-grande-extra-virgem-gallo-5-l-cx-2-gl-pmg-atacadista.jpg' },
  { id: 1125, name: 'AZEITE DE OLIVA GRANDE EXTRA VIRGEM REY 5,01 L (CX 3 GL)', category: 'Derivados de Vegetal', price: 286.39, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-grande-extra-virgem-rey-501-l-cx-3-gl-pmg-atacadista.jpg' },
  { id: 1126, name: 'AZEITE DE OLIVA GRANDE EXTRA VIRGEM TERRANO 5,01 L (CX 3 GL)', category: 'Derivados de Vegetal', price: 361.4, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-grande-extra-virgem-terrano-501-l-cx-3-gl-pmg-atacadista.jpg' },
  { id: 1127, name: 'AZEITE DE OLIVA MÉDIO EXTRA VIRGEM GALLO 2 L (CX 6 GL)', category: 'Derivados de Vegetal', price: 136.32, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-medio-extra-virgem-gallo-2-l-cx-6-gl-pmg-atacadista.jpg' },
  { id: 1128, name: 'AZEITE DE OLIVA PEQUENO EXTRA VIRGEM GALLO 250 ML', category: 'Derivados de Vegetal', price: 19.96, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-pequeno-extra-virgem-gallo-250-ml-pmg-atacadista.jpg' },
  { id: 1129, name: 'AZEITE DE OLIVA SACHÊ BOM SABOR 4 ML (CX 200 UN)', category: 'Derivados de Vegetal', price: 130.67, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-sache-bom-sabor-4-ml-cx-200-un-pmg-atacadista.jpg' },
  { id: 1130, name: 'AZEITE DE OLIVA SACHÊ EKMA 4 ML (CX 120 UN)', category: 'Derivados de Vegetal', price: 80.11, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-sache-ekma-4-ml-cx-120-un-pmg-atacadista.jpg' },
  { id: 1131, name: 'AZEITE DE OLIVA TIPO ÚNICO GALLO 500 ML', category: 'Derivados de Vegetal', price: 29.44, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-tipo-unico-gallo-500-ml-pmg-atacadista.jpg' },
  { id: 1132, name: 'AZEITE DENDÊ CEPÊRA 900 ML', category: 'Derivados de Vegetal', price: 30.37, image: 'https://www.marquesvendaspmg.shop/images/azeite-dende-cepera-900-ml-pmg-atacadista.jpg' },
  { id: 1133, name: 'AZEITE GRANDE COMPOSTO 30% OLIVA E SOJA LISBOA 5,02 L', category: 'Derivados de Vegetal', price: 66.95, image: 'https://www.marquesvendaspmg.shop/images/azeite-grande-composto-30-oliva-e-soja-lisboa-502-l-pmg-atacadista.jpg' },
  { id: 1134, name: 'AZEITE GRANDE COMPOSTO 50% OLIVA E GIRASSOL LISBOA 5,02 L', category: 'Derivados de Vegetal', price: 84.23, image: 'https://www.marquesvendaspmg.shop/images/azeite-grande-composto-50-oliva-e-girassol-lisboa-502-l-pmg-atacadista.jpg' },
  { id: 1135, name: 'AZEITONA PRETA FATIADA ARCO BELLO (BD 1,8 KILO)', category: 'Derivados de Vegetal', price: 77.1, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-fatiada-arco-bello-bd-18-kilo-pmg-atacadista.jpg' },
  { id: 1136, name: 'AZEITONA PRETA FATIADA COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 87.73, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-fatiada-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1137, name: 'AZEITONA PRETA FATIADA RAINHA (BD 1,8 KILO)', category: 'Derivados de Vegetal', price: 77.89, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-fatiada-rainha-bd-18-kilo-pmg-atacadista.jpg' },
  { id: 1138, name: 'AZEITONA PRETA GRAÚDA 11 X 13 AZAPA COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 116.97, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-grauda-11-x-13-azapa-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1139, name: 'AZEITONA PRETA GRAÚDA 12 X 16 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 83.74, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-grauda-12-x-16-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1140, name: 'AZEITONA PRETA GRAÚDA 9 X 11 AZAPA ARCO BELLO 2 KILO', category: 'Derivados de Vegetal', price: 120.96, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-grauda-9-x-11-azapa-arco-bello-2-kilo-pmg-atacadista.jpg' },
  { id: 1141, name: 'AZEITONA PRETA MÉDIA 20 X 24 ARCO BELLO 2 KILO', category: 'Derivados de Vegetal', price: 87.73, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-media-20-x-24-arco-bello-2-kilo-pmg-atacadista.jpg' },
  { id: 1142, name: 'AZEITONA PRETA MÉDIA 20 X 24 TOZZI 2 KILO', category: 'Derivados de Vegetal', price: 63.67, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-media-20-x-24-tozzi-2-kilo-pmg-atacadista.jpg' },
  { id: 1143, name: 'AZEITONA PRETA MÉDIA 24 X 28 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 79.76, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-media-24-x-28-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1144, name: 'AZEITONA PRETA MIÚDA 45 X 50 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 83.74, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-miuda-45-x-50-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1145, name: 'AZEITONA PRETA SEM CAROÇO ARCO BELLO 1,8 KILO', category: 'Derivados de Vegetal', price: 90.39, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-sem-caroco-arco-bello-18-kilo-pmg-atacadista.jpg' },
  { id: 1146, name: 'AZEITONA PRETA SEM CAROÇO COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 91.72, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-sem-caroco-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1147, name: 'AZEITONA VERDE FATIADA ARCO BELLO (BD 1,8 KILO)', category: 'Derivados de Vegetal', price: 60.22, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-fatiada-arco-bello-bd-18-kilo-pmg-atacadista.jpg' },
  { id: 1148, name: 'AZEITONA VERDE FATIADA COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 69.12, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-fatiada-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1149, name: 'AZEITONA VERDE FATIADA RAINHA (BD 1,8 KILO)', category: 'Derivados de Vegetal', price: 59.19, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-fatiada-rainha-bd-18-kilo-pmg-atacadista.jpg' },
  { id: 1150, name: 'AZEITONA VERDE GRAÚDA 16 X 20 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 57.82, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-grauda-16-x-20-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1151, name: 'AZEITONA VERDE MÉDIA 24 X 28 ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 55.7, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-24-x-28-arco-bello-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1152, name: 'AZEITONA VERDE MÉDIA 24 X 28 COLOSSO (BD GRANDE 15 KILO)', category: 'Derivados de Vegetal', price: 385.48, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-24-x-28-colosso-bd-grande-15-kilo-pmg-atacadista.jpg' },
  { id: 1153, name: 'AZEITONA VERDE MÉDIA 24 X 28 COLOSSO (BD MÉDIO 7,5 KILO)', category: 'Derivados de Vegetal', price: 179.45, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-24-x-28-colosso-bd-medio-75-kilo-pmg-atacadista.jpg' },
  { id: 1154, name: 'AZEITONA VERDE MÉDIA 24 X 28 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 52.51, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-24-x-28-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1155, name: 'AZEITONA VERDE MÉDIA 24 X 28 NUCETE 1,01 KILO', category: 'Derivados de Vegetal', price: 25.26, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-24-x-28-nucete-101-kilo-pmg-atacadista.jpg' },
  { id: 1156, name: 'AZEITONA VERDE MÉDIA 24 X 28 TOZZI 2 KILO', category: 'Derivados de Vegetal', price: 43.01, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-24-x-28-tozzi-2-kilo-pmg-atacadista.jpg' },
  { id: 1157, name: 'AZEITONA VERDE MÉDIA 28 X 32 ARCO BELLO (BARRICA 40 KILO)', category: 'Derivados de Vegetal', price: 917.18, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-28-x-32-arco-bello-barrica-40-kilo-pmg-atacadista.jpg' },
  { id: 1158, name: 'AZEITONA VERDE MÉDIA 32 X 45 RAINHA (BD 2 KILO)', category: 'Derivados de Vegetal', price: 45.91, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-32-x-45-rainha-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1159, name: 'AZEITONA VERDE MIÚDA 40 X 50 ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 39.88, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-miuda-40-x-50-arco-bello-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1160, name: 'AZEITONA VERDE MIÚDA 45 X 50 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 42.54, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-miuda-45-x-50-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1161, name: 'AZEITONA VERDE MIÚDA 45 X 50 RAINHA (BD 2 KILO)', category: 'Derivados de Vegetal', price: 36.59, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-miuda-45-x-50-rainha-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1162, name: 'AZEITONA VERDE RECHEADA COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 79.76, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-recheada-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1163, name: 'AZEITONA VERDE SEM CAROÇO ARCO BELLO 1,8 KILO', category: 'Derivados de Vegetal', price: 62.98, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-sem-caroco-arco-bello-18-kilo-pmg-atacadista.jpg' },
  { id: 1164, name: 'AZEITONA VERDE SEM CAROÇO COLOSSO (BD GRANDE 14 KILO)', category: 'Derivados de Vegetal', price: 465.24, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-sem-caroco-colosso-bd-grande-14-kilo-pmg-atacadista.jpg' },
  { id: 1165, name: 'AZEITONA VERDE SEM CAROÇO COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 71.78, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-sem-caroco-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1166, name: 'AZEITONA VERDE SEM CAROÇO RAINHA (BD 1,8 KILO)', category: 'Derivados de Vegetal', price: 62.35, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-sem-caroco-rainha-bd-18-kilo-pmg-atacadista.jpg' },
  { id: 1167, name: 'BATATA CONGELADA CARINHAS BEM BRASIL 1,05 KILO (CX 10 PCT)', category: 'Derivados de Vegetal', price: 119.34, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-carinhas-bem-brasil-105-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1168, name: 'BATATA CONGELADA PRÉ FRITA COM CASCA DIPPERS CANOA TEMPERADA LAMBWESTON 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 183.64, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-com-casca-dippers-canoa-temperada-lambweston-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1169, name: 'BATATA CONGELADA PRÉ FRITA COM CASCA RÚSTICA CORTE CASEIRO BEM BRASIL 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 224.32, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-com-casca-rustica-corte-caseiro-bem-brasil-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1170, name: 'BATATA CONGELADA PRÉ FRITA COM CASCA RÚSTICA SKIN ON WEDGES MCCAIN 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 229.68, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-com-casca-rustica-skin-on-wedges-mccain-25-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1171, name: 'BATATA CONGELADA PRÉ FRITA COM CASCA RÚSTICA SURECRISP CRISPERS MCCAIN 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 258.12, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-com-casca-rustica-surecrisp-crispers-mccain-25-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1172, name: 'BATATA CONGELADA PRÉ FRITA COM CASCA RÚSTICA WEDGES TEMPERADA E ONDULADA LAMBWESTON 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 165.09, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-com-casca-rustica-wedges-temperada-e-ondulada-lambweston-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1173, name: 'BATATA CONGELADA PRÉ FRITA CRISSCUT CORTE XADREX TEMPERADA LAMBWESTON 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 191.29, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-crisscut-corte-xadrex-temperada-lambweston-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1174, name: 'BATATA CONGELADA PRÉ FRITA FRY N DIP CANOA MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 295.31, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-fry-n-dip-canoa-mccain-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1175, name: 'BATATA CONGELADA PRÉ FRITA HASH BROWN BEM BRASIL 1,06 KILO', category: 'Derivados de Vegetal', price: 214.82, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-hash-brown-bem-brasil-106-kilo-pmg-atacadista.jpg' },
  { id: 1176, name: 'BATATA CONGELADA PRÉ FRITA MAXI CHIPS MCCAIN 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 315, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-maxi-chips-mccain-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1177, name: 'BATATA CONGELADA PRÉ FRITA NOISETTES MCCAIN 2,5 KILO (CX 4 PCT)', category: 'Derivados de Vegetal', price: 224.8, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-noisettes-mccain-25-kilo-cx-4-pct-pmg-atacadista.jpg' },
  { id: 1178, name: 'BATATA CONGELADA PRÉ FRITA SMILES SORRISO MCCAIN 1,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 202.32, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-smiles-sorriso-mccain-15-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1179, name: 'BATATA PALHA EXTRAFINA DA TERRINHA 100 G', category: 'Derivados de Vegetal', price: 7.03, image: 'https://www.marquesvendaspmg.shop/images/batata-palha-extrafina-da-terrinha-100-g-pmg-atacadista.jpg' },
  { id: 1180, name: 'BATATA PALHA EXTRAFINA KISABOR 100 G', category: 'Derivados de Vegetal', price: 6.1, image: 'https://www.marquesvendaspmg.shop/images/batata-palha-extrafina-kisabor-100-g-pmg-atacadista.jpg' },
  { id: 1181, name: 'BATATA PALHA EXTRAFINA KROCK 500 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 15.87, image: 'https://www.marquesvendaspmg.shop/images/batata-palha-extrafina-krock-500-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1182, name: 'BATATA PALHA TRADICIONAL KISABOR 100 G', category: 'Derivados de Vegetal', price: 5.91, image: 'https://www.marquesvendaspmg.shop/images/batata-palha-tradicional-kisabor-100-g-pmg-atacadista.jpg' },
  { id: 1183, name: 'BATATA PALHA TRADICIONAL KROCK 500 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 15.87, image: 'https://www.marquesvendaspmg.shop/images/batata-palha-tradicional-krock-500-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1184, name: 'BATATA PALHA TRADICIONAL YOKI 105 G', category: 'Derivados de Vegetal', price: 8.74, image: 'https://www.marquesvendaspmg.shop/images/batata-palha-tradicional-yoki-105-g-pmg-atacadista.jpg' },
  { id: 1185, name: 'BATATA PALITO CONGELADA PRÉ FRITA 10 MM CORTE TRADICIONAL "EXTRA CRUNCH" SIMPLOT 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 230.4, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-10-mm-corte-tradicional-extra-crunch-simplot-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1186, name: 'BATATA PALITO CONGELADA PRÉ FRITA 10 MM CORTE TRADICIONAL RAPIPAP 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 143.96, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-10-mm-corte-tradicional-rapipap-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1187, name: 'BATATA PALITO CONGELADA PRÉ FRITA 10 MM CORTE TRADICIONAL SIMPLOT 2 KILO (CX 7 PCT)', category: 'Derivados de Vegetal', price: 176.16, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-10-mm-corte-tradicional-simplot-2-kilo-cx-7-pct-pmg-atacadista.jpg' },
  { id: 1188, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO "EXTRA CRUNCH" SIMPLOT 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 204.49, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-extra-crunch-simplot-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1189, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO "EXTRA CRUNCH" SKIN ON SIMPLOT 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 154.01, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-extra-crunch-skin-on-simplot-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1190, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO FAST FOOD BEM BRASIL 2 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 71.4, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-fast-food-bem-brasil-2-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1191, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO FAST FOOD BEM BRASIL 2 KILO (CX 7 PCT)', category: 'Derivados de Vegetal', price: 193.75, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-fast-food-bem-brasil-2-kilo-cx-7-pct-pmg-atacadista.jpg' },
  { id: 1192, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO FAST FOOD CRISPY BEM BRASIL 2 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 200.49, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-fast-food-crispy-bem-brasil-2-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1193, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO FAST FOOD MCCAIN 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 222.93, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-fast-food-mccain-225-kilo-cx-8-pct-pmg-atacadista.jpg' },
  { id: 1194, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO LAMBWESTON 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 220.68, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-lambweston-225-kilo-cx-8-pct-pmg-atacadista.jpg' },
  { id: 1195, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO MCCAIN 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 280.12, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-mccain-225-kilo-cx-8-pct-pmg-atacadista.jpg' },
  { id: 1196, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO MCCAIN 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 214.59, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-mccain-25-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1197, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO SIMPLOT 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 244.28, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-simplot-225-kilo-cx-8-pct-pmg-atacadista.jpg' },
  { id: 1198, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO SURECRISP EXTRA CROCANTE MCCAIN 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 214.59, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-surecrisp-extra-crocante-mccain-225-kilo-cx-8-pct-pmg-atacadista.jpg' },
  { id: 1199, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL CANÇÃO 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 92.12, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-cancao-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1200, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL HARVEST PRIDE RÚSTICA MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 254.75, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-harvest-pride-rustica-mccain-25-kilo-cx-6-p-pmg-atacadista.jpg' },
  { id: 1201, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL LAMBWESTON 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 220.36, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-lambweston-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1202, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL MAIS BATATA BEM BRASIL 2 KILO (CX 7 PCT)', category: 'Derivados de Vegetal', price: 150.2, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-mais-batata-bem-brasil-2-kilo-cx-7-pct-pmg-atacadista.jpg' },
  { id: 1203, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 226.36, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-mccain-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1204, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL ONE FRY MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 170.17, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-one-fry-mccain-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1205, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL SKIN ON SIMPLOT 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 135.88, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-skin-on-simplot-25-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1206, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL STEALTH FRIES COBERTURA CROCANTE "COM CASCA" LAMBWESTON 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 140.33, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-stealth-fries-cobertura-crocante-com-casca--pmg-atacadista.jpg' },
  { id: 1207, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL STEALTH FRIES COBERTURA CROCANTE "SEM CASCA" LAMBWESTON 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 137.69, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-stealth-fries-cobertura-crocante-sem-casca--pmg-atacadista.jpg' },
  { id: 1208, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL SURECRISP EXTRA CROCANTE MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 241.95, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-surecrisp-extra-crocante-mccain-25-kilo-cx--pmg-atacadista.jpg' },
  { id: 1209, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL UAI BEM BRASIL 2 KILO (CX 7 PCT)', category: 'Derivados de Vegetal', price: 141.61, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-uai-bem-brasil-2-kilo-cx-7-pct-pmg-atacadista.jpg' },
  { id: 1210, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 X 18 MM STEAKHOUSE CORTE ESPECIAL BEM BRASIL 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 220.73, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-x-18-mm-steakhouse-corte-especial-bem-brasil-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1211, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 X 18 MM STEAKHOUSE LAMBWESTON 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 170.17, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-x-18-mm-steakhouse-lambweston-25-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1212, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 X 18 MM STEAKHOUSE SIMPLOT 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 151.31, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-x-18-mm-steakhouse-simplot-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1213, name: 'BATATA PALITO CONGELADA PRÉ FRITA CRINKLE FRIES ONDULADA MCCAIN 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 206.73, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-crinkle-fries-ondulada-mccain-25-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1214, name: 'BATATA PALITO CONGELADA PRÉ FRITA CRINKLE ONDULADA BEM BRASIL 2 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 179.45, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-crinkle-ondulada-bem-brasil-2-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1215, name: 'BATATA PALITO CONGELADA PRÉ FRITA CRINKLE SURECRISP TEMPERADA MCCAIN 2,5 KILO (CX 4 PCT)', category: 'Derivados de Vegetal', price: 208.95, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-crinkle-surecrisp-temperada-mccain-25-kilo-cx-4-pct-pmg-atacadista.jpg' },
  { id: 1216, name: 'BERINJELA A GENOVESE REFOGADA RG 500 G', category: 'Derivados de Vegetal', price: 39.86, image: 'https://www.marquesvendaspmg.shop/images/berinjela-a-genovese-refogada-rg-500-g-pmg-atacadista.jpg' },
  { id: 1217, name: 'BRÓCOLIS CONGELADO AGRO YOSHI 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 124.68, image: 'https://www.marquesvendaspmg.shop/images/brocolis-congelado-agro-yoshi-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1218, name: 'BRÓCOLIS CONGELADO GRANO 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 127.33, image: 'https://www.marquesvendaspmg.shop/images/brocolis-congelado-grano-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1219, name: 'BRÓCOLIS CONGELADO PRATIGEL 1,02 KILO (CX 10 PCT)', category: 'Derivados de Vegetal', price: 161.21, image: 'https://www.marquesvendaspmg.shop/images/brocolis-congelado-pratigel-102-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1220, name: 'CAFÉ EXTRA FORTE ALMOFADA BOM JESUS 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 240.38, image: 'https://www.marquesvendaspmg.shop/images/cafe-extra-forte-almofada-bom-jesus-500-g-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1221, name: 'CAFÉ EXTRA FORTE ALMOFADA COAMO 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 279.93, image: 'https://www.marquesvendaspmg.shop/images/cafe-extra-forte-almofada-coamo-500-g-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1222, name: 'CAFÉ EXTRA FORTE ALMOFADA SELETO 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 249.64, image: 'https://www.marquesvendaspmg.shop/images/cafe-extra-forte-almofada-seleto-500-g-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1223, name: 'CAFÉ EXTRA FORTE ALMOFADA SOLLUS 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 235.06, image: 'https://www.marquesvendaspmg.shop/images/cafe-extra-forte-almofada-sollus-500-g-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1224, name: 'CAFÉ EXTRA FORTE ALMOFADA UNIÃO 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 301.92, image: 'https://www.marquesvendaspmg.shop/images/cafe-extra-forte-almofada-uniao-500-g-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1225, name: 'CAFÉ TRADICIONAL ALMOFADA BOM JESUS 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 325.35, image: 'https://www.marquesvendaspmg.shop/images/cafe-tradicional-almofada-bom-jesus-500-g-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1226, name: 'CAFÉ TRADICIONAL ALMOFADA COAMO 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 275.05, image: 'https://www.marquesvendaspmg.shop/images/cafe-tradicional-almofada-coamo-500-g-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1227, name: 'CAFÉ TRADICIONAL ALMOFADA MELITTA 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 364.31, image: 'https://www.marquesvendaspmg.shop/images/cafe-tradicional-almofada-melitta-500-g-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1228, name: 'CAFÉ TRADICIONAL ALMOFADA PILÃO 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 371.62, image: 'https://www.marquesvendaspmg.shop/images/cafe-tradicional-almofada-pilao-500-g-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1229, name: 'CAFÉ TRADICIONAL ALMOFADA SELETO 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 249.64, image: 'https://www.marquesvendaspmg.shop/images/cafe-tradicional-almofada-seleto-500-g-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1230, name: 'CAFÉ TRADICIONAL ALMOFADA UNIÃO 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 301.92, image: 'https://www.marquesvendaspmg.shop/images/cafe-tradicional-almofada-uniao-500-g-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1231, name: 'CATCHUP CEPÊRA 3,5 KILO', category: 'Derivados de Vegetal', price: 29.48, image: 'https://www.marquesvendaspmg.shop/images/catchup-cepera-35-kilo-pmg-atacadista.jpg' },
  { id: 1232, name: 'CATCHUP EKMA 3,3 KILO', category: 'Derivados de Vegetal', price: 22.27, image: 'https://www.marquesvendaspmg.shop/images/catchup-ekma-33-kilo-pmg-atacadista.jpg' },
  { id: 1233, name: 'CATCHUP EKMA 950 G', category: 'Derivados de Vegetal', price: 7.2, image: 'https://www.marquesvendaspmg.shop/images/catchup-ekma-950-g-pmg-atacadista.jpg' },
  { id: 1234, name: 'CATCHUP GRANDE HEINZ 2 KILO', category: 'Derivados de Vegetal', price: 32.66, image: 'https://www.marquesvendaspmg.shop/images/catchup-grande-heinz-2-kilo-pmg-atacadista.jpg' },
  { id: 1235, name: 'CATCHUP GRANDE HEMMER 3,8 KILO', category: 'Derivados de Vegetal', price: 35.95, image: 'https://www.marquesvendaspmg.shop/images/catchup-grande-hemmer-38-kilo-pmg-atacadista.jpg' },
  { id: 1236, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1237, name: 'CATCHUP KISABOR 1,01 KILO', category: 'Derivados de Vegetal', price: 6.75, image: 'https://www.marquesvendaspmg.shop/images/catchup-kisabor-101-kilo-pmg-atacadista.jpg' },
  { id: 1238, name: 'CATCHUP LANCHERO 3 KILO (FD 6 GL)', category: 'Derivados de Vegetal', price: 12.75, image: 'https://www.marquesvendaspmg.shop/images/catchup-lanchero-3-kilo-fd-6-gl-pmg-atacadista.jpg' },
  { id: 1239, name: 'CATCHUP MÉDIO HEINZ 1,033 KILO', category: 'Derivados de Vegetal', price: 17.7, image: 'https://www.marquesvendaspmg.shop/images/catchup-medio-heinz-1033-kilo-pmg-atacadista.jpg' },
  { id: 1240, name: 'CATCHUP PEQUENO CEPÊRA 1,01 KILO', category: 'Derivados de Vegetal', price: 9.76, image: 'https://www.marquesvendaspmg.shop/images/catchup-pequeno-cepera-101-kilo-pmg-atacadista.jpg' },
  { id: 1241, name: 'CATCHUP PEQUENO HEINZ 397 G (CX 16 FR)', category: 'Derivados de Vegetal', price: 197.95, image: 'https://www.marquesvendaspmg.shop/images/catchup-pequeno-heinz-397-g-cx-16-fr-pmg-atacadista.jpg' },
  { id: 1242, name: 'CATCHUP PEQUENO HEMMER 1 KILO', category: 'Derivados de Vegetal', price: 13.57, image: 'https://www.marquesvendaspmg.shop/images/catchup-pequeno-hemmer-1-kilo-pmg-atacadista.jpg' },
  { id: 1243, name: 'CATCHUP SACHÊ CEPÊRA 7 G (CX 175 UN)', category: 'Derivados de Vegetal', price: 19.42, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg' },
  { id: 1244, name: 'CATCHUP SACHÊ EKMA 7 G (CX 168 UN)', category: 'Derivados de Vegetal', price: 11.24, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-ekma-7-g-cx-168-un-pmg-atacadista.jpg' },
  { id: 1245, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1246, name: 'CATCHUP SACHÊ HEINZ 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 20.44, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-heinz-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1247, name: 'CATCHUP SACHÊ HELLMANN´S 7 G (CX 168 UN)', category: 'Derivados de Vegetal', price: 22.55, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-hellmanns-7-g-cx-168-un-pmg-atacadista.jpg' },
  { id: 1248, name: 'CATCHUP SACHÊ HEMMER 7 G (CX 190 UN)', category: 'Derivados de Vegetal', price: 21.94, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-hemmer-7-g-cx-190-un-pmg-atacadista.jpg' },
  { id: 1249, name: 'CATCHUP SACHÊ LANCHERO 7 G (CX 150 UN)', category: 'Derivados de Vegetal', price: 10.9, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-lanchero-7-g-cx-150-un-pmg-atacadista.jpg' },
  { id: 1250, name: 'CATCHUP SACHÊ PREDILECTA 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 13.15, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-predilecta-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1251, name: 'CATCHUP TRADICIONAL QUERO 1.028 KILO', category: 'Derivados de Vegetal', price: 9.59, image: 'https://www.marquesvendaspmg.shop/images/catchup-tradicional-quero-1028-kilo-pmg-atacadista.jpg' },
  { id: 1252, name: 'CEBOLA CRISPY DELEON 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 19.93, image: 'https://www.marquesvendaspmg.shop/images/cebola-crispy-deleon-500-g-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1253, name: 'CEBOLA CRISPY TAICHI 500 G (CX 20 PCT)', category: 'Derivados de Vegetal', price: 22.67, image: 'https://www.marquesvendaspmg.shop/images/cebola-crispy-taichi-500-g-cx-20-pct-pmg-atacadista.jpg' },
  { id: 1254, name: 'CEBOLA GRAÚDA NACIONAL (SC 18 KILO)', category: 'Derivados de Vegetal', price: 46.52, image: 'https://www.marquesvendaspmg.shop/images/cebola-grauda-nacional-sc-18-kilo-pmg-atacadista.jpg' },
  { id: 1255, name: 'CEBOLINHA GRANJA SÃO PAULO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 57.26, image: 'https://www.marquesvendaspmg.shop/images/cebolinha-granja-sao-paulo-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1256, name: 'CENOURA CONGELADA BABY GRANO 2 KILO', category: 'Derivados de Vegetal', price: 41.77, image: 'https://www.marquesvendaspmg.shop/images/cenoura-congelada-baby-grano-2-kilo-pmg-atacadista.jpg' },
  { id: 1257, name: 'CHAMPIGNON FATIADO ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 61.81, image: 'https://www.marquesvendaspmg.shop/images/champignon-fatiado-arco-bello-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1258, name: 'CHAMPIGNON FATIADO YGUARA 2 KILO (FD 4 BD)', category: 'Derivados de Vegetal', price: 59.91, image: 'https://www.marquesvendaspmg.shop/images/champignon-fatiado-yguara-2-kilo-fd-4-bd-pmg-atacadista.jpg' },
  { id: 1259, name: 'CHAMPIGNON INTEIRO ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 91.72, image: 'https://www.marquesvendaspmg.shop/images/champignon-inteiro-arco-bello-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1260, name: 'COUVE FLOR CONGELADA GRANO 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 136.91, image: 'https://www.marquesvendaspmg.shop/images/couve-flor-congelada-grano-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1261, name: 'ERVILHA CONGELADA GRANO 2 KILO', category: 'Derivados de Vegetal', price: 38.92, image: 'https://www.marquesvendaspmg.shop/images/ervilha-congelada-grano-2-kilo-pmg-atacadista.jpg' },
  { id: 1262, name: 'ERVILHA CONGELADA PRATIGEL 1,02 KILO', category: 'Derivados de Vegetal', price: 17.06, image: 'https://www.marquesvendaspmg.shop/images/ervilha-congelada-pratigel-102-kilo-pmg-atacadista.jpg' },
  { id: 1263, name: 'ESCAROLA CONGELADA GRANO 1 KILO', category: 'Derivados de Vegetal', price: 17.23, image: 'https://www.marquesvendaspmg.shop/images/escarola-congelada-grano-1-kilo-pmg-atacadista.jpg' },
  { id: 1264, name: 'ESCAROLA CONGELADA PRATIGEL 2 KILO', category: 'Derivados de Vegetal', price: 29.16, image: 'https://www.marquesvendaspmg.shop/images/escarola-congelada-pratigel-2-kilo-pmg-atacadista.jpg' },
  { id: 1265, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1266, name: 'FEIJÃO BRANCO TIPO 1 FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 57.91, image: 'https://www.marquesvendaspmg.shop/images/feijao-branco-tipo-1-food-service-camil-2-kilo-fdo-5-pct-pmg-atacadista.jpg' },
  { id: 1267, name: 'FEIJÃO CARIOCA TIPO 1 FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 77.22, image: 'https://www.marquesvendaspmg.shop/images/feijao-carioca-tipo-1-food-service-camil-2-kilo-fdo-5-pct-pmg-atacadista.jpg' },
  { id: 1268, name: 'FEIJÃO CARIOCA TIPO 1 SOLITO 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 71.06, image: 'https://www.marquesvendaspmg.shop/images/feijao-carioca-tipo-1-solito-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1269, name: 'FEIJÃO FRADINHO FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 101.23, image: 'https://www.marquesvendaspmg.shop/images/feijao-fradinho-food-service-camil-2-kilo-fdo-5-pct-pmg-atacadista.jpg' },
  { id: 1270, name: 'FEIJÃO FRADINHO SOLITO 500 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 80.48, image: 'https://www.marquesvendaspmg.shop/images/feijao-fradinho-solito-500-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1271, name: 'FEIJÃO PRETO TIPO 1 CAMIL 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 54.29, image: 'https://www.marquesvendaspmg.shop/images/feijao-preto-tipo-1-camil-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1272, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1273, name: 'FEIJÃO PRETO TIPO 1 SOLITO 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 54.29, image: 'https://www.marquesvendaspmg.shop/images/feijao-preto-tipo-1-solito-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1274, name: 'FUNGHI SECO BRASILSECO 1 KILO', category: 'Derivados de Vegetal', price: 96.7, image: 'https://www.marquesvendaspmg.shop/images/funghi-seco-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1275, name: 'FUNGHI SECO DI SALERNO 1 KILO', category: 'Derivados de Vegetal', price: 85.07, image: 'https://www.marquesvendaspmg.shop/images/funghi-seco-di-salerno-1-kilo-pmg-atacadista.jpg' },
  { id: 1276, name: 'GERGELIM BRANCO INDIANO BRASILSECO 500 G', category: 'Derivados de Vegetal', price: 25.26, image: 'https://www.marquesvendaspmg.shop/images/gergelim-branco-indiano-brasilseco-500-g-pmg-atacadista.jpg' },
  { id: 1277, name: 'GERGELIM GRANDE TORRADO PASTA TAHINE ISTAMBUL (BD 13 KILO)', category: 'Derivados de Vegetal', price: 551.64, image: 'https://www.marquesvendaspmg.shop/images/gergelim-grande-torrado-pasta-tahine-istambul-bd-13-kilo-pmg-atacadista.jpg' },
  { id: 1278, name: 'GERGELIM PRETO INDIANO BRASILSECO 500 G', category: 'Derivados de Vegetal', price: 25.26, image: 'https://www.marquesvendaspmg.shop/images/gergelim-preto-indiano-brasilseco-500-g-pmg-atacadista.jpg' },
  { id: 1279, name: 'GERGELIM TORRADO PASTA TAHINE ISTAMBUL 500 G', category: 'Derivados de Vegetal', price: 35.89, image: 'https://www.marquesvendaspmg.shop/images/gergelim-torrado-pasta-tahine-istambul-500-g-pmg-atacadista.jpg' },
  { id: 1280, name: 'GORDURA VEGETAL COAMO 500 G', category: 'Derivados de Vegetal', price: 11.44, image: 'https://www.marquesvendaspmg.shop/images/gordura-vegetal-coamo-500-g-pmg-atacadista.jpg' },
  { id: 1281, name: 'GORDURA VEGETAL DE PALMA ELOGIATA (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 176.33, image: 'https://www.marquesvendaspmg.shop/images/gordura-vegetal-de-palma-elogiata-bd-145-kilo-pmg-atacadista.jpg' },
  { id: 1282, name: 'GORDURA VEGETAL FRY 400 COAMO (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 167.11, image: 'https://www.marquesvendaspmg.shop/images/gordura-vegetal-fry-400-coamo-bd-145-kilo-pmg-atacadista.jpg' },
  { id: 1283, name: 'GORDURA VEGETAL FRY 600 COAMO (CX 24 KILO)', category: 'Derivados de Vegetal', price: 284.5, image: 'https://www.marquesvendaspmg.shop/images/gordura-vegetal-fry-600-coamo-cx-24-kilo-pmg-atacadista.jpg' },
  { id: 1284, name: 'GORDURA VEGETAL SUPREMA BUNGE (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 230.15, image: 'https://www.marquesvendaspmg.shop/images/gordura-vegetal-suprema-bunge-bd-145-kilo-pmg-atacadista.jpg' },
  { id: 1285, name: 'GRÃO DE BICO CAMIL 500 G (FDO 12 PCT)', category: 'Derivados de Vegetal', price: 9.67, image: 'https://www.marquesvendaspmg.shop/images/grao-de-bico-camil-500-g-fdo-12-pct-pmg-atacadista.jpg' },
  { id: 1286, name: 'GRÃO DE BICO PQ 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 12.11, image: 'https://www.marquesvendaspmg.shop/images/grao-de-bico-pq-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1287, name: 'LENTILHA DA TERRINHA 500 G (FDO 12 PCT)', category: 'Derivados de Vegetal', price: 13.74, image: 'https://www.marquesvendaspmg.shop/images/lentilha-da-terrinha-500-g-fdo-12-pct-pmg-atacadista.jpg' },
  { id: 1288, name: 'LENTILHA FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 42.83, image: 'https://www.marquesvendaspmg.shop/images/lentilha-food-service-camil-2-kilo-fdo-5-pct-pmg-atacadista.jpg' },
  { id: 1289, name: 'MAIONESE GRANDE HELLMANN´S 3 KILO', category: 'Derivados de Vegetal', price: 52.41, image: 'https://www.marquesvendaspmg.shop/images/maionese-grande-hellmanns-3-kilo-pmg-atacadista.jpg' },
  { id: 1290, name: 'MAIONESE GRANDE MARIANA 3 KILO', category: 'Derivados de Vegetal', price: 25.25, image: 'https://www.marquesvendaspmg.shop/images/maionese-grande-mariana-3-kilo-pmg-atacadista.jpg' },
  { id: 1291, name: 'MAIONESE GRANDE QUERO 3 KILO', category: 'Derivados de Vegetal', price: 24.33, image: 'https://www.marquesvendaspmg.shop/images/maionese-grande-quero-3-kilo-pmg-atacadista.jpg' },
  { id: 1292, name: 'MAIONESE GRILL JUNIOR 1,1 KILO', category: 'Derivados de Vegetal', price: 38.7, image: 'https://www.marquesvendaspmg.shop/images/maionese-grill-junior-11-kilo-pmg-atacadista.jpg' },
  { id: 1293, name: 'MAIONESE HEINZ 215 G (CX 16 FR)', category: 'Derivados de Vegetal', price: 162.3, image: 'https://www.marquesvendaspmg.shop/images/maionese-heinz-215-g-cx-16-fr-pmg-atacadista.jpg' },
  { id: 1294, name: 'MAIONESE HELLMANN´S 2,8 KILO', category: 'Derivados de Vegetal', price: 38.95, image: 'https://www.marquesvendaspmg.shop/images/maionese-hellmanns-28-kilo-pmg-atacadista.jpg' },
  { id: 1295, name: 'MAIONESE PEQUENA MARIANA 1 KILO (CX 10 BAG)', category: 'Derivados de Vegetal', price: 63.79, image: 'https://www.marquesvendaspmg.shop/images/maionese-pequena-mariana-1-kilo-cx-10-bag-pmg-atacadista.jpg' },
  { id: 1296, name: 'MAIONESE PEQUENA VIGOR 1 KILO (CX 6 BAG)', category: 'Derivados de Vegetal', price: 69.03, image: 'https://www.marquesvendaspmg.shop/images/maionese-pequena-vigor-1-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 1297, name: 'MAIONESE PREDILECTA 2,8 KILO', category: 'Derivados de Vegetal', price: 21.71, image: 'https://www.marquesvendaspmg.shop/images/maionese-predilecta-28-kilo-pmg-atacadista.jpg' },
  { id: 1298, name: 'MAIONESE QUERO 2,7 KILO', category: 'Derivados de Vegetal', price: 18.72, image: 'https://www.marquesvendaspmg.shop/images/maionese-quero-27-kilo-pmg-atacadista.jpg' },
  { id: 1299, name: 'MAIONESE SACHÊ CEPÊRA 7 G (CX 175 UN)', category: 'Derivados de Vegetal', price: 19.42, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg' },
  { id: 1300, name: 'MAIONESE SACHÊ EKMA 7 G (CX 168 UN)', category: 'Derivados de Vegetal', price: 17.07, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-ekma-7-g-cx-168-un-pmg-atacadista.jpg' },
  { id: 1301, name: 'MAIONESE SACHÊ FUGINI 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 13.5, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-fugini-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1302, name: 'MAIONESE SACHÊ HEINZ 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 20.44, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-heinz-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1303, name: 'MAIONESE SACHÊ HELLMANN´S 7 G (CX 168 UN)', category: 'Derivados de Vegetal', price: 27.24, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-hellmanns-7-g-cx-168-un-pmg-atacadista.jpg' },
  { id: 1304, name: 'MAIONESE SACHÊ HEMMER 7 G (CX 190 UN)', category: 'Derivados de Vegetal', price: 21.94, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-hemmer-7-g-cx-190-un-pmg-atacadista.jpg' },
  { id: 1305, name: 'MAIONESE SACHÊ LANCHERO 7 G (CX 150 UN)', category: 'Derivados de Vegetal', price: 8.97, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-lanchero-7-g-cx-150-un-pmg-atacadista.jpg' },
  { id: 1306, name: 'MAIONESE SACHÊ PREDILECTA 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 14.36, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-predilecta-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1307, name: 'MAIONESE TEMPERADA JUNIOR 1,01 KILO', category: 'Derivados de Vegetal', price: 31.92, image: 'https://www.marquesvendaspmg.shop/images/maionese-temperada-junior-101-kilo-pmg-atacadista.jpg' },
  { id: 1308, name: 'MAIONESE TEMPERADA ZAFRÁN 1,05 KILO', category: 'Derivados de Vegetal', price: 26.43, image: 'https://www.marquesvendaspmg.shop/images/maionese-temperada-zafran-105-kilo-pmg-atacadista.jpg' },
  { id: 1309, name: 'MAIONESE VIGOR 2,8 KILO', category: 'Derivados de Vegetal', price: 30.92, image: 'https://www.marquesvendaspmg.shop/images/maionese-vigor-28-kilo-pmg-atacadista.jpg' },
  { id: 1310, name: 'MANDIOCA TOLETE CONGELADA E COZIDA ARRICO 1 KILO (CX 12 PCT)', category: 'Derivados de Vegetal', price: 131.06, image: 'https://www.marquesvendaspmg.shop/images/mandioca-tolete-congelada-e-cozida-arrico-1-kilo-cx-12-pct-pmg-atacadista.jpg' },
  { id: 1311, name: 'MANDIOCA TOLETE CONGELADA E COZIDA CONCEIÇÃO 2,5 KILO (CX 4 PCT)', category: 'Derivados de Vegetal', price: 118.94, image: 'https://www.marquesvendaspmg.shop/images/mandioca-tolete-congelada-e-cozida-conceicao-25-kilo-cx-4-pct-pmg-atacadista.jpg' },
  { id: 1312, name: 'MANDIOCA TOLETE CONGELADA E COZIDA MATHEUS 2,5 KILO (CX 4 PCT)', category: 'Derivados de Vegetal', price: 144.89, image: 'https://www.marquesvendaspmg.shop/images/mandioca-tolete-congelada-e-cozida-matheus-25-kilo-cx-4-pct-pmg-atacadista.jpg' },
  { id: 1313, name: 'MANJERICÃO DESIDRATADO BRASILSECO 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 10.74, image: 'https://www.marquesvendaspmg.shop/images/manjericao-desidratado-brasilseco-500-g-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1314, name: 'MARGARINA COM SAL 50 % AMÉLIA (BD 14 KILO)', category: 'Derivados de Vegetal', price: 127.81, image: 'https://www.marquesvendaspmg.shop/images/margarina-com-sal-50-amelia-bd-14-kilo-pmg-atacadista.jpg' },
  { id: 1315, name: 'MARGARINA COM SAL 50 % COAMO (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 123.94, image: 'https://www.marquesvendaspmg.shop/images/margarina-com-sal-50-coamo-bd-145-kilo-pmg-atacadista.jpg' },
  { id: 1316, name: 'MARGARINA COM SAL 75 % PRIMOR (BD 15 KILO)', category: 'Derivados de Vegetal', price: 191.52, image: 'https://www.marquesvendaspmg.shop/images/margarina-com-sal-75-primor-bd-15-kilo-pmg-atacadista.jpg' },
  { id: 1317, name: 'MARGARINA COM SAL 75 % SOFITELI (BD 15 KILO)', category: 'Derivados de Vegetal', price: 168.91, image: 'https://www.marquesvendaspmg.shop/images/margarina-com-sal-75-sofiteli-bd-15-kilo-pmg-atacadista.jpg' },
  { id: 1318, name: 'MARGARINA COM SAL 80 % AMÉLIA (BD 14 KILO)', category: 'Derivados de Vegetal', price: 194.92, image: 'https://www.marquesvendaspmg.shop/images/margarina-com-sal-80-amelia-bd-14-kilo-pmg-atacadista.jpg' },
  { id: 1319, name: 'MARGARINA COM SAL 80 % COAMO (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 13.31, image: 'https://www.marquesvendaspmg.shop/images/margarina-com-sal-80-coamo-bd-145-kilo-pmg-atacadista.jpg' },
  { id: 1320, name: 'MARGARINA FOLHADOS & CROISSANTS 80 % AMÉLIA 2 KILO (CX 6 UN)', category: 'Derivados de Vegetal', price: 221.88, image: 'https://www.marquesvendaspmg.shop/images/margarina-folhados-croissants-80-amelia-2-kilo-cx-6-un-pmg-atacadista.jpg' },
  { id: 1321, name: 'MARGARINA GRANDE COM SAL 80 % QUALY SADIA 1 KILO (CX 6 UN)', category: 'Derivados de Vegetal', price: 89.37, image: 'https://www.marquesvendaspmg.shop/images/margarina-grande-com-sal-80-qualy-sadia-1-kilo-cx-6-un-pmg-atacadista.jpg' },
  { id: 1322, name: 'MARGARINA MÉDIA COM SAL 80 % DORIANA 500 G (CX 12 UN)', category: 'Derivados de Vegetal', price: 85.44, image: 'https://www.marquesvendaspmg.shop/images/margarina-media-com-sal-80-doriana-500-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 1323, name: 'MARGARINA MÉDIA COM SAL 80 % QUALY SADIA 500 G (CX 12 UN)', category: 'Derivados de Vegetal', price: 98.33, image: 'https://www.marquesvendaspmg.shop/images/margarina-media-com-sal-80-qualy-sadia-500-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 1324, name: 'MARGARINA PEQUENA COM SAL 75 % SOFITELI 3 KILO', category: 'Derivados de Vegetal', price: 37.16, image: 'https://www.marquesvendaspmg.shop/images/margarina-pequena-com-sal-75-sofiteli-3-kilo-pmg-atacadista.jpg' },
  { id: 1325, name: 'MARGARINA PEQUENA COM SAL 80 % DORIANA 250 G (CX 24 UN)', category: 'Derivados de Vegetal', price: 97.35, image: 'https://www.marquesvendaspmg.shop/images/margarina-pequena-com-sal-80-doriana-250-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 1326, name: 'MARGARINA PEQUENA COM SAL 80 % QUALY SADIA 250 G (CX 24 UN)', category: 'Derivados de Vegetal', price: 113.79, image: 'https://www.marquesvendaspmg.shop/images/margarina-pequena-com-sal-80-qualy-sadia-250-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 1327, name: 'MARGARINA SACHÊ COM SAL LECO 10 G (CX 192 UN)', category: 'Derivados de Vegetal', price: 65.38, image: 'https://www.marquesvendaspmg.shop/images/margarina-sache-com-sal-leco-10-g-cx-192-un-pmg-atacadista.jpg' },
  { id: 1328, name: 'MARGARINA SEM SAL 80 % AMÉLIA 1,010 KILO (CX 12 UN)', category: 'Derivados de Vegetal', price: 200.82, image: 'https://www.marquesvendaspmg.shop/images/margarina-sem-sal-80-amelia-1010-kilo-cx-12-un-pmg-atacadista.jpg' },
  { id: 1329, name: 'MARGARINA SEM SAL 80 % COAMO (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 161.35, image: 'https://www.marquesvendaspmg.shop/images/margarina-sem-sal-80-coamo-bd-145-kilo-pmg-atacadista.jpg' },
  { id: 1330, name: 'MILHO CONGELADO GRANO 2 KILO', category: 'Derivados de Vegetal', price: 39.05, image: 'https://www.marquesvendaspmg.shop/images/milho-congelado-grano-2-kilo-pmg-atacadista.jpg' },
  { id: 1331, name: 'MILHO PARA PIPOCA KISABOR 400 G (FDO 24 PCT)', category: 'Derivados de Vegetal', price: 4.02, image: 'https://www.marquesvendaspmg.shop/images/milho-para-pipoca-kisabor-400-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 1332, name: 'MILHO PARA PIPOCA PREMIUM CAMIL 500 G (FDO 12 PCT)', category: 'Derivados de Vegetal', price: 4.94, image: 'https://www.marquesvendaspmg.shop/images/milho-para-pipoca-premium-camil-500-g-fdo-12-pct-pmg-atacadista.jpg' },
  { id: 1333, name: 'MILHO PARA PIPOCA PREMIUM YOKI 400 G (FDO 28 PCT)', category: 'Derivados de Vegetal', price: 7.86, image: 'https://www.marquesvendaspmg.shop/images/milho-para-pipoca-premium-yoki-400-g-fdo-28-pct-pmg-atacadista.jpg' },
  { id: 1334, name: 'MISTURA DE ÓLEOS VEGETAIS FRY SEBELLA SINA (BD 15,8 L)', category: 'Derivados de Vegetal', price: 158.06, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-oleos-vegetais-fry-sebella-sina-bd-158-l-pmg-atacadista.jpg' },
  { id: 1335, name: 'MOLHO GRILL ZAFRÁN 1,05 KILO', category: 'Derivados de Vegetal', price: 29.2, image: 'https://www.marquesvendaspmg.shop/images/molho-grill-zafran-105-kilo-pmg-atacadista.jpg' },
  { id: 1336, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1337, name: 'MOSTARDA AMARELA HEINZ 255 G (CX 16 FR)', category: 'Derivados de Vegetal', price: 216.67, image: 'https://www.marquesvendaspmg.shop/images/mostarda-amarela-heinz-255-g-cx-16-fr-pmg-atacadista.jpg' },
  { id: 1338, name: 'MOSTARDA AMARELA HEMMER 1 KILO', category: 'Derivados de Vegetal', price: 16.3, image: 'https://www.marquesvendaspmg.shop/images/mostarda-amarela-hemmer-1-kilo-pmg-atacadista.jpg' },
  { id: 1339, name: 'MOSTARDA AMARELA KISABOR 1,01 KILO', category: 'Derivados de Vegetal', price: 6.22, image: 'https://www.marquesvendaspmg.shop/images/mostarda-amarela-kisabor-101-kilo-pmg-atacadista.jpg' },
  { id: 1340, name: 'MOSTARDA COM MEL CEPÊRA 400 G', category: 'Derivados de Vegetal', price: 12.45, image: 'https://www.marquesvendaspmg.shop/images/mostarda-com-mel-cepera-400-g-pmg-atacadista.jpg' },
  { id: 1341, name: 'MOSTARDA DIJON CEPÊRA 190 G', category: 'Derivados de Vegetal', price: 9.85, image: 'https://www.marquesvendaspmg.shop/images/mostarda-dijon-cepera-190-g-pmg-atacadista.jpg' },
  { id: 1342, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1343, name: 'MOSTARDA ESCURA HEMMER 200 G', category: 'Derivados de Vegetal', price: 8.84, image: 'https://www.marquesvendaspmg.shop/images/mostarda-escura-hemmer-200-g-pmg-atacadista.jpg' },
  { id: 1344, name: 'MOSTARDA GRANDE AMARELA CEPÊRA 3,3 KILO', category: 'Derivados de Vegetal', price: 24.28, image: 'https://www.marquesvendaspmg.shop/images/mostarda-grande-amarela-cepera-33-kilo-pmg-atacadista.jpg' },
  { id: 1345, name: 'MOSTARDA GRANDE AMARELA EKMA 3,3 KILO', category: 'Derivados de Vegetal', price: 21.17, image: 'https://www.marquesvendaspmg.shop/images/mostarda-grande-amarela-ekma-33-kilo-pmg-atacadista.jpg' },
  { id: 1346, name: 'MOSTARDA GRANDE AMARELA HEINZ 2 KILO', category: 'Derivados de Vegetal', price: 44.38, image: 'https://www.marquesvendaspmg.shop/images/mostarda-grande-amarela-heinz-2-kilo-pmg-atacadista.jpg' },
  { id: 1347, name: 'MOSTARDA GRANDE AMARELA HEMMER 3,6 KILO', category: 'Derivados de Vegetal', price: 42.65, image: 'https://www.marquesvendaspmg.shop/images/mostarda-grande-amarela-hemmer-36-kilo-pmg-atacadista.jpg' },
  { id: 1348, name: 'MOSTARDA GRANDE AMARELA LANCHERO 3 KILO (FD 6 GL)', category: 'Derivados de Vegetal', price: 12.36, image: 'https://www.marquesvendaspmg.shop/images/mostarda-grande-amarela-lanchero-3-kilo-fd-6-gl-pmg-atacadista.jpg' },
  { id: 1349, name: 'MOSTARDA SACHÊ CEPÊRA 7 G (CX 175 UN)', category: 'Derivados de Vegetal', price: 16.15, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg' },
  { id: 1350, name: 'MOSTARDA SACHÊ EKMA 7 G (CX 168 UN)', category: 'Derivados de Vegetal', price: 11.24, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-ekma-7-g-cx-168-un-pmg-atacadista.jpg' },
  { id: 1351, name: 'MOSTARDA SACHÊ FUGINI 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 13.68, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-fugini-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1352, name: 'MOSTARDA SACHÊ HEINZ 5 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 20.44, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-heinz-5-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1353, name: 'MOSTARDA SACHÊ HEMMER 7 G (CX 190 UN)', category: 'Derivados de Vegetal', price: 19.42, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-hemmer-7-g-cx-190-un-pmg-atacadista.jpg' },
  { id: 1354, name: 'MOSTARDA SACHÊ LANCHERO 7 G (CX 150 UN)', category: 'Derivados de Vegetal', price: 10.72, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-lanchero-7-g-cx-150-un-pmg-atacadista.jpg' },
  { id: 1355, name: 'ÓLEO DE ALGODÃO ELOGIATA FLOR DE ALGODÃO (BD 15,8 L)', category: 'Derivados de Vegetal', price: 181.58, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-algodao-elogiata-flor-de-algodao-bd-158-l-pmg-atacadista.jpg' },
  { id: 1356, name: 'ÓLEO DE ALGODÃO LIZA (BD 15,8 L)', category: 'Derivados de Vegetal', price: 201.94, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-algodao-liza-bd-158-l-pmg-atacadista.jpg' },
  { id: 1357, name: 'ÓLEO DE ALGODÃO LIZA 900 ML', category: 'Derivados de Vegetal', price: 14.96, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-algodao-liza-900-ml-pmg-atacadista.jpg' },
  { id: 1358, name: 'ÓLEO DE ALGODÃO SOYA (BD 15,8 L)', category: 'Derivados de Vegetal', price: 200.4, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-algodao-soya-bd-158-l-pmg-atacadista.jpg' },
  { id: 1359, name: 'ÓLEO DE CANOLA LIZA 900 ML', category: 'Derivados de Vegetal', price: 16.43, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-canola-liza-900-ml-pmg-atacadista.jpg' },
  { id: 1360, name: 'ÓLEO DE GIRASSOL LIZA 900 ML', category: 'Derivados de Vegetal', price: 15.97, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-girassol-liza-900-ml-pmg-atacadista.jpg' },
  { id: 1361, name: 'ÓLEO DE MILHO LIZA 900 ML', category: 'Derivados de Vegetal', price: 16.23, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-milho-liza-900-ml-pmg-atacadista.jpg' },
  { id: 1362, name: 'ÓLEO DE SOJA COAMO 900 ML (CX 20 FR)', category: 'Derivados de Vegetal', price: 176.84, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-coamo-900-ml-cx-20-fr-pmg-atacadista.jpg' },
  { id: 1363, name: 'ÓLEO DE SOJA COCAMAR (LT 18 L)', category: 'Derivados de Vegetal', price: 194.25, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-cocamar-lt-18-l-pmg-atacadista.jpg' },
  { id: 1364, name: 'ÓLEO DE SOJA LIZA 900 ML', category: 'Derivados de Vegetal', price: 54.65, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-liza-900-ml-pmg-atacadista.jpg' },
  { id: 1365, name: 'ÓLEO DE SOJA VILA VELHA (GL 18 L)', category: 'Derivados de Vegetal', price: 166.52, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-vila-velha-gl-18-l-pmg-atacadista.jpg' },
  { id: 1366, name: 'ÓLEO DE SOJA VILA VELHA 900 ML (CX 20 FR)', category: 'Derivados de Vegetal', price: 175.2, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-vila-velha-900-ml-cx-20-fr-pmg-atacadista.jpg' },
  { id: 1367, name: 'ORÉGANO CHILENO DI SALERNO 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 37.93, image: 'https://www.marquesvendaspmg.shop/images/oregano-chileno-di-salerno-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1368, name: 'ORÉGANO FLOCOS PENINA 200 G (FD 40 PCT)', category: 'Derivados de Vegetal', price: 10.85, image: 'https://www.marquesvendaspmg.shop/images/oregano-flocos-penina-200-g-fd-40-pct-pmg-atacadista.jpg' },
  { id: 1369, name: 'ORÉGANO NACIONAL DA TERRINHA 200 G', category: 'Derivados de Vegetal', price: 10.75, image: 'https://www.marquesvendaspmg.shop/images/oregano-nacional-da-terrinha-200-g-pmg-atacadista.jpg' },
  { id: 1370, name: 'ORÉGANO NACIONAL KISABOR 200 G', category: 'Derivados de Vegetal', price: 6.12, image: 'https://www.marquesvendaspmg.shop/images/oregano-nacional-kisabor-200-g-pmg-atacadista.jpg' },
  { id: 1371, name: 'ORÉGANO PEQUENO PERUANO ARCO BELLO 500 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 12.17, image: 'https://www.marquesvendaspmg.shop/images/oregano-pequeno-peruano-arco-bello-500-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1372, name: 'ORÉGANO PERUANO ARCO BELLO 1,01 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 24.19, image: 'https://www.marquesvendaspmg.shop/images/oregano-peruano-arco-bello-101-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1373, name: 'PALMITO BANDA AÇAÍ PALMEIRAL 500 G', category: 'Derivados de Vegetal', price: 21.34, image: 'https://www.marquesvendaspmg.shop/images/palmito-banda-acai-palmeiral-500-g-pmg-atacadista.jpg' },
  { id: 1374, name: 'PALMITO BANDA PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 46.43, image: 'https://www.marquesvendaspmg.shop/images/palmito-banda-pupunha-du-campo-18-kilo-pmg-atacadista.jpg' },
  { id: 1375, name: 'PALMITO BANDA PUPUNHA ITARIRI 1,8 KILO', category: 'Derivados de Vegetal', price: 42.18, image: 'https://www.marquesvendaspmg.shop/images/palmito-banda-pupunha-itariri-18-kilo-pmg-atacadista.jpg' },
  { id: 1376, name: 'PALMITO INTEIRO AÇAÍ PALMEIRAL 540 G', category: 'Derivados de Vegetal', price: 22.55, image: 'https://www.marquesvendaspmg.shop/images/palmito-inteiro-acai-palmeiral-540-g-pmg-atacadista.jpg' },
  { id: 1377, name: 'PALMITO INTEIRO AÇAÍ SANEDE 500 G', category: 'Derivados de Vegetal', price: 28.16, image: 'https://www.marquesvendaspmg.shop/images/palmito-inteiro-acai-sanede-500-g-pmg-atacadista.jpg' },
  { id: 1378, name: 'PALMITO INTEIRO PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 75.41, image: 'https://www.marquesvendaspmg.shop/images/palmito-inteiro-pupunha-du-campo-18-kilo-pmg-atacadista.jpg' },
  { id: 1379, name: 'PALMITO INTEIRO PUPUNHA OURO DO VALE 1,8 KILO', category: 'Derivados de Vegetal', price: 76.69, image: 'https://www.marquesvendaspmg.shop/images/palmito-inteiro-pupunha-ouro-do-vale-18-kilo-pmg-atacadista.jpg' },
  { id: 1380, name: 'PALMITO PICADO AÇAÍ PALMEIRAL 540 G', category: 'Derivados de Vegetal', price: 14.1, image: 'https://www.marquesvendaspmg.shop/images/palmito-picado-acai-palmeiral-540-g-pmg-atacadista.jpg' },
  { id: 1381, name: 'PALMITO PICADO PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 37.07, image: 'https://www.marquesvendaspmg.shop/images/palmito-picado-pupunha-du-campo-18-kilo-pmg-atacadista.jpg' },
  { id: 1382, name: 'PALMITO PICADO PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 41.06, image: 'https://www.marquesvendaspmg.shop/images/palmito-picado-pupunha-du-campo-18-kilo-pmg-atacadista.jpg' },
  { id: 1383, name: 'PALMITO PICADO PUPUNHA ITARIRI 1,8 KILO', category: 'Derivados de Vegetal', price: 37.62, image: 'https://www.marquesvendaspmg.shop/images/palmito-picado-pupunha-itariri-18-kilo-pmg-atacadista.jpg' },
  { id: 1384, name: 'PALMITO PICADO PUPUNHA OURO DO VALE 1,8 KILO', category: 'Derivados de Vegetal', price: 37.28, image: 'https://www.marquesvendaspmg.shop/images/palmito-picado-pupunha-ouro-do-vale-18-kilo-pmg-atacadista.jpg' },
  { id: 1385, name: 'PALMITO PICADO PUPUNHA POTE D´ORO 1,8 KILO', category: 'Derivados de Vegetal', price: 38.34, image: 'https://www.marquesvendaspmg.shop/images/palmito-picado-pupunha-pote-doro-18-kilo-pmg-atacadista.jpg' },
  { id: 1386, name: 'PALMITO PICADO PUPUNHA PREMIER 1,8 KILO', category: 'Derivados de Vegetal', price: 45.72, image: 'https://www.marquesvendaspmg.shop/images/palmito-picado-pupunha-premier-18-kilo-pmg-atacadista.jpg' },
  { id: 1387, name: 'PALMITO RODELA PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 44.73, image: 'https://www.marquesvendaspmg.shop/images/palmito-rodela-pupunha-du-campo-18-kilo-pmg-atacadista.jpg' },
  { id: 1388, name: 'PALMITO RODELA PUPUNHA OURO DO VALE 1,8 KILO', category: 'Derivados de Vegetal', price: 45.8, image: 'https://www.marquesvendaspmg.shop/images/palmito-rodela-pupunha-ouro-do-vale-18-kilo-pmg-atacadista.jpg' },
  { id: 1389, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1390, name: 'PEPININHO GRANJA SÃO PAULO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 37.22, image: 'https://www.marquesvendaspmg.shop/images/pepininho-granja-sao-paulo-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1391, name: 'PEPININHO YGUARA (BD 2 KILO)', category: 'Derivados de Vegetal', price: 37.22, image: 'https://www.marquesvendaspmg.shop/images/pepininho-yguara-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1392, name: 'PEPINOS RODELAS AGRIDOCE HEMMER 440 G', category: 'Derivados de Vegetal', price: 20.6, image: 'https://www.marquesvendaspmg.shop/images/pepinos-rodelas-agridoce-hemmer-440-g-pmg-atacadista.jpg' },
  { id: 1393, name: 'PICKLES DILL MCCOY´S 2 KILO', category: 'Derivados de Vegetal', price: 100.86, image: 'https://www.marquesvendaspmg.shop/images/pickles-dill-mccoys-2-kilo-pmg-atacadista.jpg' },
  { id: 1394, name: 'PICKLES MISTO GRANJA SÃO PAULO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 40.08, image: 'https://www.marquesvendaspmg.shop/images/pickles-misto-granja-sao-paulo-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1395, name: 'PICKLES SWEET MCCOY´S 2 KILO', category: 'Derivados de Vegetal', price: 100.86, image: 'https://www.marquesvendaspmg.shop/images/pickles-sweet-mccoys-2-kilo-pmg-atacadista.jpg' },
  { id: 1396, name: 'PIMENTA BIQUINHO ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 52.97, image: 'https://www.marquesvendaspmg.shop/images/pimenta-biquinho-arco-bello-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1397, name: 'PIMENTA BIQUINHO YGUARA (BD 2 KILO)', category: 'Derivados de Vegetal', price: 51.39, image: 'https://www.marquesvendaspmg.shop/images/pimenta-biquinho-yguara-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1398, name: 'PIMENTA JALAPEÑO MCCOY´S 1 KILO', category: 'Derivados de Vegetal', price: 89.93, image: 'https://www.marquesvendaspmg.shop/images/pimenta-jalapeno-mccoys-1-kilo-pmg-atacadista.jpg' },
  { id: 1399, name: 'POLENTA CONGELADA ARRICO 1 KILO (CX 12 PCT)', category: 'Derivados de Vegetal', price: 79.76, image: 'https://www.marquesvendaspmg.shop/images/polenta-congelada-arrico-1-kilo-cx-12-pct-pmg-atacadista.jpg' },
  { id: 1400, name: 'POLENTA CONGELADA EASY CHEF 1,1 KILO (CX 10 PCT)', category: 'Derivados de Vegetal', price: 70.74, image: 'https://www.marquesvendaspmg.shop/images/polenta-congelada-easy-chef-11-kilo-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1401, name: 'PROTEÍNA TEXTURIZADA DE SOJA CLARA FRANGO CAMIL 400 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 5.57, image: 'https://www.marquesvendaspmg.shop/images/proteina-texturizada-de-soja-clara-frango-camil-400-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1402, name: 'PROTEÍNA TEXTURIZADA DE SOJA ESCURA CARNE CAMIL 400 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 5.6, image: 'https://www.marquesvendaspmg.shop/images/proteina-texturizada-de-soja-escura-carne-camil-400-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1403, name: 'PURÊ DE BATATA TECNUTRI 800 G', category: 'Derivados de Vegetal', price: 30.6, image: 'https://www.marquesvendaspmg.shop/images/pure-de-batata-tecnutri-800-g-pmg-atacadista.jpg' },
  { id: 1404, name: 'PURÊ DE BATATAS AJINOMOTO 1 KILO', category: 'Derivados de Vegetal', price: 50.79, image: 'https://www.marquesvendaspmg.shop/images/pure-de-batatas-ajinomoto-1-kilo-pmg-atacadista.jpg' },
  { id: 1405, name: 'PURÊ DE BATATAS JUNIOR 1,01 KILO', category: 'Derivados de Vegetal', price: 44.47, image: 'https://www.marquesvendaspmg.shop/images/pure-de-batatas-junior-101-kilo-pmg-atacadista.jpg' },
  { id: 1406, name: 'PURÊ DE BATATAS KISABOR 1 KILO', category: 'Derivados de Vegetal', price: 42.01, image: 'https://www.marquesvendaspmg.shop/images/pure-de-batatas-kisabor-1-kilo-pmg-atacadista.jpg' },
  { id: 1407, name: 'PURÊ DE BATATAS QUALIMAX 800 G', category: 'Derivados de Vegetal', price: 47.52, image: 'https://www.marquesvendaspmg.shop/images/pure-de-batatas-qualimax-800-g-pmg-atacadista.jpg' },
  { id: 1408, name: 'PURÊ DE BATATAS RECEITA COMPLETA QUALIMAX 800 G', category: 'Derivados de Vegetal', price: 49.24, image: 'https://www.marquesvendaspmg.shop/images/pure-de-batatas-receita-completa-qualimax-800-g-pmg-atacadista.jpg' },
  { id: 1409, name: 'SELETA DE LEGUMES CONGELADA GRANO 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 185.7, image: 'https://www.marquesvendaspmg.shop/images/seleta-de-legumes-congelada-grano-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1410, name: 'SELETA DE LEGUMES CONGELADA PRATIGEL 1,02 KILO (CX 12 PCT)', category: 'Derivados de Vegetal', price: 141.39, image: 'https://www.marquesvendaspmg.shop/images/seleta-de-legumes-congelada-pratigel-102-kilo-cx-12-pct-pmg-atacadista.jpg' },
  { id: 1411, name: 'TOMATE ITALIANO MADURO (CX 17 KILO)', category: 'Derivados de Vegetal', price: 119.63, image: 'https://www.marquesvendaspmg.shop/images/tomate-italiano-maduro-cx-17-kilo-pmg-atacadista.jpg' },
  { id: 1412, name: 'TOMATE ITALIANO SALADA (CX 17 KILO)', category: 'Derivados de Vegetal', price: 119.63, image: 'https://www.marquesvendaspmg.shop/images/tomate-italiano-salada-cx-17-kilo-pmg-atacadista.jpg' },
  { id: 1413, name: 'TOMATE SECO ARCO BELLO 1,4 KILO', category: 'Derivados de Vegetal', price: 27.25, image: 'https://www.marquesvendaspmg.shop/images/tomate-seco-arco-bello-14-kilo-pmg-atacadista.jpg' },
  { id: 1414, name: 'TOMATE SECO YGUARA 1,4 KILO', category: 'Derivados de Vegetal', price: 26.45, image: 'https://www.marquesvendaspmg.shop/images/tomate-seco-yguara-14-kilo-pmg-atacadista.jpg' },
  { id: 1415, name: 'TOMATE TRITURADO EKMA 1,7 KILO', category: 'Derivados de Vegetal', price: 14.84, image: 'https://www.marquesvendaspmg.shop/images/tomate-triturado-ekma-17-kilo-pmg-atacadista.jpg' },
  { id: 1416, name: 'TOMATE TRITURADO POMAROLA 1,7 KILO (CX 6 BAG)', category: 'Derivados de Vegetal', price: 96.49, image: 'https://www.marquesvendaspmg.shop/images/tomate-triturado-pomarola-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 1417, name: 'VINAGRE BALSÂMICO DE MODENA GALLO 250 ML', category: 'Derivados de Vegetal', price: 15.78, image: 'https://www.marquesvendaspmg.shop/images/vinagre-balsamico-de-modena-gallo-250-ml-pmg-atacadista.jpg' },
  { id: 1418, name: 'VINAGRE BALSÂMICO TRADIZIONALE CASTELO 500 ML', category: 'Derivados de Vegetal', price: 22.03, image: 'https://www.marquesvendaspmg.shop/images/vinagre-balsamico-tradizionale-castelo-500-ml-pmg-atacadista.jpg' },
  { id: 1419, name: 'VINAGRE DE ÁLCOOL CASTELO 750 ML (CX 12 FR)', category: 'Derivados de Vegetal', price: 50.45, image: 'https://www.marquesvendaspmg.shop/images/vinagre-de-alcool-castelo-750-ml-cx-12-fr-pmg-atacadista.jpg' },
  { id: 1420, name: 'VINAGRE DE ÁLCOOL COLORIDO CASTELO 750 ML (CX 12 FR)', category: 'Derivados de Vegetal', price: 47.14, image: 'https://www.marquesvendaspmg.shop/images/vinagre-de-alcool-colorido-castelo-750-ml-cx-12-fr-pmg-atacadista.jpg' },
  { id: 1421, name: 'VINAGRE DE ÁLCOOL COLORIDO NEVAL 750 ML (CX 12 FR)', category: 'Derivados de Vegetal', price: 26.63, image: 'https://www.marquesvendaspmg.shop/images/vinagre-de-alcool-colorido-neval-750-ml-cx-12-fr-pmg-atacadista.jpg' },
  { id: 1422, name: 'VINAGRE DE ARROZ CASTELO 750 ML (CX 12 FR)', category: 'Derivados de Vegetal', price: 115.55, image: 'https://www.marquesvendaspmg.shop/images/vinagre-de-arroz-castelo-750-ml-cx-12-fr-pmg-atacadista.jpg' },
  { id: 1423, name: 'VINAGRE DE MAÇÃ CASTELO 750 ML (CX 12 FR)', category: 'Derivados de Vegetal', price: 139.57, image: 'https://www.marquesvendaspmg.shop/images/vinagre-de-maca-castelo-750-ml-cx-12-fr-pmg-atacadista.jpg' },
  { id: 1424, name: 'VINAGRE DE VINHO BRANCO GALLO 250 ML (CX 6 FR)', category: 'Derivados de Vegetal', price: 71.58, image: 'https://www.marquesvendaspmg.shop/images/vinagre-de-vinho-branco-gallo-250-ml-cx-6-fr-pmg-atacadista.jpg' },
  { id: 1425, name: 'VINAGRE DE VINHO TINTO GALLO 250 ML (CX 6 FR)', category: 'Derivados de Vegetal', price: 68.17, image: 'https://www.marquesvendaspmg.shop/images/vinagre-de-vinho-tinto-gallo-250-ml-cx-6-fr-pmg-atacadista.jpg' },
  { id: 1426, name: 'VINAGRE GRANDE DE ÁLCOOL CASTELO (GL 5 L)', category: 'Derivados de Vegetal', price: 21.36, image: 'https://www.marquesvendaspmg.shop/images/vinagre-grande-de-alcool-castelo-gl-5-l-pmg-atacadista.jpg' },
  { id: 1427, name: 'VINAGRE GRANDE DE ÁLCOOL TOSCANO (GL 5 L)', category: 'Derivados de Vegetal', price: 14.96, image: 'https://www.marquesvendaspmg.shop/images/vinagre-grande-de-alcool-toscano-gl-5-l-pmg-atacadista.jpg' },
  { id: 1428, name: 'VINAGRE SACHÊ DE VINHO TINTO BOM SABOR 4 ML (CX 200 UN)', category: 'Derivados de Vegetal', price: 29.55, image: 'https://www.marquesvendaspmg.shop/images/vinagre-sache-de-vinho-tinto-bom-sabor-4-ml-cx-200-un-pmg-atacadista.jpg' },
  { id: 1429, name: 'ALICHE ARGENTINO A VÁCUO DI SALERNO 500 G', category: 'Derivados do Mar', price: 138.04, image: 'https://www.marquesvendaspmg.shop/images/aliche-argentino-a-vacuo-di-salerno-500-g-pmg-atacadista.jpg' },
  { id: 1430, name: 'ALICHE ARGENTINO A VÁCUO MARCOL 500 G', category: 'Derivados do Mar', price: 122.07, image: 'https://www.marquesvendaspmg.shop/images/aliche-argentino-a-vacuo-marcol-500-g-pmg-atacadista.jpg' },
  { id: 1431, name: 'ALICHE ARGENTINO DI SALERNO 1,5 KILO', category: 'Derivados do Mar', price: 394.27, image: 'https://www.marquesvendaspmg.shop/images/aliche-argentino-di-salerno-15-kilo-pmg-atacadista.jpg' },
  { id: 1432, name: 'ALICHE NACIONAL RIBAMAR', category: 'Derivados do Mar', price: 49.18, image: 'https://www.marquesvendaspmg.shop/images/aliche-nacional-ribamar-pmg-atacadista.jpg' },
  { id: 1433, name: 'ATUM GRANDE PEDAÇOS EM ÓLEO POUCH GOMES DA COSTA 1 KILO', category: 'Derivados do Mar', price: 60.52, image: 'https://www.marquesvendaspmg.shop/images/atum-grande-pedacos-em-oleo-pouch-gomes-da-costa-1-kilo-pmg-atacadista.jpg' },
  { id: 1434, name: 'ATUM GRANDE RALADO AO NATURAL POUCH GOMES DA COSTA 1 KILO', category: 'Derivados do Mar', price: 50.05, image: 'https://www.marquesvendaspmg.shop/images/atum-grande-ralado-ao-natural-pouch-gomes-da-costa-1-kilo-pmg-atacadista.jpg' },
  { id: 1435, name: 'ATUM GRANDE RALADO EM ÓLEO POUCH 88 1 KILO', category: 'Derivados do Mar', price: 46.26, image: 'https://www.marquesvendaspmg.shop/images/atum-grande-ralado-em-oleo-pouch-88-1-kilo-pmg-atacadista.jpg' },
  { id: 1436, name: 'ATUM GRANDE RALADO EM ÓLEO POUCH GOMES DA COSTA 1 KILO', category: 'Derivados do Mar', price: 50.3, image: 'https://www.marquesvendaspmg.shop/images/atum-grande-ralado-em-oleo-pouch-gomes-da-costa-1-kilo-pmg-atacadista.jpg' },
  { id: 1437, name: 'ATUM PEDAÇOS EM ÓLEO MARSUL 400 G', category: 'Derivados do Mar', price: 28.26, image: 'https://www.marquesvendaspmg.shop/images/atum-pedacos-em-oleo-marsul-400-g-pmg-atacadista.jpg' },
  { id: 1438, name: 'PRODUTO EM FALTA', category: 'Derivados do Mar', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1439, name: 'ATUM PEDAÇOS EM ÓLEO POUCH COQUEIRO 480 G', category: 'Derivados do Mar', price: 26.05, image: 'https://www.marquesvendaspmg.shop/images/atum-pedacos-em-oleo-pouch-coqueiro-480-g-pmg-atacadista.jpg' },
  { id: 1440, name: 'ATUM PEDAÇOS EM ÓLEO POUCH GOMES DA COSTA 500 G', category: 'Derivados do Mar', price: 31.55, image: 'https://www.marquesvendaspmg.shop/images/atum-pedacos-em-oleo-pouch-gomes-da-costa-500-g-pmg-atacadista.jpg' },
  { id: 1441, name: 'ATUM PEDAÇOS EM ÓLEO TOURS 400 G', category: 'Derivados do Mar', price: 28.26, image: 'https://www.marquesvendaspmg.shop/images/atum-pedacos-em-oleo-tours-400-g-pmg-atacadista.jpg' },
  { id: 1442, name: 'ATUM PEQUENO PEDAÇOS EM ÓLEO 88 140 G (CX 24 LT)', category: 'Derivados do Mar', price: 182.27, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-pedacos-em-oleo-88-140-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1443, name: 'ATUM PEQUENO PEDAÇOS EM ÓLEO GOMES DA COSTA 170 G (CX 24 LT)', category: 'Derivados do Mar', price: 215.2, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-pedacos-em-oleo-gomes-da-costa-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1444, name: 'ATUM PEQUENO RALADO EM ÓLEO COQUEIRO 170 G (CX 24 LT)', category: 'Derivados do Mar', price: 178.06, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-ralado-em-oleo-coqueiro-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1445, name: 'ATUM PEQUENO RALADO EM ÓLEO GOMES DA COSTA 170 G (CX 24 LT)', category: 'Derivados do Mar', price: 179.86, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-ralado-em-oleo-gomes-da-costa-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1446, name: 'ATUM PEQUENO RALADO EM ÓLEO PESCADOR 140 G (CX 24 LT)', category: 'Derivados do Mar', price: 156.27, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-ralado-em-oleo-pescador-140-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1447, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO 88 140 G (CX 24 LT)', category: 'Derivados do Mar', price: 204.26, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-solido-em-oleo-88-140-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1448, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO COQUEIRO 170 G (CX 24 LT)', category: 'Derivados do Mar', price: 228.83, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-solido-em-oleo-coqueiro-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1449, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO GOMES DA COSTA 170 G (CX 24 LT)', category: 'Derivados do Mar', price: 243.55, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-solido-em-oleo-gomes-da-costa-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1450, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO PESCADOR 140 G (CX 24 LT)', category: 'Derivados do Mar', price: 196.38, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-solido-em-oleo-pescador-140-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1451, name: 'ATUM RALADO EM ÓLEO CHICHARRO SANTA RITA 410 G', category: 'Derivados do Mar', price: 12.66, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-chicharro-santa-rita-410-g-pmg-atacadista.jpg' },
  { id: 1452, name: 'ATUM RALADO EM ÓLEO MARSUL 400 G', category: 'Derivados do Mar', price: 23.47, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-marsul-400-g-pmg-atacadista.jpg' },
  { id: 1453, name: 'ATUM RALADO EM ÓLEO POUCH 88 500 G', category: 'Derivados do Mar', price: 19.42, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-pouch-88-500-g-pmg-atacadista.jpg' },
  { id: 1454, name: 'ATUM RALADO EM ÓLEO POUCH COQUEIRO 480 G', category: 'Derivados do Mar', price: 21.68, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-pouch-coqueiro-480-g-pmg-atacadista.jpg' },
  { id: 1455, name: 'ATUM RALADO EM ÓLEO POUCH GOMES DA COSTA 500 G', category: 'Derivados do Mar', price: 26.46, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-pouch-gomes-da-costa-500-g-pmg-atacadista.jpg' },
  { id: 1456, name: 'ATUM RALADO EM ÓLEO TOURS 400 G', category: 'Derivados do Mar', price: 25.09, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-tours-400-g-pmg-atacadista.jpg' },
  { id: 1457, name: 'ATUM SÓLIDO EM ÓLEO MARSUL 400 G', category: 'Derivados do Mar', price: 30.02, image: 'https://www.marquesvendaspmg.shop/images/atum-solido-em-oleo-marsul-400-g-pmg-atacadista.jpg' },
  { id: 1458, name: 'ATUM SÓLIDO EM ÓLEO TOURS 420 G', category: 'Derivados do Mar', price: 32.09, image: 'https://www.marquesvendaspmg.shop/images/atum-solido-em-oleo-tours-420-g-pmg-atacadista.jpg' },
  { id: 1459, name: 'BACALHAU DESFIADO REFOGADO TEMPERADO RG 300 G', category: 'Derivados do Mar', price: 45.6, image: 'https://www.marquesvendaspmg.shop/images/bacalhau-desfiado-refogado-temperado-rg-300-g-pmg-atacadista.jpg' },
  { id: 1460, name: 'PRODUTO EM FALTA', category: 'Derivados do Mar', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1461, name: 'CAMARÃO CONGELADO DESCASCADO 7 BARBAS NOVA PESCA 2 KILO', category: 'Derivados do Mar', price: 37.88, image: 'https://www.marquesvendaspmg.shop/images/camarao-congelado-descascado-7-barbas-nova-pesca-2-kilo-pmg-atacadista.jpg' },
  { id: 1462, name: 'CAMARÃO COZIDO REFOGADO TEMPERADO RG 300 G', category: 'Derivados do Mar', price: 47.77, image: 'https://www.marquesvendaspmg.shop/images/camarao-cozido-refogado-temperado-rg-300-g-pmg-atacadista.jpg' },
  { id: 1463, name: 'FILÉ DE MERLUZA CONGELADO IQF PALEMON 1 KILO', category: 'Derivados do Mar', price: 21.93, image: 'https://www.marquesvendaspmg.shop/images/file-de-merluza-congelado-iqf-palemon-1-kilo-pmg-atacadista.jpg' },
  { id: 1464, name: 'FILÉ DE TILÁPIA CONGELADO NOVA PESCA 5 KILO', category: 'Derivados do Mar', price: 137.9, image: 'https://www.marquesvendaspmg.shop/images/file-de-tilapia-congelado-nova-pesca-5-kilo-pmg-atacadista.jpg' },
  { id: 1465, name: 'FILÉ DE TILÁPIA CONGELADO PALEMON 800 G', category: 'Derivados do Mar', price: 31.64, image: 'https://www.marquesvendaspmg.shop/images/file-de-tilapia-congelado-palemon-800-g-pmg-atacadista.jpg' },
  { id: 1466, name: 'ISCAS DE FILÉ DE TILÁPIA EMPANADAS CONGELADAS IQF BAITA 700 G', category: 'Derivados do Mar', price: 17.37, image: 'https://www.marquesvendaspmg.shop/images/iscas-de-file-de-tilapia-empanadas-congeladas-iqf-baita-700-g-pmg-atacadista.jpg' },
  { id: 1467, name: 'POSTA DE CAÇÃO CONGELADA VIEIRA E COUTO 1 KILO', category: 'Derivados do Mar', price: 50.25, image: 'https://www.marquesvendaspmg.shop/images/posta-de-cacao-congelada-vieira-e-couto-1-kilo-pmg-atacadista.jpg' },
  { id: 1468, name: 'SARDINHAS EM ÓLEO COQUEIRO 125 G (CX 54 LT)', category: 'Derivados do Mar', price: 273.03, image: 'https://www.marquesvendaspmg.shop/images/sardinhas-em-oleo-coqueiro-125-g-cx-54-lt-pmg-atacadista.jpg' },
  { id: 1469, name: 'SARDINHAS EM ÓLEO GOMES DA COSTA 125 G (CX 50 LT)', category: 'Derivados do Mar', price: 268.94, image: 'https://www.marquesvendaspmg.shop/images/sardinhas-em-oleo-gomes-da-costa-125-g-cx-50-lt-pmg-atacadista.jpg' },
  { id: 1470, name: 'ABACAXI EM CALDA RODELAS TOZZI 400 G', category: 'Doces/Frutas', price: 17.81, image: 'https://www.marquesvendaspmg.shop/images/abacaxi-em-calda-rodelas-tozzi-400-g-pmg-atacadista.jpg' },
  { id: 1471, name: 'ACHOCOLATADO EM PÓ ITALAC 700 G', category: 'Doces/Frutas', price: 9.82, image: 'https://www.marquesvendaspmg.shop/images/achocolatado-em-po-italac-700-g-pmg-atacadista.jpg' },
  { id: 1472, name: 'ACHOCOLATADO EM PÓ NESCAU 2 KILO', category: 'Doces/Frutas', price: 43.1, image: 'https://www.marquesvendaspmg.shop/images/achocolatado-em-po-nescau-2-kilo-pmg-atacadista.jpg' },
  { id: 1473, name: 'ACHOCOLATADO EM PÓ OVOMALTINE FLOCOS CROCANTES 750 G', category: 'Doces/Frutas', price: 38.99, image: 'https://www.marquesvendaspmg.shop/images/achocolatado-em-po-ovomaltine-flocos-crocantes-750-g-pmg-atacadista.jpg' },
  { id: 1474, name: 'ACHOCOLATADO EM PÓ TODDY 1.8 KILO', category: 'Doces/Frutas', price: 43.46, image: 'https://www.marquesvendaspmg.shop/images/achocolatado-em-po-toddy-18-kilo-pmg-atacadista.jpg' },
  { id: 1475, name: 'AÇÚCAR CONFEITEIRO GLAÇÚCAR UNIÃO 500 G (FDO 20 PCT)', category: 'Doces/Frutas', price: 62.45, image: 'https://www.marquesvendaspmg.shop/images/acucar-confeiteiro-glacucar-uniao-500-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1476, name: 'AÇÚCAR CONFEITEIRO ITAIQUARA 1 KILO', category: 'Doces/Frutas', price: 11.94, image: 'https://www.marquesvendaspmg.shop/images/acucar-confeiteiro-itaiquara-1-kilo-pmg-atacadista.jpg' },
  { id: 1477, name: 'AÇÚCAR CRISTALÇUCAR UNIÃO 1 KILO (FDO 10 PCT)', category: 'Doces/Frutas', price: 50.26, image: 'https://www.marquesvendaspmg.shop/images/acucar-cristalcucar-uniao-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1478, name: 'AÇÚCAR DEMERARA DA BARRA 1 KILO', category: 'Doces/Frutas', price: 57.07, image: 'https://www.marquesvendaspmg.shop/images/acucar-demerara-da-barra-1-kilo-pmg-atacadista.jpg' },
  { id: 1479, name: 'AÇÚCAR DEMERARA NATURALE UNIÃO 1 KILO', category: 'Doces/Frutas', price: 69.25, image: 'https://www.marquesvendaspmg.shop/images/acucar-demerara-naturale-uniao-1-kilo-pmg-atacadista.jpg' },
  { id: 1480, name: 'AÇÚCAR MASCAVO 3 GARÇAS 1 KILO', category: 'Doces/Frutas', price: 10.6, image: 'https://www.marquesvendaspmg.shop/images/acucar-mascavo-3-garcas-1-kilo-pmg-atacadista.jpg' },
  { id: 1481, name: 'AÇÚCAR MASCAVO MINAMEL 1 KILO', category: 'Doces/Frutas', price: 9.6, image: 'https://www.marquesvendaspmg.shop/images/acucar-mascavo-minamel-1-kilo-pmg-atacadista.jpg' },
  { id: 1482, name: 'AÇÚCAR MASCAVO UNIÃO 1 KILO', category: 'Doces/Frutas', price: 17.36, image: 'https://www.marquesvendaspmg.shop/images/acucar-mascavo-uniao-1-kilo-pmg-atacadista.jpg' },
  { id: 1483, name: 'AÇÚCAR ORGÂNICO UNIÃO 1 KILO', category: 'Doces/Frutas', price: 7.04, image: 'https://www.marquesvendaspmg.shop/images/acucar-organico-uniao-1-kilo-pmg-atacadista.jpg' },
  { id: 1484, name: 'AÇÚCAR REFINADO ALTO ALEGRE 1 KILO (FDO 10 PCT)', category: 'Doces/Frutas', price: 46.09, image: 'https://www.marquesvendaspmg.shop/images/acucar-refinado-alto-alegre-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1485, name: 'AÇÚCAR REFINADO CARAVELAS 1 KILO (FDO 10 PCT)', category: 'Doces/Frutas', price: 46.4, image: 'https://www.marquesvendaspmg.shop/images/acucar-refinado-caravelas-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1486, name: 'AÇÚCAR REFINADO GRANULADO DOÇÚCAR UNIÃO 1 KILO', category: 'Doces/Frutas', price: 52.73, image: 'https://www.marquesvendaspmg.shop/images/acucar-refinado-granulado-docucar-uniao-1-kilo-pmg-atacadista.jpg' },
  { id: 1487, name: 'AÇÚCAR REFINADO UNIÃO 1 KILO (FDO 10 PCT)', category: 'Doces/Frutas', price: 49.29, image: 'https://www.marquesvendaspmg.shop/images/acucar-refinado-uniao-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1488, name: 'AÇÚCAR SACHÊ CRISTAL GUARANI 5 G (CX 1000 UN)', category: 'Doces/Frutas', price: 52.69, image: 'https://www.marquesvendaspmg.shop/images/acucar-sache-cristal-guarani-5-g-cx-1000-un-pmg-atacadista.jpg' },
  { id: 1489, name: 'AÇÚCAR SACHÊ MASCAVO UNIÃO 4 G (CX 200 UN)', category: 'Doces/Frutas', price: 25.88, image: 'https://www.marquesvendaspmg.shop/images/acucar-sache-mascavo-uniao-4-g-cx-200-un-pmg-atacadista.jpg' },
  { id: 1490, name: 'AÇÚCAR SACHÊ ORGÂNICO UNIÃO 5 G (CX 400 UN)', category: 'Doces/Frutas', price: 21.86, image: 'https://www.marquesvendaspmg.shop/images/acucar-sache-organico-uniao-5-g-cx-400-un-pmg-atacadista.jpg' },
  { id: 1491, name: 'AÇÚCAR SACHÊ PREMIUM UNIÃO 5 G (CX 400 UN)', category: 'Doces/Frutas', price: 19.87, image: 'https://www.marquesvendaspmg.shop/images/acucar-sache-premium-uniao-5-g-cx-400-un-pmg-atacadista.jpg' },
  { id: 1492, name: 'ADOÇANTE LÍQUIDO SUCRALOSE UNIÃO 65 ML (CX 12 FR)', category: 'Doces/Frutas', price: 83.68, image: 'https://www.marquesvendaspmg.shop/images/adocante-liquido-sucralose-uniao-65-ml-cx-12-fr-pmg-atacadista.jpg' },
  { id: 1493, name: 'ADOÇANTE SACHÊ DEGUST 0,4 G (CX 1000 UN)', category: 'Doces/Frutas', price: 51.93, image: 'https://www.marquesvendaspmg.shop/images/adocante-sache-degust-04-g-cx-1000-un-pmg-atacadista.jpg' },
  { id: 1494, name: 'ADOÇANTE SACHÊ SUCRALOSE UNIÃO 0,6 G (CX 400 UN)', category: 'Doces/Frutas', price: 32.53, image: 'https://www.marquesvendaspmg.shop/images/adocante-sache-sucralose-uniao-06-g-cx-400-un-pmg-atacadista.jpg' },
  { id: 1495, name: 'AMEIXA EM CALDA TOZZI 400 G', category: 'Doces/Frutas', price: 13.73, image: 'https://www.marquesvendaspmg.shop/images/ameixa-em-calda-tozzi-400-g-pmg-atacadista.jpg' },
  { id: 1496, name: 'AMEIXA SECA SEM CAROÇO BRASILSECO 1KILO', category: 'Doces/Frutas', price: 34.36, image: 'https://www.marquesvendaspmg.shop/images/ameixa-seca-sem-caroco-brasilseco-1kilo-pmg-atacadista.jpg' },
  { id: 1497, name: 'AMEIXA SECA SEM CAROÇO LERYC 1 KILO', category: 'Doces/Frutas', price: 31.12, image: 'https://www.marquesvendaspmg.shop/images/ameixa-seca-sem-caroco-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1498, name: 'AMÊNDOA LAMINADA BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 109.41, image: 'https://www.marquesvendaspmg.shop/images/amendoa-laminada-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1499, name: 'AMENDOIM TORRADO GRANULADO VABENE 1,05 KILO', category: 'Doces/Frutas', price: 19.42, image: 'https://www.marquesvendaspmg.shop/images/amendoim-torrado-granulado-vabene-105-kilo-pmg-atacadista.jpg' },
  { id: 1500, name: 'AMENDOIM TORRADO GRANULADO XERÉM LERYC 1 KILO', category: 'Doces/Frutas', price: 19.33, image: 'https://www.marquesvendaspmg.shop/images/amendoim-torrado-granulado-xerem-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1501, name: 'AMENDOIM TORRADO SALGADO SEM PELE BRASILSECO 1,01 KILO', category: 'Doces/Frutas', price: 20.01, image: 'https://www.marquesvendaspmg.shop/images/amendoim-torrado-salgado-sem-pele-brasilseco-101-kilo-pmg-atacadista.jpg' },
  { id: 1502, name: 'AMENDOIM TORRADO SALGADO SEM PELE LERYC 1 KILO', category: 'Doces/Frutas', price: 22.05, image: 'https://www.marquesvendaspmg.shop/images/amendoim-torrado-salgado-sem-pele-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1503, name: 'AROMA ARTIFICIAL DE BAUNILHA CEPÊRA 480 ML', category: 'Doces/Frutas', price: 18.74, image: 'https://www.marquesvendaspmg.shop/images/aroma-artificial-de-baunilha-cepera-480-ml-pmg-atacadista.jpg' },
  { id: 1504, name: 'AVELÃ SEM CASCA LERYC 1 KILO', category: 'Doces/Frutas', price: 95.74, image: 'https://www.marquesvendaspmg.shop/images/avela-sem-casca-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1505, name: 'BOMBOM OURO BRANCO LACTA 1 KILO', category: 'Doces/Frutas', price: 64.28, image: 'https://www.marquesvendaspmg.shop/images/bombom-ouro-branco-lacta-1-kilo-pmg-atacadista.jpg' },
  { id: 1506, name: 'BOMBOM SONHO DE VALSA LACTA 1 KILO', category: 'Doces/Frutas', price: 64.28, image: 'https://www.marquesvendaspmg.shop/images/bombom-sonho-de-valsa-lacta-1-kilo-pmg-atacadista.jpg' },
  { id: 1507, name: 'BRIGADEIRO COM REQUEIJÃO SANTA MARINA 1,350 KILO', category: 'Doces/Frutas', price: 35.94, image: 'https://www.marquesvendaspmg.shop/images/brigadeiro-com-requeijao-santa-marina-1350-kilo-pmg-atacadista.jpg' },
  { id: 1508, name: 'BRIGADEIRO GRANDE MOÇA NESTLÉ 2,57 KILO', category: 'Doces/Frutas', price: 116.69, image: 'https://www.marquesvendaspmg.shop/images/brigadeiro-grande-moca-nestle-257-kilo-pmg-atacadista.jpg' },
  { id: 1509, name: 'BRIGADEIRO PEQUENO MOÇA NESTLÉ 1,01 KILO', category: 'Doces/Frutas', price: 48.58, image: 'https://www.marquesvendaspmg.shop/images/brigadeiro-pequeno-moca-nestle-101-kilo-pmg-atacadista.jpg' },
  { id: 1510, name: 'CASTANHA DE CAJU TORRADA COM SAL BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 66.46, image: 'https://www.marquesvendaspmg.shop/images/castanha-de-caju-torrada-com-sal-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1511, name: 'CASTANHA DE CAJU TORRADA COM SAL LERYC 1 KILO', category: 'Doces/Frutas', price: 67.74, image: 'https://www.marquesvendaspmg.shop/images/castanha-de-caju-torrada-com-sal-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1512, name: 'CASTANHA DO PARÁ BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 123.58, image: 'https://www.marquesvendaspmg.shop/images/castanha-do-para-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1513, name: 'CASTANHA DO PARÁ QUEBRADA LERYC 1 KILO', category: 'Doces/Frutas', price: 148.26, image: 'https://www.marquesvendaspmg.shop/images/castanha-do-para-quebrada-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1514, name: 'CEBOLA CARAMELIZADA HOMEMADE 2 KILO', category: 'Doces/Frutas', price: 57.12, image: 'https://www.marquesvendaspmg.shop/images/cebola-caramelizada-homemade-2-kilo-pmg-atacadista.jpg' },
  { id: 1515, name: 'CEREJA MARRASQUINO SEM TALO CEPÊRA 125 G', category: 'Doces/Frutas', price: 18.48, image: 'https://www.marquesvendaspmg.shop/images/cereja-marrasquino-sem-talo-cepera-125-g-pmg-atacadista.jpg' },
  { id: 1516, name: 'CEREJA MARRASQUINO SEM TALO CURICO 1,8 KILO', category: 'Doces/Frutas', price: 127.55, image: 'https://www.marquesvendaspmg.shop/images/cereja-marrasquino-sem-talo-curico-18-kilo-pmg-atacadista.jpg' },
  { id: 1517, name: 'CEREJA MARRASQUINO SEM TALO TOZZI 2,2 KILO', category: 'Doces/Frutas', price: 109.79, image: 'https://www.marquesvendaspmg.shop/images/cereja-marrasquino-sem-talo-tozzi-22-kilo-pmg-atacadista.jpg' },
  { id: 1518, name: 'CHOCOLATE AO LEITE MELKEN HARALD 2,1 KILO', category: 'Doces/Frutas', price: 176.38, image: 'https://www.marquesvendaspmg.shop/images/chocolate-ao-leite-melken-harald-21-kilo-pmg-atacadista.jpg' },
  { id: 1519, name: 'CHOCOLATE AO LEITE NESTLÉ 2,1 KILO', category: 'Doces/Frutas', price: 175.1, image: 'https://www.marquesvendaspmg.shop/images/chocolate-ao-leite-nestle-21-kilo-pmg-atacadista.jpg' },
  { id: 1520, name: 'CHOCOLATE BRANCO MELKEN HARALD 2,1 KILO', category: 'Doces/Frutas', price: 145.16, image: 'https://www.marquesvendaspmg.shop/images/chocolate-branco-melken-harald-21-kilo-pmg-atacadista.jpg' },
  { id: 1521, name: 'CHOCOLATE COBERTURA GOTAS AO LEITE TOP HARALD 2,050 KILO', category: 'Doces/Frutas', price: 153.43, image: 'https://www.marquesvendaspmg.shop/images/chocolate-cobertura-gotas-ao-leite-top-harald-2050-kilo-pmg-atacadista.jpg' },
  { id: 1522, name: 'CHOCOLATE COBERTURA GOTAS MEIO AMARGO 42% CACAU MELKEN HARALD 1,010 KILO', category: 'Doces/Frutas', price: 77.04, image: 'https://www.marquesvendaspmg.shop/images/chocolate-cobertura-gotas-meio-amargo-42-cacau-melken-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1523, name: 'CHOCOLATE EM PÓ 100% CACAU MELKEN HARALD 500 G', category: 'Doces/Frutas', price: 37.71, image: 'https://www.marquesvendaspmg.shop/images/chocolate-em-po-100-cacau-melken-harald-500-g-pmg-atacadista.jpg' },
  { id: 1524, name: 'CHOCOLATE EM PÓ 33% CACAU DOCEIRO 1,05 KILO', category: 'Doces/Frutas', price: 29.85, image: 'https://www.marquesvendaspmg.shop/images/chocolate-em-po-33-cacau-doceiro-105-kilo-pmg-atacadista.jpg' },
  { id: 1525, name: 'CHOCOLATE EM PÓ 33% CACAU MELKEN HARALD 1,010 KILO', category: 'Doces/Frutas', price: 40.9, image: 'https://www.marquesvendaspmg.shop/images/chocolate-em-po-33-cacau-melken-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1526, name: 'CHOCOLATE EM PÓ 50% CACAU ALIBRA 1 KILO', category: 'Doces/Frutas', price: 42.47, image: 'https://www.marquesvendaspmg.shop/images/chocolate-em-po-50-cacau-alibra-1-kilo-pmg-atacadista.jpg' },
  { id: 1527, name: 'CHOCOLATE EM PÓ 50% CACAU DOCEIRO 1,05 KILO', category: 'Doces/Frutas', price: 38.84, image: 'https://www.marquesvendaspmg.shop/images/chocolate-em-po-50-cacau-doceiro-105-kilo-pmg-atacadista.jpg' },
  { id: 1528, name: 'CHOCOLATE EM PÓ 50% CACAU DOIS FRADES NESTLÉ 1,01 KILO', category: 'Doces/Frutas', price: 80.52, image: 'https://www.marquesvendaspmg.shop/images/chocolate-em-po-50-cacau-dois-frades-nestle-101-kilo-pmg-atacadista.jpg' },
  { id: 1529, name: 'CHOCOLATE EM PÓ 50% CACAU MELKEN HARALD 1,010 KILO', category: 'Doces/Frutas', price: 56.24, image: 'https://www.marquesvendaspmg.shop/images/chocolate-em-po-50-cacau-melken-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1530, name: 'CHOCOLATE EM PÓ 70% CACAU MELKEN HARALD 500 G', category: 'Doces/Frutas', price: 29.65, image: 'https://www.marquesvendaspmg.shop/images/chocolate-em-po-70-cacau-melken-harald-500-g-pmg-atacadista.jpg' },
  { id: 1531, name: 'CHOCOLATE FORNEÁVEL AO LEITE CAMP 1,010 KILO', category: 'Doces/Frutas', price: 34.88, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-ao-leite-camp-1010-kilo-pmg-atacadista.jpg' },
  { id: 1532, name: 'CHOCOLATE FORNEÁVEL AO LEITE CONFEIPOP 1,010 KILO', category: 'Doces/Frutas', price: 25.83, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-ao-leite-confeipop-1010-kilo-pmg-atacadista.jpg' },
  { id: 1533, name: 'CHOCOLATE FORNEÁVEL AO LEITE CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 35.99, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-ao-leite-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1534, name: 'CHOCOLATE FORNEÁVEL AO LEITE DOLCI SCALA 1,005 KILO', category: 'Doces/Frutas', price: 31.56, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-ao-leite-dolci-scala-1005-kilo-pmg-atacadista.jpg' },
  { id: 1535, name: 'CHOCOLATE FORNEÁVEL AO LEITE VABENE 1,010 KILO', category: 'Doces/Frutas', price: 32.99, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-ao-leite-vabene-1010-kilo-pmg-atacadista.jpg' },
  { id: 1536, name: 'CHOCOLATE FORNEÁVEL AVELÃ CAMP 1,010 KILO', category: 'Doces/Frutas', price: 33.89, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-avela-camp-1010-kilo-pmg-atacadista.jpg' },
  { id: 1537, name: 'CHOCOLATE FORNEÁVEL AVELÃ CONFEIPOP 1,010 KILO', category: 'Doces/Frutas', price: 27.19, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-avela-confeipop-1010-kilo-pmg-atacadista.jpg' },
  { id: 1538, name: 'CHOCOLATE FORNEÁVEL AVELÃ CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 33.57, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-avela-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1539, name: 'CHOCOLATE FORNEÁVEL BRANCO CONFEIPOP 1,010 KILO', category: 'Doces/Frutas', price: 23.76, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-branco-confeipop-1010-kilo-pmg-atacadista.jpg' },
  { id: 1540, name: 'CHOCOLATE FORNEÁVEL BRANCO CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 28.09, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-branco-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1541, name: 'CHOCOLATE FORNEÁVEL BRANCO DOCEIRO 1,005 KILO', category: 'Doces/Frutas', price: 23.3, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-branco-doceiro-1005-kilo-pmg-atacadista.jpg' },
  { id: 1542, name: 'CHOCOLATE FORNEÁVEL BRANCO VABENE 1,010 KILO', category: 'Doces/Frutas', price: 23.41, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-branco-vabene-1010-kilo-pmg-atacadista.jpg' },
  { id: 1543, name: 'CHOCOLATE FORNEÁVEL GRANDE AO LEITE CONFEITEIRO HARALD 2,010 KILO', category: 'Doces/Frutas', price: 64.41, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-grande-ao-leite-confeiteiro-harald-2010-kilo-pmg-atacadista.jpg' },
  { id: 1544, name: 'CHOCOLATE FORNEÁVEL GRANDE AO LEITE DOCEIRO 2,010 KILO', category: 'Doces/Frutas', price: 50.3, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-grande-ao-leite-doceiro-2010-kilo-pmg-atacadista.jpg' },
  { id: 1545, name: 'CHOCOLATE FORNEÁVEL GRANDE AVELÃ DOCEIRO 2,010 KILO', category: 'Doces/Frutas', price: 52.44, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-grande-avela-doceiro-2010-kilo-pmg-atacadista.jpg' },
  { id: 1546, name: 'CHOCOLATE GRANDE DISQUETI DORI 1,01 KILO', category: 'Doces/Frutas', price: 71.37, image: 'https://www.marquesvendaspmg.shop/images/chocolate-grande-disqueti-dori-101-kilo-pmg-atacadista.jpg' },
  { id: 1547, name: 'CHOCOLATE GRANULADO CROCANTE CAMP 1,010 KILO', category: 'Doces/Frutas', price: 18.81, image: 'https://www.marquesvendaspmg.shop/images/chocolate-granulado-crocante-camp-1010-kilo-pmg-atacadista.jpg' },
  { id: 1548, name: 'CHOCOLATE GRANULADO CROCANTE CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 26.24, image: 'https://www.marquesvendaspmg.shop/images/chocolate-granulado-crocante-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1549, name: 'CHOCOLATE GRANULADO MACIO CAMP 1,010 KILO', category: 'Doces/Frutas', price: 24.55, image: 'https://www.marquesvendaspmg.shop/images/chocolate-granulado-macio-camp-1010-kilo-pmg-atacadista.jpg' },
  { id: 1550, name: 'CHOCOLATE GRANULADO MACIO CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 26.63, image: 'https://www.marquesvendaspmg.shop/images/chocolate-granulado-macio-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1551, name: 'CHOCOLATE INOVARE AO LEITE HARALD 2,1 KILO', category: 'Doces/Frutas', price: 81.09, image: 'https://www.marquesvendaspmg.shop/images/chocolate-inovare-ao-leite-harald-21-kilo-pmg-atacadista.jpg' },
  { id: 1552, name: 'CHOCOLATE INOVARE BRANCO HARALD 2,1 KILO', category: 'Doces/Frutas', price: 93.36, image: 'https://www.marquesvendaspmg.shop/images/chocolate-inovare-branco-harald-21-kilo-pmg-atacadista.jpg' },
  { id: 1553, name: 'CHOCOLATE INOVARE INTENSO MEIO AMARGO HARALD 2,1 KILO', category: 'Doces/Frutas', price: 89.58, image: 'https://www.marquesvendaspmg.shop/images/chocolate-inovare-intenso-meio-amargo-harald-21-kilo-pmg-atacadista.jpg' },
  { id: 1554, name: 'CHOCOLATE M&M´S 1 KILO', category: 'Doces/Frutas', price: 82.81, image: 'https://www.marquesvendaspmg.shop/images/chocolate-mms-1-kilo-pmg-atacadista.jpg' },
  { id: 1555, name: 'CHOCOLATE MEIO AMARGO MELKEN HARALD 2,1 KILO', category: 'Doces/Frutas', price: 169.99, image: 'https://www.marquesvendaspmg.shop/images/chocolate-meio-amargo-melken-harald-21-kilo-pmg-atacadista.jpg' },
  { id: 1556, name: 'CHOCOLATE MEIO AMARGO NESTLÉ 2,1 KILO', category: 'Doces/Frutas', price: 175.1, image: 'https://www.marquesvendaspmg.shop/images/chocolate-meio-amargo-nestle-21-kilo-pmg-atacadista.jpg' },
  { id: 1557, name: 'CHOCOLATE MINI DISQUETI DORI 500 G', category: 'Doces/Frutas', price: 36.43, image: 'https://www.marquesvendaspmg.shop/images/chocolate-mini-disqueti-dori-500-g-pmg-atacadista.jpg' },
  { id: 1558, name: 'CHOCOLATE PEQUENO PASTA CREMOSA KIT KAT NESTLÉ 1,01 KILO', category: 'Doces/Frutas', price: 80.52, image: 'https://www.marquesvendaspmg.shop/images/chocolate-pequeno-pasta-cremosa-kit-kat-nestle-101-kilo-pmg-atacadista.jpg' },
  { id: 1559, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1560, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1561, name: 'COBERTURA PARA SORVETE CARAMELO MARVI 1 KILO', category: 'Doces/Frutas', price: 17.94, image: 'https://www.marquesvendaspmg.shop/images/cobertura-para-sorvete-caramelo-marvi-1-kilo-pmg-atacadista.jpg' },
  { id: 1562, name: 'COBERTURA PARA SORVETE CHOCOLATE MARVI 1,01 KILO', category: 'Doces/Frutas', price: 27.56, image: 'https://www.marquesvendaspmg.shop/images/cobertura-para-sorvete-chocolate-marvi-101-kilo-pmg-atacadista.jpg' },
  { id: 1563, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1564, name: 'COBERTURA PARA SORVETE MORANGO MARVI 1 KILO', category: 'Doces/Frutas', price: 20.01, image: 'https://www.marquesvendaspmg.shop/images/cobertura-para-sorvete-morango-marvi-1-kilo-pmg-atacadista.jpg' },
  { id: 1565, name: 'COBERTURA PARA SORVETE PEQUENA CARAMELO MARVI 190 G', category: 'Doces/Frutas', price: 8.22, image: 'https://www.marquesvendaspmg.shop/images/cobertura-para-sorvete-pequena-caramelo-marvi-190-g-pmg-atacadista.jpg' },
  { id: 1566, name: 'COBERTURA PARA SORVETE PEQUENA CHOCOLATE MARVI 190 G', category: 'Doces/Frutas', price: 6.64, image: 'https://www.marquesvendaspmg.shop/images/cobertura-para-sorvete-pequena-chocolate-marvi-190-g-pmg-atacadista.jpg' },
  { id: 1567, name: 'COCO RALADO ADOÇADO INDIANO 1 KILO', category: 'Doces/Frutas', price: 34.5, image: 'https://www.marquesvendaspmg.shop/images/coco-ralado-adocado-indiano-1-kilo-pmg-atacadista.jpg' },
  { id: 1568, name: 'COCO RALADO ÚMIDO E ADOÇADO MAIS COCO 1 KILO', category: 'Doces/Frutas', price: 48.27, image: 'https://www.marquesvendaspmg.shop/images/coco-ralado-umido-e-adocado-mais-coco-1-kilo-pmg-atacadista.jpg' },
  { id: 1569, name: 'COCO RALADO ÚMIDO E ADOÇADO SERGIPE 1 KILO', category: 'Doces/Frutas', price: 26.6, image: 'https://www.marquesvendaspmg.shop/images/coco-ralado-umido-e-adocado-sergipe-1-kilo-pmg-atacadista.jpg' },
  { id: 1570, name: 'CREME CONFEITEIRO ITAIQUARA 1 KILO', category: 'Doces/Frutas', price: 12.08, image: 'https://www.marquesvendaspmg.shop/images/creme-confeiteiro-itaiquara-1-kilo-pmg-atacadista.jpg' },
  { id: 1571, name: 'CREME DE AVELÃ GRANDE COM CACAU FOOD SERVICE NUTELLA 3 KILO', category: 'Doces/Frutas', price: 205.11, image: 'https://www.marquesvendaspmg.shop/images/creme-de-avela-grande-com-cacau-food-service-nutella-3-kilo-pmg-atacadista.jpg' },
  { id: 1572, name: 'CREME DE AVELÃ GRANDE COM CACAU NUTBELLO', category: 'Doces/Frutas', price: 123.37, image: 'https://www.marquesvendaspmg.shop/images/creme-de-avela-grande-com-cacau-nutbello-pmg-atacadista.jpg' },
  { id: 1573, name: 'CREME DE AVELÃ PEQUENO COM CACAU NUTBELLO 1,01 KILO', category: 'Doces/Frutas', price: 44.26, image: 'https://www.marquesvendaspmg.shop/images/creme-de-avela-pequeno-com-cacau-nutbello-101-kilo-pmg-atacadista.jpg' },
  { id: 1574, name: 'CREME DE AVELÃ PEQUENO COM CACAU NUTELLA 650 G', category: 'Doces/Frutas', price: 45.66, image: 'https://www.marquesvendaspmg.shop/images/creme-de-avela-pequeno-com-cacau-nutella-650-g-pmg-atacadista.jpg' },
  { id: 1575, name: 'CREME DE MORANGO \'MARROM\' RECHEIO ARTESANAL VABENE 1,01 KILO', category: 'Doces/Frutas', price: 34.51, image: 'https://www.marquesvendaspmg.shop/images/creme-de-morango-marrom-recheio-artesanal-vabene-101-kilo-pmg-atacadista.jpg' },
  { id: 1576, name: 'CREME DE PISTACHE DOCEIRO 1,005 KILO', category: 'Doces/Frutas', price: 50.19, image: 'https://www.marquesvendaspmg.shop/images/creme-de-pistache-doceiro-1005-kilo-pmg-atacadista.jpg' },
  { id: 1577, name: 'CREME DE PISTACHE PEQUENO VABENE 1,01 KILO', category: 'Doces/Frutas', price: 60.07, image: 'https://www.marquesvendaspmg.shop/images/creme-de-pistache-pequeno-vabene-101-kilo-pmg-atacadista.jpg' },
  { id: 1578, name: 'CREME FORNEÁVEL DE AMENDOIM DADINHO 1 KILO', category: 'Doces/Frutas', price: 46.77, image: 'https://www.marquesvendaspmg.shop/images/creme-forneavel-de-amendoim-dadinho-1-kilo-pmg-atacadista.jpg' },
  { id: 1579, name: 'DAMASCO LERYC 1 KILO', category: 'Doces/Frutas', price: 88.64, image: 'https://www.marquesvendaspmg.shop/images/damasco-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1580, name: 'DAMASCO TURCO BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 89.12, image: 'https://www.marquesvendaspmg.shop/images/damasco-turco-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1581, name: 'DOCE DE LEITE DOCEIRO 1,001 KILO', category: 'Doces/Frutas', price: 18.8, image: 'https://www.marquesvendaspmg.shop/images/doce-de-leite-doceiro-1001-kilo-pmg-atacadista.jpg' },
  { id: 1582, name: 'FAROFA DE AMENDOIM CROCANTE VABENE 1,05 KILO', category: 'Doces/Frutas', price: 20.46, image: 'https://www.marquesvendaspmg.shop/images/farofa-de-amendoim-crocante-vabene-105-kilo-pmg-atacadista.jpg' },
  { id: 1583, name: 'FIGO EM CALDA TOZZI 400 G', category: 'Doces/Frutas', price: 16.5, image: 'https://www.marquesvendaspmg.shop/images/figo-em-calda-tozzi-400-g-pmg-atacadista.jpg' },
  { id: 1584, name: 'FRUTAS CRISTALIZADAS BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 20.45, image: 'https://www.marquesvendaspmg.shop/images/frutas-cristalizadas-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1585, name: 'GELATINA ABACAXI QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://www.marquesvendaspmg.shop/images/gelatina-abacaxi-qualimax-1-kilo-pmg-atacadista.jpg' },
  { id: 1586, name: 'GELATINA CEREJA QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://www.marquesvendaspmg.shop/images/gelatina-cereja-qualimax-1-kilo-pmg-atacadista.jpg' },
  { id: 1587, name: 'GELATINA FRAMBOESA QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://www.marquesvendaspmg.shop/images/gelatina-framboesa-qualimax-1-kilo-pmg-atacadista.jpg' },
  { id: 1588, name: 'GELATINA LIMÃO QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://www.marquesvendaspmg.shop/images/gelatina-limao-qualimax-1-kilo-pmg-atacadista.jpg' },
  { id: 1589, name: 'GELATINA MORANGO QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://www.marquesvendaspmg.shop/images/gelatina-morango-qualimax-1-kilo-pmg-atacadista.jpg' },
  { id: 1590, name: 'GELATINA PÊSSEGO QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://www.marquesvendaspmg.shop/images/gelatina-pessego-qualimax-1-kilo-pmg-atacadista.jpg' },
  { id: 1591, name: 'GELATINA SEM SABOR QUALIMAX 510 G', category: 'Doces/Frutas', price: 70.89, image: 'https://www.marquesvendaspmg.shop/images/gelatina-sem-sabor-qualimax-510-g-pmg-atacadista.jpg' },
  { id: 1592, name: 'GELATINA UVA QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://www.marquesvendaspmg.shop/images/gelatina-uva-qualimax-1-kilo-pmg-atacadista.jpg' },
  { id: 1593, name: 'GELÉIA DE DAMASCO HOMEMADE 2 KILO', category: 'Doces/Frutas', price: 60.12, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-damasco-homemade-2-kilo-pmg-atacadista.jpg' },
  { id: 1594, name: 'GELÉIA DE FRUTAS VERMELHAS HOMEMADE 2 KILO', category: 'Doces/Frutas', price: 60.12, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-frutas-vermelhas-homemade-2-kilo-pmg-atacadista.jpg' },
  { id: 1595, name: 'GELÉIA DE MORANGO E ABACAXI SACHÊ HOMEMADE 15 G (CX 144 UN)', category: 'Doces/Frutas', price: 57.98, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-morango-e-abacaxi-sache-homemade-15-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1596, name: 'GELÉIA DE MORANGO E GOIABA SACHÊ BOM SABOR / DEGUST 15 G (CX 144 UN)', category: 'Doces/Frutas', price: 84.76, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-morango-e-goiaba-sache-bom-sabor-degust-15-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1597, name: 'GELÉIA DE MORANGO E GOIABA SACHÊ HOMEMADE 15 G (CX 144 UN)', category: 'Doces/Frutas', price: 61.4, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-morango-e-goiaba-sache-homemade-15-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1598, name: 'GELÉIA DE MORANGO E GOIABA SACHÊ ISIS 10 G (CX 144 UN)', category: 'Doces/Frutas', price: 38.65, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-morango-e-goiaba-sache-isis-10-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1599, name: 'GELÉIA DE MORANGO E UVA SACHÊ BOM SABOR 15 G (CX 144 UN)', category: 'Doces/Frutas', price: 84.76, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-morango-e-uva-sache-bom-sabor-15-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1600, name: 'GELÉIA DE MORANGO HOMEMADE 2 KILO', category: 'Doces/Frutas', price: 57.26, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-morango-homemade-2-kilo-pmg-atacadista.jpg' },
  { id: 1601, name: 'GELÉIA DE PIMENTA AGRIDOCE PREDILECTA 320 G', category: 'Doces/Frutas', price: 23.79, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-pimenta-agridoce-predilecta-320-g-pmg-atacadista.jpg' },
  { id: 1602, name: 'GELÉIA DE PIMENTA AGRIDOCE VAL 230 G', category: 'Doces/Frutas', price: 11.84, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-pimenta-agridoce-val-230-g-pmg-atacadista.jpg' },
  { id: 1603, name: 'GELÉIA DE PIMENTA GOURMET HOMEMADE 320 G', category: 'Doces/Frutas', price: 18.19, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-pimenta-gourmet-homemade-320-g-pmg-atacadista.jpg' },
  { id: 1604, name: 'GELÉIA DE PIMENTA HOMEMADE 2 KILO', category: 'Doces/Frutas', price: 51.89, image: 'https://www.marquesvendaspmg.shop/images/geleia-de-pimenta-homemade-2-kilo-pmg-atacadista.jpg' },
  { id: 1605, name: 'GLICOSE YOKI 350 G', category: 'Doces/Frutas', price: 19.51, image: 'https://www.marquesvendaspmg.shop/images/glicose-yoki-350-g-pmg-atacadista.jpg' },
  { id: 1606, name: 'GOIABADA BISNAGA RALSTON 1,01 KILO', category: 'Doces/Frutas', price: 17.71, image: 'https://www.marquesvendaspmg.shop/images/goiabada-bisnaga-ralston-101-kilo-pmg-atacadista.jpg' },
  { id: 1607, name: 'GOIABADA BISNAGA VAL 1,01 KILO', category: 'Doces/Frutas', price: 16.93, image: 'https://www.marquesvendaspmg.shop/images/goiabada-bisnaga-val-101-kilo-pmg-atacadista.jpg' },
  { id: 1608, name: 'GOIABADA BISNAGA ZAINE 1,01 KILO', category: 'Doces/Frutas', price: 15.24, image: 'https://www.marquesvendaspmg.shop/images/goiabada-bisnaga-zaine-101-kilo-pmg-atacadista.jpg' },
  { id: 1609, name: 'GOIABADA PEÇA RALSTON 400 G', category: 'Doces/Frutas', price: 9.58, image: 'https://www.marquesvendaspmg.shop/images/goiabada-peca-ralston-400-g-pmg-atacadista.jpg' },
  { id: 1610, name: 'GOIABADA PEÇA VAL 400 G', category: 'Doces/Frutas', price: 7.41, image: 'https://www.marquesvendaspmg.shop/images/goiabada-peca-val-400-g-pmg-atacadista.jpg' },
  { id: 1611, name: 'GOIABADA PEÇA ZAINE 300 G', category: 'Doces/Frutas', price: 3.5, image: 'https://www.marquesvendaspmg.shop/images/goiabada-peca-zaine-300-g-pmg-atacadista.jpg' },
  { id: 1612, name: 'GRANOLA TRADICIONAL BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 20.6, image: 'https://www.marquesvendaspmg.shop/images/granola-tradicional-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1613, name: 'GRANOLA TRADICIONAL JP PEREIRA 1 KILO', category: 'Doces/Frutas', price: 22.87, image: 'https://www.marquesvendaspmg.shop/images/granola-tradicional-jp-pereira-1-kilo-pmg-atacadista.jpg' },
  { id: 1614, name: 'LEITE DE COCO GRANDE MAIS COCO 1 L', category: 'Doces/Frutas', price: 31.34, image: 'https://www.marquesvendaspmg.shop/images/leite-de-coco-grande-mais-coco-1-l-pmg-atacadista.jpg' },
  { id: 1615, name: 'LEITE DE COCO PEQUENO MAIS COCO 200 ML (CX 24 UN)', category: 'Doces/Frutas', price: 86.61, image: 'https://www.marquesvendaspmg.shop/images/leite-de-coco-pequeno-mais-coco-200-ml-cx-24-un-pmg-atacadista.jpg' },
  { id: 1616, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1617, name: 'MEL ISIS 1 KILO', category: 'Doces/Frutas', price: 53.55, image: 'https://www.marquesvendaspmg.shop/images/mel-isis-1-kilo-pmg-atacadista.jpg' },
  { id: 1618, name: 'MEL JP PEREIRA 500 G', category: 'Doces/Frutas', price: 47.92, image: 'https://www.marquesvendaspmg.shop/images/mel-jp-pereira-500-g-pmg-atacadista.jpg' },
  { id: 1619, name: 'MEL MINAMEL 1 KILO', category: 'Doces/Frutas', price: 51.79, image: 'https://www.marquesvendaspmg.shop/images/mel-minamel-1-kilo-pmg-atacadista.jpg' },
  { id: 1620, name: 'MEL PEQUENO ISIS 260 G', category: 'Doces/Frutas', price: 19.33, image: 'https://www.marquesvendaspmg.shop/images/mel-pequeno-isis-260-g-pmg-atacadista.jpg' },
  { id: 1621, name: 'MEL PEQUENO MINAMEL 900 G', category: 'Doces/Frutas', price: 15.83, image: 'https://www.marquesvendaspmg.shop/images/mel-pequeno-minamel-900-g-pmg-atacadista.jpg' },
  { id: 1622, name: 'MEL SACHÊ ISIS 15 G (CX 144 UN)', category: 'Doces/Frutas', price: 88.75, image: 'https://www.marquesvendaspmg.shop/images/mel-sache-isis-15-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1623, name: 'MELADO DE CANA MINAMEL 500 G', category: 'Doces/Frutas', price: 13.16, image: 'https://www.marquesvendaspmg.shop/images/melado-de-cana-minamel-500-g-pmg-atacadista.jpg' },
  { id: 1624, name: 'NOZES MARIPOSA LERYC 1 KILO', category: 'Doces/Frutas', price: 67.29, image: 'https://www.marquesvendaspmg.shop/images/nozes-mariposa-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1625, name: 'NOZES MARIPOSA SEM CASCA BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 71.64, image: 'https://www.marquesvendaspmg.shop/images/nozes-mariposa-sem-casca-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1626, name: 'PAÇOQUINHA DE AMENDOIM QUADRADA DADINHO 20 G (CX 40 UN)', category: 'Doces/Frutas', price: 23.73, image: 'https://www.marquesvendaspmg.shop/images/pacoquinha-de-amendoim-quadrada-dadinho-20-g-cx-40-un-pmg-atacadista.jpg' },
  { id: 1627, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1628, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1629, name: 'RECHEIO E COBERTURA \'VERMELHO\' SABOR MORANGO VABENE 1,01 KILO', category: 'Doces/Frutas', price: 21.7, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-vermelho-sabor-morango-vabene-101-kilo-pmg-atacadista.jpg' },
  { id: 1630, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1631, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1632, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1633, name: 'RECHEIO E COBERTURA SABOR CHOCOLATE MOÇA NESTLÉ 2,54 KILO', category: 'Doces/Frutas', price: 123.2, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-sabor-chocolate-moca-nestle-254-kilo-pmg-atacadista.jpg' },
  { id: 1634, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1635, name: 'RECHEIO E COBERTURA SABOR LEITINHO DOCEIRO 1,005 KILO', category: 'Doces/Frutas', price: 33.02, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-sabor-leitinho-doceiro-1005-kilo-pmg-atacadista.jpg' },
  { id: 1636, name: 'RECHEIO E COBERTURA SABOR LEITINHO MELKEN 1,010 KILO', category: 'Doces/Frutas', price: 38.62, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-sabor-leitinho-melken-1010-kilo-pmg-atacadista.jpg' },
  { id: 1637, name: 'RECHEIO E COBERTURA SABOR LEITINHO VABENE 1,01 KILO', category: 'Doces/Frutas', price: 39.88, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-sabor-leitinho-vabene-101-kilo-pmg-atacadista.jpg' },
  { id: 1638, name: 'RECHEIO E COBERTURA SABOR MORANGO DOCEIRO 1,005 KILO', category: 'Doces/Frutas', price: 24.84, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-sabor-morango-doceiro-1005-kilo-pmg-atacadista.jpg' },
  { id: 1639, name: 'RECHEIO E COBERTURA SABOR OVOMALTINE 2,1 KILO', category: 'Doces/Frutas', price: 141.93, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-sabor-ovomaltine-21-kilo-pmg-atacadista.jpg' },
  { id: 1640, name: 'RECHEIO E COBERTURA SABOR OVOMALTINE 900 G', category: 'Doces/Frutas', price: 60.98, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-sabor-ovomaltine-900-g-pmg-atacadista.jpg' },
  { id: 1641, name: 'UVA PASSA BRANCA LERYC 1 KILO', category: 'Doces/Frutas', price: 33.94, image: 'https://www.marquesvendaspmg.shop/images/uva-passa-branca-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1642, name: 'UVA PASSA BRANCA SEM SEMENTE BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 43.46, image: 'https://www.marquesvendaspmg.shop/images/uva-passa-branca-sem-semente-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1643, name: 'UVA PASSA PRETA LERYC 1 KILO', category: 'Doces/Frutas', price: 24.93, image: 'https://www.marquesvendaspmg.shop/images/uva-passa-preta-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1644, name: 'UVA PASSA PRETA SEM SEMENTE BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 24.93, image: 'https://www.marquesvendaspmg.shop/images/uva-passa-preta-sem-semente-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1645, name: 'XERÉM DE CAJU BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 39.55, image: 'https://www.marquesvendaspmg.shop/images/xerem-de-caju-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1646, name: 'XERÉM DE CAJU LERYC 1 KILO', category: 'Doces/Frutas', price: 35.43, image: 'https://www.marquesvendaspmg.shop/images/xerem-de-caju-leryc-1-kilo-pmg-atacadista.jpg' },
  { id: 1647, name: 'AJINOMOTO FOOD SERVICE 10 KILO', category: 'Farináceos', price: 269.47, image: 'https://www.marquesvendaspmg.shop/images/ajinomoto-food-service-10-kilo-pmg-atacadista.jpg' },
  { id: 1648, name: 'AJINOMOTO PEQUENO 2 KILO', category: 'Farináceos', price: 77.01, image: 'https://www.marquesvendaspmg.shop/images/ajinomoto-pequeno-2-kilo-pmg-atacadista.jpg' },
  { id: 1649, name: 'ALHO EM PÓ BRASILSECO 1 KILO', category: 'Farináceos', price: 26.92, image: 'https://www.marquesvendaspmg.shop/images/alho-em-po-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1650, name: 'AMACIANTE DE CARNE TECNUTRI 1,01 KILO', category: 'Farináceos', price: 8.83, image: 'https://www.marquesvendaspmg.shop/images/amaciante-de-carne-tecnutri-101-kilo-pmg-atacadista.jpg' },
  { id: 1651, name: 'AMACIANTE DE CARNES COM TEMPERO KISABOR 1,01 KILO', category: 'Farináceos', price: 9.74, image: 'https://www.marquesvendaspmg.shop/images/amaciante-de-carnes-com-tempero-kisabor-101-kilo-pmg-atacadista.jpg' },
  { id: 1652, name: 'AMACIANTE DE CARNES COM TEMPERO QUALIMAX 1,01 KILO', category: 'Farináceos', price: 22.36, image: 'https://www.marquesvendaspmg.shop/images/amaciante-de-carnes-com-tempero-qualimax-101-kilo-pmg-atacadista.jpg' },
  { id: 1653, name: 'AMIDO DE MILHO MAIZENA 1,8 KILO', category: 'Farináceos', price: 48.25, image: 'https://www.marquesvendaspmg.shop/images/amido-de-milho-maizena-18-kilo-pmg-atacadista.jpg' },
  { id: 1654, name: 'AMIDO DE MILHO PQ 1 KILO', category: 'Farináceos', price: 6.83, image: 'https://www.marquesvendaspmg.shop/images/amido-de-milho-pq-1-kilo-pmg-atacadista.jpg' },
  { id: 1655, name: 'AMIDO DE MILHO TECNUTRI 1 KILO', category: 'Farináceos', price: 7.76, image: 'https://www.marquesvendaspmg.shop/images/amido-de-milho-tecnutri-1-kilo-pmg-atacadista.jpg' },
  { id: 1656, name: 'AMIDO DE MILHO YOKI 1 KILO', category: 'Farináceos', price: 17.65, image: 'https://www.marquesvendaspmg.shop/images/amido-de-milho-yoki-1-kilo-pmg-atacadista.jpg' },
  { id: 1657, name: 'AVEIA EM FLOCOS QUALIMAX 170 G', category: 'Farináceos', price: 3.37, image: 'https://www.marquesvendaspmg.shop/images/aveia-em-flocos-qualimax-170-g-pmg-atacadista.jpg' },
  { id: 1658, name: 'AVEIA EM FLOCOS YOKI 500 G', category: 'Farináceos', price: 10.58, image: 'https://www.marquesvendaspmg.shop/images/aveia-em-flocos-yoki-500-g-pmg-atacadista.jpg' },
  { id: 1659, name: 'BICARBONATO DE SÓDIO BRASILSECO 1 KILO', category: 'Farináceos', price: 16.46, image: 'https://www.marquesvendaspmg.shop/images/bicarbonato-de-sodio-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1660, name: 'BICARBONATO DE SÓDIO DA TERRINHA 500 G', category: 'Farináceos', price: 8.44, image: 'https://www.marquesvendaspmg.shop/images/bicarbonato-de-sodio-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1661, name: 'BICARBONATO DE SÓDIO PENINA 1 KILO', category: 'Farináceos', price: 14.1, image: 'https://www.marquesvendaspmg.shop/images/bicarbonato-de-sodio-penina-1-kilo-pmg-atacadista.jpg' },
  { id: 1662, name: 'CALDO DE BACON PENINA 1,05 KILO', category: 'Farináceos', price: 13.75, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-bacon-penina-105-kilo-pmg-atacadista.jpg' },
  { id: 1663, name: 'CALDO DE CARNE KISABOR 1,01 KILO', category: 'Farináceos', price: 10.03, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-carne-kisabor-101-kilo-pmg-atacadista.jpg' },
  { id: 1664, name: 'CALDO DE CARNE KNORR 1,01 KILO', category: 'Farináceos', price: 20.75, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-carne-knorr-101-kilo-pmg-atacadista.jpg' },
  { id: 1665, name: 'CALDO DE CARNE PENINA 1,05 KILO', category: 'Farináceos', price: 17.12, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-carne-penina-105-kilo-pmg-atacadista.jpg' },
  { id: 1666, name: 'CALDO DE CARNE QUALIMAX 1,01 KILO', category: 'Farináceos', price: 10.21, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-carne-qualimax-101-kilo-pmg-atacadista.jpg' },
  { id: 1667, name: 'CALDO DE CARNE SAZÓN AJINOMOTO 1,1 KILO', category: 'Farináceos', price: 20.07, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-carne-sazon-ajinomoto-11-kilo-pmg-atacadista.jpg' },
  { id: 1668, name: 'CALDO DE CARNE TECNUTRI 1,01 KILO', category: 'Farináceos', price: 9.27, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-carne-tecnutri-101-kilo-pmg-atacadista.jpg' },
  { id: 1669, name: 'CALDO DE GALINHA KISABOR 1,01 KILO', category: 'Farináceos', price: 10.03, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-galinha-kisabor-101-kilo-pmg-atacadista.jpg' },
  { id: 1670, name: 'CALDO DE GALINHA KNORR 1,01 KILO', category: 'Farináceos', price: 20.75, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-galinha-knorr-101-kilo-pmg-atacadista.jpg' },
  { id: 1671, name: 'CALDO DE GALINHA MAGGI 1,01 KILO', category: 'Farináceos', price: 17.54, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-galinha-maggi-101-kilo-pmg-atacadista.jpg' },
  { id: 1672, name: 'CALDO DE GALINHA PENINA 1,05 KILO', category: 'Farináceos', price: 9.19, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-galinha-penina-105-kilo-pmg-atacadista.jpg' },
  { id: 1673, name: 'CALDO DE GALINHA QUALIMAX 1,01 KILO', category: 'Farináceos', price: 17.79, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-galinha-qualimax-101-kilo-pmg-atacadista.jpg' },
  { id: 1674, name: 'CALDO DE GALINHA SAZÓN AJINOMOTO 1,1 KILO', category: 'Farináceos', price: 20.07, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-galinha-sazon-ajinomoto-11-kilo-pmg-atacadista.jpg' },
  { id: 1675, name: 'CALDO DE GALINHA TECNUTRI 1,01 KILO', category: 'Farináceos', price: 9.27, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-galinha-tecnutri-101-kilo-pmg-atacadista.jpg' },
  { id: 1676, name: 'CALDO DE LEGUMES QUALIMAX 1,01 KILO', category: 'Farináceos', price: 17.79, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-legumes-qualimax-101-kilo-pmg-atacadista.jpg' },
  { id: 1677, name: 'CALDO DE LEGUMES SAZÓN AJINOMOTO 1,1 KILO', category: 'Farináceos', price: 20.07, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-legumes-sazon-ajinomoto-11-kilo-pmg-atacadista.jpg' },
  { id: 1678, name: 'CALDO DELICIAS DO MAR KNORR 1,01 KILO', category: 'Farináceos', price: 20.75, image: 'https://www.marquesvendaspmg.shop/images/caldo-delicias-do-mar-knorr-101-kilo-pmg-atacadista.jpg' },
  { id: 1679, name: 'CALDO PARA FRUTOS DO MAR SAZÓN AJINOMOTO 1,1 KILO', category: 'Farináceos', price: 22.48, image: 'https://www.marquesvendaspmg.shop/images/caldo-para-frutos-do-mar-sazon-ajinomoto-11-kilo-pmg-atacadista.jpg' },
  { id: 1680, name: 'CANELA EM PÓ COM AÇÚCAR PENINA 500 G', category: 'Farináceos', price: 20.47, image: 'https://www.marquesvendaspmg.shop/images/canela-em-po-com-acucar-penina-500-g-pmg-atacadista.jpg' },
  { id: 1681, name: 'CANELA EM PÓ JAVA PENINA 500 G', category: 'Farináceos', price: 29.35, image: 'https://www.marquesvendaspmg.shop/images/canela-em-po-java-penina-500-g-pmg-atacadista.jpg' },
  { id: 1682, name: 'CANJICA DE MILHO CRISTAL DA TERRINHA 500 G', category: 'Farináceos', price: 4.58, image: 'https://www.marquesvendaspmg.shop/images/canjica-de-milho-cristal-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1683, name: 'CANJICA DE MILHO CRISTAL YOKI 400 G', category: 'Farináceos', price: 8.72, image: 'https://www.marquesvendaspmg.shop/images/canjica-de-milho-cristal-yoki-400-g-pmg-atacadista.jpg' },
  { id: 1684, name: 'CEBOLA EM PÓ BRASILSECO 1KILO', category: 'Farináceos', price: 40.08, image: 'https://www.marquesvendaspmg.shop/images/cebola-em-po-brasilseco-1kilo-pmg-atacadista.jpg' },
  { id: 1685, name: 'CHIMICHURRI BRASILSECO 1 KILO', category: 'Farináceos', price: 38.65, image: 'https://www.marquesvendaspmg.shop/images/chimichurri-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1686, name: 'CHIMICHURRI OISHII 200 G', category: 'Farináceos', price: 11.31, image: 'https://www.marquesvendaspmg.shop/images/chimichurri-oishii-200-g-pmg-atacadista.jpg' },
  { id: 1687, name: 'CHIMICHURRI PENINA 200 G', category: 'Farináceos', price: 17.07, image: 'https://www.marquesvendaspmg.shop/images/chimichurri-penina-200-g-pmg-atacadista.jpg' },
  { id: 1688, name: 'CHIMICHURRI ZAZO 1 KILO', category: 'Farináceos', price: 38.64, image: 'https://www.marquesvendaspmg.shop/images/chimichurri-zazo-1-kilo-pmg-atacadista.jpg' },
  { id: 1689, name: 'COLORÍFICO BRASILSECO 1 KILO', category: 'Farináceos', price: 12.31, image: 'https://www.marquesvendaspmg.shop/images/colorifico-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1690, name: 'COLORÍFICO KISABOR 1,01 KILO', category: 'Farináceos', price: 9.44, image: 'https://www.marquesvendaspmg.shop/images/colorifico-kisabor-101-kilo-pmg-atacadista.jpg' },
  { id: 1691, name: 'COLORÍFICO KITANO 800 G', category: 'Farináceos', price: 14.11, image: 'https://www.marquesvendaspmg.shop/images/colorifico-kitano-800-g-pmg-atacadista.jpg' },
  { id: 1692, name: 'COLORÍFICO PENINA 1 KILO', category: 'Farináceos', price: 28.78, image: 'https://www.marquesvendaspmg.shop/images/colorifico-penina-1-kilo-pmg-atacadista.jpg' },
  { id: 1693, name: 'COMINHO PENINA 1,05 KILO', category: 'Farináceos', price: 26.56, image: 'https://www.marquesvendaspmg.shop/images/cominho-penina-105-kilo-pmg-atacadista.jpg' },
  { id: 1694, name: 'COUSCOUS GRANORO 1 KILO', category: 'Farináceos', price: 42.56, image: 'https://www.marquesvendaspmg.shop/images/couscous-granoro-1-kilo-pmg-atacadista.jpg' },
  { id: 1695, name: 'PRODUTO EM FALTA', category: 'Farináceos', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1696, name: 'CREME DE CEBOLA FOOD SERVICE AJINOMOTO 1 KILO', category: 'Farináceos', price: 41.36, image: 'https://www.marquesvendaspmg.shop/images/creme-de-cebola-food-service-ajinomoto-1-kilo-pmg-atacadista.jpg' },
  { id: 1697, name: 'CREME DE CEBOLA PENINA 1 KILO', category: 'Farináceos', price: 23.62, image: 'https://www.marquesvendaspmg.shop/images/creme-de-cebola-penina-1-kilo-pmg-atacadista.jpg' },
  { id: 1698, name: 'CREME DE CEBOLA QUALIMAX 1,01 KILO', category: 'Farináceos', price: 41.17, image: 'https://www.marquesvendaspmg.shop/images/creme-de-cebola-qualimax-101-kilo-pmg-atacadista.jpg' },
  { id: 1699, name: 'CÚRCUMA AÇAFRÃO BRASILSECO 1 KILO', category: 'Farináceos', price: 23.62, image: 'https://www.marquesvendaspmg.shop/images/curcuma-acafrao-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1700, name: 'FARINHA DE MANDIOCA CRUA FINA DA TERRINHA 1 KILO', category: 'Farináceos', price: 8.56, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-mandioca-crua-fina-da-terrinha-1-kilo-pmg-atacadista.jpg' },
  { id: 1701, name: 'FARINHA DE MANDIOCA CRUA FINA YOKI 4 KILO', category: 'Farináceos', price: 32.23, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-mandioca-crua-fina-yoki-4-kilo-pmg-atacadista.jpg' },
  { id: 1702, name: 'FARINHA DE MANDIOCA CRUA GROSSA DA TERRINHA 1 KILO', category: 'Farináceos', price: 8.14, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-mandioca-crua-grossa-da-terrinha-1-kilo-pmg-atacadista.jpg' },
  { id: 1703, name: 'FARINHA DE MANDIOCA CRUA GROSSA PQ 3 KILO', category: 'Farináceos', price: 29.26, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-mandioca-crua-grossa-pq-3-kilo-pmg-atacadista.jpg' },
  { id: 1704, name: 'FARINHA DE MANDIOCA CRUA GROSSA YOKI 1 KILO', category: 'Farináceos', price: 15.55, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-mandioca-crua-grossa-yoki-1-kilo-pmg-atacadista.jpg' },
  { id: 1705, name: 'FARINHA DE MANDIOCA FLOCADA BIJU YOKI 500 G', category: 'Farináceos', price: 13.37, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-mandioca-flocada-biju-yoki-500-g-pmg-atacadista.jpg' },
  { id: 1706, name: 'FARINHA DE MANDIOCA TORRADA DA TERRINHA 500 G', category: 'Farináceos', price: 5.04, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-mandioca-torrada-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1707, name: 'FARINHA DE MANDIOCA TORRADA YOKI 4 KILO', category: 'Farináceos', price: 50.32, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-mandioca-torrada-yoki-4-kilo-pmg-atacadista.jpg' },
  { id: 1708, name: 'FARINHA DE MILHO DA TERRINHA 500 G', category: 'Farináceos', price: 6.83, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-milho-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1709, name: 'FARINHA DE MILHO PQ 2 KILO', category: 'Farináceos', price: 16.97, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-milho-pq-2-kilo-pmg-atacadista.jpg' },
  { id: 1710, name: 'FARINHA DE MILHO YOKI 2 KILO', category: 'Farináceos', price: 26.47, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-milho-yoki-2-kilo-pmg-atacadista.jpg' },
  { id: 1711, name: 'FARINHA DE ROSCA DA TERRINHA 500 G', category: 'Farináceos', price: 6.83, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-rosca-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1712, name: 'FARINHA DE ROSCA PQ 5 KILO', category: 'Farináceos', price: 50.38, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-rosca-pq-5-kilo-pmg-atacadista.jpg' },
  { id: 1713, name: 'FARINHA DE ROSCA YOKI 4 KILO', category: 'Farináceos', price: 62.74, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-rosca-yoki-4-kilo-pmg-atacadista.jpg' },
  { id: 1714, name: 'FARINHA DE TRIGO ESPECIAL 101 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 86.87, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-especial-101-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1715, name: 'FARINHA DE TRIGO FLOCADA PANKO KARUI 1 KILO', category: 'Farináceos', price: 11.34, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-flocada-panko-karui-1-kilo-pmg-atacadista.jpg' },
  { id: 1716, name: 'FARINHA DE TRIGO FLOCADA PANKO ORQUIDEA 1 KILO', category: 'Farináceos', price: 12.23, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-flocada-panko-orquidea-1-kilo-pmg-atacadista.jpg' },
  { id: 1717, name: 'FARINHA DE TRIGO FLOCADA PANKO QUALIMAX 1 KILO', category: 'Farináceos', price: 31.06, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-flocada-panko-qualimax-1-kilo-pmg-atacadista.jpg' },
  { id: 1718, name: 'FARINHA DE TRIGO FLOCADA PANKO ZAFRÁN 1,01 KILO', category: 'Farináceos', price: 25.63, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-flocada-panko-zafran-101-kilo-pmg-atacadista.jpg' },
  { id: 1719, name: 'FARINHA DE TRIGO LONGA FERMENTAÇÃO PIZZA ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 118.24, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-longa-fermentacao-pizza-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1720, name: 'FARINHA DE TRIGO LONGA FERMENTAÇÃO PIZZA SUPREMA BUNGE 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 103.76, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-longa-fermentacao-pizza-suprema-bunge-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1721, name: 'FARINHA DE TRIGO PASTEL 101 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 109.53, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-101-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1722, name: 'FARINHA DE TRIGO PASTEL ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 102.56, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1723, name: 'FARINHA DE TRIGO PASTEL BUQUÊ 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 100.14, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-buque-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1724, name: 'FARINHA DE TRIGO PASTEL COAMO 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 92.49, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-coamo-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1725, name: 'FARINHA DE TRIGO PASTEL DONA BENTA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 107.99, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-dona-benta-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1726, name: 'FARINHA DE TRIGO PASTEL MARIA INÊS 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 90.49, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-maria-ines-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1727, name: 'FARINHA DE TRIGO PASTEL MIRELLA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 82.91, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-mirella-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1728, name: 'FARINHA DE TRIGO PASTEL NITA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 105.82, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-nita-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1729, name: 'FARINHA DE TRIGO PASTEL ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 127.65, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-rosa-branca-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1730, name: 'FARINHA DE TRIGO PASTEL SUPREMA BUNGE 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 108.47, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-suprema-bunge-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1731, name: 'FARINHA DE TRIGO PASTEL VENTURELLI 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 103.02, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-venturelli-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1732, name: 'FARINHA DE TRIGO PEQUENA ALMA ITALIANA VENTURELLI 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 89.28, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-alma-italiana-venturelli-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1733, name: 'FARINHA DE TRIGO PEQUENA INTEGRAL ANACONDA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 66.96, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-integral-anaconda-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1734, name: 'FARINHA DE TRIGO PEQUENA INTEGRAL COAMO 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 28.93, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-integral-coamo-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1735, name: 'FARINHA DE TRIGO PEQUENA PREMIUM ANACONDA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 54.29, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-premium-anaconda-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1736, name: 'FARINHA DE TRIGO PEQUENA RESERVA ESPECIAL DONA BENTA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 61.34, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-reserva-especial-dona-benta-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1737, name: 'FARINHA DE TRIGO PEQUENA SEMOLINA TIPO 1 VENTURELLI 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 87.47, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-semolina-tipo-1-venturelli-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1738, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 ANACONDA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 46.54, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-tipo-1-anaconda-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1739, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 BUQUÊ 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 31.37, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-tipo-1-buque-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1740, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 DONA BENTA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 52.36, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-tipo-1-dona-benta-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1741, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 GLOBO 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 33.58, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-tipo-1-globo-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1742, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 NITA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 44.11, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-tipo-1-nita-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1743, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 ROSA BRANCA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 57.19, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-tipo-1-rosa-branca-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1744, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 SOL 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 44.58, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-tipo-1-sol-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1745, name: 'FARINHA DE TRIGO PIZZA 101 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 85.46, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-101-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1746, name: 'FARINHA DE TRIGO PIZZA ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 82.81, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1747, name: 'FARINHA DE TRIGO PIZZA BUQUÊ 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 77.22, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-buque-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1748, name: 'FARINHA DE TRIGO PIZZA DONA BENTA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 96, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-dona-benta-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1749, name: 'FARINHA DE TRIGO PIZZA MARIA INÊS 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 69.98, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-maria-ines-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1750, name: 'FARINHA DE TRIGO PIZZA MIRELLA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 78.43, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-mirella-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1751, name: 'FARINHA DE TRIGO PIZZA NITA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 66.55, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-nita-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1752, name: 'FARINHA DE TRIGO PIZZA ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 102.33, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-rosa-branca-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1753, name: 'FARINHA DE TRIGO PIZZA SUPREMA BUNGE 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 85.67, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-suprema-bunge-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1754, name: 'FARINHA DE TRIGO PIZZA VENTURELLI 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 87.56, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-venturelli-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1755, name: 'FARINHA DE TRIGO PREMIUM 101 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 103.76, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-premium-101-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1756, name: 'FARINHA DE TRIGO PREMIUM ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 127.89, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-premium-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1757, name: 'FARINHA DE TRIGO PREMIUM ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 119.93, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-premium-rosa-branca-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1758, name: 'FARINHA DE TRIGO SALGADOS ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 104.3, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-salgados-rosa-branca-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1759, name: 'FARINHA DE TRIGO SUPER PREMIUM COAMO 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 99.79, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-super-premium-coamo-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1760, name: 'FARINHA DE TRIGO TIPO 1 ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 115.68, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1761, name: 'FARINHA DE TRIGO TIPO 1 BUQUÊ 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 74.81, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-buque-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1762, name: 'FARINHA DE TRIGO TIPO 1 DONA BENTA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 108.63, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-dona-benta-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1763, name: 'FARINHA DE TRIGO TIPO 1 FARINA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 77.22, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-farina-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1764, name: 'FARINHA DE TRIGO TIPO 1 GLOBO 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 81.42, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-globo-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1765, name: 'FARINHA DE TRIGO TIPO 1 NITA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 98.43, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-nita-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1766, name: 'FARINHA DE TRIGO TIPO 1 ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 115.5, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-rosa-branca-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1767, name: 'FARINHA DE TRIGO TIPO 1 SOL 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 103.5, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-sol-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1768, name: 'FARINHA DE TRIGO TIPO 1 VENTURELLI 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 114.16, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-venturelli-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1769, name: 'FAROFA DE MANDIOCA TEMPERADA DA TERRINHA 400 G', category: 'Farináceos', price: 5.94, image: 'https://www.marquesvendaspmg.shop/images/farofa-de-mandioca-temperada-da-terrinha-400-g-pmg-atacadista.jpg' },
  { id: 1770, name: 'FAROFA DE MANDIOCA TEMPERADA KISABOR 400 G', category: 'Farináceos', price: 4.79, image: 'https://www.marquesvendaspmg.shop/images/farofa-de-mandioca-temperada-kisabor-400-g-pmg-atacadista.jpg' },
  { id: 1771, name: 'FAROFA DE MANDIOCA TEMPERADA TRADICIONAL YOKI 400 G', category: 'Farináceos', price: 7.38, image: 'https://www.marquesvendaspmg.shop/images/farofa-de-mandioca-temperada-tradicional-yoki-400-g-pmg-atacadista.jpg' },
  { id: 1772, name: 'FERMENTO BIOLÓGICO FRESCO FLEISCHMANN 500 G', category: 'Farináceos', price: 11.49, image: 'https://www.marquesvendaspmg.shop/images/fermento-biologico-fresco-fleischmann-500-g-pmg-atacadista.jpg' },
  { id: 1773, name: 'FERMENTO BIOLÓGICO FRESCO ITAIQUARA 500 G', category: 'Farináceos', price: 6.94, image: 'https://www.marquesvendaspmg.shop/images/fermento-biologico-fresco-itaiquara-500-g-pmg-atacadista.jpg' },
  { id: 1774, name: 'FERMENTO EM PÓ QUÍMICO TRADICIONAL DONA BENTA 100 G', category: 'Farináceos', price: 3.09, image: 'https://www.marquesvendaspmg.shop/images/fermento-em-po-quimico-tradicional-dona-benta-100-g-pmg-atacadista.jpg' },
  { id: 1775, name: 'FERMENTO EM PÓ QUÍMICO TRADICIONAL ROYAL 100 G', category: 'Farináceos', price: 3.94, image: 'https://www.marquesvendaspmg.shop/images/fermento-em-po-quimico-tradicional-royal-100-g-pmg-atacadista.jpg' },
  { id: 1776, name: 'FERMENTO SECO BIOLÓGICO MASSA SALGADA FLEISCHMANN 500 G', category: 'Farináceos', price: 25.42, image: 'https://www.marquesvendaspmg.shop/images/fermento-seco-biologico-massa-salgada-fleischmann-500-g-pmg-atacadista.jpg' },
  { id: 1777, name: 'FERMENTO SECO BIOLÓGICO MASSA SALGADA ITAIQUARA 500 G', category: 'Farináceos', price: 15.34, image: 'https://www.marquesvendaspmg.shop/images/fermento-seco-biologico-massa-salgada-itaiquara-500-g-pmg-atacadista.jpg' },
  { id: 1778, name: 'FLOCOS DE MILHO CUSCUZ DA TERRINHA 500 G', category: 'Farináceos', price: 3.11, image: 'https://www.marquesvendaspmg.shop/images/flocos-de-milho-cuscuz-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1779, name: 'FOLHA DE LOURO BRASILSECO 250 G', category: 'Farináceos', price: 19.32, image: 'https://www.marquesvendaspmg.shop/images/folha-de-louro-brasilseco-250-g-pmg-atacadista.jpg' },
  { id: 1780, name: 'FUBÁ MIMOSO DA TERRINHA 1 KILO', category: 'Farináceos', price: 5.65, image: 'https://www.marquesvendaspmg.shop/images/fuba-mimoso-da-terrinha-1-kilo-pmg-atacadista.jpg' },
  { id: 1781, name: 'FUBÁ MIMOSO PQ 5 KILO', category: 'Farináceos', price: 24.09, image: 'https://www.marquesvendaspmg.shop/images/fuba-mimoso-pq-5-kilo-pmg-atacadista.jpg' },
  { id: 1782, name: 'FUBÁ MIMOSO YOKI 4 KILO', category: 'Farináceos', price: 25.92, image: 'https://www.marquesvendaspmg.shop/images/fuba-mimoso-yoki-4-kilo-pmg-atacadista.jpg' },
  { id: 1783, name: 'FUBÁ PENINA 500 G', category: 'Farináceos', price: 4.26, image: 'https://www.marquesvendaspmg.shop/images/fuba-penina-500-g-pmg-atacadista.jpg' },
  { id: 1784, name: 'FUMAÇA EM PÓ BRASILSECO 500 G', category: 'Farináceos', price: 21.7, image: 'https://www.marquesvendaspmg.shop/images/fumaca-em-po-brasilseco-500-g-pmg-atacadista.jpg' },
  { id: 1785, name: 'KIMILHO FLOCÃO YOKI 500 G', category: 'Farináceos', price: 5.87, image: 'https://www.marquesvendaspmg.shop/images/kimilho-flocao-yoki-500-g-pmg-atacadista.jpg' },
  { id: 1786, name: 'MACARRÃO AVE MARIA COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Farináceos', price: 71.79, image: 'https://www.marquesvendaspmg.shop/images/macarrao-ave-maria-com-ovos-dona-benta-500-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 1787, name: 'MACARRÃO CARACOLINO COM OVOS RENATA 500 G (FDO 20 PCT)', category: 'Farináceos', price: 92.9, image: 'https://www.marquesvendaspmg.shop/images/macarrao-caracolino-com-ovos-renata-500-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1788, name: 'MACARRÃO ESPAGUETE GRANO DURO PETYBON 500 G (FDO 24 PCT)', category: 'Farináceos', price: 143.30, image: 'https://www.marquesvendaspmg.shop/images/macarrao-espaguete-grano-duro-petybon-500-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 1789, name: 'MACARRÃO ESPAGUETE Nº 8 COM OVOS BARILLA 500 G (FDO 30 PCT)', category: 'Farináceos', price: 155.29, image: 'https://www.marquesvendaspmg.shop/images/macarrao-espaguete-n-8-com-ovos-barilla-500-g-fdo-30-pct-pmg-atacadista.jpg' },
  { id: 1790, name: 'MACARRÃO ESPAGUETE Nº 8 COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Farináceos', price: 77.83, image: 'https://www.marquesvendaspmg.shop/images/macarrao-espaguete-n-8-com-ovos-dona-benta-500-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 1791, name: 'MACARRÃO ESPAGUETE Nº 8 COM OVOS PETYBON 500 G (FDO 24 PCT)', category: 'Farináceos', price: 85.44, image: 'https://www.marquesvendaspmg.shop/images/macarrao-espaguete-n-8-com-ovos-petybon-500-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 1792, name: 'MACARRÃO FETTUCCINE GRANO DURO PETYBON 500 G (FDO 24 PCT)', category: 'Farináceos', price: 143.30, image: 'https://www.marquesvendaspmg.shop/images/macarrao-fettuccine-grano-duro-petybon-500-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 1793, name: 'MACARRÃO FUSILLI GRANO DURO PETYBON 500 G (FDO 18 PCT)', category: 'Farináceos', price: 107.46, image: 'https://www.marquesvendaspmg.shop/images/macarrao-fusilli-grano-duro-petybon-500-g-fdo-18-pct-pmg-atacadista.jpg' },
  { id: 1794, name: 'MACARRÃO PARA YAKISSOBA TAICHI 4.5 KILO', category: 'Farináceos', price: 50.55, image: 'https://www.marquesvendaspmg.shop/images/macarrao-para-yakissoba-taichi-45-kilo-pmg-atacadista.jpg' },
  { id: 1795, name: 'MACARRÃO PARAFUSO COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Farináceos', price: 75.29, image: 'https://www.marquesvendaspmg.shop/images/macarrao-parafuso-com-ovos-dona-benta-500-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 1796, name: 'MACARRÃO PARAFUSO COM OVOS PETYBON 500 G (FDO 18 PCT)', category: 'Farináceos', price: 64.19, image: 'https://www.marquesvendaspmg.shop/images/macarrao-parafuso-com-ovos-petybon-500-g-fdo-18-pct-pmg-atacadista.jpg' },
  { id: 1797, name: 'MACARRÃO PENNE COM OVOS BARILLA 500 G (FDO 20 PCT)', category: 'Farináceos', price: 103.52, image: 'https://www.marquesvendaspmg.shop/images/macarrao-penne-com-ovos-barilla-500-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1798, name: 'MACARRÃO PENNE COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Farináceos', price: 77.83, image: 'https://www.marquesvendaspmg.shop/images/macarrao-penne-com-ovos-dona-benta-500-g-fdo-24-pct-pmg-atacadista.jpg' },
  { id: 1799, name: 'MACARRÃO PENNE COM OVOS PETYBON 500 G (FDO 18 PCT)', category: 'Farináceos', price: 62.12, image: 'https://www.marquesvendaspmg.shop/images/macarrao-penne-com-ovos-petybon-500-g-fdo-18-pct-pmg-atacadista.jpg' },
  { id: 1800, name: 'MACARRÃO PENNE GRANO DURO PETYBON 500 G (FDO 18 PCT)', category: 'Farináceos', price: 107.46, image: 'https://www.marquesvendaspmg.shop/images/macarrao-penne-grano-duro-petybon-500-g-fdo-18-pct-pmg-atacadista.jpg' },
  { id: 1801, name: 'MACARRÃO TALHARIM N° 3 COM OVOS RENATA 500 G (CX 20 PCT)', category: 'Farináceos', price: 143.57, image: 'https://www.marquesvendaspmg.shop/images/macarrao-talharim-n-3-com-ovos-renata-500-g-cx-20-pct-pmg-atacadista.jpg' },
  { id: 1802, name: 'MASSA PARA LASANHA COM OVOS PETYBON 500 G', category: 'Farináceos', price: 151.55, image: 'https://www.marquesvendaspmg.shop/images/massa-para-lasanha-com-ovos-petybon-500-g-pmg-atacadista.jpg' },
  { id: 1803, name: 'MASSA PARA LASANHA COM OVOS RENATA 500 G', category: 'Farináceos', price: 141.17, image: 'https://www.marquesvendaspmg.shop/images/massa-para-lasanha-com-ovos-renata-500-g-pmg-atacadista.jpg' },
  { id: 1804, name: 'MASSA PARA PASTEL E LASANHA QUADRADA CORTADA BRASILEIRINHA 50 UN', category: 'Farináceos', price: 33.8, image: 'https://www.marquesvendaspmg.shop/images/massa-para-pastel-e-lasanha-quadrada-cortada-brasileirinha-50-un-pmg-atacadista.jpg' },
  { id: 1805, name: 'MASSA PARA PASTEL E LASANHA ROLO BRASILEIRINHA 1 KILO', category: 'Farináceos', price: 39.52, image: 'https://www.marquesvendaspmg.shop/images/massa-para-pastel-e-lasanha-rolo-brasileirinha-1-kilo-pmg-atacadista.jpg' },
  { id: 1806, name: 'MASSA PARA PASTEL ROLO MASSA MÁGICA 1 KILO', category: 'Farináceos', price: 9.39, image: 'https://www.marquesvendaspmg.shop/images/massa-para-pastel-rolo-massa-magica-1-kilo-pmg-atacadista.jpg' },
  { id: 1807, name: 'NOZ MOSCADA BOLA BRASILSECO 250 G', category: 'Farináceos', price: 50.57, image: 'https://www.marquesvendaspmg.shop/images/noz-moscada-bola-brasilseco-250-g-pmg-atacadista.jpg' },
  { id: 1808, name: 'NOZ MOSCADA EM PÓ BRASILSECO 250 G', category: 'Farináceos', price: 25.77, image: 'https://www.marquesvendaspmg.shop/images/noz-moscada-em-po-brasilseco-250-g-pmg-atacadista.jpg' },
  { id: 1809, name: 'PÃO DE ALHO CONGELADO BRASA BURGUERS 400 G', category: 'Farináceos', price: 10.66, image: 'https://www.marquesvendaspmg.shop/images/pao-de-alho-congelado-brasa-burguers-400-g-pmg-atacadista.jpg' },
  { id: 1810, name: 'PÃO DE QUEIJO CONGELADO BRASA BURGUERS 70 G 1 KILO', category: 'Farináceos', price: 18.63, image: 'https://www.marquesvendaspmg.shop/images/pao-de-queijo-congelado-brasa-burguers-70-g-1-kilo-pmg-atacadista.jpg' },
  { id: 1811, name: 'PÃO DE QUEIJO CONGELADO NOBRE 15 G 900 G', category: 'Farináceos', price: 13.99, image: 'https://www.marquesvendaspmg.shop/images/pao-de-queijo-congelado-nobre-15-g-900-g-pmg-atacadista.jpg' },
  { id: 1812, name: 'PÃO DE QUEIJO PEQUENO CONGELADO BRASA BURGUERS 15 G 1 KILO', category: 'Farináceos', price: 16.15, image: 'https://www.marquesvendaspmg.shop/images/pao-de-queijo-pequeno-congelado-brasa-burguers-15-g-1-kilo-pmg-atacadista.jpg' },
  { id: 1813, name: 'PÁPRICA DEFUMADA BRASILSECO 1 KILO', category: 'Farináceos', price: 23.62, image: 'https://www.marquesvendaspmg.shop/images/paprica-defumada-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1814, name: 'PÁPRICA DEFUMADA PENINA 500 G', category: 'Farináceos', price: 25.62, image: 'https://www.marquesvendaspmg.shop/images/paprica-defumada-penina-500-g-pmg-atacadista.jpg' },
  { id: 1815, name: 'PÁPRICA DOCE PENINA 500 G', category: 'Farináceos', price: 24.9, image: 'https://www.marquesvendaspmg.shop/images/paprica-doce-penina-500-g-pmg-atacadista.jpg' },
  { id: 1816, name: 'PÁPRICA PICANTE PENINA 500 G', category: 'Farináceos', price: 24.9, image: 'https://www.marquesvendaspmg.shop/images/paprica-picante-penina-500-g-pmg-atacadista.jpg' },
  { id: 1817, name: 'PIMENTA CALABRESA BRASILSECO 500 G', category: 'Farináceos', price: 22.27, image: 'https://www.marquesvendaspmg.shop/images/pimenta-calabresa-brasilseco-500-g-pmg-atacadista.jpg' },
  { id: 1818, name: 'PIMENTA CALABRESA FLOCOS PENINA 500 G', category: 'Farináceos', price: 27.26, image: 'https://www.marquesvendaspmg.shop/images/pimenta-calabresa-flocos-penina-500-g-pmg-atacadista.jpg' },
  { id: 1819, name: 'PIMENTA DO REINO EM GRÃOS BRASILSECO 500 G', category: 'Farináceos', price: 50.1, image: 'https://www.marquesvendaspmg.shop/images/pimenta-do-reino-em-graos-brasilseco-500-g-pmg-atacadista.jpg' },
  { id: 1820, name: 'PIMENTA DO REINO EM PÓ BRASILSECO 1 KILO', category: 'Farináceos', price: 26.63, image: 'https://www.marquesvendaspmg.shop/images/pimenta-do-reino-em-po-brasilseco-1-kilo-pmg-atacadista.jpg' },
  { id: 1821, name: 'POLVILHO AZEDO DA TERRINHA 500 G', category: 'Farináceos', price: 8.97, image: 'https://www.marquesvendaspmg.shop/images/polvilho-azedo-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1822, name: 'POLVILHO AZEDO PQ 500 G', category: 'Farináceos', price: 7.58, image: 'https://www.marquesvendaspmg.shop/images/polvilho-azedo-pq-500-g-pmg-atacadista.jpg' },
  { id: 1823, name: 'POLVILHO DOCE DA TERRINHA 500 G', category: 'Farináceos', price: 5.8, image: 'https://www.marquesvendaspmg.shop/images/polvilho-doce-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1824, name: 'POLVILHO DOCE PQ 500 G', category: 'Farináceos', price: 6, image: 'https://www.marquesvendaspmg.shop/images/polvilho-doce-pq-500-g-pmg-atacadista.jpg' },
  { id: 1825, name: 'REALÇADOR DE SABOR AJINOMOTO AJI-SAL 2 KILO', category: 'Farináceos', price: 24.37, image: 'https://www.marquesvendaspmg.shop/images/realcador-de-sabor-ajinomoto-ajisal-2-kilo-pmg-atacadista.jpg' },
  { id: 1826, name: 'SAGU DE MANDIOCA PQ 500 G', category: 'Farináceos', price: 8.01, image: 'https://www.marquesvendaspmg.shop/images/sagu-de-mandioca-pq-500-g-pmg-atacadista.jpg' },
  { id: 1827, name: 'SAL GROSSO CISNE 1 KILO', category: 'Farináceos', price: 36.08, image: 'https://www.marquesvendaspmg.shop/images/sal-grosso-cisne-1-kilo-pmg-atacadista.jpg' },
  { id: 1828, name: 'SAL GROSSO MASTER 1 KILO', category: 'Farináceos', price: 13.99, image: 'https://www.marquesvendaspmg.shop/images/sal-grosso-master-1-kilo-pmg-atacadista.jpg' },
  { id: 1829, name: 'SAL REFINADO CISNE 1 KILO', category: 'Farináceos', price: 35.14, image: 'https://www.marquesvendaspmg.shop/images/sal-refinado-cisne-1-kilo-pmg-atacadista.jpg' },
  { id: 1830, name: 'SAL REFINADO LEBRE 1 KILO', category: 'Farináceos', price: 23.62, image: 'https://www.marquesvendaspmg.shop/images/sal-refinado-lebre-1-kilo-pmg-atacadista.jpg' },
  { id: 1831, name: 'SAL REFINADO MASTER 1 KILO', category: 'Farináceos', price: 13.99, image: 'https://www.marquesvendaspmg.shop/images/sal-refinado-master-1-kilo-pmg-atacadista.jpg' },
  { id: 1832, name: 'PRODUTO EM FALTA', category: 'Farináceos', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1833, name: 'SAL SACHÊ LEBRE 0,8 G', category: 'Farináceos', price: 14.32, image: 'https://www.marquesvendaspmg.shop/images/sal-sache-lebre-08-g-pmg-atacadista.jpg' },
  { id: 1834, name: 'SAL SACHÊ LEBRE BOM SABOR 0,8 G', category: 'Farináceos', price: 27.31, image: 'https://www.marquesvendaspmg.shop/images/sal-sache-lebre-bom-sabor-08-g-pmg-atacadista.jpg' },
  { id: 1835, name: 'SALSA DESIDRATADA BRASILSECO 250 G', category: 'Farináceos', price: 9.98, image: 'https://www.marquesvendaspmg.shop/images/salsa-desidratada-brasilseco-250-g-pmg-atacadista.jpg' },
  { id: 1836, name: 'TAPIOCA DA TERRINHA 500 G', category: 'Farináceos', price: 6.57, image: 'https://www.marquesvendaspmg.shop/images/tapioca-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1837, name: 'TAPIOCA GRANULADA DA TERRINHA 500 G', category: 'Farináceos', price: 10.97, image: 'https://www.marquesvendaspmg.shop/images/tapioca-granulada-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1838, name: 'TAPIOCA GRANULADA YOKI 500 G', category: 'Farináceos', price: 16.92, image: 'https://www.marquesvendaspmg.shop/images/tapioca-granulada-yoki-500-g-pmg-atacadista.jpg' },
  { id: 1839, name: 'TAPIOCA KISABOR 500 G', category: 'Farináceos', price: 5.25, image: 'https://www.marquesvendaspmg.shop/images/tapioca-kisabor-500-g-pmg-atacadista.jpg' },
  { id: 1840, name: 'TEMPERO ALHO E SAL FOOD SERVICE SABOR AMI AJINOMOTO 5 KILO', category: 'Farináceos', price: 60.91, image: 'https://www.marquesvendaspmg.shop/images/tempero-alho-e-sal-food-service-sabor-ami-ajinomoto-5-kilo-pmg-atacadista.jpg' },
  { id: 1841, name: 'TEMPERO BAIANO PENINA 1,05 KILO', category: 'Farináceos', price: 33.38, image: 'https://www.marquesvendaspmg.shop/images/tempero-baiano-penina-105-kilo-pmg-atacadista.jpg' },
  { id: 1842, name: 'TEMPERO COMPLETO COM PIMENTA FOOD SERVICE SABOR AMI AJINOMOTO 5 KILO', category: 'Farináceos', price: 63.96, image: 'https://www.marquesvendaspmg.shop/images/tempero-completo-com-pimenta-food-service-sabor-ami-ajinomoto-5-kilo-pmg-atacadista.jpg' },
  { id: 1843, name: 'TEMPERO COMPLETO FOOD SERVICE SABOR AMI AJINOMOTO 5 KILO', category: 'Farináceos', price: 63.96, image: 'https://www.marquesvendaspmg.shop/images/tempero-completo-food-service-sabor-ami-ajinomoto-5-kilo-pmg-atacadista.jpg' },
  { id: 1844, name: 'TEMPERO LEMON PEPPER BRASILSECO 500 G', category: 'Farináceos', price: 22.12, image: 'https://www.marquesvendaspmg.shop/images/tempero-lemon-pepper-brasilseco-500-g-pmg-atacadista.jpg' },
  { id: 1845, name: 'TEMPERO LEMON PEPPER PENINA 1,05 KILO', category: 'Farináceos', price: 76.45, image: 'https://www.marquesvendaspmg.shop/images/tempero-lemon-pepper-penina-105-kilo-pmg-atacadista.jpg' },
  { id: 1846, name: 'TEMPERO SAZÓN ALHO AJINOMOTO 900 G', category: 'Farináceos', price: 45.91, image: 'https://www.marquesvendaspmg.shop/images/tempero-sazon-alho-ajinomoto-900-g-pmg-atacadista.jpg' },
  { id: 1847, name: 'TEMPERO SAZÓN AVES VERDE AJINOMOTO 900 G', category: 'Farináceos', price: 40.45, image: 'https://www.marquesvendaspmg.shop/images/tempero-sazon-aves-verde-ajinomoto-900-g-pmg-atacadista.jpg' },
  { id: 1848, name: 'TEMPERO SAZÓN CARNES VERMELHO AJINOMOTO 900 G', category: 'Farináceos', price: 40.45, image: 'https://www.marquesvendaspmg.shop/images/tempero-sazon-carnes-vermelho-ajinomoto-900-g-pmg-atacadista.jpg' },
  { id: 1849, name: 'TEMPERO SAZÓN LEGUMES E ARROZ AMARELO AJINOMOTO 900 G', category: 'Farináceos', price: 45.91, image: 'https://www.marquesvendaspmg.shop/images/tempero-sazon-legumes-e-arroz-amarelo-ajinomoto-900-g-pmg-atacadista.jpg' },
  { id: 1850, name: 'TRIGO KIBE BURGOL 5 KILO', category: 'Farináceos', price: 41.59, image: 'https://www.marquesvendaspmg.shop/images/trigo-kibe-burgol-5-kilo-pmg-atacadista.jpg' },
  { id: 1851, name: 'TRIGO KIBE DA TERRINHA 500 G', category: 'Farináceos', price: 6.44, image: 'https://www.marquesvendaspmg.shop/images/trigo-kibe-da-terrinha-500-g-pmg-atacadista.jpg' },
  { id: 1852, name: 'TRIGO KIBE YOKI 4 KILO', category: 'Farináceos', price: 40.31, image: 'https://www.marquesvendaspmg.shop/images/trigo-kibe-yoki-4-kilo-pmg-atacadista.jpg' },
  { id: 1853, name: 'ÁGUA SANITÁRIA YPÊ 1 L (CX 12 FR)', category: 'Higiene', price: 56.37, image: 'https://www.marquesvendaspmg.shop/images/agua-sanitaria-ype-1-l-cx-12-fr-pmg-atacadista.jpg' },
  { id: 1854, name: 'ÁLCOOL LÍQUIDO TUPI 70° 1 L (CX 12 FR)', category: 'Higiene', price: 107.89, image: 'https://www.marquesvendaspmg.shop/images/alcool-liquido-tupi-70-1-l-cx-12-fr-pmg-atacadista.jpg' },
  { id: 1855, name: 'DESINFETANTE EUCALIPTO BAK YPÊ 2 L (CX 6 GL)', category: 'Higiene', price: 73.99, image: 'https://www.marquesvendaspmg.shop/images/desinfetante-eucalipto-bak-ype-2-l-cx-6-gl-pmg-atacadista.jpg' },
  { id: 1856, name: 'DESINFETANTE LAVANDA BAK YPÊ 2 L (CX 6 GL)', category: 'Higiene', price: 73.99, image: 'https://www.marquesvendaspmg.shop/images/desinfetante-lavanda-bak-ype-2-l-cx-6-gl-pmg-atacadista.jpg' },
  { id: 1857, name: 'DETERGENTE CLEAR YPÊ 500 ML (CX 24 FR)', category: 'Higiene', price: 81.99, image: 'https://www.marquesvendaspmg.shop/images/detergente-clear-ype-500-ml-cx-24-fr-pmg-atacadista.jpg' },
  { id: 1858, name: 'DETERGENTE NEUTRO YPÊ 500 ML (CX 24 FR)', category: 'Higiene', price: 81.99, image: 'https://www.marquesvendaspmg.shop/images/detergente-neutro-ype-500-ml-cx-24-fr-pmg-atacadista.jpg' },
  { id: 1859, name: 'ESPONJA 3M SCOTCH BRITE / TININDO', category: 'Higiene', price: 19.41, image: 'https://www.marquesvendaspmg.shop/images/esponja-3m-scotch-brite-tinindo-pmg-atacadista.jpg' },
  { id: 1860, name: 'ESPONJA DE LÃ DE AÇO ASSOLAN YPÊ (FDO 20 PCT)', category: 'Higiene', price: 55.72, image: 'https://www.marquesvendaspmg.shop/images/esponja-de-la-de-aco-assolan-ype-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1861, name: 'MULTIUSO CLÁSSICO YPÊ 500 ML (CX 12 FR)', category: 'Higiene', price: 69.2, image: 'https://www.marquesvendaspmg.shop/images/multiuso-classico-ype-500-ml-cx-12-fr-pmg-atacadista.jpg' },
  { id: 1862, name: 'PAPEL HIGIÊNICO FOLHA SIMPLES DAMA 8 ROLOS', category: 'Higiene', price: 11.12, image: 'https://www.marquesvendaspmg.shop/images/papel-higienico-folha-simples-dama-8-rolos-pmg-atacadista.jpg' },
  { id: 1863, name: 'PAPEL TOALHA LUAR 2 ROLOS', category: 'Higiene', price: 5.61, image: 'https://www.marquesvendaspmg.shop/images/papel-toalha-luar-2-rolos-pmg-atacadista.jpg' },
  { id: 1864, name: 'SABÃO EM BARRA NEUTRO YPÊ 5 UN 180 G', category: 'Higiene', price: 17.55, image: 'https://www.marquesvendaspmg.shop/images/sabao-em-barra-neutro-ype-5-un-180-g-pmg-atacadista.jpg' },
  { id: 1865, name: 'SABÃO EM PÓ PRIMAVERA TIXAN YPÊ 800 G', category: 'Higiene', price: 16.91, image: 'https://www.marquesvendaspmg.shop/images/sabao-em-po-primavera-tixan-ype-800-g-pmg-atacadista.jpg' },
  { id: 1866, name: 'SACO DE PANO 34 X 52 CM', category: 'Higiene', price: 18.96, image: 'https://www.marquesvendaspmg.shop/images/saco-de-pano-34-x-52-cm-pmg-atacadista.jpg' },
  { id: 1867, name: 'SACO PARA LIXO PRETO 90 X 90 CM 100 L (FDO 100 UN)', category: 'Higiene', price: 68.22, image: 'https://www.marquesvendaspmg.shop/images/saco-para-lixo-preto-90-x-90-cm-100-l-fdo-100-un-pmg-atacadista.jpg' },
  { id: 1868, name: 'ALGAS MARINHAS YAKI SUSHI NORI BLACK TAICHI 140 G', category: 'Orientais', price: 51.77, image: 'https://www.marquesvendaspmg.shop/images/algas-marinhas-yaki-sushi-nori-black-taichi-140-g-pmg-atacadista.jpg' },
  { id: 1869, name: 'ALGAS MARINHAS YAKI SUSHI NORI GREEN TAICHI 140 G', category: 'Orientais', price: 39.62, image: 'https://www.marquesvendaspmg.shop/images/algas-marinhas-yaki-sushi-nori-green-taichi-140-g-pmg-atacadista.jpg' },
  { id: 1870, name: 'ARROZ JAPONÊS GUIN GRÃO CURTO CAMIL 5 KILO', category: 'Orientais', price: 76.32, image: 'https://www.marquesvendaspmg.shop/images/arroz-japones-guin-grao-curto-camil-5-kilo-pmg-atacadista.jpg' },
  { id: 1871, name: 'ARROZ JAPONÊS TIPO 1 CLASSE LONGO INARÍ SOLITO 5 KILO', category: 'Orientais', price: 64.33, image: 'https://www.marquesvendaspmg.shop/images/arroz-japones-tipo-1-classe-longo-inari-solito-5-kilo-pmg-atacadista.jpg' },
  { id: 1872, name: 'GENGIBRE EM CONSERVA TRADICIONAL TAICHI 1,01 KILO', category: 'Orientais', price: 15.21, image: 'https://www.marquesvendaspmg.shop/images/gengibre-em-conserva-tradicional-taichi-101-kilo-pmg-atacadista.jpg' },
  { id: 1873, name: 'HASHI DE BAMBU TAICHI (CX 3000 UN)', category: 'Orientais', price: 268.41, image: 'https://www.marquesvendaspmg.shop/images/hashi-de-bambu-taichi-cx-3000-un-pmg-atacadista.jpg' },
  { id: 1874, name: 'KANI KAMA CONGELADO OCEANI 200 G', category: 'Orientais', price: 6.91, image: 'https://www.marquesvendaspmg.shop/images/kani-kama-congelado-oceani-200-g-pmg-atacadista.jpg' },
  { id: 1875, name: 'LICHIA EM CALDA TAICHI 567 G', category: 'Orientais', price: 22.93, image: 'https://www.marquesvendaspmg.shop/images/lichia-em-calda-taichi-567-g-pmg-atacadista.jpg' },
  { id: 1876, name: 'MOLHO DE PIMENTA THAI SWEET CHILLI SAUCE TAICHI 1,01 L', category: 'Orientais', price: 22.81, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-thai-sweet-chilli-sauce-taichi-101-l-pmg-atacadista.jpg' },
  { id: 1877, name: 'MOLHO DE PIMENTA THAI SWEET CHILLI ZAFRÁN 1,05 KILO', category: 'Orientais', price: 28.89, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-thai-sweet-chilli-zafran-105-kilo-pmg-atacadista.jpg' },
  { id: 1878, name: 'MOLHO SHOYU PREMIUM SACHÊ MITSUWA 8 ML (CX 250 UN)', category: 'Orientais', price: 36.91, image: 'https://www.marquesvendaspmg.shop/images/molho-shoyu-premium-sache-mitsuwa-8-ml-cx-250-un-pmg-atacadista.jpg' },
  { id: 1879, name: 'MOLHO TARÊ KARUI 5 L', category: 'Orientais', price: 47.29, image: 'https://www.marquesvendaspmg.shop/images/molho-tare-karui-5-l-pmg-atacadista.jpg' },
  { id: 1880, name: 'MOLHO TARÊ MITSUWA 5 L', category: 'Orientais', price: 69.39, image: 'https://www.marquesvendaspmg.shop/images/molho-tare-mitsuwa-5-l-pmg-atacadista.jpg' },
  { id: 1881, name: 'MOLHO TARÊ SACHÊ MITSUWA 8 ML (CX 252 UN)', category: 'Orientais', price: 39.23, image: 'https://www.marquesvendaspmg.shop/images/molho-tare-sache-mitsuwa-8-ml-cx-252-un-pmg-atacadista.jpg' },
  { id: 1882, name: 'ÓLEO DE GERGELIM TORRADO COMPOSTO TAICHI 900 ML', category: 'Orientais', price: 27.99, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-gergelim-torrado-composto-taichi-900-ml-pmg-atacadista.jpg' },
  { id: 1883, name: 'TEMPERO HONDASHI FOOD SERVICE AJINOMOTO 500 G', category: 'Orientais', price: 47.56, image: 'https://www.marquesvendaspmg.shop/images/tempero-hondashi-food-service-ajinomoto-500-g-pmg-atacadista.jpg' },
  { id: 1884, name: 'TEMPERO REALÇADOR DE SABOR GLUTAMATO MONOSSÓDICO TAICHI 1,01 KILO', category: 'Orientais', price: 21.89, image: 'https://www.marquesvendaspmg.shop/images/tempero-realcador-de-sabor-glutamato-monossodico-taichi-101-kilo-pmg-atacadista.jpg' },
  { id: 1885, name: 'WASABI EM PÓ PLUS TAICHI 1,01 KILO', category: 'Orientais', price: 48.31, image: 'https://www.marquesvendaspmg.shop/images/wasabi-em-po-plus-taichi-101-kilo-pmg-atacadista.jpg' },
  { id: 1886, name: 'DESMOLDANTE SPRAY AEROSOL UNTA FÁCIL 400 ML', category: 'Panificação', price: 39.81, image: 'https://www.marquesvendaspmg.shop/images/desmoldante-spray-aerosol-unta-facil-400-ml-pmg-atacadista.jpg' },
  { id: 1887, name: 'MELHORADOR DE FARINHA EM PÓ FLEISCHMANN 300 G', category: 'Panificação', price: 9.18, image: 'https://www.marquesvendaspmg.shop/images/melhorador-de-farinha-em-po-fleischmann-300-g-pmg-atacadista.jpg' },
  { id: 1888, name: 'MISTURA PARA BOLO BAUNILHA DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://www.marquesvendaspmg.shop/images/mistura-para-bolo-baunilha-dona-benta-450-g-pmg-atacadista.jpg' },
  { id: 1889, name: 'MISTURA PARA BOLO CENOURA DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://www.marquesvendaspmg.shop/images/mistura-para-bolo-cenoura-dona-benta-450-g-pmg-atacadista.jpg' },
  { id: 1890, name: 'MISTURA PARA BOLO CHOCOLATE DONA BENTA 450 G', category: 'Panificação', price: 7.62, image: 'https://www.marquesvendaspmg.shop/images/mistura-para-bolo-chocolate-dona-benta-450-g-pmg-atacadista.jpg' },
  { id: 1891, name: 'MISTURA PARA BOLO COCO DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://www.marquesvendaspmg.shop/images/mistura-para-bolo-coco-dona-benta-450-g-pmg-atacadista.jpg' },
  { id: 1892, name: 'MISTURA PARA BOLO FUBÁ DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://www.marquesvendaspmg.shop/images/mistura-para-bolo-fuba-dona-benta-450-g-pmg-atacadista.jpg' },
  { id: 1893, name: 'MISTURA PARA BOLO LARANJA DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://www.marquesvendaspmg.shop/images/mistura-para-bolo-laranja-dona-benta-450-g-pmg-atacadista.jpg' },
  { id: 1894, name: 'MISTURA PARA BOLO MILHO DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://www.marquesvendaspmg.shop/images/mistura-para-bolo-milho-dona-benta-450-g-pmg-atacadista.jpg' },
  { id: 1895, name: 'CHEESE PILLOWS CONGELADO EMPANADO MCCAIN 1 KILO (CX 6 PCT)', category: 'Salgados', price: 441.73, image: 'https://www.marquesvendaspmg.shop/images/cheese-pillows-congelado-empanado-mccain-1-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1896, name: 'DADINHO DE TAPIOCA COM QUEIJO DE COALHO CONGELADO PIF PAF 300 G', category: 'Salgados', price: 10.74, image: 'https://www.marquesvendaspmg.shop/images/dadinho-de-tapioca-com-queijo-de-coalho-congelado-pif-paf-300-g-pmg-atacadista.jpg' },
  { id: 1897, name: 'PRODUTO EM FALTA', category: 'Salgados', price: 0, image: 'https://www.marquesvendaspmg.shop/images/produto-em-falta-pmg-atacadista.jpg' },
  { id: 1898, name: 'WAFFLE CONGELADO FORNO DE MINAS 525 G (CX 3,15 KILO)', category: 'Salgados', price: 135.21, image: 'https://www.marquesvendaspmg.shop/images/waffle-congelado-forno-de-minas-525-g-cx-315-kilo-pmg-atacadista.jpg' },
  { id: 1899, name: 'CHÁ DE CAMOMILA CANELA E MAÇÃ TWININGS 15 G (CX 12 UN)', category: 'Bebidas', price: 138.64, image: 'https://www.marquesvendaspmg.shop/images/cha-de-camomila-canela-e-maca-twinings-15-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 1900, name: 'CHÁ DE HORTELÃ TWININGS 17,5 G (CX 12 UN)', category: 'Bebidas', price: 196.82, image: 'https://www.marquesvendaspmg.shop/images/cha-de-hortela-twinings-175-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 1901, name: 'CHÁ DE LIMÃO E FRAMBOESA TWININGS 15 G (CX 12 UN)', category: 'Bebidas', price: 173.25, image: 'https://www.marquesvendaspmg.shop/images/cha-de-limao-e-framboesa-twinings-15-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 1902, name: 'CHÁ MATTE LEÃO SOLÚVEL COM LIMÃO 1 KG (CX 10 UN)', category: 'Bebidas', price: 31.4, image: 'https://www.marquesvendaspmg.shop/images/cha-matte-leao-soluvel-com-limao-1-kg-cx-10-un-pmg-atacadista.jpg' },
  { id: 1903, name: 'XAROPE MONIN KIWI 700 ML (CX 6 UN)', category: 'Bebidas', price: 59.94, image: 'https://www.marquesvendaspmg.shop/images/xarope-monin-kiwi-700-ml-cx-6-un-pmg-atacadista.jpg' },
  { id: 1904, name: 'ERVILHA GRANDE DA TERRINHA 500 G (FDO 12 PCT)', category: 'Conservas/Enlatados', price: 8.37, image: 'https://www.marquesvendaspmg.shop/images/ervilha-grande-da-terrinha-500-g-fdo-12-pct-pmg-atacadista.jpg' },
  { id: 1905, name: 'MOLHO AMERICANO SACHÊ ZAFRÁN 30 G (CX 96 UN)', category: 'Conservas/Enlatados', price: 32.57, image: 'https://www.marquesvendaspmg.shop/images/molho-americano-sache-zafran-30-g-cx-96-un-pmg-atacadista.jpg' },
  { id: 1906, name: 'MOLHO BARBECUE PREDILECTA 3,5 KG (CX 4 GL)', category: 'Conservas/Enlatados', price: 38.28, image: 'https://www.marquesvendaspmg.shop/images/molho-barbecue-predilecta-35-kg-cx-4-gl-pmg-atacadista.jpg' },
  { id: 1907, name: 'PASSATA DI POMODORO LA PASTINA 680 G (CX 12 VD)', category: 'Conservas/Enlatados', price: 20.94, image: 'https://www.marquesvendaspmg.shop/images/passata-di-pomodoro-la-pastina-680-g-cx-12-vd-pmg-atacadista.jpg' },
  { id: 1908, name: 'PASSATA KNORR 1,5 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 18.41, image: 'https://www.marquesvendaspmg.shop/images/passata-knorr-15-kg-cx-6-bag-pmg-atacadista.jpg' },
  { id: 1909, name: 'COXINHAS DAS ASAS DE FRANGO APIMENTADAS EMPANADAS CONGELADAS SEARA 400 G (CX 12 PCT)', category: 'Derivados de Ave', price: 168.7, image: 'https://www.marquesvendaspmg.shop/images/coxinhas-das-asas-de-frango-apimentadas-empanadas-congeladas-seara-400-g-cx-12-pct-pmg-atacadista.jpg' },
  { id: 1910, name: 'ISCAS DE FRANGO EMPANADAS CONGELADAS SEARA 900 G (CX 5 PCT)', category: 'Derivados de Ave', price: 126.42, image: 'https://www.marquesvendaspmg.shop/images/iscas-de-frango-empanadas-congeladas-seara-900-g-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1912, name: 'STEAK DE FRANGO EMPANADO CONGELADO PERDIGÃO 100 G (CX 45 UN)', category: 'Derivados de Ave', price: 89.46, image: 'https://www.marquesvendaspmg.shop/images/steak-de-frango-empanado-congelado-perdigao-100-g-cx-45-un-pmg-atacadista.jpg' },
  { id: 1913, name: 'ACÉM BOVINO RESFRIADO MATOSO 14 KG (CX 28 KG)', category: 'Derivados de Bovino', price: 36.55, image: 'https://www.marquesvendaspmg.shop/images/acem-bovino-resfriado-matoso-14-kg-cx-28-kg-pmg-atacadista.jpg' },
  { id: 1914, name: 'CAPA DE FILÉ BOVINA RESFRIADA MATOSO 1,3 KG (CX 23 KG)', category: 'Derivados de Bovino', price: 29.08, image: 'https://www.marquesvendaspmg.shop/images/capa-de-file-bovina-resfriada-matoso-13-kg-cx-23-kg-pmg-atacadista.jpg' },
  { id: 1915, name: 'CORDÃO DO FILÉ MIGNON BOVINO RESFRIADO FRIGOESTRELA 1,5 KG (CX 18 KG)', category: 'Derivados de Bovino', price: 32.1, image: 'https://www.marquesvendaspmg.shop/images/cordao-do-file-mignon-bovino-resfriado-frigoestrela-15-kg-cx-18-kg-pmg-atacadista.jpg' },
  { id: 1916, name: 'LAGARTO BOVINO RESFRIADO FRIGOESTRELA 3 KG (CX 26 KG)', category: 'Derivados de Bovino', price: 32.69, image: 'https://www.marquesvendaspmg.shop/images/lagarto-bovino-resfriado-frigoestrela-3-kg-cx-26-kg-pmg-atacadista.jpg' },
  { id: 1917, name: 'COMPOSTO LÁCTEO EM PÓ INTEGRAL ALIBRALAC 1 KG (FDO 10 PCT)', category: 'Derivados de Leite', price: 7.39, image: 'https://www.marquesvendaspmg.shop/images/composto-lacteo-em-po-integral-alibralac-1-kg-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1918, name: 'CREAM CHEESE QUATÁ 1,01 KG (CX 10 BIS)', category: 'Derivados de Leite', price: 28.96, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-quata-101-kg-cx-10-bis-pmg-atacadista.jpg' },
  { id: 1919, name: 'CREME DE RICOTA LIGHT EM CALORIAS TIROLEZ 200 G (CX 16 UN)', category: 'Derivados de Leite', price: 6.69, image: 'https://www.marquesvendaspmg.shop/images/creme-de-ricota-light-em-calorias-tirolez-200-g-cx-16-un-pmg-atacadista.jpg' },
  { id: 1920, name: 'FONDUE DE QUEIJO EMMENTAL TIROLEZ 400 G (CX 12 UN)', category: 'Derivados de Leite', price: 10.21, image: 'https://www.marquesvendaspmg.shop/images/fondue-de-queijo-emmental-tirolez-400-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 1921, name: 'LEITE DESNATADO TRIANGULO MINEIRO 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 60.45, image: 'https://www.marquesvendaspmg.shop/images/leite-desnatado-triangulo-mineiro-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 1922, name: 'MOLHO CHEDDAR CORONATA 1,02 KG (CX 15 BIS)', category: 'Derivados de Leite', price: 29.39, image: 'https://www.marquesvendaspmg.shop/images/molho-cheddar-coronata-102-kg-cx-15-bis-pmg-atacadista.jpg' },
  { id: 1923, name: 'MOLHO CHEDDAR DEFUMADO POLENGHI 1,01 KG (CX 6 BIS)', category: 'Derivados de Leite', price: 32.35, image: 'https://www.marquesvendaspmg.shop/images/molho-cheddar-defumado-polenghi-101-kg-cx-6-bis-pmg-atacadista.jpg' },
  { id: 1924, name: 'MOLHO CHEDDAR SCHREIBER 1,5 KG (CX 6 BIS)', category: 'Derivados de Leite', price: 37.09, image: 'https://www.marquesvendaspmg.shop/images/molho-cheddar-schreiber-15-kg-cx-6-bis-pmg-atacadista.jpg' },
  { id: 1925, name: 'MUÇARELA CAMILLA 4 KG (CX 6 PÇ)', category: 'Derivados de Leite', price: 24.69, image: 'https://www.marquesvendaspmg.shop/images/mucarela-camilla-4-kg-cx-6-pc-pmg-atacadista.jpg' },
  { id: 1926, name: 'MUÇARELA COBERTURA MOZZANA PIZZA 2 KG (CX 9 PÇ)', category: 'Derivados de Leite', price: 44.64, image: 'https://www.marquesvendaspmg.shop/images/mucarela-cobertura-mozzana-pizza-2-kg-cx-9-pc-pmg-atacadista.jpg' },
  { id: 1927, name: 'MUÇARELA DE BÚFALA QUALIMUUM 4 KG (CX 6 PÇ)', category: 'Derivados de Leite', price: 37.41, image: 'https://www.marquesvendaspmg.shop/images/mucarela-de-bufala-qualimuum-4-kg-cx-6-pc-pmg-atacadista.jpg' },
  { id: 1928, name: 'MUÇARELA DEALE 4 KG (CX 6 PÇ)', category: 'Derivados de Leite', price: 29.4, image: 'https://www.marquesvendaspmg.shop/images/mucarela-deale-4-kg-cx-6-pc-pmg-atacadista.jpg' },
  { id: 1929, name: 'MUÇARELA FATIADA PEQUENA TIROLEZ 150 G (CX 28 PCT)', category: 'Derivados de Leite', price: 7.71, image: 'https://www.marquesvendaspmg.shop/images/mucarela-fatiada-pequena-tirolez-150-g-cx-28-pct-pmg-atacadista.jpg' },
  { id: 1930, name: 'MUÇARELA IMPERADOR 4 KG (CX 6 PÇ)', category: 'Derivados de Leite', price: 25.87, image: 'https://www.marquesvendaspmg.shop/images/mucarela-imperador-4-kg-cx-6-pc-pmg-atacadista.jpg' },
  { id: 1931, name: 'MUÇARELA INLARON 4 KG (CX 6 PÇ)', category: 'Derivados de Leite', price: 34.68, image: 'https://www.marquesvendaspmg.shop/images/mucarela-inlaron-4-kg-cx-6-pc-pmg-atacadista.jpg' },
  { id: 1932, name: 'MUÇARELA SUPREMA "3,5" KG (CX "8" PÇ)', category: 'Derivados de Leite', price: 28.01, image: 'https://www.marquesvendaspmg.shop/images/mucarela-suprema-35-kg-cx-8-pc-pmg-atacadista.jpg' },
  { id: 1933, name: 'PARMESÃO 6 MESES BURITIS 5,5 KG (CX 4 PÇ)', category: 'Derivados de Leite', price: 74.13, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-buritis-55-kg-cx-4-pc-pmg-atacadista.jpg' },
  { id: 1934, name: 'PARMESÃO TROPICAL CRISTAL 5 KG (CX 4 PÇ)', category: 'Derivados de Leite', price: 37.71, image: 'https://www.marquesvendaspmg.shop/images/parmesao-tropical-cristal-5-kg-cx-4-pc-pmg-atacadista.jpg' },
  { id: 1935, name: 'PROVOLONE APOLO 5 KG (CX 3 PÇ)', category: 'Derivados de Leite', price: 36.43, image: 'https://www.marquesvendaspmg.shop/images/provolone-apolo-5-kg-cx-3-pc-pmg-atacadista.jpg' },
  { id: 1936, name: 'PROVOLONETE BURITIS 175 G (CX 45 UN)', category: 'Derivados de Leite', price: 12.66, image: 'https://www.marquesvendaspmg.shop/images/provolonete-buritis-175-g-cx-45-un-pmg-atacadista.jpg' },
  { id: 1937, name: 'QUEIJO COALHO BARRA BANDEIRA 2,5 KG (CX 5 UN)', category: 'Derivados de Leite', price: 39.26, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-barra-bandeira-25-kg-cx-5-un-pmg-atacadista.jpg' },
  { id: 1938, name: 'QUEIJO FRESCAL VALEZA 500 G (CX 36 PÇ)', category: 'Derivados de Leite', price: 26.21, image: 'https://www.marquesvendaspmg.shop/images/queijo-frescal-valeza-500-g-cx-36-pc-pmg-atacadista.jpg' },
  { id: 1939, name: 'QUEIJO MINAS FRESCAL YEMA 450 G (CX 8 PÇ)', category: 'Derivados de Leite', price: 39.62, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-frescal-yema-450-g-cx-8-pc-pmg-atacadista.jpg' },
  { id: 1940, name: 'QUEIJO PRATO FATIADO TIROLEZ 150 G (CX 28 PCT)', category: 'Derivados de Leite', price: 7.71, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-fatiado-tirolez-150-g-cx-28-pct-pmg-atacadista.jpg' },
  { id: 1941, name: 'REQUEIJÃO CONFEIPOP HARALD COM AMIDO 1,010 KG (CX 8 BIS)', category: 'Derivados de Leite', price: 8.67, image: 'https://www.marquesvendaspmg.shop/images/requeijao-confeipop-harald-com-amido-1010-kg-cx-8-bis-pmg-atacadista.jpg' },
  { id: 1942, name: 'REQUEIJÃO COPO DALLORA SABOR CHEDDAR 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 104.8, image: 'https://www.marquesvendaspmg.shop/images/requeijao-copo-dallora-sabor-cheddar-200-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 1943, name: 'REQUEIJÃO COPO LIGHT EM CALORIAS DALLORA 200 G (CX 12 UN)', category: 'Derivados de Leite', price: 101.12, image: 'https://www.marquesvendaspmg.shop/images/requeijao-copo-light-em-calorias-dallora-200-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 1944, name: 'REQUEIJÃO DALLORA FORNO E FOGÃO COM AMIDO 1,5 KG (CX 8 BIS)', category: 'Derivados de Leite', price: 16.35, image: 'https://www.marquesvendaspmg.shop/images/requeijao-dallora-forno-e-fogao-com-amido-15-kg-cx-8-bis-pmg-atacadista.jpg' },
  { id: 1945, name: 'APRESUNTADO FRIMESA 3,7 KG (CX 4 PÇ)', category: 'Derivados de Suíno', price: 58.72, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-frimesa-37-kg-cx-4-pc-pmg-atacadista.jpg' },
  { id: 1946, name: 'BACON EM CUBOS BARRIGA E PALETA REZENDE 700 G (CX 12 PCT)', category: 'Derivados de Suíno', price: 22.58, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-barriga-e-paleta-rezende-700-g-cx-12-pct-pmg-atacadista.jpg' },
  { id: 1947, name: 'BACON EM CUBOS BARRIGA FRIMESA 1 KG (CX 10 PCT)', category: 'Derivados de Suíno', price: 38.23, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-barriga-frimesa-1-kg-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1948, name: 'BACON EM CUBOS PALETA E PAPADA MISTER BEEF 1 KG (CX 18 PCT)', category: 'Derivados de Suíno', price: 36.45, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-paleta-e-papada-mister-beef-1-kg-cx-18-pct-pmg-atacadista.jpg' },
  { id: 1949, name: 'BANHA FRIMESA 1 KG (CX 18 PCT)', category: 'Derivados de Suíno', price: 13.22, image: 'https://www.marquesvendaspmg.shop/images/banha-frimesa-1-kg-cx-18-pct-pmg-atacadista.jpg' },
  { id: 1950, name: 'BANHA NOBRE 1 KG (CX 15 PCT)', category: 'Derivados de Suíno', price: 17.2, image: 'https://www.marquesvendaspmg.shop/images/banha-nobre-1-kg-cx-15-pct-pmg-atacadista.jpg' },
  { id: 1951, name: 'CALABRESA RETA MISTER BEEF 2,5 KG (CX 5 PCT)', category: 'Derivados de Suíno', price: 57.3, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-mister-beef-25-kg-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1952, name: 'CARRÉ SUÍNO CONGELADO COM OSSO PAMPLONA 5 KG (CX 20 KG)', category: 'Derivados de Suíno', price: 17.15, image: 'https://www.marquesvendaspmg.shop/images/carre-suino-congelado-com-osso-pamplona-5-kg-cx-20-kg-pmg-atacadista.jpg' },
  { id: 1953, name: 'COPA AURORA 600 G (CX 5 KG)', category: 'Derivados de Suíno', price: 97.16, image: 'https://www.marquesvendaspmg.shop/images/copa-aurora-600-g-cx-5-kg-pmg-atacadista.jpg' },
  { id: 1954, name: 'COPA LOMBO SOBREPALETA SUÍNA SEM OSSO CONGELADA FRIELLA 3 KG (CX 22 KG)', category: 'Derivados de Suíno', price: 22.87, image: 'https://www.marquesvendaspmg.shop/images/copa-lombo-sobrepaleta-suina-sem-osso-congelada-friella-3-kg-cx-22-kg-pmg-atacadista.jpg' },
  { id: 1955, name: 'COSTELINHA SUÍNA CONGELADA EM TIRAS COM OSSO FRIELLA 1 KG (CX 20 KG)', category: 'Derivados de Suíno', price: 21.73, image: 'https://www.marquesvendaspmg.shop/images/costelinha-suina-congelada-em-tiras-com-osso-friella-1-kg-cx-20-kg-pmg-atacadista.jpg' },
  { id: 1956, name: 'LOMBO SUÍNO SEM OSSO CONGELADO PAMPLONA 5 KG (CX 25 KG)', category: 'Derivados de Suíno', price: 23.26, image: 'https://www.marquesvendaspmg.shop/images/lombo-suino-sem-osso-congelado-pamplona-5-kg-cx-25-kg-pmg-atacadista.jpg' },
  { id: 1957, name: 'MORTADELA DEFUMADA SEARA GOURMET 5 KG (CX 2 PÇ)', category: 'Derivados de Suíno', price: 14.6, image: 'https://www.marquesvendaspmg.shop/images/mortadela-defumada-seara-gourmet-5-kg-cx-2-pc-pmg-atacadista.jpg' },
  { id: 1958, name: 'MORTADELA ITALIANA 471 SP SEARA GOURMET 4,8 KG (CX 2 PÇ)', category: 'Derivados de Suíno', price: 27.44, image: 'https://www.marquesvendaspmg.shop/images/mortadela-italiana-471-sp-seara-gourmet-48-kg-cx-2-pc-pmg-atacadista.jpg' },
  { id: 1959, name: 'PAIO SUÍNO PERDIGÃO 2,5 KG (CX 4 PCT)', category: 'Derivados de Suíno', price: 84.8, image: 'https://www.marquesvendaspmg.shop/images/paio-suino-perdigao-25-kg-cx-4-pct-pmg-atacadista.jpg' },
  { id: 1960, name: 'PEPPERONI FATIADO SABOR DE BRAGANÇA 1 KG (CX 3 PCT)', category: 'Derivados de Suíno', price: 58.18, image: 'https://www.marquesvendaspmg.shop/images/pepperoni-fatiado-sabor-de-braganca-1-kg-cx-3-pct-pmg-atacadista.jpg' },
  { id: 1961, name: 'PRESUNTO FATIADO SEARA 180 G (CX 22 PCT)', category: 'Derivados de Suíno', price: 8.07, image: 'https://www.marquesvendaspmg.shop/images/presunto-fatiado-seara-180-g-cx-22-pct-pmg-atacadista.jpg' },
  { id: 1962, name: 'TOUCINHO LOMBAR SUÍNO COM PELE CONGELADO ESTRELA 5 KG (CX 18 KG)', category: 'Derivados de Suíno', price: 20.34, image: 'https://www.marquesvendaspmg.shop/images/toucinho-lombar-suino-com-pele-congelado-estrela-5-kg-cx-18-kg-pmg-atacadista.jpg' },
  { id: 1963, name: 'ARROZ ARBÓRIO LA PASTINA 1 KG (CX 10 PCT)', category: 'Derivados de Vegetal', price: 23.24, image: 'https://www.marquesvendaspmg.shop/images/arroz-arborio-la-pastina-1-kg-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1964, name: 'ARROZ ARBÓRIO PROVINCIAS DO SUL 1 KG (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 17.14, image: 'https://www.marquesvendaspmg.shop/images/arroz-arborio-provincias-do-sul-1-kg-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1965, name: 'AZEITE COMPOSTO 40% OLIVA 30% GIRASSOL E 30% SOJA FELICITÁ 500 ML (CX 12 VD)', category: 'Derivados de Vegetal', price: 63.53, image: 'https://www.marquesvendaspmg.shop/images/azeite-composto-40-oliva-30-girassol-e-30-soja-felicita-500-ml-cx-12-vd-pmg-atacadista.jpg' },
  { id: 1966, name: 'AZEITONA VERDE GRAÚDA 12 X 16 TOZZI 2 KG (CX 4 BD)', category: 'Derivados de Vegetal', price: 34.83, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-grauda-12-x-16-tozzi-2-kg-cx-4-bd-pmg-atacadista.jpg' },
  { id: 1967, name: 'BATATA CONGELADA PRÉ FRITA SURECRISP SKIN-ON WAFFLE FRIES CROSSTRAX MCCAIN 2,04 KG (CX 6 PCT)', category: 'Derivados de Vegetal', price: 278.89, image: 'https://www.marquesvendaspmg.shop/images/batata-congelada-pre-frita-surecrisp-skinon-waffle-fries-crosstrax-mccain-204-kg-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1968, name: 'CATCHUP REAL ZAFRÁN 1,05  KG (CX 5 BAG)', category: 'Derivados de Vegetal', price: 25.63, image: 'https://www.marquesvendaspmg.shop/images/catchup-real-zafran-105-kg-cx-5-bag-pmg-atacadista.jpg' },
  { id: 1969, name: 'CEBOLA CARAMELIZADA CAPELISTA 1,8 KG (CX 6 BD)', category: 'Derivados de Vegetal', price: 57.26, image: 'https://www.marquesvendaspmg.shop/images/cebola-caramelizada-capelista-18-kg-cx-6-bd-pmg-atacadista.jpg' },
  { id: 1970, name: 'ESPINAFRE EM FOLHAS CONGELADO GRANO 2 KG (CX 5 PCT)', category: 'Derivados de Vegetal', price: 35.06, image: 'https://www.marquesvendaspmg.shop/images/espinafre-em-folhas-congelado-grano-2-kg-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1971, name: 'GORDURA VEGETAL SUPREMA GOLDEN LT BUNGE 2,5 KG (CX 2 GL)', category: 'Derivados de Vegetal', price: 26.78, image: 'https://www.marquesvendaspmg.shop/images/gordura-vegetal-suprema-golden-lt-bunge-25-kg-cx-2-gl-pmg-atacadista.jpg' },
  { id: 1972, name: 'MANJERICÃO FLOCOS PENINA 200 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 3.57, image: 'https://www.marquesvendaspmg.shop/images/manjericao-flocos-penina-200-g-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1973, name: 'MARGARINA COM SAL 82 % DELÍCIA SUPREME SABOR MANTEIGA 500 G (CX 12 UN)', category: 'Derivados de Vegetal', price: 82.81, image: 'https://www.marquesvendaspmg.shop/images/margarina-com-sal-82-delicia-supreme-sabor-manteiga-500-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 1974, name: 'ÓLEO DE SOJA FRY MAX SOYA (BD 15,8 L)', category: 'Derivados de Vegetal', price: 167.11, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-fry-max-soya-pmg-atacadista.jpeg' },
  { id: 1975, name: 'PICKLES CLASSIC MCCOY´S 2 KG (CX 2 BD)', category: 'Derivados de Vegetal', price: 100.86, image: 'https://www.marquesvendaspmg.shop/images/pickles-classic-mccoys-2-kg-cx-2-bd-pmg-atacadista.jpg' },
  { id: 1976, name: 'PICKLES MISTO YGUARA (BD 2 KG)', category: 'Derivados de Vegetal', price: 29.92, image: 'https://www.marquesvendaspmg.shop/images/pickles-misto-yguara-bd-2-kg-pmg-atacadista.jpg' },
  { id: 1977, name: 'PICKLES SWEET CAPELISTA 1,001 KG (CX 6 BD)', category: 'Derivados de Vegetal', price: 38.51, image: 'https://www.marquesvendaspmg.shop/images/pickles-sweet-capelista-1001-kg-cx-6-bd-pmg-atacadista.jpg' },
  { id: 1978, name: 'PURÊ DE BATATA LBS 1 KG (CX 8 PCT)', category: 'Derivados de Vegetal', price: 23, image: 'https://www.marquesvendaspmg.shop/images/pure-de-batata-lbs-1-kg-cx-8-pct-pmg-atacadista.jpg' },
  { id: 1979, name: 'PURÊ DE BATATAS PENINA 500 G (CX 20 PCT)', category: 'Derivados de Vegetal', price: 18.38, image: 'https://www.marquesvendaspmg.shop/images/pure-de-batatas-penina-500-g-cx-20-pct-pmg-atacadista.jpg' },
  { id: 1980, name: 'VINAGRE SACHÊ ISIS 4 ML (CX 200 UN)', category: 'Derivados de Vegetal', price: 24.34, image: 'https://www.marquesvendaspmg.shop/images/vinagre-sache-isis-4-ml-cx-200-un-pmg-atacadista.jpg' },
  { id: 1981, name: 'BACALHAU POLACA DO ALASCA SALGADO SECO FILÉ EM PEDAÇOS SEAPRO 5 KG (CX 2 PCT)', category: 'Derivados do Mar', price: 192.74, image: 'https://www.marquesvendaspmg.shop/images/bacalhau-polaca-do-alasca-salgado-seco-file-em-pedacos-seapro-5-kg-cx-2-pct-pmg-atacadista.jpg' },
  { id: 1982, name: 'ACHOCOLATADO EM PÓ Q-ALIMENTARE 5 KG (FDO 4 PCT)', category: 'Doces/Frutas', price: 76.06, image: 'https://www.marquesvendaspmg.shop/images/achocolatado-em-po-qalimentare-5-kg-fdo-4-pct-pmg-atacadista.jpg' },
  { id: 1983, name: 'CHOCOLATE CHOCOCANDY DORI 500 G (CX 12 PCT)', category: 'Doces/Frutas', price: 16.06, image: 'https://www.marquesvendaspmg.shop/images/chocolate-chococandy-dori-500-g-cx-12-pct-pmg-atacadista.jpg' },
  { id: 1984, name: 'COCO RALADO FLOCADO ÚMIDO E ADOÇADO QUALICOCO 1,010 KG (CX 10 PCT)', category: 'Doces/Frutas', price: 37.08, image: 'https://www.marquesvendaspmg.shop/images/coco-ralado-flocado-umido-e-adocado-qualicoco-1010-kg-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1985, name: 'CREME DE BUENO RECHEIO ARTESANAL VABENE 1,01 KG (CX 8 BIS)', category: 'Doces/Frutas', price: 36.72, image: 'https://www.marquesvendaspmg.shop/images/creme-de-bueno-recheio-artesanal-vabene-101-kg-cx-8-bis-pmg-atacadista.jpg' },
  { id: 1986, name: 'GELATINA SEM SABOR LBS 510 G (CX 16 PCT)', category: 'Doces/Frutas', price: 29.35, image: 'https://www.marquesvendaspmg.shop/images/gelatina-sem-sabor-lbs-510-g-cx-16-pct-pmg-atacadista.jpg' },
  { id: 1987, name: 'LEITE DE COCO GRANDE CULINÁRIO QUALICOCO 1 L (CX 6 FR)', category: 'Doces/Frutas', price: 21.47, image: 'https://www.marquesvendaspmg.shop/images/leite-de-coco-grande-culinario-qualicoco-1-l-cx-6-fr-pmg-atacadista.jpg' },
  { id: 1988, name: 'MEL MÉDIO JP PEREIRA 500 G (CX 12 UN)', category: 'Doces/Frutas', price: 25.62, image: 'https://www.marquesvendaspmg.shop/images/mel-medio-jp-pereira-500-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 1989, name: 'MEL MÉDIO MINAMEL 900 G (CX 12 BAG)', category: 'Doces/Frutas', price: 45.52, image: 'https://www.marquesvendaspmg.shop/images/mel-medio-minamel-900-g-cx-12-bag-pmg-atacadista.jpg' },
  { id: 1990, name: 'PÊSSEGO EM CALDA FINÍSSIMA 485 G (CX 12 LT)', category: 'Doces/Frutas', price: 13.49, image: 'https://www.marquesvendaspmg.shop/images/pessego-em-calda-finissima-485-g-cx-12-lt-pmg-atacadista.jpg' },
  { id: 1991, name: 'PISTACHE CRU SEM CASCA LERYC 1 KG (CX 10 PCT)', category: 'Doces/Frutas', price: 230.06, image: 'https://www.marquesvendaspmg.shop/images/pistache-cru-sem-casca-leryc-1-kg-cx-10-pct-pmg-atacadista.jpg' },
  { id: 1992, name: 'POLPA DE ABACAXI COM HORTELÃ CONGELADA ICEFRUIT 100 G (CX 20 UN)', category: 'Doces/Frutas', price: 41.69, image: 'https://www.marquesvendaspmg.shop/images/polpa-de-abacaxi-com-hortela-congelada-icefruit-100-g-cx-20-un-pmg-atacadista.jpg' },
  { id: 1993, name: 'POLPA DE CAJU CONGELADA ICEFRUIT 100 G (CX 20 UN)', category: 'Doces/Frutas', price: 61.63, image: 'https://www.marquesvendaspmg.shop/images/polpa-de-caju-congelada-icefruit-100-g-cx-20-un-pmg-atacadista.jpg' },
  { id: 1994, name: 'RECHEIO E COBERTURA FORNEÁVEL SABOR PISTACHE HARALD 1,010 KG (CX 8 BIS)', category: 'Doces/Frutas', price: 52.76, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-forneavel-sabor-pistache-harald-1010-kg-cx-8-bis-pmg-atacadista.jpg' },
  { id: 1995, name: 'COUSCOUS LA PASTINA 500 G (CX 12 PCT)', category: 'Farináceos', price: 22.58, image: 'https://www.marquesvendaspmg.shop/images/couscous-la-pastina-500-g-cx-12-pct-pmg-atacadista.jpg' },
  { id: 1996, name: 'CURAU COM LEITE LBS 1 KG (CX 10 UN)', category: 'Farináceos', price: 13.6, image: 'https://www.marquesvendaspmg.shop/images/curau-com-leite-lbs-1-kg-cx-10-un-pmg-atacadista.jpg' },
  { id: 1997, name: 'FARINHA DE TRIGO TIPO 1 PURÍSSIMA ORIGINALE COAMO 5 KG (FDO 25 KG)', category: 'Farináceos', price: 101.22, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-purissima-originale-coamo-5-kg-fdo-25-kg-pmg-atacadista.jpg' },
  { id: 1998, name: 'MACARRÃO PENNE RIGATE GRANO DURO BARILLA 500 G (CX 12 UN)', category: 'Farináceos', price: 9.34, image: 'https://www.marquesvendaspmg.shop/images/macarrao-penne-rigate-grano-duro-barilla-500-g-cx-12-un-pmg-atacadista.jpg' },
  { id: 1999, name: 'MASSA FRESCA ESPAGUETE FAMIGLIARE 500 G (CX 15 PCT)', category: 'Farináceos', price: 8.22, image: 'https://www.marquesvendaspmg.shop/images/massa-fresca-espaguete-famigliare-500-g-cx-15-pct-pmg-atacadista.jpg' },
  { id: 2000, name: 'MASSA PARA LASANHA FAMIGLIARE 500 G (CX 22 PCT)', category: 'Farináceos', price: 7.34, image: 'https://www.marquesvendaspmg.shop/images/massa-para-lasanha-famigliare-500-g-cx-22-pct-pmg-atacadista.jpg' },
  { id: 2001, name: 'NHOQUE DE BATATA FAMIGLIARE 500 G (CX 12 PCT)', category: 'Farináceos', price: 8.81, image: 'https://www.marquesvendaspmg.shop/images/nhoque-de-batata-famigliare-500-g-cx-12-pct-pmg-atacadista.jpg' },
  { id: 2002, name: 'SAL SACHÊ CISNE 1 G (CX 1000 UN)', category: 'Farináceos', price: 30.06, image: 'https://www.marquesvendaspmg.shop/images/sal-sache-cisne-1-g-cx-1000-un-pmg-atacadista.jpg' },
  { id: 2003, name: 'TAPIOCA OISHII 1 KG (FD 10 PCT)', category: 'Farináceos', price: 6.77, image: 'https://www.marquesvendaspmg.shop/images/tapioca-oishii-1-kg-fd-10-pct-pmg-atacadista.jpg' },
  { id: 2004, name: 'PANO MULTIUSO AZUL BOBINA 50 UNIDADES 28 CM X 25 CM LIFE CLEAN (CX 12 UN)', category: 'Higiene', price: 22.76, image: 'https://www.marquesvendaspmg.shop/images/pano-multiuso-azul-bobina-50-unidades-28-cm-x-25-cm-life-clean-cx-12-un-pmg-atacadista.jpg' },
  { id: 2005, name: 'LICHIA EM CALDA BARÃO LALI 567 G (CX 24 LT)', category: 'Orientais', price: 22.93, image: 'https://www.marquesvendaspmg.shop/images/lichia-em-calda-barao-lali-567-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1518, name: 'CHOCOLATE AO LEITE MELKEN HARALD 2,1 KILO', category: '⏳ Ofertas da Semana 🚨', price: 171.55, image: 'https://www.marquesvendaspmg.shop/images/chocolate-ao-leite-melken-harald-21-kilo-pmg-atacadista.jpg' },
  { id: 640, name: 'CREME DE LEITE ITALAC 200 G (CX 24 UN)', category: '⏳ Ofertas da Semana 🚨', price: 79.00, image: 'https://www.marquesvendaspmg.shop/images/creme-de-leite-italac-200-g-cx-24-un-pmg-atacadista.jpg' },
  { id: 672, name: 'LEITE CONDENSADO SEMIDESNATADO FOOD SERVICE PIRACANJUBA 2,5 KILO', category: '⏳ Ofertas da Semana 🚨', price: 34.99, image: 'https://www.marquesvendaspmg.shop/images/leite-condensado-semidesnatado-food-service-piracanjuba-25-kilo-pmg-atacadista.jpg' },
  { id: 613, name: 'CHANTY MIX AMÉLIA 1 L', category: '⏳ Ofertas da Semana 🚨', price: 20.55, image: 'https://www.marquesvendaspmg.shop/images/chanty-mix-amelia-1-l-pmg-atacadista.jpg' },
  { id: 1739, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 BUQUÊ 1 KILO (FDO 10 KILO)', category: '⏳ Ofertas da Semana 🚨', price: 31.00, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pequena-tipo-1-buque-1-kilo-fdo-10-kilo-pmg-atacadista.jpg' },
  { id: 1528, name: 'CHOCOLATE EM PÓ 50% CACAU DOIS FRADES NESTLÉ 1,01 KILO', category: '⏳ Ofertas da Semana 🚨', price: 78.00, image: 'https://www.marquesvendaspmg.shop/images/chocolate-em-po-50-cacau-dois-frades-nestle-101-kilo-pmg-atacadista.jpg' },
  { id: 719, name: 'MUÇARELA BARI 4 KG', category: '⏳ Ofertas da Semana 🚨', price: 26.99, image: 'https://www.marquesvendaspmg.shop/images/mucarela-bari-4-kg-pmg-atacadista.jpg' },
  { id: 627, name: 'CREAM CHEESE PHILADELPHIA 1,5 KILO', category: '⏳ Ofertas da Semana 🚨', price: 59.99, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-philadelphia-15-kilo-pmg-atacadista.jpg' },
  { id: 895, name: 'REQUEIJÃO DANÚBIO SEM AMIDO 1 KILO', category: '⏳ Ofertas da Semana 🚨', price: 28.99, image: 'https://www.marquesvendaspmg.shop/images/requeijao-danubio-sem-amido-1-kilo-pmg-atacadista.jpg' },
  { id: 9, name: 'AVENTAL EMBORRACHADO PRETO TAMANHO ÚNICO', category: '⏳ Ofertas da Semana 🚨', price: 16.44, image: 'https://www.marquesvendaspmg.shop/images/avental-emborrachado-preto-tamanho-unico-pmg-atacadista.jpg' },
];

// ========== BANNERS ========== //
const banners = [
  { 
    id: 1,
    desktop: 'https://i.imgur.com/m9DxquV.png',
    mobile: 'https://i.imgur.com/m9DxquV.png'
  },
  { 
    id: 2,
    desktop: 'https://i.imgur.com/g6h6z2i.png',
    mobile: 'https://i.imgur.com/g6h6z2i.png'
  },
  { 
    id: 3,
    desktop: 'https://i.imgur.com/w9JCpKX.png',
    mobile: 'https://i.imgur.com/w9JCpKX.png'
  },
  { 
    id: 4,
    desktop: 'https://i.imgur.com/gX6M2lu.png',
    mobile: 'https://i.imgur.com/gX6M2lu.png'
  }
];

// Hook personalizado para detectar tamanho da tela
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

// Componente de Notificação Toast
const ToastNotification = ({ id, icon, title, message, highlight, whatsapp, onClose }) => {
  return (
    <div id={id} className="promo-toast">
      <div className="icon">{icon}</div>
      <div className="content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h4>{title}</h4>
        <p>
          {message}
          {highlight && <span className="highlight"> {highlight}</span>}
        </p>
        {whatsapp && (
          <a href="https://wa.me/5511913572902" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
            CHAMAR NO WHATSAPP
          </a>
        )}
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const { width: windowWidth } = useWindowSize();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [authError, setAuthError] = useState('');
  const [pageBlocked, setPageBlocked] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showFreteToast, setShowFreteToast] = useState(false);
  const [showWhatsappToast, setShowWhatsappToast] = useState(false);
  const productsPerPage = windowWidth > 768 ? 20 : 10;
  const bannerIntervalRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Efeito para o carrossel automático
  useEffect(() => {
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 10000);

    return () => {
      if (bannerIntervalRef.current) {
        clearInterval(bannerIntervalRef.current);
      }
    };
  }, []);

  // Efeito para as notificações toast
  useEffect(() => {
    const TEMPO_INICIAL = 15000;
    const INTERVALO = 9000;
    const DURACAO = 10000;

    const firstTimeout = setTimeout(() => {
      setShowFreteToast(true);
      setTimeout(() => setShowFreteToast(false), DURACAO);
    }, TEMPO_INICIAL);
    
    const secondTimeout = setTimeout(() => {
      setShowWhatsappToast(true);
      setTimeout(() => setShowWhatsappToast(false), DURACAO);
    }, TEMPO_INICIAL + INTERVALO);

    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(secondTimeout);
    };
  }, []);

// ADICIONAR ESTE USEEFFECT APÓS OS EXISTENTES
useEffect(() => {
  const applyCategoryFilterFromURL = () => {
    // Verificar se estamos no navegador
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaFromURL = urlParams.get('categoria');
    
    if (categoriaFromURL) {
      // Encontrar a categoria correspondente (case insensitive)
      const categoriaEncontrada = categories.find(cat => 
        cat.toLowerCase() === categoriaFromURL.toLowerCase()
      );
      
      if (categoriaEncontrada) {
        setSelectedCategory(categoriaEncontrada);
        setCurrentPage(1);
        
        // Rolagem suave para a seção de produtos
        setTimeout(() => {
          const productsSection = document.querySelector('.products-grid');
          if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }
  };

  applyCategoryFilterFromURL();
}, []); // Executa apenas uma vez ao carregar a página

// SUBSTITUA O USEEFFECT PROBLEMÁTICO POR ESTE:

useEffect(() => {
  const updateSEOMetaTags = () => {
    // Só executa no cliente
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaFromURL = urlParams.get('categoria');
    
    console.log('🔍 DEBUG SEO - Categoria detectada:', categoriaFromURL);
    
    let pageTitle = '';
    let metaDescription = '';

    if (categoriaFromURL) {
      // MAPEAMENTO COMPLETO DE SEO
      const seoMap = {
        'acessórios': {
          title: 'Acessórios para Restaurantes e Bares - Utensílios Profissionais | PMG Atacadista',
          description: 'Acessórios e utensílios profissionais para restaurantes, bares e food service. Melhor preço atacado com entrega grátis SP.'
        },
        'bebidas': {
          title: 'Bebidas para Atacado - Cervejas, Refris, Sucos, Águas | PMG Atacadista',
          description: 'Melhor preço em bebidas para seu negócio! Cervejas Skol, Brahma, Heineken. Refrigerantes, sucos, águas, energéticos. Atacado food service com entrega grátis.'
        },
        'conservas/enlatados': {
          title: 'Conservas e Enlatados para Atacado - Milho, Ervilha, Seleta | PMG Atacadista',
          description: 'Conservas, enlatados e produtos em lata para seu restaurante. Milho, ervilha, seleta, palmito, azeitonas. Atacado food service SP.'
        },
        'derivados de ave': {
          title: 'Produtos de Frango para Atacado - Frango Inteiro, Cortes, Embutidos | PMG',
          description: 'Derivados de frango e ave para food service. Frango inteiro, cortes, filé, coxa, sobrecoxa, linguiça de frango. Melhor preço atacado.'
        },
        'derivados de bovino': {
          title: 'Carnes Bovinas para Atacado - Picanha, Alcatra, Contrafilé | PMG Atacadista',
          description: 'Carnes bovinas premium para churrascos e restaurantes. Picanha, alcatra, contrafilé, maminha. Melhor preço atacado com entrega rápida.'
        },
        'derivados de leite': {
          title: 'Laticínios para Atacado - Queijos, Manteiga, Iogurte, Requeijão | PMG',
          description: 'Laticínios e derivados de leite para seu negócio. Queijos, manteiga, iogurte, requeijão, cream cheese. Atacado food service SP.'
        },
        'derivados de suíno': {
          title: 'Produtos Suínos para Atacado - Linguiça, Bacon, Pernil, Carne de Porco | PMG',
          description: 'Derivados de suínos e carne de porco para restaurantes. Linguiça toscana, bacon, pernil, costela, lombo. Melhor preço atacado.'
        },
        'derivados de vegetal': {
          title: 'Produtos Vegetais para Atacado - Hortifruti, Legumes, Verduras | PMG Atacadista',
          description: 'Derivados vegetais e hortifruti para food service. Legumes, verduras, produtos congelados, polpas. Atacado com entrega grátis SP.'
        },
        'derivados do mar': {
          title: 'Frutos do Mar e Pescados para Atacado - Peixes, Camarão, Polvo | PMG',
          description: 'Frutos do mar e pescados frescos e congelados. Peixes, camarão, polvo, lula, mariscos. Melhor preço atacado para restaurantes.'
        },
        'doces/frutas': {
          title: 'Doces e Frutas para Atacado - Sobremesas, Geleias, Frutas Frescas | PMG',
          description: 'Doces, sobremesas e frutas para seu estabelecimento. Geleias, compotas, frutas frescas e secas. Atacado food service SP.'
        },
        'farináceos': {
          title: 'Farináceos para Atacado - Arroz, Feijão, Macarrão, Farinha | PMG Atacadista',
          description: 'Farináceos e mantimentos para seu comércio. Arroz, feijão, macarrão, farinha de trigo, óleo, açúcar. Melhor preço atacado região SP.'
        },
        'higiene': {
          title: 'Produtos de Higiene e Limpeza para Atacado - Sabão, Detergente, Álcool | PMG',
          description: 'Produtos de higiene e limpeza profissional para restaurantes e mercados. Sabão, detergente, álcool, desinfetante. Atacado SP.'
        },
        'orientais': {
          title: 'Produtos Orientais para Atacado - Temperos, Molhos, Massas Asiáticas | PMG',
          description: 'Produtos orientais e asiáticos para food service. Shoyu, temperos, molhos, massas, ingredientes. Melhor preço atacado SP.'
        },
        'panificação': {
          title: 'Produtos de Panificação para Atacado - Pães, Bolos, Farinhas | PMG Atacadista',
          description: 'Produtos para panificação e confeitaria. Farinhas, fermentos, pães, bolos, ingredientes. Atacado para padarias e restaurantes.'
        },
        'salgados': {
          title: 'Salgados e Congelados para Atacado - Coxinhas, Empadas, Pizzas | PMG',
          description: 'Salgados, congelados e pratos prontos para seu negócio. Coxinhas, empadas, pizzas, esfihas. Melhor preço atacado food service.'
        },
        '⏳ ofertas da semana 🚨': {
          title: '🔥 Ofertas da Semana - Promoções Imperdíveis em Atacado | PMG Atacadista',
          description: 'Promoções da semana com até 50% off! Ofertas especiais em bebidas, carnes, laticínios, mercearia. Corre que é por tempo limitado!'
        }
      };

      const categoriaLower = categoriaFromURL.toLowerCase();
      const seoData = seoMap[categoriaLower];

      if (seoData) {
        pageTitle = seoData.title;
        metaDescription = seoData.description;
      } else {
        pageTitle = `${categoriaFromURL} - PMG Atacadista | Melhor Preço em Atacado`;
        metaDescription = `Compre ${categoriaFromURL} com melhor preço atacado. PMG Atacadista - food service com entrega grátis SP e região.`;
      }
    } else {
      pageTitle = 'Catálogo Completo - PMG Atacadista | Atacado Food Service SP';
      metaDescription = 'Catálogo completo de produtos atacado. Bebidas, carnes, laticínios, mercearia, limpeza. Melhor preço com entrega grátis SP.';
    }

    console.log('🔄 Atualizando título para:', pageTitle);
    
    // Força a atualização do título
    document.title = pageTitle;
    
    // Atualiza meta description
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.name = 'description';
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.content = metaDescription;

    // Múltiplas tentativas para garantir
    const forceTitleUpdate = () => {
      if (document.title !== pageTitle) {
        console.log('🔄 Forçando atualização do título...');
        document.title = pageTitle;
      }
    };

    // Executa várias vezes para garantir
    forceTitleUpdate();
    setTimeout(forceTitleUpdate, 100);
    setTimeout(forceTitleUpdate, 500);
    setTimeout(forceTitleUpdate, 1000);
  };

  // Executa imediatamente
  updateSEOMetaTags();
  
  // Re-executa após o componente montar completamente
  const timer = setTimeout(updateSEOMetaTags, 300);
  
  return () => clearTimeout(timer);
}, [selectedCategory]); // REMOVI window.location.search da dependência

  // Função para login com Google
const handleGoogleLogin = async () => {
  setLoading(true);
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://www.marquesvendaspmg.shop/produtos', // <- aqui é o segredo
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
  } catch (error) {
    setAuthError(error.message);
  } finally {
    setLoading(false);
  }
};

  const goToNextBanner = () => {
    setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    resetBannerInterval();
  };

  const goToPrevBanner = () => {
    setCurrentBannerIndex(prev => (prev - 1 + banners.length) % banners.length);
    resetBannerInterval();
  };

  const resetBannerInterval = () => {
    if (bannerIntervalRef.current) {
      clearInterval(bannerIntervalRef.current);
    }
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 10000);
  };

  // Carrega o usuário, nome, avatar e carrinho ao iniciar
  useEffect(() => {
    const checkUserAndCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setPageBlocked(false);
        
        // Pegar os dados do usuário (do Google ou cadastro normal)
        const fullName = user.user_metadata?.full_name || '';
        const avatarUrl = user.user_metadata?.avatar_url || '';
        
        setUserName(fullName);
        setUserAvatar(avatarUrl);
        
        // Verificar se o usuário já existe na tabela 'usuarios'
        const { data: usuarioData, error } = await supabase
          .from('usuarios')
          .select('nome, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = nenhum resultado encontrado
          console.error('Erro ao buscar usuário:', error);
        }
        
        // Se não encontrou o usuário, cria um novo registro
        if (!usuarioData) {
          await supabase
            .from('usuarios')
            .insert({
              id: user.id,
              nome: fullName || user.email,
              email: user.email,
              avatar_url: avatarUrl
            });
        } else {
          // Se encontrou, atualiza o avatar se necessário
          if (usuarioData.avatar_url !== avatarUrl && avatarUrl) {
            await supabase
              .from('usuarios')
              .update({ avatar_url: avatarUrl })
              .eq('id', user.id);
          }
        }
        
        await loadCartFromSupabase(user.id);
      }
    };
    
    // Adicionar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkUserAndCart();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserName('');
        setUserAvatar('');
        setPageBlocked(true);
      }
    });
    
    checkUserAndCart();
    
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Função para carregar o carrinho do Supabase
  const loadCartFromSupabase = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_carts')
      .select('cart_items')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        await supabase
          .from('user_carts')
          .insert({ user_id: userId, cart_items: [] });
        setCart([]);
        setTotal(0);
      } else {
        console.error('Erro ao carregar carrinho:', error);
      }
    } else {
      const cartItems = data.cart_items || [];
      setCart(cartItems);
      setTotal(cartItems.reduce((sum, item) => sum + item.price, 0));
    }
    setLoading(false);
  };

  // Função para atualizar o carrinho no Supabase
  const updateCartInSupabase = async (updatedCart) => {
    if (!user) return;
    const { error } = await supabase
      .from('user_carts')
      .upsert({ user_id: user.id, cart_items: updatedCart, updated_at: new Date().toISOString() });

    if (error) {
      console.error('Erro ao atualizar carrinho:', error);
    }
  };

  // Sincroniza o carrinho no Supabase quando ele muda
  useEffect(() => {
    if (user && cart.length >= 0) {
      updateCartInSupabase(cart);
    }
  }, [cart, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      setUser(data.user);
      
      // Busca o nome do usuário após login
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .single();
      
      if (profileData) {
        setUserName(profileData.full_name || '');
      }
      
      setShowAuthModal(false);
      setPageBlocked(false);
      await loadCartFromSupabase(data.user.id);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone,
            cpf_cnpj: cpfCnpj
          }
        }
      });
      if (error) throw error;
      const user = data?.user;
      if (!user || !user.id) throw new Error("Erro ao obter o ID do usuário.");

      await supabase
        .from('usuarios')
        .insert([
          {
            id: user.id,
            nome: name,
            email: email,
            telefone: phone,
            cpf_cnpj: cpfCnpj,
            senha: password
          }
        ]);

      alert('Cadastro realizado com sucesso! Verifique seu e-mail para confirmação. Se não encontrar verifique a caixa de spam.');
      setAuthType('login');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserName('');
    setUserAvatar('');
    setPageBlocked(true);
    setCart([]);
    setTotal(0);
  };

// Na função que adiciona produtos (provavelmente em outro componente)
const addToCart = (product) => {
  setCart(prevCart => {
    // Verifica se o produto já está no carrinho
    const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      // Incrementa a quantidade se já existir
      const updatedCart = [...prevCart];
      updatedCart[existingProductIndex] = {
        ...updatedCart[existingProductIndex],
        quantity: (updatedCart[existingProductIndex].quantity || 1) + 1
      };
      return updatedCart;
    } else {
      // Adiciona novo produto com quantidade 1
      return [...prevCart, { ...product, quantity: 1 }];
    }
  });
};

// Função para remover produto completamente
const removeFromCart = (productId) => {
  const newCart = cart.filter(item => item.id !== productId);
  setCart(newCart);
};

  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Função para redirecionar para a página de detalhes do produto
  const redirectToProductDetails = (productId) => {
    window.location.href = `/produto/${productId}`;
  };

  const filteredProducts = products
    .filter(product => product.category === selectedCategory)
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Estilos atualizados com os novos elementos
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: windowWidth > 768 ? '20px' : '10px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      position: 'relative'
    },
    header: {
      textAlign: 'center',
      marginBottom: windowWidth > 768 ? '20px' : '10px',
      padding: windowWidth > 768 ? '20px' : '15px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    userWelcomeBar: {
      backgroundColor: '#095400',
      color: 'white',
      padding: windowWidth > 768 ? '12px 20px' : '10px 15px',
      borderRadius: '8px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',      // muda de linha
      alignItems: 'flex-start',     // alinha à esquerda
      gap: '6px'                    // espaço entre mensagem e botão
    },
    welcomeMessage: {
      fontSize: windowWidth > 768 ? '16px' : '14px',
      fontWeight: '600',
      margin: 0
    },
    homeButton: {
      backgroundColor: 'white',
      color: '#095400',
      border: '1px solid #095400', // opcional pra destacar
      padding: windowWidth > 768 ? '8px 12px' : '6px 10px',
      borderRadius: '20px',
      fontSize: windowWidth > 768 ? '14px' : '12px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      whiteSpace: 'nowrap'
    },
    topHeaderContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: windowWidth > 768 ? '20px' : '15px',
      gap: '15px'
    },
    logoutButton: {
      display: 'block',
      margin: '0 auto 20px',
      padding: '10px 20px',
      backgroundColor: '#f0f0f0',
      border: 'none',
      borderRadius: '30px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    searchBar: {
      display: 'flex',
      justifyContent: 'center',
      margin: windowWidth > 768 ? '25px 0' : '15px 0',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      maxWidth: '500px',
      padding: windowWidth > 768 ? '12px 20px' : '10px 15px',
      borderRadius: '30px',
      border: '1px solid #ddd',
      fontSize: windowWidth > 768 ? '16px' : '14px',
      outline: 'none',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      transition: 'all 0.3s'
    },
    categoryMenu: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: windowWidth > 768 ? '10px' : '5px',
      margin: windowWidth > 768 ? '30px 0' : '15px 0',
      padding: windowWidth > 768 ? '15px' : '10px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      overflowX: windowWidth <= 768 ? 'auto' : 'visible',
      whiteSpace: 'nowrap',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    },
    categoryButton: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      border: 'none',
      padding: windowWidth > 768 ? '10px 20px' : '8px 12px',
      borderRadius: '30px',
      fontSize: windowWidth > 768 ? '14px' : '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      whiteSpace: 'nowrap'
    },
    activeCategory: {
      backgroundColor: '#095400',
      color: '#fff'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: windowWidth > 768 ? 'repeat(auto-fill, minmax(250px, 1fr))' : 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: windowWidth > 768 ? '25px' : '15px',
      margin: windowWidth > 768 ? '30px 0' : '15px 0'
    },
    productCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s',
      position: 'relative'
    },
    productImage: {
      width: '100%',
      height: windowWidth > 768 ? '180px' : '120px',
      objectFit: 'cover',
      borderBottom: '1px solid #eee'
    },
    productInfo: {
      padding: windowWidth > 768 ? '20px' : '10px',
      display: 'flex',
      flexDirection: 'column',
      height: windowWidth > 768 ? 'auto' : 'calc(100% - 120px)'
    },
    productNameContainer: {
      flex: '1',
      marginBottom: '10px'
    },
    productName: {
      fontSize: windowWidth > 768 ? '16px' : '14px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '5px',
      display: '-webkit-box',
      WebkitLineClamp: expandedDescriptions ? 'unset' : (windowWidth > 768 ? 2 : 3),
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    showMoreButton: {
      background: 'none',
      border: 'none',
      color: '#095400',
      fontSize: '12px',
      cursor: 'pointer',
      padding: '0',
      marginTop: '5px',
      textAlign: 'left',
      fontWeight: '600'
    },
    productPrice: {
      fontSize: windowWidth > 768 ? '18px' : '16px',
      fontWeight: '700',
      color: '#e53935',
      margin: windowWidth > 768 ? '15px 0' : '10px 0'
    },
    unavailablePrice: {
      fontSize: windowWidth > 768 ? '18px' : '16px',
      fontWeight: '700',
      color: '#999',
      margin: windowWidth > 768 ? '15px 0' : '10px 0',
      textDecoration: 'line-through'
    },
    addButton: {
      width: '100%',
      padding: windowWidth > 768 ? '12px' : '10px',
      backgroundColor: '#095400',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: windowWidth > 768 ? '15px' : '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    disabledButton: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: windowWidth > 768 ? '40px 0' : '20px 0',
      gap: windowWidth > 768 ? '10px' : '5px',
      flexWrap: 'wrap'
    },
    pageButton: {
      padding: windowWidth > 768 ? '8px 15px' : '6px 10px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: windowWidth > 768 ? '14px' : '12px'
    },
    activePage: {
      backgroundColor: '#095400',
      color: '#fff',
      borderColor: '#095400'
    },
    resultsInfo: {
      textAlign: 'center',
      color: '#666',
      margin: windowWidth > 768 ? '20px 0' : '10px 0',
      fontSize: windowWidth > 768 ? '14px' : '12px'
    },
    authModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: windowWidth > 768 ? '0' : '10px'
    },
    authBox: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: windowWidth > 768 ? '30px' : '20px',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
    },
    authToggle: {
      background: 'none',
      border: 'none',
      color: '#095400',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'underline',
      marginLeft: '5px',
      fontSize: windowWidth > 768 ? 'inherit' : '14px'
    },
    pageBlocker: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.9)',
      zIndex: 999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '20px'
    },
    blockerMessage: {
      fontSize: windowWidth > 768 ? '24px' : '18px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#095400',
      textAlign: 'center'
    },
    bannerContainer: {
      margin: windowWidth > 768 ? '40px 0' : '20px 0',
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    bannerImage: {
      width: '100%',
      display: 'block',
      transition: 'transform 0.5s ease',
      borderRadius: '10px'
    },
    bannerNavButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: windowWidth > 768 ? '40px' : '30px',
      height: windowWidth > 768 ? '40px' : '30px',
      fontSize: windowWidth > 768 ? '20px' : '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
    },
    prevButton: {
      left: '10px'
    },
    nextButton: {
      right: '10px'
    },
    bannerDots: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '10px'
    },
    dot: {
      width: windowWidth > 768 ? '12px' : '8px',
      height: windowWidth > 768 ? '12px' : '8px',
      borderRadius: '50%',
      backgroundColor: '#ccc',
      margin: '0 5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    activeDot: {
      backgroundColor: '#095400'
    },
    toastContainer: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    },
    promoToast: {
      background: '#fff',
      borderLeft: '4px solid #2ecc71',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      padding: '16px',
      maxWidth: '320px',
      opacity: 0,
      transform: 'translateX(20px)',
      transition: 'opacity 0.4s, transform 0.4s',
      display: 'flex',
      gap: '12px',
      marginBottom: '10px'
    },
    promoToastShow: {
      opacity: 1,
      transform: 'translateX(0)'
    },
    toastIcon: {
      fontSize: '24px',
      marginTop: '2px'
    },
    toastContent: {
      flex: 1
    },
    toastCloseBtn: {
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      color: '#95a5a6',
      alignSelf: 'flex-start'
    },
    toastTitle: {
      margin: '0 0 8px 0',
      color: '#2c3e50',
      fontSize: '16px',
      fontWeight: 700
    },
    toastMessage: {
      margin: 0,
      color: '#7f8c8d',
      fontSize: '14px',
      lineHeight: 1.4
    },
    toastHighlight: {
      color: '#e74c3c',
      fontWeight: 'bold'
    },
    toastWhatsappBtn: {
      display: 'inline-block',
      marginTop: '12px',
      background: '#25D366',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '13px'
    },
    googleLoginButton: {
      width: '100%',
      padding: '12px 20px',
      backgroundColor: '#fff',
      color: '#757575',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    googleLogo: {
      width: '20px',
      height: '20px'
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginRight: '10px'
    },
    userInfoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    // NOVO ESTILO: Lupa de detalhes do produto
    productDetailsButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: windowWidth > 768 ? '32px' : '28px',
      height: windowWidth > 768 ? '32px' : '28px',
      backgroundColor: '#e53935',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: windowWidth > 768 ? '16px' : '14px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      zIndex: 5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }
  };

  return (
    <>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '20px',
          fontWeight: 'bold',
          zIndex: 9999
        }}>
          Aguarde...
        </div>
      )}

      {/* Notificações Toast */}
      <div style={styles.toastContainer}>
        {showFreteToast && (
          <div style={{ ...styles.promoToast, ...styles.promoToastShow }}>
            <div style={styles.toastIcon}>🔔</div>
            <div style={styles.toastContent}>
              <button 
                style={styles.toastCloseBtn} 
                onClick={() => setShowFreteToast(false)}
              >
                ×
              </button>
              <h4 style={styles.toastTitle}>Frete GRÁTIS + Pague só na entrega!</h4>
              <p style={styles.toastMessage}>
                Sem risco, sem enrolação. Receba seus produtos e <span style={styles.toastHighlight}>pague só quando chegar</span>. Aproveite agora!
              </p>
            </div>
          </div>
        )}

        {showWhatsappToast && (
          <div style={{ ...styles.promoToast, ...styles.promoToastShow }}>
            <div style={styles.toastIcon}>📦</div>
            <div style={styles.toastContent}>
              <button 
                style={styles.toastCloseBtn} 
                onClick={() => setShowWhatsappToast(false)}
              >
                ×
              </button>
              <h4 style={styles.toastTitle}>Entregamos em até 48h!</h4>
              <p style={styles.toastMessage}>
                Tá com dúvida? Fala direto com a gente no WhatsApp 👉 <span style={styles.toastHighlight}>(11) 91357-2902</span>
              </p>
              <a 
                href="https://wa.me/5511913572902" 
                style={styles.toastWhatsappBtn} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                CHAMAR NO WHATSAPP
              </a>
            </div>
          </div>
        )}
      </div>

      <div style={styles.container}>
        {pageBlocked && (
          <div style={styles.pageBlocker}>
            <p style={styles.blockerMessage}>Faça login para acessar os preços e comprar</p>
            <button
              onClick={() => setShowAuthModal(true)}
              style={styles.addButton}
            >
              Acessar minha conta
            </button>
          </div>
        )}

        {/* Barra de boas-vindas com foto do usuário */}
        {user && (
          <div style={styles.userWelcomeBar}>
            <div style={styles.userInfoContainer}>
              {userAvatar && (
                <img 
                  src={userAvatar} 
                  alt="Foto do usuário"
                  style={styles.userAvatar} 
                />
              )}
              <p style={styles.welcomeMessage}>
                {userName ? `Olá ${userName}, seja bem-vindo(a)!` : `Olá ${user.email}, seja bem-vindo(a)!`}
              </p>
            </div>
            <a href="/" style={styles.homeButton}>
              Página Inicial
            </a>
          </div>
        )}

        <div style={styles.header}>
          <img 
            src="https://i.imgur.com/pBH5WpZ.png" 
            alt="Logo" 
            style={{ 
              height: windowWidth > 768 ? '60px' : '50px', 
              marginBottom: windowWidth > 768 ? '15px' : '10px' 
            }} 
          />
          <h1 style={{ 
            color: '#095400', 
            fontSize: windowWidth > 768 ? '28px' : '22px', 
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            PMG ATACADISTA
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: windowWidth > 768 ? '16px' : '14px' 
          }}>
            Encontre os melhores produtos para seu negócio
          </p>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Sair da Conta
          </button>
        )}

        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="🔍 Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.categoryMenu}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category && styles.activeCategory)
              }}
            >
              {category}
            </button>
          ))}
        </div>

<div style={styles.productsGrid}>
  {currentProducts.map(product => {
    const seo = generateImageSEO(product); // ← LINHA ADICIONADA
    
    return (
      <div 
        key={product.id} 
        style={{
          ...styles.productCard,
          ...(product.price === 0 && { opacity: 0.7 })
        }}
      >
        {/* BOTÃO LUPA - NOVO ELEMENTO ADICIONADO */}
        <button
          onClick={() => redirectToProductDetails(product.id)}
          style={styles.productDetailsButton}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#b92c2b';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#e03f3e';
            e.target.style.transform = 'scale(1)';
          }}
          title="Ver detalhes do produto"
        >
          🔍
        </button>
        
        <img 
          src={product.image} 
          alt={seo.alt}                    // ← MODIFICADO
          title={seo.title}                // ← ADICIONADO
          style={styles.productImage}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/250x180?text=Imagem+Não+Disponível';
          }}
        />
              <div style={styles.productInfo}>
                <div style={styles.productNameContainer}>
                  <h3 style={styles.productName}>
                    {product.name}
                  </h3>
                  {product.name.length > (windowWidth > 768 ? 40 : 30) && (
                    <button 
                      onClick={() => toggleDescription(product.id)}
                      style={styles.showMoreButton}
                    >
                      {expandedDescriptions[product.id] ? 'Mostrar menos' : 'Mostrar mais'}
                    </button>
                  )}
                </div>
                
                {user ? (
                  <p style={product.price > 0 ? styles.productPrice : styles.unavailablePrice}>
                    {product.price > 0 ? `R$ ${product.price.toFixed(2)}` : 'Indisponível'}
                  </p>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Faça login para ver o preço
                  </p>
                )}

                {user && (
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.price === 0}
                    style={{
                      ...styles.addButton,
                      ...(product.price === 0 && styles.disabledButton)
                    }}
                  >
                    {product.price > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        </div>
		
{/* ✅ AGORA SIM - Script de dados estruturados Schema.org */}
<>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": currentProducts.map(product => {
        
        // Gera descrição automática baseada no nome e categoria
        const generateDescription = (product) => {
          const baseDescription = {
            'Bebidas': `Refresque-se com ${product.name}. Perfeita para momentos especiais, oferecendo qualidade e sabor incomparáveis.`,
            'Laticínios': `Produto fresco e de alta qualidade. ${product.name} selecionado para atender os mais altos padrões.`,
            'Frios': `Sabor e qualidade em cada fatia. ${product.name} ideal para seu estabelecimento.`,
            'default': `${product.name}. Produto de alta qualidade com ótimo custo-benefício para seu negócio.`
          };
          return baseDescription[product.category] || baseDescription.default;
        };

        // Gera brand automático baseado no nome
        const generateBrand = (product) => {
          const brandMap = {
            'ITAIPAVA': 'Itaipava',
            'BRAHMA': 'Brahma',
            'SKOL': 'Skol',
            'ANTARCTICA': 'Antarctica',
            'HEINEKEN': 'Heineken',
            'default': 'Marcas Premium'
          };
          
          const foundBrand = Object.keys(brandMap).find(brand => 
            product.name.toUpperCase().includes(brand)
          );
          return brandMap[foundBrand] || brandMap.default;
        };

        return {
          "@type": "Product",
          "name": product.name,
          "description": generateDescription(product),
          "category": product.category,
          "image": product.image,
          "brand": { 
            "@type": "Brand", 
            "name": generateBrand(product)
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "37"
          },
          "review": [
            {
              "@type": "Review",
              "author": { 
                "@type": "Person", 
                "name": "Carlos, pizzaria cliente da PMG" 
              },
              "datePublished": "2025-09-28",
              "reviewBody": "Produto de excelente qualidade e o site da Marques Vendas PMG é rápido e confiável.",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5",
                "worstRating": "1"
              }
            },
            {
              "@type": "Review",
              "author": { 
                "@type": "Person", 
                "name": "Fernanda, restaurante parceiro" 
              },
              "datePublished": "2025-08-11",
              "reviewBody": "A muçarela Bari chegou no prazo e com ótimo custo-benefício. Atendimento excelente!",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5",
                "worstRating": "1"
              }
            }
          ],
          "offers": {
            "@type": "Offer",
            "price": product.price.toString(),
            "priceCurrency": "BRL",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2026-01-25",
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0.00",
                "currency": "BRL"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": { 
                  "@type": "QuantitativeValue", 
                  "minValue": 0, 
                  "maxValue": 1, 
                  "unitCode": "d" 
                },
                "transitTime": { 
                  "@type": "QuantitativeValue", 
                  "minValue": 1, 
                  "maxValue": 2, 
                  "unitCode": "d" 
                }
              },
              "shippingDestination": [
                { 
                  "@type": "DefinedRegion", 
                  "addressCountry": "BR", 
                  "addressRegion": "SP" 
                },
                { 
                  "@type": "DefinedRegion", 
                  "addressCountry": "BR", 
                  "addressRegion": "MG", 
                  "name": "Sul de Minas" 
                },
                { 
                  "@type": "DefinedRegion", 
                  "addressCountry": "BR", 
                  "addressRegion": "RJ", 
                  "name": "Sul do Rio de Janeiro" 
                }
              ]
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "BR",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 0,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn",
              "returnPolicySeasonalOverride": "Devolução apenas no ato da entrega, antes da assinatura da nota fiscal."
            },
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": product.price.toString(),
              "priceCurrency": "BRL",
              "referenceQuantity": {
                "@type": "QuantitativeValue",
                "value": "1",
                "unitCode": "KGM"
              }
            },
            "seller": {
              "@type": "LocalBusiness",
              "priceRange": "$$",
              "name": "Marques Vendas PMG",
              "image": "https://i.imgur.com/jrERRsC.png",
              "telephone": "+55-11-91357-2902",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Estrada Ferreira Guedes, 784 - Potuverá",
                "postalCode": "06885-150",
                "addressLocality": "Itapecerica da Serra",
                "addressRegion": "SP",
                "addressCountry": "BR"
              }
            }
          }
        };
      })
    })
  }}
/>
</>

        {filteredProducts.length > productsPerPage && (
          <div style={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 && { cursor: 'not-allowed', opacity: 0.5 })
              }}
            >
              Anterior
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  ...styles.pageButton,
                  ...(page === currentPage && styles.activePage)
                }}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                ...styles.pageButton,
                ...(currentPage === totalPages && { cursor: 'not-allowed', opacity: 0.5 })
              }}
            >
              Próxima
            </button>
          </div>
        )}

{/* Conteúdo SEO PMG Atacadista Produtos - VISÍVEL APENAS PARA O GOOGLE */}
<div style={{
  opacity: '0', height: '0', overflow: 'hidden', position: 'absolute', pointerEvents: 'none'
}}>
  <h1>PMG Atacadista - Catálogo Completo de Produtos Food Service</h1>
  <p>PMG Atacadista catálogo completo com laticínios, queijos, embutidos, massas, bebidas, congelados e produtos alimentícios. PMG Atacadista produtos das melhores marcas para seu negócio.</p>
  
  <h2>PMG Atacadista Produtos em Destaque</h2>
  <p>PMG Atacadista laticínios e derivados. PMG Atacadista queijos diversos. PMG Atacadista embutidos e frios. PMG Atacadista massas e farináceos. PMG Atacadista bebidas não alcoólicas. PMG Atacadista congelados e pré-preparados.</p>
  
  <h3>PMG Atacadista Fornecedor</h3>
  <p>PMG Atacadista fornecedor autorizado das principais marcas do mercado. PMG Atacadista qualidade garantida e procedência. PMG Atacadista estoque permanente.</p>
</div>

        {/* Área dos Banners */}
        <div style={styles.bannerContainer}>
          <img
            src={windowWidth > 768 ? banners[currentBannerIndex].desktop : banners[currentBannerIndex].mobile}
            alt={`Banner ${currentBannerIndex + 1}`}
            style={styles.bannerImage}
          />
          <button
            onClick={goToPrevBanner}
            style={{ ...styles.bannerNavButton, ...styles.prevButton }}
            aria-label="Banner anterior"
          >
            &lt;
          </button>
          <button
            onClick={goToNextBanner}
            style={{ ...styles.bannerNavButton, ...styles.nextButton }}
            aria-label="Próximo banner"
          >
            &gt;
          </button>
          <div style={styles.bannerDots}>
            {banners.map((_, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentBannerIndex(index);
                  resetBannerInterval();
                }}
                style={{
                  ...styles.dot,
                  ...(index === currentBannerIndex && styles.activeDot)
                }}
              />
            ))}
          </div>
        </div>

{/* Rodapé Corrigido - Totalmente Responsivo */}
<footer style={{
  marginTop: '60px',
  padding: '30px 15px',
  textAlign: 'center',
  color: '#666',
  fontSize: '14px',
  borderTop: '2px solid #095400',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px 12px 0 0',
  boxShadow: '0 -2px 10px rgba(9, 84, 0, 0.1)',
  width: '100%',
  boxSizing: 'border-box'
}}>
  
  {/* Container Principal do Rodapé */}
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  }}>
    
    {/* Título do Rodapé */}
    <h3 style={{
      color: '#095400',
      fontSize: '18px',
      marginBottom: '25px',
      fontWeight: '600'
    }}>
      📋 Informações Legais
    </h3>

    {/* Links Principais em Grid Responsivo */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      marginBottom: '30px',
      width: '100%'
    }}>
      
      {/* Política de Privacidade */}
      <Link href="/politica-de-privacidade" passHref legacyBehavior>
        <a style={{ 
          color: '#095400', 
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
          padding: '12px 8px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          minHeight: '50px'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#095400';
          e.target.style.color = 'white';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 8px rgba(9, 84, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.color = '#095400';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }}
        title="Política de Privacidade"
        aria-label="Leia nossa Política de Privacidade"
      >
        <span>🔒</span>
        Privacidade
      </a>
      </Link>

      {/* Política de Devolução e Reembolso */}
      <Link href="/politica-devolucao-e-reembolso" passHref legacyBehavior>
        <a style={{ 
          color: '#095400', 
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
          padding: '12px 8px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          minHeight: '50px'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#095400';
          e.target.style.color = 'white';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 8px rgba(9, 84, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.color = '#095400';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }}
        title="Política de Devolução e Reembolso"
        aria-label="Leia nossa Política de Devolução e Reembolso"
      >
        <span>🔄</span>
        Política de Devolução e Reembolso
      </a>
      </Link>

      {/* Termos de Uso */}
      <Link href="/termos" passHref legacyBehavior>
        <a style={{ 
          color: '#095400', 
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
          padding: '12px 8px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          minHeight: '50px'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#095400';
          e.target.style.color = 'white';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 8px rgba(9, 84, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.color = '#095400';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }}
        title="Termos de Uso"
        aria-label="Leia nossos Termos de Uso"
      >
        <span>📄</span>
        Termos
      </a>
      </Link>

      {/* Quem Somos */}
      <Link href="/quem-somos" passHref legacyBehavior>
        <a style={{ 
          color: '#095400', 
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
          padding: '12px 8px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          minHeight: '50px'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#095400';
          e.target.style.color = 'white';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 8px rgba(9, 84, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.color = '#095400';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }}
        title="Quem Somos"
        aria-label="Conheça mais sobre nós"
      >
        <span>👥</span>
        Sobre
      </a>
      </Link>
    </div>

    {/* Linha Divisa Estilizada */}
    <div style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, #095400, transparent)',
      margin: '25px auto',
      maxWidth: '300px',
      width: '100%'
    }}></div>

    {/* Redes Sociais */}
    <div style={{
      marginBottom: '20px'
    }}>
      <h4 style={{
        color: '#095400',
        fontSize: '16px',
        marginBottom: '15px',
        fontWeight: '600'
      }}>
        Siga-nos nas Redes Sociais
      </h4>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Facebook */}
        <a 
          href="https://www.facebook.com/MarquesVendaspmg" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          <img 
            src="https://i.imgur.com/prULUUA.png" 
            alt="Facebook" 
            style={{
              width: '20px',
              height: '20px'
            }}
          />
        </a>

        {/* Instagram */}
        <a 
          href="https://www.instagram.com/marquesvendaspmg" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          <img 
            src="https://i.imgur.com/I0ZZLjG.png" 
            alt="Instagram" 
            style={{
              width: '20px',
              height: '20px'
            }}
          />
        </a>

        {/* YouTube */}
        <a 
          href="https://www.youtube.com/@MarquesVendasPMG" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          <img 
            src="https://i.imgur.com/WfpZ8Gg.png" 
            alt="YouTube" 
            style={{
              width: '20px',
              height: '20px'
            }}
          />
        </a>
      </div>
    </div>

    {/* Informações de Contato e Copyright */}
    <div style={{ 
      textAlign: 'center',
      paddingTop: '15px',
      borderTop: '1px solid #e0e0e0'
    }}>
      <p style={{ 
        margin: '8px 0', 
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.5'
      }}>
        © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
      </p>
      <p style={{ 
        margin: '8px 0', 
        fontSize: '12px', 
        color: '#888',
        lineHeight: '1.4'
      }}>
        Endereço: Estrada Ferreira Guedes, 784 - Potuverá 
        <br />
        CEP: 06885-150 - Itapecerica da Serra - SP
      </p>
      <p style={{ 
        margin: '8px 0', 
        fontSize: '12px', 
        color: '#888'
      }}>
        📞 Telefone: (11) 91357-2902
      </p>
    </div>
  </div>
</footer>

        {showAuthModal && (
          <div style={styles.authModal}>
            <div style={styles.authBox}>
              <h2 style={{ 
                color: '#095400', 
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: windowWidth > 768 ? '24px' : '20px'
              }}>
                {authType === 'login' ? 'Acesse Sua Conta' : 'Crie Sua Conta'}
              </h2>

              {authError && (
                <p style={{ 
                  color: '#e53935', 
                  textAlign: 'center',
                  marginBottom: '15px',
                  fontSize: windowWidth > 768 ? '16px' : '14px'
                }}>
                  {authError}
                </p>
              )}

              <form onSubmit={authType === 'login' ? handleLogin : handleRegister}>
                {authType === 'register' && (
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ ...styles.searchInput, marginBottom: '15px' }}
                    required
                  />
                )}

                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    style={{ ...styles.searchInput, marginBottom: '15px' }}
                    required
                  />

                  {authType === 'register' && (
                    <>
                      <input
                        type="tel"
                        placeholder="Telefone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ ...styles.searchInput, marginBottom: '15px' }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="CPF/CNPJ"
                        value={cpfCnpj}
                        onChange={(e) => setCpfCnpj(e.target.value)}
                        style={{ ...styles.searchInput, marginBottom: '15px' }}
                        required
                      />
                    </>
                  )}

                  <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...styles.searchInput, marginBottom: '20px' }}
                    required
                  />

                  <button
                    type="submit"
                    style={styles.addButton}
                  >
                    {authType === 'login' ? 'Entrar' : 'Cadastrar'}
                  </button>

                  <p style={{ 
                    textAlign: 'center', 
                    marginTop: '15px',
                    fontSize: windowWidth > 768 ? '16px' : '14px'
                  }}>
                    {authType === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthType(authType === 'login' ? 'register' : 'login');
                        setAuthError('');
                      }}
                      style={styles.authToggle}
                    >
                      {authType === 'login' ? 'Cadastre-se' : 'Faça login'}
                    </button>
                  </p>
                </form>
                
                {/* Adicionar o botão de login com Google */}
                <div style={{ 
                  marginTop: '20px', 
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '15px 0',
                    color: '#757575'
                  }}>
                    <div style={{ 
                      flex: 1, 
                      height: '1px', 
                      backgroundColor: '#ddd' 
                    }}></div>
                    <span style={{ 
                      padding: '0 10px', 
                      fontSize: '14px' 
                    }}>ou</span>
                    <div style={{ 
                      flex: 1, 
                      height: '1px', 
                      backgroundColor: '#ddd' 
                    }}></div>
                  </div>
                  
                  <button
                    onClick={handleGoogleLogin}
                    style={styles.googleLoginButton}
                  >
                    <img 
                      src="https://i.imgur.com/TcCOJPO.png" 
                      alt="Google logo" 
                      style={styles.googleLogo} 
                    />
                    Entrar com Google
                  </button>
                </div>
              </div>
            </div>
          )}

          <Cart cart={cart} setCart={setCart} removeFromCart={removeFromCart} />
        </div>
      </>
    );
  };

  export default ProductsPage;









