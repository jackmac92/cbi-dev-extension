const path = require('path');
const isDocker = require('is-docker');

const awd = isDocker()
  ? '/usr/app/'
  : '/Users/jmccown/cbinsights/chrome-extension';

module.exports = {
  config: {
    devtool: 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            }
          ]
        }
        // ,{
        //   test: /\.svg$/,
        //   use: [
        //     {
        //       loader: 'babel-loader'
        //     },
        //     {
        //       loader: 'react-svg-loader',
        //       query: {
        //         svgo: {
        //           plugins: [{ removeTitle: false }],
        //           floatPrecision: 2
        //         }
        //       }
        //     }
        //   ]
        // }
      ]
    },
    resolve: {
      extensions: ['.js']
    }
  },
  host: isDocker() ? '0.0.0.0' : 'localhost',
  workingDir: awd,
  customPath: path.join(awd, 'webpack/customPublicPath'),
  hotScript:
    'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true'
};
