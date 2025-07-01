#!/usr/bin/env node

import { generateSite } from '../lib/generate.js';
import { initAboutPage } from '../lib/init.js';
import { initMarkdown } from '../lib/add.js';
import { spawnSync } from 'child_process';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Dynamically get version from package.json
const cwd = process.cwd(); // Use current execution path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
const projectRoot = path.join(__dirname, '..');

const webpackBin = path.resolve(__dirname, '../node_modules/webpack/bin/webpack.js'); 

yargs(hideBin(process.argv))
  .scriptName('portfolio')
  .usage('$0 <command> [options]')
  .command('generate', 'Generate the portfolio site', (yargs) => {
    return yargs.option('config', {
      alias: 'c',
      describe: 'Path to the config file',
      type: 'string',
      default: 'setting.json'
    });
  }, (argv) => {
    generateSite(argv.config);
  })
  // .command('preview', 'Preview the portfolio site locally', {}, () => {
  //    spawnSync(webpackBin, ['serve', '--config', 'webpack.dev.js', '--env', `target=${cwd}`], {
  //     stdio: 'inherit',
  //     cwd: projectRoot
  //   });
  // })
  .command('preview', 'Bundle and preview the site locally', {}, () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const configPath = path.resolve(__dirname, '../webpack.prod.js');

    console.log('📦 Bundling website using webpack...');
    const webpackCommand = `npx webpack --config "${configPath}" --env target=${cwd}`;
    const result = spawnSync(webpackCommand, {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true,
    });


    if (result.status !== 0) {
      console.error('❌ Webpack build failed');
      process.exit(1);
    }

    console.log('🚀 Starting local preview server...');
    const serverProcess = spawnSync('node', ['./lib/preview.js'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true,
    });

    if (serverProcess.status !== 0) {
      console.error('❌ Failed to start preview server');
      process.exit(1);
    }
  })
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
  .command('build', 'Build site using webpack.prod.js', {}, () => {
    const configPath = path.resolve(__dirname, '../webpack.prod.js');
    spawnSync(webpackBin, ['--config', configPath, '--env', `target=${cwd}`], {
      stdio: 'inherit',
      cwd: projectRoot, // where node_modules lives
    });
  })
  .command('serve', 'Serve production build with webpack-dev-server', {}, () => {
    const configPath = path.resolve(__dirname, '../webpack.prod.js');
    spawnSync(webpackBin, ['serve', '--config', configPath, '--env', `target=${cwd}`], {
      stdio: 'inherit',
      cwd: projectRoot, // where node_modules lives
    });
  })
  .version(pkg.version)
  .alias('v', 'version')
  .help()
  .alias('h', 'help')
  .demandCommand(1, 'Please provide a valid command')
  .argv;
