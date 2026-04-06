import { supabase } from '../../lib/supabaseClient';

// ==============================================
// ✅ FUNÇÃO PARA GERAR NÚMERO DO PEDIDO (CORRIGIDA)
// ==============================================
async function generateOrderNumber() {
  const currentYear = new Date().getFullYear();
  
  // Buscar TODOS os pedidos para encontrar o maior número sequencial
  const { data, error } = await supabase
    .from('user_orders')
    .select('order_number')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar último pedido:', error);
    return `PMG${currentYear}0088`;
  }

  let maxNumber = 88; // Começa em 88
  
  if (data && data.length > 0) {
    for (const order of data) {
      // Extrai os últimos 4 dígitos (formato correto: PMG20260088)
      const match = order.order_number.match(/(\d{4})$/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    }
  }

  const nextNumber = maxNumber + 1;
  const numeroFormatado = nextNumber.toString().padStart(4, '0');
  return `PMG${currentYear}${numeroFormatado}`;
}

// ==============================================
// ✅ FUNÇÃO: Calcular preço total correto do produto
// ==============================================
function calcularPrecoTotalItem(item) {
  // Verifica se é produto por KG (tem peso no nome e não é caixa)
  const kgMatch = item.name.match(/(\d+\.?\d*)\s*KG/i);
  const isBox = item.name.includes('CX') || item.name.includes('cx');
  
  if (kgMatch && !isBox) {
    // Produto vendido por KG: price é por KG, multiplica pelo peso
    const peso = parseFloat(kgMatch[1]);
    const precoPorPeca = item.price * peso;
    return precoPorPeca * (item.quantity || 1);
  }
  
  // Produto normal ou caixa: price já é o valor total
  return item.price * (item.quantity || 1);
}

// ==============================================
// ✅ FUNÇÃO: Recalcular total do pedido
// ==============================================
function recalcularTotalPedido(order_items) {
  return order_items.reduce((total, item) => {
    return total + calcularPrecoTotalItem(item);
  }, 0);
}

// ==============================================
// ✅ HANDLER PRINCIPAL
// ==============================================
export default async function handler(req, res) {
  // Apenas aceita método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    let { user_id, order_items, total_amount, payment_method, cupom_applied, discount_amount, status } = req.body;

    // Validar dados obrigatórios
    if (!user_id || !order_items || !payment_method) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // ==============================================
    // ✅ CORREÇÃO 1: Recalcular os valores para garantir precisão
    // ==============================================
    const totalRecalculado = recalcularTotalPedido(order_items);
    
    // ==============================================
    // ✅ CORREÇÃO 2: Aplicar desconto se houver
    // ==============================================
    let totalFinal = totalRecalculado;
    if (cupom_applied && discount_amount) {
      totalFinal = totalRecalculado * (1 - discount_amount / 100);
    }

    // ==============================================
    // ✅ CORREÇÃO 3: Corrigir os itens do pedido
    // ==============================================
    const order_items_corrigido = order_items.map(item => {
      const kgMatch = item.name.match(/(\d+\.?\d*)\s*KG/i);
      const isBox = item.name.includes('CX') || item.name.includes('cx');
      
      let precoUnitario = item.price;
      let precoTotalItem = item.totalPrice;
      
      if (kgMatch && !isBox) {
        // Produto por KG: recalcular total correto
        const peso = parseFloat(kgMatch[1]);
        precoUnitario = item.price; // Mantém preço por KG
        precoTotalItem = item.price * peso * (item.quantity || 1);
      }
      
      return {
        ...item,
        price: precoUnitario,
        totalPrice: precoTotalItem,
        quantity: item.quantity || 1
      };
    });

    // Log para debug
    console.log('📊 ANTES da correção:', {
      total_enviado: total_amount,
      total_recalculado: totalRecalculado,
      total_com_desconto: totalFinal
    });

    // ==============================================
    // ✅ CORREÇÃO 4: Gerar número do pedido (sequencial correto)
    // ==============================================
    const order_number = await generateOrderNumber();
    
    console.log('📦 Número do pedido gerado:', order_number);

    // ==============================================
    // ✅ Inserir pedido no banco com valores corrigidos
    // ==============================================
    const { data, error } = await supabase
      .from('user_orders')
      .insert({
        order_number,
        user_id,
        order_items: order_items_corrigido,
        total_amount: totalFinal,
        payment_method,
        cupom_applied: cupom_applied || null,
        discount_amount: discount_amount || 0,
        status: status || 'completed'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao inserir no Supabase:', error);
      throw error;
    }

    // ==============================================
    // ✅ Retornar sucesso
    // ==============================================
    return res.status(200).json({ 
      success: true, 
      order_number,
      pedido: data 
    });

  } catch (error) {
    console.error('❌ Erro ao salvar pedido:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}