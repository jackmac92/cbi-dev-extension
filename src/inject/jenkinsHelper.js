const getInfo = () => {

  const screenshotsFinder = () => {
    const testOutput = document.getElementsByClassName("console-output")[0].textContent
    let branch = testOutput.match(/\+ X_CBI_TEST_ENV=(\S+)/)[1]
    const testNameAndScreenshotPath = /_{4,}\s(\S+)\s_{4,}(?:\S|\s)*?(?:Screenshot at\s\n)(\/tmp\/\S+)/g
    let screenshotMatches = testOutput.match(testNameAndScreenshotPath) || []
    result = []
    screenshots = screenshotMatches.map( el => {
      return {
        testName: el.match(/_{4,}\s(\S+)\s_{4,}/)[1],
        screenshot: el.match(/(?:Screenshot at\s\n)(\/tmp\/\S+)/)[1]
      }
    })

    return {
      "branch": branch,
      "tests": screenshots
    }
  }

  scrapeInfo("jenkinsScreenshot", screenshotsFinder)

}

whenPageReady(getInfo, /\/console$/)
