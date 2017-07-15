const webpack = require('webpack');

module.exports = {
  prod: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compressor: {
        warnings: false
      }
    })
  ],
  dev: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'DEV_PORT']),
    new webpack.DefinePlugin({
      __HOST__: JSON.stringify('localhost'),
      __PORT__: JSON.stringify(process.env.DEV_PORT)
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/)
  ]
};
