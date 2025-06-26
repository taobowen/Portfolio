import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

function previewSite(port = 3000) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const buildPath = path.join(__dirname, '..', 'build');

  const app = express();
  app.use(express.static(buildPath));

  app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`🚀 Preview running at ${url}`);

    // Automatically open the browser
    let openCommand;
    if (process.platform === 'darwin') {
      openCommand = `open "${url}"`;
    } else if (process.platform === 'win32') {
      openCommand = `start "" "${url}"`; // "" handles window title
    } else {
      openCommand = `xdg-open "${url}"`;
    }

    exec(openCommand, (error) => {
      if (error) {
        console.error('❌ Failed to open browser automatically:', error.message);
        console.log(`🔗 Please open manually: ${url}`);
      } else {
        console.log('🌐 Site opened in your default browser');
      }
    });
  });
}

export { previewSite };
