const tasks = require('./tasks');

const echo = console.log;

tasks.replaceWebpack();
echo('[Copy assets]');
echo('-'.repeat(80));
tasks.copyAssets('build');

echo('[Webpack Build]');
echo('-'.repeat(80));
exec('webpack --config webpack --env.production --progress --profile --colors');
