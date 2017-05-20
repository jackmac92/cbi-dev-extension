const notifier = (m, action = () => {}) => {
  let title;
  let subTitle;
  console.log(m);
  console.log(m);
  console.log(m);
  console.log(m);
  switch (m.action) {
    case 'jenkinsHandler':
      title = 'Found Screenshots';
      subTitle = 'Click to download';
      break;
    case 'reviewHandler':
      title = 'Found Review Info';
      subTitle = 'Click to setup review branches locally';
      break;
    case 'screenshotHandler':
      title = 'Found Screenshot for test';
      subTitle = 'Click to download';
      break;
    default:
      title = 'Found something';
      subTitle = 'Click to do stuff';
  }
  const notificationOpts = {
    type: 'basic',
    title: title,
    message: subTitle,
    iconUrl: chrome.runtime.getURL('icons/icon-small.png')
  };
  chrome.notifications.create(notificationOpts, createId => {
    const handler = id => {
      if (id === createId) {
        action();
        chrome.notifications.clear(id);
        chrome.notifications.onClicked.removeListener(handler);
      }
    };
    chrome.notifications.onClicked.addListener(handler);
  });
};

export default notifier;
