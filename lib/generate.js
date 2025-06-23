import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { marked } from 'marked';

function injectSettings(html, settings) {
  return html
    .replace(/<title>.*<\/title>/, `<title>${settings.title || ''}</title>`)
    .replace(
      '</head>',
      `${settings.favicon ? `<link rel="icon" href="${settings.favicon}">` : ''}</head>`
    );
}

function renderAboutPage(libDir, buildDir) {
  const aboutPath = path.join(libDir, 'about.md');
  const pagesDir = path.join(buildDir, 'pages');
  fse.ensureDirSync(pagesDir);

  if (!fs.existsSync(aboutPath)) return;

  const markdown = fs.readFileSync(aboutPath, 'utf-8');
  const htmlContent = marked.parse(markdown);

  const componentContent = `
import React from 'react';

export default function About() {
  return (
    <div className="about-markdown" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(htmlContent)} }} />
  );
}
`;

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

    // Extract frontmatter metadata
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

    const htmlContent =
      `<div style="padding: 9rem 4.5rem;"><h1>${meta.title}</h1><h2 style="color: #4a4a4a; font-weight: normal;">${meta.description}</h2></div>` +
      '<div style="padding: 0 4.5rem 4.5rem;">' + marked.parse(markdown) + '</div>';

    const componentName = folder;

    // Copy index.png as cover image
    const sourceCover = path.join(folderPath, 'index.png');
    let coverUrl = '';
    if (fs.existsSync(sourceCover)) {
      const destCover = path.join(coversDir, `${componentName}.png`);
      fs.copyFileSync(sourceCover, destCover);
      coverUrl = `./covers/${componentName}.png`;
    }

    // Add to metadata list
    metadataList.push({
      path: `/${componentName}`,
      coverUrl,
      ...meta
    });

    // Write component file
    const componentContent = `
import React from 'react';

export default function ${componentName}() {
  return (
    <div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(htmlContent)} }} />
  );
}
`;
    fs.writeFileSync(path.join(pagesDir, `${componentName}.js`), componentContent, 'utf-8');

    // Prepare for pageMap
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

function getDirname(importMetaUrl) {
  return path.dirname(new URL(importMetaUrl).pathname);
}

function generateSite(configPath) {
  const __dirname = getDirname(import.meta.url);
  const rootDir = path.join(__dirname, '..');
  const buildDir = path.join(rootDir, 'build');
  const libDir = path.join(rootDir, 'lib');
  const docDir = path.join(libDir, 'doc');
  const templateDir = path.join(libDir, 'template');

  // Clean build dir
  if (fs.existsSync(buildDir)) {
    fse.removeSync(buildDir);
  }
  fse.ensureDirSync(buildDir);

  // Load settings
  const config = JSON.parse(fs.readFileSync(path.join(libDir, configPath), 'utf-8'));

  // Copy template
  fse.copySync(templateDir, buildDir);

  // Modify index.html
  const indexPath = path.join(buildDir, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf-8');
  indexHtml = injectSettings(indexHtml, config);
  fs.writeFileSync(indexPath, indexHtml, 'utf-8');

  // Copy favicon
  if (config.favicon && fs.existsSync(config.favicon)) {
    const destFavicon = path.join(buildDir, path.basename(config.favicon));
    fs.copyFileSync(config.favicon, destFavicon);
  }

  // Render project pages
  if (fs.existsSync(docDir) && fs.existsSync(libDir)) {
    renderMarkdownPages(docDir, buildDir);
    renderAboutPage(libDir, buildDir);
  }

  console.log('✅ Portfolio site generated in /build');
}

function initMarkdown(folderName = 'project') {
  const __dirname = getDirname(import.meta.url);
  const docDir = path.join(__dirname, '..', 'doc');
  const projectDir = path.join(docDir, folderName);
  const filePath = path.join(projectDir, 'index.md');

  fse.ensureDirSync(projectDir);

  if (!fs.existsSync(filePath)) {
    const today = new Date().toISOString().split('T')[0];
    const content = `---
title: ${folderName}
description: Describe your project here.
category: General
createDate: ${today}
updateDate: ${today}
---

# ${folderName}

## Overview

Project description goes here.

## Features
- Feature A
- Feature B

## Tech Stack
- HTML
- CSS
- JS

## Screenshot

![image](./assets/screenshot.png)
`;
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Markdown template created at doc/${folderName}/index.md`);
  } else {
    console.log(`⚠️  ${folderName}/index.md already exists.`);
  }
}

export { generateSite, initMarkdown };
