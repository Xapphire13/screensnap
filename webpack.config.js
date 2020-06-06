const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const baseConfig = {
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [new webpack.ProgressPlugin()]
};

const clientConfig = {
  ...baseConfig,

  entry: {
    "toolbar": "./src/renderer/toolbar/index.tsx"
  },
  target: 'electron-renderer',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './'
  },
  plugins: [...baseConfig.plugins, new HtmlWebpackPlugin({ chunks: "toolbar", filename: "toolbar.html" })]
};

const serverConfig = {
  ...baseConfig,

  entry: './src/main/index.ts',
  target: 'electron-main',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()]
};

module.exports = [clientConfig, serverConfig];
