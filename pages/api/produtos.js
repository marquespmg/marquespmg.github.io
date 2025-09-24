import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handler(req, res) {
  try {
    const filePath = join(__dirname, '../../public/produtos.json');
    const fileContents = readFileSync(filePath, 'utf8');
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
