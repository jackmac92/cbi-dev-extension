import $ from 'jquery';
import { scrapeInfo, whenPageReady } from '../common/utils'

const getInfo = () => {
  const infoFinder = () => {
    output = $("[ng-if='test.hasExtraInfo']").find(".ng-binding")[0].innerHTML
    matches = output.match(/(?:Screenshot at\s\n)(\/tmp\/\S+)/)
    screenshot = matches[matches.length - 1]
    env = $(".branch").text().split(' ')[0].split('/')[1]
    if (env !== undefined && screenshot !== undefined) {
      return {
        "screenshot": screenshot,
        "env": env
      }
    } else {
      return void 0
    }
  }

  scrapeInfo("screenshotHandler", infoFinder)
}
// window.addEventListener("hashchange", (event) => {})
whenPageReady(getInfo, /^http:\/\/dev\.test\.cbinsights\.com\/#\/test\/\d+$/)
