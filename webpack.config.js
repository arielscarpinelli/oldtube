const path = require('path');
const babelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.js$/,
        exclude: babelLoaderExcludeNodeModulesExcept([
          'm3u8stream',
          'miniget',
          'ytdl-core'
        ]),
        use: {
        loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      { test: /\.css$/, loader: "file-loader?name=[name].[ext]" }
    ]
  }
};
