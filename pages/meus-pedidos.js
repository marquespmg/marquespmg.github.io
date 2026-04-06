import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import { produtosArray } from './produtos';
import Head from 'next/head';

const MeusPedidos = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [comprandoNovamente, setComprandoNovamente] = useState(null);

  // ==============================================
  // ✅ FUNÇÃO PARA CALCULAR VALOR CORRETO DO ITEM
  // ==============================================
  const calcularTotalItemCorreto = (item) => {
    // Verifica se é produto vendido por KG (tem KG no nome e NÃO é caixa)
    const kgMatch = item.name.match(/(\d+\.?\d*)\s*KG/i);
    const isBox = item.name.includes('CX') || item.name.includes('cx') || item.name.toLowerCase().includes('cx');
    
    if (kgMatch && !isBox) {
      // Produto por KG: price é o valor por KG
      const peso = parseFloat(kgMatch[1]); // Pega o peso: 4
      const precoPorPeca = item.price * peso; // 41,16 × 4 = 164,64
      const quantidade = item.quantity || 1; // 7
      return precoPorPeca * quantidade; // 164,64 × 7 = 1.152,48
    }
    
    // Produto normal ou caixa: price já é o valor total
    return item.price * (item.quantity || 1);
  };

  // ==============================================
  // ✅ CALCULAR TOTAL DO PEDIDO COM DESCONTO
  // ==============================================
  const calcularTotalPedidoCorreto = (pedido) => {
    // Soma todos os itens com o cálculo correto
    const subtotal = pedido.order_items.reduce((sum, item) => {
      return sum + calcularTotalItemCorreto(item);
    }, 0);
    
    // Aplica desconto se houver
    if (pedido.cupom_applied && pedido.discount_amount) {
      return subtotal * (1 - pedido.discount_amount / 100);
    }
    
    return subtotal;
  };

  // Verificar usuário logado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/produtos');
        return;
      }
      setUser(user);
      carregarPedidos(user.id);
    };
    checkUser();
  }, []);

  // Carregar pedidos do usuário
  const carregarPedidos = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função "Comprar novamente"
  const comprarNovamente = async (orderItems) => {
    try {
      setComprandoNovamente(true);
      
      // 1. Buscar carrinho atual do localStorage
      const cartAtual = JSON.parse(localStorage.getItem('cart_data') || '[]');
      
      // 2. Para cada item do pedido antigo, buscar preço atualizado
      const novosItens = orderItems.map(itemAntigo => {
        // Busca produto atualizado no produtosArray
        const produtoAtualizado = produtosArray.find(p => p.id === itemAntigo.id);
        
        if (produtoAtualizado) {
          return {
            ...itemAntigo,
            price: produtoAtualizado.price, // Preço atualizado!
            name: produtoAtualizado.name,
            image: produtoAtualizado.image,
            quantity: itemAntigo.quantity
          };
        }
        return itemAntigo;
      });
      
      // 3. Mesclar com carrinho atual (evitar duplicatas)
      const carrinhoFinal = [...cartAtual];
      
      novosItens.forEach(novoItem => {
        const existe = carrinhoFinal.find(item => item.id === novoItem.id);
        if (existe) {
          // Se já existe, soma a quantidade
          existe.quantity = (existe.quantity || 1) + (novoItem.quantity || 1);
        } else {
          carrinhoFinal.push(novoItem);
        }
      });
      
      // 4. Salvar no localStorage
      localStorage.setItem('cart_data', JSON.stringify(carrinhoFinal));
      
      // 5. Se usuário logado, sincronizar com Supabase
      if (user) {
        await supabase
          .from('user_carts')
          .upsert({
            user_id: user.id,
            cart_items: carrinhoFinal,
            updated_at: new Date().toISOString()
          });
      }
      
      // 6. Feedback visual
      alert(`✅ ${novosItens.length} produto(s) adicionado(s) ao carrinho com preços atualizados!`);
      
      // 7. Redirecionar para produtos (opcional)
      router.push('/produtos');
      
    } catch (error) {
      console.error('Erro ao comprar novamente:', error);
      alert('❌ Erro ao adicionar ao carrinho. Tente novamente.');
    } finally {
      setComprandoNovamente(false);
    }
  };

  // Formatar data
  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatar número do pedido
  const formatarNumeroPedido = (orderNumber) => {
    return orderNumber;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#095400'
      }}>
        Carregando seus pedidos...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Meus Pedidos - PMG Atacadista</title>
        <meta name="description" content="Histórico de pedidos PMG Atacadista" />
      </Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9'
      }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: '#095400',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '28px' }}>📦 Meus Pedidos</h1>
          <p style={{ margin: '10px 0 0', opacity: 0.9 }}>
            Histórico completo de compras
          </p>
        </div>

        {/* Botão voltar */}
        <button
          onClick={() => router.push('/produtos')}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontWeight: '600'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
        >
          ← Voltar para produtos
        </button>

        {/* Lista de pedidos */}
        {pedidos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📭</div>
            <h2 style={{ color: '#095400', marginBottom: '10px' }}>
              Nenhum pedido encontrado
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Você ainda não realizou nenhum pedido.
            </p>
            <button
              onClick={() => router.push('/produtos')}
              style={{
                backgroundColor: '#095400',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              Começar a comprar
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {pedidos.map((pedido) => {
              const totalCorreto = calcularTotalPedidoCorreto(pedido);
              
              return (
              <div
                key={pedido.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}
              >
                {/* Cabeçalho do pedido (sempre visível) */}
                <div
                  onClick={() => setExpandedOrder(expandedOrder === pedido.id ? null : pedido.id)}
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    borderBottom: expandedOrder === pedido.id ? '2px solid #095400' : 'none',
                    backgroundColor: expandedOrder === pedido.id ? '#f8f9fa' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#095400', fontSize: '18px' }}>
                        {formatarNumeroPedido(pedido.order_number)}
                      </h3>
                      <p style={{ margin: '5px 0 0', color: '#666', fontSize: '12px' }}>
                        {formatarData(pedido.created_at)}
                      </p>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#e53935'
                      }}>
                        R$ {totalCorreto.toFixed(2)}
                      </p>
                      {pedido.cupom_applied && (
                        <p style={{
                          margin: '5px 0 0',
                          fontSize: '12px',
                          color: '#27AE60'
                        }}>
                          🏷️ {pedido.cupom_applied} - {pedido.discount_amount}% OFF
                        </p>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{
                        backgroundColor: '#095400',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {pedido.status === 'completed' ? '✅ Concluído' : '📝 Pendente'}
                      </span>
                      
                      <span style={{
                        fontSize: '20px',
                        transform: expandedOrder === pedido.id ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s',
                        color: '#095400'
                      }}>
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detalhes do pedido (expansível) */}
                {expandedOrder === pedido.id && (
                  <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
                    {/* Forma de pagamento */}
                    <div style={{
                      padding: '10px',
                      backgroundColor: '#f0f8f0',
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <strong>💳 Pagamento:</strong> {pedido.payment_method}
                    </div>

                    {/* Lista de produtos */}
                    <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>🛍️ Produtos:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {pedido.order_items.map((item, idx) => {
                        const totalItemCorreto = calcularTotalItemCorreto(item);
                        const kgMatch = item.name.match(/(\d+\.?\d*)\s*KG/i);
                        const isBox = item.name.includes('CX') || item.name.includes('cx') || item.name.toLowerCase().includes('cx');
                        const isKgProduct = kgMatch && !isBox;
                        const precoPorPeca = isKgProduct ? item.price * parseFloat(kgMatch[1]) : null;
                        
                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '15px',
                              padding: '10px',
                              borderBottom: '1px solid #f0f0f0'
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>
                                {item.name}
                              </p>
                              <p style={{ margin: '5px 0 0', color: '#666', fontSize: '12px' }}>
                                Quantidade: {item.quantity || 1}x
                                {isKgProduct && (
                                  <span style={{ marginLeft: '8px', color: '#095400' }}>
                                    ({kgMatch[1]}KG cada = R$ {precoPorPeca.toFixed(2)}/peça)
                                  </span>
                                )}
                              </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ margin: 0, fontWeight: 'bold', color: '#e53935' }}>
                                R$ {totalItemCorreto.toFixed(2)}
                              </p>
                              {pedido.cupom_applied && (
                                <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#27AE60' }}>
                                  com desconto: R$ {(totalItemCorreto * (1 - pedido.discount_amount / 100)).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Resumo com desconto */}
                    {pedido.cupom_applied && (
                      <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        borderLeft: '3px solid #27AE60'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span>Subtotal:</span>
                          <span>R$ {(pedido.order_items.reduce((sum, item) => sum + calcularTotalItemCorreto(item), 0)).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#27AE60' }}>
                          <span>Desconto ({pedido.discount_amount}%):</span>
                          <span>- R$ {(pedido.order_items.reduce((sum, item) => sum + calcularTotalItemCorreto(item), 0) * (pedido.discount_amount / 100)).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd' }}>
                          <span>TOTAL:</span>
                          <span style={{ color: '#e53935' }}>R$ {calcularTotalPedidoCorreto(pedido).toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    {/* Botão comprar novamente */}
                    <button
                      onClick={() => comprarNovamente(pedido.order_items)}
                      disabled={comprandoNovamente === pedido.id}
                      style={{
                        width: '100%',
                        marginTop: '20px',
                        padding: '12px',
                        backgroundColor: '#2ECC71',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '16px',
                        cursor: comprandoNovamente === pedido.id ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => {
                        if (comprandoNovamente !== pedido.id) {
                          e.target.style.backgroundColor = '#27AE60';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (comprandoNovamente !== pedido.id) {
                          e.target.style.backgroundColor = '#2ECC71';
                        }
                      }}
                    >
                      {comprandoNovamente === pedido.id ? '🔄 Adicionando...' : '🛒 Comprar novamente'}
                    </button>
                  </div>
                )}
              </div>
            )})}
          </div>
        )}
      </div>
    </>
  );
};

export default MeusPedidos;