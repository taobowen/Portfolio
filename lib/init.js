import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

function initAboutPage() {
  const aboutPath = 'about.md';
  const docPath = 'doc';
  const settingPath = 'setting.json';
  const faviconPath = 'favicon.ico';

  // Ensure current dir and doc/ exist
  fse.ensureDirSync('.');
  fse.ensureDirSync(docPath);

  if (!fs.existsSync(aboutPath)) {
    const content = `# About Me

Welcome to my portfolio!  
This page is dedicated to sharing who I am, what I do, and what I care about.  
You can customize this markdown file to include your background, philosophy, or achievements.
`;
    fs.writeFileSync(aboutPath, content, 'utf-8');
    console.log(`✅ about.md created in current folder`);
  } else {
    console.log(`⚠️  about.md already exists.`);
  }

  if (!fs.existsSync(settingPath)) {
    const defaultSettings = {
      title: "Portfolio",
      favicon: faviconPath,
      description: "A personal site showcasing my projects and skills"
    };
    fs.writeFileSync(settingPath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
    console.log(`✅ setting.json created in current folder`);
  } else {
    console.log(`⚠️  setting.json already exists.`);
  }

  if (!fs.existsSync(faviconPath)) {
    const __filename = fileURLToPath(import.meta.url); // path to current file
    const __dirname = path.dirname(__filename); 
    const defaultFaviconPath = path.join(__dirname, 'template', 'assets', 'favicon.ico');
    fs.copyFileSync(defaultFaviconPath, faviconPath);
    console.log(`✅ favicon.ico copied to current folder`);
  }
  else {
    console.log(`⚠️  favicon.ico already exists.`);
  }
  console.log(`📁 doc/ folder is ready`);
}

export { initAboutPage };
