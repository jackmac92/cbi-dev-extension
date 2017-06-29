const fs = require('fs');
const path = require('path');

const customPath = path.join(__dirname, '../customPublicPath');
const injectDir = path.join(__dirname, '../../src/inject');

const listFiles = folder =>
  fs
    .readdirSync(folder)
    .filter(
      file =>
        file.endsWith('js') && fs.lstatSync(path.join(folder, file)).isFile()
    );

const injectConfig = Object.assign(
  {},
  require('../base'),
  require('../dev.extras')
);
injectConfig.entry = listFiles(injectDir).reduce((accum, f) => {
  const name = f.split('.').slice(0, -1).join('');
  accum[name] = [customPath, path.join(injectDir, f)];
  return accum;
}, {});

delete injectConfig.hotMiddleware;
delete injectConfig.devMiddleware;
injectConfig.plugins.shift(); // remove HotModuleReplacementPlugin
injectConfig.output = {
  path: path.join(__dirname, '../../dev/js'),
  filename: '[name].js'
};

module.exports = injectConfig;
