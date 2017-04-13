module.exports = {
  "name": "jarvix",
  "version": "0.0.1",
  "manifest_version": 2,
  "description": "Automate common tasks for cbi dev teams",
  "icons": {
    "16": "icons/icon-bitty.png",
    "48": "icons/icon-small.png",
    "128": "icons/icon-large.png"
  },
  "default_locale": "en",
  "background": {
    "page": "background.html",
    "persistent": true
  },
  "permissions": [
    "contentSettings",
    "notifications",
    "contextMenus",
    "management",
    "cookies",
    "tabs"
  ],
  "browser_action": {
    "default_icon": "icons/icon-small.png",
    "default_title": "Jarvix"
  },
  "content_scripts": [
    {
      "matches": ["*://dev.test.cbinsights.com/*"],
      "js": ["/js/screenshotHelper.js"]
    },
    {
      "matches": ["*://jenkins.cbinsights.com/job/*/*/console*"],
      "js": ["/js/jenkinsHelper.js"]
    },
    {
      "matches": ["*://crucible.cbinsights.com/cru/*"],
      "js": ["/js/reviewHelper.js"]
    }
  ],
  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self';"
}
