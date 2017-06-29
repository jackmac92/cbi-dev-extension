const webpack = require('webpack');
const isDocker = require('is-docker');
const host = isDocker() ? '0.0.0.0' : 'localhost';
const port = process.env.DEV_PORT;
const platformHost = process.env.CBI_HOSTNAME;

const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  devMiddleware: {
    publicPath: `http://${host}:${port}/js`,
    stats: {
      colors: true
    },
    noInfo: true
  },
  hotMiddleware: {
    path: '/js/__webpack_hmr'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin({ port: 9839 }),
    new webpack.DefinePlugin({
      __HOST__: `'${host}'`,
      __PORT__: JSON.stringify(port),
      __DEV_PORT__: JSON.stringify(port),
      __PLATFORM_HOSTNAME__: JSON.stringify(platformHost),
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/)
  ]
};
