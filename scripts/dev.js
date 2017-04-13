const createWebpackServer = require('webpack-httpolyglot-server');
const bgConfig = require('../webpack/background/');
const tasks = require('./tasks');
const isDocker = require('is-docker');
const yoSay = require('yosay');
const echo = console.log;

const port = 3003;
const host = (isDocker()) ? '0.0.0.0' : 'localhost';

// tasks.replaceWebpack();
echo('Copying Assets');
tasks.copyAssets('dev');
echo('-'.repeat(80));
echo(`
   Please allow 'https://localhost:3003'
   connections in Google Chrome,
   and load unpacked extensions with ./dev folder
`);
echo(yoSay(`Starting server at ${host}:${port}`));
exec('webpack --config webpack/scripts/ --progress --profile --colors');
createWebpackServer(bgConfig, { host, port });
