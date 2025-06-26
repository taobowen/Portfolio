#!/usr/bin/env node

import { generateSite } from '../lib/generate.js';
import { initMarkdown } from '../lib/init.js';
import { previewSite } from '../lib/preview.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;

if (argv._[0] === 'generate') {
  generateSite(argv.config || 'setting.json');
} else if (argv._[0] === 'preview') {
  previewSite();
} else if (argv._[0] === 'init') {
  initMarkdown(argv.folderName);
} else {
  console.log(`
Usage:
  portfolio-generator generate --config setting.json
  portfolio-generator preview
  portfolio-generator init --folderName project
`);
}