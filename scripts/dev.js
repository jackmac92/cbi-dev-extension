const createWebpackServer = require('webpack-httpolyglot-server');
const bgConfig = require('../webpack/background/dev.config.js');
const tasks = require('./tasks');
const isDocker = require('is-docker');
const yoSay = require('yosay');
const echo = console.log;

const port = 3004;
const host = isDocker() ? '0.0.0.0' : 'localhost';

tasks.replaceWebpack();
echo('Copying Assets');
tasks.copyAssets('dev');
echo('-'.repeat(80));
echo(
  `
   Please allow 'https://localhost:3003'
   connections in Google Chrome,
   and load unpacked extensions with ./dev folder
`
);
echo(yoSay(`Starting server at ${host}:${port}`));
setTimeout(
  () =>
    exec(
      'webpack --watch --config webpack/scripts/dev.config.js --progress --profile --colors',
      { async: true }
    ),
  0
);
setTimeout(() => createWebpackServer(bgConfig, { host, port }), 0);
