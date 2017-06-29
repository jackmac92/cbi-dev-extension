const fs = require('fs');
const path = require('path');

exports.listFiles = folder =>
  fs
    .readdirSync(folder)
    .filter(
      file =>
        file.endsWith('js') && fs.lstatSync(path.join(folder, file)).isFile()
    );
