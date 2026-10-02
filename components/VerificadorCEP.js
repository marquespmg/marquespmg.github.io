import React, { useState, useEffect } from 'react';

// ==============================================
// 📍 COMPONENTE: VERIFICADOR DE CEP
// ==============================================

const HORA_CORTE = 11;
const LS_KEY = 'pmg_cep_salvo'; // chave do localStorage

const DIAS_SEMANA = {
  0: 'domingo',
  1: 'segunda-feira',
  2: 'terça-feira',
  3: 'quarta-feira',
  4: 'quinta-feira',
  5: 'sexta-feira',
  6: 'sábado',
};

const CHAVE_DIA = {
  2: 'terca',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
};

function calcularProximaEntrega(dias) {
  const agora = new Date();
  const hoje = agora.getDay();
  const passouDas11h = agora.getHours() >= HORA_CORTE;

  for (let offset = 1; offset <= 14; offset++) {
    const diaFuturo = (hoje + offset) % 7;
    const chave = CHAVE_DIA[diaFuturo];
    if (!chave) continue;
    if (!dias[chave]) continue;

    const dataEntrega = new Date(agora);
    dataEntrega.setDate(agora.getDate() + offset);

    const dataPedido = new Date(dataEntrega);
    dataPedido.setDate(dataEntrega.getDate() - 1);

    const pedidoEhHoje = dataPedido.toDateString() === agora.toDateString();

    if (pedidoEhHoje && passouDas11h) continue;
    if (dataPedido < agora && !pedidoEhHoje) continue;

    const entregaEhAmanha =
      dataEntrega.toDateString() ===
      new Date(agora.getTime() + 86400000).toDateString();

    return {
      proximaEntrega: dataEntrega,
      diaSemanaEntrega: diaFuturo,
      nomeDiaEntrega: DIAS_SEMANA[diaFuturo],
      dataPedido,
      nomeDiaPedido: DIAS_SEMANA[dataPedido.getDay()],
      pedidoEhHoje,
      entregaEhAmanha,
    };
  }

  return null;
}

export default function VerificadorCEP() {
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('inicial');
  const [resultado, setResultado] = useState(null);
  const [cepsPMG, setCepsPMG] = useState(null);
  const [recolhido, setRecolhido] = useState(false);
  const [focado, setFocado] = useState(false);
  const [jaCarregou, setJaCarregou] = useState(false);

  // Carrega o JSON de CEPs da PMG
  useEffect(() => {
    fetch('/ceps_pmg.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => setCepsPMG(data))
      .catch(() => setCepsPMG({}));
  }, []);

  // ✅ NOVO: Ao montar, verifica se tem CEP salvo e refaz a busca
  useEffect(() => {
    if (!cepsPMG || jaCarregou) return;

    try {
      const cepSalvo = localStorage.getItem(LS_KEY);
      if (cepSalvo) {
        setCep(cepSalvo);
        // Refaz a busca automaticamente
        executarVerificacao(cepSalvo);
      }
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
    }

    setJaCarregou(true);
  }, [cepsPMG, jaCarregou]);

  const handleChangeCEP = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
    setCep(v);
    if (estado !== 'inicial') setEstado('inicial');
  };

  // ✅ Refatorado: recebe o CEP como parâmetro (pra funcionar no auto-load)
  const executarVerificacao = async (cepParaVerificar) => {
    const cepLimpo = (cepParaVerificar || cep).replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setEstado('invalido');
      return;
    }

    setEstado('buscando');

    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await resp.json();

      if (dados.erro) {
        setEstado('invalido');
        return;
      }

      const cidade = (dados.localidade || '').toUpperCase().trim();
      const uf = (dados.uf || '').toUpperCase().trim();
      const cidadesDoUF = cepsPMG?.[uf] || {};

      const normalizar = (s) =>
        s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();

      const cidadeNorm = normalizar(cidade);

      let chaveEncontrada = null;
      let dadosCidade = null;
      for (const k of Object.keys(cidadesDoUF)) {
        if (normalizar(k) === cidadeNorm) {
          chaveEncontrada = k;
          dadosCidade = cidadesDoUF[k];
          break;
        }
      }

      if (!chaveEncontrada) {
        for (const k of Object.keys(cidadesDoUF)) {
          const d = cidadesDoUF[k];
          if (d.cidade && normalizar(d.cidade) === cidadeNorm) {
            chaveEncontrada = k;
            dadosCidade = d;
            break;
          }
        }
      }

      // ✅ Salva no localStorage independente do resultado
      try {
        localStorage.setItem(LS_KEY, cepLimpo);
      } catch (e) {
        console.error('Erro ao salvar localStorage:', e);
      }

      if (!chaveEncontrada || !dadosCidade) {
        setEstado('nao_encontrado');
        setResultado({ cidade, uf });
        return;
      }

      const cepNum = parseInt(cepLimpo, 10);
      const cepiNum = parseInt((dadosCidade.cepi || '').replace(/\D/g, ''), 10);
      const cepfNum = parseInt((dadosCidade.cepf || '').replace(/\D/g, ''), 10);

      const dentroDaFaixa =
        !isNaN(cepiNum) && !isNaN(cepfNum)
          ? cepNum >= cepiNum && cepNum <= cepfNum
          : true;

      if (!dentroDaFaixa) {
        setEstado('nao_encontrado');
        setResultado({ cidade, uf });
        return;
      }

      const info = calcularProximaEntrega(dadosCidade);

      setEstado('encontrado');
      setResultado({ cidade, uf, ...info });
    } catch (err) {
      console.error(err);
      setEstado('invalido');
    }
  };

  const verificar = () => executarVerificacao(cep);

  // ✅ Resetar limpa também o localStorage
  const resetar = () => {
    setCep('');
    setEstado('inicial');
    setResultado(null);
    setRecolhido(false);
    try {
      localStorage.removeItem(LS_KEY);
    } catch (e) {
      console.error('Erro ao limpar localStorage:', e);
    }
  };

  // ============================================
  // RECOLHIDO (selo fino)
  // ============================================
  if (recolhido && (estado === 'encontrado' || estado === 'nao_encontrado') && resultado) {
    const ehEncontrado = estado === 'encontrado';
    return (
      <div
        onClick={() => setRecolhido(false)}
        title="Clique para ver os detalhes"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          backgroundColor: ehEncontrado ? '#E8F5E9' : '#FFF8E1',
          border: `1px solid ${ehEncontrado ? '#A5D6A7' : '#FFE082'}`,
          borderRadius: '20px',
          fontSize: '11px',
          color: ehEncontrado ? '#095400' : '#8B6914',
          cursor: 'pointer',
          marginBottom: '10px',
          userSelect: 'none',
          transition: 'all 0.2s',
        }}
      >
        <span>📍</span>
        <span style={{ fontWeight: '600' }}>
          {ehEncontrado ? resultado.cidade : `Sem entrega em ${resultado.cidade}`}
        </span>
        {ehEncontrado && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#095400',
              color: 'white',
              fontSize: '8px',
              fontWeight: 'bold',
            }}
          >
            ✓
          </span>
        )}
        <span style={{ fontSize: '9px', opacity: 0.6 }}>▾</span>
      </div>
    );
  }

  // ============================================
  // CORES POR ESTADO
  // ============================================
  const cores = {
    inicial: { bg: '#f5f5f5', border: '#ddd', text: '#333' },
    buscando: { bg: '#f5f5f5', border: '#ddd', text: '#666' },
    encontrado: { bg: '#E8F5E9', border: '#A5D6A7', text: '#095400' },
    nao_encontrado: { bg: '#FFF8E1', border: '#FFE082', text: '#8B6914' },
    invalido: { bg: '#FFEBEE', border: '#FFCDD2', text: '#C62828' },
  };

  const c = cores[estado] || cores.inicial;

  // ============================================
  // ESTILOS
  // ============================================
  const styles = {
    container: {
      position: 'relative',
      backgroundColor: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '10px',
      padding: '8px 12px',
      marginBottom: 0,
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    botaoRecolher: {
      position: 'absolute',
      top: '6px',
      right: '6px',
      background: 'rgba(255,255,255,0.7)',
      border: 'none',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666',
      fontSize: '14px',
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'all 0.2s',
      padding: 0,
    },
    linhaInput: {
      display: 'flex',
      gap: '6px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    inputWrap: {
      position: 'relative',
      flex: '1 1 180px',
      minWidth: '140px',
      display: 'flex',
      alignItems: 'center',
    },
    iconeInput: {
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '13px',
      opacity: 0.5,
      pointerEvents: 'none',
      lineHeight: 1,
    },
    input: {
      width: '100%',
      padding: '7px 10px 7px 30px',
      borderRadius: '8px',
      border: `1px solid ${focado ? '#095400' : '#ddd'}`,
      fontSize: '13px',
      outline: 'none',
      transition: 'border 0.2s',
      fontFamily: 'monospace',
      backgroundColor: 'white',
    },
    botao: {
      padding: '7px 16px',
      backgroundColor: '#095400',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    },
    botaoDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    resultadoBox: {
      fontSize: '12px',
      color: c.text,
      lineHeight: '1.45',
      paddingRight: '24px',
    },
    destaque: {
      fontWeight: '700',
    },
    botaoAlterar: {
      background: 'none',
      border: 'none',
      color: '#095400',
      fontSize: '11px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'underline',
      padding: '2px 0',
      marginTop: '4px',
    },
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={styles.container}>
      {/* Botão de recolher (só quando tem resultado) */}
      {(estado === 'encontrado' || estado === 'nao_encontrado') && (
        <button
          onClick={() => setRecolhido(true)}
          title="Recolher"
          style={styles.botaoRecolher}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
          onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.7)')}
        >
          ×
        </button>
      )}

      {/* INICIAL / BUSCANDO / INVALIDO — input único com ícone dentro */}
      {(estado === 'inicial' || estado === 'buscando' || estado === 'invalido') && (
        <>
          <div style={styles.linhaInput}>
            <div style={styles.inputWrap}>
              <span style={styles.iconeInput}>📍</span>
              <input
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={handleChangeCEP}
                onKeyDown={(e) => e.key === 'Enter' && verificar()}
                onFocus={() => setFocado(true)}
                onBlur={() => setFocado(false)}
                style={styles.input}
                maxLength={9}
                inputMode="numeric"
              />
            </div>
            <button
              onClick={verificar}
              disabled={estado === 'buscando' || cep.replace(/\D/g, '').length !== 8}
              style={{
                ...styles.botao,
                ...(estado === 'buscando' || cep.replace(/\D/g, '').length !== 8
                  ? styles.botaoDisabled
                  : {}),
              }}
            >
              {estado === 'buscando' ? 'Verificando...' : 'Verificar'}
            </button>
          </div>

          {estado === 'invalido' && (
            <div style={{ ...styles.resultadoBox, marginTop: '6px' }}>
              ❌ CEP inválido. Confira e tente novamente.
            </div>
          )}
        </>
      )}

      {/* ENCONTRADO */}
      {estado === 'encontrado' && resultado && (
        <div style={styles.resultadoBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <span style={{ fontSize: '14px' }}>✅</span>
            <span style={styles.destaque}>Entregamos em {resultado.cidade}!</span>
          </div>

          {resultado.proximaEntrega ? (
            resultado.pedidoEhHoje ? (
              <div>
                Faça seu pedido <span style={styles.destaque}>hoje até 11h</span> e receba{' '}
                {resultado.entregaEhAmanha ? (
                  <span style={styles.destaque}>amanhã ({resultado.nomeDiaEntrega})</span>
                ) : (
                  <span style={styles.destaque}>{resultado.nomeDiaEntrega}</span>
                )}
                .
              </div>
            ) : (
              <div>
                Faça seu pedido até{' '}
                <span style={styles.destaque}>{resultado.nomeDiaPedido} às 11h</span> e receba{' '}
                <span style={styles.destaque}>{resultado.nomeDiaEntrega}</span>.
              </div>
            )
          ) : (
            <div>Não conseguimos calcular a próxima entrega. Fale conosco no WhatsApp.</div>
          )}

          <button onClick={resetar} style={styles.botaoAlterar}>
            Alterar CEP
          </button>
        </div>
      )}

      {/* NÃO ENCONTRADO */}
      {estado === 'nao_encontrado' && resultado && (
        <div style={styles.resultadoBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <span style={{ fontSize: '14px' }}>⚠️</span>
            <span style={styles.destaque}>
              Ainda não entregamos no seu CEP ({resultado.cidade}).
            </span>
          </div>
          <div>
            Faça seu pedido e confirme o local ao finalizar pelo{' '}
            <a
              href="https://wa.me/5511913572902"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#25D366', fontWeight: '700' }}
            >
              WhatsApp
            </a>
            .
          </div>
          <button onClick={resetar} style={styles.botaoAlterar}>
            Alterar CEP
          </button>
        </div>
      )}
    </div>
  );
}