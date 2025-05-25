import { useState } from 'react';

export default function Markito() {
  const [mensagem, setMensagem] = useState('');
  const [produtos, setProdutos] = useState('');
  const [resposta, setResposta] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviarMensagem = async () => {
    setCarregando(true);
    setResposta('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: mensagem, produtos: produtos }),
      });

      const data = await response.json();

      if (response.ok) {
        setResposta(data.reply);
      } else {
        setResposta(`Erro: ${data.error}`);
      }
    } catch (error) {
      setResposta(`Erro ao enviar mensagem: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🤖 Markito - Vendedor PMG</h1>

      <textarea
        placeholder="Digite sua pergunta..."
        rows={4}
        style={{ width: '100%', marginBottom: 10 }}
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
      />

      <textarea
        placeholder="Produtos encontrados (opcional)"
        rows={2}
        style={{ width: '100%', marginBottom: 10 }}
        value={produtos}
        onChange={(e) => setProdutos(e.target.value)}
      />

      <button
        onClick={enviarMensagem}
        disabled={carregando}
        style={{
          padding: '10px 20px',
          background: 'green',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {carregando ? 'Enviando...' : 'Enviar'}
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>📝 Resposta:</h3>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            background: '#f0f0f0',
            padding: 10,
            borderRadius: 5,
            minHeight: 100,
          }}
        >
          {resposta}
        </div>
      </div>
    </div>
  );
}
