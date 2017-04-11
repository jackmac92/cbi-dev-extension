require('shelljs/global');
const fs = require('fs');
const pug = require('pug');
const manifest = require('../manifest/');

exports.replaceWebpack = () => {
  const replaceTasks = [{
    from: 'webpack/replace/JsonpMainTemplate.runtime.js',
    to: 'node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: 'webpack/replace/log-apply-result.js',
    to: 'node_modules/webpack/hot/log-apply-result.js'
  }];

  replaceTasks.forEach(task => cp(task.from, task.to));
};

const generateHTML = (type, env) => {
  fs.readdir('./src/views', (error, items) => {
    items.reduce((accum, filename) => {
      const [name, fileExt] = filename.split('.');
      if (fileExt === 'pug') {
        accum.push(name);
      }
      return accum;
    }, []).forEach((filename) => {
      fs.writeFile(
        `./${type}/${filename}.html`,
        pug.renderFile(`./src/views/${filename}.pug`, { env }),
        (err) => {
          if (err) {
            console.log(`Error generating ${filename}`);
            throw new Error(err);
          }
        }
      );
    });
  });
};

const resetOutputPath = type => {
  rm('-rf', type);
  mkdir(type);
};

const writeManifestFile = type =>
  fs.writeFile(
    `./${type}/manifest.json`,
    JSON.stringify(manifest, null, 4),
    (err) => {
      if (err) {
        console.log('Error generating manifest');
        throw new Error(err);
      }
    }
  );


exports.copyAssets = type => {
  const env = type === 'build' ? 'prod' : type;
  resetOutputPath(type, env);
  writeManifestFile(type);
  generateHTML(type);
  cp('-R', './icons', type);
  cp('-R', './_locales', type);
};
