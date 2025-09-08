import { useState, useEffect } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';

// Estilos (mantidos iguais)
const styles = {
  authContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  },
  authBox: {
    background: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%'
  },
  authText: {
    color: '#666',
    marginBottom: '20px'
  },
  authInput: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px'
  },
  authButton: {
    background: '#ff0000',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  container: {
    minHeight: '100vh',
    padding: '20px',
    paddingBottom: '100px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #ff0000'
  },
  title: {
    color: '#ff0000',
    fontSize: '28px',
    margin: 0,
    fontFamily: "'Montserrat', sans-serif"
  },
  pmgLogo: {
    background: '#095400',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '40px'
  },
  inputPanel: {
    background: '#fff',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
  },
  panelTitle: {
    color: '#095400',
    marginBottom: '20px',
    fontFamily: "'Montserrat', sans-serif"
  },
  textInput: {
    width: '100%',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    marginBottom: '20px',
    resize: 'vertical',
    fontFamily: "'Open Sans', sans-serif"
  },
  controls: {
    marginBottom: '20px'
  },
  configInfo: {
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    fontSize: '14px',
    color: '#666'
  },
  generateButton: {
    background: '#095400',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: "'Montserrat', sans-serif",
    transition: 'background 0.3s',
    width: '100%',
    marginBottom: '15px'
  },
  progressContainer: {
    marginTop: '15px'
  },
  progressBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#095400',
    transition: 'width 0.3s ease'
  },
  statusText: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#666',
    textAlign: 'center'
  },
  videoPreview: {
    background: '#fff',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column'
  },
  videoContainer: {
    width: '100%',
    marginBottom: '20px'
  },
  videoPlayer: {
    width: '100%',
    borderRadius: '8px',
    backgroundColor: '#000',
    minHeight: '270px'
  },
  placeholder: {
    width: '100%',
    height: '270px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    flexDirection: 'column'
  },
  placeholderText: {
    color: '#666',
    fontStyle: 'italic',
    marginBottom: '15px',
    textAlign: 'center'
  },
  loadingSpinner: {
    border: '4px solid ',
    borderTop: '4px solid #095400',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    animation: 'spin 1s linear infinite'
  },
  downloadButton: {
    background: '#ff0000',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: "'Montserrat', sans-serif",
    transition: 'background 0.3s',
    width: '100%'
  },
  historySection: {
    background: '#fff',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    marginBottom: '20px'
  },
  historyItem: {
    padding: '15px',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer'
  },
  historyText: {
    fontSize: '14px',
    marginBottom: '5px',
    fontFamily: "'Open Sans', sans-serif"
  },
  historyDate: {
    fontSize: '12px',
    color: '#757575',
    fontFamily: "'Open Sans', sans-serif"
  },
  infoBox: {
    background: '#e8f5e9',
    border: '1px solid #c8e6c9',
    borderRadius: '5px',
    padding: '15px',
    marginTop: '20px'
  },
  googleButton: {
    background: '#095400',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  }
};

// Função para gerar código único
const generateReferralCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
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

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await loadCustomerData(user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setLoading(false);
    }
  };

  const createCustomerForUser = async (userId) => {
    try {
      // Buscar informações do usuário para criar o cliente
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // Gerar código de referência único que não existe
      let referralCode;
      let codeExists = true;
      let attempts = 0;
      
      // Tentar até encontrar um código único
      while (codeExists && attempts < 10) {
        referralCode = generateReferralCode();
        
        // Verificar se o código já existe
        const { data: existingCode } = await supabase
          .from('customers')
          .select('id')
          .eq('referral_code', referralCode)
          .maybeSingle();
          
        codeExists = !!existingCode;
        attempts++;
      }
      
      // Se ainda existe após 10 tentativas, usar um código com timestamp
      if (codeExists) {
        referralCode = 'PMG' + Date.now().toString(36).toUpperCase().slice(-5);
      }
      
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({
          auth_id: userId,
          name: authUser?.user_metadata?.name || authData.name || authUser?.email?.split('@')[0] || 'Cliente',
          email: authUser?.email || authData.email,
          referral_code: referralCode,
          credit_balance: 0.00
        })
        .select()
        .single();

      if (error) throw error;
      
      setCustomer(newCustomer);
      return newCustomer;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  };

  const loadCustomerData = async (userId) => {
    try {
      // Buscar dados do cliente
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (customerError) {
        console.log('Cliente não encontrado, criando novo...', customerError);
        const newCustomer = await createCustomerForUser(userId);
        return newCustomer;
      }

      setCustomer(customerData);
      
      // Buscar histórico de indicações usando o ID do customer
      const { data: historyData, error: historyError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', customerData.id)
        .order('created_at', { ascending: false });

      if (historyError) {
        console.error('Erro ao buscar histórico:', historyError);
      } else {
        setReferralHistory(historyData || []);
      }

      return customerData;
    } catch (error) {
      console.error('Erro crítico ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para login com Google
  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/indicacoes`,
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
      setAuthLoading(false);
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
            }
          }
        });
        
        if (error) throw error;
        
        // Criar o cliente após o registro
        if (data.user) {
          await createCustomerForUser(data.user.id);
        }
        
        alert('Cadastro realizado! Verifique seu email para confirmar.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password
        });
        
        if (error) throw error;
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
    
    const message = `Indique a Marques Vendas PMG e ganhe créditos! ✨ Use meu código: ${customer.referral_code} e ganhe R$ 5,00 de desconto na sua primeira compra. Site: https://www.marquesvendaspmg.shop/`;
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
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h2 style={{ color: '#ff0000', marginBottom: '20px' }}>
            {authMode === 'login' ? 'Acessar Programa de Indicações' : 'Criar Conta'}
          </h2>
          
          {authError && (
            <div style={{ 
              color: '#ff0000', 
              backgroundColor: '#ffe6e6', 
              padding: '10px', 
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '14px'
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
              style={styles.authButton}
              disabled={authLoading}
            >
              {authLoading ? 'Processando...' : (authMode === 'login' ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          <div style={{ margin: '20px 0', textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid #ddd', margin: '20px 0' }}></div>
            <p style={{ margin: '0 0 15px 0', color: '#666' }}>Ou entre com</p>
            
            <button 
              onClick={handleGoogleLogin}
              style={styles.googleButton}
              disabled={authLoading}
            >
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="white" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
              </svg>
              Google
            </button>
          </div>
          
          <p style={{ ...styles.authText, fontSize: '14px', marginTop: '20px' }}>
            {authMode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
            <a 
              href="#" 
              style={{ color: '#ff0000' }}
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

  if (!customer) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.authText}>Preparando sua conta...</p>
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
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Open+Sans&display=swap" rel="stylesheet" />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            body {
              font-family: 'Open Sans', sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            * {
              box-sizing: border-box;
            }
          `}</style>
        </Head>

        <header style={styles.header}>
          <h1 style={styles.title}>Programa de Indicações</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#666' }}>Olá, {customer.name}</span>
            <div style={styles.pmgLogo}>PMG</div>
            <button 
              onClick={handleSignOut}
              style={{ 
                ...styles.authButton, 
                padding: '8px 15px',
                fontSize: '14px',
                width: 'auto'
              }}
            >
              Sair
            </button>
          </div>
        </header>

        <main style={styles.mainContent}>
          <div style={styles.inputPanel}>
            <h2 style={styles.panelTitle}>Seu Código de Indicação</h2>
            <div style={{ 
              background: '#f0f0f0', 
              padding: '20px', 
              borderRadius: '8px', 
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              color: '#095400',
              fontFamily: "'Montserrat', sans-serif"
            }}>
              {customer.referral_code}
            </div>

            <h3 style={styles.panelTitle}>Compartilhar</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '20px' }}>
              <button 
                onClick={() => handleShare('whatsapp')}
                style={{ 
                  ...styles.generateButton, 
                  backgroundColor: '#25D366',
                  flex: 1
                }}
              >
                WhatsApp
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                style={{ 
                  ...styles.generateButton, 
                  backgroundColor: '#3b5998',
                  flex: 1
                }}
              >
                Facebook
              </button>
              <button 
                onClick={() => handleShare('instagram')}
                style={{ 
                  ...styles.generateButton, 
                  backgroundColor: '#E1306C',
                  flex: 1
                }}
              >
                Instagram
              </button>
            </div>

            <div style={styles.infoBox}>
              <h4 style={{ margin: '0 0 10px 0', color: '#095400' }}>Como funciona?</h4>
              <p style={{ margin: '0', fontSize: '14px' }}>
                Cada indicação validada (com pedido mínimo) gera <strong>R$ 5,00</strong> de crédito para você.
                O crédito pode ser resgatado a partir de <strong>R$ 50,00</strong> e é aplicado em seu próximo pedido.
              </p>
            </div>
          </div>

          <div style={styles.videoPreview}>
            <h2 style={styles.panelTitle}>Seus Resultados</h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ 
                background: '#f0f0f0', 
                padding: '15px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0', color: '#095400', fontSize: '16px' }}>Total</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{totalReferrals}</p>
              </div>
              
              <div style={{ 
                background: '#f0f0f0', 
                padding: '15px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0', color: '#095400', fontSize: '16px' }}>Validadas</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{validatedReferrals}</p>
              </div>
              
              <div style={{ 
                background: '#f0f0f0', 
                padding: '15px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0', color: '#095400', fontSize: '16px' }}>Pendentes</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{pendingReferrals}</p>
              </div>
              
              <div style={{ 
                background: '#f0f0f0', 
                padding: '15px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0', color: '#095400', fontSize: '16px' }}>Rejeitadas</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>
                  {referralHistory.filter(ref => ref.status === 'rejeitada').length}
                </p>
              </div>
            </div>
            
            <div style={{ 
              background: '#e8f5e9', 
              padding: '20px', 
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#095400' }}>Crédito Acumulado</h3>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#095400' }}>
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
                    'Pronto para resgatar!' : 
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
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Indique alguém que possa se interessar pelos nossos produtos. Nossa equipe entrará em contato com a pessoa indicada.
        </p>
        <form onSubmit={handleAddReferral}>
          <input
            type="text"
            placeholder="Nome completo da pessoa indicada *"
            style={styles.authInput}
            value={newReferral.name}
            onChange={(e) => setNewReferral({...newReferral, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="E-mail (opcional)"
            style={styles.authInput}
            value={newReferral.email}
            onChange={(e) => setNewReferral({...newReferral, email: e.target.value})}
          />
          <input
            type="tel"
            placeholder="Telefone (opcional)"
            style={styles.authInput}
            value={newReferral.phone}
            onChange={(e) => setNewReferral({...newReferral, phone: e.target.value})}
          />
          <button type="submit" style={styles.generateButton}>
            Registrar Indicação
          </button>
        </form>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          * Campos obrigatórios. A indicação será marcada como "pendente" até a validação do pedido.
        </p>
      </section>

      <section style={styles.historySection}>
        <h2 style={styles.panelTitle}>Histórico de Indicações</h2>
        
        {referralHistory.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            Nenhuma indicação registrada ainda. Compartilhe seu código para começar!
          </p>
        ) : (
          <div>
            {referralHistory.map((item) => (
              <div key={item.id} style={styles.historyItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={styles.historyText}>
                      <strong>{item.referred_name}</strong>
                      {item.referred_email && ` • ${item.referred_email}`}
                      {item.referred_phone && ` • ${item.referred_phone}`}
                    </div>
                    <div style={styles.historyDate}>
                      {new Date(item.created_at).toLocaleDateString('pt-BR')} • 
                      Status: {item.status}
                    </div>
                  </div>
                  <div style={{ 
                    color: item.status === 'validada' ? '#095400' : 
                           item.status === 'pendente' ? '#ff9800' : '#ff0000',
                    fontWeight: 'bold',
                    fontSize: '14px'
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
        <h4 style={{ margin: '0 0 10px 0', color: '#095400' }}>Informações importantes</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
          <li>O crédito leva até 2 dias úteis para ser processado após a validação</li>
          <li>O pedido do indicado deve atingir o valor mínimo para ser considerado válido</li>
          <li>Créditos expiram em 6 meses</li>
          <li>O crédito é aplicado como desconto em seu próximo pedido</li>
          <li>Indicações fraudulentas serão desconsideradas</li>
          <li><strong>Valor por indicação válida: R$ 5,00</strong></li>
        </ul>
      </div>
    </div>
  );
}
