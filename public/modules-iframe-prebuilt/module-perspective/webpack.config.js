const path = require('path');

const PerspectivePlugin = require("@finos/perspective-webpack-plugin");

module.exports = {
  // Mode can be either 'development' or 'production'
  mode: 'production',
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        exclude: [/monaco-editor/],
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new PerspectivePlugin()]
};