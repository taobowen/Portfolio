import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { marked } from 'marked';
import { fileURLToPath } from 'url';

function injectSettings(html, settings) {
  return html
    .replace(/<title>.*<\/title>/, `<title>${settings.title || ''}</title>`)
    .replace(
      '</head>',
      `${settings.favicon ? `<link rel="icon" href="${settings.favicon}">` : ''}</head>`
    );
}

function copyLocalImages(markdown, srcDir, destDir, assetPrefix = '') {
  const imageRegex = /!\[[^\]]*\]\((.*?)\)/g;
  const copiedMap = new Map();

  let match;
  while ((match = imageRegex.exec(markdown)) !== null) {
    const imagePath = match[1];
    if (!imagePath.startsWith('http') && !copiedMap.has(imagePath)) {
      const absSource = path.resolve(srcDir, imagePath);
      const absTarget = path.resolve(destDir, imagePath);
      if (fs.existsSync(absSource)) {
        fse.ensureDirSync(path.dirname(absTarget));
        fs.copyFileSync(absSource, absTarget);
        copiedMap.set(imagePath, true);
      }
    }
  }

  return markdown.replace(imageRegex, (full, imgPath) => {
    if (imgPath.startsWith('http')) return full;
    return full.replace(imgPath, path.join(assetPrefix, imgPath));
  });
}

function renderAboutPage(workDir, buildDir) {
  const aboutPath = path.join(workDir, 'about.md');
  const pagesDir = path.join(buildDir, 'pages');
  const assetsDir = path.join(buildDir, 'assets', 'about');
  fse.ensureDirSync(pagesDir);

  if (!fs.existsSync(aboutPath)) return;

  const markdown = fs.readFileSync(aboutPath, 'utf-8');
  const updatedMarkdown = copyLocalImages(markdown, path.dirname(aboutPath), assetsDir, '/assets/about');
  const htmlContent = marked.parse(updatedMarkdown);

  const componentContent = `
import React from 'react';

export default function About() {
  return (
    <div className="about-markdown" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(htmlContent)} }} />
  );
}`;

  fs.writeFileSync(path.join(pagesDir, `About.js`), componentContent, 'utf-8');
}

function renderMarkdownPages(docDir, buildDir) {
  const pagesDir = path.join(buildDir, 'pages');
  const coversDir = path.join(buildDir, 'covers');
  const metaFile = path.join(buildDir, 'rawList.json');
  const metadataList = [];
  const pageMapImports = [];
  const pageMapEntries = [];

  fse.ensureDirSync(pagesDir);
  fse.ensureDirSync(coversDir);

  const folders = fs.readdirSync(docDir).filter(folder =>
    fs.lstatSync(path.join(docDir, folder)).isDirectory()
  );

  folders.forEach(folder => {
    const folderPath = path.join(docDir, folder);
    const mdPath = path.join(folderPath, 'index.md');
    if (!fs.existsSync(mdPath)) return;

    let markdown = fs.readFileSync(mdPath, 'utf-8');

    const metaMatch = markdown.match(/---([\s\S]*?)---/);
    const meta = {
      title: folder,
      description: '',
      category: '',
      createDate: '',
      updateDate: ''
    };
    if (metaMatch) {
      const lines = metaMatch[1].split('\n').map(l => l.trim()).filter(Boolean);
      lines.forEach(line => {
        const [key, ...rest] = line.split(':');
        if (key && rest.length) meta[key.trim()] = rest.join(':').trim();
      });
      markdown = markdown.replace(metaMatch[0], '').trim();
    }

    const assetsDir = path.join(buildDir, 'assets', folder);
    markdown = copyLocalImages(markdown, folderPath, assetsDir, `/assets/${folder}`);

    const htmlContent =
      `<div style="padding: 9rem 4.5rem;"><h1>${meta.title}</h1><h2 style="color: #4a4a4a; font-weight: normal;">${meta.description}</h2></div>` +
      '<div style="padding: 0 4.5rem 4.5rem;">' + marked.parse(markdown) + '</div>';

    const componentName = folder
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/^(\d)/, '_$1')
      .replace(/(^\w|_\w)/g, m => m.replace('_', '').toUpperCase());

    const sourceCover = path.join(folderPath, 'index.png');
    let coverUrl = '';
    if (fs.existsSync(sourceCover)) {
      const destCover = path.join(coversDir, `${componentName}.png`);
      fs.copyFileSync(sourceCover, destCover);
      coverUrl = `./covers/${componentName}.png`;
    }

    metadataList.push({
      path: `/${componentName}`,
      coverUrl,
      ...meta
    });

    const componentContent = `
import React from 'react';

export default function ${componentName}() {
  return (
    <div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(htmlContent)} }} />
  );
}`;

    fs.writeFileSync(path.join(pagesDir, `${componentName}.js`), componentContent, 'utf-8');
    pageMapImports.push(`import ${componentName} from "./pages/${componentName}.js";`);
    pageMapEntries.push(`  "/${componentName}": ${componentName},`);
  });

  fs.writeFileSync(metaFile, JSON.stringify(metadataList, null, 2), 'utf-8');

  const pageMapContent = `${pageMapImports.join('\n')}

const pageMap = {
${pageMapEntries.join('\n')}
};

export default pageMap;
`;

  fs.writeFileSync(path.join(buildDir, 'pageMap.js'), pageMapContent, 'utf-8');
}

function generateSite(configPath) {
  const cwd = process.cwd();  // Current command execution path
  const __filename = fileURLToPath(import.meta.url); // path to current file
  const __dirname = path.dirname(__filename); 
  const buildDir = path.join(__dirname, '../', 'build');
  const docDir = path.join(cwd, 'doc');
  const libDir = __dirname;
  const templateDir = path.join(__dirname, 'template');

  if (fs.existsSync(buildDir)) {
    fse.removeSync(buildDir);
  }
  fse.ensureDirSync(buildDir);

  const config = JSON.parse(fs.readFileSync(path.join(libDir, configPath), 'utf-8'));

  fse.copySync(templateDir, buildDir);

  const indexPath = path.join(buildDir, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf-8');
  indexHtml = injectSettings(indexHtml, config);
  fs.writeFileSync(indexPath, indexHtml, 'utf-8');

  if (config.favicon && fs.existsSync(config.favicon)) {
    const destFavicon = path.join(buildDir, path.basename(config.favicon));
    fs.copyFileSync(config.favicon, destFavicon);
  }

  if (fs.existsSync(docDir) && fs.existsSync(libDir)) {
    renderMarkdownPages(docDir, buildDir);
    renderAboutPage(cwd, buildDir);
  }

  console.log(`✅ Portfolio site generated in ${buildDir}`);
}

export { generateSite };
