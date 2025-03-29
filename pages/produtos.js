import React, { useState } from 'react';
import Cart from './Cart';

// Lista de categorias
const categories = [
  'Acessórios', 'Bebidas', 'Conservas/Enlatados', 'Derivados de Ave', 
  'Derivados de Bovino', 'Derivados de Leite', 'Derivados de Suíno', 
  'Derivados de Vegetal', 'Derivados do Mar', 'Doces/Frutas', 
  'Farináceos', 'Higiene', 'Orientais', 'Panificação', 'Salgados'
];

// Lista completa de produtos (exemplo com alguns produtos, adicione todos os seus)
const products = [
  { id: 1, name: 'APLICADOR PARA REQUEIJÃO (CX 1 UN)', category: 'Acessórios', price: 705, image: 'https://i.imgur.com/xRNNoJ1.png' },
  { id: 2, name: 'AVENTAL EMBORRACHADO BRANCO TAMANHO ÚNICO', category: 'Acessórios', price: 16, image: 'https://i.imgur.com/vdFl2eF.png' },
  { id: 3, name: 'AVENTAL EMBORRACHADO PRETO TAMANHO ÚNICO', category: 'Acessórios', price: 16, image: 'https://i.imgur.com/VkoKK8b.png' },
  { id: 4, name: 'AVENTAL TERGAL BRANCO TAMANHO ÚNICO', category: 'Acessórios', price: 17, image: 'https://i.imgur.com/9CQc9lS.png' },
  { id: 5, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/8Zlhcs4.png' },
  { id: 6, name: 'PRODUTO EM FALTA', category: 'Conservas/Enlatados', price: 0, image: 'https://i.imgur.com/8Zlhcs4.png' },
  { id: 7, name: 'PRODUTO EM FALTA', category: 'Bebidas', price: 0, image: 'https://i.imgur.com/8Zlhcs4.png' },
  { id: 8, name: 'PRODUTO EM FALTA', category: 'Salgados', price: 0, image: 'https://i.imgur.com/8Zlhcs4.png' },
  { id: 9, name: 'PRODUTO EM FALTA', category: 'Derivados de Leite', price: 0, image: 'https://i.imgur.com/8Zlhcs4.png' },
  { id: 10, name: 'PRODUTO EM FALTA', category: 'Derivados de Bovino', price: 0, image: 'https://i.imgur.com/8Zlhcs4.png' },
  { id: 11, name: 'BANDEJA PARA ESFIHA "22" 17 X 20 CM (PCT 100 UN)', category: 'Acessórios', price: 27, image: 'https://i.imgur.com/EH1m90i.png' },
  { id: 12, name: 'BANDEJA PARA ESFIHA "23" 20 X 24 CM (PCT 100 UN)', category: 'Acessórios', price: 38, image: 'https://i.imgur.com/GSbN5x9.png' },
  { id: 13, name: 'BANDEJA PARA ESFIHA "25" 27 X 32 CM (PCT 100 UN)', category: 'Acessórios', price: 75, image: 'https://i.imgur.com/fV525qj.png' },
  { id: 14, name: 'BANDEJA PARA ESFIHA "24" 21 X 27 CM (PCT 100 UN)', category: 'Acessórios', price: 50, image: 'https://i.imgur.com/l5EHUeV.png' },
  { id: 15, name: 'BAÚ MOCHILA PRATA LAMINADO PARA PIZZA MIL ROTAS (UN)', category: 'Acessórios', price: 170, image: 'https://i.imgur.com/xK6GCwc.png' },
  { id: 16, name: 'BAÚ MOCHILA VERMELHO COMUM PARA PIZZA MIL ROTAS (UN)', category: 'Acessórios', price: 139, image: 'https://i.imgur.com/0sfnhWc.png' },
  { id: 17, name: 'BAÚ MOCHILA VERMELHO LAMINADO COM BOLSÃO PARA PIZZA MIL ROTAS (UN)', category: 'Acessórios', price: 170, image: 'https://i.imgur.com/Xmzk5dn.png' },
  { id: 18, name: 'BONÉ BRIM BRANCO (UN)', category: 'Acessórios', price: 22, image: 'https://i.imgur.com/9vF5FfN.png' },
  { id: 19, name: 'BRIQUETE (SC 21 KG)', category: 'Acessórios', price: 50, image: 'https://i.imgur.com/YeJ6gLC.png' },
  { id: 20, name: 'CAIXA PARA PIZZA BRANCA 25 CM (PCT 25 UN)', category: 'Acessórios', price: 41, image: 'https://i.imgur.com/Gz5GuUb.png' },
  { id: 21, name: 'CAIXA PARA PIZZA BRANCA 35 CM (PCT 25 UN)', category: 'Acessórios', price: 48, image: 'https://i.imgur.com/YbnQSj9.png' },
  { id: 22, name: 'CAIXA PARA PIZZA OITAVADA 25 CM (PCT 25 UN)', category: 'Acessórios', price: 25, image: 'https://i.imgur.com/xHOKPsy.png' },
  { id: 23, name: 'CAIXA PARA PIZZA OITAVADA 35 CM (PCT 25 UN)', category: 'Acessórios', price: 36, image: 'https://i.imgur.com/93BT48Q.png' },
  { id: 24, name: 'CALÇA BRIM BRANCA (UN 44 / M)', category: 'Acessórios', price: 84, image: 'https://i.imgur.com/dXX4mA0.png' },
  { id: 25, name: 'CALÇA BRIM BRANCA (UN 46 / G)', category: 'Acessórios', price: 84, image: 'https://i.imgur.com/OMc2PMM.png' },
  { id: 26, name: 'CANUDO BIODEGRADÁVEL STRAWPLAST 500 UN', category: 'Acessórios', price: 27, image: 'https://i.imgur.com/g5JNeRt.png' },
  { id: 27, name: 'COMANDA COMUM (PCT 20 x 50)', category: 'Acessórios', price: 37, image: 'https://i.imgur.com/QbaUrZs.png' },
  { id: 28, name: 'COMANDA COPIATIVA (PCT 20 x 50)', category: 'Acessórios', price: 41, image: 'https://i.imgur.com/sf81TDO.png' },
  { id: 29, name: 'COPO DESCARTÁVEL MÉDIO 180 ML PCT 100 UN', category: 'Acessórios', price: 8, image: 'https://i.imgur.com/NO8E2jD.png' },
  { id: 30, name: 'COPO DESCARTÁVEL PEQUENO 50 ML PCT 100 UN', category: 'Acessórios', price: 4, image: 'https://i.imgur.com/gn5JO0M.png' },
  { id: 31, name: 'ENVELOPE PARA PIZZA 25 CM (FDO 250 UN)', category: 'Acessórios', price: 67, image: 'https://i.imgur.com/n2UhHK0.png' },
  { id: 32, name: 'ENVELOPE PARA PIZZA 35 CM (FDO 250 UN)', category: 'Acessórios', price: 79, image: 'https://i.imgur.com/TudGuED.png' },
  { id: 33, name: 'ETIQUETA LACRE (PCT 2 x 500)', category: 'Acessórios', price: 45, image: 'https://i.imgur.com/zVovVts.png' },
  { id: 34, name: 'FÓSFORO QUELUZ (PCT 10 UN)', category: 'Acessórios', price: 4, image: 'https://i.imgur.com/o4urrNs.png' },
  { id: 35, name: 'GUARDANAPO DE PAPEL TV (PCT 2000 UN)', category: 'Acessórios', price: 21, image: 'https://i.imgur.com/jTNCTlT.png' },
  { id: 36, name: 'PÁ DE ESFIHA (UN 90 X 22 CM)', category: 'Acessórios', price: 152, image: 'https://i.imgur.com/3O56lc7.png' },
  { id: 37, name: 'PÁ DE FERRO (UN 35 CM)', category: 'Acessórios', price: 109, image: 'https://i.imgur.com/bZ8QS5y.png' },
  { id: 38, name: 'PÁ DE FERRO (UN 38 CM)', category: 'Acessórios', price: 129, image: 'https://i.imgur.com/CSlRZMV.png' },
  { id: 39, name: 'PÁ DE MADEIRA (UN 35 CM)', category: 'Acessórios', price: 190, image: 'https://i.imgur.com/GEXkR8j.png' },
  { id: 40, name: 'PÁ DE MADEIRA (UN 40 CM)', category: 'Acessórios', price: 190, image: 'https://i.imgur.com/z0VRXno.png' },
  { id: 41, name: 'PALITO SACHÊ BOM SABOR (CX 2000 UN)', category: 'Acessórios', price: 29, image: 'https://i.imgur.com/q2cVQcN.png' },
  { id: 42, name: 'SUPORTE TRIPÉ INJEQUALY (PCT 500 UN)', category: 'Acessórios', price: 33, image: 'https://i.imgur.com/UNbS4Zt.png' },
  { id: 43, name: 'TOUCA DE CABELO TNT (PCT 100 UN)', category: 'Acessórios', price: 19, image: 'https://i.imgur.com/4j4OlRg.png' },
  { id: 44, name: 'VARREDOR PARA FORNO (UN 40 CM)', category: 'Acessórios', price: 93, image: 'https://i.imgur.com/6mCFEci.png' },
  { id: 45, name: 'VASSOURINHA CABO PLÁSTICO (UN)', category: 'Acessórios', price: 11, image: 'https://i.imgur.com/1hzJAIk.png' },
  { id: 46, name: 'ÁGUA DE COCO GRANDE COCO QUADRADO 1 L (CX 12 UN)', category: 'Bebidas', price: 93, image: 'https://i.imgur.com/tqXbq0u.png' },
  { id: 47, name: 'ÁGUA DE COCO GRANDE MAIS COCO 1 L (CX 12 UN)', category: 'Bebidas', price: 143, image: 'https://i.imgur.com/Yg6Kl4U.png' },
  { id: 48, name: 'ÁGUA DE COCO GRANDE SOCOCO 1 L (CX 12 UN)', category: 'Bebidas', price: 150, image: 'https://i.imgur.com/xGWxX17.png' },
  { id: 49, name: 'ÁGUA DE COCO MÉDIA SOCOCO 330 ML (CX 12 UN)', category: 'Bebidas', price: 100, image: 'https://i.imgur.com/bhoCd71.png' },
  { id: 50, name: 'ÁGUA DE COCO PEQUENA COCO QUADRADO 200 ML (CX 27 UN)', category: 'Bebidas', price: 54, image: 'https://i.imgur.com/HOVDKDi.png' },
  { id: 51, name: 'ÁGUA DE COCO PEQUENA SOCOCO 200 ML (CX 24 UN)', category: 'Bebidas', price: 18, image: 'https://i.imgur.com/4pmmrk2.png' },
  { id: 52, name: 'ÁGUA MINERAL BUONAVITA COM GÁS 510 ML (PCT 12 UN)', category: 'Bebidas', price: 16, image: 'https://i.imgur.com/17TzAGa.png' },
  { id: 53, name: 'ÁGUA MINERAL BUONAVITA SEM GÁS 510 ML (PCT 12 UN)', category: 'Bebidas', price: 13, image: 'https://i.imgur.com/FtAvPy2.png' },
  { id: 54, name: 'ÁGUA MINERAL CRYSTAL COM GÁS 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 21, image: 'https://i.imgur.com/qk5R1EC.png' },
  { id: 55, name: 'ÁGUA MINERAL CRYSTAL COM GÁS 500 ML (PCT 12 UN)', category: 'Bebidas', price: 22, image: 'https://i.imgur.com/BEji5qD.png' },
  { id: 56, name: 'ÁGUA MINERAL CRYSTAL SEM GÁS 500 ML (PCT 12 UN)', category: 'Bebidas', price: 22, image: 'https://i.imgur.com/E1FmizQ.png' },
  { id: 57, name: 'ÁGUA MINERAL GRANDE BUONAVITA SEM GÁS 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 14, image: 'https://i.imgur.com/D94rRgB.png' },
  { id: 58, name: 'ÁGUA MINERAL GRANDE CRYSTAL SEM GÁS 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/sgI0IfJ.png' },
  { id: 59, name: 'ÁGUA MINERAL SÃO LOURENÇO COM GÁS 300 ML (PCT 12 UN)', category: 'Bebidas', price: 28, image: 'https://i.imgur.com/Z5uVO48.png' },
  { id: 60, name: 'ÁGUA MINERAL SÃO LOURENÇO SEM GÁS 300 ML (PCT 12 UN)', category: 'Bebidas', price: 24, image: 'https://i.imgur.com/ZIpy8tT.png' },
  { id: 61, name: 'ÁGUA TÔNICA ANTARCTICA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 40, image: 'https://i.imgur.com/xPYBtZK.png' },
  { id: 62, name: 'ÁGUA TÔNICA ANTARCTICA ZERO AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 39, image: 'https://i.imgur.com/TxNWUio.png' },
  { id: 63, name: 'ÁGUA TÔNICA SCHWEPPES LATA 350 ML (PCT 6 LT)', category: 'Bebidas', price: 19, image: 'https://i.imgur.com/KOTwPYv.png' },
  { id: 64, name: 'AGUARDENTE DE CANA KARIRI 960 ML', category: 'Bebidas', price: 15, image: 'https://i.imgur.com/5xoELur.png' },
  { id: 65, name: 'AGUARDENTE DE CANA PITÚ 965 ML', category: 'Bebidas', price: 12, image: 'https://i.imgur.com/o67gbyF.png' },
  { id: 66, name: 'AGUARDENTE DE CANA PITÚ LATA 350 ML', category: 'Bebidas', price: 52, image: 'https://i.imgur.com/Ykv0QsE.png' },
  { id: 67, name: 'AGUARDENTE DE CANA YPIÓCA PRATA SEM PALHA 965 ML', category: 'Bebidas', price: 19, image: 'https://i.imgur.com/KlWngwN.png' },
  { id: 68, name: 'APERITIVO APEROL 750 ML', category: 'Bebidas', price: 40, image: 'https://i.imgur.com/VoOwOvW.png' },
  { id: 69, name: 'APERITIVO BRASILBERG 920 ML', category: 'Bebidas', price: 53, image: 'https://i.imgur.com/EftrEce.png' },
  { id: 70, name: 'APERITIVO CAMPARI 998 ML', category: 'Bebidas', price: 53, image: 'https://i.imgur.com/5bSaThb.png' },
  { id: 71, name: 'APERITIVO CATUABA SELVAGEM TRADICIONAL 900 ML', category: 'Bebidas', price: 13, image: 'https://i.imgur.com/isp0yHw.png' },
  { id: 72, name: 'APERITIVO CINZANO VERMOUTH ROSSO 1 L', category: 'Bebidas', price: 36, image: 'https://i.imgur.com/mVSUVIK.png' },
  { id: 73, name: 'APERITIVO CONTINI 900 ML', category: 'Bebidas', price: 29, image: 'https://i.imgur.com/z19w0T0.png' },
  { id: 74, name: 'APERITIVO CYNAR 900 ML', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/5ZSUJve.png' },
  { id: 75, name: 'APERITIVO FERNET FENETTI DUBAR 900 ML', category: 'Bebidas', price: 22, image: 'https://i.imgur.com/PaQnVde.png' },
  { id: 76, name: 'APERITIVO JURUPINGA DINALLE 975 ML', category: 'Bebidas', price: 28, image: 'https://i.imgur.com/auiD435.png' },
  { id: 77, name: 'APERITIVO MALIBU 750 ML', category: 'Bebidas', price: 48, image: 'https://i.imgur.com/MWsgdmO.png' },
  { id: 78, name: 'APERITIVO MARTINI BIANCO SUAVE 750 ML', category: 'Bebidas', price: 28, image: 'https://i.imgur.com/bsA2KBV.png' },
  { id: 79, name: 'APERITIVO PARATUDO RAÍZES AMARGAS 900 ML', category: 'Bebidas', price: 14, image: 'https://i.imgur.com/WsQAo1N.png' },
  { id: 80, name: 'CACHAÇA 51 965 ML (CX 12 UN)', category: 'Bebidas', price: 152, image: 'https://i.imgur.com/TqKXtHc.png' },
  { id: 81, name: 'CACHAÇA BOAZINHA 600 ML', category: 'Bebidas', price: 45, image: 'https://i.imgur.com/wtfC1KY.png' },
  { id: 82, name: 'CACHAÇA BUSCA VIDA 670 ML', category: 'Bebidas', price: 62, image: 'https://i.imgur.com/OI94JGY.png' },
  { id: 83, name: 'CACHAÇA CHICO MINEIRO OURO 600 ML', category: 'Bebidas', price: 44, image: 'https://i.imgur.com/5pO8gYd.png' },
  { id: 84, name: 'CACHAÇA COROTE TRADICIONAL 500 ML (CX 12 UN)', category: 'Bebidas', price: 49, image: 'https://i.imgur.com/KTiq21r.png' },
  { id: 85, name: 'CACHAÇA ESPÍRITO DE MINAS 700 ML', category: 'Bebidas', price: 104, image: 'https://i.imgur.com/fow1yzn.png' },
  { id: 86, name: 'CACHAÇA SAGATIBA PURA 700 ML', category: 'Bebidas', price: 36, image: 'https://i.imgur.com/FlR6Qh0.png' },
  { id: 87, name: 'CACHAÇA SÃO FRANCISCO 970 ML', category: 'Bebidas', price: 30, image: 'https://i.imgur.com/iQR2qEp.png' },
  { id: 88, name: 'CACHAÇA SELETA OURO 1 L', category: 'Bebidas', price: 49, image: 'https://i.imgur.com/4sS9pVm.png' },
  { id: 89, name: 'CACHAÇA TRADICIONAL SALINAS 600 ML', category: 'Bebidas', price: 36, image: 'https://i.imgur.com/FeiiJss.png' },
  { id: 90, name: 'CACHAÇA TRÊS CORONÉIS 700 ML', category: 'Bebidas', price: 34, image: 'https://i.imgur.com/YHYZ2Ud.png' },
  { id: 91, name: 'CACHAÇA VELHO BARREIRO 910 ML (CX 12 UN)', category: 'Bebidas', price: 162, image: 'https://i.imgur.com/ww4Ey2O.png' },
  { id: 92, name: 'CACHAÇA YPIÓCA OURO COM PALHA 965 ML', category: 'Bebidas', price: 38, image: 'https://i.imgur.com/a3cody2.png' },
  { id: 93, name: 'CACHAÇA YPIÓCA OURO SEM PALHA 965 ML', category: 'Bebidas', price: 19, image: 'https://i.imgur.com/ZADAGxu.png' },
  { id: 94, name: 'CERVEJA AMSTEL PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 45, image: 'https://i.imgur.com/gqAmSPA.png' },
  { id: 95, name: 'CERVEJA BADEN BADEN PILSEN CRISTAL 600 ML', category: 'Bebidas', price: 15, image: 'https://i.imgur.com/gIH2c6r.png' },
  { id: 96, name: 'CERVEJA BRAHMA CHOPP PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 41, image: 'https://i.imgur.com/xMU8wow.png' },
  { id: 97, name: 'CERVEJA BRAHMA DUPLO MALTE LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 46, image: 'https://i.imgur.com/H9NEcSv.png' },
  { id: 98, name: 'CERVEJA BRAHMA MALZBIER LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 57, image: 'https://i.imgur.com/loLnJMo.png' },
  { id: 99, name: 'CERVEJA BUDWEISER LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 46, image: 'https://i.imgur.com/lwl3JpI.png' },
  { id: 100, name: 'CERVEJA BUDWEISER LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 149, image: 'https://i.imgur.com/8MX9Cuv.png' },
  { id: 101, name: 'CERVEJA CORONA LONG NECK 330 ML (CX 24 UN)', category: 'Bebidas', price: 172, image: 'https://i.imgur.com/EviQUwq.png' },
  { id: 102, name: 'CERVEJA EISENBAHN PILSEN PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 55, image: 'https://i.imgur.com/8E2gGKF.png' },
  { id: 103, name: 'CERVEJA HEINEKEN PURE MALT LAGER GARRAFA 600 ML (CX 12 UN)', category: 'Bebidas', price: 154, image: 'https://i.imgur.com/g9bdaCe.png' },
  { id: 104, name: 'CERVEJA HEINEKEN PURE MALT LAGER LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 76, image: 'https://i.imgur.com/KpaxjmO.png' },
  { id: 105, name: 'CERVEJA HEINEKEN PURE MALT LAGER LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 174, image: 'https://i.imgur.com/uTzT10G.png' },
  { id: 106, name: 'CERVEJA HEINEKEN ZERO ÁLCOOL 0.0 PURE MALT LAGER LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 72, image: 'https://i.imgur.com/zTOBPy4.png' },
  { id: 107, name: 'CERVEJA HEINEKEN ZERO ÁLCOOL 0.0 PURE MALT LAGER LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 167, image: 'https://i.imgur.com/HqD5nNf.png' },
  { id: 108, name: 'CERVEJA IMPÉRIO PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 38, image: 'https://i.imgur.com/yCWHL3m.png' },
  { id: 109, name: 'CERVEJA ITAIPAVA MALZBIER LONG NECK 330 ML (PCT 12 UN)', category: 'Bebidas', price: 62, image: 'https://i.imgur.com/VfO4EqY.png' },
  { id: 110, name: 'CERVEJA ITAIPAVA PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/QD6KSIU.png' },
  { id: 111, name: 'CERVEJA MÉDIA SKOL PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 50, image: 'https://i.imgur.com/NAYX8Ci.png' },
  { id: 112, name: 'CERVEJA ORIGINAL PILSEN GARRAFA 600 ML (CX 12 UN)', category: 'Bebidas', price: 116, image: 'https://i.imgur.com/GsxYNg2.png' },
  { id: 113, name: 'CERVEJA ORIGINAL PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 54, image: 'https://i.imgur.com/c8DgNO8.png' },
  { id: 114, name: 'CERVEJA PEQUENA BRAHMA DUPLO MALTE LATA 269 ML (CX 15 LT)', category: 'Bebidas', price: 41, image: 'https://i.imgur.com/nli1nNP.png' },
  { id: 115, name: 'CERVEJA PEQUENA BUDWEISER LATA 269 ML (CX 8 LT)', category: 'Bebidas', price: 26, image: 'https://i.imgur.com/ORmar3O.png' },
  { id: 116, name: 'CERVEJA PEQUENA HEINEKEN PURE MALT LAGER LATA 269 ML (CX 8 LT)', category: 'Bebidas', price: 32, image: 'https://i.imgur.com/QhZv0Ag.png' },
  { id: 117, name: 'CERVEJA PEQUENA ITAIPAVA LATA 269 ML (CX 12 LT)', category: 'Bebidas', price: 28, image: 'https://i.imgur.com/RwijqKS.png' },
  { id: 118, name: 'CERVEJA PEQUENA ORIGINAL LATA 269 ML (CX 8 LT)', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/CdtjYC6.png' },
  { id: 119, name: 'CERVEJA PEQUENA SKOL PILSEN LATA 269 ML (PCT 15 LT)', category: 'Bebidas', price: 42, image: 'https://i.imgur.com/S5M5fZx.png' },
  { id: 120, name: 'CERVEJA PETRA PURO MALTE LATA 350 ML (CX 12 LT)', category: 'Bebidas', price: 43, image: 'https://i.imgur.com/FrZQJAp.png' },
  { id: 121, name: 'CERVEJA SPATEN MUNICH GARRAFA 600 ML (CX 12 UN)', category: 'Bebidas', price: 106, image: 'https://i.imgur.com/UqnM9iw.png' },
  { id: 122, name: 'CERVEJA SPATEN MUNICH LONG NECK 330 ML (CX 24 UN)', category: 'Bebidas', price: 130, image: 'https://i.imgur.com/aYUFDw0.png' },
  { id: 123, name: 'CERVEJA STELLA ARTOIS LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 148, image: 'https://i.imgur.com/Yqv90NL.png' },
  { id: 124, name: 'CHÁ ICE TEA LEÃO PÊSSEGO 450 ML (PCT 6 UN)', category: 'Bebidas', price: 24, image: 'https://i.imgur.com/mYsMIVY.png' },
  { id: 125, name: 'CHOPP DE VINHO DRAFT 600 ML (CX 6 UN)', category: 'Bebidas', price: 57, image: 'https://i.imgur.com/QPmzWNc.png' },
  { id: 126, name: 'COCA COLA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 38, image: 'https://i.imgur.com/Uwi8g8t.png' },
  { id: 127, name: 'COCA COLA MÉDIA PET 1 L (PCT 6 UN)', category: 'Bebidas', price: 41, image: 'https://i.imgur.com/vCg7qHG.png' },
  { id: 128, name: 'COCA COLA MIÚDA PET 200 ML (PCT 12 UN)', category: 'Bebidas', price: 24, image: 'https://i.imgur.com/M1Bwinx.png' },
  { id: 129, name: 'COCA COLA MIÚDA ZERO AÇÚCARES PET 200 ML (PCT 12 UN)', category: 'Bebidas', price: 24, image: 'https://i.imgur.com/MbguwP0.png' },
  { id: 130, name: 'COCA COLA PEQUENA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 61, image: 'https://i.imgur.com/85GeybY.png' },
  { id: 131, name: 'COCA COLA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/0mRiiHR.png' },
  { id: 132, name: 'COCA COLA SEM AÇÚCAR LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 39, image: 'https://i.imgur.com/kqAAygP.png' },
  { id: 133, name: 'COCA COLA SEM AÇÚCAR PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 61, image: 'https://i.imgur.com/HCnvLhe.png' },
  { id: 134, name: 'COCA COLA SEM AÇÚCAR PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 60, image: 'https://i.imgur.com/huczUsj.png' },
  { id: 135, name: 'CONHAQUE DE ALCATRÃO SÃO JOÃO DA BARRA 900 ML', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/B2Bf4H9.png' },
  { id: 136, name: 'CONHAQUE DOMECQ 1 L', category: 'Bebidas', price: 29, image: 'https://i.imgur.com/2Gurjzh.png' },
  { id: 137, name: 'CONHAQUE DREHER 900 ML', category: 'Bebidas', price: 18.47, image: 'https://i.imgur.com/8SAGGHm.png' },
  { id: 138, name: 'CONHAQUE FUNDADOR 750 ML', category: 'Bebidas', price: 135, image: 'https://i.imgur.com/76UKYQw.png' },
  { id: 139, name: 'CONHAQUE PRESIDENTE 900 ML', category: 'Bebidas', price: 13, image: 'https://i.imgur.com/6w0dfiz.png' },
  { id: 140, name: 'COQUETEL CANELINHA DA ROCHA 900 ML', category: 'Bebidas', price: 12, image: 'https://i.imgur.com/e8vbfxi.png' },
  { id: 141, name: 'COQUETEL DE VINHO NACIONAL TINTO SUAVE CANTINHO DO VALE 880 ML (CX 12 UN)', category: 'Bebidas', price: 63, image: 'https://i.imgur.com/pWceuEo.png' },
  { id: 142, name: 'COQUETEL DE VODKA LIMÃO COROTE 500 ML (CX 12 UN)', category: 'Bebidas', price: 47, image: 'https://i.imgur.com/bjjlPUR.png' },
  { id: 143, name: 'COQUETEL DE VODKA MORANGO COROTE 500 ML (CX 12 UN)', category: 'Bebidas', price: 47, image: 'https://i.imgur.com/4XwjS18.png' },
  { id: 144, name: 'DOLLY GUARANÁ PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 31, image: 'https://i.imgur.com/aAdDhss.png' },
  { id: 145, name: 'DOLLY LARANJA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 31, image: 'https://i.imgur.com/lhOIp4p.png' },
  { id: 146, name: 'DOLLY LIMÃO PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 31, image: 'https://i.imgur.com/8XJh3CD.png' },
  { id: 147, name: 'DOLLY UVA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 31, image: 'https://i.imgur.com/O3sIHYP.png' },
  { id: 148, name: 'ENERGÉTICO LONG ONE 2 L (PCT 6 UN)', category: 'Bebidas', price: 31, image: 'https://i.imgur.com/FWVW4KU.png' },
  { id: 149, name: 'ENERGÉTICO MONSTER ENERGY 473 ML (PCT 6 UN)', category: 'Bebidas', price: 53, image: 'https://i.imgur.com/shM029z.png' },
  { id: 150, name: 'ENERGÉTICO MONSTER ENERGY ABSOLUTELY ZERO 473 ML (PCT 6 UN)', category: 'Bebidas', price: 56, image: 'https://i.imgur.com/DhK5whd.png' },
  { id: 151, name: 'ENERGÉTICO MONSTER ENERGY MANGO LOCO 473 ML (PCT 6 UN)', category: 'Bebidas', price: 56, image: 'https://i.imgur.com/huIeeYb.png' },
  { id: 152, name: 'ENERGÉTICO MONSTER ENERGY PACIFIC PUNCH 473 ML (PCT 6 UN)', category: 'Bebidas', price: 56, image: 'https://i.imgur.com/uOSbkTz.png' },
  { id: 153, name: 'ENERGÉTICO MONSTER SEM AÇÚCAR ENERGY ULTRA 473 ML (PCT 6 UN)', category: 'Bebidas', price: 56, image: 'https://i.imgur.com/qwcJbo6.png' },
  { id: 154, name: 'ENERGÉTICO MONSTER SEM AÇÚCAR ENERGY ULTRA PARADISE 473 ML (PCT 6 UN)', category: 'Bebidas', price: 53, image: 'https://i.imgur.com/1T0gmwB.png' },
  { id: 155, name: 'ENERGÉTICO MONSTER SEM AÇÚCAR ENERGY ULTRA VIOLET 473 ML (PCT 6 UN)', category: 'Bebidas', price: 53, image: 'https://i.imgur.com/xBcfMw7.png' },
  { id: 156, name: 'ENERGÉTICO RED BULL 250 ML (CX 24 LT)', category: 'Bebidas', price: 191, image: 'https://i.imgur.com/X7QYk9G.png' },
  { id: 157, name: 'ENERGÉTICO RED BULL MELANCIA 250 ML (CX 24 LT)', category: 'Bebidas', price: 191, image: 'https://i.imgur.com/ihjQzWJ.png' },
  { id: 158, name: 'ENERGÉTICO RED BULL SUGAR FREE 250 ML (CX 24 LT)', category: 'Bebidas', price: 191, image: 'https://i.imgur.com/KveAIAZ.png' },
  { id: 159, name: 'ESPUMANTE BRANCO MOSCATEL AURORA 750 ML', category: 'Bebidas', price: 25, image: 'https://i.imgur.com/kwBGqTh.png' },
  { id: 160, name: 'ESPUMANTE BRANCO MOSCATEL SALTON 750 ML', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/xKvBDm0.png' },
  { id: 161, name: 'ESPUMANTE BRANCO NATURAL BRUT SALTON 750 ML', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/NbwxaH3.png' },
  { id: 162, name: 'ESPUMANTE CHANDON BABY BRUT ROSÉ 187 ML', category: 'Bebidas', price: 33, image: 'https://i.imgur.com/UOUhAZI.png' },
  { id: 163, name: 'ESPUMANTE CHANDON BRUT ROSÉ 750 ML', category: 'Bebidas', price: 85, image: 'https://i.imgur.com/1jSn4VL.png' },
  { id: 164, name: 'ESPUMANTE CHANDON PASSION ON ICE ROSÉ MEIO DOCE 750 ML', category: 'Bebidas', price: 85, image: 'https://i.imgur.com/TAA5umr.png' },
  { id: 165, name: 'ESPUMANTE CHANDON RÉSERVE BRUT 750 ML', category: 'Bebidas', price: 85, image: 'https://i.imgur.com/ommx528.png' },
  { id: 166, name: 'FANTA LARANJA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 43, image: 'https://i.imgur.com/5ReJnVO.png' },
  { id: 167, name: 'FANTA LARANJA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 51, image: 'https://i.imgur.com/j4TEd4Y.png' },
  { id: 168, name: 'FANTA LARANJA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 55, image: 'https://i.imgur.com/uyFcrge.png' },
  { id: 169, name: 'FANTA UVA LATA 350 ML (PCT 6 UN)', category: 'Bebidas', price: 21, image: 'https://i.imgur.com/Eb36m63.png' },
  { id: 170, name: 'FANTA UVA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 49, image: 'https://i.imgur.com/yiNHcUD.png' },
  { id: 171, name: 'GIN BEEFEATER 750 ML', category: 'Bebidas', price: 83, image: 'https://i.imgur.com/6df0UMK.png' },
  { id: 172, name: 'GIN BOMBAY SAPPHIRE 750 ML', category: 'Bebidas', price: 89, image: 'https://i.imgur.com/MWJIll6.png' },
  { id: 173, name: 'GIN GORDON´S 750 ML', category: 'Bebidas', price: 61, image: 'https://i.imgur.com/alcs9CJ.png' },
  { id: 174, name: 'GIN LONDON DRY DUBAR 960 ML', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/dOy7KlX.png' },
  { id: 175, name: 'GIN ROCK´S 1 L', category: 'Bebidas', price: 28, image: 'https://i.imgur.com/5RdOqD6.png' },
  { id: 176, name: 'GIN ROCK´S STRAWBERRY 1 L', category: 'Bebidas', price: 28, image: 'https://i.imgur.com/i6Pm343.png' },
  { id: 177, name: 'GIN SEAGERS 1 L', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/GpuRWlo.png' },
  { id: 178, name: 'GIN TANQUERAY 750 ML', category: 'Bebidas', price: 100, image: 'https://i.imgur.com/NRRLRRa.png' },
  { id: 179, name: 'GROSELHA CACHOEIRA 920 ML (CX 6 UN)', category: 'Bebidas', price: 74, image: 'https://i.imgur.com/8AdjNQa.png' },
  { id: 180, name: 'GUARANÁ ANTARCTICA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 40, image: 'https://i.imgur.com/P0CQ3Zl.png' },
  { id: 181, name: 'GUARANÁ ANTARCTICA MIÚDA PET 200 ML (PCT 12 UN)', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/ZE6W0mU.png' },
  { id: 182, name: 'GUARANÁ ANTARCTICA PEQUENO PET 1 L (PCT 6 UN)', category: 'Bebidas', price: 21, image: 'https://i.imgur.com/9vkUfR7.png' },
  { id: 183, name: 'GUARANÁ ANTARCTICA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 54, image: 'https://i.imgur.com/NQWjuu7.png' },
  { id: 184, name: 'GUARANÁ ANTARCTICA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 53, image: 'https://i.imgur.com/xxRz6rJ.png' },
  { id: 185, name: 'GUARANÁ ANTARCTICA SEM AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 40, image: 'https://i.imgur.com/D8W1N7a.png' },
  { id: 186, name: 'GUARANÁ ANTARCTICA SEM AÇÚCARES PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 54, image: 'https://i.imgur.com/TXIuTRO.png' },
  { id: 187, name: 'H2O LIMÃO SEM AÇÚCARES PET 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 44, image: 'https://i.imgur.com/mgbfTj8.png' },
  { id: 188, name: 'H2O LIMÃO SEM AÇÚCARES PET 500 ML (PCT 12 UN)', category: 'Bebidas', price: 50, image: 'https://i.imgur.com/WgdbcLm.png' },
  { id: 189, name: 'H2O LIMONETO SEM AÇÚCARES PET 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 46, image: 'https://i.imgur.com/ThoJihW.png' },
  { id: 190, name: 'H2O LIMONETO SEM AÇÚCARES PET 500 ML (PCT 12 UN)', category: 'Bebidas', price: 50, image: 'https://i.imgur.com/a5gJuZq.png' },
  { id: 191, name: 'ISOTÔNICO GATORADE LARANJA 500 ML (PCT 6 UN)', category: 'Bebidas', price: 34, image: 'https://i.imgur.com/xfKZK8Q.png' },
  { id: 192, name: 'ISOTÔNICO GATORADE LIMÃO 500 ML (PCT 6 UN)', category: 'Bebidas', price: 37, image: 'https://i.imgur.com/AyYU1J0.png' },
  { id: 193, name: 'ISOTÔNICO GATORADE MORANGO COM MARACUJÁ 500 ML (PCT 6 UN)', category: 'Bebidas', price: 34, image: 'https://i.imgur.com/gtuF9eG.png' },
  { id: 194, name: 'ISOTÔNICO GATORADE TANGERINA 500 ML (PCT 6 UN)', category: 'Bebidas', price: 34, image: 'https://i.imgur.com/9kv8WWM.png' },
  { id: 195, name: 'ISOTÔNICO GATORADE UVA 500 ML (PCT 6 UN)', category: 'Bebidas', price: 37, image: 'https://i.imgur.com/Lko6tf9.png' },
  { id: 196, name: 'ITUBAÍNA TUTTI FRUTTI RETRÔ LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 33, image: 'https://i.imgur.com/CrkOINB.png' },
  { id: 197, name: 'ITUBAÍNA TUTTI FRUTTI RETRÔ LONG NECK 355 ML (PCT 12 UN)', category: 'Bebidas', price: 37, image: 'https://i.imgur.com/Hs9tCiS.png' },
  { id: 198, name: 'LICOR 43 700 ML', category: 'Bebidas', price: 137, image: 'https://i.imgur.com/QRZ24SE.png' },
  { id: 199, name: 'LICOR 43 CHOCOLATE 700 ML', category: 'Bebidas', price: 172, image: 'https://i.imgur.com/ZJgtAiR.png' },
  { id: 200, name: 'LICOR ABSINTO HABITUÉ 750 ML', category: 'Bebidas', price: 16, image: 'https://i.imgur.com/4Y3jmIQ.png' },
  { id: 201, name: 'LICOR AMARULA CREAM 750 ML', category: 'Bebidas', price: 100, image: 'https://i.imgur.com/VG0O8sa.png' },
  { id: 202, name: 'LICOR BAILEYS 750 ML', category: 'Bebidas', price: 106, image: 'https://i.imgur.com/kp3vauk.png' },
  { id: 203, name: 'LICOR COINTREAU 700 ML', category: 'Bebidas', price: 116, image: 'https://i.imgur.com/8lCxuIn.png' },
  { id: 204, name: 'LICOR DRAMBUIE 750 ML', category: 'Bebidas', price: 164, image: 'https://i.imgur.com/1gZ3XLz.png' },
  { id: 205, name: 'LICOR JAGERMEISTER 700 ML', category: 'Bebidas', price: 103, image: 'https://i.imgur.com/THY5Sl2.png' },
  { id: 206, name: 'LICOR STOCK CREME DE CACAU 720 ML', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/IizXLqI.png' },
  { id: 207, name: 'LICOR STOCK CREME DE CASSIS 720 ML', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/Z0DqQsd.png' },
  { id: 208, name: 'LICOR STOCK CREME DE MENTA 720 ML', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/2GXjOLt.png' },
  { id: 209, name: 'LICOR STOCK CURAÇAU BLUE 720 ML', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/xUXuLNl.png' },
  { id: 210, name: 'LICOR STOCK CURAÇAU FINO 720 ML', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/PJnWL2L.png' },
  { id: 211, name: 'LICOR STOCK MARULA 720 ML', category: 'Bebidas', price: 53, image: 'https://i.imgur.com/6m2CVqT.png' },
  { id: 212, name: 'LICOR STOCK PÊSSEGO 720 ML', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/1kIeFI7.png' },
  { id: 213, name: 'PEPSI COLA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 39, image: 'https://i.imgur.com/ywCxBmN.png' },
  { id: 214, name: 'PEPSI COLA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 45, image: 'https://i.imgur.com/8fW7ddU.png' },
  { id: 215, name: 'REFRESCO ABACAXI CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 78, image: 'https://i.imgur.com/EZhhD5L.png' },
  { id: 216, name: 'REFRESCO ABACAXI QUALIMAX 1 KG (CX 10 PCT)', category: 'Bebidas', price: 115, image: 'https://i.imgur.com/fttfRDg.png' },
  { id: 217, name: 'REFRESCO CAJU QUALIMAX 1 KG (CX 10 PCT)', category: 'Bebidas', price: 115, image: 'https://i.imgur.com/2l39LMI.png' },
  { id: 218, name: 'REFRESCO LARANJA CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 78, image: 'https://i.imgur.com/32jkiGP.png' },
  { id: 219, name: 'REFRESCO LARANJA E ACEROLA QUALIMAX 1 KG (CX 10 PCT)', category: 'Bebidas', price: 115, image: 'https://i.imgur.com/LdkrQsI.png' },
  { id: 220, name: 'REFRESCO LARANJA QUALIMAX 1 KG (CX 10 PCT)', category: 'Bebidas', price: 115, image: 'https://i.imgur.com/68vHe9j.png' },
  { id: 221, name: 'REFRESCO LIMÃO CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 78, image: 'https://i.imgur.com/AnnxJX9.png' },
  { id: 222, name: 'REFRESCO LIMÃO QUALIMAX 1 KG (CX 10 PCT)', category: 'Bebidas', price: 115, image: 'https://i.imgur.com/oEL0sPz.png' },
  { id: 223, name: 'REFRESCO MANGA CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 78, image: 'https://i.imgur.com/3xzxkB3.png' },
  { id: 224, name: 'REFRESCO MANGA QUALIMAX 1 KG (CX 10 PCT)', category: 'Bebidas', price: 115, image: 'https://i.imgur.com/6tySJCT.png' },
  { id: 225, name: 'REFRESCO MARACUJA CAMP 150 G (CX 12 PCT)', category: 'Bebidas', price: 78, image: 'https://i.imgur.com/pin1Bh5.png' },
  { id: 226, name: 'REFRESCO MARACUJÁ QUALIMAX 1 KG (CX 10 PCT)', category: 'Bebidas', price: 115, image: 'https://i.imgur.com/8Nhx9Ya.png' },
  { id: 227, name: 'REFRESCO MORANGO QUALIMAX 1 KG (CX 10 PCT)', category: 'Bebidas', price: 115, image: 'https://i.imgur.com/mrN0fxD.png' },
  { id: 228, name: 'REFRESCO UVA QUALIMAX 1 KG (CX 10 PCT)', category: 'Bebidas', price: 115, image: 'https://i.imgur.com/kqikhVr.png' },
  { id: 229, name: 'RUM BACARDÍ BIG APPLE 980 ML', category: 'Bebidas', price: 39, image: 'https://i.imgur.com/v1VvKQq.png' },
  { id: 230, name: 'RUM BACARDÍ CARTA BLANCA SUPERIOR 980 ML', category: 'Bebidas', price: 34, image: 'https://i.imgur.com/BQJ1Q17.png' },
  { id: 231, name: 'RUM BACARDÍ CARTA ORO SUPERIOR 980 ML', category: 'Bebidas', price: 34, image: 'https://i.imgur.com/oN80bGu.png' },
  { id: 232, name: 'RUM MONTILLA CARTA BRANCA 1 L', category: 'Bebidas', price: 25, image: 'https://i.imgur.com/UBekUfq.png' },
  { id: 233, name: 'RUM MONTILLA CARTA OURO 1 L', category: 'Bebidas', price: 25, image: 'https://i.imgur.com/Uy6p1cw.png' },
  { id: 234, name: 'SAQUÊ SECO AZUMA KIRIN 600 ML', category: 'Bebidas', price: 15, image: 'https://i.imgur.com/luE9tbN.png' },
  { id: 235, name: 'SAQUÊ SECO DOURADO AZUMA KIRIN 740 ML', category: 'Bebidas', price: 39, image: 'https://i.imgur.com/LWwdj8D.png' },
  { id: 236, name: 'SAQUÊ SECO DOURADO SAGAE 750 ML', category: 'Bebidas', price: 14, image: 'https://i.imgur.com/4Aqncfv.png' },
  { id: 237, name: 'SAQUÊ SECO SENSHI 720 ML', category: 'Bebidas', price: 14, image: 'https://i.imgur.com/aYc3Lqw.png' },
  { id: 238, name: 'SAQUÊ SECO SOFT AZUMA KIRIN 740 ML', category: 'Bebidas', price: 24, image: 'https://i.imgur.com/z1Oelt1.png' },
  { id: 239, name: 'SCHWEPPES CITRUS LATA 350 ML (PCT 6 LT)', category: 'Bebidas', price: 21, image: 'https://i.imgur.com/KgHLyfy.png' },
  { id: 240, name: 'SCHWEPPES CITRUS LEVE EM AÇÚCARES LATA 350 ML (PCT 6 LT)', category: 'Bebidas', price: 21, image: 'https://i.imgur.com/F6trlNs.png' },
  { id: 241, name: 'SODA ANTARCTICA LIMONADA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/2gxTI9r.png' },
  { id: 242, name: 'SODA ANTARCTICA LIMONADA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 49, image: 'https://i.imgur.com/W7dFwbW.png' },
  { id: 243, name: 'SODA ANTARCTICA LIMONADA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 51, image: 'https://i.imgur.com/LZiwTB9.png' },
  { id: 244, name: 'SODA ANTARCTICA LIMONADA ZERO AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 37, image: 'https://i.imgur.com/k0swWts.png' },
  { id: 245, name: 'SPRITE LATA 350 ML (PCT 6 UN)', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/IpxT26C.png' },
  { id: 246, name: 'SPRITE LEMON FRESH PET 510 ML (PCT 12 UN)', category: 'Bebidas', price: 34, image: 'https://i.imgur.com/WZ8vT5P.png' },
  { id: 247, name: 'SPRITE PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 53, image: 'https://i.imgur.com/lRT43O6.png' },
  { id: 248, name: 'STEINHAEGER BECOSA 980 ML', category: 'Bebidas', price: 31, image: 'https://i.imgur.com/EePnb5t.png' },
  { id: 249, name: 'SUCO DE TOMATE RAIOLA 1 L', category: 'Bebidas', price: 26, image: 'https://i.imgur.com/jgt6Ryc.png' },
  { id: 250, name: 'SUCO DE TOMATE SUPERBOM 1 L', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/05nvQUY.png' },
  { id: 251, name: 'SUCO DE UVA TINTO INTEGRAL TETRA PACK AURORA 1,5 L (CX 6 UN)', category: 'Bebidas', price: 121, image: 'https://i.imgur.com/9Ow9Exw.png' },
  { id: 252, name: 'SUCO DEL VALLE ABACAXI TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 50, image: 'https://i.imgur.com/s0cmP9R.png' },
  { id: 253, name: 'SUCO DEL VALLE CAJU SEM ADIÇÃO DE AÇÚCAR TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 49, image: 'https://i.imgur.com/EKbHCAH.png' },
  { id: 254, name: 'SUCO DEL VALLE GOIABA SEM ADIÇÃO DE AÇÚCAR LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/RQlw1It.png' },
  { id: 255, name: 'SUCO DEL VALLE LARANJA TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 58, image: 'https://i.imgur.com/AyekaBk.png' },
  { id: 256, name: 'SUCO DEL VALLE MANGA LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/yzrpMfL.png' },
  { id: 257, name: 'SUCO DEL VALLE MARACUJÁ LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/hdPREhV.png' },
  { id: 258, name: 'SUCO DEL VALLE PÊSSEGO LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/BEoDePZ.png' },
  { id: 259, name: 'SUCO DEL VALLE UVA LATA 290 ML (PCT 6 LT)', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/rv50AIb.png' },
  { id: 260, name: 'SUCO DEL VALLE UVA TETRA PACK 1 L (CX 6 UN)', category: 'Bebidas', price: 58, image: 'https://i.imgur.com/9Q3fGng.png' },
  { id: 261, name: 'SUCO GUARAVITON AÇAÍ 500 ML (PCT 12 UN)', category: 'Bebidas', price: 30, image: 'https://i.imgur.com/lMvumTU.png' },
  { id: 262, name: 'SUCO MAGUARY ABACAXI 500 ML (PCT 12 UN)', category: 'Bebidas', price: 77, image: 'https://i.imgur.com/mM74zku.png' },
  { id: 263, name: 'SUCO MAGUARY GOIABA 500 ML (PCT 12 UN)', category: 'Bebidas', price: 68, image: 'https://i.imgur.com/B9CQRP1.png' },
  { id: 264, name: 'SUCO MAGUARY LARANJA LATA 335 ML (PCT 6 LT)', category: 'Bebidas', price: 24, image: 'https://i.imgur.com/NMjfmnp.png' },
  { id: 265, name: 'SUCO MAGUARY LARANJA TETRA PACK 1 L (CX 12 UN)', category: 'Bebidas', price: 65, image: 'https://i.imgur.com/YOcvLD3.png' },
  { id: 266, name: 'SUCO MAGUARY MANGA 500 ML (PCT 12 UN)', category: 'Bebidas', price: 73, image: 'https://i.imgur.com/3HWjnHM.png' },
  { id: 267, name: 'SUCO MAGUARY MARACUJÁ 500 ML (PCT 12 UN)', category: 'Bebidas', price: 115, image: 'https://i.imgur.com/IMi4Jaz.png' },
  { id: 268, name: 'SUCO MAGUARY MARACUJÁ LATA 335 ML (PCT 6 LT)', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/OeQqQMM.png' },
  { id: 269, name: 'SUCO MAGUARY MARACUJÁ TETRA PACK 1 L (CX 12 UN)', category: 'Bebidas', price: 66, image: 'https://i.imgur.com/wYdnqWk.png' },
  { id: 270, name: 'SUCO MAGUARY MORANGO LATA 335 ML (PCT 6 LT)', category: 'Bebidas', price: 22, image: 'https://i.imgur.com/GnUifDn.png' },
  { id: 271, name: 'SUCO MAGUARY UVA 500 ML (PCT 12 UN)', category: 'Bebidas', price: 73, image: 'https://i.imgur.com/XLgF5Lq.png' },
  { id: 272, name: 'SUCO MAGUARY UVA LATA 335 ML (PCT 6 LT)', category: 'Bebidas', price: 24, image: 'https://i.imgur.com/ThOQSAq.png' },
  { id: 273, name: 'SUCO MAGUARY UVA TETRA PACK 1 L (CX 12 UN)', category: 'Bebidas', price: 72, image: 'https://i.imgur.com/CxfSQwD.png' },
  { id: 274, name: 'SUCO PEQUENO MAGUARY MAÇÃ 200 ML (CX 27 UN)', category: 'Bebidas', price: 48, image: 'https://i.imgur.com/X1cdcro.png' },
  { id: 275, name: 'SUCO PEQUENO MAGUARY UVA 200 ML (CX 27 UN)', category: 'Bebidas', price: 48, image: 'https://i.imgur.com/o9w6Byz.png' },
  { id: 276, name: 'SUKITA LARANJA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 39, image: 'https://i.imgur.com/uHsproY.png' },
  { id: 277, name: 'SUKITA LARANJA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 36, image: 'https://i.imgur.com/AKSYkOw.png' },
  { id: 278, name: 'SUKITA LIMÃO PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 36, image: 'https://i.imgur.com/EIkhTff.png' },
  { id: 279, name: 'SUKITA TUBAÍNA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 36, image: 'https://i.imgur.com/aQShp31.png' },
  { id: 280, name: 'TEQUILA JOSE CUERVO ESPECIAL PRATA 750 ML (CX 12 UN)', category: 'Bebidas', price: 100, image: 'https://i.imgur.com/oUVvquf.png' },
  { id: 281, name: 'TEQUILA JOSE CUERVO ESPECIAL REPOSADO OURO 750 ML (CX 12 UN)', category: 'Bebidas', price: 100, image: 'https://i.imgur.com/jeKWW3U.png' },
  { id: 282, name: 'TUBAÍNA CAMPOS TUTTI FRUTTI PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/WNoODyZ.png' },
  { id: 283, name: 'VINHO ARGENTINO TINTO MEIO SECO MALBEC RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/F9GqjDF.png' },
  { id: 284, name: 'VINHO ARGENTINO TINTO SECO CABERNET SAUVIGNON BENJAMIN NIETO SENETINER 750 ML', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/E9641NQ.png' },
  { id: 285, name: 'VINHO ARGENTINO TINTO SECO GATO NEGRO MALBEC SAN PEDRO 750 ML', category: 'Bebidas', price: 28, image: 'https://i.imgur.com/zirdW0P.png' },
  { id: 286, name: 'VINHO CHILENO BRANCO SECO CHARDONNAY RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/g9CZJLc.png' },
  { id: 287, name: 'VINHO CHILENO BRANCO SECO FINO SAUVIGNON BLANC CHILANO 750 ML', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/owIp7Nx.png' },
  { id: 288, name: 'VINHO CHILENO BRANCO SECO SAUVIGNON BLANC RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/a7vJedz.png' },
  { id: 289, name: 'VINHO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON MERLOT RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/arjVBDL.png' },
  { id: 290, name: 'VINHO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/I2KzRC5.png' },
  { id: 291, name: 'VINHO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/pmC1ifB.png' },
  { id: 292, name: 'VINHO CHILENO TINTO MEIO SECO CARMENÉRE RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/8rZ7chL.png' },
  { id: 293, name: 'VINHO CHILENO TINTO MEIO SECO CARMENÉRE RESERVADO SANTA HELENA 750 ML', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/kfw8gkT.png' },
  { id: 294, name: 'VINHO CHILENO TINTO MEIO SECO GATO NEGRO CABERNET SAUVIGNON SAN PEDRO 750 ML', category: 'Bebidas', price: 28, image: 'https://i.imgur.com/rS3hvho.png' },
  { id: 295, name: 'VINHO CHILENO TINTO MEIO SECO GATO NEGRO MERLOT SAN PEDRO 750 ML', category: 'Bebidas', price: 28, image: 'https://i.imgur.com/E62x5V6.png' },
  { id: 296, name: 'VINHO CHILENO TINTO MEIO SECO MERLOT RESERVADO CONCHA Y TORO 750 ML', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/z154E3m.png' },
  { id: 297, name: 'VINHO CHILENO TINTO SECO CABERNET SAUVIGNON CASILLERO DEL DIABLO 750 ML', category: 'Bebidas', price: 41, image: 'https://i.imgur.com/muoEyM2.png' },
  { id: 298, name: 'VINHO CHILENO TINTO SECO FINO CABERNET SAUVIGNON CHILANO 750 ML', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/r23kHQ5.png' },
  { id: 299, name: 'VINHO CHILENO TINTO SECO FINO CARMENÉRE CHILANO 750 ML', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/7VfNhwx.png' },
  { id: 300, name: 'VINHO CHILENO TINTO SECO FINO MALBEC CHILANO 750 ML', category: 'Bebidas', price: 20, image: 'https://i.imgur.com/3DAWmyN.png' },
  { id: 301, name: 'VINHO CHILENO TINTO SECO MALBEC CASILLERO DEL DIABLO 750 ML', category: 'Bebidas', price: 41, image: 'https://i.imgur.com/dVFLBxV.png' },
  { id: 302, name: 'VINHO ESPANHOL TINTO SECO FINO ORO TEMPRANILLO PATA NEGRA 750 ML', category: 'Bebidas', price: 38, image: 'https://i.imgur.com/i5dk82Y.png' },
  { id: 303, name: 'VINHO GRANDE NACIONAL TINTO SECO SANTOMÉ 1 L', category: 'Bebidas', price: 15, image: 'https://i.imgur.com/QltyKMJ.png' },
  { id: 304, name: 'VINHO GRANDE NACIONAL TINTO SUAVE SANTOMÉ 1 L', category: 'Bebidas', price: 15, image: 'https://i.imgur.com/Rf0YjSk.png' },
  { id: 305, name: 'VINHO ITALIANO BRANCO SUAVE FRISANTE LAMBRUSCO "CELLA" 750 ML', category: 'Bebidas', price: 40, image: 'https://i.imgur.com/FIiSKeS.png' },
  { id: 306, name: 'VINHO NACIONAL BRANCO "SECO" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 55, image: 'https://i.imgur.com/5tAiOz6.png' },
  { id: 307, name: 'VINHO NACIONAL BRANCO "SUAVE" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 55, image: 'https://i.imgur.com/s2Z0tmX.png' },
  { id: 308, name: 'VINHO NACIONAL BRANCO SECO ALMADÉN RIESLING 750 ML', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/t1qleCN.png' },
  { id: 309, name: 'VINHO NACIONAL BRANCO SECO RANDON 4,6 L (CX 2 GL)', category: 'Bebidas', price: 97, image: 'https://i.imgur.com/F1Wd5Ny.png' },
  { id: 310, name: 'VINHO NACIONAL FINO BRANCO SECO CHENIN BLANC E MUSCAT ALMADÉN 5 L', category: 'Bebidas', price: 60, image: 'https://i.imgur.com/IDSJcp0.png' },
  { id: 311, name: 'VINHO NACIONAL FINO TINTO SECO TEMPRANILLO E SHIRAZ ALMADÉN 5 L', category: 'Bebidas', price: 64, image: 'https://i.imgur.com/XayyFOJ.png' },
  { id: 312, name: 'VINHO NACIONAL TINTO "SECO" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 55, image: 'https://i.imgur.com/GYIH42G.png' },
  { id: 313, name: 'VINHO NACIONAL TINTO "SUAVE" CHALISE 750 ML (CX 6 UN)', category: 'Bebidas', price: 55, image: 'https://i.imgur.com/4lbxAan.png' },
  { id: 314, name: 'VINHO NACIONAL TINTO SECO CABERNET SAUVIGNON ALMADÉN 750 ML', category: 'Bebidas', price: 27, image: 'https://i.imgur.com/cG4kAzg.png' },
  { id: 315, name: 'VINHO NACIONAL TINTO SECO CABERNET SAUVIGNON MERLOT SELEÇÃO MIOLO 750 ML', category: 'Bebidas', price: 33, image: 'https://i.imgur.com/9fPsQum.png' },
  { id: 316, name: 'VINHO NACIONAL TINTO SECO JURUBEBA LEÃO DO NORTE 600 ML', category: 'Bebidas', price: 13, image: 'https://i.imgur.com/OF0f78k.png' },
  { id: 317, name: 'VINHO NACIONAL TINTO SECO RANDON 4,6 L (CX 2 GL)', category: 'Bebidas', price: 97, image: 'https://i.imgur.com/XXLEr9i.png' },
  { id: 318, name: 'VINHO NACIONAL TINTO SUAVE CABERNET ALMADÉN 750 ML', category: 'Bebidas', price: 21, image: 'https://i.imgur.com/GoO9kU6.png' },
  { id: 319, name: 'VINHO NACIONAL TINTO SUAVE COUNTRY WINE 750 ML', category: 'Bebidas', price: 12, image: 'https://i.imgur.com/eDTDDsp.png' },
  { id: 320, name: 'VINHO NACIONAL TINTO SUAVE RANDON 4,6 L (CX 2 GL)', category: 'Bebidas', price: 97, image: 'https://i.imgur.com/BMlit53.png' },
  { id: 321, name: 'VINHO NACIONAL TINTO SUAVE SANTOMÉ 750 ML', category: 'Bebidas', price: 11, image: 'https://i.imgur.com/m5P1ktV.png' },
  { id: 322, name: 'VINHO PEQUENO CHILENO TINTO MEIO SECO CABERNET SAUVIGNON RESERVADO SANTA HELENA 375 ML', category: 'Bebidas', price: 18, image: 'https://i.imgur.com/kAUOXvr.png' },
  { id: 323, name: 'VINHO PEQUENO PORTUGUÊS TINTO SECO PERIQUITA 375 ML', category: 'Bebidas', price: 32, image: 'https://i.imgur.com/KVklwxY.png' },
  { id: 324, name: 'VINHO PORTUGUÊS TINTO SECO CASAL GARCIA 750 ML', category: 'Bebidas', price: 47, image: 'https://i.imgur.com/I0iF5Yz.png' },
  { id: 325, name: 'VINHO PORTUGUÊS TINTO SECO PERIQUITA 750 ML', category: 'Bebidas', price: 51, image: 'https://i.imgur.com/XIdUoxF.png' },
  { id: 326, name: 'VINHO PORTUGUÊS VERDE MEIO SECO CASAL GARCIA 750 ML', category: 'Bebidas', price: 47, image: 'https://i.imgur.com/Avj6Hsn.png' },
  { id: 327, name: 'VODKA ABSOLUT 1 L', category: 'Bebidas', price: 73, image: 'https://i.imgur.com/UN9QxZ9.png' },
  { id: 328, name: 'VODKA ASKOV FRUTAS VERMELHAS 900 ML', category: 'Bebidas', price: 14, image: 'https://i.imgur.com/fanaQxe.png' },
  { id: 329, name: 'VODKA ASKOV MARACUJÁ 900 ML', category: 'Bebidas', price: 14, image: 'https://i.imgur.com/kgjmHed.png' },
  { id: 330, name: 'VODKA ASKOV TRADICIONAL 900 ML', category: 'Bebidas', price: 14, image: 'https://i.imgur.com/bwqDBVm.png' },
  { id: 331, name: 'VODKA BALALAIKA 1 L', category: 'Bebidas', price: 13, image: 'https://i.imgur.com/qawFpyA.png' },
  { id: 332, name: 'VODKA BELVEDERE 700 ML', category: 'Bebidas', price: 113, image: 'https://i.imgur.com/EsoI3u2.png' },
  { id: 333, name: 'VODKA CIROC 750 ML', category: 'Bebidas', price: 128, image: 'https://i.imgur.com/ZmARYuX.png' },
  { id: 334, name: 'VODKA CIROC RED BERRY 750 ML', category: 'Bebidas', price: 170, image: 'https://i.imgur.com/b02eBM4.png' },
  { id: 335, name: 'VODKA KETEL ONE 1 L', category: 'Bebidas', price: 81, image: 'https://i.imgur.com/yxijXUc.png' },
  { id: 336, name: 'VODKA ORLOFF 1 L', category: 'Bebidas', price: 25, image: 'https://i.imgur.com/nx41D4y.png' },
  { id: 337, name: 'VODKA PEQUENA SMIRNOFF 600 ML', category: 'Bebidas', price: 23, image: 'https://i.imgur.com/GnWxVJs.png' },
  { id: 338, name: 'VODKA SKYY 980 ML', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/GoJv5wG.png' },
  { id: 339, name: 'VODKA SMIRNOFF 998 ML', category: 'Bebidas', price: 31, image: 'https://i.imgur.com/9209L4f.png' },
  { id: 340, name: 'VODKA SMIRNOFF ICE LIMÃO LONG NECK 275 ML (PCT 24 UN)', category: 'Bebidas', price: 170, image: 'https://i.imgur.com/6QO1F7D.png' },
  { id: 341, name: 'WHISKY BALLANTINES 12 ANOS 1 L', category: 'Bebidas', price: 131, image: 'https://i.imgur.com/uMtCYII.png' },
  { id: 342, name: 'WHISKY BALLANTINES FINEST 8 ANOS 1 L', category: 'Bebidas', price: 71, image: 'https://i.imgur.com/5WnMc01.png' },
  { id: 343, name: 'WHISKY BELL´S 700 ML', category: 'Bebidas', price: 35, image: 'https://i.imgur.com/NCswi6l.png' },
  { id: 344, name: 'WHISKY BLACK WHITE 1 L', category: 'Bebidas', price: 78, image: 'https://i.imgur.com/27YyrUh.png' },
  { id: 345, name: 'WHISKY BUCHANAN´S 12 ANOS 1 L', category: 'Bebidas', price: 171, image: 'https://i.imgur.com/Cen9UaX.png' },
  { id: 346, name: 'WHISKY CHIVAS REGAL 12 ANOS 1 L', category: 'Bebidas', price: 113, image: 'https://i.imgur.com/dZ2o9VB.png' },
  { id: 347, name: 'WHISKY JACK DANIEL´S TENNESSEE FIRE 1 L', category: 'Bebidas', price: 134, image: 'https://i.imgur.com/D0wEl7Y.png' },
  { id: 348, name: 'WHISKY JACK DANIEL´S TENNESSEE HONEY 1 L', category: 'Bebidas', price: 138, image: 'https://i.imgur.com/jDqEJAL.png' },
  { id: 349, name: 'WHISKY JACK DANIEL´S TENNESSEE OLD No.7 1 L', category: 'Bebidas', price: 152, image: 'https://i.imgur.com/6bNFOJD.png' },
  { id: 350, name: 'WHISKY JAMESON 750 ML', category: 'Bebidas', price: 114, image: 'https://i.imgur.com/FquHmxr.png' },
  { id: 351, name: 'WHISKY JIM BEAM 1 L', category: 'Bebidas', price: 101, image: 'https://i.imgur.com/4XWSGqj.png' },
  { id: 352, name: 'WHISKY JOHNNIE WALKER BLACK LABEL 12 ANOS 1 L', category: 'Bebidas', price: 161, image: 'https://i.imgur.com/zGTHglJ.png' },
  { id: 353, name: 'WHISKY JOHNNIE WALKER BLUE LABEL 750 ML', category: 'Bebidas', price: 1009, image: 'https://i.imgur.com/INPxSsa.png' },
  { id: 354, name: 'WHISKY JOHNNIE WALKER DOUBLE BLACK 1 L', category: 'Bebidas', price: 196, image: 'https://i.imgur.com/vlemYPB.png' },
  { id: 355, name: 'WHISKY JOHNNIE WALKER GOLD LABEL RESERVE 750 ML', category: 'Bebidas', price: 226, image: 'https://i.imgur.com/H6dUMNJ.png' },
  { id: 356, name: 'WHISKY JOHNNIE WALKER RED LABEL 1 L', category: 'Bebidas', price: 84, image: 'https://i.imgur.com/ewkP00y.png' },
  { id: 357, name: 'WHISKY NATU NOBILIS 1 L', category: 'Bebidas', price: 36, image: 'https://i.imgur.com/doUn3b7.png' },
  { id: 358, name: 'WHISKY OLD EIGHT 900 ML', category: 'Bebidas', price: 29, image: 'https://i.imgur.com/jJD0hXU.png' },
  { id: 359, name: 'WHISKY OLD PARR 12 ANOS 1 L', category: 'Bebidas', price: 140, image: 'https://i.imgur.com/yYVicOK.png' },
  { id: 360, name: 'WHISKY PASSPORT 1 L', category: 'Bebidas', price: 47, image: 'https://i.imgur.com/s5btt6Y.png' },
  { id: 361, name: 'WHISKY WHITE HORSE 1 L', category: 'Bebidas', price: 63, image: 'https://i.imgur.com/dZ9JEMw.png' },
  { id: 362, name: 'XAROPE MONIN AMORA 700 ML', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/QTVEyyA.png' },
  { id: 363, name: 'XAROPE MONIN CURAÇAU BLUE 700 ML', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/xdFVuCl.png' },
  { id: 364, name: 'XAROPE MONIN FRAMBOESA 700 ML', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/mk7Hr9o.png' },
  { id: 365, name: 'XAROPE MONIN GENGIBRE 700 ML', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/fbkqDaK.png' },
  { id: 366, name: 'XAROPE MONIN GRENADINE 700 ML', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/AOeAZf8.png' },
  { id: 367, name: 'XAROPE MONIN LIMÃO SICILIANO 700 ML', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/9eZcYDs.png' },
  { id: 368, name: 'XAROPE MONIN MAÇÃ VERDE 700 ML', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/QNB6ZWt.png' },
  { id: 369, name: 'XAROPE MONIN MARACUJÁ 700 ML', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/0ubxvVz.png' },
  { id: 370, name: 'XAROPE MONIN MORANGO 700 ML', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/uQOucGW.png' },
  { id: 371, name: 'XAROPE MONIN TANGERINA 700 ML', category: 'Bebidas', price: 59, image: 'https://i.imgur.com/MkTZ7Es.png' },
  { id: 372, name: 'ERVILHA BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 75, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 373, name: 'ERVILHA GRANDE BONARE GOIÁS VERDE 1,7 KG', category: 'Conservas/Enlatados', price: 21, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 374, name: 'ERVILHA GRANDE QUERO 1,7 KG', category: 'Conservas/Enlatados', price: 23, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 375, name: 'ERVILHA PEQUENA DA TERRINHA 500 G', category: 'Conservas/Enlatados', price: 9, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 376, name: 'ERVILHA QUERO 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 94, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 377, name: 'EXTRATO DE TOMATE AJINOMOTO 2 KG', category: 'Conservas/Enlatados', price: 27, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 378, name: 'EXTRATO DE TOMATE BONARE GOIÁS VERDE 1,7 KG', category: 'Conservas/Enlatados', price: 12, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 379, name: 'EXTRATO DE TOMATE BONARE GOIÁS VERDE 4 KG', category: 'Conservas/Enlatados', price: 30, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 380, name: 'EXTRATO DE TOMATE BONARE GOURMET SUPER CONCENTRADO GOIÁS VERDE 4 KG', category: 'Conservas/Enlatados', price: 39, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 381, name: 'EXTRATO DE TOMATE EKMA 1,7 KG', category: 'Conservas/Enlatados', price: 16, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 382, name: 'EXTRATO DE TOMATE ELEFANTE 1,04 KG (CX 12 UN)', category: 'Conservas/Enlatados', price: 196, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 383, name: 'EXTRATO DE TOMATE ELEFANTE 1,7 KG', category: 'Conservas/Enlatados', price: 32, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 384, name: 'EXTRATO DE TOMATE QUERO 1,020 KG (CX 12 BAG)', category: 'Conservas/Enlatados', price: 100, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 385, name: 'MILHO BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 76, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 386, name: 'MILHO GRANDE BONARE GOIÁS VERDE 1,7 KG', category: 'Conservas/Enlatados', price: 22, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 387, name: 'MILHO GRANDE FUGINI 1,7 KG', category: 'Conservas/Enlatados', price: 23, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 388, name: 'MILHO GRANDE PREDILECTA 1,7 KG', category: 'Conservas/Enlatados', price: 21, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 389, name: 'MILHO GRANDE QUERO 1,7 KG', category: 'Conservas/Enlatados', price: 24, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 390, name: 'MILHO QUERO 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 102, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 391, name: 'MOLHO ALHO CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 13, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 392, name: 'MOLHO BACONNAISE JUNIOR 1,1 KG', category: 'Conservas/Enlatados', price: 44, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 393, name: 'MOLHO BARBECUE CEPÊRA 1,01 KG', category: 'Conservas/Enlatados', price: 15, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 394, name: 'MOLHO BARBECUE CEPÊRA 3,5 KG', category: 'Conservas/Enlatados', price: 41, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 395, name: 'MOLHO BARBECUE EKMA 3,5 KG', category: 'Conservas/Enlatados', price: 28, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 396, name: 'MOLHO BARBECUE HEINZ 2 KG', category: 'Conservas/Enlatados', price: 42, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 397, name: 'MOLHO BARBECUE SACHÊ CEPÊRA 7 G (CX 175 UN)', category: 'Conservas/Enlatados', price: 29, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 398, name: 'MOLHO BARBECUE SACHÊ FUGINI 7 G (CX 144 UN)', category: 'Conservas/Enlatados', price: 15, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 399, name: 'MOLHO BECHAMEL AJINOMOTO 1 KG', category: 'Conservas/Enlatados', price: 32, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 400, name: 'MOLHO BILLY & JACK ORIGINAL KISABOR 1,01 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 94, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 401, name: 'MOLHO BILLY & JACK TASTY KISABOR 1,01 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 89, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 402, name: 'MOLHO CHEDDAR CORONATA 1,02 KG', category: 'Conservas/Enlatados', price: 31, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 403, name: 'MOLHO CHEDDAR POLENGHI 1,5 KG', category: 'Conservas/Enlatados', price: 48, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 404, name: 'MOLHO CHEDDAR SCHREIBER 1,5 KG', category: 'Conservas/Enlatados', price: 40, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 405, name: 'MOLHO CHEDDAR VIGOR 1,5 KG', category: 'Conservas/Enlatados', price: 53, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 406, name: 'MOLHO CHIPOTLE JUNIOR 1,01 KG', category: 'Conservas/Enlatados', price: 42, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 407, name: 'MOLHO DE PIMENTA VERMELHA CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 10, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 408, name: 'MOLHO DE PIMENTA VERMELHA EKMA 1,01 L', category: 'Conservas/Enlatados', price: 9, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 409, name: 'MOLHO DE PIMENTA VERMELHA KISABOR 150 ML (CX 24 UN)', category: 'Conservas/Enlatados', price: 57, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 410, name: 'MOLHO DE PIMENTA VERMELHA MC ILHENNY TABASCO 60 ML (CX 12 VD)', category: 'Conservas/Enlatados', price: 170, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 411, name: 'MOLHO DE PIMENTA VERMELHA SACHÊ CEPÊRA 5 G (CX 175 UN)', category: 'Conservas/Enlatados', price: 27, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 412, name: 'MOLHO DE PIMENTA VERMELHA SACHÊ PREDILECTA 3 G (CX 144 UN)', category: 'Conservas/Enlatados', price: 15, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 413, name: 'MOLHO DE TOMATE PIZZA BONARE GOIÁS VERDE 1,7 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 58, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 414, name: 'MOLHO DE TOMATE PIZZA CEPÊRA MAMMA D ORO 1,7 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 104, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 415, name: 'MOLHO DE TOMATE REFOGADO TRADICIONAL BONARE GOURMET GOIÁS VERDE 1,02 KG (CX 12 BAG)', category: 'Conservas/Enlatados', price: 92, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 416, name: 'MOLHO DE TOMATE REFOGADO TRADICIONAL EKMA 1,7 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 60, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 417, name: 'MOLHO DE TOMATE TRADICIONAL BONARE GOIÁS VERDE 1,7 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 57, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 418, name: 'MOLHO DE TOMATE TRADICIONAL FUGINI 1,7 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 55, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 419, name: 'MOLHO DE TOMATE TRADICIONAL HEINZ 1,02 KG (CX 12 BAG)', category: 'Conservas/Enlatados', price: 82, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 420, name: 'MOLHO DE TOMATE TRADICIONAL MAMMA D ORO CEPÊRA 1,7 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 94, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 421, name: 'MOLHO DE TOMATE TRADICIONAL POMAROLA 1,7 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 80, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 422, name: 'MOLHO DE TOMATE TRADICIONAL QUERO BAG 2 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 53, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 423, name: 'MOLHO DEMI GLACE AJINOMOTO 1 KG', category: 'Conservas/Enlatados', price: 57, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 424, name: 'MOLHO DEMI GLACE JUNIOR 500 G', category: 'Conservas/Enlatados', price: 37, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 425, name: 'MOLHO INGLÊS CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 8, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 426, name: 'MOLHO ITALIAN SACHÊ JUNIOR 18 G (CX 180 UN)', category: 'Conservas/Enlatados', price: 103, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 427, name: 'MOLHO ITALIANO SACHÊ LANCHERO 8 ML (CX 152 UN)', category: 'Conservas/Enlatados', price: 20, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 428, name: 'MOLHO PARA PIZZA EKMA 1,7 KG (CX 6 BAG)', category: 'Conservas/Enlatados', price: 60, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 429, name: 'MOLHO PIMENTA SACHÊ EKMA 3 ML (CX 174 UN)', category: 'Conservas/Enlatados', price: 16, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 430, name: 'MOLHO RANCH HAGRA FOODS 1,01 KG', category: 'Conservas/Enlatados', price: 34, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 431, name: 'MOLHO SALADA CAESAR CASTELO 236 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 88, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 432, name: 'MOLHO SALADA CAESAR KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 59, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 433, name: 'MOLHO SALADA FRENCH ROSÉ SACHÊ EKMA 18 G (CX 42 UN)', category: 'Conservas/Enlatados', price: 22, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 434, name: 'MOLHO SALADA ITALIAN SACHÊ EKMA 18 G (CX 42 UN)', category: 'Conservas/Enlatados', price: 22, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 435, name: 'MOLHO SALADA ITALIANO CASTELO 236 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 88, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 436, name: 'MOLHO SALADA ITALIANO KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 59, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 437, name: 'MOLHO SALADA LIMÃO CASTELO 236 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 88, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 438, name: 'MOLHO SALADA LIMÃO KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 59, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 439, name: 'MOLHO SALADA PARMESÃO KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 60, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 440, name: 'MOLHO SALADA ROSE KISABOR 240 ML (CX 12 UN)', category: 'Conservas/Enlatados', price: 59, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 441, name: 'MOLHO SHOYU CEPÊRA 1,01 L', category: 'Conservas/Enlatados', price: 12, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 442, name: 'MOLHO SHOYU EKMA 1,01 L', category: 'Conservas/Enlatados', price: 8, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 443, name: 'MOLHO SHOYU GRANDE EKMA 3,1 L', category: 'Conservas/Enlatados', price: 22, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 444, name: 'MOLHO SHOYU MÉDIO MITSUWA 3,1 L', category: 'Conservas/Enlatados', price: 28, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 445, name: 'MOLHO SHOYU PONZAN 5 L', category: 'Conservas/Enlatados', price: 25, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 446, name: 'MOLHO SHOYU PREMIUM CEPÊRA 5 L', category: 'Conservas/Enlatados', price: 60, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 447, name: 'MOLHO SHOYU PREMIUM MITSUWA 900 ML', category: 'Conservas/Enlatados', price: 11, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 448, name: 'MOLHO SHOYU SACHÊ EKMA 8 ML (CX 96 UN)', category: 'Conservas/Enlatados', price: 18, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 449, name: 'MOLHO SHOYU SATIS AJINOMOTO 5 L', category: 'Conservas/Enlatados', price: 87, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 450, name: 'MOLHO SHOYU SUAVE MITSUWA 900 ML', category: 'Conservas/Enlatados', price: 11, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 451, name: 'MOLHO SMOKE BLEND HAGRA FOODS 1,01 KG', category: 'Conservas/Enlatados', price: 35, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 452, name: 'MOLHO TÁRTARO FOOD SERVICE KISABOR 1,01', category: 'Conservas/Enlatados', price: 17, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 453, name: 'POLPA DE TOMATE QUERO 1,050 KG (CX 12 UN)', category: 'Conservas/Enlatados', price: 97, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 454, name: 'SELETA DE LEGUMES BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 96, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 455, name: 'TOMATE PELADO INTEIRO ARCO BELLO 2,5 KG', category: 'Conservas/Enlatados', price: 36, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 456, name: 'TOMATE PELADO INTEIRO OLÉ 2,5 KG', category: 'Conservas/Enlatados', price: 29, image: 'https://i.imgur.com/Ji9OX4y.png' },
  { id: 457, name: 'TOMATE PELADO INTEIRO PREDILECTA 2,5 KG', category: 'Conservas/Enlatados', price: 25, image: 'https://i.imgur.com/Ji9OX4y.png' },
  // Continue a adicionar seus produtos
];

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const productsPerPage = 20;

  // Função para adicionar ao carrinho
  const addToCart = (product) => {
    if (product.price > 0) { // Não adiciona produtos indisponíveis
      setCart([...cart, product]);
      setTotal(total + product.price);
    }
  };

  // Função para remover do carrinho
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    const removedItem = cart.find(item => item.id === productId);
    setCart(updatedCart);
    setTotal(total - (removedItem ? removedItem.price : 0));
  };

  // Filtros combinados
  const filteredProducts = products
    .filter(product => product.category === selectedCategory)
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Paginação
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Estilos profissionais
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      position: 'relative'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    searchBar: {
      display: 'flex',
      justifyContent: 'center',
      margin: '25px 0',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      maxWidth: '500px',
      padding: '12px 20px',
      borderRadius: '30px',
      border: '1px solid #ddd',
      fontSize: '16px',
      outline: 'none',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      transition: 'all 0.3s'
    },
    categoryMenu: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
      margin: '30px 0',
      padding: '15px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    categoryButton: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '30px',
      fontSize: '14px',
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
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '25px',
      margin: '30px 0'
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
      height: '180px',
      objectFit: 'cover',
      borderBottom: '1px solid #eee'
    },
    productInfo: {
      padding: '20px'
    },
    productName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px',
      height: '40px',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    productPrice: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#e53935',
      margin: '15px 0'
    },
    unavailablePrice: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#999',
      margin: '15px 0',
      textDecoration: 'line-through'
    },
    addButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#095400',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '15px',
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
      margin: '40px 0',
      gap: '10px'
    },
    pageButton: {
      padding: '8px 15px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    activePage: {
      backgroundColor: '#095400',
      color: '#fff',
      borderColor: '#095400'
    },
    resultsInfo: {
      textAlign: 'center',
      color: '#666',
      margin: '20px 0',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <div style={styles.header}>
        <img 
          src="https://i.imgur.com/8EagMV6.png" 
          alt="Logo" 
          style={{ height: '60px', marginBottom: '15px' }} 
        />
        <h1 style={{ 
          color: '#095400', 
          fontSize: '28px', 
          fontWeight: '700',
          marginBottom: '10px'
        }}>
          PMG ATACADISTA
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Encontre os melhores produtos para seu negócio
        </p>
      </div>

      {/* Barra de pesquisa */}
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

      {/* Menu de categorias */}
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

      {/* Informações de resultados */}
      <div style={styles.resultsInfo}>
        {filteredProducts.length > 0 ? (
          <p>
            Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} de {filteredProducts.length} produtos em "{selectedCategory}"
          </p>
        ) : (
          <p>Nenhum produto encontrado para "{searchTerm}" em "{selectedCategory}"</p>
        )}
      </div>

      {/* Grade de produtos */}
      <div style={styles.productsGrid}>
        {currentProducts.map(product => (
          <div 
            key={product.id} 
            style={{
              ...styles.productCard,
              ...(product.price === 0 && { opacity: 0.7 })
            }}
            onMouseEnter={e => {
              if (product.price > 0) {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
            }}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              style={styles.productImage}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/250x180?text=Imagem+Não+Disponível';
              }}
            />
            <div style={styles.productInfo}>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={product.price > 0 ? styles.productPrice : styles.unavailablePrice}>
                {product.price > 0 ? `R$ ${product.price.toFixed(2)}` : 'Indisponível'}
              </p>
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
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {filteredProducts.length > productsPerPage && (
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={styles.pageButton}
          >
            Anterior
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  ...styles.pageButton,
                  ...(currentPage === pageNum && styles.activePage)
                }}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={styles.pageButton}
          >
            Próxima
          </button>
        </div>
      )}

      {/* Carrinho flutuante */}
      <Cart cart={cart} total={total} removeFromCart={removeFromCart} />
    </div>
  );
};

export default ProductsPage;
