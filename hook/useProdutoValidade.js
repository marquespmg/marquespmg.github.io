// hooks/useProdutoValidade.js
import { useState, useEffect } from 'react';

export function useProdutoValidade() {
  const [dadosValidade, setDadosValidade] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Carregar o mapa.json e validade.json
        const [mapaRes, validadeRes] = await Promise.all([
          fetch('/mapa.json'),
          fetch('/validade.json')
        ]);

        const mapa = await mapaRes.json();
        const validade = await validadeRes.json();

        // Criar o mapeamento idSite -> dados
        const mapeamento = {};
        
        for (const item of mapa) {
          const idSite = item.idSite;
          const idPMG = item.idPMG;
          
          if (validade[idPMG]) {
            mapeamento[idSite] = {
              validade: validade[idPMG].validade,
              lote: validade[idPMG].lote
            };
          } else {
            mapeamento[idSite] = {
              validade: null,
              lote: null
            };
          }
        }

        setDadosValidade(mapeamento);
      } catch (error) {
        console.error('Erro ao carregar dados de validade:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  return { dadosValidade, loading };
}