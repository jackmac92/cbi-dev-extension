const path = require('path');
const webpack = require('webpack');
const baseConfig = require('../base.config.js');
const bgConf = baseConfig();
const isDocker = require('is-docker');

const host = isDocker() ? '0.0.0.0' : 'localhost';
const customPath = path.join(__dirname, '../customPublicPath');
const hotScript =
  'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true';
const port = 3004;

bgConf.entry = {
  background: [customPath, path.join(__dirname, '../../src/background/')]
};
bgConf.output = {
  path: path.join(__dirname, '../../build/js'),
  filename: '[name].bundle.js',
  chunkFilename: '[id].chunk.js'
};
(bgConf.plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compressor: {
      warnings: false
    }
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  })
]), (bgConf.resolve = {
  extensions: ['', '.js']
}), (bgConf.module = {
  loaders: [
    {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      loaders: [
        'style',
        'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss'
      ]
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }
  ]
});

module.exports = bgConf;
