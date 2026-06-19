// lib/articles.js

// 🔥 IMPORTANTE: Esta função agora é ASSÍNCRONA e usa fetch
export async function getAllArticles() {
  try {
    const response = await fetch('/index.json');
    if (!response.ok) {
      console.error('❌ Erro ao carregar index.json');
      return [];
    }
    const articles = await response.json();
    return articles;
  } catch (error) {
    console.error('❌ Erro ao carregar artigos:', error);
    return [];
  }
}

// Busca um artigo pelo slug
export async function getArticleBySlug(slug) {
  const articles = await getAllArticles();
  return articles.find(article => {
    const articleSlug = gerarSlug(article.title);
    return articleSlug === slug;
  });
}

// Função para gerar slug (igual à do food-news.js)
function gerarSlug(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .substring(0, 80);
}
