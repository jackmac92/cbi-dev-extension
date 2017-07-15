const base = require('./base');
const envOpts = process.env.NODE_ENV === 'production'
  ? require('./prod')
  : require('./dev');

module.exports = Object.assign({}, base, envOpts);
