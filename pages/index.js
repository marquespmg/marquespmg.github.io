import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import useTrackUser from '../hook/useTrackUser';


export default function Home() {
  useTrackUser(); // ← ADICIONE ESTA LINHA
  const banners = [
    { 
      id: 1,
      desktop: 'https://i.imgur.com/MiXi0pu.png',
      mobile: 'https://i.imgur.com/MiXi0pu.png'
    },
    { 
      id: 2,
      desktop: 'https://i.imgur.com/ivorfK2.png',
      mobile: 'https://i.imgur.com/ivorfK2.png'
    },
    { 
      id: 3,
      desktop: 'https://i.imgur.com/ennvys5.png',
      mobile: 'https://i.imgur.com/ennvys5.png'
    },
    { 
      id: 4,
      desktop: 'https://i.imgur.com/8toaBek.png',
      mobile: 'https://i.imgur.com/8toaBek.png'
    },
    { 
      id: 5,
      desktop: 'https://i.imgur.com/fRuEjY3.png',
      mobile: 'https://i.imgur.com/fRuEjY3.png'
    },
    { 
      id: 6,
      desktop: 'https://i.imgur.com/JD4UqWo.png',
      mobile: 'https://i.imgur.com/JD4UqWo.png'
    }
  ];

  // Dados das avaliações
const avaliacoes = [
  // Femininas (8 avaliações)
  { 
    foto: "https://i.imgur.com/R4MCf34.png", 
    nome: "Ana", 
    texto: "Apesar de um pequeno atraso, o produto chegou perfeito e o preço compensou!", 
    estrelas: 4 
  },
  { 
    foto: "https://i.imgur.com/R4MCf34.png", 
    nome: "Claudia", 
    texto: "Site super fácil de usar e o atendimento foi super atencioso. Recomendo!", 
    estrelas: 5 
  },
  { 
    foto: "https://i.imgur.com/R4MCf34.png", 
    nome: "Fernanda", 
    texto: "Produto com qualidade acima do esperado pelo preço que paguei. Adorei!", 
    estrelas: 5 
  },
  { 
    foto: "https://i.imgur.com/R4MCf34.png", 
    nome: "Juliana", 
    texto: "Tive um problema com o pedido mas resolveram rapidinho. Ótimo serviço!", 
    estrelas: 4 
  },
  { 
    foto: "https://i.imgur.com/R4MCf34.png", 
    nome: "Patrícia", 
    texto: "Já é minha terceira compra e nunca me decepcionou. Entrega rápida!", 
    estrelas: 5 
  },
  { 
    foto: "https://i.imgur.com/R4MCf34.png", 
    nome: "Camila", 
    texto: "Produto exatamente como na descrição. Veio bem embalado e sem amassados.", 
    estrelas: 5 
  },
  { 
    foto: "https://i.imgur.com/R4MCf34.png", 
    nome: "Luana", 
    texto: "Adorei a variedade! Encontrar tudo num só lugar facilitou muito.", 
    estrelas: 5 
  },
  { 
    foto: "https://i.imgur.com/R4MCf34.png", 
    nome: "Mariana", 
    texto: "Preço justo e produto de qualidade. Virei cliente fiel!", 
    estrelas: 5 
  },

  // Masculinas (7 avaliações)
  { 
    foto: "https://i.imgur.com/CL3oucA.png", 
    nome: "Carlos", 
    texto: "Atendimento foi excelente! Tirou todas minhas dúvidas antes de eu comprar.", 
    estrelas: 5 
  },
  { 
    foto: "https://i.imgur.com/CL3oucA.png", 
    nome: "Ricardo", 
    texto: "Demorou um pouco mais que o previsto, mas o produto é top. Valeu a pena!", 
    estrelas: 4 
  },
  { 
    foto: "https://i.imgur.com/CL3oucA.png", 
    nome: "Bruno", 
    texto: "Produto chegou antes do prazo! Muito bem embalado e sem defeitos.", 
    estrelas: 5 
  },
  { 
    foto: "https://i.imgur.com/CL3oucA.png", 
    nome: "Lucas", 
    texto: "Não conhecia mas arrisquei e gostei bastante. Site organizado e fácil.", 
    estrelas: 4 
  },
  { 
    foto: "https://i.imgur.com/CL3oucA.png", 
    nome: "Marcos", 
    texto: "Preço imbatível! Consegui um ótimo negócio para meu comércio.", 
    estrelas: 5 
  },
  { 
    foto: "https://i.imgur.com/CL3oucA.png", 
    nome: "Gustavo", 
    texto: "Ótimo custo-benefício. Já indiquei para vários amigos!", 
    estrelas: 5 
  },
  { 
    foto: "https://i.imgur.com/CL3oucA.png", 
    nome: "Rodrigo", 
    texto: "Comprei com receio mas fui surpreendido pela qualidade. Recomendo!", 
    estrelas: 5 
  }
];

  // Estado do carrossel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 400 });
  const slideInterval = useRef(null);
  const carouselRef = useRef(null);
  const avaliacoesRef = useRef(null);

  // Estados para as notificações
  const [showFreteToast, setShowFreteToast] = useState(false);
  const [showWhatsappToast, setShowWhatsappToast] = useState(false);
  const toastTimers = useRef([]);

  // Verifica o tamanho da tela e calcula proporções
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (carouselRef.current) {
        const width = carouselRef.current.offsetWidth;
        const height = mobile ? width / 2 : Math.min(width / 3, 400);
        setDimensions({ width, height });
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Navegação do carrossel
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    resetInterval();
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    resetInterval();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetInterval();
  };

  // Controle do intervalo automático
  const resetInterval = () => {
    clearInterval(slideInterval.current);
    startInterval();
  };

  const startInterval = () => {
    slideInterval.current = setInterval(() => {
      goToNextSlide();
    }, 5000);
  };

  // Configuração das notificações
  const showToast = (toastType) => {
    if (toastType === 'frete') {
      setShowFreteToast(true);
      const timer = setTimeout(() => {
        setShowFreteToast(false);
      }, 10000);
      toastTimers.current.push(timer);
    } else if (toastType === 'whatsapp') {
      setShowWhatsappToast(true);
      const timer = setTimeout(() => {
        setShowWhatsappToast(false);
      }, 10000);
      toastTimers.current.push(timer);
    }
  };

  const hideToast = (toastType) => {
    if (toastType === 'frete') {
      setShowFreteToast(false);
    } else if (toastType === 'whatsapp') {
      setShowWhatsappToast(false);
    }
  };

  // Iniciar temporizadores das notificações
  useEffect(() => {
    const freteTimer = setTimeout(() => {
      showToast('frete');
    }, 15000);

    const whatsappTimer = setTimeout(() => {
      showToast('whatsapp');
    }, 24000);

    toastTimers.current.push(freteTimer, whatsappTimer);

    return () => {
      clearInterval(slideInterval.current);
      toastTimers.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <>
<Head>
  {/* Título Otimizado */}
  <title>Marques Vendas PMG - Distribuidora Food Service | Atacadista em Itapecerica da Serra</title>
  
  {/* Meta Description Otimizada */}
  <meta name="description" content="Distribuidora autorizada Marques Vendas PMG - Atacadista food service com produtos de qualidade para restaurantes, bares e mercados. Entrega rápida na região. Atendimento especializado." />
  
  {/* Viewport */}
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover" />
  
  {/* Charset */}
  <meta charSet="utf-8" />
  
  {/* Google Verification */}
  <meta name="google-site-verification" content="OM6ZA5lhy6ZCDjG8LU-PTFcF4QORtpkNh7f_JHt5Ctc" />
  
  {/* ========== OPEN GRAPH (Facebook/WhatsApp) ========== */}
  <meta property="og:title" content="Marques Vendas PMG - Distribuidora Food Service | Atacadista Autorizado" />
  <meta property="og:description" content="Distribuidora autorizada com produtos de qualidade para seu negócio. Entrega rápida e atendimento especializado." />
  <meta property="og:image" content="https://i.imgur.com/pBH5WpZ.png" />
  <meta property="og:url" content="https://www.marquesvendaspmg.shop" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Marques Vendas PMG" />
  <meta property="og:locale" content="pt_BR" />
  
  {/* Open Graph para o Vídeo */}
  <meta property="og:video" content="https://www.youtube.com/embed/xOPT4YXLV2E" />
  <meta property="og:video:type" content="text/html" />
  <meta property="og:video:width" content="1280" />
  <meta property="og:video:height" content="720" />
  <meta property="og:video:secure_url" content="https://www.youtube.com/embed/xOPT4YXLV2E" />
  
  {/* ========== TWITTER CARD ========== */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Marques Vendas PMG - Distribuidora Food Service" />
  <meta name="twitter:description" content="Distribuidora autorizada com produtos de qualidade para restaurantes, bares e mercados." />
  <meta name="twitter:image" content="https://i.imgur.com/pBH5WpZ.png" />
  <meta name="twitter:site" content="@marquesvendaspmg" />
  
  {/* ========== SCHEMA.ORG (Google Rich Results) ========== */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Marques Vendas PMG",
	  "image": "https://i.imgur.com/jrERRsC.png",
      "description": "Distribuidora autorizada food service com produtos de qualidade para restaurantes, bares e mercados",
      "url": "https://www.marquesvendaspmg.shop",
      "telephone": "+55-11-91357-2902",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Estrada Ferreira Guedes, 784 - Potuverá",
        "addressLocality": "Itapecerica da Serra",
        "addressRegion": "SP",
        "postalCode": "06885-150",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-23.7167",
        "longitude": "-46.8492"
      },
      "openingHours": "Mo-Fr 08:00-18:00, Sa 08:00-12:00",
      "priceRange": "$$",
      "areaServed": "Grande São Paulo",
      "sameAs": [
        "https://www.facebook.com/MarquesVendaspmg",
        "https://www.instagram.com/marquesvendaspmg",
        "https://www.youtube.com/@MarquesVendasPMG"
      ]
    })}
  </script>
  
{/* Schema para Vídeo - VERSÃO CORRIGIDA COM DADOS REAIS */}
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "PMG Atacadista 2025 | 30 Anos Conectando Negócios, Confiança e Resultados",
    "description": "Há 30 anos a PMG Atacadista conecta negócios com confiança e resultados sólidos. Distribuidora food service em Itapecerica da Serra.",
    "thumbnailUrl": "https://img.youtube.com/vi/xOPT4YXLV2E/maxresdefault.jpg",
    "uploadDate": "2025-10-08T19:10:00-03:00", // 8 de outubro de 2025, 10:00 AM
    "duration": "PT3M20S", // 3 minutos e 20 segundos EXATOS
    "contentUrl": "https://www.youtube.com/watch?v=xOPT4YXLV2E",
    "embedUrl": "https://www.youtube.com/embed/xOPT4YXLV2E",
    "publisher": {
      "@type": "Organization",
      "name": "Marques Vendas PMG",
      "logo": {
        "@type": "ImageObject",
        "url": "https://i.imgur.com/pBH5WpZ.png"
      }
    }
  })}
</script>

{/* SCHEMA - Products (completo e otimizado para SEO) */}
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    // PRODUTO 1
    {
      "@type": "Product",
      "name": "MUÇARELA BARI 4 KG",
      "description": "Queijo Muçarela Bari 4kg - Produto de alta qualidade para restaurantes, bares e mercados.",
      "category": "Derivados de Leite",
      "image": "https://i.imgur.com/J3OqbkZ.png",
      "brand": {
        "@type": "Brand",
        "name": "Bari"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "37"
      },
      "review": [
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Carlos, pizzaria cliente da PMG" },
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
          "author": { "@type": "Person", "name": "Fernanda, restaurante parceiro" },
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
        "price": "27.63",
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
            "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "d" },
            "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "d" }
          },
          "shippingDestination": [
            { "@type": "DefinedRegion", "addressCountry": "BR", "addressRegion": "SP" },
            { "@type": "DefinedRegion", "addressCountry": "BR", "addressRegion": "MG", "name": "Sul de Minas" },
            { "@type": "DefinedRegion", "addressCountry": "BR", "addressRegion": "RJ", "name": "Sul do Rio de Janeiro" }
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
          "price": "27.63",
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
    },

    // PRODUTO 2
    {
      "@type": "Product",
      "name": "MUÇARELA TRÊS MARIAS RONDÔNIA OURO PRETO 4 KG",
      "description": "Queijo Muçarela Três Marias Rondônia Ouro Preto 4kg - Qualidade premium para food service.",
      "category": "Derivados de Leite",
      "image": "https://i.imgur.com/6I3X8vV.png",
      "brand": {
        "@type": "Brand",
        "name": "Três Marias"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "25"
      },
      "review": [
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Luciana, confeitaria parceira" },
          "datePublished": "2025-09-05",
          "reviewBody": "A muçarela Três Marias tem sabor incrível e chegou em perfeito estado. Recomendo o site da Marques Vendas PMG!",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          }
        },
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Rogério, pizzaiolo de São Paulo" },
          "datePublished": "2025-08-17",
          "reviewBody": "Entrega rápida e qualidade impecável. A PMG sempre cumpre o prazo!",
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
        "price": "35.28",
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
            "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "d" },
            "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "d" }
          },
          "shippingDestination": [
            { "@type": "DefinedRegion", "addressCountry": "BR", "addressRegion": "SP" },
            { "@type": "DefinedRegion", "addressCountry": "BR", "addressRegion": "MG", "name": "Sul de Minas" },
            { "@type": "DefinedRegion", "addressCountry": "BR", "addressRegion": "RJ", "name": "Sul do Rio de Janeiro" }
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
          "price": "35.28",
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
  "areaServed": [
    {
      "@type": "AdministrativeArea",
      "name": "Grande São Paulo",
      "description": "Atacado Grande São Paulo, Distribuidora Grande SP, Fornecedor alimentos Grande São Paulo, Atacadista food service Grande SP"
    },
    {
      "@type": "AdministrativeArea", 
      "name": "Interior de São Paulo",
      "description": "Atacado interior São Paulo, Distribuidora interior SP, Fornecedor interior São Paulo, Atacadista food service interior SP"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Capital de São Paulo",
      "description": "Atacado São Paulo capital, Distribuidora São Paulo, Fornecedor alimentos São Paulo, Atacadista bebidas São Paulo, Food service São Paulo"
    },
    {
      "@type": "City",
      "name": "Santo Amaro - SP",
      "description": "Atacado Santo Amaro, Distribuidora Santo Amaro, Fornecedor alimentos Santo Amaro, Atacadista bebidas Santo Amaro, Food service Santo Amaro SP"
    },
    {
      "@type": "City",
      "name": "Santo André - SP",
      "description": "Atacado Santo André, Distribuidora Santo André, Fornecedor Santo André, Atacadista alimentos Santo André, Food service Santo André SP"
    },
    {
      "@type": "City",
      "name": "Barueri - SP", 
      "description": "Atacado Barueri, Distribuidora Barueri, Fornecedor alimentos Barueri, Atacadista bebidas Barueri, Food service Barueri SP"
    },
    {
      "@type": "City",
      "name": "São Bernardo do Campo - SP",
      "description": "Atacado São Bernardo do Campo, Distribuidora São Bernardo, Fornecedor São Bernardo, Atacadista alimentos São Bernardo, Food service São Bernardo SP"
    },
    {
      "@type": "City",
      "name": "Mauá - SP",
      "description": "Atacado Mauá, Distribuidora Mauá, Fornecedor alimentos Mauá, Atacadista bebidas Mauá, Food service Mauá SP"
    },
    {
      "@type": "City",
      "name": "Guarulhos - SP",
      "description": "Atacado Guarulhos, Distribuidora Guarulhos, Fornecedor alimentos Guarulhos, Atacadista bebidas Guarulhos, Food service Guarulhos SP"
    },
    {
      "@type": "City",
      "name": "Arujá - SP",
      "description": "Atacado Arujá, Distribuidora Arujá, Fornecedor alimentos Arujá, Atacadista bebidas Arujá, Food service Arujá SP"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Sul de Minas Gerais",
      "description": "Atacado Sul de Minas, Distribuidora Sul de Minas, Fornecedor alimentos Sul de Minas, Atacadista bebidas Sul de Minas, Food service Sul de Minas"
    },
    {
      "@type": "City",
      "name": "Extrema - MG",
      "description": "Atacado Extrema MG, Distribuidora Extrema, Fornecedor alimentos Extrema, Atacadista bebidas Extrema, Food service Extrema, Atacado para restaurantes Extrema"
    },
    {
      "@type": "City",
      "name": "Poços de Caldas - MG",
      "description": "Atacado Poços de Caldas, Distribuidora Poços de Caldas, Fornecedor alimentos Poços de Caldas, Atacadista bebidas Poços de Caldas, Food service Poços de Caldas MG"
    },
    {
      "@type": "City",
      "name": "São Lourenço - MG",
      "description": "Atacado São Lourenço, Distribuidora São Lourenço, Fornecedor alimentos São Lourenço, Atacadista bebidas São Lourenço, Food service São Lourenço MG"
    },
    {
      "@type": "City",
      "name": "Itajubá - MG",
      "description": "Atacado Itajubá, Distribuidora Itajubá, Fornecedor alimentos Itajubá, Atacadista bebidas Itajubá, Food service Itajubá, Atacado para mercados Itajubá"
    },
    {
      "@type": "City",
      "name": "Pouso Alegre - MG",
      "description": "Atacado Pouso Alegre, Distribuidora Pouso Alegre, Fornecedor alimentos Pouso Alegre, Atacadista bebidas Pouso Alegre, Food service Pouso Alegre MG"
    },
    {
      "@type": "City",
      "name": "Camanducaia - MG",
      "description": "Atacado Camanducaia, Distribuidora Camanducaia, Fornecedor alimentos Camanducaia, Atacadista bebidas Camanducaia, Food service Camanducaia MG"
    },
    {
      "@type": "City",
      "name": "Varginha - MG",
      "description": "Atacado Varginha, Distribuidora Varginha, Fornecedor alimentos Varginha, Atacadista bebidas Varginha, Food service Varginha, Atacado para restaurantes Varginha"
    },
    {
      "@type": "City",
      "name": "Três Pontas - MG",
      "description": "Atacado Três Pontas, Distribuidora Três Pontas, Fornecedor alimentos Três Pontas, Atacadista bebidas Três Pontas, Food service Três Pontas MG"
    },
    {
      "@type": "City",
      "name": "Virgínia - MG",
      "description": "Atacado Virgínia MG, Distribuidora Virgínia, Fornecedor alimentos Virgínia, Atacadista bebidas Virgínia, Food service Virgínia MG"
    },
    {
      "@type": "City",
      "name": "Santa Rita do Sapucaí - MG",
      "description": "Atacado Santa Rita do Sapucaí, Distribuidora Santa Rita do Sapucaí, Fornecedor alimentos Santa Rita, Atacadista bebidas Santa Rita, Food service Santa Rita do Sapucaí"
    },
    {
      "@type": "AdministrativeArea", 
      "name": "Sul do Rio de Janeiro",
      "description": "Atacado Sul do Rio de Janeiro, Distribuidora Sul do RJ, Fornecedor alimentos Sul do Rio, Atacadista bebidas Sul do RJ, Food service Sul do Rio"
    },
    {
      "@type": "City",
      "name": "Paraty - RJ",
      "description": "Atacado Paraty, Distribuidora Paraty, Fornecedor alimentos Paraty, Atacadista bebidas Paraty, Food service Paraty RJ"
    },
    {
      "@type": "City",
      "name": "Volta Redonda - RJ",
      "description": "Atacado Volta Redonda, Distribuidora Volta Redonda, Fornecedor alimentos Volta Redonda, Atacadista bebidas Volta Redonda, Food service Volta Redonda RJ"
    },
    {
      "@type": "City", 
      "name": "Resende - RJ",
      "description": "Atacado Resende, Distribuidora Resende, Fornecedor alimentos Resende, Atacadista bebidas Resende, Food service Resende RJ"
    },
    {
      "@type": "City",
      "name": "Barra Mansa - RJ",
      "description": "Atacado Barra Mansa, Distribuidora Barra Mansa, Fornecedor alimentos Barra Mansa, Atacadista bebidas Barra Mansa, Food service Barra Mansa RJ"
    }
  ],
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
    }
  ]
})}
</script>
  
  {/* ========== KEYWORDS E OTIMIZAÇÕES EXTRAS ========== */}
  <meta name="keywords" content="distribuidora food service, atacadista itapecerica, produtos para restaurante, atacado bebidas, alimentos atacado, marques vendas pmg, distribuidora autorizada, atacadista grande sp" />
  <meta name="author" content="Marques Vendas PMG" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  
  {/* Canonical URL */}
  <link rel="canonical" href="https://www.marquesvendaspmg.shop" />
  
  {/* Sitemap */}
  <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
  
  {/* Favicon */}
  <link rel="icon" href="https://i.imgur.com/pBH5WpZ.png" />
  
  {/* Theme Color para Mobile */}
  <meta name="theme-color" content="#095400" />
  <meta name="msapplication-TileColor" content="#095400" />
  
  {/* Apple Touch Icon */}
  <link rel="apple-touch-icon" href="https://i.imgur.com/pBH5WpZ.png" />
</Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '10px' : '20px',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        position: 'relative'
      }}>
        {/* Cabeçalho Premium - Adaptado para mobile */}
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '15px 0' : '30px 0',
          marginBottom: isMobile ? '5px' : '10px'
        }}>
          <div style={{
            backgroundColor: '#095400',
            padding: isMobile ? '8px 15px' : '10px 25px',
            borderRadius: '30px',
            marginBottom: isMobile ? '10px' : '15px',
            color: 'white',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: '600',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            Marques Vendas PMG
          </div>
          
          <img 
            src="https://i.imgur.com/pBH5WpZ.png" 
            alt="Marques Vendas PMG" 
            style={{ 
              width: isMobile ? '180px' : '220px',
              margin: isMobile ? '10px 0' : '15px 0',
              filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.1))'
            }} 
          />
          
          <h1 style={{ 
            color: '#095400', 
            fontSize: isMobile ? '1.5rem' : '2rem',
            margin: isMobile ? '5px 0 10px' : '10px 0 15px',
            textAlign: 'center',
            fontWeight: '700',
            lineHeight: '1.3',
            padding: isMobile ? '0 10px' : '0'
          }}>
            Marques Vendas PMG Distribuidora <span style={{whiteSpace: 'nowrap'}}>Food Service</span>
          </h1>
          
          <p style={{ 
  color: '#555', 
  fontSize: isMobile ? '0.9rem' : '1rem',
  maxWidth: '600px',
  textAlign: 'center',
  lineHeight: '1.6',
  marginBottom: isMobile ? '15px' : '20px',
  padding: isMobile ? '0 15px' : '0'
}}>
  Produtos de qualidade com garantia e procedência. Atendimento personalizado para revendedores e estabelecimentos comerciais.
</p>

{/* BOTÃO DE OFERTAS */}
<Link href="/ofertas" passHref legacyBehavior>
  <a style={{
    display: 'inline-block',
    padding: isMobile ? '12px 24px' : '12px 25px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '30px',
    fontSize: isMobile ? '0.95rem' : '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 3px 10px rgba(231, 76, 60, 0.3)',
    margin: isMobile ? '0 auto 10px' : '0 auto 10px',
    width: isMobile ? '90%' : 'auto',
    maxWidth: '400px',
    textAlign: 'center',
  }}>
    🔥 {isMobile ? 'OFERTAS DA SEMANA' : 'CONFIRA NOSSAS OFERTAS DA SEMANA!'}
  </a>
</Link>

{/* NOVO BOTÃO FOOD NEWS - ADICIONE AQUI */}
<Link href="/food-news" passHref legacyBehavior>
  <a style={{
    display: 'inline-block',
    padding: isMobile ? '12px 24px' : '12px 25px',
    backgroundColor: '#095400',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '30px',
    fontSize: isMobile ? '0.95rem' : '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 3px 10px rgba(9, 84, 0, 0.3)',
    margin: isMobile ? '0 auto 20px' : '0 auto 15px',
    width: isMobile ? '90%' : 'auto',
    maxWidth: '400px',
    textAlign: 'center',
    ':hover': {
      backgroundColor: '#074000',
      transform: isMobile ? 'none' : 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(7, 64, 0, 0.4)'
    }
  }}>
    📰 {isMobile ? 'FOOD NEWS' : 'ACESSE O FOOD NEWS - BLOG'}
  </a>
</Link>
</header>

        {/* Destaques de Credibilidade - CORRIGIDO PARA 2 POR LINHA NO APP */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '10px' : '15px',
          margin: isMobile ? '20px 0' : '30px 0',
          padding: isMobile ? '0 10px' : '0'
        }}>
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '12px 8px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1.2rem' : '1.5rem', marginRight: '8px'}}>🚚</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.7rem' : '0.9rem'}}>Entrega Rápida</div>
              <div style={{fontSize: isMobile ? '0.6rem' : '0.8rem', color: '#666'}}>Para toda região</div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '12px 8px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1.2rem' : '1.5rem', marginRight: '8px'}}>🏷️</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.7rem' : '0.9rem'}}>Preço Competitivo</div>
              <div style={{fontSize: isMobile ? '0.6rem' : '0.8rem', color: '#666'}}>Melhores condições</div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '12px 8px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1.2rem' : '1.5rem', marginRight: '8px'}}>🛡️</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.7rem' : '0.9rem'}}>Garantia</div>
              <div style={{fontSize: isMobile ? '0.6rem' : '0.8rem', color: '#666'}}>Produtos certificados</div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '12px 8px' : '15px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <span style={{fontSize: isMobile ? '1.2rem' : '1.5rem', marginRight: '8px'}}>👨‍💼</span>
            <div>
              <div style={{fontWeight: '600', fontSize: isMobile ? '0.7rem' : '0.9rem'}}>Atendimento</div>
              <div style={{fontSize: isMobile ? '0.6rem' : '0.8rem', color: '#666'}}>Personalizado</div>
            </div>
          </div>
        </div>

        {/* Carrossel Otimizado - Melhorias para mobile */}
        <div 
          ref={carouselRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: isMobile ? '20px auto' : '40px auto',
            overflow: 'hidden',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            height: `${dimensions.height}px`,
            backgroundColor: '#f8f8f8'
          }}
        >
          <div style={{
            display: 'flex',
            transition: 'transform 0.5s ease',
            transform: `translateX(-${currentSlide * 100}%)`,
            height: '100%'
          }}>
            {banners.map((banner) => (
              <div 
                key={banner.id} 
                style={{
                  width: '100%',
                  flexShrink: 0,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img 
                  src={isMobile ? banner.mobile : banner.desktop}
                  alt={`Banner ${banner.id}`}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          
          {/* Botões de navegação - Melhorados para mobile */}
          <button 
            onClick={goToPrevSlide}
            style={{
              position: 'absolute',
              top: '50%',
              left: isMobile ? '5px' : '15px',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: isMobile ? '35px' : '40px',
              height: isMobile ? '35px' : '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            aria-label="Slide anterior"
          >
            <span style={{ fontSize: isMobile ? '16px' : '20px', color: '#095400' }}>❮</span>
          </button>
          
          <button 
            onClick={goToNextSlide}
            style={{
              position: 'absolute',
              top: '50%',
              right: isMobile ? '5px' : '15px',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: isMobile ? '35px' : '40px',
              height: isMobile ? '35px' : '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            aria-label="Próximo slide"
          >
            <span style={{ fontSize: isMobile ? '16px' : '20px', color: '#095400' }}>❯</span>
          </button>
          
          {/* Indicadores de slide - Melhorados para mobile */}
          <div style={{
            position: 'absolute',
            bottom: isMobile ? '10px' : '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: isMobile ? '6px' : '8px',
            zIndex: 10
          }}>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: isMobile ? '8px' : '10px',
                  height: isMobile ? '8px' : '10px',
                  borderRadius: '50%',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  backgroundColor: currentSlide === index ? '#095400' : 'rgba(255,255,255,0.5)',
                  transition: 'background-color 0.3s'
                }}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

{/* Seção "Conheça Nossa Operação" */}
<section style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: isMobile ? '30px 0' : '60px 0',
  padding: isMobile ? '0 10px' : '0 20px'
}}>
  <h2 style={{
    color: '#333',
    fontSize: isMobile ? '1.2rem' : '1.8rem',
    fontWeight: '600',
    marginBottom: isMobile ? '15px' : '30px',
    textAlign: 'center',
    padding: isMobile ? '0 10px' : '0'
  }}>
    Conheça Nossa Operação
  </h2>
  
  {/* Vídeo do YouTube */}
  <div style={{
    width: '100%',
    maxWidth: isMobile ? '100%' : '900px',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    marginBottom: isMobile ? '15px' : '30px',
    aspectRatio: '16/9'
  }}>
    <iframe
      width="100%"
      height="100%"
      src="https://www.youtube.com/embed/xOPT4YXLV2E?autoplay=0&mute=0&rel=0&modestbranding=1&playsinline=1"
      title="PMG Atacadista 2025 | 30 Anos Conectando Negócios, Confiança e Resultados"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      style={{
        display: 'block',
        border: 'none'
      }}
    />
  </div>

{/* Texto descritivo para SEO - ESCONDIDO visualmente mas o Google lê */}
<div style={{ 
  maxWidth: '800px',
  marginTop: '20px',
  opacity: '0',
  height: '0',
  overflow: 'hidden',
  position: 'absolute'
}}>
  <h3>PMG Atacadista 2025 | 30 Anos Conectando Negócios, Confiança e Resultados</h3>
  <p>Há 30 anos a PMG Atacadista conecta negócios com confiança e resultados sólidos. Distribuidora food service especializada em atacado para restaurantes, bares, mercados e estabelecimentos comerciais. Localizada em Itapecerica da Serra, atendemos toda a Grande São Paulo com entrega rápida e condições especiais para compras em atacado.</p>
  <p>Trabalhamos com laticínios, queijos, embutidos, massas, bebidas, congelados e produtos alimentícios em geral. Estrutura moderna com controle de qualidade e temperatura para garantir a procedência e frescor dos produtos. Atendimento personalizado para revendedores e comerciantes com mais de 30 anos de experiência no mercado.</p>
  <p>Produtos das melhores marcas do mercado com garantia de qualidade e procedência. Conheça nossa operação completa através do vídeo e veja porque somos referência em distribuição food service na região.</p>
</div>
  
  <p style={{
    color: '#666',
    fontSize: isMobile ? '0.85rem' : '1rem',
    maxWidth: '600px',
    textAlign: 'center',
    lineHeight: '1.6',
    padding: isMobile ? '0 15px' : '0'
  }}>
    Nossa estrutura preparada para atender sua demanda com agilidade e qualidade.
  </p>
</section>

{/* Conteúdo SEO PMG Atacadista - VISÍVEL APENAS PARA O GOOGLE */}
<div style={{
  opacity: '0',
  height: '0',
  overflow: 'hidden',
  position: 'absolute',
  pointerEvents: 'none'
}}>
  <h1>PMG Atacadista - Distribuidora e Atacadista em Itapecerica da Serra</h1>
  
  <h2>PMG Atacadista - 30 Anos no Mercado</h2>
  <p>A PMG Atacadista é uma distribuidora e atacadista localizada em Itapecerica da Serra, atendendo toda a Grande São Paulo. Com mais de 30 anos de experiência, a PMG Atacadista oferece produtos de qualidade para restaurantes, bares, mercados e estabelecimentos comerciais.</p>
  
  <h3>PMG Atacadista Telefone e Contato</h3>
  <p>Telefone da PMG Atacadista: (11) 91357-2902. Endereço da PMG Atacadista: Estrada Ferreira Guedes, 784 - Potuverá, Itapecerica da Serra - SP, CEP 06885-150.</p>
  
  <h3>PMG Atacadista Produtos e Serviços</h3>
  <p>PMG Atacadista trabalha com laticínios, queijos, embutidos, massas, bebidas, congelados e diversos produtos alimentícios. PMG Atacadista app para facilitar pedidos. PMG Atacadista entrega rápida.</p>
  
  <h3>PMG Atacadista Redes Sociais</h3>
  <p>PMG Atacadista Facebook: facebook.com/MarquesVendaspmg. PMG Atacadista Instagram: instagram.com/marquesvendaspmg. PMG Atacadista YouTube: youtube.com/@MarquesVendasPMG.</p>
  
  <h3>PMG Atacadista Santo Amaro e Região</h3>
  <p>PMG Atacadista atende Santo Amaro e toda região da Grande São Paulo. PMG Atacadista distribuidora autorizada. PMG Atacadista preços competitivos.</p>
  
  <h3>PNG Atacadista</h3>
  <p>Também conhecida como PNG Atacadista, a PMG Atacadista é referência em distribuição food service. PMG Atacadista confiança e resultados.</p>
  
  <h3>PMG Atacadista Itapecerica da Serra</h3>
  <p>PMG Atacadista Itapecerica da Serra - distribuidora local com entrega para toda região. PMG Atacadista estoque amplo e variedade de produtos.</p>
  
  <h3>PMG Atacado</h3>
  <p>PMG Atacado - condições especiais para compras em grande quantidade. PMG Atacadista melhores preços de atacado.</p>
  
  <h3>PMG</h3>
  <p>PMG - Empresa sólida no mercado de distribuição. PMG tradição e qualidade. PMG atendimento personalizado.</p>
</div>

{/* Seção CTA Simplificada com suas Frases - CORRIGIDA */}
<section style={{
  textAlign: 'center',
  margin: isMobile ? '30px 0' : '50px 0',
  padding: isMobile ? '25px 15px' : '35px 20px',
  backgroundColor: '#f0f8f0',
  borderRadius: '12px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  width: '100%',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
  border: '1px solid #e0f0e0',
  boxSizing: 'border-box' // ← ADICIONE ISSO
}}>
  <div style={{
    maxWidth: '600px',
    margin: '0 auto'
  }}>
    <h2 style={{
      color: '#095400',
      fontSize: isMobile ? '1.4rem' : '1.8rem',
      fontWeight: '700',
      marginBottom: isMobile ? '15px' : '20px',
      lineHeight: '1.3'
    }}>
      Cadastre-se gratuitamente
    </h2>
    
    <p style={{
      color: '#444',
      fontSize: isMobile ? '1rem' : '1.1rem',
      margin: isMobile ? '0 auto 20px' : '0 auto 30px',
      lineHeight: '1.6',
      maxWidth: '95%' // ← EVITA TEXTO MUITO LONGO
    }}>
      Ganhe acesso completo ao nosso catálogo com condições especiais para seu negócio!
    </p>
    
    <Link href="/produtos" passHref legacyBehavior>
      <a 
        className="cta-button" // ← MUDEI PARA CLASSNAME
        style={{
          display: 'inline-block',
          padding: isMobile ? '14px 30px' : '16px 40px',
          backgroundColor: '#095400',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: isMobile ? '1.1rem' : '1.2rem',
          fontWeight: '700',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(9, 84, 0, 0.3)',
          marginBottom: '15px'
        }}
      >
        COMPRE AGORA →
      </a>
    </Link>

    <p style={{
      color: '#666',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      fontStyle: 'italic',
      margin: '10px 0 0 0'
    }}>
      Cadastro rápido e sem complicação. Leva menos de 2 minutos!
    </p>
  </div>
</section>

        {/* Seção de Avaliações */}
        {/* Seção de Avaliações - CORRIGIDA COM LARGURA FIXA */}
        <section style={{
          margin: isMobile ? '20px 0' : '40px 0',
          padding: isMobile ? '0 10px' : '0 20px',
          width: '100%'
        }}>
          <h2 style={{
            color: '#095400',
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: isMobile ? '15px' : '25px'
          }}>
            O que nossos clientes dizem
          </h2>

          <div style={{
            width: '100%',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '10px 5px',
              minWidth: 'min-content'
            }}>
              {avaliacoes.map((avaliacao, index) => (
                <div key={index} style={{
                  width: isMobile ? '280px' : '300px',
                  flexShrink: 0,
                  padding: '15px',
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #eee'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <img 
                      src={avaliacao.foto} 
                      alt={avaliacao.nome} 
                      style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '12px', objectFit: 'cover' }} 
                    />
                    <div>
                      <h3 style={{ color: '#095400', fontSize: '1rem', margin: '0 0 4px 0', fontWeight: '600' }}>{avaliacao.nome}</h3>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: i < avaliacao.estrelas ? '#FFD700' : '#e0e0e0', fontSize: '14px' }}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: '1.4', margin: 0, wordBreak: 'break-word' }}>
                    "{avaliacao.texto}"
                  </p>
                </div>
      ))}
    </div>

    {/* Botões de Navegação - Estilo Melhorado */}
    <button 
      onClick={() => {
        const scrollAmount = isMobile ? window.innerWidth * 0.85 : window.innerWidth * 0.28;
        avaliacoesRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }}
      style={{
        position: 'absolute',
        top: '50%',
        left: isMobile ? '5px' : '10px',
        transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid #e0e0e0',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        zIndex: 2,
        color: '#095400',
        fontSize: '18px',
        fontWeight: 'bold'
      }}
      aria-label="Avaliação anterior"
    >
      ❮
    </button>
    <button 
      onClick={() => {
        const scrollAmount = isMobile ? window.innerWidth * 0.85 : window.innerWidth * 0.28;
        avaliacoesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }}
      style={{
        position: 'absolute',
        top: '50%',
        right: isMobile ? '5px' : '10px',
        transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid #e0e0e0',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        zIndex: 2,
        color: '#095400',
        fontSize: '18px',
        fontWeight: 'bold'
      }}
      aria-label="Próxima avaliação"
    >
      ❯
    </button>
  </div>
</section>

{/* Rodapé Premium - Totalmente Reformulado */}
<footer style={{
  marginTop: isMobile ? '40px' : '60px',
  padding: isMobile ? '25px 15px' : '40px 20px',
  textAlign: 'center',
  color: '#666',
  fontSize: isMobile ? '0.8rem' : '0.85rem',
  borderTop: '2px solid #095400',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px 12px 0 0',
  boxShadow: '0 -2px 10px rgba(9, 84, 0, 0.1)'
}}>
  
  {/* Título do Rodapé */}
  <h3 style={{
    color: '#095400',
    fontSize: isMobile ? '1rem' : '1.1rem',
    marginBottom: '20px',
    fontWeight: '600'
  }}>
    📋 Informações Legais
  </h3>

  {/* Links Principais em Grid Organizado */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
    gap: isMobile ? '15px' : '20px',
    marginBottom: '25px',
    maxWidth: '600px',
    margin: '0 auto 25px auto'
  }}>
    
    {/* Política de Privacidade */}
    <a 
      href="/politica-de-privacidade" 
      style={{ 
        color: '#095400', 
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: isMobile ? '0.8rem' : '0.85rem',
        padding: '12px 8px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
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
      {isMobile ? 'Privacidade' : 'Política de Privacidade'}
    </a>

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
        fontSize: isMobile ? '0.8rem' : '0.85rem',
        padding: '12px 8px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
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
      {isMobile ? 'Termos' : 'Termos de Uso'}
    </a>
    </Link>

    {/* Quem Somos */}
    <Link href="/quem-somos" passHref legacyBehavior>
      <a style={{ 
        color: '#095400', 
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: isMobile ? '0.8rem' : '0.85rem',
        padding: '12px 8px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
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
      {isMobile ? 'Sobre' : 'Quem Somos'}
    </a>
    </Link>
  </div>

  {/* Linha Divisa Estilizada */}
  <div style={{
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #095400, transparent)',
    margin: '20px auto',
    maxWidth: '300px'
  }}></div>

  {/* Informações de copyright e redes sociais */}
  <div style={{ 
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
  }}>
    {/* Redes Sociais - Versão Clean com Logos Visíveis */}
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: isMobile ? '20px' : '25px',
      alignItems: 'center'
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
          width: '32px',
          height: '32px',
          borderRadius: '4px',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          padding: '6px'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        <img 
          src="https://i.imgur.com/prULUUA.png" 
          alt="Facebook" 
          style={{
            width: '20px',
            height: '20px',
            transition: 'all 0.3s ease'
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
          width: '32px',
          height: '32px',
          borderRadius: '4px',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          padding: '6px'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        <img 
          src="https://i.imgur.com/I0ZZLjG.png" 
          alt="Instagram" 
          style={{
            width: '20px',
            height: '20px',
            transition: 'all 0.3s ease'
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
          width: '32px',
          height: '32px',
          borderRadius: '4px',
          transition: 'all 0.3s ease',
          textDecoration: 'none',
          padding: '6px'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        <img 
          src="https://i.imgur.com/WfpZ8Gg.png" 
          alt="YouTube" 
          style={{
            width: '20px',
            height: '20px',
            transition: 'all 0.3s ease'
          }}
        />
      </a>
    </div>

{/* Copyright, Texto SEO e Endereço */}
<div style={{ textAlign: 'center' }}>
  {/* TEXTO SEO VISÍVEL - ALINHADO COM PÁGINA PRODUTOS */}
  <div style={{
    maxWidth: '800px',
    margin: '15px auto 20px auto',
    padding: '0 15px'
  }}>
    <p style={{
      color: '#666',
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      lineHeight: '1.5',
      textAlign: 'center',
      fontStyle: 'italic',
      margin: '0 0 15px 0'
    }}>
      <strong>PMG Atacadista</strong> - Seu fornecedor de confiança em <strong>São Paulo</strong>. 
      Especializados em <strong>atacado food service</strong> para restaurantes, bares e mercados. 
      Atendemos <strong>Itapecerica da Serra, Grande SP, Sul de Minas Gerais e Sul do Rio de Janeiro</strong>. 
      Trabalhamos com as melhores marcas do mercado para garantir qualidade e satisfação aos nossos clientes.
    </p>
  </div>

  <p style={{ 
    margin: '5px 0', 
    fontSize: isMobile ? '0.8rem' : '0.85rem',
    color: '#666'
  }}>
    © {new Date().getFullYear()} Marques Vendas PMG. Todos os direitos reservados.
  </p>
  
  <p style={{ 
    margin: '5px 0', 
    fontSize: isMobile ? '0.7rem' : '0.8rem', 
    color: '#999',
    lineHeight: '1.4'
  }}>
    • Endereço: Estrada Ferreira Guedes, 784 - Potuverá CEP: 06885-150 - Itapecerica da Serra - SP
  </p>
</div>
  </div>
</footer>

<style jsx global>{`
  /* Garante que o link fique acima das notificações */
  #legal-links-container {
    position: relative;
    z-index: 100;
  }
`}</style>
      </div>
    </>
  );
}
