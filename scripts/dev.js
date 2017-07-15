const createWebpackServer = require('webpack-httpolyglot-server');
const isDocker = require('is-docker');
const yoSay = require('yosay');
const mainConfig = require('../webpack');
const tasks = require('./tasks');

const echo = console.log;

const port = process.env.DEV_PORT;
const host = isDocker() ? '0.0.0.0' : 'localhost';

tasks.replaceWebpack();
echo('Copying Assets');
tasks.copyAssets('dev');

echo('-'.repeat(80));
echo(
  `
   Please allow 'https://${host}:${port}'
   connections in Google Chrome,
   and load unpacked extensions with ./dev folder
`
);

echo(yoSay(`Starting server at ${host}:${port}`));
setTimeout(() => createWebpackServer(mainConfig(), { host, port }), 0);
setTimeout(
  () =>
    exec(
      'webpack --watch --config webpack --env.forScripts --progress --profile --colors',
      {
        async: true
      }
    ),
  0
);
