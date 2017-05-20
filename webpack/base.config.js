const path = require('path');
const webpack = require('webpack');
const isDocker = require('is-docker');
const host = isDocker() ? '0.0.0.0' : 'localhost';
const port = 3004;
const outputDir = path.join(__dirname, '../dev/js');
const baseConfig = () => ({
  devtool: 'eval-cheap-module-source-map',
  // devMiddleware: {
  //   publicPath: `http://${host}:${port}/js`,
  //   stats: {
  //     colors: true
  //   },
  //   noInfo: true
  // },
  // hotMiddleware: {
  //   path: '/js/__webpack_hmr'
  // },
  output: {
    path: outputDir,
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
    new webpack.DefinePlugin({
      __HOST__: `'${host}'`,
      __PORT__: port,
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
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
          'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
});

module.exports = baseConfig;
