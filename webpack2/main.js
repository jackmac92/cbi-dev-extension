// const DashboardPlugin = require('webpack-dashboard/plugin');
const webpack = require('webpack');
const path = require('path');
const base = require('./base');
const plugins = require('./plugins');

const baseConfig = base.config;
const { workingDir, customPath, hotScript, host } = base;

const getOutputDir = isProd =>
  path.join(workingDir, `${isProd ? 'build' : 'dev'}/js`);

const devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  // new DashboardPlugin({ port: 9839 }),
  ...plugins.dev
];

module.exports = isProd => {
  const entryMiddleware = [customPath];
  if (isProd) {
    baseConfig.plugins = plugins.prod;
  } else {
    entryMiddleware.push(hotScript);
    baseConfig.plugins = devPlugins;
    baseConfig.devMiddleware = {
      publicPath: `http://${host}:${process.env.DEV_PORT}/js`,
      stats: {
        colors: true
      },
      noInfo: true
    };
    baseConfig.hotMiddleware = {
      path: '/js/__webpack_hmr'
    };
  }
  return Object.assign({}, baseConfig, {
    entry: {
      app: [...entryMiddleware, path.join(workingDir, 'src/App/')],
      inject: [customPath, path.join(workingDir, 'src/InjectPage/bootstrap')],
      options: [
        ...entryMiddleware,
        path.join(workingDir, 'src/OptionsPage/bootstrap')
      ],
      background: [
        ...entryMiddleware,
        path.join(
          workingDir,
          `src/BackgroundProcess/${isProd ? '' : 'dev.'}index`
        )
      ]
    },
    output: {
      path: getOutputDir(isProd),
      filename: '[name].bundle.js',
      chunkFilename: '[id].chunk.js',
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
    }
  });
};
