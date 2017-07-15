module.exports = {
  permissions: [
    'webRequestBlocking',
    'contextMenus',
    'notifications',
    'management',
    'webRequest',
    'activeTab',
    'storage',
    '<all_urls>'
  ],
  content_security_policy:
    "script-src 'self' http://localhost:3004 https://localhost:3004 'unsafe-eval'; object-src 'self'; style-src * 'unsafe-inline' 'self' blob:; img-src * 'self' http://localhost:8080 data:;"
};
