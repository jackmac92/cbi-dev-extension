const path = require('path');
const baseConfig = require('../base.config.js');
const bgConf = baseConfig();
const isDocker = require('is-docker');

const host = isDocker() ? '0.0.0.0' : 'localhost';
const customPath = path.join(__dirname, '../customPublicPath');
const hotScript =
  'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true';
const port = 3004;

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
  background: [
    customPath,
    hotScript,
    path.join(__dirname, '../../src/background/')
  ]
};

module.exports = bgConf;
