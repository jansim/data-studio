const path = require('path');

module.exports = {
  // Mode can be either 'development' or 'production'
  mode: 'production',
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      'font-awesome-sass-loader': false
    },
  }
};