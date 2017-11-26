const version = require('../package.json').version;
module.exports = {
	name: 'jarvix',
	version,
	manifest_version: 2,
	description: 'Automate common tasks for cbi dev teams',
	icons: {
		'16': 'icons/icon-bitty.png',
		'48': 'icons/icon-small.png',
		'128': 'icons/icon-large.png'
	},
	background: {
		scripts: [
			"browser-polyfill.js",
			"/js/background.bundle.js"
		],
	},
	permissions: [
		'contentSettings',
		'notifications',
		'contextMenus',
		'management',
		'cookies',
		'tabs'
	],
	browser_action: {
		default_icon: 'icons/icon-small.png',
		default_title: 'Jarvix'
	},
	content_scripts: [
		{
			matches: ['*://jenkins.cbinsights.com/job/*/*/console*'],
			js: ['/js/scripts/jenkinsHelper.bundle.js']
		},
		{
			matches: ['*://crucible.cbinsights.com/cru/*'],
			js: ['/js/scripts/reviewHelper.bundle.js']
		}
	],
	content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self';"
};
