// webpack.config.js
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import CopyWebpackPlugin from "copy-webpack-plugin";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './build/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './build/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "build/rawList.json", to: "rawList.json" },
                { from: "build/covers", to: "covers" }]
    })
  ],
  devServer: {
    static: './dist',
    historyApiFallback: true,
    port: 3000
  },
  mode: 'development'
};
