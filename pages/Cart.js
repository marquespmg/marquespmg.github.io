import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router'; // ✅ ADICIONADO
// ==============================================
// ✅ IMPORTA SOMENTE O ARRAY DE PRODUTOS
// ==============================================
import { produtosArray } from './produtos';

// ✅ IMPORTA O HOOK DE VALIDADE
import { useProdutoIdPmg } from '../hook/useProdutoIdPmg';

// ==============================================
// 🎁 CONFIGURAÇÃO DA CAMPANHA "COMPRE E GANHE"
// ==============================================
const CAMPANHA_CONFIG = {
  ativa: false,  // MUDAR PARA false quando quiser desativar
  marcas: {
    quata: {
      nome: "Quatá",
      ids: [653, 658, 825, 829, 842, 902, 2065], // ⚠️ COLOQUE OS IDs REAIS AQUI
      minimo: 2
    },
    cargill: {
      nome: "Cargill", 
      ids: [383, 1928, 1290, 1356, 1364], // ⚠️ COLOQUE OS IDs REAIS AQUI
      minimo: 2
    }
  },
  desconto: 2 // percentual
};
// ==============================================

// ✅ Array com IDs dos produtos em oferta
const PRODUTOS_EM_OFERTA = [1487, 615, 1753, 2485, 2549, 2649, 2662, 2666, 2667];

// ✅ Configuração dos cupons
const CUPONS = {
  PEDIDO1000: {
    nome: 'PEDIDO1000',
    minimo: 1000,
    desconto: 1.5,
    descricao: '1.5% de desconto para pedidos acima de R$ 1.000'
  },
  PEDIDO2000: {
    nome: 'PEDIDO2000',
    minimo: 2000,
    desconto: 2,
    descricao: '2% de desconto para pedidos acima de R$ 2.000'
  }
};

const CART_STORAGE_KEY = 'cart_data';

// ==============================================
// ✅ FUNÇÃO PARA VERIFICAR CAMPANHA
// ==============================================
const verificarCampanha = (cartItems) => {
  if (!CAMPANHA_CONFIG.ativa) {
    return {
      qualificada: false,
      progresso: {},
      desconto: 0
    };
  }

  const progresso = {};
  let qualificada = true;

  Object.keys(CAMPANHA_CONFIG.marcas).forEach(key => {
    const marca = CAMPANHA_CONFIG.marcas[key];
    const quantidade = cartItems
      .filter(item => marca.ids.includes(item.id))
      .reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    progresso[key] = {
      ...marca,
      atual: quantidade,
      atingido: quantidade >= marca.minimo
    };
    
    if (!progresso[key].atingido) {
      qualificada = false;
    }
  });

  return {
    qualificada,
    progresso,
    desconto: qualificada ? CAMPANHA_CONFIG.desconto : 0
  };
};

// ==============================================
// ✅ FUNÇÃO PARA CALCULAR DESCONTO DA CAMPANHA
// ==============================================
const calcularDescontoCampanha = (cartItems, groupedItems) => {
  if (!CAMPANHA_CONFIG.ativa) return { totalDesconto: 0, itensComDesconto: {} };

  const campanhaInfo = verificarCampanha(cartItems);
  
  if (!campanhaInfo.qualificada) {
    return { totalDesconto: 0, itensComDesconto: {} };
  }

  // Pega os itens elegíveis (que NÃO estão em oferta)
  const itensElegiveis = groupedItems.filter(
    item => !PRODUTOS_EM_OFERTA.includes(item.id)
  );

  if (itensElegiveis.length === 0) {
    return { totalDesconto: 0, itensComDesconto: {} };
  }

  const totalElegivel = itensElegiveis.reduce((sum, item) => sum + item.totalPrice, 0);
  const percentualDesconto = CAMPANHA_CONFIG.desconto / 100;
  const descontoTotal = totalElegivel * percentualDesconto;

  const itensComDesconto = {};
  itensElegiveis.forEach(item => {
    itensComDesconto[item.id] = {
      totalPrice: item.totalPrice,
      proporcao: item.totalPrice / totalElegivel,
      descontoAplicado: descontoTotal * (item.totalPrice / totalElegivel)
    };
  });

  return {
    totalDesconto: descontoTotal,
    itensComDesconto,
    percentualAplicado: CAMPANHA_CONFIG.desconto
  };
};

const Cart = ({ cart, setCart, removeFromCart }) => {
  const router = useRouter(); // ✅ ADICIONADO
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cupomExpanded, setCupomExpanded] = useState(false);
  const [finalizando, setFinalizando] = useState(false);

  // ✅ NOVO: Estado para controle da mensagem de login
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  // Estados para cupom
  const [cupomInput, setCupomInput] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [mensagemCupom, setMensagemCupom] = useState({ texto: '', tipo: '' });

  // Hook para validade dos produtos
  const { getIdPmg, loading: loadingIdPmg } = useProdutoIdPmg();

// ==============================================
// ✅ FUNÇÃO MODIFICADA: verificarLoginERedirecionar
// ==============================================
const verificarLoginERedirecionar = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  
  // Se NÃO estiver logado
  if (!currentUser) {
    // 🔥 SALVA A PÁGINA ATUAL (onde o cliente está)
    const currentPath = window.location.pathname; // ex: /ofertas ou /produto/421
    const currentUrl = window.location.href; // URL completa
    
    // Salva a página atual para redirecionar depois do login
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    sessionStorage.setItem('redirectAfterLoginFull', currentUrl);
    
    // Mostra mensagem informativa
    setShowLoginMessage(true);
    
    // 🔥 Redireciona para a página de login com a página atual como destino
    setTimeout(() => {
      router.push(`/produtos?login=required&redirect=${encodeURIComponent(currentPath)}`);
    }, 1500);
    
    return false;
  }
  
  // Se estiver logado, retorna true
  return true;
};

  // ==============================================
  // ✅ FUNÇÃO MODIFICADA: finalizarPedido com verificação de login
  // ==============================================
  const finalizarPedido = async () => {
    if (!isTotalValid || !paymentMethod) {
      alert('⚠️ Verifique o valor mínimo (R$ 900) e selecione a forma de pagamento');
      return;
    }

    // 🔐 VERIFICA SE USUÁRIO ESTÁ LOGADO
    const isLoggedIn = await verificarLoginERedirecionar();
    if (!isLoggedIn) {
      // Sai da função se não estiver logado (já vai redirecionar)
      return;
    }

    // Se chegou aqui, usuário está logado
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    setFinalizando(true);

    try {
      const orderItems = groupedCart.map(product => ({
        id: product.id,
        name: product.name,
        price: product.unitPrice || product.price,
        quantity: product.quantity,
        image: product.image,
        totalPrice: product.totalPrice
      }));

      const orderData = {
        user_id: currentUser.id,
        order_items: orderItems,
        total_amount: totalComDesconto,
        payment_method: paymentMethod,
        cupom_applied: cupomAplicado?.nome || null,
        campanha_applied: campanhaAtiva ? 'Quatá + Cargill (2%)' : null,
        discount_amount: cupomAplicado?.desconto || (campanhaAtiva ? CAMPANHA_CONFIG.desconto : 0),
        status: 'completed'
      };
      
      const whatsappUrl = generateWhatsAppMessage();
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      if (isIOS) {
        window.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, '_blank');
      }

      fetch('/api/finalizar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      }).catch(error => {
        console.error('❌ Erro ao salvar pedido:', error);
      });

      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      
      await supabase
        .from('user_carts')
        .upsert({
          user_id: currentUser.id,
          cart_items: [],
          updated_at: new Date().toISOString()
        });

      setCupomAplicado(null);
      setPaymentMethod('');
      toggleCart();

    } catch (error) {
      console.error('❌ Erro ao finalizar pedido:', error);
      alert('❌ Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setFinalizando(false);
    }
  };

  // ==============================================
  // ✅ FUNÇÃO PARA FECHAR A MENSAGEM DE LOGIN
  // ==============================================
  const dismissLoginMessage = () => {
    setShowLoginMessage(false);
  };

  // ==============================================
  // ✅ Função para calcular desconto do cupom
  // ==============================================
  const calcularDescontoCupom = (cartItems, cupom) => {
    if (!cupom || !cartItems || cartItems.length === 0) {
      return { 
        totalComDesconto: 0, 
        itensComDesconto: [], 
        totalDesconto: 0,
        totalElegivel: 0 
      };
    }

    const groupedItems = cartItems.reduce((acc, item) => {
      const existing = acc.find(p => p.id === item.id);
      const calculated = calculateProductPrice(item);
      const totalPrice = calculated.totalPrice * (item.quantity || 1);
      
      if (existing) {
        existing.quantity += (item.quantity || 1);
        existing.totalPrice += totalPrice;
      } else {
        acc.push({
          ...item,
          quantity: item.quantity || 1,
          totalPrice: totalPrice,
          unitPrice: calculated.unitPrice,
          weight: calculated.weight,
          isBox: calculated.isBox
        });
      }
      return acc;
    }, []);

    const itensElegiveis = groupedItems.filter(
      item => !PRODUTOS_EM_OFERTA.includes(item.id)
    );

    if (itensElegiveis.length === 0) {
      return {
        itensComDesconto: {},
        totalDesconto: 0,
        totalElegivel: 0,
        percentualAplicado: 0,
        mensagem: 'Nenhum item elegível para desconto (todos estão em oferta)'
      };
    }

    const totalElegivel = itensElegiveis.reduce((sum, item) => sum + item.totalPrice, 0);
    const percentualDesconto = cupom.desconto / 100;
    const descontoTotal = totalElegivel * percentualDesconto;

    const itensComDesconto = {};
    itensElegiveis.forEach(item => {
      itensComDesconto[item.id] = {
        totalPrice: item.totalPrice,
        quantidade: item.quantity,
        proporcao: item.totalPrice / totalElegivel,
        descontoAplicado: descontoTotal * (item.totalPrice / totalElegivel)
      };
    });

    return {
      itensComDesconto,
      totalDesconto: descontoTotal,
      totalElegivel,
      percentualAplicado: cupom.desconto
    };
  };

  // ==============================================
  // ✅ Função para aplicar cupom
  // ==============================================
  const aplicarCupom = () => {
    const cupomUpper = cupomInput.toUpperCase().trim();
    const cupom = CUPONS[cupomUpper];

    setMensagemCupom({ texto: '', tipo: '' });

    if (!cupom) {
      setMensagemCupom({
        texto: '❌ Cupom inválido!',
        tipo: 'erro'
      });
      setCupomAplicado(null);
      return;
    }

    const itensElegiveis = cart.filter(item => !PRODUTOS_EM_OFERTA.includes(item.id));
    
    if (itensElegiveis.length === 0) {
      setMensagemCupom({
        texto: `❌ Cupom ${cupom.nome} não é válido para carrinhos com apenas produtos em oferta`,
        tipo: 'erro'
      });
      setCupomAplicado(null);
      return;
    }

    const groupedCart = cart.reduce((acc, product) => {
      const existing = acc.find(p => p.id === product.id);
      const calculated = calculateProductPrice(product);
      const quantity = product.quantity || 1;
      
      if (existing) {
        existing.quantity += quantity;
        existing.totalPrice += calculated.totalPrice * quantity;
      } else {
        acc.push({
          ...product,
          quantity: quantity,
          totalPrice: calculated.totalPrice * quantity
        });
      }
      return acc;
    }, []);

    const totalCarrinho = groupedCart.reduce((sum, item) => sum + item.totalPrice, 0);

    if (totalCarrinho < cupom.minimo) {
      setMensagemCupom({
        texto: `❌ Cupom ${cupom.nome} válido apenas para pedidos ACIMA de R$ ${cupom.minimo.toFixed(2)}. Seu pedido atual é R$ ${totalCarrinho.toFixed(2)}`,
        tipo: 'erro'
      });
      setCupomAplicado(null);
      return;
    }

    setCupomAplicado(cupom);
    setMensagemCupom({
      texto: `✅ Cupom ${cupom.nome} aplicado! ${cupom.desconto}% de desconto distribuído entre os itens`,
      tipo: 'sucesso'
    });
    setCupomInput('');
  };

  // ==============================================
  // ✅ Função para remover cupom
  // ==============================================
  const removerCupom = () => {
    setCupomAplicado(null);
    setMensagemCupom({
      texto: '🏷️ Cupom removido',
      tipo: 'info'
    });
    setTimeout(() => setMensagemCupom({ texto: '', tipo: '' }), 3000);
  };

  // ==============================================
  // ✅ FUNÇÃO - USA produtosArray
  // ==============================================
  const updateCartPrices = (currentCart) => {
    if (!currentCart || currentCart.length === 0) return currentCart;

    try {
      if (!produtosArray || !Array.isArray(produtosArray)) {
        console.error('❌ produtosArray não está disponível ou não é um array');
        return currentCart;
      }

      console.log(`📦 Atualizando preços com ${produtosArray.length} produtos`);

      const priceMap = {};
      produtosArray.forEach(product => {
        priceMap[product.id] = {
          price: product.price,
          name: product.name,
          image: product.image
        };
      });

      let mudou = false;
      const updatedCart = currentCart.map(item => {
        const updatedProduct = priceMap[item.id];
        if (updatedProduct) {
          if (updatedProduct.price !== item.price) {
            mudou = true;
            console.log(`🔄 Produto ${item.id}: R$ ${item.price} → R$ ${updatedProduct.price}`);
            return {
              ...item,
              price: updatedProduct.price,
              name: updatedProduct.name,
              image: updatedProduct.image
            };
          }
        }
        return item;
      });

      if (mudou) {
        console.log('✅ Preços atualizados com sucesso!');
        if (cupomAplicado) {
          setMensagemCupom({
            texto: '⚠️ Preços atualizados, verifique se o cupom ainda é válido',
            tipo: 'info'
          });
        }
        return updatedCart;
      }

      console.log('⏺️ Nenhuma atualização necessária');
      return currentCart;
    } catch (error) {
      console.error('❌ Erro ao atualizar preços:', error);
      return currentCart;
    }
  };

  // ==============================================
  // ✅ LOAD INICIAL - Carrega e atualiza preços
  // ==============================================
  useEffect(() => {
    const initializeCart = () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          const updatedCart = updateCartPrices(parsedCart);
          setCart(updatedCart);
        } catch (error) {
          console.error('Erro ao carregar carrinho:', error);
        }
      }
    };
    
    initializeCart();
  }, []);

  // Verificação de mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Verifica usuário logado
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user || null;
        setUser(newUser);
        
        if (newUser && cart.length > 0) {
          console.log('👤 Usuário logou, atualizando preços...');
          const updatedCart = updateCartPrices(cart);
          if (updatedCart !== cart) {
            setCart(updatedCart);
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
          }
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [cart]);

  // Atualiza preços quando abre o carrinho
  useEffect(() => {
    const isCartOpen = isMobile ? isOpen : !isCollapsed;
    
    if (isCartOpen && cart.length > 0) {
      console.log('🛒 Carrinho aberto, verificando preços...');
      const updatedCart = updateCartPrices(cart);
      
      if (updatedCart !== cart) {
        console.log('💰 Preços atualizados ao abrir o carrinho!');
        setCart(updatedCart);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
        
        if (user) {
          setTimeout(() => {
            supabase
              .from('user_carts')
              .upsert({
                user_id: user.id,
                cart_items: updatedCart,
                updated_at: new Date().toISOString()
              })
              .then(() => console.log('✅ Carrinho sincronizado com Supabase'))
              .catch(err => console.error('❌ Erro ao sincronizar:', err));
          }, 500);
        }
      }
    }
  }, [isOpen, isCollapsed, isMobile, cart, user]);

  // Sincroniza com Supabase
  useEffect(() => {
    const syncWithSupabase = async () => {
      if (!user || cart.length === 0 || isSyncing) return;
      setIsSyncing(true);
      try {
        await supabase
          .from('user_carts')
          .upsert({ 
            user_id: user.id, 
            cart_items: cart,
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Erro ao sincronizar carrinho:', error);
      } finally {
        setIsSyncing(false);
      }
    };

    const timeoutId = setTimeout(syncWithSupabase, 1000);
    return () => clearTimeout(timeoutId);
  }, [cart, user]);

  // Feedback visual
  useEffect(() => {
    if (cart.length > 0) {
      setShowAddedFeedback(true);
      const timer = setTimeout(() => setShowAddedFeedback(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

  // Função para alternar carrinho
  const toggleCart = () => {
    if (isMobile) setIsOpen(!isOpen);
    else setIsCollapsed(!isCollapsed);
  };

  // Funções de cálculo
  const isBoxProduct = (productName) => {
    return /\(?\s*CX\s*\d+\.?\d*\s*KG\s*\)?/i.test(productName);
  };

  const calculateProductPrice = (product) => {
    if (isBoxProduct(product.name)) {
      return {
        unitPrice: product.price,
        totalPrice: product.price,
        weight: null,
        isBox: true
      };
    }

    const weightMatch = product.name.match(/(\d+\.?\d*)\s*KG/i);
    if (weightMatch) {
      const weight = parseFloat(weightMatch[1]);
      return {
        unitPrice: product.price,
        totalPrice: product.price * weight,
        weight: weight,
        isBox: false
      };
    }

    return {
      unitPrice: product.price,
      totalPrice: product.price,
      weight: null,
      isBox: false
    };
  };

  const extractBoxWeight = (productName) => {
    const weightMatch = productName.match(/\(?\s*CX\s*(\d+\.?\d*)\s*KG\s*\)?/i);
    return weightMatch ? parseFloat(weightMatch[1]) : null;
  };

  // Agrupa itens do carrinho
  const groupedCart = cart.reduce((acc, product) => {
    const existing = acc.find(p => p.id === product.id);
    const calculated = calculateProductPrice(product);
    const quantity = product.quantity || 1;
    const totalPrice = calculated.totalPrice * quantity;
    
    if (existing) {
      existing.quantity += quantity;
      existing.totalPrice += totalPrice;
    } else {
      acc.push({
        ...product,
        quantity: quantity,
        unitPrice: calculated.unitPrice,
        totalPrice: totalPrice,
        weight: calculated.weight,
        isBox: calculated.isBox,
        boxWeight: calculated.isBox ? extractBoxWeight(product.name) : null
      });
    }
    return acc;
  }, []);

  // ==============================================
  // ✅ CÁLCULO DE TOTAIS COM CUPOM E CAMPANHA
  // ==============================================
  const totalSemDesconto = groupedCart.reduce((sum, product) => sum + product.totalPrice, 0);
  
  let totalComDesconto = totalSemDesconto;
  let dadosDesconto = null;
  let cupomAtivo = false;
  let campanhaAtiva = false;
  
  // 1️⃣ VERIFICA CAMPANHA
  const campanhaInfo = verificarCampanha(cart);
  const dadosCampanha = calcularDescontoCampanha(cart, groupedCart);
  
// 2️⃣ DECIDE QUAL DESCONTO APLICAR (CUPOM OU CAMPANHA)
if (cupomAplicado) {
  cupomAtivo = true;
  dadosDesconto = calcularDescontoCupom(cart, cupomAplicado);
  totalComDesconto = totalSemDesconto - dadosDesconto.totalDesconto;
} else if (campanhaInfo.qualificada && CAMPANHA_CONFIG.ativa) { // ← USA O .ativa
  campanhaAtiva = true;
  dadosDesconto = dadosCampanha;
  totalComDesconto = totalSemDesconto - dadosCampanha.totalDesconto;
}

  const isTotalValid = totalComDesconto >= 900;

  // Função para calcular preço com desconto de um item
  const getPrecoComDesconto = (productId, precoOriginal) => {
    // Verifica se tem desconto (cupom ou campanha)
    if (!dadosDesconto || !dadosDesconto.itensComDesconto[productId]) {
      return precoOriginal;
    }
    const itemDesconto = dadosDesconto.itensComDesconto[productId];
    return precoOriginal - itemDesconto.descontoAplicado;
  };

  // Função para ajustar quantidade
  const adjustQuantity = (productId, adjustment) => {
    const newCart = [...cart];
    let productFound = false;

    for (let i = 0; i < newCart.length; i++) {
      if (newCart[i].id === productId) {
        const newQuantity = (newCart[i].quantity || 1) + adjustment;
        if (newQuantity <= 0) newCart.splice(i, 1);
        else newCart[i] = { ...newCart[i], quantity: newQuantity };
        productFound = true;
        break;
      }
    }

    if (!productFound && adjustment > 0) {
      const productToAdd = groupedCart.find(p => p.id === productId);
      if (productToAdd) newCart.push({ ...productToAdd, quantity: 1 });
    }

    setCart(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    
    if (cupomAplicado) {
      const newGrouped = newCart.reduce((acc, product) => {
        const existing = acc.find(p => p.id === product.id);
        const calculated = calculateProductPrice(product);
        const quantity = product.quantity || 1;
        
        if (existing) {
          existing.quantity += quantity;
          existing.totalPrice += calculated.totalPrice * quantity;
        } else {
          acc.push({
            ...product,
            quantity: quantity,
            totalPrice: calculated.totalPrice * quantity
          });
        }
        return acc;
      }, []);
      
      const novoTotal = newGrouped.reduce((sum, item) => sum + item.totalPrice, 0);
      
      if (novoTotal < cupomAplicado.minimo) {
        setMensagemCupom({
          texto: `⚠️ Cupom ${cupomAplicado.nome} removido: pedido abaixo de R$ ${cupomAplicado.minimo.toFixed(2)}`,
          tipo: 'info'
        });
        setCupomAplicado(null);
      }
    }
  };

  // Gerar mensagem do WhatsApp
  const generateWhatsAppMessage = () => {
    const itemsText = groupedCart.map(product => {
      const precoFinal = getPrecoComDesconto(product.id, product.totalPrice);
      const precoExibir = precoFinal !== product.totalPrice ? precoFinal : product.totalPrice;
      
      const idPMG = getIdPmg(product.id);
      
      const baseText = `- (ID ${idPMG}) ${product.name}`;
      
      let linhaProduto;
      if (product.isBox && product.boxWeight) {
        linhaProduto = `${baseText} (${product.quantity}x CX ${product.boxWeight}KG) - R$ ${precoExibir.toFixed(2)}`;
      } else if (product.weight) {
        linhaProduto = `${baseText} (${product.quantity}x ${product.weight}KG) - R$ ${product.unitPrice.toFixed(2)}/KG = R$ ${precoExibir.toFixed(2)}`;
      } else {
        linhaProduto = `${baseText} (${product.quantity}x) - R$ ${precoExibir.toFixed(2)}`;
      }
      
      return linhaProduto;
    }).join('\n\n');

    const cupomText = cupomAtivo
      ? `\n *Pedido usando cupom ${cupomAplicado.nome}*\n`
      : '';

    const campanhaText = campanhaAtiva
      ? `\n *Campanha aplicada: Quatá + Cargill (2% de desconto)*\n`
      : '';

    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    let mensagemTexto;
    
    if (isMobileDevice) {
      mensagemTexto = 
        `🛒 *PEDIDO* 🛒\n\n${itemsText}\n\n` +
        `💰 *TOTAL: R$ ${totalComDesconto.toFixed(2)}*\n` +
        `${cupomText}` +
        `${campanhaText}` +
        `💳 *Pagamento:* ${paymentMethod}\n` +
        `📦 *Entrega:* Frete grátis\n\n` +
        `Por favor, confirme meu pedido!`;
    } else {
      mensagemTexto = 
        `*PEDIDO*\n\n${itemsText}\n\n` +
        `*TOTAL: R$ ${totalComDesconto.toFixed(2)}*\n` +
        `${cupomText}` +
        `${campanhaText}` +
        `*Pagamento:* ${paymentMethod}\n` +
        `*Entrega:* Frete grátis\n\n` +
        `Por favor, confirme meu pedido!`;
    }

    return `https://wa.me/5511913572902?text=${encodeURIComponent(mensagemTexto)}`;
  };

  // JSX
  return (
    <>
{/* ✅ MENSAGEM INFORMATIVA DE LOGIN - ESTILO TOAST (DINÂMICA) */}
{showLoginMessage && (
  <div style={{
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '15px 25px',
    borderRadius: '8px',
    zIndex: 9999,
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    border: '2px solid #ffeeba',
    maxWidth: '90%',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    animation: 'slideDown 0.5s ease-out'
  }}>
    <span style={{ fontSize: '24px' }}>🔑</span>
    <div>
      <strong style={{ fontSize: '16px', display: 'block' }}>
        Você está sendo redirecionado para a página de login
      </strong>
      <span style={{ fontSize: '14px' }}>
        {(() => {
          // 🔥 DETECTA SE ESTÁ NA PÁGINA DE PRODUTO
          const currentPath = window.location.pathname;
          if (currentPath && currentPath.includes('/produto/')) {
            return '📦 Após o login, você voltará para o produto que estava vendo';
          }
          return '🛍️ Após o login, você voltará para a página de ofertas';
        })()}
      </span>
    </div>
    <button
      onClick={dismissLoginMessage}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: '#856404',
        padding: '0 5px'
      }}
    >
      ✕
    </button>
  </div>
)}

      {/* Botão flutuante do carrinho */}
      <div style={{
        position: 'fixed',
        right: isMobile ? '20px' : '15px',
        bottom: isMobile ? '20px' : '15px',
        zIndex: 1001,
        display: 'block'
      }}>
        <button 
          onClick={toggleCart}
          style={{
            backgroundColor: '#095400',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: isMobile ? '65px' : '60px',
            height: isMobile ? '65px' : '60px',
            fontSize: isMobile ? '26px' : '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.2s ease',
            zIndex: 1002
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          🛒 
          {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#E74C3C',
              color: 'white',
              borderRadius: '50%',
              width: isMobile ? '26px' : '24px',
              height: isMobile ? '26px' : '24px',
              fontSize: isMobile ? '13px' : '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: '2px solid white'
            }}>
              {cart.length}
            </span>
          )}
        </button>

        {showAddedFeedback && (
          <div style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            backgroundColor: '#27AE60',
            color: 'white',
            borderRadius: '15px',
            padding: isMobile ? '6px 12px' : '4px 8px',
            fontSize: isMobile ? '13px' : '12px',
            fontWeight: 'bold',
            animation: 'fadeInOut 2s ease-in-out',
            zIndex: 1002,
            whiteSpace: 'nowrap'
          }}>
            ✅ Item adicionado!
          </div>
        )}
      </div>

      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 999,
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Container principal do carrinho */}
      <div style={{
        position: 'fixed',
        right: isMobile ? (isOpen ? '0' : '-100%') : (isCollapsed ? '-380px' : '15px'),
        bottom: isMobile ? '0' : 'auto',
        top: isMobile ? 'auto' : '15px',
        width: isMobile ? '100%' : '380px',
        height: isMobile ? '85vh' : 'auto',
        backgroundColor: '#fff',
        borderRadius: isMobile ? '20px 20px 0 0' : '12px',
        boxShadow: '0 -5px 25px rgba(0, 0, 0, 0.15)',
        padding: isMobile ? '20px 15px' : '15px',
        zIndex: 1000,
        maxHeight: isMobile ? '85vh' : '85vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        transition: isMobile ? 'transform 0.3s ease-out' : 'right 0.3s ease-in-out',
        boxSizing: 'border-box',
        transform: isMobile ? (isOpen ? 'translateY(0)' : 'translateY(100%)') : 'none',
        opacity: isMobile ? (isOpen ? 1 : 0) : (isCollapsed ? 0 : 1),
        pointerEvents: isMobile ? (isOpen ? 'auto' : 'none') : (isCollapsed ? 'none' : 'auto')
      }}>
        
        {/* Header do carrinho */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          paddingBottom: '12px',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #f0f0f0',
          marginBottom: '15px'
        }}>
          <h2 style={{ 
            fontSize: isMobile ? '18px' : '16px', 
            fontWeight: 700, 
            margin: 0, 
            color: '#2C3E50',
            paddingLeft: '5px'
          }}>
            🛒 Seu Carrinho ({cart.length})
          </h2>
          <button 
            onClick={toggleCart}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: isMobile ? '24px' : '20px', 
              cursor: 'pointer', 
              color: '#7F8C8D', 
              padding: '6px',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#f8f9fa'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            ×
          </button>
        </div>

        {/* Banner de frete grátis */}
        <div style={{
          backgroundColor: '#E8F5E8',
          color: '#27AE60',
          padding: isMobile ? '12px' : '10px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '15px',
          fontSize: isMobile ? '13px' : '12px',
          fontWeight: 700,
          border: '1px solid #C8E6C9',
          lineHeight: '1.3'
        }}>
          🚚 FRETE GRÁTIS • PEDIDO MÍNIMO R$ 900
        </div>

        {groupedCart.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '30px 15px', 
            color: '#7F8C8D' 
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛒</div>
            <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '5px' }}>Seu carrinho está vazio</p>
            <p style={{ fontSize: '14px' }}>Adicione produtos para continuar</p>
          </div>
        ) : (
          <>
            {/* Lista de produtos */}
            <div style={{ 
              marginBottom: '15px', 
              maxHeight: isMobile ? 'calc(85vh - 350px)' : 'calc(85vh - 400px)', 
              overflowY: 'auto',
              paddingRight: '5px'
            }}>
              {groupedCart.map((product) => {
                const calculated = calculateProductPrice(product);
                const isElegivel = !PRODUTOS_EM_OFERTA.includes(product.id);
                const precoComDesconto = getPrecoComDesconto(product.id, product.totalPrice);
                const temDesconto = precoComDesconto !== product.totalPrice;
                
                return (
                  <div 
                    key={`${product.id}-${product.quantity}`} 
                    style={{ 
                      padding: isMobile ? '15px 0' : '12px 0', 
                      borderBottom: '2px solid #f8f9fa',
                      backgroundColor: '#fff',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      opacity: cupomAtivo && !isElegivel ? 0.7 : 1
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: isMobile ? '12px' : '10px',
                      marginBottom: '10px'
                    }}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        style={{ 
                          width: isMobile ? '60px' : '50px', 
                          height: isMobile ? '60px' : '50px', 
                          borderRadius: '6px', 
                          objectFit: 'cover', 
                          border: '1px solid #eee',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ 
                        flex: 1, 
                        minWidth: 0,
                        paddingRight: '5px'
                      }}>
                        <p style={{ 
                          fontWeight: 600, 
                          margin: '0 0 5px 0', 
                          color: '#2C3E50', 
                          fontSize: isMobile ? '14px' : '13px',
                          lineHeight: '1.3',
                          wordWrap: 'break-word'
                        }}>
                          {product.name}
                          {!isElegivel && (
                            <span style={{
                              display: 'inline-block',
                              marginLeft: '6px',
                              padding: '2px 6px',
                              backgroundColor: '#FF6B6B',
                              color: 'white',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: 700
                            }}>
                              OFERTA
                            </span>
                          )}
                          {temDesconto && isElegivel && (cupomAtivo || campanhaAtiva) && (
                            <span style={{
                              display: 'inline-block',
                              marginLeft: '6px',
                              padding: '2px 6px',
                              backgroundColor: '#27AE60',
                              color: 'white',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: 700
                            }}>
                              {cupomAtivo ? `${cupomAplicado?.desconto}% OFF` : `${CAMPANHA_CONFIG.desconto}% OFF`}
                            </span>
                          )}
                        </p>
                        {product.isBox && product.boxWeight ? (
                          <p style={{ 
                            margin: '2px 0 0', 
                            fontSize: isMobile ? '12px' : '11px', 
                            color: '#666',
                            lineHeight: '1.2'
                          }}>
                            📦 {product.quantity}x Caixa • {product.boxWeight}KG
                          </p>
                        ) : calculated.weight ? (
                          <p style={{ 
                            margin: '2px 0 0', 
                            fontSize: isMobile ? '12px' : '11px', 
                            color: '#666',
                            lineHeight: '1.2'
                          }}>
                            ⚖️ {product.quantity}x • {calculated.weight} KG × R$ {calculated.unitPrice.toFixed(2)}/KG
                          </p>
                        ) : (
                          <p style={{ 
                            margin: '2px 0 0', 
                            fontSize: isMobile ? '12px' : '11px', 
                            color: '#666',
                            lineHeight: '1.2'
                          }}>
                            📋 {product.quantity}x • R$ {calculated.unitPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Controles de quantidade e preço */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginTop: '10px',
                      paddingLeft: isMobile ? '0' : '60px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: isMobile ? '10px' : '6px',
                        background: '#f8f9fa',
                        borderRadius: '20px',
                        padding: isMobile ? '6px 10px' : '4px 8px'
                      }}>
                        <button
                          onClick={() => adjustQuantity(product.id, -1)}
                          style={{ 
                            background: '#E74C3C', 
                            color: 'white',
                            border: 'none', 
                            borderRadius: '50%', 
                            width: isMobile ? '28px' : '24px', 
                            height: isMobile ? '28px' : '24px', 
                            cursor: 'pointer',
                            fontSize: isMobile ? '16px' : '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#C0392B'}
                          onMouseOut={(e) => e.target.style.background = '#E74C3C'}
                        > - </button>
                        <span style={{ 
                          fontSize: isMobile ? '14px' : '12px', 
                          fontWeight: '600',
                          minWidth: '18px',
                          textAlign: 'center'
                        }}>
                          {product.quantity}
                        </span>
                        <button
                          onClick={() => adjustQuantity(product.id, 1)}
                          style={{ 
                            background: '#2ECC71', 
                            color: 'white',
                            border: 'none', 
                            borderRadius: '50%', 
                            width: isMobile ? '28px' : '24px', 
                            height: isMobile ? '28px' : '24px', 
                            cursor: 'pointer',
                            fontSize: isMobile ? '16px' : '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#27AE60'}
                          onMouseOut={(e) => e.target.style.background = '#2ECC71'}
                        > + </button>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: isMobile ? '12px' : '8px' 
                      }}>
                        <div style={{ textAlign: 'right' }}>
                          {temDesconto && (cupomAtivo || campanhaAtiva) ? (
                            <>
                              <p style={{ 
                                fontWeight: 700, 
                                margin: 0, 
                                color: '#27AE60', 
                                fontSize: isMobile ? '15px' : '14px'
                              }}>
                                R$ {precoComDesconto.toFixed(2)}
                              </p>
                              <p style={{ 
                                margin: 0, 
                                color: '#999', 
                                fontSize: isMobile ? '11px' : '10px',
                                textDecoration: 'line-through'
                              }}>
                                R$ {product.totalPrice.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p style={{ 
                              fontWeight: 700, 
                              margin: 0, 
                              color: '#E74C3C', 
                              fontSize: isMobile ? '15px' : '14px'
                            }}>
                              R$ {product.totalPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          style={{ 
                            background: '#FF6B6B', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '50%',
                            width: isMobile ? '32px' : '28px',
                            height: isMobile ? '32px' : '28px',
                            cursor: 'pointer', 
                            fontSize: isMobile ? '16px' : '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                          onMouseOver={(e) => e.target.style.background = '#EE5A52'}
                          onMouseOut={(e) => e.target.style.background = '#FF6B6B'}
                        > × </button>
                      </div>
                    </div>

                    {/* Mostra o desconto distribuído */}
                    {dadosDesconto && dadosDesconto.itensComDesconto[product.id] && (
                      <div style={{
                        marginTop: '8px',
                        padding: '5px 10px',
                        backgroundColor: '#E8F5E8',
                        borderRadius: '6px',
                        fontSize: '11px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        border: '1px solid #C8E6C9'
                      }}>
                        <span style={{ color: '#27AE60' }}>
                          Desconto distribuído ({dadosDesconto.percentualAplicado}%):
                        </span>
                        <span style={{ fontWeight: 600, color: '#27AE60' }}>
                          - R$ {dadosDesconto.itensComDesconto[product.id].descontoAplicado.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ✅ PRIMEIRO AVISO DE PAGAMENTO (antes do resumo) */}
            <div style={{ 
              backgroundColor: '#FFF3E0', 
              color: '#E65100', 
              padding: isMobile ? '12px' : '10px', 
              borderRadius: '8px', 
              marginBottom: '15px', 
              textAlign: 'center',
              border: '1px solid #FFE0B2',
              fontSize: isMobile ? '12px' : '11px',
              fontWeight: 500
            }}>
              ⚠️ Não aceitamos pagamento antecipado, pague no ato da entrega
            </div>

{/* ⭐ AVISO DA CAMPANHA ATIVA - SÓ MOSTRA SE ATIVA */}
{CAMPANHA_CONFIG.ativa && campanhaAtiva && (
  <div style={{
    backgroundColor: '#E8F5E8',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '2px solid #66BB6A',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎉</div>
    <p style={{ margin: 0, color: '#1B5E20', fontWeight: 600, fontSize: '14px' }}>
      Parabéns! Você ganhou 2% de desconto através da campanha Quatá + Cargill.
    </p>
<p style={{ margin: '5px 0 0', color: '#2E7D32', fontSize: '12px' }}>
  Desconto distribuído entre os itens
  <br />
  ( Não aplicado para produtos em oferta )
</p>
  </div>
)}

            {/* Resumo do pedido */}
            <div style={{ 
              backgroundColor: '#F8F9FA', 
              padding: isMobile ? '15px' : '12px', 
              borderRadius: '10px', 
              marginBottom: '15px', 
              border: '2px solid #E9ECEF' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#495057', fontSize: isMobile ? '14px' : '13px' }}>Subtotal:</span>
                <span style={{ fontWeight: 600, fontSize: isMobile ? '14px' : '13px' }}>R$ {totalSemDesconto.toFixed(2)}</span>
              </div>
              
              {/* Linha de desconto do cupom ou campanha */}
              {dadosDesconto && dadosDesconto.totalDesconto > 0 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '10px',
                  color: '#27AE60',
                  fontSize: isMobile ? '12px' : '11px'
                }}>
                  <span style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '220px'
                  }}>
                    {cupomAtivo ? (
                      <>🏷️ Desconto ({cupomAplicado.nome} - {cupomAplicado.desconto}%):</>
                    ) : campanhaAtiva ? (
                      <>🎁 Desconto Campanha ({CAMPANHA_CONFIG.desconto}%):</>
                    ) : null}
                  </span>
                  <span style={{ 
                    fontWeight: 600, 
                    marginLeft: '8px',
                    whiteSpace: 'nowrap'
                  }}>
                    - R$ {dadosDesconto.totalDesconto.toFixed(2)}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#495057', fontSize: isMobile ? '14px' : '13px' }}>Frete:</span>
                <span style={{ color: '#27AE60', fontWeight: 600, fontSize: isMobile ? '14px' : '13px' }}>Grátis</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                paddingTop: '12px', 
                borderTop: '2px solid #DEE2E6' 
              }}>
                <span style={{ fontWeight: 700, fontSize: isMobile ? '15px' : '14px' }}>Total:</span>
                <span style={{ 
                  fontWeight: 700, 
                  color: (cupomAtivo || campanhaAtiva) ? '#27AE60' : '#E74C3C', 
                  fontSize: isMobile ? '16px' : '15px' 
                }}>
                  R$ {totalComDesconto.toFixed(2)}
                </span>
              </div>
            </div>

{/* ✅ SEÇÃO DE CUPOM - APARECE QUANDO:
    1. Campanha DESATIVADA (ativa: false) OU
    2. Campanha ATIVA mas NÃO QUALIFICADA (cliente não atingiu requisitos)
*/}
{(!CAMPANHA_CONFIG.ativa || !campanhaAtiva) && (
  <div style={{
    backgroundColor: '#F8F9FA',
    borderRadius: '10px',
    marginBottom: '15px',
    border: '2px solid #E9ECEF',
    overflow: 'hidden'
  }}>
                {/* Cabeçalho clicável */}
                <div 
                  onClick={() => setCupomExpanded(!cupomExpanded)}
                  style={{
                    padding: '12px 15px',
                    backgroundColor: cupomAplicado ? '#E8F5E8' : '#F8F9FA',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: cupomExpanded ? '2px solid #E9ECEF' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: isMobile ? '16px' : '15px',
                      color: cupomAplicado ? '#27AE60' : '#2C3E50',
                      fontWeight: 600
                    }}>
                      {cupomAplicado ? (
                        <>🏷️ Cupom aplicado: <span style={{ color: '#27AE60' }}>{cupomAplicado.nome}</span></>
                      ) : (
                        '🏷️ Aplicar Desconto'
                      )}
                    </span>
                    {cupomAplicado && (
                      <span style={{
                        backgroundColor: '#27AE60',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {cupomAplicado.desconto}% OFF
                      </span>
                    )}
                  </div>
                  <span style={{
                    fontSize: '18px',
                    color: '#095400',
                    transform: cupomExpanded ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s'
                  }}>
                    ▼
                  </span>
                </div>

                {/* Conteúdo expansível */}
                <div style={{
                  maxHeight: cupomExpanded ? '300px' : '0',
                  padding: cupomExpanded ? '15px' : '0 15px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  opacity: cupomExpanded ? 1 : 0
                }}>
                  
                  {!cupomAplicado ? (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                      <input
                        type="text"
                        value={cupomInput}
                        onChange={(e) => setCupomInput(e.target.value)}
                        placeholder="Digite PEDIDO1000 ou PEDIDO2000"
                        style={{
                          flex: 1,
                          padding: isMobile ? '12px' : '10px',
                          border: '2px solid #E9ECEF',
                          borderRadius: '8px',
                          fontSize: isMobile ? '14px' : '13px',
                          outline: 'none',
                          transition: 'border 0.2s',
                          textTransform: 'uppercase',
                          backgroundColor: '#fff'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#095400'}
                        onBlur={(e) => e.target.style.borderColor = '#E9ECEF'}
                        onKeyPress={(e) => e.key === 'Enter' && aplicarCupom()}
                      />
                      <button
                        onClick={aplicarCupom}
                        style={{
                          backgroundColor: '#095400',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: isMobile ? '0 15px' : '0 12px',
                          fontSize: isMobile ? '14px' : '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0a6d00'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#095400'}
                      >
                        Aplicar
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#E8F5E8',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #C8E6C9',
                      marginBottom: '15px'
                    }}>
                      <div>
                        <span style={{ 
                          fontWeight: 700, 
                          color: '#27AE60',
                          fontSize: isMobile ? '14px' : '13px'
                        }}>
                          {cupomAplicado.nome}
                        </span>
                        <span style={{ 
                          display: 'block',
                          fontSize: isMobile ? '12px' : '11px',
                          color: '#1B5E20'
                        }}>
                          {cupomAplicado.desconto}% distribuído entre os itens
                        </span>
                      </div>
                      <button
                        onClick={removerCupom}
                        style={{
                          backgroundColor: '#E74C3C',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#C0392B'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#E74C3C'}
                      >
                        Remover
                      </button>
                    </div>
                  )}

                  {/* Mensagem do cupom */}
                  {mensagemCupom.texto && (
                    <div style={{
                      marginBottom: '15px',
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: isMobile ? '12px' : '11px',
                      backgroundColor: 
                        mensagemCupom.tipo === 'sucesso' ? '#E8F5E8' :
                        mensagemCupom.tipo === 'erro' ? '#FFEBEE' : '#F8F9FA',
                      color: 
                        mensagemCupom.tipo === 'sucesso' ? '#27AE60' :
                        mensagemCupom.tipo === 'erro' ? '#E74C3C' : '#2C3E50',
                      border: `1px solid ${
                        mensagemCupom.tipo === 'sucesso' ? '#C8E6C9' :
                        mensagemCupom.tipo === 'erro' ? '#FFCDD2' : '#E9ECEF'
                      }`
                    }}>
                      {mensagemCupom.texto}
                    </div>
                  )}

                  {/* Info dos cupons disponíveis */}
                  <div style={{
                    fontSize: isMobile ? '11px' : '10px',
                    color: '#666',
                    borderTop: '2px dashed #E9ECEF',
                    paddingTop: '10px'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '5px', color: '#2C3E50' }}>Cupons disponíveis:</div>
                    {Object.values(CUPONS).map(cupom => (
                      <div key={cupom.nome} style={{ marginBottom: '3px' }}>
                        <strong style={{ color: '#095400' }}>{cupom.nome}</strong>: {cupom.descricao}
                      </div>
                    ))}
                    <div style={{ marginTop: '5px', color: '#999' }}>
                      * Desconto não aplicado para produtos em ofertas
                    </div>
                  </div>
                </div>
              </div>
            )}

{/* ✅ AVISO QUANDO CAMPANHA ESTÁ ATIVA E QUALIFICADA (CUPONS BLOQUEADOS) */}
{CAMPANHA_CONFIG.ativa && campanhaAtiva && (
  <div style={{
    padding: '10px',
    backgroundColor: '#FFF3E0',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #FFE0B2',
    textAlign: 'center',
    fontSize: isMobile ? '12px' : '11px',
    color: '#E65100'
  }}>
    ⚠️ Cupons indisponíveis enquanto a campanha estiver ativa
  </div>
)}

            {/* ✅ SEGUNDO AVISO DE PAGAMENTO (antes da forma de pagamento) */}
            <div style={{ 
              backgroundColor: '#FFF3E0', 
              color: '#E65100', 
              padding: isMobile ? '12px' : '10px', 
              borderRadius: '8px', 
              marginBottom: '15px', 
              textAlign: 'center',
              border: '1px solid #FFE0B2',
              fontSize: isMobile ? '12px' : '11px',
              fontWeight: 500
            }}>
              ⚠️ Não aceitamos pagamento antecipado, pague no ato da entrega
            </div>

            {/* Seleção de pagamento */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: isMobile ? '15px' : '14px', 
                fontWeight: 700, 
                marginBottom: '12px', 
                color: '#2C3E50' 
              }}>
                💳 Forma de Pagamento
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito'].map(method => (
                  <label 
                    key={method} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: isMobile ? '12px 10px' : '10px 12px', 
                      borderRadius: '8px', 
                      background: paymentMethod === method ? '#E8F5E9' : '#FAFAFA', 
                      border: `2px solid ${paymentMethod === method ? '#2ECC71' : '#EEE'}`, 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: isMobile ? '14px' : '13px'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value={method} 
                      checked={paymentMethod === method} 
                      onChange={() => setPaymentMethod(method)} 
                      style={{ 
                        marginRight: '12px', 
                        accentColor: '#2ECC71',
                        width: isMobile ? '16px' : '14px',
                        height: isMobile ? '16px' : '14px'
                      }} 
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            {/* ✅ BOTÃO FINALIZAR MODIFICADO - MOSTRA "FAZER LOGIN" QUANDO NÃO LOGADO */}
            <button
              onClick={finalizarPedido}
              disabled={!isTotalValid || !paymentMethod || finalizando}
              style={{ 
                width: '100%', 
                padding: isMobile ? '16px' : '14px', 
                background: isTotalValid && paymentMethod && !finalizando ? '#2ECC71' : '#BDC3C7', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                fontWeight: 700, 
                fontSize: isMobile ? '15px' : '14px', 
                cursor: isTotalValid && paymentMethod && !finalizando ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                boxShadow: isTotalValid && paymentMethod && !finalizando ? '0 4px 15px rgba(46, 204, 113, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (isTotalValid && paymentMethod && !finalizando) {
                  e.target.style.background = '#27AE60';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (isTotalValid && paymentMethod && !finalizando) {
                  e.target.style.background = '#2ECC71';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            > 
              {finalizando ? (
                '🔄 Finalizando...'
              ) : (
                // ✅ VERIFICA SE USUÁRIO ESTÁ LOGADO PARA MOSTRAR TEXTO DIFERENTE
                user ? '📲 FINALIZAR PEDIDO' : '🔑 FAZER LOGIN PARA FINALIZAR'
              )}
            </button>

            {!isTotalValid && (
              <p style={{ 
                color: '#E74C3C', 
                textAlign: 'center', 
                marginTop: '12px', 
                fontSize: isMobile ? '12px' : '11px',
                fontWeight: 500
              }}>
                ❌ O pedido mínimo é R$ 900.00
                {(cupomAtivo || campanhaAtiva) && ` (com desconto aplicado)`}
              </p>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default Cart;
