import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import * as XLSX from 'xlsx';

export default function GeradorOfertas() {
  // Estados existentes
  const [acessoPermitido, setAcessoPermitido] = useState(false);
  const [senha, setSenha] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [busca, setBusca] = useState('');
  const [modoSelecao, setModoSelecao] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [priceBand, setPriceBand] = useState('retira');
  const [imagesMap, setImagesMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // NOVOS ESTADOS
  const [temaPromocao, setTemaPromocao] = useState('');
  const [gerandoComIA, setGerandoComIA] = useState(false);
  const [usarIA, setUsarIA] = useState(false);
  const [progressoIA, setProgressoIA] = useState('');
  const [formatoIA, setFormatoIA] = useState('story');
  const [copiandoTextoIA, setCopiandoTextoIA] = useState(false);

  const coresPMG = {
    primaria: '#095400',
    secundaria: '#ff0000',
    fundo: '#f8f9fa',
    texto: '#333333'
  };

  const verificarSenha = () => {
    if (senha === "PMG@2024") {
      setAcessoPermitido(true);
      carregarImagens();
    } else {
      alert("Senha incorreta!");
    }
  };

  const carregarImagens = async () => {
    try {
      const response = await fetch('/imagens.json');
      const data = await response.json();
      setImagesMap(data);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    }
  };

  const carregarExcel = async (file) => {
    try {
      setIsLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      const produtosFormatados = rows.map((row, index) => {
        const code = String(row['Código'] || '').trim();
        const name = String(row['Produto'] || '').trim();
        const unit = String(row['Unidade'] || 'UN').trim().toUpperCase();

        const formatPrice = (value) => {
          if (typeof value === 'number') return value;
          const num = parseFloat(String(value).replace('.', '').replace(',', '.'));
          return isNaN(num) ? 0 : num;
        };

        const prices = {
          retira: formatPrice(row['Retira R$']),
          entrega: formatPrice(row['Entrega R$']),
          km100_199: formatPrice(row['100 a 199 km']),
          km200_299: formatPrice(row['200 a 299 km']),
          km300_399: formatPrice(row['300 a 399 km']),
          km400_499: formatPrice(row['400 a 499 km']),
          km500_599: formatPrice(row['500 a 599 km']),
          km600_plus: formatPrice(row['Acima 600km'])
        };

        const currentPrice = prices[priceBand] || prices.retira;

        return {
          id: index + 1,
          code,
          name,
          unit,
          price: currentPrice,
          formattedPrice: currentPrice.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
          }),
          prices,
          image: imagesMap[code] || getPlaceholderImage(code),
          category: categorizarProduto(name)
        };
      });

      setProdutos(produtosFormatados);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar Excel:', error);
      alert('Erro ao processar arquivo Excel');
      setIsLoading(false);
    }
  };

  const getPlaceholderImage = (code) => {
    return `https://via.placeholder.com/150/095400/FFFFFF?text=${code}`;
  };

  const categorizarProduto = (nome) => {
    const nomeLower = nome.toLowerCase();
    if (nomeLower.includes('carne')) return 'Carnes';
    if (nomeLower.includes('frango')) return 'Aves';
    if (nomeLower.includes('bebida')) return 'Bebidas';
    if (nomeLower.includes('limpeza')) return 'Limpeza';
    if (nomeLower.includes('laticínio') || nomeLower.includes('queijo')) return 'Laticínios';
    return 'Outros';
  };

  useEffect(() => {
    if (produtos.length > 0) {
      const produtosAtualizados = produtos.map(produto => {
        const novoPreco = produto.prices[priceBand] || produto.prices.retira;
        return {
          ...produto,
          price: novoPreco,
          formattedPrice: novoPreco.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
          })
        };
      });
      setProdutos(produtosAtualizados);
    }
  }, [priceBand]);

  const produtosFiltrados = useMemo(() => {
    if (!modoSelecao || !busca.trim()) return produtos;
    const termo = busca.toLowerCase().trim();
    return produtos.filter(produto => {
      const nome = produto.name.toLowerCase();
      const palavras = nome.split(/[\s\/\-.,;]+/);
      return palavras.some(palavra => palavra === termo) || nome === termo;
    });
  }, [busca, produtos, modoSelecao]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = produtosFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(produtosFiltrados.length / productsPerPage);

  const selecionarTodos = () => {
    setProdutosSelecionados(produtosFiltrados);
  };

  const desmarcarTodos = () => {
    setProdutosSelecionados([]);
  };

  const toggleSelecionarProduto = (produto) => {
    setProdutosSelecionados(prev =>
      prev.some(p => p.id === produto.id)
        ? prev.filter(p => p.id !== produto.id)
        : [...prev, produto]
    );
  };

  // ============================================
  // FUNÇÃO ORIGINAL - MODO CLÁSSICO
  // ============================================
  const gerarEncarteVisual = async () => {
    if (produtosSelecionados.length === 0) {
      alert("Selecione pelo menos um produto!");
      return;
    }

    try {
      const coresPMG = {
        verde: "#095400",
        vermelho: "#C62828",
        amarelo: "#FFD600",
        branco: "#FFFFFF",
        fundo: "#FAFAFA",
        texto: "#212121",
        textoClaro: "#757575",
        borda: "#E0E0E0",
        overlay: "rgba(0, 80, 10, 0.05)"
      };

      const produtosPorLinha = 4;
      const padding = 50;
      const borderWidth = 15;
      const logoHeight = 120;
      const margemTopo = logoHeight + 88;
      const larguraProduto = 450;
      const alturaProduto = 620;

      const linhas = Math.ceil(produtosSelecionados.length / produtosPorLinha);
      const canvasWidth = produtosPorLinha * larguraProduto + (produtosPorLinha + 1) * padding + borderWidth * 2;
      const canvasHeight = margemTopo + linhas * alturaProduto + (linhas + 1) * padding + borderWidth * 2;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.fillStyle = coresPMG.fundo;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = coresPMG.overlay;
      for (let i = 0; i < canvas.width; i += 50) {
        for (let j = 0; j < canvas.height; j += 50) {
          if ((i + j) % 100 === 0) {
            ctx.fillRect(i, j, 1, 1);
          }
        }
      }

      ctx.fillStyle = coresPMG.verde;
      ctx.fillRect(0, 0, canvas.width, borderWidth);
      ctx.fillRect(0, 0, borderWidth, canvas.height);
      ctx.fillRect(canvas.width - borderWidth, 0, borderWidth, canvas.height);
      ctx.fillRect(0, canvas.height - borderWidth, canvas.width, borderWidth);

      const logo = new Image();
      logo.src = "/logo-pmg.png";
      await new Promise((resolve) => {
        logo.onload = () => {
          const logoMaxWidth = 280;
          const aspectRatio = logo.naturalWidth / logo.naturalHeight;
          const logoWidth = Math.min(logoMaxWidth, logo.naturalWidth);
          const logoHeightCalc = logoWidth / aspectRatio;
          ctx.drawImage(logo, canvas.width / 2 - logoWidth / 2, borderWidth + 5, logoWidth, logoHeightCalc);
          resolve();
        };
        logo.onerror = resolve;
      });

      for (let i = 0; i < produtosSelecionados.length; i++) {
        const produto = produtosSelecionados[i];
        const linha = Math.floor(i / produtosPorLinha);
        const coluna = i % produtosPorLinha;
        const x = borderWidth + padding + coluna * (larguraProduto + padding);
        const y = borderWidth + margemTopo + linha * (alturaProduto + padding);

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

        ctx.strokeStyle = coresPMG.borda;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, larguraProduto, alturaProduto, 12);
        ctx.stroke();

        const imgArea = { x: x + 15, y: y + 15, width: larguraProduto - 30, height: alturaProduto * 0.62 };
        const imgProduto = new Image();
        imgProduto.crossOrigin = "anonymous";
        imgProduto.src = produto.image;

        try {
          await new Promise((resolve, reject) => {
            imgProduto.onload = resolve;
            imgProduto.onerror = reject;
          });
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(imgArea.x + 2, imgArea.y + 2, imgArea.width - 4, imgArea.height - 4, 6);
          ctx.clip();
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
          ctx.fillStyle = coresPMG.overlay;
          ctx.fillRect(imgArea.x + 2, imgArea.y + 2, imgArea.width - 4, imgArea.height - 4);
        } catch {
          ctx.fillStyle = "#FAFAFA";
          ctx.beginPath();
          ctx.roundRect(imgArea.x + 2, imgArea.y + 2, imgArea.width - 4, imgArea.height - 4, 6);
          ctx.fill();
          ctx.fillStyle = coresPMG.textoClaro;
          ctx.font = "italic 22px 'Open Sans', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Imagem não disponível", imgArea.x + imgArea.width / 2, imgArea.y + imgArea.height / 2);
        }

        ctx.fillStyle = coresPMG.texto;
        ctx.font = "500 24px 'Open Sans', sans-serif";
        ctx.textAlign = "center";
        const maxTextWidth = larguraProduto * 0.85;
        const nomeLines = quebrarTexto(ctx, produto.name, maxTextWidth);
        const nomeBaseY = y + imgArea.height + 40;
        nomeLines.slice(0, 2).forEach((line, idx) => {
          ctx.fillText(line, x + larguraProduto / 2, nomeBaseY + idx * 30);
        });

        const priceTagWidth = larguraProduto * 0.7;
        const priceTagX = x + (larguraProduto - priceTagWidth) / 2;
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = coresPMG.vermelho;
        ctx.beginPath();
        ctx.roundRect(priceTagX, y + alturaProduto * 0.78, priceTagWidth, 50, 25);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = coresPMG.amarelo;
        ctx.font = "bold 38px 'Montserrat', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(formatarPreco(produto.price), x + larguraProduto / 2, y + alturaProduto * 0.78 + 33);
        ctx.restore();

        if (produto.unit && produto.unit !== "undefined") {
          ctx.fillStyle = coresPMG.vermelho;
          ctx.font = "18px 'Open Sans', sans-serif";
          ctx.fillText(`por ${produto.unit.toLowerCase()}`, x + larguraProduto / 2, y + alturaProduto * 0.88);
        }
      }

      ctx.fillStyle = coresPMG.verde;
      ctx.fillRect(0, canvas.height - 70, canvas.width, 70);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "600 18px 'Open Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("OFERTAS DO DIA PMG", canvas.width / 2, canvas.height - 40);
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "14px 'Open Sans', sans-serif";
      ctx.fillText(`Validade: ${new Date().toLocaleDateString('pt-BR')} | pedido minimo R$ 900`, canvas.width / 2, canvas.height - 15);

      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          alert("✅ Encarte copiado com sucesso! Cole no Canva (Ctrl+V)");
        } catch (err) {
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

  // ============================================
  // FUNÇÃO COM IA - NANO BANANA 2
  // ============================================
  const gerarEncarteComIA = async () => {
    if (produtosSelecionados.length === 0) {
      alert("Selecione pelo menos um produto!");
      return;
    }

    if (!temaPromocao.trim()) {
      alert("Digite um tema para a promoção (ex: 'Churrasco na brasa', 'Festa junina', 'Bebidas geladas')");
      return;
    }

    setGerandoComIA(true);
    setProgressoIA(`🎨 Iniciando geração no formato ${formatoIA === 'story' ? 'Instagram Story (9:16)' : 'Banner (4:1)'}...`);

    try {
      const modoExibicao = formatoIA;
      const canvasWidth = modoExibicao === 'story' ? 1080 : 1200;
      const canvasHeight = modoExibicao === 'story' ? 1920 : 300;
      const produtosPorPagina = 4;
      const totalPaginas = Math.ceil(produtosSelecionados.length / produtosPorPagina);
      
      const padding = 30;
      const borderWidth = 8;
      const logoHeight = 80;
      const tituloAltura = 120;
      const margemTopo = logoHeight + tituloAltura + 20;
      const larguraProduto = modoExibicao === 'story' ? 480 : 280;
      const alturaProduto = modoExibicao === 'story' ? 580 : 260;
      
      const imagensGeradas = [];

      for (let pagina = 0; pagina < totalPaginas; pagina++) {
        setProgressoIA(`🎨 Gerando página ${pagina + 1} de ${totalPaginas} - Fundo com IA...`);
        
        const produtosPagina = produtosSelecionados.slice(
          pagina * produtosPorPagina,
          (pagina + 1) * produtosPorPagina
        );

        const aspectRatio = modoExibicao === 'story' ? '9:16' : '4:1';
        
        setProgressoIA(`🖌️ Criando fundo com tema "${temaPromocao}" no formato ${aspectRatio}...`);
        
        const fundoResponse = await fetch('/api/gerar-fundo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tema: `${temaPromocao} - estilo moderno, vibrante, com texturas e elementos decorativos relacionados ao tema, fundo profissional para encarte de supermercado`,
            largura: canvasWidth,
            altura: canvasHeight,
            aspectRatio: aspectRatio
          })
        });
        
        const fundo = await fundoResponse.json();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        setProgressoIA(`🎨 Desenhando fundo gerado pela IA...`);

        if (fundo.success && fundo.imageUrl) {
          const fundoImage = new Image();
          fundoImage.crossOrigin = "anonymous";
          
          await new Promise((resolve) => {
            fundoImage.onload = () => {
              ctx.drawImage(fundoImage, 0, 0, canvasWidth, canvasHeight);
              resolve();
            };
            fundoImage.onerror = () => {
              const gradiente = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
              gradiente.addColorStop(0, "#095400");
              gradiente.addColorStop(1, "#1a8a00");
              ctx.fillStyle = gradiente;
              ctx.fillRect(0, 0, canvasWidth, canvasHeight);
              resolve();
            };
            fundoImage.src = fundo.imageUrl;
          });
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.strokeStyle = "#FFD600";
        ctx.lineWidth = 3;
        ctx.strokeRect(borderWidth, borderWidth, canvasWidth - borderWidth * 2, canvasHeight - borderWidth * 2);

        const logo = new Image();
        logo.src = "/logo-pmg.png";
        await new Promise((resolve) => {
          logo.onload = () => {
            const logoWidth = modoExibicao === 'story' ? 120 : 100;
            const aspectRatioLogo = logo.naturalWidth / logo.naturalHeight;
            const logoHeightCalc = logoWidth / aspectRatioLogo;
            ctx.drawImage(logo, canvasWidth / 2 - logoWidth / 2, borderWidth + 15, logoWidth, logoHeightCalc);
            resolve();
          };
          logo.onerror = resolve;
        });

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#FFFFFF";
        ctx.font = `bold ${modoExibicao === 'story' ? '42px' : '28px'} 'Montserrat', sans-serif`;
        ctx.textAlign = "center";
        
        const titulo = temaPromocao.toUpperCase();
        const linhasTitulo = quebrarTexto(ctx, titulo, canvasWidth - 100);
        linhasTitulo.slice(0, 2).forEach((linha, idx) => {
          ctx.fillText(linha, canvasWidth / 2, borderWidth + logoHeight + 20 + (idx * 50));
        });
        
        ctx.font = `${modoExibicao === 'story' ? '20px' : '16px'} 'Open Sans', sans-serif`;
        ctx.fillStyle = "#FFD600";
        ctx.fillText("OFERTAS IMPERDÍVEIS", canvasWidth / 2, borderWidth + logoHeight + (linhasTitulo.length * 50) + 30);

        const produtosPorLinha = modoExibicao === 'story' ? 2 : 4;
        
        for (let i = 0; i < produtosPagina.length; i++) {
          const produto = produtosPagina[i];
          const linha = Math.floor(i / produtosPorLinha);
          const coluna = i % produtosPorLinha;
          
          const espacamentoX = (canvasWidth - (produtosPorLinha * larguraProduto)) / (produtosPorLinha + 1);
          const espacamentoY = 40;
          
          const x = espacamentoX + coluna * (larguraProduto + espacamentoX);
          const y = margemTopo + (linha * (alturaProduto + espacamentoY)) + (linhasTitulo.length * 15);

          ctx.save();
          ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.roundRect(x, y, larguraProduto, alturaProduto, 20);
          ctx.fill();
          ctx.restore();
          
          ctx.strokeStyle = "#FFD600";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(x, y, larguraProduto, alturaProduto, 20);
          ctx.stroke();

          const imgArea = {
            x: x + 15,
            y: y + 15,
            width: larguraProduto - 30,
            height: modoExibicao === 'story' ? alturaProduto * 0.55 : alturaProduto * 0.5,
          };

          const imgProduto = new Image();
          imgProduto.crossOrigin = "anonymous";
          imgProduto.src = produto.image;

          try {
            await new Promise((resolve, reject) => {
              imgProduto.onload = resolve;
              imgProduto.onerror = reject;
            });

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(imgArea.x, imgArea.y, imgArea.width, imgArea.height, 12);
            ctx.clip();

            const aspect = imgProduto.width / imgProduto.height;
            let drawWidth, drawHeight, drawX, drawY;

            if (aspect > imgArea.width / imgArea.height) {
              drawWidth = imgArea.width;
              drawHeight = drawWidth / aspect;
              drawX = imgArea.x;
              drawY = imgArea.y + (imgArea.height - drawHeight) / 2;
            } else {
              drawHeight = imgArea.height;
              drawWidth = drawHeight * aspect;
              drawX = imgArea.x + (imgArea.width - drawWidth) / 2;
              drawY = imgArea.y;
            }

            ctx.drawImage(imgProduto, drawX, drawY, drawWidth, drawHeight);
            ctx.restore();
          } catch {
            ctx.fillStyle = "#F5F5F5";
            ctx.beginPath();
            ctx.roundRect(imgArea.x, imgArea.y, imgArea.width, imgArea.height, 12);
            ctx.fill();
            ctx.fillStyle = "#999";
            ctx.font = "24px 'Open Sans', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("📷", imgArea.x + imgArea.width / 2, imgArea.y + imgArea.height / 2);
          }

          ctx.shadowBlur = 0;
          ctx.fillStyle = "#1a1a1a";
          ctx.font = `bold ${modoExibicao === 'story' ? '20px' : '16px'} 'Open Sans', sans-serif`;
          ctx.textAlign = "center";
          
          const maxTextWidth = larguraProduto * 0.85;
          const nomeLines = quebrarTexto(ctx, produto.name, maxTextWidth);
          const nomeBaseY = y + imgArea.height + (modoExibicao === 'story' ? 35 : 30);
          
          nomeLines.slice(0, 2).forEach((line, idx) => {
            ctx.fillText(line, x + larguraProduto / 2, nomeBaseY + idx * 24);
          });

          const priceTagY = y + alturaProduto * 0.78;
          const priceTagWidth = larguraProduto * 0.75;
          const priceTagX = x + (larguraProduto - priceTagWidth) / 2;
          const priceTagHeight = modoExibicao === 'story' ? 58 : 48;
          
          ctx.fillStyle = "#E53935";
          ctx.beginPath();
          ctx.roundRect(priceTagX, priceTagY, priceTagWidth, priceTagHeight, priceTagHeight / 2);
          ctx.fill();
          
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;
          
          ctx.fillStyle = "#FFEB3B";
          ctx.font = `bold ${modoExibicao === 'story' ? '38px' : '32px'} 'Montserrat', sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(formatarPreco(produto.price), x + larguraProduto / 2, priceTagY + (modoExibicao === 'story' ? 42 : 35));
          
          ctx.shadowBlur = 0;

          if (produto.unit && produto.unit !== "undefined") {
            const unitText = `${produto.unit.toLowerCase()}`;
            const unitY = y + alturaProduto * 0.89;
            const unitWidth = ctx.measureText(unitText).width + 20;
            const unitX = x + (larguraProduto - unitWidth) / 2;
            
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.roundRect(unitX, unitY - 14, unitWidth, 22, 11);
            ctx.fill();
            
            ctx.fillStyle = "#E53935";
            ctx.font = `bold ${modoExibicao === 'story' ? '16px' : '14px'} 'Open Sans', sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText(unitText, x + larguraProduto / 2, unitY);
          }
        }

        ctx.shadowBlur = 0;
        const rodapeY = canvasHeight - (modoExibicao === 'story' ? 80 : 60);
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, rodapeY, canvasWidth, modoExibicao === 'story' ? 80 : 60);
        
        ctx.fillStyle = "#FFEB3B";
        ctx.font = `bold ${modoExibicao === 'story' ? '20px' : '16px'} 'Open Sans', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("📞 FAÇA SEU PEDIDO", canvasWidth / 2, rodapeY + 30);
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = `${modoExibicao === 'story' ? '14px' : '12px'} 'Open Sans', sans-serif`;
        ctx.fillText(`Pedido mínimo R$ 900 | ${new Date().toLocaleDateString('pt-BR')}`, canvasWidth / 2, rodapeY + 55);

        setProgressoIA(`💾 Salvando página ${pagina + 1}...`);
        
        const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png", 0.95));
        imagensGeradas.push(blob);
      }

      setProgressoIA(`✅ Finalizando...`);

      if (imagensGeradas.length === 1) {
        const link = document.createElement("a");
        link.download = `encarte-ia-${formatoIA}-${new Date().toISOString().split("T")[0]}.png`;
        link.href = URL.createObjectURL(imagensGeradas[0]);
        link.click();
        URL.revokeObjectURL(link.href);
        
        alert(`✅ Encarte ${formatoIA === 'story' ? 'Instagram Story (9:16)' : 'Banner (4:1)'} gerado!\nTema: "${temaPromocao}" - Arquivo salvo!`);
      } else {
        imagensGeradas.forEach((blob, index) => {
          const link = document.createElement("a");
          link.download = `encarte-ia-${formatoIA}-pagina-${index + 1}-${new Date().toISOString().split("T")[0]}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        });
        alert(`✅ ${imagensGeradas.length} páginas geradas no formato ${formatoIA === 'story' ? 'Story (9:16)' : 'Banner (4:1)'}!\nTema: "${temaPromocao}"`);
      }

    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro ao gerar encarte com IA. Verifique o console.");
    } finally {
      setGerandoComIA(false);
      setProgressoIA('');
    }
  };

  // ============================================
  // FUNÇÕES AUXILIARES
  // ============================================
  
  function formatarPreco(preco) {
    const numero = typeof preco === "string" ? parseFloat(preco.replace(",", ".")) : preco;
    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
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

  const dataAtual = new Date().toLocaleDateString('pt-BR');
  
  let texto = `🏷️ *${temaPromocao.toUpperCase()}* 🏷️\n`;
  texto += `📅 ${dataAtual}\n\n`;
  
  produtosSelecionados.forEach((produto, index) => {
    const unidade = produto.unit.toLowerCase();
    let unidadeTexto = '';
    
    if (unidade === 'cx') unidadeTexto = 'caixa';
    else if (unidade === 'fd') unidadeTexto = 'fardo';
    else if (unidade === 'kg') unidadeTexto = 'kg';
    else if (unidade === 'un') unidadeTexto = 'unidade';
    else unidadeTexto = unidade;
    
    texto += `${index + 1}️⃣ *${produto.name}*\n`;
    texto += `💰 ${produto.formattedPrice} / ${unidadeTexto}\n\n`;
  });
  
  texto += `⏰ *OFERTA VÁLIDA APENAS HOJE (${dataAtual})*\n`;
  texto += `📞 *FAÇA SEU PEDIDO:* (31) 99999-9999\n`;
  texto += `🚚 Entregamos em toda região!`;
  
  // Usa textarea para copiar
  const textarea = document.createElement('textarea');
  textarea.value = texto;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '1px';
  textarea.style.height = '1px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  
  alert('✅ Texto copiado!');
};

// Função para gerar texto simples (fallback) com cálculo correto
function gerarTextoSimples(produtos, tema) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  
  let texto = `🏷️ *${tema.toUpperCase()}* 🏷️\n`;
  texto += `📅 ${dataAtual}\n\n`;
  
  produtos.forEach((produto, index) => {
    const unidade = produto.unit.toLowerCase();
    let unidadeTexto = '';
    let valorUnitario = null;
    let unidadeUnitario = '';
    
    // Extrai quantidade e tipo do nome do produto
    let quantidade = null;
    let tipoQuantidade = '';
    
    // Procura padrões como (CX 12 UN), (FDO 6 PCT), (CX 10 PCT)
    // Padrão: (CX 12 UN) ou (CX 10 PCT) ou (FDO 6 PCT)
    const match = produto.name.match(/\([A-Z]+\s+(\d+)\s+(UN|PCT|KG|PACOTE)/i);
    if (match) {
      quantidade = parseInt(match[1]);
      tipoQuantidade = match[2].toUpperCase();
    }
    
    if (unidade === 'cx') {
      unidadeTexto = 'caixa';
      if (quantidade) {
        valorUnitario = produto.price / quantidade;
        // Define o que mostrar baseado no tipo
        if (tipoQuantidade === 'UN') {
          unidadeUnitario = 'unidade';
        } else if (tipoQuantidade === 'PCT' || tipoQuantidade === 'PACOTE') {
          unidadeUnitario = 'pacote';
        } else if (tipoQuantidade === 'KG') {
          unidadeUnitario = 'kg';
        }
      }
    } 
    else if (unidade === 'fd') {
      unidadeTexto = 'fardo';
      if (quantidade && (tipoQuantidade === 'PCT' || tipoQuantidade === 'PACOTE')) {
        valorUnitario = produto.price / quantidade;
        unidadeUnitario = 'pacote';
      }
    }
    else if (unidade === 'kg') {
      unidadeTexto = 'kg';
    }
    else if (unidade === 'un') {
      unidadeTexto = 'unidade';
    }
    else {
      unidadeTexto = unidade;
    }
    
    // Monta a linha do produto
    texto += `${index + 1}️⃣ *${produto.name}*\n`;
    
    if (valorUnitario && unidadeUnitario) {
      texto += `   💰 ${produto.formattedPrice} / ${unidadeTexto} (≈ ${formatarPreco(valorUnitario)} / ${unidadeUnitario})\n\n`;
    } else {
      texto += `   💰 ${produto.formattedPrice} / ${unidadeTexto}\n\n`;
    }
  });
  
  texto += `⏰ *OFERTA VÁLIDA APENAS HOJE (${dataAtual})*\n`;
  texto += `📞 *FAÇA SEU PEDIDO:* (31) 99999-9999\n`;
  texto += `🚚 Entregamos em toda região!`;
  
  return texto;
}

// Função para copiar texto com IA - CORRIGIDA (sem overlay bloqueando)
const copiarTextoComIA = async () => {
  if (produtosSelecionados.length === 0) {
    alert("Selecione pelo menos um produto!");
    return;
  }

  if (!temaPromocao.trim()) {
    alert("Digite um tema para a promoção antes de gerar o texto!");
    return;
  }

  // Não mostra overlay para não bloquear o foco
  setCopiandoTextoIA(true);

  try {
    const response = await fetch('/api/gerar-texto-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        produtos: produtosSelecionados,
        temaPromocao: temaPromocao
      })
    });

    const data = await response.json();
    
    let textoParaCopiar = '';
    
    if (data.success && data.texto && data.texto.length > 50) {
      textoParaCopiar = data.texto;
    } else {
      textoParaCopiar = gerarTextoSimples(produtosSelecionados, temaPromocao);
    }
    
    // Fecha o loading ANTES de copiar
    setCopiandoTextoIA(false);
    
    // Delay curto para garantir que o estado mudou
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Usa textarea (funciona SEMPRE)
    const textarea = document.createElement('textarea');
    textarea.value = textoParaCopiar;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    const sucesso = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (sucesso) {
      alert(`✅ Texto promocional copiado!\n\nTema: "${temaPromocao}"\nProdutos: ${produtosSelecionados.length} itens`);
    } else {
      throw new Error('Falha ao copiar');
    }
    
  } catch (error) {
    console.error('Erro:', error);
    setCopiandoTextoIA(false);
    
    // Fallback: mostra o texto para copiar manualmente
    const textoFallback = gerarTextoSimples(produtosSelecionados, temaPromocao);
    
    // Cria um popup com o texto
    const popup = window.open('', '_blank', 'width=500,height=400');
    if (popup) {
      popup.document.write(`
        <html>
          <head><title>Texto Promocional</title></head>
          <body style="font-family: monospace; padding: 20px;">
            <h3>Copie o texto abaixo:</h3>
            <textarea style="width:100%; height:300px;" id="texto" readonly>${textoFallback}</textarea>
            <br><br>
            <button onclick="copyText()">Copiar</button>
            <script>
              function copyText() {
                const textarea = document.getElementById('texto');
                textarea.select();
                document.execCommand('copy');
                alert('Texto copiado!');
              }
            <\/script>
          </body>
        </html>
      `);
    } else {
      alert(`📝 Copie manualmente:\n\n${textoFallback}`);
    }
  }
};

  const PriceBandSelector = () => (
    <select 
      value={priceBand}
      onChange={(e) => setPriceBand(e.target.value)}
      style={{
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #095400',
        backgroundColor: 'white',
        color: '#095400',
        fontWeight: 'bold',
        marginRight: '10px'
      }}
    >
      <option value="retira">Retira</option>
      <option value="entrega">Entrega</option>
      <option value="km100_199">100-199 km</option>
      <option value="km200_299">200-299 km</option>
      <option value="km300_399">300-399 km</option>
      <option value="km400_499">400-499 km</option>
      <option value="km500_599">500-599 km</option>
      <option value="km600_plus">Acima 600 km</option>
    </select>
  );

  // Adiciona roundRect se não existir
  if (typeof window !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.moveTo(x+r, y);
      this.lineTo(x+w-r, y);
      this.quadraticCurveTo(x+w, y, x+w, y+r);
      this.lineTo(x+w, y+h-r);
      this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
      this.lineTo(x+r, y+h);
      this.quadraticCurveTo(x, y+h, x, y+h-r);
      this.lineTo(x, y+r);
      this.quadraticCurveTo(x, y, x+r, y);
      return this;
    };
  }

  if (!acessoPermitido) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h2 style={{ color: coresPMG.primaria }}>🔒 ACESSO RESTRITO</h2>
          <p style={styles.authText}>Gerador de encartes PMG</p>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite a senha" style={styles.authInput} />
          <button onClick={() => verificarSenha()} style={styles.authButton}>ENTRAR</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Gerador de Encartes - PMG</title></Head>
      <div style={{ ...styles.container, backgroundColor: coresPMG.fundo }}>
        <header style={styles.header}>
          <h1 style={styles.title}>GERADOR DE ENCARTES</h1>
          <div style={styles.pmgLogo}>PMG</div>
        </header>

        <div style={styles.controls}>
          <PriceBandSelector />
          
          <div style={styles.modoContainer}>
            <button onClick={() => setUsarIA(false)} style={{ ...styles.modoButton, backgroundColor: !usarIA ? coresPMG.primaria : '#ccc', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
              📄 MODO CLÁSSICO
            </button>
            <button onClick={() => setUsarIA(true)} style={{ ...styles.modoButton, backgroundColor: usarIA ? coresPMG.secundaria : '#ccc', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
              ✨ MODO IA
            </button>
          </div>

          {usarIA && (
            <>
              <select value={formatoIA} onChange={(e) => setFormatoIA(e.target.value)} style={styles.formatoSelect}>
                <option value="story">📱 Instagram Story (9:16)</option>
                <option value="banner">🖼️ Banner (4:1)</option>
              </select>
              <input type="text" placeholder="🎨 Tema da promoção (ex: Churrasco na brasa, Festa junina...)" value={temaPromocao} onChange={(e) => setTemaPromocao(e.target.value)} style={styles.temaInput} />
            </>
          )}
          
          <button onClick={() => { setModoSelecao(!modoSelecao); setBusca(''); setCurrentPage(1); }} style={{ ...styles.button, backgroundColor: modoSelecao ? coresPMG.secundaria : coresPMG.primaria }}>
            {modoSelecao ? 'SAIR DA SELEÇÃO' : 'SELECIONAR MÚLTIPLOS'}
          </button>

          <input type="file" accept=".xlsx, .xls" onChange={(e) => { const file = e.target.files[0]; if (file) carregarExcel(file); }} style={{ display: 'none' }} id="excel-input" />
          <label htmlFor="excel-input" style={{ ...styles.button, backgroundColor: coresPMG.primaria, cursor: 'pointer' }}>CARREGAR EXCEL</label>

          {modoSelecao && (
            <>
              <input type="text" placeholder="Pesquisar produto..." value={busca} onChange={(e) => { setBusca(e.target.value); setCurrentPage(1); }} style={styles.searchInput} />
              <button onClick={selecionarTodos} style={{ ...styles.button, backgroundColor: coresPMG.primaria }}>SELECIONAR TUDO</button>
              <button onClick={desmarcarTodos} style={{ ...styles.button, backgroundColor: coresPMG.secundaria }}>DESMARCAR TUDO</button>
              <span style={styles.selectedCount}>{produtosSelecionados.length} selecionados</span>
            </>
          )}
        </div>

        {isLoading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingSpinner}></div>
            <p>Processando arquivo Excel...</p>
          </div>
        )}

        <div style={styles.productsGrid}>
          {currentProducts.map(produto => (
            <div key={produto.id} style={{ ...styles.productCard, borderColor: produtosSelecionados.some(p => p.id === produto.id) ? coresPMG.secundaria : '#ddd' }} onClick={() => modoSelecao && toggleSelecionarProduto(produto)}>
              <div style={styles.productImageContainer}>
                <img src={produto.image || '/placeholder.png'} alt={produto.name} style={styles.productImage} onError={(e) => e.target.src = '/placeholder.png'} />
              </div>
              <h3 style={styles.productName}>{produto.name}</h3>
              <p style={styles.productPrice}>{produto.formattedPrice}</p>
              <p style={styles.productUnit}>{produto.unit}</p>
              {!modoSelecao && (
                <button onClick={(e) => { e.stopPropagation(); toggleSelecionarProduto(produto); gerarEncarteVisual([produto]); }} style={styles.singleProductButton}>GERAR OFERTA</button>
              )}
            </div>
          ))}
        </div>

        {produtosFiltrados.length > productsPerPage && (
          <div style={styles.pagination}>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ ...styles.pageButton, ...(currentPage === 1 && { cursor: 'not-allowed', opacity: 0.5 }) }}>Anterior</button>
            <span style={styles.pageInfo}>Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ ...styles.pageButton, ...(currentPage === totalPages && { cursor: 'not-allowed', opacity: 0.5 }) }}>Próxima</button>
          </div>
        )}

        {modoSelecao && produtosSelecionados.length > 0 && (
          <div style={styles.footerActions}>
            <button onClick={copiarTextoOfertas} style={{ ...styles.actionButton, backgroundColor: coresPMG.primaria }}>
              COPIAR TEXTO
            </button>
            
            {usarIA && (
              <button onClick={copiarTextoComIA} style={{ ...styles.actionButton, backgroundColor: "#8B5CF6" }} disabled={copiandoTextoIA}>
                {copiandoTextoIA ? '🤖 GERANDO...' : '🤖 COPIAR TEXTO COM IA'}
              </button>
            )}
            
            <button onClick={usarIA ? gerarEncarteComIA : gerarEncarteVisual} style={{ ...styles.actionButton, backgroundColor: coresPMG.secundaria }} disabled={gerandoComIA}>
              {gerandoComIA ? '🎨 GERANDO...' : (usarIA ? '✨ GERAR ENCARTE COM IA' : '📄 GERAR ENCARTE')}
            </button>
          </div>
        )}
      </div>

      {gerandoComIA && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner}></div>
          <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', maxWidth: '80%' }}>{progressoIA}</p>
          <p style={{ fontSize: '12px', marginTop: '20px', opacity: 0.7 }}>Aguardando IA gerar fundo personalizado... (10-20 segundos)</p>
          <div style={{ marginTop: '20px', width: '300px', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#ff0000', animation: 'loading 1.5s ease-in-out infinite' }} />
          </div>
          <style>{`
            @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

const styles = {
  authContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' },
  authBox: { background: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%' },
  authText: { color: '#666', marginBottom: '20px' },
  authInput: { width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' },
  authButton: { background: '#ff0000', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' },
  container: { minHeight: '100vh', padding: '20px', paddingBottom: '100px', position: 'relative' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #ff0000' },
  title: { color: '#ff0000', fontSize: '24px', margin: 0 },
  pmgLogo: { background: '#095400', color: 'white', padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold', fontSize: '18px' },
  controls: { display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' },
  modoContainer: { display: 'flex', gap: '0' },
  modoButton: { padding: '10px 15px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s ease' },
  formatoSelect: { padding: '10px', borderRadius: '5px', border: '1px solid #095400', backgroundColor: 'white', color: '#095400', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
  temaInput: { flex: 1, minWidth: '250px', padding: '10px', borderRadius: '5px', border: '1px solid #095400', fontSize: '14px' },
  button: { padding: '10px 15px', borderRadius: '5px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
  searchInput: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minWidth: '200px' },
  selectedCount: { background: '#ff0000', color: 'white', padding: '8px 12px', borderRadius: '20px', fontSize: '14px' },
  productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  productCard: { background: '#fff', borderRadius: '8px', padding: '15px', border: '2px solid #ddd', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative' },
  productImageContainer: { width: '100%', height: '180px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: '5px', marginBottom: '15px' },
  productImage: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  productName: { fontSize: '16px', margin: '0 0 10px 0', color: '#333', fontWeight: '600', minHeight: '40px' },
  productPrice: { fontSize: '18px', fontWeight: 'bold', color: '#ff0000', margin: '10px 0' },
  productUnit: { fontSize: '14px', color: '#666', margin: '5px 0' },
  singleProductButton: { background: '#ff0000', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontSize: '14px' },
  footerActions: { position: 'fixed', bottom: '0', left: '0', right: '0', background: '#fff', padding: '15px', display: 'flex', justifyContent: 'center', gap: '20px', boxShadow: '0 -4px 10px rgba(0,0,0,0.1)' },
  actionButton: { padding: '12px 25px', borderRadius: '5px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '10px' },
  pageButton: { padding: '8px 16px', border: '1px solid #095400', backgroundColor: '#fff', color: '#095400', borderRadius: '4px', cursor: 'pointer' },
  pageInfo: { margin: '0 10px' },
  loadingOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1000, color: 'white' },
  loadingSpinner: { border: '5px solid rgba(255,255,255,0.3)', borderTop: '5px solid #ff0000', borderRadius: '50%', width: '60px', height: '60px', animation: 'spin 1s linear infinite', marginBottom: '20px' },
};

// Adiciona keyframes globalmente
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}
