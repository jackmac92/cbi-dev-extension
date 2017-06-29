const webpack = require('webpack');

module.exports = {
  prod: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'CBI_HOSTNAME']),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      __PLATFORM_HOSTNAME__: JSON.stringify(process.env.CBI_HOSTNAME),
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  dev: [
    new webpack.DefinePlugin({
      __HOST__: JSON.stringify('localhost'),
      __PORT__: JSON.stringify(process.env.DEV_PORT),
      __DEV_PORT__: JSON.stringify(process.env.DEV_PORT),
      __PLATFORM_HOSTNAME__: JSON.stringify(process.env.CBI_HOSTNAME),
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        DEV_PORT: JSON.stringify(process.env.DEV_PORT)
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/)
  ]
};
