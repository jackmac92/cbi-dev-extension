require('./');

const reloadExtension = () => chrome.runtime.reload();

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    console.log(Object.keys(details));
    if (details.url.indexOf('http://reload.extension') >= 0) {
      reloadExtension();
      chrome.tabs.get(details.tabId, tab => {
        if (tab.selected === false) {
          chrome.tabs.remove(details.tabId);
        }
      });
      return {
        // close the newly opened window
        redirectUrl: chrome.extension.getURL('close.html')
      };
    }

    return { cancel: false };
  },
  {
    urls: ['http://reload.extension/'],
    types: ['main_frame']
  },
  ['blocking']
);
