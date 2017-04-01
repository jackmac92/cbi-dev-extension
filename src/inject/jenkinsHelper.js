const getInfo = () => {

  const screenshotsFinder = () => {
    const testOutput = document.getElementsByClassName('console-output')[0].textContent
    console.log('Starting')
    let env = testOutput.match(/X_CBI_TEST_ENV=(\S+)/)[1]
    const testNameAndScreenshotPath = /\n_+\s(\S+)\s_+\n/
    const END_MARKER = '==== '
    const FAILURES = '=================================== FAILURES ==================================='
    const tO = testOutput.slice(testOutput.indexOf(FAILURES) + FAILURES.length, testOutput.lastIndexOf(END_MARKER))
    let testMatches = tO.split(testNameAndScreenshotPath)
    console.log(testMatches)
    testMatches.shift()
    let testsByName = []
    while (testMatches.length) {
      const tmpTestName = testMatches.shift()
      const tmpTestOutput = testMatches.shift()
      testsByName.push({
        name: tmpTestName,
        output: tmpTestOutput
      })
    }
    tests = testsByName.map( el => {
      const { name, output } = el
      const testTmpDir = output.match(/Plan is to store test debug info in dir\s+(\S+)\s*\n/)[1]
      const screenshotRegex = /(?:Screenshot at\s<<\n)(\/tmp\/\S+)\n>>\n/g
      let matches, testScreenshots = [];
      while (matches = screenshotRegex.exec(output)) {
        testScreenshots.push(matches[1])
      }
      return {
        testName: name,
        dir: testTmpDir,
        screenshots: testScreenshots
      }
    })

    const result = {
      env: env,
      tests: tests
    }
    if (tests.length > 0) {
      console.log('successfully got jenkins stuff')
      return result
    } else {
      console.log('Failed to get jenkins stuff')
      return void 0
    }
  }

  scrapeInfo('jenkinsHandler', screenshotsFinder)

}

whenPageReady(getInfo)
