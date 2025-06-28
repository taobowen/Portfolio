// webpack.prod.js
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

export default (env = {}) => {
  const targetDir = env.target || process.cwd();
  return merge(common(targetDir), {
    mode: 'production',
    devtool: false,

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin(),
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
};
