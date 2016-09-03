const getInfo = () => {
  const infoFinder = () => {
    output = $("[ng-if='test.hasExtraInfo']").find(".ng-binding")[0].innerHTML
    matches = output.match(/(?:Screenshot at\s\n)(\/tmp\/\S+)/)
    screenshot = matches[matches.length - 1]
    branch = $(".branch").text().split(' ')[0].split('/')[1]
    if (branch !== undefined && screenshot !== undefined) {
      return {
        "screenshot": screenshot,
        "branch": branch
      }
    } else {
      return void 0
    }
  }

  scrapeInfo("testScreenshot", infoFinder)
}

whenPageReady(getInfo, /^http:\/\/dev\.test\.cbinsights\.com\/#\/test\/\d+$/)
