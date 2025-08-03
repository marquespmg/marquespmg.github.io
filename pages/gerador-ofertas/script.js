// SENHA DE ACESSO (altere para uma senha forte)
const SENHA_CORRETA = "PMG@2024";

function verificarSenha() {
    const senhaDigitada = document.getElementById('senha').value;
    if (senhaDigitada === SENHA_CORRETA) {
        document.getElementById('auth-box').style.display = 'none';
        document.getElementById('gerador').style.display = 'block';
        iniciarGerador();
    } else {
        alert("Senha incorreta! Acesso negado.");
    }
}

async function iniciarGerador() {
    // Carrega os produtos
    const response = await fetch('produtos.json');
    const produtos = await response.json();
    
    // Cria a interface do gerador
    const gerador = document.getElementById('gerador');
    gerador.innerHTML = `
        <div class="controles">
            <button id="gerar-todos">Gerar Todas as Imagens</button>
            <button id="copiar-texto">Copiar Texto de Ofertas</button>
        </div>
        <div class="produtos-grid" id="produtos-grid"></div>
    `;
    
    // Exibe os produtos
    const grid = document.getElementById('produtos-grid');
    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <img src="${produto.image}" alt="${produto.name}" onerror="this.src='placeholder.png'">
            <h3>${produto.name}</h3>
            <p>${produto.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
            <button onclick="gerarImagem(${produto.id})">Gerar Imagem</button>
        `;
        grid.appendChild(card);
    });
    
    // Adiciona eventos
    document.getElementById('gerar-todos').addEventListener('click', () => {
        produtos.forEach(prod => gerarImagem(prod.id));
    });
    
    document.getElementById('copiar-texto').addEventListener('click', () => {
        gerarTextoOfertas(produtos);
    });
}

// Função para gerar imagem (implementação similar ao código anterior)
async function gerarImagem(produtoId) {
    // Implemente conforme mostrado anteriormente
    console.log(`Gerando imagem para produto ${produtoId}`);
}

// Função para gerar texto
function gerarTextoOfertas(produtos) {
    let texto = `🛍️ OFERTAS ESPECIAIS - MARQUES VENDAS\n\n`;
    
    produtos.forEach((prod, i) => {
        texto += `${i+1}. ${prod.name}\n   💰 ${prod.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}\n\n`;
    });
    
    texto += `📞 Entre em contato: (Seu telefone)\n🚛 Entregamos em toda região!`;
    
    navigator.clipboard.writeText(texto)
        .then(() => alert('Texto copiado para a área de transferência!'))
        .catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = texto;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Texto copiado!');
        });
}