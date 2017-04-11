const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const customPath = path.join(__dirname, './customPublicPath');

const listFiles = folder =>
  fs.readdirSync(folder)
    .filter(file => file.endsWith('js') && fs.lstatSync(path.join(folder, file)).isFile());


const injectDir = path.join(__dirname, '../src/inject');
const entry = listFiles(injectDir).reduce((accum, f) => {
  const name = f.split('.').slice(0,-1).join('');
  accum[name] = [customPath, path.join(injectDir, f)];
  return accum;
}, {});
entry.background = [customPath, path.join(__dirname, '../src/background/')];

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.optimize.DedupePlugin(),
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
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loaders: [
        'style',
        'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss'
      ]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
};
