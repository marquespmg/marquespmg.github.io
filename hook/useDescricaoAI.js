// hook/useDescricaoAI.js
import { useState, useEffect } from 'react';

export function useDescricaoAI(produtoId) {
  const [descricao, setDescricao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!produtoId) return;

    // 🔥 1. PRIMEIRO: Busca descrição salva
    const buscarDescricaoSalva = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/gerar-descricao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ produtoId })
        });

        const data = await response.json();

        if (data.descricao) {
          setDescricao(data.descricao);
          setLoading(false);
        } else {
          setError(data.error || 'Erro ao buscar descrição');
          setLoading(false);
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor');
        setLoading(false);
      }
    };

    buscarDescricaoSalva();
  }, [produtoId]);

  return { descricao, loading, error };
}