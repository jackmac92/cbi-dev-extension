const fs = require('fs');
const ChromeExtension = require('crx');
const path = require('path');
/* eslint import/no-unresolved: 0 */
const name = 'cbi-dev-ext';
const argv = require('minimist')(process.argv.slice(2));
const keyPath = argv.key || 'key.pem';
const existsKey = fs.existsSync(keyPath);
const appId = process.env.APP_ID;

const main = async () => {
  const crx = new ChromeExtension({
    appId,
    codebase: argv.codebase,
    privateKey: existsKey ? fs.readFileSync(keyPath) : null
  });

  await crx.load(path.resolve('build'));
  const archiveBuffer = await crx.loadContents();

  fs.writeFile(`dist/${name}.zip`, archiveBuffer);

  if (existsKey) {
    const crxBuffer = await crx.pack(archiveBuffer);
    const updateXML = crx.generateUpdateXML();
    fs.writeFile('dist/update.xml', updateXML);
    fs.writeFile(`dist/${name}.crx`, crxBuffer);
  }
};

main();
