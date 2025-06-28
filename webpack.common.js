// webpack.common.js
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// const cwd = process.cwd();
const __filename = fileURLToPath(import.meta.url); // path to current file
const __dirname = path.dirname(__filename); 


export default function (targetDir = process.cwd()) {
  return {
    entry: path.resolve(__dirname, 'build', 'index.js'),
    output: {
      path: targetDir,
      filename: '[name].[contenthash].js',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: 'asset/resource',
        },
        {
          test: /\.html$/,
          use: ['html-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'build', 'index.html'),
        inject: 'body',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, 'build/rawList.json'), to: 'rawList.json' },
          { from: path.resolve(__dirname, 'build/covers'), to: 'covers' },
          { from: path.resolve(__dirname, 'build/assets'), to: 'assets' },
        ],
      }),
    ],
  };
}