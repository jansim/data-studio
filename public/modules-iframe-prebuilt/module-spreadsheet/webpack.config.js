const path = require('path');

const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // Mode can be either 'development' or 'production'
  mode: 'development',
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "node_modules/luckysheet/dist",
          to: "luckysheet",
          filter: (path) => {
            return /(umd\.js|css|plugin\.js)$/.test(path)
          }
        }
      ],
    }),
  ]
};