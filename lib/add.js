import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function initMarkdown(folderName = 'project') {
  const formatFolderName = folderName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  console.log(`Creating markdown template for: ${formatFolderName}`);

  const cwd = process.cwd(); // Use current execution path
  const docDir = path.join(cwd, 'doc');
  const projectDir = path.join(docDir, formatFolderName);
  const filePath = path.join(projectDir, 'index.md');
  const defaultCoverImgPath = path.join(__dirname, 'template', 'assets', 'index.png');

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
`;
    fs.writeFileSync(filePath, content, 'utf-8');
    fs.copyFileSync(defaultCoverImgPath, path.join(projectDir, 'index.png'));
    console.log(`✅ Markdown template created at ${path.relative(cwd, filePath)}`);
  } else {
    console.log(`⚠️  ${folderName}/index.md already exists.`);
  }
}

export { initMarkdown };
