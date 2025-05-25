import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'produtos.json');
    const data = fs.readFileSync(filePath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro ao carregar produtos',
      details: error.message 
    });
  }
}
