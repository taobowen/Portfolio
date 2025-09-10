#!/usr/bin/env node

import { generateSite } from '../lib/generate.js';
import { initAboutPage } from '../lib/init.js';
import { initMarkdown } from '../lib/add.js';
import { spawn } from 'child_process';
import open from 'open'; // install this: npm install open

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSync } from 'esbuild';
import fse from 'fs-extra';

// Dynamically get version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const outDir = path.resolve('./');

yargs(hideBin(process.argv))
  .scriptName('portfolio')
  .usage('$0 <command> [options]')
  .command('init', 'Initialize about.md in current folder and doc folder', {}, () => {
    initAboutPage();
  })
  .command('add [folderName]', 'Add a new markdown project folder under /doc', (yargs) => {
    return yargs.positional('folderName', {
      describe: 'Name of the folder to create under doc/',
      type: 'string',
      default: 'project'
    });
  }, (argv) => {
    initMarkdown(argv.folderName);
  })
  .command('generate', 'Generate the portfolio site and bundle it with esbuild', (yargs) => {
    return yargs.option('config', {
      alias: 'c',
      describe: 'Path to the config file',
      type: 'string',
      default: 'setting.json'
    });
  }, () => {
    generateSite();
    buildSync({
      entryPoints: [path.resolve(projectRoot, 'src', 'index.js')],
      bundle: true,
      outdir: outDir,
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.png': 'file',
        '.css': 'css',
        '.html': 'text',
        '.json': 'json',
      },
      assetNames: 'assets/[name]',
      sourcemap: true,
    });

    // 2. Copy static files
    const copyTargets = [
      ['rawList.json', 'rawList.json'],
      ['covers', 'covers'],
      ['assets', 'assets'],
      ['index.html', 'index.html'],
    ];

    copyTargets.forEach(([fromRel, toRel]) => {
      const from = path.join(srcDir, fromRel);
      const to = path.join(outDir, toRel);
      if (fse.existsSync(from)) {
        fse.copySync(from, to);
        console.log(`✅ Copied: ${fromRel} → ${toRel}`);
      }
    });

    // 3. remove the src directory after build
    fse.removeSync(srcDir);
  })
  .command('preview', 'Preview the dist site locally', {}, () => {
    const server = spawn('npx', ['serve', './', '--single', '--listen', '3000'], {
      stdio: 'inherit',
      shell: true,
    });

    // Wait a moment to ensure the server is up, then open browser
    setTimeout(() => {
      open('http://localhost:3000');
    }, 1000); // you can increase this delay if needed

    // Optional: handle process exit cleanly
    server.on('exit', (code) => {
      process.exit(code);
    });
  })
  .version(pkg.version)
  .alias('v', 'version')
  .help()
  .alias('h', 'help')
  .demandCommand(1, 'Please provide a valid command')
  .argv;
