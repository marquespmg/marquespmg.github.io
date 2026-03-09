// components/CartNotification.js
import { supabase } from '../lib/supabaseClient';

// ==============================================
// SISTEMA DE NOTIFICAÇÕES DE CARRINHO - PMG ATACADISTA
// ==============================================

class CartNotificationSystem {
  constructor(supabaseClient, options = {}) {
    this.supabase = supabaseClient;
    this.user = null;
    this.cartData = null;
    this.notificationTimer = null;
    this.exitIntentEnabled = true;
    this.popupShown = false;
    this.notificationShown = false;
    this.lastTotal = 0;
    
    this.options = {
      pedidoMinimo: 900,
      tempoNotificacao: 30000,
      tempoMensagemVisivel: 25000,
      ...options
    };
    
    if (typeof window !== 'undefined') {
      this.init();
    }
  }
  
  // ==============================================
  // INICIALIZAÇÃO
  // ==============================================
  async init() {
    console.log('🛒 Sistema de Notificações iniciado');
    
    await this.checkUser();
    this.setupAuthListener();
    this.setupExitIntentListeners();
    this.addStyles();
    this.loadFromLocalStorage();
  }
  
  // ==============================================
  // CARREGA DO LOCALSTORAGE
  // ==============================================
  loadFromLocalStorage() {
    try {
      const savedCart = localStorage.getItem('cart_data');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        this.cartData = { cart_items: parsedCart };
        console.log('📦 Carrinho carregado do localStorage:', parsedCart.length, 'itens');
        
        const total = this.calculateCartTotal(parsedCart);
        console.log(`💰 Total do localStorage: R$ ${total.toFixed(2)}`);
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
  }
  
  // ==============================================
  // ADICIONA CSS
  // ==============================================
  addStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('cart-notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cart-notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translate(-50%, -60%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
      
      .cart-notification, .exit-popup {
        font-family: 'Segoe UI', Roboto, sans-serif;
      }
      
      .cart-notification {
        animation: slideIn 0.3s ease-out;
      }
      
      .exit-popup {
        animation: fadeIn 0.3s ease-out;
      }
      
      .cart-notification button, .exit-popup button {
        transition: all 0.2s ease;
      }
      
      .cart-notification button:hover, .exit-popup button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
    `;
    document.head.appendChild(style);
  }
  
  // ==============================================
  // VERIFICA USUÁRIO
  // ==============================================
  async checkUser() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      this.user = user;
      
      if (user) {
        console.log('👤 Usuário logado:', user.email);
        await this.loadCartData();
        this.startNotificationTimer();
      } else {
        console.log('👤 Nenhum usuário logado');
        this.loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    }
  }
  
  // ==============================================
  // LISTENER DE AUTENTICAÇÃO
  // ==============================================
  setupAuthListener() {
    if (!this.supabase) return;
    
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
      async (event, session) => {
        this.user = session?.user || null;
        
        if (event === 'SIGNED_IN') {
          console.log('✅ Usuário logou');
          await this.loadCartData();
          this.resetNotificationState();
          this.startNotificationTimer();
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 Usuário deslogou');
          this.clearNotificationTimer();
          this.cartData = null;
          this.resetNotificationState();
          this.loadFromLocalStorage();
        }
      }
    );
    
    this.authSubscription = subscription;
  }
  
  // ==============================================
  // RESETA ESTADO
  // ==============================================
  resetNotificationState() {
    this.notificationShown = false;
    this.popupShown = false;
    this.lastTotal = 0;
    console.log('🔄 Estado das notificações resetado');
  }
  
  // ==============================================
  // CARREGA DADOS DO CARRINHO
  // ==============================================
  async loadCartData() {
    this.loadFromLocalStorage();
    
    if (!this.user) return null;
    
    try {
      const { data, error } = await this.supabase
        .from('user_carts')
        .select('cart_items, updated_at')
        .eq('user_id', this.user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ Nenhum carrinho no Supabase');
          return null;
        }
        throw error;
      }
      
      console.log('✅ Carrinho carregado do Supabase:', data);
      
      if (data && data.cart_items) {
        const localCart = JSON.parse(localStorage.getItem('cart_data') || '[]');
        
        if (data.cart_items.length >= localCart.length) {
          this.cartData = data;
          localStorage.setItem('cart_data', JSON.stringify(data.cart_items));
        } else {
          this.cartData = { cart_items: localCart };
        }
      }
      
      return data;
    } catch (error) {
      console.error('❌ Erro ao carregar carrinho:', error);
      return null;
    }
  }
  
  // ==============================================
  // CALCULA TOTAL DO CARRINHO
  // ==============================================
  calculateCartTotal(cartItems) {
    if (!cartItems || cartItems.length === 0) return 0;
    
    const isBoxProduct = (productName) => {
      return /\(?\s*CX\s*\d+\.?\d*\s*KG\s*\)?/i.test(productName);
    };
    
    const extractWeight = (productName) => {
      const weightMatch = productName.match(/(\d+\.?\d*)\s*KG/i);
      return weightMatch ? parseFloat(weightMatch[1]) : null;
    };
    
    const calculateProductPrice = (product) => {
      if (isBoxProduct(product.name)) {
        return product.price;
      }
      
      const weight = extractWeight(product.name);
      if (weight) {
        return product.price * weight;
      }
      
      return product.price;
    };
    
    const groupedItems = cartItems.reduce((acc, item) => {
      const existing = acc.find(p => p.id === item.id);
      const itemPrice = calculateProductPrice(item);
      const quantity = item.quantity || 1;
      
      if (existing) {
        existing.quantity += quantity;
        existing.totalPrice += itemPrice * quantity;
      } else {
        acc.push({
          ...item,
          quantity: quantity,
          unitPrice: itemPrice,
          totalPrice: itemPrice * quantity
        });
      }
      return acc;
    }, []);
    
    return groupedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }
  
  // ==============================================
  // GERA SUGESTÃO
  // ==============================================
  generateProductSuggestion(cartItems, totalAtual) {
    if (!cartItems || cartItems.length === 0) return null;
    
    const falta = Math.max(0, this.options.pedidoMinimo - totalAtual);
    if (falta <= 0) return null;
    
    const produtoSugerido = cartItems[Math.floor(Math.random() * cartItems.length)];
    
    const calculateUnitPrice = (product) => {
      if (/\(?\s*CX\s*\d+\.?\d*\s*KG\s*\)?/i.test(product.name)) {
        return product.price;
      }
      
      const weightMatch = product.name.match(/(\d+\.?\d*)\s*KG/i);
      if (weightMatch) {
        return product.price;
      }
      
      return product.price;
    };
    
    const precoUnitario = calculateUnitPrice(produtoSugerido);
    const unidadesNecessarias = Math.ceil(falta / precoUnitario);
    
    let nomeProduto = produtoSugerido.name;
    nomeProduto = nomeProduto.replace(/\s*\(\s*CX\s*\d+\.?\d*\s*KG\s*\)/i, '');
    nomeProduto = nomeProduto.replace(/\s*\d+\.?\d*\s*KG/i, '');
    nomeProduto = nomeProduto.trim();
    
    return {
      produto: produtoSugerido,
      nomeBase: nomeProduto,
      precoUnitario: precoUnitario,
      unidadesNecessarias: unidadesNecessarias
    };
  }
  
  // ==============================================
  // INICIA TIMER
  // ==============================================
  startNotificationTimer() {
    if (this.notificationShown) {
      console.log('⏰ Notificação já foi mostrada');
      return;
    }
    
    this.clearNotificationTimer();
    
    this.notificationTimer = setTimeout(() => {
      this.checkAndShowNotification();
    }, this.options.tempoNotificacao);
    
    console.log(`⏰ Timer iniciado (${this.options.tempoNotificacao/1000}s)`);
  }
  
  // ==============================================
  // LIMPA TIMER
  // ==============================================
  clearNotificationTimer() {
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
      this.notificationTimer = null;
    }
  }
  
  // ==============================================
  // VERIFICA NOTIFICAÇÃO
  // ==============================================
  async checkAndShowNotification() {
    this.loadFromLocalStorage();
    
    const cartItems = this.cartData?.cart_items;
    if (!cartItems || cartItems.length === 0) {
      console.log('ℹ️ Carrinho vazio');
      return;
    }
    
    const total = this.calculateCartTotal(cartItems);
    console.log(`💰 Total atual: R$ ${total.toFixed(2)}`);
    
    if (total >= this.options.pedidoMinimo) {
      console.log('✅ Pedido atingiu mínimo');
      this.resetNotificationState();
      return;
    }
    
    if (!this.notificationShown) {
      this.showCartNotification(cartItems, total);
    }
  }
  
  // ==============================================
  // MOSTRA NOTIFICAÇÃO (COM BOTÃO CORRIGIDO)
  // ==============================================
  showCartNotification(cartItems, total) {
    if (this.notificationShown) return;
    this.notificationShown = true;
    
    const falta = this.options.pedidoMinimo - total;
    const sugestao = this.generateProductSuggestion(cartItems, total);
    
    if (!sugestao) return;
    
    // FUNÇÃO PARA ABRIR O CARRINHO (CORRIGIDA)
    const abrirCarrinho = `
      (function() {
        // Fecha a notificação
        const notif = document.querySelector('.cart-notification');
        if (notif) notif.style.display = 'none';
        
        // Encontra o BOTÃO DO CARRINHO (fundo verde escuro #095400)
        const botoes = document.querySelectorAll('button');
        let botaoCarrinho = null;
        
        for (let botao of botoes) {
          const estilo = window.getComputedStyle(botao);
          const corFundo = estilo.backgroundColor;
          const texto = botao.innerText || '';
          const html = botao.innerHTML || '';
          
          // Verifica se tem fundo verde escuro E contém 🛒
          if ((corFundo.includes('rgb(9, 84, 0)') || corFundo.includes('#095400')) && 
              (html.includes('🛒') || texto.includes('🛒'))) {
            botaoCarrinho = botao;
            break;
          }
        }
        
        // Se não achou pela cor, tenta pelo estilo position fixed
        if (!botaoCarrinho) {
          for (let botao of botoes) {
            const estilo = window.getComputedStyle(botao);
            if (estilo.position === 'fixed' && 
                (botao.innerHTML.includes('🛒') || botao.innerText.includes('🛒'))) {
              botaoCarrinho = botao;
              break;
            }
          }
        }
        
        // Clica no botão se encontrou
        if (botaoCarrinho) {
          botaoCarrinho.click();
        } else {
          console.log('❌ Botão do carrinho não encontrado');
        }
      })()
    `;
    
    const mensagem = `
      <div style="font-family: 'Segoe UI', Roboto, sans-serif; padding: 5px;">
        <div style="font-size: 16px; font-weight: 700; color: #095400; margin-bottom: 10px;">
          🛒 Olá! Uma dica pra você...
        </div>
        <div style="margin-bottom: 12px; font-size: 14px;">
          Vi que você adicionou <strong style="color: #095400;">${sugestao.nomeBase}</strong> no carrinho.
        </div>
        <div style="background-color: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>🛍️ Seu pedido atual:</span>
            <strong style="color: #E74C3C;">R$ ${total.toFixed(2)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>🎯 Para pedido mínimo:</span>
            <strong style="color: #095400;">R$ ${falta.toFixed(2)}</strong>
          </div>
        </div>
        <div style="font-size: 14px; line-height: 1.5; color: #2C3E50;">
          Que tal completar seu pedido? Adicionando mais <strong style="color: #095400;">${sugestao.unidadesNecessarias} unidade${sugestao.unidadesNecessarias > 1 ? 's' : ''}</strong> 
          de ${sugestao.nomeBase} (R$ ${(sugestao.precoUnitario * sugestao.unidadesNecessarias).toFixed(2)}), 
          você atinge o valor mínimo e já pode finalizar! 😊
        </div>
        <div style="margin-top: 15px; display: flex; gap: 10px;">
          <button onclick="this.closest('.cart-notification').style.display = 'none';" 
            style="flex: 1; padding: 8px; background-color: #f0f0f0; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
            Agora não, obrigado
          </button>
          <button onclick="${abrirCarrinho}" 
            style="flex: 1; padding: 8px; background-color: #095400; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">
            Ver meu carrinho
          </button>
        </div>
      </div>
    `;
    
    this.createNotificationElement(mensagem, 'cart-notification');
  }
  
  // ==============================================
  // CONFIGURA EXIT INTENT
  // ==============================================
  setupExitIntentListeners() {
    if (typeof document === 'undefined') return;
    
    // Desktop - Exit Intent (quando mouse vai pro topo)
    document.addEventListener('mouseout', (e) => {
      if (!this.exitIntentEnabled) return;
      if (!this.cartData) return;
      
      const cartItems = this.cartData.cart_items;
      if (!cartItems || cartItems.length === 0) return;
      
      const total = this.calculateCartTotal(cartItems);
      if (total >= this.options.pedidoMinimo) return;
      
      // Detecta quando mouse vai para o topo (intenção de sair)
      if (e.clientY <= 5) {
        // Permite mostrar popup SEMPRE que tentar sair (remove popupShown)
        this.checkAndShowExitPopup();
      }
    });
    
    // Mobile - Visibility Change (quando aba perde foco)
    document.addEventListener('visibilitychange', () => {
      if (!this.exitIntentEnabled) return;
      if (!this.cartData) return;
      
      const cartItems = this.cartData.cart_items;
      if (!cartItems || cartItems.length === 0) return;
      
      const total = this.calculateCartTotal(cartItems);
      if (total >= this.options.pedidoMinimo) return;
      
      if (document.visibilityState === 'hidden') {
        setTimeout(() => {
          this.checkAndShowExitPopup();
        }, 100);
      }
    });
  }
  
// ==============================================
// VERIFICA EXIT POPUP (COM LIMITE)
// ==============================================
async checkAndShowExitPopup() {
  // Só mostra se NÃO tiver mostrado nos últimos 2 minutos
  if (this.popupShown) {
    console.log('⏰ Popup já mostrado recentemente, aguardando...');
    return;
  }
  
  this.loadFromLocalStorage();
  
  const cartItems = this.cartData?.cart_items;
  if (!cartItems || cartItems.length === 0) return;
  
  const total = this.calculateCartTotal(cartItems);
  if (total >= this.options.pedidoMinimo) return;
  
  // Marca que mostrou e programa para liberar depois
  this.popupShown = true;
  this.showExitPopup(cartItems, total);
  
  // Libera para mostrar novamente após 2 minutos
  setTimeout(() => {
    this.popupShown = false;
    console.log('⏰ Popup liberado para mostrar novamente');
  }, 120000); // 2 minutos
}
  
  // ==============================================
  // MOSTRA EXIT POPUP (COM BOTÃO CORRIGIDO)
  // ==============================================
  showExitPopup(cartItems, total) {
    const falta = this.options.pedidoMinimo - total;
    const sugestao = this.generateProductSuggestion(cartItems, total);
    
    if (!sugestao) return;
    
    // FUNÇÃO PARA ABRIR CARRINHO
    const abrirCarrinho = `
      (function() {
        // Fecha o popup
        const popup = document.querySelector('.exit-popup');
        const overlay = document.querySelector('.exit-popup-overlay');
        if (popup) popup.style.display = 'none';
        if (overlay) overlay.remove();
        
        // Encontra o BOTÃO DO CARRINHO
        const botoes = document.querySelectorAll('button');
        let botaoCarrinho = null;
        
        for (let botao of botoes) {
          const estilo = window.getComputedStyle(botao);
          const corFundo = estilo.backgroundColor;
          const texto = botao.innerText || '';
          const html = botao.innerHTML || '';
          
          if ((corFundo.includes('rgb(9, 84, 0)') || corFundo.includes('#095400')) && 
              (html.includes('🛒') || texto.includes('🛒'))) {
            botaoCarrinho = botao;
            break;
          }
        }
        
        if (!botaoCarrinho) {
          for (let botao of botoes) {
            const estilo = window.getComputedStyle(botao);
            if (estilo.position === 'fixed' && 
                (botao.innerHTML.includes('🛒') || botao.innerText.includes('🛒'))) {
              botaoCarrinho = botao;
              break;
            }
          }
        }
        
        if (botaoCarrinho) {
          botaoCarrinho.click();
        }
      })()
    `;
    
    // FUNÇÃO PARA SAIR DE VERDADE
    const sairDeVerdade = `
      (function() {
        // Fecha o popup
        const popup = document.querySelector('.exit-popup');
        const overlay = document.querySelector('.exit-popup-overlay');
        if (popup) popup.style.display = 'none';
        if (overlay) overlay.remove();
        
        // Permite sair da página (não faz nada, só fecha o popup)
        console.log('👋 Usuário optou por sair');
      })()
    `;
    
    const mensagem = `
      <div style="font-family: 'Segoe UI', Roboto, sans-serif; padding: 10px;">
        <div style="font-size: 20px; font-weight: 700; color: #095400; margin-bottom: 10px;">
          ⏳ Já vai? Espera só um momentinho...
        </div>
        <div style="margin-bottom: 15px; font-size: 16px; color: #2C3E50;">
          Seu carrinho está com <strong style="color: #E74C3C;">R$ ${total.toFixed(2)}</strong> em produtos
        </div>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 15px;">✨ Faltam apenas:</span>
            <strong style="color: #095400; font-size: 18px;">R$ ${falta.toFixed(2)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 15px;">🎁 Para pedido mínimo:</span>
            <strong>R$ ${this.options.pedidoMinimo.toFixed(2)}</strong>
          </div>
        </div>
        <div style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #2C3E50;">
          <span style="font-size: 16px;">💡</span> Que tal aproveitar e adicionar mais 
          <strong style="color: #095400;">${sugestao.unidadesNecessarias} unidade${sugestao.unidadesNecessarias > 1 ? 's' : ''}</strong> 
          de <strong style="color: #095400;">${sugestao.nomeBase}</strong>? 
          Assim você completa seu pedido e já pode finalizar! 🚀
        </div>
        <div style="display: flex; gap: 12px;">
          <button onclick="${sairDeVerdade}" 
            style="flex: 1; padding: 12px; background-color: #f0f0f0; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
            Continuar saindo
          </button>
          <button onclick="${abrirCarrinho}" 
            style="flex: 1; padding: 12px; background-color: #095400; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
            Ver meu carrinho
          </button>
        </div>
      </div>
    `;
    
    this.createNotificationElement(mensagem, 'exit-popup', true);
  }
  
  // ==============================================
  // CRIA ELEMENTO DE NOTIFICAÇÃO
  // ==============================================
  createNotificationElement(html, className, isPopup = false) {
    if (typeof document === 'undefined') return;
    
    const existing = document.querySelector(`.${className}`);
    if (existing) existing.remove();
    
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = html;
    
    const baseStyles = {
      position: 'fixed',
      zIndex: 9999,
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      border: '2px solid #095400',
      maxWidth: '400px',
      width: 'calc(100% - 40px)',
      fontFamily: "'Segoe UI', Roboto, sans-serif"
    };
    
    if (isPopup) {
      Object.assign(div.style, baseStyles, {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '25px'
      });
      
      const overlay = document.createElement('div');
      overlay.className = `${className}-overlay`;
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        z-index: 9998;
      `;
      overlay.onclick = () => {
        overlay.remove();
        div.remove();
      };
      document.body.appendChild(overlay);
      
    } else {
      Object.assign(div.style, baseStyles, {
        bottom: '90px',
        right: '20px',
        padding: '15px'
      });
    }
    
    document.body.appendChild(div);
    
    if (!isPopup) {
      setTimeout(() => {
        const el = document.querySelector(`.${className}`);
        if (el) el.remove();
      }, this.options.tempoMensagemVisivel);
    }
  }
  
  // ==============================================
  // ATUALIZA CARRINHO
  // ==============================================
  async updateCartData() {
    const oldTotal = this.lastTotal;
    
    this.loadFromLocalStorage();
    
    const newTotal = this.cartData ? this.calculateCartTotal(this.cartData.cart_items) : 0;
    
    console.log(`📊 Total anterior: R$ ${oldTotal.toFixed(2)} → Novo total: R$ ${newTotal.toFixed(2)}`);
    
    this.lastTotal = newTotal;
    
    if (newTotal >= this.options.pedidoMinimo) {
      console.log('✅ Pedido atingiu mínimo! Resetando...');
      this.resetNotificationState();
      return;
    }
    
    if (!this.notificationShown && newTotal > 0) {
      console.log('⏰ Reiniciando timer...');
      this.startNotificationTimer();
    }
  }
  
  // ==============================================
  // DESTROI
  // ==============================================
  destroy() {
    this.clearNotificationTimer();
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    console.log('🛑 Sistema finalizado');
  }
}

// ==============================================
// EXPORTS
// ==============================================

let notificationInstance = null;

export const initCartNotifications = (options = {}) => {
  if (typeof window === 'undefined') return null;
  
  if (!notificationInstance) {
    import('../lib/supabaseClient').then(module => {
      const { supabase } = module;
      notificationInstance = new CartNotificationSystem(supabase, options);
    });
  }
  return notificationInstance;
};

export const getCartNotifications = () => {
  if (typeof window === 'undefined') return null;
  return notificationInstance;
};


export default CartNotificationSystem;
