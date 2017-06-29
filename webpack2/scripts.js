const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WebpackShell = require('webpack-shell-plugin');
const plugins = require('./plugins');
const base = require('./base');

const { customPath, workingDir, config: baseConfig } = base;

const getOutputDir = isProd =>
  path.join(workingDir, `${isProd ? 'build' : 'dev'}/js`);

const listFiles = folder =>
  fs
    .readdirSync(folder)
    .filter(
      file =>
        file.endsWith('js') && fs.lstatSync(path.join(folder, file)).isFile()
    );

const nameNoExt = name => name.split('.').slice(0, -1).join('');

const injectDir = path.join(workingDir, 'src/injectScripts/');

const getPlugins = isProd => {
  if (isProd) {
    return plugins.prod;
  } else {
    return plugins.dev;
    // return [...plugins.dev, new WebpackShell({ onBuildStart: 'nodemon' })];
  }
};

module.exports = isProd =>
  Object.assign({}, baseConfig, {
    entry: listFiles(injectDir).reduce(
      (accum, f) =>
        Object.assign({}, accum, {
          [nameNoExt(f)]: [customPath, path.join(injectDir, f)]
        }),
      {}
    ),
    plugins: getPlugins(isProd),
    output: {
      path: path.join(getOutputDir(isProd), 'scripts'),
      filename: '[name].bundle.js',
      chunkFilename: '[id].chunk.js'
    }
  });
