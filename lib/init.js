import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import { fileURLToPath } from 'url';

function initMarkdown(folderName = 'project') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.join(__dirname, '..');
  const docDir = path.join(rootDir, 'doc');
  const projectDir = path.join(docDir, folderName);
  const filePath = path.join(projectDir, 'index.md');

  const defaultCoverImgPath = path.join(__dirname, 'template', 'assets', 'index.png');

  fse.ensureDirSync(projectDir);

  console.log('✅ projectDir', projectDir);

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
    console.log(`✅ Markdown template created at doc/${folderName}/index.md`);
  } else {
    console.log(`⚠️  ${folderName}/index.md already exists.`);
  }
}

export { initMarkdown };