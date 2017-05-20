import $ from 'jquery';
import { scrapeInfo, whenPageReady } from '../common/utils';

whenPageReady(() =>
  scrapeInfo('jenkinsHandler', () => {
    const testOutput = document.getElementsByClassName('console-output')[0]
      .textContent;
    console.log('Starting');
    let env = testOutput.match(/TEST_ENVIRONMENT=--env=(\S+)/)[1];
    const awsScreenshotsRegex = /\[gw(\d)\]\sFAILED\s(\S+)::(\S+:\S+).*\n(.*)/g;

    let tmpMatches;
    const reportResults = {};
    while ((tmpMatches = awsScreenshotsRegex.exec(testOutput))) {
      const [full, workerId, testPath, testName, awsLink] = tmpMatches;
      const fixedTestName = testName.replace('::', '.');
      reportResults[fixedTestName] = {
        workerId,
        awsLink
      };
    }

    const testNameAndScreenshotPath = /\n_+\s(\S+)\s_+\n/;
    const END_MARKER = '==== ';
    const FAILURES =
      '=================================== FAILURES ===================================';
    const tO = testOutput.slice(
      testOutput.indexOf(FAILURES) + FAILURES.length,
      testOutput.lastIndexOf(END_MARKER)
    );
    let testMatches = tO.split(testNameAndScreenshotPath);
    console.log(testMatches);
    testMatches.shift();
    let testsByName = [];
    while (testMatches.length) {
      const tmpTestName = testMatches.shift();
      const tmpTestOutput = testMatches.shift();
      testsByName.push({
        name: tmpTestName,
        output: tmpTestOutput
      });
    }
    const tests = testsByName.reduce((acc, el) => {
      const { name, output } = el;
      const testTmpDir = output.match(
        /Plan is to store test debug info in dir\s+(\S+)\s*\n/
      )[1];
      const screenshotRegex = /(?:Screenshot at\s<<\n)(\/tmp\/\S+)\n>>\n/g;
      const testScreenshots = [];
      let matches;
      while ((matches = screenshotRegex.exec(output))) {
        testScreenshots.push(matches[1]);
      }
      acc[name] = acc[name] || {};
      acc[name] = {
        ...acc[name],
        dir: testTmpDir,
        screenshots: testScreenshots
      };
      return acc;
    }, reportResults);

    if (Object.keys(reportResults).length > 0) {
      console.log('successfully got jenkins stuff');
      return {
        env,
        tests: Object.keys(reportResults).map(test => ({
          testName: test,
          ...reportResults[test]
        }))
      };
    } else {
      console.log('Failed to get jenkins stuff');
      return void 0;
    }
  })
);
