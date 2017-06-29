const webpack = require('webpack');
const path = require('path');
var Crx = require('crx-webpack-plugin');
const utils = require('./utils');

const awd = '/usr/app/';

const customPath = path.join(__dirname, './customPublicPath');
const injectDir = path.join(awd, '/src/inject');
const baseConfig = () =>
	Object.assign({}, require('./base'), {
		plugins: [
			new webpack.EnvironmentPlugin(['NODE_ENV', 'CBI_HOSTNAME']),
			new webpack.optimize.OccurrenceOrderPlugin(),
			new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
			new webpack.optimize.UglifyJsPlugin({
				comments: false,
				compressor: {
					warnings: false
				}
			}),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify('production')
				}
			})
			// new Crx({
			// 	keyFile: '/usr/app/key.pem',
			// 	contentPath: '/usr/app/build',
			// 	outputPath: '/usr/app/dist',
			// 	name: 'CBI Chrome Plugin'
			// })
		],
		entry: {}
	});

const scriptsConfig = baseConfig();

scriptsConfig.entry = utils.listFiles(injectDir).reduce((accum, f) => {
	const name = f.split('.').slice(0, -1).join('');
	accum[name] = [customPath, path.join(injectDir, f)];
	return accum;
}, {});
scriptsConfig.output = {
	path: path.join(awd, 'build/js/scripts/'),
	filename: '[name].bundle.js',
	chunkFilename: '[id].chunk.js'
};

const config = baseConfig();
// config.entry.app = [customPath, path.join(awd, 'src/App/')];
// config.entry.inject = [customPath, path.join(awd, 'src/InjectPage/bootstrap')];
// config.entry.options = [
// 	customPath,
// 	path.join(awd, 'src/OptionsPage/bootstrap')
// ];
config.entry.background = [customPath, path.join(awd, 'src/background/')];
config.output = {
	path: path.join(awd, 'build/js'),
	filename: '[name].bundle.js',
	chunkFilename: '[id].chunk.js'
};

module.exports = [config, scriptsConfig];
