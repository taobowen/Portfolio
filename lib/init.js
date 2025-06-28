import fs from 'fs';
import fse from 'fs-extra';

function initAboutPage() {
  const aboutPath = 'about.md';
  const docPath = 'doc';

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

  console.log(`📁 doc/ folder is ready`);
}

export { initAboutPage };
