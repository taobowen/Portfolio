// webpack.prod.js
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';


export default merge(common, {
  mode: 'production',
  devtool: false, // disable source maps (or use 'source-map' if needed)

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),       // JS minimizer
      new CssMinimizerPlugin(), // CSS minimizer
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['mozjpeg', { quality: 75 }],
              ['pngquant', { quality: [0.65, 0.9], speed: 4 }],
            ],
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: false
  }
});
