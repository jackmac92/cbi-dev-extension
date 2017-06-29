const path = require('path');
const isDocker = require('is-docker');

const host = isDocker() ? '0.0.0.0' : 'localhost';
const customPath = path.join(__dirname, '../customPublicPath');
const hotScript =
  'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true';
const port = process.env.DEV_PORT;

const bgConf = Object.assign({}, require('../base'), require('../dev.extras'));
bgConf.devMiddleware = {
  publicPath: `http://${host}:${port}/js`,
  stats: {
    colors: true
  },
  noInfo: true
};
bgConf.hotMiddleware = {
  path: '/js/__webpack_hmr'
};
bgConf.entry = {
  // app: [customPath, hotScript, path.join(__dirname, '../../src/App/')],
  background: [
    customPath,
    hotScript,
    path.join(__dirname, '../../src/background/dev.index')
  ]
  // inject: [customPath, path.join(__dirname, '../../src/InjectPage/bootstrap')],
  // options: [
  //   customPath,
  //   hotScript,
  //   path.join(__dirname, '../../src/OptionsPage/bootstrap')
  // ]
};
bgConf.output = {
  path: path.join(__dirname, '../../dev/js'),
  filename: '[name].bundle.js',
  chunkFilename: '[id].chunk.js'
};

module.exports = bgConf;
