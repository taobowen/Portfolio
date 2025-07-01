// webpack.prod.js
import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env = {}) => {
  const targetDir = env.target || process.cwd();

  return merge(common(targetDir), {
    mode: 'production',
    devtool: false,

    entry: [path.resolve(__dirname, 'src', 'index.jsx')],

    output: {
      path: path.resolve(targetDir, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: '/',
      clean: true, // cleans build directory
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
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
        inject: 'body',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, 'src/rawList.json'), to: 'rawList.json' },
          { from: path.resolve(__dirname, 'src/covers'), to: 'covers' },
          { from: path.resolve(__dirname, 'src/assets'), to: 'assets' },
        ],
      }),
    ],

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'all',
      },
    },

    performance: {
      hints: false,
    },
  });
};
