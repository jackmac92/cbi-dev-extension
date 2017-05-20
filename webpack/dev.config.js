const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const isDocker = require('is-docker');

const host = isDocker() ? '0.0.0.0' : 'localhost';
const port = 3004;
const customPath = path.join(__dirname, './customPublicPath');
const hotScript =
  'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true';

const listFiles = folder =>
  fs
    .readdirSync(folder)
    .filter(
      file =>
        file.endsWith('js') && fs.lstatSync(path.join(folder, file)).isFile()
    );

const baseDevConfig = () => ({
  devtool: 'eval-cheap-module-source-map',
  entry: {
    background: [
      customPath,
      hotScript,
      path.join(__dirname, '../src/background/')
    ]
  },
  devMiddleware: {
    publicPath: `http://${host}:${port}/js`,
    stats: { colors: true },
    noInfo: true
  },
  hotMiddleware: {
    path: '/js/__webpack_hmr'
  },
  output: {
    path: path.join(__dirname, '../dev/js'),
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

const injectDir = path.join(__dirname, '../src/inject');

const injectConfig = baseDevConfig();
injectConfig.entry = listFiles(injectDir).reduce((accum, f) => {
  const name = f.split('.').slice(0, -1).join('');
  accum[name] = [customPath, path.join(injectDir, f)];
  return accum;
}, {});

delete injectConfig.hotMiddleware;
delete injectConfig.devMiddleware;
delete injectConfig.module.loaders[0].query;
injectConfig.plugins.shift(); // remove HotModuleReplacementPlugin
injectConfig.output = {
  path: path.join(__dirname, '../dev/js'),
  filename: '[name].bundle.js'
};
const appConfig = baseDevConfig();

module.exports = [appConfig, injectConfig];
