import products from './produtos';

// Verifica se products é um array
if (!Array.isArray(products)) {
  console.error('Products não é um array:', products);
  // Fallback: array vazio para evitar erros
  const fallbackProducts = [];
}

// Função segura para buscar produtos por categoria
export const getProductsByCategory = (category) => {
  try {
    if (!Array.isArray(products)) {
      console.warn('Products não é um array, retornando array vazio');
      return [];
    }
    
    return products.filter(product => {
      // Verifica se o produto tem categoria
      if (!product || !product.category) return false;
      
      return product.category.toLowerCase() === category.toLowerCase();
    });
  } catch (error) {
    console.error('Erro em getProductsByCategory:', error);
    return [];
  }
};

// Função segura para buscar produtos por palavra-chave
export const getProductsByKeyword = (keyword) => {
  try {
    if (!Array.isArray(products)) {
      console.warn('Products não é um array, retornando array vazio');
      return [];
    }
    
    return products.filter(product => {
      if (!product || !product.name) return false;
      
      return product.name.toLowerCase().includes(keyword.toLowerCase());
    });
  } catch (error) {
    console.error('Erro em getProductsByKeyword:', error);
    return [];
  }
};

// Função segura para buscar produtos por IDs
export const getProductsByIds = (ids) => {
  try {
    if (!Array.isArray(products)) {
      console.warn('Products não é um array, retornando array vazio');
      return [];
    }
    
    return products.filter(product => {
      return product && ids.includes(product.id);
    });
  } catch (error) {
    console.error('Erro em getProductsByIds:', error);
    return [];
  }
};

// Função para produtos relacionados baseado no artigo
export const getRelatedProducts = (article) => {
  try {
    const { category, title } = article;
    
    console.log('Buscando produtos relacionados para:', { category, title });
    
    // Primeiro tenta pela categoria do artigo
    let related = getProductsByCategory(category);
    console.log(`Encontrados ${related.length} produtos na categoria ${category}`);
    
    // Se não encontrar, busca por palavras-chave no título
    if (related.length === 0) {
      const keywords = extractKeywords(title);
      console.log('Nenhum produto encontrado por categoria, tentando keywords:', keywords);
      
      related = keywords.flatMap(keyword => 
        getProductsByKeyword(keyword)
      ).slice(0, 4);
      
      console.log(`Encontrados ${related.length} produtos por keywords`);
    }
    
    // Remove duplicatas e limita a 4 produtos
    const uniqueProducts = [...new Map(related.map(item => [item.id, item])).values()].slice(0, 4);
    console.log(`Retornando ${uniqueProducts.length} produtos únicos`);
    
    return uniqueProducts;
  } catch (error) {
    console.error('Erro em getRelatedProducts:', error);
    return [];
  }
};

// Extrai palavras-chave do título do artigo
const extractKeywords = (title) => {
  const commonWords = ['para', 'com', 'como', 'seu', 'sua', 'os', 'as', 'um', 'uma', 'de', 'da', 'do'];
  return title
    .toLowerCase()
    .split(' ')
    .filter(word => 
      word.length > 3 && 
      !commonWords.includes(word) &&
      !word.includes('?') &&
      !word.includes('!')
    );
};

// Produtos em destaque
export const getFeaturedProducts = () => {
  try {
    if (!Array.isArray(products)) {
      console.warn('Products não é um array, retornando array vazio');
      return [];
    }
    
    const featured = products
      .filter(product => 
        product && (
          product.category === 'Derivados de Leite' || 
          product.category === 'Bebidas' ||
          product.category === 'Farináceos' ||
		  product.category === 'Salgados'
        )
      )
      .slice(0, 8);
    
    console.log(`Encontrados ${featured.length} produtos em destaque`);
    return featured;
  } catch (error) {
    console.error('Erro em getFeaturedProducts:', error);
    return [];
  }
};

// Função para debug - mostra quantos produtos temos
export const getProductsStats = () => {
  if (!Array.isArray(products)) {
    return { total: 0, categories: [] };
  }
  
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  return {
    total: products.length,
    categories: categories
  };
};
