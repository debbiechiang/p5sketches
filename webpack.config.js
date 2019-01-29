const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    perlin: "./src/perlin.js",
    flock: "./src/flocking.js"
  },
  devServer: {
    contentBase: "./dist",
    port: 8080,
    watchContentBase: true
  },
  devtool: "inline-source-map",
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      title: "Perlin Demo",
      inject: "body",
      chunks: ["perlin"],
      filename: "index.html"
    }),
    new HtmlWebpackPlugin({
      title: "Flocking Demo",
      inject: "body",
      chunks: ["flock"],
      filename: "flock.html"
    }),
    new webpack.ProvidePlugin({
      p5: "p5" // p5.dom is an addon of p5, so p5 must be loaded globally.
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [/src/],
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  output: {
    filename: "[name].main.js",
    path: path.resolve(__dirname, "dist")
  }
};
