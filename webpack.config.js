const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/sketch.js'
  },
  devServer: {
    contentBase: './dist',
    watchContentBase: true
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Perlin Demo'
    }),
    new webpack.ProvidePlugin({
      p5: 'p5' // p5.dom is an addon of p5, so p5 must be loaded globally. 
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