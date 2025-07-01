// webpack.common.js

export default function (targetDir = process.cwd()) {
  return {
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  };
}