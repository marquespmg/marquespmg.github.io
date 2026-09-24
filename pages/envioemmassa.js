import Link from 'next/link';
import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';

export default function EnvioEmMassa() {
  // ========== PROTEÇÃO POR SENHA ==========
  const [autenticado, setAutenticado] = useState(false);
  const [senhaInput, setSenhaInput] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  // ========== ESTADOS ORIGINAIS ==========
  const [isMobile, setIsMobile] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('disparar');
  const [arquivo, setArquivo] = useState(null);
  const [contatos, setContatos] = useState([]);
  const [template, setTemplate] = useState('prospeccao_pmg_atacado3');
  const [enviando, setEnviando] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [recebidas, setRecebidas] = useState([]);
  const [log, setLog] = useState([]);
  const fileInputRef = useRef(null);

  // Preço por mensagem Marketing (Brasil) em USD
  const PRECO_MARKETING_USD = 0.0732;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);

    const hist = localStorage.getItem('pmg_historico');
    if (hist) setHistorico(JSON.parse(hist));
    const rec = localStorage.getItem('pmg_recebidas');
    if (rec) setRecebidas(JSON.parse(rec));

    return () => window.removeEventListener('resize', check);
  }, []);

  const salvarHistorico = (novo) => {
    setHistorico(novo);
    localStorage.setItem('pmg_historico', JSON.stringify(novo));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArquivo(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const texto = evt.target.result;
      const linhas = texto.split('\n').filter(l => l.trim());
      if (linhas.length < 2) {
        setLog(prev => [...prev, '⚠️ Arquivo vazio ou sem cabeçalho']);
        return;
      }

      // Detecta o separador: tab, ponto e vírgula ou vírgula
      const primeiraLinha = linhas[0];
      let separador = ',';
      if (primeiraLinha.includes('\t')) separador = '\t';
      else if (primeiraLinha.includes(';')) separador = ';';
      else if (primeiraLinha.includes(',')) separador = ',';

      const cabecalho = primeiraLinha
        .split(separador)
        .map(c => c.trim().toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
        );

      const dados = linhas.slice(1).map(linha => {
        const valores = linha.split(separador).map(v => v.trim());
        const obj = {};
        cabecalho.forEach((col, i) => obj[col] = valores[i] || '');
        return obj;
      }).filter(c => c.telefone);

      setContatos(dados);
      setLog(prev => [
        ...prev,
        `✅ ${dados.length} contatos carregados (separador: "${separador === '\t' ? 'TAB' : separador}")`
      ]);
    };
    reader.readAsText(file);
  };

  // Adiciona 55 automaticamente se não tiver
  const limparTelefone = (tel) => {
    let numero = tel.replace(/\D/g, '');
    if (numero.startsWith('55') && numero.length >= 12) return numero;
    if (numero.length === 10 || numero.length === 11) return '55' + numero;
    return numero;
  };

  const handleEnviar = async () => {
    if (!contatos.length) {
      setLog(prev => [...prev, '❌ Nenhum contato carregado']);
      return;
    }
    setEnviando(true);
    setLog(prev => [...prev, `🚀 Iniciando envio para ${contatos.length} contatos...`]);

    const campanha = {
      id: Date.now(),
      data: new Date().toISOString(),
      template,
      total: contatos.length,
      enviados: 0,
      falhas: 0,
      custoEstimado: 0
    };

    for (let i = 0; i < contatos.length; i++) {
      const c = contatos[i];
      const telefone = limparTelefone(c.telefone);

      try {
        const resp = await fetch('/api/enviar-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telefone,
            template,
            parametros: {
              nome: c.nome || 'Cliente',
              empresa: c.empresa || '',
              cidade: c.cidade || ''
            }
          })
        });

        const data = await resp.json();
        const ok = resp.ok;

        if (ok) {
          campanha.enviados++;
          campanha.custoEstimado += PRECO_MARKETING_USD;
          setLog(prev => [...prev, `✅ ${c.nome} (${telefone}) — enviado`]);
        } else {
          campanha.falhas++;
          const erro = data?.erro?.error?.message || 'falhou';
          setLog(prev => [...prev, `❌ ${c.nome} (${telefone}) — ${erro}`]);
        }
      } catch (err) {
        campanha.falhas++;
        setLog(prev => [...prev, `❌ ${c.nome} (${telefone}) — erro: ${err.message}`]);
      }

      await new Promise(r => setTimeout(r, 1000));
    }

    salvarHistorico([campanha, ...historico]);
    setEnviando(false);
    setLog(prev => [...prev, '🏁 Envio concluído!']);
  };

  const custoTotal = historico.reduce((acc, c) => acc + (c.custoEstimado || 0), 0);
  const totalEnviados = historico.reduce((acc, c) => acc + c.enviados, 0);
  const totalFalhas = historico.reduce((acc, c) => acc + c.falhas, 0);

  // ========== TELA DE LOGIN ==========
  if (!autenticado) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f8f0',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '40px 30px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(9, 84, 0, 0.15)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <img
            src="https://i.imgur.com/pBH5WpZ.png"
            alt="PMG"
            style={{ width: '120px', marginBottom: '20px' }}
          />
          <h1 style={{ color: '#095400', fontSize: '1.4rem', marginBottom: '10px' }}>
            Painel Interno
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '25px' }}>
            Digite a senha para acessar o painel de envio.
          </p>

          <input
            type="password"
            placeholder="Senha"
            value={senhaInput}
            onChange={(e) => setSenhaInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (senhaInput === process.env.NEXT_PUBLIC_SENHA_PMG) {
                  setAutenticado(true);
                  setErroSenha('');
                } else {
                  setErroSenha('Senha incorreta');
                }
              }
            }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              marginBottom: '15px',
              boxSizing: 'border-box'
            }}
          />

          {erroSenha && (
            <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '15px' }}>
              {erroSenha}
            </p>
          )}

          <button
            onClick={() => {
              if (senhaInput === process.env.NEXT_PUBLIC_SENHA_PMG) {
                setAutenticado(true);
                setErroSenha('');
              } else {
                setErroSenha('Senha incorreta');
              }
            }}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#095400',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // ========== PAINEL (APÓS LOGIN) ==========
  return (
    <>
      <Head>
        <title>Painel de Envio - Marques Vendas PMG</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#095400" />
      </Head>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '10px' : '20px',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
      }}>
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '15px 0' : '30px 0',
          marginBottom: '20px'
        }}>
          <div style={{
            backgroundColor: '#095400',
            padding: isMobile ? '8px 15px' : '10px 25px',
            borderRadius: '30px',
            marginBottom: '10px',
            color: 'white',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: '600'
          }}>
            Painel Interno
          </div>
          <img
            src="https://i.imgur.com/pBH5WpZ.png"
            alt="Marques Vendas PMG"
            style={{ width: isMobile ? '150px' : '180px', margin: '10px 0' }}
          />
          <h1 style={{
            color: '#095400',
            fontSize: isMobile ? '1.4rem' : '1.8rem',
            margin: '10px 0',
            textAlign: 'center',
            fontWeight: '700'
          }}>
            Painel de Envio — WhatsApp
          </h1>
        </header>

        <section style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={cardResumo}>
            <div style={cardLabel}>Enviadas</div>
            <div style={cardValor}>{totalEnviados}</div>
          </div>
          <div style={cardResumo}>
            <div style={cardLabel}>Falhas</div>
            <div style={{ ...cardValor, color: '#e74c3c' }}>{totalFalhas}</div>
          </div>
          <div style={cardResumo}>
            <div style={cardLabel}>Campanhas</div>
            <div style={cardValor}>{historico.length}</div>
          </div>
          <div style={cardResumo}>
            <div style={cardLabel}>Custo estimado</div>
            <div style={{ ...cardValor, fontSize: '1.3rem' }}>
              US$ {custoTotal.toFixed(2)}
            </div>
          </div>
        </section>

        <nav style={{
          display: 'flex',
          gap: '5px',
          marginBottom: '20px',
          borderBottom: '2px solid #e0e0e0',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'disparar', label: '📤 Disparar' },
            { id: 'historico', label: '📊 Histórico' },
            { id: 'recebidas', label: '📥 Recebidas' },
            { id: 'custos', label: '💰 Custos' }
          ].map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              style={{
                padding: '10px 18px',
                backgroundColor: 'transparent',
                color: abaAtiva === aba.id ? '#095400' : '#666',
                border: 'none',
                borderBottom: abaAtiva === aba.id ? '3px solid #095400' : '3px solid transparent',
                fontSize: isMobile ? '0.85rem' : '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '-2px'
              }}
            >
              {aba.label}
            </button>
          ))}
        </nav>

        {abaAtiva === 'disparar' && (
          <>
            <section style={cardSecao}>
              <h2 style={tituloSecao}>1. Suba a planilha (CSV)</h2>
              <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '15px' }}>
                Colunas esperadas: <code>nome, empresa, cidade, telefone</code>
                <br />
                <small>O <code>55</code> é adicionado automaticamente se não estiver no número.</small>
              </p>
              <input
                type="file"
                accept=".csv,.txt"
                ref={fileInputRef}
                onChange={handleFile}
                style={{ display: 'none' }}
              />
              <button onClick={() => fileInputRef.current.click()} style={botaoPrimario}>
                📂 Escolher arquivo
              </button>
              {arquivo && (
                <p style={{ marginTop: '10px', color: '#095400', fontSize: '0.9rem' }}>
                  📄 {arquivo.name} — {contatos.length} contatos
                </p>
              )}
            </section>

            <section style={cardSecaoCinza}>
              <h2 style={tituloSecao}>2. Template aprovado</h2>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                style={selectStyle}
              >
                <option value="prospeccao_pmg_atacado3">prospeccao_pmg_atacado3</option>
              </select>
            </section>

            <section style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button
                onClick={handleEnviar}
                disabled={enviando || !contatos.length}
                style={{
                  ...botaoPrimario,
                  backgroundColor: enviando ? '#999' : '#e74c3c',
                  padding: '16px 40px',
                  fontSize: '1.1rem',
                  cursor: enviando ? 'not-allowed' : 'pointer'
                }}
              >
                {enviando ? '⏳ Enviando...' : '🚀 Disparar mensagens'}
              </button>
            </section>

            <section style={logStyle}>
              {log.length === 0 ? (
                <span style={{ color: '#666' }}>Aguardando ação...</span>
              ) : (
                log.map((l, i) => <div key={i}>{l}</div>)
              )}
            </section>
          </>
        )}

        {abaAtiva === 'historico' && (
          <section style={cardSecao}>
            <h2 style={tituloSecao}>Histórico de campanhas</h2>
            {historico.length === 0 ? (
              <p style={{ color: '#666' }}>Nenhuma campanha enviada ainda.</p>
            ) : (
              historico.map(c => (
                <div key={c.id} style={{
                  padding: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <strong style={{ color: '#095400' }}>{c.template}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {new Date(c.data).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>✅ {c.enviados} enviados</div>
                      <div style={{ color: '#e74c3c' }}>❌ {c.falhas} falhas</div>
                      <div style={{ fontSize: '0.8rem' }}>US$ {c.custoEstimado.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {abaAtiva === 'recebidas' && (
          <section style={cardSecao}>
            <h2 style={tituloSecao}>Mensagens recebidas</h2>
            {recebidas.length === 0 ? (
              <p style={{ color: '#666' }}>
                Nenhuma mensagem recebida ainda.<br />
                <small>Configure o Webhook para capturar as respostas automaticamente.</small>
              </p>
            ) : (
              recebidas.map((m, i) => (
                <div key={i} style={{
                  padding: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    {m.telefone} • {new Date(m.data).toLocaleString('pt-BR')}
                  </div>
                  <div style={{ marginTop: '5px' }}>{m.texto}</div>
                </div>
              ))
            )}
          </section>
        )}

        {abaAtiva === 'custos' && (
          <section style={cardSecao}>
            <h2 style={tituloSecao}>Custos estimados</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
              Preço usado como referência: <strong>US$ {PRECO_MARKETING_USD.toFixed(4)}</strong> por mensagem de Marketing (Brasil).
              <br />
              <small>O valor real pode variar. Confira no Billing Hub da Meta.</small>
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f8f0' }}>
                  <th style={thStyle}>Campanha</th>
                  <th style={thStyle}>Enviados</th>
                  <th style={thStyle}>Custo (US$)</th>
                </tr>
              </thead>
              <tbody>
                {historico.map(c => (
                  <tr key={c.id}>
                    <td style={tdStyle}>
                      {c.template}<br />
                      <small style={{ color: '#666' }}>{new Date(c.data).toLocaleDateString('pt-BR')}</small>
                    </td>
                    <td style={tdStyle}>{c.enviados}</td>
                    <td style={tdStyle}>US$ {c.custoEstimado.toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: '#f0f8f0', fontWeight: '700' }}>
                  <td style={tdStyle}>Total</td>
                  <td style={tdStyle}>{totalEnviados}</td>
                  <td style={tdStyle}>US$ {custoTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        <footer style={{
          marginTop: '40px',
          padding: '25px 15px',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.8rem',
          borderTop: '2px solid #095400',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px 12px 0 0'
        }}>
          <Link href="/" style={{ color: '#095400', textDecoration: 'none', fontWeight: '600' }}>
            ← Voltar para o site
          </Link>
          <p style={{ marginTop: '15px' }}>
            © {new Date().getFullYear()} Marques Vendas PMG. Painel interno.
          </p>
        </footer>
      </div>
    </>
  );
}

const cardResumo = {
  backgroundColor: '#f8f8f8',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};
const cardLabel = { fontSize: '0.8rem', color: '#666', marginBottom: '5px' };
const cardValor = { fontSize: '1.5rem', fontWeight: '700', color: '#095400' };
const cardSecao = {
  backgroundColor: '#f0f8f0',
  border: '1px solid #e0f0e0',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '20px'
};
const cardSecaoCinza = {
  backgroundColor: '#f8f8f8',
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '20px'
};
const tituloSecao = { color: '#095400', fontSize: '1.2rem', marginBottom: '15px' };
const botaoPrimario = {
  padding: '12px 25px',
  backgroundColor: '#095400',
  color: '#fff',
  border: 'none',
  borderRadius: '30px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 3px 10px rgba(9, 84, 0, 0.3)'
};
const selectStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  color: '#333'
};
const logStyle = {
  backgroundColor: '#1e1e1e',
  color: '#0f0',
  borderRadius: '8px',
  padding: '15px',
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  maxHeight: '300px',
  overflowY: 'auto',
  marginBottom: '20px'
};
const thStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ccc',
  fontSize: '0.85rem'
};
const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee',
  fontSize: '0.85rem'
};
