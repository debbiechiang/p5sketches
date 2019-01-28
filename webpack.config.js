const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/sketch.js'
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Perlin Demo'
      // template: './src/index.html'
    }),
    new webpack.ProvidePlugin({
      p5: 'p5'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          /src/
        ],
        use: [{
          loader: 'babel-loader'
        }]
      }
    ]
  },
  output: {
    filename: '[name].main.js',
    path: path.resolve(__dirname, 'dist')
  }
};