const scrapeInfo = (item, locator, validator) => {
  return new Promise( (resolve, reject) => {
    let element
    const waitForEl = setInterval(() => {
      if (elementLocated(element)) {
        clearInterval(waitForEl)
        resolve({
          "action": item,
          "data": element
        })
      } else {
        element = locator()
      }
    }, 1000)
  }).then( (res) => { comPort.postMessage(res) } )

}

const elementLocated = (el, validator) => {
  if (el === undefined) {
    return false
  }
  if (validator !== undefined) {
    return validator(el)
  }

  return true

}

const whenPageReady = (action, urlSelector) => {
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      urlSelector = urlSelector || /./
      let url = window.location.href
      if (url.match(urlSelector)) {
        action()
      }
    }
  }, 10);
}

const comPort = chrome.runtime.connect()

comPort.onMessage.addListener((m) => {
  console.log(`Inject received msg ${m}`)
  // get branchInfo, open locally, allow for changes to be saved to git patch and sent over to author
})
