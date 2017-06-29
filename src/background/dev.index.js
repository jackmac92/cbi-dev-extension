require('./');

// const reloadExtension = () => chrome.runtime.reload();

// chrome.webRequest.onBeforeRequest.addListener(
//   details => {
//     if (details.url.indexOf('http://reload.cbiextension') >= 0) {
//       reloadExtension();
//       chrome.tabs.get(details.tabId, tab => {
//         if (tab.selected === false) {
//           chrome.tabs.remove(details.tabId);
//         }
//       });
//       return {
//         // close the newly opened window
//         redirectUrl: 'chrome://extensions'
//         // redirectUrl: chrome.extension.getURL('close.html')
//       };
//     }

//     return { cancel: false };
//   },
//   {
//     urls: ['http://reload.cbiextension/'],
//     types: ['main_frame']
//   },
//   ['blocking']
// );
