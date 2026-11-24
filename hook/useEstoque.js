// hook/useEstoque.js
import { useState, useEffect } from 'react';

function parseEstoque(valor) {
  if (!valor) return 0;
  return parseFloat(String(valor).replace(/\./g, '').replace(',', '.')) || 0;
}

export function useEstoque() {
  const [estoqueMap, setEstoqueMap] = useState({});   // idPMG -> { estoque, success, error? }
  const [mapaMap, setMapaMap] = useState({});         // idSite -> idPMG
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/estoque.json').then(r => r.ok ? r.json() : {}),
      fetch('/mapa.json').then(r => r.ok ? r.json() : []),
    ])
      .then(([estoqueData, mapaData]) => {
        setEstoqueMap(estoqueData || {});
        const m = {};
        (mapaData || []).forEach(item => { m[item.idSite] = item.idPMG; });
        setMapaMap(m);
      })
      .catch(err => console.error('Erro ao carregar estoque/mapa:', err))
      .finally(() => setLoading(false));
  }, []);

  // Retorna true se TEM estoque (>= 4)
  // Regras de segurança:
  // - não achou no mapa       → não bloqueia (mantém comportamento atual)
  // - produto sem dado        → não bloqueia
  // - success: false (erro)   → não bloqueia (não confia em leitura falha)
  // - success: true           → usa o valor (ok ou empty)
  const temEstoque = (idSite) => {
    const idPMG = mapaMap[idSite];
    if (!idPMG) return true;

    const item = estoqueMap[idPMG];

    // sem entrada no estoque.json → não bloqueia
    if (!item) return true;

    // scraper marcou como erro de leitura → não bloqueia
    if (item.success === false) return true;

    const texto = item.estoque;

    // sucesso mas sem valor (não deve acontecer com o novo scraper, mas por segurança) → não bloqueia
    if (texto === undefined || texto === null) return true;

    // valor válido → aplica a regra (>= 4 = tem estoque)
    return parseEstoque(texto) >= 4;
  };

  // Opcional: expõe um helper pra você inspecionar o status bruto (útil pra debug)
  const getEstoqueInfo = (idSite) => {
    const idPMG = mapaMap[idSite];
    if (!idPMG) return { idPMG: null, item: null, status: 'sem_mapa' };
    const item = estoqueMap[idPMG] || null;
    if (!item) return { idPMG, item: null, status: 'sem_dado' };
    if (item.success === false) return { idPMG, item, status: 'erro_leitura' };
    if (item.estoque === '0,000') return { idPMG, item, status: 'zerado' };
    return { idPMG, item, status: 'ok' };
  };

  return { temEstoque, getEstoqueInfo, loading };
}