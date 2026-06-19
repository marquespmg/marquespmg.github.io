// lib/articles.js
import fs from 'fs';
import path from 'path';

// Caminho da pasta de artigos
const articlesDirectory = path.join(process.cwd(), 'articles');

// Função para listar todos os slugs (nomes dos arquivos)
export function getAllArticleSlugs() {
  const fileNames = fs.readdirSync(articlesDirectory);
  return fileNames.map(fileName => {
    return {
      params: {
        slug: fileName.replace(/\.json$/, '')
      }
    };
  });
}

// Função para buscar um artigo pelo slug
export function getArticleBySlug(slug) {
  const fullPath = path.join(articlesDirectory, `${slug}.json`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}

// Função para buscar todos os artigos (para o índice)
export function getAllArticles() {
  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticles = fileNames.map(fileName => {
    const slug = fileName.replace(/\.json$/, '');
    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const article = JSON.parse(fileContents);
    return {
      ...article,
      slug
    };
  });
  
  // Ordenar por ID
  return allArticles.sort((a, b) => a.id - b.id);
}

// Função para buscar artigos em lote (para páginas específicas)
export function getArticlesByIds(ids) {
  const allArticles = getAllArticles();
  return allArticles.filter(article => ids.includes(article.id));
}