import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

function previewSite(port = 3000) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.join(__dirname, '..', 'dist');

  const app = express();
  app.use(express.static(distPath));
  app.listen(port, () => {
    console.log(`🚀 Preview running at http://localhost:${port}`);
  });
}

export { previewSite };