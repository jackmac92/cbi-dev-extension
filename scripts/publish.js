const webStore = require('chrome-webstore-upload')({
  extensionId: process.env.APP_ID,
  clientId:
    '408201917460-nos1kuiqhmmm6h5esocn5vv18u0hlj8l.apps.googleusercontent.com',
  clientSecret: 'e1w9KvGe04sEsu28IAfuqeL2',
  refreshToken: '1/PpNJKFcbWyGxTnGWoPQvkWcWx05hkLvfXaMN-x-K_Ro'
});

// 4/OBaZW6HLT77sDLKEbiqSTBHKcp-xlM57jSXuLoqTUhc
const fs = require('fs');
const target = 'trustedTesters'; // optional. Can also be 'trustedTesters'

const main = async () => {
  const myZipFile = fs.createReadStream('./dist/cbi-dev-ext.zip');
  try {
    // Response is a Resource Representation
    // https://developer.chrome.com/webstore/webstore_api/items#resource
    const uploadRes = await webStore.uploadExisting(myZipFile);
    console.log('uploaded');
    console.log(uploadRes);
  } catch (e) {
    console.log('Error uploading');
    console.log(e);
    return;
  }

  try {
    // Response is documented here:
    // https://developer.chrome.com/webstore/webstore_api/items/publish
    const publishRes = await webStore.publish(target);
    console.log('published');
    console.log(publishRes);
  } catch (e) {
    console.log('Error publishing');
    console.log(e);
    return;
  }
};

main();
