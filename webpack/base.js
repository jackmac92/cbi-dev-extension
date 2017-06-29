const webpack = require('webpack');
const isDocker = require('is-docker');

const host = isDocker() ? '0.0.0.0' : 'localhost';
const port = 80;
module.exports = {
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV', 'CBI_HOSTNAME'])]
};
