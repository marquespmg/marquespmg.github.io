// pages/api/ebook/download.js
import fs from 'fs';
import path from 'path';
import { ebooks } from '../../../data/ebooks';

export default function handler(req, res) {
  const { slug } = req.query;
  const ebook = ebooks.find((e) => e.slug === slug);

  if (!ebook) {
    return res.status(404).json({ error: 'Ebook não encontrado' });
  }

  const filePath = path.join(process.cwd(), 'public', 'ebook', ebook.arquivo);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo indisponível' });
  }

  const fileBuffer = fs.readFileSync(filePath);

  res.setHeader('Content-Type', 'application/pdf');
  // ⬇️ Força o download com o nome bonito
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${ebook.arquivo}"`
  );
  res.setHeader('Content-Length', fileBuffer.length);
  res.setHeader('Cache-Control', 'public, max-age=3600');

  return res.send(fileBuffer);
}