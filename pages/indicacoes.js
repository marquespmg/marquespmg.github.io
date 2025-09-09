import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

// Estilos responsivos melhorados
const styles = {
  authContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    fontFamily: "'Inter', sans-serif"
  },
  authBox: {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    textAlign: 'center',
    maxWidth: '450px',
    width: '100%',
    transition: 'all 0.3s ease'
  },
  authText: {
    color: '#666',
    marginBottom: '20px',
    fontSize: '15px',
    lineHeight: '1.5'
  },
  authInput: {
    width: '100%',
    padding: '14px 16px',
    margin: '10px 0',
    border: '1px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border 0.3s ease',
    fontFamily: "'Inter', sans-serif"
  },
  authButton: {
    background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0 4px 6px rgba(255,0,0,0.1)'
  },
  container: {
    minHeight: '100vh',
    padding: '20px',
    paddingBottom: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#f8f9fa'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px',
    padding: '20px',
    paddingBottom: '20px',
    borderRadius: '12px',
    background: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    gap: '15px'
  },
  title: {
    color: '#ff0000',
    fontSize: '28px',
    margin: 0,
    fontFamily: "'Poppins', sans-serif",
    textAlign: 'center',
    fontWeight: '700'
  },
  pmgLogo: {
    background: 'linear-gradient(135deg, #095400 0%, #0a6300 100%)',
    color: 'white',
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: '0 4px 6px rgba(9,84,0,0.1)'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    marginBottom: '40px'
  },
  inputPanel: {
    background: '#fff',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    width: '100%'
  },
  panelTitle: {
    color: '#095400',
    marginBottom: '20px',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '22px',
    fontWeight: '600'
  },
  textInput: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '20px',
    resize: 'vertical',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
    transition: 'border 0.3s ease'
  },
  controls: {
    marginBottom: '20px'
  },
  configInfo: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#495057',
    lineHeight: '1.5'
  },
  generateButton: {
    background: 'linear-gradient(135deg, #095400 0%, #0a6300 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.3s ease',
    width: '100%',
    marginBottom: '15px'
  },
  progressContainer: {
    marginTop: '15px'
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #095400 0%, #0a6300 100%)',
    transition: 'width 0.5s ease',
    borderRadius: '10px'
  },
  statusText: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#495057',
    textAlign: 'center',
    fontWeight: '500'
  },
  videoPreview: {
    background: '#fff',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  videoContainer: {
    width: '100%',
    marginBottom: '20px'
  },
  videoPlayer: {
    width: '100%',
    borderRadius: '8px',
    backgroundColor: '#000',
    minHeight: '200px'
  },
  placeholder: {
    width: '100%',
    height: '200px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    flexDirection: 'column'
  },
  placeholderText: {
    color: '#6c757d',
    fontStyle: 'italic',
    marginBottom: '15px',
    textAlign: 'center',
    fontSize: '14px'
  },
  loadingSpinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #095400',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite'
  },
  downloadButton: {
    background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.3s ease',
    width: '100%'
  },
  historySection: {
    background: '#fff',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '25px',
    width: '100%'
  },
  historyItem: {
    padding: '18px',
    borderBottom: '1px solid #e9ecef',
    transition: 'background 0.2s ease'
  },
  historyText: {
    fontSize: '15px',
    marginBottom: '6px',
    fontFamily: "'Inter', sans-serif",
    color: '#212529'
  },
  historyDate: {
    fontSize: '13px',
    color: '#6c757d',
    fontFamily: "'Inter', sans-serif"
  },
  infoBox: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #d4edda 100%)',
    border: '1px solid #c3e6cb',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '25px',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '20px'
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    width: '100%'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  statCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e9ecef',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  shareButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center'
  },
  shareButton: {
    flex: '1 0 calc(50% - 10px)',
    minWidth: '120px',
    padding: '12px 15px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  referralCode: {
    background: 'linear-gradient(135deg, #095400 0%, #0a6300 100%)',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: 'white',
    fontFamily: "'Poppins', sans-serif"
  },
  creditDisplay: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #d4edda 100%)',
    padding: '25px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '20px',
    border: '1px solid #c3e6cb'
  },
  '@media (min-width: 768px)': {
    header: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: '15px'
    },
    mainContent: {
      flexDirection: 'row'
    },
    inputPanel: {
      width: '48%'
    },
    videoPreview: {
      width: '48%'
    },
    statsGrid: {
      gridTemplateColumns: 'repeat(4, 1fr)'
    },
    shareButtons: {
      justifyContent: 'flex-start'
    },
    shareButton: {
      flex: '1 0 auto',
      minWidth: 'auto'
    }
  },
  '@media (max-width: 480px)': {
    authBox: {
      padding: '20px'
    },
    container: {
      padding: '15px',
      paddingBottom: '30px'
    },
    header: {
      padding: '15px'
    },
    inputPanel: {
      padding: '20px'
    },
    videoPreview: {
      padding: '20px'
    },
    historySection: {
      padding: '20px'
    },
    referralCode: {
      fontSize: '22px',
      padding: '15px'
    },
    title: {
      fontSize: '24px'
    },
    panelTitle: {
      fontSize: '20px'
    }
  }
};

// Função para verificar confirmação de email
const checkEmailConfirmation = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && user.email_confirmed_at) {
      // Email já confirmado, recarregar sessão
      await supabase.auth.refreshSession();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao verificar confirmação:', error);
    return false;
  }
};

export default function Indicacoes() {
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [referralHistory, setReferralHistory] = useState([]);
  const [authMode, setAuthMode] = useState('login');
  const [authData, setAuthData] = useState({ 
    email: '', 
    password: '', 
    name: '' 
  });
  const [newReferral, setNewReferral] = useState({ 
    name: '', 
    email: '', 
    phone: '' 
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  const router = useRouter();

  // Função para reenviar email de confirmação
  const handleResendConfirmation = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: authData.email,
      });
      
      if (error) throw error;
      
      alert('Email de confirmação reenviado! Verifique sua caixa de entrada.');
    } catch (error) {
      alert('Erro ao reenviar email: ' + error.message);
    }
  };

  // Tratamento de erros globais
  useEffect(() => {
    const handleUnhandledError = (error) => {
      console.error('Erro não tratado:', error);
      // Recarregar a página em caso de erro crítico
      window.location.reload();
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledError);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledError);
    };
  }, []);

  // Carregar dados do usuário
  useEffect(() => {
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          await loadCustomerData(session.user.id);
        } else {
          setCustomer(null);
          setReferralHistory([]);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Polling para verificar confirmação de email
  useEffect(() => {
    let intervalId;
    
    const checkConfirmation = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Erro ao verificar usuário no polling:', error);
          return;
        }
        
        if (currentUser && currentUser.email_confirmed_at) {
          clearInterval(intervalId);
          // Recarregar dados em vez de recarregar a página inteira
          await loadCustomerData(currentUser.id);
        }
      } catch (error) {
        console.error('Erro no polling de confirmação:', error);
      }
    };
    
    if (user && !user.email_confirmed_at) {
      intervalId = setInterval(checkConfirmation, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Erro ao buscar usuário:', userError);
        setLoading(false);
        return;
      }
      
      setUser(user);
      
      if (user) {
        // Verificar se email está confirmado
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao verificar sessão:', sessionError);
          setLoading(false);
          return;
        }
        
        if (session) {
          await loadCustomerData(user.id);
        } else {
          // Sessão inválida, fazer logout
          await supabase.auth.signOut();
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setLoading(false);
    }
  };

const loadCustomerData = async (userId) => {
  try {
    console.log('=== DEBUG INICIADO ===');
    console.log('Buscando cliente com auth_id:', userId);
    
    // 1. Primeiro, listar TODOS os clientes para ver o que tem na tabela
    const { data: allCustomers, error: allError } = await supabase
      .from('customers')
      .select('id, auth_id, name, email, referral_code');
    
    console.log('Todos os clientes na tabela:', allCustomers);
    
    // 2. Buscar o cliente específico
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('auth_id', userId)
      .single();

    console.log('Resultado da busca:', { customerData, customerError });

    // 3. Se não encontrou, criar o cliente automaticamente
    if (customerError && customerError.code === 'PGRST116') {
      console.log('Cliente não existe na tabela customers, criando...');
      
      // Buscar dados do usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Dados do usuário auth:', { user, userError });
      
      if (!user) {
        console.error('Usuário não encontrado no auth');
        setCustomer(null);
        return null;
      }

      // Gerar código de referência
      const referralCode = 'PMG' + Math.random().toString(36).substring(2, 8).toUpperCase();
      console.log('Novo referral_code gerado:', referralCode);

      // Criar o novo cliente
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          auth_id: userId,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Cliente',
          email: user.email,
          referral_code: referralCode,
          credit_balance: 0.00
        })
        .select()
        .single();

      console.log('Resultado da criação:', { newCustomer, createError });

      if (createError) {
        console.error('Erro ao criar cliente:', createError);
        
        // Se for erro de duplicidade, buscar o existente
        if (createError.code === '23505') {
          console.log('Tentando buscar cliente por email devido a duplicidade...');
          const { data: existingCustomer } = await supabase
            .from('customers')
            .select('*')
            .eq('email', user.email)
            .single();
          
          if (existingCustomer) {
            console.log('Cliente encontrado por email:', existingCustomer);
            setCustomer(existingCustomer);
            await loadReferralHistory(existingCustomer.id);
            return existingCustomer;
          }
        }
        
        setCustomer(null);
        return null;
      }

      console.log('Novo cliente criado com sucesso:', newCustomer);
      setCustomer(newCustomer);
      setReferralHistory([]);
      return newCustomer;
    }

    if (customerError) {
      console.error('Erro ao buscar cliente:', customerError);
      setCustomer(null);
      return null;
    }

    // 4. Cliente encontrado
    console.log('Cliente encontrado com sucesso:', customerData);
    setCustomer(customerData);
    await loadReferralHistory(customerData.id);
    return customerData;

  } catch (error) {
    console.error('Erro geral ao carregar dados:', error);
    setCustomer(null);
    return null;
  } finally {
    console.log('=== DEBUG FINALIZADO ===');
    setLoading(false);
  }
};

// Função separada para carregar histórico
const loadReferralHistory = async (customerId) => {
  try {
    const { data: historyData, error: historyError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', customerId)
      .order('created_at', { ascending: false });

    if (!historyError) {
      setReferralHistory(historyData || []);
    }
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
  }
};
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    try {
      if (authMode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password,
          options: {
            data: {
              name: authData.name
            },
            emailRedirectTo: `${window.location.origin}`
          }
        });
        
        if (error) throw error;
        
        alert('Cadastro realizado com sucesso, verifique seu email( se nao achar olhe na caixa de spam)e confirme seu cadastro!');
        setAuthMode('login');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password
        });
        
        if (error) {
          // Verificar se é erro de email não confirmado
          if (error.message.includes('Email not confirmed')) {
            setAuthError('Email não confirmado. Verifique sua caixa de entrada.');
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      alert('Erro ao sair: ' + error.message);
    }
  };

  const handleAddReferral = async (e) => {
    e.preventDefault();
    
    if (!newReferral.name.trim()) {
      alert('Por favor, informe o nome da pessoa indicada.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: customer.id,
          referred_name: newReferral.name.trim(),
          referred_email: newReferral.email.trim() || null,
          referred_phone: newReferral.phone.trim() || null,
          status: 'pendente',
          credit_amount: 5.00
        })
        .select()
        .single();

      if (error) throw error;
      
      alert('Indicação registrada com sucesso! Esta pessoa será contatada pela nossa equipe.');
      setNewReferral({ name: '', email: '', phone: '' });
      
      // Recarregar histórico
      const { data: historyData } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', customer.id)
        .order('created_at', { ascending: false });
      
      setReferralHistory(historyData || []);
    } catch (error) {
      alert('Erro ao registrar indicação: ' + error.message);
      console.error('Detalhes do erro:', error);
    }
  };

  const handleRedeem = async () => {
    if (!customer || customer.credit_balance < 50) {
      alert(`Você precisa de pelo menos R$ 50,00 em créditos para resgatar.`);
      return;
    }

    // Abre WhatsApp com mensagem pré-pronta
    const whatsappMessage = `Olá! Eu já atingi os R$ ${customer.credit_balance.toFixed(2)} para resgate das indicações. Pode providenciar por favor?`;
    const whatsappUrl = `https://wa.me/5511913572902?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    try {
      const { data, error } = await supabase
        .from('redemptions')
        .insert({
          customer_id: customer.id,
          amount: customer.credit_balance,
          status: 'processando'
        })
        .select()
        .single();

      if (error) throw error;
      
      alert(`Solicitação de resgate enviada! Entraremos em contato pelo WhatsApp em breve.`);
      
      // Atualizar saldo do cliente
      const { error: updateError } = await supabase
        .from('customers')
        .update({ credit_balance: 0 })
        .eq('id', customer.id);

      if (updateError) throw updateError;
      
      setCustomer({ ...customer, credit_balance: 0 });
    } catch (error) {
      console.error('Erro ao registrar resgate:', error);
      // Mesmo se der erro no banco, ainda abre o WhatsApp
    }
  };

  const handleShare = (platform) => {
    if (!customer) return;
    
    const message = `Olá! Te indico a PMG ATACADISTA para comprar produtos de qualidade com ótimos preços! Fala com o Marques pelo WhatsApp (11)91357-2902 e diz que foi indicação minha e informe o codigo e ganhe descontos no seus pedidos.`;
    let url = '';
    
    switch(platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://www.marquesvendaspmg.shop/')}&quote=${encodeURIComponent(message)}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(customer.referral_code);
        alert('Código copiado! Cole no Instagram: ' + customer.referral_code);
        return;
      default:
        return;
    }
    
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.authText}>Carregando...</p>
          {reloadCount > 1 && (
            <button 
              onClick={() => {
                setReloadCount(0);
                window.location.reload();
              }}
              style={{
                ...styles.authButton,
                backgroundColor: '#6c757d',
                marginTop: '20px'
              }}
            >
              Recarregar Página
            </button>
          )}
        </div>
      </div>
    );
  }

  if (user && !customer) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h2 style={{ color: '#ff0000', marginBottom: '20px' }}>Confirmação Pendente</h2>
          
          {user.email_confirmed_at ? (
            <>
              <p style={styles.authText}>
                ✅ Email confirmado com sucesso!
              </p>
              <p style={styles.authText}>
                Preparando sua conta... Aguarde alguns instantes.
              </p>
              <div style={styles.loadingSpinner}></div>
            </>
          ) : (
            <>
              <p style={styles.authText}>
                📧 Verifique seu email para confirmar o cadastro.
              </p>
              <p style={styles.authText}>
                Se não encontrar o email, verifique a caixa de spam.
              </p>
              <button 
                onClick={handleResendConfirmation}
                style={{
                  ...styles.authButton,
                  backgroundColor: '#28a745',
                  marginBottom: '10px'
                }}
              >
                Reenviar Email de Confirmação
              </button>
              <button 
                onClick={() => {
                  supabase.auth.signOut();
                  setAuthMode('login');
                }}
                style={{
                  ...styles.authButton,
                  backgroundColor: '#6c757d'
                }}
              >
                Voltar ao Login
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h2 style={{ color: '#ff0000', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>
            {authMode === 'login' ? 'Acessar Programa de Indicações' : 'Criar Conta'}
          </h2>
          
          {authError && (
            <div style={{ 
              color: '#721c24', 
              backgroundColor: '#f8d7da', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '14px',
              border: '1px solid #f5c6cb'
            }}>
              {authError}
            </div>
          )}
          
          <form onSubmit={handleAuth}>
            {authMode === 'register' && (
              <input 
                type="text" 
                placeholder="Seu nome completo" 
                style={styles.authInput}
                value={authData.name}
                onChange={(e) => setAuthData({...authData, name: e.target.value})}
                required
                disabled={authLoading}
              />
            )}
            
            <input 
              type="email" 
              placeholder="Seu e-mail" 
              style={styles.authInput}
              value={authData.email}
              onChange={(e) => setAuthData({...authData, email: e.target.value})}
              required
              disabled={authLoading}
            />
            
            <input 
              type="password" 
              placeholder="Sua senha" 
              style={styles.authInput}
              value={authData.password}
              onChange={(e) => setAuthData({...authData, password: e.target.value})}
              required
              disabled={authLoading}
            />
            
            <button 
              type="submit" 
              style={{
                ...styles.authButton,
                opacity: authLoading ? 0.7 : 1,
                cursor: authLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={authLoading}
            >
              {authLoading ? 'Processando...' : (authMode === 'login' ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>
          
          <p style={{ ...styles.authText, fontSize: '14px', marginTop: '20px' }}>
            {authMode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
            <a 
              href="#" 
              style={{ color: '#ff0000', textDecoration: 'none', fontWeight: '600' }}
              onClick={(e) => {
                e.preventDefault();
                setAuthMode(authMode === 'login' ? 'register' : 'login');
              }}
            >
              {authMode === 'login' ? 'Cadastre-se' : 'Faça login'}
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Calcular estatísticas
  const totalReferrals = referralHistory.length;
  const validatedReferrals = referralHistory.filter(ref => ref.status === 'validada').length;
  const pendingReferrals = referralHistory.filter(ref => ref.status === 'pendente').length;

  return (
    <div style={styles.container}>
      <Head>
        <title>Programa de Indicações - Marques Vendas PMG</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            color: #212529;
          }
          * {
            box-sizing: border-box;
          }
          input:focus, textarea:focus {
            outline: none;
            border-color: #095400 !important;
            box-shadow: 0 0 0 3px rgba(9,84,0,0.1) !important;
          }
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15) !important;
          }
          .history-item:hover {
            background-color: #f8f9fa;
          }
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
          }
          @media (min-width: 768px) {
            .desktop-layout {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }
            .desktop-layout > div {
              width: 48%;
            }
            .desktop-header {
              flex-direction: row;
              align-items: center;
            }
            .desktop-stats {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          @media (max-width: 767px) {
            .mobile-stats {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </Head>

      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Programa de Indicações</h1>
          <div style={styles.userInfo}>
            <span style={{ color: '#495057', fontWeight: '500' }}>Olá, {customer.name}</span>
            <div style={styles.pmgLogo}>PMG</div>
            <button 
              onClick={handleSignOut}
              style={{ 
                ...styles.authButton, 
                padding: '10px 15px',
                fontSize: '14px',
                width: 'auto'
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main style={styles.mainContent} className="desktop-layout">
        <div style={styles.inputPanel}>
          <h2 style={styles.panelTitle}>Seu Código de Indicação</h2>
          <div style={styles.referralCode}>
            {customer.referral_code}
          </div>

          <h3 style={styles.panelTitle}>Compartilhar</h3>
          <div style={styles.shareButtons}>
            <button 
              onClick={() => handleShare('whatsapp')}
              style={{ 
                ...styles.shareButton, 
                backgroundColor: '#25D366',
                color: 'white'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.150-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.480-1.761-1.653-2.059-.173-.297-.018-.458.130-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.520.074-.792.372-.272.297-1.040 1.016-1.040 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.200 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.360.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.570-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.84 3.488" fill="currentColor"/>
              </svg>
              WhatsApp
            </button>
            <button 
              onClick={() => handleShare('facebook')}
              style={{ 
                ...styles.shareButton, 
                backgroundColor: '#3b5998',
                color: 'white'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
              </svg>
              Facebook
            </button>
            <button 
              onClick={() => handleShare('instagram')}
              style={{ 
                ...styles.shareButton, 
                backgroundColor: '#E1306C',
                color: 'white'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.980-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.980.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
              </svg>
              Instagram
            </button>
          </div>

          <div style={styles.infoBox}>
            <h4 style={{ margin: '0 0 10px 0', color: '#095400', fontFamily: "'Poppins', sans-serif" }}>
              Como funciona?
            </h4>
            <p style={{ margin: '0', fontSize: '14px' }}>
              Indique clientes para a PMG ATACADISTA e ganhe <strong>R$ 5,00</strong> em créditos por cada indicação que fizer um pedido. Os créditos são acumulativos e você pode resgatar a partir de <strong>R$ 50,00</strong>.
              <br /><br />
              <strong>Importante:</strong> Seu código de indicação é apenas para meu controle interno. A pessoa indicada basta me informar o CODIGO que ela recebeu e que foi indicada por você quando fizer o pedido.
            </p>
          </div>
        </div>

        <div style={styles.videoPreview}>
          <h2 style={styles.panelTitle}>Seus Resultados</h2>
          
          <div style={styles.statsGrid} className="mobile-stats desktop-stats">
            <div style={{ 
              ...styles.statCard,
              className: "stat-card"
            }}>
              <h3 style={{ margin: '0', color: '#095400', fontSize: '16px', fontWeight: '600' }}>Total</h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: '700', color: '#212529' }}>{totalReferrals}</p>
            </div>
            
            <div style={{ 
              ...styles.statCard,
              className: "stat-card"
            }}>
              <h3 style={{ margin: '0', color: '#095400', fontSize: '16px', fontWeight: '600' }}>Validadas</h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: '700', color: '#28a745' }}>{validatedReferrals}</p>
            </div>
            
            <div style={{ 
              ...styles.statCard,
              className: "stat-card"
            }}>
              <h3 style={{ margin: '0', color: '#095400', fontSize: '16px', fontWeight: '600' }}>Pendentes</h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: '700', color: '#ffc107' }}>{pendingReferrals}</p>
            </div>
            
            <div style={{ 
              ...styles.statCard,
              className: "stat-card"
            }}>
              <h3 style={{ margin: '0', color: '#095400', fontSize: '16px', fontWeight: '600' }}>Rejeitadas</h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: '700', color: '#dc3545' }}>
                {referralHistory.filter(ref => ref.status === 'rejeitada').length}
              </p>
            </div>
          </div>
          
          <div style={styles.creditDisplay}>
            <h3 style={{ margin: '0 0 12px 0', color: '#095400', fontSize: '18px', fontWeight: '600' }}>Crédito Acumulado</h3>
            <p style={{ margin: '0', fontSize: '36px', fontWeight: '700', color: '#095400' }}>
              R$ {customer.credit_balance?.toFixed(2) || '0.00'}
            </p>
            
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${Math.min(100, ((customer.credit_balance || 0) / 50) * 100)}%`
                }}></div>
              </div>
              <div style={styles.statusText}>
                {(customer.credit_balance || 0) >= 50 ? 
                  '🎉 Pronto para resgatar!' : 
                  `Faltam R$ ${(50 - (customer.credit_balance || 0)).toFixed(2)} para resgatar`}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleRedeem}
            style={{
              ...styles.downloadButton,
              opacity: (customer.credit_balance || 0) >= 50 ? 1 : 0.6,
              cursor: (customer.credit_balance || 0) >= 50 ? 'pointer' : 'not-allowed'
            }}
            disabled={(customer.credit_balance || 0) < 50}
          >
            Resgatar Crédito
          </button>
        </div>
      </main>

      <section style={styles.inputPanel}>
        <h2 style={styles.panelTitle}>Registrar Nova Indicação</h2>
        <p style={{ color: '#6c757d', marginBottom: '20px', lineHeight: '1.5' }}>
          Indique alguém que possa se interessar pelos nossos produtos. Nossa equipe entrará em contato com a pessoa indicada.
        </p>
        <form onSubmit={handleAddReferral}>
          <input
            type="text"
            placeholder="Nome completo da pessoa indicada *"
            style={styles.textInput}
            value={newReferral.name}
            onChange={(e) => setNewReferral({...newReferral, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="E-mail *"
            style={styles.textInput}
            value={newReferral.email}
            onChange={(e) => setNewReferral({...newReferral, email: e.target.value})}
          />
          <input
            type="tel"
            placeholder="Telefone *"
            style={styles.textInput}
            value={newReferral.phone}
            onChange={(e) => setNewReferral({...newReferral, phone: e.target.value})}
            required
          />
          <button type="submit" style={styles.generateButton}>
            Registrar Indicação
          </button>
        </form>
        <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '10px', lineHeight: '1.5' }}>
          * Campos obrigatórios. A indicação será marcada como "pendente" até a validação do pedido.
        </p>
      </section>

      <section style={styles.historySection}>
        <h2 style={styles.panelTitle}>Histórico de Indicações</h2>
        
        {referralHistory.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d', padding: '20px', fontStyle: 'italic' }}>
            Nenhuma indicação registrada ainda. Compartilhe seu código para começar!
          </p>
        ) : (
          <div>
            {referralHistory.map((item) => (
              <div key={item.id} style={{...styles.historyItem, className: "history-item"}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.historyText}>
                      <strong>{item.referred_name}</strong>
                      {item.referred_email && ` • ${item.referred_email}`}
                      {item.referred_phone && ` • ${item.referred_phone}`}
                    </div>
                    <div style={styles.historyDate}>
                      {new Date(item.created_at).toLocaleDateString('pt-BR')} • 
                      Status: <span style={{
                        color: item.status === 'validada' ? '#28a745' : 
                               item.status === 'pendente' ? '#ffc107' : '#dc3545',
                        fontWeight: '500'
                      }}>{item.status}</span>
                    </div>
                  </div>
                  <div style={{ 
                    color: item.status === 'validada' ? '#28a745' : 
                           item.status === 'pendente' ? '#6c757d' : '#6c757d',
                    fontWeight: '700',
                    fontSize: '16px',
                    minWidth: '80px',
                    textAlign: 'right'
                  }}>
                    {item.status === 'validada' && `R$ ${item.credit_amount?.toFixed(2) || '5.00'}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={styles.infoBox}>
        <h4 style={{ margin: '0 0 12px 0', color: '#095400', fontFamily: "'Poppins', sans-serif" }}>Informações importantes</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
          <li>O crédito leva até 2 dias úteis para ser processado após a validação</li>
          <li>O pedido do indicado deve atingir o valor mínimo para be considerado válido</li>
          <li>Créditos expiram em 6 meses</li>
          <li>O crédito é aplicado como desconto em seu próximo pedido</li>
          <li>Indicações fraudulentas serão desconsideradas</li>
          <li><strong>Valor por indicação válida: R$ 5,00</strong></li>
        </ul>
      </div>
    </div>
  );
}
