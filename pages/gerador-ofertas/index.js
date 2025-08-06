import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';

export default function GeradorOfertas() {
  // Estados
  const [acessoPermitido, setAcessoPermitido] = useState(false);
  const [senha, setSenha] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [busca, setBusca] = useState('');
  const [modoSelecao, setModoSelecao] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

  const verificarSenha = () => {
    if (senha === "PMG@2024") {
      setAcessoPermitido(true);
      carregarProdutos();
    } else {
      alert("Senha incorreta!");
    }
  };

  const carregarProdutos = () => {
    fetch('/produtos.json')
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(err => console.error('Erro ao carregar produtos:', err));
  };

  // Cores da PMG
  const coresPMG = {
    primaria: '#095400',
    secundaria: '#ff0000',
    fundo: '#f8f9fa',
    texto: '#333333'
  };

  // Carrega produtos quando acesso é permitido
  useEffect(() => {
    if (acessoPermitido) {
      carregarProdutos();
    }
  }, [acessoPermitido]);

  // Função de filtro
  const produtosFiltrados = useMemo(() => {
    if (!modoSelecao || !busca.trim()) return produtos;

    const termo = busca.toLowerCase().trim();
    return produtos.filter(produto => {
      const nome = produto.name.toLowerCase();
      const palavras = nome.split(/[\s\/\-.,;]+/);
      return palavras.some(palavra => palavra === termo) || nome === termo;
    });
  }, [busca, produtos, modoSelecao]);

  // Paginação
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = produtosFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(produtosFiltrados.length / productsPerPage);

  // Funções para seleção em massa
  const selecionarTodos = () => {
    setProdutosSelecionados(produtosFiltrados);
  };

  const desmarcarTodos = () => {
    setProdutosSelecionados([]);
  };

  // Alterna seleção de produto
  const toggleSelecionarProduto = (produto) => {
    setProdutosSelecionados(prev =>
      prev.some(p => p.id === produto.id)
        ? prev.filter(p => p.id !== produto.id)
        : [...prev, produto]
    );
  };

const gerarEncarteVisual = async () => {
    if (produtosSelecionados.length === 0) {
      alert("Selecione pelo menos um produto!");
      return;
    }

    try {
      // Configurações de design premium
      const coresPMG = {
        verde: "#095400",
        vermelho: "#C62828",    // Vermelho para fundo de preço
        amarelo: "#FFD600",    // Amarelo para texto do preço
        branco: "#FFFFFF",
        fundo: "#FAFAFA",
        texto: "#212121",
        textoClaro: "#757575",
        borda: "#E0E0E0",
        overlay: "rgba(0, 80, 10, 0.05)"
      };

      // Layout premium
      const produtosPorLinha = 4;
      const padding = 50;
      const borderWidth = 15;
      const logoHeight = 120;
      const margemTopo = logoHeight + 88;
      const larguraProduto = 450;
      const alturaProduto = 620;

      // Calcula tamanho do canvas
      const linhas = Math.ceil(produtosSelecionados.length / produtosPorLinha);
      const canvasWidth = produtosPorLinha * larguraProduto + (produtosPorLinha + 1) * padding + borderWidth * 2;
      const canvasHeight = margemTopo + linhas * alturaProduto + (linhas + 1) * padding + borderWidth * 2;

      // Cria o canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fundo com textura sutil
      ctx.fillStyle = coresPMG.fundo;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Padrão de textura sutil
      ctx.fillStyle = coresPMG.overlay;
      for (let i = 0; i < canvas.width; i += 50) {
        for (let j = 0; j < canvas.height; j += 50) {
          if ((i + j) % 100 === 0) {
            ctx.fillRect(i, j, 1, 1);
          }
        }
      }

      // Borda verde fina
      ctx.fillStyle = coresPMG.verde;
      ctx.fillRect(0, 0, canvas.width, borderWidth);
      ctx.fillRect(0, 0, borderWidth, canvas.height);
      ctx.fillRect(canvas.width - borderWidth, 0, borderWidth, canvas.height);
      ctx.fillRect(0, canvas.height - borderWidth, canvas.width, borderWidth);

      // Logo PMG centralizada mantendo proporção
      const logo = new Image();
      logo.src = "/logo-pmg.png";
      await new Promise((resolve) => {
        logo.onload = () => {
          // Calcula dimensões proporcionais
          const logoMaxWidth = 280;
          const aspectRatio = logo.naturalWidth / logo.naturalHeight;
          const logoWidth = Math.min(logoMaxWidth, logo.naturalWidth);
          const logoHeight = logoWidth / aspectRatio;
          
          // Desenha o logo mantendo proporção original
          ctx.drawImage(
            logo,
            canvas.width / 2 - logoWidth / 2,
            borderWidth + 5,
            logoWidth,
            logoHeight
          );
          resolve();
        };
        logo.onerror = resolve;
      });

      // Desenha os produtos com design premium
      for (let i = 0; i < produtosSelecionados.length; i++) {
        const produto = produtosSelecionados[i];
        const linha = Math.floor(i / produtosPorLinha);
        const coluna = i % produtosPorLinha;

        // Posição do card
        const x = borderWidth + padding + coluna * (larguraProduto + padding);
        const y = borderWidth + margemTopo + linha * (alturaProduto + padding);

        // Card com sombra e borda arredondada
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        
        ctx.fillStyle = coresPMG.branco;
        ctx.beginPath();
        ctx.roundRect(x, y, larguraProduto, alturaProduto, 12);
        ctx.fill();
        ctx.restore();

        // Borda sutil
        ctx.strokeStyle = coresPMG.borda;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, larguraProduto, alturaProduto, 12);
        ctx.stroke();

        // Área da imagem
        const imgArea = {
          x: x + 15,
          y: y + 15,
          width: larguraProduto - 30,
          height: alturaProduto * 0.62,
        };

        // Carrega imagem do produto
        const imgProduto = new Image();
        imgProduto.crossOrigin = "anonymous";
        imgProduto.src = produto.image;

        try {
          await new Promise((resolve, reject) => {
            imgProduto.onload = resolve;
            imgProduto.onerror = reject;
          });

          // Máscara arredondada para a imagem
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(
            imgArea.x + 2, 
            imgArea.y + 2, 
            imgArea.width - 4, 
            imgArea.height - 4, 
            6
          );
          ctx.clip();

          // Desenha imagem mantendo proporção
          const aspect = imgProduto.width / imgProduto.height;
          let drawWidth, drawHeight, drawX, drawY;

          if (aspect > imgArea.width / imgArea.height) {
            drawWidth = imgArea.width - 4;
            drawHeight = drawWidth / aspect;
            drawX = imgArea.x + 2;
            drawY = imgArea.y + 2 + (imgArea.height - 4 - drawHeight) / 2;
          } else {
            drawHeight = imgArea.height - 4;
            drawWidth = drawHeight * aspect;
            drawX = imgArea.x + 2 + (imgArea.width - 4 - drawWidth) / 2;
            drawY = imgArea.y + 2;
          }

          ctx.drawImage(imgProduto, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();

          // Overlay verde muito sutil
          ctx.fillStyle = coresPMG.overlay;
          ctx.fillRect(imgArea.x + 2, imgArea.y + 2, imgArea.width - 4, imgArea.height - 4);

        } catch {
          // Placeholder premium
          ctx.fillStyle = "#FAFAFA";
          ctx.beginPath();
          ctx.roundRect(imgArea.x + 2, imgArea.y + 2, imgArea.width - 4, imgArea.height - 4, 6);
          ctx.fill();
          
          ctx.fillStyle = coresPMG.textoClaro;
          ctx.font = "italic 22px 'Open Sans', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Imagem não disponível", imgArea.x + imgArea.width / 2, imgArea.y + imgArea.height / 2);
        }

        // Nome do produto
        ctx.fillStyle = coresPMG.texto;
        ctx.font = "500 24px 'Open Sans', sans-serif";
        ctx.textAlign = "center";

        const maxTextWidth = larguraProduto * 0.85;
        const nomeLines = quebrarTexto(ctx, produto.name, maxTextWidth);

        // Desenha o nome (limitado a 2 linhas)
        const nomeBaseY = y + imgArea.height + 40;
        nomeLines.slice(0, 2).forEach((line, idx) => {
          ctx.fillText(line, x + larguraProduto / 2, nomeBaseY + idx * 30);
        });

        // Container do preço - fundo vermelho
        const priceTagWidth = larguraProduto * 0.7; // Mais largo
        const priceTagX = x + (larguraProduto - priceTagWidth) / 2; // Centralizado
        
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;
        
        ctx.fillStyle = coresPMG.vermelho;
        ctx.beginPath();
        ctx.roundRect(
          priceTagX,
          y + alturaProduto * 0.78,
          priceTagWidth,
          50,
          25
        );
        ctx.fill();
        ctx.restore();

        // Preço em amarelo centralizado
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;
        
        ctx.fillStyle = coresPMG.amarelo;
        ctx.font = "bold 38px 'Montserrat', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
  formatarPreco(produto.price),
  x + larguraProduto / 2,
  y + alturaProduto * 0.78 + 33 // ou 32, 34… ajusta fino se quiser
);
        ctx.restore();

        // Unidade
        if (produto.unit && produto.unit !== "undefined") {
          ctx.fillStyle = coresPMG.textoClaro;
          ctx.font = "18px 'Open Sans', sans-serif";
          ctx.fillText(
            `por ${produto.unit.toLowerCase()}`,
            x + larguraProduto / 2,
            y + alturaProduto * 0.88
          );
        }

        // Selo de promoção
        if (produto.promocao) {
          ctx.save();
          // Triângulo de fundo
          ctx.fillStyle = coresPMG.vermelho;
          ctx.beginPath();
          ctx.moveTo(x + 15, y + 15);
          ctx.lineTo(x + 85, y + 15);
          ctx.lineTo(x + 15, y + 85);
          ctx.closePath();
          ctx.fill();
          
          // Texto do selo
          ctx.fillStyle = coresPMG.amarelo;
          ctx.font = "bold 16px 'Montserrat'";
          ctx.save();
          ctx.translate(x + 35, y + 45);
          ctx.rotate(-Math.PI/4);
          ctx.fillText("PROMOÇÃO", 0, 0);
          ctx.restore();
          ctx.restore();
        }
      }

      // Rodapé premium
      ctx.fillStyle = coresPMG.verde;
      ctx.fillRect(0, canvas.height - 70, canvas.width, 70);
      
      // Textos do rodapé
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "600 18px 'Open Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("OFERTAS DO DIA PMG", canvas.width / 2, canvas.height - 40);
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "14px 'Open Sans', sans-serif";
      ctx.fillText(`Validade: ${new Date().toLocaleDateString('pt-BR')} | pedido minimo $750`, canvas.width / 2, canvas.height - 15);

      // Copia para área de transferência
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          alert("✅ Encarte copiado com sucesso! Cole no Canva (Ctrl+V)");
        } catch (err) {
          console.error("Erro ao copiar:", err);
          const link = document.createElement("a");
          link.download = `encarte-pmg-${new Date().toISOString().split("T")[0]}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
        }
      }, "image/png", 1);
    } catch (error) {
      console.error("Erro ao gerar encarte:", error);
      alert("❌ Erro ao gerar encarte. Verifique o console.");
    }
  };

  // Funções auxiliares
  function formatarPreco(preco) {
    const numero = typeof preco === "string"
      ? parseFloat(preco.replace(",", "."))
      : preco;
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function quebrarTexto(ctx, texto, maxWidth) {
    const palavras = texto.split(" ");
    const linhas = [];
    let linhaAtual = palavras[0];

    for (let i = 1; i < palavras.length; i++) {
      const testeLinha = linhaAtual + " " + palavras[i];
      const metrica = ctx.measureText(testeLinha);
      if (metrica.width < maxWidth) {
        linhaAtual = testeLinha;
      } else {
        linhas.push(linhaAtual);
        linhaAtual = palavras[i];
      }
    }
    linhas.push(linhaAtual);
    return linhas;
  }

  const copiarTextoOfertas = () => {
    if (produtosSelecionados.length === 0) {
      alert('Selecione pelo menos um produto!');
      return;
    }

    let texto = `*🛍️ ENCARTE DE OFERTAS - PMG* 🛒\n\n`;
    
    produtosSelecionados.forEach((produto, index) => {
      texto += `*${index + 1}. ${produto.name}*\n`;
      texto += `💰 *${produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n`;
      texto += `--------------------------------\n`;
    });

    texto += `\n📞 *Entre em contato:* (31) 99999-9999\n`;
    texto += `🚚 *Entregamos em toda região!*\n`;
    texto += `⏰ *Ofertas válidas até XX/XX/XXXX*`;

    navigator.clipboard.writeText(texto)
      .then(() => alert('Texto copiado para área de transferência!'))
      .catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Texto copiado!');
      });
  };

  if (!acessoPermitido) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h2 style={{ color: coresPMG.primaria }}>🔒 ACESSO RESTRITO</h2>
          <p style={styles.authText}>Gerador de encartes PMG</p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite a senha"
            style={styles.authInput}
          />
          <button
            onClick={() => verificarSenha()}
            style={styles.authButton}
          >
            ENTRAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gerador de Encartes - PMG</title>
      </Head>

      <div style={{ ...styles.container, backgroundColor: coresPMG.fundo }}>
        {/* Cabeçalho */}
        <header style={styles.header}>
          <h1 style={styles.title}>GERADOR DE ENCARTES</h1>
          <div style={styles.pmgLogo}>PMG</div>
        </header>

        {/* Controles */}
        <div style={styles.controls}>
          <button
            onClick={() => {
              setModoSelecao(!modoSelecao);
              setBusca(''); // Reseta a busca ao sair do modo seleção
              setCurrentPage(1); // Volta para primeira página
            }}
            style={{
              ...styles.button,
              backgroundColor: modoSelecao ? coresPMG.secundaria : coresPMG.primaria
            }}
          >
            {modoSelecao ? 'SAIR DA SELEÇÃO' : 'SELECIONAR MÚLTIPLOS'}
          </button>

          {modoSelecao && (
            <>
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setCurrentPage(1); // Reseta para primeira página ao buscar
                }}
                style={styles.searchInput}
              />
              <button
                onClick={selecionarTodos}
                style={{
                  ...styles.button,
                  backgroundColor: coresPMG.primaria
                }}
              >
                SELECIONAR TUDO
              </button>
              <button
                onClick={desmarcarTodos}
                style={{
                  ...styles.button,
                  backgroundColor: coresPMG.secundaria
                }}
              >
                DESMARCAR TUDO
              </button>
              <span style={styles.selectedCount}>
                {produtosSelecionados.length} selecionados
              </span>
            </>
          )}
        </div>

        {/* Lista de produtos */}
        <div style={styles.productsGrid}>
          {currentProducts.map(produto => (
            <div
              key={produto.id}
              style={{
                ...styles.productCard,
                borderColor: produtosSelecionados.some(p => p.id === produto.id)
                  ? coresPMG.secundaria
                  : '#ddd'
              }}
              onClick={() => modoSelecao && toggleSelecionarProduto(produto)}
            >
              <div style={styles.productImageContainer}>
                <img
                  src={produto.image || '/placeholder.png'}
                  alt={produto.name}
                  style={styles.productImage}
                  onError={(e) => e.target.src = '/placeholder.png'}
                />
              </div>
              <h3 style={styles.productName}>{produto.name}</h3>
              <p style={styles.productPrice}>
                {produto.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
              {!modoSelecao && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelecionarProduto(produto);
                    gerarEncarteVisual([produto]);
                  }}
                  style={styles.singleProductButton}
                >
                  GERAR OFERTA
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Paginação */}
        {produtosFiltrados.length > productsPerPage && (
          <div style={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 && { cursor: 'not-allowed', opacity: 0.5 })
              }}
            >
              Anterior
            </button>
            
            <span style={styles.pageInfo}>
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                ...styles.pageButton,
                ...(currentPage === totalPages && { cursor: 'not-allowed', opacity: 0.5 })
              }}
            >
              Próxima
            </button>
          </div>
        )}

        {/* Rodapé com ações quando em modo de seleção */}
        {modoSelecao && produtosSelecionados.length > 0 && (
          <div style={styles.footerActions}>
            <button
              onClick={copiarTextoOfertas}
              style={{
                ...styles.actionButton,
                backgroundColor: coresPMG.primaria
              }}
            >
              COPIAR TEXTO
            </button>
            <button
              onClick={gerarEncarteVisual}
              style={{
                ...styles.actionButton,
                backgroundColor: coresPMG.secundaria
              }}
            >
              GERAR ENCARTE VISUAL
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Estilos
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
    paddingBottom: '100px' // Espaço para os botões de ação
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #ff0000'
  },
  title: {
    color: '#ff0000',
    fontSize: '24px',
    margin: 0
  },
  pmgLogo: {
    background: '#095400',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  controls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  button: {
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px'
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    minWidth: '200px'
  },
  selectedCount: {
    background: '#ff0000',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '14px'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  productCard: {
    background: '#fff',
    borderRadius: '8px',
    padding: '15px',
    border: '2px solid #ddd',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }
  },
  productImageContainer: {
    width: '100%',
    height: '180px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    marginBottom: '15px'
  },
  productImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  productName: {
    fontSize: '16px',
    margin: '0 0 10px 0',
    color: '#333',
    fontWeight: '600',
    minHeight: '40px'
  },
  productPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ff0000',
    margin: '10px 0'
  },
  singleProductButton: {
    background: '#ff0000',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '14px'
  },
  footerActions: {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    background: '#fff',
    padding: '15px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    boxShadow: '0 -4px 10px rgba(0,0,0,0.1)'
  },
  actionButton: {
    padding: '12px 25px',
    borderRadius: '5px',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    gap: '10px'
  },
  pageButton: {
    padding: '8px 16px',
    border: '1px solid #095400',
    backgroundColor: '#fff',
    color: '#095400',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  pageInfo: {
    margin: '0 10px'
  }
};
