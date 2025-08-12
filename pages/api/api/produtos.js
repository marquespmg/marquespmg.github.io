import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Caminho para o arquivo produtos.json na pasta public
    const filePath = path.join(process.cwd(), 'public', 'produtos.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const produtosData = JSON.parse(fileContents);
    
    return res.status(200).json(produtosData);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return res.status(500).json({ 
      error: 'Erro ao carregar produtos',
      details: error.message
    });
  }
}