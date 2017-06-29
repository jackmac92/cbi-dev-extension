const makeMainConfig = require('./main');
const makeScriptsConfig = require('./scripts');
module.exports = (env = {}) => {
  if (env.production) {
    return [makeMainConfig(true), makeScriptsConfig(true)];
  } else if (env.forScripts) {
    return makeScriptsConfig(false);
  } else {
    return makeMainConfig(false);
  }
};
// const Crx = require('crx-webpack-plugin');
// new Crx({
//   keyFile: '/usr/app/key.pem',
//   contentPath: '/usr/app/build',
//   outputPath: '/usr/app/dist',
//   name: 'CBI Chrome Plugin'
// })
