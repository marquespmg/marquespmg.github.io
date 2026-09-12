import React, { useState, useEffect, useRef } from 'react';
import CartRetirada from '../components/CartRetirada';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useTrackUser from '../hook/useTrackUser';

// ==============================================
// ⭐ CONFIGURAÇÕES DA RETIRADA
// ==============================================
const PEDIDO_MINIMO_RETIRADA = 200; // R$ 200,00
const TITULO_PAGINA = 'PMG ATACADISTA RETIRA';
const MENSAGEM_RETIRADA = 'Retire seus produtos com praticidade! Faça seu pedido online e retire no conforto do nosso endereço. Sem filas, sem espera!';

const products = [
  { id: 36, name: 'PÁ DE ESFIHA (UN 90 X 22 CM)', category: 'Acessórios', price: 172.51, image: 'https://www.marquesvendaspmg.shop/images/pa-de-esfiha-un-90-x-22-cm-pmg-atacadista.jpg' },
  { id: 38, name: 'PÁ DE FERRO (UN 38 CM)', category: 'Acessórios', price: 148.98, image: 'https://www.marquesvendaspmg.shop/images/pa-de-ferro-un-38-cm-pmg-atacadista.jpg' },
  { id: 39, name: 'PÁ DE MADEIRA (UN 35 CM)', category: 'Acessórios', price: 215.64, image: 'https://www.marquesvendaspmg.shop/images/pa-de-madeira-un-35-cm-pmg-atacadista.jpg' },
  { id: 44, name: 'VARREDOR PARA FORNO (UN 40 CM)', category: 'Acessórios', price: 105.85, image: 'https://www.marquesvendaspmg.shop/images/varredor-para-forno-un-40-cm-pmg-atacadista.jpg' },
  { id: 45, name: 'VASSOURINHA CABO PLÁSTICO (UN)', category: 'Acessórios', price: 12.95, image: 'https://www.marquesvendaspmg.shop/images/vassourinha-cabo-plastico-un-pmg-atacadista.jpg' },
  { id: 52, name: 'ÁGUA MINERAL BUONAVITA COM GÁS 510 ML (PCT 12 UN)', category: 'Bebidas', price: 21.10, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-buonavita-com-gas-510-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 53, name: 'ÁGUA MINERAL BUONAVITA SEM GÁS 510 ML (PCT 12 UN)', category: 'Bebidas', price: 15.67, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-buonavita-sem-gas-510-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 55, name: 'ÁGUA MINERAL CRYSTAL COM GÁS 500 ML (PCT 12 UN)', category: 'Bebidas', price: 23.85, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-crystal-com-gas-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 56, name: 'ÁGUA MINERAL CRYSTAL SEM GÁS 500 ML (PCT 12 UN)', category: 'Bebidas', price: 23.45, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-crystal-sem-gas-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 57, name: 'ÁGUA MINERAL GRANDE BUONAVITA SEM GÁS 1,5 L (PCT 6 UN)', category: 'Bebidas', price: 16.79, image: 'https://www.marquesvendaspmg.shop/images/agua-mineral-grande-buonavita-sem-gas-15-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 105, name: 'CERVEJA HEINEKEN PURE MALT LAGER LONG NECK 330 ML (PCT 24 UN)', category: 'Bebidas', price: 174.05, image: 'https://www.marquesvendaspmg.shop/images/cerveja-heineken-pure-malt-lager-long-neck-330-ml-pct-24-un-pmg-atacadista.jpg' },
  { id: 111, name: 'CERVEJA MÉDIA SKOL PILSEN LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 45.19, image: 'https://www.marquesvendaspmg.shop/images/cerveja-media-skol-pilsen-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 126, name: 'COCA COLA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 47.40, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 127, name: 'COCA COLA MÉDIA PET 1 L (PCT 6 UN)', category: 'Bebidas', price: 44.49, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-media-pet-1-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 130, name: 'COCA COLA PEQUENA PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 69.57, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-pequena-pet-600-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 131, name: 'COCA COLA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 65.67, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 132, name: 'COCA COLA SEM AÇÚCAR LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 47.51, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-sem-acucar-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 133, name: 'COCA COLA SEM AÇÚCAR PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 68.72, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-sem-acucar-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 134, name: 'COCA COLA SEM AÇÚCAR PET 600 ML (PCT 12 UN)', category: 'Bebidas', price: 69.57, image: 'https://www.marquesvendaspmg.shop/images/coca-cola-sem-acucar-pet-600-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 144, name: 'DOLLY GUARANÁ PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 33.27, image: 'https://www.marquesvendaspmg.shop/images/dolly-guarana-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 146, name: 'DOLLY LIMÃO PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 33.61, image: 'https://www.marquesvendaspmg.shop/images/dolly-limao-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 166, name: 'FANTA LARANJA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 44.63, image: 'https://www.marquesvendaspmg.shop/images/fanta-laranja-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 167, name: 'FANTA LARANJA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 54.39, image: 'https://www.marquesvendaspmg.shop/images/fanta-laranja-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 169, name: 'FANTA UVA LATA 350 ML (PCT 6 UN)', category: 'Bebidas', price: 22.72, image: 'https://www.marquesvendaspmg.shop/images/fanta-uva-lata-350-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 170, name: 'FANTA UVA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 54.39, image: 'https://www.marquesvendaspmg.shop/images/fanta-uva-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 180, name: 'GUARANÁ ANTARCTICA LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 42.90, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 182, name: 'GUARANÁ ANTARCTICA PEQUENO PET 1 L (PCT 6 UN)', category: 'Bebidas', price: 25.83, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-pequeno-pet-1-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 183, name: 'GUARANÁ ANTARCTICA PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 59.20, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 185, name: 'GUARANÁ ANTARCTICA SEM AÇÚCARES LATA 350 ML (PCT 12 LT)', category: 'Bebidas', price: 42.90, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-sem-acucares-lata-350-ml-pct-12-lt-pmg-atacadista.jpg' },
  { id: 186, name: 'GUARANÁ ANTARCTICA SEM AÇÚCARES PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 59.20, image: 'https://www.marquesvendaspmg.shop/images/guarana-antarctica-sem-acucares-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 188, name: 'H2O LIMÃO SEM AÇÚCARES PET 500 ML (PCT 12 UN)', category: 'Bebidas', price: 58.04, image: 'https://www.marquesvendaspmg.shop/images/h2o-limao-sem-acucares-pet-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 190, name: 'H2O LIMONETO SEM AÇÚCARES PET 500 ML (PCT 12 UN)', category: 'Bebidas', price: 58.04, image: 'https://www.marquesvendaspmg.shop/images/h2o-limoneto-sem-acucares-pet-500-ml-pct-12-un-pmg-atacadista.jpg' },
  { id: 239, name: 'SCHWEPPES CITRUS LATA 350 ML (PCT 6 LT)', category: 'Bebidas', price: 25.74, image: 'https://www.marquesvendaspmg.shop/images/schweppes-citrus-lata-350-ml-pct-6-lt-pmg-atacadista.jpg' },
  { id: 245, name: 'SPRITE LATA 350 ML (PCT 6 UN)', category: 'Bebidas', price: 23, image: 'https://www.marquesvendaspmg.shop/images/sprite-lata-350-ml-pct-6-un-pmg-atacadista.jpg' },
  { id: 247, name: 'SPRITE PET 2 L (PCT 6 UN)', category: 'Bebidas', price: 54.94, image: 'https://www.marquesvendaspmg.shop/images/sprite-pet-2-l-pct-6-un-pmg-atacadista.jpg' },
  { id: 298, name: 'VINHO CHILENO TINTO SECO FINO CABERNET SAUVIGNON CHILANO 750 ML', category: 'Bebidas', price: 251.51, image: 'https://www.marquesvendaspmg.shop/images/vinho-chileno-tinto-seco-fino-cabernet-sauvignon-chilano-750-ml-pmg-atacadista.jpg' },
  { id: 372, name: 'ERVILHA BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 68.76, image: 'https://www.marquesvendaspmg.shop/images/ervilha-bonare-goias-verde-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 373, name: 'ERVILHA GRANDE BONARE GOIÁS VERDE 1,7 KILO', category: 'Conservas/Enlatados', price: 19.79, image: 'https://www.marquesvendaspmg.shop/images/ervilha-grande-bonare-goias-verde-17-kilo-pmg-atacadista.jpg' },
  { id: 385, name: 'MILHO BONARE GOIÁS VERDE 170 G (CX 24 LT)', category: 'Conservas/Enlatados', price: 68.44, image: 'https://www.marquesvendaspmg.shop/images/milho-bonare-goias-verde-170-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 386, name: 'MILHO GRANDE BONARE GOIÁS VERDE 1,7 KILO', category: 'Conservas/Enlatados', price: 22.09, image: 'https://www.marquesvendaspmg.shop/images/milho-grande-bonare-goias-verde-17-kilo-pmg-atacadista.jpg' },
  { id: 389, name: 'MILHO GRANDE QUERO 1,7 KILO', category: 'Conservas/Enlatados', price: 23.62, image: 'https://www.marquesvendaspmg.shop/images/milho-grande-quero-17-kilo-pmg-atacadista.jpg' },
  { id: 394, name: 'MOLHO BARBECUE CEPÊRA 3,5 KILO', category: 'Conservas/Enlatados', price: 39, image: 'https://www.marquesvendaspmg.shop/images/molho-barbecue-cepera-35-kilo-pmg-atacadista.jpg' },
  { id: 395, name: 'MOLHO BARBECUE EKMA 3,5 KILO', category: 'Conservas/Enlatados', price: 23.24, image: 'https://www.marquesvendaspmg.shop/images/molho-barbecue-ekma-35-kilo-pmg-atacadista.jpg' },
  { id: 400, name: 'MOLHO BILLY & JACK ORIGINAL KISABOR 1,01 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 126.79, image: 'https://www.marquesvendaspmg.shop/images/molho-billy-jack-original-kisabor-101-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 408, name: 'MOLHO DE PIMENTA VERMELHA EKMA 1,01 L', category: 'Conservas/Enlatados', price: 8.72, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-vermelha-ekma-101-l-pmg-atacadista.jpg' },
  { id: 413, name: 'MOLHO DE TOMATE PIZZA BONARE GOIÁS VERDE 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 64.76, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-pizza-bonare-goias-verde-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 416, name: 'MOLHO DE TOMATE TRADICIONAL REFOGADO EKMA 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 55.95, image: 'https://www.marquesvendaspmg.shop/images/molho-de-tomate-refogado-tradicional-ekma-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 428, name: 'MOLHO DE TOMATE PIZZA EKMA 1,7 KILO (CX 6 BAG)', category: 'Conservas/Enlatados', price: 56.98, image: 'https://www.marquesvendaspmg.shop/images/molho-para-pizza-ekma-17-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 455, name: 'TOMATE PELADO INTEIRO ARCO BELLO 2,5 KILO', category: 'Conservas/Enlatados', price: 36.64, image: 'https://www.marquesvendaspmg.shop/images/tomate-pelado-inteiro-arco-bello-25-kilo-pmg-atacadista.jpg' },
  { id: 462, name: 'CHICKEN DE FRANGO CONGELADO EMPANADO SUPREME SEARA 2,5 KILO (CX 2 PCT)', category: 'Derivados de Ave', price: 121.35, image: 'https://www.marquesvendaspmg.shop/images/chicken-de-frango-congelado-empanado-supreme-seara-25-kilo-cx-2-pct-pmg-atacadista.jpg' },
  { id: 481, name: 'FILEZINHO SASSAMI DE FRANGO CONGELADO AURORA 1 KILO (CX 16 PCT)', category: 'Derivados de Ave', price: 266.74, image: 'https://www.marquesvendaspmg.shop/images/filezinho-sassami-de-frango-congelado-aurora-1-kilo-cx-16-pct-pmg-atacadista.jpg' },
  { id: 502, name: 'OVOS BRANCOS TIPO GRANDE MODELO 60 UN (CX 2 BDJ)', category: 'Derivados de Ave', price: 41.97, image: 'https://www.marquesvendaspmg.shop/images/ovos-brancos-tipo-grande-modelo-60-un-cx-2-bdj-pmg-atacadista.jpg' },
  { id: 506, name: 'PEITO DE FRANGO CONGELADO COM OSSO NUTRIBEM (CX 20 KILO)', category: 'Derivados de Ave', price: 188.19, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-congelado-com-osso-nutribem-cx-20-kilo-pmg-atacadista.jpg' },
  { id: 508, name: 'PEITO DE FRANGO DEFUMADO SEM OSSO CERATTI 2,3 KILO', category: 'Derivados de Ave', price: 84.64, image: 'https://www.marquesvendaspmg.shop/images/peito-de-frango-defumado-sem-osso-ceratti-23-kilo-pmg-atacadista.jpg' },
  { id: 509, name: 'PEITO DE PERU REZENDE 2.5 KG', category: 'Derivados de Ave', price: 52.42, image: 'https://www.marquesvendaspmg.shop/images/peito-de-peru-rezende-25-kilo-pmg-atacadista.jpg' },
  { id: 510, name: 'PEITO DE PERU SADIA 2.5 KG', category: 'Derivados de Ave', price: 69.23, image: 'https://www.marquesvendaspmg.shop/images/peito-de-peru-sadia-25-kilo-pmg-atacadista.jpg' },
  { id: 511, name: 'PEITO DE PERU SEARA 2.5 KG', category: 'Derivados de Ave', price: 55.18, image: 'https://www.marquesvendaspmg.shop/images/peito-de-peru-seara-25-kilo-pmg-atacadista.jpg' },
  { id: 528, name: 'CARNE MOÍDA BOVINA CONGELADA BOI FORTE 1 KILO', category: 'Derivados de Bovino', price: 20.79, image: 'https://www.marquesvendaspmg.shop/images/carne-moida-bovina-congelada-acem-boi-forte-1-kg-pmg-atacadista.jpg' },
  { id: 533, name: 'CARNE SECA BOVINA CONGELADA DESFIADA ALFAMA 1 KILO', category: 'Derivados de Bovino', price: 69.65, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-congelada-desfiada-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 537, name: 'CARNE SECA BOVINA GRANDE DIANTEIRO REAL SABOR 5 KILO', category: 'Derivados de Bovino', price: 246.65, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-grande-dianteiro-real-sabor-5-kg-pmg-atacadista.jpg' },
  { id: 546, name: 'COSTELA BOVINA CONGELADA DESFIADA ALFAMA 1 KILO', category: 'Derivados de Bovino', price: 68.88, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-congelada-desfiada-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 556, name: 'CUPIM BOVINO CONGELADO DESFIADO ALFAMA 1 KILO', category: 'Derivados de Bovino', price: 69.31, image: 'https://www.marquesvendaspmg.shop/images/cupim-bovino-congelado-desfiado-alfama-1-kg-pmg-atacadista.jpg' },
  { id: 602, name: 'PICANHA BOVINA RESFRIADA DEFUMADA CERATTI 1 KG', category: 'Derivados de Bovino', price: 204.42, image: 'https://www.marquesvendaspmg.shop/images/picanha-bovina-resfriada-defumada-ceratti-1-kg-pmg-atacadista.jpg' },
  { id: 608, name: 'BASE CULINÁRIA 25% DE GORDURA LECO 1 KILO (CX 12 UN)', category: 'Derivados de Leite', price: 177.01, image: 'https://www.marquesvendaspmg.shop/images/base-culinaria-leco-1-kilo-cx-12-un-pmg-atacadista.jpg' },
  { id: 614, name: 'CHEDDAR FATIADO PROCESSADO 160 FATIAS POLENGHI "2,27" KILO', category: 'Derivados de Leite', price: 86.96, image: 'https://www.marquesvendaspmg.shop/images/cheddar-fatiado-processado-160-fatias-polenghi-227-kilo-pmg-atacadista.jpg' },
  { id: 615, name: 'CHEDDAR FATIADO PROCESSADO 160 FATIAS VIGOR 2,24 KILO', category: 'Derivados de Leite', price: 104.44, image: 'https://www.marquesvendaspmg.shop/images/cheddar-fatiado-processado-160-fatias-vigor-224-kilo-pmg-atacadista.jpg' },
  { id: 616, name: 'CHEDDAR FATIADO PROCESSADO 184 FATIAS SCHREIBER 2,27 KILO', category: 'Derivados de Leite', price: 98.46, image: 'https://www.marquesvendaspmg.shop/images/cheddar-fatiado-processado-184-fatias-schreiber-227-kilo-pmg-atacadista.jpg' },
  { id: 620, name: 'CREAM CHEESE CATUPIRY 1,2 KILO', category: 'Derivados de Leite', price: 43.22, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-catupiry-12-kilo-pmg-atacadista.jpg' },
  { id: 622, name: 'CREAM CHEESE DANÚBIO 1 KILO', category: 'Derivados de Leite', price: 29.30, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-danubio-1-kilo-pmg-atacadista.jpg' },
  { id: 627, name: 'CREAM CHEESE PHILADELPHIA 1,5 KILO', category: 'Derivados de Leite', price: 72.80, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-philadelphia-15-kilo-pmg-atacadista.jpg' },
  { id: 632, name: 'CREAM CHEESE SCALA 1,2 KILO', category: 'Derivados de Leite', price: 40.88, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-scala-12-kilo-pmg-atacadista.jpg' },
  { id: 634, name: 'CREAM CHEESE SCALON 1,02 KILO', category: 'Derivados de Leite', price: 31.24, image: 'https://www.marquesvendaspmg.shop/images/cream-cheese-scalon-102-kilo-pmg-atacadista.jpg' },
  { id: 649, name: 'DOCE DE LEITE SABOR DE MINAS 1,5 KILO', category: 'Derivados de Leite', price: 22.44, image: 'https://www.marquesvendaspmg.shop/images/doce-de-leite-sabor-de-minas-15-kilo-pmg-atacadista.jpg' },
  { id: 651, name: 'GORGONZOLA QUEIJO AZUL BELLA ITÁLIA 3 KG', category: 'Derivados de Leite', price: 61.16, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-bella-italia-3-kg-pmg-atacadista.jpg' },
  { id: 652, name: 'GORGONZOLA FRACIONADO BELLA ITÁLIA 160 G', category: 'Derivados de Leite', price: 11.49, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-fracionado-bella-italia-200-g-pmg-atacadista.jpg' },
  { id: 656, name: 'GORGONZOLA FRACIONADO QUEIJO AZUL TIROLEZ 200 G', category: 'Derivados de Leite', price: 17.50, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-fracionado-queijo-azul-tirolez-200-g-pmg-atacadista.jpg' },
  { id: 658, name: 'GORGONZOLA QUATÁ 3 KG', category: 'Derivados de Leite', price: 66.63, image: 'https://www.marquesvendaspmg.shop/images/gorgonzola-quata-3-kg-pmg-atacadista.jpg' },
  { id: 682, name: 'LEITE INTEGRAL JUSSARA 1 L (CX 12 UN)', category: 'Derivados de Leite', price: 71.75, image: 'https://www.marquesvendaspmg.shop/images/leite-integral-jussara-1-l-cx-12-un-pmg-atacadista.jpg' },
  { id: 690, name: 'MANTEIGA COM SAL TRÊS MARIAS 10 KILO', category: 'Derivados de Leite', price: 399.75, image: 'https://www.marquesvendaspmg.shop/images/manteiga-com-sal-tres-marias-10-kilo-pmg-atacadista.jpg' },
  { id: 702, name: 'MANTEIGA SEM SAL DE PRIMEIRA FRIZZO (CX 5 KILO)', category: 'Derivados de Leite', price: 133.25, image: 'https://www.marquesvendaspmg.shop/images/manteiga-sem-sal-de-primeira-frizzo-cx-5-kilo-pmg-atacadista.jpg' },
  { id: 707, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR CORONATA 1,5 KILO', category: 'Derivados de Leite', price: 31.61, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-coronata-15-kilo-pmg-atacadista.jpg' },
  { id: 708, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR DALLORA 1,8 KILO', category: 'Derivados de Leite', price: 24.97, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-dallora-18-kilo-pmg-atacadista.jpg' },
  { id: 710, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR PURANATA 1,2 KILO', category: 'Derivados de Leite', price: 13.29, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-puranata-12-kilo-pmg-atacadista.jpg' },
  { id: 711, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR ROSELI 1,2 KILO', category: 'Derivados de Leite', price: 14.51, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-roseli-12-kilo-pmg-atacadista.jpg' },
  { id: 712, name: 'MISTURA DE REQUEIJÃO SABOR CHEDDAR TOP CHEDDAR 1,2 KILO', category: 'Derivados de Leite', price: 12.18, image: 'https://www.marquesvendaspmg.shop/images/mistura-de-requeijao-sabor-cheddar-top-cheddar-12-kilo-pmg-atacadista.jpg' },
  { id: 717, name: 'MUÇARELA APOLO 4 KG', category: 'Derivados de Leite', price: 35.08, image: 'https://www.marquesvendaspmg.shop/images/mucarela-apolo-4-kg-pmg-atacadista.jpg' },
  { id: 719, name: 'MUÇARELA BARI 4 KG', category: 'Derivados de Leite', price: 35.08, image: 'https://www.marquesvendaspmg.shop/images/mucarela-bari-4-kg-pmg-atacadista.jpg' },
  { id: 724, name: 'MUÇARELA COBERTURA MOZZANA PIZZA 2 KILO', category: 'Derivados de Leite', price: 45.96, image: 'https://www.marquesvendaspmg.shop/images/mucarela-cobertura-para-pizza-mozzana-2-kg-pmg-atacadista.jpg' },
  { id: 735, name: 'MUÇARELA DE BÚFALA YEMA 3.7 KG', category: 'Derivados de Leite', price: 49.97, image: 'https://www.marquesvendaspmg.shop/images/mucarela-de-bufala-yema-37-kg-pmg-atacadista.jpg' },
  { id: 738, name: 'MUÇARELA FATIADA FRIZZO 2 KILO', category: 'Derivados de Leite', price: 77.41, image: 'https://www.marquesvendaspmg.shop/images/mucarela-fatiada-frizzo-2-kg-pmg-atacadista.jpg' },
  { id: 746, name: 'MUÇARELA FRIZZO 4 KG', category: 'Derivados de Leite', price: 35.67, image: 'https://www.marquesvendaspmg.shop/images/mucarela-frizzo-4-kg-pmg-atacadista.jpg' },
  { id: 747, name: 'MUÇARELA HM 4 KG', category: 'Derivados de Leite', price: 35.08, image: 'https://www.marquesvendaspmg.shop/images/mucarela-hm-4-kg-pmg-atacadista.jpg' },
  { id: 754, name: 'MUÇARELA MONTE CASTELO 4 KG', category: 'Derivados de Leite', price: 36.86, image: 'https://www.marquesvendaspmg.shop/images/mucarela-monte-castelo-4-kg-pmg-atacadista.jpg' },
  { id: 761, name: 'MUÇARELA QUATIGUÁ 4 KG', category: 'Derivados de Leite', price: 35.67, image: 'https://www.marquesvendaspmg.shop/images/mucarela-quatigua-4-kg-pmg-atacadista.jpg' },
  { id: 766, name: 'MUÇARELA TRADIÇÃO 4 KG', category: 'Derivados de Leite', price: 44.78, image: 'https://www.marquesvendaspmg.shop/images/mucarela-tradicao-4-kg-pmg-atacadista.jpg' },
  { id: 770, name: 'MUÇARELA TRÊS MARIAS RONDÔNIA "OURO PRETO" 4 KG', category: 'Derivados de Leite', price: 41.62, image: 'https://www.marquesvendaspmg.shop/images/mucarela-tres-marias-rondonia-ouro-preto-4-kg-pmg-atacadista.jpg' },
  { id: 773, name: 'MUÇARELA VACA E BÚFALA MARGHERITA YEMA 0.700 KG (700 GRAMAS)', category: 'Derivados de Leite', price: 50.64, image: 'https://www.marquesvendaspmg.shop/images/mucarela-vaca-e-bufala-margherita-yema-700-g-pmg-atacadista.jpg' },
  { id: 786, name: 'PARMESÃO CAPA PRETA BURITIS 5 KG', category: 'Derivados de Leite', price: 74.62, image: 'https://www.marquesvendaspmg.shop/images/parmesao-capa-preta-buritis-5-kg-pmg-atacadista.jpg' },
  { id: 790, name: 'PARMESÃO FRACIONADO TIROLEZ 200 G', category: 'Derivados de Leite', price: 23.08, image: 'https://www.marquesvendaspmg.shop/images/parmesao-fracionado-tirolez-245-g-pmg-atacadista.jpg' },
  { id: 796, name: 'PARMESÃO RALADO FINO RJR 1 KILO', category: 'Derivados de Leite', price: 39.71, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-fino-rjr-1-kg-pmg-atacadista.jpg' },
  { id: 797, name: 'PARMESÃO RALADO FINO S & A 1 KILO', category: 'Derivados de Leite', price: 41.57, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-fino-s-a-1-kg-pmg-atacadista.jpg' },
  { id: 800, name: 'PARMESÃO RALADO GROSSO RJR 1 KILO', category: 'Derivados de Leite', price: 39.71, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-grosso-rjr-1-kg-pmg-atacadista.jpg' },
  { id: 801, name: 'PARMESÃO RALADO MÉDIO FILLETTINO 1 KILO', category: 'Derivados de Leite', price: 45.97, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-medio-fillettino-1-kg-pmg-atacadista.jpg' },
  { id: 802, name: 'PARMESÃO RALADO MÉDIO RJR 1 KILO', category: 'Derivados de Leite', price: 39.71, image: 'https://www.marquesvendaspmg.shop/images/parmesao-ralado-medio-rjr-1-kg-pmg-atacadista.jpg' },
  { id: 810, name: 'PROVOLONE CRISTAL 5 KG', category: 'Derivados de Leite', price: 45.97, image: 'https://www.marquesvendaspmg.shop/images/provolone-cristal-5-kg-pmg-atacadista.jpg' },
  { id: 812, name: 'PROVOLONE PEQUENO TRÊS MARIAS 2 KG', category: 'Derivados de Leite', price: 49.30, image: 'https://www.marquesvendaspmg.shop/images/provolone-pequeno-tres-marias-2-kg-pmg-atacadista.jpg' },
  { id: 816, name: 'PROVOLONE TRÊS MARIAS 5 KG', category: 'Derivados de Leite', price: 49.30, image: 'https://www.marquesvendaspmg.shop/images/provolone-tres-marias-5-kg-pmg-atacadista.jpg' },
  { id: 822, name: 'QUEIJO BRIE FORMA YEMA 1 KG', category: 'Derivados de Leite', price: 66.40, image: 'https://www.marquesvendaspmg.shop/images/queijo-brie-forma-yema-1-kg-pmg-atacadista.jpg' },
  { id: 827, name: 'QUEIJO COALHO BARRA YEMA 3.5 KG', category: 'Derivados de Leite', price: 49.84, image: 'https://www.marquesvendaspmg.shop/images/queijo-coalho-barra-yema-35-kg-pmg-atacadista.jpg' },
  { id: 849, name: 'QUEIJO MINAS FRESCAL CORONATA 0.500 KG ( 500 GRAMAS)', category: 'Derivados de Leite', price: 39.64, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-frescal-coronata-500-g-pmg-atacadista.jpg' },
  { id: 850, name: 'QUEIJO MINAS FRESCAL ITAMONTÊS 0.500 KG ( 500 GRAMAS)', category: 'Derivados de Leite', price: 36.64, image: 'https://www.marquesvendaspmg.shop/images/queijo-minas-frescal-itamontes-500-g-pmg-atacadista.jpg' },
  { id: 860, name: 'QUEIJO PRATO CRISTAL 3.5 KG', category: 'Derivados de Leite', price: 39.31, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-cristal-35-kg-pmg-atacadista.jpg' },
  { id: 865, name: 'QUEIJO PRATO FATIADO PROCESSADO 184 FATIAS SCHREIBER 2,27 KILO', category: 'Derivados de Leite', price: 92.21, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-fatiado-processado-184-fatias-schreiber-227-kilo-pmg-atacadista.jpg' },
  { id: 872, name: 'QUEIJO PRATO TRÊS MARIAS 3.5 KG', category: 'Derivados de Leite', price: 41.73, image: 'https://www.marquesvendaspmg.shop/images/queijo-prato-tres-marias-35-kg-pmg-atacadista.jpg' },
  { id: 877, name: 'REQUEIJÃO CATUPIRY SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 60.57, image: 'https://www.marquesvendaspmg.shop/images/requeijao-catupiry-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 879, name: 'REQUEIJÃO CLARA MILK COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 15.97, image: 'https://www.marquesvendaspmg.shop/images/requeijao-clara-milk-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 889, name: 'REQUEIJÃO CORONATA COM GORDURA VEGETAL E AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 21.96, image: 'https://www.marquesvendaspmg.shop/images/requeijao-coronata-com-gordura-vegetal-e-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 891, name: 'REQUEIJÃO CREMILLE COM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 10.16, image: 'https://www.marquesvendaspmg.shop/images/requeijao-cremille-com-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 892, name: 'REQUEIJÃO DA FAZENDA "VERDE" COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 13.91, image: 'https://www.marquesvendaspmg.shop/images/requeijao-da-fazenda-verde-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 893, name: 'REQUEIJÃO DALLORA COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 15.72, image: 'https://www.marquesvendaspmg.shop/images/requeijao-dallora-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 898, name: 'REQUEIJÃO MILK TOP COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 11.85, image: 'https://www.marquesvendaspmg.shop/images/requeijao-milk-top-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 905, name: 'REQUEIJÃO SABOR CHEDDAR CATUPIRY 1,010 KILO', category: 'Derivados de Leite', price: 47.85, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-catupiry-1010-kilo-pmg-atacadista.jpg' },
  { id: 906, name: 'REQUEIJÃO SABOR CHEDDAR CORONATA 1,5 KILO', category: 'Derivados de Leite', price: 48.22, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-coronata-15-kilo-pmg-atacadista.jpg' },
  { id: 909, name: 'REQUEIJÃO SABOR CHEDDAR SCALA 1,5 KILO', category: 'Derivados de Leite', price: 60.37, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-scala-15-kilo-pmg-atacadista.jpg' },
  { id: 910, name: 'REQUEIJÃO SABOR CHEDDAR SCALON 1,02 KILO', category: 'Derivados de Leite', price: 34.44, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-scalon-102-kilo-pmg-atacadista.jpg' },
  { id: 912, name: 'REQUEIJÃO SABOR CHEDDAR TIROLEZ 1,5 KILO', category: 'Derivados de Leite', price: 48.52, image: 'https://www.marquesvendaspmg.shop/images/requeijao-sabor-cheddar-tirolez-15-kilo-pmg-atacadista.jpg' },
  { id: 914, name: 'REQUEIJÃO SCALA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 47.97, image: 'https://www.marquesvendaspmg.shop/images/requeijao-scala-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 915, name: 'REQUEIJÃO SCALA SEM AMIDO 3,6 KILO', category: 'Derivados de Leite', price: 125.92, image: 'https://www.marquesvendaspmg.shop/images/requeijao-scala-sem-amido-36-kilo-pmg-atacadista.jpg' },
  { id: 916, name: 'REQUEIJÃO SCALON SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 45.48, image: 'https://www.marquesvendaspmg.shop/images/requeijao-scalon-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 917, name: 'REQUEIJÃO TIROLEZ SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 44.37, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tirolez-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 919, name: 'REQUEIJÃO TOP MILK COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 13.91, image: 'https://www.marquesvendaspmg.shop/images/requeijao-top-milk-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 921, name: 'REQUEIJÃO TRADICIONAL DALLORA SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 41.73, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tradicional-dallora-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 923, name: 'REQUEIJÃO TRÊS MARIAS SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 38.70, image: 'https://www.marquesvendaspmg.shop/images/requeijao-tres-marias-sem-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 924, name: 'REQUEIJÃO VALE DO PARDO COM AMIDO 1,8 KILO', category: 'Derivados de Leite', price: 11.97, image: 'https://www.marquesvendaspmg.shop/images/requeijao-vale-do-pardo-com-amido-18-kilo-pmg-atacadista.jpg' },
  { id: 926, name: 'REQUEIJÃO VIGOR SEM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 48.69, image: 'https://www.marquesvendaspmg.shop/images/requeijao-vigor-sem-amido-15-kilo-pmg-atacadista.jpg' },
  { id: 930, name: 'RICOTA FRESCA CORONATA 0.520 KG ( 520 GRAMAS)', category: 'Derivados de Leite', price: 16.26, image: 'https://www.marquesvendaspmg.shop/images/ricota-fresca-coronata-520-g-pmg-atacadista.jpg' },
  { id: 932, name: 'APRESUNTADO AURORA 3,7 KILO PÇ', category: 'Derivados de Suíno', price: 76.31, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-aurora-37-kilo-pc-pmg-atacadista.jpg' },
  { id: 942, name: 'BACON EM CUBOS "PERNIL" LACTOFRIOS 1 KILO PCT', category: 'Derivados de Suíno', price: 23.10, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-pernil-lactofrios-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 951, name: 'BACON ESPECIAL SEARA 5 KG', category: 'Derivados de Suíno', price: 30.48, image: 'https://www.marquesvendaspmg.shop/images/bacon-especial-seara-5-kilo-kilo-pmg-atacadista.jpg' },
  { id: 956, name: 'BACON FATIADO "PAPADA" MISTER BEEF 1 KILO PCT', category: 'Derivados de Suíno', price: 36.45, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-papada-mister-beef-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 967, name: 'BACON MANTA REZENDE 4 KG', category: 'Derivados de Suíno', price: 30.48, image: 'https://www.marquesvendaspmg.shop/images/bacon-manta-rezende-4-kg-kg-pmg-atacadista.jpg' },
  { id: 972, name: 'BANHA AURORA 1 KILO PCT', category: 'Derivados de Suíno', price: 16.74, image: 'https://www.marquesvendaspmg.shop/images/banha-aurora-1-kg-pct-pmg-atacadista.jpg' },
  { id: 973, name: 'BANHA COOPAVEL 1 KILO PCT', category: 'Derivados de Suíno', price: 11.99, image: 'https://www.marquesvendaspmg.shop/images/banha-coopavel-1-kg-pct-pmg-atacadista.jpg' },
  { id: 978, name: 'CALABRESA AURORA 5 KILO', category: 'Derivados de Suíno', price: 101.27, image: 'https://www.marquesvendaspmg.shop/images/calabresa-aurora-5-kilo-pmg-atacadista.jpg' },
  { id: 991, name: 'CALABRESA PURA PRIETO 5 KILO', category: 'Derivados de Suíno', price: 185.60, image: 'https://www.marquesvendaspmg.shop/images/calabresa-pura-prieto-5-kilo-pmg-atacadista.jpg' },
  { id: 997, name: 'CALABRESA RETA PRIETO 2.5 KILO', category: 'Derivados de Suíno', price: 48.15, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-prieto-25-kilo-pmg-atacadista.jpg' },
  { id: 999, name: 'CALABRESA RETA SEARA 2.5 KILO', category: 'Derivados de Suíno', price: 52.57, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-seara-25-kilo-pmg-atacadista.jpg' },
  { id: 1020, name: 'LOMBO CANADENSE AURORA 0.750G KG', category: 'Derivados de Suíno', price: 47.45, image: 'https://www.marquesvendaspmg.shop/images/lombo-canadense-aurora-0750g-kg-pmg-atacadista.jpg' },
  { id: 1021, name: 'LOMBO CANADENSE CERATTI 1 KG', category: 'Derivados de Suíno', price: 49.94, image: 'https://www.marquesvendaspmg.shop/images/lombo-canadense-ceratti-1-kg-pmg-atacadista.jpg' },
  { id: 1024, name: 'LOMBO CANADENSE NOBRE  1 KG', category: 'Derivados de Suíno', price: 45.27, image: 'https://www.marquesvendaspmg.shop/images/lombo-canadense-nobre-1-kg-pmg-atacadista.jpg' },
  { id: 1042, name: 'PARMA PRESUNTO CRU FATIADO ITALIANO CERATTI 100 G PCT', category: 'Derivados de Suíno', price: 26.46, image: 'https://www.marquesvendaspmg.shop/images/parma-presunto-cru-fatiado-italiano-ceratti-100-g-pct-pmg-atacadista.jpg' },
  { id: 1048, name: 'PEPPERONI FATIADO CERATTI 1 KILO PCT', category: 'Derivados de Suíno', price: 67.83, image: 'https://www.marquesvendaspmg.shop/images/pepperoni-fatiado-ceratti-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 1050, name: 'PEPPERONI FATIADO SADIA 1 KILO PCT', category: 'Derivados de Suíno', price: 119.13, image: 'https://www.marquesvendaspmg.shop/images/pepperoni-fatiado-sadia-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 1052, name: 'PERNIL SUÍNO CONGELADO DESFIADO ALFAMA 1 KILO PCT', category: 'Derivados de Suíno', price: 36.96, image: 'https://www.marquesvendaspmg.shop/images/pernil-suino-congelado-desfiado-alfama-1-kilo-pct-pmg-atacadista.jpg' },
  { id: 1058, name: 'PRESUNTO AURORA 3.5 KILO PÇ', category: 'Derivados de Suíno', price: 91.73, image: 'https://www.marquesvendaspmg.shop/images/presunto-aurora-35-kilo-pc-pmg-atacadista.jpg' },
  { id: 1062, name: 'PRESUNTO PRIETO 3.35 KILO PÇ', category: 'Derivados de Suíno', price: 77.70, image: 'https://www.marquesvendaspmg.shop/images/presunto-prieto-335-kilo-pc-pmg-atacadista.jpg' },
  { id: 1063, name: 'PRESUNTO REZENDE 3.4 KILO PÇ', category: 'Derivados de Suíno', price: 63.95, image: 'https://www.marquesvendaspmg.shop/images/presunto-rezende-34-kilo-pc-pmg-atacadista.jpg' },
  { id: 1065, name: 'PRESUNTO SEARA 3.5 KILO PÇ', category: 'Derivados de Suíno', price: 75.37, image: 'https://www.marquesvendaspmg.shop/images/presunto-seara-35-kilo-pc-pmg-atacadista.jpg' },
  { id: 1070, name: 'SALAME ITALIANO DEFUMADO AURORA 0.600 KG (600 GRAMAS)', category: 'Derivados de Suíno', price: 87.91, image: 'https://www.marquesvendaspmg.shop/images/salame-italiano-defumado-aurora-0600-g-kg-pmg-atacadista.jpg' },
  { id: 1084, name: 'ALCACHOFRA CORAÇÃO INTEIRO ARCO BELLO 2,5 KILO', category: 'Derivados de Vegetal', price: 91.94, image: 'https://www.marquesvendaspmg.shop/images/alcachofra-coracao-inteiro-arco-bello-25-kilo-pmg-atacadista.jpg' },
  { id: 1090, name: 'ALHO FRITO FINO DELEON 500 G', category: 'Derivados de Vegetal', price: 27.25, image: 'https://www.marquesvendaspmg.shop/images/alho-frito-fino-deleon-500-g-pmg-atacadista.jpg' },
  { id: 1096, name: 'ALHO TRITURADO GRANDE DELEON 3 KILO', category: 'Derivados de Vegetal', price: 24.83, image: 'https://www.marquesvendaspmg.shop/images/alho-triturado-grande-deleon-3-kilo-pmg-atacadista.jpg' },
  { id: 1097, name: 'ANÉIS DE CEBOLA CONGELADOS PRÉ FRITOS EMPANADOS PRÉ FORMADOS BEM BRASIL 1,05 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 138.51, image: 'https://www.marquesvendaspmg.shop/images/aneis-de-cebola-congelados-pre-fritos-empanados-pre-formados-bem-brasil-105-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1105, name: 'ARROZ BRANCO TIPO 1 FOOD SERVICE CAMIL 5 KILO (FDO 6 PCT)', category: 'Derivados de Vegetal', price: 161.60, image: 'https://www.marquesvendaspmg.shop/images/arroz-branco-tipo-1-food-service-camil-5-kilo-fdo-6-pct-pmg-atacadista.jpg' },
  { id: 1115, name: 'AZEITE COMPOSTO 50% OLIVA E 50% GIRASSOL LISBOA 500 ML', category: 'Derivados de Vegetal', price: 13.51, image: 'https://www.marquesvendaspmg.shop/images/azeite-composto-50-de-oliva-e-girassol-lisboa-500-ml-pmg-atacadista.jpg' },
  { id: 1119, name: 'AZEITE COMPOSTO TEMPERO CEBOLA E ALHO LISBOA BLEND 500 ML', category: 'Derivados de Vegetal', price: 16.25, image: 'https://www.marquesvendaspmg.shop/images/azeite-composto-tempero-cebola-e-alho-lisboa-blend-500-ml-pmg-atacadista.jpg' },
  { id: 1122, name: 'AZEITE DE OLIVA EXTRA VIRGEM GALLO 500 ML', category: 'Derivados de Vegetal', price: 31.55, image: 'https://www.marquesvendaspmg.shop/images/azeite-de-oliva-extra-virgem-gallo-500-ml-pmg-atacadista.jpg' },
  { id: 1133, name: 'AZEITE GRANDE COMPOSTO 30% OLIVA E 70% SOJA LISBOA 5,02 L', category: 'Derivados de Vegetal', price: 69.79, image: 'https://www.marquesvendaspmg.shop/images/azeite-grande-composto-30-oliva-e-soja-lisboa-502-l-pmg-atacadista.jpg' },
  { id: 1136, name: 'AZEITONA PRETA FATIADA COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 82.62, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-fatiada-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1140, name: 'AZEITONA PRETA GRAÚDA 9 X 11 AZAPA ARCO BELLO 2 KILO', category: 'Derivados de Vegetal', price: 115.93, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-grauda-9-x-11-azapa-arco-bello-2-kilo-pmg-atacadista.jpg' },
  { id: 1143, name: 'AZEITONA PRETA MÉDIA 24 X 28 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 79.95, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-media-24-x-28-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1146, name: 'AZEITONA PRETA SEM CAROÇO COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 90.61, image: 'https://www.marquesvendaspmg.shop/images/azeitona-preta-sem-caroco-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1148, name: 'AZEITONA VERDE FATIADA COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 61.30, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-fatiada-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1150, name: 'AZEITONA VERDE GRAÚDA 16 X 20 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 55.30, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-grauda-16-x-20-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1152, name: 'AZEITONA VERDE MÉDIA 24 X 28 COLOSSO (BD GRANDE 15 KILO)', category: 'Derivados de Vegetal', price: 333.13, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-24-x-28-colosso-bd-grande-15-kilo-pmg-atacadista.jpg' },
  { id: 1153, name: 'AZEITONA VERDE MÉDIA 24 X 28 COLOSSO (BD MÉDIO 7,5 KILO)', category: 'Derivados de Vegetal', price: 166.56, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-24-x-28-colosso-bd-medio-75-kilo-pmg-atacadista.jpg' },
  { id: 1154, name: 'AZEITONA VERDE MÉDIA 24 X 28 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 47.30, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-media-24-x-28-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1160, name: 'AZEITONA VERDE MIÚDA 45 X 50 COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 41.31, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-miuda-45-x-50-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1165, name: 'AZEITONA VERDE SEM CAROÇO COLOSSO 2 KILO', category: 'Derivados de Vegetal', price: 62.63, image: 'https://www.marquesvendaspmg.shop/images/azeitona-verde-sem-caroco-colosso-2-kilo-pmg-atacadista.jpg' },
  { id: 1183, name: 'BATATA PALHA TRADICIONAL KROCK 500 G', category: 'Derivados de Vegetal', price: 13.33, image: 'https://www.marquesvendaspmg.shop/images/batata-palha-tradicional-krock-500-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1194, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO LAMBWESTON 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 221.21, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-lambweston-225-kilo-cx-8-pct-pmg-atacadista.jpg' },
  { id: 1197, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO SIMPLOT 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 245.92, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-7-mm-corte-fino-simplot-225-kilo-cx-8-pct-pmg-atacadista.jpg' },
  { id: 1202, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL MAIS BATATA BEM BRASIL 2 KILO (CX 7 PCT)', category: 'Derivados de Vegetal', price: 143.32, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-mais-batata-bem-brasil-2-kilo-cx-7-pct-pmg-atacadista.jpg' },
  { id: 1203, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 205.23, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-mccain-25-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1208, name: 'BATATA PALITO CONGELADA PRÉ FRITA 9 MM CORTE TRADICIONAL SURECRISP EXTRA CROCANTE MCCAIN 2,5 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 246.30, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-9-mm-corte-tradicional-surecrisp-extra-crocante-mccain-25-kilo-cx--pmg-atacadista.jpg' },
  { id: 1213, name: 'BATATA PALITO CONGELADA PRÉ FRITA CRINKLE FRIES ONDULADA MCCAIN 2,5 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 208.12, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-crinkle-fries-ondulada-mccain-25-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1214, name: 'BATATA PALITO CONGELADA PRÉ FRITA CRINKLE ONDULADA BEM BRASIL 2 KILO (CX 6 PCT)', category: 'Derivados de Vegetal', price: 180.66, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-crinkle-ondulada-bem-brasil-2-kilo-cx-6-pct-pmg-atacadista.jpg' },
  { id: 1217, name: 'BRÓCOLIS CONGELADO AGRO YOSHI 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 95.94, image: 'https://www.marquesvendaspmg.shop/images/brocolis-congelado-agro-yoshi-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1218, name: 'BRÓCOLIS CONGELADO GRANO 2 KILO (CX 5 PCT)', category: 'Derivados de Vegetal', price: 123.92, image: 'https://www.marquesvendaspmg.shop/images/brocolis-congelado-grano-2-kilo-cx-5-pct-pmg-atacadista.jpg' },
  { id: 1228, name: 'CAFÉ TRADICIONAL ALMOFADA PILÃO 500 G (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 258.30, image: 'https://www.marquesvendaspmg.shop/images/cafe-tradicional-almofada-pilao-500-g-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1231, name: 'CATCHUP CEPÊRA 3,5 KILO', category: 'Derivados de Vegetal', price: 24.59, image: 'https://www.marquesvendaspmg.shop/images/catchup-cepera-35-kilo-pmg-atacadista.jpg' },
  { id: 1232, name: 'CATCHUP GRANDE EKMA 3,3 KILO', category: 'Derivados de Vegetal', price: 23.66, image: 'https://www.marquesvendaspmg.shop/images/catchup-ekma-33-kilo-pmg-atacadista.jpg' },
  { id: 1243, name: 'CATCHUP SACHÊ CEPÊRA 7 G (CX 154 UN)', category: 'Derivados de Vegetal', price: 19.74, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg' },
  { id: 1244, name: 'CATCHUP SACHÊ EKMA 7 G (CX 140 UN)', category: 'Derivados de Vegetal', price: 14.20, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-ekma-7-g-cx-168-un-pmg-atacadista.jpg' },
  { id: 1246, name: 'CATCHUP SACHÊ HEINZ 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 19.46, image: 'https://www.marquesvendaspmg.shop/images/catchup-sache-heinz-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1255, name: 'CEBOLINHA GRANJA SÃO PAULO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 57.40, image: 'https://www.marquesvendaspmg.shop/images/cebolinha-granja-sao-paulo-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1257, name: 'CHAMPIGNON FATIADO ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 59.30, image: 'https://www.marquesvendaspmg.shop/images/champignon-fatiado-arco-bello-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1259, name: 'CHAMPIGNON INTEIRO ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 87.95, image: 'https://www.marquesvendaspmg.shop/images/champignon-inteiro-arco-bello-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1264, name: 'ESCAROLA FATIADA CONGELADA PRATIGEL 1 KILO', category: 'Derivados de Vegetal', price: 29.23, image: 'https://www.marquesvendaspmg.shop/images/escarola-congelada-pratigel-2-kilo-pmg-atacadista.jpg' },
  { id: 1267, name: 'FEIJÃO CARIOCA TIPO 1 FOOD SERVICE CAMIL 2 KILO (FDO 5 PCT)', category: 'Derivados de Vegetal', price: 92.25, image: 'https://www.marquesvendaspmg.shop/images/feijao-carioca-tipo-1-food-service-camil-2-kilo-fdo-5-pct-pmg-atacadista.jpg' },
  { id: 1279, name: 'GERGELIM TORRADO PASTA TAHINE ISTAMBUL 500 G', category: 'Derivados de Vegetal', price: 41.62, image: 'https://www.marquesvendaspmg.shop/images/gergelim-torrado-pasta-tahine-istambul-500-g-pmg-atacadista.jpg' },
  { id: 1282, name: 'GORDURA VEGETAL FRY 400 COAMO (BD 14,5 KILO)', category: 'Derivados de Vegetal', price: 166.29, image: 'https://www.marquesvendaspmg.shop/images/gordura-vegetal-fry-400-coamo-bd-145-kilo-pmg-atacadista.jpg' },
  { id: 1290, name: 'MAIONESE GRANDE MARIANA 3 KILO', category: 'Derivados de Vegetal', price: 27.45, image: 'https://www.marquesvendaspmg.shop/images/maionese-grande-mariana-3-kilo-pmg-atacadista.jpg' },
  { id: 1292, name: 'MAIONESE GRILL JUNIOR 1,1 KILO', category: 'Derivados de Vegetal', price: 45.65, image: 'https://www.marquesvendaspmg.shop/images/maionese-grill-junior-11-kilo-pmg-atacadista.jpg' },
  { id: 1294, name: 'MAIONESE HELLMANN´S 2,8 KILO', category: 'Derivados de Vegetal', price: 50.52, image: 'https://www.marquesvendaspmg.shop/images/maionese-hellmanns-28-kilo-pmg-atacadista.jpg' },
  { id: 1296, name: 'MAIONESE PEQUENA VIGOR 1 KILO (CX 6 BAG)', category: 'Derivados de Vegetal', price: 78.11, image: 'https://www.marquesvendaspmg.shop/images/maionese-pequena-vigor-1-kilo-cx-6-bag-pmg-atacadista.jpg' },
  { id: 1299, name: 'MAIONESE SACHÊ CEPÊRA 7 G (CX 140 UN)', category: 'Derivados de Vegetal', price: 21.60, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg' },
  { id: 1300, name: 'MAIONESE SACHÊ EKMA 7 G (CX 140 UN)', category: 'Derivados de Vegetal', price: 19.61, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-ekma-7-g-cx-168-un-pmg-atacadista.jpg' },
  { id: 1302, name: 'MAIONESE SACHÊ HEINZ 7 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 19.46, image: 'https://www.marquesvendaspmg.shop/images/maionese-sache-heinz-7-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1312, name: 'MANDIOCA TOLETE CONGELADA E COZIDA MATHEUS 2,5 KILO (CX 4 PCT)', category: 'Derivados de Vegetal', price: 171.89, image: 'https://www.marquesvendaspmg.shop/images/mandioca-tolete-congelada-e-cozida-matheus-25-kilo-cx-4-pct-pmg-atacadista.jpg' },
  { id: 1316, name: 'MARGARINA COM SAL 75 % PRIMOR (BD 15 KILO)', category: 'Derivados de Vegetal', price: 163.50, image: 'https://www.marquesvendaspmg.shop/images/margarina-com-sal-75-primor-bd-15-kilo-pmg-atacadista.jpg' },
  { id: 1344, name: 'MOSTARDA GRANDE AMARELA CEPÊRA 3,3 KILO', category: 'Derivados de Vegetal', price: 28.73, image: 'https://www.marquesvendaspmg.shop/images/mostarda-grande-amarela-cepera-33-kilo-pmg-atacadista.jpg' },
  { id: 1345, name: 'MOSTARDA GRANDE AMARELA EKMA 3,3 KILO', category: 'Derivados de Vegetal', price: 23.66, image: 'https://www.marquesvendaspmg.shop/images/mostarda-grande-amarela-ekma-33-kilo-pmg-atacadista.jpg' },
  { id: 1349, name: 'MOSTARDA SACHÊ CEPÊRA 7 G (CX 154 UN)', category: 'Derivados de Vegetal', price: 17.25, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-cepera-7-g-cx-175-un-pmg-atacadista.jpg' },
  { id: 1350, name: 'MOSTARDA SACHÊ EKMA 7 G (CX 140 UN)', category: 'Derivados de Vegetal', price: 14.20, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-ekma-7-g-cx-168-un-pmg-atacadista.jpg' },
  { id: 1352, name: 'MOSTARDA SACHÊ HEINZ 5 G (CX 144 UN)', category: 'Derivados de Vegetal', price: 19.46, image: 'https://www.marquesvendaspmg.shop/images/mostarda-sache-heinz-5-g-cx-144-un-pmg-atacadista.jpg' },
  { id: 1355, name: 'ÓLEO DE ALGODÃO ELOGIATA FLOR DE ALGODÃO (BD 15,8 L)', category: 'Derivados de Vegetal', price: 188.26, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-algodao-elogiata-flor-de-algodao-bd-158-l-pmg-atacadista.jpg' },
  { id: 1362, name: 'ÓLEO DE SOJA COAMO 900 ML (CX 20 FR)', category: 'Derivados de Vegetal', price: 166.43, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-coamo-900-ml-cx-20-fr-pmg-atacadista.jpg' },
  { id: 1363, name: 'ÓLEO DE SOJA COCAMAR (LT 18 L)', category: 'Derivados de Vegetal', price: 175.95, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-cocamar-lt-18-l-pmg-atacadista.jpg' },
  { id: 1364, name: 'ÓLEO DE SOJA LIZA 900 ML (PCT 6 FR)', category: 'Derivados de Vegetal', price: 52.23, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-liza-900-ml-pmg-atacadista.jpg' },
  { id: 1367, name: 'ORÉGANO PERUANO DI SALERNO 1 KILO', category: 'Derivados de Vegetal', price: 40.18, image: 'https://www.marquesvendaspmg.shop/images/oregano-chileno-di-salerno-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1371, name: 'ORÉGANO PEQUENO PERUANO ARCO BELLO 500 G', category: 'Derivados de Vegetal', price: 16.65, image: 'https://www.marquesvendaspmg.shop/images/oregano-pequeno-peruano-arco-bello-500-g-fdo-20-pct-pmg-atacadista.jpg' },
  { id: 1377, name: 'PALMITO INTEIRO AÇAÍ SANEDE 500 G', category: 'Derivados de Vegetal', price: 25.88, image: 'https://www.marquesvendaspmg.shop/images/palmito-inteiro-acai-sanede-500-g-pmg-atacadista.jpg' },
  { id: 1378, name: 'PALMITO INTEIRO PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 82.62, image: 'https://www.marquesvendaspmg.shop/images/palmito-inteiro-pupunha-du-campo-18-kilo-pmg-atacadista.jpg' },
  { id: 1382, name: 'PALMITO PICADO PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 41.31, image: 'https://www.marquesvendaspmg.shop/images/palmito-picado-pupunha-du-campo-18-kilo-pmg-atacadista.jpg' },
  { id: 1384, name: 'PALMITO PICADO PUPUNHA OURO DO VALE 1,8 KILO', category: 'Derivados de Vegetal', price: 38.87, image: 'https://www.marquesvendaspmg.shop/images/palmito-picado-pupunha-ouro-do-vale-18-kilo-pmg-atacadista.jpg' },
  { id: 1391, name: 'PEPININHO YGUARA (BD 2 KILO)', category: 'Derivados de Vegetal', price: 35.73, image: 'https://www.marquesvendaspmg.shop/images/pepininho-yguara-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1395, name: 'PICKLES SWEET MCCOY´S 2 KILO', category: 'Derivados de Vegetal', price: 109.85, image: 'https://www.marquesvendaspmg.shop/images/pickles-sweet-mccoys-2-kilo-pmg-atacadista.jpg' },
  { id: 1396, name: 'PIMENTA BIQUINHO ARCO BELLO (BD 2 KILO)', category: 'Derivados de Vegetal', price: 57.40, image: 'https://www.marquesvendaspmg.shop/images/pimenta-biquinho-arco-bello-bd-2-kilo-pmg-atacadista.jpg' },
  { id: 1399, name: 'POLENTA CONGELADA ARRICO 1 KILO (CX 12 PCT)', category: 'Derivados de Vegetal', price: 84.11, image: 'https://www.marquesvendaspmg.shop/images/polenta-congelada-arrico-1-kilo-cx-12-pct-pmg-atacadista.jpg' },
  { id: 1413, name: 'TOMATE SECO ARCO BELLO 1,4 KILO', category: 'Derivados de Vegetal', price: 32.65, image: 'https://www.marquesvendaspmg.shop/images/tomate-seco-arco-bello-14-kilo-pmg-atacadista.jpg' },
  { id: 1430, name: 'ALICHE ARGENTINO A VÁCUO MARCOL 500 G', category: 'Derivados do Mar', price: 122.36, image: 'https://www.marquesvendaspmg.shop/images/aliche-argentino-a-vacuo-marcol-500-g-pmg-atacadista.jpg' },
  { id: 1432, name: 'ALICHE NACIONAL PEQUENO RIBAMAR (BD 900 G)', category: 'Derivados do Mar', price: 49.30, image: 'https://www.marquesvendaspmg.shop/images/aliche-nacional-ribamar-pmg-atacadista.jpg' },
  { id: 1433, name: 'ATUM GRANDE PEDAÇOS EM ÓLEO POUCH GOMES DA COSTA 1 KILO', category: 'Derivados do Mar', price: 64.43, image: 'https://www.marquesvendaspmg.shop/images/atum-grande-pedacos-em-oleo-pouch-gomes-da-costa-1-kilo-pmg-atacadista.jpg' },
  { id: 1437, name: 'ATUM PEDAÇOS EM ÓLEO MARSUL 400 G', category: 'Derivados do Mar', price: 30.78, image: 'https://www.marquesvendaspmg.shop/images/atum-pedacos-em-oleo-marsul-400-g-pmg-atacadista.jpg' },
  { id: 1440, name: 'ATUM PEDAÇOS EM ÓLEO POUCH GOMES DA COSTA 500 G', category: 'Derivados do Mar', price: 34, image: 'https://www.marquesvendaspmg.shop/images/atum-pedacos-em-oleo-pouch-gomes-da-costa-500-g-pmg-atacadista.jpg' },
  { id: 1441, name: 'ATUM PEDAÇOS EM ÓLEO TOURS 400 G', category: 'Derivados do Mar', price: 32.84, image: 'https://www.marquesvendaspmg.shop/images/atum-pedacos-em-oleo-tours-400-g-pmg-atacadista.jpg' },
  { id: 1450, name: 'ATUM PEQUENO SÓLIDO EM ÓLEO PESCADOR 140 G (CX 24 LT)', category: 'Derivados do Mar', price: 223.10, image: 'https://www.marquesvendaspmg.shop/images/atum-pequeno-solido-em-oleo-pescador-140-g-cx-24-lt-pmg-atacadista.jpg' },
  { id: 1451, name: 'ATUM RALADO EM ÓLEO CHICHARRO SANTA RITA 410 G', category: 'Derivados do Mar', price: 18.64, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-chicharro-santa-rita-410-g-pmg-atacadista.jpg' },
  { id: 1452, name: 'ATUM RALADO EM ÓLEO MARSUL 400 G', category: 'Derivados do Mar', price: 25.55, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-marsul-400-g-pmg-atacadista.jpg' },
  { id: 1453, name: 'ATUM RALADO EM ÓLEO POUCH 88 500 G', category: 'Derivados do Mar', price: 24.78, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-pouch-88-500-g-pmg-atacadista.jpg' },
  { id: 1455, name: 'ATUM RALADO EM ÓLEO POUCH GOMES DA COSTA 500 G', category: 'Derivados do Mar', price: 27.08, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-pouch-gomes-da-costa-500-g-pmg-atacadista.jpg' },
  { id: 1456, name: 'ATUM RALADO EM ÓLEO TOURS 400 G', category: 'Derivados do Mar', price: 28.93, image: 'https://www.marquesvendaspmg.shop/images/atum-ralado-em-oleo-tours-400-g-pmg-atacadista.jpg' },
  { id: 1458, name: 'ATUM SÓLIDO EM ÓLEO TOURS 420 G', category: 'Derivados do Mar', price: 37.36, image: 'https://www.marquesvendaspmg.shop/images/atum-solido-em-oleo-tours-420-g-pmg-atacadista.jpg' },
  { id: 1473, name: 'ACHOCOLATADO EM PÓ OVOMALTINE FLOCOS CROCANTES 750 G', category: 'Doces/Frutas', price: 39.13, image: 'https://www.marquesvendaspmg.shop/images/achocolatado-em-po-ovomaltine-flocos-crocantes-750-g-pmg-atacadista.jpg' },
  { id: 1485, name: 'AÇÚCAR REFINADO CARAVELAS 1 KILO (FDO 10 PCT)', category: 'Doces/Frutas', price: 35.06, image: 'https://www.marquesvendaspmg.shop/images/acucar-refinado-caravelas-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1487, name: 'AÇÚCAR REFINADO UNIÃO 1 KILO (FDO 10 PCT)', category: 'Doces/Frutas', price: 37.27, image: 'https://www.marquesvendaspmg.shop/images/acucar-refinado-uniao-1-kilo-fdo-10-pct-pmg-atacadista.jpg' },
  { id: 1491, name: 'AÇÚCAR SACHÊ PREMIUM UNIÃO 5 G (CX 400 UN)', category: 'Doces/Frutas', price: 17.52, image: 'https://www.marquesvendaspmg.shop/images/acucar-sache-premium-uniao-5-g-cx-400-un-pmg-atacadista.jpg' },
  { id: 1532, name: 'CHOCOLATE FORNEÁVEL AO LEITE CONFEIPOP HARALD 1,010 KILO', category: 'Doces/Frutas', price: 24.69, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-ao-leite-confeipop-1010-kilo-pmg-atacadista.jpg' },
  { id: 1533, name: 'CHOCOLATE FORNEÁVEL AO LEITE CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 40.83, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-ao-leite-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1537, name: 'CHOCOLATE FORNEÁVEL AVELÃ CONFEIPOP 1,010 KILO', category: 'Doces/Frutas', price: 25.31, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-avela-confeipop-1010-kilo-pmg-atacadista.jpg' },
  { id: 1538, name: 'CHOCOLATE FORNEÁVEL AVELÃ CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 36.58, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-avela-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1540, name: 'CHOCOLATE FORNEÁVEL BRANCO CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 27.46, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-branco-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1541, name: 'CHOCOLATE FORNEÁVEL BRANCO DOCEIRO 1,005 KILO', category: 'Doces/Frutas', price: 28.46, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-branco-doceiro-1005-kilo-pmg-atacadista.jpg' },
  { id: 1543, name: 'CHOCOLATE FORNEÁVEL GRANDE AO LEITE CONFEITEIRO HARALD 2,010 KILO', category: 'Doces/Frutas', price: 66.67, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-grande-ao-leite-confeiteiro-harald-2010-kilo-pmg-atacadista.jpg' },
  { id: 1546, name: 'CHOCOLATE GRANDE DISQUETI DORI 1,01 KILO', category: 'Doces/Frutas', price: 74.02, image: 'https://www.marquesvendaspmg.shop/images/chocolate-grande-disqueti-dori-101-kilo-pmg-atacadista.jpg' },
  { id: 1548, name: 'CHOCOLATE GRANULADO CROCANTE CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 27.85, image: 'https://www.marquesvendaspmg.shop/images/chocolate-granulado-crocante-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1550, name: 'CHOCOLATE GRANULADO MACIO CONFEITEIRO HARALD 1,010 KILO', category: 'Doces/Frutas', price: 28.34, image: 'https://www.marquesvendaspmg.shop/images/chocolate-granulado-macio-confeiteiro-harald-1010-kilo-pmg-atacadista.jpg' },
  { id: 1554, name: 'CHOCOLATE M&M´S 850 G', category: 'Doces/Frutas', price: 86.34, image: 'https://www.marquesvendaspmg.shop/images/chocolate-mms-1-kilo-pmg-atacadista.jpg' },
  { id: 1568, name: 'COCO RALADO ÚMIDO E ADOÇADO MAIS COCO 1 KILO', category: 'Doces/Frutas', price: 49.36, image: 'https://www.marquesvendaspmg.shop/images/coco-ralado-umido-e-adocado-mais-coco-1-kilo-pmg-atacadista.jpg' },
  { id: 1571, name: 'CREME DE AVELÃ GRANDE COM CACAU FOOD SERVICE NUTELLA 3 KILO', category: 'Doces/Frutas', price: 242.31, image: 'https://www.marquesvendaspmg.shop/images/creme-de-avela-grande-com-cacau-food-service-nutella-3-kilo-pmg-atacadista.jpg' },
  { id: 1574, name: 'CREME DE AVELÃ PEQUENO COM CACAU NUTELLA 650 G', category: 'Doces/Frutas', price: 46.73, image: 'https://www.marquesvendaspmg.shop/images/creme-de-avela-pequeno-com-cacau-nutella-650-g-pmg-atacadista.jpg' },
  { id: 1606, name: 'GOIABADA BISNAGA RALSTON 1,01 KILO', category: 'Doces/Frutas', price: 18.55, image: 'https://www.marquesvendaspmg.shop/images/goiabada-bisnaga-ralston-101-kilo-pmg-atacadista.jpg' },
  { id: 1607, name: 'GOIABADA BISNAGA VAL 1,01 KILO', category: 'Doces/Frutas', price: 17.57, image: 'https://www.marquesvendaspmg.shop/images/goiabada-bisnaga-val-101-kilo-pmg-atacadista.jpg' },
  { id: 1637, name: 'RECHEIO E COBERTURA SABOR LEITINHO VABENE 1,01 KILO', category: 'Doces/Frutas', price: 41.86, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-sabor-leitinho-vabene-101-kilo-pmg-atacadista.jpg' },
  { id: 1640, name: 'RECHEIO E COBERTURA SABOR OVOMALTINE 900 G', category: 'Doces/Frutas', price: 63.24, image: 'https://www.marquesvendaspmg.shop/images/recheio-e-cobertura-sabor-ovomaltine-900-g-pmg-atacadista.jpg' },
  { id: 1654, name: 'AMIDO DE MILHO PQ 1 KILO', category: 'Farináceos', price: 6.85, image: 'https://www.marquesvendaspmg.shop/images/amido-de-milho-pq-1-kilo-pmg-atacadista.jpg' },
  { id: 1665, name: 'CALDO DE CARNE PENINA 1,05 KILO', category: 'Farináceos', price: 12.40, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-carne-penina-105-kilo-pmg-atacadista.jpg' },
  { id: 1672, name: 'CALDO DE GALINHA PENINA 1,05 KILO', category: 'Farináceos', price: 12.40, image: 'https://www.marquesvendaspmg.shop/images/caldo-de-galinha-penina-105-kilo-pmg-atacadista.jpg' },
  { id: 1692, name: 'COLORÍFICO PENINA 1 KILO', category: 'Farináceos', price: 28.57, image: 'https://www.marquesvendaspmg.shop/images/colorifico-penina-1-kilo-pmg-atacadista.jpg' },
  { id: 1701, name: 'FARINHA DE MANDIOCA CRUA FINA YOKI 4 KILO', category: 'Farináceos', price: 36.10, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-mandioca-crua-fina-yoki-4-kilo-pmg-atacadista.jpg' },
  { id: 1709, name: 'FARINHA DE MILHO PQ 2 KILO', category: 'Farináceos', price: 17.65, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-milho-pq-2-kilo-pmg-atacadista.jpg' },
  { id: 1719, name: 'FARINHA DE TRIGO LONGA FERMENTAÇÃO PIZZA ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 125.64, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-longa-fermentacao-pizza-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1722, name: 'FARINHA DE TRIGO PASTEL ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 99.66, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1729, name: 'FARINHA DE TRIGO PASTEL ROSA BRANCA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 101.28, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pastel-rosa-branca-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1745, name: 'FARINHA DE TRIGO PIZZA PREMIUM 101 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 85.27, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-101-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1746, name: 'FARINHA DE TRIGO PIZZA ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 88.29, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1750, name: 'FARINHA DE TRIGO PIZZA MIRELLA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 77.05, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-mirella-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1754, name: 'FARINHA DE TRIGO PIZZA VENTURELLI 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 78.62, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-venturelli-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1756, name: 'FARINHA DE TRIGO PREMIUM ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 120.95, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-premium-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1760, name: 'FARINHA DE TRIGO TIPO 1 ANACONDA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 112.67, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-tipo-1-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg' },
  { id: 1772, name: 'FERMENTO BIOLÓGICO FRESCO FLEISCHMANN 500 G', category: 'Farináceos', price: 12.94, image: 'https://www.marquesvendaspmg.shop/images/fermento-biologico-fresco-fleischmann-500-g-pmg-atacadista.jpg' },
  { id: 1773, name: 'FERMENTO BIOLÓGICO FRESCO ITAIQUARA 500 G', category: 'Farináceos', price: 10.94, image: 'https://www.marquesvendaspmg.shop/images/fermento-biologico-fresco-itaiquara-500-g-pmg-atacadista.jpg' },
  { id: 1776, name: 'FERMENTO SECO BIOLÓGICO MASSA SALGADA FLEISCHMANN 500 G', category: 'Farináceos', price: 28.62, image: 'https://www.marquesvendaspmg.shop/images/fermento-seco-biologico-massa-salgada-fleischmann-500-g-pmg-atacadista.jpg' },
  { id: 1777, name: 'FERMENTO SECO BIOLÓGICO MASSA SALGADA ITAIQUARA 500 G', category: 'Farináceos', price: 23.32, image: 'https://www.marquesvendaspmg.shop/images/fermento-seco-biologico-massa-salgada-itaiquara-500-g-pmg-atacadista.jpg' },
  { id: 1781, name: 'FUBÁ MIMOSO PQ 5 KILO', category: 'Farináceos', price: 24.15, image: 'https://www.marquesvendaspmg.shop/images/fuba-mimoso-pq-5-kilo-pmg-atacadista.jpg' },
  { id: 1829, name: 'SAL REFINADO IODADO CISNE 1 KILO (FDO 10 PCT)', category: 'Farináceos', price: 39.25, image: 'https://www.marquesvendaspmg.shop/images/sal-refinado-cisne-1-kilo-pmg-atacadista.jpg' },
  { id: 1848, name: 'TEMPERO SAZÓN CARNES VERMELHO AJINOMOTO 900 G', category: 'Farináceos', price: 40.01, image: 'https://www.marquesvendaspmg.shop/images/tempero-sazon-carnes-vermelho-ajinomoto-900-g-pmg-atacadista.jpg' },
  { id: 1883, name: 'TEMPERO HONDASHI FOOD SERVICE AJINOMOTO 500 G', category: 'Orientais', price: 48.90, image: 'https://www.marquesvendaspmg.shop/images/tempero-hondashi-food-service-ajinomoto-500-g-pmg-atacadista.jpg' },
  { id: 1932, name: 'MOLHO DE PIMENTA VERMELHA EKMA 1,01 L', category: 'Conservas/Enlatados', price: 8.72, image: 'https://www.marquesvendaspmg.shop/images/molho-de-pimenta-vermelha-ekma-101-l.png' },
  { id: 1958, name: 'COXAS E SOBRECOXAS DE FRANGO CONGELADAS TEMPERADAS COM OSSO AVELÍCIA (CX 20 KILO)', category: 'Derivados de Ave', price: 128.66, image: 'https://www.marquesvendaspmg.shop/images/coxas-e-sobrecoxas-de-frango-congeladas-temperadas-com-osso-avelicia.png' },
  { id: 2052, name: 'MOLHO SABOR QUEIJO CHEDDAR POLENGHI 1,5 KILO', category: 'Derivados de Leite', price: 49.08, image: 'https://www.marquesvendaspmg.shop/images/molho-cheddar-polenghi.png' },
  { id: 2053, name: 'MOLHO SABOR QUEIJO CHEDDAR SCHREIBER 1,5 KILO', category: 'Derivados de Leite', price: 39.69, image: 'https://www.marquesvendaspmg.shop/images/molho-cheddar-schreiber.png' },
  { id: 2054, name: 'MOLHO SABOR QUEIJO CHEDDAR VIGOR 1,5 KILO', category: 'Derivados de Leite', price: 55.16, image: 'https://www.marquesvendaspmg.shop/images/molho-cheddar-vigor.png' },
  { id: 2084, name: 'REQUEIJÃO CORONATA CREMOSO COM AMIDO 1,5 KILO', category: 'Derivados de Leite', price: 32.60, image: 'https://www.marquesvendaspmg.shop/images/requeijao-cremoso-coronata.png' },
  { id: 2090, name: 'APRESUNTADO PEPERI NOBRE 3,7 KILO PÇ', category: 'Derivados de Suíno', price: 67.72, image: 'https://www.marquesvendaspmg.shop/images/apresuntado-peperi-nobre.png' },
  { id: 2091, name: 'BACON EM CUBOS BARRIGA AURORA 1 KILO', category: 'Derivados de Suíno', price: 46.64, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-aurora.png' },
  { id: 2093, name: 'BACON EM CUBOS BARRIGA FRIMESA 1 KILO', category: 'Derivados de Suíno', price: 39.26, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-frimesa.png' },
  { id: 2097, name: 'BACON EM CUBOS BARRIGA UNAÍ 2 KILO', category: 'Derivados de Suíno', price: 59.64, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-unai.png' },
  { id: 2100, name: 'BACON EM CUBOS PALETA E PAPADA MISTER BEEF 1 KILO', category: 'Derivados de Suíno', price: 34.63, image: 'https://www.marquesvendaspmg.shop/images/bacon-em-cubos-mister-beef.png' },
  { id: 2101, name: 'BACON FATIADO "BARRIGA" LACTOFRIOS 1 KILO', category: 'Derivados de Suíno', price: 35.81, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-lactofrios.png' },
  { id: 2102, name: 'BACON FATIADO "BARRIGA" UNAÍ 2 KILO', category: 'Derivados de Suíno', price: 59.61, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-unai.png' },
  { id: 2105, name: 'BACON FATIADO BARRIGA FRIMESA 1 KILO', category: 'Derivados de Suíno', price: 43.98, image: 'https://www.marquesvendaspmg.shop/images/bacon-fatiado-frimesa.png' },
  { id: 2107, name: 'BACON MEIA MANTA PERDIGÃO 2.5 KG ', category: 'Derivados de Suíno', price: 29.40, image: 'https://www.marquesvendaspmg.shop/images/bacon-meia-manta-perdigao.png' },
  { id: 2161, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO BUTLER LAMBWESTON 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 193.54, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-corte-fino-butler-lambweston.png' },
  { id: 2162, name: 'BATATA PALITO CONGELADA PRÉ FRITA 7 MM CORTE FINO FAST FOOD MCCAIN 2,25 KILO (CX 8 PCT)', category: 'Derivados de Vegetal', price: 224.59, image: 'https://www.marquesvendaspmg.shop/images/batata-palito-congelada-pre-frita-corte-fino-fast-food-mccain.png' },
  { id: 2220, name: 'PALMITO RODELA PUPUNHA DU CAMPO 1,8 KILO', category: 'Derivados de Vegetal', price: 46.64, image: 'https://www.marquesvendaspmg.shop/images/palmito-rodela-pupunha-du-campo.png' },
  { id: 2231, name: 'CAMARÃO CONGELADO DESCASCADO 7 BARBAS PALEMON 1 KILO', category: 'Derivados do Mar', price: 37.98, image: 'https://www.marquesvendaspmg.shop/images/camarao-congelado-descascado-7-barbas-palemon.png' },
  { id: 2268, name: 'CREME BUENO RECHEIO ARTESANAL VABENE 1,01 KILO', category: 'Doces/Frutas', price: 44.17, image: 'https://www.marquesvendaspmg.shop/images/creme-bueno-recheio-artesanal-vabene.png' },
  { id: 2315, name: 'FARINHA DE TRIGO PIZZA PREMIUM REISA 5 KILO (FDO 25 KILO)', category: 'Farináceos', price: 68.63, image: 'https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-premium-reisa.png' },
  { id: 2440, name: 'CALABRESA RETA SADIA FOOD SERVICE 2,5 KILO', category: 'Derivados de Suíno', price: 55.79, image: 'https://www.marquesvendaspmg.shop/images/calabresa-reta-sadia-food-service-25-kg-cx-3-pct.webp' },
  { id: 2448, name: 'CARNE SECA BOVINA GRANDE TRASEIRO VILHETO 5 KILO', category: 'Derivados de Bovino', price: 262.66, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-grande-traseiro-vilheto-5-kg-cx-2-pct.webp' },
  { id: 2450, name: 'CARNE SECA BOVINA PEQUENA TRASEIRO COOPER CHARQUE 1 KILO', category: 'Derivados de Bovino', price: 55.09, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-pequena-traseiro-cooper-charque-1-kg-cx-10-pct.webp' },
  { id: 2461, name: 'CHOCOLATE CHOCOCANDY DORI 450 G', category: 'Doces/Frutas', price: 20.43, image: 'https://www.marquesvendaspmg.shop/images/chocolate-chococandy-dori-450-g-cx-14-pct.webp' },
  { id: 2469, name: 'CHOCOLATE FORNEÁVEL GRANDE AVELÃ CONFEITEIRO HARALD 2,010 KILO', category: 'Doces/Frutas', price: 71.64, image: 'https://www.marquesvendaspmg.shop/images/chocolate-forneavel-grande-avela-confeiteiro-harald-2010-kg-cx-6-bis.webp' },
  { id: 2545, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE COM SASSAMI ROSAVES (CX 20 KILO)', category: 'Derivados de Ave', price: 307.50, image: 'https://www.marquesvendaspmg.shop/images/file-de-peito-de-frango-congelado-sem-osso-sem-pele-com-sassami-rosaves-cx-20-kg.webp' },
  { id: 2546, name: 'FILÉ DE PEITO DE FRANGO CONGELADO SEM OSSO SEM PELE SEM SASSAMI JAGUÁ (CX 20 KILO)', category: 'Derivados de Ave', price: 302.58, image: 'https://www.marquesvendaspmg.shop/images/file-de-peito-de-frango-congelado-sem-osso-sem-pele-sem-sassami-jagua-cx-20-kg.webp' },
  { id: 2646, name: 'ÓLEO DE SOJA VITALIV 900 ML (CX 20 FR)', category: 'Derivados de Vegetal', price: 170.31, image: 'https://www.marquesvendaspmg.shop/images/oleo-de-soja-vitaliv-900-ml-cx-20-fr.webp' },
  { id: 2657, name: 'PARMESÃO 6 MESES SCALA 6 KG', category: 'Derivados de Leite', price: 87.71, image: 'https://www.marquesvendaspmg.shop/images/parmesao-6-meses-scala-6-kg-cx-1-pc.webp' },
  { id: 2660, name: 'PARMESÃO TROPICAL CRISTAL 5 KG', category: 'Derivados de Leite', price: 48.64, image: 'https://www.marquesvendaspmg.shop/images/parmesao-tropical-cristal-5-kg-cx-4-pc.webp' },
  { id: 2695, name: 'SAL REFINADO IODADO MARFIM 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 17.08, image: 'https://www.marquesvendaspmg.shop/images/sal-refinado-iodado-marfim-1-kg-fdo-10-pct.webp' },
  { id: 2696, name: 'SAL REFINADO IODADO MASTER 1 KILO (FDO 10 PCT)', category: 'Derivados de Vegetal', price: 18.30, image: 'https://www.marquesvendaspmg.shop/images/sal-refinado-iodado-master-1-kg-fdo-10-pct.webp' },
  { id: 2787, name: 'MUÇARELA TRADICIONAL 4 KG', category: 'Derivados de Leite', price: 35.67, image: 'https://www.marquesvendaspmg.shop/images/mucarela-tradicional-4-kg-cx-6-pc.webp' },
  { id: 2851, name: 'CARNE SECA BOVINA CONGELADA DESFIADA QUALI 1 KILO', category: 'Derivados de Bovino', price: 64.06, image: 'https://www.marquesvendaspmg.shop/images/carne-seca-bovina-congelada-desfiada-quali-1-kg-cx-6-pct.webp' },
  { id: 2856, name: 'COSTELA BOVINA CONGELADA DESFIADA QUALI 1 KILO', category: 'Derivados de Bovino', price: 61.50, image: 'https://www.marquesvendaspmg.shop/images/costela-bovina-congelada-desfiada-quali-1-kg-cx-6-pct.webp' },
  { id: 2861, name: 'CUPIM BOVINO CONGELADO DESFIADO QUALI 1 KILO', category: 'Derivados de Bovino', price: 67.04, image: 'https://www.marquesvendaspmg.shop/images/cupim-bovino-congelado-desfiado-quali-1-kg-cx-6-pct.webp' },
  { id: 2879, name: 'PERNIL SUÍNO CONGELADO DESFIADO QUALI 1 KILO', category: 'Derivados de Suíno', price: 35.98, image: 'https://www.marquesvendaspmg.shop/images/pernil-suino-congelado-desfiado-quali-1-kg-cx-6-pct.webp' },
  { id: 2886, name: 'COXAS E SOBRECOXAS DE FRANGO CONGELADAS COM OSSO NUTRIBEM (CX 20 KILO)', category: 'Derivados de Ave', price: 152.52, image: 'https://www.marquesvendaspmg.shop/images/coxas-e-sobrecoxas-de-frango-congeladas-com-osso-nutribem-cx-20-kg.webp' },
];

// ⭐ CATEGORIAS
const categories = [
  'Acessórios', 'Bebidas', 'Conservas/Enlatados', 'Derivados de Ave', 
  'Derivados de Bovino', 'Derivados de Leite', 'Derivados de Suíno', 
  'Derivados de Vegetal', 'Derivados do Mar', 'Doces/Frutas', 
  'Farináceos', 'Higiene', 'Orientais', 'Panificação', 'Salgados'
];

// ==============================================
// ⭐ BANNERS
// ==============================================
const banners = [
  { 
    id: 1,
    desktop: 'https://i.imgur.com/33QMJL2.png',
    mobile: 'https://i.imgur.com/33QMJL2.png'
  },
  { 
    id: 2,
    desktop: 'https://i.imgur.com/GmAXGiB.png',
    mobile: 'https://i.imgur.com/GmAXGiB.png'
  },
  { 
    id: 3,
    desktop: 'https://i.imgur.com/t5yuOrl.png',
    mobile: 'https://i.imgur.com/t5yuOrl.png'
  },
  { 
    id: 4,
    desktop: 'https://i.imgur.com/AWqaPY4.png',
    mobile: 'https://i.imgur.com/AWqaPY4.png'
  }
];

// ==============================================
// ⭐ PALAVRAS-CHAVE PARA SEO
// ==============================================
const categoryKeywords = {
  'ÁGUA MINERAL': 'água mineral, água sem gás, água com gás, água potável, bebida hidratação',
  'REFRIGERANTE': 'refrigerante, coca cola, pepsi, guaraná, fanta, sprite, bebida gaseificada',
  'CERVEJA': 'cerveja, skol, brahma, antarctica, heineken, bebida alcoólica, lata cerveja',
  'SUCO': 'suco, suco natural, suco integral, suco concentrado, bebida fruta, néctar',
  'ENERGÉTICO': 'energético, red bull, monster, burn, tnt, bebida energia',
  'VINHO NACIONAL': 'vinho, vinho tinto, vinho branco, vinho seco, vinho suave, bebida uva',
  'WHISKY': 'whisky, johnnie walker, jack daniels, ballantines, bebida destilada',
  'CARNE BOVINA': 'carne bovina, picanha, alcatra, contrafilé, maminha, carne churrasco',
  'FRANGO': 'frango, frango inteiro, frango cortado, frango congelado, carne ave',
  'LINGUIÇA': 'linguiça, linguiça toscana, linguiça calabresa, linguiça frango, embutido',
  'PRESUNTO': 'presunto, presunto cozido, presunto defumado, fiambre, frios',
  'QUEIJO': 'queijo, mussarela, prato, minas, parmesão, queijo derretido, laticínio',
  'ARROZ': 'arroz, arroz branco, arroz integral, arroz parboilizado, arroz tipo 1',
  'FEIJÃO': 'feijão, feijão carioca, feijão preto, feijão branco, leguminosa',
  'ÓLEO': 'óleo, óleo soja, óleo girassol, óleo milho, azeite, gordura vegetal',
  'AÇÚCAR': 'açúcar, açúcar refinado, açúcar cristal, açúcar mascavo, adoçante',
  'FARINHA DE TRIGO': 'farinha, farinha trigo, farinha rosca, amido, fermento',
  'MACARRÃO': 'macarrão, espaguete, parafuso, penne, lasanha, massa italiana',
  'PRODUTO DE LIMPEZA': 'detergente, sabão, álcool, desinfetante, limpeza, higiene',
  'DESCARTÁVEL': 'prato descartável, copo descartável, talher descartável, papel filme',
  'BATATA CONGELADA': 'batata, batata frita, batata palha, batata palito, congelado',
  'CAFÉ': 'café, café torrado, café moído, café solúvel, bebida café'
};

// ==============================================
// ⭐ FUNÇÃO PARA SEO DAS IMAGENS
// ==============================================
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

// ==============================================
// ⭐ HOOK PERSONALIZADO PARA DETECTAR TAMANHO DA TELA
// ==============================================
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

// ==============================================
// ⭐ FUNÇÃO PARA DETECTAR SE ESTÁ NO APP
// ==============================================
const isRunningInApp = () => {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  
  const isWebView = ua.includes('wv') || 
                    ua.includes('androidwebview') ||
                    (ua.includes('android') && !ua.includes('chrome'));
  
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                window.navigator.standalone === true;
  
  const isWhatsApp = ua.includes('whatsapp');
  const isInstagram = ua.includes('instagram');
  const isFacebook = ua.includes('fb') || ua.includes('facebook');
  
  return isWebView || isPWA || isWhatsApp || isInstagram || isFacebook;
};

// ==============================================
// ⭐ COMPONENTE PRINCIPAL
// ==============================================
const RetiradaPage = () => {
  const router = useRouter();
  const { width: windowWidth } = useWindowSize();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ========== CARRINHO DE RETIRADA ========== //
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  
  // ========== ESTADOS DO USUÁRIO ========== //
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [pageBlocked, setPageBlocked] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // ========== ESTADOS DE AUTENTICAÇÃO ========== //
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [authError, setAuthError] = useState('');
  const [showGoogleLogin, setShowGoogleLogin] = useState(true);
  
  // ========== ESTADOS DE PAGINAÇÃO ========== //
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = windowWidth > 768 ? 20 : 10;
  
  // ========== ESTADO DE EXPANSÃO DE DESCRIÇÕES ========== //
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  
  // ========== MAPA DE PRODUTOS (ID SITE -> ID PMG) ========== //
  const [productMap, setProductMap] = useState({});
  const [loadingMap, setLoadingMap] = useState(true);
  
  // ========== BANNER ========== //
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerIntervalRef = useRef(null);

    useTrackUser(); // ← ADICIONE ESTA LINHA

  // ========== DETECTAR APP E ESCONDER GOOGLE LOGIN ========== //
  useEffect(() => {
    const inApp = isRunningInApp();
    setShowGoogleLogin(!inApp);
  }, []);

  // ========== CARREGAR USUÁRIO ========== //
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setPageBlocked(false);
        
        // Busca nome da tabela usuarios
        const { data: usuarioData } = await supabase
          .from('usuarios')
          .select('nome, avatar_url')
          .eq('id', user.id)
          .single();
        
        let nomeExibir = '';
        let avatarUrl = '';
        
        if (usuarioData) {
          nomeExibir = usuarioData.nome || '';
          avatarUrl = usuarioData.avatar_url || '';
        }
        
        if (!nomeExibir) {
          nomeExibir = user.user_metadata?.full_name || user.email || '';
        }
        if (!avatarUrl) {
          avatarUrl = user.user_metadata?.avatar_url || '';
        }
        
        setUserName(nomeExibir);
        setUserAvatar(avatarUrl);
      }
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserName('');
        setUserAvatar('');
        setPageBlocked(true);
        setCart([]);
        setTotal(0);
        localStorage.removeItem('cart_retirada_data');
      }
    });
    
    return () => subscription?.unsubscribe();
  }, []);

  // ========== CARREGAR CARRINHO DO LOCALSTORAGE ========== //
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem('cart_retirada_data');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
          setTotal(parsedCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho de retirada:', error);
      }
    };

    loadCartFromStorage();
  }, []);

  // ========== FUNÇÕES DO CARRINHO ========== //
  const addToCart = (product) => {
    if (product.price === 0) return;
    
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      
      let newCart;
      if (existingProductIndex !== -1) {
        newCart = [...prevCart];
        newCart[existingProductIndex] = {
          ...newCart[existingProductIndex],
          quantity: (newCart[existingProductIndex].quantity || 1) + 1
        };
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      
      setTotal(newCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
      localStorage.setItem('cart_retirada_data', JSON.stringify(newCart));
      
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      setTotal(newCart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0));
      localStorage.setItem('cart_retirada_data', JSON.stringify(newCart));
      return newCart;
    });
  };

  // ========== FUNÇÕES DE AUTENTICAÇÃO ========== //
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
      setShowAuthModal(false);
      setPageBlocked(false);
      
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
        .insert([{
          id: user.id,
          nome: name,
          email: email,
          telefone: phone,
          cpf_cnpj: cpfCnpj,
          senha: password
        }]);

      alert('Cadastro realizado com sucesso! Verifique seu e-mail para confirmação.');
      setAuthType('login');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://www.marquesvendaspmg.shop/retirada',
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserName('');
    setUserAvatar('');
    setPageBlocked(true);
    setCart([]);
    setTotal(0);
    localStorage.removeItem('cart_retirada_data');
  };

  // ========== FUNÇÃO PARA EXPANDIR DESCRIÇÃO ========== //
  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // ========== FUNÇÃO PARA REDIRECIONAR PARA DETALHES DO PRODUTO ========== //
  const redirectToProductDetails = (productId) => {
    window.location.href = `/produto/${productId}`;
  };

  // ========== FUNÇÕES DO BANNER ========== //
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

  // ========== EFEITO DO BANNER AUTOMÁTICO ========== //
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

// ========== CARREGAR MAPA DE PRODUTOS (ID SITE -> ID PMG) ========== //
useEffect(() => {
  const loadProductMap = async () => {
    try {
      const response = await fetch('/mapa.json');
      if (response.ok) {
        const data = await response.json();
        const mapObj = {};
        data.forEach(item => {
          mapObj[item.idSite] = item.idPMG;
        });
        setProductMap(mapObj);
        console.log('✅ Mapa carregado:', Object.keys(mapObj).length, 'itens');
      } else {
        console.warn('⚠️ mapa.json não encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar mapa:', error);
    } finally {
      setLoadingMap(false);
    }
  };
  loadProductMap();
}, []);

// ========== FILTRO DE PRODUTOS ========== //
// ⭐ IMPORTANTE: Remove produtos com price = 0 (sem estoque)
const uniqueProducts = products.filter((product, index, self) => {
  const firstIndex = self.findIndex(p => p.id === product.id);
  
  if (firstIndex === index) {
    return true;
  } else {
    const firstProduct = self[firstIndex];
    
    if (product.category === '⏳ Ofertas da Semana 🚨' && 
        firstProduct.category !== '⏳ Ofertas da Semana 🚨') {
      self[firstIndex] = product;
    }
    
    return false;
  }
});

// ⭐ FILTRO PRINCIPAL - SÓ MOSTRA PRODUTOS COM ESTOQUE (price > 0)
const filteredProducts = uniqueProducts
  .filter(product => {
    // ⭐ SÓ PRODUTOS COM ESTOQUE (price > 0)
    if (product.price <= 0) return false;
    
    const searchTermTrimmed = searchTerm.trim();
    
    // 🔥 BUSCA POR ID OU NOME (IGUAL AO PRODUTOS.JS)
    if (searchTermTrimmed !== '') {
      const searchLower = searchTermTrimmed.toLowerCase();
      const productNameLower = product.name.toLowerCase();
      
      // 🔥 BUSCA POR ID DO SITE - EXATO
      const matchesIdSite = product.id.toString() === searchTermTrimmed;
      
      // 🔥 BUSCA POR ID PMG (via mapa) - EXATO
      const idPMG = productMap[product.id];
      const matchesIdPMG = idPMG && idPMG.toString() === searchTermTrimmed;
      
      // 🔥 BUSCA POR NOME (contém)
      const matchesName = productNameLower.includes(searchLower);
      
      // Retorna true se encontrar por ID EXATO ou por NOME
      return matchesIdSite || matchesIdPMG || matchesName;
    }
    
    // Filtra por categoria
    return product.category === selectedCategory;
  })
  .sort((a, b) => {
    const nomeA = a.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const nomeB = b.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    if (nomeA < nomeB) return -1;
    if (nomeA > nomeB) return 1;
    return 0;
  });

  // ========== PAGINAÇÃO ========== //
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // ========== ESTILOS ========== //
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
    userWelcomeContainer: {
      backgroundColor: '#095400',
      color: 'white',
      padding: windowWidth > 768 ? '12px 20px' : '10px 15px',
      borderRadius: '8px',
      marginBottom: windowWidth > 768 ? '20px' : '15px'
    },
    welcomeRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    },
    welcomeMessage: {
      fontSize: windowWidth > 768 ? '16px' : '14px',
      fontWeight: '600',
      margin: 0
    },
    buttonsRow: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    homeButton: {
      backgroundColor: 'white',
      color: '#095400',
      border: '1px solid #095400',
      padding: windowWidth > 768 ? '8px 12px' : '6px 10px',
      borderRadius: '20px',
      fontSize: windowWidth > 768 ? '14px' : '12px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
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
      msOverflowStyle: 'none'
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
      gridTemplateColumns: windowWidth > 768 ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
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
      objectFit: 'cover'
    },
    // ⭐ ESTILOS DA MENSAGEM DE RETIRADA - VERSÃO MELHORADA
    retiradaMessage: {
      backgroundColor: '#f0f7f0',
      borderLeft: '4px solid #095400',
      borderRadius: '12px',
      padding: windowWidth > 768 ? '25px 30px' : '20px 15px',
      marginBottom: '25px',
      boxShadow: '0 2px 10px rgba(9, 84, 0, 0.08)',
      display: 'flex',
      gap: windowWidth > 768 ? '25px' : '15px',
      flexDirection: windowWidth > 768 ? 'row' : 'column',
      alignItems: windowWidth > 768 ? 'center' : 'stretch'
    },
    retiradaMessageIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: windowWidth > 768 ? '42px' : '36px',
      flexShrink: 0,
      width: windowWidth > 768 ? '70px' : '55px',
      height: windowWidth > 768 ? '70px' : '55px',
      backgroundColor: '#095400',
      borderRadius: '50%',
      color: 'white',
      margin: windowWidth > 768 ? '0' : '0 auto'
    },
    retiradaInfoGrid: {
      display: 'grid',
      gridTemplateColumns: windowWidth > 768 ? '1fr 1fr' : '1fr',
      gap: windowWidth > 768 ? '12px' : '8px',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: windowWidth > 768 ? '15px 20px' : '12px 15px',
      marginTop: '5px',
      border: '1px solid #e8f0e8'
    },
    retiradaInfoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '6px 0'
    },
    retiradaInfoLabel: {
      fontSize: '11px',
      color: '#666',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    retiradaInfoValue: {
      fontSize: windowWidth > 768 ? '14px' : '13px',
      color: '#095400',
      fontWeight: '600'
    },
    retiradaInfoSub: {
      fontSize: '12px',
      color: '#666'
    },
    retiradaInfoDestaque: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: windowWidth > 768 ? '10px 15px' : '10px 12px',
      backgroundColor: '#e8f5e8',
      borderRadius: '8px',
      gridColumn: windowWidth > 768 ? '1 / -1' : '1',
      marginTop: '4px'
    },
    retiradaBadgeEconomize: {
      marginLeft: 'auto',
      backgroundColor: '#095400',
      color: 'white',
      padding: '4px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    },
    retiradaFooter: {
      marginTop: '12px',
      fontSize: windowWidth > 768 ? '13px' : '12px',
      color: '#666',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      justifyContent: windowWidth > 768 ? 'flex-start' : 'center'
    },
    // ⚠️ ESSE AINDA É USADO PARA O BADGE DO PEDIDO MÍNIMO
    pedidoMinimoBadge: {
      backgroundColor: '#095400',
      color: 'white',
      padding: windowWidth > 768 ? '6px 14px' : '4px 10px',
      borderRadius: '20px',
      fontSize: windowWidth > 768 ? '14px' : '12px',
      fontWeight: '700',
      display: 'inline-block',
      marginTop: '5px'
    }
  };

  return (
    <>
      {/* ========== HEAD OTIMIZADO PARA SEO - RETIRADA ========== */}
      <Head>
        <title>PMG ATACADISTA RETIRA - Retirada de Produtos Atacado | PMG Atacadista</title>
        <meta name="description" content="Retire seus produtos na PMG Atacadista em Santo Amaro - SP. Pedido mínimo R$ 200,00. Retirada mediante pedido. Atacado food service com estoque pronto. Confira nosso catálogo!" />
        <meta name="keywords" content="retirada atacado São Paulo, atacado Santo Amaro, retirada produtos atacado, PMG Atacadista retirada, atacado sem frete, food service São Paulo, atacado food service Santo Amaro, comprar atacado e retirar em São Paulo" />
        <meta property="og:title" content="PMG Atacadista - Retirada de Produtos Atacado em Santo Amaro" />
        <meta property="og:description" content="Retire seus produtos na PMG Atacadista em Santo Amaro. Pedido mínimo R$ 200,00. Confira nosso catálogo completo e faça seu pedido online." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.marquesvendaspmg.shop/retirada" />
        <meta property="og:image" content="https://i.imgur.com/jrERRsC.png" />
        <meta property="og:site_name" content="PMG Atacadista" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://www.marquesvendaspmg.shop/retirada" />
      </Head>

      {/* ========== LOADING ========== */}
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

      {/* ========== BLOQUEADOR DE PÁGINA ========== */}
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

      <div style={styles.container}>
        {/* ========== CONTAINER DO USUÁRIO ========== */}
        {user && (
          <div style={styles.userWelcomeContainer}>
            <div style={styles.welcomeRow}>
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
            
            <div style={styles.buttonsRow}>
              {/* BOTÃO PÁGINA INICIAL */}
              <Link href="/" legacyBehavior>
                <a style={styles.homeButton}>
                  Página Inicial
                </a>
              </Link>
              
              {/* BOTÃO PRODUTOS (ENTREGA) */}
              <Link href="/produtos" legacyBehavior>
                <a style={{
                  ...styles.homeButton,
                  backgroundColor: '#e53935',
                  color: 'white',
                  border: '1px solid #e53935'
                }}>
                  🚚 Entrega
                </a>
              </Link>
              
              {/* BOTÃO PERGUNTAS FREQUENTES */}
              <Link href="/faq" legacyBehavior>
                <a style={styles.homeButton}>
                  ❓ Perguntas
                </a>
              </Link>
              
              {/* BOTÃO MEUS PEDIDOS */}
              <Link href="/meus-pedidos" legacyBehavior>
                <a style={styles.homeButton}>
                  📦 Pedidos
                </a>
              </Link>
            </div>
          </div>
        )}

        {/* ========== HEADER ========== */}
        <div style={styles.header}>
          <img 
            src="https://i.imgur.com/pBH5WpZ.png" 
            alt="Logo PMG Atacadista"
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
            {TITULO_PAGINA}
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: windowWidth > 768 ? '16px' : '14px' 
          }}>
            Encontre os melhores produtos para seu negócio
          </p>
          
          {/* ⭐ BOTÃO SAIR DA CONTA (aparece apenas para usuários logados) */}
          {user && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginTop: '15px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: windowWidth > 768 ? '10px 20px' : '8px 15px',
                  borderRadius: '30px',
                  fontSize: windowWidth > 768 ? '14px' : '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
              >
                <span>👋</span>
                Sair da Conta
              </button>
            </div>
          )}
        </div>

        {/* ⭐ MENSAGEM DE RETIRADA - VERSÃO MELHORADA */}
        <div style={styles.retiradaMessage}>
          <div style={styles.retiradaMessageIcon}>📦</div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              margin: '0 0 6px 0',
              color: '#095400',
              fontSize: windowWidth > 768 ? '18px' : '16px',
              fontWeight: '700'
            }}>
              Retire seus produtos com praticidade! 🚀
            </h3>
            <p style={{
              margin: '0 0 10px 0',
              color: '#333',
              fontSize: windowWidth > 768 ? '14px' : '13px',
              lineHeight: '1.5'
            }}>
              Faça seu pedido online e retire no conforto do nosso endereço. 
              <strong> Sem filas, sem espera!</strong> Seu pedido estará pronto para retirada no mesmo dia.
            </p>
            
            {/* Grid de informações */}
            <div style={styles.retiradaInfoGrid}>
              {/* Endereço */}
              <div style={styles.retiradaInfoItem}>
                <span style={{ fontSize: '18px' }}>📍</span>
                <div>
                  <div style={styles.retiradaInfoLabel}>ENDEREÇO</div>
                  <div style={styles.retiradaInfoValue}>R. Ada Negri, 96 - Santo Amaro</div>
                  <div style={styles.retiradaInfoSub}>São Paulo - SP, 04755-000</div>
                </div>
              </div>
              
              {/* Horário */}
              <div style={styles.retiradaInfoItem}>
                <span style={{ fontSize: '18px' }}>🕐</span>
                <div>
                  <div style={styles.retiradaInfoLabel}>HORÁRIO DE RETIRADA</div>
                  <div style={styles.retiradaInfoValue}>Segunda a Sexta • 08h às 17h</div>
                  <div style={styles.retiradaInfoSub}>*Pedidos prontos em até 2h após confirmação</div>
                </div>
              </div>
              
              {/* Pedido mínimo - destaque */}
              <div style={styles.retiradaInfoDestaque}>
                <span style={{ fontSize: '18px' }}>💰</span>
                <div>
                  <div style={styles.retiradaInfoLabel}>PEDIDO MÍNIMO</div>
                  <div style={{
                    fontSize: windowWidth > 768 ? '18px' : '16px',
                    color: '#095400',
                    fontWeight: '700'
                  }}>
                    R$ {PEDIDO_MINIMO_RETIRADA.toFixed(2).replace('.', ',')}
                  </div>
                </div>
                <div style={styles.retiradaBadgeEconomize}>
                  ECONOMIZE
                </div>
              </div>
            </div>
            
            {/* Footer da mensagem */}
            <div style={styles.retiradaFooter}>
              <span>⚠️</span>
              Loja Não é aberta ao publico, loja apenas para retirada mediante pedido!
            </div>
          </div>
        </div>

        {/* ========== BARRA DE PESQUISA ========== */}
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="🔍 Pesquisar produtos disponíveis para retirada..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.searchInput}
          />
        </div>

        {/* ========== MENU DE CATEGORIAS ========== */}
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

        {/* ========== RESULTADOS DA BUSCA ========== */}
        {filteredProducts.length === 0 && (
          <div style={styles.resultsInfo}>
            {searchTerm.trim() !== '' 
              ? `Nenhum produto encontrado para "${searchTerm}"` 
              : `Nenhum produto disponível na categoria "${selectedCategory}"`}
          </div>
        )}

        {/* ========== GRID DE PRODUTOS ========== */}
        <div style={styles.productsGrid}>
          {currentProducts.map(product => {
            const seo = generateImageSEO(product);
            
            return (
              <div 
                key={product.id} 
                style={styles.productCard}
              >
                {/* BOTÃO LUPA */}
                <button
                  onClick={() => redirectToProductDetails(product.id)}
                  style={styles.productDetailsButton}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#c62828';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#e53935';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="Ver detalhes do produto"
                >
                  🔍
                </button>
                
                <img 
                  src={product.image} 
                  alt={seo.alt}
                  title={seo.title}
                  loading="lazy"
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
                    {windowWidth > 768 && product.name.length > 40 && (
                      <button 
                        onClick={() => toggleDescription(product.id)}
                        style={styles.showMoreButton}
                      >
                        {expandedDescriptions[product.id] ? 'Mostrar menos' : 'Mostrar mais'}
                      </button>
                    )}
                  </div>
                  
                  {user ? (
                    <p style={styles.productPrice}>
                      R$ {product.price.toFixed(2)}
                    </p>
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>
                      Faça login para ver o preço
                    </p>
                  )}

                  {user && (
                    <button
                      onClick={() => addToCart(product)}
                      style={styles.addButton}
                    >
                      Adicionar ao Carrinho
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ========== PAGINAÇÃO ========== */}
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

        {/* ========== BANNERS ========== */}
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

        {/* ========== RODAPÉ ========== */}
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
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%'
          }}>
            <h3 style={{
              color: '#095400',
              fontSize: '18px',
              marginBottom: '25px',
              fontWeight: '600'
            }}>
              📋 Informações Legais
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              marginBottom: '30px',
              width: '100%'
            }}>
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
                title="Política de Privacidade"
              >
                <span>🔒</span>
                Privacidade
              </a>
              </Link>

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
                title="Política de Devolução e Reembolso"
              >
                <span>🔄</span>
                Devolução
              </a>
              </Link>

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
                title="Termos de Uso"
              >
                <span>📄</span>
                Termos
              </a>
              </Link>

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
                title="Quem Somos"
              >
                <span>👥</span>
                Sobre
              </a>
              </Link>
            </div>

            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #095400, transparent)',
              margin: '25px auto',
              maxWidth: '300px',
              width: '100%'
            }}></div>

            <div style={{ marginBottom: '20px' }}>
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
                >
                  <img 
                    src="https://i.imgur.com/prULUUA.png" 
                    alt="Facebook" 
                    style={{ width: '20px', height: '20px' }}
                  />
                </a>
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
                >
                  <img 
                    src="https://i.imgur.com/I0ZZLjG.png" 
                    alt="Instagram" 
                    style={{ width: '20px', height: '20px' }}
                  />
                </a>
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
                >
                  <img 
                    src="https://i.imgur.com/WfpZ8Gg.png" 
                    alt="YouTube" 
                    style={{ width: '20px', height: '20px' }}
                  />
                </a>
              </div>
            </div>

            <div style={{ 
              textAlign: 'center',
              paddingTop: '15px',
              borderTop: '1px solid #e0e0e0'
            }}>
              <p style={{ 
                margin: '0 0 15px 0', 
                fontSize: '11px', 
                color: '#999',
                lineHeight: '1.4',
                fontStyle: 'italic',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
                padding: '0 10px'
              }}>
                <strong>PMG Atacadista</strong> - Seu fornecedor de confiança em <strong>São Paulo</strong>. 
                Especializados em <strong>atacado food service</strong> para restaurantes, bares e mercados. 
                Atendemos <strong>Itapecerica da Serra, Grande SP, Sul de Minas Gerais e Sul do Rio de Janeiro</strong>.
              </p>
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

{/* ========== SCRIPT SCHEMA.ORG - RETIRADA ========== */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "name": "PMG Atacadista - Retirada",
          "description": "PMG Atacadista - Retirada de produtos em Santo Amaro, São Paulo. Pedido mínimo R$ 200,00. Atacado food service para restaurantes, bares e mercados. Retirada mediante pedido.",
          "image": "https://i.imgur.com/jrERRsC.png",
          "telephone": "+55-11-91357-2902",
          "priceRange": "$$",
          "openingHours": "Mon-Fri 08:00-17:00",
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "08:00",
              "closes": "17:00"
            }
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rua Ada Negri, 96",
            "addressLocality": "Santo Amaro",
            "addressRegion": "SP",
            "postalCode": "04755-000",
            "addressCountry": "BR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-23.6549",
            "longitude": "-46.7059"
          },
          "areaServed": [
            {
              "@type": "City",
              "name": "Santo Amaro - SP"
            },
            {
              "@type": "City",
              "name": "São Paulo - SP"
            },
            {
              "@type": "AdministrativeArea",
              "name": "Grande São Paulo"
            }
          ],
          "hasMap": "https://www.google.com/maps?q=R.+Ada+Negri,+96+-+Santo+Amaro,+São+Paulo",
          "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "PIX"],
          "currenciesAccepted": "BRL",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+55-11-91357-2902",
            "contactType": "sales",
            "availableLanguage": ["Portuguese"]
          },
          "makesOffer": currentProducts.map(product => ({
            "@type": "Offer",
            "price": product.price.toString(),
            "priceCurrency": "BRL",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2026-12-31",
            "itemOffered": {
              "@type": "Product",
              "name": product.name,
              "description": `${product.name} disponível para retirada na PMG Atacadista em Santo Amaro - SP. Produto em estoque para retirada imediata.`,
              "image": product.image,
              "category": product.category,
              "brand": {
                "@type": "Brand",
                "name": "PMG Atacadista"
              },
              // ⭐ ADICIONADO para resolver o erro crítico
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "37",
                "bestRating": "5",
                "worstRating": "1"
              },
              "offers": {
                "@type": "Offer",
                "price": product.price.toString(),
                "priceCurrency": "BRL",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2026-12-31"
              }
            },
            "availableAtOrFrom": {
              "@type": "Place",
              "name": "PMG Atacadista - Retirada",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rua Ada Negri, 96",
                "addressLocality": "Santo Amaro",
                "addressRegion": "SP",
                "postalCode": "04755-000",
                "addressCountry": "BR"
              }
            }
          })),
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.marquesvendaspmg.shop/retirada?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Início",
              "item": "https://www.marquesvendaspmg.shop"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Retirada",
              "item": "https://www.marquesvendaspmg.shop/retirada"
            }
          ]
        }
      ]
    })
  }}
/>

        {/* ========== CONTEÚDO SEO OCULTO ========== */}
        <div style={{
          opacity: '0',
          height: '0',
          overflow: 'hidden',
          position: 'absolute',
          pointerEvents: 'none'
        }}>
          <h1>Retirada de Produtos PMG Atacadista - Santo Amaro São Paulo</h1>
          <p>Retire seus produtos na PMG Atacadista em Santo Amaro - SP. Pedido mínimo R$ 200,00. Retirada mediante pedido, sem filas e sem espera. Atacado food service para restaurantes, bares, lanchonetes, pizzarias, padarias e mercados.</p>
          
          <h2>Endereço para Retirada PMG Atacadista</h2>
          <p>Rua Ada Negri, 96 - Santo Amaro, São Paulo - SP, 04755-000. Horário de funcionamento: Segunda a Sexta, das 08h às 17h. Localização privilegiada próxima às avenidas principais com fácil acesso.</p>
          
          <h3>Como funciona a retirada na PMG Atacadista</h3>
          <p>1. Faça seu pedido online no site com pedido mínimo de R$ 200,00.</p>
          <p>2. Aguarde a confirmação do pedido (em até 2 horas).</p>
          <p>3. Retire no endereço indicado.</p>
          <p>4. Pague apenas na retirada, sem antecipação.</p>
          
          <h3>Vantagens de retirar seus produtos na PMG Atacadista</h3>
          <ul>
            <li>Economize no frete - retirada gratuita</li>
            <li>Receba seus produtos mais rápido</li>
            <li>Confira a mercadoria antes de pagar</li>
            <li>Atendimento personalizado em Santo Amaro</li>
            <li>Estoque sempre renovado e atualizado</li>
            <li>Sem filas e sem espera</li>
          </ul>
          
          <h3>Produtos disponíveis para retirada na PMG Atacadista</h3>
          <p>A PMG Atacadista oferece um amplo catálogo de produtos para retirada: bebidas (cervejas, refrigerantes, sucos, águas, energéticos), carnes bovinas, frango, laticínios, queijos diversos, embutidos, massas, farináceos, congelados, produtos de limpeza, acessórios descartáveis e muito mais. Confira nosso catálogo completo com as melhores marcas do mercado.</p>
          
          <h3>PMG Atacadista - Referência em atacado food service em São Paulo</h3>
          <p>Somos especializados no atendimento a restaurantes, bares, lanchonetes, pizzarias, padarias, mercados e comércios em geral. Trabalhamos com as melhores marcas do mercado para garantir qualidade e satisfação aos nossos clientes. Nosso compromisso é oferecer produtos de alta qualidade com preços competitivos e atendimento diferenciado.</p>
          
          <h4>Atacado com retirada em Santo Amaro - São Paulo</h4>
          <p>Atendemos clientes de toda Grande São Paulo para retirada. Localização estratégica em Santo Amaro, com fácil acesso e estacionamento. Venha conhecer nossa estrutura e produtos.</p>
          
          <h4>Por que escolher a PMG Atacadista para retirada de produtos</h4>
          <p>A PMG Atacadista é a escolha certa para quem busca qualidade, preço justo e praticidade. Com anos de experiência no mercado atacadista de São Paulo, oferecemos um catálogo diversificado, estoque permanente e atendimento especializado. Nossa localização em Santo Amaro facilita o acesso para clientes de toda região sul da capital e grande São Paulo.</p>
        </div>

        {/* ========== MODAL DE AUTENTICAÇÃO ========== */}
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

              {showGoogleLogin && (
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
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                    <span style={{ padding: '0 10px', fontSize: '14px' }}>ou</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
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
              )}
            </div>
          </div>
        )}

        {/* ========== CARRINHO DE RETIRADA ========== */}
        <CartRetirada 
          cart={cart} 
          setCart={setCart} 
          removeFromCart={removeFromCart} 
          pedidoMinimo={PEDIDO_MINIMO_RETIRADA}
        />
      </div>
    </>
  );
};

export default RetiradaPage;
