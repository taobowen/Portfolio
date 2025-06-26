// webpack.dev.js
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './build',
    historyApiFallback: true,
    port: 3000,
    open: true,
  },
});
