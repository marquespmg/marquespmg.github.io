// hook/useProdutoIdPmg.js
import { useState, useEffect } from 'react';

export function useProdutoIdPmg() {
  const [mapaIds, setMapaIds] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarMapa() {
      try {
        const response = await fetch('/mapa.json');
        const mapa = await response.json();
        
        // Cria um objeto de mapeamento: idSite -> idPMG
        const mapeamento = {};
        for (const item of mapa) {
          if (item.idSite && item.idPMG) {
            mapeamento[item.idSite] = item.idPMG;
          }
        }
        
        setMapaIds(mapeamento);
        console.log('📦 Mapeamento IDs carregado:', mapeamento);
      } catch (error) {
        console.error('Erro ao carregar mapa.json:', error);
      } finally {
        setLoading(false);
      }
    }
    
    carregarMapa();
  }, []);

  // Função para pegar o idPMG a partir do idSite
  const getIdPmg = (idSite) => {
    return mapaIds[idSite] || idSite; // Se não encontrar, retorna o próprio idSite
  };

  return { mapaIds, getIdPmg, loading };
}