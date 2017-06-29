const base = require('./base');
// const envOpts = process.env.NODE_ENV === 'prod'
//   ? require('./prod')
//   : require('./dev');

module.exports = type =>
  Object.assign(
    {},
    base,
    type === 'prod' ? require('./prod') : require('./dev')
  );
