import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabaseClient';

const ConfirmarEmail = () => {
  const router = useRouter();
  const { token_hash, type } = router.query;

  useEffect(() => {
    const confirmarEmail = async () => {
      if (token_hash && type === 'email') {
        try {
          console.log('Processando token:', token_hash);
          
          // CONFIRMA o email com o token
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'signup'
          });

          if (error) {
            console.error('Erro ao confirmar email:', error);
            throw error;
          }

          console.log('Email confirmado com sucesso!');
          // Redireciona para página de sucesso
          router.push('/email-confirmado?status=success');
          
        } catch (error) {
          console.error('Erro na confirmação:', error);
          // Redireciona para página de erro
          router.push('/email-confirmado?status=error');
        }
      }
    };

    confirmarEmail();
  }, [token_hash, type, router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div>Processando confirmação de email...</div>
    </div>
  );
};

export default ConfirmarEmail;