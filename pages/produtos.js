import React, { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import { supabase } from '../lib/supabaseClient';

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
  { id: 1, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/Ztx9nv9.png' },
  { id: 2, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://i.imgur.com/Ztx9nv9.png' },
  { id: 3, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/Ztx9nv9.png' },
  { id: 4, name: 'PRODUTO EM FALTA', category: 'Salgados', price: 0, image: 'https://i.imgur.com/Ztx9nv9.png' },
  { id: 5, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/Ztx9nv9.png' },
  { id: 6, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://i.imgur.com/Ztx9nv9.png' },
  { id: 7, name: 'APLICADOR PARA REQUEIJÃO (CX 1 UN)', category: 'Acessórios', price: 821.75, image: 'https://i.imgur.com/xRNNoJ1.png' },
  { id: 8, name: 'AVENTAL EMBORRACHADO BRANCO TAMANHO ÚNICO', category: 'Acessórios', price: 16.56, image: 'https://i.imgur.com/vdFl2eF.png' },
  { id: 9, name: 'AVENTAL EMBORRACHADO PRETO TAMANHO ÚNICO', category: 'Acessórios', price: 16.56, image: 'https://i.imgur.com/VkoKK8b.png' },
  { id: 10, name: 'AVENTAL TERGAL BRANCO TAMANHO ÚNICO', category: 'Acessórios', price: 19.43, image: 'https://i.imgur.com/9CQc9lS.png' },
  { id: 11, name: 'BANDEJA PARA ESFIHA "22" 17 X 20 CM (PCT 100 UN)', category: 'Acessórios', price: 28.99, image: 'https://i.imgur.com/EH1m90i.png' },
  { id: 12, name: 'BANDEJA PARA ESFIHA "23" 20 X 24 CM (PCT 100 UN)', category: 'Acessórios', price: 40.49, image: 'https://i.imgur.com/GSbN5x9.png' },
  { id: 13, name: 'BANDEJA PARA ESFIHA "25" 27 X 32 CM (PCT 100 UN)', category: 'Acessórios', price: 81.14, image: 'https://i.imgur.com/fV525qj.png' },
  { id: 14, name: 'BANDEJA PARA ESFIHA "24" 21 X 27 CM (PCT 100 UN)', category: 'Acessórios', price: 54.07, image: 'https://i.imgur.com/l5EHUeV.png' },
  { id: 15, name: 'BAÚ MOCHILA PRATA LAMINADO PARA PIZZA MIL ROTAS (UN)', category: 'Acessórios', price: 184.05, image: 'https://i.imgur.com/xK6GCwc.png' },
  { id: 16, name: 'BAÚ MOCHILA VERMELHO COMUM PARA PIZZA MIL ROTAS (UN)', category: 'Acessórios', price: 150.31, image: 'https://i.imgur.com/0sfnhWc.png' },
  { id: 17, name: 'BAÚ MOCHILA VERMELHO LAMINADO COM BOLSÃO PARA PIZZA MIL ROTAS (UN)', category: 'Acessórios', price: 184.05, image: 'https://i.imgur.com/Xmzk5dn.png' },
  { id: 18, name: 'BONÉ BRIM BRANCO (UN)', category: 'Acessórios', price: 26.73, image: 'https://i.imgur.com/9vF5FfN.png' },
  { id: 19, name: 'BRIQUETE (SC 21 KILO)', category: 'Acessórios', price: 53.68, image: 'https://i.imgur.com/YeJ6gLC.png' },
  { id: 20, name: 'CAIXA PARA PIZZA BRANCA 25 CM (PCT 25 UN)', category: 'Acessórios', price: 44.02, image: 'https://i.imgur.com/Gz5GuUb.png' },
  { id: 21, name: 'CAIXA PARA PIZZA BRANCA 35 CM (PCT 25 UN)', category: 'Acessórios', price: 51.84, image: 'https://i.imgur.com/YbnQSj9.png' },
  { id: 22, name: 'CAIXA PARA PIZZA OITAVADA 25 CM (PCT 25 UN)', category: 'Acessórios', price: 27.97, image: 'https://i.imgur.com/xHOKPsy.png' },
  { id: 23, name: 'CAIXA PARA PIZZA OITAVADA 35 CM (PCT 25 UN)', category: 'Acessórios', price: 41.41, image: 'https://i.imgur.com/93BT48Q.png' },
  { id: 24, name: 'CALÇA BRIM BRANCA (UN 44 / M)', category: 'Acessórios', price: 90.61, image: 'https://i.imgur.com/dXX4mA0.png' },
  { id: 25, name: 'CALÇA BRIM BRANCA (UN 46 / G)', category: 'Acessórios', price: 90.61, image: 'https://i.imgur.com/OMc2PMM.png' },
  { id: 26, name: 'CANUDO BIODEGRADÁVEL STRAWPLAST 500 UN', category: 'Acessórios', price: 28.73, image: 'https://i.imgur.com/g5JNeRt.png' },
  { id: 27, name: 'COMANDA COMUM (PCT 20 x 50)', category: 'Acessórios', price: 39.72, image: 'https://i.imgur.com/QbaUrZs.png' },
  { id: 28, name: 'COMANDA COPIATIVA (PCT 20 x 50)', category: 'Acessórios', price: 44.33, image: 'https://i.imgur.com/sf81TDO.png' },
  { id: 29, name: 'COPO DESCARTÁVEL MÉDIO 180 ML PCT 100 UN', category: 'Acessórios', price: 7.64, image: 'https://i.imgur.com/NO8E2jD.png' },
  { id: 30, name: 'COPO DESCARTÁVEL PEQUENO 50 ML PCT 100 UN', category: 'Acessórios', price: 4.15, image: 'https://i.imgur.com/gn5JO0M.png' },
  { id: 31, name: 'ENVELOPE PARA PIZZA 25 CM (FDO 250 UN)', category: 'Acessórios', price: 72.31, image: 'https://i.imgur.com/n2UhHK0.png' },
  { id: 32, name: 'ENVELOPE PARA PIZZA 35 CM (FDO 250 UN)', category: 'Acessórios', price: 85.67, image: 'https://i.imgur.com/TudGuED.png' },
  { id: 33, name: 'ETIQUETA LACRE (PCT 2 x 500)', category: 'Acessórios', price: 47.77, image: 'https://i.imgur.com/zVovVts.png' },
  { id: 34, name: 'FÓSFORO QUELUZ (PCT 10 UN)', category: 'Acessórios', price: 4.11, image: 'https://i.imgur.com/o4urrNs.png' },
  { id: 35, name: 'GUARDANAPO DE PAPEL TV (PCT 2000 UN)', category: 'Acessórios', price: 22.64, image: 'https://i.imgur.com/jTNCTlT.png' },
  { id: 36, name: 'PÁ DE ESFIHA (UN 90 X 22 CM)', category: 'Acessórios', price: 172.09, image: 'https://i.imgur.com/3O56lc7.png' },
  { id: 37, name: 'PÁ DE FERRO (UN 35 CM)', category: 'Acessórios', price: 117.03, image: 'https://i.imgur.com/bZ8QS5y.png' },
  { id: 38, name: 'PÁ DE FERRO (UN 38 CM)', category: 'Acessórios', price: 142.11, image: 'https://i.imgur.com/CSlRZMV.png' },
  { id: 39, name: 'PÁ DE MADEIRA (UN 35 CM)', category: 'Acessórios', price: 204.67, image: 'https://i.imgur.com/GEXkR8j.png' },
  { id: 40, name: 'PÁ DE MADEIRA (UN 40 CM)', category: 'Acessórios', price: 204.67, image: 'https://i.imgur.com/z0VRXno.png' },
  { id: 41, name: 'PALITO SACHÊ BOM SABOR (CX 2000 UN)', category: 'Acessórios', price: 32.29, image: 'https://i.imgur.com/q2cVQcN.png' },
  { id: 42, name: 'SUPORTE TRIPÉ INJEQUALY (PCT 500 UN)', category: 'Acessórios', price: 28.43, image: 'https://i.imgur.com/UNbS4Zt.png' },
  { id: 43, name: 'TOUCA DE CABELO TNT (PCT 100 UN)', category: 'Acessórios', price: 19.82, image: 'https://i.imgur.com/4j4OlRg.png' },
  { id: 44, name: 'VARREDOR PARA FORNO (UN 40 CM)', category: 'Acessórios', price: 100.39, image: 'https://i.imgur.com/6mCFEci.png' },
  { id: 45, name: 'VASSOURINHA CABO PLÁSTICO (UN)', category: 'Acessórios', price: 12.26, image: 'https://i.imgur.com/1hzJAIk.png' },
  { id: 46, name: 'ÁGUA DE COCO GRANDE COCO QUADRADO 1 L (CX 12 UN)', category: 'Bebidas', price: 95.09, image: 'https://i.imgur.com/tqXbq0u.png' },
  { id: 47, name: 'ÁGUA DE COCO GRANDE MAIS COCO 1 L (CX 12 UN)', category: 'Bebidas', price: 48.97, image: 'https://i.imgur.com/Yg6Kl4U.png' },
  { id: 48, name: 'ÁGUA DE COCO GRANDE SOCOCO 1 L (CX 12 UN)', category: 'Bebidas', price: 152.1, image: 'https://i.imgur.com/xGWxX17.png' },
  { id: 49, name: 'ÁGUA DE COCO MÉDIA SOCOCO 330 ML (CX 12 UN)', category: 'Bebidas', price: 91.11, image: 'https://i.imgur.com/bhoCd71.png' },
  { id: 50, name: 'ÁGUA DE COCO PEQUENA COCO QUADRADO 200 ML (CX 27 UN)', category: 'Bebidas', price: 53.49, image: 'https://i.imgur.com/HOVDKDi.png' },
  { id: 51, name: 'ÁGUA DE COCO PEQUENA SOCOCO 200 ML (CX 24 UN)', category: 'Bebidas', price: 113.9, image: 'https://i.imgur.com/4pmmrk2.png' },
  { id: 52, name: 'ÁGUA MINERAL BUONAVITA COM GÁS 510 ML (PCT 12 UN)', category: 'Bebidas', price: 20.12, image: 'https://i.imgur.com/17TzAGa.png' },
  { id: 53, name: 'ÁGUA MINERAL BUONAVITA SEM GÁS 510 ML (PCT 12 UN)', category: 'Bebidas', price: 20.12, image: 'https://i.imgur.com/FtAvPy2.png' },
  { id: 54, name: 'ÁGUA MINERAL CRYSTAL COM GÁS 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 21.39, image: 'https://i.imgur.com/qk5R1EC.png' },
  { id: 55, name: 'ÁGUA MINERAL CRYSTAL COM GÁS 500 ML (PCT 12 UN)', category: 'Bebidas', price: 23.39, image: 'https://i.imgur.com/BEji5qD.png' },
  { id: 56, name: 'ÁGUA MINERAL CRYSTAL SEM GÁS 500 ML (PCT 12 UN)', category: 'Bebidas', price: 23.52, image: 'https://i.imgur.com/E1FmizQ.png' },
  { id: 57, name: 'ÁGUA MINERAL GRANDE BUONAVITA SEM GÁS 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 13.79, image: 'https://i.imgur.com/D94rRgB.png' },
  { id: 58, name: 'ÁGUA MINERAL GRANDE CRYSTAL SEM GÁS 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 20.58, image: 'https://i.imgur.com/sgI0IfJ.png' },
  { id: 59, name: 'ÁGUA MINERAL SÃO LOURENÇO COM GÁS 300 ML (PCT 12 UN)', category: 'Bebidas', price: 28.22, image: 'https://i.imgur.com/Z5uVO48.png' },
  { id: 60, name: 'ÁGUA MINERAL SÃO LOURENÇO SEM GÁS 300 ML (PCT 12 UN)', category: 'Bebidas', price: 24.47, image: 'https://i.imgur.com/ZIpy8tT.png' },
  { id: 61, name: 'ÁGUA TÔNICA ANTARCTICA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 42.41, image: 'https://i.imgur.com/xPYBtZK.png' },
  { id: 62, name: 'ÁGUA TÔNICA ANTARCTICA ZERO AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 42.41, image: 'https://i.imgur.com/TxNWUio.png' },
  { id: 63, name: 'ÁGUA TÔNICA SCHWEPPES LATA 350 ML (PCT 6 LT)', category: 'Bebidas', price: 19.73, image: 'https://i.imgur.com/KOTwPYv.png' },
  { id: 64, name: 'AGUARDENTE DE CANA KARIRI 960 ML', category: 'Bebidas', price: 16.2, image: 'https://i.imgur.com/5xoELur.png' },
  { id: 65, name: 'AGUARDENTE DE CANA PITÚ 965 ML', category: 'Bebidas', price: 11.41, image: 'https://i.imgur.com/o67gbyF.png' },
  { id: 66, name: 'AGUARDENTE DE CANA PITÚ LATA 350 ML', category: 'Bebidas', price: 57.55, image: 'https://i.imgur.com/Ykv0QsE.png' },
  { id: 67, name: 'AGUARDENTE DE CANA YPIÓCA PRATA SEM PALHA 965 ML', category: 'Bebidas', price: 19.63, image: 'https://i.imgur.com/KlWngwN.png' },
  { id: 68, name: 'APERITIVO APEROL 750 ML', category: 'Bebidas', price: 44.17, image: 'https://i.imgur.com/VoOwOvW.png' },
  { id: 69, name: 'APERITIVO BRASILBERG 920 ML', category: 'Bebidas', price: 57.67, image: 'https://i.imgur.com/EftrEce.png' },
  { id: 70, name: 'APERITIVO CAMPARI 998 ML', category: 'Bebidas', price: 50.8, image: 'https://i.imgur.com/5bSaThb.png' },
  { id: 71, name: 'APERITIVO CATUABA SELVAGEM TRADICIONAL 900 ML', category: 'Bebidas', price: 15.1, image: 'https://i.imgur.com/isp0yHw.png' },
  { id: 72, name: 'APERITIVO CINZANO VERMOUTH ROSSO 1 L', category: 'Bebidas', price: 36.69, image: 'https://i.imgur.com/mVSUVIK.png' },
  { id: 73, name: 'APERITIVO CONTINI 900 ML', category: 'Bebidas', price: 29.45, image: 'https://i.imgur.com/z19w0T0.png' },
  { id: 74, name: 'APERITIVO CYNAR 900 ML', category: 'Bebidas', price: 23.93, image: 'https://i.imgur.com/5ZSUJve.png' },
  { id: 75, name: 'APERITIVO FERNET FENETTI DUBAR 900 ML', category: 'Bebidas', price: 22.8, image: 'https://i.imgur.com/PaQnVde.png' },
  { id: 76, name: 'APERITIVO JURUPINGA DINALLE 975 ML', category: 'Bebidas', price: 29.45, image: 'https://i.imgur.com/auiD435.png' },
  { id: 77, name: 'APERITIVO MALIBU 750 ML', category: 'Bebidas', price: 49.08, image: 'https://i.imgur.com/MWsgdmO.png' },
  { id: 78, name: 'APERITIVO MARTINI BIANCO SUAVE 750 ML', category: 'Bebidas', price: 28.22, image: 'https://i.imgur.com/bsA2KBV.png' },
  { id: 79, name: 'APERITIVO PARATUDO RAÍZES AMARGAS 900 ML', category: 'Bebidas', price: 13.99, image: 'https://i.imgur.com/WsQAo1N.png' },
  { id: 80, name: 'CACHAÇA 51 965 ML (CX 12 UN)', category: 'Bebidas', price: 159.51, image: 'https://i.imgur.com/TqKXtHc.png' },
  { id: 81, name: 'CACHAÇA BOAZINHA 600 ML', category: 'Bebidas', price: 39.26, image: 'https://i.imgur.com/wtfC1KY.png' },
  { id: 82, name: 'CACHAÇA BUSCA VIDA 670 ML', category: 'Bebidas', price: 64.05, image: 'https://i.imgur.com/OI94JGY.png' },
  { id: 83, name: 'CACHAÇA CHICO MINEIRO OURO 600 ML', category: 'Bebidas', price: 46.14, image: 'https://i.imgur.com/5pO8gYd.png' },
  { id: 84, name: 'CACHAÇA COROTE TRADICIONAL 500 ML (CX 12 UN)', category: 'Bebidas', price: 53.99, image: 'https://i.imgur.com/KTiq21r.png' },
  { id: 85, name: 'CACHAÇA ESPÍRITO DE MINAS 700 ML', category: 'Bebidas', price: 90.8, image: 'https://i.imgur.com/fow1yzn.png' },
  { id: 86, name: 'CACHAÇA SAGATIBA PURA 700 ML', category: 'Bebidas', price: 36.81, image: 'https://i.imgur.com/FlR6Qh0.png' },
  { id: 87, name: 'CACHAÇA SÃO FRANCISCO 970 ML', category: 'Bebidas', price: 30.68, image: 'https://i.imgur.com/iQR2qEp.png' },
  { id: 88, name: 'CACHAÇA SELETA OURO 1 L', category: 'Bebidas', price: 51.22, image: 'https://i.imgur.com/4sS9pVm.png' },
  { id: 89, name: 'CACHAÇA TRADICIONAL SALINAS 600 ML', category: 'Bebidas', price: 42.09, image: 'https://i.imgur.com/FeiiJss.png' },
  { id: 90, name: 'CACHAÇA TRÊS CORONÉIS 700 ML', category: 'Bebidas', price: 36.69, image: 'https://i.imgur.com/YHYZ2Ud.png' },
  { id: 91, name: 'CACHAÇA VELHO BARREIRO 910 ML (CX 12 UN)', category: 'Bebidas', price: 177.13, image: 'https://i.imgur.com/ww4Ey2O.png' },
  { id: 92, name: 'CACHAÇA YPIÓCA OURO COM PALHA 965 ML', category: 'Bebidas', price: 45.77, image: 'https://i.imgur.com/a3cody2.png' },
  { id: 93, name: 'CACHAÇA YPIÓCA OURO SEM PALHA 965 ML', category: 'Bebidas', price: 19.63, image: 'https://i.imgur.com/ZADAGxu.png' },
  { id: 94, name: 'CERVEJA AMSTEL PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 48.84, image: 'https://i.imgur.com/gqAmSPA.png' },
  { id: 95, name: 'CERVEJA BADEN BADEN PILSEN CRISTAL 600 ML', category: 'Bebidas', price: 16.04, image: 'https://i.imgur.com/gIH2c6r.png' },
  { id: 96, name: 'CERVEJA BRAHMA CHOPP PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 45.79, image: 'https://i.imgur.com/xMU8wow.png' },
  { id: 97, name: 'CERVEJA BRAHMA DUPLO MALTE LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 49.13, image: 'https://i.imgur.com/H9NEcSv.png' },
  { id: 98, name: 'CERVEJA BRAHMA MALZBIER LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 61.95, image: 'https://i.imgur.com/loLnJMo.png' },
  { id: 99, name: 'CERVEJA BUDWEISER LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 51.33, image: 'https://i.imgur.com/lwl3JpI.png' },
  { id: 100, name: 'CERVEJA BUDWEISER LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 145.53, image: 'https://i.imgur.com/8MX9Cuv.png' },
  { id: 101, name: 'CERVEJA CORONA LONG NECK 330 ML (CX 24 UN)', category: 'Bebidas', price: 182.87, image: 'https://i.imgur.com/EviQUwq.png' },
  { id: 102, name: 'CERVEJA EISENBAHN PILSEN PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 52.48, image: 'https://i.imgur.com/8E2gGKF.png' },
  { id: 103, name: 'CERVEJA HEINEKEN PURE MALT LAGER GARRAFA 600 ML (CX 12 UN)', category: 'Bebidas', price: 155.63, image: 'https://i.imgur.com/g9bdaCe.png' },
  { id: 104, name: 'CERVEJA HEINEKEN PURE MALT LAGER LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 71.6, image: 'https://i.imgur.com/KpaxjmO.png' },
  { id: 105, name: 'CERVEJA HEINEKEN PURE MALT LAGER LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 168.76, image: 'https://i.imgur.com/uTzT10G.png' },
  { id: 106, name: 'CERVEJA HEINEKEN ZERO ÁLCOOL 0.0 PURE MALT LAGER LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 69.24, image: 'https://i.imgur.com/zTOBPy4.png' },
  { id: 107, name: 'CERVEJA HEINEKEN ZERO ÁLCOOL 0.0 PURE MALT LAGER LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 168.76, image: 'https://i.imgur.com/HqD5nNf.png' },
  { id: 108, name: 'CERVEJA IMPÉRIO PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 38.66, image: 'https://i.imgur.com/yCWHL3m.png' },
  { id: 109, name: 'CERVEJA ITAIPAVA MALZBIER LONG NECK 330 ML (PCT 12 UN)', category: 'Bebidas', price: 59.25, image: 'https://i.imgur.com/VfO4EqY.png' },
  { id: 110, name: 'CERVEJA ITAIPAVA PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 36.63, image: 'https://i.imgur.com/QD6KSIU.png' },
  { id: 111, name: 'CERVEJA MÉDIA SKOL PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 45.11, image: 'https://i.imgur.com/NAYX8Ci.png' },
  { id: 112, name: 'CERVEJA ORIGINAL PILSEN GARRAFA 600 ML (CX 12 UN)', category: 'Bebidas', price: 130.55, image: 'https://i.imgur.com/GsxYNg2.png' },
  { id: 113, name: 'CERVEJA ORIGINAL PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 56.37, image: 'https://i.imgur.com/c8DgNO8.png' },
  { id: 114, name: 'CERVEJA PEQUENA BRAHMA DUPLO MALTE LATA 269 ML (CX 15 LT)', category: 'Bebidas', price: 42.77, image: 'https://i.imgur.com/nli1nNP.png' },
  { id: 115, name: 'CERVEJA PEQUENA BUDWEISER LATA 269 ML (CX 8 LT)', category: 'Bebidas', price: 27.55, image: 'https://i.imgur.com/ORmar3O.png' },
  { id: 116, name: 'CERVEJA PEQUENA HEINEKEN PURE MALT LAGER LATA 269 ML (CX 8 LT)', category: 'Bebidas', price: 38.6, image: 'https://i.imgur.com/QhZv0Ag.png' },
  { id: 117, name: 'CERVEJA PEQUENA ITAIPAVA LATA 269 ML (CX 12 LT)', category: 'Bebidas', price: 26.39, image: 'https://i.imgur.com/RwijqKS.png' },
  { id: 118, name: 'CERVEJA PEQUENA ORIGINAL LATA 269 ML (CX 8 LT)', category: 'Bebidas', price: 29.39, image: 'https://i.imgur.com/CdtjYC6.png' },
  { id: 119, name: 'CERVEJA PEQUENA SKOL PILSEN LATA 269 ML (PCT 15 LT)', category: 'Bebidas', price: 43.51, image: 'https://i.imgur.com/S5M5fZx.png' },
  { id: 120, name: 'CERVEJA PETRA PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 38.2, image: 'https://i.imgur.com/FrZQJAp.png' },
  { id: 121, name: 'CERVEJA SPATEN MUNICH GARRAFA 600 ML (CX 12 UN)', category: 'Bebidas', price: 117.5, image: 'https://i.imgur.com/UqnM9iw.png' },
  { id: 122, name: 'CERVEJA SPATEN MUNICH LONG NECK 330 ML (CX 24 UN)', category: 'Bebidas', price: 148.31, image: 'https://i.imgur.com/aYUFDw0.png' },
  { id: 123, name: 'CERVEJA STELLA ARTOIS LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 164.2, image: 'https://i.imgur.com/Yqv90NL.png' },
  { id: 124, name: 'CHÁ ICE TEA LEÃO PÊSSEGO 450 ML (PCT 6 UN)', category: 'Bebidas', price: 26.71, image: 'https://i.imgur.com/mYsMIVY.png' },
  { id: 125, name: 'CHOPP DE VINHO DRAFT 600 ML (CX 6 UN)', category: 'Bebidas', price: 59.63, image: 'https://i.imgur.com/QPmzWNc.png' },
  { id: 126, name: 'COCA COLA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 42.61, image: 'https://i.imgur.com/Uwi8g8t.png' },
  { id: 127, name: 'COCA COLA MÉDIA PET 1 L (PCT 6 UN)', category: 'Bebidas', price: 44.6, image: 'https://i.imgur.com/vCg7qHG.png' },
  { id: 128, name: 'COCA COLA MIÚDA PET 200 ML (PCT 12 UN)', category: 'Bebidas', price: 27.84, image: 'https://i.imgur.com/M1Bwinx.png' },
  { id: 129, name: 'COCA COLA MIÚDA ZERO AÇÚCARES PET 200 ML (PCT 12 UN)', category: 'Bebidas', price: 25.96, image: 'https://i.imgur.com/MbguwP0.png' },
  { id: 130, name: 'COCA COLA PEQUENA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 64.48, image: 'https://i.imgur.com/85GeybY.png' },
  { id: 131, name: 'COCA COLA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 64.14, image: 'https://i.imgur.com/0mRiiHR.png' },
  { id: 132, name: 'COCA COLA SEM AÇÚCAR LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 42.85, image: 'https://i.imgur.com/kqAAygP.png' },
  { id: 133, name: 'COCA COLA SEM AÇÚCAR PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 66.59, image: 'https://i.imgur.com/HCnvLhe.png' },
  { id: 134, name: 'COCA COLA SEM AÇÚCAR PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 66.64, image: 'https://i.imgur.com/huczUsj.png' },
  { id: 135, name: 'CONHAQUE DE ALCATRÃO SÃO JOÃO DA BARRA 900 ML', category: 'Bebidas', price: 20.86, image: 'https://i.imgur.com/B2Bf4H9.png' },
  { id: 136, name: 'CONHAQUE DOMECQ 1 L', category: 'Bebidas', price: 34.11, image: 'https://i.imgur.com/2Gurjzh.png' },
  { id: 137, name: 'CONHAQUE DREHER 900 ML', category: 'Bebidas', price: 19.02, image: 'https://i.imgur.com/8SAGGHm.png' },
  { id: 138, name: 'CONHAQUE FUNDADOR 750 ML', category: 'Bebidas', price: 139.88, image: 'https://i.imgur.com/76UKYQw.png' },
  { id: 139, name: 'CONHAQUE PRESIDENTE 900 ML', category: 'Bebidas', price: 13.74, image: 'https://i.imgur.com/6w0dfiz.png' },
  { id: 140, name: 'COQUETEL CANELINHA DA ROCHA 900 ML', category: 'Bebidas', price: 13.37, image: 'https://i.imgur.com/e8vbfxi.png' },
  { id: 141, name: 'COQUETEL DE VINHO NACIONAL TINTO SUAVE CANTINHO DO VALE 880 ML (CX 12 UN)', category: 'Bebidas', price: 58.9, image: 'https://i.imgur.com/pWceuEo.png' },
  { id: 142, name: 'COQUETEL DE VODKA LIMÃO COROTE 500 ML (CX 12 UN)', category: 'Bebidas', price: 51.53, image: 'https://i.imgur.com/bjjlPUR.png' },
  { id: 143, name: 'COQUETEL DE VODKA MORANGO COROTE 500 ML (CX 12 UN)', category: 'Bebidas', price: 48.47, image: 'https://i.imgur.com/4XwjS18.png' },
  { id: 144, name: 'DOLLY GUARANÁ PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 32.77, image: 'https://i.imgur.com/aAdDhss.png' },
  { id: 145, name: 'DOLLY LARANJA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 33.03, image: 'https://i.imgur.com/lhOIp4p.png' },
  { id: 146, name: 'DOLLY LIMÃO PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 33.03, image: 'https://i.imgur.com/8XJh3CD.png' },
  { id: 147, name: 'DOLLY UVA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 33.03, image: 'https://i.imgur.com/O3sIHYP.png' },
  { id: 148, name: 'ENERGÉTICO LONG ONE 2 L (PCT 6 UN)', category: 'Bebidas', price: 32.39, image: 'https://i.imgur.com/FWVW4KU.png' },
  { id: 149, name: 'ENERGÉTICO MONSTER ENERGY 473 ML (PCT 6 UN)', category: 'Bebidas', price: 55.35, image: 'https://i.imgur.com/shM029z.png' },
  { id: 150, name: 'ENERGÉTICO MONSTER ENERGY ABSOLUTELY ZERO 473 ML (PCT 6 UN)', category: 'Bebidas', price: 55.35, image: 'https://i.imgur.com/DhK5whd.png' },
  { id: 151, name: 'ENERGÉTICO MONSTER ENERGY MANGO LOCO 473 ML (PCT 6 UN)', category: 'Bebidas', price: 57.05, image: 'https://i.imgur.com/huIeeYb.png' },
  { id: 152, name: 'ENERGÉTICO MONSTER ENERGY PACIFIC PUNCH 473 ML (PCT 6 UN)', category: 'Bebidas', price: 55.35, image: 'https://i.imgur.com/uOSbkTz.png' },
  { id: 153, name: 'ENERGÉTICO MONSTER SEM AÇÚCAR ENERGY ULTRA 473 ML (PCT 6 UN)', category: 'Bebidas', price: 57.05, image: 'https://i.imgur.com/qwcJbo6.png' },
  { id: 154, name: 'ENERGÉTICO MONSTER SEM AÇÚCAR ENERGY ULTRA PARADISE 473 ML (PCT 6 UN)', category: 'Bebidas', price: 55.35, image: 'https://i.imgur.com/1T0gmwB.png' },
  { id: 155, name: 'ENERGÉTICO MONSTER SEM AÇÚCAR ENERGY ULTRA VIOLET 473 ML (PCT 6 UN)', category: 'Bebidas', price: 55.35, image: 'https://i.imgur.com/xBcfMw7.png' },
  { id: 156, name: 'ENERGÉTICO RED BULL 250 ML (CX 24 LT)', category: 'Bebidas', price: 197.29, image: 'https://i.imgur.com/X7QYk9G.png' },
  { id: 157, name: 'ENERGÉTICO RED BULL MELANCIA 250 ML (CX 24 LT)', category: 'Bebidas', price: 197.29, image: 'https://i.imgur.com/ihjQzWJ.png' },
  { id: 158, name: 'ENERGÉTICO RED BULL SUGAR FREE 250 ML (CX 24 LT)', category: 'Bebidas', price: 197.29, image: 'https://i.imgur.com/KveAIAZ.png' },
  { id: 159, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/kwBGqTh.png' },
  { id: 160, name: 'ESPUMANTE BRANCO MOSCATEL SALTON 750 ML', category: 'Bebidas', price: 28.22, image: 'https://i.imgur.com/xKvBDm0.png' },
  { id: 161, name: 'ESPUMANTE BRANCO NATURAL BRUT SALTON 750 ML', category: 'Bebidas', price: 28.22, image: 'https://i.imgur.com/NbwxaH3.png' },
  { id: 162, name: 'ESPUMANTE CHANDON BABY BRUT ROSÉ 187 ML', category: 'Bebidas', price: 34.72, image: 'https://i.imgur.com/UOUhAZI.png' },
  { id: 163, name: 'ESPUMANTE CHANDON BRUT ROSÉ 750 ML', category: 'Bebidas', price: 88.22, image: 'https://i.imgur.com/1jSn4VL.png' },
  { id: 164, name: 'ESPUMANTE CHANDON PASSION ON ICE ROSÉ MEIO DOCE 750 ML', category: 'Bebidas', price: 88.22, image: 'https://i.imgur.com/TAA5umr.png' },
  { id: 165, name: 'ESPUMANTE CHANDON RÉSERVE BRUT 750 ML', category: 'Bebidas', price: 88.22, image: 'https://i.imgur.com/ommx528.png' },
  { id: 166, name: 'FANTA LARANJA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 45.16, image: 'https://i.imgur.com/5ReJnVO.png' },
  { id: 167, name: 'FANTA LARANJA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 54.68, image: 'https://i.imgur.com/j4TEd4Y.png' },
  { id: 168, name: 'FANTA LARANJA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 62.91, image: 'https://i.imgur.com/uyFcrge.png' },
  { id: 169, name: 'FANTA UVA LATA 350 ML (PCT 6 UN)', category: 'Bebidas', price: 22.06, image: 'https://i.imgur.com/Eb36m63.png' },
  { id: 170, name: 'FANTA UVA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 53.35, image: 'https://i.imgur.com/yiNHcUD.png' },
  { id: 171, name: 'GIN BEEFEATER 750 ML', category: 'Bebidas', price: 89.45, image: 'https://i.imgur.com/6df0UMK.png' },
  { id: 172, name: 'GIN BOMBAY SAPPHIRE 750 ML', category: 'Bebidas', price: 91.96, image: 'https://i.imgur.com/MWJIll6.png' },
  { id: 173, name: 'GIN GORDON´S 750 ML', category: 'Bebidas', price: 63.19, image: 'https://i.imgur.com/alcs9CJ.png' },
  { id: 174, name: 'GIN LONDON DRY DUBAR 960 ML', category: 'Bebidas', price: 20.86, image: 'https://i.imgur.com/dOy7KlX.png' },
  { id: 175, name: 'GIN ROCK´S 1 L', category: 'Bebidas', price: 29.45, image: 'https://i.imgur.com/5RdOqD6.png' },
  { id: 176, name: 'GIN ROCK´S STRAWBERRY 1 L', category: 'Bebidas', price: 29.45, image: 'https://i.imgur.com/i6Pm343.png' },
  { id: 177, name: 'GIN SEAGERS 1 L', category: 'Bebidas', price: 36.81, image: 'https://i.imgur.com/GpuRWlo.png' },
  { id: 178, name: 'GIN TANQUERAY 750 ML', category: 'Bebidas', price: 103.07, image: 'https://i.imgur.com/NRRLRRa.png' },
  { id: 179, name: 'GROSELHA CACHOEIRA 920 ML (CX 6 UN)', category: 'Bebidas', price: 77.91, image: 'https://i.imgur.com/8AdjNQa.png' },
  { id: 180, name: 'GUARANÁ ANTARCTICA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 42.77, image: 'https://i.imgur.com/P0CQ3Zl.png' },
  { id: 181, name: 'GUARANÁ ANTARCTICA MIÚDA PET 200 ML (PCT 12 UN)', category: 'Bebidas', price: 23.27, image: 'https://i.imgur.com/ZE6W0mU.png' },
  { id: 182, name: 'GUARANÁ ANTARCTICA PEQUENO PET 1 L (PCT 6 UN)', category: 'Bebidas', price: 22.66, image: 'https://i.imgur.com/9vkUfR7.png' },
  { id: 183, name: 'GUARANÁ ANTARCTICA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 59.12, image: 'https://i.imgur.com/NQWjuu7.png' },
  { id: 184, name: 'GUARANÁ ANTARCTICA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 59.16, image: 'https://i.imgur.com/xxRz6rJ.png' },
  { id: 185, name: 'GUARANÁ ANTARCTICA SEM AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 58.43, image: 'https://i.imgur.com/D8W1N7a.png' },
  { id: 186, name: 'GUARANÁ ANTARCTICA SEM AÇÚCARES PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 59.12, image: 'https://i.imgur.com/TXIuTRO.png' },
  { id: 187, name: 'H2O LIMÃO SEM AÇÚCARES PET 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 55.77, image: 'https://i.imgur.com/mgbfTj8.png' },
  { id: 188, name: 'H2O LIMÃO SEM AÇÚCARES PET 500 ML (PCT 12 UN)', category: 'Bebidas', price: 56.59, image: 'https://i.imgur.com/WgdbcLm.png' },
  { id: 189, name: 'H2O LIMONETO SEM AÇÚCARES PET 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 56.83, image: 'https://i.imgur.com/ThoJihW.png' },
  { id: 190, name: 'H2O LIMONETO SEM AÇÚCARES PET 500 ML (PCT 12 UN)', category: 'Bebidas', price: 56.59, image: 'https://i.imgur.com/a5gJuZq.png' },
  { id: 191, name: 'ISOTÔNICO GATORADE LARANJA 500 ML (PCT 6 UN)', category: 'Bebidas', price: 38.91, image: 'https://i.imgur.com/xfKZK8Q.png' },
  { id: 192, name: 'ISOTÔNICO GATORADE LIMÃO 500 ML (PCT 6 UN)', category: 'Bebidas', price: 38.91, image: 'https://i.imgur.com/AyYU1J0.png' },
  { id: 193, name: 'ISOTÔNICO GATORADE MORANGO COM MARACUJÁ 500 ML (PCT 6 UN)', category: 'Bebidas', price: 38.91, image: 'https://i.imgur.com/gtuF9eG.png' },
  { id: 194, name: 'ISOTÔNICO GATORADE TANGERINA 500 ML (PCT 6 UN)', category: 'Bebidas', price: 38.91, image: 'https://i.imgur.com/9kv8WWM.png' },
  { id: 195, name: 'ISOTÔNICO GATORADE UVA 500 ML (PCT 6 UN)', category: 'Bebidas', price: 38.91, image: 'https://i.imgur.com/Lko6tf9.png' },
  { id: 196, name: 'ITUBAÍNA TUTTI FRUTTI RETRÔ LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 40.77, image: 'https://i.imgur.com/CrkOINB.png' },
  { id: 197, name: 'ITUBAÍNA TUTTI FRUTTI RETRÔ LONG NECK 355 ML (PCT 12 UN)', category: 'Bebidas', price: 41.83, image: 'https://i.imgur.com/Hs9tCiS.png' },
  { id: 198, name: 'LICOR 43 700 ML', category: 'Bebidas', price: 142.09, image: 'https://i.imgur.com/QRZ24SE.png' },
  { id: 199, name: 'LICOR 43 CHOCOLATE 700 ML', category: 'Bebidas', price: 177.92, image: 'https://i.imgur.com/ZJgtAiR.png' },
  { id: 200, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/4Y3jmIQ.png' },
  { id: 201, name: 'LICOR AMARULA CREAM 750 ML', category: 'Bebidas', price: 107.98, image: 'https://i.imgur.com/VG0O8sa.png' },
  { id: 202, name: 'LICOR BAILEYS 750 ML', category: 'Bebidas', price: 109.2, image: 'https://i.imgur.com/kp3vauk.png' },
  { id: 203, name: 'LICOR COINTREAU 700 ML', category: 'Bebidas', price: 120.86, image: 'https://i.imgur.com/8lCxuIn.png' },
  { id: 204, name: 'LICOR DRAMBUIE 750 ML', category: 'Bebidas', price: 141.09, image: 'https://i.imgur.com/1gZ3XLz.png' },
  { id: 205, name: 'LICOR JAGERMEISTER 700 ML', category: 'Bebidas', price: 114.11, image: 'https://i.imgur.com/THY5Sl2.png' },
  { id: 206, name: 'LICOR STOCK CREME DE CACAU 720 ML', category: 'Bebidas', price: 36.81, image: 'https://i.imgur.com/IizXLqI.png' },
  { id: 207, name: 'LICOR STOCK CREME DE CASSIS 720 ML', category: 'Bebidas', price: 36.81, image: 'https://i.imgur.com/Z0DqQsd.png' },
  { id: 208, name: 'LICOR STOCK CREME DE MENTA 720 ML', category: 'Bebidas', price: 36.81, image: 'https://i.imgur.com/2GXjOLt.png' },
  { id: 209, name: 'LICOR STOCK CURAÇAU BLUE 720 ML', category: 'Bebidas', price: 36.81, image: 'https://i.imgur.com/xUXuLNl.png' },
  { id: 210, name: 'LICOR STOCK CURAÇAU FINO 720 ML', category: 'Bebidas', price: 36.81, image: 'https://i.imgur.com/PJnWL2L.png' },
  { id: 211, name: 'LICOR STOCK MARULA 720 ML', category: 'Bebidas', price: 55.22, image: 'https://i.imgur.com/6m2CVqT.png' },
  { id: 212, name: 'LICOR STOCK PÊSSEGO 720 ML', category: 'Bebidas', price: 36.81, image: 'https://i.imgur.com/1kIeFI7.png' },
  { id: 213, name: 'PEPSI COLA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 39.01, image: 'https://i.imgur.com/ywCxBmN.png' },
  { id: 214, name: 'PEPSI COLA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 54.12, image: 'https://i.imgur.com/8fW7ddU.png' },
  { id: 215, name: 'REFRESCO ABACAXI CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 79.24, image: 'https://i.imgur.com/EZhhD5L.png' },
  { id: 216, name: 'REFRESCO ABACAXI QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://i.imgur.com/fttfRDg.png' },
  { id: 217, name: 'REFRESCO CAJU QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://i.imgur.com/2l39LMI.png' },
  { id: 218, name: 'REFRESCO LARANJA CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 79.24, image: 'https://i.imgur.com/32jkiGP.png' },
  { id: 219, name: 'REFRESCO LARANJA E ACEROLA QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://i.imgur.com/LdkrQsI.png' },
  { id: 220, name: 'REFRESCO LARANJA QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://i.imgur.com/68vHe9j.png' },
  { id: 221, name: 'REFRESCO LIMÃO CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 79.24, image: 'https://i.imgur.com/AnnxJX9.png' },
  { id: 222, name: 'REFRESCO LIMÃO QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://i.imgur.com/oEL0sPz.png' },
  { id: 223, name: 'REFRESCO MANGA CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 79.24, image: 'https://i.imgur.com/3xzxkB3.png' },
  { id: 224, name: 'REFRESCO MANGA QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://i.imgur.com/6tySJCT.png' },
  { id: 225, name: 'REFRESCO MARACUJA CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 79.24, image: 'https://i.imgur.com/pin1Bh5.png' },
  { id: 226, name: 'REFRESCO MARACUJÁ QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://i.imgur.com/8Nhx9Ya.png' },
  { id: 227, name: 'REFRESCO MORANGO QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.35, image: 'https://i.imgur.com/mrN0fxD.png' },
  { id: 228, name: 'REFRESCO UVA QUALIMAX 1 KILO (CX 10 PCT)', category: 'Bebidas', price: 124.23, image: 'https://i.imgur.com/kqikhVr.png' },
  { id: 229, name: 'RUM BACARDÍ BIG APPLE 980 ML', category: 'Bebidas', price: 35.58, image: 'https://i.imgur.com/v1VvKQq.png' },
  { id: 230, name: 'RUM BACARDÍ CARTA BLANCA SUPERIOR 980 ML', category: 'Bebidas', price: 37.42, image: 'https://i.imgur.com/BQJ1Q17.png' },
  { id: 231, name: 'RUM BACARDÍ CARTA ORO SUPERIOR 980 ML', category: 'Bebidas', price: 35.58, image: 'https://i.imgur.com/oN80bGu.png' },
  { id: 232, name: 'RUM MONTILLA CARTA BRANCA 1 L', category: 'Bebidas', price: 26.01, image: 'https://i.imgur.com/UBekUfq.png' },
  { id: 233, name: 'RUM MONTILLA CARTA OURO 1 L', category: 'Bebidas', price: 26.01, image: 'https://i.imgur.com/Uy6p1cw.png' },
  { id: 234, name: 'SAQUÊ SECO AZUMA KIRIN 600 ML', category: 'Bebidas', price: 16.52, image: 'https://i.imgur.com/luE9tbN.png' },
  { id: 235, name: 'SAQUÊ SECO DOURADO AZUMA KIRIN 740 ML', category: 'Bebidas', price: 33.67, image: 'https://i.imgur.com/LWwdj8D.png' },
  { id: 236, name: 'SAQUÊ SECO DOURADO SAGAE 750 ML', category: 'Bebidas', price: 14.97, image: 'https://i.imgur.com/4Aqncfv.png' },
  { id: 237, name: 'SAQUÊ SECO SENSHI 720 ML', category: 'Bebidas', price: 12.64, image: 'https://i.imgur.com/aYc3Lqw.png' },
  { id: 238, name: 'SAQUÊ SECO SOFT AZUMA KIRIN 740 ML', category: 'Bebidas', price: 25.89, image: 'https://i.imgur.com/z1Oelt1.png' },
  { id: 239, name: 'SCHWEPPES CITRUS LATA 350 ML (PCT 6 LT)', category: 'Bebidas', price: 22.38, image: 'https://i.imgur.com/KgHLyfy.png' },
  { id: 240, name: 'SCHWEPPES CITRUS LEVE EM AÇÚCARES LATA 350 ML (PCT 6 LT)', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/F6trlNs.png' },
  { id: 241, name: 'SODA ANTARCTICA LIMONADA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 38.93, image: 'https://i.imgur.com/2gxTI9r.png' },
  { id: 242, name: 'SODA ANTARCTICA LIMONADA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 53.76, image: 'https://i.imgur.com/W7dFwbW.png' },
  { id: 243, name: 'SODA ANTARCTICA LIMONADA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 55.63, image: 'https://i.imgur.com/LZiwTB9.png' },
  { id: 244, name: 'SODA ANTARCTICA LIMONADA ZERO AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 39.15, image: 'https://i.imgur.com/k0swWts.png' },
  { id: 245, name: 'SPRITE LATA 350 ML (PCT 6 UN)', category: 'Bebidas', price: 22.59, image: 'https://i.imgur.com/IpxT26C.png' },
  { id: 246, name: 'SPRITE LEMON FRESH PET 510 ML (PCT 12 UN)', category: 'Bebidas', price: 37.13, image: 'https://i.imgur.com/WZ8vT5P.png' },
  { id: 247, name: 'SPRITE PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 52.97, image: 'https://i.imgur.com/lRT43O6.png' },
  { id: 248, name: 'STEINHAEGER BECOSA 980 ML', category: 'Bebidas', price: 32.46, image: 'https://i.imgur.com/EePnb5t.png' },
  { id: 249, name: 'SUCO DE TOMATE RAIOLA 1 L', category: 'Bebidas', price: 28.26, image: 'https://i.imgur.com/jgt6Ryc.png' },
  { id: 250, name: 'SUCO DE TOMATE SUPERBOM 1 L', category: 'Bebidas', price: 22.54, image: 'https://i.imgur.com/05nvQUY.png' },
  { id: 251, name: 'SUCO DE UVA TINTO INTEGRAL TETRA PACK AURORA 1,5 L (CX 6 UN)', category: 'Bebidas', price: 122.62, image: 'https://i.imgur.com/9Ow9Exw.png' },
  { id: 252, name: 'SUCO DEL VALLE ABACAXI TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 59.31, image: 'https://i.imgur.com/s0cmP9R.png' },
  { id: 253, name: 'SUCO DEL VALLE CAJU SEM ADIÇÃO DE AÇÚCAR TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 50.61, image: 'https://i.imgur.com/EKbHCAH.png' },
  { id: 254, name: 'SUCO DEL VALLE GOIABA SEM ADIÇÃO DE AÇÚCAR LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23.65, image: 'https://i.imgur.com/RQlw1It.png' },
  { id: 255, name: 'SUCO DEL VALLE LARANJA TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 59.31, image: 'https://i.imgur.com/AyekaBk.png' },
  { id: 256, name: 'SUCO DEL VALLE MANGA LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23.65, image: 'https://i.imgur.com/yzrpMfL.png' },
  { id: 257, name: 'SUCO DEL VALLE MARACUJÁ LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23.65, image: 'https://i.imgur.com/hdPREhV.png' },
  { id: 258, name: 'SUCO DEL VALLE PÊSSEGO LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23.65, image: 'https://i.imgur.com/BEoDePZ.png' },
  { id: 259, name: 'SUCO DEL VALLE UVA LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23.65, image: 'https://i.imgur.com/rv50AIb.png' },
  { id: 260, name: 'SUCO DEL VALLE UVA TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 59.31, image: 'https://i.imgur.com/9Q3fGng.png' },
  { id: 261, name: 'SUCO GUARAVITON AÇAÍ 500 ML (PCT 12 UN)', category: 'Bebidas', price: 30.54, image: 'https://i.imgur.com/lMvumTU.png' },
  { id: 262, name: 'SUCO MAGUARY ABACAXI 500 ML (PCT 12 UN)', category: 'Bebidas', price: 78.43, image: 'https://i.imgur.com/mM74zku.png' },
  { id: 263, name: 'SUCO MAGUARY GOIABA 500 ML (PCT 12 UN)', category: 'Bebidas', price: 78.43, image: 'https://i.imgur.com/B9CQRP1.png' },
  { id: 264, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/NMjfmnp.png' },
  { id: 265, name: 'SUCO MAGUARY LARANJA TETRA PACK 1 L (CX 12 UN)', category: 'Bebidas', price: 74.57, image: 'https://i.imgur.com/YOcvLD3.png' },
  { id: 266, name: 'SUCO MAGUARY MANGA 500 ML (PCT 12 UN)', category: 'Bebidas', price: 78.43, image: 'https://i.imgur.com/3HWjnHM.png' },
  { id: 267, name: 'SUCO MAGUARY MARACUJÁ 500 ML (PCT 12 UN)', category: 'Bebidas', price: 87.04, image: 'https://i.imgur.com/IMi4Jaz.png' },
  { id: 268, name: 'SUCO MAGUARY MARACUJÁ LATA 335 ML (PCT 6 LT)', category: 'Bebidas', price: 22.59, image: 'https://i.imgur.com/OeQqQMM.png' },
  { id: 269, name: 'SUCO MAGUARY MARACUJÁ TETRA PACK 1 L (CX 12 UN)', category: 'Bebidas', price: 74.57, image: 'https://i.imgur.com/wYdnqWk.png' },
  { id: 270, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/GnUifDn.png' },
  { id: 271, name: 'SUCO MAGUARY UVA 500 ML (PCT 12 UN)', category: 'Bebidas', price: 78.43, image: 'https://i.imgur.com/XLgF5Lq.png' },
  { id: 272, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/ThOQSAq.png' },
  { id: 273, name: 'SUCO MAGUARY UVA TETRA PACK 1 L (CX 12 UN)', category: 'Bebidas', price: 73.18, image: 'https://i.imgur.com/CxfSQwD.png' },
  { id: 274, name: 'SUCO PEQUENO MAGUARY MAÇÃ 200 ML (CX 27 UN)', category: 'Bebidas', price: 50.5, image: 'https://i.imgur.com/X1cdcro.png' },
  { id: 275, name: 'SUCO PEQUENO MAGUARY UVA 200 ML (CX 27 UN)', category: 'Bebidas', price: 49.58, image: 'https://i.imgur.com/o9w6Byz.png' },
  { id: 276, name: 'SUKITA LARANJA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 40.96, image: 'https://i.imgur.com/uHsproY.png' },
  { id: 277, name: 'SUKITA LARANJA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 42.19, image: 'https://i.imgur.com/AKSYkOw.png' },
  { id: 278, name: 'SUKITA LIMÃO PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 42.19, image: 'https://i.imgur.com/EIkhTff.png' },
  { id: 279, name: 'SUKITA TUBAÍNA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 41.95, image: 'https://i.imgur.com/aQShp31.png' },
  { id: 280, name: 'TEQUILA JOSE CUERVO ESPECIAL PRATA 750 ML (CX 12 UN)', category: 'Bebidas', price: 103.07, image: 'https://i.imgur.com/oUVvquf.png' },
  { id: 281, name: 'TEQUILA JOSE CUERVO ESPECIAL REPOSADO OURO 750 ML (CX 12 UN)', category: 'Bebidas', price: 103.07, image: 'https://i.imgur.com/jeKWW3U.png' },
  { id: 282, name: 'TUBAÍNA CAMPOS TUTTI FRUTTI PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 31.29, image: 'https://i.imgur.com/WNoODyZ.png' },
  { id: 283, name: 'VINHO ARGENTINO TINTO MEIO SECO MALBEC RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 24.54, image: 'https://i.imgur.com/F9GqjDF.png' },
  { id: 284, name: 'VINHO ARGENTINO TINTO SECO CABERNET SAUVIGNON BENJAMIN NIETO SENETINER 750 ML', category: 'Bebidas', price: 31.36, image: 'https://i.imgur.com/E9641NQ.png' },
  { id: 285, name: 'VINHO ARGENTINO TINTO SECO GATO NEGRO MALBEC SAN PEDRO 750 ML', category: 'Bebidas', price: 27.48, image: 'https://i.imgur.com/zirdW0P.png' },
  { id: 286, name: 'VINHO CHILENO BRANCO SECO CHARDONNAY RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 28.22, image: 'https://i.imgur.com/g9CZJLc.png' },
  { id: 287, name: 'VINHO CHILENO BRANCO SECO FINO SAUVIGNON BLANC CHILANO 750 ML', category: 'Bebidas', price: 20.91, image: 'https://i.imgur.com/owIp7Nx.png' },
  { id: 288, name: 'VINHO CHILENO BRANCO SECO SAUVIGNON BLANC RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 28.22, image: 'https://i.imgur.com/a7vJedz.png' },
  { id: 289, name: 'VINHO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON MERLOT RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 28.22, image: 'https://i.imgur.com/arjVBDL.png' },
  { id: 290, name: 'VINHO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 24.54, image: 'https://i.imgur.com/I2KzRC5.png' },
  { id: 291, name: 'VINHO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 28.22, image: 'https://i.imgur.com/pmC1ifB.png' },
  { id: 292, name: 'VINHO CHILENO TINTO MEIO SECO CARMENÉRE RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 24.54, image: 'https://i.imgur.com/8rZ7chL.png' },
  { id: 293, name: 'VINHO CHILENO TINTO MEIO SECO CARMENÉRE RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 28.22, image: 'https://i.imgur.com/kfw8gkT.png' },
  { id: 294, name: 'VINHO CHILENO TINTO MEIO SECO GATO NEGRO CABERNET SAUVIGNON SAN PEDRO 750 ML', category: 'Bebidas', price: 29.45, image: 'https://i.imgur.com/rS3hvho.png' },
  { id: 295, name: 'VINHO CHILENO TINTO MEIO SECO GATO NEGRO MERLOT SAN PEDRO 750 ML', category: 'Bebidas', price: 29.45, image: 'https://i.imgur.com/E62x5V6.png' },
  { id: 296, name: 'VINHO CHILENO TINTO MEIO SECO MERLOT RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 24.54, image: 'https://i.imgur.com/z154E3m.png' },
  { id: 297, name: 'VINHO CHILENO TINTO SECO CABERNET SAUVIGNON CASILLERO DEL DIABLO 750 ML', category: 'Bebidas', price: 42.95, image: 'https://i.imgur.com/muoEyM2.png' },
  { id: 298, name: 'VINHO CHILENO TINTO SECO FINO CABERNET SAUVIGNON CHILANO 750 ML', category: 'Bebidas', price: 20.91, image: 'https://i.imgur.com/r23kHQ5.png' },
  { id: 299, name: 'VINHO CHILENO TINTO SECO FINO CARMENÉRE CHILANO 750 ML', category: 'Bebidas', price: 20.91, image: 'https://i.imgur.com/7VfNhwx.png' },
  { id: 300, name: 'VINHO CHILENO TINTO SECO FINO MALBEC CHILANO 750 ML', category: 'Bebidas', price: 20.91, image: 'https://i.imgur.com/3DAWmyN.png' },
  { id: 301, name: 'VINHO CHILENO TINTO SECO MALBEC CASILLERO DEL DIABLO 750 ML', category: 'Bebidas', price: 42.95, image: 'https://i.imgur.com/dVFLBxV.png' },
  { id: 302, name: 'VINHO ESPANHOL TINTO SECO FINO ORO TEMPRANILLO PATA NEGRA 750 ML', category: 'Bebidas', price: 45.63, image: 'https://i.imgur.com/i5dk82Y.png' },
  { id: 303, name: 'VINHO GRANDE NACIONAL TINTO SECO SANTOMÉ 1 L', category: 'Bebidas', price: 18.33, image: 'https://i.imgur.com/QltyKMJ.png' },
  { id: 304, name: 'VINHO GRANDE NACIONAL TINTO SUAVE SANTOMÉ 1 L', category: 'Bebidas', price: 18.33, image: 'https://i.imgur.com/Rf0YjSk.png' },
  { id: 305, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/FIiSKeS.png' },
  { id: 306, name: 'VINHO NACIONAL BRANCO "SECO" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 59.88, image: 'https://i.imgur.com/5tAiOz6.png' },
  { id: 307, name: 'VINHO NACIONAL BRANCO "SUAVE" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 59.88, image: 'https://i.imgur.com/s2Z0tmX.png' },
  { id: 308, name: 'VINHO NACIONAL BRANCO SECO ALMADÉN RIESLING 750 ML', category: 'Bebidas', price: 28.69, image: 'https://i.imgur.com/t1qleCN.png' },
  { id: 309, name: 'VINHO NACIONAL BRANCO SECO RANDON 4,6 L (CX 2 GL)', category: 'Bebidas', price: 100.12, image: 'https://i.imgur.com/F1Wd5Ny.png' },
  { id: 310, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/IDSJcp0.png' },
  { id: 311, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/XayyFOJ.png' },
  { id: 312, name: 'VINHO NACIONAL TINTO "SECO" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 59.88, image: 'https://i.imgur.com/GYIH42G.png' },
  { id: 313, name: 'VINHO NACIONAL TINTO "SUAVE" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 59.88, image: 'https://i.imgur.com/4lbxAan.png' },
  { id: 314, name: 'VINHO NACIONAL TINTO SECO CABERNET SAUVIGNON ALMADÉN 750 ML', category: 'Bebidas', price: 28.69, image: 'https://i.imgur.com/cG4kAzg.png' },
  { id: 315, name: 'VINHO NACIONAL TINTO SECO CABERNET SAUVIGNON MERLOT SELEÇÃO MIOLO 750 ML', category: 'Bebidas', price: 34.7, image: 'https://i.imgur.com/9fPsQum.png' },
  { id: 316, name: 'VINHO NACIONAL TINTO SECO JURUBEBA LEÃO DO NORTE 600 ML', category: 'Bebidas', price: 13.74, image: 'https://i.imgur.com/OF0f78k.png' },
  { id: 317, name: 'VINHO NACIONAL TINTO SECO RANDON 4,6 L (CX 2 GL)', category: 'Bebidas', price: 100.12, image: 'https://i.imgur.com/XXLEr9i.png' },
  { id: 318, name: 'VINHO NACIONAL TINTO SUAVE CABERNET ALMADÉN 750 ML', category: 'Bebidas', price: 23.24, image: 'https://i.imgur.com/GoO9kU6.png' },
  { id: 319, name: 'VINHO NACIONAL TINTO SUAVE COUNTRY WINE 750 ML', category: 'Bebidas', price: 13.87, image: 'https://i.imgur.com/eDTDDsp.png' },
  { id: 320, name: 'VINHO NACIONAL TINTO SUAVE RANDON 4,6 L (CX 2 GL)', category: 'Bebidas', price: 100.12, image: 'https://i.imgur.com/BMlit53.png' },
  { id: 321, name: 'VINHO NACIONAL TINTO SUAVE SANTOMÉ 750 ML', category: 'Bebidas', price: 13.31, image: 'https://i.imgur.com/m5P1ktV.png' },
  { id: 322, name: 'VINHO PEQUENO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON RESERVADO SANTA HELENA 375 ML', category: 'Bebidas', price: 18.78, image: 'https://i.imgur.com/kAUOXvr.png' },
  { id: 323, name: 'VINHO PEQUENO PORTUGUÊS TINTO SECO PERIQUITA 375 ML', category: 'Bebidas', price: 33.74, image: 'https://i.imgur.com/KVklwxY.png' },
  { id: 324, name: 'VINHO PORTUGUÊS TINTO SECO CASAL GARCIA 750 ML', category: 'Bebidas', price: 41.52, image: 'https://i.imgur.com/I0iF5Yz.png' },
  { id: 325, name: 'VINHO PORTUGUÊS TINTO SECO PERIQUITA 750 ML', category: 'Bebidas', price: 52.76, image: 'https://i.imgur.com/XIdUoxF.png' },
  { id: 326, name: 'VINHO PORTUGUÊS VERDE MEIO SECO CASAL GARCIA 750 ML', category: 'Bebidas', price: 49.08, image: 'https://i.imgur.com/Avj6Hsn.png' },
  { id: 327, name: 'VODKA ABSOLUT 1 L', category: 'Bebidas', price: 76.07, image: 'https://i.imgur.com/UN9QxZ9.png' },
  { id: 328, name: 'VODKA ASKOV FRUTAS VERMELHAS 900 ML', category: 'Bebidas', price: 14.85, image: 'https://i.imgur.com/fanaQxe.png' },
  { id: 329, name: 'VODKA ASKOV MARACUJÁ 900 ML', category: 'Bebidas', price: 14.85, image: 'https://i.imgur.com/kgjmHed.png' },
  { id: 330, name: 'VODKA ASKOV TRADICIONAL 900 ML', category: 'Bebidas', price: 14.85, image: 'https://i.imgur.com/bwqDBVm.png' },
  { id: 331, name: 'VODKA BALALAIKA 1 L', category: 'Bebidas', price: 14.6, image: 'https://i.imgur.com/qawFpyA.png' },
  { id: 332, name: 'VODKA BELVEDERE 700 ML', category: 'Bebidas', price: 116.57, image: 'https://i.imgur.com/EsoI3u2.png' },
  { id: 333, name: 'VODKA CIROC 750 ML', category: 'Bebidas', price: 132.52, image: 'https://i.imgur.com/ZmARYuX.png' },
  { id: 334, name: 'VODKA CIROC RED BERRY 750 ML', category: 'Bebidas', price: 175.46, image: 'https://i.imgur.com/b02eBM4.png' },
  { id: 335, name: 'VODKA KETEL ONE 1 L', category: 'Bebidas', price: 84.29, image: 'https://i.imgur.com/yxijXUc.png' },
  { id: 336, name: 'VODKA ORLOFF 1 L', category: 'Bebidas', price: 25.77, image: 'https://i.imgur.com/nx41D4y.png' },
  { id: 337, name: 'VODKA PEQUENA SMIRNOFF 600 ML', category: 'Bebidas', price: 24.42, image: 'https://i.imgur.com/GnWxVJs.png' },
  { id: 338, name: 'VODKA SKYY 980 ML', category: 'Bebidas', price: 36.81, image: 'https://i.imgur.com/GoJv5wG.png' },
  { id: 339, name: 'VODKA SMIRNOFF 998 ML', category: 'Bebidas', price: 33.13, image: 'https://i.imgur.com/9209L4f.png' },
  { id: 340, name: 'VODKA SMIRNOFF ICE LIMÃO LONG NECK 275 ML (PCT 24 UN)', category: 'Bebidas', price: 159.02, image: 'https://i.imgur.com/6QO1F7D.png' },
  { id: 341, name: 'WHISKY BALLANTINES 12 ANOS 1 L', category: 'Bebidas', price: 134.97, image: 'https://i.imgur.com/uMtCYII.png' },
  { id: 342, name: 'WHISKY BALLANTINES FINEST 8 ANOS 1 L', category: 'Bebidas', price: 73.62, image: 'https://i.imgur.com/5WnMc01.png' },
  { id: 343, name: 'WHISKY BELL´S 700 ML', category: 'Bebidas', price: 36.81, image: 'https://i.imgur.com/NCswi6l.png' },
  { id: 344, name: 'WHISKY BLACK WHITE 1 L', category: 'Bebidas', price: 80.98, image: 'https://i.imgur.com/27YyrUh.png' },
  { id: 345, name: 'WHISKY BUCHANAN´S 12 ANOS 1 L', category: 'Bebidas', price: 176.94, image: 'https://i.imgur.com/Cen9UaX.png' },
  { id: 346, name: 'WHISKY CHIVAS REGAL 12 ANOS 1 L', category: 'Bebidas', price: 116.57, image: 'https://i.imgur.com/dZ2o9VB.png' },
  { id: 347, name: 'WHISKY JACK DANIEL´S TENNESSEE FIRE 1 L', category: 'Bebidas', price: 138.65, image: 'https://i.imgur.com/D0wEl7Y.png' },
  { id: 348, name: 'WHISKY JACK DANIEL´S TENNESSEE HONEY 1 L', category: 'Bebidas', price: 142.33, image: 'https://i.imgur.com/jDqEJAL.png' },
  { id: 349, name: 'WHISKY JACK DANIEL´S TENNESSEE OLD No.7 1 L', category: 'Bebidas', price: 142.33, image: 'https://i.imgur.com/6bNFOJD.png' },
  { id: 350, name: 'WHISKY JAMESON 750 ML', category: 'Bebidas', price: 99.39, image: 'https://i.imgur.com/FquHmxr.png' },
  { id: 351, name: 'WHISKY JIM BEAM 1 L', category: 'Bebidas', price: 90.8, image: 'https://i.imgur.com/4XWSGqj.png' },
  { id: 352, name: 'WHISKY JOHNNIE WALKER BLACK LABEL 12 ANOS 1 L', category: 'Bebidas', price: 175.45, image: 'https://i.imgur.com/zGTHglJ.png' },
  { id: 353, name: 'WHISKY JOHNNIE WALKER BLUE LABEL 750 ML', category: 'Bebidas', price: 1022.48, image: 'https://i.imgur.com/INPxSsa.png' },
  { id: 354, name: 'WHISKY JOHNNIE WALKER DOUBLE BLACK 1 L', category: 'Bebidas', price: 202.46, image: 'https://i.imgur.com/vlemYPB.png' },
  { id: 355, name: 'WHISKY JOHNNIE WALKER GOLD LABEL RESERVE 750 ML', category: 'Bebidas', price: 233.13, image: 'https://i.imgur.com/H6dUMNJ.png' },
  { id: 356, name: 'WHISKY JOHNNIE WALKER RED LABEL 1 L', category: 'Bebidas', price: 86.5, image: 'https://i.imgur.com/ewkP00y.png' },
  { id: 357, name: 'WHISKY NATU NOBILIS 1 L', category: 'Bebidas', price: 37.36, image: 'https://i.imgur.com/doUn3b7.png' },
  { id: 358, name: 'WHISKY OLD EIGHT 900 ML', category: 'Bebidas', price: 30.43, image: 'https://i.imgur.com/jJD0hXU.png' },
  { id: 359, name: 'WHISKY OLD PARR 12 ANOS 1 L', category: 'Bebidas', price: 144.79, image: 'https://i.imgur.com/yYVicOK.png' },
  { id: 360, name: 'WHISKY PASSPORT 1 L', category: 'Bebidas', price: 49.08, image: 'https://i.imgur.com/s5btt6Y.png' },
  { id: 361, name: 'WHISKY WHITE HORSE 1 L', category: 'Bebidas', price: 67.49, image: 'https://i.imgur.com/dZ9JEMw.png' },
  { id: 362, name: 'XAROPE MONIN AMORA 700 ML', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/QTVEyyA.png' },
  { id: 363, name: 'XAROPE MONIN CURAÇAU BLUE 700 ML', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/xdFVuCl.png' },
  { id: 364, name: 'XAROPE MONIN FRAMBOESA 700 ML', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/mk7Hr9o.png' },
  { id: 365, name: 'XAROPE MONIN GENGIBRE 700 ML', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/fbkqDaK.png' },
  { id: 366, name: 'XAROPE MONIN GRENADINE 700 ML', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/AOeAZf8.png' },
  { id: 367, name: 'XAROPE MONIN LIMÃO SICILIANO 700 ML', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/9eZcYDs.png' },
  { id: 368, name: 'XAROPE MONIN MAÇÃ VERDE 700 ML', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/QNB6ZWt.png' },
  { id: 369, name: 'XAROPE MONIN MARACUJÁ 700 ML', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/0ubxvVz.png' },
  { id: 370, name: 'XAROPE MONIN MORANGO 700 ML', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/uQOucGW.png' },
  { id: 371, name: 'XAROPE MONIN TANGERINA 700 ML', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/MkTZ7Es.png' },
  { id: 372, name: 'ERVILHA BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 77.39, image: 'https://i.imgur.com/3wIScUR.png' },
  { id: 373, name: 'ERVILHA GRANDE BONARE GOIÁS VERDE 1,7 KILO', category: 'Conservas/Enlatados', price: 20.6, image: 'https://i.imgur.com/ul6DuD3.png' },
  { id: 374, name: 'ERVILHA GRANDE QUERO 1,7 KILO', category: 'Conservas/Enlatados', price: 23.1, image: 'https://i.imgur.com/IlvVdGu.png' },
  { id: 375, name: 'ERVILHA PEQUENA DA TERRINHA 500 G', category: 'Conservas/Enlatados', price: 6.51, image: 'https://i.imgur.com/lR3OuYW.png' },
  { id: 376, name: 'ERVILHA QUERO 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 100.05, image: 'https://i.imgur.com/frVHAo5.png' },
  { id: 377, name: 'EXTRATO DE TOMATE AJINOMOTO 2 KILO', category: 'Conservas/Enlatados', price: 29.82, image: 'https://i.imgur.com/2JNqOPS.png' },
  { id: 378, name: 'EXTRATO DE TOMATE BONARE GOIÁS VERDE 1,7 KILO', category: 'Conservas/Enlatados', price: 33.1, image: 'https://i.imgur.com/lOal3dh.png' },
  { id: 379, name: 'EXTRATO DE TOMATE BONARE GOIÁS VERDE 4 KILO', category: 'Conservas/Enlatados', price: 31.82, image: 'https://i.imgur.com/mOy0cJ2.png' },
  { id: 380, name: 'EXTRATO DE TOMATE BONARE GOURMET SUPER CONCENTRADO GOIÁS VERDE 4 KILO', category: 'Conservas/Enlatados', price: 40.91, image: 'https://i.imgur.com/35zZr3O.png' },
  { id: 381, name: 'EXTRATO DE TOMATE EKMA 1,7 KILO', category: 'Conservas/Enlatados', price: 16.83, image: 'https://i.imgur.com/xl5LIKe.png' },
  { id: 382, name: 'EXTRATO DE TOMATE ELEFANTE 1,04 KILO (CX 12 UN)', category: 'Conservas/Enlatados', price: 72.75, image: 'https://i.imgur.com/SxHmAyf.png' },
  { id: 383, name: 'EXTRATO DE TOMATE ELEFANTE 1,7 KILO', category: 'Conservas/Enlatados', price: 32.13, image: 'https://i.imgur.com/Ne5Mb0J.png' },
  { id: 384, name: 'EXTRATO DE TOMATE QUERO 1,020 KILO (CX 12 BAG)', category: 'Conservas/Enlatados', price: 105.09, image: 'https://i.imgur.com/zoMgV8d.png' },
  { id: 385, name: 'MILHO BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 80.41, image: 'https://i.imgur.com/1bTPtUp.png' },
  { id: 386, name: 'MILHO GRANDE BONARE GOIÁS VERDE 1,7 KILO', category: 'Conservas/Enlatados', price: 23.93, image: 'https://i.imgur.com/SSRegsO.png' },
  { id: 387, name: 'MILHO GRANDE FUGINI 1,7 KILO', category: 'Conservas/Enlatados', price: 22.43, image: 'https://i.imgur.com/mbne2Xm.png' },
  { id: 388, name: 'MILHO GRANDE PREDILECTA 1,7 KILO', category: 'Conservas/Enlatados', price: 20.54, image: 'https://i.imgur.com/mLGdRWa.png' },
  { id: 389, name: 'MILHO GRANDE QUERO 1,7 KILO', category: 'Conservas/Enlatados', price: 23.56, image: 'https://i.imgur.com/8quHCxn.png' },
  { id: 390, name: 'MILHO QUERO 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 104.08, image: 'https://i.imgur.com/FHc0azh.png' },
  { id: 391, name: 'MOLHO ALHO CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 12.64, image: 'https://i.imgur.com/7K8M7tP.png' },
  { id: 392, name: 'MOLHO BACONNAISE JUNIOR 1,1 KILO', category: 'Conservas/Enlatados', price: 45.54, image: 'https://i.imgur.com/PCuMB6E.png' },
  { id: 393, name: 'MOLHO BARBECUE CEPÊRA 1,01 KILO', category: 'Conservas/Enlatados', price: 14.89, image: 'https://i.imgur.com/7AoOrGq.png' },
  { id: 394, name: 'MOLHO BARBECUE CEPÊRA 3,5 KILO', category: 'Conservas/Enlatados', price: 41.34, image: 'https://i.imgur.com/QkD94Sj.png' },
  { id: 395, name: 'MOLHO BARBECUE EKMA 3,5 KILO', category: 'Conservas/Enlatados', price: 29.57, image: 'https://i.imgur.com/bs585jW.png' },
  { id: 396, name: 'MOLHO BARBECUE HEINZ 2 KILO', category: 'Conservas/Enlatados', price: 46.74, image: 'https://i.imgur.com/KaBbp0D.png' },
  { id: 397, name: 'MOLHO BARBECUE SACHÊ CEPÊRA 7 G (CX 175 UN)', category: 'Conservas/Enlatados', price: 32.6, image: 'https://i.imgur.com/UYmhq4H.png' },
  { id: 398, name: 'MOLHO BARBECUE SACHÊ FUGINI 7 G (CX 144 UN)', category: 'Conservas/Enlatados', price: 17.4, image: 'https://i.imgur.com/x6cdNQT.png' },
  { id: 399, name: 'MOLHO BECHAMEL AJINOMOTO 1 KILO', category: 'Conservas/Enlatados', price: 34.19, image: 'https://i.imgur.com/Soa8iZ5.png' },
  { id: 400, name: 'MOLHO BILLY & JACK ORIGINAL KISABOR 1,01 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 95.85, image: 'https://i.imgur.com/08T5uiQ.png' },
  { id: 401, name: 'MOLHO BILLY & JACK TASTY KISABOR 1,01 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 97.2, image: 'https://i.imgur.com/GSOAGbP.png' },
  { id: 402, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://i.imgur.com/IVvnUhJ.png' },
  { id: 403, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://i.imgur.com/GG7t3LH.png' },
  { id: 404, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://i.imgur.com/bXNSTN1.png' },
  { id: 405, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://i.imgur.com/bbpYoI2.png' },
  { id: 406, name: 'MOLHO CHIPOTLE JUNIOR 1,01 KILO', category: 'Conservas/Enlatados', price: 43.32, image: 'https://i.imgur.com/NAZnNtl.png' },
  { id: 407, name: 'MOLHO DE PIMENTA VERMELHA CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 10.13, image: 'https://i.imgur.com/WSquH7W.png' },
  { id: 408, name: 'MOLHO DE PIMENTA VERMELHA EKMA 1,01 L', category: 'Conservas/Enlatados', price: 16.54, image: 'https://i.imgur.com/F0OKt2l.png' },
  { id: 409, name: 'MOLHO DE PIMENTA VERMELHA KISABOR 150 ML (CX 24 UN)', category: 'Conservas/Enlatados', price: 40.85, image: 'https://i.imgur.com/h4F2i7X.png' },
  { id: 410, name: 'MOLHO DE PIMENTA VERMELHA MC ILHENNY TABASCO 60 ML (CX 12 VD)', category: 'Conservas/Enlatados', price: 261.24, image: 'https://i.imgur.com/OK4IJf4.png' },
  { id: 411, name: 'MOLHO DE PIMENTA VERMELHA SACHÊ CEPÊRA 5 G (CX 175 UN)', category: 'Conservas/Enlatados', price: 27.38, image: 'https://i.imgur.com/dq9ZRxS.png' },
  { id: 412, name: 'MOLHO DE PIMENTA VERMELHA SACHÊ PREDILECTA 3 G (CX 144 UN)', category: 'Conservas/Enlatados', price: 15.07, image: 'https://i.imgur.com/9nngGIL.png' },
  { id: 413, name: 'MOLHO DE TOMATE PIZZA BONARE GOIÁS VERDE 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 58.62, image: 'https://i.imgur.com/uBcDotf.png' },
  { id: 414, name: 'MOLHO DE TOMATE PIZZA CEPÊRA MAMMA D ORO 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 105.57, image: 'https://i.imgur.com/DUDvx40.png' },
  { id: 415, name: 'MOLHO DE TOMATE REFOGADO TRADICIONAL BONARE GOURMET GOIÁS VERDE 1,02 KILO (CX 12 BAG)', category: 'Conservas/Enlatados', price: 62.11, image: 'https://i.imgur.com/BXBYsmg.png' },
  { id: 416, name: 'MOLHO DE TOMATE REFOGADO TRADICIONAL EKMA 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 61.15, image: 'https://i.imgur.com/XEcVlpE.png' },
  { id: 417, name: 'MOLHO DE TOMATE TRADICIONAL BONARE GOIÁS VERDE 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 58.62, image: 'https://i.imgur.com/ejc99UV.png' },
  { id: 418, name: 'MOLHO DE TOMATE TRADICIONAL FUGINI 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 56.31, image: 'https://i.imgur.com/KW79IS9.png' },
  { id: 419, name: 'MOLHO DE TOMATE TRADICIONAL HEINZ 1,02 KILO (CX 12 BAG)', category: 'Conservas/Enlatados', price: 92.25, image: 'https://i.imgur.com/7VWOo7u.png' },
  { id: 420, name: 'MOLHO DE TOMATE TRADICIONAL MAMMA D ORO CEPÊRA 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 95.97, image: 'https://i.imgur.com/nk9LGQ5.png' },
  { id: 421, name: 'MOLHO DE TOMATE TRADICIONAL POMAROLA 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 63.59, image: 'https://i.imgur.com/IFdiFiA.png' },
  { id: 422, name: 'MOLHO DE TOMATE TRADICIONAL QUERO BAG 2 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 62.31, image: 'https://i.imgur.com/lK2hfq1.png' },
  { id: 423, name: 'MOLHO DEMI GLACE AJINOMOTO 1 KILO', category: 'Conservas/Enlatados', price: 58.67, image: 'https://i.imgur.com/kdzgQzp.png' },
  { id: 424, name: 'MOLHO DEMI GLACE JUNIOR 500 G', category: 'Conservas/Enlatados', price: 39.75, image: 'https://i.imgur.com/8GSaO53.png' },
  { id: 425, name: 'MOLHO INGLÊS CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 7.27, image: 'https://i.imgur.com/oUjlLmF.png' },
  { id: 426, name: 'MOLHO ITALIAN SACHÊ JUNIOR 18 G (CX 180 UN)', category: 'Conservas/Enlatados', price: 105.4, image: 'https://i.imgur.com/NPCpFGK.png' },
  { id: 427, name: 'MOLHO ITALIANO SACHÊ LANCHERO 8 ML (CX 152 UN)', category: 'Conservas/Enlatados', price: 20.44, image: 'https://i.imgur.com/4EpWJLO.png' },
  { id: 428, name: 'MOLHO PARA PIZZA EKMA 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 63.59, image: 'https://i.imgur.com/S6pbDfO.png' },
  { id: 429, name: 'MOLHO PIMENTA SACHÊ EKMA 3 ML (CX 174 UN)', category: 'Conservas/Enlatados', price: 16.54, image: 'https://i.imgur.com/X1IDjL8.png' },
  { id: 430, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://i.imgur.com/9TFurF3.png' },
  { id: 431, name: 'MOLHO SALADA CAESAR CASTELO 236 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 100.49, image: 'https://i.imgur.com/cQABaT4.png' },
  { id: 432, name: 'MOLHO SALADA CAESAR KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 61.69, image: 'https://i.imgur.com/id6NPgs.png' },
  { id: 433, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://i.imgur.com/fcRQasL.png' },
  { id: 434, name: 'MOLHO SALADA ITALIAN SACHÊ EKMA 18 G (CX 42 UN)', category: 'Conservas/Enlatados', price: 22.76, image: 'https://i.imgur.com/WxwfTE3.png' },
  { id: 435, name: 'MOLHO SALADA ITALIANO CASTELO 236 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 100.49, image: 'https://i.imgur.com/3ZZZ6ef.png' },
  { id: 436, name: 'MOLHO SALADA ITALIANO KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 61.69, image: 'https://i.imgur.com/gjZFSdU.png' },
  { id: 437, name: 'MOLHO SALADA LIMÃO CASTELO 236 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 100.49, image: 'https://i.imgur.com/jhOhJxC.png' },
  { id: 438, name: 'MOLHO SALADA LIMÃO KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 61.69, image: 'https://i.imgur.com/v7XkgAc.png' },
  { id: 439, name: 'MOLHO SALADA PARMESÃO KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 61.69, image: 'https://i.imgur.com/OL1BiGt.png' },
  { id: 440, name: 'MOLHO SALADA ROSE KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 61.69, image: 'https://i.imgur.com/CBY3dFK.png' },
  { id: 441, name: 'MOLHO SHOYU CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 11.84, image: 'https://i.imgur.com/U8cDwP5.png' },
  { id: 442, name: 'MOLHO SHOYU EKMA 1,01 L', category: 'Conservas/Enlatados', price: 8.02, image: 'https://i.imgur.com/xrDnZzl.png' },
  { id: 443, name: 'MOLHO SHOYU GRANDE EKMA 3,1 L', category: 'Conservas/Enlatados', price: 22.77, image: 'https://i.imgur.com/quavfrl.png' },
  { id: 444, name: 'MOLHO SHOYU MÉDIO MITSUWA 3,1 L', category: 'Conservas/Enlatados', price: 34.8, image: 'https://i.imgur.com/2yagSFv.png' },
  { id: 445, name: 'MOLHO SHOYU PONZAN 5 L', category: 'Conservas/Enlatados', price: 25.26, image: 'https://i.imgur.com/6yrhEhD.png' },
  { id: 446, name: 'MOLHO SHOYU PREMIUM CEPÊRA 5 L', category: 'Conservas/Enlatados', price: 60.18, image: 'https://i.imgur.com/j7umJbu.png' },
  { id: 447, name: 'MOLHO SHOYU PREMIUM MITSUWA 900 ML', category: 'Conservas/Enlatados', price: 13.49, image: 'https://i.imgur.com/VEq4d2R.png' },
  { id: 448, name: 'MOLHO SHOYU SACHÊ EKMA 8 ML (CX 96 UN)', category: 'Conservas/Enlatados', price: 17.14, image: 'https://i.imgur.com/OgRUzk1.png' },
  { id: 449, name: 'MOLHO SHOYU SATIS AJINOMOTO 5 L', category: 'Conservas/Enlatados', price: 88.76, image: 'https://i.imgur.com/5iq8XuY.png' },
  { id: 450, name: 'MOLHO SHOYU SUAVE MITSUWA 900 ML', category: 'Conservas/Enlatados', price: 13.03, image: 'https://i.imgur.com/2pxpYYP.png' },
  { id: 451, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://i.imgur.com/87NdPyv.png' },
  { id: 452, name: 'MOLHO TÁRTARO FOOD SERVICE KISABOR 1,01', category: 'Conservas/Enlatados', price: 16.36, image: 'https://i.imgur.com/l4esqN6.png' },
  { id: 453, name: 'POLPA DE TOMATE QUERO 1,050 KILO (CX 12 UN)', category: 'Conservas/Enlatados', price: 103.25, image: 'https://i.imgur.com/BPGayn9.png' },
  { id: 454, name: 'SELETA DE LEGUMES BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 97.39, image: 'https://i.imgur.com/co6HCi5.png' },
  { id: 455, name: 'TOMATE PELADO INTEIRO ARCO BELLO 2,5 KILO', category: 'Conservas/Enlatados', price: 36.55, image: 'https://i.imgur.com/l8bzSe6.png' },
  { id: 456, name: 'TOMATE PELADO INTEIRO OLÉ 2,5 KILO', category: 'Conservas/Enlatados', price: 24.01, image: 'https://i.imgur.com/O7TXDdz.png' },
  { id: 457, name: 'TOMATE PELADO INTEIRO PREDILECTA 2,5 KILO', category: 'Conservas/Enlatados', price: 24.86, image: 'https://i.imgur.com/onXqa9f.png' },
  { id: 458, name: 'ASAS DE FRANGO CONGELADAS JUSSARA (CX 20 KILO)', category: 'Derivados de Ave', price: 200.1, image: 'https://i.imgur.com/ihltMhs.png' },
  { id: 459, name: 'BLANQUET DE PERU SADIA 1,75 KILO', category: 'Derivados de Ave', price: 83.2, image: 'https://i.imgur.com/Fh1EWGH.png' },
  { id: 460, name: 'BURGER CHICKEN DE FRANGO CONGELADO EMPANADO SUPREME SEARA 2 KILO (CX 3 PCT)', category: 'Derivados de Ave', price: 171.03, image: 'https://i.imgur.com/ik4tNlF.png' },
  { id: 461, name: 'CHICKEN DE FRANGO CONGELADO EMPANADO BAITA 1 KILO (CX 10 PCT)', category: 'Derivados de Ave', price: 177.48, image: 'https://i.imgur.com/lJOVwVB.png' },
  { id: 462, name: 'CHICKEN DE FRANGO CONGELADO EMPANADO SUPREME SEARA 2,5 KILO (CX 2 PCT)', category: 'Derivados de Ave', price: 119.13, image: 'https://i.imgur.com/0qz3l71.png' },
  { id: 463, name: 'CLARA DE OVO PASTEURIZADA RESFRIADA ASA 1 KILO', category: 'Derivados de Ave', price: 26.39, image: 'https://i.imgur.com/EeoX9g6.png' },
  { id: 464, name: 'CLARA DE OVO PASTEURIZADA RESFRIADA FLEISCHEGGS 1 KILO', category: 'Derivados de Ave', price: 33.41, image: 'https://i.imgur.com/KkoNVqR.png' },
  { id: 465, name: 'CORAÇÃO DE FRANGO CONGELADO DIPLOMATA (CX 12 KILO)', category: 'Derivados de Ave', price: 440.77, image: 'https://i.imgur.com/eUlCWkL.png' },
  { id: 466, name: 'CORAÇÃO DE FRANGO CONGELADO ITABOM 1 KILO (CX 18 KILO)', category: 'Derivados de Ave', price: 353.38, image: 'https://i.imgur.com/DhbO6oe.png' },
  { id: 467, name: 'COXAS E SOBRECOXAS DE FRANGO CONGELADAS COM OSSO A GOSTO (CX 20 KILO)', category: 'Derivados de Ave', price: 184.05, image: 'https://i.imgur.com/lwkUef8.png' },
  { id: 468, name: 'COXAS E SOBRECOXAS DE FRANGO CONGELADAS COM OSSO MIRA (CX 20 KILO)', category: 'Derivados de Ave', price: 188.96, image: 'https://i.imgur.com/QBKUEKz.png' },
  { id: 469, name: 'COXAS E SOBRECOXAS DE FRANGO CONGELADAS COM OSSO ROSAVES (CX 18 KILO)', category: 'Derivados de Ave', price: 155.14, image: 'https://i.imgur.com/RlP3hDC.png' },
  { id: 470, name: 'COXAS E SOBRECOXAS DE FRANGO TEMPERADAS CONGELADAS COM OSSO FRANGÃO FOODS (CX 20 KILO)', category: 'Derivados de Ave', price: 152.88, image: 'https://i.imgur.com/N1jT29b.png' },
  { id: 471, name: 'COXINHAS DAS ASAS DE FRANGO CONGELADAS CANÇÃO (CX 20 KILO)', category: 'Derivados de Ave', price: 247.85, image: 'https://i.imgur.com/hOQixMQ.png' },
  { id: 472, name: 'COXINHAS DAS ASAS DE FRANGO CONGELADAS GUIBON (CX 18 KILO)', category: 'Derivados de Ave', price: 234.64, image: 'https://i.imgur.com/XXzI2qS.png' },
  { id: 473, name: 'FILÉ DE COXAS E SOBRECOXAS DE FRANGO CONGELADO ABR (CX 20 KILO)', category: 'Derivados de Ave', price: 285.89, image: 'https://i.imgur.com/Uo2PAUS.png' },
  { id: 474, name: 'FILÉ DE PEITO DE FRANGO CONGELADO COZIDO DESFIADO E TEMPERADO PIF PAF 4 KILO (CX 4 PCT)', category: 'Derivados de Ave', price: 442.08, image: 'https://i.imgur.com/tiJeucr.png' },
  { id: 475, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE COM SASSAMI A GOSTO (CX 20 KILO)', category: 'Derivados de Ave', price: 353.86, image: 'https://i.imgur.com/pYldWm1.png' },
  { id: 476, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE COM SASSAMI ABR (CX 20 KILO)', category: 'Derivados de Ave', price: 369.68, image: 'https://i.imgur.com/KoCj919.png' },
  { id: 477, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE COM SASSAMI JUSSARA (CX 20 KILO)', category: 'Derivados de Ave', price: 345.43, image: 'https://i.imgur.com/ExVQ211.png' },
  { id: 478, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE SEM SASSAMI CANÇÃO (CX 20 KILO)', category: 'Derivados de Ave', price: 365.58, image: 'https://i.imgur.com/WdKYiGc.png' },
  { id: 479, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE SEM SASSAMI PIONEIRO (CX 20 KILO)', category: 'Derivados de Ave', price: 329.14, image: 'https://i.imgur.com/wOJMxjy.png' },
  { id: 480, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE SEM SASSAMI RICO (CX 20 KILO)', category: 'Derivados de Ave', price: 317.32, image: 'https://i.imgur.com/czNyNiW.png' },
  { id: 481, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO AURORA 1 KILO (CX 16 PCT)', category: 'Derivados de Ave', price: 292.11, image: 'https://i.imgur.com/rl9nafv.png' },
  { id: 482, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO CANÇÃO (CX 20 KILO)', category: 'Derivados de Ave', price: 369.2, image: 'https://i.imgur.com/ZL0PqbF.png' },
  { id: 483, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO JAGUÁ 1 KILO (CX 20 PCT)', category: 'Derivados de Ave', price: 320.94, image: 'https://i.imgur.com/ETVwGME.png' },
  { id: 484, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO PERDIGÃO 1 KILO (CX 16 PCT)', category: 'Derivados de Ave', price: 333.68, image: 'https://i.imgur.com/Axs06IH.png' },
  { id: 485, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO SOMAVE 1 KILO (CX 18 PCT)', category: 'Derivados de Ave', price: 322.81, image: 'https://i.imgur.com/R41ZNy4.png' },
  { id: 486, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO TEMPERADOS E EMPANADOS BAITA 1 KILO (CX 10 PCT)', category: 'Derivados de Ave', price: 264.39, image: 'https://i.imgur.com/vr3Ams7.png' },
  { id: 487, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO TEMPERADOS E EMPANADOS LAR 1,5 KILO (CX 4 PCT)', category: 'Derivados de Ave', price: 157.19, image: 'https://i.imgur.com/Oql4pfU.png' },
  { id: 488, name: 'FRANGO A PASSARINHO CONGELADO TEMPERADO ADORO 1 KILO (CX 20 PCT)', category: 'Derivados de Ave', price: 184.05, image: 'https://i.imgur.com/v15qfmc.png' },
  { id: 489, name: 'FRANGO A PASSARINHO CONGELADO TEMPERADO ITABOM (CX 20 KILO)', category: 'Derivados de Ave', price: 181.6, image: 'https://i.imgur.com/ka0MnMt.png' },
  { id: 490, name: 'FRANGO INTEIRO CONGELADO ALLIZ 2,5 KILO (CX 20 KILO)', category: 'Derivados de Ave', price: 152.15, image: 'https://i.imgur.com/xoVIa9k.png' },
  { id: 491, name: 'FRANGO INTEIRO CONGELADO MIRA 2,5 KILO (CX 20 KILO)', category: 'Derivados de Ave', price: 152.15, image: 'https://i.imgur.com/fy12hM7.png' },
  { id: 492, name: 'FRANGO INTEIRO CONGELADO NUTRIBEM 2,9 KILO (CX 20 KILO)', category: 'Derivados de Ave', price: 184.05, image: 'https://i.imgur.com/c3duOsc.png' },
  { id: 493, name: 'FRANGO SEM MIÚDOS CARCAÇA CONGELADO ALLIZ 1,7 KILO (CX 17 KILO)', category: 'Derivados de Ave', price: 240.12, image: 'https://i.imgur.com/e5LP94O.png' },
  { id: 494, name: 'GEMA DE OVO PASTEURIZADA RESFRIADA ASA 1 KILO', category: 'Derivados de Ave', price: 54.42, image: 'https://i.imgur.com/um1UzcO.png' },
  { id: 495, name: 'GEMA DE OVO PASTEURIZADA RESFRIADA FLEISCHEGGS 1 KILO', category: 'Derivados de Ave', price: 90.61, image: 'https://i.imgur.com/YmSp9ej.png' },
  { id: 496, name: 'HAMBÚRGUER DE CARNE DE FRANGO EMPANADO LAR 100 G (CX 30 KILO)', category: 'Derivados de Ave', price: 68.89, image: 'https://i.imgur.com/4dybaNL.png' },
  { id: 497, name: 'MEIO DAS ASAS DE FRANGO TULIPAS CONGELADAS TEMPERADAS ADORO 1 KILO (CX 20 PCT)', category: 'Derivados de Ave', price: 318.24, image: 'https://i.imgur.com/4D6RvTf.png' },
  { id: 498, name: 'MEIO DAS ASAS DE FRANGO TULIPAS CONGELADAS TEMPERADAS FRANGÃO FOODS (CX 20 KILO)', category: 'Derivados de Ave', price: 284.66, image: 'https://i.imgur.com/3hpmXcw.png' },
  { id: 499, name: 'MEIO DAS ASAS DE FRANGO TULIPAS CONGELADAS TEMPERADAS ITABOM (CX 20 KILO)', category: 'Derivados de Ave', price: 386.78, image: 'https://i.imgur.com/n2mSVc8.png' },
  { id: 500, name: 'OVO INTEGRAL PASTEURIZADO RESFRIADO ASA 1 KILO', category: 'Derivados de Ave', price: 26.39, image: 'https://i.imgur.com/xuytVsS.png' },
  { id: 501, name: 'OVO INTEGRAL PASTEURIZADO RESFRIADO FLEISCHEGGS 1 KILO', category: 'Derivados de Ave', price: 33.41, image: 'https://i.imgur.com/LUPRb7B.png' },
  { id: 502, name: 'OVOS BRANCOS TIPO GRANDE MODELO 60 UN (CX 2 BDJ)', category: 'Derivados de Ave', price: 51.18, image: 'https://i.imgur.com/y2Hue0m.png' },
  { id: 503, name: 'OVOS DE CODORNA GRANJA SÃO PAULO 1 KILO', category: 'Derivados de Ave', price: 27.7, image: 'https://i.imgur.com/yUZKlEH.png' },
  { id: 504, name: 'OVOS DE CODORNA LOUREIRO 900 G', category: 'Derivados de Ave', price: 27.84, image: 'https://i.imgur.com/T5BuBt7.png' },
  { id: 505, name: 'PEITO DE FRANGO CONGELADO COM OSSO MIRA (CX 20 KILO)', category: 'Derivados de Ave', price: 225.77, image: 'https://i.imgur.com/2Cl50NL.png' },
  { id: 506, name: 'PEITO DE FRANGO CONGELADO COM OSSO NUTRIBEM (CX 20 KILO)', category: 'Derivados de Ave', price: 247.85, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 507, name: 'PEITO DE FRANGO CONGELADO COZIDO DESFIADO ALFAMA 1 KILO (CX 6 PCT)', category: 'Derivados de Ave', price: 209.82, image: 'https://i.imgur.com/mASBprm.png' },
  { id: 508, name: 'PEITO DE FRANGO DEFUMADO SEM OSSO CERATTI 2,3 KILO', category: 'Derivados de Ave', price: 82.66, image: 'https://i.imgur.com/WELIIvB.png' },
  { id: 509, name: 'PEITO DE PERU REZENDE 2,5 KILO', category: 'Derivados de Ave', price: 50.23, image: 'https://i.imgur.com/WFDnHFQ.png' },
  { id: 510, name: 'PEITO DE PERU SADIA 2,5 KILO', category: 'Derivados de Ave', price: 61.7, image: 'https://i.imgur.com/9CFY6jv.png' },
  { id: 511, name: 'PEITO DE PERU SEARA 2,5 KILO', category: 'Derivados de Ave', price: 55.28, image: 'https://i.imgur.com/zu03VOA.png' },
  { id: 512, name: 'SOBRECOXAS DE FRANGO CONGELADAS COM OSSO ADORO (CX 20 KILO)', category: 'Derivados de Ave', price: 211.04, image: 'https://i.imgur.com/LrIO5vP.png' },
  { id: 513, name: 'SOBRECOXAS DE FRANGO CONGELADAS COM OSSO INTERFOLHADAS ALLIZ (CX 20 KILO)', category: 'Derivados de Ave', price: 212.98, image: 'https://i.imgur.com/Cml9wGd.png' },
  { id: 514, name: 'SOBRECOXAS DE FRANGO CONGELADAS COM OSSO INTERFOLHADAS CANÇÃO (CX 18 KILO)', category: 'Derivados de Ave', price: 159.02, image: 'https://i.imgur.com/iF5z3P3.png' },
  { id: 515, name: 'SOBRECOXAS DE FRANGO CONGELADAS COM OSSO RICO (CX 20 KILO)', category: 'Derivados de Ave', price: 176.69, image: 'https://i.imgur.com/9KBrOJK.png' },
  { id: 516, name: 'STEAK DE FRANGO CONGELADO REZENDE 100 G (CX 72 UN)', category: 'Derivados de Ave', price: 121.54, image: 'https://i.imgur.com/oM96ySo.png' },
  { id: 517, name: 'ACÉM BOVINO RESFRIADO BOI BRASIL 9 KG', category: 'Derivados de Bovino', price: 36.31, image: 'https://i.imgur.com/WmbmKcF.png' },
  { id: 518, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://i.imgur.com/83qCruv.png' },
  { id: 519, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://i.imgur.com/N3wwUY9.png' },
  { id: 520, name: 'ALCATRA COM MAMINHA BOVINA RESFRIADA BOI BRASIL 5 KG', category: 'Derivados de Bovino', price: 39.21, image: 'https://i.imgur.com/sTj5stI.png' },
  { id: 521, name: 'ALCATRA COM MAMINHA BOVINA RESFRIADA NOSSO BEEF FRIGO NOSSO 6 KG', category: 'Derivados de Bovino', price: 38.89, image: 'https://i.imgur.com/z7NK8t5.png' },
  { id: 522, name: 'ALMÔNDEGA AVES E BOVINA CONGELADA BRASA 1 KG', category: 'Derivados de Bovino', price: 22.44, image: 'https://i.imgur.com/uoueBYP.png' },
  { id: 523, name: 'ALMÔNDEGA BOVINA ANGUS CONGELADA BRASA 500 G', category: 'Derivados de Bovino', price: 18.7, image: 'https://i.imgur.com/WTj9fRx.png' },
  { id: 524, name: 'ARANHA DA ALCATRA BOVINA CONGELADA BOI BRASIL 2 KG', category: 'Derivados de Bovino', price: 30.16, image: 'https://i.imgur.com/pNVUDBn.png' },
  { id: 525, name: 'ARANHA DA ALCATRA BOVINA CONGELADA TODA HORA PLENA 1.5 KG', category: 'Derivados de Bovino', price: 33.1, image: 'https://i.imgur.com/rweoMII.png' },
  { id: 526, name: 'CAPA DE FILÉ BOVINA RESFRIADA NOSSO BEEF FRIGO NOSSO 2 KG', category: 'Derivados de Bovino', price: 29.49, image: 'https://i.imgur.com/2anEMnB.png' },
  { id: 527, name: 'CARNE DE SOL BOVINA CONGELADA DESFIADA ALFAMA 1 KG', category: 'Derivados de Bovino', price: 54.83, image: 'https://i.imgur.com/S4HEnZF.png' },
  { id: 528, name: 'CARNE MOÍDA BOVINA CONGELADA ACÉM BOI FORTE 1 KG', category: 'Derivados de Bovino', price: 19, image: 'https://i.imgur.com/ncfSGj5.png' },
  { id: 529, name: 'CARNE MOÍDA BOVINA CONGELADA ALFAMA 1 KG', category: 'Derivados de Bovino', price: 28.83, image: 'https://i.imgur.com/qf2NkLg.png' },
  { id: 530, name: 'CARNE MOÍDA BOVINA CONGELADA ALFAMA 2,5 KILO', category: 'Derivados de Bovino', price: 70.88, image: 'https://i.imgur.com/OsvPNsm.png' },
  { id: 531, name: 'CARNE MOÍDA BOVINA CONGELADA PATINHO BOI FORTE 1 KG', category: 'Derivados de Bovino', price: 20.16, image: 'https://i.imgur.com/scZdEH1.png' },
  { id: 532, name: 'CARNE MOÍDA BOVINA CONGELADA PATINHO MESTRO 1 KG', category: 'Derivados de Bovino', price: 19.47, image: 'https://i.imgur.com/JpiEpge.png' },
  { id: 533, name: 'CARNE SECA BOVINA CONGELADA DESFIADA ALFAMA 1 KG', category: 'Derivados de Bovino', price: 61.34, image: 'https://i.imgur.com/5Immuu2.png' },
  { id: 534, name: 'CARNE SECA BOVINA DESFIADA REFOGADA TEMPERADA RG 300 G', category: 'Derivados de Bovino', price: 32.4, image: 'https://i.imgur.com/s1GJf3A.png' },
  { id: 535, name: 'CARNE SECA BOVINA DIANTEIRO JORDANÉSIA 1 KG', category: 'Derivados de Bovino', price: 41.02, image: 'https://i.imgur.com/ZP0GEBe.png' },
  { id: 536, name: 'CARNE SECA BOVINA GRANDE DIANTEIRO JORDANÉSIA 5 KG', category: 'Derivados de Bovino', price: 199.08, image: 'https://i.imgur.com/sEHll0C.png' },
  { id: 537, name: 'CARNE SECA BOVINA GRANDE DIANTEIRO REAL SABOR 5 KG', category: 'Derivados de Bovino', price: 202.1, image: 'https://i.imgur.com/nE8FTUL.png' },
  { id: 538, name: 'CARNE SECA BOVINA GRANDE TRASEIRO JORDANÉSIA 5 KG', category: 'Derivados de Bovino', price: 221.4, image: 'https://i.imgur.com/ZU3Atzk.png' },
  { id: 539, name: 'CARNE SECA BOVINA GRANDE TRASEIRO PAULISTINHA 5 KG', category: 'Derivados de Bovino', price: 193.78, image: 'https://i.imgur.com/1SqDCSI.png' },
  { id: 540, name: 'CARNE SECA BOVINA GRANDE TRASEIRO REAL SABOR 5 KG', category: 'Derivados de Bovino', price: 46.45, image: 'https://i.imgur.com/xN1piya.png' },
  { id: 541, name: 'CARNE SECA BOVINA TRASEIRO REAL SABOR 1 KG', category: 'Derivados de Bovino', price: 44.41, image: 'https://i.imgur.com/95RDFS0.png' },
  { id: 542, name: 'CONTRA FILÉ BOVINO RESFRIADO COM NOIX BOI BRASIL 3 KG', category: 'Derivados de Bovino', price: 42.83, image: 'https://i.imgur.com/Z7CQCdz.png' },
  { id: 543, name: 'CONTRA FILÉ BOVINO RESFRIADO COM NOIX GOLD BEEF 3 KG', category: 'Derivados de Bovino', price: 43.19, image: 'https://i.imgur.com/Fpzk6Qe.png' },
  { id: 544, name: 'CONTRA FILÉ BOVINO RESFRIADO SEM NOIX BOI BRASIL 4 KG', category: 'Derivados de Bovino', price: 44.04, image: 'https://i.imgur.com/QjaRMqE.png' },
  { id: 545, name: 'CORDÃO DO FILÉ MIGNON BOVINO CONGELADO BOI BRASIL 3 KG', category: 'Derivados de Bovino', price: 29.56, image: 'https://i.imgur.com/Mow03Ny.png' },
  { id: 546, name: 'COSTELA BOVINA CONGELADA DESFIADA ALFAMA 1 KG', category: 'Derivados de Bovino', price: 61.34, image: 'https://i.imgur.com/03RqYXv.png' },
  { id: 547, name: 'COSTELA BOVINA CONGELADA EM TIRAS COM OSSO FRIGO NOSSO 2 KG', category: 'Derivados de Bovino', price: 18.66, image: 'https://i.imgur.com/nW0SN4U.png' },
  { id: 548, name: 'COSTELA BOVINA CONGELADA EM TIRAS SERRADA COM OSSO FRIGONOSSA 2.5 KG', category: 'Derivados de Bovino', price: 19.91, image: 'https://i.imgur.com/oTZV1vp.png' },
  { id: 549, name: 'COSTELA BOVINA CONGELADA JANELA COM OSSO GOLD BEEF PRIME GRILL 5 KG', category: 'Derivados de Bovino', price: 23.53, image: 'https://i.imgur.com/PwezLeJ.png' },
  { id: 550, name: 'COSTELA BOVINA CONGELADA ROJÃO MINGA COM OSSO FRIGO NOSSO 9 KG', category: 'Derivados de Bovino', price: 22.32, image: 'https://i.imgur.com/MV4PJMe.png' },
  { id: 551, name: 'COSTELA BOVINA CONGELADA ROJÃO MINGA COM OSSO PLENA 7 KG', category: 'Derivados de Bovino', price: 21.6, image: 'https://i.imgur.com/nqEX3zT.png' },
  { id: 552, name: 'COXÃO DURO BOVINO RESFRIADO NOSSO BEEF FRIGO NOSSO 5 KG', category: 'Derivados de Bovino', price: 34.99, image: 'https://i.imgur.com/huo28q3.png' },
  { id: 553, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://i.imgur.com/hSzenKR.png' },
  { id: 554, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 36.71, image: 'https://i.imgur.com/YXLt4MO.png' },
  { id: 555, name: 'COXÃO MOLE BOVINO RESFRIADO NOSSO BEEF FRIGO NOSSO 9 KG', category: 'Derivados de Bovino', price: 37.28, image: 'https://i.imgur.com/z5zbX7m.png' },
  { id: 556, name: 'CUPIM BOVINO CONGELADO DESFIADO ALFAMA 1 KG', category: 'Derivados de Bovino', price: 59.71, image: 'https://i.imgur.com/emQYiG6.png' },
  { id: 557, name: 'CUPIM BOVINO CONGELADO TIPO B FRIGO NOSSO 8.5 KG', category: 'Derivados de Bovino', price: 30.16, image: 'https://i.imgur.com/v7ahOjn.png' },
  { id: 558, name: 'CUPIM BOVINO CONGELADO TIPO B MONDELLI 5 KG', category: 'Derivados de Bovino', price: 39.82, image: 'https://i.imgur.com/339ZYBS.png' },
  { id: 559, name: 'CUPIM BOVINO CONGELADO TIPO B PLENA 4 KG', category: 'Derivados de Bovino', price: 40.64, image: 'https://i.imgur.com/Xe5DdOe.png' },
  { id: 560, name: 'FÍGADO BOVINO CONGELADO FRIGO NOSSO 4.5 KG', category: 'Derivados de Bovino', price: 9.65, image: 'https://i.imgur.com/AKsK29Z.png' },
  { id: 561, name: 'FILÉ MIGNON BOVINO RESFRIADO "3 / 4" SEM CORDÃO FRIGORAÇA 1.5 KG', category: 'Derivados de Bovino', price: 73.6, image: 'https://i.imgur.com/3hPv09K.png' },
  { id: 562, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 8.43, image: 'https://i.imgur.com/5YzErf4.png' },
  { id: 563, name: 'FILÉ MIGNON BOVINO RESFRIADO "4 / 5" SEM CORDÃO NOSSO GRILL FRIGO NOSSO 2 KG', category: 'Derivados de Bovino', price: 77.28, image: 'https://i.imgur.com/4BeVNwZ.png' },
  { id: 564, name: 'FRALDINHA BOVINA RESFRIADA BOI BRASIL 1.2 KG', category: 'Derivados de Bovino', price: 35.08, image: 'https://i.imgur.com/qjIQPiR.png' },
  { id: 565, name: 'HAMBÚRGUER DE CARNE BOVINA COSTELA MATURATTA FRIBOI 180 G (CX 18 UN)', category: 'Derivados de Bovino', price: 117.79, image: 'https://i.imgur.com/n8dYy3o.png' },
  { id: 566, name: 'HAMBÚRGUER DE CARNE BOVINA FRALDINHA MATURATTA FRIBOI 180 G (CX 18 UN)', category: 'Derivados de Bovino', price: 117.79, image: 'https://i.imgur.com/o9vmylu.png' },
  { id: 567, name: 'HAMBÚRGUER DE CARNE BOVINA MISTER BEEF 100 G (CX 32 UN)', category: 'Derivados de Bovino', price: 100.79, image: 'https://i.imgur.com/ObD8reL.png' },
  { id: 568, name: 'HAMBÚRGUER DE CARNE BOVINA PICANHA MATURATTA FRIBOI 180 G (CX 18 UN)', category: 'Derivados de Bovino', price: 117.79, image: 'https://i.imgur.com/kkqPFtv.png' },
  { id: 569, name: 'HAMBÚRGUER DE CARNE BOVINA SABOR PICANHA MISTER BEEF 120 G (CX 20 UN)', category: 'Derivados de Bovino', price: 78.24, image: 'https://i.imgur.com/y2P2Lxs.png' },
  { id: 570, name: 'HAMBÚRGUER DE CARNE DE FRANGO E CARNE SUÍNA REZENDE 56 G (CX 36 UN)', category: 'Derivados de Bovino', price: 37.99, image: 'https://i.imgur.com/dVb8SQP.png' },
  { id: 571, name: 'HAMBÚRGUER DE PROTEÍNA VEGETAL SABOR CARNE INCRÍVEL 113 G (CX 24 UN)', category: 'Derivados de Bovino', price: 167.36, image: 'https://i.imgur.com/3P369gU.png' },
  { id: 572, name: 'HAMBÚRGUER GRANDE DE CARNE BOVINA ANGUS BRASA BURGUERS 120 G (CX 30 UN)', category: 'Derivados de Bovino', price: 65.26, image: 'https://i.imgur.com/cC0WFbW.png' },
  { id: 573, name: 'HAMBÚRGUER GRANDE DE CARNE BOVINA E AVES SABOR PICANHA BRASA BURGUERS 120 G (CX 30 UN)', category: 'Derivados de Bovino/Aves', price: 78.05, image: 'https://i.imgur.com/qeFzs9L.png' },
  { id: 574, name: 'HAMBÚRGUER GRANDE DE CARNE BOVINA E AVES TRADICIONAL BRASA BURGUERS 120 G (CX 30 UN)', category: 'Derivados de Bovino/Aves', price: 35.26, image: 'https://i.imgur.com/Lg0UA9y.png' },
  { id: 575, name: 'HAMBÚRGUER GRANDE DE CARNE BOVINA GOURMET MISTER BEEF 150 G (CX 20 UN)', category: 'Derivados de Bovino', price: 100.47, image: 'https://i.imgur.com/ZCsME4j.png' },
  { id: 576, name: 'HAMBÚRGUER MÉDIO DE CARNE BOVINA COSTELA ALFAMA 150 G (CX 24 UN)', category: 'Derivados de Bovino', price: 137.75, image: 'https://i.imgur.com/6Xx7u9w.png' },
  { id: 577, name: 'HAMBÚRGUER MÉDIO DE CARNE BOVINA E AVES SABOR PICANHA BRASA BURGUERS 90 G (CX 36 UN)', category: 'Derivados de Bovino/Aves', price: 71.92, image: 'https://i.imgur.com/YGhofhW.png' },
  { id: 578, name: 'HAMBÚRGUER MÉDIO DE CARNE BOVINA E AVES TRADICIONAL BRASA BURGUERS 90 G (CX 36 UN)', category: 'Derivados de Bovino/Aves', price: 68.52, image: 'https://i.imgur.com/tWahVDP.png' },
  { id: 579, name: 'HAMBÚRGUER MÉDIO DE CARNE BOVINA SABOR CHURRASCO BRASA BURGUERS 90 G (CX 36 UN)', category: 'Derivados de Bovino', price: 36.54, image: 'https://i.imgur.com/rQViyPr.png' },
  { id: 580, name: 'HAMBÚRGUER MÉDIO DE CARNE DE AVES E BOVINA COM SOJA MISTER BEEF 90 G (CX 36 UN)', category: 'Derivados de Bovino', price: 60.07, image: 'https://i.imgur.com/I7JCJ1O.png' },
  { id: 581, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 64.73, image: 'https://i.imgur.com/Dhmqahf.png' },
  { id: 582, name: 'HAMBÚRGUER MÉDIO DE CARNE DE FRANGO E CARNE BOVINA TEXAS BURGUER SEARA 90 G (CX 36 UN)', category: 'Derivados de Bovino', price: 61.71, image: 'https://i.imgur.com/Xbuzotv.png' },
  { id: 583, name: 'HAMBÚRGUER PEQUENO DE CARNE BOVINA E AVES TRADICIONAL BRASA BURGUERS 56 G (CX 36 UN)', category: 'Derivados de Bovino/Aves', price: 89.47, image: 'https://i.imgur.com/oc8jxt3.png' },
  { id: 584, name: 'HAMBÚRGUER PEQUENO DE CARNE BOVINA SMASH MISTER BEEF 75 G (CX 36 UN)', category: 'Derivados de Bovino', price: 93.41, image: 'https://i.imgur.com/Eqp3AkG.png' },
  { id: 585, name: 'HAMBÚRGUER PEQUENO DE CARNE DE AVES E BOVINA COM SOJA MISTER BEEF 56 G (CX 36 UN)', category: 'Derivados de Bovino', price: 37.11, image: 'https://i.imgur.com/at7FFtA.png' },
  { id: 586, name: 'HAMBÚRGUER PEQUENO DE CARNE DE FRANGO CARNE SUÍNA E CARNE BOVINA FAROESTE BURGER AURORA 56 G (CX 36 UN)', category: 'Derivados de Bovino', price: 47.3, image: 'https://i.imgur.com/oNCDVOS.png' },
  { id: 587, name: 'HAMBÚRGUER PEQUENO DE CARNE DE FRANGO E CARNE BOVINA TEXAS BURGUER SEARA 56 G (CX 36 UN)', category: 'Derivados de Bovino', price: 40.85, image: 'https://i.imgur.com/FAhY28H.png' },
  { id: 588, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 93.41, image: 'https://i.imgur.com/7hiAvLV.png' },
  { id: 589, name: 'LAGARTO BOVINO RESFRIADO NOSSO BEEF FRIGO NOSSO 2 KG', category: 'Derivados de Bovino', price: 38.61, image: 'https://i.imgur.com/Sr2OyAU.png' },
  { id: 590, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://i.imgur.com/V2n6HSu.png' },
  { id: 591, name: 'MAMINHA DA ALCATRA BOVINA RESFRIADA JORDANÉSIA 1.2 KG', category: 'Derivados de Bovino', price: 38.61, image: 'https://i.imgur.com/XXPH52T.png' },
  { id: 592, name: 'MIOLO DA ALCATRA BOVINA RESFRIADO JORDANÉSIA 3,5 KG', category: 'Derivados de Bovino', price: 41.27, image: 'https://i.imgur.com/MhhSMPV.png' },
  { id: 593, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 28.89, image: 'https://i.imgur.com/RmbNZxe.png' },
  { id: 594, name: 'MÚSCULO DO TRASEIRO BOVINO RESFRIADO SEM OSSO BOI BRASIL 3.5 KG', category: 'Derivados de Bovino', price: 28.35, image: 'https://i.imgur.com/rffEj6F.png' },
  { id: 595, name: 'MÚSCULO DO TRASEIRO BOVINO RESFRIADO SEM OSSO FRIGO NOSSO 3.5 KG', category: 'Derivados de Bovino', price: 27.15, image: 'https://i.imgur.com/satvICx.png' },
  { id: 596, name: 'PALETA BOVINA RESFRIADA SEM OSSO E SEM MÚSCULO BOI BRASIL 9 KG', category: 'Derivados de Bovino', price: 29.87, image: 'https://i.imgur.com/AWKbt7T.png' },
  { id: 597, name: 'PASTRAMI BOVINO COZIDO E DEFUMADO CERATTI 1,5 KG', category: 'Derivados de Bovino', price: 121.05, image: 'https://i.imgur.com/oewhwl4.png' },
  { id: 598, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://i.imgur.com/YUeixUV.png' },
  { id: 599, name: 'PATINHO BOVINO RESFRIADO BOI BRASIL 5 KG', category: 'Derivados de Bovino', price: 37.4, image: 'https://i.imgur.com/MP9nU9F.png' },
  { id: 600, name: 'PATINHO BOVINO RESFRIADO JORDANÉSIA 5 KG', category: 'Derivados de Bovino', price: 33.78, image: 'https://i.imgur.com/t91cG2F.png' },
  { id: 601, name: 'PEITO BOVINO RESFRIADO SEM OSSO FRIGO NOSSO 6,5 KG', category: 'Derivados de Bovino', price: 27.22, image: 'https://i.imgur.com/aZY78rB.png' },
  { id: 602, name: 'PICANHA BOVINA RESFRIADA DEFUMADA CERATTI 1 KG', category: 'Derivados de Bovino', price: 200.71, image: 'https://i.imgur.com/XyV2ZAj.png' },
  { id: 603, name: 'PICANHA BOVINA RESFRIADA TIPO A BOI BRASIL 1.3 KG', category: 'Derivados de Bovino', price: 59.12, image: 'https://i.imgur.com/spDZO7A.png' },
  { id: 604, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://i.imgur.com/GBr1ic6.png' },
  { id: 605, name: 'QUEIJO CRISPY BURGER SEARA GOURMET 100 G (CX 26 UN)', category: 'Derivados de Bovino', price: 98.47, image: 'https://i.imgur.com/JZmDua2.png' },
  { id: 606, name: 'RABO BOVINO CONGELADO BOI BRASIL 2 KG', category: 'Derivados de Bovino', price: 22.86, image: 'https://i.imgur.com/VnGZa71.png' },
  { id: 607, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://i.imgur.com/hJajEMa.png' },
  { id: 608, name: 'BASE CULINÁRIA LECO 1 KILO (CX 12 UN)', category: 'Derivados de Leite', price: 163.23, image: 'https://i.imgur.com/t2wxSMZ.png' },
  { id: 609, name: 'CHANTILLY DECOR UP DELUXE 1 L', category: 'Derivados de Leite', price: 19.73, image: 'https://i.imgur.com/AAQbMeN.png' },
  { id: 610, name: 'CHANTILLY GRAN FINALE 1 L', category: 'Derivados de Leite', price: 27.33, image: 'https://i.imgur.com/1HB6dGb.png' },
  { id: 611, name: 'CHANTILLY SPRAY GRAN FINALE 250 G', category: 'Derivados de Leite', price: 24.94, image: 'https://i.imgur.com/muIqIMR.png' },
  { id: 612, name: 'CHANTILLY SPRAY POLENGHI 250 G', category: 'Derivados de Leite', price: 28.41, image: 'https://i.imgur.com/VSzj813.png' },
  { id: 613, name: 'CHANTY MIX AMÉLIA 1 L', category: 'Derivados de Leite', price: 21.25, image: 'https://i.imgur.com/B8i3Ssd.png' },
  { id: 614, name: 'CHEDDAR FATIADO PROCESSADO 160 FATIAS POLENGHI "2,27" KILO', category: 'Derivados de Leite', price: 80.8, image: 'https://i.imgur.com/qOJVN6o.png' },
  { id: 615, name: 'CHEDDAR FATIADO PROCESSADO 160 FATIAS VIGOR 2,24 KILO', category: 'Derivados de Leite', price: 89.89, image: 'https://i.imgur.com/ecEaHyX.png' },
  { id: 616, name: 'CHEDDAR FATIADO PROCESSADO 184 FATIAS SCHREIBER 2,27 KILO', category: 'Derivados de Leite', price: 91.98, image: 'https://i.imgur.com/lvgh4SL.png' },
  { id: 617, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/JlMVxfX.png' },
  { id: 618, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/qOJVN6o.png' },
  { id: 619, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/ecEaHyX.png' },
  { id: 620, name: 'CREAM CHEESE CATUPIRY 1,2 KILO', category: 'Derivados de Leite', price: 43.28, image: 'https://i.imgur.com/rUmOwNR.png' },
  { id: 621, name: 'CREAM CHEESE COROCHEESE CORONATA 1,2 KILO', category: 'Derivados de Leite', price: 31.49, image: 'https://i.imgur.com/NkzTg3B.png' },
  { id: 622, name: 'CREAM CHEESE DANÚBIO 1 KILO', category: 'Derivados de Leite', price: 33.74, image: 'https://i.imgur.com/vrhRBCH.png' },
  { id: 623, name: 'CREAM CHEESE IPANEMA 1,2 KILO', category: 'Derivados de Leite', price: 35.4, image: 'https://i.imgur.com/Ag1RinD.png' },
  { id: 624, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/xrXxRRn.png' },
  { id: 625, name: 'CREAM CHEESE PEQUENO SCALA 150 G', category: 'Derivados de Leite', price: 7.84, image: 'https://i.imgur.com/ofPdyaE.png' },
  { id: 626, name: 'CREAM CHEESE PHILADELPHIA 3,6 KILO', category: 'Derivados de Leite', price: 144.1, image: 'https://i.imgur.com/zCFFzZn.png' },
  { id: 627, name: 'CREAM CHEESE PHILADELPHIA 1,5 KILO', category: 'Derivados de Leite', price: 66.69, image: 'https://i.imgur.com/x9IAZht.png' },
  { id: 628, name: 'CREAM CHEESE POLENGHI 3,6 KILO', category: 'Derivados de Leite', price: 36.71, image: 'https://i.imgur.com/sk8UTMN.png' },
  { id: 629, name: 'CREAM CHEESE POLENGHI 1 KILO', category: 'Derivados de Leite', price: 35.92, image: 'https://i.imgur.com/uuczGfM.png' },
  { id: 630, name: 'CREAM CHEESE SACHÊ DANÚBIO 18 G (CX 144 UN)', category: 'Derivados de Leite', price: 136.94, image: 'https://i.imgur.com/Ejclpyo.png' },
  { id: 631, name: 'CREAM CHEESE SACHÊ PRESIDENT 18 G (CX 120 UN)', category: 'Derivados de Leite', price: 117.86, image: 'https://i.imgur.com/ysB7bu6.png' },
  { id: 632, name: 'CREAM CHEESE SCALA 1,2 KILO', category: 'Derivados de Leite', price: 38.52, image: 'https://i.imgur.com/1zmzpu6.png' },
  { id: 633, name: 'CREAM CHEESE SCALA 3,6 KILO', category: 'Derivados de Leite', price: 114.56, image: 'https://i.imgur.com/kEWb8Mp.png' },
  { id: 634, name: 'CREAM CHEESE SCALON 1,02 KILO', category: 'Derivados de Leite', price: 28.11, image: 'https://i.imgur.com/4kXnSVu.png' },
  { id: 635, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/NzoBq6X.png' },
  { id: 636, name: 'CREAM CHEESE SULMINAS 1,2 KILO', category: 'Derivados de Leite', price: 28.82, image: 'https://i.imgur.com/FyTr2l0.png' },
  { id: 637, name: 'CREME CULINÁRIO DAUS 1 KILO (CX 12 UN)', category: 'Derivados de Leite', price: 124.42, image: 'https://i.imgur.com/dtojLoY.png' },
  { id: 638, name: 'CREME DE LEITE GRANDE FOOD SERVICE ITALAC 1,030 KILO (CX 12 UN)', category: 'Derivados de Leite', price: 193.8, image: 'https://i.imgur.com/jeas25V.png' },
  { id: 639, name: 'CREME DE LEITE GRANDE FOOD SERVICE PIRACANJUBA 1,030 KILO (CX 12 UN)', category: 'Derivados de Leite', price: 215.34, image: 'https://i.imgur.com/H1wMMKs.png' },
  { id: 640, name: 'CREME DE LEITE ITALAC 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 80.64, image: 'https://i.imgur.com/0YFQgVY.png' },
  { id: 641, name: 'CREME DE LEITE JUSSARA 200 G (CX 27 UN)', category: 'Derivados de Leite', price: 74.43, image: 'https://i.imgur.com/d0Fy77Q.png' },
  { id: 642, name: 'CREME DE LEITE PASTEURIZADO BIOCREME 1,01 KILO', category: 'Derivados de Leite', price: 30.84, image: 'https://i.imgur.com/sgnE1ao.png' },
  { id: 643, name: 'CREME DE LEITE PASTEURIZADO QUATÁ 1,01 KILO', category: 'Derivados de Leite', price: 41.21, image: 'https://i.imgur.com/RPshgGt.png' },
  { id: 644, name: 'CREME DE LEITE PIRACANJUBA 200 G (CX 27 UN)', category: 'Derivados de Leite', price: 96.73, image: 'https://i.imgur.com/H2jxeFo.png' },
  { id: 645, name: 'CREME DE RICOTA TIROLEZ 200 G', category: 'Derivados de Leite', price: 6.71, image: 'https://i.imgur.com/PQ9DOp7.png' },
  { id: 646, name: 'DOCE DE LEITE FRIMESA 4,8 KILO', category: 'Derivados de Leite', price: 101.25, image: 'https://i.imgur.com/ERFqbIy.png' },
  { id: 647, name: 'DOCE DE LEITE LA SERENISSIMA 1 KILO', category: 'Derivados de Leite', price: 39.98, image: 'https://i.imgur.com/5f8dkrK.png' },
  { id: 648, name: 'DOCE DE LEITE NESTLÉ 1,01 KILO', category: 'Derivados de Leite', price: 37.41, image: 'https://i.imgur.com/WWMSVmq.png' },
  { id: 649, name: 'DOCE DE LEITE SABOR DE MINAS 1,5 KILO', category: 'Derivados de Leite', price: 21.32, image: 'https://i.imgur.com/0cQYrxr.png' },
  { id: 650, name: 'DOCE DE LEITE TRADICIONAL FRIMESA 400 G', category: 'Derivados de Leite', price: 8.67, image: 'https://i.imgur.com/eASlJ4n.png' },
  { id: 651, name: 'GORGONZOLA BELLA ITÁLIA 3 KG', category: 'Derivados de Leite', price: 53.17, image: 'https://i.imgur.com/EnPQ3h6.png' },
  { id: 652, name: 'GORGONZOLA FRACIONADO BELLA ITÁLIA 200 G', category: 'Derivados de Leite', price: 9.72, image: 'https://i.imgur.com/IJOUEqD.png' },
  { id: 653, name: 'GORGONZOLA FRACIONADO QUATÁ 180 G', category: 'Derivados de Leite', price: 12.27, image: 'https://i.imgur.com/FHyPQva.png' },
  { id: 654, name: 'GORGONZOLA FRACIONADO QUEIJO AZUL SÃO VICENTE 180 G', category: 'Derivados de Leite', price: 11.09, image: 'https://i.imgur.com/xPEGYfv.png' },
  { id: 655, name: 'GORGONZOLA FRACIONADO QUEIJO AZUL SCALA 180 G', category: 'Derivados de Leite', price: 15.26, image: 'https://i.imgur.com/dsa2EpT.png' },
  { id: 656, name: 'GORGONZOLA FRACIONADO QUEIJO AZUL TIROLEZ 200 G', category: 'Derivados de Leite', price: 13.67, image: 'https://i.imgur.com/ATP0C2S.png' },
  { id: 657, name: 'GORGONZOLA FRACIONADO QUEIJO AZUL YEMA 170 G', category: 'Derivados de Leite', price: 12.15, image: 'https://i.imgur.com/CVTWtib.png' },
  { id: 658, name: 'GORGONZOLA QUATÁ 3 KG', category: 'Derivados de Leite', price: 56.24, image: 'https://i.imgur.com/kA9rAAz.png' },
  { id: 659, name: 'GORGONZOLA QUEIJO AZUL BURITIS 3 KG', category: 'Derivados de Leite', price: 46.72, image: 'https://i.imgur.com/F8fB80F.png' },
  { id: 660, name: 'GORGONZOLA QUEIJO AZUL SÃO VICENTE 3 KG', category: 'Derivados de Leite', price: 49.85, image: 'https://i.imgur.com/RwSVTuY.png' },
  { id: 661, name: 'GORGONZOLA QUEIJO AZUL TIROLEZ 3 KG', category: 'Derivados de Leite', price: 65.86, image: 'https://i.imgur.com/JsUp04G.png' },
  { id: 662, name: 'LEITE CONDENSADO "INTEGRAL" ITALAC 395 G (CX 27 UN)', category: 'Derivados de Leite', price: 220.35, image: 'https://i.imgur.com/56tNCGg.png' },
  { id: 663, name: 'LEITE CONDENSADO GRANDE INTEGRAL MOÇA NESTLÉ 2,6 KILO', category: 'Derivados de Leite', price: 67.79, image: 'https://i.imgur.com/2xcSNFN.png' },
  { id: 664, name: 'LEITE CONDENSADO GRANDE INTEGRAL MOCOCA 5 KILO', category: 'Derivados de Leite', price: 86.53, image: 'https://i.imgur.com/qZtR90C.png' },
  { id: 665, name: 'LEITE CONDENSADO INTEGRAL MOCOCA 2,5 KILO', category: 'Derivados de Leite', price: 42.33, image: 'https://i.imgur.com/EUtlhjG.png' },
  { id: 666, name: 'LEITE CONDENSADO MÉDIO "SEMIDESNATADO" ITALAC 395 G (CX 27 UN)', category: 'Derivados de Leite', price: 188.19, image: 'https://i.imgur.com/zCDkvQy.png' },
  { id: 667, name: 'LEITE CONDENSADO PEQUENO INTEGRAL MOÇA NESTLÉ 395 G', category: 'Derivados de Leite', price: 10.62, image: 'https://i.imgur.com/W1pWm7l.png' },
  { id: 668, name: 'LEITE CONDENSADO PEQUENO INTEGRAL MOCOCA 395 G (CX 27 UN)', category: 'Derivados de Leite', price: 214.5, image: 'https://i.imgur.com/E8QxbJw.png' },
  { id: 669, name: 'LEITE CONDENSADO PEQUENO SEMIDESNATADO ITALAC 270 G (CX 24 UN)', category: 'Derivados de Leite', price: 121.24, image: 'https://i.imgur.com/5UzhzNc.png' },
  { id: 670, name: 'LEITE CONDENSADO PEQUENO SEMIDESNATADO PIRACANJUBA 270 G (CX 27 UN)', category: 'Derivados de Leite', price: 141.65, image: 'https://i.imgur.com/YSNDINy.png' },
  { id: 671, name: 'LEITE CONDENSADO SEMIDESNATADO FOOD SERVICE ITALAC 2,5 KILO', category: 'Derivados de Leite', price: 39.95, image: 'https://i.imgur.com/X3WAXb6.png' },
  { id: 672, name: 'LEITE CONDENSADO SEMIDESNATADO FOOD SERVICE PIRACANJUBA 2,5 KILO', category: 'Derivados de Leite', price: 36.02, image: 'https://i.imgur.com/IoRN8qh.png' },
  { id: 673, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/Kvbdcil.png' },
  { id: 674, name: 'LEITE DESNATADO JUSSARA 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 60.45, image: 'https://i.imgur.com/yMXYxAk.png' },
  { id: 675, name: 'LEITE EM PÓ DESNATADO INSTANTÂNEO LA SERENISSIMA 300 G', category: 'Derivados de Leite', price: 12.94, image: 'https://i.imgur.com/kyhKawS.png' },
  { id: 676, name: 'LEITE EM PÓ INTEGRAL ITALAC 400 G', category: 'Derivados de Leite', price: 15.76, image: 'https://i.imgur.com/eMcpXKh.png' },
  { id: 677, name: 'LEITE EM PÓ INTEGRAL JUSSARA 400 G', category: 'Derivados de Leite', price: 15.23, image: 'https://i.imgur.com/g2fyYGV.png' },
  { id: 678, name: 'LEITE EM PÓ INTEGRAL LA SERENISSIMA 400 G', category: 'Derivados de Leite', price: 16.28, image: 'https://i.imgur.com/3ZIlcfN.png' },
  { id: 679, name: 'LEITE EM PÓ INTEGRAL PIRACANJUBA 400 G', category: 'Derivados de Leite', price: 15.27, image: 'https://i.imgur.com/XCKsfcr.png' },
  { id: 680, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/EAh1kvp.png' },
  { id: 681, name: 'LEITE INTEGRAL ITALAC 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 65.75, image: 'https://i.imgur.com/3UMjZs5.png' },
  { id: 682, name: 'LEITE INTEGRAL JUSSARA 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 65.49, image: 'https://i.imgur.com/VYo9eoX.png' },
  { id: 683, name: 'LEITE INTEGRAL QUATÁ 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 68.6, image: 'https://i.imgur.com/H1AIVnk.png' },
  { id: 684, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/rOeeSrt.png' },
  { id: 685, name: 'LEITE INTEGRAL ZERO LACTOSE ITALAC 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 80.85, image: 'https://i.imgur.com/YilYtq0.png' },
  { id: 686, name: 'LEITE SEMIDESNATADO ITALAC 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 70.27, image: 'https://i.imgur.com/ApVxLwq.png' },
  { id: 687, name: 'LEITE SEMIDESNATADO ZERO LACTOSE JUSSARA 1 L', category: 'Derivados de Leite', price: 37.02, image: 'https://i.imgur.com/U38LAQD.png' },
  { id: 688, name: 'MANTEIGA COM SAL COYOTE (CX 5 KILO)', category: 'Derivados de Leite', price: 89.47, image: 'https://i.imgur.com/ei0x395.png' },
  { id: 689, name: 'MANTEIGA COM SAL ITALAC 500 G', category: 'Derivados de Leite', price: 26.42, image: 'https://i.imgur.com/jxEDhel.png' },
  { id: 690, name: 'MANTEIGA COM SAL TRÊS MARIAS 10 KILO', category: 'Derivados de Leite', price: 383.44, image: 'https://i.imgur.com/YOPTg9k.png' },
  { id: 691, name: 'MANTEIGA PEQUENA "EXTRA" SEM SAL LA SERENISSIMA 200 G (CX 10 UN)', category: 'Derivados de Leite', price: 124.3, image: 'https://i.imgur.com/OCHaHYd.png' },
  { id: 692, name: 'MANTEIGA PEQUENA COM SAL CRIOULO 200 G (CX 20 UN)', category: 'Derivados de Leite', price: 95.7, image: 'https://i.imgur.com/vDL10ZL.png' },
  { id: 693, name: 'MANTEIGA PEQUENA COM SAL TIROLEZ 200 G (CX 12 UN)', category: 'Derivados de Leite', price: 158.44, image: 'https://i.imgur.com/eA8cOhG.png' },
  { id: 694, name: 'MANTEIGA PEQUENA SEM SAL TIROLEZ 200 G (CX 12 UN)', category: 'Derivados de Leite', price: 158.44, image: 'https://i.imgur.com/f8CITZk.png' },
  { id: 695, name: 'MANTEIGA SACHÊ COM SAL BOM SABOR 10 G  (CX 144 UN)', category: 'Derivados de Leite', price: 31.61, image: 'https://i.imgur.com/WvXyziG.png' },
  { id: 696, name: 'MANTEIGA SACHÊ COM SAL PRESIDENT 10 G (CX 192 UN)', category: 'Derivados de Leite', price: 124.86, image: 'https://i.imgur.com/DQ2uu6n.png' },
  { id: 697, name: 'MANTEIGA SACHÊ COM SAL VIGOR 10 G (CX 192 UN)', category: 'Derivados de Leite', price: 124.7, image: 'https://i.imgur.com/5bSBO3K.png' },
  { id: 698, name: 'MANTEIGA SACHÊ SEM SAL PRESIDENT 10 G (CX 192 UN)', category: 'Derivados de Leite', price: 124.86, image: 'https://i.imgur.com/p0VWhOo.png' },
  { id: 699, name: 'MANTEIGA SACHÊ SEM SAL VIGOR 10 G (CX 192 UN)', category: 'Derivados de Leite', price: 124.7, image: 'https://i.imgur.com/x5hs8GO.png' },
  { id: 700, name: 'MANTEIGA SEM SAL BLEND PASSA QUATRO (CX 5 KILO)', category: 'Derivados de Leite', price: 105.45, image: 'https://i.imgur.com/laXJl6J.png' },
  { id: 701, name: 'MANTEIGA SEM SAL COYOTE (CX 5 KILO)', category: 'Derivados de Leite', price: 83.08, image: 'https://i.imgur.com/642gqV0.png' },
  { id: 702, name: 'MANTEIGA SEM SAL DE PRIMEIRA FRIZZO (CX 5 KILO)', category: 'Derivados de Leite', price: 108.64, image: 'https://i.imgur.com/clE8mqN.png' },
  { id: 703, name: 'MANTEIGA SEM SAL QUATRELATI (CX 5 KILO)', category: 'Derivados de Leite', price: 158.19, image: 'https://i.imgur.com/DqQ87wH.png' },
  { id: 704, name: 'MANTEIGA SEM SAL SCALA (CX 5 KILO)', category: 'Derivados de Leite', price: 247.96, image: 'https://i.imgur.com/Te4Ht9h.png' },
  { id: 705, name: 'MANTEIGA SEM SAL TIROLEZ (CX 5 KILO)', category: 'Derivados de Leite', price: 249.17, image: 'https://i.imgur.com/i6AiFfH.png' },
  { id: 706, name: 'MANTEIGA SEM SAL TRÊS MARIAS (CX 5 KILO)', category: 'Derivados de Leite', price: 153.38, image: 'https://i.imgur.com/HKTbPCP.png' },
  { id: 707, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR CORONATA 1,5 KILO', category: 'Derivados de Leite', price: 31.49, image: 'https://i.imgur.com/gIuR8z2.png' },
  { id: 708, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR DALLORA 1,8 KILO', category: 'Derivados de Leite', price: 25.34, image: 'https://i.imgur.com/A9Kx4K9.png' },
  { id: 709, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR PARMATO 1,2 KILO', category: 'Derivados de Leite', price: 22.32, image: 'https://i.imgur.com/tIXnCyI.png' },
  { id: 710, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR PURANATA 1,2 KILO', category: 'Derivados de Leite', price: 12.42, image: 'https://i.imgur.com/xvEGPOE.png' },
  { id: 711, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR ROSELI 1,2 KILO', category: 'Derivados de Leite', price: 13.57, image: 'https://i.imgur.com/hCrrClS.png' },
  { id: 712, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR TOP CHEDDAR 1,2 KILO', category: 'Derivados de Leite', price: 11.94, image: 'https://i.imgur.com/ZiM10yy.png' },
  { id: 713, name: 'MISTURA LÁCTEA CONDENSADA PEQUENA MOCOCA 395 G (CX 27 UN)', category: 'Derivados de Leite', price: 110.59, image: 'https://i.imgur.com/4iRbcJu.png' },
  { id: 714, name: 'MISTURA LÁCTEA CREME DE LEITE MOCOCA 200 G  (CX 27 UN)', category: 'Derivados de Leite', price: 67.56, image: 'https://i.imgur.com/nS6skcY.png' },
  { id: 715, name: 'MUÇARELA ALTO DO VALE 4 KG', category: 'Derivados de Leite', price: 26.45, image: 'https://i.imgur.com/GWNwUjq.png' },
  { id: 716, name: 'MUÇARELA ANITA 4 KG', category: 'Derivados de Leite', price: 30.68, image: 'https://i.imgur.com/sjmtRNU.png' },
  { id: 717, name: 'MUÇARELA APOLO 4 KG', category: 'Derivados de Leite', price: 27.63, image: 'https://i.imgur.com/bmKF3yF.png' },
  { id: 718, name: 'MUÇARELA BACIO 4 KG', category: 'Derivados de Leite', price: 37.36, image: 'https://i.imgur.com/lfvuVAJ.png' },
  { id: 719, name: 'MUÇARELA BARI 4 KG', category: 'Derivados de Leite', price: 27.63, image: 'https://i.imgur.com/J3OqbkZ.png' },
  { id: 720, name: 'MUÇARELA BOCCATELLE CORONATA 360 G', category: 'Derivados de Leite', price: 21.6, image: 'https://i.imgur.com/d1jFH3g.png' },
  { id: 721, name: 'MUÇARELA BONÍSSIMO 4 KG', category: 'Derivados de Leite', price: 27.63, image: 'https://i.imgur.com/308PA6O.png' },
  { id: 722, name: 'MUÇARELA CLÁSSICA 4 KG', category: 'Derivados de Leite', price: 32.64, image: 'https://i.imgur.com/6eg3HZK.png' },
  { id: 723, name: 'MUÇARELA COBERTURA PARA PIZZA MOZZALET 2 KG', category: 'Derivados de Leite', price: 46.52, image: 'https://i.imgur.com/s3EoesW.png' },
  { id: 724, name: 'MUÇARELA COBERTURA PARA PIZZA MOZZANA 2 KG', category: 'Derivados de Leite', price: 51.56, image: 'https://i.imgur.com/sNoYWjs.png' },
  { id: 725, name: 'MUÇARELA COOPERNOVA 4 KG', category: 'Derivados de Leite', price: 32.92, image: 'https://i.imgur.com/BLArIDz.png' },
  { id: 726, name: 'MUÇARELA COYOTE 4 KG', category: 'Derivados de Leite', price: 30.44, image: 'https://i.imgur.com/MtfYsza.png' },
  { id: 727, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/2facsiX.png' },
  { id: 728, name: 'MUÇARELA DE BÚFALA BOCCONCINO YEMA 330 G', category: 'Derivados de Leite', price: 23.32, image: 'https://i.imgur.com/6f2VaR5.png' },
  { id: 729, name: 'MUÇARELA DE BÚFALA BOLA LEVITARE 400 G', category: 'Derivados de Leite', price: 27.91, image: 'https://i.imgur.com/PKK1eR8.png' },
  { id: 730, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/pbbukZH.png' },
  { id: 731, name: 'MUÇARELA DE BÚFALA CEREJINHA LEVITARE 400 G', category: 'Derivados de Leite', price: 27.91, image: 'https://i.imgur.com/9vEiCtd.png' },
  { id: 732, name: 'MUÇARELA DE BÚFALA CEREJINHA YEMA 330 G', category: 'Derivados de Leite', price: 23.32, image: 'https://i.imgur.com/iDRRSHQ.png' },
  { id: 733, name: 'MUÇARELA DE BÚFALA LEVITARE 4 KG', category: 'Derivados de Leite', price: 54.33, image: 'https://i.imgur.com/vONDHuu.png' },
  { id: 734, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/FTW3Eps.png' },
  { id: 735, name: 'MUÇARELA DE BÚFALA YEMA 3,7 KG', category: 'Derivados de Leite', price: 47.29, image: 'https://i.imgur.com/mDbY8T6.png' },
  { id: 736, name: 'MUÇARELA DOMILAC 3 KG', category: 'Derivados de Leite', price: 28.22, image: 'https://i.imgur.com/1FlVglX.png' },
  { id: 737, name: 'MUÇARELA FATIADA COYOTE 4 KG', category: 'Derivados de Leite', price: 144.79, image: 'https://i.imgur.com/2IVN8M8.png' },
  { id: 738, name: 'MUÇARELA FATIADA FRIZZO 2 KG', category: 'Derivados de Leite', price: 62.74, image: 'https://i.imgur.com/YllIihn.png' },
  { id: 739, name: 'MUÇARELA FATIADA HM 4 KG', category: 'Derivados de Leite', price: 120.66, image: 'https://i.imgur.com/HWESoaa.png' },
  { id: 740, name: 'MUÇARELA FATIADA PROCESSADA 16 FATIAS SCAR 400 G', category: 'Derivados de Leite', price: 21.37, image: 'https://i.imgur.com/OalW6Xt.png' },
  { id: 741, name: 'MUÇARELA FATIADA PROCESSADA POLENGHI 2,73 KG', category: 'Derivados de Leite', price: 104.71, image: 'https://i.imgur.com/ncPfaZt.png' },
  { id: 742, name: 'MUÇARELA FATIADA PROCESSADA SCHREIBER 2,27 KG', category: 'Derivados de Leite', price: 85.98, image: 'https://i.imgur.com/PVFRUgo.png' },
  { id: 743, name: 'MUÇARELA FATIADA TIROLEZ 1 KG', category: 'Derivados de Leite', price: 46.25, image: 'https://i.imgur.com/Paufnp5.png' },
  { id: 744, name: 'MUÇARELA FLEURY 4 KG', category: 'Derivados de Leite', price: 32.27, image: 'https://i.imgur.com/hikGfOd.png' },
  { id: 745, name: 'MUÇARELA FRIOLACK 4 KG', category: 'Derivados de Leite', price: 28.52, image: 'https://i.imgur.com/FCmSnm5.png' },
  { id: 746, name: 'MUÇARELA FRIZZO 4 KG', category: 'Derivados de Leite', price: 28.8, image: 'https://i.imgur.com/q9a5I8n.png' },
  { id: 747, name: 'MUÇARELA HM 4 KG', category: 'Derivados de Leite', price: 27.05, image: 'https://i.imgur.com/7OuTXCv.png' },
  { id: 748, name: 'MUÇARELA ITALAC 4 KG', category: 'Derivados de Leite', price: 31.16, image: 'https://i.imgur.com/xHJRtYK.png' },
  { id: 749, name: 'MUÇARELA JÓIA 4 KG', category: 'Derivados de Leite', price: 34.1, image: 'https://i.imgur.com/0svK58v.png' },
  { id: 750, name: 'MUÇARELA LA PAULINA 3,5 KG', category: 'Derivados de Leite', price: 31.16, image: 'https://i.imgur.com/gLIxEbw.png' },
  { id: 751, name: 'MUÇARELA LIRA 4 KG', category: 'Derivados de Leite', price: 31.75, image: 'https://i.imgur.com/kXjr3E5.png' },
  { id: 752, name: 'MUÇARELA LITORAL 4 KG', category: 'Derivados de Leite', price: 27.63, image: 'https://i.imgur.com/TaxWmPk.png' },
  { id: 753, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/9xHQawm.png' },
  { id: 754, name: 'MUÇARELA MONTE CASTELO 4 KG', category: 'Derivados de Leite', price: 29.4, image: 'https://i.imgur.com/OhJhrwn.png' },
  { id: 755, name: 'MUÇARELA NATVILLE 4 KG', category: 'Derivados de Leite', price: 31.08, image: 'https://i.imgur.com/UwqD17Z.png' },
  { id: 756, name: 'MUÇARELA PARAÍSO 4 KG', category: 'Derivados de Leite', price: 32.84, image: 'https://i.imgur.com/tcxNtiz.png' },
  { id: 757, name: 'MUÇARELA PILOTO 4 KG', category: 'Derivados de Leite', price: 28.22, image: 'https://i.imgur.com/zcWHsDd.png' },
  { id: 758, name: 'MUÇARELA POLENGHI 3,5 KG', category: 'Derivados de Leite', price: 34.1, image: 'https://i.imgur.com/N2w6BPl.png' },
  { id: 759, name: 'MUÇARELA PRIMO 4 KG', category: 'Derivados de Leite', price: 28.11, image: 'https://i.imgur.com/UE4xOYd.png' },
  { id: 760, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/XuqfGEq.png' },
  { id: 761, name: 'MUÇARELA QUATIGUÁ 4 KG', category: 'Derivados de Leite', price: 29.4, image: 'https://i.imgur.com/3ITXfjD.png' },
  { id: 762, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/jRzv9ru.png' },
  { id: 763, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/psyHIWD.png' },
  { id: 764, name: 'MUÇARELA SCALA 4 KG', category: 'Derivados de Leite', price: 37.03, image: 'https://i.imgur.com/7Any9Hq.png' },
  { id: 765, name: 'MUÇARELA TIROLEZ 4 KG', category: 'Derivados de Leite', price: 37.03, image: 'https://i.imgur.com/lfNTdNv.png' },
  { id: 766, name: 'MUÇARELA TRADIÇÃO 4 KG', category: 'Derivados de Leite', price: 35.46, image: 'https://i.imgur.com/Qhridh8.png' },
  { id: 767, name: 'MUÇARELA TRÊS MARIAS "MATO GROSSO" 4 KG', category: 'Derivados de Leite', price: 32.33, image: 'https://i.imgur.com/6I3X8vV.png' },
  { id: 768, name: 'MUÇARELA TRÊS MARIAS "MINAS GERAIS" 4 KG', category: 'Derivados de Leite', price: 31.75, image: 'https://i.imgur.com/6I3X8vV.png' },
  { id: 769, name: 'MUÇARELA TRÊS MARIAS RONDÔNIA "JARU" 4 KG', category: 'Derivados de Leite', price: 34.1, image: 'https://i.imgur.com/6I3X8vV.png' },
  { id: 770, name: 'MUÇARELA TRÊS MARIAS RONDÔNIA "OURO PRETO" 4 KG', category: 'Derivados de Leite', price: 35.28, image: 'https://i.imgur.com/6I3X8vV.png' },
  { id: 771, name: 'MUÇARELA VACA E BÚFALA BOCCONCINO YEMA 330 G', category: 'Derivados de Leite', price: 19.16, image: 'https://i.imgur.com/rPthqUi.png' },
  { id: 772, name: 'MUÇARELA VACA E BÚFALA CEREJAS YEMA 330 G', category: 'Derivados de Leite', price: 19.16, image: 'https://i.imgur.com/TxHzDv4.png' },
  { id: 773, name: 'MUÇARELA VACA E BÚFALA MARGHERITA YEMA 700 G', category: 'Derivados de Leite', price: 53.55, image: 'https://i.imgur.com/yiiqLi3.png' },
  { id: 774, name: 'MUÇARELA ZERO LACTOSE TRÊS MARIAS 4 KG', category: 'Derivados de Leite', price: 37.1, image: 'https://i.imgur.com/4XGmPqP.png' },
  { id: 775, name: 'NATA GRANDE FRIMESA 3,5 KG', category: 'Derivados de Leite', price: 160.49, image: 'https://i.imgur.com/AD3JiJW.png' },
  { id: 776, name: 'NATA PEQUENA FRIMESA 300 G', category: 'Derivados de Leite', price: 15.28, image: 'https://i.imgur.com/SY9e68i.png' },
  { id: 777, name: 'PARMESÃO 1 / 4 SCALA 1,35 KG', category: 'Derivados de Leite', price: 130.01, image: 'https://i.imgur.com/MgrT3kq.png' },
  { id: 778, name: 'PARMESÃO 6 MESES IPANEMA 6 KG', category: 'Derivados de Leite', price: 75.72, image: 'https://i.imgur.com/LubXYim.png' },
  { id: 779, name: 'PARMESÃO 6 MESES LA SERENISSIMA 8 KG', category: 'Derivados de Leite', price: 70.03, image: 'https://i.imgur.com/Z2XbUVH.png' },
  { id: 780, name: 'PARMESÃO 6 MESES PEQUENO SIBÉRIA 3 KG', category: 'Derivados de Leite', price: 71.58, image: 'https://i.imgur.com/9EnL4P1.png' },
  { id: 781, name: 'PARMESÃO 6 MESES POLENGHI 6,5 KG', category: 'Derivados de Leite', price: 67.41, image: 'https://i.imgur.com/m6BMjNO.png' },
  { id: 782, name: 'PARMESÃO 6 MESES SCALA 6 KG', category: 'Derivados de Leite', price: 80.52, image: 'https://i.imgur.com/lVBLmGh.png' },
  { id: 783, name: 'PARMESÃO 6 MESES SIBÉRIA 6 KG', category: 'Derivados de Leite', price: 71.58, image: 'https://i.imgur.com/MWiYNri.png' },
  { id: 784, name: 'PARMESÃO 6 MESES TIROLEZ 7 KG', category: 'Derivados de Leite', price: 69.02, image: 'https://i.imgur.com/Ar78UI6.png' },
  { id: 785, name: 'PARMESÃO 6 MESES VIGOR 8 KG', category: 'Derivados de Leite', price: 80.33, image: 'https://i.imgur.com/xMeFAbo.png' },
  { id: 786, name: 'PARMESÃO CAPA PRETA BURITIS 5 KG', category: 'Derivados de Leite', price: 70.16, image: 'https://i.imgur.com/IXDRkaW.png' },
  { id: 787, name: 'PARMESÃO FRACIONADO CAPA PRETA DOR 200 G', category: 'Derivados de Leite', price: 21.95, image: 'https://i.imgur.com/7sRCgpE.png' },
  { id: 788, name: 'PARMESÃO FRACIONADO QUATÁ 260 G', category: 'Derivados de Leite', price: 14.26, image: 'https://i.imgur.com/RN2DerK.png' },
  { id: 789, name: 'PARMESÃO FRACIONADO SCALA 180 G', category: 'Derivados de Leite', price: 18.66, image: 'https://i.imgur.com/XFkxhZK.png' },
  { id: 790, name: 'PARMESÃO FRACIONADO TIROLEZ 245 G', category: 'Derivados de Leite', price: 21.63, image: 'https://i.imgur.com/QofACfE.png' },
  { id: 791, name: 'PARMESÃO FRACIONADO VIGOR 200 G', category: 'Derivados de Leite', price: 25.67, image: 'https://i.imgur.com/7D1qEY8.png' },
  { id: 792, name: 'PARMESÃO MONTANHÊS CRISTAL 5 KG', category: 'Derivados de Leite', price: 38.75, image: 'https://i.imgur.com/xzpTdIy.png' },
  { id: 793, name: 'PARMESÃO MONTANHÊS SCALA 6 KG', category: 'Derivados de Leite', price: 84.61, image: 'https://i.imgur.com/aQWfKbz.png' },
  { id: 794, name: 'PARMESÃO MONTANHÊS TRÊS MARIAS 5 KG', category: 'Derivados de Leite', price: 48.57, image: 'https://i.imgur.com/bRZYM9l.png' },
  { id: 795, name: 'PARMESÃO PREMIUM 12 MESES SCALA 6 KG', category: 'Derivados de Leite', price: 97.14, image: 'https://i.imgur.com/CsLytiX.png' },
  { id: 796, name: 'PARMESÃO RALADO FINO RJR 1 KG', category: 'Derivados de Leite', price: 37.71, image: 'https://i.imgur.com/TOD5nAw.png' },
  { id: 797, name: 'PARMESÃO RALADO FINO S & A 1 KG', category: 'Derivados de Leite', price: 36.68, image: 'https://i.imgur.com/8LLSfRE.png' },
  { id: 798, name: 'PARMESÃO RALADO FINO VALEZA 1 KG', category: 'Derivados de Leite', price: 38.34, image: 'https://i.imgur.com/MYPiuuR.png' },
  { id: 799, name: 'PARMESÃO RALADO FINO VIGOR 1 KG', category: 'Derivados de Leite', price: 88.56, image: 'https://i.imgur.com/eXNz3CI.png' },
  { id: 800, name: 'PARMESÃO RALADO GROSSO RJR 1 KG', category: 'Derivados de Leite', price: 37.71, image: 'https://i.imgur.com/IMdWm6U.png' },
  { id: 801, name: 'PARMESÃO RALADO MÉDIO FILLETTINO 1 KG', category: 'Derivados de Leite', price: 42.82, image: 'https://i.imgur.com/efwKdKT.png' },
  { id: 802, name: 'PARMESÃO RALADO MÉDIO RJR 1 KG', category: 'Derivados de Leite', price: 37.71, image: 'https://i.imgur.com/N3VIl9r.png' },
  { id: 803, name: 'PARMESÃO SACHÊ RALADO FAIXA AZUL 10 G (CX 100 UN)', category: 'Derivados de Leite', price: 212.07, image: 'https://i.imgur.com/qyXymih.png' },
  { id: 804, name: 'PARMESÃO SACHÊ RALADO ITAMONTÊS 50 G (CX 20 UN)', category: 'Derivados de Leite', price: 63.91, image: 'https://i.imgur.com/XPvFAdR.png' },
  { id: 805, name: 'PARMESÃO SACHÊ RALADO LA SERENISSIMA 50 G (CX 20 UN)', category: 'Derivados de Leite', price: 111.18, image: 'https://i.imgur.com/obczlrw.png' },
  { id: 806, name: 'PARMESÃO SACHÊ RALADO SCALA 50 G (CX 20 UN)', category: 'Derivados de Leite', price: 25.5, image: 'https://i.imgur.com/dIpi0pS.png' },
  { id: 807, name: 'PARMESÃO SACHÊ RALADO VIGOR 50 G (CX 20 UN)', category: 'Derivados de Leite', price: 111.45, image: 'https://i.imgur.com/Twqdnyh.png' },
  { id: 808, name: 'PARMESÃO TROPICAL SAFIRA 6 KG', category: 'Derivados de Leite', price: 40.9, image: 'https://i.imgur.com/H0hVIbY.png' },
  { id: 809, name: 'PARMESÃO TROPICAL SERRA NOVA 6 KG', category: 'Derivados de Leite', price: 42.08, image: 'https://i.imgur.com/RURyCdL.png' },
  { id: 810, name: 'PROVOLONE CRISTAL 5 KG', category: 'Derivados de Leite', price: 37.07, image: 'https://i.imgur.com/R1H0sif.png' },
  { id: 811, name: 'PROVOLONE GRANDE TIROLEZ 10 KG', category: 'Derivados de Leite', price: 73.62, image: 'https://i.imgur.com/FUDYHxf.png' },
  { id: 812, name: 'PROVOLONE PEQUENO TRÊS MARIAS 2 KG', category: 'Derivados de Leite', price: 43.46, image: 'https://i.imgur.com/MuQkxBv.png' },
  { id: 813, name: 'PROVOLONE SCALA 5 KG', category: 'Derivados de Leite', price: 74.13, image: 'https://i.imgur.com/VBzBBe5.png' },
  { id: 814, name: 'PROVOLONE TÂNIA 5 KG', category: 'Derivados de Leite', price: 56.1, image: 'https://i.imgur.com/NKU8HOp.png' },
  { id: 815, name: 'PROVOLONE TIROLEZ 5 KG', category: 'Derivados de Leite', price: 73.62, image: 'https://i.imgur.com/HzrzbLc.png' },
  { id: 816, name: 'PROVOLONE TRÊS MARIAS 5 KG', category: 'Derivados de Leite', price: 43.46, image: 'https://i.imgur.com/os74EvT.png' },
  { id: 817, name: 'PROVOLONE YEMA 5 KG', category: 'Derivados de Leite', price: 42.18, image: 'https://i.imgur.com/B4Nvxdv.png' },
  { id: 818, name: 'PROVOLONETE SCALA 300 G', category: 'Derivados de Leite', price: 25.56, image: 'https://i.imgur.com/x3X4Ef9.png' },
  { id: 819, name: 'PROVOLONETE TIROLEZ 335 G', category: 'Derivados de Leite', price: 33.66, image: 'https://i.imgur.com/rk2FXNg.png' },
  { id: 820, name: 'QUEIJO BRIE FORMA POLENGHI 1 KG', category: 'Derivados de Leite', price: 66.56, image: 'https://i.imgur.com/dDC9kTo.png' },
  { id: 821, name: 'QUEIJO BRIE FORMA TIROLEZ 1 KG', category: 'Derivados de Leite', price: 77.18, image: 'https://i.imgur.com/bHHblYd.png' },
  { id: 822, name: 'QUEIJO BRIE FORMA YEMA 1 KG', category: 'Derivados de Leite', price: 56.22, image: 'https://i.imgur.com/WIkEWe8.png' },
  { id: 823, name: 'QUEIJO COALHO BARRA CORONATA 2 KG', category: 'Derivados de Leite', price: 43.31, image: 'https://i.imgur.com/U6GcASj.png' },
  { id: 824, name: 'QUEIJO COALHO BARRA CRISTAL 3,5 KG', category: 'Derivados de Leite', price: 40.49, image: 'https://i.imgur.com/kGTPDs8.png' },
  { id: 825, name: 'QUEIJO COALHO BARRA QUATÁ 7 KG', category: 'Derivados de Leite', price: 58.9, image: 'https://i.imgur.com/zevZGB3.png' },
  { id: 826, name: 'QUEIJO COALHO BARRA TRÊS MARIAS 7 KG', category: 'Derivados de Leite', price: 45.4, image: 'https://i.imgur.com/vBGzirv.png' },
  { id: 827, name: 'QUEIJO COALHO BARRA YEMA 3,5 KG', category: 'Derivados de Leite', price: 50.31, image: 'https://i.imgur.com/Lb1VQze.png' },
  { id: 828, name: 'QUEIJO COALHO ESPETO CORONATA PCT 6 UN', category: 'Derivados de Leite', price: 13.52, image: 'https://i.imgur.com/yyqOAIs.png' },
  { id: 829, name: 'QUEIJO COALHO ESPETO QUATÁ PCT 7 UN', category: 'Derivados de Leite', price: 18.14, image: 'https://i.imgur.com/2vzKEa3.png' },
  { id: 830, name: 'QUEIJO COALHO ESPETO SCALA PCT 7 UN', category: 'Derivados de Leite', price: 20.25, image: 'https://i.imgur.com/o4M0zLd.png' },
  { id: 831, name: 'QUEIJO COALHO ESPETO TIROLEZ PCT 7 UN', category: 'Derivados de Leite', price: 17.41, image: 'https://i.imgur.com/cUZFNz1.png' },
  { id: 832, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/4FpYpDG.png' },
  { id: 833, name: 'QUEIJO COTTAGE TIROLEZ 400 G', category: 'Derivados de Leite', price: 20.87, image: 'https://i.imgur.com/2tINrkp.png' },
  { id: 834, name: 'QUEIJO EMMENTAL YEMA 13 KG', category: 'Derivados de Leite', price: 72.15, image: 'https://i.imgur.com/HjYYnde.png' },
  { id: 835, name: 'QUEIJO ESTEPE IPANEMA 6 KG', category: 'Derivados de Leite', price: 65.01, image: 'https://i.imgur.com/iGETg1s.png' },
  { id: 836, name: 'QUEIJO ESTEPE TIROLEZ 7 KG', category: 'Derivados de Leite', price: 83.13, image: 'https://i.imgur.com/rUaTcFb.png' },
  { id: 837, name: 'QUEIJO FRACIONADO BRIE SÃO VICENTE 115 G', category: 'Derivados de Leite', price: 9.71, image: 'https://i.imgur.com/ramQFSb.png' },
  { id: 838, name: 'QUEIJO FRACIONADO CAMEMBERT SÃO VICENTE 125 G', category: 'Derivados de Leite', price: 11.66, image: 'https://i.imgur.com/xKtMyZz.png' },
  { id: 839, name: 'QUEIJO FRACIONADO CAMEMBERT YEMA 125 G', category: 'Derivados de Leite', price: 10.43, image: 'https://i.imgur.com/TrUFiyI.png' },
  { id: 840, name: 'QUEIJO FRACIONADO GRUYÉRE VIGOR 145 G', category: 'Derivados de Leite', price: 19.81, image: 'https://i.imgur.com/GvJ5B62.png' },
  { id: 841, name: 'QUEIJO GOUDA BELLA ITÁLIA 3 KG', category: 'Derivados de Leite', price: 55.71, image: 'https://i.imgur.com/stLHcpj.png' },
  { id: 842, name: 'QUEIJO GOUDA QUATÁ 3 KG', category: 'Derivados de Leite', price: 65.77, image: 'https://i.imgur.com/G84ScSF.png' },
  { id: 843, name: 'QUEIJO GOUDA TIROLEZ 3 KG', category: 'Derivados de Leite', price: 79.16, image: 'https://i.imgur.com/rYyw4c9.png' },
  { id: 844, name: 'QUEIJO GRUYÉRE DOR 12 KG', category: 'Derivados de Leite', price: 72.15, image: 'https://i.imgur.com/b4zBdww.png' },
  { id: 845, name: 'QUEIJO GRUYÉRE PEQUENO YEMA 7 KG', category: 'Derivados de Leite', price: 72.15, image: 'https://i.imgur.com/QCZ00Pp.png' },
  { id: 846, name: 'QUEIJO GRUYÉRE QUATÁ 12 KG', category: 'Derivados de Leite', price: 81.67, image: 'https://i.imgur.com/5r1vdM0.png' },
  { id: 847, name: 'QUEIJO MAASDAM SÃO VICENTE 12 KG', category: 'Derivados de Leite', price: 85.46, image: 'https://i.imgur.com/P7LJTL0.png' },
  { id: 848, name: 'QUEIJO MASCARPONE YEMA 350 G', category: 'Derivados de Leite', price: 20.85, image: 'https://i.imgur.com/fmBjTKS.png' },
  { id: 849, name: 'QUEIJO MINAS FRESCAL CORONATA 500 G', category: 'Derivados de Leite', price: 36.49, image: 'https://i.imgur.com/drT9HYR.png' },
  { id: 850, name: 'QUEIJO MINAS FRESCAL ITAMONTÊS 500 G', category: 'Derivados de Leite', price: 33.23, image: 'https://i.imgur.com/qN8kBbd.png' },
  { id: 851, name: 'QUEIJO MINAS FRESCAL POLENGHI 400 G', category: 'Derivados de Leite', price: 18.82, image: 'https://i.imgur.com/VOvGn94.png' },
  { id: 852, name: 'QUEIJO MINAS FRESCAL TIROLEZ 500 G', category: 'Derivados de Leite', price: 67.83, image: 'https://i.imgur.com/coYSsW2.png' },
  { id: 853, name: 'QUEIJO MINAS MEIA CURA SCALA 1 KG', category: 'Derivados de Leite', price: 73.23, image: 'https://i.imgur.com/CC9vobb.png' },
  { id: 854, name: 'QUEIJO MINAS PADRÃO CRIOULO 500 G', category: 'Derivados de Leite', price: 66.14, image: 'https://i.imgur.com/kemgQOD.png' },
  { id: 855, name: 'QUEIJO MINAS PADRÃO SCALA 500 G', category: 'Derivados de Leite', price: 71.95, image: 'https://i.imgur.com/7pcXn2c.png' },
  { id: 856, name: 'QUEIJO MINAS PADRÃO TRÊS MARIAS 500 G', category: 'Derivados de Leite', price: 48.57, image: 'https://i.imgur.com/nhL52LY.png' },
  { id: 857, name: 'QUEIJO POLENGUINHO POLENGHI 17 G', category: 'Derivados de Leite', price: 25.05, image: 'https://i.imgur.com/eGP7O2o.png' },
  { id: 858, name: 'QUEIJO PRATO APOLO 3,5 KG', category: 'Derivados de Leite', price: 32.58, image: 'https://i.imgur.com/lK3R0O3.png' },
  { id: 859, name: 'QUEIJO PRATO CORONATA 3,5 KG', category: 'Derivados de Leite', price: 38.61, image: 'https://i.imgur.com/cKJcAwV.png' },
  { id: 860, name: 'QUEIJO PRATO CRISTAL 3,5 KG', category: 'Derivados de Leite', price: 34.39, image: 'https://i.imgur.com/dNGHDjP.png' },
  { id: 861, name: 'QUEIJO PRATO DA VACA 3,5 KG', category: 'Derivados de Leite', price: 32.58, image: 'https://i.imgur.com/hB1Mjz4.png' },
  { id: 862, name: 'QUEIJO PRATO DEALE 2,8 KG', category: 'Derivados de Leite', price: 31.37, image: 'https://i.imgur.com/wOcElSJ.png' },
  { id: 863, name: 'QUEIJO PRATO ESFÉRICO TIROLEZ 2 KG', category: 'Derivados de Leite', price: 77.84, image: 'https://i.imgur.com/zBDqjIw.png' },
  { id: 864, name: 'QUEIJO PRATO FATIADO PROCESSADO 160 FATIAS VIGOR 2,24 KILO', category: 'Derivados de Leite', price: 89.89, image: 'https://i.imgur.com/sxKejua.png' },
  { id: 865, name: 'QUEIJO PRATO FATIADO PROCESSADO 184 FATIAS SCHREIBER 2,27 KILO', category: 'Derivados de Leite', price: 91.98, image: 'https://i.imgur.com/mEo3ael.png' },
  { id: 866, name: 'QUEIJO PRATO FATIADO PROCESSADO 192 FATIAS POLENGHI 2,73 KILO', category: 'Derivados de Leite', price: 100.47, image: 'https://i.imgur.com/DAs1G54.png' },
  { id: 867, name: 'QUEIJO PRATO FATIADO PROCESSADO SABOR AMERICAN CHEESE 25 FATIAS SCAR 500 G', category: 'Derivados de Leite', price: 23.73, image: 'https://i.imgur.com/7I67nvX.png' },
  { id: 868, name: 'QUEIJO PRATO FATIADO PROCESSADO SABOR CHEDDAR 25 FATIAS SCAR 500 G', category: 'Derivados de Leite', price: 23.73, image: 'https://i.imgur.com/e6PCY0f.png' },
  { id: 869, name: 'QUEIJO PRATO MONTE CASTELO 3,5 KG', category: 'Derivados de Leite', price: 31.97, image: 'https://i.imgur.com/rSx6FeS.png' },
  { id: 870, name: 'QUEIJO PRATO SCALA 3,5 KG', category: 'Derivados de Leite', price: 45.85, image: 'https://i.imgur.com/48xQLiu.png' },
  { id: 871, name: 'QUEIJO PRATO TIROLEZ 3,5 KG', category: 'Derivados de Leite', price: 39.82, image: 'https://i.imgur.com/liMieFQ.png' },
  { id: 872, name: 'QUEIJO PRATO TRÊS MARIAS 3,5 KG', category: 'Derivados de Leite', price: 38.61, image: 'https://i.imgur.com/3mflb6Y.png' },
  { id: 873, name: 'QUEIJO REINO TIROLEZ 1,6 KG', category: 'Derivados de Leite', price: 77.92, image: 'https://i.imgur.com/3dOVccV.png' },
  { id: 874, name: 'QUEIJO TIPO BURRATA DE BÚFALA DOR 180 G', category: 'Derivados de Leite', price: 21.09, image: 'https://i.imgur.com/axacJ43.png' },
  { id: 875, name: 'QUEIJO TIPO BURRATA DE BÚFALA LEVITARE 150 G', category: 'Derivados de Leite', price: 22.39, image: 'https://i.imgur.com/GQTbhuR.png' },
  { id: 876, name: 'REQUEIJÃO AFFAMATO COM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 12.97, image: 'https://i.imgur.com/VLWlv9t.png' },
  { id: 877, name: 'REQUEIJÃO CATUPIRY SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 59.9, image: 'https://i.imgur.com/12yWRVu.png' },
  { id: 878, name: 'REQUEIJÃO CATUPIRY SEM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 153.01, image: 'https://i.imgur.com/bCXwN64.png' },
  { id: 879, name: 'REQUEIJÃO CLARA MILK COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 15.93, image: 'https://i.imgur.com/HskPeT3.png' },
  { id: 880, name: 'REQUEIJÃO COPO CRIOULO SEM AMIDO 220 G (CX 24 UN)', category: 'Derivados de Leite', price: 290.38, image: 'https://i.imgur.com/psP7eqm.png' },
  { id: 881, name: 'REQUEIJÃO COPO GRANDE CATUPIRY SEM AMIDO 420 G (CX 15 UN)', category: 'Derivados de Leite', price: 20.04, image: 'https://i.imgur.com/2BD17wY.png' },
  { id: 882, name: 'REQUEIJÃO COPO GRANDE SCALA SEM AMIDO 380 G (CX 12 UN)', category: 'Derivados de Leite', price: 15.87, image: 'https://i.imgur.com/mPA3xR7.png' },
  { id: 883, name: 'REQUEIJÃO COPO GRANDE TIROLEZ SEM AMIDO 400 G (CX 12 UN)', category: 'Derivados de Leite', price: 14.52, image: 'https://i.imgur.com/zVZuW5p.png' },
  { id: 884, name: 'REQUEIJÃO COPO POÇOS DE CALDAS SEM AMIDO 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 233.23, image: 'https://i.imgur.com/aiFuTgX.png' },
  { id: 885, name: 'REQUEIJÃO COPO SCALA SEM AMIDO 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 100.84, image: 'https://i.imgur.com/CyTTTPY.png' },
  { id: 886, name: 'REQUEIJÃO COPO SUPREMO SEM AMIDO 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 47.12, image: 'https://i.imgur.com/dFm7SAF.png' },
  { id: 887, name: 'REQUEIJÃO COPO TIROLEZ SEM AMIDO 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 183.26, image: 'https://i.imgur.com/5c1aTig.png' },
  { id: 888, name: 'REQUEIJÃO CORONATA COM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 53.21, image: 'https://i.imgur.com/r3x2I2L.png' },
  { id: 889, name: 'REQUEIJÃO CORONATA COM GORDURA VEGETAL E AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 21.66, image: 'https://i.imgur.com/3NfcSmk.png' },
  { id: 890, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/cOvZZwF.png' },
  { id: 891, name: 'REQUEIJÃO CREMILLE COM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 10.13, image: 'https://i.imgur.com/RRrN6n0.png' },
  { id: 892, name: 'REQUEIJÃO DA FAZENDA "VERDE" COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 13.15, image: 'https://i.imgur.com/fONBrya.png' },
  { id: 893, name: 'REQUEIJÃO DALLORA COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 16.29, image: 'https://i.imgur.com/TJppcHR.png' },
  { id: 894, name: 'REQUEIJÃO DALLORA COM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 47.66, image: 'https://i.imgur.com/YBUBfvW.png' },
  { id: 895, name: 'REQUEIJÃO DANÚBIO SEM AMIDO 1 KILO', category: 'Derivados de Leite', price: 36.47, image: 'https://i.imgur.com/0dsfLPt.png' },
  { id: 896, name: 'REQUEIJÃO GALILEO COM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 13.69, image: 'https://i.imgur.com/hZIgzf7.png' },
  { id: 897, name: 'REQUEIJÃO IPANEMA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 42.53, image: 'https://i.imgur.com/hObOFBV.png' },
  { id: 898, name: 'REQUEIJÃO MILK TOP COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 11.82, image: 'https://i.imgur.com/n8PAlUM.png' },
  { id: 899, name: 'REQUEIJÃO PARMATO COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 31.73, image: 'https://i.imgur.com/rPP20Fx.png' },
  { id: 900, name: 'REQUEIJÃO PEQUENO CORONATA COM AMIDO 400 G', category: 'Derivados de Leite', price: 8.22, image: 'https://i.imgur.com/MMfGqud.png' },
  { id: 901, name: 'REQUEIJÃO PIZZALET COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 16.47, image: 'https://i.imgur.com/lqDbp1n.png' },
  { id: 902, name: 'REQUEIJÃO QUATÁ SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 39.21, image: 'https://i.imgur.com/m60k9Vd.png' },
  { id: 903, name: 'REQUEIJÃO REKEMINAS COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 11.89, image: 'https://i.imgur.com/zCOPyVG.png' },
  { id: 904, name: 'REQUEIJÃO ROSELI SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 42.23, image: 'https://i.imgur.com/ZYbWI5b.png' },
  { id: 905, name: 'REQUEIJÃO SABOR CHEDDAR CATUPIRY 1,010 KILO', category: 'Derivados de Leite', price: 46.97, image: 'https://i.imgur.com/L5r0pWk.png' },
  { id: 906, name: 'REQUEIJÃO SABOR CHEDDAR CORONATA 1,5 KILO', category: 'Derivados de Leite', price: 45.85, image: 'https://i.imgur.com/Sg4CtRH.png' },
  { id: 907, name: 'REQUEIJÃO SABOR CHEDDAR PEQUENO CORONATA 240 G', category: 'Derivados de Leite', price: 9.84, image: 'https://i.imgur.com/476hY4G.png' },
  { id: 908, name: 'REQUEIJÃO SABOR CHEDDAR POLENGHI 1,5 KILO', category: 'Derivados de Leite', price: 57.07, image: 'https://i.imgur.com/iosiDVe.png' },
  { id: 909, name: 'REQUEIJÃO SABOR CHEDDAR SCALA 1,5 KILO', category: 'Derivados de Leite', price: 33.54, image: 'https://i.imgur.com/22lCytC.png' },
  { id: 910, name: 'REQUEIJÃO SABOR CHEDDAR SCALON 1,02 KILO', category: 'Derivados de Leite', price: 32.45, image: 'https://i.imgur.com/ISHfcEV.png' },
  { id: 911, name: 'REQUEIJÃO SABOR CHEDDAR SOFFICE 1,2 KILO', category: 'Derivados de Leite', price: 37.16, image: 'https://i.imgur.com/BhNJpjg.png' },
  { id: 912, name: 'REQUEIJÃO SABOR CHEDDAR TIROLEZ 1,5 KILO', category: 'Derivados de Leite', price: 49.95, image: 'https://i.imgur.com/USvM15z.png' },
  { id: 913, name: 'REQUEIJÃO SABOR CHEDDAR VALEZA 1,003 KILO', category: 'Derivados de Leite', price: 28.83, image: 'https://i.imgur.com/mcAWJp0.png' },
  { id: 914, name: 'REQUEIJÃO SCALA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 43.42, image: 'https://i.imgur.com/FwiSygp.png' },
  { id: 915, name: 'REQUEIJÃO SCALA SEM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 122.17, image: 'https://i.imgur.com/GkQe32x.png' },
  { id: 916, name: 'REQUEIJÃO SCALON SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 42.83, image: 'https://i.imgur.com/eCtdWZR.png' },
  { id: 917, name: 'REQUEIJÃO TIROLEZ SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 42.7, image: 'https://i.imgur.com/kbJqXn5.png' },
  { id: 918, name: 'REQUEIJÃO TIROLEZ SEM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 101.41, image: 'https://i.imgur.com/YWEIJxJ.png' },
  { id: 919, name: 'REQUEIJÃO TOP MILK COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 13.88, image: 'https://i.imgur.com/OiC5Kae.png' },
  { id: 920, name: 'REQUEIJÃO TRADICIONAL CORONATA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 44.04, image: 'https://i.imgur.com/b7GTwSH.png' },
  { id: 921, name: 'REQUEIJÃO TRADICIONAL DALLORA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 45.6, image: 'https://i.imgur.com/Plvq7ds.png' },
  { id: 922, name: 'REQUEIJÃO TRADICIONAL SOFFICE SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 41.71, image: 'https://i.imgur.com/4Z9hNjh.png' },
  { id: 923, name: 'REQUEIJÃO TRÊS MARIAS SEM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 34.39, image: 'https://i.imgur.com/YRnBruN.png' },
  { id: 924, name: 'REQUEIJÃO VALE DO PARDO COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 11.94, image: 'https://i.imgur.com/NYErpqd.png' },
  { id: 925, name: 'REQUEIJÃO VALEZA SEM AMIDO 1,003 KILO', category: 'Derivados de Leite', price: 27.63, image: 'https://i.imgur.com/5AJcITc.png' },
  { id: 926, name: 'REQUEIJÃO VIGOR SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 42.23, image: 'https://i.imgur.com/lg2Ja6Y.png' },
  { id: 927, name: 'REQUEIJÃO YEMA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 34.45, image: 'https://i.imgur.com/6lSLAHF.png' },
  { id: 928, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/fx3iDbB.png' },
  { id: 929, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/wFwavbK.png' },
  { id: 930, name: 'RICOTA FRESCA CORONATA 520 G', category: 'Derivados de Leite', price: 15.49, image: 'https://i.imgur.com/3yy6PFM.png' },
  { id: 931, name: 'RICOTA FRESCA YEMA 400 G', category: 'Derivados de Leite', price: 13.16, image: 'https://i.imgur.com/H9yDYHo.png' },
  { id: 932, name: 'APRESUNTADO AURORA 3,7 KILO PÇ', category: 'Derivados de Suíno', price: 72.91, image: 'https://i.imgur.com/p0NS0so.png' },
  { id: 933, name: 'APRESUNTADO DÁLIA 3,7 KILO PÇ', category: 'Derivados de Suíno', price: 56.79, image: 'https://i.imgur.com/Nw1nxqp.png' },
  { id: 934, name: 'APRESUNTADO DELI GOURMET 3,35 KILO PÇ', category: 'Derivados de Suíno', price: 61.11, image: 'https://i.imgur.com/C3GUInY.png' },
  { id: 935, name: 'APRESUNTADO PEPERI AURORA 3,7 KILO PÇ', category: 'Derivados de Suíno', price: 63.62, image: 'https://i.imgur.com/snPNSQf.png' },
  { id: 936, name: 'APRESUNTADO PERDIGÃO 3,5 KILO PÇ', category: 'Derivados de Suíno', price: 70.98, image: 'https://i.imgur.com/11gcRrt.png' },
  { id: 937, name: 'APRESUNTADO PRIETO 3,65 KILO PÇ', category: 'Derivados de Suíno', price: 76.68, image: 'https://i.imgur.com/EzKlvo7.png' },
  { id: 938, name: 'APRESUNTADO REZENDE 3,4 KILO PÇ', category: 'Derivados de Suíno', price: 64.44, image: 'https://i.imgur.com/CddqyjS.png' },
  { id: 939, name: 'APRESUNTADO SADIA 3,5 KILO PÇ', category: 'Derivados de Suíno', price: 78.98, image: 'https://i.imgur.com/Z8KNDGW.png' },
  { id: 940, name: 'APRESUNTADO SEARA 3,5 KILO PÇ', category: 'Derivados de Suíno', price: 68.08, image: 'https://i.imgur.com/xAacEJb.png' },
  { id: 941, name: 'BACON EM CUBOS "BARRIGA" LACTOFRIOS 1 KILO PCT', category: 'Derivados de Suíno', price: 38.28, image: 'https://i.imgur.com/ZrwZsL5.png' },
  { id: 942, name: 'BACON EM CUBOS "PERNIL" LACTOFRIOS 1 KILO PCT', category: 'Derivados de Suíno', price: 30.23, image: 'https://i.imgur.com/2jY9DPp.png' },
  { id: 943, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/92mkmif.png' },
  { id: 944, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/jGMewGh.png' },
  { id: 945, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/OWftbR0.png' },
  { id: 946, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/cCyYkeS.png' },
  { id: 947, name: 'BACON EM CUBOS PALETA BESSER 1,5 KILO PCT', category: 'Derivados de Suíno', price: 31.7, image: 'https://i.imgur.com/fxzTvLE.png' },
  { id: 948, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/QbqEXJs.png' },
  { id: 949, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/k5HKAkt.png' },
  { id: 950, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/zw9hweq.png' },
  { id: 951, name: 'BACON ESPECIAL SEARA 5 KILO KILO', category: 'Derivados de Suíno', price: 28.05, image: 'https://i.imgur.com/JyALwJk.png' },
  { id: 952, name: 'BACON FATIADO "BARRIGA" BRASA 1 KILO PCT', category: 'Derivados de Suíno', price: 61.99, image: 'https://i.imgur.com/uYwaXkQ.png' },
  { id: 953, name: 'BACON FATIADO "PALETA" BRASA 1 KILO PCT', category: 'Derivados de Suíno', price: 33.39, image: 'https://i.imgur.com/5j07Z1C.png' },
  { id: 954, name: 'BACON FATIADO "PALETA" MISTER BEEF 1 KILO PCT', category: 'Derivados de Suíno', price: 37.67, image: 'https://i.imgur.com/dvfEiuu.png' },
  { id: 955, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/VFAHEVI.png' },
  { id: 956, name: 'BACON FATIADO "PAPADA" MISTER BEEF 1 KILO PCT', category: 'Derivados de Suíno', price: 38.69, image: 'https://i.imgur.com/UtttdVY.png' },
  { id: 957, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/utmvvXs.png' },
  { id: 958, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/339J7GV.png' },
  { id: 959, name: 'BACON FATIADO LACTOFRIOS 1 KILO PCT', category: 'Derivados de Suíno', price: 35.5, image: 'https://i.imgur.com/gQ02bPt.png' },
  { id: 960, name: 'BACON FATIADO PALETA BESSER 1,5 KILO PCT', category: 'Derivados de Suíno', price: 46.78, image: 'https://i.imgur.com/oqypIO3.png' },
  { id: 961, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/QXLhROJ.png' },
  { id: 962, name: 'BACON FATIADO REDONDO PALETA MISTER BEEF 1 KILO PCT', category: 'Derivados de Suíno', price: 37.22, image: 'https://i.imgur.com/Qv5nPtb.png' },
  { id: 963, name: 'BACON FATIADO SEARA GOURMET 2,5 KILO PCT', category: 'Derivados de Suíno', price: 114.11, image: 'https://i.imgur.com/qvZ80WN.png' },
  { id: 964, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/JsFBEm0.png' },
  { id: 965, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/e8y8jKF.png' },
  { id: 966, name: 'BACON MANTA PERDIGÃO 4 KG KG', category: 'Derivados de Suíno', price: 30.97, image: 'https://i.imgur.com/A30S0YI.png' },
  { id: 967, name: 'BACON MANTA REZENDE 4 KG KG', category: 'Derivados de Suíno', price: 28.99, image: 'https://i.imgur.com/8pAjSz2.png' },
  { id: 968, name: 'BACON MANTA SADIA 3.4 KG KG', category: 'Derivados de Suíno', price: 30.97, image: 'https://i.imgur.com/hc1upMr.png' },
  { id: 969, name: 'BACON MÉDIO AURORA 3.7 KG KG', category: 'Derivados de Suíno', price: 40.16, image: 'https://i.imgur.com/iOBCAqj.png' },
  { id: 970, name: 'BACON PALETA DÁLIA 4.5 KG KG', category: 'Derivados de Suíno', price: 25.71, image: 'https://i.imgur.com/kTFJQ6a.png' },
  { id: 971, name: 'BACON PALETA FRICASA 4 KG KG', category: 'Derivados de Suíno', price: 27.35, image: 'https://i.imgur.com/5HM94Pc.png' },
  { id: 972, name: 'BANHA AURORA 1 KG PCT', category: 'Derivados de Suíno', price: 16.07, image: 'https://i.imgur.com/ENCeNmT.png' },
  { id: 973, name: 'BANHA COOPAVEL 1 KG PCT', category: 'Derivados de Suíno', price: 12.63, image: 'https://i.imgur.com/B1LumWw.png' },
  { id: 974, name: 'BARRIGA SUÍNA CONGELADA FRIELLA 5 KG KG', category: 'Derivados de Suíno', price: 25.82, image: 'https://i.imgur.com/NgAuQYE.png' },
  { id: 975, name: 'BARRIGA SUÍNA CONGELADA FRIORI 8 KG KG', category: 'Derivados de Suíno', price: 23.01, image: 'https://i.imgur.com/8ux5Nrz.png' },
  { id: 976, name: 'BISTECA SUÍNA CONGELADA FRIMESA (CX 5 KG) CX', category: 'Derivados de Suíno', price: 108.4, image: 'https://i.imgur.com/LscrVgg.png' },
  { id: 977, name: 'BISTECA SUÍNA CONGELADA PAMPLONA (CX 10 KG)', category: 'Derivados de Suíno', price: 196.06, image: 'https://i.imgur.com/B3G0Qxc.png' },
  { id: 978, name: 'CALABRESA AURORA 5 KILO', category: 'Derivados de Suíno', price: 110.42, image: 'https://i.imgur.com/eu9D48E.png' },
  { id: 979, name: 'CALABRESA BRASA 2 KILO', category: 'Derivados de Suíno', price: 40.03, image: 'https://i.imgur.com/peQ7ihP.png' },
  { id: 980, name: 'CALABRESA CERATTI 2.5 KILO', category: 'Derivados de Suíno', price: 54.16, image: 'https://i.imgur.com/uoxNc9D.png' },
  { id: 981, name: 'CALABRESA FATIADA CONGELADA FRIMESA 1 KILO', category: 'Derivados de Suíno', price: 25.98, image: 'https://i.imgur.com/hAsqeC8.png' },
  { id: 982, name: 'CALABRESA FATIADA RESFRIADA CERATTI 1 KILO', category: 'Derivados de Suíno', price: 40.34, image: 'https://i.imgur.com/YRbUrbd.png' },
  { id: 983, name: 'CALABRESA FATIADA RESFRIADA LACTOFRIOS 1 KILO', category: 'Derivados de Suíno', price: 21.33, image: 'https://i.imgur.com/xSQeHaN.png' },
  { id: 984, name: 'CALABRESA FATIADA RESFRIADA MISTER BEEF 1 KILO', category: 'Derivados de Suíno', price: 22.92, image: 'https://i.imgur.com/PM0b7zw.png' },
  { id: 985, name: 'CALABRESA FRICASA 2.5 KILO', category: 'Derivados de Suíno', price: 47.54, image: 'https://i.imgur.com/MOaWZUs.png' },
  { id: 986, name: 'CALABRESA FRIMESA 2.5 KILO', category: 'Derivados de Suíno', price: 52.74, image: 'https://i.imgur.com/QDdW7S7.png' },
  { id: 987, name: 'CALABRESA LACTOFRIOS 2 KILO', category: 'Derivados de Suíno', price: 36.28, image: 'https://i.imgur.com/xEvOsZH.png' },
  { id: 988, name: 'CALABRESA NOBRE 2 KILO', category: 'Derivados de Suíno', price: 44.04, image: 'https://i.imgur.com/KGhZ3Y2.png' },
  { id: 989, name: 'CALABRESA PAMPLONA 2.5 KILO', category: 'Derivados de Suíno', price: 49.73, image: 'https://i.imgur.com/rXxDMbi.png' },
  { id: 990, name: 'CALABRESA PRIETO 5 KILO', category: 'Derivados de Suíno', price: 102.64, image: 'https://i.imgur.com/JbEkOwJ.png' },
  { id: 991, name: 'CALABRESA PURA PRIETO 5 KILO', category: 'Derivados de Suíno', price: 192.9, image: 'https://i.imgur.com/taiTkum.png' },
  { id: 992, name: 'CALABRESA RETA AURORA 3 KILO', category: 'Derivados de Suíno', price: 71.99, image: 'https://i.imgur.com/JwLYsHJ.png' },
  { id: 993, name: 'CALABRESA RETA BRASA 2 KILO', category: 'Derivados de Suíno', price: 40.03, image: 'https://i.imgur.com/gwVmx6v.png' },
  { id: 994, name: 'CALABRESA RETA CERATTI 2.5 KILO', category: 'Derivados de Suíno', price: 65.47, image: 'https://i.imgur.com/WT2JYzb.png' },
  { id: 995, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/vu0nLvc.png' },
  { id: 996, name: 'CALABRESA RETA PAMPLONA 2.5 KILO', category: 'Derivados de Suíno', price: 51.23, image: 'https://i.imgur.com/TGVH30X.png' },
  { id: 997, name: 'CALABRESA RETA PRIETO 2.5 KILO', category: 'Derivados de Suíno', price: 56.32, image: 'https://i.imgur.com/BVboaTK.png' },
  { id: 998, name: 'CALABRESA RETA SADIA 2.5 KILO', category: 'Derivados de Suíno', price: 56.42, image: 'https://i.imgur.com/RAAgvaC.png' },
  { id: 999, name: 'CALABRESA RETA SEARA 2.5 KILO', category: 'Derivados de Suíno', price: 57.17, image: 'https://i.imgur.com/NRcrQmb.png' },
  { id: 1000, name: 'CALABRESA SADIA 2.5 KILO', category: 'Derivados de Suíno', price: 55.84, image: 'https://i.imgur.com/bCKr7WO.png' },
  { id: 1001, name: 'CALABRESA SEARA 2.5 KILO', category: 'Derivados de Suíno', price: 53.63, image: 'https://i.imgur.com/XbAsHnn.png' },
  { id: 1002, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/BVqXpF4.png' },
  { id: 1003, name: 'COPA FATIADA AURORA 100 G PCT', category: 'Derivados de Suíno', price: 14.57, image: 'https://i.imgur.com/56PAqpp.png' },
  { id: 1004, name: 'COSTELA SUÍNA CONGELADA COM OSSO AURORA 1.5 KG', category: 'Derivados de Suíno', price: 23.9, image: 'https://i.imgur.com/z2NWG2U.png' },
  { id: 1005, name: 'COSTELA SUÍNA CONGELADA COM OSSO FRIVATTI / FRIELLA 4 KG', category: 'Derivados de Suíno', price: 21.73, image: 'https://i.imgur.com/5RuuJIP.png' },
  { id: 1006, name: 'COSTELA SUÍNA CONGELADA TEMPERADA PAMPLONA 1 KG', category: 'Derivados de Suíno', price: 28.76, image: 'https://i.imgur.com/U62J2AF.png' },
  { id: 1007, name: 'COSTELA SUÍNA SALGADA REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 143.79, image: 'https://i.imgur.com/TDSTO5D.png' },
  { id: 1008, name: 'FILÉ MIGNON SUÍNO CONGELADO TEMPERADO PAMPLONA 1.3 KG', category: 'Derivados de Suíno', price: 29.4, image: 'https://i.imgur.com/KJouU29.png' },
  { id: 1009, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/w8Lqpqk.png' },
  { id: 1010, name: 'LINGUIÇA SUÍNA CONGELADA COM ALHO SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 15.9, image: 'https://i.imgur.com/NN4cNdZ.png' },
  { id: 1011, name: 'LINGUIÇA SUÍNA CONGELADA COM AZEITONAS SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 15.9, image: 'https://i.imgur.com/tRHbNGK.png' },
  { id: 1012, name: 'LINGUIÇA SUÍNA CONGELADA COM BACON SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 15.86, image: 'https://i.imgur.com/z7F3vMH.png' },
  { id: 1013, name: 'LINGUIÇA SUÍNA CONGELADA COM PIMENTA SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 15.9, image: 'https://i.imgur.com/30VGz9c.png' },
  { id: 1014, name: 'LINGUIÇA SUÍNA CONGELADA COM PROVOLONE SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 15.9, image: 'https://i.imgur.com/CSetcvU.png' },
  { id: 1015, name: 'LINGUIÇA SUÍNA CONGELADA CUIABANA COM QUEIJO SABOR DE BRAGANÇA 500 G PCT', category: 'Derivados de Suíno', price: 19.48, image: 'https://i.imgur.com/MtZqkVB.png' },
  { id: 1016, name: 'LINGUIÇA TOSCANA CONGELADA AURORA 5 KILO PCT', category: 'Derivados de Suíno', price: 123.92, image: 'https://i.imgur.com/8oGhvPL.png' },
  { id: 1017, name: 'LINGUIÇA TOSCANA CONGELADA NA BRASA PERDIGÃO 5 KILO PCT', category: 'Derivados de Suíno', price: 122.51, image: 'https://i.imgur.com/V1hvFeO.png' },
  { id: 1018, name: 'LINGUIÇA TOSCANA CONGELADA SADIA 5 KILO PCT', category: 'Derivados de Suíno', price: 103.25, image: 'https://i.imgur.com/LLYBv4e.png' },
  { id: 1019, name: 'LINGUIÇA TOSCANA CONGELADA SEARA 5 KILO PCT', category: 'Derivados de Suíno', price: 89.68, image: 'https://i.imgur.com/XhfxJIY.png' },
  { id: 1020, name: 'LOMBO CANADENSE AURORA 0.750G KG', category: 'Derivados de Suíno', price: 44.19, image: 'https://i.imgur.com/vwGyXk8.png' },
  { id: 1021, name: 'LOMBO CANADENSE CERATTI 1 KG', category: 'Derivados de Suíno', price: 46.1, image: 'https://i.imgur.com/hjVHusw.png' },
  { id: 1022, name: 'LOMBO CANADENSE DELI GOURMET 0.750G KG', category: 'Derivados de Suíno', price: 27.03, image: 'https://i.imgur.com/1uMkkwN.png' },
  { id: 1023, name: 'LOMBO CANADENSE LACTOFRIOS  1 KG', category: 'Derivados de Suíno', price: 33.92, image: 'https://i.imgur.com/lMIZ6hJ.png' },
  { id: 1024, name: 'LOMBO CANADENSE NOBRE  1 KG', category: 'Derivados de Suíno', price: 41.25, image: 'https://i.imgur.com/wrEkM1z.png' },
  { id: 1025, name: 'LOMBO CANADENSE SEARA GOURMET  1 KG', category: 'Derivados de Suíno', price: 45.5, image: 'https://i.imgur.com/fF5P9hU.png' },
  { id: 1026, name: 'LOMBO SUÍNO CONGELADO TEMPERADO PAMPLONA  1 KG', category: 'Derivados de Suíno', price: 29.4, image: 'https://i.imgur.com/bmVWPtF.png' },
  { id: 1027, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/OH85IXP.png' },
  { id: 1028, name: 'LOMBO SUÍNO SALGADO REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 150.18, image: 'https://i.imgur.com/0aNB7Y9.png' },
  { id: 1029, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/u8EyZmM.png' },
  { id: 1030, name: 'MORTADELA DEFUMADA OURO PERDIGÃO 4 KG', category: 'Derivados de Suíno', price: 23.39, image: 'https://i.imgur.com/RLLALYh.png' },
  { id: 1031, name: 'MORTADELA REZENDE 5 KG', category: 'Derivados de Suíno', price: 9.48, image: 'https://i.imgur.com/G2TEWPo.png' },
  { id: 1032, name: 'MORTADELA TRADICIONAL AURORA 5 KG', category: 'Derivados de Suíno', price: 11.99, image: 'https://i.imgur.com/ZRF2A9s.png' },
  { id: 1033, name: 'MORTADELA TRADICIONAL BOLOGNA CERATTI 6 KG', category: 'Derivados de Suíno', price: 45.26, image: 'https://i.imgur.com/rHo7GaU.png' },
  { id: 1034, name: 'MORTADELA TRADICIONAL MARBA 5 KG', category: 'Derivados de Suíno', price: 12.31, image: 'https://i.imgur.com/MArz8B2.png' },
  { id: 1035, name: 'ORELHA SUÍNA SALGADA COM MÁSCARA FRIELLA 10 KILO PCT', category: 'Derivados de Suíno', price: 113.75, image: 'https://i.imgur.com/YfvYp5i.png' },
  { id: 1036, name: 'ORELHA SUÍNA SALGADA COM MÁSCARA REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 69.66, image: 'https://i.imgur.com/6JdXYmp.png' },
  { id: 1037, name: 'PAIO SUÍNO PAMPLONA 2.5 KILO PCT', category: 'Derivados de Suíno', price: 62.62, image: 'https://i.imgur.com/ZEH5u4n.png' },
  { id: 1038, name: 'PAIO SUÍNO SEARA 2.5 KILO PCT', category: 'Derivados de Suíno', price: 65.97, image: 'https://i.imgur.com/1IXAs5S.png' },
  { id: 1039, name: 'PANCETA SUÍNA CONGELADA TEMPERADA APERITIVO FRIMESA 1 KILO PCT', category: 'Derivados de Suíno', price: 27.73, image: 'https://i.imgur.com/RMeK8Qb.png' },
  { id: 1040, name: 'PANCETA SUÍNA CONGELADA TEMPERADA PAMPLONA 1 KG', category: 'Derivados de Suíno', price: 33.23, image: 'https://i.imgur.com/Z2kh7Gx.png' },
  { id: 1041, name: 'PARMA PRESUNTO CRU DESOSSADO ITALIANO PANINI 1 KG', category: 'Derivados de Suíno', price: 140.59, image: 'https://i.imgur.com/aIBnWlB.png' },
  { id: 1042, name: 'PARMA PRESUNTO CRU FATIADO ITALIANO CERATTI 100 G PCT', category: 'Derivados de Suíno', price: 18.56, image: 'https://i.imgur.com/JyY4msg.png' },
  { id: 1043, name: 'PARMA PRESUNTO CRU FATIADO ITALIANO DOR 80 G PCT', category: 'Derivados de Suíno', price: 18.21, image: 'https://i.imgur.com/dO6JEP9.png' },
  { id: 1044, name: 'PARMA PRESUNTO CRU FATIADO ITALIANO VITO BALDUCCI 500 G PCT', category: 'Derivados de Suíno', price: 66.84, image: 'https://i.imgur.com/fdGvni0.png' },
  { id: 1045, name: 'PARMA PRESUNTO CRU FATIADO NACIONAL SADIA 100 G PCT', category: 'Derivados de Suíno', price: 31.19, image: 'https://i.imgur.com/Zo9XzYg.png' },
  { id: 1046, name: 'PÉ SUÍNO SALGADO FRIELLA 10 KILO PCT', category: 'Derivados de Suíno', price: 121.42, image: 'https://i.imgur.com/8uLeMsN.png' },
  { id: 1047, name: 'PÉ SUÍNO SALGADO REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 60.72, image: 'https://i.imgur.com/Y9iLa7W.png' },
  { id: 1048, name: 'PEPPERONI FATIADO CERATTI 1 KILO PCT', category: 'Derivados de Suíno', price: 71.32, image: 'https://i.imgur.com/vWBhmIJ.png' },
  { id: 1049, name: 'PEPPERONI FATIADO FRIMESA 1 KILO PCT', category: 'Derivados de Suíno', price: 31.89, image: 'https://i.imgur.com/6Qoov6W.png' },
  { id: 1050, name: 'PEPPERONI FATIADO SADIA 1 KILO PCT', category: 'Derivados de Suíno', price: 99.79, image: 'https://i.imgur.com/QhrOKDZ.png' },
  { id: 1051, name: 'PEPPERONI FATIADO SEARA GOURMET 100 G PCT', category: 'Derivados de Suíno', price: 10.43, image: 'https://i.imgur.com/d6AmPEC.png' },
  { id: 1052, name: 'PERNIL SUÍNO CONGELADO DESFIADO ALFAMA 1 KILO PCT', category: 'Derivados de Suíno', price: 38.42, image: 'https://i.imgur.com/cFrpBzR.png' },
  { id: 1053, name: 'PERNIL SUÍNO CONGELADO SEM OSSO E SEM COURO FRIVATTI / FRIELLA 12 KG', category: 'Derivados de Suíno', price: 19.27, image: 'https://i.imgur.com/HFRNemS.png' },
  { id: 1054, name: 'PERNIL SUÍNO CONGELADO SEM OSSO TEMPERADO PAMPLONA 1 KG', category: 'Derivados de Suíno', price: 27.39, image: 'https://i.imgur.com/kDcuuUp.png' },
  { id: 1055, name: 'PERNIL SUÍNO SALGADO REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 125.9, image: 'https://i.imgur.com/DyBYdin.png' },
  { id: 1056, name: 'PICANHA SUÍNA CONGELADA TEMPERADA PAMPLONA 1 KG', category: 'Derivados de Suíno', price: 33.23, image: 'https://i.imgur.com/77sLmei.png' },
  { id: 1057, name: 'PORCO A PASSARINHO CONGELADO TEMPERADO FRIMESA 1 KILO PCT', category: 'Derivados de Suíno', price: 27.3, image: 'https://i.imgur.com/Xgf0bHh.png' },
  { id: 1058, name: 'PRESUNTO AURORA 3.5 KILO PÇ', category: 'Derivados de Suíno', price: 89.5, image: 'https://i.imgur.com/OrkMpUi.png' },
  { id: 1059, name: 'PRESUNTO DÁLIA 3.3 KILO PÇ', category: 'Derivados de Suíno', price: 74.09, image: 'https://i.imgur.com/XOYlXlu.png' },
  { id: 1060, name: 'PRODUTO EM FALTA', category: 'Derivados de Suíno', price: 0, image: 'https://i.imgur.com/nXo9oNK.png' },
  { id: 1061, name: 'PRESUNTO PERDIGÃO 3.4 KILO PÇ', category: 'Derivados de Suíno', price: 88.34, image: 'https://i.imgur.com/unA51c5.png' },
  { id: 1062, name: 'PRESUNTO PRIETO 3.35 KILO PÇ', category: 'Derivados de Suíno', price: 81.08, image: 'https://i.imgur.com/9Hhipgd.png' },
  { id: 1063, name: 'PRESUNTO REZENDE 3.4 KILO PÇ', category: 'Derivados de Suíno', price: 77.23, image: 'https://i.imgur.com/xwIv7bR.png' },
  { id: 1064, name: 'PRESUNTO SADIA 3.45 KILO PÇ', category: 'Derivados de Suíno', price: 102.21, image: 'https://i.imgur.com/jYdJvz5.png' },
  { id: 1065, name: 'PRESUNTO SEARA 3.5 KILO PÇ', category: 'Derivados de Suíno', price: 82.58, image: 'https://i.imgur.com/EdruuYG.png' },
  { id: 1066, name: 'RABO SUÍNO SALGADO COM SUAN REFFINATO 5 KILO PCT', category: 'Derivados de Suíno', price: 120.79, image: 'https://i.imgur.com/NWlE5JO.png' },
  { id: 1067, name: 'RABO SUÍNO SALGADO SEM SUAN FRIELLA 10 KILO PCT', category: 'Derivados de Suíno', price: 165.75, image: 'https://i.imgur.com/ao6sOgf.png' },
  { id: 1068, name: 'ROSBEEF CERATTI 3 KILO PÇ', category: 'Derivados de Suíno', price: 103.06, image: 'https://i.imgur.com/j2rSn55.png' },
  { id: 1069, name: 'SALAME HAMBURGUÊS FATIADO DEFUMADO CERATTI 100 G PCT', category: 'Derivados de Suíno', price: 12.22, image: 'https://i.imgur.com/XyB5EJB.png' },
  { id: 1070, name: 'SALAME ITALIANO DEFUMADO AURORA 0.600 G KG', category: 'Derivados de Suíno', price: 79.68, image: 'https://i.imgur.com/QL6wEmj.png' },
  { id: 1071, name: 'SALAME ITALIANO DEFUMADO CERATTI 0.600 G KG', category: 'Derivados de Suíno', price: 88.55, image: 'https://i.imgur.com/B9Ye3ST.png' },
  { id: 1072, name: 'SALAME ITALIANO FATIADO DEFUMADO CERATTI 100 G PCT', category: 'Derivados de Suíno', price: 12.22, image: 'https://i.imgur.com/qHewMon.png' },
  { id: 1073, name: 'SALAME ITALIANO SADIA 0.600 G KG', category: 'Derivados de Suíno', price: 85.11, image: 'https://i.imgur.com/Dyk45At.png' },
  { id: 1074, name: 'SALAME ITALIANO SEARA GOURMET 0.675 G KG', category: 'Derivados de Suíno', price: 71.99, image: 'https://i.imgur.com/6Hcd24K.png' },
  { id: 1075, name: 'SALSICHA CONGELADA HOT DOG AURORA 3 KILO PCT', category: 'Derivados de Suíno', price: 34.52, image: 'https://i.imgur.com/un3fqwO.png' },
  { id: 1076, name: 'SALSICHA CONGELADA HOT DOG ESTRELA 3 KILO PCT', category: 'Derivados de Suíno', price: 27.42, image: 'https://i.imgur.com/nVKoynf.png' },
  { id: 1077, name: 'SALSICHA CONGELADA HOT DOG PERDIGÃO 5 KILO PCT', category: 'Derivados de Suíno', price: 70.29, image: 'https://i.imgur.com/98Grz7V.png' },
  { id: 1078, name: 'SALSICHA CONGELADA HOT DOG SADIA 3 KILO PCT', category: 'Derivados de Suíno', price: 38.64, image: 'https://i.imgur.com/l2pm4Rf.png' },
  { id: 1079, name: 'SALSICHA CONGELADA HOT DOG SEARA 5 KILO PCT', category: 'Derivados de Suíno', price: 51.54, image: 'https://i.imgur.com/N5HcIe0.png' },
  { id: 1080, name: 'TORRESMO PRÉ FRITO CHAPARRAL 500 G PCT', category: 'Derivados de Suíno', price: 17.81, image: 'https://i.imgur.com/C4N23ob.png' },
  { id: 1081, name: 'ACETO BALSÂMICO DI MODENA DI SALERNO 500 ML', category: 'Derivados de Vegetal', price: 22.47, image: 'https://i.imgur.com/kV8ypOn.png' },
  { id: 1082, name: 'ACETO BALSÂMICO DI MODENA DON RAVELLO 500 ML', category: 'Derivados de Vegetal', price: 21.47, image: 'https://i.imgur.com/ljuwXmi.png' },
  { id: 1083, name: 'ALCACHOFRA CORAÇÃO CORTADO DI SALERNO 2,5 KILO', category: 'Derivados de Vegetal', price: 76.96, image: 'https://i.imgur.com/UAApCNc.png' },
  { id: 1084, name: 'ALCACHOFRA CORAÇÃO INTEIRO ARCO BELLO 2,5 KILO', category: 'Derivados de Vegetal', price: 91.72, image: 'https://i.imgur.com/95QzoAY.png' },
  { id: 1085, name: 'ALCACHOFRA CORAÇÃO INTEIRO DI SALERNO 2,5 KILO', category: 'Derivados de Vegetal', price: 103.08, image: 'https://i.imgur.com/3dQPW3v.png' },
  { id: 1086, name: 'ALCACHOFRA FUNDO DI SALERNO 2,5 KILO', category: 'Derivados de Vegetal', price: 78.32, image: 'https://i.imgur.com/nefPxeK.png' },
  { id: 1087, name: 'ALCAPARRA ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 96.37, image: 'https://i.imgur.com/OEmh0q6.png' },
  { id: 1088, name: 'ALCAPARRA DI SALERNO 700 G', category: 'Derivados de Vegetal', price: 56.1, image: 'https://i.imgur.com/jgEQcc4.png' },
  { id: 1089, name: 'ALHO FRITO CROCANTE OISHII 500 G', category: 'Derivados de Vegetal', price: 32.92, image: 'https://i.imgur.com/1SouJYG.png' },
  { id: 1090, name: 'ALHO FRITO FINO DELEON 500 G', category: 'Derivados de Vegetal', price: 27.26, image: 'https://i.imgur.com/BVfkgmt.png' },
  { id: 1091, name: 'ALHO FRITO FINO ZAZO 500 G', category: 'Derivados de Vegetal', price: 21.16, image: 'https://i.imgur.com/V5GsE7a.png' },
  { id: 1092, name: 'ALHO INTEIRO DESCASCADO CONGELADO EASY CHEF 1,1 KILO', category: 'Derivados de Vegetal', price: 23.41, image: 'https://i.imgur.com/LpfPAJb.png' },
  { id: 1093, name: 'ALHO INTEIRO DESCASCADO CONGELADO PRATIGEL 1,02 KILO', category: 'Derivados de Vegetal', price: 23.08, image: 'https://i.imgur.com/NRhdM8c.png' },
  { id: 1094, name: 'ALHO TRITURADO DELEON 1 KILO', category: 'Derivados de Vegetal', price: 9.56, image: 'https://i.imgur.com/ch0gOcT.png' },
  { id: 1095, name: 'ALHO TRITURADO GRANDE ARCO BELLO (BD 3 KILO)', category: 'Derivados de Vegetal', price: 25.05, image: 'https://i.imgur.com/h8LKvcg.png' },
  { id: 1096, name: 'ALHO TRITURADO GRANDE DELEON 3 KILO', category: 'Derivados de Vegetal', price: 27.19, image: 'https://i.imgur.com/9ILOCel.png' },
  { id: 1097, name: 'ANÉIS DE CEBOLA CONGELADOS PRÉ FRITOS EMPANADOS PRÉ FORMADOS BEM BRASIL 1,05 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 138.17, image: 'https://i.imgur.com/Y831TCE.png' },
  { id: 1098, name: 'ANÉIS DE CEBOLA CONGELADOS PRÉ FRITOS EMPANADOS PRÉ FORMADOS MCCAIN 1,05 KILO (CX 10 PCT)', category: 'Derivados de Vegetal', price: 226.29, image: 'https://i.imgur.com/25U8FJN.png' },
  { id: 1099, name: 'ANÉIS DE CEBOLA CONGELADOS PRÉ FRITOS EMPANADOS PRÉ FORMADOS MORIXE 1,1 KILO (CX 10 PCT)', category: 'Derivados de Vegetal', price: 223.68, image: 'https://i.imgur.com/6RFoXQK.png' },
  { id: 1100, name: 'ARROZ 7 GRÃOS INTEGRAIS CAMIL 1 KILO', category: 'Derivados de Vegetal', price: 13.57, image: 'https://i.imgur.com/69BafgE.png' },
  { id: 1101, name: 'ARROZ ARBÓRIO DI CASTELLI 1 KILO', category: 'Derivados de Vegetal', price: 23.24, image: 'https://i.imgur.com/RloPBlS.png' },
  { id: 1102, name: 'ARROZ ARBÓRIO DI SALERNO 1 KILO', category: 'Derivados de Vegetal', price: 24.73, image: 'https://i.imgur.com/duWfool.png' },
  { id: 1103, name: 'ARROZ BASMATI CAMIL 500 G', category: 'Derivados de Vegetal', price: 15.98, image: 'https://i.imgur.com/wdtwpKD.png' },
  { id: 1104, name: 'ARROZ BRANCO PEQUENO TIPO 1 CAMIL 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 74.68, image: 'https://i.imgur.com/lsfeKDx.png' },
  { id: 1105, name: 'ARROZ BRANCO TIPO 1 FOOD SERVICE CAMIL 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 137.14, image: 'https://i.imgur.com/4Mg7giP.png' },
  { id: 1106, name: 'ARROZ BRANCO TIPO 1 NAMORADO 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 129.1, image: 'https://i.imgur.com/tYTJUH8.png' },
  { id: 1107, name: 'ARROZ BRANCO TIPO 1 SOLITO 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 127.89, image: 'https://i.imgur.com/ZxyHXzW.png' },
  { id: 1108, name: 'ARROZ INTEGRAL CAMIL 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 64.37, image: 'https://i.imgur.com/TMGursc.png' },
  { id: 1109, name: 'ARROZ INTEGRAL FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 66.24, image: 'https://i.imgur.com/rScHYDK.png' },
  { id: 1110, name: 'ARROZ PARBOILIZADO TIPO 1 FOOD SERVICE CAMIL 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 178.57, image: 'https://i.imgur.com/01IC3Bo.png' },
  { id: 1111, name: 'ARROZ PARBOILIZADO TIPO 1 NAMORADO 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 122.6, image: 'https://i.imgur.com/jm6iW4s.png' },
  { id: 1112, name: 'ARROZ RISOTOS CULINÁRIA ITALIANA FOOD SERVICE CAMIL 2 KILO', category: 'Derivados de Vegetal', price: 33.52, image: 'https://i.imgur.com/XZYkkuQ.png' },
  { id: 1113, name: 'ASPARGOS BRANCO DI SALERNO 395 G', category: 'Derivados de Vegetal', price: 48.17, image: 'https://i.imgur.com/bpxRPv8.png' },
  { id: 1114, name: 'AZEITE COMPOSTO 30% OLIVA E SOJA LISBOA 500 ML', category: 'Derivados de Vegetal', price: 12.57, image: 'https://i.imgur.com/CL0ulh6.png' },
  { id: 1115, name: 'AZEITE COMPOSTO 50% DE OLIVA E GIRASSOL LISBOA 500 ML', category: 'Derivados de Vegetal', price: 13.44, image: 'https://i.imgur.com/xhGub47.png' },
  { id: 1116, name: 'AZEITE COMPOSTO OLIVA E SOJA CARMELITA 500 ML', category: 'Derivados de Vegetal', price: 17.63, image: 'https://i.imgur.com/Kdakqou.png' },
  { id: 1117, name: 'AZEITE COMPOSTO OLIVA E SOJA FAISÃO 500 ML', category: 'Derivados de Vegetal', price: 10.12, image: 'https://i.imgur.com/xsL2bHw.png' },
  { id: 1118, name: 'AZEITE COMPOSTO OLIVA E SOJA MARIA 500 ML', category: 'Derivados de Vegetal', price: 17.59, image: 'https://i.imgur.com/sSDd7q1.png' },
  { id: 1119, name: 'AZEITE COMPOSTO TEMPERO CEBOLA E ALHO LISBOA BLEND 500 ML', category: 'Derivados de Vegetal', price: 15.79, image: 'https://i.imgur.com/9xsFe30.png' },
  { id: 1120, name: 'AZEITE DE OLIVA EXTRA VIRGEM ANDORINHA 500 ML', category: 'Derivados de Vegetal', price: 31.32, image: 'https://i.imgur.com/tPOWXhV.png' },
  { id: 1121, name: 'AZEITE DE OLIVA EXTRA VIRGEM COCINERO 500 ML', category: 'Derivados de Vegetal', price: 28.05, image: 'https://i.imgur.com/tq6Plt0.png' },
  { id: 1122, name: 'AZEITE DE OLIVA EXTRA VIRGEM GALLO 500 ML', category: 'Derivados de Vegetal', price: 36.81, image: 'https://i.imgur.com/PGxQdmv.png' },
  { id: 1123, name: 'AZEITE DE OLIVA EXTRA VIRGEM MORIXE 500 ML', category: 'Derivados de Vegetal', price: 35.4, image: 'https://i.imgur.com/QDMfOE1.png' },
  { id: 1124, name: 'AZEITE DE OLIVA GRANDE EXTRA VIRGEM GALLO 5 L (CX 2 GL)', category: 'Derivados de Vegetal', price: 337.45, image: 'https://i.imgur.com/Z7NjZMw.png' },
  { id: 1125, name: 'AZEITE DE OLIVA GRANDE EXTRA VIRGEM REY 5,01 L (CX 3 GL)', category: 'Derivados de Vegetal', price: 338.7, image: 'https://i.imgur.com/NUT0lC3.png' },
  { id: 1126, name: 'AZEITE DE OLIVA GRANDE EXTRA VIRGEM TERRANO 5,01 L (CX 3 GL)', category: 'Derivados de Vegetal', price: 361.4, image: 'https://i.imgur.com/VRmcbHx.png' },
  { id: 1127, name: 'AZEITE DE OLIVA MÉDIO EXTRA VIRGEM GALLO 2 L (CX 6 GL)', category: 'Derivados de Vegetal', price: 136.32, image: 'https://i.imgur.com/6wN8isp.png' },
  { id: 1128, name: 'AZEITE DE OLIVA PEQUENO EXTRA VIRGEM GALLO 250 ML', category: 'Derivados de Vegetal', price: 19.96, image: 'https://i.imgur.com/F6d8wlt.png' },
  { id: 1129, name: 'AZEITE DE OLIVA SACHÊ BOM SABOR 4 ML (CX 200 UN)', category: 'Derivados de Vegetal', price: 130.67, image: 'https://i.imgur.com/CUTEeWO.png' },
  { id: 1130, name: 'AZEITE DE OLIVA SACHÊ EKMA 4 ML (CX 120 UN)', category: 'Derivados de Vegetal', price: 80.11, image: 'https://i.imgur.com/5arInMl.png' },
  { id: 1131, name: 'AZEITE DE OLIVA TIPO ÚNICO GALLO 500 ML', category: 'Derivados de Vegetal', price: 29.44, image: 'https://i.imgur.com/1uIpFe1.png' },
  { id: 1132, name: 'AZEITE DENDÊ CEPÊRA 900 ML', category: 'Derivados de Vegetal', price: 30.37, image: 'https://i.imgur.com/qMW3uxL.png' },
  { id: 1133, name: 'AZEITE GRANDE COMPOSTO 30% OLIVA E SOJA LISBOA 5,02 L', category: 'Derivados de Vegetal', price: 66.95, image: 'https://i.imgur.com/279crcf.png' },
  { id: 1134, name: 'AZEITE GRANDE COMPOSTO 50% OLIVA E GIRASSOL LISBOA 5,02 L', category: 'Derivados de Vegetal', price: 84.23, image: 'https://i.imgur.com/7EoUgjE.png' },
  { id: 1135, name: 'AZEITONA PRETA FATIADA ARCO BELLO (BD 1,8 KILO)', category: 'Derivados de Vegetal', price: 77.1, image: 'https://i.imgur.com/HftHDJa.png' },
  { id: 1136, name: 'AZEITONA PRETA FATIADA COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 87.73, image: 'https://i.imgur.com/ASzBWSc.png' },
  { id: 1137, name: 'AZEITONA PRETA FATIADA RAINHA (BD 1,8 KILO)', category: 'Derivados de Vegetal', price: 77.89, image: 'https://i.imgur.com/EzUwuyZ.png' },
  { id: 1138, name: 'AZEITONA PRETA GRAÚDA 11 X 13 AZAPA COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 116.97, image: 'https://i.imgur.com/DuytniZ.png' },
  { id: 1139, name: 'AZEITONA PRETA GRAÚDA 12 X 16 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 83.74, image: 'https://i.imgur.com/J1qdpmv.png' },
  { id: 1140, name: 'AZEITONA PRETA GRAÚDA 9 X 11 AZAPA ARCO BELLO 2 KILO', category: 'Derivados de Vegetal', price: 120.96, image: 'https://i.imgur.com/B8agAGq.png' },
  { id: 1141, name: 'AZEITONA PRETA MÉDIA 20 X 24 ARCO BELLO 2 KILO', category: 'Derivados de Vegetal', price: 87.73, image: 'https://i.imgur.com/iA8GSEx.png' },
  { id: 1142, name: 'AZEITONA PRETA MÉDIA 20 X 24 TOZZI 2 KILO', category: 'Derivados de Vegetal', price: 63.67, image: 'https://i.imgur.com/ZsYbO7P.png' },
  { id: 1143, name: 'AZEITONA PRETA MÉDIA 24 X 28 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 79.76, image: 'https://i.imgur.com/DGP2FJs.png' },
  { id: 1144, name: 'AZEITONA PRETA MIÚDA 45 X 50 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 83.74, image: 'https://i.imgur.com/5k9OkMf.png' },
  { id: 1145, name: 'AZEITONA PRETA SEM CAROÇO ARCO BELLO 1,8 KILO', category: 'Derivados de Vegetal', price: 90.39, image: 'https://i.imgur.com/qhZv5JI.png' },
  { id: 1146, name: 'AZEITONA PRETA SEM CAROÇO COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 89.06, image: 'https://i.imgur.com/LvCwIlt.png' },
  { id: 1147, name: 'AZEITONA VERDE FATIADA ARCO BELLO (BD 1,8 KILO)', category: 'Derivados de Vegetal', price: 60.22, image: 'https://i.imgur.com/INMotZe.png' },
  { id: 1148, name: 'AZEITONA VERDE FATIADA COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 69.12, image: 'https://i.imgur.com/wFstsgs.png' },
  { id: 1149, name: 'AZEITONA VERDE FATIADA RAINHA (BD 1,8 KILO)', category: 'Derivados de Vegetal', price: 59.19, image: 'https://i.imgur.com/wQiEhbp.png' },
  { id: 1150, name: 'AZEITONA VERDE GRAÚDA 16 X 20 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 57.82, image: 'https://i.imgur.com/NkKaDbg.png' },
  { id: 1151, name: 'AZEITONA VERDE MÉDIA 24 X 28 ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 55.7, image: 'https://i.imgur.com/MN38tgD.png' },
  { id: 1152, name: 'AZEITONA VERDE MÉDIA 24 X 28 COLOSSO (BD GRANDE 15 KILO)', category: 'Derivados de Vegetal', price: 385.48, image: 'https://i.imgur.com/3bs5By4.png' },
  { id: 1153, name: 'AZEITONA VERDE MÉDIA 24 X 28 COLOSSO (BD MÉDIO 7,5 KILO)', category: 'Derivados de Vegetal', price: 179.45, image: 'https://i.imgur.com/Y2aOUX8.png' },
  { id: 1154, name: 'AZEITONA VERDE MÉDIA 24 X 28 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 52.51, image: 'https://i.imgur.com/vatcKrS.png' },
  { id: 1155, name: 'AZEITONA VERDE MÉDIA 24 X 28 NUCETE 1,01 KILO', category: 'Derivados de Vegetal', price: 25.26, image: 'https://i.imgur.com/npyu3ZS.png' },
  { id: 1156, name: 'AZEITONA VERDE MÉDIA 24 X 28 TOZZI 2 KILO', category: 'Derivados de Vegetal', price: 46.16, image: 'https://i.imgur.com/xqQElXQ.png' },
  { id: 1157, name: 'AZEITONA VERDE MÉDIA 28 X 32 ARCO BELLO (BARRICA 40 KILO)', category: 'Derivados de Vegetal', price: 917.18, image: 'https://i.imgur.com/hBqr6g8.png' },
  { id: 1158, name: 'AZEITONA VERDE MÉDIA 32 X 45 RAINHA (BD 2 KILO)', category: 'Derivados de Vegetal', price: 45.91, image: 'https://i.imgur.com/dWp4dDc.png' },
  { id: 1159, name: 'AZEITONA VERDE MIÚDA 40 X 50 ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 39.88, image: 'https://i.imgur.com/Dg3bRPm.png' },
  { id: 1160, name: 'AZEITONA VERDE MIÚDA 45 X 50 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 42.54, image: 'https://i.imgur.com/Us9D662.png' },
  { id: 1161, name: 'AZEITONA VERDE MIÚDA 45 X 50 RAINHA (BD 2 KILO)', category: 'Derivados de Vegetal', price: 36.59, image: 'https://i.imgur.com/lBC89yQ.png' },
  { id: 1162, name: 'AZEITONA VERDE RECHEADA COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 79.76, image: 'https://i.imgur.com/K68xN6i.png' },
  { id: 1163, name: 'AZEITONA VERDE SEM CAROÇO ARCO BELLO 1,8 KILO', category: 'Derivados de Vegetal', price: 62.98, image: 'https://i.imgur.com/Sw1ZURV.png' },
  { id: 1164, name: 'AZEITONA VERDE SEM CAROÇO COLOSSO (BD GRANDE 14 KILO)', category: 'Derivados de Vegetal', price: 465.24, image: 'https://i.imgur.com/Q8aSVHI.png' },
  { id: 1165, name: 'AZEITONA VERDE SEM CAROÇO COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 71.78, image: 'https://i.imgur.com/ES82vvK.png' },
  { id: 1166, name: 'AZEITONA VERDE SEM CAROÇO RAINHA (BD 1,8 KILO)', category: 'Derivados de Vegetal', price: 62.35, image: 'https://i.imgur.com/vLX86Uu.png' },
  { id: 1167, name: 'BATATA CONGELADA CARINHAS BEM BRASIL 1,05 KILO (CX 10 PCT)', category: 'Derivados de Vegetal', price: 119.62, image: 'https://i.imgur.com/T5diiAR.png' },
  { id: 1168, name: 'BATATA CONGELADA PRÉ FRITA COM CASCA DIPPERS CANOA TEMPERADA LAMBWESTON 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 183.64, image: 'https://i.imgur.com/8Dq374Y.png' },
  { id: 1169, name: 'BATATA CONGELADA PRÉ FRITA COM CASCA RÚSTICA CORTE CASEIRO BEM BRASIL 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 224.32, image: 'https://i.imgur.com/CiryfVc.png' },
  { id: 1170, name: 'BATATA CONGELADA PRÉ FRITA COM CASCA RÚSTICA SKIN ON WEDGES MCCAIN 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 229.68, image: 'https://i.imgur.com/yPwNiPm.png' },
  { id: 1171, name: 'BATATA CONGELADA PRÉ FRITA COM CASCA RÚSTICA SURECRISP CRISPERS MCCAIN 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 258.12, image: 'https://i.imgur.com/iHc0bKK.png' },
  { id: 1172, name: 'BATATA CONGELADA PRÉ FRITA COM CASCA RÚSTICA WEDGES TEMPERADA E ONDULADA LAMBWESTON 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 178.86, image: 'https://i.imgur.com/8ckh6cG.png' },
  { id: 1173, name: 'BATATA CONGELADA PRÉ FRITA CRISSCUT CORTE XADREX TEMPERADA LAMBWESTON 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 191.29, image: 'https://i.imgur.com/YGce82J.png' },
  { id: 1174, name: 'BATATA CONGELADA PRÉ FRITA FRY N DIP CANOA MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 295.31, image: 'https://i.imgur.com/R3B1WaR.png' },
  { id: 1175, name: 'BATATA CONGELADA PRÉ FRITA HASH BROWN BEM BRASIL 1,06 KILO', category: 'Derivados de Vegetal', price: 214.82, image: 'https://i.imgur.com/juTAsJE.png' },
  { id: 1176, name: 'BATATA CONGELADA PRÉ FRITA MAXI CHIPS MCCAIN 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 315, image: 'https://i.imgur.com/xA5EBTR.png' },
  { id: 1177, name: 'BATATA CONGELADA PRÉ FRITA NOISETTES MCCAIN 2,5 KILO (CX 4 PCT)', category: 'Derivados de Vegetal', price: 224.8, image: 'https://i.imgur.com/g1WbDss.png' },
  { id: 1178, name: 'BATATA CONGELADA PRÉ FRITA SMILES SORRISO MCCAIN 1,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 202.32, image: 'https://i.imgur.com/fAFSEIa.png' },
  { id: 1179, name: 'BATATA PALHA EXTRAFINA DA TERRINHA 100 G', category: 'Derivados de Vegetal', price: 7.03, image: 'https://i.imgur.com/11P6CVp.png' },
  { id: 1180, name: 'BATATA PALHA EXTRAFINA KISABOR 100 G', category: 'Derivados de Vegetal', price: 6.1, image: 'https://i.imgur.com/LSURJEo.png' },
  { id: 1181, name: 'BATATA PALHA EXTRAFINA KROCK 500 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 15.87, image: 'https://i.imgur.com/cuy77VB.png' },
  { id: 1182, name: 'BATATA PALHA TRADICIONAL KISABOR 100 G', category: 'Derivados de Vegetal', price: 5.91, image: 'https://i.imgur.com/1jqs5pu.png' },
  { id: 1183, name: 'BATATA PALHA TRADICIONAL KROCK 500 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 15.87, image: 'https://i.imgur.com/5HbPP9z.png' },
  { id: 1184, name: 'BATATA PALHA TRADICIONAL YOKI 105 G', category: 'Derivados de Vegetal', price: 8.74, image: 'https://i.imgur.com/BsN2rq7.png' },
  { id: 1185, name: 'BATATA PALITO CONGELADA PRÉ FRITA 10 MM CORTE TRADICIONAL "EXTRA CRUNCH" SIMPLOT 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 230.4, image: 'https://i.imgur.com/DN9l2ib.png' },
  { id: 1186, name: 'BATATA PALITO CONGELADA PRÉ FRITA 10 MM CORTE TRADICIONAL RAPIPAP 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 143.96, image: 'https://i.imgur.com/NjniGM9.png' },
  { id: 1187, name: 'BATATA PALITO CONGELADA PRÉ FRITA 10 MM CORTE TRADICIONAL SIMPLOT 2 KILO (CX 7 PCT)', category: 'Derivados de Vegetal', price: 176.16, image: 'https://i.imgur.com/hBlBAW0.png' },
  { id: 1188, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO "EXTRA CRUNCH" SIMPLOT 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 204.49, image: 'https://i.imgur.com/s5G8ygq.png' },
  { id: 1189, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO "EXTRA CRUNCH" SKIN ON SIMPLOT 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 154.01, image: 'https://i.imgur.com/eMB3Wl5.png' },
  { id: 1190, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO FAST FOOD BEM BRASIL 2 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 71.4, image: 'https://i.imgur.com/p1oxNW6.png' },
  { id: 1191, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO FAST FOOD BEM BRASIL 2 KILO (CX 7 PCT)', category: 'Derivados de Vegetal', price: 193.75, image: 'https://i.imgur.com/72f4Qyr.png' },
  { id: 1192, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO FAST FOOD CRISPY BEM BRASIL 2 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 200.49, image: 'https://i.imgur.com/1ydAwwr.png' },
  { id: 1193, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO FAST FOOD MCCAIN 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 219.01, image: 'https://i.imgur.com/XJ3cVho.png' },
  { id: 1194, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO LAMBWESTON 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 220.68, image: 'https://i.imgur.com/k1hgaWs.png' },
  { id: 1195, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO MCCAIN 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 280.12, image: 'https://i.imgur.com/vD3UpIh.png' },
  { id: 1196, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO MCCAIN 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 268.95, image: 'https://i.imgur.com/F19mjgQ.png' },
  { id: 1197, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO SIMPLOT 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 244.28, image: 'https://i.imgur.com/dR7DBi6.png' },
  { id: 1198, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO SURECRISP EXTRA CROCANTE MCCAIN 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 217.86, image: 'https://i.imgur.com/QM4xvhr.png' },
  { id: 1199, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL CANÇÃO 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 92.12, image: 'https://i.imgur.com/JBsupe1.png' },
  { id: 1200, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL HARVEST PRIDE RÚSTICA MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 254.75, image: 'https://i.imgur.com/d7ilPCu.png' },
  { id: 1201, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL LAMBWESTON 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 220.36, image: 'https://i.imgur.com/caIkjlI.png' },
  { id: 1202, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL MAIS BATATA BEM BRASIL 2 KILO (CX 7 PCT)', category: 'Derivados de Vegetal', price: 150.2, image: 'https://i.imgur.com/H6CVzIj.png' },
  { id: 1203, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 228.52, image: 'https://i.imgur.com/M7TS9o0.png' },
  { id: 1204, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL ONE FRY MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 200.36, image: 'https://i.imgur.com/4F231TZ.png' },
  { id: 1205, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL SKIN ON SIMPLOT 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 135.88, image: 'https://i.imgur.com/1byHb5Q.png' },
  { id: 1206, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL STEALTH FRIES COBERTURA CROCANTE "COM CASCA" LAMBWESTON 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 140.33, image: 'https://i.imgur.com/0jA6738.png' },
  { id: 1207, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL STEALTH FRIES COBERTURA CROCANTE "SEM CASCA" LAMBWESTON 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 137.69, image: 'https://i.imgur.com/GHmxnLR.png' },
  { id: 1208, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL SURECRISP EXTRA CROCANTE MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 245.96, image: 'https://i.imgur.com/31YyVVd.png' },
  { id: 1209, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL UAI BEM BRASIL 2 KILO (CX 7 PCT)', category: 'Derivados de Vegetal', price: 141.61, image: 'https://i.imgur.com/TddVhrS.png' },
  { id: 1210, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 X 18 MM STEAKHOUSE CORTE ESPECIAL BEM BRASIL 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 220.73, image: 'https://i.imgur.com/tvAKPQc.png' },
  { id: 1211, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 X 18 MM STEAKHOUSE LAMBWESTON 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 170.17, image: 'https://i.imgur.com/mOwq1nY.png' },
  { id: 1212, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 X 18 MM STEAKHOUSE SIMPLOT 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 151.31, image: 'https://i.imgur.com/yn2kGgU.png' },
  { id: 1213, name: 'BATATA PALITO CONGELADA PRÉ FRITA CRINKLE FRIES ONDULADA MCCAIN 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 206.73, image: 'https://i.imgur.com/2WPzqH3.png' },
  { id: 1214, name: 'BATATA PALITO CONGELADA PRÉ FRITA CRINKLE ONDULADA BEM BRASIL 2 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 179.45, image: 'https://i.imgur.com/GC0OIQT.png' },
  { id: 1215, name: 'BATATA PALITO CONGELADA PRÉ FRITA CRINKLE SURECRISP TEMPERADA MCCAIN 2,5 KILO (CX 4 PCT)', category: 'Derivados de Vegetal', price: 208.95, image: 'https://i.imgur.com/5PTUsbl.png' },
  { id: 1216, name: 'BERINJELA A GENOVESE REFOGADA RG 500 G', category: 'Derivados de Vegetal', price: 39.86, image: 'https://i.imgur.com/PdHyUls.png' },
  { id: 1217, name: 'BRÓCOLIS CONGELADO AGRO YOSHI 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 124.68, image: 'https://i.imgur.com/BE00Fd4.png' },
  { id: 1218, name: 'BRÓCOLIS CONGELADO GRANO 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 136.91, image: 'https://i.imgur.com/47WZj03.png' },
  { id: 1219, name: 'BRÓCOLIS CONGELADO PRATIGEL 1,02 KILO (CX 10 PCT)', category: 'Derivados de Vegetal', price: 161.21, image: 'https://i.imgur.com/5tFAmpA.png' },
  { id: 1220, name: 'CAFÉ EXTRA FORTE ALMOFADA BOM JESUS 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 283.54, image: 'https://i.imgur.com/azJM5bf.png' },
  { id: 1221, name: 'CAFÉ EXTRA FORTE ALMOFADA COAMO 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 267.19, image: 'https://i.imgur.com/AJcUKbF.png' },
  { id: 1222, name: 'CAFÉ EXTRA FORTE ALMOFADA SELETO 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 249.64, image: 'https://i.imgur.com/sjmpLZN.png' },
  { id: 1223, name: 'CAFÉ EXTRA FORTE ALMOFADA SOLLUS 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 235.06, image: 'https://i.imgur.com/TtlTuwJ.png' },
  { id: 1224, name: 'CAFÉ EXTRA FORTE ALMOFADA UNIÃO 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 301.92, image: 'https://i.imgur.com/wgoc0ug.png' },
  { id: 1225, name: 'CAFÉ TRADICIONAL ALMOFADA BOM JESUS 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 325.35, image: 'https://i.imgur.com/h7clY0d.png' },
  { id: 1226, name: 'CAFÉ TRADICIONAL ALMOFADA COAMO 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 246.31, image: 'https://i.imgur.com/fSku9Ht.png' },
  { id: 1227, name: 'CAFÉ TRADICIONAL ALMOFADA MELITTA 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 364.31, image: 'https://i.imgur.com/8ytFl63.png' },
  { id: 1228, name: 'CAFÉ TRADICIONAL ALMOFADA PILÃO 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 371.62, image: 'https://i.imgur.com/CnT2OMc.png' },
  { id: 1229, name: 'CAFÉ TRADICIONAL ALMOFADA SELETO 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 249.64, image: 'https://i.imgur.com/NoLk6ZI.png' },
  { id: 1230, name: 'CAFÉ TRADICIONAL ALMOFADA UNIÃO 500 G (CX 10 PCT)', category: 'Derivados de Vegetal', price: 301.92, image: 'https://i.imgur.com/sNsKt2a.png' },
  { id: 1231, name: 'CATCHUP CEPÊRA 3,5 KILO', category: 'Derivados de Vegetal', price: 29.48, image: 'https://i.imgur.com/WFBKv6D.png' },
  { id: 1232, name: 'CATCHUP EKMA 3,3 KILO', category: 'Derivados de Vegetal', price: 22.27, image: 'https://i.imgur.com/fWmgf0d.png' },
  { id: 1233, name: 'CATCHUP EKMA 950 G', category: 'Derivados de Vegetal', price: 7.2, image: 'https://i.imgur.com/1P3HRzY.png' },
  { id: 1234, name: 'CATCHUP GRANDE HEINZ 2 KILO', category: 'Derivados de Vegetal', price: 32.66, image: 'https://i.imgur.com/wXxB04q.png' },
  { id: 1235, name: 'CATCHUP GRANDE HEMMER 3,8 KILO', category: 'Derivados de Vegetal', price: 35.95, image: 'https://i.imgur.com/9w3dfs2.png' },
  { id: 1236, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://i.imgur.com/qIZJKv0.png' },
  { id: 1237, name: 'CATCHUP KISABOR 1,01 KILO', category: 'Derivados de Vegetal', price: 6.75, image: 'https://i.imgur.com/UWlMAh3.png' },
  { id: 1238, name: 'CATCHUP LANCHERO 3 KILO (FD 6 GL)', category: 'Derivados de Vegetal', price: 12.75, image: 'https://i.imgur.com/Lxo1wez.png' },
  { id: 1239, name: 'CATCHUP MÉDIO HEINZ 1,033 KILO', category: 'Derivados de Vegetal', price: 17.7, image: 'https://i.imgur.com/Ab8vN1F.png' },
  { id: 1240, name: 'CATCHUP PEQUENO CEPÊRA 1,01 KILO', category: 'Derivados de Vegetal', price: 9.76, image: 'https://i.imgur.com/Ml99jp7.png' },
  { id: 1241, name: 'CATCHUP PEQUENO HEINZ 397 G (CX 16 FR)', category: 'Derivados de Vegetal', price: 197.95, image: 'https://i.imgur.com/xhkgKBx.png' },
  { id: 1242, name: 'CATCHUP PEQUENO HEMMER 1 KILO', category: 'Derivados de Vegetal', price: 13.57, image: 'https://i.imgur.com/Zy9fkue.png' },
  { id: 1243, name: 'CATCHUP SACHÊ CEPÊRA 7 G (CX 175 UN)', category: 'Derivados de Vegetal', price: 19.42, image: 'https://i.imgur.com/ifCjm5A.png' },
  { id: 1244, name: 'CATCHUP SACHÊ EKMA 7 G (CX 168 UN)', category: 'Derivados de Vegetal', price: 13.28, image: 'https://i.imgur.com/orrpipj.png' },
  { id: 1245, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://i.imgur.com/im5p7d8.png' },
  { id: 1246, name: 'CATCHUP SACHÊ HEINZ 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 20.44, image: 'https://i.imgur.com/PLbwXtW.png' },
  { id: 1247, name: 'CATCHUP SACHÊ HELLMANN´S 7 G (CX 168 UN)', category: 'Derivados de Vegetal', price: 22.55, image: 'https://i.imgur.com/bkbYl4x.png' },
  { id: 1248, name: 'CATCHUP SACHÊ HEMMER 7 G (CX 190 UN)', category: 'Derivados de Vegetal', price: 21.94, image: 'https://i.imgur.com/bQWJK1F.png' },
  { id: 1249, name: 'CATCHUP SACHÊ LANCHERO 7 G (CX 150 UN)', category: 'Derivados de Vegetal', price: 10.9, image: 'https://i.imgur.com/OnYYN3z.png' },
  { id: 1250, name: 'CATCHUP SACHÊ PREDILECTA 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 13.15, image: 'https://i.imgur.com/VYmEySP.png' },
  { id: 1251, name: 'CATCHUP TRADICIONAL QUERO 1.028 KILO', category: 'Derivados de Vegetal', price: 9.59, image: 'https://i.imgur.com/fID1pUz.png' },
  { id: 1252, name: 'CEBOLA CRISPY DELEON 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 19.93, image: 'https://i.imgur.com/d85SRTj.png' },
  { id: 1253, name: 'CEBOLA CRISPY TAICHI 500 G (CX 20 PCT)', category: 'Derivados de Vegetal', price: 22.67, image: 'https://i.imgur.com/0NUa7Vi.png' },
  { id: 1254, name: 'CEBOLA GRAÚDA NACIONAL (SC 18 KILO)', category: 'Derivados de Vegetal', price: 37.22, image: 'https://i.imgur.com/iKZcDA9.png' },
  { id: 1255, name: 'CEBOLINHA GRANJA SÃO PAULO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 57.26, image: 'https://i.imgur.com/9HBTq8i.png' },
  { id: 1256, name: 'CENOURA CONGELADA BABY GRANO 2 KILO', category: 'Derivados de Vegetal', price: 41.77, image: 'https://i.imgur.com/IvwB55I.png' },
  { id: 1257, name: 'CHAMPIGNON FATIADO ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 61.81, image: 'https://i.imgur.com/his8koR.png' },
  { id: 1258, name: 'CHAMPIGNON FATIADO YGUARA 2 KILO (FD 4 BD)', category: 'Derivados de Vegetal', price: 59.82, image: 'https://i.imgur.com/YRFtHuD.png' },
  { id: 1259, name: 'CHAMPIGNON INTEIRO ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 91.72, image: 'https://i.imgur.com/hRWAmt3.png' },
  { id: 1260, name: 'COUVE FLOR CONGELADA GRANO 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 136.91, image: 'https://i.imgur.com/PsPoUNr.png' },
  { id: 1261, name: 'ERVILHA CONGELADA GRANO 2 KILO', category: 'Derivados de Vegetal', price: 38.92, image: 'https://i.imgur.com/b8t2P2O.png' },
  { id: 1262, name: 'ERVILHA CONGELADA PRATIGEL 1,02 KILO', category: 'Derivados de Vegetal', price: 17.06, image: 'https://i.imgur.com/NZJjxl9.png' },
  { id: 1263, name: 'ESCAROLA CONGELADA GRANO 1 KILO', category: 'Derivados de Vegetal', price: 17.23, image: 'https://i.imgur.com/BTlyObt.png' },
  { id: 1264, name: 'ESCAROLA CONGELADA PRATIGEL 2 KILO', category: 'Derivados de Vegetal', price: 29.16, image: 'https://i.imgur.com/VGnZ3CZ.png' },
  { id: 1265, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://i.imgur.com/Oy4YZoy.png' },
  { id: 1266, name: 'FEIJÃO BRANCO TIPO 1 FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 57.91, image: 'https://i.imgur.com/fs7xaEe.png' },
  { id: 1267, name: 'FEIJÃO CARIOCA TIPO 1 FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 72.39, image: 'https://i.imgur.com/YGACONY.png' },
  { id: 1268, name: 'FEIJÃO CARIOCA TIPO 1 SOLITO 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 71.06, image: 'https://i.imgur.com/zAH59YU.png' },
  { id: 1269, name: 'FEIJÃO FRADINHO FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 101.23, image: 'https://i.imgur.com/mxKm9NR.png' },
  { id: 1270, name: 'FEIJÃO FRADINHO SOLITO 500 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 80.48, image: 'https://i.imgur.com/UZN1FrD.png' },
  { id: 1271, name: 'FEIJÃO PRETO TIPO 1 CAMIL 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 54.29, image: 'https://i.imgur.com/9utXo6U.png' },
  { id: 1272, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://i.imgur.com/muMHh4e.png' },
  { id: 1273, name: 'FEIJÃO PRETO TIPO 1 SOLITO 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 54.29, image: 'https://i.imgur.com/aHQwbQy.png' },
  { id: 1274, name: 'FUNGHI SECO BRASILSECO 1 KILO', category: 'Derivados de Vegetal', price: 88.72, image: 'https://i.imgur.com/Z8NVR6x.png' },
  { id: 1275, name: 'FUNGHI SECO DI SALERNO 1 KILO', category: 'Derivados de Vegetal', price: 85.07, image: 'https://i.imgur.com/Qzjch51.png' },
  { id: 1276, name: 'GERGELIM BRANCO INDIANO BRASILSECO 500 G', category: 'Derivados de Vegetal', price: 25.26, image: 'https://i.imgur.com/ZEUGocg.png' },
  { id: 1277, name: 'GERGELIM GRANDE TORRADO PASTA TAHINE ISTAMBUL (BD 13 KILO)', category: 'Derivados de Vegetal', price: 551.64, image: 'https://i.imgur.com/LNfo587.png' },
  { id: 1278, name: 'GERGELIM PRETO INDIANO BRASILSECO 500 G', category: 'Derivados de Vegetal', price: 25.26, image: 'https://i.imgur.com/Jtx6954.png' },
  { id: 1279, name: 'GERGELIM TORRADO PASTA TAHINE ISTAMBUL 500 G', category: 'Derivados de Vegetal', price: 35.89, image: 'https://i.imgur.com/uNtZKv4.png' },
  { id: 1280, name: 'GORDURA VEGETAL COAMO 500 G', category: 'Derivados de Vegetal', price: 11.44, image: 'https://i.imgur.com/szfn8f5.png' },
  { id: 1281, name: 'GORDURA VEGETAL DE PALMA ELOGIATA (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 176.33, image: 'https://i.imgur.com/jP2npB7.png' },
  { id: 1282, name: 'GORDURA VEGETAL FRY 400 COAMO (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 165.9, image: 'https://i.imgur.com/BSu4hgF.png' },
  { id: 1283, name: 'GORDURA VEGETAL FRY 600 COAMO (CX 24 KILO)', category: 'Derivados de Vegetal', price: 284.5, image: 'https://i.imgur.com/3JBYe3i.png' },
  { id: 1284, name: 'GORDURA VEGETAL SUPREMA BUNGE (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 230.15, image: 'https://i.imgur.com/dfaUKSS.png' },
  { id: 1285, name: 'GRÃO DE BICO CAMIL 500 G (FDO 12 PCT)', category: 'Derivados de Vegetal', price: 9.67, image: 'https://i.imgur.com/b7ZydFZ.png' },
  { id: 1286, name: 'GRÃO DE BICO PQ 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 12.11, image: 'https://i.imgur.com/91uJSdM.png' },
  { id: 1287, name: 'LENTILHA DA TERRINHA 500 G (FDO 12 PCT)', category: 'Derivados de Vegetal', price: 13.74, image: 'https://i.imgur.com/rrRu4U4.png' },
  { id: 1288, name: 'LENTILHA FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 42.83, image: 'https://i.imgur.com/Kt9X9Lc.png' },
  { id: 1289, name: 'MAIONESE GRANDE HELLMANN´S 3 KILO', category: 'Derivados de Vegetal', price: 52.41, image: 'https://i.imgur.com/gg9TWSM.png' },
  { id: 1290, name: 'MAIONESE GRANDE MARIANA 3 KILO', category: 'Derivados de Vegetal', price: 25.25, image: 'https://i.imgur.com/oCw5ASv.png' },
  { id: 1291, name: 'MAIONESE GRANDE QUERO 3 KILO', category: 'Derivados de Vegetal', price: 24.33, image: 'https://i.imgur.com/SqTdiMs.png' },
  { id: 1292, name: 'MAIONESE GRILL JUNIOR 1,1 KILO', category: 'Derivados de Vegetal', price: 38.7, image: 'https://i.imgur.com/NM5o22A.png' },
  { id: 1293, name: 'MAIONESE HEINZ 215 G (CX 16 FR)', category: 'Derivados de Vegetal', price: 162.3, image: 'https://i.imgur.com/HuOYZGe.png' },
  { id: 1294, name: 'MAIONESE HELLMANN´S 2,8 KILO', category: 'Derivados de Vegetal', price: 38.95, image: 'https://i.imgur.com/DQ19rl1.png' },
  { id: 1295, name: 'MAIONESE PEQUENA MARIANA 1 KILO (CX 10 BAG)', category: 'Derivados de Vegetal', price: 63.79, image: 'https://i.imgur.com/pJhRPcY.png' },
  { id: 1296, name: 'MAIONESE PEQUENA VIGOR 1 KILO (CX 6 BAG)', category: 'Derivados de Vegetal', price: 69.03, image: 'https://i.imgur.com/H2nt6M9.png' },
  { id: 1297, name: 'MAIONESE PREDILECTA 2,8 KILO', category: 'Derivados de Vegetal', price: 21.71, image: 'https://i.imgur.com/VlhR17k.png' },
  { id: 1298, name: 'MAIONESE QUERO 2,7 KILO', category: 'Derivados de Vegetal', price: 18.72, image: 'https://i.imgur.com/vqzeT2Y.png' },
  { id: 1299, name: 'MAIONESE SACHÊ CEPÊRA 7 G (CX 175 UN)', category: 'Derivados de Vegetal', price: 19.42, image: 'https://i.imgur.com/G9BLCl6.png' },
  { id: 1300, name: 'MAIONESE SACHÊ EKMA 7 G (CX 168 UN)', category: 'Derivados de Vegetal', price: 19.11, image: 'https://i.imgur.com/i3ewHfB.png' },
  { id: 1301, name: 'MAIONESE SACHÊ FUGINI 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 13.5, image: 'https://i.imgur.com/02RS7ZC.png' },
  { id: 1302, name: 'MAIONESE SACHÊ HEINZ 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 20.44, image: 'https://i.imgur.com/mVUItDC.png' },
  { id: 1303, name: 'MAIONESE SACHÊ HELLMANN´S 7 G (CX 168 UN)', category: 'Derivados de Vegetal', price: 27.24, image: 'https://i.imgur.com/M5M2gaJ.png' },
  { id: 1304, name: 'MAIONESE SACHÊ HEMMER 7 G (CX 190 UN)', category: 'Derivados de Vegetal', price: 21.94, image: 'https://i.imgur.com/4wrv7Mh.png' },
  { id: 1305, name: 'MAIONESE SACHÊ LANCHERO 7 G (CX 150 UN)', category: 'Derivados de Vegetal', price: 8.97, image: 'https://i.imgur.com/jF2QmuI.png' },
  { id: 1306, name: 'MAIONESE SACHÊ PREDILECTA 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 14.36, image: 'https://i.imgur.com/4BDzPaB.png' },
  { id: 1307, name: 'MAIONESE TEMPERADA JUNIOR 1,01 KILO', category: 'Derivados de Vegetal', price: 31.92, image: 'https://i.imgur.com/Ezops9P.png' },
  { id: 1308, name: 'MAIONESE TEMPERADA ZAFRÁN 1,05 KILO', category: 'Derivados de Vegetal', price: 26.43, image: 'https://i.imgur.com/H9meKy8.png' },
  { id: 1309, name: 'MAIONESE VIGOR 2,8 KILO', category: 'Derivados de Vegetal', price: 30.92, image: 'https://i.imgur.com/S1pUhKG.png' },
  { id: 1310, name: 'MANDIOCA TOLETE CONGELADA E COZIDA ARRICO 1 KILO (CX 12 PCT)', category: 'Derivados de Vegetal', price: 131.06, image: 'https://i.imgur.com/q1oUnaC.png' },
  { id: 1311, name: 'MANDIOCA TOLETE CONGELADA E COZIDA CONCEIÇÃO 2,5 KILO (CX 4 PCT)', category: 'Derivados de Vegetal', price: 118.94, image: 'https://i.imgur.com/rxd5aI5.png' },
  { id: 1312, name: 'MANDIOCA TOLETE CONGELADA E COZIDA MATHEUS 2,5 KILO (CX 4 PCT)', category: 'Derivados de Vegetal', price: 144.89, image: 'https://i.imgur.com/tcZYB7A.png' },
  { id: 1313, name: 'MANJERICÃO DESIDRATADO BRASILSECO 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 11.45, image: 'https://i.imgur.com/zAWbR6E.png' },
  { id: 1314, name: 'MARGARINA COM SAL 50 % AMÉLIA (BD 14 KILO)', category: 'Derivados de Vegetal', price: 127.81, image: 'https://i.imgur.com/L7eZnTu.png' },
  { id: 1315, name: 'MARGARINA COM SAL 50 % COAMO (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 123.94, image: 'https://i.imgur.com/sXj6Gx1.png' },
  { id: 1316, name: 'MARGARINA COM SAL 75 % PRIMOR (BD 15 KILO)', category: 'Derivados de Vegetal', price: 191.52, image: 'https://i.imgur.com/AzzUJVV.png' },
  { id: 1317, name: 'MARGARINA COM SAL 75 % SOFITELI (BD 15 KILO)', category: 'Derivados de Vegetal', price: 168.91, image: 'https://i.imgur.com/BGuPyEI.png' },
  { id: 1318, name: 'MARGARINA COM SAL 80 % AMÉLIA (BD 14 KILO)', category: 'Derivados de Vegetal', price: 194.92, image: 'https://i.imgur.com/42NyvIv.png' },
  { id: 1319, name: 'MARGARINA COM SAL 80 % COAMO (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 13.31, image: 'https://i.imgur.com/T9v9si6.png' },
  { id: 1320, name: 'MARGARINA FOLHADOS & CROISSANTS 80 % AMÉLIA 2 KILO (CX 6 UN)', category: 'Derivados de Vegetal', price: 221.88, image: 'https://i.imgur.com/2pvaNlo.png' },
  { id: 1321, name: 'MARGARINA GRANDE COM SAL 80 % QUALY SADIA 1 KILO (CX 6 UN)', category: 'Derivados de Vegetal', price: 89.37, image: 'https://i.imgur.com/urRQ89Q.png' },
  { id: 1322, name: 'MARGARINA MÉDIA COM SAL 80 % DORIANA 500 G (CX 12 UN)', category: 'Derivados de Vegetal', price: 85.44, image: 'https://i.imgur.com/m6XOVD0.png' },
  { id: 1323, name: 'MARGARINA MÉDIA COM SAL 80 % QUALY SADIA 500 G (CX 12 UN)', category: 'Derivados de Vegetal', price: 98.33, image: 'https://i.imgur.com/vl3Jh8E.png' },
  { id: 1324, name: 'MARGARINA PEQUENA COM SAL 75 % SOFITELI 3 KILO', category: 'Derivados de Vegetal', price: 37.16, image: 'https://i.imgur.com/9PvAOzK.png' },
  { id: 1325, name: 'MARGARINA PEQUENA COM SAL 80 % DORIANA 250 G (CX 24 UN)', category: 'Derivados de Vegetal', price: 97.35, image: 'https://i.imgur.com/2Io83BW.png' },
  { id: 1326, name: 'MARGARINA PEQUENA COM SAL 80 % QUALY SADIA 250 G (CX 24 UN)', category: 'Derivados de Vegetal', price: 113.79, image: 'https://i.imgur.com/FoHU8JD.png' },
  { id: 1327, name: 'MARGARINA SACHÊ COM SAL LECO 10 G (CX 192 UN)', category: 'Derivados de Vegetal', price: 65.38, image: 'https://i.imgur.com/2vZuKrp.png' },
  { id: 1328, name: 'MARGARINA SEM SAL 80 % AMÉLIA 1,010 KILO (CX 12 UN)', category: 'Derivados de Vegetal', price: 200.82, image: 'https://i.imgur.com/OjQOX80.png' },
  { id: 1329, name: 'MARGARINA SEM SAL 80 % COAMO (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 161.35, image: 'https://i.imgur.com/MSr4HiG.png' },
  { id: 1330, name: 'MILHO CONGELADO GRANO 2 KILO', category: 'Derivados de Vegetal', price: 39.05, image: 'https://i.imgur.com/NQto74C.png' },
  { id: 1331, name: 'MILHO PARA PIPOCA KISABOR 400 G (FDO 24 PCT)', category: 'Derivados de Vegetal', price: 4.02, image: 'https://i.imgur.com/TGGcoQ6.png' },
  { id: 1332, name: 'MILHO PARA PIPOCA PREMIUM CAMIL 500 G (FDO 12 PCT)', category: 'Derivados de Vegetal', price: 4.94, image: 'https://i.imgur.com/TKkvfYH.png' },
  { id: 1333, name: 'MILHO PARA PIPOCA PREMIUM YOKI 400 G (FDO 28 PCT)', category: 'Derivados de Vegetal', price: 7.86, image: 'https://i.imgur.com/wcwYc5f.png' },
  { id: 1334, name: 'MISTURA DE ÓLEOS VEGETAIS FRY SEBELLA SINA (BD 15,8 L)', category: 'Derivados de Vegetal', price: 147.2, image: 'https://i.imgur.com/m4zCqXo.png' },
  { id: 1335, name: 'MOLHO GRILL ZAFRÁN 1,05 KILO', category: 'Derivados de Vegetal', price: 29.2, image: 'https://i.imgur.com/6LjOSVA.png' },
  { id: 1336, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://i.imgur.com/a72ksDi.png' },
  { id: 1337, name: 'MOSTARDA AMARELA HEINZ 255 G (CX 16 FR)', category: 'Derivados de Vegetal', price: 216.67, image: 'https://i.imgur.com/5p1r9dw.png' },
  { id: 1338, name: 'MOSTARDA AMARELA HEMMER 1 KILO', category: 'Derivados de Vegetal', price: 16.3, image: 'https://i.imgur.com/UyaJpRM.png' },
  { id: 1339, name: 'MOSTARDA AMARELA KISABOR 1,01 KILO', category: 'Derivados de Vegetal', price: 6.22, image: 'https://i.imgur.com/bcfAFgt.png' },
  { id: 1340, name: 'MOSTARDA COM MEL CEPÊRA 400 G', category: 'Derivados de Vegetal', price: 12.45, image: 'https://i.imgur.com/bB8Oyvt.png' },
  { id: 1341, name: 'MOSTARDA DIJON CEPÊRA 190 G', category: 'Derivados de Vegetal', price: 9.85, image: 'https://i.imgur.com/KevgBOh.png' },
  { id: 1342, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://i.imgur.com/lVoMxr8.png' },
  { id: 1343, name: 'MOSTARDA ESCURA HEMMER 200 G', category: 'Derivados de Vegetal', price: 8.84, image: 'https://i.imgur.com/hVsvL40.png' },
  { id: 1344, name: 'MOSTARDA GRANDE AMARELA CEPÊRA 3,3 KILO', category: 'Derivados de Vegetal', price: 24.28, image: 'https://i.imgur.com/1uan5DH.png' },
  { id: 1345, name: 'MOSTARDA GRANDE AMARELA EKMA 3,3 KILO', category: 'Derivados de Vegetal', price: 21.17, image: 'https://i.imgur.com/8h426xO.png' },
  { id: 1346, name: 'MOSTARDA GRANDE AMARELA HEINZ 2 KILO', category: 'Derivados de Vegetal', price: 44.38, image: 'https://i.imgur.com/FUw5mIY.png' },
  { id: 1347, name: 'MOSTARDA GRANDE AMARELA HEMMER 3,6 KILO', category: 'Derivados de Vegetal', price: 42.65, image: 'https://i.imgur.com/jY7Bfcv.png' },
  { id: 1348, name: 'MOSTARDA GRANDE AMARELA LANCHERO 3 KILO (FD 6 GL)', category: 'Derivados de Vegetal', price: 12.36, image: 'https://i.imgur.com/PH0IjNY.png' },
  { id: 1349, name: 'MOSTARDA SACHÊ CEPÊRA 7 G (CX 175 UN)', category: 'Derivados de Vegetal', price: 18.16, image: 'https://i.imgur.com/8XD9goo.png' },
  { id: 1350, name: 'MOSTARDA SACHÊ EKMA 7 G (CX 168 UN)', category: 'Derivados de Vegetal', price: 13.28, image: 'https://i.imgur.com/02bLfY1.png' },
  { id: 1351, name: 'MOSTARDA SACHÊ FUGINI 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 13.68, image: 'https://i.imgur.com/5JHabZL.png' },
  { id: 1352, name: 'MOSTARDA SACHÊ HEINZ 5 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 20.44, image: 'https://i.imgur.com/viUDKZN.png' },
  { id: 1353, name: 'MOSTARDA SACHÊ HEMMER 7 G (CX 190 UN)', category: 'Derivados de Vegetal', price: 19.42, image: 'https://i.imgur.com/Rbe0STF.png' },
  { id: 1354, name: 'MOSTARDA SACHÊ LANCHERO 7 G (CX 150 UN)', category: 'Derivados de Vegetal', price: 10.72, image: 'https://i.imgur.com/JUEVC5y.png' },
  { id: 1355, name: 'ÓLEO DE ALGODÃO ELOGIATA FLOR DE ALGODÃO (BD 15,8 L)', category: 'Derivados de Vegetal', price: 180.15, image: 'https://i.imgur.com/7n8ckfX.png' },
  { id: 1356, name: 'ÓLEO DE ALGODÃO LIZA (BD 15,8 L)', category: 'Derivados de Vegetal', price: 201.94, image: 'https://i.imgur.com/NAb4EqE.png' },
  { id: 1357, name: 'ÓLEO DE ALGODÃO LIZA 900 ML', category: 'Derivados de Vegetal', price: 14.96, image: 'https://i.imgur.com/daPMzLH.png' },
  { id: 1358, name: 'ÓLEO DE ALGODÃO SOYA (BD 15,8 L)', category: 'Derivados de Vegetal', price: 205.11, image: 'https://i.imgur.com/lV3B9cU.png' },
  { id: 1359, name: 'ÓLEO DE CANOLA LIZA 900 ML', category: 'Derivados de Vegetal', price: 16.43, image: 'https://i.imgur.com/fR4SHZt.png' },
  { id: 1360, name: 'ÓLEO DE GIRASSOL LIZA 900 ML', category: 'Derivados de Vegetal', price: 15.97, image: 'https://i.imgur.com/1GsYIIZ.png' },
  { id: 1361, name: 'ÓLEO DE MILHO LIZA 900 ML', category: 'Derivados de Vegetal', price: 16.23, image: 'https://i.imgur.com/2YBpMuS.png' },
  { id: 1362, name: 'ÓLEO DE SOJA COAMO 900 ML (CX 20 FR)', category: 'Derivados de Vegetal', price: 176.84, image: 'https://i.imgur.com/reb1Ac6.png' },
  { id: 1363, name: 'ÓLEO DE SOJA COCAMAR (LT 18 L)', category: 'Derivados de Vegetal', price: 194.25, image: 'https://i.imgur.com/Ee2qzim.png' },
  { id: 1364, name: 'ÓLEO DE SOJA LIZA 900 ML', category: 'Derivados de Vegetal', price: 54.22, image: 'https://i.imgur.com/8Ad9xpm.png' },
  { id: 1365, name: 'ÓLEO DE SOJA VILA VELHA (GL 18 L)', category: 'Derivados de Vegetal', price: 158.99, image: 'https://i.imgur.com/07K8oYv.png' },
  { id: 1366, name: 'ÓLEO DE SOJA VILA VELHA 900 ML (CX 20 FR)', category: 'Derivados de Vegetal', price: 161.43, image: 'https://i.imgur.com/gLAbCcC.png' },
  { id: 1367, name: 'ORÉGANO CHILENO DI SALERNO 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 37.93, image: 'https://i.imgur.com/Wj3BbA4.png' },
  { id: 1368, name: 'ORÉGANO FLOCOS PENINA 200 G (FD 40 PCT)', category: 'Derivados de Vegetal', price: 10.85, image: 'https://i.imgur.com/gfA8PoF.png' },
  { id: 1369, name: 'ORÉGANO NACIONAL DA TERRINHA 200 G', category: 'Derivados de Vegetal', price: 10.75, image: 'https://i.imgur.com/HVorFNl.png' },
  { id: 1370, name: 'ORÉGANO NACIONAL KISABOR 200 G', category: 'Derivados de Vegetal', price: 6.12, image: 'https://i.imgur.com/Xpoe8JM.png' },
  { id: 1371, name: 'ORÉGANO PEQUENO PERUANO ARCO BELLO 500 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 12.17, image: 'https://i.imgur.com/Ushkp19.png' },
  { id: 1372, name: 'ORÉGANO PERUANO ARCO BELLO 1,01 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 24.19, image: 'https://i.imgur.com/WEvE9Ev.png' },
  { id: 1373, name: 'PALMITO BANDA AÇAÍ PALMEIRAL 500 G', category: 'Derivados de Vegetal', price: 21.34, image: 'https://i.imgur.com/RsifVSt.png' },
  { id: 1374, name: 'PALMITO BANDA PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 46.43, image: 'https://i.imgur.com/Y0kHycF.png' },
  { id: 1375, name: 'PALMITO BANDA PUPUNHA ITARIRI 1,8 KILO', category: 'Derivados de Vegetal', price: 42.18, image: 'https://i.imgur.com/94RkaI1.png' },
  { id: 1376, name: 'PALMITO INTEIRO AÇAÍ PALMEIRAL 540 G', category: 'Derivados de Vegetal', price: 22.55, image: 'https://i.imgur.com/yp1mNTE.png' },
  { id: 1377, name: 'PALMITO INTEIRO AÇAÍ SANEDE 500 G', category: 'Derivados de Vegetal', price: 28.16, image: 'https://i.imgur.com/7ImSIhM.png' },
  { id: 1378, name: 'PALMITO INTEIRO PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 75.41, image: 'https://i.imgur.com/V8EbR0j.png' },
  { id: 1379, name: 'PALMITO INTEIRO PUPUNHA OURO DO VALE 1,8 KILO', category: 'Derivados de Vegetal', price: 76.69, image: 'https://i.imgur.com/Z7CwV6d.png' },
  { id: 1380, name: 'PALMITO PICADO AÇAÍ PALMEIRAL 540 G', category: 'Derivados de Vegetal', price: 14.1, image: 'https://i.imgur.com/WkipY9d.png' },
  { id: 1381, name: 'PALMITO PICADO PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 40.27, image: 'https://i.imgur.com/NLoksu5.png' },
  { id: 1382, name: 'PALMITO PICADO PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 41.06, image: 'https://i.imgur.com/UhxGJox.png' },
  { id: 1383, name: 'PALMITO PICADO PUPUNHA ITARIRI 1,8 KILO', category: 'Derivados de Vegetal', price: 37.62, image: 'https://i.imgur.com/4pfz8XO.png' },
  { id: 1384, name: 'PALMITO PICADO PUPUNHA OURO DO VALE 1,8 KILO', category: 'Derivados de Vegetal', price: 37.28, image: 'https://i.imgur.com/rk6uXwu.png' },
  { id: 1385, name: 'PALMITO PICADO PUPUNHA POTE D´ORO 1,8 KILO', category: 'Derivados de Vegetal', price: 38.34, image: 'https://i.imgur.com/YUhPcZ3.png' },
  { id: 1386, name: 'PALMITO PICADO PUPUNHA PREMIER 1,8 KILO', category: 'Derivados de Vegetal', price: 45.72, image: 'https://i.imgur.com/M694bOE.png' },
  { id: 1387, name: 'PALMITO RODELA PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 44.73, image: 'https://i.imgur.com/z1hHShN.png' },
  { id: 1388, name: 'PALMITO RODELA PUPUNHA OURO DO VALE 1,8 KILO', category: 'Derivados de Vegetal', price: 45.8, image: 'https://i.imgur.com/k6105S9.png' },
  { id: 1389, name: 'PRODUTO EM FALTA', category: 'Derivados de Vegetal', price: 0, image: 'https://i.imgur.com/RnUn7QY.png' },
  { id: 1390, name: 'PEPININHO GRANJA SÃO PAULO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 37.22, image: 'https://i.imgur.com/ujXm1nl.png' },
  { id: 1391, name: 'PEPININHO YGUARA (BD 2 KILO)', category: 'Derivados de Vegetal', price: 37.22, image: 'https://i.imgur.com/ByVfbdc.png' },
  { id: 1392, name: 'PEPINOS RODELAS AGRIDOCE HEMMER 440 G', category: 'Derivados de Vegetal', price: 20.6, image: 'https://i.imgur.com/5j4OWq7.png' },
  { id: 1393, name: 'PICKLES DILL MCCOY´S 2 KILO', category: 'Derivados de Vegetal', price: 100.86, image: 'https://i.imgur.com/2eVebGv.png' },
  { id: 1394, name: 'PICKLES MISTO GRANJA SÃO PAULO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 40.08, image: 'https://i.imgur.com/s33wd0Z.png' },
  { id: 1395, name: 'PICKLES SWEET MCCOY´S 2 KILO', category: 'Derivados de Vegetal', price: 100.86, image: 'https://i.imgur.com/xhbedcv.png' },
  { id: 1396, name: 'PIMENTA BIQUINHO ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 52.97, image: 'https://i.imgur.com/xHPdsXF.png' },
  { id: 1397, name: 'PIMENTA BIQUINHO YGUARA (BD 2 KILO)', category: 'Derivados de Vegetal', price: 51.39, image: 'https://i.imgur.com/F6qnSRx.png' },
  { id: 1398, name: 'PIMENTA JALAPEÑO MCCOY´S 1 KILO', category: 'Derivados de Vegetal', price: 89.93, image: 'https://i.imgur.com/yrbjIn9.png' },
  { id: 1399, name: 'POLENTA CONGELADA ARRICO 1 KILO (CX 12 PCT)', category: 'Derivados de Vegetal', price: 79.76, image: 'https://i.imgur.com/5CNCNf2.png' },
  { id: 1400, name: 'POLENTA CONGELADA EASY CHEF 1,1 KILO (CX 10 PCT)', category: 'Derivados de Vegetal', price: 70.74, image: 'https://i.imgur.com/4f7BUYP.png' },
  { id: 1401, name: 'PROTEÍNA TEXTURIZADA DE SOJA CLARA FRANGO CAMIL 400 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 5.57, image: 'https://i.imgur.com/DnQ5tlw.png' },
  { id: 1402, name: 'PROTEÍNA TEXTURIZADA DE SOJA ESCURA CARNE CAMIL 400 G (FDO 20 PCT)', category: 'Derivados de Vegetal', price: 5.6, image: 'https://i.imgur.com/hOnaDLg.png' },
  { id: 1403, name: 'PURÊ DE BATATA TECNUTRI 800 G', category: 'Derivados de Vegetal', price: 30.6, image: 'https://i.imgur.com/9M4yJzX.png' },
  { id: 1404, name: 'PURÊ DE BATATAS AJINOMOTO 1 KILO', category: 'Derivados de Vegetal', price: 50.79, image: 'https://i.imgur.com/WejE7vg.png' },
  { id: 1405, name: 'PURÊ DE BATATAS JUNIOR 1,01 KILO', category: 'Derivados de Vegetal', price: 57.68, image: 'https://i.imgur.com/gEqWsJ9.png' },
  { id: 1406, name: 'PURÊ DE BATATAS KISABOR 1 KILO', category: 'Derivados de Vegetal', price: 42.01, image: 'https://i.imgur.com/1bSOict.png' },
  { id: 1407, name: 'PURÊ DE BATATAS QUALIMAX 800 G', category: 'Derivados de Vegetal', price: 47.52, image: 'https://i.imgur.com/9l9yHzS.png' },
  { id: 1408, name: 'PURÊ DE BATATAS RECEITA COMPLETA QUALIMAX 800 G', category: 'Derivados de Vegetal', price: 49.24, image: 'https://i.imgur.com/iEr64fP.png' },
  { id: 1409, name: 'SELETA DE LEGUMES CONGELADA GRANO 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 185.7, image: 'https://i.imgur.com/PFkMNVp.png' },
  { id: 1410, name: 'SELETA DE LEGUMES CONGELADA PRATIGEL 1,02 KILO (CX 12 PCT)', category: 'Derivados de Vegetal', price: 141.39, image: 'https://i.imgur.com/e5JW9pj.png' },
  { id: 1411, name: 'TOMATE ITALIANO MADURO (CX 17 KILO)', category: 'Derivados de Vegetal', price: 106.34, image: 'https://i.imgur.com/JRe4cKm.png' },
  { id: 1412, name: 'TOMATE ITALIANO SALADA (CX 17 KILO)', category: 'Derivados de Vegetal', price: 106.34, image: 'https://i.imgur.com/Ot9hY7X.png' },
  { id: 1413, name: 'TOMATE SECO ARCO BELLO 1,4 KILO', category: 'Derivados de Vegetal', price: 27.25, image: 'https://i.imgur.com/pyxH67s.png' },
  { id: 1414, name: 'TOMATE SECO YGUARA 1,4 KILO', category: 'Derivados de Vegetal', price: 26.45, image: 'https://i.imgur.com/GsXtWhz.png' },
  { id: 1415, name: 'TOMATE TRITURADO EKMA 1,7 KILO', category: 'Derivados de Vegetal', price: 14.84, image: 'https://i.imgur.com/NIVb4Yn.png' },
  { id: 1416, name: 'TOMATE TRITURADO POMAROLA 1,7 KILO (CX 6 BAG)', category: 'Derivados de Vegetal', price: 96.49, image: 'https://i.imgur.com/j81VdUX.png' },
  { id: 1417, name: 'VINAGRE BALSÂMICO DE MODENA GALLO 250 ML', category: 'Derivados de Vegetal', price: 15.78, image: 'https://i.imgur.com/Js3Wd23.png' },
  { id: 1418, name: 'VINAGRE BALSÂMICO TRADIZIONALE CASTELO 500 ML', category: 'Derivados de Vegetal', price: 22.03, image: 'https://i.imgur.com/mG6WPHq.png' },
  { id: 1419, name: 'VINAGRE DE ÁLCOOL CASTELO 750 ML (CX 12 FR)', category: 'Derivados de Vegetal', price: 50.45, image: 'https://i.imgur.com/Vp3Fpw1.png' },
  { id: 1420, name: 'VINAGRE DE ÁLCOOL COLORIDO CASTELO 750 ML (CX 12 FR)', category: 'Derivados de Vegetal', price: 47.14, image: 'https://i.imgur.com/4rn4H6q.png' },
  { id: 1421, name: 'VINAGRE DE ÁLCOOL COLORIDO NEVAL 750 ML (CX 12 FR)', category: 'Derivados de Vegetal', price: 26.63, image: 'https://i.imgur.com/CcyPvdO.png' },
  { id: 1422, name: 'VINAGRE DE ARROZ CASTELO 750 ML (CX 12 FR)', category: 'Derivados de Vegetal', price: 115.55, image: 'https://i.imgur.com/4cTCrZ4.png' },
  { id: 1423, name: 'VINAGRE DE MAÇÃ CASTELO 750 ML (CX 12 FR)', category: 'Derivados de Vegetal', price: 139.57, image: 'https://i.imgur.com/I7rIZts.png' },
  { id: 1424, name: 'VINAGRE DE VINHO BRANCO GALLO 250 ML (CX 6 FR)', category: 'Derivados de Vegetal', price: 71.58, image: 'https://i.imgur.com/uIkJ0xO.png' },
  { id: 1425, name: 'VINAGRE DE VINHO TINTO GALLO 250 ML (CX 6 FR)', category: 'Derivados de Vegetal', price: 68.17, image: 'https://i.imgur.com/nweo5ly.png' },
  { id: 1426, name: 'VINAGRE GRANDE DE ÁLCOOL CASTELO (GL 5 L)', category: 'Derivados de Vegetal', price: 21.36, image: 'https://i.imgur.com/cgo4IVU.png' },
  { id: 1427, name: 'VINAGRE GRANDE DE ÁLCOOL TOSCANO (GL 5 L)', category: 'Derivados de Vegetal', price: 14.96, image: 'https://i.imgur.com/adjgNEQ.png' },
  { id: 1428, name: 'VINAGRE SACHÊ DE VINHO TINTO BOM SABOR 4 ML (CX 200 UN)', category: 'Derivados de Vegetal', price: 29.55, image: 'https://i.imgur.com/wPseJRG.png' },
  { id: 1429, name: 'ALICHE ARGENTINO A VÁCUO DI SALERNO 500 G', category: 'Derivados do Mar', price: 138.04, image: 'https://i.imgur.com/215moVe.png' },
  { id: 1430, name: 'ALICHE ARGENTINO A VÁCUO MARCOL 500 G', category: 'Derivados do Mar', price: 122.07, image: 'https://i.imgur.com/yBvODJR.png' },
  { id: 1431, name: 'ALICHE ARGENTINO DI SALERNO 1,5 KILO', category: 'Derivados do Mar', price: 394.27, image: 'https://i.imgur.com/cCRWLeF.png' },
  { id: 1432, name: 'ALICHE NACIONAL RIBAMAR', category: 'Derivados do Mar', price: 49.18, image: 'https://i.imgur.com/870ooCq.png' },
  { id: 1433, name: 'ATUM GRANDE PEDAÇOS EM ÓLEO POUCH GOMES DA COSTA 1 KILO', category: 'Derivados do Mar', price: 60.52, image: 'https://i.imgur.com/pFTjxbB.png' },
  { id: 1434, name: 'ATUM GRANDE RALADO AO NATURAL POUCH GOMES DA COSTA 1 KILO', category: 'Derivados do Mar', price: 50.05, image: 'https://i.imgur.com/yTd9gTY.png' },
  { id: 1435, name: 'ATUM GRANDE RALADO EM ÓLEO POUCH 88 1 KILO', category: 'Derivados do Mar', price: 46.26, image: 'https://i.imgur.com/ZaKiNWn.png' },
  { id: 1436, name: 'ATUM GRANDE RALADO EM ÓLEO POUCH GOMES DA COSTA 1 KILO', category: 'Derivados do Mar', price: 50.3, image: 'https://i.imgur.com/QUqsf65.png' },
  { id: 1437, name: 'ATUM PEDAÇOS EM ÓLEO MARSUL 400 G', category: 'Derivados do Mar', price: 28.26, image: 'https://i.imgur.com/JkBfa2O.png' },
  { id: 1438, name: 'PRODUTO EM FALTA', category: 'Derivados do Mar', price: 0, image: 'https://i.imgur.com/jmHqCyU.png' },
  { id: 1439, name: 'ATUM PEDAÇOS EM ÓLEO POUCH COQUEIRO 480 G', category: 'Derivados do Mar', price: 26.05, image: 'https://i.imgur.com/JVstQ1C.png' },
  { id: 1440, name: 'ATUM PEDAÇOS EM ÓLEO POUCH GOMES DA COSTA 500 G', category: 'Derivados do Mar', price: 31.55, image: 'https://i.imgur.com/QBjRtM2.png' },
  { id: 1441, name: 'ATUM PEDAÇOS EM ÓLEO TOURS 400 G', category: 'Derivados do Mar', price: 28.26, image: 'https://i.imgur.com/H2a9JkB.png' },
  { id: 1442, name: 'ATUM PEQUENO PEDAÇOS EM ÓLEO 88 140 G (CX 24 LT)', category: 'Derivados do Mar', price: 182.27, image: 'https://i.imgur.com/NZullU8.png' },
  { id: 1443, name: 'ATUM PEQUENO PEDAÇOS EM ÓLEO GOMES DA COSTA 170 G (CX 24 LT)', category: 'Derivados do Mar', price: 215.2, image: 'https://i.imgur.com/aYVE1pj.png' },
  { id: 1444, name: 'ATUM PEQUENO RALADO EM ÓLEO COQUEIRO 170 G (CX 24 LT)', category: 'Derivados do Mar', price: 178.06, image: 'https://i.imgur.com/XPoR4NN.png' },
  { id: 1445, name: 'ATUM PEQUENO RALADO EM ÓLEO GOMES DA COSTA 170 G (CX 24 LT)', category: 'Derivados do Mar', price: 179.86, image: 'https://i.imgur.com/kiGrnBZ.png' },
  { id: 1446, name: 'ATUM PEQUENO RALADO EM ÓLEO PESCADOR 140 G (CX 24 LT)', category: 'Derivados do Mar', price: 156.27, image: 'https://i.imgur.com/zvSiS84.png' },
  { id: 1447, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO 88 140 G (CX 24 LT)', category: 'Derivados do Mar', price: 204.26, image: 'https://i.imgur.com/dObyZi1.png' },
  { id: 1448, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO COQUEIRO 170 G (CX 24 LT)', category: 'Derivados do Mar', price: 228.83, image: 'https://i.imgur.com/ruLdVvG.png' },
  { id: 1449, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO GOMES DA COSTA 170 G (CX 24 LT)', category: 'Derivados do Mar', price: 243.55, image: 'https://i.imgur.com/ENxVSaM.png' },
  { id: 1450, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO PESCADOR 140 G (CX 24 LT)', category: 'Derivados do Mar', price: 196.38, image: 'https://i.imgur.com/VnFK0uJ.png' },
  { id: 1451, name: 'ATUM RALADO EM ÓLEO CHICHARRO SANTA RITA 410 G', category: 'Derivados do Mar', price: 12.66, image: 'https://i.imgur.com/Zu6umCq.png' },
  { id: 1452, name: 'ATUM RALADO EM ÓLEO MARSUL 400 G', category: 'Derivados do Mar', price: 23.47, image: 'https://i.imgur.com/RG0dXW9.png' },
  { id: 1453, name: 'ATUM RALADO EM ÓLEO POUCH 88 500 G', category: 'Derivados do Mar', price: 19.42, image: 'https://i.imgur.com/Pya1HhO.png' },
  { id: 1454, name: 'ATUM RALADO EM ÓLEO POUCH COQUEIRO 480 G', category: 'Derivados do Mar', price: 21.68, image: 'https://i.imgur.com/nbUieJw.png' },
  { id: 1455, name: 'ATUM RALADO EM ÓLEO POUCH GOMES DA COSTA 500 G', category: 'Derivados do Mar', price: 26.46, image: 'https://i.imgur.com/54hczAy.png' },
  { id: 1456, name: 'ATUM RALADO EM ÓLEO TOURS 400 G', category: 'Derivados do Mar', price: 25.09, image: 'https://i.imgur.com/dz4hhCC.png' },
  { id: 1457, name: 'ATUM SÓLIDO EM ÓLEO MARSUL 400 G', category: 'Derivados do Mar', price: 30.02, image: 'https://i.imgur.com/EWt6LTs.png' },
  { id: 1458, name: 'ATUM SÓLIDO EM ÓLEO TOURS 420 G', category: 'Derivados do Mar', price: 32.09, image: 'https://i.imgur.com/awSIYpy.png' },
  { id: 1459, name: 'BACALHAU DESFIADO REFOGADO TEMPERADO RG 300 G', category: 'Derivados do Mar', price: 45.6, image: 'https://i.imgur.com/yOGXut5.png' },
  { id: 1460, name: 'PRODUTO EM FALTA', category: 'Derivados do Mar', price: 0, image: 'https://i.imgur.com/iiy8bTW.png' },
  { id: 1461, name: 'CAMARÃO CONGELADO DESCASCADO 7 BARBAS NOVA PESCA 2 KILO', category: 'Derivados do Mar', price: 37.88, image: 'https://i.imgur.com/crrnahG.png' },
  { id: 1462, name: 'CAMARÃO COZIDO REFOGADO TEMPERADO RG 300 G', category: 'Derivados do Mar', price: 47.77, image: 'https://i.imgur.com/euOFhEE.png' },
  { id: 1463, name: 'FILÉ DE MERLUZA CONGELADO IQF PALEMON 1 KILO', category: 'Derivados do Mar', price: 21.93, image: 'https://i.imgur.com/bOoQBcC.png' },
  { id: 1464, name: 'FILÉ DE TILÁPIA CONGELADO NOVA PESCA 5 KILO', category: 'Derivados do Mar', price: 137.9, image: 'https://i.imgur.com/HW7RRza.png' },
  { id: 1465, name: 'FILÉ DE TILÁPIA CONGELADO PALEMON 800 G', category: 'Derivados do Mar', price: 31.64, image: 'https://i.imgur.com/scig0ZB.png' },
  { id: 1466, name: 'ISCAS DE FILÉ DE TILÁPIA EMPANADAS CONGELADAS IQF BAITA 700 G', category: 'Derivados do Mar', price: 22.57, image: 'https://i.imgur.com/jHRczYP.png' },
  { id: 1467, name: 'POSTA DE CAÇÃO CONGELADA VIEIRA E COUTO 1 KILO', category: 'Derivados do Mar', price: 50.25, image: 'https://i.imgur.com/rFfTC87.png' },
  { id: 1468, name: 'SARDINHAS EM ÓLEO COQUEIRO 125 G (CX 54 LT)', category: 'Derivados do Mar', price: 273.03, image: 'https://i.imgur.com/6xahFFS.png' },
  { id: 1469, name: 'SARDINHAS EM ÓLEO GOMES DA COSTA 125 G (CX 50 LT)', category: 'Derivados do Mar', price: 268.94, image: 'https://i.imgur.com/gZtkNUp.png' },
  { id: 1470, name: 'ABACAXI EM CALDA RODELAS TOZZI 400 G', category: 'Doces/Frutas', price: 17.81, image: 'https://i.imgur.com/x4525Ai.png' },
  { id: 1471, name: 'ACHOCOLATADO EM PÓ ITALAC 700 G', category: 'Doces/Frutas', price: 9.82, image: 'https://i.imgur.com/1nqZvYK.png' },
  { id: 1472, name: 'ACHOCOLATADO EM PÓ NESCAU 2 KILO', category: 'Doces/Frutas', price: 43.1, image: 'https://i.imgur.com/SfJYI03.png' },
  { id: 1473, name: 'ACHOCOLATADO EM PÓ OVOMALTINE FLOCOS CROCANTES 750 G', category: 'Doces/Frutas', price: 38.99, image: 'https://i.imgur.com/9V6TxUE.png' },
  { id: 1474, name: 'ACHOCOLATADO EM PÓ TODDY 1.8 KILO', category: 'Doces/Frutas', price: 43.46, image: 'https://i.imgur.com/q8nCTnu.png' },
  { id: 1475, name: 'AÇÚCAR CONFEITEIRO GLAÇÚCAR UNIÃO 500 G (FDO 20 PCT)', category: 'Doces/Frutas', price: 62.45, image: 'https://i.imgur.com/39TviXz.png' },
  { id: 1476, name: 'AÇÚCAR CONFEITEIRO ITAIQUARA 1 KILO', category: 'Doces/Frutas', price: 11.94, image: 'https://i.imgur.com/Ltl0oZ8.png' },
  { id: 1477, name: 'AÇÚCAR CRISTALÇUCAR UNIÃO 1 KILO (FDO 10 PCT)', category: 'Doces/Frutas', price: 50.26, image: 'https://i.imgur.com/ufVOgPe.png' },
  { id: 1478, name: 'AÇÚCAR DEMERARA DA BARRA 1 KILO', category: 'Doces/Frutas', price: 57.07, image: 'https://i.imgur.com/YnDV7Fn.png' },
  { id: 1479, name: 'AÇÚCAR DEMERARA NATURALE UNIÃO 1 KILO', category: 'Doces/Frutas', price: 69.25, image: 'https://i.imgur.com/pUnK84t.png' },
  { id: 1480, name: 'AÇÚCAR MASCAVO 3 GARÇAS 1 KILO', category: 'Doces/Frutas', price: 10.6, image: 'https://i.imgur.com/KNYg1tY.png' },
  { id: 1481, name: 'AÇÚCAR MASCAVO MINAMEL 1 KILO', category: 'Doces/Frutas', price: 9.6, image: 'https://i.imgur.com/LuLgzix.png' },
  { id: 1482, name: 'AÇÚCAR MASCAVO UNIÃO 1 KILO', category: 'Doces/Frutas', price: 17.36, image: 'https://i.imgur.com/6Duqpnv.png' },
  { id: 1483, name: 'AÇÚCAR ORGÂNICO UNIÃO 1 KILO', category: 'Doces/Frutas', price: 7.04, image: 'https://i.imgur.com/1o6qk48.png' },
  { id: 1484, name: 'AÇÚCAR REFINADO ALTO ALEGRE 1 KILO (FDO 10 PCT)', category: 'Doces/Frutas', price: 46.09, image: 'https://i.imgur.com/OAA8hCL.png' },
  { id: 1485, name: 'AÇÚCAR REFINADO CARAVELAS 1 KILO (FDO 10 PCT)', category: 'Doces/Frutas', price: 46.4, image: 'https://i.imgur.com/Uv6SgTb.png' },
  { id: 1486, name: 'AÇÚCAR REFINADO GRANULADO DOÇÚCAR UNIÃO 1 KILO', category: 'Doces/Frutas', price: 52.73, image: 'https://i.imgur.com/s1hkDRx.png' },
  { id: 1487, name: 'AÇÚCAR REFINADO UNIÃO 1 KILO (FDO 10 PCT)', category: 'Doces/Frutas', price: 49.29, image: 'https://i.imgur.com/Ql2vnx7.png' },
  { id: 1488, name: 'AÇÚCAR SACHÊ CRISTAL GUARANI 5 G (CX 1000 UN)', category: 'Doces/Frutas', price: 52.69, image: 'https://i.imgur.com/KMkuQGZ.png' },
  { id: 1489, name: 'AÇÚCAR SACHÊ MASCAVO UNIÃO 4 G (CX 200 UN)', category: 'Doces/Frutas', price: 25.88, image: 'https://i.imgur.com/MMkDf3Z.png' },
  { id: 1490, name: 'AÇÚCAR SACHÊ ORGÂNICO UNIÃO 5 G (CX 400 UN)', category: 'Doces/Frutas', price: 21.86, image: 'https://i.imgur.com/qIj4jmV.png' },
  { id: 1491, name: 'AÇÚCAR SACHÊ PREMIUM UNIÃO 5 G (CX 400 UN)', category: 'Doces/Frutas', price: 19.87, image: 'https://i.imgur.com/Pqt6Nef.png' },
  { id: 1492, name: 'ADOÇANTE LÍQUIDO SUCRALOSE UNIÃO 65 ML (CX 12 FR)', category: 'Doces/Frutas', price: 83.68, image: 'https://i.imgur.com/99yRDML.png' },
  { id: 1493, name: 'ADOÇANTE SACHÊ DEGUST 0,4 G (CX 1000 UN)', category: 'Doces/Frutas', price: 51.93, image: 'https://i.imgur.com/nOPFjkc.png' },
  { id: 1494, name: 'ADOÇANTE SACHÊ SUCRALOSE UNIÃO 0,6 G (CX 400 UN)', category: 'Doces/Frutas', price: 32.53, image: 'https://i.imgur.com/Mfh8tYf.png' },
  { id: 1495, name: 'AMEIXA EM CALDA TOZZI 400 G', category: 'Doces/Frutas', price: 13.73, image: 'https://i.imgur.com/OF8NV7I.png' },
  { id: 1496, name: 'AMEIXA SECA SEM CAROÇO BRASILSECO 1KILO', category: 'Doces/Frutas', price: 34.36, image: 'https://i.imgur.com/SdoM62X.png' },
  { id: 1497, name: 'AMEIXA SECA SEM CAROÇO LERYC 1 KILO', category: 'Doces/Frutas', price: 31.12, image: 'https://i.imgur.com/DKZ75Ev.png' },
  { id: 1498, name: 'AMÊNDOA LAMINADA BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 109.41, image: 'https://i.imgur.com/UmV9Ap3.png' },
  { id: 1499, name: 'AMENDOIM TORRADO GRANULADO VABENE 1,05 KILO', category: 'Doces/Frutas', price: 19.42, image: 'https://i.imgur.com/n0olLdC.png' },
  { id: 1500, name: 'AMENDOIM TORRADO GRANULADO XERÉM LERYC 1 KILO', category: 'Doces/Frutas', price: 19.33, image: 'https://i.imgur.com/0iFDKoC.png' },
  { id: 1501, name: 'AMENDOIM TORRADO SALGADO SEM PELE BRASILSECO 1,01 KILO', category: 'Doces/Frutas', price: 20.01, image: 'https://i.imgur.com/LWwXGWB.png' },
  { id: 1502, name: 'AMENDOIM TORRADO SALGADO SEM PELE LERYC 1 KILO', category: 'Doces/Frutas', price: 22.05, image: 'https://i.imgur.com/RZkvB95.png' },
  { id: 1503, name: 'AROMA ARTIFICIAL DE BAUNILHA CEPÊRA 480 ML', category: 'Doces/Frutas', price: 18.74, image: 'https://i.imgur.com/zGTQCej.png' },
  { id: 1504, name: 'AVELÃ SEM CASCA LERYC 1 KILO', category: 'Doces/Frutas', price: 95.74, image: 'https://i.imgur.com/LW8Cvps.png' },
  { id: 1505, name: 'BOMBOM OURO BRANCO LACTA 1 KILO', category: 'Doces/Frutas', price: 64.28, image: 'https://i.imgur.com/4mIZcL2.png' },
  { id: 1506, name: 'BOMBOM SONHO DE VALSA LACTA 1 KILO', category: 'Doces/Frutas', price: 64.28, image: 'https://i.imgur.com/8E3HIbl.png' },
  { id: 1507, name: 'BRIGADEIRO COM REQUEIJÃO SANTA MARINA 1,350 KILO', category: 'Doces/Frutas', price: 35.94, image: 'https://i.imgur.com/33mh6UJ.png' },
  { id: 1508, name: 'BRIGADEIRO GRANDE MOÇA NESTLÉ 2,57 KILO', category: 'Doces/Frutas', price: 116.69, image: 'https://i.imgur.com/h3ebEsW.png' },
  { id: 1509, name: 'BRIGADEIRO PEQUENO MOÇA NESTLÉ 1,01 KILO', category: 'Doces/Frutas', price: 46.27, image: 'https://i.imgur.com/482AksP.png' },
  { id: 1510, name: 'CASTANHA DE CAJU TORRADA COM SAL BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 66.46, image: 'https://i.imgur.com/GNsThcj.png' },
  { id: 1511, name: 'CASTANHA DE CAJU TORRADA COM SAL LERYC 1 KILO', category: 'Doces/Frutas', price: 67.74, image: 'https://i.imgur.com/9X8EF9a.png' },
  { id: 1512, name: 'CASTANHA DO PARÁ BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 123.58, image: 'https://i.imgur.com/7syKNKJ.png' },
  { id: 1513, name: 'CASTANHA DO PARÁ QUEBRADA LERYC 1 KILO', category: 'Doces/Frutas', price: 148.26, image: 'https://i.imgur.com/sQLezql.png' },
  { id: 1514, name: 'CEBOLA CARAMELIZADA HOMEMADE 2 KILO', category: 'Doces/Frutas', price: 57.12, image: 'https://i.imgur.com/OMu9Axv.png' },
  { id: 1515, name: 'CEREJA MARRASQUINO SEM TALO CEPÊRA 125 G', category: 'Doces/Frutas', price: 18.48, image: 'https://i.imgur.com/VkIsR20.png' },
  { id: 1516, name: 'CEREJA MARRASQUINO SEM TALO CURICO 1,8 KILO', category: 'Doces/Frutas', price: 127.55, image: 'https://i.imgur.com/zUYU3gf.png' },
  { id: 1517, name: 'CEREJA MARRASQUINO SEM TALO TOZZI 2,2 KILO', category: 'Doces/Frutas', price: 138.08, image: 'https://i.imgur.com/uD4QNXN.png' },
  { id: 1518, name: 'CHOCOLATE AO LEITE MELKEN HARALD 2,1 KILO', category: 'Doces/Frutas', price: 176.38, image: 'https://i.imgur.com/zFJk787.png' },
  { id: 1519, name: 'CHOCOLATE AO LEITE NESTLÉ 2,1 KILO', category: 'Doces/Frutas', price: 160.03, image: 'https://i.imgur.com/dQn3mOv.png' },
  { id: 1520, name: 'CHOCOLATE BRANCO MELKEN HARALD 2,1 KILO', category: 'Doces/Frutas', price: 145.16, image: 'https://i.imgur.com/D9BQMEX.png' },
  { id: 1521, name: 'CHOCOLATE COBERTURA GOTAS AO LEITE TOP HARALD 2,050 KILO', category: 'Doces/Frutas', price: 153.43, image: 'https://i.imgur.com/zosDced.png' },
  { id: 1522, name: 'CHOCOLATE COBERTURA GOTAS MEIO AMARGO 42% CACAU MELKEN HARALD 1,010 KILO', category: 'Doces/Frutas', price: 77.04, image: 'https://i.imgur.com/C6RqQGB.png' },
  { id: 1523, name: 'CHOCOLATE EM PÓ 100% CACAU MELKEN HARALD 500 G', category: 'Doces/Frutas', price: 37.71, image: 'https://i.imgur.com/EkPtbj2.png' },
  { id: 1524, name: 'CHOCOLATE EM PÓ 33% CACAU DOCEIRO 1,05 KILO', category: 'Doces/Frutas', price: 29.85, image: 'https://i.imgur.com/NCPeiCo.png' },
  { id: 1525, name: 'CHOCOLATE EM PÓ 33% CACAU MELKEN HARALD 1,010 KILO', category: 'Doces/Frutas', price: 40.9, image: 'https://i.imgur.com/OUidaKm.png' },
  { id: 1526, name: 'CHOCOLATE EM PÓ 50% CACAU ALIBRA 1 KILO', category: 'Doces/Frutas', price: 42.47, image: 'https://i.imgur.com/q5jUPMc.png' },
  { id: 1527, name: 'CHOCOLATE EM PÓ 50% CACAU DOCEIRO 1,05 KILO', category: 'Doces/Frutas', price: 38.84, image: 'https://i.imgur.com/IvRWpg5.png' },
  { id: 1528, name: 'CHOCOLATE EM PÓ 50% CACAU DOIS FRADES NESTLÉ 1,01 KILO', category: 'Doces/Frutas', price: 79.46, image: 'https://i.imgur.com/SOxdzWW.png' },
  { id: 1529, name: 'CHOCOLATE EM PÓ 50% CACAU MELKEN HARALD 1,010 KILO', category: 'Doces/Frutas', price: 51.13, image: 'https://i.imgur.com/AH5Lxh5.png' },
  { id: 1530, name: 'CHOCOLATE EM PÓ 70% CACAU MELKEN HARALD 500 G', category: 'Doces/Frutas', price: 29.65, image: 'https://i.imgur.com/O5hDOta.png' },
  { id: 1531, name: 'CHOCOLATE FORNEÁVEL AO LEITE CAMP 1,010 KILO', category: 'Doces/Frutas', price: 34.88, image: 'https://i.imgur.com/YuK1zOm.png' },
  { id: 1532, name: 'CHOCOLATE FORNEÁVEL AO LEITE CONFEIPOP 1,010 KILO', category: 'Doces/Frutas', price: 25.83, image: 'https://i.imgur.com/FlJgPzQ.png' },
  { id: 1533, name: 'CHOCOLATE FORNEÁVEL AO LEITE CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 35.99, image: 'https://i.imgur.com/TlCauDA.png' },
  { id: 1534, name: 'CHOCOLATE FORNEÁVEL AO LEITE DOLCI SCALA 1,005 KILO', category: 'Doces/Frutas', price: 31.56, image: 'https://i.imgur.com/AOUYNLP.png' },
  { id: 1535, name: 'CHOCOLATE FORNEÁVEL AO LEITE VABENE 1,010 KILO', category: 'Doces/Frutas', price: 32.99, image: 'https://i.imgur.com/6T4IzWE.png' },
  { id: 1536, name: 'CHOCOLATE FORNEÁVEL AVELÃ CAMP 1,010 KILO', category: 'Doces/Frutas', price: 32.41, image: 'https://i.imgur.com/ibhlsqJ.png' },
  { id: 1537, name: 'CHOCOLATE FORNEÁVEL AVELÃ CONFEIPOP 1,010 KILO', category: 'Doces/Frutas', price: 27.19, image: 'https://i.imgur.com/kyJxubc.png' },
  { id: 1538, name: 'CHOCOLATE FORNEÁVEL AVELÃ CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 33.77, image: 'https://i.imgur.com/lqm1VC5.png' },
  { id: 1539, name: 'CHOCOLATE FORNEÁVEL BRANCO CONFEIPOP 1,010 KILO', category: 'Doces/Frutas', price: 23.9, image: 'https://i.imgur.com/Bk5VtVy.png' },
  { id: 1540, name: 'CHOCOLATE FORNEÁVEL BRANCO CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 28.09, image: 'https://i.imgur.com/UBkQM46.png' },
  { id: 1541, name: 'CHOCOLATE FORNEÁVEL BRANCO DOCEIRO 1,005 KILO', category: 'Doces/Frutas', price: 23.3, image: 'https://i.imgur.com/HvbTfeK.png' },
  { id: 1542, name: 'CHOCOLATE FORNEÁVEL BRANCO VABENE 1,010 KILO', category: 'Doces/Frutas', price: 23.41, image: 'https://i.imgur.com/09fiXJA.png' },
  { id: 1543, name: 'CHOCOLATE FORNEÁVEL GRANDE AO LEITE CONFEITEIRO HARALD 2,010 KILO', category: 'Doces/Frutas', price: 75.89, image: 'https://i.imgur.com/j0CeMdj.png' },
  { id: 1544, name: 'CHOCOLATE FORNEÁVEL GRANDE AO LEITE DOCEIRO 2,010 KILO', category: 'Doces/Frutas', price: 50.3, image: 'https://i.imgur.com/EJCscrb.png' },
  { id: 1545, name: 'CHOCOLATE FORNEÁVEL GRANDE AVELÃ DOCEIRO 2,010 KILO', category: 'Doces/Frutas', price: 52.44, image: 'https://i.imgur.com/cEHGr5M.png' },
  { id: 1546, name: 'CHOCOLATE GRANDE DISQUETI DORI 1,01 KILO', category: 'Doces/Frutas', price: 71.37, image: 'https://i.imgur.com/LGz1bvA.png' },
  { id: 1547, name: 'CHOCOLATE GRANULADO CROCANTE CAMP 1,010 KILO', category: 'Doces/Frutas', price: 18.81, image: 'https://i.imgur.com/sEOvr1U.png' },
  { id: 1548, name: 'CHOCOLATE GRANULADO CROCANTE CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 26.24, image: 'https://i.imgur.com/lwZ3zvJ.png' },
  { id: 1549, name: 'CHOCOLATE GRANULADO MACIO CAMP 1,010 KILO', category: 'Doces/Frutas', price: 24.55, image: 'https://i.imgur.com/e4FCNYy.png' },
  { id: 1550, name: 'CHOCOLATE GRANULADO MACIO CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 26.63, image: 'https://i.imgur.com/Mz3YHl9.png' },
  { id: 1551, name: 'CHOCOLATE INOVARE AO LEITE HARALD 2,1 KILO', category: 'Doces/Frutas', price: 81.09, image: 'https://i.imgur.com/IXLDjQg.png' },
  { id: 1552, name: 'CHOCOLATE INOVARE BRANCO HARALD 2,1 KILO', category: 'Doces/Frutas', price: 93.36, image: 'https://i.imgur.com/2rFf9Sv.png' },
  { id: 1553, name: 'CHOCOLATE INOVARE INTENSO MEIO AMARGO HARALD 2,1 KILO', category: 'Doces/Frutas', price: 81.44, image: 'https://i.imgur.com/hm6if8A.png' },
  { id: 1554, name: 'CHOCOLATE M&M´S 1 KILO', category: 'Doces/Frutas', price: 82.81, image: 'https://i.imgur.com/uESvaQE.png' },
  { id: 1555, name: 'CHOCOLATE MEIO AMARGO MELKEN HARALD 2,1 KILO', category: 'Doces/Frutas', price: 169.99, image: 'https://i.imgur.com/RWpAIPy.png' },
  { id: 1556, name: 'CHOCOLATE MEIO AMARGO NESTLÉ 2,1 KILO', category: 'Doces/Frutas', price: 160.88, image: 'https://i.imgur.com/W4Jt462.png' },
  { id: 1557, name: 'CHOCOLATE MINI DISQUETI DORI 500 G', category: 'Doces/Frutas', price: 36.43, image: 'https://i.imgur.com/nTnWi7j.png' },
  { id: 1558, name: 'CHOCOLATE PEQUENO PASTA CREMOSA KIT KAT NESTLÉ 1,01 KILO', category: 'Doces/Frutas', price: 76.89, image: 'https://i.imgur.com/AbC5znR.png' },
  { id: 1559, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://i.imgur.com/5XQ4f8S.png' },
  { id: 1560, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://i.imgur.com/IE6vI8B.png' },
  { id: 1561, name: 'COBERTURA PARA SORVETE CARAMELO MARVI 1 KILO', category: 'Doces/Frutas', price: 17.94, image: 'https://i.imgur.com/OzgpOol.png' },
  { id: 1562, name: 'COBERTURA PARA SORVETE CHOCOLATE MARVI 1,01 KILO', category: 'Doces/Frutas', price: 27.56, image: 'https://i.imgur.com/NjnFL97.png' },
  { id: 1563, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://i.imgur.com/4O5jl5e.png' },
  { id: 1564, name: 'COBERTURA PARA SORVETE MORANGO MARVI 1 KILO', category: 'Doces/Frutas', price: 20.01, image: 'https://i.imgur.com/vJiPTfU.png' },
  { id: 1565, name: 'COBERTURA PARA SORVETE PEQUENA CARAMELO MARVI 190 G', category: 'Doces/Frutas', price: 8.22, image: 'https://i.imgur.com/ua802zp.png' },
  { id: 1566, name: 'COBERTURA PARA SORVETE PEQUENA CHOCOLATE MARVI 190 G', category: 'Doces/Frutas', price: 6.64, image: 'https://i.imgur.com/8Z62FJU.png' },
  { id: 1567, name: 'COCO RALADO ADOÇADO INDIANO 1 KILO', category: 'Doces/Frutas', price: 34.5, image: 'https://i.imgur.com/NBDfTBk.png' },
  { id: 1568, name: 'COCO RALADO ÚMIDO E ADOÇADO MAIS COCO 1 KILO', category: 'Doces/Frutas', price: 49.24, image: 'https://i.imgur.com/0ph2OUj.png' },
  { id: 1569, name: 'COCO RALADO ÚMIDO E ADOÇADO SERGIPE 1 KILO', category: 'Doces/Frutas', price: 26.6, image: 'https://i.imgur.com/OLQuhba.png' },
  { id: 1570, name: 'CREME CONFEITEIRO ITAIQUARA 1 KILO', category: 'Doces/Frutas', price: 12.08, image: 'https://i.imgur.com/W8UsOSN.png' },
  { id: 1571, name: 'CREME DE AVELÃ GRANDE COM CACAU FOOD SERVICE NUTELLA 3 KILO', category: 'Doces/Frutas', price: 205.11, image: 'https://i.imgur.com/QFMFc2J.png' },
  { id: 1572, name: 'CREME DE AVELÃ GRANDE COM CACAU NUTBELLO', category: 'Doces/Frutas', price: 123.37, image: 'https://i.imgur.com/Tvvsa2G.png' },
  { id: 1573, name: 'CREME DE AVELÃ PEQUENO COM CACAU NUTBELLO 1,01 KILO', category: 'Doces/Frutas', price: 44.26, image: 'https://i.imgur.com/4zhDad6.png' },
  { id: 1574, name: 'CREME DE AVELÃ PEQUENO COM CACAU NUTELLA 650 G', category: 'Doces/Frutas', price: 44.34, image: 'https://i.imgur.com/OlqlQ17.png' },
  { id: 1575, name: 'CREME DE MORANGO \'MARROM\' RECHEIO ARTESANAL VABENE 1,01 KILO', category: 'Doces/Frutas', price: 34.51, image: 'https://i.imgur.com/zXh31Jr.png' },
  { id: 1576, name: 'CREME DE PISTACHE DOCEIRO 1,005 KILO', category: 'Doces/Frutas', price: 50.19, image: 'https://i.imgur.com/0FbZ9Rm.png' },
  { id: 1577, name: 'CREME DE PISTACHE PEQUENO VABENE 1,01 KILO', category: 'Doces/Frutas', price: 60.07, image: 'https://i.imgur.com/jlDCo4B.png' },
  { id: 1578, name: 'CREME FORNEÁVEL DE AMENDOIM DADINHO 1 KILO', category: 'Doces/Frutas', price: 46.77, image: 'https://i.imgur.com/faDszKn.png' },
  { id: 1579, name: 'DAMASCO LERYC 1 KILO', category: 'Doces/Frutas', price: 88.64, image: 'https://i.imgur.com/fnVJ8kI.png' },
  { id: 1580, name: 'DAMASCO TURCO BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 89.12, image: 'https://i.imgur.com/ScAL6wP.png' },
  { id: 1581, name: 'DOCE DE LEITE DOCEIRO 1,001 KILO', category: 'Doces/Frutas', price: 18.8, image: 'https://i.imgur.com/KykB5rW.png' },
  { id: 1582, name: 'FAROFA DE AMENDOIM CROCANTE VABENE 1,05 KILO', category: 'Doces/Frutas', price: 20.46, image: 'https://i.imgur.com/LqmVKPR.png' },
  { id: 1583, name: 'FIGO EM CALDA TOZZI 400 G', category: 'Doces/Frutas', price: 16.5, image: 'https://i.imgur.com/EZnE0bM.png' },
  { id: 1584, name: 'FRUTAS CRISTALIZADAS BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 20.45, image: 'https://i.imgur.com/Du4jGSp.png' },
  { id: 1585, name: 'GELATINA ABACAXI QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://i.imgur.com/NGY3gap.png' },
  { id: 1586, name: 'GELATINA CEREJA QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://i.imgur.com/JdpV044.png' },
  { id: 1587, name: 'GELATINA FRAMBOESA QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://i.imgur.com/LdXZIpW.png' },
  { id: 1588, name: 'GELATINA LIMÃO QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://i.imgur.com/aKkwLmp.png' },
  { id: 1589, name: 'GELATINA MORANGO QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://i.imgur.com/3AFQRSk.png' },
  { id: 1590, name: 'GELATINA PÊSSEGO QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://i.imgur.com/1jTlJiZ.png' },
  { id: 1591, name: 'GELATINA SEM SABOR QUALIMAX 510 G', category: 'Doces/Frutas', price: 70.89, image: 'https://i.imgur.com/WM6zoTh.png' },
  { id: 1592, name: 'GELATINA UVA QUALIMAX 1 KILO', category: 'Doces/Frutas', price: 26.17, image: 'https://i.imgur.com/yovDyCH.png' },
  { id: 1593, name: 'GELÉIA DE DAMASCO HOMEMADE 2 KILO', category: 'Doces/Frutas', price: 57.26, image: 'https://i.imgur.com/BmQiQ6A.png' },
  { id: 1594, name: 'GELÉIA DE FRUTAS VERMELHAS HOMEMADE 2 KILO', category: 'Doces/Frutas', price: 57.26, image: 'https://i.imgur.com/MVBH1Wu.png' },
  { id: 1595, name: 'GELÉIA DE MORANGO E ABACAXI SACHÊ HOMEMADE 15 G (CX 144 UN)', category: 'Doces/Frutas', price: 57.98, image: 'https://i.imgur.com/SjTYCYl.png' },
  { id: 1596, name: 'GELÉIA DE MORANGO E GOIABA SACHÊ BOM SABOR / DEGUST 15 G (CX 144 UN)', category: 'Doces/Frutas', price: 84.76, image: 'https://i.imgur.com/SEXzeoF.png' },
  { id: 1597, name: 'GELÉIA DE MORANGO E GOIABA SACHÊ HOMEMADE 15 G (CX 144 UN)', category: 'Doces/Frutas', price: 57.98, image: 'https://i.imgur.com/Sc3Y1Ts.png' },
  { id: 1598, name: 'GELÉIA DE MORANGO E GOIABA SACHÊ ISIS 10 G (CX 144 UN)', category: 'Doces/Frutas', price: 38.65, image: 'https://i.imgur.com/LLZjFWt.png' },
  { id: 1599, name: 'GELÉIA DE MORANGO E UVA SACHÊ BOM SABOR 15 G (CX 144 UN)', category: 'Doces/Frutas', price: 84.76, image: 'https://i.imgur.com/iwcQ1Hl.png' },
  { id: 1600, name: 'GELÉIA DE MORANGO HOMEMADE 2 KILO', category: 'Doces/Frutas', price: 57.26, image: 'https://i.imgur.com/ldhDfSm.png' },
  { id: 1601, name: 'GELÉIA DE PIMENTA AGRIDOCE PREDILECTA 320 G', category: 'Doces/Frutas', price: 23.79, image: 'https://i.imgur.com/n4Xprpn.png' },
  { id: 1602, name: 'GELÉIA DE PIMENTA AGRIDOCE VAL 230 G', category: 'Doces/Frutas', price: 11.84, image: 'https://i.imgur.com/gIGPiA4.png' },
  { id: 1603, name: 'GELÉIA DE PIMENTA GOURMET HOMEMADE 320 G', category: 'Doces/Frutas', price: 16.92, image: 'https://i.imgur.com/tY2ZcYM.png' },
  { id: 1604, name: 'GELÉIA DE PIMENTA HOMEMADE 2 KILO', category: 'Doces/Frutas', price: 47.96, image: 'https://i.imgur.com/snEksT3.png' },
  { id: 1605, name: 'GLICOSE YOKI 350 G', category: 'Doces/Frutas', price: 19.51, image: 'https://i.imgur.com/PgbK3vi.png' },
  { id: 1606, name: 'GOIABADA BISNAGA RALSTON 1,01 KILO', category: 'Doces/Frutas', price: 17.71, image: 'https://i.imgur.com/AFUbTv2.png' },
  { id: 1607, name: 'GOIABADA BISNAGA VAL 1,01 KILO', category: 'Doces/Frutas', price: 16.93, image: 'https://i.imgur.com/7CsDLDC.png' },
  { id: 1608, name: 'GOIABADA BISNAGA ZAINE 1,01 KILO', category: 'Doces/Frutas', price: 15.24, image: 'https://i.imgur.com/CQZWSDY.png' },
  { id: 1609, name: 'GOIABADA PEÇA RALSTON 400 G', category: 'Doces/Frutas', price: 9.58, image: 'https://i.imgur.com/PYAprgg.png' },
  { id: 1610, name: 'GOIABADA PEÇA VAL 400 G', category: 'Doces/Frutas', price: 7.41, image: 'https://i.imgur.com/W0CwXOm.png' },
  { id: 1611, name: 'GOIABADA PEÇA ZAINE 300 G', category: 'Doces/Frutas', price: 3.5, image: 'https://i.imgur.com/iiyqQif.png' },
  { id: 1612, name: 'GRANOLA TRADICIONAL BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 20.6, image: 'https://i.imgur.com/noRy3Ke.png' },
  { id: 1613, name: 'GRANOLA TRADICIONAL JP PEREIRA 1 KILO', category: 'Doces/Frutas', price: 22.87, image: 'https://i.imgur.com/Pj97ML8.png' },
  { id: 1614, name: 'LEITE DE COCO GRANDE MAIS COCO 1 L', category: 'Doces/Frutas', price: 32, image: 'https://i.imgur.com/BwvNsth.png' },
  { id: 1615, name: 'LEITE DE COCO PEQUENO MAIS COCO 200 ML (CX 24 UN)', category: 'Doces/Frutas', price: 86.32, image: 'https://i.imgur.com/edU7mgb.png' },
  { id: 1616, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://i.imgur.com/UMplOcH.png' },
  { id: 1617, name: 'MEL ISIS 1 KILO', category: 'Doces/Frutas', price: 53.55, image: 'https://i.imgur.com/f7Kdo1F.png' },
  { id: 1618, name: 'MEL JP PEREIRA 500 G', category: 'Doces/Frutas', price: 47.92, image: 'https://i.imgur.com/ZdoF5tD.png' },
  { id: 1619, name: 'MEL MINAMEL 1 KILO', category: 'Doces/Frutas', price: 51.79, image: 'https://i.imgur.com/GUHSnS1.png' },
  { id: 1620, name: 'MEL PEQUENO ISIS 260 G', category: 'Doces/Frutas', price: 19.33, image: 'https://i.imgur.com/k1mXsKY.png' },
  { id: 1621, name: 'MEL PEQUENO MINAMEL 900 G', category: 'Doces/Frutas', price: 15.83, image: 'https://i.imgur.com/EJLQZfi.png' },
  { id: 1622, name: 'MEL SACHÊ ISIS 15 G (CX 144 UN)', category: 'Doces/Frutas', price: 88.75, image: 'https://i.imgur.com/cPsGQHN.png' },
  { id: 1623, name: 'MELADO DE CANA MINAMEL 500 G', category: 'Doces/Frutas', price: 13.16, image: 'https://i.imgur.com/HLb05gU.png' },
  { id: 1624, name: 'NOZES MARIPOSA LERYC 1 KILO', category: 'Doces/Frutas', price: 67.29, image: 'https://i.imgur.com/99UaitU.png' },
  { id: 1625, name: 'NOZES MARIPOSA SEM CASCA BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 71.64, image: 'https://i.imgur.com/N9V2fNu.png' },
  { id: 1626, name: 'PAÇOQUINHA DE AMENDOIM QUADRADA DADINHO 20 G (CX 40 UN)', category: 'Doces/Frutas', price: 23.73, image: 'https://i.imgur.com/8SydZRb.png' },
  { id: 1627, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://i.imgur.com/UMU1nZd.png' },
  { id: 1628, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://i.imgur.com/PTKLtol.png' },
  { id: 1629, name: 'RECHEIO E COBERTURA \'VERMELHO\' SABOR MORANGO VABENE 1,01 KILO', category: 'Doces/Frutas', price: 21.7, image: 'https://i.imgur.com/RrQUfmX.png' },
  { id: 1630, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://i.imgur.com/El8b1t3.png' },
  { id: 1631, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://i.imgur.com/8MyJ0li.png' },
  { id: 1632, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://i.imgur.com/SGM2if3.png' },
  { id: 1633, name: 'RECHEIO E COBERTURA SABOR CHOCOLATE MOÇA NESTLÉ 2,54 KILO', category: 'Doces/Frutas', price: 123.2, image: 'https://i.imgur.com/Vqmfbaj.png' },
  { id: 1634, name: 'PRODUTO EM FALTA', category: 'Doces/Frutas', price: 0, image: 'https://i.imgur.com/fjBtzGC.png' },
  { id: 1635, name: 'RECHEIO E COBERTURA SABOR LEITINHO DOCEIRO 1,005 KILO', category: 'Doces/Frutas', price: 33.02, image: 'https://i.imgur.com/QGOp9GE.png' },
  { id: 1636, name: 'RECHEIO E COBERTURA SABOR LEITINHO MELKEN 1,010 KILO', category: 'Doces/Frutas', price: 38.62, image: 'https://i.imgur.com/LXbdCpy.png' },
  { id: 1637, name: 'RECHEIO E COBERTURA SABOR LEITINHO VABENE 1,01 KILO', category: 'Doces/Frutas', price: 39.88, image: 'https://i.imgur.com/QPWcfeP.png' },
  { id: 1638, name: 'RECHEIO E COBERTURA SABOR MORANGO DOCEIRO 1,005 KILO', category: 'Doces/Frutas', price: 24.84, image: 'https://i.imgur.com/6I7GSSR.png' },
  { id: 1639, name: 'RECHEIO E COBERTURA SABOR OVOMALTINE 2,1 KILO', category: 'Doces/Frutas', price: 142.29, image: 'https://i.imgur.com/97tpwK9.png' },
  { id: 1640, name: 'RECHEIO E COBERTURA SABOR OVOMALTINE 900 G', category: 'Doces/Frutas', price: 60.98, image: 'https://i.imgur.com/bP5iXZM.png' },
  { id: 1641, name: 'UVA PASSA BRANCA LERYC 1 KILO', category: 'Doces/Frutas', price: 33.94, image: 'https://i.imgur.com/wtfOIbU.png' },
  { id: 1642, name: 'UVA PASSA BRANCA SEM SEMENTE BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 43.46, image: 'https://i.imgur.com/vCXGt0P.png' },
  { id: 1643, name: 'UVA PASSA PRETA LERYC 1 KILO', category: 'Doces/Frutas', price: 24.93, image: 'https://i.imgur.com/x1fJq7v.png' },
  { id: 1644, name: 'UVA PASSA PRETA SEM SEMENTE BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 24.93, image: 'https://i.imgur.com/gfYCnox.png' },
  { id: 1645, name: 'XERÉM DE CAJU BRASILSECO 1 KILO', category: 'Doces/Frutas', price: 43.46, image: 'https://i.imgur.com/dnPXNRp.png' },
  { id: 1646, name: 'XERÉM DE CAJU LERYC 1 KILO', category: 'Doces/Frutas', price: 35.43, image: 'https://i.imgur.com/J1GFVms.png' },
  { id: 1647, name: 'AJINOMOTO FOOD SERVICE 10 KILO', category: 'Farináceos', price: 269.47, image: 'https://i.imgur.com/RdM3xxH.png' },
  { id: 1648, name: 'AJINOMOTO PEQUENO 2 KILO', category: 'Farináceos', price: 77.01, image: 'https://i.imgur.com/k96W3sC.png' },
  { id: 1649, name: 'ALHO EM PÓ BRASILSECO 1 KILO', category: 'Farináceos', price: 26.92, image: 'https://i.imgur.com/9yfyWKS.png' },
  { id: 1650, name: 'AMACIANTE DE CARNE TECNUTRI 1,01 KILO', category: 'Farináceos', price: 8.83, image: 'https://i.imgur.com/JyCjLSg.png' },
  { id: 1651, name: 'AMACIANTE DE CARNES COM TEMPERO KISABOR 1,01 KILO', category: 'Farináceos', price: 9.74, image: 'https://i.imgur.com/PPwQwUi.png' },
  { id: 1652, name: 'AMACIANTE DE CARNES COM TEMPERO QUALIMAX 1,01 KILO', category: 'Farináceos', price: 22.36, image: 'https://i.imgur.com/yNWhZrr.png' },
  { id: 1653, name: 'AMIDO DE MILHO MAIZENA 1,8 KILO', category: 'Farináceos', price: 48.25, image: 'https://i.imgur.com/16nBzgX.png' },
  { id: 1654, name: 'AMIDO DE MILHO PQ 1 KILO', category: 'Farináceos', price: 6.83, image: 'https://i.imgur.com/P44J2LY.png' },
  { id: 1655, name: 'AMIDO DE MILHO TECNUTRI 1 KILO', category: 'Farináceos', price: 7.76, image: 'https://i.imgur.com/5gtkIy1.png' },
  { id: 1656, name: 'AMIDO DE MILHO YOKI 1 KILO', category: 'Farináceos', price: 17.65, image: 'https://i.imgur.com/zgAZBH7.png' },
  { id: 1657, name: 'AVEIA EM FLOCOS QUALIMAX 170 G', category: 'Farináceos', price: 3.37, image: 'https://i.imgur.com/dtsj1vr.png' },
  { id: 1658, name: 'AVEIA EM FLOCOS YOKI 500 G', category: 'Farináceos', price: 10.58, image: 'https://i.imgur.com/wAAULHS.png' },
  { id: 1659, name: 'BICARBONATO DE SÓDIO BRASILSECO 1 KILO', category: 'Farináceos', price: 16.46, image: 'https://i.imgur.com/0Hvc4kk.png' },
  { id: 1660, name: 'BICARBONATO DE SÓDIO DA TERRINHA 500 G', category: 'Farináceos', price: 8.44, image: 'https://i.imgur.com/ofvGq1h.png' },
  { id: 1661, name: 'BICARBONATO DE SÓDIO PENINA 1 KILO', category: 'Farináceos', price: 14.1, image: 'https://i.imgur.com/FUmqr13.png' },
  { id: 1662, name: 'CALDO DE BACON PENINA 1,05 KILO', category: 'Farináceos', price: 13.75, image: 'https://i.imgur.com/ZAU1Yb6.png' },
  { id: 1663, name: 'CALDO DE CARNE KISABOR 1,01 KILO', category: 'Farináceos', price: 10.03, image: 'https://i.imgur.com/P29cxa4.png' },
  { id: 1664, name: 'CALDO DE CARNE KNORR 1,01 KILO', category: 'Farináceos', price: 20.75, image: 'https://i.imgur.com/9z5S1Hb.png' },
  { id: 1665, name: 'CALDO DE CARNE PENINA 1,05 KILO', category: 'Farináceos', price: 17.12, image: 'https://i.imgur.com/txGfuce.png' },
  { id: 1666, name: 'CALDO DE CARNE QUALIMAX 1,01 KILO', category: 'Farináceos', price: 10.21, image: 'https://i.imgur.com/mIqsqCX.png' },
  { id: 1667, name: 'CALDO DE CARNE SAZÓN AJINOMOTO 1,1 KILO', category: 'Farináceos', price: 20.07, image: 'https://i.imgur.com/imPVVBR.png' },
  { id: 1668, name: 'CALDO DE CARNE TECNUTRI 1,01 KILO', category: 'Farináceos', price: 9.27, image: 'https://i.imgur.com/rkP3G6F.png' },
  { id: 1669, name: 'CALDO DE GALINHA KISABOR 1,01 KILO', category: 'Farináceos', price: 10.03, image: 'https://i.imgur.com/9IALNti.png' },
  { id: 1670, name: 'CALDO DE GALINHA KNORR 1,01 KILO', category: 'Farináceos', price: 20.75, image: 'https://i.imgur.com/us1seji.png' },
  { id: 1671, name: 'CALDO DE GALINHA MAGGI 1,01 KILO', category: 'Farináceos', price: 17.54, image: 'https://i.imgur.com/Hsie52N.png' },
  { id: 1672, name: 'CALDO DE GALINHA PENINA 1,05 KILO', category: 'Farináceos', price: 9.19, image: 'https://i.imgur.com/RLdjd1H.png' },
  { id: 1673, name: 'CALDO DE GALINHA QUALIMAX 1,01 KILO', category: 'Farináceos', price: 17.79, image: 'https://i.imgur.com/ymVP6oe.png' },
  { id: 1674, name: 'CALDO DE GALINHA SAZÓN AJINOMOTO 1,1 KILO', category: 'Farináceos', price: 20.07, image: 'https://i.imgur.com/ZP9420B.png' },
  { id: 1675, name: 'CALDO DE GALINHA TECNUTRI 1,01 KILO', category: 'Farináceos', price: 9.27, image: 'https://i.imgur.com/bnAPKv8.png' },
  { id: 1676, name: 'CALDO DE LEGUMES QUALIMAX 1,01 KILO', category: 'Farináceos', price: 17.79, image: 'https://i.imgur.com/08uUsKZ.png' },
  { id: 1677, name: 'CALDO DE LEGUMES SAZÓN AJINOMOTO 1,1 KILO', category: 'Farináceos', price: 20.07, image: 'https://i.imgur.com/cyq5pKh.png' },
  { id: 1678, name: 'CALDO DELICIAS DO MAR KNORR 1,01 KILO', category: 'Farináceos', price: 20.75, image: 'https://i.imgur.com/REGQMBr.png' },
  { id: 1679, name: 'CALDO PARA FRUTOS DO MAR SAZÓN AJINOMOTO 1,1 KILO', category: 'Farináceos', price: 22.48, image: 'https://i.imgur.com/31XT09z.png' },
  { id: 1680, name: 'CANELA EM PÓ COM AÇÚCAR PENINA 500 G', category: 'Farináceos', price: 20.47, image: 'https://i.imgur.com/bv9If5b.png' },
  { id: 1681, name: 'CANELA EM PÓ JAVA PENINA 500 G', category: 'Farináceos', price: 29.35, image: 'https://i.imgur.com/NCAVeL6.png' },
  { id: 1682, name: 'CANJICA DE MILHO CRISTAL DA TERRINHA 500 G', category: 'Farináceos', price: 4.58, image: 'https://i.imgur.com/X1cfj75.png' },
  { id: 1683, name: 'CANJICA DE MILHO CRISTAL YOKI 400 G', category: 'Farináceos', price: 8.72, image: 'https://i.imgur.com/OreEHLd.png' },
  { id: 1684, name: 'CEBOLA EM PÓ BRASILSECO 1KILO', category: 'Farináceos', price: 40.08, image: 'https://i.imgur.com/211RzZo.png' },
  { id: 1685, name: 'CHIMICHURRI BRASILSECO 1 KILO', category: 'Farináceos', price: 38.65, image: 'https://i.imgur.com/z3NnCbf.png' },
  { id: 1686, name: 'CHIMICHURRI OISHII 200 G', category: 'Farináceos', price: 11.31, image: 'https://i.imgur.com/Z4bf7nJ.png' },
  { id: 1687, name: 'CHIMICHURRI PENINA 200 G', category: 'Farináceos', price: 17.07, image: 'https://i.imgur.com/qK9qSHc.png' },
  { id: 1688, name: 'CHIMICHURRI ZAZO 1 KILO', category: 'Farináceos', price: 38.64, image: 'https://i.imgur.com/sgXT7a5.png' },
  { id: 1689, name: 'COLORÍFICO BRASILSECO 1 KILO', category: 'Farináceos', price: 12.31, image: 'https://i.imgur.com/kCP04Jw.png' },
  { id: 1690, name: 'COLORÍFICO KISABOR 1,01 KILO', category: 'Farináceos', price: 9.44, image: 'https://i.imgur.com/MmHg0y0.png' },
  { id: 1691, name: 'COLORÍFICO KITANO 800 G', category: 'Farináceos', price: 14.11, image: 'https://i.imgur.com/iF6MX0z.png' },
  { id: 1692, name: 'COLORÍFICO PENINA 1 KILO', category: 'Farináceos', price: 28.78, image: 'https://i.imgur.com/q66fjJH.png' },
  { id: 1693, name: 'COMINHO PENINA 1,05 KILO', category: 'Farináceos', price: 26.56, image: 'https://i.imgur.com/NxP9L5k.png' },
  { id: 1694, name: 'COUSCOUS GRANORO 1 KILO', category: 'Farináceos', price: 42.56, image: 'https://i.imgur.com/IA2KIPz.png' },
  { id: 1695, name: 'PRODUTO EM FALTA', category: 'Farináceos', price: 0, image: 'https://i.imgur.com/iuG6SD4.png' },
  { id: 1696, name: 'CREME DE CEBOLA FOOD SERVICE AJINOMOTO 1 KILO', category: 'Farináceos', price: 41.36, image: 'https://i.imgur.com/ppZnwm9.png' },
  { id: 1697, name: 'CREME DE CEBOLA PENINA 1 KILO', category: 'Farináceos', price: 23.62, image: 'https://i.imgur.com/V0AjqkJ.png' },
  { id: 1698, name: 'CREME DE CEBOLA QUALIMAX 1,01 KILO', category: 'Farináceos', price: 41.17, image: 'https://i.imgur.com/FBPucTF.png' },
  { id: 1699, name: 'CÚRCUMA AÇAFRÃO BRASILSECO 1 KILO', category: 'Farináceos', price: 23.62, image: 'https://i.imgur.com/WfFS3z4.png' },
  { id: 1700, name: 'FARINHA DE MANDIOCA CRUA FINA DA TERRINHA 1 KILO', category: 'Farináceos', price: 8.56, image: 'https://i.imgur.com/9edoptp.png' },
  { id: 1701, name: 'FARINHA DE MANDIOCA CRUA FINA YOKI 4 KILO', category: 'Farináceos', price: 32.23, image: 'https://i.imgur.com/krIV3f0.png' },
  { id: 1702, name: 'FARINHA DE MANDIOCA CRUA GROSSA DA TERRINHA 1 KILO', category: 'Farináceos', price: 8.14, image: 'https://i.imgur.com/Xxhrm8Y.png' },
  { id: 1703, name: 'FARINHA DE MANDIOCA CRUA GROSSA PQ 3 KILO', category: 'Farináceos', price: 29.26, image: 'https://i.imgur.com/8eG3lls.png' },
  { id: 1704, name: 'FARINHA DE MANDIOCA CRUA GROSSA YOKI 1 KILO', category: 'Farináceos', price: 15.55, image: 'https://i.imgur.com/lEU9KIe.png' },
  { id: 1705, name: 'FARINHA DE MANDIOCA FLOCADA BIJU YOKI 500 G', category: 'Farináceos', price: 13.37, image: 'https://i.imgur.com/TnJON1D.png' },
  { id: 1706, name: 'FARINHA DE MANDIOCA TORRADA DA TERRINHA 500 G', category: 'Farináceos', price: 5.04, image: 'https://i.imgur.com/CEjlvsS.png' },
  { id: 1707, name: 'FARINHA DE MANDIOCA TORRADA YOKI 4 KILO', category: 'Farináceos', price: 50.32, image: 'https://i.imgur.com/m6xRRcY.png' },
  { id: 1708, name: 'FARINHA DE MILHO DA TERRINHA 500 G', category: 'Farináceos', price: 6.83, image: 'https://i.imgur.com/zJEr57B.png' },
  { id: 1709, name: 'FARINHA DE MILHO PQ 2 KILO', category: 'Farináceos', price: 16.97, image: 'https://i.imgur.com/xChMEQe.png' },
  { id: 1710, name: 'FARINHA DE MILHO YOKI 2 KILO', category: 'Farináceos', price: 26.47, image: 'https://i.imgur.com/v5Qz9dA.png' },
  { id: 1711, name: 'FARINHA DE ROSCA DA TERRINHA 500 G', category: 'Farináceos', price: 6.83, image: 'https://i.imgur.com/kdBMZCd.png' },
  { id: 1712, name: 'FARINHA DE ROSCA PQ 5 KILO', category: 'Farináceos', price: 50.38, image: 'https://i.imgur.com/YaSOAoN.png' },
  { id: 1713, name: 'FARINHA DE ROSCA YOKI 4 KILO', category: 'Farináceos', price: 62.74, image: 'https://i.imgur.com/G6FCKr3.png' },
  { id: 1714, name: 'FARINHA DE TRIGO ESPECIAL 101 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 88.74, image: 'https://i.imgur.com/AWbfVZ3.png' },
  { id: 1715, name: 'FARINHA DE TRIGO FLOCADA PANKO KARUI 1 KILO', category: 'Farináceos', price: 11.34, image: 'https://i.imgur.com/0xDZ0dm.png' },
  { id: 1716, name: 'FARINHA DE TRIGO FLOCADA PANKO ORQUIDEA 1 KILO', category: 'Farináceos', price: 12.23, image: 'https://i.imgur.com/zelDMdc.png' },
  { id: 1717, name: 'FARINHA DE TRIGO FLOCADA PANKO QUALIMAX 1 KILO', category: 'Farináceos', price: 31.06, image: 'https://i.imgur.com/iOzBrMa.png' },
  { id: 1718, name: 'FARINHA DE TRIGO FLOCADA PANKO ZAFRÁN 1,01 KILO', category: 'Farináceos', price: 25.63, image: 'https://i.imgur.com/ad85uCi.png' },
  { id: 1719, name: 'FARINHA DE TRIGO LONGA FERMENTAÇÃO PIZZA ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 118.24, image: 'https://i.imgur.com/UHKyBBg.png' },
  { id: 1720, name: 'FARINHA DE TRIGO LONGA FERMENTAÇÃO PIZZA SUPREMA BUNGE 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 103.76, image: 'https://i.imgur.com/Ho7JhAt.png' },
  { id: 1721, name: 'FARINHA DE TRIGO PASTEL 101 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 109.53, image: 'https://i.imgur.com/JO9NiDL.png' },
  { id: 1722, name: 'FARINHA DE TRIGO PASTEL ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 102.56, image: 'https://i.imgur.com/zLku58X.png' },
  { id: 1723, name: 'FARINHA DE TRIGO PASTEL BUQUÊ 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 109.54, image: 'https://i.imgur.com/UAKK7p8.png' },
  { id: 1724, name: 'FARINHA DE TRIGO PASTEL COAMO 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 91.99, image: 'https://i.imgur.com/YlQpzQj.png' },
  { id: 1725, name: 'FARINHA DE TRIGO PASTEL DONA BENTA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 115.08, image: 'https://i.imgur.com/QKn1Qcq.png' },
  { id: 1726, name: 'FARINHA DE TRIGO PASTEL MARIA INÊS 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 90.49, image: 'https://i.imgur.com/lgcU0Lk.png' },
  { id: 1727, name: 'FARINHA DE TRIGO PASTEL MIRELLA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 97.73, image: 'https://i.imgur.com/cv68hs9.png' },
  { id: 1728, name: 'FARINHA DE TRIGO PASTEL NITA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 105.82, image: 'https://i.imgur.com/wH452nX.png' },
  { id: 1729, name: 'FARINHA DE TRIGO PASTEL ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 127.65, image: 'https://i.imgur.com/NzUTWko.png' },
  { id: 1730, name: 'FARINHA DE TRIGO PASTEL SUPREMA BUNGE 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 112.49, image: 'https://i.imgur.com/gXxWyjC.png' },
  { id: 1731, name: 'FARINHA DE TRIGO PASTEL VENTURELLI 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 118.02, image: 'https://i.imgur.com/cwsUHcA.png' },
  { id: 1732, name: 'FARINHA DE TRIGO PEQUENA ALMA ITALIANA VENTURELLI 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 89.28, image: 'https://i.imgur.com/AuznfCi.png' },
  { id: 1733, name: 'FARINHA DE TRIGO PEQUENA INTEGRAL ANACONDA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 66.96, image: 'https://i.imgur.com/MKJgzle.png' },
  { id: 1734, name: 'FARINHA DE TRIGO PEQUENA INTEGRAL COAMO 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 34.03, image: 'https://i.imgur.com/bqvx9NA.png' },
  { id: 1735, name: 'FARINHA DE TRIGO PEQUENA PREMIUM ANACONDA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 54.29, image: 'https://i.imgur.com/ywH3bp4.png' },
  { id: 1736, name: 'FARINHA DE TRIGO PEQUENA RESERVA ESPECIAL DONA BENTA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 61.34, image: 'https://i.imgur.com/JTIFOkm.png' },
  { id: 1737, name: 'FARINHA DE TRIGO PEQUENA SEMOLINA TIPO 1 VENTURELLI 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 87.47, image: 'https://i.imgur.com/xx8b6Uu.png' },
  { id: 1738, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 ANACONDA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 46.54, image: 'https://i.imgur.com/NaPCzGk.png' },
  { id: 1739, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 BUQUÊ 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 31.37, image: 'https://i.imgur.com/77yKSfk.png' },
  { id: 1740, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 DONA BENTA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 52.36, image: 'https://i.imgur.com/krQ3dMJ.png' },
  { id: 1741, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 GLOBO 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 33.58, image: 'https://i.imgur.com/cWAgrgi.png' },
  { id: 1742, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 NITA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 44.11, image: 'https://i.imgur.com/mrMEakl.png' },
  { id: 1743, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 ROSA BRANCA 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 57.19, image: 'https://i.imgur.com/PmbsA58.png' },
  { id: 1744, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 SOL 1 KILO (FDO 10 KILO)', category: 'Farináceos', price: 44.58, image: 'https://i.imgur.com/VbqZDY7.png' },
  { id: 1745, name: 'FARINHA DE TRIGO PIZZA 101 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 85.46, image: 'https://i.imgur.com/yFuEelf.png' },
  { id: 1746, name: 'FARINHA DE TRIGO PIZZA ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 84.45, image: 'https://i.imgur.com/N4tixJQ.png' },
  { id: 1747, name: 'FARINHA DE TRIGO PIZZA BUQUÊ 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 79.82, image: 'https://i.imgur.com/PZXzN5V.png' },
  { id: 1748, name: 'FARINHA DE TRIGO PIZZA DONA BENTA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 113.17, image: 'https://i.imgur.com/EzU15Ia.png' },
  { id: 1749, name: 'FARINHA DE TRIGO PIZZA MARIA INÊS 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 72.39, image: 'https://i.imgur.com/dNkG0KT.png' },
  { id: 1750, name: 'FARINHA DE TRIGO PIZZA MIRELLA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 79.63, image: 'https://i.imgur.com/eAhQSzQ.png' },
  { id: 1751, name: 'FARINHA DE TRIGO PIZZA NITA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 78.43, image: 'https://i.imgur.com/IGFGz0O.png' },
  { id: 1752, name: 'FARINHA DE TRIGO PIZZA ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 102.33, image: 'https://i.imgur.com/a8jOHCh.png' },
  { id: 1753, name: 'FARINHA DE TRIGO PIZZA SUPREMA BUNGE 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 85.67, image: 'https://i.imgur.com/i78vKiK.png' },
  { id: 1754, name: 'FARINHA DE TRIGO PIZZA VENTURELLI 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 94.64, image: 'https://i.imgur.com/eoPwdNt.png' },
  { id: 1755, name: 'FARINHA DE TRIGO PREMIUM 101 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 107.38, image: 'https://i.imgur.com/PgOFKAv.png' },
  { id: 1756, name: 'FARINHA DE TRIGO PREMIUM ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 127.89, image: 'https://i.imgur.com/fe6V8D2.png' },
  { id: 1757, name: 'FARINHA DE TRIGO PREMIUM ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 119.93, image: 'https://i.imgur.com/cv2F5fc.png' },
  { id: 1758, name: 'FARINHA DE TRIGO SALGADOS ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 104.3, image: 'https://i.imgur.com/ZjUgCYa.png' },
  { id: 1759, name: 'FARINHA DE TRIGO SUPER PREMIUM COAMO 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 117.64, image: 'https://i.imgur.com/qNvuueW.png' },
  { id: 1760, name: 'FARINHA DE TRIGO TIPO 1 ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 115.68, image: 'https://i.imgur.com/i0IoAkI.png' },
  { id: 1761, name: 'FARINHA DE TRIGO TIPO 1 BUQUÊ 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 79.82, image: 'https://i.imgur.com/AmVEXfj.png' },
  { id: 1762, name: 'FARINHA DE TRIGO TIPO 1 DONA BENTA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 108.63, image: 'https://i.imgur.com/r1ssWwO.png' },
  { id: 1763, name: 'FARINHA DE TRIGO TIPO 1 FARINA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 77.22, image: 'https://i.imgur.com/cp3JWHX.png' },
  { id: 1764, name: 'FARINHA DE TRIGO TIPO 1 GLOBO 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 81.42, image: 'https://i.imgur.com/pWzNBoe.png' },
  { id: 1765, name: 'FARINHA DE TRIGO TIPO 1 NITA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 98.43, image: 'https://i.imgur.com/Ep3gbqV.png' },
  { id: 1766, name: 'FARINHA DE TRIGO TIPO 1 ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 115.5, image: 'https://i.imgur.com/zZ1GJAz.png' },
  { id: 1767, name: 'FARINHA DE TRIGO TIPO 1 SOL 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 103.5, image: 'https://i.imgur.com/CW0JPEA.png' },
  { id: 1768, name: 'FARINHA DE TRIGO TIPO 1 VENTURELLI 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 129.15, image: 'https://i.imgur.com/fAEpy9b.png' },
  { id: 1769, name: 'FAROFA DE MANDIOCA TEMPERADA DA TERRINHA 400 G', category: 'Farináceos', price: 5.94, image: 'https://i.imgur.com/3CvJk39.png' },
  { id: 1770, name: 'FAROFA DE MANDIOCA TEMPERADA KISABOR 400 G', category: 'Farináceos', price: 4.79, image: 'https://i.imgur.com/QgojMbk.png' },
  { id: 1771, name: 'FAROFA DE MANDIOCA TEMPERADA TRADICIONAL YOKI 400 G', category: 'Farináceos', price: 7.38, image: 'https://i.imgur.com/wQ9lBxh.png' },
  { id: 1772, name: 'FERMENTO BIOLÓGICO FRESCO FLEISCHMANN 500 G', category: 'Farináceos', price: 11.49, image: 'https://i.imgur.com/aq6a1xT.png' },
  { id: 1773, name: 'FERMENTO BIOLÓGICO FRESCO ITAIQUARA 500 G', category: 'Farináceos', price: 6.94, image: 'https://i.imgur.com/gcinjsA.png' },
  { id: 1774, name: 'FERMENTO EM PÓ QUÍMICO TRADICIONAL DONA BENTA 100 G', category: 'Farináceos', price: 3.09, image: 'https://i.imgur.com/QQnUci6.png' },
  { id: 1775, name: 'FERMENTO EM PÓ QUÍMICO TRADICIONAL ROYAL 100 G', category: 'Farináceos', price: 3.94, image: 'https://i.imgur.com/x5W2c10.png' },
  { id: 1776, name: 'FERMENTO SECO BIOLÓGICO MASSA SALGADA FLEISCHMANN 500 G', category: 'Farináceos', price: 25.42, image: 'https://i.imgur.com/WtKkRgP.png' },
  { id: 1777, name: 'FERMENTO SECO BIOLÓGICO MASSA SALGADA ITAIQUARA 500 G', category: 'Farináceos', price: 15.34, image: 'https://i.imgur.com/5CScmge.png' },
  { id: 1778, name: 'FLOCOS DE MILHO CUSCUZ DA TERRINHA 500 G', category: 'Farináceos', price: 3.11, image: 'https://i.imgur.com/i7khVyb.png' },
  { id: 1779, name: 'FOLHA DE LOURO BRASILSECO 250 G', category: 'Farináceos', price: 19.32, image: 'https://i.imgur.com/ytbs8LG.png' },
  { id: 1780, name: 'FUBÁ MIMOSO DA TERRINHA 1 KILO', category: 'Farináceos', price: 5.65, image: 'https://i.imgur.com/I8TfyUT.png' },
  { id: 1781, name: 'FUBÁ MIMOSO PQ 5 KILO', category: 'Farináceos', price: 24.09, image: 'https://i.imgur.com/FB565Zw.png' },
  { id: 1782, name: 'FUBÁ MIMOSO YOKI 4 KILO', category: 'Farináceos', price: 25.92, image: 'https://i.imgur.com/Jli0yw1.png' },
  { id: 1783, name: 'FUBÁ PENINA 500 G', category: 'Farináceos', price: 4.26, image: 'https://i.imgur.com/aK0wnNe.png' },
  { id: 1784, name: 'FUMAÇA EM PÓ BRASILSECO 500 G', category: 'Farináceos', price: 21.7, image: 'https://i.imgur.com/lAK8SGt.png' },
  { id: 1785, name: 'KIMILHO FLOCÃO YOKI 500 G', category: 'Farináceos', price: 5.87, image: 'https://i.imgur.com/Vp4RfKQ.png' },
  { id: 1786, name: 'MACARRÃO AVE MARIA COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Farináceos', price: 71.79, image: 'https://i.imgur.com/bqppfLW.png' },
  { id: 1787, name: 'MACARRÃO CARACOLINO COM OVOS RENATA 500 G (FDO 20 PCT)', category: 'Farináceos', price: 92.9, image: 'https://i.imgur.com/piZmrp6.png' },
  { id: 1788, name: 'MACARRÃO ESPAGUETE GRANO DURO PETYBON 500 G (FDO 24 PCT)', category: 'Farináceos', price: 143.30, image: 'https://i.imgur.com/IwCnxUG.png' },
  { id: 1789, name: 'MACARRÃO ESPAGUETE Nº 8 COM OVOS BARILLA 500 G (FDO 30 PCT)', category: 'Farináceos', price: 155.29, image: 'https://i.imgur.com/ZaWSRnD.png' },
  { id: 1790, name: 'MACARRÃO ESPAGUETE Nº 8 COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Farináceos', price: 77.83, image: 'https://i.imgur.com/NslZsoB.png' },
  { id: 1791, name: 'MACARRÃO ESPAGUETE Nº 8 COM OVOS PETYBON 500 G (FDO 24 PCT)', category: 'Farináceos', price: 85.44, image: 'https://i.imgur.com/7MeNW3c.png' },
  { id: 1792, name: 'MACARRÃO FETTUCCINE GRANO DURO PETYBON 500 G (FDO 24 PCT)', category: 'Farináceos', price: 9.73, image: 'https://i.imgur.com/BFJM886.png' },
  { id: 1793, name: 'MACARRÃO FUSILLI GRANO DURO PETYBON 500 G (FDO 18 PCT)', category: 'Farináceos', price: 107.46, image: 'https://i.imgur.com/FqDWrGa.png' },
  { id: 1794, name: 'MACARRÃO PARA YAKISSOBA TAICHI 4.5 KILO', category: 'Farináceos', price: 50.55, image: 'https://i.imgur.com/Ja2B4kK.png' },
  { id: 1795, name: 'MACARRÃO PARAFUSO COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Farináceos', price: 75.29, image: 'https://i.imgur.com/ufJUM57.png' },
  { id: 1796, name: 'MACARRÃO PARAFUSO COM OVOS PETYBON 500 G (FDO 18 PCT)', category: 'Farináceos', price: 64.19, image: 'https://i.imgur.com/McWqWHE.png' },
  { id: 1797, name: 'MACARRÃO PENNE COM OVOS BARILLA 500 G (FDO 20 PCT)', category: 'Farináceos', price: 103.52, image: 'https://i.imgur.com/IaFM5OL.png' },
  { id: 1798, name: 'MACARRÃO PENNE COM OVOS DONA BENTA 500 G (FDO 24 PCT)', category: 'Farináceos', price: 77.83, image: 'https://i.imgur.com/mZr2Nxu.png' },
  { id: 1799, name: 'MACARRÃO PENNE COM OVOS PETYBON 500 G (FDO 18 PCT)', category: 'Farináceos', price: 62.12, image: 'https://i.imgur.com/jGcAeJQ.png' },
  { id: 1800, name: 'MACARRÃO PENNE GRANO DURO PETYBON 500 G (FDO 18 PCT)', category: 'Farináceos', price: 107.46, image: 'https://i.imgur.com/EdDjAiD.png' },
  { id: 1801, name: 'MACARRÃO TALHARIM N° 3 COM OVOS RENATA 500 G (CX 20 PCT)', category: 'Farináceos', price: 143.57, image: 'https://i.imgur.com/LKWYbHo.png' },
  { id: 1802, name: 'MASSA PARA LASANHA COM OVOS PETYBON 500 G', category: 'Farináceos', price: 151.55, image: 'https://i.imgur.com/jce2MFJ.png' },
  { id: 1803, name: 'MASSA PARA LASANHA COM OVOS RENATA 500 G', category: 'Farináceos', price: 141.17, image: 'https://i.imgur.com/gyckoXW.png' },
  { id: 1804, name: 'MASSA PARA PASTEL E LASANHA QUADRADA CORTADA BRASILEIRINHA 50 UN', category: 'Farináceos', price: 33.8, image: 'https://i.imgur.com/IDpb49t.png' },
  { id: 1805, name: 'MASSA PARA PASTEL E LASANHA ROLO BRASILEIRINHA 1 KILO', category: 'Farináceos', price: 39.52, image: 'https://i.imgur.com/xxD0Nqw.png' },
  { id: 1806, name: 'MASSA PARA PASTEL ROLO MASSA MÁGICA 1 KILO', category: 'Farináceos', price: 9.39, image: 'https://i.imgur.com/fpR2x4o.png' },
  { id: 1807, name: 'NOZ MOSCADA BOLA BRASILSECO 250 G', category: 'Farináceos', price: 50.57, image: 'https://i.imgur.com/ady0My4.png' },
  { id: 1808, name: 'NOZ MOSCADA EM PÓ BRASILSECO 250 G', category: 'Farináceos', price: 25.77, image: 'https://i.imgur.com/OUwWZKU.png' },
  { id: 1809, name: 'PÃO DE ALHO CONGELADO BRASA BURGUERS 400 G', category: 'Farináceos', price: 10.66, image: 'https://i.imgur.com/xp24hvx.png' },
  { id: 1810, name: 'PÃO DE QUEIJO CONGELADO BRASA BURGUERS 70 G 1 KILO', category: 'Farináceos', price: 18.63, image: 'https://i.imgur.com/U0E2if6.png' },
  { id: 1811, name: 'PÃO DE QUEIJO CONGELADO NOBRE 15 G 900 G', category: 'Farináceos', price: 13.99, image: 'https://i.imgur.com/ZdE0QnP.png' },
  { id: 1812, name: 'PÃO DE QUEIJO PEQUENO CONGELADO BRASA BURGUERS 15 G 1 KILO', category: 'Farináceos', price: 16.15, image: 'https://i.imgur.com/W1whkkj.png' },
  { id: 1813, name: 'PÁPRICA DEFUMADA BRASILSECO 1 KILO', category: 'Farináceos', price: 23.62, image: 'https://i.imgur.com/CPJi7kd.png' },
  { id: 1814, name: 'PÁPRICA DEFUMADA PENINA 500 G', category: 'Farináceos', price: 25.62, image: 'https://i.imgur.com/M2I0vlY.png' },
  { id: 1815, name: 'PÁPRICA DOCE PENINA 500 G', category: 'Farináceos', price: 24.9, image: 'https://i.imgur.com/tma2RFV.png' },
  { id: 1816, name: 'PÁPRICA PICANTE PENINA 500 G', category: 'Farináceos', price: 24.9, image: 'https://i.imgur.com/MsAOoBN.png' },
  { id: 1817, name: 'PIMENTA CALABRESA BRASILSECO 500 G', category: 'Farináceos', price: 22.27, image: 'https://i.imgur.com/E9AA415.png' },
  { id: 1818, name: 'PIMENTA CALABRESA FLOCOS PENINA 500 G', category: 'Farináceos', price: 27.26, image: 'https://i.imgur.com/EwGxWPB.png' },
  { id: 1819, name: 'PIMENTA DO REINO EM GRÃOS BRASILSECO 500 G', category: 'Farináceos', price: 50.1, image: 'https://i.imgur.com/0cVSnct.png' },
  { id: 1820, name: 'PIMENTA DO REINO EM PÓ BRASILSECO 1 KILO', category: 'Farináceos', price: 26.63, image: 'https://i.imgur.com/WsnS7EZ.png' },
  { id: 1821, name: 'POLVILHO AZEDO DA TERRINHA 500 G', category: 'Farináceos', price: 8.97, image: 'https://i.imgur.com/p3CHJJI.png' },
  { id: 1822, name: 'POLVILHO AZEDO PQ 500 G', category: 'Farináceos', price: 7.58, image: 'https://i.imgur.com/MdDvSr5.png' },
  { id: 1823, name: 'POLVILHO DOCE DA TERRINHA 500 G', category: 'Farináceos', price: 5.8, image: 'https://i.imgur.com/05E0XSh.png' },
  { id: 1824, name: 'POLVILHO DOCE PQ 500 G', category: 'Farináceos', price: 6, image: 'https://i.imgur.com/wagSLVB.png' },
  { id: 1825, name: 'REALÇADOR DE SABOR AJINOMOTO AJI-SAL 2 KILO', category: 'Farináceos', price: 24.37, image: 'https://i.imgur.com/YylG32D.png' },
  { id: 1826, name: 'SAGU DE MANDIOCA PQ 500 G', category: 'Farináceos', price: 8.01, image: 'https://i.imgur.com/CkpRQoH.png' },
  { id: 1827, name: 'SAL GROSSO CISNE 1 KILO', category: 'Farináceos', price: 36.08, image: 'https://i.imgur.com/7eIhMXN.png' },
  { id: 1828, name: 'SAL GROSSO MASTER 1 KILO', category: 'Farináceos', price: 13.99, image: 'https://i.imgur.com/08M4fGR.png' },
  { id: 1829, name: 'SAL REFINADO CISNE 1 KILO', category: 'Farináceos', price: 35.14, image: 'https://i.imgur.com/4pepAbu.png' },
  { id: 1830, name: 'SAL REFINADO LEBRE 1 KILO', category: 'Farináceos', price: 23.62, image: 'https://i.imgur.com/URREBT0.png' },
  { id: 1831, name: 'SAL REFINADO MASTER 1 KILO', category: 'Farináceos', price: 13.99, image: 'https://i.imgur.com/gtuQfZ9.png' },
  { id: 1832, name: 'PRODUTO EM FALTA', category: 'Farináceos', price: 0, image: 'https://i.imgur.com/erblxeW.png' },
  { id: 1833, name: 'SAL SACHÊ LEBRE 0,8 G', category: 'Farináceos', price: 14.32, image: 'https://i.imgur.com/22qbUH2.png' },
  { id: 1834, name: 'SAL SACHÊ LEBRE BOM SABOR 0,8 G', category: 'Farináceos', price: 27.31, image: 'https://i.imgur.com/Dsm74RL.png' },
  { id: 1835, name: 'SALSA DESIDRATADA BRASILSECO 250 G', category: 'Farináceos', price: 9.98, image: 'https://i.imgur.com/ndeYJ5A.png' },
  { id: 1836, name: 'TAPIOCA DA TERRINHA 500 G', category: 'Farináceos', price: 6.57, image: 'https://i.imgur.com/4ikHwQP.png' },
  { id: 1837, name: 'TAPIOCA GRANULADA DA TERRINHA 500 G', category: 'Farináceos', price: 10.97, image: 'https://i.imgur.com/lE8bWgb.png' },
  { id: 1838, name: 'TAPIOCA GRANULADA YOKI 500 G', category: 'Farináceos', price: 16.92, image: 'https://i.imgur.com/XCrSjXy.png' },
  { id: 1839, name: 'TAPIOCA KISABOR 500 G', category: 'Farináceos', price: 5.25, image: 'https://i.imgur.com/sSxLbJp.png' },
  { id: 1840, name: 'TEMPERO ALHO E SAL FOOD SERVICE SABOR AMI AJINOMOTO 5 KILO', category: 'Farináceos', price: 60.91, image: 'https://i.imgur.com/V1eu0O5.png' },
  { id: 1841, name: 'TEMPERO BAIANO PENINA 1,05 KILO', category: 'Farináceos', price: 33.38, image: 'https://i.imgur.com/Dc32az7.png' },
  { id: 1842, name: 'TEMPERO COMPLETO COM PIMENTA FOOD SERVICE SABOR AMI AJINOMOTO 5 KILO', category: 'Farináceos', price: 63.96, image: 'https://i.imgur.com/1oLzZtk.png' },
  { id: 1843, name: 'TEMPERO COMPLETO FOOD SERVICE SABOR AMI AJINOMOTO 5 KILO', category: 'Farináceos', price: 63.96, image: 'https://i.imgur.com/B9NC0zA.png' },
  { id: 1844, name: 'TEMPERO LEMON PEPPER BRASILSECO 500 G', category: 'Farináceos', price: 22.12, image: 'https://i.imgur.com/933Gyh4.png' },
  { id: 1845, name: 'TEMPERO LEMON PEPPER PENINA 1,05 KILO', category: 'Farináceos', price: 76.45, image: 'https://i.imgur.com/XaXHLPL.png' },
  { id: 1846, name: 'TEMPERO SAZÓN ALHO AJINOMOTO 900 G', category: 'Farináceos', price: 45.91, image: 'https://i.imgur.com/Zkajmko.png' },
  { id: 1847, name: 'TEMPERO SAZÓN AVES VERDE AJINOMOTO 900 G', category: 'Farináceos', price: 40.45, image: 'https://i.imgur.com/Tc1USat.png' },
  { id: 1848, name: 'TEMPERO SAZÓN CARNES VERMELHO AJINOMOTO 900 G', category: 'Farináceos', price: 40.45, image: 'https://i.imgur.com/i17pJGu.png' },
  { id: 1849, name: 'TEMPERO SAZÓN LEGUMES E ARROZ AMARELO AJINOMOTO 900 G', category: 'Farináceos', price: 45.91, image: 'https://i.imgur.com/iFHPO0O.png' },
  { id: 1850, name: 'TRIGO KIBE BURGOL 5 KILO', category: 'Farináceos', price: 41.59, image: 'https://i.imgur.com/Lzql94O.png' },
  { id: 1851, name: 'TRIGO KIBE DA TERRINHA 500 G', category: 'Farináceos', price: 6.44, image: 'https://i.imgur.com/WolVggj.png' },
  { id: 1852, name: 'TRIGO KIBE YOKI 4 KILO', category: 'Farináceos', price: 40.31, image: 'https://i.imgur.com/cxnN7dt.png' },
  { id: 1853, name: 'ÁGUA SANITÁRIA YPÊ 1 L (CX 12 FR)', category: 'Higiene', price: 56.37, image: 'https://i.imgur.com/rLt4m1p.png' },
  { id: 1854, name: 'ÁLCOOL LÍQUIDO TUPI 70° 1 L (CX 12 FR)', category: 'Higiene', price: 107.89, image: 'https://i.imgur.com/HZkg0ni.png' },
  { id: 1855, name: 'DESINFETANTE EUCALIPTO BAK YPÊ 2 L (CX 6 GL)', category: 'Higiene', price: 73.99, image: 'https://i.imgur.com/YMv6ERd.png' },
  { id: 1856, name: 'DESINFETANTE LAVANDA BAK YPÊ 2 L (CX 6 GL)', category: 'Higiene', price: 73.99, image: 'https://i.imgur.com/3JD1lNK.png' },
  { id: 1857, name: 'DETERGENTE CLEAR YPÊ 500 ML (CX 24 FR)', category: 'Higiene', price: 81.99, image: 'https://i.imgur.com/75boDw5.png' },
  { id: 1858, name: 'DETERGENTE NEUTRO YPÊ 500 ML (CX 24 FR)', category: 'Higiene', price: 81.99, image: 'https://i.imgur.com/i5MRxzy.png' },
  { id: 1859, name: 'ESPONJA 3M SCOTCH BRITE / TININDO', category: 'Higiene', price: 19.41, image: 'https://i.imgur.com/Br5dVoV.png' },
  { id: 1860, name: 'ESPONJA DE LÃ DE AÇO ASSOLAN YPÊ (FDO 20 PCT)', category: 'Higiene', price: 55.72, image: 'https://i.imgur.com/iruoAq8.png' },
  { id: 1861, name: 'MULTIUSO CLÁSSICO YPÊ 500 ML (CX 12 FR)', category: 'Higiene', price: 69.2, image: 'https://i.imgur.com/AQsDYPE.png' },
  { id: 1862, name: 'PAPEL HIGIÊNICO FOLHA SIMPLES DAMA 8 ROLOS', category: 'Higiene', price: 11.12, image: 'https://i.imgur.com/yUxk8aM.png' },
  { id: 1863, name: 'PAPEL TOALHA LUAR 2 ROLOS', category: 'Higiene', price: 5.59, image: 'https://i.imgur.com/daugUaR.png' },
  { id: 1864, name: 'SABÃO EM BARRA NEUTRO YPÊ 5 UN 180 G', category: 'Higiene', price: 17.55, image: 'https://i.imgur.com/q29G7Yp.png' },
  { id: 1865, name: 'SABÃO EM PÓ PRIMAVERA TIXAN YPÊ 800 G', category: 'Higiene', price: 16.91, image: 'https://i.imgur.com/3wT0X53.png' },
  { id: 1866, name: 'SACO DE PANO 34 X 52 CM', category: 'Higiene', price: 18.96, image: 'https://i.imgur.com/o9NmkET.png' },
  { id: 1867, name: 'SACO PARA LIXO PRETO 90 X 90 CM 100 L (FDO 100 UN)', category: 'Higiene', price: 68.22, image: 'https://i.imgur.com/SkySFep.png' },
  { id: 1868, name: 'ALGAS MARINHAS YAKI SUSHI NORI BLACK TAICHI 140 G', category: 'Orientais', price: 51.77, image: 'https://i.imgur.com/pU7CEUZ.png' },
  { id: 1869, name: 'ALGAS MARINHAS YAKI SUSHI NORI GREEN TAICHI 140 G', category: 'Orientais', price: 39.62, image: 'https://i.imgur.com/e2F04XR.png' },
  { id: 1870, name: 'ARROZ JAPONÊS GUIN GRÃO CURTO CAMIL 5 KILO', category: 'Orientais', price: 76.32, image: 'https://i.imgur.com/Wk0ZIzr.png' },
  { id: 1871, name: 'ARROZ JAPONÊS TIPO 1 CLASSE LONGO INARÍ SOLITO 5 KILO', category: 'Orientais', price: 64.33, image: 'https://i.imgur.com/wvtWuEr.png' },
  { id: 1872, name: 'GENGIBRE EM CONSERVA TRADICIONAL TAICHI 1,01 KILO', category: 'Orientais', price: 15.21, image: 'https://i.imgur.com/fuyQY00.png' },
  { id: 1873, name: 'HASHI DE BAMBU TAICHI (CX 3000 UN)', category: 'Orientais', price: 268.41, image: 'https://i.imgur.com/A87ePHc.png' },
  { id: 1874, name: 'KANI KAMA CONGELADO OCEANI 200 G', category: 'Orientais', price: 6.91, image: 'https://i.imgur.com/X2M3R27.png' },
  { id: 1875, name: 'LICHIA EM CALDA TAICHI 567 G', category: 'Orientais', price: 22.93, image: 'https://i.imgur.com/RDx5YFI.png' },
  { id: 1876, name: 'MOLHO DE PIMENTA THAI SWEET CHILLI SAUCE TAICHI 1,01 L', category: 'Orientais', price: 22.81, image: 'https://i.imgur.com/65ZUq1x.png' },
  { id: 1877, name: 'MOLHO DE PIMENTA THAI SWEET CHILLI ZAFRÁN 1,05 KILO', category: 'Orientais', price: 28.89, image: 'https://i.imgur.com/LOPZAlJ.png' },
  { id: 1878, name: 'MOLHO SHOYU PREMIUM SACHÊ MITSUWA 8 ML (CX 250 UN)', category: 'Orientais', price: 36.91, image: 'https://i.imgur.com/b2R1e2F.png' },
  { id: 1879, name: 'MOLHO TARÊ KARUI 5 L', category: 'Orientais', price: 47.29, image: 'https://i.imgur.com/LJLsaNI.png' },
  { id: 1880, name: 'MOLHO TARÊ MITSUWA 5 L', category: 'Orientais', price: 69.39, image: 'https://i.imgur.com/hSjU1th.png' },
  { id: 1881, name: 'MOLHO TARÊ SACHÊ MITSUWA 8 ML (CX 252 UN)', category: 'Orientais', price: 39.23, image: 'https://i.imgur.com/RfVWT8r.png' },
  { id: 1882, name: 'ÓLEO DE GERGELIM TORRADO COMPOSTO TAICHI 900 ML', category: 'Orientais', price: 27.99, image: 'https://i.imgur.com/QMze7AS.png' },
  { id: 1883, name: 'TEMPERO HONDASHI FOOD SERVICE AJINOMOTO 500 G', category: 'Orientais', price: 47.56, image: 'https://i.imgur.com/zWd3QWS.png' },
  { id: 1884, name: 'TEMPERO REALÇADOR DE SABOR GLUTAMATO MONOSSÓDICO TAICHI 1,01 KILO', category: 'Orientais', price: 21.89, image: 'https://i.imgur.com/ZXpNWtV.png' },
  { id: 1885, name: 'WASABI EM PÓ PLUS TAICHI 1,01 KILO', category: 'Orientais', price: 48.31, image: 'https://i.imgur.com/PjlUiuT.png' },
  { id: 1886, name: 'DESMOLDANTE SPRAY AEROSOL UNTA FÁCIL 400 ML', category: 'Panificação', price: 39.81, image: 'https://i.imgur.com/ehCegIR.png' },
  { id: 1887, name: 'MELHORADOR DE FARINHA EM PÓ FLEISCHMANN 300 G', category: 'Panificação', price: 9.18, image: 'https://i.imgur.com/XUaMLhO.png' },
  { id: 1888, name: 'MISTURA PARA BOLO BAUNILHA DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://i.imgur.com/MxCbeLw.png' },
  { id: 1889, name: 'MISTURA PARA BOLO CENOURA DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://i.imgur.com/LCm4uO3.png' },
  { id: 1890, name: 'MISTURA PARA BOLO CHOCOLATE DONA BENTA 450 G', category: 'Panificação', price: 7.62, image: 'https://i.imgur.com/bjBlxDX.png' },
  { id: 1891, name: 'MISTURA PARA BOLO COCO DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://i.imgur.com/H1nmcoX.png' },
  { id: 1892, name: 'MISTURA PARA BOLO FUBÁ DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://i.imgur.com/MCQFJx4.png' },
  { id: 1893, name: 'MISTURA PARA BOLO LARANJA DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://i.imgur.com/4T1fDsU.png' },
  { id: 1894, name: 'MISTURA PARA BOLO MILHO DONA BENTA 450 G', category: 'Panificação', price: 5.92, image: 'https://i.imgur.com/JKnJH7R.png' },
  { id: 1895, name: 'CHEESE PILLOWS CONGELADO EMPANADO MCCAIN 1 KILO (CX 6 PCT)', category: 'Salgados', price: 441.73, image: 'https://i.imgur.com/pTKbV5x.png' },
  { id: 1896, name: 'DADINHO DE TAPIOCA COM QUEIJO DE COALHO CONGELADO PIF PAF 300 G', category: 'Salgados', price: 10.74, image: 'https://i.imgur.com/5P1YElQ.png' },
  { id: 1897, name: 'PRODUTO EM FALTA', category: 'Salgados', price: 0, image: 'https://i.imgur.com/80NzyQK.png' },
  { id: 1898, name: 'WAFFLE CONGELADO FORNO DE MINAS 525 G (CX 3,15 KILO)', category: 'Salgados', price: 131.27, image: 'https://i.imgur.com/TM0vRGh.png' },
  { id: 1899, name: 'CHÁ DE CAMOMILA CANELA E MAÇÃ TWININGS 15 G (CX 12 UN)', category: 'Bebidas', price: 173.25, image: '[img]https://i.imgur.com/Hq1F8h9.png[/img]' },
  { id: 1900, name: 'CHÁ DE HORTELÃ TWININGS 17,5 G (CX 12 UN)', category: 'Bebidas', price: 196.82, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1901, name: 'CHÁ DE LIMÃO E FRAMBOESA TWININGS 15 G (CX 12 UN)', category: 'Bebidas', price: 173.25, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1902, name: 'CHÁ MATTE LEÃO SOLÚVEL COM LIMÃO 1 KG (CX 10 UN)', category: 'Bebidas', price: 13.28, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1903, name: 'XAROPE MONIN KIWI 700 ML (CX 6 UN)', category: 'Bebidas', price: 59.94, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1904, name: 'ERVILHA GRANDE DA TERRINHA 500 G (FDO 12 PCT)', category: 'Conservas/Enlatados', price: 8.37, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1905, name: 'MOLHO AMERICANO SACHÊ ZAFRÁN 30 G (CX 96 UN)', category: 'Conservas/Enlatados', price: 32.57, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1906, name: 'MOLHO BARBECUE PREDILECTA 3,5 KG (CX 4 GL)', category: 'Conservas/Enlatados', price: 36.61, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1907, name: 'PASSATA DI POMODORO LA PASTINA 680 G (CX 12 VD)', category: 'Conservas/Enlatados', price: 20.94, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1908, name: 'PASSATA KNORR 1,5 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 18.41, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1909, name: 'COXINHAS DAS ASAS DE FRANGO APIMENTADAS EMPANADAS CONGELADAS SEARA 400 G (CX 12 PCT)', category: 'Derivados de Ave', price: 168.7, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1910, name: 'ISCAS DE FRANGO EMPANADAS CONGELADAS SEARA 900 G (CX 5 PCT)', category: 'Derivados de Ave', price: 173.97, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1912, name: 'STEAK DE FRANGO EMPANADO CONGELADO PERDIGÃO 100 G (CX 45 UN)', category: 'Derivados de Ave', price: 116.24, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1913, name: 'ACÉM BOVINO RESFRIADO MATOSO 14 KG (CX 28 KG)', category: 'Derivados de Bovino', price: 36.55, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1914, name: 'CAPA DE FILÉ BOVINA RESFRIADA MATOSO 1,3 KG (CX 23 KG)', category: 'Derivados de Bovino', price: 29.08, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1915, name: 'CORDÃO DO FILÉ MIGNON BOVINO RESFRIADO FRIGOESTRELA 1,5 KG (CX 18 KG)', category: 'Derivados de Bovino', price: 32.1, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1916, name: 'LAGARTO BOVINO RESFRIADO FRIGOESTRELA 3 KG (CX 26 KG)', category: 'Derivados de Bovino', price: 32.69, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1917, name: 'COMPOSTO LÁCTEO EM PÓ INTEGRAL ALIBRALAC 1 KG (FDO 10 PCT)', category: 'Derivados de Leite', price: 7.39, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1918, name: 'CREAM CHEESE QUATÁ 1,01 KG (CX 10 BIS)', category: 'Derivados de Leite', price: 33.85, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1919, name: 'CREME DE RICOTA LIGHT EM CALORIAS TIROLEZ 200 G (CX 16 UN)', category: 'Derivados de Leite', price: 6.69, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1920, name: 'FONDUE DE QUEIJO EMMENTAL TIROLEZ 400 G (CX 12 UN)', category: 'Derivados de Leite', price: 10.21, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1921, name: 'LEITE DESNATADO TRIANGULO MINEIRO 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 60.45, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1922, name: 'MOLHO CHEDDAR CORONATA 1,02 KG (CX 15 BIS)', category: 'Derivados de Leite', price: 29.39, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1923, name: 'MOLHO CHEDDAR DEFUMADO POLENGHI 1,01 KG (CX 6 BIS)', category: 'Derivados de Leite', price: 32.35, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1924, name: 'MOLHO CHEDDAR SCHREIBER 1,5 KG (CX 6 BIS)', category: 'Derivados de Leite', price: 37.09, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1925, name: 'MUÇARELA CAMILLA 4 KG (CX 6 PÇ)', category: 'Derivados de Leite', price: 24.69, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1926, name: 'MUÇARELA COBERTURA MOZZANA PIZZA 2 KG (CX 9 PÇ)', category: 'Derivados de Leite', price: 44.64, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1927, name: 'MUÇARELA DE BÚFALA QUALIMUUM 4 KG (CX 6 PÇ)', category: 'Derivados de Leite', price: 37.41, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1928, name: 'MUÇARELA DEALE 4 KG (CX 6 PÇ)', category: 'Derivados de Leite', price: 29.4, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1929, name: 'MUÇARELA FATIADA PEQUENA TIROLEZ 150 G (CX 28 PCT)', category: 'Derivados de Leite', price: 7.71, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1930, name: 'MUÇARELA IMPERADOR 4 KG (CX 6 PÇ)', category: 'Derivados de Leite', price: 26.45, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1931, name: 'MUÇARELA INLARON 4 KG (CX 6 PÇ)', category: 'Derivados de Leite', price: 35.28, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1932, name: 'MUÇARELA SUPREMA "3,5" KG (CX "8" PÇ)', category: 'Derivados de Leite', price: 28.01, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1933, name: 'PARMESÃO 6 MESES BURITIS 5,5 KG (CX 4 PÇ)', category: 'Derivados de Leite', price: 74.13, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1934, name: 'PARMESÃO TROPICAL CRISTAL 5 KG (CX 4 PÇ)', category: 'Derivados de Leite', price: 37.71, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1935, name: 'PROVOLONE APOLO 5 KG (CX 3 PÇ)', category: 'Derivados de Leite', price: 36.43, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1936, name: 'PROVOLONETE BURITIS 175 G (CX 45 UN)', category: 'Derivados de Leite', price: 12.66, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1937, name: 'QUEIJO COALHO BARRA BANDEIRA 2,5 KG (CX 5 UN)', category: 'Derivados de Leite', price: 39.88, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1938, name: 'QUEIJO FRESCAL VALEZA 500 G (CX 36 PÇ)', category: 'Derivados de Leite', price: 26.21, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1939, name: 'QUEIJO MINAS FRESCAL YEMA 450 G (CX 8 PÇ)', category: 'Derivados de Leite', price: 39.62, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1940, name: 'QUEIJO PRATO FATIADO TIROLEZ 150 G (CX 28 PCT)', category: 'Derivados de Leite', price: 7.71, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1941, name: 'REQUEIJÃO CONFEIPOP HARALD COM AMIDO 1,010 KG (CX 8 BIS)', category: 'Derivados de Leite', price: 8.67, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1942, name: 'REQUEIJÃO COPO DALLORA SABOR CHEDDAR 200 G (CX 24 UN)', category: 'Derivados de Leite', price: 104.8, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1943, name: 'REQUEIJÃO COPO LIGHT EM CALORIAS DALLORA 200 G (CX 12 UN)', category: 'Derivados de Leite', price: 101.12, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1944, name: 'REQUEIJÃO DALLORA FORNO E FOGÃO COM AMIDO 1,5 KG (CX 8 BIS)', category: 'Derivados de Leite', price: 16.35, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1945, name: 'APRESUNTADO FRIMESA 3,7 KG (CX 4 PÇ)', category: 'Derivados de Suíno', price: 58.72, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1946, name: 'BACON EM CUBOS BARRIGA E PALETA REZENDE 700 G (CX 12 PCT)', category: 'Derivados de Suíno', price: 23.51, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1947, name: 'BACON EM CUBOS BARRIGA FRIMESA 1 KG (CX 10 PCT)', category: 'Derivados de Suíno', price: 38.23, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1948, name: 'BACON EM CUBOS PALETA E PAPADA MISTER BEEF 1 KG (CX 18 PCT)', category: 'Derivados de Suíno', price: 36.45, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1949, name: 'BANHA FRIMESA 1 KG (CX 18 PCT)', category: 'Derivados de Suíno', price: 13.22, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1950, name: 'BANHA NOBRE 1 KG (CX 15 PCT)', category: 'Derivados de Suíno', price: 17.2, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1951, name: 'CALABRESA RETA MISTER BEEF 2,5 KG (CX 5 PCT)', category: 'Derivados de Suíno', price: 57.3, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1952, name: 'CARRÉ SUÍNO CONGELADO COM OSSO PAMPLONA 5 KG (CX 20 KG)', category: 'Derivados de Suíno', price: 17.15, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1953, name: 'COPA AURORA 600 G (CX 5 KG)', category: 'Derivados de Suíno', price: 97.16, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1954, name: 'COPA LOMBO SOBREPALETA SUÍNA SEM OSSO CONGELADA FRIELLA 3 KG (CX 22 KG)', category: 'Derivados de Suíno', price: 21.52, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1955, name: 'COSTELINHA SUÍNA CONGELADA EM TIRAS COM OSSO FRIELLA 1 KG (CX 20 KG)', category: 'Derivados de Suíno', price: 21.73, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1956, name: 'LOMBO SUÍNO SEM OSSO CONGELADO PAMPLONA 5 KG (CX 25 KG)', category: 'Derivados de Suíno', price: 23.26, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1957, name: 'MORTADELA DEFUMADA SEARA GOURMET 5 KG (CX 2 PÇ)', category: 'Derivados de Suíno', price: 14.6, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1958, name: 'MORTADELA ITALIANA 471 SP SEARA GOURMET 4,8 KG (CX 2 PÇ)', category: 'Derivados de Suíno', price: 27.44, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1959, name: 'PAIO SUÍNO PERDIGÃO 2,5 KG (CX 4 PCT)', category: 'Derivados de Suíno', price: 84.8, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1960, name: 'PEPPERONI FATIADO SABOR DE BRAGANÇA 1 KG (CX 3 PCT)', category: 'Derivados de Suíno', price: 58.18, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1961, name: 'PRESUNTO FATIADO SEARA 180 G (CX 22 PCT)', category: 'Derivados de Suíno', price: 8.07, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1962, name: 'TOUCINHO LOMBAR SUÍNO COM PELE CONGELADO ESTRELA 5 KG (CX 18 KG)', category: 'Derivados de Suíno', price: 20.34, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1963, name: 'ARROZ ARBÓRIO LA PASTINA 1 KG (CX 10 PCT)', category: 'Derivados de Vegetal', price: 23.24, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1964, name: 'ARROZ ARBÓRIO PROVINCIAS DO SUL 1 KG (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 17.14, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1965, name: 'AZEITE COMPOSTO 40% OLIVA 30% GIRASSOL E 30% SOJA FELICITÁ 500 ML (CX 12 VD)', category: 'Derivados de Vegetal', price: 63.53, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1966, name: 'AZEITONA VERDE GRAÚDA 12 X 16 TOZZI 2 KG (CX 4 BD)', category: 'Derivados de Vegetal', price: 37.21, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1967, name: 'BATATA CONGELADA PRÉ FRITA SURECRISP SKIN-ON WAFFLE FRIES CROSSTRAX MCCAIN 2,04 KG (CX 6 PCT)', category: 'Derivados de Vegetal', price: 327.29, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1968, name: 'CATCHUP REAL ZAFRÁN 1,05  KG (CX 5 BAG)', category: 'Derivados de Vegetal', price: 25.63, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1969, name: 'CEBOLA CARAMELIZADA CAPELISTA 1,8 KG (CX 6 BD)', category: 'Derivados de Vegetal', price: 57.26, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1970, name: 'ESPINAFRE EM FOLHAS CONGELADO GRANO 2 KG (CX 5 PCT)', category: 'Derivados de Vegetal', price: 35.06, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1971, name: 'GORDURA VEGETAL SUPREMA GOLDEN LT BUNGE 2,5 KG (CX 2 GL)', category: 'Derivados de Vegetal', price: 26.78, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1972, name: 'MANJERICÃO FLOCOS PENINA 200 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 3.57, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1973, name: 'MARGARINA COM SAL 82 % DELÍCIA SUPREME SABOR MANTEIGA 500 G (CX 12 UN)', category: 'Derivados de Vegetal', price: 82.81, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1974, name: 'ÓLEO DE SOJA FRY MAX SOYA (BD 15,8 L)', category: 'Derivados de Vegetal', price: 178.45, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1975, name: 'PICKLES CLASSIC MCCOY´S 2 KG (CX 2 BD)', category: 'Derivados de Vegetal', price: 100.86, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1976, name: 'PICKLES MISTO YGUARA (BD 2 KG)', category: 'Derivados de Vegetal', price: 29.92, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1977, name: 'PICKLES SWEET CAPELISTA 1,001 KG (CX 6 BD)', category: 'Derivados de Vegetal', price: 38.51, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1978, name: 'PURÊ DE BATATA LBS 1 KG (CX 8 PCT)', category: 'Derivados de Vegetal', price: 23, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1979, name: 'PURÊ DE BATATAS PENINA 500 G (CX 20 PCT)', category: 'Derivados de Vegetal', price: 18.38, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1980, name: 'VINAGRE SACHÊ ISIS 4 ML (CX 200 UN)', category: 'Derivados de Vegetal', price: 24.34, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1981, name: 'BACALHAU POLACA DO ALASCA SALGADO SECO FILÉ EM PEDAÇOS SEAPRO 5 KG (CX 2 PCT)', category: 'Derivados do Mar', price: 192.74, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1982, name: 'ACHOCOLATADO EM PÓ Q-ALIMENTARE 5 KG (FDO 4 PCT)', category: 'Doces/Frutas', price: 76.06, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1983, name: 'CHOCOLATE CHOCOCANDY DORI 500 G (CX 12 PCT)', category: 'Doces/Frutas', price: 16.06, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1984, name: 'COCO RALADO FLOCADO ÚMIDO E ADOÇADO QUALICOCO 1,010 KG (CX 10 PCT)', category: 'Doces/Frutas', price: 37.08, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1985, name: 'CREME DE BUENO RECHEIO ARTESANAL VABENE 1,01 KG (CX 8 BIS)', category: 'Doces/Frutas', price: 36.72, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1986, name: 'GELATINA SEM SABOR LBS 510 G (CX 16 PCT)', category: 'Doces/Frutas', price: 29.35, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1987, name: 'LEITE DE COCO GRANDE CULINÁRIO QUALICOCO 1 L (CX 6 FR)', category: 'Doces/Frutas', price: 20.76, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1988, name: 'MEL MÉDIO JP PEREIRA 500 G (CX 12 UN)', category: 'Doces/Frutas', price: 25.62, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1989, name: 'MEL MÉDIO MINAMEL 900 G (CX 12 BAG)', category: 'Doces/Frutas', price: 45.52, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1990, name: 'PÊSSEGO EM CALDA FINÍSSIMA 485 G (CX 12 LT)', category: 'Doces/Frutas', price: 18.76, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1991, name: 'PISTACHE CRU SEM CASCA LERYC 1 KG (CX 10 PCT)', category: 'Doces/Frutas', price: 230.06, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1992, name: 'POLPA DE ABACAXI COM HORTELÃ CONGELADA ICEFRUIT 100 G (CX 20 UN)', category: 'Doces/Frutas', price: 41.69, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1993, name: 'POLPA DE CAJU CONGELADA ICEFRUIT 100 G (CX 20 UN)', category: 'Doces/Frutas', price: 61.63, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1994, name: 'RECHEIO E COBERTURA FORNEÁVEL SABOR PISTACHE HARALD 1,010 KG (CX 8 BIS)', category: 'Doces/Frutas', price: 52.76, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1995, name: 'COUSCOUS LA PASTINA 500 G (CX 12 PCT)', category: 'Farináceos', price: 22.58, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1996, name: 'CURAU COM LEITE LBS 1 KG (CX 10 UN)', category: 'Farináceos', price: 13.6, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1997, name: 'FARINHA DE TRIGO TIPO 1 PURÍSSIMA ORIGINALE COAMO 5 KG (FDO 25 KG)', category: 'Farináceos', price: 119.39, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1998, name: 'MACARRÃO PENNE RIGATE GRANO DURO BARILLA 500 G (CX 12 UN)', category: 'Farináceos', price: 9.34, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1999, name: 'MASSA FRESCA ESPAGUETE FAMIGLIARE 500 G (CX 15 PCT)', category: 'Farináceos', price: 8.22, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 2000, name: 'MASSA PARA LASANHA FAMIGLIARE 500 G (CX 22 PCT)', category: 'Farináceos', price: 7.34, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 2001, name: 'NHOQUE DE BATATA FAMIGLIARE 500 G (CX 12 PCT)', category: 'Farináceos', price: 8.81, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 2002, name: 'SAL SACHÊ CISNE 1 G (CX 1000 UN)', category: 'Farináceos', price: 30.06, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 2003, name: 'TAPIOCA OISHII 1 KG (FD 10 PCT)', category: 'Farináceos', price: 6.77, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 2004, name: 'PANO MULTIUSO AZUL BOBINA 50 UNIDADES 28 CM X 25 CM LIFE CLEAN (CX 12 UN)', category: 'Higiene', price: 22.76, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 2005, name: 'LICHIA EM CALDA BARÃO LALI 567 G (CX 24 LT)', category: 'Orientais', price: 22.93, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 1756, name: 'FARINHA DE TRIGO PREMIUM ANACONDA 5 KILO (FDO 25 KILO)', category: '⏳ Ofertas da Semana 🚨', price: 124.22, image: 'https://i.imgur.com/fe6V8D2.png' },
  { id: 1735, name: 'FARINHA DE TRIGO PEQUENA PREMIUM ANACONDA 1 KILO (FDO 10 KILO)', category: '⏳ Ofertas da Semana 🚨', price: 45.33, image: 'https://i.imgur.com/ywH3bp4.png' },
  { id: 1767, name: 'FARINHA DE TRIGO TIPO 1 SOL 5 KILO (FDO 25 KILO)', category: '⏳ Ofertas da Semana 🚨', price: 100.00, image: 'https://i.imgur.com/CW0JPEA.png' },
  { id: 1320, name: 'MARGARINA FOLHADOS & CROISSANTS 80 % AMÉLIA 2 KILO (CX 6 UN)', category: '⏳ Ofertas da Semana 🚨', price: 215.00, image: 'https://i.imgur.com/2pvaNlo.png' },
  { id: 1318, name: 'MARGARINA COM SAL 80 % AMÉLIA (BD 14 KILO)', category: '⏳ Ofertas da Semana 🚨', price: 189.99, image: 'https://i.imgur.com/42NyvIv.png' },
  { id: 1774, name: 'FERMENTO EM PÓ QUÍMICO TRADICIONAL DONA BENTA 100 G', category: '⏳ Ofertas da Semana 🚨', price: 3.09, image: 'https://i.imgur.com/QQnUci6.png' },
  { id: 1743, name: 'FARINHA DE TRIGO PEQUENA TIPO 1 ROSA BRANCA 1 KILO (FDO 10 KILO)', category: '⏳ Ofertas da Semana 🚨', price: 55.77, image: 'https://i.imgur.com/PmbsA58.png' },
  { id: 1034, name: 'MORTADELA TRADICIONAL MARBA 5 KG', category: '⏳ Ofertas da Semana 🚨', price: 11.99, image: 'https://i.imgur.com/MArz8B2.png' },
  { id: 1059, name: 'PRESUNTO DÁLIA 3.3 KILO PÇ', category: '⏳ Ofertas da Semana 🚨', price: 72.44, image: 'https://i.imgur.com/XOYlXlu.png' },
  { id: 502, name: 'OVOS BRANCOS TIPO GRANDE MODELO 60 UN (CX 2 BDJ)', category: '⏳ Ofertas da Semana 🚨', price: 49.99, image: 'https://i.imgur.com/y2Hue0m.png' },
  // Continue a adicionar seus produtos
];

const banners = [
  { 
    id: 1,
    desktop: 'https://i.imgur.com/lzxANGT.gif',
    mobile: 'https://i.imgur.com/sS31EnX.gif'
  },
  { 
    id: 2,
    desktop: 'https://i.imgur.com/Yy7RIna.png',
    mobile: 'https://i.imgur.com/WiB6fYX.png'
  },
  { 
    id: 3,
    desktop: 'https://i.imgur.com/vVskyqX.png',
    mobile: 'https://i.imgur.com/kLDkiAy.png'
  },
  { 
    id: 4,
    desktop: 'https://i.imgur.com/LmzBiOq.png',
    mobile: 'https://i.imgur.com/vYBBAd6.png'
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
      transition: 'transform 0.3s, box-shadow 0.3s'
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


















