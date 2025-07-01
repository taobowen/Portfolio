// webpack.dev.js
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import { fileURLToPath } from 'url';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url); // path to current file
const __dirname = path.dirname(__filename); 

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: [
    path.resolve(__dirname, 'src', 'index.jsx'),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
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
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/rawList.json'), to: 'rawList.json' },
        { from: path.resolve(__dirname, 'src/covers'), to: 'covers' },
        { from: path.resolve(__dirname, 'src/assets'), to: 'assets' },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'src'), // serve static files
    },
    hot: true,
    open: true,
    port: 3000,
    historyApiFallback: true, // For SPA routing
  }
});
