const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('../base.config.js');

const customPath = path.join(__dirname, '../customPublicPath');
const injectDir = path.join(__dirname, '../../src/inject');

const listFiles = folder =>
  fs
    .readdirSync(folder)
    .filter(
      file =>
        file.endsWith('js') && fs.lstatSync(path.join(folder, file)).isFile()
    );

const injectConfig = baseConfig();
injectConfig.entry = listFiles(injectDir).reduce((accum, f) => {
  const name = f.split('.').slice(0, -1).join('');
  accum[name] = [customPath, path.join(injectDir, f)];
  return accum;
}, {});

injectConfig.plugins = [
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
];
injectConfig.resolve = {
  extensions: ['', '.js']
};

injectConfig.module = {
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
};

delete injectConfig.module.loaders[0].query;

injectConfig.output = {
  path: path.join(__dirname, '../../build/js'),
  filename: '[name].js'
};

module.exports = injectConfig;
